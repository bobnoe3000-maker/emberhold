import { $ as e, B as t, K as n, Mn as r, Nn as i, P as a, Q as o, R as s, Sn as c, St as l, T as u, a as d, at as f, c as p, d as m, et as h, f as g, fn as _, ft as v, hn as y, jn as b, k as x, l as S, mn as C, o as w, sn as T, u as E, y as D, yn as ee } from "./three.core-BsXWN4b8.js";
import { C as te, E as O, G as ne, O as re, T as k, U as A, W as ie, b as ae, x as j } from "./SmallProps-DjD8mkZ7.js";
import { a as M, c as N, f as P, l as oe, n as se, o as ce, r as le, s as F, t as ue, u as de } from "./math-Du_SWpiD.js";
import { r as fe } from "./ThawField-CelnRTY2.js";
import { D as pe, E as me, O as he, _ as ge, b as _e, c as ve, d as ye, f as be, g as xe, k as Se, l as Ce, p as we, s as Te, t as Ee, u as De, v as Oe, y as I } from "./engine-hlzvTIM_.js";
import { i as ke, n as Ae } from "./own-rp3p7qEo.js";
import { t as je } from "./AudioSystem-BdBMAIIL.js";
import { r as Me } from "./PixelCanvas-Dyge5vEE.js";
import { a as Ne, r as Pe } from "./PropSprites-C53o7wJi.js";
import { a as Fe, c as Ie, i as Le, o as Re, s as ze, t as Be } from "./CharacterSprites-Cc3aj-Z8.js";
import { t as Ve } from "./Particles-2ONW48aT.js";
import { a as He, c as Ue, d as We, i as Ge, l as Ke, o as qe, r as Je, s as Ye, u as Xe } from "./TileMap-DEgA4jsR.js";
import { a as Ze, i as Qe, l as $e, n as et, o as tt, r as nt } from "./Props-46nf18Wb.js";
import { T as rt, a as it, d as at, h as ot, n as st, o as ct, r as lt, s as ut, t as dt, u as ft, w as L, x as pt } from "./ObjectCatalog-CLBSNnc2.js";
import { H as mt, _t as ht } from "./core-C1cYbmwD.js";
import { i as gt, l as _t, n as vt, s as yt, t as bt, u as R } from "./I18n-BeKB4FMa.js";
import { f as xt } from "./minimap-CBFghrAn.js";
import { r as St } from "./LevelFormat-BJ0C9Ce4.js";
import { a as Ct, b as wt, c as Tt, d as Et, f as Dt, g as Ot, h as kt, i as At, l as jt, m as Mt, n as Nt, o as Pt, p as Ft, r as It, s as Lt, t as Rt, u as zt, v as Bt, x as Vt, y as Ht } from "./LevelLook-C3YksY85.js";
import { r as Ut, t as Wt } from "./LevelMap-037nvhSa.js";
import { r as Gt, t as Kt } from "./Travel-4-idrvN5.js";
import { a as qt, c as Jt, i as Yt, n as Xt, o as Zt, r as Qt, s as $t, t as en } from "./config-DDHWC9jm.js";
import { a as tn, i as nn, o as rn, r as an, s as on } from "./SnowCover-C2xaJrtx.js";
import { n as sn, r as cn, t as ln } from "./festival-DRJ-EDFG.js";
import { _ as un, a as dn, c as fn, d as pn, f as mn, g as hn, h as gn, i as _n, l as vn, m as yn, n as bn, o as xn, p as Sn, r as Cn, s as wn, t as Tn, u as En } from "./WeatherLook-DQB2IdmK.js";
import { a as z, i as Dn, n as On, r as B } from "./ContentText-nXIHgNO8.js";
import { n as kn } from "./dialogue-D_zYka2G.js";
import { n as An, t as jn } from "./GroundFrost-BXjaRT90.js";
import { t as Mn } from "./WardDome-BqvXqYBh.js";
import { t as Nn } from "./SpectralBlades-Ce40QHpR.js";
//#region src/engine/sprite/SpriteManager.js
var Pn = class {
	constructor(e) {
		this.name = "SpriteManager", this.camera = e, this._sprites = [], this._cursor = -1;
	}
	add(e) {
		return e && !this._sprites.includes(e) && this._sprites.push(e), e;
	}
	remove(e) {
		let t = this._sprites.indexOf(e);
		return t < 0 ? !1 : (this._sprites.splice(t, 1), t <= this._cursor && this._cursor--, !0);
	}
	get sprites() {
		return this._sprites;
	}
	update(e) {
		let t = this._sprites, n = this.camera;
		try {
			for (this._cursor = 0; this._cursor < t.length; this._cursor++) t[this._cursor].update(e, n);
		} finally {
			this._cursor = -1;
		}
	}
	dispose({ disposeSprites: e = !1 } = {}) {
		if (e) for (let e of this._sprites.slice()) e.dispose?.();
		this._sprites.length = 0;
	}
}, Fn = class {
	constructor({ capacity: e = 256 } = {}) {
		this.capacity = e, this.mesh = null, this.sprites = [], this._alpha = null;
	}
	adopt(e) {
		let t = e?.blob;
		return !t || this.sprites.includes(e) ? !1 : (this.mesh || this._create(t), t.layers.disable(0), this.sprites.push(e), !0);
	}
	release(e) {
		let t = this.sprites.indexOf(e);
		return t < 0 ? !1 : (this.sprites.splice(t, 1), e.blob?.layers.enable(0), !0);
	}
	update() {
		let e = this.mesh;
		if (!e) return;
		let t = this._alpha.array, n = 0;
		for (let r = 0; r < this.sprites.length && n < this.capacity; r++) {
			let i = this.sprites[r].blob;
			if (!i || !In(i)) continue;
			let a = i.material.opacity;
			a > .001 && (i.updateWorldMatrix(!0, !1), e.setMatrixAt(n, i.matrixWorld), t[n] = a, n++);
		}
		e.count = n, e.instanceMatrix.needsUpdate = !0, this._alpha.needsUpdate = !0;
	}
	dispose() {
		for (let e of this.sprites) e.blob?.layers.enable(0);
		this.sprites.length = 0, this.mesh &&= (this.mesh.removeFromParent(), this.mesh.geometry.dispose(), this.mesh.material.dispose(), this.mesh.dispose?.(), null);
	}
	_create(e) {
		let n = e.material, r = e.geometry.clone();
		this._alpha = new s(new Float32Array(this.capacity), 1), this._alpha.setUsage(u), r.setAttribute("aBlobAlpha", this._alpha);
		let i = new h({
			color: n.color.clone(),
			map: n.map,
			transparent: !0,
			opacity: 1,
			depthWrite: !1,
			polygonOffset: n.polygonOffset,
			polygonOffsetFactor: n.polygonOffsetFactor,
			polygonOffsetUnits: n.polygonOffsetUnits,
			fog: n.fog
		});
		i.name = "luminati:blob-batch", i.onBeforeCompile = (e) => {
			e.vertexShader = e.vertexShader.replace("#include <common>", "#include <common>\nattribute float aBlobAlpha;\nvarying float vBlobAlpha;").replace("#include <begin_vertex>", "#include <begin_vertex>\n	vBlobAlpha = aBlobAlpha;"), e.fragmentShader = e.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vBlobAlpha;").replace("#include <alphamap_fragment>", "#include <alphamap_fragment>\n	diffuseColor.a *= vBlobAlpha;");
		}, i.customProgramCacheKey = () => "luminati-blob-batch";
		let a = new t(r, i, this.capacity);
		a.name = "BlobBatch", a.instanceMatrix.setUsage(u), a.count = 0, a.renderOrder = e.renderOrder, a.castShadow = !1, a.receiveShadow = !1, a.frustumCulled = !1, a.matrixAutoUpdate = !1, this.mesh = a;
	}
};
function In(e) {
	for (let t = e; t; t = t.parent) {
		if (!t.visible) return !1;
		if (t.isScene) return !0;
	}
	return !1;
}
//#endregion
//#region src/game/Scenery.js
var V = new r(), Ln = [
	"position",
	"aCenter",
	"aSway",
	"aPhase"
];
function* Rn(t, { name: n = "trees", castShadow: r = !0, maxTriangles: i = Infinity, maxExtent: o = Infinity, minTriangles: s = 0, tags: c = null } = {}) {
	let l = /* @__PURE__ */ new Map(), u = !!c?.size, d = [];
	for (let e of t) {
		let t = e.object, n = u ? c.get(e) ?? null : null;
		t.updateWorldMatrix(!0, !0);
		let i = N(Math.round(t.position.x * 7), Math.round(t.position.z * 7), 3) * Math.PI * 2;
		t.traverse((e) => {
			if (!e.isMesh || Array.isArray(e.material)) return;
			let a = e.material, o = r && e.castShadow, s = `${a.uuid}|${+o}|${+e.receiveShadow}`, c = l.get(s);
			c || (c = {
				material: a,
				castShadow: o,
				receiveShadow: e.receiveShadow,
				depth: e.customDepthMaterial,
				geos: [],
				pos: [],
				tags: []
			}, l.set(s, c));
			let u = e.geometry, d = u.clone(), f = e.matrixWorld;
			d.applyMatrix4(f);
			let p = d.getAttribute("aCenter");
			if (p) {
				let e = u.getAttribute("aCenter"), t = u.getAttribute("position"), n = d.getAttribute("position"), r = f.elements, i = Math.hypot(r[0], r[1], r[2]);
				for (let r = 0; r < p.count; r++) V.fromBufferAttribute(e, r).applyMatrix4(f), p.setXYZ(r, V.x, V.y, V.z), n.setXYZ(r, V.x + (t.getX(r) - e.getX(r)) * i, V.y + (t.getY(r) - e.getY(r)) * i, V.z + (t.getZ(r) - e.getZ(r)) * i);
			}
			let m = d.getAttribute("aPhase");
			if (m) for (let e = 0; e < m.count; e++) m.setX(e, m.getX(e) + i);
			c.geos.push(d), c.pos.push([t.position.x, t.position.z]), c.tags.push(n);
		}), e.dispose?.(), yield;
	}
	let f = new a();
	f.name = n;
	let p = [];
	for (let t of l.values()) {
		let r = t.geos.map((e, t) => t), a = Number.isFinite(i) || Number.isFinite(o) ? qe(r, {
			x: (e) => t.pos[e][0],
			z: (e) => t.pos[e][1],
			weight: (e) => Ke(t.geos[e]),
			maxWeight: i,
			maxExtent: o,
			minWeight: s
		}) : [r];
		u && (a = a.map((e) => He(e, (e) => t.tags[e])));
		for (let r = 0; r < a.length; r++) {
			let i = a[r], o = We(i.map((e) => t.geos[e]), !1);
			if (!o) continue;
			u && d.push(...Ue(o, i.map((e) => t.geos[e].attributes.position.count), i.map((e) => t.tags[e]), Ln)), o.computeBoundingSphere(), o.computeBoundingBox(), o.boundingSphere.radius += 1.8, o.boundingBox.expandByScalar(1.8);
			let s = new e(o, t.material);
			s.name = `${n}:${t.material.name || "mat"}${a.length > 1 ? `#${r}` : ""}`, s.castShadow = t.castShadow, s.receiveShadow = t.receiveShadow, t.depth && (s.customDepthMaterial = t.depth), s.matrixAutoUpdate = !1, f.add(s), p.push(s), yield;
		}
		for (let e of t.geos) e.dispose();
	}
	return {
		object: f,
		meshes: p,
		ranges: d,
		dispose() {
			for (let e of p) e.geometry.dispose();
			f.removeFromParent();
		}
	};
}
var zn = Object.freeze([
	"oak",
	"pine",
	"birch",
	"autumn",
	"blossom",
	"maple",
	"goldbirch",
	"snowpine",
	"bare"
]), Bn = /* @__PURE__ */ new Set(["pine", "snowpine"]);
function Vn(e) {
	let t = e?.forest && typeof e.forest == "object" && Array.isArray(e.forest.areas) ? e.forest.areas : [], n = [];
	for (let e of t) {
		if (!e || typeof e != "object" || ![
			"minX",
			"maxX",
			"minZ",
			"maxZ"
		].every((t) => Number.isFinite(e[t]))) continue;
		let t = e.kinds && typeof e.kinds == "object" ? e.kinds : {}, r = zn.map((e) => [e, Number.isFinite(t[e]) && t[e] > 0 ? t[e] : 0]).filter(([, e]) => e > 0), i = r.reduce((e, [, t]) => e + t, 0);
		if (!(i > 0)) continue;
		let a = 0, o = r.map(([e, t]) => [e, a += t / i]);
		n.push({
			minX: e.minX,
			maxX: e.maxX,
			minZ: e.minZ,
			maxZ: e.maxZ,
			cumulative: o
		});
	}
	return n;
}
function* Hn({ tileMap: e, heightAt: t, seed: n = 77, avoid: r = [], southGap: i = 0, kindAreas: a = [], climate: o = null, season: s = null }) {
	if (o === "arid") return yield* qn({
		tileMap: e,
		heightAt: t,
		seed: n,
		avoid: r,
		southGap: i
	});
	let c = s ? te()?.SEASON_LAND : null, l = c && Object.hasOwn(c.mix, s) ? c.mix[s] : null, u = e.width, d = e.depth, f = new le(n), p = [], m = [], h = [], g = 1.35, _ = /* @__PURE__ */ new Map(), v = (e, t) => `${Math.floor(e / g)},${Math.floor(t / g)}`, y = (e, t, n) => {
		let i = Math.floor(e / g), a = Math.floor(t / g);
		for (let r = -2; r <= 2; r++) for (let o = -2; o <= 2; o++) {
			let s = _.get(`${i + o},${a + r}`);
			if (s) {
				for (let r of s) if ((r.x - e) ** 2 + (r.z - t) ** 2 < (r.r + n) ** 2) return !1;
			}
		}
		for (let i of r) if ((i.x - e) ** 2 + (i.z - t) ** 2 < (i.r + n) ** 2) return !1;
		return !0;
	}, b = (e, t, n) => {
		let r = {
			x: e,
			z: t,
			r: n
		};
		h.push(r);
		let i = v(e, t), a = _.get(i);
		a || _.set(i, a = []), a.push(r);
	}, x = (e, t, r) => {
		for (let n = 0; n < a.length; n++) {
			let i = a[n];
			if (!(e < i.minX || e >= i.maxX || t < i.minZ || t >= i.maxZ)) {
				for (let [e, t] of i.cumulative) if (r < t) return e;
				return i.cumulative[i.cumulative.length - 1][0];
			}
		}
		let i = t < 6, o = e > u * .72 && t > 8, s = F(e * .09, t * .09, {
			seed: n + 5,
			octaves: 2
		});
		if (l) {
			let e = i ? l.north : s > .55 ? l.dense : l.open;
			for (let [t, n] of e) if (r < n) return t;
			return e[e.length - 1][0];
		}
		return i ? r < .5 ? "pine" : r < .82 ? "oak" : "birch" : o ? r < .5 ? "autumn" : r < .78 ? "oak" : r < .9 ? "pine" : "birch" : s > .55 ? r < .6 ? "pine" : "oak" : r < .62 ? "oak" : r < .82 ? "pine" : r < .93 ? "birch" : "autumn";
	}, S = (e, t, n) => {
		if (n.char !== "T" || t >= d - 3) return;
		let r = t < 3 ? 1 : 2, i = t >= 9 ? Math.min(e, u - 1 - e) : -1;
		for (let a = 0; a < r; a++) {
			let r = e + f.range(.1, .9), a = t + f.range(.1, .9), o = f.range(.85, 1.25);
			if (!y(r, a, o)) continue;
			let s = x(r, a, f.next()), c = (Bn.has(s) ? 5.4 : s === "birch" || s === "goldbirch" ? 5.2 : 5) * f.range(.85, 1.25) * (i === 1 ? .8 : 1);
			i !== 2 && (b(r, a, o), p.push([
				s,
				r,
				n.h,
				a,
				c
			]));
		}
	};
	for (let t = 0; t < d; t++) {
		for (let n = 0; n < u; n++) {
			let r = e.tileAt(n, t);
			r && S(n, t, r);
		}
		yield;
	}
	let C = Wn(e, Un);
	for (let e = 0; e < 5200; e++) {
		e % 400 == 399 && (yield);
		let r = f.range(-34, u + 34), a = f.range(-44, d + 20.4), o = Math.max(0, -r, r - u), s = Math.max(0, -a, a - d), c = Math.hypot(o, s);
		if (c < .6 || i > 0 && a > d && a < d + i || c < Un && C?.(r, a)) continue;
		let l = F(r * .075 + 11, a * .075 - 4, {
			seed: n + 2,
			octaves: 3
		}), p = 1 - P(4, 30, c), h = M((l - .42) * 2.6 + p * (a < 0 ? .35 : .75), 0, 1) * (1 - P(24, 34, c) * .85);
		if (f.next() > h) continue;
		let g = f.range(.95, 1.5);
		if (!y(r, a, g)) continue;
		b(r, a, g);
		let _ = x(r, a, f.next()), v = Bn.has(_) ? 5.8 : 5.2;
		m.push([
			_,
			r,
			t(r, a),
			a,
			v * f.range(.85, 1.35)
		]);
	}
	return {
		border: p,
		outer: m
	};
}
var Un = 2.5;
function Wn(e, t) {
	let n = e.width, r = e.depth, i = (t, n) => {
		let r = e.tileAt(t, n);
		return !!r && !r.water && !r.type?.void && (r.type?.walkable ?? !0) !== !1;
	}, a = /* @__PURE__ */ new Set(), o = (e, t) => {
		let r = [];
		for (let o = 0; o <= e; o++) {
			let s = o < e ? t(o) : null;
			if (s && i(s[0], s[1])) {
				r.push(s);
				continue;
			}
			if (r.length >= 3) for (let [e, t] of r) a.add(t * n + e);
			r = [];
		}
	};
	return o(n, (e) => [e, 0]), o(n, (e) => [e, r - 1]), o(r, (e) => [0, e]), o(r, (e) => [n - 1, e]), a.size ? (e, i) => {
		let o = Math.max(0, Math.floor(e - t)), s = Math.min(n - 1, Math.floor(e + t)), c = Math.max(0, Math.floor(i - t)), l = Math.min(r - 1, Math.floor(i + t));
		for (let r = c; r <= l; r++) for (let c = o; c <= s; c++) {
			if (!a.has(r * n + c)) continue;
			let o = Math.max(0, c - e, e - (c + 1)), s = Math.max(0, r - i, i - (r + 1));
			if (o * o + s * s < t * t) return !0;
		}
		return !1;
	} : null;
}
var Gn = {
	juniper: 3.4,
	deadwood: 4,
	crag: 3.4
};
function Kn(e) {
	return e === "basalt" || e === "ash" || e === "scorched" ? "basalt" : e === "red_sand" || e === "redrock" ? "redrock" : "sandstone";
}
function* qn({ tileMap: e, heightAt: t, seed: n, avoid: r, southGap: i }) {
	let a = e.width, o = e.depth, s = new le(n + 4111), c = [], l = [], u = 1.35, d = /* @__PURE__ */ new Map(), f = (e, t, n) => {
		let i = Math.floor(e / u), a = Math.floor(t / u);
		for (let r = -2; r <= 2; r++) for (let o = -2; o <= 2; o++) {
			let s = d.get(`${i + o},${a + r}`);
			if (s) {
				for (let r of s) if ((r.x - e) ** 2 + (r.z - t) ** 2 < (r.r + n) ** 2) return !1;
			}
		}
		for (let i of r) if ((i.x - e) ** 2 + (i.z - t) ** 2 < (i.r + n) ** 2) return !1;
		return !0;
	}, p = (e, t, n) => {
		let r = `${Math.floor(e / u)},${Math.floor(t / u)}`, i = d.get(r);
		i || d.set(r, i = []), i.push({
			x: e,
			z: t,
			r: n
		});
	}, m = (e, t) => e ? t < .24 ? "crag" : t < .6 ? "deadwood" : "juniper" : t < .56 ? "juniper" : t < .82 ? "deadwood" : "crag", h = (e, t, n, r, i, a) => [
		e === "crag" ? `crag:${t}` : e,
		n,
		r,
		i,
		Gn[e] * a
	];
	for (let t = 0; t < o; t++) {
		for (let n = 0; n < a; n++) {
			let r = e.tileAt(n, t);
			if (!r || r.char !== "T" || t >= o - 3) continue;
			let i = t >= 9 ? Math.min(n, a - 1 - n) : -1, l = t < 3 ? 1 : 2;
			for (let e = 0; e < l; e++) {
				let e = n + s.range(.1, .9), a = t + s.range(.1, .9), o = s.range(.95, 1.4), l = s.next(), u = s.range(.7, 1.35) * (i === 1 ? .78 : 1);
				i === 2 || l > .72 || !f(e, a, o) || (p(e, a, o), c.push(h(m(t < 6, s.next()), Kn(r.type.top), e, r.h, a, u)));
			}
		}
		yield;
	}
	let g = Wn(e, Un);
	for (let e = 0; e < 5200; e++) {
		e % 400 == 399 && (yield);
		let r = s.range(-34, a + 34), c = s.range(-44, o + 20.4), u = Math.max(0, -r, r - a), d = Math.max(0, -c, c - o), _ = Math.hypot(u, d);
		if (_ < .6 || i > 0 && c > o && c < o + i || _ < Un && g?.(r, c)) continue;
		let v = F(r * .08 + 31, c * .08 - 9, {
			seed: n + 3,
			octaves: 3
		}), y = 1 - P(4, 30, _), b = M((v - .48) * 2.2 + y * .35, 0, 1) * .42 * (1 - P(22, 34, _) * .85);
		if (s.next() > b) continue;
		let x = s.range(1.1, 1.7), S = t(r, c), C = m(c < 0, s.next()), w = s.range(.85, 1.4);
		if (c < -5 && S > t(r, -1) + 3 && C !== "crag" || !f(r, c, x)) continue;
		p(r, c, x);
		let T = F(r * .05, c * .05, {
			seed: n + 6,
			octaves: 2
		}) > .58 ? "redrock" : "sandstone";
		l.push(h(C, T, r, S, c, w));
	}
	return {
		border: c,
		outer: l
	};
}
function Jn(e, [t, n, r, i, a]) {
	return t.startsWith("crag:") ? e.crag(n, r, i, {
		kind: "spire",
		stone: t.slice(5),
		height: a,
		width: M(a * .42, 1, 2.2)
	}) : e.tree(n, r, i, {
		kind: t,
		height: a,
		fallenLeaves: !1
	});
}
function Yn(e, { climate: t = null, season: n = null } = {}) {
	let r = t === "arid", i = n ? te()?.SEASON_LAND : null, a = e.width, o = e.depth, s = (t, n) => {
		let r = -Infinity;
		for (let i of [-.5, .5]) for (let s of [-.5, .5]) {
			let c = M(Math.floor(t + i), 0, a - 1), l = M(Math.floor(n + s), 0, o - 1), u = e.tileAt(c, l);
			if (!u) continue;
			let d = u.water ? Math.max(u.h, .5) : u.h;
			d > r && (r = d);
		}
		return Number.isFinite(r) ? r : 0;
	};
	return (t, c) => {
		let l = M(t, 0, a), u = M(c, 0, o), d = t - l, f = c - u, p = Math.hypot(d, f), m = s(l, u) - .04;
		if (p < 1e-6) return m;
		let h = (F(t * .05, c * .05, {
			seed: 91,
			octaves: 3
		}) - .5) * 3.2, g = P(0, 10, p), _ = m + h * g;
		if (r) return Math.max(_ + Zn(t, c, a, o), m - .6 * g);
		let v = P(2, -30, c);
		_ += v * (P(0, 40, -c) * 7 + F(t * .03, c * .04, {
			seed: 17,
			octaves: 4
		}) * 9 * P(-6, -40, c));
		let y = P(-55, -120, c);
		_ += y * (18 + F(t * .018, 3.1, {
			seed: 23,
			octaves: 4
		}) * 34);
		let b = P(18, 90, Math.max(-t, t - a, c - o));
		return _ += b * (4 + F(t * .02, c * .02, {
			seed: 29,
			octaves: 3
		}) * 14), i && (_ += i.relief(n, e, t, c, l, u, p, v, y)), Math.max(_, m - .6 * g);
	};
}
var Xn = (e, t, n, r = 4) => 1 - Math.abs(F(e, t, {
	seed: n,
	octaves: r
}) * 2 - 1);
function Zn(e, t, n, r) {
	let i = 0, a = P(2, -30, t), o = (P(0, 36, -t) * 9 + Xn(e * .035, t * .045, 17) * 12 * P(-6, -40, t)) / 3, s = Math.floor(o);
	i += a * (s + P(.6, .95, o - s)) * 3;
	let c = P(-46, -100, t);
	i += c * (24 + Xn(e * .016, t * .022 + 4.1, 23, 5) * 62);
	let l = P(16, 70, Math.max(-e, e - n, t - r)), u = F(e * .024, t * .024, {
		seed: 29,
		octaves: 3
	}) * 4, d = Math.floor(u);
	return i += l * (3 + (d + P(.72, .98, u - d)) * 6.5), i;
}
function* Qn(e, t, n) {
	let i = e.index, a = e.getAttribute("position"), o = new d(new Float32Array(a.count * 3), 3);
	e.setAttribute("normal", o);
	let s = new r(), c = new r(), l = new r(), u = new r(), f = new r(), p = new r(), m = new r(), h = new r(), g = 0;
	for (let e = 0, n = i.count; e < n; e += 3) {
		let n = i.getX(e), r = i.getX(e + 1), d = i.getX(e + 2);
		s.fromBufferAttribute(a, n), c.fromBufferAttribute(a, r), l.fromBufferAttribute(a, d), m.subVectors(l, c), h.subVectors(s, c), m.cross(h), u.fromBufferAttribute(o, n), f.fromBufferAttribute(o, r), p.fromBufferAttribute(o, d), u.add(m), f.add(m), p.add(m), o.setXYZ(n, u.x, u.y, u.z), o.setXYZ(r, f.x, f.y, f.z), o.setXYZ(d, p.x, p.y, p.z), ++g === t && (g = 0, yield);
	}
	yield;
	for (let e = 0, t = o.count; e < t; e++) V.fromBufferAttribute(o, e).normalize(), o.setXYZ(e, V.x, V.y, V.z), e % n === n - 1 && (yield);
	o.needsUpdate = !0;
}
function* $n({ textures: t, tileMap: n, heightAt: r, extent: i = 170, rowsPerStep: a = 12, climate: o = null, season: s = null }) {
	let c = o === "arid", l = !c && s ? te()?.SEASON_LAND : null, u = l && Object.hasOwn(l.outer, s) ? l.outer[s] : null, f = n.width, p = n.depth, m = (e, t) => {
		let n = /* @__PURE__ */ new Set();
		for (let t = e - i; t < e - 40; t += 10) n.add(t);
		for (let t = e - 40; t < e - 16; t += 2) n.add(t);
		for (let r = e - 16; r <= t + 16; r += 1) n.add(r);
		for (let e = t + 16; e <= t + 40; e += 2) n.add(e);
		for (let e = t + 40; e <= t + i; e += 10) n.add(e);
		return [...n].sort((e, t) => e - t);
	}, h = m(0, f), _ = m(0, p), v = h.length, y = _.length, b = new Float32Array(v * y * 3), x = new Float32Array(v * y * 2), S = new Float32Array(v * y * 3), C = new Float32Array(v * y);
	for (let e = 0; e < y; e++) {
		for (let t = 0; t < v; t++) {
			let n = h[t], i = _[e];
			C[e * v + t] = r(n, i);
		}
		e % a === a - 1 && (yield);
	}
	let T = u ? u[0] : c ? "arid_dirt" : "grass_dark", E = t.meta(T).units, D = new g(), ee = new g(1, 1, 1), O = u ? new g(...u[1]) : c ? new g(1.04, .96, .88) : new g(.78, .86, .72), ne = u ? new g(...u[2]) : c ? new g(1.02, .74, .6) : new g(.62, .6, .66), re = new g(.92, .86, .84);
	for (let e = 0; e < y; e++) {
		for (let t = 0; t < v; t++) {
			let n = e * v + t, r = h[t], i = _[e], a = C[n];
			b[n * 3] = r, b[n * 3 + 1] = a, b[n * 3 + 2] = i, x[n * 2] = r / E[0], x[n * 2 + 1] = -i / E[1];
			let o = C[e * v + Math.max(0, t - 1)], s = C[e * v + Math.min(v - 1, t + 1)], l = C[Math.max(0, e - 1) * v + t], d = C[Math.min(y - 1, e + 1) * v + t], m = (s - o) / Math.max(.001, h[Math.min(v - 1, t + 1)] - h[Math.max(0, t - 1)]), g = (d - l) / Math.max(.001, _[Math.min(y - 1, e + 1)] - _[Math.max(0, e - 1)]), w = Math.hypot(m, g), T = Math.max(0, -r, r - f), te = Math.max(0, -i, i - p), k = Math.hypot(T, te);
			D.copy(ee).lerp(O, P(20, 80, k)).lerp(ne, P(.55, 1.2, w)), c && D.lerp(re, P(26, 60, a));
			let A = de(u ? u[3] : c ? .8 : .62, 1, P(0, 14, k)) * (.9 + .2 * F(r * .11, i * .11, {
				seed: 4,
				octaves: 2
			}));
			S[n * 3] = D.r * A, S[n * 3 + 1] = D.g * A, S[n * 3 + 2] = D.b * A;
		}
		e % a === a - 1 && (yield);
	}
	let k = (e, t) => e > 0 && e < t, A = 0;
	for (let e = 0; e < v - 1; e++) k((h[e] + h[e + 1]) / 2, f) && A++;
	let ie = 0;
	for (let e = 0; e < y - 1; e++) k((_[e] + _[e + 1]) / 2, p) && ie++;
	let ae = (v - 1) * (y - 1) - A * ie, j = v * y - 1 >= 65535 ? new Uint32Array(ae * 6) : new Uint16Array(ae * 6), M = 0;
	for (let e = 0; e < y - 1; e++) {
		let t = k((_[e] + _[e + 1]) / 2, p);
		for (let n = 0; n < v - 1; n++) {
			if (t && k((h[n] + h[n + 1]) / 2, f)) continue;
			let r = e * v + n, i = r + 1, a = r + v, o = a + 1;
			j[M++] = r, j[M++] = a, j[M++] = i, j[M++] = i, j[M++] = a, j[M++] = o;
		}
		e % a === a - 1 && (yield);
	}
	let N = new w();
	N.setAttribute("position", new d(b, 3)), N.setAttribute("uv", new d(x, 2)), N.setAttribute("color", new d(S, 3)), N.setIndex(new d(j, 1)), yield, yield* Qn(N, a * (v - 1) * 2, a * v), N.computeBoundingSphere();
	let oe = t.material(T, {
		vertexColors: !0,
		normalScale: .35
	}), se = new e(N, oe);
	return se.name = "OuterGround", se.receiveShadow = !0, se.castShadow = !1, se.matrixAutoUpdate = !1, se.updateMatrix(), se;
}
//#endregion
//#region src/game/Climate.js
var er = Object.freeze([
	{
		t: 0,
		name: "night",
		top: "#04071a",
		horizon: "#2e2442",
		bottom: "#0b0c24",
		sun: "#7c96f2",
		sunI: 1,
		hemiSky: "#3654bc",
		hemiGround: "#251c2c",
		hemiI: 1.58,
		fog: .0098,
		exp: 1.36,
		night: 1,
		moon: 1,
		shadow: .6,
		glow: .45,
		clouds: .12
	},
	{
		t: 4.3,
		name: "late night",
		top: "#060a20",
		horizon: "#33284a",
		bottom: "#0d0e2a",
		sun: "#809af2",
		sunI: .9,
		hemiSky: "#3654bc",
		hemiGround: "#261c2e",
		hemiI: 1.52,
		fog: .0102,
		exp: 1.36,
		night: 1,
		moon: 1,
		shadow: .58,
		glow: .5,
		clouds: .14
	},
	{
		t: 5.25,
		name: "pre-dawn",
		top: "#181a46",
		horizon: "#7a5874",
		bottom: "#2a2244",
		sun: "#a6a2e2",
		sunI: .18,
		hemiSky: "#5a5ea6",
		hemiGround: "#2c2030",
		hemiI: 1.05,
		fog: .0125,
		exp: 1.26,
		night: .86,
		moon: 1,
		shadow: .35,
		glow: .85,
		clouds: .2
	},
	{
		t: 6.1,
		name: "pink dawn",
		top: "#3a4a94",
		horizon: "#f7a27a",
		bottom: "#8e6488",
		sun: "#ff8456",
		sunI: 2.4,
		hemiSky: "#9c86cc",
		hemiGround: "#7a4c3c",
		hemiI: 1,
		fog: .0118,
		exp: 1.08,
		night: .3,
		moon: 0,
		shadow: .85,
		glow: 1.05,
		clouds: .2
	},
	{
		t: 6.9,
		name: "sunrise",
		top: "#4c72c0",
		horizon: "#fbc694",
		bottom: "#a8869a",
		sun: "#ffbe84",
		sunI: 3,
		hemiSky: "#9cb0de",
		hemiGround: "#7e5a40",
		hemiI: 1.05,
		fog: .0118,
		exp: 1.05,
		night: .06,
		moon: 0,
		shadow: .95,
		glow: 1,
		clouds: .18
	},
	{
		t: 8,
		name: "morning",
		top: "#5488d2",
		horizon: "#ecdcc2",
		bottom: "#c2aa8c",
		sun: "#fff0d2",
		sunI: 3.5,
		hemiSky: "#a6c0e6",
		hemiGround: "#94704c",
		hemiI: 1.05,
		fog: .0104,
		exp: 1,
		night: 0,
		moon: 0,
		shadow: 1,
		glow: .8,
		clouds: .15
	},
	{
		t: 12.2,
		name: "noon",
		top: "#5a94de",
		horizon: "#e8e2d2",
		bottom: "#cab494",
		sun: "#fffaf0",
		sunI: 3.9,
		hemiSky: "#b2cae8",
		hemiGround: "#a08058",
		hemiI: 1.02,
		fog: .0102,
		exp: .95,
		night: 0,
		moon: 0,
		shadow: 1,
		glow: .6,
		clouds: .12
	},
	{
		t: 15.3,
		name: "afternoon",
		top: "#5a8cd8",
		horizon: "#ecdcbe",
		bottom: "#c2a688",
		sun: "#ffe8c0",
		sunI: 3.9,
		hemiSky: "#a6bce6",
		hemiGround: "#9a7450",
		hemiI: 1.06,
		fog: .0104,
		exp: .98,
		night: 0,
		moon: 0,
		shadow: 1,
		glow: .8,
		clouds: .15
	},
	{
		t: 17.2,
		name: "golden hour",
		top: "#46448e",
		horizon: "#f8a066",
		bottom: "#a8626e",
		sun: "#ffb468",
		sunI: 5.1,
		hemiSky: "#7276d4",
		hemiGround: "#8c6656",
		hemiI: 1.9,
		fog: .0104,
		exp: 1.12,
		night: 0,
		moon: 0,
		shadow: 1,
		glow: 1.2,
		clouds: .22
	},
	{
		t: 18.45,
		name: "sunset",
		top: "#2c2466",
		horizon: "#f2704c",
		bottom: "#6a2e5c",
		sun: "#ff7040",
		sunI: 3.2,
		hemiSky: "#6a58c0",
		hemiGround: "#4e2c3c",
		hemiI: 1.45,
		fog: .0112,
		exp: 1.2,
		night: .22,
		moon: 0,
		shadow: .85,
		glow: 1.35,
		clouds: .25
	},
	{
		t: 19.25,
		name: "purple dusk",
		top: "#1a184e",
		horizon: "#9a5878",
		bottom: "#2c1c46",
		sun: "#c47a9e",
		sunI: .85,
		hemiSky: "#4c4ca6",
		hemiGround: "#2c1c32",
		hemiI: 1.62,
		fog: .0122,
		exp: 1.46,
		night: .62,
		moon: 0,
		shadow: .5,
		glow: .95,
		clouds: .22
	},
	{
		t: 20.05,
		name: "blue hour",
		top: "#0a1040",
		horizon: "#3c3478",
		bottom: "#12163c",
		sun: "#7290f2",
		sunI: .42,
		hemiSky: "#304cae",
		hemiGround: "#1c1630",
		hemiI: 1.5,
		fog: .0116,
		exp: 1.36,
		night: .92,
		moon: 1,
		shadow: .5,
		glow: .55,
		clouds: .15
	},
	{
		t: 21.4,
		name: "night",
		top: "#050a20",
		horizon: "#30264a",
		bottom: "#0b0e28",
		sun: "#7a96f2",
		sunI: 1,
		hemiSky: "#3654bc",
		hemiGround: "#251c2c",
		hemiI: 1.58,
		fog: .0098,
		exp: 1.36,
		night: 1,
		moon: 1,
		shadow: .6,
		glow: .45,
		clouds: .12
	}
]);
function tr(e) {
	return Pt(e) === "arid" ? {
		count: 190,
		size: [.06, .14],
		color: "#ffd596",
		windInfluence: .45,
		velocity: [
			.1,
			.04,
			.03
		],
		velocityVariance: [
			.09,
			.05,
			.09
		],
		hdr: 1.1,
		alpha: .75
	} : {};
}
var nr = /* @__PURE__ */ new WeakMap(), rr = /* @__PURE__ */ new WeakMap(), ir = null, ar = null;
function or() {
	return ar ??= import("./SeasonLook-DUZAkezu.js").then((e) => ir = e, (e) => {
		throw ar = null, e;
	});
}
function sr() {
	return ir ? null : ar;
}
function cr(e, t, n = null) {
	let r = t ?? (n && ir ? n : null);
	if ((rr.get(e) ?? null) === r) return !1;
	nr.has(e) || nr.set(e, e.keyframes);
	let i = nr.get(e);
	return e.setKeyframes(r === "arid" ? er.map((e) => ({ ...e })) : r ? ir.seasonKeyframes(i, r) : i), rr.set(e, r), !0;
}
function lr(e, t) {
	let n = Ft(t);
	if (cr(e.lighting, Pt(t), n), e.season = null, e.lighting.sky.uniforms.uAurora.value = 0, xt(null), !n && !(At(t) > 0)) return;
	let r = () => {
		e.env === t && (cr(e.lighting, Pt(t), n), e.season = ir.createSeason(e));
	};
	ir ? r() : or().then(r, (e) => console.warn("[Luminati] the season look did not load:", e));
}
//#endregion
//#region src/game/AudioDirector.js
var ur = {
	blaze: [1, 1],
	bonfire: [.85, 1],
	brazier: [0, .6],
	embers: [0, .35]
}, dr = .45;
function fr(e, t = null) {
	let n = e.opts && typeof e.opts == "object" ? e.opts : {}, r = Number(e.x), i = Number(e.z);
	if (!Number.isFinite(r) || !Number.isFinite(i)) return null;
	if (e.type === "fire") {
		let [e, a] = ke(ur, typeof n.kind == "string" ? n.kind : "blaze") ?? ur.blaze, o = M(Number.isFinite(Number(n.size)) ? Number(n.size) : 1.5, .2, 6);
		return {
			x: r,
			z: i,
			roar: e * M(o / 1.5, .3, 3),
			crackle: a,
			group: t
		};
	}
	if (e.type === "house") {
		let e = M(Number(n.burning) || 0, 0, 1);
		return e > 0 ? {
			x: r,
			z: i,
			roar: 2.2 * e,
			crackle: e,
			group: t
		} : null;
	}
	return null;
}
var pr = class e {
	constructor({ audio: e, lighting: t, weather: n, tileMap: r, fires: i = [], falls: a = [], blazes: o = [], npcs: s = [], focus: c = null, env: l = null }) {
		this.audio = e, this.lighting = t, this.weather = n, this.fires = i, this.falls = a, this.blazes = o, this.npcs = s, this.focus = c, this.env = l, this.enabled = !1, this._timer = 0;
		let u = [];
		r.forEachTile((e, t, n) => {
			n.water && u.push(e + .5, t + .5);
		}), this.waterXZ = Float32Array.from(u), this.levels = {
			wind: 0,
			birds: 0,
			crickets: 0,
			fire: 0,
			water: 0,
			crowd: 0,
			blaze: 0
		}, this.combatIntensity = 0;
	}
	static nearest(e, t) {
		let n = Infinity;
		for (let r = 0; r < e.length; r++) {
			let i = e[r], a = (i.x - t.x) ** 2 + (i.z - t.z) ** 2;
			a < n && (n = a);
		}
		return Math.sqrt(n);
	}
	compute(t) {
		let n = this.lighting.nightFactor, r = this.weather.factor("rain"), i = this.weather.factor("snow"), a = M(r + i), o = e.nearest(this.fires, t), s = Infinity, c = this.waterXZ, l = t.x, u = t.z;
		for (let e = 0; e < c.length; e += 2) {
			let t = c[e] - l, n = c[e + 1] - u, r = t * t + n * n;
			r < s && (s = r);
		}
		s = Math.sqrt(s);
		let d = e.nearest(this.falls, t), f = this.levels;
		f.wind = M(.28 + .12 * (t.y > 3) + a * .55), f.birds = M((1 - n) * (1 - a * .85) * .75), this.combatIntensity > 0 && (f.birds *= 1 - .8 * M(this.combatIntensity)), f.crickets = M(P(.35, .9, n) * (1 - a) * .8), f.fire = M((1 - P(2, 15, o)) ** 1.5 * .9), f.water = M(Math.max((1 - P(1, 11, s)) * .55, (1 - P(3, 20, d)) * .95)), this._computeSiege(this.focus ?? t);
		let p = this.env?.();
		return (p?.frost || p?.season) && this.audio.evPack?.direct(this, t, f), f;
	}
	_computeSiege(e) {
		let t = this.levels, n = 0;
		for (let t of this.npcs) {
			let r = t.panicking ? 1 : t.cowering ? dr : 0;
			if (!r) continue;
			let i = Math.hypot(t.position.x - e.x, t.position.z - e.z);
			n += r * (1 - P(4, 34, i));
		}
		t.crowd = n > 0 ? M(1 - Math.exp(-n / 3.4)) : 0;
		let r = 0, i = 0;
		for (let t of this.blazes) {
			if (t.group && !t.group.present) continue;
			let n = Math.hypot(t.x - e.x, t.z - e.z);
			t.roar > 0 && (r += t.roar * (1 - P(3, 30, n)) ** 1.6), t.crackle > 0 && (i = Math.max(i, t.crackle * (1 - P(1.5, 12, n)) ** 1.5));
		}
		t.blaze = r > 0 ? M(1 - Math.exp(-r * .9)) * .95 : 0, i * .9 > t.fire && (t.fire = i * .9);
	}
	update(e, t) {
		this.enabled && (this._timer -= e, !(this._timer > 0) && (this._timer = .25, this.audio.setAmbience(this.compute(t), { fade: .6 })));
	}
};
//#endregion
//#region src/game/GroundDetail.js
function mr(e) {
	let t = e.map(({ kind: e, seed: t }) => Pe(e, { seed: t })), n = Math.max(...t.map((e) => e.frameWidth)) + 2, r = Math.max(...t.map((e) => e.frameHeight)) + 1, i = document.createElement("canvas");
	i.width = n * t.length, i.height = r;
	let a = i.getContext("2d");
	return a.imageSmoothingEnabled = !1, t.forEach((e, t) => {
		let i = t * n + Math.floor((n - e.frameWidth) / 2), o = r - e.frameHeight;
		a.drawImage(e.canvas, 0, 0, e.frameWidth, e.frameHeight, i, o, e.frameWidth, e.frameHeight), e.dispose();
	}), {
		texture: Me(i, {
			wrap: "clamp",
			mipmaps: !1,
			srgb: !0,
			name: "foliage-strip"
		}),
		width: n,
		height: r,
		pixelsPerUnit: 16,
		anchor: [.5, 0],
		frames: t.length
	};
}
var hr = /* @__PURE__ */ new Set([
	"g",
	"G",
	"f"
]), gr = [
	1,
	2,
	3,
	1,
	2
], _r = {
	dry_grass: {
		tufts: 3,
		tall: .3,
		shrub: .07,
		odds: [
			.5,
			.15,
			.25,
			.1
		],
		pebbles: .04,
		bones: .004
	},
	arid_dirt: {
		tufts: .45,
		tall: .15,
		shrub: .06,
		odds: [
			.5,
			.2,
			.15,
			.15
		],
		pebbles: .12,
		bones: .008
	},
	cracked_earth: {
		tufts: .1,
		tall: 0,
		shrub: .01,
		odds: [
			.3,
			0,
			.7,
			0
		],
		pebbles: .07,
		bones: .012
	},
	red_sand: {
		tufts: .25,
		tall: .2,
		shrub: .05,
		odds: [
			.45,
			.35,
			.05,
			.15
		],
		pebbles: .08,
		bones: .006
	},
	sandstone: {
		tufts: .08,
		tall: 0,
		shrub: .015,
		odds: [
			.4,
			.4,
			.2,
			0
		],
		pebbles: .1,
		bones: 0
	},
	redrock: {
		tufts: .08,
		tall: 0,
		shrub: .015,
		odds: [
			.4,
			.4,
			.2,
			0
		],
		pebbles: .1,
		bones: 0
	},
	scree: {
		tufts: .06,
		tall: 0,
		shrub: .01,
		odds: [
			.6,
			.2,
			.2,
			0
		],
		pebbles: .25,
		bones: .004
	},
	flagstone: {
		tufts: .04,
		tall: 0,
		shrub: 0,
		odds: [
			1,
			0,
			0,
			0
		],
		pebbles: .02,
		bones: 0
	},
	scorched: {
		tufts: 0,
		tall: 0,
		shrub: 0,
		odds: [
			1,
			0,
			0,
			0
		],
		pebbles: .03,
		bones: .006
	},
	basalt: {
		tufts: 0,
		tall: 0,
		shrub: 0,
		odds: [
			1,
			0,
			0,
			0
		],
		pebbles: .06,
		bones: .004
	},
	ash: {
		tufts: 0,
		tall: 0,
		shrub: 0,
		odds: [
			1,
			0,
			0,
			0
		],
		pebbles: .05,
		bones: .03
	}
}, vr = /* @__PURE__ */ new Set([
	"basalt",
	"ash",
	"scorched"
]), yr = {
	tufts: 2,
	tall: .55,
	shrub: .5,
	odds: [
		.45,
		.1,
		.4,
		.05
	],
	pebbles: .05,
	bones: 0
}, br = [
	"#ffffff",
	"#ffffff",
	"#f4e6c8",
	"#e4ecc0"
];
function* xr({ tileMap: e, isFree: t, seed: n = 2024, houses: r = [], trees: i = [], clearings: o = [], flowerAreas: s = [], shrubAreas: c = [], cropAreas: l = [], maxInstances: u = Infinity }) {
	let d = new le(n), f = new a();
	f.name = "GroundDetail";
	let p = [], m = [], h = [], g = [], _ = (e, t) => {
		for (let n = 0; n < o.length; n++) {
			let r = o[n];
			if ((e - r.x) ** 2 + (t - r.z) ** 2 < r.r * r.r) return !0;
		}
		return !1;
	}, v = (e, t, n) => {
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (t >= i.minX && t < i.maxX && n >= i.minZ && n < i.maxZ) return i;
		}
		return null;
	}, y = (t, n, r) => {
		for (let i = -1; i <= 1; i++) for (let a = -1; a <= 1; a++) {
			if (!a && !i) continue;
			let o = e.tileAt(t + a, n + i);
			if (o && r(o)) return !0;
		}
		return !1;
	}, b = {
		grass: [],
		shrubs: [],
		clutter: [],
		reeds: [],
		rng: new le(n + 4099),
		tints: br,
		reed: .6
	}, x = te()?.SEASON_LAND ?? null, S = new le(n + 7351), C = {}, w = (e, r, i, a, o) => {
		let s = o.rng, c = i.h, l = i.char === "T", u = F(e * .21 + 7, r * .21, {
			seed: n + 11,
			octaves: 3
		}), d = (e, n) => l || t(e, n), f = a.tufts * (a.tufts >= 1 ? .8 + u * .5 : 1), p = Math.floor(f) + +(s.next() < f - Math.floor(f));
		for (let t = 0; t < p; t++) {
			let t = e + s.next(), n = r + s.next(), i = s.next() < a.tall * (u > .55 ? 1.6 : .7), f = s.range(.7, 1.05), p = o.tints[s.int(0, o.tints.length - 1)];
			if (!d(t, n)) continue;
			let m = !l && _(t, n);
			o.grass.push({
				x: t,
				y: c,
				z: n,
				scale: m ? f * .75 : f,
				frame: i && !m ? 1 : 0,
				tint: p
			});
		}
		if (s.next() < a.shrub * (l ? 1 : .6 + u * .8)) {
			let t = e + s.range(.15, .85), n = r + s.range(.15, .85), i = s.next(), u = 0;
			for (; u < a.odds.length - 1 && i >= a.odds[u];) i -= a.odds[u], u++;
			let f = s.range(.8, 1.2);
			d(t, n) && (l || !_(t, n)) && o.shrubs.push({
				x: t,
				y: c,
				z: n,
				scale: f,
				frame: u
			});
		}
		if (s.next() < a.pebbles) {
			let t = e + s.next(), n = r + s.next();
			d(t, n) && o.clutter.push({
				x: t,
				y: c,
				z: n,
				scale: s.range(.7, 1.1),
				frame: o === b && vr.has(i.type.top) ? 2 : 0
			});
		}
		if (s.next() < a.bones) {
			let t = e + s.range(.2, .8), n = r + s.range(.2, .8);
			d(t, n) && !_(t, n) && o.clutter.push({
				x: t,
				y: c,
				z: n,
				scale: s.range(.85, 1.05),
				frame: 1
			});
		}
		if (!l && y(e, r, (e) => e.water) && s.next() < o.reed) {
			let n = e + s.next(), i = r + s.next();
			t(n, i) && o.reeds.push({
				x: n,
				y: c,
				z: i,
				scale: s.range(.75, 1.1)
			});
		}
	}, T = (e, r, i) => {
		let a = i.char, o = i.h, l = i.type.top;
		if (l && Object.hasOwn(_r, l)) {
			w(e, r, i, a === "T" ? yr : _r[l], b);
			return;
		}
		if (x && l && Object.hasOwn(x.growth, l)) {
			let [t, n] = x.growth[l], o = x.families[t];
			C[t] ??= {
				grass: [],
				shrubs: [],
				clutter: [],
				reeds: [],
				rng: S,
				tints: o.tints,
				reed: o.reed
			}, w(e, r, i, a === "T" ? o.thicket : n, C[t]);
			return;
		}
		let u = a === "T";
		if (hr.has(a) || u) {
			let i = F(e * .23, r * .23, {
				seed: n + 1,
				octaves: 3
			}), l = u ? 2 : 3 + (i > .55 ? 2 : 0);
			for (let n = 0; n < l; n++) {
				let n = e + d.next(), a = r + d.next();
				if (!u && !t(n, a)) continue;
				let s = i > .58 && d.chance(.45), c = d.range(.7, 1.05), l = d.chance(.25) ? "#e2f2a8" : u ? "#b8c8a0" : "#ffffff", f = !u && _(n, a);
				p.push({
					x: n,
					y: o,
					z: a,
					scale: f ? c * .75 : c,
					frame: s && !f ? 1 : 0,
					tint: l
				});
			}
			let f = u ? 0 : a === "f" ? 3 : i > .6 ? 1 : +!!d.chance(.25), h = v(s, e, r)?.palette ?? gr;
			for (let n = 0; n < f; n++) {
				let n = e + d.next(), i = r + d.next();
				if (!t(n, i)) continue;
				let a = d.range(.75, 1), s = h[d.int(0, h.length - 1)];
				_(n, i) || m.push({
					x: n,
					y: o,
					z: i,
					scale: a,
					frame: s
				});
			}
			let y = u ? .55 : v(c, e, r)?.chance ?? .05;
			if (d.chance(y)) {
				let n = e + d.range(.15, .85), i = r + d.range(.15, .85);
				if (u || t(n, i)) {
					let e = d.next(), t = e < .45 ? 0 : e < .85 ? 1 : 2, r = d.range(.8, 1.2);
					(u || !_(n, i)) && g.push({
						x: n,
						y: o,
						z: i,
						scale: r,
						frame: t
					});
				}
			}
			if (!u && d.chance(.035)) {
				let n = e + d.next(), i = r + d.next();
				t(n, i) && g.push({
					x: n,
					y: o,
					z: i,
					scale: d.range(.8, 1.1),
					frame: 3
				});
			}
		} else if (a === "s") {
			let n = y(e, r, (e) => e.water), i = n ? 2 : 1;
			for (let a = 0; a < i; a++) {
				let i = e + d.next(), a = r + d.next();
				t(i, a) && (n && d.chance(.7) ? h.push({
					x: i,
					y: o,
					z: a,
					scale: d.range(.75, 1.1)
				}) : g.push({
					x: i,
					y: o,
					z: a,
					scale: d.range(.7, 1),
					frame: 3
				}));
			}
		} else if (a === "F") d.chance(.3) && p.push({
			x: e + d.next(),
			y: o,
			z: r + d.next(),
			scale: d.range(.55, .75),
			frame: 0,
			tint: "#d8e4a0"
		});
		else if (a === "d" || a === ".") {
			if (d.chance(.12)) {
				let n = e + d.next(), i = r + d.next();
				t(n, i) && p.push({
					x: n,
					y: o,
					z: i,
					scale: d.range(.5, .7),
					frame: 0,
					tint: "#d8e0a0"
				});
			}
		} else a === "m" && d.chance(.35) && g.push({
			x: e + d.next(),
			y: o,
			z: r + d.next(),
			scale: d.range(.7, 1),
			frame: d.chance(.5) ? 1 : 3
		});
	};
	for (let t = 0; t < e.depth; t++) {
		for (let n = 0; n < e.width; n++) {
			let r = e.tileAt(n, t);
			r && T(n, t, r), (n & 31) == 31 && (yield);
		}
		yield;
	}
	let E = (t, n) => {
		let r = e.tileAt(Math.floor(t), Math.floor(n));
		return r && hr.has(r.char) && !Object.hasOwn(_r, r.type.top) && !(x && Object.hasOwn(x.growth, r.type.top)) ? r : null;
	}, D = (e, n, r, i) => {
		let a = E(e, n);
		return !a || !t(e, n) || _(e, n) ? !1 : (g.push({
			x: e,
			y: a.h,
			z: n,
			scale: i,
			frame: r
		}), !0);
	};
	for (let e of r) {
		let t = [
			[
				e.minX,
				e.maxZ,
				e.maxX,
				e.maxZ,
				0,
				1
			],
			[
				e.minX,
				e.minZ,
				e.maxX,
				e.minZ,
				0,
				-1
			],
			[
				e.minX,
				e.minZ,
				e.minX,
				e.maxZ,
				-1,
				0
			],
			[
				e.maxX,
				e.minZ,
				e.maxX,
				e.maxZ,
				1,
				0
			]
		];
		for (let [n, r, i, a, o, s] of t) {
			let t = Math.hypot(i - n, a - r), c = Math.max(1, Math.round(t / .95));
			for (let t = 0; t < c; t++) {
				if (!d.chance(.62)) continue;
				let l = (t + d.range(.2, .8)) / c, u = d.range(.28, .55), f = n + (i - n) * l + o * u, p = r + (a - r) * l + s * u;
				e.door && Math.hypot(f - e.door.x, p - e.door.z) < 1.25 || D(f, p, d.next() < .62 ? 0 : 1, d.range(.75, 1.1));
			}
		}
	}
	for (let e of i) {
		let t = d.int(1, 3);
		for (let n = 0; n < t; n++) {
			let t = d.range(0, Math.PI * 2), n = (e.r ?? .3) + d.range(.35, .8);
			D(e.x + Math.cos(t) * n, e.z + Math.sin(t) * n, +!!d.chance(.6), d.range(.7, 1.05));
		}
	}
	let ee = [], O = function* (e, t, r, i = {}) {
		if (!r.length) return [];
		let a = r.length > u ? yield* Ye(r, {
			x: (e) => e.x,
			z: (e) => e.z,
			maxWeight: u
		}) : [r], o = a.map((t, n) => [a.length > 1 ? `${e}#${n}` : e, t]), s = [];
		for (let [e, r] of o) {
			let a = new Oe({
				sprite: t,
				instances: globalThis.__emberGround ? globalThis.__emberGround.foliage(r) : r,
				name: e,
				seed: n + ee.length,
				...i
			});
			f.add(a.object), ee.push(a), s.push(a), yield;
		}
		return s;
	}, ne = mr([{ kind: "grass_tuft" }, { kind: "grass_tall" }]), re = mr([
		{ kind: "flower_red" },
		{ kind: "flower_yellow" },
		{ kind: "flower_white" },
		{ kind: "flower_blue" }
	]), k = mr([
		{ kind: "bush" },
		{ kind: "fern" },
		{ kind: "mushroom" },
		{ kind: "rock_small" }
	]), A = Pe("reeds");
	yield, yield* O("Foliage:grass", ne, p, { wind: 1 }), yield* O("Foliage:flowers", re, m, { wind: 1.1 }), yield* O("Foliage:reeds", A, h, { wind: 1.4 });
	let ie = yield* O("Foliage:shrubs", k, g, {
		wind: .5,
		rootDarken: .25
	});
	for (let e of ie) e.castShadow = !0;
	let ae = [], j = (e) => {
		let t = mr(e);
		return ae.push(t.texture), t;
	};
	if (b.grass.length && (yield* O("Foliage:arid-grass", j([{ kind: "dry_tuft" }, { kind: "dry_grass_tall" }]), b.grass, { wind: 1 })), b.shrubs.length) {
		let e = yield* O("Foliage:arid-shrubs", j([
			{ kind: "scrub" },
			{ kind: "agave" },
			{ kind: "thornbush" },
			{ kind: "prickly_pear" }
		]), b.shrubs, {
			wind: .35,
			rootDarken: .25
		});
		for (let t of e) t.castShadow = !0;
	}
	b.clutter.length && (yield* O("Foliage:arid-clutter", j([
		{ kind: "pebbles" },
		{ kind: "bones" },
		{ kind: "cinders" }
	]), b.clutter, {
		wind: 0,
		rootDarken: .1
	})), b.reeds.length && (yield* O("Foliage:arid-reeds", A, b.reeds, { wind: 1.4 }));
	let M = x ? yield* x.fields({
		fams: C,
		cropAreas: l,
		tileMap: e,
		isFree: t,
		inClearing: _,
		seed: n,
		add: O,
		kinds: (e) => j(e.map((e) => ({ kind: e }))),
		reedSprite: A
	}) : {}, N = b.grass.length + b.shrubs.length + b.clutter.length ? {
		aridGrass: b.grass.length,
		aridShrubs: b.shrubs.length,
		aridClutter: b.clutter.length
	} : {};
	return {
		fields: ee,
		object: f,
		stats: {
			grass: p.length,
			flowers: m.length,
			reeds: h.length + b.reeds.length,
			shrubs: g.length,
			...N,
			...M
		},
		dispose() {
			for (let e of ee) e.dispose();
			ne.texture.dispose(), re.texture.dispose(), k.texture.dispose(), A.dispose();
			for (let e of ae) e.dispose();
		}
	};
}
var Sr = () => new Promise((e) => setTimeout(e, 0)), Cr = /[^A-Za-z0-9_:.\-]+/;
function wr(e) {
	let t = Tt(e)?.until ?? "";
	return new Set(t.split(Cr).filter((e) => e && !/^(and|or|not)$/i.test(e)));
}
var Tr = /* @__PURE__ */ new Set(["tree", "waterfall"]), Er = Object.freeze({
	terrainChunk: 32,
	terrainTriangles: 48e3,
	terrainExtent: 48,
	terrainMinTriangles: 12e3,
	propTriangles: 16e3,
	propExtent: 64,
	treeTriangles: 16e3,
	treeExtent: 96,
	minTriangles: 3e3,
	casterTriangles: 96e3,
	casterExtent: 64,
	foliageInstances: Rt,
	shadowUp: 60,
	shadowDown: 45,
	particleCull: 34
}), Dr = class e {
	constructor({ engine: e, textures: t, lighting: n, particles: r, godRays: i, level: o, lightPool: s = null, story: c = null, defer: l = !1 }) {
		this.engine = e, this.scene = e.scene, this.textures = t, this.lighting = n, this.particles = r, this.godRays = i, this.level = o, this._sharedPool = s, this.vfxLights = null, this.story = c, this.storyGroups = /* @__PURE__ */ new Map(), this._emitterGroup = /* @__PURE__ */ new Map(), this._storyTags = /* @__PURE__ */ new Map(), this.storyRanges = new Je(), this.env = o.environment ?? {}, this._pending = l ? [] : null, this.attached = !l, this.shafts = [], this._ownInteractables = 0, this.root = new a(), this.root.name = "World", this._defer(() => this.scene.add(this.root)), this.tileMap = null, this.water = null, this.terrain = null, this.builder = null, this.factory = null, this.built = [], this.results = [], this.updaters = [], this.waterfalls = [], this.interactables = [], this.emitters = Object.create(null), this.areaEmitters = [], this.propEmitters = [], this.lights = [], this.emissiveEntries = [], this.glassMaterial = null, this.fires = [], this._fireList = [], this.blazes = [], this._bells = [], this._warmth = [], this.falls = [], this.fallAnchors = [], this.anchors = {}, this.stats = {}, this.waterBase = null;
	}
	groundAt(e, t) {
		return this.tileMap.getHeight(e, t);
	}
	objectsOf(e) {
		return this.level.objects.filter((t) => t.type === e);
	}
	inMap(e, t) {
		return e >= 0 && t >= 0 && e <= this.level.width && t <= this.level.depth;
	}
	async build(e = () => {}) {
		let t = this.buildSteps();
		for (let n = t.next(); !n.done; n = t.next()) {
			let t = n.value;
			t && ("wait" in t ? await t.wait : (e(t.at, t.label), await Sr()));
		}
	}
	*buildSteps({ paced: t = !1 } = {}) {
		let n = performance.now(), r = {}, i = {};
		this.stats.phases = r;
		let a = n, o = (e) => {
			let t = performance.now();
			i[e] = (i[e] ?? 0) + t - a, r[e] = Math.round(i[e]), a = t;
		}, s = function* (e, t) {
			yield {
				at: e,
				label: t
			}, a = performance.now();
		}, c = function* (e, n) {
			if (!t) return Xe(e);
			let r = e.next();
			for (; !r.done;) o(n), yield, a = performance.now(), r = e.next();
			return r.value;
		}, l = this.level;
		this.batching = e.isBigLevel(l) ? { ...Er } : null;
		let u = this.batching;
		if (!re() && k(l) && (yield { wait: O() }), !te() && ae(l) && (yield { wait: j() }), yield* s(.08, R("game.load.textures")), this.textures.preload(), o("textures"), yield* s(.18, R("game.load.land")), this.terrain = yield* c(wt(l, {
			textures: this.textures,
			chunkSize: u ? u.terrainChunk : 64,
			deferShore: !0
		}), "terrain"), this.tileMap = this.terrain.tileMap, u) {
			let e = this.tileMap.object.children.filter(nt);
			this.terrainCasters = yield* c(tt(e.map((e) => ({
				geometry: e.geometry,
				side: e.material.side
			})), {
				lights: [this.lighting.sun],
				maxTriangles: u.casterTriangles,
				maxExtent: u.casterExtent,
				name: "terrain:shadow"
			}), "terrain");
			for (let t of e) t.castShadow = !1;
			this.root.add(this.terrainCasters.object);
		}
		if (u && u.terrainTriangles > 0) {
			let e = this.tileMap.object.children.length, t = yield* c(this.tileMap.consolidateChunkSteps({
				maxTriangles: u.terrainTriangles,
				maxExtent: u.terrainExtent,
				minTriangles: u.terrainMinTriangles
			}), "terrain");
			this.stats.terrainMeshes = [e, e - t];
		}
		this.water = this.terrain.water, this.root.add(this.terrain.object), o("terrain"), yield* s(.3, R("game.load.village")), this.builder = new Ht({
			textures: this.textures,
			seed: 42
		}), this.factory = this.builder.factory, this.glassMaterial = this.factory.glassMaterial();
		for (let e of this._buildProps(t ? 0 : 12)) o("props"), t ? (yield, a = performance.now()) : yield* s(.3 + .14 * e, R("game.load.village"));
		o("props"), yield* s(.45, R("game.load.forest"));
		let d = yield* c(this._levelTreeSteps(), "trees"), f = (u || t) && this.water ? this.water.refreshAsync() : null;
		yield* c(this._treeSteps(d, { paced: t }), "trees"), o("trees"), yield* s(.58, R("game.load.water")), this._buildWaterfalls(), f || this.water?.refresh(), o("water"), yield* s(.68, R("game.load.meadow")), yield* c(this._groundDetailSteps(), "foliage"), o("foliage"), yield* s(.8, R("game.load.lights")), this._defer(() => {
			this._wireLights(), this._buildAtmosphere();
		}), o("lights"), yield* s(.88, R("game.load.merge")), this.merged = yield* c(this._mergeSteps(), "merge"), o("merge"), f && (yield { wait: f }, t && (a = performance.now()), this.water._waterColliderSignature() !== this.water._colliderSig && this.water.refresh(), o("shoreWait")), this.tileMap.object.traverse((e) => {
			e.isMesh && nn(e.material, "ground");
		}), this.outerGround && nn(this.outerGround.material, "ground");
		for (let e of this.groundDetail.fields) nn(e.material, "foliage");
		if (this.merged.object.traverse((e) => {
			e.isMesh && an.test(e.material?.name ?? "") && nn(e.material, "ground");
		}), this.env.frost && (on() || (yield { wait: tn() }), on().prepareWorld(this)), o("snow"), u) {
			let e = [
				...this.tileMap.object.children.filter((e) => e.isMesh),
				...this.merged.meshes,
				...this.treeGroups.flatMap((e) => e.meshes)
			], t = this.groundDetail.fields;
			yield* c(function* () {
				for (let t of e) Ge(t), yield;
				for (let e of t) Ge(e.object, { pad: .8 }), yield;
			}(), "culling"), o("culling");
		}
		this._ownInteractables = this.interactables.length, this.stats.buildMs = Math.round(t ? Object.values(i).reduce((e, t) => e + t, 0) : performance.now() - n), this.stats.colliders = this.tileMap.colliders.length, this.stats.pointLights = this.lights.length, this.stats.objects = l.objects.length, this.stats.batching = !!u;
	}
	attach() {
		if (this.attached) return;
		this.attached = !0;
		let e = this._pending;
		if (e) {
			this._pending = null;
			for (let t of e) t();
		} else this._relink();
		this.stats.pointLights = this.lights.length;
	}
	detach() {
		if (!this.attached) return;
		if (!this._sharedPool) throw Error("World.detach: only a world with a shared light pool (a campaign) can be detached");
		this.attached = !1, this.root.removeFromParent();
		for (let e of this.emissiveEntries) e.dispose();
		for (let e of this._ownEmitters()) this._emitterOut(e);
		let e = this.godRays;
		for (let t of this.shafts) {
			let n = e.shafts.indexOf(t);
			n >= 0 && e.shafts.splice(n, 1), t.mesh.removeFromParent();
		}
		this.interactables.length = this._ownInteractables, this._cullList = null;
	}
	_relink() {
		this.scene.add(this.root);
		for (let e = 0; e < this.emissiveEntries.length; e++) {
			let t = this.emissiveEntries[e], n = this.lighting.registerEmissive(t.material, {
				day: t.baseDay ?? 0,
				night: t.night
			});
			n.baseDay = n.day, this.emissiveEntries[e] = n;
		}
		for (let e of this._ownEmitters()) this._emitterIn(e);
		this._wireLights();
		let e = this.godRays;
		for (let t of this.shafts) e.shafts.includes(t) || e.shafts.push(t), e.object.add(t.mesh);
	}
	_ownEmitters() {
		return [.../* @__PURE__ */ new Set([
			...this.propEmitters,
			...this.areaEmitters.map((e) => e.emitter),
			...Object.values(this.emitters)
		])].filter(Boolean);
	}
	_emitterOut(e) {
		let t = this.particles.emitters, n = t.indexOf(e);
		n >= 0 && t.splice(n, 1), e.object.removeFromParent();
	}
	_emitterIn(e) {
		this.particles.emitters.includes(e) || this.particles.emitters.push(e), this.particles.object.add(e.object);
	}
	_defer(e) {
		this._pending ? this._pending.push(e) : e();
	}
	_splitOpts(e) {
		let t = this.batching;
		return t ? e === "tree" ? {
			maxTriangles: t.treeTriangles,
			maxExtent: t.treeExtent,
			minTriangles: t.minTriangles
		} : {
			maxTriangles: t.propTriangles,
			maxExtent: t.propExtent,
			minTriangles: t.minTriangles
		} : {};
	}
	get bells() {
		let e = /* @__PURE__ */ new Map();
		for (let t of this._bells) (!t.group || t.group.present) && e.set(t.id, t.bell);
		return e;
	}
	get warmth() {
		let e = [];
		for (let t of this._warmth) (!t.group || t.group.present) && e.push(t.zone);
		return e;
	}
	static isBigLevel(e) {
		return Math.max(e.width, e.depth) > 64;
	}
	_mergeProps() {
		return Xe(this._mergeSteps());
	}
	*_mergeSteps() {
		let e = this.batching, t = yield* this.factory.mergeStaticSteps(this.results, {
			name: "village:static",
			...this._splitOpts("prop"),
			shadowCasters: e ? {
				lights: [this.lighting.sun],
				maxTriangles: e.casterTriangles,
				maxExtent: e.casterExtent
			} : null,
			tags: this._storyTags.size ? this._storyTags : null
		});
		this.storyRanges.add(t.ranges), this.root.add(t.object);
		let n = (re() ?? te())?.mergeFlames;
		return this.flames = n ? n(this.factory, this.results, { name: "village:flames" }) : null, this.flames && this.root.add(this.flames.object), t;
	}
	_storyGroupOf(e) {
		if (!this.story || !Gt(e) || !Kt.has(e.type) || !Ht.isBuildable(e.type) && e.type !== "emitter") return null;
		let t = `${String(e.when ?? "").trim()}\u0000${String(e.unless ?? "").trim()}${this._frostCell(e)}`, n = this.storyGroups.get(t);
		return n || (n = {
			key: t,
			sample: e,
			present: !!this.story.present(e),
			objects: [],
			colliders: [],
			walkRects: [],
			interactables: [],
			emitters: [],
			lights: [],
			poolLights: [],
			fires: [],
			falls: [],
			mapped: !1
		}, this.storyGroups.set(t, n), n.present || this.storyRanges.setHidden(n, !0, { upload: !1 })), n;
	}
	_frostCell(e) {
		let t = this._frostNames ??= wr(this.env);
		if (!t.size) return "";
		let n = e;
		if (![n.when, n.unless].some((e) => e && String(e).split(Cr).some((e) => t.has(e)))) return "";
		let r = Number.isFinite(n.x) ? n.x : (n.x0 + n.x1) / 2, i = Number.isFinite(n.z) ? n.z : (n.z0 + n.z1) / 2;
		return Number.isFinite(r) && Number.isFinite(i) ? `\u0000${Math.floor(r / 8)},${Math.floor(i / 8)}` : "";
	}
	_build(e, { addToScene: t = !0, merge: n = !0 } = {}) {
		let r = null;
		try {
			r = this.builder.build(e, this.tileMap);
		} catch (t) {
			return console.warn(`[Luminati] could not build ${e.type} "${e.id}":`, t), null;
		}
		if (!r) return null;
		let i = this._storyGroupOf(e);
		if (this.built.push(r), t && this.root.add(r.object), i && (r.propResult && this._storyTags.set(r.propResult, i), t && (i.objects.push(r.object), r.object.visible = i.present), Wt.has(e.type) && (i.mapped = !0), i.colliders.push(...r.colliders), i.walkRects.push(...r.walkRects), i.lights.push(...r.lights)), n && r.propResult && this.results.push(r.propResult), !i || i.present) {
			for (let e of r.colliders) this.tileMap.addCollider(e);
			for (let e of r.walkRects) this.tileMap.addWalkSurface(e);
		}
		for (let e of r.emissives) this._registerEmissive(e);
		for (let e of r.lights) this._lightDescs.push(e);
		if (r.update) {
			let e = r.update;
			this.updaters.push(i ? (t) => {
				i.present && e(t);
			} : e);
		}
		return r;
	}
	_createEmitter(e) {
		let t = this.particles.createEmitter(e.preset === "smoke" ? {
			...e,
			...It
		} : e);
		return this.propEmitters.push(t), t;
	}
	_groupEmitter(e, t) {
		t && (t.emitters.push(e), this._emitterGroup.set(e, t), t.present || (e.enabled = !1));
	}
	applyStory({ instant: t = !1 } = {}) {
		let n = [], r = null, i = !1;
		if (!this.story) return {
			changed: n,
			rect: r,
			mapChanged: i
		};
		let a = (e, t, n, i) => {
			r = r ? {
				minX: Math.min(r.minX, e),
				maxX: Math.max(r.maxX, t),
				minZ: Math.min(r.minZ, n),
				maxZ: Math.max(r.maxZ, i)
			} : {
				minX: e,
				maxX: t,
				minZ: n,
				maxZ: i
			};
		}, o = [], s = !1, c = !1;
		for (let e of this.storyGroups.values()) {
			let r = !!this.story.present(e.sample);
			if (r !== e.present && (t || !this.thawGate || this.thawGate(e))) {
				e.present = r, n.push(e), e.mapped && (i = !0), this.storyRanges.setHidden(e, !r);
				for (let t of e.objects) t.visible = r;
				for (let t of e.colliders) {
					r ? this.tileMap.addCollider(t) : this.tileMap.removeCollider(t), t.type === "circle" ? a(t.x - t.r, t.x + t.r, t.z - t.r, t.z + t.r) : a(t.minX, t.maxX, t.minZ, t.maxZ);
					let e = this.water && this._wetTiles(t);
					e && o.push(e);
				}
				for (let t of e.walkRects) r ? this.tileMap.addWalkSurface(t) : this.tileMap.removeWalkSurface(t), a(t.minX, t.maxX, t.minZ, t.maxZ);
				for (let t of e.interactables) t.disabled = !r;
				for (let t of e.emitters) t.enabled = r;
				for (let n of e.poolLights) this.lightPool?.setHidden(n, !r, { instant: t });
				e.fires.length && (s = !0), e.falls.length && (c = !0);
			}
		}
		if (s) {
			this.fires.length = 0;
			for (let e of this._fireList) (!e.group || e.group.present) && this.fires.push(e.position);
		}
		if (c) {
			this.fallAnchors.length = 0;
			for (let e of this.falls) e.splash && !e.hidden && this.fallAnchors.push(e.anchor);
		}
		let l = this.thawIce;
		if (l) for (let e of l.chunks) {
			let t = l.at ? l.at(e) : !!this.story.present(l.test);
			t !== e.on && (e.on = t, t ? this.tileMap.addWalkSurface(e.rect) : this.tileMap.removeWalkSurface(e.rect), a(e.rect.minX, e.rect.maxX, e.rect.minZ, e.rect.maxZ));
		}
		if (o.length) for (let t of e._clusterRects(o, 2 * this.water.shoreReach)) this.batching ? this.water.rebakeShoreAsync(t) : this.water.rebakeShore(t);
		return {
			changed: n,
			rect: r,
			mapChanged: i
		};
	}
	_wetTiles(e) {
		let t = this.tileMap, n = e.type === "circle", r = n ? e.x - e.r : e.minX, i = n ? e.x + e.r : e.maxX, a = n ? e.z - e.r : e.minZ, o = n ? e.z + e.r : e.maxZ;
		if (!(i > r && o > a)) return null;
		let s = Math.max(0, Math.floor(r)), c = Math.min(t.width - 1, Math.floor(i)), l = Math.max(0, Math.floor(a)), u = Math.min(t.depth - 1, Math.floor(o));
		for (let e = l; e <= u; e++) for (let n = s; n <= c; n++) if (t.tileAt(n, e)?.water) return {
			minI: s,
			maxI: c,
			minJ: l,
			maxJ: u
		};
		return null;
	}
	static _clusterRects(e, t) {
		let n = (e) => (e.maxI - e.minI + 1 + 2 * t) * (e.maxJ - e.minJ + 1 + 2 * t), r = e.map((e) => ({ ...e }));
		for (let e = !0; e;) {
			e = !1;
			for (let t = 0; t < r.length && !e; t++) for (let i = t + 1; i < r.length; i++) {
				let a = r[t], o = r[i], s = {
					minI: Math.min(a.minI, o.minI),
					maxI: Math.max(a.maxI, o.maxI),
					minJ: Math.min(a.minJ, o.minJ),
					maxJ: Math.max(a.maxJ, o.maxJ)
				};
				if (!(n(s) > n(a) + n(o))) {
					r[t] = s, r.splice(i, 1), e = !0;
					break;
				}
			}
		}
		return r;
	}
	mapMarkers() {
		let e = /* @__PURE__ */ new Map();
		for (let t of this.storyGroups.values()) for (let n of t.interactables) e.set(n, t);
		let t = [], n = (e, n, r, i) => {
			let a = {
				x: e,
				z: n,
				kind: r
			};
			i && Object.defineProperty(a, "hidden", {
				get: () => !i.present,
				enumerable: !0
			}), t.push(a);
		};
		for (let t of this.interactables) n(t.position.x, t.position.z, t.kind, e.get(t));
		for (let e of this._fireList) n(e.position.x, e.position.z, "fire", e.group);
		return t;
	}
	_registerEmissive(e) {
		this._emissiveSet ??= /* @__PURE__ */ new Set(), !this._emissiveSet.has(e.material) && (this._emissiveSet.add(e.material), this._defer(() => {
			let t = this.lighting.registerEmissive(e.material, {
				day: e.day ?? 0,
				night: e.night ?? 1.6
			});
			t.baseDay = t.day, this.emissiveEntries.push(t);
		}));
	}
	_interact(e, t, { radius: n = 1.2, label: r = "Examine", kind: i = "object", prompt: a = null, lookSpan: o = null, text: s, object: c, prop: l }) {
		let u = o ? {
			a: o.a.clone(),
			b: o.b.clone()
		} : null, d = {
			id: e,
			position: t.clone(),
			radius: n,
			label: r,
			kind: i,
			prompt: a ?? t.clone().setY(t.y + 1.6),
			lookSpan: u,
			text: s
		};
		return c !== void 0 && (d.object = c), l !== void 0 && (d.prop = l), this.interactables.push(d), d;
	}
	static textPagesOf(e) {
		let t = rt(e.text);
		return {
			lines: t.map((e) => e.text),
			keys: t.map((t) => pt(e, "text", t.i))
		};
	}
	*_buildProps(t = 12) {
		this._lightDescs = [], this.houseFootprints = [];
		let n = this.level.objects, i = performance.now();
		for (let a = 0; a < n.length; a++) {
			let o = n[a];
			if (performance.now() - i > t && (yield a / n.length, i = performance.now()), !Ht.isBuildable(o.type) || Tr.has(o.type)) continue;
			let s = this._build(o);
			if (!s) continue;
			let c = this._storyGroupOf(o), l = fr(o, c);
			l && this.blazes.push(l);
			let u = s.propResult?.bell;
			u && this._bells.push({
				id: o.id,
				bell: u,
				group: c
			});
			let d = s.propResult?.warmth;
			d && this._warmth.push({
				zone: d,
				group: c
			});
			let f = this.interactables.length;
			this._defer(() => {
				for (let e of s.emitters) this._groupEmitter(this._createEmitter(e), c);
			});
			let p = e.textPagesOf(o), m = p.lines;
			switch (o.type) {
				case "house": {
					let e = s.interact?.position?.clone() ?? null, t = et(s.colliders);
					t && this.houseFootprints.push({
						...t,
						door: e
					}), e && m.length && this._interact(`door:${o.id}`, e, {
						radius: 1,
						label: "Knock",
						kind: "door",
						lookSpan: s.interact.lookSpan,
						text: {
							speaker: "",
							...p
						}
					});
					break;
				}
				case "signpost":
					if (m.length) {
						let e = o.speaker, t = e == null ? {
							speaker: "Signpost",
							speakerDefault: "signpost"
						} : { speaker: typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" ? String(e) : "" };
						this._interact(o.id, s.anchor, {
							radius: 1.35,
							label: "Read",
							kind: "sign",
							text: {
								...t,
								...p
							}
						});
					}
					break;
				case "well": {
					if (!m.length) break;
					let e = s.anchor.y, t = s.interact?.position ?? new r(o.x, e, o.z), n = new r(o.x, e + 4.2, o.z - .3);
					this._interact(o.id, t, {
						radius: 1.75,
						label: "Look",
						kind: "well",
						prompt: n,
						text: {
							speaker: "",
							...p,
							sfx: o.sfx ?? "splash"
						}
					});
					break;
				}
				case "hearth": if (o.opts?.lit === !1) break;
				case "campfire": {
					let e = s.anchor.clone();
					this._fireList.push({
						position: e,
						group: c
					}), c && c.fires.push(e), (!c || c.present) && this.fires.push(e), o.type === "campfire" && (this.anchors.campfire ??= e);
					break;
				}
				case "chest":
				case "waystone": {
					let e = o.type === "chest", t = s.anchor.y;
					this._interact(o.id, s.interact?.position ?? s.anchor, {
						kind: o.type,
						label: "Examine",
						radius: e ? 1.2 : 1.5,
						prompt: new r(o.x, t + (e ? 1.2 : 2.4), o.z),
						text: e ? {
							speaker: "",
							lines: ["The chest is locked tight."],
							linesDefault: "chest"
						} : {
							...o.name ? { speaker: String(o.name) } : {
								speaker: "Waystone",
								speakerDefault: "waystone"
							},
							lines: ["An old waystone hums quietly."],
							linesDefault: "waystoneText"
						},
						object: o,
						prop: s.propResult?.controls ?? null
					});
					break;
				}
			}
			if (c) for (let e = f; e < this.interactables.length; e++) c.interactables.push(this.interactables[e]), c.present || (this.interactables[e].disabled = !0);
		}
	}
	_buildLevelTrees() {
		return Xe(this._levelTreeSteps());
	}
	*_levelTreeSteps() {
		let e = [];
		for (let t of this.objectsOf("tree")) {
			let n = this._build(t, {
				addToScene: !1,
				merge: !1
			});
			n?.propResult && e.push(n.propResult), yield;
		}
		return e;
	}
	_buildTrees(e = this._buildLevelTrees()) {
		Xe(this._treeSteps(e));
	}
	*_treeSteps(e, { paced: t = !1 } = {}) {
		let n = this.factory, r = this.tileMap, i = this.env, a = this.objectsOf("tree");
		this.stats.trees = {
			village: e.length,
			border: 0,
			outer: 0
		};
		let o = Lt(i), s = Dt(i), c = [], l = [], u = Pt(i), d = Ft(i);
		if (o || s) {
			this.outerHeight = Yn(r, {
				climate: u,
				season: d
			});
			let e = a.map((e) => ({
				x: e.x,
				z: e.z,
				r: this.inMap(e.x, e.z) ? 1.2 : 1.8
			})), t = Ot(i);
			({border: c, outer: l} = yield* Hn({
				tileMap: r,
				heightAt: this.outerHeight,
				avoid: e,
				southGap: t,
				kindAreas: Vn(i),
				climate: u,
				season: d
			})), o || (c = []), s || (l = []);
		}
		let f = [];
		for (let e of c) f.push(Jn(n, e)), yield;
		let p = [];
		for (let e of l) p.push(Jn(n, e)), yield;
		let m = this._splitOpts("tree"), h = yield* Rn([...e, ...f], {
			name: "trees:map",
			...m,
			tags: this._storyTags.size ? this._storyTags : null
		});
		this.storyRanges.add(h.ranges), this.root.add(h.object), this.treeGroups = [h];
		let g = r.width, _ = r.depth, v = this.batching ? { all: p } : {
			n: [],
			s: [],
			e: [],
			w: []
		};
		this.batching || p.forEach((e, t) => {
			let [, n, , r] = l[t], i = r < 0 ? "n" : r > _ ? "s" : n < g / 2 ? "w" : "e";
			v[i].push(e);
		});
		for (let [e, t] of Object.entries(v)) {
			if (!t.length) continue;
			let n = yield* Rn(t, {
				name: this.batching ? "trees:outer" : `trees:outer:${e}`,
				castShadow: !1,
				...m
			});
			this.root.add(n.object), this.treeGroups.push(n);
		}
		if (this.stats.trees = {
			village: e.length,
			border: c.length,
			outer: l.length
		}, s) {
			let e = yield* $n({
				textures: this.textures,
				tileMap: r,
				heightAt: this.outerHeight,
				climate: u,
				season: d,
				...t ? { rowsPerStep: 2 } : {}
			});
			this.root.add(e), this.outerGround = e;
		} else this.outerGround = null;
	}
	_buildWaterfalls() {
		for (let e of this.objectsOf("waterfall")) {
			let t = this._build(e, { merge: !1 });
			if (!t) continue;
			this.waterfalls.push(t);
			let n = this._storyGroupOf(e), i = e.width ?? 2, a = Bt(e);
			this._defer(() => {
				for (let e of t.emitters) this._groupEmitter(this._createEmitter({
					...e,
					count: a.count,
					alpha: a.alpha
				}), n);
			});
			let o = $e(e.facing), s = t.anchor.y, c = {
				id: e.id,
				x: e.x,
				z: e.z,
				width: i,
				dir: o,
				anchor: new r(e.x + o[0] * .6, s, e.z + o[1] * .6),
				splash: e.splash !== !1
			};
			n && (Object.defineProperty(c, "hidden", {
				get: () => !n.present,
				enumerable: !0
			}), n.falls.push(c)), this.falls.push(c), c.splash && (!n || n.present) && this.fallAnchors.push(c.anchor), c.splash && (this.anchors.waterfall ??= c.anchor);
		}
	}
	_buildGroundDetail() {
		Xe(this._groundDetailSteps());
	}
	*_groundDetailSteps() {
		let e = yield* xr({
			tileMap: this.tileMap,
			isFree: (e, t) => this._isFreeForFoliage(e, t),
			houses: this.houseFootprints,
			...zt(this.level),
			maxInstances: this.batching?.foliageInstances ?? Infinity
		});
		this.groundDetail = e, this.root.add(e.object), this.stats.foliage = e.stats;
	}
	acquireSpellLight({ minor: e = !1 } = {}) {
		return this.vfxLights?.acquire({ minor: e }) ?? null;
	}
	_wireLights() {
		let e = this.storyGroups.size ? /* @__PURE__ */ new Map() : null, t = ye(this._lightDescs, { cache: e });
		this._sharedPool && this._sharedPool.setDescriptors(t, { snap: !0 }), this.lightPool = this._sharedPool ?? new De(this.lighting, t, { size: 12 });
		for (let t of this.storyGroups.values()) {
			t.poolLights = t.lights.map((t) => e.get(t)).filter(Boolean);
			for (let e of t.poolLights) this.lightPool.setHidden(e, !t.present, { instant: !0 });
		}
		this.lights = this.lightPool.handles, this.stats.lightDescriptors = this._lightDescs.length, this.stats.lightsPooled = this.lightPool.pooled;
	}
	_buildAtmosphere() {
		let e = this.particles, t = this.env, n = (e, t, n) => new r(e, t, n), i = this.level.width, a = this.level.depth;
		t.dust !== !1 && globalThis.__emberGround?.dust !== !1 && (this.emitters.dust = e.createEmitter({
			preset: "dust",
			bounds: {
				center: n(i / 2, 2.5, a / 2),
				size: n(Nt.x, Nt.y, Nt.z)
			},
			count: 120,
			...tr(t)
		}));
		let o = (e, t, n, r) => Math.min(r, Math.max(n, Number.isFinite(Number(e)) && e !== null && e !== "" ? Number(e) : t));
		for (let t of this.objectsOf("emitter")) {
			if (globalThis.__emberGround && !globalThis.__emberGround.keeps(t)) continue;
			let r = Array.isArray(t.size) ? t.size : [], i = this.groundAt(t.x, t.z) + o(t.dy, 1.2, -5, 30), a = t.params && typeof t.params == "object" && !Array.isArray(t.params) ? t.params : {}, s;
			try {
				s = e.createEmitter({
					...a,
					preset: t.preset,
					bounds: {
						center: n(t.x, i, t.z),
						size: n(o(r[0], 8, .1, 200), o(r[1], 2.4, .1, 60), o(r[2], 8, .1, 200))
					},
					count: Math.round(o(t.count, 30, 1, 1e3))
				});
			} catch (e) {
				console.warn(`[Luminati] could not create particle area "${t.id}" (${t.preset}):`, e);
				continue;
			}
			this.areaEmitters.push({
				id: t.id,
				preset: t.preset,
				emitter: s
			}), t.id !== "dust" && (this.emitters[t.id] = s), this._groupEmitter(s, this._storyGroupOf(t));
		}
		for (let e of jt(t, this.level, this.tileMap)) this.shafts.push(...this.godRays.populate(e.bounds, e.count, e.seed));
	}
	_isFreeForFoliage(t, n) {
		let r = this.tileMap.queryColliders(t - .2, n - .2, t + .2, n + .2, this._freeTmp ??= []);
		for (let i = 0; i < r.length; i++) if (e._covers(r[i], t, n)) return !1;
		if (this.storyGroups.size) {
			for (let r of this.storyGroups.values()) if (!r.present) {
				for (let i of r.colliders) if (e._covers(i, t, n)) return !1;
			}
		}
		return !0;
	}
	static _covers(e, t, n) {
		if (e.type === "circle") {
			let r = e.r + .1;
			return (t - e.x) ** 2 + (n - e.z) ** 2 < r * r;
		}
		return t > e.minX - .15 && t < e.maxX + .15 && n > e.minZ - .15 && n < e.maxZ + .15;
	}
	update(e, t = {}) {
		for (let t = 0; t < this.updaters.length; t++) this.updaters[t](e);
		this.water?.update(e), t.camera || (t = {
			focus: t.focus ?? null,
			camera: this.engine.camera
		}), this.lightPool?.update(e, t), this.batching && t.focus && this._cullParticles(t.focus);
	}
	_cullParticles(e) {
		if (!this._cullList) {
			let e = new Set([this.emitters.dust].filter(Boolean));
			this._cullList = [...this.areaEmitters.map((e) => e.emitter), ...this.propEmitters].filter((t) => t && !e.has(t) && !t.followCamera).map((e) => ({
				e,
				x: e.position.x,
				z: e.position.z,
				hx: e.boxSize.x / 2,
				hz: e.boxSize.z / 2
			}));
		}
		let t = this.batching.particleCull ** 2;
		for (let n of this._cullList) {
			let r = Math.max(0, Math.abs(n.x - e.x) - n.hx), i = Math.max(0, Math.abs(n.z - e.z) - n.hz), a = this._emitterGroup.size ? this._emitterGroup.get(n.e) : null, o = r * r + i * i < t && (!a || a.present);
			n.e.enabled !== o && (n.e.enabled = o);
		}
	}
	dispose() {
		this.lightPool !== this._sharedPool && this.lightPool?.dispose();
		for (let e of this.emissiveEntries) e.dispose?.();
		this.emissiveEntries.length = 0;
		for (let e of this.shafts) e.dispose();
		this.shafts.length = 0, this.attached = !1, this.terrainCasters?.dispose(), this.groundDetail?.dispose();
		for (let e of this.propEmitters) e.dispose();
		let e = /* @__PURE__ */ new Set([...Object.values(this.emitters), ...this.areaEmitters.map((e) => e.emitter)]);
		for (let t of e) t?.dispose?.();
		for (let e of this.treeGroups ?? []) e.dispose();
		this.storyRanges.clear(), this.flames?.dispose(), this.merged?.dispose();
		for (let e of this.built) e.dispose();
		this.terrain?.dispose(), this.builder?.dispose(), this.outerGround?.geometry.dispose(), this.root.removeFromParent();
	}
}, Or = 3.2, kr = 5.6, Ar = .3, jr = .55, Mr = {
	down: new r(0, 0, 1),
	up: new r(0, 0, -1),
	left: new r(-1, 0, 0),
	right: new r(1, 0, 0)
};
function Nr(e) {
	let t = new h({
		map: e,
		color: new g("#d9ccff"),
		transparent: !0,
		opacity: jr,
		depthWrite: !0,
		depthFunc: 6,
		fog: !1
	});
	return t.onBeforeCompile = (e) => {
		e.vertexShader = e.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n	mvPosition.xyz *= max( 0.0, 1.0 - 1.3 / length( mvPosition.xyz ) );\n	gl_Position = projectionMatrix * mvPosition;"), e.fragmentShader = e.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n	if ( sampledDiffuseColor.a < 0.5 ) discard;\n	float silL = sqrt( dot( sampledDiffuseColor.rgb, vec3( 0.299, 0.587, 0.114 ) ) );\n	diffuseColor = vec4( diffuse * ( 0.42 + 0.8 * silL ), opacity );");
	}, t.customProgramCacheKey = () => "emberfall-player-silhouette-v2", t;
}
function Pr(t, n, r) {
	let i = new e(t, n);
	return i.name = r, i.renderOrder = 60, i.castShadow = !1, i.receiveShadow = !1, i;
}
function Fr(e, t, n = "traveler") {
	let r = typeof e?.preset == "string" && Object.hasOwn(Be, e.preset) ? e.preset : "traveler", i = e?.spec && typeof e.spec == "object" ? e.spec : {};
	return {
		...Be[r],
		preset: r,
		...i,
		...t ? { weapon: n === "bellwarden" ? "hammer" : "sword" } : {}
	};
}
function Ir({ level: e, look: t, combat: n, kit: r, records: i }) {
	return Re(e) || Ie(Fr(t, n, r)) || (i ?? []).some((e) => Ie(e?.spec)) ? ze() : null;
}
var Lr = class {
	constructor({ tileMap: e, rig: t, particles: n, audio: i, spawn: a, combat: o = !1, look: s = null, festival: c = !1, kit: l = "traveler" }) {
		this.tileMap = e, this.rig = t, this.particles = n, this.audio = i, this.sheet = o ? Le(Fr(s, o, l), { combat: !0 }) : c ? ln("the player posed by the story").createFestivalSheet(Fr(s, !1)) : Le(Fr(s, !1));
		let u = typeof a.facing == "string" && Object.hasOwn(Mr, a.facing) ? a.facing : "down";
		this.sprite = new I(this.sheet, o ? {
			...Xt,
			direction: u,
			combatFx: !0
		} : {
			...Xt,
			direction: u
		}), this.sprite.name = "Player", this.position = this.sprite.position, this.position.set(a.x, e.getHeight(a.x, a.z), a.z), this.facing = Mr[u].clone(), this.speed = 0, this.running = !1, this.frozen = !1, this.radius = Ar, this.action = null, this.faceOverride = null, this.moveOverride = null, this.scripted = null, this.speedMul = 1, this._move = {
			x: 0,
			z: 0
		}, this._dir = new r(), this._stepToggle = !1, this._dustTimer = 0, this._basisDir = new r(), this.sprite.onFrameChange = (e, t) => {
			if (!t) return;
			let n = t.startsWith("run");
			if (!n && !t.startsWith("walk") || e !== 0 && e !== 2) return;
			this._stepToggle = !this._stepToggle;
			let r = this._groundKind(), i = r === "wood" ? 1.25 : r === "stone" ? 1.1 : r === "sand" ? .85 : 1;
			this.audio?.playSfx("step", {
				volume: n ? .55 : .4,
				pitch: i * (this._stepToggle ? 1 : .94)
			}), n && this.particles.burst("footstep", this.position, 4);
		}, this.sprite.play("idle"), this.silhouetteMaterial = Nr(this.sprite.texture), this._silhouetteBase = this.silhouetteMaterial.color.clone(), this._silhouetteOn = !0, this._silhouetteFade = 1, this.silhouette = Pr(this.sprite.mesh.geometry, this.silhouetteMaterial, "Player.silhouette"), this.sprite.mesh.add(this.silhouette), this.talkSilhouetteMaterial = Nr(this.sprite.texture), this.talkSilhouette = Pr(this.sprite.mesh.geometry, this.talkSilhouetteMaterial, "Player.talkSilhouette"), this.talkSprite = null;
	}
	setSilhouetteLevel(e) {
		this.silhouetteMaterial.color.copy(this._silhouetteBase).multiplyScalar(e), this.talkSilhouetteMaterial.color.copy(this.silhouetteMaterial.color);
	}
	setSilhouetteEnabled(e) {
		this._silhouetteOn = !!e, this.talkSilhouetteMaterial.colorWrite = !!e, this.talkSilhouetteMaterial.depthWrite = !!e, this._applySilhouetteFade();
	}
	fadeSilhouette(e, t) {
		let n = +!e, r = t / .15, i = this._silhouetteFade;
		this._silhouetteFade = n > i ? Math.min(n, i + r) : Math.max(n, i - r), this._silhouetteFade !== i && this._applySilhouetteFade();
	}
	_applySilhouetteFade() {
		let e = this.silhouetteMaterial, t = this._silhouetteFade;
		e.opacity = jr * t;
		let n = this._silhouetteOn && t > .001;
		e.colorWrite = n, e.depthWrite = n;
	}
	setTalkSilhouette(e) {
		e !== this.talkSprite && (this.talkSilhouette.removeFromParent(), this.talkSprite = e?.mesh && e.texture ? e : null, this.talkSprite && (this.talkSilhouette.geometry = this.talkSprite.mesh.geometry, this.talkSilhouetteMaterial.map = this.talkSprite.texture, this.talkSprite.mesh.add(this.talkSilhouette)));
	}
	_groundKind() {
		let e = this.tileMap, t = this.position;
		for (let n of e.walkSurfaces) if (t.x >= n.minX && t.x <= n.maxX && t.z >= n.minZ && t.z <= n.maxZ) return "wood";
		let n = e.tileAt(Math.floor(t.x), Math.floor(t.z));
		if (!n) return "grass";
		let r = n.type.top;
		return r === "cobblestone" || r === "stone_tiles" || r === "moss_stone" ? "stone" : r === "sand" ? "sand" : "grass";
	}
	faceTowards(e, t) {
		let n = e - this.position.x, r = t - this.position.z, i = Math.hypot(n, r);
		i < 1e-4 || (this.facing.set(n / i, 0, r / i), this.sprite.faceVector(n, r));
	}
	teleport(e, t) {
		this.position.set(e, this.tileMap.getHeight(e, t), t), this.speed = 0;
	}
	arrive(e) {
		let t = typeof e.facing == "string" && Object.hasOwn(Mr, e.facing) ? e.facing : "down";
		this.teleport(e.x, e.z), this.facing.copy(Mr[t]), this.sprite.setDirection(t), this.running = !1, this.frozen = !1, this.scripted = null, this.moveOverride = null, this.faceOverride = null, this.speedMul = 1, this.setTalkSilhouette(null), this.sprite.speed = 1, this.sprite.play("idle");
	}
	moveBy(e, t) {
		let n = Math.hypot(e, t);
		if (n < 1e-9) return 1;
		let r = this.position, i = this.tileMap.move(r, e, t, Ar, .55, this._move), a = Math.hypot(i.x - r.x, i.z - r.z);
		return r.x = i.x, r.z = i.z, Math.min(1, a / n);
	}
	update(e, t) {
		let n = this.tileMap, r = this.position;
		if (this.action !== null) {
			this._followGround(e);
			return;
		}
		let i = 0, a = 0, o = !1, s = !1, c = this.scripted;
		if (c) i = c.x, a = c.z, s = !0, o = c.run;
		else if (!this.frozen && t) {
			let e = this.moveOverride;
			if (e) i = e.x, a = e.z, s = !0;
			else {
				let e = t.getMoveVector();
				i = e.x, a = e.y;
			}
			o = t.action("run");
		}
		let l = Math.min(1, Math.hypot(i, a)), u = this.faceOverride;
		if (l > .05) {
			let t = this._dir;
			if (s) t.set(i, 0, a);
			else {
				let { forward: e, right: n } = this.rig.getMoveBasis();
				t.set(0, 0, 0).addScaledVector(n, i).addScaledVector(e, a);
			}
			t.y = 0, t.normalize(), u && (o = !1), this.running = o;
			let c = (o ? kr : Or) * l * this.speedMul, d = n.move(r, t.x * c * e, t.z * c * e, Ar, .55, this._move), f = Math.hypot(d.x - r.x, d.z - r.z);
			r.x = d.x, r.z = d.z, this.speed = e > 0 ? f / e : 0, u ? (this.facing.set(u.x, 0, u.z), this.sprite.faceVector(u.x, u.z)) : (this.facing.copy(t), this.sprite.faceVector(t.x, t.z));
			let p = o ? "run" : "walk";
			this.sprite.play(p), this.sprite.speed = M(.55 + .45 * (this.speed / Math.max(.01, c)), .55, 1) * Math.max(.6, l);
		} else this.speed = 0, this.running = !1, this.sprite.play("idle"), this.sprite.speed = Qt[0] + .04, u && this.facing.set(u.x, 0, u.z), this.sprite.faceVector(this.facing.x, this.facing.z);
		this._followGround(e);
	}
	_followGround(e) {
		let t = this.position, n = this.tileMap.getHeight(t.x, t.z), r = n > t.y ? ce(22, e) : ce(16, e);
		t.y += (n - t.y) * r, Math.abs(n - t.y) < .001 && (t.y = n);
	}
	dispose() {
		this.silhouetteMaterial.dispose(), this.talkSilhouette.removeFromParent(), this.talkSprite = null, this.talkSilhouetteMaterial.dispose(), this.sprite.dispose(), this.sheet.dispose?.();
	}
}, Rr = .3, zr = Object.freeze({
	down: [0, 1],
	up: [0, -1],
	left: [-1, 0],
	right: [1, 0]
}), Br = .05, Vr = Math.PI * 2, Hr = Object.freeze({
	panic: [4.5, 9],
	cower: [7, 13],
	relief: [6, 12],
	cheer: [8, 16]
}), Ur = 15, Wr = 45, Gr = 2.5, Kr = 6, qr = /* @__PURE__ */ new WeakMap();
function Jr(e) {
	let t = qr.get(e);
	return t || qr.set(e, t = {
		last: -Infinity,
		recent: [],
		routedFrame: -1,
		routed: !1
	}), t;
}
var Yr = null, Xr = null, Zr = 5.5, Qr = 1.4, $r = class {
	constructor({ def: e, tileMap: t, sheetCache: n }) {
		this.def = e, this.id = e.id, this.name = e.name, this.tileMap = t, this.festival = it.includes(e.behaviour) || e.festival === !0;
		let i = JSON.stringify({
			preset: e.preset,
			...e.spec || {}
		}) + (this.festival ? "|festival" : ""), a = n?.get(i);
		if (!a) {
			let t = {
				...Be[e.preset],
				preset: e.preset,
				...e.spec || {}
			};
			a = this.festival ? ln(`the villager "${e.id}"`).createFestivalSheet(t) : Le(t), n?.set(i, a);
		}
		this.sheet = a, this.sprite = new I(a, {
			...Xt,
			direction: e.facing ?? "down"
		}), this.sprite.name = `NPC:${e.id}`, this.home = new r(e.home[0], 0, e.home[1]), this.position = this.sprite.position, this.position.set(e.home[0], t.getHeight(e.home[0], e.home[1]), e.home[1]), this.wander = e.wander ?? 1.2, this.speed = e.speed ?? 1, this.behaviour = lt.includes(e.behaviour) ? e.behaviour : "wander";
		let o = Math.max(.5, this.wander);
		this.chaseBounds = e.bounds ?? {
			minX: e.home[0] - o,
			maxX: e.home[0] + o,
			minZ: e.home[1] - o,
			maxZ: e.home[1] + o
		}, this.homeFacing = e.facing ?? "down", this.facing = new r(0, 0, 1);
		let s = Object.hasOwn(zr, this.sprite.direction) ? zr[this.sprite.direction] : zr.down;
		this.facing.set(s[0], 0, s[1]), this._faceYaw = null, this._faceRow = this.sprite.direction, this.talkRadius = e.talkRadius ?? 1.6, this.talkPoint = e.talkPoint ? new r(e.talkPoint[0], 0, e.talkPoint[1]) : null, this.rng = new le(oe(e.id)), this.collider = t.addCollider({
			type: "circle",
			x: this.position.x,
			z: this.position.z,
			r: .34,
			dynamic: !0
		}), this.state = "idle", this.timer = this.rng.range(.5, 3), this.target = new r(), this.talking = !1, this.present = !0, this.directed = !1, this.storyObj = null, this.storyTalk = null, this._out = {
			x: 0,
			z: 0
		}, this._stuck = 0, this._lookTimer = 0, this.idleSpeed = this.rng.range(Qt[0], Qt[1]), this.festival && (this.barkRng = new le(oe(`bark:${e.id}`)), this._barkT = this.barkRng.range(1.5, 9), this._calm = !1, this._reliefT = 0, this._spokeT = 0, this._threatT = this.rng.range(0, .25), this._danceSpeed = this.rng.range(.85, 1.15), this._runSpeed = Math.min(4.2, Math.max(2.6, this.speed * this.rng.range(2.9, 3.5)))), this._idle();
	}
	_idle() {
		this.sprite.play("idle", { speed: this.idleSpeed });
	}
	get panicking() {
		return this.behaviour === "panic" && this.present && !this.talking && !this.directed && !this._calm;
	}
	get cowering() {
		return this.behaviour === "cower" && this.present && !this.directed && !this._calm;
	}
	get interactPoint() {
		return this.talkPoint ? (this.talkPoint.y = this.position.y, this.talkPoint) : this.position;
	}
	beginTalk(e, t) {
		this.talking = !0, this.state = "talk", this._idle(), this.behaviour !== "still" && this.faceWorld(e - this.position.x, t - this.position.z);
	}
	endTalk() {
		this.talking = !1, this.state = "idle", this.timer = this.rng.range(1.2, 2.5);
	}
	faceWorld(e, t) {
		let n = Math.hypot(e, t);
		n > 1e-6 && (this.facing.set(e / n, 0, t / n), this._applyFacing(fe.uCameraYaw.value));
	}
	faceDir(e) {
		let t = Object.hasOwn(zr, e) ? zr[e] : null;
		t && this.faceWorld(t[0], t[1]);
	}
	_applyFacing(e) {
		this.sprite.faceVector(this.facing.x, this.facing.z, e), this._faceYaw = e, this._faceRow = this.sprite.direction;
	}
	_followCamera() {
		let e = this.sprite, t = fe.uCameraYaw.value;
		if (e.direction !== this._faceRow) {
			let n = e.direction === "right" ? 1 : e.direction === "left" ? -1 : 0, r = e.direction === "down" ? 1 : e.direction === "up" ? -1 : 0, i = Math.cos(t), a = Math.sin(t);
			this.facing.set(n * i + r * a, 0, r * i - n * a), this._faceYaw = t, this._faceRow = e.direction;
			return;
		}
		if (this._faceYaw === null) {
			this._applyFacing(t);
			return;
		}
		let n = t - this._faceYaw;
		n -= Math.round(n / Vr) * Vr, (n > Br || n < -.05) && this._applyFacing(t);
	}
	_withoutSelf(e) {
		let t = this.collider, n = t.x;
		t.x = Infinity;
		try {
			return e();
		} finally {
			t.x = n;
		}
	}
	_pickTarget(e = this.wander) {
		return this._withoutSelf(() => {
			for (let t = 0; t < 6; t++) {
				let t = this.rng.range(0, Math.PI * 2), n = this.rng.range(.4, e), r = this.home.x + Math.cos(t) * n, i = this.home.z + Math.sin(t) * n;
				if (this.tileMap.isWalkable(r, i)) return this.target.set(r, 0, i);
			}
			return this.target.copy(this.home);
		});
	}
	_walkTowards(e, t, n, r, i) {
		let a = this.position, o = t - a.x, s = n - a.z, c = Math.hypot(o, s);
		if (c < .08) return !0;
		if (i) {
			let e = i.x - a.x, t = i.z - a.z;
			if (Math.hypot(e, t) < 1 && e * o + t * s > 0) return this._idle(), !1;
		}
		let l = Math.min(c, r * e), u = this.collider, d = u.x;
		u.x = Infinity;
		let f = this.tileMap.move(a, o / c * l, s / c * l, Rr, .55, this._out);
		u.x = d;
		let p = Math.hypot(f.x - a.x, f.z - a.z);
		return a.x = f.x, a.z = f.z, this.faceWorld(o, s), this.sprite.play(r > 2.2 ? "run" : "walk"), this.sprite.speed = r > 2.2 ? .8 : Math.max(.45, r / 2.8), this._stuck = p < l * .25 ? this._stuck + e : 0, this._stuck > .4;
	}
	setPresent(e) {
		this.present = e, this.sprite.visible = e, e ? (this.collider.x = this.position.x, this.collider.z = this.position.z) : this.collider.x = Infinity;
	}
	direct() {
		this.directed = !0;
	}
	release() {
		this.directed = !1, this.state = "idle", this.timer = this.rng.range(1.2, 2.5), this._idle();
	}
	walkStep(e, t, n, r) {
		this.directed = !0, this._walkTowards(e, t, n, r ? Math.max(2.6, this.speed * 2) : Math.max(1.1, this.speed), null);
	}
	stopWalk() {
		this._idle();
	}
	placeAt(e, t) {
		this.position.set(e, this.tileMap.getHeight(e, t), t), this.present && (this.collider.x = e, this.collider.z = t);
	}
	setHome(e, t, { move: n = !1 } = {}) {
		let r = e - this.home.x, i = t - this.home.z;
		this.home.set(e, 0, t);
		let a = this.chaseBounds;
		this.chaseBounds = {
			minX: a.minX + r,
			maxX: a.maxX + r,
			minZ: a.minZ + i,
			maxZ: a.maxZ + i
		}, this.talkPoint && this.talkPoint.set(this.talkPoint.x + r, 0, this.talkPoint.z + i), n && this.placeAt(e, t);
	}
	teleportHome() {
		this.placeAt(this.home.x, this.home.z);
	}
	update(e, t) {
		let n = t.player, r = this.position;
		if (!this.present) return;
		if (!this.talking && !this.directed) switch (this.behaviour) {
			case "perform":
			case "post":
				this._updatePost(e, n);
				break;
			case "still": break;
			case "chase":
				this._updateChase(e, t);
				break;
			case "panic":
				this._updatePanic(e, t);
				break;
			case "dance":
			case "cheer":
				this._updateFestive(e, t);
				break;
			case "cower":
				this._updateCower(e, t);
				break;
			default: this._updateWander(e, n);
		}
		this._followCamera();
		let i = this.tileMap.getHeight(r.x, r.z);
		r.y += (i - r.y) * ce(18, e), this.collider.x = r.x, this.collider.z = r.z;
	}
	_updateWander(e, t, n = this.wander) {
		if (this.state === "idle") this._idle(), this.timer -= e, Math.hypot(t.x - this.position.x, t.z - this.position.z) < 2.4 && (this._lookTimer -= e, this._lookTimer <= 0 && (this.faceWorld(t.x - this.position.x, t.z - this.position.z), this._lookTimer = .4), this.timer = Math.max(this.timer, .8)), this.timer <= 0 && n > .2 && (this._pickTarget(n), this.state = "walk", this.timer = 6);
		else if (this.state === "walk") {
			this.timer -= e;
			let n = this._walkTowards(e, this.target.x, this.target.z, this.speed, t);
			(Math.hypot(this.target.x - this.position.x, this.target.z - this.position.z) < .1 || n || this.timer <= 0) && (this.state = "idle", this.timer = this.rng.range(2.5, 6.5), this._idle());
		}
	}
	_updatePost(e, t) {
		let n = this.position;
		if (Math.hypot(this.home.x - n.x, this.home.z - n.z) > .15) {
			this._walkTowards(e, this.home.x, this.home.z, this.speed, null);
			return;
		}
		if (this._idle(), this.timer -= e, Math.hypot(t.x - n.x, t.z - n.z) < 2.2) this.faceWorld(t.x - n.x, t.z - n.z), this.timer = 1;
		else if (this.timer <= 0) {
			let e = this.behaviour === "perform" ? [
				"down",
				"down",
				"left",
				"right"
			] : [
				"down",
				"left",
				"right",
				this.homeFacing,
				this.homeFacing
			];
			this.faceDir(this.rng.pick(e)), this.timer = this.rng.range(2.5, 5);
		}
	}
	_updateChase(e, t) {
		let n = t.chickens ?? [], r = this.chaseBounds;
		if (this._prey?.absent && (this._prey = null, this.state = "idle"), this.state === "idle" || !this._prey) {
			if (this._idle(), this.timer -= e, this.timer <= 0 && n.length) {
				let e = this._near ??= [];
				e.length = 0;
				for (let t = 0; t < n.length; t++) {
					let i = n[t].position;
					i.x > r.minX - 2 && i.x < r.maxX + 2 && i.z > r.minZ - 2 && i.z < r.maxZ + 2 && e.push(n[t]);
				}
				if (!e.length) {
					this.timer = 1;
					return;
				}
				this._prey = this.rng.pick(e), this.state = "walk", this.timer = this.rng.range(2.5, 4.5);
			}
			return;
		}
		let i = Math.min(r.maxX, Math.max(r.minX, this._prey.position.x)), a = Math.min(r.maxZ, Math.max(r.minZ, this._prey.position.z));
		this.timer -= e;
		let o = this._walkTowards(e, i, a, 2.6, t.player);
		(Math.hypot(i - this.position.x, a - this.position.z) < .55 || o || this.timer <= 0) && (this.state = "idle", this._prey = null, this.timer = this.rng.range(.8, 2.2));
	}
	_updatePanic(e, t) {
		if (this._calmed(t)) {
			this._updateCalm(e, t);
			return;
		}
		let n = this.position;
		if (this._threatT -= e, this._threatT <= 0) {
			this._threatT = .25;
			let e = this._threatNear(t.game);
			e && !(this.state === "flee" && (this.target.x - n.x) * (e.x - n.x) + (this.target.z - n.z) * (e.z - n.z) < 0) && this._flee(e.x, e.z);
		}
		switch (this.state) {
			case "run":
			case "flee": {
				this.timer -= e;
				let r = this.state === "flee", i = this._walkTowards(e, this.target.x, this.target.z, r ? this._runSpeed * 1.1 : this._runSpeed, r ? null : t.player);
				(Math.hypot(this.target.x - n.x, this.target.z - n.z) < .15 || i || this.timer <= 0) && (this.rng.chance(r ? .55 : .3) ? (this.state = "cower", this.timer = this.rng.range(1.2, 2.8), this.sprite.play("cower")) : (this.state = "look", this.timer = this.rng.range(.25, .8), this._idle(), this.faceDir(this.rng.pick([
					"down",
					"left",
					"right",
					"up"
				]))));
				break;
			}
			case "cower":
				this.sprite.play("cower"), this.timer -= e, this.timer <= 0 && this._runOn();
				break;
			case "look":
				this._idle(), this.timer -= e, this.timer <= 0 && this._runOn();
				break;
			default: this._runOn();
		}
		this._bark(e, t, "panic");
	}
	_runOn() {
		this._pickTarget(), this.state = "run", this.timer = 5;
	}
	_flee(e, t) {
		let n = this.position, r = n.x - e, i = n.z - t, a = Math.hypot(r, i);
		a < .001 ? (r = 1, i = 0) : (r /= a, i /= a);
		let o = Math.atan2(i, r), s = Math.max(2.5, this.wander * 1.5), c = -1;
		this._withoutSelf(() => {
			for (let r = 0; r < 8; r++) {
				let i = o + (r % 2 ? 1 : -1) * Math.ceil(r / 2) * .42 + this.rng.range(-.15, .15), l = this.rng.range(3, 5.5), u = n.x + Math.cos(i) * l, d = n.z + Math.sin(i) * l, f = u - this.home.x, p = d - this.home.z, m = Math.hypot(f, p);
				if (m > s && (u = this.home.x + f / m * s, d = this.home.z + p / m * s), !this.tileMap.isWalkable(u, d)) continue;
				let h = Math.hypot(u - e, d - t);
				if (h > a + 1.5) return this.target.set(u, 0, d), !0;
				h > c && (c = h, this.target.set(u, 0, d));
			}
			return c > a;
		}) || this.target.copy(this.home), this.state = "flee", this.timer = 3.5;
	}
	_threatNear(e) {
		let t = e?.combat;
		if (!t) return null;
		let n = this.position, r = null, i = Infinity, a = t.enemies;
		for (let e = 0; e < a.length; e++) {
			let t = a[e];
			if (!t.alive || !t.sprite.visible) continue;
			let o = Math.hypot(t.position.x - n.x, t.position.z - n.z);
			o < Zr && o < i && (i = o, r = t.position);
		}
		let o = t._mk;
		for (let e = 0; e < o.length; e++) {
			let t = o[e];
			if (t.h < 0) continue;
			let a = t.spec;
			if (a.style !== "enemy" || a.shape !== "circle" && a.shape !== "ring") continue;
			let s = Math.hypot(a.x - n.x, a.z - n.z);
			s < a.r + Qr && s - a.r < i && (i = s - a.r, r = a);
		}
		return r;
	}
	_updateFestive(e, t) {
		let n = this.position, r = Math.hypot(this.home.x - n.x, this.home.z - n.z);
		if (this.state === "step") {
			this.timer -= e, (this._walkTowards(e, this.target.x, this.target.z, 1.2, t.player) || this.timer <= 0 || Math.hypot(this.target.x - n.x, this.target.z - n.z) < .08) && (this.state = "idle", this.timer = 0);
			return;
		}
		if (r > Math.max(.6, this.wander) + .3) {
			this._walkTowards(e, this.home.x, this.home.z, this.speed, t.player);
			return;
		}
		if (this.timer -= e, this.timer <= 0) {
			let e = this.behaviour === "dance", t = this.rng.next();
			if (e && t < .25 && this.wander > .3) {
				this._pickTarget(), this.state = "step", this.timer = 2;
				return;
			}
			e ? (this.state = t < .85 ? "dance" : "cheer", this.timer = this.rng.range(3, 7), t < .6 && this.faceDir(this.rng.pick([
				"down",
				"left",
				"right",
				"down"
			]))) : (this.state = this.state === "cheer" ? "rest" : "cheer", this.timer = this.state === "cheer" ? this.rng.range(2, 4.5) : this.rng.range(1, 3), t < .3 && this.faceDir(this.rng.pick([
				"down",
				"left",
				"right",
				this.homeFacing
			])));
		}
		this.state === "dance" ? this.sprite.play("dance", { speed: this._danceSpeed }) : this.state === "cheer" ? this.sprite.play("cheer", { speed: this._danceSpeed }) : this._idle(), this._bark(e, t, "cheer");
	}
	_updateCower(e, t) {
		if (this._calmed(t)) {
			this._updateCalm(e, t);
			return;
		}
		let n = this.position;
		if (Math.hypot(this.home.x - n.x, this.home.z - n.z) > .3) {
			this._walkTowards(e, this.home.x, this.home.z, Math.max(1.2, this.speed), null);
			return;
		}
		this.timer -= e, this.timer <= 0 && (this.state = this.state === "look" ? "cower" : this.rng.chance(.3) ? "look" : "cower", this.timer = this.state === "look" ? this.rng.range(.4, .9) : this.rng.range(2.5, 6), this.state === "look" && this.faceDir(this.rng.pick([
			"down",
			"left",
			"right"
		]))), this.state === "look" ? this._idle() : this.sprite.play("cower"), this._bark(e, t, "cower");
	}
	_calmed(e) {
		let t = ei(e.game, this.tileMap);
		return t === this._calm ? t : (this._calm = t, t ? (this._reliefT = Wr, this._spokeT > 0 && e.game.ui.emotes?.clear(this.sprite), this.state = "relief", this.timer = this.rng.range(1.5, 3.5), this.faceWorld(e.player.x - this.position.x, e.player.z - this.position.z)) : (this.state = "idle", this.timer = 0), t);
	}
	_updateCalm(e, t) {
		this.state === "relief" ? (this.sprite.play("cheer", { speed: this._danceSpeed }), this.timer -= e, this.timer <= 0 && (this.state = "idle", this.timer = this.rng.range(.4, 1.5), this._idle())) : this._updateWander(e, t.player, Math.min(this.wander, Gr)), this._reliefT > 0 && (this._reliefT -= e, this._bark(e, t, "relief"));
	}
	_bark(e, t, n) {
		if (this._spokeT > 0 && (this._spokeT -= e), this._barkT -= e, this._barkT > 0) return;
		let r = this.barkRng, [i, a] = Hr[n];
		this._barkT = r.range(i, a);
		let o = t.game;
		if (!o || o.mode !== "play" || o.ui.dialog.isOpen || o.story?.cardUp || o.ui.endCard?.active) return;
		let s = Jr(this.tileMap), c = o.engine.time.elapsed;
		if (c - s.last < 1.7999990000000001) {
			this._barkT = r.range(.5, 2);
			return;
		}
		if (Math.hypot(t.player.x - this.position.x, t.player.z - this.position.z) > Ur) return;
		s.last = c, this._spokeT = Kr;
		let l = ln("a bark").SIEGE_BARKS[n], u = s.recent, d = r.pick(l);
		for (let e = 0; e < 4 && u.includes(d); e++) d = r.pick(l);
		u.push(d), u.length > Math.min(4, l.length - 1) && u.shift();
		let f = o.ui.emotes;
		f && ti(o) && f.bark(this.sprite, R(`siege.${d}`), void 0, { offsetY: this.def.preset === "child" ? 1.9 : 2.35 });
	}
	hush(e) {
		this._spokeT > 0 && e?.clear(this.sprite);
	}
	dispose() {
		this.tileMap.removeCollider(this.collider), this.sprite.dispose();
	}
};
function ei(e, t) {
	let n = e?.combat;
	if (!n) return !1;
	let r = Jr(t), i = e.engine.time.frame;
	if (r.routedFrame === i) return r.routed;
	r.routedFrame = i;
	let a = n.enemies, o = a.length > 0;
	for (let e = 0; o && e < a.length; e++) a[e].alive && a[e].sprite.visible && (o = !1);
	return r.routed = o, o;
}
function ti(e) {
	let t = vt();
	if (Yr === t) return !0;
	let { registerSiegeStrings: n, SIEGE_STRINGS: r } = ln("a bark");
	if (n(), !Xr) {
		let n = e.ui?.fonts, i = r[t] ?? r.en;
		Xr = (n ? n.ensure(Object.values(i)) : Promise.resolve()).then(() => {
			Yr = t, Xr = null;
		});
	}
	return !1;
}
//#endregion
//#region src/game/Critters.js
var ni = class {
	constructor({ sheet: e, tileMap: t, x: n, z: i, seed: a, bounds: o = null, radius: s = .15, speed: c = .9, opts: l = {} }) {
		this.tileMap = t, this.sprite = new I(e, {
			...Xt,
			blobSize: [.55, .26],
			...l
		}), this.position = this.sprite.position, this.position.set(n, t.getHeight(n, i), i), this.home = new r(n, 0, i), this.start = {
			x: n,
			z: i
		}, this.absent = !1, this.bounds = o, this.radius = s, this.speed = c, this.rng = new le(a), this.state = "idle", this.timer = this.rng.range(.2, 2.5), this.target = new r(n, 0, i), this._out = {
			x: 0,
			z: 0
		}, this.sprite.setDirection(this.rng.pick([
			"down",
			"left",
			"right",
			"up"
		])), this.sprite.play("idle");
	}
	reset() {
		let { x: e, z: t } = oi(this.tileMap, this.start.x, this.start.z);
		this.position.set(e, this.tileMap.getHeight(e, t), t), this.target.set(e, 0, t), this.state = "idle", this.timer = this.rng.range(.2, 2.5), this.sprite.speed = 1, this.sprite.opacity !== 1 && (this.sprite.opacity = 1), this.sprite.visible = !0, this.sprite.play("idle");
	}
	_clampTarget(e) {
		let t = this.bounds;
		return t ? (e.x = Math.min(t.maxX, Math.max(t.minX, e.x)), e.z = Math.min(t.maxZ, Math.max(t.minZ, e.z)), e) : e;
	}
	_step(e, t, n, r, i = "walk") {
		let a = this.position, o = t - a.x, s = n - a.z, c = Math.hypot(o, s);
		if (c < .05) return !0;
		let l = Math.min(c, r * e), u = this.tileMap.move(a, o / c * l, s / c * l, this.radius, .55, this._out), d = Math.hypot(u.x - a.x, u.z - a.z);
		return a.x = u.x, a.z = u.z, this.sprite.faceVector(o, s), this.sprite.play(i), d < l * .2;
	}
	_followGround(e) {
		let t = this.position, n = this.tileMap.getHeight(t.x, t.z);
		t.y += (n - t.y) * ce(18, e);
	}
}, ri = class extends ni {
	update(e, t) {
		let n = this.position, r = 0, i = 0;
		for (let e of t) {
			let t = n.x - e.x, a = n.z - e.z, o = Math.hypot(t, a);
			o < 1.7 && o > .001 && (r += t / o * (1.7 - o), i += a / o * (1.7 - o));
		}
		if ((r || i) && this.state !== "flee") {
			let e = Math.hypot(r, i);
			this.target.set(n.x + r / e * 1.6 + this.rng.range(-.4, .4), 0, n.z + i / e * 1.6 + this.rng.range(-.4, .4)), this._clampTarget(this.target), this.state = "flee", this.timer = this.rng.range(.5, .8);
		}
		if (this.timer -= e, this.state === "flee") {
			let t = this._step(e, this.target.x, this.target.z, 3.4, "walk");
			this.sprite.speed = 2.2, (t || this.timer <= 0) && (this.state = "idle", this.timer = this.rng.range(.6, 2));
		} else if (this.state === "walk") {
			let t = this._step(e, this.target.x, this.target.z, this.speed, "walk");
			this.sprite.speed = 1, (t || this.timer <= 0 || Math.hypot(this.target.x - n.x, this.target.z - n.z) < .06) && (this.state = "idle", this.timer = this.rng.range(1.2, 4));
		} else if (this.sprite.play("idle"), this.sprite.speed = 1, this.timer <= 0) {
			let e = this.rng.range(0, Math.PI * 2), t = this.rng.range(.4, 1.4);
			this._clampTarget(this.target.set(n.x + Math.cos(e) * t, 0, n.z + Math.sin(e) * t)), this.state = "walk", this.timer = 3;
		}
		this._followGround(e);
	}
}, ii = class extends ni {
	constructor(e) {
		super(e), this.roam = e.roam ?? 3.2;
	}
	update(e, t) {
		let n = this.position;
		if (this.timer -= e, this.state === "walk") (this._step(e, this.target.x, this.target.z, this.speed, "walk") || this.timer <= 0 || Math.hypot(this.target.x - n.x, this.target.z - n.z) < .06) && (this.state = "idle", this.timer = this.rng.range(3, 8));
		else if (this.sprite.play("idle"), Math.hypot(t.x - n.x, t.z - n.z) < 2 && this.sprite.faceVector(t.x - n.x, t.z - n.z), this.timer <= 0) {
			for (let e = 0; e < 6; e++) {
				let e = this.rng.range(0, Math.PI * 2), t = this.rng.range(Math.min(1, this.roam * .5), this.roam), n = this.home.x + Math.cos(e) * t, r = this.home.z + Math.sin(e) * t;
				if (this.tileMap.isWalkable(n, r)) {
					this.target.set(n, 0, r);
					break;
				}
			}
			this.state = "walk", this.timer = 5;
		}
		this._followGround(e);
	}
}, ai = {
	chicken: {
		cls: ri,
		speed: .8,
		radius: .15,
		opts: { blobSize: [.5, .24] }
	},
	cat: {
		cls: ii,
		speed: 1.1,
		radius: .18,
		sheet: {
			fur: "#d8893c",
			fur2: "#a95a24",
			fur3: "#f3c27a"
		},
		opts: { blobSize: [.7, .3] }
	},
	dog: {
		cls: ii,
		speed: 1.3,
		radius: .22,
		opts: { blobSize: [.8, .34] }
	},
	bird: {
		cls: class extends ni {
			constructor(e) {
				super(e), this.vel = new r(), this.hidden = 0, this.roam = e.roam ?? 1.6;
			}
			reset() {
				super.reset(), this.vel.set(0, 0, 0);
			}
			update(e, t) {
				let n = this.position;
				if (this.state === "fly") {
					this.vel.y += 1.6 * e, n.addScaledVector(this.vel, e), this.sprite.play("walk"), this.sprite.speed = 3, this.sprite.opacity = Math.max(0, this.sprite.opacity - e * .7), this.sprite.opacity <= 0 && (this.state = "away", this.sprite.visible = !1, this.timer = this.rng.range(9, 15));
					return;
				}
				if (this.state === "away") {
					this.timer -= e, this.timer <= 0 && Math.hypot(t.x - this.home.x, t.z - this.home.z) > 5 && (n.set(this.home.x + this.rng.range(-.8, .8), 0, this.home.z + this.rng.range(-.8, .8)), n.y = this.tileMap.getHeight(n.x, n.z), this.sprite.visible = !0, this.sprite.opacity = 0, this.state = "land", this.sprite.speed = 1);
					return;
				}
				this.state === "land" && (this.sprite.opacity = Math.min(1, this.sprite.opacity + e * 1.5), this.sprite.opacity >= 1 && (this.state = "idle", this.timer = 1));
				let r = Math.hypot(t.x - n.x, t.z - n.z);
				if (r < 2.3 && this.state !== "land") {
					let e = (n.x - t.x) / Math.max(r, .001), i = (n.z - t.z) / Math.max(r, .001);
					this.vel.set(e * 2.6 + this.rng.range(-.6, .6), 1.8, i * 2.6 - .8), this.sprite.faceVector(this.vel.x, this.vel.z), this.state = "fly";
					return;
				}
				if (this.timer -= e, this.state === "hop") (this._step(e, this.target.x, this.target.z, 1.1, "walk") || this.timer <= 0) && (this.state = "idle", this.timer = this.rng.range(.6, 2.4));
				else if (this.timer <= 0) {
					let e = this.rng.range(0, Math.PI * 2);
					this.target.set(n.x + Math.cos(e) * .5, 0, n.z + Math.sin(e) * .5), Math.hypot(this.target.x - this.home.x, this.target.z - this.home.z) > this.roam && this.target.lerp(this.home, .6), this.state = "hop", this.timer = .6;
				} else this.sprite.play("idle");
				this._followGround(e);
			}
		},
		speed: .9,
		radius: .1,
		opts: {
			blobSize: [.35, .18],
			castShadow: !1
		}
	}
};
function oi(e, t, n) {
	if (e.isWalkable(t, n)) return {
		x: t,
		z: n
	};
	for (let r = .25; r <= 4.001; r += .25) {
		let i = Math.max(8, Math.round(r * 12));
		for (let a = 0; a < i; a++) {
			let o = a / i * Math.PI * 2, s = t + Math.cos(o) * r, c = n + Math.sin(o) * r;
			if (e.isWalkable(s, c)) return {
				x: s,
				z: c
			};
		}
	}
	return {
		x: t,
		z: n
	};
}
var si = class {
	constructor({ tileMap: e, scene: t, spriteManager: n, groups: r = [] }) {
		this.tileMap = e, this.sheets = /* @__PURE__ */ new Map(), this.chickens = [], this.cats = [], this.birds = [], this.all = [], this.storyGroups = [];
		for (let e of r) try {
			this._spawnGroup(e);
		} catch (t) {
			console.warn(`[Luminati] could not create critters "${e.id}":`, t);
		}
		this.cat = this.cats[0] ?? null, this.throttle = null;
		for (let e of this.all) t.add(e.sprite), n.add(e.sprite);
	}
	_sheet(e) {
		let t = this.sheets.get(e);
		return t || (t = Fe(e, ai[e].sheet ?? {}), this.sheets.set(e, t)), t;
	}
	_spawnGroup(e) {
		let t = Ae(ai, e.kind) ? e.kind : "chicken", n = ai[t], r = this.tileMap, i = Number(e.x) || 0, a = Number(e.z) || 0, o = Math.max(.3, Number(e.radius) || 2.5), s = ut(e) ?? {
			minX: i - o,
			maxX: i + o,
			minZ: a - o,
			maxZ: a + o
		}, c = Number.isFinite(e.seedBase) ? e.seedBase : oe(String(e.id ?? t)) % 1e4, l = this._sheet(t), u = ct(e, (e, t) => r.isWalkable(e, t)), d = [];
		Gt(e) && this.storyGroups.push({
			obj: e,
			critters: d,
			present: !0
		});
		for (let i = 0; i < u.length; i++) {
			let [a, f] = u[i], p = new n.cls({
				sheet: l,
				tileMap: r,
				seed: c + i,
				x: a,
				z: f,
				bounds: t === "chicken" ? s : null,
				radius: n.radius,
				speed: Number.isFinite(e.speed) ? Math.max(.1, e.speed) : n.speed,
				roam: o,
				opts: n.opts
			});
			p.kind = t, d.push(p), this.all.push(p), t === "chicken" ? this.chickens.push(p) : t === "bird" ? this.birds.push(p) : this.cats.push(p);
		}
	}
	standClear(e) {
		for (let t of this.all) {
			if (t.absent) continue;
			let n = t.position;
			if (!e(n.x, n.z) || t.tileMap.isWalkable(n.x, n.z)) continue;
			let r = oi(t.tileMap, n.x, n.z);
			n.set(r.x, t.tileMap.getHeight(r.x, r.z), r.z), t.target.set(r.x, 0, r.z);
		}
	}
	applyStory(e) {
		let t = !1;
		for (let n of this.storyGroups) {
			let r = !!e(n.obj);
			if (r !== n.present) {
				n.present = r, t = !0;
				for (let e of n.critters) e.absent = !r, r ? e.reset() : e.sprite.visible = !1;
			}
		}
		if (t) {
			this.chickens.length = 0;
			for (let e of this.all) e.kind === "chicken" && !e.absent && this.chickens.push(e);
		}
		return t;
	}
	update(e, { player: t, threats: n }) {
		let r = this.all, i = this.throttle;
		i && (this._frame = (this._frame ?? 0) + 1, this._acc ??= new Float32Array(r.length));
		for (let a = 0; a < r.length; a++) {
			let o = r[a];
			if (!o.absent) {
				if (i) {
					this._acc[a] += e;
					let r = o.position;
					if ((r.x - i.focus.x) ** 2 + (r.z - i.focus.z) ** 2 >= i.far2 && (this._frame + a) % i.every !== 0) continue;
					o.update(Math.min(this._acc[a], .25), o.kind === "chicken" ? n : t), this._acc[a] = 0;
				} else o.update(e, o.kind === "chicken" ? n : t);
			}
		}
	}
	dispose(e) {
		for (let t of this.all) e?.remove(t.sprite), t.sprite.removeFromParent(), t.sprite.dispose();
		for (let e of this.sheets.values()) e.dispose?.();
		this.sheets.clear();
	}
}, ci = [
	{
		h: 6.5,
		id: "dawn",
		name: "Dawn"
	},
	{
		h: 12.5,
		id: "midday",
		name: "Midday"
	},
	{
		h: 17.2,
		id: "golden",
		name: "Golden Hour"
	},
	{
		h: 18.9,
		id: "dusk",
		name: "Dusk"
	},
	{
		h: 22.5,
		id: "night",
		name: "Night"
	}
], li = class {
	constructor({ lighting: e, particles: t, postfx: n, godRays: r, world: i }) {
		this.lighting = e, this.particles = t, this.postfx = n, this.godRays = r, this.tuning = {
			sunMul: 1,
			ambientMul: 1,
			fogMul: 2,
			exposureMul: 1,
			pointLightMul: 1,
			windStrength: 1,
			godRays: 1,
			dust: 1,
			fireflies: 1,
			leaves: 1,
			petals: 1,
			smoke: 1,
			mist: 1,
			gradeTemperature: n.settings.grade.temperature,
			gradeSaturation: n.settings.grade.saturation
		}, this.zoomFog = 1, this.gust = 0, this._gust = 0, this.indoors = !1, this.snowHold = null, this.frostCover = 0, this.frostAmount = 0, this.snowFloor = 0, this.thaw = null, this.frozenMist = /* @__PURE__ */ new Set(), this.setWorld(i), rn.value = 0, this.weather = "clear", this._w = { ..._n.clear }, this._transition = null, this.rain = t.createEmitter(gn("rain", { intensity: 0 })), this.snow = t.createEmitter(gn("snow", { intensity: 0 }));
	}
	setWorld(e) {
		this.world = e, this.gust = this._gust = 0, this.frozenMist?.clear(), this._env = e?.level?.environment ?? {}, this.indoors = Et(this._env);
		let t = Number(e?.level?.environment?.fogScale);
		this.levelFog = Number.isFinite(t) && t > 0 ? t : 1;
		let n = e.water;
		this._waterBase = n ? e.waterBase ??= {
			brightness: n.uniforms.uBrightness.value,
			glint: n.uniforms.uGlint.value
		} : null;
	}
	get shown() {
		return Mt(this._env, this.weather);
	}
	get time() {
		return this.lighting.timeOfDay;
	}
	get snowCover() {
		return Math.max(rn.value, this.frostCover * this.frostAmount);
	}
	set snowCover(e) {
		e = M(Number(e) || 0), this.frostCover > 0 ? this.frostAmount = M(e / this.frostCover) : rn.value = e;
	}
	get transitioning() {
		return !!this._transition;
	}
	setTime(e, { duration: t = 0 } = {}) {
		if (e = Number(e), !Number.isFinite(e)) return;
		let n = (e % 24 + 24) % 24;
		if (t <= 0) {
			this._transition = null, this.lighting.setTime(n);
			return;
		}
		let r = this.lighting.timeOfDay, i = n - r;
		i < 0 && (i += 24), this._transition = {
			from: r,
			delta: i,
			t: 0,
			duration: t
		};
	}
	cycleTime() {
		let e = this._transition ? (this._transition.from + this._transition.delta) % 24 : this.lighting.timeOfDay, t = ci.find((t) => t.h > e + .05);
		return t ||= ci[0], this.setTime(t.h, { duration: 2 }), t;
	}
	setWeather(e, { instant: t = !1 } = {}) {
		if (!Object.hasOwn(_n, e)) return this.weather;
		if (this.weather = e, t) {
			let e = this.shown;
			Object.assign(this._w, _n[e]), rn.value = this._settled(e);
		}
		return e;
	}
	_settled(e) {
		return Math.max(this.frostCover > 0 && e === "frost" ? 0 : un(e), this.snowFloor);
	}
	settleSnow() {
		rn.value = this._settled(this.shown);
	}
	cycleWeather() {
		let e = bn.indexOf(this.weather);
		return this.setWeather(bn[(e + 1) % bn.length]);
	}
	factor(e) {
		return this._w[e];
	}
	update(e) {
		let t = this._transition;
		if (t) {
			t.t += e;
			let n = P(0, 1, M(t.t / t.duration));
			this.lighting.setTime(t.from + t.delta * n), t.t >= t.duration && (this._transition = null);
		}
		let n = this.shown, r = _n[n], i = ce(1.1, e), a = this._w;
		for (let e = 0; e < Cn.length; e++) {
			let t = Cn[e];
			a[t] += (r[t] - a[t]) * i;
		}
		let o = this.tuning, s = this.lighting.settings;
		vn(s, a, o), s.fogMul = o.fogMul * a.fog * this.zoomFog * this.levelFog, this._gust += (this.gust - this._gust) * ce(this.gust > this._gust ? 7 : 2.2, e), this._gust < .001 && !this.gust && (this._gust = 0), En(a, o.windStrength, this._gust);
		let c = this.postfx.settings.grade;
		fn(c, a, o.gradeTemperature, o.gradeSaturation), c.saturation -= Tn * this.lighting.nightFactor;
		let l = a.overcast;
		wn(this.lighting, l), this.godRays.intensity = o.godRays * a.rays * Sn(this.lighting.timeOfDay);
		let u = this.lighting.nightFactor, d = this.world, f = d.emitters;
		f.dust && (f.dust.intensity = o.dust * a.dust);
		let p = d.areaEmitters ?? [];
		for (let e = 0; e < p.length; e++) {
			let t = pn(p[e].preset, a, o, u);
			t !== null && (p[e].emitter.intensity = t);
		}
		let m = d.propEmitters;
		for (let e = 0; e < m.length; e++) {
			let t = m[e], n = t.preset ?? t.config?.preset;
			n === "smoke" ? t.intensity = o.smoke : n === "mist" && (t.intensity = this.frozenMist.has(t) ? 0 : o.mist);
		}
		xn(d.lights, d.lightPool ?? null, l), dn(d.emissiveEntries, l), d.glassMaterial && d.glassMaterial.color.setScalar(mn(u, l));
		let h = this._waterBase;
		if (h) {
			let e = d.water.uniforms, t = yn(u);
			e.uBrightness.value = h.brightness * t.brightness, e.uGlint.value = h.glint * t.glint;
		}
		this.rain.intensity = hn(a.rain), this.snow.intensity = hn(a.snow);
		let g = this._settled(n), _ = g > rn.value ? 1 / 15 : 1 / 8;
		rn.value += M(g - rn.value, -_ * e, _ * e), this.snowHold === null ? this.frostAmount > 0 && (this.frostAmount = Math.max(0, this.frostAmount - e / 8)) : this.frostAmount = Math.min(1, this.frostAmount + e / 3), this.thaw?.update(e);
	}
	dispose() {
		this.rain.dispose(), this.snow.dispose();
	}
}, ui = class {
	constructor({ engine: e, postfx: t, maxPixelRatio: n = e.maxPixelRatio, pixelBudget: r = 21e5, slowMs: i = 13.5, fastMs: a = 8.5, minScale: o = .7 }) {
		this.engine = e, this.postfx = t, this.maxPixelRatio = n, this.pixelBudget = r, this.slowMs = i, this.fastMs = a, this.minScale = o, this.enabled = !0, this.manual = !1, this.gpuMs = 0, this.medianMs = 0, this._w = -1, this._h = -1, this._timer = 0, this._cooldown = 2, this._slow = 0, this._fast = 0, this._samples = [], this._sorted = [], this._timings = t.enableTimings(!0);
	}
	update(e) {
		let t = this.engine;
		if (t.width !== this._w || t.height !== this._h) {
			this._w = t.width, this._h = t.height;
			let e = Math.min(this.maxPixelRatio, Math.sqrt(this.pixelBudget / Math.max(1, this._w * this._h)));
			Math.abs(t.maxPixelRatio - e) > .001 && (t.maxPixelRatio = e, t.resize());
		}
		if (!this._timings || !this.enabled || this.manual || (this._cooldown -= e, this._timer += e, this._timer < .5)) return;
		this._timer = 0;
		let n = this.postfx.timings, r = 0;
		for (let e in n) r += n[e];
		if (this.gpuMs = r, r <= 0) return;
		let i = this._samples;
		if (i.push(r), i.length > 5 && i.shift(), i.length < 3) return;
		let a = this._sorted;
		a.length = 0;
		for (let e = 0; e < i.length; e++) a.push(i[e]);
		a.sort((e, t) => e - t);
		let o = a[a.length >> 1];
		if (this.medianMs = o, this._slow = o > this.slowMs ? this._slow + 1 : 0, this._fast = o < this.fastMs ? this._fast + 1 : 0, this._cooldown > 0) return;
		let s = t.renderScale;
		this._slow >= 4 && s > this.minScale + .001 ? (t.renderScale = Math.max(this.minScale, Math.round((s - .1) * 100) / 100), this._settle()) : this._fast >= 20 && s < .999 && (t.renderScale = Math.min(1, Math.round((s + .1) * 100) / 100), this._settle());
	}
	_settle() {
		this._cooldown = 3, this._slow = 0, this._fast = 0, this._samples.length = 0;
	}
	dispose() {
		this._timings && this.postfx.enableTimings(!1);
	}
};
//#endregion
//#region src/game/DebugControls.js
function di(e) {
	let { ui: t, lighting: n, postfx: r, rig: i, weather: a, engine: o } = e, s = t.debug, c = s.addFolder("Time & Weather"), l = {
		get hour() {
			return n.timeOfDay;
		},
		set hour(e) {
			a.setTime(e);
		},
		get weather() {
			return a.weather;
		},
		set weather(t) {
			e.setWeather(t);
		}
	};
	c.add(l, "hour", 0, 24, .01).name("time of day").listen(), c.add(n, "timeSpeed", 0, 2, .01).name("speed (h / s)"), c.add(n, "paused").listen(), c.add(l, "weather", bn).listen(), c.add({ next: () => e.cycleTime() }, "next").name("next preset (T)");
	let u = r.settings, d = s.addFolder("Post FX");
	d.add(u, "enabled").name("post-processing");
	let f = d.addFolder("Depth of field");
	f.add(u.dof, "enabled"), f.add(u.dof, "debug").name("CoC debug view"), f.add(u.dof, "autoFocus"), f.add(u.dof, "focusSpeed", .5, 20, .1).name("autofocus speed"), f.add(u.dof, "focusDistance", 2, 80, .1).listen(), f.add(u.dof, "focusRange", .5, 30, .1), f.add(u.dof, "maxBlur", 0, 32, .1), f.add(u.dof, "nearScale", 0, 3, .01), f.add(u.dof, "farScale", 0, 3, .01), f.add(u.dof, "tiltShift", 0, 1, .01), f.add(u.dof, "tiltCenter", 0, 1, .01), f.add(u.dof, "tiltWidth", 0, 1, .01), f.add(u.dof, "tiltFeather", .01, 1, .01), f.add(u.dof, "bokehBoost", 0, 4, .01), f.add(u.dof, "bokehThreshold", .1, 6, .01), f.add(u.dof, "bokehSprites"), f.close();
	let p = d.addFolder("Bloom");
	p.add(u.bloom, "enabled"), p.add(u.bloom, "strength", 0, 2, .01), p.add(u.bloom, "radius", 0, 1, .01), p.add(u.bloom, "threshold", 0, 3, .01), p.add(u.bloom, "knee", 0, 1, .01), p.add(u.bloom, "warmth", 0, 1, .01), p.close();
	let m = d.addFolder("Grade");
	m.add(u.grade, "enabled"), m.add(u.grade, "exposure", .2, 2, .01), m.add(u.grade, "contrast", .5, 1.6, .01), m.add(a.tuning, "gradeSaturation", 0, 2, .01).name("saturation"), m.add(a.tuning, "gradeTemperature", -.5, .5, .01).name("temperature"), m.add(u.grade, "tint", -.5, .5, .01), m.add(u.grade, "vignette", 0, 1.5, .01), m.add(u.grade, "vignetteSoftness", .05, 1.5, .01), "vignetteRoundness" in u.grade && m.add(u.grade, "vignetteRoundness", 0, 1, .01), m.add(u.grade, "grain", 0, .2, .001), m.add(u.grade, "grainSize", 1, 4, u.cinematic.enabled ? .1 : 1).name("grain size (px)"), m.add(u.grade, "chromaticAberration", 0, .01, 1e-4), m.add(u.grade, "sharpen", 0, 1, .01), m.add(u.grade, "dither", 0, 2, .01);
	let h = m.addFolder("Split toning & vignette colour"), g = (e, t, n, r) => {
		[
			"r",
			"g",
			"b"
		].forEach((i, a) => {
			h.add({
				get v() {
					return e[a];
				},
				set v(t) {
					e[a] = t;
				}
			}, "v", n, r, .005).name(`${t} ${i}`);
		});
	};
	g(u.grade.shadowsTint, "shadows", -.2, .2), g(u.grade.highlightsTint, "highlights", -.2, .2), u.grade.vignetteColor && g(u.grade.vignetteColor, "vignette", 0, .3), h.close(), m.close();
	let _ = d.addFolder("Cinematic");
	_.add(u.cinematic, "enabled").name("cinematic stage"), _.add(u.cinematic, "streaks", 0, 4, .01), _.add(u.cinematic, "streakThreshold", 0, 4, .01).name("streak threshold"), _.add(u.cinematic, "streakTintMix", 0, 1, .01).name("streak tint"), _.add(u.cinematic, "bokehSquash", 1, 3, .01).name("oval bokeh"), _.add(u.cinematic, "tealOrange", 0, 1, .01).name("orange & teal"), _.add(u.cinematic, "filmCurve", 0, 1, .01).name("print curve"), _.add(u.cinematic, "grainChroma", 0, 1, .01).name("grain colour"), _.close(), d.close();
	let v = a.tuning, y = s.addFolder("Lighting");
	y.add(v, "sunMul", 0, 3, .01).name("sun"), y.add(v, "ambientMul", 0, 3, .01).name("ambient"), y.add(v, "fogMul", 0, 4, .01).name("fog"), y.add(v, "exposureMul", .2, 2.5, .01).name("exposure"), y.add(v, "pointLightMul", 0, 4, .01).name("point lights"), y.add(n.settings, "shadows"), y.add(n.settings, "flicker").name("lantern flicker"), y.add(n, "shadowExtent", 10, 40, .5).name("shadow extent"), y.add({
		get wallBounce() {
			return e.tileMap.wallBounce;
		},
		set wallBounce(t) {
			e.tileMap.wallBounce = t;
		}
	}, "wallBounce", 0, 3, .01).name("cliff bounce"), y.close();
	let b = /* @__PURE__ */ new WeakMap(), x = (t) => {
		i.pitchTarget = t * ue;
		let n = e.highGround;
		if (n && e.player.position.y > n.minY) b.has(n) || b.set(n, n.pitch), n.pitch = t;
		else {
			let n = e.camera;
			e.camera = Object.freeze({
				...n,
				pitch: t
			}), b.set(e.camera, b.get(n) ?? n.pitch);
		}
	}, S = () => {
		let t = e.highGround;
		t && b.has(t) && (t.pitch = b.get(t));
		let n = e.camera;
		b.has(n) && (e.camera = Object.freeze({
			...n,
			pitch: b.get(n)
		}));
	}, C = {
		get fov() {
			return i.fov;
		},
		set fov(e) {
			i.fov = e;
		},
		get pitch() {
			return i.pitchTarget * se;
		},
		set pitch(e) {
			x(e);
		},
		get distance() {
			return i.distanceTarget;
		},
		set distance(e) {
			i.distanceTarget = e;
		},
		get yaw() {
			return i.yawTarget * se;
		},
		set yaw(e) {
			i.yawTarget = e * ue;
		}
	}, w = s.addFolder("Camera");
	w.add(C, "fov", 10, 70, .1).listen(), w.add(C, "pitch", 8, 80, .1).listen(), w.add(C, "distance", i.minDistance, i.maxDistance, .1).listen(), w.add(C, "yaw", -180, 180, .1).listen(), w.add(i, "freeYaw").name("free yaw"), w.add(i, "lookAhead", 0, 3, .01), w.add(i, "followLambda", .5, 15, .1).name("follow speed"), w.add({ reset: () => {
		S();
		let t = e.camera;
		i.setAngles(0, t.pitch), i.distanceTarget = t.distance, i.fov = t.fov;
	} }, "reset"), w.close();
	let T = s.addFolder("Atmosphere");
	T.add(v, "godRays", 0, 3, .01).name("god rays"), T.add(v, "dust", 0, 1, .01).name("dust motes"), T.add(v, "fireflies", 0, 1, .01), T.add(v, "leaves", 0, 1, .01).name("falling leaves"), T.add(v, "petals", 0, 1, .01), T.add(v, "smoke", 0, 1, .01).name("chimney smoke"), T.add(v, "mist", 0, 1, .01).name("waterfall mist"), T.add(v, "windStrength", 0, 4, .01).name("wind"), T.add(a, "snowCover", 0, 1, .01).name("snow cover").listen(), T.close();
	let E = s.addFolder("Render"), D = {
		get renderScale() {
			return o.renderScale;
		},
		set renderScale(t) {
			e.resolution && (e.resolution.manual = !0), o.renderScale = t;
		},
		get autoResolution() {
			return !e.resolution?.manual;
		},
		set autoResolution(t) {
			e.resolution && (e.resolution.manual = !t);
		},
		showStats: !0
	};
	return E.add(D, "renderScale", .5, 1, .05).name("render scale").listen(), E.add(D, "autoResolution").name("dynamic resolution").listen(), E.add(D, "showStats").name("show stats").onChange((e) => {
		s.stats.element.style.display = e ? "" : "none";
	}), E.add({ photo: () => e.togglePhotoMode() }, "photo").name("photo mode (P)"), E.close(), s.syncListening?.(), s;
}
//#endregion
//#region src/game/AtmosphereFog.js
var fi = "/* emberfall:fog-start */";
function pi(e) {
	if (e !== void 0 && mi(e), A.fog_vertex.includes(fi)) return;
	let t = fe.uFogStart;
	A.fog_pars_vertex = `${A.fog_pars_vertex}
#ifdef USE_FOG
	uniform vec2 uFogStart;
#endif
`, A.fog_vertex = `${fi}
#ifdef USE_FOG
	vFogDepth = max( 0.0, - mvPosition.z - uFogStart.x );
#endif
`;
	for (let e of Object.values(ie)) "fogDensity" in e.uniforms && (e.uniforms.uFogStart = t);
	Object.assign(ne.fog, { uFogStart: t }), c.clone({ uniform: t }).uniform.value !== t.value && console.warn("[Luminati] three.js copies typed-array uniforms: built-in materials keep the fog start they compiled with");
}
function mi(e) {
	fe.uFogStart.value[0] = Number.isFinite(e) ? e : 0;
}
//#endregion
//#region src/game/CinematicLook.js
var hi = Object.freeze({
	dof: {
		maxBlur: 15,
		tiltShift: .5,
		tiltWidth: .26,
		bokehBoost: 2
	},
	bloom: {
		strength: .6,
		radius: .7,
		threshold: .95,
		warmth: .6
	},
	grade: {
		exposure: 1,
		contrast: 1.12,
		saturation: 1.02,
		temperature: .06,
		vignette: .85,
		vignetteSoftness: .6,
		vignetteRoundness: .85,
		vignetteColor: [
			.02,
			.025,
			.035
		],
		grain: .06,
		grainSize: 1.6,
		chromaticAberration: .002,
		shadowsTint: [
			-.05,
			.035,
			.11
		],
		highlightsTint: [
			.07,
			.025,
			-.05
		]
	},
	cinematic: {
		enabled: !0,
		streaks: 2.2,
		streakThreshold: 1,
		streakTint: [
			.25,
			.5,
			1
		],
		streakTintMix: .85,
		bokehSquash: 1.6,
		tealOrange: .3,
		filmCurve: .25,
		black: [
			.025,
			.035,
			.045
		],
		white: [
			.97,
			.955,
			.92
		],
		grainChroma: .3
	}
});
function gi(e) {
	for (let t of [
		"dof",
		"bloom",
		"grade",
		"cinematic"
	]) {
		let n = e[t];
		for (let [e, r] of Object.entries(hi[t])) n[e] = Array.isArray(r) ? [...r] : r;
	}
}
function _i(e, t) {
	let n = vi(t);
	e.cinematic.streaks = n.streaks, e.cinematic.streakThreshold = n.streakThreshold, yi.set(e, n);
}
function vi(e) {
	let t = e?.cinematic, n = t?.streaks, r = t?.streakThreshold;
	return {
		streaks: typeof n == "number" && Number.isFinite(n) ? n : hi.cinematic.streaks,
		streakThreshold: typeof r == "number" && Number.isFinite(r) ? r : hi.cinematic.streakThreshold
	};
}
var yi = /* @__PURE__ */ new WeakMap();
function bi(e, t, n = null) {
	if (!Array.isArray(t?.states) || !t.states.length) return !1;
	let r = vi(t), i = yi.get(e);
	return i && i.streaks === r.streaks && i.streakThreshold === r.streakThreshold ? !1 : (_i(e, t), n && (n.base.streaks = r.streaks), !0);
}
//#endregion
//#region src/game/levels.js
var xi = Object.freeze([
	Object.freeze({
		value: "emberfall",
		label: "Emberfall"
	}),
	Object.freeze({
		value: "cinderwatch-pass",
		label: "Cinderwatch Pass"
	}),
	Object.freeze({
		value: "starfall-vale",
		label: "Starfall Vale"
	}),
	Object.freeze({
		value: "gildhaven",
		label: "Gildhaven"
	}),
	Object.freeze({
		value: "brightwater-crossing",
		label: "Brightwater Crossing"
	}),
	Object.freeze({
		value: "sample-hamlet",
		label: "Willowmere"
	})
]), Si = [
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
		keys: "Space",
		label: "Talk / Examine",
		id: "talk"
	},
	{
		keys: "F/Enter",
		label: "Choose an answer",
		id: "choose"
	},
	{
		keys: "Q/E",
		label: "Rotate camera",
		id: "camera"
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
		keys: "T",
		label: "Time of day",
		id: "time"
	},
	{
		keys: "R",
		label: "Weather",
		id: "weather"
	},
	{
		keys: "P",
		label: "Photo mode",
		id: "photo"
	},
	{
		keys: "M",
		label: "Music",
		id: "music"
	},
	{
		keys: "`",
		label: "Debug panel",
		id: "debug"
	}
], Ci = {
	keys: "B",
	label: "Journal",
	id: "journal"
}, wi = {
	keys: "G",
	label: "Party",
	id: "party"
}, Ti = (e) => e.map((e) => ({
	...e,
	label: R(`game.controls.${e.id}`)
}));
function Ei(e) {
	if (e?.def?.unnamed) return R("game.default.villager");
	let t = e?.name;
	return typeof t == "string" ? z(t) : String(t ?? "");
}
function Di(e) {
	let t = typeof e?.label == "string" ? e.label : String(e?.label ?? ""), n = ot(t);
	if (n) return R(`game.prompt.${n}`);
	let r = e?.object;
	return r && (r.type === "exit" || r.type === "event") ? B(L(r, "label"), t, "label") : t;
}
function Oi(e) {
	let t = e?.def?.title;
	if (typeof t != "string" || !t.trim()) return "";
	let n = e.def.titleKey;
	return B(typeof n == "string" ? n : "", t, "title");
}
var ki = Object.freeze({
	en: "EN",
	ja: "日本語",
	zh: "中文"
}), Ai = 1.6, ji = .5, Mi = {
	x: 0,
	z: 0
};
function Ni(e) {
	let t = e instanceof Element ? e : null;
	if (!t) return !1;
	if (t.isContentEditable || t.tagName === "TEXTAREA") return !0;
	if (t.tagName !== "INPUT") return !1;
	let n = (t.type || "text").toLowerCase();
	return ![
		"button",
		"checkbox",
		"radio",
		"submit",
		"reset",
		"image",
		"color",
		"file",
		"range"
	].includes(n);
}
function Pi(e, t, n, r = Mi) {
	let i = e.a.x, a = e.a.z, o = e.b.x - i, s = e.b.z - a, c = o * o + s * s, l = c > 1e-12 ? Math.min(1, Math.max(0, ((t - i) * o + (n - a) * s) / c)) : 0;
	return r.x = i + o * l, r.z = a + s * l, r;
}
var Fi = 42, Ii = 4, Li = .8, Ri = .4, zi = 5, Bi = 2, Vi = (e) => new Promise((t) => setTimeout(t, e * 1e3)), H = (e, t) => Number.isFinite(Number(e)) && e !== null && e !== "" ? Number(e) : t, Hi = (e) => !!e && [
	"minX",
	"maxX",
	"minZ",
	"maxZ"
].every((t) => Number.isFinite(e[t])), Ui = (e) => Array.isArray(e) && e.length >= 2 && Number.isFinite(e[0]) && Number.isFinite(e[1]), Wi = {
	near: {
		x: 1.8,
		north: .5,
		south: .8
	},
	mid: {
		x: 3.5,
		north: .5,
		south: 2
	},
	far: {
		x: 4.5,
		north: 1,
		south: 3
	}
}, Gi = /^\s*(?:\*\s+)?pose\s+(?:"([^"]+)"|(\S+))/;
function Ki(e, t) {
	let n = /* @__PURE__ */ new Set(), r = (e) => {
		for (let t of Array.isArray(e) ? e : []) {
			let e = typeof t == "string" ? Gi.exec(t) : null;
			e && n.add((e[1] ?? e[2]).toLowerCase());
		}
	};
	for (let t of e.objects) t?.type === "event" ? r(t.run) : t?.type === "npc" && r(t.talk);
	for (let e of Object.values(t?.scripts ?? {})) r(e?.lines);
	return n;
}
function qi(e, t) {
	let n = e.x, r = e.z, i;
	Ui(e.talkOffset) ? i = [n + e.talkOffset[0], r + e.talkOffset[1]] : Ui(e.talkPoint) && (i = [e.talkPoint[0], e.talkPoint[1]]);
	let a;
	Hi(e.area) ? a = {
		minX: n + e.area.minX,
		maxX: n + e.area.maxX,
		minZ: r + e.area.minZ,
		maxZ: r + e.area.maxZ
	} : Hi(e.bounds) && (a = { ...e.bounds });
	let o = typeof e.name == "string" ? e.name : typeof e.name == "number" || typeof e.name == "boolean" ? String(e.name) : "";
	return {
		id: e.id,
		name: o || "Villager",
		...o ? {} : { unnamed: !0 },
		preset: dt.includes(e.preset) ? e.preset : "villager",
		spec: e.spec && typeof e.spec == "object" ? e.spec : void 0,
		home: [n, r],
		wander: Math.max(0, H(e.wander, 1.2)),
		speed: Math.max(.1, H(e.speed, 1)),
		facing: [
			"down",
			"up",
			"left",
			"right"
		].includes(e.facing) ? e.facing : "down",
		behaviour: e.behaviour,
		talkRadius: e.talkRadius == null ? void 0 : Math.max(.5, H(e.talkRadius, 1.6)),
		talkPoint: i,
		bounds: a,
		portraitColor: e.portraitColor || "#c9a45c",
		title: typeof e.title == "string" && e.title.trim() ? e.title : void 0,
		titleKey: typeof e.title == "string" && e.title.trim() && L(e, "title") || void 0,
		...t && [
			e.id,
			e.actor,
			o
		].some((e) => typeof e == "string" && t.has(e.toLowerCase())) ? { festival: !0 } : {}
	};
}
var Ji = class {
	constructor({ container: e, level: t, autostart: n = !1, source: i = "", campaign: a = null, lang: o = void 0, fonts: s = null, look: c = "diorama" }) {
		if (this.uiOptions = {
			lang: o,
			fonts: s
		}, !t || !Array.isArray(t.tiles)) throw Error("Game: a level is required");
		this.container = e, this.source = i, this.autostart = n, this.look = c === "cinematic" ? "cinematic" : "diorama", this.campaign = a;
		let l = a?.campaign.player;
		this.playerName = l?.name ?? "", this.playerLook = l?.preset || l?.spec ? {
			...l.preset ? { preset: l.preset } : {},
			...l.spec ? { spec: l.spec } : {}
		} : null, this.playerKit = l?.kit ?? "traveler", this.controls = Object.freeze({
			time: a?.campaign.controls?.time !== !1,
			weather: a?.campaign.controls?.weather !== !1
		}), this._events = new Se(), this.season = null, this.thaw = null, this._applyLevel(t), this.mode = "loading", this.photoMode = !1, this.mapOpen = !1, this.busy = !1, this.musicWanted = !0, this.inventory = Object.assign(Object.create(null), { apples: 0 }), this.visits = /* @__PURE__ */ new Map(), this._regionTimer = 0, this._burstTimer = 0, this._sparkleTimer = 0, this._talkCooldown = 0, this._tmp = new r(), this._focusPos = new r(), this._target = {
			kind: "",
			npc: null,
			it: null
		}, this._timeouts = /* @__PURE__ */ new Set(), this._photoTimer = 0, this._removeAudioUnlock = null, this._disposed = !1, this._warmFrames = 0, this.combat = null, this.vfxLights = null, this.story = null, this.party = null, this._partyHudShown = !1, this.warmedUp = new Promise((e) => {
			this._resolveWarm = e;
		}), a?.attach(this);
	}
	_applyLevel(e) {
		this.level = e, this.env = e.environment ?? {};
		let t = this.env.camera ?? {};
		this.camera = Object.freeze({
			...en,
			...Ct(t)
		}), mi(this.camera.distance - 7), this.cameraBounds = this._resolveCameraBounds(t.bounds);
		let n = this.env.highGround;
		this.highGround = n && Number.isFinite(H(n.minY, NaN)) ? {
			minY: H(n.minY, 0),
			pitch: M(H(n.pitch, this.camera.pitch), 10, 80)
		} : null, this.regions = e.objects.filter((e) => e.type === "region"), this._bannersShown = /* @__PURE__ */ new Set(), this._regionBanner = null, this.region = "", this.combatEnabled = ft(e), this.envNow = this.env, this.levelStates = null, this._cine = {
			t: 0,
			target: new r(),
			...this._titleCamera()
		}, this._cine.target.set(this._cine.x, this._cine.y, this._cine.z + Math.sin(1) * this._cine.driftZ);
	}
	_applyBackdrop() {
		let e = typeof this.env.backdrop == "string" ? this.env.backdrop.trim() : "", t = null;
		e === "void" ? t = new g(0, 0, 0) : /^#[0-9a-fA-F]{6}$/.test(e) ? t = new g(e) : e && console.warn(`[Luminati] environment.backdrop "${e}" is neither "void" nor #rrggbb: the sky is shown`), this.lighting && (this.lighting.settings.backdrop = t);
	}
	_resolveCameraBounds(e) {
		let t = (e) => ({
			minX: Math.min(e.minX, e.maxX),
			maxX: Math.max(e.minX, e.maxX),
			minZ: Math.min(e.minZ, e.maxZ),
			maxZ: Math.max(e.minZ, e.maxZ)
		});
		if (e && Hi(e.near) && Hi(e.mid) && Hi(e.far)) return {
			near: t(e.near),
			mid: t(e.mid),
			far: t(e.far)
		};
		if (Hi(e) || Hi(e?.mid)) {
			let n = t(Hi(e) ? e : e.mid);
			return {
				near: { ...n },
				mid: { ...n },
				far: { ...n }
			};
		}
		let n = Vt(this.level, 0), r = (e, t, n, r) => t - e >= n + r ? [e + n, t - r] : [, ,].fill(e + (t - e) * (n / Math.max(1e-6, n + r))), i = {};
		for (let [e, t] of Object.entries(Wi)) {
			let [a, o] = r(n.minX, n.maxX, t.x, t.x), [s, c] = r(n.minZ, n.maxZ, t.north, t.south);
			i[e] = {
				minX: a,
				maxX: o,
				minZ: s,
				maxZ: c
			};
		}
		return i;
	}
	_titleCamera() {
		let e = this.env.titleCamera ?? {}, t = this.cameraBounds.mid, n = (t.minX + t.maxX) / 2, r = (t.minZ + t.maxZ) / 2, i = Math.max(this.level.width, this.level.depth);
		return {
			x: H(e.x, n),
			z: H(e.z, r),
			y: H(e.y, this._typicalGround() + .5),
			driftX: H(e.driftX, Math.min(7, (t.maxX - t.minX) * .25)),
			driftZ: H(e.driftZ, Math.min(5, (t.maxZ - t.minZ) * .25)),
			distance: M(H(e.distance, Math.min(35, Math.max(22, i * .8))), 8, 80)
		};
	}
	_typicalGround() {
		let e = this.level, t = /* @__PURE__ */ new Map();
		e.tiles.forEach((n, r) => {
			for (let i = 0; i < n.length; i++) {
				let a = e.legend[n[i]];
				if (!a || a.void || a.water || a.walkable === !1) continue;
				let o = e.heights[r][i];
				t.set(o, (t.get(o) ?? 0) + 1);
			}
		});
		let n = -1, r = "0";
		for (let [e, i] of t) i > n && (n = i, r = e);
		let i = r.charCodeAt(0);
		return (i >= 97 ? i - 87 : i - 48) * .5;
	}
	async init(e = () => {}) {
		let t = performance.now();
		this._onContextMenu = (e) => {
			Ni(e.target) || e.preventDefault();
		}, window.addEventListener("contextmenu", this._onContextMenu, !0), this.loadStats = {}, pi();
		let n = new he({
			container: this.container,
			maxPixelRatio: 1.25,
			...globalThis.__emberInputTarget ? { inputTarget: globalThis.__emberInputTarget } : {}
		});
		this.engine = n;
		let { scene: r, camera: i, renderer: a } = n;
		this.textures = new Ne({
			seed: 1337,
			anisotropy: 4
		});
		let o = be.map((e) => ({
			...e,
			...Yt[e.name] ?? {}
		})), s = (H(this.env.timeOfDay, 17.2) % 24 + 24) % 24;
		this.lighting = new we(n, {
			timeOfDay: s,
			shadowExtent: 26,
			sunPath: $t,
			moonPath: qt,
			keyframes: o
		}), this.lighting.sky.lowerClouds = .25, this._applyBackdrop(), this.lighting.timeSpeed = this.env.clock === !1 ? 0 : Jt, this.lighting.paused = !0, this.particles = new Ve(r), this.godRays = new ge({ gain: .2 }), r.add(this.godRays.object), this.spriteManager = new Pn(i), this.rig = new pe(i, {
			...this.camera,
			yaw: 0,
			lookAhead: 1.3
		}), this.rig.bounds = { ...this.cameraBounds.mid };
		let c = Math.min(window.devicePixelRatio || 1, n.maxPixelRatio), l = window.innerWidth * window.innerHeight * c * c;
		this.postfx = new me(a, r, i, {
			maxTaps: 64,
			samples: l > 18e5 ? 2 : 4
		}), this._tunePost(this.postfx.settings), n.events.on("resize", ({ width: e, height: t, pixelRatio: n }) => this.postfx.setSize(e, t, n)), this.resolution = new ui({
			engine: n,
			postfx: this.postfx
		}), this.ui = new Ee(globalThis.__emberUiRoot ?? document.body, this.uiOptions), this.audio = new je({ volume: .6 }), this.lightPool = this.campaign ? new De(this.lighting, [], {
			size: 12,
			fixed: !0
		}) : null;
		let { VfxLights: u } = await import("./VfxLights-BO8BqsLW.js");
		this.vfxLights = new u(this.lighting), lr(this, this.env), this.look === "cinematic" && (_i(this.postfx.settings, this.env), this.on("env", (e) => bi(this.postfx.settings, e, this.combat?.look)));
		let d = performance.now();
		this.loadStats.engine = Math.round(d - t), (this.campaign || at(this.level)) && await this._createStory(), this._fontsPending = this.ui.fontsReady;
		let { earlyCompile: f } = await this._buildLevel(e, { t0: d }), p = this.ui;
		p.hud.showHelp(!1, { tab: !1 }), p.prompt.keyHint = "Space", p.dialog.speed = 55, p.dialog.onSound = (e) => this.audio.playSfx(e, { volume: .7 });
		let m = 0;
		p.dialog.onChar = (e) => {
			e === " " || m++ & 1 || this.audio.playSfx("blip", {
				volume: .22,
				pitch: .94 + Math.random() * .12
			});
		}, di(this), n.addSystem(this.lighting, -10), n.addSystem({
			name: "game",
			update: (e, t) => this.update(e, t)
		}, 0), n.addSystem(this.audio, 20), n.events.on("lateUpdate", (e) => this.ui.update(e, {
			camera: i,
			input: n.input
		})), n.setRenderFn((e) => {
			let t = this.story, n = !!t?.focusCut;
			n && (t.focusCut = !1), this.postfx.setFocus(this.mode === "play" && !t?.ownsCamera ? this._playerFocusDistance() : this.rig.focusDistance, n), this.postfx.render(e);
		}), n.events.on("afterRender", (e) => this.ui.debug.stats.update(a, e));
		let h = performance.now();
		this.loadStats.characters = Math.round(h - d - this.loadStats.world), e(.96, R("game.load.warmup")), await Vi(0), this.rig.setTarget(this.player.sprite), this.rig.snap(), this.weather.rain.intensity = 1, this.weather.snow.intensity = 1, this.particles.update(1 / 60, i);
		let g = this._tmp.set(0, -1e3, 0);
		this.world.falls.some((e) => e.splash) && (this.particles.burst("splash", g, 1), this.particles.burst("sparkle", g, 1, { size: [.2, .34] })), this.particles.burst("footstep", g, 1), this.combat?.warmup(g), await f, await this._compileScene(), this.postfx.warmup();
		let _ = this._primeShadows();
		this.warmedUp.then(() => _.dispose()), this.weather.rain.intensity = 0, this.weather.snow.intensity = 0, this.env.weather && this.env.weather !== "clear" && !Et(this.env) && this.weather.setWeather(this.env.weather, { instant: !0 }), this.campaign?.onStart(), this.applyLevelStates(), await this.syncParty(), this._exposeGlobal(), this.loadStats.compile = Math.round(performance.now() - h), e(1, R("game.load.ready"));
	}
	async _buildLevel(e, { t0: t = performance.now(), spawn: n = this.level.spawn, prepared: r = null, kept: i = null } = {}) {
		let a = this.engine, { scene: o } = a;
		this.story?.setLevelId(this.campaign?.levelId ?? this._storyLevelId());
		let s = this.level.environment;
		!this.thaw && (s?.frost || s?.states) && (this.thaw = await import("./LevelStates-CZKGKwiP.js")), await sr(), this.primeLevelMusic(this.level, "level");
		let c = this._glyphsFor();
		i ? (this.world = i.world, this.world.story = this.story ? { present: this.story.present } : null, this.world.attach()) : r?.world && r.level === this.level ? (this.world = r.world, await r.finish(), this.world.story = this.story ? { present: this.story.present } : null, this.world.attach()) : (this.world = new Dr({
			engine: a,
			textures: this.textures,
			lighting: this.lighting,
			particles: this.particles,
			godRays: this.godRays,
			level: this.level,
			lightPool: this.lightPool,
			story: this.story ? { present: this.story.present } : null
		}), await this.world.build((t, n) => e(t * .9, n))), this.world.vfxLights = this.vfxLights, this.tileMap = this.world.tileMap;
		let l = this.world.batching;
		l ? this.lighting.setShadowDepthRange(l.shadowUp, l.shadowDown) : this.campaign && this.lighting.setShadowDepthRange(), this.loadStats.world = Math.round(performance.now() - t);
		let u = this._compileScene();
		if (i) {
			this.posed = Ki(this.level, this.campaign?.story), cn(this.level, this.posed) && await sn(), this.player = i.player, this.npcs = i.npcs, this._npcSheets = i.sheets, this.critters = i.critters;
			for (let e of this._actorSprites()) o.add(e), this.spriteManager.add(e);
			this.player.arrive(n), this.lighting.followTarget(this.player.sprite), this._ensureStandingSpawn({ quiet: n !== this.level.spawn });
		} else {
			e(.92, R("game.load.villagers")), await Vi(0);
			let t = Ki(this.level, this.campaign?.story);
			this.posed = t, cn(this.level, t) && await sn(), await Ir({
				level: this.level,
				look: this.playerLook,
				combat: this.combatEnabled,
				kit: this.playerKit,
				records: this.party?.records
			}), this.player = new Lr({
				tileMap: this.tileMap,
				rig: this.rig,
				particles: this.particles,
				audio: this.audio,
				spawn: n,
				combat: this.combatEnabled,
				look: this.playerLook,
				kit: this.playerKit,
				festival: !this.combatEnabled && t.has("player")
			}), o.add(this.player.sprite), this.spriteManager.add(this.player.sprite), this.lighting.followTarget(this.player.sprite), this._ensureStandingSpawn({ quiet: n !== this.level.spawn });
			let r = /* @__PURE__ */ new Map();
			this._npcSheets = r, this.npcs = [];
			for (let e of this.level.objects) if (e.type === "npc") try {
				let n = new $r({
					def: qi(e, t),
					tileMap: this.tileMap,
					sheetCache: r
				});
				n.storyObj = e, n.talk = kn(e), n.storyFlag = typeof e.flag == "string" ? e.flag.trim() : "", o.add(n.sprite), this.spriteManager.add(n.sprite), this.npcs.push(n);
			} catch (t) {
				console.warn(`[Luminati] could not create NPC "${e.id}":`, t);
			}
			this.critters = new si({
				tileMap: this.tileMap,
				scene: o,
				spriteManager: this.spriteManager,
				groups: this.level.objects.filter((e) => e.type === "critters")
			});
		}
		if (this.npcById = new Map(this.npcs.map((e) => [e.id, e])), this._threats = [this.player.position, ...this.npcs.filter((e) => e.behaviour === "chase").map((e) => e.position)], this._npcCtx = {
			player: this.player.position,
			chickens: this.critters.chickens,
			game: this
		}, this._critterCtx = {
			player: this.player.position,
			threats: this._threats
		}, this._throttle = this.world.batching ? {
			far2: Fi ** 2,
			every: Ii,
			frame: 0,
			npcDt: new Float32Array(this.npcs.length)
		} : null, this._throttle && (this.critters.throttle = {
			focus: this.rig.focusPoint,
			far2: Fi ** 2,
			every: Ii
		}), await this._fontsIn(c), this.combatEnabled) {
			e(.94, R("game.load.blades")), await Vi(0);
			let { CombatSystem: t } = await import("./CombatSystem-CtIRYghB.js");
			this.combat = new t({ game: this }), await this.combat.load();
		}
		let d = this.world.batching || !!this.combat;
		this.blobs = i ? i.blobs : d ? new Fn() : null;
		let f = this._actorSprites();
		this.combat && f.push(...this.combat.actorSprites), this._actorEmissives = [];
		for (let e of f) this._actorEmissives.push(this.lighting.registerEmissive(e.material, Zt)), !i && (d && e.shadowProxy && Qe(e.shadowProxy, [this.lighting.sun]), this.blobs?.adopt(e));
		this.blobs?.mesh && a.scene.add(this.blobs.mesh), this.weather ? this.weather.setWorld(this.world) : this.weather = new li({
			lighting: this.lighting,
			particles: this.particles,
			postfx: this.postfx,
			godRays: this.godRays,
			world: this.world
		}), this.audioDirector = i?.audioDirector ?? new pr({
			audio: this.audio,
			lighting: this.lighting,
			weather: this.weather,
			tileMap: this.tileMap,
			fires: this.world.fires,
			falls: this.world.fallAnchors,
			blazes: this.world.blazes,
			npcs: this.npcs,
			focus: this.rig.focusPoint,
			env: () => this.envNow
		});
		let p = this.ui;
		if (p.hud.setControls(this._controls()), this.combat) {
			let e = this._legendExtra();
			e.length && (this.combat.legendExtra = e), this._togglesSplit() && (this.combat.legendSkip = ["toggles"]);
		}
		return this.combat?.setupUI(), p.hud.setLocation(...this._levelPlate()), this.campaign?.attachWorld(this.world), this._setupMaps(i), this.story?.attachLevel(this.campaign?.levelId ?? this._storyLevelId()), this.story?.primeMusicAhead(), this.party && this._bindParty(), this.party?.attachLevel(), this.refreshActors(), { earlyCompile: u };
	}
	_actorSprites(e = this) {
		let t = e.player ? [e.player.sprite] : [];
		for (let n of e.npcs ?? []) t.push(n.sprite);
		for (let n of e.critters?.all ?? []) t.push(n.sprite);
		return t;
	}
	_glyphsFor() {
		let e = this.ui.fonts;
		return !gt(vt()) || typeof e?.ensure != "function" ? null : e.ensure(Dn(() => this._shownTexts()));
	}
	async _fontsIn(e) {
		if (this._fontsPending) {
			let e = performance.now();
			await this._fontsPending, this._fontsPending = null, this.loadStats.fontsWait = Math.round(performance.now() - e);
		}
		if (e) {
			let t = performance.now();
			await e, this.loadStats.glyphsWait = Math.round(performance.now() - t);
		}
	}
	_shownTexts() {
		let e = this.level, t = [...this._levelPlate()];
		this.campaign || t.push(...Object.values(this._titleTexts()));
		for (let n of e.objects) if (n.type === "region") t.push(z(n.name), B(L(n, "sub"), n.sub, "title"), B(L(n, "banner"), n.banner, "title"));
		else if (n.type === "npc") {
			let e = qi(n);
			t.push(Ei({
				name: e.name,
				def: e
			}), Oi({ def: e }));
		} else n.type === "signpost" ? t.push(n.speaker == null ? R("game.default.signpost") : z(n.speaker)) : (n.type === "exit" && this.campaign && n.mode === "use" || n.type === "event" && this.story && (n.on ?? "use") === "use") && typeof n.label == "string" && n.label.trim() && t.push(Di({
			label: n.label.trim(),
			object: n
		}));
		for (let e of xi) t.push(z(e.label));
		return t.push(...ve(vt())), t;
	}
	prepareWorld(e, t) {
		return new Dr({
			engine: this.engine,
			textures: this.textures,
			lighting: this.lighting,
			particles: this.particles,
			godRays: this.godRays,
			level: e,
			lightPool: this.lightPool,
			story: this.story ? { present: t } : null,
			defer: !0
		});
	}
	async swapLevel(e, { spawn: t = e.spawn, source: n = "", onProgress: r = () => {}, prepared: i = null, kept: a = null, keep: o = !1 } = {}) {
		let s = this.mode;
		this.mode = "travel", this.toggleMap(!1), this.ui.prompt.hide(), this.ui.banner.hide(!0), this.photoMode && this.togglePhotoMode({ instant: !0 });
		let c = performance.now(), l = o && !this.combatEnabled && !!this.lightPool, u = this._detachLevel(), d = null;
		if (l) try {
			d = this._setAside(u);
		} catch (e) {
			console.warn("[Luminati] setting the level aside failed (it is released instead):", e);
		}
		this.source = n, this._applyLevel(e), this._applyBackdrop(), lr(this, this.env), this.look === "cinematic" && _i(this.postfx.settings, this.env);
		let f = this.rig;
		f.minDistance = this.camera.minDistance, f.maxDistance = this.camera.maxDistance, f.bounds = { ...this.cameraBounds.mid };
		let p;
		try {
			({earlyCompile: p} = await this._buildLevel(r, {
				t0: c,
				spawn: t,
				prepared: i,
				kept: a
			}));
		} catch (e) {
			for (let e of [u, a]) if (e) try {
				this._disposeDetached(e);
			} catch (e) {
				console.error("[Luminati] releasing a level after a failed build:", e);
			}
			throw this._forget([u, a]), e;
		}
		if (d || this._disposeDetached(u), f.setTarget(this.player.sprite), f.setAngles(0, this.camera.pitch), f.distanceTarget = this.camera.distance, this._updateCameraBounds(), f.snap(), this.world.lightPool?.snap(), this.postfx.setFocus(this._playerFocusDistance(), !0), a) await p, await this._compileScene(), await this._frames(Bi);
		else {
			let e = this._tmp.set(0, -1e3, 0);
			this.weather.rain.intensity = 1, this.weather.snow.intensity = 1, this.particles.update(1 / 60, this.engine.camera), this.world.falls.some((e) => e.splash) && (this.particles.burst("splash", e, 1), this.particles.burst("sparkle", e, 1, { size: [.2, .34] })), this.particles.burst("footstep", e, 1), this.combat?.warmup(e), await p, await this._compileScene();
			let t = this._primeShadows();
			await this._frames(zi), t.dispose(), this.weather.rain.intensity = 0, this.weather.snow.intensity = 0, this.combat?.endWarmup();
		}
		return this.mode = s === "travel" ? "play" : s, this.mode === "play" && (this.player.setSilhouetteEnabled(!0), this.audioDirector.enabled = !0, this.audioDirector.update(1, this.player.position)), this._exposeGlobal(), this.loadStats.lastSwap = Math.round(performance.now() - c), { aside: d };
	}
	_setAside(e) {
		e.world.detach();
		for (let t of e.emissives) t.dispose();
		e.emissives = [], e.blobs?.mesh?.removeFromParent();
		for (let t of this._actorSprites(e)) this.spriteManager.remove(t), t.removeFromParent();
		e.player.setTalkSilhouette(null), e.player.scripted = null;
		for (let t of e.npcs) t.talking && t.endTalk(), t.directed && t.release();
		return e.audioDirector && (e.audioDirector.enabled = !1), e;
	}
	disposeKept(e) {
		e && this._disposeDetached(e);
	}
	_forget(e) {
		for (let t of e) t && (this.world === t.world && (this.world = null), this.player === t.player && (this.player = null), this.npcs === t.npcs && (this.npcs = []), this.critters === t.critters && (this.critters = null), this.blobs === t.blobs && (this.blobs = null), this._npcSheets === t.sheets && (this._npcSheets = null), this.audioDirector === t.audioDirector && (this.audioDirector = null));
		e.some((e) => e && this._actorEmissives === e.emissives) && (this._actorEmissives = []);
	}
	_frames(e) {
		return new Promise((t) => {
			let n = e, r = () => {
				clearTimeout(a), i(), t(void 0);
			}, i = this.engine.events.on("afterRender", () => {
				--n <= 0 && r();
			}), a = setTimeout(r, 1e3);
		});
	}
	_detachLevel() {
		this.story?.detachLevel(), this.toggleJournal(!1), this.party && (this.togglePartyMenu(!1), this.party.detachLevel());
		let e = {
			world: this.world,
			player: this.player,
			npcs: this.npcs,
			critters: this.critters,
			blobs: this.blobs,
			emissives: this._actorEmissives ?? [],
			sheets: this._npcSheets ?? null,
			level: this.level,
			source: this.source,
			audioDirector: this.audioDirector ?? null,
			levelMap: this.levelMap ?? null,
			mapKey: this._mapKey ?? ""
		};
		if (this.combat) {
			try {
				this.combat.dispose();
			} catch (e) {
				console.warn("[Luminati] combat dispose failed:", e);
			}
			this.combat = null, delete window.__game?.combat;
		}
		return this.vfxLights?.releaseAll(), e.world && (e.world.vfxLights = null), e;
	}
	_disposeDetached(e) {
		let t = [
			() => {
				for (let t of e.emissives) t.dispose();
			},
			() => e.blobs?.dispose(),
			() => e.critters?.dispose(this.spriteManager),
			() => {
				for (let t of e.npcs ?? []) this.spriteManager.remove(t.sprite), t.dispose();
			},
			() => {
				for (let t of e.sheets?.values() ?? []) t.dispose?.();
			},
			() => {
				e.player && (this.spriteManager.remove(e.player.sprite), e.player.dispose());
			},
			() => e.world?.dispose()
		];
		for (let e of t) try {
			e();
		} catch (e) {
			console.warn("[Luminati] releasing the previous level failed:", e);
		}
	}
	_primeShadows() {
		let e = Ze(this.engine.scene, { lights: [this.lighting.sun] });
		return this.engine.scene.add(e.object), this.loadStats.shadowVariants = e.count, e;
	}
	_compileScene() {
		let e = this.engine.renderer, t = e.getRenderTarget();
		e.setRenderTarget(this.postfx.sceneTarget);
		let n = e.compileAsync(this.engine.scene, this.engine.camera);
		return e.setRenderTarget(t), n;
	}
	_setupMaps(e = null) {
		let t = performance.now(), n = this._mapPresence(), r = e?.levelMap && e.mapKey === n ? e.levelMap : Ut(this._mapLevel());
		this.levelMap = r, this._mapKey = n;
		let i = this.ui;
		i.minimap.setMap(r, {
			view: 34,
			level: this._mapLevel()
		}), i.minimap.enabled = this.env.minimap !== !1, this._setWorldMap(r);
		let a = this.world;
		this._map = {
			player: this.player.position,
			facing: this.player.facing,
			view: {
				x: 0,
				z: -1
			},
			npcs: this.npcs.map((e) => e.position),
			markers: a.mapMarkers()
		}, this.combat && this.combat.attachMaps(this._map), this.loadStats.map = Math.round(performance.now() - t);
	}
	_mapLevel() {
		let e = this.story;
		if (!e) return this.level;
		let t = this.level.objects.filter((t) => !Gt(t) || e.present(t));
		return t.length === this.level.objects.length ? this.level : {
			...this.level,
			objects: t
		};
	}
	_mapPresence() {
		let e = this.story;
		if (!e) return "";
		let t = "";
		for (let n of this.level.objects) Gt(n) && (t += e.present(n) ? "1" : "0");
		return t;
	}
	repaintLevelMap() {
		if (!this.levelMap || this.mode === "travel") return;
		this.party?.dropNav();
		let e = Ut(this._mapLevel());
		this.levelMap = e, this._mapKey = this._mapPresence(), this.ui.minimap.setMap(e, {
			view: 34,
			level: this._mapLevel()
		}), this._setWorldMap(e);
	}
	refreshWorldMap() {
		this.campaign && this.mode !== "travel" && this.levelMap && !this._disposed && this._setWorldMap(this.levelMap, { campaignOnly: !0 });
	}
	_setWorldMap(e, { campaignOnly: t = !1 } = {}) {
		let n = (e) => Array.isArray(e) ? e.map((e) => e && typeof e == "object" ? {
			...e,
			name: z(e.name)
		} : e) : e, r = this.campaign?.worldMap(e, this.level) ?? null;
		if (r) this.ui.worldMap.setMap(r.map, {
			title: r.title,
			subtitle: r.subtitle,
			regions: r.regions,
			combat: !!this.combat,
			origin: r.origin
		});
		else if (!t) {
			let [t, r] = this._levelPlate();
			this.ui.worldMap.setMap(e, {
				title: t,
				subtitle: r,
				regions: n(this.regions),
				...this.combat ? { combat: !0 } : {}
			});
		}
	}
	toggleMap(e = !this.mapOpen) {
		let t = this.ui;
		return e && (this.mode !== "play" || this.busy || t.dialog.isOpen || this.photoMode || !this.levelMap || this.combat?.locksPlayer || this.partyMenuOpen) || e === this.mapOpen ? this.mapOpen : (this.mapOpen = e, e ? (this.combat?.onMapOpen(), t.worldMap.setRegion(z(this.region)), t.worldMap.open(), t.prompt.hide(), this.audio.playSfx("open", { volume: .45 })) : (t.worldMap.close(), this.audio.playSfx("close", { volume: .4 })), this.mapOpen);
	}
	_updateMaps(e) {
		let t = this._map;
		if (!t) return;
		let n = this.engine.camera.matrixWorld.elements, r = -n[8], i = -n[10], a = Math.hypot(r, i) || 1;
		t.view.x = r / a, t.view.z = i / a, this.mode === "play" && !this.photoMode && this.ui.minimap.update(t), this.mapOpen && this.ui.worldMap.update(e, t);
	}
	_tunePost(e) {
		Object.assign(e.dof, {
			focusRange: 6,
			maxBlur: 13,
			nearScale: 1.5,
			farScale: 1.15,
			tiltShift: .42,
			tiltCenter: .5,
			tiltWidth: .3,
			bokehBoost: 1.6
		}), Object.assign(e.bloom, {
			strength: .5,
			radius: .58,
			threshold: 1.05
		}), Object.assign(e.grade, {
			exposure: 1.03,
			contrast: 1.04,
			saturation: 1.3,
			temperature: .04,
			vignette: .55,
			grain: .03,
			shadowsTint: [
				-.04,
				.05,
				.15
			]
		}), this.look === "cinematic" && gi(e);
	}
	start() {
		this._warmFrames = zi, this.engine.start(), this.autostart ? this.enterGameplay({ instant: !0 }) : this.showTitle();
	}
	async showTitle() {
		this.mode = "title", this.player.setSilhouetteEnabled(!1), this.lighting.paused = !0;
		let e = this.rig;
		if (e.setTarget(this._cine.target), e.distanceTarget = this._cine.distance, e.snap(), this.ui.title.onDismiss = () => this.audio.unlock(), this.campaign) {
			let e = {
				...this.campaign.titleOptions(),
				...this._languageOptions()
			};
			if (await this.ui.title.show(e), this._disposed) return;
			this.ui.title.destination === "new" && (await this.campaign.newGame(), await this.syncParty()), this.enterGameplay({ instant: !1 });
			return;
		}
		let t = this.env.title ?? {}, n = this._shippedSlug(), r = {
			...this._titleTexts(),
			titleSource: t.title || this.level.name.toUpperCase(),
			...n ? {
				destinations: xi.map((e) => ({
					value: e.value,
					label: z(e.label)
				})),
				current: n
			} : {},
			...this._languageOptions()
		};
		if (await this.ui.title.show(r), this._disposed) return;
		let i = n ? this.ui.title.destination : void 0;
		if (i && i !== n && xi.some((e) => e.value === i)) {
			let e = new URLSearchParams(window.location.search);
			e.delete("autostart"), e.set("level", i), window.location.search = e.toString();
			return;
		}
		this.enterGameplay({ instant: !1 });
	}
	_shippedSlug() {
		let e = /^levels\/([^/]+)\.json$/.exec(this.source || "");
		return e && xi.some((t) => t.value === e[1]) ? e[1] : null;
	}
	_languageOptions() {
		return {
			languages: bt.map((e) => ({
				code: e,
				label: ki[e] ?? e
			})),
			lang: vt(),
			onLanguage: (e) => {
				this.setLanguage(e);
			}
		};
	}
	setLanguage(e) {
		let t = yt(e), n = new URLSearchParams(window.location.search), r = n.has("lang");
		return !r && t === vt() ? t : (n.delete("lang"), r ? window.location.search = n.toString() : window.location.reload(), t);
	}
	enterGameplay({ instant: e = !1 } = {}) {
		this.mode = "play", this.player.setSilhouetteEnabled(!0), this.lighting.paused = !1, this.campaign?.hasSave ? this.story?.resumePending() : this.story?.onArrive();
		let t = this.story?.openingRun() ?? null, n = this.rig;
		n.setTarget(this.player.sprite), n.setAngles(0, this.camera.pitch), n.distanceTarget = this.camera.distance, (e || t) && (this._updateCameraBounds(), n.snap(), this.postfx.setFocus(this._playerFocusDistance(), !0)), e && this._armAudioUnlock(), t && this.ui.fader.set(1, "#000"), this.audioDirector.enabled = !0, this.audioDirector.update(1, this.player.position), !e && this.env.music !== !1 && !t?.music && this.audio.startMusic(this._levelMusic());
		let r = !(t && this.campaign);
		this._later(e ? .2 : .9, () => {
			t || this.ui.banner.show(...this._levelPlate(), { duration: 3.2 }), this.ui.hud.showHelp(r);
		}), this._bannersShown.clear();
	}
	async _createStory() {
		let { StoryRunner: e, StoryState: t, journeySeed: n } = await import("./StoryRunner-ClmRwdBA.js"), r = this.campaign, i = r ? r.state.story : new t(null);
		r || (i.seed = n()), this.story = new e({
			game: this,
			story: r?.story ?? null,
			state: i,
			levelId: r?.levelId ?? this._storyLevelId()
		}), r?.attachStory(this.story), this.engine.input.addBindings({ journal: ["KeyB"] });
		let { storyUIClasses: a } = await import("./storyUI-BznoSF2I.js");
		this.ui.useStoryUI(a()), this.ui.journal && (this.ui.journal.onSound = (e) => this.audio.playSfx(e, { volume: .5 }));
	}
	async ensureParty() {
		return this.party ? this.party : (this._partyLoad ??= (async () => {
			let [{ Party: e }, { partyUIClasses: t }] = await Promise.all([import("./Party-B9CG11jl.js"), import("./partyUI-DAOKNj5X.js")]);
			this.ui.usePartyUI(t()), this._bindParty();
			let n = new e({ game: this });
			return this.party = n, n.wireUI(), this.mode !== "travel" && this.player && this.world && n.attachLevel(), n;
		})(), this._partyLoad);
	}
	_bindParty() {
		this.engine.input.addBindings({ party: ["KeyG"] });
	}
	findVillager(e) {
		let t = String(e ?? "").trim();
		if (!t) return null;
		let n = this.npcById?.get(t);
		if (n) return n;
		let r = t.toLowerCase(), i = this.npcs ?? [];
		return i.find((e) => typeof e.storyObj?.actor == "string" && e.storyObj.actor.trim().toLowerCase() === r) ?? i.find((e) => String(e.id).toLowerCase() === r || String(e.name).toLowerCase() === r) ?? null;
	}
	canJoin(e) {
		let t = this.findVillager(e);
		return !t || !t.present || this.mode === "travel" || this.party && (this.party.find(t.id) || !this.party.canTake(t)) ? null : t;
	}
	async syncParty() {
		(this.party || this.story?.state.party?.length) && (await this.ensureParty()).syncFromState();
	}
	_controls() {
		let e = this.party?.count ? [wi] : [], t = this._keysOn(Si), n = t.findIndex((e) => e.id === "map") + 1;
		return this.story ? Ti([
			...t.slice(0, n),
			Ci,
			...e,
			...t.slice(n)
		]) : Ti(e.length ? [
			...t.slice(0, n),
			...e,
			...t.slice(n)
		] : t);
	}
	_legendExtra() {
		return Ti([
			...this._togglesSplit() ? this._keysOn(Si.filter((e) => [
				"time",
				"weather",
				"photo",
				"music"
			].includes(e.id))) : [],
			...this.story ? [Ci] : [],
			...this.party?.count ? [wi] : []
		]);
	}
	_togglesSplit() {
		return !this.controls.time || !this.controls.weather;
	}
	_keysOn(e) {
		return e.filter((e) => (e.id !== "time" || this.controls.time) && (e.id !== "weather" || this.controls.weather));
	}
	_levelMusic() {
		return this.envNow.soundtrack ? { track: kt(this.envNow, "explore") } : void 0;
	}
	primeLevelMusic(e, t) {
		let n = e?.environment ?? {}, r = [];
		if (n.music !== !1) {
			let t = Array.isArray(n.states) ? n.states.filter((e) => e?.soundtrack && typeof e.soundtrack == "object") : [];
			for (let i of [n, ...t.map((e) => ({ soundtrack: e.soundtrack }))]) r.push(kt(i, "explore")), ft(e) && (r.push(kt(i, "battle")), e.objects.some((e) => e.type === "enemy" && !!ke(st, e.kind)?.boss) && r.push(kt(i, "boss")));
		}
		let i = [...new Set(r)];
		return this.audio.retainMusic(t, i), i.forEach((e, t) => t ? this.warmedUp.then(() => this.audio.primeMusic(e)) : this.audio.primeMusic(e)), i;
	}
	refreshPartyLegend() {
		if (!this.ui || !this.player || this.mode === "travel") return;
		let e = this.combat;
		e ? (e.legendExtra = this._legendExtra(), e.refreshLegend()) : this.ui.hud.setControls(this._controls());
	}
	get partyMenuOpen() {
		return !!this.party?.menuOpen;
	}
	togglePartyMenu(e = !this.partyMenuOpen, t, { force: n = !1 } = {}) {
		let r = this.party;
		if (!r || !this.ui.party) return !1;
		if (!e) return r.closeMenu(), !1;
		if (this.partyMenuOpen) return !0;
		if (this.mode !== "play" || !n && (this.busy || this.ui.dialog.isOpen || this.photoMode || this.mapOpen || this.journalOpen || this.combat?.locksPlayer || this.ui.cutscene || r.closedFrame === this.engine.time.frame)) return !1;
		if (!r.count) return this.ui.hud.toast(R("game.toast.noParty"), 1.6), !1;
		let i = r.openMenu(t);
		return i && (this.ui.prompt.hide(), this.combat?.onMapOpen()), i;
	}
	_updatePartyHud(e) {
		let t = this.ui.party?.frames;
		if (!t) return;
		let n = e && !this.photoMode && !this.ui.cutscene && this.party.count > 0;
		n !== this._partyHudShown && (this._partyHudShown = n, t.setVisible(n), n || t.update([])), n && t.update(this.party.frames());
	}
	_levelPlate() {
		return [z(this.level.name), B(L(this.level, "subtitle"), this.level.subtitle, "title")];
	}
	_titleTexts() {
		let e = this.env.title ?? {}, t = this.level;
		return {
			title: e.title ? B(L(t, "title.title"), e.title, "title") : z(t.name).toUpperCase(),
			subtitle: e.subtitle == null ? t.subtitle ? B(L(t, "subtitle"), t.subtitle, "title") : R("game.default.subtitle") : B(L(t, "title.subtitle"), e.subtitle, "title"),
			prompt: e.prompt ? B(L(t, "title.prompt"), e.prompt, "title") : R("game.default.prompt"),
			credit: e.credit == null ? R("game.default.credit") : B(L(t, "title.credit"), e.credit, "title")
		};
	}
	_examineText(e) {
		let t = e.text;
		return t?.lines?.length ? {
			speaker: t.speakerDefault ? R(`game.default.${t.speakerDefault}`) : z(t.speaker),
			lines: t.lines.map((e, n) => {
				if (typeof e != "string") return e;
				if (t.linesDefault) return R(`game.default.${t.linesDefault}`);
				if (!Array.isArray(t.keys)) return e;
				let r = t.keys[n];
				return B(typeof r == "string" ? r : "", e);
			})
		} : {
			speaker: "",
			lines: [R("game.default.nothing")]
		};
	}
	_storyLevelId() {
		let e = /^levels\/([^/]+)\.json$/.exec(this.source || "");
		return e ? e[1] : String(this.level.name || "level").toLowerCase().replace(/[^a-z0-9-]+/g, "-");
	}
	toggleJournal(e = !this.journalOpen) {
		let t = this.ui.journal;
		return !t || !this.story ? !1 : (e && (this.mode !== "play" || this.busy || this.ui.dialog.isOpen || this.photoMode || this.mapOpen || this.combat?.locksPlayer || this.partyMenuOpen) || e === this.journalOpen || (e ? (t.setData(this.story.journalData()), t.open("quests"), this.ui.prompt.hide(), this.combat?.onMapOpen()) : t.close()), this.journalOpen);
	}
	get journalOpen() {
		return !!this.ui?.journal?.isOpen;
	}
	refreshActors() {
		let e = this.party, t = this.npcs.filter((t) => t.present && !e?.holds(t));
		this._threats && (this._threats.length = 0, this._threats.push(this.player.position, ...t.filter((e) => e.behaviour === "chase").map((e) => e.position)), e && this._threats.push(...e.mapPositions())), this._map && (this._map.npcs = t.map((e) => e.position), e && (this._map.party = e.mapPositions()));
	}
	returnToTitle() {
		let e = new URLSearchParams(window.location.search);
		for (let t of [
			"autostart",
			"new",
			"story",
			"entrance"
		]) e.delete(t);
		window.location.search = e.toString();
	}
	_later(e, t) {
		let n = setTimeout(() => {
			this._timeouts.delete(n), this._disposed || t();
		}, e * 1e3);
		return this._timeouts.add(n), n;
	}
	_armAudioUnlock() {
		if (globalThis.__emberSilent || this._removeAudioUnlock || this.audio.ready) return;
		let e = (e) => {
			this._removeAudioUnlock?.(), this.audio.unlock();
			let t = e?.type === "keydown" && (this.engine?.input?.bindings?.music ?? ["KeyM"]).includes(e.code);
			this.mode === "play" && this.env.music !== !1 && !this.audio.musicPlaying && !this.audio.musicStopped && !t && this.audio.startMusic(this._levelMusic());
		};
		window.addEventListener("keydown", e, !0), window.addEventListener("pointerdown", e, !0), this._removeAudioUnlock = () => {
			window.removeEventListener("keydown", e, !0), window.removeEventListener("pointerdown", e, !0), this._removeAudioUnlock = null;
		};
	}
	cycleTime() {
		let e = this.weather.cycleTime();
		return this.ui.hud.toast(Te(e.id), 1.6), e.h;
	}
	applyLevelStates(e = this.level) {
		this.thaw ? this.thaw.applyLevelStates(this, e) : this.emit("env", this.envNow = e.environment ?? {});
	}
	levelStatesChanged() {
		this.thaw?.levelStatesChanged(this);
	}
	on(e, t) {
		return this._events.on(e, t);
	}
	emit(e, t) {
		this._events.emit(e, t);
	}
	setTime(e) {
		return this.weather.setTime(e), this.lighting.timeOfDay;
	}
	setWeather(e) {
		return this.weather.setWeather(e);
	}
	cycleWeather() {
		let e = this.weather.cycleWeather();
		return this.ui.hud.toast(R(`game.toast.${this.weather.indoors ? "outside" : "weather"}.${e}`), 1.6), e;
	}
	setMusic(e) {
		return this.musicWanted = !!e, e ? this.audio.startMusic(this.combat ? { track: this.combat.musicTrack } : this._levelMusic()) : this.audio.stopMusic(), this.audio.musicPlaying;
	}
	togglePhotoMode({ instant: e = !1 } = {}) {
		return !this.photoMode && (this.busy || this.ui.dialog.isOpen || this.mode !== "play" || this.mapOpen || this.partyMenuOpen) ? this.photoMode : !this.photoMode && (this.combat?.engaged || this.combat?.locksPlayer) ? (this.ui.hud.toast(R("game.toast.foes"), 1.6), this.photoMode) : (this.photoMode = !this.photoMode, clearTimeout(this._photoTimer), this._timeouts.delete(this._photoTimer), this.photoMode ? (this.ui.prompt.hide(), e ? this.ui.setVisible(!1) : (this.ui.hud.toast(R("game.toast.photo"), 1.6), this._photoTimer = this._later(1.2, () => {
			this.photoMode && this.ui.setVisible(!1);
		}))) : this.ui.setVisible(!0), this.photoMode);
	}
	teleport(e, t) {
		let n = this._standable(Number(e), Number(t));
		return n ? (this.player.teleport(n.x, n.z), this.combat?.onTeleport(), this.party?.onTeleport(), this._updateCameraBounds(), this.rig.snap(), this.world.lightPool?.snap(), this.postfx.setFocus(this.mode === "play" ? this._playerFocusDistance() : this.rig.focusDistance, !0), {
			x: this.player.position.x,
			y: this.player.position.y,
			z: this.player.position.z
		}) : null;
	}
	_ensureStandingSpawn({ quiet: e = !1 } = {}) {
		let t = this.player.position, n = this._nearestStandable(t.x, t.z);
		n && (n.x !== t.x || n.z !== t.z) && (e || console.warn(`[Luminati] spawn (${t.x}, ${t.z}) is not standable; moved to (${n.x.toFixed(2)}, ${n.z.toFixed(2)})`), this.player.teleport(n.x, n.z));
	}
	_nearestStandable(e, t) {
		let n = this._standable(e, t);
		if (n) return n;
		let r = Infinity;
		return this.tileMap.forEachTile((i, a, o) => {
			if (!o.walkable) return;
			let s = (i + .5 - e) ** 2 + (a + .5 - t) ** 2;
			if (s >= r) return;
			let c = this._standable(i + .5, a + .5);
			c && (r = s, n = c);
		}), n;
	}
	_standable(e, t) {
		if (!Number.isFinite(e) || !Number.isFinite(t)) return null;
		let n = this.tileMap, r = this.player.radius, i = (e, t) => n.isWalkable(e, t) && n.isWalkable(e + r, t) && n.isWalkable(e - r, t) && n.isWalkable(e, t + r) && n.isWalkable(e, t - r);
		if (i(e, t)) return {
			x: e,
			z: t
		};
		for (let n = .25; n <= 3.001; n += .25) {
			let r = Math.max(8, Math.round(n * 12));
			for (let a = 0; a < r; a++) {
				let o = a / r * Math.PI * 2, s = e + Math.cos(o) * n, c = t + Math.sin(o) * n;
				if (i(s, c)) return {
					x: s,
					z: c
				};
			}
		}
		return null;
	}
	async restUntilMorning() {
		let e = this.busy;
		this.busy = !0;
		try {
			await this.ui.fader.fadeOut(1);
			let e = this.campaign ? this.campaign.hour() : this.lighting.timeOfDay;
			this.campaign && this.env.clock === !1 || this.weather.setTime(8), this.campaign?.onRest(), this.story?.rested(e), this.audio.playSfx("chime", { volume: .6 }), await Vi(.7), await this.ui.fader.fadeIn(1.1), this.ui.hud.toast(R("game.toast.rested"), 2.2);
		} finally {
			this.busy = e;
		}
	}
	talkTo(e) {
		if (this.partyMenuOpen) return !1;
		let t = this.npcById.get(e), n = t?.present ? null : this.party?.members.find((t) => t.id === e && t.sprite) ?? null;
		if (n) return this.busy || this.ui.dialog.isOpen || this.mode !== "play" || this.photoMode || n.talking || n.directed || n.combat?.active ? !1 : (this.toggleMap(!1), this.party.standBeside(n), this.player.faceTowards(n.position.x, n.position.z), this._interact({
			kind: "npc",
			npc: n,
			it: null
		}), !0);
		let r = t;
		if (!r || !r.present || this.busy || this.ui.dialog.isOpen || this.mode !== "play" || this.photoMode) return !1;
		this.toggleMap(!1);
		let i = r.interactPoint, a = [
			[-1.15, 0],
			[1.15, 0],
			[-.85, .85],
			[.85, .85],
			[0, 1.15],
			[0, -1.15]
		], o = this.tileMap, s = (e, t) => o.isWalkable(e, t) && [
			[.32, 0],
			[-.32, 0],
			[0, .32],
			[0, -.32]
		].every(([n, r]) => o.isWalkable(e + n, t + r)) && Math.abs(o.getHeight(e, t) - o.getHeight(i.x, i.z)) < .3, c = null;
		for (let [e, t] of a) {
			let n = i.x + e, r = i.z + t;
			if (s(n, r)) {
				c = [n, r];
				break;
			}
		}
		return c && this.teleport(c[0], c[1]), this.player.faceTowards(r.position.x, r.position.z), this._interact({
			kind: "npc",
			npc: r,
			it: null
		}), !0;
	}
	_findInteractable() {
		let e = this.player.position, t = this.player.facing, n = Infinity, r = null, i = null, a = this.npcs, o = this.world.interactables, s = a.length;
		for (let c = 0; c < s + o.length; c++) {
			let l = c < s, u = l ? a[c] : o[c - s];
			if (l ? !u.present : u.disabled) continue;
			let d = l ? u.interactPoint : u.position, f = l ? u.talkRadius ?? Ai : u.radius ?? Ai, p = d.x - e.x, m = d.z - e.z, h = Math.hypot(p, m);
			if (h > f || Math.abs(d.y - e.y) > 1.3) continue;
			let g = h > .001 ? (p * t.x + m * t.z) / h : 1, _ = l ? null : u.area, v = !!_ && e.x >= _.minX && e.x <= _.maxX && e.z >= _.minZ && e.z <= _.maxZ, y = h <= .55 || g >= .25 ? h - g * .7 : v ? h + .7 : Infinity;
			!l && u.storyEvent && (y -= .3);
			let b = l ? null : u.lookSpan;
			if (b) {
				let n = Pi(b, e.x, e.z), r = n.x - e.x, i = n.z - e.z, a = Math.hypot(r, i), o = a > .001 ? (r * t.x + i * t.z) / a : 1;
				o >= ji && (y = Math.min(y, a - o * .7));
			}
			y < n && (n = y, r = l ? u : null, i = l ? null : u);
		}
		let c = i ? null : this.party?.members;
		if (c) for (let a of c) {
			if (!a.sprite || a.talking || a.directed || a.combat?.active || a.combat?.down || a.follow.speed > .5) continue;
			let o = a.interactPoint, s = o.x - e.x, c = o.z - e.z, l = Math.hypot(s, c);
			if (l > a.talkRadius || Math.abs(o.y - e.y) > 1.3) continue;
			let u = l > .001 ? (s * t.x + c * t.z) / l : 1, d = l <= .55 || u >= .25 ? l - u * .7 : Infinity;
			d < n && (n = d, r = a, i = null);
		}
		if (!r && !i) return null;
		let l = this._target;
		return l.kind = r ? "npc" : "object", l.npc = r, l.it = i, l;
	}
	async _interact(e) {
		if (this.busy) return;
		let { kind: t, npc: n, it: r } = e;
		this.busy = !0, this.ui.prompt.hide();
		try {
			if (t === "npc") {
				if (n.beginTalk(this.player.position.x, this.player.position.z), this.player.faceTowards(n.position.x, n.position.z), this.party?.members.includes(n)) await this.party.talk(n);
				else if (this.story && n.storyTalk) await this.story.talk(n);
				else {
					let e = this.story?.state, t;
					e ? t = e.visit(this.story.visitKey(n)) : (t = this.visits.get(n.id) ?? 0, this.visits.set(n.id, t + 1));
					let r = Oi(n);
					await n.talk({
						say: (e, t = {}) => {
							let i = t.speaker == null, a = {
								speaker: i ? Ei(n) : z(t.speaker),
								lines: e,
								portraitColor: n.def.portraitColor
							};
							return i && n.sheet?.canvas && (a.sheet = n.sheet.canvas), i && r && (a.title = r), this.ui.dialog.open(a);
						},
						visits: t,
						game: this,
						npc: n,
						toast: (e) => this.ui.hud.toast(e, 2.4),
						sfx: (e) => this.audio.playSfx(e, { volume: .7 })
					});
				}
				n.storyFlag && (this.campaign ? this.campaign.setFlag(n.storyFlag) : this.story?.state.setFlag(n.storyFlag));
			} else {
				let e = r.lookSpan ? Pi(r.lookSpan, this.player.position.x, this.player.position.z) : r.position;
				this.player.faceTowards(e.x, e.z), r.onInteract ? await r.onInteract(this, r) : (r.text?.sfx && r.text.lines?.length && this.audio.playSfx(r.text.sfx, { volume: .6 }), await this.ui.dialog.open(this._examineText(r)));
			}
		} catch (e) {
			this._disposed || console.error("[Luminati] interaction failed:", e);
		} finally {
			t === "npc" && n.endTalk(), this.busy = !1, this._talkCooldown = Li;
		}
	}
	update(e) {
		if (this.mode === "travel") return;
		let { engine: t, ui: n, rig: r, player: i } = this, a = t.input, o = this.mode === "play", s = this.busy || n.dialog.isOpen;
		this._talkCooldown > 0 && (this._talkCooldown -= e, !s && a.actionPressed("confirm") && (this._talkCooldown = Math.max(this._talkCooldown, Ri))), o && (a.actionPressed("debug") && n.debug.toggle(), this.mapOpen ? (a.actionPressed("map") || a.actionPressed("cancel")) && this.toggleMap(!1) : this.journalOpen ? (a.actionPressed("journal") || a.actionPressed("cancel")) && this.toggleJournal(!1) : this.partyMenuOpen ? (a.actionPressed("party") || a.actionPressed("cancel")) && (a.consumeAction?.("party"), this.togglePartyMenu(!1)) : !s && !this.photoMode && a.actionPressed("map") ? this.toggleMap(!0) : this.story && !s && !this.photoMode && a.actionPressed("journal") ? this.toggleJournal(!0) : this.party && !s && !this.photoMode && a.actionPressed("party") && (a.consumeAction?.("party"), this.togglePartyMenu(!0)));
		let c = this.mapOpen || this.journalOpen || this.partyMenuOpen;
		if (o && !c && (a.actionPressed("help") && n.hud.toggleHelp(), !s && ((a.actionPressed("photo") || this.photoMode && a.actionPressed("cancel")) && this.togglePhotoMode(), this.controls.time && a.actionPressed("time") && this.cycleTime(), this.controls.weather && a.actionPressed("weather") && this.cycleWeather(), a.actionPressed("music")))) {
			let e = this.setMusic(!this.audio.musicPlaying);
			n.hud.toast(R(e ? "game.toast.musicOn" : "game.toast.musicOff"), 1.4);
		}
		let l = this.combat, u = o && !s && !c && !this.photoMode, d = !u && o && !c && !this.photoMode && !!this.story?.run;
		i.frozen = !o || s || c || !!l && (this.photoMode || l.locksPlayer), l?.update(e, u, d), i.update(e, a), l?.afterPlayer(e, u, d), this.story?.update(e), o && !c && this.party?.update(e), i.setSilhouetteLevel(de(1, .5, this.lighting.nightFactor));
		let f = !!this.story && (this.story.ownsCamera || this.rig.framed);
		(this.party || this.story) && i.fadeSilhouette(f || !!this.party?.coversPlayer, f ? 1 : e);
		let p = s ? i.talkSprite : null;
		if (o && !s && !this.photoMode && !c && !l?.locksPlayer) {
			let e = this._findInteractable();
			e ? (e.kind === "npc" ? (n.prompt.show(e.npc.sprite, R("game.prompt.talk"), { offsetY: e.npc.def.preset === "child" ? 1.9 : 2.35 }), p = e.npc.sprite) : n.prompt.show(e.it.prompt, Di(e.it)), this._talkCooldown <= 0 && a.actionPressed("confirm") && (a.consumeAction?.("confirm"), this._interact(e))) : n.prompt.hide();
		} else s || n.prompt.hide();
		i.setTalkSilhouette(f ? null : p), this.campaign && o && this.campaign.update(e, { blocked: s || this.photoMode || c || !!l?.locksPlayer });
		let m = i.position, h = this._npcCtx, g = this._throttle;
		if (g) {
			g.frame++;
			let t = Math.max(Fi, r.distance * 1.15 + 4);
			g.far2 = t * t, this.critters.throttle && (this.critters.throttle.far2 = g.far2);
			let n = r.focusPoint;
			for (let t = 0; t < this.npcs.length; t++) {
				let r = this.npcs[t], i = (r.position.x - n.x) ** 2 + (r.position.z - n.z) ** 2;
				g.npcDt[t] += e, (i < g.far2 || r.talking || (g.frame + t) % g.every === 0) && (r.update(Math.min(g.npcDt[t], .25), h), g.npcDt[t] = 0);
			}
		} else for (let t = 0; t < this.npcs.length; t++) this.npcs[t].update(e, h);
		this.critters.update(e, this._critterCtx), r.inputEnabled = o && !s && !c, this.mode === "title" ? this._updateCinematic(e) : o && !this.story?.ownsCamera && this._updatePlayCamera(), r.update(e, a), this.spriteManager.update(e), this.blobs?.update();
		let _ = this.world.emitters.dust;
		_ && _.position.set(r.focusPoint.x, r.focusPoint.y + 1.2, r.focusPoint.z - 2), this.weather.zoomFog = M(((this.camera.distance - 7) / Math.max(1, r.distance - 7)) ** 2, .4, 1), this.weather.update(e), this.season?.update(e), l?.applyLook(e), this._warmFrames > 0 && (this._warmFrames--, this.weather.rain.intensity = 1, this.weather.snow.intensity = 1, this._warmFrames === 0 && (l?.endWarmup(), this._resolveWarm()));
		let v = this._worldView ??= {
			focus: r.focusPoint,
			camera: t.camera
		};
		this.world.update(e, v), this.godRays.update(e), this._waterfallFx(e), this.particles.update(e, t.camera), this.resolution.update(e), n.hud.setTime(this.lighting.timeOfDay), this._updateRegion(e), this._updateMaps(e), this.party && this._updatePartyHud(o), this.audioDirector.update(e, m);
	}
	_updatePlayCamera() {
		let e = this.rig, t = this.player.position;
		if (!this.photoMode && !e.framed) {
			let n = this.highGround;
			e.pitchTarget = (n && t.y > n.minY ? n.pitch : this.camera.pitch) * ue;
			let r = this.level.width, i = Math.min(9, r / 5), a = 5 / 9 * i, o = P(r - i, r - a, t.x), s = P(i, a, t.x);
			(o > 0 || s > 0) && (e.yawTarget = M(e.yawTarget, -(60 - 50 * s) * ue, (60 - 50 * o) * ue));
		}
		this._updateCameraBounds();
	}
	_updateCameraBounds() {
		let e = this.rig.distance, t = this.camera, { near: n, mid: r, far: i } = this.cameraBounds, a, o, s;
		e <= t.distance ? (a = n, o = r, s = M((e - t.minDistance) / Math.max(1e-6, t.distance - t.minDistance))) : (a = r, o = i, s = M((e - t.distance) / Math.max(1e-6, t.maxDistance - t.distance)));
		let c = this.rig.bounds;
		c.minX = de(a.minX, o.minX, s), c.maxX = de(a.maxX, o.maxX, s), c.minZ = de(a.minZ, o.minZ, s), c.maxZ = de(a.maxZ, o.maxZ, s);
	}
	_playerFocusDistance() {
		let e = this.player.position, t = this.engine.camera, n = this._focusPos.set(e.x, e.y + .9, e.z).applyMatrix4(t.matrixWorldInverse);
		return Math.max(1, -n.z);
	}
	_updateCinematic(e) {
		let t = this._cine;
		t.t += e;
		let n = t.t * .045;
		t.target.set(t.x + Math.sin(n) * t.driftX, t.y, t.z + Math.sin(n * .7 + 1) * t.driftZ), this.rig.yawTarget = Math.sin(t.t * .05) * 18 * ue, this.rig.distanceTarget = t.distance + Math.sin(t.t * .07) * 3;
	}
	_waterfallFx(e) {
		this._burstTimer -= e, this._sparkleTimer -= e;
		let t = this.world.falls;
		if (!t.length) return;
		let n = this._burstTimer <= 0, r = this._sparkleTimer <= 0;
		if (!n && !r) return;
		let i = this.rig.focusPoint, a = !1;
		for (let e = 0; e < t.length; e++) {
			let o = t[e], s = o.anchor;
			if (!o.splash || o.hidden || Math.hypot(s.x - i.x, s.z - i.z) > 30) continue;
			a = !0;
			let [c, l] = o.dir, u = l, d = -c;
			if (n) {
				let e = (Math.random() - .5) * o.width * .9;
				this.particles.burst("splash", this._tmp.set(o.x + u * e + c * .85, s.y + .05, o.z + d * e + l * .85), 4);
			}
			if (r) {
				let e = (Math.random() - .5) * o.width * 1.4;
				this.particles.burst("sparkle", this._tmp.set(o.x + u * e + c * 1.1, s.y + .5, o.z + d * e + l * 1.1), 2, { size: [.2, .34] });
			}
		}
		a && (n && (this._burstTimer = .28), r && (this._sparkleTimer = .9));
	}
	_updateRegion(e) {
		if (this._regionTimer -= e, this._regionTimer > 0 || this.mode !== "play") return;
		this._regionTimer = .3;
		let t = this.player.position, n = this.regions.find((e) => t.x >= e.minX && t.x < e.maxX && t.z >= e.minZ && t.z < e.maxZ && (e.minY == null || t.y > e.minY));
		if (n && (n.name !== this.region && (this.region = n.name, this.ui.hud.setLocation(z(n.name), n.sub ? B(L(n, "sub"), n.sub, "title") : z(this.level.name))), n.banner && !this._bannersShown.has(n.name) && !this.story?.run)) {
			this._bannersShown.add(n.name);
			let e = z(n.name);
			this.ui.banner.show(e, B(L(n, "banner"), n.banner, "title"), { duration: 2.6 }), this._regionBanner = {
				name: n.name,
				title: e,
				at: this.engine.time.elapsed
			};
		}
	}
	state() {
		let e = this.player.position, t = this.postfx.sceneInfo, n = this.mode === "play" ? this._findInteractable() : null, r = {
			mode: this.mode,
			level: this.level.name,
			player: {
				x: +e.x.toFixed(3),
				y: +e.y.toFixed(3),
				z: +e.z.toFixed(3),
				tile: {
					i: Math.floor(e.x),
					j: Math.floor(e.z)
				},
				facing: this.player.sprite.direction,
				animation: this.player.sprite.animation,
				speed: +this.player.speed.toFixed(2)
			},
			region: this.region,
			time: +this.lighting.timeOfDay.toFixed(3),
			phase: this.lighting.phaseName,
			night: +this.lighting.nightFactor.toFixed(3),
			weather: this.weather.weather,
			weatherShown: this.weather.shown,
			look: this.look,
			dialogOpen: this.ui.dialog.isOpen,
			busy: this.busy,
			photoMode: this.photoMode,
			mapOpen: this.mapOpen,
			music: this.audio.musicPlaying,
			audioReady: this.audio.ready,
			nearest: n ? n.kind === "npc" ? n.npc.id : n.it.id : null,
			drawCalls: t.calls,
			triangles: t.triangles,
			fps: +this.engine.time.fps.toFixed(1),
			pointLights: this.world.lights.length,
			activeLights: this.world.lightPool?.activeCount ?? this.world.lights.length,
			renderScale: +this.engine.renderScale.toFixed(2),
			pixelRatio: +this.engine.pixelRatio.toFixed(3),
			gpuMs: +this.resolution.gpuMs.toFixed(2),
			camera: {
				yaw: +(this.rig.yaw / ue).toFixed(1),
				pitch: +(this.rig.pitch / ue).toFixed(1),
				distance: +this.rig.distance.toFixed(2),
				focus: this.rig.focusPoint.toArray().map((e) => +e.toFixed(2))
			},
			inventory: { ...this.inventory },
			lang: vt(),
			fonts: this._fontsState()
		};
		this.combat?.loaded && (r.combat = this.combat.state());
		let i = this.vfxLights;
		return r.vfxLights = {
			count: i?.count ?? 0,
			held: i?.held ?? 0,
			lit: i?.lit ?? 0
		}, this.campaign && (r.campaign = this.campaign.info()), this.story && (r.story = this.story.info()), this.party && (r.party = this.party.info()), r;
	}
	_fontsState() {
		let e = this.ui?.fonts?.report;
		return e ? {
			mode: e.mode,
			px: e.px,
			sources: { ...e.sources },
			ms: e.ms
		} : null;
	}
	_exposeGlobal() {
		let e = this;
		window.__game = {
			engine: e.engine,
			rig: e.rig,
			postfx: e.postfx,
			lighting: e.lighting,
			ui: e.ui,
			audio: e.audio,
			tileMap: e.tileMap,
			textures: e.textures,
			particles: e.particles,
			godRays: e.godRays,
			player: e.player,
			npcs: e.npcs,
			world: e.world,
			weather: e.weather,
			game: e,
			level: e.level,
			levelSource: e.source,
			setTime: (t) => e.setTime(t),
			teleport: (t, n) => e.teleport(t, n),
			talkTo: (t) => e.talkTo(t),
			setWeather: (t) => e.setWeather(t),
			cycleTime: () => e.cycleTime(),
			cycleWeather: () => e.cycleWeather(),
			setMusic: (t) => e.setMusic(!!t),
			photo: (t = !e.photoMode) => t === e.photoMode ? e.photoMode : e.togglePhotoMode({ instant: !0 }),
			map: (t = !e.mapOpen) => e.toggleMap(!!t),
			setLanguage: (t) => e.setLanguage(t),
			state: () => e.state(),
			party: {
				join: async (t, n = {}) => {
					let r = e.canJoin(t);
					if (!r) return null;
					let i = await e.ensureParty();
					return i.join(r, {
						cls: n.cls,
						preset: n.preset
					}) ? i.info() : null;
				},
				leave: (t) => !!e.party?.leave(t),
				rule: (t, n) => e.party?.setRule(t, n, { source: "test" }) ?? null,
				set: (t, n, r) => e.party?.setField(t, n, r, { source: "test" }) ?? null,
				menu: (t = !e.party?.menuOpen, n) => e.togglePartyMenu(!!t, n, { force: !0 }),
				info: () => e.party?.info() ?? null,
				trail: (t, n) => e.party?.trailInfo(t, n) ?? null,
				sync: async () => (await e.syncParty(), e.party?.info() ?? null)
			}
		}, e.combat && (window.__game.combat = e.combat.hooks), e.campaign && (window.__game.campaign = e.campaign.hooks), e.story && (window.__game.story = e.story.hooks);
	}
	dispose() {
		if (this._disposed) return;
		this._disposed = !0;
		for (let e of this._timeouts) clearTimeout(e);
		this._timeouts.clear(), this._removeAudioUnlock?.(), this._onContextMenu && window.removeEventListener("contextmenu", this._onContextMenu, !0), this._resolveWarm?.(), this.engine?.stop();
		let e = [
			() => this.story?.dispose(),
			() => this.campaign?.dropAside(),
			() => this.combat?.dispose(),
			() => this.party?.dispose(),
			() => this.resolution?.dispose(),
			() => this.blobs?.dispose(),
			() => this.weather?.dispose(),
			() => this.critters?.dispose(this.spriteManager),
			() => this.npcs?.forEach((e) => e.dispose()),
			() => this.player?.dispose(),
			() => this.world?.dispose(),
			() => this.lightPool?.dispose(),
			() => this.vfxLights?.dispose(),
			() => this.campaign?.dispose(),
			() => this.spriteManager?.dispose(),
			() => this.godRays?.dispose(),
			() => this.particles?.dispose(),
			() => this.postfx?.dispose(),
			() => this.engine?.dispose(),
			() => this.ui?.dispose()
		];
		for (let t of e) try {
			t();
		} catch (e) {
			console.warn("[Luminati] dispose step failed:", e);
		}
		window.__game?.game === this && delete window.__game;
	}
}, Yi = .25, Xi = /* @__PURE__ */ new Set([
	"dust",
	"fireflies",
	"sparkle"
]);
Object.assign(globalThis, { __emberGround: {
	foliage(e) {
		return this.scaled += e.length, e.map((e) => ({
			...e,
			scale: (e.scale ?? 1) * Yi
		}));
	},
	scaled: 0,
	size: Yi,
	keeps: (e) => e?.emberExhibit === !0 || !Xi.has(e?.preset),
	dust: !1
} });
//#endregion
//#region ember3d/world.js
var Zi = "", Qi = 1, U = 16 * Math.SQRT2, $i = {
	billboard: "spherical",
	normalUp: .6,
	wrap: .6,
	roundness: .35,
	emissive: "#ffe9d2",
	emissiveIntensity: .2
}, ea = "en", ta = null, na = null, ra = null, ia = null, W = null, aa = null, oa = 0, sa = "soft", ca = 45, la = 30, ua = /* @__PURE__ */ new Map(), da = /* @__PURE__ */ new Map(), fa = (e) => {
	let t = ua.get(e);
	return t || (t = new Promise((t, n) => {
		let r = new Image();
		r.decoding = "async", r.onload = () => t(r), r.onerror = n, r.src = e;
	}), ua.set(e, t)), t;
}, pa = (e) => {
	let t = da.get(e);
	return t || (t = fetch(e).then((e) => e.ok ? e.json() : null).catch(() => null), da.set(e, t)), t;
}, ma = /* @__PURE__ */ new Map();
function ha(e) {
	return ma.has(e) ? ma.get(e) : (ma.set(e, null), Promise.all([pa(`${Zi}actors/${e}.json`), fa(`${Zi}actors/${e}.alb.png`)]).then(([t, n]) => {
		if (!t) {
			ma.set(e, !1);
			return;
		}
		let r = new ee(n);
		r.magFilter = r.minFilter = f, r.generateMipmaps = !1, r.colorSpace = _, r.wrapS = r.wrapT = m, r.needsUpdate = !0, r.name = `ember-actor:${e}`, ma.set(e, {
			meta: t,
			tex: r,
			sheets: /* @__PURE__ */ new Map()
		});
	}).catch(() => ma.set(e, !1)), null);
}
function ga(e, t) {
	let n = t.toFixed(3), r = e.sheets.get(n);
	if (!r) {
		let i = e.meta;
		r = {
			texture: e.tex,
			frameWidth: i.cw,
			frameHeight: i.ch,
			columns: i.frames,
			rows: i.dirs,
			pixelsPerUnit: U / t,
			anchor: [i.ax / i.cw, 0],
			animations: { idle_down: {
				frames: [{
					col: 0,
					row: 0
				}],
				fps: 1,
				loop: !1
			} },
			name: e.tex.name
		}, e.sheets.set(n, r);
	}
	return r;
}
var _a = /* @__PURE__ */ new Map();
function va(e, t) {
	let n = _a.get(e);
	for (n || _a.set(e, n = []); n.length <= t;) {
		let t = new I(e, { ...$i });
		t.visible = !1, W.engine.scene.add(t), n.push(t);
	}
	return n[t];
}
function ya(e, t, n, r, i) {
	let a = 2 * r / i / Math.SQRT2, o = W.tileMap, s = t + a, c = n + a;
	e.position.set(s, o.getHeight(t, n), c);
}
var ba = [];
async function xa(e, t) {
	for (let e of ba) W.engine.scene.remove(e), e.dispose?.();
	if (ba = [], !e?.length) return;
	let n = ["env", `town-${t || "vale"}`], r = await Promise.all(n.map((e) => pa(`${Zi}env/${e}.json`))), i = (e) => {
		for (let t = 0; t < n.length; t++) {
			let i = r[t]?.sprites?.[e];
			if (i) return [n[t], i];
		}
		return null;
	}, a = oa;
	for (let t of e) {
		if (t.canvas) {
			Ba(t);
			continue;
		}
		let e = i(t.id);
		if (!e) continue;
		let [n, r] = e, o = await fa(`${Zi}env/${n}.alb.png`).catch(() => null);
		if (!o || a !== oa) return;
		let s = document.createElement("canvas");
		s.width = r.w, s.height = r.h, s.getContext("2d").drawImage(o, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
		let c = new S(s);
		c.magFilter = c.minFilter = f, c.generateMipmaps = !1, c.colorSpace = _;
		let l = {
			texture: c,
			frameWidth: r.w,
			frameHeight: r.h,
			columns: 1,
			rows: 1,
			pixelsPerUnit: U,
			anchor: [r.ax / r.w, 0],
			animations: { idle_down: {
				frames: [{
					col: 0,
					row: 0
				}],
				fps: 1,
				loop: !1
			} },
			name: `ember-env:${t.id}`,
			dispose() {
				c.dispose();
			}
		}, u = new I(l, {
			...$i,
			castShadow: !1,
			blobShadow: !1
		});
		u.name = `ember:${n}:${t.id}`, ya(u, t.x, t.z, r.h - r.ay, U), W.engine.scene.add(u), ba.push(u), u.update(0, W.engine.camera);
	}
}
var Sa = (e, t) => {
	let n = new g(e), r = n.r * .299 + n.g * .587 + n.b * .114;
	return n.r += (r - n.r) * t, n.g += (r - n.g) * t, n.b += (r - n.b) * t, "#" + n.getHexString();
}, Ca = (e, t) => {
	let n = new g(e);
	return n.multiplyScalar(t), "#" + n.getHexString();
}, wa = be.map((e) => {
	let t = e.night ?? 0;
	return {
		...e,
		top: Ca(Sa(e.top, .3), .8),
		horizon: Ca(Sa(e.horizon, .3), .6),
		bottom: Ca(Sa(e.bottom, .3), .75),
		sun: Sa(e.sun, .3),
		hemiSky: Sa(e.hemiSky, .45),
		hemiGround: Sa(e.hemiGround, .3),
		sunI: e.sunI * .72,
		hemiI: e.hemiI * (.86 - .08 * t) * (e.t >= 18 && e.t <= 20.5 ? 1.4 : 1),
		exp: e.exp * .97,
		fog: e.fog * (.5 + .3 * t)
	};
}), Ta = {
	saturation: .92,
	exposure: .9,
	contrast: 1.06,
	vignette: .78
}, Ea = !1;
function Da() {
	let e = W?.postfx?.settings?.grade, t = W?.lighting?.state?.night ?? 1;
	Ea && e && (e.saturation = .74 + .18 * t, e.exposure = (.84 + .06 * t) * Oa * ka);
}
var Oa = 1, ka = 1, Aa = 1.6, ja = 1, Ma = $i.emissiveIntensity, Na = 0, Pa = (e) => .2126 * e.r + .7152 * e.g + .0722 * e.b;
function Fa() {
	let e = W?.lighting, t = e?.hemi, n = e?.sun;
	return Na = (t ? Pa(t.color) * t.intensity : 0) + (n ? Pa(n.color) * n.intensity * .5 : 0), Math.round(Math.min(ja, Math.max($i.emissiveIntensity, Aa - Na)) * 100) / 100;
}
var Ia = null, La = "default";
function Ra(e, t) {
	let n = W?.lighting;
	if (!n) return;
	let r = e.environment || {}, i = W.postfx?.settings?.grade;
	if (i && (Ia ||= { ...i }, Object.assign(i, Ia, t === "vale" ? Ta : {})), Ea = t === "vale" && !r.interior, r.interior || r.climate || r.season) return;
	let a = t === "vale" ? "dusky" : "default";
	n.setKeyframes(a === "dusky" ? wa : be), La = a;
}
var za = /* @__PURE__ */ new Map();
function Ba(e) {
	let t = za.get(e.canvas);
	if (!t) {
		let n = new S(e.canvas);
		n.magFilter = n.minFilter = f, n.generateMipmaps = !1, n.colorSpace = _, t = {
			texture: n,
			frameWidth: e.canvas.width,
			frameHeight: e.canvas.height,
			columns: 1,
			rows: 1,
			pixelsPerUnit: U,
			anchor: [e.ax / e.canvas.width, 0],
			animations: { idle_down: {
				frames: [{
					col: 0,
					row: 0
				}],
				fps: 1,
				loop: !1
			} },
			name: `ember-prop:${e.id}`
		}, za.set(e.canvas, t);
	}
	let n = new I(t, {
		...$i,
		emissiveIntensity: .3,
		castShadow: !1,
		blobShadow: !e.flat
	});
	n.name = `ember:prop:${e.id}`, ya(n, e.x, e.z, e.canvas.height - e.ay, U), e.flat && n.traverse((e) => {
		e.renderOrder = -1, e.material && (e.material.depthWrite = !1);
	}), W.engine.scene.add(n), ba.push(n), n.update(0, W.engine.camera);
}
var Va = /* @__PURE__ */ new Map(), Ha = "vale";
function Ua(e) {
	if (Va.has(e)) return Va.get(e);
	Va.set(e, null);
	let t = ["env", `town-${Ha}`];
	return Promise.all(t.map((e) => pa(`${Zi}env/${e}.json`))).then(async (n) => {
		for (let r = 0; r < t.length; r++) {
			let i = n[r]?.sprites?.[e];
			if (!i) continue;
			let a = await fa(`${Zi}env/${t[r]}.alb.png`), o = document.createElement("canvas");
			o.width = i.w, o.height = i.h, o.getContext("2d").drawImage(a, i.x, i.y, i.w, i.h, 0, 0, i.w, i.h);
			let s = new S(o);
			s.magFilter = s.minFilter = f, s.generateMipmaps = !1, s.colorSpace = _, Va.set(e, {
				texture: s,
				frameWidth: i.w,
				frameHeight: i.h,
				columns: 1,
				rows: 1,
				pixelsPerUnit: U,
				anchor: [i.ax / i.w, 0],
				below: i.h - i.ay,
				animations: { idle_down: {
					frames: [{
						col: 0,
						row: 0
					}],
					fps: 1,
					loop: !1
				} },
				name: `ember-beast:${e}`
			});
			return;
		}
		Va.set(e, !1);
	}).catch(() => Va.set(e, !1)), null;
}
var Wa = /* @__PURE__ */ new WeakMap();
function Ga(e) {
	let t = Wa.get(e.canvas);
	if (!t) {
		let n = new S(e.canvas);
		n.magFilter = n.minFilter = f, n.generateMipmaps = !1, n.colorSpace = _, t = {
			texture: n,
			frameWidth: e.canvas.width,
			frameHeight: e.canvas.height,
			columns: 1,
			rows: 1,
			pixelsPerUnit: U,
			anchor: [e.ax / e.canvas.width, 0],
			animations: { idle_down: {
				frames: [{
					col: 0,
					row: 0
				}],
				fps: 1,
				loop: !1
			} },
			name: "ember-bit"
		}, Wa.set(e.canvas, t);
	}
	return t;
}
function Ka(e, t) {
	let n = _a.get(e);
	for (n || _a.set(e, n = []); n.length <= t;) {
		let t = new I(e, {
			...$i,
			castShadow: !1,
			blobShadow: !1
		});
		t.visible = !1, W.engine.scene.add(t), n.push(t);
	}
	return n[t];
}
var G = {
	mesh: null,
	id: "",
	cap: 0
};
function qa(e) {
	if (!e || !e.cells.length) {
		G.mesh && (G.mesh.visible = !1), G.id = "";
		return;
	}
	if (e.id === G.id && G.mesh) {
		G.mesh.visible = !0;
		return;
	}
	let n = e.cells.length / 3;
	if (!G.mesh || G.cap < n) {
		G.mesh && (W.engine.scene.remove(G.mesh), G.mesh.geometry.dispose(), G.mesh.material.dispose());
		let e = new v(.5, .5);
		e.rotateX(-Math.PI / 2);
		let r = new h({
			transparent: !0,
			opacity: .72,
			depthWrite: !1,
			polygonOffset: !0,
			polygonOffsetFactor: -2,
			polygonOffsetUnits: -2,
			toneMapped: !1
		});
		G.cap = Math.max(256, Math.ceil(n * 1.5)), G.mesh = new t(e, r, G.cap), G.mesh.renderOrder = 2, G.mesh.frustumCulled = !1, W.engine.scene.add(G.mesh);
	}
	let r = new o(), i = new g().setRGB(16 / 255, 54 / 255, 64 / 255, _), a = new g().setRGB(40 / 255, 92 / 255, 104 / 255, _);
	for (let t = 0; t < n; t++) {
		let n = e.cells[t * 3], o = e.cells[t * 3 + 1];
		r.makeTranslation(n, W.tileMap.getHeight(n, o) + .035, o), G.mesh.setMatrixAt(t, r), G.mesh.setColorAt(t, e.cells[t * 3 + 2] ? a : i);
	}
	G.mesh.count = n, G.mesh.instanceMatrix.needsUpdate = !0, G.mesh.instanceColor && (G.mesh.instanceColor.needsUpdate = !0), G.mesh.visible = !0, G.id = e.id;
}
var Ja = [];
function Ya(e, t) {
	let n = Ja[e];
	return n && n.sheet !== t && (W.engine.scene.remove(n), n.dispose?.(), n = null), n || (n = new I(t, { ...$i }), W.engine.scene.add(n), Ja[e] = n), n.material.emissiveIntensity !== Ma && (n.material.emissiveIntensity = Ma), n;
}
var Xa = "uniform vec4 uRect; uniform vec2 uView; varying vec2 vUv;\nvoid main() { vUv = position.xy; vec2 p = uRect.xy + position.xy * uRect.zw; gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0); }", Za = "uniform sampler2D tEmi, tDepth; uniform vec2 uTexel, uBuf; uniform mat4 uInvVP; uniform vec4 uKey; uniform float uFloor; varying vec2 vUv;\nvoid main() {\n  vec4 e = texture2D(tEmi, vUv); vec3 c = e.rgb * 2.4, g = vec3(0.0); float own = e.a;\n  for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; vec2 d = vec2(cos(a), sin(a)) * uTexel;\n    vec4 n = texture2D(tEmi, vUv + d * 2.0), f = texture2D(tEmi, vUv + d * 4.5); g += n.rgb + f.rgb * 0.6; own = max(own, max(n.a, f.a)); }\n  float k = 1.0;\n  if (uKey.w > 0.5 && own > 0.002) {\n    vec2 suv = gl_FragCoord.xy / uBuf; float z = texture2D(tDepth, suv).x;\n    if (z < 1.0) {\n      vec4 w = uInvVP * vec4(suv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0); w.xyz /= w.w;\n      float scene = 2.0 * (w.x + w.z) + uKey.z, eff = uKey.x + own * 255.0 * uKey.y;\n      if (w.y > uFloor && scene > eff + 1.5) k = 0.22;\n    }\n  }\n  gl_FragColor = vec4((c + g * 0.12) * k, 1.0);\n}", K = {
	scene: null,
	cam: null,
	mat: null,
	tex: null,
	on: !1,
	keyed: !1
};
function Qa() {
	if (!K.on || !W) return;
	let e = W.engine.renderer, t = e.autoClear, n = K.mat.uniforms, r = W.engine.camera;
	n.tDepth.value = W.postfx?.depthTexture || null, n.uKey.value.w = K.keyed && n.tDepth.value ? 1 : 0, e.getDrawingBufferSize(n.uBuf.value), n.uInvVP.value.multiplyMatrices(r.matrixWorld, r.projectionMatrixInverse), e.autoClear = !1, e.setRenderTarget(null), e.render(K.scene, K.cam), e.autoClear = t;
}
function $a(t) {
	if (!t || !t.emi) {
		K.on = !1;
		return;
	}
	let r = new Uint32Array(t.emi.buffer, t.emi.byteOffset, t.emi.byteLength >> 2), a = !1;
	for (let e = 0; e < r.length; e++) if (r[e] & 16777215) {
		a = !0;
		break;
	}
	if (K.on = a, a) {
		if (!K.scene) {
			K.scene = new C(), K.cam = new p(), K.mat = new y({
				vertexShader: Xa,
				fragmentShader: Za,
				transparent: !0,
				depthTest: !1,
				depthWrite: !1,
				blending: 2,
				uniforms: {
					tEmi: { value: null },
					uTexel: { value: new b() },
					uRect: { value: new i() },
					uView: { value: new b() },
					tDepth: { value: null },
					uBuf: { value: new b(1, 1) },
					uInvVP: { value: new o() },
					uKey: { value: new i() },
					uFloor: { value: 1.2 }
				}
			});
			let t = new w();
			t.setAttribute("position", new x([
				0,
				0,
				0,
				1,
				0,
				0,
				0,
				1,
				0,
				1,
				1,
				0
			], 3)), t.setIndex([
				0,
				2,
				1,
				1,
				2,
				3
			]);
			let n = new e(t, K.mat);
			n.frustumCulled = !1, K.scene.add(n), W.engine.events.on("afterRender", Qa);
		}
		(!K.tex || K.tex.image.width !== t.w || K.tex.image.height !== t.h || K.tex.image.data !== t.emi) && (K.tex?.dispose(), K.tex = new D(t.emi, t.w, t.h, l), K.tex.flipY = !1, K.tex.magFilter = K.tex.minFilter = n, K.tex.generateMipmaps = !1, K.mat.uniforms.tEmi.value = K.tex, K.mat.uniforms.uTexel.value.set(1 / t.w, 1 / t.h)), K.tex.needsUpdate = !0, K.mat.uniforms.uRect.value.set(t.x, t.y, t.w * t.px, t.h * t.px), K.mat.uniforms.uView.value.set(innerWidth, innerHeight), K.keyed = !!t.key, t.key && K.mat.uniforms.uKey.value.set(t.key.base, t.key.step, t.key.origin, 1);
	}
}
var eo = {
	x: 0,
	y: 1,
	z: 0,
	ppu: 22,
	ready: !1
};
function to() {
	let e = W.rig, t = W.engine.camera, n = innerHeight / (2 * eo.ppu * Math.tan(Qi / 2 * Math.PI / 180));
	e.target = null, e.bounds = null, e.lift = 0, e.minDistance = 1, e.maxDistance = 1e6, e.minPitch = 0, e.maxPitch = Math.PI / 2, e.freeYaw = !0, e.yaw = e.yawTarget = ca * Math.PI / 180, e.pitch = e.pitchTarget = la * Math.PI / 180, e.distance = e.distanceTarget = n, e.focusPoint.set(eo.x, eo.y, eo.z), (Math.abs(t.fov - Qi) > 1e-6 || Math.abs(t.far - (n + 600)) > 1) && (t.fov = Qi, t.near = Math.max(1, n - 300), t.far = n + 600, t.updateProjectionMatrix()), e._apply(0), mi(n - 7);
	let r = W.postfx?.settings?.dof;
	r && (r.autoFocus = !1, r.focusDistance = n);
}
async function no(e) {
	await na, Object.assign(globalThis, {
		__emberUiRoot: ia,
		__emberInputTarget: new EventTarget(),
		__emberSilent: !0
	}), W = new Ji({
		container: ra,
		level: e,
		source: "emberfall",
		autostart: !0,
		lang: ea,
		fonts: ta,
		look: "diorama"
	}), await W.init(() => {}), W.audio && (W.audio.muted = !0), W._updatePlayCamera = () => {}, W._updateCameraBounds = () => {}, W.start(), await W.warmedUp, W.engine.stop(), W.engine.events.on("lateUpdate", () => {
		W && to();
	}), W.engine.events.on("update", Da), W.engine.events.on("update", () => {
		let e = wo, t = W?.lighting;
		e && t?.hemi && (t.hemi.color.setRGB(e.sky[0], e.sky[1], e.sky[2]), t.hemi.groundColor.setRGB(e.ground[0], e.ground[1], e.ground[2]), t.hemi.intensity = e.i, t.sun && (t.sun.intensity *= e.sun));
	}), W.lighting && (W.lighting._shadowExtent = Math.max(W.lighting._shadowExtent || 22, 34));
}
function ro() {
	let e = W.player;
	e && (e.sprite && (e.sprite.visible = !1), e.visible = !1);
}
var io = new T(.46, .6, 40), ao = new E(1, 40), oo = new T(.8, 1, 40), so = (() => {
	let e = [];
	for (let t = 0; t < 4; t++) e.push(new T(.7, .8, 10, 1, t * Math.PI / 2 + .25, Math.PI / 2 - .5));
	return co(e);
})();
function co(e) {
	let t = [], n = [], r = 0;
	for (let i of e) {
		let e = i.getAttribute("position"), a = i.getIndex();
		for (let n = 0; n < e.count; n++) t.push(e.getX(n), e.getY(n), e.getZ(n));
		for (let e = 0; e < a.count; e++) n.push(a.getX(e) + r);
		r += e.count, i.dispose();
	}
	let i = new w();
	return i.setAttribute("position", new x(t, 3)), i.setIndex(n), i;
}
var lo = new T(.88, 1, 40), uo = new v(1, 1).translate(.5, 0, 0), fo = () => new h({
	transparent: !0,
	depthWrite: !1,
	polygonOffset: !0,
	polygonOffsetFactor: -2,
	polygonOffsetUnits: -2,
	toneMapped: !1
}), po = {
	ring: [],
	disc: [],
	rim: [],
	focus: [],
	wfill: [],
	wrim: [],
	lane: []
}, mo = {
	ring: io,
	disc: ao,
	rim: oo,
	focus: so,
	wfill: ao,
	wrim: lo,
	lane: uo
};
function q(t, n) {
	let r = po[t];
	for (; r.length <= n;) {
		let n = new e(mo[t], fo());
		n.rotation.x = -Math.PI / 2, n.renderOrder = 2, n.visible = !1, W.engine.scene.add(n), r.push(n);
	}
	return r[n];
}
function ho(e, t, n, r, i, a) {
	e.visible = a > .01, e.visible && (e.position.set(t, W.tileMap.getHeight(t, n) + .03, n), e.scale.setScalar(r), e.material.color.setRGB(i[0] / 255, i[1] / 255, i[2] / 255, _), e.material.opacity = a);
}
function go(e, t, n, r, i, a, o, s, c) {
	let l = r - t, u = i - n, d = Math.hypot(l, u) * a;
	e.visible = c > .01 && d > .02, e.visible && (e.position.set(t, Math.max(W.tileMap.getHeight(t, n), W.tileMap.getHeight(r, i)) + .05, n), e.rotation.z = Math.atan2(-u, l), e.scale.set(d, o, 1), e.material.color.setRGB(s[0] / 255, s[1] / 255, s[2] / 255, _), e.material.opacity = c);
}
var _o = [
	255,
	86,
	30
], vo = [
	255,
	238,
	220
], yo = [
	24,
	6,
	4
], bo = null, xo = null, So = -1, Co = 0, wo = null, To = !1, J = {
	body: [
		1.15,
		.8,
		.16
	],
	core: [
		1.6,
		1.25,
		.3
	],
	burst: [
		1.45,
		1.08,
		.22
	],
	glyph: [
		.85,
		.6,
		.12
	],
	ring: [
		.8,
		.56,
		.1
	]
}, Y = {
	body: [
		.32,
		.85,
		.1
	],
	core: [
		.75,
		1.65,
		.25
	]
}, Eo = [
	.45,
	.75,
	1.4
], Do = [
	1.6,
	.85,
	.25
], Oo = [
	1.6,
	.8,
	.3
], X = (e) => e <= 0 ? 0 : e >= 1 ? 1 : e * e * (3 - 2 * e), ko = (e) => e < 0 ? 0 : e > 1 ? 1 : e, Ao = (e) => e <= 0 ? 0 : e < .55 ? 1.15 * (1 - (1 - e / .55) ** 3) : e < 1 ? 1.15 - .15 * X((e - .55) / .45) : 1, Z = null, jo = null, Q = /* @__PURE__ */ new Map(), Mo = {}, No = new r();
function Po() {
	if (Z || !W?.engine) return Z;
	let e = W.engine.scene, t = new An({ capacity: 48 }), n = new jn({
		capacity: 4,
		heightField: {
			sample: (e, t) => W.tileMap.getHeight(e, t),
			surface: (e, t) => W.tileMap._surface(e, t),
			minX: 0,
			minZ: 0,
			get maxX() {
				return W.tileMap.width;
			},
			get maxZ() {
				return W.tileMap.depth;
			}
		}
	}), r = new xe({
		atlas: _e(),
		capacity: 128,
		name: "ember:spells"
	}), i = new Mn(), a = new Nn({ capacity: 9 });
	r.enableHalo(), e.add(t.object), e.add(n.object), e.add(r.object), e.add(i.object), e.add(a.object), t.warm(), n.warm(), i.warm(), a.warm();
	let o = r.alloc();
	return r.set(o, {
		frame: "partyPillar",
		x: 0,
		y: -500,
		z: 0,
		mode: "billboard",
		a: 1,
		halo: 1
	}), Z = {
		crystals: t,
		frost: n,
		quads: r,
		dome: i,
		blades: a,
		warmQuad: o,
		warmN: 4,
		domeOf: null
	}, Z;
}
function $(e, t) {
	for (let e in Mo) delete Mo[e];
	Object.assign(Mo, t), Z.quads.set(e, Mo);
}
function Fo(e) {
	for (let t of e.blades || []) Z.blades.free(t);
	e.dome && Z.domeOf === e && (Z.dome.hide(), Z.domeOf = null);
	for (let t of e.crystals) Z.crystals.free(t);
	for (let t of e.quads) Z.quads.free(t);
	e.gf >= 0 && Z.frost.free(e.gf);
}
function Io(e, t, n, r) {
	if (!Z && !r && !e.length) return;
	let i = Po();
	if (!i) return;
	i.warmN > 0 && --i.warmN === 0 && (i.crystals.unwarm(), i.frost.unwarm(), i.dome.unwarm(), i.blades.unwarm(), i.quads.free(i.warmQuad));
	let a = /* @__PURE__ */ new Set(), o = (e, t) => W.tileMap.getHeight(e, t);
	W.engine.camera.getWorldDirection(No);
	let s = Math.hypot(No.x, No.z) || 1, c = -No.x / s, l = -No.z / s, u = null;
	for (let n of e) {
		a.add(n.key);
		let e = Q.get(n.key);
		e || (e = {
			crystals: [],
			quads: [],
			gf: -1,
			landed: !1,
			seed: (n.seed >>> 0) % 8192
		}, Q.set(n.key, e));
		let r = n.land;
		if (n.id === "frost_nova") {
			if (e.gf < 0 && (e.gf = i.frost.add({
				x: n.tx,
				z: n.tz,
				radius: Math.max(.6, Math.min(7, n.r)),
				seed: e.seed + 1
			})), r != null && !e.landed) {
				e.landed = !0, e.spikes = [];
				for (let t = 0; t < 7; t++) {
					let r = t / 7 * Math.PI * 2 + e.seed % 7 * .13, i = n.r * (.72 + .12 * ((t * 37 + e.seed) % 5) / 4), a = n.tx + Math.cos(r) * i, o = n.tz + Math.sin(r) * i;
					e.spikes.push({
						x: a,
						z: o,
						height: .75 + .35 * ((t * 53 + e.seed) % 7 / 6),
						radius: .17,
						yaw: r,
						tiltX: Math.cos(r) * .18,
						tiltZ: Math.sin(r) * .18,
						start: .03 * t
					});
				}
				for (let t of n.reached.slice(0, 4)) e.spikes.push({
					x: t.x + .12,
					z: t.z - .18,
					height: .95,
					radius: .2,
					yaw: 0,
					tiltX: 0,
					tiltZ: 0,
					start: .05
				});
				for (let t of e.spikes) t.h = i.crystals.spawn({
					x: t.x,
					y: o(t.x, t.z) - .02,
					z: t.z,
					height: t.height,
					radius: t.radius,
					yaw: t.yaw,
					tiltX: t.tiltX,
					tiltZ: t.tiltZ,
					seed: e.seed + t.x * 7
				}), t.h >= 0 && e.crystals.push(t.h);
			}
			let t = r == null ? 0 : Math.exp(-r / .15);
			if (e.gf >= 0 && i.frost.set(e.gf, {
				spread: r == null ? .08 * X(n.age / .38) : .08 + .92 * X(r / .3),
				cracks: r == null ? 0 : X((r - .04) / .5),
				fade: r == null ? 0 : X((r - 1.5) / 1),
				glow: 1 + .8 * t
			}), e.spikes) for (let n of e.spikes) {
				if (n.h < 0) continue;
				let e = (r - n.start) / .13, a = X((r - .55) / .3), o = X((r - .88) / .3);
				i.crystals.set(n.h, {
					rise: Ao(e) * (1 - o),
					crack: a,
					glint: X((r - .08 - n.start) / .38),
					glow: 1 + .35 * Math.exp(-Math.max(0, r - n.start - .07) / .1) + .2 * t + .5 * a
				});
			}
			let a = r == null ? .25 * X(n.age / .38) : .25 + 3.2 * t + .6 * (1 - X((r - .4) / .6));
			(!u || a > u.k) && (u = {
				x: n.tx,
				z: n.tz,
				k: a,
				color: [
					.55,
					.95,
					1.9
				]
			});
		} else if (n.id === "turn_undead") {
			e.glyph || (e.glyph = i.quads.alloc(), e.quads.push(e.glyph));
			let t = r == null ? X(n.age / .38) : 1, a = r == null ? 1 : 1 - X((r - .35) / .5), s = o(n.x, n.z) + .04;
			if ($(e.glyph, {
				frame: "partyGlyphHoly",
				x: n.x,
				y: s,
				z: n.z,
				mode: "flat",
				scale: 2 * n.r / 8 * (.35 + .65 * t),
				rot: n.age * .9,
				r: J.glyph[0],
				g: J.glyph[1],
				b: J.glyph[2],
				a: .85 * t * a * (r != null && r < .12 ? 1.25 : 1)
			}), r != null) {
				e.landed || (e.landed = !0, e.ring = i.quads.alloc(), e.over = i.quads.alloc(), e.quads.push(e.ring, e.over), e.dead = n.reached.slice(0, 6).map((t) => {
					let r = Math.hypot(t.x - n.x, t.z - n.z), a = i.quads.alloc(), o = i.quads.alloc(), s = i.quads.alloc();
					return e.quads.push(a, o, s), {
						x: t.x,
						z: t.z,
						at: .06 + .12 * Math.min(1, r / Math.max(.5, n.r)),
						body: a,
						core: o,
						foot: s
					};
				}));
				let t = X(r / .32);
				$(e.ring, {
					frame: "partyRing",
					index: r < .16 ? 0 : 1,
					x: n.x,
					y: s + .02,
					z: n.z,
					mode: "flat",
					scale: 2.2 * n.r / 6 * (.15 + .85 * t),
					r: J.ring[0],
					g: J.ring[1],
					b: J.ring[2],
					a: .9 * (1 - X((r - .2) / .3))
				}), $(e.over, {
					frame: "partySunburst",
					index: Math.min(3, Math.floor(r / .08)),
					x: n.x + c * .3,
					y: s + 1.5,
					z: n.z + l * .3,
					mode: "billboard",
					scale: 1.5,
					r: J.burst[0],
					g: J.burst[1],
					b: J.burst[2],
					a: 1 - X((r - .15) / .2),
					halo: 1
				});
				for (let t of e.dead) {
					let e = r - t.at, n = o(t.x, t.z), i = .85, a = 3 * i;
					if (e < 0) {
						$(t.body, {
							frame: "partyPillar",
							a: 0
						}), $(t.core, {
							frame: "partyPillar",
							a: 0
						}), $(t.foot, {
							frame: "partySunburst",
							a: 0
						});
						continue;
					}
					$(t.body, {
						frame: "partyPillar",
						index: 1 + Math.min(2, Math.floor(e / .107)),
						x: t.x + c * .15,
						y: n + a,
						z: t.z + l * .15,
						mode: "billboard",
						scale: i,
						r: J.body[0],
						g: J.body[1],
						b: J.body[2],
						a: .9 * Math.max(0, Math.min(1, (.32 - e) / .14))
					}), $(t.core, {
						frame: "partyPillar",
						index: 0,
						x: t.x + c * .17,
						y: n + a,
						z: t.z + l * .17,
						mode: "billboard",
						scale: i,
						r: J.core[0],
						g: J.core[1],
						b: J.core[2],
						a: Math.max(0, Math.min(1, (.24 - e) / .1)),
						halo: 1
					}), $(t.foot, {
						frame: "partySunburst",
						index: Math.min(3, Math.floor(e / .08)),
						x: t.x,
						y: n + .05,
						z: t.z,
						mode: "flat",
						scale: 1.1,
						rot: e * 2,
						r: J.burst[0],
						g: J.burst[1],
						b: J.burst[2],
						a: Math.max(0, 1 - e / .4),
						halo: 1
					});
				}
			}
			let d = r == null ? .4 * X(n.age / .38) : .4 + 3.4 * Math.exp(-r / .18);
			(!u || d > u.k) && (u = {
				x: n.x,
				z: n.z,
				k: d,
				color: [
					1.9,
					1.4,
					.5
				]
			});
		} else if (n.id === "mend" && r != null) {
			e.orbs || (e.orbs = [
				0,
				1,
				2
			].map(() => i.quads.alloc()), e.body = i.quads.alloc(), e.core = i.quads.alloc(), e.foot = i.quads.alloc(), e.quads.push(...e.orbs, e.body, e.core, e.foot));
			let t = o(n.x, n.z) + 1.2, a = o(n.tx, n.tz) + .9;
			e.orbs.forEach((e, i) => {
				let o = ko((r - i * .05) / .3), s = Math.sin(o * Math.PI) * .6;
				$(e, {
					frame: "partyHolyOrb",
					index: Math.floor(r * 12) % 2,
					x: n.x + (n.tx - n.x) * o + c * .2,
					y: t + (a - t) * o + s,
					z: n.z + (n.tz - n.z) * o + l * .2,
					mode: "billboard",
					scale: 1.2,
					r: Y.core[0],
					g: Y.core[1],
					b: Y.core[2],
					a: +(o > 0 && o < 1),
					halo: 1
				});
			});
			let s = r - .3, d = o(n.tx, n.tz), f = .6, p = 3 * f;
			$(e.body, {
				frame: "partyPillar",
				index: 1 + Math.min(2, Math.max(0, Math.floor(s / .13))),
				x: n.tx + c * .3,
				y: d + p,
				z: n.tz + l * .3,
				mode: "billboard",
				scale: f,
				r: Y.body[0],
				g: Y.body[1],
				b: Y.body[2],
				a: s > 0 ? .85 * ko((.45 - s) / .18) : 0
			}), $(e.core, {
				frame: "partyPillar",
				index: 0,
				x: n.tx + c * .32,
				y: d + p,
				z: n.tz + l * .32,
				mode: "billboard",
				scale: f,
				r: Y.core[0],
				g: Y.core[1],
				b: Y.core[2],
				a: s > 0 ? ko((.28 - s) / .1) : 0,
				halo: 1
			}), $(e.foot, {
				frame: "partySunburst",
				index: Math.min(3, Math.max(0, Math.floor(s / .08))),
				x: n.tx,
				y: d + .05,
				z: n.tz,
				mode: "flat",
				scale: 1,
				rot: s * 2,
				r: Y.core[0],
				g: Y.core[1],
				b: Y.core[2],
				a: s > 0 ? Math.max(0, 1 - s / .5) : 0,
				halo: 1
			});
			let m = s > 0 ? 2.6 * Math.exp(-s / .2) : .3;
			(!u || m > u.k) && (u = {
				x: n.tx,
				z: n.tz,
				k: m,
				color: [
					.6,
					1.8,
					.5
				]
			});
		} else if (n.id === "bless" && r != null) {
			e.glyph || (e.glyph = i.quads.alloc(), e.bursts = n.reached.slice(0, 4).map(() => i.quads.alloc()), e.quads.push(e.glyph, ...e.bursts));
			let t = X(r / .3) * (1 - X((r - .9) / .5));
			$(e.glyph, {
				frame: "partyGlyphHoly",
				x: n.x,
				y: o(n.x, n.z) + .04,
				z: n.z,
				mode: "flat",
				scale: .32 + .14 * X(r / .3),
				rot: r * .8,
				r: J.glyph[0],
				g: J.glyph[1],
				b: J.glyph[2],
				a: .9 * t
			}), e.bursts.forEach((e, t) => {
				let i = n.reached[t], a = r - .15;
				$(e, {
					frame: "partySunburst",
					index: Math.min(3, Math.max(0, Math.floor(a / .08))),
					x: i.x + c * .2,
					y: o(i.x, i.z) + 1.7,
					z: i.z + l * .2,
					mode: "billboard",
					scale: .9,
					r: J.burst[0],
					g: J.burst[1],
					b: J.burst[2],
					a: a > 0 ? Math.max(0, 1 - a / .4) : 0,
					halo: 1
				});
			});
			let a = 1.8 * Math.exp(-r / .35);
			(!u || a > u.k) && (u = {
				x: n.x,
				z: n.z,
				k: a,
				color: [
					1.9,
					1.4,
					.5
				]
			});
		} else if (n.id === "cleave" && r != null) {
			e.blades || (e.blades = [
				0,
				1,
				2
			].map((t) => i.blades.spawn({
				x: n.x,
				y: -500,
				z: n.z,
				length: 1.1,
				width: .17,
				palette: 0,
				seed: e.seed + t * 7
			})));
			let t = Math.atan2(n.tz - n.z, n.tx - n.x), a = -.9 + 1.8 * X(r / .22), s = o(n.x, n.z) + .75;
			e.blades.forEach((e, o) => {
				if (e < 0) return;
				let c = t + (o - 1) * .55 + a, l = Math.cos(c), u = Math.sin(c), d = 1.05;
				i.blades.set(e, {
					x: n.x + l * d,
					y: s,
					z: n.z + u * d,
					ax: -l,
					ay: .05,
					az: -u,
					nx: 0,
					ny: 1,
					nz: 0,
					glow: 1.5,
					runes: X(r / .15),
					dissolve: X((r - .28) / .3),
					dissolveDir: 1,
					ghost: .15
				});
			});
		} else if (n.id === "shield_wall" && r != null) e.snaps || (e.snaps = n.reached.slice(0, 8).map(() => i.quads.alloc()), e.quads.push(...e.snaps)), e.snaps.forEach((e, t) => {
			let i = n.reached[t], a = ko(r / .35);
			$(e, {
				frame: "partyRing",
				index: a < .5 ? 0 : 1,
				x: i.x,
				y: o(i.x, i.z) + .05,
				z: i.z,
				mode: "flat",
				scale: .25 + .2 * a,
				r: Do[0],
				g: Do[1],
				b: Do[2],
				a: 1 - a
			});
		});
		else if (n.id === "aura_wall") {
			if ((!i.domeOf || !Q.has(i.domeOf.key)) && (i.dome.show({
				x: n.x,
				y: o(n.x, n.z),
				z: n.z,
				radius: 1.15
			}), i.domeOf = e, e.key = n.key, e.dome = !0, e.t = 0), i.domeOf === e) {
				e.t += t, i.dome.object.position.set(n.x, o(n.x, n.z), n.z), i.dome.object.updateMatrix(), i.dome.object.updateMatrixWorld(!0);
				let r = e.t * .6 % 1;
				i.dome.set({
					rise: X(e.t / .35),
					dissolve: 1 - ko(n.k / .8),
					sweepA: r,
					sweepB: (r + .5) % 1
				});
			}
		} else if (n.id === "aura_ward") e.ring || (e.ring = i.quads.alloc(), e.quads.push(e.ring), e.t = 0), e.t += t, $(e.ring, {
			frame: "partyWardRing",
			x: n.x,
			y: o(n.x, n.z) + .05,
			z: n.z,
			mode: "flat",
			scale: .85 + .05 * Math.sin(e.t * 4),
			rot: e.t * .5,
			r: Eo[0],
			g: Eo[1],
			b: Eo[2],
			a: .9 * X(e.t / .25),
			halo: 1
		});
		else if (n.id === "firebolt_fly") e.bolt || (e.bolt = i.quads.alloc(), e.quads.push(e.bolt), e.t = 0), e.t += t, $(e.bolt, {
			frame: "emberBolt",
			index: Math.floor(e.t * 12) % 2,
			x: n.x + c * .2,
			y: o(n.x, n.z) + 1,
			z: n.z + l * .2,
			mode: "billboard",
			scale: 1.5,
			r: Oo[0],
			g: Oo[1],
			b: Oo[2],
			a: 1,
			halo: 1
		});
		else if (n.id === "firebolt" && r != null) {
			e.flames || (e.flames = [
				0,
				1,
				2,
				3,
				4,
				5
			].map(() => i.quads.alloc()), e.hit = i.quads.alloc(), e.quads.push(...e.flames, e.hit));
			let t = X(r / .12) * (1 - X((r - .5) / .6)), a = o(n.tx, n.tz);
			e.flames.forEach((i, o) => {
				let s = o / 6 * Math.PI * 2 + e.seed % 5 * .3, c = .45 + .15 * ((o * 3 + e.seed) % 4) / 3;
				$(i, {
					frame: "wallFlame",
					index: Math.floor(r * 10 + o) % 4,
					x: n.tx + Math.cos(s) * c,
					y: a + .55 * (.8 + .3 * t),
					z: n.tz + Math.sin(s) * c,
					mode: "billboard",
					scale: .9 + .3 * t,
					r: Oo[0],
					g: Oo[1],
					b: Oo[2],
					a: t,
					halo: 1
				});
			}), $(e.hit, {
				frame: "impact",
				index: Math.min(3, Math.floor(r * 14)),
				x: n.tx + c * .3,
				y: a + .9,
				z: n.tz + l * .3,
				mode: "billboard",
				scale: 3,
				r: 1.8,
				g: 1.2,
				b: .5,
				a: +(r < .3),
				halo: 1
			});
		}
	}
	for (let [e, t] of Q) a.has(e) || (Fo(t), Q.delete(e));
	jo && (u && u.k > .02 ? jo.set(u.x, o(u.x, u.z) + 1.4, u.z, {
		color: u.color,
		intensity: 2.6 * u.k / (n ?? 1),
		distance: 6.5,
		decay: 1.5,
		flicker: .08
	}) : jo.off()), i.domeOf && !Q.has(i.domeOf.key) && (i.dome.hide(), i.domeOf = null), i.crystals.update(t), i.frost.update(t), i.blades.update(t), i.quads.update();
}
var Lo = {
	ready: !1,
	async load(e, t = [], n = "vale") {
		let r = ++oa;
		n !== Ha && (Ha = n, Va.clear());
		let i = St(e).level;
		return aa = (async () => {
			W ? await W.swapLevel(i, { spawn: i.spawn }) : await no(i), r === oa && (ro(), To = !!i.environment?.interior, Lo.settings({ dof: sa }), Ra(i, n), await xa(t, n));
		})(), await aa, r === oa;
	},
	settings(e = {}) {
		e.dof && (sa = e.dof), e.bright > 0 && (Oa = e.bright), e.figLit > 0 && (Aa = e.figLit), e.figMax > 0 && (ja = e.figMax);
		let t = W?.postfx?.settings;
		t?.dof && Object.assign(t.dof, {
			enabled: sa !== "off" && !To,
			focusRange: 16,
			tiltShift: .14,
			tiltWidth: .62
		});
	},
	frame(e) {
		if (!W || !W.engine) return;
		ka = e.bright > 0 ? e.bright : 1, eo.x = e.focus[0], eo.y = e.focus[1], eo.z = e.focus[2], eo.ppu = e.ppu, Number.isFinite(e.hour) && Math.abs((W.lighting?.timeOfDay ?? -1) - e.hour) > .004 && W.setTime(e.hour), e.weather && W.weather?.weather !== e.weather && W.setWeather(e.weather), W.lighting?.settings && (W.lighting.settings.fogMul = 1 + .6 * (e.fog || 0), W.lighting.settings.pointLightMul = e.ambient?.lamps ?? 1), e.hero && W.player && (ro(), W.player.position.set(e.hero[0], W.tileMap.getHeight(e.hero[0], e.hero[1]), e.hero[1])), Ma = Fa();
		let t = /* @__PURE__ */ new Map(), n = W.engine.camera;
		for (let r of e.actors) {
			let e = ha(r.name);
			if (!e) continue;
			let i = r.cw ? r.cw / e.meta.cw : 1, a = ga(e, i), o = t.get(a) || 0;
			t.set(a, o + 1);
			let s = va(a, o);
			s.visible = !0, s.material.emissiveIntensity !== Ma && (s.material.emissiveIntensity = Ma), (s._col !== r.col || s._row !== r.row) && s.setFrame(r.col, r.row), ya(s, r.x, r.z, (e.meta.ch - e.meta.ay) * i, a.pixelsPerUnit * i);
			let c = r.flash || 0, l = c ? 0 : Math.round((r.warn || 0) * 20) / 20;
			if (s._emberFlash !== c || s._emberWarn !== l) {
				s._emberFlash = c, s._emberWarn = l;
				let e = 1 + c * 2.6;
				s.tint = l ? new g(1 + .9 * l, 1 + .12 * l, 1 - .35 * l) : new g(e, e * .96, e * .9);
			}
			let u = 1 - (r.fade || 0);
			Math.abs(s.opacity - u) > .01 && (s.opacity = u), s.update(0, n);
		}
		for (let r of e.bits || []) {
			let e = Ga(r), i = t.get(e) || 0;
			t.set(e, i + 1);
			let a = Ka(e, i), o = r.glow ? 1.6 : .3;
			a.visible = !0, a.material.emissiveIntensity !== o && (a.material.emissiveIntensity = o), ya(a, r.x, r.z, r.canvas.height - r.ay - r.lift, U);
			let s = r.flash || 0;
			if (a._emberFlash !== s) {
				a._emberFlash = s;
				let e = 1 + s * 2.6;
				a.tint = new g(e, e * .96, e * .9);
			}
			a.update(0, n);
		}
		for (let [e, n] of _a) {
			let r = t.get(e) || 0;
			for (let e = r; e < n.length; e++) n[e].visible && (n[e].visible = !1);
		}
		let r = {
			ring: 0,
			disc: 0,
			rim: 0,
			focus: 0,
			wfill: 0,
			wrim: 0,
			lane: 0
		};
		for (let t of e.rings || []) ho(q("ring", r.ring++), t.x, t.z, 1, t.col, t.a);
		if (e.mark) {
			let t = q("focus", r.focus++);
			ho(t, e.mark.x, e.mark.z, 1, [
				255,
				226,
				150
			], .7 + .2 * Math.sin(Co * 4)), t.rotation.z = Co, Co += (e.dt || 0) * .9;
		}
		for (let t of e.hazards || []) ho(q("disc", r.disc++), t.x, t.z, t.r, t.col, .82 * t.a), ho(q("rim", r.rim++), t.x, t.z, t.r, t.rim, .42 * t.a);
		for (let t of e.warns || []) {
			let e = t.heavy ? 1 : .62, n = t.hit > 0 ? t.hit : 1, i = 1 - (1 - t.p) * (1 - t.p);
			t.lane ? (go(q("lane", r.lane++), t.x, t.z, t.tx, t.tz, 1, t.w * 1.25, yo, .3 * e * n), go(q("lane", r.lane++), t.x, t.z, t.tx, t.tz, 1, t.w, _o, .16 * e * n), go(q("lane", r.lane++), t.x, t.z, t.tx, t.tz, t.p, t.w * .7, t.hit > 0 ? vo : _o, (.22 + .28 * t.p) * e * n), ho(q("wrim", r.wrim++), t.tx, t.tz, t.heavy ? .42 : .3, t.hit > 0 ? vo : _o, (.35 + .4 * t.p) * e * n)) : (ho(q("wrim", r.wrim++), t.tx, t.tz, t.r * 1.1, yo, .5 * n), ho(q("wfill", r.wfill++), t.tx, t.tz, t.r * i, t.hit > 0 ? vo : _o, (.26 + .3 * t.p) * n), ho(q("wrim", r.wrim++), t.tx, t.tz, t.r, t.hit > 0 ? vo : _o, (.7 + .3 * t.p) * n));
		}
		qa(e.water);
		for (let e of Object.keys(po)) for (let t = r[e]; t < po[e].length; t++) po[e][t].visible = !1;
		if (So !== oa) {
			So = oa, xo = W.world?.acquireSpellLight?.({ minor: !1 }) ?? null, bo = W.world?.acquireSpellLight?.({ minor: !1 }) ?? null, jo = W.world?.acquireSpellLight?.({ minor: !1 }) ?? null;
			for (let e of Q.values()) Z && Fo(e);
			Q.clear();
		}
		if (xo && e.hero) {
			let t = Math.max(0, Math.min(1, e.carry ?? 0)), n = e.hero[0] + .35, r = e.hero[1] + .35;
			xo.set(n, W.tileMap.getHeight(e.hero[0], e.hero[1]) + 2.4, r, {
				color: [
					1.9,
					1.15,
					.42
				],
				intensity: 4.5 * t / (e.ambient?.lamps ?? 1),
				distance: 6,
				decay: 1.4,
				flicker: .12
			});
		}
		if (bo) {
			let t = e.blast;
			t && t.k > .01 ? bo.set(t.x, W.tileMap.getHeight(t.x, t.z) + 1.6, t.z, {
				color: [
					2,
					.95,
					.32
				],
				intensity: 9 * t.k / (e.ambient?.lamps ?? 1),
				distance: 7,
				decay: 1.6,
				flicker: .25
			}) : bo.off();
		}
		Io(e.spells || [], e.dt || 0, e.ambient?.lamps, !!(e.rings && e.rings.length));
		let i = 0;
		for (let t of e.beasts || []) {
			let e = Ua(t.id);
			if (!e) continue;
			let r = Ya(i++, e);
			r.visible = !0, ya(r, t.x, t.z, e.below, U), r.update(0, n);
		}
		for (let e = i; e < Ja.length; e++) Ja[e]?.visible && (Ja[e].visible = !1);
		wo = e.ambient || null;
		for (let e of ba) e.update(0, n);
		$a(e.light), W.engine.step(Math.max(0, Math.min(.1, e.dt)), { render: e.draw !== !1 });
	},
	sprites(e) {
		W && xa(e, Ha);
	},
	project(e, t, n) {
		if (!W) return null;
		let i = new r(e, t, n).project(W.engine.camera);
		return [(i.x + 1) / 2 * innerWidth, (1 - i.y) / 2 * innerHeight];
	},
	ground(e, t) {
		return W?.tileMap ? W.tileMap.getHeight(e, t) : null;
	},
	get stats() {
		let e = (e) => po[e].filter((e) => e.visible).length;
		return {
			bits: [..._a.entries()].filter(([e]) => e.name === "ember-bit").reduce((e, [, t]) => e + t.filter((e) => e.visible).length, 0),
			water: G.mesh && G.mesh.visible ? G.mesh.count : 0,
			fig: Ma,
			lit: Math.round(Na * 100) / 100,
			beasts: Ja.filter((e) => e?.visible).length,
			light: +!!K.on,
			lightDepth: K.on && K.keyed && W?.postfx?.depthTexture ? 1 : 0,
			rings: e("ring"),
			hazards: e("disc"),
			warns: e("wrim"),
			lanes: e("lane"),
			spells: Q.size,
			dome: Z && Z.domeOf ? 1 : 0,
			blades: Z ? Z.blades.count - (Z.warmN > 0 ? 2 : 0) : 0,
			crystals: Z ? Z.crystals.count - +(Z.warmN > 0) : 0,
			frost: Z ? Z.frost.count - +(Z.warmN > 0) : 0,
			spellLight: jo && Z ? 1 : 0,
			focus: e("focus"),
			carry: +!!xo,
			level: oa,
			actors: [..._a.values()].reduce((e, t) => e + t.filter((e) => e.visible).length, 0),
			atlases: ma.size,
			env: ba.length,
			sky: La,
			ours: ba.filter((e) => e.name.startsWith("ember:prop:")).length,
			programs: W?.engine?.renderer?.info?.programs?.length ?? null
		};
	}
};
function Ro(e) {
	if (ra) throw Error("createWorld: one world a page");
	return ra = e.container, ia = e.uiRoot, Zi = e.assets, ea = _t("en"), Ce(), ta = mt({
		lang: ea,
		px: ht({
			w: innerWidth,
			h: innerHeight,
			dpr: devicePixelRatio || 1
		}).px
	}), na = On(ea, {}), Lo.ready = !0, Lo;
}
//#endregion
export { Ro as createWorld };
