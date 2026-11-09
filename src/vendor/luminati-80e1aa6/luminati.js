import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { $ as t, $n as n, A as r, At as i, Bn as a, Bt as o, Ct as s, Dt as c, Et as l, F as u, Ft as d, G as f, Gn as p, H as m, Hn as h, I as g, It as _, Jn as v, Jt as y, K as b, Kn as x, L as S, Lt as C, M as w, Mt as T, Nn as E, Nt as ee, On as te, Ot as ne, Q as re, Qn as ie, Rn as D, Rt as ae, S as O, T as oe, Tt as se, Vn as ce, Vt as le, Wn as ue, Xn as de, Y as fe, Yn as pe, Z as me, Zn as k, _ as he, _t as ge, a as _e, at as ve, c as ye, ct as be, d as xe, dr as A, et as Se, f as Ce, fr as we, ft as Te, g as j, gt as Ee, h as De, ht as Oe, it as ke, j as Ae, jn as je, jt as Me, kt as Ne, l as Pe, lt as Fe, m as Ie, mt as Le, n as Re, o as ze, ot as Be, p as Ve, pr as He, pt as Ue, q as We, qn as Ge, r as Ke, rt as qe, s as M, st as Je, tr as Ye, tt as Xe, ur as Ze, ut as Qe, v as $e, vt as N, wt as P, yt as et, zt as tt } from "./three.core-D9_Fol79.js";
import { C as nt, E as rt, G as it, O as at, T as ot, U as st, W as ct, b as lt, x as ut } from "./SmallProps-E2A3GsnG.js";
import { a as F, c as dt, f as I, l as ft, n as pt, o as mt, r as ht, s as gt, t as _t, u as vt } from "./math-Du_SWpiD.js";
import { r as yt } from "./ThawField-D3Wx0alo.js";
import { D as bt, E as xt, O as St, _ as Ct, b as wt, c as Tt, d as Et, f as Dt, g as Ot, k as kt, l as At, p as jt, s as Mt, t as Nt, u as Pt, v as Ft, y as It } from "./engine-D4CoK1J3.js";
import { i as Lt, n as Rt } from "./own-rp3p7qEo.js";
import { t as zt } from "./AudioSystem-DPgoFtAp.js";
import { r as Bt } from "./PixelCanvas-eFVXy-5o.js";
import { a as Vt, r as Ht } from "./PropSprites-BqjvniMR.js";
import { a as Ut, c as Wt, i as Gt, o as Kt, s as qt, t as Jt } from "./CharacterSprites-didr5D7N.js";
import { t as Yt } from "./Particles-C_vsKpjw.js";
import { a as Xt, c as Zt, d as Qt, f as $t, i as en, l as tn, o as nn, r as rn, s as an, u as on } from "./TileMap-7jyvA8-B.js";
import { a as sn, i as cn, l as ln, n as un, o as dn, r as fn } from "./Props-B-l_FCch.js";
import { T as pn, a as mn, d as hn, h as gn, n as _n, o as vn, r as yn, s as bn, t as xn, u as Sn, w as Cn, x as wn } from "./ObjectCatalog-CLBSNnc2.js";
import { H as Tn, _t as En } from "./core-C1cYbmwD.js";
import { i as Dn, l as On, n as kn, s as An, t as jn, u as L } from "./I18n-BeKB4FMa.js";
import { f as Mn } from "./minimap-CBFghrAn.js";
import { r as Nn } from "./LevelFormat-BJ0C9Ce4.js";
import { a as Pn, b as Fn, c as In, d as Ln, f as Rn, g as zn, h as Bn, i as Vn, l as Hn, m as Un, n as Wn, o as Gn, p as Kn, r as qn, s as Jn, t as Yn, u as Xn, v as Zn, x as Qn, y as $n } from "./LevelLook-DBb7Ixt0.js";
import { r as er, t as tr } from "./LevelMap-037nvhSa.js";
import { r as nr, t as rr } from "./Travel-4-idrvN5.js";
import { a as ir, c as ar, i as or, n as sr, o as cr, r as lr, s as ur, t as dr } from "./config-DDHWC9jm.js";
import { a as fr, i as pr, o as mr, r as hr, s as gr } from "./SnowCover-BuVYHh-n.js";
import { n as _r, r as vr, t as yr } from "./festival-Biq8Nu-m.js";
import { _ as br, a as xr, c as Sr, d as Cr, f as wr, g as Tr, h as Er, i as Dr, l as Or, m as kr, n as Ar, o as jr, p as Mr, r as Nr, s as Pr, t as Fr, u as Ir } from "./WeatherLook--y1dtFBf.js";
import { a as Lr, i as Rr, n as zr, r as Br } from "./ContentText-nXIHgNO8.js";
import { n as Vr } from "./dialogue-D_zYka2G.js";
import { n as Hr, t as Ur } from "./GroundFrost-CTO23HeV.js";
import { n as Wr, t as Gr } from "./RockSpikes-C4zqD5iB.js";
import { t as Kr } from "./SpectralBlades-CCBrriHz.js";
import { t as qr } from "./SpectralBells-COr0ini7.js";
//#region src/engine/sprite/SpriteManager.js
var Jr = class {
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
}, Yr = class {
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
			if (!i || !Xr(i)) continue;
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
		let t = e.material, n = e.geometry.clone();
		this._alpha = new We(new Float32Array(this.capacity), 1), this._alpha.setUsage(Ae), n.setAttribute("aBlobAlpha", this._alpha);
		let r = new et({
			color: t.color.clone(),
			map: t.map,
			transparent: !0,
			opacity: 1,
			depthWrite: !1,
			polygonOffset: t.polygonOffset,
			polygonOffsetFactor: t.polygonOffsetFactor,
			polygonOffsetUnits: t.polygonOffsetUnits,
			fog: t.fog
		});
		r.name = "luminati:blob-batch", r.onBeforeCompile = (e) => {
			e.vertexShader = e.vertexShader.replace("#include <common>", "#include <common>\nattribute float aBlobAlpha;\nvarying float vBlobAlpha;").replace("#include <begin_vertex>", "#include <begin_vertex>\n	vBlobAlpha = aBlobAlpha;"), e.fragmentShader = e.fragmentShader.replace("#include <common>", "#include <common>\nvarying float vBlobAlpha;").replace("#include <alphamap_fragment>", "#include <alphamap_fragment>\n	diffuseColor.a *= vBlobAlpha;");
		}, r.customProgramCacheKey = () => "luminati-blob-batch";
		let i = new fe(n, r, this.capacity);
		i.name = "BlobBatch", i.instanceMatrix.setUsage(Ae), i.count = 0, i.renderOrder = e.renderOrder, i.castShadow = !1, i.receiveShadow = !1, i.frustumCulled = !1, i.matrixAutoUpdate = !1, this.mesh = i;
	}
};
function Xr(e) {
	for (let t = e; t; t = t.parent) {
		if (!t.visible) return !1;
		if (t.isScene) return !0;
	}
	return !1;
}
//#endregion
//#region src/game/Scenery.js
var Zr = new A(), Qr = [
	"position",
	"aCenter",
	"aSway",
	"aPhase"
];
function* $r(e, { name: t = "trees", castShadow: n = !0, maxTriangles: r = Infinity, maxExtent: i = Infinity, minTriangles: a = 0, tags: o = null } = {}) {
	let s = /* @__PURE__ */ new Map(), c = !!o?.size, l = [];
	for (let t of e) {
		let e = t.object, r = c ? o.get(t) ?? null : null;
		e.updateWorldMatrix(!0, !0);
		let i = dt(Math.round(e.position.x * 7), Math.round(e.position.z * 7), 3) * Math.PI * 2;
		e.traverse((t) => {
			if (!t.isMesh || Array.isArray(t.material)) return;
			let a = t.material, o = n && t.castShadow, c = `${a.uuid}|${+o}|${+t.receiveShadow}`, l = s.get(c);
			l || (l = {
				material: a,
				castShadow: o,
				receiveShadow: t.receiveShadow,
				depth: t.customDepthMaterial,
				geos: [],
				pos: [],
				tags: []
			}, s.set(c, l));
			let u = t.geometry, d = u.clone(), f = t.matrixWorld;
			d.applyMatrix4(f);
			let p = d.getAttribute("aCenter");
			if (p) {
				let e = u.getAttribute("aCenter"), t = u.getAttribute("position"), n = d.getAttribute("position"), r = f.elements, i = Math.hypot(r[0], r[1], r[2]);
				for (let r = 0; r < p.count; r++) Zr.fromBufferAttribute(e, r).applyMatrix4(f), p.setXYZ(r, Zr.x, Zr.y, Zr.z), n.setXYZ(r, Zr.x + (t.getX(r) - e.getX(r)) * i, Zr.y + (t.getY(r) - e.getY(r)) * i, Zr.z + (t.getZ(r) - e.getZ(r)) * i);
			}
			let m = d.getAttribute("aPhase");
			if (m) for (let e = 0; e < m.count; e++) m.setX(e, m.getX(e) + i);
			l.geos.push(d), l.pos.push([e.position.x, e.position.z]), l.tags.push(r);
		}), t.dispose?.(), yield;
	}
	let u = new m();
	u.name = t;
	let d = [];
	for (let e of s.values()) {
		let n = e.geos.map((e, t) => t), o = Number.isFinite(r) || Number.isFinite(i) ? nn(n, {
			x: (t) => e.pos[t][0],
			z: (t) => e.pos[t][1],
			weight: (t) => tn(e.geos[t]),
			maxWeight: r,
			maxExtent: i,
			minWeight: a
		}) : [n];
		c && (o = o.map((t) => Xt(t, (t) => e.tags[t])));
		for (let n = 0; n < o.length; n++) {
			let r = o[n], i = Qt(r.map((t) => e.geos[t]), !1);
			if (!i) continue;
			c && l.push(...Zt(i, r.map((t) => e.geos[t].attributes.position.count), r.map((t) => e.tags[t]), Qr)), i.computeBoundingSphere(), i.computeBoundingBox(), i.boundingSphere.radius += 1.8, i.boundingBox.expandByScalar(1.8);
			let a = new N(i, e.material);
			a.name = `${t}:${e.material.name || "mat"}${o.length > 1 ? `#${n}` : ""}`, a.castShadow = e.castShadow, a.receiveShadow = e.receiveShadow, e.depth && (a.customDepthMaterial = e.depth), a.matrixAutoUpdate = !1, u.add(a), d.push(a), yield;
		}
		for (let t of e.geos) t.dispose();
	}
	return {
		object: u,
		meshes: d,
		ranges: l,
		dispose() {
			for (let e of d) e.geometry.dispose();
			u.removeFromParent();
		}
	};
}
var ei = Object.freeze([
	"oak",
	"pine",
	"birch",
	"autumn",
	"blossom",
	"maple",
	"goldbirch",
	"snowpine",
	"bare"
]), ti = /* @__PURE__ */ new Set(["pine", "snowpine"]);
function ni(e) {
	let t = e?.forest && typeof e.forest == "object" && Array.isArray(e.forest.areas) ? e.forest.areas : [], n = [];
	for (let e of t) {
		if (!e || typeof e != "object" || ![
			"minX",
			"maxX",
			"minZ",
			"maxZ"
		].every((t) => Number.isFinite(e[t]))) continue;
		let t = e.kinds && typeof e.kinds == "object" ? e.kinds : {}, r = ei.map((e) => [e, Number.isFinite(t[e]) && t[e] > 0 ? t[e] : 0]).filter(([, e]) => e > 0), i = r.reduce((e, [, t]) => e + t, 0);
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
function* ri({ tileMap: e, heightAt: t, seed: n = 77, avoid: r = [], southGap: i = 0, kindAreas: a = [], climate: o = null, season: s = null }) {
	if (o === "arid") return yield* ci({
		tileMap: e,
		heightAt: t,
		seed: n,
		avoid: r,
		southGap: i
	});
	let c = s ? nt()?.SEASON_LAND : null, l = c && Object.hasOwn(c.mix, s) ? c.mix[s] : null, u = e.width, d = e.depth, f = new ht(n), p = [], m = [], h = [], g = 1.35, _ = /* @__PURE__ */ new Map(), v = (e, t) => `${Math.floor(e / g)},${Math.floor(t / g)}`, y = (e, t, n) => {
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
		let i = t < 6, o = e > u * .72 && t > 8, s = gt(e * .09, t * .09, {
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
			let s = x(r, a, f.next()), c = (ti.has(s) ? 5.4 : s === "birch" || s === "goldbirch" ? 5.2 : 5) * f.range(.85, 1.25) * (i === 1 ? .8 : 1);
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
	let C = ai(e, ii);
	for (let e = 0; e < 5200; e++) {
		e % 400 == 399 && (yield);
		let r = f.range(-34, u + 34), a = f.range(-44, d + 20.4), o = Math.max(0, -r, r - u), s = Math.max(0, -a, a - d), c = Math.hypot(o, s);
		if (c < .6 || i > 0 && a > d && a < d + i || c < ii && C?.(r, a)) continue;
		let l = gt(r * .075 + 11, a * .075 - 4, {
			seed: n + 2,
			octaves: 3
		}), p = 1 - I(4, 30, c), h = F((l - .42) * 2.6 + p * (a < 0 ? .35 : .75), 0, 1) * (1 - I(24, 34, c) * .85);
		if (f.next() > h) continue;
		let g = f.range(.95, 1.5);
		if (!y(r, a, g)) continue;
		b(r, a, g);
		let _ = x(r, a, f.next()), v = ti.has(_) ? 5.8 : 5.2;
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
var ii = 2.5;
function ai(e, t) {
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
var oi = {
	juniper: 3.4,
	deadwood: 4,
	crag: 3.4
};
function si(e) {
	return e === "basalt" || e === "ash" || e === "scorched" ? "basalt" : e === "red_sand" || e === "redrock" ? "redrock" : "sandstone";
}
function* ci({ tileMap: e, heightAt: t, seed: n, avoid: r, southGap: i }) {
	let a = e.width, o = e.depth, s = new ht(n + 4111), c = [], l = [], u = 1.35, d = /* @__PURE__ */ new Map(), f = (e, t, n) => {
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
		oi[e] * a
	];
	for (let t = 0; t < o; t++) {
		for (let n = 0; n < a; n++) {
			let r = e.tileAt(n, t);
			if (!r || r.char !== "T" || t >= o - 3) continue;
			let i = t >= 9 ? Math.min(n, a - 1 - n) : -1, l = t < 3 ? 1 : 2;
			for (let e = 0; e < l; e++) {
				let e = n + s.range(.1, .9), a = t + s.range(.1, .9), o = s.range(.95, 1.4), l = s.next(), u = s.range(.7, 1.35) * (i === 1 ? .78 : 1);
				i === 2 || l > .72 || !f(e, a, o) || (p(e, a, o), c.push(h(m(t < 6, s.next()), si(r.type.top), e, r.h, a, u)));
			}
		}
		yield;
	}
	let g = ai(e, ii);
	for (let e = 0; e < 5200; e++) {
		e % 400 == 399 && (yield);
		let r = s.range(-34, a + 34), c = s.range(-44, o + 20.4), u = Math.max(0, -r, r - a), d = Math.max(0, -c, c - o), _ = Math.hypot(u, d);
		if (_ < .6 || i > 0 && c > o && c < o + i || _ < ii && g?.(r, c)) continue;
		let v = gt(r * .08 + 31, c * .08 - 9, {
			seed: n + 3,
			octaves: 3
		}), y = 1 - I(4, 30, _), b = F((v - .48) * 2.2 + y * .35, 0, 1) * .42 * (1 - I(22, 34, _) * .85);
		if (s.next() > b) continue;
		let x = s.range(1.1, 1.7), S = t(r, c), C = m(c < 0, s.next()), w = s.range(.85, 1.4);
		if (c < -5 && S > t(r, -1) + 3 && C !== "crag" || !f(r, c, x)) continue;
		p(r, c, x);
		let T = gt(r * .05, c * .05, {
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
function li(e, [t, n, r, i, a]) {
	return t.startsWith("crag:") ? e.crag(n, r, i, {
		kind: "spire",
		stone: t.slice(5),
		height: a,
		width: F(a * .42, 1, 2.2)
	}) : e.tree(n, r, i, {
		kind: t,
		height: a,
		fallenLeaves: !1
	});
}
function ui(e, { climate: t = null, season: n = null } = {}) {
	let r = t === "arid", i = n ? nt()?.SEASON_LAND : null, a = e.width, o = e.depth, s = (t, n) => {
		let r = -Infinity;
		for (let i of [-.5, .5]) for (let s of [-.5, .5]) {
			let c = F(Math.floor(t + i), 0, a - 1), l = F(Math.floor(n + s), 0, o - 1), u = e.tileAt(c, l);
			if (!u) continue;
			let d = u.water ? Math.max(u.h, .5) : u.h;
			d > r && (r = d);
		}
		return Number.isFinite(r) ? r : 0;
	};
	return (t, c) => {
		let l = F(t, 0, a), u = F(c, 0, o), d = t - l, f = c - u, p = Math.hypot(d, f), m = s(l, u) - .04;
		if (p < 1e-6) return m;
		let h = (gt(t * .05, c * .05, {
			seed: 91,
			octaves: 3
		}) - .5) * 3.2, g = I(0, 10, p), _ = m + h * g;
		if (r) return Math.max(_ + fi(t, c, a, o), m - .6 * g);
		let v = I(2, -30, c);
		_ += v * (I(0, 40, -c) * 7 + gt(t * .03, c * .04, {
			seed: 17,
			octaves: 4
		}) * 9 * I(-6, -40, c));
		let y = I(-55, -120, c);
		_ += y * (18 + gt(t * .018, 3.1, {
			seed: 23,
			octaves: 4
		}) * 34);
		let b = I(18, 90, Math.max(-t, t - a, c - o));
		return _ += b * (4 + gt(t * .02, c * .02, {
			seed: 29,
			octaves: 3
		}) * 14), i && (_ += i.relief(n, e, t, c, l, u, p, v, y)), Math.max(_, m - .6 * g);
	};
}
var di = (e, t, n, r = 4) => 1 - Math.abs(gt(e, t, {
	seed: n,
	octaves: r
}) * 2 - 1);
function fi(e, t, n, r) {
	let i = 0, a = I(2, -30, t), o = (I(0, 36, -t) * 9 + di(e * .035, t * .045, 17) * 12 * I(-6, -40, t)) / 3, s = Math.floor(o);
	i += a * (s + I(.6, .95, o - s)) * 3;
	let c = I(-46, -100, t);
	i += c * (24 + di(e * .016, t * .022 + 4.1, 23, 5) * 62);
	let l = I(16, 70, Math.max(-e, e - n, t - r)), u = gt(e * .024, t * .024, {
		seed: 29,
		octaves: 3
	}) * 4, d = Math.floor(u);
	return i += l * (3 + (d + I(.72, .98, u - d)) * 6.5), i;
}
function* pi(e, t, n) {
	let r = e.index, i = e.getAttribute("position"), a = new ye(new Float32Array(i.count * 3), 3);
	e.setAttribute("normal", a);
	let o = new A(), s = new A(), c = new A(), l = new A(), u = new A(), d = new A(), f = new A(), p = new A(), m = 0;
	for (let e = 0, n = r.count; e < n; e += 3) {
		let n = r.getX(e), h = r.getX(e + 1), g = r.getX(e + 2);
		o.fromBufferAttribute(i, n), s.fromBufferAttribute(i, h), c.fromBufferAttribute(i, g), f.subVectors(c, s), p.subVectors(o, s), f.cross(p), l.fromBufferAttribute(a, n), u.fromBufferAttribute(a, h), d.fromBufferAttribute(a, g), l.add(f), u.add(f), d.add(f), a.setXYZ(n, l.x, l.y, l.z), a.setXYZ(h, u.x, u.y, u.z), a.setXYZ(g, d.x, d.y, d.z), ++m === t && (m = 0, yield);
	}
	yield;
	for (let e = 0, t = a.count; e < t; e++) Zr.fromBufferAttribute(a, e).normalize(), a.setXYZ(e, Zr.x, Zr.y, Zr.z), e % n === n - 1 && (yield);
	a.needsUpdate = !0;
}
function* mi({ textures: e, tileMap: t, heightAt: n, extent: r = 170, rowsPerStep: i = 12, climate: a = null, season: o = null }) {
	let s = a === "arid", c = !s && o ? nt()?.SEASON_LAND : null, l = c && Object.hasOwn(c.outer, o) ? c.outer[o] : null, u = t.width, d = t.depth, f = (e, t) => {
		let n = /* @__PURE__ */ new Set();
		for (let t = e - r; t < e - 40; t += 10) n.add(t);
		for (let t = e - 40; t < e - 16; t += 2) n.add(t);
		for (let r = e - 16; r <= t + 16; r += 1) n.add(r);
		for (let e = t + 16; e <= t + 40; e += 2) n.add(e);
		for (let e = t + 40; e <= t + r; e += 10) n.add(e);
		return [...n].sort((e, t) => e - t);
	}, p = f(0, u), m = f(0, d), h = p.length, g = m.length, _ = new Float32Array(h * g * 3), v = new Float32Array(h * g * 2), y = new Float32Array(h * g * 3), b = new Float32Array(h * g);
	for (let e = 0; e < g; e++) {
		for (let t = 0; t < h; t++) {
			let r = p[t], i = m[e];
			b[e * h + t] = n(r, i);
		}
		e % i === i - 1 && (yield);
	}
	let x = l ? l[0] : s ? "arid_dirt" : "grass_dark", S = e.meta(x).units, C = new j(), w = new j(1, 1, 1), T = l ? new j(...l[1]) : s ? new j(1.04, .96, .88) : new j(.78, .86, .72), E = l ? new j(...l[2]) : s ? new j(1.02, .74, .6) : new j(.62, .6, .66), ee = new j(.92, .86, .84);
	for (let e = 0; e < g; e++) {
		for (let t = 0; t < h; t++) {
			let n = e * h + t, r = p[t], i = m[e], a = b[n];
			_[n * 3] = r, _[n * 3 + 1] = a, _[n * 3 + 2] = i, v[n * 2] = r / S[0], v[n * 2 + 1] = -i / S[1];
			let o = b[e * h + Math.max(0, t - 1)], c = b[e * h + Math.min(h - 1, t + 1)], f = b[Math.max(0, e - 1) * h + t], x = b[Math.min(g - 1, e + 1) * h + t], te = (c - o) / Math.max(.001, p[Math.min(h - 1, t + 1)] - p[Math.max(0, t - 1)]), ne = (x - f) / Math.max(.001, m[Math.min(g - 1, e + 1)] - m[Math.max(0, e - 1)]), re = Math.hypot(te, ne), ie = Math.max(0, -r, r - u), D = Math.max(0, -i, i - d), ae = Math.hypot(ie, D);
			C.copy(w).lerp(T, I(20, 80, ae)).lerp(E, I(.55, 1.2, re)), s && C.lerp(ee, I(26, 60, a));
			let O = vt(l ? l[3] : s ? .8 : .62, 1, I(0, 14, ae)) * (.9 + .2 * gt(r * .11, i * .11, {
				seed: 4,
				octaves: 2
			}));
			y[n * 3] = C.r * O, y[n * 3 + 1] = C.g * O, y[n * 3 + 2] = C.b * O;
		}
		e % i === i - 1 && (yield);
	}
	let te = (e, t) => e > 0 && e < t, ne = 0;
	for (let e = 0; e < h - 1; e++) te((p[e] + p[e + 1]) / 2, u) && ne++;
	let re = 0;
	for (let e = 0; e < g - 1; e++) te((m[e] + m[e + 1]) / 2, d) && re++;
	let ie = (h - 1) * (g - 1) - ne * re, D = h * g - 1 >= 65535 ? new Uint32Array(ie * 6) : new Uint16Array(ie * 6), ae = 0;
	for (let e = 0; e < g - 1; e++) {
		let t = te((m[e] + m[e + 1]) / 2, d);
		for (let n = 0; n < h - 1; n++) {
			if (t && te((p[n] + p[n + 1]) / 2, u)) continue;
			let r = e * h + n, i = r + 1, a = r + h, o = a + 1;
			D[ae++] = r, D[ae++] = a, D[ae++] = i, D[ae++] = i, D[ae++] = a, D[ae++] = o;
		}
		e % i === i - 1 && (yield);
	}
	let O = new Pe();
	O.setAttribute("position", new ye(_, 3)), O.setAttribute("uv", new ye(v, 2)), O.setAttribute("color", new ye(y, 3)), O.setIndex(new ye(D, 1)), yield, yield* pi(O, i * (h - 1) * 2, i * h), O.computeBoundingSphere();
	let oe = e.material(x, {
		vertexColors: !0,
		normalScale: .35
	}), se = new N(O, oe);
	return se.name = "OuterGround", se.receiveShadow = !0, se.castShadow = !1, se.matrixAutoUpdate = !1, se.updateMatrix(), se;
}
//#endregion
//#region src/game/Climate.js
var hi = Object.freeze([
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
function gi(e) {
	return Gn(e) === "arid" ? {
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
var _i = /* @__PURE__ */ new WeakMap(), vi = /* @__PURE__ */ new WeakMap(), yi = null, bi = null;
function xi() {
	return bi ??= import("./SeasonLook-Bahdf8bb.js").then((e) => yi = e, (e) => {
		throw bi = null, e;
	});
}
function Si() {
	return yi ? null : bi;
}
function Ci(e, t, n = null) {
	let r = t ?? (n && yi ? n : null);
	if ((vi.get(e) ?? null) === r) return !1;
	_i.has(e) || _i.set(e, e.keyframes);
	let i = _i.get(e);
	return e.setKeyframes(r === "arid" ? hi.map((e) => ({ ...e })) : r ? yi.seasonKeyframes(i, r) : i), vi.set(e, r), !0;
}
function wi(e, t) {
	let n = Kn(t);
	if (Ci(e.lighting, Gn(t), n), e.season = null, e.lighting.sky.uniforms.uAurora.value = 0, Mn(null), !n && !(Vn(t) > 0)) return;
	let r = () => {
		e.env === t && (Ci(e.lighting, Gn(t), n), e.season = yi.createSeason(e));
	};
	yi ? r() : xi().then(r, (e) => console.warn("[Luminati] the season look did not load:", e));
}
//#endregion
//#region src/game/AudioDirector.js
var Ti = {
	blaze: [1, 1],
	bonfire: [.85, 1],
	brazier: [0, .6],
	embers: [0, .35]
}, Ei = .45;
function Di(e, t = null) {
	let n = e.opts && typeof e.opts == "object" ? e.opts : {}, r = Number(e.x), i = Number(e.z);
	if (!Number.isFinite(r) || !Number.isFinite(i)) return null;
	if (e.type === "fire") {
		let [e, a] = Lt(Ti, typeof n.kind == "string" ? n.kind : "blaze") ?? Ti.blaze, o = F(Number.isFinite(Number(n.size)) ? Number(n.size) : 1.5, .2, 6);
		return {
			x: r,
			z: i,
			roar: e * F(o / 1.5, .3, 3),
			crackle: a,
			group: t
		};
	}
	if (e.type === "house") {
		let e = F(Number(n.burning) || 0, 0, 1);
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
var Oi = class e {
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
		let n = this.lighting.nightFactor, r = this.weather.factor("rain"), i = this.weather.factor("snow"), a = F(r + i), o = e.nearest(this.fires, t), s = Infinity, c = this.waterXZ, l = t.x, u = t.z;
		for (let e = 0; e < c.length; e += 2) {
			let t = c[e] - l, n = c[e + 1] - u, r = t * t + n * n;
			r < s && (s = r);
		}
		s = Math.sqrt(s);
		let d = e.nearest(this.falls, t), f = this.levels;
		f.wind = F(.28 + .12 * (t.y > 3) + a * .55), f.birds = F((1 - n) * (1 - a * .85) * .75), this.combatIntensity > 0 && (f.birds *= 1 - .8 * F(this.combatIntensity)), f.crickets = F(I(.35, .9, n) * (1 - a) * .8), f.fire = F((1 - I(2, 15, o)) ** 1.5 * .9), f.water = F(Math.max((1 - I(1, 11, s)) * .55, (1 - I(3, 20, d)) * .95)), this._computeSiege(this.focus ?? t);
		let p = this.env?.();
		return (p?.frost || p?.season) && this.audio.evPack?.direct(this, t, f), f;
	}
	_computeSiege(e) {
		let t = this.levels, n = 0;
		for (let t of this.npcs) {
			let r = t.panicking ? 1 : t.cowering ? Ei : 0;
			if (!r) continue;
			let i = Math.hypot(t.position.x - e.x, t.position.z - e.z);
			n += r * (1 - I(4, 34, i));
		}
		t.crowd = n > 0 ? F(1 - Math.exp(-n / 3.4)) : 0;
		let r = 0, i = 0;
		for (let t of this.blazes) {
			if (t.group && !t.group.present) continue;
			let n = Math.hypot(t.x - e.x, t.z - e.z);
			t.roar > 0 && (r += t.roar * (1 - I(3, 30, n)) ** 1.6), t.crackle > 0 && (i = Math.max(i, t.crackle * (1 - I(1.5, 12, n)) ** 1.5));
		}
		t.blaze = r > 0 ? F(1 - Math.exp(-r * .9)) * .95 : 0, i * .9 > t.fire && (t.fire = i * .9);
	}
	update(e, t) {
		this.enabled && (this._timer -= e, !(this._timer > 0) && (this._timer = .25, this.audio.setAmbience(this.compute(t), { fade: .6 })));
	}
};
//#endregion
//#region src/game/GroundDetail.js
function ki(e) {
	let t = e.map(({ kind: e, seed: t }) => Ht(e, { seed: t })), n = Math.max(...t.map((e) => e.frameWidth)) + 2, r = Math.max(...t.map((e) => e.frameHeight)) + 1, i = document.createElement("canvas");
	i.width = n * t.length, i.height = r;
	let a = i.getContext("2d");
	return a.imageSmoothingEnabled = !1, t.forEach((e, t) => {
		let i = t * n + Math.floor((n - e.frameWidth) / 2), o = r - e.frameHeight;
		a.drawImage(e.canvas, 0, 0, e.frameWidth, e.frameHeight, i, o, e.frameWidth, e.frameHeight), e.dispose();
	}), {
		texture: Bt(i, {
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
var Ai = /* @__PURE__ */ new Set([
	"g",
	"G",
	"f"
]), ji = [
	1,
	2,
	3,
	1,
	2
], Mi = {
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
}, Ni = /* @__PURE__ */ new Set([
	"basalt",
	"ash",
	"scorched"
]), Pi = {
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
}, Fi = [
	"#ffffff",
	"#ffffff",
	"#f4e6c8",
	"#e4ecc0"
];
function* Ii({ tileMap: e, isFree: t, seed: n = 2024, houses: r = [], trees: i = [], clearings: a = [], flowerAreas: o = [], shrubAreas: s = [], cropAreas: c = [], maxInstances: l = Infinity }) {
	let u = new ht(n), d = new m();
	d.name = "GroundDetail";
	let f = [], p = [], h = [], g = [], _ = (e, t) => {
		for (let n = 0; n < a.length; n++) {
			let r = a[n];
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
		rng: new ht(n + 4099),
		tints: Fi,
		reed: .6
	}, x = nt()?.SEASON_LAND ?? null, S = new ht(n + 7351), C = {}, w = (e, r, i, a, o) => {
		let s = o.rng, c = i.h, l = i.char === "T", u = gt(e * .21 + 7, r * .21, {
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
				frame: o === b && Ni.has(i.type.top) ? 2 : 0
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
		let a = i.char, c = i.h, l = i.type.top;
		if (l && Object.hasOwn(Mi, l)) {
			w(e, r, i, a === "T" ? Pi : Mi[l], b);
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
		let d = a === "T";
		if (Ai.has(a) || d) {
			let i = gt(e * .23, r * .23, {
				seed: n + 1,
				octaves: 3
			}), l = d ? 2 : 3 + (i > .55 ? 2 : 0);
			for (let n = 0; n < l; n++) {
				let n = e + u.next(), a = r + u.next();
				if (!d && !t(n, a)) continue;
				let o = i > .58 && u.chance(.45), s = u.range(.7, 1.05), l = u.chance(.25) ? "#e2f2a8" : d ? "#b8c8a0" : "#ffffff", p = !d && _(n, a);
				f.push({
					x: n,
					y: c,
					z: a,
					scale: p ? s * .75 : s,
					frame: o && !p ? 1 : 0,
					tint: l
				});
			}
			let m = d ? 0 : a === "f" ? 3 : i > .6 ? 1 : +!!u.chance(.25), h = v(o, e, r)?.palette ?? ji;
			for (let n = 0; n < m; n++) {
				let n = e + u.next(), i = r + u.next();
				if (!t(n, i)) continue;
				let a = u.range(.75, 1), o = h[u.int(0, h.length - 1)];
				_(n, i) || p.push({
					x: n,
					y: c,
					z: i,
					scale: a,
					frame: o
				});
			}
			let y = d ? .55 : v(s, e, r)?.chance ?? .05;
			if (u.chance(y)) {
				let n = e + u.range(.15, .85), i = r + u.range(.15, .85);
				if (d || t(n, i)) {
					let e = u.next(), t = e < .45 ? 0 : e < .85 ? 1 : 2, r = u.range(.8, 1.2);
					(d || !_(n, i)) && g.push({
						x: n,
						y: c,
						z: i,
						scale: r,
						frame: t
					});
				}
			}
			if (!d && u.chance(.035)) {
				let n = e + u.next(), i = r + u.next();
				t(n, i) && g.push({
					x: n,
					y: c,
					z: i,
					scale: u.range(.8, 1.1),
					frame: 3
				});
			}
		} else if (a === "s") {
			let n = y(e, r, (e) => e.water), i = n ? 2 : 1;
			for (let a = 0; a < i; a++) {
				let i = e + u.next(), a = r + u.next();
				t(i, a) && (n && u.chance(.7) ? h.push({
					x: i,
					y: c,
					z: a,
					scale: u.range(.75, 1.1)
				}) : g.push({
					x: i,
					y: c,
					z: a,
					scale: u.range(.7, 1),
					frame: 3
				}));
			}
		} else if (a === "F") u.chance(.3) && f.push({
			x: e + u.next(),
			y: c,
			z: r + u.next(),
			scale: u.range(.55, .75),
			frame: 0,
			tint: "#d8e4a0"
		});
		else if (a === "d" || a === ".") {
			if (u.chance(.12)) {
				let n = e + u.next(), i = r + u.next();
				t(n, i) && f.push({
					x: n,
					y: c,
					z: i,
					scale: u.range(.5, .7),
					frame: 0,
					tint: "#d8e0a0"
				});
			}
		} else a === "m" && u.chance(.35) && g.push({
			x: e + u.next(),
			y: c,
			z: r + u.next(),
			scale: u.range(.7, 1),
			frame: u.chance(.5) ? 1 : 3
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
		return r && Ai.has(r.char) && !Object.hasOwn(Mi, r.type.top) && !(x && Object.hasOwn(x.growth, r.type.top)) ? r : null;
	}, ee = (e, n, r, i) => {
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
				if (!u.chance(.62)) continue;
				let l = (t + u.range(.2, .8)) / c, d = u.range(.28, .55), f = n + (i - n) * l + o * d, p = r + (a - r) * l + s * d;
				e.door && Math.hypot(f - e.door.x, p - e.door.z) < 1.25 || ee(f, p, u.next() < .62 ? 0 : 1, u.range(.75, 1.1));
			}
		}
	}
	for (let e of i) {
		let t = u.int(1, 3);
		for (let n = 0; n < t; n++) {
			let t = u.range(0, Math.PI * 2), n = (e.r ?? .3) + u.range(.35, .8);
			ee(e.x + Math.cos(t) * n, e.z + Math.sin(t) * n, +!!u.chance(.6), u.range(.7, 1.05));
		}
	}
	let te = [], ne = function* (e, t, r, i = {}) {
		if (!r.length) return [];
		let a = r.length > l ? yield* an(r, {
			x: (e) => e.x,
			z: (e) => e.z,
			maxWeight: l
		}) : [r], o = a.map((t, n) => [a.length > 1 ? `${e}#${n}` : e, t]), s = [];
		for (let [e, r] of o) {
			let a = new Ft({
				sprite: t,
				instances: globalThis.__emberGround ? globalThis.__emberGround.foliage(r) : r,
				name: e,
				seed: n + te.length,
				...i
			});
			d.add(a.object), te.push(a), s.push(a), yield;
		}
		return s;
	}, re = ki([{ kind: "grass_tuft" }, { kind: "grass_tall" }]), ie = ki([
		{ kind: "flower_red" },
		{ kind: "flower_yellow" },
		{ kind: "flower_white" },
		{ kind: "flower_blue" }
	]), D = ki([
		{ kind: "bush" },
		{ kind: "fern" },
		{ kind: "mushroom" },
		{ kind: "rock_small" }
	]), ae = Ht("reeds");
	yield, yield* ne("Foliage:grass", re, f, { wind: 1 }), yield* ne("Foliage:flowers", ie, p, { wind: 1.1 }), yield* ne("Foliage:reeds", ae, h, { wind: 1.4 });
	let O = yield* ne("Foliage:shrubs", D, g, {
		wind: .5,
		rootDarken: .25
	});
	for (let e of O) e.castShadow = !0;
	let oe = [], se = (e) => {
		let t = ki(e);
		return oe.push(t.texture), t;
	};
	if (b.grass.length && (yield* ne("Foliage:arid-grass", se([{ kind: "dry_tuft" }, { kind: "dry_grass_tall" }]), b.grass, { wind: 1 })), b.shrubs.length) {
		let e = yield* ne("Foliage:arid-shrubs", se([
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
	b.clutter.length && (yield* ne("Foliage:arid-clutter", se([
		{ kind: "pebbles" },
		{ kind: "bones" },
		{ kind: "cinders" }
	]), b.clutter, {
		wind: 0,
		rootDarken: .1
	})), b.reeds.length && (yield* ne("Foliage:arid-reeds", ae, b.reeds, { wind: 1.4 }));
	let ce = x ? yield* x.fields({
		fams: C,
		cropAreas: c,
		tileMap: e,
		isFree: t,
		inClearing: _,
		seed: n,
		add: ne,
		kinds: (e) => se(e.map((e) => ({ kind: e }))),
		reedSprite: ae
	}) : {}, le = b.grass.length + b.shrubs.length + b.clutter.length ? {
		aridGrass: b.grass.length,
		aridShrubs: b.shrubs.length,
		aridClutter: b.clutter.length
	} : {};
	return {
		fields: te,
		object: d,
		stats: {
			grass: f.length,
			flowers: p.length,
			reeds: h.length + b.reeds.length,
			shrubs: g.length,
			...le,
			...ce
		},
		dispose() {
			for (let e of te) e.dispose();
			re.texture.dispose(), ie.texture.dispose(), D.texture.dispose(), ae.dispose();
			for (let e of oe) e.dispose();
		}
	};
}
var Li = () => new Promise((e) => setTimeout(e, 0)), Ri = /[^A-Za-z0-9_:.\-]+/;
function zi(e) {
	let t = In(e)?.until ?? "";
	return new Set(t.split(Ri).filter((e) => e && !/^(and|or|not)$/i.test(e)));
}
var Bi = /* @__PURE__ */ new Set(["tree", "waterfall"]), Vi = Object.freeze({
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
	foliageInstances: Yn,
	shadowUp: 60,
	shadowDown: 45,
	particleCull: 34
}), Hi = class e {
	constructor({ engine: e, textures: t, lighting: n, particles: r, godRays: i, level: a, lightPool: o = null, story: s = null, defer: c = !1 }) {
		this.engine = e, this.scene = e.scene, this.textures = t, this.lighting = n, this.particles = r, this.godRays = i, this.level = a, this._sharedPool = o, this.vfxLights = null, this.story = s, this.storyGroups = /* @__PURE__ */ new Map(), this._emitterGroup = /* @__PURE__ */ new Map(), this._storyTags = /* @__PURE__ */ new Map(), this.storyRanges = new rn(), this.env = a.environment ?? {}, this._pending = c ? [] : null, this.attached = !c, this.shafts = [], this._ownInteractables = 0, this.root = new m(), this.root.name = "World", this._defer(() => this.scene.add(this.root)), this.tileMap = null, this.water = null, this.terrain = null, this.builder = null, this.factory = null, this.built = [], this.results = [], this.updaters = [], this.waterfalls = [], this.interactables = [], this.emitters = Object.create(null), this.areaEmitters = [], this.propEmitters = [], this.lights = [], this.emissiveEntries = [], this.glassMaterial = null, this.fires = [], this._fireList = [], this.blazes = [], this._bells = [], this._warmth = [], this.falls = [], this.fallAnchors = [], this.anchors = {}, this.stats = {}, this.waterBase = null;
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
			t && ("wait" in t ? await t.wait : (e(t.at, t.label), await Li()));
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
			if (!t) return on(e);
			let r = e.next();
			for (; !r.done;) o(n), yield, a = performance.now(), r = e.next();
			return r.value;
		}, l = this.level;
		this.batching = e.isBigLevel(l) ? { ...Vi } : null;
		let u = this.batching;
		if (!at() && ot(l) && (yield { wait: rt() }), !nt() && lt(l) && (yield { wait: ut() }), yield* s(.08, L("game.load.textures")), this.textures.preload(), o("textures"), yield* s(.18, L("game.load.land")), this.terrain = yield* c(Fn(l, {
			textures: this.textures,
			chunkSize: u ? u.terrainChunk : 64,
			deferShore: !0
		}), "terrain"), this.tileMap = this.terrain.tileMap, u) {
			let e = this.tileMap.object.children.filter(fn);
			this.terrainCasters = yield* c(dn(e.map((e) => ({
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
		this.water = this.terrain.water, this.root.add(this.terrain.object), o("terrain"), yield* s(.3, L("game.load.village")), this.builder = new $n({
			textures: this.textures,
			seed: 42
		}), this.factory = this.builder.factory, this.glassMaterial = this.factory.glassMaterial();
		for (let e of this._buildProps(t ? 0 : 12)) o("props"), t ? (yield, a = performance.now()) : yield* s(.3 + .14 * e, L("game.load.village"));
		o("props"), yield* s(.45, L("game.load.forest"));
		let d = yield* c(this._levelTreeSteps(), "trees"), f = (u || t) && this.water ? this.water.refreshAsync() : null;
		yield* c(this._treeSteps(d, { paced: t }), "trees"), o("trees"), yield* s(.58, L("game.load.water")), this._buildWaterfalls(), f || this.water?.refresh(), o("water"), yield* s(.68, L("game.load.meadow")), yield* c(this._groundDetailSteps(), "foliage"), o("foliage"), yield* s(.8, L("game.load.lights")), this._defer(() => {
			this._wireLights(), this._buildAtmosphere();
		}), o("lights"), yield* s(.88, L("game.load.merge")), this.merged = yield* c(this._mergeSteps(), "merge"), o("merge"), f && (yield { wait: f }, t && (a = performance.now()), this.water._waterColliderSignature() !== this.water._colliderSig && this.water.refresh(), o("shoreWait")), this.tileMap.object.traverse((e) => {
			e.isMesh && pr(e.material, "ground");
		}), this.outerGround && pr(this.outerGround.material, "ground");
		for (let e of this.groundDetail.fields) pr(e.material, "foliage");
		if (this.merged.object.traverse((e) => {
			e.isMesh && hr.test(e.material?.name ?? "") && pr(e.material, "ground");
		}), this.env.frost && (gr() || (yield { wait: fr() }), gr().prepareWorld(this)), o("snow"), u) {
			let e = [
				...this.tileMap.object.children.filter((e) => e.isMesh),
				...this.merged.meshes,
				...this.treeGroups.flatMap((e) => e.meshes)
			], t = this.groundDetail.fields;
			yield* c(function* () {
				for (let t of e) en(t), yield;
				for (let e of t) en(e.object, { pad: .8 }), yield;
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
		return on(this._mergeSteps());
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
		let n = (at() ?? nt())?.mergeFlames;
		return this.flames = n ? n(this.factory, this.results, { name: "village:flames" }) : null, this.flames && this.root.add(this.flames.object), t;
	}
	_storyGroupOf(e) {
		if (!this.story || !nr(e) || !rr.has(e.type) || !$n.isBuildable(e.type) && e.type !== "emitter") return null;
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
		let t = this._frostNames ??= zi(this.env);
		if (!t.size) return "";
		let n = e;
		if (![n.when, n.unless].some((e) => e && String(e).split(Ri).some((e) => t.has(e)))) return "";
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
		if (this.built.push(r), t && this.root.add(r.object), i && (r.propResult && this._storyTags.set(r.propResult, i), t && (i.objects.push(r.object), r.object.visible = i.present), tr.has(e.type) && (i.mapped = !0), i.colliders.push(...r.colliders), i.walkRects.push(...r.walkRects), i.lights.push(...r.lights)), n && r.propResult && this.results.push(r.propResult), !i || i.present) {
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
			...qn
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
		let t = pn(e.text);
		return {
			lines: t.map((e) => e.text),
			keys: t.map((t) => wn(e, "text", t.i))
		};
	}
	*_buildProps(t = 12) {
		this._lightDescs = [], this.houseFootprints = [];
		let n = this.level.objects, r = performance.now();
		for (let i = 0; i < n.length; i++) {
			let a = n[i];
			if (performance.now() - r > t && (yield i / n.length, r = performance.now()), !$n.isBuildable(a.type) || Bi.has(a.type)) continue;
			let o = this._build(a);
			if (!o) continue;
			let s = this._storyGroupOf(a), c = Di(a, s);
			c && this.blazes.push(c);
			let l = o.propResult?.bell;
			l && this._bells.push({
				id: a.id,
				bell: l,
				group: s
			});
			let u = o.propResult?.warmth;
			u && this._warmth.push({
				zone: u,
				group: s
			});
			let d = this.interactables.length;
			this._defer(() => {
				for (let e of o.emitters) this._groupEmitter(this._createEmitter(e), s);
			});
			let f = e.textPagesOf(a), p = f.lines;
			switch (a.type) {
				case "house": {
					let e = o.interact?.position?.clone() ?? null, t = un(o.colliders);
					t && this.houseFootprints.push({
						...t,
						door: e
					}), e && p.length && this._interact(`door:${a.id}`, e, {
						radius: 1,
						label: "Knock",
						kind: "door",
						lookSpan: o.interact.lookSpan,
						text: {
							speaker: "",
							...f
						}
					});
					break;
				}
				case "signpost":
					if (p.length) {
						let e = a.speaker, t = e == null ? {
							speaker: "Signpost",
							speakerDefault: "signpost"
						} : { speaker: typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" ? String(e) : "" };
						this._interact(a.id, o.anchor, {
							radius: 1.35,
							label: "Read",
							kind: "sign",
							text: {
								...t,
								...f
							}
						});
					}
					break;
				case "well": {
					if (!p.length) break;
					let e = o.anchor.y, t = o.interact?.position ?? new A(a.x, e, a.z), n = new A(a.x, e + 4.2, a.z - .3);
					this._interact(a.id, t, {
						radius: 1.75,
						label: "Look",
						kind: "well",
						prompt: n,
						text: {
							speaker: "",
							...f,
							sfx: a.sfx ?? "splash"
						}
					});
					break;
				}
				case "hearth": if (a.opts?.lit === !1) break;
				case "campfire": {
					let e = o.anchor.clone();
					this._fireList.push({
						position: e,
						group: s
					}), s && s.fires.push(e), (!s || s.present) && this.fires.push(e), a.type === "campfire" && (this.anchors.campfire ??= e);
					break;
				}
				case "chest":
				case "waystone": {
					let e = a.type === "chest", t = o.anchor.y;
					this._interact(a.id, o.interact?.position ?? o.anchor, {
						kind: a.type,
						label: "Examine",
						radius: e ? 1.2 : 1.5,
						prompt: new A(a.x, t + (e ? 1.2 : 2.4), a.z),
						text: e ? {
							speaker: "",
							lines: ["The chest is locked tight."],
							linesDefault: "chest"
						} : {
							...a.name ? { speaker: String(a.name) } : {
								speaker: "Waystone",
								speakerDefault: "waystone"
							},
							lines: ["An old waystone hums quietly."],
							linesDefault: "waystoneText"
						},
						object: a,
						prop: o.propResult?.controls ?? null
					});
					break;
				}
			}
			if (s) for (let e = d; e < this.interactables.length; e++) s.interactables.push(this.interactables[e]), s.present || (this.interactables[e].disabled = !0);
		}
	}
	_buildLevelTrees() {
		return on(this._levelTreeSteps());
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
		on(this._treeSteps(e));
	}
	*_treeSteps(e, { paced: t = !1 } = {}) {
		let n = this.factory, r = this.tileMap, i = this.env, a = this.objectsOf("tree");
		this.stats.trees = {
			village: e.length,
			border: 0,
			outer: 0
		};
		let o = Jn(i), s = Rn(i), c = [], l = [], u = Gn(i), d = Kn(i);
		if (o || s) {
			this.outerHeight = ui(r, {
				climate: u,
				season: d
			});
			let e = a.map((e) => ({
				x: e.x,
				z: e.z,
				r: this.inMap(e.x, e.z) ? 1.2 : 1.8
			})), t = zn(i);
			({border: c, outer: l} = yield* ri({
				tileMap: r,
				heightAt: this.outerHeight,
				avoid: e,
				southGap: t,
				kindAreas: ni(i),
				climate: u,
				season: d
			})), o || (c = []), s || (l = []);
		}
		let f = [];
		for (let e of c) f.push(li(n, e)), yield;
		let p = [];
		for (let e of l) p.push(li(n, e)), yield;
		let m = this._splitOpts("tree"), h = yield* $r([...e, ...f], {
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
			let n = yield* $r(t, {
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
			let e = yield* mi({
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
			let n = this._storyGroupOf(e), r = e.width ?? 2, i = Zn(e);
			this._defer(() => {
				for (let e of t.emitters) this._groupEmitter(this._createEmitter({
					...e,
					count: i.count,
					alpha: i.alpha
				}), n);
			});
			let a = ln(e.facing), o = t.anchor.y, s = {
				id: e.id,
				x: e.x,
				z: e.z,
				width: r,
				dir: a,
				anchor: new A(e.x + a[0] * .6, o, e.z + a[1] * .6),
				splash: e.splash !== !1
			};
			n && (Object.defineProperty(s, "hidden", {
				get: () => !n.present,
				enumerable: !0
			}), n.falls.push(s)), this.falls.push(s), s.splash && (!n || n.present) && this.fallAnchors.push(s.anchor), s.splash && (this.anchors.waterfall ??= s.anchor);
		}
	}
	_buildGroundDetail() {
		on(this._groundDetailSteps());
	}
	*_groundDetailSteps() {
		let e = yield* Ii({
			tileMap: this.tileMap,
			isFree: (e, t) => this._isFreeForFoliage(e, t),
			houses: this.houseFootprints,
			...Xn(this.level),
			maxInstances: this.batching?.foliageInstances ?? Infinity
		});
		this.groundDetail = e, this.root.add(e.object), this.stats.foliage = e.stats;
	}
	acquireSpellLight({ minor: e = !1 } = {}) {
		return this.vfxLights?.acquire({ minor: e }) ?? null;
	}
	_wireLights() {
		let e = this.storyGroups.size ? /* @__PURE__ */ new Map() : null, t = Et(this._lightDescs, { cache: e });
		this._sharedPool && this._sharedPool.setDescriptors(t, { snap: !0 }), this.lightPool = this._sharedPool ?? new Pt(this.lighting, t, { size: 12 });
		for (let t of this.storyGroups.values()) {
			t.poolLights = t.lights.map((t) => e.get(t)).filter(Boolean);
			for (let e of t.poolLights) this.lightPool.setHidden(e, !t.present, { instant: !0 });
		}
		this.lights = this.lightPool.handles, this.stats.lightDescriptors = this._lightDescs.length, this.stats.lightsPooled = this.lightPool.pooled;
	}
	_buildAtmosphere() {
		let e = this.particles, t = this.env, n = (e, t, n) => new A(e, t, n), r = this.level.width, i = this.level.depth;
		t.dust !== !1 && globalThis.__emberGround?.dust !== !1 && (this.emitters.dust = e.createEmitter({
			preset: "dust",
			bounds: {
				center: n(r / 2, 2.5, i / 2),
				size: n(Wn.x, Wn.y, Wn.z)
			},
			count: 120,
			...gi(t)
		}));
		let a = (e, t, n, r) => Math.min(r, Math.max(n, Number.isFinite(Number(e)) && e !== null && e !== "" ? Number(e) : t));
		for (let t of this.objectsOf("emitter")) {
			if (globalThis.__emberGround && !globalThis.__emberGround.keeps(t)) continue;
			let r = Array.isArray(t.size) ? t.size : [], i = this.groundAt(t.x, t.z) + a(t.dy, 1.2, -5, 30), o = t.params && typeof t.params == "object" && !Array.isArray(t.params) ? t.params : {}, s;
			try {
				s = e.createEmitter({
					...o,
					preset: t.preset,
					bounds: {
						center: n(t.x, i, t.z),
						size: n(a(r[0], 8, .1, 200), a(r[1], 2.4, .1, 60), a(r[2], 8, .1, 200))
					},
					count: Math.round(a(t.count, 30, 1, 1e3))
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
		for (let e of Hn(t, this.level, this.tileMap)) this.shafts.push(...this.godRays.populate(e.bounds, e.count, e.seed));
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
}, Ui = 3.2, Wi = 5.6, Gi = .3, Ki = .55, qi = {
	down: new A(0, 0, 1),
	up: new A(0, 0, -1),
	left: new A(-1, 0, 0),
	right: new A(1, 0, 0)
};
function Ji(e) {
	let t = new et({
		map: e,
		color: new j("#d9ccff"),
		transparent: !0,
		opacity: Ki,
		depthWrite: !0,
		depthFunc: 6,
		fog: !1
	});
	return t.onBeforeCompile = (e) => {
		e.vertexShader = e.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n	mvPosition.xyz *= max( 0.0, 1.0 - 1.3 / length( mvPosition.xyz ) );\n	gl_Position = projectionMatrix * mvPosition;"), e.fragmentShader = e.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n	if ( sampledDiffuseColor.a < 0.5 ) discard;\n	float silL = sqrt( dot( sampledDiffuseColor.rgb, vec3( 0.299, 0.587, 0.114 ) ) );\n	diffuseColor = vec4( diffuse * ( 0.42 + 0.8 * silL ), opacity );");
	}, t.customProgramCacheKey = () => "emberfall-player-silhouette-v2", t;
}
function Yi(e, t, n) {
	let r = new N(e, t);
	return r.name = n, r.renderOrder = 60, r.castShadow = !1, r.receiveShadow = !1, r;
}
function Xi(e, t, n = "traveler") {
	let r = typeof e?.preset == "string" && Object.hasOwn(Jt, e.preset) ? e.preset : "traveler", i = e?.spec && typeof e.spec == "object" ? e.spec : {};
	return {
		...Jt[r],
		preset: r,
		...i,
		...t ? { weapon: n === "bellwarden" ? "hammer" : "sword" } : {}
	};
}
function Zi({ level: e, look: t, combat: n, kit: r, records: i }) {
	return Kt(e) || Wt(Xi(t, n, r)) || (i ?? []).some((e) => Wt(e?.spec)) ? qt() : null;
}
var Qi = class {
	constructor({ tileMap: e, rig: t, particles: n, audio: r, spawn: i, combat: a = !1, look: o = null, festival: s = !1, kit: c = "traveler" }) {
		this.tileMap = e, this.rig = t, this.particles = n, this.audio = r, this.sheet = a ? Gt(Xi(o, a, c), { combat: !0 }) : s ? yr("the player posed by the story").createFestivalSheet(Xi(o, !1)) : Gt(Xi(o, !1));
		let l = typeof i.facing == "string" && Object.hasOwn(qi, i.facing) ? i.facing : "down";
		this.sprite = new It(this.sheet, a ? {
			...sr,
			direction: l,
			combatFx: !0
		} : {
			...sr,
			direction: l
		}), this.sprite.name = "Player", this.position = this.sprite.position, this.position.set(i.x, e.getHeight(i.x, i.z), i.z), this.facing = qi[l].clone(), this.speed = 0, this.running = !1, this.frozen = !1, this.radius = Gi, this.action = null, this.faceOverride = null, this.moveOverride = null, this.scripted = null, this.speedMul = 1, this._move = {
			x: 0,
			z: 0
		}, this._dir = new A(), this._stepToggle = !1, this._dustTimer = 0, this._basisDir = new A(), this.sprite.onFrameChange = (e, t) => {
			if (!t) return;
			let n = t.startsWith("run");
			if (!n && !t.startsWith("walk") || e !== 0 && e !== 2) return;
			this._stepToggle = !this._stepToggle;
			let r = this._groundKind(), i = r === "wood" ? 1.25 : r === "stone" ? 1.1 : r === "sand" ? .85 : 1;
			this.audio?.playSfx("step", {
				volume: n ? .55 : .4,
				pitch: i * (this._stepToggle ? 1 : .94)
			}), n && this.particles.burst("footstep", this.position, 4);
		}, this.sprite.play("idle"), this.silhouetteMaterial = Ji(this.sprite.texture), this._silhouetteBase = this.silhouetteMaterial.color.clone(), this._silhouetteOn = !0, this._silhouetteFade = 1, this.silhouette = Yi(this.sprite.mesh.geometry, this.silhouetteMaterial, "Player.silhouette"), this.sprite.mesh.add(this.silhouette), this.talkSilhouetteMaterial = Ji(this.sprite.texture), this.talkSilhouette = Yi(this.sprite.mesh.geometry, this.talkSilhouetteMaterial, "Player.talkSilhouette"), this.talkSprite = null;
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
		e.opacity = Ki * t;
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
		let t = typeof e.facing == "string" && Object.hasOwn(qi, e.facing) ? e.facing : "down";
		this.teleport(e.x, e.z), this.facing.copy(qi[t]), this.sprite.setDirection(t), this.running = !1, this.frozen = !1, this.scripted = null, this.moveOverride = null, this.faceOverride = null, this.speedMul = 1, this.setTalkSilhouette(null), this.sprite.speed = 1, this.sprite.play("idle");
	}
	moveBy(e, t) {
		let n = Math.hypot(e, t);
		if (n < 1e-9) return 1;
		let r = this.position, i = this.tileMap.move(r, e, t, Gi, .55, this._move), a = Math.hypot(i.x - r.x, i.z - r.z);
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
			let c = (o ? Wi : Ui) * l * this.speedMul, d = n.move(r, t.x * c * e, t.z * c * e, Gi, .55, this._move), f = Math.hypot(d.x - r.x, d.z - r.z);
			r.x = d.x, r.z = d.z, this.speed = e > 0 ? f / e : 0, u ? (this.facing.set(u.x, 0, u.z), this.sprite.faceVector(u.x, u.z)) : (this.facing.copy(t), this.sprite.faceVector(t.x, t.z));
			let p = o ? "run" : "walk";
			this.sprite.play(p), this.sprite.speed = F(.55 + .45 * (this.speed / Math.max(.01, c)), .55, 1) * Math.max(.6, l);
		} else this.speed = 0, this.running = !1, this.sprite.play("idle"), this.sprite.speed = lr[0] + .04, u && this.facing.set(u.x, 0, u.z), this.sprite.faceVector(this.facing.x, this.facing.z);
		this._followGround(e);
	}
	_followGround(e) {
		let t = this.position, n = this.tileMap.getHeight(t.x, t.z), r = n > t.y ? mt(22, e) : mt(16, e);
		t.y += (n - t.y) * r, Math.abs(n - t.y) < .001 && (t.y = n);
	}
	dispose() {
		this.silhouetteMaterial.dispose(), this.talkSilhouette.removeFromParent(), this.talkSprite = null, this.talkSilhouetteMaterial.dispose(), this.sprite.dispose(), this.sheet.dispose?.();
	}
}, $i = .3, ea = Object.freeze({
	down: [0, 1],
	up: [0, -1],
	left: [-1, 0],
	right: [1, 0]
}), ta = .05, na = Math.PI * 2, ra = Object.freeze({
	panic: [4.5, 9],
	cower: [7, 13],
	relief: [6, 12],
	cheer: [8, 16]
}), ia = 15, aa = 45, oa = 2.5, sa = 6, ca = /* @__PURE__ */ new WeakMap();
function la(e) {
	let t = ca.get(e);
	return t || ca.set(e, t = {
		last: -Infinity,
		recent: [],
		routedFrame: -1,
		routed: !1
	}), t;
}
var ua = null, da = null, fa = 5.5, pa = 1.4, ma = class {
	constructor({ def: e, tileMap: t, sheetCache: n }) {
		this.def = e, this.id = e.id, this.name = e.name, this.tileMap = t, this.festival = mn.includes(e.behaviour) || e.festival === !0;
		let r = JSON.stringify({
			preset: e.preset,
			...e.spec || {}
		}) + (this.festival ? "|festival" : ""), i = n?.get(r);
		if (!i) {
			let t = {
				...Jt[e.preset],
				preset: e.preset,
				...e.spec || {}
			};
			i = this.festival ? yr(`the villager "${e.id}"`).createFestivalSheet(t) : Gt(t), n?.set(r, i);
		}
		this.sheet = i, this.sprite = new It(i, {
			...sr,
			direction: e.facing ?? "down"
		}), this.sprite.name = `NPC:${e.id}`, this.home = new A(e.home[0], 0, e.home[1]), this.position = this.sprite.position, this.position.set(e.home[0], t.getHeight(e.home[0], e.home[1]), e.home[1]), this.wander = e.wander ?? 1.2, this.speed = e.speed ?? 1, this.behaviour = yn.includes(e.behaviour) ? e.behaviour : "wander";
		let a = Math.max(.5, this.wander);
		this.chaseBounds = e.bounds ?? {
			minX: e.home[0] - a,
			maxX: e.home[0] + a,
			minZ: e.home[1] - a,
			maxZ: e.home[1] + a
		}, this.homeFacing = e.facing ?? "down", this.facing = new A(0, 0, 1);
		let o = Object.hasOwn(ea, this.sprite.direction) ? ea[this.sprite.direction] : ea.down;
		this.facing.set(o[0], 0, o[1]), this._faceYaw = null, this._faceRow = this.sprite.direction, this.talkRadius = e.talkRadius ?? 1.6, this.talkPoint = e.talkPoint ? new A(e.talkPoint[0], 0, e.talkPoint[1]) : null, this.rng = new ht(ft(e.id)), this.collider = t.addCollider({
			type: "circle",
			x: this.position.x,
			z: this.position.z,
			r: .34,
			dynamic: !0
		}), this.state = "idle", this.timer = this.rng.range(.5, 3), this.target = new A(), this.talking = !1, this.present = !0, this.directed = !1, this.storyObj = null, this.storyTalk = null, this._out = {
			x: 0,
			z: 0
		}, this._stuck = 0, this._lookTimer = 0, this.idleSpeed = this.rng.range(lr[0], lr[1]), this.festival && (this.barkRng = new ht(ft(`bark:${e.id}`)), this._barkT = this.barkRng.range(1.5, 9), this._calm = !1, this._reliefT = 0, this._spokeT = 0, this._threatT = this.rng.range(0, .25), this._danceSpeed = this.rng.range(.85, 1.15), this._runSpeed = Math.min(4.2, Math.max(2.6, this.speed * this.rng.range(2.9, 3.5)))), this._idle();
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
		n > 1e-6 && (this.facing.set(e / n, 0, t / n), this._applyFacing(yt.uCameraYaw.value));
	}
	faceDir(e) {
		let t = Object.hasOwn(ea, e) ? ea[e] : null;
		t && this.faceWorld(t[0], t[1]);
	}
	_applyFacing(e) {
		this.sprite.faceVector(this.facing.x, this.facing.z, e), this._faceYaw = e, this._faceRow = this.sprite.direction;
	}
	_followCamera() {
		let e = this.sprite, t = yt.uCameraYaw.value;
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
		n -= Math.round(n / na) * na, (n > ta || n < -.05) && this._applyFacing(t);
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
		let f = this.tileMap.move(a, o / c * l, s / c * l, $i, .55, this._out);
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
		r.y += (i - r.y) * mt(18, e), this.collider.x = r.x, this.collider.z = r.z;
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
			o < fa && o < i && (i = o, r = t.position);
		}
		let o = t._mk;
		for (let e = 0; e < o.length; e++) {
			let t = o[e];
			if (t.h < 0) continue;
			let a = t.spec;
			if (a.style !== "enemy" || a.shape !== "circle" && a.shape !== "ring") continue;
			let s = Math.hypot(a.x - n.x, a.z - n.z);
			s < a.r + pa && s - a.r < i && (i = s - a.r, r = a);
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
		let t = ha(e.game, this.tileMap);
		return t === this._calm ? t : (this._calm = t, t ? (this._reliefT = aa, this._spokeT > 0 && e.game.ui.emotes?.clear(this.sprite), this.state = "relief", this.timer = this.rng.range(1.5, 3.5), this.faceWorld(e.player.x - this.position.x, e.player.z - this.position.z)) : (this.state = "idle", this.timer = 0), t);
	}
	_updateCalm(e, t) {
		this.state === "relief" ? (this.sprite.play("cheer", { speed: this._danceSpeed }), this.timer -= e, this.timer <= 0 && (this.state = "idle", this.timer = this.rng.range(.4, 1.5), this._idle())) : this._updateWander(e, t.player, Math.min(this.wander, oa)), this._reliefT > 0 && (this._reliefT -= e, this._bark(e, t, "relief"));
	}
	_bark(e, t, n) {
		if (this._spokeT > 0 && (this._spokeT -= e), this._barkT -= e, this._barkT > 0) return;
		let r = this.barkRng, [i, a] = ra[n];
		this._barkT = r.range(i, a);
		let o = t.game;
		if (!o || o.mode !== "play" || o.ui.dialog.isOpen || o.story?.cardUp || o.ui.endCard?.active) return;
		let s = la(this.tileMap), c = o.engine.time.elapsed;
		if (c - s.last < 1.7999990000000001) {
			this._barkT = r.range(.5, 2);
			return;
		}
		if (Math.hypot(t.player.x - this.position.x, t.player.z - this.position.z) > ia) return;
		s.last = c, this._spokeT = sa;
		let l = yr("a bark").SIEGE_BARKS[n], u = s.recent, d = r.pick(l);
		for (let e = 0; e < 4 && u.includes(d); e++) d = r.pick(l);
		u.push(d), u.length > Math.min(4, l.length - 1) && u.shift();
		let f = o.ui.emotes;
		f && ga(o) && f.bark(this.sprite, L(`siege.${d}`), void 0, { offsetY: this.def.preset === "child" ? 1.9 : 2.35 });
	}
	hush(e) {
		this._spokeT > 0 && e?.clear(this.sprite);
	}
	dispose() {
		this.tileMap.removeCollider(this.collider), this.sprite.dispose();
	}
};
function ha(e, t) {
	let n = e?.combat;
	if (!n) return !1;
	let r = la(t), i = e.engine.time.frame;
	if (r.routedFrame === i) return r.routed;
	r.routedFrame = i;
	let a = n.enemies, o = a.length > 0;
	for (let e = 0; o && e < a.length; e++) a[e].alive && a[e].sprite.visible && (o = !1);
	return r.routed = o, o;
}
function ga(e) {
	let t = kn();
	if (ua === t) return !0;
	let { registerSiegeStrings: n, SIEGE_STRINGS: r } = yr("a bark");
	if (n(), !da) {
		let n = e.ui?.fonts, i = r[t] ?? r.en;
		da = (n ? n.ensure(Object.values(i)) : Promise.resolve()).then(() => {
			ua = t, da = null;
		});
	}
	return !1;
}
//#endregion
//#region src/game/Critters.js
var _a = class {
	constructor({ sheet: e, tileMap: t, x: n, z: r, seed: i, bounds: a = null, radius: o = .15, speed: s = .9, opts: c = {} }) {
		this.tileMap = t, this.sprite = new It(e, {
			...sr,
			blobSize: [.55, .26],
			...c
		}), this.position = this.sprite.position, this.position.set(n, t.getHeight(n, r), r), this.home = new A(n, 0, r), this.start = {
			x: n,
			z: r
		}, this.absent = !1, this.bounds = a, this.radius = o, this.speed = s, this.rng = new ht(i), this.state = "idle", this.timer = this.rng.range(.2, 2.5), this.target = new A(n, 0, r), this._out = {
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
		let { x: e, z: t } = xa(this.tileMap, this.start.x, this.start.z);
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
		t.y += (n - t.y) * mt(18, e);
	}
}, va = class extends _a {
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
}, ya = class extends _a {
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
}, ba = {
	chicken: {
		cls: va,
		speed: .8,
		radius: .15,
		opts: { blobSize: [.5, .24] }
	},
	cat: {
		cls: ya,
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
		cls: ya,
		speed: 1.3,
		radius: .22,
		opts: { blobSize: [.8, .34] }
	},
	bird: {
		cls: class extends _a {
			constructor(e) {
				super(e), this.vel = new A(), this.hidden = 0, this.roam = e.roam ?? 1.6;
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
function xa(e, t, n) {
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
var Sa = class {
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
		return t || (t = Ut(e, ba[e].sheet ?? {}), this.sheets.set(e, t)), t;
	}
	_spawnGroup(e) {
		let t = Rt(ba, e.kind) ? e.kind : "chicken", n = ba[t], r = this.tileMap, i = Number(e.x) || 0, a = Number(e.z) || 0, o = Math.max(.3, Number(e.radius) || 2.5), s = bn(e) ?? {
			minX: i - o,
			maxX: i + o,
			minZ: a - o,
			maxZ: a + o
		}, c = Number.isFinite(e.seedBase) ? e.seedBase : ft(String(e.id ?? t)) % 1e4, l = this._sheet(t), u = vn(e, (e, t) => r.isWalkable(e, t)), d = [];
		nr(e) && this.storyGroups.push({
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
			let r = xa(t.tileMap, n.x, n.z);
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
}, Ca = [
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
], wa = class {
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
		}, this.zoomFog = 1, this.gust = 0, this._gust = 0, this.indoors = !1, this.snowHold = null, this.frostCover = 0, this.frostAmount = 0, this.snowFloor = 0, this.thaw = null, this.frozenMist = /* @__PURE__ */ new Set(), this.setWorld(i), mr.value = 0, this.weather = "clear", this._w = { ...Dr.clear }, this._transition = null, this.rain = t.createEmitter(Er("rain", { intensity: 0 })), this.snow = t.createEmitter(Er("snow", { intensity: 0 }));
	}
	setWorld(e) {
		this.world = e, this.gust = this._gust = 0, this.frozenMist?.clear(), this._env = e?.level?.environment ?? {}, this.indoors = Ln(this._env);
		let t = Number(e?.level?.environment?.fogScale);
		this.levelFog = Number.isFinite(t) && t > 0 ? t : 1;
		let n = e.water;
		this._waterBase = n ? e.waterBase ??= {
			brightness: n.uniforms.uBrightness.value,
			glint: n.uniforms.uGlint.value
		} : null;
	}
	get shown() {
		return Un(this._env, this.weather);
	}
	get time() {
		return this.lighting.timeOfDay;
	}
	get snowCover() {
		return Math.max(mr.value, this.frostCover * this.frostAmount);
	}
	set snowCover(e) {
		e = F(Number(e) || 0), this.frostCover > 0 ? this.frostAmount = F(e / this.frostCover) : mr.value = e;
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
		let e = this._transition ? (this._transition.from + this._transition.delta) % 24 : this.lighting.timeOfDay, t = Ca.find((t) => t.h > e + .05);
		return t ||= Ca[0], this.setTime(t.h, { duration: 2 }), t;
	}
	setWeather(e, { instant: t = !1 } = {}) {
		if (!Object.hasOwn(Dr, e)) return this.weather;
		if (this.weather = e, t) {
			let e = this.shown;
			Object.assign(this._w, Dr[e]), mr.value = this._settled(e);
		}
		return e;
	}
	_settled(e) {
		return Math.max(this.frostCover > 0 && e === "frost" ? 0 : br(e), this.snowFloor);
	}
	settleSnow() {
		mr.value = this._settled(this.shown);
	}
	cycleWeather() {
		let e = Ar.indexOf(this.weather);
		return this.setWeather(Ar[(e + 1) % Ar.length]);
	}
	factor(e) {
		return this._w[e];
	}
	update(e) {
		let t = this._transition;
		if (t) {
			t.t += e;
			let n = I(0, 1, F(t.t / t.duration));
			this.lighting.setTime(t.from + t.delta * n), t.t >= t.duration && (this._transition = null);
		}
		let n = this.shown, r = Dr[n], i = mt(1.1, e), a = this._w;
		for (let e = 0; e < Nr.length; e++) {
			let t = Nr[e];
			a[t] += (r[t] - a[t]) * i;
		}
		let o = this.tuning, s = this.lighting.settings;
		Or(s, a, o), s.fogMul = o.fogMul * a.fog * this.zoomFog * this.levelFog, this._gust += (this.gust - this._gust) * mt(this.gust > this._gust ? 7 : 2.2, e), this._gust < .001 && !this.gust && (this._gust = 0), Ir(a, o.windStrength, this._gust);
		let c = this.postfx.settings.grade;
		Sr(c, a, o.gradeTemperature, o.gradeSaturation), c.saturation -= Fr * this.lighting.nightFactor;
		let l = a.overcast;
		Pr(this.lighting, l), this.godRays.intensity = o.godRays * a.rays * Mr(this.lighting.timeOfDay);
		let u = this.lighting.nightFactor, d = this.world, f = d.emitters;
		f.dust && (f.dust.intensity = o.dust * a.dust);
		let p = d.areaEmitters ?? [];
		for (let e = 0; e < p.length; e++) {
			let t = Cr(p[e].preset, a, o, u);
			t !== null && (p[e].emitter.intensity = t);
		}
		let m = d.propEmitters;
		for (let e = 0; e < m.length; e++) {
			let t = m[e], n = t.preset ?? t.config?.preset;
			n === "smoke" ? t.intensity = o.smoke : n === "mist" && (t.intensity = this.frozenMist.has(t) ? 0 : o.mist);
		}
		jr(d.lights, d.lightPool ?? null, l), xr(d.emissiveEntries, l), d.glassMaterial && d.glassMaterial.color.setScalar(wr(u, l));
		let h = this._waterBase;
		if (h) {
			let e = d.water.uniforms, t = kr(u);
			e.uBrightness.value = h.brightness * t.brightness, e.uGlint.value = h.glint * t.glint;
		}
		this.rain.intensity = Tr(a.rain), this.snow.intensity = Tr(a.snow);
		let g = this._settled(n), _ = g > mr.value ? 1 / 15 : 1 / 8;
		mr.value += F(g - mr.value, -_ * e, _ * e), this.snowHold === null ? this.frostAmount > 0 && (this.frostAmount = Math.max(0, this.frostAmount - e / 8)) : this.frostAmount = Math.min(1, this.frostAmount + e / 3), this.thaw?.update(e);
	}
	dispose() {
		this.rain.dispose(), this.snow.dispose();
	}
}, Ta = class {
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
function Ea(e) {
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
	c.add(l, "hour", 0, 24, .01).name("time of day").listen(), c.add(n, "timeSpeed", 0, 2, .01).name("speed (h / s)"), c.add(n, "paused").listen(), c.add(l, "weather", Ar).listen(), c.add({ next: () => e.cycleTime() }, "next").name("next preset (T)");
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
		i.pitchTarget = t * _t;
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
			return i.pitchTarget * pt;
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
			return i.yawTarget * pt;
		},
		set yaw(e) {
			i.yawTarget = e * _t;
		}
	}, w = s.addFolder("Camera");
	w.add(C, "fov", 10, 70, .1).listen(), w.add(C, "pitch", 8, 80, .1).listen(), w.add(C, "distance", i.minDistance, i.maxDistance, .1).listen(), w.add(C, "yaw", -180, 180, .1).listen(), w.add(i, "freeYaw").name("free yaw"), w.add(i, "lookAhead", 0, 3, .01), w.add(i, "followLambda", .5, 15, .1).name("follow speed"), w.add({ reset: () => {
		S();
		let t = e.camera;
		i.setAngles(0, t.pitch), i.distanceTarget = t.distance, i.fov = t.fov;
	} }, "reset"), w.close();
	let T = s.addFolder("Atmosphere");
	T.add(v, "godRays", 0, 3, .01).name("god rays"), T.add(v, "dust", 0, 1, .01).name("dust motes"), T.add(v, "fireflies", 0, 1, .01), T.add(v, "leaves", 0, 1, .01).name("falling leaves"), T.add(v, "petals", 0, 1, .01), T.add(v, "smoke", 0, 1, .01).name("chimney smoke"), T.add(v, "mist", 0, 1, .01).name("waterfall mist"), T.add(v, "windStrength", 0, 4, .01).name("wind"), T.add(a, "snowCover", 0, 1, .01).name("snow cover").listen(), T.close();
	let E = s.addFolder("Render"), ee = {
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
	return E.add(ee, "renderScale", .5, 1, .05).name("render scale").listen(), E.add(ee, "autoResolution").name("dynamic resolution").listen(), E.add(ee, "showStats").name("show stats").onChange((e) => {
		s.stats.element.style.display = e ? "" : "none";
	}), E.add({ photo: () => e.togglePhotoMode() }, "photo").name("photo mode (P)"), E.close(), s.syncListening?.(), s;
}
//#endregion
//#region src/game/AtmosphereFog.js
var Da = "/* emberfall:fog-start */";
function Oa(e) {
	if (e !== void 0 && ka(e), st.fog_vertex.includes(Da)) return;
	let t = yt.uFogStart;
	st.fog_pars_vertex = `${st.fog_pars_vertex}
#ifdef USE_FOG
	uniform vec2 uFogStart;
#endif
`, st.fog_vertex = `${Da}
#ifdef USE_FOG
	vFogDepth = max( 0.0, - mvPosition.z - uFogStart.x );
#endif
`;
	for (let e of Object.values(ct)) "fogDensity" in e.uniforms && (e.uniforms.uFogStart = t);
	Object.assign(it.fog, { uFogStart: t }), Ye.clone({ uniform: t }).uniform.value !== t.value && console.warn("[Luminati] three.js copies typed-array uniforms: built-in materials keep the fog start they compiled with");
}
function ka(e) {
	yt.uFogStart.value[0] = Number.isFinite(e) ? e : 0;
}
//#endregion
//#region src/game/CinematicLook.js
var Aa = Object.freeze({
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
function ja(e) {
	for (let t of [
		"dof",
		"bloom",
		"grade",
		"cinematic"
	]) {
		let n = e[t];
		for (let [e, r] of Object.entries(Aa[t])) n[e] = Array.isArray(r) ? [...r] : r;
	}
}
function Ma(e, t) {
	let n = Na(t);
	e.cinematic.streaks = n.streaks, e.cinematic.streakThreshold = n.streakThreshold, Pa.set(e, n);
}
function Na(e) {
	let t = e?.cinematic, n = t?.streaks, r = t?.streakThreshold;
	return {
		streaks: typeof n == "number" && Number.isFinite(n) ? n : Aa.cinematic.streaks,
		streakThreshold: typeof r == "number" && Number.isFinite(r) ? r : Aa.cinematic.streakThreshold
	};
}
var Pa = /* @__PURE__ */ new WeakMap();
function Fa(e, t, n = null) {
	if (!Array.isArray(t?.states) || !t.states.length) return !1;
	let r = Na(t), i = Pa.get(e);
	return i && i.streaks === r.streaks && i.streakThreshold === r.streakThreshold ? !1 : (Ma(e, t), n && (n.base.streaks = r.streaks), !0);
}
//#endregion
//#region src/game/levels.js
var Ia = Object.freeze([
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
]), La = [
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
], Ra = {
	keys: "B",
	label: "Journal",
	id: "journal"
}, za = {
	keys: "G",
	label: "Party",
	id: "party"
}, Ba = (e) => e.map((e) => ({
	...e,
	label: L(`game.controls.${e.id}`)
}));
function Va(e) {
	if (e?.def?.unnamed) return L("game.default.villager");
	let t = e?.name;
	return typeof t == "string" ? Lr(t) : String(t ?? "");
}
function Ha(e) {
	let t = typeof e?.label == "string" ? e.label : String(e?.label ?? ""), n = gn(t);
	if (n) return L(`game.prompt.${n}`);
	let r = e?.object;
	return r && (r.type === "exit" || r.type === "event") ? Br(Cn(r, "label"), t, "label") : t;
}
function Ua(e) {
	let t = e?.def?.title;
	if (typeof t != "string" || !t.trim()) return "";
	let n = e.def.titleKey;
	return Br(typeof n == "string" ? n : "", t, "title");
}
var Wa = Object.freeze({
	en: "EN",
	ja: "日本語",
	zh: "中文"
}), Ga = 1.6, Ka = .5, qa = {
	x: 0,
	z: 0
};
function Ja(e) {
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
function Ya(e, t, n, r = qa) {
	let i = e.a.x, a = e.a.z, o = e.b.x - i, s = e.b.z - a, c = o * o + s * s, l = c > 1e-12 ? Math.min(1, Math.max(0, ((t - i) * o + (n - a) * s) / c)) : 0;
	return r.x = i + o * l, r.z = a + s * l, r;
}
var Xa = 42, Za = 4, Qa = .8, $a = .4, eo = 5, to = 2, no = (e) => new Promise((t) => setTimeout(t, e * 1e3)), ro = (e, t) => Number.isFinite(Number(e)) && e !== null && e !== "" ? Number(e) : t, io = (e) => !!e && [
	"minX",
	"maxX",
	"minZ",
	"maxZ"
].every((t) => Number.isFinite(e[t])), ao = (e) => Array.isArray(e) && e.length >= 2 && Number.isFinite(e[0]) && Number.isFinite(e[1]), oo = {
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
}, so = /^\s*(?:\*\s+)?pose\s+(?:"([^"]+)"|(\S+))/;
function co(e, t) {
	let n = /* @__PURE__ */ new Set(), r = (e) => {
		for (let t of Array.isArray(e) ? e : []) {
			let e = typeof t == "string" ? so.exec(t) : null;
			e && n.add((e[1] ?? e[2]).toLowerCase());
		}
	};
	for (let t of e.objects) t?.type === "event" ? r(t.run) : t?.type === "npc" && r(t.talk);
	for (let e of Object.values(t?.scripts ?? {})) r(e?.lines);
	return n;
}
function lo(e, t) {
	let n = e.x, r = e.z, i;
	ao(e.talkOffset) ? i = [n + e.talkOffset[0], r + e.talkOffset[1]] : ao(e.talkPoint) && (i = [e.talkPoint[0], e.talkPoint[1]]);
	let a;
	io(e.area) ? a = {
		minX: n + e.area.minX,
		maxX: n + e.area.maxX,
		minZ: r + e.area.minZ,
		maxZ: r + e.area.maxZ
	} : io(e.bounds) && (a = { ...e.bounds });
	let o = typeof e.name == "string" ? e.name : typeof e.name == "number" || typeof e.name == "boolean" ? String(e.name) : "";
	return {
		id: e.id,
		name: o || "Villager",
		...o ? {} : { unnamed: !0 },
		preset: xn.includes(e.preset) ? e.preset : "villager",
		spec: e.spec && typeof e.spec == "object" ? e.spec : void 0,
		home: [n, r],
		wander: Math.max(0, ro(e.wander, 1.2)),
		speed: Math.max(.1, ro(e.speed, 1)),
		facing: [
			"down",
			"up",
			"left",
			"right"
		].includes(e.facing) ? e.facing : "down",
		behaviour: e.behaviour,
		talkRadius: e.talkRadius == null ? void 0 : Math.max(.5, ro(e.talkRadius, 1.6)),
		talkPoint: i,
		bounds: a,
		portraitColor: e.portraitColor || "#c9a45c",
		title: typeof e.title == "string" && e.title.trim() ? e.title : void 0,
		titleKey: typeof e.title == "string" && e.title.trim() && Cn(e, "title") || void 0,
		...t && [
			e.id,
			e.actor,
			o
		].some((e) => typeof e == "string" && t.has(e.toLowerCase())) ? { festival: !0 } : {}
	};
}
var uo = class {
	constructor({ container: e, level: t, autostart: n = !1, source: r = "", campaign: i = null, lang: a = void 0, fonts: o = null, look: s = "diorama" }) {
		if (this.uiOptions = {
			lang: a,
			fonts: o
		}, !t || !Array.isArray(t.tiles)) throw Error("Game: a level is required");
		this.container = e, this.source = r, this.autostart = n, this.look = s === "cinematic" ? "cinematic" : "diorama", this.campaign = i;
		let c = i?.campaign.player;
		this.playerName = c?.name ?? "", this.playerLook = c?.preset || c?.spec ? {
			...c.preset ? { preset: c.preset } : {},
			...c.spec ? { spec: c.spec } : {}
		} : null, this.playerKit = c?.kit ?? "traveler", this.controls = Object.freeze({
			time: i?.campaign.controls?.time !== !1,
			weather: i?.campaign.controls?.weather !== !1
		}), this._events = new kt(), this.season = null, this.thaw = null, this._applyLevel(t), this.mode = "loading", this.photoMode = !1, this.mapOpen = !1, this.busy = !1, this.musicWanted = !0, this.inventory = Object.assign(Object.create(null), { apples: 0 }), this.visits = /* @__PURE__ */ new Map(), this._regionTimer = 0, this._burstTimer = 0, this._sparkleTimer = 0, this._talkCooldown = 0, this._tmp = new A(), this._focusPos = new A(), this._target = {
			kind: "",
			npc: null,
			it: null
		}, this._timeouts = /* @__PURE__ */ new Set(), this._photoTimer = 0, this._removeAudioUnlock = null, this._disposed = !1, this._warmFrames = 0, this.combat = null, this.vfxLights = null, this.story = null, this.party = null, this._partyHudShown = !1, this.warmedUp = new Promise((e) => {
			this._resolveWarm = e;
		}), i?.attach(this);
	}
	_applyLevel(e) {
		this.level = e, this.env = e.environment ?? {};
		let t = this.env.camera ?? {};
		this.camera = Object.freeze({
			...dr,
			...Pn(t)
		}), ka(this.camera.distance - 7), this.cameraBounds = this._resolveCameraBounds(t.bounds);
		let n = this.env.highGround;
		this.highGround = n && Number.isFinite(ro(n.minY, NaN)) ? {
			minY: ro(n.minY, 0),
			pitch: F(ro(n.pitch, this.camera.pitch), 10, 80)
		} : null, this.regions = e.objects.filter((e) => e.type === "region"), this._bannersShown = /* @__PURE__ */ new Set(), this._regionBanner = null, this.region = "", this.combatEnabled = Sn(e), this.envNow = this.env, this.levelStates = null, this._cine = {
			t: 0,
			target: new A(),
			...this._titleCamera()
		}, this._cine.target.set(this._cine.x, this._cine.y, this._cine.z + Math.sin(1) * this._cine.driftZ);
	}
	_applyBackdrop() {
		let e = typeof this.env.backdrop == "string" ? this.env.backdrop.trim() : "", t = null;
		e === "void" ? t = new j(0, 0, 0) : /^#[0-9a-fA-F]{6}$/.test(e) ? t = new j(e) : e && console.warn(`[Luminati] environment.backdrop "${e}" is neither "void" nor #rrggbb: the sky is shown`), this.lighting && (this.lighting.settings.backdrop = t);
	}
	_resolveCameraBounds(e) {
		let t = (e) => ({
			minX: Math.min(e.minX, e.maxX),
			maxX: Math.max(e.minX, e.maxX),
			minZ: Math.min(e.minZ, e.maxZ),
			maxZ: Math.max(e.minZ, e.maxZ)
		});
		if (e && io(e.near) && io(e.mid) && io(e.far)) return {
			near: t(e.near),
			mid: t(e.mid),
			far: t(e.far)
		};
		if (io(e) || io(e?.mid)) {
			let n = t(io(e) ? e : e.mid);
			return {
				near: { ...n },
				mid: { ...n },
				far: { ...n }
			};
		}
		let n = Qn(this.level, 0), r = (e, t, n, r) => t - e >= n + r ? [e + n, t - r] : [, ,].fill(e + (t - e) * (n / Math.max(1e-6, n + r))), i = {};
		for (let [e, t] of Object.entries(oo)) {
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
			x: ro(e.x, n),
			z: ro(e.z, r),
			y: ro(e.y, this._typicalGround() + .5),
			driftX: ro(e.driftX, Math.min(7, (t.maxX - t.minX) * .25)),
			driftZ: ro(e.driftZ, Math.min(5, (t.maxZ - t.minZ) * .25)),
			distance: F(ro(e.distance, Math.min(35, Math.max(22, i * .8))), 8, 80)
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
			Ja(e.target) || e.preventDefault();
		}, window.addEventListener("contextmenu", this._onContextMenu, !0), this.loadStats = {}, Oa();
		let n = new St({
			container: this.container,
			maxPixelRatio: globalThis.__emberPixelRatio ?? 1.25,
			...globalThis.__emberInputTarget ? { inputTarget: globalThis.__emberInputTarget } : {}
		});
		this.engine = n;
		let { scene: r, camera: i, renderer: a } = n;
		this.textures = new Vt({
			seed: 1337,
			anisotropy: 4
		});
		let o = Dt.map((e) => ({
			...e,
			...or[e.name] ?? {}
		})), s = (ro(this.env.timeOfDay, 17.2) % 24 + 24) % 24;
		this.lighting = new jt(n, {
			timeOfDay: s,
			shadowExtent: 26,
			sunPath: ur,
			moonPath: ir,
			keyframes: o
		}), this.lighting.sky.lowerClouds = .25, this._applyBackdrop(), this.lighting.timeSpeed = this.env.clock === !1 ? 0 : ar, this.lighting.paused = !0, this.particles = new Yt(r), this.godRays = new Ct({ gain: .2 }), r.add(this.godRays.object), this.spriteManager = new Jr(i), this.rig = new bt(i, {
			...this.camera,
			yaw: 0,
			lookAhead: 1.3
		}), this.rig.bounds = { ...this.cameraBounds.mid };
		let c = Math.min(window.devicePixelRatio || 1, n.maxPixelRatio), l = window.innerWidth * window.innerHeight * c * c;
		this.postfx = new xt(a, r, i, {
			maxTaps: 64,
			samples: l > 18e5 ? 2 : 4
		}), this._tunePost(this.postfx.settings), n.events.on("resize", ({ width: e, height: t, pixelRatio: n }) => this.postfx.setSize(e, t, n)), this.resolution = new Ta({
			engine: n,
			postfx: this.postfx
		}), this.ui = new Nt(globalThis.__emberUiRoot ?? document.body, this.uiOptions), this.audio = new zt({ volume: .6 }), this.lightPool = this.campaign ? new Pt(this.lighting, [], {
			size: 12,
			fixed: !0
		}) : null;
		let { VfxLights: u } = await import("./VfxLights-7g_H1a6G.js");
		this.vfxLights = new u(this.lighting), wi(this, this.env), this.look === "cinematic" && (Ma(this.postfx.settings, this.env), this.on("env", (e) => Fa(this.postfx.settings, e, this.combat?.look)));
		let d = performance.now();
		this.loadStats.engine = Math.round(d - t), (this.campaign || hn(this.level)) && await this._createStory(), this._fontsPending = this.ui.fontsReady;
		let { earlyCompile: f } = await this._buildLevel(e, { t0: d }), p = this.ui;
		p.hud.showHelp(!1, { tab: !1 }), p.prompt.keyHint = "Space", p.dialog.speed = 55, p.dialog.onSound = (e) => this.audio.playSfx(e, { volume: .7 });
		let m = 0;
		p.dialog.onChar = (e) => {
			e === " " || m++ & 1 || this.audio.playSfx("blip", {
				volume: .22,
				pitch: .94 + Math.random() * .12
			});
		}, Ea(this), n.addSystem(this.lighting, -10), n.addSystem({
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
		this.loadStats.characters = Math.round(h - d - this.loadStats.world), e(.96, L("game.load.warmup")), await no(0), this.rig.setTarget(this.player.sprite), this.rig.snap(), this.weather.rain.intensity = 1, this.weather.snow.intensity = 1, this.particles.update(1 / 60, i);
		let g = this._tmp.set(0, -1e3, 0);
		this.world.falls.some((e) => e.splash) && (this.particles.burst("splash", g, 1), this.particles.burst("sparkle", g, 1, { size: [.2, .34] })), this.particles.burst("footstep", g, 1), this.combat?.warmup(g), await f, await this._compileScene(), this.postfx.warmup();
		let _ = this._primeShadows();
		this.warmedUp.then(() => _.dispose()), this.weather.rain.intensity = 0, this.weather.snow.intensity = 0, this.env.weather && this.env.weather !== "clear" && !Ln(this.env) && this.weather.setWeather(this.env.weather, { instant: !0 }), this.campaign?.onStart(), this.applyLevelStates(), await this.syncParty(), this._exposeGlobal(), this.loadStats.compile = Math.round(performance.now() - h), e(1, L("game.load.ready"));
	}
	async _buildLevel(e, { t0: t = performance.now(), spawn: n = this.level.spawn, prepared: r = null, kept: i = null } = {}) {
		let a = this.engine, { scene: o } = a;
		this.story?.setLevelId(this.campaign?.levelId ?? this._storyLevelId());
		let s = this.level.environment;
		!this.thaw && (s?.frost || s?.states) && (this.thaw = await import("./LevelStates-wCfJmda-.js")), await Si(), this.primeLevelMusic(this.level, "level");
		let c = this._glyphsFor();
		i ? (this.world = i.world, this.world.story = this.story ? { present: this.story.present } : null, this.world.attach()) : r?.world && r.level === this.level ? (this.world = r.world, await r.finish(), this.world.story = this.story ? { present: this.story.present } : null, this.world.attach()) : (this.world = new Hi({
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
			this.posed = co(this.level, this.campaign?.story), vr(this.level, this.posed) && await _r(), this.player = i.player, this.npcs = i.npcs, this._npcSheets = i.sheets, this.critters = i.critters;
			for (let e of this._actorSprites()) o.add(e), this.spriteManager.add(e);
			this.player.arrive(n), this.lighting.followTarget(this.player.sprite), this._ensureStandingSpawn({ quiet: n !== this.level.spawn });
		} else {
			e(.92, L("game.load.villagers")), await no(0);
			let t = co(this.level, this.campaign?.story);
			this.posed = t, vr(this.level, t) && await _r(), await Zi({
				level: this.level,
				look: this.playerLook,
				combat: this.combatEnabled,
				kit: this.playerKit,
				records: this.party?.records
			}), this.player = new Qi({
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
				let n = new ma({
					def: lo(e, t),
					tileMap: this.tileMap,
					sheetCache: r
				});
				n.storyObj = e, n.talk = Vr(e), n.storyFlag = typeof e.flag == "string" ? e.flag.trim() : "", o.add(n.sprite), this.spriteManager.add(n.sprite), this.npcs.push(n);
			} catch (t) {
				console.warn(`[Luminati] could not create NPC "${e.id}":`, t);
			}
			this.critters = new Sa({
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
			far2: Xa ** 2,
			every: Za,
			frame: 0,
			npcDt: new Float32Array(this.npcs.length)
		} : null, this._throttle && (this.critters.throttle = {
			focus: this.rig.focusPoint,
			far2: Xa ** 2,
			every: Za
		}), await this._fontsIn(c), this.combatEnabled) {
			e(.94, L("game.load.blades")), await no(0);
			let { CombatSystem: t } = await import("./CombatSystem-nsRtT1fN.js");
			this.combat = new t({ game: this }), await this.combat.load();
		}
		let d = this.world.batching || !!this.combat;
		this.blobs = i ? i.blobs : d ? new Yr() : null;
		let f = this._actorSprites();
		this.combat && f.push(...this.combat.actorSprites), this._actorEmissives = [];
		for (let e of f) this._actorEmissives.push(this.lighting.registerEmissive(e.material, cr)), !i && (d && e.shadowProxy && cn(e.shadowProxy, [this.lighting.sun]), this.blobs?.adopt(e));
		this.blobs?.mesh && a.scene.add(this.blobs.mesh), this.weather ? this.weather.setWorld(this.world) : this.weather = new wa({
			lighting: this.lighting,
			particles: this.particles,
			postfx: this.postfx,
			godRays: this.godRays,
			world: this.world
		}), this.audioDirector = i?.audioDirector ?? new Oi({
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
		return !Dn(kn()) || typeof e?.ensure != "function" ? null : e.ensure(Rr(() => this._shownTexts()));
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
		for (let n of e.objects) if (n.type === "region") t.push(Lr(n.name), Br(Cn(n, "sub"), n.sub, "title"), Br(Cn(n, "banner"), n.banner, "title"));
		else if (n.type === "npc") {
			let e = lo(n);
			t.push(Va({
				name: e.name,
				def: e
			}), Ua({ def: e }));
		} else n.type === "signpost" ? t.push(n.speaker == null ? L("game.default.signpost") : Lr(n.speaker)) : (n.type === "exit" && this.campaign && n.mode === "use" || n.type === "event" && this.story && (n.on ?? "use") === "use") && typeof n.label == "string" && n.label.trim() && t.push(Ha({
			label: n.label.trim(),
			object: n
		}));
		for (let e of Ia) t.push(Lr(e.label));
		return t.push(...Tt(kn())), t;
	}
	prepareWorld(e, t) {
		return new Hi({
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
		this.source = n, this._applyLevel(e), this._applyBackdrop(), wi(this, this.env), this.look === "cinematic" && Ma(this.postfx.settings, this.env);
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
		if (d || this._disposeDetached(u), f.setTarget(this.player.sprite), f.setAngles(0, this.camera.pitch), f.distanceTarget = this.camera.distance, this._updateCameraBounds(), f.snap(), this.world.lightPool?.snap(), this.postfx.setFocus(this._playerFocusDistance(), !0), a) await p, await this._compileScene(), await this._frames(to);
		else {
			let e = this._tmp.set(0, -1e3, 0);
			this.weather.rain.intensity = 1, this.weather.snow.intensity = 1, this.particles.update(1 / 60, this.engine.camera), this.world.falls.some((e) => e.splash) && (this.particles.burst("splash", e, 1), this.particles.burst("sparkle", e, 1, { size: [.2, .34] })), this.particles.burst("footstep", e, 1), this.combat?.warmup(e), await p, await this._compileScene();
			let t = this._primeShadows();
			await this._frames(eo), t.dispose(), this.weather.rain.intensity = 0, this.weather.snow.intensity = 0, this.combat?.endWarmup();
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
		let e = sn(this.engine.scene, { lights: [this.lighting.sun] });
		return this.engine.scene.add(e.object), this.loadStats.shadowVariants = e.count, e;
	}
	_compileScene() {
		let e = this.engine.renderer, t = e.getRenderTarget();
		e.setRenderTarget(this.postfx.sceneTarget);
		let n = e.compileAsync(this.engine.scene, this.engine.camera);
		return e.setRenderTarget(t), n;
	}
	_setupMaps(e = null) {
		let t = performance.now(), n = this._mapPresence(), r = e?.levelMap && e.mapKey === n ? e.levelMap : er(this._mapLevel());
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
		let t = this.level.objects.filter((t) => !nr(t) || e.present(t));
		return t.length === this.level.objects.length ? this.level : {
			...this.level,
			objects: t
		};
	}
	_mapPresence() {
		let e = this.story;
		if (!e) return "";
		let t = "";
		for (let n of this.level.objects) nr(n) && (t += e.present(n) ? "1" : "0");
		return t;
	}
	repaintLevelMap() {
		if (!this.levelMap || this.mode === "travel") return;
		this.party?.dropNav();
		let e = er(this._mapLevel());
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
			name: Lr(e.name)
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
		return e && (this.mode !== "play" || this.busy || t.dialog.isOpen || this.photoMode || !this.levelMap || this.combat?.locksPlayer || this.partyMenuOpen) || e === this.mapOpen ? this.mapOpen : (this.mapOpen = e, e ? (this.combat?.onMapOpen(), t.worldMap.setRegion(Lr(this.region)), t.worldMap.open(), t.prompt.hide(), this.audio.playSfx("open", { volume: .45 })) : (t.worldMap.close(), this.audio.playSfx("close", { volume: .4 })), this.mapOpen);
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
		}), this.look === "cinematic" && ja(e);
	}
	start() {
		this._warmFrames = eo, this.engine.start(), this.autostart ? this.enterGameplay({ instant: !0 }) : this.showTitle();
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
				destinations: Ia.map((e) => ({
					value: e.value,
					label: Lr(e.label)
				})),
				current: n
			} : {},
			...this._languageOptions()
		};
		if (await this.ui.title.show(r), this._disposed) return;
		let i = n ? this.ui.title.destination : void 0;
		if (i && i !== n && Ia.some((e) => e.value === i)) {
			let e = new URLSearchParams(window.location.search);
			e.delete("autostart"), e.set("level", i), window.location.search = e.toString();
			return;
		}
		this.enterGameplay({ instant: !1 });
	}
	_shippedSlug() {
		let e = /^levels\/([^/]+)\.json$/.exec(this.source || "");
		return e && Ia.some((t) => t.value === e[1]) ? e[1] : null;
	}
	_languageOptions() {
		return {
			languages: jn.map((e) => ({
				code: e,
				label: Wa[e] ?? e
			})),
			lang: kn(),
			onLanguage: (e) => {
				this.setLanguage(e);
			}
		};
	}
	setLanguage(e) {
		let t = An(e), n = new URLSearchParams(window.location.search), r = n.has("lang");
		return !r && t === kn() ? t : (n.delete("lang"), r ? window.location.search = n.toString() : window.location.reload(), t);
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
		let { StoryRunner: e, StoryState: t, journeySeed: n } = await import("./StoryRunner-CwuWQZP-.js"), r = this.campaign, i = r ? r.state.story : new t(null);
		r || (i.seed = n()), this.story = new e({
			game: this,
			story: r?.story ?? null,
			state: i,
			levelId: r?.levelId ?? this._storyLevelId()
		}), r?.attachStory(this.story), this.engine.input.addBindings({ journal: ["KeyB"] });
		let { storyUIClasses: a } = await import("./storyUI-CljnAgtR.js");
		this.ui.useStoryUI(a()), this.ui.journal && (this.ui.journal.onSound = (e) => this.audio.playSfx(e, { volume: .5 }));
	}
	async ensureParty() {
		return this.party ? this.party : (this._partyLoad ??= (async () => {
			let [{ Party: e }, { partyUIClasses: t }] = await Promise.all([import("./Party-BkPkioRw.js"), import("./partyUI-DAOKNj5X.js")]);
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
		let e = this.party?.count ? [za] : [], t = this._keysOn(La), n = t.findIndex((e) => e.id === "map") + 1;
		return this.story ? Ba([
			...t.slice(0, n),
			Ra,
			...e,
			...t.slice(n)
		]) : Ba(e.length ? [
			...t.slice(0, n),
			...e,
			...t.slice(n)
		] : t);
	}
	_legendExtra() {
		return Ba([
			...this._togglesSplit() ? this._keysOn(La.filter((e) => [
				"time",
				"weather",
				"photo",
				"music"
			].includes(e.id))) : [],
			...this.story ? [Ra] : [],
			...this.party?.count ? [za] : []
		]);
	}
	_togglesSplit() {
		return !this.controls.time || !this.controls.weather;
	}
	_keysOn(e) {
		return e.filter((e) => (e.id !== "time" || this.controls.time) && (e.id !== "weather" || this.controls.weather));
	}
	_levelMusic() {
		return this.envNow.soundtrack ? { track: Bn(this.envNow, "explore") } : void 0;
	}
	primeLevelMusic(e, t) {
		let n = e?.environment ?? {}, r = [];
		if (n.music !== !1) {
			let t = Array.isArray(n.states) ? n.states.filter((e) => e?.soundtrack && typeof e.soundtrack == "object") : [];
			for (let i of [n, ...t.map((e) => ({ soundtrack: e.soundtrack }))]) r.push(Bn(i, "explore")), Sn(e) && (r.push(Bn(i, "battle")), e.objects.some((e) => e.type === "enemy" && !!Lt(_n, e.kind)?.boss) && r.push(Bn(i, "boss")));
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
		if (!r.count) return this.ui.hud.toast(L("game.toast.noParty"), 1.6), !1;
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
		return [Lr(this.level.name), Br(Cn(this.level, "subtitle"), this.level.subtitle, "title")];
	}
	_titleTexts() {
		let e = this.env.title ?? {}, t = this.level;
		return {
			title: e.title ? Br(Cn(t, "title.title"), e.title, "title") : Lr(t.name).toUpperCase(),
			subtitle: e.subtitle == null ? t.subtitle ? Br(Cn(t, "subtitle"), t.subtitle, "title") : L("game.default.subtitle") : Br(Cn(t, "title.subtitle"), e.subtitle, "title"),
			prompt: e.prompt ? Br(Cn(t, "title.prompt"), e.prompt, "title") : L("game.default.prompt"),
			credit: e.credit == null ? L("game.default.credit") : Br(Cn(t, "title.credit"), e.credit, "title")
		};
	}
	_examineText(e) {
		let t = e.text;
		return t?.lines?.length ? {
			speaker: t.speakerDefault ? L(`game.default.${t.speakerDefault}`) : Lr(t.speaker),
			lines: t.lines.map((e, n) => {
				if (typeof e != "string") return e;
				if (t.linesDefault) return L(`game.default.${t.linesDefault}`);
				if (!Array.isArray(t.keys)) return e;
				let r = t.keys[n];
				return Br(typeof r == "string" ? r : "", e);
			})
		} : {
			speaker: "",
			lines: [L("game.default.nothing")]
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
		return this.ui.hud.toast(Mt(e.id), 1.6), e.h;
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
		return this.ui.hud.toast(L(`game.toast.${this.weather.indoors ? "outside" : "weather"}.${e}`), 1.6), e;
	}
	setMusic(e) {
		return this.musicWanted = !!e, e ? this.audio.startMusic(this.combat ? { track: this.combat.musicTrack } : this._levelMusic()) : this.audio.stopMusic(), this.audio.musicPlaying;
	}
	togglePhotoMode({ instant: e = !1 } = {}) {
		return !this.photoMode && (this.busy || this.ui.dialog.isOpen || this.mode !== "play" || this.mapOpen || this.partyMenuOpen) ? this.photoMode : !this.photoMode && (this.combat?.engaged || this.combat?.locksPlayer) ? (this.ui.hud.toast(L("game.toast.foes"), 1.6), this.photoMode) : (this.photoMode = !this.photoMode, clearTimeout(this._photoTimer), this._timeouts.delete(this._photoTimer), this.photoMode ? (this.ui.prompt.hide(), e ? this.ui.setVisible(!1) : (this.ui.hud.toast(L("game.toast.photo"), 1.6), this._photoTimer = this._later(1.2, () => {
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
			this.campaign && this.env.clock === !1 || this.weather.setTime(8), this.campaign?.onRest(), this.story?.rested(e), this.audio.playSfx("chime", { volume: .6 }), await no(.7), await this.ui.fader.fadeIn(1.1), this.ui.hud.toast(L("game.toast.rested"), 2.2);
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
			let d = l ? u.interactPoint : u.position, f = l ? u.talkRadius ?? Ga : u.radius ?? Ga, p = d.x - e.x, m = d.z - e.z, h = Math.hypot(p, m);
			if (h > f || Math.abs(d.y - e.y) > 1.3) continue;
			let g = h > .001 ? (p * t.x + m * t.z) / h : 1, _ = l ? null : u.area, v = !!_ && e.x >= _.minX && e.x <= _.maxX && e.z >= _.minZ && e.z <= _.maxZ, y = h <= .55 || g >= .25 ? h - g * .7 : v ? h + .7 : Infinity;
			!l && u.storyEvent && (y -= .3);
			let b = l ? null : u.lookSpan;
			if (b) {
				let n = Ya(b, e.x, e.z), r = n.x - e.x, i = n.z - e.z, a = Math.hypot(r, i), o = a > .001 ? (r * t.x + i * t.z) / a : 1;
				o >= Ka && (y = Math.min(y, a - o * .7));
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
					let r = Ua(n);
					await n.talk({
						say: (e, t = {}) => {
							let i = t.speaker == null, a = {
								speaker: i ? Va(n) : Lr(t.speaker),
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
				let e = r.lookSpan ? Ya(r.lookSpan, this.player.position.x, this.player.position.z) : r.position;
				this.player.faceTowards(e.x, e.z), r.onInteract ? await r.onInteract(this, r) : (r.text?.sfx && r.text.lines?.length && this.audio.playSfx(r.text.sfx, { volume: .6 }), await this.ui.dialog.open(this._examineText(r)));
			}
		} catch (e) {
			this._disposed || console.error("[Luminati] interaction failed:", e);
		} finally {
			t === "npc" && n.endTalk(), this.busy = !1, this._talkCooldown = Qa;
		}
	}
	update(e) {
		if (this.mode === "travel") return;
		let { engine: t, ui: n, rig: r, player: i } = this, a = t.input, o = this.mode === "play", s = this.busy || n.dialog.isOpen;
		this._talkCooldown > 0 && (this._talkCooldown -= e, !s && a.actionPressed("confirm") && (this._talkCooldown = Math.max(this._talkCooldown, $a))), o && (a.actionPressed("debug") && n.debug.toggle(), this.mapOpen ? (a.actionPressed("map") || a.actionPressed("cancel")) && this.toggleMap(!1) : this.journalOpen ? (a.actionPressed("journal") || a.actionPressed("cancel")) && this.toggleJournal(!1) : this.partyMenuOpen ? (a.actionPressed("party") || a.actionPressed("cancel")) && (a.consumeAction?.("party"), this.togglePartyMenu(!1)) : !s && !this.photoMode && a.actionPressed("map") ? this.toggleMap(!0) : this.story && !s && !this.photoMode && a.actionPressed("journal") ? this.toggleJournal(!0) : this.party && !s && !this.photoMode && a.actionPressed("party") && (a.consumeAction?.("party"), this.togglePartyMenu(!0)));
		let c = this.mapOpen || this.journalOpen || this.partyMenuOpen;
		if (o && !c && (a.actionPressed("help") && n.hud.toggleHelp(), !s && ((a.actionPressed("photo") || this.photoMode && a.actionPressed("cancel")) && this.togglePhotoMode(), this.controls.time && a.actionPressed("time") && this.cycleTime(), this.controls.weather && a.actionPressed("weather") && this.cycleWeather(), a.actionPressed("music")))) {
			let e = this.setMusic(!this.audio.musicPlaying);
			n.hud.toast(L(e ? "game.toast.musicOn" : "game.toast.musicOff"), 1.4);
		}
		let l = this.combat, u = o && !s && !c && !this.photoMode, d = !u && o && !c && !this.photoMode && !!this.story?.run;
		i.frozen = !o || s || c || !!l && (this.photoMode || l.locksPlayer), l?.update(e, u, d), i.update(e, a), l?.afterPlayer(e, u, d), this.story?.update(e), o && !c && this.party?.update(e), i.setSilhouetteLevel(vt(1, .5, this.lighting.nightFactor));
		let f = !!this.story && (this.story.ownsCamera || this.rig.framed);
		(this.party || this.story) && i.fadeSilhouette(f || !!this.party?.coversPlayer, f ? 1 : e);
		let p = s ? i.talkSprite : null;
		if (o && !s && !this.photoMode && !c && !l?.locksPlayer) {
			let e = this._findInteractable();
			e ? (e.kind === "npc" ? (n.prompt.show(e.npc.sprite, L("game.prompt.talk"), { offsetY: e.npc.def.preset === "child" ? 1.9 : 2.35 }), p = e.npc.sprite) : n.prompt.show(e.it.prompt, Ha(e.it)), this._talkCooldown <= 0 && a.actionPressed("confirm") && (a.consumeAction?.("confirm"), this._interact(e))) : n.prompt.hide();
		} else s || n.prompt.hide();
		i.setTalkSilhouette(f ? null : p), this.campaign && o && this.campaign.update(e, { blocked: s || this.photoMode || c || !!l?.locksPlayer });
		let m = i.position, h = this._npcCtx, g = this._throttle;
		if (g) {
			g.frame++;
			let t = Math.max(Xa, r.distance * 1.15 + 4);
			g.far2 = t * t, this.critters.throttle && (this.critters.throttle.far2 = g.far2);
			let n = r.focusPoint;
			for (let t = 0; t < this.npcs.length; t++) {
				let r = this.npcs[t], i = (r.position.x - n.x) ** 2 + (r.position.z - n.z) ** 2;
				g.npcDt[t] += e, (i < g.far2 || r.talking || (g.frame + t) % g.every === 0) && (r.update(Math.min(g.npcDt[t], .25), h), g.npcDt[t] = 0);
			}
		} else for (let t = 0; t < this.npcs.length; t++) this.npcs[t].update(e, h);
		this.critters.update(e, this._critterCtx), r.inputEnabled = o && !s && !c, this.mode === "title" ? this._updateCinematic(e) : o && !this.story?.ownsCamera && this._updatePlayCamera(), r.update(e, a), this.spriteManager.update(e), this.blobs?.update();
		let _ = this.world.emitters.dust;
		_ && _.position.set(r.focusPoint.x, r.focusPoint.y + 1.2, r.focusPoint.z - 2), this.weather.zoomFog = F(((this.camera.distance - 7) / Math.max(1, r.distance - 7)) ** 2, .4, 1), this.weather.update(e), this.season?.update(e), l?.applyLook(e), this._warmFrames > 0 && (this._warmFrames--, this.weather.rain.intensity = 1, this.weather.snow.intensity = 1, this._warmFrames === 0 && (l?.endWarmup(), this._resolveWarm()));
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
			e.pitchTarget = (n && t.y > n.minY ? n.pitch : this.camera.pitch) * _t;
			let r = this.level.width, i = Math.min(9, r / 5), a = 5 / 9 * i, o = I(r - i, r - a, t.x), s = I(i, a, t.x);
			(o > 0 || s > 0) && (e.yawTarget = F(e.yawTarget, -(60 - 50 * s) * _t, (60 - 50 * o) * _t));
		}
		this._updateCameraBounds();
	}
	_updateCameraBounds() {
		let e = this.rig.distance, t = this.camera, { near: n, mid: r, far: i } = this.cameraBounds, a, o, s;
		e <= t.distance ? (a = n, o = r, s = F((e - t.minDistance) / Math.max(1e-6, t.distance - t.minDistance))) : (a = r, o = i, s = F((e - t.distance) / Math.max(1e-6, t.maxDistance - t.distance)));
		let c = this.rig.bounds;
		c.minX = vt(a.minX, o.minX, s), c.maxX = vt(a.maxX, o.maxX, s), c.minZ = vt(a.minZ, o.minZ, s), c.maxZ = vt(a.maxZ, o.maxZ, s);
	}
	_playerFocusDistance() {
		let e = this.player.position, t = this.engine.camera, n = this._focusPos.set(e.x, e.y + .9, e.z).applyMatrix4(t.matrixWorldInverse);
		return Math.max(1, -n.z);
	}
	_updateCinematic(e) {
		let t = this._cine;
		t.t += e;
		let n = t.t * .045;
		t.target.set(t.x + Math.sin(n) * t.driftX, t.y, t.z + Math.sin(n * .7 + 1) * t.driftZ), this.rig.yawTarget = Math.sin(t.t * .05) * 18 * _t, this.rig.distanceTarget = t.distance + Math.sin(t.t * .07) * 3;
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
		if (n && (n.name !== this.region && (this.region = n.name, this.ui.hud.setLocation(Lr(n.name), n.sub ? Br(Cn(n, "sub"), n.sub, "title") : Lr(this.level.name))), n.banner && !this._bannersShown.has(n.name) && !this.story?.run)) {
			this._bannersShown.add(n.name);
			let e = Lr(n.name);
			this.ui.banner.show(e, Br(Cn(n, "banner"), n.banner, "title"), { duration: 2.6 }), this._regionBanner = {
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
				yaw: +(this.rig.yaw / _t).toFixed(1),
				pitch: +(this.rig.pitch / _t).toFixed(1),
				distance: +this.rig.distance.toFixed(2),
				focus: this.rig.focusPoint.toArray().map((e) => +e.toFixed(2))
			},
			inventory: { ...this.inventory },
			lang: kn(),
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
};
//#endregion
//#region node_modules/three/examples/jsm/utils/SkeletonUtils.js
function fo(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = e.clone();
	return po(e, r, function(e, r) {
		t.set(r, e), n.set(e, r);
	}), r.traverse(function(e) {
		if (!e.isSkinnedMesh) return;
		let r = e, i = t.get(e), a = i.skeleton.bones;
		r.skeleton = i.skeleton.clone(), r.bindMatrix.copy(i.bindMatrix), r.skeleton.bones = a.map(function(e) {
			return n.get(e);
		}), r.bind(r.skeleton, r.bindMatrix);
	}), r;
}
function po(e, t, n) {
	n(e, t);
	for (let r = 0; r < e.children.length; r++) po(e.children[r], t.children[r], n);
}
//#endregion
//#region node_modules/three/examples/jsm/loaders/GLTFLoader.js
var mo = class extends Te {
	constructor(e) {
		super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(e) {
			return new yo(e);
		}), this.register(function(e) {
			return new bo(e);
		}), this.register(function(e) {
			return new ko(e);
		}), this.register(function(e) {
			return new Ao(e);
		}), this.register(function(e) {
			return new jo(e);
		}), this.register(function(e) {
			return new So(e);
		}), this.register(function(e) {
			return new Co(e);
		}), this.register(function(e) {
			return new wo(e);
		}), this.register(function(e) {
			return new To(e);
		}), this.register(function(e) {
			return new vo(e);
		}), this.register(function(e) {
			return new Eo(e);
		}), this.register(function(e) {
			return new xo(e);
		}), this.register(function(e) {
			return new Oo(e);
		}), this.register(function(e) {
			return new Do(e);
		}), this.register(function(e) {
			return new go(e);
		}), this.register(function(e) {
			return new Mo(e, z.EXT_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new Mo(e, z.KHR_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new No(e);
		});
	}
	load(e, t, n, r) {
		let i = this, a;
		if (this.resourcePath !== "") a = this.resourcePath;
		else if (this.path !== "") {
			let t = Ue.extractUrlBase(e);
			a = Ue.resolveURL(t, this.path);
		} else a = Ue.extractUrlBase(e);
		this.manager.itemStart(e);
		let o = function(t) {
			r ? r(t) : console.error(t), i.manager.itemError(e), i.manager.itemEnd(e);
		}, s = new g(this.manager);
		s.setPath(this.path), s.setResponseType("arraybuffer"), s.setRequestHeader(this.requestHeader), s.setWithCredentials(this.withCredentials), s.load(e, function(n) {
			try {
				i.parse(n, a, function(n) {
					t(n), i.manager.itemEnd(e);
				}, o);
			} catch (e) {
				o(e);
			}
		}, n, o);
	}
	setDRACOLoader(e) {
		return this.dracoLoader = e, this;
	}
	setKTX2Loader(e) {
		return this.ktx2Loader = e, this;
	}
	setMeshoptDecoder(e) {
		return this.meshoptDecoder = e, this;
	}
	register(e) {
		return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
	}
	unregister(e) {
		return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
	}
	parse(e, t, n, r) {
		let i, a = {}, o = {}, s = new TextDecoder();
		if (typeof e == "string") i = JSON.parse(e);
		else if (e instanceof ArrayBuffer) {
			if (s.decode(new Uint8Array(e, 0, 4)) === Po) {
				try {
					a[z.KHR_BINARY_GLTF] = new Lo(e);
				} catch (e) {
					r && r(e);
					return;
				}
				i = JSON.parse(a[z.KHR_BINARY_GLTF].content);
			} else i = JSON.parse(s.decode(e));
		} else i = e;
		if (i.asset === void 0 || i.asset.version[0] < 2) {
			r && r(/* @__PURE__ */ Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
			return;
		}
		let c = new ls(i, {
			path: t || this.resourcePath || "",
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder
		});
		c.fileLoader.setRequestHeader(this.requestHeader);
		for (let e = 0; e < this.pluginCallbacks.length; e++) {
			let t = this.pluginCallbacks[e](c);
			t.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), o[t.name] = t, a[t.name] = !0;
		}
		if (i.extensionsUsed) for (let e = 0; e < i.extensionsUsed.length; ++e) {
			let t = i.extensionsUsed[e], n = i.extensionsRequired || [];
			switch (t) {
				case z.KHR_MATERIALS_UNLIT:
					a[t] = new _o();
					break;
				case z.KHR_DRACO_MESH_COMPRESSION:
					a[t] = new Ro(i, this.dracoLoader);
					break;
				case z.KHR_TEXTURE_TRANSFORM:
					a[t] = new zo();
					break;
				case z.KHR_MESH_QUANTIZATION:
					a[t] = new Bo();
					break;
				default: n.indexOf(t) >= 0 && o[t] === void 0 && console.warn("THREE.GLTFLoader: Unknown extension \"" + t + "\".");
			}
		}
		c.setExtensions(a), c.setPlugins(o), c.parse(n, r);
	}
	parseAsync(e, t) {
		let n = this;
		return new Promise(function(r, i) {
			n.parse(e, t, r, i);
		});
	}
};
function ho() {
	let e = {};
	return {
		get: function(t) {
			return e[t];
		},
		add: function(t, n) {
			e[t] = n;
		},
		remove: function(t) {
			delete e[t];
		},
		removeAll: function() {
			e = {};
		}
	};
}
function R(e, t, n) {
	let r = e.json.materials[t];
	return r.extensions && r.extensions[n] ? r.extensions[n] : null;
}
var z = {
	KHR_BINARY_GLTF: "KHR_binary_glTF",
	KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
	KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
	KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
	KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
	KHR_MATERIALS_IOR: "KHR_materials_ior",
	KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
	KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
	KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
	KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
	KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
	KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
	KHR_MATERIALS_VOLUME: "KHR_materials_volume",
	KHR_TEXTURE_BASISU: "KHR_texture_basisu",
	KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
	KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
	KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
	EXT_MATERIALS_BUMP: "EXT_materials_bump",
	EXT_TEXTURE_WEBP: "EXT_texture_webp",
	EXT_TEXTURE_AVIF: "EXT_texture_avif",
	EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
	KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
	EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
}, go = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_LIGHTS_PUNCTUAL, this.cache = {
			refs: {},
			uses: {}
		};
	}
	_markDefs() {
		let e = this.parser, t = this.parser.json.nodes || [];
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n];
			r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
		}
	}
	_loadLight(e) {
		let t = this.parser, n = "light:" + e, i = t.cache.get(n);
		if (i) return i;
		let a = t.json, o = ((a.extensions && a.extensions[this.name] || {}).lights || [])[e], s, c = new j(16777215);
		o.color !== void 0 && c.setRGB(o.color[0], o.color[1], o.color[2], Qe);
		let l = o.range === void 0 ? 0 : o.range;
		switch (o.type) {
			case "directional":
				s = new r(c), s.target.position.set(0, 0, -1), s.add(s.target);
				break;
			case "point":
				s = new _(c), s.distance = l;
				break;
			case "spot":
				s = new v(c), s.distance = l, o.spot = o.spot || {}, o.spot.innerConeAngle = o.spot.innerConeAngle === void 0 ? 0 : o.spot.innerConeAngle, o.spot.outerConeAngle = o.spot.outerConeAngle === void 0 ? Math.PI / 4 : o.spot.outerConeAngle, s.angle = o.spot.outerConeAngle, s.penumbra = 1 - o.spot.innerConeAngle / o.spot.outerConeAngle, s.target.position.set(0, 0, -1), s.add(s.target);
				break;
			default: throw Error("THREE.GLTFLoader: Unexpected light type: " + o.type);
		}
		return s.position.set(0, 0, 0), ts(s, o), o.intensity !== void 0 && (s.intensity = o.intensity), s.name = t.createUniqueName(o.name || "light_" + e), i = Promise.resolve(s), t.cache.add(n, i), i;
	}
	getDependency(e, t) {
		if (e === "light") return this._loadLight(t);
	}
	createNodeAttachment(e) {
		let t = this, n = this.parser, r = n.json.nodes[e], i = (r.extensions && r.extensions[this.name] || {}).light;
		return i === void 0 ? null : this._loadLight(i).then(function(e) {
			return n._getNodeRef(t.cache, i, e);
		});
	}
}, _o = class {
	constructor() {
		this.name = z.KHR_MATERIALS_UNLIT;
	}
	getMaterialType() {
		return et;
	}
	extendParams(e, t, n) {
		let r = [];
		e.color = new j(1, 1, 1), e.opacity = 1;
		let i = t.pbrMetallicRoughness;
		if (i) {
			if (Array.isArray(i.baseColorFactor)) {
				let t = i.baseColorFactor;
				e.color.setRGB(t[0], t[1], t[2], Qe), e.opacity = t[3];
			}
			i.baseColorTexture !== void 0 && r.push(n.assignTexture(e, "map", i.baseColorTexture, D));
		}
		return Promise.all(r);
	}
}, vo = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_MATERIALS_EMISSIVE_STRENGTH;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		return n === null || n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength), Promise.resolve();
	}
}, yo = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_MATERIALS_CLEARCOAT;
	}
	getMaterialType(e) {
		return R(this.parser, e, this.name) === null ? null : s;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor), n.clearcoatTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)), n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor), n.clearcoatRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)), n.clearcoatNormalTexture !== void 0 && (r.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)), n.clearcoatNormalTexture.scale !== void 0)) {
			let e = n.clearcoatNormalTexture.scale;
			t.clearcoatNormalScale = new Ze(e, e);
		}
		return Promise.all(r);
	}
}, bo = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_MATERIALS_DISPERSION;
	}
	getMaterialType(e) {
		return R(this.parser, e, this.name) === null ? null : s;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		return n === null || (t.dispersion = n.dispersion === void 0 ? 0 : n.dispersion), Promise.resolve();
	}
}, xo = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_MATERIALS_IRIDESCENCE;
	}
	getMaterialType(e) {
		return R(this.parser, e, this.name) === null ? null : s;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor), n.iridescenceTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)), n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = n.iridescenceThicknessMinimum), n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = n.iridescenceThicknessMaximum), n.iridescenceThicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)), Promise.all(r);
	}
}, So = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_MATERIALS_SHEEN;
	}
	getMaterialType(e) {
		return R(this.parser, e, this.name) === null ? null : s;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (t.sheenColor = new j(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, n.sheenColorFactor !== void 0) {
			let e = n.sheenColorFactor;
			t.sheenColor.setRGB(e[0], e[1], e[2], Qe);
		}
		return n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor), n.sheenColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, D)), n.sheenRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)), Promise.all(r);
	}
}, Co = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_MATERIALS_TRANSMISSION;
	}
	getMaterialType(e) {
		return R(this.parser, e, this.name) === null ? null : s;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor), n.transmissionTexture !== void 0 && r.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)), Promise.all(r);
	}
}, wo = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_MATERIALS_VOLUME;
	}
	getMaterialType(e) {
		return R(this.parser, e, this.name) === null ? null : s;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.thickness = n.thicknessFactor === void 0 ? 0 : n.thicknessFactor, n.thicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "thicknessMap", n.thicknessTexture)), t.attenuationDistance = n.attenuationDistance || Infinity;
		let i = n.attenuationColor || [
			1,
			1,
			1
		];
		return t.attenuationColor = new j().setRGB(i[0], i[1], i[2], Qe), Promise.all(r);
	}
}, To = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_MATERIALS_IOR;
	}
	getMaterialType(e) {
		return R(this.parser, e, this.name) === null ? null : s;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		return n === null ? Promise.resolve() : (t.ior = n.ior === void 0 ? 1.5 : n.ior, t.ior === 0 && (t.ior = 1e3), Promise.resolve());
	}
}, Eo = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_MATERIALS_SPECULAR;
	}
	getMaterialType(e) {
		return R(this.parser, e, this.name) === null ? null : s;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.specularIntensity = n.specularFactor === void 0 ? 1 : n.specularFactor, n.specularTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularIntensityMap", n.specularTexture));
		let i = n.specularColorFactor || [
			1,
			1,
			1
		];
		return t.specularColor = new j().setRGB(i[0], i[1], i[2], Qe), n.specularColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, D)), Promise.all(r);
	}
}, Do = class {
	constructor(e) {
		this.parser = e, this.name = z.EXT_MATERIALS_BUMP;
	}
	getMaterialType(e) {
		return R(this.parser, e, this.name) === null ? null : s;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return t.bumpScale = n.bumpFactor === void 0 ? 1 : n.bumpFactor, n.bumpTexture !== void 0 && r.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)), Promise.all(r);
	}
}, Oo = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_MATERIALS_ANISOTROPY;
	}
	getMaterialType(e) {
		return R(this.parser, e, this.name) === null ? null : s;
	}
	extendMaterialParams(e, t) {
		let n = R(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength), n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation), n.anisotropyTexture !== void 0 && r.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)), Promise.all(r);
	}
}, ko = class {
	constructor(e) {
		this.parser = e, this.name = z.KHR_TEXTURE_BASISU;
	}
	loadTexture(e) {
		let t = this.parser, n = t.json, r = n.textures[e];
		if (!r.extensions || !r.extensions[this.name]) return null;
		let i = r.extensions[this.name], a = t.options.ktx2Loader;
		if (!a) {
			if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
			return null;
		}
		return t.loadTextureImage(e, i.source, a);
	}
}, Ao = class {
	constructor(e) {
		this.parser = e, this.name = z.EXT_TEXTURE_WEBP;
	}
	loadTexture(e) {
		let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
		if (!i.extensions || !i.extensions[t]) return null;
		let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
		if (o.uri) {
			let e = n.options.manager.getHandler(o.uri);
			e !== null && (s = e);
		}
		return n.loadTextureImage(e, a.source, s);
	}
}, jo = class {
	constructor(e) {
		this.parser = e, this.name = z.EXT_TEXTURE_AVIF;
	}
	loadTexture(e) {
		let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
		if (!i.extensions || !i.extensions[t]) return null;
		let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
		if (o.uri) {
			let e = n.options.manager.getHandler(o.uri);
			e !== null && (s = e);
		}
		return n.loadTextureImage(e, a.source, s);
	}
}, Mo = class {
	constructor(e, t) {
		this.name = t, this.parser = e;
	}
	loadBufferView(e) {
		let t = this.parser.json, n = t.bufferViews[e];
		if (n.extensions && n.extensions[this.name]) {
			let e = n.extensions[this.name], r = this.parser.getDependency("buffer", e.buffer), i = this.parser.options.meshoptDecoder;
			if (!i || !i.supported) {
				if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
				return null;
			}
			return r.then(function(t) {
				let n = e.byteOffset || 0, r = e.byteLength || 0, a = e.count, o = e.byteStride, s = new Uint8Array(t, n, r);
				return i.decodeGltfBufferAsync ? i.decodeGltfBufferAsync(a, o, s, e.mode, e.filter).then(function(e) {
					return e.buffer;
				}) : i.ready.then(function() {
					let t = new ArrayBuffer(a * o);
					return i.decodeGltfBuffer(new Uint8Array(t), a, o, s, e.mode, e.filter), t;
				});
			});
		}
		return null;
	}
}, No = class {
	constructor(e) {
		this.name = z.EXT_MESH_GPU_INSTANCING, this.parser = e;
	}
	createNodeMesh(e) {
		let t = this.parser.json, n = t.nodes[e];
		if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
		let r = t.meshes[n.mesh];
		for (let e of r.primitives) if (e.mode !== Wo.TRIANGLES && e.mode !== Wo.TRIANGLE_STRIP && e.mode !== Wo.TRIANGLE_FAN && e.mode !== void 0) return null;
		let a = n.extensions[this.name].attributes, s = [], c = {};
		for (let e in a) s.push(this.parser.getDependency("accessor", a[e]).then((t) => (c[e] = t, c[e])));
		return s.length < 1 ? null : (s.push(this.parser.createNodeMesh(e)), Promise.all(s).then((e) => {
			let t = e.pop(), n = t.isGroup ? t.children : [t], r = e[0].count, a = [];
			for (let e of n) {
				let t = new ge(), n = new A(), s = new o(), l = new A(1, 1, 1), u = new fe(e.geometry, e.material, r);
				for (let e = 0; e < r; e++) c.TRANSLATION && n.fromBufferAttribute(c.TRANSLATION, e), c.ROTATION && s.fromBufferAttribute(c.ROTATION, e), c.SCALE && l.fromBufferAttribute(c.SCALE, e), u.setMatrixAt(e, t.compose(n, s, l));
				let d = null;
				for (let e in c) if (e === "_COLOR_0") {
					let t = c[e];
					u.instanceColor = new We(t.array, t.itemSize, t.normalized);
				} else if (e !== "TRANSLATION" && e !== "ROTATION" && e !== "SCALE") {
					if (d === null) {
						let e = u.geometry;
						d = new Pe(), d.name = e.name;
						for (let t in e.attributes) d.setAttribute(t, e.attributes[t]);
						for (let t in e.morphAttributes) d.morphAttributes[t] = e.morphAttributes[t];
						e.index !== null && d.setIndex(e.index), d.morphTargetsRelative = e.morphTargetsRelative;
						for (let t of e.groups) d.addGroup(t.start, t.count, t.materialIndex);
						e.boundingBox !== null && (d.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (d.boundingSphere = e.boundingSphere.clone()), d.drawRange.start = e.drawRange.start, d.drawRange.count = e.drawRange.count, d.userData = Object.assign({}, e.userData), u.geometry = d;
					}
					let t = c[e];
					d.setAttribute(e, new We(t.array, t.itemSize, t.normalized));
				}
				i.prototype.copy.call(u, e), this.parser.assignFinalMaterial(u), a.push(u);
			}
			return t.isGroup ? (t.clear(), t.add(...a), t) : a[0];
		}));
	}
}, Po = "glTF", Fo = 12, Io = {
	JSON: 1313821514,
	BIN: 5130562
}, Lo = class {
	constructor(e) {
		this.name = z.KHR_BINARY_GLTF, this.content = null, this.body = null;
		let t = new DataView(e, 0, Fo), n = new TextDecoder();
		if (this.header = {
			magic: n.decode(new Uint8Array(e.slice(0, 4))),
			version: t.getUint32(4, !0),
			length: t.getUint32(8, !0)
		}, this.header.magic !== Po) throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
		if (this.header.version < 2) throw Error("THREE.GLTFLoader: Legacy binary file detected.");
		let r = this.header.length - Fo, i = new DataView(e, Fo), a = 0;
		for (; a < r;) {
			let t = i.getUint32(a, !0);
			a += 4;
			let r = i.getUint32(a, !0);
			if (a += 4, r === Io.JSON) {
				let r = new Uint8Array(e, Fo + a, t);
				this.content = n.decode(r);
			} else if (r === Io.BIN) {
				let n = Fo + a;
				this.body = e.slice(n, n + t);
			}
			a += t;
		}
		if (this.content === null) throw Error("THREE.GLTFLoader: JSON content not found.");
	}
}, Ro = class {
	constructor(e, t) {
		if (!t) throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
		this.name = z.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
	}
	decodePrimitive(e, t) {
		let n = this.json, r = this.dracoLoader, i = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, s = {}, c = {};
		for (let e in a) {
			let t = Yo[e] || e.toLowerCase();
			o[t] = a[e];
		}
		for (let t in e.attributes) {
			let r = Yo[t] || t.toLowerCase();
			if (a[t] !== void 0) {
				let i = n.accessors[e.attributes[t]];
				c[r] = Go[i.componentType].name, s[r] = i.normalized === !0;
			}
		}
		return t.getDependency("bufferView", i).then(function(e) {
			return new Promise(function(t, n) {
				r.decodeDracoFile(e, function(e) {
					for (let t in e.attributes) {
						let n = e.attributes[t], r = s[t];
						r !== void 0 && (n.normalized = r);
					}
					t(e);
				}, o, c, Qe, n);
			});
		});
	}
}, zo = class {
	constructor() {
		this.name = z.KHR_TEXTURE_TRANSFORM;
	}
	extendTexture(e, t) {
		if ((t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0) return e;
		if (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), t.rotation !== void 0) {
			let t = Math.cos(e.rotation), n = Math.sin(e.rotation);
			e.matrix.set(e.repeat.x * t, e.repeat.y * n, e.offset.x, -e.repeat.x * n, e.repeat.y * t, e.offset.y, 0, 0, 1), e.matrixAutoUpdate = !1;
		}
		return e.needsUpdate = !0, e;
	}
}, Bo = class {
	constructor() {
		this.name = z.KHR_MESH_QUANTIZATION;
	}
}, Vo = class extends t {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	copySampleValue_(e) {
		let t = this.resultBuffer, n = this.sampleValues, r = this.valueSize, i = e * r * 3 + r;
		for (let e = 0; e !== r; e++) t[e] = n[i + e];
		return t;
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = o * 2, c = o * 3, l = r - t, u = (n - t) / l, d = u * u, f = d * u, p = e * c, m = p - c, h = -2 * f + 3 * d, g = f - d, _ = 1 - h, v = g - d + u;
		for (let e = 0; e !== o; e++) {
			let t = a[m + e + o], n = a[m + e + s] * l, r = a[p + e + o], c = a[p + e] * l;
			i[e] = _ * t + v * n + h * r + g * c;
		}
		return i;
	}
}, Ho = new o(), Uo = class extends Vo {
	interpolate_(e, t, n, r) {
		let i = super.interpolate_(e, t, n, r);
		return Ho.fromArray(i).normalize().toArray(i), i;
	}
}, Wo = {
	FLOAT: 5126,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
}, Go = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
}, Ko = {
	9728: l,
	9729: Je,
	9984: ne,
	9985: Fe,
	9986: c,
	9987: be
}, qo = {
	33071: De,
	33648: se,
	10497: je
}, Jo = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT2: 4,
	MAT3: 9,
	MAT4: 16
}, Yo = {
	POSITION: "position",
	NORMAL: "normal",
	TANGENT: "tangent",
	TEXCOORD_0: "uv",
	TEXCOORD_1: "uv1",
	TEXCOORD_2: "uv2",
	TEXCOORD_3: "uv3",
	COLOR_0: "color",
	WEIGHTS_0: "skinWeight",
	JOINTS_0: "skinIndex"
}, Xo = {
	scale: "scale",
	translation: "position",
	rotation: "quaternion",
	weights: "morphTargetInfluences"
}, Zo = {
	CUBICSPLINE: void 0,
	LINEAR: Xe,
	STEP: Se
}, Qo = {
	OPAQUE: "OPAQUE",
	MASK: "MASK",
	BLEND: "BLEND"
};
function $o(e) {
	return e.DefaultMaterial === void 0 && (e.DefaultMaterial = new P({
		color: 16777215,
		emissive: 0,
		metalness: 1,
		roughness: 1,
		transparent: !1,
		depthTest: !0,
		side: 0
	})), e.DefaultMaterial;
}
function es(e, t, n) {
	for (let r in n.extensions) e[r] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[r] = n.extensions[r]);
}
function ts(e, t) {
	t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function ns(e, t, n) {
	let r = !1, i = !1, a = !1;
	for (let e = 0, n = t.length; e < n; e++) {
		let n = t[e];
		if (n.POSITION !== void 0 && (r = !0), n.NORMAL !== void 0 && (i = !0), n.COLOR_0 !== void 0 && (a = !0), r && i && a) break;
	}
	if (!r && !i && !a) return Promise.resolve(e);
	let o = [], s = [], c = [];
	for (let l = 0, u = t.length; l < u; l++) {
		let u = t[l];
		if (r) {
			let t = u.POSITION === void 0 ? e.attributes.position : n.getDependency("accessor", u.POSITION);
			o.push(t);
		}
		if (i) {
			let t = u.NORMAL === void 0 ? e.attributes.normal : n.getDependency("accessor", u.NORMAL);
			s.push(t);
		}
		if (a) {
			let t = u.COLOR_0 === void 0 ? e.attributes.color : n.getDependency("accessor", u.COLOR_0);
			c.push(t);
		}
	}
	return Promise.all([
		Promise.all(o),
		Promise.all(s),
		Promise.all(c)
	]).then(function(t) {
		let n = t[0], o = t[1], s = t[2];
		return r && (e.morphAttributes.position = n), i && (e.morphAttributes.normal = o), a && (e.morphAttributes.color = s), e.morphTargetsRelative = !0, e;
	});
}
function rs(e, t) {
	if (e.updateMorphTargets(), t.weights !== void 0) for (let n = 0, r = t.weights.length; n < r; n++) e.morphTargetInfluences[n] = t.weights[n];
	if (t.extras && Array.isArray(t.extras.targetNames)) {
		let n = t.extras.targetNames;
		if (e.morphTargetInfluences.length === n.length) {
			e.morphTargetDictionary = {};
			for (let t = 0, r = n.length; t < r; t++) e.morphTargetDictionary[n[t]] = t;
		} else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
	}
}
function is(e) {
	let t, n = e.extensions && e.extensions[z.KHR_DRACO_MESH_COMPRESSION];
	if (t = n ? "draco:" + n.bufferView + ":" + n.indices + ":" + as(n.attributes) : e.indices + ":" + as(e.attributes) + ":" + e.mode, e.targets !== void 0) for (let n = 0, r = e.targets.length; n < r; n++) t += ":" + as(e.targets[n]);
	return t;
}
function as(e) {
	let t = "", n = Object.keys(e).sort();
	for (let r = 0, i = n.length; r < i; r++) t += n[r] + ":" + e[n[r]] + ";";
	return t;
}
function os(e) {
	switch (e) {
		case Int8Array: return 1 / 127;
		case Uint8Array: return 1 / 255;
		case Int16Array: return 1 / 32767;
		case Uint16Array: return 1 / 65535;
		default: throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
	}
}
function ss(e) {
	return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0 ? "image/webp" : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
var cs = new ge(), ls = class {
	constructor(e = {}, t = {}) {
		this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new ho(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = {
			refs: {},
			uses: {}
		}, this.cameraCache = {
			refs: {},
			uses: {}
		}, this.lightCache = {
			refs: {},
			uses: {}
		}, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
		let n = !1, r = -1, i = !1, a = -1;
		if (typeof navigator < "u" && navigator.userAgent !== void 0) {
			let e = navigator.userAgent;
			n = /^((?!chrome|android).)*safari/i.test(e) === !0;
			let t = e.match(/Version\/(\d+)/);
			r = n && t ? parseInt(t[1], 10) : -1, i = e.indexOf("Firefox") > -1, a = i ? e.match(/Firefox\/([0-9]+)\./)[1] : -1;
		}
		this.textureLoader = typeof createImageBitmap > "u" || n && r < 17 || i && a < 98 ? new de(this.options.manager) : new b(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new g(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
	}
	setExtensions(e) {
		this.extensions = e;
	}
	setPlugins(e) {
		this.plugins = e;
	}
	parse(e, t) {
		let n = this, r = this.json, i = this.extensions;
		this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(e) {
			return e._markDefs && e._markDefs();
		}), Promise.all(this._invokeAll(function(e) {
			return e.beforeRoot && e.beforeRoot();
		})).then(function() {
			return Promise.all([
				n.getDependencies("scene"),
				n.getDependencies("animation"),
				n.getDependencies("camera")
			]);
		}).then(function(t) {
			let a = {
				scene: t[0][r.scene || 0],
				scenes: t[0],
				animations: t[1],
				cameras: t[2],
				asset: r.asset,
				parser: n,
				userData: {}
			};
			return es(i, a, r), ts(a, r), Promise.all(n._invokeAll(function(e) {
				return e.afterRoot && e.afterRoot(a);
			})).then(function() {
				for (let e of a.scenes) e.updateMatrixWorld();
				e(a);
			});
		}).catch(t);
	}
	_markDefs() {
		let e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n].joints;
			for (let t = 0, n = r.length; t < n; t++) e[r[t]].isBone = !0;
		}
		for (let t = 0, r = e.length; t < r; t++) {
			let r = e[t];
			r.mesh !== void 0 && (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (n[r.mesh].isSkinnedMesh = !0)), r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera);
		}
	}
	_addNodeRef(e, t) {
		t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
	}
	_getNodeRef(e, t, n) {
		if (e.refs[t] <= 1) return n;
		let r = n.clone(), i = (e, t) => {
			let n = this.associations.get(e);
			n != null && this.associations.set(t, n);
			for (let [n, r] of e.children.entries()) i(r, t.children[n]);
		};
		return i(n, r), r.name += "_instance_" + e.uses[t]++, r;
	}
	_invokeOne(e) {
		let t = Object.values(this.plugins);
		t.push(this);
		for (let n = 0; n < t.length; n++) {
			let r = e(t[n]);
			if (r) return r;
		}
		return null;
	}
	_invokeAll(e) {
		let t = Object.values(this.plugins);
		t.unshift(this);
		let n = [];
		for (let r = 0; r < t.length; r++) {
			let i = e(t[r]);
			i && n.push(i);
		}
		return n;
	}
	getDependency(e, t) {
		let n = e + ":" + t, r = this.cache.get(n);
		if (!r) {
			switch (e) {
				case "scene":
					r = this.loadScene(t);
					break;
				case "node":
					r = this._invokeOne(function(e) {
						return e.loadNode && e.loadNode(t);
					});
					break;
				case "mesh":
					r = this._invokeOne(function(e) {
						return e.loadMesh && e.loadMesh(t);
					});
					break;
				case "accessor":
					r = this.loadAccessor(t);
					break;
				case "bufferView":
					r = this._invokeOne(function(e) {
						return e.loadBufferView && e.loadBufferView(t);
					});
					break;
				case "buffer":
					r = this.loadBuffer(t);
					break;
				case "material":
					r = this._invokeOne(function(e) {
						return e.loadMaterial && e.loadMaterial(t);
					});
					break;
				case "texture":
					r = this._invokeOne(function(e) {
						return e.loadTexture && e.loadTexture(t);
					});
					break;
				case "skin":
					r = this.loadSkin(t);
					break;
				case "animation":
					r = this._invokeOne(function(e) {
						return e.loadAnimation && e.loadAnimation(t);
					});
					break;
				case "camera":
					r = this.loadCamera(t);
					break;
				default: if (r = this._invokeOne(function(n) {
					return n != this && n.getDependency && n.getDependency(e, t);
				}), !r) throw Error("Unknown type: " + e);
			}
			this.cache.add(n, r);
		}
		return r;
	}
	getDependencies(e) {
		let t = this.cache.get(e);
		if (!t) {
			let n = this, r = this.json[e + (e === "mesh" ? "es" : "s")] || [];
			t = Promise.all(r.map(function(t, r) {
				return n.getDependency(e, r);
			})), this.cache.add(e, t);
		}
		return t;
	}
	loadBuffer(e) {
		let t = this.json.buffers[e], n = this.fileLoader;
		if (t.type && t.type !== "arraybuffer") throw Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
		if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[z.KHR_BINARY_GLTF].body);
		let r = this.options;
		return new Promise(function(e, i) {
			n.load(Ue.resolveURL(t.uri, r.path), e, void 0, function() {
				i(/* @__PURE__ */ Error("THREE.GLTFLoader: Failed to load buffer \"" + t.uri + "\"."));
			});
		});
	}
	loadBufferView(e) {
		let t = this.json.bufferViews[e];
		return this.getDependency("buffer", t.buffer).then(function(e) {
			let n = t.byteLength || 0, r = t.byteOffset || 0;
			return e.slice(r, r + n);
		});
	}
	loadAccessor(e) {
		let t = this, n = this.json, r = this.json.accessors[e];
		if (r.bufferView === void 0 && r.sparse === void 0) {
			let e = Jo[r.type], t = Go[r.componentType], n = r.normalized === !0, i = new t(r.count * e);
			return Promise.resolve(new ye(i, e, n));
		}
		let i = [];
		return r.bufferView === void 0 ? i.push(null) : i.push(this.getDependency("bufferView", r.bufferView)), r.sparse !== void 0 && (i.push(this.getDependency("bufferView", r.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", r.sparse.values.bufferView))), Promise.all(i).then(function(e) {
			let i = e[0], a = Jo[r.type], o = Go[r.componentType], s = o.BYTES_PER_ELEMENT, c = s * a, l = r.byteOffset || 0, u = r.bufferView === void 0 ? void 0 : n.bufferViews[r.bufferView].byteStride, d = r.normalized === !0, f, p;
			if (u && u !== c) {
				let e = Math.floor(l / u), n = "InterleavedBuffer:" + r.bufferView + ":" + r.componentType + ":" + e + ":" + r.count, c = t.cache.get(n);
				c || (f = new o(i, e * u, r.count * u / s), c = new me(f, u / s), t.cache.add(n, c)), p = new re(c, a, l % u / s, d);
			} else f = i === null ? new o(r.count * a) : new o(i, l, r.count * a), p = new ye(f, a, d);
			if (r.sparse !== void 0) {
				let t = Jo.SCALAR, n = Go[r.sparse.indices.componentType], s = r.sparse.indices.byteOffset || 0, c = r.sparse.values.byteOffset || 0, l = new n(e[1], s, r.sparse.count * t), u = new o(e[2], c, r.sparse.count * a);
				i !== null && (p = new ye(p.array.slice(), p.itemSize, p.normalized)), p.normalized = !1;
				for (let e = 0, t = l.length; e < t; e++) {
					let t = l[e];
					if (p.setX(t, u[e * a]), a >= 2 && p.setY(t, u[e * a + 1]), a >= 3 && p.setZ(t, u[e * a + 2]), a >= 4 && p.setW(t, u[e * a + 3]), a >= 5) throw Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
				}
				p.normalized = d;
			}
			return p;
		});
	}
	loadTexture(e) {
		let t = this.json, n = this.options, r = t.textures[e].source, i = t.images[r], a = this.textureLoader;
		if (i.uri) {
			let e = n.manager.getHandler(i.uri);
			e !== null && (a = e);
		}
		return this.loadTextureImage(e, r, a);
	}
	loadTextureImage(e, t, n) {
		let r = this, i = this.json, a = i.textures[e], o = i.images[t], s = (o.uri || o.bufferView) + ":" + a.sampler;
		if (this.textureCache[s]) return this.textureCache[s];
		let c = this.loadImageSource(t, n).then(function(t) {
			t.flipY = !1, t.name = a.name || o.name || "", t.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === !1 && (t.name = o.uri);
			let n = (i.samplers || {})[a.sampler] || {};
			return t.magFilter = Ko[n.magFilter] || 1006, t.minFilter = Ko[n.minFilter] || 1008, t.wrapS = qo[n.wrapS] || 1e3, t.wrapT = qo[n.wrapT] || 1e3, t.generateMipmaps = !t.isCompressedTexture && t.minFilter !== 1003 && t.minFilter !== 1006, r.associations.set(t, { textures: e }), t;
		}).catch(function() {
			return null;
		});
		return this.textureCache[s] = c, c;
	}
	loadImageSource(e, t) {
		let n = this, r = this.json, i = this.options;
		if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((e) => e.clone());
		let a = r.images[e], o = self.URL || self.webkitURL, s = a.uri || "", c = !1;
		if (a.bufferView !== void 0) s = n.getDependency("bufferView", a.bufferView).then(function(e) {
			c = !0;
			let t = new Blob([e], { type: a.mimeType });
			return s = o.createObjectURL(t), s;
		});
		else if (a.uri === void 0) throw Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
		let l = Promise.resolve(s).then(function(e) {
			return new Promise(function(n, r) {
				let a = n;
				t.isImageBitmapLoader === !0 && (a = function(e) {
					let t = new pe(e);
					t.needsUpdate = !0, n(t);
				}), t.load(Ue.resolveURL(e, i.path), a, void 0, r);
			});
		}).then(function(e) {
			return c === !0 && o.revokeObjectURL(s), ts(e, a), e.userData.mimeType = a.mimeType || ss(a.uri), e;
		}).catch(function(e) {
			throw console.error("THREE.GLTFLoader: Couldn't load texture", s), e;
		});
		return this.sourceCache[e] = l, l;
	}
	assignTexture(e, t, n, r) {
		let i = this;
		return this.getDependency("texture", n.index).then(function(a) {
			if (!a) return null;
			if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), i.extensions[z.KHR_TEXTURE_TRANSFORM]) {
				let e = n.extensions === void 0 ? void 0 : n.extensions[z.KHR_TEXTURE_TRANSFORM];
				if (e) {
					let t = i.associations.get(a);
					a = i.extensions[z.KHR_TEXTURE_TRANSFORM].extendTexture(a, e), i.associations.set(a, t);
				}
			}
			return r !== void 0 && (a.colorSpace = r), e[t] = a, a;
		});
	}
	assignFinalMaterial(e) {
		let t = e.geometry, n = e.material, r = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
		if (e.isPoints) {
			let e = "PointsMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new ae(), Le.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, t.sizeAttenuation = !1, this.cache.add(e, t)), n = t;
		} else if (e.isLine) {
			let e = "LineBasicMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new ke(), Le.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, this.cache.add(e, t)), n = t;
		}
		if (r || i || a) {
			let e = "ClonedMaterial:" + n.uuid + ":";
			r && (e += "derivative-tangents:"), i && (e += "vertex-colors:"), a && (e += "flat-shading:");
			let t = this.cache.get(e);
			t || (t = n.clone(), i && (t.vertexColors = !0), a && (t.flatShading = !0), r && (t.normalScale && (t.normalScale.y *= -1), t.clearcoatNormalScale && (t.clearcoatNormalScale.y *= -1)), this.cache.add(e, t), this.associations.set(t, this.associations.get(n))), n = t;
		}
		e.material = n;
	}
	getMaterialType() {
		return P;
	}
	loadMaterial(e) {
		let t = this, n = this.json, r = this.extensions, i = n.materials[e], a, o = {}, s = i.extensions || {}, c = [];
		if (s[z.KHR_MATERIALS_UNLIT]) {
			let e = r[z.KHR_MATERIALS_UNLIT];
			a = e.getMaterialType(), c.push(e.extendParams(o, i, t));
		} else {
			let n = i.pbrMetallicRoughness || {};
			if (o.color = new j(1, 1, 1), o.opacity = 1, Array.isArray(n.baseColorFactor)) {
				let e = n.baseColorFactor;
				o.color.setRGB(e[0], e[1], e[2], Qe), o.opacity = e[3];
			}
			n.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", n.baseColorTexture, D)), o.metalness = n.metallicFactor === void 0 ? 1 : n.metallicFactor, o.roughness = n.roughnessFactor === void 0 ? 1 : n.roughnessFactor, n.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", n.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", n.metallicRoughnessTexture))), a = this._invokeOne(function(t) {
				return t.getMaterialType && t.getMaterialType(e);
			}), c.push(Promise.all(this._invokeAll(function(t) {
				return t.extendMaterialParams && t.extendMaterialParams(e, o);
			})));
		}
		i.doubleSided === !0 && (o.side = 2);
		let l = i.alphaMode || Qo.OPAQUE;
		if (l === Qo.BLEND ? (o.transparent = !0, o.depthWrite = !1) : (o.transparent = !1, l === Qo.MASK && (o.alphaTest = i.alphaCutoff === void 0 ? .5 : i.alphaCutoff)), i.normalTexture !== void 0 && a !== et && (c.push(t.assignTexture(o, "normalMap", i.normalTexture)), o.normalScale = new Ze(1, 1), i.normalTexture.scale !== void 0)) {
			let e = i.normalTexture.scale;
			o.normalScale.set(e, e);
		}
		if (i.occlusionTexture !== void 0 && a !== et && (c.push(t.assignTexture(o, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && a !== et) {
			let e = i.emissiveFactor;
			o.emissive = new j().setRGB(e[0], e[1], e[2], Qe);
		}
		return i.emissiveTexture !== void 0 && a !== et && c.push(t.assignTexture(o, "emissiveMap", i.emissiveTexture, D)), Promise.all(c).then(function() {
			let n = new a(o);
			return i.name && (n.name = i.name), ts(n, i), t.associations.set(n, { materials: e }), i.extensions && es(r, n, i), n;
		});
	}
	createUniqueName(e) {
		let t = tt.sanitizeNodeName(e || "");
		return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
	}
	loadGeometries(e) {
		let t = this, n = this.extensions, r = this.primitiveCache;
		function i(e) {
			return n[z.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then(function(n) {
				return ds(n, e, t);
			});
		}
		let a = [];
		for (let n = 0, o = e.length; n < o; n++) {
			let o = e[n], s = is(o), c = r[s];
			if (c) a.push(c.promise);
			else {
				let e;
				e = o.extensions && o.extensions[z.KHR_DRACO_MESH_COMPRESSION] ? i(o) : ds(new Pe(), o, t), o.mode === Wo.TRIANGLE_STRIP ? e = e.then((e) => $t(e, 1)) : o.mode === Wo.TRIANGLE_FAN && (e = e.then((e) => $t(e, 2))), r[s] = {
					primitive: o,
					promise: e
				}, a.push(e);
			}
		}
		return Promise.all(a);
	}
	loadMesh(e) {
		let t = this, n = this.json, r = this.extensions, i = n.meshes[e], a = i.primitives, o = [];
		for (let e = 0, t = a.length; e < t; e++) {
			let t = a[e].material === void 0 ? $o(this.cache) : this.getDependency("material", a[e].material);
			o.push(t);
		}
		return o.push(t.loadGeometries(a)), Promise.all(o).then(async function(n) {
			let o = n.slice(0, n.length - 1), s = n[n.length - 1], c = [];
			for (let n = 0, l = s.length; n < l; n++) {
				let l = s[n], u = a[n], d, f = o[n];
				if (u.mode === Wo.TRIANGLES || u.mode === Wo.TRIANGLE_STRIP || u.mode === Wo.TRIANGLE_FAN || u.mode === void 0) {
					let e = i.isSkinnedMesh === !0, t = l.hasAttribute("skinIndex") && l.hasAttribute("skinWeight");
					e && t === !1 && console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."), d = e && t ? new p(l, f) : new N(l, f), d.isSkinnedMesh === !0 && d.normalizeSkinWeights();
				} else if (u.mode === Wo.LINES) d = new Be(l, f);
				else if (u.mode === Wo.LINE_STRIP) d = new qe(l, f);
				else if (u.mode === Wo.LINE_LOOP) d = new ve(l, f);
				else if (u.mode === Wo.POINTS) d = new C(l, f);
				else throw Error("THREE.GLTFLoader: Primitive mode unsupported: " + u.mode);
				Object.keys(d.geometry.morphAttributes).length > 0 && rs(d, i), d.name = t.createUniqueName(i.name || "mesh_" + e), ts(d, i), u.extensions && es(r, d, u), t.assignFinalMaterial(d), c.push(d);
			}
			for (let n = 0, r = c.length; n < r; n++) t.associations.set(c[n], {
				meshes: e,
				primitives: n
			});
			if (c.length === 1) return i.extensions && es(r, c[0], i), c[0];
			let l = new m();
			i.extensions && es(r, l, i), t.associations.set(l, { meshes: e });
			for (let e = 0, t = c.length; e < t; e++) l.add(c[e]);
			return l;
		});
	}
	loadCamera(e) {
		let t, n = this.json.cameras[e], r = n[n.type];
		if (!r) {
			console.warn("THREE.GLTFLoader: Missing camera parameters.");
			return;
		}
		return n.type === "perspective" ? t = new ee(Oe.radToDeg(r.yfov), r.aspectRatio || 1, r.znear || 1, r.zfar || 2e6) : n.type === "orthographic" && (t = new T(-r.xmag, r.xmag, r.ymag, -r.ymag, r.znear, r.zfar)), n.name && (t.name = this.createUniqueName(n.name)), ts(t, n), Promise.resolve(t);
	}
	loadSkin(e) {
		let t = this.json.skins[e], n = [];
		for (let e = 0, r = t.joints.length; e < r; e++) n.push(this._loadNodeShallow(t.joints[e]));
		return t.inverseBindMatrices === void 0 ? n.push(null) : n.push(this.getDependency("accessor", t.inverseBindMatrices)), Promise.all(n).then(function(e) {
			let n = e.pop(), r = e, i = [], a = [];
			for (let e = 0, o = r.length; e < o; e++) {
				let o = r[e];
				if (o) {
					i.push(o);
					let t = new ge();
					n !== null && t.fromArray(n.array, e * 16), a.push(t);
				} else console.warn("THREE.GLTFLoader: Joint \"%s\" could not be found.", t.joints[e]);
			}
			return new ue(i, a);
		});
	}
	loadAnimation(e) {
		let t = this.json, n = this, r = t.animations[e], i = r.name ? r.name : "animation_" + e, a = [], o = [], s = [], c = [], l = [];
		for (let e = 0, t = r.channels.length; e < t; e++) {
			let t = r.channels[e], n = r.samplers[t.sampler], i = t.target, u = i.node, d = r.parameters === void 0 ? n.input : r.parameters[n.input], f = r.parameters === void 0 ? n.output : r.parameters[n.output];
			i.node !== void 0 && (a.push(this.getDependency("node", u)), o.push(this.getDependency("accessor", d)), s.push(this.getDependency("accessor", f)), c.push(n), l.push(i));
		}
		return Promise.all([
			Promise.all(a),
			Promise.all(o),
			Promise.all(s),
			Promise.all(c),
			Promise.all(l)
		]).then(function(e) {
			let t = e[0], a = e[1], o = e[2], s = e[3], c = e[4], l = [];
			for (let e = 0, r = t.length; e < r; e++) {
				let r = t[e], i = a[e], u = o[e], d = s[e], f = c[e];
				if (r === void 0) continue;
				r.updateMatrix && r.updateMatrix();
				let p = n._createAnimationTracks(r, i, u, d, f);
				if (p) for (let e = 0; e < p.length; e++) l.push(p[e]);
			}
			let u = new Re(i, void 0, l);
			return ts(u, r), u;
		});
	}
	createNodeMesh(e) {
		let t = this.json, n = this, r = t.nodes[e];
		return r.mesh === void 0 ? null : n.getDependency("mesh", r.mesh).then(function(e) {
			let t = n._getNodeRef(n.meshCache, r.mesh, e);
			return r.weights !== void 0 && t.traverse(function(e) {
				if (e.isMesh) for (let t = 0, n = r.weights.length; t < n; t++) e.morphTargetInfluences[t] = r.weights[t];
			}), t;
		});
	}
	loadNode(e) {
		let t = this.json, n = this, r = t.nodes[e], i = n._loadNodeShallow(e), a = [], o = r.children || [];
		for (let e = 0, t = o.length; e < t; e++) a.push(n.getDependency("node", o[e]));
		let s = r.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", r.skin);
		return Promise.all([
			i,
			Promise.all(a),
			s
		]).then(function(e) {
			let t = e[0], n = e[1], r = e[2];
			r !== null && t.traverse(function(e) {
				e.isSkinnedMesh && e.bind(r, cs);
			});
			for (let e = 0, r = n.length; e < r; e++) t.add(n[e]);
			if (t.userData.pivot !== void 0 && n.length > 0) {
				let e = t.userData.pivot, r = n[0];
				t.pivot = new A().fromArray(e), t.position.x -= e[0], t.position.y -= e[1], t.position.z -= e[2], r.position.set(0, 0, 0), delete t.userData.pivot;
			}
			return t;
		});
	}
	_loadNodeShallow(e) {
		let t = this.json, n = this.extensions, r = this;
		if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
		let a = t.nodes[e], o = a.name ? r.createUniqueName(a.name) : "", s = [], c = r._invokeOne(function(t) {
			return t.createNodeMesh && t.createNodeMesh(e);
		});
		return c && s.push(c), a.camera !== void 0 && s.push(r.getDependency("camera", a.camera).then(function(e) {
			return r._getNodeRef(r.cameraCache, a.camera, e);
		})), r._invokeAll(function(t) {
			return t.createNodeAttachment && t.createNodeAttachment(e);
		}).forEach(function(e) {
			s.push(e);
		}), this.nodeCache[e] = Promise.all(s).then(function(t) {
			let s;
			if (s = a.isBone === !0 ? new _e() : t.length > 1 ? new m() : t.length === 1 ? t[0] : new i(), s !== t[0]) for (let e = 0, n = t.length; e < n; e++) s.add(t[e]);
			if (a.name && (s.userData.name = a.name, s.name = o), ts(s, a), a.extensions && es(n, s, a), a.matrix !== void 0) {
				let e = new ge();
				e.fromArray(a.matrix), s.applyMatrix4(e);
			} else a.translation !== void 0 && s.position.fromArray(a.translation), a.rotation !== void 0 && s.quaternion.fromArray(a.rotation), a.scale !== void 0 && s.scale.fromArray(a.scale);
			if (!r.associations.has(s)) r.associations.set(s, {});
			else if (a.mesh !== void 0 && r.meshCache.refs[a.mesh] > 1) {
				let e = r.associations.get(s);
				r.associations.set(s, { ...e });
			}
			return r.associations.get(s).nodes = e, s;
		}), this.nodeCache[e];
	}
	loadScene(e) {
		let t = this.extensions, n = this.json.scenes[e], r = this, i = new m();
		n.name && (i.name = r.createUniqueName(n.name)), ts(i, n), n.extensions && es(t, i, n);
		let a = n.nodes || [], o = [];
		for (let e = 0, t = a.length; e < t; e++) o.push(r.getDependency("node", a[e]));
		return Promise.all(o).then(function(e) {
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				n.parent === null ? i.add(n) : i.add(fo(n));
			}
			return r.associations = ((e) => {
				let t = /* @__PURE__ */ new Map();
				for (let [e, n] of r.associations) (e instanceof Le || e instanceof pe) && t.set(e, n);
				return e.traverse((e) => {
					let n = r.associations.get(e);
					n != null && t.set(e, n);
				}), t;
			})(i), i;
		});
	}
	_createAnimationTracks(e, t, n, r, i) {
		let a = [], o = e.name ? e.name : e.uuid, s = [];
		function c(e) {
			e.morphTargetInfluences && s.push(e.name ? e.name : e.uuid);
		}
		Xo[i.path] === Xo.weights ? (c(e), e.isGroup && e.children.forEach(c)) : s.push(o);
		let l;
		switch (Xo[i.path]) {
			case Xo.weights:
				l = Ne;
				break;
			case Xo.rotation:
				l = le;
				break;
			case Xo.translation:
			case Xo.scale:
				l = He;
				break;
			default: switch (n.itemSize) {
				case 1:
					l = Ne;
					break;
				default: l = He;
			}
		}
		let u = r.interpolation === void 0 ? Xe : Zo[r.interpolation], d = this._getArrayFromAccessor(n);
		for (let e = 0, n = s.length; e < n; e++) {
			let n = new l(s[e] + "." + Xo[i.path], t.array, d, u);
			r.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(n), a.push(n);
		}
		return a;
	}
	_getArrayFromAccessor(e) {
		let t = e.array;
		if (e.normalized) {
			let e = os(t.constructor), n = new Float32Array(t.length);
			for (let r = 0, i = t.length; r < i; r++) n[r] = t[r] * e;
			t = n;
		}
		return t;
	}
	_createCubicSplineTrackInterpolant(e) {
		e.createInterpolant = function(e) {
			return new (this instanceof le ? Uo : Vo)(this.times, this.values, this.getValueSize() / 3, e);
		}, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
	}
};
function us(e, t, n) {
	let r = t.attributes, i = new ze();
	if (r.POSITION !== void 0) {
		let e = n.json.accessors[r.POSITION], t = e.min, a = e.max;
		if (t !== void 0 && a !== void 0) {
			if (i.set(new A(t[0], t[1], t[2]), new A(a[0], a[1], a[2])), e.normalized) {
				let t = os(Go[e.componentType]);
				i.min.multiplyScalar(t), i.max.multiplyScalar(t);
			}
		} else {
			console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			return;
		}
	} else return;
	let a = t.targets;
	if (a !== void 0) {
		let e = new A(), t = new A();
		for (let r = 0, i = a.length; r < i; r++) {
			let i = a[r];
			if (i.POSITION !== void 0) {
				let r = n.json.accessors[i.POSITION], a = r.min, o = r.max;
				if (a !== void 0 && o !== void 0) {
					if (t.setX(Math.max(Math.abs(a[0]), Math.abs(o[0]))), t.setY(Math.max(Math.abs(a[1]), Math.abs(o[1]))), t.setZ(Math.max(Math.abs(a[2]), Math.abs(o[2]))), r.normalized) {
						let e = os(Go[r.componentType]);
						t.multiplyScalar(e);
					}
					e.max(t);
				} else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			}
		}
		i.expandByVector(e);
	}
	e.boundingBox = i;
	let o = new x();
	i.getCenter(o.center), o.radius = i.min.distanceTo(i.max) / 2, e.boundingSphere = o;
}
function ds(e, t, n) {
	let r = t.attributes, i = [];
	function a(t, r) {
		return n.getDependency("accessor", t).then(function(t) {
			e.setAttribute(r, t);
		});
	}
	for (let t in r) {
		let n = Yo[t] || t.toLowerCase();
		n in e.attributes || i.push(a(r[t], n));
	}
	if (t.indices !== void 0 && !e.index) {
		let r = n.getDependency("accessor", t.indices).then(function(t) {
			e.setIndex(t);
		});
		i.push(r);
	}
	return he.workingColorSpace !== "srgb-linear" && "COLOR_0" in r && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${he.workingColorSpace}" not supported.`), ts(e, t), us(e, t, n), Promise.all(i).then(function() {
		return t.targets === void 0 ? e : ns(e, t.targets, n);
	});
}
//#endregion
//#region ember3d/props.js
var B = (e, t, n) => new P({
	color: e,
	metalness: t,
	roughness: n
}), fs = {
	mace: () => {
		let e = new m();
		e.name = "Mace";
		let t = B(4862754, 0, .85), n = B(3022616, 0, .9), r = B(12095548, .8, .35), i = B(10133670, .85, .35), a = (t, n, r, i) => {
			let a = new N(t, n);
			return a.position.y = r, a.name = i, e.add(a), a;
		};
		a(new O(.062, .07, 1.02, 10), t, .28, "Mace_Haft"), a(new O(.08, .08, .34, 10), n, -.02, "Mace_Grip"), a(new Ge(.1, 12, 8), r, -.25, "Mace_Pommel");
		for (let e of [.17, .7]) a(new O(.085, .085, .06, 12), r, e, "Mace_Band");
		a(new O(.12, .1, .38, 12), i, .92, "Mace_Head");
		let o = new h([
			[0, -.22],
			[.13, -.06],
			[.14, .06],
			[0, .22]
		].map(([e, t]) => new Ze(e, t))), s = new u(o, {
			depth: .05,
			bevelEnabled: !1
		});
		s.translate(0, 0, -.025);
		for (let t = 0; t < 6; t++) {
			let n = new N(s, i), r = t * Math.PI / 3;
			n.position.set(Math.cos(r) * .1, .92, Math.sin(r) * .1), n.rotation.y = -r, n.name = "Mace_Flange", e.add(n);
		}
		return a(new $e(.1, .16, 10), i, 1.18, "Mace_Cap"), a(new Ge(.065, 10, 8), r, 1.28, "Mace_Knop"), e;
	},
	sword: () => {
		let e = new m();
		e.name = "Sword";
		let t = B(13159634, .9, .3), n = B(12095548, .8, .35), r = B(3810328, 0, .9), i = new N(new O(.02, .1, 1.2, 4, 1), t);
		i.scale.set(1, 1, .3), i.rotation.y = Math.PI / 4, i.position.y = .78, i.name = "Sword_Blade", e.add(i);
		let a = new N(new M(.46, .07, .1), n);
		a.position.y = .16, e.add(a);
		let o = new N(new O(.045, .05, .3, 8), r);
		o.position.y = 0, e.add(o);
		let s = new N(new Ge(.075, 10, 8), n);
		return s.position.y = -.2, e.add(s), e;
	},
	dagger: () => {
		let e = new m();
		e.name = "Dagger";
		let t = B(12633290, .9, .3), n = B(2760736, .2, .7), r = new N(new O(.012, .07, .62, 4, 1), t);
		r.scale.set(1, 1, .3), r.rotation.y = Math.PI / 4, r.position.y = .45, e.add(r);
		let i = new N(new M(.26, .05, .08), n);
		i.position.y = .12, e.add(i);
		let a = new N(new O(.04, .045, .24, 8), n);
		return e.add(a), e;
	},
	staff: () => {
		let e = new m();
		e.name = "Staff", e.userData.hang = "up";
		let t = B(5913122, 0, .85), n = B(12095548, .8, .35), r = new P({
			color: 16752704,
			emissive: 12599312,
			emissiveIntensity: 1.2,
			roughness: .2
		}), i = new N(new O(.045, .055, 2.1, 8), t);
		i.position.y = .2, e.add(i);
		for (let t of [1.18, -.8]) {
			let r = new N(new O(.07, .07, .07, 10), n);
			r.position.y = t, e.add(r);
		}
		let a = new N(new k(.12, .025, 6, 12), n);
		a.position.y = 1.36, e.add(a);
		let o = new N(new f(.11, 1), r);
		return o.position.y = 1.36, o.userData.glow = 16744496, e.add(o), e;
	},
	shield: () => {
		let e = new m();
		e.name = "Shield";
		let t = B(8007202, 0, .8), n = B(10133670, .85, .35), r = B(13146688, .8, .35), i = new N(new O(.42, .42, .08, 20), t);
		i.rotation.x = Math.PI / 2, i.position.z = .16, e.add(i);
		let a = new N(new k(.42, .035, 6, 24), n);
		a.position.z = .2, e.add(a);
		let o = new N(new Ge(.11, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), r);
		return o.rotation.x = Math.PI / 2, o.position.z = .2, e.add(o), e;
	},
	book: () => {
		let e = new m();
		e.name = "Book";
		let t = B(5906464, 0, .8), n = B(15260864, 0, .9), r = B(13146688, .8, .35), i = new N(new M(.2, .42, .46), t);
		i.position.y = .27, e.add(i);
		let a = new N(new M(.16, .38, .47), n);
		a.position.y = .27, a.position.x = .012, e.add(a);
		let o = new N(new M(.21, .08, .08), r);
		return o.position.set(0, .27, .2), e.add(o), e;
	},
	standard: () => {
		let e = new m();
		e.name = "Standard";
		let t = B(3811868, 0, .9), n = B(11042874, .8, .4), r = B(8004632, 0, .95), i = new P({
			color: 15773776,
			emissive: 10506256,
			emissiveIntensity: 1,
			roughness: .4
		}), a = new N(new O(.045, .055, 3, 8), t);
		a.position.y = -.9, e.add(a);
		let o = new N(new O(.035, .035, .9, 8), n);
		o.rotation.z = Math.PI / 2, o.position.y = -2.2, e.add(o);
		let s = new N(new $e(.1, .34, 6), n);
		s.rotation.z = Math.PI, s.position.y = -2.56, e.add(s);
		for (let [t, n] of [
			[-.28, 1],
			[0, 1.2],
			[.28, .9]
		]) {
			let i = new N(new M(.28, n, .02), r);
			i.position.set(t, -2.2 + n / 2, .04), e.add(i);
		}
		let c = new N(new O(.14, .14, .03, 14), i);
		return c.rotation.x = Math.PI / 2, c.position.set(0, -1.78, .07), e.add(c), e;
	},
	shard: () => {
		let e = new m();
		e.name = "Ember_Shard";
		let t = new P({
			color: 16752704,
			emissive: 12599312,
			emissiveIntensity: 1.4,
			roughness: .3
		});
		for (let [n, r, i, a] of [
			[
				0,
				.42,
				.07,
				0
			],
			[
				.06,
				.28,
				.05,
				-.35
			],
			[
				-.06,
				.24,
				.045,
				.4
			]
		]) {
			let o = new N(new Me(1, 0), t);
			o.scale.set(i, r / 2, i), o.position.set(n, .1 + r / 2, 0), o.rotation.z = a, o.name = "Ember_Shard", o.userData.glow = 16744496, e.add(o);
		}
		return e;
	},
	mug: () => {
		let e = new m();
		e.name = "Mug";
		let t = B(7106676, .75, .45), n = B(13144106, .1, .35), r = B(14209212, 0, .9), i = new N(new O(.2, .18, .4, 14, 1, !0), t);
		i.position.set(.22, .22, 0), i.name = "Mug_Body", e.add(i);
		let a = new N(new O(.19, .19, .04, 14), t);
		a.position.set(.22, .03, 0), a.name = "Mug_Base", e.add(a);
		let o = new N(new O(.19, .19, .02, 14), n);
		o.position.set(.22, .38, 0), o.name = "Mug_Ale", e.add(o);
		let s = new N(new Ge(.2, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), r);
		s.scale.set(.8, .3, .8), s.position.set(.22, .4, 0), s.name = "Mug_Foam", e.add(s);
		let c = new N(new k(.11, .035, 8, 16, Math.PI), t);
		return c.rotation.z = Math.PI / 2, c.position.set(.02, .22, 0), c.name = "Mug_Handle", e.add(c), e;
	},
	lantern: () => {
		let e = new m();
		e.name = "Lantern", e.userData.hang = !0;
		let t = B(3814964, .7, .5), n = B(10123834, .8, .4), r = new P({
			color: 16760944,
			emissive: 12607504,
			emissiveIntensity: 1.2,
			roughness: .3
		}), i = new N(new k(.12, .022, 6, 14, Math.PI), t);
		i.rotation.z = Math.PI, i.position.y = .14, e.add(i);
		let a = new N(new $e(.17, .14, 8), t);
		a.rotation.z = Math.PI, a.position.y = .3, e.add(a);
		let o = new N(new O(.13, .13, .3, 8), r);
		o.position.y = .5, o.name = "Lantern_Glass", o.userData.glow = 16756816, e.add(o);
		for (let n = 0; n < 4; n++) {
			let r = n * Math.PI / 2 + Math.PI / 4, i = new N(new M(.03, .32, .03), t);
			i.position.set(Math.cos(r) * .135, .5, Math.sin(r) * .135), e.add(i);
		}
		let s = new N(new O(.16, .14, .07, 8), n);
		return s.position.y = .68, e.add(s), e;
	},
	hammer: () => {
		let e = new m();
		e.name = "Smith_Hammer", e.userData.hang = !0;
		let t = B(6965802, 0, .8), n = B(5593182, .85, .4), r = B(3022616, 0, .9), i = new N(new O(.045, .055, .62, 8), t);
		i.position.y = .2, e.add(i);
		let a = new N(new O(.062, .062, .26, 8), r);
		a.position.y = -.02, e.add(a);
		let o = new N(new M(.42, .17, .17), n);
		o.position.y = .52, o.name = "Hammer_Head", e.add(o);
		let s = new N(new O(.1, .1, .08, 10), n);
		s.rotation.z = Math.PI / 2, s.position.set(.24, .52, 0), e.add(s);
		let c = new N(new M(.1, .06, .15), n);
		return c.position.set(-.25, .52, 0), e.add(c), e;
	},
	basket: () => {
		let e = new m();
		e.name = "Egg_Basket", e.userData.hang = !0;
		let t = B(10517060, 0, .9), n = B(14209728, 0, .95), r = B(15919832, 0, .6), i = new N(new k(.2, .025, 6, 14, Math.PI), t);
		i.rotation.z = Math.PI, i.position.y = .2, e.add(i);
		let a = new N(new O(.26, .19, .24, 10), t);
		a.position.y = .36, e.add(a);
		for (let [t, n] of [
			[-.08, .05],
			[.07, -.06],
			[0, .1],
			[.1, .08]
		]) {
			let i = new N(new Ge(.075, 8, 6), r);
			i.scale.y = 1.25, i.position.set(t, .23, n), e.add(i);
		}
		let o = new N(new M(.3, .03, .22), n);
		return o.position.set(-.08, .25, -.06), o.rotation.y = .5, e.add(o), e;
	},
	keys: () => {
		let e = new m();
		e.name = "Key_Ring", e.userData.hang = !0;
		let t = B(6972512, .85, .4), n = B(11569728, .8, .4), r = new N(new k(.12, .022, 6, 16), t);
		r.position.y = .14, e.add(r);
		for (let [r, i, a] of [
			[
				-.35,
				n,
				.42
			],
			[
				.05,
				t,
				.5
			],
			[
				.4,
				n,
				.38
			]
		]) {
			let t = new m();
			t.position.y = .24, t.rotation.z = r;
			let n = new N(new M(.035, a, .035), i);
			n.position.y = a / 2, t.add(n);
			let o = new N(new k(.05, .018, 5, 10), i);
			o.position.y = .02, t.add(o);
			let s = new N(new M(.1, .06, .03), i);
			s.position.set(.05, a - .04, 0), t.add(s), e.add(t);
		}
		return e;
	},
	whip: () => {
		let e = new m();
		e.name = "Carter_Whip", e.userData.hang = !0;
		let t = B(5913122, 0, .85), n = B(2759184, 0, .9), r = new N(new O(.022, .04, 1.6, 6), t);
		r.position.y = -.62, e.add(r);
		let i = [
			[0, -1.42],
			[.1, -1.55],
			[.28, -1.5],
			[.36, -1.3],
			[.38, -1.05],
			[.42, -.85]
		].map(([e, t]) => new A(e, t, 0)), a = new N(new ie(new Ve(i), 16, .018, 5, !1), n);
		return e.add(a), e;
	},
	hoe: () => {
		let e = new m();
		e.name = "Hoe", e.userData.hang = !0;
		let t = B(9069112, 0, .85), n = B(5921888, .8, .45), r = new N(new O(.03, .036, 1.5, 6), t);
		r.position.y = -.6, e.add(r);
		let i = new N(new M(.3, .05, .2), n);
		return i.position.set(.1, -1.36, 0), i.rotation.z = .25, e.add(i), e;
	},
	pail: () => {
		let e = new m();
		e.name = "Pail", e.userData.hang = !0;
		let t = B(9068084, 0, .85), n = B(4078136, .7, .5), r = B(15788760, 0, .5), i = new N(new k(.17, .018, 6, 14, Math.PI), n);
		i.rotation.z = Math.PI, i.position.y = .16, e.add(i);
		let a = new N(new O(.2, .16, .3, 10), t);
		a.position.y = .36, e.add(a);
		for (let t of [.26, .46]) {
			let r = new N(new k(.185, .014, 4, 14), n);
			r.rotation.x = Math.PI / 2, r.position.y = t, e.add(r);
		}
		let o = new N(new O(.17, .17, .02, 10), r);
		return o.position.y = .23, e.add(o), e;
	},
	flour: () => {
		let e = new m();
		e.name = "Flour_Sack", e.userData.hang = !0;
		let t = B(14208174, 0, .95), n = B(6965802, 0, .9), r = new N(new O(.05, .08, .16, 8), t);
		r.position.y = .12, e.add(r);
		let i = new N(new k(.06, .016, 4, 10), n);
		i.rotation.x = Math.PI / 2, i.position.y = .1, e.add(i);
		let a = new N(new Ge(.24, 10, 8), t);
		return a.scale.set(1, 1.25, .85), a.position.y = .44, e.add(a), e;
	},
	apron: () => {
		let e = new m();
		e.name = "Apron";
		let t = B(6964264, 0, .85), n = B(3022616, 0, .9), r = new N(new M(.32, .4, .04), t);
		r.position.set(0, .32, .33), r.rotation.x = -.08, r.name = "Apron_Bib", e.add(r);
		for (let n of [-.1, .1]) {
			let r = new N(new M(.19, .3, .04), t);
			r.position.set(n, -.08, .3), r.rotation.x = .12, r.name = "Apron_Skirt", e.add(r);
		}
		let i = new N(new M(.5, .06, .06), n);
		return i.position.set(0, .11, .32), e.add(i), e;
	},
	kettle: () => {
		let e = new m();
		e.name = "Kettle_Hat";
		let t = B(7828334, .6, .55), n = B(5657166, .6, .6), r = B(10103326, 0, .9), i = new N(new Ge(.6, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), t);
		i.scale.set(1, .72, 1), i.position.set(0, .6, .02), e.add(i);
		let a = new N(new O(.62, .9, .12, 16, 1, !0), n);
		a.position.set(0, .56, .02), e.add(a);
		let o = new N(new O(.62, .9, .12, 16, 1, !0), n);
		o.material = n.clone(), o.material.side = 1, o.position.copy(a.position), e.add(o);
		let s = new N(new O(.615, .615, .12, 16), r);
		return s.position.set(0, .68, .02), e.add(s), e.traverse((e) => {
			e.isMesh && (e.name = "Kettle_Hat");
		}), e;
	},
	reedhat: () => {
		let e = new m();
		e.name = "Reed_Hat";
		let t = B(10521170, 0, .95), n = B(4872756, 0, .9), r = new N(new $e(1, .42, 14, 1, !0), t);
		r.position.set(0, .78, .02), e.add(r);
		let i = new N(new $e(1, .42, 14, 1, !0), t.clone());
		i.material.side = 1, i.position.copy(r.position), e.add(i);
		let a = new N(new O(.5, .56, .08, 14), n);
		return a.position.set(0, .62, .02), e.add(a), e.traverse((e) => {
			e.isMesh && (e.name = "Reed_Hat");
		}), e;
	},
	rag: () => {
		let e = new m();
		e.name = "Rag";
		let t = B(12610120, 0, .95), n = B(8667178, 0, .95), r = (r, i, a, o, s, c = 0) => s.forEach((l, u) => {
			let d = new N(new M(i / s.length, l, .03), u % 3 == 1 ? n : t);
			d.position.set(r + (u + .5) * (i / s.length) - i / 2, o - l / 2, a), d.rotation.x = c, d.name = "Rag_Cloth", e.add(d);
		});
		for (let n of [-1, 1]) {
			let r = new N(new M(.26, .025, .5), t);
			r.position.set(n * .21, .15, 0), r.rotation.z = n * -.5, r.name = "Rag_Cloth", e.add(r);
		}
		r(0, .62, -.25, .17, [
			.36,
			.46,
			.32,
			.5,
			.4,
			.3,
			.44
		], -.1);
		for (let e of [-1, 1]) r(e * .19, .2, .24, .17, e < 0 ? [
			.11,
			.06,
			.09
		] : [
			.08,
			.12,
			.05
		], .12);
		return e;
	},
	billhook: () => {
		let e = new m();
		e.name = "Billhook";
		let t = B(6967862, 0, .85), n = B(5593180, .8, .45), r = new N(new O(.04, .05, 1.9, 7), t);
		r.position.y = .45, e.add(r);
		let i = new N(new M(.06, .46, .2), n);
		i.position.set(0, 1.5, .08), e.add(i);
		let a = new N(new k(.12, .035, 5, 10, Math.PI * .9), n);
		return a.position.set(0, 1.72, .2), a.rotation.y = Math.PI / 2, e.add(a), e;
	},
	cagepole: () => {
		let e = new m();
		e.name = "Cagepole";
		let t = B(3023904, 0, .85), n = B(3814964, .75, .45), r = new P({
			color: 13154559,
			emissive: 7360720,
			emissiveIntensity: 1.3,
			roughness: .3
		}), i = new N(new O(.04, .05, 2, 7), t);
		i.position.y = .45, e.add(i);
		let a = new N(new $e(.2, .16, 6), n);
		a.position.y = 1.98, e.add(a);
		let o = new N(new O(.18, .18, .04, 6), n);
		o.position.y = 1.5, e.add(o);
		for (let t = 0; t < 6; t++) {
			let r = t * Math.PI / 3, i = new N(new M(.03, .42, .03), n);
			i.position.set(Math.cos(r) * .17, 1.71, Math.sin(r) * .17), e.add(i);
		}
		let s = new N(new f(.11, 1), r);
		return s.position.y = 1.7, s.name = "Cage_Soul", s.userData.glow = 12099839, e.add(s), e;
	},
	boathook: () => {
		let e = new m();
		e.name = "Boathook";
		let t = B(4076070, 0, .85), n = B(4869198, .8, .45), r = B(9075282, 0, .95), i = new N(new O(.045, .055, 2.1, 7), t);
		i.position.y = .5, e.add(i);
		let a = new N(new $e(.06, .34, 6), n);
		a.position.y = 1.72, e.add(a);
		let o = new N(new k(.15, .04, 5, 10, Math.PI * 1.1), n);
		o.position.set(0, 1.5, .15), o.rotation.set(0, Math.PI / 2, Math.PI * .55), e.add(o);
		let s = new N(new k(.08, .025, 5, 10), r);
		return s.rotation.x = Math.PI / 2, s.position.y = .05, e.add(s), e;
	},
	choirlamp: () => {
		let e = new m();
		e.name = "Choirlamp", e.userData.hang = !0;
		let t = B(12106944, .7, .4), n = new P({
			color: 14741759,
			emissive: 6328528,
			emissiveIntensity: 1.4,
			roughness: .3
		}), r = new N(new k(.1, .02, 6, 12), t);
		r.position.y = .1, e.add(r);
		let i = new N(new $e(.17, .16, 6), t);
		i.rotation.z = Math.PI, i.position.y = .26, e.add(i);
		for (let n = 0; n < 6; n++) {
			let r = n * Math.PI / 3, i = new N(new M(.025, .4, .025), t);
			i.position.set(Math.cos(r) * .15, .52, Math.sin(r) * .15), e.add(i);
		}
		let a = new N(new f(.11, 1), n);
		a.position.y = .52, a.name = "Choir_Light", a.userData.glow = 13164799, e.add(a);
		let o = new N(new O(.17, .12, .06, 6), t);
		return o.position.y = .74, e.add(o), e;
	},
	marshlamp: () => {
		let e = new m();
		e.name = "Marshlamp", e.userData.hang = !0;
		let t = B(4866096, 0, .9), n = new P({
			color: 14217416,
			emissive: 7385200,
			emissiveIntensity: 1.3,
			roughness: .3
		}), r = new N(new O(.012, .012, .2, 4), t);
		r.position.y = .1, e.add(r);
		let i = new N(new f(.12, 1), n);
		i.position.y = .36, i.name = "Marsh_Light", i.userData.glow = 13168832, e.add(i);
		for (let n = 0; n < 5; n++) {
			let r = n * Math.PI * .4, i = new N(new k(.15, .014, 4, 10, Math.PI * 1.1), t);
			i.position.y = .36, i.rotation.set(Math.PI / 2, r, .3), e.add(i);
		}
		return e;
	},
	crook: () => {
		let e = new m();
		e.name = "Crook", e.userData.hang = "up";
		let t = B(4864552, 0, .9), n = new N(new O(.035, .045, 1.8, 6), t);
		n.position.y = .3, n.rotation.z = .04, e.add(n);
		let r = new N(new k(.13, .035, 5, 10, Math.PI * 1.2), t);
		return r.position.set(.12, 1.22, 0), e.add(r), e;
	},
	habit: () => {
		let e = new m();
		e.name = "Habit";
		let t = B(9079940, 0, .95), n = B(6185050, 0, .95), r = B(4876850, 0, .9), i = new N(new k(.24, .09, 6, 12), t);
		i.rotation.x = Math.PI / 2, i.position.y = .2, i.name = "Habit_Cloth", e.add(i);
		for (let [r, i] of [[.22, .1], [-.24, -.08]]) for (let a = 0; a < 5; a++) {
			let o = .62 + a * 7 % 5 * .06, s = new N(new M(.1, o, .03), a % 2 ? n : t);
			s.position.set(-.2 + a * .1, .16 - o / 2, r), s.rotation.x = i, s.name = "Habit_Cloth", e.add(s);
		}
		for (let [t, n, i] of [
			[
				-.18,
				.25,
				.3
			],
			[
				.12,
				.25,
				.22
			],
			[
				.22,
				-.27,
				.34
			],
			[
				-.05,
				-.27,
				.26
			]
		]) {
			let a = new N(new M(.035, i, .02), r);
			a.position.set(t, .12 - i / 2, n), a.rotation.z = (t > 0 ? 1 : -1) * .12, e.add(a);
		}
		return e;
	},
	huntbow: () => ps({
		name: "Hunting_Bow",
		half: .7,
		draw: .2,
		curl: .08,
		wood: 9067058,
		nock: 3022616,
		r: .045
	}),
	longbow: () => ps({
		name: "Yew_Longbow",
		half: 1,
		draw: .24,
		curl: 0,
		wood: 11565632,
		nock: 15260864,
		r: .042
	})
};
function ps({ name: e, half: t, draw: n, curl: r, wood: i, nock: a, r: o }) {
	let s = new m();
	s.name = e;
	let c = B(i, 0, .75), l = B(a, .1, .5), u = B(3022616, 0, .9), d = B(15129800, 0, .8), f = (i) => {
		let a = [
			0,
			.25,
			.5,
			.75,
			1
		].map((e) => new A(-n * e * e + r * Math.max(0, e - .75) * 4, i * t * e, 0)), u = new ie(new Ve(a), 12, o, 6, !1), d = u.attributes.position;
		for (let e = 0; e < d.count; e++) {
			let n = d.getY(e), r = Math.min(1, Math.abs(n) / t), i = 1 - .55 * r, o = a[Math.round(r * 4)];
			d.setX(e, o.x + (d.getX(e) - o.x) * i), d.setZ(e, d.getZ(e) * i);
		}
		let f = new N(u, c);
		f.name = e + "_Limb", s.add(f);
		let p = new N(new Ge(o * .9, 8, 6), l);
		return p.position.copy(a[4]), p.name = e + "_Nock", s.add(p), a[4];
	}, p = f(1), h = f(-1), g = new N(new O(o * 1.5, o * 1.5, .24, 8), u);
	g.name = e + "_Grip", s.add(g);
	let _ = new N(new O(.008, .008, p.distanceTo(h), 4), d);
	return _.position.set((p.x + h.x) / 2, 0, 0), _.name = e + "_String", s.add(_), s;
}
function ms(e, t) {
	let n = document.createElement("canvas");
	n.width = e.width, n.height = e.height;
	let r = n.getContext("2d", { willReadFrequently: !0 });
	r.drawImage(e, 0, 0);
	let i = e.width / 8, a = e.height / 4, o = (e) => [
		1,
		3,
		5
	].map((t) => parseInt(e.slice(t, t + 2), 16));
	for (let { tile: [e, n], to: [s, c] } of t) {
		let t = r.getImageData(e * i, n * a, i, a), l = t.data, u = o(s), d = o(c), f = 255, p = 0, m = (e) => .3 * l[e] + .59 * l[e + 1] + .11 * l[e + 2];
		for (let e = 0; e < l.length; e += 4) {
			let t = m(e);
			f = Math.min(f, t), p = Math.max(p, t);
		}
		for (let e = 0; e < l.length; e += 4) {
			let t = p > f ? (m(e) - f) / (p - f) : 1;
			for (let n = 0; n < 3; n++) l[e + n] = d[n] + (u[n] - d[n]) * t;
		}
		r.putImageData(t, e * i, n * a);
	}
	return n;
}
function hs(e, t) {
	let n = /* @__PURE__ */ new Map();
	e.traverse((e) => {
		if (!e.isMesh || !e.material.map || /Eyes/.test(e.name)) return;
		let r = n.get(e.material);
		if (!r) {
			let i = e.material.map, a = new Ce(ms(i.image, t));
			a.flipY = i.flipY, a.colorSpace = i.colorSpace, a.magFilter = i.magFilter, a.minFilter = i.minFilter, a.wrapS = i.wrapS, a.wrapT = i.wrapT, r = e.material.clone(), r.map = a, n.set(e.material, r);
		}
		e.material = r;
	});
}
//#endregion
//#region ember3d/faces.js
var gs = /* @__PURE__ */ e({
	HAIR: () => ys,
	IRIS: () => bs,
	SHAPES: () => Is,
	SKIN: () => vs,
	buildFace: () => oc,
	kkHead: () => Cs,
	shellOf: () => Ls
}), _s = (e, t) => `${Math.floor(e * 8)},${Math.floor(t * 4)}`, V = (e, t = .8, n = 0) => new P({
	color: e,
	roughness: t,
	metalness: n
}), vs = {
	porcelain: "#f2d2bc",
	fair: "#e8b896",
	rose: "#dca088",
	olive: "#c89a6c",
	tan: "#b07850",
	umber: "#8a5a3a",
	deep: "#6c4430"
}, ys = {
	black: "#1c1612",
	soot: "#2e2620",
	brown: "#5a3a22",
	chestnut: "#6e3e24",
	auburn: "#7e3a1e",
	copper: "#a65428",
	straw: "#c8a060",
	flax: "#e0c88a",
	ash: "#8a8278",
	grey: "#a8a49c",
	white: "#e4e0d8"
}, bs = {
	brown: "#5a3218",
	hazel: "#7a6a30",
	green: "#4a7a3a",
	blue: "#4a74b0",
	grey: "#7a8894",
	amber: "#b07820"
}, xs = (e, t, n) => new j(e[t] || t || n), Ss = /* @__PURE__ */ new Map();
async function Cs(e, t) {
	if (Ss.has(t)) return Ss.get(t);
	let n = await e(`./models/${t}.glb`);
	n.scene.updateMatrixWorld(!0);
	let r = null;
	n.scene.traverse((e) => {
		e.isSkinnedMesh && /Head/.test(e.name) && (r = e);
	});
	let i = r.skeleton, a = i.bones.findIndex((e) => e.name === "head"), o = i.boneInverses[a].clone().multiply(r.bindMatrix), s = r.geometry, c = s.attributes.position, l = s.attributes.normal, u = s.attributes.uv, d = s.index, f = (e) => d ? d.getX(e) : e, p = (d ? d.count : c.count) / 3, m = new Ee().getNormalMatrix(o), h = {};
	for (let e = 0; e < p; e++) {
		let t = 0, n = 0;
		for (let r = 0; r < 3; r++) {
			let i = f(e * 3 + r);
			t += u.getX(i) / 3, n += u.getY(i) / 3;
		}
		(h[_s(t, n)] ||= []).push(e);
	}
	let g = new A(), _ = new A(), v = {};
	for (let [e, t] of Object.entries(h)) {
		let n = [], r = [], i = [];
		for (let e of t) for (let t = 0; t < 3; t++) {
			let a = f(e * 3 + t);
			g.fromBufferAttribute(c, a).applyMatrix4(o), n.push(g.x, g.y, g.z), _.fromBufferAttribute(l, a).applyMatrix3(m).normalize(), r.push(_.x, _.y, _.z), i.push(u.getX(a), u.getY(a));
		}
		let a = new Pe();
		a.setAttribute("position", new S(n, 3)), a.setAttribute("normal", new S(r, 3)), a.setAttribute("uv", new S(i, 2)), v[e] = a;
	}
	let y = {
		parts: v,
		material: r.material,
		headName: r.name
	};
	return Ss.set(t, y), y;
}
function H(e, t, n = null, r = !0) {
	let i = e.attributes.position, a = e.attributes.normal, o = e.attributes.uv, s = [], c = [], l = [], u = new A(), d = new A(), f = new A(), p = new A(), m = new A();
	for (let e = 0; e < i.count; e += 3) {
		d.set(0, 0, 0);
		for (let t = 0; t < 3; t++) d.add(u.fromBufferAttribute(i, e + t));
		if (d.multiplyScalar(1 / 3), u.fromBufferAttribute(i, e), p.fromBufferAttribute(i, e + 1).sub(u), m.fromBufferAttribute(i, e + 2).sub(u), f.crossVectors(p, m).normalize(), t(d, f)) for (let t = 0; t < 3; t++) u.fromBufferAttribute(i, e + t), n && n(u), s.push(u.x, u.y, u.z), c.push(a.getX(e + t), a.getY(e + t), a.getZ(e + t)), o && l.push(o.getX(e + t), o.getY(e + t));
	}
	let h = new Pe();
	return h.setAttribute("position", new S(s, 3)), h.setAttribute("normal", new S(c, 3)), o && h.setAttribute("uv", new S(l, 2)), n && r && h.computeVertexNormals(), h;
}
function ws(...e) {
	let t = {};
	for (let n of [
		"position",
		"normal",
		"uv"
	]) {
		let r = e.map((e) => e.attributes[n]).filter(Boolean);
		if (r.length !== e.length) continue;
		let i = r[0].itemSize, a = new Float32Array(r.reduce((e, t) => e + t.array.length, 0)), o = 0;
		for (let e of r) a.set(e.array, o), o += e.array.length;
		t[n] = new S(a, i);
	}
	let n = new Pe();
	for (let [e, r] of Object.entries(t)) n.setAttribute(e, r);
	return n;
}
var Ts = null, Es = (e) => Math.abs(e.x) < .11 && e.y > .17 && e.y < .46 && e.z > .44, Ds = (e, t) => Math.abs(e.x) < .17 && e.y > .1 && e.y < .2 && e.z > .34 && e.z < .5 && t.y > .35;
async function Os(e) {
	if (Ts) return Ts;
	let t = await Cs(e, "Knight"), n = await Cs(e, "Barbarian"), r = ws(H(t.parts["0,0"], (e) => e.z > .05 && e.y < .6), H(n.parts["0,0"], (e) => !(Math.abs(e.x) < .36 && e.z > .2 && e.y < .5)));
	return Ts = {
		skin: H(r, (e, t) => !Ds(e, t)),
		wedge: H(r, Ds),
		whole: r,
		nose: H(r, Es),
		noNose: H(r, (e, t) => !Ds(e, t) && !Es(e))
	}, Ts;
}
var ks = new A(0, .42, -.02), As = (e) => (t) => {
	let n = typeof e == "function" ? e(t) : e;
	t.sub(ks).multiplyScalar(1 + n).add(ks);
}, js = (e) => e.z > .3 && e.y > .4 && e.y < .62 && Math.abs(e.x) < .38, Ms = (e) => Math.abs(e.x) > .46 && e.y > .12 && e.y < .52 && e.z > -.2 && e.z < .2, Ns = (e, t, n) => {
	let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}, Ps = (e, t, n) => e + (t - e) * n, Fs = (e, t, n) => Math.exp(-((e - t) / n) * ((e - t) / n)), Is = {
	normal: null,
	thin: (e) => {
		e.x *= .86, e.z = -.02 + (e.z + .02) * .97;
	},
	thick: (e) => {
		e.x *= 1.15, e.z = -.02 + (e.z + .02) * 1.05;
	},
	round: (e) => {
		e.x *= 1.08 * (1 + .07 * Fs(e.y, .25, .22)), e.y = .5 + (e.y - .5) * .92;
	},
	oblong: (e) => {
		e.y *= 1.13, e.x *= .92;
	},
	pear: (e) => {
		e.x *= Ps(1.17, .85, Ns(.02, .95, e.y));
	}
}, Ls = (e, t, n) => H(e, t, As(n));
function Rs(e) {
	let t = new N(e, new et({ side: 2 })), n = new te();
	return (e, r, i = new A(0, 0, -1)) => {
		n.set(new A(e, r, 0).addScaledVector(i, -3), i);
		let a = n.intersectObject(t)[0];
		if (!a) return {
			p: new A(e, r, .45),
			n: new A(0, 0, 1)
		};
		let o = a.face.normal.clone();
		return o.dot(i) > 0 && o.negate(), {
			p: a.point.clone(),
			n: o
		};
	};
}
var zs = (e, t) => (e.quaternion.setFromUnitVectors(new A(0, 0, 1), t), e);
function Bs(e, t, n, r, i = .012, a = 5) {
	let o = t.map(([t, n]) => {
		let r = e(t, n);
		return r.p.addScaledVector(r.n, i);
	}), s = new Ve(o), c = new ie(s, Math.max(4, t.length * 2), n, a, !1), l = new N(c, r);
	return l.scale.set(1, 1, 1), l;
}
var Vs = (e, t, n, r = 7) => Array.from({ length: r }, (i, a) => {
	let o = -1 + 2 * a / (r - 1);
	return [o * e, t + n(o)];
}), Hs = {
	x: .17,
	y: .365
}, Us = {
	round: {
		w: 1,
		h: 1,
		tilt: 0
	},
	wide: {
		w: 1.08,
		h: 1.16,
		tilt: 0
	},
	narrow: {
		w: 1.06,
		h: .74,
		tilt: .05,
		lash: 1.25,
		lower: !0
	},
	tired: {
		w: 1,
		h: .86,
		tilt: -.1,
		fold: !0,
		lower: !0
	},
	sharp: {
		w: 1.12,
		h: .78,
		tilt: .16,
		lash: 1.2
	}
};
function Ws(e, t, n, r) {
	let i = new m(), a = Us[t.eyes] || Us.round, o = .068;
	for (let t of [-1, 1]) {
		let { p: s, n: c } = e(t * Hs.x, Hs.y), l = zs(new m(), c);
		if (l.position.copy(s), l.rotation.z += t * a.tilt, r) {
			let e = new N(new Ge(o, 10, 6), n.lash);
			e.scale.set(1.15 * a.w, 1.1 * Math.min(1, a.h + .1), .4), l.add(e), e.userData.part = t < 0 ? "eyeA" : "eyeB", i.add(l);
			continue;
		}
		{
			let e = new N(new Ge(o, 14, 8), n.white);
			e.scale.set(a.w, .66 * a.h, .32), l.add(e);
			let r = new N(new Ie(o * .56, 14), n.iris);
			r.position.z = o * .33, r.position.y = -.00272, l.add(r);
			let i = new N(new Ie(o * .26, 10), n.pupil);
			i.position.set(0, -.00272, o * .335), l.add(i);
			let s = new N(new Ie(o * .12, 6), n.glint);
			if (s.position.set(o * .16 * -t, o * .14, o * .34), l.add(s), a.fold) {
				let e = new N(new k(o * a.w * 1.02, o * .07, 3, 12, Math.PI * .8), n.crease);
				e.rotation.z = Math.PI * .1, e.scale.set(1, .66 * a.h + .28, 1), e.position.set(0, o * .1, o * .12), l.add(e);
			}
		}
		let u = new N(new k(o * a.w, o * .17 * (a.lash ?? 1), 4, 12, Math.PI * .9), n.lash);
		if (u.rotation.z = Math.PI * .05, u.scale.set(1, .66 * a.h, 1), u.position.z = o * .24, l.add(u), a.lower && !r) {
			let e = new N(new k(o * a.w * .86, o * .06, 3, 10, Math.PI * .6), n.crease);
			e.rotation.z = Math.PI * 1.2, e.scale.set(1, .42 * a.h, 1), e.position.set(0, -.00544, o * .2), l.add(e);
		}
		l.traverse((e) => {
			e.isMesh && (e.userData.part = t < 0 ? "eyeA" : "eyeB");
		}), i.add(l);
	}
	return i;
}
var Gs = {
	straight: {
		y: (e) => 0,
		r: .022
	},
	arched: {
		y: (e) => .03 * Math.sin(Math.PI * e) - .01 * e,
		r: .02
	},
	heavy: {
		y: (e) => .008 * Math.sin(Math.PI * e) - .012,
		r: .034
	},
	angry: {
		y: (e) => -.035 + .05 * e,
		r: .026
	},
	worried: {
		y: (e) => .03 - .045 * e,
		r: .022
	},
	thin: {
		y: (e) => .022 * Math.sin(Math.PI * e),
		r: .012
	}
};
function Ks(e, t, n) {
	let r = new m(), i = Gs[t.brows] || Gs.straight;
	for (let a of [-1, 1]) {
		let o = Array.from({ length: 5 }, (e, t) => {
			let n = t / 4;
			return [a * (.07 + .2 * n), .475 + i.y(n)];
		});
		r.add(Bs(e, o, i.r * (t.browWeight ?? 1), n.brow, .018));
	}
	return r;
}
var qs = {
	line: {
		w: .1,
		f: (e) => 0
	},
	smile: {
		w: .11,
		f: (e) => .022 * e * e - .004
	},
	grin: {
		w: .12,
		f: (e) => .03 * e * e - .008,
		open: .6
	},
	frown: {
		w: .1,
		f: (e) => -.02 * e * e
	},
	smirk: {
		w: .1,
		f: (e) => e > 0 ? .03 * e * e : -.004 * e * e
	},
	grim: {
		w: .12,
		f: (e) => -.008 * e * e,
		thin: !0
	},
	open: {
		w: .08,
		f: (e) => 0,
		open: 1
	}
}, Js = .168;
function Ys(e, t, n, r) {
	let i = new m(), a = qs[t.mouth] || qs.line, o = a.w * (t.mouthWidth ?? 1);
	if (i.add(Bs(e, Vs(o, Js, a.f, 7), r ? .011 : a.thin ? .012 : .017, n.mouth, .016)), a.open) {
		let { p: t, n: r } = e(0, .156), s = zs(new N(new Ge(o * .55, 10, 6), n.pupil), r);
		s.position.copy(t), s.scale.set(1, .42 * a.open, .25), i.add(s);
	}
	return i;
}
function Xs(e) {
	let t = new d(.3, .36, 8, 10), n = t.attributes.position;
	for (let t = 0; t < n.count; t++) {
		let r = n.getX(t), i = n.getY(t) + .31, a = (e(-.16, i).p.z + e(.16, i).p.z) / 2;
		n.setXYZ(t, r, i, a + .018 * (1 - (r / .15) ** 2) * (1 - ((i - .31) / .18) ** 2));
	}
	return t.computeVertexNormals(), t.toNonIndexed();
}
var Zs = {
	button: {
		tipY: .27,
		out: .065,
		tip: .055,
		bridge: .024,
		wing: .036
	},
	long: {
		tipY: .21,
		out: .115,
		tip: .048,
		bridge: .036,
		wing: .034
	},
	hook: {
		tipY: .205,
		out: .11,
		tip: .05,
		bridge: .038,
		wing: .036,
		hump: .04,
		droop: .025
	},
	broad: {
		tipY: .235,
		out: .085,
		tip: .072,
		bridge: .046,
		wing: .058
	},
	snub: {
		tipY: .275,
		out: .075,
		tip: .052,
		bridge: .026,
		wing: .036,
		up: .025
	}
};
function Qs(e, t, n) {
	let r = new m(), i = Zs[t.nose];
	if (!i) return r;
	let a = e(0, .43).p, o = e(0, i.tipY).p, s = new A(0, i.tipY + (i.up || 0) - (i.droop || 0), o.z + i.out), c = (e, t, r, i) => {
		let a = new N(new O(r, i, e.distanceTo(t), 6), n.skin);
		return a.position.copy(e).add(t).multiplyScalar(.5), a.quaternion.setFromUnitVectors(new A(0, 1, 0), e.clone().sub(t).normalize()), a;
	}, l = a.clone().lerp(s, .5);
	if (i.hump && (l.z += i.hump), r.add(c(a.clone().setZ(a.z - .01), l, i.bridge * .7, i.bridge), c(l, s, i.bridge, i.tip * .9)), i.hump) {
		let e = new N(new f(i.bridge * 1.05, 1), n.skin);
		e.position.copy(l), r.add(e);
	}
	let u = new N(new f(i.tip, 1), n.skin);
	u.position.copy(s), u.scale.set(1.05, .9, .9), r.add(u);
	for (let e of [-1, 1]) {
		let t = new N(new f(i.wing, 1), n.skin);
		t.position.set(e * i.tip * 1.05, s.y - i.tip * .35, s.z - i.out * .45), t.scale.set(1, .8, .9), r.add(t);
		let a = new N(new Ie(i.wing * .42, 6), n.crease);
		a.rotation.x = Math.PI / 2, a.position.set(e * i.tip * .6, s.y - i.tip * .85, s.z - i.out * .25), r.add(a);
	}
	return r;
}
function $s(e, t, n) {
	return (r) => {
		if (Ms(r)) return !1;
		let i = Ns(-.25, .3, r.z), a = Ps(n, Ps(t, e, Ns(.15, .38, r.z)), i);
		return r.y > a;
	};
}
var ec = {
	bald: null,
	crop: {
		line: $s(.72, .44, .1),
		grow: .035
	},
	short: {
		line: $s(.66, .4, .05),
		grow: (e) => .04 + .03 * Ns(.6, .95, e.y)
	},
	receding: {
		line: (e) => $s(.86, .44, .1)(e) && !(e.z > .2 && e.y < .9 && Math.abs(e.x) < .3 + (e.y - .72) * 1.2),
		grow: .03
	},
	crest: {
		line: (e) => Math.abs(e.x) < .14 && e.y > .5 && !Ms(e),
		grow: (e) => .03 + .14 * Ns(.55, .95, e.y)
	},
	bun: {
		line: $s(.7, .42, .12),
		grow: .04,
		knot: {
			at: [
				0,
				.8,
				-.44
			],
			r: .19
		}
	},
	topknot: {
		line: $s(.72, .44, .1),
		grow: .03,
		knot: {
			at: [
				0,
				1.04,
				-.08
			],
			r: .15
		}
	},
	braid: {
		line: $s(.7, .42, .08),
		grow: .04,
		braid: !0
	},
	long: { kk: "Rogue" },
	ponytail: {
		kk: "Mage",
		tie: !0
	},
	swept: { kk: "Knight" }
};
async function tc(e, t, n, r, i = null) {
	let a = (e) => {
		let t = new A(...e);
		return i && i(t), t;
	}, o = new m(), s = ec[n.hair ?? "crop"];
	if (!s) return o;
	if (s.kk) {
		let t = await Cs(e, s.kk);
		return o.add(new N(H(t.parts["1,0"], (e) => !js(e), (e) => {
			i && i(e), As(.05)(e);
		}), r.hair)), s.tie && t.parts["1,1"] && o.add(new N(i ? H(t.parts["1,1"], () => !0, i) : t.parts["1,1"], r.tie)), o;
	}
	if (o.add(new N(H(t, s.line, As(s.grow)), r.hair)), s.knot) {
		let e = new N(new f(s.knot.r, 1), r.hair);
		e.position.copy(a(s.knot.at)), o.add(e);
		let t = new N(new k(s.knot.r * .62, .025, 4, 10), r.tie);
		t.position.copy(a(s.knot.at)), t.position.z += s.knot.at[2] < -.2 ? s.knot.r * .55 : 0, t.position.y -= s.knot.at[2] < -.2 ? 0 : s.knot.r * .6, s.knot.at[2] >= -.2 && (t.rotation.x = Math.PI / 2), o.add(e, t);
	}
	if (s.braid) {
		[
			[
				.4,
				.42,
				-.18
			],
			[
				.44,
				.18,
				-.02
			],
			[
				.42,
				-.08,
				.1
			],
			[
				.38,
				-.34,
				.18
			],
			[
				.35,
				-.56,
				.2
			]
		].forEach((e, t) => {
			let n = new N(new f(.1 - t * .008, 0), r.hair);
			n.position.copy(a(e)), n.rotation.set(t, t * .7, 0), o.add(n);
		});
		let e = new N(new k(.05, .022, 4, 8), r.tie);
		e.position.copy(a([
			.35,
			-.62,
			.2
		])), e.rotation.x = Math.PI / 2, o.add(e);
	}
	return o;
}
var nc = (e) => e.y < .3 && e.z > -.22 && !Ms(e) && !(Math.abs(e.x) < .14 && e.y > .1 && e.y < .26 && e.z > .3);
async function rc(e, t, n, r, i, a = null) {
	let o = new m(), s = r.beard;
	if (!s) return o;
	if (s === "stubble" && o.add(new N(H(t, nc, As(.008)), i.stubble)), (s === "short" || s === "goatee") && o.add(new N(H(t, s === "goatee" ? (e) => nc(e) && Math.abs(e.x) < .16 && e.y < .14 && e.z > .2 : nc, As((e) => .04 + .05 * Ns(.2, -.05, e.y))), i.beard)), s === "full") {
		let t = await Cs(e, "Barbarian");
		o.add(new N(H(t.parts["1,0"], (e) => !js(e), (e) => {
			a && a(e), As(.01)(e);
		}), i.beard));
	}
	return (s === "short" || s === "goatee" || s === "mustache") && o.add(Bs(n, Vs(.13, .225, (e) => -.035 * e * e + (s === "mustache" ? -.02 * e * e * e * e : 0), 7), .028, i.beard, .02)), o;
}
function ic(e, t, n) {
	let r = new m();
	for (let i of t.marks || []) {
		if (i === "scar" && r.add(Bs(e, [[.1, .58], [.13, .5]], .012, n.scar, .02, 4), Bs(e, [[.2, .3], [.24, .2]], .012, n.scar, .016, 4)), i === "scar_cheek" && r.add(Bs(e, [
			[-.32, .3],
			[-.26, .25],
			[-.2, .21]
		], .012, n.scar, .014, 4)), i === "freckles") for (let [t, i] of [
			[.2, .27],
			[.26, .24],
			[.15, .24],
			[.23, .2],
			[.3, .28],
			[.18, .3]
		]) for (let a of [-1, 1]) {
			let { p: o, n: s } = e(a * t, i), c = zs(new N(new Ie(.011, 5), n.freckle), s);
			c.position.copy(o).addScaledVector(s, .006), r.add(c);
		}
		if (i === "blush") for (let t of [-1, 1]) {
			let { p: i, n: a } = e(t * .25, .235), o = zs(new N(new Ie(.06, 10), n.blush), a);
			o.position.copy(i).addScaledVector(a, .004), o.scale.y = .6, r.add(o);
		}
		if (i === "wrinkles") {
			for (let t of [-1, 1]) r.add(Bs(e, [[t * .262, Hs.y - .015], [t * .292, Hs.y - .035]], .005, n.crease, .01, 3));
			r.add(Bs(e, Vs(.14, .62, (e) => .01 * (1 - e * e)), .005, n.crease, .01, 3));
			for (let t of [-1, 1]) r.add(Bs(e, [
				[t * .1, .26],
				[t * .14, .2],
				[t * .145, .16]
			], .006, n.crease, .01, 3));
		}
		if (i === "eyepatch") {
			let { p: t, n: i } = e(.17, Hs.y), a = zs(new N(new Ie(.1, 10), n.patch), i);
			a.position.copy(t).addScaledVector(i, .05), a.scale.y = .85, r.add(a), r.add(Bs(e, [
				[-.4, .62],
				[-.1, .55],
				[.17, Hs.y + .05],
				[.44, .35]
			], .013, n.patch, .03, 4));
		}
		if (i === "earring") {
			let e = new N(new k(.035, .012, 5, 10), n.gold);
			e.position.set(.52, .18, .02), e.rotation.y = Math.PI / 2, r.add(e);
		}
	}
	return r;
}
function ac(e, t, n) {
	let r = new m();
	if (e.ears !== "pointed") return r;
	let i = e.earSize || 1.2, a = .62 * i, s = .15 * i;
	for (let e of [-1, 1]) {
		let c = new A(e * .5, .33, -.04);
		n && n(c);
		let l = new A(e, .5, -.6).normalize(), u = new A(0, .35, 1), d = u.addScaledVector(l, -u.dot(l)).normalize(), f = new A().crossVectors(l, d), p = new o().setFromRotationMatrix(new ge().makeBasis(f, l, d)), m = (e, t, n, r) => {
			let a = new N(new $e(e, t, 8), n);
			return a.quaternion.copy(p), a.scale.set(1, 1, .32), a.position.copy(c).addScaledVector(l, t / 2 - .06 * i).addScaledVector(d, r), a;
		};
		r.add(m(s, a, t.skin, 0), m(s * .55, a * .72, t.earIn, s * .2));
	}
	return r;
}
Object.keys(ec), Object.keys(Us), Object.keys(Gs), Object.keys(qs), [...Object.keys(Zs)], Object.keys(vs), Object.keys(bs), Object.keys(Is);
async function oc(e, t, n, { far: r = !1 } = {}) {
	let i = n.skull === "own", a = i ? await Cs(e, t) : null, o = await Cs(e, t), s = xs(vs, n.skin, vs.fair), c = xs(ys, n.hairColor, ys.brown), l = {
		skin: V(s, .72),
		hair: V(c, .85),
		brow: V(xs(ys, n.browColor, c.clone().multiplyScalar(.72)), .9),
		beard: V(xs(ys, n.beardColor, c), .9),
		stubble: V(s.clone().multiplyScalar(.7).lerp(xs(ys, n.beardColor, c), .35), 1),
		white: V("#f2ece2", .35),
		iris: V(xs(bs, n.iris, bs.brown), .3),
		pupil: V("#120c0a", .4),
		glint: new et({ color: "#ffffff" }),
		lash: V("#1c120e", .8),
		lid: V(s.clone().multiplyScalar(.94), .72),
		crease: V(s.clone().multiplyScalar(.78), .95),
		mouth: V(s.clone().lerp(new j("#3a1210"), .7), .95),
		lip: V(s.clone().multiplyScalar(.86).lerp(new j("#a04a40"), .22), .95),
		scar: V(s.clone().multiplyScalar(.72).lerp(new j("#a04a44"), .35), .9),
		freckle: V(s.clone().lerp(new j("#6a2a10"), .5), .9),
		blush: V(s.clone().lerp(new j("#e05a58"), .4), .8),
		patch: V("#1a1414", .7),
		gold: V("#d8a848", .3, .8),
		tie: V(xs(ys, n.tieColor, "#6a3a22"), .8),
		earIn: V(s.clone().multiplyScalar(.62).lerp(new j("#7a3a34"), .25), .9)
	}, u = new m();
	u.name = "Face";
	let d = Is[n.shape], f = (e) => d && e ? H(e, () => !0, d, !1) : e, p = i ? null : await Os(e), h = p && {
		skin: f(p.skin),
		wedge: f(p.wedge),
		whole: f(p.whole),
		noNose: f(p.noNose)
	}, g = i ? f(a.parts["0,0"]) : h.whole, _ = i || !Zs[n.nose], v = _ ? null : f(Xs(Rs(p.whole))), y = (e, t) => (e.traverse((e) => {
		e.isMesh && !e.userData.part && (e.userData.part = t);
	}), e);
	if (u.add(y(new N(i ? g : _ ? h.skin : h.noNose, l.skin), "skin")), v && u.add(y(new N(v, l.skin), "skin")), h && u.add(y(new N(h.wedge, r ? l.skin : l.lip), "skin")), i) for (let e of n.keep || ["1,1"]) a.parts[e] && u.add(new N(f(a.parts[e]), a.material));
	let b = Rs(_ ? g : ws(h.noNose, h.wedge, v)), x = d ? (e, t, n) => {
		let r = new A(e, t, .45);
		return d(r), b(r.x, r.y, n);
	} : b;
	return u.add(y(Ws(x, n, l, r), "eye"), y(Ks(x, n, l), "brow"), y(Ys(x, n, l, r), "mouth"), y(Qs(x, n, l), "skin"), y(await rc(e, g, x, n, l, d), "hair")), u.add(y(ac(n, l, d), "skin")), r || u.add(ic(x, n, l)), i || u.add(y(await tc(e, g, n, l, d), "hair")), u.traverse((e) => {
		e.isMesh && (e.frustumCulled = !1, e.userData.face = !0);
	}), {
		head: u,
		replaces: [o.headName],
		skull: g,
		on: x
	};
}
//#endregion
//#region ember3d/body.js
var U = (e, t, n) => new A(e, t, n), sc = (e, t, n) => {
	let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}, cc = (e, t, n) => e + (t - e) * n, lc = (e, t = .8, n = 0) => new P({
	color: e,
	roughness: t,
	metalness: n
}), uc = {
	thin: {
		w: .76,
		d: .8,
		limb: .72,
		belly: 0,
		hip: .84
	},
	normal: {
		w: 1,
		d: 1,
		limb: 1,
		belly: 0,
		hip: 1
	},
	thick: {
		w: 1.32,
		d: 1.34,
		limb: 1.34,
		belly: .12,
		hip: 1.22
	}
}, dc = class {
	constructor(e) {
		this.bones = e, this.P = [], this.SI = [], this.SW = [], this.idx = [];
	}
	v(e, t) {
		let n = this.P.length / 3;
		this.P.push(e.x, e.y, e.z);
		let r = t.filter(([, e]) => e > 1e-4).slice(0, 4), i = r.reduce((e, [, t]) => e + t, 0) || 1;
		for (let e = 0; e < 4; e++) {
			let t = r[e];
			this.SI.push(t ? this.bones[t[0]] ?? 0 : 0), this.SW.push(t ? t[1] / i : 0);
		}
		return n;
	}
	p(e) {
		return U(this.P[e * 3], this.P[e * 3 + 1], this.P[e * 3 + 2]);
	}
	tri(e, t, n, r) {
		let i = this.p(e);
		this.p(t).sub(i).cross(this.p(n).sub(i)).dot(i.clone().add(this.p(t)).add(this.p(n)).multiplyScalar(1 / 3).sub(r)) < 0 ? this.idx.push(e, n, t) : this.idx.push(e, t, n);
	}
	mesh(e, t, r) {
		let i = new Pe();
		i.setAttribute("position", new S(this.P, 3)), i.setAttribute("skinIndex", new n(this.SI, 4)), i.setAttribute("skinWeight", new S(this.SW, 4)), i.setIndex(this.idx), i.computeVertexNormals();
		let a = new p(i, e);
		return a.bind(t, r), a.frustumCulled = !1, a.userData.body = !0, a;
	}
};
function fc(e, t, n, r, i, a, o, s, c = 0) {
	let l = [];
	for (let u = 0; u < o; u++) {
		let d = 2 * Math.PI * u / o, f = Math.sin(d), p = t.clone().addScaledVector(n, Math.cos(d) * i).addScaledVector(r, f * a + (f > 0 ? c * f : 0));
		l.push(e.v(p, s));
	}
	return l;
}
function pc(e, t, n, r, i) {
	let a = t.length, o = r.clone().add(i).multiplyScalar(.5);
	for (let r = 0; r < a; r++) {
		let i = (r + 1) % a;
		e.tri(t[r], t[i], n[i], o), e.tri(t[r], n[i], n[r], o);
	}
}
function mc(e, t, n, r, i) {
	let a = e.v(n, r), o = n.clone().sub(i.clone().multiplyScalar(.1));
	for (let n = 0; n < t.length; n++) e.tri(a, t[n], t[(n + 1) % t.length], o);
}
function hc(e, t, n, r, i = 8, { caps: a = [!0, !0], steps: o = 3 } = {}) {
	let s = null, c = null, l = (a, o) => {
		let s = t[a], c = t[Math.min(a + 1, t.length - 1)], l = s.p.clone().lerp(c.p, o), u = [cc(s.r[0], c.r[0], o), cc(s.r[1], c.r[1], o)], d = [[s.bone, 1]];
		if (a + 1 < t.length - 1 || a + 1 === t.length - 1 && t[a + 1].bone !== s.bone) {
			let e = sc(.62, 1, o) * .5;
			d[0][1] -= e, d.push([c.bone, e]);
		}
		if (a > 0) {
			let e = (1 - sc(0, .38, o)) * .5;
			d[0][1] -= e, d.push([t[a - 1].bone, e]);
		}
		return {
			c: l,
			r: fc(e, l, n, r, u[0], u[1], i, d),
			w: d
		};
	}, u = [];
	for (let e = 0; e < t.length - 1; e++) for (let t = 0; t < o; t++) u.push(l(e, t / o));
	u.push(l(t.length - 2, 1));
	for (let t of u) s && pc(e, s.r, t.r, c, t.c), s = t, c = t.c;
	let d = t[t.length - 1].p.clone().sub(t[0].p).normalize();
	a[0] && mc(e, u[0].r, u[0].c, u[0].w, d.clone().negate()), a[1] && mc(e, u[u.length - 1].r, u[u.length - 1].c, u[u.length - 1].w, d);
}
var gc = [
	[
		.36,
		.23,
		.18
	],
	[
		.46,
		.29,
		.21
	],
	[
		.62,
		.27,
		.2
	],
	[
		.82,
		.3,
		.22
	],
	[
		.98,
		.33,
		.23
	],
	[
		1.1,
		.31,
		.21
	],
	[
		1.18,
		.2,
		.16
	],
	[
		1.25,
		.1,
		.09
	]
], _c = (e) => {
	if (e < .55) return [["hips", 1]];
	if (e < .78) {
		let t = sc(.55, .78, e);
		return [["hips", 1 - t], ["spine", t]];
	}
	if (e < .98) {
		let t = sc(.78, .98, e);
		return [["spine", 1 - t], ["chest", t]];
	}
	return [["chest", 1]];
};
function vc(e, t, { y0: n = .36, y1: r = 1.25, grow: i = 0, seg: a = 12, capBottom: o = !0, capTop: s = !0, flare: c = 0 } = {}) {
	let l = gc.filter(([e]) => e >= n - 1e-6 && e <= r + 1e-6), u = U(1, 0, 0), d = U(0, 0, 1), f = null, p = null, m = null;
	for (let [n, r, o] of l) {
		let s = t.belly * sc(.55, .7, n) * (1 - sc(.85, 1, n)), l = n < .7 ? cc(t.hip, t.w, sc(.46, .7, n)) : t.w, h = U(0, n, 0), g = fc(e, h, u, d, r * l + i + (n < .5 ? c : 0), o * t.d + i, a, _c(n), s);
		f && pc(e, f.r, g, f.c, h), f = {
			r: g,
			c: h
		}, p ||= f, m = f;
	}
	o && mc(e, p.r, p.c, _c(p.c.y), U(0, -1, 0)), s && mc(e, m.r, m.c, _c(m.c.y), U(0, 1, 0));
}
function yc(e, t, { y0: n = .62, y1: r = .1, flare: i = .14, seg: a = 16, grow: o = .02 } = {}) {
	let s = null, [, c, l] = gc.find(([e]) => e >= n) || gc[2];
	for (let u = 0; u <= 5; u++) {
		let d = u / 5, f = cc(n, r, d), p = U(0, f, 0), m = c * t.hip + o + i * d, h = l * t.d + o + i * d * .8, g = [];
		for (let t = 0; t < a; t++) {
			let n = 2 * Math.PI * t / a, r = Math.cos(n) * m, i = Math.sin(n) * h, o = sc(-.1, .1, r), s = 1 - sc(.42, .62, f);
			g.push(e.v(U(r, f, i), [
				["hips", 1 - s],
				["upperlegl", s * o],
				["upperlegr", s * (1 - o)]
			]));
		}
		s && pc(e, s.ids, g, s.c, p), s = {
			ids: g,
			c: p
		};
	}
}
function bc(e, t, n, r, i, a, o, s = 4, c = 6) {
	let l = [];
	for (let u = 0; u <= c; u++) {
		let d = cc(r, i, u / c), f = [];
		for (let r = 0; r <= s; r++) {
			let i = cc(t, n, r / s);
			f.push(e.v(U(i, d, a(i, d)), o(i, d)));
		}
		l.push(f);
	}
	let u = U(0, (r + i) / 2, 0);
	for (let t = 0; t < c; t++) for (let n = 0; n < s; n++) e.tri(l[t][n], l[t][n + 1], l[t + 1][n + 1], u), e.tri(l[t][n], l[t + 1][n + 1], l[t + 1][n], u);
}
function xc(e, t, n, r = 0) {
	let i = t.limb, a = r;
	for (let r of [1, -1]) {
		let o = r > 0 ? "l" : "r", s = U(0, 1, 0), c = U(0, 0, 1), l = U(1, 0, 0);
		n.arms && hc(e, [
			{
				p: U(r * .2, 1.11, 0),
				r: [.11 * i + a, .1 * i + a],
				bone: "upperarm" + o
			},
			{
				p: U(r * .45, 1.11, 0),
				r: [.088 * i + a, .085 * i + a],
				bone: "lowerarm" + o
			},
			{
				p: U(r * n.armTo, 1.11, 0),
				r: [.072 * i + a, .07 * i + a],
				bone: "wrist" + o
			}
		].slice(0, n.armTo > .6 ? 3 : 2), s, c, 8, { caps: [!0, !0] }), n.hands && hc(e, [
			{
				p: U(r * .7, 1.11, 0),
				r: [.075 * i + a, .07 * i + a],
				bone: "wrist" + o
			},
			{
				p: U(r * .8, 1.11, 0),
				r: [.088 * i + a, .075 * i + a],
				bone: "hand" + o
			},
			{
				p: U(r * .92, 1.09, 0),
				r: [.06 * i + a, .055 * i + a],
				bone: "hand" + o
			}
		], s, c, 8), n.legs && hc(e, [
			{
				p: U(r * .16, .56, 0),
				r: [.13 * i * t.hip + a, .13 * i + a],
				bone: "upperleg" + o
			},
			{
				p: U(r * .17, .29, .01),
				r: [.1 * i + a, .1 * i + a],
				bone: "lowerleg" + o
			},
			{
				p: U(r * .17, n.legTo, -.01),
				r: [.08 * i + a, .082 * i + a],
				bone: "foot" + o
			}
		], l, c, 8, { caps: [!1, !0] }), n.feet && hc(e, [
			{
				p: U(r * .17, .065, -.08),
				r: [.085 * i + a, .07 + a],
				bone: "foot" + o
			},
			{
				p: U(r * .17, .065, .05),
				r: [.09 * i + a, .07 + a],
				bone: "toes" + o
			},
			{
				p: U(r * .17, .055, .19),
				r: [.075 * i + a, .055 + a],
				bone: "toes" + o
			}
		], l, U(0, 1, 0), 8);
	}
}
var Sc = {
	fighter: {
		top: "#4a3a34",
		sleeves: "#4a3a34",
		hands: "#3a2a20",
		legs: "#34303c",
		boots: "#3a2418",
		headgear: "helm",
		extras: [
			"breastplate",
			"pauldrons",
			"vambraces",
			"greaves",
			"belt",
			"tabard",
			"cape"
		],
		colors: {
			steel: "#8e959e",
			cloth: "#8a2a22",
			trim: "#c89a40",
			belt: "#3a2418"
		}
	},
	rogue: {
		top: "#2e4a32",
		sleeves: "#2a3a2c",
		hands: "#2a2018",
		legs: "#3a3028",
		boots: "#241810",
		headgear: "hood",
		extras: [
			"belt",
			"pouches",
			"mantle"
		],
		colors: {
			cloth: "#24402a",
			hood: "#2a4a30",
			belt: "#4a2e1a",
			trim: "#8a6a3a"
		}
	},
	mage: {
		top: "#3c2e6a",
		sleeves: "#3c2e6a",
		hands: null,
		legs: "#2a2440",
		boots: "#4a2a1a",
		headgear: "hat",
		extras: [
			"robe",
			"belt",
			"mantle"
		],
		colors: {
			cloth: "#3c2e6a",
			robe: "#3c2e6a",
			hat: "#3a2c66",
			band: "#c86a2a",
			belt: "#6a3a1a",
			trim: "#c89a40"
		}
	},
	cleric: {
		top: "#e2dccb",
		sleeves: "#e2dccb",
		hands: null,
		legs: "#8a8070",
		boots: "#5a3a22",
		headgear: "coif",
		extras: [
			"robe",
			"tabard",
			"belt"
		],
		colors: {
			robe: "#e2dccb",
			cloth: "#d8d0bc",
			trim: "#c89a40",
			coif: "#ece6d8",
			belt: "#8a6a4a"
		},
		robeTo: .2
	}
};
async function Cc(e, t, n, { far: r = !1, findNode: i } = {}) {
	let a = null;
	t.traverse((e) => {
		e.isSkinnedMesh && /Body/.test(e.name) && (a = e);
	});
	let o = a.skeleton, s = a.bindMatrix, c = a.parent;
	t.traverse((e) => {
		e.isMesh && (e.visible = !1);
	});
	let l = Object.fromEntries(o.bones.map((e, t) => [e.name, t])), u = uc[n.build] || uc.normal, d = Sc[n.outfit] || Sc.fighter, f = d.colors || {}, p = { ...n.face }, h = n.headgear === void 0 ? d.headgear : n.headgear;
	h && h !== "hat" && ![
		"crop",
		"short",
		"bald",
		void 0
	].includes(p.hair) && (p.hair = "crop");
	let g = p.skin, _ = (e, t) => {
		let n = new dc(l);
		e(n), n.idx.length && c.add(n.mesh(lc(t, .8), o, s));
	}, { SKIN: v } = await Promise.resolve().then(() => gs), y = v[g] || g || v.fair;
	_((e) => vc(e, u), d.top), _((e) => xc(e, u, {
		arms: !0,
		armTo: .7
	}), d.sleeves), _((e) => xc(e, u, { hands: !0 }), d.hands || y), _((e) => xc(e, u, {
		legs: !0,
		legTo: .1
	}), d.legs), _((e) => xc(e, u, { feet: !0 }), d.boots), _((e) => hc(e, [
		{
			p: U(0, 1.18, 0),
			r: [.09 * u.limb, .085 * u.limb],
			bone: "chest"
		},
		{
			p: U(0, 1.3, .01),
			r: [.085 * u.limb, .08 * u.limb],
			bone: "head"
		},
		{
			p: U(0, 1.36, .01),
			r: [.08 * u.limb, .075 * u.limb],
			bone: "head"
		}
	], U(1, 0, 0), U(0, 0, 1), 8), y);
	for (let e of d.extras || []) {
		let t = (e) => (t, n) => (gc.find(([e]) => e >= n) || gc[gc.length - 1])[2] * u.d + e + u.belly * sc(.55, .7, n) * (1 - sc(.85, 1, n));
		if (e === "breastplate" && _((e) => vc(e, u, {
			y0: .62,
			y1: 1.18,
			grow: .03,
			capBottom: !1
		}), f.steel), e === "belt" && _((e) => vc(e, u, {
			y0: .46,
			y1: .62,
			grow: .035,
			capBottom: !1,
			capTop: !1,
			seg: 14
		}), f.belt), e === "pauldrons" && _((e) => {
			for (let t of [1, -1]) hc(e, [{
				p: U(t * .2, 1.12, 0),
				r: [.16 * u.limb, .16 * u.d],
				bone: t > 0 ? "upperarml" : "upperarmr"
			}, {
				p: U(t * .36, 1.1, 0),
				r: [.14 * u.limb, .14 * u.d],
				bone: t > 0 ? "upperarml" : "upperarmr"
			}], U(0, 1, 0), U(0, 0, 1), 10);
		}, f.steel), e === "vambraces" && _((e) => {
			for (let t of [1, -1]) hc(e, [{
				p: U(t * .5, 1.11, 0),
				r: [.1 * u.limb, .098 * u.limb],
				bone: t > 0 ? "lowerarml" : "lowerarmr"
			}, {
				p: U(t * .69, 1.11, 0),
				r: [.085 * u.limb, .083 * u.limb],
				bone: t > 0 ? "lowerarml" : "lowerarmr"
			}], U(0, 1, 0), U(0, 0, 1), 8);
		}, f.steel), e === "greaves" && _((e) => {
			for (let t of [1, -1]) hc(e, [{
				p: U(t * .17, .31, .01),
				r: [.115 * u.limb, .117 * u.limb],
				bone: t > 0 ? "lowerlegl" : "lowerlegr"
			}, {
				p: U(t * .17, .12, -.01),
				r: [.1 * u.limb, .1 * u.limb],
				bone: t > 0 ? "lowerlegl" : "lowerlegr"
			}], U(1, 0, 0), U(0, 0, 1), 8);
		}, f.steel), e === "pouches" && _((e) => {
			for (let t of [1, -1]) hc(e, [{
				p: U(t * .27 * u.hip, .5, .12),
				r: [.06, .05],
				bone: "hips"
			}, {
				p: U(t * .27 * u.hip, .4, .12),
				r: [.06, .05],
				bone: "hips"
			}], U(1, 0, 0), U(0, 0, 1), 6);
		}, f.belt), e === "mantle" && _((e) => {
			let t = U(1, 0, 0), n = U(0, 0, 1);
			pc(e, fc(e, U(0, 1.24, 0), t, n, .16 * u.w, .14 * u.d, 14, [["chest", 1]]), fc(e, U(0, 1.02, 0), t, n, .4 * u.w, .3 * u.d, 14, [["chest", 1]]), U(0, 1.24, 0), U(0, 1.02, 0));
		}, f.cloth), e === "robe" && _((e) => yc(e, u, {
			y1: d.robeTo ?? .08,
			flare: .13
		}), f.robe), e === "tabard") {
			let e = (e, t) => t > .62 ? _c(t) : [["hips", 1]];
			_((n) => bc(n, -.15, .15, .28, 1.08, t(.05), e), f.cloth), _((n) => {
				bc(n, -.17, -.14, .28, 1.08, t(.055), e, 1, 6), bc(n, .14, .17, .28, 1.08, t(.055), e, 1, 6);
			}, f.trim);
		}
		e === "cape" && _((e) => bc(e, -.3 * u.w, .3 * u.w, .18, 1.16, (e, t) => -((gc.find(([e]) => e >= t) || gc[gc.length - 1])[2] * u.d) - .06 - (1.16 - t) * .12, (e, t) => _c(Math.max(t, .5)), 5, 7), f.cloth);
	}
	let b = i(t, "head"), x = await oc(e, "Knight", p, { far: r });
	b.add(x.head);
	let S = new m(), C = x.skull, w = (e, t = .8, n = 0) => lc(e, t, n);
	C.computeBoundingBox();
	let T = C.boundingBox, E = (T.max.x - T.min.x) / 2, ee = T.max.y;
	if (h === "helm") {
		let e = w(f.steel, .4, .3);
		S.add(new N(Ls(C, (e) => e.y > .14 && !(e.z > .12 && e.y < .64 && Math.abs(e.x) < .4), .17), e)), S.add(new N(Ls(C, (e) => e.y > .08 && e.y < .55 && Math.abs(e.x) > .3 && e.z > -.15, .2), e)), S.add(new N(Ls(C, (e) => e.y > .56 && e.y < .68, .2), w(f.trim, .5, .4)));
		let t = new N(new M(.07, .3, .07), e), n = x.on(0, .5).p;
		t.position.set(0, .47, n.z + .14), S.add(t);
		let r = new N(new M(.07, .14, .9), w(f.trim, .5, .4));
		r.position.set(0, ee * 1.12 + .02, -.04), S.add(r);
	}
	if (h === "hood") {
		let e = new P({
			color: f.hood,
			roughness: .9,
			side: 2
		});
		S.add(new N(Ls(C, (e) => !(e.z > 0 && e.y < .84 && Math.abs(e.x) < .42), .26), e));
		let t = new N(new O(E * 1.2, E * 1.55, .5, 16, 1, !0, .7, Math.PI * 2 - 1.4), e);
		t.position.set(0, -.12, -.04), S.add(t);
		let n = new N(new $e(.22, .7, 8), e);
		n.position.set(0, .62, -.7), n.rotation.x = -1.95, S.add(n);
	}
	if (h === "coif") {
		let e = new P({
			color: f.coif,
			roughness: .95,
			side: 2
		});
		S.add(new N(Ls(C, (e) => !(e.z > .04 && e.y < .72 && Math.abs(e.x) < .4), .12), e));
		let t = new N(new O(E * 1.08, E * 1.45, .46, 16, 1, !0, .9, Math.PI * 2 - 1.8), e);
		t.position.set(0, -.1, -.02), S.add(t);
		let n = new N(Ls(C, (e) => e.y > .66 && e.y < .74 && e.z > -.1, .135), w(f.trim, .5, .4));
		S.add(n);
	}
	if (h === "hat") {
		let e = new m(), t = new P({
			color: f.hat,
			roughness: .85,
			side: 2
		}), n = new N(new O(E * 1.55, E * 1.6, .06, 24), t);
		e.add(n);
		let r = new N(new $e(E * .98, 1.05, 16, 1), t);
		r.position.y = .55, e.add(r);
		let i = new N(new O(E * .9, E * .99, .13, 16, 1, !0), w(f.band));
		i.position.y = .09, i.scale.setScalar(1.03), e.add(i);
		let a = new N(new $e(E * .2, .34, 8), t);
		a.position.set(0, 1.12, -.12), a.rotation.x = -.7, e.add(a), e.position.set(0, ee * .8, -.02), e.rotation.x = -.22, S.add(e);
	}
	S.traverse((e) => {
		e.isMesh && (e.frustumCulled = !1);
	}), b.add(S);
}
//#endregion
//#region ember3d/figure.js
var wc = {
	Knight: [
		"1H_Sword_Offhand",
		"Badge_Shield",
		"Rectangle_Shield",
		"Round_Shield",
		"Spike_Shield",
		"1H_Sword",
		"2H_Sword",
		"Knight_Helmet",
		"Knight_Cape"
	],
	Barbarian: [
		"1H_Axe_Offhand",
		"Barbarian_Round_Shield",
		"1H_Axe",
		"2H_Axe",
		"Mug",
		"Barbarian_Hat",
		"Barbarian_Cape"
	],
	Rogue: [
		"Knife_Offhand",
		"1H_Crossbow",
		"2H_Crossbow",
		"Knife",
		"Throwable",
		"Rogue_Cape"
	],
	Rogue_Hooded: [
		"Knife_Offhand",
		"1H_Crossbow",
		"2H_Crossbow",
		"Knife",
		"Throwable",
		"Rogue_Cape"
	],
	Mage: [
		"Spellbook",
		"Spellbook_open",
		"1H_Wand",
		"2H_Staff",
		"Mage_Hat",
		"Mage_Cape"
	]
}, Tc = {
	scale: { head: .62 },
	reach: {
		spine: 1.2,
		chest: 1.18,
		head: 1.1,
		lowerleg: 1.5,
		foot: 1.45,
		lowerarm: 1.3,
		wrist: 1.3
	}
};
function Ec(e) {
	e.traverse((e) => {
		if (!e.isBone) return;
		let t = e.name.replace(/\.?(l|r)$/, "");
		Tc.scale[t] && e.scale.multiplyScalar(Tc.scale[t]), Tc.reach[t] && e.position.multiplyScalar(Tc.reach[t]);
	});
}
var Dc = /Sword|Axe|Shield|Crossbow|Knife|Throwable|Spellbook|Wand|Staff|Mug/;
function Oc(e, t, n) {
	if (!t.height) {
		let t = new ze().setFromObject(e);
		return {
			box: t,
			ppu: n / (t.max.y - t.min.y)
		};
	}
	let r = new ze(), i = (e) => {
		for (let t = e; t; t = t.parent) if (t.userData.held || t !== e && Dc.test(t.name) || Dc.test(e.name)) return !0;
		return !1;
	};
	return e.updateMatrixWorld(!0), e.traverse((e) => {
		e.isMesh && e.visible && !i(e) && r.expandByObject(e);
	}), {
		box: r,
		ppu: n * t.height / (r.max.y - r.min.y)
	};
}
var kc = (e, t) => e.getObjectByName(t) || e.getObjectByName(t.replace(/\./g, ""));
function Ac(e, t) {
	let n = /* @__PURE__ */ new Map();
	e.traverse((e) => {
		if (!e.isMesh || /Eyes/.test(e.name) || !e.material.map) return;
		let r = n.get(e.material);
		if (!r) {
			let i = e.material.map.image, a = document.createElement("canvas");
			a.width = i.width, a.height = i.height;
			let o = a.getContext("2d");
			o.filter = t, o.drawImage(i, 0, 0);
			let s = new Ce(a);
			s.flipY = e.material.map.flipY, s.colorSpace = e.material.map.colorSpace, s.magFilter = e.material.map.magFilter, s.minFilter = e.material.map.minFilter, s.wrapS = e.material.map.wrapS, s.wrapT = e.material.map.wrapT, r = e.material.clone(), r.map = s, n.set(e.material, r);
		}
		e.material = r;
	});
}
async function jc(e, t) {
	if (typeof e != "string") return e;
	let n = await t();
	if (!n[e]) throw Error(`no face preset "${e}"`);
	return n[e];
}
async function Mc(e, t) {
	let { far: n = !1, load: r } = t, i = await r(`./models/${e.model}.glb`), a = i.scene, o = wc[e.model] || [];
	if (a.traverse((t) => {
		t.isMesh && (t.frustumCulled = !1, o.includes(t.name) && !(e.show || []).includes(t.name) && (t.visible = !1));
	}), e.body) {
		let i = {
			...e.body,
			face: await jc(e.body.face, t.faces)
		};
		e.body.shape && (i.face = {
			...i.face,
			shape: e.body.shape
		}), await Cc(r, a, i, {
			far: n,
			findNode: kc
		});
	} else if (e.face) {
		let { head: i, replaces: o } = await oc(r, e.model, await jc(e.face, t.faces), { far: n });
		a.traverse((e) => {
			e.isMesh && o.includes(e.name) && (e.visible = !1);
		}), kc(a, "head").add(i);
	}
	for (let [t, n] of Object.entries(e.attach || {})) {
		let e = await r(`./models/${n}`);
		kc(a, t)?.add(e.scene);
	}
	for (let [t, n] of Object.entries(e.hold || {})) {
		let e = fs[n]();
		e.position.y = .033, e.userData.held = !0, kc(a, t)?.add(e);
	}
	for (let [t, n] of Object.entries(e.wear || {})) kc(a, t)?.add(fs[n]());
	for (let t of e.hide || []) a.traverse((e) => {
		e.name === t && (e.visible = !1);
	});
	return e.skull && a.traverse((e) => {
		e.isMesh && (/_Eyes$/.test(e.name) ? e.userData.part = "eye" : /_Head$/.test(e.name) ? e.userData.part = "skin" : /_Jaw$/.test(e.name) && (e.userData.part = "hair"));
	}), e.swatches && hs(a, e.swatches), e.recolor && Ac(a, e.recolor), e.eyes && a.traverse((t) => {
		t.isMesh && /Eyes/.test(t.name) && (t.material = t.material.clone(), t.material.emissive = new j(e.eyes), t.material.emissiveIntensity = 3);
	}), {
		root: a,
		mixer: new Ke(a),
		clips: i.animations,
		frame: e.frame || null
	};
}
function Nc(e, t) {
	e.traverse((e) => {
		if (!e.isBone) return;
		let n = e.name.replace(/\.?(l|r)$/, "");
		if (t.scale && t.scale[n] && e.scale.multiplyScalar(t.scale[n]), t.reach && t.reach[n] && e.position.multiplyScalar(t.reach[n]), t.bend && t.bend[n]) {
			let [r, i, a] = t.bend[n];
			e.quaternion.multiply(new o().setFromEuler(new w(r, i, a)));
		}
	});
}
function Pc(e, t, n, r) {
	e.mixer.stopAllAction();
	let i = e.clips.find((e) => e.name === t) || e.clips.find((e) => e.name === "Idle");
	e.mixer.clipAction(i).play(), e.mixer.setTime(n * i.duration), r && Ec(e.root), r && e.frame && Nc(e.root, e.frame), e.root.updateMatrixWorld(!0), zc(e.root);
}
var Fc = new o(), Ic = new o(), Lc = new o().setFromAxisAngle(new A(1, 0, 0), Math.PI), Rc = new A(0, 1, 0);
function zc(e) {
	let t = [];
	if (e.traverse((e) => {
		e.userData.hang && t.push(e);
	}), !t.length) return;
	let n = new o().setFromAxisAngle(Rc, e.rotation.y);
	for (let e of t) e.parent.getWorldQuaternion(Ic), Fc.copy(n), e.userData.hang !== "up" && Fc.multiply(Lc), e.quaternion.copy(Ic.invert().multiply(Fc));
	e.updateMatrixWorld(!0);
}
var Bc = new ge();
function Vc(e, t, n, r) {
	let i = e.geometry.index ? e.geometry.toNonIndexed() : e.geometry.clone();
	for (let e of Object.keys(i.attributes)) [
		"position",
		"normal",
		"uv"
	].includes(e) || i.deleteAttribute(e);
	if (i.attributes.normal || i.computeVertexNormals(), !n && i.attributes.uv && i.deleteAttribute("uv"), n && !i.attributes.uv) return null;
	if (i.applyMatrix4(t), r) {
		let t = i.attributes.position.count, n = new Float32Array(t * 3), r = e.material.color || new j(1, 1, 1);
		for (let e = 0; e < t; e++) n[e * 3] = r.r, n[e * 3 + 1] = r.g, n[e * 3 + 2] = r.b;
		i.setAttribute("color", new ye(n, 3));
	}
	return i;
}
function Hc(e, t) {
	e.updateMatrixWorld(!0);
	let n = (e) => {
		for (let t = e; t; t = t.parent) if (!t.visible) return !1;
		return !0;
	}, r = (e) => {
		for (let t = e; t && !t.isBone; t = t.parent) if (t.userData.hang || t.userData.glow) return !1;
		return !/Eyes/.test(e.name);
	}, i = [];
	e.traverse((e) => {
		e.isMesh && i.push(e);
	});
	let a = i.filter(n).length;
	for (let e of i) n(e) || e.parent?.remove(e);
	let o = /* @__PURE__ */ new Map();
	for (let e of i) if (e.isSkinnedMesh && n(e) && e.parent) {
		let t = `${e.material.map ? e.material.map.uuid : e.material.uuid}|${e.material.type}|${e.skeleton.bones.map((e) => e.uuid).join(",")}`;
		(o.get(t) || o.set(t, []).get(t)).push(e);
	}
	for (let e of o.values()) {
		if (e.length < 2 || e.some((t) => !t.bindMatrix.equals(e[0].bindMatrix) || !t.matrix.equals(e[0].matrix))) continue;
		let n = t(e.map((e) => {
			let t = e.geometry.clone();
			for (let e of Object.keys(t.attributes)) [
				"position",
				"normal",
				"uv",
				"skinIndex",
				"skinWeight"
			].includes(e) || t.deleteAttribute(e);
			return t;
		}));
		if (!n) continue;
		let r = new p(n, e[0].material);
		r.castShadow = e[0].castShadow, r.name = e.map((e) => e.name).join("+"), r.position.copy(e[0].position), r.quaternion.copy(e[0].quaternion), r.scale.copy(e[0].scale), r.frustumCulled = !1, e[0].parent.add(r), r.bind(e[0].skeleton, e[0].bindMatrix);
		for (let t of e) t.parent.remove(t);
	}
	let s = /* @__PURE__ */ new Map();
	for (let t of i) {
		if (t.isSkinnedMesh || !t.parent || !n(t) || !r(t)) continue;
		let i = t.parent;
		for (; i && !i.isBone && i !== e;) i = i.parent;
		if (!i) continue;
		let a = t.material, o = a.map ? `map|${a.map.uuid}|${a.type}` : a.isMeshBasicMaterial ? "basic" : a.isMeshStandardMaterial ? "lit" : null;
		if (!o) continue;
		let c = `${i.uuid}|${o}`;
		s.has(c) || s.set(c, {
			bone: i,
			kind: o,
			list: []
		}), s.get(c).list.push(t);
	}
	for (let { bone: e, kind: n, list: r } of s.values()) {
		if (r.length < 2 && n.startsWith("map")) continue;
		let i = Bc.copy(e.matrixWorld).invert(), a = n.startsWith("map"), o = r.map((e) => Vc(e, new ge().multiplyMatrices(i, e.matrixWorld), a, !a));
		if (o.some((e) => !e)) continue;
		let s = t(o);
		if (!s) continue;
		let c = r[0].material, l = a ? c.clone() : n === "basic" ? new et({
			vertexColors: !0,
			transparent: c.transparent,
			opacity: c.opacity
		}) : new P({
			vertexColors: !0,
			roughness: c.roughness ?? 1,
			metalness: c.metalness ?? 0
		}), u = new N(s, l);
		u.name = `${e.name}:${n.split("|")[0]}`, u.frustumCulled = !1, e.add(u);
		for (let e of r) e.parent.remove(e);
	}
	let c = 0;
	return e.traverse((e) => {
		e.isMesh && n(e) && c++;
	}), {
		before: a,
		after: c
	};
}
//#endregion
//#region ember3d/ground.js
var Uc = .25, Wc = /* @__PURE__ */ new Set([
	"dust",
	"fireflies",
	"sparkle"
]);
Object.assign(globalThis, { __emberGround: {
	foliage(e) {
		return this.scaled += e.length, e.map((e) => ({
			...e,
			scale: (e.scale ?? 1) * Uc
		}));
	},
	scaled: 0,
	size: Uc,
	keeps: (e) => e?.emberExhibit === !0 || !Wc.has(e?.preset),
	dust: !1
} });
//#endregion
//#region ember3d/world.js
var Gc = "", Kc = 1, qc = 3, Jc = 16 * Math.SQRT2, Yc = {
	billboard: "spherical",
	normalUp: .6,
	wrap: .6,
	roundness: .35,
	emissive: "#ffe9d2",
	emissiveIntensity: .2
}, Xc = "en", Zc = null, Qc = null, $c = null, el = null, W = null, tl = null, nl = 0, rl = "soft", il = 45, al = 30, ol = /* @__PURE__ */ new Map(), sl = /* @__PURE__ */ new Map(), cl = (e) => {
	let t = ol.get(e);
	return t || (t = new Promise((t, n) => {
		let r = new Image();
		r.decoding = "async", r.onload = () => t(r), r.onerror = n, r.src = e;
	}), ol.set(e, t)), t;
}, ll = (e) => {
	let t = sl.get(e);
	return t || (t = fetch(e).then((e) => e.ok ? e.json() : null).catch(() => null), sl.set(e, t)), t;
}, ul = /* @__PURE__ */ new Map();
function dl(e) {
	return ul.has(e) ? ul.get(e) : (ul.set(e, null), Promise.all([ll(`${Gc}actors/${e}.json`), cl(`${Gc}actors/${e}.alb.png`)]).then(([t, n]) => {
		if (!t) {
			ul.set(e, !1);
			return;
		}
		let r = new pe(n);
		r.magFilter = r.minFilter = l, r.generateMipmaps = !1, r.colorSpace = D, r.wrapS = r.wrapT = De, r.needsUpdate = !0, r.name = `ember-actor:${e}`, ul.set(e, {
			meta: t,
			tex: r,
			sheets: /* @__PURE__ */ new Map()
		});
	}).catch(() => ul.set(e, !1)), null);
}
function fl(e, t) {
	let n = t.toFixed(3), r = e.sheets.get(n);
	if (!r) {
		let i = e.meta;
		r = {
			texture: e.tex,
			frameWidth: i.cw,
			frameHeight: i.ch,
			columns: i.frames,
			rows: i.dirs,
			pixelsPerUnit: Jc / t,
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
var pl = /* @__PURE__ */ new Map();
function ml(e, t) {
	let n = pl.get(e);
	for (n || pl.set(e, n = []); n.length <= t;) {
		let t = new It(e, { ...Yc });
		t.visible = !1, W.engine.scene.add(t), n.push(t);
	}
	return n[t];
}
function hl(e, t, n, r, i) {
	let a = 2 * r / i / Math.SQRT2, o = W.tileMap, s = t + a, c = n + a;
	e.position.set(s, o.getHeight(t, n), c);
}
var gl = "models", _l = new A(), vl = .4, yl = null, bl = !1, xl = (e) => (bl || (bl = !0, ll(`${Gc}models/cast.json`).then((e) => {
	yl = e || !1;
})), yl ? yl.actors[e] || !1 : yl !== !1 && null), Sl = new mo(), Cl = /* @__PURE__ */ new Map(), wl = (e) => {
	let t = `${Gc}models/${e.replace("./models/", "")}`, n = Cl.get(t);
	return n || (n = Sl.loadAsync(t), Cl.set(t, n)), n.then((e) => ({
		scene: fo(e.scene),
		animations: e.animations
	}));
}, Tl = /* @__PURE__ */ new Map(), El = /* @__PURE__ */ new Map();
function Dl(e, t) {
	let n = El.get(e);
	return n === void 0 ? (El.set(e, null), Tl.has(e) || ll(`${Gc}actors/${e}.json`).then((t) => Tl.set(e, t)), Mc(t.v, {
		far: !1,
		load: wl,
		faces: async () => yl.faces
	}).then((n) => {
		let r = [];
		n.root.traverse((e) => {
			e.isBone && r.push([
				e,
				e.position.clone(),
				e.quaternion.clone(),
				e.scale.clone()
			]);
		}), Pc(n, "Idle", 0, !0);
		let { box: i, ppu: a } = Oc(n.root, t.v, t.px);
		for (let [e, t, n, i] of r) e.position.copy(t), e.quaternion.copy(n), e.scale.copy(i);
		let o = Hc(n.root, Qt);
		El.set(e, {
			root: n.root,
			clips: n.clips,
			frame: n.frame,
			ppu: a,
			minY: i.min.y,
			meshes: o
		});
	}).catch((t) => {
		console.warn("[luminati] figure", e, t), El.set(e, !1);
	}), null) : n;
}
var Ol = /* @__PURE__ */ new Map(), kl = 0;
function Al(e, t, n) {
	let r = Ol.get(e);
	if (r && r.name !== t && (W.engine.scene.remove(r.root), Ol.delete(e), r = null), r) return r;
	let i = fo(n.root), a = [];
	i.traverse((e) => {
		if (!e.isMesh) return;
		e.castShadow = !0, e.receiveShadow = !0, e.frustumCulled = !1, e.material = e.material.clone(), e.material.isMeshStandardMaterial && (e.material.metalness = 0, e.material.roughness = Math.max(e.material.roughness ?? 1, .92));
		let t = /Eyes/.test(e.name) || !!e.userData.glow || !e.material.emissive;
		t || (e.material.emissive = e.material.map ? new j(16771538) : e.material.color.clone(), e.material.map && (e.material.emissiveMap = e.material.map)), !t && e.material.vertexColors && (e.material.onBeforeCompile = (e) => {
			e.fragmentShader = e.fragmentShader.replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n#ifdef USE_COLOR\n	totalEmissiveRadiance *= vColor.rgb;\n#endif");
		}, e.material.customProgramCacheKey = () => "ember-figure-vc"), a.push({
			m: e.material,
			own: t,
			base: e.material.emissive ? e.material.emissive.clone() : null
		});
	});
	let o = [];
	return i.traverse((e) => {
		e.isBone && o.push([
			e,
			e.position.clone(),
			e.quaternion.clone(),
			e.scale.clone()
		]);
	}), r = {
		name: t,
		root: i,
		mixer: new Ke(i),
		clips: n.clips,
		frame: n.frame,
		bones: o,
		mats: a,
		yaw: null,
		key: "",
		fpos: 0,
		seen: 0,
		look: ""
	}, W.engine.scene.add(i), Ol.set(e, r), r;
}
var jl = new j(1, .45, .15);
function Ml(e, t, n, r) {
	if (gl !== "models") return !1;
	let i = xl(e.name);
	if (!i) return !1;
	let a = Dl(e.name, i), o = Tl.get(e.name);
	if (!a || !o) return !1;
	let s = null;
	for (let t in o.clips) {
		let n = o.clips[t];
		if (e.col >= n.start && e.col < n.start + n.len) {
			s = t;
			break;
		}
	}
	let c = s && i.clips[s];
	if (!c) return !1;
	let l = Al(t, e.name, a), u = o.clips[s], d = c.frames, f = e.col - u.start;
	if (l.key !== s) l.key = s, l.fpos = f;
	else if (c.once) l.fpos = Math.min(Math.max(l.fpos + n * u.fps, f), Math.min(f + .999, d - 1));
	else {
		let e = l.fpos + n * u.fps, t = ((e - f) % d + d) % d;
		l.fpos = t < 1 ? (e % d + d) % d : t > d / 2 ? f : f + .999;
	}
	let p = c.from ?? 0, m = c.to ?? 1, h = c.once ? p + (m - p) * (l.fpos / Math.max(1, d - 1)) : p + (m - p) * (l.fpos / d);
	for (let [e, t, n, r] of l.bones) e.position.copy(t), e.quaternion.copy(n), e.scale.copy(r);
	let g = (135 - 45 * e.row) * Math.PI / 180 + r - Math.PI / 4;
	if (l.yaw === null || l.seen < kl - 1) l.yaw = g;
	else {
		let e = g - l.yaw;
		e -= 2 * Math.PI * Math.round(e / (2 * Math.PI)), l.yaw += e * (1 - Math.exp(-n * 16));
	}
	l.root.rotation.y = l.yaw, Pc(l, c.clip, Math.min(.999, h), !0);
	let _ = (e.cw && o.cw ? e.cw / o.cw : 1) * a.ppu / Jc;
	l.root.scale.setScalar(_), l.root.position.set(e.x, W.tileMap.getHeight(e.x, e.z) - a.minY * _, e.z), l.root.updateMatrixWorld(!0);
	let v = e.flash || 0, y = v ? 0 : Math.round((e.warn || 0) * 20) / 20, b = 1 - (e.fade || 0), x = `${Kl}|${v}|${y}|${b.toFixed(2)}`;
	if (l.look !== x) {
		l.look = x;
		for (let e of l.mats) {
			e.own || (y ? e.m.emissive.copy(e.base).lerp(jl, Math.min(1, y)) : e.m.emissive.copy(e.base), e.m.emissiveIntensity = Kl * vl + v * 2.6 + y * .9);
			let t = b < .999;
			e.m.transparent !== t && (e.m.transparent = t, e.m.needsUpdate = !0), e.m.opacity = b;
		}
	}
	return l.root.visible = !0, l.seen = kl, !0;
}
function Nl() {
	for (let [e, t] of Ol) t.seen !== kl && (t.root.visible && (t.root.visible = !1), kl - t.seen > 3600 && (W.engine.scene.remove(t.root), Ol.delete(e)));
}
var Pl = [];
async function Fl(e, t) {
	for (let e of Pl) W.engine.scene.remove(e), e.dispose?.();
	if (Pl = [], !e?.length) return;
	let n = ["env", `town-${t || "vale"}`], r = await Promise.all(n.map((e) => ll(`${Gc}env/${e}.json`))), i = (e) => {
		for (let t = 0; t < n.length; t++) {
			let i = r[t]?.sprites?.[e];
			if (i) return [n[t], i];
		}
		return null;
	}, a = nl;
	for (let t of e) {
		if (t.canvas) {
			eu(t);
			continue;
		}
		let e = i(t.id);
		if (!e) continue;
		let [n, r] = e, o = await cl(`${Gc}env/${n}.alb.png`).catch(() => null);
		if (!o || a !== nl) return;
		let s = document.createElement("canvas");
		s.width = r.w, s.height = r.h, s.getContext("2d").drawImage(o, r.x, r.y, r.w, r.h, 0, 0, r.w, r.h);
		let c = new Ce(s);
		c.magFilter = c.minFilter = l, c.generateMipmaps = !1, c.colorSpace = D;
		let u = {
			texture: c,
			frameWidth: r.w,
			frameHeight: r.h,
			columns: 1,
			rows: 1,
			pixelsPerUnit: Jc,
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
		}, d = new It(u, {
			...Yc,
			castShadow: !1,
			blobShadow: !1
		});
		d.name = `ember:${n}:${t.id}`, hl(d, t.x, t.z, r.h - r.ay, Jc), W.engine.scene.add(d), Pl.push(d), d.update(0, W.engine.camera);
	}
}
var Il = (e, t) => {
	let n = new j(e), r = n.r * .299 + n.g * .587 + n.b * .114;
	return n.r += (r - n.r) * t, n.g += (r - n.g) * t, n.b += (r - n.b) * t, "#" + n.getHexString();
}, Ll = (e, t) => {
	let n = new j(e);
	return n.multiplyScalar(t), "#" + n.getHexString();
}, Rl = Dt.map((e) => {
	let t = e.night ?? 0;
	return {
		...e,
		top: Ll(Il(e.top, .3), .8),
		horizon: Ll(Il(e.horizon, .3), .6),
		bottom: Ll(Il(e.bottom, .3), .75),
		sun: Il(e.sun, .3),
		hemiSky: Il(e.hemiSky, .45),
		hemiGround: Il(e.hemiGround, .3),
		sunI: e.sunI * .72,
		hemiI: e.hemiI * (.86 - .08 * t) * (e.t >= 18 && e.t <= 20.5 ? 1.4 : 1),
		exp: e.exp * .97,
		fog: e.fog * (.5 + .3 * t)
	};
}), zl = {
	saturation: .92,
	exposure: .9,
	contrast: 1.06,
	vignette: .78
}, Bl = !1;
function Vl() {
	let e = W?.postfx?.settings?.grade, t = W?.lighting?.state?.night ?? 1;
	Bl && e && (e.saturation = .74 + .18 * t, e.exposure = (.84 + .06 * t) * Hl * Ul);
}
var Hl = 1, Ul = 1, Wl = 1.6, Gl = 1, Kl = Yc.emissiveIntensity, ql = 0, Jl = (e) => .2126 * e.r + .7152 * e.g + .0722 * e.b;
function Yl() {
	let e = W?.lighting, t = e?.hemi, n = e?.sun;
	return ql = (t ? Jl(t.color) * t.intensity : 0) + (n ? Jl(n.color) * n.intensity * .5 : 0), Math.round(Math.min(Gl, Math.max(Yc.emissiveIntensity, Wl - ql)) * 100) / 100;
}
var Xl = null, Zl = "default";
function Ql(e, t) {
	let n = W?.lighting;
	if (!n) return;
	let r = e.environment || {}, i = W.postfx?.settings?.grade;
	if (i && (Xl ||= { ...i }, Object.assign(i, Xl, t === "vale" ? zl : {})), Bl = t === "vale" && !r.interior, r.interior || r.climate || r.season) return;
	let a = t === "vale" ? "dusky" : "default";
	n.setKeyframes(a === "dusky" ? Rl : Dt), Zl = a;
}
var $l = /* @__PURE__ */ new Map();
function eu(e) {
	let t = $l.get(e.canvas);
	if (!t) {
		let n = new Ce(e.canvas);
		n.magFilter = n.minFilter = l, n.generateMipmaps = !1, n.colorSpace = D, t = {
			texture: n,
			frameWidth: e.canvas.width,
			frameHeight: e.canvas.height,
			columns: 1,
			rows: 1,
			pixelsPerUnit: Jc,
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
		}, $l.set(e.canvas, t);
	}
	let n = new It(t, {
		...Yc,
		emissiveIntensity: .3,
		castShadow: !1,
		blobShadow: !e.flat
	});
	n.name = `ember:prop:${e.id}`, hl(n, e.x, e.z, e.canvas.height - e.ay, Jc), e.flat && n.traverse((e) => {
		e.renderOrder = -1, e.material && (e.material.depthWrite = !1);
	}), W.engine.scene.add(n), Pl.push(n), n.update(0, W.engine.camera);
}
var tu = /* @__PURE__ */ new Map(), nu = "vale";
function ru(e) {
	if (tu.has(e)) return tu.get(e);
	tu.set(e, null);
	let t = ["env", `town-${nu}`];
	return Promise.all(t.map((e) => ll(`${Gc}env/${e}.json`))).then(async (n) => {
		for (let r = 0; r < t.length; r++) {
			let i = n[r]?.sprites?.[e];
			if (!i) continue;
			let a = await cl(`${Gc}env/${t[r]}.alb.png`), o = document.createElement("canvas");
			o.width = i.w, o.height = i.h, o.getContext("2d").drawImage(a, i.x, i.y, i.w, i.h, 0, 0, i.w, i.h);
			let s = new Ce(o);
			s.magFilter = s.minFilter = l, s.generateMipmaps = !1, s.colorSpace = D, tu.set(e, {
				texture: s,
				frameWidth: i.w,
				frameHeight: i.h,
				columns: 1,
				rows: 1,
				pixelsPerUnit: Jc,
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
		tu.set(e, !1);
	}).catch(() => tu.set(e, !1)), null;
}
var iu = /* @__PURE__ */ new WeakMap();
function au(e) {
	let t = iu.get(e.canvas);
	if (!t) {
		let n = new Ce(e.canvas);
		n.magFilter = n.minFilter = l, n.generateMipmaps = !1, n.colorSpace = D, t = {
			texture: n,
			frameWidth: e.canvas.width,
			frameHeight: e.canvas.height,
			columns: 1,
			rows: 1,
			pixelsPerUnit: Jc,
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
		}, iu.set(e.canvas, t);
	}
	return t;
}
function ou(e, t) {
	let n = pl.get(e);
	for (n || pl.set(e, n = []); n.length <= t;) {
		let t = new It(e, {
			...Yc,
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
function su(e) {
	if (!e || !e.cells.length) {
		G.mesh && (G.mesh.visible = !1), G.id = "";
		return;
	}
	if (e.id === G.id && G.mesh) {
		G.mesh.visible = !0;
		return;
	}
	let t = e.cells.length / 3;
	if (!G.mesh || G.cap < t) {
		G.mesh && (W.engine.scene.remove(G.mesh), G.mesh.geometry.dispose(), G.mesh.material.dispose());
		let e = new d(.5, .5);
		e.rotateX(-Math.PI / 2);
		let n = new et({
			transparent: !0,
			opacity: .72,
			depthWrite: !1,
			polygonOffset: !0,
			polygonOffsetFactor: -2,
			polygonOffsetUnits: -2,
			toneMapped: !1
		});
		G.cap = Math.max(256, Math.ceil(t * 1.5)), G.mesh = new fe(e, n, G.cap), G.mesh.renderOrder = 2, G.mesh.frustumCulled = !1, W.engine.scene.add(G.mesh);
	}
	let n = new ge(), r = new j().setRGB(16 / 255, 54 / 255, 64 / 255, D), i = new j().setRGB(40 / 255, 92 / 255, 104 / 255, D);
	for (let a = 0; a < t; a++) {
		let t = e.cells[a * 3], o = e.cells[a * 3 + 1];
		n.makeTranslation(t, W.tileMap.getHeight(t, o) + .035, o), G.mesh.setMatrixAt(a, n), G.mesh.setColorAt(a, e.cells[a * 3 + 2] ? i : r);
	}
	G.mesh.count = t, G.mesh.instanceMatrix.needsUpdate = !0, G.mesh.instanceColor && (G.mesh.instanceColor.needsUpdate = !0), G.mesh.visible = !0, G.id = e.id;
}
var cu = [];
function lu(e, t) {
	let n = cu[e];
	return n && n.sheet !== t && (W.engine.scene.remove(n), n.dispose?.(), n = null), n || (n = new It(t, { ...Yc }), W.engine.scene.add(n), cu[e] = n), n.material.emissiveIntensity !== Kl && (n.material.emissiveIntensity = Kl), n;
}
var uu = "uniform vec4 uRect; uniform vec2 uView; varying vec2 vUv;\nvoid main() { vUv = position.xy; vec2 p = uRect.xy + position.xy * uRect.zw; gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0); }", du = "uniform sampler2D tEmi, tDepth; uniform vec2 uTexel, uBuf; uniform mat4 uInvVP; uniform vec4 uKey; uniform float uFloor; varying vec2 vUv;\nvoid main() {\n  vec4 e = texture2D(tEmi, vUv); vec3 c = e.rgb * 2.4, g = vec3(0.0); float own = e.a;\n  for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; vec2 d = vec2(cos(a), sin(a)) * uTexel;\n    vec4 n = texture2D(tEmi, vUv + d * 2.0), f = texture2D(tEmi, vUv + d * 4.5); g += n.rgb + f.rgb * 0.6; own = max(own, max(n.a, f.a)); }\n  float k = 1.0;\n  if (uKey.w > 0.5 && own > 0.002) {\n    vec2 suv = gl_FragCoord.xy / uBuf; float z = texture2D(tDepth, suv).x;\n    if (z < 1.0) {\n      vec4 w = uInvVP * vec4(suv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0); w.xyz /= w.w;\n      float scene = 2.0 * (w.x + w.z) + uKey.z, eff = uKey.x + own * 255.0 * uKey.y;\n      if (w.y > uFloor && scene > eff + 1.5) k = 0.22;\n    }\n  }\n  gl_FragColor = vec4((c + g * 0.12) * k, 1.0);\n}", K = {
	scene: null,
	cam: null,
	mat: null,
	tex: null,
	on: !1,
	keyed: !1
};
function fu() {
	if (!K.on || !W) return;
	let e = W.engine.renderer, t = e.autoClear, n = K.mat.uniforms, r = W.engine.camera;
	n.tDepth.value = W.postfx?.depthTexture || null, n.uKey.value.w = K.keyed && n.tDepth.value ? 1 : 0, e.getDrawingBufferSize(n.uBuf.value), n.uInvVP.value.multiplyMatrices(r.matrixWorld, r.projectionMatrixInverse), e.autoClear = !1, e.setRenderTarget(null), e.render(K.scene, K.cam), e.autoClear = t;
}
function pu(e) {
	if (!e || !e.emi) {
		K.on = !1;
		return;
	}
	let t = new Uint32Array(e.emi.buffer, e.emi.byteOffset, e.emi.byteLength >> 2), n = !1;
	for (let e = 0; e < t.length; e++) if (t[e] & 16777215) {
		n = !0;
		break;
	}
	if (K.on = n, n) {
		if (!K.scene) {
			K.scene = new a(), K.cam = new xe(), K.mat = new ce({
				vertexShader: uu,
				fragmentShader: du,
				transparent: !0,
				depthTest: !1,
				depthWrite: !1,
				blending: 2,
				uniforms: {
					tEmi: { value: null },
					uTexel: { value: new Ze() },
					uRect: { value: new we() },
					uView: { value: new Ze() },
					tDepth: { value: null },
					uBuf: { value: new Ze(1, 1) },
					uInvVP: { value: new ge() },
					uKey: { value: new we() },
					uFloor: { value: 1.2 }
				}
			});
			let e = new Pe();
			e.setAttribute("position", new S([
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
			], 3)), e.setIndex([
				0,
				2,
				1,
				1,
				2,
				3
			]);
			let t = new N(e, K.mat);
			t.frustumCulled = !1, K.scene.add(t), W.engine.events.on("afterRender", fu);
		}
		(!K.tex || K.tex.image.width !== e.w || K.tex.image.height !== e.h || K.tex.image.data !== e.emi) && (K.tex?.dispose(), K.tex = new oe(e.emi, e.w, e.h, y), K.tex.flipY = !1, K.tex.magFilter = K.tex.minFilter = Je, K.tex.generateMipmaps = !1, K.mat.uniforms.tEmi.value = K.tex, K.mat.uniforms.uTexel.value.set(1 / e.w, 1 / e.h)), K.tex.needsUpdate = !0, K.mat.uniforms.uRect.value.set(e.x, e.y, e.w * e.px, e.h * e.px), K.mat.uniforms.uView.value.set(innerWidth, innerHeight), K.keyed = !!e.key, e.key && K.mat.uniforms.uKey.value.set(e.key.base, e.key.step, e.key.origin, 1);
	}
}
var mu = {
	x: 0,
	y: 1,
	z: 0,
	ppu: 22,
	ready: !1
};
function hu() {
	let e = W.rig, t = W.engine.camera, n = innerHeight / (2 * mu.ppu * Math.tan(Kc / 2 * Math.PI / 180));
	e.target = null, e.bounds = null, e.lift = 0, e.minDistance = 1, e.maxDistance = 1e6, e.minPitch = 0, e.maxPitch = Math.PI / 2, e.freeYaw = !0, e.yaw = e.yawTarget = il * Math.PI / 180, e.pitch = e.pitchTarget = al * Math.PI / 180, e.distance = e.distanceTarget = n, e.focusPoint.set(mu.x, mu.y, mu.z), (Math.abs(t.fov - Kc) > 1e-6 || Math.abs(t.far - (n + 600)) > 1) && (t.fov = Kc, t.near = Math.max(1, n - 300), t.far = n + 600, t.updateProjectionMatrix()), e._apply(0), ka(n - 7);
	let r = W.postfx?.settings?.dof;
	r && (r.autoFocus = !1, r.focusDistance = n);
}
async function gu(e) {
	await Qc, Object.assign(globalThis, {
		__emberUiRoot: el,
		__emberInputTarget: new EventTarget(),
		__emberSilent: !0,
		__emberPixelRatio: qc
	}), W = new uo({
		container: $c,
		level: e,
		source: "emberfall",
		autostart: !0,
		lang: Xc,
		fonts: Zc,
		look: "diorama"
	}), await W.init(() => {}), W.audio && (W.audio.muted = !0), W._updatePlayCamera = () => {}, W._updateCameraBounds = () => {}, W.start(), await W.warmedUp, W.engine.stop(), W.engine.events.on("lateUpdate", () => {
		W && hu();
	}), W.engine.events.on("update", Vl), W.engine.events.on("update", () => {
		let e = Ru, t = W?.lighting;
		e && t?.hemi && (t.hemi.color.setRGB(e.sky[0], e.sky[1], e.sky[2]), t.hemi.groundColor.setRGB(e.ground[0], e.ground[1], e.ground[2]), t.hemi.intensity = e.i, t.sun && (t.sun.intensity *= e.sun));
	}), W.lighting && (W.lighting._shadowExtent = Math.max(W.lighting._shadowExtent || 22, 34));
}
function _u() {
	let e = W.player;
	e && (e.sprite && (e.sprite.visible = !1), e.visible = !1);
}
var vu = new E(.46, .6, 40), yu = new Ie(1, 40), bu = new E(.8, 1, 40), xu = (() => {
	let e = [];
	for (let t = 0; t < 4; t++) e.push(new E(.7, .8, 10, 1, t * Math.PI / 2 + .25, Math.PI / 2 - .5));
	return Su(e);
})();
function Su(e) {
	let t = [], n = [], r = 0;
	for (let i of e) {
		let e = i.getAttribute("position"), a = i.getIndex();
		for (let n = 0; n < e.count; n++) t.push(e.getX(n), e.getY(n), e.getZ(n));
		for (let e = 0; e < a.count; e++) n.push(a.getX(e) + r);
		r += e.count, i.dispose();
	}
	let i = new Pe();
	return i.setAttribute("position", new S(t, 3)), i.setIndex(n), i;
}
var Cu = new E(.88, 1, 40), wu = new d(1, 1).translate(.5, 0, 0), Tu = () => new et({
	transparent: !0,
	depthWrite: !1,
	polygonOffset: !0,
	polygonOffsetFactor: -2,
	polygonOffsetUnits: -2,
	toneMapped: !1
}), Eu = {
	ring: [],
	disc: [],
	rim: [],
	focus: [],
	wfill: [],
	wrim: [],
	lane: []
}, Du = {
	ring: vu,
	disc: yu,
	rim: bu,
	focus: xu,
	wfill: yu,
	wrim: Cu,
	lane: wu
};
function Ou(e, t) {
	let n = Eu[e];
	for (; n.length <= t;) {
		let t = new N(Du[e], Tu());
		t.rotation.x = -Math.PI / 2, t.renderOrder = 2, t.visible = !1, W.engine.scene.add(t), n.push(t);
	}
	return n[t];
}
function ku(e, t, n, r, i, a) {
	e.visible = a > .01, e.visible && (e.position.set(t, W.tileMap.getHeight(t, n) + .03, n), e.scale.setScalar(r), e.material.color.setRGB(i[0] / 255, i[1] / 255, i[2] / 255, D), e.material.opacity = a);
}
function Au(e, t, n, r, i, a, o, s, c) {
	let l = r - t, u = i - n, d = Math.hypot(l, u) * a;
	e.visible = c > .01 && d > .02, e.visible && (e.position.set(t, Math.max(W.tileMap.getHeight(t, n), W.tileMap.getHeight(r, i)) + .05, n), e.rotation.z = Math.atan2(-u, l), e.scale.set(d, o, 1), e.material.color.setRGB(s[0] / 255, s[1] / 255, s[2] / 255, D), e.material.opacity = c);
}
var ju = [
	255,
	86,
	30
], Mu = [
	255,
	238,
	220
], Nu = [
	24,
	6,
	4
], Pu = null, Fu = null, Iu = -1, Lu = 0, Ru = null, zu = !1, q = {
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
}, J = {
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
}, Bu = [
	.45,
	.75,
	1.4
], Vu = [
	1.6,
	.85,
	.25
], Hu = [
	1.6,
	.8,
	.3
], Y = (e) => e <= 0 ? 0 : e >= 1 ? 1 : e * e * (3 - 2 * e), Uu = (e) => e < 0 ? 0 : e > 1 ? 1 : e, Wu = (e) => e <= 0 ? 0 : e < .55 ? 1.15 * (1 - (1 - e / .55) ** 3) : e < 1 ? 1.15 - .15 * Y((e - .55) / .45) : 1, X = null, Gu = null, Ku = /* @__PURE__ */ new Map(), qu = {}, Ju = new A();
function Yu() {
	if (X || !W?.engine) return X;
	let e = W.engine.scene, t = new Hr({ capacity: 48 }), n = new Ur({
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
	}), r = new Ot({
		atlas: wt(),
		capacity: 320,
		name: "ember:spells"
	}), i = new Wr(), a = new Kr({ capacity: 15 }), o = new Gr({ capacity: 24 }), s = new qr({ capacity: 2 });
	r.enableHalo(), e.add(t.object), e.add(n.object), e.add(r.object), e.add(i.object), e.add(a.object), e.add(o.object), e.add(s.object), t.warm(), n.warm(), i.warm(), a.warm(), o.warm(), s.warm();
	let c = r.alloc();
	return r.set(c, {
		frame: "partyPillar",
		x: 0,
		y: -500,
		z: 0,
		mode: "billboard",
		a: 1,
		halo: 1
	}), X = {
		crystals: t,
		frost: n,
		quads: r,
		dome: i,
		blades: a,
		rocks: o,
		bells: s,
		warmQuad: c,
		warmN: 4,
		domeOf: null
	}, X;
}
function Z(e, t) {
	for (let e in qu) delete qu[e];
	Object.assign(qu, t), X.quads.set(e, qu);
}
function Xu(e) {
	for (let t of e.blades || []) X.blades.free(t);
	for (let t of e.rocks || []) X.rocks.free(t);
	for (let t of e.bells || []) X.bells.free(t);
	e.dome && X.domeOf === e && (X.dome.hide(), X.domeOf = null);
	for (let t of e.crystals) X.crystals.free(t);
	for (let t of e.quads) X.quads.free(t);
	e.gf >= 0 && X.frost.free(e.gf);
}
function Zu(e, t, n, r) {
	if (!X && !r && !e.length) return;
	let i = Yu();
	if (!i) return;
	i.warmN > 0 && --i.warmN === 0 && (i.crystals.unwarm(), i.frost.unwarm(), i.dome.unwarm(), i.blades.unwarm(), i.rocks.unwarm(), i.bells.unwarm(), i.quads.free(i.warmQuad));
	let a = /* @__PURE__ */ new Set(), o = (e, t) => W.tileMap.getHeight(e, t);
	W.engine.camera.getWorldDirection(Ju);
	let s = Math.hypot(Ju.x, Ju.z) || 1, c = -Ju.x / s, l = -Ju.z / s, u = null;
	for (let n of e) {
		a.add(n.key);
		let e = Ku.get(n.key);
		e || (e = {
			crystals: [],
			quads: [],
			gf: -1,
			landed: !1,
			seed: (n.seed >>> 0) % 8192
		}, Ku.set(n.key, e));
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
				spread: r == null ? .08 * Y(n.age / .38) : .08 + .92 * Y(r / .3),
				cracks: r == null ? 0 : Y((r - .04) / .5),
				fade: r == null ? 0 : Y((r - 1.5) / 1),
				glow: 1 + .8 * t
			}), e.spikes) for (let n of e.spikes) {
				if (n.h < 0) continue;
				let e = (r - n.start) / .13, a = Y((r - .55) / .3), o = Y((r - .88) / .3);
				i.crystals.set(n.h, {
					rise: Wu(e) * (1 - o),
					crack: a,
					glint: Y((r - .08 - n.start) / .38),
					glow: 1 + .35 * Math.exp(-Math.max(0, r - n.start - .07) / .1) + .2 * t + .5 * a
				});
			}
			let a = r == null ? .25 * Y(n.age / .38) : .25 + 3.2 * t + .6 * (1 - Y((r - .4) / .6));
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
			let t = r == null ? Y(n.age / .38) : 1, a = r == null ? 1 : 1 - Y((r - .35) / .5), s = o(n.x, n.z) + .04;
			if (Z(e.glyph, {
				frame: "partyGlyphHoly",
				x: n.x,
				y: s,
				z: n.z,
				mode: "flat",
				scale: 2 * n.r / 8 * (.35 + .65 * t),
				rot: n.age * .9,
				r: q.glyph[0],
				g: q.glyph[1],
				b: q.glyph[2],
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
				let t = Y(r / .32);
				Z(e.ring, {
					frame: "partyRing",
					index: r < .16 ? 0 : 1,
					x: n.x,
					y: s + .02,
					z: n.z,
					mode: "flat",
					scale: 2.2 * n.r / 6 * (.15 + .85 * t),
					r: q.ring[0],
					g: q.ring[1],
					b: q.ring[2],
					a: .9 * (1 - Y((r - .2) / .3))
				}), Z(e.over, {
					frame: "partySunburst",
					index: Math.min(3, Math.floor(r / .08)),
					x: n.x + c * .3,
					y: s + 1.5,
					z: n.z + l * .3,
					mode: "billboard",
					scale: 1.5,
					r: q.burst[0],
					g: q.burst[1],
					b: q.burst[2],
					a: 1 - Y((r - .15) / .2),
					halo: 1
				});
				for (let t of e.dead) {
					let e = r - t.at, n = o(t.x, t.z), i = .85, a = 3 * i;
					if (e < 0) {
						Z(t.body, {
							frame: "partyPillar",
							a: 0
						}), Z(t.core, {
							frame: "partyPillar",
							a: 0
						}), Z(t.foot, {
							frame: "partySunburst",
							a: 0
						});
						continue;
					}
					Z(t.body, {
						frame: "partyPillar",
						index: 1 + Math.min(2, Math.floor(e / .107)),
						x: t.x + c * .15,
						y: n + a,
						z: t.z + l * .15,
						mode: "billboard",
						scale: i,
						r: q.body[0],
						g: q.body[1],
						b: q.body[2],
						a: .9 * Math.max(0, Math.min(1, (.32 - e) / .14))
					}), Z(t.core, {
						frame: "partyPillar",
						index: 0,
						x: t.x + c * .17,
						y: n + a,
						z: t.z + l * .17,
						mode: "billboard",
						scale: i,
						r: q.core[0],
						g: q.core[1],
						b: q.core[2],
						a: Math.max(0, Math.min(1, (.24 - e) / .1)),
						halo: 1
					}), Z(t.foot, {
						frame: "partySunburst",
						index: Math.min(3, Math.floor(e / .08)),
						x: t.x,
						y: n + .05,
						z: t.z,
						mode: "flat",
						scale: 1.1,
						rot: e * 2,
						r: q.burst[0],
						g: q.burst[1],
						b: q.burst[2],
						a: Math.max(0, 1 - e / .4),
						halo: 1
					});
				}
			}
			let d = r == null ? .4 * Y(n.age / .38) : .4 + 3.4 * Math.exp(-r / .18);
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
				let o = Uu((r - i * .05) / .3), s = Math.sin(o * Math.PI) * .6;
				Z(e, {
					frame: "partyHolyOrb",
					index: Math.floor(r * 12) % 2,
					x: n.x + (n.tx - n.x) * o + c * .2,
					y: t + (a - t) * o + s,
					z: n.z + (n.tz - n.z) * o + l * .2,
					mode: "billboard",
					scale: 1.2,
					r: J.core[0],
					g: J.core[1],
					b: J.core[2],
					a: +(o > 0 && o < 1),
					halo: 1
				});
			});
			let s = r - .3, d = o(n.tx, n.tz), f = .6, p = 3 * f;
			Z(e.body, {
				frame: "partyPillar",
				index: 1 + Math.min(2, Math.max(0, Math.floor(s / .13))),
				x: n.tx + c * .3,
				y: d + p,
				z: n.tz + l * .3,
				mode: "billboard",
				scale: f,
				r: J.body[0],
				g: J.body[1],
				b: J.body[2],
				a: s > 0 ? .85 * Uu((.45 - s) / .18) : 0
			}), Z(e.core, {
				frame: "partyPillar",
				index: 0,
				x: n.tx + c * .32,
				y: d + p,
				z: n.tz + l * .32,
				mode: "billboard",
				scale: f,
				r: J.core[0],
				g: J.core[1],
				b: J.core[2],
				a: s > 0 ? Uu((.28 - s) / .1) : 0,
				halo: 1
			}), Z(e.foot, {
				frame: "partySunburst",
				index: Math.min(3, Math.max(0, Math.floor(s / .08))),
				x: n.tx,
				y: d + .05,
				z: n.tz,
				mode: "flat",
				scale: 1,
				rot: s * 2,
				r: J.core[0],
				g: J.core[1],
				b: J.core[2],
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
			let t = Y(r / .3) * (1 - Y((r - .9) / .5));
			Z(e.glyph, {
				frame: "partyGlyphHoly",
				x: n.x,
				y: o(n.x, n.z) + .04,
				z: n.z,
				mode: "flat",
				scale: .32 + .14 * Y(r / .3),
				rot: r * .8,
				r: q.glyph[0],
				g: q.glyph[1],
				b: q.glyph[2],
				a: .9 * t
			}), e.bursts.forEach((e, t) => {
				let i = n.reached[t], a = r - .15;
				Z(e, {
					frame: "partySunburst",
					index: Math.min(3, Math.max(0, Math.floor(a / .08))),
					x: i.x + c * .2,
					y: o(i.x, i.z) + 1.7,
					z: i.z + l * .2,
					mode: "billboard",
					scale: .9,
					r: q.burst[0],
					g: q.burst[1],
					b: q.burst[2],
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
			let t = Math.atan2(n.tz - n.z, n.tx - n.x), a = -.9 + 1.8 * Y(r / .22), s = o(n.x, n.z) + .75;
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
					runes: Y(r / .15),
					dissolve: Y((r - .28) / .3),
					dissolveDir: 1,
					ghost: .15
				});
			});
		} else if (n.id === "shield_wall" && r != null) e.snaps || (e.snaps = n.reached.slice(0, 8).map(() => i.quads.alloc()), e.quads.push(...e.snaps)), e.snaps.forEach((e, t) => {
			let i = n.reached[t], a = Uu(r / .35);
			Z(e, {
				frame: "partyRing",
				index: a < .5 ? 0 : 1,
				x: i.x,
				y: o(i.x, i.z) + .05,
				z: i.z,
				mode: "flat",
				scale: .25 + .2 * a,
				r: Vu[0],
				g: Vu[1],
				b: Vu[2],
				a: 1 - a
			});
		});
		else if (n.id === "aura_wall") {
			if ((!i.domeOf || !Ku.has(i.domeOf.key)) && (i.dome.show({
				x: n.x,
				y: o(n.x, n.z),
				z: n.z,
				radius: 1.15
			}), i.domeOf = e, e.key = n.key, e.dome = !0, e.t = 0), i.domeOf === e) {
				e.t += t, i.dome.object.position.set(n.x, o(n.x, n.z), n.z), i.dome.object.updateMatrix(), i.dome.object.updateMatrixWorld(!0);
				let r = e.t * .6 % 1;
				i.dome.set({
					rise: Y(e.t / .35),
					dissolve: 1 - Uu(n.k / .8),
					sweepA: r,
					sweepB: (r + .5) % 1
				});
			}
		} else if (n.id === "aura_ward") e.ring || (e.ring = i.quads.alloc(), e.quads.push(e.ring), e.t = 0), e.t += t, Z(e.ring, {
			frame: "partyWardRing",
			x: n.x,
			y: o(n.x, n.z) + .05,
			z: n.z,
			mode: "flat",
			scale: .85 + .05 * Math.sin(e.t * 4),
			rot: e.t * .5,
			r: Bu[0],
			g: Bu[1],
			b: Bu[2],
			a: .9 * Y(e.t / .25),
			halo: 1
		});
		else if (n.id === "firebolt_fly") e.bolt || (e.bolt = i.quads.alloc(), e.quads.push(e.bolt), e.t = 0), e.t += t, Z(e.bolt, {
			frame: "emberBolt",
			index: Math.floor(e.t * 12) % 2,
			x: n.x + c * .2,
			y: o(n.x, n.z) + 1,
			z: n.z + l * .2,
			mode: "billboard",
			scale: 1.5,
			r: Hu[0],
			g: Hu[1],
			b: Hu[2],
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
			let t = Y(r / .12) * (1 - Y((r - .5) / .6)), a = o(n.tx, n.tz);
			e.flames.forEach((i, o) => {
				let s = o / 6 * Math.PI * 2 + e.seed % 5 * .3, c = .45 + .15 * ((o * 3 + e.seed) % 4) / 3;
				Z(i, {
					frame: "wallFlame",
					index: Math.floor(r * 10 + o) % 4,
					x: n.tx + Math.cos(s) * c,
					y: a + .55 * (.8 + .3 * t),
					z: n.tz + Math.sin(s) * c,
					mode: "billboard",
					scale: .9 + .3 * t,
					r: Hu[0],
					g: Hu[1],
					b: Hu[2],
					a: t,
					halo: 1
				});
			}), Z(e.hit, {
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
		} else if (ud[n.id]) {
			let a = ud[n.id](n, e, r, i, o, c, l, t);
			a && (!u || a.k > u.k) && (u = a);
		}
	}
	for (let [e, t] of Ku) a.has(e) || (Xu(t), Ku.delete(e));
	Gu && (u && u.k > .02 ? Gu.set(u.x, o(u.x, u.z) + 1.4, u.z, {
		color: u.color,
		intensity: 2.6 * u.k / (n ?? 1),
		distance: 6.5,
		decay: 1.5,
		flicker: .08
	}) : Gu.off()), i.domeOf && !Ku.has(i.domeOf.key) && (i.dome.hide(), i.domeOf = null), i.crystals.update(t), i.frost.update(t), i.blades.update(t), i.rocks.update(t), i.bells.update(t), i.quads.update();
}
var Qu = [
	1.6,
	1.3,
	.85
], $u = [
	2,
	1.85,
	1.45
], ed = [
	1.7,
	.22,
	.32
], td = [
	.45,
	1.5,
	.6
], nd = [
	.75,
	.72,
	.8
], rd = [
	.55,
	.75,
	1.7
], id = [
	.55,
	.95,
	1.9
], ad = [
	.35,
	1.45,
	1.25
], od = [
	.75,
	1.55,
	.3
], sd = [
	1.15,
	.45,
	1.65
], cd = [
	.7,
	.58,
	.42
], Q = (e, t = 1) => ({
	r: e[0] * t,
	g: e[1] * t,
	b: e[2] * t
});
function $(e, t, n) {
	if (!e[t]) {
		e[t] = [];
		for (let r = 0; r < n; r++) {
			let n = X.quads.alloc();
			n >= 0 && (e[t].push(n), e.quads.push(n));
		}
	}
	return e[t];
}
var ld = (e, t) => {
	let n = Math.hypot(e, t) || 1;
	return {
		dirX: t / n,
		dirZ: -e / n
	};
}, ud = {
	vault(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l, u, ...d] = $(t, "q", 9), f = i(e.tx, e.tz), p = Uu((n - .12) / .18);
		return Z(s, {
			frame: "heroSigil",
			x: e.tx,
			y: f + .04,
			z: e.tz,
			mode: "flat",
			scale: .12 + .1 * Y(n / .3),
			rot: n * 1.5,
			...Q(Qu, .8),
			a: .9 * (1 - Y((n - .5) / .4))
		}), Z(c, {
			frame: "heroSword",
			index: n < .3 ? 0 : 1,
			x: e.tx + a * .25,
			y: f + 2.4 + 3.2 * (1 - p),
			z: e.tz + o * .25,
			mode: "billboard",
			scale: .4,
			...Q($u),
			a: n < .12 ? 0 : 1 - Y((n - .45) / .25),
			halo: 1
		}), Z(l, {
			frame: "heroCrack",
			x: e.tx,
			y: f + .05,
			z: e.tz,
			mode: "flat",
			scale: .55 * Y((n - .3) / .12),
			...Q(Qu, .9),
			a: n > .3 ? 1 - Y((n - .6) / .35) : 0
		}), Z(u, {
			frame: "impact",
			index: Math.min(3, Math.floor((n - .3) * 14)),
			x: e.tx + a * .3,
			y: f + .7,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 3.2,
			...Q($u),
			a: +(n > .3 && n < .6),
			halo: 1
		}), d.forEach((r, i) => {
			let a = i * 1.2566 + t.seed % 5 * .2, o = n - .3, s = .3 + .6 * Y(o / .4);
			Z(r, {
				frame: "dust",
				index: Math.min(2, Math.floor(o * 8)),
				x: e.tx + Math.cos(a) * s,
				y: f + .2 + .2 * o,
				z: e.tz + Math.sin(a) * s,
				mode: "billboard",
				scale: 2,
				...Q(cd),
				a: o > 0 ? 1 - Y(o / .5) : 0
			});
		}), n > .28 ? {
			x: e.tx,
			z: e.tz,
			k: 2.6 * Math.exp(-(n - .3) / .2),
			color: [
				1.9,
				1.5,
				.8
			]
		} : null;
	},
	cutting_wave(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l] = $(t, "q", 3), u = e.tx - e.fx, d = e.tz - e.fz, f = Math.hypot(u, d) || 1, p = u / f, m = d / f, h = 3 * Y(n / .35), g = 1 - Y((n - .45) / .35), _ = e.fx + p * h, v = e.fz + m * h, y = i(_, v), b = ld(u, d);
		return Z(s, {
			frame: "heroWaveLit",
			index: Math.floor(n * 24) % 4,
			x: _,
			y: y + .1,
			z: v,
			mode: "flat",
			...b,
			scale: .75,
			...Q($u),
			a: g,
			halo: 1
		}), Z(c, {
			frame: "heroWave",
			index: (Math.floor(n * 24) + 2) % 4,
			x: _ - p * .5,
			y: y + .08,
			z: v - m * .5,
			mode: "flat",
			...b,
			scale: .6,
			...Q(Qu),
			a: .8 * g
		}), Z(l, {
			frame: "heroFangCrestLit",
			index: Math.floor(n * 20) % 4,
			x: _ + a * .2,
			y: y + .55,
			z: v + o * .2,
			mode: "billboard",
			scale: .85,
			...Q($u),
			a: g,
			halo: 1
		}), {
			x: _,
			z: v,
			k: 1.6 * g,
			color: [
				1.7,
				1.4,
				.9
			]
		};
	},
	earthshatter(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let s = i(e.x, e.z), [c, l, ...u] = $(t, "q", 8);
		if (!t.rocks) {
			t.rocks = [], t.spec = [];
			for (let n = 0; n < 12; n++) {
				let a = n / 12 * Math.PI * 2 + t.seed % 9 * .07, o = .5 + .9 * ((n * 37 + t.seed) % 7 / 6), s = e.x + Math.cos(a) * o, c = e.z + Math.sin(a) * o, l = r.rocks.spawn({
					x: s,
					y: i(s, c) - .02,
					z: c,
					height: .75 + .5 * ((n * 53 + t.seed) % 5 / 4),
					radius: .2,
					yaw: a,
					tiltX: Math.cos(a) * .12,
					tiltZ: Math.sin(a) * .12,
					seed: t.seed + n * 11,
					aspect: .7
				});
				l >= 0 && (t.rocks.push(l), t.spec.push({
					h: l,
					start: .12 + n % 4 * .02
				}));
			}
		}
		for (let e of t.spec) r.rocks.set(e.h, {
			rise: Wu((n - e.start) / .14) * (1 - Y((n - 1) / .35)),
			crack: Y((n - .65) / .3)
		});
		return Z(c, {
			frame: "partyCrack",
			x: e.x,
			y: s + .05,
			z: e.z,
			mode: "flat",
			scale: .35 * Y(n / .15),
			rot: t.seed % 7 * .4,
			...Q(cd, 1.1),
			a: 1 - Y((n - 1) / .35)
		}), Z(l, {
			frame: "partyRing",
			index: n < .15 ? 0 : 1,
			x: e.x,
			y: s + .07,
			z: e.z,
			mode: "flat",
			scale: .2 + .4 * Y(n / .3),
			...Q(Qu, .9),
			a: 1 - Y((n - .1) / .3)
		}), u.forEach((t, r) => {
			let i = r * 1.047 + .3, a = n - .12, o = .6 + .8 * Y(a / .5);
			Z(t, {
				frame: "dust",
				index: Math.min(2, Math.floor(a * 6)),
				x: e.x + Math.cos(i) * o,
				y: s + .25 + .3 * a,
				z: e.z + Math.sin(i) * o,
				mode: "billboard",
				scale: 2.4,
				...Q(cd),
				a: a > 0 ? 1 - Y(a / .7) : 0
			});
		}), {
			x: e.x,
			z: e.z,
			k: 2.2 * Math.exp(-n / .25),
			color: [
				1.7,
				1.3,
				.8
			]
		};
	},
	whirling_blades(e, t, n, r, i, a, o) {
		if (n == null) return null;
		t.blades ||= [
			0,
			1,
			2
		].map((n) => r.blades.spawn({
			x: e.x,
			y: -500,
			z: e.z,
			length: .95,
			width: .16,
			palette: 0,
			seed: t.seed + n * 13
		}));
		let [s] = $(t, "q", 1), c = i(e.x, e.z) + .6, l = Y(n / .25), u = Y((n - 4.6) / .45), d = .8;
		return t.blades.forEach((t, i) => {
			if (t < 0) return;
			let a = n * 5.2 + i * Math.PI * 2 / 3, o = Math.cos(a), s = Math.sin(a);
			r.blades.set(t, {
				x: e.x + o * d,
				y: c + .08 * Math.sin(n * 7 + i),
				z: e.z + s * d,
				ax: -s,
				ay: 0,
				az: o,
				nx: 0,
				ny: 1,
				nz: 0,
				glow: 1.4,
				runes: l,
				dissolve: Math.max(1 - l, u),
				dissolveDir: 1,
				ghost: .12
			});
		}), Z(s, {
			frame: "heroCyclone",
			index: Math.floor(n * 18) % 4,
			x: e.x,
			y: i(e.x, e.z) + .15,
			z: e.z,
			mode: "flat",
			scale: .32,
			rot: -n * 6,
			...Q(Qu, .75),
			a: .75 * l * (1 - u)
		}), {
			x: e.x,
			z: e.z,
			k: .9 * l * (1 - u),
			color: [
				1.6,
				1.4,
				1
			]
		};
	},
	kidney_shot(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c] = $(t, "q", 2), l = i(e.tx, e.tz);
		return Z(s, {
			frame: "crit",
			index: Math.min(3, Math.floor(n * 12)),
			x: e.tx + a * .3,
			y: l + .85,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 2.4,
			...Q(ed, 1.2),
			a: +(n < .35),
			halo: 1
		}), Z(c, {
			frame: "impact",
			index: Math.min(3, Math.floor(n * 14)),
			x: e.tx + a * .32,
			y: l + .8,
			z: e.tz + o * .32,
			mode: "billboard",
			scale: 2.8,
			r: 1.9,
			g: 1.5,
			b: 1.2,
			a: +(n < .28),
			halo: 1
		}), {
			x: e.tx,
			z: e.tz,
			k: 1.4 * Math.exp(-n / .15),
			color: [
				1.8,
				.5,
				.5
			]
		};
	},
	fan_of_knives(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let s = $(t, "q", 5), c = $(t, "h", Math.min(4, e.reached.length)), l = Math.atan2(e.tz - e.z, e.tx - e.x), u = 3 * Y(n / .28), d = i(e.x, e.z) + .6;
		return s.forEach((t, r) => {
			let i = l + (r - 2) * .26, a = Math.cos(i), o = Math.sin(i);
			Z(t, {
				frame: "heroBlade",
				index: Math.floor(n * 20) % 2,
				x: e.x + a * (.3 + u),
				y: d,
				z: e.z + o * (.3 + u),
				mode: "flat",
				...ld(a, o),
				scale: .6,
				...Q(td, 1.2),
				a: +(n < .3),
				halo: 1
			});
		}), c.forEach((t, r) => {
			let s = e.reached[r], c = n - .12;
			Z(t, {
				frame: "impact",
				index: Math.min(3, Math.max(0, Math.floor(c * 14))),
				x: s.x + a * .3,
				y: i(s.x, s.z) + .75,
				z: s.z + o * .3,
				mode: "billboard",
				scale: 2,
				...Q(td, 1.3),
				a: +(c > 0 && c < .28),
				halo: 1
			});
		}), null;
	},
	shadowstep(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let s = $(t, "p", 8), [c, l] = $(t, "q", 2), u = i(e.tx, e.tz);
		return s.forEach((t, r) => {
			let a = r < 4 ? {
				x: e.fx,
				z: e.fz,
				t: n
			} : {
				x: e.tx,
				z: e.tz,
				t: n - .1
			}, o = r * 1.57 + .4, s = a.t, c = .15 + .35 * Y(s / .5);
			Z(t, {
				frame: "dust",
				index: Math.min(2, Math.max(0, Math.floor(s * 5))),
				x: a.x + Math.cos(o) * c,
				y: i(a.x, a.z) + .35 + .35 * s,
				z: a.z + Math.sin(o) * c,
				mode: "billboard",
				scale: 2.6,
				r: .35,
				g: .32,
				b: .45,
				a: s > 0 ? 1 - Y(s / .6) : 0
			});
		}), Z(c, {
			frame: "slashBig",
			index: Math.min(3, Math.max(0, Math.floor((n - .12) * 16))),
			x: e.tx + a * .3,
			y: u + .8,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 1.1,
			rot: .6,
			...Q(ed, 1.3),
			a: +(n > .12 && n < .4),
			halo: 1
		}), Z(l, {
			frame: "crit",
			index: Math.min(3, Math.max(0, Math.floor((n - .14) * 12))),
			x: e.tx + a * .32,
			y: u + 1,
			z: e.tz + o * .32,
			mode: "billboard",
			scale: 2.4,
			...Q(ed, 1.4),
			a: +(n > .14 && n < .5),
			halo: 1
		}), n > .12 ? {
			x: e.tx,
			z: e.tz,
			k: 1.5 * Math.exp(-(n - .12) / .2),
			color: [
				1.8,
				.4,
				.5
			]
		} : null;
	},
	caltrops(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let s = $(t, "q", 14), [c] = $(t, "r", 1), l = 1 - Y((n - 5.4) / .6), u = Math.max(.6, e.r);
		return s.forEach((r, a) => {
			let o = (a * 137.5 + t.seed) % 360 * Math.PI / 180, s = u * .85 * Math.sqrt((a * 61 + t.seed) % 97 / 97), c = e.tx + Math.cos(o) * s, d = e.tz + Math.sin(o) * s, f = Uu((n - a * .015) / .25), p = .6 + .4 * Math.sin(n * 6 + a * 1.7);
			Z(r, {
				frame: "partyIceShard",
				index: a % 4,
				x: c,
				y: i(c, d) + .06 + .8 * (1 - f) * Math.sin(f * Math.PI),
				z: d,
				mode: "billboard",
				scale: .55,
				...Q(nd, .8 + .6 * p),
				a: f > 0 ? l : 0
			});
		}), Z(c, {
			frame: "partyRing",
			index: 1,
			x: e.tx,
			y: i(e.tx, e.tz) + .05,
			z: e.tz,
			mode: "flat",
			scale: 2 * u / 6,
			...Q(ed, .5),
			a: .7 * Y(n / .3) * l
		}), null;
	},
	flare(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l, u, ...d] = $(t, "q", 10), f = i(e.tx, e.tz), p = n - .7;
		return Z(s, {
			frame: "heroSigil",
			x: e.tx,
			y: f + .04,
			z: e.tz,
			mode: "flat",
			scale: .1 + .12 * Y(n / .7),
			rot: n * 2.2,
			...Q(Hu, .9),
			a: n < .7 ? .8 + .2 * Math.sin(n * 30) : 1 - Y(p / .3)
		}), Z(c, {
			frame: "pillar",
			index: Math.floor(Math.max(0, p) * 12) % 4,
			x: e.tx + a * .2,
			y: f + 1.6,
			z: e.tz + o * .2,
			mode: "billboard",
			scale: 1.4,
			...Q(Hu, 1.1),
			a: p > 0 ? 1 - Y((p - .25) / .3) : 0,
			halo: 1
		}), Z(l, {
			frame: "partyPillar",
			index: 0,
			x: e.tx + a * .22,
			y: f + 1.5,
			z: e.tz + o * .22,
			mode: "billboard",
			scale: .8,
			r: 2,
			g: 1.5,
			b: .7,
			a: p > 0 ? Uu((.25 - p) / .1) : 0,
			halo: 1
		}), Z(u, {
			frame: "impact",
			index: Math.min(3, Math.max(0, Math.floor(p * 14))),
			x: e.tx + a * .3,
			y: f + .6,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 3.4,
			r: 2,
			g: 1.3,
			b: .5,
			a: +(p > 0 && p < .3),
			halo: 1
		}), d.forEach((t, r) => {
			let i = r * 1.047, a = .55;
			Z(t, {
				frame: "wallFlame",
				index: Math.floor(n * 10 + r) % 4,
				x: e.tx + Math.cos(i) * a,
				y: f + .5,
				z: e.tz + Math.sin(i) * a,
				mode: "billboard",
				scale: 1,
				...Q(Hu),
				a: p > 0 ? 1 - Y((p - .25) / .35) : 0,
				halo: 1
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: p > 0 ? 3.2 * Math.exp(-p / .25) : .4 * Y(n / .7),
			color: [
				1.9,
				.95,
				.35
			]
		};
	},
	gather(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c] = $(t, "q", 2), l = $(t, "p", Math.min(5, e.reached.length)), u = i(e.tx, e.tz), d = 1 - Y((n - .5) / .35);
		return Z(s, {
			frame: "partySwirl",
			index: Math.floor(n * 8) % 2,
			x: e.tx,
			y: u + .08,
			z: e.tz,
			mode: "flat",
			scale: e.r * 2 / 5 * (1 - .6 * Y(n / .5)),
			rot: n * 7,
			...Q(rd, 1.1),
			a: d
		}), Z(c, {
			frame: "partySwirl",
			index: (Math.floor(n * 8) + 1) % 2,
			x: e.tx,
			y: u + .5,
			z: e.tz,
			mode: "flat",
			scale: e.r * 2 / 7 * (1 - .6 * Y(n / .5)),
			rot: -n * 9,
			...Q(rd, 1.4),
			a: .8 * d,
			halo: 1
		}), l.forEach((t, r) => {
			let a = e.reached[r], o = Y(n / .4), s = a.x + (e.tx - a.x) * .5 * o, c = a.z + (e.tz - a.z) * .5 * o;
			Z(t, {
				frame: "heroGaleLit",
				index: Math.floor(n * 20) % 4,
				x: s,
				y: i(s, c) + .4,
				z: c,
				mode: "flat",
				...ld(e.tx - a.x, e.tz - a.z),
				scale: .45,
				...Q(rd, 1.3),
				a: +(n < .45)
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: 1.4 * d,
			color: [
				.6,
				.85,
				1.9
			]
		};
	},
	glacial_tomb(e, t, n, r, i, a, o) {
		if ((t.gf == null || t.gf < 0) && (t.gf = r.frost.add({
			x: e.tx,
			z: e.tz,
			radius: Math.max(.6, Math.min(4, e.r)),
			seed: t.seed + 3
		})), n == null) return t.gf >= 0 && r.frost.set(t.gf, {
			spread: .1 * Y(e.age / .38),
			cracks: 0,
			fade: 0,
			glow: 1
		}), {
			x: e.tx,
			z: e.tz,
			k: .25,
			color: [
				.55,
				.95,
				1.9
			]
		};
		let s = $(t, "s", Math.min(5, e.reached.length)), c = Y((n - 2.4) / .3);
		if (!t.spikes) {
			t.spikes = [];
			for (let n of e.reached.slice(0, 5)) for (let e = 0; e < 2; e++) {
				let a = e * 2.6 + t.seed * .01, o = n.x + Math.cos(a) * .32, s = n.z + Math.sin(a) * .32, c = r.crystals.spawn({
					x: o,
					y: i(o, s) - .02,
					z: s,
					height: .55,
					radius: .13,
					yaw: a,
					tiltX: Math.cos(a) * .1,
					tiltZ: Math.sin(a) * .1,
					seed: t.seed + e * 7
				});
				c >= 0 && (t.crystals.push(c), t.spikes.push(c));
			}
		}
		return t.spikes.forEach((e) => r.crystals.set(e, {
			rise: Wu(n / .13) * (1 - c),
			crack: Y((n - 2.1) / .3),
			glint: Y(n / .4),
			glow: 1.1
		})), t.gf >= 0 && r.frost.set(t.gf, {
			spread: .1 + .9 * Y(n / .3),
			cracks: Y((n - .1) / .5),
			fade: Y((n - 2.3) / .6),
			glow: 1 + .6 * Math.exp(-n / .2)
		}), s.forEach((t, r) => {
			let s = e.reached[r];
			Z(t, {
				frame: "partyIceShellLit",
				index: +(n > 2.1),
				x: s.x + a * .12,
				y: i(s.x, s.z) + .6,
				z: s.z + o * .12,
				mode: "billboard",
				scale: 1.15 - .1 * Y(n / .1),
				...Q(id, .85),
				a: +(n > .05) * (1 - c),
				halo: 1
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: .4 + 2.4 * Math.exp(-n / .2) + 1.8 * Math.exp(-Math.abs(n - 2.5) / .1),
			color: [
				.55,
				.95,
				1.9
			]
		};
	},
	blizzard(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l] = $(t, "q", 3), u = $(t, "f", 18), d = i(e.tx, e.tz), f = Y(n / .4) * (1 - Y((n - 5.4) / .6)), p = Math.max(.6, e.r);
		return Z(l, {
			frame: "partyFrostFloor",
			x: e.tx,
			y: d + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 4,
			rot: .3,
			...Q(id, .55),
			a: .8 * f
		}), Z(s, {
			frame: "partySwirl",
			index: Math.floor(n * 6) % 2,
			x: e.tx,
			y: d + 2,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 5 * 1.1,
			rot: n * 2.4,
			...Q(id, .9),
			a: .85 * f
		}), Z(c, {
			frame: "partySwirl",
			index: (Math.floor(n * 6) + 1) % 2,
			x: e.tx,
			y: d + 1.1,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 5 * .75,
			rot: -n * 3.6,
			...Q(id, 1.1),
			a: .85 * f,
			halo: 1
		}), u.forEach((t, r) => {
			let i = (n * (.55 + r % 5 * .07) + r * .137) % 1, a = r * 2.399 + n * .8, o = p * .9 * Math.sqrt(r * 31 % 17 / 17), s = e.tx + Math.cos(a) * o, c = e.tz + Math.sin(a) * o;
			Z(t, {
				frame: "partyIceFlake",
				index: r % 2,
				x: s,
				y: d + 2.1 * (1 - i) + .05,
				z: c,
				mode: "billboard",
				scale: 1.4,
				...Q(id, 1.3),
				a: f * +(i < .95)
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: .8 * f,
			color: [
				.55,
				.95,
				1.9
			]
		};
	},
	sanctuary(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s] = $(t, "q", 1), c = $(t, "m", 8), l = $(t, "r", Math.min(3, e.reached.length)), u = i(e.tx, e.tz), d = Y(n / .3) * (1 - Y((n - 3.5) / .5)), f = Math.max(.6, e.r);
		return Z(s, {
			frame: "partyGlyphHoly",
			x: e.tx,
			y: u + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * f / 8,
			rot: n * .6,
			...Q(J.core, .8),
			a: .9 * d,
			halo: 1
		}), c.forEach((t, r) => {
			let i = (n * .6 + r / 8) % 1, a = r * .785 + n * .5, o = f * .7;
			Z(t, {
				frame: "partyHolyOrb",
				index: r % 2,
				x: e.tx + Math.cos(a) * o,
				y: u + .2 + 1.6 * i,
				z: e.tz + Math.sin(a) * o,
				mode: "billboard",
				scale: .9,
				...Q(J.core),
				a: d * (1 - i),
				halo: 1
			});
		}), l.forEach((t, r) => {
			let a = e.reached[r];
			Z(t, {
				frame: "partyWardRing",
				x: a.x,
				y: i(a.x, a.z) + .06,
				z: a.z,
				mode: "flat",
				scale: .9,
				rot: n,
				...Q(J.core, .9),
				a: d,
				halo: 1
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: 1.1 * d,
			color: [
				.6,
				1.8,
				.5
			]
		};
	},
	consecrate(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c] = $(t, "q", 2), l = $(t, "s", 5), u = i(e.tx, e.tz), d = Y(n / .4) * (1 - Y((n - 7.4) / .6)), f = Math.max(.6, e.r);
		return Z(s, {
			frame: "partyGlyphHoly",
			x: e.tx,
			y: u + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * f / 8,
			rot: -n * .3,
			...Q(q.glyph, 1),
			a: .9 * d,
			halo: 1
		}), Z(c, {
			frame: "partyRing",
			index: 1,
			x: e.tx,
			y: u + .05,
			z: e.tz,
			mode: "flat",
			scale: 2 * f / 6,
			...Q(q.ring, 1.1),
			a: .8 * d
		}), l.forEach((t, r) => {
			let i = r * 1.2566 + n * .2, a = f * .6, o = (n * .5 + r * .2) % 1;
			Z(t, {
				frame: "partyPillar",
				index: 1 + r % 3,
				x: e.tx + Math.cos(i) * a,
				y: u + 1.2,
				z: e.tz + Math.sin(i) * a,
				mode: "billboard",
				scale: .45,
				...Q(q.body, .7),
				a: d * .6 * Math.sin(o * Math.PI)
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: .9 * d,
			color: [
				1.9,
				1.4,
				.5
			]
		};
	},
	revive(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l, u] = $(t, "q", 4), d = $(t, "m", 6), f = i(e.tx, e.tz), p = .9, m = 3 * p;
		return Z(s, {
			frame: "partyPillar",
			index: 1 + Math.min(2, Math.floor(n / .15)),
			x: e.tx + a * .2,
			y: f + m,
			z: e.tz + o * .2,
			mode: "billboard",
			scale: p,
			...Q(q.body),
			a: .95 * Uu((1 - n) / .4)
		}), Z(c, {
			frame: "partyPillar",
			index: 0,
			x: e.tx + a * .22,
			y: f + m,
			z: e.tz + o * .22,
			mode: "billboard",
			scale: p,
			...Q(q.core),
			a: Uu((.5 - n) / .2),
			halo: 1
		}), Z(l, {
			frame: "partySunburst",
			index: Math.min(3, Math.floor(n / .1)),
			x: e.tx,
			y: f + .05,
			z: e.tz,
			mode: "flat",
			scale: 1.4,
			rot: n * 2,
			...Q(q.burst),
			a: Math.max(0, 1 - n / .6),
			halo: 1
		}), Z(u, {
			frame: "partySunburst",
			index: Math.min(3, Math.floor((n - .3) / .08)),
			x: e.tx + a * .3,
			y: f + 1.6,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 1.4,
			...Q(q.burst),
			a: n > .3 ? 1 - Y((n - .45) / .25) : 0,
			halo: 1
		}), d.forEach((t, r) => {
			let i = Uu((n - r * .08) / 1.1), a = r * 1.047;
			Z(t, {
				frame: "partyHolyOrb",
				index: r % 2,
				x: e.tx + Math.cos(a) * .3,
				y: f + .2 + 1.8 * i,
				z: e.tz + Math.sin(a) * .3,
				mode: "billboard",
				scale: .9,
				...Q(q.core),
				a: i > 0 && i < 1 ? 1 - i : 0,
				halo: 1
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: 2.6 * Math.exp(-n / .5),
			color: [
				1.9,
				1.4,
				.5
			]
		};
	},
	judgement(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l, u] = $(t, "q", 4), d = $(t, "six", 6), f = i(e.tx, e.tz), p = Math.max(.6, e.r), m = n - .8;
		Z(s, {
			frame: "partyGlyphHoly",
			x: e.tx,
			y: f + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 8 * (.4 + .6 * Y(n / .4)),
			rot: n * 1.2,
			...Q(q.glyph),
			a: .9 * (1 - Y((n - 1.2) / .4)),
			halo: 1
		}), d.forEach((t, r) => {
			let s = r * 1.047 + .2, c = n - .1 - r * .05, l = e.tx + Math.cos(s) * p * .75, u = e.tz + Math.sin(s) * p * .75;
			Z(t, {
				frame: "partyPillar",
				index: 1 + Math.min(2, Math.max(0, Math.floor(c / .1))),
				x: l + a * .1,
				y: i(l, u) + 1.5,
				z: u + o * .1,
				mode: "billboard",
				scale: .5,
				...Q(q.body),
				a: c > 0 ? Uu((.35 - c) / .12) : 0,
				halo: 1
			});
		});
		let h = 1.3, g = 3 * h;
		return Z(c, {
			frame: "partyPillar",
			index: 1 + Math.min(2, Math.max(0, Math.floor(m / .12))),
			x: e.tx + a * .25,
			y: f + g,
			z: e.tz + o * .25,
			mode: "billboard",
			scale: h,
			...Q(q.body, 1.2),
			a: m > 0 ? Uu((.45 - m) / .15) : 0
		}), Z(l, {
			frame: "partyPillar",
			index: 0,
			x: e.tx + a * .27,
			y: f + g,
			z: e.tz + o * .27,
			mode: "billboard",
			scale: h,
			...Q(q.core, 1.2),
			a: m > 0 ? Uu((.3 - m) / .1) : 0,
			halo: 1
		}), Z(u, {
			frame: "partySunburst",
			index: Math.min(3, Math.max(0, Math.floor(m / .08))),
			x: e.tx,
			y: f + .05,
			z: e.tz,
			mode: "flat",
			scale: 1.8,
			rot: m * 2,
			...Q(q.burst),
			a: m > 0 ? Math.max(0, 1 - m / .45) : 0,
			halo: 1
		}), {
			x: e.tx,
			z: e.tz,
			k: m > 0 ? 3.4 * Math.exp(-m / .2) : .8 * Y(n / .3),
			color: [
				1.9,
				1.4,
				.5
			]
		};
	},
	binding_roots(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s] = $(t, "q", 1), c = $(t, "t", Math.min(15, e.reached.length * 3)), l = i(e.tx, e.tz), u = 1 - Y((n - 2.1) / .4);
		return Z(s, {
			frame: "partyRing",
			index: n < .15 ? 0 : 1,
			x: e.tx,
			y: l + .05,
			z: e.tz,
			mode: "flat",
			scale: 2 * Math.max(.6, e.r) / 6 * (.4 + .6 * Y(n / .25)),
			...Q(od, .9),
			a: 1 - Y((n - .3) / .4)
		}), c.forEach((t, r) => {
			let s = e.reached[Math.floor(r / 3)], c = r % 3 * 2.094 + .5, l = s.x + Math.cos(c) * .22, d = s.z + Math.sin(c) * .22;
			Z(t, {
				frame: "partyIceSpike",
				index: Math.min(2, Math.floor(n * 10)),
				x: l + a * .05,
				y: i(l, d) + .35 * Y(n / .18),
				z: d + o * .05,
				mode: "billboard",
				scale: .9,
				r: .35,
				g: .9,
				b: .2,
				a: u
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: .9 * Math.exp(-n / .3),
			color: [
				.8,
				1.6,
				.4
			]
		};
	},
	old_marks(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l] = $(t, "q", 3), u = i(e.tx, e.tz), d = e.k || 1;
		return Z(s, {
			frame: "heroRunes",
			index: (d - 1) % 2,
			x: e.tx + a * .3,
			y: u + 1.45 + .1 * n,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: .7 + .15 * d,
			...Q(d >= 3 ? sd : ad, 1.1 + .2 * d),
			a: 1 - Y((n - .45) / .3),
			halo: 1
		}), Z(c, {
			frame: "crit",
			index: Math.min(3, Math.floor(n * 12)),
			x: e.tx + a * .32,
			y: u + .85,
			z: e.tz + o * .32,
			mode: "billboard",
			scale: 2.6,
			...Q(sd, 1.3),
			a: +(d >= 3 && n < .35),
			halo: 1
		}), Z(l, {
			frame: "partySunburst",
			index: Math.min(3, Math.floor(n / .08)),
			x: e.tx + a * .3,
			y: u + .9,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 1.3,
			...Q(sd, 1.2),
			a: d >= 3 ? Math.max(0, 1 - n / .4) : 0,
			halo: 1
		}), d >= 3 ? {
			x: e.tx,
			z: e.tz,
			k: 1.6 * Math.exp(-n / .2),
			color: [
				1.3,
				.5,
				1.8
			]
		} : null;
	},
	spirit_totem(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let s = i(e.tx, e.tz), c = Y(n / .4), l = Y((n - 7.4) / .6), u = n % 1.5 / 1.5, [d, f] = $(t, "q", 2);
		t.bells ||= [r.bells.spawn({
			x: e.tx,
			y: -500,
			z: e.tz,
			height: 1.4,
			palette: 0,
			seed: t.seed
		})];
		let p = t.bells[0];
		return p >= 0 && r.bells.set(p, {
			x: e.tx,
			y: s + 2.3,
			z: e.tz,
			swing: .35 * Math.sin(u * Math.PI * 2) * Math.exp(-u * 2),
			swingX: 1,
			swingZ: 0,
			spin: n * .3,
			dissolve: Math.max(1 - c, l),
			dissolveDir: 1,
			ghost: .15,
			glow: 1.2,
			strike: Math.exp(-u * 6)
		}), Z(d, {
			frame: "partyWardRing",
			x: e.tx,
			y: s + .05,
			z: e.tz,
			mode: "flat",
			scale: 2.2,
			rot: n * .4,
			...Q(ad, .8),
			a: .85 * c * (1 - l),
			halo: 1
		}), Z(f, {
			frame: "partyRing",
			index: u < .15 ? 0 : 1,
			x: e.tx,
			y: s + .07,
			z: e.tz,
			mode: "flat",
			scale: .3 + .7 * (1 - u),
			...Q(ad, 1.2),
			a: c * (1 - l) * (1 - Y(u / .8))
		}), {
			x: e.tx,
			z: e.tz,
			k: (.5 + 1.2 * Math.exp(-u * 5)) * c * (1 - l),
			color: [
				.5,
				1.6,
				1.4
			]
		};
	},
	thunder_drum(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l] = $(t, "q", 3), u = $(t, "g", Math.min(5, e.reached.length)), d = i(e.tx, e.tz), f = Y(n / .3), p = Math.max(.6, e.r);
		return Z(s, {
			frame: "partyRing",
			index: n < .12 ? 0 : 1,
			x: e.tx,
			y: d + .06,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 6 * (.15 + .95 * f),
			...Q(ad, 1.4),
			a: 1 - Y((n - .25) / .3),
			halo: 1
		}), Z(c, {
			frame: "partyRing",
			index: 1,
			x: e.tx,
			y: d + .6,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 6 * (.1 + .7 * f),
			...Q([
				1.6,
				1.6,
				1.9
			], 1),
			a: .7 * (1 - Y((n - .15) / .25))
		}), Z(l, {
			frame: "partySunburst",
			index: Math.min(3, Math.floor(n / .07)),
			x: e.tx + a * .3,
			y: d + .8,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 1.5,
			...Q(ad, 1.3),
			a: Math.max(0, 1 - n / .3),
			halo: 1
		}), u.forEach((t, r) => {
			let a = e.reached[r], o = n - .08;
			Z(t, {
				frame: "heroGaleLit",
				index: Math.floor(n * 20) % 4,
				x: a.x,
				y: i(a.x, a.z) + .4,
				z: a.z,
				mode: "flat",
				...ld(a.x - e.tx, a.z - e.tz),
				scale: .55,
				...Q(ad, 1.2),
				a: +(o > 0 && o < .4)
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: 2.4 * Math.exp(-n / .2),
			color: [
				.6,
				1.7,
				1.6
			]
		};
	},
	aura_stun(e, t, n, r, i, a, o, s) {
		let [c] = $(t, "q", 1);
		return t.t = (t.t || 0) + s, Z(c, {
			frame: "stun",
			index: Math.floor(t.t * 10) % 4,
			x: e.x + a * .1,
			y: i(e.x, e.z) + 1.35,
			z: e.z + o * .1,
			mode: "billboard",
			scale: 1.1,
			r: 3,
			g: 2.6,
			b: .8,
			a: 1,
			halo: 1
		}), null;
	},
	aura_frozen(e, t, n, r, i, a, o, s) {
		let [c] = $(t, "q", 1);
		return t.t = (t.t || 0) + s, Z(c, {
			frame: "partyIceShellLit",
			index: 0,
			x: e.x + a * .12,
			y: i(e.x, e.z) + .6,
			z: e.z + o * .12,
			mode: "billboard",
			scale: 1.1,
			...Q(id, .85),
			a: Y(t.t / .1),
			halo: 1
		}), null;
	},
	aura_root(e, t, n, r, i, a, o, s) {
		let c = $(t, "q", 3);
		return t.t = (t.t || 0) + s, c.forEach((t, n) => {
			let r = n * 2.094 + .5, s = e.x + Math.cos(r) * .22, c = e.z + Math.sin(r) * .22;
			Z(t, {
				frame: "partyIceSpike",
				index: 2,
				x: s + a * .05,
				y: i(s, c) + .3,
				z: c + o * .05,
				mode: "billboard",
				scale: .8,
				r: .35,
				g: .9,
				b: .2,
				a: 1
			});
		}), null;
	}
}, dd = {
	ready: !1,
	async load(e, t = [], n = "vale") {
		let r = ++nl;
		n !== nu && (nu = n, tu.clear());
		let i = Nn(e).level;
		return tl = (async () => {
			W ? await W.swapLevel(i, { spawn: i.spawn }) : await gu(i), r === nl && (_u(), zu = !!i.environment?.interior, dd.settings({ dof: rl }), Ql(i, n), await Fl(t, n));
		})(), await tl, r === nl;
	},
	settings(e = {}) {
		e.dof && (rl = e.dof), e.bright > 0 && (Hl = e.bright), e.figLit > 0 && (Wl = e.figLit), e.figMax > 0 && (Gl = e.figMax), (e.figures === "models" || e.figures === "sprites") && (gl = e.figures);
		let t = W?.postfx?.settings;
		t?.dof && Object.assign(t.dof, {
			enabled: rl !== "off" && !zu,
			focusRange: 16,
			tiltShift: .14,
			tiltWidth: .62
		});
	},
	frame(e) {
		if (!W || !W.engine) return;
		Ul = e.bright > 0 ? e.bright : 1, mu.x = e.focus[0], mu.y = e.focus[1], mu.z = e.focus[2], mu.ppu = e.ppu, Number.isFinite(e.hour) && Math.abs((W.lighting?.timeOfDay ?? -1) - e.hour) > .004 && W.setTime(e.hour), e.weather && W.weather?.weather !== e.weather && W.setWeather(e.weather), W.lighting?.settings && (W.lighting.settings.fogMul = 1 + .6 * (e.fog || 0), W.lighting.settings.pointLightMul = e.ambient?.lamps ?? 1), e.hero && W.player && (_u(), W.player.position.set(e.hero[0], W.tileMap.getHeight(e.hero[0], e.hero[1]), e.hero[1])), Kl = Yl();
		let t = /* @__PURE__ */ new Map(), n = W.engine.camera, r = /* @__PURE__ */ new Map();
		kl++, n.getWorldDirection(_l);
		let i = Math.atan2(-_l.x, -_l.z);
		for (let a of e.actors) {
			let o = r.get(a.name) || 0;
			if (r.set(a.name, o + 1), Ml(a, a.key ?? `${a.name}#${o}`, Math.max(0, Math.min(.1, e.dt || 0)), i)) continue;
			let s = dl(a.name);
			if (!s) continue;
			let c = a.cw ? a.cw / s.meta.cw : 1, l = fl(s, c), u = t.get(l) || 0;
			t.set(l, u + 1);
			let d = ml(l, u);
			d.visible = !0, d.material.emissiveIntensity !== Kl && (d.material.emissiveIntensity = Kl), (d._col !== a.col || d._row !== a.row) && d.setFrame(a.col, a.row), hl(d, a.x, a.z, (s.meta.ch - s.meta.ay) * c, l.pixelsPerUnit * c);
			let f = a.flash || 0, p = f ? 0 : Math.round((a.warn || 0) * 20) / 20;
			if (d._emberFlash !== f || d._emberWarn !== p) {
				d._emberFlash = f, d._emberWarn = p;
				let e = 1 + f * 2.6;
				d.tint = p ? new j(1 + .9 * p, 1 + .12 * p, 1 - .35 * p) : new j(e, e * .96, e * .9);
			}
			let m = 1 - (a.fade || 0);
			Math.abs(d.opacity - m) > .01 && (d.opacity = m), d.update(0, n);
		}
		for (let r of e.bits || []) {
			let e = au(r), i = t.get(e) || 0;
			t.set(e, i + 1);
			let a = ou(e, i), o = r.glow ? 1.6 : .3;
			a.visible = !0, a.material.emissiveIntensity !== o && (a.material.emissiveIntensity = o), hl(a, r.x, r.z, r.canvas.height - r.ay - r.lift, Jc);
			let s = r.flash || 0;
			if (a._emberFlash !== s) {
				a._emberFlash = s;
				let e = 1 + s * 2.6;
				a.tint = new j(e, e * .96, e * .9);
			}
			a.update(0, n);
		}
		for (let [e, n] of pl) {
			let r = t.get(e) || 0;
			for (let e = r; e < n.length; e++) n[e].visible && (n[e].visible = !1);
		}
		Nl();
		let a = {
			ring: 0,
			disc: 0,
			rim: 0,
			focus: 0,
			wfill: 0,
			wrim: 0,
			lane: 0
		};
		for (let t of e.rings || []) ku(Ou("ring", a.ring++), t.x, t.z, 1, t.col, t.a);
		if (e.mark) {
			let t = Ou("focus", a.focus++);
			ku(t, e.mark.x, e.mark.z, 1, [
				255,
				226,
				150
			], .7 + .2 * Math.sin(Lu * 4)), t.rotation.z = Lu, Lu += (e.dt || 0) * .9;
		}
		for (let t of e.hazards || []) ku(Ou("disc", a.disc++), t.x, t.z, t.r, t.col, .82 * t.a), ku(Ou("rim", a.rim++), t.x, t.z, t.r, t.rim, .42 * t.a);
		for (let t of e.warns || []) {
			let e = t.heavy ? 1 : .62, n = t.hit > 0 ? t.hit : 1, r = 1 - (1 - t.p) * (1 - t.p);
			t.lane ? (Au(Ou("lane", a.lane++), t.x, t.z, t.tx, t.tz, 1, t.w * 1.25, Nu, .3 * e * n), Au(Ou("lane", a.lane++), t.x, t.z, t.tx, t.tz, 1, t.w, ju, .16 * e * n), Au(Ou("lane", a.lane++), t.x, t.z, t.tx, t.tz, t.p, t.w * .7, t.hit > 0 ? Mu : ju, (.22 + .28 * t.p) * e * n), ku(Ou("wrim", a.wrim++), t.tx, t.tz, t.heavy ? .42 : .3, t.hit > 0 ? Mu : ju, (.35 + .4 * t.p) * e * n)) : (ku(Ou("wrim", a.wrim++), t.tx, t.tz, t.r * 1.1, Nu, .5 * n), ku(Ou("wfill", a.wfill++), t.tx, t.tz, t.r * r, t.hit > 0 ? Mu : ju, (.26 + .3 * t.p) * n), ku(Ou("wrim", a.wrim++), t.tx, t.tz, t.r, t.hit > 0 ? Mu : ju, (.7 + .3 * t.p) * n));
		}
		su(e.water);
		for (let e of Object.keys(Eu)) for (let t = a[e]; t < Eu[e].length; t++) Eu[e][t].visible = !1;
		if (Iu !== nl) {
			Iu = nl, Fu = W.world?.acquireSpellLight?.({ minor: !1 }) ?? null, Pu = W.world?.acquireSpellLight?.({ minor: !1 }) ?? null, Gu = W.world?.acquireSpellLight?.({ minor: !1 }) ?? null;
			for (let e of Ku.values()) X && Xu(e);
			Ku.clear();
		}
		if (Fu && e.hero) {
			let t = Math.max(0, Math.min(1, e.carry ?? 0)), n = e.hero[0] + .35, r = e.hero[1] + .35, i = gl === "models" ? 3.6 : 2.4, a = gl === "models" ? 1.75 : 1;
			Fu.set(n, W.tileMap.getHeight(e.hero[0], e.hero[1]) + i, r, {
				color: [
					1.9,
					1.15,
					.42
				],
				intensity: 4.5 * a * t / (e.ambient?.lamps ?? 1),
				distance: 6 + (i - 2.4),
				decay: 1.4,
				flicker: .12
			});
		}
		if (Pu) {
			let t = e.blast;
			t && t.k > .01 ? Pu.set(t.x, W.tileMap.getHeight(t.x, t.z) + 1.6, t.z, {
				color: [
					2,
					.95,
					.32
				],
				intensity: 9 * t.k / (e.ambient?.lamps ?? 1),
				distance: 7,
				decay: 1.6,
				flicker: .25
			}) : Pu.off();
		}
		Zu(e.spells || [], e.dt || 0, e.ambient?.lamps, !!(e.rings && e.rings.length));
		let o = 0;
		for (let t of e.beasts || []) {
			let e = ru(t.id);
			if (!e) continue;
			let r = lu(o++, e);
			r.visible = !0, hl(r, t.x, t.z, e.below, Jc), r.update(0, n);
		}
		for (let e = o; e < cu.length; e++) cu[e]?.visible && (cu[e].visible = !1);
		Ru = e.ambient || null;
		for (let e of Pl) e.update(0, n);
		pu(e.light), W.engine.step(Math.max(0, Math.min(.1, e.dt)), { render: e.draw !== !1 });
	},
	sprites(e) {
		W && Fl(e, nu);
	},
	project(e, t, n) {
		if (!W) return null;
		let r = new A(e, t, n).project(W.engine.camera);
		return [(r.x + 1) / 2 * innerWidth, (1 - r.y) / 2 * innerHeight];
	},
	ground(e, t) {
		return W?.tileMap ? W.tileMap.getHeight(e, t) : null;
	},
	get stats() {
		let e = (e) => Eu[e].filter((e) => e.visible).length;
		return {
			bits: [...pl.entries()].filter(([e]) => e.name === "ember-bit").reduce((e, [, t]) => e + t.filter((e) => e.visible).length, 0),
			water: G.mesh && G.mesh.visible ? G.mesh.count : 0,
			fig: Kl,
			lit: Math.round(ql * 100) / 100,
			beasts: cu.filter((e) => e?.visible).length,
			light: +!!K.on,
			lightDepth: K.on && K.keyed && W?.postfx?.depthTexture ? 1 : 0,
			rings: e("ring"),
			hazards: e("disc"),
			warns: e("wrim"),
			lanes: e("lane"),
			spells: Ku.size,
			dome: X && X.domeOf ? 1 : 0,
			blades: X ? X.blades.count - (X.warmN > 0 ? 2 : 0) : 0,
			crystals: X ? X.crystals.count - +(X.warmN > 0) : 0,
			frost: X ? X.frost.count - +(X.warmN > 0) : 0,
			spellLight: Gu && X ? 1 : 0,
			focus: e("focus"),
			carry: +!!Fu,
			level: nl,
			actors: [...pl.values()].reduce((e, t) => e + t.filter((e) => e.visible).length, 0) + [...Ol.values()].filter((e) => e.root.visible).length,
			models: [...Ol.values()].filter((e) => e.root.visible).length,
			modelMeshes: [...El.values()].filter(Boolean).map((e) => e.meshes.after).reduce((e, t) => e + t, 0),
			modelMeshesBefore: [...El.values()].filter(Boolean).map((e) => e.meshes.before).reduce((e, t) => e + t, 0),
			figures: gl,
			atlases: ul.size,
			env: Pl.length,
			sky: Zl,
			ours: Pl.filter((e) => e.name.startsWith("ember:prop:")).length,
			programs: W?.engine?.renderer?.info?.programs?.length ?? null
		};
	}
};
function fd(e) {
	if ($c) throw Error("createWorld: one world a page");
	return $c = e.container, el = e.uiRoot, Gc = e.assets, Xc = On("en"), At(), Zc = Tn({
		lang: Xc,
		px: En({
			w: innerWidth,
			h: innerHeight,
			dpr: devicePixelRatio || 1
		}).px
	}), Qc = zr(Xc, {}), dd.ready = !0, dd;
}
//#endregion
export { fd as createWorld };
