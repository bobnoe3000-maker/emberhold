import { c as e, l as t, r as n } from "./math-Du_SWpiD.js";
import { r } from "./ThawField-CelnRTY2.js";
import "./engine-hlzvTIM_.js";
import { n as i, t as a } from "./GroundFrost-BXjaRT90.js";
import { t as o } from "./glowSpots-q5RSKfDQ.js";
import { a as s, i as c, n as l, r as u, t as d } from "./CombatSystem-CtIRYghB.js";
//#region src/game/party/IceSpellFx.js
var f = Object.freeze({
	lance: Object.freeze([
		.34,
		.36,
		.88
	]),
	lanceLit: Object.freeze([
		.62,
		1.4,
		1.85
	]),
	burst: Object.freeze([
		.55,
		1.2,
		1.8
	]),
	glyph: Object.freeze([
		.26,
		.54,
		.9
	]),
	swirl: Object.freeze([
		.6,
		.78,
		1
	]),
	flake: Object.freeze([
		.6,
		1.25,
		1.75
	]),
	flakeNear: Object.freeze([
		.22,
		.5,
		.85
	]),
	shard: Object.freeze([
		.26,
		.3,
		.78
	]),
	shardLit: Object.freeze([
		.3,
		.62,
		.95
	]),
	shell: Object.freeze([
		.3,
		.34,
		.8
	]),
	shellLit: Object.freeze([
		.38,
		.74,
		1.02
	]),
	mist: Object.freeze([
		.5,
		.6,
		.85
	]),
	ring: Object.freeze([
		.42,
		.74,
		1.15
	]),
	star: Object.freeze([
		.45,
		.85,
		1.7
	]),
	starFlash: Object.freeze([
		.5,
		.95,
		1.8
	])
}), p = .6, m = Object.freeze({
	rgb: Object.freeze([
		.2,
		.45,
		.88
	]),
	alpha: .55,
	soft: .85
}), h = Object.freeze([
	.55,
	.85,
	1
]), g = Object.freeze({
	frostLance: Object.freeze({
		peak: 1.1,
		flash: 1.8
	}),
	blizzard: Object.freeze({
		peak: 1.4,
		flash: 2.2
	}),
	glacialTomb: Object.freeze({
		peak: 1.5,
		flash: 2.4
	}),
	tau: .12
}), _ = Object.freeze({
	tombColor: [
		.15,
		.4,
		1.8
	],
	tombDistance: 10.5,
	tombLift: 3,
	charge: 5,
	chargeLift: .6,
	chargeDistance: 4.5,
	flash: 12,
	flashTau: .1,
	hold: 2.5,
	holdDecay: 2,
	shatter: 12,
	stormColor: [
		.16,
		.4,
		1.6
	],
	stormDistance: 11,
	stormLift: 3,
	storm: 7,
	impactColor: [
		.25,
		.6,
		1.8
	],
	impactDistance: 3.5,
	impact: 6,
	impactT: .16,
	cap: 6
}), v = Object.freeze({
	light: .55,
	glow: .5,
	crystal: .75,
	flash: .25
}), y = (e) => e + (1 - e) * r.uNight.value, b = .012, x = -.03, S = 64, C = 16, w = 3, T = .25, E = Object.freeze({
	size: 1.3,
	nearLow: .62,
	innerLow: .72,
	screenLow: .5,
	screenDepth: 2.6,
	screenSide: .75,
	sink: .02,
	centreBack: .8,
	crackLead: .22,
	rise: .13,
	peakAt: .55,
	overshoot: 1.15,
	outer: .25,
	sweep: .11,
	inner: .14,
	innerSweep: .05,
	crackT: .32,
	glintT: .38,
	discOut: .16,
	shardLife: [.9, 1.3],
	dissolve: .3,
	recede: 1.1
}), D = Object.freeze({
	gust: 1.2,
	gustFire: .5,
	gustRise: .4,
	gustFall: .7,
	recede: 1,
	flakes: 18,
	near: 4
});
function O() {
	return {
		on: !1,
		kind: "blizzard",
		x: 0,
		y: 0,
		z: 0,
		t: 0,
		n: 0,
		m: -1,
		a: 0,
		tag: 0,
		flake: 0,
		near: 0,
		hail: 0,
		mist: 0,
		fx: [],
		spikes: [],
		gf: -1,
		light: null,
		disc: null,
		discRgb: [
			0,
			0,
			0
		],
		fromX: 0,
		fromZ: 0,
		tipFx: [
			null,
			null,
			null
		],
		ready: -1,
		fade: 0,
		lph: 0,
		lt: 0
	};
}
var k = (e) => {
	let t = Math.max(0, Math.min(1, e));
	return t * t * (3 - 2 * t);
}, A = (e) => e <= 0 ? 0 : e >= 1 ? 1 : e;
function j(e, t, n, r) {
	e.x = t.x, e.y = t.y, e.z = t.z, e.rot += t.spin * n, e.alpha = r;
}
function M(e, t, n) {
	e.x = t.x, e.y = t.y + n, e.z = t.z, e.dirX = t.dx, e.dirZ = t.dz;
}
var N = (e) => {
	let t = Math.PI * 2;
	return e = (e % t + t) % t, e > Math.PI ? e - t : e;
};
function P(e) {
	if (e <= 0) return 0;
	let t = E.peakAt;
	if (e < t) {
		let n = 1 - e / t;
		return E.overshoot * (1 - n * n * n);
	}
	return e < 1 ? E.overshoot - (E.overshoot - 1) * k((e - t) / (1 - t)) : 1;
}
var F = class {
	constructor(e) {
		this.sys = e;
		let t = e.tileMap;
		this.crystals = new i({ capacity: 48 }), this.frost = new a({
			capacity: 4,
			heightField: {
				sample: (e, n) => t.getHeight(e, n),
				surface: (e, n) => t._surface(e, n),
				minX: 0,
				minZ: 0,
				maxX: t.width,
				maxZ: t.depth
			}
		}), e.scene?.add(this.crystals.object), e.scene?.add(this.frost.object), e.quads?.enableHalo(), this.directors = [], this._gust = 0, this.gustMax = e.world?.flames ? D.gustFire : D.gust, this._warmQuad = -1;
	}
	director(e) {
		let t = new I(this, e);
		return this.directors.push(t), t;
	}
	drop(e) {
		let t = this.directors.indexOf(e);
		t >= 0 && this.directors.splice(t, 1);
	}
	warmup(e) {
		this.crystals.warm(), this.frost.warm(), this.crystals.update(0), this.frost.update(0);
		let t = this.sys.quads;
		this._warmQuad = t.alloc(), this._warmQuad >= 0 && t.set(this._warmQuad, {
			x: e.x,
			y: e.y,
			z: e.z,
			frame: "partyIceGlow",
			index: 0,
			scale: 1,
			mode: "billboard",
			r: 2,
			g: 2,
			b: 2,
			a: 1,
			halo: 1
		}), t.update();
	}
	endWarmup() {
		this.crystals.unwarm(), this.frost.unwarm(), this.crystals.update(0), this.frost.update(0), this._warmQuad >= 0 && this.sys.quads.free(this._warmQuad), this._warmQuad = -1;
	}
	update(e, t = !0, n = 0, r = !1) {
		let i = !t && !this.sys.game?.photoMode, a = 0;
		for (let e of this.directors) e._frameDt = n, r ? (e.hush(), e.settle(n)) : i ? e.hush() : (t && e.resume(n), a = Math.max(a, e.gust));
		this._setGust(Math.round(Math.min(a, this.gustMax) * 100) / 100), this.crystals.update(e), this.frost.update(e);
	}
	_setGust(e) {
		if (e === 0 && this._gust === 0) return;
		let t = this.sys.game?.weather;
		t && "gust" in t && (t.gust = e), this._gust = e;
	}
	dropLights() {
		for (let e of this.directors) e.dropLights();
	}
	dispose() {
		for (let e of [...this.directors]) e.dispose();
		this.directors.length = 0, this._setGust(0), this.crystals.dispose(), this.frost.dispose();
	}
	info() {
		return {
			directors: this.directors.length,
			crystals: this.crystals.count,
			frost: this.frost.count,
			gust: this._gust,
			halo: !!this.sys.quads?.halo
		};
	}
}, I = class {
	constructor(e, t) {
		this.stage = e, this.mc = t, this.sys = t.sys, this.fx = new c(this.sys, { halo: 0 }), this._lances = [], this._fields = Array.from({ length: w }, O), this._flakes = [], this._drifts = [], this._shards = [], this._shells = /* @__PURE__ */ new Map(), this._sparks = [], this._crystal = o(t.member.sprite?.sheet), this._crys = {
			x: 0,
			y: 0,
			z: 0
		}, this._wind = {
			x: 1,
			z: 0
		}, this._crysP = {
			rise: 0,
			crack: 0,
			glint: 0,
			glow: 1
		}, this._frostP = {
			spread: 0,
			fade: 0,
			cracks: 0,
			crackFrom: {
				x: 0,
				z: 0
			},
			glow: 1
		}, this._riseP = { rise: 0 }, this._fadeP = { fade: 0 }, this._lightP = {
			color: _.tombColor,
			intensity: 0,
			distance: 8,
			decay: 1
		}, this._frameDt = 0, this._tips = [
			{
				x: 0,
				y: 0,
				z: 0
			},
			{
				x: 0,
				y: 0,
				z: 0
			},
			{
				x: 0,
				y: 0,
				z: 0
			}
		], this.gust = 0, this._snap = /* @__PURE__ */ new Map(), this.clear();
	}
	get count() {
		return this.fx.count;
	}
	clear() {
		this._lances.length = 0;
		for (let e of this._fields) e.on && this._closeField(e);
		this._flakes.length = 0, this._drifts.length = 0, this._shards.length = 0;
		for (let e of this._shells.keys()) e.iceShell = !1;
		this._shells.clear();
		for (let e of this._sparks) e.light.release();
		this._sparks.length = 0, this.fx.clear(), this.gust = 0, this._star = null, this.glow = 0, this._kick = 0, this._glowShown = -1, this.lights = {
			acquired: 0,
			refused: 0
		}, this._settling = !1, this._settleT = 0, this._settled = !1, this._back = 1, this._backT = 0, this._snap.clear(), this.rng = new n((t(`ice:${this.mc.id}`) ^ Number(this.sys.seedValue) >>> 0) >>> 0), this._writeGlow(0);
	}
	hush() {
		for (let e of this._fields) e.on && e.light && e.light.off();
		for (let e of this._sparks) e.light.off();
	}
	settle(e) {
		if (!this._settling) {
			this._settling = !0, this._settleT = 0, this._settled = !1, this._snap.clear();
			for (let e = 0; e < this.fx.live.length; e++) this._snap.set(this.fx.live[e], this.fx.live[e].alpha);
		}
		if (this._settled) return;
		this._settleT += e;
		let t = A(this._settleT / T);
		this._back = 1 - t;
		for (let e = 0; e < this.fx.live.length; e++) {
			let n = this.fx.live[e];
			n.alpha = (this._snap.get(n) ?? 0) * (1 - t);
		}
		let { crystals: n, frost: i } = this.stage, a = this._riseP, o = this._fadeP;
		for (let e of this._fields) if (e.on) {
			for (let r of e.spikes) r.h < 0 || (a.rise = r.r * (1 - t), n.set(r.h, a));
			e.gf >= 0 && (o.fade = Math.max(e.fade, t), i.set(e.gf, o));
		}
		this.glow !== 0 && (this.glow = 0, this._writeGlow(0)), t >= 1 && this._endOneShots();
		let s = this.sys.fx;
		this.fx.write(s ? s.viewX : 0, s ? s.viewZ : -1, 1 - p * r.uNight.value);
	}
	_endOneShots() {
		for (let e of this._lances) this.fx.kill(e.body), this.fx.kill(e.lit);
		this._lances.length = 0;
		for (let e of this._fields) e.on && this._closeField(e);
		for (let e of this._flakes) this.fx.kill(e.rec);
		this._flakes.length = 0;
		for (let e of this._drifts) this.fx.kill(e.rec);
		this._drifts.length = 0;
		for (let e of this._shards) this.fx.kill(e.body), this.fx.kill(e.lit);
		this._shards.length = 0;
		for (let e of this._sparks) e.light.release();
		this._sparks.length = 0, this._star && this.fx.kill(this._star), this._star = null, this.gust = 0, this._back = 0, this._settled = !0;
	}
	resume(e) {
		this._settling && (this._settled || this._endOneShots(), this._settling = !1, this._settled = !1, this._backT = 0), this._back < 1 && (this._backT += e, this._back = A(this._backT / T));
	}
	dropLights() {
		for (let e of this._fields) e.light &&= (e.light.release(), null);
		for (let e of this._sparks) e.light.release();
		this._sparks.length = 0;
	}
	dispose() {
		this.clear(), this.stage.drop(this);
	}
	_acquireLight(e) {
		let t = this.sys.world, n = t && typeof t.acquireSpellLight == "function" ? t.acquireSpellLight(e) : null;
		return n ? this.lights.acquired++ : this.lights.refused++, n;
	}
	gather(e = 3) {
		let t = this._crystalAt();
		this.sys.burst("partyFrostGlint", t.x, t.y, t.z, e);
	}
	released(e) {
		this._kick = g[e].flash;
		let t = this._crystalAt();
		this.fx.add({
			frame: "partySunburst",
			mode: "billboard",
			x: t.x,
			y: t.y,
			z: t.z,
			scale: .55,
			color: f.starFlash,
			life: .16,
			fadeOut: .14,
			frames: [1],
			back: -.25,
			halo: 1
		}), this.sys.burst("partyFrostGlint", t.x, t.y, t.z, 4);
	}
	launch(e) {
		let t = {
			frame: "partyIceLance",
			mode: "flat",
			x: e.x,
			y: e.y,
			z: e.z,
			dirX: e.dx,
			dirZ: e.dz,
			rot: Math.PI / 2,
			scale: 1.6,
			color: f.lance,
			life: Infinity,
			loop: !0
		}, n = this.fx.add(t), r = this.fx.add({
			...t,
			frame: "partyIceLanceLit",
			y: e.y + b,
			color: f.lanceLit,
			halo: 1
		});
		this._lances.push({
			ms: e,
			body: n,
			lit: r
		});
	}
	lanceEnd(e, t) {
		let n = this._lances.findIndex((t) => t.ms === e);
		if (n >= 0) {
			let e = this._lances[n];
			this.fx.kill(e.body), this.fx.kill(e.lit), this._lances.splice(n, 1);
		}
		let r = this.sys;
		if (!t) {
			r.burst("partyFrostGlint", e.x, e.y, e.z, 3);
			return;
		}
		this.fx.add({
			frame: "partySunburst",
			mode: "billboard",
			x: e.x,
			y: e.y - .1,
			z: e.z,
			scale: .9,
			color: f.burst,
			life: .24,
			back: .2,
			halo: 1
		}), r.burst("partyFrostShards", e.x, e.y, e.z, 8);
		let i = r.groundAt(e.x, e.z);
		for (let t = 0; t < 3; t++) {
			let t = Math.atan2(-e.dz, -e.dx) + (this.rng.next() - .5) * 2.2, n = 1.4 + 1.6 * this.rng.next();
			this._shard(e.x, e.y, e.z, Math.cos(t) * n, 1.5 + 2 * this.rng.next(), Math.sin(t) * n, .45 + .15 * this.rng.next(), .7);
		}
		if (this._mist(e.x, i, e.z, 1.1, .7), this._sparks.length < 2) {
			let t = this._acquireLight({ minor: !0 });
			t && this._sparks.push({
				light: t,
				x: e.x,
				y: e.y + .6,
				z: e.z,
				t: 0
			});
		}
	}
	open(e) {
		let t = e.kind === "blizzard" ? "blizzard" : "glacialTomb", n = this._fields.find((e) => !e.on);
		if (!n) {
			n = this._fields[0];
			for (let e of this._fields) e.t > n.t && (n = e);
			this._closeField(n);
		}
		let r = this.mc.kit;
		n.on = !0, n.kind = t, n.x = e.x, n.z = e.z, n.y = e.y, n.t = 0, n.n = 0, n.m = -1, n.flake = 0, n.near = .15, n.hail = .05, n.mist = .1, n.a = e.a, n.tag = e.tag, n.fx.length = 0, n.spikes.length = 0, n.disc = null, n.ready = -1, n.lph = 0, n.lt = 0, n.fade = 0;
		let i = this._crystalAt();
		n.fromX = i.x, n.fromZ = i.z;
		let a = this.rng.next() * 2147483647 | 0, { x: o, z: s } = n, c = n.y + d, u = this.fx, p = (e) => (e && n.fx.push(e), e), h = this.stage.frost;
		if (t === "blizzard") {
			let e = r.skill;
			n.gf = h.add({
				x: o,
				z: s,
				radius: e.r * 1.1,
				seed: a
			}), p(u.add({
				frame: "partyGlyphFrost",
				mode: "flat",
				x: o,
				y: c,
				z: s,
				size: 2,
				sizeTo: e.r * 2,
				grow: .35,
				rot: n.a,
				spin: .5,
				color: f.glyph,
				life: e.duration + .3,
				fadeIn: .2,
				fadeOut: .4,
				alpha: l
			})), p(u.add({
				frame: "partySwirl",
				mode: "flat",
				x: o,
				y: c + 2,
				z: s,
				size: 2,
				sizeTo: e.r * 1.7,
				grow: .6,
				rot: n.a + 1.7,
				spin: 2.4,
				color: f.swirl,
				life: e.duration,
				fadeIn: .4,
				fadeOut: .6,
				fps: 6,
				loop: !0,
				alpha: .75,
				soft: .6
			})), p(u.add({
				frame: "partySwirl",
				mode: "flat",
				x: o,
				y: c + 1.1,
				z: s,
				size: 1.5,
				sizeTo: e.r * 1.05,
				grow: .5,
				rot: n.a - .6,
				spin: 3.6,
				color: f.swirl,
				life: e.duration - .1,
				fadeIn: .35,
				fadeOut: .5,
				fps: 6,
				loop: !0,
				alpha: .8,
				soft: .5
			}));
		} else {
			let e = r.skill2;
			n.gf = h.add({
				x: o,
				z: s,
				radius: e.r * 1.15,
				seed: a
			}), n.disc = p(u.add({
				frame: "partyIceGlow",
				mode: "flat",
				x: o,
				y: c - .03,
				z: s,
				size: e.r * .4,
				sizeTo: e.r * 1,
				grow: e.delay,
				rot: n.a,
				color: n.discRgb,
				life: e.delay + e.hold + .4,
				alpha: 0,
				soft: m.soft
			})), p(u.add({
				frame: "partyGlyphFrost",
				mode: "flat",
				x: o,
				y: c,
				z: s,
				size: 1.2,
				sizeTo: e.r * 2,
				grow: e.delay,
				rot: n.a,
				spin: 1.6,
				color: f.glyph,
				life: e.delay + e.hold + .2,
				fadeIn: .1,
				fadeOut: .3,
				alpha: l
			})), this._planTomb(n, e), this._mist(o, n.y, s, 1.6, .9);
		}
		let g = this._fields.find((e) => e !== n && e.on && e.light);
		g ? (n.light = g.light, g.light = null) : n.light = this._acquireLight();
	}
	_planTomb(e, t) {
		let n = this.sys, r = this.rng, i = Math.ceil(t.spikes * .6), a = t.spikes - i, o = Math.atan2(e.fromZ - e.z, e.fromX - e.x), s = (e) => Math.abs(N(e - o)) / Math.PI, c = n.fx, l = c ? c.viewX : 0, u = c ? c.viewZ : -1, d = (e) => E.size * (1 - E.nearLow * Math.max(0, -(Math.cos(e) * l + Math.sin(e) * u))), f = [];
		for (let r of n.enemies) r.alive && Math.hypot(r.position.x - e.x, r.position.z - e.z) < t.r + 1 && f.push(r.position);
		let p = (e, t) => f.some((n) => {
			let r = n.x - e, i = n.z - t, a = r * l + i * u;
			return a > -.3 && a < E.screenDepth && Math.abs(r * u - i * l) < E.screenSide;
		}), m = (t, i, a, o, s, c, l, u) => {
			let d = t - e.x, f = i - e.z, m = Math.hypot(d, f);
			if (m > .001) d /= m, f /= m;
			else {
				let e = r.next() * Math.PI * 2;
				d = Math.cos(e), f = Math.sin(e);
			}
			let h = (r.next() - .5) * .24;
			e.spikes.push({
				x: t,
				y: n.groundAt(t, i) - E.sink,
				z: i,
				height: p(t, i) ? a * E.screenLow : a,
				radius: o,
				yaw: r.next() * Math.PI * 2,
				tiltX: d * s - f * h,
				tiltZ: f * s + d * h,
				seed: r.next() * 2147483647 | 0,
				start: c,
				h: -1,
				order: l,
				small: u,
				dx: d,
				dz: f,
				r: 0
			});
		};
		for (let n = 0; n < i; n++) {
			let a = e.a + n * Math.PI * 2 / i + (r.next() - .5) * .2, o = t.r * (.78 + .08 * r.next()), c = s(a), l = t.delay - E.outer + E.sweep * c, u = d(a);
			m(e.x + Math.cos(a) * o, e.z + Math.sin(a) * o, (1.15 + .45 * r.next()) * u, .24 + .08 * r.next(), .3 + .2 * r.next(), l, c, !1);
			let f = a + (r.next() < .5 ? -1 : 1) * (.15 + .08 * r.next()), p = o * (.9 + .14 * r.next());
			m(e.x + Math.cos(f) * p, e.z + Math.sin(f) * p, (.55 + .25 * r.next()) * u, .14 + .05 * r.next(), .35 + .25 * r.next(), l + .03, c, !0);
		}
		for (let n = 0; n < a; n++) {
			let i = e.a + (n + .5) * Math.PI * 2 / a + (r.next() - .5) * .25, o = t.r * (.38 + .08 * r.next()), c = s(i);
			m(e.x + Math.cos(i) * o, e.z + Math.sin(i) * o, (1.5 + .4 * r.next()) * d(i) * E.innerLow, .28 + .08 * r.next(), .16 + .12 * r.next(), t.delay - E.inner + E.innerSweep * c, c, !1);
		}
		m(e.x + l * E.centreBack + (r.next() - .5) * .2, e.z + u * E.centreBack + (r.next() - .5) * .2, 2.2 * E.size, .45, .06, t.delay - E.rise * E.peakAt, .5, !1);
	}
	_closeField(e) {
		for (let t of e.fx) this.fx.kill(t);
		e.fx.length = 0, e.disc = null;
		for (let t = 0; t < e.tipFx.length; t++) e.tipFx[t] && this.fx.kill(e.tipFx[t]), e.tipFx[t] = null;
		let { crystals: t, frost: n } = this.stage;
		for (let n of e.spikes) n.h >= 0 && t.free(n.h), n.h = -1;
		e.spikes.length = 0, e.gf >= 0 && n.free(e.gf), e.gf = -1, e.light && (e.light.off(), e.light.release()), e.light = null, e.on = !1;
	}
	_stepBlizzard(e, t) {
		let n = this.mc.kit.skill, r = this.sys, i = this.rng, a = e.t < n.duration, o = Math.floor(e.t * 10);
		if (o !== e.m && a) {
			e.m = o;
			let t = e.a + o * 2.39996, i = n.r * (.25 + .6 * (o * 7 % 10 / 10)), a = e.x + Math.cos(t) * i, s = e.z + Math.sin(t) * i, c = r.groundAt(a, s);
			r.burst("partySnowStreak", e.x - 1.2, e.y + 4.6, e.z - .4, 10), r.burst("partySnowfall", a, c + 2.8, s, 9), o % 2 == 0 && r.burst("partyFrostShards", a, c + .9, s, 2), o % 3 == 0 && r.burst("partyFrostGlint", a, c + 1.2, s, 3);
		}
		if (e.t >= n.duration + D.recede + .2) {
			this._closeField(e);
			return;
		}
		if (a) {
			if (e.flake -= t, e.t < n.duration - .3 && e.flake <= 0 && this._flakes.length < D.flakes) {
				e.flake += .07;
				let t = this.fx.add({
					frame: "partyIceFlake",
					mode: "billboard",
					x: e.x,
					y: e.y,
					z: e.z,
					scale: .55 + .25 * i.next(),
					color: f.flake,
					life: Infinity,
					frames: [i.next() < .5 ? 0 : 1],
					rot: i.next() * 6.3,
					spin: 2 + 2 * i.next(),
					alpha: 0,
					halo: 1
				});
				if (t) {
					let r = n.r * (.45 + .5 * i.next());
					this._flakes.push({
						rec: t,
						fl: e,
						a: i.next() * Math.PI * 2,
						r,
						y: .7 + 2 * i.next(),
						w: 2.6 * (n.r / (r + 1)),
						vy: -.45 - .4 * i.next(),
						age: 0,
						life: 1.1 + .5 * i.next()
					});
				}
			}
			if (e.near -= t, e.near <= 0 && e.t < n.duration - .6) {
				e.near += .2 + .15 * i.next();
				let t = 0;
				for (let e of this._drifts) e.rec.frame === "partyIceBokeh" && t++;
				t < D.near && this._nearFlake(e);
			}
			if (e.hail -= t, e.hail <= 0 && e.t < n.duration - .4) {
				e.hail += .11;
				let t = this._windDir(), a = i.next() * Math.PI * 2, o = n.r * Math.sqrt(i.next()) * .9, s = e.x + Math.cos(a) * o, c = e.z + Math.sin(a) * o, l = .42, u = t.x * 3.2, d = t.z * 3.2, f = r.groundAt(s, c);
				this._shard(s - u * l, f + 2.9, c - d * l, u, -5.5, d, .32 + .14 * i.next(), .9);
			}
			if (e.mist -= t, e.mist <= 0 && e.t < n.duration - .5) {
				e.mist += .4;
				let t = i.next() * Math.PI * 2, a = n.r * (.7 + .35 * i.next()), o = e.x + Math.cos(t) * a, s = e.z + Math.sin(t) * a;
				this._mist(o, r.groundAt(o, s), s, 1.7 + .8 * i.next(), 1.5);
			}
		}
	}
	_stepTomb(e) {
		let t = this.mc.kit.skill2, n = this.sys, r = 1e-6;
		if (e.n < 2) {
			for (let t of e.spikes) if (!(t.h !== -1 || e.t < t.start - r)) {
				if (t.h = this.stage.crystals.spawn(t), t.h < 0) {
					t.h = -2;
					continue;
				}
				t.small || (n.burst("partyIceChunks", t.x, t.y + .2, t.z, 2), n.burst("partyFrostShards", t.x, t.y + .5, t.z, 2), e.m < 0 && (e.m = 1, n.sfxAt("iceSpike", e.x, e.z, {
					volume: .6,
					pitch: 1.25
				})));
			}
		}
		if (e.n === 0 && e.t >= t.delay - r) {
			e.n = 1;
			let r = this.fx.add({
				frame: "partyRing",
				mode: "flat",
				x: e.x,
				y: e.y + d + .03,
				z: e.z,
				size: 2,
				sizeTo: t.r * 2.3,
				grow: .3,
				color: f.ring,
				life: .4,
				fadeOut: .2,
				fps: 0,
				alpha: u,
				soft: .3
			});
			r && e.fx.push(r), n.burst("partyFrostShards", e.x, e.y + .6, e.z, 10), n.burst("partyIceChunks", e.x, e.y + .3, e.z, 8), n.burst("partyFrostGlint", e.x, e.y + 1.4, e.z, 6);
		}
		e.n === 1 && e.t >= t.delay + t.hold - r && (e.n = 2, this._shatterTomb(e), n.burst("partyIceChunks", e.x, e.y + .6, e.z, 10), n.burst("partyFrostGlint", e.x, e.y + 1, e.z, 6)), e.t >= t.delay + t.hold + E.recede + .1 && this._closeField(e);
	}
	_shatterTomb(e) {
		let t = this.rng, n = this.sys;
		for (let r of e.spikes) {
			if (r.h < 0) continue;
			this.stage.crystals.free(r.h), r.h = -1;
			let e = r.small ? 1 : r.height > 2 ? 4 : 2;
			for (let n = 0; n < e; n++) {
				let e = .25 + .55 * t.next(), n = r.x + r.tiltX * e, i = r.z + r.tiltZ * e, a = r.y + r.height * e, o = 1.2 + 2.2 * t.next(), s = (t.next() - .5) * 2, c = r.dx * o - r.dz * s, l = r.dz * o + r.dx * s, u = r.small ? .5 + .15 * t.next() : .7 + .35 * t.next();
				this._shard(n, a, i, c, 2.2 + 2.6 * t.next(), l, u, E.shardLife[0] + (E.shardLife[1] - E.shardLife[0]) * t.next());
			}
			!r.small && t.next() < .5 && n.burst("partyIcePuff", r.x, r.y + .3, r.z, 2);
		}
		this._mist(e.x, e.y, e.z, 2.4, 1.2);
	}
	_nearFlake(e) {
		let t = this.rng, n = r.uCameraPosition.value, i = .45 + .17 * t.next(), a = this.sys.fx, o = a ? a.viewX : 0, s = a ? a.viewZ : -1, c = (t.next() < .5 ? -1 : 1) * (2.2 + 3 * t.next()), l = e.x - s * c, u = e.z + o * c, d = e.y + 1.2 + 1.5 * t.next(), p = l + (n.x - l) * i, m = d + (n.y - d) * i, h = u + (n.z - u) * i, g = this.fx.add({
			frame: "partyIceBokeh",
			mode: "billboard",
			x: p,
			y: m,
			z: h,
			scale: .24 + .16 * t.next(),
			color: f.flakeNear,
			life: Infinity,
			alpha: 0
		});
		if (!g) return;
		let _ = this._windDir();
		this._drifts.push({
			rec: g,
			vx: _.x * 1.4,
			vy: -1.1,
			vz: _.z * 1.4,
			age: 0,
			life: 1.1 + .4 * t.next()
		});
	}
	_mist(e, t, n, r, i) {
		let a = this.rng, o = this.fx.add({
			frame: "partyIceMist",
			mode: "billboard",
			x: e,
			y: t + r * .16,
			z: n,
			size: r,
			color: f.mist,
			life: Infinity,
			frames: [Math.floor(a.next() * 3)],
			alpha: 0,
			soft: .85
		});
		if (!o) return;
		let s = this._windDir();
		this._drifts.push({
			rec: o,
			vx: s.x * .45,
			vy: .08,
			vz: s.z * .45,
			age: 0,
			life: i
		});
	}
	_windDir() {
		let e = r.uWind.value, t = Math.hypot(e.x, e.y) || 1, n = this._wind;
		return n.x = e.x / t, n.z = e.y / t, n;
	}
	_shard(e, t, n, r, i, a, o, s) {
		if (this._shards.length >= S) return;
		let c = this.rng, l = Math.floor(c.next() * 4), u = c.next() * Math.PI * 2, d = this.fx.add({
			frame: "partyIceShard",
			mode: "billboard",
			x: e,
			y: t,
			z: n,
			scale: o,
			rot: u,
			color: f.shard,
			life: Infinity,
			frames: [l]
		});
		if (!d) return;
		let p = this.fx.add({
			frame: "partyIceShardLit",
			mode: "billboard",
			x: e,
			y: t,
			z: n,
			scale: o,
			rot: u,
			color: f.shardLit,
			life: Infinity,
			frames: [l],
			back: x,
			halo: 1
		});
		this._shards.push({
			body: d,
			lit: p,
			x: e,
			y: t,
			z: n,
			vx: r,
			vy: i,
			vz: a,
			spin: (c.next() - .5) * 14,
			age: 0,
			life: s,
			bounced: !1,
			half: .2 * o
		});
	}
	step(e) {
		for (let t of this._fields) t.on && (t.t += e, t.kind === "blizzard" ? this._stepBlizzard(t, e) : this._stepTomb(t));
		this._stepFlakes(e), this._stepDrifts(e), this._stepShards(e), this.fx.step(e);
	}
	_stepFlakes(e) {
		let t = this._flakes;
		for (let n = t.length - 1; n >= 0; n--) {
			let r = t[n];
			if (r.age += e, r.age >= r.life) {
				this.fx.kill(r.rec), t[n] = t[t.length - 1], t.pop();
				continue;
			}
			r.a += r.w * e, r.r *= Math.exp(-.15 * e), r.y = Math.max(.15, r.y + r.vy * e);
			let i = r.rec;
			i.x = r.fl.x + Math.cos(r.a) * r.r, i.z = r.fl.z + Math.sin(r.a) * r.r, i.y = r.fl.y + r.y, i.alpha = A(Math.min(r.age / .15, (r.life - r.age) / .3));
		}
	}
	_stepDrifts(e) {
		let t = this._drifts;
		for (let n = t.length - 1; n >= 0; n--) {
			let r = t[n];
			if (r.age += e, r.age >= r.life) {
				this.fx.kill(r.rec), t[n] = t[t.length - 1], t.pop();
				continue;
			}
			let i = r.rec;
			i.x += r.vx * e, i.y += r.vy * e, i.z += r.vz * e;
			let a = i.frame === "partyIceMist";
			i.alpha = A(Math.min(r.age / (a ? .3 : .2), (r.life - r.age) / (a ? .55 : .35))) * (a ? .85 : 1);
		}
	}
	_stepShards(e) {
		let t = this.sys, n = this._shards;
		for (let r = n.length - 1; r >= 0; r--) {
			let i = n[r];
			if (i.age += e, i.age >= i.life) {
				this.fx.kill(i.body), this.fx.kill(i.lit), n[r] = n[n.length - 1], n.pop();
				continue;
			}
			i.vy -= C * e, i.x += i.vx * e, i.y += i.vy * e, i.z += i.vz * e;
			let a = t.groundAt(i.x, i.z);
			if (i.y - i.half <= a && i.vy <= 0) {
				if (i.y = a + i.half, !i.bounced) i.bounced = !0, i.vy = -i.vy * .3, i.vx *= .45, i.vz *= .45, i.spin *= .4, t.burst("partyIcePuff", i.x, a + .08, i.z, 2);
				else {
					i.vy = 0;
					let t = Math.exp(-10 * e);
					i.vx *= t, i.vz *= t, i.spin *= t;
				}
			}
			let o = A((i.life - i.age) / E.dissolve);
			j(i.body, i, e, o), i.lit && j(i.lit, i, e, o);
		}
	}
	visuals(e) {
		for (let e of this._lances) e.body && M(e.body, e.ms, 0), e.lit && M(e.lit, e.ms, b);
		let t = 0;
		for (let e of this._fields) e.on && (e.kind === "blizzard" ? t = Math.max(t, this._stormLook(e)) : this._tombLook(e));
		if (this.gust = this._settling ? 0 : t, this._shellsLook(), this._sparksLook(e), this._settling) return;
		let n = this.mc, i = n.move, a = i === "frostLance" || i === "blizzard" || i === "glacialTomb" ? g[i] : null, o = n.kit, c = i === "frostLance" ? o.basic.release : i === "blizzard" ? o.skill.at : i === "glacialTomb" ? o.skill2.at : 0, l = !!a && !n.down && n.frame < c, u = 0, d = 0;
		if (l && (d = k(n.t / s(c)), u = a.peak * d * (1 + .08 * Math.sin(Math.PI * 2 * 9 * n.t))), this._kick > 0 && (this.glow = Math.max(this.glow, this._kick), this._kick = 0), this.glow = n.down ? 0 : u >= this.glow ? u : u + (this.glow - u) * Math.exp(-e / g.tau), this.glow < .01 && (this.glow = 0), this._writeGlow(this.glow), l) {
			let e = this._crystalAt();
			this._star ||= this.fx.add({
				frame: "partySunburst",
				mode: "billboard",
				x: e.x,
				y: e.y,
				z: e.z,
				scale: .3,
				color: f.star,
				life: Infinity,
				frames: [0],
				spin: 2,
				back: -.25,
				halo: 1
			});
			let t = this._star;
			t && (t.x = e.x, t.y = e.y, t.z = e.z, t.s0 = t.s1 = .3 + .25 * d, t.alpha = Math.min(1, .25 + d));
		} else this._star &&= (this.fx.kill(this._star), null);
		let m = this.sys.fx;
		this.fx.write(m ? m.viewX : 0, m ? m.viewZ : -1, 1 - p * r.uNight.value);
	}
	_tombLook(e) {
		let t = this.mc.kit.skill2, { crystals: n, frost: r } = this.stage, i = e.t, a = t.delay, o = t.delay + t.hold, s = k((i - (o - E.crackT)) / E.crackT), c = i >= a ? Math.exp(-(i - a) / .15) : 0, l = this._crysP, u = y(v.crystal);
		for (let t of e.spikes) {
			if (t.h < 0) continue;
			let e = a + .08 + .3 * t.order, r = e + .42;
			l.rise = P((i - t.start) / E.rise), l.crack = s, l.glint = A(i < r ? (i - e) / E.glintT : (i - r) / E.glintT);
			let o = Math.max(0, i - t.start - E.rise * E.peakAt);
			l.glow = (1 + .35 * Math.exp(-o / .1) + .2 * c + .5 * s) * u, n.set(t.h, l), t.r = l.rise;
		}
		if (e.gf >= 0) {
			let t = a - E.outer, n = this._frostP;
			e.ready < 0 && r.ready(e.gf) && (e.ready = i);
			let s = e.ready;
			n.spread = i < t ? .12 * k(i / t) : .12 + .88 * k((i - t) / (E.outer + .25)), n.fade = k((i - o) / E.recede), n.cracks = s < 0 ? 0 : k((i - s) / Math.max(.05, a - E.crackLead - s)), n.glow = (1 + .8 * c) * y(v.glow), n.crackFrom.x = e.fromX, n.crackFrom.z = e.fromZ, r.set(e.gf, n), e.fade = n.fade;
		}
		let d = e.disc;
		if (d) {
			let t = k(i / a), n = 1 - k((i - a) / E.discOut), r = .35 + .65 * t;
			for (let t = 0; t < 3; t++) e.discRgb[t] = m.rgb[t] * r;
			d.alpha = m.alpha * t * n;
		}
		let p = i < a && e.gf >= 0 ? r.crackTips(e.gf, this._tips) : 0;
		for (let t = 0; t < e.tipFx.length; t++) {
			let n = e.tipFx[t];
			if (!n) continue;
			if (t >= p) {
				this.fx.kill(n), e.tipFx[t] = null;
				continue;
			}
			let r = this._tips[t];
			n.x = r.x, n.y = r.y + .3, n.z = r.z;
		}
		for (let t = 0; t < p; t++) {
			if (e.tipFx[t]) continue;
			let n = this._tips[t];
			e.tipFx[t] = this.fx.add({
				frame: "partySunburst",
				mode: "billboard",
				x: n.x,
				y: n.y + .3,
				z: n.z,
				scale: .42,
				color: f.star,
				life: Infinity,
				frames: [0],
				spin: 5,
				back: -.3,
				halo: 1
			});
		}
		let h = e.light;
		if (h) {
			let t = this._lightP, n = y(v.light);
			if (t.color = _.tombColor, t.decay = 1, i < a) {
				let r = p > 0 ? this._tips[0] : null;
				t.intensity = Math.min(_.cap, _.charge * (.3 + .7 * k(i / a)) * n), t.distance = _.chargeDistance, r ? h.set(r.x, r.y + _.chargeLift, r.z, t) : h.set(e.x, e.y + _.chargeLift * 2, e.z, t);
			} else if (e.n >= 2 && i > o + .5) h.off(), h.release(), e.light = null;
			else {
				let r = e.n < 2 ? 1 : 2;
				e.lph === r ? e.lt += this._frameDt : (e.lph = r, e.lt = 0);
				let a, s;
				r === 1 ? (s = Math.exp(-e.lt / _.flashTau), a = _.hold * n + (_.flash - _.hold) * s * y(v.flash)) : (s = Math.exp(-e.lt / .1), a = _.shatter * s * y(v.flash) + _.hold * (1 - k((i - o) / .4)) * (1 - s) * n), t.decay = _.holdDecay + (1 - _.holdDecay) * s, t.intensity = Math.min(_.cap, a), t.distance = _.tombDistance, h.set(e.x, e.y + _.tombLift, e.z, t);
			}
		}
	}
	_stormLook(t) {
		let n = this.mc.kit.skill, r = t.t, i = k(r / .35) * (1 - k((r - n.duration) / .5));
		if (t.gf >= 0) {
			let e = this._frostP;
			e.spread = .1 + .9 * k(r / n.duration), e.fade = k((r - n.duration) / D.recede), e.cracks = 0, e.glow = y(v.glow), e.crackFrom.x = t.x, e.crackFrom.z = t.z, this.stage.frost.set(t.gf, e), t.fade = e.fade;
		}
		let a = t.light;
		if (a) {
			if (r > n.duration + .6) a.off(), a.release(), t.light = null;
			else {
				let n = .78 + .22 * (.6 * Math.sin(r * 23.1) + .4 * Math.sin(r * 37.7 + 1.3)), o = e(Math.floor(r * 6), t.tag, 77) > .8 ? 1.5 : 1, s = this._lightP;
				s.color = _.stormColor, s.decay = 1, s.intensity = Math.min(_.cap, _.storm * i * n * o * y(v.light)), s.distance = _.stormDistance, a.set(t.x + Math.cos(r * 2.4) * .9, t.y + _.stormLift, t.z + Math.sin(r * 2.4) * .9, s);
			}
		}
		return D.gust * k(r / D.gustRise) * (1 - k((r - n.duration) / D.gustFall)) * (.85 + .15 * Math.sin(r * 4.3));
	}
	_shellsLook() {
		let e = this.sys, n = this.mc.kit.skill2, r = !1;
		for (let e of this._fields) e.on && e.kind === "glacialTomb" && e.n >= 1 && (r = !0);
		if (r && !this._settling) {
			let r = e.enemies;
			for (let i = 0; i < r.length; i++) {
				let a = r[i];
				if (!a.alive || !a.frozen || !a.sprite.visible || a.iceShell || this._shells.has(a)) continue;
				let o = a.position, s = !1;
				for (let e of this._fields) e.on && e.kind === "glacialTomb" && e.n >= 1 && Math.hypot(o.x - e.x, o.z - e.z) <= n.r + a.radius + .25 && (s = !0);
				if (!s) continue;
				let c = a.def.body, l = Math.max(.6, c[1] - c[0]) + .2, u = l / (38 / 16), d = e.bodyBase(a) + c[0] + l / 2 - .12, p = -(a.radius * .6 + .12), m = t(String(a.uid)) & 1, h = this.fx.add({
					frame: "partyIceShell",
					mode: "billboard",
					x: o.x,
					y: d,
					z: o.z,
					scale: u * 1.15,
					scaleTo: u,
					grow: .09,
					color: f.shell,
					life: Infinity,
					frames: [m],
					back: p,
					follow: o
				});
				if (!h) continue;
				let g = [...f.shellLit], _ = this.fx.add({
					frame: "partyIceShellLit",
					mode: "billboard",
					x: o.x,
					y: d,
					z: o.z,
					scale: u * 1.15,
					scaleTo: u,
					grow: .09,
					color: g,
					life: Infinity,
					frames: [m],
					back: p + x,
					follow: o,
					halo: 1
				});
				a.iceShell = !0, this._shells.set(a, {
					e: a,
					body: h,
					lit: _,
					rgb: g,
					ph: this.rng.next()
				});
			}
		}
		let i = e.clock;
		for (let e of this._shells.values()) {
			let t = e.e;
			if (t.alive && t.frozen && t.sprite.visible) {
				let t = (i / .9 + e.ph) % 1, n = 1 + .55 * Math.max(0, 1 - Math.abs(t - .5) / .08);
				for (let t = 0; t < 3; t++) e.rgb[t] = f.shellLit[t] * n;
				e.body.alpha = this._back, e.lit && (e.lit.alpha = this._back);
				continue;
			}
			this._shatterShell(e), this._shells.delete(t);
		}
	}
	_shatterShell(e) {
		e.e.iceShell = !1;
		let t = this.rng, n = this.sys, r = e.body, i = n.fx, a = r.x + (i ? i.viewX : 0) * r.back, o = r.z + (i ? i.viewZ : -1) * r.back, s = r.s1 * (38 / 16);
		this.fx.kill(e.body), this.fx.kill(e.lit);
		for (let e = 0; e < 6; e++) {
			let e = t.next() * Math.PI * 2, n = 1.3 + 1.6 * t.next();
			this._shard(a + Math.cos(e) * .25, r.y + (t.next() - .5) * s * .6, o + Math.sin(e) * .25, Math.cos(e) * n, 1.8 + 1.8 * t.next(), Math.sin(e) * n, .45 + .25 * t.next(), .8 + .3 * t.next());
		}
		n.burst("partyIcePuff", a, r.y, o, 3);
	}
	_sparksLook(e) {
		let t = this._sparks, n = this._lightP;
		for (let r = t.length - 1; r >= 0; r--) {
			let i = t[r];
			if (i.t += e, i.t >= _.impactT || !i.light.held) {
				i.light.off(), i.light.release(), t[r] = t[t.length - 1], t.pop();
				continue;
			}
			let a = 1 - i.t / _.impactT;
			n.color = _.impactColor, n.decay = 1, n.intensity = _.impact * a * a * y(v.light), n.distance = _.impactDistance, i.light.set(i.x, i.y, i.z, n);
		}
	}
	_writeGlow(e) {
		let t = Math.round(e * 100) / 100;
		t !== this._glowShown && (this._glowShown = t, this.mc.member.sprite?.setGlow(h[0], h[1], h[2], t));
	}
	_crystalAt() {
		let e = this.mc, t = e.member.position, n = this._crys, i = this._crystal?.[e._lastRow]?.[e._lastCol] ?? null, a = i ? i.right : .3, o = i ? i.up : 1.7, s = r.uCameraYaw.value;
		return n.x = t.x + Math.cos(s) * a, n.y = t.y + o, n.z = t.z - Math.sin(s) * a, n;
	}
	info() {
		return {
			effects: this.fx.count,
			glow: +this.glow.toFixed(3),
			star: !!this._star,
			lances: this._lances.length,
			fields: this._fields.filter((e) => e.on).map((e) => e.kind),
			flakes: this._flakes.length,
			drifts: this._drifts.length,
			shards: this._shards.length,
			shells: this._shells.size,
			crystals: this._fields.reduce((e, t) => e + t.spikes.filter((e) => e.h >= 0).length, 0),
			frost: this._fields.filter((e) => e.on && e.gf >= 0).length,
			gust: +this.gust.toFixed(2),
			lights: {
				...this.lights,
				held: this._fields.filter((e) => e.on && e.light?.held).length + this._sparks.filter((e) => e.light.held).length
			}
		};
	}
};
//#endregion
export { I as IceSpellFx, F as IceStage };
