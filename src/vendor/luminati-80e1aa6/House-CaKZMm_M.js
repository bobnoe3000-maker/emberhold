import { pr as e, wt as t } from "./three.core-CDiAvzro.js";
import { D as n, F as r, I as i, L as a, N as o, P as s, S as c } from "./SmallProps-Bhy5ZjLW.js";
import { t as l } from "./Palette-D7TB3xJk.js";
import { a as u, c as d, f, i as p, r as m, s as h, t as ee } from "./math-Du_SWpiD.js";
import { i as te } from "./own-rp3p7qEo.js";
import { a as g, c as _, i as v, r as y, t as b } from "./PixelCanvas-BggARGih.js";
//#region src/engine/world/props/PropTextures.js
var x = l.outline;
function S(e, t, { alpha: n = !1, normalStrength: r = 2, wrap: i = !0 } = {}) {
	let a = e.width, o = e.height, s = y(e.toCanvas(), {
		wrap: "repeat",
		mipmaps: !0,
		anisotropy: 4
	}), c = g(a, o, (e, n) => t[n * a + e], {
		strength: r,
		wrap: i
	});
	return {
		map: s,
		normal: y(c.toCanvas(), {
			wrap: "repeat",
			mipmaps: !0,
			srgb: !1,
			anisotropy: 4
		}),
		units: [a / 16, o / 16],
		alpha: n
	};
}
function C(e) {
	let t = new m(e), n = new b(16, 32);
	n.wrap = !0;
	let r = (/* @__PURE__ */ new Float32Array(512)).fill(.6), i = [
		"#9c9a9a",
		"#c4c1bb",
		"#dedad2",
		"#eeebe3",
		"#f8f6ef"
	];
	for (let t = 0; t < 32; t++) for (let a = 0; a < 16; a++) {
		let o = d(a, t >> 1, e) * .5 + d(a >> 1, t >> 2, e + 3) * .5, s = u(Math.floor(o * 3.2 + 1), 0, 4);
		n.set(a, t, i[s]), r[t * 16 + a] = .55 + o * .1;
	}
	for (let e = 0; e < 16; e++) {
		let e = t.int(0, 31), i = t.int(0, 15), a = t.int(2, 6);
		for (let t = 0; t < a; t++) n.set(i + t, e, t === 0 || t === a - 1 ? "#56555f" : "#2b2a33"), n.set(i + t, e + 1, "#fbfaf5"), r[(e % 32 + 32) % 32 * 16 + (i + t) % 16] = .3;
	}
	for (let e = 0; e < 2; e++) {
		let e = t.int(0, 15), i = t.int(0, 31);
		for (let [t, a] of [
			[0, 0],
			[1, 0],
			[-1, 0],
			[0, 1],
			[2, 1],
			[-2, 1],
			[1, 1],
			[-1, 1],
			[0, -1]
		]) n.set(e + t, i + a, a === -1 ? "#3d3c47" : x), r[((i + a) % 32 + 32) % 32 * 16 + ((e + t) % 16 + 16) % 16] = .2;
	}
	return S(n, r, { normalStrength: 2.2 });
}
function w(e) {
	let t = new b(64, 16, "#1d1311"), n = (/* @__PURE__ */ new Float32Array(1024)).fill(.1);
	return [
		{
			ramp: [
				"#3a0c14",
				"#7a1a22",
				"#b8302e",
				"#e0584a",
				"#f7a37e"
			],
			r: 2.2,
			step: 4
		},
		{
			ramp: [
				"#4a1d0c",
				"#9c4414",
				"#dd7a1f",
				"#f5a93a",
				"#ffe08a"
			],
			r: 2.2,
			step: 4
		},
		{
			ramp: [
				"#0f261c",
				"#1f4a2a",
				"#3c7a36",
				"#68a845",
				"#a8d466"
			],
			r: 3.1,
			step: 6
		},
		{
			ramp: [
				"#170c24",
				"#34194a",
				"#5a2d78",
				"#8a4aa8",
				"#c08ad6"
			],
			r: 1.3,
			step: 3
		}
	].forEach((r, i) => {
		let a = new m(e + i * 97), o = i * 16, s = [];
		for (let e = -1; e * r.step < 16 + r.step; e++) for (let t = -1; t * r.step < 16 + r.step; t++) s.push([t * r.step + (e & 1 ? r.step / 2 : 0) + a.range(-.7, .7) + 1.5, e * r.step + a.range(-.7, .7) + 1.5]);
		s.sort((e, t) => e[1] - t[1]);
		for (let [c, l] of s) {
			let s = r.r * a.range(.9, 1.1);
			for (let a = Math.floor(l - s - 1); a <= Math.ceil(l + s + 1); a++) for (let f = Math.floor(c - s - 1); f <= Math.ceil(c + s + 1); f++) {
				if (f < 0 || a < 0 || f >= 16 || a >= 16) continue;
				let p = f + .5 - c, m = a + .5 - l, h = Math.hypot(p, m) / (s + .35);
				if (h > 1) continue;
				let ee = u(.62 - p * .12 - m * .16 - h * .35 + (i === 2 ? (d(f, a, e) - .5) * .3 : 0), 0, .999), te = r.ramp[Math.floor(ee * r.ramp.length)];
				h > .84 && (te = r.ramp[0]), t.set(o + f, a, te), n[a * 64 + o + f] = .4 + (1 - h * h) * .6;
			}
			let f = Math.round(c - s * .45 - .5), p = Math.round(l - s * .45 - .5);
			if (i !== 2 && f >= 0 && p >= 0 && f < 16 && p < 16 && t.set(o + f, p, r.ramp[4]), i === 0 && a.chance(.5)) {
				let e = Math.round(c - .5), n = Math.round(l - s + .2);
				e >= 0 && n >= 0 && e < 16 && n < 16 && t.set(o + e, n, "#4a2a18");
			}
		}
	}), S(t, n, {
		normalStrength: 2.5,
		wrap: !1
	});
}
function T(e) {
	let t = new m(e), n = new b(16, 48), r = (/* @__PURE__ */ new Float32Array(768)).fill(0), i = l.wood, a = [
		"#8f8170",
		"#b8a88e",
		"#d6c8aa",
		"#ebe1c9",
		"#f6efdd"
	];
	for (let t = 0; t < 39; t++) for (let i = 1; i < 15; i++) {
		let o = Math.sin(i / 14 * Math.PI * 2.2 + .4) * .5 + .5, s = d(i, t, e), c = u(Math.floor(1 + o * 2.2 + s * .9 - (t > 34 ? .8 : 0)), 0, 4);
		n.set(i, t, a[c]), r[t * 16 + i] = .35 + o * .15;
	}
	let o = t.int(6, 24), s = t.int(3, 9);
	n.rect(s, o, 3, 3, "#c9a77a"), n.strokeRect(s, o, 3, 3, "#9a7a55");
	let c = (e, t, i, a = .9) => {
		n.set(e, t, i), e >= 0 && t >= 0 && e < 16 && t < 48 && (r[t * 16 + e] = a);
	};
	for (let e = 0; e < 48; e++) c(0, e, i[1]), c(15, e, i[2]), e >= 39 && c(8, e, i[3]);
	for (let e = 0; e < 48; e += 5) {
		for (let t = 0; t < 16; t++) c(t, e, t === 0 ? i[1] : i[3], .85);
		for (let t = 0; t < 16; t++) e + 1 < 48 && n.getAlpha(t, e + 1) > 0 && n.set(t, e + 1, _(n.get(t, e + 1), -.25));
	}
	for (let e = 0; e < 16; e++) c(e, 47, i[2]);
	return S(n, r, {
		alpha: !0,
		normalStrength: 2,
		wrap: !1
	});
}
function E(e) {
	let t = new m(e), n = new b(32, 32), r = (/* @__PURE__ */ new Float32Array(1024)).fill(0), i = l.leavesAutumn;
	for (let e = 0; e < 70; e++) {
		let e = t.next() * Math.PI * 2, a = Math.sqrt(t.next()) * 14, o = Math.round(16 + Math.cos(e) * a), s = Math.round(16 + Math.sin(e) * a * .9), c = i[t.int(1, 4)], l = i[Math.min(5, t.int(3, 5))];
		n.set(o, s, c), n.set(o + 1, s, t.chance(.5) ? c : l), t.chance(.6) && n.set(o, s + 1, _(c, -.2)), t.chance(.3) && n.set(o - 1, s, l), r[u(s, 0, 31) * 32 + u(o, 0, 31)] = 1;
	}
	return S(n, r, {
		alpha: !0,
		normalStrength: 1,
		wrap: !1
	});
}
function D(e) {
	let t = new b(16, 16), n = /* @__PURE__ */ new Float32Array(256), r = [
		"#141116",
		"#221c20",
		"#352c2c",
		"#4a3f3b",
		"#6b5f58"
	];
	for (let i = 0; i < 16; i++) for (let a = 0; a < 16; a++) {
		let o = d(a, i, e) * .6 + d(a >> 1, i >> 1, e + 1) * .4;
		t.set(a, i, r[u(Math.floor(o * 5), 0, 4)]), n[i * 16 + a] = o, d(a, i, e + 9) > .93 && t.set(a, i, v("#ff7a2a", "#5a1208", d(i, a, e)));
	}
	return S(t, n, { normalStrength: 1.5 });
}
function O(e, t = !1) {
	let n = new m(e), r = new b(32, 32);
	r.wrap = !0;
	let i = /* @__PURE__ */ new Float32Array(1024), a = [
		"#3d4053",
		"#4f5468",
		"#626a7c",
		"#767e8d",
		"#8e97a3"
	], o = [
		"#1c2f25",
		"#2e4a31",
		"#4b6b3a",
		"#6f8d45",
		"#93ad55"
	];
	for (let t = 0; t < 32; t++) for (let n = 0; n < 32; n++) {
		let o = h(n / 8, t / 8, {
			octaves: 3,
			seed: e,
			period: 4
		}), s = (p(n, t) - .5) * .35, c = u((o - .5) * 1.35 + .55 + s * .5, 0, .999);
		r.set(n, t, a[Math.floor(c * a.length)]), i[t * 32 + n] = .45 + o * .3;
	}
	for (let e = 0; e < 3; e++) {
		let e = n.int(0, 31), t = n.int(0, 31), a = n.int(4, 8), o = n.chance(.5) ? 1 : -1;
		for (let s = 0; s < a; s++) r.set(e, t, "#2a2b3a"), r.set(e, t + 1, "#9aa3ad"), i[(t % 32 + 32) % 32 * 32 + (e % 32 + 32) % 32] = .15, e += o, n.chance(.45) && (t += n.chance(.5) ? 1 : -1), n.chance(.15) && (o = -o);
	}
	for (let e = 0; e < 10; e++) {
		let e = n.int(0, 31), t = n.int(0, 31);
		r.set(e, t, n.chance(.5) ? "#a9a86a" : "#c8b77a");
	}
	if (t) {
		for (let t = 0; t < 32; t++) for (let n = 0; n < 32; n++) {
			let a = h(n / 8 + 11.3, t / 8 + 7.1, {
				octaves: 3,
				seed: e + 5,
				period: 4
			});
			if (a < .4) continue;
			let s = u((a - .4) * 3.6 + (p(n, t) - .5) * .4, 0, .999);
			r.set(n, t, o[Math.min(4, 1 + Math.floor(s * 4))]), i[t * 32 + n] = .7 + s * .25;
		}
		let t = r.clone();
		for (let e = 0; e < 32; e++) for (let n = 0; n < 32; n++) {
			let i = t.get(n, e);
			i[1] > i[2] + 8 || t.get(n, e - 1)[1] > t.get(n, e - 1)[2] + 8 && r.set(n, e, "#2e3b30");
		}
	}
	return S(r, i, { normalStrength: 2.2 });
}
var k = {
	birch: C,
	produce: w,
	sail: T,
	leaf_litter: E,
	ash: D,
	boulder: (e) => O(e, !1),
	boulder_moss: (e) => O(e, !0)
};
function A(e) {
	let t = k;
	for (let [n, r] of Object.entries(e)) {
		if (Object.hasOwn(t, n)) {
			if (t[n] === r) continue;
			throw Error(`PropTextureSet: the texture "${n}" is defined twice`);
		}
		t[n] = r;
	}
}
var j = Object.freeze({
	finish: S,
	OUTLINE: x
}), M = class {
	constructor(e = 42) {
		this.seed = e >>> 0, this._tex = /* @__PURE__ */ new Map(), this._mats = /* @__PURE__ */ new Map();
	}
	textures(e) {
		let t = this._tex.get(e);
		if (!t) {
			let n = Object.hasOwn(k, e) ? k[e] : null;
			if (!n) throw Error(`PropTextureSet: unknown texture "${e}" (the arid trees' are the set-piece kit's: src/engine/world/SetPieceKit.js)`);
			t = n(this.seed + (e === "boulder_moss" ? "boulder" : e).length * 7919), this._tex.set(e, t);
		}
		return t;
	}
	material(n, r = {}) {
		let i = `${n}|${JSON.stringify(r)}`, a = this._mats.get(i);
		if (a) return a;
		let o = this.textures(n);
		return a = new t({
			map: o.map,
			normalMap: o.normal,
			normalScale: new e(.6, .6),
			vertexColors: !0,
			...o.alpha ? {
				alphaTest: .5,
				side: 2
			} : {},
			...r
		}), a.name = `luminati:prop:${n}`, a.userData.units = o.units, a.userData.texture = null, o.alpha && (a.userData.alpha = !0), this._mats.set(i, a), a;
	}
	dispose() {
		for (let e of this._tex.values()) e.map.dispose(), e.normal.dispose();
		for (let e of this._mats.values()) e.dispose();
		this._tex.clear(), this._mats.clear();
	}
}, ne = {
	front: {
		n: [0, 1],
		yaw: 0
	},
	back: {
		n: [0, -1],
		yaw: Math.PI
	},
	right: {
		n: [1, 0],
		yaw: Math.PI / 2
	},
	left: {
		n: [-1, 0],
		yaw: -Math.PI / 2
	}
}, re = {
	front: "right",
	back: "left",
	left: "front",
	right: "back"
}, ie = [
	[
		.62,
		.78,
		1
	],
	[
		.7,
		.95,
		.65
	],
	[
		1,
		.72,
		.62
	],
	[
		1,
		1,
		1
	]
], ae = /* @__PURE__ */ new Set(["adobe", "whitewash"]), oe = /* @__PURE__ */ new Set(["sandstone_brick", "charred_wall"]), se = [
	.3,
	.26,
	.25
], ce = [
	.46,
	.4,
	.38
], N = [
	.07,
	.055,
	.05
];
function P(e, t, i, l, d = {}) {
	let p = {
		width: 4,
		depth: 3,
		stories: 1,
		roof: "roof_red",
		wall: "timber_frame",
		rotation: 0,
		chimney: !0,
		door: "front",
		...d
	}, m = e.textures, h = e.rng("house", t, l, p.seed), g = Number.isFinite(p.ruin) ? u(Math.round(p.ruin), 0, 2) : 0, _ = Number.isFinite(p.burning) ? u(p.burning, 0, 1) : 0, v = p.flatRoof === !0, y = g > 0 || _ > 0, b = y || v ? e.rng("house:siege", t, l, p.seed) : null, x = y || v ? n("a damaged, burning or flat-roofed house") : null, S = !!p.gableFront, C = S ? p.depth : p.width, w = S ? p.width : p.depth, T = u(Math.round(p.stories), 1, 2), E = p.plinthHeight ?? .5, D = p.storyHeight ?? 3, O = T > 1 ? p.upperHeight ?? 2 : 0, k = T > 1 ? p.jetty ?? (v || g === 2 ? 0 : .25) : 0, A = p.wall, j = p.upperWall ?? A, M = p.plinth ?? (A === "charred_wall" ? "charred_wall" : ae.has(A) || oe.has(A) ? "sandstone_brick" : "stone_brick"), N = E + D + O, P = C / 2, F = w / 2, I = F + k, L = (p.pitch ?? h.range(38, 45)) * ee, R = p.overhang ?? .35, z = I * Math.tan(L), B = p.roofThickness ?? .22, V = .1, H = e.builder((e, t) => {
		let n = .62 + .38 * f(-.05, 1.1, t);
		return t > E && t < N + .01 && (n *= 1 - .2 * f(N - .9, N, t)), n;
	});
	S && H.matrix.makeRotationY(-Math.PI / 2);
	let ge = e.windowMaterial(), _e = e.glassMaterial(), ve = [], ye = [], be = [{
		material: ge,
		day: 0,
		night: 1.6
	}], U = {}, xe = y ? x.siegeDecalMaterial(e) : null, Se = _ > 0 ? x.fireWindowMaterial(e) : null;
	Se && be.push({
		material: Se,
		...x.FIRE_WINDOW_GLOW
	});
	let Ce = _ > 0 ? new x.FlameSet() : null, W = [], we = m.meta(M).units[0];
	H.box(M, [
		C + 2 * V,
		E,
		w + 2 * V
	], {
		at: [
			0,
			E / 2,
			0
		],
		faces: {
			...r(C + 2 * V, w + 2 * V, we),
			ny: !1
		},
		cutsT: [E * .5]
	});
	let G = null, K = E + D;
	if (g === 2) G = x.brokenWalls(H, m, b, {
		W: C,
		D: w,
		P: E,
		H1: D,
		E: N,
		wall: A,
		upperWall: j,
		stories: T,
		door: le(p, S)
	});
	else {
		let e = m.meta(A).units[0];
		if (H.box(A, [
			C,
			D,
			w
		], {
			at: [
				0,
				E + D / 2,
				0
			],
			faces: {
				...r(C, w, e),
				py: !1,
				ny: !1
			},
			cutsT: [.5, D - .9]
		}), ue(H, m, A, C, w, E, D, h, {
			top: T === 1 && !v,
			bottom: !0
		}), T > 1) {
			let e = m.meta(j).units[0];
			H.box(j, [
				C,
				O,
				w + 2 * k
			], {
				at: [
					0,
					K + O / 2,
					0
				],
				faces: {
					...r(C, w + 2 * k, e),
					py: !1,
					ny: !1
				},
				cutsT: [O - .9]
			}), H.box(o, [
				C + .14,
				.24,
				w + 2 * k + .14
			], { at: [
				0,
				K + .04,
				0
			] });
			let t = Math.max(2, Math.round(C / .55));
			for (let e = 0; e < t; e++) {
				let n = -P + .25 + e * (C - .5) / (t - 1);
				for (let e of [-1, 1]) H.box(o, [
					.13,
					.13,
					k + .08
				], {
					at: [
						n,
						K - .13,
						e * (F + k / 2)
					],
					faces: {
						nz: !(e > 0),
						pz: !(e < 0)
					}
				});
			}
			ue(H, m, j, C, w + 2 * k, K + .16, O - .16, h, {
				top: !v,
				bottom: !1
			});
		}
	}
	let Te = p.gable ?? (j === "brick" || j === "stone_brick" ? "wood_planks" : j), Ee = T > 1 ? K : E;
	if (!v) {
		let e = m.meta(Te).units, t = Te === "wood_planks" || Te === "wood_planks_dark", n = s(2 * I, e[0]);
		for (let e of [1, -1]) {
			if (G && e === G.collapseEnd) continue;
			let r = e * P, i = e > 0 ? [
				[
					r,
					N,
					I
				],
				[
					r,
					N,
					-I
				],
				[
					r,
					N + z + .02,
					0
				]
			] : [
				[
					r,
					N,
					-I
				],
				[
					r,
					N,
					I
				],
				[
					r,
					N + z + .02,
					0
				]
			], a = e > 0 ? [
				0,
				0,
				-1
			] : [
				0,
				0,
				1
			], s = y ? { color: g ? ce : [
				.8,
				.74,
				.72
			] } : {};
			H.poly(Te, i, t ? {
				uAxis: [
					0,
					1,
					0
				],
				vAxis: a,
				origin: [
					r,
					Ee,
					e * I
				],
				off: [0, n],
				...s
			} : {
				uAxis: a,
				vAxis: [
					0,
					1,
					0
				],
				origin: [
					r,
					Ee,
					e * I
				],
				off: [n, 0],
				...s
			}), g && H.poly(o, [
				i[1],
				i[0],
				i[2]
			].map((t) => [
				t[0] - e * .03,
				t[1],
				t[2]
			]), {
				uAxis: a,
				vAxis: [
					0,
					1,
					0
				],
				color: se
			}), H.box(o, [
				.1,
				.16,
				2 * I + .1
			], { at: [
				r + e * .05,
				N + .02,
				0
			] }), t || H.box(o, [
				.1,
				z * .8,
				.16
			], {
				at: [
					r + e * .04,
					N + z * .4,
					0
				],
				rotUV: !0
			});
		}
	}
	let De = p.roof, Oe = N + z, q = Math.cos(L), ke = Math.sin(L), Ae = Oe + B / q, J = [];
	if (v) x.flatRoofGeom(H, m, b, {
		W: C,
		D: w,
		E: N,
		wall: A,
		ruin: g,
		stories: T,
		chimney: p.chimney,
		anchors: U,
		roofFires: J,
		decal: xe
	});
	else if (g > 0) x.ruinedRoof(H, m, b, {
		W: C,
		hw: P,
		hs: I,
		E: N,
		R: z,
		O: R,
		Ts: B,
		pitch: L,
		roof: De,
		ruin: g,
		collapseEnd: G?.collapseEnd ?? 0,
		roofFires: J
	});
	else {
		let e = m.meta(De).units[0], t = Math.tan(L), n = C + 2 * R, r = (I + R) / q + B * t, i = ((I + R) / q - B * t) / 2;
		for (let t of [1, -1]) {
			let a = [
				0,
				Oe - ke * i + q * B / 2,
				t * (q * i + ke * B / 2)
			];
			H.push(a, t > 0 ? [
				L,
				0,
				0
			] : [
				L,
				Math.PI,
				0,
				"YXZ"
			]), H.box(De, [
				n,
				B,
				r
			], { faces: {
				py: { off: [s(n, e), 0] },
				ny: {
					mat: o,
					color: [
						.8,
						.78,
						.8
					]
				},
				pz: { mat: o },
				nz: !1,
				px: { mat: o },
				nx: { mat: o }
			} }), H.box(o, [
				n + .1,
				B + .16,
				.09
			], {
				at: [
					0,
					-.06,
					r / 2 + .03
				],
				faces: { nz: !1 }
			});
			for (let e of [-1, 1]) H.box(o, [
				.09,
				B + .16,
				r + .02
			], {
				at: [
					e * (n / 2 + .035),
					-.06,
					.005
				],
				faces: { nz: !1 }
			});
			H.pop();
		}
		if (H.box(p.ridge ?? De, [
			n + .14,
			.3,
			.3
		], {
			at: [
				0,
				Ae - .05,
				0
			],
			rot: [
				Math.PI / 4,
				0,
				0
			],
			faces: {
				px: o,
				nx: o
			},
			color: [
				.82,
				.8,
				.82
			]
		}), _ > 0) {
			let e = 1 + Math.round(_ * 2.5);
			for (let t = 0; t < e; t++) J.push({
				x: (t - (e - 1) / 2) * (C / Math.max(1, e)) + b.range(-.3, .3),
				y: Oe - .25,
				z: b.range(-.3, .3),
				size: 1
			});
		}
	}
	if (p.chimney && !v) {
		let e = (p.chimneySide ?? (h.chance(.5) ? 1 : -1)) * Math.max(.2, P - .8), t = h.chance(.6) ? -I * .42 : I * .3, n = g === 2 ? N + z * .45 : Ae + .75, i = N - .2, a = .74, o = m.meta("chimney_stone").units;
		G && Math.sign(e) === G.collapseEnd || (H.box("chimney_stone", [
			a,
			n - i,
			a
		], {
			at: [
				e,
				(n + i) / 2,
				t
			],
			faces: {
				...r(a, a, o[0], { vOff: i - N }),
				ny: !1,
				py: !1
			},
			color: y ? ce : void 0
		}), g < 2 ? (H.box(M, [
			.94,
			.16,
			.94
		], { at: [
			e,
			n + .08,
			t
		] }), H.box("chimney_stone", [
			.64,
			.12,
			.64
		], {
			at: [
				e,
				n + .2,
				t
			],
			faces: { py: !1 }
		}), H.box("chimney_stone", [
			.48,
			.02,
			.48
		], {
			at: [
				e,
				n + .255,
				t
			],
			faces: { ny: !1 },
			color: [
				.1,
				.08,
				.08
			]
		})) : H.box("chimney_stone", [
			.58,
			.02,
			.58
		], {
			at: [
				e,
				n + .005,
				t
			],
			faces: { ny: !1 },
			color: [
				.1,
				.08,
				.08
			]
		}), y || (U.smoke = H.point(e, n + .45, t)));
	}
	let Y = (e, t) => {
		let n = ne[e], r = e === "front" || e === "back", i = t ? F + k : F;
		return {
			L: r ? C : t ? w + 2 * k : w,
			cx: n.n[0] * P,
			cz: n.n[1] * i,
			yaw: n.yaw,
			long: r
		};
	}, X = (e) => H.push([
		e.cx,
		0,
		e.cz
	], e.yaw), je = p.door === "none" || p.door === !1 ? null : p.door || "front", Me = je ? S ? te(re, je) : je : null, Ne = p.shutters ?? h.chance(.6), Pe = ie[h.int(0, ie.length - 1)], Fe = p.flowerboxes ?? !y, Z = 0, Ie = () => Se ?? (g ? null : ge), Le = (e, t, n, r) => !G || G.minTop(e, t, n) >= r;
	for (let e of [
		"front",
		"back",
		"right",
		"left"
	]) {
		let t = Y(e, !1);
		X(t);
		let n = e === Me;
		if (n) {
			let e = t.L / 2 - 1.15, n = t.L >= 4 && (t.L < 5.5 || h.chance(.5));
			Z = p.doorOffset ?? (n ? h.chance(.5) ? -e : e : 0);
		}
		if (n && Le(e, Z - .75, Z + .75, E + 2.3)) {
			fe(H, m, Z, E, V, M, h, p, y), W.push({
				side: e,
				upper: !1,
				x: Z,
				y: E,
				w: 1,
				h: 2.1,
				door: !0
			}), U.door = H.point(Z, 0, 1), U.leafA = H.point(Z - .5, E + 1, .02), U.leafB = H.point(Z + .5, E + 1, .02);
			let n = t.L / 2 - (Z + .7) >= Z - .7 + t.L / 2 ? 1 : -1, r = Z + n * .98;
			if ((p.lantern ?? !y) && Math.abs(r) < t.L / 2 - .15) {
				let e = E + 1.95;
				H.box("metal", [
					.05,
					.05,
					.46
				], { at: [
					r,
					e + .36,
					.23
				] }), H.box("metal", [
					.04,
					.04,
					.32
				], {
					at: [
						r,
						e + .25,
						.12
					],
					rot: [
						-.75,
						0,
						0
					]
				}), H.box("metal", [
					.1,
					.14,
					.03
				], { at: [
					r,
					e + .3,
					.015
				] }), a(H, _e, r, e, .44, {
					w: .22,
					h: .28
				}), be.push({
					material: _e,
					day: 0,
					night: 2.4
				}), U.lantern = H.point(r, e, .6);
			}
			if (p.sign) {
				let e = Z - n * 1;
				Math.abs(e) < t.L / 2 + .2 && (H.push([
					e,
					0,
					0
				], -n * Math.PI / 4), me(H, m, 0, E + 2.35), H.pop());
			}
		}
		let r = E + 1, i = de(t.L, n ? Z : null, t.long);
		for (let a of i) {
			if (!n && !t.long && h.chance(.25)) continue;
			let i = Fe && (e === "front" || h.chance(.3)) && h.chance(.75), o = Math.min(t.L / 2 - Math.abs(a), n ? Math.abs(a - Z) - .75 : 9), s = h.range(0, 1);
			Le(e, a - .7, a + .7, r + 1.15) && (pe(H, Ie(), a, r, {
				shutters: Ne && o > 1.12,
				shutterTint: Pe,
				flowerbox: i,
				uShift: s,
				ruin: g,
				sr: b
			}), W.push({
				side: e,
				upper: !1,
				x: a,
				y: r,
				w: 1,
				h: 1
			}));
		}
		if (H.pop(), T > 1) {
			let t = Y(e, !0);
			X(t);
			let n = de(t.L, null, t.long);
			for (let r of n) {
				if (!t.long && h.chance(.3)) continue;
				let n = t.L / 2 - Math.abs(r), i = Fe && e === "front" && h.chance(.5), a = h.range(0, 1);
				Le(e, r - .7, r + .7, K + 1.65) && (pe(H, Ie(), r, K + .5, {
					shutters: Ne && n > 1.12,
					shutterTint: Pe,
					flowerbox: i,
					uShift: a,
					ruin: g,
					sr: b
				}), W.push({
					side: e,
					upper: !0,
					x: r,
					y: K + .5,
					w: 1,
					h: 1
				}));
			}
			v && e === "front" && !y && b.chance(.75) && x.balconyGeom(H, b, t.L, K), H.pop();
		}
	}
	if (p.woodpile ?? h.chance(.55)) {
		let e = h.chance(.5) ? "right" : "left", t = Y(e, !1);
		X(t), Le(e, -t.L / 2, t.L / 2, E + 1.5) && he(H, h.range(-.4, .4) * (t.L - 2), .38, y ? se : null), H.pop();
	}
	if (y && x.siegeDetails(H, m, b, {
		W: C,
		D: w,
		P: E,
		E: N,
		hw: P,
		hd: F,
		J: k,
		stories: T,
		ruin: g,
		burning: _,
		flat: v,
		gableR: z,
		broken: G,
		decal: xe,
		openings: W,
		faceInfo: Y,
		pushFace: X,
		wall: A
	}), Ce) {
		x.burnFlames(H, b, Ce, {
			burning: _,
			ruin: g,
			flat: v,
			openings: W,
			faceInfo: Y,
			pushFace: X,
			roofFires: J,
			P: E,
			E: N,
			W: C,
			D: w,
			broken: G
		});
		let e = J.length ? J.reduce((e, t) => e + t.x, 0) / J.length : 0, t = J.length ? J.reduce((e, t) => e + t.z, 0) / J.length : 0, n = v ? N + .6 : g === 2 ? N + .5 : Ae;
		U.fireSmoke = H.point(e, n + 1.4, t), U.fireLight = H.point(e * .5, Math.max(N + .6, n - .6), t * .5 + (S ? 0 : F * .3));
	}
	let Q = e.finish(H, "house", t, i, l, p.rotation);
	if (Ce) {
		let t = Ce.build(e);
		t && (Q.add(t), Q.updateMatrixWorld(!0));
	}
	let $ = (t) => e.world(Q, t);
	U.lantern && ve.push({
		position: $(U.lantern),
		color: 16757867,
		intensity: 6,
		distance: 7,
		flicker: .25,
		nightOnly: !0
	}), p.windowLights && U.door && ve.push({
		position: $(U.door).setY(i + 1.6),
		color: 16754266,
		intensity: 3,
		distance: 6,
		flicker: .1,
		nightOnly: !0
	}), U.smoke && ye.push({
		preset: "smoke",
		position: $(U.smoke),
		rate: 3
	}), U.fireLight && (ve.push({
		position: $(U.fireLight),
		color: 16742958,
		intensity: 8 + 12 * _,
		distance: 9 + 5 * _,
		flicker: .65,
		nightOnly: !1,
		fire: !0
	}), ye.push({
		preset: "smokeDark",
		position: $(U.fireSmoke),
		rate: 1.2 + 2.4 * _
	}));
	let Re = e.result(Q, {
		colliders: S ? e.boxColliders(Q, -F - V, F + V, -P - V, P + V) : e.boxColliders(Q, -P - V, P + V, -F - V, F + V),
		lights: ve,
		emissives: be,
		emitters: ye
	});
	return U.door && (Re.interact = {
		position: $(U.door),
		radius: 1.1,
		id: p.id ?? "house",
		lookSpan: {
			a: $(U.leafA),
			b: $(U.leafB)
		}
	}), p.icicles === !0 && !v && !g && (Re.update = c("icicles").houseIcicles(e, Q, {
		W: C,
		hs: I,
		O: R,
		Ts: B,
		pitch: L,
		ridgeY: Oe,
		gf: S,
		x: t,
		z: l,
		seed: p.seed
	})), Re;
}
function le(e, t) {
	let n = e.door === "none" || e.door === !1 ? null : e.door || "front";
	return n ? t ? te(re, n) : n : null;
}
function ue(e, t, n, r, i, a, s, c, { top: l = !0, bottom: u = !0 } = {}) {
	let d = r / 2, f = i / 2;
	if (n === "timber_frame" || n === "plaster") {
		for (let t of [-1, 1]) for (let n of [-1, 1]) e.box(o, [
			.2,
			s,
			.2
		], {
			at: [
				t * (d - .06),
				a + s / 2,
				n * (f - .06)
			],
			rotUV: !0,
			faces: {
				py: !1,
				ny: !1
			}
		});
		u && e.box(o, [
			r + .08,
			.16,
			i + .08
		], {
			at: [
				0,
				a + .08,
				0
			],
			faces: { ny: !1 }
		});
	} else if (n === "brick") {
		let t = Math.floor(s / .5);
		for (let n = 0; n < t; n++) {
			let t = n % 2 == 0;
			for (let r of [-1, 1]) for (let i of [-1, 1]) {
				let o = t ? .62 : .34, s = t ? .34 : .62;
				e.box("stone_brick", [
					o,
					.46,
					s
				], {
					at: [
						r * (d - o / 2 + .04),
						a + n * .5 + .25,
						i * (f - s / 2 + .04)
					],
					faces: { ny: !1 },
					off: [c.range(0, 1), 0]
				});
			}
		}
		u && e.box("stone_brick", [
			r + .1,
			.18,
			i + .1
		], {
			at: [
				0,
				a + .09,
				0
			],
			faces: { ny: !1 }
		});
	} else if (n === "log_wall") {
		let t = Math.round(s / .5);
		for (let n = 0; n < t; n++) {
			let t = a + n * .5 + .25, r = n % 2 == 0;
			for (let n of [-1, 1]) for (let i of [-1, 1]) {
				let a = n * (d - .05), o = i * (f - .05);
				r ? e.tube("bark", [
					a - n * .12,
					t,
					o
				], [
					a + n * .32,
					t,
					o
				], .2, .19, {
					segments: 6,
					capTop: "wood_planks",
					twist: .3
				}) : e.tube("bark", [
					a,
					t,
					o - i * .12
				], [
					a,
					t,
					o + i * .32
				], .2, .19, {
					segments: 6,
					capTop: "wood_planks",
					twist: .3
				});
			}
		}
	} else if (ae.has(n)) {
		for (let t of [-1, 1]) for (let r of [-1, 1]) e.box(n, [
			.34,
			s,
			.34
		], {
			at: [
				t * (d - .1),
				a + s / 2,
				r * (f - .1)
			],
			faces: {
				ny: !1,
				py: !1
			},
			off: [t * .3, 0]
		}), e.box(n, [
			.42,
			.5,
			.42
		], {
			at: [
				t * (d - .12),
				a + .25,
				r * (f - .12)
			],
			faces: { ny: !1 },
			color: [
				.82,
				.78,
				.74
			]
		});
		u && e.box(n, [
			r + .04,
			.42,
			i + .04
		], {
			at: [
				0,
				a + .21,
				0
			],
			faces: {
				ny: !1,
				py: !1
			},
			color: [
				.8,
				.76,
				.72
			]
		});
	} else if (oe.has(n)) {
		let t = Math.floor(s / .5);
		for (let r = 0; r < t; r++) {
			let t = r % 2 == 0;
			for (let i of [-1, 1]) for (let o of [-1, 1]) {
				let s = t ? .66 : .36, l = t ? .36 : .66;
				e.box(n, [
					s,
					.46,
					l
				], {
					at: [
						i * (d - s / 2 + .04),
						a + r * .5 + .25,
						o * (f - l / 2 + .04)
					],
					faces: { ny: !1 },
					off: [c.range(0, 1), 0],
					color: [
						1.06,
						1.04,
						1.02
					]
				});
			}
		}
	}
	l && e.box(o, [
		r + .12,
		.2,
		i + .12
	], {
		at: [
			0,
			a + s - .1,
			0
		],
		faces: { py: !1 }
	});
}
function de(e, t, n) {
	let r = -e / 2 + .85, i = e / 2 - .85, a = [];
	t == null ? a.push([r, i]) : (t - 1.38 >= r && a.push([r, t - 1.38]), t + 1.38 <= i && a.push([t + 1.38, i]));
	let o = [];
	for (let [e, t] of a) {
		let r = t - e;
		if (r < 0) continue;
		let i = Math.floor(r / (n ? 1.9 : 2.4)) + 1;
		if (n || (i = Math.min(i, 1)), i === 1) o.push((e + t) / 2);
		else for (let t = 0; t < i; t++) o.push(e + t * r / (i - 1));
	}
	return o;
}
function fe(e, t, n, r, i, a, s, c, l = !1) {
	e.quad("door", [
		[
			n - .5,
			r,
			.02
		],
		[
			n + .5,
			r,
			.02
		],
		[
			n + .5,
			r + 2,
			.02
		],
		[
			n - .5,
			r + 2,
			.02
		]
	], [
		[0, 0],
		[1, 0],
		[1, 1],
		[0, 1]
	], l ? { color: ce } : {});
	for (let t of [-1, 1]) e.box(o, [
		.15,
		2.16,
		.18
	], {
		at: [
			n + t * .575,
			r + 1.08,
			.07
		],
		rotUV: !0
	});
	if (e.box(o, [
		1.46,
		.2,
		.22
	], { at: [
		n,
		r + 2.1,
		.09
	] }), e.box(o, [
		1.2,
		.05,
		.16
	], {
		at: [
			n,
			r + .02,
			.08
		],
		faces: { ny: !1 }
	}), e.box(a, [
		1.5,
		.25,
		.5
	], {
		at: [
			n,
			.125,
			i + .25
		],
		faces: { ny: !1 },
		off: [.3, 0]
	}), c.doorHood ?? s.chance(.55)) {
		let t = r + 2.45;
		e.box(c.roof, [
			1.8,
			.1,
			.78
		], {
			at: [
				n,
				t,
				.36
			],
			rot: [
				.32,
				0,
				0
			],
			faces: {
				ny: o,
				px: o,
				nx: o,
				pz: o
			}
		});
		for (let r of [-1, 1]) e.box(o, [
			.08,
			.08,
			.62
		], {
			at: [
				n + r * .7,
				t - .26,
				.26
			],
			rot: [
				-.7,
				0,
				0
			]
		});
	}
}
function pe(e, t, n, r, { shutters: a, shutterTint: s, flowerbox: c, uShift: l = 0, ruin: u = 0, sr: d = null }) {
	t ? e.quad(t, [
		[
			n - .5,
			r,
			.02
		],
		[
			n + .5,
			r,
			.02
		],
		[
			n + .5,
			r + 1,
			.02
		],
		[
			n - .5,
			r + 1,
			.02
		]
	], [
		[0, 0],
		[1, 0],
		[1, 1],
		[0, 1]
	]) : (e.quad(o, [
		[
			n - .5,
			r,
			0
		],
		[
			n + .5,
			r,
			0
		],
		[
			n + .5,
			r + 1,
			0
		],
		[
			n - .5,
			r + 1,
			0
		]
	], [
		[0, 0],
		[1, 0],
		[1, 1],
		[0, 1]
	], { color: N }), e.tri("window", [
		n - .5,
		r + 1,
		.02
	], [
		n - .5,
		r + .55,
		.02
	], [
		n - .22,
		r + 1,
		.02
	], [0, 1], [0, .55], [.28, 1], { color: [
		.5,
		.5,
		.55
	] }), e.tri("window", [
		n + .5,
		r,
		.02
	], [
		n + .5,
		r + .32,
		.02
	], [
		n + .18,
		r,
		.02
	], [1, 0], [1, .32], [.68, 0], { color: [
		.5,
		.5,
		.55
	] })), e.box(o, [
		1.16,
		.08,
		.1
	], { at: [
		n,
		r + 1,
		.05
	] });
	for (let t of [-1, 1]) e.box(o, [
		.08,
		1.02,
		.1
	], {
		at: [
			n + t * .54,
			r + .5,
			.05
		],
		rotUV: !0
	});
	if (e.box(o, [
		1.36,
		.09,
		.24
	], { at: [
		n,
		r - .045,
		.11
	] }), e.box(o, [
		1.3,
		.13,
		.15
	], { at: [
		n,
		r + 1.1,
		.07
	] }), a) for (let t of [-1, 1]) {
		if (u && d) {
			if (d.chance(.45)) continue;
			if (d.chance(.6)) {
				e.push([
					n + t * .83,
					r + .95,
					.06
				], [
					.08,
					t * .35,
					t * (.35 + d.range(0, .4))
				]), e.box("wood_planks", [
					.46,
					1.04,
					.05
				], {
					at: [
						0,
						-.5,
						0
					],
					rotUV: !0,
					color: s.map((e) => e * .55)
				}), e.pop();
				continue;
			}
		}
		e.box("wood_planks", [
			.46,
			1.04,
			.05
		], {
			at: [
				n + t * .83,
				r + .5,
				.035
			],
			rotUV: !0,
			color: u ? s.map((e) => e * .55) : s
		}), e.box(o, [
			.4,
			.06,
			.02
		], { at: [
			n + t * .83,
			r + .8,
			.07
		] }), e.box(o, [
			.4,
			.06,
			.02
		], { at: [
			n + t * .83,
			r + .2,
			.07
		] });
	}
	c && i(e, n, r - .09 - 7 / 16, .36, 1.1, .26, l);
}
function me(e, t, n, r) {
	e.box("metal", [
		.05,
		.05,
		1.05
	], { at: [
		n,
		r,
		.52
	] }), e.box("metal", [
		.04,
		.04,
		.6
	], {
		at: [
			n,
			r - .2,
			.25
		],
		rot: [
			.62,
			0,
			0
		]
	});
	for (let t of [.3, .9]) e.box("metal", [
		.02,
		.14,
		.02
	], { at: [
		n,
		r - .08,
		t
	] });
	let i = .52;
	e.box("sign_board", [
		.06,
		i,
		.95
	], {
		at: [
			n,
			r - .15 - i / 2,
			.6
		],
		faces: {
			px: { off: [1.05 / 2, .48 / 2] },
			nx: { off: [1.05 / 2, .48 / 2] },
			py: o,
			ny: o,
			pz: o,
			nz: o
		}
	});
}
function he(e, t, n, r = null) {
	for (let [i, a] of [
		[4, 0],
		[3, .5],
		[2, 1]
	]) for (let s = 0; s < i; s++) {
		let c = t + (s - (i - 1) / 2) * .36, l = .17 + a * .62;
		e.tube(o, [
			c,
			l,
			n + .3
		], [
			c,
			l,
			n - .25
		], .17, .17, {
			segments: 6,
			capTop: "wood_planks",
			capBottom: "wood_planks",
			twist: s * .7 + a,
			uRepeat: 1,
			...r ? { color: r } : {}
		});
	}
	e.box(o, [
		1.6,
		.08,
		.7
	], { at: [
		t,
		.04,
		n + .02
	] });
}
//#endregion
export { N as a, j as c, ce as i, A as l, se as n, P as o, ne as r, M as s, oe as t };
