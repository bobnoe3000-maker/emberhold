import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { $ as t, $n as n, A as r, An as i, At as a, Bn as o, Bt as s, Dt as c, Et as l, Fn as u, Ft as d, G as f, Hn as p, Ht as m, I as h, J as g, Jn as _, K as v, Kn as y, L as b, Lt as x, M as S, Mt as C, N as w, Nn as T, Nt as E, Ot as D, Pt as ee, Q as O, Qn as te, R as k, Rt as ne, S as A, T as re, Tt as ie, U as j, Un as ae, Ut as oe, Vt as se, Wn as ce, X as le, Xn as ue, Xt as de, Yn as M, Zn as fe, _ as pe, _r as me, _t as he, a as ge, at as _e, bt as N, c as ve, ct as ye, d as be, dt as xe, er as Se, et as Ce, f as we, ft as Te, g as P, gr as F, gt as Ee, h as De, hr as Oe, ht as ke, ir as Ae, j as je, jt as Me, kt as Ne, l as Pe, lt as Fe, m as Ie, mt as Le, n as Re, nr as ze, nt as Be, o as Ve, or as He, ot as Ue, p as We, q as Ge, qn as Ke, r as qe, rr as Je, rt as Ye, s as I, st as Xe, tr as L, tt as Ze, ut as Qe, v as R, vr as $e, vt as et, xt as tt, yt as nt, zt as rt } from "./three.core-DkXkf3F-.js";
import { C as it, E as at, G as ot, K as st, O as ct, T as lt, U as ut, W as dt, b as ft, x as pt } from "./SmallProps-Bqz-IwTc.js";
import { a as mt, c as ht, f as gt, l as _t, n as vt, o as yt, r as bt, s as xt, t as St, u as Ct } from "./math-Du_SWpiD.js";
import { r as wt } from "./ThawField-DplV_Ahd.js";
import { D as Tt, E as Et, O as Dt, _ as Ot, b as kt, c as At, d as jt, f as Mt, g as Nt, k as Pt, l as Ft, p as It, s as Lt, t as Rt, u as zt, v as Bt, y as Vt } from "./engine-jpYWy5In.js";
import { i as Ht, n as Ut } from "./own-rp3p7qEo.js";
import { t as Wt } from "./AudioSystem-CN9Y3HId.js";
import { r as Gt } from "./PixelCanvas-CkLSAnjr.js";
import { a as Kt, o as qt, r as Jt } from "./PropSprites-B1jrjD0u.js";
import { a as Yt, c as Xt, i as Zt, o as Qt, s as $t, t as en } from "./CharacterSprites-DoTS_x4b.js";
import { n as tn, t as nn } from "./Particles-a8BePib2.js";
import { a as rn, c as an, d as on, f as sn, i as cn, l as ln, o as un, p as dn, r as fn, s as pn, u as mn } from "./TileMap-CWy94bS4.js";
import { a as hn, i as gn, l as _n, n as vn, o as yn, r as bn } from "./Props-Deb0VZT1.js";
import { T as xn, a as Sn, d as Cn, h as wn, n as Tn, o as En, r as Dn, s as On, t as kn, u as An, w as jn, x as Mn } from "./ObjectCatalog-CLBSNnc2.js";
import { H as Nn, _t as Pn } from "./core-C1cYbmwD.js";
import { i as Fn, l as In, n as Ln, s as Rn, t as zn, u as Bn } from "./I18n-BeKB4FMa.js";
import { f as Vn } from "./minimap-CBFghrAn.js";
import { r as Hn } from "./LevelFormat-BJ0C9Ce4.js";
import { a as Un, b as Wn, c as Gn, d as Kn, f as qn, g as Jn, h as Yn, i as Xn, l as Zn, m as Qn, n as $n, o as er, p as tr, r as nr, s as rr, t as ir, u as ar, v as or, x as sr, y as cr } from "./LevelLook-A84D8y8_.js";
import { r as lr, t as ur } from "./LevelMap-037nvhSa.js";
import { r as dr, t as fr } from "./Travel-4-idrvN5.js";
import { a as pr, c as mr, i as hr, n as gr, o as _r, r as vr, s as yr, t as br } from "./config-DDHWC9jm.js";
import { a as xr, i as Sr, o as Cr, r as wr, s as Tr } from "./SnowCover-C3e-E6XZ.js";
import { n as Er, r as Dr, t as Or } from "./festival-oZLIUsWY.js";
import { _ as kr, a as Ar, c as jr, d as Mr, f as Nr, g as Pr, h as Fr, i as Ir, l as Lr, m as Rr, n as zr, o as Br, p as Vr, r as Hr, s as Ur, t as Wr, u as Gr } from "./WeatherLook-Cd6RFxi2.js";
import { a as Kr, i as qr, n as Jr, r as Yr } from "./ContentText-nXIHgNO8.js";
import { n as Xr } from "./dialogue-D_zYka2G.js";
import { n as Zr, t as Qr } from "./GroundFrost-DNaPW7wo.js";
import { n as $r, t as ei } from "./RockSpikes--iVgU-tc.js";
import { t as ti } from "./SpectralBlades-foZT2E1I.js";
import { t as ni } from "./SpectralBells-BTp33XOp.js";
//#region src/engine/sprite/SpriteManager.js
var ri = class {
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
}, ii = class {
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
			if (!i || !ai(i)) continue;
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
		this._alpha = new g(new Float32Array(this.capacity), 1), this._alpha.setUsage(S), n.setAttribute("aBlobAlpha", this._alpha);
		let r = new tt({
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
		let i = new le(n, r, this.capacity);
		i.name = "BlobBatch", i.instanceMatrix.setUsage(S), i.count = 0, i.renderOrder = e.renderOrder, i.castShadow = !1, i.receiveShadow = !1, i.frustumCulled = !1, i.matrixAutoUpdate = !1, this.mesh = i;
	}
};
function ai(e) {
	for (let t = e; t; t = t.parent) {
		if (!t.visible) return !1;
		if (t.isScene) return !0;
	}
	return !1;
}
//#endregion
//#region src/game/Scenery.js
var oi = new F(), si = [
	"position",
	"aCenter",
	"aSway",
	"aPhase"
];
function* ci(e, { name: t = "trees", castShadow: n = !0, maxTriangles: r = Infinity, maxExtent: i = Infinity, minTriangles: a = 0, tags: o = null } = {}) {
	let s = /* @__PURE__ */ new Map(), c = !!o?.size, l = [];
	for (let t of e) {
		let e = t.object, r = c ? o.get(t) ?? null : null;
		e.updateWorldMatrix(!0, !0);
		let i = ht(Math.round(e.position.x * 7), Math.round(e.position.z * 7), 3) * Math.PI * 2;
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
				for (let r = 0; r < p.count; r++) oi.fromBufferAttribute(e, r).applyMatrix4(f), p.setXYZ(r, oi.x, oi.y, oi.z), n.setXYZ(r, oi.x + (t.getX(r) - e.getX(r)) * i, oi.y + (t.getY(r) - e.getY(r)) * i, oi.z + (t.getZ(r) - e.getZ(r)) * i);
			}
			let m = d.getAttribute("aPhase");
			if (m) for (let e = 0; e < m.count; e++) m.setX(e, m.getX(e) + i);
			l.geos.push(d), l.pos.push([e.position.x, e.position.z]), l.tags.push(r);
		}), t.dispose?.(), yield;
	}
	let u = new j();
	u.name = t;
	let d = [];
	for (let e of s.values()) {
		let n = e.geos.map((e, t) => t), o = Number.isFinite(r) || Number.isFinite(i) ? un(n, {
			x: (t) => e.pos[t][0],
			z: (t) => e.pos[t][1],
			weight: (t) => ln(e.geos[t]),
			maxWeight: r,
			maxExtent: i,
			minWeight: a
		}) : [n];
		c && (o = o.map((t) => rn(t, (t) => e.tags[t])));
		for (let n = 0; n < o.length; n++) {
			let r = o[n], i = on(r.map((t) => e.geos[t]), !1);
			if (!i) continue;
			c && l.push(...an(i, r.map((t) => e.geos[t].attributes.position.count), r.map((t) => e.tags[t]), si)), i.computeBoundingSphere(), i.computeBoundingBox(), i.boundingSphere.radius += 1.8, i.boundingBox.expandByScalar(1.8);
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
var li = Object.freeze([
	"oak",
	"pine",
	"birch",
	"autumn",
	"blossom",
	"maple",
	"goldbirch",
	"snowpine",
	"bare"
]), ui = /* @__PURE__ */ new Set(["pine", "snowpine"]);
function di(e) {
	let t = e?.forest && typeof e.forest == "object" && Array.isArray(e.forest.areas) ? e.forest.areas : [], n = [];
	for (let e of t) {
		if (!e || typeof e != "object" || ![
			"minX",
			"maxX",
			"minZ",
			"maxZ"
		].every((t) => Number.isFinite(e[t]))) continue;
		let t = e.kinds && typeof e.kinds == "object" ? e.kinds : {}, r = li.map((e) => [e, Number.isFinite(t[e]) && t[e] > 0 ? t[e] : 0]).filter(([, e]) => e > 0), i = r.reduce((e, [, t]) => e + t, 0);
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
function* fi({ tileMap: e, heightAt: t, seed: n = 77, avoid: r = [], southGap: i = 0, kindAreas: a = [], climate: o = null, season: s = null }) {
	if (o === "arid") return yield* _i({
		tileMap: e,
		heightAt: t,
		seed: n,
		avoid: r,
		southGap: i
	});
	let c = s ? it()?.SEASON_LAND : null, l = c && Object.hasOwn(c.mix, s) ? c.mix[s] : null, u = e.width, d = e.depth, f = new bt(n), p = [], m = [], h = [], g = 1.35, _ = /* @__PURE__ */ new Map(), v = (e, t) => `${Math.floor(e / g)},${Math.floor(t / g)}`, y = (e, t, n) => {
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
		let i = t < 6, o = e > u * .72 && t > 8, s = xt(e * .09, t * .09, {
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
			let s = x(r, a, f.next()), c = (ui.has(s) ? 5.4 : s === "birch" || s === "goldbirch" ? 5.2 : 5) * f.range(.85, 1.25) * (i === 1 ? .8 : 1);
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
	let C = mi(e, pi);
	for (let e = 0; e < 5200; e++) {
		e % 400 == 399 && (yield);
		let r = f.range(-34, u + 34), a = f.range(-44, d + 20.4), o = Math.max(0, -r, r - u), s = Math.max(0, -a, a - d), c = Math.hypot(o, s);
		if (c < .6 || i > 0 && a > d && a < d + i || c < pi && C?.(r, a)) continue;
		let l = xt(r * .075 + 11, a * .075 - 4, {
			seed: n + 2,
			octaves: 3
		}), p = 1 - gt(4, 30, c), h = mt((l - .42) * 2.6 + p * (a < 0 ? .35 : .75), 0, 1) * (1 - gt(24, 34, c) * .85);
		if (f.next() > h) continue;
		let g = f.range(.95, 1.5);
		if (!y(r, a, g)) continue;
		b(r, a, g);
		let _ = x(r, a, f.next()), v = ui.has(_) ? 5.8 : 5.2;
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
var pi = 2.5;
function mi(e, t) {
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
var hi = {
	juniper: 3.4,
	deadwood: 4,
	crag: 3.4
};
function gi(e) {
	return e === "basalt" || e === "ash" || e === "scorched" ? "basalt" : e === "red_sand" || e === "redrock" ? "redrock" : "sandstone";
}
function* _i({ tileMap: e, heightAt: t, seed: n, avoid: r, southGap: i }) {
	let a = e.width, o = e.depth, s = new bt(n + 4111), c = [], l = [], u = 1.35, d = /* @__PURE__ */ new Map(), f = (e, t, n) => {
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
		hi[e] * a
	];
	for (let t = 0; t < o; t++) {
		for (let n = 0; n < a; n++) {
			let r = e.tileAt(n, t);
			if (!r || r.char !== "T" || t >= o - 3) continue;
			let i = t >= 9 ? Math.min(n, a - 1 - n) : -1, l = t < 3 ? 1 : 2;
			for (let e = 0; e < l; e++) {
				let e = n + s.range(.1, .9), a = t + s.range(.1, .9), o = s.range(.95, 1.4), l = s.next(), u = s.range(.7, 1.35) * (i === 1 ? .78 : 1);
				i === 2 || l > .72 || !f(e, a, o) || (p(e, a, o), c.push(h(m(t < 6, s.next()), gi(r.type.top), e, r.h, a, u)));
			}
		}
		yield;
	}
	let g = mi(e, pi);
	for (let e = 0; e < 5200; e++) {
		e % 400 == 399 && (yield);
		let r = s.range(-34, a + 34), c = s.range(-44, o + 20.4), u = Math.max(0, -r, r - a), d = Math.max(0, -c, c - o), _ = Math.hypot(u, d);
		if (_ < .6 || i > 0 && c > o && c < o + i || _ < pi && g?.(r, c)) continue;
		let v = xt(r * .08 + 31, c * .08 - 9, {
			seed: n + 3,
			octaves: 3
		}), y = 1 - gt(4, 30, _), b = mt((v - .48) * 2.2 + y * .35, 0, 1) * .42 * (1 - gt(22, 34, _) * .85);
		if (s.next() > b) continue;
		let x = s.range(1.1, 1.7), S = t(r, c), C = m(c < 0, s.next()), w = s.range(.85, 1.4);
		if (c < -5 && S > t(r, -1) + 3 && C !== "crag" || !f(r, c, x)) continue;
		p(r, c, x);
		let T = xt(r * .05, c * .05, {
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
function vi(e, [t, n, r, i, a]) {
	return t.startsWith("crag:") ? e.crag(n, r, i, {
		kind: "spire",
		stone: t.slice(5),
		height: a,
		width: mt(a * .42, 1, 2.2)
	}) : e.tree(n, r, i, {
		kind: t,
		height: a,
		fallenLeaves: !1
	});
}
function yi(e, { climate: t = null, season: n = null } = {}) {
	let r = t === "arid", i = n ? it()?.SEASON_LAND : null, a = e.width, o = e.depth, s = (t, n) => {
		let r = -Infinity;
		for (let i of [-.5, .5]) for (let s of [-.5, .5]) {
			let c = mt(Math.floor(t + i), 0, a - 1), l = mt(Math.floor(n + s), 0, o - 1), u = e.tileAt(c, l);
			if (!u) continue;
			let d = u.water ? Math.max(u.h, .5) : u.h;
			d > r && (r = d);
		}
		return Number.isFinite(r) ? r : 0;
	};
	return (t, c) => {
		let l = mt(t, 0, a), u = mt(c, 0, o), d = t - l, f = c - u, p = Math.hypot(d, f), m = s(l, u) - .04;
		if (p < 1e-6) return m;
		let h = (xt(t * .05, c * .05, {
			seed: 91,
			octaves: 3
		}) - .5) * 3.2, g = gt(0, 10, p), _ = m + h * g;
		if (r) return Math.max(_ + xi(t, c, a, o), m - .6 * g);
		let v = gt(2, -30, c);
		_ += v * (gt(0, 40, -c) * 7 + xt(t * .03, c * .04, {
			seed: 17,
			octaves: 4
		}) * 9 * gt(-6, -40, c));
		let y = gt(-55, -120, c);
		_ += y * (18 + xt(t * .018, 3.1, {
			seed: 23,
			octaves: 4
		}) * 34);
		let b = gt(18, 90, Math.max(-t, t - a, c - o));
		return _ += b * (4 + xt(t * .02, c * .02, {
			seed: 29,
			octaves: 3
		}) * 14), i && (_ += i.relief(n, e, t, c, l, u, p, v, y)), Math.max(_, m - .6 * g);
	};
}
var bi = (e, t, n, r = 4) => 1 - Math.abs(xt(e, t, {
	seed: n,
	octaves: r
}) * 2 - 1);
function xi(e, t, n, r) {
	let i = 0, a = gt(2, -30, t), o = (gt(0, 36, -t) * 9 + bi(e * .035, t * .045, 17) * 12 * gt(-6, -40, t)) / 3, s = Math.floor(o);
	i += a * (s + gt(.6, .95, o - s)) * 3;
	let c = gt(-46, -100, t);
	i += c * (24 + bi(e * .016, t * .022 + 4.1, 23, 5) * 62);
	let l = gt(16, 70, Math.max(-e, e - n, t - r)), u = xt(e * .024, t * .024, {
		seed: 29,
		octaves: 3
	}) * 4, d = Math.floor(u);
	return i += l * (3 + (d + gt(.72, .98, u - d)) * 6.5), i;
}
function* Si(e, t, n) {
	let r = e.index, i = e.getAttribute("position"), a = new ve(new Float32Array(i.count * 3), 3);
	e.setAttribute("normal", a);
	let o = new F(), s = new F(), c = new F(), l = new F(), u = new F(), d = new F(), f = new F(), p = new F(), m = 0;
	for (let e = 0, n = r.count; e < n; e += 3) {
		let n = r.getX(e), h = r.getX(e + 1), g = r.getX(e + 2);
		o.fromBufferAttribute(i, n), s.fromBufferAttribute(i, h), c.fromBufferAttribute(i, g), f.subVectors(c, s), p.subVectors(o, s), f.cross(p), l.fromBufferAttribute(a, n), u.fromBufferAttribute(a, h), d.fromBufferAttribute(a, g), l.add(f), u.add(f), d.add(f), a.setXYZ(n, l.x, l.y, l.z), a.setXYZ(h, u.x, u.y, u.z), a.setXYZ(g, d.x, d.y, d.z), ++m === t && (m = 0, yield);
	}
	yield;
	for (let e = 0, t = a.count; e < t; e++) oi.fromBufferAttribute(a, e).normalize(), a.setXYZ(e, oi.x, oi.y, oi.z), e % n === n - 1 && (yield);
	a.needsUpdate = !0;
}
function* Ci({ textures: e, tileMap: t, heightAt: n, extent: r = 170, rowsPerStep: i = 12, climate: a = null, season: o = null }) {
	let s = a === "arid", c = !s && o ? it()?.SEASON_LAND : null, l = c && Object.hasOwn(c.outer, o) ? c.outer[o] : null, u = t.width, d = t.depth, f = (e, t) => {
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
	let x = l ? l[0] : s ? "arid_dirt" : "grass_dark", S = e.meta(x).units, C = new P(), w = new P(1, 1, 1), T = l ? new P(...l[1]) : s ? new P(1.04, .96, .88) : new P(.78, .86, .72), E = l ? new P(...l[2]) : s ? new P(1.02, .74, .6) : new P(.62, .6, .66), D = new P(.92, .86, .84);
	for (let e = 0; e < g; e++) {
		for (let t = 0; t < h; t++) {
			let n = e * h + t, r = p[t], i = m[e], a = b[n];
			_[n * 3] = r, _[n * 3 + 1] = a, _[n * 3 + 2] = i, v[n * 2] = r / S[0], v[n * 2 + 1] = -i / S[1];
			let o = b[e * h + Math.max(0, t - 1)], c = b[e * h + Math.min(h - 1, t + 1)], f = b[Math.max(0, e - 1) * h + t], x = b[Math.min(g - 1, e + 1) * h + t], ee = (c - o) / Math.max(.001, p[Math.min(h - 1, t + 1)] - p[Math.max(0, t - 1)]), O = (x - f) / Math.max(.001, m[Math.min(g - 1, e + 1)] - m[Math.max(0, e - 1)]), te = Math.hypot(ee, O), k = Math.max(0, -r, r - u), ne = Math.max(0, -i, i - d), A = Math.hypot(k, ne);
			C.copy(w).lerp(T, gt(20, 80, A)).lerp(E, gt(.55, 1.2, te)), s && C.lerp(D, gt(26, 60, a));
			let re = Ct(l ? l[3] : s ? .8 : .62, 1, gt(0, 14, A)) * (.9 + .2 * xt(r * .11, i * .11, {
				seed: 4,
				octaves: 2
			}));
			y[n * 3] = C.r * re, y[n * 3 + 1] = C.g * re, y[n * 3 + 2] = C.b * re;
		}
		e % i === i - 1 && (yield);
	}
	let ee = (e, t) => e > 0 && e < t, O = 0;
	for (let e = 0; e < h - 1; e++) ee((p[e] + p[e + 1]) / 2, u) && O++;
	let te = 0;
	for (let e = 0; e < g - 1; e++) ee((m[e] + m[e + 1]) / 2, d) && te++;
	let k = (h - 1) * (g - 1) - O * te, ne = h * g - 1 >= 65535 ? new Uint32Array(k * 6) : new Uint16Array(k * 6), A = 0;
	for (let e = 0; e < g - 1; e++) {
		let t = ee((m[e] + m[e + 1]) / 2, d);
		for (let n = 0; n < h - 1; n++) {
			if (t && ee((p[n] + p[n + 1]) / 2, u)) continue;
			let r = e * h + n, i = r + 1, a = r + h, o = a + 1;
			ne[A++] = r, ne[A++] = a, ne[A++] = i, ne[A++] = i, ne[A++] = a, ne[A++] = o;
		}
		e % i === i - 1 && (yield);
	}
	let re = new Pe();
	re.setAttribute("position", new ve(_, 3)), re.setAttribute("uv", new ve(v, 2)), re.setAttribute("color", new ve(y, 3)), re.setIndex(new ve(ne, 1)), yield, yield* Si(re, i * (h - 1) * 2, i * h), re.computeBoundingSphere();
	let ie = e.material(x, {
		vertexColors: !0,
		normalScale: .35
	}), j = new N(re, ie);
	return j.name = "OuterGround", j.receiveShadow = !0, j.castShadow = !1, j.matrixAutoUpdate = !1, j.updateMatrix(), j;
}
//#endregion
//#region src/game/Climate.js
var wi = Object.freeze([
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
function Ti(e) {
	return er(e) === "arid" ? {
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
var Ei = /* @__PURE__ */ new WeakMap(), Di = /* @__PURE__ */ new WeakMap(), Oi = null, ki = null;
function Ai() {
	return ki ??= import("./SeasonLook-BdMrbzqK.js").then((e) => Oi = e, (e) => {
		throw ki = null, e;
	});
}
function ji() {
	return Oi ? null : ki;
}
function Mi(e, t, n = null) {
	let r = t ?? (n && Oi ? n : null);
	if ((Di.get(e) ?? null) === r) return !1;
	Ei.has(e) || Ei.set(e, e.keyframes);
	let i = Ei.get(e);
	return e.setKeyframes(r === "arid" ? wi.map((e) => ({ ...e })) : r ? Oi.seasonKeyframes(i, r) : i), Di.set(e, r), !0;
}
function Ni(e, t) {
	let n = tr(t);
	if (Mi(e.lighting, er(t), n), e.season = null, e.lighting.sky.uniforms.uAurora.value = 0, Vn(null), !n && !(Xn(t) > 0)) return;
	let r = () => {
		e.env === t && (Mi(e.lighting, er(t), n), e.season = Oi.createSeason(e));
	};
	Oi ? r() : Ai().then(r, (e) => console.warn("[Luminati] the season look did not load:", e));
}
//#endregion
//#region src/game/AudioDirector.js
var Pi = {
	blaze: [1, 1],
	bonfire: [.85, 1],
	brazier: [0, .6],
	embers: [0, .35]
}, Fi = .45;
function Ii(e, t = null) {
	let n = e.opts && typeof e.opts == "object" ? e.opts : {}, r = Number(e.x), i = Number(e.z);
	if (!Number.isFinite(r) || !Number.isFinite(i)) return null;
	if (e.type === "fire") {
		let [e, a] = Ht(Pi, typeof n.kind == "string" ? n.kind : "blaze") ?? Pi.blaze, o = mt(Number.isFinite(Number(n.size)) ? Number(n.size) : 1.5, .2, 6);
		return {
			x: r,
			z: i,
			roar: e * mt(o / 1.5, .3, 3),
			crackle: a,
			group: t
		};
	}
	if (e.type === "house") {
		let e = mt(Number(n.burning) || 0, 0, 1);
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
var Li = class e {
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
		let n = this.lighting.nightFactor, r = this.weather.factor("rain"), i = this.weather.factor("snow"), a = mt(r + i), o = e.nearest(this.fires, t), s = Infinity, c = this.waterXZ, l = t.x, u = t.z;
		for (let e = 0; e < c.length; e += 2) {
			let t = c[e] - l, n = c[e + 1] - u, r = t * t + n * n;
			r < s && (s = r);
		}
		s = Math.sqrt(s);
		let d = e.nearest(this.falls, t), f = this.levels;
		f.wind = mt(.28 + .12 * (t.y > 3) + a * .55), f.birds = mt((1 - n) * (1 - a * .85) * .75), this.combatIntensity > 0 && (f.birds *= 1 - .8 * mt(this.combatIntensity)), f.crickets = mt(gt(.35, .9, n) * (1 - a) * .8), f.fire = mt((1 - gt(2, 15, o)) ** 1.5 * .9), f.water = mt(Math.max((1 - gt(1, 11, s)) * .55, (1 - gt(3, 20, d)) * .95)), this._computeSiege(this.focus ?? t);
		let p = this.env?.();
		return (p?.frost || p?.season) && this.audio.evPack?.direct(this, t, f), f;
	}
	_computeSiege(e) {
		let t = this.levels, n = 0;
		for (let t of this.npcs) {
			let r = t.panicking ? 1 : t.cowering ? Fi : 0;
			if (!r) continue;
			let i = Math.hypot(t.position.x - e.x, t.position.z - e.z);
			n += r * (1 - gt(4, 34, i));
		}
		t.crowd = n > 0 ? mt(1 - Math.exp(-n / 3.4)) : 0;
		let r = 0, i = 0;
		for (let t of this.blazes) {
			if (t.group && !t.group.present) continue;
			let n = Math.hypot(t.x - e.x, t.z - e.z);
			t.roar > 0 && (r += t.roar * (1 - gt(3, 30, n)) ** 1.6), t.crackle > 0 && (i = Math.max(i, t.crackle * (1 - gt(1.5, 12, n)) ** 1.5));
		}
		t.blaze = r > 0 ? mt(1 - Math.exp(-r * .9)) * .95 : 0, i * .9 > t.fire && (t.fire = i * .9);
	}
	update(e, t) {
		this.enabled && (this._timer -= e, !(this._timer > 0) && (this._timer = .25, this.audio.setAmbience(this.compute(t), { fade: .6 })));
	}
};
//#endregion
//#region src/game/GroundDetail.js
function Ri(e) {
	let t = e.map(({ kind: e, seed: t }) => Jt(e, { seed: t })), n = Math.max(...t.map((e) => e.frameWidth)) + 2, r = Math.max(...t.map((e) => e.frameHeight)) + 1, i = document.createElement("canvas");
	i.width = n * t.length, i.height = r;
	let a = i.getContext("2d");
	return a.imageSmoothingEnabled = !1, t.forEach((e, t) => {
		let i = t * n + Math.floor((n - e.frameWidth) / 2), o = r - e.frameHeight;
		a.drawImage(e.canvas, 0, 0, e.frameWidth, e.frameHeight, i, o, e.frameWidth, e.frameHeight), e.dispose();
	}), {
		texture: Gt(i, {
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
var zi = /* @__PURE__ */ new Set([
	"g",
	"G",
	"f"
]), Bi = [
	1,
	2,
	3,
	1,
	2
], Vi = {
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
}, Hi = /* @__PURE__ */ new Set([
	"basalt",
	"ash",
	"scorched"
]), Ui = {
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
}, Wi = [
	"#ffffff",
	"#ffffff",
	"#f4e6c8",
	"#e4ecc0"
];
function* Gi({ tileMap: e, isFree: t, seed: n = 2024, houses: r = [], trees: i = [], clearings: a = [], flowerAreas: o = [], shrubAreas: s = [], cropAreas: c = [], maxInstances: l = Infinity }) {
	let u = new bt(n), d = new j();
	d.name = "GroundDetail";
	let f = [], p = [], m = [], h = [], g = (e, t) => {
		for (let n = 0; n < a.length; n++) {
			let r = a[n];
			if ((e - r.x) ** 2 + (t - r.z) ** 2 < r.r * r.r) return !0;
		}
		return !1;
	}, _ = (e, t, n) => {
		for (let r = 0; r < e.length; r++) {
			let i = e[r];
			if (t >= i.minX && t < i.maxX && n >= i.minZ && n < i.maxZ) return i;
		}
		return null;
	}, v = (t, n, r) => {
		for (let i = -1; i <= 1; i++) for (let a = -1; a <= 1; a++) {
			if (!a && !i) continue;
			let o = e.tileAt(t + a, n + i);
			if (o && r(o)) return !0;
		}
		return !1;
	}, y = {
		grass: [],
		shrubs: [],
		clutter: [],
		reeds: [],
		rng: new bt(n + 4099),
		tints: Wi,
		reed: .6
	}, b = it()?.SEASON_LAND ?? null, x = new bt(n + 7351), S = {}, C = (e, r, i, a, o) => {
		let s = o.rng, c = i.h, l = i.char === "T", u = xt(e * .21 + 7, r * .21, {
			seed: n + 11,
			octaves: 3
		}), d = (e, n) => l || t(e, n), f = a.tufts * (a.tufts >= 1 ? .8 + u * .5 : 1), p = Math.floor(f) + +(s.next() < f - Math.floor(f));
		for (let t = 0; t < p; t++) {
			let t = e + s.next(), n = r + s.next(), i = s.next() < a.tall * (u > .55 ? 1.6 : .7), f = s.range(.7, 1.05), p = o.tints[s.int(0, o.tints.length - 1)];
			if (!d(t, n)) continue;
			let m = !l && g(t, n);
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
			d(t, n) && (l || !g(t, n)) && o.shrubs.push({
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
				frame: o === y && Hi.has(i.type.top) ? 2 : 0
			});
		}
		if (s.next() < a.bones) {
			let t = e + s.range(.2, .8), n = r + s.range(.2, .8);
			d(t, n) && !g(t, n) && o.clutter.push({
				x: t,
				y: c,
				z: n,
				scale: s.range(.85, 1.05),
				frame: 1
			});
		}
		if (!l && v(e, r, (e) => e.water) && s.next() < o.reed) {
			let n = e + s.next(), i = r + s.next();
			t(n, i) && o.reeds.push({
				x: n,
				y: c,
				z: i,
				scale: s.range(.75, 1.1)
			});
		}
	}, w = (e, r, i) => {
		let a = i.char, c = i.h, l = i.type.top;
		if (l && Object.hasOwn(Vi, l)) {
			C(e, r, i, a === "T" ? Ui : Vi[l], y);
			return;
		}
		if (b && l && Object.hasOwn(b.growth, l)) {
			let [t, n] = b.growth[l], o = b.families[t];
			S[t] ??= {
				grass: [],
				shrubs: [],
				clutter: [],
				reeds: [],
				rng: x,
				tints: o.tints,
				reed: o.reed
			}, C(e, r, i, a === "T" ? o.thicket : n, S[t]);
			return;
		}
		let d = a === "T";
		if (zi.has(a) || d) {
			let i = xt(e * .23, r * .23, {
				seed: n + 1,
				octaves: 3
			}), l = d ? 2 : 3 + (i > .55 ? 2 : 0);
			for (let n = 0; n < l; n++) {
				let n = e + u.next(), a = r + u.next();
				if (!d && !t(n, a)) continue;
				let o = i > .58 && u.chance(.45), s = u.range(.7, 1.05), l = u.chance(.25) ? "#e2f2a8" : d ? "#b8c8a0" : "#ffffff", p = !d && g(n, a);
				f.push({
					x: n,
					y: c,
					z: a,
					scale: p ? s * .75 : s,
					frame: o && !p ? 1 : 0,
					tint: l
				});
			}
			let m = d ? 0 : a === "f" ? 3 : i > .6 ? 1 : +!!u.chance(.25), v = _(o, e, r)?.palette ?? Bi;
			for (let n = 0; n < m; n++) {
				let n = e + u.next(), i = r + u.next();
				if (!t(n, i)) continue;
				let a = u.range(.75, 1), o = v[u.int(0, v.length - 1)];
				g(n, i) || p.push({
					x: n,
					y: c,
					z: i,
					scale: a,
					frame: o
				});
			}
			let y = d ? .55 : _(s, e, r)?.chance ?? .05;
			if (u.chance(y)) {
				let n = e + u.range(.15, .85), i = r + u.range(.15, .85);
				if (d || t(n, i)) {
					let e = u.next(), t = e < .45 ? 0 : e < .85 ? 1 : 2, r = u.range(.8, 1.2);
					(d || !g(n, i)) && h.push({
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
				t(n, i) && h.push({
					x: n,
					y: c,
					z: i,
					scale: u.range(.8, 1.1),
					frame: 3
				});
			}
		} else if (a === "s") {
			let n = v(e, r, (e) => e.water), i = n ? 2 : 1;
			for (let a = 0; a < i; a++) {
				let i = e + u.next(), a = r + u.next();
				t(i, a) && (n && u.chance(.7) ? m.push({
					x: i,
					y: c,
					z: a,
					scale: u.range(.75, 1.1)
				}) : h.push({
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
		} else a === "m" && u.chance(.35) && h.push({
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
			r && w(n, t, r), (n & 31) == 31 && (yield);
		}
		yield;
	}
	let T = (t, n) => {
		let r = e.tileAt(Math.floor(t), Math.floor(n));
		return r && zi.has(r.char) && !Object.hasOwn(Vi, r.type.top) && !(b && Object.hasOwn(b.growth, r.type.top)) ? r : null;
	}, E = (e, n, r, i) => {
		let a = T(e, n);
		return !a || !t(e, n) || g(e, n) ? !1 : (h.push({
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
				e.door && Math.hypot(f - e.door.x, p - e.door.z) < 1.25 || E(f, p, u.next() < .62 ? 0 : 1, u.range(.75, 1.1));
			}
		}
	}
	for (let e of i) {
		let t = u.int(1, 3);
		for (let n = 0; n < t; n++) {
			let t = u.range(0, Math.PI * 2), n = (e.r ?? .3) + u.range(.35, .8);
			E(e.x + Math.cos(t) * n, e.z + Math.sin(t) * n, +!!u.chance(.6), u.range(.7, 1.05));
		}
	}
	let D = [], ee = function* (e, t, r, i = {}) {
		if (!r.length) return [];
		let a = r.length > l ? yield* pn(r, {
			x: (e) => e.x,
			z: (e) => e.z,
			maxWeight: l
		}) : [r], o = a.map((t, n) => [a.length > 1 ? `${e}#${n}` : e, t]), s = [];
		for (let [e, r] of o) {
			let a = new Bt({
				sprite: t,
				instances: globalThis.__emberGround ? globalThis.__emberGround.foliage(r) : r,
				name: e,
				seed: n + D.length,
				...i
			});
			d.add(a.object), D.push(a), s.push(a), yield;
		}
		return s;
	}, O = Ri([{ kind: "grass_tuft" }, { kind: "grass_tall" }]), te = Ri([
		{ kind: "flower_red" },
		{ kind: "flower_yellow" },
		{ kind: "flower_white" },
		{ kind: "flower_blue" }
	]), k = Ri([
		{ kind: "bush" },
		{ kind: "fern" },
		{ kind: "mushroom" },
		{ kind: "rock_small" }
	]), ne = Jt("reeds");
	yield, yield* ee("Foliage:grass", O, f, { wind: 1 }), yield* ee("Foliage:flowers", te, p, { wind: 1.1 }), yield* ee("Foliage:reeds", ne, m, { wind: 1.4 });
	let A = yield* ee("Foliage:shrubs", k, h, {
		wind: .5,
		rootDarken: .25
	});
	for (let e of A) e.castShadow = !0;
	let re = [], ie = (e) => {
		let t = Ri(e);
		return re.push(t.texture), t;
	};
	if (y.grass.length && (yield* ee("Foliage:arid-grass", ie([{ kind: "dry_tuft" }, { kind: "dry_grass_tall" }]), y.grass, { wind: 1 })), y.shrubs.length) {
		let e = yield* ee("Foliage:arid-shrubs", ie([
			{ kind: "scrub" },
			{ kind: "agave" },
			{ kind: "thornbush" },
			{ kind: "prickly_pear" }
		]), y.shrubs, {
			wind: .35,
			rootDarken: .25
		});
		for (let t of e) t.castShadow = !0;
	}
	y.clutter.length && (yield* ee("Foliage:arid-clutter", ie([
		{ kind: "pebbles" },
		{ kind: "bones" },
		{ kind: "cinders" }
	]), y.clutter, {
		wind: 0,
		rootDarken: .1
	})), y.reeds.length && (yield* ee("Foliage:arid-reeds", ne, y.reeds, { wind: 1.4 }));
	let ae = b ? yield* b.fields({
		fams: S,
		cropAreas: c,
		tileMap: e,
		isFree: t,
		inClearing: g,
		seed: n,
		add: ee,
		kinds: (e) => ie(e.map((e) => ({ kind: e }))),
		reedSprite: ne
	}) : {}, oe = y.grass.length + y.shrubs.length + y.clutter.length ? {
		aridGrass: y.grass.length,
		aridShrubs: y.shrubs.length,
		aridClutter: y.clutter.length
	} : {};
	return {
		fields: D,
		object: d,
		stats: {
			grass: f.length,
			flowers: p.length,
			reeds: m.length + y.reeds.length,
			shrubs: h.length,
			...oe,
			...ae
		},
		dispose() {
			for (let e of D) e.dispose();
			O.texture.dispose(), te.texture.dispose(), k.texture.dispose(), ne.dispose();
			for (let e of re) e.dispose();
		}
	};
}
var Ki = () => new Promise((e) => setTimeout(e, 0)), qi = /[^A-Za-z0-9_:.\-]+/;
function Ji(e) {
	let t = Gn(e)?.until ?? "";
	return new Set(t.split(qi).filter((e) => e && !/^(and|or|not)$/i.test(e)));
}
var Yi = /* @__PURE__ */ new Set(["tree", "waterfall"]), Xi = Object.freeze({
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
	foliageInstances: ir,
	shadowUp: 60,
	shadowDown: 45,
	particleCull: 34
}), Zi = class e {
	constructor({ engine: e, textures: t, lighting: n, particles: r, godRays: i, level: a, lightPool: o = null, story: s = null, defer: c = !1 }) {
		this.engine = e, this.scene = e.scene, this.textures = t, this.lighting = n, this.particles = r, this.godRays = i, this.level = a, this._sharedPool = o, this.vfxLights = null, this.story = s, this.storyGroups = /* @__PURE__ */ new Map(), this._emitterGroup = /* @__PURE__ */ new Map(), this._storyTags = /* @__PURE__ */ new Map(), this.storyRanges = new fn(), this.env = a.environment ?? {}, this._pending = c ? [] : null, this.attached = !c, this.shafts = [], this._ownInteractables = 0, this.root = new j(), this.root.name = "World", this._defer(() => this.scene.add(this.root)), this.tileMap = null, this.water = null, this.terrain = null, this.builder = null, this.factory = null, this.built = [], this.results = [], this.updaters = [], this.waterfalls = [], this.interactables = [], this.emitters = Object.create(null), this.areaEmitters = [], this.propEmitters = [], this.lights = [], this.emissiveEntries = [], this.glassMaterial = null, this.fires = [], this._fireList = [], this.blazes = [], this._bells = [], this._warmth = [], this.falls = [], this.fallAnchors = [], this.anchors = {}, this.stats = {}, this.waterBase = null;
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
			t && ("wait" in t ? await t.wait : (e(t.at, t.label), await Ki()));
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
			if (!t) return mn(e);
			let r = e.next();
			for (; !r.done;) o(n), yield, a = performance.now(), r = e.next();
			return r.value;
		}, l = this.level;
		this.batching = e.isBigLevel(l) ? { ...Xi } : null;
		let u = this.batching;
		if (!ct() && lt(l) && (yield { wait: at() }), !it() && ft(l) && (yield { wait: pt() }), yield* s(.08, Bn("game.load.textures")), this.textures.preload(), o("textures"), yield* s(.18, Bn("game.load.land")), this.terrain = yield* c(Wn(l, {
			textures: this.textures,
			chunkSize: u ? u.terrainChunk : 64,
			deferShore: !0
		}), "terrain"), this.tileMap = this.terrain.tileMap, u) {
			let e = this.tileMap.object.children.filter(bn);
			this.terrainCasters = yield* c(yn(e.map((e) => ({
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
		this.water = this.terrain.water, this.root.add(this.terrain.object), o("terrain"), yield* s(.3, Bn("game.load.village")), this.builder = new cr({
			textures: this.textures,
			seed: 42
		}), this.factory = this.builder.factory, this.glassMaterial = this.factory.glassMaterial();
		for (let e of this._buildProps(t ? 0 : 12)) o("props"), t ? (yield, a = performance.now()) : yield* s(.3 + .14 * e, Bn("game.load.village"));
		o("props"), yield* s(.45, Bn("game.load.forest"));
		let d = yield* c(this._levelTreeSteps(), "trees"), f = (u || t) && this.water ? this.water.refreshAsync() : null;
		yield* c(this._treeSteps(d, { paced: t }), "trees"), o("trees"), yield* s(.58, Bn("game.load.water")), this._buildWaterfalls(), f || this.water?.refresh(), o("water"), yield* s(.68, Bn("game.load.meadow")), yield* c(this._groundDetailSteps(), "foliage"), o("foliage"), yield* s(.8, Bn("game.load.lights")), this._defer(() => {
			this._wireLights(), this._buildAtmosphere();
		}), o("lights"), yield* s(.88, Bn("game.load.merge")), this.merged = yield* c(this._mergeSteps(), "merge"), o("merge"), f && (yield { wait: f }, t && (a = performance.now()), this.water._waterColliderSignature() !== this.water._colliderSig && this.water.refresh(), o("shoreWait")), this.tileMap.object.traverse((e) => {
			e.isMesh && Sr(e.material, "ground");
		}), this.outerGround && Sr(this.outerGround.material, "ground");
		for (let e of this.groundDetail.fields) Sr(e.material, "foliage");
		if (this.merged.object.traverse((e) => {
			e.isMesh && wr.test(e.material?.name ?? "") && Sr(e.material, "ground");
		}), this.env.frost && (Tr() || (yield { wait: xr() }), Tr().prepareWorld(this)), o("snow"), u) {
			let e = [
				...this.tileMap.object.children.filter((e) => e.isMesh),
				...this.merged.meshes,
				...this.treeGroups.flatMap((e) => e.meshes)
			], t = this.groundDetail.fields;
			yield* c(function* () {
				for (let t of e) cn(t), yield;
				for (let e of t) cn(e.object, { pad: .8 }), yield;
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
		return mn(this._mergeSteps());
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
		let n = (ct() ?? it())?.mergeFlames;
		return this.flames = n ? n(this.factory, this.results, { name: "village:flames" }) : null, this.flames && this.root.add(this.flames.object), t;
	}
	_storyGroupOf(e) {
		if (!this.story || !dr(e) || !fr.has(e.type) || !cr.isBuildable(e.type) && e.type !== "emitter") return null;
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
		let t = this._frostNames ??= Ji(this.env);
		if (!t.size) return "";
		let n = e;
		if (![n.when, n.unless].some((e) => e && String(e).split(qi).some((e) => t.has(e)))) return "";
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
		if (this.built.push(r), t && this.root.add(r.object), i && (r.propResult && this._storyTags.set(r.propResult, i), t && (i.objects.push(r.object), r.object.visible = i.present), ur.has(e.type) && (i.mapped = !0), i.colliders.push(...r.colliders), i.walkRects.push(...r.walkRects), i.lights.push(...r.lights)), n && r.propResult && this.results.push(r.propResult), !i || i.present) {
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
			...nr
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
		let t = xn(e.text);
		return {
			lines: t.map((e) => e.text),
			keys: t.map((t) => Mn(e, "text", t.i))
		};
	}
	*_buildProps(t = 12) {
		this._lightDescs = [], this.houseFootprints = [];
		let n = this.level.objects, r = performance.now();
		for (let i = 0; i < n.length; i++) {
			let a = n[i];
			if (performance.now() - r > t && (yield i / n.length, r = performance.now()), !cr.isBuildable(a.type) || Yi.has(a.type)) continue;
			let o = this._build(a);
			if (!o) continue;
			let s = this._storyGroupOf(a), c = Ii(a, s);
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
					let e = o.interact?.position?.clone() ?? null, t = vn(o.colliders);
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
					let e = o.anchor.y, t = o.interact?.position ?? new F(a.x, e, a.z), n = new F(a.x, e + 4.2, a.z - .3);
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
						prompt: new F(a.x, t + (e ? 1.2 : 2.4), a.z),
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
		return mn(this._levelTreeSteps());
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
		mn(this._treeSteps(e));
	}
	*_treeSteps(e, { paced: t = !1 } = {}) {
		let n = this.factory, r = this.tileMap, i = this.env, a = this.objectsOf("tree");
		this.stats.trees = {
			village: e.length,
			border: 0,
			outer: 0
		};
		let o = rr(i), s = qn(i), c = [], l = [], u = er(i), d = tr(i);
		if (o || s) {
			this.outerHeight = yi(r, {
				climate: u,
				season: d
			});
			let e = a.map((e) => ({
				x: e.x,
				z: e.z,
				r: this.inMap(e.x, e.z) ? 1.2 : 1.8
			})), t = Jn(i);
			({border: c, outer: l} = yield* fi({
				tileMap: r,
				heightAt: this.outerHeight,
				avoid: e,
				southGap: t,
				kindAreas: di(i),
				climate: u,
				season: d
			})), o || (c = []), s || (l = []);
		}
		let f = [];
		for (let e of c) f.push(vi(n, e)), yield;
		let p = [];
		for (let e of l) p.push(vi(n, e)), yield;
		let m = this._splitOpts("tree"), h = yield* ci([...e, ...f], {
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
			let n = yield* ci(t, {
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
			let e = yield* Ci({
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
			let n = this._storyGroupOf(e), r = e.width ?? 2, i = or(e);
			this._defer(() => {
				for (let e of t.emitters) this._groupEmitter(this._createEmitter({
					...e,
					count: i.count,
					alpha: i.alpha
				}), n);
			});
			let a = _n(e.facing), o = t.anchor.y, s = {
				id: e.id,
				x: e.x,
				z: e.z,
				width: r,
				dir: a,
				anchor: new F(e.x + a[0] * .6, o, e.z + a[1] * .6),
				splash: e.splash !== !1
			};
			n && (Object.defineProperty(s, "hidden", {
				get: () => !n.present,
				enumerable: !0
			}), n.falls.push(s)), this.falls.push(s), s.splash && (!n || n.present) && this.fallAnchors.push(s.anchor), s.splash && (this.anchors.waterfall ??= s.anchor);
		}
	}
	_buildGroundDetail() {
		mn(this._groundDetailSteps());
	}
	*_groundDetailSteps() {
		let e = yield* Gi({
			tileMap: this.tileMap,
			isFree: (e, t) => this._isFreeForFoliage(e, t),
			houses: this.houseFootprints,
			...ar(this.level),
			maxInstances: this.batching?.foliageInstances ?? Infinity
		});
		this.groundDetail = e, this.root.add(e.object), this.stats.foliage = e.stats;
	}
	acquireSpellLight({ minor: e = !1 } = {}) {
		return this.vfxLights?.acquire({ minor: e }) ?? null;
	}
	_wireLights() {
		let e = this.storyGroups.size ? /* @__PURE__ */ new Map() : null, t = jt(this._lightDescs, { cache: e });
		this._sharedPool && this._sharedPool.setDescriptors(t, { snap: !0 }), this.lightPool = this._sharedPool ?? new zt(this.lighting, t, { size: 12 });
		for (let t of this.storyGroups.values()) {
			t.poolLights = t.lights.map((t) => e.get(t)).filter(Boolean);
			for (let e of t.poolLights) this.lightPool.setHidden(e, !t.present, { instant: !0 });
		}
		this.lights = this.lightPool.handles, this.stats.lightDescriptors = this._lightDescs.length, this.stats.lightsPooled = this.lightPool.pooled;
	}
	_buildAtmosphere() {
		let e = this.particles, t = this.env, n = (e, t, n) => new F(e, t, n), r = this.level.width, i = this.level.depth;
		t.dust !== !1 && globalThis.__emberGround?.dust !== !1 && (this.emitters.dust = e.createEmitter({
			preset: "dust",
			bounds: {
				center: n(r / 2, 2.5, i / 2),
				size: n($n.x, $n.y, $n.z)
			},
			count: 120,
			...Ti(t)
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
		for (let e of Zn(t, this.level, this.tileMap)) this.shafts.push(...this.godRays.populate(e.bounds, e.count, e.seed));
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
}, Qi = 3.2, $i = 5.6, ea = .3, ta = .55, na = {
	down: new F(0, 0, 1),
	up: new F(0, 0, -1),
	left: new F(-1, 0, 0),
	right: new F(1, 0, 0)
};
function ra(e) {
	let t = new tt({
		map: e,
		color: new P("#d9ccff"),
		transparent: !0,
		opacity: ta,
		depthWrite: !0,
		depthFunc: 6,
		fog: !1
	});
	return t.onBeforeCompile = (e) => {
		e.vertexShader = e.vertexShader.replace("#include <project_vertex>", "#include <project_vertex>\n	mvPosition.xyz *= max( 0.0, 1.0 - 1.3 / length( mvPosition.xyz ) );\n	gl_Position = projectionMatrix * mvPosition;"), e.fragmentShader = e.fragmentShader.replace("#include <map_fragment>", "#include <map_fragment>\n	if ( sampledDiffuseColor.a < 0.5 ) discard;\n	float silL = sqrt( dot( sampledDiffuseColor.rgb, vec3( 0.299, 0.587, 0.114 ) ) );\n	diffuseColor = vec4( diffuse * ( 0.42 + 0.8 * silL ), opacity );");
	}, t.customProgramCacheKey = () => "emberfall-player-silhouette-v2", t;
}
function ia(e, t, n) {
	let r = new N(e, t);
	return r.name = n, r.renderOrder = 60, r.castShadow = !1, r.receiveShadow = !1, r;
}
function aa(e, t, n = "traveler") {
	let r = typeof e?.preset == "string" && Object.hasOwn(en, e.preset) ? e.preset : "traveler", i = e?.spec && typeof e.spec == "object" ? e.spec : {};
	return {
		...en[r],
		preset: r,
		...i,
		...t ? { weapon: n === "bellwarden" ? "hammer" : "sword" } : {}
	};
}
function oa({ level: e, look: t, combat: n, kit: r, records: i }) {
	return Qt(e) || Xt(aa(t, n, r)) || (i ?? []).some((e) => Xt(e?.spec)) ? $t() : null;
}
var sa = class {
	constructor({ tileMap: e, rig: t, particles: n, audio: r, spawn: i, combat: a = !1, look: o = null, festival: s = !1, kit: c = "traveler" }) {
		this.tileMap = e, this.rig = t, this.particles = n, this.audio = r, this.sheet = a ? Zt(aa(o, a, c), { combat: !0 }) : s ? Or("the player posed by the story").createFestivalSheet(aa(o, !1)) : Zt(aa(o, !1));
		let l = typeof i.facing == "string" && Object.hasOwn(na, i.facing) ? i.facing : "down";
		this.sprite = new Vt(this.sheet, a ? {
			...gr,
			direction: l,
			combatFx: !0
		} : {
			...gr,
			direction: l
		}), this.sprite.name = "Player", this.position = this.sprite.position, this.position.set(i.x, e.getHeight(i.x, i.z), i.z), this.facing = na[l].clone(), this.speed = 0, this.running = !1, this.frozen = !1, this.radius = ea, this.action = null, this.faceOverride = null, this.moveOverride = null, this.scripted = null, this.speedMul = 1, this._move = {
			x: 0,
			z: 0
		}, this._dir = new F(), this._stepToggle = !1, this._dustTimer = 0, this._basisDir = new F(), this.sprite.onFrameChange = (e, t) => {
			if (!t) return;
			let n = t.startsWith("run");
			if (!n && !t.startsWith("walk") || e !== 0 && e !== 2) return;
			this._stepToggle = !this._stepToggle;
			let r = this._groundKind(), i = r === "wood" ? 1.25 : r === "stone" ? 1.1 : r === "sand" ? .85 : 1;
			this.audio?.playSfx("step", {
				volume: n ? .55 : .4,
				pitch: i * (this._stepToggle ? 1 : .94)
			}), n && this.particles.burst("footstep", this.position, 4);
		}, this.sprite.play("idle"), this.silhouetteMaterial = ra(this.sprite.texture), this._silhouetteBase = this.silhouetteMaterial.color.clone(), this._silhouetteOn = !0, this._silhouetteFade = 1, this.silhouette = ia(this.sprite.mesh.geometry, this.silhouetteMaterial, "Player.silhouette"), this.sprite.mesh.add(this.silhouette), this.talkSilhouetteMaterial = ra(this.sprite.texture), this.talkSilhouette = ia(this.sprite.mesh.geometry, this.talkSilhouetteMaterial, "Player.talkSilhouette"), this.talkSprite = null;
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
		e.opacity = ta * t;
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
		let t = typeof e.facing == "string" && Object.hasOwn(na, e.facing) ? e.facing : "down";
		this.teleport(e.x, e.z), this.facing.copy(na[t]), this.sprite.setDirection(t), this.running = !1, this.frozen = !1, this.scripted = null, this.moveOverride = null, this.faceOverride = null, this.speedMul = 1, this.setTalkSilhouette(null), this.sprite.speed = 1, this.sprite.play("idle");
	}
	moveBy(e, t) {
		let n = Math.hypot(e, t);
		if (n < 1e-9) return 1;
		let r = this.position, i = this.tileMap.move(r, e, t, ea, .55, this._move), a = Math.hypot(i.x - r.x, i.z - r.z);
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
			let c = (o ? $i : Qi) * l * this.speedMul, d = n.move(r, t.x * c * e, t.z * c * e, ea, .55, this._move), f = Math.hypot(d.x - r.x, d.z - r.z);
			r.x = d.x, r.z = d.z, this.speed = e > 0 ? f / e : 0, u ? (this.facing.set(u.x, 0, u.z), this.sprite.faceVector(u.x, u.z)) : (this.facing.copy(t), this.sprite.faceVector(t.x, t.z));
			let p = o ? "run" : "walk";
			this.sprite.play(p), this.sprite.speed = mt(.55 + .45 * (this.speed / Math.max(.01, c)), .55, 1) * Math.max(.6, l);
		} else this.speed = 0, this.running = !1, this.sprite.play("idle"), this.sprite.speed = vr[0] + .04, u && this.facing.set(u.x, 0, u.z), this.sprite.faceVector(this.facing.x, this.facing.z);
		this._followGround(e);
	}
	_followGround(e) {
		let t = this.position, n = this.tileMap.getHeight(t.x, t.z), r = n > t.y ? yt(22, e) : yt(16, e);
		t.y += (n - t.y) * r, Math.abs(n - t.y) < .001 && (t.y = n);
	}
	dispose() {
		this.silhouetteMaterial.dispose(), this.talkSilhouette.removeFromParent(), this.talkSprite = null, this.talkSilhouetteMaterial.dispose(), this.sprite.dispose(), this.sheet.dispose?.();
	}
}, ca = .3, la = Object.freeze({
	down: [0, 1],
	up: [0, -1],
	left: [-1, 0],
	right: [1, 0]
}), ua = .05, da = Math.PI * 2, fa = Object.freeze({
	panic: [4.5, 9],
	cower: [7, 13],
	relief: [6, 12],
	cheer: [8, 16]
}), pa = 15, ma = 45, ha = 2.5, ga = 6, _a = /* @__PURE__ */ new WeakMap();
function va(e) {
	let t = _a.get(e);
	return t || _a.set(e, t = {
		last: -Infinity,
		recent: [],
		routedFrame: -1,
		routed: !1
	}), t;
}
var ya = null, ba = null, xa = 5.5, Sa = 1.4, Ca = class {
	constructor({ def: e, tileMap: t, sheetCache: n }) {
		this.def = e, this.id = e.id, this.name = e.name, this.tileMap = t, this.festival = Sn.includes(e.behaviour) || e.festival === !0;
		let r = JSON.stringify({
			preset: e.preset,
			...e.spec || {}
		}) + (this.festival ? "|festival" : ""), i = n?.get(r);
		if (!i) {
			let t = {
				...en[e.preset],
				preset: e.preset,
				...e.spec || {}
			};
			i = this.festival ? Or(`the villager "${e.id}"`).createFestivalSheet(t) : Zt(t), n?.set(r, i);
		}
		this.sheet = i, this.sprite = new Vt(i, {
			...gr,
			direction: e.facing ?? "down"
		}), this.sprite.name = `NPC:${e.id}`, this.home = new F(e.home[0], 0, e.home[1]), this.position = this.sprite.position, this.position.set(e.home[0], t.getHeight(e.home[0], e.home[1]), e.home[1]), this.wander = e.wander ?? 1.2, this.speed = e.speed ?? 1, this.behaviour = Dn.includes(e.behaviour) ? e.behaviour : "wander";
		let a = Math.max(.5, this.wander);
		this.chaseBounds = e.bounds ?? {
			minX: e.home[0] - a,
			maxX: e.home[0] + a,
			minZ: e.home[1] - a,
			maxZ: e.home[1] + a
		}, this.homeFacing = e.facing ?? "down", this.facing = new F(0, 0, 1);
		let o = Object.hasOwn(la, this.sprite.direction) ? la[this.sprite.direction] : la.down;
		this.facing.set(o[0], 0, o[1]), this._faceYaw = null, this._faceRow = this.sprite.direction, this.talkRadius = e.talkRadius ?? 1.6, this.talkPoint = e.talkPoint ? new F(e.talkPoint[0], 0, e.talkPoint[1]) : null, this.rng = new bt(_t(e.id)), this.collider = t.addCollider({
			type: "circle",
			x: this.position.x,
			z: this.position.z,
			r: .34,
			dynamic: !0
		}), this.state = "idle", this.timer = this.rng.range(.5, 3), this.target = new F(), this.talking = !1, this.present = !0, this.directed = !1, this.storyObj = null, this.storyTalk = null, this._out = {
			x: 0,
			z: 0
		}, this._stuck = 0, this._lookTimer = 0, this.idleSpeed = this.rng.range(vr[0], vr[1]), this.festival && (this.barkRng = new bt(_t(`bark:${e.id}`)), this._barkT = this.barkRng.range(1.5, 9), this._calm = !1, this._reliefT = 0, this._spokeT = 0, this._threatT = this.rng.range(0, .25), this._danceSpeed = this.rng.range(.85, 1.15), this._runSpeed = Math.min(4.2, Math.max(2.6, this.speed * this.rng.range(2.9, 3.5)))), this._idle();
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
		n > 1e-6 && (this.facing.set(e / n, 0, t / n), this._applyFacing(wt.uCameraYaw.value));
	}
	faceDir(e) {
		let t = Object.hasOwn(la, e) ? la[e] : null;
		t && this.faceWorld(t[0], t[1]);
	}
	_applyFacing(e) {
		this.sprite.faceVector(this.facing.x, this.facing.z, e), this._faceYaw = e, this._faceRow = this.sprite.direction;
	}
	_followCamera() {
		let e = this.sprite, t = wt.uCameraYaw.value;
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
		n -= Math.round(n / da) * da, (n > ua || n < -.05) && this._applyFacing(t);
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
		let f = this.tileMap.move(a, o / c * l, s / c * l, ca, .55, this._out);
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
		r.y += (i - r.y) * yt(18, e), this.collider.x = r.x, this.collider.z = r.z;
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
			o < xa && o < i && (i = o, r = t.position);
		}
		let o = t._mk;
		for (let e = 0; e < o.length; e++) {
			let t = o[e];
			if (t.h < 0) continue;
			let a = t.spec;
			if (a.style !== "enemy" || a.shape !== "circle" && a.shape !== "ring") continue;
			let s = Math.hypot(a.x - n.x, a.z - n.z);
			s < a.r + Sa && s - a.r < i && (i = s - a.r, r = a);
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
		let t = wa(e.game, this.tileMap);
		return t === this._calm ? t : (this._calm = t, t ? (this._reliefT = ma, this._spokeT > 0 && e.game.ui.emotes?.clear(this.sprite), this.state = "relief", this.timer = this.rng.range(1.5, 3.5), this.faceWorld(e.player.x - this.position.x, e.player.z - this.position.z)) : (this.state = "idle", this.timer = 0), t);
	}
	_updateCalm(e, t) {
		this.state === "relief" ? (this.sprite.play("cheer", { speed: this._danceSpeed }), this.timer -= e, this.timer <= 0 && (this.state = "idle", this.timer = this.rng.range(.4, 1.5), this._idle())) : this._updateWander(e, t.player, Math.min(this.wander, ha)), this._reliefT > 0 && (this._reliefT -= e, this._bark(e, t, "relief"));
	}
	_bark(e, t, n) {
		if (this._spokeT > 0 && (this._spokeT -= e), this._barkT -= e, this._barkT > 0) return;
		let r = this.barkRng, [i, a] = fa[n];
		this._barkT = r.range(i, a);
		let o = t.game;
		if (!o || o.mode !== "play" || o.ui.dialog.isOpen || o.story?.cardUp || o.ui.endCard?.active) return;
		let s = va(this.tileMap), c = o.engine.time.elapsed;
		if (c - s.last < 1.7999990000000001) {
			this._barkT = r.range(.5, 2);
			return;
		}
		if (Math.hypot(t.player.x - this.position.x, t.player.z - this.position.z) > pa) return;
		s.last = c, this._spokeT = ga;
		let l = Or("a bark").SIEGE_BARKS[n], u = s.recent, d = r.pick(l);
		for (let e = 0; e < 4 && u.includes(d); e++) d = r.pick(l);
		u.push(d), u.length > Math.min(4, l.length - 1) && u.shift();
		let f = o.ui.emotes;
		f && Ta(o) && f.bark(this.sprite, Bn(`siege.${d}`), void 0, { offsetY: this.def.preset === "child" ? 1.9 : 2.35 });
	}
	hush(e) {
		this._spokeT > 0 && e?.clear(this.sprite);
	}
	dispose() {
		this.tileMap.removeCollider(this.collider), this.sprite.dispose();
	}
};
function wa(e, t) {
	let n = e?.combat;
	if (!n) return !1;
	let r = va(t), i = e.engine.time.frame;
	if (r.routedFrame === i) return r.routed;
	r.routedFrame = i;
	let a = n.enemies, o = a.length > 0;
	for (let e = 0; o && e < a.length; e++) a[e].alive && a[e].sprite.visible && (o = !1);
	return r.routed = o, o;
}
function Ta(e) {
	let t = Ln();
	if (ya === t) return !0;
	let { registerSiegeStrings: n, SIEGE_STRINGS: r } = Or("a bark");
	if (n(), !ba) {
		let n = e.ui?.fonts, i = r[t] ?? r.en;
		ba = (n ? n.ensure(Object.values(i)) : Promise.resolve()).then(() => {
			ya = t, ba = null;
		});
	}
	return !1;
}
//#endregion
//#region src/game/Critters.js
var Ea = class {
	constructor({ sheet: e, tileMap: t, x: n, z: r, seed: i, bounds: a = null, radius: o = .15, speed: s = .9, opts: c = {} }) {
		this.tileMap = t, this.sprite = new Vt(e, {
			...gr,
			blobSize: [.55, .26],
			...c
		}), this.position = this.sprite.position, this.position.set(n, t.getHeight(n, r), r), this.home = new F(n, 0, r), this.start = {
			x: n,
			z: r
		}, this.absent = !1, this.bounds = a, this.radius = o, this.speed = s, this.rng = new bt(i), this.state = "idle", this.timer = this.rng.range(.2, 2.5), this.target = new F(n, 0, r), this._out = {
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
		let { x: e, z: t } = Aa(this.tileMap, this.start.x, this.start.z);
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
		t.y += (n - t.y) * yt(18, e);
	}
}, Da = class extends Ea {
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
}, Oa = class extends Ea {
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
}, ka = {
	chicken: {
		cls: Da,
		speed: .8,
		radius: .15,
		opts: { blobSize: [.5, .24] }
	},
	cat: {
		cls: Oa,
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
		cls: Oa,
		speed: 1.3,
		radius: .22,
		opts: { blobSize: [.8, .34] }
	},
	bird: {
		cls: class extends Ea {
			constructor(e) {
				super(e), this.vel = new F(), this.hidden = 0, this.roam = e.roam ?? 1.6;
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
function Aa(e, t, n) {
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
var ja = class {
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
		return t || (t = Yt(e, ka[e].sheet ?? {}), this.sheets.set(e, t)), t;
	}
	_spawnGroup(e) {
		let t = Ut(ka, e.kind) ? e.kind : "chicken", n = ka[t], r = this.tileMap, i = Number(e.x) || 0, a = Number(e.z) || 0, o = Math.max(.3, Number(e.radius) || 2.5), s = On(e) ?? {
			minX: i - o,
			maxX: i + o,
			minZ: a - o,
			maxZ: a + o
		}, c = Number.isFinite(e.seedBase) ? e.seedBase : _t(String(e.id ?? t)) % 1e4, l = this._sheet(t), u = En(e, (e, t) => r.isWalkable(e, t)), d = [];
		dr(e) && this.storyGroups.push({
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
			let r = Aa(t.tileMap, n.x, n.z);
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
}, Ma = [
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
], Na = class {
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
		}, this.zoomFog = 1, this.gust = 0, this._gust = 0, this.indoors = !1, this.snowHold = null, this.frostCover = 0, this.frostAmount = 0, this.snowFloor = 0, this.thaw = null, this.frozenMist = /* @__PURE__ */ new Set(), this.setWorld(i), Cr.value = 0, this.weather = "clear", this._w = { ...Ir.clear }, this._transition = null, this.rain = t.createEmitter(Fr("rain", { intensity: 0 })), this.snow = t.createEmitter(Fr("snow", { intensity: 0 }));
	}
	setWorld(e) {
		this.world = e, this.gust = this._gust = 0, this.frozenMist?.clear(), this._env = e?.level?.environment ?? {}, this.indoors = Kn(this._env);
		let t = Number(e?.level?.environment?.fogScale);
		this.levelFog = Number.isFinite(t) && t > 0 ? t : 1;
		let n = e.water;
		this._waterBase = n ? e.waterBase ??= {
			brightness: n.uniforms.uBrightness.value,
			glint: n.uniforms.uGlint.value
		} : null;
	}
	get shown() {
		return Qn(this._env, this.weather);
	}
	get time() {
		return this.lighting.timeOfDay;
	}
	get snowCover() {
		return Math.max(Cr.value, this.frostCover * this.frostAmount);
	}
	set snowCover(e) {
		e = mt(Number(e) || 0), this.frostCover > 0 ? this.frostAmount = mt(e / this.frostCover) : Cr.value = e;
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
		let e = this._transition ? (this._transition.from + this._transition.delta) % 24 : this.lighting.timeOfDay, t = Ma.find((t) => t.h > e + .05);
		return t ||= Ma[0], this.setTime(t.h, { duration: 2 }), t;
	}
	setWeather(e, { instant: t = !1 } = {}) {
		if (!Object.hasOwn(Ir, e)) return this.weather;
		if (this.weather = e, t) {
			let e = this.shown;
			Object.assign(this._w, Ir[e]), Cr.value = this._settled(e);
		}
		return e;
	}
	_settled(e) {
		return Math.max(this.frostCover > 0 && e === "frost" ? 0 : kr(e), this.snowFloor);
	}
	settleSnow() {
		Cr.value = this._settled(this.shown);
	}
	cycleWeather() {
		let e = zr.indexOf(this.weather);
		return this.setWeather(zr[(e + 1) % zr.length]);
	}
	factor(e) {
		return this._w[e];
	}
	update(e) {
		let t = this._transition;
		if (t) {
			t.t += e;
			let n = gt(0, 1, mt(t.t / t.duration));
			this.lighting.setTime(t.from + t.delta * n), t.t >= t.duration && (this._transition = null);
		}
		let n = this.shown, r = Ir[n], i = yt(1.1, e), a = this._w;
		for (let e = 0; e < Hr.length; e++) {
			let t = Hr[e];
			a[t] += (r[t] - a[t]) * i;
		}
		let o = this.tuning, s = this.lighting.settings;
		Lr(s, a, o), s.fogMul = o.fogMul * a.fog * this.zoomFog * this.levelFog, this._gust += (this.gust - this._gust) * yt(this.gust > this._gust ? 7 : 2.2, e), this._gust < .001 && !this.gust && (this._gust = 0), Gr(a, o.windStrength, this._gust);
		let c = this.postfx.settings.grade;
		jr(c, a, o.gradeTemperature, o.gradeSaturation), c.saturation -= Wr * this.lighting.nightFactor;
		let l = a.overcast;
		Ur(this.lighting, l), this.godRays.intensity = o.godRays * a.rays * Vr(this.lighting.timeOfDay);
		let u = this.lighting.nightFactor, d = this.world, f = d.emitters;
		f.dust && (f.dust.intensity = o.dust * a.dust);
		let p = d.areaEmitters ?? [];
		for (let e = 0; e < p.length; e++) {
			let t = Mr(p[e].preset, a, o, u);
			t !== null && (p[e].emitter.intensity = t);
		}
		let m = d.propEmitters;
		for (let e = 0; e < m.length; e++) {
			let t = m[e], n = t.preset ?? t.config?.preset;
			n === "smoke" ? t.intensity = o.smoke : n === "mist" && (t.intensity = this.frozenMist.has(t) ? 0 : o.mist);
		}
		Br(d.lights, d.lightPool ?? null, l), Ar(d.emissiveEntries, l), d.glassMaterial && d.glassMaterial.color.setScalar(Nr(u, l));
		let h = this._waterBase;
		if (h) {
			let e = d.water.uniforms, t = Rr(u);
			e.uBrightness.value = h.brightness * t.brightness, e.uGlint.value = h.glint * t.glint;
		}
		this.rain.intensity = Pr(a.rain), this.snow.intensity = Pr(a.snow);
		let g = this._settled(n), _ = g > Cr.value ? 1 / 15 : 1 / 8;
		Cr.value += mt(g - Cr.value, -_ * e, _ * e), this.snowHold === null ? this.frostAmount > 0 && (this.frostAmount = Math.max(0, this.frostAmount - e / 8)) : this.frostAmount = Math.min(1, this.frostAmount + e / 3), this.thaw?.update(e);
	}
	dispose() {
		this.rain.dispose(), this.snow.dispose();
	}
}, Pa = class {
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
function Fa(e) {
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
	c.add(l, "hour", 0, 24, .01).name("time of day").listen(), c.add(n, "timeSpeed", 0, 2, .01).name("speed (h / s)"), c.add(n, "paused").listen(), c.add(l, "weather", zr).listen(), c.add({ next: () => e.cycleTime() }, "next").name("next preset (T)");
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
		i.pitchTarget = t * St;
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
			return i.pitchTarget * vt;
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
			return i.yawTarget * vt;
		},
		set yaw(e) {
			i.yawTarget = e * St;
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
var Ia = "/* emberfall:fog-start */";
function La(e) {
	if (e !== void 0 && Ra(e), ut.fog_vertex.includes(Ia)) return;
	let t = wt.uFogStart;
	ut.fog_pars_vertex = `${ut.fog_pars_vertex}
#ifdef USE_FOG
	uniform vec2 uFogStart;
#endif
`, ut.fog_vertex = `${Ia}
#ifdef USE_FOG
	vFogDepth = max( 0.0, - mvPosition.z - uFogStart.x );
#endif
`;
	for (let e of Object.values(dt)) "fogDensity" in e.uniforms && (e.uniforms.uFogStart = t);
	Object.assign(ot.fog, { uFogStart: t }), He.clone({ uniform: t }).uniform.value !== t.value && console.warn("[Luminati] three.js copies typed-array uniforms: built-in materials keep the fog start they compiled with");
}
function Ra(e) {
	wt.uFogStart.value[0] = Number.isFinite(e) ? e : 0;
}
//#endregion
//#region src/game/CinematicLook.js
var za = Object.freeze({
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
function Ba(e) {
	for (let t of [
		"dof",
		"bloom",
		"grade",
		"cinematic"
	]) {
		let n = e[t];
		for (let [e, r] of Object.entries(za[t])) n[e] = Array.isArray(r) ? [...r] : r;
	}
}
function Va(e, t) {
	let n = Ha(t);
	e.cinematic.streaks = n.streaks, e.cinematic.streakThreshold = n.streakThreshold, Ua.set(e, n);
}
function Ha(e) {
	let t = e?.cinematic, n = t?.streaks, r = t?.streakThreshold;
	return {
		streaks: typeof n == "number" && Number.isFinite(n) ? n : za.cinematic.streaks,
		streakThreshold: typeof r == "number" && Number.isFinite(r) ? r : za.cinematic.streakThreshold
	};
}
var Ua = /* @__PURE__ */ new WeakMap();
function Wa(e, t, n = null) {
	if (!Array.isArray(t?.states) || !t.states.length) return !1;
	let r = Ha(t), i = Ua.get(e);
	return i && i.streaks === r.streaks && i.streakThreshold === r.streakThreshold ? !1 : (Va(e, t), n && (n.base.streaks = r.streaks), !0);
}
//#endregion
//#region src/game/levels.js
var Ga = Object.freeze([
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
]), Ka = [
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
], qa = {
	keys: "B",
	label: "Journal",
	id: "journal"
}, Ja = {
	keys: "G",
	label: "Party",
	id: "party"
}, Ya = (e) => e.map((e) => ({
	...e,
	label: Bn(`game.controls.${e.id}`)
}));
function Xa(e) {
	if (e?.def?.unnamed) return Bn("game.default.villager");
	let t = e?.name;
	return typeof t == "string" ? Kr(t) : String(t ?? "");
}
function Za(e) {
	let t = typeof e?.label == "string" ? e.label : String(e?.label ?? ""), n = wn(t);
	if (n) return Bn(`game.prompt.${n}`);
	let r = e?.object;
	return r && (r.type === "exit" || r.type === "event") ? Yr(jn(r, "label"), t, "label") : t;
}
function Qa(e) {
	let t = e?.def?.title;
	if (typeof t != "string" || !t.trim()) return "";
	let n = e.def.titleKey;
	return Yr(typeof n == "string" ? n : "", t, "title");
}
var $a = Object.freeze({
	en: "EN",
	ja: "日本語",
	zh: "中文"
}), eo = 1.6, to = .5, no = {
	x: 0,
	z: 0
};
function ro(e) {
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
function io(e, t, n, r = no) {
	let i = e.a.x, a = e.a.z, o = e.b.x - i, s = e.b.z - a, c = o * o + s * s, l = c > 1e-12 ? Math.min(1, Math.max(0, ((t - i) * o + (n - a) * s) / c)) : 0;
	return r.x = i + o * l, r.z = a + s * l, r;
}
var ao = 42, oo = 4, so = .8, co = .4, lo = 5, uo = 2, fo = (e) => new Promise((t) => setTimeout(t, e * 1e3)), po = (e, t) => Number.isFinite(Number(e)) && e !== null && e !== "" ? Number(e) : t, mo = (e) => !!e && [
	"minX",
	"maxX",
	"minZ",
	"maxZ"
].every((t) => Number.isFinite(e[t])), ho = (e) => Array.isArray(e) && e.length >= 2 && Number.isFinite(e[0]) && Number.isFinite(e[1]), go = {
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
}, _o = /^\s*(?:\*\s+)?pose\s+(?:"([^"]+)"|(\S+))/;
function vo(e, t) {
	let n = /* @__PURE__ */ new Set(), r = (e) => {
		for (let t of Array.isArray(e) ? e : []) {
			let e = typeof t == "string" ? _o.exec(t) : null;
			e && n.add((e[1] ?? e[2]).toLowerCase());
		}
	};
	for (let t of e.objects) t?.type === "event" ? r(t.run) : t?.type === "npc" && r(t.talk);
	for (let e of Object.values(t?.scripts ?? {})) r(e?.lines);
	return n;
}
function yo(e, t) {
	let n = e.x, r = e.z, i;
	ho(e.talkOffset) ? i = [n + e.talkOffset[0], r + e.talkOffset[1]] : ho(e.talkPoint) && (i = [e.talkPoint[0], e.talkPoint[1]]);
	let a;
	mo(e.area) ? a = {
		minX: n + e.area.minX,
		maxX: n + e.area.maxX,
		minZ: r + e.area.minZ,
		maxZ: r + e.area.maxZ
	} : mo(e.bounds) && (a = { ...e.bounds });
	let o = typeof e.name == "string" ? e.name : typeof e.name == "number" || typeof e.name == "boolean" ? String(e.name) : "";
	return {
		id: e.id,
		name: o || "Villager",
		...o ? {} : { unnamed: !0 },
		preset: kn.includes(e.preset) ? e.preset : "villager",
		spec: e.spec && typeof e.spec == "object" ? e.spec : void 0,
		home: [n, r],
		wander: Math.max(0, po(e.wander, 1.2)),
		speed: Math.max(.1, po(e.speed, 1)),
		facing: [
			"down",
			"up",
			"left",
			"right"
		].includes(e.facing) ? e.facing : "down",
		behaviour: e.behaviour,
		talkRadius: e.talkRadius == null ? void 0 : Math.max(.5, po(e.talkRadius, 1.6)),
		talkPoint: i,
		bounds: a,
		portraitColor: e.portraitColor || "#c9a45c",
		title: typeof e.title == "string" && e.title.trim() ? e.title : void 0,
		titleKey: typeof e.title == "string" && e.title.trim() && jn(e, "title") || void 0,
		...t && [
			e.id,
			e.actor,
			o
		].some((e) => typeof e == "string" && t.has(e.toLowerCase())) ? { festival: !0 } : {}
	};
}
var bo = class {
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
		}), this._events = new Pt(), this.season = null, this.thaw = null, this._applyLevel(t), this.mode = "loading", this.photoMode = !1, this.mapOpen = !1, this.busy = !1, this.musicWanted = !0, this.inventory = Object.assign(Object.create(null), { apples: 0 }), this.visits = /* @__PURE__ */ new Map(), this._regionTimer = 0, this._burstTimer = 0, this._sparkleTimer = 0, this._talkCooldown = 0, this._tmp = new F(), this._focusPos = new F(), this._target = {
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
			...br,
			...Un(t)
		}), Ra(this.camera.distance - 7), this.cameraBounds = this._resolveCameraBounds(t.bounds);
		let n = this.env.highGround;
		this.highGround = n && Number.isFinite(po(n.minY, NaN)) ? {
			minY: po(n.minY, 0),
			pitch: mt(po(n.pitch, this.camera.pitch), 10, 80)
		} : null, this.regions = e.objects.filter((e) => e.type === "region"), this._bannersShown = /* @__PURE__ */ new Set(), this._regionBanner = null, this.region = "", this.combatEnabled = An(e), this.envNow = this.env, this.levelStates = null, this._cine = {
			t: 0,
			target: new F(),
			...this._titleCamera()
		}, this._cine.target.set(this._cine.x, this._cine.y, this._cine.z + Math.sin(1) * this._cine.driftZ);
	}
	_applyBackdrop() {
		let e = typeof this.env.backdrop == "string" ? this.env.backdrop.trim() : "", t = null;
		e === "void" ? t = new P(0, 0, 0) : /^#[0-9a-fA-F]{6}$/.test(e) ? t = new P(e) : e && console.warn(`[Luminati] environment.backdrop "${e}" is neither "void" nor #rrggbb: the sky is shown`), this.lighting && (this.lighting.settings.backdrop = t);
	}
	_resolveCameraBounds(e) {
		let t = (e) => ({
			minX: Math.min(e.minX, e.maxX),
			maxX: Math.max(e.minX, e.maxX),
			minZ: Math.min(e.minZ, e.maxZ),
			maxZ: Math.max(e.minZ, e.maxZ)
		});
		if (e && mo(e.near) && mo(e.mid) && mo(e.far)) return {
			near: t(e.near),
			mid: t(e.mid),
			far: t(e.far)
		};
		if (mo(e) || mo(e?.mid)) {
			let n = t(mo(e) ? e : e.mid);
			return {
				near: { ...n },
				mid: { ...n },
				far: { ...n }
			};
		}
		let n = sr(this.level, 0), r = (e, t, n, r) => t - e >= n + r ? [e + n, t - r] : [, ,].fill(e + (t - e) * (n / Math.max(1e-6, n + r))), i = {};
		for (let [e, t] of Object.entries(go)) {
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
			x: po(e.x, n),
			z: po(e.z, r),
			y: po(e.y, this._typicalGround() + .5),
			driftX: po(e.driftX, Math.min(7, (t.maxX - t.minX) * .25)),
			driftZ: po(e.driftZ, Math.min(5, (t.maxZ - t.minZ) * .25)),
			distance: mt(po(e.distance, Math.min(35, Math.max(22, i * .8))), 8, 80)
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
			ro(e.target) || e.preventDefault();
		}, window.addEventListener("contextmenu", this._onContextMenu, !0), this.loadStats = {}, La();
		let n = new Dt({
			container: this.container,
			maxPixelRatio: globalThis.__emberPixelRatio ?? 1.25,
			...globalThis.__emberInputTarget ? { inputTarget: globalThis.__emberInputTarget } : {}
		});
		this.engine = n;
		let { scene: r, camera: i, renderer: a } = n;
		this.textures = new Kt({
			seed: 1337,
			anisotropy: 4
		});
		let o = Mt.map((e) => ({
			...e,
			...hr[e.name] ?? {}
		})), s = (po(this.env.timeOfDay, 17.2) % 24 + 24) % 24;
		this.lighting = new It(n, {
			timeOfDay: s,
			shadowExtent: 26,
			sunPath: yr,
			moonPath: pr,
			keyframes: o
		}), this.lighting.sky.lowerClouds = .25, this._applyBackdrop(), this.lighting.timeSpeed = this.env.clock === !1 ? 0 : mr, this.lighting.paused = !0, this.particles = new nn(r), this.godRays = new Ot({ gain: .2 }), r.add(this.godRays.object), this.spriteManager = new ri(i), this.rig = new Tt(i, {
			...this.camera,
			yaw: 0,
			lookAhead: 1.3
		}), this.rig.bounds = { ...this.cameraBounds.mid };
		let c = Math.min(window.devicePixelRatio || 1, n.maxPixelRatio), l = window.innerWidth * window.innerHeight * c * c;
		this.postfx = new Et(a, r, i, {
			maxTaps: 64,
			samples: l > 18e5 ? 2 : 4
		}), this._tunePost(this.postfx.settings), n.events.on("resize", ({ width: e, height: t, pixelRatio: n }) => this.postfx.setSize(e, t, n)), this.resolution = new Pa({
			engine: n,
			postfx: this.postfx
		}), this.ui = new Rt(globalThis.__emberUiRoot ?? document.body, this.uiOptions), this.audio = new Wt({ volume: .6 }), this.lightPool = this.campaign ? new zt(this.lighting, [], {
			size: 12,
			fixed: !0
		}) : null;
		let { VfxLights: u } = await import("./VfxLights-Cqk8c_Db.js");
		this.vfxLights = new u(this.lighting), Ni(this, this.env), this.look === "cinematic" && (Va(this.postfx.settings, this.env), this.on("env", (e) => Wa(this.postfx.settings, e, this.combat?.look)));
		let d = performance.now();
		this.loadStats.engine = Math.round(d - t), (this.campaign || Cn(this.level)) && await this._createStory(), this._fontsPending = this.ui.fontsReady;
		let { earlyCompile: f } = await this._buildLevel(e, { t0: d }), p = this.ui;
		p.hud.showHelp(!1, { tab: !1 }), p.prompt.keyHint = "Space", p.dialog.speed = 55, p.dialog.onSound = (e) => this.audio.playSfx(e, { volume: .7 });
		let m = 0;
		p.dialog.onChar = (e) => {
			e === " " || m++ & 1 || this.audio.playSfx("blip", {
				volume: .22,
				pitch: .94 + Math.random() * .12
			});
		}, Fa(this), n.addSystem(this.lighting, -10), n.addSystem({
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
		this.loadStats.characters = Math.round(h - d - this.loadStats.world), e(.96, Bn("game.load.warmup")), await fo(0), this.rig.setTarget(this.player.sprite), this.rig.snap(), this.weather.rain.intensity = 1, this.weather.snow.intensity = 1, this.particles.update(1 / 60, i);
		let g = this._tmp.set(0, -1e3, 0);
		this.world.falls.some((e) => e.splash) && (this.particles.burst("splash", g, 1), this.particles.burst("sparkle", g, 1, { size: [.2, .34] })), this.particles.burst("footstep", g, 1), this.combat?.warmup(g), await f, await this._compileScene(), this.postfx.warmup();
		let _ = this._primeShadows();
		this.warmedUp.then(() => _.dispose()), this.weather.rain.intensity = 0, this.weather.snow.intensity = 0, this.env.weather && this.env.weather !== "clear" && !Kn(this.env) && this.weather.setWeather(this.env.weather, { instant: !0 }), this.campaign?.onStart(), this.applyLevelStates(), await this.syncParty(), this._exposeGlobal(), this.loadStats.compile = Math.round(performance.now() - h), e(1, Bn("game.load.ready"));
	}
	async _buildLevel(e, { t0: t = performance.now(), spawn: n = this.level.spawn, prepared: r = null, kept: i = null } = {}) {
		let a = this.engine, { scene: o } = a;
		this.story?.setLevelId(this.campaign?.levelId ?? this._storyLevelId());
		let s = this.level.environment;
		!this.thaw && (s?.frost || s?.states) && (this.thaw = await import("./LevelStates-BW3dsMez.js")), await ji(), this.primeLevelMusic(this.level, "level");
		let c = this._glyphsFor();
		i ? (this.world = i.world, this.world.story = this.story ? { present: this.story.present } : null, this.world.attach()) : r?.world && r.level === this.level ? (this.world = r.world, await r.finish(), this.world.story = this.story ? { present: this.story.present } : null, this.world.attach()) : (this.world = new Zi({
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
			this.posed = vo(this.level, this.campaign?.story), Dr(this.level, this.posed) && await Er(), this.player = i.player, this.npcs = i.npcs, this._npcSheets = i.sheets, this.critters = i.critters;
			for (let e of this._actorSprites()) o.add(e), this.spriteManager.add(e);
			this.player.arrive(n), this.lighting.followTarget(this.player.sprite), this._ensureStandingSpawn({ quiet: n !== this.level.spawn });
		} else {
			e(.92, Bn("game.load.villagers")), await fo(0);
			let t = vo(this.level, this.campaign?.story);
			this.posed = t, Dr(this.level, t) && await Er(), await oa({
				level: this.level,
				look: this.playerLook,
				combat: this.combatEnabled,
				kit: this.playerKit,
				records: this.party?.records
			}), this.player = new sa({
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
				let n = new Ca({
					def: yo(e, t),
					tileMap: this.tileMap,
					sheetCache: r
				});
				n.storyObj = e, n.talk = Xr(e), n.storyFlag = typeof e.flag == "string" ? e.flag.trim() : "", o.add(n.sprite), this.spriteManager.add(n.sprite), this.npcs.push(n);
			} catch (t) {
				console.warn(`[Luminati] could not create NPC "${e.id}":`, t);
			}
			this.critters = new ja({
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
			far2: ao ** 2,
			every: oo,
			frame: 0,
			npcDt: new Float32Array(this.npcs.length)
		} : null, this._throttle && (this.critters.throttle = {
			focus: this.rig.focusPoint,
			far2: ao ** 2,
			every: oo
		}), await this._fontsIn(c), this.combatEnabled) {
			e(.94, Bn("game.load.blades")), await fo(0);
			let { CombatSystem: t } = await import("./CombatSystem-BOPAG_6M.js");
			this.combat = new t({ game: this }), await this.combat.load();
		}
		let d = this.world.batching || !!this.combat;
		this.blobs = i ? i.blobs : d ? new ii() : null;
		let f = this._actorSprites();
		this.combat && f.push(...this.combat.actorSprites), this._actorEmissives = [];
		for (let e of f) this._actorEmissives.push(this.lighting.registerEmissive(e.material, _r)), !i && (d && e.shadowProxy && gn(e.shadowProxy, [this.lighting.sun]), this.blobs?.adopt(e));
		this.blobs?.mesh && a.scene.add(this.blobs.mesh), this.weather ? this.weather.setWorld(this.world) : this.weather = new Na({
			lighting: this.lighting,
			particles: this.particles,
			postfx: this.postfx,
			godRays: this.godRays,
			world: this.world
		}), this.audioDirector = i?.audioDirector ?? new Li({
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
		return !Fn(Ln()) || typeof e?.ensure != "function" ? null : e.ensure(qr(() => this._shownTexts()));
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
		for (let n of e.objects) if (n.type === "region") t.push(Kr(n.name), Yr(jn(n, "sub"), n.sub, "title"), Yr(jn(n, "banner"), n.banner, "title"));
		else if (n.type === "npc") {
			let e = yo(n);
			t.push(Xa({
				name: e.name,
				def: e
			}), Qa({ def: e }));
		} else n.type === "signpost" ? t.push(n.speaker == null ? Bn("game.default.signpost") : Kr(n.speaker)) : (n.type === "exit" && this.campaign && n.mode === "use" || n.type === "event" && this.story && (n.on ?? "use") === "use") && typeof n.label == "string" && n.label.trim() && t.push(Za({
			label: n.label.trim(),
			object: n
		}));
		for (let e of Ga) t.push(Kr(e.label));
		return t.push(...At(Ln())), t;
	}
	prepareWorld(e, t) {
		return new Zi({
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
		this.source = n, this._applyLevel(e), this._applyBackdrop(), Ni(this, this.env), this.look === "cinematic" && Va(this.postfx.settings, this.env);
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
		if (d || this._disposeDetached(u), f.setTarget(this.player.sprite), f.setAngles(0, this.camera.pitch), f.distanceTarget = this.camera.distance, this._updateCameraBounds(), f.snap(), this.world.lightPool?.snap(), this.postfx.setFocus(this._playerFocusDistance(), !0), a) await p, await this._compileScene(), await this._frames(uo);
		else {
			let e = this._tmp.set(0, -1e3, 0);
			this.weather.rain.intensity = 1, this.weather.snow.intensity = 1, this.particles.update(1 / 60, this.engine.camera), this.world.falls.some((e) => e.splash) && (this.particles.burst("splash", e, 1), this.particles.burst("sparkle", e, 1, { size: [.2, .34] })), this.particles.burst("footstep", e, 1), this.combat?.warmup(e), await p, await this._compileScene();
			let t = this._primeShadows();
			await this._frames(lo), t.dispose(), this.weather.rain.intensity = 0, this.weather.snow.intensity = 0, this.combat?.endWarmup();
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
		let e = hn(this.engine.scene, { lights: [this.lighting.sun] });
		return this.engine.scene.add(e.object), this.loadStats.shadowVariants = e.count, e;
	}
	_compileScene() {
		let e = this.engine.renderer, t = e.getRenderTarget();
		e.setRenderTarget(this.postfx.sceneTarget);
		let n = e.compileAsync(this.engine.scene, this.engine.camera);
		return e.setRenderTarget(t), n;
	}
	_setupMaps(e = null) {
		let t = performance.now(), n = this._mapPresence(), r = e?.levelMap && e.mapKey === n ? e.levelMap : lr(this._mapLevel());
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
		let t = this.level.objects.filter((t) => !dr(t) || e.present(t));
		return t.length === this.level.objects.length ? this.level : {
			...this.level,
			objects: t
		};
	}
	_mapPresence() {
		let e = this.story;
		if (!e) return "";
		let t = "";
		for (let n of this.level.objects) dr(n) && (t += e.present(n) ? "1" : "0");
		return t;
	}
	repaintLevelMap() {
		if (!this.levelMap || this.mode === "travel") return;
		this.party?.dropNav();
		let e = lr(this._mapLevel());
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
			name: Kr(e.name)
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
		return e && (this.mode !== "play" || this.busy || t.dialog.isOpen || this.photoMode || !this.levelMap || this.combat?.locksPlayer || this.partyMenuOpen) || e === this.mapOpen ? this.mapOpen : (this.mapOpen = e, e ? (this.combat?.onMapOpen(), t.worldMap.setRegion(Kr(this.region)), t.worldMap.open(), t.prompt.hide(), this.audio.playSfx("open", { volume: .45 })) : (t.worldMap.close(), this.audio.playSfx("close", { volume: .4 })), this.mapOpen);
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
		}), this.look === "cinematic" && Ba(e);
	}
	start() {
		this._warmFrames = lo, this.engine.start(), this.autostart ? this.enterGameplay({ instant: !0 }) : this.showTitle();
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
				destinations: Ga.map((e) => ({
					value: e.value,
					label: Kr(e.label)
				})),
				current: n
			} : {},
			...this._languageOptions()
		};
		if (await this.ui.title.show(r), this._disposed) return;
		let i = n ? this.ui.title.destination : void 0;
		if (i && i !== n && Ga.some((e) => e.value === i)) {
			let e = new URLSearchParams(window.location.search);
			e.delete("autostart"), e.set("level", i), window.location.search = e.toString();
			return;
		}
		this.enterGameplay({ instant: !1 });
	}
	_shippedSlug() {
		let e = /^levels\/([^/]+)\.json$/.exec(this.source || "");
		return e && Ga.some((t) => t.value === e[1]) ? e[1] : null;
	}
	_languageOptions() {
		return {
			languages: zn.map((e) => ({
				code: e,
				label: $a[e] ?? e
			})),
			lang: Ln(),
			onLanguage: (e) => {
				this.setLanguage(e);
			}
		};
	}
	setLanguage(e) {
		let t = Rn(e), n = new URLSearchParams(window.location.search), r = n.has("lang");
		return !r && t === Ln() ? t : (n.delete("lang"), r ? window.location.search = n.toString() : window.location.reload(), t);
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
		let { StoryRunner: e, StoryState: t, journeySeed: n } = await import("./StoryRunner-BWbsLIKj.js"), r = this.campaign, i = r ? r.state.story : new t(null);
		r || (i.seed = n()), this.story = new e({
			game: this,
			story: r?.story ?? null,
			state: i,
			levelId: r?.levelId ?? this._storyLevelId()
		}), r?.attachStory(this.story), this.engine.input.addBindings({ journal: ["KeyB"] });
		let { storyUIClasses: a } = await import("./storyUI-BXFv3vLS.js");
		this.ui.useStoryUI(a()), this.ui.journal && (this.ui.journal.onSound = (e) => this.audio.playSfx(e, { volume: .5 }));
	}
	async ensureParty() {
		return this.party ? this.party : (this._partyLoad ??= (async () => {
			let [{ Party: e }, { partyUIClasses: t }] = await Promise.all([import("./Party-DcUyyw-8.js"), import("./partyUI-DAOKNj5X.js")]);
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
		let e = this.party?.count ? [Ja] : [], t = this._keysOn(Ka), n = t.findIndex((e) => e.id === "map") + 1;
		return this.story ? Ya([
			...t.slice(0, n),
			qa,
			...e,
			...t.slice(n)
		]) : Ya(e.length ? [
			...t.slice(0, n),
			...e,
			...t.slice(n)
		] : t);
	}
	_legendExtra() {
		return Ya([
			...this._togglesSplit() ? this._keysOn(Ka.filter((e) => [
				"time",
				"weather",
				"photo",
				"music"
			].includes(e.id))) : [],
			...this.story ? [qa] : [],
			...this.party?.count ? [Ja] : []
		]);
	}
	_togglesSplit() {
		return !this.controls.time || !this.controls.weather;
	}
	_keysOn(e) {
		return e.filter((e) => (e.id !== "time" || this.controls.time) && (e.id !== "weather" || this.controls.weather));
	}
	_levelMusic() {
		return this.envNow.soundtrack ? { track: Yn(this.envNow, "explore") } : void 0;
	}
	primeLevelMusic(e, t) {
		let n = e?.environment ?? {}, r = [];
		if (n.music !== !1) {
			let t = Array.isArray(n.states) ? n.states.filter((e) => e?.soundtrack && typeof e.soundtrack == "object") : [];
			for (let i of [n, ...t.map((e) => ({ soundtrack: e.soundtrack }))]) r.push(Yn(i, "explore")), An(e) && (r.push(Yn(i, "battle")), e.objects.some((e) => e.type === "enemy" && !!Ht(Tn, e.kind)?.boss) && r.push(Yn(i, "boss")));
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
		if (!r.count) return this.ui.hud.toast(Bn("game.toast.noParty"), 1.6), !1;
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
		return [Kr(this.level.name), Yr(jn(this.level, "subtitle"), this.level.subtitle, "title")];
	}
	_titleTexts() {
		let e = this.env.title ?? {}, t = this.level;
		return {
			title: e.title ? Yr(jn(t, "title.title"), e.title, "title") : Kr(t.name).toUpperCase(),
			subtitle: e.subtitle == null ? t.subtitle ? Yr(jn(t, "subtitle"), t.subtitle, "title") : Bn("game.default.subtitle") : Yr(jn(t, "title.subtitle"), e.subtitle, "title"),
			prompt: e.prompt ? Yr(jn(t, "title.prompt"), e.prompt, "title") : Bn("game.default.prompt"),
			credit: e.credit == null ? Bn("game.default.credit") : Yr(jn(t, "title.credit"), e.credit, "title")
		};
	}
	_examineText(e) {
		let t = e.text;
		return t?.lines?.length ? {
			speaker: t.speakerDefault ? Bn(`game.default.${t.speakerDefault}`) : Kr(t.speaker),
			lines: t.lines.map((e, n) => {
				if (typeof e != "string") return e;
				if (t.linesDefault) return Bn(`game.default.${t.linesDefault}`);
				if (!Array.isArray(t.keys)) return e;
				let r = t.keys[n];
				return Yr(typeof r == "string" ? r : "", e);
			})
		} : {
			speaker: "",
			lines: [Bn("game.default.nothing")]
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
		return this.ui.hud.toast(Lt(e.id), 1.6), e.h;
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
		return this.ui.hud.toast(Bn(`game.toast.${this.weather.indoors ? "outside" : "weather"}.${e}`), 1.6), e;
	}
	setMusic(e) {
		return this.musicWanted = !!e, e ? this.audio.startMusic(this.combat ? { track: this.combat.musicTrack } : this._levelMusic()) : this.audio.stopMusic(), this.audio.musicPlaying;
	}
	togglePhotoMode({ instant: e = !1 } = {}) {
		return !this.photoMode && (this.busy || this.ui.dialog.isOpen || this.mode !== "play" || this.mapOpen || this.partyMenuOpen) ? this.photoMode : !this.photoMode && (this.combat?.engaged || this.combat?.locksPlayer) ? (this.ui.hud.toast(Bn("game.toast.foes"), 1.6), this.photoMode) : (this.photoMode = !this.photoMode, clearTimeout(this._photoTimer), this._timeouts.delete(this._photoTimer), this.photoMode ? (this.ui.prompt.hide(), e ? this.ui.setVisible(!1) : (this.ui.hud.toast(Bn("game.toast.photo"), 1.6), this._photoTimer = this._later(1.2, () => {
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
			this.campaign && this.env.clock === !1 || this.weather.setTime(8), this.campaign?.onRest(), this.story?.rested(e), this.audio.playSfx("chime", { volume: .6 }), await fo(.7), await this.ui.fader.fadeIn(1.1), this.ui.hud.toast(Bn("game.toast.rested"), 2.2);
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
			let d = l ? u.interactPoint : u.position, f = l ? u.talkRadius ?? eo : u.radius ?? eo, p = d.x - e.x, m = d.z - e.z, h = Math.hypot(p, m);
			if (h > f || Math.abs(d.y - e.y) > 1.3) continue;
			let g = h > .001 ? (p * t.x + m * t.z) / h : 1, _ = l ? null : u.area, v = !!_ && e.x >= _.minX && e.x <= _.maxX && e.z >= _.minZ && e.z <= _.maxZ, y = h <= .55 || g >= .25 ? h - g * .7 : v ? h + .7 : Infinity;
			!l && u.storyEvent && (y -= .3);
			let b = l ? null : u.lookSpan;
			if (b) {
				let n = io(b, e.x, e.z), r = n.x - e.x, i = n.z - e.z, a = Math.hypot(r, i), o = a > .001 ? (r * t.x + i * t.z) / a : 1;
				o >= to && (y = Math.min(y, a - o * .7));
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
					let r = Qa(n);
					await n.talk({
						say: (e, t = {}) => {
							let i = t.speaker == null, a = {
								speaker: i ? Xa(n) : Kr(t.speaker),
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
				let e = r.lookSpan ? io(r.lookSpan, this.player.position.x, this.player.position.z) : r.position;
				this.player.faceTowards(e.x, e.z), r.onInteract ? await r.onInteract(this, r) : (r.text?.sfx && r.text.lines?.length && this.audio.playSfx(r.text.sfx, { volume: .6 }), await this.ui.dialog.open(this._examineText(r)));
			}
		} catch (e) {
			this._disposed || console.error("[Luminati] interaction failed:", e);
		} finally {
			t === "npc" && n.endTalk(), this.busy = !1, this._talkCooldown = so;
		}
	}
	update(e) {
		if (this.mode === "travel") return;
		let { engine: t, ui: n, rig: r, player: i } = this, a = t.input, o = this.mode === "play", s = this.busy || n.dialog.isOpen;
		this._talkCooldown > 0 && (this._talkCooldown -= e, !s && a.actionPressed("confirm") && (this._talkCooldown = Math.max(this._talkCooldown, co))), o && (a.actionPressed("debug") && n.debug.toggle(), this.mapOpen ? (a.actionPressed("map") || a.actionPressed("cancel")) && this.toggleMap(!1) : this.journalOpen ? (a.actionPressed("journal") || a.actionPressed("cancel")) && this.toggleJournal(!1) : this.partyMenuOpen ? (a.actionPressed("party") || a.actionPressed("cancel")) && (a.consumeAction?.("party"), this.togglePartyMenu(!1)) : !s && !this.photoMode && a.actionPressed("map") ? this.toggleMap(!0) : this.story && !s && !this.photoMode && a.actionPressed("journal") ? this.toggleJournal(!0) : this.party && !s && !this.photoMode && a.actionPressed("party") && (a.consumeAction?.("party"), this.togglePartyMenu(!0)));
		let c = this.mapOpen || this.journalOpen || this.partyMenuOpen;
		if (o && !c && (a.actionPressed("help") && n.hud.toggleHelp(), !s && ((a.actionPressed("photo") || this.photoMode && a.actionPressed("cancel")) && this.togglePhotoMode(), this.controls.time && a.actionPressed("time") && this.cycleTime(), this.controls.weather && a.actionPressed("weather") && this.cycleWeather(), a.actionPressed("music")))) {
			let e = this.setMusic(!this.audio.musicPlaying);
			n.hud.toast(Bn(e ? "game.toast.musicOn" : "game.toast.musicOff"), 1.4);
		}
		let l = this.combat, u = o && !s && !c && !this.photoMode, d = !u && o && !c && !this.photoMode && !!this.story?.run;
		i.frozen = !o || s || c || !!l && (this.photoMode || l.locksPlayer), l?.update(e, u, d), i.update(e, a), l?.afterPlayer(e, u, d), this.story?.update(e), o && !c && this.party?.update(e), i.setSilhouetteLevel(Ct(1, .5, this.lighting.nightFactor));
		let f = !!this.story && (this.story.ownsCamera || this.rig.framed);
		(this.party || this.story) && i.fadeSilhouette(f || !!this.party?.coversPlayer, f ? 1 : e);
		let p = s ? i.talkSprite : null;
		if (o && !s && !this.photoMode && !c && !l?.locksPlayer) {
			let e = this._findInteractable();
			e ? (e.kind === "npc" ? (n.prompt.show(e.npc.sprite, Bn("game.prompt.talk"), { offsetY: e.npc.def.preset === "child" ? 1.9 : 2.35 }), p = e.npc.sprite) : n.prompt.show(e.it.prompt, Za(e.it)), this._talkCooldown <= 0 && a.actionPressed("confirm") && (a.consumeAction?.("confirm"), this._interact(e))) : n.prompt.hide();
		} else s || n.prompt.hide();
		i.setTalkSilhouette(f ? null : p), this.campaign && o && this.campaign.update(e, { blocked: s || this.photoMode || c || !!l?.locksPlayer });
		let m = i.position, h = this._npcCtx, g = this._throttle;
		if (g) {
			g.frame++;
			let t = Math.max(ao, r.distance * 1.15 + 4);
			g.far2 = t * t, this.critters.throttle && (this.critters.throttle.far2 = g.far2);
			let n = r.focusPoint;
			for (let t = 0; t < this.npcs.length; t++) {
				let r = this.npcs[t], i = (r.position.x - n.x) ** 2 + (r.position.z - n.z) ** 2;
				g.npcDt[t] += e, (i < g.far2 || r.talking || (g.frame + t) % g.every === 0) && (r.update(Math.min(g.npcDt[t], .25), h), g.npcDt[t] = 0);
			}
		} else for (let t = 0; t < this.npcs.length; t++) this.npcs[t].update(e, h);
		this.critters.update(e, this._critterCtx), r.inputEnabled = o && !s && !c, this.mode === "title" ? this._updateCinematic(e) : o && !this.story?.ownsCamera && this._updatePlayCamera(), r.update(e, a), this.spriteManager.update(e), this.blobs?.update();
		let _ = this.world.emitters.dust;
		_ && _.position.set(r.focusPoint.x, r.focusPoint.y + 1.2, r.focusPoint.z - 2), this.weather.zoomFog = mt(((this.camera.distance - 7) / Math.max(1, r.distance - 7)) ** 2, .4, 1), this.weather.update(e), this.season?.update(e), l?.applyLook(e), this._warmFrames > 0 && (this._warmFrames--, this.weather.rain.intensity = 1, this.weather.snow.intensity = 1, this._warmFrames === 0 && (l?.endWarmup(), this._resolveWarm()));
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
			e.pitchTarget = (n && t.y > n.minY ? n.pitch : this.camera.pitch) * St;
			let r = this.level.width, i = Math.min(9, r / 5), a = 5 / 9 * i, o = gt(r - i, r - a, t.x), s = gt(i, a, t.x);
			(o > 0 || s > 0) && (e.yawTarget = mt(e.yawTarget, -(60 - 50 * s) * St, (60 - 50 * o) * St));
		}
		this._updateCameraBounds();
	}
	_updateCameraBounds() {
		let e = this.rig.distance, t = this.camera, { near: n, mid: r, far: i } = this.cameraBounds, a, o, s;
		e <= t.distance ? (a = n, o = r, s = mt((e - t.minDistance) / Math.max(1e-6, t.distance - t.minDistance))) : (a = r, o = i, s = mt((e - t.distance) / Math.max(1e-6, t.maxDistance - t.distance)));
		let c = this.rig.bounds;
		c.minX = Ct(a.minX, o.minX, s), c.maxX = Ct(a.maxX, o.maxX, s), c.minZ = Ct(a.minZ, o.minZ, s), c.maxZ = Ct(a.maxZ, o.maxZ, s);
	}
	_playerFocusDistance() {
		let e = this.player.position, t = this.engine.camera, n = this._focusPos.set(e.x, e.y + .9, e.z).applyMatrix4(t.matrixWorldInverse);
		return Math.max(1, -n.z);
	}
	_updateCinematic(e) {
		let t = this._cine;
		t.t += e;
		let n = t.t * .045;
		t.target.set(t.x + Math.sin(n) * t.driftX, t.y, t.z + Math.sin(n * .7 + 1) * t.driftZ), this.rig.yawTarget = Math.sin(t.t * .05) * 18 * St, this.rig.distanceTarget = t.distance + Math.sin(t.t * .07) * 3;
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
		if (n && (n.name !== this.region && (this.region = n.name, this.ui.hud.setLocation(Kr(n.name), n.sub ? Yr(jn(n, "sub"), n.sub, "title") : Kr(this.level.name))), n.banner && !this._bannersShown.has(n.name) && !this.story?.run)) {
			this._bannersShown.add(n.name);
			let e = Kr(n.name);
			this.ui.banner.show(e, Yr(jn(n, "banner"), n.banner, "title"), { duration: 2.6 }), this._regionBanner = {
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
				yaw: +(this.rig.yaw / St).toFixed(1),
				pitch: +(this.rig.pitch / St).toFixed(1),
				distance: +this.rig.distance.toFixed(2),
				focus: this.rig.focusPoint.toArray().map((e) => +e.toFixed(2))
			},
			inventory: { ...this.inventory },
			lang: Ln(),
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
function xo(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = e.clone();
	return So(e, r, function(e, r) {
		t.set(r, e), n.set(e, r);
	}), r.traverse(function(e) {
		if (!e.isSkinnedMesh) return;
		let r = e, i = t.get(e), a = i.skeleton.bones;
		r.skeleton = i.skeleton.clone(), r.bindMatrix.copy(i.bindMatrix), r.skeleton.bones = a.map(function(e) {
			return n.get(e);
		}), r.bind(r.skeleton, r.bindMatrix);
	}), r;
}
function So(e, t, n) {
	n(e, t);
	for (let r = 0; r < e.children.length; r++) So(e.children[r], t.children[r], n);
}
//#endregion
//#region node_modules/three/examples/jsm/loaders/GLTFLoader.js
var Co = class extends Le {
	constructor(e) {
		super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(e) {
			return new Ao(e);
		}), this.register(function(e) {
			return new jo(e);
		}), this.register(function(e) {
			return new Bo(e);
		}), this.register(function(e) {
			return new Vo(e);
		}), this.register(function(e) {
			return new Ho(e);
		}), this.register(function(e) {
			return new No(e);
		}), this.register(function(e) {
			return new Po(e);
		}), this.register(function(e) {
			return new Fo(e);
		}), this.register(function(e) {
			return new Io(e);
		}), this.register(function(e) {
			return new ko(e);
		}), this.register(function(e) {
			return new Lo(e);
		}), this.register(function(e) {
			return new Mo(e);
		}), this.register(function(e) {
			return new zo(e);
		}), this.register(function(e) {
			return new Ro(e);
		}), this.register(function(e) {
			return new Do(e);
		}), this.register(function(e) {
			return new Uo(e, Eo.EXT_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new Uo(e, Eo.KHR_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new Wo(e);
		});
	}
	load(e, t, n, r) {
		let i = this, a;
		if (this.resourcePath !== "") a = this.resourcePath;
		else if (this.path !== "") {
			let t = ke.extractUrlBase(e);
			a = ke.resolveURL(t, this.path);
		} else a = ke.extractUrlBase(e);
		this.manager.itemStart(e);
		let o = function(t) {
			r ? r(t) : console.error(t), i.manager.itemError(e), i.manager.itemEnd(e);
		}, s = new b(this.manager);
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
			if (s.decode(new Uint8Array(e, 0, 4)) === Go) {
				try {
					a[Eo.KHR_BINARY_GLTF] = new Jo(e);
				} catch (e) {
					r && r(e);
					return;
				}
				i = JSON.parse(a[Eo.KHR_BINARY_GLTF].content);
			} else i = JSON.parse(s.decode(e));
		} else i = e;
		if (i.asset === void 0 || i.asset.version[0] < 2) {
			r && r(/* @__PURE__ */ Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
			return;
		}
		let c = new bs(i, {
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
				case Eo.KHR_MATERIALS_UNLIT:
					a[t] = new Oo();
					break;
				case Eo.KHR_DRACO_MESH_COMPRESSION:
					a[t] = new Yo(i, this.dracoLoader);
					break;
				case Eo.KHR_TEXTURE_TRANSFORM:
					a[t] = new Xo();
					break;
				case Eo.KHR_MESH_QUANTIZATION:
					a[t] = new Zo();
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
function wo() {
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
function To(e, t, n) {
	let r = e.json.materials[t];
	return r.extensions && r.extensions[n] ? r.extensions[n] : null;
}
var Eo = {
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
}, Do = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_LIGHTS_PUNCTUAL, this.cache = {
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
		let a = t.json, o = ((a.extensions && a.extensions[this.name] || {}).lights || [])[e], s, c = new P(16777215);
		o.color !== void 0 && c.setRGB(o.color[0], o.color[1], o.color[2], Te);
		let l = o.range === void 0 ? 0 : o.range;
		switch (o.type) {
			case "directional":
				s = new r(c), s.target.position.set(0, 0, -1), s.add(s.target);
				break;
			case "point":
				s = new ne(c), s.distance = l;
				break;
			case "spot":
				s = new ue(c), s.distance = l, o.spot = o.spot || {}, o.spot.innerConeAngle = o.spot.innerConeAngle === void 0 ? 0 : o.spot.innerConeAngle, o.spot.outerConeAngle = o.spot.outerConeAngle === void 0 ? Math.PI / 4 : o.spot.outerConeAngle, s.angle = o.spot.outerConeAngle, s.penumbra = 1 - o.spot.innerConeAngle / o.spot.outerConeAngle, s.target.position.set(0, 0, -1), s.add(s.target);
				break;
			default: throw Error("THREE.GLTFLoader: Unexpected light type: " + o.type);
		}
		return s.position.set(0, 0, 0), fs(s, o), o.intensity !== void 0 && (s.intensity = o.intensity), s.name = t.createUniqueName(o.name || "light_" + e), i = Promise.resolve(s), t.cache.add(n, i), i;
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
}, Oo = class {
	constructor() {
		this.name = Eo.KHR_MATERIALS_UNLIT;
	}
	getMaterialType() {
		return tt;
	}
	extendParams(e, t, n) {
		let r = [];
		e.color = new P(1, 1, 1), e.opacity = 1;
		let i = t.pbrMetallicRoughness;
		if (i) {
			if (Array.isArray(i.baseColorFactor)) {
				let t = i.baseColorFactor;
				e.color.setRGB(t[0], t[1], t[2], Te), e.opacity = t[3];
			}
			i.baseColorTexture !== void 0 && r.push(n.assignTexture(e, "map", i.baseColorTexture, o));
		}
		return Promise.all(r);
	}
}, ko = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_MATERIALS_EMISSIVE_STRENGTH;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		return n === null || n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength), Promise.resolve();
	}
}, Ao = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_MATERIALS_CLEARCOAT;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : ie;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor), n.clearcoatTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)), n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor), n.clearcoatRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)), n.clearcoatNormalTexture !== void 0 && (r.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)), n.clearcoatNormalTexture.scale !== void 0)) {
			let e = n.clearcoatNormalTexture.scale;
			t.clearcoatNormalScale = new Oe(e, e);
		}
		return Promise.all(r);
	}
}, jo = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_MATERIALS_DISPERSION;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : ie;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		return n === null || (t.dispersion = n.dispersion === void 0 ? 0 : n.dispersion), Promise.resolve();
	}
}, Mo = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_MATERIALS_IRIDESCENCE;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : ie;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor), n.iridescenceTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)), n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = n.iridescenceThicknessMinimum), n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = n.iridescenceThicknessMaximum), n.iridescenceThicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)), Promise.all(r);
	}
}, No = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_MATERIALS_SHEEN;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : ie;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (t.sheenColor = new P(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, n.sheenColorFactor !== void 0) {
			let e = n.sheenColorFactor;
			t.sheenColor.setRGB(e[0], e[1], e[2], Te);
		}
		return n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor), n.sheenColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, o)), n.sheenRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)), Promise.all(r);
	}
}, Po = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_MATERIALS_TRANSMISSION;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : ie;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor), n.transmissionTexture !== void 0 && r.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)), Promise.all(r);
	}
}, Fo = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_MATERIALS_VOLUME;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : ie;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.thickness = n.thicknessFactor === void 0 ? 0 : n.thicknessFactor, n.thicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "thicknessMap", n.thicknessTexture)), t.attenuationDistance = n.attenuationDistance || Infinity;
		let i = n.attenuationColor || [
			1,
			1,
			1
		];
		return t.attenuationColor = new P().setRGB(i[0], i[1], i[2], Te), Promise.all(r);
	}
}, Io = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_MATERIALS_IOR;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : ie;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		return n === null ? Promise.resolve() : (t.ior = n.ior === void 0 ? 1.5 : n.ior, t.ior === 0 && (t.ior = 1e3), Promise.resolve());
	}
}, Lo = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_MATERIALS_SPECULAR;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : ie;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.specularIntensity = n.specularFactor === void 0 ? 1 : n.specularFactor, n.specularTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularIntensityMap", n.specularTexture));
		let i = n.specularColorFactor || [
			1,
			1,
			1
		];
		return t.specularColor = new P().setRGB(i[0], i[1], i[2], Te), n.specularColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, o)), Promise.all(r);
	}
}, Ro = class {
	constructor(e) {
		this.parser = e, this.name = Eo.EXT_MATERIALS_BUMP;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : ie;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return t.bumpScale = n.bumpFactor === void 0 ? 1 : n.bumpFactor, n.bumpTexture !== void 0 && r.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)), Promise.all(r);
	}
}, zo = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_MATERIALS_ANISOTROPY;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : ie;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength), n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation), n.anisotropyTexture !== void 0 && r.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)), Promise.all(r);
	}
}, Bo = class {
	constructor(e) {
		this.parser = e, this.name = Eo.KHR_TEXTURE_BASISU;
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
}, Vo = class {
	constructor(e) {
		this.parser = e, this.name = Eo.EXT_TEXTURE_WEBP;
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
}, Ho = class {
	constructor(e) {
		this.parser = e, this.name = Eo.EXT_TEXTURE_AVIF;
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
}, Uo = class {
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
}, Wo = class {
	constructor(e) {
		this.name = Eo.EXT_MESH_GPU_INSTANCING, this.parser = e;
	}
	createNodeMesh(e) {
		let t = this.parser.json, n = t.nodes[e];
		if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
		let r = t.meshes[n.mesh];
		for (let e of r.primitives) if (e.mode !== ts.TRIANGLES && e.mode !== ts.TRIANGLE_STRIP && e.mode !== ts.TRIANGLE_FAN && e.mode !== void 0) return null;
		let i = n.extensions[this.name].attributes, a = [], o = {};
		for (let e in i) a.push(this.parser.getDependency("accessor", i[e]).then((t) => (o[e] = t, o[e])));
		return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((e) => {
			let t = e.pop(), n = t.isGroup ? t.children : [t], r = e[0].count, i = [];
			for (let e of n) {
				let t = new nt(), n = new F(), a = new m(), s = new F(1, 1, 1), c = new le(e.geometry, e.material, r);
				for (let e = 0; e < r; e++) o.TRANSLATION && n.fromBufferAttribute(o.TRANSLATION, e), o.ROTATION && a.fromBufferAttribute(o.ROTATION, e), o.SCALE && s.fromBufferAttribute(o.SCALE, e), c.setMatrixAt(e, t.compose(n, a, s));
				let l = null;
				for (let e in o) if (e === "_COLOR_0") {
					let t = o[e];
					c.instanceColor = new g(t.array, t.itemSize, t.normalized);
				} else if (e !== "TRANSLATION" && e !== "ROTATION" && e !== "SCALE") {
					if (l === null) {
						let e = c.geometry;
						l = new Pe(), l.name = e.name;
						for (let t in e.attributes) l.setAttribute(t, e.attributes[t]);
						for (let t in e.morphAttributes) l.morphAttributes[t] = e.morphAttributes[t];
						e.index !== null && l.setIndex(e.index), l.morphTargetsRelative = e.morphTargetsRelative;
						for (let t of e.groups) l.addGroup(t.start, t.count, t.materialIndex);
						e.boundingBox !== null && (l.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (l.boundingSphere = e.boundingSphere.clone()), l.drawRange.start = e.drawRange.start, l.drawRange.count = e.drawRange.count, l.userData = Object.assign({}, e.userData), c.geometry = l;
					}
					let t = o[e];
					l.setAttribute(e, new g(t.array, t.itemSize, t.normalized));
				}
				C.prototype.copy.call(c, e), this.parser.assignFinalMaterial(c), i.push(c);
			}
			return t.isGroup ? (t.clear(), t.add(...i), t) : i[0];
		}));
	}
}, Go = "glTF", Ko = 12, qo = {
	JSON: 1313821514,
	BIN: 5130562
}, Jo = class {
	constructor(e) {
		this.name = Eo.KHR_BINARY_GLTF, this.content = null, this.body = null;
		let t = new DataView(e, 0, Ko), n = new TextDecoder();
		if (this.header = {
			magic: n.decode(new Uint8Array(e.slice(0, 4))),
			version: t.getUint32(4, !0),
			length: t.getUint32(8, !0)
		}, this.header.magic !== Go) throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
		if (this.header.version < 2) throw Error("THREE.GLTFLoader: Legacy binary file detected.");
		let r = this.header.length - Ko, i = new DataView(e, Ko), a = 0;
		for (; a < r;) {
			let t = i.getUint32(a, !0);
			a += 4;
			let r = i.getUint32(a, !0);
			if (a += 4, r === qo.JSON) {
				let r = new Uint8Array(e, Ko + a, t);
				this.content = n.decode(r);
			} else if (r === qo.BIN) {
				let n = Ko + a;
				this.body = e.slice(n, n + t);
			}
			a += t;
		}
		if (this.content === null) throw Error("THREE.GLTFLoader: JSON content not found.");
	}
}, Yo = class {
	constructor(e, t) {
		if (!t) throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
		this.name = Eo.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
	}
	decodePrimitive(e, t) {
		let n = this.json, r = this.dracoLoader, i = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, s = {}, c = {};
		for (let e in a) {
			let t = os[e] || e.toLowerCase();
			o[t] = a[e];
		}
		for (let t in e.attributes) {
			let r = os[t] || t.toLowerCase();
			if (a[t] !== void 0) {
				let i = n.accessors[e.attributes[t]];
				c[r] = ns[i.componentType].name, s[r] = i.normalized === !0;
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
				}, o, c, Te, n);
			});
		});
	}
}, Xo = class {
	constructor() {
		this.name = Eo.KHR_TEXTURE_TRANSFORM;
	}
	extendTexture(e, t) {
		if ((t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0) return e;
		if (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), t.rotation !== void 0) {
			let t = Math.cos(e.rotation), n = Math.sin(e.rotation);
			e.matrix.set(e.repeat.x * t, e.repeat.y * n, e.offset.x, -e.repeat.x * n, e.repeat.y * t, e.offset.y, 0, 0, 1), e.matrixAutoUpdate = !1;
		}
		return e.needsUpdate = !0, e;
	}
}, Zo = class {
	constructor() {
		this.name = Eo.KHR_MESH_QUANTIZATION;
	}
}, Qo = class extends Ce {
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
}, $o = new m(), es = class extends Qo {
	interpolate_(e, t, n, r) {
		let i = super.interpolate_(e, t, n, r);
		return $o.fromArray(i).normalize().toArray(i), i;
	}
}, ts = {
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
}, ns = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
}, rs = {
	9728: D,
	9729: Fe,
	9984: a,
	9985: xe,
	9986: Ne,
	9987: Qe
}, is = {
	33071: De,
	33648: c,
	10497: T
}, as = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT2: 4,
	MAT3: 9,
	MAT4: 16
}, os = {
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
}, ss = {
	scale: "scale",
	translation: "position",
	rotation: "quaternion",
	weights: "morphTargetInfluences"
}, cs = {
	CUBICSPLINE: void 0,
	LINEAR: Be,
	STEP: Ze
}, ls = {
	OPAQUE: "OPAQUE",
	MASK: "MASK",
	BLEND: "BLEND"
};
function us(e) {
	return e.DefaultMaterial === void 0 && (e.DefaultMaterial = new l({
		color: 16777215,
		emissive: 0,
		metalness: 1,
		roughness: 1,
		transparent: !1,
		depthTest: !0,
		side: 0
	})), e.DefaultMaterial;
}
function ds(e, t, n) {
	for (let r in n.extensions) e[r] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[r] = n.extensions[r]);
}
function fs(e, t) {
	t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function ps(e, t, n) {
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
function ms(e, t) {
	if (e.updateMorphTargets(), t.weights !== void 0) for (let n = 0, r = t.weights.length; n < r; n++) e.morphTargetInfluences[n] = t.weights[n];
	if (t.extras && Array.isArray(t.extras.targetNames)) {
		let n = t.extras.targetNames;
		if (e.morphTargetInfluences.length === n.length) {
			e.morphTargetDictionary = {};
			for (let t = 0, r = n.length; t < r; t++) e.morphTargetDictionary[n[t]] = t;
		} else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
	}
}
function hs(e) {
	let t, n = e.extensions && e.extensions[Eo.KHR_DRACO_MESH_COMPRESSION];
	if (t = n ? "draco:" + n.bufferView + ":" + n.indices + ":" + gs(n.attributes) : e.indices + ":" + gs(e.attributes) + ":" + e.mode, e.targets !== void 0) for (let n = 0, r = e.targets.length; n < r; n++) t += ":" + gs(e.targets[n]);
	return t;
}
function gs(e) {
	let t = "", n = Object.keys(e).sort();
	for (let r = 0, i = n.length; r < i; r++) t += n[r] + ":" + e[n[r]] + ";";
	return t;
}
function _s(e) {
	switch (e) {
		case Int8Array: return 1 / 127;
		case Uint8Array: return 1 / 255;
		case Int16Array: return 1 / 32767;
		case Uint16Array: return 1 / 65535;
		default: throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
	}
}
function vs(e) {
	return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0 ? "image/webp" : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
var ys = new nt(), bs = class {
	constructor(e = {}, t = {}) {
		this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new wo(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = {
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
		this.textureLoader = typeof createImageBitmap > "u" || n && r < 17 || i && a < 98 ? new Se(this.options.manager) : new Ge(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new b(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
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
			return ds(i, a, r), fs(a, r), Promise.all(n._invokeAll(function(e) {
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
		if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[Eo.KHR_BINARY_GLTF].body);
		let r = this.options;
		return new Promise(function(e, i) {
			n.load(ke.resolveURL(t.uri, r.path), e, void 0, function() {
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
		let n = this, r = this.json, i = this.json.accessors[e];
		if (i.bufferView === void 0 && i.sparse === void 0) {
			let e = as[i.type], t = ns[i.componentType], n = i.normalized === !0, r = new t(i.count * e);
			return Promise.resolve(new ve(r, e, n));
		}
		let a = [];
		return i.bufferView === void 0 ? a.push(null) : a.push(this.getDependency("bufferView", i.bufferView)), i.sparse !== void 0 && (a.push(this.getDependency("bufferView", i.sparse.indices.bufferView)), a.push(this.getDependency("bufferView", i.sparse.values.bufferView))), Promise.all(a).then(function(e) {
			let a = e[0], o = as[i.type], s = ns[i.componentType], c = s.BYTES_PER_ELEMENT, l = c * o, u = i.byteOffset || 0, d = i.bufferView === void 0 ? void 0 : r.bufferViews[i.bufferView].byteStride, f = i.normalized === !0, p, m;
			if (d && d !== l) {
				let e = Math.floor(u / d), r = "InterleavedBuffer:" + i.bufferView + ":" + i.componentType + ":" + e + ":" + i.count, l = n.cache.get(r);
				l || (p = new s(a, e * d, i.count * d / c), l = new O(p, d / c), n.cache.add(r, l)), m = new t(l, o, u % d / c, f);
			} else p = a === null ? new s(i.count * o) : new s(a, u, i.count * o), m = new ve(p, o, f);
			if (i.sparse !== void 0) {
				let t = as.SCALAR, n = ns[i.sparse.indices.componentType], r = i.sparse.indices.byteOffset || 0, c = i.sparse.values.byteOffset || 0, l = new n(e[1], r, i.sparse.count * t), u = new s(e[2], c, i.sparse.count * o);
				a !== null && (m = new ve(m.array.slice(), m.itemSize, m.normalized)), m.normalized = !1;
				for (let e = 0, t = l.length; e < t; e++) {
					let t = l[e];
					if (m.setX(t, u[e * o]), o >= 2 && m.setY(t, u[e * o + 1]), o >= 3 && m.setZ(t, u[e * o + 2]), o >= 4 && m.setW(t, u[e * o + 3]), o >= 5) throw Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
				}
				m.normalized = f;
			}
			return m;
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
			return t.magFilter = rs[n.magFilter] || 1006, t.minFilter = rs[n.minFilter] || 1008, t.wrapS = is[n.wrapS] || 1e3, t.wrapT = is[n.wrapT] || 1e3, t.generateMipmaps = !t.isCompressedTexture && t.minFilter !== 1003 && t.minFilter !== 1006, r.associations.set(t, { textures: e }), t;
		}).catch(function() {
			return null;
		});
		return this.textureCache[s] = c, c;
	}
	loadImageSource(e, t) {
		let r = this, i = this.json, a = this.options;
		if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((e) => e.clone());
		let o = i.images[e], s = self.URL || self.webkitURL, c = o.uri || "", l = !1;
		if (o.bufferView !== void 0) c = r.getDependency("bufferView", o.bufferView).then(function(e) {
			l = !0;
			let t = new Blob([e], { type: o.mimeType });
			return c = s.createObjectURL(t), c;
		});
		else if (o.uri === void 0) throw Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
		let u = Promise.resolve(c).then(function(e) {
			return new Promise(function(r, i) {
				let o = r;
				t.isImageBitmapLoader === !0 && (o = function(e) {
					let t = new n(e);
					t.needsUpdate = !0, r(t);
				}), t.load(ke.resolveURL(e, a.path), o, void 0, i);
			});
		}).then(function(e) {
			return l === !0 && s.revokeObjectURL(c), fs(e, o), e.userData.mimeType = o.mimeType || vs(o.uri), e;
		}).catch(function(e) {
			throw console.error("THREE.GLTFLoader: Couldn't load texture", c), e;
		});
		return this.sourceCache[e] = u, u;
	}
	assignTexture(e, t, n, r) {
		let i = this;
		return this.getDependency("texture", n.index).then(function(a) {
			if (!a) return null;
			if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), i.extensions[Eo.KHR_TEXTURE_TRANSFORM]) {
				let e = n.extensions === void 0 ? void 0 : n.extensions[Eo.KHR_TEXTURE_TRANSFORM];
				if (e) {
					let t = i.associations.get(a);
					a = i.extensions[Eo.KHR_TEXTURE_TRANSFORM].extendTexture(a, e), i.associations.set(a, t);
				}
			}
			return r !== void 0 && (a.colorSpace = r), e[t] = a, a;
		});
	}
	assignFinalMaterial(e) {
		let t = e.geometry, n = e.material, r = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
		if (e.isPoints) {
			let e = "PointsMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new s(), Ee.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, t.sizeAttenuation = !1, this.cache.add(e, t)), n = t;
		} else if (e.isLine) {
			let e = "LineBasicMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new Ue(), Ee.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, this.cache.add(e, t)), n = t;
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
		return l;
	}
	loadMaterial(e) {
		let t = this, n = this.json, r = this.extensions, i = n.materials[e], a, s = {}, c = i.extensions || {}, l = [];
		if (c[Eo.KHR_MATERIALS_UNLIT]) {
			let e = r[Eo.KHR_MATERIALS_UNLIT];
			a = e.getMaterialType(), l.push(e.extendParams(s, i, t));
		} else {
			let n = i.pbrMetallicRoughness || {};
			if (s.color = new P(1, 1, 1), s.opacity = 1, Array.isArray(n.baseColorFactor)) {
				let e = n.baseColorFactor;
				s.color.setRGB(e[0], e[1], e[2], Te), s.opacity = e[3];
			}
			n.baseColorTexture !== void 0 && l.push(t.assignTexture(s, "map", n.baseColorTexture, o)), s.metalness = n.metallicFactor === void 0 ? 1 : n.metallicFactor, s.roughness = n.roughnessFactor === void 0 ? 1 : n.roughnessFactor, n.metallicRoughnessTexture !== void 0 && (l.push(t.assignTexture(s, "metalnessMap", n.metallicRoughnessTexture)), l.push(t.assignTexture(s, "roughnessMap", n.metallicRoughnessTexture))), a = this._invokeOne(function(t) {
				return t.getMaterialType && t.getMaterialType(e);
			}), l.push(Promise.all(this._invokeAll(function(t) {
				return t.extendMaterialParams && t.extendMaterialParams(e, s);
			})));
		}
		i.doubleSided === !0 && (s.side = 2);
		let u = i.alphaMode || ls.OPAQUE;
		if (u === ls.BLEND ? (s.transparent = !0, s.depthWrite = !1) : (s.transparent = !1, u === ls.MASK && (s.alphaTest = i.alphaCutoff === void 0 ? .5 : i.alphaCutoff)), i.normalTexture !== void 0 && a !== tt && (l.push(t.assignTexture(s, "normalMap", i.normalTexture)), s.normalScale = new Oe(1, 1), i.normalTexture.scale !== void 0)) {
			let e = i.normalTexture.scale;
			s.normalScale.set(e, e);
		}
		if (i.occlusionTexture !== void 0 && a !== tt && (l.push(t.assignTexture(s, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (s.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && a !== tt) {
			let e = i.emissiveFactor;
			s.emissive = new P().setRGB(e[0], e[1], e[2], Te);
		}
		return i.emissiveTexture !== void 0 && a !== tt && l.push(t.assignTexture(s, "emissiveMap", i.emissiveTexture, o)), Promise.all(l).then(function() {
			let n = new a(s);
			return i.name && (n.name = i.name), fs(n, i), t.associations.set(n, { materials: e }), i.extensions && ds(r, n, i), n;
		});
	}
	createUniqueName(e) {
		let t = se.sanitizeNodeName(e || "");
		return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
	}
	loadGeometries(e) {
		let t = this, n = this.extensions, r = this.primitiveCache;
		function i(e) {
			return n[Eo.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then(function(n) {
				return Ss(n, e, t);
			});
		}
		let a = [];
		for (let n = 0, o = e.length; n < o; n++) {
			let o = e[n], s = hs(o), c = r[s];
			if (c) a.push(c.promise);
			else {
				let e;
				e = o.extensions && o.extensions[Eo.KHR_DRACO_MESH_COMPRESSION] ? i(o) : Ss(new Pe(), o, t), o.mode === ts.TRIANGLE_STRIP ? e = e.then((e) => dn(e, 1)) : o.mode === ts.TRIANGLE_FAN && (e = e.then((e) => dn(e, 2))), r[s] = {
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
			let t = a[e].material === void 0 ? us(this.cache) : this.getDependency("material", a[e].material);
			o.push(t);
		}
		return o.push(t.loadGeometries(a)), Promise.all(o).then(async function(n) {
			let o = n.slice(0, n.length - 1), s = n[n.length - 1], c = [];
			for (let n = 0, l = s.length; n < l; n++) {
				let l = s[n], u = a[n], d, f = o[n];
				if (u.mode === ts.TRIANGLES || u.mode === ts.TRIANGLE_STRIP || u.mode === ts.TRIANGLE_FAN || u.mode === void 0) {
					let e = i.isSkinnedMesh === !0, t = l.hasAttribute("skinIndex") && l.hasAttribute("skinWeight");
					e && t === !1 && console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."), d = e && t ? new Ke(l, f) : new N(l, f), d.isSkinnedMesh === !0 && d.normalizeSkinWeights();
				} else if (u.mode === ts.LINES) d = new ye(l, f);
				else if (u.mode === ts.LINE_STRIP) d = new _e(l, f);
				else if (u.mode === ts.LINE_LOOP) d = new Xe(l, f);
				else if (u.mode === ts.POINTS) d = new rt(l, f);
				else throw Error("THREE.GLTFLoader: Primitive mode unsupported: " + u.mode);
				Object.keys(d.geometry.morphAttributes).length > 0 && ms(d, i), d.name = t.createUniqueName(i.name || "mesh_" + e), fs(d, i), u.extensions && ds(r, d, u), t.assignFinalMaterial(d), c.push(d);
			}
			for (let n = 0, r = c.length; n < r; n++) t.associations.set(c[n], {
				meshes: e,
				primitives: n
			});
			if (c.length === 1) return i.extensions && ds(r, c[0], i), c[0];
			let l = new j();
			i.extensions && ds(r, l, i), t.associations.set(l, { meshes: e });
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
		return n.type === "perspective" ? t = new d(he.radToDeg(r.yfov), r.aspectRatio || 1, r.znear || 1, r.zfar || 2e6) : n.type === "orthographic" && (t = new ee(-r.xmag, r.xmag, r.ymag, -r.ymag, r.znear, r.zfar)), n.name && (t.name = this.createUniqueName(n.name)), fs(t, n), Promise.resolve(t);
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
					let t = new nt();
					n !== null && t.fromArray(n.array, e * 16), a.push(t);
				} else console.warn("THREE.GLTFLoader: Joint \"%s\" could not be found.", t.joints[e]);
			}
			return new y(i, a);
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
			return fs(u, r), u;
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
				e.isSkinnedMesh && e.bind(r, ys);
			});
			for (let e = 0, r = n.length; e < r; e++) t.add(n[e]);
			if (t.userData.pivot !== void 0 && n.length > 0) {
				let e = t.userData.pivot, r = n[0];
				t.pivot = new F().fromArray(e), t.position.x -= e[0], t.position.y -= e[1], t.position.z -= e[2], r.position.set(0, 0, 0), delete t.userData.pivot;
			}
			return t;
		});
	}
	_loadNodeShallow(e) {
		let t = this.json, n = this.extensions, r = this;
		if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
		let i = t.nodes[e], a = i.name ? r.createUniqueName(i.name) : "", o = [], s = r._invokeOne(function(t) {
			return t.createNodeMesh && t.createNodeMesh(e);
		});
		return s && o.push(s), i.camera !== void 0 && o.push(r.getDependency("camera", i.camera).then(function(e) {
			return r._getNodeRef(r.cameraCache, i.camera, e);
		})), r._invokeAll(function(t) {
			return t.createNodeAttachment && t.createNodeAttachment(e);
		}).forEach(function(e) {
			o.push(e);
		}), this.nodeCache[e] = Promise.all(o).then(function(t) {
			let o;
			if (o = i.isBone === !0 ? new ge() : t.length > 1 ? new j() : t.length === 1 ? t[0] : new C(), o !== t[0]) for (let e = 0, n = t.length; e < n; e++) o.add(t[e]);
			if (i.name && (o.userData.name = i.name, o.name = a), fs(o, i), i.extensions && ds(n, o, i), i.matrix !== void 0) {
				let e = new nt();
				e.fromArray(i.matrix), o.applyMatrix4(e);
			} else i.translation !== void 0 && o.position.fromArray(i.translation), i.rotation !== void 0 && o.quaternion.fromArray(i.rotation), i.scale !== void 0 && o.scale.fromArray(i.scale);
			if (!r.associations.has(o)) r.associations.set(o, {});
			else if (i.mesh !== void 0 && r.meshCache.refs[i.mesh] > 1) {
				let e = r.associations.get(o);
				r.associations.set(o, { ...e });
			}
			return r.associations.get(o).nodes = e, o;
		}), this.nodeCache[e];
	}
	loadScene(e) {
		let t = this.extensions, r = this.json.scenes[e], i = this, a = new j();
		r.name && (a.name = i.createUniqueName(r.name)), fs(a, r), r.extensions && ds(t, a, r);
		let o = r.nodes || [], s = [];
		for (let e = 0, t = o.length; e < t; e++) s.push(i.getDependency("node", o[e]));
		return Promise.all(s).then(function(e) {
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				n.parent === null ? a.add(n) : a.add(xo(n));
			}
			return i.associations = ((e) => {
				let t = /* @__PURE__ */ new Map();
				for (let [e, r] of i.associations) (e instanceof Ee || e instanceof n) && t.set(e, r);
				return e.traverse((e) => {
					let n = i.associations.get(e);
					n != null && t.set(e, n);
				}), t;
			})(a), a;
		});
	}
	_createAnimationTracks(e, t, n, r, i) {
		let a = [], o = e.name ? e.name : e.uuid, s = [];
		function c(e) {
			e.morphTargetInfluences && s.push(e.name ? e.name : e.uuid);
		}
		ss[i.path] === ss.weights ? (c(e), e.isGroup && e.children.forEach(c)) : s.push(o);
		let l;
		switch (ss[i.path]) {
			case ss.weights:
				l = Me;
				break;
			case ss.rotation:
				l = oe;
				break;
			case ss.translation:
			case ss.scale:
				l = $e;
				break;
			default: switch (n.itemSize) {
				case 1:
					l = Me;
					break;
				default: l = $e;
			}
		}
		let u = r.interpolation === void 0 ? Be : cs[r.interpolation], d = this._getArrayFromAccessor(n);
		for (let e = 0, n = s.length; e < n; e++) {
			let n = new l(s[e] + "." + ss[i.path], t.array, d, u);
			r.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(n), a.push(n);
		}
		return a;
	}
	_getArrayFromAccessor(e) {
		let t = e.array;
		if (e.normalized) {
			let e = _s(t.constructor), n = new Float32Array(t.length);
			for (let r = 0, i = t.length; r < i; r++) n[r] = t[r] * e;
			t = n;
		}
		return t;
	}
	_createCubicSplineTrackInterpolant(e) {
		e.createInterpolant = function(e) {
			return new (this instanceof oe ? es : Qo)(this.times, this.values, this.getValueSize() / 3, e);
		}, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
	}
};
function xs(e, t, n) {
	let r = t.attributes, i = new Ve();
	if (r.POSITION !== void 0) {
		let e = n.json.accessors[r.POSITION], t = e.min, a = e.max;
		if (t !== void 0 && a !== void 0) {
			if (i.set(new F(t[0], t[1], t[2]), new F(a[0], a[1], a[2])), e.normalized) {
				let t = _s(ns[e.componentType]);
				i.min.multiplyScalar(t), i.max.multiplyScalar(t);
			}
		} else {
			console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			return;
		}
	} else return;
	let a = t.targets;
	if (a !== void 0) {
		let e = new F(), t = new F();
		for (let r = 0, i = a.length; r < i; r++) {
			let i = a[r];
			if (i.POSITION !== void 0) {
				let r = n.json.accessors[i.POSITION], a = r.min, o = r.max;
				if (a !== void 0 && o !== void 0) {
					if (t.setX(Math.max(Math.abs(a[0]), Math.abs(o[0]))), t.setY(Math.max(Math.abs(a[1]), Math.abs(o[1]))), t.setZ(Math.max(Math.abs(a[2]), Math.abs(o[2]))), r.normalized) {
						let e = _s(ns[r.componentType]);
						t.multiplyScalar(e);
					}
					e.max(t);
				} else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			}
		}
		i.expandByVector(e);
	}
	e.boundingBox = i;
	let o = new _();
	i.getCenter(o.center), o.radius = i.min.distanceTo(i.max) / 2, e.boundingSphere = o;
}
function Ss(e, t, n) {
	let r = t.attributes, i = [];
	function a(t, r) {
		return n.getDependency("accessor", t).then(function(t) {
			e.setAttribute(r, t);
		});
	}
	for (let t in r) {
		let n = os[t] || t.toLowerCase();
		n in e.attributes || i.push(a(r[t], n));
	}
	if (t.indices !== void 0 && !e.index) {
		let r = n.getDependency("accessor", t.indices).then(function(t) {
			e.setIndex(t);
		});
		i.push(r);
	}
	return pe.workingColorSpace !== "srgb-linear" && "COLOR_0" in r && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${pe.workingColorSpace}" not supported.`), fs(e, t), xs(e, t, n), Promise.all(i).then(function() {
		return t.targets === void 0 ? e : ps(e, t.targets, n);
	});
}
//#endregion
//#region ember3d/buildkit.js
function Cs(e) {
	let t = e >>> 0;
	return () => {
		t |= 0, t = t + 1831565813 | 0;
		let e = Math.imul(t ^ t >>> 15, 1 | t);
		return e = e + Math.imul(e ^ e >>> 7, 61 | e) ^ e, ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
var ws = (e) => [
	parseInt(e.slice(1, 3), 16),
	parseInt(e.slice(3, 5), 16),
	parseInt(e.slice(5, 7), 16)
], Ts = (e, t) => e.map((e) => Math.max(0, Math.min(255, Math.round(e * t)))), Es = (e) => `rgb(${e[0]},${e[1]},${e[2]})`, Ds = .5, Os = /* @__PURE__ */ new Map();
function ks(e, t, n = 1, r) {
	let i = e + t + n + (r || "");
	if (Os.has(i)) return Os.get(i);
	let a = document.createElement("canvas");
	a.width = a.height = 64;
	let s = a.getContext("2d"), c = Cs(n * 977 + e.length), l = ws(t), u = r ? ws(r) : Ts(l, .62);
	s.fillStyle = Es(l), s.fillRect(0, 0, 64, 64);
	let d = (e, t, n, r, i) => {
		s.fillStyle = Es(e), s.fillRect(t, n, r, i);
	};
	if (e === "ashlar" || e === "rubble" || e === "field") {
		let t = e === "ashlar" ? 11 : e === "rubble" ? 8 : 9;
		for (let n = 0; n < 64; n += t) {
			let r = -(n / t % 2) * (e === "ashlar" ? 11 : 6) - c() * 4;
			for (; r < 64;) {
				let i = e === "ashlar" ? 22 : 8 + c() * 14, a = .86 + c() * .26;
				d(Ts(l, a), r + 1, n + 1, i - 1, t - 1), d(Ts(l, a * 1.12), r + 1, n + 1, i - 1, 1), r += i;
			}
			d(u, 0, n, 64, 1);
		}
	} else if (e === "plaster") {
		for (let e = 0; e < 26; e++) d(Ts(l, .9 + c() * .16), c() * 64, c() * 64, 4 + c() * 14, 3 + c() * 8);
		for (let e = 0; e < 6; e++) d(Ts(l, .8), c() * 64, 58 - c() * 10, 2 + c() * 6, 10);
	} else if (e === "planks") for (let e = 0; e < 64; e += 8) d(Ts(l, .85 + c() * .25), e, 0, 7, 64), d(u, e + 7, 0, 1, 64), c() < .5 && d(Ts(l, .7), e + 3, c() * 64, 1, 3);
	else if (e === "slate" || e === "lead") {
		let t = e === "slate" ? 6 : 16;
		for (let n = 0; n < 64; n += t) {
			let r = n / t % 2 * 5;
			for (; r < 74; r += e === "slate" ? 10 : 16) d(Ts(l, .82 + c() * .28), r, n, e === "slate" ? 9 : 15, t - 1);
			d(u, 0, n + t - 1, 64, 1);
		}
	} else if (e === "thatch") {
		for (let e = 0; e < 64; e += 10) d(Ts(l, .7), 0, e + 9, 64, 1);
		for (let e = 0; e < 260; e++) {
			let e = c() * 64, t = c() * 64;
			d(Ts(l, .78 + c() * .4), e, t, 1, 3 + c() * 5);
		}
	} else if (e === "tile") for (let e = 0; e < 64; e += 8) {
		let t = e / 8 % 2 * 5 - 2;
		for (; t < 74; t += 10) {
			let n = .66 + c() * .56;
			d(Ts(l, n), t, e, 9, 7), d(Ts(l, n * 1.22), t + 1, e + 5, 7, 2), d(Ts(l, n * .8), t, e, 1, 7);
		}
		d(u, 0, e + 7, 64, 1);
	}
	else if (e === "shingle") for (let e = 0; e < 64; e += 8) {
		let t = e / 8 % 2 * 4;
		for (; t < 64; t += 8) d(Ts(l, .8 + c() * .3), t, e, 7, 7);
		d(u, 0, e + 7, 64, 1);
	}
	else if (e === "palisade") for (let e = 0; e < 64; e += 10) d(Ts(l, .85 + c() * .2), e, 0, 9, 64), d(Ts(l, 1.12), e + 1, 0, 2, 64), d(u, e + 9, 0, 1, 64);
	let f = new we(a);
	return f.magFilter = D, f.minFilter = D, f.wrapS = f.wrapT = T, f.colorSpace = o, Os.set(i, f), f;
}
var z = (e, t) => new l({
	map: e || null,
	color: t ? new P(t) : 16777215
});
function B(e, t, n, r, i = 0, a = 0, o = 0, s) {
	let c = new I(e, t, n), l = c.attributes.uv, u = [
		[n, t],
		[n, t],
		[e, n],
		[e, n],
		[e, t],
		[e, t]
	];
	for (let e = 0; e < 6; e++) for (let t = 0; t < 4; t++) {
		let n = e * 4 + t;
		l.setXY(n, l.getX(n) * u[e][0] / Ds, l.getY(n) * u[e][1] / Ds);
	}
	let d = new N(c, r);
	return d.position.set(i, a + t / 2, o), s && s.add(d), d;
}
function As(e, t, n, r, i, a, o, s = .08, c = .05) {
	let l = t / 2 + s, u = n / 2 + s, d = [], f = [], p = [], m = Math.hypot(u, i), h = (e, t, n, r, i, a) => {
		let o = d.length / 3;
		d.push(...e, ...t, ...n, ...r), f.push(0, 0, i, 0, i, a, 0, a), p.push(o, o + 1, o + 2, o, o + 2, o + 3);
	};
	h([
		-l,
		r,
		u
	], [
		l,
		r,
		u
	], [
		l,
		r + i,
		0
	], [
		-l,
		r + i,
		0
	], 2 * l / Ds, m / Ds), h([
		l,
		r,
		-u
	], [
		-l,
		r,
		-u
	], [
		-l,
		r + i,
		0
	], [
		l,
		r + i,
		0
	], 2 * l / Ds, m / Ds), h([
		-l,
		r - c,
		u
	], [
		l,
		r - c,
		u
	], [
		l,
		r,
		u
	], [
		-l,
		r,
		u
	], 2 * l / Ds, .1), h([
		l,
		r - c,
		-u
	], [
		-l,
		r - c,
		-u
	], [
		-l,
		r,
		-u
	], [
		l,
		r,
		-u
	], 2 * l / Ds, .1);
	let g = new Pe();
	g.setAttribute("position", new k(d, 3)), g.setAttribute("uv", new k(f, 2)), g.setIndex(p), g.computeVertexNormals();
	let _ = new N(g, a);
	_.material.side = 2, e.add(_);
	let v = [], y = [];
	for (let e of [-1, 1]) {
		let a = t / 2 * e;
		v.push(a, r, -n / 2, a, r, n / 2, a, r + n / 2 * i / u, 0), y.push(0, 0, n / Ds, 0, n / 2 / Ds, i / Ds);
	}
	let b = new Pe();
	b.setAttribute("position", new k(v, 3)), b.setAttribute("uv", new k(y, 2)), b.computeVertexNormals();
	let x = new N(b, o.clone());
	return x.material.side = 2, e.add(x), _;
}
function js(e, t, n, r, i, a = 4, o = .08) {
	let s = new N(new R((t / 2 + o) * (a === 4 ? Math.SQRT2 : 1), r, a, 1), i);
	return s.position.y = n + r / 2, a === 4 && (s.rotation.y = Math.PI / 4), e.add(s), s;
}
function Ms(e, t, n, r, i, a = .12, o = .16, s = {}) {
	let { wallW: c, wallD: l } = n, u = .025, d = (t, a) => {
		n.side === "z" ? t.position.set(r, i, l / 2 + a) : (t.position.set(c / 2 + a, i, r), t.rotation.y = Math.PI / 2), e.add(t);
	};
	d(new N(new I(a + .04, o + .04, u), t.m.trim), .004);
	let f = s.lit ?? t.rnd() < .65, p = new N(new I(a, o, u), f ? t.m.glass : t.m.dark);
	if (p.userData.glow = f, d(p, .012), d(new N(new I(.014, o, u), t.m.trim), .02), s.pointed) {
		let e = new N(new R(a / 2 + .02, .09, 4, 1), t.m.trim);
		e.rotation.z = 0, e.scale.z = .25, d(e, .004), e.position.y = i + o / 2 + .045, e.rotation.y += Math.PI / 4;
	}
	if (s.flowers && Rs(e, t, d, n, r, i - o / 2 - .03, a), s.shutters) for (let e of [-1, 1]) {
		let r = new N(new I(a * .5, o + .02, u), t.m.shutter);
		d(r, .01), n.side === "z" ? r.position.x += a * .78 * e : r.position.z += a * .78 * e;
	}
}
var Ns = [
	"#9a3a50",
	"#c8c0c8",
	"#b89040",
	"#7a5098",
	"#a85a34"
], Ps = [
	"#2e4420",
	"#3a5226",
	"#46602a"
], Fs = /* @__PURE__ */ new Map(), Is = (e) => (Fs.has(e) || Fs.set(e, rc(e)), Fs.get(e));
function Ls(e) {
	return e.userData.dress = !0, e;
}
function Rs(e, t, n, r, i, a, o) {
	let s = t.frnd, c = (e, t) => {
		r.side === "z" ? e.position.x += t : e.position.z += t;
	}, l = Ls(new N(new I(o + .05, .035, .045), t.m.wood));
	n(l, .03), l.position.y = a;
	let u = Ns[s() * Ns.length | 0];
	for (let e = 0; e < 7; e++) {
		let t = -o / 2 - .01 + (o + .02) * (e + .5) / 7, r = Ls(new N(new v(.026 + s() * .01, 0), Is(Ps[s() * 3 | 0])));
		if (n(r, .04 + s() * .012), r.position.y = a + .026, c(r, t), s() < .5) {
			let e = Ls(new N(new v(.02, 0), Is(Ps[s() * 3 | 0])));
			n(e, .055), e.position.y = a - .03 - s() * .03, c(e, t);
		}
		let i = Ls(new N(new v(.019 + s() * .007, 0), Is(s() < .7 ? u : Ns[s() * Ns.length | 0])));
		n(i, .05 + s() * .015), i.position.y = a + .045 + s() * .02, c(i, t + (s() - .5) * .02);
	}
}
function zs(e, t, n, r, i) {
	let a = t.frnd, o = (n.side === "z" ? n.wallD : n.wallW) / 2;
	for (let t = 0, s = 26 + (a() * 10 | 0); t < s; t++) {
		let c = t / s, l = c * i, u = .12 * (1 - c * .6), d = r + (a() - .5) * u * 2, f = Ls(new N(new v(.045 * (1 - c * .4) + a() * .012, 0), Is(Ps[a() * 3 | 0])));
		n.side === "z" ? f.position.set(d, l + .02, o + .012) : f.position.set(o + .012, l + .02, d), f.scale.set(n.side === "z" ? 1 : .45, 1, n.side === "z" ? .45 : 1), e.add(f);
	}
}
function Bs(e, t, n, r, i = .2, a = .42, o = !0) {
	let s = .03, c = new N(new I(i, a, s), t.m.door), l = new N(new I(i + .05, a + .04, s * .8), t.m.trim);
	for (let [t, i] of [[l, .004], [c, .014]]) n.side === "z" ? t.position.set(r, a / 2, n.wallD / 2 + i) : (t.position.set(n.wallW / 2 + i, a / 2, r), t.rotation.y = Math.PI / 2), e.add(t);
	if (o) {
		let o = new N(new A(i / 2 + .025, i / 2 + .025, s * .8, 10, 1, !1, 0, Math.PI), t.m.trim);
		o.rotation.x = Math.PI / 2, o.rotation.z = Math.PI / 2, n.side === "z" ? (o.position.set(r, a, n.wallD / 2 + .004), o.rotation.set(Math.PI / 2, 0, Math.PI / 2)) : (o.position.set(n.wallW / 2 + .004, a, r), o.rotation.set(0, 0, 0), o.rotation.x = Math.PI / 2, o.rotation.y = Math.PI / 2, o.rotation.z = 0), e.add(o);
	}
}
function Vs(e, t, n, r, i, a = 3, o = !0) {
	let s = n.side === "z" ? n.wallW : n.wallD, c = (n.side === "z" ? n.wallD : n.wallW) / 2 + .012, l = (r, i, a, o, s = 0) => {
		let l = new N(new I(r, i, .03), t.m.beam);
		n.side === "z" ? (l.position.set(a, o, c), l.rotation.z = s) : (l.position.set(c, o, a), l.rotation.y = Math.PI / 2, l.rotation.x = -s, l.rotation.order = "YXZ", l.rotation.set(0, Math.PI / 2, 0), l.rotateZ(s)), e.add(l);
	};
	for (let e = 0; e <= a; e++) l(.04, i - r, -s / 2 + s * e / a, (r + i) / 2);
	if (l(s + .02, .04, 0, r + .02), l(s + .02, .04, 0, i - .02), l(s, .035, 0, (r + i) / 2), o) for (let e = 0; e < a; e += 2) {
		let t = s / a;
		l(.035, Math.hypot(t, (i - r) / 2), -s / 2 + t * (e + .5), r + (i - r) * .25, Math.atan2(t, (i - r) / 2) * (e % 4 ? 1 : -1));
	}
}
function Hs(e, t, n, r, i, a) {
	B(.1, a, .1, t.m.stone, n, i, r, e), B(.13, .03, .13, t.m.stoneDark, n, i + a, r, e);
}
function Us(e, t, n, r, i, a = t.m.stone, o = .07) {
	let s = o * 2;
	for (let t = -n / 2 + o / 2; t <= n / 2; t += s) for (let n of [-r / 2 + o / 2, r / 2 - o / 2]) B(o, o, o, a, t, i, n, e);
	for (let t = -r / 2 + o / 2 + s; t <= r / 2 - s; t += s) for (let r of [-n / 2 + o / 2, n / 2 - o / 2]) B(o, o, o, a, r, i, t, e);
}
function Ws(e, t, n, r, i, a = "z", o = .3) {
	let s = new N(new I(.1, o, .012), t.m.banner);
	a === "z" ? s.position.set(n, r - o / 2, i) : (s.position.set(n, r - o / 2, i), s.rotation.y = Math.PI / 2), e.add(s);
	let c = new N(new I(.14, .015, .015), t.m.trim);
	c.position.set(s.position.x, r, s.position.z), c.rotation.y = s.rotation.y, e.add(c);
}
function Gs(e, t, n, r, i) {
	let a = new N(new I(.02, .02, .16), t.m.trim);
	a.position.set(n, r, i + .08), e.add(a);
	let o = new N(new I(.02, .1, .12), t.m.signboard);
	o.position.set(n, r - .07, i + .12), e.add(o);
}
function Ks(e, t, n, r) {
	let i = new N(new A(.05, .05, .12, 8), t.m.wood);
	i.position.set(n, .06, r), e.add(i);
	let a = new N(new A(.052, .052, .012, 8), t.m.trim);
	a.position.set(n, .09, r), e.add(a);
}
function qs(e, t, n, r, i = .09) {
	let a = new N(new A(i, i * 1.1, i * 1.3, 8), t.m.hay);
	a.position.set(n, i * .65, r), e.add(a);
	let o = new N(new R(i * 1.05, i * .7, 8), t.m.hay);
	o.position.set(n, i * 1.3 + i * .35, r), e.add(o);
}
function Js(e, t, n, r, i, a) {
	let o = Math.hypot(i - n, a - r), s = Math.max(2, Math.round(o / .14)), c = Math.atan2(i - n, a - r);
	for (let o = 0; o <= s; o++) {
		let c = o / s;
		B(.025, .14, .025, t.m.wood, n + (i - n) * c, 0, r + (a - r) * c, e);
	}
	for (let s of [.05, .11]) {
		let l = new N(new I(.015, .02, o), t.m.wood);
		l.position.set((n + i) / 2, s, (r + a) / 2), l.rotation.y = c, e.add(l);
	}
}
var Ys = {
	A: {
		key: "A",
		name: "Timber & Slate",
		lower: ["field", "#6c665c"],
		upper: ["plaster", "#cdbf9f"],
		roof: ["slate", "#434856"],
		roofRise: 1.05,
		wood: "#3a2c22",
		beam: "#2c2019",
		door: "#4a3526",
		trim: "#2a221d",
		banner: "#6b2226",
		hay: "#8a7a4c",
		signboard: "#5a4432",
		jetty: .04,
		timber: !0
	},
	B: {
		key: "B",
		name: "Thatch & Rubble",
		lower: ["rubble", "#736955"],
		upper: ["plaster", "#a08c66"],
		roof: ["thatch", "#8a7446"],
		roofRise: .95,
		wood: "#4a3a2a",
		beam: "#3a2d22",
		door: "#503c2a",
		trim: "#33271e",
		banner: "#5a3a24",
		hay: "#8c7a48",
		signboard: "#5a4432",
		jetty: 0,
		timber: !1,
		thatch: !0
	},
	C: {
		key: "C",
		name: "Gothic Stone",
		lower: ["ashlar", "#4f4c58"],
		upper: ["ashlar", "#4f4c58"],
		roof: ["lead", "#2a2b33"],
		roofRise: 1.6,
		wood: "#34282a",
		beam: "#26201f",
		door: "#3a2a26",
		trim: "#1f1b20",
		banner: "#6e1c22",
		hay: "#7c6d45",
		signboard: "#4a3a33",
		jetty: 0,
		timber: !1,
		gothic: !0
	}
}, Xs = {
	roofRise: 1.05,
	jetty: .04,
	timber: !0
};
Object.assign(Ys, {
	vale: {
		...Ys.A,
		key: "vale",
		roof: ["tile", "#434856"],
		dress: !0
	},
	fens: {
		...Xs,
		key: "fens",
		lower: ["rubble", "#5b5f57"],
		upper: ["plaster", "#98a089"],
		roof: ["slate", "#363d36"],
		wood: "#35302a",
		beam: "#26231f",
		door: "#3d3a30",
		trim: "#1f201c",
		banner: "#3b5a4a",
		hay: "#6f6a46",
		signboard: "#4a463a"
	},
	reach: {
		...Xs,
		key: "reach",
		lower: ["field", "#4c4542"],
		upper: ["plaster", "#8c7d70"],
		roof: ["slate", "#5e3024"],
		wood: "#2a211d",
		beam: "#1b1613",
		door: "#3a2820",
		trim: "#191412",
		banner: "#7c2c18",
		hay: "#7a6a44",
		signboard: "#4a3226"
	},
	heights: {
		...Xs,
		key: "heights",
		lower: ["ashlar", "#8a8984"],
		upper: ["plaster", "#c9c7bf"],
		roof: ["slate", "#48536a"],
		wood: "#4a4038",
		beam: "#38312c",
		door: "#4a3e34",
		trim: "#28282c",
		banner: "#2c4a70",
		hay: "#8a8060",
		signboard: "#4a4a52"
	}
});
function Zs(e, t = 1) {
	let n = Ys[e], r = new j(), i = {
		lower: z(ks(n.lower[0], n.lower[1], t)),
		upper: z(ks(n.upper[0], n.upper[1], t + 1)),
		roof: z(ks(n.roof[0], n.roof[1], t + 2)),
		stone: z(ks(n.lower[0] === "ashlar" ? "ashlar" : "field", n.lower[1], t + 3)),
		stoneDark: z(null, Ts(ws(n.lower[1]), .6).reduce((e, t) => e + t.toString(16).padStart(2, "0"), "#")),
		wood: z(ks("planks", n.wood, t + 4)),
		beam: z(null, n.beam),
		door: z(ks("planks", n.door, t + 5)),
		trim: z(null, n.trim),
		glass: z(null, "#e0a050"),
		dark: z(null, "#1c1a22"),
		paper: z(null, "#b8ad92"),
		banner: z(null, n.banner),
		hay: z(ks("thatch", n.hay, t + 6)),
		signboard: z(null, n.signboard),
		palisade: z(ks("palisade", n.wood, t + 7)),
		shutter: z(ks("planks", n.shutter || n.wood, t + 9)),
		ashlar: z(ks("ashlar", n.lower[1], t + 8))
	};
	return {
		S: {
			...n,
			m: i,
			rnd: Cs(t * 31 + 7),
			frnd: Cs(t * 57 + 3)
		},
		g: r
	};
}
function Qs(e, t, n, r, i, a, o, s, c = {}) {
	let l = B(n, a, r, o, 0, i, 0, t), u = {
		side: "z",
		wallW: n,
		wallD: r
	}, d = {
		side: "x",
		wallW: n,
		wallD: r
	};
	if (s) {
		let o = Math.max(1, Math.round(n / .32)), s = Math.max(1, Math.round(r / .32));
		for (let r = 0; r < o; r++) {
			let s = -n / 2 + n * (r + .5) / o;
			c.doorZ !== void 0 && Math.abs(s - c.doorZ) < .16 || Ms(t, e, u, s, i + a * .55, .11, .15, {
				pointed: e.gothic,
				shutters: !e.gothic && !e.thatch && r % 2 == 0,
				flowers: e.dress && e.frnd() < .45
			});
		}
		for (let n = 0; n < s; n++) Ms(t, e, d, -r / 2 + r * (n + .5) / s, i + a * .55, .11, .15, {
			pointed: e.gothic,
			flowers: e.dress && e.frnd() < .45
		});
		let l = new j();
		l.rotation.y = Math.PI, t.add(l);
		for (let t = 0; t < o; t++) Ms(l, e, u, -n / 2 + n * (t + .5) / o, i + a * .55, .11, .15, { pointed: e.gothic });
		for (let t = 0; t < s; t++) Ms(l, e, d, -r / 2 + r * (t + .5) / s, i + a * .55, .11, .15, { pointed: e.gothic });
	}
	if (e.dress && i < .01) for (let [i, o] of [[u, n], [d, r]]) e.frnd() < .5 && zs(t, e, i, (e.frnd() < .5 ? -1 : 1) * (o / 2 - .07), a * (.6 + e.frnd() * .5));
	if (c.timber && e.timber) {
		Vs(t, e, u, i, i + a, Math.max(2, Math.round(n / .25))), Vs(t, e, d, i, i + a, Math.max(2, Math.round(r / .25)));
		let o = new j();
		o.rotation.y = Math.PI, t.add(o), Vs(o, e, u, i, i + a, Math.max(2, Math.round(n / .25))), Vs(o, e, d, i, i + a, Math.max(2, Math.round(r / .25)));
	}
	return l;
}
function $s(e, t, n, r, i, a, o = !0) {
	let s = new j();
	t.add(s), o || (s.rotation.y = Math.PI / 2);
	let [c, l] = o ? [n, r] : [r, n];
	if (As(s, c, l, i, a * l / 2, e.m.roof, e.m.upper, e.thatch ? .1 : .07, e.thatch ? .09 : .04), e.thatch) {
		let t = new N(new A(.06, .06, c + .2, 8), e.m.roof);
		t.rotation.z = Math.PI / 2, t.position.y = i + a * l / 2 + .01, s.add(t);
	}
	if (e.gothic) for (let t of [-1, 1]) {
		let n = new N(new R(.025, .14, 4), e.m.trim);
		n.position.set(t * c / 2, i + a * l / 2 + .06, 0), s.add(n);
	}
	return e.key === "heights" && (Tc(s, c, l, i, a, e.m.upper), t.userData.snowed = !0), s;
}
function ec(e, t, n, r, i, a = .06) {
	let o = new R((t / 2 + a) * Math.SQRT2, r, 4, 1);
	o.rotateY(Math.PI / 4);
	let s = new N(o, i);
	return s.position.y = n + r / 2, e.add(s), s;
}
function tc(e, t, n, r, i) {
	for (let a = 0; a <= 2; a++) {
		let o = -n / 2 + n * a / 2;
		B(.07, i * .75, .1, e.m.stone, o, 0, r / 2 + .04, t);
	}
	for (let a = 1; a <= 1; a++) B(.1, i * .75, .07, e.m.stone, n / 2 + .04, 0, -r / 2 + r * a / 2, t);
}
var nc = {
	house(e, t, n) {
		let r = .72, i = .58, a = .52, o = e.timber && (e.key === "vale" || e.key === "fens");
		o && B(.75, .1, .61, e.m.stone, 0, 0, 0, t), Qs(e, t, r, i, 0, a, o ? e.m.upper : e.m.lower, !0, {
			doorZ: -.12,
			timber: o
		}), Bs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, -.12, .17, .36, !e.timber), $s(e, t, r, i, a, e.roofRise * 1.1), Hs(t, e, r / 2 - .12, -.58 / 4, a, .32 + e.roofRise * .2), Dc(e, t, r, i, a, e.roofRise * 1.1, n), e.gothic && tc(e, t, r, i, a);
	},
	tavern(e, t, n) {
		let r = .7, i = .55;
		Qs(e, t, 1, r, 0, i, e.m.lower, !0, { doorZ: .05 }), Bs(t, e, {
			side: "z",
			wallW: 1,
			wallD: r
		}, .05, .22, .4, !0);
		let a = e.jetty;
		Qs(e, t, 1 + a * 2, r + a * 2, i, .48, e.thatch ? e.m.lower : e.m.upper, !0, { timber: !0 }), $s(e, t, 1 + a * 2, r + a * 2, 1.03, e.roofRise);
		let o = new j();
		o.position.set(-.3, 0, -.55), t.add(o), Qs(e, o, .5, .45, 0, .5, e.m.lower, !1), $s(e, o, .5, .45, .5, e.roofRise, !1), Hs(t, e, .34, -.12, 1.03, .45), Hs(t, e, -.38, .1, 1.03, .4), Gs(t, e, .32, .5, r / 2), Ks(t, e, .62, .3), Ks(t, e, .62, .16);
		let s = new j();
		s.position.set(.12, 0, .52), t.add(s);
		for (let t of [-.26, .4]) B(.035, .42, .035, e.m.beam, t, 0, .14, s);
		let c = B(.76, .03, .36, e.m.roof, .07, .43, 0, s);
		c.rotation.x = .3;
		for (let t of [-.12, .26]) {
			B(.16, .02, .1, e.m.wood, t, .1, .05, s);
			for (let n of [-.06, .06]) B(.018, .1, .018, e.m.beam, t + n, 0, .05, s);
			B(.16, .015, .035, e.m.wood, t, .06, .12, s);
		}
		pc(s, e, -.26, .38, .17), pc(s, e, .4, .38, .17);
		let l = new j();
		l.position.set(-.46, 0, .44999999999999996), t.add(l);
		for (let t of [-1, 1]) B(.025, .34, .025, e.m.beam, t * .13, 0, 0, l);
		B(.3, .18, .025, e.m.wood, 0, .14, 0, l), B(.34, .03, .06, e.m.roof, 0, .33, 0, l);
		for (let [t, n] of [
			[-.08, .26],
			[.02, .2],
			[.09, .25],
			[-.03, .16],
			[.08, .16]
		]) B(.05, .06, .03, e.m.paper, t, n, .004, l);
		e.gothic && tc(e, t, 1, r, i);
	},
	inn(e, t, n) {
		let r = 1.2, i = .66, a = [.54, .48], o = 0;
		a.forEach((n, a) => {
			Qs(e, t, r + (a ? e.jetty * 2 : 0), i + (a ? e.jetty * 2 : 0), o, n, a ? e.thatch ? e.m.lower : e.m.upper : e.m.lower, !0, {
				doorZ: .3,
				timber: a > 0
			}), o += n;
		}), Bs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, .3, .24, .42, !0), $s(e, t, r + e.jetty * 2, i + e.jetty * 2, o, e.roofRise);
		for (let n of [-.3, .3]) {
			let r = new j();
			r.position.set(n, o + .05, i / 4), t.add(r), Qs(e, r, .2, .2, 0, .16, e.m.upper, !1), Ms(r, e, {
				side: "z",
				wallW: .2,
				wallD: .2
			}, 0, .09, .09, .1), $s(e, r, .2, .22, .16, e.roofRise, !1);
		}
		Hs(t, e, -.5, 0, o, .42), Hs(t, e, .52, -.1, o, .38);
		let s = new j();
		s.position.set(.82, 0, .05), t.add(s);
		for (let [t, n] of [
			[-.18, .28],
			[.18, .28],
			[.18, -.25]
		]) B(.04, .4, .04, e.m.beam, t, 0, n, s);
		let c = B(.46, .04, .62, e.m.roof, 0, .42, 0, s);
		c.rotation.x = 0, c.rotation.z = -.25, qs(s, e, .05, .05, .08), Gs(t, e, -.2, .52, i / 2);
	},
	shop(e, t, n) {
		let r = .62, i = .62, a = .56;
		Qs(e, t, r, i, 0, a, e.m.lower, !1), Bs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, -.16, .17, .36, !1), Ms(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, .12, .26, .2, .14), Ms(t, e, {
			side: "x",
			wallW: r,
			wallD: i
		}, 0, .3, .16, .14), e.timber && (Vs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, .38, a, 3, !1), Vs(t, e, {
			side: "x",
			wallW: r,
			wallD: i
		}, .38, a, 3, !1)), $s(e, t, .66, .66, a, e.roofRise * 1.15, !1);
		let o = B(.36, .02, .2, e.m.banner, .1, .44, .41000000000000003, t);
		o.rotation.x = .35, B(.34, .12, .12, e.m.wood, .1, 0, .41000000000000003, t);
		for (let n = 0; n < 4; n++) B(.05, .04, .05, n % 2 ? e.m.hay : e.m.banner, -.02 + n * .08, .12, .41000000000000003, t);
		Ks(t, e, .38, .3), Hs(t, e, -.2, -.2, a, .42), hc(t, e, .12, .1, .12, .41000000000000003, .18), hc(t, e, .1, .08, .1, .43, .05, !0), gc(t, e, .51, .3), Gs(t, e, -.2, .46, i / 2);
	},
	temple(e, t, n) {
		let r = .72, i = 1.25, a = e.gothic ? .98 : .86, o = e.m.ashlar, s = {
			side: "z",
			wallW: r,
			wallD: i
		}, c = {
			side: "x",
			wallW: r,
			wallD: i
		};
		B(r, a, i, o, 0, 0, 0, t), B(.78, .06, 1.31, e.m.stoneDark, 0, 0, 0, t), B(.38, .035, .14, e.m.stoneDark, .06, 0, .6950000000000001, t), B(.32, .035, .08, e.m.stoneDark, .06, .035, .665, t), Bs(t, e, s, .06, .26, .5, !0);
		let l = new N(new A(.115, .115, .02, 14), e.m.trim);
		l.rotation.x = Math.PI / 2, l.position.set(.06, a * .8, .631), t.add(l);
		let u = new N(new A(.09, .09, .02, 14), e.m.glass);
		u.userData.glow = !0, u.rotation.x = Math.PI / 2, u.position.set(.06, a * .8, .639), t.add(u);
		for (let n of [
			0,
			1,
			2
		]) {
			let r = B(.012, .18, .01, e.m.trim, .06, a * .8 - .09, .649, t);
			r.rotation.z = n * Math.PI / 3;
		}
		B(.08, a * .85, .08, o, r / 2 - .02, 0, .645, t);
		for (let n = 0; n < 3; n++) Ms(t, e, c, -1.25 / 2 + i * (n + .5) / 3, a * .5, .09, .34, {
			pointed: !0,
			lit: !0
		});
		for (let e = 0; e <= 3; e++) B(.09, a * .8, .08, o, .40499999999999997, 0, -1.25 / 2 + i * e / 3, t);
		let d = new j();
		d.rotation.y = Math.PI, t.add(d);
		for (let t = 0; t < 3; t++) Ms(d, e, c, -1.25 / 2 + i * (t + .5) / 3, a * .5, .09, .34, {
			pointed: !0,
			lit: !0
		});
		$s(e, t, r, i, a, e.roofRise * 1.2, !1);
		let f = .34, p = a + .6, m = new j();
		m.position.set(-.45, 0, .475), t.add(m);
		let h = new A(f * .56, f * .6, p, 16, 1), g = h.attributes.uv;
		for (let e = 0; e < g.count; e++) g.setXY(e, g.getX(e) * (Math.PI * f * 1.16) / Ds, g.getY(e) * p / Ds);
		let _ = new N(h, o);
		_.position.y = p / 2, m.add(_);
		let v = new N(new A(f * .62, f * .62, .05, 16), e.m.stoneDark);
		v.position.y = p - .31, m.add(v);
		let y = {
			side: "z",
			wallW: f,
			wallD: f
		}, b = {
			side: "x",
			wallW: f,
			wallD: f
		};
		Ms(m, e, y, 0, a * .45, .08, .2, {
			pointed: !0,
			lit: !0
		});
		for (let t of [y, b]) Ms(m, e, t, 0, p - .17, .12, .2, {
			pointed: !0,
			lit: !1
		});
		{
			let t = new R(f * .68, e.gothic ? .9 : .72, 16, 1, !0), n = t.attributes.uv;
			for (let e = 0; e < n.count; e++) n.setXY(e, n.getX(e) * (Math.PI * f * 1.3) / Ds, n.getY(e) * .9 / Ds);
			let r = e.m.roof.clone();
			r.side = 2;
			let i = new N(t, r);
			i.position.y = p + (e.gothic ? .45 : .36), m.add(i);
		}
		let x = new j();
		x.position.set(0, p + (e.gothic ? .9 : .72) + .01, 0), m.add(x), B(.02, .16, .02, e.m.trim, 0, 0, 0, x), B(.09, .02, .02, e.m.trim, 0, .1, 0, x), pc(t, e, -.16, .36, .675), pc(t, e, .28, .36, .675);
	},
	smith(e, t, n) {
		let r = .78, i = .6, a = .46, o = e.m.stone;
		B(r, a, .08, o, 0, 0, -.26, t), B(.08, a, i, o, -.78 / 2 + .04, 0, 0, t), B(.08, a * .5, i * .55, o, r / 2 - .04, 0, -.12, t);
		for (let [n, o] of [
			[r / 2 - .03, i / 2 - .03],
			[-.36, i / 2 - .03],
			[r / 2 - .03, -.02]
		]) B(.06, a, .06, e.m.beam, n, 0, o, t);
		B(r, .05, .06, e.m.beam, 0, .41000000000000003, i / 2 - .03, t), $s(e, t, .9, .72, a, e.roofRise * .85), B(.28, .17, .26, o, -.2, 0, -.06, t);
		let s = B(.22, .025, .2, e.m.glass, -.2, .17, -.06, t);
		s.userData.glow = !0;
		let c = B(.16, .08, .012, e.m.glass, -.2, .04, .075, t);
		c.userData.glow = !0, B(.24, .14, .16, o, -.2, .3, -.16, t), Hs(t, e, -.2, -.2, a, .62), B(.06, .09, .06, e.m.wood, .12, 0, .1, t), B(.14, .05, .06, e.m.dark, .12, .09, .1, t), B(.05, .03, .04, e.m.dark, .2, .1, .1, t), B(.22, .08, .09, e.m.wood, .2, 0, -.16, t), B(.19, .012, .06, z(null, "#1d3040"), .2, .08, -.16, t);
		let l = new j();
		l.position.set(.51, 0, .12), t.add(l);
		for (let t of [-.12, .12]) B(.025, .3, .025, e.m.beam, 0, 0, t, l);
		B(.025, .025, .28, e.m.beam, 0, .26, 0, l);
		for (let t = 0; t < 4; t++) B(.012, .22, .03, e.m.trim, .02, .04, -.09 + t * .06, l);
		Gs(t, e, r / 2 - .05, .4, i / 2);
	},
	keep(e, t, n) {
		if (e.thatch) {
			let n = new N(new A(.55, .85, .3, 10), z(ks("rubble", "#5a5040", 9)));
			n.position.y = .15, t.add(n);
			let r = new j();
			r.position.y = .3, t.add(r), B(.6, .9, .6, e.m.palisade, 0, 0, 0, r), B(.72, .2, .72, e.m.wood, 0, .9, 0, r), Ms(r, e, {
				side: "z",
				wallW: .72,
				wallD: .72
			}, 0, 1, .1, .08), Ms(r, e, {
				side: "x",
				wallW: .72,
				wallD: .72
			}, 0, 1, .1, .08), js(r, .72, 1.1, .5, e.m.roof);
			for (let n = 0; n < 18; n++) {
				let r = n / 18 * Math.PI * 2;
				n !== 2 && (B(.07, .36, .07, e.m.palisade, Math.cos(r) * .95, 0, Math.sin(r) * .95, t).rotation.y = -r);
			}
			Ws(t, e, .05, 1.95, 0);
			return;
		}
		let r = .95, i = e.gothic ? 1.9 : 1.6;
		B(r, i, r, e.m.stone, 0, 0, 0, t), B(1.03, .06, 1.03, e.m.stoneDark, 0, i, 0, t), Us(t, e, 1.01, 1.01, i + .06, e.m.stone, .08);
		let a = {
			side: "z",
			wallW: r,
			wallD: r
		}, o = {
			side: "x",
			wallW: r,
			wallD: r
		};
		Bs(t, e, a, 0, .24, .44, !0);
		for (let n of [.75, 1.2]) for (let r of [-.25, .25]) Ms(t, e, a, r, n, .07, .14, { pointed: e.gothic }), Ms(t, e, o, r, n, .07, .14, { pointed: e.gothic });
		for (let [n, a] of [
			[-1, -1],
			[1, -1],
			[-1, 1],
			[1, 1]
		]) {
			let o = new N(new A(.14, .15, i + .3, 10), e.m.stone);
			o.position.set(n * r / 2, (i + .3) / 2, a * r / 2), t.add(o), js(t, .3, i + .3, e.gothic ? .6 : .4, e.m.roof, 10, .02).position.set(n * r / 2, i + .3 + (e.gothic ? .3 : .2), a * r / 2);
		}
		Ws(t, e, .2, i - .1, .495), Ws(t, e, .495, i - .1, -.2, "x"), e.gothic && tc(e, t, r, r, i * .7);
	},
	curtain(e, t, n) {
		let r = .74;
		B(2, .08, .32, e.m.stoneDark, 0, 0, 0, t), B(2, r, .26, e.m.stone, 0, 0, 0, t), B(2, .03, .3, e.m.stoneDark, 0, .71, 0, t), Us(t, e, 2, .28, r, e.m.stone, .07);
		for (let n of [
			-.7,
			0,
			.7
		]) for (let r of [-1, 1]) B(.025, .12, .01, e.m.dark, n, .42, r * .134, t);
	},
	tower(e, t, n) {
		let r = .32, i = 1.08, a = new N(new A(.36, .38, .1, 14), e.m.stoneDark);
		a.position.y = .05, t.add(a);
		let o = new N(new A(r, .34, i, 14), e.m.stone);
		o.position.y = i / 2, t.add(o);
		let s = new N(new A(.35, .35, .04, 14), e.m.stoneDark);
		s.position.y = .76, t.add(s);
		let c = new N(new A(.37, .36, .06, 14), e.m.stoneDark);
		c.position.y = i, t.add(c), js(t, r * 2, 1.11, .5, e.m.roof, 14, .06);
		for (let n of [.5, 1.1]) {
			let r = B(.03, .13, .02, e.m.dark, Math.sin(n) * .325, .46, Math.cos(n) * .325, t);
			r.rotation.y = n;
		}
		Ws(t, e, 0, 1.1, .34, "z", .24);
	},
	gatehouse(e, t, n) {
		let r = .56, i = 1.1, a = .56;
		for (let n of [-1, 1]) B(.43999999999999995 / 2, i, r, e.m.stone, n * .39, 0, 0, t);
		B(a, .5000000000000001, r, e.m.stone, 0, .6, 0, t);
		for (let n of [-1, 1]) {
			let r = new N(new A(a / 2, a / 2, .02, 12, 1, !1, 0, Math.PI), e.m.stoneDark);
			r.rotation.set(Math.PI / 2, 0, Math.PI / 2), r.position.set(0, .38, n * .29000000000000004), r.scale.set(1, 1, .45), t.add(r);
		}
		B(a, .12, .03, e.m.dark, 0, .48, r / 2 - .06, t);
		for (let n = 0; n < 6; n++) B(.012, .16, .012, e.m.dark, -.56 / 2 + .05 + n * .4600000000000001 / 5, .38, r / 2 - .06, t);
		B(1.04, .04, .6000000000000001, e.m.stoneDark, 0, 1.06, 0, t), Us(t, e, 1, r, i, e.m.stone, .07);
		for (let n of [-1, 1]) {
			let i = new j();
			i.position.set(n * (1 / 2 - .06), 0, r / 2 - .02), t.add(i);
			let a = new N(new A(.2, .22, 1.26, 12), e.m.stone);
			a.position.y = 1.26 / 2, i.add(a), js(i, .42, 1.26, .38, e.m.roof, 12, .05), B(.025, .11, .02, e.m.dark, 0, .55, .205, i), pc(t, e, n * .31000000000000005, .42, .32);
		}
		Ws(t, e, 0, 1.04, .30000000000000004, "z", .3);
	},
	palisade(e, t, n) {
		let r = z(ks("palisade", "#6e5a44", 41));
		B(2, .07, .4, z(ks("rubble", "#5d5442", 43)), 0, 0, 0, t);
		for (let e = 0; e < 27; e++) {
			let i = -1 + 2 * (e + .5) / 27, a = .66 + n() * .1, o = .036 + n() * .008, s = new N(new A(o, o + .004, a, 7), r);
			s.position.set(i, a / 2, (n() - .5) * .012), s.rotation.z = (n() - .5) * .04, t.add(s);
			let c = new N(new R(o, .09, 7), r);
			c.position.set(i, a + .045, s.position.z), t.add(c);
		}
		for (let n of [.22, .52]) B(2, .04, .03, e.m.beam, 0, n, .055, t);
		for (let n of [
			-.66,
			0,
			.66
		]) {
			let r = B(.03, .42, .03, e.m.beam, n, 0, .09, t);
			r.rotation.x = -.35;
		}
	},
	watchtower(e, t, n) {
		let r = .56, i = z(ks("palisade", "#6e5a44", 47));
		for (let [n, i] of [
			[-1, -1],
			[1, -1],
			[-1, 1],
			[1, 1]
		]) B(.08, 1.12, .08, e.m.beam, n * r / 2, 0, i * r / 2, t);
		for (let e = 0; e < 4; e++) for (let a = 0; a < 8; a++) {
			let o = -.56 / 2 + r * (a + .5) / 8, s = .6 + n() * .06, [c, l] = [
				[o, r / 2],
				[r / 2, o],
				[o, -.56 / 2],
				[-.56 / 2, o]
			][e], u = new N(new A(.034, .036, s, 7), i);
			u.position.set(c, s / 2, l), t.add(u);
		}
		let a = .7000000000000001;
		B(a, .04, a, e.m.beam, 0, .8, 0, t), B(a, .3, a, e.m.wood, 0, .84, 0, t);
		for (let n of [-1, 1]) B(.025, .82, .025, e.m.beam, .12 + n * .06, 0, .34, t);
		for (let n = .1; n < .8; n += .11) B(.12, .018, .018, e.m.beam, .12, n, .34, t);
		for (let n of [-.15, .15]) B(.03, .1, .01, e.m.dark, n, .95, .35300000000000004, t), B(.01, .1, .03, e.m.dark, .35300000000000004, .95, n, t);
		ec(t, a, 1.14, .36, e.m.roof), Ws(t, e, 0, 1.12, .37000000000000005, "z", .24);
	},
	timbergate(e, t, n) {
		let r = .6, i = .34, a = .42, o = z(ks("palisade", "#6e5a44", 53));
		for (let s of [-1, 1]) {
			let c = new j();
			c.position.x = s * .47, t.add(c);
			for (let [t, n] of [
				[-1, -1],
				[1, -1],
				[-1, 1],
				[1, 1]
			]) B(.08, 1.18, .08, e.m.beam, t * i / 2, 0, n * a / 2, c);
			for (let e = 0; e < 6; e++) for (let t of [-.42 / 2, a / 2]) {
				let r = .64 + n() * .05, a = new N(new A(.034, .036, r, 7), o);
				a.position.set(-.34 / 2 + i * (e + .5) / 6, r / 2, t), c.add(a);
			}
			for (let e = 0; e < 7; e++) for (let t of [-.34 / 2, i / 2]) {
				let r = .64 + n() * .05, i = new N(new A(.034, .036, r, 7), o);
				i.position.set(t, r / 2, -.42 / 2 + a * (e + .5) / 7), c.add(i);
			}
			B(.46, .3, .54, e.m.wood, 0, .84, 0, c), B(.46, .04, .54, e.m.beam, 0, .8, 0, c), B(.03, .1, .01, e.m.dark, 0, .95, .273, c), ec(c, .46, 1.14, .34, e.m.roof, .05), pc(t, e, s * (r / 2 - .02), .44, .26);
		}
		B(r, .05, a, e.m.beam, 0, .66, 0, t), B(r, .22, .04, e.m.wood, 0, .7, a / 2 - .02, t), B(r, .22, .04, e.m.wood, 0, .7, -.19, t);
		let s = new j();
		s.position.y = .92, t.add(s), As(s, .6599999999999999, .52, 0, .16, e.m.roof, e.m.wood, .04, .03);
		for (let n of [-1, 1]) {
			let i = B(r / 2 - .02, .56, .04, e.m.door, 0, 0, 0, t);
			i.geometry.translate(n * (r / 4 - .01), 0, 0), i.position.set(n * (r / 2 - .01), .28, a / 2 - .02), i.rotation.y = n * 1.35;
		}
		Ws(t, e, 0, .9, .22, "z", .22);
	},
	wall(e, t, n) {
		let r = 2.2, i = e.thatch ? .5 : .62;
		if (e.thatch) {
			for (let n = 0; n < 26; n++) {
				let a = -2.2 / 2 + r * n / 25;
				if (Math.abs(a) < .2) continue;
				B(.075, i + n % 3 * .02, .075, e.m.palisade, a, 0, 0, t);
				let o = new N(new R(.04, .08, 4), e.m.wood);
				o.position.set(a, i + .04 + n % 3 * .02, 0), t.add(o);
			}
			for (let n of [-1, 1]) B(.08, .9, .08, e.m.wood, n * .22, 0, .05, t);
			B(.56, .08, .3, e.m.wood, 0, .82, .05, t), B(.5, .2, .26, e.m.palisade, 0, .9, .05, t), js(t, .5, 1.1, .22, e.m.roof);
			return;
		}
		for (let n of [-1, 1]) B(r / 2 - .3, i, .2, e.m.stone, n * .7000000000000001, 0, 0, t), Us(t, e, r / 2 - .3, .001, i, e.m.stone, .07);
		t.children.slice(-0).forEach(() => {});
		let a = new j();
		t.add(a);
		for (let t of [-1, 1]) B(.26, i + .35, .34, e.m.stone, t * .26, 0, .02, a), Us(a, e, .001, .001, 0, e.m.stone);
		B(.78, .2, .34, e.m.stone, 0, i + .15, .02, a), Us(a, e, .78, .34, i + .35, e.m.stone, .07);
		let o = new N(new I(.26, .45, .04), e.m.door);
		if (o.position.set(0, .225, .19), a.add(o), e.gothic) for (let t of [-1, 1]) js(a, .26, i + .35, .5, e.m.roof, 4, .03).position.set(t * .26, i + .6, .02);
		Ws(a, e, 0, i + .3, .2), Ms(a, e, {
			side: "z",
			wallW: .78,
			wallD: .34
		}, -.26, i + .1, .06, .1, { pointed: e.gothic }), Ms(a, e, {
			side: "z",
			wallW: .78,
			wallD: .34
		}, .26, i + .1, .06, .1, { pointed: e.gothic });
	},
	well(e, t, n) {
		let r = new N(new A(.16, .18, .16, 10), e.m.stone);
		r.position.y = .08, t.add(r);
		let i = new N(new A(.13, .13, .01, 10), z(null, "#1d3040"));
		i.position.y = .155, t.add(i);
		for (let n of [-1, 1]) B(.03, .36, .03, e.m.beam, n * .15, .1, 0, t);
		B(.34, .025, .025, e.m.beam, 0, .42, 0, t);
		let a = new j();
		a.position.y = .46, t.add(a), As(a, .36, .3, 0, .12, e.m.roof, e.m.wood, .03, .02), B(.06, .06, .06, e.m.wood, .05, .25, 0, t);
	},
	farm(e, t, n) {
		let r = new j();
		r.position.set(-.25, 0, -.2), t.add(r), B(.95, .5, .6, e.gothic ? e.m.stone : e.m.wood, 0, 0, 0, r), $s(e, r, .95, .6, .5, e.roofRise * .9);
		let i = new N(new I(.3, .36, .03), e.m.door);
		i.position.set(.05, .18, .31), r.add(i);
		let a = new j();
		a.position.set(.55, 0, .3), t.add(a), Qs(e, a, .45, .42, 0, .44, e.m.lower, !0, { doorZ: -.08 }), Bs(a, e, {
			side: "z",
			wallW: .45,
			wallD: .42
		}, -.08, .14, .3, !1), $s(e, a, .45, .42, .44, e.roofRise, !1), Hs(a, e, .12, -.05, .44, .3), qs(t, e, -.72, .35), qs(t, e, -.5, .48, .08), qs(t, e, .9, -.3, .07), Js(t, e, -.95, .75, .25, .75), Js(t, e, -.95, .75, -.95, -.2), Ks(t, e, .2, .55);
	}
}, rc = (e) => new l({
	color: new P(e),
	flatShading: !0
}), ic = {
	pine: [
		"#1f2b22",
		"#243226",
		"#2a392b"
	],
	leaf: [
		"#3a4527",
		"#42502c",
		"#4b5530"
	],
	autumn: [
		"#6a4f25",
		"#76582a",
		"#5e3f21"
	],
	birch: [
		"#7a6428",
		"#86702c",
		"#6e5824"
	],
	bark: "#3a2c22",
	dead: "#4a4038",
	alder: [
		"#2c3626",
		"#33402b",
		"#28301f"
	],
	willow: [
		"#4a5236",
		"#535c3c",
		"#41482f"
	],
	wetbark: "#2e2a24"
};
new l({
	vertexColors: !0,
	flatShading: !1,
	roughness: 1
}), new l({
	vertexColors: !0,
	flatShading: !0,
	roughness: 1
});
function ac(e, t, n, r, i = 1) {
	let a = new j();
	a.position.set(n, 0, r), a.scale.setScalar(i), e.add(a);
	let o = rc(ic.dead), s = new N(new A(.025, .05, .8, 5), o);
	s.position.y = .4, s.rotation.z = (t() - .5) * .15, a.add(s);
	for (let e = 0; e < 5; e++) {
		let n = new N(new A(.008, .018, .3, 4), o), r = .35 + e * .09, i = t() * 6.28;
		n.position.set(Math.cos(i) * .1, r + .1, Math.sin(i) * .1), n.rotation.set(Math.sin(i) * .9, 0, -Math.cos(i) * .9), a.add(n);
	}
}
var oc = (e) => new P(e);
function sc(e, t, n, r) {
	let i = e.index ? e.toNonIndexed() : e, a = i.attributes.position, o = (e, t, n) => `${e.toFixed(3)},${t.toFixed(3)},${n.toFixed(3)}`, s = (e, t, n) => `${Math.round(e * 1e3)},${Math.round(t * 1e3)},${Math.round(n * 1e3)}`, c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
	for (let e = 0; e < a.count; e++) {
		let r = o(a.getX(e), a.getY(e), a.getZ(e)), i = s(a.getX(e), a.getY(e), a.getZ(e));
		c.has(r) || c.set(r, [
			(t() - .5) * n,
			(t() - .5) * n * .7,
			(t() - .5) * n
		]), l.has(i) || l.set(i, c.get(r));
		let u = l.get(i);
		a.setXYZ(e, a.getX(e) + u[0], a.getY(e) + u[1], a.getZ(e) + u[2]);
	}
	i.computeVertexNormals();
	let u = new Float32Array(a.count * 3), d = i.attributes.normal;
	for (let e = 0; e < a.count; e += 3) {
		let n = r((d.getY(e) + d.getY(e + 1) + d.getY(e + 2)) / 3, (a.getY(e) + a.getY(e + 1) + a.getY(e + 2)) / 3, t());
		for (let t = 0; t < 3; t++) u[(e + t) * 3] = n.r, u[(e + t) * 3 + 1] = n.g, u[(e + t) * 3 + 2] = n.b;
	}
	return i.setAttribute("color", new ve(u, 3)), i;
}
var cc = () => new l({
	vertexColors: !0,
	flatShading: !0
}), lc = (e, t, n, r = 1) => new A(1e-4, e, t, n, r), uc = {
	base: oc("#5b564b"),
	dark: oc("#433f37"),
	light: oc("#6f685a"),
	moss: oc("#4a5233"),
	grass: oc("#46502f"),
	snow: oc("#d4d6da"),
	scree: oc("#524d44")
}, dc = (e, t) => e.clone().multiplyScalar(t);
function fc(e, t, n = .6) {
	let r = sc(new je(t, 0), e, t * .35, (e, t, n) => e > .6 && n < .8 ? dc(uc.moss, .9 + n * .2) : e > .3 ? dc(uc.light, .9 + n * .15) : dc(uc.base, .85 + n * .2)), i = new N(r, cc());
	return i.scale.y = n, i.position.y = t * n * .55, i;
}
function pc(e, t, n, r, i) {
	B(.02, .22, .02, t.m.beam, n, r - .22, i, e);
	let a = new N(new I(.05, .06, .05), t.m.glass);
	a.userData.glow = !0, a.position.set(n, r + .02, i), e.add(a), B(.07, .015, .07, t.m.trim, n, r + .05, i, e);
}
function mc(e, t, n, r, i, a = 0) {
	let o = sc(new I(.1, i, .07, 1, 2, 1), t, .03, (e, t, n) => e > .6 ? dc(uc.moss, .9 + n * .2) : dc(uc.base, .8 + n * .25));
	o.translate(0, i / 2, 0);
	let s = new N(o, cc());
	return s.position.set(n, 0, r), s.rotation.set(a, t() * 3, a * .5), e.add(s), s;
}
Object.assign(nc, {
	barrow(e, t, n) {
		let r = new M(.6, 18, 7, 0, Math.PI * 2, 0, Math.PI / 2);
		r.scale(1.42, .5, 1);
		let i = new N(sc(r, n, .03, (e, t, n) => e > .25 ? dc(uc.grass, .82 + n * .22) : dc(oc("#4a4034"), .85 + n * .2)), cc());
		i.position.set(-.04, 0, -.22), t.add(i);
		for (let e = 0; e < 18; e++) {
			let r = e / 18 * Math.PI * 2, i = -.04 + Math.cos(r) * .87, a = -.22 + Math.sin(r) * .61;
			if (a > .18 && Math.abs(i - .08) < .42) continue;
			let o = fc(n, .05 + n() * .025, .55);
			o.position.set(i, o.position.y - .02, a), t.add(o);
		}
		let a = z(ks("field", "#6a6458", 21));
		for (let e of [-1, 1]) for (let n = 0; n < 4; n++) {
			let r = n / 3, i = .08 + e * (.26 + r * .36), o = .36 - r * r * .24, s = .27 - r * .15;
			B(.18, s, .11, a, i, 0, o, t).rotation.y = -e * (.25 + r * .55);
		}
		B(.25, .4, .4, z(null, "#0a090d"), .08, 0, .2, t);
		let o = (e, t, n) => e > .6 ? dc(uc.moss, .95 + n * .2) : dc(oc("#8a8478"), .85 + n * .25);
		for (let e of [-1, 1]) {
			let r = new N(sc(new I(.12, .43, .13, 1, 3, 1), n, .02, o), cc());
			r.position.set(.08 + e * .18, .215, .4), r.rotation.z = e * .04, t.add(r);
		}
		let s = new N(sc(new I(.56, .1, .16, 3, 1, 1), n, .02, o), cc());
		s.position.set(.08, .47, .4), s.rotation.z = .02, t.add(s);
		let c = new N(new A(.035, .035, .012, 10), z(null, "#7a7062"));
		c.rotation.x = Math.PI / 2, c.position.set(.08, .47, .485), t.add(c), Ls(B(.28, .02, .22, z(ks("field", "#6e6a60", 22)), .08, 0, .56, t));
		for (let n of [-1, 1]) B(.028, .37, .028, e.m.beam, .08 + n * .105, 0, .42, t).rotation.z = n * .05;
		B(.25, .028, .035, e.m.beam, .08, .37, .42, t);
		let l = new N(sc(lc(.24, .17, 9), n, .03, (e, t, n) => dc(oc("#5a4a38"), .85 + n * .25)), cc());
		l.position.set(.6, .085, .36), t.add(l);
		for (let r = 0; r < 3; r++) Ls(B(.065, .01, .34, e.m.wood, 0 + r * .075, 0, .74, t)).rotation.y = (n() - .5) * .12;
		{
			let n = t.children.length;
			B(.025, .36, .025, e.m.beam, -.3, 0, .6, t), B(.1, .018, .018, e.m.beam, -.26, .34, .6, t), pc(t, e, -.22, .3, .6), t.children.slice(n).forEach(Ls);
		}
		mc(t, n, -.35, -.3, .28, .1).position.y = .2;
		for (let [e, r, i, a] of [[
			-.82,
			.32,
			.3,
			.12
		], [
			.78,
			-.55,
			.34,
			.06
		]]) mc(t, n, e, r, i, a);
		ac(t, n, -.62, -.5, 1);
	},
	mine(e, t, n) {
		let r = new j();
		r.position.set(-.2, 0, -.25), t.add(r);
		let i = (e, t, n) => e > .6 && t < .35 ? dc(uc.grass, .85 + n * .3) : e > .35 ? dc(uc.light, 1.3 + n * .25) : dc(uc.base, (Math.floor(t * 9) % 2 ? 1.2 : 1.45) + n * .2), a = (e, t, a, o, s) => {
			let c = lc(a, o, s, 3);
			c.translate(0, o / 2, 0);
			let l = new N(sc(c, n, a * .3, i), cc());
			l.position.set(e, 0, t), l.rotation.y = n() * 6, r.add(l);
		};
		a(0, 0, .85, .42, 10), a(-.25, -.2, .5, .78, 7), a(.22, -.28, .42, .62, 7), a(-.05, .1, .4, .55, 7), a(-.55, .05, .3, .42, 6), a(.42, .02, .26, .36, 6), a(-.48, -.5, .34, .56, 6), a(.05, -.55, .3, .9, 6);
		for (let e = 0; e < 3; e++) {
			let e = n() * 6.28, r = fc(n, .18 + n() * .1, .8);
			r.position.set(Math.cos(e) * .6 - .2, 0, Math.sin(e) * .5 - .25), t.add(r);
		}
		let o = new j();
		o.position.set(.05, 0, .35), t.add(o), B(.34, .48, .3, z(null, "#0b0a0e"), 0, 0, -.05, o);
		for (let t of [-1, 1]) B(.05, .52, .05, e.m.beam, t * .19, 0, .08, o);
		B(.46, .06, .07, e.m.beam, 0, .52, .08, o);
		let s = B(.52, .03, .22, e.m.wood, 0, .59, .05, o);
		s.rotation.x = .35, pc(o, e, -.24, .46, .14);
		for (let n = 0; n < 7; n++) B(.22, .015, .035, e.m.wood, .05, 0, .5 + n * .09, t);
		for (let n of [-1, 1]) B(.015, .02, .66, e.m.trim, .05 + n * .07, .015, .78, t);
		let c = new j();
		c.position.set(.05, .02, .86), t.add(c), B(.18, .1, .22, e.m.wood, 0, .03, 0, c);
		for (let [t, n] of [
			[-.08, -.07],
			[.08, -.07],
			[-.08, .07],
			[.08, .07]
		]) {
			let r = new N(new A(.03, .03, .02, 8), e.m.trim);
			r.rotation.z = Math.PI / 2, r.position.set(t, .03, n), c.add(r);
		}
		let l = new N(sc(new je(.08, 0), n, .03, () => dc(oc("#5c5750"), 1)), cc());
		l.position.y = .14, l.scale.y = .6, c.add(l);
		let u = new N(sc(lc(.3, .12, 8, 2).translate(0, .06, 0), n, .04, (e, t, n) => dc(uc.scree, .62 + n * .2)), cc());
		u.position.set(.55, 0, .5), t.add(u);
		let d = new j();
		d.position.set(.5, 0, -.1), t.add(d);
		for (let [t, n] of [
			[-.12, -.1],
			[.12, -.1],
			[-.12, .1],
			[.12, .1]
		]) B(.03, .62, .03, e.m.beam, t, 0, n, d);
		B(.32, .04, .28, e.m.beam, 0, .62, 0, d);
		let f = new N(new A(.06, .06, .03, 10), e.m.wood);
		f.rotation.x = Math.PI / 2, f.position.set(0, .7, 0), d.add(f), B(.008, .45, .008, e.m.trim, .06, .2, 0, d), pc(t, e, .32, .46, .62), Ks(t, e, -.35, .55), Ks(t, e, -.45, .5);
	},
	stilthouse(e, t, n) {
		let r = .2, i = .58 + n() * .12, a = .5, o = .5, s = i + .24, c = .72;
		for (let [n, r] of [
			[-s / 2, -.72 / 2],
			[s / 2, -.72 / 2],
			[-s / 2, c / 2],
			[s / 2, c / 2],
			[0, c / 2],
			[s / 2, 0]
		]) B(.04, .22, .04, e.m.beam, n, -.02, r, t);
		for (let n of [-s / 2, s / 2]) {
			let i = B(.02, .02, c * 1.05, e.m.beam, n, r * .45, 0, t);
			i.rotation.x = .35;
		}
		B(s + .04, .03, .76, e.m.wood, 0, r, 0, t);
		let l = new j();
		l.position.set(-.03, .23, -.04), t.add(l), Qs(e, l, i, a, 0, o, n() < .5 ? e.m.upper : e.m.lower, !0, { doorZ: .08 }), Bs(l, e, {
			side: "z",
			wallW: i,
			wallD: a
		}, .08, .17, .42, !1), $s(e, l, i, a, o, e.roofRise * 1.3, n() < .5), n() < .6 && Hs(l, e, -i / 2 + .1, -.5 / 4, o, .28);
		for (let n = 0; n < 5; n++) B(.11, .012, .018, e.m.wood, .06, .16 - n * .045, .39, t);
		for (let n of [0, .12]) B(.012, .23, .012, e.m.beam, n, -.02, .39, t);
		pc(t, e, .22, .62, c / 2 - .02), B(.2, .16, .006, z(null, "#4a4a3a"), s / 2 - .12, .26, .37, t);
		let u = new N(new A(.035, .02, .09, 7), z(null, "#6a5a38"));
		u.position.set(s / 2 + .02, .14, .05), t.add(u);
	},
	stilttavern(e, t, n) {
		let r = .7, i = .52, a = 1.3, o = 1.04;
		for (let n = 0; n < 4; n++) for (let r of [-1.04 / 2, o / 2]) B(.05, .19999999999999998, .05, e.m.beam, -1.3 / 2 + a * n / 3, -.02, r, t);
		B(1.34, .035, 1.08, e.m.wood, 0, .18, 0, t);
		let s = new j();
		s.position.set(-.02, .215, -.08), t.add(s), Qs(e, s, 1, r, 0, i, e.m.lower, !0, { doorZ: .05 }), Bs(s, e, {
			side: "z",
			wallW: 1,
			wallD: r
		}, .05, .24, .46, !0), Qs(e, s, 1 + e.jetty * 2, r + e.jetty * 2, i, .4, e.m.upper, !0, { timber: !0 }), $s(e, s, 1 + e.jetty * 2, r + e.jetty * 2, .92, e.roofRise * 1.1), Hs(s, e, .34, -.12, .92, .42), Gs(s, e, .32, .48, r / 2);
		let c = new j();
		c.position.set(.1, .215, .41), t.add(c);
		for (let t of [-.3, .42]) B(.035, .56, .035, e.m.beam, t, 0, .1, c);
		B(.8, .04, .04, e.m.beam, .06, .56, .1, c), B(.36, .03, .08, e.m.wood, .02, .09, .08, c), pc(c, e, -.3, .5, .13), pc(c, e, .42, .5, .13);
		let l = new j();
		l.position.set(-.44, .215, .41), t.add(l);
		for (let t of [-1, 1]) B(.025, .32, .025, e.m.beam, t * .13, 0, 0, l);
		B(.3, .18, .025, e.m.wood, 0, .13, 0, l), B(.34, .03, .06, e.m.roof, 0, .31, 0, l);
		for (let [t, n] of [
			[-.08, .24],
			[.03, .19],
			[.09, .24],
			[-.02, .15]
		]) B(.05, .06, .03, e.m.paper, t, n, .004, l);
		Ks(t, e, a / 2 - .08, o / 2 - .05);
	},
	stiltinn(e, t, n) {
		let r = .2, i = 1.22, a = .56, o = .48, s = 1.48, c = .92;
		for (let n = 0; n < 5; n++) for (let r of [-.92 / 2, c / 2]) B(.05, .22, .05, e.m.beam, -1.48 / 2 + s * n / 4, -.02, r, t);
		for (let n of [-1.48 / 2, s / 2]) {
			let i = B(.02, .02, c * 1.05, e.m.beam, n, r * .45, 0, t);
			i.rotation.x = .35;
		}
		B(1.52, .035, .9600000000000001, e.m.wood, 0, r, 0, t);
		let l = new j();
		l.position.set(0, .23500000000000001, -.1), t.add(l), Qs(e, l, i, a, 0, o, e.m.lower, !0, { doorZ: -.2 }), Bs(l, e, {
			side: "z",
			wallW: i,
			wallD: a
		}, -.2, .2, .4, !1), Qs(e, l, i + e.jetty * 2, a + e.jetty * 2, o, .34, e.m.upper, !0, { timber: !0 }), $s(e, l, i + e.jetty * 2, a + e.jetty * 2, .8200000000000001, e.roofRise * 1.25), Hs(l, e, -.42, -.1, .8200000000000001, .4), Hs(l, e, .44, -.1, .8200000000000001, .34), Gs(l, e, -.46, .46, a / 2), B(.02, .06, .012, z(null, "#e8d8a8"), -.46, .43, .34, l);
		let u = new j();
		u.position.set(0, .23500000000000001, a / 2 - .02), t.add(u);
		for (let t of [
			-.56,
			-.1,
			.36,
			.6
		]) B(.03, .2, .03, e.m.beam, t, 0, .12, u);
		B(1.2, .025, .025, e.m.beam, .02, .18, .12, u), B(.4, .03, .08, e.m.wood, .2, .09, .02, u), pc(u, e, -.2, .36, .1), pc(u, e, .6, .36, .1);
		for (let n = 0; n < 5; n++) B(.11, .012, .018, e.m.wood, s / 2 - .16, .16 - n * .045, .49, t);
		for (let n of [s / 2 - .22, s / 2 - .1]) B(.012, .23, .012, e.m.beam, n, -.02, .49, t);
		B(.22, .012, .1, z(null, "#6a4a3a"), -.3, .74, .4, t);
	},
	cistern(e, t, n) {
		for (let [n, r] of [
			[-.12, -.12],
			[.12, -.12],
			[-.12, .12],
			[.12, .12]
		]) B(.03, .14, .03, e.m.beam, n, 0, r, t);
		let r = new N(new A(.15, .14, .2, 12), e.m.wood);
		r.position.set(0, .24, 0), t.add(r);
		for (let n of [.17, .31]) {
			let r = new N(new L(.152, .008, 4, 14), e.m.trim);
			r.rotation.x = Math.PI / 2, r.position.y = n, t.add(r);
		}
		for (let n of [-1, 1]) B(.025, .34, .025, e.m.beam, n * .17, .14, 0, t);
		let i = B(.42, .025, .3, e.m.roof, 0, .5, 0, t);
		i.rotation.x = .15, B(.012, .012, .12, e.m.trim, .17, .4, .06, t);
	},
	punt(e, t, n) {
		B(.18, .025, .56, e.m.wood, 0, 0, 0, t);
		for (let n of [-1, 1]) B(.02, .06, .56, e.m.beam, n * .09, 0, 0, t);
		for (let n of [-1, 1]) B(.18, .05, .02, e.m.beam, 0, 0, n * .28, t);
		let r = B(.012, .012, .7, e.m.beam, .05, .05, .02, t);
		r.rotation.y = .08;
	},
	eeltrap(e, t, n) {
		B(.025, .36, .025, e.m.beam, 0, -.02, 0, t);
		let r = z(null, "#6a5a38");
		for (let [e, n] of [[.06, .3], [.16, -.4]]) {
			let i = new N(new R(.045, .2, 7, 1, !0), r);
			i.position.set(.06, e, 0), i.rotation.z = Math.PI / 2 + n * .3, t.add(i);
		}
	},
	landing(e, t, n) {
		let r = .25;
		for (let n of [-1, 1]) {
			B(.06, .62, .06, e.m.beam, 0, -.02, n * r, t), B(.09, .03, .09, e.m.trim, 0, .6, n * r, t), pc(t, e, .02, .8200000000000001, n * r);
			let i = B(.025, .2, .025, e.m.beam, 0, .4, n * .16999999999999998, t);
			i.rotation.x = n * .7;
		}
		B(.07, .06, .64, e.m.beam, 0, .56, 0, t);
		for (let n of [-1, 1]) B(.008, .08, .008, e.m.trim, .02, .48, n * .12, t);
		B(.03, .12, .3, e.m.signboard, .02, .36, 0, t);
		let i = new N(new M(1, 8, 4), z(null, "#b8a060"));
		i.scale.set(.008, .022, .11), i.position.set(.04, .42, 0), i.rotation.x = .2, t.add(i);
	},
	ferrystage(e, t, n) {
		let r = .86, i = .22;
		for (let n of [-1, 1]) {
			B(.07, r, .07, e.m.beam, n * i, r / 2 - .02, 0, t), B(.1, .03, .1, e.m.trim, n * i, .85, 0, t), pc(t, e, n * i, 1.06, 0), pc(t, e, n * .28, .46, .02);
			let a = B(.025, .2, .025, e.m.beam, n * .14, .6599999999999999, 0, t);
			a.rotation.z = -n * .7;
		}
		B(.6, .06, .08, e.m.beam, 0, .82, 0, t);
		for (let n of [-1, 1]) B(.008, .08, .008, e.m.trim, n * .12, .74, .02, t);
		B(.32, .2, .03, z(null, "#1a181e"), 0, .59, .02, t), B(.05, .14, .034, z(null, "#c8d0dc"), 0, .59, .02, t), B(.08, .025, .034, z(null, "#c8d0dc"), 0, .6599999999999999, .02, t);
		let a = new N(new M(1, 8, 4, 0, Math.PI * 2, 0, Math.PI * .6), z(null, "#8a7a48"));
		a.scale.set(.045, .06, .045), a.position.set(.32, .72, 0), t.add(a);
	},
	boathall(e, t, n) {
		let r = (e, t, n) => e > .5 ? dc(uc.grass, .72 + n * .2) : dc(oc("#3e352a"), .8 + n * .2), i = new M(.8, 12, 5, 0, Math.PI * 2, 0, Math.PI / 2);
		i.scale(1.2, .42, 1);
		let a = new N(sc(i, n, .05, r), cc());
		a.position.set(-.05, 0, -.1), t.add(a);
		let o = (r, i, a, o, s, c, l = 0, u = 1) => {
			let d = new j();
			d.position.set(r, i, a), d.rotation.set(0, c, l), t.add(d);
			let f = new M(1, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);
			f.scale(s, s * .8, o);
			let p = z(ks("planks", "#" + new P("#77705f").multiplyScalar(u).getHexString(), 61 + Math.floor(n() * 9)));
			d.add(new N(f, p)), B(.025, .03, o * 1.7, e.m.beam, 0, s * .78, 0, d);
			for (let t of [-1, 1]) B(.02, .05, .02, e.m.beam, 0, s * .7, t * o * .88, d);
			return d;
		};
		B(.94, .32, .66, e.m.wood, 0, .22, -.24, t);
		for (let n = 0; n < 5; n++) B(.035, .34, .035, e.m.beam, -.44 + n * .22, .2, .1, t);
		o(-.3, .54, -.24, .4, .2, 0, 0, .9), o(.02, .56, -.22, .46, .24, 0), o(.33, .53, -.26, .38, .19, 0, 0, .85);
		let s = new j();
		s.position.set(.02, 0, .4), t.add(s), B(.34, .47, .5, z(null, "#0c0a0c"), 0, 0, -.04, s);
		for (let t of [-1, 1]) B(.06, .48, .5, e.m.wood, t * .2, 0, -.04, s);
		o(.02, .47, .36, .3, .21, 0, 0, .95);
		for (let r = 0; r < 3; r++) Ls(B(.3, .014, .06, e.m.wood, .02, 0, .66 + r * .03, t)).rotation.y = (n() - .5) * .15;
		for (let t of [-1, 1]) {
			let n = B(.026, .56, .024, e.m.beam, t * .25, 0, .23, s);
			n.rotation.z = -t * .06;
			let r = B(.07, .13, .014, e.m.wood, t * .27, .54, .23, s);
			r.rotation.z = -t * .06;
		}
		B(.5, .05, .06, e.m.wood, 0, .47, .22, s);
		for (let e = 0; e < 7; e++) B(.012, .03, .01, z(null, "#1a1612"), -.18 + e * .06, .48, .255, s);
		pc(s, e, -.29, .46, .27), pc(s, e, .31, .46, .27), B(.025, 1, .025, e.m.beam, .42, 0, .5, t);
		let c = B(.014, .1, .014, e.m.trim, .45, 1, .5, t);
		c.rotation.z = -.8;
		let l = z(null, "#a8843a");
		B(.11, .035, .11, l, .42, 1.03, .5, t);
		for (let [e, n] of [
			[-.045, -.045],
			[.045, -.045],
			[-.045, .045],
			[.045, .045]
		]) B(.02, .05, .02, l, .42 + e, 1.065, .5 + n, t);
		o(-.72, .1, .2, .36, .13, .9, 1.25, .8), o(.72, .1, -.3, .32, .12, -.5, -1.2, .75), o(-.5, .08, -.7, .3, .12, .2, 1.3, .7), B(.16, .025, .44, e.m.wood, .66, 0, .36, t).rotation.y = -.6;
		for (let [r, i, a] of [
			[
				-.62,
				.52,
				.3
			],
			[
				-.45,
				.62,
				.24
			],
			[
				.8,
				.08,
				.28
			]
		]) {
			let o = new N(new R(.022, a, 5), e.m.beam);
			o.position.set(r, a / 2, i), o.rotation.z = (n() - .5) * .4, t.add(o);
		}
		let u = z(null, "#6a6a3e");
		for (let [e, r] of [
			[-.86, -.1],
			[.9, .36],
			[-.24, .66],
			[.4, -.8]
		]) for (let i = 0; i < 7; i++) {
			let i = new N(new A(.003, .01, .14 + n() * .08, 3), u);
			i.position.set(e + (n() - .5) * .09, .07, r + (n() - .5) * .09), i.rotation.set((n() - .5) * .7, 0, (n() - .5) * .7), t.add(i);
		}
	},
	lockhall(e, t, n) {
		let r = .66, i = .56, a = e.m.ashlar, o = new j();
		o.position.x = -.24, t.add(o), B(.74, .06, .64, e.m.stoneDark, 0, 0, 0, o), Qs(e, o, r, i, .06, .5, a, !0, { doorZ: .06 }), Bs(o, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, .06, .24, .48, !0), Qs(e, o, r + e.jetty * 2, i + e.jetty * 2, .56, .32, e.m.upper, !0, { timber: !0 }), $s(e, o, r + e.jetty * 2, i + e.jetty * 2, .8800000000000001, e.roofRise * .9, !0), Hs(o, e, .18, -.12, .8800000000000001, .34);
		let s = new j();
		s.position.set(-.66 / 2 - .02, 0, -.56 / 2 + .12), o.add(s), B(.26, 1.22, .26, a, 0, 0, 0, s), ec(s, .26, 1.22, .26, e.m.roof);
		for (let t of [.5, .95]) Ms(s, e, {
			side: "z",
			wallW: .26,
			wallD: .26
		}, 0, t, .06, .12, { lit: t > .9 });
		pc(o, e, -.17, .48, .33), pc(o, e, .29, .48, .33), Ks(o, e, -.28, .42000000000000004);
		let c = new j();
		c.position.set(.72, 0, -.04), t.add(c);
		let l = .36, u = .84;
		for (let t of [-1, 1]) B(.1, .14, u, a, t * .22999999999999998, 0, 0, c), B(.12000000000000001, .03, .86, e.m.stoneDark, t * .22999999999999998, .14, 0, c);
		let d = new N(new I(l, .02, u), z(null, "#2c3e40"));
		d.position.set(0, .04, 0), c.add(d);
		for (let [t, n] of [[-.37, -1], [u / 2 - .05, 1]]) {
			for (let r of [-1, 1]) {
				let i = new j();
				i.position.set(r * l / 2, 0, t), i.rotation.y = -r * n * .32, c.add(i), B(.21, .22, .035, e.m.wood, -r * .09999999999999999, .02, 0, i);
				for (let t of [.06, .15]) B(.22, .025, .045, e.m.trim, -r * .09999999999999999, t, 0, i);
				let a = B(.42, .05, .06, e.m.beam, r * .16, .24, n * .05, i);
				a.rotation.y = r * n * .12;
			}
			B(.42, .02, .07, e.m.wood, 0, .24, t, c);
		}
		let f = new N(new A(.045, .055, .14, 10), e.m.wood);
		f.position.set(.22999999999999998, .24, u / 2 - .2), c.add(f);
		for (let t = 0; t < 2; t++) {
			let n = B(.26, .016, .016, e.m.beam, .22999999999999998, .28, u / 2 - .2, c);
			n.rotation.y = t * Math.PI / 2 + .3;
		}
		pc(c, e, -.22999999999999998, .5, u / 2 - .12);
		let p = new j();
		p.position.set(.12, .03, -.22), p.rotation.set(-Math.PI / 2 + .1, .4, 0), t.add(p), B(.36, .3, .04, e.m.wood, 0, 0, 0, p);
		for (let t of [.06, .2]) B(.38, .03, .05, e.m.trim, 0, t, 0, p);
	},
	vats(e, t, n) {
		let r = e.m.ashlar, i = z(null, "#5a8a3a"), a = z(null, "#0e0c0c");
		B(1.3, .03, 1, e.m.stoneDark, 0, 0, -.05, t);
		let o = (o, s, c, l) => {
			let u = new N(new A(c, c * 1.05, .26, 14), r);
			u.position.set(o, .13, s), t.add(u);
			for (let n of [.06, .2]) {
				let r = new N(new L(c * 1.02, .012, 4, 18), e.m.trim);
				r.rotation.x = Math.PI / 2, r.position.set(o, n, s), t.add(r);
			}
			let d = new N(new A(c * .92, c * .92, .01, 14), l ? i : a);
			if (d.position.set(o, l ? .266 : .262, s), t.add(d), l) for (let e = 0; e < 3; e++) {
				let e = B(.03, .12 + n() * .08, .012, i, o + (n() - .5) * c, .04, s + c * .98, t);
				e.rotation.y = (n() - .5) * .5;
			}
		};
		o(-.36, -.3, .26, !0), o(.32, -.36, .24, !0), o(.42, .24, .2, !0), o(-.14, .24, .24, !1);
		for (let n = 0; n < 6; n++) B(.012, .02, .07, e.m.wood, -.14, .23 - n * .035, .48 - n * .005, t);
		for (let n of [-1, 1]) {
			let r = B(.014, .28, .014, e.m.beam, -.14 + n * .04, .02, .48, t);
			r.rotation.x = -.25;
		}
		let s = (n, r, i, a) => {
			let o = Math.hypot(i - n, a - r), s = new N(new A(.025, .025, o, 8), e.m.trim);
			s.rotation.set(0, -Math.atan2(a - r, i - n), Math.PI / 2), s.position.set((n + i) / 2, .3, (r + a) / 2), t.add(s);
		};
		s(-.36, -.3, .32, -.36), s(.32, -.36, .42, .24);
		let c = new N(new L(.05, .008, 4, 10), e.m.trim);
		c.position.set(0, .33, -.33), t.add(c), B(.02, .62, .02, e.m.beam, .12, .02, .5, t);
		let l = new N(new A(.04, .04, .08, 6, 1, !0), e.m.trim);
		l.position.set(.12, .6, .54), t.add(l), pc(t, e, -.42, .34, .4);
		let u = z(null, "#5e6a3a");
		for (let [e, r] of [
			[-.66, .36],
			[.68, -.1],
			[.66, .5]
		]) for (let i = 0; i < 6; i++) {
			let i = new N(new A(.003, .009, .1 + n() * .06, 3), u);
			i.position.set(e + (n() - .5) * .08, .05, r + (n() - .5) * .08), i.rotation.set((n() - .5) * .7, 0, (n() - .5) * .7), t.add(i);
		}
	},
	abbey(e, t, n) {
		let r = e.m.ashlar, i = .7, a = 1.3, o = .86, s = new j();
		s.position.set(.05, -.1, -.2), s.rotation.set(.03, 0, -.04), t.add(s), B(i, o, a, r, 0, 0, 0, s);
		for (let t = 0; t < 4; t++) Ms(s, e, {
			side: "x",
			wallW: i,
			wallD: a
		}, -1.3 / 2 + a * (t + .5) / 4, o * .62, .08, .3, {
			pointed: !0,
			lit: t === 1
		});
		tc(e, s, i, a, o), As(s, i, a, o, e.roofRise * i / 2 * 1.5, e.m.roof, r, .06, .04);
		let c = new j();
		c.position.set(-.1, -.08, a / 2 - .1), c.rotation.z = .03, t.add(c), B(.36, 1.36, .34, r, 0, 0, 0, c), Bs(c, e, {
			side: "z",
			wallW: .36,
			wallD: .34
		}, 0, .22, .56, !1), B(.3, .06, .05, r, 0, .56, .17, c), Ms(c, e, {
			side: "z",
			wallW: .36,
			wallD: .34
		}, 0, .98, .1, .2, {
			pointed: !0,
			lit: !1
		}), Ms(c, e, {
			side: "x",
			wallW: .36,
			wallD: .34
		}, 0, .98, .1, .2, {
			pointed: !0,
			lit: !1
		}), Us(c, e, .36, .34, 1.36, r, .06);
		let l = new N(new A(.04, .07, .09, 10), z(null, "#6a5a3a"));
		l.position.set(0, 1, .12), c.add(l);
		let u = new j();
		u.position.set(.55, -.06, .1), t.add(u);
		for (let e = 0; e < 4; e++) B(.07, e === 3 ? .14 : .42, .07, r, 0, 0, -.4 + e * .26, u);
		for (let e = 0; e < 2; e++) B(.07, .06, .3, r, 0, .42, -.27 + e * .26, u);
		B(.16, .07, .12, r, .1, 0, .5, u).rotation.y = .5;
		let d = z(null, "#2c3e3e");
		for (let [e, n, r, i] of [
			[
				0,
				.1,
				1.2,
				1
			],
			[
				.5,
				.6,
				.6,
				.4
			],
			[
				-.55,
				-.2,
				.5,
				.8
			]
		]) {
			let a = new N(new A(.5, .5, .004, 18), d);
			a.scale.set(r, 1, i), a.position.set(e, .002, n), t.add(a);
		}
		ac(t, n, -.62, .35, .9), B(.03, .34, .03, e.m.beam, .14, 0, .62, t), pc(t, e, .14, .36, .62), pc(c, e, -.15, .56, .08), pc(c, e, .15, .56, .08);
	},
	priory(e, t, n) {
		let r = e.m.ashlar, i = new M(.9, 12, 4, 0, Math.PI * 2, 0, Math.PI / 2);
		i.scale(1.15, .16, 1), t.add(new N(sc(i, n, .03, (e, t, n) => e > .6 ? dc(uc.grass, .72 + n * .18) : dc(uc.base, .78 + n * .2)), cc()));
		let a = new j();
		a.position.set(-.12, .1, -.05), t.add(a);
		let o = .46, s = .8, c = .66;
		B(o, c, s, r, 0, 0, 0, a);
		for (let t = 0; t < 3; t++) Ms(a, e, {
			side: "x",
			wallW: o,
			wallD: s
		}, -.8 / 2 + s * (t + .5) / 3, c * .6, .07, .2, {
			pointed: !0,
			lit: t === 2
		});
		Ms(a, e, {
			side: "z",
			wallW: o,
			wallD: s
		}, 0, c * .76, .1, .2, {
			pointed: !0,
			lit: !0
		}), As(a, o, s, c, e.roofRise * o / 2 * 1.4, e.m.roof, r, .06, .04), B(.08, .14, .06, r, 0, .9400000000000001, s / 2 - .03, a), B(.28, .42, .05, z(null, "#0c0a0c"), 0, -.08, .42000000000000004, a), B(.21, .37, .012, e.m.door, 0, -.06, .45, a);
		for (let t of [
			0,
			.14,
			.26
		]) B(.22, .016, .015, e.m.trim, 0, t, .458, a);
		for (let e of [-1, 1]) B(.05, .44, .07, r, e * .155, -.08, .44, a);
		B(.36, .06, .08, r, 0, .34, .445, a);
		for (let e = 0; e < 3; e++) B(.32, .025, .07, r, 0, -.1 + e * .03, .56 - e * .05, a);
		let l = new j();
		l.position.set(.42, .1, -.26), t.add(l), Qs(e, l, .36, .5, 0, .36, e.m.upper, !0, {}), $s(e, l, .36, .5, .36, e.roofRise, !1);
		for (let [e, n, i, a] of [
			[
				.42,
				.26,
				.4,
				0
			],
			[
				.62,
				.04,
				.5,
				Math.PI / 2
			],
			[
				-.5,
				-.4,
				.5,
				Math.PI / 2
			]
		]) B(i, .12, .05, r, e, .08, n, t).rotation.y = a;
		pc(t, e, .12, .42, .42), ac(t, n, .66, -.62, .8);
	},
	watermill(e, t, n) {
		let r = .62, i = .5, a = .36;
		Qs(e, t, r, i, 0, a, e.m.stone, !0, { doorZ: -.1 }), Qs(e, t, r, i, a, .3, e.m.upper, !0, { timber: !0 }), Bs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, -.1, .16, .3, !0), $s(e, t, r, i, .6599999999999999, e.roofRise * 1.25, !0), Hs(t, e, -.18, -.1, .6599999999999999, .34);
		let o = new j();
		o.position.set(.4, .2, .02), t.add(o);
		let s = .24, c = e.m.wood;
		for (let t of [-.07, .07]) {
			let n = new N(new L(s, .018, 5, 18), e.m.beam);
			n.rotation.y = Math.PI / 2, n.position.x = t * 0, n.position.z = t, n.rotation.set(0, 0, 0), n.position.set(0, 0, t), o.add(n);
		}
		for (let e = 0; e < 12; e++) {
			let t = e / 12 * Math.PI * 2, n = new N(new I(.02, .09, .16), c);
			n.position.set(0, Math.sin(t) * s, 0), n.position.x = Math.cos(t) * s, n.rotation.z = t, o.add(n);
		}
		o.rotation.y = Math.PI / 2;
		let l = new N(new A(.035, .035, .22, 8), e.m.trim);
		l.rotation.x = Math.PI / 2, l.position.set(.4, .2, .02), l.rotation.set(0, 0, Math.PI / 2), t.add(l), B(.2, .01, .9, z(null, "#2e5a78"), .4, 0, .02, t);
		for (let n of [-1, 1]) B(.03, .06, .9, e.m.stoneDark, .4 + n * .115, 0, .02, t);
		B(.24, .16, .03, e.m.wood, .4, 0, -.4, t);
		for (let [n, r, i] of [
			[
				.08,
				.34,
				1
			],
			[
				.16,
				.36,
				.85
			],
			[
				.12,
				.44,
				.9
			],
			[
				-.28,
				.36,
				1
			]
		]) gc(t, e, n, r, i * 1.2, i * 2);
		let u = new j();
		u.position.set(-.46, 0, .3), u.rotation.y = .5, t.add(u);
		let d = z(null, "#221a16");
		B(.26, .05, .16, d, 0, .06, 0, u);
		for (let e of [-1, 1]) {
			let t = new N(new L(.06, .012, 4, 10), d);
			t.position.set(.02, .06, e * .09), u.add(t);
		}
		B(.012, .44, .012, e.m.beam, .3, 0, .34, t), B(.1, .06, .006, z(null, "#8a2a20"), .35, .36, .34, t), pc(t, e, -.24, .3, .3);
	},
	chapelruin(e, t, n) {
		let r = -.12, i = .56, a = .92, o = .86, s = z(ks("ashlar", "#a29c8e", 31)), c = z(ks("rubble", "#4e5a3c", 32)), l = z(ks("slate", "#454a55", 33)), u = z(null, "#08080b"), d = new N(new A(.5, .5, .004, 18), z(null, "#1e2c30"));
		d.scale.set(1.4, 1, .95), d.position.set(0, r, -.12), d.userData.bakeOnly = d.userData.dress = !0, t.add(d);
		let f = new j();
		f.position.set(0, -.42, -.12), f.rotation.set(.05, .06, -.13), t.add(f), B(i, o, a, s, 0, 0, 0, f), B(.5720000000000001, .4, .932, c, 0, 0, 0, f);
		for (let e of [-1, 1]) for (let t = 0; t < 3; t++) B(.07, o * .78, .08, s, e * .31500000000000006, 0, -.92 / 2 + .16 + t * .3, f);
		for (let e of [-1, 1]) for (let t = 0; t < 3; t++) {
			let n = B(.012, .22, .08, u, e * .28200000000000003, .36, -.92 / 2 + .31 + t * .3, f), r = new N(new R(.057, .06, 4, 1), u);
			r.scale.set(.2, 1, 1), r.position.set(e * .28200000000000003, .61, -.92 / 2 + .31 + t * .3), r.rotation.y = Math.PI / 4, f.add(r), n.userData.dark = !0;
		}
		let p = .34, m = new j();
		m.position.z = a / 4, f.add(m), As(m, a / 2, i, o, p, l, s, .05, .035), m.rotation.y = Math.PI / 2;
		for (let t = 0; t < 4; t++) for (let n of [-1, 1]) {
			let r = B(Math.hypot(i / 2, p) + .04, .022, .022, e.m.beam, n * i / 4, 1.01, -.04 - t * .12, f);
			r.rotation.z = -n * Math.atan2(p, i / 2), t === 3 && n > 0 && (r.rotation.y = .5);
		}
		B(.03, .03, .5, e.m.beam, 0, 1.18, -.92 / 4, f);
		let h = new j();
		h.position.set(0, 1.17, a / 2 - .03), f.add(h);
		for (let e of [-1, 1]) B(.04, .16, .07, s, e * .055, 0, 0, h);
		B(.17, .035, .08, s, 0, .16, 0, h), B(.07, .12, .072, u, 0, .02, 0, h);
		{
			let e = new N(new R(.075, .07, 4, 1), l);
			e.position.y = .23, e.rotation.y = Math.PI / 4, h.add(e);
		}
		let g = B(.17, .3, .06, u, 0, .39999999999999997, a / 2 - .02, f);
		{
			let e = new N(new A(.085, .085, .06, 10, 1, !1, 0, Math.PI), u);
			e.rotation.set(Math.PI / 2, 0, Math.PI / 2), e.position.set(0, .7, a / 2 - .02), f.add(e), g.userData.dark = !0;
		}
		let _ = new j();
		_.position.set(0, 0, .34 + .13), t.add(_), B(.34, .23, .26, s, 0, -.2, 0, _);
		for (let e = 0; e < 2; e++) B(.3, .025, .06, s, 0, .005 - e * .025, .16 + e * .05, _);
		for (let e of [-1, 1]) B(.05, .26, .24, s, e * .15, .03, -.01, _);
		for (let e of [-1, 1]) {
			let t = B(.21, .02, .3, l, e * .085, .32, -.01, _);
			t.rotation.z = e * -.6;
		}
		B(.012, .15, .16, u, .28400000000000003, .32, .18, f);
		for (let n = 0; n < 3; n++) {
			let r = B(.36, .012, .045, e.m.wood, .5 + n * .002, -.108, .2 + n * .05, t);
			r.rotation.y = .55;
		}
		for (let e = 0; e < 5; e++) {
			let e = fc(n, .025 + n() * .02, .6);
			e.position.set(.36 + n() * .12, r, 0 + n() * .2), t.add(e);
		}
		{
			let e = new N(sc(lc(.14, .09, 7, 2), n, .02, (e, t, n) => dc(oc("#4a4034"), .85 + n * .2)), cc());
			e.position.set(.62, .045, .62), t.add(e);
		}
		B(.2, .014, .06, e.m.wood, -.33, .07, .66, t);
		for (let n of [-1, 1]) B(.014, .07, .05, e.m.beam, -.33 + n * .08, 0, .66, t);
		let v = z(ks("thatch", "#9a8250", 34));
		for (let e = 0; e < 3; e++) {
			let n = new N(new M(.035, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), v);
			n.scale.set(1, 1.25, 1), n.position.set(-.4 + e * .07, .084, .66), t.add(n);
		}
		pc(t, e, .21, .24, .8);
		let y = z(null, "#5e6e3e");
		for (let [e, i] of [
			[.68, 0],
			[.66, .36],
			[-.66, .28],
			[-.6, -.4],
			[.5, -.6],
			[-.22, .56],
			[.36, .52]
		]) for (let a = 0; a < 5; a++) {
			let a = new N(new A(.003, .009, .1 + n() * .07, 3, 1, !0), y);
			a.position.set(e + (n() - .5) * .07, (i > .48 ? 0 : r) + .05, i + (n() - .5) * .07), a.rotation.set((n() - .5) * .7, 0, (n() - .5) * .7), t.add(a);
		}
		B(.16, .08, .11, s, -.48, -.15, -.1, t).rotation.y = .6;
	},
	wagon(e, t, n) {
		let r = e.m.wood, i = z(null, "#3e2e22"), a = e.m.trim, o = new j();
		o.position.set(0, .09, 0), o.rotation.set(0, .35, 1.32), t.add(o), B(.4, .025, .2, r, 0, -.012, 0, o);
		for (let e of [-1, 1]) B(.4, .07, .015, r, 0, .01, e * .095, o);
		B(.015, .07, .2, r, -.195, .01, 0, o);
		for (let e = 0; e < 4; e++) B(.012, .075, .205, i, -.15 + e * .1, .008, 0, o);
		let s = (e, t, n, o, s, c) => {
			let l = new j();
			l.position.set(t, n, o), l.rotation.set(s, c, 0), e.add(l);
			let u = new N(new L(.07, .01, 5, 14), i);
			l.add(u);
			for (let e = 0; e < 6; e++) {
				let t = B(.006, .13, .006, r, 0, -.065, 0, l);
				t.rotation.z = e / 6 * Math.PI, t.position.set(0, 0, 0);
			}
			let d = new N(new A(.018, .018, .03, 8), a);
			d.rotation.x = Math.PI / 2, l.add(d);
		};
		s(o, -.12, -.06, .11, 0, 0), s(o, .13, -.06, .11, 0, 0), s(o, -.12, -.06, -.11, 0, 0), s(t, .3, .012, .18, Math.PI / 2, 0);
		let c = B(.32, .016, .016, i, -.34, .01, .12, t);
		c.rotation.y = -.4, B(.12, .016, .016, i, -.26, .01, -.02, t).rotation.set(0, .2, .25);
		for (let [e, i, o] of [
			[
				.16,
				.24,
				0
			],
			[
				.26,
				.04,
				1
			],
			[
				.05,
				.3,
				1
			]
		]) {
			let s = new N(new A(.045, .04, .1, 10), r);
			s.position.set(e, o ? .045 : .05, i), o && s.rotation.set(Math.PI / 2, 0, n() * 2), t.add(s);
			for (let e of [-.03, .03]) {
				let t = new N(new L(.044, .004, 3, 12), a);
				t.rotation.x = Math.PI / 2, t.position.y = e, s.add(t);
			}
		}
		gc(t, e, -.06, .26, 1.1, 1.3), gc(t, e, .34, .22, .9, .4);
		let l = B(.09, .07, .09, r, -.2, 0, .24, t);
		l.rotation.y = .5;
		for (let e = 0; e < 4; e++) {
			let e = fc(n, .015 + n() * .01, .5);
			e.position.set(-.3 + n() * .7, 0, -.2 + n() * .5), t.add(e);
		}
	},
	warren(e, t, n) {
		let r = new j();
		r.rotation.y = .45, t.add(r);
		let i = (e, t, n) => e > .62 ? dc(uc.grass, .78 + n * .22) : e > .3 ? dc(uc.light, .82 + n * .14) : dc(uc.base, .78 + n * .16), a = (e, t, a, o, s, c, l, u = i, d = r) => {
			let f = sc(new I(e, t, a, 2, 2, 1), n, l, u), p = new N(f, cc());
			return p.position.set(o, s + t / 2, c), d.add(p), p;
		}, o = (e, t, i, a, o, s = 1.25) => {
			let c = lc(i, a, o, 3);
			c.translate(0, a / 2, 0);
			let l = new N(sc(c, n, i * .14, (e, t, n) => e > .8 || e > .7 && n > .4 ? dc(uc.grass, .82 + n * .2) : dc(uc.base, .8 + n * .16)), cc());
			l.position.set(e, 0, t), l.rotation.y = n() * 6, l.scale.set(s, 1, 1), r.add(l);
		};
		{
			let e = new M(1, 10, 4, 0, Math.PI * 2, 0, Math.PI / 2);
			e.scale(1.15, .84, .9);
			let t = new N(sc(e, n, .1, (e, t, n) => e > .78 || e > .66 && n > .45 ? dc(uc.grass, .82 + n * .2) : dc(uc.base, .8 + n * .16)), cc());
			t.position.set(0, 0, -1.22), r.add(t);
		}
		o(-.74, -.86, .6, .56, 8, 1.1), o(.76, -.9, .62, .6, 8, 1.1);
		let s = .46, c = .62, l = 0, u = (e, t, r, i, o, s = 0) => {
			let c = [
				.86,
				.74,
				.92,
				.8
			][l++ % 4], u = a(t - e, i - .012, .3 + n() * .08, (e + t) / 2, r, o - .17, .034, (e, t, n) => e > .62 ? dc(uc.grass, .82 + n * .2) : dc(uc.base, c + n * .12));
			u.rotation.z = s;
		};
		for (let [e, t, n] of [[
			-.62,
			-.46 / 2 - .02,
			.02
		], [
			.25,
			.6,
			.02
		]]) u(e, t, 0, .26, n), u(e + .03, t - .02, .26, .22, n - .03), u(e + .08, t - .05, .48, .2, n - .07), u(e + .14, t - .1, .68, .14, n - .12);
		u(-.46 / 2 - .04, .27, .64, .2, -.04), u(-.32, .3, .84, .14, -.12);
		for (let [e, t, n, r] of [[
			-.86,
			-.2,
			.36,
			.34
		], [
			.84,
			-.24,
			.34,
			.4
		]]) a(n, r, .3, e, 0, t, .05);
		for (let [e, t] of [
			[-.42, .42],
			[.42, .4],
			[0, .6]
		]) {
			let n = B(t, .035, .2, z(null, "#3e4a2a"), e, e === 0 ? .98 : .82, e === 0 ? -.1 : -.12, r);
			n.rotation.x = .12;
		}
		for (let e = 0; e < 9; e++) {
			let t = -.6 + e * .15 + (n() - .5) * .05, i = B(.025, .05 + n() * .07, .012, z(null, "#3a4426"), t, (Math.abs(t) < .32 ? .9199999999999999 : .76) - n() * .03, 0, r);
			i.rotation.z = (n() - .5) * .5;
		}
		let d = z(null, "#1c1a1c");
		B(.04, c, .32, d, -.46 / 2 + .02, 0, -.16, r), B(.04, c, .32, d, s / 2 - .02, 0, -.16, r), B(s, .04, .32, d, 0, .58, -.16, r), B(s, .01, .32, z(null, "#2a2622"), 0, 0, -.16, r), B(s, c, .02, z(null, "#060506"), 0, 0, -.32, r);
		let f = (e, t, n = 0, i = !1) => {
			let a = z(null, "#" + new P("#5a4632").multiplyScalar(t).getHexString());
			for (let t of [-1, 1]) {
				let i = B(.065, .6, .065, a, t * (s / 2 - .035), 0, e, r);
				i.rotation.z = t * .05 + (t < 0 ? n : 0);
			}
			let o = B(.5800000000000001, .07, .08, a, 0, .55, e, r);
			return o.rotation.z = n * .8, i && B(.07, .05, .3, a, -.12, 0, e - .1, r).rotation.set(.1, .4, .05), a;
		};
		f(-.12, .45), f(-.24, .26, 0, !0);
		let p = new N(new I(.08, .035, .05), e.m.glass);
		p.userData.glow = !0, p.position.set(.05, .02, -.28), r.add(p);
		let m = f(.02, 1, -.06);
		for (let e = 0; e < 4; e++) {
			let t = B(.54 - e * .04, .035, .03, m, (n() - .5) * .03, .625 + e * .04, -.01 - e * .02, r);
			t.rotation.z = -.04 + (n() - .5) * .04;
		}
		let h = z(null, "#6a5640"), g = B(.32, .04, .018, h, -.07, .18, .07, r);
		g.rotation.z = .5;
		let _ = B(.26, .04, .018, h, .1, .06, .075, r);
		_.rotation.z = -.28;
		for (let [e, t, n] of [
			[
				-.3,
				.3,
				.3
			],
			[
				-.2,
				.38,
				1.2
			],
			[
				.36,
				.26,
				-.5
			]
		]) {
			let i = B(.3, .012, .045, h, e, 0, t, r);
			i.rotation.y = n;
		}
		let v = z(null, "#d8ccb0"), y = B(.075, .055, .12, v, .03, .57, .1, r);
		y.rotation.x = -.6;
		for (let e of [-1, 1]) B(.016, .014, .01, z(null, "#140c08"), .03 + e * .022, .62, .155, r);
		let b = z(null, "#5a3a28"), x = z(null, "#3e3226");
		for (let e = 0; e < 7; e++) {
			if (e === 3 || e === 5) continue;
			let t = B(.3, .018, .045, x, (n() - .5) * .02, 0, -.26 + e * .12, r);
			t.rotation.y = (n() - .5) * .18;
		}
		B(.018, .022, .86, b, -.09, .018, .12, r), B(.018, .022, .56, b, .09, .018, -.02, r), B(.018, .022, .24, b, .1, .03, .24, r).rotation.set(-.35, .12, 0);
		let S = new j();
		S.position.set(.42, .11, .42), S.rotation.set(0, -.5, Math.PI / 2 - .15), r.add(S);
		let C = z(null, "#4a3a2c");
		B(.2, .012, .26, C, 0, -.08, 0, S);
		for (let e of [-1, 1]) B(.012, .15, .26, C, e * .1, -.08, 0, S);
		for (let e of [-1, 1]) B(.2, .15, .012, C, 0, -.08, e * .13, S);
		for (let [e, t] of [
			[-.07, -.09],
			[.07, -.09],
			[-.07, .09],
			[.07, .09]
		]) {
			let n = new N(new A(.04, .04, .02, 8), b);
			n.rotation.z = Math.PI / 2, n.position.set(e * 1.6, -.11, t), S.add(n);
		}
		for (let e = 0; e < 6; e++) {
			let e = fc(n, .025 + n() * .015, .6);
			e.position.set(.28 + n() * .16, 0, .5 + n() * .16), r.add(e);
		}
		let w = new N(sc(lc(.42, .24, 9, 2).translate(0, .12, 0), n, .05, (e, t, n) => t > .16 && e > .6 ? dc(uc.grass, .8 + n * .2) : dc(uc.scree, .7 + n * .18)), cc());
		w.position.set(.86, 0, .22), w.scale.set(1, 1, .75), r.add(w);
		let T = new j();
		T.position.set(-.6, 0, .2), T.rotation.y = .25, r.add(T);
		let E = z(null, "#5e5446"), D = z(null, "#8a7a60");
		for (let [e, t] of [[0, 3], [1, 2]]) for (let n = 0; n < t; n++) {
			let r = new N(new A(.04, .042, .42, 7), E);
			r.rotation.z = Math.PI / 2, r.position.set(0, .04 + e * .072, (n - (t - 1) / 2) * .085), T.add(r);
			let i = new N(new A(.036, .036, .004, 7), D);
			i.rotation.z = Math.PI / 2, i.position.set(.212, r.position.y, r.position.z), T.add(i);
		}
		let ee = new N(new A(.04, .042, .4, 7), E);
		ee.rotation.set(0, .8, Math.PI / 2), ee.position.set(.08, .04, .24), T.add(ee), B(.035, .66, .035, e.m.beam, -.4, 0, .3, r);
		let O = B(.07, .06, .13, v, -.4, .62, .33, r);
		O.rotation.x = -.4;
		let te = B(.11, .16, .006, z(null, "#4e6a2e"), -.36, .4, .32, r);
		te.rotation.z = -.15;
		for (let [e, t, n, i] of [
			[
				-.5,
				.56,
				.24,
				.3
			],
			[
				-.58,
				.46,
				.28,
				.25
			],
			[
				.58,
				.62,
				.22,
				-.3
			]
		]) {
			let a = new N(new R(.022, n, 5), z(null, "#5a4430"));
			a.position.set(e, n / 2, t), a.rotation.set(.3, 0, i), r.add(a);
		}
		for (let e = 0; e < 7; e++) {
			let t = e / 7 * Math.PI * 2, i = fc(n, .026, .6);
			i.position.set(-.32 + Math.cos(t) * .08, 0, .66 + Math.sin(t) * .06), r.add(i);
		}
		let k = new N(new I(.06, .03, .05), e.m.glass);
		k.userData.glow = !0, k.position.set(-.32, .015, .66), r.add(k);
		for (let e = 0; e < 5; e++) {
			let e = B(.05, .01, .012, v, -.15 + n() * .4, 0, .5 + n() * .3, r);
			e.rotation.y = n() * 3;
		}
		for (let e = 0; e < 5; e++) {
			let e = n() * 6.28, t = fc(n, .07 + n() * .06, .7);
			t.position.set(Math.cos(e) * .95, 0, -.2 + Math.sin(e) * .35), r.add(t);
		}
	},
	milestone(e, t, n) {
		let r = z(ks("ashlar", "#6a6458", 41)), i = z(null, "#2a2620");
		B(.2, .05, .2, r, 0, 0, 0, t);
		let a = new N(new A(.06, .075, .34, 10), r);
		a.position.set(0, .22, 0), a.rotation.z = .04, t.add(a);
		let o = new N(new M(.062, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), r);
		o.position.set(.006, .39, 0), t.add(o), B(.008, .08, .004, i, -.03, .2, .072, t);
		for (let e of [-1, 1]) {
			let n = B(.008, .1, .004, i, .02, .19, .072, t);
			n.rotation.z = e * .55;
		}
		B(.22, .02, .18, r, .04, 0, .2, t).rotation.set(.06, .2, .03);
		for (let e = 0; e < 3; e++) {
			let r = fc(n, .03 + n() * .02, .6);
			r.position.set(-.14 + e * .12, 0, -.14 + n() * .05), t.add(r);
		}
	},
	lumbermill(e, t, n) {
		let r = new j();
		r.position.set(-.05, 0, -.1), t.add(r);
		for (let [t, n] of [
			[-.45, -.3],
			[.45, -.3],
			[-.45, .3],
			[.45, .3],
			[0, -.3],
			[0, .3]
		]) B(.05, .55, .05, e.m.beam, t, 0, n, r);
		B(.95, .04, .05, e.m.beam, 0, .53, .3, r), B(.95, .04, .05, e.m.beam, 0, .53, -.3, r), B(.95, .5, .03, e.m.wood, 0, .05, -.31, r), $s(e, r, .95, .62, .55, e.roofRise * .8), B(.55, .14, .14, e.m.wood, 0, 0, .02, r);
		let i = new N(new A(.06, .065, .62, 8), z(null, "#5a4430"));
		i.rotation.z = Math.PI / 2, i.position.set(0, .2, .02), r.add(i);
		let a = new N(new A(.11, .11, .01, 16), z(null, "#8a8a90"));
		a.rotation.x = Math.PI / 2, a.position.set(.12, .2, .1), r.add(a);
		let o = new j();
		o.position.set(.72, 0, .35), t.add(o);
		let s = z(null, "#4a3828");
		for (let [e, t] of [
			[0, 4],
			[1, 3],
			[2, 2]
		]) for (let n = 0; n < t; n++) {
			let r = new N(new A(.055, .055, .6, 8), s);
			r.rotation.x = Math.PI / 2, r.position.set((n - (t - 1) / 2) * .11, .055 + e * .095, 0), o.add(r);
			let i = new N(new A(.05, .05, .005, 8), z(null, "#9a7a52"));
			i.rotation.x = Math.PI / 2, i.position.set(r.position.x, r.position.y, .302), o.add(i);
		}
		for (let n = 0; n < 4; n++) B(.5, .025, .12, e.m.wood, -.72, n * .027, .42, t);
		for (let n = 0; n < 3; n++) B(.5, .025, .12, e.m.wood, -.72, n * .027, .56, t);
		let c = new j();
		c.position.set(-.75, 0, -.45), t.add(c), Qs(e, c, .42, .38, 0, .4, e.m.wood, !0, { doorZ: .1 }), Bs(c, e, {
			side: "z",
			wallW: .42,
			wallD: .38
		}, .1, .13, .28, !1), $s(e, c, .42, .38, .4, e.roofRise), Hs(c, e, -.1, -.05, .4, .28);
		for (let [e, n] of [
			[.25, .7],
			[.5, .82],
			[-.2, .78]
		]) {
			let r = new N(new A(.06, .07, .08, 8), s);
			r.position.set(e, .04, n), t.add(r);
			let i = new N(new A(.058, .058, .005, 8), z(null, "#9a7a52"));
			i.position.set(e, .083, n), t.add(i);
		}
		B(.02, .16, .02, e.m.beam, .5, .08, .82, t).rotation.z = .5, pc(t, e, .5, .5, .36);
	}
});
function hc(e, t, n, r, i, a = 0, o = 0, s = !1) {
	let c = new j();
	c.position.set(a, 0, o), e.add(c), B(n, r, i, s ? t.m.door : t.m.wood, 0, 0, 0, c);
	let l = .018, u = t.m.beam;
	for (let [e, t] of [
		[-1, -1],
		[1, -1],
		[-1, 1],
		[1, 1]
	]) B(l, r + .004, l, u, e * (n / 2 - l / 2 + .002), 0, t * (i / 2 - l / 2 + .002), c);
	for (let e of [0, r - l]) B(n + .004, l, l, u, 0, e, i / 2 - l / 2 + .002, c), B(l, l, i + .004, u, n / 2 - l / 2 + .002, e, 0, c);
	let d = B(Math.hypot(n, r) * .92, l * .8, l * .6, u, 0, r / 2 - l / 2, i / 2 + .004, c);
	return d.rotation.z = Math.atan2(r, n), c;
}
function gc(e, t, n, r, i = 1, a = 0) {
	let o = [
		[0, 0],
		[.05, .005],
		[.062, .03],
		[.058, .07],
		[.04, .1],
		[.018, .115],
		[.022, .13],
		[0, .135]
	].map(([e, t]) => new Oe(e * i, t * i)), s = new N(new Ye(o, 8), z(ks("plaster", "#8a7858", 21)));
	s.position.set(n, 0, r), s.rotation.set(.15, a, 0), s.scale.set(1, 1, .8), e.add(s), B(.03 * i, .01 * i, .03 * i, t.m.trim, n, .105 * i, r, e);
}
Object.assign(nc, {
	barrel(e, t) {
		let n = [
			[0, 0],
			[.078, 0],
			[.09, .05],
			[.094, .105],
			[.09, .16],
			[.078, .21],
			[0, .21]
		].map(([e, t]) => new Oe(e, t)), r = z(ks("planks", "#5a4430", 22));
		r.map = r.map.clone(), r.map.repeat.set(3, .5), r.map.needsUpdate = !0, t.add(new N(new Ye(n, 10), r));
		for (let n of [.045, .165]) {
			let r = new N(new A(.093, .093, .014, 10), e.m.trim);
			r.position.y = n, t.add(r);
		}
		let i = new N(new A(.076, .076, .006, 10), e.m.door);
		i.position.y = .21, t.add(i);
	},
	crate_A_big(e, t) {
		hc(t, e, .22, .21, .22);
	},
	crate_A_small(e, t) {
		hc(t, e, .14, .14, .14);
	},
	crate_B_big(e, t) {
		hc(t, e, .22, .2, .22, 0, 0, !0), hc(t, e, .13, .12, .13, .02, .01).position.y = .2;
	},
	crate_long_A(e, t) {
		hc(t, e, .4, .14, .2, 0, 0, !0);
		for (let e = 0; e < 3; e++) {
			let n = new N(new A(.012, .012, .38, 5), z(null, "#7a7a80"));
			n.rotation.z = Math.PI / 2, n.position.set(0, .15, -.05 + e * .05), t.add(n);
		}
	},
	sack(e, t) {
		gc(t, e, 0, 0, 1), gc(t, e, .07, .06, .8, 1.2);
	},
	wheelbarrow(e, t) {
		let n = new j();
		n.position.set(0, .1, .02), n.rotation.x = -.08, t.add(n), B(.22, .012, .3, e.m.wood, 0, 0, 0, n);
		for (let t of [-1, 1]) {
			let r = B(.012, .09, .32, e.m.wood, t * .115, 0, 0, n);
			r.rotation.z = t * .25;
		}
		B(.24, .09, .012, e.m.wood, 0, 0, .16, n), B(.24, .09, .012, e.m.wood, 0, 0, -.16, n).rotation.x = .35;
		let r = new N(new A(.075, .075, .03, 12), e.m.wood);
		r.rotation.z = Math.PI / 2, r.position.set(0, .075, .24), t.add(r);
		let i = new N(new L(.075, .008, 4, 14), e.m.trim);
		i.rotation.y = Math.PI / 2, i.position.copy(r.position), t.add(i);
		for (let n of [-1, 1]) {
			let r = B(.018, .018, .5, e.m.beam, n * .08, .12, -.02, t);
			r.rotation.x = -.12, B(.018, .1, .018, e.m.beam, n * .08, 0, -.14, t);
		}
		for (let e = 0; e < 3; e++) {
			let n = fc(Cs(40 + e), .035, .7);
			n.position.set(-.05 + e * .05, .1, .02 + e % 2 * .04), t.add(n);
		}
	},
	weaponrack(e, t) {
		for (let n of [-1, 1]) {
			let r = B(.018, .26, .018, e.m.beam, n * .1, 0, 0, t);
			r.rotation.x = .08;
		}
		B(.24, .018, .02, e.m.beam, 0, .2, .01, t), B(.24, .018, .02, e.m.beam, 0, .05, .03, t);
		let n = z(null, "#8c8c94");
		for (let [r, i] of [
			[-.06, "spear"],
			[0, "sword"],
			[.06, "spear"]
		]) {
			let a = B(.01, i === "spear" ? .34 : .24, .01, i === "spear" ? e.m.wood : n, r, .03, .035, t);
			if (a.rotation.x = -.12, i === "spear") {
				let e = new N(new R(.014, .05, 4), n);
				e.position.set(r, .39, 0), t.add(e);
			} else B(.06, .012, .014, e.m.trim, r, .08, .04, t);
		}
		let r = new N(new A(.07, .07, .015, 12), e.m.banner);
		r.rotation.x = Math.PI / 2 - .2, r.position.set(.14, .08, .06), t.add(r);
	},
	bucket_water(e, t) {
		let n = new N(new A(.065, .05, .1, 10, 1, !0), z(ks("planks", "#5a4430", 23)));
		n.position.y = .05, n.material.side = 2, t.add(n);
		let r = new N(new A(.06, .06, .005, 10), z(null, "#23384a"));
		r.position.y = .085, t.add(r);
		let i = new N(new A(.05, .05, .006, 10), e.m.wood);
		i.position.y = .003, t.add(i);
		let a = new N(new L(.06, .005, 4, 12, Math.PI), e.m.trim);
		a.position.y = .1, t.add(a);
	},
	resource_lumber(e, t) {
		let n = z(null, "#4a3828"), r = z(null, "#9a7a52");
		for (let [e, i] of [
			[0, 4],
			[1, 3],
			[2, 2]
		]) for (let a = 0; a < i; a++) {
			let o = new N(new A(.045, .048, .66, 7), n);
			o.rotation.z = Math.PI / 2, o.position.set(0, .045 + e * .078, (a - (i - 1) / 2) * .09), t.add(o);
			for (let e of [-1, 1]) {
				let n = new N(new A(.042, .042, .004, 7), r);
				n.rotation.z = Math.PI / 2, n.position.set(e * .331, o.position.y, o.position.z), t.add(n);
			}
		}
		for (let n of [-1, 1]) B(.03, .2, .03, e.m.beam, n * .2, 0, .2, t);
	},
	resource_stone(e, t) {
		let n = e.m.stone;
		for (let [e, r, i, a] of [
			[
				-.1,
				0,
				0,
				0
			],
			[
				.08,
				0,
				.02,
				.2
			],
			[
				0,
				0,
				-.12,
				-.1
			],
			[
				-.02,
				.09,
				-.03,
				.4
			],
			[
				.1,
				0,
				-.14,
				.1
			]
		]) B(.14, .09, .1, n, e, r, i, t).rotation.y = a;
	},
	flag_red(e, t) {
		B(.014, .42, .014, e.m.beam, 0, 0, 0, t);
		let n = new N(new I(.005, .12, .18), e.m.banner);
		n.position.set(0, .35, .095), n.rotation.y = .15, t.add(n);
		let r = new N(new M(.014, 6, 4), e.m.trim);
		r.position.y = .425, t.add(r);
	},
	stump(e, t) {
		let n = Cs(77), r = z(null, "#3e3024"), i = new N(new A(.07, .09, .1, 8), r);
		i.position.y = .05, t.add(i);
		let a = new N(new A(.068, .068, .005, 8), z(null, "#9a7a52"));
		a.position.y = .1, t.add(a);
		let o = new N(new L(.035, .004, 3, 10), z(null, "#7a5c3c"));
		o.rotation.x = Math.PI / 2, o.position.y = .103, t.add(o);
		for (let e = 0; e < 4; e++) {
			let i = e / 4 * 6.28 + n(), a = B(.03, .03, .08, r, Math.cos(i) * .09, 0, Math.sin(i) * .09, t);
			a.rotation.y = -i, a.rotation.x = .3;
		}
	},
	drywall(e, t) {
		let n = 1.16, r = e.rnd, i = [
			e.m.stone,
			e.m.stone,
			e.m.stoneDark
		];
		for (let e = 0; e < 3; e++) {
			let a = e * .045, o = .13 - e * .02;
			for (let s = -1.16 / 2 + e % 2 * .03; s < n / 2 - .01;) {
				let e = Math.min(.05 + r() * .06, n / 2 - s), c = B(o * (.85 + r() * .3), .04 + r() * .012, e - .006, i[r() * 3 | 0], (r() - .5) * .015, a, s + e / 2, t);
				c.rotation.y = (r() - .5) * .25, c.rotation.z = (r() - .5) * .12, s += e;
			}
		}
		for (let i = -1.16 / 2; i < n / 2 - .01;) {
			let a = Math.min(.08 + r() * .05, n / 2 - i), o = B(.11, .028, a - .008, e.m.stone, 0, .135, i + a / 2, t);
			o.rotation.x = (r() - .5) * .3, i += a;
		}
	},
	fence(e, t) {
		let n = 1.16;
		for (let r = 0; r <= 5; r++) {
			let i = -1.16 / 2 + n * r / 5;
			B(.035, .3, .035, e.m.beam, 0, 0, i, t);
			let a = new N(new R(.025, .04, 4), e.m.beam);
			a.position.set(0, .32, i), t.add(a);
		}
		for (let r of [.1, .22]) B(.02, .03, n, e.m.wood, .02, r, 0, t);
	}
}), Object.assign(nc, {
	stairsup(e, t) {
		let n = .36, r = .62, i = .43, a = z(ks("ashlar", "#4c4852", 31)), o = z(null, "#221f27");
		for (let e = 0; e < 8; e++) {
			let o = r / 8, s = i * (e + 1) / 8, c = r / 2 - (e + .5) * o;
			B(n, s, o, a, 0, 0, c, t), B(n, .008, .012, z(null, "#6a6570"), 0, s - .004, c + o / 2 - .006, t);
		}
		for (let e of [-1, 1]) for (let n = 0; n < 8; n++) {
			let o = r / 8, s = i * (n + 1) / 8 + .06, c = r / 2 - (n + .5) * o;
			B(.05, s, o, a, e * .205, 0, c, t);
		}
		let s = i, c = -.62 / 2 - .02;
		for (let e of [-1, 1]) B(.07, .42, .08, a, e * .19, s, c, t);
		B(.52, .08, .09, a, 0, .8300000000000001, c, t);
		let l = new N(new I(.32, .38, .02), e.m.glass);
		l.userData.glow = !0, l.position.set(0, .62, -.35000000000000003), t.add(l), B(.52, .5, .05, o, 0, s, -.39, t);
		for (let n of [-1, 1]) {
			let i = new N(new I(.03, .05, .03), e.m.glass);
			i.userData.glow = !0, i.position.set(n * .21, .3105, r / 2 - .08), t.add(i), B(.015, .1, .015, e.m.trim, n * .21, .2005, r / 2 - .08, t);
		}
	},
	stairsdown(e, t) {
		let n = .3, r = .3, i = .026, a = .44, o = z(ks("ashlar", "#3a3642", 37)), s = z(null, "#0a080e"), c = z(null, "#9a94a2"), l = z(ks("ashlar", "#58525e", 33)), u = -.25, d = .25, f = z(ks("ashlar", "#26232c", 38));
		for (let e of [-1, 1]) B(i, d * .55, 2 * r, f, e * (n - i / 2), u, 0, t), B(i, d * .45, 2 * r, o, e * (n - i / 2), -.11249999999999999, 0, t);
		let p = .15;
		for (let e of [-1, 1]) B(n - p / 2, d, i, o, e * .1875, u, -.287, t);
		B(p, .07, i, o, 0, -.07, -.287, t), B(.18, .014, .034, c, 0, -.07, -.283, t), B(p, .15, .06, s, 0, -.22, -.35, t);
		let m = new N(new I(.126, .13, .006), e.m.glass);
		m.userData.glow = !0, m.position.set(0, -.155, -.312), t.add(m);
		let h = .5479999999999999, g = a / 12, _ = (e) => z(ks("ashlar", "#" + new P("#7c7686").lerp(new P("#34303c"), e).getHexString(), 31));
		for (let e = 0; e < 12; e++) {
			let n = -.22 * (e + 1) / 13, i = r - (e + .5) * g;
			B(h, n - u, g, _(e / 12), 0, u, i, t), B(h, .006, .012, c, 0, n - .003, i + g / 2 - .006, t);
		}
		B(h, .03, 2 * r - a, _(1), 0, u, -.22, t);
		let v = .024, y = .03;
		for (let e of [-1, 1]) B(y, v, .63, l, e * .315, 0, -.03 / 2, t);
		B(.6599999999999999, v, y, l, 0, 0, -.3 - y / 2, t);
		for (let e of [-1, 1]) B(.045, .05, .045, l, e * .315, 0, .27799999999999997, t);
		let b = .34, x = .04, S = (e, n, r, i) => {
			B(e, .002, n, s, r, -.002, i, t).userData.mask = !0;
		};
		S(.98, b, .30000000000000004 / 2, .47), S(x, .64, -.3 - x / 2, -.04 / 2), S(b, .64, .47, -.04 / 2), S(.98, x, .30000000000000004 / 2, -.3 - x / 2);
	}
});
var _c = rc("#e6e8ec"), vc = rc("#1e1a18"), yc = rc("#151318"), bc = rc("#4a4a3a"), xc = rc("#6a5a38"), Sc = z(ks("thatch", "#635c44", 61)), Cc = rc("#5a4430"), wc = rc("#a8865a");
function Tc(e, t, n, r, i, a) {
	let o = n / 2 + .07, s = i * n / 2, c = s * (n * .3 + .03) / o;
	As(e, t + .03, n * .6, r + s - c + .012, c, _c, a, .03, .02);
}
function Ec(e, t, n, r = 3, i = .22, a = !0) {
	for (let o = 0; o < r; o++) for (let s = 0; s < r - o; s++) {
		let c = new N(new A(.028, .03, i, 6), Cc), l = (s - (r - o - 1) / 2) * .058, u = .03 + o * .05;
		a ? (c.rotation.z = Math.PI / 2, c.position.set(t, u, n + l)) : (c.rotation.x = Math.PI / 2, c.position.set(t + l, u, n)), e.add(c);
		for (let r of [-1, 1]) {
			let o = new N(new A(.026, .026, .004, 6), wc);
			a ? (o.rotation.z = Math.PI / 2, o.position.set(t + r * i / 2, u, n + l)) : (o.rotation.x = Math.PI / 2, o.position.set(t + l, u, n + r * i / 2)), e.add(o);
		}
	}
}
function Dc(e, t, n, r, i, a, o) {
	if (e.key === "fens") {
		B(.18, .14, .006, bc, n / 2 - .14, .12, r / 2 + .012, t);
		let e = new N(new A(.035, .022, .09, 7), xc);
		e.position.set(n / 2 + .05, .045, r / 2 - .1), t.add(e);
	} else if (e.key === "reach") {
		B(.1, i * .8, .01, vc, n / 2 - .12, i * .2, -r / 2 - .006, t), B(.14, .08, .1, e.m.wood, n / 2 + .09, 0, r / 2 - .12, t);
		let a = new N(new je(.05, 0), yc);
		a.scale.y = .5, a.position.set(n / 2 + .09, .09, r / 2 - .12), t.add(a);
	} else e.key === "heights" && (t.userData.snowed || Tc(t, n, r, i, a, e.m.lower), Ec(t, n / 2 + .06, -.02, 3, .36, !1));
}
function Oc(e) {
	return e.key === "fens" ? Sc : e.m.roof;
}
function kc(e, t, n, r, i, a, o = !0) {
	let s = new j();
	t.add(s), o || (s.rotation.y = Math.PI / 2);
	let [c, l] = o ? [n, r] : [r, n], u = e.key === "fens";
	if (As(s, c, l, i, a * l / 2, Oc(e), e.key === "vale" || e.key === "fens" ? e.m.upper : e.m.lower, u ? .1 : .07, u ? .08 : .04), u) {
		let e = new N(new A(.05, .05, c + .18, 8), Sc);
		e.rotation.z = Math.PI / 2, e.position.y = i + a * l / 2 + .01, s.add(e);
	}
	return e.key === "heights" && (Tc(s, c, l, i, a, e.m.lower), t.userData.snowed = !0), s;
}
function Ac(e, t, n, r, i, a) {
	let o = e.key === "vale" || e.key === "fens";
	o && B(n + .03, .1, r + .03, e.m.stone, 0, 0, 0, t), Qs(e, t, n, r, 0, i, o ? e.m.upper : e.m.lower, !0, {
		doorZ: a,
		timber: o
	});
}
function jc(e, t, n, r, i) {
	for (let [a, o] of [
		[-n / 2, -r / 2],
		[n / 2, -r / 2],
		[-n / 2, r / 2],
		[n / 2, r / 2],
		[0, r / 2],
		[0, -r / 2]
	]) B(.035, i, .035, e.m.beam, a, 0, o, t);
	B(n + .06, .025, r + .08, e.m.wood, 0, i, .02, t);
	for (let n = 0; n < 2; n++) B(.14, .02, .05, e.m.wood, -.1, i * (.3 + n * .35), r / 2 + .06 + (1 - n) * .05, t);
}
Object.assign(nc, {
	cottage(e, t, n) {
		let r = e.key === "fens", i = r ? .07 : 0, a = .58, o = .48, s = .46, c = new j();
		c.position.y = i, t.add(c), r && jc(e, t, a, o, i), Ac(e, c, a, o, s, .1), Bs(c, e, {
			side: "z",
			wallW: a,
			wallD: o
		}, .1, .16, .34, !e.timber), kc(e, c, a, o, s, e.roofRise * 1.15), Hs(c, e, -.58 / 2 + .1, -.48 / 4, s, .3), Dc(e, c, a, o, s, e.roofRise * 1.15, n), e.key === "vale" && (Js(t, e, -.58 / 2 - .02, .44, -.04, .44), qs(t, e, -.58 / 2 + .06, .33999999999999997, .05));
	},
	longhouse(e, t, n) {
		let r = e.key === "fens", i = r ? .07 : 0, a = 1.08, o = .5, s = .46, c = new j();
		c.position.y = i, t.add(c), r && jc(e, t, a, o, i), Ac(e, c, a, o, s, -.28);
		for (let t of [-.28, .3]) Bs(c, e, {
			side: "z",
			wallW: a,
			wallD: o
		}, t, .16, .34, !e.timber);
		kc(e, c, a, o, s, e.roofRise * 1.05), Hs(c, e, -.12, -.5 / 4, s, .28), Hs(c, e, a / 2 - .1, -.5 / 4, s, .28), Dc(e, c, a, o, s, e.roofRise * 1.05, n), e.key === "reach" && B(.12, .07, .09, e.m.wood, -1.08 / 2 - .08, 0, o / 2 - .1, c);
	},
	workshop(e, t, n) {
		let r = .56, i = .52, a = .48;
		Ac(e, t, r, i, a, -.08), Bs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, -.08, .2, .36, !1), kc(e, t, r, i, a, e.roofRise), Hs(t, e, -.56 / 2 + .1, -.52 / 4, a, .3);
		let o = new j();
		o.position.set(.48000000000000004, 0, 0), t.add(o);
		for (let [t, n] of [[.17, i / 2 - .02], [.17, -.52 / 2 + .02]]) B(.035, .34, .035, e.m.beam, t, 0, n, o);
		let s = B(.44, .03, .6, Oc(e), 0, .36, 0, o);
		if (s.rotation.z = -.32, e.key === "heights") {
			let e = B(.4, .015, i * .9, _c, -.01, .39, 0, o);
			e.rotation.z = -.32;
		}
		if (e.key === "vale") {
			B(.26, .03, .12, e.m.wood, 0, .13, 0, o);
			for (let [t, n] of [
				[-.11, -.04],
				[.11, -.04],
				[-.11, .04],
				[.11, .04]
			]) B(.018, .13, .018, e.m.beam, t, 0, n, o);
			for (let t = 0; t < 4; t++) B(.3, .012, .04, e.m.wood, -.02, .012 * t, -.17, o);
		}
		if (e.key === "fens") {
			let t = B(.34, .05, .12, e.m.wood, 0, .08, .02, o);
			t.rotation.x = Math.PI;
			for (let t of [-.13, .13]) B(.03, .08, .03, e.m.beam, t, 0, .02, o);
		}
		if (e.key === "reach") {
			B(.16, .14, .14, e.m.stone, 0, 0, 0, o);
			let t = B(.12, .02, .1, z(null, "#e0a050"), 0, .14, 0, o);
			t.userData.glow = !0, B(.1, .06, .05, e.m.dark, .02, 0, .14, o);
		}
		if (e.key === "heights") {
			let e = new N(new A(.06, .07, .1, 8), Cc);
			e.position.set(0, .05, .08), o.add(e), Ec(o, 0, -.12, 3, .3, !0);
		}
		Gs(t, e, r / 2 - .08, .42, i / 2);
	},
	windmill(e, t, n) {
		let r = new j();
		r.scale.setScalar(1.35), t.add(r);
		let i = new N(new A(.24, .28, .42, 12), e.m.stone);
		i.position.y = .21, r.add(i);
		let a = new N(new A(.26, .26, .03, 12), e.m.stoneDark);
		a.position.y = .42, r.add(a), Bs(r, e, {
			side: "z",
			wallW: .5,
			wallD: .5
		}, 0, .12, .24, !0);
		let o = new j();
		o.position.y = .44, r.add(o), B(.34, .42, .38, e.m.wood, 0, 0, 0, o);
		let s = new j();
		s.position.y = .42, o.add(s), As(s, .38, .38, 0, .18, e.m.roof, e.m.wood, .04, .03), Ms(o, e, {
			side: "x",
			wallW: .34,
			wallD: .38
		}, 0, .26, .07, .08, { lit: !0 });
		let c = new j();
		c.position.set(0, .3, .23), o.add(c);
		let l = Ls(new N(new A(.03, .03, .08, 8), e.m.beam));
		l.rotation.x = Math.PI / 2, c.add(l);
		let u = new j();
		u.position.z = .05, u.rotation.z = .35, c.add(u);
		let d = rc("#cfc4a8");
		for (let t = 0; t < 4; t++) {
			let n = new j();
			n.rotation.z = t * Math.PI / 2, u.add(n), n.add(Ls(B(.025, .62, .02, e.m.beam, 0, 0, 0)));
			let r = Ls(B(.12, .46, .01, d, .075, .14, .008));
			n.add(r);
			for (let t = 0; t < 6; t++) n.add(Ls(B(.14, .01, .014, e.m.beam, .07, .16 + t * .08, .012)));
		}
		let f = Ls(B(.03, .03, .5, e.m.beam, 0, .06, -.38));
		f.rotation.x = -.5, o.add(f);
	},
	cart(e, t, n) {
		let r = new j();
		r.position.y = .12, r.rotation.x = .12, t.add(r), B(.24, .025, .4, e.m.wood, 0, 0, 0, r);
		for (let t of [-1, 1]) B(.015, .08, .4, e.m.wood, t * .12, .025, 0, r);
		B(.24, .08, .015, e.m.wood, 0, .025, -.2, r);
		for (let t of [-1, 1]) {
			let n = B(.022, .022, .28, e.m.beam, t * .09, -.02, .32, r);
			n.rotation.x = .18;
		}
		for (let n of [-1, 1]) {
			let r = new j();
			r.position.set(n * .15, .11, -.02), t.add(r);
			let i = new N(new L(.1, .012, 5, 16), e.m.wood);
			i.rotation.y = Math.PI / 2, r.add(i);
			let a = new N(new L(.104, .006, 4, 16), e.m.trim);
			a.rotation.y = Math.PI / 2, r.add(a);
			for (let t = 0; t < 6; t++) {
				let n = B(.01, .2, .012, e.m.beam, 0, -.1, 0, r);
				n.rotation.x = t * Math.PI / 6, n.position.y = 0, n.geometry.translate(0, 0, 0);
			}
			let o = new N(new A(.02, .02, .04, 8), e.m.beam);
			o.rotation.z = Math.PI / 2, r.add(o);
		}
		qs(r, e, -.03, -.05, .08), qs(r, e, .05, .08, .07), gc(r, e, .06, -.12, .8);
	},
	handcart(e, t, n) {
		let r = new j();
		r.position.y = .07, r.rotation.x = .18, t.add(r), B(.16, .07, .22, e.m.wood, 0, 0, 0, r);
		for (let t of [-1, 1]) B(.014, .014, .24, e.m.beam, t * .07, .05, .2, r);
		for (let n of [-1, 1]) {
			let r = new N(new A(.06, .06, .02, 10), e.m.wood);
			r.rotation.z = Math.PI / 2, r.position.set(n * .1, .06, -.04), t.add(r);
		}
		hc(r, e, .09, .08, .09, -.02, -.03), gc(r, e, .04, .05, .7, .4);
	},
	table(e, t, n) {
		B(.36, .02, .14, e.m.wood, 0, .12, 0, t);
		for (let n of [-1, 1]) {
			let r = B(.02, .12, .12, e.m.beam, n * .14, 0, 0, t);
			r.rotation.y = 0;
		}
		for (let n of [-1, 1]) {
			B(.34, .016, .05, e.m.wood, 0, .07, n * .12, t);
			for (let r of [-1, 1]) B(.016, .07, .04, e.m.beam, r * .13, 0, n * .12, t);
		}
		let r = rc("#7a6a5a"), i = rc("#a8804a");
		for (let [e, n] of [
			[-.1, -.03],
			[.04, .04],
			[.12, -.02]
		]) {
			let i = new N(new A(.014, .012, .03, 6), r);
			i.position.set(e, .155, n), t.add(i);
		}
		let a = new N(new A(.018, .024, .05, 7), r);
		a.position.set(-.02, .165, -.02), t.add(a), B(.08, .008, .05, e.m.wood, .1, .14, .03, t);
		let o = new N(new M(.025, 6, 4), i);
		o.scale.set(1.3, .7, 1), o.position.set(.1, .16, .03), t.add(o);
	},
	standard(e, t, n) {
		B(.08, .05, .08, e.m.stone, 0, 0, 0, t), B(.022, .78, .022, e.m.beam, 0, .05, 0, t), B(.2, .018, .018, e.m.beam, 0, .78, .012, t), B(.17, .36, .008, e.m.banner, 0, .42, .02, t), B(.17, .03, .01, e.m.trim, 0, .6, .025, t), B(.17, .03, .01, e.m.trim, 0, .47, .025, t);
		let r = new N(new R(.018, .05, 6), e.m.trim);
		r.position.y = .86, t.add(r);
		let i = B(.17, .05, .008, e.m.banner, 0, .37, .02, t);
		i.scale.x = .6, i.position.x = 0;
	},
	boxes(e, t, n) {
		hc(t, e, .18, .16, .18, -.08, -.04), hc(t, e, .13, .12, .13, -.08, -.04, !0).position.y = .16, hc(t, e, .14, .12, .14, .11, -.06, !0), nc.barrel(e, (() => {
			let e = new j();
			return e.position.set(.12, 0, .12), e.scale.setScalar(.9), t.add(e), e;
		})()), gc(t, e, -.04, .12, .9), gc(t, e, -.14, .1, .8, 1);
	},
	foodstand(e, t, n) {
		let r = .42, i = .24;
		for (let [n, a] of [
			[-.42 / 2, -.24 / 2],
			[r / 2, -.24 / 2],
			[-.42 / 2, i / 2],
			[r / 2, i / 2]
		]) B(.025, .38, .025, e.m.beam, n, 0, a, t);
		let a = B(.52, .02, .38, e.m.banner, 0, .38, .03, t);
		a.rotation.x = .22;
		for (let n = 0; n < 5; n++) B(.52 / 10, .022, .39, e.m.trim, -.52 / 2 + .52 * (n * 2 + 1) / 10, .381, .03, t).rotation.x = .22;
		B(r, .13, .1, e.m.wood, 0, 0, i / 2 - .04, t), B(r, .02, .19999999999999998, e.m.wood, 0, .18, -.04, t);
		let o = {
			vale: [
				"#8a2a20",
				"#5a7a30",
				"#a8804a"
			],
			fens: [
				"#5a6050",
				"#7a7a6a",
				"#a8804a"
			],
			reach: [
				"#8a6a40",
				"#a8804a",
				"#6a4a3a"
			],
			heights: [
				"#d8c890",
				"#a8804a",
				"#7a4a3a"
			]
		}[e.key] || [
			"#8a2a20",
			"#5a7a30",
			"#a8804a"
		];
		for (let e = 0; e < 3; e++) {
			let r = -.13 + e * .13, a = new N(new A(.05, .04, .04, 8), xc);
			a.position.set(r, .15, i / 2 - .04), t.add(a);
			for (let a = 0; a < 5; a++) {
				let a = new N(new v(.018, 0), rc(o[e]));
				a.position.set(r + (n() - .5) * .05, .18 + n() * .01, i / 2 - .04 + (n() - .5) * .05), t.add(a);
			}
		}
		for (let n = 0; n < 4; n++) B(.025, .07, .02, rc(e.key === "fens" ? "#4a5048" : "#8a5a3a"), -.42 / 2 + .07 + n * .1, .25, -.09, t);
		gc(t, e, .27, .04, .8), nc.barrel(e, (() => {
			let e = new j();
			return e.position.set(-.42 / 2 - .07, 0, -.02), e.scale.setScalar(.8), t.add(e), e;
		})());
	},
	lanewell(e, t, n) {
		for (let [n, r, i, a] of [
			[
				0,
				-.11,
				.26,
				.04
			],
			[
				0,
				.11,
				.26,
				.04
			],
			[
				-.11,
				0,
				.04,
				.18
			],
			[
				.11,
				0,
				.04,
				.18
			]
		]) B(i, .15, a, e.m.stone, n, 0, r, t);
		B(.18, .005, .18, rc("#1d3040"), 0, .1, 0, t);
		for (let n of [-1, 1]) {
			let r = B(.024, .4, .024, e.m.beam, n * .14, 0, 0, t);
			r.rotation.z = n * .12;
		}
		let r = new N(new A(.035, .035, .26, 8), e.m.wood);
		r.rotation.z = Math.PI / 2, r.position.y = .36, t.add(r), B(.012, .012, .08, e.m.trim, .16, .36, .04, t), B(.012, .05, .012, e.m.trim, .16, .36, .08, t), B(.006, .14, .006, e.m.trim, 0, .22, 0, t);
		let i = new N(new A(.035, .028, .05, 8), e.m.wood);
		i.position.set(0, .2, 0), t.add(i), e.key === "heights" && B(.27, .012, .27, _c, 0, .15, 0, t);
	},
	lamppost(e, t, n) {
		B(.07, .05, .07, e.m.stone, 0, 0, 0, t), B(.025, .56, .025, e.m.beam, 0, .05, 0, t), B(.012, .012, .12, e.m.trim, 0, .58, .05, t);
		let r = new N(new I(.06, .08, .06), e.m.glass);
		r.userData.glow = !0, r.position.set(0, .51, .1), t.add(r), B(.075, .016, .075, e.m.trim, 0, .55, .1, t), B(.006, .03, .006, e.m.trim, 0, .56, .1, t);
	},
	bench(e, t, n) {
		B(.3, .018, .08, e.m.wood, 0, .08, 0, t);
		for (let n of [-1, 1]) B(.018, .08, .07, e.m.beam, n * .12, 0, 0, t);
		for (let n of [-1, 1]) B(.016, .1, .016, e.m.beam, n * .12, .09, -.035, t);
		B(.3, .03, .014, e.m.wood, 0, .16, -.035, t);
	},
	trough(e, t, n) {
		B(.36, .03, .14, e.m.stone, 0, 0, 0, t);
		for (let n of [-1, 1]) B(.36, .1, .025, e.m.stone, 0, 0, n * .0575, t);
		for (let n of [-1, 1]) B(.025, .1, .09, e.m.stone, n * .1675, 0, 0, t);
		B(.31, .006, .09, rc("#2a4458"), 0, .07, 0, t), B(.03, .14, .03, e.m.beam, .2, 0, -.04, t), B(.012, .012, .06, e.m.trim, .2, .13, -.01, t);
	},
	woodpile(e, t, n) {
		Ec(t, 0, 0, 4, .34, !1);
		for (let n of [-1, 1]) B(.025, .3, .025, e.m.beam, n * .14, 0, .04, t);
		let r = B(.36, .018, .22, e.m.wood, 0, .3, 0, t);
		r.rotation.x = -.25;
	}
});
var Mc = () => z(ks("field", "#2a282c", 71, "#4a443e")), Nc = () => z(null, "#2b2624"), Pc = () => new l({
	color: "#ff8a3a",
	emissive: new P("#ff5a18"),
	emissiveIntensity: 1.6
});
function Fc(e, t, n, r, i, a) {
	let o = new j();
	o.position.set(t, n, r), e.add(o);
	let s = new N(new L(i, i * .07, 5, 24), a);
	o.add(s);
	let c = new N(new A(i * .14, i * .14, i * .3, 8), a);
	c.rotation.x = Math.PI / 2, o.add(c);
	for (let e = 0; e < 8; e++) {
		let t = new N(new I(i * .06, i * 1.9, i * .06), a);
		t.rotation.z = e / 8 * Math.PI, o.add(t);
	}
	return o;
}
Object.assign(nc, {
	gatewheel(e, t, n) {
		let r = e.m.beam, i = Nc(), a = .78;
		for (let e of [-1, 1]) {
			let n = B(.06, a * 1.04, .06, r, e * .34, 0, 0, t);
			n.rotation.z = e * .28, n.position.x = e * .24;
			let i = B(.045, a * 1.05, .045, r, e * .17, 0, -.2, t);
			i.rotation.x = -.38;
		}
		B(.36, .06, .12, r, 0, a, 0, t), B(.05, .05, .05, i, 0, .86, .02, t), Fc(t, 0, .98, .07, .2, i), B(.012, .8400000000000001, .012, i, .2, .1, .07, t), pc(t, e, .2, .76, .1);
	},
	stack(e, t, n) {
		let r = Mc(), i = Nc();
		B(.46, .18, .46, r, 0, 0, 0, t), B(.5, .04, .5, e.m.stoneDark, 0, .18, 0, t);
		let a = new A(.13 * Math.SQRT2, .19 * Math.SQRT2, 1.58, 4, 1, !0);
		a.rotateY(Math.PI / 4), a.translate(0, 1.01, 0), t.add(new N(a, r));
		for (let [e, n] of [
			[.5, .18],
			[.95, .16],
			[1.4, .14]
		]) B(n * 2 + .03, .035, n * 2 + .03, i, 0, e, 0, t);
		B(.32, .06, .32, i, 0, 1.8, 0, t), B(.2, .02, .2, Pc(), 0, 1.845, 0, t), B(.12, .16, .02, Pc(), 0, .02, .235, t);
	},
	works(e, t, n) {
		let r = Mc(), i = Nc(), a = .84, o = .66, s = .5;
		B(a, s, o, r, 0, 0, -.04, t), B(.4, .42, .04, z(null, "#120d0c"), -.1, 0, o / 2 - .03, t), B(.24, .16, .03, Pc(), -.1, .04, o / 2 - 0, t);
		for (let e of [-1, 1]) B(.05, .44, .05, i, -.1 + e * .22, 0, o / 2 - .01, t);
		B(.5, .05, .06, i, -.1, .42, o / 2 - .01, t), $s(e, t, a, .74, s, .75), B(.16, .95, .16, r, .02, 0, -.25, t), B(.2, .04, .2, i, .02, .95, -.25, t), B(.12, .02, .12, Pc(), .02, .985, -.25, t);
		let c = new N(sc(lc(.14, .09, 7).translate(0, .045, 0), n, .02, (e, t, n) => dc(oc("#1a1718"), .9 + n * .3)), cc());
		c.position.set(.3, 0, .41000000000000003), t.add(c), B(.1, .06, .05, i, .14, .04, .45, t), B(.06, .04, .04, i, .14, 0, .45, t), pc(t, e, .36, .42, .34);
	},
	pithead(e, t, n) {
		let r = Mc(), i = Nc(), a = e.m.beam, o = (e, r, i, a) => {
			let o = new N(sc(lc(i, a, 9, 2).translate(0, a / 2, 0), n, i * .12, (e, t, n) => dc(oc(e > .5 ? "#2c2826" : "#211e1d"), .9 + n * .3)), cc());
			o.position.set(e, 0, r), o.rotation.y = n() * 6, t.add(o);
		};
		o(-.72, -.62, .62, .5), o(-.15, -.95, .42, .34), o(.55, -.9, .34, .26);
		for (let e = 0; e < 5; e++) {
			let e = fc(n, .06 + n() * .05, .6);
			e.traverse((e) => {
				e.isMesh && (e.material = z(null, "#2a2624"));
			}), e.position.set(-1 + n() * .6, e.position.y, -.1 + n() * .4), t.add(e);
		}
		let s = .05, c = .18;
		B(.5, .12, .42, r, s, 0, c, t), B(.46, .46, .38, e.m.wood, s, .12, c, t), B(.24, .42, .04, z(null, "#0b0a0e"), s, .02, .38, t);
		for (let e of [-1, 1]) B(.045, .46, .045, a, s + e * .14, 0, .39, t);
		B(.34, .05, .05, a, s, .44, .39, t);
		let l = new j();
		l.position.set(s, 0, c), t.add(l), $s(e, l, .5, .42, .58, .6), pc(t, e, -.15000000000000002, .42, .42);
		let u = s, d = .09999999999999999, f = 1.28;
		for (let [e, n] of [
			[-1, -1],
			[1, -1],
			[-1, 1],
			[1, 1]
		]) B(.05, f * 1.02, .05, a, u + e * .16, 0, d + n * .12, t).rotation.set(n * .06, 0, e * .08);
		for (let e of [.7, 1]) B(.3, .035, .035, a, u, e, .2, t), B(.035, .035, .24, a, .18, e, d, t);
		B(.34, .05, .3, a, u, f, d, t);
		let p = B(.045, 1.25, .045, a, u, 0, -.32, t);
		p.rotation.x = .36, p.position.y = .58, Fc(t, u, 1.48, .12, .2, i);
		let m = .62, h = -.25;
		B(.36, .42, .34, r, m, 0, h, t);
		let g = new j();
		g.position.set(m, 0, h), t.add(g), $s(e, g, .36, .34, .42, .8, !1);
		let _ = B(.1, .12, .01, e.m.glass, .56, .2, -.07500000000000001, t);
		_.userData.glow = !0, B(.1, 1.1, .1, r, .72, 0, -.35, t), B(.13, .03, .13, i, .72, 1.1, -.35, t);
		let v = new N(new I(.01, .01, 1), i), y = new F(.5, .4, h), b = new F(.15000000000000002, 1.48, .12);
		v.scale.z = y.distanceTo(b), v.position.copy(y).add(b).multiplyScalar(.5), v.lookAt(b), t.add(v);
		for (let n = 0; n < 6; n++) B(.22, .015, .035, e.m.wood, s, 0, .5 + n * .09, t);
		for (let e of [-1, 1]) B(.015, .02, .56, i, s + e * .07, .015, .73, t);
		let x = new j();
		x.position.set(s, .02, .8), t.add(x), B(.18, .1, .22, i, 0, .03, 0, x);
		for (let [e, t] of [
			[-.08, -.07],
			[.08, -.07],
			[-.08, .07],
			[.08, .07]
		]) {
			let n = new N(new A(.03, .03, .02, 8), i);
			n.rotation.z = Math.PI / 2, n.position.set(e, .03, t), x.add(n);
		}
		let S = new N(sc(new je(.08, 0), n, .03, () => dc(oc("#3a3432"), 1)), cc());
		S.position.y = .14, S.scale.y = .6, x.add(S), Ks(t, e, .42, .42), Ks(t, e, .5, .36), pc(t, e, .36, .46, .5);
	}
});
var Ic = () => new l({
	color: "#8a6a34",
	roughness: .45,
	metalness: .6
});
function Lc(e, t, n, r, i, a, o = "#2a2624", s = !1) {
	let c = new N(sc(lc(i, a, 9, 2).translate(0, a / 2, 0), t, i * .14, (e, t, n) => dc(oc(e > .55 ? o : "#1e1b1a"), .85 + n * .35)), cc());
	if (c.position.set(n, 0, r), c.rotation.y = t() * 6, e.add(c), s) for (let o = 0; o < 3; o++) {
		let o = t() * 6.28;
		B(.05 + t() * .04, .012, .02, Pc(), n + Math.cos(o) * i * .55, a * .3, r + Math.sin(o) * i * .55, e).rotation.set(.5, o, .3);
	}
	return c;
}
function Rc(e, t, n, r, i, a) {
	B(.36, .2, .025, a, t, n, r, e);
	let o = new j();
	o.position.set(t, n + .1, r + .02), e.add(o);
	let s = B(.24, .018, .01, i, 0, -.01, 0, o);
	s.rotation.z = .6;
	let c = B(.024, .06, .01, i, .09, .04, 0, o);
	c.rotation.z = .6, B(.012, .13, .01, i, 0, -.08, .005, o), B(.24, .012, .01, i, 0, .04, .005, o);
	for (let e of [-1, 1]) B(.006, .06, .006, i, e * .11, -.02, .005, o), B(.07, .012, .012, Ic(), e * .11, -.03, .005, o);
}
Object.assign(nc, {
	assayhouse(e, t, n) {
		let r = Mc(), i = Nc(), a = .5, o = .5, s = .34;
		B(1.22, o, a, r, 0, 0, -.06, t), B(1.26, s, .54, e.m.wood, 0, o, -.06, t);
		for (let n = 0; n < 5; n++) B(.03, s, .01, e.m.beam, -.55 + n * 1.1 / 4, o, a / 2 - .03, t);
		$s(e, t, 1.26, .54, .8400000000000001, .9);
		for (let n of [-.42, .42]) {
			let r = B(.1, .12, .012, e.m.glass, n, .6, a / 2 - .03, t);
			r.userData.glow = !0;
		}
		B(.34, .48, .03, e.m.door, 0, 0, a / 2 - .05, t), B(.006, .46, .035, e.m.trim, 0, 0, a / 2 - .045, t);
		for (let n of [-1, 1]) B(.05, .52, .05, e.m.beam, n * .2, 0, a / 2 - .03, t);
		B(.46, .05, .06, e.m.beam, 0, .5, a / 2 - .03, t), Rc(t, 0, .6, a / 2 - .01, i, e.m.signboard), pc(t, e, -.28, .44, .27), pc(t, e, .28, .44, .27), B(.04, .5, .04, e.m.beam, .48, 0, .1, t), B(.3, .025, .025, i, .48, .5, .1, t), B(.004, .18, .004, i, .36, .32, .1, t), B(.1, .012, .1, Ic(), .36, .31, .1, t);
		for (let [n, r] of [[-.5, .12], [-.42, .18]]) B(.1, .08, .1, e.m.wood, n, 0, r, t);
	},
	forgedoor(e, t, n) {
		let r = z(ks("ashlar", "#3e3836", 81)), i = Ic(), a = Nc(), o = (e, r, i, a) => {
			let o = lc(i, a, 8, 3);
			o.translate(0, a / 2, 0);
			let s = new N(sc(o, n, i * .22, (e, t, n) => dc(oc(e > .5 ? "#3c3634" : "#221e1d"), .85 + n * .3)), cc());
			s.position.set(e, 0, r), s.rotation.y = n() * 6, t.add(s);
		};
		o(0, -.35, .8, 1.3), o(-.5, -.1, .45, .85), o(.52, -.15, .45, .9), o(.1, -.7, .6, 1.5), o(-.56, .22, .24, .52), o(.6, .18, .24, .56);
		let s = .32;
		B(.82, .08, .3, r, 0, 0, s, t);
		for (let e of [-1, 1]) B(.16, .72, .26, r, e * .33, .08, s, t);
		B(.86, .14, .3, r, 0, .8, s, t), B(.86, .05, .03, i, 0, .84, .48, t), B(.07, .05, .02, i, 0, .88, .48, t), B(.48, .7, .04, z(null, "#0e0a08"), 0, .08, .28, t), B(.06, .62, .02, Pc(), 0, .1, .29000000000000004, t);
		for (let e of [-1, 1]) {
			let n = new j();
			n.position.set(e * .25, .08, .34), n.rotation.y = e * .28, t.add(n), B(.22, .68, .04, i, -e * .11, 0, 0, n);
			for (let t of [
				.14,
				.34,
				.54
			]) B(.2, .025, .05, a, -e * .11, t, 0, n);
			let r = new N(new L(.03, .006, 4, 10), a);
			r.position.set(-e * .17, .32, .03), n.add(r);
		}
		for (let e of [-1, 1]) {
			B(.12, .26, .12, r, e * .56, 0, .44, t);
			let n = new N(new A(.08, .05, .06, 8), a);
			n.position.set(e * .56, .29, .44), t.add(n), B(.1, .03, .1, Pc(), e * .56, .31, .44, t);
		}
	},
	ninthdoor(e, t, n) {
		let r = z(ks("ashlar", "#4a4440", 83)), i = Nc(), a = (e, r, i, a, o) => {
			let s = lc(i, a, 7, 3);
			s.translate(0, a / 2, 0);
			let c = new N(sc(s, n, i * .25, (e, t, n) => dc(oc(e > .55 ? o : "#241d1b"), .85 + n * .3)), cc());
			c.position.set(e, 0, r), c.rotation.y = n() * 6, t.add(c);
		};
		a(0, -.35, .8, 1.05, "#4a3630"), a(-.5, -.05, .42, .62, "#5c3a2c"), a(.5, -.1, .45, .7, "#4a3630"), a(-.15, -.65, .5, 1.3, "#3a2c28"), a(.55, -.55, .4, .9, "#5c3a2c");
		let o = .34;
		for (let e of [-1, 1]) B(.1, .56, .18, r, e * .22, 0, o, t);
		B(.56, .12, .2, r, 0, .56, o, t);
		for (let [e, n] of [[-.035, .4], [.035, -.4]]) B(.016, .07, .01, i, e - .04, .62, .44000000000000006, t).rotation.z = n;
		B(.016, .07, .01, i, -.1, .62, .44000000000000006, t);
		for (let e of [.5, -.5]) B(.016, .08, .01, i, .06, .62, .44000000000000006, t).rotation.z = e;
		B(.34, .5, .05, i, 0, .02, .36000000000000004, t);
		for (let e of [
			.1,
			.25,
			.4
		]) B(.36, .03, .06, z(null, "#4a3a30"), 0, e, .36000000000000004, t);
		let s = new N(new L(.05, .008, 4, 12), Ic());
		s.position.set(.08, .26, .4), t.add(s);
		for (let e of [-1, 1]) B(.035, .24, .035, i, e * .32, 0, .54, t);
		for (let e = 0; e < 7; e++) {
			let n = e / 6, r = new N(new L(.018, .005, 4, 6), i);
			r.position.set(-.32 + n * .64, .2 - Math.sin(n * Math.PI) * .06, .54), r.rotation.y = e % 2 ? Math.PI / 2 : 0, t.add(r);
		}
		pc(t, e, -.38, .46, .46);
		for (let e = 0; e < 4; e++) {
			let e = fc(n, .05 + n() * .04, .6);
			e.traverse((e) => {
				e.isMesh && (e.material = z(null, "#2e2624"));
			}), e.position.set(-.6 + n() * 1.2, e.position.y, .3 + n() * .3), Math.abs(e.position.x) < .4 && (e.position.x += .5), t.add(e);
		}
	},
	vaultmouth(e, t, n) {
		let r = Nc();
		Lc(t, n, -.3, -.25, .75, .62), Lc(t, n, .4, -.3, .55, .5, "#2e2622", !0), Lc(t, n, .05, -.62, .6, .78), B(.36, .42, .3, z(null, "#140a06"), .05, 0, .1, t), B(.28, .06, .2, Pc(), .05, 0, .08000000000000002, t);
		for (let n of [-1, 1]) B(.045, .46, .045, e.m.beam, .05 + n * .2, 0, .26, t);
		B(.5, .05, .06, e.m.beam, .05, .46, .26, t), B(.5, .025, .025, r, .05, .5, .26, t), pc(t, e, -.25, .44, .30000000000000004);
	},
	slagheap(e, t, n) {
		Lc(t, n, 0, 0, .32, .3 + n() * .1, "#302a27", !0), Lc(t, n, .22, .12, .16, .14);
	}
}), Object.keys(nc);
function zc(e, t, n = 1, r = !1) {
	let { S: i, g: a } = Zs(t, n);
	return nc[e](i, a, Cs(n)), r && (a.rotation.y = Math.PI / 2), a.traverse((e) => {
		e.isMesh && (e.frustumCulled = !1);
	}), a;
}
//#endregion
//#region ember3d/env.json
var Bc = /*#__PURE__*/ JSON.parse("[{\"id\":\"pine_1\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"pine_2\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"pine_3\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":3,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"pine_4\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":4,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"pine_5\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":5,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"pine_6\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":6,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"oak_1\",\"model\":\"oak\",\"tree\":\"oak\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"oak_2\",\"model\":\"oak\",\"tree\":\"oak\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"oak_3\",\"model\":\"oak\",\"tree\":\"oak\",\"seed\":3,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"oak_4\",\"model\":\"oak\",\"tree\":\"oak\",\"seed\":4,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"autumn_1\",\"model\":\"autumn\",\"tree\":\"autumn\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"autumn_2\",\"model\":\"autumn\",\"tree\":\"autumn\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"autumn_3\",\"model\":\"autumn\",\"tree\":\"autumn\",\"seed\":3,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"birch_1\",\"model\":\"birch\",\"tree\":\"birch\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"birch_2\",\"model\":\"birch\",\"tree\":\"birch\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"birch_3\",\"model\":\"birch\",\"tree\":\"birch\",\"seed\":3,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"dead_1\",\"model\":\"dead\",\"tree\":\"dead\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"dead_2\",\"model\":\"dead\",\"tree\":\"dead\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_1\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_2\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_3\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":3,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_4\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":4,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_5\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":5,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_6\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":6,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"bridge_0\",\"model\":\"bridge\",\"nature\":\"bridge\",\"seed\":1,\"rotY\":0,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"bridge_90\",\"model\":\"bridge\",\"nature\":\"bridge\",\"seed\":1,\"rotY\":90,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_A\",\"model\":\"rock\",\"nature\":\"rock\",\"seed\":1,\"variant\":0,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_B\",\"model\":\"rock\",\"nature\":\"rock\",\"seed\":2,\"variant\":1,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_C\",\"model\":\"rock\",\"nature\":\"rock\",\"seed\":3,\"variant\":2,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_D\",\"model\":\"rock\",\"nature\":\"rock\",\"seed\":4,\"variant\":3,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_E\",\"model\":\"rock\",\"nature\":\"rock\",\"seed\":5,\"variant\":4,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"mountain_A_grass_trees\",\"model\":\"mountain\",\"nature\":\"mountain\",\"seed\":1,\"variant\":0,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_B_grass_trees\",\"model\":\"mountain\",\"nature\":\"mountain\",\"seed\":2,\"variant\":1,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_C_grass_trees\",\"model\":\"mountain\",\"nature\":\"mountain\",\"seed\":3,\"variant\":2,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_A\",\"model\":\"mountain\",\"nature\":\"mountain\",\"seed\":4,\"variant\":3,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_B\",\"model\":\"mountain\",\"nature\":\"mountain\",\"seed\":5,\"variant\":4,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_massif_A\",\"model\":\"mountain\",\"nature\":\"massif\",\"seed\":10,\"variant\":0,\"up\":2,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_massif_B\",\"model\":\"mountain\",\"nature\":\"massif\",\"seed\":11,\"variant\":1,\"up\":2,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_massif_C\",\"model\":\"mountain\",\"nature\":\"massif\",\"seed\":12,\"variant\":2,\"up\":2,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"ruin\",\"model\":\"barrow\",\"build\":\"barrow\",\"style\":\"vale\",\"seed\":3,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"mine_0\",\"model\":\"mine\",\"build\":\"mine\",\"style\":\"vale\",\"seed\":4,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"lumbermill_90\",\"model\":\"lumbermill\",\"build\":\"lumbermill\",\"style\":\"vale\",\"seed\":5,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"barrel\",\"model\":\"barrel\",\"build\":\"barrel\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"crate_A_big\",\"model\":\"crate_A_big\",\"build\":\"crate_A_big\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"crate_A_small\",\"model\":\"crate_A_small\",\"build\":\"crate_A_small\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"crate_B_big\",\"model\":\"crate_B_big\",\"build\":\"crate_B_big\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"crate_long_A\",\"model\":\"crate_long_A\",\"build\":\"crate_long_A\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"sack\",\"model\":\"sack\",\"build\":\"sack\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"wheelbarrow\",\"model\":\"wheelbarrow\",\"build\":\"wheelbarrow\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"weaponrack\",\"model\":\"weaponrack\",\"build\":\"weaponrack\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"bucket_water\",\"model\":\"bucket_water\",\"build\":\"bucket_water\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"resource_lumber\",\"model\":\"resource_lumber\",\"build\":\"resource_lumber\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"resource_stone\",\"model\":\"resource_stone\",\"build\":\"resource_stone\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"flag_red\",\"model\":\"flag_red\",\"build\":\"flag_red\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"stump\",\"model\":\"stump\",\"build\":\"stump\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"fence_0\",\"model\":\"fence\",\"build\":\"fence\",\"style\":\"vale\",\"seed\":1,\"rotY\":0,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"fence_90\",\"model\":\"fence\",\"build\":\"fence\",\"style\":\"vale\",\"seed\":1,\"rotY\":90,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"drywall_0\",\"model\":\"drywall\",\"build\":\"drywall\",\"style\":\"vale\",\"seed\":3,\"rotY\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"drywall_90\",\"model\":\"drywall\",\"build\":\"drywall\",\"style\":\"vale\",\"seed\":3,\"rotY\":90,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"stairsup_0\",\"model\":\"stairsup\",\"build\":\"stairsup\",\"style\":\"vale\",\"seed\":1,\"rotY\":0,\"gain\":0.62,\"desat\":0.2,\"tint\":[0.95,0.94,1.0]},{\"id\":\"stairsup_90\",\"model\":\"stairsup\",\"build\":\"stairsup\",\"style\":\"vale\",\"seed\":1,\"rotY\":90,\"gain\":0.62,\"desat\":0.2,\"tint\":[0.95,0.94,1.0]},{\"id\":\"stairsdown_0\",\"model\":\"stairsdown\",\"build\":\"stairsdown\",\"style\":\"vale\",\"seed\":1,\"rotY\":0,\"gain\":0.62,\"desat\":0.2,\"tint\":[0.95,0.94,1.0],\"below\":0.27,\"shadow\":false,\"glowId\":2},{\"id\":\"watermill_0\",\"model\":\"watermill\",\"build\":\"watermill\",\"style\":\"vale\",\"seed\":6,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"chapelruin_0\",\"model\":\"chapelruin\",\"build\":\"chapelruin\",\"style\":\"vale\",\"seed\":7,\"gain\":0.64,\"desat\":0.18,\"tint\":[0.95,0.97,1.0]},{\"id\":\"milestone_0\",\"model\":\"milestone\",\"build\":\"milestone\",\"style\":\"vale\",\"seed\":8,\"gain\":0.7,\"desat\":0.1,\"tint\":[1.0,0.97,0.92]},{\"id\":\"warren_0\",\"model\":\"warren\",\"build\":\"warren\",\"style\":\"vale\",\"seed\":12,\"gain\":0.62,\"desat\":0.14,\"tint\":[0.98,0.97,0.94]},{\"id\":\"wagon_0\",\"model\":\"wagon\",\"build\":\"wagon\",\"style\":\"vale\",\"seed\":9,\"gain\":0.95,\"desat\":0.12,\"tint\":[1.0,0.97,0.93]},{\"id\":\"ug_bush\",\"model\":\"ug_bush\",\"gltf\":\"nature/Bush_Common_Flowers\",\"scale\":0.22,\"gain\":0.6,\"desat\":0.5,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_fern\",\"model\":\"ug_fern\",\"gltf\":\"nature/Fern_1\",\"scale\":0.08,\"gain\":0.5,\"desat\":0.3,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_plant\",\"model\":\"ug_plant\",\"gltf\":\"nature/Plant_1_Big\",\"scale\":0.14,\"gain\":0.5,\"desat\":0.3,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_flowers_1\",\"model\":\"ug_flowers_1\",\"gltf\":\"nature/Flower_3_Group\",\"scale\":0.14,\"gain\":0.6,\"desat\":0.2,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_flowers_2\",\"model\":\"ug_flowers_2\",\"gltf\":\"nature/Flower_4_Group\",\"scale\":0.14,\"gain\":0.6,\"desat\":0.2,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_grass_1\",\"model\":\"ug_grass_1\",\"gltf\":\"nature/Grass_Wispy_Tall\",\"scale\":0.2,\"gain\":0.72,\"desat\":0.4,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_grass_2\",\"model\":\"ug_grass_2\",\"gltf\":\"nature/Grass_Common_Tall\",\"scale\":0.2,\"gain\":0.72,\"desat\":0.4,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_clover\",\"model\":\"ug_clover\",\"gltf\":\"nature/Clover_2\",\"scale\":0.2,\"gain\":0.45,\"desat\":0.3,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_mushroom\",\"model\":\"ug_mushroom\",\"gltf\":\"nature/Mushroom_Laetiporus\",\"scale\":0.25,\"gain\":0.6,\"desat\":0.25,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_F\",\"model\":\"rock_F\",\"gltf\":\"nature/Rock_Medium_1\",\"scale\":0.12,\"gain\":0.62,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_G\",\"model\":\"rock_G\",\"gltf\":\"nature/Rock_Medium_2\",\"scale\":0.12,\"gain\":0.62,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_H\",\"model\":\"rock_H\",\"gltf\":\"nature/Rock_Medium_3\",\"scale\":0.12,\"gain\":0.62,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"wheat_1\",\"model\":\"wheat\",\"nature\":\"wheat\",\"seed\":20,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"shadow\":false},{\"id\":\"wheat_2\",\"model\":\"wheat\",\"nature\":\"wheat\",\"seed\":21,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"shadow\":false},{\"id\":\"wheat_3\",\"model\":\"wheat\",\"nature\":\"wheat\",\"seed\":22,\"variant\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"shadow\":false},{\"id\":\"cow_1\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":35,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"cow_1~tl\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":35,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"pose\":{\"tail\":-1}},{\"id\":\"cow_1~tr\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":35,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"pose\":{\"tail\":1}},{\"id\":\"cow_1~hd\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":35,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"pose\":{\"head\":1}},{\"id\":\"cow_2\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":36,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":60},{\"id\":\"cow_2~tl\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":36,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":60,\"pose\":{\"tail\":-1}},{\"id\":\"cow_2~tr\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":36,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":60,\"pose\":{\"tail\":1}},{\"id\":\"cow_2~hd\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":36,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":60,\"pose\":{\"head\":1}},{\"id\":\"cow_3\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":37,\"variant\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":-50},{\"id\":\"cow_3~tl\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":37,\"variant\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":-50,\"pose\":{\"tail\":-1}},{\"id\":\"cow_3~tr\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":37,\"variant\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":-50,\"pose\":{\"tail\":1}},{\"id\":\"cow_3~hd\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":37,\"variant\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":-50,\"pose\":{\"head\":1}},{\"id\":\"sheep_1\",\"model\":\"sheep\",\"nature\":\"sheep\",\"seed\":37,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"sheep_2\",\"model\":\"sheep\",\"nature\":\"sheep\",\"seed\":38,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"hens_1\",\"model\":\"hens\",\"nature\":\"hens\",\"seed\":36,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"pumpkins_1\",\"model\":\"pumpkins\",\"nature\":\"pumpkins\",\"seed\":40,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"hay_1\",\"model\":\"hay\",\"nature\":\"hay\",\"seed\":35,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"hay_2\",\"model\":\"hay\",\"nature\":\"hay\",\"seed\":36,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"planter_1\",\"model\":\"planter\",\"nature\":\"planter\",\"seed\":39,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"alder_1\",\"model\":\"alder\",\"tree\":\"alder\",\"seed\":61,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"alder_2\",\"model\":\"alder\",\"tree\":\"alder\",\"seed\":62,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"alder_3\",\"model\":\"alder\",\"tree\":\"alder\",\"seed\":63,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"willow_1\",\"model\":\"willow\",\"tree\":\"willow\",\"seed\":71,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"willow_2\",\"model\":\"willow\",\"tree\":\"willow\",\"seed\":72,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"carr_1\",\"model\":\"carr\",\"tree\":\"carr\",\"seed\":81,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"carr_2\",\"model\":\"carr\",\"tree\":\"carr\",\"seed\":82,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"windmill_0\",\"model\":\"windmill\",\"build\":\"windmill\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"cart_0\",\"model\":\"cart\",\"build\":\"cart\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"cart_90\",\"model\":\"cart\",\"build\":\"cart\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0],\"faceX\":true},{\"id\":\"handcart_0\",\"model\":\"handcart\",\"build\":\"handcart\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"table_0\",\"model\":\"table\",\"build\":\"table\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"boxes_0\",\"model\":\"boxes\",\"build\":\"boxes\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"lamppost_0\",\"model\":\"lamppost\",\"build\":\"lamppost\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"bench_0\",\"model\":\"bench\",\"build\":\"bench\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"trough_0\",\"model\":\"trough\",\"build\":\"trough\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"woodpile_0\",\"model\":\"woodpile\",\"build\":\"woodpile\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]}]"), Vc = {
	vale: [
		{
			id: "vale_tavern_1",
			model: "tavern",
			build: "tavern",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			faceX: !0
		},
		{
			id: "vale_inn_1",
			model: "inn",
			build: "inn",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_shop_1",
			model: "shop",
			build: "shop",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_temple_1",
			model: "temple",
			build: "temple",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_well_1",
			model: "well",
			build: "well",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_house_1",
			model: "house",
			build: "house",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			seed: 1
		},
		{
			id: "vale_house_2",
			model: "house",
			build: "house",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			seed: 2
		},
		{
			id: "vale_house_3",
			model: "house",
			build: "house",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			seed: 3
		},
		{
			id: "vale_housex_1",
			model: "house",
			build: "house",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			seed: 4,
			faceX: !0
		},
		{
			id: "vale_housex_2",
			model: "house",
			build: "house",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			seed: 5,
			faceX: !0
		},
		{
			id: "vale_farm_1",
			model: "farm",
			build: "farm",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_farmx_1",
			model: "farm",
			build: "farm",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			seed: 2,
			faceX: !0
		},
		{
			id: "vale_keep_1",
			model: "keep",
			build: "keep",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_wall_1",
			model: "wall",
			build: "wall",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_smith_1",
			model: "smith",
			build: "smith",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			faceX: !0
		},
		{
			id: "vale_curtain_1",
			model: "palisade",
			build: "palisade",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_curtainy_1",
			model: "palisade",
			build: "palisade",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			rotY: 90
		},
		{
			id: "vale_tower_1",
			model: "watchtower",
			build: "watchtower",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_gatehousey_1",
			model: "timbergate",
			build: "timbergate",
			style: "vale",
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			rotY: 90
		},
		{
			id: "vale_cottage_1",
			model: "cottage",
			build: "cottage",
			style: "vale",
			seed: 11,
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_cottagex_1",
			model: "cottage",
			build: "cottage",
			style: "vale",
			seed: 13,
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			faceX: !0
		},
		{
			id: "vale_longhouse_1",
			model: "longhouse",
			build: "longhouse",
			style: "vale",
			seed: 21,
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_longhousex_1",
			model: "longhouse",
			build: "longhouse",
			style: "vale",
			seed: 22,
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			faceX: !0
		},
		{
			id: "vale_workshop_1",
			model: "workshop",
			build: "workshop",
			style: "vale",
			seed: 31,
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_workshopx_1",
			model: "workshop",
			build: "workshop",
			style: "vale",
			seed: 32,
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			],
			faceX: !0
		},
		{
			id: "vale_foodstand_1",
			model: "foodstand",
			build: "foodstand",
			style: "vale",
			seed: 81,
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_standard_1",
			model: "standard",
			build: "standard",
			style: "vale",
			seed: 83,
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		},
		{
			id: "vale_lanewell_1",
			model: "lanewell",
			build: "lanewell",
			style: "vale",
			seed: 84,
			gain: .7,
			desat: .12,
			tint: [
				1,
				.96,
				.9
			]
		}
	],
	fens: [
		{
			id: "fens_tavern_1",
			model: "tavern",
			build: "tavern",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			faceX: !0
		},
		{
			id: "fens_inn_1",
			model: "inn",
			build: "inn",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_shop_1",
			model: "shop",
			build: "shop",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_temple_1",
			model: "temple",
			build: "temple",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_well_1",
			model: "well",
			build: "well",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_house_1",
			model: "house",
			build: "house",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			seed: 1
		},
		{
			id: "fens_house_2",
			model: "house",
			build: "house",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			seed: 2
		},
		{
			id: "fens_house_3",
			model: "house",
			build: "house",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			seed: 3
		},
		{
			id: "fens_housex_1",
			model: "house",
			build: "house",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			seed: 4,
			faceX: !0
		},
		{
			id: "fens_housex_2",
			model: "house",
			build: "house",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			seed: 5,
			faceX: !0
		},
		{
			id: "fens_farm_1",
			model: "farm",
			build: "farm",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_farmx_1",
			model: "farm",
			build: "farm",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			seed: 2,
			faceX: !0
		},
		{
			id: "fens_keep_1",
			model: "keep",
			build: "keep",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_wall_1",
			model: "wall",
			build: "wall",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_smith_1",
			model: "smith",
			build: "smith",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			faceX: !0
		},
		{
			id: "fens_curtain_1",
			model: "curtain",
			build: "curtain",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_curtainy_1",
			model: "curtain",
			build: "curtain",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			rotY: 90
		},
		{
			id: "fens_tower_1",
			model: "tower",
			build: "tower",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_gatehousey_1",
			model: "gatehouse",
			build: "gatehouse",
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			rotY: 90
		},
		{
			id: "fens_stilt_1",
			model: "stilthouse",
			build: "stilthouse",
			seed: 41,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_stilt_2",
			model: "stilthouse",
			build: "stilthouse",
			seed: 42,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_stilt_3",
			model: "stilthouse",
			build: "stilthouse",
			seed: 43,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_stilttavern_1",
			model: "stilttavern",
			build: "stilttavern",
			seed: 51,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			faceX: !0
		},
		{
			id: "fens_cistern_1",
			model: "cistern",
			build: "cistern",
			seed: 52,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_punt_1",
			model: "punt",
			build: "punt",
			seed: 53,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_eeltrap_1",
			model: "eeltrap",
			build: "eeltrap",
			seed: 54,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_boathall_1",
			model: "boathall",
			build: "boathall",
			seed: 61,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_lockhall_1",
			model: "lockhall",
			build: "lockhall",
			seed: 62,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_vats_1",
			model: "vats",
			build: "vats",
			seed: 63,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_abbey_1",
			model: "abbey",
			build: "abbey",
			seed: 64,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_priory_1",
			model: "priory",
			build: "priory",
			seed: 65,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_landing_1",
			model: "landing",
			build: "landing",
			seed: 66,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_ferrystage_1",
			model: "ferrystage",
			build: "ferrystage",
			seed: 67,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_stiltinn_1",
			model: "stiltinn",
			build: "stiltinn",
			seed: 71,
			style: "fens",
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_cottage_1",
			model: "cottage",
			build: "cottage",
			style: "fens",
			seed: 11,
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_cottagex_1",
			model: "cottage",
			build: "cottage",
			style: "fens",
			seed: 13,
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			faceX: !0
		},
		{
			id: "fens_longhouse_1",
			model: "longhouse",
			build: "longhouse",
			style: "fens",
			seed: 21,
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_longhousex_1",
			model: "longhouse",
			build: "longhouse",
			style: "fens",
			seed: 22,
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			faceX: !0
		},
		{
			id: "fens_workshop_1",
			model: "workshop",
			build: "workshop",
			style: "fens",
			seed: 31,
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_workshopx_1",
			model: "workshop",
			build: "workshop",
			style: "fens",
			seed: 32,
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			],
			faceX: !0
		},
		{
			id: "fens_foodstand_1",
			model: "foodstand",
			build: "foodstand",
			style: "fens",
			seed: 81,
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_standard_1",
			model: "standard",
			build: "standard",
			style: "fens",
			seed: 83,
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		},
		{
			id: "fens_lanewell_1",
			model: "lanewell",
			build: "lanewell",
			style: "fens",
			seed: 84,
			gain: .66,
			desat: .2,
			tint: [
				.94,
				.98,
				.95
			]
		}
	],
	reach: [
		{
			id: "reach_tavern_1",
			model: "tavern",
			build: "tavern",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			faceX: !0
		},
		{
			id: "reach_inn_1",
			model: "inn",
			build: "inn",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_shop_1",
			model: "shop",
			build: "shop",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_temple_1",
			model: "temple",
			build: "temple",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_well_1",
			model: "well",
			build: "well",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_house_1",
			model: "house",
			build: "house",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			seed: 1
		},
		{
			id: "reach_house_2",
			model: "house",
			build: "house",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			seed: 2
		},
		{
			id: "reach_house_3",
			model: "house",
			build: "house",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			seed: 3
		},
		{
			id: "reach_housex_1",
			model: "house",
			build: "house",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			seed: 4,
			faceX: !0
		},
		{
			id: "reach_housex_2",
			model: "house",
			build: "house",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			seed: 5,
			faceX: !0
		},
		{
			id: "reach_farm_1",
			model: "farm",
			build: "farm",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_farmx_1",
			model: "farm",
			build: "farm",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			seed: 2,
			faceX: !0
		},
		{
			id: "reach_keep_1",
			model: "keep",
			build: "keep",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_wall_1",
			model: "wall",
			build: "wall",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_smith_1",
			model: "smith",
			build: "smith",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			faceX: !0
		},
		{
			id: "reach_curtain_1",
			model: "curtain",
			build: "curtain",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_curtainy_1",
			model: "curtain",
			build: "curtain",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			rotY: 90
		},
		{
			id: "reach_tower_1",
			model: "tower",
			build: "tower",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_gatehousey_1",
			model: "gatehouse",
			build: "gatehouse",
			style: "reach",
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			rotY: 90
		},
		{
			id: "reach_cottage_1",
			model: "cottage",
			build: "cottage",
			style: "reach",
			seed: 11,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_cottagex_1",
			model: "cottage",
			build: "cottage",
			style: "reach",
			seed: 13,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			faceX: !0
		},
		{
			id: "reach_longhouse_1",
			model: "longhouse",
			build: "longhouse",
			style: "reach",
			seed: 21,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_longhousex_1",
			model: "longhouse",
			build: "longhouse",
			style: "reach",
			seed: 22,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			faceX: !0
		},
		{
			id: "reach_workshop_1",
			model: "workshop",
			build: "workshop",
			style: "reach",
			seed: 31,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_workshopx_1",
			model: "workshop",
			build: "workshop",
			style: "reach",
			seed: 32,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			faceX: !0
		},
		{
			id: "reach_foodstand_1",
			model: "foodstand",
			build: "foodstand",
			style: "reach",
			seed: 81,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_standard_1",
			model: "standard",
			build: "standard",
			style: "reach",
			seed: 83,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_lanewell_1",
			model: "lanewell",
			build: "lanewell",
			style: "reach",
			seed: 84,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			]
		},
		{
			id: "reach_gatewheel",
			model: "gatewheel",
			build: "gatewheel",
			style: "reach",
			seed: 5,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			rotY: 90,
			nofoot: !0
		},
		{
			id: "reach_stack",
			model: "stack",
			build: "stack",
			style: "reach",
			seed: 9,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			nofoot: !0
		},
		{
			id: "reach_works",
			model: "works",
			build: "works",
			style: "reach",
			seed: 11,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			nofoot: !0
		},
		{
			id: "reach_pithead",
			model: "pithead",
			build: "pithead",
			style: "reach",
			seed: 4,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.94,
				.9
			],
			nofoot: !0
		},
		{
			id: "reach_assayhouse",
			model: "assayhouse",
			build: "assayhouse",
			style: "reach",
			seed: 13,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			nofoot: !0
		},
		{
			id: "reach_forgedoor",
			model: "forgedoor",
			build: "forgedoor",
			style: "reach",
			seed: 17,
			gain: .66,
			desat: .12,
			tint: [
				1,
				.95,
				.9
			],
			nofoot: !0
		},
		{
			id: "reach_ninthdoor",
			model: "ninthdoor",
			build: "ninthdoor",
			style: "reach",
			seed: 19,
			gain: .66,
			desat: .12,
			tint: [
				1,
				.94,
				.9
			],
			nofoot: !0
		},
		{
			id: "reach_vaultmouth",
			model: "vaultmouth",
			build: "vaultmouth",
			style: "reach",
			seed: 23,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			nofoot: !0
		},
		{
			id: "reach_slagheap",
			model: "slagheap",
			build: "slagheap",
			style: "reach",
			seed: 29,
			gain: .66,
			desat: .15,
			tint: [
				1,
				.93,
				.88
			],
			nofoot: !0
		}
	],
	heights: [
		{
			id: "heights_tavern_1",
			model: "tavern",
			build: "tavern",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			faceX: !0
		},
		{
			id: "heights_inn_1",
			model: "inn",
			build: "inn",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_shop_1",
			model: "shop",
			build: "shop",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_temple_1",
			model: "temple",
			build: "temple",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_well_1",
			model: "well",
			build: "well",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_house_1",
			model: "house",
			build: "house",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			seed: 1
		},
		{
			id: "heights_house_2",
			model: "house",
			build: "house",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			seed: 2
		},
		{
			id: "heights_house_3",
			model: "house",
			build: "house",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			seed: 3
		},
		{
			id: "heights_housex_1",
			model: "house",
			build: "house",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			seed: 4,
			faceX: !0
		},
		{
			id: "heights_housex_2",
			model: "house",
			build: "house",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			seed: 5,
			faceX: !0
		},
		{
			id: "heights_farm_1",
			model: "farm",
			build: "farm",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_farmx_1",
			model: "farm",
			build: "farm",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			seed: 2,
			faceX: !0
		},
		{
			id: "heights_keep_1",
			model: "keep",
			build: "keep",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_wall_1",
			model: "wall",
			build: "wall",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_smith_1",
			model: "smith",
			build: "smith",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			faceX: !0
		},
		{
			id: "heights_curtain_1",
			model: "curtain",
			build: "curtain",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_curtainy_1",
			model: "curtain",
			build: "curtain",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			rotY: 90
		},
		{
			id: "heights_tower_1",
			model: "tower",
			build: "tower",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_gatehousey_1",
			model: "gatehouse",
			build: "gatehouse",
			style: "heights",
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			rotY: 90
		},
		{
			id: "heights_cottage_1",
			model: "cottage",
			build: "cottage",
			style: "heights",
			seed: 11,
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_cottagex_1",
			model: "cottage",
			build: "cottage",
			style: "heights",
			seed: 13,
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			faceX: !0
		},
		{
			id: "heights_longhouse_1",
			model: "longhouse",
			build: "longhouse",
			style: "heights",
			seed: 21,
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_longhousex_1",
			model: "longhouse",
			build: "longhouse",
			style: "heights",
			seed: 22,
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			faceX: !0
		},
		{
			id: "heights_workshop_1",
			model: "workshop",
			build: "workshop",
			style: "heights",
			seed: 31,
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_workshopx_1",
			model: "workshop",
			build: "workshop",
			style: "heights",
			seed: 32,
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			],
			faceX: !0
		},
		{
			id: "heights_foodstand_1",
			model: "foodstand",
			build: "foodstand",
			style: "heights",
			seed: 81,
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_standard_1",
			model: "standard",
			build: "standard",
			style: "heights",
			seed: 83,
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		},
		{
			id: "heights_lanewell_1",
			model: "lanewell",
			build: "lanewell",
			style: "heights",
			seed: 84,
			gain: .66,
			desat: .18,
			tint: [
				.94,
				.96,
				1
			]
		}
	]
}, V = (e, t, n) => new l({
	color: e,
	metalness: t,
	roughness: n
}), Hc = {
	mace: () => {
		let e = new j();
		e.name = "Mace";
		let t = V(4862754, 0, .85), n = V(3022616, 0, .9), r = V(12095548, .8, .35), i = V(10133670, .85, .35), a = (t, n, r, i) => {
			let a = new N(t, n);
			return a.position.y = r, a.name = i, e.add(a), a;
		};
		a(new A(.062, .07, 1.02, 10), t, .28, "Mace_Haft"), a(new A(.08, .08, .34, 10), n, -.02, "Mace_Grip"), a(new M(.1, 12, 8), r, -.25, "Mace_Pommel");
		for (let e of [.17, .7]) a(new A(.085, .085, .06, 12), r, e, "Mace_Band");
		a(new A(.12, .1, .38, 12), i, .92, "Mace_Head");
		let o = new ce([
			[0, -.22],
			[.13, -.06],
			[.14, .06],
			[0, .22]
		].map(([e, t]) => new Oe(e, t))), s = new h(o, {
			depth: .05,
			bevelEnabled: !1
		});
		s.translate(0, 0, -.025);
		for (let t = 0; t < 6; t++) {
			let n = new N(s, i), r = t * Math.PI / 3;
			n.position.set(Math.cos(r) * .1, .92, Math.sin(r) * .1), n.rotation.y = -r, n.name = "Mace_Flange", e.add(n);
		}
		return a(new R(.1, .16, 10), i, 1.18, "Mace_Cap"), a(new M(.065, 10, 8), r, 1.28, "Mace_Knop"), e;
	},
	sword: () => {
		let e = new j();
		e.name = "Sword";
		let t = V(13159634, .9, .3), n = V(12095548, .8, .35), r = V(3810328, 0, .9), i = new N(new A(.02, .1, 1.2, 4, 1), t);
		i.scale.set(1, 1, .3), i.rotation.y = Math.PI / 4, i.position.y = .78, i.name = "Sword_Blade", e.add(i);
		let a = new N(new I(.46, .07, .1), n);
		a.position.y = .16, e.add(a);
		let o = new N(new A(.045, .05, .3, 8), r);
		o.position.y = 0, e.add(o);
		let s = new N(new M(.075, 10, 8), n);
		return s.position.y = -.2, e.add(s), e;
	},
	dagger: () => {
		let e = new j();
		e.name = "Dagger";
		let t = V(12633290, .9, .3), n = V(2760736, .2, .7), r = new N(new A(.012, .07, .62, 4, 1), t);
		r.scale.set(1, 1, .3), r.rotation.y = Math.PI / 4, r.position.y = .45, e.add(r);
		let i = new N(new I(.26, .05, .08), n);
		i.position.y = .12, e.add(i);
		let a = new N(new A(.04, .045, .24, 8), n);
		return e.add(a), e;
	},
	staff: () => {
		let e = new j();
		e.name = "Staff", e.userData.hang = "up";
		let t = V(5913122, 0, .85), n = V(12095548, .8, .35), r = new l({
			color: 16752704,
			emissive: 12599312,
			emissiveIntensity: 1.2,
			roughness: .2
		}), i = new N(new A(.045, .055, 2.1, 8), t);
		i.position.y = .2, e.add(i);
		for (let t of [1.18, -.8]) {
			let r = new N(new A(.07, .07, .07, 10), n);
			r.position.y = t, e.add(r);
		}
		let a = new N(new L(.12, .025, 6, 12), n);
		a.position.y = 1.36, e.add(a);
		let o = new N(new v(.11, 1), r);
		return o.position.y = 1.36, o.userData.glow = 16744496, e.add(o), e;
	},
	shield: () => {
		let e = new j();
		e.name = "Shield";
		let t = V(8007202, 0, .8), n = V(10133670, .85, .35), r = V(13146688, .8, .35), i = new N(new A(.42, .42, .08, 20), t);
		i.rotation.x = Math.PI / 2, i.position.z = .16, e.add(i);
		let a = new N(new L(.42, .035, 6, 24), n);
		a.position.z = .2, e.add(a);
		let o = new N(new M(.11, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), r);
		return o.rotation.x = Math.PI / 2, o.position.z = .2, e.add(o), e;
	},
	book: () => {
		let e = new j();
		e.name = "Book";
		let t = V(5906464, 0, .8), n = V(15260864, 0, .9), r = V(13146688, .8, .35), i = new N(new I(.2, .42, .46), t);
		i.position.y = .27, e.add(i);
		let a = new N(new I(.16, .38, .47), n);
		a.position.y = .27, a.position.x = .012, e.add(a);
		let o = new N(new I(.21, .08, .08), r);
		return o.position.set(0, .27, .2), e.add(o), e;
	},
	standard: () => {
		let e = new j();
		e.name = "Standard";
		let t = V(3811868, 0, .9), n = V(11042874, .8, .4), r = V(8004632, 0, .95), i = new l({
			color: 15773776,
			emissive: 10506256,
			emissiveIntensity: 1,
			roughness: .4
		}), a = new N(new A(.045, .055, 3, 8), t);
		a.position.y = -.9, e.add(a);
		let o = new N(new A(.035, .035, .9, 8), n);
		o.rotation.z = Math.PI / 2, o.position.y = -2.2, e.add(o);
		let s = new N(new R(.1, .34, 6), n);
		s.rotation.z = Math.PI, s.position.y = -2.56, e.add(s);
		for (let [t, n] of [
			[-.28, 1],
			[0, 1.2],
			[.28, .9]
		]) {
			let i = new N(new I(.28, n, .02), r);
			i.position.set(t, -2.2 + n / 2, .04), e.add(i);
		}
		let c = new N(new A(.14, .14, .03, 14), i);
		return c.rotation.x = Math.PI / 2, c.position.set(0, -1.78, .07), e.add(c), e;
	},
	shard: () => {
		let e = new j();
		e.name = "Ember_Shard";
		let t = new l({
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
			let o = new N(new E(1, 0), t);
			o.scale.set(i, r / 2, i), o.position.set(n, .1 + r / 2, 0), o.rotation.z = a, o.name = "Ember_Shard", o.userData.glow = 16744496, e.add(o);
		}
		return e;
	},
	mug: () => {
		let e = new j();
		e.name = "Mug";
		let t = V(7106676, .75, .45), n = V(13144106, .1, .35), r = V(14209212, 0, .9), i = new N(new A(.2, .18, .4, 14, 1, !0), t);
		i.position.set(.22, .22, 0), i.name = "Mug_Body", e.add(i);
		let a = new N(new A(.19, .19, .04, 14), t);
		a.position.set(.22, .03, 0), a.name = "Mug_Base", e.add(a);
		let o = new N(new A(.19, .19, .02, 14), n);
		o.position.set(.22, .38, 0), o.name = "Mug_Ale", e.add(o);
		let s = new N(new M(.2, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), r);
		s.scale.set(.8, .3, .8), s.position.set(.22, .4, 0), s.name = "Mug_Foam", e.add(s);
		let c = new N(new L(.11, .035, 8, 16, Math.PI), t);
		return c.rotation.z = Math.PI / 2, c.position.set(.02, .22, 0), c.name = "Mug_Handle", e.add(c), e;
	},
	lantern: () => {
		let e = new j();
		e.name = "Lantern", e.userData.hang = !0;
		let t = V(3814964, .7, .5), n = V(10123834, .8, .4), r = new l({
			color: 16760944,
			emissive: 12607504,
			emissiveIntensity: 1.2,
			roughness: .3
		}), i = new N(new L(.12, .022, 6, 14, Math.PI), t);
		i.rotation.z = Math.PI, i.position.y = .14, e.add(i);
		let a = new N(new R(.17, .14, 8), t);
		a.rotation.z = Math.PI, a.position.y = .3, e.add(a);
		let o = new N(new A(.13, .13, .3, 8), r);
		o.position.y = .5, o.name = "Lantern_Glass", o.userData.glow = 16756816, e.add(o);
		for (let n = 0; n < 4; n++) {
			let r = n * Math.PI / 2 + Math.PI / 4, i = new N(new I(.03, .32, .03), t);
			i.position.set(Math.cos(r) * .135, .5, Math.sin(r) * .135), e.add(i);
		}
		let s = new N(new A(.16, .14, .07, 8), n);
		return s.position.y = .68, e.add(s), e;
	},
	hammer: () => {
		let e = new j();
		e.name = "Smith_Hammer", e.userData.hang = !0;
		let t = V(6965802, 0, .8), n = V(5593182, .85, .4), r = V(3022616, 0, .9), i = new N(new A(.045, .055, .62, 8), t);
		i.position.y = .2, e.add(i);
		let a = new N(new A(.062, .062, .26, 8), r);
		a.position.y = -.02, e.add(a);
		let o = new N(new I(.42, .17, .17), n);
		o.position.y = .52, o.name = "Hammer_Head", e.add(o);
		let s = new N(new A(.1, .1, .08, 10), n);
		s.rotation.z = Math.PI / 2, s.position.set(.24, .52, 0), e.add(s);
		let c = new N(new I(.1, .06, .15), n);
		return c.position.set(-.25, .52, 0), e.add(c), e;
	},
	basket: () => {
		let e = new j();
		e.name = "Egg_Basket", e.userData.hang = !0;
		let t = V(10517060, 0, .9), n = V(14209728, 0, .95), r = V(15919832, 0, .6), i = new N(new L(.2, .025, 6, 14, Math.PI), t);
		i.rotation.z = Math.PI, i.position.y = .2, e.add(i);
		let a = new N(new A(.26, .19, .24, 10), t);
		a.position.y = .36, e.add(a);
		for (let [t, n] of [
			[-.08, .05],
			[.07, -.06],
			[0, .1],
			[.1, .08]
		]) {
			let i = new N(new M(.075, 8, 6), r);
			i.scale.y = 1.25, i.position.set(t, .23, n), e.add(i);
		}
		let o = new N(new I(.3, .03, .22), n);
		return o.position.set(-.08, .25, -.06), o.rotation.y = .5, e.add(o), e;
	},
	keys: () => {
		let e = new j();
		e.name = "Key_Ring", e.userData.hang = !0;
		let t = V(6972512, .85, .4), n = V(11569728, .8, .4), r = new N(new L(.12, .022, 6, 16), t);
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
			let t = new j();
			t.position.y = .24, t.rotation.z = r;
			let n = new N(new I(.035, a, .035), i);
			n.position.y = a / 2, t.add(n);
			let o = new N(new L(.05, .018, 5, 10), i);
			o.position.y = .02, t.add(o);
			let s = new N(new I(.1, .06, .03), i);
			s.position.set(.05, a - .04, 0), t.add(s), e.add(t);
		}
		return e;
	},
	whip: () => {
		let e = new j();
		e.name = "Carter_Whip", e.userData.hang = !0;
		let t = V(5913122, 0, .85), n = V(2759184, 0, .9), r = new N(new A(.022, .04, 1.6, 6), t);
		r.position.y = -.62, e.add(r);
		let i = [
			[0, -1.42],
			[.1, -1.55],
			[.28, -1.5],
			[.36, -1.3],
			[.38, -1.05],
			[.42, -.85]
		].map(([e, t]) => new F(e, t, 0)), a = new N(new Je(new We(i), 16, .018, 5, !1), n);
		return e.add(a), e;
	},
	hoe: () => {
		let e = new j();
		e.name = "Hoe", e.userData.hang = !0;
		let t = V(9069112, 0, .85), n = V(5921888, .8, .45), r = new N(new A(.03, .036, 1.5, 6), t);
		r.position.y = -.6, e.add(r);
		let i = new N(new I(.3, .05, .2), n);
		return i.position.set(.1, -1.36, 0), i.rotation.z = .25, e.add(i), e;
	},
	pail: () => {
		let e = new j();
		e.name = "Pail", e.userData.hang = !0;
		let t = V(9068084, 0, .85), n = V(4078136, .7, .5), r = V(15788760, 0, .5), i = new N(new L(.17, .018, 6, 14, Math.PI), n);
		i.rotation.z = Math.PI, i.position.y = .16, e.add(i);
		let a = new N(new A(.2, .16, .3, 10), t);
		a.position.y = .36, e.add(a);
		for (let t of [.26, .46]) {
			let r = new N(new L(.185, .014, 4, 14), n);
			r.rotation.x = Math.PI / 2, r.position.y = t, e.add(r);
		}
		let o = new N(new A(.17, .17, .02, 10), r);
		return o.position.y = .23, e.add(o), e;
	},
	flour: () => {
		let e = new j();
		e.name = "Flour_Sack", e.userData.hang = !0;
		let t = V(14208174, 0, .95), n = V(6965802, 0, .9), r = new N(new A(.05, .08, .16, 8), t);
		r.position.y = .12, e.add(r);
		let i = new N(new L(.06, .016, 4, 10), n);
		i.rotation.x = Math.PI / 2, i.position.y = .1, e.add(i);
		let a = new N(new M(.24, 10, 8), t);
		return a.scale.set(1, 1.25, .85), a.position.y = .44, e.add(a), e;
	},
	apron: () => {
		let e = new j();
		e.name = "Apron";
		let t = V(6964264, 0, .85), n = V(3022616, 0, .9), r = new N(new I(.32, .4, .04), t);
		r.position.set(0, .32, .33), r.rotation.x = -.08, r.name = "Apron_Bib", e.add(r);
		for (let n of [-.1, .1]) {
			let r = new N(new I(.19, .3, .04), t);
			r.position.set(n, -.08, .3), r.rotation.x = .12, r.name = "Apron_Skirt", e.add(r);
		}
		let i = new N(new I(.5, .06, .06), n);
		return i.position.set(0, .11, .32), e.add(i), e;
	},
	kettle: () => {
		let e = new j();
		e.name = "Kettle_Hat";
		let t = V(7828334, .6, .55), n = V(5657166, .6, .6), r = V(10103326, 0, .9), i = new N(new M(.6, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), t);
		i.scale.set(1, .72, 1), i.position.set(0, .6, .02), e.add(i);
		let a = new N(new A(.62, .9, .12, 16, 1, !0), n);
		a.position.set(0, .56, .02), e.add(a);
		let o = new N(new A(.62, .9, .12, 16, 1, !0), n);
		o.material = n.clone(), o.material.side = 1, o.position.copy(a.position), e.add(o);
		let s = new N(new A(.615, .615, .12, 16), r);
		return s.position.set(0, .68, .02), e.add(s), e.traverse((e) => {
			e.isMesh && (e.name = "Kettle_Hat");
		}), e;
	},
	reedhat: () => {
		let e = new j();
		e.name = "Reed_Hat";
		let t = V(10521170, 0, .95), n = V(4872756, 0, .9), r = new N(new R(1, .42, 14, 1, !0), t);
		r.position.set(0, .78, .02), e.add(r);
		let i = new N(new R(1, .42, 14, 1, !0), t.clone());
		i.material.side = 1, i.position.copy(r.position), e.add(i);
		let a = new N(new A(.5, .56, .08, 14), n);
		return a.position.set(0, .62, .02), e.add(a), e.traverse((e) => {
			e.isMesh && (e.name = "Reed_Hat");
		}), e;
	},
	rag: () => {
		let e = new j();
		e.name = "Rag";
		let t = V(12610120, 0, .95), n = V(8667178, 0, .95), r = (r, i, a, o, s, c = 0) => s.forEach((l, u) => {
			let d = new N(new I(i / s.length, l, .03), u % 3 == 1 ? n : t);
			d.position.set(r + (u + .5) * (i / s.length) - i / 2, o - l / 2, a), d.rotation.x = c, d.name = "Rag_Cloth", e.add(d);
		});
		for (let n of [-1, 1]) {
			let r = new N(new I(.26, .025, .5), t);
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
		let e = new j();
		e.name = "Billhook";
		let t = V(6967862, 0, .85), n = V(5593180, .8, .45), r = new N(new A(.04, .05, 1.9, 7), t);
		r.position.y = .45, e.add(r);
		let i = new N(new I(.06, .46, .2), n);
		i.position.set(0, 1.5, .08), e.add(i);
		let a = new N(new L(.12, .035, 5, 10, Math.PI * .9), n);
		return a.position.set(0, 1.72, .2), a.rotation.y = Math.PI / 2, e.add(a), e;
	},
	cagepole: () => {
		let e = new j();
		e.name = "Cagepole";
		let t = V(3023904, 0, .85), n = V(3814964, .75, .45), r = new l({
			color: 13154559,
			emissive: 7360720,
			emissiveIntensity: 1.3,
			roughness: .3
		}), i = new N(new A(.04, .05, 2, 7), t);
		i.position.y = .45, e.add(i);
		let a = new N(new R(.2, .16, 6), n);
		a.position.y = 1.98, e.add(a);
		let o = new N(new A(.18, .18, .04, 6), n);
		o.position.y = 1.5, e.add(o);
		for (let t = 0; t < 6; t++) {
			let r = t * Math.PI / 3, i = new N(new I(.03, .42, .03), n);
			i.position.set(Math.cos(r) * .17, 1.71, Math.sin(r) * .17), e.add(i);
		}
		let s = new N(new v(.11, 1), r);
		return s.position.y = 1.7, s.name = "Cage_Soul", s.userData.glow = 12099839, e.add(s), e;
	},
	boathook: () => {
		let e = new j();
		e.name = "Boathook";
		let t = V(4076070, 0, .85), n = V(4869198, .8, .45), r = V(9075282, 0, .95), i = new N(new A(.045, .055, 2.1, 7), t);
		i.position.y = .5, e.add(i);
		let a = new N(new R(.06, .34, 6), n);
		a.position.y = 1.72, e.add(a);
		let o = new N(new L(.15, .04, 5, 10, Math.PI * 1.1), n);
		o.position.set(0, 1.5, .15), o.rotation.set(0, Math.PI / 2, Math.PI * .55), e.add(o);
		let s = new N(new L(.08, .025, 5, 10), r);
		return s.rotation.x = Math.PI / 2, s.position.y = .05, e.add(s), e;
	},
	choirlamp: () => {
		let e = new j();
		e.name = "Choirlamp", e.userData.hang = !0;
		let t = V(12106944, .7, .4), n = new l({
			color: 14741759,
			emissive: 6328528,
			emissiveIntensity: 1.4,
			roughness: .3
		}), r = new N(new L(.1, .02, 6, 12), t);
		r.position.y = .1, e.add(r);
		let i = new N(new R(.17, .16, 6), t);
		i.rotation.z = Math.PI, i.position.y = .26, e.add(i);
		for (let n = 0; n < 6; n++) {
			let r = n * Math.PI / 3, i = new N(new I(.025, .4, .025), t);
			i.position.set(Math.cos(r) * .15, .52, Math.sin(r) * .15), e.add(i);
		}
		let a = new N(new v(.11, 1), n);
		a.position.y = .52, a.name = "Choir_Light", a.userData.glow = 13164799, e.add(a);
		let o = new N(new A(.17, .12, .06, 6), t);
		return o.position.y = .74, e.add(o), e;
	},
	marshlamp: () => {
		let e = new j();
		e.name = "Marshlamp", e.userData.hang = !0;
		let t = V(4866096, 0, .9), n = new l({
			color: 14217416,
			emissive: 7385200,
			emissiveIntensity: 1.3,
			roughness: .3
		}), r = new N(new A(.012, .012, .2, 4), t);
		r.position.y = .1, e.add(r);
		let i = new N(new v(.12, 1), n);
		i.position.y = .36, i.name = "Marsh_Light", i.userData.glow = 13168832, e.add(i);
		for (let n = 0; n < 5; n++) {
			let r = n * Math.PI * .4, i = new N(new L(.15, .014, 4, 10, Math.PI * 1.1), t);
			i.position.y = .36, i.rotation.set(Math.PI / 2, r, .3), e.add(i);
		}
		return e;
	},
	crook: () => {
		let e = new j();
		e.name = "Crook", e.userData.hang = "up";
		let t = V(4864552, 0, .9), n = new N(new A(.035, .045, 1.8, 6), t);
		n.position.y = .3, n.rotation.z = .04, e.add(n);
		let r = new N(new L(.13, .035, 5, 10, Math.PI * 1.2), t);
		return r.position.set(.12, 1.22, 0), e.add(r), e;
	},
	habit: () => {
		let e = new j();
		e.name = "Habit";
		let t = V(9079940, 0, .95), n = V(6185050, 0, .95), r = V(4876850, 0, .9), i = new N(new L(.24, .09, 6, 12), t);
		i.rotation.x = Math.PI / 2, i.position.y = .2, i.name = "Habit_Cloth", e.add(i);
		for (let [r, i] of [[.22, .1], [-.24, -.08]]) for (let a = 0; a < 5; a++) {
			let o = .62 + a * 7 % 5 * .06, s = new N(new I(.1, o, .03), a % 2 ? n : t);
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
			let a = new N(new I(.035, i, .02), r);
			a.position.set(t, .12 - i / 2, n), a.rotation.z = (t > 0 ? 1 : -1) * .12, e.add(a);
		}
		return e;
	},
	chapelsword: () => {
		let e = new j();
		e.name = "Chapel_Sword";
		let t = V(11450047, .9, .28), n = V(7568004, .9, .35), r = V(13608540, .85, .32), i = V(15722712, 0, .85), a = new ce([
			[0, -.02],
			[.075, 0],
			[.07, 1.02],
			[0, 1.2],
			[-.07, 1.02],
			[-.075, 0]
		].map(([e, t]) => new Oe(e, t))), o = new N(new h(a, {
			depth: .035,
			bevelEnabled: !0,
			bevelThickness: .012,
			bevelSize: .012,
			bevelSegments: 1
		}), t);
		o.geometry.translate(0, 0, -.0175), o.position.y = .2, o.name = "Chapel_Sword_Blade", e.add(o);
		let s = new N(new I(.028, .78, .062), n);
		s.position.y = .66, e.add(s);
		let c = new N(new I(.44, .06, .08), r);
		c.position.y = .17, e.add(c);
		for (let t of [-1, 1]) {
			let n = new N(new M(.045, 10, 8), r);
			n.position.set(t * .235, .13, 0), e.add(n);
		}
		let l = new N(new A(.042, .046, .3, 10), i);
		e.add(l);
		for (let t of [
			-.08,
			0,
			.08
		]) {
			let n = new N(new L(.046, .009, 4, 12), r);
			n.rotation.x = Math.PI / 2, n.position.y = t, e.add(n);
		}
		let u = new N(new A(.09, .09, .05, 16), r);
		u.rotation.x = Math.PI / 2, u.position.y = -.21, e.add(u);
		let d = new N(new A(.045, .045, .06, 8), i);
		return d.rotation.x = Math.PI / 2, d.position.y = -.21, e.add(d), e;
	},
	psalter: () => {
		let e = Jc({
			name: "Chained_Psalter",
			w: .4,
			h: .36,
			t: .22,
			cover: 5909026,
			edge: 12095548,
			pages: 15260864,
			clasp: 12095548,
			corners: !0
		}), t = V(9080984, .85, .4), n = new j();
		n.userData.hang = !0, n.position.set(0, .08, -.2), e.add(n);
		for (let e = 0; e < 9; e++) {
			let r = new N(new L(.035, .012, 4, 8), t);
			r.position.y = .03 + e * .055, r.rotation.y = e % 2 ? Math.PI / 2 : 0, r.name = "Chained_Psalter_Chain", n.add(r);
		}
		let r = new N(new L(.06, .016, 5, 12), t);
		return r.position.y = .55, n.add(r), e;
	},
	hours: () => {
		let e = Jc({
			name: "Book_of_Hours",
			w: .3,
			h: .26,
			t: .14,
			cover: 2767466,
			edge: 13608540,
			pages: 15919830,
			clasp: 13608540,
			corners: !0
		});
		for (let [t, n] of [[-.03, 10103338], [.04, 13608540]]) {
			let r = new N(new I(.01, .2, .03), V(n, 0, .8));
			r.position.set(0, -.02, t), r.name = "Book_of_Hours_Ribbon", e.add(r);
		}
		return e;
	},
	spiritstaff: () => {
		let e = new j();
		e.name = "Spirit_Staff", e.userData.hang = "up";
		let t = V(8017460, 0, .88), n = V(11048314, 0, .95), r = V(15524554, 0, .7), i = V(3815988, 0, .9), a = V(11549226, .1, .5), o = [];
		for (let e = 0; e <= 10; e++) {
			let t = e / 10;
			o.push(new F(Math.sin(t * 9) * .03, -.62 + t * 1.72, Math.cos(t * 7) * .025));
		}
		let s = new N(new Je(new We(o), 20, .066, 7, !1), t);
		s.name = "Spirit_Staff_Shaft", e.add(s);
		for (let [n, r] of [[.5, .36], [-.6, .3]]) {
			let i = new We([
				new F(0, 1.08, 0),
				new F(Math.sin(n) * r * .5, 1.08 + r * .6, .02),
				new F(Math.sin(n) * r, 1.08 + r * .85, 0)
			]);
			e.add(new N(new Je(i, 8, .032, 6, !1), t));
		}
		let c = new N(new A(.075, .07, .22, 9), n);
		c.position.y = .98, e.add(c);
		for (let t = 0; t < 5; t++) {
			let a = t * 1.26, o = new N(new A(.006, .006, .18, 4), n);
			o.position.set(Math.cos(a) * .08, .82, Math.sin(a) * .08), e.add(o);
			let s = Math.cos(a) * .09, c = Math.sin(a) * .09;
			if (t % 2 == 0) {
				let t = new N(new A(.03, .03, .2, 6), r);
				t.position.set(s, .6699999999999999, c), e.add(t);
				for (let t of [-1, 1]) {
					let n = new N(new M(.045, 6, 5), r);
					n.position.set(s, .6699999999999999 + t * .1, c), e.add(n);
				}
			} else {
				let t = new N(new R(.06, .3, 4), i);
				t.scale.z = .3, t.rotation.y = a, t.rotation.x = Math.PI, t.position.set(s, .6799999999999999, c), e.add(t);
			}
		}
		let l = new N(new M(.04, 8, 6), a);
		return l.position.set(0, .9, .085), e.add(l), e;
	},
	antlerrod: () => {
		let e = new j();
		e.name = "Antler_Rod";
		let t = V(13286814, 0, .75), n = V(15656140, 0, .6), r = V(6965808, 0, .9), i = new We([
			new F(0, -.26, 0),
			new F(.02, .2, 0),
			new F(-.02, .55, .01),
			new F(.03, .78, 0)
		]);
		e.add(new N(new Je(i, 12, .045, 7, !1), t));
		for (let [r, i, a] of [
			[
				.7,
				.45,
				.26
			],
			[
				-.8,
				.6,
				.22
			],
			[
				.2,
				.78,
				.14
			]
		]) {
			let o = new We([
				new F(0, i, 0),
				new F(Math.sin(r) * a * .6, i + a * .5, .01),
				new F(Math.sin(r) * a, i + a, 0)
			]);
			e.add(new N(new Je(o, 6, .026, 6, !1), t));
			let s = new N(new R(.026, .06, 6), n);
			s.position.set(Math.sin(r) * a, i + a + .02, 0), s.rotation.z = -r * .6, e.add(s);
		}
		for (let t of [
			-.05,
			.02,
			.09
		]) {
			let n = new N(new L(.05, .012, 4, 10), r);
			n.rotation.x = Math.PI / 2, n.position.y = t, e.add(n);
		}
		return e;
	},
	fetish: () => {
		let e = new j();
		e.name = "Bone_Fetish", e.userData.hang = !0, e.scale.setScalar(1.5);
		let t = V(14866108, 0, .7), n = V(6961698, 0, .9), r = V(10103338, .1, .4), i = V(4868672, 0, .9), a = new N(new A(.01, .01, .1, 4), n);
		a.position.y = .05, e.add(a);
		let o = new N(new M(.04, 8, 6), n);
		o.position.y = .12, e.add(o), e.children.forEach((e) => {
			e !== a && e !== o && (e.position.y -= .1);
		});
		for (let n of [-1, 1]) {
			let r = new N(new A(.02, .02, .26, 6), t);
			r.position.y = .3, r.rotation.z = n * .7, e.add(r);
			for (let r of [-1, 1]) {
				let i = new N(new M(.03, 6, 5), t);
				i.position.set(Math.sin(n * .7) * -r * .13, .3 + Math.cos(n * .7) * r * .13, 0), e.add(i);
			}
		}
		for (let [n, r] of [
			[-.05, .02],
			[0, -.03],
			[.05, .02]
		]) {
			let i = new N(new R(.028, .16, 6), t);
			i.position.set(n, .4, r), e.add(i);
		}
		for (let t of [-1, 1]) {
			let n = new N(new R(.04, .24, 4), i);
			n.scale.z = .3, n.position.set(t * .07, .36, -.02), n.rotation.z = t * .25 + Math.PI, e.add(n);
		}
		for (let [t, n] of [
			[-.05, .15],
			[.05, .15],
			[0, .18],
			[-.025, .12],
			[.025, .12]
		]) {
			let i = new N(new M(.032, 8, 6), r);
			i.position.set(t, n, .03), e.add(i);
		}
		return e;
	},
	coif: () => {
		let e = $c({
			name: "Chapel_Coif",
			cloth: 14208176,
			shade: 11049598,
			open: .78,
			rz: .66,
			tip: 0
		}), t = V(13608540, .85, .32), n = V(14208176, 0, .9), r = new N(new L(1, .04, 5, 32, Math.PI), t), i = Zc(.66, .7);
		r.rotation.x = Math.PI / 2 + .12, r.scale.set(i.hx * .97, .505 - i.cz, 1), r.position.set(0, .68, i.cz), r.name = "Chapel_Coif_Band", r.userData.onFace = !0, e.add(r);
		let a = new N(new A(.46, .72, .3, 22, 1, !0), new l({
			color: 14208176,
			roughness: .92,
			side: 2
		}));
		a.position.set(0, -.08, -.03), a.name = "Chapel_Coif_Wimple", e.add(a);
		let o = new N(new A(.5, .72, .9, 16, 1, !0, Math.PI * .6, Math.PI * .8), n);
		return o.position.set(0, .2, -.12), o.name = "Chapel_Coif_Veil", e.add(o), e;
	},
	hidecowl: () => {
		let e = $c({
			name: "Hide_Cowl",
			cloth: 8022608,
			shade: 4865580,
			open: .7,
			rz: .72,
			tip: .35
		}), t = V(5917240, 0, 1), n = V(14866108, 0, .7);
		for (let n = 0; n < 14; n++) {
			let r = n / 14 * Math.PI * 2;
			if (Math.abs(Math.sin(r) - 1) < .2) continue;
			let i = new N(new v(.13, 0), t);
			i.position.set(Math.cos(r) * .52, -.16 + n % 2 * .05, Math.sin(r) * .5 - .06), i.scale.set(1, .8, 1), i.rotation.set(n, n * 2, 0), i.name = "Hide_Cowl_Ruff", e.add(i);
		}
		for (let t = -3; t <= 3; t++) {
			let r = Math.PI / 2 + t * .2, i = new N(new M(.04, 6, 5), n), a = .8 - Math.abs(t) * .025, o = Zc(.72, a);
			i.position.set(Math.cos(r) * (o.hx + .02), a, Math.sin(r) * (o.hz + .02) + o.cz), i.userData.onFace = !0, e.add(i);
		}
		return e;
	},
	hood: () => $c({
		name: "Rogue_Hood",
		cloth: 6967876,
		shade: 3022872,
		open: .68,
		rz: .72,
		tip: .5
	}),
	amulet: () => {
		let e = new j();
		e.name = "Amulet";
		let t = V(11043898, .85, .4), n = V(14263361, .9, .3), r = new l({
			color: 4164863,
			metalness: .1,
			roughness: .15,
			emissive: 666224,
			emissiveIntensity: .6
		});
		for (let n of [-1, 1]) {
			let r = new F(n * .15, .2, .345), i = new F(0, .04, .405), a = new N(new A(.011, .011, r.distanceTo(i), 4), t);
			a.position.copy(r).add(i).multiplyScalar(.5), a.quaternion.setFromUnitVectors(new F(0, 1, 0), i.clone().sub(r).normalize()), a.name = "Amulet_Chain", e.add(a);
		}
		let i = new N(new A(.075, .075, .024, 16), n);
		i.rotation.x = Math.PI / 2, i.position.set(0, 0, .42), e.add(i);
		let a = new N(new M(.04, 12, 9), r);
		return a.scale.z = .6, a.position.set(0, 0, .44), a.name = "Amulet_Gem", e.add(a), e;
	},
	charm: () => {
		let e = new j();
		e.name = "Charm";
		let t = V(15129796, 0, .7), n = V(6961698, 0, .9), r = V(10103338, .1, .35), i = new j();
		i.position.set(-.4, 0, .2), i.rotation.y = -.9, i.scale.setScalar(1.5), e.add(i);
		let a = new N(new A(.009, .009, .14, 4), n);
		a.position.set(0, .17, 0), i.add(a);
		let o = new N(new R(.035, .17, 8), t);
		o.rotation.z = Math.PI, o.position.set(0, .01, .01), o.name = "Charm_Fang", i.add(o);
		for (let e of [-1, 1]) {
			let t = new N(new M(.026, 8, 6), r);
			t.position.set(e * .035, .11, .015), i.add(t);
		}
		return e;
	},
	quiver: () => {
		let e = new j();
		e.name = "Quiver";
		let t = V(5913126, 0, .85), n = V(3022616, 0, .9), r = V(11569754, 0, .8), i = V(14209216, 0, .9), a = new j();
		a.position.set(-.08, -.02, -.46), a.rotation.z = .42, e.add(a);
		let o = new N(new A(.11, .09, .66, 10), t);
		a.add(o);
		for (let e of [.3, -.3]) {
			let t = new N(new L(.105, .016, 4, 12), n);
			t.rotation.x = Math.PI / 2, t.position.y = e, a.add(t);
		}
		for (let e = 0; e < 5; e++) {
			let t = e * 1.3, n = Math.cos(t) * .05, o = Math.sin(t) * .05, s = new N(new A(.01, .01, .2, 4), r);
			s.position.set(n, .42, o), a.add(s);
			let c = new N(new I(.06, .12, .008), i);
			c.position.set(n, .5, o), c.rotation.y = t, a.add(c);
		}
		let s = new N(new L(.42, .018, 4, 24, Math.PI), n);
		return s.rotation.set(0, 0, -.9), s.position.set(0, 0, 0), s.scale.set(1, 1, 1), e.add(s), e;
	},
	boltcase: () => {
		let e = new j();
		e.name = "Bolt_Case";
		let t = V(4861986, 0, .85), n = V(9080984, .85, .4), r = V(10123856, 0, .8), i = new N(new I(.12, .3, .16), t);
		i.position.set(-.42, .12, .08), i.rotation.z = -.15, e.add(i);
		let a = new N(new I(.13, .03, .17), n);
		a.position.set(-.44, .28, .08), a.rotation.z = -.15, e.add(a);
		let o = V(15261900, 0, .85);
		for (let [t, n] of [
			[-.43, .03],
			[-.45, .08],
			[-.43, .13],
			[-.46, .115]
		]) {
			let i = new N(new A(.014, .014, .18, 4), r);
			i.position.set(t, .36, n), i.rotation.z = -.15, e.add(i);
			let a = new N(new I(.05, .06, .008), o);
			a.position.set(t - .012, .44, n), a.rotation.set(0, n * 9, -.15), e.add(a);
		}
		return e;
	},
	huntbow: () => el({
		name: "Hunting_Bow",
		half: .7,
		draw: .2,
		curl: .08,
		wood: 9067058,
		nock: 3022616,
		r: .045
	}),
	longbow: () => el({
		name: "Yew_Longbow",
		half: 1,
		draw: .24,
		curl: 0,
		wood: 11565632,
		nock: 15260864,
		r: .042
	}),
	chain: () => {
		let e = new j();
		e.name = "Office_Chain";
		let t = V(13672520, .85, .32), n = V(6965790, .8, .45), r = V(3815478, .8, .5), i = new We([
			[
				-.34,
				.25,
				-.06
			],
			[
				-.3,
				.17,
				.22
			],
			[
				-.17,
				.02,
				.4
			],
			[
				0,
				-.06,
				.45
			],
			[
				.17,
				.02,
				.4
			],
			[
				.3,
				.17,
				.22
			],
			[
				.34,
				.25,
				-.06
			],
			[
				0,
				.3,
				-.3
			]
		].map((e) => new F(...e)), !0), a = new F(), o = new F();
		for (let r = 0; r < 30; r++) {
			i.getPointAt(r / 30, a), i.getTangentAt(r / 30, o);
			let s = new N(new I(.075, .03, .05), r % 2 ? n : t);
			s.position.copy(a), s.quaternion.setFromUnitVectors(new F(1, 0, 0), o), s.name = "Office_Chain_Link", e.add(s);
		}
		let s = new N(new A(.11, .11, .03, 18), t);
		s.rotation.x = Math.PI / 2 - .2, s.position.set(0, -.15, .46), s.name = "Office_Chain_Seal", e.add(s);
		for (let t of [-1, 1]) {
			let n = new N(new I(.02, .15, .012), r);
			n.rotation.set(-.2, 0, t * .75), n.position.set(0, -.15, .48), e.add(n);
		}
		return e;
	},
	hod: () => {
		let e = new j();
		e.name = "Slag_Hod";
		let t = V(8017460, 0, .9), n = V(4078134, .7, .55), r = V(3811352, 0, .9), i = [
			V(3025448, .1, .9),
			V(4538426, .1, .85),
			V(2367518, .1, .95)
		], a = new l({
			color: 16747072,
			emissive: 13647888,
			emissiveIntensity: 1.4,
			roughness: .6
		}), o = new j();
		o.position.set(0, .46, -.62), o.rotation.x = -.16, e.add(o);
		let s = .66, c = .42, u = .9;
		for (let e of [-1, 1]) {
			let n = new N(new I(.05, u, c), t);
			n.position.set(e * s / 2, 0, 0), n.rotation.z = -e * .1, o.add(n);
			let r = new N(new I(s, u, .05), t);
			r.position.set(0, 0, e * c / 2), o.add(r);
		}
		let d = new N(new I(.61, .05, c), t);
		d.position.y = -.9 / 2 + .03, o.add(d);
		for (let e of [-.28, .3]) {
			let t = new N(new I(.76, .06, .48), n);
			t.position.y = e, o.add(t);
		}
		[
			[
				-.18,
				.49,
				.05,
				.17
			],
			[
				.12,
				.53,
				-.06,
				.19
			],
			[
				0,
				.66,
				.02,
				.16
			],
			[
				.22,
				.47,
				.1,
				.13
			],
			[
				-.08,
				.51,
				-.12,
				.15
			],
			[
				-.24,
				.45,
				-.1,
				.12
			],
			[
				.08,
				.77,
				.04,
				.11
			]
		].forEach(([e, t, n, r], a) => {
			let s = new N(new v(r, 0), i[a % 3]);
			s.position.set(e, t, n), s.rotation.set(a, a * 2.1, a * .7), s.name = "Slag_Hod_Slag", o.add(s);
		});
		for (let [e, t, n, r] of [
			[
				.06,
				.56,
				.15,
				.08
			],
			[
				-.14,
				.62,
				.07,
				.07
			],
			[
				.2,
				.6,
				-.08,
				.06
			]
		]) {
			let i = new N(new v(r, 0), a);
			i.position.set(e, t, n), i.name = "Slag_Hod_Ember", i.userData.glow = 16740400, o.add(i);
		}
		for (let t of [-1, 1]) {
			let n = new N(new L(.34, .03, 4, 16, Math.PI * 1.25), r);
			n.rotation.set(0, Math.PI / 2, Math.PI * .62), n.position.set(t * .2, 0, -.08), n.scale.set(1, 1.15, 1.05), e.add(n);
		}
		return e;
	},
	shovel: () => {
		let e = new j();
		e.name = "Slag_Shovel";
		let t = V(6965802, 0, .8), n = V(4078650, .85, .45), r = V(6961698, .4, .7), i = new N(new A(.045, .05, 1.6, 8), t);
		i.position.y = .45, e.add(i);
		let a = new N(new A(.06, .09, .22, 8), n);
		a.position.y = 1.32, e.add(a);
		let o = new N(new A(.26, .26, .44, 12, 1, !0, -.75, 1.5), n);
		o.material = n.clone(), o.material.side = 2, o.position.set(0, 1.62, -.2), o.name = "Slag_Shovel_Blade", e.add(o);
		let s = new N(new I(.36, .035, .05), r);
		return s.position.set(0, 1.83, .02), e.add(s), e;
	},
	pickaxe: () => {
		let e = new j();
		e.name = "Miner_Pick", e.userData.hang = !0;
		let t = V(6965802, 0, .8), n = V(4868166, .85, .42), r = new N(new A(.04, .05, .92, 8), t);
		r.position.y = .38, e.add(r);
		for (let t of [-1, 1]) {
			let r = new N(new R(.055, .42, 6), n);
			r.rotation.z = -t * (Math.PI / 2 - .25), r.position.set(t * .2, .8, 0), r.name = "Miner_Pick_Head", e.add(r);
		}
		let i = new N(new I(.12, .12, .1), n);
		return i.position.y = .84, e.add(i), e;
	},
	minerlamp: () => {
		let e = new j();
		e.name = "Miner_Lamp", e.userData.hang = !0;
		let t = V(13146696, .85, .35), n = V(3815478, .7, .5), r = new l({
			color: 16765056,
			emissive: 13660184,
			emissiveIntensity: 1.3,
			roughness: .3
		}), i = new N(new L(.06, .015, 5, 12), n);
		i.position.y = .06, e.add(i);
		let a = new N(new A(.06, .12, .14, 10), t);
		a.position.y = .18, e.add(a);
		let o = new N(new A(.085, .085, .2, 10), r);
		o.position.y = .35, o.name = "Miner_Lamp_Glass", o.userData.glow = 16756808, e.add(o);
		for (let t = 0; t < 3; t++) {
			let r = t / 3 * Math.PI * 2, i = new N(new I(.022, .22, .022), n);
			i.position.set(Math.cos(r) * .1, .35, Math.sin(r) * .1), e.add(i);
		}
		let s = new N(new A(.12, .11, .16, 12), t);
		return s.position.y = .53, e.add(s), e;
	},
	minercap: () => qc(!1),
	lampcap: () => qc(!0),
	beads: () => {
		let e = new j();
		e.name = "Wise_Beads";
		let t = [
			V(14866108, 0, .7),
			V(10496542, .1, .4),
			V(13666858, .2, .35),
			V(2762276, .6, .5)
		];
		[
			[.06, 0],
			[-.06, 1],
			[-.18, 2]
		].forEach(([n, r], i) => {
			let a = new We([
				[
					-.26,
					.24,
					.02
				],
				[
					-.22,
					.12,
					.3
				],
				[
					0,
					n,
					.44
				],
				[
					.22,
					.12,
					.3
				],
				[
					.26,
					.24,
					.02
				]
			].map((e) => new F(...e))), o = 11 + i * 2, s = new F();
			for (let n = 0; n <= o; n++) {
				a.getPointAt(n / o, s);
				let c = new N(new M(.03 + .008 * ((n + i) % 2), 7, 5), t[(n + r) % 3]);
				c.position.copy(s), c.name = "Wise_Beads_Bead", e.add(c);
			}
		});
		for (let [n, r] of [
			[-.1, -.08],
			[0, -.26],
			[.12, -.1]
		]) {
			let i = new N(new A(.045, .045, .02, 6), t[3]);
			i.rotation.x = Math.PI / 2, i.position.set(n, r, .45), e.add(i);
		}
		return e;
	},
	garter: () => {
		let e = new j();
		e.name = "Sleeve_Garter";
		let t = new N(new L(.15, .04, 6, 16), V(11546666, 0, .6));
		return t.rotation.x = Math.PI / 2, t.position.y = .2, e.add(t), e;
	},
	emberhammer: () => {
		let e = new j();
		e.name = "Ember_Hammer", e.userData.hang = "up";
		let t = V(5914148, 0, .8), n = V(3815998, .85, .4), r = V(3022616, 0, .9), i = new l({
			color: 16752720,
			emissive: 14703120,
			emissiveIntensity: 1.5,
			roughness: .4
		}), a = new N(new A(.045, .055, .72, 8), t);
		a.position.y = .22, e.add(a);
		let o = new N(new A(.062, .062, .24, 8), r);
		o.position.y = -.02, e.add(o);
		let s = new N(new I(.4, .18, .18), n);
		s.position.y = .6, s.name = "Ember_Hammer_Head", e.add(s);
		let c = new N(new A(.105, .105, .06, 10), i);
		c.rotation.z = Math.PI / 2, c.position.set(.23, .6, 0), c.name = "Ember_Hammer_Face", c.userData.glow = 16744496, e.add(c);
		let u = new N(new I(.03, .19, .19), i);
		u.position.set(.02, .6, 0), u.name = "Ember_Hammer_Seam", u.userData.glow = 16744496, e.add(u);
		let d = new N(new I(.1, .06, .16), n);
		return d.position.set(-.24, .6, 0), e.add(d), e;
	},
	tongs: () => {
		let e = new j();
		e.name = "Smith_Tongs", e.userData.hang = !0;
		let t = V(3815998, .85, .42), n = new l({
			color: 16756832,
			emissive: 14704656,
			emissiveIntensity: 1.5,
			roughness: .5
		});
		for (let n of [-1, 1]) {
			let r = new N(new I(.03, .62, .03), t);
			r.position.set(n * .025, .3, 0), r.rotation.z = n * .04, e.add(r);
		}
		let r = new N(new I(.06, .24, .06), n);
		return r.position.set(0, .68, .05), r.rotation.x = 1.2, r.name = "Smith_Tongs_Billet", r.userData.glow = 16744496, e.add(r), e;
	},
	scales: () => {
		let e = new j();
		e.name = "Brass_Scales", e.userData.hang = !0;
		let t = V(13146696, .85, .35), n = V(3811870, 0, .9), r = new N(new L(.05, .014, 5, 10), t);
		r.position.y = .05, e.add(r);
		let i = new N(new A(.018, .018, .12, 6), t);
		i.position.y = .14, e.add(i);
		let a = new N(new I(.62, .035, .035), t);
		a.position.y = .2, a.name = "Brass_Scales_Beam", e.add(a);
		for (let r of [-1, 1]) {
			for (let t of [-.05, .05]) {
				let i = new N(new A(.006, .006, .26, 4), n);
				i.position.set(r * .29, .33, t), i.rotation.x = -Math.sign(t) * .2, e.add(i);
			}
			let i = new N(new A(.12, .07, .05, 12), t);
			i.position.set(r * .29, .47, 0), i.name = "Brass_Scales_Pan", e.add(i);
		}
		return e;
	},
	charter: () => {
		let e = new j();
		e.name = "Charter";
		let t = V(14207136, 0, .85), n = V(9054752, 0, .6), r = V(11022366, .1, .4), i = new N(new A(.06, .06, .62, 12), t);
		i.position.y = .2, i.name = "Charter_Roll", e.add(i);
		for (let t of [0, .4]) {
			let r = new N(new L(.062, .012, 4, 12), n);
			r.rotation.x = Math.PI / 2, r.position.y = t, e.add(r);
		}
		let a = new N(new A(.055, .055, .02, 12), r);
		return a.rotation.z = Math.PI / 2, a.position.set(.08, .32, .03), e.add(a), e;
	},
	linenapron: () => Uc({
		name: "Linen_Apron",
		cloth: 13155488,
		strap: 5913124
	}),
	beardcopper: () => Kc({
		name: "Beard_Copper",
		hair: 10900520,
		len: 1
	}),
	beardbraids: () => Kc({
		name: "Beard_Braids",
		hair: 4867136,
		len: .8,
		braids: !0
	}),
	beardrust: () => Kc({
		name: "Beard_Rust",
		hair: 8272414,
		len: .75,
		braids: !0
	}),
	beardchestnut: () => Kc({
		name: "Beard_Chestnut",
		hair: 7224868,
		len: .85
	}),
	beardash: () => Kc({
		name: "Beard_Ash",
		hair: 9077368,
		len: 1.15,
		braids: !0
	}),
	beardcut: () => Kc({
		name: "Beard_Cut",
		hair: 3024416,
		len: .45,
		braids: !0
	}),
	assaybadge: () => {
		let e = new j();
		e.name = "Assay_Badge";
		let t = V(13672520, .85, .32), n = V(3811856, .6, .5), r = new N(new A(.13, .13, .03, 18), t);
		r.rotation.x = Math.PI / 2, r.position.set(0, .06, .43), e.add(r);
		let i = new N(new I(.17, .02, .012), n);
		i.position.set(0, .1, .45), e.add(i);
		for (let t of [-1, 1]) {
			let r = new N(new I(.05, .015, .012), n);
			r.position.set(t * .07, .06, .45), e.add(r);
		}
		let a = new N(new I(.018, .14, .012), n);
		return a.position.set(0, .03, .45), e.add(a), e;
	},
	warpick: () => {
		let e = Hc.pickaxe();
		return e.name = "War_Pick", delete e.userData.hang, e.scale.setScalar(1.15), e;
	},
	forgehammer: () => Wc({
		name: "Forge_Sledge",
		haft: 1,
		head: [
			.48,
			.24,
			.24
		],
		hot: !0
	}),
	greathammer: () => Wc({
		name: "Oruth_Hammer",
		haft: 1.45,
		head: [
			.72,
			.34,
			.34
		],
		hot: !0,
		bands: !0
	}),
	gauntlet: () => {
		let e = new j();
		e.name = "Smith_Gauntlet";
		let t = new N(new A(.15, .12, .26, 10), V(5913122, 0, .85));
		return t.position.y = .3, e.add(t), e;
	},
	shackle: () => {
		let e = new j();
		e.name = "Binding_Shackle";
		let t = V(4867652, .8, .5), n = V(6961698, .4, .7), r = new N(new A(.16, .16, .16, 10), t);
		r.position.y = .3, e.add(r);
		for (let r = 0; r < 5; r++) {
			let i = new N(new L(.05, .016, 4, 8), r % 2 ? n : t);
			i.scale.y = 1.5, i.position.set(.14, .26 - r * .12, .04), r % 2 && (i.rotation.y = Math.PI / 2), e.add(i);
		}
		return e;
	},
	embercracks: () => {
		let e = new j();
		e.name = "Ember_Cracks";
		let t = new l({
			color: 16752704,
			emissive: 14703120,
			emissiveIntensity: 1.6,
			roughness: .5
		}), n = new N(new v(.08, 0), t);
		n.position.set(0, .05, .12), n.name = "Ember_Cracks_Core", n.userData.glow = 16744496, e.add(n);
		for (let [n, r, i, a] of [
			[
				-.12,
				.12,
				.6,
				.18
			],
			[
				.1,
				.16,
				-.5,
				.16
			],
			[
				-.06,
				-.06,
				-.3,
				.14
			],
			[
				.13,
				-.02,
				.4,
				.15
			]
		]) {
			let o = new N(new I(.025, a, .03), t);
			o.position.set(n, r, .2), o.rotation.z = i, o.name = "Ember_Cracks_Seam", o.userData.glow = 16744496, e.add(o);
		}
		return e;
	},
	censer: () => Gc(1),
	bigcenser: () => Gc(1.5),
	scalepan: () => {
		let e = new j();
		e.name = "Scale_Pan", e.userData.hang = !0;
		let t = V(13672520, .85, .32), n = V(4867652, .8, .5);
		for (let t = 0; t < 6; t++) {
			let r = new N(new L(.045, .014, 4, 8), n);
			r.scale.y = 1.5, r.position.y = .06 + t * .1, t % 2 && (r.rotation.y = Math.PI / 2), e.add(r);
		}
		for (let t = 0; t < 3; t++) {
			let r = t / 3 * Math.PI * 2, i = new N(new A(.008, .008, .3, 4), n);
			i.position.set(Math.cos(r) * .1, .78, Math.sin(r) * .1), i.rotation.set(Math.sin(r) * .35, 0, -Math.cos(r) * .35), e.add(i);
		}
		let r = new N(new A(.28, .16, .08, 16), t);
		return r.position.y = .95, r.name = "Scale_Pan_Pan", e.add(r), e;
	},
	sleeveguard: () => {
		let e = new j();
		e.name = "Sleeve_Guard";
		let t = new N(new A(.15, .13, .36, 10), V(1973278, 0, .8));
		return t.position.y = .2, e.add(t), e;
	},
	swordcane: () => {
		let e = new j();
		e.name = "Sword_Cane";
		let t = V(12107976, .9, .28), n = V(1710104, .3, .4), r = V(13159632, .9, .3), i = new N(new A(.04, .04, .3, 8), n);
		i.position.y = 0, e.add(i);
		let a = new N(new M(.06, 10, 8), r);
		a.position.y = -.17, e.add(a);
		let o = new N(new A(.045, .045, .04, 8), r);
		o.position.y = .16, e.add(o);
		let s = new N(new I(.055, 1.05, .016), t);
		return s.position.y = .7, s.name = "Sword_Cane_Blade", e.add(s), e;
	},
	poker: () => {
		let e = new j();
		e.name = "Furnace_Rake";
		let t = V(3815478, .85, .45), n = V(5914148, 0, .8), r = new l({
			color: 16752720,
			emissive: 14703120,
			emissiveIntensity: 1.5,
			roughness: .5
		}), i = new N(new A(.05, .05, .4, 8), n);
		i.position.y = 0, e.add(i);
		let a = new N(new A(.035, .04, 1.6, 6), t);
		a.position.y = .95, e.add(a);
		let o = new N(new A(.03, .035, .3, 6), r);
		o.position.y = 1.85, o.name = "Furnace_Rake_Tip", o.userData.glow = 16744496, e.add(o);
		let s = new N(new I(.34, .07, .05), r);
		return s.position.set(.14, 1.98, 0), s.name = "Furnace_Rake_Hook", s.userData.glow = 16744496, e.add(s), e;
	},
	facemask: () => {
		let e = new j();
		e.name = "Soot_Mask";
		let t = new N(new A(.56, .5, .36, 18, 1, !0, -1, 2), new l({
			color: 2761248,
			roughness: .9,
			side: 2
		}));
		t.position.set(0, .2, -.02), e.add(t);
		for (let t of [-1, 1]) {
			let n = new N(new M(.035, 6, 5), V(13146696, .85, .35));
			n.position.set(t * .32, .26, .42), e.add(n);
		}
		return e.traverse((e) => {
			e.isMesh && (e.name = "Soot_Mask");
		}), e;
	},
	halberd: () => {
		let e = new j();
		e.name = "Halberd", e.userData.hang = "up";
		let t = V(6965802, 0, .8), n = V(9080984, .85, .35), r = V(10103328, 0, .8), i = new N(new A(.04, .045, 2.2, 8), t);
		i.position.y = .3, e.add(i);
		let a = new N(new R(.05, .36, 6), n);
		a.position.y = 1.58, e.add(a);
		let o = new N(new I(.3, .32, .03), n);
		o.position.set(.17, 1.26, 0), o.name = "Halberd_Blade", e.add(o);
		let s = new N(new R(.04, .2, 4), n);
		s.rotation.z = Math.PI / 2, s.position.set(-.12, 1.26, 0), e.add(s);
		let c = new N(new R(.06, .2, 8), r);
		return c.position.set(0, 1, 0), e.add(c), e;
	},
	specs: () => {
		let e = new j();
		e.name = "Spectacles";
		let t = V(13148240, .85, .35);
		for (let n of [-1, 1]) {
			let r = new N(new L(.1, .018, 5, 14), t);
			r.position.set(n * .17, .36, .55), e.add(r);
		}
		let n = new N(new I(.12, .02, .02), t);
		return n.position.set(0, .38, .56), e.add(n), e;
	},
	kerchief: () => $c({
		name: "Kerchief",
		cloth: 9059876,
		shade: 3806732,
		open: .86,
		rz: .66,
		tip: .12
	}),
	widowhood: () => $c({
		name: "Widow_Hood",
		cloth: 2499108,
		shade: 789002,
		open: .74,
		rz: .7,
		tip: .25
	})
};
function Uc({ name: e, cloth: t, strap: n, z: r = .33 }) {
	let i = new j();
	i.name = e;
	let a = V(t, 0, .9), o = V(n, 0, .9), s = new N(new I(.32, .4, .04), a);
	s.position.set(0, .32, r), s.rotation.x = -.08, s.name = e + "_Bib", i.add(s);
	for (let t of [-.1, .1]) {
		let n = new N(new I(.19, .34, .04), a);
		n.position.set(t, -.1, r - .03), n.rotation.x = .12, n.name = e + "_Skirt", i.add(n);
	}
	let c = new N(new I(.5, .06, .06), o);
	return c.position.set(0, .11, r + .02), i.add(c), i;
}
function Wc({ name: e, haft: t, head: n, hot: r = !1, bands: i = !1 }) {
	let a = new j();
	a.name = e;
	let o = V(5914148, 0, .8), s = V(3815998, .85, .4), c = V(13146696, .85, .35), u = new l({
		color: 16752720,
		emissive: 14703120,
		emissiveIntensity: 1.5,
		roughness: .45
	}), d = new N(new A(.05, .06, t, 8), o);
	d.position.y = t / 2 - .15, a.add(d);
	let f = t - .12, p = new N(new I(...n), s);
	if (p.position.y = f, p.name = e + "_Head", a.add(p), r) for (let t of [-1, 1]) {
		let r = new N(new I(.03, n[1] * .8, n[2] * .8), u);
		r.position.set(t * (n[0] / 2 + .01), f, 0), r.name = e + "_Face", r.userData.glow = 16744496, a.add(r);
	}
	if (i) for (let e of [-n[0] * .28, n[0] * .28]) {
		let t = new N(new I(.05, n[1] + .03, n[2] + .03), c);
		t.position.set(e, f, 0), a.add(t);
	}
	return a;
}
function Gc(e) {
	let t = new j();
	t.name = e > 1 ? "Great_Censer" : "Censer", t.userData.hang = !0, t.scale.setScalar(e);
	let n = V(11569722, .85, .4), r = V(3815478, .8, .5), i = V(4867652, 0, 1), a = new l({
		color: 16752720,
		emissive: 14700570,
		emissiveIntensity: 1.5,
		roughness: .6
	});
	for (let e = 0; e < 4; e++) {
		let n = new N(new L(.04, .012, 4, 8), r);
		n.scale.y = 1.5, n.position.y = .06 + e * .09, e % 2 && (n.rotation.y = Math.PI / 2), t.add(n);
	}
	let o = new N(new M(.15, 10, 8), n);
	o.position.y = .52, t.add(o);
	let s = new N(new M(.155, 10, 8, 0, Math.PI * 2, Math.PI * .42, Math.PI * .16), a);
	s.position.y = .52, s.name = t.name + "_Coals", s.userData.glow = 16744496, t.add(s);
	for (let [e, n, r, a] of [[
		.06,
		.32,
		.05,
		.07
	], [
		-.05,
		.24,
		-.02,
		.06
	]]) {
		let o = new N(new v(a, 0), i);
		o.position.set(e, n, r), t.add(o);
	}
	return t;
}
function Kc({ name: e, hair: t, len: n, braids: r = !1 }) {
	let i = new j();
	i.name = e;
	let a = V(t, 0, .95), o = V(new P(t).multiplyScalar(.62).getHex(), 0, .95), s = V(13146696, .85, .35), c = new N(new M(1, 16, 12), a);
	c.scale.set(.46, .34 + .3 * n, .27), c.position.set(0, .06 - .3 * n, .33), c.name = e, i.add(c);
	let l = new N(new R(.3, .5 * n, 12), a);
	l.rotation.x = Math.PI, l.scale.z = .75, l.position.set(0, -.32 - .62 * n, .38), l.name = e, i.add(l);
	for (let t of [-1, 1]) {
		let n = new N(new M(.14, 10, 8), a);
		n.scale.set(1.2, .7, .9), n.position.set(t * .15, .12, .47), n.name = e, i.add(n);
	}
	if (r) for (let t of [-1, 1]) {
		let r = new F(t * .2, -.45 * n, .46), c = new F(t * .24, -.45 * n - .62, .42);
		for (let t = 0; t < 4; t++) {
			let n = r.clone().lerp(c, t / 4 + .1), s = new N(new M(.075, 8, 6), t % 2 ? o : a);
			s.scale.y = 1.3, s.position.copy(n), s.name = e, i.add(s);
		}
		let l = new N(new A(.07, .07, .1, 10), s);
		l.position.copy(c), l.name = e + "_Ring", i.add(l);
		let u = new N(new R(.06, .16, 8), a);
		u.rotation.x = Math.PI, u.position.copy(c).add(new F(0, -.12, 0)), u.name = e, i.add(u);
	}
	return i;
}
function qc(e) {
	let t = new j();
	t.name = e ? "Lamp_Cap" : "Miner_Cap";
	let n = V(3811870, 0, .9), r = V(2234382, 0, .95), i = new N(new M(.6, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), n);
	i.scale.set(1, .66, 1.04), i.position.set(0, .56, -.02), t.add(i);
	let a = new N(new A(.66, .7, .05, 16, 1, !1, -.9, 1.8), n);
	a.position.set(0, .56, .04), t.add(a);
	let o = new N(new A(.605, .605, .08, 16), r);
	if (o.position.set(0, .6, -.02), t.add(o), e) {
		let e = V(13146696, .85, .35), n = new N(new I(.16, .2, .1), e);
		n.position.set(0, .8, .56), t.add(n);
		let r = new N(new A(.09, .06, .08, 10), e);
		r.rotation.x = Math.PI / 2, r.position.set(0, .82, .64), t.add(r);
	}
	return t.traverse((e) => {
		e.isMesh && (e.name = t.name);
	}), t;
}
function Jc({ name: e, w: t, h: n, t: r, cover: i, edge: a, pages: o, clasp: s, boss: c, corners: l }) {
	let u = new j();
	u.name = e;
	let d = V(i, 0, .75), f = V(a, .85, .32), p = V(o, 0, .9), m = V(s, .85, .32), h = .06 + n / 2;
	for (let i of [-1, 1]) {
		let a = new N(new I(.03, n, t), d);
		a.position.set(i * (r / 2 - .015), h, 0), a.name = e + "_Cover", u.add(a);
	}
	let g = new N(new A(r / 2, r / 2, n, 10, 1, !1, Math.PI, Math.PI), d);
	g.position.set(0, h, -t / 2), u.add(g);
	let _ = new N(new I(r - .05, n - .03, t - .02), p);
	_.position.set(0, h, .01), u.add(_);
	let v = new N(new I(r + .02, .05, .06), m);
	v.position.set(0, h, t / 2 - .02), u.add(v);
	for (let e of [h - n / 2 + .04, h + n / 2 - .04]) {
		let n = new N(new A(r / 2 + .008, r / 2 + .008, .03, 10, 1, !1, Math.PI, Math.PI), f);
		n.position.set(0, e, -t / 2), u.add(n);
	}
	if (c) for (let e of [-1, 1]) {
		let t = new N(new A(.06, .06, .02, 12), V(c, .85, .32));
		t.rotation.z = Math.PI / 2, t.position.set(e * (r / 2 + .005), h, 0), u.add(t);
	}
	if (l) for (let e of [-1, 1]) for (let i of [-1, 1]) {
		let a = new N(new I(.035, .06, .06), f);
		a.position.set(e * (r / 2 - .012), h + i * (n / 2 - .03), t / 2 - .03), u.add(a);
	}
	return u;
}
var Yc = (e, t, n) => {
	let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}, Xc = (e, t = 0) => (n, r, i, a = new F()) => {
	let o = Yc(.35, 1, r), s = Yc(-.3, -1, r), c = Math.exp(-(((r + .05) / .3) ** 2)), l = (1 - .1 * o) * (1 + .3 * s) * (1 - t);
	return a.set(n * (.56 + .04 * c) * l, .48 + r * .72 * (1 - t * .5), -.08 + (i * l - .08 * o) * e);
};
function Zc(e, t) {
	let n = Xc(e), r = -1, i = 1;
	for (let e = 0; e < 30; e++) {
		let e = (r + i) / 2;
		n(0, e, 0).y < t ? r = e : i = e;
	}
	let a = (r + i) / 2, o = Math.sqrt(Math.max(0, 1 - a * a)), s = n(0, a, 0);
	return {
		hx: n(o, a, 0).x,
		hz: n(0, a, o).z - s.z,
		cz: s.z
	};
}
function Qc(e, t, n = null) {
	let r = e.attributes.position, i = new F();
	for (let e = 0; e < r.count; e++) {
		let a = r.getX(e), o = r.getY(e), s = r.getZ(e);
		if (n) {
			let e = Math.acos(Math.max(-1, Math.min(1, o))), t = Math.sqrt(a * a + s * s), r = Math.max(0, Math.min(1, (e - n.t0) / (n.t1 - n.t0))), i = Math.atan2(s, -a) - Math.PI / 2;
			i > Math.PI && (i -= 2 * Math.PI), i < -Math.PI && (i += 2 * Math.PI);
			let c = n.a * (.45 + .55 * Math.sin(Math.PI * Math.min(1, r * 1.08))), l = c + (Math.abs(i) - n.a) * (Math.PI - c) / (Math.PI - n.a), u = Math.PI / 2 + Math.sign(i || 1) * l;
			a = -Math.cos(u) * t, s = Math.sin(u) * t;
		}
		t(a, o, s, i), r.setXYZ(e, i.x, i.y, i.z);
	}
	return e.computeVertexNormals(), e;
}
function $c({ name: e, cloth: t, shade: n, open: r, rz: i, tip: a }) {
	let o = new j();
	o.name = e, o.userData.helm = !0, o.userData.hoodRz = i;
	let s = new l({
		color: t,
		roughness: .92,
		metalness: 0,
		side: 2
	}), c = Xc(i), u = new N(Qc(new M(1, 32, 12, 0, Math.PI * 2, 0, Math.PI * .32), c), s);
	u.name = e + "_Cloth", o.add(u);
	let d = r, f = {
		a: d,
		t0: Math.PI * .3,
		t1: Math.PI * .96
	}, p = new N(Qc(new M(1, 40, 22, Math.PI / 2 + d, Math.PI * 2 - 2 * d, Math.PI * .3, Math.PI * .66), c, f), s);
	p.name = e + "_Cloth", o.add(p);
	let m = new N(Qc(new M(1, 36, 18, Math.PI / 2 + d, Math.PI * 2 - 2 * d, Math.PI * .3, Math.PI * .66), Xc(i, .015), f), new l({
		color: new P(n).multiplyScalar(.55),
		roughness: 1,
		side: 1
	}));
	if (o.add(m), a) {
		let e = a + .35, t = new N(new R(.2, e, 12), s), n = c(0, .62, -.78), r = new F(0, -.8, -.6).normalize();
		t.position.copy(n).addScaledVector(r, e * .42), t.quaternion.setFromUnitVectors(new F(0, 1, 0), r.clone().negate()), t.scale.set(1, 1, .65), o.add(t);
	}
	return o;
}
function el({ name: e, half: t, draw: n, curl: r, wood: i, nock: a, r: o }) {
	let s = new j();
	s.name = e;
	let c = V(i, 0, .75), l = V(a, .1, .5), u = V(3022616, 0, .9), d = V(15129800, 0, .8), f = (i) => {
		let a = [
			0,
			.25,
			.5,
			.75,
			1
		].map((e) => new F(-n * e * e + r * Math.max(0, e - .75) * 4, i * t * e, 0)), u = new Je(new We(a), 12, o, 6, !1), d = u.attributes.position;
		for (let e = 0; e < d.count; e++) {
			let n = d.getY(e), r = Math.min(1, Math.abs(n) / t), i = 1 - .55 * r, o = a[Math.round(r * 4)];
			d.setX(e, o.x + (d.getX(e) - o.x) * i), d.setZ(e, d.getZ(e) * i);
		}
		let f = new N(u, c);
		f.name = e + "_Limb", s.add(f);
		let p = new N(new M(o * .9, 8, 6), l);
		return p.position.copy(a[4]), p.name = e + "_Nock", s.add(p), a[4];
	}, p = f(1), m = f(-1), h = new N(new A(o * 1.5, o * 1.5, .24, 8), u);
	h.name = e + "_Grip", s.add(h);
	let g = new N(new A(.008, .008, p.distanceTo(m), 4), d);
	return g.position.set((p.x + m.x) / 2, 0, 0), g.name = e + "_String", s.add(g), s;
}
function tl(e, t) {
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
function nl(e, t) {
	let n = /* @__PURE__ */ new Map();
	e.traverse((e) => {
		if (!e.isMesh || !e.material.map || /Eyes/.test(e.name) || e.userData.foreign) return;
		let r = n.get(e.material);
		if (!r) {
			let i = e.material.map, a = new we(tl(i.image, t));
			a.flipY = i.flipY, a.colorSpace = i.colorSpace, a.magFilter = i.magFilter, a.minFilter = i.minFilter, a.wrapS = i.wrapS, a.wrapT = i.wrapT, r = e.material.clone(), r.map = a, n.set(e.material, r);
		}
		e.material = r;
	});
}
//#endregion
//#region ember3d/faces.js
var rl = /* @__PURE__ */ e({
	HAIR: () => sl,
	HEADS: () => gu,
	IRIS: () => cl,
	SHAPES: () => Ml,
	SKIN: () => ol,
	buildFace: () => Wu,
	kkHead: () => pl,
	setFaceStyle: () => au,
	shellOf: () => Nl
}), il = (e, t) => `${Math.floor(e * 8)},${Math.floor(t * 4)}`, al = (e, t = .8, n = 0) => new l({
	color: e,
	roughness: t,
	metalness: n
}), ol = {
	porcelain: "#f2d2bc",
	fair: "#e8b896",
	rose: "#dca088",
	olive: "#c89a6c",
	tan: "#b07850",
	umber: "#8a5a3a",
	deep: "#6c4430"
}, sl = {
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
}, cl = {
	brown: "#5a3218",
	hazel: "#7a6a30",
	green: "#4a7a3a",
	blue: "#4a74b0",
	grey: "#7a8894",
	amber: "#b07820"
}, ll = (e, t, n) => new P(e[t] || t || n), ul = (e) => .2126 * e.r + .7152 * e.g + .0722 * e.b, dl = (e, t, n, r = 1) => {
	let i = e.clone().lerp(new P(t), n), a = ul(i);
	return a > 0 ? i.multiplyScalar(ul(e) * r / a) : i;
}, fl = /* @__PURE__ */ new Map();
async function pl(e, t) {
	if (fl.has(t)) return fl.get(t);
	let n = await e(`./models/${t}.glb`);
	n.scene.updateMatrixWorld(!0);
	let r = null;
	n.scene.traverse((e) => {
		e.isSkinnedMesh && /Head/.test(e.name) && (r = e);
	});
	let i = r.skeleton, a = i.bones.findIndex((e) => e.name === "head"), o = i.boneInverses[a].clone().multiply(r.bindMatrix), s = r.geometry, c = s.attributes.position, l = s.attributes.normal, u = s.attributes.uv, d = s.index, f = (e) => d ? d.getX(e) : e, p = (d ? d.count : c.count) / 3, m = new et().getNormalMatrix(o), h = {};
	for (let e = 0; e < p; e++) {
		let t = 0, n = 0;
		for (let r = 0; r < 3; r++) {
			let i = f(e * 3 + r);
			t += u.getX(i) / 3, n += u.getY(i) / 3;
		}
		(h[il(t, n)] ||= []).push(e);
	}
	let g = new F(), _ = new F(), v = {};
	for (let [e, t] of Object.entries(h)) {
		let n = [], r = [], i = [];
		for (let e of t) for (let t = 0; t < 3; t++) {
			let a = f(e * 3 + t);
			g.fromBufferAttribute(c, a).applyMatrix4(o), n.push(g.x, g.y, g.z), _.fromBufferAttribute(l, a).applyMatrix3(m).normalize(), r.push(_.x, _.y, _.z), i.push(u.getX(a), u.getY(a));
		}
		let a = new Pe();
		a.setAttribute("position", new k(n, 3)), a.setAttribute("normal", new k(r, 3)), a.setAttribute("uv", new k(i, 2)), v[e] = a;
	}
	let y = {
		parts: v,
		material: r.material,
		headName: r.name
	};
	return fl.set(t, y), y;
}
function ml(e, t, n = null, r = !0) {
	let i = e.attributes.position, a = e.attributes.normal, o = e.attributes.uv, s = [], c = [], l = [], u = new F(), d = new F(), f = new F(), p = new F(), m = new F();
	for (let e = 0; e < i.count; e += 3) {
		d.set(0, 0, 0);
		for (let t = 0; t < 3; t++) d.add(u.fromBufferAttribute(i, e + t));
		if (d.multiplyScalar(1 / 3), u.fromBufferAttribute(i, e), p.fromBufferAttribute(i, e + 1).sub(u), m.fromBufferAttribute(i, e + 2).sub(u), f.crossVectors(p, m).normalize(), t(d, f)) for (let t = 0; t < 3; t++) u.fromBufferAttribute(i, e + t), n && n(u), s.push(u.x, u.y, u.z), c.push(a.getX(e + t), a.getY(e + t), a.getZ(e + t)), o && l.push(o.getX(e + t), o.getY(e + t));
	}
	let h = new Pe();
	return h.setAttribute("position", new k(s, 3)), h.setAttribute("normal", new k(c, 3)), o && h.setAttribute("uv", new k(l, 2)), n && r && h.computeVertexNormals(), h;
}
function hl(e, t, n = null) {
	let r = e.attributes.position, i = [], a = [
		new F(),
		new F(),
		new F()
	], o = new F(), s = new F(), c = (e, n) => {
		let r = 0, i = 1;
		for (let a = 0; a < 12; a++) {
			let a = (r + i) / 2;
			o.lerpVectors(e, n, a), t(o) === t(e) ? r = a : i = a;
		}
		return s.lerpVectors(e, n, (r + i) / 2).clone();
	};
	for (let e = 0; e < r.count; e += 3) {
		for (let t = 0; t < 3; t++) a[t].fromBufferAttribute(r, e + t);
		let o = a.map((e) => t(e)), s = o.filter(Boolean).length;
		if (!s) continue;
		let l = [];
		if (s === 3) l = a.map((e) => e.clone());
		else for (let e = 0; e < 3; e++) {
			let t = a[e], n = a[(e + 1) % 3];
			o[e] && l.push(t.clone()), o[e] !== o[(e + 1) % 3] && l.push(c(t, n));
		}
		for (let e = 1; e + 1 < l.length; e++) for (let t of [
			l[0],
			l[e],
			l[e + 1]
		]) {
			let e = t.clone();
			n && n(e), i.push(e.x, e.y, e.z);
		}
	}
	let l = new Pe();
	l.setAttribute("position", new k(i, 3)), l.computeVertexNormals();
	let u = l.attributes.normal, d = (e) => `${Math.round(i[e * 3] * 2e3)},${Math.round(i[e * 3 + 1] * 2e3)},${Math.round(i[e * 3 + 2] * 2e3)}`, f = /* @__PURE__ */ new Map();
	for (let e = 0; e < i.length / 3; e++) {
		let t = d(e), n = f.get(t) || [
			0,
			0,
			0
		];
		n[0] += u.getX(e), n[1] += u.getY(e), n[2] += u.getZ(e), f.set(t, n);
	}
	for (let e = 0; e < i.length / 3; e++) {
		let t = f.get(d(e)), n = Math.hypot(t[0], t[1], t[2]) || 1;
		u.setXYZ(e, t[0] / n, t[1] / n, t[2] / n);
	}
	return l;
}
var gl = /* @__PURE__ */ new Map();
function _l(e, t) {
	if (t && gl.has(t)) return gl.get(t);
	let n = (/* @__PURE__ */ new Float32Array(1225)).fill(NaN), r = new N(e, new tt({ side: 2 })), a = new i(), o = new F();
	for (let e = 0; e <= 24; e++) for (let t = 0; t <= 48; t++) {
		let i = -Math.PI / 2 + Math.PI * e / 24, s = -Math.PI + 2 * Math.PI * t / 48;
		o.set(Math.cos(i) * Math.sin(s), Math.sin(i), Math.cos(i) * Math.cos(s)), a.set(Tl, o);
		let c = a.intersectObject(r);
		c.length && (n[e * 49 + t] = c[c.length - 1].distance);
	}
	for (let e = 23; e >= 0; e--) for (let t = 0; t <= 48; t++) Number.isNaN(n[e * 49 + t]) && (n[e * 49 + t] = n[(e + 1) * 49 + t]);
	let s = {
		NA: 48,
		NB: 24,
		R: n
	};
	return t && gl.set(t, s), s;
}
var vl = ({ NA: e, NB: t, R: n }, r) => {
	let i = Math.asin(Math.max(-1, Math.min(1, r.y))), a = Math.atan2(r.x, r.z), o = (i + Math.PI / 2) / Math.PI * t, s = (a + Math.PI) / (2 * Math.PI) * e, c = Math.min(t - 1, Math.floor(o)), l = Math.min(e - 1, Math.floor(s)), u = o - c, d = s - l, f = (t, r) => n[t * (e + 1) + r];
	return Al(Al(f(c, l), f(c, l + 1), d), Al(f(c + 1, l), f(c + 1, l + 1), d), u);
};
function yl(e, t, n, r = .01) {
	let i = new F();
	return ml(e, () => !0, (e) => {
		i.subVectors(e, Tl);
		let a = i.length();
		i.divideScalar(a || 1);
		let o = vl(n, i), s = o - vl(t, i);
		e.copy(Tl).addScaledVector(i, Math.max(a + (Number.isFinite(s) ? s : 0) + r, o + .02));
	});
}
function bl(...e) {
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
		t[n] = new k(a, i);
	}
	let n = new Pe();
	for (let [e, r] of Object.entries(t)) n.setAttribute(e, r);
	return n;
}
var xl = null, Sl = (e) => Math.abs(e.x) < .11 && e.y > .17 && e.y < .46 && e.z > .44, Cl = (e, t) => Math.abs(e.x) < .17 && e.y > .1 && e.y < .2 && e.z > .34 && e.z < .5 && t.y > .35;
async function wl(e) {
	if (xl) return xl;
	let t = await pl(e, "Knight"), n = await pl(e, "Barbarian"), r = bl(ml(t.parts["0,0"], (e) => e.z > .05 && e.y < .6), ml(n.parts["0,0"], (e) => !(Math.abs(e.x) < .36 && e.z > .2 && e.y < .5)));
	return xl = {
		skin: ml(r, (e, t) => !Cl(e, t)),
		wedge: ml(r, Cl),
		whole: r,
		nose: ml(r, Sl),
		noNose: ml(r, (e, t) => !Cl(e, t) && !Sl(e))
	}, xl;
}
var Tl = new F(0, .42, -.02), El = (e) => (t) => {
	let n = typeof e == "function" ? e(t) : e;
	t.sub(Tl).multiplyScalar(1 + n).add(Tl);
}, Dl = (e) => e.z > .3 && e.y > .4 && e.y < .62 && Math.abs(e.x) < .38, Ol = (e) => Math.abs(e.x) > .46 && e.y > .12 && e.y < .52 && e.z > -.2 && e.z < .2, kl = (e, t, n) => {
	let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}, Al = (e, t, n) => e + (t - e) * n, jl = (e, t, n) => Math.exp(-((e - t) / n) * ((e - t) / n)), Ml = {
	normal: null,
	thin: (e) => {
		e.x *= .86, e.z = -.02 + (e.z + .02) * .97;
	},
	thick: (e) => {
		e.x *= 1.15, e.z = -.02 + (e.z + .02) * 1.05;
	},
	round: (e) => {
		e.x *= 1.08 * (1 + .07 * jl(e.y, .25, .22)), e.y = .5 + (e.y - .5) * .92;
	},
	oblong: (e) => {
		e.y *= 1.13, e.x *= .92;
	},
	pear: (e) => {
		e.x *= Al(1.17, .85, kl(.02, .95, e.y));
	}
}, Nl = (e, t, n) => ml(e, t, El(n));
function Pl(e) {
	let t = new N(e, new tt({ side: 2 })), n = new i();
	return (e, r, i = new F(0, 0, -1)) => {
		n.set(new F(e, r, 0).addScaledVector(i, -3), i);
		let a = n.intersectObject(t)[0];
		if (!a) return {
			p: new F(e, r, .45),
			n: new F(0, 0, 1)
		};
		let o = a.face.normal.clone();
		return o.dot(i) > 0 && o.negate(), {
			p: a.point.clone(),
			n: o
		};
	};
}
var Fl = (e, t) => (e.quaternion.setFromUnitVectors(new F(0, 0, 1), t), e);
function Il(e, t, n, r, i = .012, a = 5) {
	let o = t.map(([t, n]) => {
		let r = e(t, n);
		return r.p.addScaledVector(r.n, i);
	}), s = new We(o), c = new Je(s, Math.max(4, t.length * 2), n, a, !1), l = new N(c, r);
	return l.scale.set(1, 1, 1), l;
}
var Ll = (e, t, n, r = 7) => Array.from({ length: r }, (i, a) => {
	let o = -1 + 2 * a / (r - 1);
	return [o * e, t + n(o)];
}), Rl = {
	x: .17,
	y: .365
}, zl = {
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
function Bl(e, t, n, r) {
	let i = new j(), a = zl[t.eyes] || zl.round, o = .068;
	for (let t of [-1, 1]) {
		let { p: s, n: c } = e(t * Rl.x, Rl.y), l = Fl(new j(), c);
		if (l.position.copy(s), l.rotation.z += t * a.tilt, r) {
			let e = new N(new M(o, 10, 6), n.lash);
			e.scale.set(1.15 * a.w, 1.1 * Math.min(1, a.h + .1), .4), l.add(e), e.userData.part = t < 0 ? "eyeA" : "eyeB", i.add(l);
			continue;
		}
		{
			let e = new N(new M(o, 14, 8), n.white);
			e.scale.set(a.w, .66 * a.h, .32), l.add(e);
			let r = new N(new Ie(o * .56, 14), n.iris);
			r.position.z = o * .33, r.position.y = -.00272, l.add(r);
			let i = new N(new Ie(o * .26, 10), n.pupil);
			i.position.set(0, -.00272, o * .335), l.add(i);
			let s = new N(new Ie(o * .12, 6), n.glint);
			if (s.position.set(o * .16 * -t, o * .14, o * .34), l.add(s), a.fold) {
				let e = new N(new L(o * a.w * 1.02, o * .07, 3, 12, Math.PI * .8), n.crease);
				e.rotation.z = Math.PI * .1, e.scale.set(1, .66 * a.h + .28, 1), e.position.set(0, o * .1, o * .12), l.add(e);
			}
		}
		let u = new N(new L(o * a.w, o * .17 * (a.lash ?? 1), 4, 12, Math.PI * .9), n.lash);
		if (u.rotation.z = Math.PI * .05, u.scale.set(1, .66 * a.h, 1), u.position.z = o * .24, l.add(u), a.lower && !r) {
			let e = new N(new L(o * a.w * .86, o * .06, 3, 10, Math.PI * .6), n.crease);
			e.rotation.z = Math.PI * 1.2, e.scale.set(1, .42 * a.h, 1), e.position.set(0, -.00544, o * .2), l.add(e);
		}
		l.traverse((e) => {
			e.isMesh && (e.userData.part = t < 0 ? "eyeA" : "eyeB");
		}), i.add(l);
	}
	return i;
}
var Vl = {
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
function Hl(e, t, n) {
	let r = new j(), i = Vl[t.brows] || Vl.straight;
	for (let a of [-1, 1]) {
		let o = Array.from({ length: 5 }, (e, t) => {
			let n = t / 4;
			return [a * (.07 + .2 * n), .475 + i.y(n)];
		});
		r.add(Il(e, o, i.r * (t.browWeight ?? 1), n.brow, .018));
	}
	return r;
}
var Ul = {
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
}, Wl = .168;
function Gl(e, t, n, r) {
	let i = new j(), a = Ul[t.mouth] || Ul.line, o = a.w * (t.mouthWidth ?? 1);
	if (i.add(Il(e, Ll(o, Wl, a.f, 7), r ? .011 : a.thin ? .012 : .017, n.mouth, .016)), a.open) {
		let { p: t, n: r } = e(0, .156), s = Fl(new N(new M(o * .55, 10, 6), n.pupil), r);
		s.position.copy(t), s.scale.set(1, .42 * a.open, .25), i.add(s);
	}
	return i;
}
function Kl(e) {
	let t = new x(.3, .36, 8, 10), n = t.attributes.position;
	for (let t = 0; t < n.count; t++) {
		let r = n.getX(t), i = n.getY(t) + .31, a = (e(-.16, i).p.z + e(.16, i).p.z) / 2;
		n.setXYZ(t, r, i, a + .018 * (1 - (r / .15) ** 2) * (1 - ((i - .31) / .18) ** 2));
	}
	return t.computeVertexNormals(), t.toNonIndexed();
}
var ql = {
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
function Jl(e, t, n) {
	let r = new j(), i = ql[t.nose];
	if (!i) return r;
	let a = e(0, .43).p, o = e(0, i.tipY).p, s = new F(0, i.tipY + (i.up || 0) - (i.droop || 0), o.z + i.out), c = (e, t, r, i) => {
		let a = new N(new A(r, i, e.distanceTo(t), 6), n.skin);
		return a.position.copy(e).add(t).multiplyScalar(.5), a.quaternion.setFromUnitVectors(new F(0, 1, 0), e.clone().sub(t).normalize()), a;
	}, l = a.clone().lerp(s, .5);
	if (i.hump && (l.z += i.hump), r.add(c(a.clone().setZ(a.z - .01), l, i.bridge * .7, i.bridge), c(l, s, i.bridge, i.tip * .9)), i.hump) {
		let e = new N(new v(i.bridge * 1.05, 1), n.skin);
		e.position.copy(l), r.add(e);
	}
	let u = new N(new v(i.tip, 1), n.skin);
	u.position.copy(s), u.scale.set(1.05, .9, .9), r.add(u);
	for (let e of [-1, 1]) {
		let t = new N(new v(i.wing, 1), n.skin);
		t.position.set(e * i.tip * 1.05, s.y - i.tip * .35, s.z - i.out * .45), t.scale.set(1, .8, .9), r.add(t);
		let a = new N(new Ie(i.wing * .42, 6), n.crease);
		a.rotation.x = Math.PI / 2, a.position.set(e * i.tip * .6, s.y - i.tip * .85, s.z - i.out * .25), r.add(a);
	}
	return r;
}
function Yl(e, t, n) {
	return (r) => {
		if (Ol(r)) return !1;
		let i = kl(-.25, .3, r.z), a = Al(n, Al(t, e, kl(.15, .38, r.z)), i);
		return r.y > a;
	};
}
var Xl = {
	bald: null,
	crop: {
		line: Yl(.72, .44, .1),
		grow: .035
	},
	short: {
		line: Yl(.66, .4, .05),
		grow: (e) => .04 + .03 * kl(.6, .95, e.y)
	},
	receding: {
		line: (e) => Yl(.86, .44, .1)(e) && !(e.z > .2 && e.y < .9 && Math.abs(e.x) < .3 + (e.y - .72) * 1.2),
		grow: .03
	},
	crest: {
		line: (e) => Math.abs(e.x) < .14 && e.y > .5 && !Ol(e),
		grow: (e) => .03 + .14 * kl(.55, .95, e.y)
	},
	bun: {
		line: Yl(.7, .42, .12),
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
		line: Yl(.72, .44, .1),
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
		line: Yl(.7, .42, .08),
		grow: .04,
		braid: !0
	},
	long: { kk: "Rogue" },
	ponytail: {
		kk: "Mage",
		tie: !0
	},
	swept: { kk: "Knight" }
}, Zl = { short: {
	line: ((e) => (t) => {
		let n = Math.abs(Math.atan2(t.x, t.z + .03)), r = 0;
		for (; r < e.length - 2 && n > e[r + 1][0];) r++;
		let [i, a] = e[r], [o, s] = e[r + 1];
		return t.y > Al(a, s, kl(i, o, n));
	})([
		[0, .72],
		[.55, .75],
		[.95, .7],
		[1.15, .42],
		[1.42, .4],
		[1.62, .44],
		[1.95, .16],
		[Math.PI, .04]
	]),
	grow: (e) => .035 + .07 * kl(.5, .85, e.y) + .06 * kl(.75, .97, e.y),
	lock: !0
} };
function Ql(e, t, n) {
	let r = [], i = [], a = e.length;
	for (let n = 0; n < a; n++) {
		let [i, o, s] = e[n], [c, l] = e[Math.min(a - 1, n + 1)], [u, d] = e[Math.max(0, n - 1)], f = c - u, p = l - d, m = Math.hypot(f, p) || 1;
		f /= m, p /= m;
		let h = t * (1 - n / (a - 1)) * .5 + .002;
		r.push(i - p * h, o + f * h, s, i + p * h, o - f * h, s, i, o, s + .012 * (1 - n / (a - 1)));
	}
	for (let e = 0; e < a - 1; e++) {
		let t = e * 3, n = t + 3;
		i.push(t, t + 2, n, t + 2, n + 2, n, t + 2, t + 1, n + 2, t + 1, n + 1, n + 2);
	}
	let o = new Pe();
	return o.setAttribute("position", new k(r, 3)), o.setIndex(i), o.computeVertexNormals(), new N(o, n);
}
async function $l(e, t, n, r, i = null, a = !1) {
	let o = a ? hu(n) : 1, s = (e) => {
		let t = new F(...e);
		return t.y = pu(t.y, o), i && i(t), t;
	}, c = new j(), l = a && Zl[n.hair ?? "crop"] || Xl[n.hair ?? "crop"];
	if (!l) return c;
	let u = new F(), d = o === 1 ? l : {
		...l,
		line: (e, t) => l.line(u.set(e.x, mu(e.y, o), e.z), t)
	};
	if (d.kk) {
		let n = await pl(e, d.kk);
		if (a) {
			let i = _l((await wl(e)).whole, "kk"), a = _l(t, null);
			return c.add(new N(yl(ml(n.parts["1,0"], (e) => !Dl(e)), i, a, .014), r.hair)), d.tie && n.parts["1,1"] && c.add(new N(yl(n.parts["1,1"], i, a, .02), r.tie)), c;
		}
		return c.add(new N(ml(n.parts["1,0"], (e) => !Dl(e), (e) => {
			i && i(e), El(.05)(e);
		}), r.hair)), d.tie && n.parts["1,1"] && c.add(new N(i ? ml(n.parts["1,1"], () => !0, i) : n.parts["1,1"], r.tie)), c;
	}
	if (c.add(new N(a ? hl(t, d.line, El(d.grow)) : ml(t, d.line, El(d.grow)), r.hair)), d.knot) {
		let e = new N(new v(d.knot.r, 1), r.hair);
		e.position.copy(s(d.knot.at)), c.add(e);
		let t = new N(new L(d.knot.r * .62, .025, 4, 10), r.tie);
		t.position.copy(s(d.knot.at)), t.position.z += d.knot.at[2] < -.2 ? d.knot.r * .55 : 0, t.position.y -= d.knot.at[2] < -.2 ? 0 : d.knot.r * .6, d.knot.at[2] >= -.2 && (t.rotation.x = Math.PI / 2), c.add(e, t);
	}
	if (d.lock) {
		let e = t.attributes.position, n = (t, n) => {
			let r = 1e9, i = .4;
			for (let a = 0; a < e.count; a++) {
				if (e.getZ(a) < 0) continue;
				let o = (e.getX(a) - t) ** 2 + (e.getY(a) - n) ** 2;
				o < r && (r = o, i = e.getZ(a));
			}
			return i;
		}, i = r.hair.clone();
		i.side = 2;
		for (let [e, t, r, a, s] of [[
			.09,
			.78,
			.13,
			.55,
			.075
		], [
			.17,
			.77,
			.2,
			.6,
			.055
		]]) {
			let l = [];
			for (let i = 0; i <= 8; i++) {
				let s = i / 8, c = Al(e, r, s) - .03 * Math.sin(Math.PI * s), u = pu(Al(t, a, s), o);
				l.push([
					c,
					u,
					n(c, u) + .008 + .03 * (1 - s) * (1 - s)
				]);
			}
			c.add(Ql(l, s, i));
		}
	}
	if (d.braid) {
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
			let n = new N(new v(.1 - t * .008, 0), r.hair);
			n.position.copy(s(e)), n.rotation.set(t, t * .7, 0), c.add(n);
		});
		let e = new N(new L(.05, .022, 4, 8), r.tie);
		e.position.copy(s([
			.35,
			-.62,
			.2
		])), e.rotation.x = Math.PI / 2, c.add(e);
	}
	return c;
}
var eu = (e) => e.y < .3 && e.z > -.22 && !Ol(e) && !(Math.abs(e.x) < .14 && e.y > .1 && e.y < .26 && e.z > .3);
async function tu(e, t, n, r, i, a = null, o = !1) {
	let s = new j(), c = r.beard;
	if (!c) return s;
	if (c === "stubble" && s.add(new N(ml(t, eu, El(.008)), i.stubble)), (c === "short" || c === "goatee") && s.add(new N(ml(t, c === "goatee" ? (e) => eu(e) && Math.abs(e.x) < .16 && e.y < .14 && e.z > .2 : eu, El((e) => .04 + .05 * kl(.2, -.05, e.y))), i.beard)), c === "full") {
		let n = await pl(e, "Barbarian"), r = ml(n.parts["1,0"], (e) => !Dl(e));
		s.add(new N(o ? yl(r, _l((await wl(e)).whole, "kk"), _l(t, null), .008) : ml(n.parts["1,0"], (e) => !Dl(e), (e) => {
			a && a(e), El(.01)(e);
		}), i.beard));
	}
	return (c === "short" || c === "goatee" || c === "mustache") && s.add(Il(n, Ll(.13, .225, (e) => -.035 * e * e + (c === "mustache" ? -.02 * e * e * e * e : 0), 7), .028, i.beard, .02)), s;
}
function nu(e, t, n) {
	let r = new j();
	for (let i of t.marks || []) {
		if (i === "scar" && r.add(Il(e, [[.1, .58], [.13, .5]], .012, n.scar, .02, 4), Il(e, [[.2, .3], [.24, .2]], .012, n.scar, .016, 4)), i === "scar_cheek" && r.add(Il(e, [
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
			let { p: o, n: s } = e(a * t, i), c = Fl(new N(new Ie(.011, 5), n.freckle), s);
			c.position.copy(o).addScaledVector(s, .006), r.add(c);
		}
		if (i === "blush") for (let t of [-1, 1]) {
			let { p: i, n: a } = e(t * .25, .235), o = Fl(new N(new Ie(.06, 10), n.blush), a);
			o.position.copy(i).addScaledVector(a, .004), o.scale.y = .6, r.add(o);
		}
		if (i === "wrinkles") {
			for (let t of [-1, 1]) r.add(Il(e, [[t * .262, Rl.y - .015], [t * .292, Rl.y - .035]], .005, n.crease, .01, 3));
			r.add(Il(e, Ll(.14, .62, (e) => .01 * (1 - e * e)), .005, n.crease, .01, 3));
			for (let t of [-1, 1]) r.add(Il(e, [
				[t * .1, .26],
				[t * .14, .2],
				[t * .145, .16]
			], .006, n.crease, .01, 3));
		}
		if (i === "eyepatch") {
			let { p: i, n: a } = e(.17, Rl.y), o = Fl(new N(new Ie(.1, 10), n.patch), a);
			o.position.copy(i).addScaledVector(a, .05), o.scale.y = .85, r.add(o), t.skull !== "own" && r.add(Il(e, [
				[-.4, .62],
				[-.1, .55],
				[.17, Rl.y + .05],
				[.44, .35]
			], .013, n.patch, .03, 4));
		}
		if (i === "earring") {
			let e = new N(new L(.035, .012, 5, 10), n.gold);
			e.position.set(.52, .18, .02), e.rotation.y = Math.PI / 2, r.add(e);
		}
	}
	return r;
}
function ru(e, t, n, r = null) {
	let i = new j();
	if (e.ears !== "pointed") return i;
	let a = (e.earSize || 1.2) * (r ? .75 : 1), o = .62 * a, s = .15 * a;
	for (let e of [-1, 1]) {
		let c = r ? r(e) : new F(e * .5, .33, -.04);
		n && !r && n(c);
		let l = new F(e, .5, -.6).normalize(), u = new F(0, .35, 1), d = u.addScaledVector(l, -u.dot(l)).normalize(), f = new F().crossVectors(l, d), p = new m().setFromRotationMatrix(new nt().makeBasis(f, l, d)), h = (e, t, n, r) => {
			let i = new N(new R(e, t, 8), n);
			return i.quaternion.copy(p), i.scale.set(1, 1, .32), i.position.copy(c).addScaledVector(l, t / 2 - .06 * a).addScaledVector(d, r), i;
		};
		i.add(h(s, o, t.skin, 0), h(s * .55, o * .72, t.earIn, s * .2));
	}
	return i;
}
var iu = "painted", au = (e) => {
	iu = e === "painted" ? "painted" : "mesh";
}, ou = -.01, su = 1.05, cu = 1.06, lu = {
	cy: 1.04 / 2,
	cz: -.03,
	ax: .49,
	ay: cu / 2,
	az: .55
}, uu = {
	kk: [
		.08,
		.064,
		0,
		.27,
		"ball"
	],
	button: [
		.058,
		.05,
		0,
		.27,
		"ball"
	],
	long: [
		.062,
		.088,
		0,
		.29,
		"ball"
	],
	hook: [
		.066,
		.082,
		0,
		.29,
		"ball",
		.32
	],
	broad: [
		.104,
		.058,
		0,
		.265,
		"ball"
	],
	snub: [
		.06,
		.05,
		0,
		.278,
		"ball",
		-.4
	]
}, du = {
	w: .47,
	d: .55,
	sq: 2.3,
	top: 2.1,
	low: 2.5,
	jaw: .72,
	jawTo: .5,
	front: .93,
	back: 1.08,
	slope: 0,
	tall: 0,
	chinL: 0,
	brow: .014,
	socket: .008,
	bridge: .006,
	cheek: .01,
	hollow: 0,
	lips: .006,
	chin: .01,
	cleft: 0,
	gonion: 0,
	temple: 0,
	jowl: 0,
	occ: 0,
	flat: 0,
	flatK: .06,
	muzzle: 0,
	cheekF: 0,
	nape: .12,
	lowF: 0,
	cap: 1,
	cheekFat: 0,
	jawWide: 0
}, fu = .47, pu = (e, t) => e > fu ? fu + (e - fu) * t : e, mu = (e, t) => e > fu ? fu + (e - fu) / t : e, hu = (e) => (_u[e.head] || _u.shield).cap, gu = {
	shield: {
		jawWide: .15,
		w: .43,
		d: .52,
		sq: 2.1,
		top: 2.1,
		low: 2.6,
		lowF: 4.2,
		cap: .85,
		jaw: .76,
		jawTo: .48,
		front: 1,
		back: .86,
		nape: .36,
		brow: .016,
		socket: .012,
		bridge: .03,
		cheek: .012,
		cheekF: .02,
		muzzle: .035,
		temple: .012,
		lips: .008,
		chin: .018
	},
	shieldF: {
		jawWide: .15,
		w: .42,
		d: .51,
		sq: 2.05,
		top: 2.1,
		low: 2.4,
		lowF: 3.4,
		cap: .85,
		jaw: .66,
		jawTo: .5,
		front: 1,
		back: .86,
		nape: .36,
		brow: .006,
		socket: .012,
		bridge: .02,
		cheek: .016,
		cheekF: .024,
		muzzle: .026,
		temple: .01,
		lips: .01,
		chin: .012
	},
	oval: {},
	heart: {
		w: .48,
		jaw: .52,
		low: 1.9,
		cheek: .02,
		temple: -.006,
		chin: .012
	},
	square: {
		w: .48,
		sq: 3.1,
		low: 4,
		jaw: .95,
		gonion: .022,
		brow: .02,
		chin: .006
	},
	round: {
		w: .5,
		sq: 2.05,
		top: 2,
		low: 2.1,
		jaw: .86,
		front: .97,
		cheek: .016,
		brow: .006,
		socket: .004,
		chin: .004
	},
	long: {
		w: .44,
		chinL: .09,
		tall: .03,
		jaw: .74,
		low: 2.4,
		cheek: .008,
		chin: .012
	},
	diamond: {
		w: .47,
		jaw: .56,
		low: 2,
		cheek: .028,
		temple: .022,
		hollow: .008,
		chin: .01
	},
	pear: {
		w: .45,
		jaw: 1,
		jawTo: .35,
		low: 3.2,
		temple: .02,
		gonion: .026,
		jowl: .01,
		cheek: .004
	},
	rugged: {
		w: .48,
		sq: 2.7,
		low: 3.4,
		jaw: .9,
		brow: .042,
		socket: .014,
		cheek: .016,
		hollow: .014,
		chin: .026,
		cleft: .008,
		gonion: .016
	},
	gaunt: {
		w: .45,
		sq: 2.4,
		jaw: .7,
		cheek: .024,
		hollow: .03,
		temple: .02,
		socket: .016,
		brow: .024,
		chin: .012
	},
	broad: {
		w: .54,
		sq: 2.6,
		chinL: -.05,
		jaw: .9,
		low: 3,
		cheek: .012,
		gonion: .012,
		brow: .02
	},
	elfin: {
		w: .45,
		jaw: .42,
		low: 1.7,
		cheek: .022,
		hollow: .01,
		chin: .008,
		tall: .02,
		brow: .006,
		socket: .006
	},
	brute: {
		w: .52,
		d: .56,
		sq: 2.8,
		low: 4,
		jaw: 1.04,
		jawTo: .4,
		slope: .12,
		brow: .055,
		socket: .016,
		chin: .03,
		gonion: .03,
		cheek: .012
	},
	noble: {
		w: .45,
		tall: .04,
		chinL: .05,
		jaw: .76,
		low: 2.6,
		chin: .024,
		cheek: .016,
		hollow: .008,
		brow: .018,
		bridge: .014
	},
	cherub: {
		w: .51,
		sq: 2,
		top: 1.9,
		low: 1.9,
		jaw: .64,
		front: .96,
		back: 1.18,
		chinL: -.05,
		cheek: .02,
		brow: .002,
		socket: .003,
		chin: .004,
		lips: .01
	},
	wedge: {
		w: .47,
		sq: 3.4,
		low: 1.75,
		jaw: .55,
		cheek: .02,
		hollow: .014,
		chin: .016,
		brow: .024
	},
	jowly: {
		w: .5,
		sq: 2.4,
		low: 2.8,
		jaw: .98,
		jowl: .03,
		cheek: .008,
		brow: .018,
		socket: .012,
		chin: .004,
		lips: .004
	},
	hawk: {
		w: .44,
		chinL: .06,
		chin: -.02,
		slope: .14,
		brow: .036,
		socket: .014,
		bridge: .026,
		cheek: .012,
		hollow: .012,
		jaw: .68
	},
	moon: {
		w: .54,
		sq: 2.2,
		front: .82,
		jaw: .88,
		low: 2.3,
		chinL: -.05,
		cheek: .012,
		brow: .006,
		socket: .004,
		bridge: .002
	},
	chiselled: {
		w: .47,
		sq: 2.8,
		low: 3.2,
		jaw: .84,
		brow: .026,
		socket: .012,
		cheek: .022,
		hollow: .02,
		chin: .02,
		cleft: .005,
		gonion: .018
	},
	dome: {
		w: .46,
		top: 1.8,
		tall: .07,
		jaw: .68,
		low: 2.2,
		back: 1.16,
		occ: .02,
		brow: .01,
		chin: .008
	},
	pack: {
		w: .49,
		sq: 2.9,
		top: 2.3,
		low: 3.4,
		jaw: .8,
		front: .95,
		back: 1.1,
		brow: 0,
		socket: 0,
		bridge: 0,
		cheek: 0,
		lips: 0,
		chin: 0
	}
};
Object.keys(gu).filter((e) => e !== "pack" && e !== "shieldF");
var _u = Object.fromEntries(Object.entries(gu).map(([e, t]) => [e, {
	...du,
	...t
}])), vu = (e, t) => Math.sign(e) * Math.abs(e) ** +t, yu = (e, t) => Math.exp(-(e / t) * (e / t)), bu = 1.6;
function xu(e, t, n, r = new F()) {
	let i = _u[n.head] || _u.shield, a = n.cheekFat == null && n.jawWide == null ? i : {
		...i,
		...n.cheekFat != null && { cheekFat: n.cheekFat },
		...n.jawWide != null && { jawWide: n.jawWide }
	}, o = 2 * t - 1, s = o > 0 ? a.top : a.lowF ? Al(a.low, a.lowF, Math.max(0, Math.cos(e)) ** 2) : a.low, c = Math.max(0, 1 - Math.abs(o) ** +s) ** (1 / s), l = vu(Math.sin(e), 2 / a.sq) * c, u = vu(Math.cos(e), 2 / a.sq) * c;
	if (l *= Al(a.jaw, 1, kl(0, a.jawTo, t)), a.cheekFat) {
		let n = a.cheekFat * Math.exp(-(((t - .25) / .11) ** 2)) * kl(-.4, .4, Math.cos(e));
		l *= 1 + n, u > 0 && (u *= 1 + .35 * n);
	}
	a.jawWide && (l *= 1 + a.jawWide * Math.exp(-(((t - .13) / .09) ** 2)) * kl(-.5, .2, Math.cos(e))), u *= u > 0 ? a.front * Al(.92, 1, kl(0, .45, t)) * (1 - a.slope * kl(.55, 1, t)) : a.back * Al(1 - a.nape, 1, kl(0, .45, t)), a.flat && u > 0 && (u = (u + a.flat - Math.sqrt((u - a.flat) * (u - a.flat) + a.flatK * a.flatK)) / 2);
	let d = Math.max(0, 1 - t / .24);
	r.set(l * a.w, pu(lu.cy + o * lu.ay - a.chinL * d * d + a.tall * kl(.5, 1, t), a.cap), lu.cz + u * a.d);
	let f = Math.abs(e), p = Math.sin(e), m = Math.cos(e), h = Math.max(0, m), g = (Lu.y - ou) / cu, _ = g + .1 / cu, v = a.brow * yu(t - _, .04) * yu(e, .62) * h - a.socket * yu(t - g, .045) * yu(f - .38, .16) + a.bridge * yu(e, .07 + .05 * kl(.45, .28, t)) * kl(.24, .3, t) * kl(_ + .02, g - .02, t) * Al(1, .45, kl(.3, g, t)) + a.lips * yu(t - .18, .035) * yu(e, .3) + a.chin * yu(t - .06, .06) * yu(e, .32) * h + a.muzzle * yu(t - .19, .1) * yu(e, .5) * h + a.cheekF * yu(t - .32, .08) * yu(f - .5, .25) - a.cleft * yu(t - .06, .045) * yu(e, .05), y = a.cheek * yu(t - .37, .07) * yu(f - .8, .3) - a.hollow * yu(t - .22, .065) * yu(f - .95, .32) + a.gonion * yu(t - .11, .07) * yu(f - 1.35, .35) - a.temple * yu(t - .64, .08) * yu(f - 1.3, .32) + a.jowl * yu(t - .1, .07) * yu(f - .95, .35) + a.occ * yu(t - .6, .16) * yu(f - Math.PI, .9);
	r.x += bu * y * p, r.z += bu * (v + y * m), r.y -= a.jowl * .6 * yu(t - .1, .07) * yu(f - .95, .35);
	let [b, x, S, C, w] = uu[n.nose] || uu.kk, T = r.x / b, E = (t - C) * cu / x, D = T * T + E * E;
	return m > 0 && (r.z += S * Math.exp(w ? -D * D : -D) * (n.nose === "snub" && E > 0 ? .8 : 1)), n.nose === "hook" && m > 0 && (r.y -= .02 * Math.exp(-T * T - E * E)), r;
}
var Su = {
	full: {
		NT: 56,
		NS: 40,
		NU: 36,
		NV: 30,
		ear: 12,
		rim: !0,
		nose: 14
	},
	play: {
		NT: 36,
		NS: 26,
		NU: 22,
		NV: 18,
		ear: 8,
		rim: !1,
		nose: 10
	}
};
function Cu(e) {
	let t = e.attributes.position, n = e.attributes.normal, r = /* @__PURE__ */ new Map(), i = [], a = [], o = [];
	for (let e = 0; e < t.count; e++) {
		let s = `${Math.round(t.getX(e) * 4e3)},${Math.round(t.getY(e) * 4e3)},${Math.round(t.getZ(e) * 4e3)},${n ? Math.round(n.getX(e) * 50) + "," + Math.round(n.getY(e) * 50) + "," + Math.round(n.getZ(e) * 50) : ""}`, c = r.get(s);
		c === void 0 && (c = i.length / 3, r.set(s, c), i.push(t.getX(e), t.getY(e), t.getZ(e)), n && a.push(n.getX(e), n.getY(e), n.getZ(e))), o.push(c);
	}
	let s = new Pe();
	return s.setAttribute("position", new k(i, 3)), n ? s.setAttribute("normal", new k(a, 3)) : s.computeVertexNormals(), s.setIndex(o), s;
}
function wu(e, t, n = Su.full, r = !1) {
	let i = n.NT, a = n.NS, o = [], s = [], c = new F();
	for (let n = 0; n <= a; n++) for (let r = 0; r <= i; r++) {
		let s = -1 + 2 * r / i;
		xu(Math.PI * (.4 * s + .6 * s * s * s), n / a, e, c), t && t(c), o.push(c.x, c.y, c.z);
	}
	for (let e = 0; e < a; e++) for (let t = 0; t < i; t++) {
		let n = e * (i + 1) + t, r = n + 1, a = n + i + 1, o = a + 1;
		s.push(n, r, a, r, o, a);
	}
	let l = new Pe();
	return l.setAttribute("position", new k(o, 3)), l.setIndex(s), l.computeVertexNormals(), r ? l : l.toNonIndexed();
}
var Tu = 1.15, Eu = .06, Du = .006;
function Ou(e, t, n = Su.full) {
	let r = n.NU, i = n.NV, a = [], o = [], s = [], c = new F(), l = new F(), u = new F(), d = new F(), f = .004;
	for (let n = 0; n <= i; n++) for (let s = 0; s <= r; s++) {
		let p = -1.15 + 2 * Tu * s / r, m = Eu + .78 * n / i, h = (n, r, i) => (xu(n, r, e, i), t && t(i), i);
		h(p, m, c), d.crossVectors(h(p, m + f, l).sub(h(p, m - f, u)), h(p + f, m, u).sub(h(p - f, m, d.clone()))).normalize(), d.z < 0 && Math.abs(p) < 1.4 && d.negate(), o.push(Au(c.x), ju(c.y)), c.addScaledVector(d, Du), a.push(c.x, c.y, c.z);
	}
	for (let e = 0; e < i; e++) for (let t = 0; t < r; t++) {
		let n = e * (r + 1) + t, i = n + 1, a = n + r + 1, o = a + 1;
		s.push(n, i, a, i, o, a);
	}
	let p = new Pe();
	return p.setAttribute("position", new k(a, 3)), p.setAttribute("uv", new k(o, 2)), p.setIndex(s), p.computeVertexNormals(), p;
}
var ku = 512, Au = (e) => (Math.asin(Math.max(-.98, Math.min(.98, e / .52))) + Tu) / (2 * Tu), ju = (e) => ((e - ou) / cu - Eu) / .78, Mu = (e) => Au(e) * ku, Nu = (e) => (1 - ju(e)) * ku, Pu = ku / (2 * Tu * .5), Fu = ku / (.78 * cu), Iu = (e) => "#" + e.getHexString(), Lu = {
	x: .165,
	y: .37,
	rx: .04,
	ry: .05
}, Ru = {
	round: {
		w: 1,
		h: 1,
		tilt: 0
	},
	wide: {
		w: 1.1,
		h: 1.12,
		tilt: 0,
		white: !0
	},
	narrow: {
		w: 1.08,
		h: .72,
		tilt: .04,
		lash: !0
	},
	tired: {
		w: 1,
		h: .95,
		tilt: -.08,
		lid: .32,
		bags: !0
	},
	sharp: {
		w: 1.12,
		h: .8,
		tilt: .22,
		lash: !0
	}
}, zu = {
	straight: {
		w: .12,
		t: .046,
		arch: .006,
		tilt: 0
	},
	arched: {
		w: .12,
		t: .042,
		arch: .034,
		tilt: 0
	},
	heavy: {
		w: .13,
		t: .066,
		arch: .008,
		tilt: .05
	},
	angry: {
		w: .12,
		t: .052,
		arch: .004,
		tilt: .2
	},
	worried: {
		w: .115,
		t: .044,
		arch: .012,
		tilt: -.2
	},
	thin: {
		w: .11,
		t: .026,
		arch: .016,
		tilt: 0
	}
}, Bu = {
	neutral: {
		brow: 0,
		lift: 0,
		lid: 0,
		mouth: null
	},
	smile: {
		brow: -.02,
		lift: .004,
		lid: 0,
		mouth: "smile",
		cheek: !0
	},
	happy: {
		brow: -.06,
		lift: .012,
		lid: 0,
		mouth: "grin",
		cheek: !0,
		glad: !0
	},
	stern: {
		brow: .2,
		lift: -.008,
		lid: .24,
		mouth: "grim"
	},
	sad: {
		brow: -.22,
		lift: .004,
		lid: .12,
		mouth: "frown",
		tear: !0
	},
	smug: {
		brow: .05,
		lift: 0,
		lid: .34,
		mouth: "smirk",
		oneBrow: !0
	},
	surprised: {
		brow: -.1,
		lift: .028,
		lid: 0,
		mouth: "open",
		small: !0
	},
	fierce: {
		brow: .26,
		lift: -.01,
		lid: .18,
		mouth: "fangs",
		creases: !0
	}
}, Vu = /* @__PURE__ */ new Map();
function Hu(e) {
	let t = Bu[e.expression] || Bu.neutral, n = JSON.stringify([
		e.skin,
		e.hairColor,
		e.browColor,
		e.eyes,
		e.iris,
		e.brows,
		e.mouth,
		e.marks,
		e.expression,
		e.lashes,
		e.lips
	]);
	if (Vu.has(n)) return Vu.get(n);
	let r = document.createElement("canvas");
	r.width = r.height = ku;
	let i = r.getContext("2d"), a = ll(ol, e.skin, ol.fair), s = ll(sl, e.browColor || e.hairColor, sl.brown), c = ul(a) < .28, l = (e, t) => [Mu(e), Nu(t)], u = "#1a110d", d = Iu(a.clone().lerp(new P("#3a1210"), .78)), f = Iu(dl(a, "#a04a40", .32, .84));
	(t.cheek || (e.marks || []).includes("blush")) && ((e) => {
		for (let t of [-1, 1]) {
			let [n, r] = l(t * .25, .3), o = .06 * Pu, s = i.createRadialGradient(n, r, 0, n, r, o);
			s.addColorStop(0, Iu(dl(a, "#e05a58", .35, 1)) + Math.round(e * 255).toString(16).padStart(2, "0")), s.addColorStop(1, Iu(a) + "00"), i.fillStyle = s, i.fillRect(n - o, r - o, 2 * o, 2 * o);
		}
	})(t.cheek ? .45 : .6);
	let p = Ru[e.eyes] || Ru.round, m = ll(cl, e.iris, cl.brown), h = (e.marks || []).includes("eyepatch");
	for (let n of [-1, 1]) {
		if (h && n > 0) continue;
		let [r, o] = l(n * Lu.x, Lu.y + t.lift * .4), s = Lu.rx * p.w * Pu, c = Lu.ry * p.h * Fu * (t.small ? 1.08 : 1), d = n * p.tilt;
		i.save(), i.translate(r, o), i.rotate(-d), t.small && (i.fillStyle = "#ece4d6", i.beginPath(), i.ellipse(0, 0, s * 1.2, c * 1.1, 0, 0, Math.PI * 2), i.fill()), i.fillStyle = u, i.beginPath(), i.ellipse(0, 0, s * (t.small ? .75 : 1), c * (t.small ? .8 : 1), 0, 0, Math.PI * 2), i.fill(), i.fillStyle = Iu(m.clone().multiplyScalar(.8)), i.globalAlpha = .55, i.beginPath(), i.ellipse(0, c * .25, s * .62, c * .5, 0, 0, Math.PI * 2), i.fill(), i.globalAlpha = 1, i.fillStyle = "#ffffff", i.beginPath(), i.ellipse(s * .32, -c * .3, s * .36, c * .3, 0, 0, Math.PI * 2), i.fill();
		let f = Math.max(p.lid || 0, t.lid) * (t.oneBrow && n < 0 ? .25 : 1);
		if (f > 0) {
			let e = -c + 2 * c * f, r = n * (t.brow > 0 ? .25 : t.brow < 0 ? -.2 : 0) * c;
			i.fillStyle = Iu(a), i.beginPath(), i.moveTo(-s * 1.3, -c * 1.3), i.lineTo(s * 1.3, -c * 1.3), i.lineTo(s * 1.3, e - r), i.lineTo(-s * 1.3, e + r), i.closePath(), i.fill(), i.strokeStyle = u, i.lineWidth = c * .16, i.lineCap = "round", i.beginPath(), i.moveTo(-s * .98, e + r * .98), i.lineTo(s * .98, e - r * .98), i.stroke();
		}
		t.glad && (i.strokeStyle = Iu(a), i.lineWidth = c * .5, i.beginPath(), i.ellipse(0, c * 1.05, s * 1.2, c * .7, 0, Math.PI * 1.1, Math.PI * 1.9), i.stroke()), (p.lash || e.lashes) && (i.strokeStyle = u, i.lineWidth = c * .14, i.lineCap = "round", i.beginPath(), i.moveTo(n * s * .7, -c * .72), i.quadraticCurveTo(n * s * 1.2, -c * .9, n * s * 1.45, -c * 1.05), i.stroke()), p.bags && (i.strokeStyle = Iu(a.clone().multiplyScalar(.72)), i.lineWidth = c * .1, i.beginPath(), i.ellipse(0, c * .95, s * .8, c * .3, 0, Math.PI * .15, Math.PI * .85), i.stroke()), i.restore();
	}
	if (h) {
		let [e, t] = l(Lu.x, Lu.y);
		i.fillStyle = "#1c1616", i.beginPath(), i.ellipse(e, t, Lu.rx * 1.6 * Pu, Lu.ry * 2.1 * Fu, 0, 0, Math.PI * 2), i.fill(), i.strokeStyle = "#1c1616", i.lineWidth = .018 * Fu, i.beginPath(), i.moveTo(...l(-.5, .68)), i.lineTo(...l(.5, .36)), i.stroke();
	}
	let g = zu[e.brows] || zu.straight, _ = c && ul(s) > ul(a), v = Iu(s.clone().multiplyScalar(_ ? .9 : c ? .35 : .5)), y = c && !_ && ul(a) < .16 ? Iu(dl(a, "#f0c8a0", .25, 1.9)) : null;
	for (let e of [-1, 1]) {
		let n = g.tilt + t.brow * (t.oneBrow && e < 0 ? -.6 : 1), r = Lu.y + .1 + t.lift + (t.oneBrow && e < 0 ? .02 : 0), a = [e * .075, r - n * .05], o = [e * (.075 + g.w * 1.15), r + n * .03 - g.arch * .3], s = [e * (.075 + g.w * .6), r + g.arch + n * .005], [c, u] = l(...a), [d, f] = l(...s), [p, m] = l(...o), h = g.t * 1.25 * Fu;
		if (i.lineCap = "round", y) for (let [e, t] of [[1.7, .22], [1.25, .4]]) {
			i.strokeStyle = y, i.globalAlpha = t, i.lineWidth = h * e;
			let n = h * .55;
			i.beginPath(), i.moveTo(c, u + n), i.quadraticCurveTo(d, f - h * .25 + n, p, m + n), i.stroke();
		}
		i.globalAlpha = 1, i.strokeStyle = v, i.lineWidth = h, i.beginPath(), i.moveTo(c, u), i.quadraticCurveTo(d, f - h * .25, p, m), i.stroke();
	}
	if (t.creases) {
		i.strokeStyle = v, i.lineWidth = .008 * Fu;
		for (let e of [-.02, .02]) i.beginPath(), i.moveTo(...l(e - .01, Lu.y + .07)), i.lineTo(...l(e * 1.4, Lu.y + .13)), i.stroke();
	}
	let b = t.mouth || e.mouth || "line", x = .14, S = .115, C = {
		line: 0,
		smile: .022,
		grin: .03,
		frown: -.014,
		smirk: 0,
		grim: -.01,
		open: 0,
		fangs: -.012
	}[b] ?? 0;
	if (i.lineCap = "round", i.strokeStyle = d, i.lineWidth = (b === "grim" ? .02 : .014) * Fu, b === "open") {
		let [e, n] = l(0, x);
		i.fillStyle = d, i.beginPath(), i.ellipse(e, n, (t.small ? .026 : .04) * Pu, (t.small ? .032 : .03) * Fu, 0, 0, Math.PI * 2), i.fill();
	} else if (b === "grin") i.fillStyle = d, i.beginPath(), i.moveTo(...l(-.115, .15200000000000002)), i.quadraticCurveTo(...l(0, .07), ...l(S, .15200000000000002)), i.closePath(), i.fill(), i.fillStyle = "#f4efe6", i.beginPath(), i.moveTo(...l(-.115 * .8, .14600000000000002)), i.lineTo(...l(S * .8, .14600000000000002)), i.lineTo(...l(S * .6, .128)), i.lineTo(...l(-.069, .128)), i.closePath(), i.fill();
	else if (b === "smirk") i.beginPath(), i.moveTo(...l(-.115 * .8, .136)), i.quadraticCurveTo(...l(.01, .13), ...l(S, .162)), i.stroke();
	else if (i.beginPath(), i.moveTo(...l(-.115, x + C)), i.quadraticCurveTo(...l(0, x - C), ...l(S, x + C)), i.stroke(), b === "fangs") {
		i.fillStyle = "#f4efe6";
		for (let e of [-1, 1]) i.beginPath(), i.moveTo(...l(e * .03, .14400000000000002)), i.lineTo(...l(e * .045, .14200000000000002)), i.lineTo(...l(e * .038, .11000000000000001)), i.closePath(), i.fill();
	}
	e.lips && b !== "open" && b !== "grin" ? (i.fillStyle = Iu(dl(a, "#b04a52", .55, .9)), i.globalAlpha = .85, i.beginPath(), i.moveTo(...l(-.0713, x + C * .6)), i.quadraticCurveTo(...l(0, .09000000000000001), ...l(S * .62, x + C * .6)), i.closePath(), i.fill(), i.beginPath(), i.moveTo(...l(-.0713, x + C * .6)), i.quadraticCurveTo(...l(-.0345, .166), ...l(0, .15400000000000003)), i.quadraticCurveTo(...l(S * .3, .166), ...l(S * .62, x + C * .6)), i.closePath(), i.fill(), i.globalAlpha = 1, i.strokeStyle = d, i.lineWidth = .012 * Fu, i.beginPath(), i.moveTo(...l(-.0713, x + C * .6)), i.quadraticCurveTo(...l(0, x - C), ...l(S * .62, x + C * .6)), i.stroke()) : b !== "open" && b !== "grin" && !c && (i.strokeStyle = f, i.lineWidth = .008 * Fu, i.beginPath(), i.moveTo(...l(-.025, .11400000000000002)), i.quadraticCurveTo(...l(0, .10400000000000001), ...l(.025, .11400000000000002)), i.globalAlpha = .6, i.stroke(), i.globalAlpha = 1);
	for (let t of e.marks || []) {
		if (t === "scar") {
			i.strokeStyle = Iu(dl(a, "#d07a70", .45, 1.05)), i.lineWidth = .014 * Fu, i.beginPath(), i.moveTo(...l(.1, Lu.y + .2)), i.lineTo(...l(.27, Lu.y - .08)), i.stroke(), i.lineWidth = .006 * Fu;
			for (let e of [
				.3,
				.55,
				.8
			]) {
				let t = Al(.1, .27, e), n = Al(Lu.y + .2, Lu.y - .08, e);
				i.beginPath(), i.moveTo(...l(t - .025, n - .012)), i.lineTo(...l(t + .025, n + .012)), i.stroke();
			}
		}
		if (t === "scar_cheek" && (i.strokeStyle = Iu(dl(a, "#d07a70", .45, 1.05)), i.lineWidth = .012 * Fu, i.beginPath(), i.moveTo(...l(-.32, .36)), i.lineTo(...l(-.2, .24)), i.stroke()), t === "freckles") {
			i.fillStyle = Iu(dl(a, "#6a2a10", .5, .74));
			for (let e of [-1, 1]) for (let [t, n] of [
				[.2, .33],
				[.25, .31],
				[.29, .34],
				[.23, .36],
				[.27, .28],
				[.32, .31]
			]) i.beginPath(), i.arc(...l(e * t, n), .006 * Pu, 0, Math.PI * 2), i.fill();
		}
		if (t === "wrinkles") {
			i.strokeStyle = Iu(a.clone().multiplyScalar(.74)), i.lineWidth = .007 * Fu;
			for (let e of [.74, .79]) i.beginPath(), i.moveTo(...l(-.15, e)), i.quadraticCurveTo(...l(0, e + .012), ...l(.15, e)), i.stroke();
		}
		if (t === "soot") for (let [e, t, n, r, o] of [
			[
				-.24,
				.3,
				.13,
				.07,
				.55
			],
			[
				.2,
				.62,
				.16,
				.06,
				.4
			],
			[
				.3,
				.36,
				.06,
				.05,
				.35
			],
			[
				-.05,
				.08,
				.1,
				.05,
				.3
			]
		]) {
			let [s, c] = l(e, t), u = Math.max(n * Pu, r * Fu), d = i.createRadialGradient(s, c, 0, s, c, u), f = Iu(dl(a, "#1a1410", .8, .35));
			d.addColorStop(0, f + Math.round(o * 255).toString(16).padStart(2, "0")), d.addColorStop(1, f + "00"), i.save(), i.translate(s, c), i.scale(n * Pu / u, r * Fu / u), i.translate(-s, -c), i.fillStyle = d, i.fillRect(s - u, c - u, 2 * u, 2 * u), i.restore();
		}
		t === "warpaint" && (i.fillStyle = "rgba(232,226,214,0.9)", i.beginPath(), i.moveTo(...l(.12, .54)), i.lineTo(...l(.16, .54)), i.lineTo(...l(.3, .26)), i.lineTo(...l(.26, .26)), i.closePath(), i.fill(), i.beginPath(), i.moveTo(...l(.12, .38)), i.lineTo(...l(.32, .38)), i.lineTo(...l(.32, .36)), i.lineTo(...l(.12, .36)), i.closePath(), i.fill());
	}
	if (t.tear) {
		i.fillStyle = "rgba(180,215,240,0.85)";
		for (let e of [-1, 1]) i.beginPath(), i.ellipse(...l(e * (Lu.x - .02), Lu.y - Lu.ry - .03), .008 * Pu, .016 * Fu, 0, 0, Math.PI * 2), i.fill();
	}
	let w = new we(r);
	return w.colorSpace = o, w.anisotropy = 4, w.generateMipmaps = !1, w.minFilter = Fe, Vu.set(n, w), w;
}
async function Uu(e, t, n, r = Su.full) {
	let i = await pl(e, t), a = Ml[n.shape] || null, o = ll(ol, n.skin, ol.fair), s = ll(sl, n.hairColor, sl.brown), c = {
		skin: al(o, .72),
		hair: al(s, .85),
		beard: al(ll(sl, n.beardColor, s), .9),
		stubble: al(o.clone().multiplyScalar(.7).lerp(ll(sl, n.beardColor, s), .35), 1),
		gold: al("#d8a848", .3, .8),
		tie: al(ll(sl, n.tieColor, "#6a3a22"), .8),
		earIn: al(o.clone().multiplyScalar(.62).lerp(new P("#7a3a34"), .25), .9)
	}, u = new j();
	u.name = "Face";
	let d = (e, t) => (e.traverse((e) => {
		e.isMesh && !e.userData.part && (e.userData.part = t);
	}), e), f = wu(n, a, r);
	u.add(d(new N(r === Su.full ? f : wu(n, a, r, !0), c.skin), "skin"));
	let p = new N(Ou(n, a, r), new l({
		map: Hu(n),
		alphaTest: .35,
		roughness: .72,
		polygonOffset: !0,
		polygonOffsetFactor: -2,
		polygonOffsetUnits: -2
	}));
	if (p.name = "FaceMask", u.add(d(p, "eye")), (uu[n.nose] || uu.kk)[4] === "ball") {
		let [e, t, , i, , o = 0] = uu[n.nose] || uu.kk, s = xu(0, i, n);
		a && a(s);
		let l = new N(new M(1, r.nose, Math.round(r.nose * .7)), c.skin);
		l.scale.set(e * 1.1, t, e * .8), l.rotation.x = o, l.position.set(s.x, s.y - o * .012, s.z - e * .25), u.add(d(l, "skin"));
	}
	if (n.ears === "pointed") u.add(d(ru(n, c, a, (e) => {
		let t = xu(e * Math.PI / 2, .36, n);
		return a && a(t), t.add(new F(-e * .02, 0, -.03));
	}), "skin"));
	else for (let e of [-1, 1]) {
		let t = xu(e * Math.PI / 2, .355, n), i = new j();
		a && a(t), i.position.set(t.x + e * .012, t.y, t.z - .05), i.rotation.y = -e * .6;
		let o = new N(new M(.1, r.ear, Math.round(r.ear * .75)), c.skin);
		o.scale.set(.32, 1.35, .95), i.add(o);
		let s = new N(new L(.082, .024, 6, 18, Math.PI * 1.55), c.skin);
		s.scale.set(.95, 1.32, 1), s.position.x = e * .018, s.rotation.set(0, e * Math.PI / 2, e > 0 ? Math.PI * 1.225 : Math.PI * .225), r.rim && i.add(s);
		let l = new N(new M(.06, r.ear - 2, Math.round((r.ear - 2) * .75)), c.earIn);
		l.scale.set(.22, 1.1, .75), l.position.set(e * .016, -.008, .008), i.add(l), u.add(d(i, "skin"));
	}
	let m = Pl(f);
	u.add(d(await tu(e, f, m, n, c, a, !0), "hair")), (n.marks || []).includes("earring") && u.add(nu(m, {
		...n,
		marks: ["earring"]
	}, c));
	let h = await $l(e, f, n, c, a, !0);
	return h.name = "Hair", u.add(d(h, "hair")), r !== Su.full && h.traverse((e) => {
		e.isMesh && !e.geometry.index && (e.geometry = Cu(e.geometry));
	}), u.userData.fit = {
		sx: .88,
		sy: pu(su, hu(n)) / su,
		sz: .9
	}, u.traverse((e) => {
		e.isMesh && (e.frustumCulled = !1, e.userData.face = !0);
	}), {
		head: u,
		replaces: [i.headName],
		skull: f,
		on: m
	};
}
Object.keys(Xl), Object.keys(zl), Object.keys(Vl), Object.keys(Ul), [...Object.keys(ql)], Object.keys(ol), Object.keys(cl), Object.keys(Ml);
async function Wu(e, t, n, { far: r = !1, lod: i = "full" } = {}) {
	let a = n.frame === "soft" ? {
		head: "shieldF",
		lashes: !0,
		lips: !0,
		...n
	} : n;
	if ((a.style || iu) === "painted" && a.skull !== "own") return Uu(e, t, a, Su[i] || Su.full);
	let o = a.skull === "own", s = o ? await pl(e, t) : null, c = await pl(e, t), l = ll(ol, a.skin, ol.fair), u = ll(sl, a.hairColor, sl.brown), d = {
		skin: al(l, .72),
		hair: al(u, .85),
		brow: al(ll(sl, a.browColor, u.clone().multiplyScalar(.72)), .9),
		beard: al(ll(sl, a.beardColor, u), .9),
		stubble: al(l.clone().multiplyScalar(.7).lerp(ll(sl, a.beardColor, u), .35), 1),
		white: al("#f2ece2", .35),
		iris: al(ll(cl, a.iris, cl.brown), .3),
		pupil: al("#120c0a", .4),
		glint: new tt({ color: "#ffffff" }),
		lash: al("#1c120e", .8),
		lid: al(l.clone().multiplyScalar(.94), .72),
		crease: al(l.clone().multiplyScalar(.78), .95),
		mouth: al(l.clone().lerp(new P("#3a1210"), .7), .95),
		lip: al(dl(l, "#a04a40", .3, .86), .95),
		scar: al(dl(l, "#a04a44", .35, .8), .9),
		freckle: al(dl(l, "#6a2a10", .5, .74), .9),
		blush: al(dl(l, "#e05a58", .3, 1.02), .8),
		patch: al("#1a1414", .7),
		gold: al("#d8a848", .3, .8),
		tie: al(ll(sl, a.tieColor, "#6a3a22"), .8),
		earIn: al(l.clone().multiplyScalar(.62).lerp(new P("#7a3a34"), .25), .9)
	}, f = new j();
	f.name = "Face";
	let p = Ml[a.shape], m = (e) => p && e ? ml(e, () => !0, p, !1) : e, h = o ? null : await wl(e), g = h && {
		skin: m(h.skin),
		wedge: m(h.wedge),
		whole: m(h.whole),
		noNose: m(h.noNose)
	}, _ = o ? m(s.parts["0,0"]) : g.whole, v = o || !ql[a.nose], y = v ? null : m(Kl(Pl(h.whole))), b = (e, t) => (e.traverse((e) => {
		e.isMesh && !e.userData.part && (e.userData.part = t);
	}), e);
	if (f.add(b(new N(o ? _ : v ? g.skin : g.noNose, d.skin), "skin")), y && f.add(b(new N(y, d.skin), "skin")), g && f.add(b(new N(g.wedge, r ? d.skin : d.lip), "skin")), o) for (let e of a.keep || ["1,1"]) s.parts[e] && f.add(new N(m(s.parts[e]), s.material));
	let x = Pl(v ? _ : bl(g.noNose, g.wedge, y)), S = p ? (e, t, n) => {
		let r = new F(e, t, .45);
		return p(r), x(r.x, r.y, n);
	} : x;
	if (f.add(b(Bl(S, a, d, r), "eye"), b(Hl(S, a, d), "brow"), b(Gl(S, a, d, r), "mouth"), b(Jl(S, a, d), "skin"), b(await tu(e, _, S, a, d, p), "hair")), f.add(b(ru(a, d, p), "skin")), r || f.add(nu(S, a, d)), !o) {
		let t = await $l(e, _, a, d, p);
		t.name = "Hair", f.add(b(t, "hair"));
	}
	return f.traverse((e) => {
		e.isMesh && (e.frustumCulled = !1, e.userData.face = !0);
	}), {
		head: f,
		replaces: [c.headName],
		skull: _,
		on: S
	};
}
//#endregion
//#region ember3d/body.js
var H = (e, t, n) => new F(e, t, n), Gu = (e, t, n) => {
	let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}, Ku = (e, t, n) => e + (t - e) * n, qu = (e, t = .8, n = 0) => new l({
	color: e,
	roughness: t,
	metalness: n
}), Ju = {
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
}, Yu = class {
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
		return H(this.P[e * 3], this.P[e * 3 + 1], this.P[e * 3 + 2]);
	}
	tri(e, t, n, r) {
		let i = this.p(e);
		this.p(t).sub(i).cross(this.p(n).sub(i)).dot(i.clone().add(this.p(t)).add(this.p(n)).multiplyScalar(1 / 3).sub(r)) < 0 ? this.idx.push(e, n, t) : this.idx.push(e, t, n);
	}
	mesh(e, t, n) {
		let r = new Pe();
		r.setAttribute("position", new k(this.P, 3)), r.setAttribute("skinIndex", new Ae(this.SI, 4)), r.setAttribute("skinWeight", new k(this.SW, 4)), r.setIndex(this.idx), r.computeVertexNormals();
		let i = new Ke(r, e);
		return i.bind(t, n), i.frustumCulled = !1, i.userData.body = !0, i;
	}
};
function Xu(e, t, n, r, i, a, o, s, c = 0) {
	let l = [];
	for (let u = 0; u < o; u++) {
		let d = 2 * Math.PI * u / o, f = Math.sin(d), p = t.clone().addScaledVector(n, Math.cos(d) * i).addScaledVector(r, f * a + (f > 0 ? c * f : 0));
		l.push(e.v(p, s));
	}
	return l;
}
function Zu(e, t, n, r, i) {
	let a = t.length, o = r.clone().add(i).multiplyScalar(.5);
	for (let r = 0; r < a; r++) {
		let i = (r + 1) % a;
		e.tri(t[r], t[i], n[i], o), e.tri(t[r], n[i], n[r], o);
	}
}
function Qu(e, t, n, r, i) {
	let a = e.v(n, r), o = n.clone().sub(i.clone().multiplyScalar(.1));
	for (let n = 0; n < t.length; n++) e.tri(a, t[n], t[(n + 1) % t.length], o);
}
function $u(e, t, n, r, i = 8, { caps: a = [!0, !0], steps: o = 3 } = {}) {
	let s = null, c = null, l = (a, o) => {
		let s = t[a], c = t[Math.min(a + 1, t.length - 1)], l = s.p.clone().lerp(c.p, o), u = [Ku(s.r[0], c.r[0], o), Ku(s.r[1], c.r[1], o)], d = [[s.bone, 1]];
		if (a + 1 < t.length - 1 || a + 1 === t.length - 1 && t[a + 1].bone !== s.bone) {
			let e = Gu(.62, 1, o) * .5;
			d[0][1] -= e, d.push([c.bone, e]);
		}
		if (a > 0) {
			let e = (1 - Gu(0, .38, o)) * .5;
			d[0][1] -= e, d.push([t[a - 1].bone, e]);
		}
		return {
			c: l,
			r: Xu(e, l, n, r, u[0], u[1], i, d),
			w: d
		};
	}, u = [];
	for (let e = 0; e < t.length - 1; e++) for (let t = 0; t < o; t++) u.push(l(e, t / o));
	u.push(l(t.length - 2, 1));
	for (let t of u) s && Zu(e, s.r, t.r, c, t.c), s = t, c = t.c;
	let d = t[t.length - 1].p.clone().sub(t[0].p).normalize();
	a[0] && Qu(e, u[0].r, u[0].c, u[0].w, d.clone().negate()), a[1] && Qu(e, u[u.length - 1].r, u[u.length - 1].c, u[u.length - 1].w, d);
}
var ed = [
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
], td = (e) => {
	if (e < .55) return [["hips", 1]];
	if (e < .78) {
		let t = Gu(.55, .78, e);
		return [["hips", 1 - t], ["spine", t]];
	}
	if (e < .98) {
		let t = Gu(.78, .98, e);
		return [["spine", 1 - t], ["chest", t]];
	}
	return [["chest", 1]];
};
function nd(e, t, { y0: n = .36, y1: r = 1.25, grow: i = 0, seg: a = 12, capBottom: o = !0, capTop: s = !0, flare: c = 0 } = {}) {
	let l = ed.filter(([e]) => e >= n - 1e-6 && e <= r + 1e-6), u = H(1, 0, 0), d = H(0, 0, 1), f = null, p = null, m = null;
	for (let [n, r, o] of l) {
		let s = t.belly * Gu(.55, .7, n) * (1 - Gu(.85, 1, n)), l = n < .7 ? Ku(t.hip, t.w, Gu(.46, .7, n)) : t.w, h = H(0, n, 0), g = Xu(e, h, u, d, r * l + i + (n < .5 ? c : 0), o * t.d + i, a, td(n), s);
		f && Zu(e, f.r, g, f.c, h), f = {
			r: g,
			c: h
		}, p ||= f, m = f;
	}
	o && Qu(e, p.r, p.c, td(p.c.y), H(0, -1, 0)), s && Qu(e, m.r, m.c, td(m.c.y), H(0, 1, 0));
}
function rd(e, t, { y0: n = .62, y1: r = .1, flare: i = .14, seg: a = 16, grow: o = .02 } = {}) {
	let s = null, [, c, l] = ed.find(([e]) => e >= n) || ed[2];
	for (let u = 0; u <= 5; u++) {
		let d = u / 5, f = Ku(n, r, d), p = H(0, f, 0), m = c * t.hip + o + i * d, h = l * t.d + o + i * d * .8, g = [];
		for (let t = 0; t < a; t++) {
			let n = 2 * Math.PI * t / a, r = Math.cos(n) * m, i = Math.sin(n) * h, o = Gu(-.1, .1, r), s = 1 - Gu(.42, .62, f);
			g.push(e.v(H(r, f, i), [
				["hips", 1 - s],
				["upperlegl", s * o],
				["upperlegr", s * (1 - o)]
			]));
		}
		s && Zu(e, s.ids, g, s.c, p), s = {
			ids: g,
			c: p
		};
	}
}
function id(e, t, n, r, i, a, o, s = 4, c = 6) {
	let l = [];
	for (let u = 0; u <= c; u++) {
		let d = Ku(r, i, u / c), f = [];
		for (let r = 0; r <= s; r++) {
			let i = Ku(t, n, r / s);
			f.push(e.v(H(i, d, a(i, d)), o(i, d)));
		}
		l.push(f);
	}
	let u = H(0, (r + i) / 2, 0);
	for (let t = 0; t < c; t++) for (let n = 0; n < s; n++) e.tri(l[t][n], l[t][n + 1], l[t + 1][n + 1], u), e.tri(l[t][n], l[t + 1][n + 1], l[t + 1][n], u);
}
function ad(e, t, n, r = 0) {
	let i = t.limb, a = r;
	for (let r of [1, -1]) {
		let o = r > 0 ? "l" : "r", s = H(0, 1, 0), c = H(0, 0, 1), l = H(1, 0, 0);
		n.arms && $u(e, [
			{
				p: H(r * .2, 1.11, 0),
				r: [.11 * i + a, .1 * i + a],
				bone: "upperarm" + o
			},
			{
				p: H(r * .45, 1.11, 0),
				r: [.088 * i + a, .085 * i + a],
				bone: "lowerarm" + o
			},
			{
				p: H(r * n.armTo, 1.11, 0),
				r: [.072 * i + a, .07 * i + a],
				bone: "wrist" + o
			}
		].slice(0, n.armTo > .6 ? 3 : 2), s, c, 8, { caps: [!0, !0] }), n.hands && $u(e, [
			{
				p: H(r * .7, 1.11, 0),
				r: [.075 * i + a, .07 * i + a],
				bone: "wrist" + o
			},
			{
				p: H(r * .8, 1.11, 0),
				r: [.088 * i + a, .075 * i + a],
				bone: "hand" + o
			},
			{
				p: H(r * .92, 1.09, 0),
				r: [.06 * i + a, .055 * i + a],
				bone: "hand" + o
			}
		], s, c, 8), n.legs && $u(e, [
			{
				p: H(r * .16, .56, 0),
				r: [.13 * i * t.hip + a, .13 * i + a],
				bone: "upperleg" + o
			},
			{
				p: H(r * .17, .29, .01),
				r: [.1 * i + a, .1 * i + a],
				bone: "lowerleg" + o
			},
			{
				p: H(r * .17, n.legTo, -.01),
				r: [.08 * i + a, .082 * i + a],
				bone: "foot" + o
			}
		], l, c, 8, { caps: [!1, !0] }), n.feet && $u(e, [
			{
				p: H(r * .17, .065, -.08),
				r: [.085 * i + a, .07 + a],
				bone: "foot" + o
			},
			{
				p: H(r * .17, .065, .05),
				r: [.09 * i + a, .07 + a],
				bone: "toes" + o
			},
			{
				p: H(r * .17, .055, .19),
				r: [.075 * i + a, .055 + a],
				bone: "toes" + o
			}
		], l, H(0, 1, 0), 8);
	}
}
var od = {
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
async function sd(e, t, n, { far: r = !1, findNode: i } = {}) {
	let a = null;
	t.traverse((e) => {
		e.isSkinnedMesh && /Body/.test(e.name) && (a = e);
	});
	let o = a.skeleton, s = a.bindMatrix, c = a.parent;
	t.traverse((e) => {
		e.isMesh && (e.visible = !1);
	});
	let u = Object.fromEntries(o.bones.map((e, t) => [e.name, t])), d = Ju[n.build] || Ju.normal, f = od[n.outfit] || od.fighter, p = f.colors || {}, m = { ...n.face }, h = n.headgear === void 0 ? f.headgear : n.headgear;
	h && h !== "hat" && ![
		"crop",
		"short",
		"bald",
		void 0
	].includes(m.hair) && (m.hair = "crop");
	let g = m.skin, _ = (e, t) => {
		let n = new Yu(u);
		e(n), n.idx.length && c.add(n.mesh(qu(t, .8), o, s));
	}, { SKIN: v } = await Promise.resolve().then(() => rl), y = v[g] || g || v.fair;
	_((e) => nd(e, d), f.top), _((e) => ad(e, d, {
		arms: !0,
		armTo: .7
	}), f.sleeves), _((e) => ad(e, d, { hands: !0 }), f.hands || y), _((e) => ad(e, d, {
		legs: !0,
		legTo: .1
	}), f.legs), _((e) => ad(e, d, { feet: !0 }), f.boots), _((e) => $u(e, [
		{
			p: H(0, 1.18, 0),
			r: [.09 * d.limb, .085 * d.limb],
			bone: "chest"
		},
		{
			p: H(0, 1.3, .01),
			r: [.085 * d.limb, .08 * d.limb],
			bone: "head"
		},
		{
			p: H(0, 1.36, .01),
			r: [.08 * d.limb, .075 * d.limb],
			bone: "head"
		}
	], H(1, 0, 0), H(0, 0, 1), 8), y);
	for (let e of f.extras || []) {
		let t = (e) => (t, n) => (ed.find(([e]) => e >= n) || ed[ed.length - 1])[2] * d.d + e + d.belly * Gu(.55, .7, n) * (1 - Gu(.85, 1, n));
		if (e === "breastplate" && _((e) => nd(e, d, {
			y0: .62,
			y1: 1.18,
			grow: .03,
			capBottom: !1
		}), p.steel), e === "belt" && _((e) => nd(e, d, {
			y0: .46,
			y1: .62,
			grow: .035,
			capBottom: !1,
			capTop: !1,
			seg: 14
		}), p.belt), e === "pauldrons" && _((e) => {
			for (let t of [1, -1]) $u(e, [{
				p: H(t * .2, 1.12, 0),
				r: [.16 * d.limb, .16 * d.d],
				bone: t > 0 ? "upperarml" : "upperarmr"
			}, {
				p: H(t * .36, 1.1, 0),
				r: [.14 * d.limb, .14 * d.d],
				bone: t > 0 ? "upperarml" : "upperarmr"
			}], H(0, 1, 0), H(0, 0, 1), 10);
		}, p.steel), e === "vambraces" && _((e) => {
			for (let t of [1, -1]) $u(e, [{
				p: H(t * .5, 1.11, 0),
				r: [.1 * d.limb, .098 * d.limb],
				bone: t > 0 ? "lowerarml" : "lowerarmr"
			}, {
				p: H(t * .69, 1.11, 0),
				r: [.085 * d.limb, .083 * d.limb],
				bone: t > 0 ? "lowerarml" : "lowerarmr"
			}], H(0, 1, 0), H(0, 0, 1), 8);
		}, p.steel), e === "greaves" && _((e) => {
			for (let t of [1, -1]) $u(e, [{
				p: H(t * .17, .31, .01),
				r: [.115 * d.limb, .117 * d.limb],
				bone: t > 0 ? "lowerlegl" : "lowerlegr"
			}, {
				p: H(t * .17, .12, -.01),
				r: [.1 * d.limb, .1 * d.limb],
				bone: t > 0 ? "lowerlegl" : "lowerlegr"
			}], H(1, 0, 0), H(0, 0, 1), 8);
		}, p.steel), e === "pouches" && _((e) => {
			for (let t of [1, -1]) $u(e, [{
				p: H(t * .27 * d.hip, .5, .12),
				r: [.06, .05],
				bone: "hips"
			}, {
				p: H(t * .27 * d.hip, .4, .12),
				r: [.06, .05],
				bone: "hips"
			}], H(1, 0, 0), H(0, 0, 1), 6);
		}, p.belt), e === "mantle" && _((e) => {
			let t = H(1, 0, 0), n = H(0, 0, 1);
			Zu(e, Xu(e, H(0, 1.24, 0), t, n, .16 * d.w, .14 * d.d, 14, [["chest", 1]]), Xu(e, H(0, 1.02, 0), t, n, .4 * d.w, .3 * d.d, 14, [["chest", 1]]), H(0, 1.24, 0), H(0, 1.02, 0));
		}, p.cloth), e === "robe" && _((e) => rd(e, d, {
			y1: f.robeTo ?? .08,
			flare: .13
		}), p.robe), e === "tabard") {
			let e = (e, t) => t > .62 ? td(t) : [["hips", 1]];
			_((n) => id(n, -.15, .15, .28, 1.08, t(.05), e), p.cloth), _((n) => {
				id(n, -.17, -.14, .28, 1.08, t(.055), e, 1, 6), id(n, .14, .17, .28, 1.08, t(.055), e, 1, 6);
			}, p.trim);
		}
		e === "cape" && _((e) => id(e, -.3 * d.w, .3 * d.w, .18, 1.16, (e, t) => -((ed.find(([e]) => e >= t) || ed[ed.length - 1])[2] * d.d) - .06 - (1.16 - t) * .12, (e, t) => td(Math.max(t, .5)), 5, 7), p.cloth);
	}
	let b = i(t, "head"), x = await Wu(e, "Knight", m, { far: r });
	b.add(x.head);
	let S = new j(), C = x.skull, w = (e, t = .8, n = 0) => qu(e, t, n);
	C.computeBoundingBox();
	let T = C.boundingBox, E = (T.max.x - T.min.x) / 2, D = T.max.y;
	if (h === "helm") {
		let e = w(p.steel, .4, .3);
		S.add(new N(Nl(C, (e) => e.y > .14 && !(e.z > .12 && e.y < .64 && Math.abs(e.x) < .4), .17), e)), S.add(new N(Nl(C, (e) => e.y > .08 && e.y < .55 && Math.abs(e.x) > .3 && e.z > -.15, .2), e)), S.add(new N(Nl(C, (e) => e.y > .56 && e.y < .68, .2), w(p.trim, .5, .4)));
		let t = new N(new I(.07, .3, .07), e), n = x.on(0, .5).p;
		t.position.set(0, .47, n.z + .14), S.add(t);
		let r = new N(new I(.07, .14, .9), w(p.trim, .5, .4));
		r.position.set(0, D * 1.12 + .02, -.04), S.add(r);
	}
	if (h === "hood") {
		let e = new l({
			color: p.hood,
			roughness: .9,
			side: 2
		});
		S.add(new N(Nl(C, (e) => !(e.z > 0 && e.y < .84 && Math.abs(e.x) < .42), .26), e));
		let t = new N(new A(E * 1.2, E * 1.55, .5, 16, 1, !0, .7, Math.PI * 2 - 1.4), e);
		t.position.set(0, -.12, -.04), S.add(t);
		let n = new N(new R(.22, .7, 8), e);
		n.position.set(0, .62, -.7), n.rotation.x = -1.95, S.add(n);
	}
	if (h === "coif") {
		let e = new l({
			color: p.coif,
			roughness: .95,
			side: 2
		});
		S.add(new N(Nl(C, (e) => !(e.z > .04 && e.y < .72 && Math.abs(e.x) < .4), .12), e));
		let t = new N(new A(E * 1.08, E * 1.45, .46, 16, 1, !0, .9, Math.PI * 2 - 1.8), e);
		t.position.set(0, -.1, -.02), S.add(t);
		let n = new N(Nl(C, (e) => e.y > .66 && e.y < .74 && e.z > -.1, .135), w(p.trim, .5, .4));
		S.add(n);
	}
	if (h === "hat") {
		let e = new j(), t = new l({
			color: p.hat,
			roughness: .85,
			side: 2
		}), n = new N(new A(E * 1.55, E * 1.6, .06, 24), t);
		e.add(n);
		let r = new N(new R(E * .98, 1.05, 16, 1), t);
		r.position.y = .55, e.add(r);
		let i = new N(new A(E * .9, E * .99, .13, 16, 1, !0), w(p.band));
		i.position.y = .09, i.scale.setScalar(1.03), e.add(i);
		let a = new N(new R(E * .2, .34, 8), t);
		a.position.set(0, 1.12, -.12), a.rotation.x = -.7, e.add(a), e.position.set(0, D * .8, -.02), e.rotation.x = -.22, S.add(e);
	}
	S.traverse((e) => {
		e.isMesh && (e.frustumCulled = !1);
	}), b.add(S);
}
//#endregion
//#region ember3d/creatures.js
var cd = (e) => {
	let t = e >>> 0 || 1;
	return () => (t = Math.imul(t, 1664525) + 1013904223 >>> 0, t / 4294967296);
}, U = (e, t, n) => new F(e, t, n), ld = U(0, 1, 0), ud = class {
	constructor(e) {
		this.bones = [], this.by = /* @__PURE__ */ new Map(), this.parts = [], this.r = cd(e), this.crease = fd, this.mottle = .1;
	}
	bone(e, t, n) {
		let r = new ge();
		return r.name = e, r.userData.at = n.clone(), r.position.copy(t ? n.clone().sub(t.userData.at) : n), t && t.add(r), this.bones.push(r), this.by.set(e, r), r;
	}
	part(e, t, n, r = !1, i = this.crease) {
		this.parts.push({
			geo: e.index ? e.toNonIndexed() : e,
			bone: typeof t == "function" ? t : this.bones.indexOf(this.by.get(t)),
			colour: n,
			glow: r,
			crease: i
		});
	}
	skin(e) {
		return (t) => e(t).map(([e, t]) => [this.bones.indexOf(this.by.get(e)), t]);
	}
	mesh(e, t = 1.6) {
		let n = (e, t) => {
			let n = 0;
			for (let t of e) n += t.geo.attributes.position.count;
			let r = new Float32Array(n * 3), i = new Float32Array(n * 3), a = new Uint16Array(n * 4), o = new Float32Array(n * 4), s = 0, c = new F(), l = new F(), u = new P(), d = new Float32Array(n * 3);
			for (let t of e) {
				let e = sn(t.geo, t.crease), n = e.attributes.position, f = e.attributes.normal;
				for (let e = 0; e < n.count; e++) {
					if (c.fromBufferAttribute(n, e), l.fromBufferAttribute(f, e), typeof t.colour == "function" ? u.copy(t.colour(c, l)) : u.copy(t.colour), !t.glow && this.mottle && u.multiplyScalar(1 - this.mottle + 2 * this.mottle * gd(Math.round(c.x * 60), Math.round(c.y * 60), Math.round(c.z * 60), 3)), r.set([
						c.x,
						c.y,
						c.z
					], s * 3), i.set([
						u.r,
						u.g,
						u.b
					], s * 3), d.set([
						l.x,
						l.y,
						l.z
					], s * 3), typeof t.bone == "function") {
						let e = t.bone(c), n = e[0], r = e[1] || [0, 0];
						a.set([
							n[0],
							r[0],
							0,
							0
						], s * 4), o.set([
							n[1],
							r[1],
							0,
							0
						], s * 4);
					} else a.set([
						t.bone,
						0,
						0,
						0
					], s * 4), o.set([
						1,
						0,
						0,
						0
					], s * 4);
					s++;
				}
			}
			let f = new Pe();
			return f.setAttribute("position", new ve(r, 3)), f.setAttribute("color", new ve(i, 3)), f.setAttribute("skinIndex", new ve(a, 4)), f.setAttribute("skinWeight", new ve(o, 4)), f.setAttribute("normal", new ve(d, 3)), new Ke(f, t);
		}, r = new j(), i = new y(this.bones);
		r.add(this.bones[0]), r.updateMatrixWorld(!0);
		let a = n(this.parts.filter((e) => !e.glow), new l({
			vertexColors: !0,
			roughness: .95,
			metalness: 0
		}));
		a.name = "Body", r.add(a), a.bind(i);
		let o = /* @__PURE__ */ new Map();
		for (let t of this.parts) if (t.glow) {
			let n = t.glow === !0 ? e : t.glow;
			o.has(n) || o.set(n, []), o.get(n).push(t);
		}
		for (let [a, s] of o) {
			let o = n(s, new l({
				vertexColors: !0,
				roughness: .4,
				emissive: new P(a),
				emissiveIntensity: t
			}));
			o.name = a === e ? "Eyes" : "Eyes_Lamp", o.userData.glow = !0, r.add(o), o.bind(i);
		}
		return r.traverse((e) => {
			e.isMesh && (e.frustumCulled = !1);
		}), r;
	}
}, dd = 1.6, fd = 50 * Math.PI / 180, pd = (e, t) => Math.max(t, Math.round(e * dd));
function W(e, t, n = [10, 8], r = 0) {
	n = [pd(n[0], 8), pd(n[1], 6)];
	let i = new M(1, n[0], n[1]);
	return i.scale(t[0], t[1], t[2]), r && i.rotateX(r), i.translate(e.x, e.y, e.z), i;
}
function G(e, t, n, r, i = 6) {
	i = pd(i, 5);
	let a = t.clone().sub(e), o = a.length(), s = new A(r, n, o, i, 1);
	return s.translate(0, o / 2, 0), s.applyQuaternion(new m().setFromUnitVectors(ld, a.normalize())), s.translate(e.x, e.y, e.z), s;
}
function md(e, t, n, r = 8, i = 24) {
	let a = new We(e), o = new Je(a, i, 1, pd(r, 6), !1), s = o.attributes.position, c = U(0, 0, 0), l = U(0, 0, 0), u = (e) => {
		let n = e * (t.length - 1), r = Math.min(t.length - 2, Math.floor(n)), i = n - r;
		return t[r] + (t[r + 1] - t[r]) * i;
	}, d = pd(r, 6) + 1, f = [];
	for (let e = 0; e <= i; e++) {
		let t = e / i;
		a.getPointAt(t, c), f.push([c.clone(), t]);
		for (let n = 0; n < d; n++) {
			let r = e * d + n;
			l.fromBufferAttribute(s, r).sub(c).multiplyScalar(u(t)).add(c), s.setXYZ(r, l.x, l.y, l.z);
		}
	}
	return {
		g: o,
		skin: (e) => {
			let t = 0, r = Infinity;
			for (let [n, i] of f) {
				let a = n.distanceToSquared(e);
				a < r && (r = a, t = i);
			}
			let i = t * n.length - .5, a = Math.max(0, Math.min(n.length - 1, Math.floor(i))), o = Math.min(n.length - 1, a + 1), s = Math.max(0, Math.min(1, i - a));
			return a === o ? [[n[a], 1]] : [[n[a], 1 - s], [n[o], s]];
		}
	};
}
var K = (e, t, n) => new m().setFromEuler(new w(e, t, n)), hd = (e, t) => new m().setFromAxisAngle(e, t);
function q(e, t, n, r, i = 24) {
	let a = Math.max(2, Math.round(n * i) + 1), o = [], s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
	for (let e = 0; e < a; e++) {
		let t = e / (a - 1);
		o.push(t * n);
		let i = r(t), u = () => Array.from({ length: a });
		for (let [t, n] of Object.entries(i.q || {})) s.has(t) || s.set(t, u()), s.get(t)[e] = n;
		for (let [t, n] of Object.entries(i.p || {})) c.has(t) || c.set(t, u()), c.get(t)[e] = n;
		for (let [t, n] of Object.entries(i.s || {})) l.has(t) || l.set(t, u()), l.get(t)[e] = n;
	}
	let u = [];
	for (let [e, t] of s) u.push(new oe(`${e}.quaternion`, o, t.flatMap((e) => (e || new m()).toArray())));
	for (let [t, n] of c) {
		let r = e.by.get(t).position;
		u.push(new $e(`${t}.position`, o, n.flatMap((e) => r.clone().add(e || U(0, 0, 0)).toArray())));
	}
	for (let [e, t] of l) u.push(new $e(`${e}.scale`, o, t.flatMap((e) => (e || U(1, 1, 1)).toArray())));
	return new Re(t, n, u);
}
var gd = (e, t, n, r = 0) => {
	let i = Math.sin(e * 127.1 + t * 311.7 + n * 74.7 + r * 19.19) * 43758.5453;
	return i - Math.floor(i);
};
function _d(e, t, n, r = 1) {
	let i = new Ye(e.map(([e, t]) => new Oe(Math.max(1e-4, t), e)), t).rotateX(Math.PI / 2), a = i.attributes.position;
	for (let e = 0; e < a.count; e++) {
		let t = a.getZ(e);
		a.setY(e, a.getY(e) * r + n(t));
	}
	return i;
}
var vd = (e, t, n) => e.rotateY(t).translate(n.x, n.y, n.z), yd = (e, t, n) => e.clone().lerp(t, Math.max(0, Math.min(1, n))), bd = Math.PI * 2, J = (e) => Math.sin(bd * e), xd = (e) => Math.cos(bd * e), Sd = (e, t, n) => {
	let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}, Y = (e, t, n, r) => r < t ? Sd(e, t, r) : 1 - Sd(t, n, r);
function Cd(e = {}) {
	let t = !!e.king, n = new ud(e.seed || 11), r = new P(e.fur || "#3c3b3a"), i = new P(e.belly || "#4c4a48"), a = new P(e.skin || "#8e7672"), o = new P(e.furTop || "#64625e"), s = (e, t) => t.y < -.35 ? i : t.y > .62 ? yd(r, o, .45) : r, c = new P("#d8cdb4"), l = new P("#e0cf8a"), u = new P("#3a1214"), d = new P(e.tail || "#8e706a"), f = new P("#5a4642"), p = n.bone("root", null, U(0, .2, 0)), m = n.bone("pelvis", p, U(0, .21, -.17)), h = n.bone("chest", p, U(0, .22, .14)), g = n.bone("neck", h, U(0, .235, .25)), _ = n.bone("head", g, U(0, .245, .31));
	n.bone("jaw", _, U(0, .22, .35));
	let v = m, y = [
		U(0, .17, -.31),
		U(0, .11, -.45),
		U(.03, .055, -.59),
		U(.08, .025, -.71)
	];
	y.forEach((e, t) => {
		v = n.bone(`tail${t + 1}`, v, e);
	});
	for (let e of [1, -1]) {
		let t = n.bone(`armU${e}`, h, U(.085 * e, .19, .16)), r = n.bone(`armL${e}`, t, U(.095 * e, .1, .2));
		n.bone(`paw${e}`, r, U(.095 * e, .025, .215));
		let i = n.bone(`legU${e}`, m, U(.1 * e, .18, -.17)), a = n.bone(`legL${e}`, i, U(.11 * e, .09, -.1));
		n.bone(`foot${e}`, a, U(.11 * e, .03, -.2));
	}
	let b = (e) => .2 + .04 * Math.exp(-(((e + .06) / .2) ** 2)) - (e > .14 ? .015 * (e - .14) / .14 : 0), x = [
		...[
			1,
			.92,
			.75,
			.5,
			.2,
			0
		].map((e) => [-.2 - .11 * e, .15 * Math.sqrt(1 - e * e)]),
		[-.12, .155],
		[-.04, .152],
		[.04, .145],
		[.11, .128],
		[.17, .1],
		[.22, .078],
		[.25, .05],
		[.27, 0]
	], S = (e, t) => {
		for (let n = 0; n < t.length - 1; n++) {
			let [r, i] = t[n], [a, o] = t[n + 1];
			if (e <= a) {
				let t = Math.max(0, Math.min(1, (e - r) / (a - r)));
				return t < .5 ? [[i, 1 - t], [o, t]] : [[o, t], [i, 1 - t]];
			}
		}
		return [[t[t.length - 1][1], 1]];
	}, C = n.skin((e) => S(e.z, [
		[-.2, "pelvis"],
		[-.06, "pelvis"],
		[.05, "root"],
		[.12, "root"],
		[.2, "chest"],
		[.24, "chest"],
		[.3, "neck"]
	])), w = (e) => {
		for (let t = 0; t < x.length - 1; t++) if (e <= x[t + 1][0]) {
			let [n, r] = x[t], [i, a] = x[t + 1];
			return r + (a - r) * (e - n) / Math.max(1e-6, i - n);
		}
		return 0;
	};
	n.part(_d(x, 28, b, .92), C, s);
	let T = (e, t, i, a, s = .35, c = .9) => {
		let l = w(e) * .9, u = U(Math.sin(t) * l, b(e) + Math.cos(t) * l * .92, e), d = U(Math.sin(t), Math.cos(t) * .92, 0).normalize(), f = d.clone().multiplyScalar(s).add(U(0, -.1, -c)).normalize(), p = u.clone().add(f.clone().multiplyScalar(i)), m = G(u.clone().add(d.clone().multiplyScalar(-.01)), p, a, .003, 4), h = m.attributes.position, g = d.clone().sub(f.clone().multiplyScalar(d.dot(f))).normalize(), _ = U(0, 0, 0);
		for (let e = 0; e < h.count; e++) {
			_.fromBufferAttribute(h, e);
			let t = _.clone().sub(u).dot(g);
			_.addScaledVector(g, -.55 * t), h.setXYZ(e, _.x, _.y, _.z);
		}
		n.part(m, C, (e, t) => e.distanceTo(u) > i * .55 ? o : yd(r, o, .15));
	};
	for (let e = 0; e < 9; e++) {
		let t = -.24 + e * .05, n = gd(e, 7, 1, 5);
		T(t, (e % 2 ? .12 : -.12) + (n - .5) * .15, (.048 + .025 * n) * (t > .05 ? .6 : 1), .036, t > .05 ? .12 : .22);
	}
	for (let e of [1, -1]) {
		for (let t = 0; t < 4; t++) {
			let n = gd(t, e, 2, 6);
			T(.1 + t * .03, e * (.8 + .3 * t), .055 + .02 * n, .03, .25, .85);
		}
		for (let t = 0; t < 4; t++) {
			let n = gd(t, e, 4, 7);
			T(-.22 + t * .09, e * (.95 + t % 2 * .25), .06 + .03 * n, .03, .3, .9);
		}
		T(-.18, e * .6, .075, .034, .4, .95);
	}
	for (let e of [
		-.5,
		0,
		.5
	]) T(-.29, e, .06, .034, .6, .85);
	n.part(W(U(0, .262, .31), [
		.1,
		.09,
		.1
	], [12, 9]), "head", s);
	for (let e of [1, -1]) for (let [t, r] of [
		[.245, .31],
		[.28, .29],
		[.215, .33]
	]) n.part(G(U(.075 * e, t, r), U(.125 * e, t - .015, r - .055), .024, .002, 3), "head", o);
	for (let e of [1, -1]) n.part(W(U(0, 0, 0), [
		.04,
		.016,
		.03
	], [8, 5]).rotateZ(-.42 * e).translate(.036 * e, .3, .362), "head", r);
	n.part(G(U(0, .258, .36), U(0, .24, .47), .06, .03, 8), "head", s), n.part(W(U(0, .246, .472), [
		.02,
		.016,
		.013
	], [6, 4]), "head", a), n.part(W(U(0, .21, .4), [
		.04,
		.024,
		.06
	], [8, 6]), "head", u);
	for (let e of [1, -1]) n.part(G(U(.01 * e, .222, .46), U(.01 * e, .165, .466), .01, .004, 4), "head", l), n.part(G(U(.033 * e, .215, .405), U(.032 * e, .185, .41), .006, .001, 3), "head", l), n.part(W(U(.05 * e, .283, .388), [
		.014,
		.012,
		.009
	], [6, 4]), "head", new P("#ff5530"), !0), n.part(vd(W(U(0, 0, 0), [
		.04,
		.044,
		.012
	], [8, 6]), .5 * e, U(.066 * e, .33, .275)), "head", r), n.part(vd(W(U(0, 0, .006), [
		.029,
		.033,
		.008
	], [6, 4]), .5 * e, U(.066 * e, .33, .275)), "head", a);
	n.part(W(U(0, .19, .4), [
		.034,
		.017,
		.055
	], [8, 5]), "jaw", s);
	for (let e of [1, -1]) n.part(G(U(.007 * e, .192, .448), U(.007 * e, .222, .452), .007, .003, 4), "jaw", l);
	let E = [
		U(0, .19, -.27),
		...y,
		U(.13, .015, -.8),
		U(.16, .012, -.9)
	], D = [
		"pelvis",
		"tail1",
		"tail2",
		"tail3",
		"tail4",
		"tail4"
	];
	for (let e = 0; e < E.length - 1; e++) for (let t = 0; t < 3; t++) {
		let r = E[e].clone().lerp(E[e + 1], t / 3), i = E[e].clone().lerp(E[e + 1], (t + 1) / 3), a = (e * 3 + t) / ((E.length - 1) * 3);
		n.part(G(r, i, .036 * (1 - a) + .004, .036 * (1 - a - 1 / 18) + .004, 6), D[e], t === 2 ? f : d);
	}
	let ee = (e, t, r, i, o) => {
		n.part(W(e, [
			.026,
			.012,
			.03
		], [6, 4]), r, a);
		for (let s = -1.5; s <= 1.5; s++) {
			let l = s * .32 + .1 * i, u = U(Math.sin(l) * t.z + t.x, 0, Math.cos(l) * t.z), d = e.clone().add(u.clone().multiplyScalar(.015)), f = d.clone().add(u.clone().multiplyScalar(o));
			f.y = .004, n.part(G(d, f, .007, .004, 3), r, a), n.part(G(f, f.clone().add(u.clone().multiplyScalar(.016)).add(U(0, -.003, 0)), .004, .001, 3), r, c);
		}
	};
	for (let e of [1, -1]) n.part(G(U(.085 * e, .2, .15), U(.095 * e, .1, .2), .052, .036), `armU${e}`, s), n.part(G(U(.095 * e, .1, .2), U(.095 * e, .025, .215), .036, .024), `armL${e}`, s), n.part(G(U(.1 * e, .09, .19), U(.12 * e, .05, .17), .018, .002, 3), `armL${e}`, o), ee(U(.095 * e, .012, .235), U(0, 0, 1), `paw${e}`, e, .045), n.part(W(U(.1 * e, .17, -.17), [
		.06,
		.075,
		.085
	], [8, 6]), `legU${e}`, s), n.part(G(U(.11 * e, .11, -.12), U(.11 * e, .03, -.2), .024, .016), `legL${e}`, r), n.part(W(U(.11 * e, .014, -.165), [
		.026,
		.012,
		.055
	], [6, 4]), `foot${e}`, a), ee(U(.11 * e, .01, -.13), U(0, 0, 1), `foot${e}`, e, .04);
	e.king && wd(n, y);
	let O = U(0, .045, .015), te = [n.bones.indexOf(n.by.get("head")), n.bones.indexOf(n.by.get("jaw"))];
	n.by.get("head").position.add(O), n.by.get("head").userData.at.add(O), n.by.get("jaw").userData.at.add(O);
	let k = n.by.get("head").userData.at.clone(), ne = e.king ? 1.1 : 1.25;
	for (let e of n.parts) te.includes(e.bone) && e.geo.translate(O.x - k.x, O.y - k.y, O.z - k.z).scale(ne, ne, ne).translate(k.x, k.y, k.z);
	let A = n.by.get("jaw");
	A.position.multiplyScalar(ne), A.userData.at.copy(k).add(A.position), n.part(G(U(0, .235, .24), U(0, .28, .31), .075, .07, 8), "neck", s);
	let re = n.mesh(e.eyes || "#ff4020"), ie = (e, t = 1) => {
		let n = {};
		for (let r of [1, -1]) for (let [i, a, o] of [[
			`armU${r}`,
			`armL${r}`,
			r > 0 ? 0 : .5
		], [
			`legU${r}`,
			`legL${r}`,
			r > 0 ? .5 : 0
		]]) {
			let r = J(e + o), s = Math.max(0, xd(e + o));
			n[i] = K(-.55 * t * r, 0, 0), n[a] = K((i.startsWith("arm") ? .9 : -.9) * t * s, 0, 0);
		}
		return n;
	}, j = (e, t = .25, n = 1) => Object.fromEntries([
		1,
		2,
		3,
		4
	].map((r) => [`tail${r}`, K(0, t * J(n * e - r * .12), 0)]));
	return {
		root: re,
		clips: [
			q(n, "Idle", t ? 5 : 4, (e) => {
				let n = Y(.06, .14, .34, e), r = Y(.38, .46, .7, e), i = J((e - .38) / .32 * .5 + .25) * r, a = t ? 0 : Y(.72, .8, .94, e), o = Y(.52, .55, .6, e), s = J(e * (t ? 5 : 6)), c = .05 * J(e * 32) * n, l = t ? Y(.72, .8, .95, e) : 0;
				return {
					q: {
						...Object.fromEntries([
							1,
							2,
							3,
							4
						].map((t) => [`tail${t}`, K(0, .2 * J(e * 2 - t * .1) + .5 * o * (t > 2 ? 1 : .3), .04 * J(e * 2 - t * .1))])),
						chest: K(.03 * s - .1 * n, .15 * i, 0),
						pelvis: K(-.015 * s, -.06 * i, .03 * J(e)),
						neck: K(-.2 * n + .25 * a, .25 * i, 0),
						head: K(-.15 * n + c + .15 * a - .1 * l, .35 * i + .2 * a, .1 * i + .25 * a),
						jaw: K(.2 + .15 * Math.max(0, J(e * 16)) * n + .55 * l, 0, 0),
						root: K(-.3 * a, 0, 0),
						armU1: K(-1.5 * a, 0, .25 * a),
						armL1: K(1.4 * a, 0, 0),
						paw1: K(-.6 * a * (1 + .3 * J(e * 24)), 0, 0),
						"armU-1": K(-.35 * a, 0, 0),
						legU1: K(.06 * n, 0, 0),
						"legU-1": K(.06 * n, 0, 0)
					},
					p: { root: U(0, .004 * s + .022 * n + .02 * a, -.01 * n - .04 * a) }
				};
			}),
			q(n, "Walk", .42, (e) => ({
				q: {
					...ie(e),
					...j(e, .3, 1),
					pelvis: K(0, .08 * J(e), 0),
					chest: K(0, -.06 * J(e), 0),
					head: K(.06 * J(e * 2), 0, 0)
				},
				p: { root: U(0, .012 * Math.abs(J(e)), 0) }
			})),
			q(n, "Attack", .6, (e) => {
				let t = Y(.15, .45, .85, e), n = Y(0, .15, .3, e);
				return {
					q: {
						...j(e, .3, 2),
						root: K(-.15 * n + .12 * t, 0, 0),
						chest: K(.2 * t, 0, 0),
						neck: K(.25 * t - .3 * n, 0, 0),
						head: K(-.35 * t, 0, 0),
						jaw: K(.85 * Y(.15, .36, .5, e), 0, 0),
						armU1: K(-.6 * t, 0, 0),
						"armU-1": K(-.6 * t, 0, 0)
					},
					p: { root: U(0, .02 * n - .02 * t, .16 * t - .03 * n) }
				};
			}),
			q(n, "Attack2", .55, (e) => {
				let t = Y(.1, .35, .8, e);
				return {
					q: {
						...j(e, .2),
						root: K(-.35 * t, 0, 0),
						armU1: K(-1.3 * Y(.2, .4, .6, e), 0, .2),
						"armU-1": K(-1.3 * Y(.35, .55, .75, e), 0, -.2),
						jaw: K(.5 * t, 0, 0)
					},
					p: { root: U(0, .03 * t, .03 * t) }
				};
			}),
			q(n, "Heavy", .9, (e) => {
				let t = Y(0, .25, .4, e), n = Y(.3, .55, .8, e);
				return {
					q: {
						...ie(e * .5, .6 * n),
						...j(e, .4),
						root: K(.15 * t - .25 * n, 0, 0),
						jaw: K(.7 * n, 0, 0)
					},
					p: { root: U(0, -.04 * t + .14 * n, .28 * Sd(.3, .8, e)) }
				};
			}),
			q(n, "Hit", .4, (e) => {
				let t = Y(0, .25, 1, e);
				return {
					q: {
						...j(e, .5, 2),
						head: K(-.35 * t, .3 * t, 0),
						chest: K(-.15 * t, 0, 0)
					},
					p: { root: U(0, 0, -.05 * t) }
				};
			}),
			q(n, "Death", 1, (e) => {
				let t = Sd(0, .6, e);
				return {
					q: {
						root: K(0, 0, 1.45 * t),
						head: K(.3 * t, 0, 0),
						jaw: K(.4 * t, 0, 0),
						armU1: K(-.6 * t, 0, 0),
						"armU-1": K(.4 * t, 0, 0),
						legU1: K(.5 * t, 0, 0),
						"legU-1": K(-.3 * t, 0, 0),
						...j(0, 0)
					},
					p: { root: U(0, -.07 * t, 0) }
				};
			}),
			q(n, "Cast", .8, (e) => {
				let t = Y(.1, .5, .9, e);
				return {
					q: {
						root: K(-.5 * t, 0, 0),
						head: K(-.4 * t, 0, 0),
						jaw: K(.8 * t, 0, 0),
						...j(e, .3)
					},
					p: { root: U(0, .05 * t, 0) }
				};
			})
		]
	};
}
function wd(e, t) {
	let n = new P("#8a5a24"), r = new P("#9a7a34"), i = new P("#2a1226"), a = new P("#3c1c36"), o = new P("#d8c27a"), s = new P("#b07a72"), c = new P("#8a6460"), l = new P("#3a342e"), u = new P("#5a534a");
	e.part(new L(.047, .009, 4, 12).rotateX(Math.PI / 2 - .25).translate(0, .315, .3), "head", r);
	for (let t = 0; t < 7; t++) {
		let i = t / 7 * Math.PI * 2, a = U(Math.sin(i), 0, Math.cos(i)), o = U(0, .318, .3).add(a.clone().multiplyScalar(.046)), s = o.clone().add(a.clone().multiplyScalar(.018)).add(U(0, .05 + t % 2 * .015, 0));
		e.part(G(o, s, .008, .002, 4), "head", t % 2 ? n : r);
	}
	for (let t of [1, -1]) e.part(G(U(.007 * t, .226, .462), U(.008 * t, .19, .468), .007, .004, 4), "head", o);
	e.part(G(U(.05, .31, .33), U(.03, .25, .4), .005, .004, 3), "head", s), e.part(W(U(0, .27, .13), [
		.115,
		.1,
		.12
	], [10, 8]), "chest", (e, t) => t.y > .55 ? u : l);
	for (let t = 0; t < 12; t++) {
		let n = t / 12 * Math.PI * 2, r = U(Math.sin(n), Math.cos(n) * .8, 0), i = U(0, .26, .25).add(r.clone().multiplyScalar(.075));
		e.part(G(i, i.clone().add(r.clone().multiplyScalar(.05)).add(U(0, 0, -.04)), .02, .003, 3), "neck", t % 3 ? l : u);
	}
	e.part(W(U(0, .275, .02), [
		.172,
		.075,
		.22
	], [12, 8]), "root", (e, t) => t.y > .5 ? a : i);
	for (let t = 0; t < 10; t++) {
		let n = t / 9 * Math.PI - Math.PI / 2, r = .02 + .21 * Math.sin(n);
		for (let a of [1, -1]) {
			let o = U(.165 * a * Math.cos(n * .85), .22, r);
			e.part(G(o, o.clone().add(U(.012 * a, -.04 - t % 2 * .02, -.01)), .022, .003, 3), "root", i);
		}
	}
	e.part(W(U(0, .255, .33), [
		.016,
		.016,
		.01
	], [6, 4]), "neck", r);
	let d = t[3].clone().add(U(.02, .03, -.06));
	e.part(new ze(.045, .012, 40, 5, 2, 3).translate(d.x, d.y + .01, d.z), "tail4", c);
	for (let t = 0; t < 6; t++) {
		let n = t / 6 * Math.PI * 2 + .3, r = U(Math.sin(n), 0, Math.cos(n)), i = d.clone().add(r.clone().multiplyScalar(.085)).add(U(0, t % 2 * .02, 0)), a = t < 3 ? "tail4" : "tail3", o = .85 + t % 3 * .12, c = (e, t) => t.y > .5 ? u : l;
		e.part(vd(W(U(0, .035 * o, 0), [
			.04 * o,
			.036 * o,
			.065 * o
		], [8, 6]), n, i), a, c), e.part(vd(G(U(0, .04 * o, .05 * o), U(0, .03 * o, .115 * o), .026 * o, .007, 5), n, i), a, c);
		for (let t of [1, -1]) e.part(vd(W(U(.02 * t * o, .06 * o, .055 * o), [
			.016 * o,
			.017 * o,
			.005
		], [6, 4]), n, i), a, s), e.part(vd(W(U(.014 * t * o, .05 * o, .085 * o), [
			.006,
			.006,
			.005
		], [5, 3]), n, i), a, new P("#ff5530"), !0), e.part(vd(G(U(.03 * t * o, .02, .03 * o), U(.05 * t * o, 0, .05 * o), .008, .005, 4), n, i), a, l);
	}
}
function Td(e, { dark: t, band: n, mark: r }) {
	let i = new P("#d6ccb2"), a = new P("#9ccc5a");
	e.part(W(U(0, .4, -.4), [
		.25,
		.22,
		.38
	], [14, 10], -.3), "abdomen", (e, i) => {
		let a = (e.z + .4) / .3, o = Math.sin((e.z + .4) * 30) > .72;
		return i.y > .62 && Math.abs(a) < .9 && Math.abs(e.x) < .014 + .05 * Math.abs(a) ? r : o ? n : t;
	}), e.part(G(U(0, .3, -.74), U(0, .25, -.8), .04, .014), "abdomen", n);
	for (let t = 0; t < 14; t++) {
		let n = t / 14 * Math.PI * 2, r = -.4 + .24 * Math.cos(n * 1.7), i = t % 2 ? 1 : -1, o = .4 + .12 * Math.sin(n * 2.3), s = i * Math.sqrt(Math.max(0, 1 - ((o - .4) / .22) ** 2 - ((r + .4) / .38) ** 2)) * .25 * .97;
		e.part(W(U(s, o, r), [
			.022,
			.018,
			.022
		], [6, 4]), "abdomen", a, !0);
	}
	for (let t = 0; t < 5; t++) {
		let n = (t - 2) * .04, r = U(n, .34, .06 - Math.abs(t - 2) * .012);
		e.part(G(r, r.clone().add(U(n * .6, .11 - Math.abs(t - 2) * .025, -.07)), .014, .002, 4), "ceph", i);
	}
	for (let t of [1, -1]) e.part(G(U(.03 * t, .24, .3), U(.045 * t, .13, .31), .012, .002, 4), `fang${t}`, i);
}
function Ed(e = {}) {
	let t = new ud(e.seed || 23), n = new P(e.body || "#241d1a"), r = new P(e.band || "#5e4b3a"), i = new P(e.mark || "#b8ab8e"), a = n.clone().lerp(r, .4), o = t.bone("root", null, U(0, .28, 0)), s = t.bone("ceph", o, U(0, .29, .1));
	t.bone("abdomen", o, U(0, .31, -.08));
	for (let e of [1, -1]) t.bone(`fang${e}`, s, U(.035 * e, .25, .27)), t.bone(`palp${e}`, s, U(.06 * e, .27, .24));
	let c = !!e.queen, l = [
		[38, c ? 1.4 : 1.15],
		[72, 1],
		[108, .95],
		[142, 1.1]
	], u = [];
	for (let e of [1, -1]) l.forEach(([n, i], o) => {
		let c = n * Math.PI / 180, l = U(Math.sin(c) * e, 0, Math.cos(c)), d = U(0, .29, .1).add(l.clone().multiplyScalar(.085)), f = d.clone().add(l.clone().multiplyScalar(.25 * i)).add(U(0, .19 * i, 0)), p = f.clone().add(l.clone().multiplyScalar(.27 * i)).add(U(0, -.3 * i, 0)), m = p.clone().add(l.clone().multiplyScalar(.13 * i));
		m.y = .005;
		let h = t.bone(`leg${e}${o}a`, s, d), g = t.bone(`leg${e}${o}b`, h, f);
		t.bone(`leg${e}${o}c`, g, p), u.push({
			s: e,
			i: o,
			d: l,
			k: l.clone().cross(ld).normalize(),
			name: `leg${e}${o}`
		}), t.part(G(d, f, .03 * i, .025 * i), `leg${e}${o}a`, a), t.part(W(f, [
			.03 * i,
			.03 * i,
			.03 * i
		], [6, 4]), `leg${e}${o}b`, r), t.part(G(f, p, .024 * i, .017 * i), `leg${e}${o}b`, a), t.part(W(p, [
			.02 * i,
			.02 * i,
			.02 * i
		], [6, 4]), `leg${e}${o}c`, r), t.part(G(p, m, .016 * i, .005), `leg${e}${o}c`, a);
	});
	t.part(W(U(0, .3, .1), [
		.115,
		.07,
		.135
	]), "ceph", n), t.part(W(U(0, .315, .225), [
		.07,
		.055,
		.055
	]), "ceph", n), c ? Td(t, {
		dark: n,
		band: r,
		mark: i
	}) : (t.part(W(U(0, .36, -.29), [
		.19,
		.165,
		.25
	], [12, 9], -.25), "abdomen", (e, t) => t.y > .55 && Math.abs(e.x) < .012 + .03 * Math.max(0, Math.sin((e.z + .29) * 22)) ? i : n), t.part(G(U(0, .27, -.5), U(0, .24, -.54), .03, .012), "abdomen", r));
	for (let e of [1, -1]) {
		t.part(G(U(.035 * e, .27, .26), U(.032 * e, .22, .3), .022, .016), `fang${e}`, n), t.part(G(U(.032 * e, .22, .3), U(.025 * e, .17, .29), .013, .003), `fang${e}`, new P("#1a1012")), t.part(G(U(.06 * e, .27, .24), U(.075 * e, .24, .33), .012, .009), `palp${e}`, r), t.part(G(U(.075 * e, .24, .33), U(.07 * e, .19, .36), .009, .006), `palp${e}`, n);
		for (let [n, r, i, a] of [
			[
				.018,
				.335,
				.272,
				.014
			],
			[
				.045,
				.34,
				.258,
				.01
			],
			[
				.03,
				.358,
				.25,
				.009
			],
			[
				.055,
				.322,
				.252,
				.008
			]
		]) t.part(W(U(n * e, r, i), [
			a,
			a,
			a
		], [6, 4]), "ceph", new P("#e8ff90"), !0);
	}
	let d = t.mesh(e.eyes || "#b8e060", e.queen ? 1.25 : 1.6), f = (e, t, n, r = 0) => ({
		[`${e.name}a`]: hd(ld, -e.s * t).multiply(hd(e.k, n)),
		[`${e.name}b`]: hd(e.k, -r),
		[`${e.name}c`]: hd(e.k, -r * .6)
	}), p = (e, t = 1) => {
		let n = {};
		for (let r of u) {
			let i = (r.i + (r.s > 0 ? 0 : 1)) % 2 * .5, a = J(e + i), o = Math.max(0, xd(e + i));
			n = {
				...n,
				...f(r, .28 * t * a, .32 * t * o, .25 * t * o)
			};
		}
		return n;
	}, m = (e) => ({
		fang1: K(-.6 * e, 0, .35 * e),
		"fang-1": K(-.6 * e, 0, -.35 * e)
	}), h = (e) => ({
		palp1: K(.3 * J(e * 3), 0, 0),
		"palp-1": K(.3 * J(e * 3 + .5), 0, 0)
	}), g = (e, t = 0) => Object.assign({}, ...u.filter((e) => e.i === 0).map((n) => f(n, .25 * e, (.9 + t) * e, -.4 * e)));
	return {
		root: d,
		clips: [
			q(t, "Idle", c ? 5 : 4, (e) => {
				let t = [
					[
						0,
						1,
						.06
					],
					[
						1,
						-1,
						.2
					],
					[
						0,
						-1,
						.34
					],
					[
						2,
						1,
						.48
					],
					[
						1,
						1,
						.6
					],
					[
						3,
						-1,
						.72
					],
					[
						2,
						-1,
						.82
					],
					[
						3,
						1,
						.9
					]
				], n = { ...p(0, 0) };
				for (let r of u) {
					let i = t.find(([e, t]) => e === r.i && t === r.s), a = Y(i[2], i[2] + .04, i[2] + .1, e), o = r.i === 0 ? 1 : .45, s = c && r.i === 0 ? .55 + .15 * J(e * 3 + r.s * .25) : 0;
					n = {
						...n,
						...f(r, .12 * a * o + (c && r.i === 0 ? .2 : 0) + .04 * J(e + r.s * .25), (.35 * a + .08 * a * J(e * 20)) * o + s, .25 * a - (s ? .3 : 0))
					};
				}
				let r = J(e * (c ? 4 : 5)), i = Y(.42, .48, .58, e);
				return {
					q: {
						...n,
						...h(e * 4),
						...m(.15 + .5 * i * (.6 + .4 * J(e * 24))),
						abdomen: K(.05 * r, .04 * J(e), 0),
						root: K(.02 * J(e * 2), .07 * J(e), .015 * J(e))
					},
					p: { root: U(0, .005 * r, 0) },
					s: { abdomen: U(1 + (c ? .04 : .025) * r, 1 + (c ? .05 : .03) * r, 1 + (c ? .03 : .02) * r) }
				};
			}),
			q(t, "Walk", .55, (e) => ({
				q: {
					...p(e),
					...h(e),
					abdomen: K(.05 * J(e * 2), .06 * J(e), 0)
				},
				p: { root: U(.008 * J(e), .01 * Math.abs(J(e * 2)), 0) }
			})),
			q(t, "Attack", .7, (e) => {
				let t = Y(0, .3, .55, e), n = Y(.35, .5, .85, e);
				return {
					q: {
						...p(0, 0),
						...g(t - .3 * n),
						...m(t * .8 + n),
						root: K(-.45 * t + .25 * n, 0, 0)
					},
					p: { root: U(0, .05 * t, .12 * n) }
				};
			}),
			q(t, "Attack2", .5, (e) => {
				let t = Y(.1, .35, .8, e);
				return {
					q: {
						...p(e * .5, .4),
						...m(t * 1.2),
						root: K(.12 * t, 0, 0)
					},
					p: { root: U(0, -.02 * t, .09 * t) }
				};
			}),
			q(t, "Heavy", 1, (e) => {
				let t = Y(0, .25, .4, e), n = Y(.3, .55, .85, e);
				return {
					q: {
						...p(0, 0),
						...Object.assign({}, ...u.map((e) => f(e, (e.i < 2 ? .3 : -.25) * n, -.25 * t + .4 * n, .4 * t))),
						...g(n, .3),
						...m(n),
						root: K(-.3 * n, 0, 0)
					},
					p: { root: U(0, -.06 * t + .18 * n, .4 * Sd(.3, .85, e)) }
				};
			}),
			q(t, "Hit", .45, (e) => {
				let t = Y(0, .2, 1, e);
				return {
					q: {
						...Object.assign({}, ...u.map((e) => f(e, 0, .3 * t, .2 * t))),
						root: K(-.2 * t, .15 * t, 0),
						...m(.6 * t)
					},
					p: { root: U(0, .02 * t, -.06 * t) }
				};
			}),
			q(t, "Death", 1.2, (e) => {
				let t = Sd(0, .7, e);
				return {
					q: {
						...Object.assign({}, ...u.map((e) => f(e, 0, .7 * t, 1.9 * t))),
						...m(.4 * t),
						abdomen: K(.25 * t, 0, 0)
					},
					p: { root: U(0, -.16 * t, 0) }
				};
			}),
			q(t, "Cast", .8, (e) => {
				let t = Y(0, .35, .6, e), n = Y(.45, .55, .8, e);
				return {
					q: {
						...p(0, 0),
						...g(t * .7),
						...m(.4 + n),
						root: K(-.35 * t + .15 * n, 0, 0),
						abdomen: K(.5 * t, 0, 0)
					},
					p: { root: U(0, .04 * t, .04 * n) }
				};
			})
		]
	};
}
function Dd(e = {}) {
	let t = new ud(e.seed || 31), n = new P(e.shell || "#5e0e10"), r = new P(e.shellHi || "#8c1e1c"), i = new P("#3a0b07"), a = new P("#160a08"), o = new P(e.body || "#2a1510"), s = new P("#5a2a1c"), c = new P("#1b110d"), l = new P("#4e2c1e"), u = new P("#ffb050"), d = (e, t) => e.z < -.27 ? a : t.y > .8 ? r : t.y > .45 ? n : t.y < .05 ? i : yd(i, n, t.y * 2.2), f = (e, t) => t.y > .7 ? s : o;
	t.bone("root", null, U(0, .16, 0));
	let p = t.by.get("root");
	t.bone("thorax", p, U(0, .18, .15)), t.bone("head", t.by.get("thorax"), U(0, .16, .27)), t.bone("abdomen", p, U(0, .17, -.04));
	for (let e of [1, -1]) t.bone(`elytra${e}`, t.by.get("abdomen"), U(.02 * e, .29, .1)), t.bone(`mand${e}`, t.by.get("head"), U(.04 * e, .13, .33)), t.bone(`ant${e}`, t.by.get("head"), U(.045 * e, .19, .32));
	t.part(W(U(0, .15, -.08), [
		.15,
		.085,
		.24
	], [10, 7]), "abdomen", o);
	for (let e = 0; e < 4; e++) t.part(W(U(0, .228, -0 - e * .075), [
		.11 - e * .017,
		.012,
		.024
	], [8, 4]), "abdomen", u, !0);
	t.part(W(U(0, .12, -.31), [
		.03,
		.026,
		.026
	], [6, 4]), "abdomen", u, !0);
	for (let e of [1, -1]) {
		t.part(W(U(.05 * e, .17, -.07), [
			.12,
			.165,
			.265
		], [14, 10]), `elytra${e}`, d), t.part(G(U(.004 * e, .335, .1), U(.004 * e, .26, -.3), .008, .005, 4), `elytra${e}`, a);
		for (let n = 0; n < 2; n++) t.part(G(U((.045 + n * .04) * e, .32 - n * .035, .08), U((.05 + n * .045) * e, .27 - n * .05, -.24), .005, .004, 3), `elytra${e}`, i);
	}
	t.part(W(U(0, .205, .16), [
		.13,
		.085,
		.1
	], [12, 8]), "thorax", f), t.part(G(U(0, .29, .21), U(0, .28, .1), .012, .01, 4), "thorax", s), t.part(W(U(0, .165, .27), [
		.085,
		.062,
		.075
	], [10, 7]), "head", f);
	for (let e of [1, -1]) t.part(W(U(.046 * e, .215, .262), [
		.026,
		.022,
		.026
	], [8, 6]), "head", u, !0), t.part(W(U(.07 * e, .17, .3), [
		.02,
		.022,
		.018
	], [6, 4]), "head", new P("#0b0707")), t.part(G(U(.04 * e, .13, .33), U(.09 * e, .12, .4), .022, .015, 5), `mand${e}`, o), t.part(G(U(.09 * e, .12, .4), U(.03 * e, .115, .47), .015, .003, 5), `mand${e}`, a), t.part(G(U(.075 * e, .12, .42), U(.06 * e, .12, .425), .006, .001, 3), `mand${e}`, a), t.part(G(U(.045 * e, .19, .32), U(.095 * e, .27, .37), .007, .006, 4), `ant${e}`, c), t.part(G(U(.095 * e, .27, .37), U(.135 * e, .285, .43), .006, .005, 4), `ant${e}`, c), t.part(W(U(.14 * e, .288, .44), [
		.018,
		.012,
		.022
	], [6, 4]), `ant${e}`, l);
	let m = [];
	[
		[
			.15,
			35,
			.9
		],
		[
			.05,
			85,
			1
		],
		[
			-.06,
			135,
			1.12
		]
	].forEach(([e, n, r], i) => {
		for (let a of [1, -1]) {
			let o = n * Math.PI / 180, s = U(Math.sin(o) * a, 0, Math.cos(o)), u = U(.075 * a, .1, e), d = u.clone().add(s.clone().multiplyScalar(.13 * r)).add(U(0, .05, 0)), f = d.clone().add(s.clone().multiplyScalar(.15 * r));
			f.y = .025;
			let p = f.clone().add(s.clone().multiplyScalar(.07 * r));
			p.y = .004;
			let h = t.bone(`leg${a}${i}a`, t.by.get("root"), u), g = t.bone(`leg${a}${i}b`, h, d);
			t.bone(`leg${a}${i}c`, g, f), m.push({
				s: a,
				i,
				k: s.clone().cross(ld).normalize(),
				name: `leg${a}${i}`
			}), t.part(G(u, d, .034, .026), `leg${a}${i}a`, c), t.part(W(d, [
				.025,
				.025,
				.025
			], [6, 4]), `leg${a}${i}b`, l), t.part(G(d, f, .019, .012), `leg${a}${i}b`, c);
			for (let e of [.35, .7]) {
				let n = d.clone().lerp(f, e);
				t.part(G(n, n.clone().add(s.clone().multiplyScalar(.035)).add(U(0, .01, 0)), .006, .001, 3), `leg${a}${i}b`, l);
			}
			t.part(G(f, p, .01, .004), `leg${a}${i}c`, c);
		}
	});
	let h = t.mesh(e.glow || "#ff6a14", 1.4), g = (e, t, n, r = 0) => ({
		[`${e.name}a`]: hd(ld, -e.s * t).multiply(hd(e.k, n)),
		[`${e.name}b`]: hd(e.k, -r),
		[`${e.name}c`]: hd(e.k, -r * .5)
	}), _ = (e, t = 1) => {
		let n = {};
		for (let r of m) {
			let i = (r.i + (r.s > 0 ? 0 : 1)) % 2 * .5, a = J(e + i), o = Math.max(0, xd(e + i));
			n = {
				...n,
				...g(r, .32 * t * a, .35 * t * o, .2 * t * o)
			};
		}
		return n;
	}, v = (e) => ({
		mand1: K(0, .55 * e, 0),
		"mand-1": K(0, -.55 * e, 0)
	}), y = (e, t = 0) => ({
		elytra1: K(0, .3 * t, 1.05 * e),
		"elytra-1": K(0, -.3 * t, -1.05 * e)
	}), b = (e, t = 1) => ({
		ant1: K(.25 * t * J(e * 2), .3 * t * J(e), 0),
		"ant-1": K(.25 * t * J(e * 2 + .3), -.3 * t * J(e + .2), 0)
	});
	return {
		root: h,
		clips: [
			q(t, "Idle", 4, (e) => {
				let t = [
					[
						0,
						1,
						.08
					],
					[
						2,
						-1,
						.2
					],
					[
						1,
						1,
						.3
					],
					[
						0,
						-1,
						.44
					],
					[
						2,
						1,
						.82
					],
					[
						1,
						-1,
						.9
					]
				], n = { ..._(0, 0) };
				for (let r of m) {
					let i = t.find(([e, t]) => e === r.i && t === r.s), a = Y(i[2], i[2] + .035, i[2] + .08, e);
					n = {
						...n,
						...g(r, .15 * a * J(i[2] * 7), .3 * a, .2 * a)
					};
				}
				let r = Y(.14, .17, .2, e) + Y(.22, .25, .28, e), i = Y(.58, .64, .76, e), a = Y(.32, .4, .56, e), o = 1 - .8 * a;
				return {
					q: {
						...n,
						...b(e * 4, o),
						...v(.15 + .7 * r),
						head: K(.04 * J(e * 2), .3 * a * J((e - .32) * 1.6), .08 * a),
						thorax: K(-.04 * i, 0, 0),
						...y(.03 * Math.max(0, J(e * 5)) + i * (.42 + .08 * J(e * 40)), .2 * i),
						abdomen: K(-.06 * i, 0, 0),
						root: K(.015 * J(e * 2), .03 * J(e), 0)
					},
					p: { root: U(0, .004 * J(e * 5) + .008 * i, 0) }
				};
			}),
			q(t, "Walk", .42, (e) => ({
				q: {
					..._(e),
					...b(e * 2, .6),
					abdomen: K(0, .05 * J(e), 0),
					head: K(0, -.05 * J(e), 0)
				},
				p: { root: U(.006 * J(e), .008 * Math.abs(J(e * 2)), 0) }
			})),
			q(t, "Attack", .6, (e) => {
				let t = Y(0, .25, .45, e), n = Y(.3, .45, .8, e);
				return {
					q: {
						..._(0, 0),
						...v(1 * t - .25 * n),
						...b(e, .4),
						root: K(-.12 * t + .12 * n, 0, 0),
						head: K(-.2 * t + .25 * n, 0, 0)
					},
					p: { root: U(0, .015 * t, -.03 * t + .12 * n) }
				};
			}),
			q(t, "Attack2", .55, (e) => {
				let t = Y(0, .3, .5, e), n = Y(.35, .5, .85, e);
				return {
					q: {
						..._(e * .5, .3),
						...v(.4 * t),
						root: K(.12 * t - .2 * n, .12 * n, 0),
						thorax: K(-.2 * n, 0, 0)
					},
					p: { root: U(0, .03 * n, .1 * n) }
				};
			}),
			q(t, "Heavy", .9, (e) => {
				let t = Y(0, .25, .4, e), n = Y(.3, .55, .85, e);
				return {
					q: {
						..._(e * 2, .9 * n),
						...y(.35 * (t + n), .3),
						...v(.8 * n),
						root: K(.1 * t - .15 * n, 0, 0)
					},
					p: { root: U(0, -.03 * t + .05 * n, .32 * Sd(.3, .8, e)) }
				};
			}),
			q(t, "Hit", .4, (e) => {
				let t = Y(0, .22, 1, e);
				return {
					q: {
						...Object.assign({}, ...m.map((e) => g(e, 0, .25 * t, .2 * t))),
						...y(.12 * t),
						root: K(-.15 * t, .15 * t, .06 * t),
						...b(e * 3, t)
					},
					p: { root: U(0, .02 * t, -.05 * t) }
				};
			}),
			q(t, "Death", 1.2, (e) => {
				let t = Sd(.05, .55, e), n = Sd(.3, .9, e);
				return {
					q: {
						root: K(0, 0, Math.PI * t),
						...Object.assign({}, ...m.map((r) => g(r, .15 * Math.sin(r.i * 2 + e * 30) * (1 - n) * t, .9 * n, 1.6 * n))),
						...v(.3 * n)
					},
					p: { root: U(0, .12 * Y(.05, .3, .55, e) + .15 * t, 0) }
				};
			}),
			q(t, "Cast", .9, (e) => {
				let t = Y(.05, .35, .85, e), n = Y(.45, .55, .75, e);
				return {
					q: {
						..._(0, 0),
						...y(1 * t, .5 * t),
						...v(.9 * t),
						root: K(-.22 * t + .18 * n, 0, 0),
						abdomen: K(-.25 * t, 0, 0),
						head: K(-.15 * t + .3 * n, 0, 0)
					},
					p: { root: U(0, .03 * t, .04 * n) }
				};
			})
		]
	};
}
function Od(e = {}) {
	let t = new ud(e.seed || 41), n = new P(e.skin || "#3a5022"), r = new P(e.skinHi || "#56702e"), i = new P("#203012"), a = (e, t) => t.y > .55 ? yd(n, r, (t.y - .55) * 2.2) : t.y < -.4 ? i : n, o = new P(e.rag || "#7e1c14"), s = new P("#a8321e"), c = new P("#4a100c"), l = (e, t) => t.y > .6 ? s : t.y < -.3 ? c : o, u = new P(e.leather || "#3a2618"), d = new P("#5c3e26"), f = (e, t) => t.y > .5 ? d : u, p = new P("#6a4a30"), m = new P("#4a3220"), g = new P("#e2d6a8"), _ = new P("#cfc29a"), v = new P("#1c0806"), y = new P("#141a0c"), b = new P("#6e3a2c"), x = new P("#b08a3a");
	t.bone("root", null, U(0, .3, 0)), t.bone("spine", t.by.get("root"), U(0, .37, .01)), t.bone("chest", t.by.get("spine"), U(0, .45, .03)), t.bone("neck", t.by.get("chest"), U(0, .5, .06)), t.bone("head", t.by.get("neck"), U(0, .56, .08)), t.bone("jaw", t.by.get("head"), U(0, .545, .13));
	for (let e of [1, -1]) {
		let n = t.bone(`armU${e}`, t.by.get("chest"), U(.1 * e, .475, .03)), r = t.bone(`armL${e}`, n, U(.15 * e, .36, .05));
		t.bone(`hand${e}`, r, U(.165 * e, .25, .08));
		let i = t.bone(`legU${e}`, t.by.get("root"), U(.055 * e, .29, 0)), a = t.bone(`legL${e}`, i, U(.07 * e, .17, .045));
		t.bone(`foot${e}`, a, U(.07 * e, .045, -.01));
	}
	t.part(W(U(0, .3, .005), [
		.068,
		.05,
		.058
	], [8, 6]), "root", a), t.part(W(U(0, .375, .04), [
		.07,
		.068,
		.068
	], [9, 7]), "spine", a), t.part(W(U(0, .445, .03), [
		.08,
		.06,
		.058
	], [8, 6]), "chest", a);
	for (let e of [1, -1]) t.part(G(U(.025 * e, .45, .085), U(.03 * e, .415, .088), .007, .004), "chest", i);
	t.part(G(U(0, .47, .05), U(0, .55, .085), .03, .026), "neck", a), t.part(W(U(0, .478, .025), [
		.125,
		.04,
		.088
	], [9, 6]), "chest", f), t.part(G(U(0, .49, -.04), U(0, .4, -.06), .06, .004, 4), "chest", u);
	for (let e of [1, -1]) t.part(G(U(.1 * e, .47, 0), U(.12 * e, .43, 0), .04, .006, 4), "chest", u);
	t.part(new L(.062, .03, 10, 20).rotateX(Math.PI / 2 - .25).scale(1.25, 1, 1.1).translate(0, .505, .045), "chest", l);
	let S = (e, n, r, i, a = l) => t.part(G(e, n, r, .004, 4).scale(1, 1, 1), i, a);
	for (let [e, t, n] of [
		[
			-.05,
			.1,
			.1
		],
		[
			-.01,
			.13,
			.11
		],
		[
			.035,
			.09,
			.105
		]
	]) S(U(e, .49, n), U(e * 1.2, .49 - t, n + .012), .024, "chest");
	for (let [e, t] of [
		[-.06, .1],
		[-.02, .14],
		[.03, .12],
		[.07, .09]
	]) S(U(e, .5, -.02), U(e * 1.15, .5 - t, -.06), .026, "chest");
	for (let e of [1, -1]) S(U(.11 * e, .49, .03), U(.14 * e, .43, .03), .03, "chest");
	t.part(new L(.072, .012, 6, 20).rotateX(Math.PI / 2).scale(1, 1, 1.05).translate(0, .325, .025), "root", f), t.part(new I(.034, .03, .014).translate(0, .325, .104), "root", x), t.part(new I(.018, .014, .016).translate(0, .325, .106), "root", u);
	for (let [e, n, r] of [
		[
			.07,
			.05,
			1
		],
		[
			-.075,
			.03,
			.9
		],
		[
			.04,
			-.06,
			.8
		]
	]) t.part(W(U(e, .3, n), [
		.026 * r,
		.03 * r,
		.022 * r
	], [7, 5]), "root", f), t.part(W(U(e, .322, n), [
		.024 * r,
		.008,
		.02 * r
	], [7, 3]), "root", u);
	let C = (e, n) => {
		let r = new h(new ce([
			[-.045, 0],
			[.045, 0],
			[.04, -.07],
			[.022, -.085],
			[.012, -.11],
			[-.004, -.09],
			[-.022, -.115],
			[-.035, -.08],
			[-.045, -.075]
		].map(([e, t]) => new Oe(e, t))), {
			depth: .008,
			bevelEnabled: !1
		});
		r.translate(0, 0, -.004).rotateX(.15 * n).translate(0, .32, e), t.part(r, "root", l);
	};
	C(.085, -1), C(-.06, 1), t.part(W(U(0, .625, .07), [
		.112,
		.102,
		.108
	]), "head", a), t.part(W(U(0, .58, .125), [
		.088,
		.058,
		.07
	], [9, 7]), "head", a);
	for (let e of [1, -1]) t.part(W(U(.058 * e, .57, .155), [
		.03,
		.026,
		.026
	], [8, 6]), "head", a);
	for (let e of [1, -1]) t.part(W(U(0, 0, 0), [
		.042,
		.019,
		.03
	], [8, 6]).rotateZ(-.38 * e).translate(.038 * e, .632, .168), "head", a);
	t.part(G(U(0, .625, .19), U(0, .58, .235), .022, .02), "head", a), t.part(W(U(0, .575, .232), [
		.024,
		.022,
		.022
	], [8, 6]), "head", a);
	for (let e of [1, -1]) t.part(W(U(.04 * e, .608, .178), [
		.022,
		.016,
		.012
	], [6, 4]), "head", y), t.part(W(U(.04 * e, .608, .186), [
		.011,
		.009,
		.006
	], [6, 4]), "head", new P("#ff3a20"), !0);
	let w = (e) => .195 - 1.6 * e * e;
	t.part(W(U(0, .548, .172), [
		.07,
		.016,
		.032
	], [9, 4]), "head", v);
	for (let e = -4; e <= 4; e++) {
		let n = e * .0145;
		t.part(G(U(n, .556, w(n)), U(n, .538, w(n) + .003), .0065, .001, 4), "head", g);
	}
	for (let e = -3; e <= 3; e++) {
		let n = e * .016 + .007;
		t.part(G(U(n, .534, w(n) - .004), U(n, .55, w(n)), .006, .001, 4), "jaw", g);
	}
	t.part(W(U(0, .527, .14), [
		.07,
		.028,
		.058
	], [8, 6]), "jaw", a);
	let T = [
		[0, -.04],
		[.05, -.05],
		[.07, -.036],
		[.095, -.048],
		[.13, -.034],
		[.145, -.022],
		[.175, -.024],
		[.215, .002],
		[.25, .03],
		[.2, .034],
		[.15, .042],
		[.09, .05],
		[.03, .05],
		[0, .04]
	], E = 1.25, D = (e, t) => e.rotateZ(.5 * t).rotateY(.45 * t).translate(.085 * t, .635, .05);
	for (let e of [1, -1]) {
		let n = (t, n) => new h(new ce(T.map(([n, r]) => new Oe(n * t * e * E, r * t * E))), {
			depth: .012,
			bevelEnabled: !1
		}).translate(0, 0, n);
		t.part(D(n(1, -.006), e), "head", a), t.part(D(n(.78, .004).translate(.02 * e, .002, 0), e), "head", b);
		for (let [n, r] of e > 0 ? [[.07, -.046], [.12, -.04]] : [[.1, -.046]]) t.part(D(new L(.016, .004, 4, 10).rotateY(Math.PI / 2).translate(n * e * E, r * E, 0), e), "head", x);
	}
	for (let e of [1, -1]) {
		t.part(W(U(.1 * e, .47, .03), [
			.03,
			.028,
			.03
		], [7, 5]), `armU${e}`, a), t.part(G(U(.1 * e, .475, .03), U(.15 * e, .36, .05), .022, .017), `armU${e}`, a), t.part(W(U(.15 * e, .36, .05), [
			.02,
			.02,
			.02
		], [6, 4]), `armL${e}`, a), t.part(G(U(.15 * e, .36, .05), U(.165 * e, .25, .08), .018, .016), `armL${e}`, a);
		for (let [n, r] of [
			[.3, .021],
			[.282, .022],
			[.264, .021]
		]) t.part(G(U(.158 * e, n + .008, .066), U(.16 * e, n - .008, .07), r, r, 7), `armL${e}`, (e, t) => t.y > .2 ? p : m);
		let n = U(.168 * e, .226, .09);
		t.part(W(n, [
			.034,
			.028,
			.038
		], [8, 6]), `hand${e}`, a);
		for (let r = 0; r < 4; r++) {
			let i = (r - 1.5) * .22, o = U(Math.sin(i) * .5 * e, -.55, .65).normalize(), s = U(Math.sin(i) * .4 * e, -.95, .15).normalize(), c = n.clone().add(U((r - 1.5) * .015 * e, -.008, .026)), l = c.clone().add(o.clone().multiplyScalar(.034 - Math.abs(r - 1.5) * .004)), u = l.clone().add(s.clone().multiplyScalar(.026));
			t.part(G(c, l, .0105, .009, 4), `hand${e}`, a), t.part(W(l, [
				.0095,
				.0095,
				.0095
			], [5, 4]), `hand${e}`, a), t.part(G(l, u, .009, .0065, 4), `hand${e}`, a), t.part(G(u, u.clone().add(U(0, -.012, -.008)), .0065, 8e-4, 4), `hand${e}`, _);
		}
		{
			let r = n.clone().add(U(-.022 * e, -.004, .018)), i = r.clone().add(U(-.016 * e, -.022, .026));
			t.part(G(r, i, .01, .008, 4), `hand${e}`, a), t.part(G(i, i.clone().add(U(-.002 * e, -.012, .004)), .006, 8e-4, 4), `hand${e}`, _);
		}
		t.part(G(U(.055 * e, .29, 0), U(.07 * e, .17, .045), .027, .02), `legU${e}`, a), t.part(W(U(.07 * e, .17, .045), [
			.024,
			.024,
			.024
		], [6, 4]), `legL${e}`, a), t.part(G(U(.07 * e, .17, .045), U(.07 * e, .045, -.01), .02, .016), `legL${e}`, a);
		for (let [n, r] of [
			[.14, .023],
			[.12, .024],
			[.1, .023],
			[.08, .021]
		]) {
			let i = (.17 - n) / .125;
			t.part(G(U(.07 * e, n + .009, .045 - .055 * i), U(.07 * e, n - .009, .045 - .055 * (i + .07)), r, r, 7), `legL${e}`, (e, t) => t.y > .2 ? p : m);
		}
		t.part(W(U(.07 * e, .026, .04), [
			.036,
			.02,
			.068
		], [8, 6]), `foot${e}`, a), t.part(W(U(.07 * e, .035, -.02), [
			.022,
			.022,
			.026
		], [6, 4]), `foot${e}`, a);
		for (let n = 0; n < 4; n++) {
			let r = (.07 + (n - 1.5) * .017) * e, i = U(r, .016, .09), o = U(r * 1.06, .01, .132 - Math.abs(n - 1.2) * .007);
			t.part(G(i, o, .011, .008, 4), `foot${e}`, a), t.part(G(o, o.clone().add(U(0, -.005, .014)), .007, .001, 4), `foot${e}`, _);
		}
	}
	e.foreman && jd(t, e);
	{
		let e = [t.bones.indexOf(t.by.get("head")), t.bones.indexOf(t.by.get("jaw"))], n = U(0, .59, .1), r = 1.12;
		for (let i of t.parts) e.includes(i.bone) && i.geo.translate(-n.x, -n.y, -n.z).scale(r, r, r).translate(n.x, n.y, n.z);
		let i = t.by.get("jaw");
		i.userData.at.sub(n).multiplyScalar(r).add(n), i.position.copy(i.userData.at).sub(t.by.get("head").userData.at);
	}
	let ee = t.mesh(e.eyes || "#ff3a20", 1.5), O = (e = 1) => ({
		legU1: K(-.35 * e, 0, .05),
		"legU-1": K(-.35 * e, 0, -.05),
		legL1: K(.6 * e, 0, 0),
		"legL-1": K(.6 * e, 0, 0)
	}), te = {
		armU1: K(-.45, 0, .18),
		armL1: K(-.55, 0, 0),
		"armU-1": K(-.45, 0, -.18),
		"armL-1": K(-.55, 0, 0),
		hand1: K(.3, 0, 0),
		"hand-1": K(.3, 0, 0)
	}, k = (e, t = 1) => {
		let n = {};
		for (let r of [1, -1]) {
			let i = r > 0 ? 0 : .5, a = J(e + i), o = Math.max(0, -xd(e + i));
			n[`legU${r}`] = K(-.35 - .6 * t * a, 0, .05 * r), n[`legL${r}`] = K(.55 + 1 * t * o, 0, 0), n[`foot${r}`] = K(-.3 * t * o, 0, 0), n[`armU${r}`] = K(-.35 + .6 * t * a, 0, .15 * r), n[`armL${r}`] = K(-.7, 0, 0);
		}
		return n;
	};
	return {
		root: ee,
		clips: [
			q(t, "Idle", 1.8, (e) => {
				let t = Math.max(-1, Math.min(1, 2.2 * J(e)));
				return {
					q: {
						...O(),
						...te,
						spine: K(.25 + .03 * J(e * 2), 0, 0),
						chest: K(.05 * J(e * 2), 0, 0),
						head: K(-.2, .45 * t, .06 * t),
						jaw: K(.12 * Math.max(0, J(e * 3)), 0, 0),
						hand1: K(.3 + .2 * J(e * 4), 0, 0),
						"hand-1": K(.3 + .2 * J(e * 4 + .3), 0, 0)
					},
					p: { root: U(0, -.035 + .006 * J(e * 2), 0) }
				};
			}),
			q(t, "Walk", .5, (e) => ({
				q: {
					...k(e),
					spine: K(.4, .12 * J(e), 0),
					head: K(-.35 + .08 * J(e * 2), -.12 * J(e), 0),
					root: K(0, -.15 * J(e), 0)
				},
				p: { root: U(0, -.04 + .025 * Math.abs(J(e)), 0) }
			})),
			q(t, "Attack", .6, (e) => {
				let t = Y(0, .3, .42, e), n = Y(.36, .48, .85, e);
				return {
					q: {
						...O(1 + .3 * n),
						...te,
						spine: K(.2 - .25 * t + .45 * n, .35 * t - .35 * n, 0),
						"armU-1": K(-.45 - 2.1 * t + 1.6 * n, 0, -.18 - .3 * t + .3 * n),
						"armL-1": K(-.55 - .4 * t + .5 * n, 0, 0),
						"hand-1": K(-.4 * t + .6 * n, 0, 0),
						head: K(-.2 + .25 * n, 0, 0),
						jaw: K(.4 * t, 0, 0)
					},
					p: { root: U(0, -.035 - .02 * n, .06 * n) }
				};
			}),
			q(t, "Attack2", .5, (e) => {
				let t = Y(0, .25, .38, e), n = Y(.32, .42, .8, e);
				return {
					q: {
						...O(1 + .4 * n),
						...te,
						spine: K(.25 + .3 * n, .3 * t - .3 * n, 0),
						armU1: K(-.45 + .4 * t - 1.2 * n, -.3 * n, .18),
						armL1: K(-1.3 * t - .1 * n, 0, 0),
						jaw: K(.3 * n, 0, 0)
					},
					p: { root: U(0, -.04, -.03 * t + .12 * n) }
				};
			}),
			q(t, "Heavy", .9, (e) => {
				let t = Y(0, .22, .32, e), n = Y(.25, .45, .62, e), r = Y(.55, .65, .95, e);
				return {
					q: {
						...O(1 + .8 * t - .6 * n + .5 * r),
						spine: K(.3 * t - .3 * n + .6 * r, 0, 0),
						armU1: K(-.45 - 2.4 * n + 1.8 * r, 0, .3),
						"armU-1": K(-.45 - 2.4 * n + 1.8 * r, 0, -.3),
						armL1: K(-.5 - .3 * n, 0, 0),
						"armL-1": K(-.5 - .3 * n, 0, 0),
						jaw: K(.5 * n, 0, 0),
						head: K(-.3 * n + .2 * r, 0, 0)
					},
					p: { root: U(0, -.035 - .05 * t + .16 * n - .03 * r, .3 * Sd(.25, .65, e)) }
				};
			}),
			q(t, "Hit", .4, (e) => {
				let t = Y(0, .2, 1, e);
				return {
					q: {
						...O(),
						...te,
						spine: K(.2 - .35 * t, .15 * t, 0),
						head: K(-.2 - .4 * t, -.3 * t, 0),
						jaw: K(.3 * t, 0, 0)
					},
					p: { root: U(0, -.035, -.05 * t) }
				};
			}),
			q(t, "Death", 1.1, (e) => {
				let t = Sd(0, .65, e);
				return {
					q: {
						...O(1 - .5 * t),
						root: K(-1.45 * t, 0, .1 * t),
						spine: K(.2 - .3 * t, 0, 0),
						head: K(-.3 - .5 * t, .4 * t, 0),
						jaw: K(.5 * t, 0, 0),
						armU1: K(-.3 - 1.2 * t, 0, .7 * t),
						"armU-1": K(-.5 - 1.4 * t, 0, -.6 * t),
						armL1: K(-.3, 0, 0),
						"armL-1": K(-.4, 0, 0)
					},
					p: { root: U(0, -.035 - .18 * t, -.12 * t) }
				};
			}),
			q(t, "Cast", .9, (e) => {
				let t = Y(.05, .3, .85, e), n = Math.max(0, J(e * 4));
				return {
					q: {
						...O(1 - .3 * t),
						...te,
						spine: K(.2 - .3 * t, 0, 0),
						head: K(-.2 - .5 * t, .1 * J(e * 2), 0),
						jaw: K(.6 * t * (.5 + .5 * n), 0, 0),
						"armU-1": K(-.45 - 2.2 * t, 0, -.18 - .4 * t),
						armU1: K(-.45 - 2.2 * t, 0, .18 + .4 * t),
						armL1: K(-.55 + .3 * t, 0, 0),
						"armL-1": K(-.55 + .3 * t, 0, 0)
					},
					p: { root: U(0, -.035 + .04 * t * n, 0) }
				};
			})
		]
	};
}
function kd(e = {}) {
	let t = new ud(e.seed || 71), n = new P(e.hide || "#3a3430"), r = new P(e.hideHi || "#6a625a"), i = new P("#161210"), a = (e, t) => t.y > .6 ? yd(n, r, (t.y - .6) * 2.5) : t.y < -.3 ? i : n, o = new P("#ffb060"), s = new P("#ff8a3a"), c = new P("#d8cdb4"), l = new P("#1a1614"), u = t.bone("root", null, U(0, .5, 0)), d = t.bone("pelvis", u, U(0, .52, -.28)), f = t.bone("chest", u, U(0, .54, .22)), p = t.bone("neck", f, U(0, .6, .36)), m = t.bone("head", p, U(0, .72, .46));
	t.bone("jaw", m, U(0, .67, .52));
	let h = d, g = [
		U(0, .56, -.44),
		U(0, .58, -.58),
		U(0, .56, -.72)
	];
	g.forEach((e, n) => {
		h = t.bone(`tail${n + 1}`, h, e);
	});
	for (let e of [1, -1]) {
		let n = t.bone(`armU${e}`, f, U(.11 * e, .5, .26)), r = t.bone(`armL${e}`, n, U(.11 * e, .27, .24));
		t.bone(`paw${e}`, r, U(.11 * e, .04, .27));
		let i = t.bone(`legU${e}`, d, U(.12 * e, .5, -.3)), a = t.bone(`legL${e}`, i, U(.12 * e, .3, -.24));
		t.bone(`foot${e}`, a, U(.12 * e, .1, -.38));
	}
	let _ = (e) => .52 + .03 * Math.max(0, e) - .02 * Math.max(0, -e - .1), y = [
		[-.4, 0],
		[-.38, .07],
		[-.32, .11],
		[-.2, .115],
		[-.06, .1],
		[.08, .13],
		[.2, .15],
		[.3, .13],
		[.36, .08],
		[.39, 0]
	], b = (e, t) => {
		for (let n = 0; n < t.length - 1; n++) {
			let [r, i] = t[n], [a, o] = t[n + 1];
			if (e <= a) {
				let t = Math.max(0, Math.min(1, (e - r) / (a - r)));
				return t < .5 ? [[i, 1 - t], [o, t]] : [[o, t], [i, 1 - t]];
			}
		}
		return [[t[t.length - 1][1], 1]];
	}, x = t.skin((e) => b(e.z, [
		[-.3, "pelvis"],
		[-.12, "pelvis"],
		[0, "root"],
		[.1, "root"],
		[.2, "chest"],
		[.32, "chest"]
	]));
	t.part(_d(y, 24, _, 1.25), x, a);
	for (let e = 0; e < 14; e++) {
		let n = gd(e, 3, 1, 9), r = gd(e, 5, 2, 9), a = -.3 + n * .58, o = e % 2 ? 1 : -1, s = .5 + .7 * r, c = .12 + .03 * (a > 0);
		t.part(new v(.035 + .015 * r, 0).scale(1.3, .5, 1).rotateZ(-s * o).translate(Math.sin(s) * c * o, _(a) + Math.cos(s) * c * 1.2, a), x, i);
	}
	for (let e = 0; e < 7; e++) {
		let n = .3 - e * .075, r = gd(e, 7, 3, 9), a = (.13 - e * .012) * (.85 + .3 * r), s = U((r - .5) * .03, _(n) + .145 + (n > .1 ? .03 : 0), n), c = s.clone().add(U((r - .5) * .04, a, -a * .55));
		t.part(G(s, c, .03, .004, 5), n > .2 ? "chest" : x, i), t.part(G(s.clone().lerp(c, .7), c, .011, .002, 4), n > .2 ? "chest" : x, o, !0);
	}
	let S = (e, n, r) => t.part(G(e, n, .012, .009, 4), r, o, !0);
	for (let e of [1, -1]) S(U(.15 * e, .6, .22), U(.155 * e, .48, .17), x), S(U(.155 * e, .48, .17), U(.14 * e, .42, .24), x), S(U(.14 * e, .6, .06), U(.13 * e, .47, 0), x), S(U(.11 * e, .58, -.22), U(.115 * e, .46, -.3), x), S(U(.115 * e, .46, -.3), U(.1 * e, .4, -.24), x), S(U(.15 * e, .56, .12), U(.14 * e, .5, .06), x), S(U(.12 * e, .6, -.1), U(.125 * e, .52, -.14), x), S(U(.11 * e, .4, .24), U(.11 * e, .3, .24), `armU${e}`), S(U(.12 * e, .42, -.26), U(.12 * e, .34, -.25), `legU${e}`);
	for (let e = 0; e < 5; e++) S(U(.02 * (e % 2 ? 1 : -1), _(-.25 + e * .13) + .115 + (e > 2 ? .03 : 0), -.25 + e * .13), U(-.02 * (e % 2 ? 1 : -1), _(-.2 + e * .13) + .115 + (e > 2 ? .03 : 0), -.2 + e * .13), x);
	t.part(G(U(0, .58, .3), U(0, .7, .44), .075, .06, 8), "neck", a), t.part(W(U(0, .735, .47), [
		.075,
		.07,
		.085
	], [10, 8]), "head", a), t.part(G(U(0, .73, .5), U(0, .69, .66), .055, .03, 8), "head", a), t.part(W(U(0, .695, .665), [
		.022,
		.018,
		.016
	], [6, 4]), "head", l), t.part(W(U(0, .675, .56), [
		.035,
		.02,
		.07
	], [8, 5]), "head", s, !0);
	for (let e of [1, -1]) t.part(W(U(.045 * e, .755, .53), [
		.018,
		.008,
		.012
	], [6, 4]), "head", o, !0), t.part(new R(.035, .12, 5).rotateX(-1.1).rotateZ(-.3 * e).translate(.05 * e, .8, .42), "head", a), t.part(G(U(.03 * e, .68, .62), U(.03 * e, .655, .625), .008, .002, 3), "head", c), S(U(.06 * e, .76, .45), U(.04 * e, .73, .58), "head");
	t.part(W(U(0, .645, .55), [
		.03,
		.016,
		.07
	], [8, 5]), "jaw", a);
	for (let e of [1, -1]) t.part(G(U(.025 * e, .65, .6), U(.025 * e, .672, .605), .007, .002, 3), "jaw", c);
	let C = [U(0, .55, -.36), ...g], w = [
		"pelvis",
		"tail1",
		"tail2"
	];
	for (let e = 0; e < C.length - 1; e++) t.part(G(C[e], C[e + 1], .035 - e * .008, .028 - e * .008, 6), w[e], a);
	t.part(W(g[2], [
		.025,
		.025,
		.04
	], [6, 4]), "tail3", o, !0);
	for (let e of [1, -1]) t.part(G(U(.11 * e, .56, .24), U(.11 * e, .27, .24), .05, .03), `armU${e}`, a), t.part(G(U(.11 * e, .27, .24), U(.11 * e, .04, .27), .028, .022), `armL${e}`, n), t.part(W(U(.11 * e, .025, .29), [
		.03,
		.022,
		.045
	], [6, 4]), `paw${e}`, n), t.part(W(U(.12 * e, .47, -.28), [
		.06,
		.09,
		.08
	], [8, 6]), `legU${e}`, a), t.part(G(U(.12 * e, .44, -.28), U(.12 * e, .3, -.24), .045, .03), `legU${e}`, a), t.part(G(U(.12 * e, .3, -.24), U(.12 * e, .1, -.38), .028, .022), `legL${e}`, n), t.part(G(U(.12 * e, .1, -.38), U(.12 * e, .02, -.33), .022, .02), `foot${e}`, n), t.part(W(U(.12 * e, .02, -.3), [
		.028,
		.02,
		.04
	], [6, 4]), `foot${e}`, n);
	{
		let e = [t.bones.indexOf(t.by.get("head")), t.bones.indexOf(t.by.get("jaw"))], n = U(0, .72, .5), r = 1.3, i = U(0, .03, .02);
		for (let a of t.parts) e.includes(a.bone) && a.geo.translate(-n.x, -n.y, -n.z).scale(r, r, r).translate(n.x + i.x, n.y + i.y, n.z + i.z);
		for (let e of ["head", "jaw"]) t.by.get(e).userData.at.sub(n).multiplyScalar(r).add(n).add(i);
		t.by.get("head").position.copy(t.by.get("head").userData.at).sub(t.by.get("neck").userData.at), t.by.get("jaw").position.copy(t.by.get("jaw").userData.at).sub(t.by.get("head").userData.at);
	}
	let T = t.mesh(e.glow || "#ff7a20", 1.5), E = (e, t = 1) => {
		let n = {};
		for (let r of [1, -1]) for (let [i, a, o] of [[
			`armU${r}`,
			`armL${r}`,
			r > 0 ? 0 : .12
		], [
			`legU${r}`,
			`legL${r}`,
			r > 0 ? .5 : .62
		]]) {
			let r = J(e + o), s = Math.max(0, xd(e + o)), c = i.startsWith("arm");
			n[i] = K(-.7 * t * r, 0, 0), n[a] = K((c ? 1 : -1) * t * s, 0, 0);
		}
		return n;
	}, D = (e, t = .2, n = 1) => ({
		tail1: K(.15, t * J(n * e), 0),
		tail2: K(.1, t * J(n * e - .15), 0),
		tail3: K(0, t * J(n * e - .3), 0)
	});
	return {
		root: T,
		clips: [
			q(t, "Idle", 3, (e) => {
				let t = J(e * 6), n = Y(.4, .5, .75, e), r = J((e - .4) / .35 * .5 + .25) * n;
				return {
					q: {
						...D(e, .25, 2),
						chest: K(.02 * t, .1 * r, 0),
						neck: K(-.1 + .03 * t, .3 * r, 0),
						head: K(.05, .3 * r, 0),
						jaw: K(.25 + .12 * Math.max(0, J(e * 12)), 0, 0)
					},
					p: { root: U(0, .004 * t, 0) }
				};
			}),
			q(t, "Walk", .4, (e) => ({
				q: {
					...E(e),
					...D(e, .15, 1),
					root: K(.08 * J(e), 0, 0),
					neck: K(.06 * J(e * 2), 0, 0),
					jaw: K(.3, 0, 0)
				},
				p: { root: U(0, .03 * Math.abs(J(e)), 0) }
			})),
			q(t, "Attack", .55, (e) => {
				let t = Y(0, .15, .3, e), n = Y(.2, .42, .8, e);
				return {
					q: {
						...D(e, .3, 2),
						root: K(-.1 * t + .12 * n, 0, 0),
						neck: K(.3 * n - .3 * t, 0, 0),
						head: K(-.2 * n, 0, 0),
						jaw: K(.2 + .8 * Y(.18, .36, .5, e), 0, 0),
						armU1: K(-.5 * n, 0, 0),
						"armU-1": K(-.5 * n, 0, 0)
					},
					p: { root: U(0, .02 * t - .03 * n, .2 * n - .04 * t) }
				};
			}),
			q(t, "Attack2", .5, (e) => {
				let t = Y(.1, .35, .8, e);
				return {
					q: {
						...D(e, .25),
						neck: K(.15 * t, .5 * t, 0),
						head: K(0, .4 * t, .3 * t),
						jaw: K(.2 + .7 * Y(.15, .3, .45, e), 0, 0),
						chest: K(0, .2 * t, 0)
					},
					p: { root: U(.03 * t, 0, .08 * t) }
				};
			}),
			q(t, "Heavy", .9, (e) => {
				let t = Y(0, .25, .38, e), n = Y(.3, .55, .85, e);
				return {
					q: {
						...E(.25, .8 * n),
						...D(e, .4),
						root: K(.2 * t - .35 * n + .2 * Y(.6, .75, .95, e), 0, 0),
						jaw: K(.2 + .8 * n, 0, 0),
						legU1: K(.6 * t, 0, 0),
						"legU-1": K(.6 * t, 0, 0)
					},
					p: { root: U(0, -.06 * t + .22 * n, .45 * Sd(.3, .75, e)) }
				};
			}),
			q(t, "Hit", .4, (e) => {
				let t = Y(0, .25, 1, e);
				return {
					q: {
						...D(e, .5, 2),
						neck: K(-.3 * t, .3 * t, 0),
						head: K(-.2 * t, 0, 0),
						jaw: K(.4 * t, 0, 0)
					},
					p: { root: U(0, 0, -.06 * t) }
				};
			}),
			q(t, "Death", 1, (e) => {
				let t = Sd(0, .6, e);
				return {
					q: {
						root: K(0, 0, 1.5 * t),
						neck: K(.3 * t, 0, 0),
						jaw: K(.5 * t, 0, 0),
						armU1: K(-.5 * t, 0, 0),
						"armU-1": K(.3 * t, 0, 0),
						legU1: K(.4 * t, 0, 0),
						"legU-1": K(-.3 * t, 0, 0),
						...D(0, 0)
					},
					p: { root: U(0, -.36 * t, 0) }
				};
			}),
			q(t, "Cast", 1, (e) => {
				let t = Y(.1, .4, .9, e);
				return {
					q: {
						...D(e, .2),
						neck: K(-.9 * t, 0, 0),
						head: K(-.4 * t, 0, 0),
						jaw: K(.2 + .6 * t, 0, 0),
						root: K(-.1 * t, 0, 0)
					},
					p: { root: U(0, .02 * t, 0) }
				};
			})
		]
	};
}
function Ad(e = {}) {
	let t = new ud(e.seed || 83);
	t.crease = 32 * Math.PI / 180;
	let n = new P(e.iron || "#3a3634"), r = new P("#5a544e"), i = new P("#1e1a18"), a = new P("#6a3a22"), o = (e, t) => t.y > .5 ? yd(n, r, (t.y - .5) * 2) : t.y < -.4 ? i : e.y < .4 && gd(Math.round(e.x * 10), Math.round(e.y * 10), Math.round(e.z * 10), 5) > .7 ? a : n, s = new P("#ffb050"), c = new P("#141210"), l = new P("#6a6660"), u = new P("#8e8a84");
	t.bone("root", null, U(0, .62, 0)), t.bone("spine", t.by.get("root"), U(0, .84, 0)), t.bone("chest", t.by.get("spine"), U(0, 1.22, .02)), t.bone("head", t.by.get("chest"), U(0, 1.5, .05));
	for (let e of [1, -1]) {
		let n = t.bone(`armU${e}`, t.by.get("chest"), U(.5 * e, 1.3, 0)), r = t.bone(`armL${e}`, n, U(.62 * e, .98, .05));
		t.bone(`fist${e}`, r, U(.62 * e, .66, .12));
		let i = t.bone(`legU${e}`, t.by.get("root"), U(.24 * e, .56, 0)), a = t.bone(`legL${e}`, i, U(.26 * e, .3, .03));
		t.bone(`foot${e}`, a, U(.26 * e, .08, .04));
	}
	t.part(new A(.46, .5, .22, 14).translate(0, .62, 0), "root", o), t.part(new A(.56, .52, .66, 14).translate(0, 1.04, .02), "chest", o), t.part(new A(.3, .56, .2, 14).translate(0, 1.46, .02), "chest", o);
	for (let e of [
		.78,
		1,
		1.3
	]) t.part(new L(e < .85 ? .5 : .56, .03, 5, 22).rotateX(Math.PI / 2).translate(0, e, .02), e < .85 ? "root" : "chest", i);
	for (let e = 0; e < 12; e++) {
		let n = e / 12 * Math.PI * 2;
		Math.abs(n - Math.PI / 2) < .5 || t.part(W(U(Math.cos(n) * .57, 1.15, Math.sin(n) * .57 + .02), [
			.025,
			.025,
			.025
		], [5, 4]), "chest", r);
	}
	t.part(new I(.58, .42, .08).translate(0, 1.02, .54), "chest", i), t.part(new I(.5, .34, .04).translate(0, 1.02, .56), "chest", s, !0);
	for (let e = -2; e <= 2; e++) t.part(new I(.035, .38, .04).translate(e * .1, 1.02, .59), "chest", c);
	for (let [e, n, r, i] of [
		[
			.4,
			.84,
			1.26,
			.37
		],
		[
			-.46,
			.86,
			1.28,
			.3
		],
		[
			.16,
			1.22,
			1.36,
			.53
		],
		[
			-.26,
			.78,
			.94,
			.5
		],
		[
			.52,
			.9,
			1.2,
			-.1
		],
		[
			-.3,
			.9,
			1.25,
			-.45
		]
	]) t.part(G(U(e, n, i), U(e * .95, r, i * 1.02), .018, .014, 4), "chest", s, !0);
	t.part(new A(.17, .2, .62, 12).translate(0, 1.82, 0), "head", o), t.part(new L(.19, .04, 6, 14).rotateX(Math.PI / 2).translate(0, 2.13, 0), "head", i), t.part(new A(.15, .15, .02, 12).translate(0, 2.12, 0), "head", s, !0);
	for (let e of [1, -1]) t.part(new I(.08, .035, .03).rotateZ(.25 * e).translate(.07 * e, 1.74, .19), "head", s, !0);
	if (t.part(new L(.2, .03, 5, 14).rotateX(Math.PI / 2).translate(0, 1.6, 0), "head", i), e.smoke) for (let [e, n, r, i] of [[
		.02,
		2.3,
		-.08,
		.15
	], [
		-.05,
		2.5,
		-.26,
		.21
	]]) t.part(W(U(e, n, r), [
		i,
		i * .8,
		i
	], [8, 6]), "head", (e, t) => t.y > .3 ? u : l);
	else {
		let e = new Pe();
		e.setAttribute("position", new k([
			-.05,
			2.668,
			-.26,
			-.05,
			2.668,
			-.26,
			-.05,
			2.668,
			-.26
		], 3)), t.part(e, "head", l);
	}
	for (let e of [1, -1]) {
		t.part(W(U(.5 * e, 1.34, 0), [
			.2,
			.15,
			.19
		], [8, 6]), `armU${e}`, o), t.part(new L(.17, .03, 5, 12).rotateZ(Math.PI / 2).translate(.56 * e, 1.34, 0), `armU${e}`, i), t.part(G(U(.5 * e, 1.3, 0), U(.62 * e, .98, .05), .09, .08, 8), `armU${e}`, o), t.part(W(U(.62 * e, .98, .05), [
			.1,
			.1,
			.1
		], [7, 5]), `armL${e}`, i), t.part(G(U(.62 * e, .98, .05), U(.62 * e, .68, .12), .09, .1, 8), `armL${e}`, o), t.part(W(U(.62 * e, .64, .13), [
			.13,
			.1,
			.13
		], [7, 5]), `fist${e}`, o);
		for (let n of [-1, 1]) t.part(G(U((.62 + .06 * n) * e, .6, .14), U((.62 + .1 * n) * e, .42, .22), .05, .035, 5), `fist${e}`, i);
	}
	for (let e of [1, -1]) t.part(G(U(.24 * e, .56, 0), U(.26 * e, .3, .03), .12, .11, 8), `legU${e}`, o), t.part(G(U(.26 * e, .3, .03), U(.26 * e, .1, .04), .11, .12, 8), `legL${e}`, o), t.part(new I(.26, .1, .34).translate(.26 * e, .05, .08), `foot${e}`, i);
	return {
		root: t.mesh(e.glow || "#ff8a30", 1.6),
		clips: []
	};
}
function jd(e, t) {
	let n = new P(t.brass || "#a07a34"), r = new P("#d0a24c"), i = new P("#4e3818"), a = (e, t) => t.y > .55 ? yd(n, r, (t.y - .55) * 2.4) : t.y < -.3 ? i : n, o = new P(t.vest || "#2c2a30"), s = new P("#44404a"), c = (e, t) => t.y > .5 ? s : o, l = new P("#2a1c12"), u = new P("#8a6a40"), d = new P("#3a2a18"), f = new P("#2a2826"), p = U(0, .655, .075), m = t.hatR || .145, h = e.parts.length;
	e.part(W(p, [
		m,
		m * .86,
		m * 1.04
	], [14, 9]).translate(0, 0, 0), "head", a), e.part(new A(m * 1.16, m * 1.2, .012, 22).translate(0, .64, .075), "head", a), e.part(new A(m * .5, m * .6, .012, 14, 1, !1, -1, 2).scale(1.5, 1, 1.7).translate(0, .638, .19), "head", a), e.part(new L(m * .98, .007, 5, 22, Math.PI).rotateY(Math.PI / 2).scale(.25, 1, 1.02).translate(0, .655, .075), "head", a), e.part(new L(m * 1.01, .006, 5, 24).rotateX(Math.PI / 2).translate(0, .665, .075), "head", f);
	for (let [t, n, r] of [[
		.09,
		.74,
		.16
	], [
		-.12,
		.71,
		.11
	]]) e.part(W(U(t, n, r), [
		.022,
		.012,
		.02
	], [6, 4]), "head", i);
	let g = U(0, .735, .225);
	e.part(new A(.036, .03, .06, 12).rotateX(Math.PI / 2).translate(g.x, g.y, g.z), "head", a), e.part(new A(.04, .04, .008, 12).rotateX(Math.PI / 2).translate(g.x, g.y, g.z + .03), "head", a), e.part(new A(.03, .03, .01, 12).rotateX(Math.PI / 2).translate(g.x, g.y, g.z + .034), "head", new P("#ffe2a0"), t.lampGlow || "#ffc060"), e.part(new I(.018, .05, .03).translate(0, .7, .2), "head", a);
	for (let n of e.parts.slice(h)) n.geo.translate(0, -.62, -.08).rotateX(-(t.hatTilt ?? .4)).translate(0, .62, .08);
	e.part(W(U(0, .448, .028), [
		.092,
		.066,
		.07
	], [9, 7]), "chest", c);
	for (let t of [
		.47,
		.445,
		.42
	]) e.part(W(U(.022, t, .096), [
		.008,
		.008,
		.005
	], [6, 4]), "chest", a);
	e.part(G(U(-.045, .505, .095), U(0, .43, .118), .004, .004, 4), "chest", l), e.part(G(U(.045, .505, .095), U(0, .43, .118), .004, .004, 4), "chest", l), e.part(new A(.013, .011, .05, 10).rotateZ(Math.PI / 2 - .3).translate(.008, .42, .122), "chest", a);
	let _ = U(-.168, .226, .09), v = _.clone().add(U(0, -.01, .02)), y = _.clone().add(U(.01, -.04, .2));
	e.part(G(v, y, .011, .01, 6), "hand-1", u);
	for (let t = 1; t <= 5; t++) {
		let n = v.clone().lerp(y, .25 + t * .13);
		e.part(G(n.clone().add(U(0, .004, -.002)), n.clone().add(U(0, -.004, .002)), .0125, .0125, 6), "hand-1", d);
	}
}
function Md(e = {}) {
	let t = new ud(e.seed || 53), n = new P(e.robe || "#2b2f30"), r = new P(e.robeHi || "#38483f"), i = new P("#141617"), a = (e, t) => t.y > .8 ? r : t.y < -.35 ? i : n, o = new P("#b9b4a0"), s = new P("#7d796a"), c = new P("#3f4744"), l = new P("#c8c6b0"), u = new P("#050706"), d = new P("#2a2c2c"), f = new P("#bfffe0"), p = (e, t) => t.y < -.3 ? s : o;
	t.bone("root", null, U(0, .85, 0)), t.bone("spine", t.by.get("root"), U(0, 1, 0)), t.bone("chest", t.by.get("spine"), U(0, 1.2, .03)), t.bone("neck", t.by.get("chest"), U(0, 1.32, .07)), t.bone("head", t.by.get("neck"), U(0, 1.4, .1)), t.bone("jaw", t.by.get("head"), U(0, 1.375, .15));
	let m = {};
	for (let e of [1, -1]) {
		let n = U(.2 * e, 1.27, .04), r = U(.3 * e, .99, .12), i = U(.35 * e, .7, .29), a = r.clone().sub(n).normalize(), o = i.clone().sub(r).normalize(), s = a.clone().cross(o).normalize(), c = U(-e, 0, .25).normalize(), l = c.clone().cross(o).normalize(), u = i.clone().add(o.clone().multiplyScalar(.07)), d = t.bone(`armU${e}`, t.by.get("chest"), n), f = t.bone(`armL${e}`, d, r), p = t.bone(`hand${e}`, f, i);
		t.bone(`claw${e}`, p, u), m[e] = {
			Sh: n,
			El: r,
			Wr: i,
			Kn: u,
			up: a,
			fore: o,
			hinge: s,
			palm: c,
			spread: l
		};
	}
	let h = [
		U(0, .95, 0),
		U(.03, .66, -.02),
		U(-.03, .4, 0),
		U(.01, .15, .03)
	], g = [
		.13,
		.15,
		.11,
		.06
	], _ = t.by.get("root");
	for (let e = 0; e < 3; e++) _ = t.bone(`shroud${e}`, _, h[e]), t.part(G(h[e + 1], h[e], g[e + 1], g[e], 9), `shroud${e}`, a);
	t.part(G(h[3], U(0, .04, .04), .04, .003, 6), "shroud2", a);
	let v = [];
	for (let e = 0; e < 6; e++) {
		let n = e / 6 * bd + .3, r = .9, i = gd(e, 2, 5, 13), o = .08 + .12 * i, s = (e, t, i) => U(t * Math.cos(n + r * e), i, t * Math.sin(n + r * e)), c = [
			s(0, .08, .5 - e % 2 * .12),
			s(.5, .18, .24 + o * .3),
			s(.9, .27 + .05 * i, .26 + o * .5),
			s(1.25, .32 + .06 * i, .42 + o),
			s(1.45, .3 + .06 * i, .62 + o * 1.2)
		], l = t.by.get("root"), u = [];
		for (let n = 0; n < 3; n++) l = t.bone(`tend${e}${n}`, l, c[n]), u.push(`tend${e}${n}`);
		let d = md(c, [
			.09,
			.08,
			.06,
			.035,
			.002
		], u, 8, 20);
		t.part(d.g, t.skin(d.skin), a), v.push(u);
	}
	t.part(W(U(0, 1.25, .02), [
		.24,
		.11,
		.16
	], [12, 8]), "chest", a), t.part(G(U(0, .96, 0), U(0, 1.2, .02), .13, .2, 10), "spine", a);
	for (let e of [1, -1]) t.part(G(U(.17 * e, 1.27, .08), U(.03 * e, .95, .15), .085, .01, 3), "chest", a), t.part(G(U(.21 * e, 1.24, .03), U(.12 * e, .9, .09), .07, .006, 3), "chest", a), t.part(G(U(.12 * e, 1.27, -.08), U(.1 * e, .82, -.14), .085, .006, 3), "chest", a);
	t.part(G(U(0, 1.27, -.1), U(0, .74, -.16), .09, .006, 3), "chest", a), t.part(W(U(0, 1.45, .05), [
		.14,
		.16,
		.13
	], [12, 9]), "head", a), t.part(W(U(0, 1.53, .14), [
		.11,
		.04,
		.08
	], [8, 5], -.3), "head", a);
	for (let e of [1, -1]) t.part(G(U(.11 * e, 1.44, .1), U(.15 * e, 1.26, .06), .05, .03, 5), "head", a);
	for (let [e, n, r] of [
		[
			0,
			.33,
			0
		],
		[
			.075,
			.25,
			.05
		],
		[
			-.075,
			.25,
			-.05
		]
	]) {
		let i = U(e, 1.56, .1), a = U(e + r * .6, 1.56 + n * .55, .09), o = U(e + r * 1.6, 1.56 + n, .06);
		t.part(G(i, a, .03, .017, 5), "head", d), t.part(G(a, o, .017, .002, 4), "head", d);
	}
	t.part(W(U(0, 1.425, .165), [
		.09,
		.098,
		.088
	], [10, 8]), "head", p), t.part(W(U(0, 1.462, .23), [
		.08,
		.025,
		.035
	], [8, 4]), "head", o);
	for (let e of [1, -1]) t.part(W(U(.037 * e, 1.43, .238), [
		.03,
		.027,
		.016
	], [6, 5]), "head", u), t.part(W(U(.037 * e, 1.43, .25), [
		.012,
		.01,
		.006
	], [5, 3]), "head", f, !0), t.part(W(U(.063 * e, 1.39, .215), [
		.024,
		.02,
		.027
	], [6, 4]), "head", o);
	t.part(W(U(0, 1.4, .252), [
		.011,
		.015,
		.008
	], [4, 3]), "head", u);
	for (let e = -3; e <= 3; e++) t.part(G(U(e * .012, 1.374, .238 - Math.abs(e) * .005), U(e * .012, 1.352, .24 - Math.abs(e) * .005), .006, .002, 3), "head", l);
	t.part(W(U(0, 1.33, .205), [
		.058,
		.024,
		.045
	], [8, 5]), "jaw", p);
	for (let e = -2; e <= 2; e++) t.part(G(U(e * .013, 1.34, .243 - Math.abs(e) * .005), U(e * .013, 1.36, .244 - Math.abs(e) * .005), .006, .002, 3), "jaw", l);
	for (let e of [1, -1]) {
		let n = m[e], r = `armU${e}`, i = `armL${e}`, o = `hand${e}`, s = `claw${e}`, d = t.skin((e) => {
			let t = Math.max(0, Math.min(1, e.distanceTo(n.Sh) / .1));
			return t >= 1 ? [[r, 1]] : [[r, .45 + .55 * t], ["chest", .55 - .55 * t]];
		}), f = t.skin((e) => {
			let t = Math.max(0, Math.min(1, e.distanceTo(n.El) / .06));
			return t >= 1 ? [[i, 1]] : [[i, .5 + .5 * t], [r, .5 - .5 * t]];
		});
		t.part(W(n.Sh.clone().add(U(0, .01, 0)), [
			.075,
			.065,
			.075
		]), d, a), t.part(G(n.Sh, n.El.clone().add(n.up.clone().multiplyScalar(.03)), .065, .12, 9), d, (e, t) => t.dot(n.up) > .7 ? u : a(e, t));
		for (let i = 0; i < 7; i++) {
			let o = i / 7 * bd + .4, s = .105, c = n.El.clone().add(n.up.clone().multiplyScalar(.03)), l = U(e, 0, 0), u = U(0, 0, 1), d = c.clone().add(l.clone().multiplyScalar(Math.cos(o) * s)).add(u.clone().multiplyScalar(Math.sin(o) * s * .9)), f = .1 + .09 * gd(i, e, 6, 3) + (Math.sin(o) < 0 ? .06 : 0);
			t.part(G(d, d.clone().add(U(.01 * e * Math.cos(o), -f, -.02)), .032, .003, 3), r, a);
		}
		t.part(G(n.El.clone().add(n.up.clone().multiplyScalar(-.02)), n.Wr, .034, .025, 7), f, c), t.part(W(n.El, [
			.032,
			.03,
			.032
		], [6, 5]), f, c), t.part(W(n.Wr.clone().add(n.fore.clone().multiplyScalar(.035)), [
			.05,
			.055,
			.04
		], [7, 5]), o, c);
		for (let e = 0; e < 4; e++) {
			let r = (e - 1.5) * .24, i = n.fore.clone().multiplyScalar(Math.cos(r)).add(n.spread.clone().multiplyScalar(Math.sin(r))).normalize(), a = n.Kn.clone().add(n.spread.clone().multiplyScalar((e - 1.5) * .022)), o = .1 - Math.abs(e - 1.5) * .01, u = a.clone().add(i.clone().multiplyScalar(o)), d = i.clone().add(n.palm.clone().multiplyScalar(.45)).normalize(), f = u.clone().add(d.clone().multiplyScalar(o * .8)), p = d.clone().add(n.palm.clone().multiplyScalar(.5)).normalize();
			t.part(G(a, u, .015, .012, 5), s, c), t.part(W(u, [
				.013,
				.013,
				.013
			], [5, 4]), s, c), t.part(G(u, f, .012, .009, 5), s, c), t.part(G(f, f.clone().add(p.multiplyScalar(.065)), .009, .001, 4), s, l);
		}
		{
			let e = n.Wr.clone().add(n.fore.clone().multiplyScalar(.025)).add(n.palm.clone().multiplyScalar(.025)).add(n.spread.clone().multiplyScalar(-.03)), r = n.fore.clone().multiplyScalar(.5).add(n.palm.clone().multiplyScalar(.55)).add(n.spread.clone().multiplyScalar(-.45)).normalize(), i = e.clone().add(r.clone().multiplyScalar(.07));
			t.part(G(e, i, .012, .009, 5), o, c), t.part(G(i, i.clone().add(r.add(n.palm.clone().multiplyScalar(.4)).normalize().multiplyScalar(.04)), .008, .001, 4), o, l);
		}
	}
	let y = t.mesh(e.glow || "#5ff0a0", 1.3), b = (e, t = 1, n = 0) => ({
		...Object.fromEntries([
			0,
			1,
			2
		].map((r) => [`shroud${r}`, K(n * (.12 + .08 * r) + .05 * t * J(e - r * .2), .15 * t * J(e * .5 - r * .25), .05 * t * xd(e - r * .2))])),
		...Object.fromEntries(v.flatMap((r, i) => r.map((r, a) => [r, K(n * .3 + .16 * t * J(e + i / 6 + a * .15), .1 * t * xd(e * .5 + i / 6), .14 * t * J(e * 1.3 + i / 6 - a * .2))])))
	}), x = U(1, 0, 0), S = U(0, 0, 1), C = (e, { fwd: t = 0, out: n = 0, bend: r = 0, curl: i = 0, wrist: a = 0, twist: o = 0 } = {}) => {
		let s = m[e];
		return {
			[`armU${e}`]: hd(ld, -o * e).multiply(hd(S, n * e)).multiply(hd(x, -t)),
			[`armL${e}`]: hd(s.hinge, -r),
			[`hand${e}`]: hd(s.hinge, -a),
			[`claw${e}`]: hd(s.spread, i * e)
		};
	}, w = (e, t) => ({
		...C(1, e),
		...C(-1, t)
	}), T = (e, t, n) => e(t - n);
	return {
		root: y,
		clips: [
			q(t, "Idle", 3, (e) => {
				let t = (e) => Y(.25, .48, .78, (e % 1 + 1) % 1), n = .06 * J(e);
				return {
					q: {
						...b(e),
						...w({
							fwd: .06 + n + .35 * T(t, e, .5),
							out: .05,
							bend: .1 + .45 * T(t, e, .56),
							curl: .15 + .5 * T(t, e, .62)
						}, {
							fwd: .06 + n + .75 * t(e),
							out: .05 + .1 * t(e),
							bend: .1 + 1 * T(t, e, .05),
							curl: .15 + .85 * T(t, e, .12) - .4 * T(t, e, .35) * 0,
							wrist: .25 * T(t, e, .08)
						}),
						head: K(.08 * J(e + .2), .15 * J(e * .5), .05 * J(e)),
						jaw: K(.3 + .12 * Math.max(0, J(e * 2)), 0, 0),
						spine: K(.06 + .03 * J(e), 0, 0)
					},
					p: { root: U(0, .04 * J(e), 0) }
				};
			}),
			q(t, "Walk", 1.2, (e) => ({
				q: {
					...b(e * 2, 1.3, .45),
					root: K(.2, 0, .05 * J(e)),
					...w({
						fwd: -.4 + .18 * J(e),
						out: .12,
						bend: .3 + .12 * J(e - .1),
						curl: .3 + .1 * J(e - .2)
					}, {
						fwd: -.4 + .18 * J(e + .5),
						out: .12,
						bend: .3 + .12 * J(e + .4),
						curl: .3 + .1 * J(e + .3)
					}),
					jaw: K(.3, 0, 0)
				},
				p: { root: U(0, .03 * J(e * 2), 0) }
			})),
			q(t, "Attack", .7, (e) => {
				let t = Y(0, .3, .45, e), n = Y(.38, .52, .9, e), r = Y(0, .33, .48, e), i = Y(.4, .55, .9, e), a = Y(.46, .6, .95, e);
				return {
					q: {
						...b(e, 1.5, .2 * n),
						chest: K(.15 * n, -.45 * t + .5 * n, 0),
						...w({
							fwd: .1 + .3 * t - .25 * n,
							out: .2 * t,
							bend: .25 + .4 * r,
							curl: .2
						}, {
							fwd: .05 + 2.5 * t + .6 * n,
							out: .45 * t - .55 * n,
							bend: .1 + 1.3 * r - .45 * i,
							curl: -.45 * t + 1.1 * a,
							wrist: .5 * r - .5 * i
						}),
						jaw: K(.3 + .4 * n, 0, 0),
						head: K(.15 * n, .25 * n, 0)
					},
					p: { root: U(0, .04 * t, .12 * n) }
				};
			}),
			q(t, "Attack2", .75, (e) => {
				let t = Y(0, .35, .5, e), n = Y(.42, .56, .92, e), r = Y(.46, .6, .92, e), i = Y(.52, .64, .96, e), a = (e) => ({
					fwd: -.45 * t + 1.55 * n,
					out: .3 * t - .2 * n + e,
					bend: .2 + .8 * t - .55 * r,
					curl: .2 - .6 * t - .2 * n + 1.3 * i
				});
				return {
					q: {
						...b(e, 1.5, .3 * n),
						...w(a(0), a(.04)),
						spine: K(-.2 * t + .4 * n, 0, 0),
						jaw: K(.3 + .5 * t, 0, 0)
					},
					p: { root: U(0, .08 * t - .04 * n, .1 * n) }
				};
			}),
			q(t, "Heavy", 1.1, (e) => {
				let t = Y(0, .35, .55, e), n = Y(.5, .62, .95, e), r = Y(0, .4, .6, e), i = (e) => ({
					fwd: .45 * t + 1.3 * n,
					out: 1.65 * t + e - .1 * n,
					bend: .2 - .55 * r + .15 * n,
					curl: .2 - .8 * r + 1 * n,
					wrist: -.3 * r
				});
				return {
					q: {
						...b(e * 1.5, 2, .6 * n),
						...w(i(0), i(.06)),
						spine: K(-.35 * t + .5 * n, 0, 0),
						head: K(-.5 * t + .3 * n, 0, 0),
						jaw: K(.3 + .6 * t, 0, 0)
					},
					p: { root: U(0, .18 * t - .08 * n, .38 * Sd(.5, .8, e)) }
				};
			}),
			q(t, "Hit", .45, (e) => {
				let t = Y(0, .2, 1, e), n = Y(0, .26, 1, e), r = {
					fwd: .85 * t,
					out: -.45 * t,
					bend: .1 + 1.5 * n,
					curl: .2 + .8 * n
				};
				return {
					q: {
						...b(e * 2, 1 + 2 * t, -.3 * t),
						...w(r, r),
						spine: K(-.3 * t, .2 * t, 0),
						head: K(-.35 * t, -.2 * t, 0),
						jaw: K(.3 + .3 * t, 0, 0)
					},
					p: { root: U(0, .03 * t, -.08 * t) }
				};
			}),
			q(t, "Death", 1.6, (e) => {
				let t = Y(0, .18, .42, e), n = Sd(.2, .9, e), r = 1 - .72 * n, i = (e) => ({
					fwd: 2.3 * t + .35 * n,
					out: .4 * t - .3 * n + e,
					bend: .1 - .35 * t + .6 * n,
					curl: -.5 * t + .9 * n
				});
				return {
					q: {
						...b(e * 2, 2 * t + .3, -.5 * n),
						...w(i(0), i(.1)),
						spine: K(.15 * n - .3 * t, 0, 0),
						head: K(-.5 * t + .5 * n, 0, 0),
						jaw: K(.3 + .6 * t, 0, 0)
					},
					p: { root: U(0, .1 * t - .74 * n, 0) },
					s: { root: U(1 + .3 * n, r, 1 + .3 * n) }
				};
			}),
			q(t, "Cast", 1, (e) => {
				let t = Y(.05, .4, .9, e), n = Y(.1, .45, .92, e), r = .06 * J(e * 11) * t, i = (e) => ({
					fwd: .85 * t + r,
					out: 1.3 * t + e,
					bend: .15 - .4 * n,
					curl: .15 - .75 * n + r * 2,
					wrist: -.45 * n
				});
				return {
					q: {
						...b(e * 1.5, 1.5, -.2 * t),
						...w(i(0), i(.05)),
						spine: K(-.25 * t, 0, 0),
						head: K(-.45 * t, 0, 0),
						jaw: K(.3 + .5 * t, 0, 0)
					},
					p: { root: U(0, .1 * t, 0) }
				};
			})
		]
	};
}
function Nd(e, t, n = 0, r = .22, i = [
	0,
	0,
	0
]) {
	let a = [
		[0, -1],
		[1 - r, -1],
		[1, -1 + r],
		[1, 1 - r],
		[1 - r, 1],
		[0, 1]
	].map(([e, t]) => new Oe(Math.max(1e-4, e), t)), o = new Ye(a, 8).rotateY(Math.PI / 8), s = o.attributes.position, c = new F(), l = 1 / Math.cos(Math.PI / 8);
	for (let e = 0; e < s.count; e++) {
		c.fromBufferAttribute(s, e);
		let r = 1 + (gd(Math.round(c.x * 1e3), Math.round(c.y * 1e3), Math.round(c.z * 1e3), n) - .5) * .12;
		s.setXYZ(e, c.x * t[0] * l * r, c.y * t[1] * r, c.z * t[2] * l * r);
	}
	return o.rotateX(i[0]).rotateY(i[1]).rotateZ(i[2]), o.translate(e.x, e.y, e.z), o;
}
function Pd(e = {}) {
	let t = new ud(e.seed || 67), n = e.seed || 67;
	t.crease = 28 * Math.PI / 180;
	let r = new P(e.stone || "#46525e"), i = new P(e.stoneHi || "#5a6774"), a = new P("#2c343e"), o = new P(e.moss || "#5e6c1e"), s = new P("#7e8c2a"), c = new P("#68761a"), l = new P("#5e3a20"), u = new P("#84552c"), d = new P("#121416"), f = new P("#ffb24a"), p = (e, t) => t.y > .8 && gd(Math.round(e.x * 18), Math.round(e.y * 18), Math.round(e.z * 18), n) > .72 ? o : t.y > .35 ? yd(r, i, (t.y - .35) * 2) : t.y < -.35 ? a : r;
	t.bone("root", null, U(0, .62, 0)), t.bone("spine", t.by.get("root"), U(0, .84, 0)), t.bone("chest", t.by.get("spine"), U(0, 1.22, .02)), t.bone("head", t.by.get("chest"), U(0, 1.5, .12));
	for (let e of [1, -1]) {
		let n = t.bone(`armU${e}`, t.by.get("chest"), U(.48 * e, 1.48, 0)), r = t.bone(`armL${e}`, n, U(.6 * e, 1.08, .05));
		t.bone(`fist${e}`, r, U(.6 * e, .62, .14));
		let i = t.bone(`legU${e}`, t.by.get("root"), U(.19 * e, .58, 0)), a = t.bone(`legL${e}`, i, U(.21 * e, .33, .03));
		t.bone(`foot${e}`, a, U(.21 * e, .09, .02));
	}
	let h = 0, g = (e, r, i, a = .22, o = [
		0,
		0,
		0
	]) => t.part(Nd(e, r, n + ++h, a, o), i, p);
	g(U(0, .62, 0), [
		.25,
		.08,
		.17
	], "root", .3), g(U(0, .78, .01), [
		.2,
		.1,
		.16
	], "spine", .3), g(U(0, 1.18, 0), [
		.38,
		.25,
		.25
	], "chest", .28), g(U(0, 1.38, -.12), [
		.3,
		.14,
		.15
	], "chest", .3);
	for (let e of [1, -1]) g(U(.2 * e, 1.34, .17), [
		.15,
		.1,
		.08
	], "chest", .3, [
		.1,
		0,
		.08 * e
	]), g(U(.22 * e, 1.02, .15), [
		.13,
		.08,
		.08
	], "chest", .3, [
		-.1,
		0,
		-.06 * e
	]);
	t.part(new A(.17, .19, .08, 10).rotateX(Math.PI / 2).translate(0, 1.16, .25), "chest", p), t.part(new L(.115, .016, 4, 14).translate(0, 1.16, .293), "chest", a), t.part(new A(.045, .045, .04, 8).rotateX(Math.PI / 2).translate(0, 1.16, .282), "chest", d), t.part(W(U(0, 1.16, .27), [
		.022,
		.022,
		.01
	], [6, 4]), "chest", f, !0);
	for (let [e, n] of [
		[-.07, 1.25],
		[.08, 1.09],
		[.1, 1.23]
	]) t.part(W(U(e, n, .295), [
		.012,
		.012,
		.006
	], [5, 3]), "chest", d);
	g(U(0, 1.54, .15), [
		.13,
		.11,
		.12
	], "head", .25);
	for (let e of [1, -1]) g(U(.1 * e, 1.69, .13), [
		.05,
		.075,
		.05
	], "head", .3, [
		0,
		0,
		-.35 * e
	]), t.part(W(U(.052 * e, 1.565, .268), [
		.026,
		.026,
		.012
	], [6, 4]), "head", d), t.part(W(U(.052 * e, 1.565, .272), [
		.011,
		.011,
		.005
	], [5, 3]), "head", f, !0);
	t.part(new I(.11, .035, .02).translate(0, 1.485, .266), "head", d);
	for (let e of [1, -1]) {
		g(U(.48 * e, 1.5, 0), [
			.17,
			.15,
			.16
		], `armU${e}`, .28, [
			0,
			0,
			.15 * e
		]), g(U(.55 * e, 1.27, .02), [
			.11,
			.14,
			.11
		], `armU${e}`, .25), g(U(.6 * e, 1.08, .05), [
			.1,
			.07,
			.1
		], `armL${e}`, .3), g(U(.6 * e, .86, .09), [
			.14,
			.19,
			.14
		], `armL${e}`, .25), g(U(.6 * e, .58, .14), [
			.13,
			.1,
			.13
		], `fist${e}`, .3);
		for (let t of [
			-1,
			0,
			1
		]) g(U((.6 + t * .075) * e, .5, .2), [
			.035,
			.04,
			.045
		], `fist${e}`, .35);
		t.part(new L(.165, .035, 5, 12).rotateX(Math.PI / 2).translate(.6 * e, .76, .09), `armL${e}`, (e, t) => t.y > .3 ? u : l);
		let n = [
			U(.73 * e, .72, .16),
			U(.68 * e, .42, .22),
			U(.66 * e, .12, .28),
			U(.6 * e, .03, .4),
			U(.45 * e, .03, .5)
		], r = 0;
		for (let i = 0; i < n.length - 1; i++) {
			let a = n[i], o = n[i + 1], s = a.distanceTo(o), c = Math.max(2, Math.round(s / .055));
			for (let n = 0; n < c; n++) {
				let i = a.clone().lerp(o, (n + .5) / c), s = o.clone().sub(a).normalize(), d = new L(.03, .01, 3, 6).scale(1, 1.5, 1);
				r++ % 2 && d.rotateY(Math.PI / 2), d.applyQuaternion(new m().setFromUnitVectors(ld, s)).translate(i.x, i.y, i.z), t.part(d, `armL${e}`, (e, t) => t.y > .3 ? u : l);
			}
		}
		g(U(.19 * e, .47, .02), [
			.12,
			.11,
			.12
		], `legU${e}`, .28), g(U(.21 * e, .33, .04), [
			.1,
			.06,
			.1
		], `legL${e}`, .3), g(U(.21 * e, .2, .04), [
			.11,
			.1,
			.11
		], `legL${e}`, .28), g(U(.21 * e, .055, .08), [
			.13,
			.055,
			.17
		], `foot${e}`, .3);
	}
	let _ = [
		[
			"chest",
			U(-.25, 1.4, .21),
			U(-.12, 1.02, .25)
		],
		[
			"chest",
			U(.3, 1.32, .2),
			U(.18, .98, .22)
		],
		[
			"chest",
			U(-.05, 1.34, .25),
			U(.04, 1.27, .27)
		],
		[
			"spine",
			U(.1, .86, .17),
			U(.05, .7, .17)
		],
		[
			"head",
			U(-.08, 1.64, .25),
			U(-.05, 1.5, .27)
		]
	];
	for (let e of [1, -1]) _.push([
		`armL${e}`,
		U(.68 * e, 1, .2),
		U(.62 * e, .7, .24)
	], [
		`legU${e}`,
		U(.25 * e, .56, .13),
		U(.2 * e, .4, .14)
	], [
		`armU${e}`,
		U(.4 * e, 1.62, .12),
		U(.5 * e, 1.4, .16)
	]);
	_.push([
		"chest",
		U(.05, 1.42, .22),
		U(.25, 1.24, .24)
	], [
		"chest",
		U(-.3, 1.08, .2),
		U(-.1, .96, .2)
	]);
	for (let e of [1, -1]) _.push([
		`legL${e}`,
		U(.25 * e, .29, .14),
		U(.18 * e, .1, .15)
	], [
		`armU${e}`,
		U(.58 * e, 1.38, .13),
		U(.52 * e, 1.16, .13)
	]);
	for (let [e, n, r] of _) {
		let i = n.clone().lerp(r, .33).add(U(.025, 0, .01)), a = n.clone().lerp(r, .66).add(U(-.02, 0, .01));
		t.part(G(n, i, .018, .016, 3), e, c), t.part(G(i, a, .016, .013, 3), e, c), t.part(G(a, r, .013, .004, 3), e, c);
	}
	let v = (e, n, r = 1) => {
		t.part(W(e.clone().add(U(0, .015 * r, 0)), [
			.03 * r,
			.025 * r,
			.03 * r
		], [6, 4]), n, o);
		for (let i = 0; i < 12; i++) {
			let a = i / 12 * bd + i % 2 * .3, c = .35 + .5 * (i * 7 % 5) / 5, l = U(Math.cos(a) * Math.cos(c), Math.sin(c) + .3, Math.sin(a) * Math.cos(c)).normalize();
			t.part(G(e.clone().add(U(0, .012 * r, 0)), e.clone().add(l.clone().multiplyScalar((.045 + i % 3 * .015) * r)), .016 * r, .002, 3), n, i % 3 ? s : o);
		}
	};
	for (let e of [1, -1]) v(U(.11 * e, 1.77, .13), "head", 1.5), v(U(.46 * e, 1.66, .02), `armU${e}`, 1.9), v(U(.62 * e, 1, .18), `armL${e}`, 1.6), v(U(.21 * e, .4, .12), `legU${e}`, 1.3), v(U(.66 * e, .6, .12), `fist${e}`, 1.2);
	v(U(-.2, 1.44, .12), "chest", 1.8), v(U(.16, .71, .08), "root", 1.3), v(U(.27, 1.3, .22), "chest", 1.3);
	let y = t.mesh(e.glow || "#ff8418", 1), b = {
		armU1: K(-.1, 0, .12),
		"armU-1": K(-.1, 0, -.12),
		armL1: K(-.25, 0, 0),
		"armL-1": K(-.25, 0, 0)
	};
	return {
		root: y,
		clips: [
			q(t, "Idle", 3.2, (e) => ({
				q: {
					...b,
					chest: K(.06 + .03 * J(e), .06 * J(e * .5), 0),
					head: K(.05 * J(e), .25 * J(e * .5 + .2), 0),
					armU1: K(-.1 + .04 * J(e), 0, .12),
					"armU-1": K(-.1 + .04 * J(e + .3), 0, -.12)
				},
				p: { root: U(0, -.012 + .008 * J(e), 0) }
			})),
			q(t, "Walk", 1.1, (e) => {
				let t = {};
				for (let n of [1, -1]) {
					let r = n > 0 ? 0 : .5, i = J(e + r), a = Math.max(0, -xd(e + r));
					t[`legU${n}`] = K(-.38 * i - .15 * a, 0, 0), t[`legL${n}`] = K(.65 * a, 0, 0), t[`armU${n}`] = K(-.1 + .3 * J(e + r + .5), 0, .12 * n), t[`armL${n}`] = K(-.3, 0, 0);
				}
				return {
					q: {
						...t,
						root: K(0, .08 * J(e), .06 * J(e)),
						chest: K(.12, -.1 * J(e), -.04 * J(e))
					},
					p: { root: U(.03 * J(e), -.035 * Math.abs(xd(e)), 0) }
				};
			}),
			q(t, "Attack", .9, (e) => {
				let t = Y(0, .38, .52, e), n = Y(.45, .58, .95, e);
				return {
					q: {
						...b,
						chest: K(.1 + .2 * n, .45 * t - .6 * n, 0),
						"armU-1": K(.5 * t - 1.6 * n, .4 * n, -.6 * t + .2 * n),
						"armL-1": K(-1 * t - .2 * n, 0, 0),
						armU1: K(-.4 * t, 0, .3),
						head: K(.15 * n, -.2 * n, 0)
					},
					p: { root: U(0, 0, .12 * n) }
				};
			}),
			q(t, "Attack2", .85, (e) => {
				let t = Y(0, .35, .5, e), n = Y(.42, .56, .9, e);
				return {
					q: {
						...b,
						chest: K(.1, -.5 * t + .6 * n, 0),
						armU1: K(-.5 - .6 * t - .4 * n, .7 * t - 1.2 * n, .4 + .6 * t),
						armL1: K(-.6 * t, 0, 0)
					},
					p: { root: U(0, 0, .06 * n) }
				};
			}),
			q(t, "Heavy", 1.4, (e) => {
				let t = Y(0, .4, .55, e), n = Y(.5, .6, 1, e);
				return {
					q: {
						armU1: K(-.1 - 2.9 * t + 2.2 * n, 0, .12),
						"armU-1": K(-.1 - 2.9 * t + 2.2 * n, 0, -.12),
						armL1: K(-.25 - .3 * t + .15 * n, 0, 0),
						"armL-1": K(-.25 - .3 * t + .15 * n, 0, 0),
						chest: K(-.25 * t + .65 * n, 0, 0),
						spine: K(.25 * n, 0, 0),
						head: K(-.2 * t + .1 * n, 0, 0),
						legU1: K(-.4 * n, 0, 0),
						"legU-1": K(-.4 * n, 0, 0),
						legL1: K(.7 * n, 0, 0),
						"legL-1": K(.7 * n, 0, 0)
					},
					p: { root: U(0, .06 * t - .17 * n, .1 * n) }
				};
			}),
			q(t, "Hit", .5, (e) => {
				let t = Y(0, .25, 1, e);
				return {
					q: {
						...b,
						chest: K(-.15 * t, .12 * t, 0),
						head: K(-.2 * t, .15 * t, 0)
					},
					p: { root: U(0, 0, -.05 * t) }
				};
			}),
			q(t, "Death", 1.8, (e) => {
				let t = Sd(0, .5, e), n = Sd(.3, .85, e), r = Sd(.15, .6, e);
				return {
					q: {
						legU1: K(-.9 * t, 0, .3 * t),
						"legU-1": K(-.7 * t, 0, -.2 * t),
						legL1: K(1.3 * t, 0, 0),
						"legL-1": K(1.1 * t, 0, 0),
						chest: K(.7 * n, .2 * n, .25 * n),
						spine: K(.3 * n, 0, 0),
						head: K(1.2 * r, .8 * r, .5 * r),
						armU1: K(.6 * n, 0, .5 * n),
						"armU-1": K(-.3 * n, 0, -.9 * n),
						armL1: K(.4 * n, 0, 0),
						"armL-1": K(.3 * n, 0, 0)
					},
					p: {
						root: U(0, -.42 * t, .05 * n),
						head: U(.12 * r, -.55 * r, .35 * r),
						armU1: U(.15 * n, -.35 * n, .05 * n),
						"armU-1": U(-.2 * n, -.3 * n, .1 * n)
					}
				};
			}),
			q(t, "Cast", 1.2, (e) => {
				let t = Y(.05, .4, .9, e), n = Math.max(0, J(e * 3)) * t;
				return {
					q: {
						armU1: K(-.6 * t, 0, .12 + 1 * t),
						"armU-1": K(-.6 * t, 0, -.12 - 1 * t),
						armL1: K(-.6 * t, 0, 0),
						"armL-1": K(-.6 * t, 0, 0),
						chest: K(-.3 * t, 0, 0),
						head: K(-.4 * t, 0, 0)
					},
					p: { root: U(0, .04 * n, 0) }
				};
			})
		]
	};
}
function Fd(e = {}) {
	let t = !!e.gulper, n = new ud(e.seed || (t ? 53 : 51)), r = new P(e.skin || (t ? "#4a4e38" : "#5c4430")), i = new P(e.skinHi || (t ? "#686c4e" : "#7e6446")), a = new P(e.blot || (t ? "#2c3020" : "#352416")), o = new P(e.belly || (t ? "#a89a74" : "#d2b886")), s = new P(t ? "#7e7254" : "#a48a5e"), c = new P("#d6cab0"), l = new P("#8e826a"), u = new P("#2a0a0c"), d = new P("#3e1618"), f = new P("#140c08"), p = new P(t ? "#8a4c48" : "#b06c64"), h = new P(t ? "#b07068" : "#d08e84"), g = new P(e.eyes || (t ? "#b0a028" : "#c89430")), _ = (e, t) => t.y < -.3 || t.z > .25 && e.z > .1 && e.y < .25 && Math.abs(e.x) < .13, v = (e, t) => {
		if (_(e, t)) return t.y < -.65 ? s : o;
		let n = t.y > .5 ? yd(r, i, (t.y - .5) * 1.8) : r;
		return gd(Math.round(e.x * 16), Math.round(e.y * 16), Math.round(e.z * 16), 9) > .6 ? yd(n, a, .8) : n;
	}, y = (e, t) => new M(1, 7, 5).scale(t[0], t[1], t[2]).translate(e.x, e.y, e.z), b = n.bone("root", null, U(0, .18, 0)), x = n.bone("pelvis", b, U(0, .15, -.15)), S = n.bone("chest", b, U(0, .2, .1)), C = n.bone("head", S, U(0, .28, .22));
	n.bone("jaw", C, U(0, .232, .17)), n.bone("throat", S, U(0, .165, .2));
	let w = t ? .86 : .34, T = U(0, .228, .29), E = n.by.get("jaw"), D = [
		0,
		1,
		2,
		3
	].map((e) => T.clone().add(U(0, 0, w * e / 3)));
	D.forEach((e, t) => {
		E = n.bone(`tongue${t + 1}`, E, e);
	});
	for (let e of [1, -1]) {
		let t = n.bone(`armU${e}`, S, U(.12 * e, .18, .15)), r = n.bone(`armL${e}`, t, U(.17 * e, .09, .2));
		n.bone(`hand${e}`, r, U(.165 * e, .025, .25));
		let i = n.bone(`legU${e}`, x, U(.11 * e, .14, -.16)), a = n.bone(`legL${e}`, i, U(.23 * e, .1, -.02));
		n.bone(`foot${e}`, a, U(.17 * e, .045, -.2));
	}
	let ee = [
		[-.28, 0],
		[-.27, .06],
		[-.24, .115],
		[-.19, .158],
		[-.11, .188],
		[-.01, .198],
		[.07, .19],
		[.14, .166],
		[.2, .126],
		[.235, .07],
		[.25, 0]
	], O = .74, te = (e) => .17 + .27 * e, k = (e) => {
		for (let t = 0; t < ee.length - 1; t++) if (e <= ee[t + 1][0]) {
			let [n, r] = ee[t], [i, a] = ee[t + 1];
			return r + (a - r) * (e - n) / Math.max(1e-6, i - n);
		}
		return 0;
	}, ne = (e, t) => {
		for (let n = 0; n < t.length - 1; n++) {
			let [r, i] = t[n], [a, o] = t[n + 1];
			if (e <= a) {
				let t = Math.max(0, Math.min(1, (e - r) / (a - r)));
				return t < .5 ? [[i, 1 - t], [o, t]] : [[o, t], [i, 1 - t]];
			}
		}
		return [[t[t.length - 1][1], 1]];
	}, A = n.skin((e) => ne(e.z, [
		[-.2, "pelvis"],
		[-.08, "pelvis"],
		[.02, "root"],
		[.08, "root"],
		[.16, "chest"],
		[.3, "chest"]
	]));
	n.part(_d(ee, 30, te, O), A, v);
	let re = (e, t, n = 1) => {
		let r = k(e) * n;
		return {
			at: U(Math.sin(t) * r, te(e) + Math.cos(t) * r * O, e),
			out: U(Math.sin(t), Math.cos(t) * O, 0).normalize()
		};
	};
	for (let e = 0; e < (t ? 26 : 30); e++) {
		let o = gd(e, 3, 1, 11), s = gd(e, 5, 2, 12), c = gd(e, 7, 3, 13), { at: l, out: u } = re(-.22 + .38 * o, (s - .5) * 2.6, .97), d = (t ? .012 : .011) + .012 * c;
		n.part(y(l.clone().addScaledVector(u, d * .25), [
			d,
			d * .7,
			d
		]), A, c > .55 ? a : yd(r, i, .4));
	}
	for (let e = 0; e < (t ? 6 : 7); e++) for (let i of [1, -1]) {
		let o = -.2 + e * (t ? .064 : .055), s = gd(e, i, 4, 14), { at: u, out: d } = re(o, i * (.3 + .05 * s), .96), f = (t ? .07 : .036) * (1 - Math.abs(e - 3) * .1) * (.85 + .3 * s), p = d.clone().add(U(0, .35, -.9)).normalize();
		n.part(G(u.clone().addScaledVector(d, -.01), u.clone().addScaledVector(p, f), t ? .02 : .016, .002, 5), A, t ? (e) => e.distanceTo(u) > f * .5 ? c : l : yd(a, r, .3));
	}
	n.part(W(U(0, .288, .235), [
		.152,
		.076,
		.132
	], [14, 9]), "head", v), n.part(W(U(0, .278, .315), [
		.112,
		.056,
		.07
	], [12, 8]), "head", v);
	for (let e of [1, -1]) n.part(W(U(.032 * e, .312, .372), [
		.008,
		.005,
		.006
	], [5, 3]), "head", f);
	let ie = [];
	for (let e = 0; e <= 14; e++) {
		let t = -1.5 + 3 * e / 14, n = Math.abs(t) / 1.5;
		ie.push(U(.137 * Math.sin(t), .256 - .02 * n * n, .236 + .141 * Math.cos(t)));
	}
	n.part(md(ie, [
		.004,
		.0048,
		.0048,
		.004
	], ["head"]).g, "head", t ? d : f), n.part(W(U(0, .232, .262), [
		.136,
		.044,
		.118
	], [12, 7]), "jaw", (e, t) => t.y > .5 ? u : o), n.part(W(U(0, .165, .2), [
		.128,
		.098,
		.1
	], [12, 9]), "throat", (e, t) => t.y < -.5 ? s : o);
	for (let e = 0; e < 4; e++) n.part(md([
		U(-.1, .13 + e * .022, .25 + e * .012),
		U(0, .122 + e * .022, .29 + e * .008),
		U(.1, .13 + e * .022, .25 + e * .012)
	], [.004, .004], ["throat"], 5, 8).g, "throat", s);
	for (let e of [1, -1]) {
		let r = U(.104 * e, t ? .336 : .34, .24), i = t ? .03 : .038, a = U(.66 * e, .22, .72).normalize();
		n.part(W(r.clone().add(U(-.01 * e, -.014, -.008)), [
			i * 1.25,
			i * 1.05,
			i * 1.25
		], [10, 7]), "head", v), n.part(W(r.clone().addScaledVector(a, i * .35), [
			i,
			i,
			i
		], [9, 7]), "head", g, !0);
		let o = W(U(0, 0, 0), [
			i * .16,
			i * .74,
			i * .12
		], [6, 6]);
		o.applyQuaternion(new m().setFromUnitVectors(U(0, 0, 1), a));
		let s = r.clone().addScaledVector(a, i * 1.3);
		o.translate(s.x, s.y, s.z), n.part(o, "head", f), n.part(vd(W(U(0, 0, 0), [
			i * 1.08,
			i * .34,
			i * .95
		], [10, 5]), .6 * e, r.clone().add(U(.004 * e, i * .66, -i * .05))), "head", v), t && n.part(vd(W(U(0, 0, 0), [
			.05,
			.022,
			.035
		], [8, 5]), .4 * e, U(.08 * e, .37, .27)), "head", v);
	}
	if (t) {
		for (let e of [1, -1]) {
			let t = [
				U(.1 * e, .33, .22),
				U(.15 * e, .42, .19),
				U(.17 * e, .51, .12),
				U(.13 * e, .57, .04)
			];
			n.part(md(t, [
				.034,
				.026,
				.014,
				.002
			], ["head"], 8, 16).g, "head", (e) => e.y > .47 ? c : yd(l, c, (e.y - .33) * 7));
			let r = [
				U(.06 * e, .34, .14),
				U(.08 * e, .4, .1),
				U(.07 * e, .45, .04)
			];
			n.part(md(r, [
				.02,
				.012,
				.002
			], ["head"], 7, 10).g, "head", c);
		}
		n.part(W(U(0, .246, .27), [
			.124,
			.03,
			.104
		], [10, 6]), "head", u);
		for (let e = 0; e <= 10; e++) {
			let t = -1.25 + 2.5 * e / 10, r = U(.128 * Math.sin(t), .258, .236 + .132 * Math.cos(t)), i = e === 2 || e === 8, a = i ? .075 : .04 + .012 * gd(e, 1, 1, 15);
			n.part(G(r, r.clone().add(U(-.08 * Math.sin(t) * a, -a, -.04 * a)), i ? .015 : .011, .001, 5), "head", c);
			let o = U(.122 * Math.sin(t), .246, .248 + .124 * Math.cos(t));
			e % 2 == 0 && n.part(G(o, o.clone().add(U(0, .04 + .012 * gd(e, 2, 2, 16), .006)), .011, .001, 5), "jaw", c);
		}
	}
	let j = md([
		T.clone().add(U(0, 0, -.03)),
		...D.slice(1),
		D[3].clone().add(U(0, 0, .02))
	], t ? [
		.03,
		.026,
		.021,
		.018
	] : [
		.022,
		.018,
		.016
	], [
		"tongue1",
		"tongue2",
		"tongue3",
		"tongue4"
	], 8, 20);
	n.part(j.g, n.skin(j.skin), (e, t) => t.y > .4 ? h : p);
	let ae = D[3].clone().add(U(0, 0, .02));
	if (t) {
		n.part(W(ae.clone().add(U(0, 0, .01)), [
			.036,
			.03,
			.03
		], [8, 6]), "tongue4", p), n.part(G(ae.clone().add(U(0, 0, .02)), ae.clone().add(U(0, 0, .13)), .04, .002, 6), "tongue4", c);
		for (let e = 0; e < 6; e++) {
			let t = e / 6 * bd + .3, r = ae.clone().add(U(.03 * Math.cos(t), .03 * Math.sin(t), .02 + e % 2 * .035));
			n.part(G(r, r.clone().add(U(.045 * Math.cos(t), .045 * Math.sin(t), -.04)), .011, .001, 4), "tongue4", c);
		}
	} else n.part(W(ae.clone().add(U(0, .004, .012)), [
		.03,
		.014,
		.026
	], [8, 5]), "tongue4", h);
	let oe = (e, t, a, o, s, c, l = .25) => {
		for (let u = 0; u < o; u++) {
			let d = (u - (o - 1) / 2) * .42 + l * a, f = U(Math.sin(d), 0, Math.cos(d)), p = e.clone().addScaledVector(f, .012), m = e.clone().addScaledVector(f, s * (u === 1 || u === 2 ? 1 : .8));
			m.y = .008, n.part(G(p, m, c, c * .7, 4), t, v), n.part(y(m, [
				c * 1.25,
				c * .85,
				c * 1.25
			]), t, yd(r, i, .5));
		}
	};
	for (let e of [1, -1]) n.part(G(U(.12 * e, .19, .15), U(.17 * e, .09, .2), .05, .038, 9), `armU${e}`, v), n.part(W(U(.17 * e, .09, .2), [
		.04,
		.04,
		.04
	], [8, 6]), `armL${e}`, v), n.part(G(U(.17 * e, .09, .2), U(.165 * e, .025, .25), .036, .026, 8), `armL${e}`, v), n.part(W(U(.165 * e, .022, .255), [
		.032,
		.016,
		.03
	], [8, 5]), `hand${e}`, v), oe(U(.165 * e, .014, .26), `hand${e}`, e, 4, t ? .075 : .068, .011), n.part(W(U(.16 * e, .13, -.11), [
		.085,
		.095,
		.13
	], [12, 9]).rotateY(0), `legU${e}`, v), n.part(G(U(.12 * e, .14, -.16), U(.23 * e, .1, -.02), .075, .05, 9), `legU${e}`, v), n.part(W(U(.23 * e, .1, -.02), [
		.05,
		.05,
		.05
	], [8, 6]), `legL${e}`, v), n.part(G(U(.23 * e, .1, -.02), U(.17 * e, .045, -.2), .046, .03, 8), `legL${e}`, v), n.part(W(U(.17 * e, .03, -.18), [
		.035,
		.022,
		.045
	], [8, 5]), `foot${e}`, v), oe(U(.18 * e, .014, -.15), `foot${e}`, e, 4, t ? .13 : .12, .012, .55), n.part(W(U(.22 * e, .008, -.08), [
		.05,
		.004,
		.05
	], [8, 3]).rotateY(0), `foot${e}`, yd(r, a, .4));
	let se = n.mesh(g.getStyle(), t ? .8 : .6), ce = (e, t = 0) => e <= .001 ? {
		s: { tongue1: U(.3, .3, .02) },
		q: { tongue1: K(0, 0, 0) }
	} : {
		s: { tongue1: U(.55 + .45 * e, .55 + .45 * e, Math.max(.02, e)) },
		q: { tongue1: K(-t, 0, 0) }
	}, le = (e, t) => ({
		q: {
			...e.q || {},
			...t.q || {}
		},
		p: {
			...e.p || {},
			...t.p || {}
		},
		s: {
			...e.s || {},
			...t.s || {}
		}
	}), ue = (e) => ({ s: { throat: U(1 + .25 * e, 1 + .32 * e, 1 + .28 * e) } }), de = (e, t = 1) => {
		let n = Y(0, .18, .45, e), r = Y(.12, .35, .6, e), i = Y(.5, .62, .85, e), a = {};
		for (let e of [1, -1]) a[`legU${e}`] = K(.35 * n * t, e * .95 * n * t, 0), a[`legL${e}`] = K(-.25 * n * t, e * 1.15 * n * t, 0), a[`foot${e}`] = K(.8 * n * t, 0, 0), a[`armU${e}`] = K(-.85 * r * t + .25 * i * t, 0, 0), a[`armL${e}`] = K(.45 * r * t, 0, 0);
		return {
			q: {
				...a,
				root: K(-.32 * r * t + .1 * i * t, 0, 0),
				head: K(.14 * r * t, 0, 0)
			},
			p: { root: U(0, (.11 * r - .025 * i) * t, .05 * r * t) }
		};
	}, fe = t ? .22 : .02;
	return {
		root: se,
		clips: [
			q(n, "Idle", 5, (e) => {
				let n = Math.max(0, J(e * 9)), r = Y(.2, .3, .52, e), i = J((e - .2) / .32 * .5 + .25) * r, a = Y(.62, .645, .7, e), o = Y(.8, .84, .92, e), s = Y(.06, .12, .18, e), c = fe + .05 * J(e * 3) * !!t + .25 * a;
				return le(le(ce(a, c), ue(.35 * n + .9 * s)), {
					q: {
						head: K(-.05 * s - .06 * a, .35 * i, .06 * i),
						chest: K(0, .08 * i, 0),
						jaw: K(c, 0, 0),
						armU1: K(-.3 * o, 0, .1 * o),
						armL1: K(.35 * o, 0, 0)
					},
					p: {
						root: U(0, .003 * n, 0),
						armU1: U(0, .015 * o, 0)
					}
				});
			}),
			q(n, "Walk", .55, (e) => le(le(de(e), ce(0)), { q: { jaw: K(fe, 0, 0) } })),
			q(n, "Attack", t ? .85 : .6, (e) => {
				if (t) {
					let t = Y(0, .25, .38, e), n = Sd(.3, .42, e) * (1 - Sd(.58, .85, e)), r = .8 * Y(.15, .32, .7, e);
					return le(ce(n, fe + r), {
						q: {
							root: K(-.12 * t + .06 * n, 0, 0),
							head: K(-.35 * t + .2 * n, 0, 0),
							jaw: K(fe + r, 0, 0),
							armU1: K(.15 * t, 0, 0),
							"armU-1": K(.15 * t, 0, 0)
						},
						p: { root: U(0, .01 * t, -.03 * t + .05 * n) }
					});
				}
				let n = Y(0, .18, .3, e), r = Y(.22, .4, .75, e), i = Y(.2, .3, .45, e), a = .7 * Y(.15, .32, .55, e);
				return le(ce(i, a), {
					q: {
						root: K(-.1 * n + .12 * r, 0, 0),
						head: K(-.2 * n + .15 * r, 0, 0),
						jaw: K(a, 0, 0),
						armU1: K(-.4 * r, 0, 0),
						"armU-1": K(-.4 * r, 0, 0)
					},
					p: { root: U(0, .03 * r, .12 * r - .03 * n) }
				});
			}),
			q(n, "Attack2", .6, (e) => {
				let n = Y(.15, .38, .8, e), r = (t ? .7 : .6) * Y(.2, .36, .6, e);
				return le(ce(0), {
					q: {
						root: K(.14 * n, .1 * n, 0),
						head: K(.2 * n, 0, 0),
						jaw: K(fe + r, 0, 0),
						armU1: K(-.9 * Y(.1, .3, .5, e), 0, .2),
						armL1: K(.6 * Y(.1, .3, .5, e), 0, 0)
					},
					p: { root: U(0, -.015 * n, .05 * n) }
				});
			}),
			q(n, "Heavy", t ? 1.1 : .95, (e) => {
				let t = Y(0, .22, .34, e), n = Y(.28, .48, .72, e), r = Y(.66, .74, .95, e), i = .7 * Y(.3, .5, .8, e);
				return le(le(de(Math.min(1, Sd(.28, .72, e) * .6), 1.3 * n), ce(0)), {
					q: {
						root: K(.12 * t - .3 * n + .12 * r, 0, 0),
						jaw: K(fe + i, 0, 0)
					},
					p: { root: U(0, -.035 * t + .2 * n - .03 * r, .36 * Sd(.28, .74, e)) },
					s: { throat: U(1 + .15 * r, 1 - .2 * r, 1 + .15 * r) }
				});
			}),
			q(n, "Hit", .42, (e) => {
				let t = Y(0, .22, 1, e);
				return le(le(ce(0), ue(-.2 * t)), {
					q: {
						root: K(-.16 * t, .12 * t, .06 * t),
						head: K(-.25 * t, -.2 * t, 0),
						jaw: K(fe + .3 * t, 0, 0)
					},
					p: { root: U(0, .025 * t, -.06 * t) }
				});
			}),
			q(n, "Death", 1.3, (e) => {
				let t = Sd(.05, .55, e), n = Sd(.4, 1, e), r = .3 * J(e * 7) * (1 - n) * t, i = {};
				for (let e of [1, -1]) i[`legU${e}`] = K(-.5 * t + r, e * .6 * t, 0), i[`legL${e}`] = K(0, e * .8 * t, 0), i[`armU${e}`] = K(-.8 * t - r, 0, e * .3 * t);
				return le(ce(.25 * t, .6 * t), {
					q: {
						...i,
						root: K(0, 0, 2.9 * t),
						head: K(.4 * t, 0, 0),
						jaw: K(fe + .6 * t, 0, 0)
					},
					p: { root: U(0, .16 * Y(.05, .3, .55, e) + .17 * t, 0) }
				});
			}),
			q(n, "Cast", 1, (e) => {
				let n = Y(.05, .35, .9, e), r = Math.max(0, J(e * 4)) * n;
				return le(le(ce(0), ue(1.6 * n + .3 * r)), {
					q: {
						head: K(-.3 * n, 0, 0),
						root: K(-.1 * n, 0, 0),
						jaw: K(fe + (t ? .8 : .15) * n, 0, 0)
					},
					p: { root: U(0, .02 * n, 0) }
				});
			})
		]
	};
}
var Id = {
	rat: Cd,
	spider: Ed,
	beetle: Dd,
	goblin: Od,
	wraith: Md,
	golem: Pd,
	toad: Fd,
	gulper: (e = {}) => Fd({
		...e,
		gulper: !0
	}),
	ratking: (e = {}) => Cd({
		fur: "#3a342e",
		belly: "#5a5048",
		furTop: "#544c44",
		eyes: "#ff3818",
		seed: 17,
		...e,
		king: !0
	}),
	spiderqueen: (e = {}) => Ed({
		body: "#1e1622",
		band: "#6a4864",
		mark: "#e2d8c2",
		eyes: "#78c038",
		seed: 37,
		...e,
		queen: !0
	}),
	hound: kd,
	furnace: Ad
};
Object.keys(Id);
var Ld = {
	armU: "upperarm",
	armL: "lowerarm",
	hand: "hand",
	fist: "hand",
	legU: "upperleg",
	legL: "lowerleg",
	foot: "foot"
}, Rd = {
	root: "hips",
	spine: "spine",
	chest: "chest",
	neck: "chest",
	head: "head"
}, zd = (e) => {
	let t = /^(armU|armL|hand|fist|legU|legL|foot)(-?1)$/.exec(e);
	return t ? Ld[t[1]] + (t[2] === "1" ? "l" : "r") : Rd[e] || null;
};
async function Bd(e, t, n) {
	let r = await n(`./models/${t.model}.glb`), i = r.scene, a = null;
	i.traverse((e) => {
		e.isSkinnedMesh && !a && (a = e);
	});
	let o = a.skeleton.bones, s = new Map(o.map((e) => [e.name.replace(/\./g, ""), e]));
	{
		let e = [];
		i.traverse((t) => {
			t.isMesh && e.push(t);
		});
		for (let t of e) t.parent.remove(t);
	}
	let c = (e) => {
		let n = r.animations.find((t) => t.name === e);
		if (!n) throw Error(`${t.model}: no clip ${e}`);
		return n;
	}, l = new qe(i);
	l.clipAction(c(t.clips.Idle)).play(), l.setTime(0), i.updateMatrixWorld(!0);
	let u = [];
	e.root.traverse((e) => {
		e.isBone && u.push(e);
	});
	let d = s.get("hips"), f = d.position.clone(), p = /* @__PURE__ */ new Map();
	for (let e of u) {
		let t = zd(e.name);
		t && e.name !== "neck" && (p.set(t, e.userData.at), t.startsWith("hand") && p.set("wrist" + t.slice(-1), e.userData.at));
	}
	i.traverse((e) => {
		if (!e.isBone) return;
		let t = e.name.replace(/\./g, ""), n = p.get(t);
		n && (e.parent.updateMatrixWorld(!0), e.position.copy(e.parent.worldToLocal(n.clone())), e.updateMatrixWorld(!0), e.userData.fit = e.position.toArray());
	}), d.userData.fitHips = {
		rest: f.toArray(),
		k: d.position.length() / Math.max(1e-6, f.length()) * (t.hips ?? 1)
	};
	let h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = new m();
	for (let e of u) {
		let t = zd(e.name);
		if (t) {
			h.set(e.name, s.get(t));
			continue;
		}
		let n = h.get(e.parent.name), r = new ge();
		r.name = e.name, n.add(r), n.updateMatrixWorld(!0), r.position.copy(n.worldToLocal(e.userData.at.clone())), n.getWorldQuaternion(_), r.quaternion.copy(_.invert()), r.updateMatrixWorld(!0), h.set(e.name, r), g.set(e.name, r.quaternion.clone());
	}
	let v = new j();
	v.add(i), v.updateMatrixWorld(!0);
	let b = [...o, ...[...g.keys()].map((e) => h.get(e))], x = new y(b);
	e.root.traverse((e) => {
		if (!e.isSkinnedMesh) return;
		let t = e.skeleton.bones.map((e) => b.indexOf(h.get(e.name))), n = e.geometry.attributes.skinIndex, r = new Uint16Array(n.count * 4);
		for (let e = 0; e < n.count; e++) for (let i = 0; i < 4; i++) r[e * 4 + i] = t[n.getComponent(e, i)];
		let i = e.geometry.clone();
		i.setAttribute("skinIndex", new ve(r, 4));
		let a = new Ke(i, e.material);
		a.name = e.name, a.userData = { ...e.userData }, a.frustumCulled = !1, v.add(a), a.updateMatrixWorld(!0), a.bind(x, a.matrixWorld);
	});
	let S = Object.entries(t.clips).filter(([, e]) => r.animations.some((t) => t.name === e)).map(([t, n]) => {
		let r = c(n).clone(), i = e.clips.find((e) => e.name === t);
		if (r.name = t, i) for (let e of i.tracks) {
			let [t, n] = e.name.split(".");
			if (n !== "quaternion" || !g.has(t)) continue;
			let a = g.get(t), o = e.values.slice(), s = new m();
			for (let e = 0; e < o.length; e += 4) s.fromArray(o, e), s.premultiply(a).toArray(o, e);
			r.tracks.push(new oe(e.name, Array.from(e.times, (e) => e * r.duration / i.duration), o));
		}
		return r;
	});
	return {
		root: v,
		mixer: new qe(v),
		clips: S,
		frame: null,
		creature: e.kind,
		rig: t.model
	};
}
async function Vd(e, t) {
	let { root: n, clips: r } = Id[e.kind](e);
	return e.rig && t ? Bd({
		root: n,
		clips: r,
		kind: e.kind
	}, e.rig, t) : {
		root: n,
		mixer: new qe(n),
		clips: r,
		frame: null,
		creature: e.kind
	};
}
function Hd(e) {
	e.traverse((e) => {
		if (!e.isBone) return;
		let t = e.userData.fitHips, n = e.userData.fit;
		if (t) {
			let r = t.rest;
			e.position.set(n[0] + (e.position.x - r[0]) * t.k, n[1] + (e.position.y - r[1]) * t.k, n[2] + (e.position.z - r[2]) * t.k);
		} else n && e.position.set(n[0], n[1], n[2]);
	});
}
//#endregion
//#region ember3d/gear.js
var Ud = (e, t) => nl(e, t), Wd = {
	sword: { mesh: ["Knight", "1H_Sword"] },
	axe: { mesh: ["Barbarian", "1H_Axe"] },
	greatsword: { mesh: ["Knight", "2H_Sword"] },
	greataxe: { mesh: ["Barbarian", "2H_Axe"] },
	falx: { file: "Skeleton_Blade.gltf" },
	cleaver: { file: "Skeleton_Axe.gltf" },
	roundshield: { mesh: ["Knight", "Round_Shield"] },
	kite: { mesh: ["Knight", "Badge_Shield"] },
	tower: { mesh: ["Knight", "Rectangle_Shield"] },
	spiked: { mesh: ["Knight", "Spike_Shield"] },
	targe: { mesh: ["Barbarian", "Barbarian_Round_Shield"] },
	bonebuckler: { file: "Skeleton_Shield_Small_A.gltf" },
	greathelm: { mesh: ["Knight", "Knight_Helmet"] },
	furhood: { mesh: ["Barbarian", "Barbarian_Hat"] },
	dagger: { mesh: ["Rogue", "Knife"] },
	handbow: {
		mesh: ["Rogue", "1H_Crossbow"],
		quiver: "boltcase"
	},
	heavybow: {
		mesh: ["Rogue", "2H_Crossbow"],
		quiver: "boltcase"
	},
	bonebow: {
		file: "Skeleton_Crossbow.gltf",
		quiver: "boltcase"
	},
	huntbow: {
		prop: "huntbow",
		quiver: "quiver"
	},
	longbow: {
		prop: "longbow",
		quiver: "quiver"
	},
	offdagger: { mesh: ["Rogue", "Knife_Offhand"] },
	hood: {
		prop: "hood",
		keepOn: "Rogue_Hooded"
	},
	wand: {
		mesh: ["Mage", "1H_Wand"],
		hang: "up",
		scale: 1.35
	},
	staff: {
		mesh: ["Mage", "2H_Staff"],
		hang: "up",
		lift: .32
	},
	bonestaff: {
		file: "Skeleton_Staff.gltf",
		hang: "up",
		lift: .32
	},
	tome: { mesh: ["Mage", "Spellbook"] },
	witchhat: { mesh: ["Mage", "Mage_Hat"] },
	mace: { prop: "mace" },
	chapelsword: { prop: "chapelsword" },
	psalter: { prop: "psalter" },
	hours: { prop: "hours" },
	coif: { prop: "coif" },
	spiritstaff: { prop: "spiritstaff" },
	antlerrod: {
		prop: "antlerrod",
		hang: "up",
		scale: 1.3
	},
	fetish: { prop: "fetish" },
	hidecowl: { prop: "hidecowl" },
	amulet: {
		prop: "amulet",
		bone: "chest"
	},
	charm: {
		prop: "charm",
		bone: "hips"
	}
}, Gd = {
	weapon: "handslot.r",
	off: "handslot.l",
	helm: "head"
}, Kd = [
	{
		tile: [0, 1],
		to: ["#f2ecdd", "#a39883"]
	},
	{
		tile: [7, 1],
		to: ["#cfa65c", "#6a5022"]
	},
	{
		tile: [2, 1],
		to: ["#b6bec9", "#5c6474"]
	},
	{
		tile: [2, 2],
		to: ["#ecd07a", "#8a6424"]
	},
	{
		tile: [1, 2],
		to: ["#8a5a3a", "#3a2016"]
	}
], qd = [
	{
		tile: [0, 1],
		to: ["#8a7a5e", "#2e2618"]
	},
	{
		tile: [1, 1],
		to: ["#7a6a50", "#262016"]
	},
	{
		tile: [2, 1],
		to: ["#6a5034", "#22160c"]
	},
	{
		tile: [1, 2],
		to: ["#cfc3a4", "#5a5040"]
	},
	{
		tile: [7, 1],
		to: ["#4a5a3a", "#16200e"]
	},
	{
		tile: [2, 2],
		to: ["#4a5a3a", "#16200e"]
	}
], Jd = {
	plate: { kit: "Knight" },
	furmail: { kit: "Barbarian" },
	leathers: { kit: "Rogue" },
	robes: { kit: "Mage" },
	vestments: {
		kit: "Mage",
		swatches: Kd
	},
	hiderobes: {
		kit: "Mage",
		swatches: qd
	},
	sabatons: { kit: "Knight" },
	furboots: { kit: "Barbarian" },
	softboots: { kit: "Rogue" },
	slippers: { kit: "Mage" },
	pilgrimboots: {
		kit: "Mage",
		swatches: Kd
	},
	wrapboots: {
		kit: "Mage",
		swatches: qd
	}
}, Yd = {
	armor: [
		"Body",
		"ArmLeft",
		"ArmRight"
	],
	boots: ["LegLeft", "LegRight"]
}, Xd = (e) => e.replace(/_Hooded$/, ""), Zd = {
	common: 0,
	fine: .07,
	rare: .13,
	heirloom: .21
}, Qd = { heirloom: !0 }, $d = .02, ef = /* @__PURE__ */ new Map();
async function tf(e, t) {
	if (e.prop) {
		let t = Hc[e.prop]();
		return !e.bone && !e.head && (t.position.y = .033, t.userData.held = !0), t;
	}
	if (e.file) return (await t(`./models/${e.file}`)).scene;
	let n = e.mesh.join("/"), r = ef.get(n);
	r || (r = t(`./models/${e.mesh[0]}.glb`).then((t) => t.scene.getObjectByName(e.mesh[1]) || null), ef.set(n, r));
	let i = await r;
	if (!i) return null;
	let a = i.clone();
	return a.visible = !0, a.position.copy(i.position), a.quaternion.copy(i.quaternion), a.scale.copy(i.scale), a;
}
var nf = { Mage_Hat: {
	rx: -.24,
	dy: .05,
	dz: 0
} };
function rf(e, t) {
	let n = e.userData.helm, r = n ? new F(1, t.sy, 1) : new F(t.sx, t.sy, t.sz);
	if (e.scale.multiply(r), e.position.multiply(r), n) {
		e.position.z -= .08;
		for (let t of e.children) t.userData.onFace && (t.name.endsWith("_Band") ? t.scale.y += .08 : t.position.z += .08);
	}
	let i = nf[e.name];
	i && (e.rotateX(i.rx), e.position.y += i.dy, e.position.z += i.dz);
}
function af(e, t) {
	let n = Math.max(0, Math.min(5, t.up || 0)), r = (Zd[t.r] || 0) + n * $d;
	r && e.traverse((e) => {
		if (!e.isMesh || !e.material || !e.material.emissive) return;
		let n = e.material = e.material.clone();
		n.map ? (n.emissive = new P(1, 1, 1), n.emissiveMap = n.map) : n.emissive = (n.color || new P(1, 1, 1)).clone(), n.emissiveIntensity = r, n.userData.rarity = r, Qd[t.r] && (n.userData.shine = r), e.userData.glow = !0;
	});
}
async function of(e, t, n, r, i = {}) {
	for (let r of ["armor", "boots"]) r in t && await sf(e, r, t[r], n, i);
	for (let [a, o] of Object.entries(Gd)) {
		if (!(a in t)) continue;
		let s = t[a], c = s && Wd[s.base];
		if (c && (c.keep || c.keepOn && i.model === c.keepOn)) continue;
		let l = r(e, o);
		if (!l) continue;
		for (let e of l.children) !e.userData.face && e.name !== "Face" && (e.visible = !1);
		if (a === "helm") {
			let t = e.getObjectByName("Hair");
			t && c && (t.visible = !1);
		}
		if (!c) continue;
		let u = await tf(a === "helm" ? {
			...c,
			head: !0
		} : c, n);
		if (u) {
			if (c.scale && u.scale.multiplyScalar(c.scale), c.hang) {
				let e = new j();
				e.position.copy(u.position), u.position.set(0, c.lift || 0, 0), e.add(u), e.userData.hang = c.hang, u = e;
			}
			if (a === "helm") {
				let e = l.children.find((e) => e.name === "Face" && e.userData.fit)?.userData.fit;
				e && rf(u, e);
			}
			af(u, s), l.add(u);
		}
	}
	let a = [];
	"trinket" in t && t.trinket && Wd[t.trinket.base] && Wd[t.trinket.base].bone && a.push([Wd[t.trinket.base], t.trinket]);
	let o = t.weapon && Wd[t.weapon.base];
	o && o.quiver && a.push([{
		prop: o.quiver,
		bone: o.quiver === "quiver" ? "chest" : "hips"
	}, { r: "common" }]);
	for (let [t, i] of a) {
		let a = r(e, t.bone);
		if (!a) continue;
		let o = await tf(t, n);
		o && (af(o, i), a.add(o));
	}
}
async function sf(e, t, n, r, i) {
	let a = n && Jd[n.base];
	if (!a || !i.model) return;
	let o = Xd(i.model);
	if (a.kit === o && JSON.stringify(a.swatches || null) === JSON.stringify(i.swatches || null)) return;
	let s = /* @__PURE__ */ new Map();
	e.traverse((e) => {
		e.isSkinnedMesh && s.set(e.name, e);
	});
	let c = [...s.values()][0];
	if (!c) return;
	let l = (await r(`./models/${a.kit}.glb`)).scene;
	for (let e of Yd[t]) {
		let t = l.getObjectByName(`${a.kit}_${e}`), n = s.get(`${o}_${e}`);
		if (!t || !t.isSkinnedMesh || !n) continue;
		let r = new Ke(t.geometry, t.material);
		r.name = t.name, r.position.copy(t.position), r.quaternion.copy(t.quaternion), r.scale.copy(t.scale), r.castShadow = n.castShadow, r.frustumCulled = !1, r.userData.foreign = !0, n.parent.add(r), r.bind(new y(c.skeleton.bones, t.skeleton.boneInverses), t.bindMatrix.clone()), n.visible = !1, a.swatches && (r.userData.foreign = !1, Ud(r, a.swatches), r.userData.foreign = !0);
	}
}
//#endregion
//#region ember3d/figure.js
var cf = {
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
}, lf = {
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
function uf(e) {
	e.traverse((e) => {
		if (!e.isBone) return;
		let t = e.name.replace(/\.?(l|r)$/, "");
		lf.scale[t] && e.scale.multiplyScalar(lf.scale[t]), lf.reach[t] && e.position.multiplyScalar(lf.reach[t]);
	});
}
var df = /Sword|Axe|Shield|Crossbow|Knife|Throwable|Spellbook|Wand|Staff|Mug/;
function ff(e, t, n) {
	if (!t.height) {
		let t = new Ve().setFromObject(e);
		return {
			box: t,
			ppu: n / (t.max.y - t.min.y)
		};
	}
	let r = new Ve(), i = (e) => {
		for (let t = e; t; t = t.parent) if (t.userData.held || t !== e && df.test(t.name) || df.test(e.name)) return !0;
		return !1;
	};
	return e.updateMatrixWorld(!0), e.traverse((e) => {
		e.isMesh && e.visible && !i(e) && r.expandByObject(e);
	}), {
		box: r,
		ppu: n * t.height / (r.max.y - r.min.y)
	};
}
var pf = (e, t) => e.getObjectByName(t) || e.getObjectByName(t.replace(/\./g, ""));
function mf(e, t) {
	let n = /* @__PURE__ */ new Map();
	e.traverse((e) => {
		if (!e.isMesh || /Eyes/.test(e.name) || !e.material.map) return;
		let r = n.get(e.material);
		if (!r) {
			let i = e.material.map.image, a = document.createElement("canvas");
			a.width = i.width, a.height = i.height;
			let o = a.getContext("2d");
			o.filter = t, o.drawImage(i, 0, 0);
			let s = new we(a);
			s.flipY = e.material.map.flipY, s.colorSpace = e.material.map.colorSpace, s.magFilter = e.material.map.magFilter, s.minFilter = e.material.map.minFilter, s.wrapS = e.material.map.wrapS, s.wrapT = e.material.map.wrapT, r = e.material.clone(), r.map = s, n.set(e.material, r);
		}
		e.material = r;
	});
}
var hf = {
	thin: {
		w: .9,
		arm: .97
	},
	normal: {
		w: 1,
		arm: 1
	},
	broad: {
		w: 1.08,
		arm: 1.12
	},
	heavy: {
		w: 1.17,
		arm: 1.07
	}
}, gf = {
	short: .94,
	average: 1,
	tall: 1.06
}, _f = [
	"shape",
	"skin",
	"eyes",
	"iris",
	"brows",
	"nose",
	"mouth",
	"ears",
	"hair",
	"hairColor",
	"beard",
	"marks",
	"frame",
	"expression"
];
function vf(e) {
	let t = e && hf[e.build] || hf.normal;
	return {
		w: t.w,
		h: e && gf[e.height] || 1,
		arm: t.arm
	};
}
function yf(e, t) {
	(t.w !== 1 || t.arm !== 1) && e.traverse((e) => {
		if (!e.isBone) return;
		let n = e.name.replace(/\.?(l|r)$/, "");
		n === "head" ? (e.scale.x /= t.w, e.scale.z /= t.w) : n === "upperarm" && (e.position.x *= t.arm);
	});
}
async function bf(e, t) {
	if (typeof e != "string") return e;
	let n = await t();
	if (!n[e]) throw Error(`no face preset "${e}"`);
	return n[e];
}
async function xf(e, t) {
	if (e.creature) return Vd(e.creature, t.load);
	let { far: n = !1, load: r, lod: i = "full" } = t, a = await r(`./models/${e.model}.glb`), o = a.scene, s = cf[e.model] || [];
	if (o.traverse((t) => {
		t.isMesh && (t.frustumCulled = !1, s.includes(t.name) && !(e.show || []).includes(t.name) && (t.visible = !1));
	}), e.body) {
		let i = {
			...e.body,
			face: await bf(e.body.face, t.faces)
		};
		e.body.shape && (i.face = {
			...i.face,
			shape: e.body.shape
		}), await sd(r, o, i, {
			far: n,
			findNode: pf
		});
	} else if (e.face || e.appearance) {
		let a = e.face ? await bf(e.face, t.faces) : {}, s = e.appearance ? {
			...a,
			...Object.fromEntries(_f.map((t) => [t, e.appearance[t]]))
		} : a, { head: c, replaces: l } = await Wu(r, e.model, s, {
			far: n,
			lod: i
		});
		o.traverse((e) => {
			e.isMesh && l.includes(e.name) && (e.visible = !1);
		});
		let u = pf(o, "head"), d = c.userData.fit, f = d ? [...u.children].filter((e) => e.isMesh && e.visible && !e.userData.face) : [];
		for (let e of f) rf(e, d);
		if (f.length) {
			let e = c.getObjectByName("Hair");
			e && (e.visible = !1);
		}
		u.add(c);
	}
	for (let [t, n] of Object.entries(e.attach || {})) {
		let e = await r(`./models/${n}`);
		pf(o, t)?.add(e.scene);
	}
	for (let [t, n] of Object.entries(e.hold || {})) {
		let e = Hc[n]();
		e.position.y = .033, e.userData.held = !0, pf(o, t)?.add(e);
	}
	for (let [t, n] of Object.entries(e.wear || {})) for (let e of [].concat(n)) pf(o, t)?.add(Hc[e]());
	for (let t of e.hide || []) o.traverse((e) => {
		e.name === t && (e.visible = !1);
	});
	return e.skull && o.traverse((e) => {
		e.isMesh && (/_Eyes$/.test(e.name) ? e.userData.part = "eye" : /_Head$/.test(e.name) ? e.userData.part = "skin" : /_Jaw$/.test(e.name) && (e.userData.part = "hair"));
	}), e.gear && await of(o, e.gear, r, pf, e), e.swatches && nl(o, e.swatches), e.recolor && mf(o, e.recolor), e.eyes && o.traverse((t) => {
		t.isMesh && /Eyes/.test(t.name) && (t.material = t.material.clone(), t.material.emissive = new P(e.eyes), t.material.emissiveIntensity = 3);
	}), {
		root: o,
		mixer: new qe(o),
		clips: a.animations,
		frame: e.frame || null,
		look: e.appearance ? vf(e.appearance) : null
	};
}
var Sf = new F();
function Cf(e, t) {
	e.traverse((e) => {
		if (!e.isBone) return;
		let n = e.name.replace(/\.?(l|r)$/, ""), r = t.scale && t.scale[n];
		if (Array.isArray(r) ? e.scale.multiply(Sf.set(r[0], r[1], r[2])) : r && e.scale.multiplyScalar(r), t.reach && t.reach[n] && e.position.multiplyScalar(t.reach[n]), t.bend && t.bend[n]) {
			let [r, i, a] = t.bend[n];
			e.quaternion.multiply(new m().setFromEuler(new w(r, i, a)));
		}
	});
}
var wf = /^(upperleg|lowerleg|foot|toes)(l|r)$/;
function Tf(e, t, n, r, i = null) {
	let a = i && e.clips.find((e) => e.name === i.clip);
	if (a) {
		let t = e._legs ||= [];
		t.length || e.root.traverse((e) => {
			e.isBone && (wf.test(e.name) || e.name === "hips") && t.push({
				b: e,
				hips: e.name === "hips",
				q: new m(),
				y: 0
			});
		}), e.mixer.stopAllAction(), e.mixer.clipAction(a).play(), e.mixer.setTime(i.t * a.duration);
		for (let e of t) e.q.copy(e.b.quaternion), e.y = e.b.position.y;
	}
	e.mixer.stopAllAction();
	let o = e.clips.find((e) => e.name === t) || e.clips.find((e) => e.name === "Idle");
	if (e.mixer.clipAction(o).play(), e.mixer.setTime(n * o.duration), a) for (let t of e._legs) t.hips ? t.b.position.y = t.y : t.b.quaternion.copy(t.q);
	e.creature && Hd(e.root), r && !e.creature && uf(e.root), r && e.frame && Cf(e.root, e.frame), r && e.look && !e.creature && yf(e.root, e.look), e.root.updateMatrixWorld(!0), Af(e.root);
}
var Ef = new m(), Df = new m(), Of = new m().setFromAxisAngle(new F(1, 0, 0), Math.PI), kf = new F(0, 1, 0);
function Af(e) {
	let t = [];
	if (e.traverse((e) => {
		e.userData.hang && t.push(e);
	}), !t.length) return;
	let n = new m().setFromAxisAngle(kf, e.rotation.y);
	for (let e of t) e.parent.getWorldQuaternion(Df), Ef.copy(n), e.userData.hang !== "up" && Ef.multiply(Of), e.quaternion.copy(Df.invert().multiply(Ef));
	e.updateMatrixWorld(!0);
}
var jf = new nt();
function Mf(e, t, n, r) {
	let i = e.geometry.clone();
	if (!i.index) {
		let e = i.attributes.position.count, t = e > 65535 ? new Uint32Array(e) : new Uint16Array(e);
		for (let n = 0; n < e; n++) t[n] = n;
		i.setIndex(new ve(t, 1));
	}
	for (let e of Object.keys(i.attributes)) [
		"position",
		"normal",
		"uv"
	].includes(e) || i.deleteAttribute(e);
	if (i.attributes.normal || i.computeVertexNormals(), !n && i.attributes.uv && i.deleteAttribute("uv"), n && !i.attributes.uv) return null;
	if (i.applyMatrix4(t), r) {
		let t = i.attributes.position.count, n = new Float32Array(t * 3), r = e.material.color || new P(1, 1, 1);
		for (let e = 0; e < t; e++) n[e * 3] = r.r, n[e * 3 + 1] = r.g, n[e * 3 + 2] = r.b;
		i.setAttribute("color", new ve(n, 3));
	}
	return i;
}
function Nf(e, t) {
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
	for (let n of o.values()) {
		if (n.length < 2 || n.some((e) => !e.bindMatrix.equals(n[0].bindMatrix) || !e.matrix.equals(n[0].matrix))) continue;
		let r = t(n.map((e) => {
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
		if (!r) continue;
		let i = new Ke(r, n[0].material);
		i.castShadow = n[0].castShadow, i.name = n.map((e) => e.name).join("+"), (e.userData.ownGeos ||= []).push(r), i.position.copy(n[0].position), i.quaternion.copy(n[0].quaternion), i.scale.copy(n[0].scale), i.frustumCulled = !1, n[0].parent.add(i), i.bind(n[0].skeleton, n[0].bindMatrix);
		for (let e of n) e.parent.remove(e);
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
	for (let { bone: n, kind: r, list: i } of s.values()) {
		if (i.length < 2 && r.startsWith("map")) continue;
		let a = jf.copy(n.matrixWorld).invert(), o = r.startsWith("map"), s = i.map((e) => Mf(e, new nt().multiplyMatrices(a, e.matrixWorld), o, !o));
		if (s.some((e) => !e)) continue;
		let c = t(s);
		if (!c) continue;
		let u = i[0].material, d = o ? u.clone() : r === "basic" ? new tt({
			vertexColors: !0,
			transparent: u.transparent,
			opacity: u.opacity
		}) : new l({
			vertexColors: !0,
			roughness: u.roughness ?? 1,
			metalness: u.metalness ?? 0
		}), f = new N(c, d);
		f.name = `${n.name}:${r.split("|")[0]}`, f.frustumCulled = !1, i.some((e) => e.userData.face) && (f.userData.face = !0), (e.userData.ownGeos ||= []).push(c), n.add(f);
		for (let e of i) e.parent.remove(e);
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
var Pf = .25, Ff = /* @__PURE__ */ new Set([
	"dust",
	"fireflies",
	"sparkle"
]);
Object.assign(globalThis, { __emberGround: {
	foliage(e) {
		return this.scaled += e.length, e.map((e) => ({
			...e,
			scale: (e.scale ?? 1) * Pf
		}));
	},
	scaled: 0,
	size: Pf,
	keeps: (e) => e?.emberExhibit === !0 || !Ff.has(e?.preset),
	dust: !1
} });
//#endregion
//#region ember3d/hires.js
var If = 128, Lf = 512, Rf = /* @__PURE__ */ new Map();
function zf(e) {
	let t = e >>> 0;
	return () => {
		t = t + 1831565813 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
var Bf = (e) => {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t = Math.imul(t ^ e.charCodeAt(n), 16777619);
	return t >>> 0;
}, Vf = (e, t, n) => e < t ? t : e > n ? n : e, Hf = (e, t, n) => e + (t - e) * n;
function Uf(e, t, n, r) {
	let i = new Float32Array(n * n);
	for (let e = 0; e < i.length; e++) i[e] = r();
	return (r, a) => {
		let o = r / e * n, s = a / t * n, c = Math.floor(o), l = Math.floor(s), u = o - c, d = s - l, f = u * u * (3 - 2 * u), p = d * d * (3 - 2 * d), m = (e, t) => i[(t % n + n) % n * n + (e % n + n) % n];
		return Hf(Hf(m(c, l), m(c + 1, l), f), Hf(m(c, l + 1), m(c + 1, l + 1), f), p);
	};
}
function Wf(e, t, n, r = 4, i = 4) {
	let a = [];
	for (let o = 0; o < i; o++) a.push(Uf(e, t, r << o, n));
	return (e, t) => {
		let n = 0, r = .5, i = 0;
		for (let o of a) n += o(e, t) * r, i += r, r *= .5;
		return n / i;
	};
}
function Gf(e, t, n, r, i = .8) {
	let a = [];
	for (let o = 0; o < n; o++) for (let s = 0; s < n; s++) a.push([
		(s + .5 + (r() - .5) * i) * (e / n),
		(o + .5 + (r() - .5) * i) * (t / n),
		r()
	]);
	let o = e / n, s = t / n;
	return (e, t) => {
		let r = Math.floor(e / o), i = Math.floor(t / s), c = 1e9, l = 1e9, u = 0;
		for (let d = -1; d <= 1; d++) for (let f = -1; f <= 1; f++) {
			let p = r + f, m = i + d, h = (p % n + n) % n, g = (m % n + n) % n, _ = a[g * n + h], v = _[0] + (p - h) * o, y = _[1] + (m - g) * s, b = Math.hypot(v - e, y - t);
			b < c ? (l = c, c = b, u = g * n + h) : b < l && (l = b);
		}
		return [
			c,
			l,
			u,
			a[u][2]
		];
	};
}
function Kf(e) {
	return /riverbed|water|lava/.test(e) ? null : /moss/.test(e) ? "moss" : /tile|cobble|flag|paving/.test(e) ? "flags" : /dirt|earth|mud|sand/.test(e) ? "earth" : /brick|wall|ashlar|plaster/.test(e) ? "blocks" : /crag|cliff|rock|stone|basalt/.test(e) ? "rock" : null;
}
var qf = {
	flags: {
		base: [
			134,
			140,
			150
		],
		vary: 30,
		grout: [
			42,
			44,
			52
		],
		cells: 5
	},
	moss: {
		base: [
			122,
			132,
			120
		],
		vary: 26,
		grout: [
			40,
			48,
			40
		],
		cells: 6,
		moss: [
			98,
			132,
			70
		]
	},
	earth: {
		base: [
			150,
			114,
			80
		],
		vary: 26,
		grout: [
			86,
			66,
			48
		]
	},
	blocks: {
		base: [
			124,
			126,
			136
		],
		vary: 26,
		grout: [
			40,
			40,
			48
		],
		rows: 6
	},
	rock: {
		base: [
			114,
			116,
			124
		],
		vary: 28,
		grout: [
			44,
			44,
			50
		]
	}
};
function Jf(e, t, n, r) {
	let i = zf(r), a = qf[e], o = new Uint8ClampedArray(t * n * 4), s = new Float32Array(t * n), c = Wf(t, n, i, 4, 4), l = Wf(t, n, i, 16, 3), u = Wf(t, n, i, 64, 2), d = Math.max(2, Math.round((a.cells || 5) * t / 256)), f = e === "flags" || e === "moss" ? Gf(t, n, d, i, .75) : e === "rock" ? Gf(t, n, Math.max(2, Math.round(3 * t / 256)), i, 1) : null, p = Wf(t, n, i, 8, 3), m = Math.max(2, Math.round((a.rows || 6) * n / 256)), h = n / m, g = [];
	for (let e = 0; e < m; e++) g.push(i());
	let _ = [];
	for (let e = 0; e < m; e++) _.push(Math.max(2, Math.round((2 + i() * 2) * t / 256)));
	for (let r = 0; r < n; r++) for (let n = 0; n < t; n++) {
		let i = r * t + n, m = .5, v = 0, y = 0, b = (c(n, r) - .5) * 2;
		if (f) {
			let [i, a, , o] = f(n, r), s = a - i;
			y = Vf(1 - s / (e === "rock" ? 10 : 5), 0, 1);
			let c = Vf(s / (t / d) * 2.2, 0, 1);
			m = .3 + .55 * Math.sqrt(c) - .35 * y + (l(n, r) - .5) * .18, v = (o - .5) * 1.4;
		} else if (e === "blocks") {
			let e = Math.floor(r / h), i = (r - e * h) / h, a = t / _[e], o = ((n / a + g[e] * 3) % 1 + 1) % 1, s = Math.floor(n / a + g[e] * 3), c = Math.min(o, 1 - o) * a, u = Math.min(i, 1 - i) * h, d = Math.min(c, u);
			y = Vf(1 - d / 4.5, 0, 1), m = .35 + .5 * Vf(d / 14, 0, 1) - .3 * y + (l(n, r) - .5) * .22, v = (Math.sin(s * 12.9898 + e * 78.233) * 43758.5453 % 1 + 1) % 1 - .5;
		} else {
			let e = u(n, r);
			m = .45 + (l(n, r) - .5) * .5 + (e > .72 ? (e - .72) * 2.4 : 0), v = (c(n, r) - .5) * 1.2;
		}
		let x = e === "earth" ? 0 : Vf(1 - Math.abs(p(n, r) - .5) * 60, 0, 1) * +(c(n * 1.7, r * 1.3) > .55);
		m -= x * .15;
		let S = a.base.map((e) => e + v * a.vary + b * 10 + (u(n, r) - .5) * 14);
		if (e === "moss") {
			let e = Vf((c(n + 37, r + 11) - .48) * 4, 0, 1) * (.5 + .5 * y);
			S = S.map((t, i) => Hf(t, a.moss[i] + (l(n, r) - .5) * 24, e));
		}
		S = S.map((e, t) => Hf(e, a.grout[t], y * .85)), S = S.map((e) => e * (1 - x * .45) * (.82 + .36 * Vf(m, 0, 1))), o[i * 4] = S[0], o[i * 4 + 1] = S[1], o[i * 4 + 2] = S[2], o[i * 4 + 3] = 255, s[i] = m;
	}
	return {
		col: o,
		hgt: s
	};
}
function Yf(e, t, n, r) {
	let i = new Uint8Array(t * n * 4), a = (r, i) => e[(i + n) % n * t + (r + t) % t];
	for (let e = 0; e < n; e++) for (let n = 0; n < t; n++) {
		let o = (a(n + 1, e) - a(n - 1, e)) * r, s = (a(n, e + 1) - a(n, e - 1)) * r, c = Math.hypot(o, s, 1), l = (e * t + n) * 4;
		i[l] = (-o / c * .5 + .5) * 255, i[l + 1] = (s / c * .5 + .5) * 255, i[l + 2] = (1 / c * .5 + .5) * 255, i[l + 3] = 255;
	}
	return i;
}
function Xf(e, t, n) {
	let r = Kf(e);
	if (!r) return null;
	let i = `${e}|${t[0]}x${t[1]}`;
	if (Rf.has(i)) return Rf.get(i);
	let a = Math.min(Lf, Math.max(64, Math.round(t[0] * If))), s = Math.min(Lf, Math.max(64, Math.round(t[1] * If))), { col: c, hgt: l } = Jf(r, a, s, Bf(e)), u = n?.capabilities?.getMaxAnisotropy?.() || 1, d = new re(c, a, s, de), f = new re(Yf(l, a, s, r === "earth" ? 2.5 : 5), a, s, de);
	for (let e of [d, f]) e.wrapS = e.wrapT = T, e.magFilter = Fe, e.minFilter = Qe, e.generateMipmaps = !0, e.anisotropy = Math.min(8, u), e.flipY = !1, e.needsUpdate = !0;
	d.colorSpace = o;
	let p = {
		map: d,
		normalMap: f,
		kind: r,
		size: [a, s]
	};
	return Rf.set(i, p), p;
}
function Zf(e, t) {
	let n = [], r = [], i = 0;
	for (let a of e?._materials?.values() || []) {
		let o = String(a.name || "").replace(/^TileMap:(decal:)?/, "").replace(/:var$/, "");
		if (a.userData.hires) {
			n.push(o);
			continue;
		}
		let s = [2, 2];
		try {
			s = e.textures.meta(o).units || s;
		} catch {}
		let c = Xf(o, s, t);
		if (!c) {
			r.push(o);
			continue;
		}
		a.userData.hires = !0, a.userData.lowMap = a.map, a.userData.lowNormal = a.normalMap, a.map = c.map, a.normalMap = c.normalMap, a.normalScale = new Oe(1, 1), a.needsUpdate = !0, n.push(o), i += c.size[0] * c.size[1] * 4 * 2 * 1.33;
	}
	return {
		swapped: n,
		kept: r,
		bytes: Math.round(i)
	};
}
//#endregion
//#region ember3d/world.js
typeof location < "u" && new URLSearchParams(location.search).get("faces") === "mesh" && au("mesh");
var Qf = "", $f = 1, ep = 3, tp = 16 * Math.SQRT2, np = {
	billboard: "spherical",
	normalUp: .6,
	wrap: .6,
	roundness: .35,
	emissive: "#ffe9d2",
	emissiveIntensity: .2
}, rp = "en", ip = null, ap = null, op = null, sp = null, X = null, cp = null, lp = 0, up = "soft", dp = "sharp", fp = "sharp", pp = 45, mp = 30, hp = "high", gp = 0, _p = null, vp = [], yp = 3, bp = () => hp === "low" ? yp : 12, xp = /* @__PURE__ */ new Map(), Sp = 2, Cp = .12, wp = "", Tp = "", Ep = !1, Dp = "", Op = null, kp = 5, Ap = 10;
function jp() {
	Op && !Op.done && (Np(kp), setTimeout(jp, Op?.wait || Ep ? 60 : Ap));
}
function Mp() {
	if (Op) {
		try {
			Op.world.dispose();
		} catch (e) {
			console.warn("[luminati] a level built ahead:", e);
		}
		Op = null;
	}
}
function Np(e) {
	let t = Op;
	if (!t || t.done || t.wait || Ep) return;
	let n = performance.now() + e;
	try {
		for (;;) {
			let e = t.steps.next();
			if (e.done) {
				t.done = !0;
				return;
			}
			if (e.value && "wait" in e.value) {
				t.wait = e.value.wait;
				let n = () => {
					t.wait = null;
				};
				t.wait.then(n, n);
				return;
			}
			if (performance.now() >= n) return;
		}
	} catch (e) {
		console.warn("[luminati] building a level ahead:", e), Op === t && (Op = null);
	}
}
var Pp = (e) => ({
	world: e.world,
	level: e.level,
	async finish() {
		for (;;) {
			if (e.wait && await e.wait, e.done) return;
			let t = e.steps.next();
			if (t.done) {
				e.done = !0;
				return;
			}
			t.value && "wait" in t.value && await t.value.wait;
		}
	}
}), Fp = /* @__PURE__ */ new Map(), Ip = /* @__PURE__ */ new Map(), Lp = (e) => {
	let t = Fp.get(e);
	return t || (t = new Promise((t, n) => {
		let r = new Image();
		r.decoding = "async", r.onload = () => t(r), r.onerror = n, r.src = e;
	}), Fp.set(e, t)), t;
}, Rp = (e) => {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t = Math.imul(t ^ e.charCodeAt(n), 16777619);
	return (t >>> 0).toString(36);
}, zp = (e) => {
	let t = Ip.get(e);
	return t || (t = fetch(e, { cache: "no-cache" }).then((e) => e.ok ? e.text() : null).then((e) => {
		if (!e) return null;
		let t = JSON.parse(e);
		return Object.defineProperty(t, "_v", { value: Rp(e) }), t;
	}).catch(() => null), Ip.set(e, t)), t;
}, Bp = /* @__PURE__ */ new Map();
function Vp(e) {
	return Bp.has(e) ? Bp.get(e) : (Bp.set(e, null), zp(`${Qf}actors/${e}.json`).then((t) => t ? Lp(`${Qf}actors/${e}.alb.png?v=${t._v}`).then((e) => [t, e]) : [null, null]).then(([t, r]) => {
		if (!t) {
			Bp.set(e, !1);
			return;
		}
		let i = new n(r);
		i.magFilter = i.minFilter = D, i.generateMipmaps = !1, i.colorSpace = o, i.wrapS = i.wrapT = De, i.needsUpdate = !0, i.name = `ember-actor:${e}`, Bp.set(e, {
			meta: t,
			tex: i,
			sheets: /* @__PURE__ */ new Map()
		});
	}).catch(() => Bp.set(e, !1)), null);
}
function Hp(e, t) {
	let n = t.toFixed(3), r = e.sheets.get(n);
	if (!r) {
		let i = e.meta;
		r = {
			texture: e.tex,
			frameWidth: i.cw,
			frameHeight: i.ch,
			columns: i.frames,
			rows: i.dirs,
			pixelsPerUnit: tp / t,
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
var Up = /* @__PURE__ */ new Map();
function Wp(e, t) {
	let n = Up.get(e);
	for (n || Up.set(e, n = []); n.length <= t;) {
		let t = new Vt(e, { ...np });
		t.visible = !1, X.engine.scene.add(t), n.push(t);
	}
	return n[t];
}
function Gp(e, t, n, r, i) {
	let a = 2 * r / i / Math.SQRT2, o = X.tileMap, s = t + a, c = n + a;
	e.position.set(s, o.getHeight(t, n), c);
}
var Kp = "models", qp = new F(), Jp = .4, Yp = null, Xp = !1, Zp = "", Qp = (e) => (Xp || (Xp = !0, zp(`${Qf}models/cast.json`).then((e) => {
	Yp = e || !1, e || (Zp ||= "models/cast.json unreadable");
})), Yp ? Yp.actors[e] || !1 : Yp !== !1 && null), $p = new Co(), em = /* @__PURE__ */ new Map(), tm = (e) => {
	let t = `${Qf}models/${e.replace("./models/", "")}${Yp && Yp._v ? `?v=${Yp._v}` : ""}`, n = em.get(t);
	return n || (n = $p.loadAsync(t), em.set(t, n)), n.then((e) => ({
		scene: xo(e.scene),
		animations: e.animations
	}));
}, nm = /* @__PURE__ */ new Map(), rm = /* @__PURE__ */ new Map(), im = /Helmet|Hat|Hood/, am = (e, t) => t ? {
	...e,
	...t.appearance ? { appearance: t.appearance } : {},
	...t.gear ? { gear: t.gear } : {},
	...t.bare && e.show ? { show: e.show.filter((e) => !im.test(e)) } : {},
	...t.bare && /_Hooded$/.test(e.model || "") ? { model: e.model.replace(/_Hooded$/, "") } : {}
} : e;
function om(e, t, n = null, r = "") {
	let i = r ? `${e}#${r}` : e, a = rm.get(i);
	return a === void 0 ? (rm.set(i, null), nm.has(e) || zp(`${Qf}actors/${e}.json`).then((t) => nm.set(e, t)), xf(am(t.v, n), {
		far: !1,
		load: tm,
		faces: async () => Yp.faces,
		lod: "play"
	}).then((e) => {
		let n = [];
		e.root.traverse((e) => {
			e.isBone && n.push([
				e,
				e.position.clone(),
				e.quaternion.clone(),
				e.scale.clone()
			]);
		}), Tf(e, "Idle", 0, !0);
		let { box: r, ppu: a } = ff(e.root, t.v, t.px);
		for (let [e, t, r, i] of n) e.position.copy(t), e.quaternion.copy(r), e.scale.copy(i);
		let o = Nf(e.root, on);
		rm.set(i, {
			root: e.root,
			clips: e.clips,
			frame: e.frame,
			creature: e.creature || null,
			look: e.look || null,
			ppu: a,
			minY: r.min.y,
			meshes: o
		});
	}).catch((e) => {
		console.warn("[luminati] figure", i, e), Zp ||= `${i}: ${e?.message || e}`, rm.set(i, !1);
	}), null) : a;
}
var sm = typeof location < "u" && new URLSearchParams(location.search).get("headshadow") === "1", cm = /* @__PURE__ */ new Map(), lm = 0, um = null;
function dm() {
	if (um) return um;
	let e = document.createElement("canvas");
	e.width = e.height = 64;
	let t = e.getContext("2d"), n = t.createRadialGradient(32, 32, 0, 32, 32, 32);
	n.addColorStop(0, "rgba(225,210,255,0.95)"), n.addColorStop(.25, "rgba(170,140,255,0.55)"), n.addColorStop(1, "rgba(120,80,230,0)"), t.fillStyle = n, t.fillRect(0, 0, 64, 64);
	let r = new we(e);
	return r.colorSpace = o, um = new te({
		map: r,
		transparent: !0,
		depthWrite: !1,
		blending: 2,
		fog: !1
	}), um;
}
function fm(e, t, n) {
	let r = cm.get(e);
	if (r && r.name !== t && (X.engine.scene.remove(r.root), cm.delete(e), r = null), r) return r;
	let i = xo(n.root), a = [];
	i.traverse((e) => {
		if (!e.isMesh) return;
		e.castShadow = !e.userData.face || sm, e.receiveShadow = !0, e.frustumCulled = !1, e.material = e.material.clone(), e.material.isMeshStandardMaterial && (e.material.metalness = 0, e.material.roughness = Math.max(e.material.roughness ?? 1, .92));
		let t = /Eyes/.test(e.name) || !!e.userData.glow && !e.material.userData.rarity || !e.material.emissive;
		t || (e.material.emissive = e.material.map ? new P(16771538) : e.material.color.clone(), e.material.map && (e.material.emissiveMap = e.material.map)), !t && e.material.vertexColors && (e.material.onBeforeCompile = (e) => {
			e.fragmentShader = e.fragmentShader.replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n#ifdef USE_COLOR\n	totalEmissiveRadiance *= vColor.rgb;\n#endif");
		}, e.material.customProgramCacheKey = () => "ember-figure-vc"), a.push({
			m: e.material,
			own: t,
			base: e.material.emissive ? e.material.emissive.clone() : null,
			add: e.material.userData.rarity || 0,
			shine: !!e.material.userData.shine
		});
	});
	let o = [];
	i.traverse((e) => {
		e.isBone && o.push([
			e,
			e.position.clone(),
			e.quaternion.clone(),
			e.scale.clone()
		]);
	});
	let s = [];
	i.traverse((e) => {
		e.name === "Cage_Soul" && s.push(e);
	});
	for (let e of s) {
		let t = new fe(dm());
		t.scale.setScalar(.9 / Math.max(.001, e.scale.x)), t.renderOrder = 2, e.add(t), e.scale.multiplyScalar(1.3);
	}
	return r = {
		name: t,
		root: i,
		mixer: new qe(i),
		clips: n.clips,
		frame: n.frame,
		creature: n.creature,
		look: n.look,
		bones: o,
		mats: a,
		shines: a.some((e) => e.shine),
		yaw: null,
		key: "",
		fpos: 0,
		seen: 0,
		lit: "",
		souls: s,
		stack: n.creature === "furnace" ? hm(i) : null,
		puff: 0,
		puffN: 0
	}, X.engine.scene.add(i), cm.set(e, r), r;
}
var pm = .14, mm = 5;
tn({
	emberStackSmoke: {
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
		nightVisibility: 0,
		count: 1,
		life: [3.6, 5.2],
		size: [.45, .7],
		sizeEnd: 4,
		spawnSize: [
			.3,
			.05,
			.3
		],
		velocity: [
			.1,
			1.1,
			.05
		],
		velocityVariance: [
			.16,
			.2,
			.16
		],
		burstSpeed: [.05, .25],
		burstUp: [0, .2],
		gravity: .12,
		drag: .35,
		windInfluence: .55,
		spin: [.1, .4],
		color: "#5c5753",
		colorEnd: "#7a7876",
		alpha: .58
	},
	emberStackSpark: {
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
		nightVisibility: 0,
		count: 1,
		life: [.5, 1],
		size: [.04, .06],
		sizeEnd: .4,
		spawnSize: [
			.18,
			.05,
			.18
		],
		burstSpeed: [.2, .6],
		burstUp: [1.6, 2.6],
		gravity: -1.5,
		drag: .6,
		windInfluence: .3,
		colors: [
			"#ffd27a",
			"#ff9a3c",
			"#ff6a1e"
		],
		hdr: 3,
		alpha: 1
	},
	emberForgeSparks: {
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
		nightVisibility: 0,
		count: 12,
		life: [.3, .75],
		size: [.04, .07],
		sizeEnd: .5,
		spawnSize: [
			.15,
			.05,
			.15
		],
		burstSpeed: [1.2, 3.4],
		burstUp: [1.8, 3.6],
		gravity: -9,
		drag: 1.2,
		colors: [
			"#fff4c8",
			"#ffd27a",
			"#ff9a3c"
		],
		hdr: 4,
		alpha: 1
	},
	emberSpoilSmoke: {
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
		nightVisibility: 0,
		count: 16,
		life: [1.6, 2.6],
		size: [.4, .7],
		sizeEnd: 3.6,
		spawnSize: [
			.6,
			.3,
			.6
		],
		burstSpeed: [.3, .9],
		burstUp: [.8, 1.6],
		gravity: .25,
		drag: 1.4,
		windInfluence: .3,
		spin: [.2, .8],
		color: "#4e4641",
		colorEnd: "#76716c",
		alpha: .72
	},
	emberSpoilEmbers: {
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
		nightVisibility: 0,
		count: 8,
		life: [.5, 1],
		size: [.035, .05],
		sizeEnd: .3,
		spawnSize: [
			.3,
			.1,
			.3
		],
		burstSpeed: [.3, 1],
		burstUp: [.2, .9],
		gravity: -6,
		drag: 1,
		colors: [
			"#ff7a2a",
			"#c8401a",
			"#7a2a14"
		],
		hdr: 1.8,
		alpha: 1
	},
	emberArmSparks: {
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
		nightVisibility: 0,
		count: 22,
		life: [.5, 1.1],
		size: [.045, .075],
		sizeEnd: .4,
		spawnSize: [
			.7,
			.3,
			.7
		],
		burstSpeed: [.4, 1.6],
		burstUp: [2.2, 4.4],
		gravity: -4,
		drag: 1.1,
		colors: [
			"#fff0c0",
			"#ffc060",
			"#ff7a2a"
		],
		hdr: 3.6,
		alpha: 1
	},
	emberVentSlag: {
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
		nightVisibility: 0,
		count: 12,
		life: [.4, .8],
		size: [.05, .08],
		sizeEnd: .5,
		spawnSize: [
			.5,
			.05,
			.5
		],
		burstSpeed: [.4, 1.4],
		burstUp: [2.4, 4.2],
		gravity: -10,
		drag: .8,
		colors: [
			"#ffe08a",
			"#ff8a2a",
			"#ff4a12"
		],
		hdr: 3.4,
		alpha: 1
	},
	emberVentSmoke: {
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
		nightVisibility: 0,
		count: 4,
		life: [1.2, 2],
		size: [.3, .45],
		sizeEnd: 3,
		spawnSize: [
			.5,
			.1,
			.5
		],
		burstSpeed: [.1, .4],
		burstUp: [.8, 1.4],
		gravity: .2,
		drag: 1.4,
		windInfluence: .4,
		spin: [.2, .6],
		color: "#3a302a",
		colorEnd: "#625a54",
		alpha: .5
	}
});
function hm(e) {
	let t = null, n = -Infinity;
	return e.traverse((e) => {
		if (!e.isSkinnedMesh || !e.userData.glow) return;
		let r = e.geometry.attributes.position;
		for (let i = 0; i < r.count; i++) r.getY(i) > n && (n = r.getY(i), t = {
			mesh: e,
			idx: i
		});
	}), t;
}
var gm = new F();
function _m(e, t) {
	let n = X?.particles;
	if (!n || !e.stack || (e.puff += t, e.puff < pm)) return;
	let { mesh: r, idx: i } = e.stack;
	for (gm.fromBufferAttribute(r.geometry.attributes.position, i), r.applyBoneTransform(i, gm), gm.applyMatrix4(r.matrixWorld); e.puff >= pm; e.puff -= pm) n.burst("emberStackSmoke", gm, 1), ++e.puffN % mm === 0 && n.burst("emberStackSpark", gm, 1);
}
var vm = new F(), ym = {
	strike: [[
		"emberForgeSparks",
		12,
		.55
	]],
	arm: [[
		"emberArmSparks",
		22,
		.3
	]],
	spoil: [[
		"emberSpoilSmoke",
		14,
		.6
	], [
		"emberSpoilEmbers",
		8,
		.55
	]],
	vent: [[
		"emberVentSlag",
		12,
		.1
	], [
		"emberVentSmoke",
		4,
		.2
	]]
};
function bm(e) {
	let t = X?.particles;
	if (t && e) for (let n of e) {
		let e = ym[n.kind];
		if (e) for (let [r, i, a] of e) vm.set(n.x, X.tileMap.getHeight(n.x, n.z) + a, n.z), t.burst(r, vm, i);
	}
}
var xm = new P(1, .45, .15);
function Sm(e, t, n, r) {
	if (Kp !== "models") return !1;
	let i = Qp(e.name);
	if (!i) return !1;
	let a = om(e.name, i, e.look || null, e.lk || ""), o = nm.get(e.name);
	if (!a || !o) return !1;
	a.used = lm;
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
	let l = fm(t, e.lk ? `${e.name}#${e.lk}` : e.name, a), u = o.clips[s], d = c.frames, f = e.col - u.start;
	if (l.key !== s) l.key = s, l.fpos = f;
	else if (c.once) l.fpos = Math.min(Math.max(l.fpos + n * u.fps, f), Math.min(f + .999, d - 1));
	else {
		let e = l.fpos + n * u.fps, t = ((e - f) % d + d) % d;
		l.fpos = t < 1 ? (e % d + d) % d : t > d / 2 ? f : f + .999;
	}
	let p = c.from ?? 0, m = c.to ?? 1, h = c.once ? p + (m - p) * (l.fpos / Math.max(1, d - 1)) : p + (m - p) * (l.fpos / d);
	for (let [e, t, n, r] of l.bones) e.position.copy(t), e.quaternion.copy(n), e.scale.copy(r);
	let g = (135 - 45 * e.row) * Math.PI / 180 + r - Math.PI / 4;
	if (l.yaw === null || l.seen < lm - 1) l.yaw = g;
	else {
		let e = g - l.yaw;
		e -= 2 * Math.PI * Math.round(e / (2 * Math.PI)), l.yaw += e * (1 - Math.exp(-n * 16));
	}
	l.root.rotation.y = l.yaw;
	for (let t of l.souls) t.visible = !e.empty;
	e.mv && i.moves ? Tf(l, e.mv.clip, Math.min(.999, e.mv.t), !0, e.mv.legs ? {
		clip: e.mv.legs.clip,
		t: Math.min(.999, e.mv.legs.t)
	} : null) : Tf(l, c.clip, Math.min(.999, h), !0);
	let _ = (e.cw && o.cw ? e.cw / o.cw : 1) * a.ppu / tp, v = a.look;
	v ? l.root.scale.set(_ * v.w, _ * v.h, _ * v.w) : l.root.scale.setScalar(_), l.root.position.set(e.x, X.tileMap.getHeight(e.x, e.z) - a.minY * _ * (v ? v.h : 1) + (e.air || 0), e.z), l.root.updateMatrixWorld(!0);
	let y = e.flash || 0, b = y ? 0 : Math.round((e.warn || 0) * 20) / 20, x = 1 - (e.fade || 0);
	l.stack && x > .5 && _m(l, n);
	let S = `${qm}|${y}|${b}|${x.toFixed(2)}`;
	if (l.lit !== S) {
		l.lit = S;
		for (let e of l.mats) {
			e.own || (b ? e.m.emissive.copy(e.base).lerp(xm, Math.min(1, b)) : e.m.emissive.copy(e.base), e.m.emissiveIntensity = qm * Jp + e.add + y * 2.6 + b * .9);
			let t = x < .999;
			e.m.transparent !== t && (e.m.transparent = t, e.m.needsUpdate = !0), e.m.opacity = x;
		}
	}
	if (l.shines) {
		let e = .75 + .25 * Math.sin(performance.now() * .0026 + l.root.id);
		for (let t of l.mats) t.shine && (t.m.emissiveIntensity = qm * Jp + t.add * e + y * 2.6 + b * .9);
	}
	return l.root.visible = !0, l.seen = lm, !0;
}
function Cm() {
	for (let [e, t] of cm) t.seen !== lm && (t.root.visible && (t.root.visible = !1), lm - t.seen > 3600 && (X.engine.scene.remove(t.root), cm.delete(e)));
	if (lm % 120 == 0) for (let [e, t] of rm) {
		if (!t || !e.includes("#") || lm - (t.used || 0) < 7200) continue;
		let n = !1;
		for (let t of cm.values()) if (t.name === e) {
			n = !0;
			break;
		}
		if (!n) {
			for (let e of t.root.userData.ownGeos || []) e.dispose();
			rm.delete(e);
		}
	}
}
var wm = [], Tm = "chosen", Em = 5, Dm = 1.3, Om = /* @__PURE__ */ new Map(), km = /* @__PURE__ */ new Map();
for (let e of Bc) e.build && Om.set(e.id, e);
for (let e of Object.values(Vc)) for (let t of e) t.build && Om.set(t.id, t);
var Am = /* @__PURE__ */ new Set([
	"vale_keep_1",
	"ruin",
	"chapelruin_0"
]);
function jm(e, t, n, r) {
	let i = km.get(e.id);
	if (i) {
		let e = i.clone();
		return e.position.set(t, n, r), e;
	}
	let a = zc(e.build, e.style, e.seed || 1, !!e.faceX);
	e.rotY && (a.rotation.y = e.rotY * Math.PI / 180), e.scale && a.scale.multiplyScalar(e.scale), a.updateMatrixWorld(!0);
	let o = X.world?.glassMaterial || null, s = /* @__PURE__ */ new Map(), c = new j(), l = e.desat ?? .3, u = Dm, d = e.tint || [
		.95,
		.92,
		1
	], f = `kitgrade:${l},${u},${d}`, p = (e) => {
		let t = e.clone();
		return t.onBeforeCompile = (e) => {
			e.uniforms.uGrade = { value: new me(l, u * d[0], u * d[1], u * d[2]) }, e.fragmentShader = "uniform vec4 uGrade;\n" + e.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\n  { float L = dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11)); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(L), uGrade.x) * uGrade.yzw; }");
		}, t.customProgramCacheKey = () => f, t;
	};
	a.traverse((e) => {
		if (!e.isMesh || e.userData.mask || e.userData.bakeOnly) return;
		let t = e.userData.glow && o ? o : e.material, n = e.geometry.index ? e.geometry.toNonIndexed() : e.geometry.clone();
		n.applyMatrix4(e.matrixWorld), n.attributes.normal || n.computeVertexNormals(), n.attributes.uv || n.setAttribute("uv", new k(new Float32Array(n.attributes.position.count * 2), 2));
		for (let e of Object.keys(n.attributes)) (![
			"position",
			"normal",
			"uv",
			"color"
		].includes(e) || e === "color" && !t.vertexColors) && n.deleteAttribute(e);
		let r = t.vertexColors ? `vc|${t.flatShading}` : t.uuid;
		s.has(r) || s.set(r, {
			m: t,
			geos: []
		}), s.get(r).geos.push(n);
	});
	for (let { m: e, geos: t } of s.values()) {
		let n = t.length > 1 ? on(t) : t[0];
		if (!n) continue;
		for (let e of t) e !== n && e.dispose();
		let r = new N(n, e === o ? e : p(e));
		r.castShadow = r.receiveShadow = !0, c.add(r);
	}
	c.name = `ember:kit:${e.id}`, c.scale.setScalar(Em), km.set(e.id, c);
	let m = c.clone();
	return m.position.set(t, n, r), m;
}
var Mm = 1.7;
function Nm(e) {
	let t = X.world.factory, n = t.builder(), r = e.span, i = e.kind === "up" ? 1.55 : 1.35, a = .42, o = .5, s = r / 2 + a / 2, c = e.stone || "stone_brick", l = [
		.05,
		.045,
		.06
	];
	for (let e of [-1, 1]) n.box(c, [
		.52,
		.22,
		.6
	], { at: [
		e * s,
		.11,
		0
	] }), n.box(c, [
		a,
		i,
		o
	], { at: [
		e * s,
		i / 2,
		0
	] }), n.box(c, [
		.54,
		.12,
		.58
	], { at: [
		e * s,
		i - .06,
		0
	] });
	for (let e = 0; e < 9; e++) {
		let t = (e + .5) / 9 * Math.PI, r = e === 4, a = Math.cos(t), l = Math.sin(t);
		n.box(c, [
			r ? .52 : .42,
			Math.PI * s / 9 * .96,
			r ? .6 : o
		], {
			at: [
				a * s,
				i + l * s,
				0
			],
			rot: [
				0,
				0,
				t
			]
		});
	}
	e.kind === "up" && n.tinted(l, () => n.box(c, [
		r,
		i + s * .92,
		.3
	], { at: [
		0,
		(i + s * .92) / 2,
		-.2
	] }));
	let u = t.finish(n, `ember:arch:${e.kind}`, e.x, e.level * .5, e.z + (e.kind === "up" ? .25 : 0), e.rot || 0), d = new P(e.glow).multiplyScalar(Mm), f = new tt({
		color: d,
		fog: !1
	}), p = s - a / 2 - .02, m = new N(new L(p, .045, 5, 28, Math.PI), f);
	m.position.set(0, i, .27), u.add(m);
	for (let e of [-1, 1]) {
		let t = new N(new I(.09, i - .22, .09), f);
		t.position.set(e * p, .22 + (i - .22) / 2, .27), u.add(t);
	}
	return u.traverse((e) => {
		e.isMesh && (e.castShadow = e.material !== f, e.receiveShadow = !0);
	}), u.dispose = () => u.traverse((e) => {
		e.isMesh && e.material === f && e.geometry.dispose();
	}), u;
}
function Pm(e, t) {
	for (let t of e) X.engine.scene.remove(t), t.dispose?.(), t.userData?.sheet?.dispose?.();
	for (let e of t.values()) e.traverse((e) => {
		e.isMesh && e.geometry.dispose();
	});
}
async function Fm(e, t) {
	if (Pm(wm, km), wm = [], km = /* @__PURE__ */ new Map(), !e?.length) return;
	let n = ["env", `town-${t || "vale"}`], r = await Promise.all(n.map((e) => zp(`${Qf}env/${e}.json`))), i = (e) => {
		for (let t = 0; t < n.length; t++) {
			let i = r[t]?.sprites?.[e];
			if (i) return [n[t], i];
		}
		return null;
	}, a = lp;
	for (let t of e) {
		if (t.canvas) {
			lh(t);
			continue;
		}
		if (t.arch) {
			let e = Nm(t.arch);
			X.engine.scene.add(e), wm.push(e);
			continue;
		}
		let e = Om.get(t.id);
		if (e && (Tm === "all" || Tm === "chosen" && !t.card || Tm === "doors" && Am.has(t.id))) {
			let n = (e, n) => X.tileMap.getHeight(t.x + e, t.z + n), r = Math.max(n(0, 0), n(0, 3), n(0, -3), n(3, 0), n(-3, 0)), i = jm(e, t.x, r, t.z);
			X.engine.scene.add(i), wm.push(i);
			continue;
		}
		let s = i(t.id);
		if (!s) continue;
		let [c, l] = s, u = await Lp(`${Qf}env/${c}.alb.png?v=${r[n.indexOf(c)]._v}`).catch(() => null);
		if (!u || a !== lp) return;
		let d = document.createElement("canvas");
		d.width = l.w, d.height = l.h, d.getContext("2d").drawImage(u, l.x, l.y, l.w, l.h, 0, 0, l.w, l.h);
		let f = new we(d);
		f.magFilter = f.minFilter = D, f.generateMipmaps = !1, f.colorSpace = o;
		let p = {
			texture: f,
			frameWidth: l.w,
			frameHeight: l.h,
			columns: 1,
			rows: 1,
			pixelsPerUnit: tp,
			anchor: [l.ax / l.w, 0],
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
				f.dispose();
			}
		}, m = new Vt(p, {
			...np,
			castShadow: !1,
			blobShadow: !1
		});
		m.name = `ember:${c}:${t.id}`, m.userData.sheet = p, Gp(m, t.x, t.z, l.h - l.ay, tp), X.engine.scene.add(m), wm.push(m), m.update(0, X.engine.camera);
	}
}
var Im = (e, t) => {
	let n = new P(e), r = n.r * .299 + n.g * .587 + n.b * .114;
	return n.r += (r - n.r) * t, n.g += (r - n.g) * t, n.b += (r - n.b) * t, "#" + n.getHexString();
}, Lm = (e, t) => {
	let n = new P(e);
	return n.multiplyScalar(t), "#" + n.getHexString();
}, Rm = Mt.map((e) => {
	let t = e.night ?? 0;
	return {
		...e,
		top: Lm(Im(e.top, .3), .8),
		horizon: Lm(Im(e.horizon, .3), .6),
		bottom: Lm(Im(e.bottom, .3), .75),
		sun: Im(e.sun, .3),
		hemiSky: Im(e.hemiSky, .45),
		hemiGround: Im(e.hemiGround, .3),
		sunI: e.sunI * .72,
		hemiI: e.hemiI * (.86 - .08 * t) * (e.t >= 18 && e.t <= 20.5 ? 1.4 : 1),
		exp: e.exp * .97,
		fog: e.fog * (.5 + .3 * t)
	};
}), zm = {
	saturation: .92,
	exposure: .9,
	contrast: 1.06,
	vignette: .78
}, Bm = !1, Vm = !1;
function Hm() {
	let e = X?.postfx?.settings?.grade, t = X?.lighting?.state?.night ?? 1;
	if (Vm && e) {
		e.exposure = (Zm?.exposure ?? 1) * Um * Wm;
		return;
	}
	Bm && e && (e.saturation = .74 + .18 * t, e.exposure = (.84 + .06 * t) * Um * Wm);
}
var Um = 1, Wm = 1, Gm = 1.6, Km = 1, qm = np.emissiveIntensity, Jm = 0, Ym = (e) => .2126 * e.r + .7152 * e.g + .0722 * e.b;
function Xm() {
	let e = X?.lighting, t = e?.hemi, n = e?.sun;
	return Jm = (t ? Ym(t.color) * t.intensity : 0) + (n ? Ym(n.color) * n.intensity * .5 : 0), Math.round(Math.min(Km, Math.max(np.emissiveIntensity, Gm - Jm)) * 100) / 100;
}
var Zm = null, Qm = "default";
function $m(e, t) {
	let n = X?.lighting;
	if (!n) return;
	let r = e.environment || {}, i = X.postfx?.settings?.grade, a = t === "reach" && !r.interior;
	if (i && (Zm ||= { ...i }, Object.assign(i, Zm, t === "vale" ? zm : a ? nh : {}), _p = {
		sharpen: i.sharpen,
		grain: i.grain,
		chromaticAberration: i.chromaticAberration
	}, Nh()), Bm = t === "vale" && !r.interior, Vm = a, r.climate === "arid" && !r.interior) {
		let e = a ? "ash" : "arid";
		Qm !== e && (n.setKeyframes(a ? th : wi), Qm = e);
	}
	if (a && oh(), r.interior || r.climate || r.season) return;
	let o = t === "vale" ? "dusky" : "default";
	n.setKeyframes(o === "dusky" ? Rm : Mt), Qm = o;
}
var eh = (e, t, n) => "#" + new P(e).lerp(new P(t), n).getHexString(), th = wi.map((e) => {
	let t = e.night ?? 0, n = +(e.t >= 16.5 && e.t <= 19.5);
	return {
		...e,
		top: Lm(eh(e.top, "#6c6a70", .45 * (1 - t)), .85),
		horizon: eh(Im(e.horizon, n ? .6 : .45), "#9a8a74", .35 * (1 - t)),
		bottom: Lm(Im(e.bottom, .55), .8),
		sun: n ? eh(Im(e.sun, .35), "#e0a878", .45) : Im(e.sun, .25),
		sunI: e.sunI * (n ? .92 : .96),
		hemiSky: eh(Im(e.hemiSky, n ? .7 : .5), "#4c4e5a", .75 * t),
		hemiGround: Im(e.hemiGround, .4),
		hemiI: e.hemiI * (n ? 1.2 : 1.1),
		...t > .5 ? {
			sun: Im(e.sun, .75),
			horizon: eh(e.horizon, "#2c2830", .5)
		} : {},
		fog: e.fog * 1.1,
		clouds: Math.min(.5, (e.clouds ?? .15) + .15)
	};
}), nh = {
	saturation: .86,
	contrast: 1.05,
	vignette: .8
}, rh = [
	"#6e5440",
	"#4c3e33",
	"#30302e",
	"#1c1e21"
], ih = "#8c7c6a", ah = "#a89a88";
function oh() {
	let e = X?.world;
	if (!e) return;
	let t = e.water?.uniforms;
	t && ([
		"uC0",
		"uC1",
		"uC2",
		"uC3"
	].forEach((e, n) => t[e]?.value.set(rh[n])), t.uCrest?.value.set(ih), t.uFoam?.value.set(ah), t.uSaturation && (t.uSaturation.value = .8));
	let n = e.outerGround;
	n && e.textures && !n.userData.ash && (n.material = e.textures.material("cinder_earth", {
		vertexColors: !0,
		normalScale: .35
	}), n.userData.ash = !0);
	let r = e.emitters?.dust?.uniforms;
	r && (r.uColor0?.value.set("#b4aca2").multiplyScalar(1.1), r.uColor1?.value.set("#8a847e").multiplyScalar(1.1));
}
var sh = null;
qt((e) => {
	let t = (t) => t.map((t) => e.parseColor(t)), n = (e, t) => e[Math.max(0, Math.min(e.length - 1, Math.round(t * (e.length - 1))))], r = (e) => (.3 * e[0] + .59 * e[1] + .11 * e[2]) / 255, i = (e, t, i = null) => (a, o) => {
		let s = (sh ||= new Kt({ seed: 7 })).pixels(e);
		if (!s) return {};
		let { width: c, height: l } = s.color, u = new Float32Array(c * l), d = 1, f = 0;
		for (let e = 0; e < l; e++) for (let t = 0; t < c; t++) {
			let n = r(s.color.get(t, e));
			u[e * c + t] = n, d = Math.min(d, n), f = Math.max(f, n);
		}
		return a.each((e, r, c) => {
			let l = (u[c] - d) / Math.max(.001, f - d);
			a.set(e, r, n(t, l)), a.hf[c] = s.height[c], i?.(a, e, r, c, l, o);
		}), { normal: 2.2 };
	}, a = (e) => e.map((e) => "#" + new P(e).multiplyScalar(1.55).lerp(new P("#8e877c"), .2).getHexString()), o = t([
		"#0c0b0e",
		"#141318",
		"#1c1a20",
		"#25222a",
		"#2f2b33",
		"#3b363d",
		"#4a4348"
	]), s = t([
		"#3a3532",
		"#4e4743",
		"#625a54"
	]), c = t(["#3a1a10", "#5a2814"]), l = t(["#2c4a4c", "#3e6662"]), u = t(["#6a4e24", "#8a6a34"]), d = e.parseColor("#1a1614"), f = t([
		"#141212",
		"#1c1918",
		"#26221f",
		"#302a27",
		"#3c3430",
		"#4a403a"
	]), p = t(["#e8501a", "#ffa040"]), m = t(["#9aacb4", "#8a8a70"]), h = t(["#5a7a24", "#6e8e2c"]);
	return {
		slag_brick: {
			px: [32, 32],
			normalScale: .6,
			gen: (t, i) => {
				let a = e.genStoneBrick(t, i), u = e.field(t.w, t.h, 4, 4, i.seed + 41, { oct: 2 });
				return t.each((a, d, f) => {
					let p = r(t.get(a, d)), m = e.hash2(a, d, i.seed + 43);
					if (t.hf[f] <= .001) {
						t.set(a, d, s[m < .3 ? 0 : u[f] > .6 ? 2 : 1]);
						return;
					}
					let h = n(o, Math.min(1, p * 1.25));
					u[f] > .84 && e.hash2(a, d >> 1, i.seed + 44) < .7 && (h = e.mixColor(h, c[+(u[f] > .92)], .32)), m > .985 && (h = l[+(m > .995)]), t.set(a, d, h);
				}), a;
			}
		},
		roof_rust: {
			px: [32, 32],
			normalScale: .7,
			gen: (t, n) => {
				let r = e.genClayRoof(t, n, [
					"#1e0f0c",
					"#36180f",
					"#552517",
					"#73341e",
					"#8e4826",
					"#a65e34"
				]), i = e.field(t.w, t.h, 3, 3, n.seed + 51, { oct: 3 });
				return t.each((n, r, a) => {
					i[a] > .6 && t.set(n, r, e.mixColor(t.get(n, r), "#1a1514", Math.min(.6, (i[a] - .6) * 2.2)));
				}), r;
			}
		},
		cinder_earth: {
			px: [64, 64],
			normalScale: .6,
			gen: i("cracked_earth", t(a([
				"#121011",
				"#1b1817",
				"#25211f",
				"#302a27",
				"#3c3530",
				"#4a413a",
				"#5a4f46",
				"#6c5f53"
			])))
		},
		cinder_cobble: {
			px: [64, 64],
			normalScale: .7,
			gen: i("cobblestone", t(a([
				"#141317",
				"#1d1c21",
				"#28262c",
				"#333038",
				"#3f3b43",
				"#4c4750",
				"#5c5660"
			])))
		},
		rust_mud: {
			px: [64, 64],
			normalScale: .5,
			gen: i("red_sand", t(a([
				"#200d09",
				"#33150d",
				"#481f11",
				"#5e2a16",
				"#73361c",
				"#874424",
				"#9a5430"
			])))
		},
		rust_rock: {
			px: [64, 64],
			normalScale: .65,
			gen: i("redrock", t(a([
				"#1c0e0b",
				"#2a1510",
				"#3a1d14",
				"#4a2618",
				"#5a301e",
				"#6a3a24",
				"#7a4630"
			])))
		},
		ash_scrub: {
			px: [64, 64],
			normalScale: .5,
			gen: i("dry_grass", t(a([
				"#1e1c19",
				"#2a2722",
				"#36322b",
				"#433d33",
				"#4f483b",
				"#5c5444",
				"#6a604e"
			])))
		},
		ash_drift: {
			px: [64, 64],
			normalScale: .5,
			gen: i("ash", t(a([
				"#262422",
				"#33302d",
				"#413d39",
				"#504b46",
				"#5f5953",
				"#6f6860",
				"#80786f",
				"#91897e"
			])))
		},
		forge_flag: {
			px: [64, 64],
			normalScale: .6,
			gen: i("stone_tiles", t([
				"#3a3430",
				"#4c4440",
				"#5e554e",
				"#70665c",
				"#82776a",
				"#948878",
				"#a69a88"
			]), (e, t, n, r, i) => {
				i < .12 && e.set(t, n, u[t + n & 1]);
			})
		},
		forge_stone: {
			px: [32, 32],
			normalScale: .6,
			gen: (t, i) => {
				let a = e.genStoneBrick(t, i);
				return t.each((e, i, a) => {
					let o = r(t.get(e, i));
					t.set(e, i, t.hf[a] <= .001 ? i % 16 < 8 ? u[1] : d : n(f, Math.min(1, o * 1.2)));
				}), a;
			}
		},
		magma_floor: {
			px: [64, 64],
			normalScale: .7,
			emissive: !0,
			gen: i("basalt", t([
				"#1e1a1a",
				"#2a2422",
				"#38302c",
				"#463c36",
				"#544840",
				"#62564c",
				"#706252"
			]), (t, n, r, i, a, o) => {
				if (a < .16 && e.hash2(n >> 1, r >> 1, o.seed + 9) < .7) {
					let e = p[+(a < .08)];
					t.set(n, r, e), t.emissive().set(n, r, e);
				}
			})
		},
		fen_mud: {
			px: [64, 64],
			normalScale: .5,
			gen: i("dirt", t([
				"#2c271e",
				"#3a3428",
				"#4a4232",
				"#5a503c",
				"#6a5e46",
				"#7a6c52",
				"#8a7a5e"
			]), (t, n, r, i, a, o) => {
				e.hash2(n, r, o.seed + 5) > .985 && t.set(n, r, m[1]);
			})
		},
		wet_flag: {
			px: [64, 64],
			normalScale: .6,
			gen: i("stone_tiles", t([
				"#2c3438",
				"#3a454a",
				"#4a565c",
				"#5a676e",
				"#6a7880",
				"#7c8a92",
				"#909ea4"
			]), (t, n, r, i, a, o) => {
				a > .7 && e.hash2(n, r, o.seed + 5) > .93 && t.set(n, r, m[0]);
			})
		},
		sick_flag: {
			px: [64, 64],
			normalScale: .6,
			gen: i("stone_tiles", t([
				"#2c3224",
				"#3a422e",
				"#4a5438",
				"#5a6544",
				"#6a7650",
				"#7a865c",
				"#8a9668"
			]), (t, n, r, i, a, o) => {
				a < .14 && e.hash2(n >> 1, r >> 1, o.seed + 7) < .8 && t.set(n, r, h[n + r & 1]);
			})
		},
		abbey_flag: {
			px: [64, 64],
			normalScale: .6,
			gen: i("stone_tiles", t([
				"#2e3430",
				"#3e4540",
				"#4f5650",
				"#606860",
				"#717970",
				"#838a80",
				"#969c90"
			]))
		},
		dun_cobble: {
			px: [64, 64],
			normalScale: .7,
			gen: i("cobblestone", t([
				"#3c3834",
				"#4e4944",
				"#625b54",
				"#766e65",
				"#8a8177",
				"#9e948a",
				"#b2a89c"
			]))
		}
	};
});
var ch = /* @__PURE__ */ new Map();
function lh(e) {
	let t = ch.get(e.canvas);
	if (!t) {
		let n = new we(e.canvas);
		n.magFilter = n.minFilter = D, n.generateMipmaps = !1, n.colorSpace = o, t = {
			texture: n,
			frameWidth: e.canvas.width,
			frameHeight: e.canvas.height,
			columns: 1,
			rows: 1,
			pixelsPerUnit: tp,
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
		}, ch.set(e.canvas, t);
	}
	let n = new Vt(t, {
		...np,
		emissiveIntensity: .3,
		castShadow: !1,
		blobShadow: !e.flat
	});
	n.name = `ember:prop:${e.id}`, Gp(n, e.x, e.z, e.canvas.height - e.ay, tp), e.flat && n.traverse((e) => {
		e.renderOrder = -1, e.material && (e.material.depthWrite = !1);
	}), X.engine.scene.add(n), wm.push(n), n.update(0, X.engine.camera);
}
var uh = /* @__PURE__ */ new Map(), dh = "vale";
function fh(e) {
	if (uh.has(e)) return uh.get(e);
	uh.set(e, null);
	let t = ["env", `town-${dh}`];
	return Promise.all(t.map((e) => zp(`${Qf}env/${e}.json`))).then(async (n) => {
		for (let r = 0; r < t.length; r++) {
			let i = n[r]?.sprites?.[e];
			if (!i) continue;
			let a = await Lp(`${Qf}env/${t[r]}.alb.png?v=${n[r]._v}`), s = document.createElement("canvas");
			s.width = i.w, s.height = i.h, s.getContext("2d").drawImage(a, i.x, i.y, i.w, i.h, 0, 0, i.w, i.h);
			let c = new we(s);
			c.magFilter = c.minFilter = D, c.generateMipmaps = !1, c.colorSpace = o, uh.set(e, {
				texture: c,
				frameWidth: i.w,
				frameHeight: i.h,
				columns: 1,
				rows: 1,
				pixelsPerUnit: tp,
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
		uh.set(e, !1);
	}).catch(() => uh.set(e, !1)), null;
}
var ph = /* @__PURE__ */ new WeakMap();
function mh(e) {
	let t = ph.get(e.canvas);
	if (!t) {
		let n = new we(e.canvas);
		n.magFilter = n.minFilter = D, n.generateMipmaps = !1, n.colorSpace = o, t = {
			texture: n,
			frameWidth: e.canvas.width,
			frameHeight: e.canvas.height,
			columns: 1,
			rows: 1,
			pixelsPerUnit: tp,
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
		}, ph.set(e.canvas, t);
	}
	return t;
}
function hh(e, t) {
	let n = Up.get(e);
	for (n || Up.set(e, n = []); n.length <= t;) {
		let t = new Vt(e, {
			...np,
			castShadow: !1,
			blobShadow: !1
		});
		t.visible = !1, X.engine.scene.add(t), n.push(t);
	}
	return n[t];
}
var gh = {
	mesh: null,
	id: "",
	cap: 0
}, _h = 2.3, vh = .07, yh = /* @__PURE__ */ new Map(), bh = new I(1, 1, 1);
function xh(e) {
	let t = e.cells.length * 5, n = new l({
		color: 2894383,
		roughness: .48,
		metalness: .65,
		emissive: 1182984
	}), r = new le(bh, n, t);
	r.name = "ember:gate", r.castShadow = !0, r.frustumCulled = !1;
	let i = new nt(), a = new m(), o = new F(), s = new F(), c = new F(0, 1, 0), u = 0;
	for (let [t, n, l, d] of e.cells) {
		let e = X.tileMap.getHeight(t, n), f = t + l * .22, p = n + d * .22, m = l ? Math.PI / 2 : 0;
		a.setFromAxisAngle(c, m);
		for (let t of [
			-.17,
			0,
			.17
		]) o.set(f + (l ? 0 : t), e + _h / 2, p + (l ? t : 0)), s.set(vh, _h, vh), i.compose(o, a, s), r.setMatrixAt(u++, i);
		for (let t of [.55, 1.75]) o.set(f, e + t, p), s.set(.52, vh * 1.4, vh * 1.2), i.compose(o, a, s), r.setMatrixAt(u++, i);
	}
	return r.instanceMatrix.needsUpdate = !0, r;
}
var Sh = /* @__PURE__ */ new Set();
function Ch(e) {
	if (Sh.clear(), X) for (let t of e || []) {
		let e = yh.get(t.id);
		(!e || !e.parent) && (e && (e.material.dispose(), e.dispose?.()), e = xh(t), X.engine.scene.add(e), yh.set(t.id, e));
		let n = Math.max(0, Math.min(1, t.drop));
		e.visible = n < 1, e.position.y = -2.4 * n * n, Sh.add(t.id);
	}
	for (let [e, t] of yh) Sh.has(e) || (t.removeFromParent(), t.material.dispose(), t.dispose?.(), yh.delete(e));
}
function wh(e) {
	if (!e || !e.cells.length) {
		gh.mesh && (gh.mesh.visible = !1), gh.id = "";
		return;
	}
	if (e.id === gh.id && gh.mesh) {
		gh.mesh.visible = !0;
		return;
	}
	let t = e.cells.length / 3;
	if (!gh.mesh || gh.cap < t) {
		gh.mesh && (X.engine.scene.remove(gh.mesh), gh.mesh.geometry.dispose(), gh.mesh.material.dispose());
		let e = new x(.5, .5);
		e.rotateX(-Math.PI / 2);
		let n = new tt({
			transparent: !0,
			opacity: .72,
			depthWrite: !1,
			polygonOffset: !0,
			polygonOffsetFactor: -2,
			polygonOffsetUnits: -2,
			toneMapped: !1
		});
		gh.cap = Math.max(256, Math.ceil(t * 1.5)), gh.mesh = new le(e, n, gh.cap), gh.mesh.renderOrder = 2, gh.mesh.frustumCulled = !1, X.engine.scene.add(gh.mesh);
	}
	let n = new nt(), r = new P().setRGB(16 / 255, 54 / 255, 64 / 255, o), i = new P().setRGB(40 / 255, 92 / 255, 104 / 255, o);
	for (let a = 0; a < t; a++) {
		let t = e.cells[a * 3], o = e.cells[a * 3 + 1];
		n.makeTranslation(t, X.tileMap.getHeight(t, o) + .035, o), gh.mesh.setMatrixAt(a, n), gh.mesh.setColorAt(a, e.cells[a * 3 + 2] ? i : r);
	}
	gh.mesh.count = t, gh.mesh.instanceMatrix.needsUpdate = !0, gh.mesh.instanceColor && (gh.mesh.instanceColor.needsUpdate = !0), gh.mesh.visible = !0, gh.id = e.id;
}
var Th = [];
function Eh(e, t) {
	let n = Th[e];
	return n && n.sheet !== t && (X.engine.scene.remove(n), n.dispose?.(), n = null), n || (n = new Vt(t, { ...np }), X.engine.scene.add(n), Th[e] = n), n.material.emissiveIntensity !== qm && (n.material.emissiveIntensity = qm), n;
}
var Dh = "uniform vec4 uRect; uniform vec2 uView; varying vec2 vUv;\nvoid main() { vUv = position.xy; vec2 p = uRect.xy + position.xy * uRect.zw; gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0); }", Oh = "uniform sampler2D tEmi, tDepth; uniform vec2 uTexel, uBuf; uniform mat4 uInvVP; uniform vec4 uKey; uniform float uFloor; varying vec2 vUv;\nvoid main() {\n  vec4 e = texture2D(tEmi, vUv); vec3 c = e.rgb * 2.4, g = vec3(0.0); float own = e.a;\n  for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; vec2 d = vec2(cos(a), sin(a)) * uTexel;\n    vec4 n = texture2D(tEmi, vUv + d * 2.0), f = texture2D(tEmi, vUv + d * 4.5); g += n.rgb + f.rgb * 0.6; own = max(own, max(n.a, f.a)); }\n  float k = 1.0;\n  if (uKey.w > 0.5 && own > 0.002) {\n    vec2 suv = gl_FragCoord.xy / uBuf; float z = texture2D(tDepth, suv).x;\n    if (z < 1.0) {\n      vec4 w = uInvVP * vec4(suv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0); w.xyz /= w.w;\n      float scene = 2.0 * (w.x + w.z) + uKey.z, eff = uKey.x + own * 255.0 * uKey.y;\n      if (w.y > uFloor && scene > eff + 1.5) k = 0.22;\n    }\n  }\n  gl_FragColor = vec4((c + g * 0.12) * k, 1.0);\n}", kh = {
	scene: null,
	cam: null,
	mat: null,
	tex: null,
	on: !1,
	keyed: !1
};
function Ah() {
	if (!kh.on || !X) return;
	let e = X.engine.renderer, t = e.autoClear, n = kh.mat.uniforms, r = X.engine.camera;
	n.tDepth.value = X.postfx?.depthTexture || null, n.uKey.value.w = kh.keyed && n.tDepth.value ? 1 : 0, e.getDrawingBufferSize(n.uBuf.value), n.uInvVP.value.multiplyMatrices(r.matrixWorld, r.projectionMatrixInverse), e.autoClear = !1, e.setRenderTarget(null), e.render(kh.scene, kh.cam), e.autoClear = t;
}
function jh(e) {
	if (!e || !e.emi) {
		kh.on = !1;
		return;
	}
	let t = new Uint32Array(e.emi.buffer, e.emi.byteOffset, e.emi.byteLength >> 2), n = !1;
	for (let e = 0; e < t.length; e++) if (t[e] & 16777215) {
		n = !0;
		break;
	}
	if (kh.on = n, n) {
		if (!kh.scene) {
			kh.scene = new p(), kh.cam = new be(), kh.mat = new ae({
				vertexShader: Dh,
				fragmentShader: Oh,
				transparent: !0,
				depthTest: !1,
				depthWrite: !1,
				blending: 2,
				uniforms: {
					tEmi: { value: null },
					uTexel: { value: new Oe() },
					uRect: { value: new me() },
					uView: { value: new Oe() },
					tDepth: { value: null },
					uBuf: { value: new Oe(1, 1) },
					uInvVP: { value: new nt() },
					uKey: { value: new me() },
					uFloor: { value: 1.2 }
				}
			});
			let e = new Pe();
			e.setAttribute("position", new k([
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
			let t = new N(e, kh.mat);
			t.frustumCulled = !1, kh.scene.add(t), X.engine.events.on("afterRender", Ah);
		}
		(!kh.tex || kh.tex.image.width !== e.w || kh.tex.image.height !== e.h || kh.tex.image.data !== e.emi) && (kh.tex?.dispose(), kh.tex = new re(e.emi, e.w, e.h, de), kh.tex.flipY = !1, kh.tex.magFilter = kh.tex.minFilter = Fe, kh.tex.generateMipmaps = !1, kh.mat.uniforms.tEmi.value = kh.tex, kh.mat.uniforms.uTexel.value.set(1 / e.w, 1 / e.h)), kh.tex.needsUpdate = !0, kh.mat.uniforms.uRect.value.set(e.x, e.y, e.w * e.px, e.h * e.px), kh.mat.uniforms.uView.value.set(innerWidth, innerHeight), kh.keyed = !!e.key, e.key && kh.mat.uniforms.uKey.value.set(e.key.base, e.key.step, e.key.origin, 1);
	}
}
function Mh() {
	let e = X?.engine?.renderer;
	if (!e) return;
	let t = hp === "low" ? 0 : 1;
	e.shadowMap.type !== t && (e.shadowMap.type = t, e.shadowMap.needsUpdate = !0, X.engine.scene.traverse((e) => {
		if (e.material) for (let t of [].concat(e.material)) t.needsUpdate = !0;
	})), Nh(), Ph(bp()), Fh();
}
function Nh() {
	let e = X?.postfx?.settings?.grade;
	e && _p && Object.assign(e, hp === "low" ? {
		sharpen: 0,
		grain: 0,
		chromaticAberration: 0
	} : _p);
}
function Ph(e) {
	let t = X?.lightPool;
	if (!t || gp === e || !X.lighting) return;
	for (let [, e] of xp) X.disposeKept(e.kept), Pm(e.env, e.made);
	xp.clear(), Mp();
	let n = new zt(X.lighting, [], {
		size: e,
		fixed: !0
	});
	X.lightPool = n, gp = e;
	let r = X.world;
	r && (r._sharedPool = n, r._wireLights()), t.dispose();
}
function Fh() {
	let e = X?.vfxLights?._slots;
	if (e) for (let t of e) t.handle.light.visible = hp !== "low" || vp.includes(t);
}
var Ih = () => new Set((X?.vfxLights?._slots || []).filter((e) => e.loan)), Lh = {
	x: 0,
	y: 1,
	z: 0,
	ppu: 22,
	ready: !1
};
function Rh() {
	let e = X.rig, t = X.engine.camera, n = innerHeight / (2 * Lh.ppu * Math.tan($f / 2 * Math.PI / 180));
	e.target = null, e.bounds = null, e.lift = 0, e.minDistance = 1, e.maxDistance = 1e6, e.minPitch = 0, e.maxPitch = Math.PI / 2, e.freeYaw = !0, e.yaw = e.yawTarget = pp * Math.PI / 180, e.pitch = e.pitchTarget = mp * Math.PI / 180, e.distance = e.distanceTarget = n, e.focusPoint.set(Lh.x, Lh.y, Lh.z), (Math.abs(t.fov - $f) > 1e-6 || Math.abs(t.far - (n + 600)) > 1) && (t.fov = $f, t.near = Math.max(1, n - 300), t.far = n + 600, t.updateProjectionMatrix()), e._apply(0), Ra(n - 7);
	let r = X.postfx?.settings?.dof;
	r && (r.autoFocus = !1, r.focusDistance = n);
}
async function zh(e) {
	await ap, Object.assign(globalThis, {
		__emberUiRoot: sp,
		__emberInputTarget: new EventTarget(),
		__emberSilent: !0,
		__emberPixelRatio: ep
	}), X = new bo({
		container: op,
		level: e,
		source: "emberfall",
		autostart: !0,
		lang: rp,
		fonts: ip,
		look: "diorama"
	});
	let t = null;
	Object.defineProperty(X, "lightPool", {
		configurable: !0,
		enumerable: !0,
		get: () => t,
		set: (e) => {
			t = e || t || (X.lighting ? new zt(X.lighting, [], {
				size: gp = bp(),
				fixed: !0
			}) : null);
		}
	}), await X.init(() => {}), X.audio && (X.audio.muted = !0), X._updatePlayCamera = () => {}, X._updateCameraBounds = () => {}, X.start(), await X.warmedUp, X.engine.stop(), X._frames = (e) => {
		for (let t = 0; t < e; t++) try {
			X.engine.step(1 / 60);
		} catch (e) {
			console.warn("[luminati] a warm-up frame:", e);
			break;
		}
		return Promise.resolve(void 0);
	}, X.engine.events.on("lateUpdate", () => {
		X && Rh();
	}), X.engine.events.on("update", Hm), X.engine.events.on("update", () => {
		let e = Eg, t = X?.lighting;
		e && t?.hemi && (t.hemi.color.setRGB(e.sky[0], e.sky[1], e.sky[2]), t.hemi.groundColor.setRGB(e.ground[0], e.ground[1], e.ground[2]), t.hemi.intensity = e.i, t.sun && (t.sun.intensity *= e.sun));
	}), X.lighting && (X.lighting._shadowExtent = Math.max(X.lighting._shadowExtent || 22, 34)), a_.settings({});
}
function Bh() {
	let e = X.player;
	e && (e.sprite && (e.sprite.visible = !1), e.visible = !1);
}
var Vh = new u(.46, .6, 40), Hh = new Ie(1, 40), Uh = new u(.8, 1, 40), Wh = (() => {
	let e = [];
	for (let t = 0; t < 4; t++) e.push(new u(.7, .8, 10, 1, t * Math.PI / 2 + .25, Math.PI / 2 - .5));
	return Gh(e);
})();
function Gh(e) {
	let t = [], n = [], r = 0;
	for (let i of e) {
		let e = i.getAttribute("position"), a = i.getIndex();
		for (let n = 0; n < e.count; n++) t.push(e.getX(n), e.getY(n), e.getZ(n));
		for (let e = 0; e < a.count; e++) n.push(a.getX(e) + r);
		r += e.count, i.dispose();
	}
	let i = new Pe();
	return i.setAttribute("position", new k(t, 3)), i.setIndex(n), i;
}
var Kh = new u(.88, 1, 40), qh = new x(1, 1).translate(.5, 0, 0), Jh = 2 * Math.PI / 3, Yh = new Ie(1, 36, -Jh / 2, Jh), Xh = new u(.93, 1, 36, 1, -Jh / 2, Jh), Zh = () => new tt({
	transparent: !0,
	depthWrite: !1,
	polygonOffset: !0,
	polygonOffsetFactor: -2,
	polygonOffsetUnits: -2,
	toneMapped: !1
}), Qh = {
	ring: [],
	disc: [],
	rim: [],
	focus: [],
	wfill: [],
	wrim: [],
	lane: [],
	cone: [],
	crim: []
}, $h = {
	ring: Vh,
	disc: Hh,
	rim: Uh,
	focus: Wh,
	wfill: Hh,
	wrim: Kh,
	lane: qh,
	cone: Yh,
	crim: Xh
};
function eg(e, t) {
	let n = Qh[e];
	for (; n.length <= t;) {
		let t = new N($h[e], Zh());
		t.rotation.x = -Math.PI / 2, t.renderOrder = 2, t.visible = !1, X.engine.scene.add(t), n.push(t);
	}
	return n[t];
}
function tg(e, t, n, r, i, a) {
	e.visible = a > .01, e.visible && (e.position.set(t, X.tileMap.getHeight(t, n) + .03, n), e.scale.setScalar(r), e.material.color.setRGB(i[0] / 255, i[1] / 255, i[2] / 255, o), e.material.opacity = a);
}
function ng(e, t, n, r, i, a, s, c, l) {
	let u = r - t, d = i - n, f = Math.hypot(u, d) * a;
	e.visible = l > .01 && f > .02, e.visible && (e.position.set(t, Math.max(X.tileMap.getHeight(t, n), X.tileMap.getHeight(r, i)) + .05, n), e.rotation.z = Math.atan2(-d, u), e.scale.set(f, s, 1), e.material.color.setRGB(c[0] / 255, c[1] / 255, c[2] / 255, o), e.material.opacity = l);
}
var rg = [
	255,
	86,
	30
], ig = [
	255,
	238,
	220
], ag = [
	24,
	6,
	4
], og = [
	255,
	122,
	24
], sg = [
	255,
	206,
	96
], cg = [
	232,
	186,
	92
], lg = 2.8, ug = null, dg = null, fg = [];
function pg() {
	if (ug) return ug;
	let e = [], t = [
		[0, 0],
		[.55, .015],
		[.86, .06],
		[.98, .13],
		[1.03, .15],
		[1, .16]
	].map(([e, t]) => new Oe(e, t));
	e.push(new Ye(t, 28)), e.push(new L(1.01, .03, 5, 28).rotateX(Math.PI / 2).translate(0, .15, 0));
	let n = new F(0, 1.5, 0), r = new F(0, 1, 0);
	for (let t = 0; t < 3; t++) {
		let i = t / 3 * Math.PI * 2 + .3, a = new F(Math.cos(i) * .96, .16, Math.sin(i) * .96), o = n.clone().sub(a), s = new A(.018, .018, o.length(), 4);
		s.applyQuaternion(new m().setFromUnitVectors(r, o.clone().normalize())), s.translate((a.x + n.x) / 2, (a.y + n.y) / 2, (a.z + n.z) / 2), e.push(s);
	}
	e.push(new L(.07, .022, 4, 10).translate(0, 1.55, 0)), e.push(new A(.022, .022, 4, 4).translate(0, 3.6, 0));
	let i = e.map((e) => {
		let t = e.index ? e.toNonIndexed() : e;
		for (let e of Object.keys(t.attributes)) e !== "position" && e !== "normal" && t.deleteAttribute(e);
		return t.attributes.normal || t.computeVertexNormals(), t;
	});
	ug = on(i);
	for (let t of [...e, ...i]) t !== ug && t.dispose();
	return ug;
}
function mg(e) {
	for (; fg.length <= e;) {
		dg ||= new l({
			color: new P("#b8893a"),
			metalness: .55,
			roughness: .42,
			emissive: new P("#ffc864"),
			emissiveIntensity: .12,
			side: 2
		});
		let e = new N(pg(), dg.clone());
		e.castShadow = !0, e.receiveShadow = !1, e.visible = !1, e.name = "ember:pan", X.engine.scene.add(e), fg.push(e);
	}
	return fg[e];
}
var hg = (e) => e * e * e, gg = new i(), _g = /* @__PURE__ */ new WeakMap();
function vg(e, t) {
	let n = e && e.map, r = n && n.image;
	if (!t || !r || !r.width) return null;
	let i = _g.get(r);
	if (!i) {
		try {
			let e = document.createElement("canvas");
			e.width = r.width, e.height = r.height;
			let t = e.getContext("2d", { willReadFrequently: !0 });
			t.drawImage(r, 0, 0), i = {
				w: e.width,
				h: e.height,
				px: t.getImageData(0, 0, e.width, e.height).data
			};
		} catch {
			return null;
		}
		_g.set(r, i);
	}
	let a = n.offset.x + t.x * n.repeat.x, o = n.offset.y + t.y * n.repeat.y;
	a -= Math.floor(a), o -= Math.floor(o);
	let s = Math.min(i.w - 1, Math.floor(a * i.w)), c = Math.min(i.h - 1, Math.floor((n.flipY ? 1 - o : o) * i.h));
	return i.px[(c * i.w + s) * 4 + 3];
}
var yg = 6, bg = 1.6, xg = "", Sg = null, Cg = null, wg = -1, Tg = 0, Eg = null, Dg = !1, Og = {
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
}, kg = {
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
}, Ag = [
	.45,
	.75,
	1.4
], jg = [
	1.6,
	.85,
	.25
], Mg = [
	1.6,
	.8,
	.3
], Z = (e) => e <= 0 ? 0 : e >= 1 ? 1 : e * e * (3 - 2 * e), Ng = (e) => e < 0 ? 0 : e > 1 ? 1 : e, Pg = (e) => e <= 0 ? 0 : e < .55 ? 1.15 * (1 - (1 - e / .55) ** 3) : e < 1 ? 1.15 - .15 * Z((e - .55) / .45) : 1, Fg = null, Ig = null, Lg = /* @__PURE__ */ new Map(), Rg = {}, zg = new F();
function Bg() {
	if (Fg || !X?.engine) return Fg;
	let e = X.engine.scene, t = new Zr({ capacity: 48 }), n = new Qr({
		capacity: 4,
		heightField: {
			sample: (e, t) => X.tileMap.getHeight(e, t),
			surface: (e, t) => X.tileMap._surface(e, t),
			minX: 0,
			minZ: 0,
			get maxX() {
				return X.tileMap.width;
			},
			get maxZ() {
				return X.tileMap.depth;
			}
		}
	}), r = new Nt({
		atlas: kt(),
		capacity: 320,
		name: "ember:spells"
	}), i = new $r(), a = new ti({ capacity: 15 }), o = new ei({ capacity: 24 }), s = new ni({ capacity: 2 });
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
	}), Fg = {
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
	}, Fg;
}
function Q(e, t) {
	for (let e in Rg) delete Rg[e];
	Object.assign(Rg, t), Fg.quads.set(e, Rg);
}
function Vg(e) {
	for (let t of e.blades || []) Fg.blades.free(t);
	for (let t of e.rocks || []) Fg.rocks.free(t);
	for (let t of e.bells || []) Fg.bells.free(t);
	e.dome && Fg.domeOf === e && (Fg.dome.hide(), Fg.domeOf = null);
	for (let t of e.crystals) Fg.crystals.free(t);
	for (let t of e.quads) Fg.quads.free(t);
	e.gf >= 0 && Fg.frost.free(e.gf);
}
function Hg(e, t, n, r) {
	if (!Fg && !r && !e.length) return;
	let i = Bg();
	if (!i) return;
	i.warmN > 0 && --i.warmN === 0 && (i.crystals.unwarm(), i.frost.unwarm(), i.dome.unwarm(), i.blades.unwarm(), i.rocks.unwarm(), i.bells.unwarm(), i.quads.free(i.warmQuad));
	let a = /* @__PURE__ */ new Set(), o = (e, t) => X.tileMap.getHeight(e, t);
	X.engine.camera.getWorldDirection(zg);
	let s = Math.hypot(zg.x, zg.z) || 1, c = -zg.x / s, l = -zg.z / s, u = null;
	for (let n of e) {
		a.add(n.key);
		let e = Lg.get(n.key);
		e || (e = {
			crystals: [],
			quads: [],
			gf: -1,
			landed: !1,
			seed: (n.seed >>> 0) % 8192
		}, Lg.set(n.key, e));
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
				spread: r == null ? .08 * Z(n.age / .38) : .08 + .92 * Z(r / .3),
				cracks: r == null ? 0 : Z((r - .04) / .5),
				fade: r == null ? 0 : Z((r - 1.5) / 1),
				glow: 1 + .8 * t
			}), e.spikes) for (let n of e.spikes) {
				if (n.h < 0) continue;
				let e = (r - n.start) / .13, a = Z((r - .55) / .3), o = Z((r - .88) / .3);
				i.crystals.set(n.h, {
					rise: Pg(e) * (1 - o),
					crack: a,
					glint: Z((r - .08 - n.start) / .38),
					glow: 1 + .35 * Math.exp(-Math.max(0, r - n.start - .07) / .1) + .2 * t + .5 * a
				});
			}
			let a = r == null ? .25 * Z(n.age / .38) : .25 + 3.2 * t + .6 * (1 - Z((r - .4) / .6));
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
			let t = r == null ? Z(n.age / .38) : 1, a = r == null ? 1 : 1 - Z((r - .35) / .5), s = o(n.x, n.z) + .04;
			if (Q(e.glyph, {
				frame: "partyGlyphHoly",
				x: n.x,
				y: s,
				z: n.z,
				mode: "flat",
				scale: 2 * n.r / 8 * (.35 + .65 * t),
				rot: n.age * .9,
				r: Og.glyph[0],
				g: Og.glyph[1],
				b: Og.glyph[2],
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
				let t = Z(r / .32);
				Q(e.ring, {
					frame: "partyRing",
					index: r < .16 ? 0 : 1,
					x: n.x,
					y: s + .02,
					z: n.z,
					mode: "flat",
					scale: 2.2 * n.r / 6 * (.15 + .85 * t),
					r: Og.ring[0],
					g: Og.ring[1],
					b: Og.ring[2],
					a: .9 * (1 - Z((r - .2) / .3))
				}), Q(e.over, {
					frame: "partySunburst",
					index: Math.min(3, Math.floor(r / .08)),
					x: n.x + c * .3,
					y: s + 1.5,
					z: n.z + l * .3,
					mode: "billboard",
					scale: 1.5,
					r: Og.burst[0],
					g: Og.burst[1],
					b: Og.burst[2],
					a: 1 - Z((r - .15) / .2),
					halo: 1
				});
				for (let t of e.dead) {
					let e = r - t.at, n = o(t.x, t.z), i = .85, a = 3 * i;
					if (e < 0) {
						Q(t.body, {
							frame: "partyPillar",
							a: 0
						}), Q(t.core, {
							frame: "partyPillar",
							a: 0
						}), Q(t.foot, {
							frame: "partySunburst",
							a: 0
						});
						continue;
					}
					Q(t.body, {
						frame: "partyPillar",
						index: 1 + Math.min(2, Math.floor(e / .107)),
						x: t.x + c * .15,
						y: n + a,
						z: t.z + l * .15,
						mode: "billboard",
						scale: i,
						r: Og.body[0],
						g: Og.body[1],
						b: Og.body[2],
						a: .9 * Math.max(0, Math.min(1, (.32 - e) / .14))
					}), Q(t.core, {
						frame: "partyPillar",
						index: 0,
						x: t.x + c * .17,
						y: n + a,
						z: t.z + l * .17,
						mode: "billboard",
						scale: i,
						r: Og.core[0],
						g: Og.core[1],
						b: Og.core[2],
						a: Math.max(0, Math.min(1, (.24 - e) / .1)),
						halo: 1
					}), Q(t.foot, {
						frame: "partySunburst",
						index: Math.min(3, Math.floor(e / .08)),
						x: t.x,
						y: n + .05,
						z: t.z,
						mode: "flat",
						scale: 1.1,
						rot: e * 2,
						r: Og.burst[0],
						g: Og.burst[1],
						b: Og.burst[2],
						a: Math.max(0, 1 - e / .4),
						halo: 1
					});
				}
			}
			let d = r == null ? .4 * Z(n.age / .38) : .4 + 3.4 * Math.exp(-r / .18);
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
				let o = Ng((r - i * .05) / .3), s = Math.sin(o * Math.PI) * .6;
				Q(e, {
					frame: "partyHolyOrb",
					index: Math.floor(r * 12) % 2,
					x: n.x + (n.tx - n.x) * o + c * .2,
					y: t + (a - t) * o + s,
					z: n.z + (n.tz - n.z) * o + l * .2,
					mode: "billboard",
					scale: 1.2,
					r: kg.core[0],
					g: kg.core[1],
					b: kg.core[2],
					a: +(o > 0 && o < 1),
					halo: 1
				});
			});
			let s = r - .3, d = o(n.tx, n.tz), f = .6, p = 3 * f;
			Q(e.body, {
				frame: "partyPillar",
				index: 1 + Math.min(2, Math.max(0, Math.floor(s / .13))),
				x: n.tx + c * .3,
				y: d + p,
				z: n.tz + l * .3,
				mode: "billboard",
				scale: f,
				r: kg.body[0],
				g: kg.body[1],
				b: kg.body[2],
				a: s > 0 ? .85 * Ng((.45 - s) / .18) : 0
			}), Q(e.core, {
				frame: "partyPillar",
				index: 0,
				x: n.tx + c * .32,
				y: d + p,
				z: n.tz + l * .32,
				mode: "billboard",
				scale: f,
				r: kg.core[0],
				g: kg.core[1],
				b: kg.core[2],
				a: s > 0 ? Ng((.28 - s) / .1) : 0,
				halo: 1
			}), Q(e.foot, {
				frame: "partySunburst",
				index: Math.min(3, Math.max(0, Math.floor(s / .08))),
				x: n.tx,
				y: d + .05,
				z: n.tz,
				mode: "flat",
				scale: 1,
				rot: s * 2,
				r: kg.core[0],
				g: kg.core[1],
				b: kg.core[2],
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
			let t = Z(r / .3) * (1 - Z((r - .9) / .5));
			Q(e.glyph, {
				frame: "partyGlyphHoly",
				x: n.x,
				y: o(n.x, n.z) + .04,
				z: n.z,
				mode: "flat",
				scale: .32 + .14 * Z(r / .3),
				rot: r * .8,
				r: Og.glyph[0],
				g: Og.glyph[1],
				b: Og.glyph[2],
				a: .9 * t
			}), e.bursts.forEach((e, t) => {
				let i = n.reached[t], a = r - .15;
				Q(e, {
					frame: "partySunburst",
					index: Math.min(3, Math.max(0, Math.floor(a / .08))),
					x: i.x + c * .2,
					y: o(i.x, i.z) + 1.7,
					z: i.z + l * .2,
					mode: "billboard",
					scale: .9,
					r: Og.burst[0],
					g: Og.burst[1],
					b: Og.burst[2],
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
			let t = Math.atan2(n.tz - n.z, n.tx - n.x), a = -.9 + 1.8 * Z(r / .22), s = o(n.x, n.z) + .75;
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
					runes: Z(r / .15),
					dissolve: Z((r - .28) / .3),
					dissolveDir: 1,
					ghost: .15
				});
			});
		} else if (n.id === "shield_wall" && r != null) e.snaps || (e.snaps = n.reached.slice(0, 8).map(() => i.quads.alloc()), e.quads.push(...e.snaps)), e.snaps.forEach((e, t) => {
			let i = n.reached[t], a = Ng(r / .35);
			Q(e, {
				frame: "partyRing",
				index: a < .5 ? 0 : 1,
				x: i.x,
				y: o(i.x, i.z) + .05,
				z: i.z,
				mode: "flat",
				scale: .25 + .2 * a,
				r: jg[0],
				g: jg[1],
				b: jg[2],
				a: 1 - a
			});
		});
		else if (n.id === "aura_wall") {
			if ((!i.domeOf || !Lg.has(i.domeOf.key)) && (i.dome.show({
				x: n.x,
				y: o(n.x, n.z),
				z: n.z,
				radius: 1.15
			}), i.domeOf = e, e.key = n.key, e.dome = !0, e.t = 0), i.domeOf === e) {
				e.t += t, i.dome.object.position.set(n.x, o(n.x, n.z), n.z), i.dome.object.updateMatrix(), i.dome.object.updateMatrixWorld(!0);
				let r = e.t * .6 % 1;
				i.dome.set({
					rise: Z(e.t / .35),
					dissolve: 1 - Ng(n.k / .8),
					sweepA: r,
					sweepB: (r + .5) % 1
				});
			}
		} else if (n.id === "aura_ward") e.ring || (e.ring = i.quads.alloc(), e.quads.push(e.ring), e.t = 0), e.t += t, Q(e.ring, {
			frame: "partyWardRing",
			x: n.x,
			y: o(n.x, n.z) + .05,
			z: n.z,
			mode: "flat",
			scale: .85 + .05 * Math.sin(e.t * 4),
			rot: e.t * .5,
			r: Ag[0],
			g: Ag[1],
			b: Ag[2],
			a: .9 * Z(e.t / .25),
			halo: 1
		});
		else if (n.id === "firebolt_fly") e.bolt || (e.bolt = i.quads.alloc(), e.quads.push(e.bolt), e.t = 0), e.t += t, Q(e.bolt, {
			frame: "emberBolt",
			index: Math.floor(e.t * 12) % 2,
			x: n.x + c * .2,
			y: o(n.x, n.z) + 1,
			z: n.z + l * .2,
			mode: "billboard",
			scale: 1.5,
			r: Mg[0],
			g: Mg[1],
			b: Mg[2],
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
			let t = Z(r / .12) * (1 - Z((r - .5) / .6)), a = o(n.tx, n.tz);
			e.flames.forEach((i, o) => {
				let s = o / 6 * Math.PI * 2 + e.seed % 5 * .3, c = .45 + .15 * ((o * 3 + e.seed) % 4) / 3;
				Q(i, {
					frame: "wallFlame",
					index: Math.floor(r * 10 + o) % 4,
					x: n.tx + Math.cos(s) * c,
					y: a + .55 * (.8 + .3 * t),
					z: n.tz + Math.sin(s) * c,
					mode: "billboard",
					scale: .9 + .3 * t,
					r: Mg[0],
					g: Mg[1],
					b: Mg[2],
					a: t,
					halo: 1
				});
			}), Q(e.hit, {
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
		} else if (n_[n.id]) {
			let a = n_[n.id](n, e, r, i, o, c, l, t);
			a && (!u || a.k > u.k) && (u = a);
		}
	}
	for (let [e, t] of Lg) a.has(e) || (Vg(t), Lg.delete(e));
	Ig && (u && u.k > .02 ? Ig.set(u.x, o(u.x, u.z) + 1.4, u.z, {
		color: u.color,
		intensity: 2.6 * u.k / (n ?? 1),
		distance: 6.5,
		decay: 1.5,
		flicker: .08
	}) : Ig.off()), i.domeOf && !Lg.has(i.domeOf.key) && (i.dome.hide(), i.domeOf = null), i.crystals.update(t), i.frost.update(t), i.blades.update(t), i.rocks.update(t), i.bells.update(t), i.quads.update();
}
var Ug = [
	1.6,
	1.3,
	.85
], Wg = [
	2,
	1.85,
	1.45
], Gg = [
	1.7,
	.22,
	.32
], Kg = [
	.45,
	1.5,
	.6
], qg = [
	.75,
	.72,
	.8
], Jg = [
	.55,
	.75,
	1.7
], Yg = [
	.55,
	.95,
	1.9
], Xg = [
	.35,
	1.45,
	1.25
], Zg = [
	.75,
	1.55,
	.3
], Qg = [
	1.15,
	.45,
	1.65
], $g = [
	.7,
	.58,
	.42
], $ = (e, t = 1) => ({
	r: e[0] * t,
	g: e[1] * t,
	b: e[2] * t
});
function e_(e, t, n) {
	if (!e[t]) {
		e[t] = [];
		for (let r = 0; r < n; r++) {
			let n = Fg.quads.alloc();
			n >= 0 && (e[t].push(n), e.quads.push(n));
		}
	}
	return e[t];
}
var t_ = (e, t) => {
	let n = Math.hypot(e, t) || 1;
	return {
		dirX: t / n,
		dirZ: -e / n
	};
}, n_ = {
	vault(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let s = e.air || .3, c = e.hit == null ? n >= s + .25 ? n - s : null : e.hit, [l, u, d, f, ...p] = e_(t, "q", 11), m = p.slice(0, 5), h = p.slice(5), g = i(e.tx, e.tz), _ = i(e.fx, e.fz), v = Z(n / s), y = c == null ? 1 : 1 - Z((c - .3) / .4);
		Q(l, {
			frame: "heroSigil",
			x: e.tx,
			y: g + .04,
			z: e.tz,
			mode: "flat",
			scale: .1 + .14 * v,
			rot: n * 2.2,
			...$(Ug, .5 + .6 * v),
			a: .95 * y
		}), h.forEach((t, r) => {
			let i = r * 3.1416 + .8, a = n, o = .25 + .45 * Z(a / .35);
			Q(t, {
				frame: "dust",
				index: Math.min(2, Math.floor(a * 7)),
				x: e.fx + Math.cos(i) * o,
				y: _ + .15 + .15 * a,
				z: e.fz + Math.sin(i) * o,
				mode: "billboard",
				scale: 1.6,
				...$($g),
				a: .8 * (1 - Z(a / .45))
			});
		});
		let b = c ?? -1;
		return Q(u, {
			frame: "heroCrack",
			x: e.tx,
			y: g + .05,
			z: e.tz,
			mode: "flat",
			scale: .62 * Z(b / .1),
			...$(Ug, .9),
			a: b >= 0 ? 1 - Z((b - .45) / .4) : 0
		}), Q(d, {
			frame: "impact",
			index: Math.min(3, Math.floor(b * 14)),
			x: e.tx + a * .3,
			y: g + .7,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 2.8,
			...$(Wg),
			a: +(b >= 0 && b < .25),
			halo: 1
		}), Q(f, {
			frame: "partyRing",
			index: 1,
			x: e.tx,
			y: g + .06,
			z: e.tz,
			mode: "flat",
			scale: .15 + .5 * Z(b / .35),
			...$($g, 1.2),
			a: b >= 0 ? .8 * (1 - Z(b / .45)) : 0
		}), m.forEach((n, r) => {
			let i = r * 1.2566 + t.seed % 5 * .2, a = .35 + .9 * Z(b / .45);
			Q(n, {
				frame: "dust",
				index: Math.min(2, Math.floor(b * 7)),
				x: e.tx + Math.cos(i) * a,
				y: g + .2 + .25 * Math.max(0, b),
				z: e.tz + Math.sin(i) * a,
				mode: "billboard",
				scale: 2.3,
				...$($g),
				a: b >= 0 ? 1 - Z(b / .6) : 0
			});
		}), c == null ? {
			x: e.tx,
			z: e.tz,
			k: .5 * v,
			color: [
				1.4,
				1.2,
				.8
			]
		} : {
			x: e.tx,
			z: e.tz,
			k: 3 * Math.exp(-c / .22),
			color: [
				1.9,
				1.5,
				.8
			]
		};
	},
	cutting_wave(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l] = e_(t, "q", 3), u = e.tx - e.fx, d = e.tz - e.fz, f = Math.hypot(u, d) || 1, p = u / f, m = d / f, h = 3 * Z(n / .35), g = 1 - Z((n - .45) / .35), _ = e.fx + p * h, v = e.fz + m * h, y = i(_, v), b = t_(u, d);
		return Q(s, {
			frame: "heroWaveLit",
			index: Math.floor(n * 24) % 4,
			x: _,
			y: y + .1,
			z: v,
			mode: "flat",
			...b,
			scale: .75,
			...$(Wg),
			a: g,
			halo: 1
		}), Q(c, {
			frame: "heroWave",
			index: (Math.floor(n * 24) + 2) % 4,
			x: _ - p * .5,
			y: y + .08,
			z: v - m * .5,
			mode: "flat",
			...b,
			scale: .6,
			...$(Ug),
			a: .8 * g
		}), Q(l, {
			frame: "heroFangCrestLit",
			index: Math.floor(n * 20) % 4,
			x: _ + a * .2,
			y: y + .55,
			z: v + o * .2,
			mode: "billboard",
			scale: .85,
			...$(Wg),
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
		let s = i(e.x, e.z), [c, l, ...u] = e_(t, "q", 8);
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
			rise: Pg((n - e.start) / .14) * (1 - Z((n - 1) / .35)),
			crack: Z((n - .65) / .3)
		});
		return Q(c, {
			frame: "partyCrack",
			x: e.x,
			y: s + .05,
			z: e.z,
			mode: "flat",
			scale: .35 * Z(n / .15),
			rot: t.seed % 7 * .4,
			...$($g, 1.1),
			a: 1 - Z((n - 1) / .35)
		}), Q(l, {
			frame: "partyRing",
			index: n < .15 ? 0 : 1,
			x: e.x,
			y: s + .07,
			z: e.z,
			mode: "flat",
			scale: .2 + .4 * Z(n / .3),
			...$(Ug, .9),
			a: 1 - Z((n - .1) / .3)
		}), u.forEach((t, r) => {
			let i = r * 1.047 + .3, a = n - .12, o = .6 + .8 * Z(a / .5);
			Q(t, {
				frame: "dust",
				index: Math.min(2, Math.floor(a * 6)),
				x: e.x + Math.cos(i) * o,
				y: s + .25 + .3 * a,
				z: e.z + Math.sin(i) * o,
				mode: "billboard",
				scale: 2.4,
				...$($g),
				a: a > 0 ? 1 - Z(a / .7) : 0
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
		let [s] = e_(t, "q", 1), c = i(e.x, e.z) + .6, l = Z(n / .25), u = Z((n - 4.6) / .45), d = .8;
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
		}), Q(s, {
			frame: "heroCyclone",
			index: Math.floor(n * 18) % 4,
			x: e.x,
			y: i(e.x, e.z) + .15,
			z: e.z,
			mode: "flat",
			scale: .32,
			rot: -n * 6,
			...$(Ug, .75),
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
		let [s, c] = e_(t, "q", 2), l = i(e.tx, e.tz);
		return Q(s, {
			frame: "crit",
			index: Math.min(3, Math.floor(n * 12)),
			x: e.tx + a * .3,
			y: l + .85,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 2.4,
			...$(Gg, 1.2),
			a: +(n < .35),
			halo: 1
		}), Q(c, {
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
		let s = e_(t, "q", 5), c = e_(t, "h", Math.min(4, e.reached.length)), l = Math.atan2(e.tz - e.z, e.tx - e.x), u = 3 * Z(n / .28), d = i(e.x, e.z) + .6;
		return s.forEach((t, r) => {
			let i = l + (r - 2) * .26, a = Math.cos(i), o = Math.sin(i);
			Q(t, {
				frame: "heroBlade",
				index: Math.floor(n * 20) % 2,
				x: e.x + a * (.3 + u),
				y: d,
				z: e.z + o * (.3 + u),
				mode: "flat",
				...t_(a, o),
				scale: .6,
				...$(Kg, 1.2),
				a: +(n < .3),
				halo: 1
			});
		}), c.forEach((t, r) => {
			let s = e.reached[r], c = n - .12;
			Q(t, {
				frame: "impact",
				index: Math.min(3, Math.max(0, Math.floor(c * 14))),
				x: s.x + a * .3,
				y: i(s.x, s.z) + .75,
				z: s.z + o * .3,
				mode: "billboard",
				scale: 2,
				...$(Kg, 1.3),
				a: +(c > 0 && c < .28),
				halo: 1
			});
		}), null;
	},
	shadowstep(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let s = e.air || 0, c = (e.hit == null ? n >= s + .25 ? n - s : null : e.hit) ?? -1, l = e_(t, "p", 8), [u, d] = e_(t, "q", 2), f = i(e.tx, e.tz);
		return l.forEach((t, r) => {
			let a = r < 4 ? {
				x: e.fx,
				z: e.fz,
				t: n
			} : {
				x: e.tx,
				z: e.tz,
				t: c + .05
			}, o = r * 1.57 + .4, s = a.t, l = .15 + .35 * Z(s / .5);
			Q(t, {
				frame: "dust",
				index: Math.min(2, Math.max(0, Math.floor(s * 5))),
				x: a.x + Math.cos(o) * l,
				y: i(a.x, a.z) + .35 + .35 * s,
				z: a.z + Math.sin(o) * l,
				mode: "billboard",
				scale: 2.6,
				r: .35,
				g: .32,
				b: .45,
				a: s > 0 ? 1 - Z(s / .6) : 0
			});
		}), Q(u, {
			frame: "slashBig",
			index: Math.min(3, Math.max(0, Math.floor(c * 16))),
			x: e.tx + a * .3,
			y: f + .8,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 1.1,
			rot: .6,
			...$(Gg, 1.3),
			a: +(c >= 0 && c < .28),
			halo: 1
		}), Q(d, {
			frame: "crit",
			index: Math.min(3, Math.max(0, Math.floor((c - .02) * 12))),
			x: e.tx + a * .32,
			y: f + 1,
			z: e.tz + o * .32,
			mode: "billboard",
			scale: 2.4,
			...$(Gg, 1.4),
			a: +(c > .02 && c < .38),
			halo: 1
		}), c >= 0 ? {
			x: e.tx,
			z: e.tz,
			k: 1.5 * Math.exp(-c / .2),
			color: [
				1.8,
				.4,
				.5
			]
		} : null;
	},
	caltrops(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let s = e_(t, "q", 14), [c] = e_(t, "r", 1), l = 1 - Z((n - 5.4) / .6), u = Math.max(.6, e.r);
		return s.forEach((r, a) => {
			let o = (a * 137.5 + t.seed) % 360 * Math.PI / 180, s = u * .85 * Math.sqrt((a * 61 + t.seed) % 97 / 97), c = e.tx + Math.cos(o) * s, d = e.tz + Math.sin(o) * s, f = Ng((n - a * .015) / .25), p = .6 + .4 * Math.sin(n * 6 + a * 1.7);
			Q(r, {
				frame: "partyIceShard",
				index: a % 4,
				x: c,
				y: i(c, d) + .06 + .8 * (1 - f) * Math.sin(f * Math.PI),
				z: d,
				mode: "billboard",
				scale: .55,
				...$(qg, .8 + .6 * p),
				a: f > 0 ? l : 0
			});
		}), Q(c, {
			frame: "partyRing",
			index: 1,
			x: e.tx,
			y: i(e.tx, e.tz) + .05,
			z: e.tz,
			mode: "flat",
			scale: 2 * u / 6,
			...$(Gg, .5),
			a: .7 * Z(n / .3) * l
		}), null;
	},
	flare(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l, u, ...d] = e_(t, "q", 10), f = i(e.tx, e.tz), p = n - .7;
		return Q(s, {
			frame: "heroSigil",
			x: e.tx,
			y: f + .04,
			z: e.tz,
			mode: "flat",
			scale: .1 + .12 * Z(n / .7),
			rot: n * 2.2,
			...$(Mg, .9),
			a: n < .7 ? .8 + .2 * Math.sin(n * 30) : 1 - Z(p / .3)
		}), Q(c, {
			frame: "pillar",
			index: Math.floor(Math.max(0, p) * 12) % 4,
			x: e.tx + a * .2,
			y: f + 1.6,
			z: e.tz + o * .2,
			mode: "billboard",
			scale: 1.4,
			...$(Mg, 1.1),
			a: p > 0 ? 1 - Z((p - .25) / .3) : 0,
			halo: 1
		}), Q(l, {
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
			a: p > 0 ? Ng((.25 - p) / .1) : 0,
			halo: 1
		}), Q(u, {
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
			Q(t, {
				frame: "wallFlame",
				index: Math.floor(n * 10 + r) % 4,
				x: e.tx + Math.cos(i) * a,
				y: f + .5,
				z: e.tz + Math.sin(i) * a,
				mode: "billboard",
				scale: 1,
				...$(Mg),
				a: p > 0 ? 1 - Z((p - .25) / .35) : 0,
				halo: 1
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: p > 0 ? 3.2 * Math.exp(-p / .25) : .4 * Z(n / .7),
			color: [
				1.9,
				.95,
				.35
			]
		};
	},
	gather(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c] = e_(t, "q", 2), l = e_(t, "p", Math.min(5, e.reached.length)), u = i(e.tx, e.tz), d = 1 - Z((n - .5) / .35);
		return Q(s, {
			frame: "partySwirl",
			index: Math.floor(n * 8) % 2,
			x: e.tx,
			y: u + .08,
			z: e.tz,
			mode: "flat",
			scale: e.r * 2 / 5 * (1 - .6 * Z(n / .5)),
			rot: n * 7,
			...$(Jg, 1.1),
			a: d
		}), Q(c, {
			frame: "partySwirl",
			index: (Math.floor(n * 8) + 1) % 2,
			x: e.tx,
			y: u + .5,
			z: e.tz,
			mode: "flat",
			scale: e.r * 2 / 7 * (1 - .6 * Z(n / .5)),
			rot: -n * 9,
			...$(Jg, 1.4),
			a: .8 * d,
			halo: 1
		}), l.forEach((t, r) => {
			let a = e.reached[r], o = Z(n / .4), s = a.x + (e.tx - a.x) * .5 * o, c = a.z + (e.tz - a.z) * .5 * o;
			Q(t, {
				frame: "heroGaleLit",
				index: Math.floor(n * 20) % 4,
				x: s,
				y: i(s, c) + .4,
				z: c,
				mode: "flat",
				...t_(e.tx - a.x, e.tz - a.z),
				scale: .45,
				...$(Jg, 1.3),
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
			spread: .1 * Z(e.age / .38),
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
		let s = e_(t, "s", Math.min(5, e.reached.length)), c = Z((n - 2.4) / .3);
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
			rise: Pg(n / .13) * (1 - c),
			crack: Z((n - 2.1) / .3),
			glint: Z(n / .4),
			glow: 1.1
		})), t.gf >= 0 && r.frost.set(t.gf, {
			spread: .1 + .9 * Z(n / .3),
			cracks: Z((n - .1) / .5),
			fade: Z((n - 2.3) / .6),
			glow: 1 + .6 * Math.exp(-n / .2)
		}), s.forEach((t, r) => {
			let s = e.reached[r];
			Q(t, {
				frame: "partyIceShellLit",
				index: +(n > 2.1),
				x: s.x + a * .12,
				y: i(s.x, s.z) + .6,
				z: s.z + o * .12,
				mode: "billboard",
				scale: 1.15 - .1 * Z(n / .1),
				...$(Yg, .85),
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
		let [s, c, l] = e_(t, "q", 3), u = e_(t, "f", 18), d = i(e.tx, e.tz), f = Z(n / .4) * (1 - Z((n - 5.4) / .6)), p = Math.max(.6, e.r);
		return Q(l, {
			frame: "partyFrostFloor",
			x: e.tx,
			y: d + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 4,
			rot: .3,
			...$(Yg, .55),
			a: .8 * f
		}), Q(s, {
			frame: "partySwirl",
			index: Math.floor(n * 6) % 2,
			x: e.tx,
			y: d + 2,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 5 * 1.1,
			rot: n * 2.4,
			...$(Yg, .9),
			a: .85 * f
		}), Q(c, {
			frame: "partySwirl",
			index: (Math.floor(n * 6) + 1) % 2,
			x: e.tx,
			y: d + 1.1,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 5 * .75,
			rot: -n * 3.6,
			...$(Yg, 1.1),
			a: .85 * f,
			halo: 1
		}), u.forEach((t, r) => {
			let i = (n * (.55 + r % 5 * .07) + r * .137) % 1, a = r * 2.399 + n * .8, o = p * .9 * Math.sqrt(r * 31 % 17 / 17), s = e.tx + Math.cos(a) * o, c = e.tz + Math.sin(a) * o;
			Q(t, {
				frame: "partyIceFlake",
				index: r % 2,
				x: s,
				y: d + 2.1 * (1 - i) + .05,
				z: c,
				mode: "billboard",
				scale: 1.4,
				...$(Yg, 1.3),
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
		let [s] = e_(t, "q", 1), c = e_(t, "m", 8), l = e_(t, "r", Math.min(3, e.reached.length)), u = i(e.tx, e.tz), d = Z(n / .3) * (1 - Z((n - 3.5) / .5)), f = Math.max(.6, e.r);
		return Q(s, {
			frame: "partyGlyphHoly",
			x: e.tx,
			y: u + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * f / 8,
			rot: n * .6,
			...$(kg.core, .8),
			a: .9 * d,
			halo: 1
		}), c.forEach((t, r) => {
			let i = (n * .6 + r / 8) % 1, a = r * .785 + n * .5, o = f * .7;
			Q(t, {
				frame: "partyHolyOrb",
				index: r % 2,
				x: e.tx + Math.cos(a) * o,
				y: u + .2 + 1.6 * i,
				z: e.tz + Math.sin(a) * o,
				mode: "billboard",
				scale: .9,
				...$(kg.core),
				a: d * (1 - i),
				halo: 1
			});
		}), l.forEach((t, r) => {
			let a = e.reached[r];
			Q(t, {
				frame: "partyWardRing",
				x: a.x,
				y: i(a.x, a.z) + .06,
				z: a.z,
				mode: "flat",
				scale: .9,
				rot: n,
				...$(kg.core, .9),
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
		let [s, c] = e_(t, "q", 2), l = e_(t, "s", 5), u = i(e.tx, e.tz), d = Z(n / .4) * (1 - Z((n - 7.4) / .6)), f = Math.max(.6, e.r);
		return Q(s, {
			frame: "partyGlyphHoly",
			x: e.tx,
			y: u + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * f / 8,
			rot: -n * .3,
			...$(Og.glyph, 1),
			a: .9 * d,
			halo: 1
		}), Q(c, {
			frame: "partyRing",
			index: 1,
			x: e.tx,
			y: u + .05,
			z: e.tz,
			mode: "flat",
			scale: 2 * f / 6,
			...$(Og.ring, 1.1),
			a: .8 * d
		}), l.forEach((t, r) => {
			let i = r * 1.2566 + n * .2, a = f * .6, o = (n * .5 + r * .2) % 1;
			Q(t, {
				frame: "partyPillar",
				index: 1 + r % 3,
				x: e.tx + Math.cos(i) * a,
				y: u + 1.2,
				z: e.tz + Math.sin(i) * a,
				mode: "billboard",
				scale: .45,
				...$(Og.body, .7),
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
		let [s, c, l, u] = e_(t, "q", 4), d = e_(t, "m", 6), f = i(e.tx, e.tz), p = .9, m = 3 * p;
		return Q(s, {
			frame: "partyPillar",
			index: 1 + Math.min(2, Math.floor(n / .15)),
			x: e.tx + a * .2,
			y: f + m,
			z: e.tz + o * .2,
			mode: "billboard",
			scale: p,
			...$(Og.body),
			a: .95 * Ng((1 - n) / .4)
		}), Q(c, {
			frame: "partyPillar",
			index: 0,
			x: e.tx + a * .22,
			y: f + m,
			z: e.tz + o * .22,
			mode: "billboard",
			scale: p,
			...$(Og.core),
			a: Ng((.5 - n) / .2),
			halo: 1
		}), Q(l, {
			frame: "partySunburst",
			index: Math.min(3, Math.floor(n / .1)),
			x: e.tx,
			y: f + .05,
			z: e.tz,
			mode: "flat",
			scale: 1.4,
			rot: n * 2,
			...$(Og.burst),
			a: Math.max(0, 1 - n / .6),
			halo: 1
		}), Q(u, {
			frame: "partySunburst",
			index: Math.min(3, Math.floor((n - .3) / .08)),
			x: e.tx + a * .3,
			y: f + 1.6,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 1.4,
			...$(Og.burst),
			a: n > .3 ? 1 - Z((n - .45) / .25) : 0,
			halo: 1
		}), d.forEach((t, r) => {
			let i = Ng((n - r * .08) / 1.1), a = r * 1.047;
			Q(t, {
				frame: "partyHolyOrb",
				index: r % 2,
				x: e.tx + Math.cos(a) * .3,
				y: f + .2 + 1.8 * i,
				z: e.tz + Math.sin(a) * .3,
				mode: "billboard",
				scale: .9,
				...$(Og.core),
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
		let [s, c, l, u] = e_(t, "q", 4), d = e_(t, "six", 6), f = i(e.tx, e.tz), p = Math.max(.6, e.r), m = n - .8;
		Q(s, {
			frame: "partyGlyphHoly",
			x: e.tx,
			y: f + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 8 * (.4 + .6 * Z(n / .4)),
			rot: n * 1.2,
			...$(Og.glyph),
			a: .9 * (1 - Z((n - 1.2) / .4)),
			halo: 1
		}), d.forEach((t, r) => {
			let s = r * 1.047 + .2, c = n - .1 - r * .05, l = e.tx + Math.cos(s) * p * .75, u = e.tz + Math.sin(s) * p * .75;
			Q(t, {
				frame: "partyPillar",
				index: 1 + Math.min(2, Math.max(0, Math.floor(c / .1))),
				x: l + a * .1,
				y: i(l, u) + 1.5,
				z: u + o * .1,
				mode: "billboard",
				scale: .5,
				...$(Og.body),
				a: c > 0 ? Ng((.35 - c) / .12) : 0,
				halo: 1
			});
		});
		let h = 1.3, g = 3 * h;
		return Q(c, {
			frame: "partyPillar",
			index: 1 + Math.min(2, Math.max(0, Math.floor(m / .12))),
			x: e.tx + a * .25,
			y: f + g,
			z: e.tz + o * .25,
			mode: "billboard",
			scale: h,
			...$(Og.body, 1.2),
			a: m > 0 ? Ng((.45 - m) / .15) : 0
		}), Q(l, {
			frame: "partyPillar",
			index: 0,
			x: e.tx + a * .27,
			y: f + g,
			z: e.tz + o * .27,
			mode: "billboard",
			scale: h,
			...$(Og.core, 1.2),
			a: m > 0 ? Ng((.3 - m) / .1) : 0,
			halo: 1
		}), Q(u, {
			frame: "partySunburst",
			index: Math.min(3, Math.max(0, Math.floor(m / .08))),
			x: e.tx,
			y: f + .05,
			z: e.tz,
			mode: "flat",
			scale: 1.8,
			rot: m * 2,
			...$(Og.burst),
			a: m > 0 ? Math.max(0, 1 - m / .45) : 0,
			halo: 1
		}), {
			x: e.tx,
			z: e.tz,
			k: m > 0 ? 3.4 * Math.exp(-m / .2) : .8 * Z(n / .3),
			color: [
				1.9,
				1.4,
				.5
			]
		};
	},
	binding_roots(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s] = e_(t, "q", 1), c = e_(t, "t", Math.min(15, e.reached.length * 3)), l = i(e.tx, e.tz), u = 1 - Z((n - 2.1) / .4);
		return Q(s, {
			frame: "partyRing",
			index: n < .15 ? 0 : 1,
			x: e.tx,
			y: l + .05,
			z: e.tz,
			mode: "flat",
			scale: 2 * Math.max(.6, e.r) / 6 * (.4 + .6 * Z(n / .25)),
			...$(Zg, .9),
			a: 1 - Z((n - .3) / .4)
		}), c.forEach((t, r) => {
			let s = e.reached[Math.floor(r / 3)], c = r % 3 * 2.094 + .5, l = s.x + Math.cos(c) * .22, d = s.z + Math.sin(c) * .22;
			Q(t, {
				frame: "partyIceSpike",
				index: Math.min(2, Math.floor(n * 10)),
				x: l + a * .05,
				y: i(l, d) + .35 * Z(n / .18),
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
		let [s, c, l] = e_(t, "q", 3), u = i(e.tx, e.tz), d = e.k || 1;
		return Q(s, {
			frame: "heroRunes",
			index: (d - 1) % 2,
			x: e.tx + a * .3,
			y: u + 1.45 + .1 * n,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: .7 + .15 * d,
			...$(d >= 3 ? Qg : Xg, 1.1 + .2 * d),
			a: 1 - Z((n - .45) / .3),
			halo: 1
		}), Q(c, {
			frame: "crit",
			index: Math.min(3, Math.floor(n * 12)),
			x: e.tx + a * .32,
			y: u + .85,
			z: e.tz + o * .32,
			mode: "billboard",
			scale: 2.6,
			...$(Qg, 1.3),
			a: +(d >= 3 && n < .35),
			halo: 1
		}), Q(l, {
			frame: "partySunburst",
			index: Math.min(3, Math.floor(n / .08)),
			x: e.tx + a * .3,
			y: u + .9,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 1.3,
			...$(Qg, 1.2),
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
		let s = i(e.tx, e.tz), c = Z(n / .4), l = Z((n - 7.4) / .6), u = n % 1.5 / 1.5, [d, f] = e_(t, "q", 2);
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
		}), Q(d, {
			frame: "partyWardRing",
			x: e.tx,
			y: s + .05,
			z: e.tz,
			mode: "flat",
			scale: 2.2,
			rot: n * .4,
			...$(Xg, .8),
			a: .85 * c * (1 - l),
			halo: 1
		}), Q(f, {
			frame: "partyRing",
			index: u < .15 ? 0 : 1,
			x: e.tx,
			y: s + .07,
			z: e.tz,
			mode: "flat",
			scale: .3 + .7 * (1 - u),
			...$(Xg, 1.2),
			a: c * (1 - l) * (1 - Z(u / .8))
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
		let [s, c, l] = e_(t, "q", 3), u = e_(t, "g", Math.min(5, e.reached.length)), d = i(e.tx, e.tz), f = Z(n / .3), p = Math.max(.6, e.r);
		return Q(s, {
			frame: "partyRing",
			index: n < .12 ? 0 : 1,
			x: e.tx,
			y: d + .06,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 6 * (.15 + .95 * f),
			...$(Xg, 1.4),
			a: 1 - Z((n - .25) / .3),
			halo: 1
		}), Q(c, {
			frame: "partyRing",
			index: 1,
			x: e.tx,
			y: d + .6,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 6 * (.1 + .7 * f),
			...$([
				1.6,
				1.6,
				1.9
			], 1),
			a: .7 * (1 - Z((n - .15) / .25))
		}), Q(l, {
			frame: "partySunburst",
			index: Math.min(3, Math.floor(n / .07)),
			x: e.tx + a * .3,
			y: d + .8,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 1.5,
			...$(Xg, 1.3),
			a: Math.max(0, 1 - n / .3),
			halo: 1
		}), u.forEach((t, r) => {
			let a = e.reached[r], o = n - .08;
			Q(t, {
				frame: "heroGaleLit",
				index: Math.floor(n * 20) % 4,
				x: a.x,
				y: i(a.x, a.z) + .4,
				z: a.z,
				mode: "flat",
				...t_(a.x - e.tx, a.z - e.tz),
				scale: .55,
				...$(Xg, 1.2),
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
		let [c] = e_(t, "q", 1);
		return t.t = (t.t || 0) + s, Q(c, {
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
		let [c] = e_(t, "q", 1);
		return t.t = (t.t || 0) + s, Q(c, {
			frame: "partyIceShellLit",
			index: 0,
			x: e.x + a * .12,
			y: i(e.x, e.z) + .6,
			z: e.z + o * .12,
			mode: "billboard",
			scale: 1.1,
			...$(Yg, .85),
			a: Z(t.t / .1),
			halo: 1
		}), null;
	},
	aura_root(e, t, n, r, i, a, o, s) {
		let c = e_(t, "q", 3);
		return t.t = (t.t || 0) + s, c.forEach((t, n) => {
			let r = n * 2.094 + .5, s = e.x + Math.cos(r) * .22, c = e.z + Math.sin(r) * .22;
			Q(t, {
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
};
function r_(e) {
	let t = JSON.stringify(e), n = 2166136261, r = 16777619;
	for (let e = 0; e < t.length; e++) {
		let i = t.charCodeAt(e);
		n = Math.imul(n ^ i, 16777619), r = Math.imul(r ^ i, 2246822507) ^ r >>> 13;
	}
	return `${t.length}.${(n >>> 0).toString(36)}.${(r >>> 0).toString(36)}`;
}
var i_ = (e) => r_(e.map((e) => [
	e.id,
	e.x,
	e.z,
	e.prop || "",
	+!!e.arch
])), a_ = {
	ready: !1,
	prepare(e, t = "vale") {
		if (!X || Ep) return !1;
		let n = Hn(e).level, r = `${t}|${r_(n)}`;
		if (r === wp || xp.has(r) || Op?.key === r) return !1;
		Mp();
		try {
			let e = X.prepareWorld(n, () => !0);
			Op = {
				key: r,
				level: n,
				world: e,
				steps: e.buildSteps({ paced: !0 }),
				wait: null,
				done: !1,
				t0: performance.now()
			}, setTimeout(jp, Ap);
		} catch (e) {
			return console.warn("[luminati] building a level ahead:", e), Op = null, !1;
		}
		return !0;
	},
	get game() {
		return X;
	},
	loadStats() {
		let e = X?.engine?.renderer;
		return {
			swap: X?.loadStats?.lastSwap ?? null,
			programs: e?.info?.programs?.length ?? 0,
			geometries: e?.info?.memory?.geometries ?? 0,
			textures: e?.info?.memory?.textures ?? 0,
			kept: xp.size,
			ahead: Op ? Op.done ? "ready" : "building" : "",
			last: Dp
		};
	},
	async load(e, t = [], n = "vale") {
		let r = ++lp;
		n !== dh && (dh = n, uh.clear());
		let i = Hn(e).level, a = `${n}|${r_(i)}`, o = i_(t);
		Ep = !0, cp = (async () => {
			let e = null;
			if (!X) await zh(i), Dp = "built";
			else {
				e = xp.get(a) || null, e && xp.delete(a);
				let t = !e && Op && Op.key === a ? Op : null;
				t && (Op = null);
				let n = e ? e.kept.level : t ? t.level : i;
				Dp = e ? "kept" : t ? "ahead" : "built";
				let { aside: r } = await X.swapLevel(n, {
					spawn: i.spawn,
					keep: !0,
					kept: e ? e.kept : null,
					prepared: t ? Pp(t) : null
				});
				if (r && wp) {
					for (let e of wm) X.engine.scene.remove(e);
					for (xp.set(wp, {
						kept: r,
						env: wm,
						made: km,
						envKey: Tp
					}), wm = [], km = /* @__PURE__ */ new Map(); xp.size > Sp;) {
						let [e, t] = xp.entries().next().value;
						xp.delete(e), X.disposeKept(t.kept), Pm(t.env, t.made);
					}
				}
			}
			if (wp = a, r === lp) {
				if (Bh(), Dg = !!i.environment?.interior, a_.settings({ dof: up }), $m(i, n), e && e.envKey === o) {
					Pm(wm, km), wm = e.env, km = e.made;
					for (let e of wm) X.engine.scene.add(e), e.update?.(0, X.engine.camera);
				} else e && Pm(e.env, e.made), await Fm(t, n);
				if (Tp = o, Dg && /b/.test(xg)) {
					let e = Zf(X.tileMap, X.engine?.renderer);
					globalThis.__dlook = e;
				}
			}
		})();
		try {
			await cp;
		} finally {
			Ep = !1;
		}
		return r === lp;
	},
	settings(e = {}) {
		if (e.dof && (up = e.dof), typeof e.dlook == "string" && (xg = e.dlook), (e.res === "sharp" || e.res === "balanced" || e.res === "fast") && (dp = e.res), X?.engine && (dp !== "sharp" || fp !== "sharp")) {
			let e = X.engine, t = Math.min(globalThis.devicePixelRatio || 1, e.maxPixelRatio || ep), n = dp === "fast" ? 1.5 : dp === "balanced" ? 2 : 0;
			X.resolution && (X.resolution.manual = n > 0), e.renderScale = n > 0 ? Math.min(1, n / t) : 1, fp = dp;
		}
		e.bright > 0 && (Um = e.bright), e.figLit > 0 && (Gm = e.figLit), e.carryUp > 0 && (yg = e.carryUp), e.carryGain > 0 && (bg = e.carryGain), e.figMax > 0 && (Km = e.figMax), (e.figures === "models" || e.figures === "sprites") && (Kp = e.figures), [
			"chosen",
			"doors",
			"all",
			"sprites"
		].includes(e.landmarks) && (Tm = e.landmarks);
		let t = X?.postfx?.settings;
		t?.dof && Object.assign(t.dof, {
			enabled: up !== "off" && !Dg,
			focusRange: 1e4,
			tiltShift: .45,
			tiltCenter: .5,
			tiltWidth: .7,
			tiltFeather: .15
		}), (e.quality === "high" || e.quality === "low") && (hp = e.quality), Mh();
	},
	frame(e) {
		if (!X || !X.engine) return;
		Wm = e.bright > 0 ? e.bright : 1, Lh.x = e.focus[0], Lh.y = e.focus[1], Lh.z = e.focus[2], Lh.ppu = e.ppu, Number.isFinite(e.hour) && Math.abs((X.lighting?.timeOfDay ?? -1) - e.hour) > .004 && X.setTime(e.hour), e.weather && X.weather?.weather !== e.weather && X.setWeather(e.weather), X.lighting?.settings && (X.lighting.settings.fogMul = 1 + .6 * (e.fog || 0), X.lighting.settings.pointLightMul = e.ambient?.lamps ?? 1), e.hero && X.player && (Bh(), X.player.position.set(e.hero[0], X.tileMap.getHeight(e.hero[0], e.hero[1]), e.hero[1])), qm = Xm();
		let t = /* @__PURE__ */ new Map(), n = X.engine.camera, r = /* @__PURE__ */ new Map();
		lm++, n.getWorldDirection(qp);
		let i = Math.atan2(-qp.x, -qp.z);
		for (let a of e.actors) {
			let o = r.get(a.name) || 0;
			if (r.set(a.name, o + 1), Sm(a, a.key ?? `${a.name}#${o}`, Math.max(0, Math.min(.1, e.dt || 0)), i)) continue;
			let s = Vp(a.name);
			if (!s) continue;
			let c = a.cw ? a.cw / s.meta.cw : 1, l = Hp(s, c), u = t.get(l) || 0;
			t.set(l, u + 1);
			let d = Wp(l, u);
			d.visible = !0, d.material.emissiveIntensity !== qm && (d.material.emissiveIntensity = qm), (d._col !== a.col || d._row !== a.row) && d.setFrame(a.col, a.row), Gp(d, a.x, a.z, (s.meta.ch - s.meta.ay) * c, l.pixelsPerUnit * c);
			let f = a.flash || 0, p = f ? 0 : Math.round((a.warn || 0) * 20) / 20;
			if (d._emberFlash !== f || d._emberWarn !== p) {
				d._emberFlash = f, d._emberWarn = p;
				let e = 1 + f * 2.6;
				d.tint = p ? new P(1 + .9 * p, 1 + .12 * p, 1 - .35 * p) : new P(e, e * .96, e * .9);
			}
			let m = 1 - (a.fade || 0);
			Math.abs(d.opacity - m) > .01 && (d.opacity = m), d.update(0, n);
		}
		for (let r of e.bits || []) {
			let e = mh(r), i = t.get(e) || 0;
			t.set(e, i + 1);
			let a = hh(e, i), o = r.glow ? 1.6 : .3;
			a.visible = !0, a.material.emissiveIntensity !== o && (a.material.emissiveIntensity = o), Gp(a, r.x, r.z, r.canvas.height - r.ay - r.lift, tp);
			let s = r.flash || 0;
			if (a._emberFlash !== s) {
				a._emberFlash = s;
				let e = 1 + s * 2.6;
				a.tint = new P(e, e * .96, e * .9);
			}
			a.update(0, n);
		}
		for (let [e, n] of Up) {
			let r = t.get(e) || 0;
			for (let e = r; e < n.length; e++) n[e].visible && (n[e].visible = !1);
		}
		Cm();
		let a = {
			ring: 0,
			disc: 0,
			rim: 0,
			focus: 0,
			wfill: 0,
			wrim: 0,
			lane: 0,
			cone: 0,
			crim: 0
		};
		for (let t of e.rings || []) tg(eg("ring", a.ring++), t.x, t.z, 1, t.col, t.a);
		if (e.mark) {
			let t = eg("focus", a.focus++);
			tg(t, e.mark.x, e.mark.z, 1, [
				255,
				226,
				150
			], .7 + .2 * Math.sin(Tg * 4)), t.rotation.z = Tg, Tg += (e.dt || 0) * .9;
		}
		for (let t of e.hazards || []) tg(eg("disc", a.disc++), t.x, t.z, t.r, t.col, .82 * t.a), tg(eg("rim", a.rim++), t.x, t.z, t.r, t.rim, .42 * t.a);
		for (let t of e.warns || []) {
			let e = t.heavy ? 1 : .62, n = t.hit > 0 ? t.hit : 1, r = 1 - (1 - t.p) * (1 - t.p);
			t.lane ? (ng(eg("lane", a.lane++), t.x, t.z, t.tx, t.tz, 1, t.w * 1.25, ag, .3 * e * n), ng(eg("lane", a.lane++), t.x, t.z, t.tx, t.tz, 1, t.w, rg, .16 * e * n), ng(eg("lane", a.lane++), t.x, t.z, t.tx, t.tz, t.p, t.w * .7, t.hit > 0 ? ig : rg, (.22 + .28 * t.p) * e * n), tg(eg("wrim", a.wrim++), t.tx, t.tz, t.heavy ? .42 : .3, t.hit > 0 ? ig : rg, (.35 + .4 * t.p) * e * n)) : (tg(eg("wrim", a.wrim++), t.tx, t.tz, t.r * 1.1, ag, .5 * n), tg(eg("wfill", a.wfill++), t.tx, t.tz, t.r * r, t.hit > 0 ? ig : rg, (.26 + .3 * t.p) * n), tg(eg("wrim", a.wrim++), t.tx, t.tz, t.r, t.hit > 0 ? ig : rg, (.7 + .3 * t.p) * n));
		}
		let o = 0;
		for (let t of e.tells || []) {
			let e = 1 - (1 - t.p) * (1 - t.p), n = t.hit > 0, r = n ? ig : rg, i = n ? t.hit : 1;
			if (t.kind === "scales") {
				let e = mg(o++), r = n ? lg * hg(Ng((1 - t.hit - .35) / .65)) : lg * (1 - hg(t.p));
				e.visible = !0, e.position.set(t.x, X.tileMap.getHeight(t.x, t.z) + .02 + r, t.z), e.scale.setScalar(t.r * .95), e.rotation.y = t.p * .6, e.material.emissiveIntensity = .12 + .25 * t.p + (n ? 1.6 * t.hit * t.hit : 0), tg(eg("wrim", a.wrim++), t.x, t.z, t.r * .9, n ? ig : cg, (.45 + .4 * t.p) * i);
			}
			if (t.kind === "vent") {
				let r = .85 + .15 * Math.sin(performance.now() * .012 + t.x * 3.1);
				tg(eg("wrim", a.wrim++), t.x, t.z, t.r * 1.08, ag, .5 * i), tg(eg("wfill", a.wfill++), t.x, t.z, t.r * e, n ? ig : og, (.28 + .36 * t.p) * r * i), tg(eg("wfill", a.wfill++), t.x, t.z, t.r * .5 * e, n ? ig : sg, .35 * t.p * r * i), tg(eg("wrim", a.wrim++), t.x, t.z, t.r, n ? ig : og, (.75 + .25 * t.p) * i);
				continue;
			}
			if (t.kind === "sweep") {
				let o = Math.atan2(-t.dz, t.dx), s = (e, a, s) => {
					tg(e, t.x, t.z, a, n ? ig : s === .5 ? ag : r, s * i), e.visible && (e.rotation.z = o);
				};
				s(eg("cone", a.cone++), t.r * 1.03, .5), s(eg("cone", a.cone++), t.r * e, .22 + .32 * t.p), s(eg("crim", a.crim++), t.r, .75 + .25 * t.p);
				for (let e of [-1, 1]) {
					let n = o + e * Jh / 2;
					ng(eg("lane", a.lane++), t.x, t.z, t.x + Math.cos(n) * t.r, t.z - Math.sin(n) * t.r, 1, .06, r, (.7 + .3 * t.p) * i);
				}
			} else tg(eg("wrim", a.wrim++), t.x, t.z, t.r * 1.08, ag, .5 * i), tg(eg("wfill", a.wfill++), t.x, t.z, t.r * e, r, (.24 + .32 * t.p) * i), tg(eg("wrim", a.wrim++), t.x, t.z, t.r, r, (.75 + .25 * t.p) * i);
		}
		for (let e = o; e < fg.length; e++) fg[e].visible && (fg[e].visible = !1);
		bm(e.puffs), wh(e.water), Ch(e.gates);
		for (let e of Object.keys(Qh)) for (let t = a[e]; t < Qh[e].length; t++) Qh[e][t].visible = !1;
		if (wg !== lp) {
			let e = Ih();
			wg = lp, Cg = X.world?.acquireSpellLight?.({ minor: !1 }) ?? null;
			let t = Ih();
			Sg = X.world?.acquireSpellLight?.({ minor: !1 }) ?? null;
			let n = Ih();
			Ig = X.world?.acquireSpellLight?.({ minor: !1 }) ?? null, vp = [...t].filter((t) => !e.has(t)).concat([...Ih()].filter((e) => !n.has(e))), Fh();
			for (let e of Lg.values()) Fg && Vg(e);
			Lg.clear();
		}
		if (Cg && e.hero) {
			let t = Math.max(0, Math.min(1, e.carry ?? 0)), n = e.hero[0] + .35, r = e.hero[1] + .35, i = Kp === "models" ? yg : 2.4, a = Kp === "models" ? bg : 1;
			Cg.set(n, X.tileMap.getHeight(e.hero[0], e.hero[1]) + i, r, {
				color: [
					1.9,
					1.15,
					.42
				],
				intensity: 4.5 * a * t / (e.ambient?.lamps ?? 1),
				distance: Kp === "models" ? Math.hypot(6.2, i) : 6 + (i - 2.4),
				decay: 1.4,
				flicker: 0
			});
		}
		if (Sg) {
			let t = e.blast;
			t && t.k > .01 ? Sg.set(t.x, X.tileMap.getHeight(t.x, t.z) + 1.6, t.z, {
				color: [
					2,
					.95,
					.32
				],
				intensity: 9 * t.k / (e.ambient?.lamps ?? 1),
				distance: 7,
				decay: 1.6,
				flicker: .25
			}) : Sg.off();
		}
		if (Hg(e.spells || [], e.dt || 0, e.ambient?.lamps, !!(e.rings && e.rings.length)), Dg) for (let e of X.lighting?._pointLights || []) e.flicker > Cp && (e.flicker = Cp);
		let s = 0;
		for (let t of e.beasts || []) {
			let e = fh(t.id);
			if (!e) continue;
			let r = Eh(s++, e);
			r.visible = !0, Gp(r, t.x, t.z, e.below, tp), r.update(0, n);
		}
		for (let e = s; e < Th.length; e++) Th[e]?.visible && (Th[e].visible = !1);
		Eg = e.ambient || null;
		for (let e of wm) e.update?.(0, n);
		jh(e.light), X.engine.step(Math.max(0, Math.min(.1, e.dt)), { render: e.draw !== !1 });
	},
	sprites(e) {
		X && (Tp = i_(e), Fm(e, dh));
	},
	project(e, t, n) {
		if (!X) return null;
		let r = new F(e, t, n).project(X.engine.camera);
		return [(r.x + 1) / 2 * innerWidth, (1 - r.y) / 2 * innerHeight];
	},
	occluded(e) {
		if (!X) return e.map(() => null);
		let t = X.engine.camera, n = /* @__PURE__ */ new Set(), r = [];
		for (let e of cm.values()) n.add(e.root);
		for (let e of Up.values()) for (let t of e) n.add(t);
		for (let e of Th) e && n.add(e);
		for (let e of Object.keys(Qh)) for (let t of Qh[e]) n.add(t);
		let i = (e) => {
			if (n.has(e) || !e.visible || e.parent && e.parent.shadowProxy === e) return;
			let t = e.material, a = Array.isArray(t) ? t[0] : t;
			(e.isMesh || e.isInstancedMesh) && !e.isPoints && a && a.colorWrite !== !1 && a.depthWrite !== !1 && !(a.transparent && a.opacity < .5) && r.push(e);
			for (let t of e.children) i(t);
		};
		i(X.engine.scene);
		let a = gg, o = new F(), s = new F(), c = new F();
		return a.camera = t, e.map(([e, n, i]) => {
			o.set(e, n, i), t.isOrthographicCamera ? (t.getWorldDirection(c).multiplyScalar(-1), a.far = 400) : (t.getWorldPosition(s), c.copy(s).sub(o), a.far = c.length(), c.normalize()), a.set(o.clone().addScaledVector(c, .05), c);
			for (let e of a.intersectObjects(r, !1)) {
				if (e.object.name === "Sprite3D.mesh") {
					let t = vg(e.object.material, e.uv);
					if (t === null ? e.uv && (e.uv.x < .15 || e.uv.x > .85 || e.uv.y > .92) : t < 128) continue;
					return e.object.parent?.name || "card";
				}
				return e.object.name || e.object.parent?.name || e.object.type;
			}
			return null;
		});
	},
	ground(e, t) {
		return X?.tileMap ? X.tileMap.getHeight(e, t) : null;
	},
	get stats() {
		let e = (e) => Qh[e].filter((e) => e.visible).length;
		return {
			bits: [...Up.entries()].filter(([e]) => e.name === "ember-bit").reduce((e, [, t]) => e + t.filter((e) => e.visible).length, 0),
			water: gh.mesh && gh.mesh.visible ? gh.mesh.count : 0,
			fig: qm,
			lit: Math.round(Jm * 100) / 100,
			beasts: Th.filter((e) => e?.visible).length,
			light: +!!kh.on,
			lightDepth: kh.on && kh.keyed && X?.postfx?.depthTexture ? 1 : 0,
			rings: e("ring"),
			hazards: e("disc"),
			warns: e("wrim"),
			lanes: e("lane"),
			pans: fg.filter((e) => e.visible).length,
			spells: Lg.size,
			dome: Fg && Fg.domeOf ? 1 : 0,
			blades: Fg ? Fg.blades.count - (Fg.warmN > 0 ? 2 : 0) : 0,
			crystals: Fg ? Fg.crystals.count - +(Fg.warmN > 0) : 0,
			frost: Fg ? Fg.frost.count - +(Fg.warmN > 0) : 0,
			spellLight: Ig && Fg ? 1 : 0,
			focus: e("focus"),
			carry: +!!Cg,
			level: lp,
			actors: [...Up.values()].reduce((e, t) => e + t.filter((e) => e.visible).length, 0) + [...cm.values()].filter((e) => e.root.visible).length,
			models: [...cm.values()].filter((e) => e.root.visible).length,
			modelNames: [...new Set([...cm.values()].filter((e) => e.root.visible).map((e) => e.name))],
			figErr: Zp,
			figFailed: [...rm.values()].filter((e) => e === !1).length,
			pr: X?.engine?.pixelRatio ?? null,
			dpr: devicePixelRatio || 1,
			modelMeshes: [...rm.values()].filter(Boolean).map((e) => e.meshes.after).reduce((e, t) => e + t, 0),
			modelMeshesBefore: [...rm.values()].filter(Boolean).map((e) => e.meshes.before).reduce((e, t) => e + t, 0),
			figures: Kp,
			atlases: Bp.size,
			env: wm.length,
			sky: Qm,
			ours: wm.filter((e) => e.name.startsWith("ember:prop:")).length,
			programs: X?.engine?.renderer?.info?.programs?.length ?? null
		};
	}
};
function o_(e) {
	if (op) throw Error("createWorld: one world a page");
	return op = e.container, sp = e.uiRoot, Qf = e.assets, rp = In("en"), Ft(), ip = Nn({
		lang: rp,
		px: Pn({
			w: innerWidth,
			h: innerHeight,
			dpr: devicePixelRatio || 1
		}).px
	}), ap = Jr(rp, {}), a_.ready = !0, a_;
}
function s_(e, t) {
	Qf ||= t.assets;
	let n = new st({
		canvas: e,
		alpha: !0,
		antialias: !0,
		powerPreference: "low-power"
	});
	n.setPixelRatio(Math.min(3, devicePixelRatio || 1)), n.outputColorSpace = o, n.toneMapping = 4, n.toneMappingExposure = 1.05;
	let i = new p(), a = new d(26, 1, .05, 100), s = new j();
	i.add(s), i.add(new f(16773340, 2760758, 1.35));
	let c = new r(16765594, 2.4);
	c.position.set(2.2, 4, 3.2), i.add(c);
	let l = new r(10334463, 1.1);
	l.position.set(-3, 2.5, -2.5), i.add(l);
	let u = {
		y: 0,
		d: 0,
		ly: 0
	}, m = {
		y: 0,
		d: 0,
		ly: 0
	}, h = !1, g = !1, _ = (e) => {
		if (!y) return;
		let t = y.h, n = Math.tan(a.fov * Math.PI / 360);
		h ? (m.ly = t * .76, m.y = t * .8, m.d = t * .3 / n) : (m.ly = t * .47, m.y = t * .62, m.d = t * .62 / n), e && Object.assign(u, m), g = !0;
	}, v = () => {
		a.position.set(0, u.y, u.d), a.lookAt(0, u.ly, 0);
	}, y = null, b = "", x = 0, S = t.yaw ?? .42, C = 0, w = null, T = 0, E = !1, D = 0, ee = 0, O = null, te = 4, k = () => {
		let t = e.clientWidth || e.width, r = e.clientHeight || e.height;
		n.setSize(t, r, !1), a.aspect = t / Math.max(1, r), a.updateProjectionMatrix();
	}, ne = typeof ResizeObserver < "u" ? new ResizeObserver(k) : null;
	ne?.observe(e), k();
	let A = (e) => y && y.def.clips && y.def.clips[e], re = -1, ie = -1;
	function ae(t) {
		if (T = 0, E || !y) return;
		(e.clientWidth !== re || e.clientHeight !== ie) && (re = e.clientWidth, ie = e.clientHeight, k());
		let r = Math.min(.1, D ? (t - D) / 1e3 : 0);
		if (D = t, ee += r, w || (S += C * r, C *= Math.max(0, 1 - 3 * r)), s.rotation.y = S, g) {
			let e = 1 - Math.exp(-7 * r), t = 0;
			for (let n of [
				"y",
				"d",
				"ly"
			]) u[n] += (m[n] - u[n]) * e, t = Math.max(t, Math.abs(m[n] - u[n]));
			t < 1e-4 && (Object.assign(u, m), g = !1), v();
		}
		!O && ee >= te && (O = {
			k: ee % 2 < 1 ? "attack" : "attack2",
			t: 0
		});
		let o = A("idle"), c = y.fig;
		if (O) {
			let e = A(O.k) || A("attack"), t = e && c.clips.find((t) => t.name === e.clip);
			O.t += r, !t || O.t >= t.duration * (e.to || 1) ? (O = null, te = ee + 5 + ee % 3) : Tf(c, e.clip, O.t / t.duration, !0);
		}
		if (!O) {
			let e = c.clips.find((e) => e.name === (o ? o.clip : "Idle")) || c.clips[0];
			Tf(c, e.name, ee % e.duration / e.duration, !0);
		}
		for (let e of y.shine) e.emissiveIntensity = e.userData.shine * (.75 + .25 * Math.sin(t * .0026));
		n.render(i, a), !document.hidden && e.isConnected && (T = requestAnimationFrame(ae));
	}
	let oe = () => {
		!T && !E && y && (D = 0, T = requestAnimationFrame(ae));
	};
	document.addEventListener("visibilitychange", oe);
	let se = (t) => {
		w = {
			x: t.clientX,
			y0: S,
			moved: 0,
			t: performance.now()
		}, e.setPointerCapture?.(t.pointerId);
	}, ce = (e) => {
		if (!w) return;
		let t = e.clientX - w.x;
		w.moved = Math.max(w.moved, Math.abs(t));
		let n = w.y0 + t * .012;
		C = (n - S) * 30, S = n, oe();
	}, le = () => {
		w && (w.moved < 6 && ue.attack(), w = null, oe());
	};
	e.addEventListener("pointerdown", se), e.addEventListener("pointermove", ce), e.addEventListener("pointerup", le), e.addEventListener("pointercancel", le);
	let ue = {
		get actor() {
			return b;
		},
		async show(e, n = null, r = {}) {
			let i = `${e}#${n ? JSON.stringify(n) : ""}#${r.bare ? "bare" : ""}#${r.gear ? JSON.stringify(r.gear) : ""}`;
			if (!!r.close !== h && (h = !!r.close, _(!1), oe()), i === b && y) return !0;
			let a = ++x;
			b = i;
			let o = await zp(`${Qf}models/cast.json`);
			o && !Yp && (Yp = o);
			let c = o && o.actors[e];
			if (!c || E || a !== x) return !1;
			try {
				let e = am(c.v, {
					appearance: n,
					gear: r.gear || null,
					bare: !!r.bare
				});
				r.bare && e.gear && (e.gear = {
					...e.gear,
					helm: null
				});
				let t = await xf(e, {
					far: !1,
					load: tm,
					faces: async () => Yp.faces
				});
				if (E || a !== x) return !1;
				t.root.traverse((e) => {
					e.isMesh && e.material && e.material.isMeshStandardMaterial && (e.material.metalness = 0, e.material.roughness = Math.max(e.material.roughness ?? 1, .92));
				}), Tf(t, "Idle", 0, !0);
				let i = new Ve();
				t.root.updateMatrixWorld(!0), t.root.traverse((e) => {
					e.isMesh && e.visible && i.expandByObject(e);
				});
				let o = t.look || {
					w: 1,
					h: 1
				}, l = i.max.y - i.min.y, u = (i.min.x + i.max.x) / 2, d = (i.min.z + i.max.z) / 2, f = new j();
				f.add(t.root), t.root.position.set(-u, -i.min.y, -d), f.scale.set(o.w, o.h, o.w);
				let p = l * 1.06;
				y && s.remove(y.pin);
				let m = [];
				t.root.traverse((e) => {
					e.isMesh && e.material && e.material.userData && e.material.userData.shine && m.push(e.material);
				});
				let h = !y;
				return s.add(f), y = {
					fig: t,
					def: c,
					pin: f,
					shine: m,
					h: p
				}, _(h), v(), ee = 0, O = null, te = 3, oe(), !0;
			} catch (e) {
				return t.onError?.(e), !1;
			}
		},
		attack() {
			y && !O && (O = {
				k: "attack",
				t: 0
			}, oe());
		},
		close() {
			E = !0, T && cancelAnimationFrame(T), T = 0, ne?.disconnect(), document.removeEventListener("visibilitychange", oe), e.removeEventListener("pointerdown", se), e.removeEventListener("pointermove", ce), e.removeEventListener("pointerup", le), e.removeEventListener("pointercancel", le), y && s.remove(y.pin), y = null, n.dispose(), n.forceContextLoss();
		}
	};
	return e.addEventListener("webglcontextlost", (e) => {
		e.preventDefault(), E || t.onError?.(/* @__PURE__ */ Error("preview: the WebGL context was lost"));
	}), ue;
}
var c_ = 96, l_ = 112, u_ = 3, d_ = [
	8,
	5,
	14
], f_ = null;
async function p_(e, t = null, n = {}) {
	!Qf && n.assets && (Qf = n.assets);
	let i = await zp(`${Qf}models/cast.json`);
	i && !Yp && (Yp = i);
	let a = i && i.actors[e];
	if (!a) return null;
	let s = await xf(am(a.v, t), {
		far: !1,
		load: tm,
		faces: async () => Yp.faces
	});
	s.root.traverse((e) => {
		e.isMesh && e.material && e.material.isMeshStandardMaterial && (e.material = e.material.clone(), e.material.metalness = 0, e.material.roughness = Math.max(e.material.roughness ?? 1, .92));
	}), Tf(s, "Idle", 0, !0);
	let c = s.look;
	c && s.root.scale.set(c.w, c.h, c.w), s.root.rotation.y = he.degToRad(22), s.root.updateMatrixWorld(!0);
	let l = pf(s.root, "head");
	if (!l) return null;
	let u = l.localToWorld(new F(0, 1.08, 0)), d = l.localToWorld(new F(0, 0, .1)), m = u.y - d.y, h = m / .6, g = u.y + m * .1 - h / 2, _ = (u.x + d.x) / 2, v = he.degToRad(8), y = new ee(-(h * c_ / l_) / 2, h * c_ / l_ / 2, h / 2, -h / 2, .1, 100);
	y.position.set(_, g + 20 * Math.sin(v), 20 * Math.cos(v)), y.lookAt(_, g, 0), y.updateMatrixWorld(!0);
	let b = new p();
	b.add(s.root), b.add(new f(12101848, 2760752, 1.25));
	let x = new r(16766120, 2.3);
	x.position.set(-1.6, 1.8, 2.4), b.add(x);
	let S = new r(9413887, .55);
	S.position.set(2.2, .4, 1.2), b.add(S);
	let C = new r(12624127, 1.6);
	C.position.set(1.5, 2.2, -2.6), b.add(C), f_ || (f_ = new st({
		alpha: !0,
		antialias: !1,
		preserveDrawingBuffer: !0
	}), f_.outputColorSpace = o, f_.toneMapping = 4, f_.toneMappingExposure = 1), f_.setPixelRatio(1), f_.setSize(288, 336, !1), f_.setClearColor(0, 0), f_.render(b, y);
	let w = document.createElement("canvas");
	w.width = 288, w.height = 336;
	let T = w.getContext("2d", { willReadFrequently: !0 });
	T.drawImage(f_.domElement, 0, 0);
	let E = T.getImageData(0, 0, 288, 336).data, D = /* @__PURE__ */ new Uint8ClampedArray(43008), O = u_;
	for (let e = 0; e < l_; e++) for (let t = 0; t < c_; t++) {
		let n = 0, r = 0, i = 0, a = 0;
		for (let o = 0; o < O; o++) for (let s = 0; s < O; s++) {
			let c = ((e * O + o) * 288 + t * O + s) * 4;
			E[c + 3] < 128 || (n++, r += E[c] * E[c], i += E[c + 1] * E[c + 1], a += E[c + 2] * E[c + 2]);
		}
		if (n * 2 < 9) continue;
		let o = (e * c_ + t) * 4;
		D[o] = Math.sqrt(r / n), D[o + 1] = Math.sqrt(i / n), D[o + 2] = Math.sqrt(a / n), D[o + 3] = 255;
	}
	for (let e = 0; e < D.length; e += 4) {
		if (!D[e + 3]) continue;
		let t = D[e], n = D[e + 1], r = D[e + 2], i = .3 * t + .59 * n + .11 * r, a = (e) => Math.max(0, Math.min(255, 128 + (e - 128) * 1.08));
		D[e] = a(t + (i - t) * .14) * .9, D[e + 1] = a(n + (i - n) * .14) * .91, D[e + 2] = a(r + (i - r) * .14) * .98;
	}
	let te = new Uint8ClampedArray(D), k = (e, t) => e >= 0 && t >= 0 && e < c_ && t < l_ && D[(t * c_ + e) * 4 + 3] > 0;
	for (let e = 0; e < l_; e++) for (let t = 0; t < c_; t++) {
		let n = (e * c_ + t) * 4;
		!D[n + 3] && e < 111 && (k(t + 1, e) || k(t - 1, e) || k(t, e + 1) || k(t, e - 1)) && (te[n] = d_[0], te[n + 1] = d_[1], te[n + 2] = d_[2], te[n + 3] = 255);
	}
	let ne = document.createElement("canvas");
	return ne.width = c_, ne.height = l_, ne.getContext("2d").putImageData(new ImageData(te, c_, l_), 0, 0), ne;
}
//#endregion
export { s_ as createPreview, o_ as createWorld, p_ as renderPortrait };
