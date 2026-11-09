import { Bt as e, Ft as t, H as n, J as r, Kn as i, Vn as a, _t as o, dr as s, g as c, o as l, q as u, tr as d, vt as f } from "./three.core-D9_Fol79.js";
import { G as p, H as m, R as h, f as g, t as _, z as v } from "./SmallProps-E2A3GsnG.js";
import { i as y } from "./Palette-D7TB3xJk.js";
import { a as b, f as x, u as S } from "./math-Du_SWpiD.js";
import { n as C, r as w } from "./ThawField-D3Wx0alo.js";
import { n as T } from "./own-rp3p7qEo.js";
//#region src/engine/world/props/Crags.js
var E = (e = .5, t = .62) => (n, r) => t + (1 - t) * x(-.05, e, r), D = (e, t, n, r) => b(Number.isFinite(e) ? e : t, n, r), O = [
	"spire",
	"mesa",
	"arch",
	"pillar",
	"boulders",
	"hoodoo"
];
function k(e, t, n, r, i, a) {
	let o = r.length, s = e.mat(t.side), c = e.mat(t.top), l = e.units(s), u = e.units(c);
	for (let t = 0; t < n.length; t++) {
		let d = n[t], f = n[t + 1], p = d.taper ?? 1, m = r.map((e) => e * (1 + (a() - .5) * .08)), h = (e, t) => m.map((n, r) => {
			let i = r / o * Math.PI * 2;
			return [
				d.cx + Math.cos(i) * d.rx * n * t,
				e,
				d.cz + Math.sin(i) * d.rz * n * t
			];
		}), g = h(d.y0, 1), _ = h(d.y1, p), v = f && f.rx > d.rx * p * 1.02, y = d.dark ?? 1, b = 0;
		for (let t = 0; t < o; t++) {
			let n = (t + 1) % o, r = g[t], c = g[n], u = _[n], f = _[t], p = Math.hypot(c[0] - r[0], c[2] - r[2]), m = (.9 + .14 * a()) * y, h = m * (v ? .72 : 1);
			e.quad(s, [
				r,
				f,
				u,
				c
			], [
				[b / l[0], (i + d.y0) / l[1]],
				[b / l[0], (i + d.y1) / l[1]],
				[(b + p) / l[0], (i + d.y1) / l[1]],
				[(b + p) / l[0], (i + d.y0) / l[1]]
			], { colors: [
				[
					m,
					m,
					m
				],
				[
					h,
					h,
					h
				],
				[
					h,
					h,
					h
				],
				[
					m,
					m,
					m
				]
			] }), b += p;
		}
		if (d.cap !== !1) {
			let t = [
				d.cx,
				d.y1,
				d.cz
			], n = (e) => [e[0] / u[0], -e[2] / u[1]], r = 1.06 * y;
			for (let i = 0; i < o; i++) {
				let a = (i + 1) % o;
				e.tri(c, t, _[a], _[i], n(t), n(_[a]), n(_[i]), {
					normal: [
						0,
						1,
						0
					],
					color: [
						r,
						r,
						r
					]
				});
			}
		}
		if (d.under) {
			let t = [
				d.cx,
				d.y0,
				d.cz
			], n = (e) => [e[0] / u[0], e[2] / u[1]];
			for (let r = 0; r < o; r++) {
				let i = (r + 1) % o;
				e.tri(c, t, g[r], g[i], n(t), n(g[r]), n(g[i]), {
					normal: [
						0,
						-1,
						0
					],
					color: [
						.55,
						.55,
						.55
					]
				});
			}
		}
	}
}
function A(e, t, n) {
	let r = Array.from({ length: t }, () => 1 + e.range(-n, n));
	return r.map((e, n) => (r[(n + t - 1) % t] + e * 2 + r[(n + 1) % t]) / 4);
}
function j(e, t, n) {
	let r = t.slice();
	for (let t = 0; t < n; t++) r[e.int(0, r.length - 1)] *= e.range(.62, .75);
	return r;
}
function M(e, t, { thin: n = .45, unit: r = 1 } = {}) {
	let i = [0], a = 0;
	for (; a < t - .01;) {
		let o = e.chance(n) ? .5 * r : r;
		a = Math.min(t, a + o), t - a < .3 && (a = t), i.push(a);
	}
	return i;
}
function N(e, t, n, r, i = {}) {
	let a = O.includes(i.kind) ? i.kind : "spire", o = i.stone === "ice", c = o ? I(e) : _[T(_, i.stone) ? i.stone : "sandstone"], l = D(i.height, 6, 1, 24), u = D(i.width, 2.5, .8, 14), d = e.rng("crag", t, r, i.seed), f = () => d.next(), p = e.builder(E(b(l * .25, .5, 2.2), .66)), m = [];
	switch (a) {
		case "mesa": {
			let e = A(d, b(Math.round(8 + u * .9), 9, 18), .16), t = d.range(.72, 1), r = u / 2, i = M(d, l, o ? {
				thin: .35,
				unit: 2
			} : { thin: .35 }), a = [{
				y0: -.2,
				y1: Math.min(.5, l * .2),
				cx: 0,
				cz: 0,
				rx: r * 1.12,
				rz: r * 1.12 * t,
				taper: .93
			}];
			for (let e = 0; e < i.length - 1; e++) {
				if (i[e + 1] <= a[0].y1) continue;
				let n = d.chance(.4), o = r * (n ? 1.02 : d.range(.9, .97)) * (1 - .06 * (i[e] / l));
				a.push({
					y0: Math.max(i[e], a[0].y1),
					y1: i[e + 1],
					cx: 0,
					cz: 0,
					rx: o,
					rz: o * t,
					taper: n ? 1 : .97
				});
			}
			if (l > 3 && u > 4 && d.chance(.45)) {
				let e = r * d.range(.32, .45), n = d.range(-.25, .25) * r, i = d.range(-.25, .25) * r * t, o = b(l * d.range(.25, .4), 1, 4), s = l;
				for (let r of M(d, o)) r > 0 && (a.push({
					y0: s,
					y1: l + r,
					cx: n,
					cz: i,
					rx: e * (1 - r / o * .1),
					rz: e * t * (1 - r / o * .1),
					taper: .97
				}), s = l + r);
			}
			k(p, c, a, e, n, f);
			let s = r * t, h = r - s, _ = h > .25 ? Math.max(2, Math.ceil(h / Math.max(.5, s * .8)) + 1) : 1;
			for (let e = 0; e < _; e++) m.push([
				_ === 1 ? 0 : -h + 2 * h * e / (_ - 1),
				0,
				s * 1.1
			]);
			let v = d.int(2, 4);
			for (let e = 0; e < v; e++) {
				let e = d.range(0, Math.PI * 2), n = d.range(.28, .5) * Math.min(1.6, u / 4);
				g(p, Math.cos(e) * r * 1.12, 0, Math.sin(e) * r * 1.12 * t, [
					n,
					n * .7,
					n * .9
				], d, {
					top: c.top,
					side: c.side,
					detail: 0,
					yaw: e
				});
			}
			break;
		}
		case "arch":
			P(p, c, u, l, n, d, m);
			break;
		case "boulders": {
			let e = d.int(4, 6), t = u / 2;
			for (let n = 0; n < e; n++) {
				let r = n === 0, i = n / e * Math.PI * 2 + d.range(-.4, .4), a = r ? d.range(0, .15) * t : t * d.range(.45, .7), o = (r ? .5 : d.range(.24, .36)) * u * .6, s = Math.min(r ? l * .95 : l * d.range(.35, .6), o * 2.4), f = Math.cos(i) * a, h = Math.sin(i) * a;
				g(p, f, r ? 0 : d.range(0, .15), h, [
					o,
					s / 1.22,
					o * d.range(.8, 1)
				], d, {
					top: c.top,
					side: c.side,
					detail: 1,
					yaw: d.range(0, 6.28),
					flatTop: d.range(.1, .3),
					rough: .25
				}), m.push([
					f,
					h,
					o * .92
				]);
			}
			for (let e = 0; e < 4; e++) {
				let e = d.range(0, Math.PI * 2), n = d.range(.12, .22) * Math.min(2, u / 2.5);
				g(p, Math.cos(e) * t * 1.05, 0, Math.sin(e) * t * 1.05, [
					n,
					n * .7,
					n * .9
				], d, {
					top: c.top,
					side: c.side,
					detail: 0
				});
			}
			break;
		}
		case "hoodoo": {
			let e = j(d, A(d, 9, .2), 1), t = b(l * .16, .5, 1.6), r = l - t, i = M(d, r, { thin: .75 }), a = [], o = u * .27, s = d.range(2.2, 3.4), h = d.range(0, 6.28), g = 0, _ = 0;
			for (let e = 0; e < i.length - 1; e++) {
				let t = i[e] / r, n = 1 + .16 * Math.sin(t * Math.PI * s + h), c = 1 + .45 * (1 - t) ** 4, l = o * S(1.05, .62, t) * n * c;
				a.push({
					y0: e === 0 ? -.2 : i[e],
					y1: i[e + 1],
					cx: g,
					cz: _,
					rx: l,
					rz: l * d.range(.88, 1),
					taper: .95
				}), g += d.range(-.05, .05) * o, _ += d.range(-.05, .05) * o;
			}
			let v = u * d.range(.4, .5), y = A(d, 9, .24), x = g + d.range(-.1, .1) * v, C = _ + d.range(-.1, .1) * v;
			k(p, c, a, e, n, f), k(p, c, [{
				y0: r,
				y1: r + t * .55,
				cx: x,
				cz: C,
				rx: v,
				rz: v * d.range(.82, 1),
				taper: 1.02,
				under: !0,
				dark: .78
			}, {
				y0: r + t * .55,
				y1: l,
				cx: x + d.range(-.08, .08),
				cz: C,
				rx: v * .92,
				rz: v * .8,
				taper: .8,
				dark: .82
			}], y, n, f), m.push([
				0,
				0,
				o * 1.25
			]);
			break;
		}
		case "pillar": {
			let e = c.side === "basalt_cliff", t = A(d, e ? 6 : 10, e ? .04 : .12), r = M(d, l, o ? {
				thin: .4,
				unit: 2
			} : { thin: .4 }), i = u * .42, a = r.slice(0, -1).map((e, t) => {
				let n = d.chance(.35), a = i * (n ? 1.04 : d.range(.92, .98)) * (1 - e / l * .08);
				return {
					y0: e,
					y1: r[t + 1],
					cx: 0,
					cz: 0,
					rx: a,
					rz: a,
					taper: n ? 1 : .97
				};
			});
			a[0].y0 = -.2, k(p, c, a, t, n, f), m.push([
				0,
				0,
				i * 1
			]);
			break;
		}
		default: {
			let e = j(d, A(d, o ? b(Math.round(5 + u * .5), 6, 8) : b(Math.round(7 + u), 8, 12), o ? .3 : .24), d.int(1, 2)), t = M(d, l, o ? {
				thin: .15,
				unit: 2.4
			} : { thin: .55 }), r = u / 2, i = [d.range(-.05, .05), d.range(-.05, .05)], a = d.range(1.5, 2.6), s = d.range(0, 6.28), h = [], _ = 0, v = 0, y = d.int(1, 3);
			for (let e = 0; e < t.length - 1; e++) {
				let n = t[e] / l, c = e === y;
				c && (y += d.int(2, 4));
				let u = r * (1 - (o ? .8 : .74) * n) ** (o ? 1.1 : .85) * (1 + .1 * Math.sin(n * Math.PI * a + s)) * (c ? o ? 1.04 : 1.1 : d.range(.9, .97));
				h.push({
					y0: e === 0 ? -.2 : t[e],
					y1: t[e + 1],
					cx: _,
					cz: v,
					rx: u,
					rz: u * d.range(.86, 1),
					taper: c ? .97 : o ? .84 : .92
				}), _ += (i[0] + d.range(-.04, .04)) * Math.min(1, t[e + 1] - t[e]) * r, v += (i[1] + d.range(-.04, .04)) * Math.min(1, t[e + 1] - t[e]) * r;
			}
			let x = h[h.length - 1], S = o ? b(l * .22, .8, 3.2) : b(l * .1, .4, 1.2);
			h.push({
				y0: l,
				y1: l + S,
				cx: x.cx + d.range(-.15, .15) * r,
				cz: x.cz + d.range(-.15, .15) * r,
				rx: x.rx * (o ? .9 : .62),
				rz: x.rz * (o ? .8 : .5),
				taper: o ? .08 : .5
			}), k(p, c, h, e, n, f);
			let C = d.range(0, 6.28), w = x.rx * .3;
			g(p, x.cx + Math.cos(C) * x.rx * .6, l - .05, x.cz + Math.sin(C) * x.rx * .6, [
				w,
				w * .8,
				w * .9
			], d, {
				top: c.top,
				side: c.side,
				detail: 0,
				sink: .1
			}), m.push([
				0,
				0,
				r * .95
			]);
		}
	}
	o && a !== "arch" && L(p, c, d, u * .55, 4);
	let h = e.finish(p, `crag:${a}`, t, n, r, Number.isFinite(i.rotation) ? i.rotation : d.range(0, Math.PI * 2)), v = m.map(([t, n, r]) => {
		let i = e.world(h, new s(t, 0, n));
		return {
			type: "circle",
			x: i.x,
			z: i.z,
			r
		};
	});
	return e.result(h, { colliders: v });
}
function P(e, t, n, r, i, a, o) {
	let s = e.mat(t.side), c = e.mat(t.top), l = e.units(s), u = e.units(c), d = n / 2, f = b(n * .19, .5, 2.6), p = d - f, m = r * a.range(.32, .42), h = r * a.range(.66, .74), _ = [];
	for (let e = 0; e <= 18; e++) {
		let t = -d + e / 18 * n, i = Math.abs(t) / d, o = Math.abs(t) < p, s = o ? m + (h - m) * Math.sqrt(Math.max(0, 1 - (t / p) ** 2)) : 0, c = r * (1 - .1 * i * i) + a.range(-.1, .1), l = o ? 0 : x(p, d, Math.abs(t)) ** .5, u = (o ? S(f * .95, f * 1.35, Math.abs(t) / p) : f * (1.4 + .25 * l)) * a.range(.92, 1.08), g = a.range(-.06, .06);
		_.push({
			x: t,
			bottom: s,
			top: c,
			zf: g + u / 2,
			zb: g - u / 2,
			ch: Math.min(.32, u * .22, (c - s) * .2)
		});
	}
	let v = (e) => {
		let { zf: t, zb: n, top: r, bottom: i, ch: a } = e;
		return [
			[t, i + a],
			[t, r - a],
			[t - a, r],
			[n + a, r],
			[n, r - a],
			[n, i + a],
			[n + a, i],
			[t - a, i]
		];
	}, y = [
		"f",
		"c",
		"t",
		"c",
		"k",
		"c",
		"u",
		"c"
	], C = [
		.98,
		1.02,
		1.06,
		.96,
		.9,
		.72,
		.6,
		.72
	], w = (e) => (i + e) / l[1];
	for (let t = 0; t < 18; t++) {
		let n = _[t], r = _[t + 1], i = v(n), o = v(r), d = .92 + .12 * a.next();
		for (let t = 0; t < 8; t++) {
			let a = y[t];
			if (a === "u" && n.bottom < .01 && r.bottom < .01) continue;
			let f = (t + 1) % 8, p = [
				n.x,
				i[t][1],
				i[t][0]
			], m = [
				[
					n.x,
					i[f][1],
					i[f][0]
				],
				p,
				[
					r.x,
					o[t][1],
					o[t][0]
				],
				[
					r.x,
					o[f][1],
					o[f][0]
				]
			], h = d * C[t], g = [
				h,
				h,
				h
			];
			if (a === "t") e.quad(c, m, m.map((e) => [e[0] / u[0], -e[2] / u[1]]), { color: g });
			else if (a === "u") e.quad(s, m, m.map((e) => [e[0] / l[0], e[2] / l[1]]), { color: g });
			else {
				let n = a === "k" || a === "c" && t >= 3 && t <= 5 ? -1 : 1;
				e.quad(s, m, m.map((e) => [n * e[0] / l[0], w(e[1])]), { color: g });
			}
		}
	}
	for (let t of [-1, 1]) {
		let n = _[t < 0 ? 0 : 18], r = v(n), i = [
			n.x,
			(n.top + n.bottom) / 2,
			(n.zf + n.zb) / 2
		];
		for (let a = 0; a < 8; a++) {
			let o = [
				n.x,
				r[a][1],
				r[a][0]
			], c = [
				n.x,
				r[(a + 1) % 8][1],
				r[(a + 1) % 8][0]
			], u = t < 0 ? [
				i,
				o,
				c
			] : [
				i,
				c,
				o
			];
			e.tri(s, u[0], u[1], u[2], ...u.map((e) => [e[2] / l[0], w(e[1])]), {
				normal: [
					t,
					0,
					0
				],
				color: [
					.94,
					.94,
					.94
				]
			});
		}
	}
	for (let n of [-1, 1]) {
		o.push([
			n * (d - f / 2),
			0,
			f * .7
		]);
		for (let r = 0; r < 3; r++) {
			let r = a.range(.16, .3) * Math.min(1.8, f * 1.5);
			g(e, n * (d + a.range(-.3, .35)), 0, a.range(-1, 1) * f * .8, [
				r,
				r * .7,
				r * .9
			], a, {
				top: t.top,
				side: t.side,
				detail: 0,
				yaw: a.range(0, 6.28)
			});
		}
	}
}
var F = "#5fd8f0";
function I(e) {
	return {
		top: e.textures.material("ice_crag_top", { vertexColors: !0 }),
		side: e.textures.material("ice_crag", {
			vertexColors: !0,
			emissive: new c(F),
			emissiveIntensity: 1
		})
	};
}
function L(t, n, r, i, a) {
	let o = new s(0, 1, 0);
	for (let c = 0; c < a; c++) {
		let a = r.range(0, Math.PI * 2), c = i * r.range(.85, 1.15), l = r.range(.6, 1.5), u = r.range(.1, .22), d = new s(Math.cos(a) * r.range(.2, .5), 1, Math.sin(a) * r.range(.2, .5)).normalize();
		t.push([
			Math.cos(a) * c,
			-.1,
			Math.sin(a) * c
		], new e().setFromUnitVectors(o, d)), t.lathe(n.side, [
			{
				y: 0,
				r: u
			},
			{
				y: l * .7,
				r: u * .85
			},
			{
				y: l,
				r: .01
			}
		], {
			segments: 5,
			phase: r.range(0, 3),
			smooth: !1
		}), t.pop();
	}
}
var R = (e = .4, t = .8) => (n, r) => t + (1 - t) * x(-.05, e, r);
function z(e, t, r, i, a = {}) {
	let o = b(Number.isFinite(a.size) ? Number(a.size) : 1, .3, 2.5), s = Number.isFinite(a.rotation) ? Number(a.rotation) : null;
	if (a.stone === "snow") {
		let c = e.rng("rock:snow", t, i, a.seed), l = e.builder(R()), u = e.textures.material("snow_drift", { vertexColors: !0 }), d = 1.25 * o * c.range(.85, 1.15), f = .38 * o * c.range(.8, 1.15), p = .9 * o * c.range(.85, 1.15);
		g(l, 0, 0, 0, [
			d,
			f,
			p
		], c, {
			top: u,
			side: u,
			detail: 2,
			rough: .1,
			flatTop: .25,
			sink: .35,
			tint: [
				.96,
				.97,
				1
			]
		}), g(l, d * .7, 0, p * c.range(-.4, .4), [
			d * .55,
			f * .7,
			p * .6
		], c, {
			top: u,
			side: u,
			detail: 1,
			rough: .1,
			flatTop: .2,
			sink: .35
		});
		let m = l.build("rock:snow", { castShadow: !1 });
		e.track(m.geometries);
		let h = m.group;
		h.userData.dynamic = !0, h.rotation.y = s ?? c.range(0, Math.PI * 2);
		let _ = new n();
		_.name = "rock:snow", _.position.set(t, r, i), _.add(h), _.updateMatrixWorld(!0);
		let v = -1;
		return e.result(_, { update: (e) => {
			let n = C.at(t, i) >= .5 ? 0 : 1;
			v < 0 ? v = n : v !== n && (v = n > v ? Math.min(1, v + e / 2) : Math.max(0, v - e / 2.5));
			let r = v * v * (3 - 2 * v);
			h.visible = r > .002, h.scale.set(.8 + .2 * r, r, .8 + .2 * r);
		} });
	}
	let c = e.rng("rock:ice", t, i, a.seed), l = I(e), u = e.builder(R(.4 * o, .7)), d = .72 * o * c.range(.85, 1.15), f = .66 * o * c.range(.85, 1.15), p = .62 * o * c.range(.85, 1.15);
	g(u, 0, 0, 0, [
		d,
		f,
		p
	], c, {
		top: l.top,
		side: l.side,
		detail: +(o > .55),
		rough: .4,
		flatTop: a.flat ? .3 : .05
	}), o >= .8 && L(u, l, c, Math.max(d, p) * .9, 2);
	let m = e.finish(u, "rock:ice", t, r, i, s ?? c.range(0, Math.PI * 2)), h = [{
		type: "circle",
		x: t,
		z: i,
		r: Math.max(d, p) * .95
	}];
	return e.result(m, { colliders: h });
}
//#endregion
//#region src/engine/world/props/FlameBatch.js
var B = new t(1, 1).translate(0, .5, 0), V = new t(1, 1), H = `
uniform float uCameraYaw;
attribute vec3 iCenter;
attribute vec2 iSize;
attribute vec4 iParam;
varying vec2 vUv;
flat varying float vSeed;
flat varying float vIntensity;
flat varying float vSpeed;
flat varying vec2 vPx;
#include <common>
#include <fog_pars_vertex>
void main() {
  vUv = uv;
  vSeed = iParam.x;
  vIntensity = iParam.y;
  vSpeed = iParam.z;
  // the pixel grid of the quad (Flame.js createFlameMaterial: max(4, round(size * PPU)))
  vPx = max( vec2( 4.0 ), floor( iSize * ${16 .toFixed(1)} + 0.5 ) );
  vec3 wCenter = ( modelMatrix * vec4( iCenter, 1.0 ) ).xyz;
  vec3 right = vec3( cos( uCameraYaw ), 0.0, - sin( uCameraYaw ) );
  vec3 toCam = vec3( sin( uCameraYaw ), 0.0, cos( uCameraYaw ) );
  vec3 wPos = wCenter + right * position.x * iSize.x + vec3( 0.0, 1.0, 0.0 ) * position.y * iSize.y + toCam * iParam.w;
  vec4 mvPosition = viewMatrix * vec4( wPos, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`, U = `
uniform float uTime;
uniform vec3 uFire[ 6 ];
varying vec2 vUv;
flat varying float vSeed;
flat varying float vIntensity;
flat varying float vSpeed;
flat varying vec2 vPx;
#define uSeed vSeed
#define uIntensity vIntensity
#define uSpeed vSpeed
#define uPx vPx
${h}`, W = "\nuniform float uCameraYaw;\nattribute vec3 iCenter;\nattribute vec2 iSize;\nattribute vec4 iParam;\nvarying vec2 vUv;\nflat varying float vSeed;\nflat varying float vIntensity;\nflat varying float vBaseV;\n#include <common>\n#include <fog_pars_vertex>\nvoid main() {\n  vUv = uv;\n  vSeed = iParam.x;\n  vIntensity = iParam.y;\n  // iSize: (card size, flame height); the card is centred 0.4 of the flame up (Flame.js createFlame)\n  float gs = max( iSize.x, 1e-3 );\n  vBaseV = 0.5 - ( iSize.y * 0.4 ) / gs;\n  vec3 wCenter = ( modelMatrix * vec4( iCenter + vec3( 0.0, iSize.y * 0.4, 0.0 ), 1.0 ) ).xyz;\n  vec3 right = vec3( cos( uCameraYaw ), 0.0, - sin( uCameraYaw ) );\n  vec3 toCam = vec3( sin( uCameraYaw ), 0.0, cos( uCameraYaw ) );\n  vec3 wPos = wCenter + ( right * position.x + vec3( 0.0, 1.0, 0.0 ) * position.y ) * iSize.x - toCam * 0.05;\n  vec4 mvPosition = viewMatrix * vec4( wPos, 1.0 );\n  gl_Position = projectionMatrix * mvPosition;\n  #include <fog_vertex>\n}\n", G = `
uniform float uTime;
uniform float uNight;
uniform float uDay;
uniform vec3 uColor;
varying vec2 vUv;
flat varying float vSeed;
flat varying float vIntensity;
flat varying float vBaseV;
#define uSeed vSeed
#define uIntensity vIntensity
#define uBaseV vBaseV
${v}`, K = "\nuniform float uTime;\nuniform vec2 uWind;\nuniform float uWindStrength;\nattribute vec3 iCenter;\nattribute vec2 iSize;\nattribute vec4 iParam;\nvarying float vHeat;\nflat varying float vTw;\n#include <common>\n#include <fog_pars_vertex>\nfloat sh( float n ) { return fract( sin( n * 12.9898 + 4.1414 ) * 43758.5453 ); }\nvoid main() {\n  float seed = fract( iParam.x * 0.0137 ) * 97.0;\n  // (time wrapped: the hash and the phase keep their precision in a long session)\n  float t = fract( mod( uTime, 600.0 ) * iParam.y * ( 0.65 + 0.7 * sh( seed + 0.3 ) ) + sh( seed ) );\n  float a = sh( seed + 1.7 ) * 6.2831853;\n  float r = sqrt( sh( seed + 3.1 ) ) * iSize.x;\n  vec3 p = iCenter + vec3( cos( a ) * r, 0.0, sin( a ) * r );\n  float rise = iSize.y * ( 0.55 + 0.45 * sh( seed + 5.3 ) );\n  p.y += rise * ( t + 0.4 * t * t );\n  p.xz += uWind * uWindStrength * ( 0.35 * t * rise );\n  p.x += sin( t * 9.0 + seed * 3.0 ) * 0.2 * t;\n  p.z += cos( t * 7.0 + seed * 5.0 ) * 0.2 * t;\n  float size = iParam.z * ( 1.0 - 0.5 * t ) * step( 1e-4, iSize.y );\n  vec4 mvPosition = viewMatrix * ( modelMatrix * vec4( p, 1.0 ) );\n  mvPosition.xy += position.xy * size;\n  gl_Position = projectionMatrix * mvPosition;\n  vHeat = 1.0 - t;\n  vTw = sh( seed + 9.1 );\n  #include <fog_vertex>\n}\n", q = "\nuniform float uTime;\nuniform vec3 uFire[ 6 ];\nvarying float vHeat;\nflat varying float vTw;\n#include <common>\n#include <fog_pars_fragment>\nvoid main() {\n  // cooling: white-gold, gold, orange, red; fading out at the end; a twinkle\n  vec3 col = vHeat > 0.8 ? uFire[ 4 ] * 1.6 : vHeat > 0.5 ? uFire[ 3 ] * 1.9 : vHeat > 0.22 ? uFire[ 2 ] * 2.0 : uFire[ 1 ] * 2.0;\n  float tw = 0.7 + 0.3 * step( 0.5, fract( uTime * 7.0 + vTw * 13.0 ) );\n  float k = smoothstep( 0.0, 0.18, vHeat ) * tw;\n  if ( k < 0.01 ) discard;\n  gl_FragColor = vec4( col * k, 1.0 );\n  #include <tonemapping_fragment>\n  #include <colorspace_fragment>\n  #ifdef USE_FOG\n    // additive: fade the contribution out with fog instead of tinting toward the fog colour\n    #ifdef FOG_EXP2\n      float fogF = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n    #else\n      float fogF = smoothstep( fogNear, fogFar, vFogDepth );\n    #endif\n    gl_FragColor.rgb *= 1.0 - fogF;\n  #endif\n}\n", J = {
	flame: {
		base: B,
		reach: .6,
		order: 0
	},
	glow: {
		base: V,
		reach: .6,
		order: y.PARTICLES + 5
	},
	spark: {
		base: V,
		reach: 1.2,
		order: y.PARTICLES + 4
	}
};
function Y(e) {
	return {
		flame: e._cachedMaterial("siege:flame", () => {
			let e = d.merge([p.fog, { uFire: { value: m() } }]);
			return e.uTime = w.uTime, e.uCameraYaw = w.uCameraYaw, e.uFogStart = w.uFogStart, new a({
				name: "luminati:flameBatch",
				uniforms: e,
				vertexShader: H,
				fragmentShader: U,
				fog: !0,
				side: 2
			});
		}),
		glow: e._cachedMaterial("siege:glow", () => {
			let e = d.merge([p.fog, {
				uDay: { value: .25 },
				uColor: { value: new c(16747066) }
			}]);
			return e.uTime = w.uTime, e.uCameraYaw = w.uCameraYaw, e.uNight = w.uNight, e.uFogStart = w.uFogStart, new a({
				name: "luminati:flameBatchGlow",
				uniforms: e,
				vertexShader: W,
				fragmentShader: G,
				fog: !0,
				transparent: !0,
				depthWrite: !1,
				blending: 2,
				side: 2
			});
		}),
		spark: e._cachedMaterial("siege:spark", () => {
			let e = d.merge([p.fog, { uFire: { value: m() } }]);
			return e.uTime = w.uTime, e.uWind = w.uWind, e.uWindStrength = w.uWindStrength, e.uFogStart = w.uFogStart, new a({
				name: "luminati:flameBatchSparks",
				uniforms: e,
				vertexShader: K,
				fragmentShader: q,
				fog: !0,
				transparent: !0,
				depthWrite: !1,
				blending: 2,
				side: 2
			});
		})
	};
}
function X(e, t, n, a, o, c) {
	let d = new r();
	d.setIndex(e.index.clone()), d.setAttribute("position", e.attributes.position.clone()), d.setAttribute("uv", e.attributes.uv.clone()), d.setAttribute("iCenter", new u(t, 3)), d.setAttribute("iSize", new u(n, 2)), d.setAttribute("iParam", new u(a, 4)), d.instanceCount = o;
	let f = new l(), p = new s();
	for (let e = 0; e < o; e++) {
		let r = Math.max(n[e * 2], n[e * 2 + 1]) * c;
		p.fromArray(t, e * 3), f.expandByPoint(p.set(p.x - r, p.y - .1, p.z - r)), p.fromArray(t, e * 3), f.expandByPoint(p.set(p.x + r, p.y + r * 2, p.z + r));
	}
	return d.boundingBox = f, d.boundingSphere = f.getBoundingSphere(new i()), d;
}
function Z(e, t, n, r, i, a, o) {
	let s = J[e], c = new f(X(s.base, n, r, i, a, s.reach), t);
	return c.name = o, c.userData.flameBatch = e, c.renderOrder = s.order, c.castShadow = !1, c.receiveShadow = !1, c;
}
var Q = class {
	constructor() {
		this.flames = [], this.sparks = [];
	}
	add(e) {
		return this.flames.push(e), this;
	}
	spark(e) {
		return e.count > 0 && this.sparks.push(e), this;
	}
	get count() {
		return this.flames.length;
	}
	build(e) {
		let t = this.flames.filter((e) => (e.glow ?? 0) > 0), r = 0;
		for (let e of this.sparks) r += Math.round(e.count);
		if (!this.flames.length && !r) return null;
		let i = Y(e), a = new n();
		a.name = "flames";
		let o = [], s = (e) => {
			a.add(e), o.push(e.geometry);
		};
		if (this.flames.length) {
			let e = this.flames.length, t = new Float32Array(e * 3), n = new Float32Array(e * 2), r = new Float32Array(e * 4);
			this.flames.forEach((e, i) => {
				t.set([
					e.x,
					e.y,
					e.z
				], i * 3), n.set([e.width, e.height], i * 2), r.set([
					e.seed ?? 0,
					e.intensity ?? 1,
					e.speed ?? 1,
					.02
				], i * 4);
			}), s(Z("flame", i.flame, t, n, r, e, "flames:body"));
		}
		if (t.length) {
			let e = t.length, n = new Float32Array(e * 3), r = new Float32Array(e * 2), a = new Float32Array(e * 4);
			t.forEach((e, t) => {
				n.set([
					e.x,
					e.y,
					e.z
				], t * 3), r.set([Math.max(e.width, e.height) * (e.glow ?? 0), e.height], t * 2), a.set([
					e.seed ?? 0,
					e.glowIntensity ?? .55,
					0,
					0
				], t * 4);
			}), s(Z("glow", i.glow, n, r, a, e, "flames:glow"));
		}
		if (r) {
			let e = new Float32Array(r * 3), t = new Float32Array(r * 2), n = new Float32Array(r * 4), a = 0;
			for (let r of this.sparks) {
				let i = Math.max(.3, r.life ?? 2.2);
				for (let o = 0; o < Math.round(r.count); o++, a++) e.set([
					r.x,
					r.y,
					r.z
				], a * 3), t.set([r.spread, r.height], a * 2), n.set([
					(r.seed ?? 0) * 31.7 + o * 7.13,
					1 / i,
					r.size ?? .08,
					0
				], a * 4);
			}
			s(Z("spark", i.spark, e, t, n, r, "flames:sparks"));
		}
		return e.track(o), a;
	}
}, $ = new o(), ee = new s();
function te(e, t, { name: r = "flames:merged" } = {}) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e?.object ?? e;
		if (!t?.isObject3D) continue;
		let n = null;
		t.traverse((e) => {
			let r = e;
			if (!r.isMesh || !r.userData.flameBatch) return;
			n ||= (t.updateWorldMatrix(!0, !0), t.parent ? new o().copy(t.parent.matrixWorld).invert() : null);
			let a = r.material, s = i.get(a);
			s || i.set(a, s = {
				kind: r.userData.flameBatch,
				src: []
			}), s.src.push({
				mesh: r,
				owner: t,
				rel: n
			});
		});
	}
	if (!i.size) return null;
	let a = new n();
	a.name = r;
	let s = [], c = [], l = /* @__PURE__ */ new Map(), u = 0, d = 0;
	for (let [t, n] of i) {
		let i = 0;
		for (let e of n.src) i += e.mesh.geometry.instanceCount;
		let o = new Float32Array(i * 3), f = new Float32Array(i * 2), p = new Float32Array(i * 4), m = [], h = 0;
		for (let t of n.src) {
			let n = t.mesh.geometry, r = n.getAttribute("iCenter").array, i = n.getAttribute("iSize").array, a = n.getAttribute("iParam").array;
			$.copy(t.mesh.matrixWorld), t.rel && $.premultiply(t.rel);
			for (let e = 0; e < n.instanceCount; e++) {
				ee.fromArray(r, e * 3).applyMatrix4($).toArray(o, (h + e) * 3), f[(h + e) * 2] = i[e * 2], f[(h + e) * 2 + 1] = i[e * 2 + 1];
				for (let t = 0; t < 4; t++) p[(h + e) * 4 + t] = a[e * 4 + t];
			}
			m.push({
				owner: t.owner,
				start: h,
				count: n.instanceCount
			}), h += n.instanceCount, t.mesh.removeFromParent(), n.dispose(), e._geometries.delete(n);
		}
		let g = Z(n.kind, t, o, f, p, i, `${r}:${n.kind}`);
		g.matrixAutoUpdate = !1, delete g.userData.flameBatch, n.kind === "flame" ? u += i : n.kind === "spark" && (d += i);
		let _ = g.geometry.getAttribute("iSize");
		for (let e of m) {
			let t = l.get(e.owner);
			t || (t = {
				owner: e.owner,
				visible: !0,
				ranges: []
			}, l.set(e.owner, t), c.push(t)), t.ranges.push({
				attr: _,
				start: e.start,
				count: e.count,
				sizes: f.slice(e.start * 2, (e.start + e.count) * 2)
			});
		}
		s.push(g), a.add(g);
	}
	let f = () => {
		for (let e of c) {
			let t = e.owner.visible;
			if (t !== e.visible) {
				e.visible = t;
				for (let n of e.ranges) {
					let e = n.attr.array;
					t ? e.set(n.sizes, n.start * 2) : e.fill(0, n.start * 2, (n.start + n.count) * 2), n.attr.addUpdateRange(n.start * 2, n.count * 2), n.attr.needsUpdate = !0;
				}
			}
		}
	};
	f();
	for (let e of s) e.onBeforeRender = f;
	return {
		object: a,
		meshes: s,
		count: u,
		sparks: d,
		dispose: () => {
			for (let e of s) e.geometry.dispose();
			a.removeFromParent();
		}
	};
}
//#endregion
export { z as a, N as i, Y as n, te as r, Q as t };
