import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { $ as t, $n as n, A as r, An as i, At as a, Bn as o, Bt as s, Dt as c, Et as l, Fn as u, Ft as d, Hn as f, Ht as p, I as m, J as h, Jn as g, K as _, Kn as v, L as y, Lt as b, M as x, Mt as S, N as C, Nn as w, Nt as T, Ot as E, Pt as ee, Q as te, Qn as ne, R as re, Rt as ie, S as D, T as ae, Tt as oe, U as O, Un as se, Ut as ce, Vt as le, Wn as ue, X as de, Xn as fe, Xt as pe, Yn as me, Zn as he, _ as ge, _t as _e, a as ve, at as ye, bt as k, c as be, ct as xe, d as Se, dt as Ce, er as we, et as Te, f as Ee, ft as De, g as A, gr as Oe, gt as ke, h as Ae, hr as je, ht as Me, ir as Ne, j as Pe, jt as Fe, kt as Ie, l as Le, lt as Re, m as ze, mr as j, mt as Be, n as Ve, nr as He, nt as Ue, o as We, ot as Ge, p as Ke, pr as qe, q as Je, qn as Ye, r as Xe, rt as Ze, s as M, st as Qe, tr as $e, tt as et, ut as tt, v as nt, vt as rt, xt as it, yt as at, zt as ot } from "./three.core-CDiAvzro.js";
import { C as st, E as ct, G as lt, O as ut, T as dt, U as ft, W as pt, b as mt, x as ht } from "./SmallProps-Bhy5ZjLW.js";
import { a as gt, c as _t, f as vt, l as yt, n as bt, o as xt, r as St, s as Ct, t as wt, u as Tt } from "./math-Du_SWpiD.js";
import { r as Et } from "./ThawField-BqwvXI8W.js";
import { D as Dt, E as Ot, O as kt, _ as At, b as jt, c as Mt, d as Nt, f as Pt, g as Ft, k as It, l as Lt, p as Rt, s as zt, t as Bt, u as Vt, v as Ht, y as Ut } from "./engine-FVAIXRjf.js";
import { i as Wt, n as Gt } from "./own-rp3p7qEo.js";
import { t as Kt } from "./AudioSystem-BNoOeJEp.js";
import { r as qt } from "./PixelCanvas-BggARGih.js";
import { a as Jt, r as Yt } from "./PropSprites-XFDD6avm.js";
import { a as Xt, c as Zt, i as Qt, o as $t, s as en, t as tn } from "./CharacterSprites-D8DGG2-o.js";
import { t as nn } from "./Particles-DKjyxRwN.js";
import { a as rn, c as an, d as on, f as sn, i as cn, l as ln, o as un, p as dn, r as fn, s as pn, u as mn } from "./TileMap-Drkb1NXe.js";
import { a as hn, i as gn, l as _n, n as vn, o as yn, r as bn } from "./Props-CTxYYfQ3.js";
import { T as xn, a as Sn, d as Cn, h as wn, n as Tn, o as En, r as Dn, s as On, t as kn, u as An, w as jn, x as Mn } from "./ObjectCatalog-CLBSNnc2.js";
import { H as Nn, _t as Pn } from "./core-C1cYbmwD.js";
import { i as Fn, l as In, n as Ln, s as Rn, t as zn, u as Bn } from "./I18n-BeKB4FMa.js";
import { f as Vn } from "./minimap-CBFghrAn.js";
import { r as Hn } from "./LevelFormat-BJ0C9Ce4.js";
import { a as Un, b as Wn, c as Gn, d as Kn, f as qn, g as Jn, h as Yn, i as Xn, l as Zn, m as Qn, n as $n, o as er, p as tr, r as nr, s as rr, t as ir, u as ar, v as or, x as sr, y as cr } from "./LevelLook-Brb-7Kb1.js";
import { r as lr, t as ur } from "./LevelMap-037nvhSa.js";
import { r as dr, t as fr } from "./Travel-4-idrvN5.js";
import { a as pr, c as mr, i as hr, n as gr, o as _r, r as vr, s as yr, t as br } from "./config-DDHWC9jm.js";
import { a as xr, i as Sr, o as Cr, r as wr, s as Tr } from "./SnowCover-D2jFoNi3.js";
import { n as Er, r as Dr, t as Or } from "./festival-D3PbfNgp.js";
import { _ as kr, a as Ar, c as jr, d as Mr, f as Nr, g as Pr, h as Fr, i as Ir, l as Lr, m as Rr, n as zr, o as Br, p as Vr, r as Hr, s as Ur, t as Wr, u as Gr } from "./WeatherLook-Dk-Cxxht.js";
import { a as Kr, i as qr, n as Jr, r as Yr } from "./ContentText-nXIHgNO8.js";
import { n as Xr } from "./dialogue-D_zYka2G.js";
import { n as Zr, t as Qr } from "./GroundFrost-PVyJ0TFD.js";
import { n as $r, t as ei } from "./RockSpikes-BC1Vm_D2.js";
import { t as ti } from "./SpectralBlades-K65B2utj.js";
import { t as ni } from "./SpectralBells-Bryhc3RH.js";
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
		this._alpha = new h(new Float32Array(this.capacity), 1), this._alpha.setUsage(x), n.setAttribute("aBlobAlpha", this._alpha);
		let r = new it({
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
		let i = new de(n, r, this.capacity);
		i.name = "BlobBatch", i.instanceMatrix.setUsage(x), i.count = 0, i.renderOrder = e.renderOrder, i.castShadow = !1, i.receiveShadow = !1, i.frustumCulled = !1, i.matrixAutoUpdate = !1, this.mesh = i;
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
var oi = new j(), si = [
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
		let i = _t(Math.round(e.position.x * 7), Math.round(e.position.z * 7), 3) * Math.PI * 2;
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
	let u = new O();
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
			let a = new k(i, e.material);
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
	let c = s ? st()?.SEASON_LAND : null, l = c && Object.hasOwn(c.mix, s) ? c.mix[s] : null, u = e.width, d = e.depth, f = new St(n), p = [], m = [], h = [], g = 1.35, _ = /* @__PURE__ */ new Map(), v = (e, t) => `${Math.floor(e / g)},${Math.floor(t / g)}`, y = (e, t, n) => {
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
		let i = t < 6, o = e > u * .72 && t > 8, s = Ct(e * .09, t * .09, {
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
		let l = Ct(r * .075 + 11, a * .075 - 4, {
			seed: n + 2,
			octaves: 3
		}), p = 1 - vt(4, 30, c), h = gt((l - .42) * 2.6 + p * (a < 0 ? .35 : .75), 0, 1) * (1 - vt(24, 34, c) * .85);
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
	let a = e.width, o = e.depth, s = new St(n + 4111), c = [], l = [], u = 1.35, d = /* @__PURE__ */ new Map(), f = (e, t, n) => {
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
		let v = Ct(r * .08 + 31, c * .08 - 9, {
			seed: n + 3,
			octaves: 3
		}), y = 1 - vt(4, 30, _), b = gt((v - .48) * 2.2 + y * .35, 0, 1) * .42 * (1 - vt(22, 34, _) * .85);
		if (s.next() > b) continue;
		let x = s.range(1.1, 1.7), S = t(r, c), C = m(c < 0, s.next()), w = s.range(.85, 1.4);
		if (c < -5 && S > t(r, -1) + 3 && C !== "crag" || !f(r, c, x)) continue;
		p(r, c, x);
		let T = Ct(r * .05, c * .05, {
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
		width: gt(a * .42, 1, 2.2)
	}) : e.tree(n, r, i, {
		kind: t,
		height: a,
		fallenLeaves: !1
	});
}
function yi(e, { climate: t = null, season: n = null } = {}) {
	let r = t === "arid", i = n ? st()?.SEASON_LAND : null, a = e.width, o = e.depth, s = (t, n) => {
		let r = -Infinity;
		for (let i of [-.5, .5]) for (let s of [-.5, .5]) {
			let c = gt(Math.floor(t + i), 0, a - 1), l = gt(Math.floor(n + s), 0, o - 1), u = e.tileAt(c, l);
			if (!u) continue;
			let d = u.water ? Math.max(u.h, .5) : u.h;
			d > r && (r = d);
		}
		return Number.isFinite(r) ? r : 0;
	};
	return (t, c) => {
		let l = gt(t, 0, a), u = gt(c, 0, o), d = t - l, f = c - u, p = Math.hypot(d, f), m = s(l, u) - .04;
		if (p < 1e-6) return m;
		let h = (Ct(t * .05, c * .05, {
			seed: 91,
			octaves: 3
		}) - .5) * 3.2, g = vt(0, 10, p), _ = m + h * g;
		if (r) return Math.max(_ + xi(t, c, a, o), m - .6 * g);
		let v = vt(2, -30, c);
		_ += v * (vt(0, 40, -c) * 7 + Ct(t * .03, c * .04, {
			seed: 17,
			octaves: 4
		}) * 9 * vt(-6, -40, c));
		let y = vt(-55, -120, c);
		_ += y * (18 + Ct(t * .018, 3.1, {
			seed: 23,
			octaves: 4
		}) * 34);
		let b = vt(18, 90, Math.max(-t, t - a, c - o));
		return _ += b * (4 + Ct(t * .02, c * .02, {
			seed: 29,
			octaves: 3
		}) * 14), i && (_ += i.relief(n, e, t, c, l, u, p, v, y)), Math.max(_, m - .6 * g);
	};
}
var bi = (e, t, n, r = 4) => 1 - Math.abs(Ct(e, t, {
	seed: n,
	octaves: r
}) * 2 - 1);
function xi(e, t, n, r) {
	let i = 0, a = vt(2, -30, t), o = (vt(0, 36, -t) * 9 + bi(e * .035, t * .045, 17) * 12 * vt(-6, -40, t)) / 3, s = Math.floor(o);
	i += a * (s + vt(.6, .95, o - s)) * 3;
	let c = vt(-46, -100, t);
	i += c * (24 + bi(e * .016, t * .022 + 4.1, 23, 5) * 62);
	let l = vt(16, 70, Math.max(-e, e - n, t - r)), u = Ct(e * .024, t * .024, {
		seed: 29,
		octaves: 3
	}) * 4, d = Math.floor(u);
	return i += l * (3 + (d + vt(.72, .98, u - d)) * 6.5), i;
}
function* Si(e, t, n) {
	let r = e.index, i = e.getAttribute("position"), a = new be(new Float32Array(i.count * 3), 3);
	e.setAttribute("normal", a);
	let o = new j(), s = new j(), c = new j(), l = new j(), u = new j(), d = new j(), f = new j(), p = new j(), m = 0;
	for (let e = 0, n = r.count; e < n; e += 3) {
		let n = r.getX(e), h = r.getX(e + 1), g = r.getX(e + 2);
		o.fromBufferAttribute(i, n), s.fromBufferAttribute(i, h), c.fromBufferAttribute(i, g), f.subVectors(c, s), p.subVectors(o, s), f.cross(p), l.fromBufferAttribute(a, n), u.fromBufferAttribute(a, h), d.fromBufferAttribute(a, g), l.add(f), u.add(f), d.add(f), a.setXYZ(n, l.x, l.y, l.z), a.setXYZ(h, u.x, u.y, u.z), a.setXYZ(g, d.x, d.y, d.z), ++m === t && (m = 0, yield);
	}
	yield;
	for (let e = 0, t = a.count; e < t; e++) oi.fromBufferAttribute(a, e).normalize(), a.setXYZ(e, oi.x, oi.y, oi.z), e % n === n - 1 && (yield);
	a.needsUpdate = !0;
}
function* Ci({ textures: e, tileMap: t, heightAt: n, extent: r = 170, rowsPerStep: i = 12, climate: a = null, season: o = null }) {
	let s = a === "arid", c = !s && o ? st()?.SEASON_LAND : null, l = c && Object.hasOwn(c.outer, o) ? c.outer[o] : null, u = t.width, d = t.depth, f = (e, t) => {
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
	let x = l ? l[0] : s ? "arid_dirt" : "grass_dark", S = e.meta(x).units, C = new A(), w = new A(1, 1, 1), T = l ? new A(...l[1]) : s ? new A(1.04, .96, .88) : new A(.78, .86, .72), E = l ? new A(...l[2]) : s ? new A(1.02, .74, .6) : new A(.62, .6, .66), ee = new A(.92, .86, .84);
	for (let e = 0; e < g; e++) {
		for (let t = 0; t < h; t++) {
			let n = e * h + t, r = p[t], i = m[e], a = b[n];
			_[n * 3] = r, _[n * 3 + 1] = a, _[n * 3 + 2] = i, v[n * 2] = r / S[0], v[n * 2 + 1] = -i / S[1];
			let o = b[e * h + Math.max(0, t - 1)], c = b[e * h + Math.min(h - 1, t + 1)], f = b[Math.max(0, e - 1) * h + t], x = b[Math.min(g - 1, e + 1) * h + t], te = (c - o) / Math.max(.001, p[Math.min(h - 1, t + 1)] - p[Math.max(0, t - 1)]), ne = (x - f) / Math.max(.001, m[Math.min(g - 1, e + 1)] - m[Math.max(0, e - 1)]), re = Math.hypot(te, ne), ie = Math.max(0, -r, r - u), D = Math.max(0, -i, i - d), ae = Math.hypot(ie, D);
			C.copy(w).lerp(T, vt(20, 80, ae)).lerp(E, vt(.55, 1.2, re)), s && C.lerp(ee, vt(26, 60, a));
			let oe = Tt(l ? l[3] : s ? .8 : .62, 1, vt(0, 14, ae)) * (.9 + .2 * Ct(r * .11, i * .11, {
				seed: 4,
				octaves: 2
			}));
			y[n * 3] = C.r * oe, y[n * 3 + 1] = C.g * oe, y[n * 3 + 2] = C.b * oe;
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
	let oe = new Le();
	oe.setAttribute("position", new be(_, 3)), oe.setAttribute("uv", new be(v, 2)), oe.setAttribute("color", new be(y, 3)), oe.setIndex(new be(D, 1)), yield, yield* Si(oe, i * (h - 1) * 2, i * h), oe.computeBoundingSphere();
	let O = e.material(x, {
		vertexColors: !0,
		normalScale: .35
	}), se = new k(oe, O);
	return se.name = "OuterGround", se.receiveShadow = !0, se.castShadow = !1, se.matrixAutoUpdate = !1, se.updateMatrix(), se;
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
	return ki ??= import("./SeasonLook-Chk_6P9N.js").then((e) => Oi = e, (e) => {
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
		let [e, a] = Wt(Pi, typeof n.kind == "string" ? n.kind : "blaze") ?? Pi.blaze, o = gt(Number.isFinite(Number(n.size)) ? Number(n.size) : 1.5, .2, 6);
		return {
			x: r,
			z: i,
			roar: e * gt(o / 1.5, .3, 3),
			crackle: a,
			group: t
		};
	}
	if (e.type === "house") {
		let e = gt(Number(n.burning) || 0, 0, 1);
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
		let n = this.lighting.nightFactor, r = this.weather.factor("rain"), i = this.weather.factor("snow"), a = gt(r + i), o = e.nearest(this.fires, t), s = Infinity, c = this.waterXZ, l = t.x, u = t.z;
		for (let e = 0; e < c.length; e += 2) {
			let t = c[e] - l, n = c[e + 1] - u, r = t * t + n * n;
			r < s && (s = r);
		}
		s = Math.sqrt(s);
		let d = e.nearest(this.falls, t), f = this.levels;
		f.wind = gt(.28 + .12 * (t.y > 3) + a * .55), f.birds = gt((1 - n) * (1 - a * .85) * .75), this.combatIntensity > 0 && (f.birds *= 1 - .8 * gt(this.combatIntensity)), f.crickets = gt(vt(.35, .9, n) * (1 - a) * .8), f.fire = gt((1 - vt(2, 15, o)) ** 1.5 * .9), f.water = gt(Math.max((1 - vt(1, 11, s)) * .55, (1 - vt(3, 20, d)) * .95)), this._computeSiege(this.focus ?? t);
		let p = this.env?.();
		return (p?.frost || p?.season) && this.audio.evPack?.direct(this, t, f), f;
	}
	_computeSiege(e) {
		let t = this.levels, n = 0;
		for (let t of this.npcs) {
			let r = t.panicking ? 1 : t.cowering ? Fi : 0;
			if (!r) continue;
			let i = Math.hypot(t.position.x - e.x, t.position.z - e.z);
			n += r * (1 - vt(4, 34, i));
		}
		t.crowd = n > 0 ? gt(1 - Math.exp(-n / 3.4)) : 0;
		let r = 0, i = 0;
		for (let t of this.blazes) {
			if (t.group && !t.group.present) continue;
			let n = Math.hypot(t.x - e.x, t.z - e.z);
			t.roar > 0 && (r += t.roar * (1 - vt(3, 30, n)) ** 1.6), t.crackle > 0 && (i = Math.max(i, t.crackle * (1 - vt(1.5, 12, n)) ** 1.5));
		}
		t.blaze = r > 0 ? gt(1 - Math.exp(-r * .9)) * .95 : 0, i * .9 > t.fire && (t.fire = i * .9);
	}
	update(e, t) {
		this.enabled && (this._timer -= e, !(this._timer > 0) && (this._timer = .25, this.audio.setAmbience(this.compute(t), { fade: .6 })));
	}
};
//#endregion
//#region src/game/GroundDetail.js
function Ri(e) {
	let t = e.map(({ kind: e, seed: t }) => Yt(e, { seed: t })), n = Math.max(...t.map((e) => e.frameWidth)) + 2, r = Math.max(...t.map((e) => e.frameHeight)) + 1, i = document.createElement("canvas");
	i.width = n * t.length, i.height = r;
	let a = i.getContext("2d");
	return a.imageSmoothingEnabled = !1, t.forEach((e, t) => {
		let i = t * n + Math.floor((n - e.frameWidth) / 2), o = r - e.frameHeight;
		a.drawImage(e.canvas, 0, 0, e.frameWidth, e.frameHeight, i, o, e.frameWidth, e.frameHeight), e.dispose();
	}), {
		texture: qt(i, {
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
	let u = new St(n), d = new O();
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
		rng: new St(n + 4099),
		tints: Wi,
		reed: .6
	}, b = st()?.SEASON_LAND ?? null, x = new St(n + 7351), S = {}, C = (e, r, i, a, o) => {
		let s = o.rng, c = i.h, l = i.char === "T", u = Ct(e * .21 + 7, r * .21, {
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
			let i = Ct(e * .23, r * .23, {
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
	let ee = [], te = function* (e, t, r, i = {}) {
		if (!r.length) return [];
		let a = r.length > l ? yield* pn(r, {
			x: (e) => e.x,
			z: (e) => e.z,
			maxWeight: l
		}) : [r], o = a.map((t, n) => [a.length > 1 ? `${e}#${n}` : e, t]), s = [];
		for (let [e, r] of o) {
			let a = new Ht({
				sprite: t,
				instances: globalThis.__emberGround ? globalThis.__emberGround.foliage(r) : r,
				name: e,
				seed: n + ee.length,
				...i
			});
			d.add(a.object), ee.push(a), s.push(a), yield;
		}
		return s;
	}, ne = Ri([{ kind: "grass_tuft" }, { kind: "grass_tall" }]), re = Ri([
		{ kind: "flower_red" },
		{ kind: "flower_yellow" },
		{ kind: "flower_white" },
		{ kind: "flower_blue" }
	]), ie = Ri([
		{ kind: "bush" },
		{ kind: "fern" },
		{ kind: "mushroom" },
		{ kind: "rock_small" }
	]), D = Yt("reeds");
	yield, yield* te("Foliage:grass", ne, f, { wind: 1 }), yield* te("Foliage:flowers", re, p, { wind: 1.1 }), yield* te("Foliage:reeds", D, m, { wind: 1.4 });
	let ae = yield* te("Foliage:shrubs", ie, h, {
		wind: .5,
		rootDarken: .25
	});
	for (let e of ae) e.castShadow = !0;
	let oe = [], se = (e) => {
		let t = Ri(e);
		return oe.push(t.texture), t;
	};
	if (y.grass.length && (yield* te("Foliage:arid-grass", se([{ kind: "dry_tuft" }, { kind: "dry_grass_tall" }]), y.grass, { wind: 1 })), y.shrubs.length) {
		let e = yield* te("Foliage:arid-shrubs", se([
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
	y.clutter.length && (yield* te("Foliage:arid-clutter", se([
		{ kind: "pebbles" },
		{ kind: "bones" },
		{ kind: "cinders" }
	]), y.clutter, {
		wind: 0,
		rootDarken: .1
	})), y.reeds.length && (yield* te("Foliage:arid-reeds", D, y.reeds, { wind: 1.4 }));
	let ce = b ? yield* b.fields({
		fams: S,
		cropAreas: c,
		tileMap: e,
		isFree: t,
		inClearing: g,
		seed: n,
		add: te,
		kinds: (e) => se(e.map((e) => ({ kind: e }))),
		reedSprite: D
	}) : {}, le = y.grass.length + y.shrubs.length + y.clutter.length ? {
		aridGrass: y.grass.length,
		aridShrubs: y.shrubs.length,
		aridClutter: y.clutter.length
	} : {};
	return {
		fields: ee,
		object: d,
		stats: {
			grass: f.length,
			flowers: p.length,
			reeds: m.length + y.reeds.length,
			shrubs: h.length,
			...le,
			...ce
		},
		dispose() {
			for (let e of ee) e.dispose();
			ne.texture.dispose(), re.texture.dispose(), ie.texture.dispose(), D.dispose();
			for (let e of oe) e.dispose();
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
		this.engine = e, this.scene = e.scene, this.textures = t, this.lighting = n, this.particles = r, this.godRays = i, this.level = a, this._sharedPool = o, this.vfxLights = null, this.story = s, this.storyGroups = /* @__PURE__ */ new Map(), this._emitterGroup = /* @__PURE__ */ new Map(), this._storyTags = /* @__PURE__ */ new Map(), this.storyRanges = new fn(), this.env = a.environment ?? {}, this._pending = c ? [] : null, this.attached = !c, this.shafts = [], this._ownInteractables = 0, this.root = new O(), this.root.name = "World", this._defer(() => this.scene.add(this.root)), this.tileMap = null, this.water = null, this.terrain = null, this.builder = null, this.factory = null, this.built = [], this.results = [], this.updaters = [], this.waterfalls = [], this.interactables = [], this.emitters = Object.create(null), this.areaEmitters = [], this.propEmitters = [], this.lights = [], this.emissiveEntries = [], this.glassMaterial = null, this.fires = [], this._fireList = [], this.blazes = [], this._bells = [], this._warmth = [], this.falls = [], this.fallAnchors = [], this.anchors = {}, this.stats = {}, this.waterBase = null;
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
		if (!ut() && dt(l) && (yield { wait: ct() }), !st() && mt(l) && (yield { wait: ht() }), yield* s(.08, Bn("game.load.textures")), this.textures.preload(), o("textures"), yield* s(.18, Bn("game.load.land")), this.terrain = yield* c(Wn(l, {
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
		let n = (ut() ?? st())?.mergeFlames;
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
					let e = o.anchor.y, t = o.interact?.position ?? new j(a.x, e, a.z), n = new j(a.x, e + 4.2, a.z - .3);
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
						prompt: new j(a.x, t + (e ? 1.2 : 2.4), a.z),
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
				anchor: new j(e.x + a[0] * .6, o, e.z + a[1] * .6),
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
		let e = this.storyGroups.size ? /* @__PURE__ */ new Map() : null, t = Nt(this._lightDescs, { cache: e });
		this._sharedPool && this._sharedPool.setDescriptors(t, { snap: !0 }), this.lightPool = this._sharedPool ?? new Vt(this.lighting, t, { size: 12 });
		for (let t of this.storyGroups.values()) {
			t.poolLights = t.lights.map((t) => e.get(t)).filter(Boolean);
			for (let e of t.poolLights) this.lightPool.setHidden(e, !t.present, { instant: !0 });
		}
		this.lights = this.lightPool.handles, this.stats.lightDescriptors = this._lightDescs.length, this.stats.lightsPooled = this.lightPool.pooled;
	}
	_buildAtmosphere() {
		let e = this.particles, t = this.env, n = (e, t, n) => new j(e, t, n), r = this.level.width, i = this.level.depth;
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
	down: new j(0, 0, 1),
	up: new j(0, 0, -1),
	left: new j(-1, 0, 0),
	right: new j(1, 0, 0)
};
function ra(e) {
	let t = new it({
		map: e,
		color: new A("#d9ccff"),
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
	let r = new k(e, t);
	return r.name = n, r.renderOrder = 60, r.castShadow = !1, r.receiveShadow = !1, r;
}
function aa(e, t, n = "traveler") {
	let r = typeof e?.preset == "string" && Object.hasOwn(tn, e.preset) ? e.preset : "traveler", i = e?.spec && typeof e.spec == "object" ? e.spec : {};
	return {
		...tn[r],
		preset: r,
		...i,
		...t ? { weapon: n === "bellwarden" ? "hammer" : "sword" } : {}
	};
}
function oa({ level: e, look: t, combat: n, kit: r, records: i }) {
	return $t(e) || Zt(aa(t, n, r)) || (i ?? []).some((e) => Zt(e?.spec)) ? en() : null;
}
var sa = class {
	constructor({ tileMap: e, rig: t, particles: n, audio: r, spawn: i, combat: a = !1, look: o = null, festival: s = !1, kit: c = "traveler" }) {
		this.tileMap = e, this.rig = t, this.particles = n, this.audio = r, this.sheet = a ? Qt(aa(o, a, c), { combat: !0 }) : s ? Or("the player posed by the story").createFestivalSheet(aa(o, !1)) : Qt(aa(o, !1));
		let l = typeof i.facing == "string" && Object.hasOwn(na, i.facing) ? i.facing : "down";
		this.sprite = new Ut(this.sheet, a ? {
			...gr,
			direction: l,
			combatFx: !0
		} : {
			...gr,
			direction: l
		}), this.sprite.name = "Player", this.position = this.sprite.position, this.position.set(i.x, e.getHeight(i.x, i.z), i.z), this.facing = na[l].clone(), this.speed = 0, this.running = !1, this.frozen = !1, this.radius = ea, this.action = null, this.faceOverride = null, this.moveOverride = null, this.scripted = null, this.speedMul = 1, this._move = {
			x: 0,
			z: 0
		}, this._dir = new j(), this._stepToggle = !1, this._dustTimer = 0, this._basisDir = new j(), this.sprite.onFrameChange = (e, t) => {
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
			this.sprite.play(p), this.sprite.speed = gt(.55 + .45 * (this.speed / Math.max(.01, c)), .55, 1) * Math.max(.6, l);
		} else this.speed = 0, this.running = !1, this.sprite.play("idle"), this.sprite.speed = vr[0] + .04, u && this.facing.set(u.x, 0, u.z), this.sprite.faceVector(this.facing.x, this.facing.z);
		this._followGround(e);
	}
	_followGround(e) {
		let t = this.position, n = this.tileMap.getHeight(t.x, t.z), r = n > t.y ? xt(22, e) : xt(16, e);
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
				...tn[e.preset],
				preset: e.preset,
				...e.spec || {}
			};
			i = this.festival ? Or(`the villager "${e.id}"`).createFestivalSheet(t) : Qt(t), n?.set(r, i);
		}
		this.sheet = i, this.sprite = new Ut(i, {
			...gr,
			direction: e.facing ?? "down"
		}), this.sprite.name = `NPC:${e.id}`, this.home = new j(e.home[0], 0, e.home[1]), this.position = this.sprite.position, this.position.set(e.home[0], t.getHeight(e.home[0], e.home[1]), e.home[1]), this.wander = e.wander ?? 1.2, this.speed = e.speed ?? 1, this.behaviour = Dn.includes(e.behaviour) ? e.behaviour : "wander";
		let a = Math.max(.5, this.wander);
		this.chaseBounds = e.bounds ?? {
			minX: e.home[0] - a,
			maxX: e.home[0] + a,
			minZ: e.home[1] - a,
			maxZ: e.home[1] + a
		}, this.homeFacing = e.facing ?? "down", this.facing = new j(0, 0, 1);
		let o = Object.hasOwn(la, this.sprite.direction) ? la[this.sprite.direction] : la.down;
		this.facing.set(o[0], 0, o[1]), this._faceYaw = null, this._faceRow = this.sprite.direction, this.talkRadius = e.talkRadius ?? 1.6, this.talkPoint = e.talkPoint ? new j(e.talkPoint[0], 0, e.talkPoint[1]) : null, this.rng = new St(yt(e.id)), this.collider = t.addCollider({
			type: "circle",
			x: this.position.x,
			z: this.position.z,
			r: .34,
			dynamic: !0
		}), this.state = "idle", this.timer = this.rng.range(.5, 3), this.target = new j(), this.talking = !1, this.present = !0, this.directed = !1, this.storyObj = null, this.storyTalk = null, this._out = {
			x: 0,
			z: 0
		}, this._stuck = 0, this._lookTimer = 0, this.idleSpeed = this.rng.range(vr[0], vr[1]), this.festival && (this.barkRng = new St(yt(`bark:${e.id}`)), this._barkT = this.barkRng.range(1.5, 9), this._calm = !1, this._reliefT = 0, this._spokeT = 0, this._threatT = this.rng.range(0, .25), this._danceSpeed = this.rng.range(.85, 1.15), this._runSpeed = Math.min(4.2, Math.max(2.6, this.speed * this.rng.range(2.9, 3.5)))), this._idle();
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
		n > 1e-6 && (this.facing.set(e / n, 0, t / n), this._applyFacing(Et.uCameraYaw.value));
	}
	faceDir(e) {
		let t = Object.hasOwn(la, e) ? la[e] : null;
		t && this.faceWorld(t[0], t[1]);
	}
	_applyFacing(e) {
		this.sprite.faceVector(this.facing.x, this.facing.z, e), this._faceYaw = e, this._faceRow = this.sprite.direction;
	}
	_followCamera() {
		let e = this.sprite, t = Et.uCameraYaw.value;
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
		r.y += (i - r.y) * xt(18, e), this.collider.x = r.x, this.collider.z = r.z;
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
		this.tileMap = t, this.sprite = new Ut(e, {
			...gr,
			blobSize: [.55, .26],
			...c
		}), this.position = this.sprite.position, this.position.set(n, t.getHeight(n, r), r), this.home = new j(n, 0, r), this.start = {
			x: n,
			z: r
		}, this.absent = !1, this.bounds = a, this.radius = o, this.speed = s, this.rng = new St(i), this.state = "idle", this.timer = this.rng.range(.2, 2.5), this.target = new j(n, 0, r), this._out = {
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
		t.y += (n - t.y) * xt(18, e);
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
				super(e), this.vel = new j(), this.hidden = 0, this.roam = e.roam ?? 1.6;
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
		return t || (t = Xt(e, ka[e].sheet ?? {}), this.sheets.set(e, t)), t;
	}
	_spawnGroup(e) {
		let t = Gt(ka, e.kind) ? e.kind : "chicken", n = ka[t], r = this.tileMap, i = Number(e.x) || 0, a = Number(e.z) || 0, o = Math.max(.3, Number(e.radius) || 2.5), s = On(e) ?? {
			minX: i - o,
			maxX: i + o,
			minZ: a - o,
			maxZ: a + o
		}, c = Number.isFinite(e.seedBase) ? e.seedBase : yt(String(e.id ?? t)) % 1e4, l = this._sheet(t), u = En(e, (e, t) => r.isWalkable(e, t)), d = [];
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
		e = gt(Number(e) || 0), this.frostCover > 0 ? this.frostAmount = gt(e / this.frostCover) : Cr.value = e;
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
			let n = vt(0, 1, gt(t.t / t.duration));
			this.lighting.setTime(t.from + t.delta * n), t.t >= t.duration && (this._transition = null);
		}
		let n = this.shown, r = Ir[n], i = xt(1.1, e), a = this._w;
		for (let e = 0; e < Hr.length; e++) {
			let t = Hr[e];
			a[t] += (r[t] - a[t]) * i;
		}
		let o = this.tuning, s = this.lighting.settings;
		Lr(s, a, o), s.fogMul = o.fogMul * a.fog * this.zoomFog * this.levelFog, this._gust += (this.gust - this._gust) * xt(this.gust > this._gust ? 7 : 2.2, e), this._gust < .001 && !this.gust && (this._gust = 0), Gr(a, o.windStrength, this._gust);
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
		Cr.value += gt(g - Cr.value, -_ * e, _ * e), this.snowHold === null ? this.frostAmount > 0 && (this.frostAmount = Math.max(0, this.frostAmount - e / 8)) : this.frostAmount = Math.min(1, this.frostAmount + e / 3), this.thaw?.update(e);
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
		i.pitchTarget = t * wt;
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
			return i.pitchTarget * bt;
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
			return i.yawTarget * bt;
		},
		set yaw(e) {
			i.yawTarget = e * wt;
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
var Ia = "/* emberfall:fog-start */";
function La(e) {
	if (e !== void 0 && Ra(e), ft.fog_vertex.includes(Ia)) return;
	let t = Et.uFogStart;
	ft.fog_pars_vertex = `${ft.fog_pars_vertex}
#ifdef USE_FOG
	uniform vec2 uFogStart;
#endif
`, ft.fog_vertex = `${Ia}
#ifdef USE_FOG
	vFogDepth = max( 0.0, - mvPosition.z - uFogStart.x );
#endif
`;
	for (let e of Object.values(pt)) "fogDensity" in e.uniforms && (e.uniforms.uFogStart = t);
	Object.assign(lt.fog, { uFogStart: t }), Ne.clone({ uniform: t }).uniform.value !== t.value && console.warn("[Luminati] three.js copies typed-array uniforms: built-in materials keep the fog start they compiled with");
}
function Ra(e) {
	Et.uFogStart.value[0] = Number.isFinite(e) ? e : 0;
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
		}), this._events = new It(), this.season = null, this.thaw = null, this._applyLevel(t), this.mode = "loading", this.photoMode = !1, this.mapOpen = !1, this.busy = !1, this.musicWanted = !0, this.inventory = Object.assign(Object.create(null), { apples: 0 }), this.visits = /* @__PURE__ */ new Map(), this._regionTimer = 0, this._burstTimer = 0, this._sparkleTimer = 0, this._talkCooldown = 0, this._tmp = new j(), this._focusPos = new j(), this._target = {
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
			pitch: gt(po(n.pitch, this.camera.pitch), 10, 80)
		} : null, this.regions = e.objects.filter((e) => e.type === "region"), this._bannersShown = /* @__PURE__ */ new Set(), this._regionBanner = null, this.region = "", this.combatEnabled = An(e), this.envNow = this.env, this.levelStates = null, this._cine = {
			t: 0,
			target: new j(),
			...this._titleCamera()
		}, this._cine.target.set(this._cine.x, this._cine.y, this._cine.z + Math.sin(1) * this._cine.driftZ);
	}
	_applyBackdrop() {
		let e = typeof this.env.backdrop == "string" ? this.env.backdrop.trim() : "", t = null;
		e === "void" ? t = new A(0, 0, 0) : /^#[0-9a-fA-F]{6}$/.test(e) ? t = new A(e) : e && console.warn(`[Luminati] environment.backdrop "${e}" is neither "void" nor #rrggbb: the sky is shown`), this.lighting && (this.lighting.settings.backdrop = t);
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
			distance: gt(po(e.distance, Math.min(35, Math.max(22, i * .8))), 8, 80)
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
		let n = new kt({
			container: this.container,
			maxPixelRatio: globalThis.__emberPixelRatio ?? 1.25,
			...globalThis.__emberInputTarget ? { inputTarget: globalThis.__emberInputTarget } : {}
		});
		this.engine = n;
		let { scene: r, camera: i, renderer: a } = n;
		this.textures = new Jt({
			seed: 1337,
			anisotropy: 4
		});
		let o = Pt.map((e) => ({
			...e,
			...hr[e.name] ?? {}
		})), s = (po(this.env.timeOfDay, 17.2) % 24 + 24) % 24;
		this.lighting = new Rt(n, {
			timeOfDay: s,
			shadowExtent: 26,
			sunPath: yr,
			moonPath: pr,
			keyframes: o
		}), this.lighting.sky.lowerClouds = .25, this._applyBackdrop(), this.lighting.timeSpeed = this.env.clock === !1 ? 0 : mr, this.lighting.paused = !0, this.particles = new nn(r), this.godRays = new At({ gain: .2 }), r.add(this.godRays.object), this.spriteManager = new ri(i), this.rig = new Dt(i, {
			...this.camera,
			yaw: 0,
			lookAhead: 1.3
		}), this.rig.bounds = { ...this.cameraBounds.mid };
		let c = Math.min(window.devicePixelRatio || 1, n.maxPixelRatio), l = window.innerWidth * window.innerHeight * c * c;
		this.postfx = new Ot(a, r, i, {
			maxTaps: 64,
			samples: l > 18e5 ? 2 : 4
		}), this._tunePost(this.postfx.settings), n.events.on("resize", ({ width: e, height: t, pixelRatio: n }) => this.postfx.setSize(e, t, n)), this.resolution = new Pa({
			engine: n,
			postfx: this.postfx
		}), this.ui = new Bt(globalThis.__emberUiRoot ?? document.body, this.uiOptions), this.audio = new Kt({ volume: .6 }), this.lightPool = this.campaign ? new Vt(this.lighting, [], {
			size: 12,
			fixed: !0
		}) : null;
		let { VfxLights: u } = await import("./VfxLights-DpTqiUCU.js");
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
		!this.thaw && (s?.frost || s?.states) && (this.thaw = await import("./LevelStates-DHGr7vv-.js")), await ji(), this.primeLevelMusic(this.level, "level");
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
			let { CombatSystem: t } = await import("./CombatSystem-BjAjkBBE.js");
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
		return t.push(...Mt(Ln())), t;
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
		let { StoryRunner: e, StoryState: t, journeySeed: n } = await import("./StoryRunner-C1-jye0q.js"), r = this.campaign, i = r ? r.state.story : new t(null);
		r || (i.seed = n()), this.story = new e({
			game: this,
			story: r?.story ?? null,
			state: i,
			levelId: r?.levelId ?? this._storyLevelId()
		}), r?.attachStory(this.story), this.engine.input.addBindings({ journal: ["KeyB"] });
		let { storyUIClasses: a } = await import("./storyUI-nt9ifps7.js");
		this.ui.useStoryUI(a()), this.ui.journal && (this.ui.journal.onSound = (e) => this.audio.playSfx(e, { volume: .5 }));
	}
	async ensureParty() {
		return this.party ? this.party : (this._partyLoad ??= (async () => {
			let [{ Party: e }, { partyUIClasses: t }] = await Promise.all([import("./Party-CH3Oaf3W.js"), import("./partyUI-DAOKNj5X.js")]);
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
			for (let i of [n, ...t.map((e) => ({ soundtrack: e.soundtrack }))]) r.push(Yn(i, "explore")), An(e) && (r.push(Yn(i, "battle")), e.objects.some((e) => e.type === "enemy" && !!Wt(Tn, e.kind)?.boss) && r.push(Yn(i, "boss")));
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
		return this.ui.hud.toast(zt(e.id), 1.6), e.h;
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
		i.frozen = !o || s || c || !!l && (this.photoMode || l.locksPlayer), l?.update(e, u, d), i.update(e, a), l?.afterPlayer(e, u, d), this.story?.update(e), o && !c && this.party?.update(e), i.setSilhouetteLevel(Tt(1, .5, this.lighting.nightFactor));
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
		_ && _.position.set(r.focusPoint.x, r.focusPoint.y + 1.2, r.focusPoint.z - 2), this.weather.zoomFog = gt(((this.camera.distance - 7) / Math.max(1, r.distance - 7)) ** 2, .4, 1), this.weather.update(e), this.season?.update(e), l?.applyLook(e), this._warmFrames > 0 && (this._warmFrames--, this.weather.rain.intensity = 1, this.weather.snow.intensity = 1, this._warmFrames === 0 && (l?.endWarmup(), this._resolveWarm()));
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
			e.pitchTarget = (n && t.y > n.minY ? n.pitch : this.camera.pitch) * wt;
			let r = this.level.width, i = Math.min(9, r / 5), a = 5 / 9 * i, o = vt(r - i, r - a, t.x), s = vt(i, a, t.x);
			(o > 0 || s > 0) && (e.yawTarget = gt(e.yawTarget, -(60 - 50 * s) * wt, (60 - 50 * o) * wt));
		}
		this._updateCameraBounds();
	}
	_updateCameraBounds() {
		let e = this.rig.distance, t = this.camera, { near: n, mid: r, far: i } = this.cameraBounds, a, o, s;
		e <= t.distance ? (a = n, o = r, s = gt((e - t.minDistance) / Math.max(1e-6, t.distance - t.minDistance))) : (a = r, o = i, s = gt((e - t.distance) / Math.max(1e-6, t.maxDistance - t.distance)));
		let c = this.rig.bounds;
		c.minX = Tt(a.minX, o.minX, s), c.maxX = Tt(a.maxX, o.maxX, s), c.minZ = Tt(a.minZ, o.minZ, s), c.maxZ = Tt(a.maxZ, o.maxZ, s);
	}
	_playerFocusDistance() {
		let e = this.player.position, t = this.engine.camera, n = this._focusPos.set(e.x, e.y + .9, e.z).applyMatrix4(t.matrixWorldInverse);
		return Math.max(1, -n.z);
	}
	_updateCinematic(e) {
		let t = this._cine;
		t.t += e;
		let n = t.t * .045;
		t.target.set(t.x + Math.sin(n) * t.driftX, t.y, t.z + Math.sin(n * .7 + 1) * t.driftZ), this.rig.yawTarget = Math.sin(t.t * .05) * 18 * wt, this.rig.distanceTarget = t.distance + Math.sin(t.t * .07) * 3;
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
				yaw: +(this.rig.yaw / wt).toFixed(1),
				pitch: +(this.rig.pitch / wt).toFixed(1),
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
var Co = class extends Be {
	constructor(e) {
		super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(e) {
			return new ko(e);
		}), this.register(function(e) {
			return new Ao(e);
		}), this.register(function(e) {
			return new zo(e);
		}), this.register(function(e) {
			return new Bo(e);
		}), this.register(function(e) {
			return new Vo(e);
		}), this.register(function(e) {
			return new Mo(e);
		}), this.register(function(e) {
			return new No(e);
		}), this.register(function(e) {
			return new Po(e);
		}), this.register(function(e) {
			return new Fo(e);
		}), this.register(function(e) {
			return new Oo(e);
		}), this.register(function(e) {
			return new Io(e);
		}), this.register(function(e) {
			return new jo(e);
		}), this.register(function(e) {
			return new Ro(e);
		}), this.register(function(e) {
			return new Lo(e);
		}), this.register(function(e) {
			return new Eo(e);
		}), this.register(function(e) {
			return new Ho(e, N.EXT_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new Ho(e, N.KHR_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new Uo(e);
		});
	}
	load(e, t, n, r) {
		let i = this, a;
		if (this.resourcePath !== "") a = this.resourcePath;
		else if (this.path !== "") {
			let t = Me.extractUrlBase(e);
			a = Me.resolveURL(t, this.path);
		} else a = Me.extractUrlBase(e);
		this.manager.itemStart(e);
		let o = function(t) {
			r ? r(t) : console.error(t), i.manager.itemError(e), i.manager.itemEnd(e);
		}, s = new y(this.manager);
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
			if (s.decode(new Uint8Array(e, 0, 4)) === Wo) {
				try {
					a[N.KHR_BINARY_GLTF] = new qo(e);
				} catch (e) {
					r && r(e);
					return;
				}
				i = JSON.parse(a[N.KHR_BINARY_GLTF].content);
			} else i = JSON.parse(s.decode(e));
		} else i = e;
		if (i.asset === void 0 || i.asset.version[0] < 2) {
			r && r(/* @__PURE__ */ Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
			return;
		}
		let c = new ys(i, {
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
				case N.KHR_MATERIALS_UNLIT:
					a[t] = new Do();
					break;
				case N.KHR_DRACO_MESH_COMPRESSION:
					a[t] = new Jo(i, this.dracoLoader);
					break;
				case N.KHR_TEXTURE_TRANSFORM:
					a[t] = new Yo();
					break;
				case N.KHR_MESH_QUANTIZATION:
					a[t] = new Xo();
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
var N = {
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
}, Eo = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_LIGHTS_PUNCTUAL, this.cache = {
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
		let a = t.json, o = ((a.extensions && a.extensions[this.name] || {}).lights || [])[e], s, c = new A(16777215);
		o.color !== void 0 && c.setRGB(o.color[0], o.color[1], o.color[2], De);
		let l = o.range === void 0 ? 0 : o.range;
		switch (o.type) {
			case "directional":
				s = new r(c), s.target.position.set(0, 0, -1), s.add(s.target);
				break;
			case "point":
				s = new ie(c), s.distance = l;
				break;
			case "spot":
				s = new fe(c), s.distance = l, o.spot = o.spot || {}, o.spot.innerConeAngle = o.spot.innerConeAngle === void 0 ? 0 : o.spot.innerConeAngle, o.spot.outerConeAngle = o.spot.outerConeAngle === void 0 ? Math.PI / 4 : o.spot.outerConeAngle, s.angle = o.spot.outerConeAngle, s.penumbra = 1 - o.spot.innerConeAngle / o.spot.outerConeAngle, s.target.position.set(0, 0, -1), s.add(s.target);
				break;
			default: throw Error("THREE.GLTFLoader: Unexpected light type: " + o.type);
		}
		return s.position.set(0, 0, 0), ds(s, o), o.intensity !== void 0 && (s.intensity = o.intensity), s.name = t.createUniqueName(o.name || "light_" + e), i = Promise.resolve(s), t.cache.add(n, i), i;
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
}, Do = class {
	constructor() {
		this.name = N.KHR_MATERIALS_UNLIT;
	}
	getMaterialType() {
		return it;
	}
	extendParams(e, t, n) {
		let r = [];
		e.color = new A(1, 1, 1), e.opacity = 1;
		let i = t.pbrMetallicRoughness;
		if (i) {
			if (Array.isArray(i.baseColorFactor)) {
				let t = i.baseColorFactor;
				e.color.setRGB(t[0], t[1], t[2], De), e.opacity = t[3];
			}
			i.baseColorTexture !== void 0 && r.push(n.assignTexture(e, "map", i.baseColorTexture, o));
		}
		return Promise.all(r);
	}
}, Oo = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_MATERIALS_EMISSIVE_STRENGTH;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		return n === null || n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength), Promise.resolve();
	}
}, ko = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_MATERIALS_CLEARCOAT;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : oe;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor), n.clearcoatTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)), n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor), n.clearcoatRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)), n.clearcoatNormalTexture !== void 0 && (r.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)), n.clearcoatNormalTexture.scale !== void 0)) {
			let e = n.clearcoatNormalTexture.scale;
			t.clearcoatNormalScale = new qe(e, e);
		}
		return Promise.all(r);
	}
}, Ao = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_MATERIALS_DISPERSION;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : oe;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		return n === null || (t.dispersion = n.dispersion === void 0 ? 0 : n.dispersion), Promise.resolve();
	}
}, jo = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_MATERIALS_IRIDESCENCE;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : oe;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor), n.iridescenceTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)), n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = n.iridescenceThicknessMinimum), n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = n.iridescenceThicknessMaximum), n.iridescenceThicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)), Promise.all(r);
	}
}, Mo = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_MATERIALS_SHEEN;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : oe;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (t.sheenColor = new A(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, n.sheenColorFactor !== void 0) {
			let e = n.sheenColorFactor;
			t.sheenColor.setRGB(e[0], e[1], e[2], De);
		}
		return n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor), n.sheenColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, o)), n.sheenRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)), Promise.all(r);
	}
}, No = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_MATERIALS_TRANSMISSION;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : oe;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor), n.transmissionTexture !== void 0 && r.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)), Promise.all(r);
	}
}, Po = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_MATERIALS_VOLUME;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : oe;
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
		return t.attenuationColor = new A().setRGB(i[0], i[1], i[2], De), Promise.all(r);
	}
}, Fo = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_MATERIALS_IOR;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : oe;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		return n === null ? Promise.resolve() : (t.ior = n.ior === void 0 ? 1.5 : n.ior, t.ior === 0 && (t.ior = 1e3), Promise.resolve());
	}
}, Io = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_MATERIALS_SPECULAR;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : oe;
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
		return t.specularColor = new A().setRGB(i[0], i[1], i[2], De), n.specularColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, o)), Promise.all(r);
	}
}, Lo = class {
	constructor(e) {
		this.parser = e, this.name = N.EXT_MATERIALS_BUMP;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : oe;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return t.bumpScale = n.bumpFactor === void 0 ? 1 : n.bumpFactor, n.bumpTexture !== void 0 && r.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)), Promise.all(r);
	}
}, Ro = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_MATERIALS_ANISOTROPY;
	}
	getMaterialType(e) {
		return To(this.parser, e, this.name) === null ? null : oe;
	}
	extendMaterialParams(e, t) {
		let n = To(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength), n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation), n.anisotropyTexture !== void 0 && r.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)), Promise.all(r);
	}
}, zo = class {
	constructor(e) {
		this.parser = e, this.name = N.KHR_TEXTURE_BASISU;
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
}, Bo = class {
	constructor(e) {
		this.parser = e, this.name = N.EXT_TEXTURE_WEBP;
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
}, Vo = class {
	constructor(e) {
		this.parser = e, this.name = N.EXT_TEXTURE_AVIF;
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
}, Uo = class {
	constructor(e) {
		this.name = N.EXT_MESH_GPU_INSTANCING, this.parser = e;
	}
	createNodeMesh(e) {
		let t = this.parser.json, n = t.nodes[e];
		if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
		let r = t.meshes[n.mesh];
		for (let e of r.primitives) if (e.mode !== es.TRIANGLES && e.mode !== es.TRIANGLE_STRIP && e.mode !== es.TRIANGLE_FAN && e.mode !== void 0) return null;
		let i = n.extensions[this.name].attributes, a = [], o = {};
		for (let e in i) a.push(this.parser.getDependency("accessor", i[e]).then((t) => (o[e] = t, o[e])));
		return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((e) => {
			let t = e.pop(), n = t.isGroup ? t.children : [t], r = e[0].count, i = [];
			for (let e of n) {
				let t = new at(), n = new j(), a = new p(), s = new j(1, 1, 1), c = new de(e.geometry, e.material, r);
				for (let e = 0; e < r; e++) o.TRANSLATION && n.fromBufferAttribute(o.TRANSLATION, e), o.ROTATION && a.fromBufferAttribute(o.ROTATION, e), o.SCALE && s.fromBufferAttribute(o.SCALE, e), c.setMatrixAt(e, t.compose(n, a, s));
				let l = null;
				for (let e in o) if (e === "_COLOR_0") {
					let t = o[e];
					c.instanceColor = new h(t.array, t.itemSize, t.normalized);
				} else if (e !== "TRANSLATION" && e !== "ROTATION" && e !== "SCALE") {
					if (l === null) {
						let e = c.geometry;
						l = new Le(), l.name = e.name;
						for (let t in e.attributes) l.setAttribute(t, e.attributes[t]);
						for (let t in e.morphAttributes) l.morphAttributes[t] = e.morphAttributes[t];
						e.index !== null && l.setIndex(e.index), l.morphTargetsRelative = e.morphTargetsRelative;
						for (let t of e.groups) l.addGroup(t.start, t.count, t.materialIndex);
						e.boundingBox !== null && (l.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (l.boundingSphere = e.boundingSphere.clone()), l.drawRange.start = e.drawRange.start, l.drawRange.count = e.drawRange.count, l.userData = Object.assign({}, e.userData), c.geometry = l;
					}
					let t = o[e];
					l.setAttribute(e, new h(t.array, t.itemSize, t.normalized));
				}
				S.prototype.copy.call(c, e), this.parser.assignFinalMaterial(c), i.push(c);
			}
			return t.isGroup ? (t.clear(), t.add(...i), t) : i[0];
		}));
	}
}, Wo = "glTF", Go = 12, Ko = {
	JSON: 1313821514,
	BIN: 5130562
}, qo = class {
	constructor(e) {
		this.name = N.KHR_BINARY_GLTF, this.content = null, this.body = null;
		let t = new DataView(e, 0, Go), n = new TextDecoder();
		if (this.header = {
			magic: n.decode(new Uint8Array(e.slice(0, 4))),
			version: t.getUint32(4, !0),
			length: t.getUint32(8, !0)
		}, this.header.magic !== Wo) throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
		if (this.header.version < 2) throw Error("THREE.GLTFLoader: Legacy binary file detected.");
		let r = this.header.length - Go, i = new DataView(e, Go), a = 0;
		for (; a < r;) {
			let t = i.getUint32(a, !0);
			a += 4;
			let r = i.getUint32(a, !0);
			if (a += 4, r === Ko.JSON) {
				let r = new Uint8Array(e, Go + a, t);
				this.content = n.decode(r);
			} else if (r === Ko.BIN) {
				let n = Go + a;
				this.body = e.slice(n, n + t);
			}
			a += t;
		}
		if (this.content === null) throw Error("THREE.GLTFLoader: JSON content not found.");
	}
}, Jo = class {
	constructor(e, t) {
		if (!t) throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
		this.name = N.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
	}
	decodePrimitive(e, t) {
		let n = this.json, r = this.dracoLoader, i = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, s = {}, c = {};
		for (let e in a) {
			let t = as[e] || e.toLowerCase();
			o[t] = a[e];
		}
		for (let t in e.attributes) {
			let r = as[t] || t.toLowerCase();
			if (a[t] !== void 0) {
				let i = n.accessors[e.attributes[t]];
				c[r] = ts[i.componentType].name, s[r] = i.normalized === !0;
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
				}, o, c, De, n);
			});
		});
	}
}, Yo = class {
	constructor() {
		this.name = N.KHR_TEXTURE_TRANSFORM;
	}
	extendTexture(e, t) {
		if ((t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0) return e;
		if (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), t.rotation !== void 0) {
			let t = Math.cos(e.rotation), n = Math.sin(e.rotation);
			e.matrix.set(e.repeat.x * t, e.repeat.y * n, e.offset.x, -e.repeat.x * n, e.repeat.y * t, e.offset.y, 0, 0, 1), e.matrixAutoUpdate = !1;
		}
		return e.needsUpdate = !0, e;
	}
}, Xo = class {
	constructor() {
		this.name = N.KHR_MESH_QUANTIZATION;
	}
}, Zo = class extends Te {
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
}, Qo = new p(), $o = class extends Zo {
	interpolate_(e, t, n, r) {
		let i = super.interpolate_(e, t, n, r);
		return Qo.fromArray(i).normalize().toArray(i), i;
	}
}, es = {
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
}, ts = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
}, ns = {
	9728: E,
	9729: Re,
	9984: a,
	9985: Ce,
	9986: Ie,
	9987: tt
}, rs = {
	33071: Ae,
	33648: c,
	10497: w
}, is = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT2: 4,
	MAT3: 9,
	MAT4: 16
}, as = {
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
}, os = {
	scale: "scale",
	translation: "position",
	rotation: "quaternion",
	weights: "morphTargetInfluences"
}, ss = {
	CUBICSPLINE: void 0,
	LINEAR: Ue,
	STEP: et
}, cs = {
	OPAQUE: "OPAQUE",
	MASK: "MASK",
	BLEND: "BLEND"
};
function ls(e) {
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
function us(e, t, n) {
	for (let r in n.extensions) e[r] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[r] = n.extensions[r]);
}
function ds(e, t) {
	t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function fs(e, t, n) {
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
function ps(e, t) {
	if (e.updateMorphTargets(), t.weights !== void 0) for (let n = 0, r = t.weights.length; n < r; n++) e.morphTargetInfluences[n] = t.weights[n];
	if (t.extras && Array.isArray(t.extras.targetNames)) {
		let n = t.extras.targetNames;
		if (e.morphTargetInfluences.length === n.length) {
			e.morphTargetDictionary = {};
			for (let t = 0, r = n.length; t < r; t++) e.morphTargetDictionary[n[t]] = t;
		} else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
	}
}
function ms(e) {
	let t, n = e.extensions && e.extensions[N.KHR_DRACO_MESH_COMPRESSION];
	if (t = n ? "draco:" + n.bufferView + ":" + n.indices + ":" + hs(n.attributes) : e.indices + ":" + hs(e.attributes) + ":" + e.mode, e.targets !== void 0) for (let n = 0, r = e.targets.length; n < r; n++) t += ":" + hs(e.targets[n]);
	return t;
}
function hs(e) {
	let t = "", n = Object.keys(e).sort();
	for (let r = 0, i = n.length; r < i; r++) t += n[r] + ":" + e[n[r]] + ";";
	return t;
}
function gs(e) {
	switch (e) {
		case Int8Array: return 1 / 127;
		case Uint8Array: return 1 / 255;
		case Int16Array: return 1 / 32767;
		case Uint16Array: return 1 / 65535;
		default: throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
	}
}
function _s(e) {
	return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0 ? "image/webp" : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
var vs = new at(), ys = class {
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
		this.textureLoader = typeof createImageBitmap > "u" || n && r < 17 || i && a < 98 ? new ne(this.options.manager) : new Je(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new y(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
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
			return us(i, a, r), ds(a, r), Promise.all(n._invokeAll(function(e) {
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
		if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[N.KHR_BINARY_GLTF].body);
		let r = this.options;
		return new Promise(function(e, i) {
			n.load(Me.resolveURL(t.uri, r.path), e, void 0, function() {
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
			let e = is[i.type], t = ts[i.componentType], n = i.normalized === !0, r = new t(i.count * e);
			return Promise.resolve(new be(r, e, n));
		}
		let a = [];
		return i.bufferView === void 0 ? a.push(null) : a.push(this.getDependency("bufferView", i.bufferView)), i.sparse !== void 0 && (a.push(this.getDependency("bufferView", i.sparse.indices.bufferView)), a.push(this.getDependency("bufferView", i.sparse.values.bufferView))), Promise.all(a).then(function(e) {
			let a = e[0], o = is[i.type], s = ts[i.componentType], c = s.BYTES_PER_ELEMENT, l = c * o, u = i.byteOffset || 0, d = i.bufferView === void 0 ? void 0 : r.bufferViews[i.bufferView].byteStride, f = i.normalized === !0, p, m;
			if (d && d !== l) {
				let e = Math.floor(u / d), r = "InterleavedBuffer:" + i.bufferView + ":" + i.componentType + ":" + e + ":" + i.count, l = n.cache.get(r);
				l || (p = new s(a, e * d, i.count * d / c), l = new te(p, d / c), n.cache.add(r, l)), m = new t(l, o, u % d / c, f);
			} else p = a === null ? new s(i.count * o) : new s(a, u, i.count * o), m = new be(p, o, f);
			if (i.sparse !== void 0) {
				let t = is.SCALAR, n = ts[i.sparse.indices.componentType], r = i.sparse.indices.byteOffset || 0, c = i.sparse.values.byteOffset || 0, l = new n(e[1], r, i.sparse.count * t), u = new s(e[2], c, i.sparse.count * o);
				a !== null && (m = new be(m.array.slice(), m.itemSize, m.normalized)), m.normalized = !1;
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
			return t.magFilter = ns[n.magFilter] || 1006, t.minFilter = ns[n.minFilter] || 1008, t.wrapS = rs[n.wrapS] || 1e3, t.wrapT = rs[n.wrapT] || 1e3, t.generateMipmaps = !t.isCompressedTexture && t.minFilter !== 1003 && t.minFilter !== 1006, r.associations.set(t, { textures: e }), t;
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
					let t = new he(e);
					t.needsUpdate = !0, n(t);
				}), t.load(Me.resolveURL(e, i.path), a, void 0, r);
			});
		}).then(function(e) {
			return c === !0 && o.revokeObjectURL(s), ds(e, a), e.userData.mimeType = a.mimeType || _s(a.uri), e;
		}).catch(function(e) {
			throw console.error("THREE.GLTFLoader: Couldn't load texture", s), e;
		});
		return this.sourceCache[e] = l, l;
	}
	assignTexture(e, t, n, r) {
		let i = this;
		return this.getDependency("texture", n.index).then(function(a) {
			if (!a) return null;
			if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), i.extensions[N.KHR_TEXTURE_TRANSFORM]) {
				let e = n.extensions === void 0 ? void 0 : n.extensions[N.KHR_TEXTURE_TRANSFORM];
				if (e) {
					let t = i.associations.get(a);
					a = i.extensions[N.KHR_TEXTURE_TRANSFORM].extendTexture(a, e), i.associations.set(a, t);
				}
			}
			return r !== void 0 && (a.colorSpace = r), e[t] = a, a;
		});
	}
	assignFinalMaterial(e) {
		let t = e.geometry, n = e.material, r = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
		if (e.isPoints) {
			let e = "PointsMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new s(), ke.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, t.sizeAttenuation = !1, this.cache.add(e, t)), n = t;
		} else if (e.isLine) {
			let e = "LineBasicMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new Ge(), ke.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, this.cache.add(e, t)), n = t;
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
		if (c[N.KHR_MATERIALS_UNLIT]) {
			let e = r[N.KHR_MATERIALS_UNLIT];
			a = e.getMaterialType(), l.push(e.extendParams(s, i, t));
		} else {
			let n = i.pbrMetallicRoughness || {};
			if (s.color = new A(1, 1, 1), s.opacity = 1, Array.isArray(n.baseColorFactor)) {
				let e = n.baseColorFactor;
				s.color.setRGB(e[0], e[1], e[2], De), s.opacity = e[3];
			}
			n.baseColorTexture !== void 0 && l.push(t.assignTexture(s, "map", n.baseColorTexture, o)), s.metalness = n.metallicFactor === void 0 ? 1 : n.metallicFactor, s.roughness = n.roughnessFactor === void 0 ? 1 : n.roughnessFactor, n.metallicRoughnessTexture !== void 0 && (l.push(t.assignTexture(s, "metalnessMap", n.metallicRoughnessTexture)), l.push(t.assignTexture(s, "roughnessMap", n.metallicRoughnessTexture))), a = this._invokeOne(function(t) {
				return t.getMaterialType && t.getMaterialType(e);
			}), l.push(Promise.all(this._invokeAll(function(t) {
				return t.extendMaterialParams && t.extendMaterialParams(e, s);
			})));
		}
		i.doubleSided === !0 && (s.side = 2);
		let u = i.alphaMode || cs.OPAQUE;
		if (u === cs.BLEND ? (s.transparent = !0, s.depthWrite = !1) : (s.transparent = !1, u === cs.MASK && (s.alphaTest = i.alphaCutoff === void 0 ? .5 : i.alphaCutoff)), i.normalTexture !== void 0 && a !== it && (l.push(t.assignTexture(s, "normalMap", i.normalTexture)), s.normalScale = new qe(1, 1), i.normalTexture.scale !== void 0)) {
			let e = i.normalTexture.scale;
			s.normalScale.set(e, e);
		}
		if (i.occlusionTexture !== void 0 && a !== it && (l.push(t.assignTexture(s, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (s.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && a !== it) {
			let e = i.emissiveFactor;
			s.emissive = new A().setRGB(e[0], e[1], e[2], De);
		}
		return i.emissiveTexture !== void 0 && a !== it && l.push(t.assignTexture(s, "emissiveMap", i.emissiveTexture, o)), Promise.all(l).then(function() {
			let n = new a(s);
			return i.name && (n.name = i.name), ds(n, i), t.associations.set(n, { materials: e }), i.extensions && us(r, n, i), n;
		});
	}
	createUniqueName(e) {
		let t = le.sanitizeNodeName(e || "");
		return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
	}
	loadGeometries(e) {
		let t = this, n = this.extensions, r = this.primitiveCache;
		function i(e) {
			return n[N.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then(function(n) {
				return xs(n, e, t);
			});
		}
		let a = [];
		for (let n = 0, o = e.length; n < o; n++) {
			let o = e[n], s = ms(o), c = r[s];
			if (c) a.push(c.promise);
			else {
				let e;
				e = o.extensions && o.extensions[N.KHR_DRACO_MESH_COMPRESSION] ? i(o) : xs(new Le(), o, t), o.mode === es.TRIANGLE_STRIP ? e = e.then((e) => dn(e, 1)) : o.mode === es.TRIANGLE_FAN && (e = e.then((e) => dn(e, 2))), r[s] = {
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
			let t = a[e].material === void 0 ? ls(this.cache) : this.getDependency("material", a[e].material);
			o.push(t);
		}
		return o.push(t.loadGeometries(a)), Promise.all(o).then(async function(n) {
			let o = n.slice(0, n.length - 1), s = n[n.length - 1], c = [];
			for (let n = 0, l = s.length; n < l; n++) {
				let l = s[n], u = a[n], d, f = o[n];
				if (u.mode === es.TRIANGLES || u.mode === es.TRIANGLE_STRIP || u.mode === es.TRIANGLE_FAN || u.mode === void 0) {
					let e = i.isSkinnedMesh === !0, t = l.hasAttribute("skinIndex") && l.hasAttribute("skinWeight");
					e && t === !1 && console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."), d = e && t ? new Ye(l, f) : new k(l, f), d.isSkinnedMesh === !0 && d.normalizeSkinWeights();
				} else if (u.mode === es.LINES) d = new xe(l, f);
				else if (u.mode === es.LINE_STRIP) d = new ye(l, f);
				else if (u.mode === es.LINE_LOOP) d = new Qe(l, f);
				else if (u.mode === es.POINTS) d = new ot(l, f);
				else throw Error("THREE.GLTFLoader: Primitive mode unsupported: " + u.mode);
				Object.keys(d.geometry.morphAttributes).length > 0 && ps(d, i), d.name = t.createUniqueName(i.name || "mesh_" + e), ds(d, i), u.extensions && us(r, d, u), t.assignFinalMaterial(d), c.push(d);
			}
			for (let n = 0, r = c.length; n < r; n++) t.associations.set(c[n], {
				meshes: e,
				primitives: n
			});
			if (c.length === 1) return i.extensions && us(r, c[0], i), c[0];
			let l = new O();
			i.extensions && us(r, l, i), t.associations.set(l, { meshes: e });
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
		return n.type === "perspective" ? t = new d(_e.radToDeg(r.yfov), r.aspectRatio || 1, r.znear || 1, r.zfar || 2e6) : n.type === "orthographic" && (t = new ee(-r.xmag, r.xmag, r.ymag, -r.ymag, r.znear, r.zfar)), n.name && (t.name = this.createUniqueName(n.name)), ds(t, n), Promise.resolve(t);
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
					let t = new at();
					n !== null && t.fromArray(n.array, e * 16), a.push(t);
				} else console.warn("THREE.GLTFLoader: Joint \"%s\" could not be found.", t.joints[e]);
			}
			return new v(i, a);
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
			let u = new Ve(i, void 0, l);
			return ds(u, r), u;
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
				e.isSkinnedMesh && e.bind(r, vs);
			});
			for (let e = 0, r = n.length; e < r; e++) t.add(n[e]);
			if (t.userData.pivot !== void 0 && n.length > 0) {
				let e = t.userData.pivot, r = n[0];
				t.pivot = new j().fromArray(e), t.position.x -= e[0], t.position.y -= e[1], t.position.z -= e[2], r.position.set(0, 0, 0), delete t.userData.pivot;
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
			if (o = i.isBone === !0 ? new ve() : t.length > 1 ? new O() : t.length === 1 ? t[0] : new S(), o !== t[0]) for (let e = 0, n = t.length; e < n; e++) o.add(t[e]);
			if (i.name && (o.userData.name = i.name, o.name = a), ds(o, i), i.extensions && us(n, o, i), i.matrix !== void 0) {
				let e = new at();
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
		let t = this.extensions, n = this.json.scenes[e], r = this, i = new O();
		n.name && (i.name = r.createUniqueName(n.name)), ds(i, n), n.extensions && us(t, i, n);
		let a = n.nodes || [], o = [];
		for (let e = 0, t = a.length; e < t; e++) o.push(r.getDependency("node", a[e]));
		return Promise.all(o).then(function(e) {
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				n.parent === null ? i.add(n) : i.add(xo(n));
			}
			return r.associations = ((e) => {
				let t = /* @__PURE__ */ new Map();
				for (let [e, n] of r.associations) (e instanceof ke || e instanceof he) && t.set(e, n);
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
		os[i.path] === os.weights ? (c(e), e.isGroup && e.children.forEach(c)) : s.push(o);
		let l;
		switch (os[i.path]) {
			case os.weights:
				l = Fe;
				break;
			case os.rotation:
				l = ce;
				break;
			case os.translation:
			case os.scale:
				l = Oe;
				break;
			default: switch (n.itemSize) {
				case 1:
					l = Fe;
					break;
				default: l = Oe;
			}
		}
		let u = r.interpolation === void 0 ? Ue : ss[r.interpolation], d = this._getArrayFromAccessor(n);
		for (let e = 0, n = s.length; e < n; e++) {
			let n = new l(s[e] + "." + os[i.path], t.array, d, u);
			r.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(n), a.push(n);
		}
		return a;
	}
	_getArrayFromAccessor(e) {
		let t = e.array;
		if (e.normalized) {
			let e = gs(t.constructor), n = new Float32Array(t.length);
			for (let r = 0, i = t.length; r < i; r++) n[r] = t[r] * e;
			t = n;
		}
		return t;
	}
	_createCubicSplineTrackInterpolant(e) {
		e.createInterpolant = function(e) {
			return new (this instanceof ce ? $o : Zo)(this.times, this.values, this.getValueSize() / 3, e);
		}, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
	}
};
function bs(e, t, n) {
	let r = t.attributes, i = new We();
	if (r.POSITION !== void 0) {
		let e = n.json.accessors[r.POSITION], t = e.min, a = e.max;
		if (t !== void 0 && a !== void 0) {
			if (i.set(new j(t[0], t[1], t[2]), new j(a[0], a[1], a[2])), e.normalized) {
				let t = gs(ts[e.componentType]);
				i.min.multiplyScalar(t), i.max.multiplyScalar(t);
			}
		} else {
			console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			return;
		}
	} else return;
	let a = t.targets;
	if (a !== void 0) {
		let e = new j(), t = new j();
		for (let r = 0, i = a.length; r < i; r++) {
			let i = a[r];
			if (i.POSITION !== void 0) {
				let r = n.json.accessors[i.POSITION], a = r.min, o = r.max;
				if (a !== void 0 && o !== void 0) {
					if (t.setX(Math.max(Math.abs(a[0]), Math.abs(o[0]))), t.setY(Math.max(Math.abs(a[1]), Math.abs(o[1]))), t.setZ(Math.max(Math.abs(a[2]), Math.abs(o[2]))), r.normalized) {
						let e = gs(ts[r.componentType]);
						t.multiplyScalar(e);
					}
					e.max(t);
				} else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			}
		}
		i.expandByVector(e);
	}
	e.boundingBox = i;
	let o = new g();
	i.getCenter(o.center), o.radius = i.min.distanceTo(i.max) / 2, e.boundingSphere = o;
}
function xs(e, t, n) {
	let r = t.attributes, i = [];
	function a(t, r) {
		return n.getDependency("accessor", t).then(function(t) {
			e.setAttribute(r, t);
		});
	}
	for (let t in r) {
		let n = as[t] || t.toLowerCase();
		n in e.attributes || i.push(a(r[t], n));
	}
	if (t.indices !== void 0 && !e.index) {
		let r = n.getDependency("accessor", t.indices).then(function(t) {
			e.setIndex(t);
		});
		i.push(r);
	}
	return ge.workingColorSpace !== "srgb-linear" && "COLOR_0" in r && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ge.workingColorSpace}" not supported.`), ds(e, t), bs(e, t, n), Promise.all(i).then(function() {
		return t.targets === void 0 ? e : fs(e, t.targets, n);
	});
}
//#endregion
//#region ember3d/buildkit.js
function Ss(e) {
	let t = e >>> 0;
	return () => {
		t |= 0, t = t + 1831565813 | 0;
		let e = Math.imul(t ^ t >>> 15, 1 | t);
		return e = e + Math.imul(e ^ e >>> 7, 61 | e) ^ e, ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
var Cs = (e) => [
	parseInt(e.slice(1, 3), 16),
	parseInt(e.slice(3, 5), 16),
	parseInt(e.slice(5, 7), 16)
], ws = (e, t) => e.map((e) => Math.max(0, Math.min(255, Math.round(e * t)))), Ts = (e) => `rgb(${e[0]},${e[1]},${e[2]})`, Es = .5, Ds = /* @__PURE__ */ new Map();
function P(e, t, n = 1, r) {
	let i = e + t + n + (r || "");
	if (Ds.has(i)) return Ds.get(i);
	let a = document.createElement("canvas");
	a.width = a.height = 64;
	let s = a.getContext("2d"), c = Ss(n * 977 + e.length), l = Cs(t), u = r ? Cs(r) : ws(l, .62);
	s.fillStyle = Ts(l), s.fillRect(0, 0, 64, 64);
	let d = (e, t, n, r, i) => {
		s.fillStyle = Ts(e), s.fillRect(t, n, r, i);
	};
	if (e === "ashlar" || e === "rubble" || e === "field") {
		let t = e === "ashlar" ? 11 : e === "rubble" ? 8 : 9;
		for (let n = 0; n < 64; n += t) {
			let r = -(n / t % 2) * (e === "ashlar" ? 11 : 6) - c() * 4;
			for (; r < 64;) {
				let i = e === "ashlar" ? 22 : 8 + c() * 14, a = .86 + c() * .26;
				d(ws(l, a), r + 1, n + 1, i - 1, t - 1), d(ws(l, a * 1.12), r + 1, n + 1, i - 1, 1), r += i;
			}
			d(u, 0, n, 64, 1);
		}
	} else if (e === "plaster") {
		for (let e = 0; e < 26; e++) d(ws(l, .9 + c() * .16), c() * 64, c() * 64, 4 + c() * 14, 3 + c() * 8);
		for (let e = 0; e < 6; e++) d(ws(l, .8), c() * 64, 58 - c() * 10, 2 + c() * 6, 10);
	} else if (e === "planks") for (let e = 0; e < 64; e += 8) d(ws(l, .85 + c() * .25), e, 0, 7, 64), d(u, e + 7, 0, 1, 64), c() < .5 && d(ws(l, .7), e + 3, c() * 64, 1, 3);
	else if (e === "slate" || e === "lead") {
		let t = e === "slate" ? 6 : 16;
		for (let n = 0; n < 64; n += t) {
			let r = n / t % 2 * 5;
			for (; r < 74; r += e === "slate" ? 10 : 16) d(ws(l, .82 + c() * .28), r, n, e === "slate" ? 9 : 15, t - 1);
			d(u, 0, n + t - 1, 64, 1);
		}
	} else if (e === "thatch") {
		for (let e = 0; e < 64; e += 10) d(ws(l, .7), 0, e + 9, 64, 1);
		for (let e = 0; e < 260; e++) {
			let e = c() * 64, t = c() * 64;
			d(ws(l, .78 + c() * .4), e, t, 1, 3 + c() * 5);
		}
	} else if (e === "tile") for (let e = 0; e < 64; e += 8) {
		let t = e / 8 % 2 * 5 - 2;
		for (; t < 74; t += 10) {
			let n = .66 + c() * .56;
			d(ws(l, n), t, e, 9, 7), d(ws(l, n * 1.22), t + 1, e + 5, 7, 2), d(ws(l, n * .8), t, e, 1, 7);
		}
		d(u, 0, e + 7, 64, 1);
	}
	else if (e === "shingle") for (let e = 0; e < 64; e += 8) {
		let t = e / 8 % 2 * 4;
		for (; t < 64; t += 8) d(ws(l, .8 + c() * .3), t, e, 7, 7);
		d(u, 0, e + 7, 64, 1);
	}
	else if (e === "palisade") for (let e = 0; e < 64; e += 10) d(ws(l, .85 + c() * .2), e, 0, 9, 64), d(ws(l, 1.12), e + 1, 0, 2, 64), d(u, e + 9, 0, 1, 64);
	let f = new Ee(a);
	return f.magFilter = E, f.minFilter = E, f.wrapS = f.wrapT = w, f.colorSpace = o, Ds.set(i, f), f;
}
var F = (e, t) => new l({
	map: e || null,
	color: t ? new A(t) : 16777215
});
function I(e, t, n, r, i = 0, a = 0, o = 0, s) {
	let c = new M(e, t, n), l = c.attributes.uv, u = [
		[n, t],
		[n, t],
		[e, n],
		[e, n],
		[e, t],
		[e, t]
	];
	for (let e = 0; e < 6; e++) for (let t = 0; t < 4; t++) {
		let n = e * 4 + t;
		l.setXY(n, l.getX(n) * u[e][0] / Es, l.getY(n) * u[e][1] / Es);
	}
	let d = new k(c, r);
	return d.position.set(i, a + t / 2, o), s && s.add(d), d;
}
function Os(e, t, n, r, i, a, o, s = .08, c = .05) {
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
	], 2 * l / Es, m / Es), h([
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
	], 2 * l / Es, m / Es), h([
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
	], 2 * l / Es, .1), h([
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
	], 2 * l / Es, .1);
	let g = new Le();
	g.setAttribute("position", new re(d, 3)), g.setAttribute("uv", new re(f, 2)), g.setIndex(p), g.computeVertexNormals();
	let _ = new k(g, a);
	_.material.side = 2, e.add(_);
	let v = [], y = [];
	for (let e of [-1, 1]) {
		let a = t / 2 * e;
		v.push(a, r, -n / 2, a, r, n / 2, a, r + n / 2 * i / u, 0), y.push(0, 0, n / Es, 0, n / 2 / Es, i / Es);
	}
	let b = new Le();
	b.setAttribute("position", new re(v, 3)), b.setAttribute("uv", new re(y, 2)), b.computeVertexNormals();
	let x = new k(b, o.clone());
	return x.material.side = 2, e.add(x), _;
}
function ks(e, t, n, r, i, a = 4, o = .08) {
	let s = new k(new nt((t / 2 + o) * (a === 4 ? Math.SQRT2 : 1), r, a, 1), i);
	return s.position.y = n + r / 2, a === 4 && (s.rotation.y = Math.PI / 4), e.add(s), s;
}
function As(e, t, n, r, i, a = .12, o = .16, s = {}) {
	let { wallW: c, wallD: l } = n, u = .025, d = (t, a) => {
		n.side === "z" ? t.position.set(r, i, l / 2 + a) : (t.position.set(c / 2 + a, i, r), t.rotation.y = Math.PI / 2), e.add(t);
	};
	d(new k(new M(a + .04, o + .04, u), t.m.trim), .004);
	let f = s.lit ?? t.rnd() < .65, p = new k(new M(a, o, u), f ? t.m.glass : t.m.dark);
	if (p.userData.glow = f, d(p, .012), d(new k(new M(.014, o, u), t.m.trim), .02), s.pointed) {
		let e = new k(new nt(a / 2 + .02, .09, 4, 1), t.m.trim);
		e.rotation.z = 0, e.scale.z = .25, d(e, .004), e.position.y = i + o / 2 + .045, e.rotation.y += Math.PI / 4;
	}
	if (s.flowers && Is(e, t, d, n, r, i - o / 2 - .03, a), s.shutters) for (let e of [-1, 1]) {
		let r = new k(new M(a * .5, o + .02, u), t.m.shutter);
		d(r, .01), n.side === "z" ? r.position.x += a * .78 * e : r.position.z += a * .78 * e;
	}
}
var js = [
	"#9a3a50",
	"#c8c0c8",
	"#b89040",
	"#7a5098",
	"#a85a34"
], Ms = [
	"#2e4420",
	"#3a5226",
	"#46602a"
], Ns = /* @__PURE__ */ new Map(), Ps = (e) => (Ns.has(e) || Ns.set(e, tc(e)), Ns.get(e));
function Fs(e) {
	return e.userData.dress = !0, e;
}
function Is(e, t, n, r, i, a, o) {
	let s = t.frnd, c = (e, t) => {
		r.side === "z" ? e.position.x += t : e.position.z += t;
	}, l = Fs(new k(new M(o + .05, .035, .045), t.m.wood));
	n(l, .03), l.position.y = a;
	let u = js[s() * js.length | 0];
	for (let e = 0; e < 7; e++) {
		let t = -o / 2 - .01 + (o + .02) * (e + .5) / 7, r = Fs(new k(new _(.026 + s() * .01, 0), Ps(Ms[s() * 3 | 0])));
		if (n(r, .04 + s() * .012), r.position.y = a + .026, c(r, t), s() < .5) {
			let e = Fs(new k(new _(.02, 0), Ps(Ms[s() * 3 | 0])));
			n(e, .055), e.position.y = a - .03 - s() * .03, c(e, t);
		}
		let i = Fs(new k(new _(.019 + s() * .007, 0), Ps(s() < .7 ? u : js[s() * js.length | 0])));
		n(i, .05 + s() * .015), i.position.y = a + .045 + s() * .02, c(i, t + (s() - .5) * .02);
	}
}
function Ls(e, t, n, r, i) {
	let a = t.frnd, o = (n.side === "z" ? n.wallD : n.wallW) / 2;
	for (let t = 0, s = 26 + (a() * 10 | 0); t < s; t++) {
		let c = t / s, l = c * i, u = .12 * (1 - c * .6), d = r + (a() - .5) * u * 2, f = Fs(new k(new _(.045 * (1 - c * .4) + a() * .012, 0), Ps(Ms[a() * 3 | 0])));
		n.side === "z" ? f.position.set(d, l + .02, o + .012) : f.position.set(o + .012, l + .02, d), f.scale.set(n.side === "z" ? 1 : .45, 1, n.side === "z" ? .45 : 1), e.add(f);
	}
}
function Rs(e, t, n, r, i = .2, a = .42, o = !0) {
	let s = .03, c = new k(new M(i, a, s), t.m.door), l = new k(new M(i + .05, a + .04, s * .8), t.m.trim);
	for (let [t, i] of [[l, .004], [c, .014]]) n.side === "z" ? t.position.set(r, a / 2, n.wallD / 2 + i) : (t.position.set(n.wallW / 2 + i, a / 2, r), t.rotation.y = Math.PI / 2), e.add(t);
	if (o) {
		let o = new k(new D(i / 2 + .025, i / 2 + .025, s * .8, 10, 1, !1, 0, Math.PI), t.m.trim);
		o.rotation.x = Math.PI / 2, o.rotation.z = Math.PI / 2, n.side === "z" ? (o.position.set(r, a, n.wallD / 2 + .004), o.rotation.set(Math.PI / 2, 0, Math.PI / 2)) : (o.position.set(n.wallW / 2 + .004, a, r), o.rotation.set(0, 0, 0), o.rotation.x = Math.PI / 2, o.rotation.y = Math.PI / 2, o.rotation.z = 0), e.add(o);
	}
}
function zs(e, t, n, r, i, a = 3, o = !0) {
	let s = n.side === "z" ? n.wallW : n.wallD, c = (n.side === "z" ? n.wallD : n.wallW) / 2 + .012, l = (r, i, a, o, s = 0) => {
		let l = new k(new M(r, i, .03), t.m.beam);
		n.side === "z" ? (l.position.set(a, o, c), l.rotation.z = s) : (l.position.set(c, o, a), l.rotation.y = Math.PI / 2, l.rotation.x = -s, l.rotation.order = "YXZ", l.rotation.set(0, Math.PI / 2, 0), l.rotateZ(s)), e.add(l);
	};
	for (let e = 0; e <= a; e++) l(.04, i - r, -s / 2 + s * e / a, (r + i) / 2);
	if (l(s + .02, .04, 0, r + .02), l(s + .02, .04, 0, i - .02), l(s, .035, 0, (r + i) / 2), o) for (let e = 0; e < a; e += 2) {
		let t = s / a;
		l(.035, Math.hypot(t, (i - r) / 2), -s / 2 + t * (e + .5), r + (i - r) * .25, Math.atan2(t, (i - r) / 2) * (e % 4 ? 1 : -1));
	}
}
function Bs(e, t, n, r, i, a) {
	I(.1, a, .1, t.m.stone, n, i, r, e), I(.13, .03, .13, t.m.stoneDark, n, i + a, r, e);
}
function Vs(e, t, n, r, i, a = t.m.stone, o = .07) {
	let s = o * 2;
	for (let t = -n / 2 + o / 2; t <= n / 2; t += s) for (let n of [-r / 2 + o / 2, r / 2 - o / 2]) I(o, o, o, a, t, i, n, e);
	for (let t = -r / 2 + o / 2 + s; t <= r / 2 - s; t += s) for (let r of [-n / 2 + o / 2, n / 2 - o / 2]) I(o, o, o, a, r, i, t, e);
}
function Hs(e, t, n, r, i, a = "z", o = .3) {
	let s = new k(new M(.1, o, .012), t.m.banner);
	a === "z" ? s.position.set(n, r - o / 2, i) : (s.position.set(n, r - o / 2, i), s.rotation.y = Math.PI / 2), e.add(s);
	let c = new k(new M(.14, .015, .015), t.m.trim);
	c.position.set(s.position.x, r, s.position.z), c.rotation.y = s.rotation.y, e.add(c);
}
function Us(e, t, n, r, i) {
	let a = new k(new M(.02, .02, .16), t.m.trim);
	a.position.set(n, r, i + .08), e.add(a);
	let o = new k(new M(.02, .1, .12), t.m.signboard);
	o.position.set(n, r - .07, i + .12), e.add(o);
}
function Ws(e, t, n, r) {
	let i = new k(new D(.05, .05, .12, 8), t.m.wood);
	i.position.set(n, .06, r), e.add(i);
	let a = new k(new D(.052, .052, .012, 8), t.m.trim);
	a.position.set(n, .09, r), e.add(a);
}
function Gs(e, t, n, r, i = .09) {
	let a = new k(new D(i, i * 1.1, i * 1.3, 8), t.m.hay);
	a.position.set(n, i * .65, r), e.add(a);
	let o = new k(new nt(i * 1.05, i * .7, 8), t.m.hay);
	o.position.set(n, i * 1.3 + i * .35, r), e.add(o);
}
function Ks(e, t, n, r, i, a) {
	let o = Math.hypot(i - n, a - r), s = Math.max(2, Math.round(o / .14)), c = Math.atan2(i - n, a - r);
	for (let o = 0; o <= s; o++) {
		let c = o / s;
		I(.025, .14, .025, t.m.wood, n + (i - n) * c, 0, r + (a - r) * c, e);
	}
	for (let s of [.05, .11]) {
		let l = new k(new M(.015, .02, o), t.m.wood);
		l.position.set((n + i) / 2, s, (r + a) / 2), l.rotation.y = c, e.add(l);
	}
}
var qs = {
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
}, Js = {
	roofRise: 1.05,
	jetty: .04,
	timber: !0
};
Object.assign(qs, {
	vale: {
		...qs.A,
		key: "vale",
		roof: ["tile", "#434856"],
		dress: !0
	},
	fens: {
		...Js,
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
		...Js,
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
		...Js,
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
function Ys(e, t = 1) {
	let n = qs[e], r = new O(), i = {
		lower: F(P(n.lower[0], n.lower[1], t)),
		upper: F(P(n.upper[0], n.upper[1], t + 1)),
		roof: F(P(n.roof[0], n.roof[1], t + 2)),
		stone: F(P(n.lower[0] === "ashlar" ? "ashlar" : "field", n.lower[1], t + 3)),
		stoneDark: F(null, ws(Cs(n.lower[1]), .6).reduce((e, t) => e + t.toString(16).padStart(2, "0"), "#")),
		wood: F(P("planks", n.wood, t + 4)),
		beam: F(null, n.beam),
		door: F(P("planks", n.door, t + 5)),
		trim: F(null, n.trim),
		glass: F(null, "#e0a050"),
		dark: F(null, "#1c1a22"),
		paper: F(null, "#b8ad92"),
		banner: F(null, n.banner),
		hay: F(P("thatch", n.hay, t + 6)),
		signboard: F(null, n.signboard),
		palisade: F(P("palisade", n.wood, t + 7)),
		shutter: F(P("planks", n.shutter || n.wood, t + 9)),
		ashlar: F(P("ashlar", n.lower[1], t + 8))
	};
	return {
		S: {
			...n,
			m: i,
			rnd: Ss(t * 31 + 7),
			frnd: Ss(t * 57 + 3)
		},
		g: r
	};
}
function Xs(e, t, n, r, i, a, o, s, c = {}) {
	let l = I(n, a, r, o, 0, i, 0, t), u = {
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
			c.doorZ !== void 0 && Math.abs(s - c.doorZ) < .16 || As(t, e, u, s, i + a * .55, .11, .15, {
				pointed: e.gothic,
				shutters: !e.gothic && !e.thatch && r % 2 == 0,
				flowers: e.dress && e.frnd() < .45
			});
		}
		for (let n = 0; n < s; n++) As(t, e, d, -r / 2 + r * (n + .5) / s, i + a * .55, .11, .15, {
			pointed: e.gothic,
			flowers: e.dress && e.frnd() < .45
		});
		let l = new O();
		l.rotation.y = Math.PI, t.add(l);
		for (let t = 0; t < o; t++) As(l, e, u, -n / 2 + n * (t + .5) / o, i + a * .55, .11, .15, { pointed: e.gothic });
		for (let t = 0; t < s; t++) As(l, e, d, -r / 2 + r * (t + .5) / s, i + a * .55, .11, .15, { pointed: e.gothic });
	}
	if (e.dress && i < .01) for (let [i, o] of [[u, n], [d, r]]) e.frnd() < .5 && Ls(t, e, i, (e.frnd() < .5 ? -1 : 1) * (o / 2 - .07), a * (.6 + e.frnd() * .5));
	if (c.timber && e.timber) {
		zs(t, e, u, i, i + a, Math.max(2, Math.round(n / .25))), zs(t, e, d, i, i + a, Math.max(2, Math.round(r / .25)));
		let o = new O();
		o.rotation.y = Math.PI, t.add(o), zs(o, e, u, i, i + a, Math.max(2, Math.round(n / .25))), zs(o, e, d, i, i + a, Math.max(2, Math.round(r / .25)));
	}
	return l;
}
function Zs(e, t, n, r, i, a, o = !0) {
	let s = new O();
	t.add(s), o || (s.rotation.y = Math.PI / 2);
	let [c, l] = o ? [n, r] : [r, n];
	if (Os(s, c, l, i, a * l / 2, e.m.roof, e.m.upper, e.thatch ? .1 : .07, e.thatch ? .09 : .04), e.thatch) {
		let t = new k(new D(.06, .06, c + .2, 8), e.m.roof);
		t.rotation.z = Math.PI / 2, t.position.y = i + a * l / 2 + .01, s.add(t);
	}
	if (e.gothic) for (let t of [-1, 1]) {
		let n = new k(new nt(.025, .14, 4), e.m.trim);
		n.position.set(t * c / 2, i + a * l / 2 + .06, 0), s.add(n);
	}
	return e.key === "heights" && (Sc(s, c, l, i, a, e.m.upper), t.userData.snowed = !0), s;
}
function Qs(e, t, n, r, i, a = .06) {
	let o = new nt((t / 2 + a) * Math.SQRT2, r, 4, 1);
	o.rotateY(Math.PI / 4);
	let s = new k(o, i);
	return s.position.y = n + r / 2, e.add(s), s;
}
function $s(e, t, n, r, i) {
	for (let a = 0; a <= 2; a++) {
		let o = -n / 2 + n * a / 2;
		I(.07, i * .75, .1, e.m.stone, o, 0, r / 2 + .04, t);
	}
	for (let a = 1; a <= 1; a++) I(.1, i * .75, .07, e.m.stone, n / 2 + .04, 0, -r / 2 + r * a / 2, t);
}
var ec = {
	house(e, t, n) {
		let r = .72, i = .58, a = .52, o = e.timber && (e.key === "vale" || e.key === "fens");
		o && I(.75, .1, .61, e.m.stone, 0, 0, 0, t), Xs(e, t, r, i, 0, a, o ? e.m.upper : e.m.lower, !0, {
			doorZ: -.12,
			timber: o
		}), Rs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, -.12, .17, .36, !e.timber), Zs(e, t, r, i, a, e.roofRise * 1.1), Bs(t, e, r / 2 - .12, -.58 / 4, a, .32 + e.roofRise * .2), wc(e, t, r, i, a, e.roofRise * 1.1, n), e.gothic && $s(e, t, r, i, a);
	},
	tavern(e, t, n) {
		let r = .7, i = .55;
		Xs(e, t, 1, r, 0, i, e.m.lower, !0, { doorZ: .05 }), Rs(t, e, {
			side: "z",
			wallW: 1,
			wallD: r
		}, .05, .22, .4, !0);
		let a = e.jetty;
		Xs(e, t, 1 + a * 2, r + a * 2, i, .48, e.thatch ? e.m.lower : e.m.upper, !0, { timber: !0 }), Zs(e, t, 1 + a * 2, r + a * 2, 1.03, e.roofRise);
		let o = new O();
		o.position.set(-.3, 0, -.55), t.add(o), Xs(e, o, .5, .45, 0, .5, e.m.lower, !1), Zs(e, o, .5, .45, .5, e.roofRise, !1), Bs(t, e, .34, -.12, 1.03, .45), Bs(t, e, -.38, .1, 1.03, .4), Us(t, e, .32, .5, r / 2), Ws(t, e, .62, .3), Ws(t, e, .62, .16);
		let s = new O();
		s.position.set(.12, 0, .52), t.add(s);
		for (let t of [-.26, .4]) I(.035, .42, .035, e.m.beam, t, 0, .14, s);
		let c = I(.76, .03, .36, e.m.roof, .07, .43, 0, s);
		c.rotation.x = .3;
		for (let t of [-.12, .26]) {
			I(.16, .02, .1, e.m.wood, t, .1, .05, s);
			for (let n of [-.06, .06]) I(.018, .1, .018, e.m.beam, t + n, 0, .05, s);
			I(.16, .015, .035, e.m.wood, t, .06, .12, s);
		}
		uc(s, e, -.26, .38, .17), uc(s, e, .4, .38, .17);
		let l = new O();
		l.position.set(-.46, 0, .44999999999999996), t.add(l);
		for (let t of [-1, 1]) I(.025, .34, .025, e.m.beam, t * .13, 0, 0, l);
		I(.3, .18, .025, e.m.wood, 0, .14, 0, l), I(.34, .03, .06, e.m.roof, 0, .33, 0, l);
		for (let [t, n] of [
			[-.08, .26],
			[.02, .2],
			[.09, .25],
			[-.03, .16],
			[.08, .16]
		]) I(.05, .06, .03, e.m.paper, t, n, .004, l);
		e.gothic && $s(e, t, 1, r, i);
	},
	inn(e, t, n) {
		let r = 1.2, i = .66, a = [.54, .48], o = 0;
		a.forEach((n, a) => {
			Xs(e, t, r + (a ? e.jetty * 2 : 0), i + (a ? e.jetty * 2 : 0), o, n, a ? e.thatch ? e.m.lower : e.m.upper : e.m.lower, !0, {
				doorZ: .3,
				timber: a > 0
			}), o += n;
		}), Rs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, .3, .24, .42, !0), Zs(e, t, r + e.jetty * 2, i + e.jetty * 2, o, e.roofRise);
		for (let n of [-.3, .3]) {
			let r = new O();
			r.position.set(n, o + .05, i / 4), t.add(r), Xs(e, r, .2, .2, 0, .16, e.m.upper, !1), As(r, e, {
				side: "z",
				wallW: .2,
				wallD: .2
			}, 0, .09, .09, .1), Zs(e, r, .2, .22, .16, e.roofRise, !1);
		}
		Bs(t, e, -.5, 0, o, .42), Bs(t, e, .52, -.1, o, .38);
		let s = new O();
		s.position.set(.82, 0, .05), t.add(s);
		for (let [t, n] of [
			[-.18, .28],
			[.18, .28],
			[.18, -.25]
		]) I(.04, .4, .04, e.m.beam, t, 0, n, s);
		let c = I(.46, .04, .62, e.m.roof, 0, .42, 0, s);
		c.rotation.x = 0, c.rotation.z = -.25, Gs(s, e, .05, .05, .08), Us(t, e, -.2, .52, i / 2);
	},
	shop(e, t, n) {
		let r = .62, i = .62, a = .56;
		Xs(e, t, r, i, 0, a, e.m.lower, !1), Rs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, -.16, .17, .36, !1), As(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, .12, .26, .2, .14), As(t, e, {
			side: "x",
			wallW: r,
			wallD: i
		}, 0, .3, .16, .14), e.timber && (zs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, .38, a, 3, !1), zs(t, e, {
			side: "x",
			wallW: r,
			wallD: i
		}, .38, a, 3, !1)), Zs(e, t, .66, .66, a, e.roofRise * 1.15, !1);
		let o = I(.36, .02, .2, e.m.banner, .1, .44, .41000000000000003, t);
		o.rotation.x = .35, I(.34, .12, .12, e.m.wood, .1, 0, .41000000000000003, t);
		for (let n = 0; n < 4; n++) I(.05, .04, .05, n % 2 ? e.m.hay : e.m.banner, -.02 + n * .08, .12, .41000000000000003, t);
		Ws(t, e, .38, .3), Bs(t, e, -.2, -.2, a, .42), fc(t, e, .12, .1, .12, .41000000000000003, .18), fc(t, e, .1, .08, .1, .43, .05, !0), pc(t, e, .51, .3), Us(t, e, -.2, .46, i / 2);
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
		I(r, a, i, o, 0, 0, 0, t), I(.78, .06, 1.31, e.m.stoneDark, 0, 0, 0, t), I(.38, .035, .14, e.m.stoneDark, .06, 0, .6950000000000001, t), I(.32, .035, .08, e.m.stoneDark, .06, .035, .665, t), Rs(t, e, s, .06, .26, .5, !0);
		let l = new k(new D(.115, .115, .02, 14), e.m.trim);
		l.rotation.x = Math.PI / 2, l.position.set(.06, a * .8, .631), t.add(l);
		let u = new k(new D(.09, .09, .02, 14), e.m.glass);
		u.userData.glow = !0, u.rotation.x = Math.PI / 2, u.position.set(.06, a * .8, .639), t.add(u);
		for (let n of [
			0,
			1,
			2
		]) {
			let r = I(.012, .18, .01, e.m.trim, .06, a * .8 - .09, .649, t);
			r.rotation.z = n * Math.PI / 3;
		}
		I(.08, a * .85, .08, o, r / 2 - .02, 0, .645, t);
		for (let n = 0; n < 3; n++) As(t, e, c, -1.25 / 2 + i * (n + .5) / 3, a * .5, .09, .34, {
			pointed: !0,
			lit: !0
		});
		for (let e = 0; e <= 3; e++) I(.09, a * .8, .08, o, .40499999999999997, 0, -1.25 / 2 + i * e / 3, t);
		let d = new O();
		d.rotation.y = Math.PI, t.add(d);
		for (let t = 0; t < 3; t++) As(d, e, c, -1.25 / 2 + i * (t + .5) / 3, a * .5, .09, .34, {
			pointed: !0,
			lit: !0
		});
		Zs(e, t, r, i, a, e.roofRise * 1.2, !1);
		let f = .34, p = a + .6, m = new O();
		m.position.set(-.45, 0, .475), t.add(m);
		let h = new D(f * .56, f * .6, p, 16, 1), g = h.attributes.uv;
		for (let e = 0; e < g.count; e++) g.setXY(e, g.getX(e) * (Math.PI * f * 1.16) / Es, g.getY(e) * p / Es);
		let _ = new k(h, o);
		_.position.y = p / 2, m.add(_);
		let v = new k(new D(f * .62, f * .62, .05, 16), e.m.stoneDark);
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
		As(m, e, y, 0, a * .45, .08, .2, {
			pointed: !0,
			lit: !0
		});
		for (let t of [y, b]) As(m, e, t, 0, p - .17, .12, .2, {
			pointed: !0,
			lit: !1
		});
		{
			let t = new nt(f * .68, e.gothic ? .9 : .72, 16, 1, !0), n = t.attributes.uv;
			for (let e = 0; e < n.count; e++) n.setXY(e, n.getX(e) * (Math.PI * f * 1.3) / Es, n.getY(e) * .9 / Es);
			let r = e.m.roof.clone();
			r.side = 2;
			let i = new k(t, r);
			i.position.y = p + (e.gothic ? .45 : .36), m.add(i);
		}
		let x = new O();
		x.position.set(0, p + (e.gothic ? .9 : .72) + .01, 0), m.add(x), I(.02, .16, .02, e.m.trim, 0, 0, 0, x), I(.09, .02, .02, e.m.trim, 0, .1, 0, x), uc(t, e, -.16, .36, .675), uc(t, e, .28, .36, .675);
	},
	smith(e, t, n) {
		let r = .78, i = .6, a = .46, o = e.m.stone;
		I(r, a, .08, o, 0, 0, -.26, t), I(.08, a, i, o, -.78 / 2 + .04, 0, 0, t), I(.08, a * .5, i * .55, o, r / 2 - .04, 0, -.12, t);
		for (let [n, o] of [
			[r / 2 - .03, i / 2 - .03],
			[-.36, i / 2 - .03],
			[r / 2 - .03, -.02]
		]) I(.06, a, .06, e.m.beam, n, 0, o, t);
		I(r, .05, .06, e.m.beam, 0, .41000000000000003, i / 2 - .03, t), Zs(e, t, .9, .72, a, e.roofRise * .85), I(.28, .17, .26, o, -.2, 0, -.06, t);
		let s = I(.22, .025, .2, e.m.glass, -.2, .17, -.06, t);
		s.userData.glow = !0;
		let c = I(.16, .08, .012, e.m.glass, -.2, .04, .075, t);
		c.userData.glow = !0, I(.24, .14, .16, o, -.2, .3, -.16, t), Bs(t, e, -.2, -.2, a, .62), I(.06, .09, .06, e.m.wood, .12, 0, .1, t), I(.14, .05, .06, e.m.dark, .12, .09, .1, t), I(.05, .03, .04, e.m.dark, .2, .1, .1, t), I(.22, .08, .09, e.m.wood, .2, 0, -.16, t), I(.19, .012, .06, F(null, "#1d3040"), .2, .08, -.16, t);
		let l = new O();
		l.position.set(.51, 0, .12), t.add(l);
		for (let t of [-.12, .12]) I(.025, .3, .025, e.m.beam, 0, 0, t, l);
		I(.025, .025, .28, e.m.beam, 0, .26, 0, l);
		for (let t = 0; t < 4; t++) I(.012, .22, .03, e.m.trim, .02, .04, -.09 + t * .06, l);
		Us(t, e, r / 2 - .05, .4, i / 2);
	},
	keep(e, t, n) {
		if (e.thatch) {
			let n = new k(new D(.55, .85, .3, 10), F(P("rubble", "#5a5040", 9)));
			n.position.y = .15, t.add(n);
			let r = new O();
			r.position.y = .3, t.add(r), I(.6, .9, .6, e.m.palisade, 0, 0, 0, r), I(.72, .2, .72, e.m.wood, 0, .9, 0, r), As(r, e, {
				side: "z",
				wallW: .72,
				wallD: .72
			}, 0, 1, .1, .08), As(r, e, {
				side: "x",
				wallW: .72,
				wallD: .72
			}, 0, 1, .1, .08), ks(r, .72, 1.1, .5, e.m.roof);
			for (let n = 0; n < 18; n++) {
				let r = n / 18 * Math.PI * 2;
				n !== 2 && (I(.07, .36, .07, e.m.palisade, Math.cos(r) * .95, 0, Math.sin(r) * .95, t).rotation.y = -r);
			}
			Hs(t, e, .05, 1.95, 0);
			return;
		}
		let r = .95, i = e.gothic ? 1.9 : 1.6;
		I(r, i, r, e.m.stone, 0, 0, 0, t), I(1.03, .06, 1.03, e.m.stoneDark, 0, i, 0, t), Vs(t, e, 1.01, 1.01, i + .06, e.m.stone, .08);
		let a = {
			side: "z",
			wallW: r,
			wallD: r
		}, o = {
			side: "x",
			wallW: r,
			wallD: r
		};
		Rs(t, e, a, 0, .24, .44, !0);
		for (let n of [.75, 1.2]) for (let r of [-.25, .25]) As(t, e, a, r, n, .07, .14, { pointed: e.gothic }), As(t, e, o, r, n, .07, .14, { pointed: e.gothic });
		for (let [n, a] of [
			[-1, -1],
			[1, -1],
			[-1, 1],
			[1, 1]
		]) {
			let o = new k(new D(.14, .15, i + .3, 10), e.m.stone);
			o.position.set(n * r / 2, (i + .3) / 2, a * r / 2), t.add(o), ks(t, .3, i + .3, e.gothic ? .6 : .4, e.m.roof, 10, .02).position.set(n * r / 2, i + .3 + (e.gothic ? .3 : .2), a * r / 2);
		}
		Hs(t, e, .2, i - .1, .495), Hs(t, e, .495, i - .1, -.2, "x"), e.gothic && $s(e, t, r, r, i * .7);
	},
	curtain(e, t, n) {
		let r = .74;
		I(2, .08, .32, e.m.stoneDark, 0, 0, 0, t), I(2, r, .26, e.m.stone, 0, 0, 0, t), I(2, .03, .3, e.m.stoneDark, 0, .71, 0, t), Vs(t, e, 2, .28, r, e.m.stone, .07);
		for (let n of [
			-.7,
			0,
			.7
		]) for (let r of [-1, 1]) I(.025, .12, .01, e.m.dark, n, .42, r * .134, t);
	},
	tower(e, t, n) {
		let r = .32, i = 1.08, a = new k(new D(.36, .38, .1, 14), e.m.stoneDark);
		a.position.y = .05, t.add(a);
		let o = new k(new D(r, .34, i, 14), e.m.stone);
		o.position.y = i / 2, t.add(o);
		let s = new k(new D(.35, .35, .04, 14), e.m.stoneDark);
		s.position.y = .76, t.add(s);
		let c = new k(new D(.37, .36, .06, 14), e.m.stoneDark);
		c.position.y = i, t.add(c), ks(t, r * 2, 1.11, .5, e.m.roof, 14, .06);
		for (let n of [.5, 1.1]) {
			let r = I(.03, .13, .02, e.m.dark, Math.sin(n) * .325, .46, Math.cos(n) * .325, t);
			r.rotation.y = n;
		}
		Hs(t, e, 0, 1.1, .34, "z", .24);
	},
	gatehouse(e, t, n) {
		let r = .56, i = 1.1, a = .56;
		for (let n of [-1, 1]) I(.43999999999999995 / 2, i, r, e.m.stone, n * .39, 0, 0, t);
		I(a, .5000000000000001, r, e.m.stone, 0, .6, 0, t);
		for (let n of [-1, 1]) {
			let r = new k(new D(a / 2, a / 2, .02, 12, 1, !1, 0, Math.PI), e.m.stoneDark);
			r.rotation.set(Math.PI / 2, 0, Math.PI / 2), r.position.set(0, .38, n * .29000000000000004), r.scale.set(1, 1, .45), t.add(r);
		}
		I(a, .12, .03, e.m.dark, 0, .48, r / 2 - .06, t);
		for (let n = 0; n < 6; n++) I(.012, .16, .012, e.m.dark, -.56 / 2 + .05 + n * .4600000000000001 / 5, .38, r / 2 - .06, t);
		I(1.04, .04, .6000000000000001, e.m.stoneDark, 0, 1.06, 0, t), Vs(t, e, 1, r, i, e.m.stone, .07);
		for (let n of [-1, 1]) {
			let i = new O();
			i.position.set(n * (1 / 2 - .06), 0, r / 2 - .02), t.add(i);
			let a = new k(new D(.2, .22, 1.26, 12), e.m.stone);
			a.position.y = 1.26 / 2, i.add(a), ks(i, .42, 1.26, .38, e.m.roof, 12, .05), I(.025, .11, .02, e.m.dark, 0, .55, .205, i), uc(t, e, n * .31000000000000005, .42, .32);
		}
		Hs(t, e, 0, 1.04, .30000000000000004, "z", .3);
	},
	palisade(e, t, n) {
		let r = F(P("palisade", "#6e5a44", 41));
		I(2, .07, .4, F(P("rubble", "#5d5442", 43)), 0, 0, 0, t);
		for (let e = 0; e < 27; e++) {
			let i = -1 + 2 * (e + .5) / 27, a = .66 + n() * .1, o = .036 + n() * .008, s = new k(new D(o, o + .004, a, 7), r);
			s.position.set(i, a / 2, (n() - .5) * .012), s.rotation.z = (n() - .5) * .04, t.add(s);
			let c = new k(new nt(o, .09, 7), r);
			c.position.set(i, a + .045, s.position.z), t.add(c);
		}
		for (let n of [.22, .52]) I(2, .04, .03, e.m.beam, 0, n, .055, t);
		for (let n of [
			-.66,
			0,
			.66
		]) {
			let r = I(.03, .42, .03, e.m.beam, n, 0, .09, t);
			r.rotation.x = -.35;
		}
	},
	watchtower(e, t, n) {
		let r = .56, i = F(P("palisade", "#6e5a44", 47));
		for (let [n, i] of [
			[-1, -1],
			[1, -1],
			[-1, 1],
			[1, 1]
		]) I(.08, 1.12, .08, e.m.beam, n * r / 2, 0, i * r / 2, t);
		for (let e = 0; e < 4; e++) for (let a = 0; a < 8; a++) {
			let o = -.56 / 2 + r * (a + .5) / 8, s = .6 + n() * .06, [c, l] = [
				[o, r / 2],
				[r / 2, o],
				[o, -.56 / 2],
				[-.56 / 2, o]
			][e], u = new k(new D(.034, .036, s, 7), i);
			u.position.set(c, s / 2, l), t.add(u);
		}
		let a = .7000000000000001;
		I(a, .04, a, e.m.beam, 0, .8, 0, t), I(a, .3, a, e.m.wood, 0, .84, 0, t);
		for (let n of [-1, 1]) I(.025, .82, .025, e.m.beam, .12 + n * .06, 0, .34, t);
		for (let n = .1; n < .8; n += .11) I(.12, .018, .018, e.m.beam, .12, n, .34, t);
		for (let n of [-.15, .15]) I(.03, .1, .01, e.m.dark, n, .95, .35300000000000004, t), I(.01, .1, .03, e.m.dark, .35300000000000004, .95, n, t);
		Qs(t, a, 1.14, .36, e.m.roof), Hs(t, e, 0, 1.12, .37000000000000005, "z", .24);
	},
	timbergate(e, t, n) {
		let r = .6, i = .34, a = .42, o = F(P("palisade", "#6e5a44", 53));
		for (let s of [-1, 1]) {
			let c = new O();
			c.position.x = s * .47, t.add(c);
			for (let [t, n] of [
				[-1, -1],
				[1, -1],
				[-1, 1],
				[1, 1]
			]) I(.08, 1.18, .08, e.m.beam, t * i / 2, 0, n * a / 2, c);
			for (let e = 0; e < 6; e++) for (let t of [-.42 / 2, a / 2]) {
				let r = .64 + n() * .05, a = new k(new D(.034, .036, r, 7), o);
				a.position.set(-.34 / 2 + i * (e + .5) / 6, r / 2, t), c.add(a);
			}
			for (let e = 0; e < 7; e++) for (let t of [-.34 / 2, i / 2]) {
				let r = .64 + n() * .05, i = new k(new D(.034, .036, r, 7), o);
				i.position.set(t, r / 2, -.42 / 2 + a * (e + .5) / 7), c.add(i);
			}
			I(.46, .3, .54, e.m.wood, 0, .84, 0, c), I(.46, .04, .54, e.m.beam, 0, .8, 0, c), I(.03, .1, .01, e.m.dark, 0, .95, .273, c), Qs(c, .46, 1.14, .34, e.m.roof, .05), uc(t, e, s * (r / 2 - .02), .44, .26);
		}
		I(r, .05, a, e.m.beam, 0, .66, 0, t), I(r, .22, .04, e.m.wood, 0, .7, a / 2 - .02, t), I(r, .22, .04, e.m.wood, 0, .7, -.19, t);
		let s = new O();
		s.position.y = .92, t.add(s), Os(s, .6599999999999999, .52, 0, .16, e.m.roof, e.m.wood, .04, .03);
		for (let n of [-1, 1]) {
			let i = I(r / 2 - .02, .56, .04, e.m.door, 0, 0, 0, t);
			i.geometry.translate(n * (r / 4 - .01), 0, 0), i.position.set(n * (r / 2 - .01), .28, a / 2 - .02), i.rotation.y = n * 1.35;
		}
		Hs(t, e, 0, .9, .22, "z", .22);
	},
	wall(e, t, n) {
		let r = 2.2, i = e.thatch ? .5 : .62;
		if (e.thatch) {
			for (let n = 0; n < 26; n++) {
				let a = -2.2 / 2 + r * n / 25;
				if (Math.abs(a) < .2) continue;
				I(.075, i + n % 3 * .02, .075, e.m.palisade, a, 0, 0, t);
				let o = new k(new nt(.04, .08, 4), e.m.wood);
				o.position.set(a, i + .04 + n % 3 * .02, 0), t.add(o);
			}
			for (let n of [-1, 1]) I(.08, .9, .08, e.m.wood, n * .22, 0, .05, t);
			I(.56, .08, .3, e.m.wood, 0, .82, .05, t), I(.5, .2, .26, e.m.palisade, 0, .9, .05, t), ks(t, .5, 1.1, .22, e.m.roof);
			return;
		}
		for (let n of [-1, 1]) I(r / 2 - .3, i, .2, e.m.stone, n * .7000000000000001, 0, 0, t), Vs(t, e, r / 2 - .3, .001, i, e.m.stone, .07);
		t.children.slice(-0).forEach(() => {});
		let a = new O();
		t.add(a);
		for (let t of [-1, 1]) I(.26, i + .35, .34, e.m.stone, t * .26, 0, .02, a), Vs(a, e, .001, .001, 0, e.m.stone);
		I(.78, .2, .34, e.m.stone, 0, i + .15, .02, a), Vs(a, e, .78, .34, i + .35, e.m.stone, .07);
		let o = new k(new M(.26, .45, .04), e.m.door);
		if (o.position.set(0, .225, .19), a.add(o), e.gothic) for (let t of [-1, 1]) ks(a, .26, i + .35, .5, e.m.roof, 4, .03).position.set(t * .26, i + .6, .02);
		Hs(a, e, 0, i + .3, .2), As(a, e, {
			side: "z",
			wallW: .78,
			wallD: .34
		}, -.26, i + .1, .06, .1, { pointed: e.gothic }), As(a, e, {
			side: "z",
			wallW: .78,
			wallD: .34
		}, .26, i + .1, .06, .1, { pointed: e.gothic });
	},
	well(e, t, n) {
		let r = new k(new D(.16, .18, .16, 10), e.m.stone);
		r.position.y = .08, t.add(r);
		let i = new k(new D(.13, .13, .01, 10), F(null, "#1d3040"));
		i.position.y = .155, t.add(i);
		for (let n of [-1, 1]) I(.03, .36, .03, e.m.beam, n * .15, .1, 0, t);
		I(.34, .025, .025, e.m.beam, 0, .42, 0, t);
		let a = new O();
		a.position.y = .46, t.add(a), Os(a, .36, .3, 0, .12, e.m.roof, e.m.wood, .03, .02), I(.06, .06, .06, e.m.wood, .05, .25, 0, t);
	},
	farm(e, t, n) {
		let r = new O();
		r.position.set(-.25, 0, -.2), t.add(r), I(.95, .5, .6, e.gothic ? e.m.stone : e.m.wood, 0, 0, 0, r), Zs(e, r, .95, .6, .5, e.roofRise * .9);
		let i = new k(new M(.3, .36, .03), e.m.door);
		i.position.set(.05, .18, .31), r.add(i);
		let a = new O();
		a.position.set(.55, 0, .3), t.add(a), Xs(e, a, .45, .42, 0, .44, e.m.lower, !0, { doorZ: -.08 }), Rs(a, e, {
			side: "z",
			wallW: .45,
			wallD: .42
		}, -.08, .14, .3, !1), Zs(e, a, .45, .42, .44, e.roofRise, !1), Bs(a, e, .12, -.05, .44, .3), Gs(t, e, -.72, .35), Gs(t, e, -.5, .48, .08), Gs(t, e, .9, -.3, .07), Ks(t, e, -.95, .75, .25, .75), Ks(t, e, -.95, .75, -.95, -.2), Ws(t, e, .2, .55);
	}
}, tc = (e) => new l({
	color: new A(e),
	flatShading: !0
}), nc = {
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
function rc(e, t, n, r, i = 1) {
	let a = new O();
	a.position.set(n, 0, r), a.scale.setScalar(i), e.add(a);
	let o = tc(nc.dead), s = new k(new D(.025, .05, .8, 5), o);
	s.position.y = .4, s.rotation.z = (t() - .5) * .15, a.add(s);
	for (let e = 0; e < 5; e++) {
		let n = new k(new D(.008, .018, .3, 4), o), r = .35 + e * .09, i = t() * 6.28;
		n.position.set(Math.cos(i) * .1, r + .1, Math.sin(i) * .1), n.rotation.set(Math.sin(i) * .9, 0, -Math.cos(i) * .9), a.add(n);
	}
}
var ic = (e) => new A(e);
function ac(e, t, n, r) {
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
	return i.setAttribute("color", new be(u, 3)), i;
}
var oc = () => new l({
	vertexColors: !0,
	flatShading: !0
}), sc = (e, t, n, r = 1) => new D(1e-4, e, t, n, r), cc = {
	base: ic("#5b564b"),
	dark: ic("#433f37"),
	light: ic("#6f685a"),
	moss: ic("#4a5233"),
	grass: ic("#46502f"),
	snow: ic("#d4d6da"),
	scree: ic("#524d44")
}, L = (e, t) => e.clone().multiplyScalar(t);
function lc(e, t, n = .6) {
	let r = ac(new Pe(t, 0), e, t * .35, (e, t, n) => e > .6 && n < .8 ? L(cc.moss, .9 + n * .2) : e > .3 ? L(cc.light, .9 + n * .15) : L(cc.base, .85 + n * .2)), i = new k(r, oc());
	return i.scale.y = n, i.position.y = t * n * .55, i;
}
function uc(e, t, n, r, i) {
	I(.02, .22, .02, t.m.beam, n, r - .22, i, e);
	let a = new k(new M(.05, .06, .05), t.m.glass);
	a.userData.glow = !0, a.position.set(n, r + .02, i), e.add(a), I(.07, .015, .07, t.m.trim, n, r + .05, i, e);
}
function dc(e, t, n, r, i, a = 0) {
	let o = ac(new M(.1, i, .07, 1, 2, 1), t, .03, (e, t, n) => e > .6 ? L(cc.moss, .9 + n * .2) : L(cc.base, .8 + n * .25));
	o.translate(0, i / 2, 0);
	let s = new k(o, oc());
	return s.position.set(n, 0, r), s.rotation.set(a, t() * 3, a * .5), e.add(s), s;
}
Object.assign(ec, {
	barrow(e, t, n) {
		let r = new me(.6, 18, 7, 0, Math.PI * 2, 0, Math.PI / 2);
		r.scale(1.42, .5, 1);
		let i = new k(ac(r, n, .03, (e, t, n) => e > .25 ? L(cc.grass, .82 + n * .22) : L(ic("#4a4034"), .85 + n * .2)), oc());
		i.position.set(-.04, 0, -.22), t.add(i);
		for (let e = 0; e < 18; e++) {
			let r = e / 18 * Math.PI * 2, i = -.04 + Math.cos(r) * .87, a = -.22 + Math.sin(r) * .61;
			if (a > .18 && Math.abs(i - .08) < .42) continue;
			let o = lc(n, .05 + n() * .025, .55);
			o.position.set(i, o.position.y - .02, a), t.add(o);
		}
		let a = F(P("field", "#6a6458", 21));
		for (let e of [-1, 1]) for (let n = 0; n < 4; n++) {
			let r = n / 3, i = .08 + e * (.26 + r * .36), o = .36 - r * r * .24, s = .27 - r * .15;
			I(.18, s, .11, a, i, 0, o, t).rotation.y = -e * (.25 + r * .55);
		}
		I(.25, .4, .4, F(null, "#0a090d"), .08, 0, .2, t);
		let o = (e, t, n) => e > .6 ? L(cc.moss, .95 + n * .2) : L(ic("#8a8478"), .85 + n * .25);
		for (let e of [-1, 1]) {
			let r = new k(ac(new M(.12, .43, .13, 1, 3, 1), n, .02, o), oc());
			r.position.set(.08 + e * .18, .215, .4), r.rotation.z = e * .04, t.add(r);
		}
		let s = new k(ac(new M(.56, .1, .16, 3, 1, 1), n, .02, o), oc());
		s.position.set(.08, .47, .4), s.rotation.z = .02, t.add(s);
		let c = new k(new D(.035, .035, .012, 10), F(null, "#7a7062"));
		c.rotation.x = Math.PI / 2, c.position.set(.08, .47, .485), t.add(c), Fs(I(.28, .02, .22, F(P("field", "#6e6a60", 22)), .08, 0, .56, t));
		for (let n of [-1, 1]) I(.028, .37, .028, e.m.beam, .08 + n * .105, 0, .42, t).rotation.z = n * .05;
		I(.25, .028, .035, e.m.beam, .08, .37, .42, t);
		let l = new k(ac(sc(.24, .17, 9), n, .03, (e, t, n) => L(ic("#5a4a38"), .85 + n * .25)), oc());
		l.position.set(.6, .085, .36), t.add(l);
		for (let r = 0; r < 3; r++) Fs(I(.065, .01, .34, e.m.wood, 0 + r * .075, 0, .74, t)).rotation.y = (n() - .5) * .12;
		{
			let n = t.children.length;
			I(.025, .36, .025, e.m.beam, -.3, 0, .6, t), I(.1, .018, .018, e.m.beam, -.26, .34, .6, t), uc(t, e, -.22, .3, .6), t.children.slice(n).forEach(Fs);
		}
		dc(t, n, -.35, -.3, .28, .1).position.y = .2;
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
		]]) dc(t, n, e, r, i, a);
		rc(t, n, -.62, -.5, 1);
	},
	mine(e, t, n) {
		let r = new O();
		r.position.set(-.2, 0, -.25), t.add(r);
		let i = (e, t, n) => e > .6 && t < .35 ? L(cc.grass, .8 + n * .3) : e > .35 ? L(cc.light, .85 + n * .2) : L(cc.base, .8 + n * .25), a = (e, t, a, o, s) => {
			let c = sc(a, o, s, 3);
			c.translate(0, o / 2, 0);
			let l = new k(ac(c, n, a * .3, i), oc());
			l.position.set(e, 0, t), l.rotation.y = n() * 6, r.add(l);
		};
		a(0, 0, .85, .42, 10), a(-.25, -.2, .5, .78, 7), a(.22, -.28, .42, .62, 7), a(-.05, .1, .4, .55, 7);
		for (let e = 0; e < 3; e++) {
			let e = n() * 6.28, r = lc(n, .18 + n() * .1, .8);
			r.position.set(Math.cos(e) * .6 - .2, 0, Math.sin(e) * .5 - .25), t.add(r);
		}
		let o = new O();
		o.position.set(.05, 0, .35), t.add(o), I(.34, .36, .3, F(null, "#0b0a0e"), 0, 0, -.05, o);
		for (let t of [-1, 1]) I(.05, .4, .05, e.m.beam, t * .19, 0, .08, o);
		I(.46, .06, .07, e.m.beam, 0, .4, .08, o);
		let s = I(.52, .03, .22, e.m.wood, 0, .47, .05, o);
		s.rotation.x = .35, uc(o, e, -.24, .36, .14);
		for (let n = 0; n < 7; n++) I(.22, .015, .035, e.m.wood, .05, 0, .5 + n * .09, t);
		for (let n of [-1, 1]) I(.015, .02, .66, e.m.trim, .05 + n * .07, .015, .78, t);
		let c = new O();
		c.position.set(.05, .02, .86), t.add(c), I(.18, .1, .22, e.m.wood, 0, .03, 0, c);
		for (let [t, n] of [
			[-.08, -.07],
			[.08, -.07],
			[-.08, .07],
			[.08, .07]
		]) {
			let r = new k(new D(.03, .03, .02, 8), e.m.trim);
			r.rotation.z = Math.PI / 2, r.position.set(t, .03, n), c.add(r);
		}
		let l = new k(ac(new Pe(.08, 0), n, .03, () => L(ic("#5c5750"), 1)), oc());
		l.position.y = .14, l.scale.y = .6, c.add(l);
		let u = new k(ac(sc(.3, .12, 8, 2).translate(0, .06, 0), n, .04, (e, t, n) => L(cc.scree, .62 + n * .2)), oc());
		u.position.set(.55, 0, .5), t.add(u);
		let d = new O();
		d.position.set(.5, 0, -.1), t.add(d);
		for (let [t, n] of [
			[-.12, -.1],
			[.12, -.1],
			[-.12, .1],
			[.12, .1]
		]) I(.03, .62, .03, e.m.beam, t, 0, n, d);
		I(.32, .04, .28, e.m.beam, 0, .62, 0, d);
		let f = new k(new D(.06, .06, .03, 10), e.m.wood);
		f.rotation.x = Math.PI / 2, f.position.set(0, .7, 0), d.add(f), I(.008, .45, .008, e.m.trim, .06, .2, 0, d), uc(t, e, .32, .46, .62), Ws(t, e, -.35, .55), Ws(t, e, -.45, .5);
	},
	stilthouse(e, t, n) {
		let r = .2, i = .58 + n() * .12, a = .5, o = .4, s = i + .24, c = .72;
		for (let [n, r] of [
			[-s / 2, -.72 / 2],
			[s / 2, -.72 / 2],
			[-s / 2, c / 2],
			[s / 2, c / 2],
			[0, c / 2],
			[s / 2, 0]
		]) I(.04, .22, .04, e.m.beam, n, -.02, r, t);
		for (let n of [-s / 2, s / 2]) {
			let i = I(.02, .02, c * 1.05, e.m.beam, n, r * .45, 0, t);
			i.rotation.x = .35;
		}
		I(s + .04, .03, .76, e.m.wood, 0, r, 0, t);
		let l = new O();
		l.position.set(-.03, .23, -.04), t.add(l), Xs(e, l, i, a, 0, o, n() < .5 ? e.m.upper : e.m.lower, !0, { doorZ: .08 }), Rs(l, e, {
			side: "z",
			wallW: i,
			wallD: a
		}, .08, .15, .3, !1), Zs(e, l, i, a, o, e.roofRise * 1.3, n() < .5), n() < .6 && Bs(l, e, -i / 2 + .1, -.5 / 4, o, .28);
		for (let n = 0; n < 5; n++) I(.11, .012, .018, e.m.wood, .06, .16 - n * .045, .39, t);
		for (let n of [0, .12]) I(.012, .23, .012, e.m.beam, n, -.02, .39, t);
		uc(t, e, .2, .5, c / 2 - .02), I(.2, .16, .006, F(null, "#4a4a3a"), s / 2 - .12, .26, .37, t);
		let u = new k(new D(.035, .02, .09, 7), F(null, "#6a5a38"));
		u.position.set(s / 2 + .02, .14, .05), t.add(u);
	},
	stilttavern(e, t, n) {
		let r = .7, i = .46, a = 1.3, o = 1.04;
		for (let n = 0; n < 4; n++) for (let r of [-1.04 / 2, o / 2]) I(.05, .19999999999999998, .05, e.m.beam, -1.3 / 2 + a * n / 3, -.02, r, t);
		I(1.34, .035, 1.08, e.m.wood, 0, .18, 0, t);
		let s = new O();
		s.position.set(-.02, .215, -.08), t.add(s), Xs(e, s, 1, r, 0, i, e.m.lower, !0, { doorZ: .05 }), Rs(s, e, {
			side: "z",
			wallW: 1,
			wallD: r
		}, .05, .22, .38, !0), Xs(e, s, 1 + e.jetty * 2, r + e.jetty * 2, i, .4, e.m.upper, !0, { timber: !0 }), Zs(e, s, 1 + e.jetty * 2, r + e.jetty * 2, .8600000000000001, e.roofRise * 1.1), Bs(s, e, .34, -.12, .8600000000000001, .42), Us(s, e, .32, .48, r / 2);
		let c = new O();
		c.position.set(.1, .215, .41), t.add(c);
		for (let t of [-.3, .42]) I(.035, .4, .035, e.m.beam, t, 0, .1, c);
		let l = I(.8, .03, .3, e.m.roof, .06, .41, 0, c);
		l.rotation.x = .3, I(.36, .03, .08, e.m.wood, .02, .09, .08, c), uc(c, e, -.3, .36, .13), uc(c, e, .42, .36, .13);
		let u = new O();
		u.position.set(-.44, .215, .41), t.add(u);
		for (let t of [-1, 1]) I(.025, .32, .025, e.m.beam, t * .13, 0, 0, u);
		I(.3, .18, .025, e.m.wood, 0, .13, 0, u), I(.34, .03, .06, e.m.roof, 0, .31, 0, u);
		for (let [t, n] of [
			[-.08, .24],
			[.03, .19],
			[.09, .24],
			[-.02, .15]
		]) I(.05, .06, .03, e.m.paper, t, n, .004, u);
		Ws(t, e, a / 2 - .08, o / 2 - .05);
	},
	stiltinn(e, t, n) {
		let r = .2, i = 1.22, a = .56, o = .4, s = 1.48, c = .92;
		for (let n = 0; n < 5; n++) for (let r of [-.92 / 2, c / 2]) I(.05, .22, .05, e.m.beam, -1.48 / 2 + s * n / 4, -.02, r, t);
		for (let n of [-1.48 / 2, s / 2]) {
			let i = I(.02, .02, c * 1.05, e.m.beam, n, r * .45, 0, t);
			i.rotation.x = .35;
		}
		I(1.52, .035, .9600000000000001, e.m.wood, 0, r, 0, t);
		let l = new O();
		l.position.set(0, .23500000000000001, -.1), t.add(l), Xs(e, l, i, a, 0, o, e.m.lower, !0, { doorZ: -.2 }), Rs(l, e, {
			side: "z",
			wallW: i,
			wallD: a
		}, -.2, .2, .34, !1), Xs(e, l, i + e.jetty * 2, a + e.jetty * 2, o, .34, e.m.upper, !0, { timber: !0 }), Zs(e, l, i + e.jetty * 2, a + e.jetty * 2, .74, e.roofRise * 1.25), Bs(l, e, -.42, -.1, .74, .4), Bs(l, e, .44, -.1, .74, .34), Us(l, e, -.46, .46, a / 2), I(.02, .06, .012, F(null, "#e8d8a8"), -.46, .43, .34, l);
		let u = new O();
		u.position.set(0, .23500000000000001, a / 2 - .02), t.add(u);
		for (let t of [
			-.56,
			-.1,
			.36,
			.6
		]) I(.03, .2, .03, e.m.beam, t, 0, .12, u);
		I(1.2, .025, .025, e.m.beam, .02, .18, .12, u), I(.4, .03, .08, e.m.wood, .2, .09, .02, u), uc(u, e, -.2, .36, .1), uc(u, e, .6, .36, .1);
		for (let n = 0; n < 5; n++) I(.11, .012, .018, e.m.wood, s / 2 - .16, .16 - n * .045, .49, t);
		for (let n of [s / 2 - .22, s / 2 - .1]) I(.012, .23, .012, e.m.beam, n, -.02, .49, t);
		I(.22, .012, .1, F(null, "#6a4a3a"), -.3, .6600000000000001, .4, t);
	},
	cistern(e, t, r) {
		for (let [n, r] of [
			[-.12, -.12],
			[.12, -.12],
			[-.12, .12],
			[.12, .12]
		]) I(.03, .14, .03, e.m.beam, n, 0, r, t);
		let i = new k(new D(.15, .14, .2, 12), e.m.wood);
		i.position.set(0, .24, 0), t.add(i);
		for (let r of [.17, .31]) {
			let i = new k(new n(.152, .008, 4, 14), e.m.trim);
			i.rotation.x = Math.PI / 2, i.position.y = r, t.add(i);
		}
		for (let n of [-1, 1]) I(.025, .34, .025, e.m.beam, n * .17, .14, 0, t);
		let a = I(.42, .025, .3, e.m.roof, 0, .5, 0, t);
		a.rotation.x = .15, I(.012, .012, .12, e.m.trim, .17, .4, .06, t);
	},
	punt(e, t, n) {
		I(.18, .025, .56, e.m.wood, 0, 0, 0, t);
		for (let n of [-1, 1]) I(.02, .06, .56, e.m.beam, n * .09, 0, 0, t);
		for (let n of [-1, 1]) I(.18, .05, .02, e.m.beam, 0, 0, n * .28, t);
		let r = I(.012, .012, .7, e.m.beam, .05, .05, .02, t);
		r.rotation.y = .08;
	},
	eeltrap(e, t, n) {
		I(.025, .36, .025, e.m.beam, 0, -.02, 0, t);
		let r = F(null, "#6a5a38");
		for (let [e, n] of [[.06, .3], [.16, -.4]]) {
			let i = new k(new nt(.045, .2, 7, 1, !0), r);
			i.position.set(.06, e, 0), i.rotation.z = Math.PI / 2 + n * .3, t.add(i);
		}
	},
	landing(e, t, n) {
		let r = .25;
		for (let n of [-1, 1]) {
			I(.06, .62, .06, e.m.beam, 0, -.02, n * r, t), I(.09, .03, .09, e.m.trim, 0, .6, n * r, t), uc(t, e, .02, .8200000000000001, n * r);
			let i = I(.025, .2, .025, e.m.beam, 0, .4, n * .16999999999999998, t);
			i.rotation.x = n * .7;
		}
		I(.07, .06, .64, e.m.beam, 0, .56, 0, t);
		for (let n of [-1, 1]) I(.008, .08, .008, e.m.trim, .02, .48, n * .12, t);
		I(.03, .12, .3, e.m.signboard, .02, .36, 0, t);
		let i = new k(new me(1, 8, 4), F(null, "#b8a060"));
		i.scale.set(.008, .022, .11), i.position.set(.04, .42, 0), i.rotation.x = .2, t.add(i);
	},
	ferrystage(e, t, n) {
		let r = .86, i = .22;
		for (let n of [-1, 1]) {
			I(.07, r, .07, e.m.beam, n * i, r / 2 - .02, 0, t), I(.1, .03, .1, e.m.trim, n * i, .85, 0, t), uc(t, e, n * i, 1.06, 0), uc(t, e, n * .28, .46, .02);
			let a = I(.025, .2, .025, e.m.beam, n * .14, .6599999999999999, 0, t);
			a.rotation.z = -n * .7;
		}
		I(.6, .06, .08, e.m.beam, 0, .82, 0, t);
		for (let n of [-1, 1]) I(.008, .08, .008, e.m.trim, n * .12, .74, .02, t);
		I(.32, .2, .03, F(null, "#1a181e"), 0, .59, .02, t), I(.05, .14, .034, F(null, "#c8d0dc"), 0, .59, .02, t), I(.08, .025, .034, F(null, "#c8d0dc"), 0, .6599999999999999, .02, t);
		let a = new k(new me(1, 8, 4, 0, Math.PI * 2, 0, Math.PI * .6), F(null, "#8a7a48"));
		a.scale.set(.045, .06, .045), a.position.set(.32, .72, 0), t.add(a);
	},
	boathall(e, t, n) {
		let r = (e, t, n) => e > .5 ? L(cc.grass, .72 + n * .2) : L(ic("#3e352a"), .8 + n * .2), i = new me(.8, 12, 5, 0, Math.PI * 2, 0, Math.PI / 2);
		i.scale(1.2, .3, 1);
		let a = new k(ac(i, n, .05, r), oc());
		a.position.set(-.05, 0, -.1), t.add(a);
		let o = (r, i, a, o, s, c, l = 0, u = 1) => {
			let d = new O();
			d.position.set(r, i, a), d.rotation.set(0, c, l), t.add(d);
			let f = new me(1, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2);
			f.scale(s, s * .8, o);
			let p = F(P("planks", "#" + new A("#77705f").multiplyScalar(u).getHexString(), 61 + Math.floor(n() * 9)));
			d.add(new k(f, p)), I(.025, .03, o * 1.7, e.m.beam, 0, s * .78, 0, d);
			for (let t of [-1, 1]) I(.02, .05, .02, e.m.beam, 0, s * .7, t * o * .88, d);
			return d;
		};
		I(.82, .16, .7, e.m.wood, 0, .12, -.12, t), o(-.26, .26, -.12, .44, .17, 0, 0, .9), o(.02, .28, -.1, .5, .19, 0), o(.3, .25, -.14, .42, .16, 0, 0, .85), I(.2, .24, .06, F(null, "#0c0a0c"), .02, .1, .24, t), I(.26, .03, .08, e.m.wood, .02, .34, .25, t);
		for (let n of [-1, 1]) {
			let r = I(.022, .34, .02, e.m.beam, .02 + n * .13, .1, .25, t);
			r.rotation.z = -n * .12;
			let i = I(.05, .08, .012, e.m.wood, .02 + n * .15, .4, .25, t);
			i.rotation.z = -n * .12;
		}
		I(.02, .6, .02, e.m.beam, .3, .06, .32, t);
		let s = I(.012, .08, .012, e.m.trim, .33, .62, .32, t);
		s.rotation.z = -.8;
		let c = F(null, "#a8843a");
		I(.09, .03, .09, c, .3, .66, .32, t);
		for (let [e, n] of [
			[-.035, -.035],
			[.035, -.035],
			[-.035, .035],
			[.035, .035]
		]) I(.016, .04, .016, c, .3 + e, .69, .32 + n, t);
		uc(t, e, -.2, .34, .3), o(-.72, .1, .2, .36, .13, .9, 1.25, .8), o(.72, .1, -.3, .32, .12, -.5, -1.2, .75), o(-.5, .08, -.7, .3, .12, .2, 1.3, .7), I(.16, .025, .44, e.m.wood, .6, 0, .42, t).rotation.y = -.6;
		for (let [r, i, a] of [
			[
				-.62,
				.52,
				.26
			],
			[
				-.45,
				.62,
				.2
			],
			[
				.78,
				.1,
				.24
			]
		]) {
			let o = new k(new nt(.02, a, 5), e.m.beam);
			o.position.set(r, a / 2, i), o.rotation.z = (n() - .5) * .4, t.add(o);
		}
		let l = F(null, "#6a6a3e");
		for (let [e, r] of [
			[-.86, -.1],
			[.9, .36],
			[-.2, .7],
			[.4, -.78]
		]) for (let i = 0; i < 6; i++) {
			let i = new k(new D(.003, .009, .1 + n() * .06, 3), l);
			i.position.set(e + (n() - .5) * .08, .05, r + (n() - .5) * .08), i.rotation.set((n() - .5) * .7, 0, (n() - .5) * .7), t.add(i);
		}
	},
	lockhall(e, t, n) {
		let r = .7, i = .56, a = e.m.ashlar;
		I(.7799999999999999, .06, .64, e.m.stoneDark, 0, 0, 0, t), Xs(e, t, r, i, .06, .5, a, !0, { doorZ: -.08 }), Rs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, -.08, .2, .36, !0), Zs(e, t, r, i, .56, e.roofRise * .9, !0), Bs(t, e, .2, -.12, .56, .3);
		let o = new O();
		o.position.set(-.7 / 2 - .02, 0, -.56 / 2 + .12), t.add(o), I(.24, .82, .24, a, 0, 0, 0, o), ks(o, .28, .82, .22, e.m.roof), As(o, e, {
			side: "z",
			wallW: .24,
			wallD: .24
		}, 0, .6, .06, .12, { lit: !0 });
		let s = new O();
		s.position.set(.6499999999999999, 0, .1), t.add(s), I(.34, .12, .3, a, 0, 0, 0, s);
		let c = new k(new D(.05, .06, .16, 10), e.m.wood);
		c.position.set(0, .2, 0), s.add(c);
		for (let t = 0; t < 4; t++) {
			let n = I(.3, .018, .018, e.m.beam, 0, .25, 0, s);
			n.rotation.y = t * Math.PI / 4;
		}
		for (let t = 0; t < 6; t++) I(.02, .02, .03, e.m.trim, .1 + t * .03, .16 - t * .022, 0, s);
		let l = I(.62, .06, .07, e.m.beam, .34, .14, .06, s);
		l.rotation.y = -.3;
		let u = new O();
		u.position.set(.36, .03, .5), u.rotation.set(-Math.PI / 2 + .1, .5, 0), t.add(u), I(.4, .5, .04, e.m.wood, 0, 0, 0, u);
		for (let t of [
			.08,
			.25,
			.42
		]) I(.42, .03, .05, e.m.trim, 0, t, 0, u);
		uc(t, e, .14, .34, .32), Ws(t, e, -.3, .4);
	},
	vats(e, t, r) {
		let i = e.m.ashlar, a = F(null, "#5a8a3a"), o = F(null, "#0e0c0c");
		I(1.3, .03, 1, e.m.stoneDark, 0, 0, -.05, t);
		let s = (s, c, l, u) => {
			let d = new k(new D(l, l * 1.05, .26, 14), i);
			d.position.set(s, .13, c), t.add(d);
			for (let r of [.06, .2]) {
				let i = new k(new n(l * 1.02, .012, 4, 18), e.m.trim);
				i.rotation.x = Math.PI / 2, i.position.set(s, r, c), t.add(i);
			}
			let f = new k(new D(l * .92, l * .92, .01, 14), u ? a : o);
			if (f.position.set(s, u ? .266 : .262, c), u && (f.userData.glow = !0), t.add(f), u) for (let e = 0; e < 3; e++) {
				let e = I(.03, .12 + r() * .08, .012, a, s + (r() - .5) * l, .04, c + l * .98, t);
				e.rotation.y = (r() - .5) * .5;
			}
		};
		s(-.36, -.3, .26, !0), s(.32, -.36, .24, !0), s(.42, .24, .2, !0), s(-.14, .24, .24, !1);
		for (let n = 0; n < 6; n++) I(.012, .02, .07, e.m.wood, -.14, .23 - n * .035, .48 - n * .005, t);
		for (let n of [-1, 1]) {
			let r = I(.014, .28, .014, e.m.beam, -.14 + n * .04, .02, .48, t);
			r.rotation.x = -.25;
		}
		let c = (n, r, i, a) => {
			let o = Math.hypot(i - n, a - r), s = new k(new D(.025, .025, o, 8), e.m.trim);
			s.rotation.set(0, -Math.atan2(a - r, i - n), Math.PI / 2), s.position.set((n + i) / 2, .3, (r + a) / 2), t.add(s);
		};
		c(-.36, -.3, .32, -.36), c(.32, -.36, .42, .24);
		let l = new k(new n(.05, .008, 4, 10), e.m.trim);
		l.position.set(0, .33, -.33), t.add(l), I(.02, .62, .02, e.m.beam, .12, .02, .5, t);
		let u = new k(new D(.04, .04, .08, 6, 1, !0), e.m.trim);
		u.position.set(.12, .6, .54), t.add(u), uc(t, e, -.42, .34, .4);
		let d = F(null, "#5e6a3a");
		for (let [e, n] of [
			[-.66, .36],
			[.68, -.1],
			[.66, .5]
		]) for (let i = 0; i < 6; i++) {
			let i = new k(new D(.003, .009, .1 + r() * .06, 3), d);
			i.position.set(e + (r() - .5) * .08, .05, n + (r() - .5) * .08), i.rotation.set((r() - .5) * .7, 0, (r() - .5) * .7), t.add(i);
		}
	},
	abbey(e, t, n) {
		let r = e.m.ashlar, i = .7, a = 1.3, o = .86, s = new O();
		s.position.set(.05, -.1, -.2), s.rotation.set(.03, 0, -.04), t.add(s), I(i, o, a, r, 0, 0, 0, s);
		for (let t = 0; t < 4; t++) As(s, e, {
			side: "x",
			wallW: i,
			wallD: a
		}, -1.3 / 2 + a * (t + .5) / 4, o * .62, .08, .3, {
			pointed: !0,
			lit: t === 1
		});
		$s(e, s, i, a, o), Os(s, i, a, o, e.roofRise * i / 2 * 1.5, e.m.roof, r, .06, .04);
		let c = new O();
		c.position.set(-.1, -.08, a / 2 - .1), c.rotation.z = .03, t.add(c), I(.36, 1.36, .34, r, 0, 0, 0, c), Rs(c, e, {
			side: "z",
			wallW: .36,
			wallD: .34
		}, 0, .18, .36, !0), As(c, e, {
			side: "z",
			wallW: .36,
			wallD: .34
		}, 0, .98, .1, .2, {
			pointed: !0,
			lit: !1
		}), As(c, e, {
			side: "x",
			wallW: .36,
			wallD: .34
		}, 0, .98, .1, .2, {
			pointed: !0,
			lit: !1
		}), Vs(c, e, .36, .34, 1.36, r, .06);
		let l = new k(new D(.04, .07, .09, 10), F(null, "#6a5a3a"));
		l.position.set(0, 1, .12), c.add(l);
		let u = new O();
		u.position.set(.55, -.06, .1), t.add(u);
		for (let e = 0; e < 4; e++) I(.07, e === 3 ? .14 : .42, .07, r, 0, 0, -.4 + e * .26, u);
		for (let e = 0; e < 2; e++) I(.07, .06, .3, r, 0, .42, -.27 + e * .26, u);
		I(.16, .07, .12, r, .1, 0, .5, u).rotation.y = .5;
		let d = F(null, "#2c3e3e");
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
			let a = new k(new D(.5, .5, .004, 18), d);
			a.scale.set(r, 1, i), a.position.set(e, .002, n), t.add(a);
		}
		rc(t, n, -.62, .35, .9), I(.03, .34, .03, e.m.beam, .14, 0, .62, t), uc(t, e, .14, .36, .62);
	},
	priory(e, t, n) {
		let r = e.m.ashlar, i = new me(.9, 12, 4, 0, Math.PI * 2, 0, Math.PI / 2);
		i.scale(1.15, .16, 1), t.add(new k(ac(i, n, .03, (e, t, n) => e > .6 ? L(cc.grass, .72 + n * .18) : L(cc.base, .78 + n * .2)), oc()));
		let a = new O();
		a.position.set(-.12, .1, -.05), t.add(a);
		let o = .46, s = .8, c = .5;
		I(o, c, s, r, 0, 0, 0, a);
		for (let t = 0; t < 3; t++) As(a, e, {
			side: "x",
			wallW: o,
			wallD: s
		}, -.8 / 2 + s * (t + .5) / 3, c * .6, .07, .2, {
			pointed: !0,
			lit: t === 2
		});
		As(a, e, {
			side: "z",
			wallW: o,
			wallD: s
		}, 0, c * .7, .1, .2, {
			pointed: !0,
			lit: !0
		}), Os(a, o, s, c, e.roofRise * o / 2 * 1.4, e.m.roof, r, .06, .04), I(.08, .14, .06, r, 0, .78, s / 2 - .03, a), I(.22, .2, .05, F(null, "#0c0a0c"), 0, -.04, .42000000000000004, a), I(.16, .17, .012, e.m.door, 0, -.02, .45, a);
		for (let t of [.02, .1]) I(.17, .014, .015, e.m.trim, 0, t, .458, a);
		for (let e of [-1, 1]) I(.04, .22, .06, r, e * .12, -.04, .44, a);
		for (let e = 0; e < 3; e++) I(.26, .025, .07, r, 0, -.08 + e * .03, .56 - e * .05, a);
		let l = new O();
		l.position.set(.42, .1, -.26), t.add(l), Xs(e, l, .36, .5, 0, .36, e.m.upper, !0, {}), Zs(e, l, .36, .5, .36, e.roofRise, !1);
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
		]) I(i, .12, .05, r, e, .08, n, t).rotation.y = a;
		uc(t, e, .12, .42, .42), rc(t, n, .66, -.62, .8);
	},
	watermill(e, t, r) {
		let i = .62, a = .5, o = .36;
		Xs(e, t, i, a, 0, o, e.m.stone, !0, { doorZ: -.1 }), Xs(e, t, i, a, o, .3, e.m.upper, !0, { timber: !0 }), Rs(t, e, {
			side: "z",
			wallW: i,
			wallD: a
		}, -.1, .16, .3, !0), Zs(e, t, i, a, .6599999999999999, e.roofRise * 1.25, !0), Bs(t, e, -.18, -.1, .6599999999999999, .34);
		let s = new O();
		s.position.set(.4, .2, .02), t.add(s);
		let c = .24, l = e.m.wood;
		for (let t of [-.07, .07]) {
			let r = new k(new n(c, .018, 5, 18), e.m.beam);
			r.rotation.y = Math.PI / 2, r.position.x = t * 0, r.position.z = t, r.rotation.set(0, 0, 0), r.position.set(0, 0, t), s.add(r);
		}
		for (let e = 0; e < 12; e++) {
			let t = e / 12 * Math.PI * 2, n = new k(new M(.02, .09, .16), l);
			n.position.set(0, Math.sin(t) * c, 0), n.position.x = Math.cos(t) * c, n.rotation.z = t, s.add(n);
		}
		s.rotation.y = Math.PI / 2;
		let u = new k(new D(.035, .035, .22, 8), e.m.trim);
		u.rotation.x = Math.PI / 2, u.position.set(.4, .2, .02), u.rotation.set(0, 0, Math.PI / 2), t.add(u), I(.2, .01, .9, F(null, "#2e5a78"), .4, 0, .02, t);
		for (let n of [-1, 1]) I(.03, .06, .9, e.m.stoneDark, .4 + n * .115, 0, .02, t);
		I(.24, .16, .03, e.m.wood, .4, 0, -.4, t);
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
		]) pc(t, e, n, r, i * 1.2, i * 2);
		let d = new O();
		d.position.set(-.46, 0, .3), d.rotation.y = .5, t.add(d);
		let f = F(null, "#221a16");
		I(.26, .05, .16, f, 0, .06, 0, d);
		for (let e of [-1, 1]) {
			let t = new k(new n(.06, .012, 4, 10), f);
			t.position.set(.02, .06, e * .09), d.add(t);
		}
		I(.012, .44, .012, e.m.beam, .3, 0, .34, t), I(.1, .06, .006, F(null, "#8a2a20"), .35, .36, .34, t), uc(t, e, -.24, .3, .3);
	},
	chapelruin(e, t, n) {
		let r = -.12, i = .56, a = .92, o = .86, s = F(P("ashlar", "#a29c8e", 31)), c = F(P("rubble", "#4e5a3c", 32)), l = F(P("slate", "#454a55", 33)), u = F(null, "#08080b"), d = new k(new D(.5, .5, .004, 18), F(null, "#1e2c30"));
		d.scale.set(1.4, 1, .95), d.position.set(0, r, -.12), d.userData.bakeOnly = d.userData.dress = !0, t.add(d);
		let f = new O();
		f.position.set(0, -.42, -.12), f.rotation.set(.05, .06, -.13), t.add(f), I(i, o, a, s, 0, 0, 0, f), I(.5720000000000001, .4, .932, c, 0, 0, 0, f);
		for (let e of [-1, 1]) for (let t = 0; t < 3; t++) I(.07, o * .78, .08, s, e * .31500000000000006, 0, -.92 / 2 + .16 + t * .3, f);
		for (let e of [-1, 1]) for (let t = 0; t < 3; t++) {
			let n = I(.012, .22, .08, u, e * .28200000000000003, .36, -.92 / 2 + .31 + t * .3, f), r = new k(new nt(.057, .06, 4, 1), u);
			r.scale.set(.2, 1, 1), r.position.set(e * .28200000000000003, .61, -.92 / 2 + .31 + t * .3), r.rotation.y = Math.PI / 4, f.add(r), n.userData.dark = !0;
		}
		let p = .34, m = new O();
		m.position.z = a / 4, f.add(m), Os(m, a / 2, i, o, p, l, s, .05, .035), m.rotation.y = Math.PI / 2;
		for (let t = 0; t < 4; t++) for (let n of [-1, 1]) {
			let r = I(Math.hypot(i / 2, p) + .04, .022, .022, e.m.beam, n * i / 4, 1.01, -.04 - t * .12, f);
			r.rotation.z = -n * Math.atan2(p, i / 2), t === 3 && n > 0 && (r.rotation.y = .5);
		}
		I(.03, .03, .5, e.m.beam, 0, 1.18, -.92 / 4, f);
		let h = new O();
		h.position.set(0, 1.17, a / 2 - .03), f.add(h);
		for (let e of [-1, 1]) I(.04, .16, .07, s, e * .055, 0, 0, h);
		I(.17, .035, .08, s, 0, .16, 0, h), I(.07, .12, .072, u, 0, .02, 0, h);
		{
			let e = new k(new nt(.075, .07, 4, 1), l);
			e.position.y = .23, e.rotation.y = Math.PI / 4, h.add(e);
		}
		let g = I(.17, .3, .06, u, 0, .39999999999999997, a / 2 - .02, f);
		{
			let e = new k(new D(.085, .085, .06, 10, 1, !1, 0, Math.PI), u);
			e.rotation.set(Math.PI / 2, 0, Math.PI / 2), e.position.set(0, .7, a / 2 - .02), f.add(e), g.userData.dark = !0;
		}
		let _ = new O();
		_.position.set(0, 0, .34 + .13), t.add(_), I(.34, .23, .26, s, 0, -.2, 0, _);
		for (let e = 0; e < 2; e++) I(.3, .025, .06, s, 0, .005 - e * .025, .16 + e * .05, _);
		for (let e of [-1, 1]) I(.05, .26, .24, s, e * .15, .03, -.01, _);
		for (let e of [-1, 1]) {
			let t = I(.21, .02, .3, l, e * .085, .32, -.01, _);
			t.rotation.z = e * -.6;
		}
		I(.012, .15, .16, u, .28400000000000003, .32, .18, f);
		for (let n = 0; n < 3; n++) {
			let r = I(.36, .012, .045, e.m.wood, .5 + n * .002, -.108, .2 + n * .05, t);
			r.rotation.y = .55;
		}
		for (let e = 0; e < 5; e++) {
			let e = lc(n, .025 + n() * .02, .6);
			e.position.set(.36 + n() * .12, r, 0 + n() * .2), t.add(e);
		}
		{
			let e = new k(ac(sc(.14, .09, 7, 2), n, .02, (e, t, n) => L(ic("#4a4034"), .85 + n * .2)), oc());
			e.position.set(.62, .045, .62), t.add(e);
		}
		I(.2, .014, .06, e.m.wood, -.33, .07, .66, t);
		for (let n of [-1, 1]) I(.014, .07, .05, e.m.beam, -.33 + n * .08, 0, .66, t);
		let v = F(P("thatch", "#9a8250", 34));
		for (let e = 0; e < 3; e++) {
			let n = new k(new me(.035, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2), v);
			n.scale.set(1, 1.25, 1), n.position.set(-.4 + e * .07, .084, .66), t.add(n);
		}
		uc(t, e, .21, .24, .8);
		let y = F(null, "#5e6e3e");
		for (let [e, i] of [
			[.68, 0],
			[.66, .36],
			[-.66, .28],
			[-.6, -.4],
			[.5, -.6],
			[-.22, .56],
			[.36, .52]
		]) for (let a = 0; a < 5; a++) {
			let a = new k(new D(.003, .009, .1 + n() * .07, 3, 1, !0), y);
			a.position.set(e + (n() - .5) * .07, (i > .48 ? 0 : r) + .05, i + (n() - .5) * .07), a.rotation.set((n() - .5) * .7, 0, (n() - .5) * .7), t.add(a);
		}
		I(.16, .08, .11, s, -.48, -.15, -.1, t).rotation.y = .6;
	},
	wagon(e, t, r) {
		let i = e.m.wood, a = F(null, "#3e2e22"), o = e.m.trim, s = new O();
		s.position.set(0, .09, 0), s.rotation.set(0, .35, 1.32), t.add(s), I(.4, .025, .2, i, 0, -.012, 0, s);
		for (let e of [-1, 1]) I(.4, .07, .015, i, 0, .01, e * .095, s);
		I(.015, .07, .2, i, -.195, .01, 0, s);
		for (let e = 0; e < 4; e++) I(.012, .075, .205, a, -.15 + e * .1, .008, 0, s);
		let c = (e, t, r, s, c, l) => {
			let u = new O();
			u.position.set(t, r, s), u.rotation.set(c, l, 0), e.add(u);
			let d = new k(new n(.07, .01, 5, 14), a);
			u.add(d);
			for (let e = 0; e < 6; e++) {
				let t = I(.006, .13, .006, i, 0, -.065, 0, u);
				t.rotation.z = e / 6 * Math.PI, t.position.set(0, 0, 0);
			}
			let f = new k(new D(.018, .018, .03, 8), o);
			f.rotation.x = Math.PI / 2, u.add(f);
		};
		c(s, -.12, -.06, .11, 0, 0), c(s, .13, -.06, .11, 0, 0), c(s, -.12, -.06, -.11, 0, 0), c(t, .3, .012, .18, Math.PI / 2, 0);
		let l = I(.32, .016, .016, a, -.34, .01, .12, t);
		l.rotation.y = -.4, I(.12, .016, .016, a, -.26, .01, -.02, t).rotation.set(0, .2, .25);
		for (let [e, a, s] of [
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
			let c = new k(new D(.045, .04, .1, 10), i);
			c.position.set(e, s ? .045 : .05, a), s && c.rotation.set(Math.PI / 2, 0, r() * 2), t.add(c);
			for (let e of [-.03, .03]) {
				let t = new k(new n(.044, .004, 3, 12), o);
				t.rotation.x = Math.PI / 2, t.position.y = e, c.add(t);
			}
		}
		pc(t, e, -.06, .26, 1.1, 1.3), pc(t, e, .34, .22, .9, .4);
		let u = I(.09, .07, .09, i, -.2, 0, .24, t);
		u.rotation.y = .5;
		for (let e = 0; e < 4; e++) {
			let e = lc(r, .015 + r() * .01, .5);
			e.position.set(-.3 + r() * .7, 0, -.2 + r() * .5), t.add(e);
		}
	},
	warren(e, t, n) {
		let r = new O();
		r.rotation.y = .45, t.add(r);
		let i = (e, t, n) => e > .62 ? L(cc.grass, .78 + n * .22) : e > .3 ? L(cc.light, .82 + n * .14) : L(cc.base, .78 + n * .16), a = (e, t, a, o, s, c, l, u = i, d = r) => {
			let f = ac(new M(e, t, a, 2, 2, 1), n, l, u), p = new k(f, oc());
			return p.position.set(o, s + t / 2, c), d.add(p), p;
		}, o = (e, t, i, a, o, s = 1.25) => {
			let c = sc(i, a, o, 3);
			c.translate(0, a / 2, 0);
			let l = new k(ac(c, n, i * .14, (e, t, n) => e > .8 || e > .7 && n > .4 ? L(cc.grass, .82 + n * .2) : L(cc.base, .8 + n * .16)), oc());
			l.position.set(e, 0, t), l.rotation.y = n() * 6, l.scale.set(s, 1, 1), r.add(l);
		};
		{
			let e = new me(1, 10, 4, 0, Math.PI * 2, 0, Math.PI / 2);
			e.scale(1.15, .84, .9);
			let t = new k(ac(e, n, .1, (e, t, n) => e > .78 || e > .66 && n > .45 ? L(cc.grass, .82 + n * .2) : L(cc.base, .8 + n * .16)), oc());
			t.position.set(0, 0, -1.22), r.add(t);
		}
		o(-.74, -.86, .6, .56, 8, 1.1), o(.76, -.9, .62, .6, 8, 1.1);
		let s = .46, c = .62, l = 0, u = (e, t, r, i, o, s = 0) => {
			let c = [
				.86,
				.74,
				.92,
				.8
			][l++ % 4], u = a(t - e, i - .012, .3 + n() * .08, (e + t) / 2, r, o - .17, .034, (e, t, n) => e > .62 ? L(cc.grass, .82 + n * .2) : L(cc.base, c + n * .12));
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
			let n = I(t, .035, .2, F(null, "#3e4a2a"), e, e === 0 ? .98 : .82, e === 0 ? -.1 : -.12, r);
			n.rotation.x = .12;
		}
		for (let e = 0; e < 9; e++) {
			let t = -.6 + e * .15 + (n() - .5) * .05, i = I(.025, .05 + n() * .07, .012, F(null, "#3a4426"), t, (Math.abs(t) < .32 ? .9199999999999999 : .76) - n() * .03, 0, r);
			i.rotation.z = (n() - .5) * .5;
		}
		let d = F(null, "#1c1a1c");
		I(.04, c, .32, d, -.46 / 2 + .02, 0, -.16, r), I(.04, c, .32, d, s / 2 - .02, 0, -.16, r), I(s, .04, .32, d, 0, .58, -.16, r), I(s, .01, .32, F(null, "#2a2622"), 0, 0, -.16, r), I(s, c, .02, F(null, "#060506"), 0, 0, -.32, r);
		let f = (e, t, n = 0, i = !1) => {
			let a = F(null, "#" + new A("#5a4632").multiplyScalar(t).getHexString());
			for (let t of [-1, 1]) {
				let i = I(.065, .6, .065, a, t * (s / 2 - .035), 0, e, r);
				i.rotation.z = t * .05 + (t < 0 ? n : 0);
			}
			let o = I(.5800000000000001, .07, .08, a, 0, .55, e, r);
			return o.rotation.z = n * .8, i && I(.07, .05, .3, a, -.12, 0, e - .1, r).rotation.set(.1, .4, .05), a;
		};
		f(-.12, .45), f(-.24, .26, 0, !0);
		let p = new k(new M(.08, .035, .05), e.m.glass);
		p.userData.glow = !0, p.position.set(.05, .02, -.28), r.add(p);
		let m = f(.02, 1, -.06);
		for (let e = 0; e < 4; e++) {
			let t = I(.54 - e * .04, .035, .03, m, (n() - .5) * .03, .625 + e * .04, -.01 - e * .02, r);
			t.rotation.z = -.04 + (n() - .5) * .04;
		}
		let h = F(null, "#6a5640"), g = I(.32, .04, .018, h, -.07, .18, .07, r);
		g.rotation.z = .5;
		let _ = I(.26, .04, .018, h, .1, .06, .075, r);
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
			let i = I(.3, .012, .045, h, e, 0, t, r);
			i.rotation.y = n;
		}
		let v = F(null, "#d8ccb0"), y = I(.075, .055, .12, v, .03, .57, .1, r);
		y.rotation.x = -.6;
		for (let e of [-1, 1]) I(.016, .014, .01, F(null, "#140c08"), .03 + e * .022, .62, .155, r);
		let b = F(null, "#5a3a28"), x = F(null, "#3e3226");
		for (let e = 0; e < 7; e++) {
			if (e === 3 || e === 5) continue;
			let t = I(.3, .018, .045, x, (n() - .5) * .02, 0, -.26 + e * .12, r);
			t.rotation.y = (n() - .5) * .18;
		}
		I(.018, .022, .86, b, -.09, .018, .12, r), I(.018, .022, .56, b, .09, .018, -.02, r), I(.018, .022, .24, b, .1, .03, .24, r).rotation.set(-.35, .12, 0);
		let S = new O();
		S.position.set(.42, .11, .42), S.rotation.set(0, -.5, Math.PI / 2 - .15), r.add(S);
		let C = F(null, "#4a3a2c");
		I(.2, .012, .26, C, 0, -.08, 0, S);
		for (let e of [-1, 1]) I(.012, .15, .26, C, e * .1, -.08, 0, S);
		for (let e of [-1, 1]) I(.2, .15, .012, C, 0, -.08, e * .13, S);
		for (let [e, t] of [
			[-.07, -.09],
			[.07, -.09],
			[-.07, .09],
			[.07, .09]
		]) {
			let n = new k(new D(.04, .04, .02, 8), b);
			n.rotation.z = Math.PI / 2, n.position.set(e * 1.6, -.11, t), S.add(n);
		}
		for (let e = 0; e < 6; e++) {
			let e = lc(n, .025 + n() * .015, .6);
			e.position.set(.28 + n() * .16, 0, .5 + n() * .16), r.add(e);
		}
		let w = new k(ac(sc(.42, .24, 9, 2).translate(0, .12, 0), n, .05, (e, t, n) => t > .16 && e > .6 ? L(cc.grass, .8 + n * .2) : L(cc.scree, .7 + n * .18)), oc());
		w.position.set(.86, 0, .22), w.scale.set(1, 1, .75), r.add(w);
		let T = new O();
		T.position.set(-.6, 0, .2), T.rotation.y = .25, r.add(T);
		let E = F(null, "#5e5446"), ee = F(null, "#8a7a60");
		for (let [e, t] of [[0, 3], [1, 2]]) for (let n = 0; n < t; n++) {
			let r = new k(new D(.04, .042, .42, 7), E);
			r.rotation.z = Math.PI / 2, r.position.set(0, .04 + e * .072, (n - (t - 1) / 2) * .085), T.add(r);
			let i = new k(new D(.036, .036, .004, 7), ee);
			i.rotation.z = Math.PI / 2, i.position.set(.212, r.position.y, r.position.z), T.add(i);
		}
		let te = new k(new D(.04, .042, .4, 7), E);
		te.rotation.set(0, .8, Math.PI / 2), te.position.set(.08, .04, .24), T.add(te), I(.035, .66, .035, e.m.beam, -.4, 0, .3, r);
		let ne = I(.07, .06, .13, v, -.4, .62, .33, r);
		ne.rotation.x = -.4;
		let re = I(.11, .16, .006, F(null, "#4e6a2e"), -.36, .4, .32, r);
		re.rotation.z = -.15;
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
			let a = new k(new nt(.022, n, 5), F(null, "#5a4430"));
			a.position.set(e, n / 2, t), a.rotation.set(.3, 0, i), r.add(a);
		}
		for (let e = 0; e < 7; e++) {
			let t = e / 7 * Math.PI * 2, i = lc(n, .026, .6);
			i.position.set(-.32 + Math.cos(t) * .08, 0, .66 + Math.sin(t) * .06), r.add(i);
		}
		let ie = new k(new M(.06, .03, .05), e.m.glass);
		ie.userData.glow = !0, ie.position.set(-.32, .015, .66), r.add(ie);
		for (let e = 0; e < 5; e++) {
			let e = I(.05, .01, .012, v, -.15 + n() * .4, 0, .5 + n() * .3, r);
			e.rotation.y = n() * 3;
		}
		for (let e = 0; e < 5; e++) {
			let e = n() * 6.28, t = lc(n, .07 + n() * .06, .7);
			t.position.set(Math.cos(e) * .95, 0, -.2 + Math.sin(e) * .35), r.add(t);
		}
	},
	milestone(e, t, n) {
		let r = F(P("ashlar", "#6a6458", 41)), i = F(null, "#2a2620");
		I(.2, .05, .2, r, 0, 0, 0, t);
		let a = new k(new D(.06, .075, .34, 10), r);
		a.position.set(0, .22, 0), a.rotation.z = .04, t.add(a);
		let o = new k(new me(.062, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), r);
		o.position.set(.006, .39, 0), t.add(o), I(.008, .08, .004, i, -.03, .2, .072, t);
		for (let e of [-1, 1]) {
			let n = I(.008, .1, .004, i, .02, .19, .072, t);
			n.rotation.z = e * .55;
		}
		I(.22, .02, .18, r, .04, 0, .2, t).rotation.set(.06, .2, .03);
		for (let e = 0; e < 3; e++) {
			let r = lc(n, .03 + n() * .02, .6);
			r.position.set(-.14 + e * .12, 0, -.14 + n() * .05), t.add(r);
		}
	},
	lumbermill(e, t, n) {
		let r = new O();
		r.position.set(-.05, 0, -.1), t.add(r);
		for (let [t, n] of [
			[-.45, -.3],
			[.45, -.3],
			[-.45, .3],
			[.45, .3],
			[0, -.3],
			[0, .3]
		]) I(.05, .55, .05, e.m.beam, t, 0, n, r);
		I(.95, .04, .05, e.m.beam, 0, .53, .3, r), I(.95, .04, .05, e.m.beam, 0, .53, -.3, r), I(.95, .5, .03, e.m.wood, 0, .05, -.31, r), Zs(e, r, .95, .62, .55, e.roofRise * .8), I(.55, .14, .14, e.m.wood, 0, 0, .02, r);
		let i = new k(new D(.06, .065, .62, 8), F(null, "#5a4430"));
		i.rotation.z = Math.PI / 2, i.position.set(0, .2, .02), r.add(i);
		let a = new k(new D(.11, .11, .01, 16), F(null, "#8a8a90"));
		a.rotation.x = Math.PI / 2, a.position.set(.12, .2, .1), r.add(a);
		let o = new O();
		o.position.set(.72, 0, .35), t.add(o);
		let s = F(null, "#4a3828");
		for (let [e, t] of [
			[0, 4],
			[1, 3],
			[2, 2]
		]) for (let n = 0; n < t; n++) {
			let r = new k(new D(.055, .055, .6, 8), s);
			r.rotation.x = Math.PI / 2, r.position.set((n - (t - 1) / 2) * .11, .055 + e * .095, 0), o.add(r);
			let i = new k(new D(.05, .05, .005, 8), F(null, "#9a7a52"));
			i.rotation.x = Math.PI / 2, i.position.set(r.position.x, r.position.y, .302), o.add(i);
		}
		for (let n = 0; n < 4; n++) I(.5, .025, .12, e.m.wood, -.72, n * .027, .42, t);
		for (let n = 0; n < 3; n++) I(.5, .025, .12, e.m.wood, -.72, n * .027, .56, t);
		let c = new O();
		c.position.set(-.75, 0, -.45), t.add(c), Xs(e, c, .42, .38, 0, .4, e.m.wood, !0, { doorZ: .1 }), Rs(c, e, {
			side: "z",
			wallW: .42,
			wallD: .38
		}, .1, .13, .28, !1), Zs(e, c, .42, .38, .4, e.roofRise), Bs(c, e, -.1, -.05, .4, .28);
		for (let [e, n] of [
			[.25, .7],
			[.5, .82],
			[-.2, .78]
		]) {
			let r = new k(new D(.06, .07, .08, 8), s);
			r.position.set(e, .04, n), t.add(r);
			let i = new k(new D(.058, .058, .005, 8), F(null, "#9a7a52"));
			i.position.set(e, .083, n), t.add(i);
		}
		I(.02, .16, .02, e.m.beam, .5, .08, .82, t).rotation.z = .5, uc(t, e, .5, .5, .36);
	}
});
function fc(e, t, n, r, i, a = 0, o = 0, s = !1) {
	let c = new O();
	c.position.set(a, 0, o), e.add(c), I(n, r, i, s ? t.m.door : t.m.wood, 0, 0, 0, c);
	let l = .018, u = t.m.beam;
	for (let [e, t] of [
		[-1, -1],
		[1, -1],
		[-1, 1],
		[1, 1]
	]) I(l, r + .004, l, u, e * (n / 2 - l / 2 + .002), 0, t * (i / 2 - l / 2 + .002), c);
	for (let e of [0, r - l]) I(n + .004, l, l, u, 0, e, i / 2 - l / 2 + .002, c), I(l, l, i + .004, u, n / 2 - l / 2 + .002, e, 0, c);
	let d = I(Math.hypot(n, r) * .92, l * .8, l * .6, u, 0, r / 2 - l / 2, i / 2 + .004, c);
	return d.rotation.z = Math.atan2(r, n), c;
}
function pc(e, t, n, r, i = 1, a = 0) {
	let o = [
		[0, 0],
		[.05, .005],
		[.062, .03],
		[.058, .07],
		[.04, .1],
		[.018, .115],
		[.022, .13],
		[0, .135]
	].map(([e, t]) => new qe(e * i, t * i)), s = new k(new Ze(o, 8), F(P("plaster", "#8a7858", 21)));
	s.position.set(n, 0, r), s.rotation.set(.15, a, 0), s.scale.set(1, 1, .8), e.add(s), I(.03 * i, .01 * i, .03 * i, t.m.trim, n, .105 * i, r, e);
}
Object.assign(ec, {
	barrel(e, t) {
		let n = [
			[0, 0],
			[.078, 0],
			[.09, .05],
			[.094, .105],
			[.09, .16],
			[.078, .21],
			[0, .21]
		].map(([e, t]) => new qe(e, t)), r = F(P("planks", "#5a4430", 22));
		r.map = r.map.clone(), r.map.repeat.set(3, .5), r.map.needsUpdate = !0, t.add(new k(new Ze(n, 10), r));
		for (let n of [.045, .165]) {
			let r = new k(new D(.093, .093, .014, 10), e.m.trim);
			r.position.y = n, t.add(r);
		}
		let i = new k(new D(.076, .076, .006, 10), e.m.door);
		i.position.y = .21, t.add(i);
	},
	crate_A_big(e, t) {
		fc(t, e, .22, .21, .22);
	},
	crate_A_small(e, t) {
		fc(t, e, .14, .14, .14);
	},
	crate_B_big(e, t) {
		fc(t, e, .22, .2, .22, 0, 0, !0), fc(t, e, .13, .12, .13, .02, .01).position.y = .2;
	},
	crate_long_A(e, t) {
		fc(t, e, .4, .14, .2, 0, 0, !0);
		for (let e = 0; e < 3; e++) {
			let n = new k(new D(.012, .012, .38, 5), F(null, "#7a7a80"));
			n.rotation.z = Math.PI / 2, n.position.set(0, .15, -.05 + e * .05), t.add(n);
		}
	},
	sack(e, t) {
		pc(t, e, 0, 0, 1), pc(t, e, .07, .06, .8, 1.2);
	},
	wheelbarrow(e, t) {
		let r = new O();
		r.position.set(0, .1, .02), r.rotation.x = -.08, t.add(r), I(.22, .012, .3, e.m.wood, 0, 0, 0, r);
		for (let t of [-1, 1]) {
			let n = I(.012, .09, .32, e.m.wood, t * .115, 0, 0, r);
			n.rotation.z = t * .25;
		}
		I(.24, .09, .012, e.m.wood, 0, 0, .16, r), I(.24, .09, .012, e.m.wood, 0, 0, -.16, r).rotation.x = .35;
		let i = new k(new D(.075, .075, .03, 12), e.m.wood);
		i.rotation.z = Math.PI / 2, i.position.set(0, .075, .24), t.add(i);
		let a = new k(new n(.075, .008, 4, 14), e.m.trim);
		a.rotation.y = Math.PI / 2, a.position.copy(i.position), t.add(a);
		for (let n of [-1, 1]) {
			let r = I(.018, .018, .5, e.m.beam, n * .08, .12, -.02, t);
			r.rotation.x = -.12, I(.018, .1, .018, e.m.beam, n * .08, 0, -.14, t);
		}
		for (let e = 0; e < 3; e++) {
			let n = lc(Ss(40 + e), .035, .7);
			n.position.set(-.05 + e * .05, .1, .02 + e % 2 * .04), t.add(n);
		}
	},
	weaponrack(e, t) {
		for (let n of [-1, 1]) {
			let r = I(.018, .26, .018, e.m.beam, n * .1, 0, 0, t);
			r.rotation.x = .08;
		}
		I(.24, .018, .02, e.m.beam, 0, .2, .01, t), I(.24, .018, .02, e.m.beam, 0, .05, .03, t);
		let n = F(null, "#8c8c94");
		for (let [r, i] of [
			[-.06, "spear"],
			[0, "sword"],
			[.06, "spear"]
		]) {
			let a = I(.01, i === "spear" ? .34 : .24, .01, i === "spear" ? e.m.wood : n, r, .03, .035, t);
			if (a.rotation.x = -.12, i === "spear") {
				let e = new k(new nt(.014, .05, 4), n);
				e.position.set(r, .39, 0), t.add(e);
			} else I(.06, .012, .014, e.m.trim, r, .08, .04, t);
		}
		let r = new k(new D(.07, .07, .015, 12), e.m.banner);
		r.rotation.x = Math.PI / 2 - .2, r.position.set(.14, .08, .06), t.add(r);
	},
	bucket_water(e, t) {
		let r = new k(new D(.065, .05, .1, 10, 1, !0), F(P("planks", "#5a4430", 23)));
		r.position.y = .05, r.material.side = 2, t.add(r);
		let i = new k(new D(.06, .06, .005, 10), F(null, "#23384a"));
		i.position.y = .085, t.add(i);
		let a = new k(new D(.05, .05, .006, 10), e.m.wood);
		a.position.y = .003, t.add(a);
		let o = new k(new n(.06, .005, 4, 12, Math.PI), e.m.trim);
		o.position.y = .1, t.add(o);
	},
	resource_lumber(e, t) {
		let n = F(null, "#4a3828"), r = F(null, "#9a7a52");
		for (let [e, i] of [
			[0, 4],
			[1, 3],
			[2, 2]
		]) for (let a = 0; a < i; a++) {
			let o = new k(new D(.045, .048, .66, 7), n);
			o.rotation.z = Math.PI / 2, o.position.set(0, .045 + e * .078, (a - (i - 1) / 2) * .09), t.add(o);
			for (let e of [-1, 1]) {
				let n = new k(new D(.042, .042, .004, 7), r);
				n.rotation.z = Math.PI / 2, n.position.set(e * .331, o.position.y, o.position.z), t.add(n);
			}
		}
		for (let n of [-1, 1]) I(.03, .2, .03, e.m.beam, n * .2, 0, .2, t);
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
		]) I(.14, .09, .1, n, e, r, i, t).rotation.y = a;
	},
	flag_red(e, t) {
		I(.014, .42, .014, e.m.beam, 0, 0, 0, t);
		let n = new k(new M(.005, .12, .18), e.m.banner);
		n.position.set(0, .35, .095), n.rotation.y = .15, t.add(n);
		let r = new k(new me(.014, 6, 4), e.m.trim);
		r.position.y = .425, t.add(r);
	},
	stump(e, t) {
		let r = Ss(77), i = F(null, "#3e3024"), a = new k(new D(.07, .09, .1, 8), i);
		a.position.y = .05, t.add(a);
		let o = new k(new D(.068, .068, .005, 8), F(null, "#9a7a52"));
		o.position.y = .1, t.add(o);
		let s = new k(new n(.035, .004, 3, 10), F(null, "#7a5c3c"));
		s.rotation.x = Math.PI / 2, s.position.y = .103, t.add(s);
		for (let e = 0; e < 4; e++) {
			let n = e / 4 * 6.28 + r(), a = I(.03, .03, .08, i, Math.cos(n) * .09, 0, Math.sin(n) * .09, t);
			a.rotation.y = -n, a.rotation.x = .3;
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
				let e = Math.min(.05 + r() * .06, n / 2 - s), c = I(o * (.85 + r() * .3), .04 + r() * .012, e - .006, i[r() * 3 | 0], (r() - .5) * .015, a, s + e / 2, t);
				c.rotation.y = (r() - .5) * .25, c.rotation.z = (r() - .5) * .12, s += e;
			}
		}
		for (let i = -1.16 / 2; i < n / 2 - .01;) {
			let a = Math.min(.08 + r() * .05, n / 2 - i), o = I(.11, .028, a - .008, e.m.stone, 0, .135, i + a / 2, t);
			o.rotation.x = (r() - .5) * .3, i += a;
		}
	},
	fence(e, t) {
		let n = 1.16;
		for (let r = 0; r <= 5; r++) {
			let i = -1.16 / 2 + n * r / 5;
			I(.035, .3, .035, e.m.beam, 0, 0, i, t);
			let a = new k(new nt(.025, .04, 4), e.m.beam);
			a.position.set(0, .32, i), t.add(a);
		}
		for (let r of [.1, .22]) I(.02, .03, n, e.m.wood, .02, r, 0, t);
	}
}), Object.assign(ec, {
	stairsup(e, t) {
		let n = .36, r = .62, i = .43, a = F(P("ashlar", "#4c4852", 31)), o = F(null, "#221f27");
		for (let e = 0; e < 8; e++) {
			let o = r / 8, s = i * (e + 1) / 8, c = r / 2 - (e + .5) * o;
			I(n, s, o, a, 0, 0, c, t), I(n, .008, .012, F(null, "#6a6570"), 0, s - .004, c + o / 2 - .006, t);
		}
		for (let e of [-1, 1]) for (let n = 0; n < 8; n++) {
			let o = r / 8, s = i * (n + 1) / 8 + .06, c = r / 2 - (n + .5) * o;
			I(.05, s, o, a, e * .205, 0, c, t);
		}
		let s = i, c = -.62 / 2 - .02;
		for (let e of [-1, 1]) I(.07, .42, .08, a, e * .19, s, c, t);
		I(.52, .08, .09, a, 0, .8300000000000001, c, t);
		let l = new k(new M(.32, .38, .02), e.m.glass);
		l.userData.glow = !0, l.position.set(0, .62, -.35000000000000003), t.add(l), I(.52, .5, .05, o, 0, s, -.39, t);
		for (let n of [-1, 1]) {
			let i = new k(new M(.03, .05, .03), e.m.glass);
			i.userData.glow = !0, i.position.set(n * .21, .3105, r / 2 - .08), t.add(i), I(.015, .1, .015, e.m.trim, n * .21, .2005, r / 2 - .08, t);
		}
	},
	stairsdown(e, t) {
		let n = .3, r = .3, i = .026, a = .44, o = F(P("ashlar", "#3a3642", 37)), s = F(null, "#0a080e"), c = F(null, "#9a94a2"), l = F(P("ashlar", "#58525e", 33)), u = -.25, d = .25, f = F(P("ashlar", "#26232c", 38));
		for (let e of [-1, 1]) I(i, d * .55, 2 * r, f, e * (n - i / 2), u, 0, t), I(i, d * .45, 2 * r, o, e * (n - i / 2), -.11249999999999999, 0, t);
		let p = .15;
		for (let e of [-1, 1]) I(n - p / 2, d, i, o, e * .1875, u, -.287, t);
		I(p, .07, i, o, 0, -.07, -.287, t), I(.18, .014, .034, c, 0, -.07, -.283, t), I(p, .15, .06, s, 0, -.22, -.35, t);
		let m = new k(new M(.126, .13, .006), e.m.glass);
		m.userData.glow = !0, m.position.set(0, -.155, -.312), t.add(m);
		let h = .5479999999999999, g = a / 12, _ = (e) => F(P("ashlar", "#" + new A("#7c7686").lerp(new A("#34303c"), e).getHexString(), 31));
		for (let e = 0; e < 12; e++) {
			let n = -.22 * (e + 1) / 13, i = r - (e + .5) * g;
			I(h, n - u, g, _(e / 12), 0, u, i, t), I(h, .006, .012, c, 0, n - .003, i + g / 2 - .006, t);
		}
		I(h, .03, 2 * r - a, _(1), 0, u, -.22, t);
		let v = .024, y = .03;
		for (let e of [-1, 1]) I(y, v, .63, l, e * .315, 0, -.03 / 2, t);
		I(.6599999999999999, v, y, l, 0, 0, -.3 - y / 2, t);
		for (let e of [-1, 1]) I(.045, .05, .045, l, e * .315, 0, .27799999999999997, t);
		let b = .34, x = .04, S = (e, n, r, i) => {
			I(e, .002, n, s, r, -.002, i, t).userData.mask = !0;
		};
		S(.98, b, .30000000000000004 / 2, .47), S(x, .64, -.3 - x / 2, -.04 / 2), S(b, .64, .47, -.04 / 2), S(.98, x, .30000000000000004 / 2, -.3 - x / 2);
	}
});
var mc = tc("#e6e8ec"), hc = tc("#1e1a18"), gc = tc("#151318"), _c = tc("#4a4a3a"), vc = tc("#6a5a38"), yc = F(P("thatch", "#635c44", 61)), bc = tc("#5a4430"), xc = tc("#a8865a");
function Sc(e, t, n, r, i, a) {
	let o = n / 2 + .07, s = i * n / 2, c = s * (n * .3 + .03) / o;
	Os(e, t + .03, n * .6, r + s - c + .012, c, mc, a, .03, .02);
}
function Cc(e, t, n, r = 3, i = .22, a = !0) {
	for (let o = 0; o < r; o++) for (let s = 0; s < r - o; s++) {
		let c = new k(new D(.028, .03, i, 6), bc), l = (s - (r - o - 1) / 2) * .058, u = .03 + o * .05;
		a ? (c.rotation.z = Math.PI / 2, c.position.set(t, u, n + l)) : (c.rotation.x = Math.PI / 2, c.position.set(t + l, u, n)), e.add(c);
		for (let r of [-1, 1]) {
			let o = new k(new D(.026, .026, .004, 6), xc);
			a ? (o.rotation.z = Math.PI / 2, o.position.set(t + r * i / 2, u, n + l)) : (o.rotation.x = Math.PI / 2, o.position.set(t + l, u, n + r * i / 2)), e.add(o);
		}
	}
}
function wc(e, t, n, r, i, a, o) {
	if (e.key === "fens") {
		I(.18, .14, .006, _c, n / 2 - .14, .12, r / 2 + .012, t);
		let e = new k(new D(.035, .022, .09, 7), vc);
		e.position.set(n / 2 + .05, .045, r / 2 - .1), t.add(e);
	} else if (e.key === "reach") {
		I(.1, i * .8, .01, hc, n / 2 - .12, i * .2, -r / 2 - .006, t), I(.14, .08, .1, e.m.wood, n / 2 + .09, 0, r / 2 - .12, t);
		let a = new k(new Pe(.05, 0), gc);
		a.scale.y = .5, a.position.set(n / 2 + .09, .09, r / 2 - .12), t.add(a);
	} else e.key === "heights" && (t.userData.snowed || Sc(t, n, r, i, a, e.m.lower), Cc(t, n / 2 + .06, -.02, 3, .36, !1));
}
function Tc(e) {
	return e.key === "fens" ? yc : e.m.roof;
}
function Ec(e, t, n, r, i, a, o = !0) {
	let s = new O();
	t.add(s), o || (s.rotation.y = Math.PI / 2);
	let [c, l] = o ? [n, r] : [r, n], u = e.key === "fens";
	if (Os(s, c, l, i, a * l / 2, Tc(e), e.key === "vale" || e.key === "fens" ? e.m.upper : e.m.lower, u ? .1 : .07, u ? .08 : .04), u) {
		let e = new k(new D(.05, .05, c + .18, 8), yc);
		e.rotation.z = Math.PI / 2, e.position.y = i + a * l / 2 + .01, s.add(e);
	}
	return e.key === "heights" && (Sc(s, c, l, i, a, e.m.lower), t.userData.snowed = !0), s;
}
function Dc(e, t, n, r, i, a) {
	let o = e.key === "vale" || e.key === "fens";
	o && I(n + .03, .1, r + .03, e.m.stone, 0, 0, 0, t), Xs(e, t, n, r, 0, i, o ? e.m.upper : e.m.lower, !0, {
		doorZ: a,
		timber: o
	});
}
function Oc(e, t, n, r, i) {
	for (let [a, o] of [
		[-n / 2, -r / 2],
		[n / 2, -r / 2],
		[-n / 2, r / 2],
		[n / 2, r / 2],
		[0, r / 2],
		[0, -r / 2]
	]) I(.035, i, .035, e.m.beam, a, 0, o, t);
	I(n + .06, .025, r + .08, e.m.wood, 0, i, .02, t);
	for (let n = 0; n < 2; n++) I(.14, .02, .05, e.m.wood, -.1, i * (.3 + n * .35), r / 2 + .06 + (1 - n) * .05, t);
}
Object.assign(ec, {
	cottage(e, t, n) {
		let r = e.key === "fens", i = r ? .07 : 0, a = .58, o = .48, s = .46, c = new O();
		c.position.y = i, t.add(c), r && Oc(e, t, a, o, i), Dc(e, c, a, o, s, .1), Rs(c, e, {
			side: "z",
			wallW: a,
			wallD: o
		}, .1, .16, .34, !e.timber), Ec(e, c, a, o, s, e.roofRise * 1.15), Bs(c, e, -.58 / 2 + .1, -.48 / 4, s, .3), wc(e, c, a, o, s, e.roofRise * 1.15, n), e.key === "vale" && (Ks(t, e, -.58 / 2 - .02, .44, -.04, .44), Gs(t, e, -.58 / 2 + .06, .33999999999999997, .05));
	},
	longhouse(e, t, n) {
		let r = e.key === "fens", i = r ? .07 : 0, a = 1.08, o = .5, s = .46, c = new O();
		c.position.y = i, t.add(c), r && Oc(e, t, a, o, i), Dc(e, c, a, o, s, -.28);
		for (let t of [-.28, .3]) Rs(c, e, {
			side: "z",
			wallW: a,
			wallD: o
		}, t, .16, .34, !e.timber);
		Ec(e, c, a, o, s, e.roofRise * 1.05), Bs(c, e, -.12, -.5 / 4, s, .28), Bs(c, e, a / 2 - .1, -.5 / 4, s, .28), wc(e, c, a, o, s, e.roofRise * 1.05, n), e.key === "reach" && I(.12, .07, .09, e.m.wood, -1.08 / 2 - .08, 0, o / 2 - .1, c);
	},
	workshop(e, t, n) {
		let r = .56, i = .52, a = .48;
		Dc(e, t, r, i, a, -.08), Rs(t, e, {
			side: "z",
			wallW: r,
			wallD: i
		}, -.08, .2, .36, !1), Ec(e, t, r, i, a, e.roofRise), Bs(t, e, -.56 / 2 + .1, -.52 / 4, a, .3);
		let o = new O();
		o.position.set(.48000000000000004, 0, 0), t.add(o);
		for (let [t, n] of [[.17, i / 2 - .02], [.17, -.52 / 2 + .02]]) I(.035, .34, .035, e.m.beam, t, 0, n, o);
		let s = I(.44, .03, .6, Tc(e), 0, .36, 0, o);
		if (s.rotation.z = -.32, e.key === "heights") {
			let e = I(.4, .015, i * .9, mc, -.01, .39, 0, o);
			e.rotation.z = -.32;
		}
		if (e.key === "vale") {
			I(.26, .03, .12, e.m.wood, 0, .13, 0, o);
			for (let [t, n] of [
				[-.11, -.04],
				[.11, -.04],
				[-.11, .04],
				[.11, .04]
			]) I(.018, .13, .018, e.m.beam, t, 0, n, o);
			for (let t = 0; t < 4; t++) I(.3, .012, .04, e.m.wood, -.02, .012 * t, -.17, o);
		}
		if (e.key === "fens") {
			let t = I(.34, .05, .12, e.m.wood, 0, .08, .02, o);
			t.rotation.x = Math.PI;
			for (let t of [-.13, .13]) I(.03, .08, .03, e.m.beam, t, 0, .02, o);
		}
		if (e.key === "reach") {
			I(.16, .14, .14, e.m.stone, 0, 0, 0, o);
			let t = I(.12, .02, .1, F(null, "#e0a050"), 0, .14, 0, o);
			t.userData.glow = !0, I(.1, .06, .05, e.m.dark, .02, 0, .14, o);
		}
		if (e.key === "heights") {
			let e = new k(new D(.06, .07, .1, 8), bc);
			e.position.set(0, .05, .08), o.add(e), Cc(o, 0, -.12, 3, .3, !0);
		}
		Us(t, e, r / 2 - .08, .42, i / 2);
	},
	windmill(e, t, n) {
		let r = new O();
		r.scale.setScalar(1.35), t.add(r);
		let i = new k(new D(.24, .28, .42, 12), e.m.stone);
		i.position.y = .21, r.add(i);
		let a = new k(new D(.26, .26, .03, 12), e.m.stoneDark);
		a.position.y = .42, r.add(a), Rs(r, e, {
			side: "z",
			wallW: .5,
			wallD: .5
		}, 0, .12, .24, !0);
		let o = new O();
		o.position.y = .44, r.add(o), I(.34, .42, .38, e.m.wood, 0, 0, 0, o);
		let s = new O();
		s.position.y = .42, o.add(s), Os(s, .38, .38, 0, .18, e.m.roof, e.m.wood, .04, .03), As(o, e, {
			side: "x",
			wallW: .34,
			wallD: .38
		}, 0, .26, .07, .08, { lit: !0 });
		let c = new O();
		c.position.set(0, .3, .23), o.add(c);
		let l = Fs(new k(new D(.03, .03, .08, 8), e.m.beam));
		l.rotation.x = Math.PI / 2, c.add(l);
		let u = new O();
		u.position.z = .05, u.rotation.z = .35, c.add(u);
		let d = tc("#cfc4a8");
		for (let t = 0; t < 4; t++) {
			let n = new O();
			n.rotation.z = t * Math.PI / 2, u.add(n), n.add(Fs(I(.025, .62, .02, e.m.beam, 0, 0, 0)));
			let r = Fs(I(.12, .46, .01, d, .075, .14, .008));
			n.add(r);
			for (let t = 0; t < 6; t++) n.add(Fs(I(.14, .01, .014, e.m.beam, .07, .16 + t * .08, .012)));
		}
		let f = Fs(I(.03, .03, .5, e.m.beam, 0, .06, -.38));
		f.rotation.x = -.5, o.add(f);
	},
	cart(e, t, r) {
		let i = new O();
		i.position.y = .12, i.rotation.x = .12, t.add(i), I(.24, .025, .4, e.m.wood, 0, 0, 0, i);
		for (let t of [-1, 1]) I(.015, .08, .4, e.m.wood, t * .12, .025, 0, i);
		I(.24, .08, .015, e.m.wood, 0, .025, -.2, i);
		for (let t of [-1, 1]) {
			let n = I(.022, .022, .28, e.m.beam, t * .09, -.02, .32, i);
			n.rotation.x = .18;
		}
		for (let r of [-1, 1]) {
			let i = new O();
			i.position.set(r * .15, .11, -.02), t.add(i);
			let a = new k(new n(.1, .012, 5, 16), e.m.wood);
			a.rotation.y = Math.PI / 2, i.add(a);
			let o = new k(new n(.104, .006, 4, 16), e.m.trim);
			o.rotation.y = Math.PI / 2, i.add(o);
			for (let t = 0; t < 6; t++) {
				let n = I(.01, .2, .012, e.m.beam, 0, -.1, 0, i);
				n.rotation.x = t * Math.PI / 6, n.position.y = 0, n.geometry.translate(0, 0, 0);
			}
			let s = new k(new D(.02, .02, .04, 8), e.m.beam);
			s.rotation.z = Math.PI / 2, i.add(s);
		}
		Gs(i, e, -.03, -.05, .08), Gs(i, e, .05, .08, .07), pc(i, e, .06, -.12, .8);
	},
	handcart(e, t, n) {
		let r = new O();
		r.position.y = .07, r.rotation.x = .18, t.add(r), I(.16, .07, .22, e.m.wood, 0, 0, 0, r);
		for (let t of [-1, 1]) I(.014, .014, .24, e.m.beam, t * .07, .05, .2, r);
		for (let n of [-1, 1]) {
			let r = new k(new D(.06, .06, .02, 10), e.m.wood);
			r.rotation.z = Math.PI / 2, r.position.set(n * .1, .06, -.04), t.add(r);
		}
		fc(r, e, .09, .08, .09, -.02, -.03), pc(r, e, .04, .05, .7, .4);
	},
	table(e, t, n) {
		I(.36, .02, .14, e.m.wood, 0, .12, 0, t);
		for (let n of [-1, 1]) {
			let r = I(.02, .12, .12, e.m.beam, n * .14, 0, 0, t);
			r.rotation.y = 0;
		}
		for (let n of [-1, 1]) {
			I(.34, .016, .05, e.m.wood, 0, .07, n * .12, t);
			for (let r of [-1, 1]) I(.016, .07, .04, e.m.beam, r * .13, 0, n * .12, t);
		}
		let r = tc("#7a6a5a"), i = tc("#a8804a");
		for (let [e, n] of [
			[-.1, -.03],
			[.04, .04],
			[.12, -.02]
		]) {
			let i = new k(new D(.014, .012, .03, 6), r);
			i.position.set(e, .155, n), t.add(i);
		}
		let a = new k(new D(.018, .024, .05, 7), r);
		a.position.set(-.02, .165, -.02), t.add(a), I(.08, .008, .05, e.m.wood, .1, .14, .03, t);
		let o = new k(new me(.025, 6, 4), i);
		o.scale.set(1.3, .7, 1), o.position.set(.1, .16, .03), t.add(o);
	},
	standard(e, t, n) {
		I(.08, .05, .08, e.m.stone, 0, 0, 0, t), I(.022, .78, .022, e.m.beam, 0, .05, 0, t), I(.2, .018, .018, e.m.beam, 0, .78, .012, t), I(.17, .36, .008, e.m.banner, 0, .42, .02, t), I(.17, .03, .01, e.m.trim, 0, .6, .025, t), I(.17, .03, .01, e.m.trim, 0, .47, .025, t);
		let r = new k(new nt(.018, .05, 6), e.m.trim);
		r.position.y = .86, t.add(r);
		let i = I(.17, .05, .008, e.m.banner, 0, .37, .02, t);
		i.scale.x = .6, i.position.x = 0;
	},
	boxes(e, t, n) {
		fc(t, e, .18, .16, .18, -.08, -.04), fc(t, e, .13, .12, .13, -.08, -.04, !0).position.y = .16, fc(t, e, .14, .12, .14, .11, -.06, !0), ec.barrel(e, (() => {
			let e = new O();
			return e.position.set(.12, 0, .12), e.scale.setScalar(.9), t.add(e), e;
		})()), pc(t, e, -.04, .12, .9), pc(t, e, -.14, .1, .8, 1);
	},
	foodstand(e, t, n) {
		let r = .42, i = .24;
		for (let [n, a] of [
			[-.42 / 2, -.24 / 2],
			[r / 2, -.24 / 2],
			[-.42 / 2, i / 2],
			[r / 2, i / 2]
		]) I(.025, .38, .025, e.m.beam, n, 0, a, t);
		let a = I(.52, .02, .38, e.m.banner, 0, .38, .03, t);
		a.rotation.x = .22;
		for (let n = 0; n < 5; n++) I(.52 / 10, .022, .39, e.m.trim, -.52 / 2 + .52 * (n * 2 + 1) / 10, .381, .03, t).rotation.x = .22;
		I(r, .13, .1, e.m.wood, 0, 0, i / 2 - .04, t), I(r, .02, .19999999999999998, e.m.wood, 0, .18, -.04, t);
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
			let r = -.13 + e * .13, a = new k(new D(.05, .04, .04, 8), vc);
			a.position.set(r, .15, i / 2 - .04), t.add(a);
			for (let a = 0; a < 5; a++) {
				let a = new k(new _(.018, 0), tc(o[e]));
				a.position.set(r + (n() - .5) * .05, .18 + n() * .01, i / 2 - .04 + (n() - .5) * .05), t.add(a);
			}
		}
		for (let n = 0; n < 4; n++) I(.025, .07, .02, tc(e.key === "fens" ? "#4a5048" : "#8a5a3a"), -.42 / 2 + .07 + n * .1, .25, -.09, t);
		pc(t, e, .27, .04, .8), ec.barrel(e, (() => {
			let e = new O();
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
		]) I(i, .15, a, e.m.stone, n, 0, r, t);
		I(.18, .005, .18, tc("#1d3040"), 0, .1, 0, t);
		for (let n of [-1, 1]) {
			let r = I(.024, .4, .024, e.m.beam, n * .14, 0, 0, t);
			r.rotation.z = n * .12;
		}
		let r = new k(new D(.035, .035, .26, 8), e.m.wood);
		r.rotation.z = Math.PI / 2, r.position.y = .36, t.add(r), I(.012, .012, .08, e.m.trim, .16, .36, .04, t), I(.012, .05, .012, e.m.trim, .16, .36, .08, t), I(.006, .14, .006, e.m.trim, 0, .22, 0, t);
		let i = new k(new D(.035, .028, .05, 8), e.m.wood);
		i.position.set(0, .2, 0), t.add(i), e.key === "heights" && I(.27, .012, .27, mc, 0, .15, 0, t);
	},
	lamppost(e, t, n) {
		I(.07, .05, .07, e.m.stone, 0, 0, 0, t), I(.025, .56, .025, e.m.beam, 0, .05, 0, t), I(.012, .012, .12, e.m.trim, 0, .58, .05, t);
		let r = new k(new M(.06, .08, .06), e.m.glass);
		r.userData.glow = !0, r.position.set(0, .51, .1), t.add(r), I(.075, .016, .075, e.m.trim, 0, .55, .1, t), I(.006, .03, .006, e.m.trim, 0, .56, .1, t);
	},
	bench(e, t, n) {
		I(.3, .018, .08, e.m.wood, 0, .08, 0, t);
		for (let n of [-1, 1]) I(.018, .08, .07, e.m.beam, n * .12, 0, 0, t);
		for (let n of [-1, 1]) I(.016, .1, .016, e.m.beam, n * .12, .09, -.035, t);
		I(.3, .03, .014, e.m.wood, 0, .16, -.035, t);
	},
	trough(e, t, n) {
		I(.36, .03, .14, e.m.stone, 0, 0, 0, t);
		for (let n of [-1, 1]) I(.36, .1, .025, e.m.stone, 0, 0, n * .0575, t);
		for (let n of [-1, 1]) I(.025, .1, .09, e.m.stone, n * .1675, 0, 0, t);
		I(.31, .006, .09, tc("#2a4458"), 0, .07, 0, t), I(.03, .14, .03, e.m.beam, .2, 0, -.04, t), I(.012, .012, .06, e.m.trim, .2, .13, -.01, t);
	},
	woodpile(e, t, n) {
		Cc(t, 0, 0, 4, .34, !1);
		for (let n of [-1, 1]) I(.025, .3, .025, e.m.beam, n * .14, 0, .04, t);
		let r = I(.36, .018, .22, e.m.wood, 0, .3, 0, t);
		r.rotation.x = -.25;
	}
}), Object.keys(ec);
function kc(e, t, n = 1, r = !1) {
	let { S: i, g: a } = Ys(t, n);
	return ec[e](i, a, Ss(n)), r && (a.rotation.y = Math.PI / 2), a.traverse((e) => {
		e.isMesh && (e.frustumCulled = !1);
	}), a;
}
//#endregion
//#region ember3d/env.json
var Ac = /*#__PURE__*/ JSON.parse("[{\"id\":\"pine_1\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"pine_2\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"pine_3\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":3,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"pine_4\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":4,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"pine_5\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":5,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"pine_6\",\"model\":\"pine\",\"tree\":\"pine\",\"seed\":6,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"oak_1\",\"model\":\"oak\",\"tree\":\"oak\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"oak_2\",\"model\":\"oak\",\"tree\":\"oak\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"oak_3\",\"model\":\"oak\",\"tree\":\"oak\",\"seed\":3,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"oak_4\",\"model\":\"oak\",\"tree\":\"oak\",\"seed\":4,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"autumn_1\",\"model\":\"autumn\",\"tree\":\"autumn\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"autumn_2\",\"model\":\"autumn\",\"tree\":\"autumn\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"autumn_3\",\"model\":\"autumn\",\"tree\":\"autumn\",\"seed\":3,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"birch_1\",\"model\":\"birch\",\"tree\":\"birch\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"birch_2\",\"model\":\"birch\",\"tree\":\"birch\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"birch_3\",\"model\":\"birch\",\"tree\":\"birch\",\"seed\":3,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"dead_1\",\"model\":\"dead\",\"tree\":\"dead\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"dead_2\",\"model\":\"dead\",\"tree\":\"dead\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_1\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_2\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_3\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":3,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_4\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":4,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_5\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":5,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"grove_6\",\"model\":\"grove\",\"tree\":\"grove\",\"seed\":6,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"bridge_0\",\"model\":\"bridge\",\"nature\":\"bridge\",\"seed\":1,\"rotY\":0,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"bridge_90\",\"model\":\"bridge\",\"nature\":\"bridge\",\"seed\":1,\"rotY\":90,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_A\",\"model\":\"rock\",\"nature\":\"rock\",\"seed\":1,\"variant\":0,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_B\",\"model\":\"rock\",\"nature\":\"rock\",\"seed\":2,\"variant\":1,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_C\",\"model\":\"rock\",\"nature\":\"rock\",\"seed\":3,\"variant\":2,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_D\",\"model\":\"rock\",\"nature\":\"rock\",\"seed\":4,\"variant\":3,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_E\",\"model\":\"rock\",\"nature\":\"rock\",\"seed\":5,\"variant\":4,\"gain\":0.64,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"mountain_A_grass_trees\",\"model\":\"mountain\",\"nature\":\"mountain\",\"seed\":1,\"variant\":0,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_B_grass_trees\",\"model\":\"mountain\",\"nature\":\"mountain\",\"seed\":2,\"variant\":1,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_C_grass_trees\",\"model\":\"mountain\",\"nature\":\"mountain\",\"seed\":3,\"variant\":2,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_A\",\"model\":\"mountain\",\"nature\":\"mountain\",\"seed\":4,\"variant\":3,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_B\",\"model\":\"mountain\",\"nature\":\"mountain\",\"seed\":5,\"variant\":4,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_massif_A\",\"model\":\"mountain\",\"nature\":\"massif\",\"seed\":10,\"variant\":0,\"up\":2,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_massif_B\",\"model\":\"mountain\",\"nature\":\"massif\",\"seed\":11,\"variant\":1,\"up\":2,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"mountain_massif_C\",\"model\":\"mountain\",\"nature\":\"massif\",\"seed\":12,\"variant\":2,\"up\":2,\"gain\":0.8,\"desat\":0.1,\"tint\":[0.96,0.98,1.04]},{\"id\":\"ruin\",\"model\":\"barrow\",\"build\":\"barrow\",\"style\":\"vale\",\"seed\":3,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"mine_0\",\"model\":\"mine\",\"build\":\"mine\",\"style\":\"vale\",\"seed\":4,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"lumbermill_90\",\"model\":\"lumbermill\",\"build\":\"lumbermill\",\"style\":\"vale\",\"seed\":5,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"barrel\",\"model\":\"barrel\",\"build\":\"barrel\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"crate_A_big\",\"model\":\"crate_A_big\",\"build\":\"crate_A_big\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"crate_A_small\",\"model\":\"crate_A_small\",\"build\":\"crate_A_small\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"crate_B_big\",\"model\":\"crate_B_big\",\"build\":\"crate_B_big\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"crate_long_A\",\"model\":\"crate_long_A\",\"build\":\"crate_long_A\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"sack\",\"model\":\"sack\",\"build\":\"sack\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"wheelbarrow\",\"model\":\"wheelbarrow\",\"build\":\"wheelbarrow\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"weaponrack\",\"model\":\"weaponrack\",\"build\":\"weaponrack\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"bucket_water\",\"model\":\"bucket_water\",\"build\":\"bucket_water\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"resource_lumber\",\"model\":\"resource_lumber\",\"build\":\"resource_lumber\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"resource_stone\",\"model\":\"resource_stone\",\"build\":\"resource_stone\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"flag_red\",\"model\":\"flag_red\",\"build\":\"flag_red\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"stump\",\"model\":\"stump\",\"build\":\"stump\",\"style\":\"vale\",\"seed\":1,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"fence_0\",\"model\":\"fence\",\"build\":\"fence\",\"style\":\"vale\",\"seed\":1,\"rotY\":0,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"fence_90\",\"model\":\"fence\",\"build\":\"fence\",\"style\":\"vale\",\"seed\":1,\"rotY\":90,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"drywall_0\",\"model\":\"drywall\",\"build\":\"drywall\",\"style\":\"vale\",\"seed\":3,\"rotY\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"drywall_90\",\"model\":\"drywall\",\"build\":\"drywall\",\"style\":\"vale\",\"seed\":3,\"rotY\":90,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"stairsup_0\",\"model\":\"stairsup\",\"build\":\"stairsup\",\"style\":\"vale\",\"seed\":1,\"rotY\":0,\"gain\":0.62,\"desat\":0.2,\"tint\":[0.95,0.94,1.0]},{\"id\":\"stairsup_90\",\"model\":\"stairsup\",\"build\":\"stairsup\",\"style\":\"vale\",\"seed\":1,\"rotY\":90,\"gain\":0.62,\"desat\":0.2,\"tint\":[0.95,0.94,1.0]},{\"id\":\"stairsdown_0\",\"model\":\"stairsdown\",\"build\":\"stairsdown\",\"style\":\"vale\",\"seed\":1,\"rotY\":0,\"gain\":0.62,\"desat\":0.2,\"tint\":[0.95,0.94,1.0],\"below\":0.27,\"shadow\":false,\"glowId\":2},{\"id\":\"watermill_0\",\"model\":\"watermill\",\"build\":\"watermill\",\"style\":\"vale\",\"seed\":6,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,0.96,0.9]},{\"id\":\"chapelruin_0\",\"model\":\"chapelruin\",\"build\":\"chapelruin\",\"style\":\"vale\",\"seed\":7,\"gain\":0.64,\"desat\":0.18,\"tint\":[0.95,0.97,1.0]},{\"id\":\"milestone_0\",\"model\":\"milestone\",\"build\":\"milestone\",\"style\":\"vale\",\"seed\":8,\"gain\":0.7,\"desat\":0.1,\"tint\":[1.0,0.97,0.92]},{\"id\":\"warren_0\",\"model\":\"warren\",\"build\":\"warren\",\"style\":\"vale\",\"seed\":12,\"gain\":0.62,\"desat\":0.14,\"tint\":[0.98,0.97,0.94]},{\"id\":\"wagon_0\",\"model\":\"wagon\",\"build\":\"wagon\",\"style\":\"vale\",\"seed\":9,\"gain\":0.95,\"desat\":0.12,\"tint\":[1.0,0.97,0.93]},{\"id\":\"ug_bush\",\"model\":\"ug_bush\",\"gltf\":\"nature/Bush_Common_Flowers\",\"scale\":0.22,\"gain\":0.6,\"desat\":0.5,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_fern\",\"model\":\"ug_fern\",\"gltf\":\"nature/Fern_1\",\"scale\":0.08,\"gain\":0.5,\"desat\":0.3,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_plant\",\"model\":\"ug_plant\",\"gltf\":\"nature/Plant_1_Big\",\"scale\":0.14,\"gain\":0.5,\"desat\":0.3,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_flowers_1\",\"model\":\"ug_flowers_1\",\"gltf\":\"nature/Flower_3_Group\",\"scale\":0.14,\"gain\":0.6,\"desat\":0.2,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_flowers_2\",\"model\":\"ug_flowers_2\",\"gltf\":\"nature/Flower_4_Group\",\"scale\":0.14,\"gain\":0.6,\"desat\":0.2,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_grass_1\",\"model\":\"ug_grass_1\",\"gltf\":\"nature/Grass_Wispy_Tall\",\"scale\":0.2,\"gain\":0.72,\"desat\":0.4,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_grass_2\",\"model\":\"ug_grass_2\",\"gltf\":\"nature/Grass_Common_Tall\",\"scale\":0.2,\"gain\":0.72,\"desat\":0.4,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_clover\",\"model\":\"ug_clover\",\"gltf\":\"nature/Clover_2\",\"scale\":0.2,\"gain\":0.45,\"desat\":0.3,\"tint\":[1.0,1.0,1.0]},{\"id\":\"ug_mushroom\",\"model\":\"ug_mushroom\",\"gltf\":\"nature/Mushroom_Laetiporus\",\"scale\":0.25,\"gain\":0.6,\"desat\":0.25,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_F\",\"model\":\"rock_F\",\"gltf\":\"nature/Rock_Medium_1\",\"scale\":0.12,\"gain\":0.62,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_G\",\"model\":\"rock_G\",\"gltf\":\"nature/Rock_Medium_2\",\"scale\":0.12,\"gain\":0.62,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"rock_H\",\"model\":\"rock_H\",\"gltf\":\"nature/Rock_Medium_3\",\"scale\":0.12,\"gain\":0.62,\"desat\":0.1,\"tint\":[1.0,1.0,1.0]},{\"id\":\"wheat_1\",\"model\":\"wheat\",\"nature\":\"wheat\",\"seed\":20,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"shadow\":false},{\"id\":\"wheat_2\",\"model\":\"wheat\",\"nature\":\"wheat\",\"seed\":21,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"shadow\":false},{\"id\":\"wheat_3\",\"model\":\"wheat\",\"nature\":\"wheat\",\"seed\":22,\"variant\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"shadow\":false},{\"id\":\"cow_1\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":35,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"cow_1~tl\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":35,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"pose\":{\"tail\":-1}},{\"id\":\"cow_1~tr\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":35,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"pose\":{\"tail\":1}},{\"id\":\"cow_1~hd\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":35,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"pose\":{\"head\":1}},{\"id\":\"cow_2\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":36,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":60},{\"id\":\"cow_2~tl\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":36,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":60,\"pose\":{\"tail\":-1}},{\"id\":\"cow_2~tr\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":36,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":60,\"pose\":{\"tail\":1}},{\"id\":\"cow_2~hd\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":36,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":60,\"pose\":{\"head\":1}},{\"id\":\"cow_3\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":37,\"variant\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":-50},{\"id\":\"cow_3~tl\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":37,\"variant\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":-50,\"pose\":{\"tail\":-1}},{\"id\":\"cow_3~tr\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":37,\"variant\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":-50,\"pose\":{\"tail\":1}},{\"id\":\"cow_3~hd\",\"model\":\"cow\",\"nature\":\"cow\",\"seed\":37,\"variant\":2,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9],\"rotY\":-50,\"pose\":{\"head\":1}},{\"id\":\"sheep_1\",\"model\":\"sheep\",\"nature\":\"sheep\",\"seed\":37,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"sheep_2\",\"model\":\"sheep\",\"nature\":\"sheep\",\"seed\":38,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"hens_1\",\"model\":\"hens\",\"nature\":\"hens\",\"seed\":36,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"pumpkins_1\",\"model\":\"pumpkins\",\"nature\":\"pumpkins\",\"seed\":40,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"hay_1\",\"model\":\"hay\",\"nature\":\"hay\",\"seed\":35,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"hay_2\",\"model\":\"hay\",\"nature\":\"hay\",\"seed\":36,\"variant\":1,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"planter_1\",\"model\":\"planter\",\"nature\":\"planter\",\"seed\":39,\"variant\":0,\"gain\":0.72,\"desat\":0.1,\"tint\":[1.0,0.96,0.9]},{\"id\":\"alder_1\",\"model\":\"alder\",\"tree\":\"alder\",\"seed\":61,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"alder_2\",\"model\":\"alder\",\"tree\":\"alder\",\"seed\":62,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"alder_3\",\"model\":\"alder\",\"tree\":\"alder\",\"seed\":63,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"willow_1\",\"model\":\"willow\",\"tree\":\"willow\",\"seed\":71,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"willow_2\",\"model\":\"willow\",\"tree\":\"willow\",\"seed\":72,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"carr_1\",\"model\":\"carr\",\"tree\":\"carr\",\"seed\":81,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"carr_2\",\"model\":\"carr\",\"tree\":\"carr\",\"seed\":82,\"gain\":0.66,\"desat\":0.14,\"tint\":[0.96,1.0,0.97]},{\"id\":\"windmill_0\",\"model\":\"windmill\",\"build\":\"windmill\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"cart_0\",\"model\":\"cart\",\"build\":\"cart\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"cart_90\",\"model\":\"cart\",\"build\":\"cart\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0],\"faceX\":true},{\"id\":\"handcart_0\",\"model\":\"handcart\",\"build\":\"handcart\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"table_0\",\"model\":\"table\",\"build\":\"table\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"boxes_0\",\"model\":\"boxes\",\"build\":\"boxes\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"lamppost_0\",\"model\":\"lamppost\",\"build\":\"lamppost\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"bench_0\",\"model\":\"bench\",\"build\":\"bench\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"trough_0\",\"model\":\"trough\",\"build\":\"trough\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]},{\"id\":\"woodpile_0\",\"model\":\"woodpile\",\"build\":\"woodpile\",\"style\":\"vale\",\"seed\":7,\"gain\":0.68,\"desat\":0.12,\"tint\":[1.0,1.0,1.0]}]"), jc = {
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
}, R = (e, t, n) => new l({
	color: e,
	metalness: t,
	roughness: n
}), Mc = {
	mace: () => {
		let e = new O();
		e.name = "Mace";
		let t = R(4862754, 0, .85), n = R(3022616, 0, .9), r = R(12095548, .8, .35), i = R(10133670, .85, .35), a = (t, n, r, i) => {
			let a = new k(t, n);
			return a.position.y = r, a.name = i, e.add(a), a;
		};
		a(new D(.062, .07, 1.02, 10), t, .28, "Mace_Haft"), a(new D(.08, .08, .34, 10), n, -.02, "Mace_Grip"), a(new me(.1, 12, 8), r, -.25, "Mace_Pommel");
		for (let e of [.17, .7]) a(new D(.085, .085, .06, 12), r, e, "Mace_Band");
		a(new D(.12, .1, .38, 12), i, .92, "Mace_Head");
		let o = new ue([
			[0, -.22],
			[.13, -.06],
			[.14, .06],
			[0, .22]
		].map(([e, t]) => new qe(e, t))), s = new m(o, {
			depth: .05,
			bevelEnabled: !1
		});
		s.translate(0, 0, -.025);
		for (let t = 0; t < 6; t++) {
			let n = new k(s, i), r = t * Math.PI / 3;
			n.position.set(Math.cos(r) * .1, .92, Math.sin(r) * .1), n.rotation.y = -r, n.name = "Mace_Flange", e.add(n);
		}
		return a(new nt(.1, .16, 10), i, 1.18, "Mace_Cap"), a(new me(.065, 10, 8), r, 1.28, "Mace_Knop"), e;
	},
	sword: () => {
		let e = new O();
		e.name = "Sword";
		let t = R(13159634, .9, .3), n = R(12095548, .8, .35), r = R(3810328, 0, .9), i = new k(new D(.02, .1, 1.2, 4, 1), t);
		i.scale.set(1, 1, .3), i.rotation.y = Math.PI / 4, i.position.y = .78, i.name = "Sword_Blade", e.add(i);
		let a = new k(new M(.46, .07, .1), n);
		a.position.y = .16, e.add(a);
		let o = new k(new D(.045, .05, .3, 8), r);
		o.position.y = 0, e.add(o);
		let s = new k(new me(.075, 10, 8), n);
		return s.position.y = -.2, e.add(s), e;
	},
	dagger: () => {
		let e = new O();
		e.name = "Dagger";
		let t = R(12633290, .9, .3), n = R(2760736, .2, .7), r = new k(new D(.012, .07, .62, 4, 1), t);
		r.scale.set(1, 1, .3), r.rotation.y = Math.PI / 4, r.position.y = .45, e.add(r);
		let i = new k(new M(.26, .05, .08), n);
		i.position.y = .12, e.add(i);
		let a = new k(new D(.04, .045, .24, 8), n);
		return e.add(a), e;
	},
	staff: () => {
		let e = new O();
		e.name = "Staff", e.userData.hang = "up";
		let t = R(5913122, 0, .85), r = R(12095548, .8, .35), i = new l({
			color: 16752704,
			emissive: 12599312,
			emissiveIntensity: 1.2,
			roughness: .2
		}), a = new k(new D(.045, .055, 2.1, 8), t);
		a.position.y = .2, e.add(a);
		for (let t of [1.18, -.8]) {
			let n = new k(new D(.07, .07, .07, 10), r);
			n.position.y = t, e.add(n);
		}
		let o = new k(new n(.12, .025, 6, 12), r);
		o.position.y = 1.36, e.add(o);
		let s = new k(new _(.11, 1), i);
		return s.position.y = 1.36, s.userData.glow = 16744496, e.add(s), e;
	},
	shield: () => {
		let e = new O();
		e.name = "Shield";
		let t = R(8007202, 0, .8), r = R(10133670, .85, .35), i = R(13146688, .8, .35), a = new k(new D(.42, .42, .08, 20), t);
		a.rotation.x = Math.PI / 2, a.position.z = .16, e.add(a);
		let o = new k(new n(.42, .035, 6, 24), r);
		o.position.z = .2, e.add(o);
		let s = new k(new me(.11, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), i);
		return s.rotation.x = Math.PI / 2, s.position.z = .2, e.add(s), e;
	},
	book: () => {
		let e = new O();
		e.name = "Book";
		let t = R(5906464, 0, .8), n = R(15260864, 0, .9), r = R(13146688, .8, .35), i = new k(new M(.2, .42, .46), t);
		i.position.y = .27, e.add(i);
		let a = new k(new M(.16, .38, .47), n);
		a.position.y = .27, a.position.x = .012, e.add(a);
		let o = new k(new M(.21, .08, .08), r);
		return o.position.set(0, .27, .2), e.add(o), e;
	},
	standard: () => {
		let e = new O();
		e.name = "Standard";
		let t = R(3811868, 0, .9), n = R(11042874, .8, .4), r = R(8004632, 0, .95), i = new l({
			color: 15773776,
			emissive: 10506256,
			emissiveIntensity: 1,
			roughness: .4
		}), a = new k(new D(.045, .055, 3, 8), t);
		a.position.y = -.9, e.add(a);
		let o = new k(new D(.035, .035, .9, 8), n);
		o.rotation.z = Math.PI / 2, o.position.y = -2.2, e.add(o);
		let s = new k(new nt(.1, .34, 6), n);
		s.rotation.z = Math.PI, s.position.y = -2.56, e.add(s);
		for (let [t, n] of [
			[-.28, 1],
			[0, 1.2],
			[.28, .9]
		]) {
			let i = new k(new M(.28, n, .02), r);
			i.position.set(t, -2.2 + n / 2, .04), e.add(i);
		}
		let c = new k(new D(.14, .14, .03, 14), i);
		return c.rotation.x = Math.PI / 2, c.position.set(0, -1.78, .07), e.add(c), e;
	},
	shard: () => {
		let e = new O();
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
			let o = new k(new T(1, 0), t);
			o.scale.set(i, r / 2, i), o.position.set(n, .1 + r / 2, 0), o.rotation.z = a, o.name = "Ember_Shard", o.userData.glow = 16744496, e.add(o);
		}
		return e;
	},
	mug: () => {
		let e = new O();
		e.name = "Mug";
		let t = R(7106676, .75, .45), r = R(13144106, .1, .35), i = R(14209212, 0, .9), a = new k(new D(.2, .18, .4, 14, 1, !0), t);
		a.position.set(.22, .22, 0), a.name = "Mug_Body", e.add(a);
		let o = new k(new D(.19, .19, .04, 14), t);
		o.position.set(.22, .03, 0), o.name = "Mug_Base", e.add(o);
		let s = new k(new D(.19, .19, .02, 14), r);
		s.position.set(.22, .38, 0), s.name = "Mug_Ale", e.add(s);
		let c = new k(new me(.2, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), i);
		c.scale.set(.8, .3, .8), c.position.set(.22, .4, 0), c.name = "Mug_Foam", e.add(c);
		let l = new k(new n(.11, .035, 8, 16, Math.PI), t);
		return l.rotation.z = Math.PI / 2, l.position.set(.02, .22, 0), l.name = "Mug_Handle", e.add(l), e;
	},
	lantern: () => {
		let e = new O();
		e.name = "Lantern", e.userData.hang = !0;
		let t = R(3814964, .7, .5), r = R(10123834, .8, .4), i = new l({
			color: 16760944,
			emissive: 12607504,
			emissiveIntensity: 1.2,
			roughness: .3
		}), a = new k(new n(.12, .022, 6, 14, Math.PI), t);
		a.rotation.z = Math.PI, a.position.y = .14, e.add(a);
		let o = new k(new nt(.17, .14, 8), t);
		o.rotation.z = Math.PI, o.position.y = .3, e.add(o);
		let s = new k(new D(.13, .13, .3, 8), i);
		s.position.y = .5, s.name = "Lantern_Glass", s.userData.glow = 16756816, e.add(s);
		for (let n = 0; n < 4; n++) {
			let r = n * Math.PI / 2 + Math.PI / 4, i = new k(new M(.03, .32, .03), t);
			i.position.set(Math.cos(r) * .135, .5, Math.sin(r) * .135), e.add(i);
		}
		let c = new k(new D(.16, .14, .07, 8), r);
		return c.position.y = .68, e.add(c), e;
	},
	hammer: () => {
		let e = new O();
		e.name = "Smith_Hammer", e.userData.hang = !0;
		let t = R(6965802, 0, .8), n = R(5593182, .85, .4), r = R(3022616, 0, .9), i = new k(new D(.045, .055, .62, 8), t);
		i.position.y = .2, e.add(i);
		let a = new k(new D(.062, .062, .26, 8), r);
		a.position.y = -.02, e.add(a);
		let o = new k(new M(.42, .17, .17), n);
		o.position.y = .52, o.name = "Hammer_Head", e.add(o);
		let s = new k(new D(.1, .1, .08, 10), n);
		s.rotation.z = Math.PI / 2, s.position.set(.24, .52, 0), e.add(s);
		let c = new k(new M(.1, .06, .15), n);
		return c.position.set(-.25, .52, 0), e.add(c), e;
	},
	basket: () => {
		let e = new O();
		e.name = "Egg_Basket", e.userData.hang = !0;
		let t = R(10517060, 0, .9), r = R(14209728, 0, .95), i = R(15919832, 0, .6), a = new k(new n(.2, .025, 6, 14, Math.PI), t);
		a.rotation.z = Math.PI, a.position.y = .2, e.add(a);
		let o = new k(new D(.26, .19, .24, 10), t);
		o.position.y = .36, e.add(o);
		for (let [t, n] of [
			[-.08, .05],
			[.07, -.06],
			[0, .1],
			[.1, .08]
		]) {
			let r = new k(new me(.075, 8, 6), i);
			r.scale.y = 1.25, r.position.set(t, .23, n), e.add(r);
		}
		let s = new k(new M(.3, .03, .22), r);
		return s.position.set(-.08, .25, -.06), s.rotation.y = .5, e.add(s), e;
	},
	keys: () => {
		let e = new O();
		e.name = "Key_Ring", e.userData.hang = !0;
		let t = R(6972512, .85, .4), r = R(11569728, .8, .4), i = new k(new n(.12, .022, 6, 16), t);
		i.position.y = .14, e.add(i);
		for (let [i, a, o] of [
			[
				-.35,
				r,
				.42
			],
			[
				.05,
				t,
				.5
			],
			[
				.4,
				r,
				.38
			]
		]) {
			let t = new O();
			t.position.y = .24, t.rotation.z = i;
			let r = new k(new M(.035, o, .035), a);
			r.position.y = o / 2, t.add(r);
			let s = new k(new n(.05, .018, 5, 10), a);
			s.position.y = .02, t.add(s);
			let c = new k(new M(.1, .06, .03), a);
			c.position.set(.05, o - .04, 0), t.add(c), e.add(t);
		}
		return e;
	},
	whip: () => {
		let e = new O();
		e.name = "Carter_Whip", e.userData.hang = !0;
		let t = R(5913122, 0, .85), n = R(2759184, 0, .9), r = new k(new D(.022, .04, 1.6, 6), t);
		r.position.y = -.62, e.add(r);
		let i = [
			[0, -1.42],
			[.1, -1.55],
			[.28, -1.5],
			[.36, -1.3],
			[.38, -1.05],
			[.42, -.85]
		].map(([e, t]) => new j(e, t, 0)), a = new k(new $e(new Ke(i), 16, .018, 5, !1), n);
		return e.add(a), e;
	},
	hoe: () => {
		let e = new O();
		e.name = "Hoe", e.userData.hang = !0;
		let t = R(9069112, 0, .85), n = R(5921888, .8, .45), r = new k(new D(.03, .036, 1.5, 6), t);
		r.position.y = -.6, e.add(r);
		let i = new k(new M(.3, .05, .2), n);
		return i.position.set(.1, -1.36, 0), i.rotation.z = .25, e.add(i), e;
	},
	pail: () => {
		let e = new O();
		e.name = "Pail", e.userData.hang = !0;
		let t = R(9068084, 0, .85), r = R(4078136, .7, .5), i = R(15788760, 0, .5), a = new k(new n(.17, .018, 6, 14, Math.PI), r);
		a.rotation.z = Math.PI, a.position.y = .16, e.add(a);
		let o = new k(new D(.2, .16, .3, 10), t);
		o.position.y = .36, e.add(o);
		for (let t of [.26, .46]) {
			let i = new k(new n(.185, .014, 4, 14), r);
			i.rotation.x = Math.PI / 2, i.position.y = t, e.add(i);
		}
		let s = new k(new D(.17, .17, .02, 10), i);
		return s.position.y = .23, e.add(s), e;
	},
	flour: () => {
		let e = new O();
		e.name = "Flour_Sack", e.userData.hang = !0;
		let t = R(14208174, 0, .95), r = R(6965802, 0, .9), i = new k(new D(.05, .08, .16, 8), t);
		i.position.y = .12, e.add(i);
		let a = new k(new n(.06, .016, 4, 10), r);
		a.rotation.x = Math.PI / 2, a.position.y = .1, e.add(a);
		let o = new k(new me(.24, 10, 8), t);
		return o.scale.set(1, 1.25, .85), o.position.y = .44, e.add(o), e;
	},
	apron: () => {
		let e = new O();
		e.name = "Apron";
		let t = R(6964264, 0, .85), n = R(3022616, 0, .9), r = new k(new M(.32, .4, .04), t);
		r.position.set(0, .32, .33), r.rotation.x = -.08, r.name = "Apron_Bib", e.add(r);
		for (let n of [-.1, .1]) {
			let r = new k(new M(.19, .3, .04), t);
			r.position.set(n, -.08, .3), r.rotation.x = .12, r.name = "Apron_Skirt", e.add(r);
		}
		let i = new k(new M(.5, .06, .06), n);
		return i.position.set(0, .11, .32), e.add(i), e;
	},
	kettle: () => {
		let e = new O();
		e.name = "Kettle_Hat";
		let t = R(7828334, .6, .55), n = R(5657166, .6, .6), r = R(10103326, 0, .9), i = new k(new me(.6, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2), t);
		i.scale.set(1, .72, 1), i.position.set(0, .6, .02), e.add(i);
		let a = new k(new D(.62, .9, .12, 16, 1, !0), n);
		a.position.set(0, .56, .02), e.add(a);
		let o = new k(new D(.62, .9, .12, 16, 1, !0), n);
		o.material = n.clone(), o.material.side = 1, o.position.copy(a.position), e.add(o);
		let s = new k(new D(.615, .615, .12, 16), r);
		return s.position.set(0, .68, .02), e.add(s), e.traverse((e) => {
			e.isMesh && (e.name = "Kettle_Hat");
		}), e;
	},
	reedhat: () => {
		let e = new O();
		e.name = "Reed_Hat";
		let t = R(10521170, 0, .95), n = R(4872756, 0, .9), r = new k(new nt(1, .42, 14, 1, !0), t);
		r.position.set(0, .78, .02), e.add(r);
		let i = new k(new nt(1, .42, 14, 1, !0), t.clone());
		i.material.side = 1, i.position.copy(r.position), e.add(i);
		let a = new k(new D(.5, .56, .08, 14), n);
		return a.position.set(0, .62, .02), e.add(a), e.traverse((e) => {
			e.isMesh && (e.name = "Reed_Hat");
		}), e;
	},
	rag: () => {
		let e = new O();
		e.name = "Rag";
		let t = R(12610120, 0, .95), n = R(8667178, 0, .95), r = (r, i, a, o, s, c = 0) => s.forEach((l, u) => {
			let d = new k(new M(i / s.length, l, .03), u % 3 == 1 ? n : t);
			d.position.set(r + (u + .5) * (i / s.length) - i / 2, o - l / 2, a), d.rotation.x = c, d.name = "Rag_Cloth", e.add(d);
		});
		for (let n of [-1, 1]) {
			let r = new k(new M(.26, .025, .5), t);
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
		let e = new O();
		e.name = "Billhook";
		let t = R(6967862, 0, .85), r = R(5593180, .8, .45), i = new k(new D(.04, .05, 1.9, 7), t);
		i.position.y = .45, e.add(i);
		let a = new k(new M(.06, .46, .2), r);
		a.position.set(0, 1.5, .08), e.add(a);
		let o = new k(new n(.12, .035, 5, 10, Math.PI * .9), r);
		return o.position.set(0, 1.72, .2), o.rotation.y = Math.PI / 2, e.add(o), e;
	},
	cagepole: () => {
		let e = new O();
		e.name = "Cagepole";
		let t = R(3023904, 0, .85), n = R(3814964, .75, .45), r = new l({
			color: 13154559,
			emissive: 7360720,
			emissiveIntensity: 1.3,
			roughness: .3
		}), i = new k(new D(.04, .05, 2, 7), t);
		i.position.y = .45, e.add(i);
		let a = new k(new nt(.2, .16, 6), n);
		a.position.y = 1.98, e.add(a);
		let o = new k(new D(.18, .18, .04, 6), n);
		o.position.y = 1.5, e.add(o);
		for (let t = 0; t < 6; t++) {
			let r = t * Math.PI / 3, i = new k(new M(.03, .42, .03), n);
			i.position.set(Math.cos(r) * .17, 1.71, Math.sin(r) * .17), e.add(i);
		}
		let s = new k(new _(.11, 1), r);
		return s.position.y = 1.7, s.name = "Cage_Soul", s.userData.glow = 12099839, e.add(s), e;
	},
	boathook: () => {
		let e = new O();
		e.name = "Boathook";
		let t = R(4076070, 0, .85), r = R(4869198, .8, .45), i = R(9075282, 0, .95), a = new k(new D(.045, .055, 2.1, 7), t);
		a.position.y = .5, e.add(a);
		let o = new k(new nt(.06, .34, 6), r);
		o.position.y = 1.72, e.add(o);
		let s = new k(new n(.15, .04, 5, 10, Math.PI * 1.1), r);
		s.position.set(0, 1.5, .15), s.rotation.set(0, Math.PI / 2, Math.PI * .55), e.add(s);
		let c = new k(new n(.08, .025, 5, 10), i);
		return c.rotation.x = Math.PI / 2, c.position.y = .05, e.add(c), e;
	},
	choirlamp: () => {
		let e = new O();
		e.name = "Choirlamp", e.userData.hang = !0;
		let t = R(12106944, .7, .4), r = new l({
			color: 14741759,
			emissive: 6328528,
			emissiveIntensity: 1.4,
			roughness: .3
		}), i = new k(new n(.1, .02, 6, 12), t);
		i.position.y = .1, e.add(i);
		let a = new k(new nt(.17, .16, 6), t);
		a.rotation.z = Math.PI, a.position.y = .26, e.add(a);
		for (let n = 0; n < 6; n++) {
			let r = n * Math.PI / 3, i = new k(new M(.025, .4, .025), t);
			i.position.set(Math.cos(r) * .15, .52, Math.sin(r) * .15), e.add(i);
		}
		let o = new k(new _(.11, 1), r);
		o.position.y = .52, o.name = "Choir_Light", o.userData.glow = 13164799, e.add(o);
		let s = new k(new D(.17, .12, .06, 6), t);
		return s.position.y = .74, e.add(s), e;
	},
	marshlamp: () => {
		let e = new O();
		e.name = "Marshlamp", e.userData.hang = !0;
		let t = R(4866096, 0, .9), r = new l({
			color: 14217416,
			emissive: 7385200,
			emissiveIntensity: 1.3,
			roughness: .3
		}), i = new k(new D(.012, .012, .2, 4), t);
		i.position.y = .1, e.add(i);
		let a = new k(new _(.12, 1), r);
		a.position.y = .36, a.name = "Marsh_Light", a.userData.glow = 13168832, e.add(a);
		for (let r = 0; r < 5; r++) {
			let i = r * Math.PI * .4, a = new k(new n(.15, .014, 4, 10, Math.PI * 1.1), t);
			a.position.y = .36, a.rotation.set(Math.PI / 2, i, .3), e.add(a);
		}
		return e;
	},
	crook: () => {
		let e = new O();
		e.name = "Crook", e.userData.hang = "up";
		let t = R(4864552, 0, .9), r = new k(new D(.035, .045, 1.8, 6), t);
		r.position.y = .3, r.rotation.z = .04, e.add(r);
		let i = new k(new n(.13, .035, 5, 10, Math.PI * 1.2), t);
		return i.position.set(.12, 1.22, 0), e.add(i), e;
	},
	habit: () => {
		let e = new O();
		e.name = "Habit";
		let t = R(9079940, 0, .95), r = R(6185050, 0, .95), i = R(4876850, 0, .9), a = new k(new n(.24, .09, 6, 12), t);
		a.rotation.x = Math.PI / 2, a.position.y = .2, a.name = "Habit_Cloth", e.add(a);
		for (let [n, i] of [[.22, .1], [-.24, -.08]]) for (let a = 0; a < 5; a++) {
			let o = .62 + a * 7 % 5 * .06, s = new k(new M(.1, o, .03), a % 2 ? r : t);
			s.position.set(-.2 + a * .1, .16 - o / 2, n), s.rotation.x = i, s.name = "Habit_Cloth", e.add(s);
		}
		for (let [t, n, r] of [
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
			let a = new k(new M(.035, r, .02), i);
			a.position.set(t, .12 - r / 2, n), a.rotation.z = (t > 0 ? 1 : -1) * .12, e.add(a);
		}
		return e;
	},
	huntbow: () => Nc({
		name: "Hunting_Bow",
		half: .7,
		draw: .2,
		curl: .08,
		wood: 9067058,
		nock: 3022616,
		r: .045
	}),
	longbow: () => Nc({
		name: "Yew_Longbow",
		half: 1,
		draw: .24,
		curl: 0,
		wood: 11565632,
		nock: 15260864,
		r: .042
	})
};
function Nc({ name: e, half: t, draw: n, curl: r, wood: i, nock: a, r: o }) {
	let s = new O();
	s.name = e;
	let c = R(i, 0, .75), l = R(a, .1, .5), u = R(3022616, 0, .9), d = R(15129800, 0, .8), f = (i) => {
		let a = [
			0,
			.25,
			.5,
			.75,
			1
		].map((e) => new j(-n * e * e + r * Math.max(0, e - .75) * 4, i * t * e, 0)), u = new $e(new Ke(a), 12, o, 6, !1), d = u.attributes.position;
		for (let e = 0; e < d.count; e++) {
			let n = d.getY(e), r = Math.min(1, Math.abs(n) / t), i = 1 - .55 * r, o = a[Math.round(r * 4)];
			d.setX(e, o.x + (d.getX(e) - o.x) * i), d.setZ(e, d.getZ(e) * i);
		}
		let f = new k(u, c);
		f.name = e + "_Limb", s.add(f);
		let p = new k(new me(o * .9, 8, 6), l);
		return p.position.copy(a[4]), p.name = e + "_Nock", s.add(p), a[4];
	}, p = f(1), m = f(-1), h = new k(new D(o * 1.5, o * 1.5, .24, 8), u);
	h.name = e + "_Grip", s.add(h);
	let g = new k(new D(.008, .008, p.distanceTo(m), 4), d);
	return g.position.set((p.x + m.x) / 2, 0, 0), g.name = e + "_String", s.add(g), s;
}
function Pc(e, t) {
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
function Fc(e, t) {
	let n = /* @__PURE__ */ new Map();
	e.traverse((e) => {
		if (!e.isMesh || !e.material.map || /Eyes/.test(e.name)) return;
		let r = n.get(e.material);
		if (!r) {
			let i = e.material.map, a = new Ee(Pc(i.image, t));
			a.flipY = i.flipY, a.colorSpace = i.colorSpace, a.magFilter = i.magFilter, a.minFilter = i.minFilter, a.wrapS = i.wrapS, a.wrapT = i.wrapT, r = e.material.clone(), r.map = a, n.set(e.material, r);
		}
		e.material = r;
	});
}
//#endregion
//#region ember3d/faces.js
var Ic = /* @__PURE__ */ e({
	HAIR: () => Bc,
	IRIS: () => Vc,
	SHAPES: () => il,
	SKIN: () => zc,
	buildFace: () => Ol,
	kkHead: () => Wc,
	shellOf: () => al
}), Lc = (e, t) => `${Math.floor(e * 8)},${Math.floor(t * 4)}`, Rc = (e, t = .8, n = 0) => new l({
	color: e,
	roughness: t,
	metalness: n
}), zc = {
	porcelain: "#f2d2bc",
	fair: "#e8b896",
	rose: "#dca088",
	olive: "#c89a6c",
	tan: "#b07850",
	umber: "#8a5a3a",
	deep: "#6c4430"
}, Bc = {
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
}, Vc = {
	brown: "#5a3218",
	hazel: "#7a6a30",
	green: "#4a7a3a",
	blue: "#4a74b0",
	grey: "#7a8894",
	amber: "#b07820"
}, Hc = (e, t, n) => new A(e[t] || t || n), Uc = /* @__PURE__ */ new Map();
async function Wc(e, t) {
	if (Uc.has(t)) return Uc.get(t);
	let n = await e(`./models/${t}.glb`);
	n.scene.updateMatrixWorld(!0);
	let r = null;
	n.scene.traverse((e) => {
		e.isSkinnedMesh && /Head/.test(e.name) && (r = e);
	});
	let i = r.skeleton, a = i.bones.findIndex((e) => e.name === "head"), o = i.boneInverses[a].clone().multiply(r.bindMatrix), s = r.geometry, c = s.attributes.position, l = s.attributes.normal, u = s.attributes.uv, d = s.index, f = (e) => d ? d.getX(e) : e, p = (d ? d.count : c.count) / 3, m = new rt().getNormalMatrix(o), h = {};
	for (let e = 0; e < p; e++) {
		let t = 0, n = 0;
		for (let r = 0; r < 3; r++) {
			let i = f(e * 3 + r);
			t += u.getX(i) / 3, n += u.getY(i) / 3;
		}
		(h[Lc(t, n)] ||= []).push(e);
	}
	let g = new j(), _ = new j(), v = {};
	for (let [e, t] of Object.entries(h)) {
		let n = [], r = [], i = [];
		for (let e of t) for (let t = 0; t < 3; t++) {
			let a = f(e * 3 + t);
			g.fromBufferAttribute(c, a).applyMatrix4(o), n.push(g.x, g.y, g.z), _.fromBufferAttribute(l, a).applyMatrix3(m).normalize(), r.push(_.x, _.y, _.z), i.push(u.getX(a), u.getY(a));
		}
		let a = new Le();
		a.setAttribute("position", new re(n, 3)), a.setAttribute("normal", new re(r, 3)), a.setAttribute("uv", new re(i, 2)), v[e] = a;
	}
	let y = {
		parts: v,
		material: r.material,
		headName: r.name
	};
	return Uc.set(t, y), y;
}
function Gc(e, t, n = null, r = !0) {
	let i = e.attributes.position, a = e.attributes.normal, o = e.attributes.uv, s = [], c = [], l = [], u = new j(), d = new j(), f = new j(), p = new j(), m = new j();
	for (let e = 0; e < i.count; e += 3) {
		d.set(0, 0, 0);
		for (let t = 0; t < 3; t++) d.add(u.fromBufferAttribute(i, e + t));
		if (d.multiplyScalar(1 / 3), u.fromBufferAttribute(i, e), p.fromBufferAttribute(i, e + 1).sub(u), m.fromBufferAttribute(i, e + 2).sub(u), f.crossVectors(p, m).normalize(), t(d, f)) for (let t = 0; t < 3; t++) u.fromBufferAttribute(i, e + t), n && n(u), s.push(u.x, u.y, u.z), c.push(a.getX(e + t), a.getY(e + t), a.getZ(e + t)), o && l.push(o.getX(e + t), o.getY(e + t));
	}
	let h = new Le();
	return h.setAttribute("position", new re(s, 3)), h.setAttribute("normal", new re(c, 3)), o && h.setAttribute("uv", new re(l, 2)), n && r && h.computeVertexNormals(), h;
}
function Kc(...e) {
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
		t[n] = new re(a, i);
	}
	let n = new Le();
	for (let [e, r] of Object.entries(t)) n.setAttribute(e, r);
	return n;
}
var qc = null, Jc = (e) => Math.abs(e.x) < .11 && e.y > .17 && e.y < .46 && e.z > .44, Yc = (e, t) => Math.abs(e.x) < .17 && e.y > .1 && e.y < .2 && e.z > .34 && e.z < .5 && t.y > .35;
async function Xc(e) {
	if (qc) return qc;
	let t = await Wc(e, "Knight"), n = await Wc(e, "Barbarian"), r = Kc(Gc(t.parts["0,0"], (e) => e.z > .05 && e.y < .6), Gc(n.parts["0,0"], (e) => !(Math.abs(e.x) < .36 && e.z > .2 && e.y < .5)));
	return qc = {
		skin: Gc(r, (e, t) => !Yc(e, t)),
		wedge: Gc(r, Yc),
		whole: r,
		nose: Gc(r, Jc),
		noNose: Gc(r, (e, t) => !Yc(e, t) && !Jc(e))
	}, qc;
}
var Zc = new j(0, .42, -.02), Qc = (e) => (t) => {
	let n = typeof e == "function" ? e(t) : e;
	t.sub(Zc).multiplyScalar(1 + n).add(Zc);
}, $c = (e) => e.z > .3 && e.y > .4 && e.y < .62 && Math.abs(e.x) < .38, el = (e) => Math.abs(e.x) > .46 && e.y > .12 && e.y < .52 && e.z > -.2 && e.z < .2, tl = (e, t, n) => {
	let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}, nl = (e, t, n) => e + (t - e) * n, rl = (e, t, n) => Math.exp(-((e - t) / n) * ((e - t) / n)), il = {
	normal: null,
	thin: (e) => {
		e.x *= .86, e.z = -.02 + (e.z + .02) * .97;
	},
	thick: (e) => {
		e.x *= 1.15, e.z = -.02 + (e.z + .02) * 1.05;
	},
	round: (e) => {
		e.x *= 1.08 * (1 + .07 * rl(e.y, .25, .22)), e.y = .5 + (e.y - .5) * .92;
	},
	oblong: (e) => {
		e.y *= 1.13, e.x *= .92;
	},
	pear: (e) => {
		e.x *= nl(1.17, .85, tl(.02, .95, e.y));
	}
}, al = (e, t, n) => Gc(e, t, Qc(n));
function ol(e) {
	let t = new k(e, new it({ side: 2 })), n = new i();
	return (e, r, i = new j(0, 0, -1)) => {
		n.set(new j(e, r, 0).addScaledVector(i, -3), i);
		let a = n.intersectObject(t)[0];
		if (!a) return {
			p: new j(e, r, .45),
			n: new j(0, 0, 1)
		};
		let o = a.face.normal.clone();
		return o.dot(i) > 0 && o.negate(), {
			p: a.point.clone(),
			n: o
		};
	};
}
var sl = (e, t) => (e.quaternion.setFromUnitVectors(new j(0, 0, 1), t), e);
function cl(e, t, n, r, i = .012, a = 5) {
	let o = t.map(([t, n]) => {
		let r = e(t, n);
		return r.p.addScaledVector(r.n, i);
	}), s = new Ke(o), c = new $e(s, Math.max(4, t.length * 2), n, a, !1), l = new k(c, r);
	return l.scale.set(1, 1, 1), l;
}
var ll = (e, t, n, r = 7) => Array.from({ length: r }, (i, a) => {
	let o = -1 + 2 * a / (r - 1);
	return [o * e, t + n(o)];
}), ul = {
	x: .17,
	y: .365
}, dl = {
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
function fl(e, t, r, i) {
	let a = new O(), o = dl[t.eyes] || dl.round, s = .068;
	for (let t of [-1, 1]) {
		let { p: c, n: l } = e(t * ul.x, ul.y), u = sl(new O(), l);
		if (u.position.copy(c), u.rotation.z += t * o.tilt, i) {
			let e = new k(new me(s, 10, 6), r.lash);
			e.scale.set(1.15 * o.w, 1.1 * Math.min(1, o.h + .1), .4), u.add(e), e.userData.part = t < 0 ? "eyeA" : "eyeB", a.add(u);
			continue;
		}
		{
			let e = new k(new me(s, 14, 8), r.white);
			e.scale.set(o.w, .66 * o.h, .32), u.add(e);
			let i = new k(new ze(s * .56, 14), r.iris);
			i.position.z = s * .33, i.position.y = -.00272, u.add(i);
			let a = new k(new ze(s * .26, 10), r.pupil);
			a.position.set(0, -.00272, s * .335), u.add(a);
			let c = new k(new ze(s * .12, 6), r.glint);
			if (c.position.set(s * .16 * -t, s * .14, s * .34), u.add(c), o.fold) {
				let e = new k(new n(s * o.w * 1.02, s * .07, 3, 12, Math.PI * .8), r.crease);
				e.rotation.z = Math.PI * .1, e.scale.set(1, .66 * o.h + .28, 1), e.position.set(0, s * .1, s * .12), u.add(e);
			}
		}
		let d = new k(new n(s * o.w, s * .17 * (o.lash ?? 1), 4, 12, Math.PI * .9), r.lash);
		if (d.rotation.z = Math.PI * .05, d.scale.set(1, .66 * o.h, 1), d.position.z = s * .24, u.add(d), o.lower && !i) {
			let e = new k(new n(s * o.w * .86, s * .06, 3, 10, Math.PI * .6), r.crease);
			e.rotation.z = Math.PI * 1.2, e.scale.set(1, .42 * o.h, 1), e.position.set(0, -.00544, s * .2), u.add(e);
		}
		u.traverse((e) => {
			e.isMesh && (e.userData.part = t < 0 ? "eyeA" : "eyeB");
		}), a.add(u);
	}
	return a;
}
var pl = {
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
function ml(e, t, n) {
	let r = new O(), i = pl[t.brows] || pl.straight;
	for (let a of [-1, 1]) {
		let o = Array.from({ length: 5 }, (e, t) => {
			let n = t / 4;
			return [a * (.07 + .2 * n), .475 + i.y(n)];
		});
		r.add(cl(e, o, i.r * (t.browWeight ?? 1), n.brow, .018));
	}
	return r;
}
var hl = {
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
}, gl = .168;
function _l(e, t, n, r) {
	let i = new O(), a = hl[t.mouth] || hl.line, o = a.w * (t.mouthWidth ?? 1);
	if (i.add(cl(e, ll(o, gl, a.f, 7), r ? .011 : a.thin ? .012 : .017, n.mouth, .016)), a.open) {
		let { p: t, n: r } = e(0, .156), s = sl(new k(new me(o * .55, 10, 6), n.pupil), r);
		s.position.copy(t), s.scale.set(1, .42 * a.open, .25), i.add(s);
	}
	return i;
}
function vl(e) {
	let t = new b(.3, .36, 8, 10), n = t.attributes.position;
	for (let t = 0; t < n.count; t++) {
		let r = n.getX(t), i = n.getY(t) + .31, a = (e(-.16, i).p.z + e(.16, i).p.z) / 2;
		n.setXYZ(t, r, i, a + .018 * (1 - (r / .15) ** 2) * (1 - ((i - .31) / .18) ** 2));
	}
	return t.computeVertexNormals(), t.toNonIndexed();
}
var yl = {
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
function bl(e, t, n) {
	let r = new O(), i = yl[t.nose];
	if (!i) return r;
	let a = e(0, .43).p, o = e(0, i.tipY).p, s = new j(0, i.tipY + (i.up || 0) - (i.droop || 0), o.z + i.out), c = (e, t, r, i) => {
		let a = new k(new D(r, i, e.distanceTo(t), 6), n.skin);
		return a.position.copy(e).add(t).multiplyScalar(.5), a.quaternion.setFromUnitVectors(new j(0, 1, 0), e.clone().sub(t).normalize()), a;
	}, l = a.clone().lerp(s, .5);
	if (i.hump && (l.z += i.hump), r.add(c(a.clone().setZ(a.z - .01), l, i.bridge * .7, i.bridge), c(l, s, i.bridge, i.tip * .9)), i.hump) {
		let e = new k(new _(i.bridge * 1.05, 1), n.skin);
		e.position.copy(l), r.add(e);
	}
	let u = new k(new _(i.tip, 1), n.skin);
	u.position.copy(s), u.scale.set(1.05, .9, .9), r.add(u);
	for (let e of [-1, 1]) {
		let t = new k(new _(i.wing, 1), n.skin);
		t.position.set(e * i.tip * 1.05, s.y - i.tip * .35, s.z - i.out * .45), t.scale.set(1, .8, .9), r.add(t);
		let a = new k(new ze(i.wing * .42, 6), n.crease);
		a.rotation.x = Math.PI / 2, a.position.set(e * i.tip * .6, s.y - i.tip * .85, s.z - i.out * .25), r.add(a);
	}
	return r;
}
function xl(e, t, n) {
	return (r) => {
		if (el(r)) return !1;
		let i = tl(-.25, .3, r.z), a = nl(n, nl(t, e, tl(.15, .38, r.z)), i);
		return r.y > a;
	};
}
var Sl = {
	bald: null,
	crop: {
		line: xl(.72, .44, .1),
		grow: .035
	},
	short: {
		line: xl(.66, .4, .05),
		grow: (e) => .04 + .03 * tl(.6, .95, e.y)
	},
	receding: {
		line: (e) => xl(.86, .44, .1)(e) && !(e.z > .2 && e.y < .9 && Math.abs(e.x) < .3 + (e.y - .72) * 1.2),
		grow: .03
	},
	crest: {
		line: (e) => Math.abs(e.x) < .14 && e.y > .5 && !el(e),
		grow: (e) => .03 + .14 * tl(.55, .95, e.y)
	},
	bun: {
		line: xl(.7, .42, .12),
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
		line: xl(.72, .44, .1),
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
		line: xl(.7, .42, .08),
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
async function Cl(e, t, r, i, a = null) {
	let o = (e) => {
		let t = new j(...e);
		return a && a(t), t;
	}, s = new O(), c = Sl[r.hair ?? "crop"];
	if (!c) return s;
	if (c.kk) {
		let t = await Wc(e, c.kk);
		return s.add(new k(Gc(t.parts["1,0"], (e) => !$c(e), (e) => {
			a && a(e), Qc(.05)(e);
		}), i.hair)), c.tie && t.parts["1,1"] && s.add(new k(a ? Gc(t.parts["1,1"], () => !0, a) : t.parts["1,1"], i.tie)), s;
	}
	if (s.add(new k(Gc(t, c.line, Qc(c.grow)), i.hair)), c.knot) {
		let e = new k(new _(c.knot.r, 1), i.hair);
		e.position.copy(o(c.knot.at)), s.add(e);
		let t = new k(new n(c.knot.r * .62, .025, 4, 10), i.tie);
		t.position.copy(o(c.knot.at)), t.position.z += c.knot.at[2] < -.2 ? c.knot.r * .55 : 0, t.position.y -= c.knot.at[2] < -.2 ? 0 : c.knot.r * .6, c.knot.at[2] >= -.2 && (t.rotation.x = Math.PI / 2), s.add(e, t);
	}
	if (c.braid) {
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
			let n = new k(new _(.1 - t * .008, 0), i.hair);
			n.position.copy(o(e)), n.rotation.set(t, t * .7, 0), s.add(n);
		});
		let e = new k(new n(.05, .022, 4, 8), i.tie);
		e.position.copy(o([
			.35,
			-.62,
			.2
		])), e.rotation.x = Math.PI / 2, s.add(e);
	}
	return s;
}
var wl = (e) => e.y < .3 && e.z > -.22 && !el(e) && !(Math.abs(e.x) < .14 && e.y > .1 && e.y < .26 && e.z > .3);
async function Tl(e, t, n, r, i, a = null) {
	let o = new O(), s = r.beard;
	if (!s) return o;
	if (s === "stubble" && o.add(new k(Gc(t, wl, Qc(.008)), i.stubble)), (s === "short" || s === "goatee") && o.add(new k(Gc(t, s === "goatee" ? (e) => wl(e) && Math.abs(e.x) < .16 && e.y < .14 && e.z > .2 : wl, Qc((e) => .04 + .05 * tl(.2, -.05, e.y))), i.beard)), s === "full") {
		let t = await Wc(e, "Barbarian");
		o.add(new k(Gc(t.parts["1,0"], (e) => !$c(e), (e) => {
			a && a(e), Qc(.01)(e);
		}), i.beard));
	}
	return (s === "short" || s === "goatee" || s === "mustache") && o.add(cl(n, ll(.13, .225, (e) => -.035 * e * e + (s === "mustache" ? -.02 * e * e * e * e : 0), 7), .028, i.beard, .02)), o;
}
function El(e, t, r) {
	let i = new O();
	for (let a of t.marks || []) {
		if (a === "scar" && i.add(cl(e, [[.1, .58], [.13, .5]], .012, r.scar, .02, 4), cl(e, [[.2, .3], [.24, .2]], .012, r.scar, .016, 4)), a === "scar_cheek" && i.add(cl(e, [
			[-.32, .3],
			[-.26, .25],
			[-.2, .21]
		], .012, r.scar, .014, 4)), a === "freckles") for (let [t, n] of [
			[.2, .27],
			[.26, .24],
			[.15, .24],
			[.23, .2],
			[.3, .28],
			[.18, .3]
		]) for (let a of [-1, 1]) {
			let { p: o, n: s } = e(a * t, n), c = sl(new k(new ze(.011, 5), r.freckle), s);
			c.position.copy(o).addScaledVector(s, .006), i.add(c);
		}
		if (a === "blush") for (let t of [-1, 1]) {
			let { p: n, n: a } = e(t * .25, .235), o = sl(new k(new ze(.06, 10), r.blush), a);
			o.position.copy(n).addScaledVector(a, .004), o.scale.y = .6, i.add(o);
		}
		if (a === "wrinkles") {
			for (let t of [-1, 1]) i.add(cl(e, [[t * .262, ul.y - .015], [t * .292, ul.y - .035]], .005, r.crease, .01, 3));
			i.add(cl(e, ll(.14, .62, (e) => .01 * (1 - e * e)), .005, r.crease, .01, 3));
			for (let t of [-1, 1]) i.add(cl(e, [
				[t * .1, .26],
				[t * .14, .2],
				[t * .145, .16]
			], .006, r.crease, .01, 3));
		}
		if (a === "eyepatch") {
			let { p: t, n } = e(.17, ul.y), a = sl(new k(new ze(.1, 10), r.patch), n);
			a.position.copy(t).addScaledVector(n, .05), a.scale.y = .85, i.add(a), i.add(cl(e, [
				[-.4, .62],
				[-.1, .55],
				[.17, ul.y + .05],
				[.44, .35]
			], .013, r.patch, .03, 4));
		}
		if (a === "earring") {
			let e = new k(new n(.035, .012, 5, 10), r.gold);
			e.position.set(.52, .18, .02), e.rotation.y = Math.PI / 2, i.add(e);
		}
	}
	return i;
}
function Dl(e, t, n) {
	let r = new O();
	if (e.ears !== "pointed") return r;
	let i = e.earSize || 1.2, a = .62 * i, o = .15 * i;
	for (let e of [-1, 1]) {
		let s = new j(e * .5, .33, -.04);
		n && n(s);
		let c = new j(e, .5, -.6).normalize(), l = new j(0, .35, 1), u = l.addScaledVector(c, -l.dot(c)).normalize(), d = new j().crossVectors(c, u), f = new p().setFromRotationMatrix(new at().makeBasis(d, c, u)), m = (e, t, n, r) => {
			let a = new k(new nt(e, t, 8), n);
			return a.quaternion.copy(f), a.scale.set(1, 1, .32), a.position.copy(s).addScaledVector(c, t / 2 - .06 * i).addScaledVector(u, r), a;
		};
		r.add(m(o, a, t.skin, 0), m(o * .55, a * .72, t.earIn, o * .2));
	}
	return r;
}
Object.keys(Sl), Object.keys(dl), Object.keys(pl), Object.keys(hl), [...Object.keys(yl)], Object.keys(zc), Object.keys(Vc), Object.keys(il);
async function Ol(e, t, n, { far: r = !1 } = {}) {
	let i = n.skull === "own", a = i ? await Wc(e, t) : null, o = await Wc(e, t), s = Hc(zc, n.skin, zc.fair), c = Hc(Bc, n.hairColor, Bc.brown), l = {
		skin: Rc(s, .72),
		hair: Rc(c, .85),
		brow: Rc(Hc(Bc, n.browColor, c.clone().multiplyScalar(.72)), .9),
		beard: Rc(Hc(Bc, n.beardColor, c), .9),
		stubble: Rc(s.clone().multiplyScalar(.7).lerp(Hc(Bc, n.beardColor, c), .35), 1),
		white: Rc("#f2ece2", .35),
		iris: Rc(Hc(Vc, n.iris, Vc.brown), .3),
		pupil: Rc("#120c0a", .4),
		glint: new it({ color: "#ffffff" }),
		lash: Rc("#1c120e", .8),
		lid: Rc(s.clone().multiplyScalar(.94), .72),
		crease: Rc(s.clone().multiplyScalar(.78), .95),
		mouth: Rc(s.clone().lerp(new A("#3a1210"), .7), .95),
		lip: Rc(s.clone().multiplyScalar(.86).lerp(new A("#a04a40"), .22), .95),
		scar: Rc(s.clone().multiplyScalar(.72).lerp(new A("#a04a44"), .35), .9),
		freckle: Rc(s.clone().lerp(new A("#6a2a10"), .5), .9),
		blush: Rc(s.clone().lerp(new A("#e05a58"), .4), .8),
		patch: Rc("#1a1414", .7),
		gold: Rc("#d8a848", .3, .8),
		tie: Rc(Hc(Bc, n.tieColor, "#6a3a22"), .8),
		earIn: Rc(s.clone().multiplyScalar(.62).lerp(new A("#7a3a34"), .25), .9)
	}, u = new O();
	u.name = "Face";
	let d = il[n.shape], f = (e) => d && e ? Gc(e, () => !0, d, !1) : e, p = i ? null : await Xc(e), m = p && {
		skin: f(p.skin),
		wedge: f(p.wedge),
		whole: f(p.whole),
		noNose: f(p.noNose)
	}, h = i ? f(a.parts["0,0"]) : m.whole, g = i || !yl[n.nose], _ = g ? null : f(vl(ol(p.whole))), v = (e, t) => (e.traverse((e) => {
		e.isMesh && !e.userData.part && (e.userData.part = t);
	}), e);
	if (u.add(v(new k(i ? h : g ? m.skin : m.noNose, l.skin), "skin")), _ && u.add(v(new k(_, l.skin), "skin")), m && u.add(v(new k(m.wedge, r ? l.skin : l.lip), "skin")), i) for (let e of n.keep || ["1,1"]) a.parts[e] && u.add(new k(f(a.parts[e]), a.material));
	let y = ol(g ? h : Kc(m.noNose, m.wedge, _)), b = d ? (e, t, n) => {
		let r = new j(e, t, .45);
		return d(r), y(r.x, r.y, n);
	} : y;
	return u.add(v(fl(b, n, l, r), "eye"), v(ml(b, n, l), "brow"), v(_l(b, n, l, r), "mouth"), v(bl(b, n, l), "skin"), v(await Tl(e, h, b, n, l, d), "hair")), u.add(v(Dl(n, l, d), "skin")), r || u.add(El(b, n, l)), i || u.add(v(await Cl(e, h, n, l, d), "hair")), u.traverse((e) => {
		e.isMesh && (e.frustumCulled = !1, e.userData.face = !0);
	}), {
		head: u,
		replaces: [o.headName],
		skull: h,
		on: b
	};
}
//#endregion
//#region ember3d/body.js
var z = (e, t, n) => new j(e, t, n), kl = (e, t, n) => {
	let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}, Al = (e, t, n) => e + (t - e) * n, jl = (e, t = .8, n = 0) => new l({
	color: e,
	roughness: t,
	metalness: n
}), Ml = {
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
}, Nl = class {
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
		return z(this.P[e * 3], this.P[e * 3 + 1], this.P[e * 3 + 2]);
	}
	tri(e, t, n, r) {
		let i = this.p(e);
		this.p(t).sub(i).cross(this.p(n).sub(i)).dot(i.clone().add(this.p(t)).add(this.p(n)).multiplyScalar(1 / 3).sub(r)) < 0 ? this.idx.push(e, n, t) : this.idx.push(e, t, n);
	}
	mesh(e, t, n) {
		let r = new Le();
		r.setAttribute("position", new re(this.P, 3)), r.setAttribute("skinIndex", new He(this.SI, 4)), r.setAttribute("skinWeight", new re(this.SW, 4)), r.setIndex(this.idx), r.computeVertexNormals();
		let i = new Ye(r, e);
		return i.bind(t, n), i.frustumCulled = !1, i.userData.body = !0, i;
	}
};
function Pl(e, t, n, r, i, a, o, s, c = 0) {
	let l = [];
	for (let u = 0; u < o; u++) {
		let d = 2 * Math.PI * u / o, f = Math.sin(d), p = t.clone().addScaledVector(n, Math.cos(d) * i).addScaledVector(r, f * a + (f > 0 ? c * f : 0));
		l.push(e.v(p, s));
	}
	return l;
}
function Fl(e, t, n, r, i) {
	let a = t.length, o = r.clone().add(i).multiplyScalar(.5);
	for (let r = 0; r < a; r++) {
		let i = (r + 1) % a;
		e.tri(t[r], t[i], n[i], o), e.tri(t[r], n[i], n[r], o);
	}
}
function Il(e, t, n, r, i) {
	let a = e.v(n, r), o = n.clone().sub(i.clone().multiplyScalar(.1));
	for (let n = 0; n < t.length; n++) e.tri(a, t[n], t[(n + 1) % t.length], o);
}
function Ll(e, t, n, r, i = 8, { caps: a = [!0, !0], steps: o = 3 } = {}) {
	let s = null, c = null, l = (a, o) => {
		let s = t[a], c = t[Math.min(a + 1, t.length - 1)], l = s.p.clone().lerp(c.p, o), u = [Al(s.r[0], c.r[0], o), Al(s.r[1], c.r[1], o)], d = [[s.bone, 1]];
		if (a + 1 < t.length - 1 || a + 1 === t.length - 1 && t[a + 1].bone !== s.bone) {
			let e = kl(.62, 1, o) * .5;
			d[0][1] -= e, d.push([c.bone, e]);
		}
		if (a > 0) {
			let e = (1 - kl(0, .38, o)) * .5;
			d[0][1] -= e, d.push([t[a - 1].bone, e]);
		}
		return {
			c: l,
			r: Pl(e, l, n, r, u[0], u[1], i, d),
			w: d
		};
	}, u = [];
	for (let e = 0; e < t.length - 1; e++) for (let t = 0; t < o; t++) u.push(l(e, t / o));
	u.push(l(t.length - 2, 1));
	for (let t of u) s && Fl(e, s.r, t.r, c, t.c), s = t, c = t.c;
	let d = t[t.length - 1].p.clone().sub(t[0].p).normalize();
	a[0] && Il(e, u[0].r, u[0].c, u[0].w, d.clone().negate()), a[1] && Il(e, u[u.length - 1].r, u[u.length - 1].c, u[u.length - 1].w, d);
}
var Rl = [
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
], zl = (e) => {
	if (e < .55) return [["hips", 1]];
	if (e < .78) {
		let t = kl(.55, .78, e);
		return [["hips", 1 - t], ["spine", t]];
	}
	if (e < .98) {
		let t = kl(.78, .98, e);
		return [["spine", 1 - t], ["chest", t]];
	}
	return [["chest", 1]];
};
function Bl(e, t, { y0: n = .36, y1: r = 1.25, grow: i = 0, seg: a = 12, capBottom: o = !0, capTop: s = !0, flare: c = 0 } = {}) {
	let l = Rl.filter(([e]) => e >= n - 1e-6 && e <= r + 1e-6), u = z(1, 0, 0), d = z(0, 0, 1), f = null, p = null, m = null;
	for (let [n, r, o] of l) {
		let s = t.belly * kl(.55, .7, n) * (1 - kl(.85, 1, n)), l = n < .7 ? Al(t.hip, t.w, kl(.46, .7, n)) : t.w, h = z(0, n, 0), g = Pl(e, h, u, d, r * l + i + (n < .5 ? c : 0), o * t.d + i, a, zl(n), s);
		f && Fl(e, f.r, g, f.c, h), f = {
			r: g,
			c: h
		}, p ||= f, m = f;
	}
	o && Il(e, p.r, p.c, zl(p.c.y), z(0, -1, 0)), s && Il(e, m.r, m.c, zl(m.c.y), z(0, 1, 0));
}
function Vl(e, t, { y0: n = .62, y1: r = .1, flare: i = .14, seg: a = 16, grow: o = .02 } = {}) {
	let s = null, [, c, l] = Rl.find(([e]) => e >= n) || Rl[2];
	for (let u = 0; u <= 5; u++) {
		let d = u / 5, f = Al(n, r, d), p = z(0, f, 0), m = c * t.hip + o + i * d, h = l * t.d + o + i * d * .8, g = [];
		for (let t = 0; t < a; t++) {
			let n = 2 * Math.PI * t / a, r = Math.cos(n) * m, i = Math.sin(n) * h, o = kl(-.1, .1, r), s = 1 - kl(.42, .62, f);
			g.push(e.v(z(r, f, i), [
				["hips", 1 - s],
				["upperlegl", s * o],
				["upperlegr", s * (1 - o)]
			]));
		}
		s && Fl(e, s.ids, g, s.c, p), s = {
			ids: g,
			c: p
		};
	}
}
function Hl(e, t, n, r, i, a, o, s = 4, c = 6) {
	let l = [];
	for (let u = 0; u <= c; u++) {
		let d = Al(r, i, u / c), f = [];
		for (let r = 0; r <= s; r++) {
			let i = Al(t, n, r / s);
			f.push(e.v(z(i, d, a(i, d)), o(i, d)));
		}
		l.push(f);
	}
	let u = z(0, (r + i) / 2, 0);
	for (let t = 0; t < c; t++) for (let n = 0; n < s; n++) e.tri(l[t][n], l[t][n + 1], l[t + 1][n + 1], u), e.tri(l[t][n], l[t + 1][n + 1], l[t + 1][n], u);
}
function Ul(e, t, n, r = 0) {
	let i = t.limb, a = r;
	for (let r of [1, -1]) {
		let o = r > 0 ? "l" : "r", s = z(0, 1, 0), c = z(0, 0, 1), l = z(1, 0, 0);
		n.arms && Ll(e, [
			{
				p: z(r * .2, 1.11, 0),
				r: [.11 * i + a, .1 * i + a],
				bone: "upperarm" + o
			},
			{
				p: z(r * .45, 1.11, 0),
				r: [.088 * i + a, .085 * i + a],
				bone: "lowerarm" + o
			},
			{
				p: z(r * n.armTo, 1.11, 0),
				r: [.072 * i + a, .07 * i + a],
				bone: "wrist" + o
			}
		].slice(0, n.armTo > .6 ? 3 : 2), s, c, 8, { caps: [!0, !0] }), n.hands && Ll(e, [
			{
				p: z(r * .7, 1.11, 0),
				r: [.075 * i + a, .07 * i + a],
				bone: "wrist" + o
			},
			{
				p: z(r * .8, 1.11, 0),
				r: [.088 * i + a, .075 * i + a],
				bone: "hand" + o
			},
			{
				p: z(r * .92, 1.09, 0),
				r: [.06 * i + a, .055 * i + a],
				bone: "hand" + o
			}
		], s, c, 8), n.legs && Ll(e, [
			{
				p: z(r * .16, .56, 0),
				r: [.13 * i * t.hip + a, .13 * i + a],
				bone: "upperleg" + o
			},
			{
				p: z(r * .17, .29, .01),
				r: [.1 * i + a, .1 * i + a],
				bone: "lowerleg" + o
			},
			{
				p: z(r * .17, n.legTo, -.01),
				r: [.08 * i + a, .082 * i + a],
				bone: "foot" + o
			}
		], l, c, 8, { caps: [!1, !0] }), n.feet && Ll(e, [
			{
				p: z(r * .17, .065, -.08),
				r: [.085 * i + a, .07 + a],
				bone: "foot" + o
			},
			{
				p: z(r * .17, .065, .05),
				r: [.09 * i + a, .07 + a],
				bone: "toes" + o
			},
			{
				p: z(r * .17, .055, .19),
				r: [.075 * i + a, .055 + a],
				bone: "toes" + o
			}
		], l, z(0, 1, 0), 8);
	}
}
var Wl = {
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
async function Gl(e, t, n, { far: r = !1, findNode: i } = {}) {
	let a = null;
	t.traverse((e) => {
		e.isSkinnedMesh && /Body/.test(e.name) && (a = e);
	});
	let o = a.skeleton, s = a.bindMatrix, c = a.parent;
	t.traverse((e) => {
		e.isMesh && (e.visible = !1);
	});
	let u = Object.fromEntries(o.bones.map((e, t) => [e.name, t])), d = Ml[n.build] || Ml.normal, f = Wl[n.outfit] || Wl.fighter, p = f.colors || {}, m = { ...n.face }, h = n.headgear === void 0 ? f.headgear : n.headgear;
	h && h !== "hat" && ![
		"crop",
		"short",
		"bald",
		void 0
	].includes(m.hair) && (m.hair = "crop");
	let g = m.skin, _ = (e, t) => {
		let n = new Nl(u);
		e(n), n.idx.length && c.add(n.mesh(jl(t, .8), o, s));
	}, { SKIN: v } = await Promise.resolve().then(() => Ic), y = v[g] || g || v.fair;
	_((e) => Bl(e, d), f.top), _((e) => Ul(e, d, {
		arms: !0,
		armTo: .7
	}), f.sleeves), _((e) => Ul(e, d, { hands: !0 }), f.hands || y), _((e) => Ul(e, d, {
		legs: !0,
		legTo: .1
	}), f.legs), _((e) => Ul(e, d, { feet: !0 }), f.boots), _((e) => Ll(e, [
		{
			p: z(0, 1.18, 0),
			r: [.09 * d.limb, .085 * d.limb],
			bone: "chest"
		},
		{
			p: z(0, 1.3, .01),
			r: [.085 * d.limb, .08 * d.limb],
			bone: "head"
		},
		{
			p: z(0, 1.36, .01),
			r: [.08 * d.limb, .075 * d.limb],
			bone: "head"
		}
	], z(1, 0, 0), z(0, 0, 1), 8), y);
	for (let e of f.extras || []) {
		let t = (e) => (t, n) => (Rl.find(([e]) => e >= n) || Rl[Rl.length - 1])[2] * d.d + e + d.belly * kl(.55, .7, n) * (1 - kl(.85, 1, n));
		if (e === "breastplate" && _((e) => Bl(e, d, {
			y0: .62,
			y1: 1.18,
			grow: .03,
			capBottom: !1
		}), p.steel), e === "belt" && _((e) => Bl(e, d, {
			y0: .46,
			y1: .62,
			grow: .035,
			capBottom: !1,
			capTop: !1,
			seg: 14
		}), p.belt), e === "pauldrons" && _((e) => {
			for (let t of [1, -1]) Ll(e, [{
				p: z(t * .2, 1.12, 0),
				r: [.16 * d.limb, .16 * d.d],
				bone: t > 0 ? "upperarml" : "upperarmr"
			}, {
				p: z(t * .36, 1.1, 0),
				r: [.14 * d.limb, .14 * d.d],
				bone: t > 0 ? "upperarml" : "upperarmr"
			}], z(0, 1, 0), z(0, 0, 1), 10);
		}, p.steel), e === "vambraces" && _((e) => {
			for (let t of [1, -1]) Ll(e, [{
				p: z(t * .5, 1.11, 0),
				r: [.1 * d.limb, .098 * d.limb],
				bone: t > 0 ? "lowerarml" : "lowerarmr"
			}, {
				p: z(t * .69, 1.11, 0),
				r: [.085 * d.limb, .083 * d.limb],
				bone: t > 0 ? "lowerarml" : "lowerarmr"
			}], z(0, 1, 0), z(0, 0, 1), 8);
		}, p.steel), e === "greaves" && _((e) => {
			for (let t of [1, -1]) Ll(e, [{
				p: z(t * .17, .31, .01),
				r: [.115 * d.limb, .117 * d.limb],
				bone: t > 0 ? "lowerlegl" : "lowerlegr"
			}, {
				p: z(t * .17, .12, -.01),
				r: [.1 * d.limb, .1 * d.limb],
				bone: t > 0 ? "lowerlegl" : "lowerlegr"
			}], z(1, 0, 0), z(0, 0, 1), 8);
		}, p.steel), e === "pouches" && _((e) => {
			for (let t of [1, -1]) Ll(e, [{
				p: z(t * .27 * d.hip, .5, .12),
				r: [.06, .05],
				bone: "hips"
			}, {
				p: z(t * .27 * d.hip, .4, .12),
				r: [.06, .05],
				bone: "hips"
			}], z(1, 0, 0), z(0, 0, 1), 6);
		}, p.belt), e === "mantle" && _((e) => {
			let t = z(1, 0, 0), n = z(0, 0, 1);
			Fl(e, Pl(e, z(0, 1.24, 0), t, n, .16 * d.w, .14 * d.d, 14, [["chest", 1]]), Pl(e, z(0, 1.02, 0), t, n, .4 * d.w, .3 * d.d, 14, [["chest", 1]]), z(0, 1.24, 0), z(0, 1.02, 0));
		}, p.cloth), e === "robe" && _((e) => Vl(e, d, {
			y1: f.robeTo ?? .08,
			flare: .13
		}), p.robe), e === "tabard") {
			let e = (e, t) => t > .62 ? zl(t) : [["hips", 1]];
			_((n) => Hl(n, -.15, .15, .28, 1.08, t(.05), e), p.cloth), _((n) => {
				Hl(n, -.17, -.14, .28, 1.08, t(.055), e, 1, 6), Hl(n, .14, .17, .28, 1.08, t(.055), e, 1, 6);
			}, p.trim);
		}
		e === "cape" && _((e) => Hl(e, -.3 * d.w, .3 * d.w, .18, 1.16, (e, t) => -((Rl.find(([e]) => e >= t) || Rl[Rl.length - 1])[2] * d.d) - .06 - (1.16 - t) * .12, (e, t) => zl(Math.max(t, .5)), 5, 7), p.cloth);
	}
	let b = i(t, "head"), x = await Ol(e, "Knight", m, { far: r });
	b.add(x.head);
	let S = new O(), C = x.skull, w = (e, t = .8, n = 0) => jl(e, t, n);
	C.computeBoundingBox();
	let T = C.boundingBox, E = (T.max.x - T.min.x) / 2, ee = T.max.y;
	if (h === "helm") {
		let e = w(p.steel, .4, .3);
		S.add(new k(al(C, (e) => e.y > .14 && !(e.z > .12 && e.y < .64 && Math.abs(e.x) < .4), .17), e)), S.add(new k(al(C, (e) => e.y > .08 && e.y < .55 && Math.abs(e.x) > .3 && e.z > -.15, .2), e)), S.add(new k(al(C, (e) => e.y > .56 && e.y < .68, .2), w(p.trim, .5, .4)));
		let t = new k(new M(.07, .3, .07), e), n = x.on(0, .5).p;
		t.position.set(0, .47, n.z + .14), S.add(t);
		let r = new k(new M(.07, .14, .9), w(p.trim, .5, .4));
		r.position.set(0, ee * 1.12 + .02, -.04), S.add(r);
	}
	if (h === "hood") {
		let e = new l({
			color: p.hood,
			roughness: .9,
			side: 2
		});
		S.add(new k(al(C, (e) => !(e.z > 0 && e.y < .84 && Math.abs(e.x) < .42), .26), e));
		let t = new k(new D(E * 1.2, E * 1.55, .5, 16, 1, !0, .7, Math.PI * 2 - 1.4), e);
		t.position.set(0, -.12, -.04), S.add(t);
		let n = new k(new nt(.22, .7, 8), e);
		n.position.set(0, .62, -.7), n.rotation.x = -1.95, S.add(n);
	}
	if (h === "coif") {
		let e = new l({
			color: p.coif,
			roughness: .95,
			side: 2
		});
		S.add(new k(al(C, (e) => !(e.z > .04 && e.y < .72 && Math.abs(e.x) < .4), .12), e));
		let t = new k(new D(E * 1.08, E * 1.45, .46, 16, 1, !0, .9, Math.PI * 2 - 1.8), e);
		t.position.set(0, -.1, -.02), S.add(t);
		let n = new k(al(C, (e) => e.y > .66 && e.y < .74 && e.z > -.1, .135), w(p.trim, .5, .4));
		S.add(n);
	}
	if (h === "hat") {
		let e = new O(), t = new l({
			color: p.hat,
			roughness: .85,
			side: 2
		}), n = new k(new D(E * 1.55, E * 1.6, .06, 24), t);
		e.add(n);
		let r = new k(new nt(E * .98, 1.05, 16, 1), t);
		r.position.y = .55, e.add(r);
		let i = new k(new D(E * .9, E * .99, .13, 16, 1, !0), w(p.band));
		i.position.y = .09, i.scale.setScalar(1.03), e.add(i);
		let a = new k(new nt(E * .2, .34, 8), t);
		a.position.set(0, 1.12, -.12), a.rotation.x = -.7, e.add(a), e.position.set(0, ee * .8, -.02), e.rotation.x = -.22, S.add(e);
	}
	S.traverse((e) => {
		e.isMesh && (e.frustumCulled = !1);
	}), b.add(S);
}
//#endregion
//#region ember3d/creatures.js
var Kl = (e) => {
	let t = e >>> 0 || 1;
	return () => (t = Math.imul(t, 1664525) + 1013904223 >>> 0, t / 4294967296);
}, B = (e, t, n) => new j(e, t, n), ql = B(0, 1, 0), Jl = class {
	constructor(e) {
		this.bones = [], this.by = /* @__PURE__ */ new Map(), this.parts = [], this.r = Kl(e), this.crease = Xl, this.mottle = .1;
	}
	bone(e, t, n) {
		let r = new ve();
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
			let r = new Float32Array(n * 3), i = new Float32Array(n * 3), a = new Uint16Array(n * 4), o = new Float32Array(n * 4), s = 0, c = new j(), l = new j(), u = new A(), d = new Float32Array(n * 3);
			for (let t of e) {
				let e = sn(t.geo, t.crease), n = e.attributes.position, f = e.attributes.normal;
				for (let e = 0; e < n.count; e++) {
					if (c.fromBufferAttribute(n, e), l.fromBufferAttribute(f, e), typeof t.colour == "function" ? u.copy(t.colour(c, l)) : u.copy(t.colour), !t.glow && this.mottle && u.multiplyScalar(1 - this.mottle + 2 * this.mottle * eu(Math.round(c.x * 60), Math.round(c.y * 60), Math.round(c.z * 60), 3)), r.set([
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
			let f = new Le();
			return f.setAttribute("position", new be(r, 3)), f.setAttribute("color", new be(i, 3)), f.setAttribute("skinIndex", new be(a, 4)), f.setAttribute("skinWeight", new be(o, 4)), f.setAttribute("normal", new be(d, 3)), new Ye(f, t);
		}, r = new O(), i = new v(this.bones);
		r.add(this.bones[0]), r.updateMatrixWorld(!0);
		let a = n(this.parts.filter((e) => !e.glow), new l({
			vertexColors: !0,
			roughness: .95,
			metalness: 0
		}));
		a.name = "Body", r.add(a), a.bind(i);
		let o = this.parts.filter((e) => e.glow);
		if (o.length) {
			let a = n(o, new l({
				vertexColors: !0,
				roughness: .4,
				emissive: new A(e),
				emissiveIntensity: t
			}));
			a.name = "Eyes", a.userData.glow = !0, r.add(a), a.bind(i);
		}
		return r.traverse((e) => {
			e.isMesh && (e.frustumCulled = !1);
		}), r;
	}
}, Yl = 1.6, Xl = 50 * Math.PI / 180, Zl = (e, t) => Math.max(t, Math.round(e * Yl));
function V(e, t, n = [10, 8], r = 0) {
	n = [Zl(n[0], 8), Zl(n[1], 6)];
	let i = new me(1, n[0], n[1]);
	return i.scale(t[0], t[1], t[2]), r && i.rotateX(r), i.translate(e.x, e.y, e.z), i;
}
function H(e, t, n, r, i = 6) {
	i = Zl(i, 5);
	let a = t.clone().sub(e), o = a.length(), s = new D(r, n, o, i, 1);
	return s.translate(0, o / 2, 0), s.applyQuaternion(new p().setFromUnitVectors(ql, a.normalize())), s.translate(e.x, e.y, e.z), s;
}
function Ql(e, t, n, r = 8, i = 24) {
	let a = new Ke(e), o = new $e(a, i, 1, Zl(r, 6), !1), s = o.attributes.position, c = B(0, 0, 0), l = B(0, 0, 0), u = (e) => {
		let n = e * (t.length - 1), r = Math.min(t.length - 2, Math.floor(n)), i = n - r;
		return t[r] + (t[r + 1] - t[r]) * i;
	}, d = Zl(r, 6) + 1, f = [];
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
var U = (e, t, n) => new p().setFromEuler(new C(e, t, n)), $l = (e, t) => new p().setFromAxisAngle(e, t);
function W(e, t, n, r, i = 24) {
	let a = Math.max(2, Math.round(n * i) + 1), o = [], s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
	for (let e = 0; e < a; e++) {
		let t = e / (a - 1);
		o.push(t * n);
		let i = r(t);
		for (let [t, n] of Object.entries(i.q || {})) s.has(t) || s.set(t, Array(a)), s.get(t)[e] = n;
		for (let [t, n] of Object.entries(i.p || {})) c.has(t) || c.set(t, Array(a)), c.get(t)[e] = n;
		for (let [t, n] of Object.entries(i.s || {})) l.has(t) || l.set(t, Array(a)), l.get(t)[e] = n;
	}
	let u = [];
	for (let [e, t] of s) u.push(new ce(`${e}.quaternion`, o, t.flatMap((e) => (e || new p()).toArray())));
	for (let [t, n] of c) {
		let r = e.by.get(t).position;
		u.push(new Oe(`${t}.position`, o, n.flatMap((e) => r.clone().add(e || B(0, 0, 0)).toArray())));
	}
	for (let [e, t] of l) u.push(new Oe(`${e}.scale`, o, t.flatMap((e) => (e || B(1, 1, 1)).toArray())));
	return new Ve(t, n, u);
}
var eu = (e, t, n, r = 0) => {
	let i = Math.sin(e * 127.1 + t * 311.7 + n * 74.7 + r * 19.19) * 43758.5453;
	return i - Math.floor(i);
};
function tu(e, t, n, r = 1) {
	let i = new Ze(e.map(([e, t]) => new qe(Math.max(1e-4, t), e)), t).rotateX(Math.PI / 2), a = i.attributes.position;
	for (let e = 0; e < a.count; e++) {
		let t = a.getZ(e);
		a.setY(e, a.getY(e) * r + n(t));
	}
	return i;
}
var nu = (e, t, n) => e.rotateY(t).translate(n.x, n.y, n.z), ru = (e, t, n) => e.clone().lerp(t, Math.max(0, Math.min(1, n))), iu = Math.PI * 2, G = (e) => Math.sin(iu * e), au = (e) => Math.cos(iu * e), ou = (e, t, n) => {
	let r = Math.max(0, Math.min(1, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}, K = (e, t, n, r) => r < t ? ou(e, t, r) : 1 - ou(t, n, r);
function su(e = {}) {
	let t = !!e.king, n = new Jl(e.seed || 11), r = new A(e.fur || "#3c3b3a"), i = new A(e.belly || "#4c4a48"), a = new A(e.skin || "#8e7672"), o = new A(e.furTop || "#64625e"), s = (e, t) => t.y < -.35 ? i : t.y > .62 ? ru(r, o, .45) : r, c = new A("#d8cdb4"), l = new A("#e0cf8a"), u = new A("#3a1214"), d = new A(e.tail || "#8e706a"), f = new A("#5a4642"), p = n.bone("root", null, B(0, .2, 0)), m = n.bone("pelvis", p, B(0, .21, -.17)), h = n.bone("chest", p, B(0, .22, .14)), g = n.bone("neck", h, B(0, .235, .25)), _ = n.bone("head", g, B(0, .245, .31));
	n.bone("jaw", _, B(0, .22, .35));
	let v = m, y = [
		B(0, .17, -.31),
		B(0, .11, -.45),
		B(.03, .055, -.59),
		B(.08, .025, -.71)
	];
	y.forEach((e, t) => {
		v = n.bone(`tail${t + 1}`, v, e);
	});
	for (let e of [1, -1]) {
		let t = n.bone(`armU${e}`, h, B(.085 * e, .19, .16)), r = n.bone(`armL${e}`, t, B(.095 * e, .1, .2));
		n.bone(`paw${e}`, r, B(.095 * e, .025, .215));
		let i = n.bone(`legU${e}`, m, B(.1 * e, .18, -.17)), a = n.bone(`legL${e}`, i, B(.11 * e, .09, -.1));
		n.bone(`foot${e}`, a, B(.11 * e, .03, -.2));
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
	n.part(tu(x, 28, b, .92), C, s);
	let T = (e, t, i, a, s = .35, c = .9) => {
		let l = w(e) * .9, u = B(Math.sin(t) * l, b(e) + Math.cos(t) * l * .92, e), d = B(Math.sin(t), Math.cos(t) * .92, 0).normalize(), f = d.clone().multiplyScalar(s).add(B(0, -.1, -c)).normalize(), p = u.clone().add(f.clone().multiplyScalar(i)), m = H(u.clone().add(d.clone().multiplyScalar(-.01)), p, a, .003, 4), h = m.attributes.position, g = d.clone().sub(f.clone().multiplyScalar(d.dot(f))).normalize(), _ = B(0, 0, 0);
		for (let e = 0; e < h.count; e++) {
			_.fromBufferAttribute(h, e);
			let t = _.clone().sub(u).dot(g);
			_.addScaledVector(g, -.55 * t), h.setXYZ(e, _.x, _.y, _.z);
		}
		n.part(m, C, (e, t) => e.distanceTo(u) > i * .55 ? o : ru(r, o, .15));
	};
	for (let e = 0; e < 9; e++) {
		let t = -.24 + e * .05, n = eu(e, 7, 1, 5);
		T(t, (e % 2 ? .12 : -.12) + (n - .5) * .15, (.048 + .025 * n) * (t > .05 ? .6 : 1), .036, t > .05 ? .12 : .22);
	}
	for (let e of [1, -1]) {
		for (let t = 0; t < 4; t++) {
			let n = eu(t, e, 2, 6);
			T(.1 + t * .03, e * (.8 + .3 * t), .055 + .02 * n, .03, .25, .85);
		}
		for (let t = 0; t < 4; t++) {
			let n = eu(t, e, 4, 7);
			T(-.22 + t * .09, e * (.95 + t % 2 * .25), .06 + .03 * n, .03, .3, .9);
		}
		T(-.18, e * .6, .075, .034, .4, .95);
	}
	for (let e of [
		-.5,
		0,
		.5
	]) T(-.29, e, .06, .034, .6, .85);
	n.part(V(B(0, .262, .31), [
		.1,
		.09,
		.1
	], [12, 9]), "head", s);
	for (let e of [1, -1]) for (let [t, r] of [
		[.245, .31],
		[.28, .29],
		[.215, .33]
	]) n.part(H(B(.075 * e, t, r), B(.125 * e, t - .015, r - .055), .024, .002, 3), "head", o);
	for (let e of [1, -1]) n.part(V(B(0, 0, 0), [
		.04,
		.016,
		.03
	], [8, 5]).rotateZ(-.42 * e).translate(.036 * e, .3, .362), "head", r);
	n.part(H(B(0, .258, .36), B(0, .24, .47), .06, .03, 8), "head", s), n.part(V(B(0, .246, .472), [
		.02,
		.016,
		.013
	], [6, 4]), "head", a), n.part(V(B(0, .21, .4), [
		.04,
		.024,
		.06
	], [8, 6]), "head", u);
	for (let e of [1, -1]) n.part(H(B(.01 * e, .222, .46), B(.01 * e, .165, .466), .01, .004, 4), "head", l), n.part(H(B(.033 * e, .215, .405), B(.032 * e, .185, .41), .006, .001, 3), "head", l), n.part(V(B(.05 * e, .283, .388), [
		.014,
		.012,
		.009
	], [6, 4]), "head", new A("#ff5530"), !0), n.part(nu(V(B(0, 0, 0), [
		.04,
		.044,
		.012
	], [8, 6]), .5 * e, B(.066 * e, .33, .275)), "head", r), n.part(nu(V(B(0, 0, .006), [
		.029,
		.033,
		.008
	], [6, 4]), .5 * e, B(.066 * e, .33, .275)), "head", a);
	n.part(V(B(0, .19, .4), [
		.034,
		.017,
		.055
	], [8, 5]), "jaw", s);
	for (let e of [1, -1]) n.part(H(B(.007 * e, .192, .448), B(.007 * e, .222, .452), .007, .003, 4), "jaw", l);
	let E = [
		B(0, .19, -.27),
		...y,
		B(.13, .015, -.8),
		B(.16, .012, -.9)
	], ee = [
		"pelvis",
		"tail1",
		"tail2",
		"tail3",
		"tail4",
		"tail4"
	];
	for (let e = 0; e < E.length - 1; e++) for (let t = 0; t < 3; t++) {
		let r = E[e].clone().lerp(E[e + 1], t / 3), i = E[e].clone().lerp(E[e + 1], (t + 1) / 3), a = (e * 3 + t) / ((E.length - 1) * 3);
		n.part(H(r, i, .036 * (1 - a) + .004, .036 * (1 - a - 1 / 18) + .004, 6), ee[e], t === 2 ? f : d);
	}
	let te = (e, t, r, i, o) => {
		n.part(V(e, [
			.026,
			.012,
			.03
		], [6, 4]), r, a);
		for (let s = -1.5; s <= 1.5; s++) {
			let l = s * .32 + .1 * i, u = B(Math.sin(l) * t.z + t.x, 0, Math.cos(l) * t.z), d = e.clone().add(u.clone().multiplyScalar(.015)), f = d.clone().add(u.clone().multiplyScalar(o));
			f.y = .004, n.part(H(d, f, .007, .004, 3), r, a), n.part(H(f, f.clone().add(u.clone().multiplyScalar(.016)).add(B(0, -.003, 0)), .004, .001, 3), r, c);
		}
	};
	for (let e of [1, -1]) n.part(H(B(.085 * e, .2, .15), B(.095 * e, .1, .2), .052, .036), `armU${e}`, s), n.part(H(B(.095 * e, .1, .2), B(.095 * e, .025, .215), .036, .024), `armL${e}`, s), n.part(H(B(.1 * e, .09, .19), B(.12 * e, .05, .17), .018, .002, 3), `armL${e}`, o), te(B(.095 * e, .012, .235), B(0, 0, 1), `paw${e}`, e, .045), n.part(V(B(.1 * e, .17, -.17), [
		.06,
		.075,
		.085
	], [8, 6]), `legU${e}`, s), n.part(H(B(.11 * e, .11, -.12), B(.11 * e, .03, -.2), .024, .016), `legL${e}`, r), n.part(V(B(.11 * e, .014, -.165), [
		.026,
		.012,
		.055
	], [6, 4]), `foot${e}`, a), te(B(.11 * e, .01, -.13), B(0, 0, 1), `foot${e}`, e, .04);
	e.king && cu(n, y);
	let ne = B(0, .045, .015), re = [n.bones.indexOf(n.by.get("head")), n.bones.indexOf(n.by.get("jaw"))];
	n.by.get("head").position.add(ne), n.by.get("head").userData.at.add(ne), n.by.get("jaw").userData.at.add(ne);
	let ie = n.by.get("head").userData.at.clone(), D = e.king ? 1.1 : 1.25;
	for (let e of n.parts) re.includes(e.bone) && e.geo.translate(ne.x - ie.x, ne.y - ie.y, ne.z - ie.z).scale(D, D, D).translate(ie.x, ie.y, ie.z);
	let ae = n.by.get("jaw");
	ae.position.multiplyScalar(D), ae.userData.at.copy(ie).add(ae.position), n.part(H(B(0, .235, .24), B(0, .28, .31), .075, .07, 8), "neck", s);
	let oe = n.mesh(e.eyes || "#ff4020"), O = (e, t = 1) => {
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
			let r = G(e + o), s = Math.max(0, au(e + o));
			n[i] = U(-.55 * t * r, 0, 0), n[a] = U((i.startsWith("arm") ? .9 : -.9) * t * s, 0, 0);
		}
		return n;
	}, se = (e, t = .25, n = 1) => Object.fromEntries([
		1,
		2,
		3,
		4
	].map((r) => [`tail${r}`, U(0, t * G(n * e - r * .12), 0)]));
	return {
		root: oe,
		clips: [
			W(n, "Idle", t ? 5 : 4, (e) => {
				let n = K(.06, .14, .34, e), r = K(.38, .46, .7, e), i = G((e - .38) / .32 * .5 + .25) * r, a = t ? 0 : K(.72, .8, .94, e), o = K(.52, .55, .6, e), s = G(e * (t ? 5 : 6)), c = .05 * G(e * 32) * n, l = t ? K(.72, .8, .95, e) : 0;
				return {
					q: {
						...Object.fromEntries([
							1,
							2,
							3,
							4
						].map((t) => [`tail${t}`, U(0, .2 * G(e * 2 - t * .1) + .5 * o * (t > 2 ? 1 : .3), .04 * G(e * 2 - t * .1))])),
						chest: U(.03 * s - .1 * n, .15 * i, 0),
						pelvis: U(-.015 * s, -.06 * i, .03 * G(e)),
						neck: U(-.2 * n + .25 * a, .25 * i, 0),
						head: U(-.15 * n + c + .15 * a - .1 * l, .35 * i + .2 * a, .1 * i + .25 * a),
						jaw: U(.2 + .15 * Math.max(0, G(e * 16)) * n + .55 * l, 0, 0),
						root: U(-.3 * a, 0, 0),
						armU1: U(-1.5 * a, 0, .25 * a),
						armL1: U(1.4 * a, 0, 0),
						paw1: U(-.6 * a * (1 + .3 * G(e * 24)), 0, 0),
						"armU-1": U(-.35 * a, 0, 0),
						legU1: U(.06 * n, 0, 0),
						"legU-1": U(.06 * n, 0, 0)
					},
					p: { root: B(0, .004 * s + .022 * n + .02 * a, -.01 * n - .04 * a) }
				};
			}),
			W(n, "Walk", .42, (e) => ({
				q: {
					...O(e),
					...se(e, .3, 1),
					pelvis: U(0, .08 * G(e), 0),
					chest: U(0, -.06 * G(e), 0),
					head: U(.06 * G(e * 2), 0, 0)
				},
				p: { root: B(0, .012 * Math.abs(G(e)), 0) }
			})),
			W(n, "Attack", .6, (e) => {
				let t = K(.15, .45, .85, e), n = K(0, .15, .3, e);
				return {
					q: {
						...se(e, .3, 2),
						root: U(-.15 * n + .12 * t, 0, 0),
						chest: U(.2 * t, 0, 0),
						neck: U(.25 * t - .3 * n, 0, 0),
						head: U(-.35 * t, 0, 0),
						jaw: U(.85 * K(.15, .36, .5, e), 0, 0),
						armU1: U(-.6 * t, 0, 0),
						"armU-1": U(-.6 * t, 0, 0)
					},
					p: { root: B(0, .02 * n - .02 * t, .16 * t - .03 * n) }
				};
			}),
			W(n, "Attack2", .55, (e) => {
				let t = K(.1, .35, .8, e);
				return {
					q: {
						...se(e, .2),
						root: U(-.35 * t, 0, 0),
						armU1: U(-1.3 * K(.2, .4, .6, e), 0, .2),
						"armU-1": U(-1.3 * K(.35, .55, .75, e), 0, -.2),
						jaw: U(.5 * t, 0, 0)
					},
					p: { root: B(0, .03 * t, .03 * t) }
				};
			}),
			W(n, "Heavy", .9, (e) => {
				let t = K(0, .25, .4, e), n = K(.3, .55, .8, e);
				return {
					q: {
						...O(e * .5, .6 * n),
						...se(e, .4),
						root: U(.15 * t - .25 * n, 0, 0),
						jaw: U(.7 * n, 0, 0)
					},
					p: { root: B(0, -.04 * t + .14 * n, .28 * ou(.3, .8, e)) }
				};
			}),
			W(n, "Hit", .4, (e) => {
				let t = K(0, .25, 1, e);
				return {
					q: {
						...se(e, .5, 2),
						head: U(-.35 * t, .3 * t, 0),
						chest: U(-.15 * t, 0, 0)
					},
					p: { root: B(0, 0, -.05 * t) }
				};
			}),
			W(n, "Death", 1, (e) => {
				let t = ou(0, .6, e);
				return {
					q: {
						root: U(0, 0, 1.45 * t),
						head: U(.3 * t, 0, 0),
						jaw: U(.4 * t, 0, 0),
						armU1: U(-.6 * t, 0, 0),
						"armU-1": U(.4 * t, 0, 0),
						legU1: U(.5 * t, 0, 0),
						"legU-1": U(-.3 * t, 0, 0),
						...se(0, 0)
					},
					p: { root: B(0, -.07 * t, 0) }
				};
			}),
			W(n, "Cast", .8, (e) => {
				let t = K(.1, .5, .9, e);
				return {
					q: {
						root: U(-.5 * t, 0, 0),
						head: U(-.4 * t, 0, 0),
						jaw: U(.8 * t, 0, 0),
						...se(e, .3)
					},
					p: { root: B(0, .05 * t, 0) }
				};
			})
		]
	};
}
function cu(e, t) {
	let r = new A("#8a5a24"), i = new A("#9a7a34"), a = new A("#2a1226"), o = new A("#3c1c36"), s = new A("#d8c27a"), c = new A("#b07a72"), l = new A("#8a6460"), u = new A("#3a342e"), d = new A("#5a534a");
	e.part(new n(.047, .009, 4, 12).rotateX(Math.PI / 2 - .25).translate(0, .315, .3), "head", i);
	for (let t = 0; t < 7; t++) {
		let n = t / 7 * Math.PI * 2, a = B(Math.sin(n), 0, Math.cos(n)), o = B(0, .318, .3).add(a.clone().multiplyScalar(.046)), s = o.clone().add(a.clone().multiplyScalar(.018)).add(B(0, .05 + t % 2 * .015, 0));
		e.part(H(o, s, .008, .002, 4), "head", t % 2 ? r : i);
	}
	for (let t of [1, -1]) e.part(H(B(.007 * t, .226, .462), B(.008 * t, .19, .468), .007, .004, 4), "head", s);
	e.part(H(B(.05, .31, .33), B(.03, .25, .4), .005, .004, 3), "head", c), e.part(V(B(0, .27, .13), [
		.115,
		.1,
		.12
	], [10, 8]), "chest", (e, t) => t.y > .55 ? d : u);
	for (let t = 0; t < 12; t++) {
		let n = t / 12 * Math.PI * 2, r = B(Math.sin(n), Math.cos(n) * .8, 0), i = B(0, .26, .25).add(r.clone().multiplyScalar(.075));
		e.part(H(i, i.clone().add(r.clone().multiplyScalar(.05)).add(B(0, 0, -.04)), .02, .003, 3), "neck", t % 3 ? u : d);
	}
	e.part(V(B(0, .275, .02), [
		.172,
		.075,
		.22
	], [12, 8]), "root", (e, t) => t.y > .5 ? o : a);
	for (let t = 0; t < 10; t++) {
		let n = t / 9 * Math.PI - Math.PI / 2, r = .02 + .21 * Math.sin(n);
		for (let i of [1, -1]) {
			let o = B(.165 * i * Math.cos(n * .85), .22, r);
			e.part(H(o, o.clone().add(B(.012 * i, -.04 - t % 2 * .02, -.01)), .022, .003, 3), "root", a);
		}
	}
	e.part(V(B(0, .255, .33), [
		.016,
		.016,
		.01
	], [6, 4]), "neck", i);
	let f = t[3].clone().add(B(.02, .03, -.06));
	e.part(new we(.045, .012, 40, 5, 2, 3).translate(f.x, f.y + .01, f.z), "tail4", l);
	for (let t = 0; t < 6; t++) {
		let n = t / 6 * Math.PI * 2 + .3, r = B(Math.sin(n), 0, Math.cos(n)), i = f.clone().add(r.clone().multiplyScalar(.085)).add(B(0, t % 2 * .02, 0)), a = t < 3 ? "tail4" : "tail3", o = .85 + t % 3 * .12, s = (e, t) => t.y > .5 ? d : u;
		e.part(nu(V(B(0, .035 * o, 0), [
			.04 * o,
			.036 * o,
			.065 * o
		], [8, 6]), n, i), a, s), e.part(nu(H(B(0, .04 * o, .05 * o), B(0, .03 * o, .115 * o), .026 * o, .007, 5), n, i), a, s);
		for (let t of [1, -1]) e.part(nu(V(B(.02 * t * o, .06 * o, .055 * o), [
			.016 * o,
			.017 * o,
			.005
		], [6, 4]), n, i), a, c), e.part(nu(V(B(.014 * t * o, .05 * o, .085 * o), [
			.006,
			.006,
			.005
		], [5, 3]), n, i), a, new A("#ff5530"), !0), e.part(nu(H(B(.03 * t * o, .02, .03 * o), B(.05 * t * o, 0, .05 * o), .008, .005, 4), n, i), a, u);
	}
}
function lu(e, { dark: t, band: n, mark: r }) {
	let i = new A("#d6ccb2"), a = new A("#9ccc5a");
	e.part(V(B(0, .4, -.4), [
		.25,
		.22,
		.38
	], [14, 10], -.3), "abdomen", (e, i) => {
		let a = (e.z + .4) / .3, o = Math.sin((e.z + .4) * 30) > .72;
		return i.y > .62 && Math.abs(a) < .9 && Math.abs(e.x) < .014 + .05 * Math.abs(a) ? r : o ? n : t;
	}), e.part(H(B(0, .3, -.74), B(0, .25, -.8), .04, .014), "abdomen", n);
	for (let t = 0; t < 14; t++) {
		let n = t / 14 * Math.PI * 2, r = -.4 + .24 * Math.cos(n * 1.7), i = t % 2 ? 1 : -1, o = .4 + .12 * Math.sin(n * 2.3), s = i * Math.sqrt(Math.max(0, 1 - ((o - .4) / .22) ** 2 - ((r + .4) / .38) ** 2)) * .25 * .97;
		e.part(V(B(s, o, r), [
			.022,
			.018,
			.022
		], [6, 4]), "abdomen", a, !0);
	}
	for (let t = 0; t < 5; t++) {
		let n = (t - 2) * .04, r = B(n, .34, .06 - Math.abs(t - 2) * .012);
		e.part(H(r, r.clone().add(B(n * .6, .11 - Math.abs(t - 2) * .025, -.07)), .014, .002, 4), "ceph", i);
	}
	for (let t of [1, -1]) e.part(H(B(.03 * t, .24, .3), B(.045 * t, .13, .31), .012, .002, 4), `fang${t}`, i);
}
function uu(e = {}) {
	let t = new Jl(e.seed || 23), n = new A(e.body || "#241d1a"), r = new A(e.band || "#5e4b3a"), i = new A(e.mark || "#b8ab8e"), a = n.clone().lerp(r, .4), o = t.bone("root", null, B(0, .28, 0)), s = t.bone("ceph", o, B(0, .29, .1));
	t.bone("abdomen", o, B(0, .31, -.08));
	for (let e of [1, -1]) t.bone(`fang${e}`, s, B(.035 * e, .25, .27)), t.bone(`palp${e}`, s, B(.06 * e, .27, .24));
	let c = !!e.queen, l = [
		[38, c ? 1.4 : 1.15],
		[72, 1],
		[108, .95],
		[142, 1.1]
	], u = [];
	for (let e of [1, -1]) l.forEach(([n, i], o) => {
		let c = n * Math.PI / 180, l = B(Math.sin(c) * e, 0, Math.cos(c)), d = B(0, .29, .1).add(l.clone().multiplyScalar(.085)), f = d.clone().add(l.clone().multiplyScalar(.25 * i)).add(B(0, .19 * i, 0)), p = f.clone().add(l.clone().multiplyScalar(.27 * i)).add(B(0, -.3 * i, 0)), m = p.clone().add(l.clone().multiplyScalar(.13 * i));
		m.y = .005;
		let h = t.bone(`leg${e}${o}a`, s, d), g = t.bone(`leg${e}${o}b`, h, f);
		t.bone(`leg${e}${o}c`, g, p), u.push({
			s: e,
			i: o,
			d: l,
			k: l.clone().cross(ql).normalize(),
			name: `leg${e}${o}`
		}), t.part(H(d, f, .03 * i, .025 * i), `leg${e}${o}a`, a), t.part(V(f, [
			.03 * i,
			.03 * i,
			.03 * i
		], [6, 4]), `leg${e}${o}b`, r), t.part(H(f, p, .024 * i, .017 * i), `leg${e}${o}b`, a), t.part(V(p, [
			.02 * i,
			.02 * i,
			.02 * i
		], [6, 4]), `leg${e}${o}c`, r), t.part(H(p, m, .016 * i, .005), `leg${e}${o}c`, a);
	});
	t.part(V(B(0, .3, .1), [
		.115,
		.07,
		.135
	]), "ceph", n), t.part(V(B(0, .315, .225), [
		.07,
		.055,
		.055
	]), "ceph", n), c ? lu(t, {
		dark: n,
		band: r,
		mark: i
	}) : (t.part(V(B(0, .36, -.29), [
		.19,
		.165,
		.25
	], [12, 9], -.25), "abdomen", (e, t) => t.y > .55 && Math.abs(e.x) < .012 + .03 * Math.max(0, Math.sin((e.z + .29) * 22)) ? i : n), t.part(H(B(0, .27, -.5), B(0, .24, -.54), .03, .012), "abdomen", r));
	for (let e of [1, -1]) {
		t.part(H(B(.035 * e, .27, .26), B(.032 * e, .22, .3), .022, .016), `fang${e}`, n), t.part(H(B(.032 * e, .22, .3), B(.025 * e, .17, .29), .013, .003), `fang${e}`, new A("#1a1012")), t.part(H(B(.06 * e, .27, .24), B(.075 * e, .24, .33), .012, .009), `palp${e}`, r), t.part(H(B(.075 * e, .24, .33), B(.07 * e, .19, .36), .009, .006), `palp${e}`, n);
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
		]) t.part(V(B(n * e, r, i), [
			a,
			a,
			a
		], [6, 4]), "ceph", new A("#e8ff90"), !0);
	}
	let d = t.mesh(e.eyes || "#b8e060", e.queen ? 1.25 : 1.6), f = (e, t, n, r = 0) => ({
		[`${e.name}a`]: $l(ql, -e.s * t).multiply($l(e.k, n)),
		[`${e.name}b`]: $l(e.k, -r),
		[`${e.name}c`]: $l(e.k, -r * .6)
	}), p = (e, t = 1) => {
		let n = {};
		for (let r of u) {
			let i = (r.i + (r.s > 0 ? 0 : 1)) % 2 * .5, a = G(e + i), o = Math.max(0, au(e + i));
			n = {
				...n,
				...f(r, .28 * t * a, .32 * t * o, .25 * t * o)
			};
		}
		return n;
	}, m = (e) => ({
		fang1: U(-.6 * e, 0, .35 * e),
		"fang-1": U(-.6 * e, 0, -.35 * e)
	}), h = (e) => ({
		palp1: U(.3 * G(e * 3), 0, 0),
		"palp-1": U(.3 * G(e * 3 + .5), 0, 0)
	}), g = (e, t = 0) => Object.assign({}, ...u.filter((e) => e.i === 0).map((n) => f(n, .25 * e, (.9 + t) * e, -.4 * e)));
	return {
		root: d,
		clips: [
			W(t, "Idle", c ? 5 : 4, (e) => {
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
					let i = t.find(([e, t]) => e === r.i && t === r.s), a = K(i[2], i[2] + .04, i[2] + .1, e), o = r.i === 0 ? 1 : .45, s = c && r.i === 0 ? .55 + .15 * G(e * 3 + r.s * .25) : 0;
					n = {
						...n,
						...f(r, .12 * a * o + (c && r.i === 0 ? .2 : 0) + .04 * G(e + r.s * .25), (.35 * a + .08 * a * G(e * 20)) * o + s, .25 * a - (s ? .3 : 0))
					};
				}
				let r = G(e * (c ? 4 : 5)), i = K(.42, .48, .58, e);
				return {
					q: {
						...n,
						...h(e * 4),
						...m(.15 + .5 * i * (.6 + .4 * G(e * 24))),
						abdomen: U(.05 * r, .04 * G(e), 0),
						root: U(.02 * G(e * 2), .07 * G(e), .015 * G(e))
					},
					p: { root: B(0, .005 * r, 0) },
					s: { abdomen: B(1 + (c ? .04 : .025) * r, 1 + (c ? .05 : .03) * r, 1 + (c ? .03 : .02) * r) }
				};
			}),
			W(t, "Walk", .55, (e) => ({
				q: {
					...p(e),
					...h(e),
					abdomen: U(.05 * G(e * 2), .06 * G(e), 0)
				},
				p: { root: B(.008 * G(e), .01 * Math.abs(G(e * 2)), 0) }
			})),
			W(t, "Attack", .7, (e) => {
				let t = K(0, .3, .55, e), n = K(.35, .5, .85, e);
				return {
					q: {
						...p(0, 0),
						...g(t - .3 * n),
						...m(t * .8 + n),
						root: U(-.45 * t + .25 * n, 0, 0)
					},
					p: { root: B(0, .05 * t, .12 * n) }
				};
			}),
			W(t, "Attack2", .5, (e) => {
				let t = K(.1, .35, .8, e);
				return {
					q: {
						...p(e * .5, .4),
						...m(t * 1.2),
						root: U(.12 * t, 0, 0)
					},
					p: { root: B(0, -.02 * t, .09 * t) }
				};
			}),
			W(t, "Heavy", 1, (e) => {
				let t = K(0, .25, .4, e), n = K(.3, .55, .85, e);
				return {
					q: {
						...p(0, 0),
						...Object.assign({}, ...u.map((e) => f(e, (e.i < 2 ? .3 : -.25) * n, -.25 * t + .4 * n, .4 * t))),
						...g(n, .3),
						...m(n),
						root: U(-.3 * n, 0, 0)
					},
					p: { root: B(0, -.06 * t + .18 * n, .4 * ou(.3, .85, e)) }
				};
			}),
			W(t, "Hit", .45, (e) => {
				let t = K(0, .2, 1, e);
				return {
					q: {
						...Object.assign({}, ...u.map((e) => f(e, 0, .3 * t, .2 * t))),
						root: U(-.2 * t, .15 * t, 0),
						...m(.6 * t)
					},
					p: { root: B(0, .02 * t, -.06 * t) }
				};
			}),
			W(t, "Death", 1.2, (e) => {
				let t = ou(0, .7, e);
				return {
					q: {
						...Object.assign({}, ...u.map((e) => f(e, 0, .7 * t, 1.9 * t))),
						...m(.4 * t),
						abdomen: U(.25 * t, 0, 0)
					},
					p: { root: B(0, -.16 * t, 0) }
				};
			}),
			W(t, "Cast", .8, (e) => {
				let t = K(0, .35, .6, e), n = K(.45, .55, .8, e);
				return {
					q: {
						...p(0, 0),
						...g(t * .7),
						...m(.4 + n),
						root: U(-.35 * t + .15 * n, 0, 0),
						abdomen: U(.5 * t, 0, 0)
					},
					p: { root: B(0, .04 * t, .04 * n) }
				};
			})
		]
	};
}
function du(e = {}) {
	let t = new Jl(e.seed || 31), n = new A(e.shell || "#5e0e10"), r = new A(e.shellHi || "#8c1e1c"), i = new A("#3a0b07"), a = new A("#160a08"), o = new A(e.body || "#2a1510"), s = new A("#5a2a1c"), c = new A("#1b110d"), l = new A("#4e2c1e"), u = new A("#ffb050"), d = (e, t) => e.z < -.27 ? a : t.y > .8 ? r : t.y > .45 ? n : t.y < .05 ? i : ru(i, n, t.y * 2.2), f = (e, t) => t.y > .7 ? s : o;
	t.bone("root", null, B(0, .16, 0));
	let p = t.by.get("root");
	t.bone("thorax", p, B(0, .18, .15)), t.bone("head", t.by.get("thorax"), B(0, .16, .27)), t.bone("abdomen", p, B(0, .17, -.04));
	for (let e of [1, -1]) t.bone(`elytra${e}`, t.by.get("abdomen"), B(.02 * e, .29, .1)), t.bone(`mand${e}`, t.by.get("head"), B(.04 * e, .13, .33)), t.bone(`ant${e}`, t.by.get("head"), B(.045 * e, .19, .32));
	t.part(V(B(0, .15, -.08), [
		.15,
		.085,
		.24
	], [10, 7]), "abdomen", o);
	for (let e = 0; e < 4; e++) t.part(V(B(0, .228, -0 - e * .075), [
		.11 - e * .017,
		.012,
		.024
	], [8, 4]), "abdomen", u, !0);
	t.part(V(B(0, .12, -.31), [
		.03,
		.026,
		.026
	], [6, 4]), "abdomen", u, !0);
	for (let e of [1, -1]) {
		t.part(V(B(.05 * e, .17, -.07), [
			.12,
			.165,
			.265
		], [14, 10]), `elytra${e}`, d), t.part(H(B(.004 * e, .335, .1), B(.004 * e, .26, -.3), .008, .005, 4), `elytra${e}`, a);
		for (let n = 0; n < 2; n++) t.part(H(B((.045 + n * .04) * e, .32 - n * .035, .08), B((.05 + n * .045) * e, .27 - n * .05, -.24), .005, .004, 3), `elytra${e}`, i);
	}
	t.part(V(B(0, .205, .16), [
		.13,
		.085,
		.1
	], [12, 8]), "thorax", f), t.part(H(B(0, .29, .21), B(0, .28, .1), .012, .01, 4), "thorax", s), t.part(V(B(0, .165, .27), [
		.085,
		.062,
		.075
	], [10, 7]), "head", f);
	for (let e of [1, -1]) t.part(V(B(.046 * e, .215, .262), [
		.026,
		.022,
		.026
	], [8, 6]), "head", u, !0), t.part(V(B(.07 * e, .17, .3), [
		.02,
		.022,
		.018
	], [6, 4]), "head", new A("#0b0707")), t.part(H(B(.04 * e, .13, .33), B(.09 * e, .12, .4), .022, .015, 5), `mand${e}`, o), t.part(H(B(.09 * e, .12, .4), B(.03 * e, .115, .47), .015, .003, 5), `mand${e}`, a), t.part(H(B(.075 * e, .12, .42), B(.06 * e, .12, .425), .006, .001, 3), `mand${e}`, a), t.part(H(B(.045 * e, .19, .32), B(.095 * e, .27, .37), .007, .006, 4), `ant${e}`, c), t.part(H(B(.095 * e, .27, .37), B(.135 * e, .285, .43), .006, .005, 4), `ant${e}`, c), t.part(V(B(.14 * e, .288, .44), [
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
			let o = n * Math.PI / 180, s = B(Math.sin(o) * a, 0, Math.cos(o)), u = B(.075 * a, .1, e), d = u.clone().add(s.clone().multiplyScalar(.13 * r)).add(B(0, .05, 0)), f = d.clone().add(s.clone().multiplyScalar(.15 * r));
			f.y = .025;
			let p = f.clone().add(s.clone().multiplyScalar(.07 * r));
			p.y = .004;
			let h = t.bone(`leg${a}${i}a`, t.by.get("root"), u), g = t.bone(`leg${a}${i}b`, h, d);
			t.bone(`leg${a}${i}c`, g, f), m.push({
				s: a,
				i,
				k: s.clone().cross(ql).normalize(),
				name: `leg${a}${i}`
			}), t.part(H(u, d, .034, .026), `leg${a}${i}a`, c), t.part(V(d, [
				.025,
				.025,
				.025
			], [6, 4]), `leg${a}${i}b`, l), t.part(H(d, f, .019, .012), `leg${a}${i}b`, c);
			for (let e of [.35, .7]) {
				let n = d.clone().lerp(f, e);
				t.part(H(n, n.clone().add(s.clone().multiplyScalar(.035)).add(B(0, .01, 0)), .006, .001, 3), `leg${a}${i}b`, l);
			}
			t.part(H(f, p, .01, .004), `leg${a}${i}c`, c);
		}
	});
	let h = t.mesh(e.glow || "#ff6a14", 1.4), g = (e, t, n, r = 0) => ({
		[`${e.name}a`]: $l(ql, -e.s * t).multiply($l(e.k, n)),
		[`${e.name}b`]: $l(e.k, -r),
		[`${e.name}c`]: $l(e.k, -r * .5)
	}), _ = (e, t = 1) => {
		let n = {};
		for (let r of m) {
			let i = (r.i + (r.s > 0 ? 0 : 1)) % 2 * .5, a = G(e + i), o = Math.max(0, au(e + i));
			n = {
				...n,
				...g(r, .32 * t * a, .35 * t * o, .2 * t * o)
			};
		}
		return n;
	}, v = (e) => ({
		mand1: U(0, .55 * e, 0),
		"mand-1": U(0, -.55 * e, 0)
	}), y = (e, t = 0) => ({
		elytra1: U(0, .3 * t, 1.05 * e),
		"elytra-1": U(0, -.3 * t, -1.05 * e)
	}), b = (e, t = 1) => ({
		ant1: U(.25 * t * G(e * 2), .3 * t * G(e), 0),
		"ant-1": U(.25 * t * G(e * 2 + .3), -.3 * t * G(e + .2), 0)
	});
	return {
		root: h,
		clips: [
			W(t, "Idle", 4, (e) => {
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
					let i = t.find(([e, t]) => e === r.i && t === r.s), a = K(i[2], i[2] + .035, i[2] + .08, e);
					n = {
						...n,
						...g(r, .15 * a * G(i[2] * 7), .3 * a, .2 * a)
					};
				}
				let r = K(.14, .17, .2, e) + K(.22, .25, .28, e), i = K(.58, .64, .76, e), a = K(.32, .4, .56, e), o = 1 - .8 * a;
				return {
					q: {
						...n,
						...b(e * 4, o),
						...v(.15 + .7 * r),
						head: U(.04 * G(e * 2), .3 * a * G((e - .32) * 1.6), .08 * a),
						thorax: U(-.04 * i, 0, 0),
						...y(.03 * Math.max(0, G(e * 5)) + i * (.42 + .08 * G(e * 40)), .2 * i),
						abdomen: U(-.06 * i, 0, 0),
						root: U(.015 * G(e * 2), .03 * G(e), 0)
					},
					p: { root: B(0, .004 * G(e * 5) + .008 * i, 0) }
				};
			}),
			W(t, "Walk", .42, (e) => ({
				q: {
					..._(e),
					...b(e * 2, .6),
					abdomen: U(0, .05 * G(e), 0),
					head: U(0, -.05 * G(e), 0)
				},
				p: { root: B(.006 * G(e), .008 * Math.abs(G(e * 2)), 0) }
			})),
			W(t, "Attack", .6, (e) => {
				let t = K(0, .25, .45, e), n = K(.3, .45, .8, e);
				return {
					q: {
						..._(0, 0),
						...v(1 * t - .25 * n),
						...b(e, .4),
						root: U(-.12 * t + .12 * n, 0, 0),
						head: U(-.2 * t + .25 * n, 0, 0)
					},
					p: { root: B(0, .015 * t, -.03 * t + .12 * n) }
				};
			}),
			W(t, "Attack2", .55, (e) => {
				let t = K(0, .3, .5, e), n = K(.35, .5, .85, e);
				return {
					q: {
						..._(e * .5, .3),
						...v(.4 * t),
						root: U(.12 * t - .2 * n, .12 * n, 0),
						thorax: U(-.2 * n, 0, 0)
					},
					p: { root: B(0, .03 * n, .1 * n) }
				};
			}),
			W(t, "Heavy", .9, (e) => {
				let t = K(0, .25, .4, e), n = K(.3, .55, .85, e);
				return {
					q: {
						..._(e * 2, .9 * n),
						...y(.35 * (t + n), .3),
						...v(.8 * n),
						root: U(.1 * t - .15 * n, 0, 0)
					},
					p: { root: B(0, -.03 * t + .05 * n, .32 * ou(.3, .8, e)) }
				};
			}),
			W(t, "Hit", .4, (e) => {
				let t = K(0, .22, 1, e);
				return {
					q: {
						...Object.assign({}, ...m.map((e) => g(e, 0, .25 * t, .2 * t))),
						...y(.12 * t),
						root: U(-.15 * t, .15 * t, .06 * t),
						...b(e * 3, t)
					},
					p: { root: B(0, .02 * t, -.05 * t) }
				};
			}),
			W(t, "Death", 1.2, (e) => {
				let t = ou(.05, .55, e), n = ou(.3, .9, e);
				return {
					q: {
						root: U(0, 0, Math.PI * t),
						...Object.assign({}, ...m.map((r) => g(r, .15 * Math.sin(r.i * 2 + e * 30) * (1 - n) * t, .9 * n, 1.6 * n))),
						...v(.3 * n)
					},
					p: { root: B(0, .12 * K(.05, .3, .55, e) + .15 * t, 0) }
				};
			}),
			W(t, "Cast", .9, (e) => {
				let t = K(.05, .35, .85, e), n = K(.45, .55, .75, e);
				return {
					q: {
						..._(0, 0),
						...y(1 * t, .5 * t),
						...v(.9 * t),
						root: U(-.22 * t + .18 * n, 0, 0),
						abdomen: U(-.25 * t, 0, 0),
						head: U(-.15 * t + .3 * n, 0, 0)
					},
					p: { root: B(0, .03 * t, .04 * n) }
				};
			})
		]
	};
}
function fu(e = {}) {
	let t = new Jl(e.seed || 41), r = new A(e.skin || "#3a5022"), i = new A(e.skinHi || "#56702e"), a = new A("#203012"), o = (e, t) => t.y > .55 ? ru(r, i, (t.y - .55) * 2.2) : t.y < -.4 ? a : r, s = new A(e.rag || "#7e1c14"), c = new A("#a8321e"), l = new A("#4a100c"), u = (e, t) => t.y > .6 ? c : t.y < -.3 ? l : s, d = new A(e.leather || "#3a2618"), f = new A("#5c3e26"), p = (e, t) => t.y > .5 ? f : d, h = new A("#6a4a30"), g = new A("#4a3220"), _ = new A("#e2d6a8"), v = new A("#cfc29a"), y = new A("#1c0806"), b = new A("#141a0c"), x = new A("#6e3a2c"), S = new A("#b08a3a");
	t.bone("root", null, B(0, .3, 0)), t.bone("spine", t.by.get("root"), B(0, .37, .01)), t.bone("chest", t.by.get("spine"), B(0, .45, .03)), t.bone("neck", t.by.get("chest"), B(0, .5, .06)), t.bone("head", t.by.get("neck"), B(0, .56, .08)), t.bone("jaw", t.by.get("head"), B(0, .545, .13));
	for (let e of [1, -1]) {
		let n = t.bone(`armU${e}`, t.by.get("chest"), B(.1 * e, .475, .03)), r = t.bone(`armL${e}`, n, B(.15 * e, .36, .05));
		t.bone(`hand${e}`, r, B(.165 * e, .25, .08));
		let i = t.bone(`legU${e}`, t.by.get("root"), B(.055 * e, .29, 0)), a = t.bone(`legL${e}`, i, B(.07 * e, .17, .045));
		t.bone(`foot${e}`, a, B(.07 * e, .045, -.01));
	}
	t.part(V(B(0, .3, .005), [
		.068,
		.05,
		.058
	], [8, 6]), "root", o), t.part(V(B(0, .375, .04), [
		.07,
		.068,
		.068
	], [9, 7]), "spine", o), t.part(V(B(0, .445, .03), [
		.08,
		.06,
		.058
	], [8, 6]), "chest", o);
	for (let e of [1, -1]) t.part(H(B(.025 * e, .45, .085), B(.03 * e, .415, .088), .007, .004), "chest", a);
	t.part(H(B(0, .47, .05), B(0, .55, .085), .03, .026), "neck", o), t.part(V(B(0, .478, .025), [
		.125,
		.04,
		.088
	], [9, 6]), "chest", p), t.part(H(B(0, .49, -.04), B(0, .4, -.06), .06, .004, 4), "chest", d);
	for (let e of [1, -1]) t.part(H(B(.1 * e, .47, 0), B(.12 * e, .43, 0), .04, .006, 4), "chest", d);
	t.part(new n(.062, .03, 10, 20).rotateX(Math.PI / 2 - .25).scale(1.25, 1, 1.1).translate(0, .505, .045), "chest", u);
	let C = (e, n, r, i, a = u) => t.part(H(e, n, r, .004, 4).scale(1, 1, 1), i, a);
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
	]) C(B(e, .49, n), B(e * 1.2, .49 - t, n + .012), .024, "chest");
	for (let [e, t] of [
		[-.06, .1],
		[-.02, .14],
		[.03, .12],
		[.07, .09]
	]) C(B(e, .5, -.02), B(e * 1.15, .5 - t, -.06), .026, "chest");
	for (let e of [1, -1]) C(B(.11 * e, .49, .03), B(.14 * e, .43, .03), .03, "chest");
	t.part(new n(.072, .012, 6, 20).rotateX(Math.PI / 2).scale(1, 1, 1.05).translate(0, .325, .025), "root", p), t.part(new M(.034, .03, .014).translate(0, .325, .104), "root", S), t.part(new M(.018, .014, .016).translate(0, .325, .106), "root", d);
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
	]) t.part(V(B(e, .3, n), [
		.026 * r,
		.03 * r,
		.022 * r
	], [7, 5]), "root", p), t.part(V(B(e, .322, n), [
		.024 * r,
		.008,
		.02 * r
	], [7, 3]), "root", d);
	let w = (e, n) => {
		let r = new m(new ue([
			[-.045, 0],
			[.045, 0],
			[.04, -.07],
			[.022, -.085],
			[.012, -.11],
			[-.004, -.09],
			[-.022, -.115],
			[-.035, -.08],
			[-.045, -.075]
		].map(([e, t]) => new qe(e, t))), {
			depth: .008,
			bevelEnabled: !1
		});
		r.translate(0, 0, -.004).rotateX(.15 * n).translate(0, .32, e), t.part(r, "root", u);
	};
	w(.085, -1), w(-.06, 1), t.part(V(B(0, .625, .07), [
		.112,
		.102,
		.108
	]), "head", o), t.part(V(B(0, .58, .125), [
		.088,
		.058,
		.07
	], [9, 7]), "head", o);
	for (let e of [1, -1]) t.part(V(B(.058 * e, .57, .155), [
		.03,
		.026,
		.026
	], [8, 6]), "head", o);
	for (let e of [1, -1]) t.part(V(B(0, 0, 0), [
		.042,
		.019,
		.03
	], [8, 6]).rotateZ(-.38 * e).translate(.038 * e, .632, .168), "head", o);
	t.part(H(B(0, .625, .19), B(0, .58, .235), .022, .02), "head", o), t.part(V(B(0, .575, .232), [
		.024,
		.022,
		.022
	], [8, 6]), "head", o);
	for (let e of [1, -1]) t.part(V(B(.04 * e, .608, .178), [
		.022,
		.016,
		.012
	], [6, 4]), "head", b), t.part(V(B(.04 * e, .608, .186), [
		.011,
		.009,
		.006
	], [6, 4]), "head", new A("#ff3a20"), !0);
	let T = (e) => .195 - 1.6 * e * e;
	t.part(V(B(0, .548, .172), [
		.07,
		.016,
		.032
	], [9, 4]), "head", y);
	for (let e = -4; e <= 4; e++) {
		let n = e * .0145;
		t.part(H(B(n, .556, T(n)), B(n, .538, T(n) + .003), .0065, .001, 4), "head", _);
	}
	for (let e = -3; e <= 3; e++) {
		let n = e * .016 + .007;
		t.part(H(B(n, .534, T(n) - .004), B(n, .55, T(n)), .006, .001, 4), "jaw", _);
	}
	t.part(V(B(0, .527, .14), [
		.07,
		.028,
		.058
	], [8, 6]), "jaw", o);
	let E = [
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
	], ee = 1.25, te = (e, t) => e.rotateZ(.5 * t).rotateY(.45 * t).translate(.085 * t, .635, .05);
	for (let e of [1, -1]) {
		let r = (t, n) => new m(new ue(E.map(([n, r]) => new qe(n * t * e * ee, r * t * ee))), {
			depth: .012,
			bevelEnabled: !1
		}).translate(0, 0, n);
		t.part(te(r(1, -.006), e), "head", o), t.part(te(r(.78, .004).translate(.02 * e, .002, 0), e), "head", x);
		for (let [r, i] of e > 0 ? [[.07, -.046], [.12, -.04]] : [[.1, -.046]]) t.part(te(new n(.016, .004, 4, 10).rotateY(Math.PI / 2).translate(r * e * ee, i * ee, 0), e), "head", S);
	}
	for (let e of [1, -1]) {
		t.part(V(B(.1 * e, .47, .03), [
			.03,
			.028,
			.03
		], [7, 5]), `armU${e}`, o), t.part(H(B(.1 * e, .475, .03), B(.15 * e, .36, .05), .022, .017), `armU${e}`, o), t.part(V(B(.15 * e, .36, .05), [
			.02,
			.02,
			.02
		], [6, 4]), `armL${e}`, o), t.part(H(B(.15 * e, .36, .05), B(.165 * e, .25, .08), .018, .016), `armL${e}`, o);
		for (let [n, r] of [
			[.3, .021],
			[.282, .022],
			[.264, .021]
		]) t.part(H(B(.158 * e, n + .008, .066), B(.16 * e, n - .008, .07), r, r, 7), `armL${e}`, (e, t) => t.y > .2 ? h : g);
		let n = B(.168 * e, .226, .09);
		t.part(V(n, [
			.034,
			.028,
			.038
		], [8, 6]), `hand${e}`, o);
		for (let r = 0; r < 4; r++) {
			let i = (r - 1.5) * .22, a = B(Math.sin(i) * .5 * e, -.55, .65).normalize(), s = B(Math.sin(i) * .4 * e, -.95, .15).normalize(), c = n.clone().add(B((r - 1.5) * .015 * e, -.008, .026)), l = c.clone().add(a.clone().multiplyScalar(.034 - Math.abs(r - 1.5) * .004)), u = l.clone().add(s.clone().multiplyScalar(.026));
			t.part(H(c, l, .0105, .009, 4), `hand${e}`, o), t.part(V(l, [
				.0095,
				.0095,
				.0095
			], [5, 4]), `hand${e}`, o), t.part(H(l, u, .009, .0065, 4), `hand${e}`, o), t.part(H(u, u.clone().add(B(0, -.012, -.008)), .0065, 8e-4, 4), `hand${e}`, v);
		}
		{
			let r = n.clone().add(B(-.022 * e, -.004, .018)), i = r.clone().add(B(-.016 * e, -.022, .026));
			t.part(H(r, i, .01, .008, 4), `hand${e}`, o), t.part(H(i, i.clone().add(B(-.002 * e, -.012, .004)), .006, 8e-4, 4), `hand${e}`, v);
		}
		t.part(H(B(.055 * e, .29, 0), B(.07 * e, .17, .045), .027, .02), `legU${e}`, o), t.part(V(B(.07 * e, .17, .045), [
			.024,
			.024,
			.024
		], [6, 4]), `legL${e}`, o), t.part(H(B(.07 * e, .17, .045), B(.07 * e, .045, -.01), .02, .016), `legL${e}`, o);
		for (let [n, r] of [
			[.14, .023],
			[.12, .024],
			[.1, .023],
			[.08, .021]
		]) {
			let i = (.17 - n) / .125;
			t.part(H(B(.07 * e, n + .009, .045 - .055 * i), B(.07 * e, n - .009, .045 - .055 * (i + .07)), r, r, 7), `legL${e}`, (e, t) => t.y > .2 ? h : g);
		}
		t.part(V(B(.07 * e, .026, .04), [
			.036,
			.02,
			.068
		], [8, 6]), `foot${e}`, o), t.part(V(B(.07 * e, .035, -.02), [
			.022,
			.022,
			.026
		], [6, 4]), `foot${e}`, o);
		for (let n = 0; n < 4; n++) {
			let r = (.07 + (n - 1.5) * .017) * e, i = B(r, .016, .09), a = B(r * 1.06, .01, .132 - Math.abs(n - 1.2) * .007);
			t.part(H(i, a, .011, .008, 4), `foot${e}`, o), t.part(H(a, a.clone().add(B(0, -.005, .014)), .007, .001, 4), `foot${e}`, v);
		}
	}
	{
		let e = [t.bones.indexOf(t.by.get("head")), t.bones.indexOf(t.by.get("jaw"))], n = B(0, .59, .1), r = 1.12;
		for (let i of t.parts) e.includes(i.bone) && i.geo.translate(-n.x, -n.y, -n.z).scale(r, r, r).translate(n.x, n.y, n.z);
		let i = t.by.get("jaw");
		i.userData.at.sub(n).multiplyScalar(r).add(n), i.position.copy(i.userData.at).sub(t.by.get("head").userData.at);
	}
	let ne = t.mesh(e.eyes || "#ff3a20", 1.5), re = (e = 1) => ({
		legU1: U(-.35 * e, 0, .05),
		"legU-1": U(-.35 * e, 0, -.05),
		legL1: U(.6 * e, 0, 0),
		"legL-1": U(.6 * e, 0, 0)
	}), ie = {
		armU1: U(-.45, 0, .18),
		armL1: U(-.55, 0, 0),
		"armU-1": U(-.45, 0, -.18),
		"armL-1": U(-.55, 0, 0),
		hand1: U(.3, 0, 0),
		"hand-1": U(.3, 0, 0)
	}, D = (e, t = 1) => {
		let n = {};
		for (let r of [1, -1]) {
			let i = r > 0 ? 0 : .5, a = G(e + i), o = Math.max(0, -au(e + i));
			n[`legU${r}`] = U(-.35 - .6 * t * a, 0, .05 * r), n[`legL${r}`] = U(.55 + 1 * t * o, 0, 0), n[`foot${r}`] = U(-.3 * t * o, 0, 0), n[`armU${r}`] = U(-.35 + .6 * t * a, 0, .15 * r), n[`armL${r}`] = U(-.7, 0, 0);
		}
		return n;
	};
	return {
		root: ne,
		clips: [
			W(t, "Idle", 1.8, (e) => {
				let t = Math.max(-1, Math.min(1, 2.2 * G(e)));
				return {
					q: {
						...re(),
						...ie,
						spine: U(.25 + .03 * G(e * 2), 0, 0),
						chest: U(.05 * G(e * 2), 0, 0),
						head: U(-.2, .45 * t, .06 * t),
						jaw: U(.12 * Math.max(0, G(e * 3)), 0, 0),
						hand1: U(.3 + .2 * G(e * 4), 0, 0),
						"hand-1": U(.3 + .2 * G(e * 4 + .3), 0, 0)
					},
					p: { root: B(0, -.035 + .006 * G(e * 2), 0) }
				};
			}),
			W(t, "Walk", .5, (e) => ({
				q: {
					...D(e),
					spine: U(.4, .12 * G(e), 0),
					head: U(-.35 + .08 * G(e * 2), -.12 * G(e), 0),
					root: U(0, -.15 * G(e), 0)
				},
				p: { root: B(0, -.04 + .025 * Math.abs(G(e)), 0) }
			})),
			W(t, "Attack", .6, (e) => {
				let t = K(0, .3, .42, e), n = K(.36, .48, .85, e);
				return {
					q: {
						...re(1 + .3 * n),
						...ie,
						spine: U(.2 - .25 * t + .45 * n, .35 * t - .35 * n, 0),
						"armU-1": U(-.45 - 2.1 * t + 1.6 * n, 0, -.18 - .3 * t + .3 * n),
						"armL-1": U(-.55 - .4 * t + .5 * n, 0, 0),
						"hand-1": U(-.4 * t + .6 * n, 0, 0),
						head: U(-.2 + .25 * n, 0, 0),
						jaw: U(.4 * t, 0, 0)
					},
					p: { root: B(0, -.035 - .02 * n, .06 * n) }
				};
			}),
			W(t, "Attack2", .5, (e) => {
				let t = K(0, .25, .38, e), n = K(.32, .42, .8, e);
				return {
					q: {
						...re(1 + .4 * n),
						...ie,
						spine: U(.25 + .3 * n, .3 * t - .3 * n, 0),
						armU1: U(-.45 + .4 * t - 1.2 * n, -.3 * n, .18),
						armL1: U(-1.3 * t - .1 * n, 0, 0),
						jaw: U(.3 * n, 0, 0)
					},
					p: { root: B(0, -.04, -.03 * t + .12 * n) }
				};
			}),
			W(t, "Heavy", .9, (e) => {
				let t = K(0, .22, .32, e), n = K(.25, .45, .62, e), r = K(.55, .65, .95, e);
				return {
					q: {
						...re(1 + .8 * t - .6 * n + .5 * r),
						spine: U(.3 * t - .3 * n + .6 * r, 0, 0),
						armU1: U(-.45 - 2.4 * n + 1.8 * r, 0, .3),
						"armU-1": U(-.45 - 2.4 * n + 1.8 * r, 0, -.3),
						armL1: U(-.5 - .3 * n, 0, 0),
						"armL-1": U(-.5 - .3 * n, 0, 0),
						jaw: U(.5 * n, 0, 0),
						head: U(-.3 * n + .2 * r, 0, 0)
					},
					p: { root: B(0, -.035 - .05 * t + .16 * n - .03 * r, .3 * ou(.25, .65, e)) }
				};
			}),
			W(t, "Hit", .4, (e) => {
				let t = K(0, .2, 1, e);
				return {
					q: {
						...re(),
						...ie,
						spine: U(.2 - .35 * t, .15 * t, 0),
						head: U(-.2 - .4 * t, -.3 * t, 0),
						jaw: U(.3 * t, 0, 0)
					},
					p: { root: B(0, -.035, -.05 * t) }
				};
			}),
			W(t, "Death", 1.1, (e) => {
				let t = ou(0, .65, e);
				return {
					q: {
						...re(1 - .5 * t),
						root: U(-1.45 * t, 0, .1 * t),
						spine: U(.2 - .3 * t, 0, 0),
						head: U(-.3 - .5 * t, .4 * t, 0),
						jaw: U(.5 * t, 0, 0),
						armU1: U(-.3 - 1.2 * t, 0, .7 * t),
						"armU-1": U(-.5 - 1.4 * t, 0, -.6 * t),
						armL1: U(-.3, 0, 0),
						"armL-1": U(-.4, 0, 0)
					},
					p: { root: B(0, -.035 - .18 * t, -.12 * t) }
				};
			}),
			W(t, "Cast", .9, (e) => {
				let t = K(.05, .3, .85, e), n = Math.max(0, G(e * 4));
				return {
					q: {
						...re(1 - .3 * t),
						...ie,
						spine: U(.2 - .3 * t, 0, 0),
						head: U(-.2 - .5 * t, .1 * G(e * 2), 0),
						jaw: U(.6 * t * (.5 + .5 * n), 0, 0),
						"armU-1": U(-.45 - 2.2 * t, 0, -.18 - .4 * t),
						armU1: U(-.45 - 2.2 * t, 0, .18 + .4 * t),
						armL1: U(-.55 + .3 * t, 0, 0),
						"armL-1": U(-.55 + .3 * t, 0, 0)
					},
					p: { root: B(0, -.035 + .04 * t * n, 0) }
				};
			})
		]
	};
}
function pu(e = {}) {
	let t = new Jl(e.seed || 53), n = new A(e.robe || "#2b2f30"), r = new A(e.robeHi || "#38483f"), i = new A("#141617"), a = (e, t) => t.y > .8 ? r : t.y < -.35 ? i : n, o = new A("#b9b4a0"), s = new A("#7d796a"), c = new A("#3f4744"), l = new A("#c8c6b0"), u = new A("#050706"), d = new A("#2a2c2c"), f = new A("#bfffe0"), p = (e, t) => t.y < -.3 ? s : o;
	t.bone("root", null, B(0, .85, 0)), t.bone("spine", t.by.get("root"), B(0, 1, 0)), t.bone("chest", t.by.get("spine"), B(0, 1.2, .03)), t.bone("neck", t.by.get("chest"), B(0, 1.32, .07)), t.bone("head", t.by.get("neck"), B(0, 1.4, .1)), t.bone("jaw", t.by.get("head"), B(0, 1.375, .15));
	let m = {};
	for (let e of [1, -1]) {
		let n = B(.2 * e, 1.27, .04), r = B(.3 * e, .99, .12), i = B(.35 * e, .7, .29), a = r.clone().sub(n).normalize(), o = i.clone().sub(r).normalize(), s = a.clone().cross(o).normalize(), c = B(-e, 0, .25).normalize(), l = c.clone().cross(o).normalize(), u = i.clone().add(o.clone().multiplyScalar(.07)), d = t.bone(`armU${e}`, t.by.get("chest"), n), f = t.bone(`armL${e}`, d, r), p = t.bone(`hand${e}`, f, i);
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
		B(0, .95, 0),
		B(.03, .66, -.02),
		B(-.03, .4, 0),
		B(.01, .15, .03)
	], g = [
		.13,
		.15,
		.11,
		.06
	], _ = t.by.get("root");
	for (let e = 0; e < 3; e++) _ = t.bone(`shroud${e}`, _, h[e]), t.part(H(h[e + 1], h[e], g[e + 1], g[e], 9), `shroud${e}`, a);
	t.part(H(h[3], B(0, .04, .04), .04, .003, 6), "shroud2", a);
	let v = [];
	for (let e = 0; e < 6; e++) {
		let n = e / 6 * iu + .3, r = .9, i = eu(e, 2, 5, 13), o = .08 + .12 * i, s = (e, t, i) => B(t * Math.cos(n + r * e), i, t * Math.sin(n + r * e)), c = [
			s(0, .08, .5 - e % 2 * .12),
			s(.5, .18, .24 + o * .3),
			s(.9, .27 + .05 * i, .26 + o * .5),
			s(1.25, .32 + .06 * i, .42 + o),
			s(1.45, .3 + .06 * i, .62 + o * 1.2)
		], l = t.by.get("root"), u = [];
		for (let n = 0; n < 3; n++) l = t.bone(`tend${e}${n}`, l, c[n]), u.push(`tend${e}${n}`);
		let d = Ql(c, [
			.09,
			.08,
			.06,
			.035,
			.002
		], u, 8, 20);
		t.part(d.g, t.skin(d.skin), a), v.push(u);
	}
	t.part(V(B(0, 1.25, .02), [
		.24,
		.11,
		.16
	], [12, 8]), "chest", a), t.part(H(B(0, .96, 0), B(0, 1.2, .02), .13, .2, 10), "spine", a);
	for (let e of [1, -1]) t.part(H(B(.17 * e, 1.27, .08), B(.03 * e, .95, .15), .085, .01, 3), "chest", a), t.part(H(B(.21 * e, 1.24, .03), B(.12 * e, .9, .09), .07, .006, 3), "chest", a), t.part(H(B(.12 * e, 1.27, -.08), B(.1 * e, .82, -.14), .085, .006, 3), "chest", a);
	t.part(H(B(0, 1.27, -.1), B(0, .74, -.16), .09, .006, 3), "chest", a), t.part(V(B(0, 1.45, .05), [
		.14,
		.16,
		.13
	], [12, 9]), "head", a), t.part(V(B(0, 1.53, .14), [
		.11,
		.04,
		.08
	], [8, 5], -.3), "head", a);
	for (let e of [1, -1]) t.part(H(B(.11 * e, 1.44, .1), B(.15 * e, 1.26, .06), .05, .03, 5), "head", a);
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
		let i = B(e, 1.56, .1), a = B(e + r * .6, 1.56 + n * .55, .09), o = B(e + r * 1.6, 1.56 + n, .06);
		t.part(H(i, a, .03, .017, 5), "head", d), t.part(H(a, o, .017, .002, 4), "head", d);
	}
	t.part(V(B(0, 1.425, .165), [
		.09,
		.098,
		.088
	], [10, 8]), "head", p), t.part(V(B(0, 1.462, .23), [
		.08,
		.025,
		.035
	], [8, 4]), "head", o);
	for (let e of [1, -1]) t.part(V(B(.037 * e, 1.43, .238), [
		.03,
		.027,
		.016
	], [6, 5]), "head", u), t.part(V(B(.037 * e, 1.43, .25), [
		.012,
		.01,
		.006
	], [5, 3]), "head", f, !0), t.part(V(B(.063 * e, 1.39, .215), [
		.024,
		.02,
		.027
	], [6, 4]), "head", o);
	t.part(V(B(0, 1.4, .252), [
		.011,
		.015,
		.008
	], [4, 3]), "head", u);
	for (let e = -3; e <= 3; e++) t.part(H(B(e * .012, 1.374, .238 - Math.abs(e) * .005), B(e * .012, 1.352, .24 - Math.abs(e) * .005), .006, .002, 3), "head", l);
	t.part(V(B(0, 1.33, .205), [
		.058,
		.024,
		.045
	], [8, 5]), "jaw", p);
	for (let e = -2; e <= 2; e++) t.part(H(B(e * .013, 1.34, .243 - Math.abs(e) * .005), B(e * .013, 1.36, .244 - Math.abs(e) * .005), .006, .002, 3), "jaw", l);
	for (let e of [1, -1]) {
		let n = m[e], r = `armU${e}`, i = `armL${e}`, o = `hand${e}`, s = `claw${e}`, d = t.skin((e) => {
			let t = Math.max(0, Math.min(1, e.distanceTo(n.Sh) / .1));
			return t >= 1 ? [[r, 1]] : [[r, .45 + .55 * t], ["chest", .55 - .55 * t]];
		}), f = t.skin((e) => {
			let t = Math.max(0, Math.min(1, e.distanceTo(n.El) / .06));
			return t >= 1 ? [[i, 1]] : [[i, .5 + .5 * t], [r, .5 - .5 * t]];
		});
		t.part(V(n.Sh.clone().add(B(0, .01, 0)), [
			.075,
			.065,
			.075
		]), d, a), t.part(H(n.Sh, n.El.clone().add(n.up.clone().multiplyScalar(.03)), .065, .12, 9), d, (e, t) => t.dot(n.up) > .7 ? u : a(e, t));
		for (let i = 0; i < 7; i++) {
			let o = i / 7 * iu + .4, s = .105, c = n.El.clone().add(n.up.clone().multiplyScalar(.03)), l = B(e, 0, 0), u = B(0, 0, 1), d = c.clone().add(l.clone().multiplyScalar(Math.cos(o) * s)).add(u.clone().multiplyScalar(Math.sin(o) * s * .9)), f = .1 + .09 * eu(i, e, 6, 3) + (Math.sin(o) < 0 ? .06 : 0);
			t.part(H(d, d.clone().add(B(.01 * e * Math.cos(o), -f, -.02)), .032, .003, 3), r, a);
		}
		t.part(H(n.El.clone().add(n.up.clone().multiplyScalar(-.02)), n.Wr, .034, .025, 7), f, c), t.part(V(n.El, [
			.032,
			.03,
			.032
		], [6, 5]), f, c), t.part(V(n.Wr.clone().add(n.fore.clone().multiplyScalar(.035)), [
			.05,
			.055,
			.04
		], [7, 5]), o, c);
		for (let e = 0; e < 4; e++) {
			let r = (e - 1.5) * .24, i = n.fore.clone().multiplyScalar(Math.cos(r)).add(n.spread.clone().multiplyScalar(Math.sin(r))).normalize(), a = n.Kn.clone().add(n.spread.clone().multiplyScalar((e - 1.5) * .022)), o = .1 - Math.abs(e - 1.5) * .01, u = a.clone().add(i.clone().multiplyScalar(o)), d = i.clone().add(n.palm.clone().multiplyScalar(.45)).normalize(), f = u.clone().add(d.clone().multiplyScalar(o * .8)), p = d.clone().add(n.palm.clone().multiplyScalar(.5)).normalize();
			t.part(H(a, u, .015, .012, 5), s, c), t.part(V(u, [
				.013,
				.013,
				.013
			], [5, 4]), s, c), t.part(H(u, f, .012, .009, 5), s, c), t.part(H(f, f.clone().add(p.multiplyScalar(.065)), .009, .001, 4), s, l);
		}
		{
			let e = n.Wr.clone().add(n.fore.clone().multiplyScalar(.025)).add(n.palm.clone().multiplyScalar(.025)).add(n.spread.clone().multiplyScalar(-.03)), r = n.fore.clone().multiplyScalar(.5).add(n.palm.clone().multiplyScalar(.55)).add(n.spread.clone().multiplyScalar(-.45)).normalize(), i = e.clone().add(r.clone().multiplyScalar(.07));
			t.part(H(e, i, .012, .009, 5), o, c), t.part(H(i, i.clone().add(r.add(n.palm.clone().multiplyScalar(.4)).normalize().multiplyScalar(.04)), .008, .001, 4), o, l);
		}
	}
	let y = t.mesh(e.glow || "#5ff0a0", 1.3), b = (e, t = 1, n = 0) => ({
		...Object.fromEntries([
			0,
			1,
			2
		].map((r) => [`shroud${r}`, U(n * (.12 + .08 * r) + .05 * t * G(e - r * .2), .15 * t * G(e * .5 - r * .25), .05 * t * au(e - r * .2))])),
		...Object.fromEntries(v.flatMap((r, i) => r.map((r, a) => [r, U(n * .3 + .16 * t * G(e + i / 6 + a * .15), .1 * t * au(e * .5 + i / 6), .14 * t * G(e * 1.3 + i / 6 - a * .2))])))
	}), x = B(1, 0, 0), S = B(0, 0, 1), C = (e, { fwd: t = 0, out: n = 0, bend: r = 0, curl: i = 0, wrist: a = 0, twist: o = 0 } = {}) => {
		let s = m[e];
		return {
			[`armU${e}`]: $l(ql, -o * e).multiply($l(S, n * e)).multiply($l(x, -t)),
			[`armL${e}`]: $l(s.hinge, -r),
			[`hand${e}`]: $l(s.hinge, -a),
			[`claw${e}`]: $l(s.spread, i * e)
		};
	}, w = (e, t) => ({
		...C(1, e),
		...C(-1, t)
	}), T = (e, t, n) => e(t - n);
	return {
		root: y,
		clips: [
			W(t, "Idle", 3, (e) => {
				let t = (e) => K(.25, .48, .78, (e % 1 + 1) % 1), n = .06 * G(e);
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
						head: U(.08 * G(e + .2), .15 * G(e * .5), .05 * G(e)),
						jaw: U(.3 + .12 * Math.max(0, G(e * 2)), 0, 0),
						spine: U(.06 + .03 * G(e), 0, 0)
					},
					p: { root: B(0, .04 * G(e), 0) }
				};
			}),
			W(t, "Walk", 1.2, (e) => ({
				q: {
					...b(e * 2, 1.3, .45),
					root: U(.2, 0, .05 * G(e)),
					...w({
						fwd: -.4 + .18 * G(e),
						out: .12,
						bend: .3 + .12 * G(e - .1),
						curl: .3 + .1 * G(e - .2)
					}, {
						fwd: -.4 + .18 * G(e + .5),
						out: .12,
						bend: .3 + .12 * G(e + .4),
						curl: .3 + .1 * G(e + .3)
					}),
					jaw: U(.3, 0, 0)
				},
				p: { root: B(0, .03 * G(e * 2), 0) }
			})),
			W(t, "Attack", .7, (e) => {
				let t = K(0, .3, .45, e), n = K(.38, .52, .9, e), r = K(0, .33, .48, e), i = K(.4, .55, .9, e), a = K(.46, .6, .95, e);
				return {
					q: {
						...b(e, 1.5, .2 * n),
						chest: U(.15 * n, -.45 * t + .5 * n, 0),
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
						jaw: U(.3 + .4 * n, 0, 0),
						head: U(.15 * n, .25 * n, 0)
					},
					p: { root: B(0, .04 * t, .12 * n) }
				};
			}),
			W(t, "Attack2", .75, (e) => {
				let t = K(0, .35, .5, e), n = K(.42, .56, .92, e), r = K(.46, .6, .92, e), i = K(.52, .64, .96, e), a = (e) => ({
					fwd: -.45 * t + 1.55 * n,
					out: .3 * t - .2 * n + e,
					bend: .2 + .8 * t - .55 * r,
					curl: .2 - .6 * t - .2 * n + 1.3 * i
				});
				return {
					q: {
						...b(e, 1.5, .3 * n),
						...w(a(0), a(.04)),
						spine: U(-.2 * t + .4 * n, 0, 0),
						jaw: U(.3 + .5 * t, 0, 0)
					},
					p: { root: B(0, .08 * t - .04 * n, .1 * n) }
				};
			}),
			W(t, "Heavy", 1.1, (e) => {
				let t = K(0, .35, .55, e), n = K(.5, .62, .95, e), r = K(0, .4, .6, e), i = (e) => ({
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
						spine: U(-.35 * t + .5 * n, 0, 0),
						head: U(-.5 * t + .3 * n, 0, 0),
						jaw: U(.3 + .6 * t, 0, 0)
					},
					p: { root: B(0, .18 * t - .08 * n, .38 * ou(.5, .8, e)) }
				};
			}),
			W(t, "Hit", .45, (e) => {
				let t = K(0, .2, 1, e), n = K(0, .26, 1, e), r = {
					fwd: .85 * t,
					out: -.45 * t,
					bend: .1 + 1.5 * n,
					curl: .2 + .8 * n
				};
				return {
					q: {
						...b(e * 2, 1 + 2 * t, -.3 * t),
						...w(r, r),
						spine: U(-.3 * t, .2 * t, 0),
						head: U(-.35 * t, -.2 * t, 0),
						jaw: U(.3 + .3 * t, 0, 0)
					},
					p: { root: B(0, .03 * t, -.08 * t) }
				};
			}),
			W(t, "Death", 1.6, (e) => {
				let t = K(0, .18, .42, e), n = ou(.2, .9, e), r = 1 - .72 * n, i = (e) => ({
					fwd: 2.3 * t + .35 * n,
					out: .4 * t - .3 * n + e,
					bend: .1 - .35 * t + .6 * n,
					curl: -.5 * t + .9 * n
				});
				return {
					q: {
						...b(e * 2, 2 * t + .3, -.5 * n),
						...w(i(0), i(.1)),
						spine: U(.15 * n - .3 * t, 0, 0),
						head: U(-.5 * t + .5 * n, 0, 0),
						jaw: U(.3 + .6 * t, 0, 0)
					},
					p: { root: B(0, .1 * t - .74 * n, 0) },
					s: { root: B(1 + .3 * n, r, 1 + .3 * n) }
				};
			}),
			W(t, "Cast", 1, (e) => {
				let t = K(.05, .4, .9, e), n = K(.1, .45, .92, e), r = .06 * G(e * 11) * t, i = (e) => ({
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
						spine: U(-.25 * t, 0, 0),
						head: U(-.45 * t, 0, 0),
						jaw: U(.3 + .5 * t, 0, 0)
					},
					p: { root: B(0, .1 * t, 0) }
				};
			})
		]
	};
}
function mu(e, t, n = 0, r = .22, i = [
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
	].map(([e, t]) => new qe(Math.max(1e-4, e), t)), o = new Ze(a, 8).rotateY(Math.PI / 8), s = o.attributes.position, c = new j(), l = 1 / Math.cos(Math.PI / 8);
	for (let e = 0; e < s.count; e++) {
		c.fromBufferAttribute(s, e);
		let r = 1 + (eu(Math.round(c.x * 1e3), Math.round(c.y * 1e3), Math.round(c.z * 1e3), n) - .5) * .12;
		s.setXYZ(e, c.x * t[0] * l * r, c.y * t[1] * r, c.z * t[2] * l * r);
	}
	return o.rotateX(i[0]).rotateY(i[1]).rotateZ(i[2]), o.translate(e.x, e.y, e.z), o;
}
function hu(e = {}) {
	let t = new Jl(e.seed || 67), r = e.seed || 67;
	t.crease = 28 * Math.PI / 180;
	let i = new A(e.stone || "#46525e"), a = new A(e.stoneHi || "#5a6774"), o = new A("#2c343e"), s = new A(e.moss || "#5e6c1e"), c = new A("#7e8c2a"), l = new A("#68761a"), u = new A("#5e3a20"), d = new A("#84552c"), f = new A("#121416"), m = new A("#ffb24a"), h = (e, t) => t.y > .8 && eu(Math.round(e.x * 18), Math.round(e.y * 18), Math.round(e.z * 18), r) > .72 ? s : t.y > .35 ? ru(i, a, (t.y - .35) * 2) : t.y < -.35 ? o : i;
	t.bone("root", null, B(0, .62, 0)), t.bone("spine", t.by.get("root"), B(0, .84, 0)), t.bone("chest", t.by.get("spine"), B(0, 1.22, .02)), t.bone("head", t.by.get("chest"), B(0, 1.5, .12));
	for (let e of [1, -1]) {
		let n = t.bone(`armU${e}`, t.by.get("chest"), B(.48 * e, 1.48, 0)), r = t.bone(`armL${e}`, n, B(.6 * e, 1.08, .05));
		t.bone(`fist${e}`, r, B(.6 * e, .62, .14));
		let i = t.bone(`legU${e}`, t.by.get("root"), B(.19 * e, .58, 0)), a = t.bone(`legL${e}`, i, B(.21 * e, .33, .03));
		t.bone(`foot${e}`, a, B(.21 * e, .09, .02));
	}
	let g = 0, _ = (e, n, i, a = .22, o = [
		0,
		0,
		0
	]) => t.part(mu(e, n, r + ++g, a, o), i, h);
	_(B(0, .62, 0), [
		.25,
		.08,
		.17
	], "root", .3), _(B(0, .78, .01), [
		.2,
		.1,
		.16
	], "spine", .3), _(B(0, 1.18, 0), [
		.38,
		.25,
		.25
	], "chest", .28), _(B(0, 1.38, -.12), [
		.3,
		.14,
		.15
	], "chest", .3);
	for (let e of [1, -1]) _(B(.2 * e, 1.34, .17), [
		.15,
		.1,
		.08
	], "chest", .3, [
		.1,
		0,
		.08 * e
	]), _(B(.22 * e, 1.02, .15), [
		.13,
		.08,
		.08
	], "chest", .3, [
		-.1,
		0,
		-.06 * e
	]);
	t.part(new D(.17, .19, .08, 10).rotateX(Math.PI / 2).translate(0, 1.16, .25), "chest", h), t.part(new n(.115, .016, 4, 14).translate(0, 1.16, .293), "chest", o), t.part(new D(.045, .045, .04, 8).rotateX(Math.PI / 2).translate(0, 1.16, .282), "chest", f), t.part(V(B(0, 1.16, .27), [
		.022,
		.022,
		.01
	], [6, 4]), "chest", m, !0);
	for (let [e, n] of [
		[-.07, 1.25],
		[.08, 1.09],
		[.1, 1.23]
	]) t.part(V(B(e, n, .295), [
		.012,
		.012,
		.006
	], [5, 3]), "chest", f);
	_(B(0, 1.54, .15), [
		.13,
		.11,
		.12
	], "head", .25);
	for (let e of [1, -1]) _(B(.1 * e, 1.69, .13), [
		.05,
		.075,
		.05
	], "head", .3, [
		0,
		0,
		-.35 * e
	]), t.part(V(B(.052 * e, 1.565, .268), [
		.026,
		.026,
		.012
	], [6, 4]), "head", f), t.part(V(B(.052 * e, 1.565, .272), [
		.011,
		.011,
		.005
	], [5, 3]), "head", m, !0);
	t.part(new M(.11, .035, .02).translate(0, 1.485, .266), "head", f);
	for (let e of [1, -1]) {
		_(B(.48 * e, 1.5, 0), [
			.17,
			.15,
			.16
		], `armU${e}`, .28, [
			0,
			0,
			.15 * e
		]), _(B(.55 * e, 1.27, .02), [
			.11,
			.14,
			.11
		], `armU${e}`, .25), _(B(.6 * e, 1.08, .05), [
			.1,
			.07,
			.1
		], `armL${e}`, .3), _(B(.6 * e, .86, .09), [
			.14,
			.19,
			.14
		], `armL${e}`, .25), _(B(.6 * e, .58, .14), [
			.13,
			.1,
			.13
		], `fist${e}`, .3);
		for (let t of [
			-1,
			0,
			1
		]) _(B((.6 + t * .075) * e, .5, .2), [
			.035,
			.04,
			.045
		], `fist${e}`, .35);
		t.part(new n(.165, .035, 5, 12).rotateX(Math.PI / 2).translate(.6 * e, .76, .09), `armL${e}`, (e, t) => t.y > .3 ? d : u);
		let r = [
			B(.73 * e, .72, .16),
			B(.68 * e, .42, .22),
			B(.66 * e, .12, .28),
			B(.6 * e, .03, .4),
			B(.45 * e, .03, .5)
		], i = 0;
		for (let a = 0; a < r.length - 1; a++) {
			let o = r[a], s = r[a + 1], c = o.distanceTo(s), l = Math.max(2, Math.round(c / .055));
			for (let r = 0; r < l; r++) {
				let a = o.clone().lerp(s, (r + .5) / l), c = s.clone().sub(o).normalize(), f = new n(.03, .01, 3, 6).scale(1, 1.5, 1);
				i++ % 2 && f.rotateY(Math.PI / 2), f.applyQuaternion(new p().setFromUnitVectors(ql, c)).translate(a.x, a.y, a.z), t.part(f, `armL${e}`, (e, t) => t.y > .3 ? d : u);
			}
		}
		_(B(.19 * e, .47, .02), [
			.12,
			.11,
			.12
		], `legU${e}`, .28), _(B(.21 * e, .33, .04), [
			.1,
			.06,
			.1
		], `legL${e}`, .3), _(B(.21 * e, .2, .04), [
			.11,
			.1,
			.11
		], `legL${e}`, .28), _(B(.21 * e, .055, .08), [
			.13,
			.055,
			.17
		], `foot${e}`, .3);
	}
	let v = [
		[
			"chest",
			B(-.25, 1.4, .21),
			B(-.12, 1.02, .25)
		],
		[
			"chest",
			B(.3, 1.32, .2),
			B(.18, .98, .22)
		],
		[
			"chest",
			B(-.05, 1.34, .25),
			B(.04, 1.27, .27)
		],
		[
			"spine",
			B(.1, .86, .17),
			B(.05, .7, .17)
		],
		[
			"head",
			B(-.08, 1.64, .25),
			B(-.05, 1.5, .27)
		]
	];
	for (let e of [1, -1]) v.push([
		`armL${e}`,
		B(.68 * e, 1, .2),
		B(.62 * e, .7, .24)
	], [
		`legU${e}`,
		B(.25 * e, .56, .13),
		B(.2 * e, .4, .14)
	], [
		`armU${e}`,
		B(.4 * e, 1.62, .12),
		B(.5 * e, 1.4, .16)
	]);
	v.push([
		"chest",
		B(.05, 1.42, .22),
		B(.25, 1.24, .24)
	], [
		"chest",
		B(-.3, 1.08, .2),
		B(-.1, .96, .2)
	]);
	for (let e of [1, -1]) v.push([
		`legL${e}`,
		B(.25 * e, .29, .14),
		B(.18 * e, .1, .15)
	], [
		`armU${e}`,
		B(.58 * e, 1.38, .13),
		B(.52 * e, 1.16, .13)
	]);
	for (let [e, n, r] of v) {
		let i = n.clone().lerp(r, .33).add(B(.025, 0, .01)), a = n.clone().lerp(r, .66).add(B(-.02, 0, .01));
		t.part(H(n, i, .018, .016, 3), e, l), t.part(H(i, a, .016, .013, 3), e, l), t.part(H(a, r, .013, .004, 3), e, l);
	}
	let y = (e, n, r = 1) => {
		t.part(V(e.clone().add(B(0, .015 * r, 0)), [
			.03 * r,
			.025 * r,
			.03 * r
		], [6, 4]), n, s);
		for (let i = 0; i < 12; i++) {
			let a = i / 12 * iu + i % 2 * .3, o = .35 + .5 * (i * 7 % 5) / 5, l = B(Math.cos(a) * Math.cos(o), Math.sin(o) + .3, Math.sin(a) * Math.cos(o)).normalize();
			t.part(H(e.clone().add(B(0, .012 * r, 0)), e.clone().add(l.clone().multiplyScalar((.045 + i % 3 * .015) * r)), .016 * r, .002, 3), n, i % 3 ? c : s);
		}
	};
	for (let e of [1, -1]) y(B(.11 * e, 1.77, .13), "head", 1.5), y(B(.46 * e, 1.66, .02), `armU${e}`, 1.9), y(B(.62 * e, 1, .18), `armL${e}`, 1.6), y(B(.21 * e, .4, .12), `legU${e}`, 1.3), y(B(.66 * e, .6, .12), `fist${e}`, 1.2);
	y(B(-.2, 1.44, .12), "chest", 1.8), y(B(.16, .71, .08), "root", 1.3), y(B(.27, 1.3, .22), "chest", 1.3);
	let b = t.mesh(e.glow || "#ff8418", 1), x = {
		armU1: U(-.1, 0, .12),
		"armU-1": U(-.1, 0, -.12),
		armL1: U(-.25, 0, 0),
		"armL-1": U(-.25, 0, 0)
	};
	return {
		root: b,
		clips: [
			W(t, "Idle", 3.2, (e) => ({
				q: {
					...x,
					chest: U(.06 + .03 * G(e), .06 * G(e * .5), 0),
					head: U(.05 * G(e), .25 * G(e * .5 + .2), 0),
					armU1: U(-.1 + .04 * G(e), 0, .12),
					"armU-1": U(-.1 + .04 * G(e + .3), 0, -.12)
				},
				p: { root: B(0, -.012 + .008 * G(e), 0) }
			})),
			W(t, "Walk", 1.1, (e) => {
				let t = {};
				for (let n of [1, -1]) {
					let r = n > 0 ? 0 : .5, i = G(e + r), a = Math.max(0, -au(e + r));
					t[`legU${n}`] = U(-.38 * i - .15 * a, 0, 0), t[`legL${n}`] = U(.65 * a, 0, 0), t[`armU${n}`] = U(-.1 + .3 * G(e + r + .5), 0, .12 * n), t[`armL${n}`] = U(-.3, 0, 0);
				}
				return {
					q: {
						...t,
						root: U(0, .08 * G(e), .06 * G(e)),
						chest: U(.12, -.1 * G(e), -.04 * G(e))
					},
					p: { root: B(.03 * G(e), -.035 * Math.abs(au(e)), 0) }
				};
			}),
			W(t, "Attack", .9, (e) => {
				let t = K(0, .38, .52, e), n = K(.45, .58, .95, e);
				return {
					q: {
						...x,
						chest: U(.1 + .2 * n, .45 * t - .6 * n, 0),
						"armU-1": U(.5 * t - 1.6 * n, .4 * n, -.6 * t + .2 * n),
						"armL-1": U(-1 * t - .2 * n, 0, 0),
						armU1: U(-.4 * t, 0, .3),
						head: U(.15 * n, -.2 * n, 0)
					},
					p: { root: B(0, 0, .12 * n) }
				};
			}),
			W(t, "Attack2", .85, (e) => {
				let t = K(0, .35, .5, e), n = K(.42, .56, .9, e);
				return {
					q: {
						...x,
						chest: U(.1, -.5 * t + .6 * n, 0),
						armU1: U(-.5 - .6 * t - .4 * n, .7 * t - 1.2 * n, .4 + .6 * t),
						armL1: U(-.6 * t, 0, 0)
					},
					p: { root: B(0, 0, .06 * n) }
				};
			}),
			W(t, "Heavy", 1.4, (e) => {
				let t = K(0, .4, .55, e), n = K(.5, .6, 1, e);
				return {
					q: {
						armU1: U(-.1 - 2.9 * t + 2.2 * n, 0, .12),
						"armU-1": U(-.1 - 2.9 * t + 2.2 * n, 0, -.12),
						armL1: U(-.25 - .3 * t + .15 * n, 0, 0),
						"armL-1": U(-.25 - .3 * t + .15 * n, 0, 0),
						chest: U(-.25 * t + .65 * n, 0, 0),
						spine: U(.25 * n, 0, 0),
						head: U(-.2 * t + .1 * n, 0, 0),
						legU1: U(-.4 * n, 0, 0),
						"legU-1": U(-.4 * n, 0, 0),
						legL1: U(.7 * n, 0, 0),
						"legL-1": U(.7 * n, 0, 0)
					},
					p: { root: B(0, .06 * t - .17 * n, .1 * n) }
				};
			}),
			W(t, "Hit", .5, (e) => {
				let t = K(0, .25, 1, e);
				return {
					q: {
						...x,
						chest: U(-.15 * t, .12 * t, 0),
						head: U(-.2 * t, .15 * t, 0)
					},
					p: { root: B(0, 0, -.05 * t) }
				};
			}),
			W(t, "Death", 1.8, (e) => {
				let t = ou(0, .5, e), n = ou(.3, .85, e), r = ou(.15, .6, e);
				return {
					q: {
						legU1: U(-.9 * t, 0, .3 * t),
						"legU-1": U(-.7 * t, 0, -.2 * t),
						legL1: U(1.3 * t, 0, 0),
						"legL-1": U(1.1 * t, 0, 0),
						chest: U(.7 * n, .2 * n, .25 * n),
						spine: U(.3 * n, 0, 0),
						head: U(1.2 * r, .8 * r, .5 * r),
						armU1: U(.6 * n, 0, .5 * n),
						"armU-1": U(-.3 * n, 0, -.9 * n),
						armL1: U(.4 * n, 0, 0),
						"armL-1": U(.3 * n, 0, 0)
					},
					p: {
						root: B(0, -.42 * t, .05 * n),
						head: B(.12 * r, -.55 * r, .35 * r),
						armU1: B(.15 * n, -.35 * n, .05 * n),
						"armU-1": B(-.2 * n, -.3 * n, .1 * n)
					}
				};
			}),
			W(t, "Cast", 1.2, (e) => {
				let t = K(.05, .4, .9, e), n = Math.max(0, G(e * 3)) * t;
				return {
					q: {
						armU1: U(-.6 * t, 0, .12 + 1 * t),
						"armU-1": U(-.6 * t, 0, -.12 - 1 * t),
						armL1: U(-.6 * t, 0, 0),
						"armL-1": U(-.6 * t, 0, 0),
						chest: U(-.3 * t, 0, 0),
						head: U(-.4 * t, 0, 0)
					},
					p: { root: B(0, .04 * n, 0) }
				};
			})
		]
	};
}
var gu = {
	rat: su,
	spider: uu,
	beetle: du,
	goblin: fu,
	wraith: pu,
	golem: hu,
	ratking: (e = {}) => su({
		fur: "#3a342e",
		belly: "#5a5048",
		furTop: "#544c44",
		eyes: "#ff3818",
		seed: 17,
		...e,
		king: !0
	}),
	spiderqueen: (e = {}) => uu({
		body: "#1e1622",
		band: "#6a4864",
		mark: "#e2d8c2",
		eyes: "#78c038",
		seed: 37,
		...e,
		queen: !0
	})
};
Object.keys(gu);
var _u = {
	armU: "upperarm",
	armL: "lowerarm",
	hand: "hand",
	fist: "hand",
	legU: "upperleg",
	legL: "lowerleg",
	foot: "foot"
}, vu = {
	root: "hips",
	spine: "spine",
	chest: "chest",
	neck: "chest",
	head: "head"
}, yu = (e) => {
	let t = /^(armU|armL|hand|fist|legU|legL|foot)(-?1)$/.exec(e);
	return t ? _u[t[1]] + (t[2] === "1" ? "l" : "r") : vu[e] || null;
};
async function bu(e, t, n) {
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
	}, l = new Xe(i);
	l.clipAction(c(t.clips.Idle)).play(), l.setTime(0), i.updateMatrixWorld(!0);
	let u = [];
	e.root.traverse((e) => {
		e.isBone && u.push(e);
	});
	let d = s.get("hips"), f = d.position.clone(), m = /* @__PURE__ */ new Map();
	for (let e of u) {
		let t = yu(e.name);
		t && e.name !== "neck" && (m.set(t, e.userData.at), t.startsWith("hand") && m.set("wrist" + t.slice(-1), e.userData.at));
	}
	i.traverse((e) => {
		if (!e.isBone) return;
		let t = e.name.replace(/\./g, ""), n = m.get(t);
		n && (e.parent.updateMatrixWorld(!0), e.position.copy(e.parent.worldToLocal(n.clone())), e.updateMatrixWorld(!0), e.userData.fit = e.position.toArray());
	}), d.userData.fitHips = {
		rest: f.toArray(),
		k: d.position.length() / Math.max(1e-6, f.length()) * (t.hips ?? 1)
	};
	let h = /* @__PURE__ */ new Map(), g = /* @__PURE__ */ new Map(), _ = new p();
	for (let e of u) {
		let t = yu(e.name);
		if (t) {
			h.set(e.name, s.get(t));
			continue;
		}
		let n = h.get(e.parent.name), r = new ve();
		r.name = e.name, n.add(r), n.updateMatrixWorld(!0), r.position.copy(n.worldToLocal(e.userData.at.clone())), n.getWorldQuaternion(_), r.quaternion.copy(_.invert()), r.updateMatrixWorld(!0), h.set(e.name, r), g.set(e.name, r.quaternion.clone());
	}
	let y = new O();
	y.add(i), y.updateMatrixWorld(!0);
	let b = [...o, ...[...g.keys()].map((e) => h.get(e))], x = new v(b);
	e.root.traverse((e) => {
		if (!e.isSkinnedMesh) return;
		let t = e.skeleton.bones.map((e) => b.indexOf(h.get(e.name))), n = e.geometry.attributes.skinIndex, r = new Uint16Array(n.count * 4);
		for (let e = 0; e < n.count; e++) for (let i = 0; i < 4; i++) r[e * 4 + i] = t[n.getComponent(e, i)];
		let i = e.geometry.clone();
		i.setAttribute("skinIndex", new be(r, 4));
		let a = new Ye(i, e.material);
		a.name = e.name, a.userData = { ...e.userData }, a.frustumCulled = !1, y.add(a), a.updateMatrixWorld(!0), a.bind(x, a.matrixWorld);
	});
	let S = Object.entries(t.clips).map(([t, n]) => {
		let r = c(n).clone(), i = e.clips.find((e) => e.name === t);
		if (r.name = t, i) for (let e of i.tracks) {
			let [t, n] = e.name.split(".");
			if (n !== "quaternion" || !g.has(t)) continue;
			let a = g.get(t), o = e.values.slice(), s = new p();
			for (let e = 0; e < o.length; e += 4) s.fromArray(o, e), s.premultiply(a).toArray(o, e);
			r.tracks.push(new ce(e.name, Array.from(e.times, (e) => e * r.duration / i.duration), o));
		}
		return r;
	});
	return {
		root: y,
		mixer: new Xe(y),
		clips: S,
		frame: null,
		creature: e.kind,
		rig: t.model
	};
}
async function xu(e, t) {
	let { root: n, clips: r } = gu[e.kind](e);
	return e.rig && t ? bu({
		root: n,
		clips: r,
		kind: e.kind
	}, e.rig, t) : {
		root: n,
		mixer: new Xe(n),
		clips: r,
		frame: null,
		creature: e.kind
	};
}
function Su(e) {
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
//#region ember3d/figure.js
var Cu = {
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
}, wu = {
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
function Tu(e) {
	e.traverse((e) => {
		if (!e.isBone) return;
		let t = e.name.replace(/\.?(l|r)$/, "");
		wu.scale[t] && e.scale.multiplyScalar(wu.scale[t]), wu.reach[t] && e.position.multiplyScalar(wu.reach[t]);
	});
}
var Eu = /Sword|Axe|Shield|Crossbow|Knife|Throwable|Spellbook|Wand|Staff|Mug/;
function Du(e, t, n) {
	if (!t.height) {
		let t = new We().setFromObject(e);
		return {
			box: t,
			ppu: n / (t.max.y - t.min.y)
		};
	}
	let r = new We(), i = (e) => {
		for (let t = e; t; t = t.parent) if (t.userData.held || t !== e && Eu.test(t.name) || Eu.test(e.name)) return !0;
		return !1;
	};
	return e.updateMatrixWorld(!0), e.traverse((e) => {
		e.isMesh && e.visible && !i(e) && r.expandByObject(e);
	}), {
		box: r,
		ppu: n * t.height / (r.max.y - r.min.y)
	};
}
var Ou = (e, t) => e.getObjectByName(t) || e.getObjectByName(t.replace(/\./g, ""));
function ku(e, t) {
	let n = /* @__PURE__ */ new Map();
	e.traverse((e) => {
		if (!e.isMesh || /Eyes/.test(e.name) || !e.material.map) return;
		let r = n.get(e.material);
		if (!r) {
			let i = e.material.map.image, a = document.createElement("canvas");
			a.width = i.width, a.height = i.height;
			let o = a.getContext("2d");
			o.filter = t, o.drawImage(i, 0, 0);
			let s = new Ee(a);
			s.flipY = e.material.map.flipY, s.colorSpace = e.material.map.colorSpace, s.magFilter = e.material.map.magFilter, s.minFilter = e.material.map.minFilter, s.wrapS = e.material.map.wrapS, s.wrapT = e.material.map.wrapT, r = e.material.clone(), r.map = s, n.set(e.material, r);
		}
		e.material = r;
	});
}
async function Au(e, t) {
	if (typeof e != "string") return e;
	let n = await t();
	if (!n[e]) throw Error(`no face preset "${e}"`);
	return n[e];
}
async function ju(e, t) {
	if (e.creature) return xu(e.creature, t.load);
	let { far: n = !1, load: r } = t, i = await r(`./models/${e.model}.glb`), a = i.scene, o = Cu[e.model] || [];
	if (a.traverse((t) => {
		t.isMesh && (t.frustumCulled = !1, o.includes(t.name) && !(e.show || []).includes(t.name) && (t.visible = !1));
	}), e.body) {
		let i = {
			...e.body,
			face: await Au(e.body.face, t.faces)
		};
		e.body.shape && (i.face = {
			...i.face,
			shape: e.body.shape
		}), await Gl(r, a, i, {
			far: n,
			findNode: Ou
		});
	} else if (e.face) {
		let { head: i, replaces: o } = await Ol(r, e.model, await Au(e.face, t.faces), { far: n });
		a.traverse((e) => {
			e.isMesh && o.includes(e.name) && (e.visible = !1);
		}), Ou(a, "head").add(i);
	}
	for (let [t, n] of Object.entries(e.attach || {})) {
		let e = await r(`./models/${n}`);
		Ou(a, t)?.add(e.scene);
	}
	for (let [t, n] of Object.entries(e.hold || {})) {
		let e = Mc[n]();
		e.position.y = .033, e.userData.held = !0, Ou(a, t)?.add(e);
	}
	for (let [t, n] of Object.entries(e.wear || {})) Ou(a, t)?.add(Mc[n]());
	for (let t of e.hide || []) a.traverse((e) => {
		e.name === t && (e.visible = !1);
	});
	return e.skull && a.traverse((e) => {
		e.isMesh && (/_Eyes$/.test(e.name) ? e.userData.part = "eye" : /_Head$/.test(e.name) ? e.userData.part = "skin" : /_Jaw$/.test(e.name) && (e.userData.part = "hair"));
	}), e.swatches && Fc(a, e.swatches), e.recolor && ku(a, e.recolor), e.eyes && a.traverse((t) => {
		t.isMesh && /Eyes/.test(t.name) && (t.material = t.material.clone(), t.material.emissive = new A(e.eyes), t.material.emissiveIntensity = 3);
	}), {
		root: a,
		mixer: new Xe(a),
		clips: i.animations,
		frame: e.frame || null
	};
}
function Mu(e, t) {
	e.traverse((e) => {
		if (!e.isBone) return;
		let n = e.name.replace(/\.?(l|r)$/, "");
		if (t.scale && t.scale[n] && e.scale.multiplyScalar(t.scale[n]), t.reach && t.reach[n] && e.position.multiplyScalar(t.reach[n]), t.bend && t.bend[n]) {
			let [r, i, a] = t.bend[n];
			e.quaternion.multiply(new p().setFromEuler(new C(r, i, a)));
		}
	});
}
function Nu(e, t, n, r) {
	e.mixer.stopAllAction();
	let i = e.clips.find((e) => e.name === t) || e.clips.find((e) => e.name === "Idle");
	e.mixer.clipAction(i).play(), e.mixer.setTime(n * i.duration), e.creature && Su(e.root), r && !e.creature && Tu(e.root), r && e.frame && Mu(e.root, e.frame), e.root.updateMatrixWorld(!0), Ru(e.root);
}
var Pu = new p(), Fu = new p(), Iu = new p().setFromAxisAngle(new j(1, 0, 0), Math.PI), Lu = new j(0, 1, 0);
function Ru(e) {
	let t = [];
	if (e.traverse((e) => {
		e.userData.hang && t.push(e);
	}), !t.length) return;
	let n = new p().setFromAxisAngle(Lu, e.rotation.y);
	for (let e of t) e.parent.getWorldQuaternion(Fu), Pu.copy(n), e.userData.hang !== "up" && Pu.multiply(Iu), e.quaternion.copy(Fu.invert().multiply(Pu));
	e.updateMatrixWorld(!0);
}
var zu = new at();
function Bu(e, t, n, r) {
	let i = e.geometry.index ? e.geometry.toNonIndexed() : e.geometry.clone();
	for (let e of Object.keys(i.attributes)) [
		"position",
		"normal",
		"uv"
	].includes(e) || i.deleteAttribute(e);
	if (i.attributes.normal || i.computeVertexNormals(), !n && i.attributes.uv && i.deleteAttribute("uv"), n && !i.attributes.uv) return null;
	if (i.applyMatrix4(t), r) {
		let t = i.attributes.position.count, n = new Float32Array(t * 3), r = e.material.color || new A(1, 1, 1);
		for (let e = 0; e < t; e++) n[e * 3] = r.r, n[e * 3 + 1] = r.g, n[e * 3 + 2] = r.b;
		i.setAttribute("color", new be(n, 3));
	}
	return i;
}
function Vu(e, t) {
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
		let r = new Ye(n, e[0].material);
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
		let i = zu.copy(e.matrixWorld).invert(), a = n.startsWith("map"), o = r.map((e) => Bu(e, new at().multiplyMatrices(i, e.matrixWorld), a, !a));
		if (o.some((e) => !e)) continue;
		let s = t(o);
		if (!s) continue;
		let c = r[0].material, u = a ? c.clone() : n === "basic" ? new it({
			vertexColors: !0,
			transparent: c.transparent,
			opacity: c.opacity
		}) : new l({
			vertexColors: !0,
			roughness: c.roughness ?? 1,
			metalness: c.metalness ?? 0
		}), d = new k(s, u);
		d.name = `${e.name}:${n.split("|")[0]}`, d.frustumCulled = !1, e.add(d);
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
var Hu = .25, Uu = /* @__PURE__ */ new Set([
	"dust",
	"fireflies",
	"sparkle"
]);
Object.assign(globalThis, { __emberGround: {
	foliage(e) {
		return this.scaled += e.length, e.map((e) => ({
			...e,
			scale: (e.scale ?? 1) * Hu
		}));
	},
	scaled: 0,
	size: Hu,
	keeps: (e) => e?.emberExhibit === !0 || !Uu.has(e?.preset),
	dust: !1
} });
//#endregion
//#region ember3d/world.js
var Wu = "", Gu = 1, Ku = 3, qu = 16 * Math.SQRT2, Ju = {
	billboard: "spherical",
	normalUp: .6,
	wrap: .6,
	roundness: .35,
	emissive: "#ffe9d2",
	emissiveIntensity: .2
}, Yu = "en", Xu = null, Zu = null, Qu = null, $u = null, q = null, ed = null, td = 0, nd = "soft", rd = 45, id = 30, ad = /* @__PURE__ */ new Map(), od = /* @__PURE__ */ new Map(), sd = (e) => {
	let t = ad.get(e);
	return t || (t = new Promise((t, n) => {
		let r = new Image();
		r.decoding = "async", r.onload = () => t(r), r.onerror = n, r.src = e;
	}), ad.set(e, t)), t;
}, cd = (e) => {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t = Math.imul(t ^ e.charCodeAt(n), 16777619);
	return (t >>> 0).toString(36);
}, ld = (e) => {
	let t = od.get(e);
	return t || (t = fetch(e, { cache: "no-cache" }).then((e) => e.ok ? e.text() : null).then((e) => {
		if (!e) return null;
		let t = JSON.parse(e);
		return Object.defineProperty(t, "_v", { value: cd(e) }), t;
	}).catch(() => null), od.set(e, t)), t;
}, ud = /* @__PURE__ */ new Map();
function dd(e) {
	return ud.has(e) ? ud.get(e) : (ud.set(e, null), ld(`${Wu}actors/${e}.json`).then((t) => t ? sd(`${Wu}actors/${e}.alb.png?v=${t._v}`).then((e) => [t, e]) : [null, null]).then(([t, n]) => {
		if (!t) {
			ud.set(e, !1);
			return;
		}
		let r = new he(n);
		r.magFilter = r.minFilter = E, r.generateMipmaps = !1, r.colorSpace = o, r.wrapS = r.wrapT = Ae, r.needsUpdate = !0, r.name = `ember-actor:${e}`, ud.set(e, {
			meta: t,
			tex: r,
			sheets: /* @__PURE__ */ new Map()
		});
	}).catch(() => ud.set(e, !1)), null);
}
function fd(e, t) {
	let n = t.toFixed(3), r = e.sheets.get(n);
	if (!r) {
		let i = e.meta;
		r = {
			texture: e.tex,
			frameWidth: i.cw,
			frameHeight: i.ch,
			columns: i.frames,
			rows: i.dirs,
			pixelsPerUnit: qu / t,
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
var pd = /* @__PURE__ */ new Map();
function md(e, t) {
	let n = pd.get(e);
	for (n || pd.set(e, n = []); n.length <= t;) {
		let t = new Ut(e, { ...Ju });
		t.visible = !1, q.engine.scene.add(t), n.push(t);
	}
	return n[t];
}
function hd(e, t, n, r, i) {
	let a = 2 * r / i / Math.SQRT2, o = q.tileMap, s = t + a, c = n + a;
	e.position.set(s, o.getHeight(t, n), c);
}
var gd = "models", _d = new j(), vd = .4, yd = null, bd = !1, xd = "", Sd = (e) => (bd || (bd = !0, ld(`${Wu}models/cast.json`).then((e) => {
	yd = e || !1, e || (xd ||= "models/cast.json unreadable");
})), yd ? yd.actors[e] || !1 : yd !== !1 && null), Cd = new Co(), wd = /* @__PURE__ */ new Map(), Td = (e) => {
	let t = `${Wu}models/${e.replace("./models/", "")}${yd && yd._v ? `?v=${yd._v}` : ""}`, n = wd.get(t);
	return n || (n = Cd.loadAsync(t), wd.set(t, n)), n.then((e) => ({
		scene: xo(e.scene),
		animations: e.animations
	}));
}, Ed = /* @__PURE__ */ new Map(), Dd = /* @__PURE__ */ new Map();
function Od(e, t) {
	let n = Dd.get(e);
	return n === void 0 ? (Dd.set(e, null), Ed.has(e) || ld(`${Wu}actors/${e}.json`).then((t) => Ed.set(e, t)), ju(t.v, {
		far: !1,
		load: Td,
		faces: async () => yd.faces
	}).then((n) => {
		let r = [];
		n.root.traverse((e) => {
			e.isBone && r.push([
				e,
				e.position.clone(),
				e.quaternion.clone(),
				e.scale.clone()
			]);
		}), Nu(n, "Idle", 0, !0);
		let { box: i, ppu: a } = Du(n.root, t.v, t.px);
		for (let [e, t, n, i] of r) e.position.copy(t), e.quaternion.copy(n), e.scale.copy(i);
		let o = Vu(n.root, on);
		Dd.set(e, {
			root: n.root,
			clips: n.clips,
			frame: n.frame,
			creature: n.creature || null,
			ppu: a,
			minY: i.min.y,
			meshes: o
		});
	}).catch((t) => {
		console.warn("[luminati] figure", e, t), xd ||= `${e}: ${t?.message || t}`, Dd.set(e, !1);
	}), null) : n;
}
var kd = /* @__PURE__ */ new Map(), Ad = 0;
function jd(e, t, n) {
	let r = kd.get(e);
	if (r && r.name !== t && (q.engine.scene.remove(r.root), kd.delete(e), r = null), r) return r;
	let i = xo(n.root), a = [];
	i.traverse((e) => {
		if (!e.isMesh) return;
		e.castShadow = !0, e.receiveShadow = !0, e.frustumCulled = !1, e.material = e.material.clone(), e.material.isMeshStandardMaterial && (e.material.metalness = 0, e.material.roughness = Math.max(e.material.roughness ?? 1, .92));
		let t = /Eyes/.test(e.name) || !!e.userData.glow || !e.material.emissive;
		t || (e.material.emissive = e.material.map ? new A(16771538) : e.material.color.clone(), e.material.map && (e.material.emissiveMap = e.material.map)), !t && e.material.vertexColors && (e.material.onBeforeCompile = (e) => {
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
		mixer: new Xe(i),
		clips: n.clips,
		frame: n.frame,
		creature: n.creature,
		bones: o,
		mats: a,
		yaw: null,
		key: "",
		fpos: 0,
		seen: 0,
		look: ""
	}, q.engine.scene.add(i), kd.set(e, r), r;
}
var Md = new A(1, .45, .15);
function Nd(e, t, n, r) {
	if (gd !== "models") return !1;
	let i = Sd(e.name);
	if (!i) return !1;
	let a = Od(e.name, i), o = Ed.get(e.name);
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
	let l = jd(t, e.name, a), u = o.clips[s], d = c.frames, f = e.col - u.start;
	if (l.key !== s) l.key = s, l.fpos = f;
	else if (c.once) l.fpos = Math.min(Math.max(l.fpos + n * u.fps, f), Math.min(f + .999, d - 1));
	else {
		let e = l.fpos + n * u.fps, t = ((e - f) % d + d) % d;
		l.fpos = t < 1 ? (e % d + d) % d : t > d / 2 ? f : f + .999;
	}
	let p = c.from ?? 0, m = c.to ?? 1, h = c.once ? p + (m - p) * (l.fpos / Math.max(1, d - 1)) : p + (m - p) * (l.fpos / d);
	for (let [e, t, n, r] of l.bones) e.position.copy(t), e.quaternion.copy(n), e.scale.copy(r);
	let g = (135 - 45 * e.row) * Math.PI / 180 + r - Math.PI / 4;
	if (l.yaw === null || l.seen < Ad - 1) l.yaw = g;
	else {
		let e = g - l.yaw;
		e -= 2 * Math.PI * Math.round(e / (2 * Math.PI)), l.yaw += e * (1 - Math.exp(-n * 16));
	}
	l.root.rotation.y = l.yaw, Nu(l, c.clip, Math.min(.999, h), !0);
	let _ = (e.cw && o.cw ? e.cw / o.cw : 1) * a.ppu / qu;
	l.root.scale.setScalar(_), l.root.position.set(e.x, q.tileMap.getHeight(e.x, e.z) - a.minY * _, e.z), l.root.updateMatrixWorld(!0);
	let v = e.flash || 0, y = v ? 0 : Math.round((e.warn || 0) * 20) / 20, b = 1 - (e.fade || 0), x = `${nf}|${v}|${y}|${b.toFixed(2)}`;
	if (l.look !== x) {
		l.look = x;
		for (let e of l.mats) {
			e.own || (y ? e.m.emissive.copy(e.base).lerp(Md, Math.min(1, y)) : e.m.emissive.copy(e.base), e.m.emissiveIntensity = nf * vd + v * 2.6 + y * .9);
			let t = b < .999;
			e.m.transparent !== t && (e.m.transparent = t, e.m.needsUpdate = !0), e.m.opacity = b;
		}
	}
	return l.root.visible = !0, l.seen = Ad, !0;
}
function Pd() {
	for (let [e, t] of kd) t.seen !== Ad && (t.root.visible && (t.root.visible = !1), Ad - t.seen > 3600 && (q.engine.scene.remove(t.root), kd.delete(e)));
}
var Fd = [], Id = "chosen", Ld = 5, Rd = 1.3, zd = /* @__PURE__ */ new Map(), Bd = /* @__PURE__ */ new Map();
for (let e of Ac) e.build && zd.set(e.id, e);
for (let e of Object.values(jc)) for (let t of e) t.build && zd.set(t.id, t);
var Vd = /* @__PURE__ */ new Set([
	"vale_keep_1",
	"ruin",
	"chapelruin_0"
]);
function Hd(e, t, n, r) {
	let i = Bd.get(e.id);
	if (i) {
		let e = i.clone();
		return e.position.set(t, n, r), e;
	}
	let a = kc(e.build, e.style, e.seed || 1, !!e.faceX);
	e.rotY && (a.rotation.y = e.rotY * Math.PI / 180), e.scale && a.scale.multiplyScalar(e.scale), a.updateMatrixWorld(!0);
	let o = q.world?.glassMaterial || null, s = /* @__PURE__ */ new Map(), c = new O(), l = e.desat ?? .3, u = Rd, d = e.tint || [
		.95,
		.92,
		1
	], f = `kitgrade:${l},${u},${d}`, p = (e) => {
		let t = e.clone();
		return t.onBeforeCompile = (e) => {
			e.uniforms.uGrade = { value: new je(l, u * d[0], u * d[1], u * d[2]) }, e.fragmentShader = "uniform vec4 uGrade;\n" + e.fragmentShader.replace("#include <color_fragment>", "#include <color_fragment>\n  { float L = dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11)); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(L), uGrade.x) * uGrade.yzw; }");
		}, t.customProgramCacheKey = () => f, t;
	};
	a.traverse((e) => {
		if (!e.isMesh || e.userData.mask || e.userData.bakeOnly) return;
		let t = e.userData.glow && o ? o : e.material, n = e.geometry.index ? e.geometry.toNonIndexed() : e.geometry.clone();
		n.applyMatrix4(e.matrixWorld), n.attributes.normal || n.computeVertexNormals(), n.attributes.uv || n.setAttribute("uv", new re(new Float32Array(n.attributes.position.count * 2), 2));
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
		let r = new k(n, e === o ? e : p(e));
		r.castShadow = r.receiveShadow = !0, c.add(r);
	}
	c.name = `ember:kit:${e.id}`, c.scale.setScalar(Ld), Bd.set(e.id, c);
	let m = c.clone();
	return m.position.set(t, n, r), m;
}
var Ud = 1.7;
function Wd(e) {
	let t = q.world.factory, r = t.builder(), i = e.span, a = e.kind === "up" ? 1.55 : 1.35, o = .42, s = .5, c = i / 2 + o / 2, l = e.stone || "stone_brick", u = [
		.05,
		.045,
		.06
	];
	for (let e of [-1, 1]) r.box(l, [
		.52,
		.22,
		.6
	], { at: [
		e * c,
		.11,
		0
	] }), r.box(l, [
		o,
		a,
		s
	], { at: [
		e * c,
		a / 2,
		0
	] }), r.box(l, [
		.54,
		.12,
		.58
	], { at: [
		e * c,
		a - .06,
		0
	] });
	for (let e = 0; e < 9; e++) {
		let t = (e + .5) / 9 * Math.PI, n = e === 4, i = Math.cos(t), o = Math.sin(t);
		r.box(l, [
			n ? .52 : .42,
			Math.PI * c / 9 * .96,
			n ? .6 : s
		], {
			at: [
				i * c,
				a + o * c,
				0
			],
			rot: [
				0,
				0,
				t
			]
		});
	}
	e.kind === "up" && r.tinted(u, () => r.box(l, [
		i,
		a + c * .92,
		.3
	], { at: [
		0,
		(a + c * .92) / 2,
		-.2
	] }));
	let d = t.finish(r, `ember:arch:${e.kind}`, e.x, e.level * .5, e.z + (e.kind === "up" ? .25 : 0), e.rot || 0), f = new A(e.glow).multiplyScalar(Ud), p = new it({
		color: f,
		fog: !1
	}), m = c - o / 2 - .02, h = new k(new n(m, .045, 5, 28, Math.PI), p);
	h.position.set(0, a, .27), d.add(h);
	for (let e of [-1, 1]) {
		let t = new k(new M(.09, a - .22, .09), p);
		t.position.set(e * m, .22 + (a - .22) / 2, .27), d.add(t);
	}
	return d.traverse((e) => {
		e.isMesh && (e.castShadow = e.material !== p, e.receiveShadow = !0);
	}), d.dispose = () => d.traverse((e) => {
		e.isMesh && e.material === p && e.geometry.dispose();
	}), d;
}
async function Gd(e, t) {
	for (let e of Fd) q.engine.scene.remove(e), e.dispose?.();
	Fd = [];
	for (let e of Bd.values()) e.traverse((e) => {
		e.isMesh && e.geometry.dispose();
	});
	if (Bd.clear(), !e?.length) return;
	let n = ["env", `town-${t || "vale"}`], r = await Promise.all(n.map((e) => ld(`${Wu}env/${e}.json`))), i = (e) => {
		for (let t = 0; t < n.length; t++) {
			let i = r[t]?.sprites?.[e];
			if (i) return [n[t], i];
		}
		return null;
	}, a = td;
	for (let s of e) {
		if (s.canvas) {
			df(s);
			continue;
		}
		if (s.arch) {
			let e = Wd(s.arch);
			q.engine.scene.add(e), Fd.push(e);
			continue;
		}
		let e = zd.get(s.id);
		if (e && (t || "vale") === "vale" && (Id === "all" || Id === "chosen" && !s.card || Id === "doors" && Vd.has(s.id))) {
			let t = (e, t) => q.tileMap.getHeight(s.x + e, s.z + t), n = Math.max(t(0, 0), t(0, 3), t(0, -3), t(3, 0), t(-3, 0)), r = Hd(e, s.x, n, s.z);
			q.engine.scene.add(r), Fd.push(r);
			continue;
		}
		let c = i(s.id);
		if (!c) continue;
		let [l, u] = c, d = await sd(`${Wu}env/${l}.alb.png?v=${r[n.indexOf(l)]._v}`).catch(() => null);
		if (!d || a !== td) return;
		let f = document.createElement("canvas");
		f.width = u.w, f.height = u.h, f.getContext("2d").drawImage(d, u.x, u.y, u.w, u.h, 0, 0, u.w, u.h);
		let p = new Ee(f);
		p.magFilter = p.minFilter = E, p.generateMipmaps = !1, p.colorSpace = o;
		let m = {
			texture: p,
			frameWidth: u.w,
			frameHeight: u.h,
			columns: 1,
			rows: 1,
			pixelsPerUnit: qu,
			anchor: [u.ax / u.w, 0],
			animations: { idle_down: {
				frames: [{
					col: 0,
					row: 0
				}],
				fps: 1,
				loop: !1
			} },
			name: `ember-env:${s.id}`,
			dispose() {
				p.dispose();
			}
		}, h = new Ut(m, {
			...Ju,
			castShadow: !1,
			blobShadow: !1
		});
		h.name = `ember:${l}:${s.id}`, hd(h, s.x, s.z, u.h - u.ay, qu), q.engine.scene.add(h), Fd.push(h), h.update(0, q.engine.camera);
	}
}
var Kd = (e, t) => {
	let n = new A(e), r = n.r * .299 + n.g * .587 + n.b * .114;
	return n.r += (r - n.r) * t, n.g += (r - n.g) * t, n.b += (r - n.b) * t, "#" + n.getHexString();
}, qd = (e, t) => {
	let n = new A(e);
	return n.multiplyScalar(t), "#" + n.getHexString();
}, Jd = Pt.map((e) => {
	let t = e.night ?? 0;
	return {
		...e,
		top: qd(Kd(e.top, .3), .8),
		horizon: qd(Kd(e.horizon, .3), .6),
		bottom: qd(Kd(e.bottom, .3), .75),
		sun: Kd(e.sun, .3),
		hemiSky: Kd(e.hemiSky, .45),
		hemiGround: Kd(e.hemiGround, .3),
		sunI: e.sunI * .72,
		hemiI: e.hemiI * (.86 - .08 * t) * (e.t >= 18 && e.t <= 20.5 ? 1.4 : 1),
		exp: e.exp * .97,
		fog: e.fog * (.5 + .3 * t)
	};
}), Yd = {
	saturation: .92,
	exposure: .9,
	contrast: 1.06,
	vignette: .78
}, Xd = !1;
function Zd() {
	let e = q?.postfx?.settings?.grade, t = q?.lighting?.state?.night ?? 1;
	Xd && e && (e.saturation = .74 + .18 * t, e.exposure = (.84 + .06 * t) * Qd * $d);
}
var Qd = 1, $d = 1, ef = 1.6, tf = 1, nf = Ju.emissiveIntensity, rf = 0, af = (e) => .2126 * e.r + .7152 * e.g + .0722 * e.b;
function of() {
	let e = q?.lighting, t = e?.hemi, n = e?.sun;
	return rf = (t ? af(t.color) * t.intensity : 0) + (n ? af(n.color) * n.intensity * .5 : 0), Math.round(Math.min(tf, Math.max(Ju.emissiveIntensity, ef - rf)) * 100) / 100;
}
var sf = null, cf = "default";
function lf(e, t) {
	let n = q?.lighting;
	if (!n) return;
	let r = e.environment || {}, i = q.postfx?.settings?.grade;
	if (i && (sf ||= { ...i }, Object.assign(i, sf, t === "vale" ? Yd : {})), Xd = t === "vale" && !r.interior, r.interior || r.climate || r.season) return;
	let a = t === "vale" ? "dusky" : "default";
	n.setKeyframes(a === "dusky" ? Jd : Pt), cf = a;
}
var uf = /* @__PURE__ */ new Map();
function df(e) {
	let t = uf.get(e.canvas);
	if (!t) {
		let n = new Ee(e.canvas);
		n.magFilter = n.minFilter = E, n.generateMipmaps = !1, n.colorSpace = o, t = {
			texture: n,
			frameWidth: e.canvas.width,
			frameHeight: e.canvas.height,
			columns: 1,
			rows: 1,
			pixelsPerUnit: qu,
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
		}, uf.set(e.canvas, t);
	}
	let n = new Ut(t, {
		...Ju,
		emissiveIntensity: .3,
		castShadow: !1,
		blobShadow: !e.flat
	});
	n.name = `ember:prop:${e.id}`, hd(n, e.x, e.z, e.canvas.height - e.ay, qu), e.flat && n.traverse((e) => {
		e.renderOrder = -1, e.material && (e.material.depthWrite = !1);
	}), q.engine.scene.add(n), Fd.push(n), n.update(0, q.engine.camera);
}
var ff = /* @__PURE__ */ new Map(), pf = "vale";
function mf(e) {
	if (ff.has(e)) return ff.get(e);
	ff.set(e, null);
	let t = ["env", `town-${pf}`];
	return Promise.all(t.map((e) => ld(`${Wu}env/${e}.json`))).then(async (n) => {
		for (let r = 0; r < t.length; r++) {
			let i = n[r]?.sprites?.[e];
			if (!i) continue;
			let a = await sd(`${Wu}env/${t[r]}.alb.png?v=${n[r]._v}`), s = document.createElement("canvas");
			s.width = i.w, s.height = i.h, s.getContext("2d").drawImage(a, i.x, i.y, i.w, i.h, 0, 0, i.w, i.h);
			let c = new Ee(s);
			c.magFilter = c.minFilter = E, c.generateMipmaps = !1, c.colorSpace = o, ff.set(e, {
				texture: c,
				frameWidth: i.w,
				frameHeight: i.h,
				columns: 1,
				rows: 1,
				pixelsPerUnit: qu,
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
		ff.set(e, !1);
	}).catch(() => ff.set(e, !1)), null;
}
var hf = /* @__PURE__ */ new WeakMap();
function gf(e) {
	let t = hf.get(e.canvas);
	if (!t) {
		let n = new Ee(e.canvas);
		n.magFilter = n.minFilter = E, n.generateMipmaps = !1, n.colorSpace = o, t = {
			texture: n,
			frameWidth: e.canvas.width,
			frameHeight: e.canvas.height,
			columns: 1,
			rows: 1,
			pixelsPerUnit: qu,
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
		}, hf.set(e.canvas, t);
	}
	return t;
}
function _f(e, t) {
	let n = pd.get(e);
	for (n || pd.set(e, n = []); n.length <= t;) {
		let t = new Ut(e, {
			...Ju,
			castShadow: !1,
			blobShadow: !1
		});
		t.visible = !1, q.engine.scene.add(t), n.push(t);
	}
	return n[t];
}
var vf = {
	mesh: null,
	id: "",
	cap: 0
};
function yf(e) {
	if (!e || !e.cells.length) {
		vf.mesh && (vf.mesh.visible = !1), vf.id = "";
		return;
	}
	if (e.id === vf.id && vf.mesh) {
		vf.mesh.visible = !0;
		return;
	}
	let t = e.cells.length / 3;
	if (!vf.mesh || vf.cap < t) {
		vf.mesh && (q.engine.scene.remove(vf.mesh), vf.mesh.geometry.dispose(), vf.mesh.material.dispose());
		let e = new b(.5, .5);
		e.rotateX(-Math.PI / 2);
		let n = new it({
			transparent: !0,
			opacity: .72,
			depthWrite: !1,
			polygonOffset: !0,
			polygonOffsetFactor: -2,
			polygonOffsetUnits: -2,
			toneMapped: !1
		});
		vf.cap = Math.max(256, Math.ceil(t * 1.5)), vf.mesh = new de(e, n, vf.cap), vf.mesh.renderOrder = 2, vf.mesh.frustumCulled = !1, q.engine.scene.add(vf.mesh);
	}
	let n = new at(), r = new A().setRGB(16 / 255, 54 / 255, 64 / 255, o), i = new A().setRGB(40 / 255, 92 / 255, 104 / 255, o);
	for (let a = 0; a < t; a++) {
		let t = e.cells[a * 3], o = e.cells[a * 3 + 1];
		n.makeTranslation(t, q.tileMap.getHeight(t, o) + .035, o), vf.mesh.setMatrixAt(a, n), vf.mesh.setColorAt(a, e.cells[a * 3 + 2] ? i : r);
	}
	vf.mesh.count = t, vf.mesh.instanceMatrix.needsUpdate = !0, vf.mesh.instanceColor && (vf.mesh.instanceColor.needsUpdate = !0), vf.mesh.visible = !0, vf.id = e.id;
}
var bf = [];
function xf(e, t) {
	let n = bf[e];
	return n && n.sheet !== t && (q.engine.scene.remove(n), n.dispose?.(), n = null), n || (n = new Ut(t, { ...Ju }), q.engine.scene.add(n), bf[e] = n), n.material.emissiveIntensity !== nf && (n.material.emissiveIntensity = nf), n;
}
var Sf = "uniform vec4 uRect; uniform vec2 uView; varying vec2 vUv;\nvoid main() { vUv = position.xy; vec2 p = uRect.xy + position.xy * uRect.zw; gl_Position = vec4(p.x / uView.x * 2.0 - 1.0, 1.0 - p.y / uView.y * 2.0, 0.0, 1.0); }", Cf = "uniform sampler2D tEmi, tDepth; uniform vec2 uTexel, uBuf; uniform mat4 uInvVP; uniform vec4 uKey; uniform float uFloor; varying vec2 vUv;\nvoid main() {\n  vec4 e = texture2D(tEmi, vUv); vec3 c = e.rgb * 2.4, g = vec3(0.0); float own = e.a;\n  for (int i = 0; i < 8; i++) { float a = float(i) * 0.785398; vec2 d = vec2(cos(a), sin(a)) * uTexel;\n    vec4 n = texture2D(tEmi, vUv + d * 2.0), f = texture2D(tEmi, vUv + d * 4.5); g += n.rgb + f.rgb * 0.6; own = max(own, max(n.a, f.a)); }\n  float k = 1.0;\n  if (uKey.w > 0.5 && own > 0.002) {\n    vec2 suv = gl_FragCoord.xy / uBuf; float z = texture2D(tDepth, suv).x;\n    if (z < 1.0) {\n      vec4 w = uInvVP * vec4(suv * 2.0 - 1.0, z * 2.0 - 1.0, 1.0); w.xyz /= w.w;\n      float scene = 2.0 * (w.x + w.z) + uKey.z, eff = uKey.x + own * 255.0 * uKey.y;\n      if (w.y > uFloor && scene > eff + 1.5) k = 0.22;\n    }\n  }\n  gl_FragColor = vec4((c + g * 0.12) * k, 1.0);\n}", J = {
	scene: null,
	cam: null,
	mat: null,
	tex: null,
	on: !1,
	keyed: !1
};
function wf() {
	if (!J.on || !q) return;
	let e = q.engine.renderer, t = e.autoClear, n = J.mat.uniforms, r = q.engine.camera;
	n.tDepth.value = q.postfx?.depthTexture || null, n.uKey.value.w = J.keyed && n.tDepth.value ? 1 : 0, e.getDrawingBufferSize(n.uBuf.value), n.uInvVP.value.multiplyMatrices(r.matrixWorld, r.projectionMatrixInverse), e.autoClear = !1, e.setRenderTarget(null), e.render(J.scene, J.cam), e.autoClear = t;
}
function Tf(e) {
	if (!e || !e.emi) {
		J.on = !1;
		return;
	}
	let t = new Uint32Array(e.emi.buffer, e.emi.byteOffset, e.emi.byteLength >> 2), n = !1;
	for (let e = 0; e < t.length; e++) if (t[e] & 16777215) {
		n = !0;
		break;
	}
	if (J.on = n, n) {
		if (!J.scene) {
			J.scene = new f(), J.cam = new Se(), J.mat = new se({
				vertexShader: Sf,
				fragmentShader: Cf,
				transparent: !0,
				depthTest: !1,
				depthWrite: !1,
				blending: 2,
				uniforms: {
					tEmi: { value: null },
					uTexel: { value: new qe() },
					uRect: { value: new je() },
					uView: { value: new qe() },
					tDepth: { value: null },
					uBuf: { value: new qe(1, 1) },
					uInvVP: { value: new at() },
					uKey: { value: new je() },
					uFloor: { value: 1.2 }
				}
			});
			let e = new Le();
			e.setAttribute("position", new re([
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
			let t = new k(e, J.mat);
			t.frustumCulled = !1, J.scene.add(t), q.engine.events.on("afterRender", wf);
		}
		(!J.tex || J.tex.image.width !== e.w || J.tex.image.height !== e.h || J.tex.image.data !== e.emi) && (J.tex?.dispose(), J.tex = new ae(e.emi, e.w, e.h, pe), J.tex.flipY = !1, J.tex.magFilter = J.tex.minFilter = Re, J.tex.generateMipmaps = !1, J.mat.uniforms.tEmi.value = J.tex, J.mat.uniforms.uTexel.value.set(1 / e.w, 1 / e.h)), J.tex.needsUpdate = !0, J.mat.uniforms.uRect.value.set(e.x, e.y, e.w * e.px, e.h * e.px), J.mat.uniforms.uView.value.set(innerWidth, innerHeight), J.keyed = !!e.key, e.key && J.mat.uniforms.uKey.value.set(e.key.base, e.key.step, e.key.origin, 1);
	}
}
var Ef = {
	x: 0,
	y: 1,
	z: 0,
	ppu: 22,
	ready: !1
};
function Df() {
	let e = q.rig, t = q.engine.camera, n = innerHeight / (2 * Ef.ppu * Math.tan(Gu / 2 * Math.PI / 180));
	e.target = null, e.bounds = null, e.lift = 0, e.minDistance = 1, e.maxDistance = 1e6, e.minPitch = 0, e.maxPitch = Math.PI / 2, e.freeYaw = !0, e.yaw = e.yawTarget = rd * Math.PI / 180, e.pitch = e.pitchTarget = id * Math.PI / 180, e.distance = e.distanceTarget = n, e.focusPoint.set(Ef.x, Ef.y, Ef.z), (Math.abs(t.fov - Gu) > 1e-6 || Math.abs(t.far - (n + 600)) > 1) && (t.fov = Gu, t.near = Math.max(1, n - 300), t.far = n + 600, t.updateProjectionMatrix()), e._apply(0), Ra(n - 7);
	let r = q.postfx?.settings?.dof;
	r && (r.autoFocus = !1, r.focusDistance = n);
}
async function Of(e) {
	await Zu, Object.assign(globalThis, {
		__emberUiRoot: $u,
		__emberInputTarget: new EventTarget(),
		__emberSilent: !0,
		__emberPixelRatio: Ku
	}), q = new bo({
		container: Qu,
		level: e,
		source: "emberfall",
		autostart: !0,
		lang: Yu,
		fonts: Xu,
		look: "diorama"
	}), await q.init(() => {}), q.audio && (q.audio.muted = !0), q._updatePlayCamera = () => {}, q._updateCameraBounds = () => {}, q.start(), await q.warmedUp, q.engine.stop(), q.engine.events.on("lateUpdate", () => {
		q && Df();
	}), q.engine.events.on("update", Zd), q.engine.events.on("update", () => {
		let e = $f, t = q?.lighting;
		e && t?.hemi && (t.hemi.color.setRGB(e.sky[0], e.sky[1], e.sky[2]), t.hemi.groundColor.setRGB(e.ground[0], e.ground[1], e.ground[2]), t.hemi.intensity = e.i, t.sun && (t.sun.intensity *= e.sun));
	}), q.lighting && (q.lighting._shadowExtent = Math.max(q.lighting._shadowExtent || 22, 34));
}
function kf() {
	let e = q.player;
	e && (e.sprite && (e.sprite.visible = !1), e.visible = !1);
}
var Af = new u(.46, .6, 40), jf = new ze(1, 40), Mf = new u(.8, 1, 40), Nf = (() => {
	let e = [];
	for (let t = 0; t < 4; t++) e.push(new u(.7, .8, 10, 1, t * Math.PI / 2 + .25, Math.PI / 2 - .5));
	return Pf(e);
})();
function Pf(e) {
	let t = [], n = [], r = 0;
	for (let i of e) {
		let e = i.getAttribute("position"), a = i.getIndex();
		for (let n = 0; n < e.count; n++) t.push(e.getX(n), e.getY(n), e.getZ(n));
		for (let e = 0; e < a.count; e++) n.push(a.getX(e) + r);
		r += e.count, i.dispose();
	}
	let i = new Le();
	return i.setAttribute("position", new re(t, 3)), i.setIndex(n), i;
}
var Ff = new u(.88, 1, 40), If = new b(1, 1).translate(.5, 0, 0), Lf = () => new it({
	transparent: !0,
	depthWrite: !1,
	polygonOffset: !0,
	polygonOffsetFactor: -2,
	polygonOffsetUnits: -2,
	toneMapped: !1
}), Rf = {
	ring: [],
	disc: [],
	rim: [],
	focus: [],
	wfill: [],
	wrim: [],
	lane: []
}, zf = {
	ring: Af,
	disc: jf,
	rim: Mf,
	focus: Nf,
	wfill: jf,
	wrim: Ff,
	lane: If
};
function Bf(e, t) {
	let n = Rf[e];
	for (; n.length <= t;) {
		let t = new k(zf[e], Lf());
		t.rotation.x = -Math.PI / 2, t.renderOrder = 2, t.visible = !1, q.engine.scene.add(t), n.push(t);
	}
	return n[t];
}
function Vf(e, t, n, r, i, a) {
	e.visible = a > .01, e.visible && (e.position.set(t, q.tileMap.getHeight(t, n) + .03, n), e.scale.setScalar(r), e.material.color.setRGB(i[0] / 255, i[1] / 255, i[2] / 255, o), e.material.opacity = a);
}
function Hf(e, t, n, r, i, a, s, c, l) {
	let u = r - t, d = i - n, f = Math.hypot(u, d) * a;
	e.visible = l > .01 && f > .02, e.visible && (e.position.set(t, Math.max(q.tileMap.getHeight(t, n), q.tileMap.getHeight(r, i)) + .05, n), e.rotation.z = Math.atan2(-d, u), e.scale.set(f, s, 1), e.material.color.setRGB(c[0] / 255, c[1] / 255, c[2] / 255, o), e.material.opacity = l);
}
var Uf = [
	255,
	86,
	30
], Wf = [
	255,
	238,
	220
], Gf = [
	24,
	6,
	4
], Kf = new i(), qf = 6, Jf = 1.6, Yf = null, Xf = null, Zf = -1, Qf = 0, $f = null, ep = !1, Y = {
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
}, tp = {
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
}, np = [
	.45,
	.75,
	1.4
], rp = [
	1.6,
	.85,
	.25
], ip = [
	1.6,
	.8,
	.3
], X = (e) => e <= 0 ? 0 : e >= 1 ? 1 : e * e * (3 - 2 * e), ap = (e) => e < 0 ? 0 : e > 1 ? 1 : e, op = (e) => e <= 0 ? 0 : e < .55 ? 1.15 * (1 - (1 - e / .55) ** 3) : e < 1 ? 1.15 - .15 * X((e - .55) / .45) : 1, sp = null, cp = null, lp = /* @__PURE__ */ new Map(), up = {}, dp = new j();
function fp() {
	if (sp || !q?.engine) return sp;
	let e = q.engine.scene, t = new Zr({ capacity: 48 }), n = new Qr({
		capacity: 4,
		heightField: {
			sample: (e, t) => q.tileMap.getHeight(e, t),
			surface: (e, t) => q.tileMap._surface(e, t),
			minX: 0,
			minZ: 0,
			get maxX() {
				return q.tileMap.width;
			},
			get maxZ() {
				return q.tileMap.depth;
			}
		}
	}), r = new Ft({
		atlas: jt(),
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
	}), sp = {
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
	}, sp;
}
function Z(e, t) {
	for (let e in up) delete up[e];
	Object.assign(up, t), sp.quads.set(e, up);
}
function pp(e) {
	for (let t of e.blades || []) sp.blades.free(t);
	for (let t of e.rocks || []) sp.rocks.free(t);
	for (let t of e.bells || []) sp.bells.free(t);
	e.dome && sp.domeOf === e && (sp.dome.hide(), sp.domeOf = null);
	for (let t of e.crystals) sp.crystals.free(t);
	for (let t of e.quads) sp.quads.free(t);
	e.gf >= 0 && sp.frost.free(e.gf);
}
function mp(e, t, n, r) {
	if (!sp && !r && !e.length) return;
	let i = fp();
	if (!i) return;
	i.warmN > 0 && --i.warmN === 0 && (i.crystals.unwarm(), i.frost.unwarm(), i.dome.unwarm(), i.blades.unwarm(), i.rocks.unwarm(), i.bells.unwarm(), i.quads.free(i.warmQuad));
	let a = /* @__PURE__ */ new Set(), o = (e, t) => q.tileMap.getHeight(e, t);
	q.engine.camera.getWorldDirection(dp);
	let s = Math.hypot(dp.x, dp.z) || 1, c = -dp.x / s, l = -dp.z / s, u = null;
	for (let n of e) {
		a.add(n.key);
		let e = lp.get(n.key);
		e || (e = {
			crystals: [],
			quads: [],
			gf: -1,
			landed: !1,
			seed: (n.seed >>> 0) % 8192
		}, lp.set(n.key, e));
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
					rise: op(e) * (1 - o),
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
			if (Z(e.glyph, {
				frame: "partyGlyphHoly",
				x: n.x,
				y: s,
				z: n.z,
				mode: "flat",
				scale: 2 * n.r / 8 * (.35 + .65 * t),
				rot: n.age * .9,
				r: Y.glyph[0],
				g: Y.glyph[1],
				b: Y.glyph[2],
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
				Z(e.ring, {
					frame: "partyRing",
					index: r < .16 ? 0 : 1,
					x: n.x,
					y: s + .02,
					z: n.z,
					mode: "flat",
					scale: 2.2 * n.r / 6 * (.15 + .85 * t),
					r: Y.ring[0],
					g: Y.ring[1],
					b: Y.ring[2],
					a: .9 * (1 - X((r - .2) / .3))
				}), Z(e.over, {
					frame: "partySunburst",
					index: Math.min(3, Math.floor(r / .08)),
					x: n.x + c * .3,
					y: s + 1.5,
					z: n.z + l * .3,
					mode: "billboard",
					scale: 1.5,
					r: Y.burst[0],
					g: Y.burst[1],
					b: Y.burst[2],
					a: 1 - X((r - .15) / .2),
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
						r: Y.body[0],
						g: Y.body[1],
						b: Y.body[2],
						a: .9 * Math.max(0, Math.min(1, (.32 - e) / .14))
					}), Z(t.core, {
						frame: "partyPillar",
						index: 0,
						x: t.x + c * .17,
						y: n + a,
						z: t.z + l * .17,
						mode: "billboard",
						scale: i,
						r: Y.core[0],
						g: Y.core[1],
						b: Y.core[2],
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
						r: Y.burst[0],
						g: Y.burst[1],
						b: Y.burst[2],
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
				let o = ap((r - i * .05) / .3), s = Math.sin(o * Math.PI) * .6;
				Z(e, {
					frame: "partyHolyOrb",
					index: Math.floor(r * 12) % 2,
					x: n.x + (n.tx - n.x) * o + c * .2,
					y: t + (a - t) * o + s,
					z: n.z + (n.tz - n.z) * o + l * .2,
					mode: "billboard",
					scale: 1.2,
					r: tp.core[0],
					g: tp.core[1],
					b: tp.core[2],
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
				r: tp.body[0],
				g: tp.body[1],
				b: tp.body[2],
				a: s > 0 ? .85 * ap((.45 - s) / .18) : 0
			}), Z(e.core, {
				frame: "partyPillar",
				index: 0,
				x: n.tx + c * .32,
				y: d + p,
				z: n.tz + l * .32,
				mode: "billboard",
				scale: f,
				r: tp.core[0],
				g: tp.core[1],
				b: tp.core[2],
				a: s > 0 ? ap((.28 - s) / .1) : 0,
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
				r: tp.core[0],
				g: tp.core[1],
				b: tp.core[2],
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
			Z(e.glyph, {
				frame: "partyGlyphHoly",
				x: n.x,
				y: o(n.x, n.z) + .04,
				z: n.z,
				mode: "flat",
				scale: .32 + .14 * X(r / .3),
				rot: r * .8,
				r: Y.glyph[0],
				g: Y.glyph[1],
				b: Y.glyph[2],
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
					r: Y.burst[0],
					g: Y.burst[1],
					b: Y.burst[2],
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
			let i = n.reached[t], a = ap(r / .35);
			Z(e, {
				frame: "partyRing",
				index: a < .5 ? 0 : 1,
				x: i.x,
				y: o(i.x, i.z) + .05,
				z: i.z,
				mode: "flat",
				scale: .25 + .2 * a,
				r: rp[0],
				g: rp[1],
				b: rp[2],
				a: 1 - a
			});
		});
		else if (n.id === "aura_wall") {
			if ((!i.domeOf || !lp.has(i.domeOf.key)) && (i.dome.show({
				x: n.x,
				y: o(n.x, n.z),
				z: n.z,
				radius: 1.15
			}), i.domeOf = e, e.key = n.key, e.dome = !0, e.t = 0), i.domeOf === e) {
				e.t += t, i.dome.object.position.set(n.x, o(n.x, n.z), n.z), i.dome.object.updateMatrix(), i.dome.object.updateMatrixWorld(!0);
				let r = e.t * .6 % 1;
				i.dome.set({
					rise: X(e.t / .35),
					dissolve: 1 - ap(n.k / .8),
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
			r: np[0],
			g: np[1],
			b: np[2],
			a: .9 * X(e.t / .25),
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
			r: ip[0],
			g: ip[1],
			b: ip[2],
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
				Z(i, {
					frame: "wallFlame",
					index: Math.floor(r * 10 + o) % 4,
					x: n.tx + Math.cos(s) * c,
					y: a + .55 * (.8 + .3 * t),
					z: n.tz + Math.sin(s) * c,
					mode: "billboard",
					scale: .9 + .3 * t,
					r: ip[0],
					g: ip[1],
					b: ip[2],
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
		} else if (Dp[n.id]) {
			let a = Dp[n.id](n, e, r, i, o, c, l, t);
			a && (!u || a.k > u.k) && (u = a);
		}
	}
	for (let [e, t] of lp) a.has(e) || (pp(t), lp.delete(e));
	cp && (u && u.k > .02 ? cp.set(u.x, o(u.x, u.z) + 1.4, u.z, {
		color: u.color,
		intensity: 2.6 * u.k / (n ?? 1),
		distance: 6.5,
		decay: 1.5,
		flicker: .08
	}) : cp.off()), i.domeOf && !lp.has(i.domeOf.key) && (i.dome.hide(), i.domeOf = null), i.crystals.update(t), i.frost.update(t), i.blades.update(t), i.rocks.update(t), i.bells.update(t), i.quads.update();
}
var hp = [
	1.6,
	1.3,
	.85
], gp = [
	2,
	1.85,
	1.45
], _p = [
	1.7,
	.22,
	.32
], vp = [
	.45,
	1.5,
	.6
], yp = [
	.75,
	.72,
	.8
], bp = [
	.55,
	.75,
	1.7
], xp = [
	.55,
	.95,
	1.9
], Sp = [
	.35,
	1.45,
	1.25
], Cp = [
	.75,
	1.55,
	.3
], wp = [
	1.15,
	.45,
	1.65
], Tp = [
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
			let n = sp.quads.alloc();
			n >= 0 && (e[t].push(n), e.quads.push(n));
		}
	}
	return e[t];
}
var Ep = (e, t) => {
	let n = Math.hypot(e, t) || 1;
	return {
		dirX: t / n,
		dirZ: -e / n
	};
}, Dp = {
	vault(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c, l, u, ...d] = $(t, "q", 9), f = i(e.tx, e.tz), p = ap((n - .12) / .18);
		return Z(s, {
			frame: "heroSigil",
			x: e.tx,
			y: f + .04,
			z: e.tz,
			mode: "flat",
			scale: .12 + .1 * X(n / .3),
			rot: n * 1.5,
			...Q(hp, .8),
			a: .9 * (1 - X((n - .5) / .4))
		}), Z(c, {
			frame: "heroSword",
			index: n < .3 ? 0 : 1,
			x: e.tx + a * .25,
			y: f + 2.4 + 3.2 * (1 - p),
			z: e.tz + o * .25,
			mode: "billboard",
			scale: .4,
			...Q(gp),
			a: n < .12 ? 0 : 1 - X((n - .45) / .25),
			halo: 1
		}), Z(l, {
			frame: "heroCrack",
			x: e.tx,
			y: f + .05,
			z: e.tz,
			mode: "flat",
			scale: .55 * X((n - .3) / .12),
			...Q(hp, .9),
			a: n > .3 ? 1 - X((n - .6) / .35) : 0
		}), Z(u, {
			frame: "impact",
			index: Math.min(3, Math.floor((n - .3) * 14)),
			x: e.tx + a * .3,
			y: f + .7,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 3.2,
			...Q(gp),
			a: +(n > .3 && n < .6),
			halo: 1
		}), d.forEach((r, i) => {
			let a = i * 1.2566 + t.seed % 5 * .2, o = n - .3, s = .3 + .6 * X(o / .4);
			Z(r, {
				frame: "dust",
				index: Math.min(2, Math.floor(o * 8)),
				x: e.tx + Math.cos(a) * s,
				y: f + .2 + .2 * o,
				z: e.tz + Math.sin(a) * s,
				mode: "billboard",
				scale: 2,
				...Q(Tp),
				a: o > 0 ? 1 - X(o / .5) : 0
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
		let [s, c, l] = $(t, "q", 3), u = e.tx - e.fx, d = e.tz - e.fz, f = Math.hypot(u, d) || 1, p = u / f, m = d / f, h = 3 * X(n / .35), g = 1 - X((n - .45) / .35), _ = e.fx + p * h, v = e.fz + m * h, y = i(_, v), b = Ep(u, d);
		return Z(s, {
			frame: "heroWaveLit",
			index: Math.floor(n * 24) % 4,
			x: _,
			y: y + .1,
			z: v,
			mode: "flat",
			...b,
			scale: .75,
			...Q(gp),
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
			...Q(hp),
			a: .8 * g
		}), Z(l, {
			frame: "heroFangCrestLit",
			index: Math.floor(n * 20) % 4,
			x: _ + a * .2,
			y: y + .55,
			z: v + o * .2,
			mode: "billboard",
			scale: .85,
			...Q(gp),
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
			rise: op((n - e.start) / .14) * (1 - X((n - 1) / .35)),
			crack: X((n - .65) / .3)
		});
		return Z(c, {
			frame: "partyCrack",
			x: e.x,
			y: s + .05,
			z: e.z,
			mode: "flat",
			scale: .35 * X(n / .15),
			rot: t.seed % 7 * .4,
			...Q(Tp, 1.1),
			a: 1 - X((n - 1) / .35)
		}), Z(l, {
			frame: "partyRing",
			index: n < .15 ? 0 : 1,
			x: e.x,
			y: s + .07,
			z: e.z,
			mode: "flat",
			scale: .2 + .4 * X(n / .3),
			...Q(hp, .9),
			a: 1 - X((n - .1) / .3)
		}), u.forEach((t, r) => {
			let i = r * 1.047 + .3, a = n - .12, o = .6 + .8 * X(a / .5);
			Z(t, {
				frame: "dust",
				index: Math.min(2, Math.floor(a * 6)),
				x: e.x + Math.cos(i) * o,
				y: s + .25 + .3 * a,
				z: e.z + Math.sin(i) * o,
				mode: "billboard",
				scale: 2.4,
				...Q(Tp),
				a: a > 0 ? 1 - X(a / .7) : 0
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
		let [s] = $(t, "q", 1), c = i(e.x, e.z) + .6, l = X(n / .25), u = X((n - 4.6) / .45), d = .8;
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
			...Q(hp, .75),
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
			...Q(_p, 1.2),
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
		let s = $(t, "q", 5), c = $(t, "h", Math.min(4, e.reached.length)), l = Math.atan2(e.tz - e.z, e.tx - e.x), u = 3 * X(n / .28), d = i(e.x, e.z) + .6;
		return s.forEach((t, r) => {
			let i = l + (r - 2) * .26, a = Math.cos(i), o = Math.sin(i);
			Z(t, {
				frame: "heroBlade",
				index: Math.floor(n * 20) % 2,
				x: e.x + a * (.3 + u),
				y: d,
				z: e.z + o * (.3 + u),
				mode: "flat",
				...Ep(a, o),
				scale: .6,
				...Q(vp, 1.2),
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
				...Q(vp, 1.3),
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
			}, o = r * 1.57 + .4, s = a.t, c = .15 + .35 * X(s / .5);
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
				a: s > 0 ? 1 - X(s / .6) : 0
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
			...Q(_p, 1.3),
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
			...Q(_p, 1.4),
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
		let s = $(t, "q", 14), [c] = $(t, "r", 1), l = 1 - X((n - 5.4) / .6), u = Math.max(.6, e.r);
		return s.forEach((r, a) => {
			let o = (a * 137.5 + t.seed) % 360 * Math.PI / 180, s = u * .85 * Math.sqrt((a * 61 + t.seed) % 97 / 97), c = e.tx + Math.cos(o) * s, d = e.tz + Math.sin(o) * s, f = ap((n - a * .015) / .25), p = .6 + .4 * Math.sin(n * 6 + a * 1.7);
			Z(r, {
				frame: "partyIceShard",
				index: a % 4,
				x: c,
				y: i(c, d) + .06 + .8 * (1 - f) * Math.sin(f * Math.PI),
				z: d,
				mode: "billboard",
				scale: .55,
				...Q(yp, .8 + .6 * p),
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
			...Q(_p, .5),
			a: .7 * X(n / .3) * l
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
			scale: .1 + .12 * X(n / .7),
			rot: n * 2.2,
			...Q(ip, .9),
			a: n < .7 ? .8 + .2 * Math.sin(n * 30) : 1 - X(p / .3)
		}), Z(c, {
			frame: "pillar",
			index: Math.floor(Math.max(0, p) * 12) % 4,
			x: e.tx + a * .2,
			y: f + 1.6,
			z: e.tz + o * .2,
			mode: "billboard",
			scale: 1.4,
			...Q(ip, 1.1),
			a: p > 0 ? 1 - X((p - .25) / .3) : 0,
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
			a: p > 0 ? ap((.25 - p) / .1) : 0,
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
				...Q(ip),
				a: p > 0 ? 1 - X((p - .25) / .35) : 0,
				halo: 1
			});
		}), {
			x: e.tx,
			z: e.tz,
			k: p > 0 ? 3.2 * Math.exp(-p / .25) : .4 * X(n / .7),
			color: [
				1.9,
				.95,
				.35
			]
		};
	},
	gather(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s, c] = $(t, "q", 2), l = $(t, "p", Math.min(5, e.reached.length)), u = i(e.tx, e.tz), d = 1 - X((n - .5) / .35);
		return Z(s, {
			frame: "partySwirl",
			index: Math.floor(n * 8) % 2,
			x: e.tx,
			y: u + .08,
			z: e.tz,
			mode: "flat",
			scale: e.r * 2 / 5 * (1 - .6 * X(n / .5)),
			rot: n * 7,
			...Q(bp, 1.1),
			a: d
		}), Z(c, {
			frame: "partySwirl",
			index: (Math.floor(n * 8) + 1) % 2,
			x: e.tx,
			y: u + .5,
			z: e.tz,
			mode: "flat",
			scale: e.r * 2 / 7 * (1 - .6 * X(n / .5)),
			rot: -n * 9,
			...Q(bp, 1.4),
			a: .8 * d,
			halo: 1
		}), l.forEach((t, r) => {
			let a = e.reached[r], o = X(n / .4), s = a.x + (e.tx - a.x) * .5 * o, c = a.z + (e.tz - a.z) * .5 * o;
			Z(t, {
				frame: "heroGaleLit",
				index: Math.floor(n * 20) % 4,
				x: s,
				y: i(s, c) + .4,
				z: c,
				mode: "flat",
				...Ep(e.tx - a.x, e.tz - a.z),
				scale: .45,
				...Q(bp, 1.3),
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
			spread: .1 * X(e.age / .38),
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
		let s = $(t, "s", Math.min(5, e.reached.length)), c = X((n - 2.4) / .3);
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
			rise: op(n / .13) * (1 - c),
			crack: X((n - 2.1) / .3),
			glint: X(n / .4),
			glow: 1.1
		})), t.gf >= 0 && r.frost.set(t.gf, {
			spread: .1 + .9 * X(n / .3),
			cracks: X((n - .1) / .5),
			fade: X((n - 2.3) / .6),
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
				scale: 1.15 - .1 * X(n / .1),
				...Q(xp, .85),
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
		let [s, c, l] = $(t, "q", 3), u = $(t, "f", 18), d = i(e.tx, e.tz), f = X(n / .4) * (1 - X((n - 5.4) / .6)), p = Math.max(.6, e.r);
		return Z(l, {
			frame: "partyFrostFloor",
			x: e.tx,
			y: d + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 4,
			rot: .3,
			...Q(xp, .55),
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
			...Q(xp, .9),
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
			...Q(xp, 1.1),
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
				...Q(xp, 1.3),
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
		let [s] = $(t, "q", 1), c = $(t, "m", 8), l = $(t, "r", Math.min(3, e.reached.length)), u = i(e.tx, e.tz), d = X(n / .3) * (1 - X((n - 3.5) / .5)), f = Math.max(.6, e.r);
		return Z(s, {
			frame: "partyGlyphHoly",
			x: e.tx,
			y: u + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * f / 8,
			rot: n * .6,
			...Q(tp.core, .8),
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
				...Q(tp.core),
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
				...Q(tp.core, .9),
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
		let [s, c] = $(t, "q", 2), l = $(t, "s", 5), u = i(e.tx, e.tz), d = X(n / .4) * (1 - X((n - 7.4) / .6)), f = Math.max(.6, e.r);
		return Z(s, {
			frame: "partyGlyphHoly",
			x: e.tx,
			y: u + .04,
			z: e.tz,
			mode: "flat",
			scale: 2 * f / 8,
			rot: -n * .3,
			...Q(Y.glyph, 1),
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
			...Q(Y.ring, 1.1),
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
				...Q(Y.body, .7),
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
			...Q(Y.body),
			a: .95 * ap((1 - n) / .4)
		}), Z(c, {
			frame: "partyPillar",
			index: 0,
			x: e.tx + a * .22,
			y: f + m,
			z: e.tz + o * .22,
			mode: "billboard",
			scale: p,
			...Q(Y.core),
			a: ap((.5 - n) / .2),
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
			...Q(Y.burst),
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
			...Q(Y.burst),
			a: n > .3 ? 1 - X((n - .45) / .25) : 0,
			halo: 1
		}), d.forEach((t, r) => {
			let i = ap((n - r * .08) / 1.1), a = r * 1.047;
			Z(t, {
				frame: "partyHolyOrb",
				index: r % 2,
				x: e.tx + Math.cos(a) * .3,
				y: f + .2 + 1.8 * i,
				z: e.tz + Math.sin(a) * .3,
				mode: "billboard",
				scale: .9,
				...Q(Y.core),
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
			scale: 2 * p / 8 * (.4 + .6 * X(n / .4)),
			rot: n * 1.2,
			...Q(Y.glyph),
			a: .9 * (1 - X((n - 1.2) / .4)),
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
				...Q(Y.body),
				a: c > 0 ? ap((.35 - c) / .12) : 0,
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
			...Q(Y.body, 1.2),
			a: m > 0 ? ap((.45 - m) / .15) : 0
		}), Z(l, {
			frame: "partyPillar",
			index: 0,
			x: e.tx + a * .27,
			y: f + g,
			z: e.tz + o * .27,
			mode: "billboard",
			scale: h,
			...Q(Y.core, 1.2),
			a: m > 0 ? ap((.3 - m) / .1) : 0,
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
			...Q(Y.burst),
			a: m > 0 ? Math.max(0, 1 - m / .45) : 0,
			halo: 1
		}), {
			x: e.tx,
			z: e.tz,
			k: m > 0 ? 3.4 * Math.exp(-m / .2) : .8 * X(n / .3),
			color: [
				1.9,
				1.4,
				.5
			]
		};
	},
	binding_roots(e, t, n, r, i, a, o) {
		if (n == null) return null;
		let [s] = $(t, "q", 1), c = $(t, "t", Math.min(15, e.reached.length * 3)), l = i(e.tx, e.tz), u = 1 - X((n - 2.1) / .4);
		return Z(s, {
			frame: "partyRing",
			index: n < .15 ? 0 : 1,
			x: e.tx,
			y: l + .05,
			z: e.tz,
			mode: "flat",
			scale: 2 * Math.max(.6, e.r) / 6 * (.4 + .6 * X(n / .25)),
			...Q(Cp, .9),
			a: 1 - X((n - .3) / .4)
		}), c.forEach((t, r) => {
			let s = e.reached[Math.floor(r / 3)], c = r % 3 * 2.094 + .5, l = s.x + Math.cos(c) * .22, d = s.z + Math.sin(c) * .22;
			Z(t, {
				frame: "partyIceSpike",
				index: Math.min(2, Math.floor(n * 10)),
				x: l + a * .05,
				y: i(l, d) + .35 * X(n / .18),
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
			...Q(d >= 3 ? wp : Sp, 1.1 + .2 * d),
			a: 1 - X((n - .45) / .3),
			halo: 1
		}), Z(c, {
			frame: "crit",
			index: Math.min(3, Math.floor(n * 12)),
			x: e.tx + a * .32,
			y: u + .85,
			z: e.tz + o * .32,
			mode: "billboard",
			scale: 2.6,
			...Q(wp, 1.3),
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
			...Q(wp, 1.2),
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
		let s = i(e.tx, e.tz), c = X(n / .4), l = X((n - 7.4) / .6), u = n % 1.5 / 1.5, [d, f] = $(t, "q", 2);
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
			...Q(Sp, .8),
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
			...Q(Sp, 1.2),
			a: c * (1 - l) * (1 - X(u / .8))
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
		let [s, c, l] = $(t, "q", 3), u = $(t, "g", Math.min(5, e.reached.length)), d = i(e.tx, e.tz), f = X(n / .3), p = Math.max(.6, e.r);
		return Z(s, {
			frame: "partyRing",
			index: n < .12 ? 0 : 1,
			x: e.tx,
			y: d + .06,
			z: e.tz,
			mode: "flat",
			scale: 2 * p / 6 * (.15 + .95 * f),
			...Q(Sp, 1.4),
			a: 1 - X((n - .25) / .3),
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
			a: .7 * (1 - X((n - .15) / .25))
		}), Z(l, {
			frame: "partySunburst",
			index: Math.min(3, Math.floor(n / .07)),
			x: e.tx + a * .3,
			y: d + .8,
			z: e.tz + o * .3,
			mode: "billboard",
			scale: 1.5,
			...Q(Sp, 1.3),
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
				...Ep(a.x - e.tx, a.z - e.tz),
				scale: .55,
				...Q(Sp, 1.2),
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
			...Q(xp, .85),
			a: X(t.t / .1),
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
}, Op = {
	ready: !1,
	async load(e, t = [], n = "vale") {
		let r = ++td;
		n !== pf && (pf = n, ff.clear());
		let i = Hn(e).level;
		return ed = (async () => {
			q ? await q.swapLevel(i, { spawn: i.spawn }) : await Of(i), r === td && (kf(), ep = !!i.environment?.interior, Op.settings({ dof: nd }), lf(i, n), await Gd(t, n));
		})(), await ed, r === td;
	},
	settings(e = {}) {
		e.dof && (nd = e.dof), e.bright > 0 && (Qd = e.bright), e.figLit > 0 && (ef = e.figLit), e.carryUp > 0 && (qf = e.carryUp), e.carryGain > 0 && (Jf = e.carryGain), e.figMax > 0 && (tf = e.figMax), (e.figures === "models" || e.figures === "sprites") && (gd = e.figures), [
			"chosen",
			"doors",
			"all",
			"sprites"
		].includes(e.landmarks) && (Id = e.landmarks);
		let t = q?.postfx?.settings;
		t?.dof && Object.assign(t.dof, {
			enabled: nd !== "off" && !ep,
			focusRange: 16,
			tiltShift: .14,
			tiltWidth: .62
		});
	},
	frame(e) {
		if (!q || !q.engine) return;
		$d = e.bright > 0 ? e.bright : 1, Ef.x = e.focus[0], Ef.y = e.focus[1], Ef.z = e.focus[2], Ef.ppu = e.ppu, Number.isFinite(e.hour) && Math.abs((q.lighting?.timeOfDay ?? -1) - e.hour) > .004 && q.setTime(e.hour), e.weather && q.weather?.weather !== e.weather && q.setWeather(e.weather), q.lighting?.settings && (q.lighting.settings.fogMul = 1 + .6 * (e.fog || 0), q.lighting.settings.pointLightMul = e.ambient?.lamps ?? 1), e.hero && q.player && (kf(), q.player.position.set(e.hero[0], q.tileMap.getHeight(e.hero[0], e.hero[1]), e.hero[1])), nf = of();
		let t = /* @__PURE__ */ new Map(), n = q.engine.camera, r = /* @__PURE__ */ new Map();
		Ad++, n.getWorldDirection(_d);
		let i = Math.atan2(-_d.x, -_d.z);
		for (let a of e.actors) {
			let o = r.get(a.name) || 0;
			if (r.set(a.name, o + 1), Nd(a, a.key ?? `${a.name}#${o}`, Math.max(0, Math.min(.1, e.dt || 0)), i)) continue;
			let s = dd(a.name);
			if (!s) continue;
			let c = a.cw ? a.cw / s.meta.cw : 1, l = fd(s, c), u = t.get(l) || 0;
			t.set(l, u + 1);
			let d = md(l, u);
			d.visible = !0, d.material.emissiveIntensity !== nf && (d.material.emissiveIntensity = nf), (d._col !== a.col || d._row !== a.row) && d.setFrame(a.col, a.row), hd(d, a.x, a.z, (s.meta.ch - s.meta.ay) * c, l.pixelsPerUnit * c);
			let f = a.flash || 0, p = f ? 0 : Math.round((a.warn || 0) * 20) / 20;
			if (d._emberFlash !== f || d._emberWarn !== p) {
				d._emberFlash = f, d._emberWarn = p;
				let e = 1 + f * 2.6;
				d.tint = p ? new A(1 + .9 * p, 1 + .12 * p, 1 - .35 * p) : new A(e, e * .96, e * .9);
			}
			let m = 1 - (a.fade || 0);
			Math.abs(d.opacity - m) > .01 && (d.opacity = m), d.update(0, n);
		}
		for (let r of e.bits || []) {
			let e = gf(r), i = t.get(e) || 0;
			t.set(e, i + 1);
			let a = _f(e, i), o = r.glow ? 1.6 : .3;
			a.visible = !0, a.material.emissiveIntensity !== o && (a.material.emissiveIntensity = o), hd(a, r.x, r.z, r.canvas.height - r.ay - r.lift, qu);
			let s = r.flash || 0;
			if (a._emberFlash !== s) {
				a._emberFlash = s;
				let e = 1 + s * 2.6;
				a.tint = new A(e, e * .96, e * .9);
			}
			a.update(0, n);
		}
		for (let [e, n] of pd) {
			let r = t.get(e) || 0;
			for (let e = r; e < n.length; e++) n[e].visible && (n[e].visible = !1);
		}
		Pd();
		let a = {
			ring: 0,
			disc: 0,
			rim: 0,
			focus: 0,
			wfill: 0,
			wrim: 0,
			lane: 0
		};
		for (let t of e.rings || []) Vf(Bf("ring", a.ring++), t.x, t.z, 1, t.col, t.a);
		if (e.mark) {
			let t = Bf("focus", a.focus++);
			Vf(t, e.mark.x, e.mark.z, 1, [
				255,
				226,
				150
			], .7 + .2 * Math.sin(Qf * 4)), t.rotation.z = Qf, Qf += (e.dt || 0) * .9;
		}
		for (let t of e.hazards || []) Vf(Bf("disc", a.disc++), t.x, t.z, t.r, t.col, .82 * t.a), Vf(Bf("rim", a.rim++), t.x, t.z, t.r, t.rim, .42 * t.a);
		for (let t of e.warns || []) {
			let e = t.heavy ? 1 : .62, n = t.hit > 0 ? t.hit : 1, r = 1 - (1 - t.p) * (1 - t.p);
			t.lane ? (Hf(Bf("lane", a.lane++), t.x, t.z, t.tx, t.tz, 1, t.w * 1.25, Gf, .3 * e * n), Hf(Bf("lane", a.lane++), t.x, t.z, t.tx, t.tz, 1, t.w, Uf, .16 * e * n), Hf(Bf("lane", a.lane++), t.x, t.z, t.tx, t.tz, t.p, t.w * .7, t.hit > 0 ? Wf : Uf, (.22 + .28 * t.p) * e * n), Vf(Bf("wrim", a.wrim++), t.tx, t.tz, t.heavy ? .42 : .3, t.hit > 0 ? Wf : Uf, (.35 + .4 * t.p) * e * n)) : (Vf(Bf("wrim", a.wrim++), t.tx, t.tz, t.r * 1.1, Gf, .5 * n), Vf(Bf("wfill", a.wfill++), t.tx, t.tz, t.r * r, t.hit > 0 ? Wf : Uf, (.26 + .3 * t.p) * n), Vf(Bf("wrim", a.wrim++), t.tx, t.tz, t.r, t.hit > 0 ? Wf : Uf, (.7 + .3 * t.p) * n));
		}
		yf(e.water);
		for (let e of Object.keys(Rf)) for (let t = a[e]; t < Rf[e].length; t++) Rf[e][t].visible = !1;
		if (Zf !== td) {
			Zf = td, Xf = q.world?.acquireSpellLight?.({ minor: !1 }) ?? null, Yf = q.world?.acquireSpellLight?.({ minor: !1 }) ?? null, cp = q.world?.acquireSpellLight?.({ minor: !1 }) ?? null;
			for (let e of lp.values()) sp && pp(e);
			lp.clear();
		}
		if (Xf && e.hero) {
			let t = Math.max(0, Math.min(1, e.carry ?? 0)), n = e.hero[0] + .35, r = e.hero[1] + .35, i = gd === "models" ? qf : 2.4, a = gd === "models" ? Jf : 1;
			Xf.set(n, q.tileMap.getHeight(e.hero[0], e.hero[1]) + i, r, {
				color: [
					1.9,
					1.15,
					.42
				],
				intensity: 4.5 * a * t / (e.ambient?.lamps ?? 1),
				distance: gd === "models" ? Math.hypot(6.2, i) : 6 + (i - 2.4),
				decay: 1.4,
				flicker: .12
			});
		}
		if (Yf) {
			let t = e.blast;
			t && t.k > .01 ? Yf.set(t.x, q.tileMap.getHeight(t.x, t.z) + 1.6, t.z, {
				color: [
					2,
					.95,
					.32
				],
				intensity: 9 * t.k / (e.ambient?.lamps ?? 1),
				distance: 7,
				decay: 1.6,
				flicker: .25
			}) : Yf.off();
		}
		mp(e.spells || [], e.dt || 0, e.ambient?.lamps, !!(e.rings && e.rings.length));
		let o = 0;
		for (let t of e.beasts || []) {
			let e = mf(t.id);
			if (!e) continue;
			let r = xf(o++, e);
			r.visible = !0, hd(r, t.x, t.z, e.below, qu), r.update(0, n);
		}
		for (let e = o; e < bf.length; e++) bf[e]?.visible && (bf[e].visible = !1);
		$f = e.ambient || null;
		for (let e of Fd) e.update?.(0, n);
		Tf(e.light), q.engine.step(Math.max(0, Math.min(.1, e.dt)), { render: e.draw !== !1 });
	},
	sprites(e) {
		q && Gd(e, pf);
	},
	project(e, t, n) {
		if (!q) return null;
		let r = new j(e, t, n).project(q.engine.camera);
		return [(r.x + 1) / 2 * innerWidth, (1 - r.y) / 2 * innerHeight];
	},
	occluded(e) {
		if (!q) return e.map(() => null);
		let t = q.engine.camera, n = /* @__PURE__ */ new Set(), r = [];
		for (let e of kd.values()) n.add(e.root);
		for (let e of pd.values()) for (let t of e) n.add(t);
		for (let e of bf) e && n.add(e);
		for (let e of Object.keys(Rf)) for (let t of Rf[e]) n.add(t);
		let i = (e) => {
			if (n.has(e) || !e.visible || e.parent && e.parent.shadowProxy === e) return;
			let t = e.material, a = Array.isArray(t) ? t[0] : t;
			(e.isMesh || e.isInstancedMesh) && !e.isPoints && a && a.colorWrite !== !1 && a.depthWrite !== !1 && !(a.transparent && a.opacity < .5) && r.push(e);
			for (let t of e.children) i(t);
		};
		i(q.engine.scene);
		let a = Kf, o = new j(), s = new j(), c = new j();
		return a.camera = t, e.map(([e, n, i]) => {
			o.set(e, n, i), t.isOrthographicCamera ? (t.getWorldDirection(c).multiplyScalar(-1), a.far = 400) : (t.getWorldPosition(s), c.copy(s).sub(o), a.far = c.length(), c.normalize()), a.set(o.clone().addScaledVector(c, .05), c);
			for (let e of a.intersectObjects(r, !1)) if (!(e.object.name === "Sprite3D.mesh" && e.uv && (e.uv.x < .15 || e.uv.x > .85 || e.uv.y > .92))) return e.object.name || e.object.parent?.name || e.object.type;
			return null;
		});
	},
	ground(e, t) {
		return q?.tileMap ? q.tileMap.getHeight(e, t) : null;
	},
	get stats() {
		let e = (e) => Rf[e].filter((e) => e.visible).length;
		return {
			bits: [...pd.entries()].filter(([e]) => e.name === "ember-bit").reduce((e, [, t]) => e + t.filter((e) => e.visible).length, 0),
			water: vf.mesh && vf.mesh.visible ? vf.mesh.count : 0,
			fig: nf,
			lit: Math.round(rf * 100) / 100,
			beasts: bf.filter((e) => e?.visible).length,
			light: +!!J.on,
			lightDepth: J.on && J.keyed && q?.postfx?.depthTexture ? 1 : 0,
			rings: e("ring"),
			hazards: e("disc"),
			warns: e("wrim"),
			lanes: e("lane"),
			spells: lp.size,
			dome: sp && sp.domeOf ? 1 : 0,
			blades: sp ? sp.blades.count - (sp.warmN > 0 ? 2 : 0) : 0,
			crystals: sp ? sp.crystals.count - +(sp.warmN > 0) : 0,
			frost: sp ? sp.frost.count - +(sp.warmN > 0) : 0,
			spellLight: cp && sp ? 1 : 0,
			focus: e("focus"),
			carry: +!!Xf,
			level: td,
			actors: [...pd.values()].reduce((e, t) => e + t.filter((e) => e.visible).length, 0) + [...kd.values()].filter((e) => e.root.visible).length,
			models: [...kd.values()].filter((e) => e.root.visible).length,
			modelNames: [...new Set([...kd.values()].filter((e) => e.root.visible).map((e) => e.name))],
			figErr: xd,
			figFailed: [...Dd.values()].filter((e) => e === !1).length,
			pr: q?.engine?.pixelRatio ?? null,
			dpr: devicePixelRatio || 1,
			modelMeshes: [...Dd.values()].filter(Boolean).map((e) => e.meshes.after).reduce((e, t) => e + t, 0),
			modelMeshesBefore: [...Dd.values()].filter(Boolean).map((e) => e.meshes.before).reduce((e, t) => e + t, 0),
			figures: gd,
			atlases: ud.size,
			env: Fd.length,
			sky: cf,
			ours: Fd.filter((e) => e.name.startsWith("ember:prop:")).length,
			programs: q?.engine?.renderer?.info?.programs?.length ?? null
		};
	}
};
function kp(e) {
	if (Qu) throw Error("createWorld: one world a page");
	return Qu = e.container, $u = e.uiRoot, Wu = e.assets, Yu = In("en"), Lt(), Xu = Nn({
		lang: Yu,
		px: Pn({
			w: innerWidth,
			h: innerHeight,
			dpr: devicePixelRatio || 1
		}).px
	}), Zu = Jr(Yu, {}), Op.ready = !0, Op;
}
//#endregion
export { kp as createWorld };
