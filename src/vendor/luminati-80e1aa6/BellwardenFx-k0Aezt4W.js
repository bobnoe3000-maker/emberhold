import { l as e, r as t } from "./math-Du_SWpiD.js";
import { r as n } from "./ThawField-BqwvXI8W.js";
import "./engine-FVAIXRjf.js";
import { n as r } from "./Particles-DKjyxRwN.js";
import { t as i } from "./SpectralBells-Bryhc3RH.js";
import { t as a } from "./glowSpots-q5RSKfDQ.js";
//#region src/game/combat/BellwardenFx.js
var o, s = Object.freeze({
	bellSpark: {
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
		count: 7,
		life: [.14, .3],
		size: [.05, .08],
		sizeEnd: .5,
		spawnSize: [
			.4,
			.4,
			.4
		],
		burstSpeed: [3, 7],
		burstUp: [.8, 2.4],
		gravity: 9,
		drag: 2.5,
		colors: [
			"#ffb84a",
			"#e8892a",
			"#ffd88a"
		],
		hdr: 1.3,
		alpha: 1
	},
	bellShimmer: {
		mode: "burst",
		motion: "emit",
		texture: "star",
		blending: "additive",
		variants: 1,
		lit: 0,
		pulse: 1,
		tumble: 0,
		aspect: 1,
		streak: 0,
		fade: [.05, .3],
		twinkle: 0,
		blink: 0,
		nightVisibility: 0,
		count: 6,
		life: [.4, .8],
		size: [.1, .18],
		sizeEnd: .6,
		spawnSize: [
			1.2,
			.6,
			1.2
		],
		velocity: [
			0,
			.8,
			0
		],
		burstSpeed: [.6, 1.8],
		burstUp: [.3, 1],
		gravity: .3,
		drag: 2.2,
		spin: [.5, 2],
		color: "#ffd27a",
		hdr: 1.2,
		alpha: 1
	},
	bellPuff: {
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
		count: 10,
		life: [.45, .85],
		size: [.24, .4],
		sizeEnd: 2,
		spawnSize: [
			.9,
			.08,
			.9
		],
		burstSpeed: [2.2, 4.6],
		burstUp: [.3, 1.1],
		gravity: -.3,
		drag: 4,
		spin: [.4, 2],
		color: "#d6dbe2",
		alpha: .55
	}
}), c = Object.freeze({
	ring: Object.freeze([
		1.3,
		.7,
		.12
	]),
	ringEcho: Object.freeze([
		1.05,
		.52,
		.09
	]),
	wave: Object.freeze([
		1.3,
		.74,
		.14
	]),
	bronze: Object.freeze([
		1,
		.5,
		.13
	]),
	crack: Object.freeze([
		.55,
		.3,
		.1
	]),
	mark: Object.freeze([
		1.35,
		.76,
		.14
	]),
	note: Object.freeze([
		1.3,
		.8,
		.2
	]),
	peal: Object.freeze([
		1.3,
		.72,
		.13
	])
}), l = Object.freeze({
	lowSun: .3,
	lo: .3,
	hi: .65
}), u = () => {
	let e = (n.uSunDirection.value.y - l.lo) / (l.hi - l.lo), t = 1 - (e <= 0 ? 0 : e >= 1 ? 1 : e * e * (3 - 2 * e));
	return 1 - l.lowSun * t * (1 - n.uNight.value);
}, d = Object.freeze({
	warm: .4,
	flash: .25,
	glow: .8
}), f = (e) => e + (1 - e) * n.uNight.value, p = Object.freeze({
	gold: [
		1.5,
		1,
		.42
	],
	amber: [
		1.5,
		.82,
		.3
	],
	heal: [
		.5,
		1.3,
		.45
	],
	tHold: 1,
	tFlash: 3.2,
	tTau: .14,
	tLift: 2.2,
	tFront: 1.1,
	tDist: 6.5,
	tFade: .3,
	cGather: 1.6,
	cNote: 3.2,
	cChord: 5.2,
	cTau: .12,
	cLift: 2.8,
	cDist: 7,
	cChordDist: 11,
	slamI: 3.2,
	slamT: .16,
	pealI: 2.6,
	pealT: .2,
	sparkLift: 2,
	sparkDist: 4.5,
	draughtI: 2,
	draughtTau: .25,
	draughtT: .5,
	draughtLift: 2,
	draughtDist: 3.5,
	cap: 6,
	after: .1
}), m = Object.freeze({
	tollH: 1.9,
	tollHover: .35,
	fallFrom: 4.5,
	swing: .3,
	swingW: 7.2,
	swingDamp: 2.4,
	strikeTau: .22,
	carH: 1.45,
	carHover: .25,
	carFrom: 6,
	carSwing: .22,
	ghost: .06,
	appear: .08,
	dissolve: .3,
	chordHold: .35
}), h = Object.freeze({
	tollN: 8,
	tollScale: .78,
	lift: .32,
	waveY: .7,
	tollWaves: 6,
	tollOpen: .32,
	tollLife: .5,
	echoDelay: .12,
	chordN: 16,
	chordWaves: 10,
	chordScale: 1,
	chordOpen: .42,
	chordLife: .65,
	arcR: 84 / 16
}), g = Object.freeze({
	rgb: Object.freeze([
		1,
		.62,
		.2
	]),
	tau: .12,
	max: 2.2
}), _ = .25, v = Object.freeze({
	max: 24,
	lift: .4,
	pop: .12
}), y = (e) => e <= 0 ? 0 : e >= 1 ? 1 : e, b = (e) => {
	let t = y(e);
	return t * t * (3 - 2 * t);
}, x = Math.PI * 2, S = () => ({
	rec: null,
	id: 0
}), C = class {
	constructor(e) {
		this.sys = e, r(s), e.marksLook = null, this.bells = new i({ capacity: 8 }), e.scene?.add(this.bells.object), this.directors = [], this._onHit = (e, t, n, r) => {
			if (e && e !== "player") for (let t = 0; t < this.directors.length; t++) this.directors[t].onHit(e, r);
		}, e.events?.on("hit", this._onHit);
	}
	director(e) {
		o = e.bell.M;
		let t = new T(this, e);
		return this.directors.push(t), t;
	}
	drop(e) {
		let t = this.directors.indexOf(e);
		t >= 0 && this.directors.splice(t, 1);
	}
	warmup(e) {
		this.bells.warm();
	}
	endWarmup() {
		this.bells.unwarm();
	}
	update(e, t = !0, n = 0, r = !1) {
		let i = !t && !this.sys.game?.photoMode;
		for (let e = 0; e < this.directors.length; e++) {
			let a = this.directors[e];
			r ? a.settle(n) : i ? a.hush() : t && a.lights(n);
		}
		this.bells.update(e);
	}
	dropLights() {
		for (let e of this.directors) e.dropLights();
	}
	dispose() {
		this.sys.events?.off("hit", this._onHit);
		for (let e of [...this.directors]) e.dispose();
		this.directors.length = 0, this.bells.dispose();
	}
	info() {
		let e = this.directors[0] ?? null, t = e ? e.info() : null;
		return {
			directors: this.directors.length,
			bells: this.bells.count,
			triangles: this.bells.triangles,
			frames: Object.keys(E).filter((e) => Object.hasOwn(this.sys.atlasFrames ?? {}, e)).length,
			lights: t ? {
				held: t.lights.held,
				asks: t.lights.acquired + t.lights.refused,
				refused: t.lights.refused
			} : {
				held: 0,
				asks: 0,
				refused: 0
			},
			look: t
		};
	}
}, w = () => ({
	h: -1,
	x: 0,
	y: 0,
	z: 0,
	ground: 0,
	t: 0,
	swing: 0,
	swingV: 0,
	sx: 1,
	sz: 0,
	strike: 0,
	dis: 1,
	phase: "",
	fallT: .15,
	from: 0
}), T = class {
	constructor(n, r) {
		this.stage = n, this.pc = r, this.sys = r.sys, this.hfx = r.hfx, this._spots = a(r.sheet), this._anchor = {
			x: 0,
			y: 0,
			z: 0
		}, this._lp = {
			color: p.gold,
			intensity: 0,
			distance: 6,
			decay: 1,
			flicker: 0
		}, this.lights_ = {
			acquired: 0,
			refused: 0
		}, this.light = null, this.lightOwner = "", this.spark = null, this._sparkKind = "", this._sparkT = 0, this._sparkX = 0, this._sparkY = 0, this._sparkZ = 0, this._initState(), this.rng = new t((e("bell:player") ^ Number(this.sys.seedValue) >>> 0) >>> 0);
	}
	_initState() {
		this._toll = {
			show: w(),
			flash: 0,
			fade: 0,
			ended: !1,
			crack: S(),
			swingSign: 1
		}, this._car = {
			on: !1,
			t: 0,
			bells: [
				0,
				1,
				2,
				3
			].map(() => w()),
			flash: 0,
			chord: !1,
			chordT: 0,
			gather: 0,
			ended: !1
		}, this._combo = {
			on: !1,
			step: 0,
			last: -1,
			swingTag: -1
		}, this.glow = 0, this._kick = 0, this._glowShown = -1, this._marks = /* @__PURE__ */ new Map(), this._settling = !1, this._settleT = 0, this._gc = [
			0,
			0,
			0
		], this._gc2 = [
			0,
			0,
			0
		];
	}
	clear() {
		this._freeBell(this._toll.show);
		for (let e of this._car.bells) this._freeBell(e);
		for (let e of this._marks.values()) this._drop(e.ref);
		this._marks.clear(), this._releaseLights(), this._initState(), this.rng = new t((e("bell:player") ^ Number(this.sys.seedValue) >>> 0) >>> 0), this._writeGlow(0);
	}
	hush() {
		this.light?.held && this.light.off(), this.spark?.held && this.spark.off();
	}
	dropLights() {
		this._releaseLights();
	}
	dispose() {
		this.clear(), this.stage.drop(this);
	}
	settle(e) {
		if (!this._settling) {
			this._settling = !0, this._settleT = 0, this._releaseLights();
			for (let e of this._marks.values()) this._drop(e.ref);
			this._marks.clear();
		}
		this._settleT += e;
		let t = y(this._settleT / _);
		this.hfx.settle(e, _);
		let n = this.stage.bells;
		for (let e of [this._toll.show, ...this._car.bells]) e.h < 0 || (t < 1 ? n.set(e.h, {
			dissolve: Math.max(e.dis, t),
			dissolveDir: 1
		}) : this._freeBell(e));
		t >= 1 && (this._car.on = !1), this.glow !== 0 && (this.glow = 0, this._writeGlow(0));
	}
	_acquire(e) {
		let t = this.sys.world, n = t && typeof t.acquireSpellLight == "function" ? t.acquireSpellLight({ minor: e }) : null;
		return n ? this.lights_.acquired++ : this.lights_.refused++, n;
	}
	_takeField(e) {
		this.light?.held || (this.light = null, this.light = this._acquire(!1)), this.lightOwner = this.light ? e : "";
	}
	_releaseField() {
		this.light && (this.light.off(), this.light.release()), this.light = null, this.lightOwner = "";
	}
	_takeSpark(e, t, n, r) {
		this.spark ||= this._acquire(!0), this.spark && (this._sparkKind = e, this._sparkT = 0, this._sparkX = t, this._sparkY = n, this._sparkZ = r);
	}
	_releaseSpark() {
		this.spark && (this.spark.off(), this.spark.release()), this.spark = null, this._sparkKind = "";
	}
	_releaseLights() {
		this._releaseField(), this._releaseSpark();
	}
	_put(e, t, n, r, i) {
		i.intensity > p.cap && (i.intensity = p.cap), e.set(t, n, r, i);
	}
	_keep(e, t) {
		return e.rec = t, e.id = t ? t.id : 0, t;
	}
	_get(e) {
		return this.hfx.alive(e.rec, e.id) ? e.rec : null;
	}
	_drop(e) {
		let t = this._get(e);
		t && this.hfx.kill(t), e.rec = null, e.id = 0;
	}
	_gold(e, t = this._gc) {
		let n = u();
		return t[0] = e[0] * n, t[1] = e[1] * n, t[2] = e[2] * n, t;
	}
	_freeBell(e) {
		e.h >= 0 && this.stage.bells.free(e.h), e.h = -1, e.phase = "";
	}
	_headAt() {
		let e = this.pc, t = e.player.position, r = this._anchor, i = this._spots?.[e._lastRow]?.[e._lastCol] ?? null;
		if (i) {
			let e = n.uCameraYaw.value;
			r.x = t.x + Math.cos(e) * i.right, r.y = t.y + i.up, r.z = t.z - Math.sin(e) * i.right;
		} else {
			let n = e.player.facing;
			r.x = t.x + n.x * .5, r.y = t.y + .9, r.z = t.z + n.z * .5;
		}
		return r;
	}
	_soundRing(e, t, n, r) {
		let i = this.rng.next() * x, a = this._gold(r.color, [
			0,
			0,
			0
		]);
		for (let o = 0; o < r.n; o++) this.hfx.spawn({
			kind: "orbit",
			frame: "bellArc",
			tag: r.tag ?? "ring",
			x: e,
			y: t + h.lift,
			z: n,
			a0: i + o / r.n * x,
			w: 0,
			r0: r.r0,
			r1: r.r1,
			open: r.open,
			life: r.life,
			s0: r.scale * .85,
			s1: r.scale,
			grow: r.open,
			color: a,
			a: r.a ?? 1,
			fadeOut: r.life * .45,
			index: 0
		});
		let o = r.waves ?? 0;
		if (!o) return;
		let s = this._gold(c.wave, [
			0,
			0,
			0
		]);
		for (let a = 0; a < o; a++) {
			let c = i + (a + .5) / o * x;
			this.hfx.spawn({
				kind: "orbit",
				frame: "bellWave",
				mode: "billboard",
				tag: r.tag ?? "ring",
				x: e,
				y: t + h.waveY,
				z: n,
				a0: c,
				w: 0,
				r0: r.r0 + .2,
				r1: r.r1 * .92,
				open: r.open,
				life: r.life * .85,
				s0: .55,
				s1: .95,
				grow: r.open,
				rot: this._uprightRot(Math.cos(c), Math.sin(c)),
				color: s,
				a: r.a ?? 1,
				fadeOut: r.life * .4,
				index: 0
			});
		}
	}
	_uprightRot(e, t) {
		let r = n.uCameraYaw.value, i = e * Math.cos(r) - t * Math.sin(r), a = -(e * Math.sin(r) + t * Math.cos(r));
		return Math.atan2(-i, a * .55);
	}
	_writeBell(e, t) {
		e.h < 0 || this.stage.bells.set(e.h, {
			x: e.x,
			y: e.y,
			z: e.z,
			swing: e.swing,
			swingX: e.sx,
			swingZ: e.sz,
			strike: e.strike,
			dissolve: e.dis,
			dissolveDir: e.phase === "fading" ? 1 : -1,
			ghost: t,
			glow: 1 + .6 * e.strike
		});
	}
	_swingStep(e, t) {
		if (t <= 0) return;
		let n = m.swingW;
		e.swingV += (-n * n * e.swing - m.swingDamp * e.swingV) * t, e.swing += e.swingV * t, e.strike *= Math.exp(-t / m.strikeTau), e.strike < .005 && (e.strike = 0);
	}
	_ringBell(e, t, n, r) {
		let i = Math.hypot(t, n);
		i > 1e-4 && (e.sx = t / i, e.sz = n / i), e.swingV += r * m.swingW, e.strike = 1;
	}
	windup(e) {
		let t = this._combo;
		t.on = !0, t.step = e.finisher ? 3 : this.pc.combo, t.last = 0;
	}
	swing(e) {
		if (this._settling) return;
		let t = this.pc.player.position, n = this.pc.player.facing;
		this._combo.on = !1, this._kick = e.finisher ? 1.8 : 1.1;
		let r = this._gold(c.bronze);
		e.finisher ? this.hfx.spawn({
			frame: "hammerArc",
			x: t.x + n.x * .85,
			y: t.y + .55,
			z: t.z + n.z * .85,
			dirX: n.x,
			dirZ: n.z,
			rot: Math.PI / 2,
			life: .16,
			strip: .12,
			s0: .95,
			s1: 1.05,
			color: r,
			fadeOut: .06
		}) : this.hfx.spawn({
			frame: "hammerArc",
			x: t.x + n.x * .6,
			y: t.y + .75,
			z: t.z + n.z * .6,
			dirX: n.x,
			dirZ: n.z,
			flip: e.flip,
			life: .2,
			strip: .13,
			s0: 1,
			s1: 1.1,
			color: r,
			fadeOut: .07
		});
	}
	slam(e, t, n) {
		if (this._settling) return;
		let r = this.sys, i = this.pc.player.facing;
		this.hfx.spawn({
			frame: "hammerCrack",
			x: e,
			y: t + .06,
			z: n,
			dirX: i.x,
			dirZ: i.z,
			life: 1.1,
			s0: .9,
			s1: 1.05,
			grow: .08,
			color: this._gold(c.crack),
			fadeOut: .5,
			a: 1
		}), this.hfx.spawn({
			frame: "bellRingS",
			x: e,
			y: t + h.lift,
			z: n,
			life: .32,
			s0: .35,
			s1: o.HAMMER_SLAM.r / 1.39,
			grow: .22,
			color: this._gold(c.ring),
			fadeOut: .14,
			strip: 0,
			index: 0
		}), r.burst("bellPuff", e, t + .05, n, 10), r.burst("bellSpark", e, t + .3, n, 8), r.burst("heroDebris", e, t + .1, n, 8), this._takeSpark("slam", e, t + p.sparkLift, n);
	}
	draught() {
		if (this.spark) return;
		let e = this.pc.player.position;
		this._takeSpark("draught", e.x, e.y + p.draughtLift, e.z);
	}
	onHit(e, t) {
		if (this._settling) return;
		let n = this.pc;
		if (t !== "melee" || n.action !== "attack" || !n._swing) return;
		let r = this.sys, i = e.def.body, a = r.bodyBase(e) + Math.min(1.1, (i[0] + i[1]) * .5), o = n.player.position, s = e.position.x - o.x, c = e.position.z - o.z, l = Math.hypot(s, c) || 1;
		r.burst("bellSpark", e.position.x - s / l * e.radius * .6, a, e.position.z - c / l * e.radius * .6, n.combo === 3 ? 8 : 5), this._combo.swingTag !== n._swing.tag && (this._combo.swingTag = n._swing.tag, r.sfxAt("hammerHit", e.position.x, e.position.z, { volume: n.combo === 3 ? 1 : .85 }));
	}
	detonate(e, t) {
		if (this._settling) return;
		let n = this.sys, r = n.bodyBase(e), i = this._marks.get(e);
		i && (this._drop(i.ref), this._marks.delete(e)), this.hfx.spawn({
			frame: "bellRingS",
			x: e.position.x,
			y: r + h.lift + .05,
			z: e.position.z,
			life: .3,
			s0: .3,
			s1: .5 + .22 * t,
			grow: .18,
			color: this._gold(c.ring),
			fadeOut: .12,
			index: t >= 3 ? 0 : 1
		});
		let a = e.def.body;
		n.burst("bellShimmer", e.position.x, r + Math.min(1.2, (a[0] + a[1]) * .5), e.position.z, 2 + 2 * t);
	}
	peal(e, t = 0) {
		if (this._settling) return;
		let n = this.pc, r = n.player.position, i = n.bell;
		if (e === "ring") {
			let e = i ? i.peal.dirX : n.player.facing.x, a = i ? i.peal.dirZ : n.player.facing.z, s = o.PEAL.r / 4, l = 2 * s + .15;
			this.hfx.spawn({
				frame: "bellPeal",
				x: r.x + e * l,
				y: r.y + .36,
				z: r.z + a * l,
				dirX: e,
				dirZ: a,
				life: .3,
				strip: .26,
				s0: s,
				s1: s,
				color: this._gold(c.peal),
				fadeOut: .08
			});
			let u = this._uprightRot(e, a), d = this._gold(c.wave, [
				0,
				0,
				0
			]);
			for (let t = 0; t < 3; t++) {
				let n = .8 + .8 * t;
				this.hfx.spawn({
					frame: "bellWave",
					mode: "billboard",
					x: r.x + e * n,
					y: r.y + .95,
					z: r.z + a * n,
					vx: e * 8,
					vz: a * 8,
					rot: u,
					life: .32 - .04 * t,
					s0: .6 + .25 * t,
					s1: 1 + .3 * t,
					color: d,
					fadeIn: .02 * t,
					fadeOut: .12,
					index: +(t === 2)
				});
			}
			this._kick = 1.6 + .2 * t, this.sys.burst("bellShimmer", r.x + e * 1.2, r.y + .9, r.z + a * 1.2, 4), this._takeSpark("peal", r.x + e * 1.4, r.y + p.sparkLift, r.z + a * 1.4);
		}
	}
	toll(e, t, n = !1) {
		let r = this._toll, i = r.show, a = this.stage.bells, s = this.sys;
		switch (e) {
			case "raise":
				this._takeField("toll"), r.flash = 0, r.ended = !1, r.fade = 0, i.h >= 0 && i.phase !== "falling" && this._freeBell(i);
				break;
			case "fall":
				if (this._settling) break;
				i.h < 0 && (i.h = a.spawn({
					height: m.tollH,
					palette: 0,
					seed: 7
				})), i.ground = t.y, i.x = t.x, i.z = t.z, i.from = m.fallFrom, i.fallT = (o.TOLL.plant - 2) / 60, i.t = 0, i.y = t.y + m.tollHover + m.tollH + i.from, i.swing = 0, i.swingV = 0, i.strike = 0, i.dis = 1, i.phase = "falling", this._writeBell(i, m.ghost);
				break;
			case "plant": {
				if (this._settling) break;
				i.h < 0 && (i.h = a.spawn({
					height: m.tollH,
					palette: 0,
					seed: 7
				})), i.x = t.x, i.z = t.z, i.ground = t.y, i.y = t.y + m.tollHover + m.tollH, i.dis = 0, i.phase = "standing";
				let e = this.pc.player.facing;
				this._drop(r.crack), this._keep(r.crack, this.hfx.spawn({
					frame: "hammerCrack",
					x: t.x,
					y: t.y + .06,
					z: t.z,
					dirX: e.x,
					dirZ: e.z,
					life: o.TOLL.life + .4,
					s0: 1.1,
					s1: 1.2,
					grow: .1,
					color: this._gold(c.crack),
					fadeOut: .6,
					live: !0
				})), s.burst("bellPuff", t.x, t.y + .05, t.z, 12), s.burst("heroDebris", t.x, t.y + .1, t.z, 6);
				break;
			}
			case "ring": {
				if (this._settling) break;
				let e = this.pc.player.position;
				if (r.flash = 1, i.h >= 0 && i.phase === "standing") {
					let t = n ? i.x - e.x : i.sx * -r.swingSign, a = n ? i.z - e.z : i.sz * -r.swingSign;
					r.swingSign = n ? 1 : -r.swingSign, this._ringBell(i, t, a, n ? m.swing * 1.25 : m.swing);
				}
				let a = o.TOLL.r;
				this._soundRing(t.x, t.y, t.z, {
					n: h.tollN,
					r0: .7,
					r1: a,
					open: h.tollOpen,
					life: h.tollLife,
					scale: h.tollScale,
					color: c.ring,
					waves: h.tollWaves
				}), this._soundRing(t.x, t.y, t.z, {
					n: h.tollN,
					r0: .5,
					r1: a * .82,
					open: h.tollOpen + h.echoDelay,
					life: h.tollLife * .9,
					scale: h.tollScale * .8,
					color: c.ringEcho,
					a: .7
				}), s.burst("bellShimmer", t.x, t.y + m.tollHover + .3, t.z, n ? 8 : 5);
				break;
			}
			case "end":
				r.ended = !0, i.h >= 0 && i.phase === "standing" && (i.phase = "fading", i.t = 0, s.burst("heroMote", i.x, i.y - m.tollH * .5, i.z, 4)), this._drop(r.crack);
				break;
			case "cancel": r.ended = !0, i.h >= 0 && i.phase === "falling" && (i.phase = "fading", i.t = 0);
		}
	}
	carillon(e, t) {
		let n = this._car, r = this.stage.bells, i = this.sys, a = this.pc.bell;
		switch (e) {
			case "start":
				for (let e of n.bells) this._freeBell(e);
				n.on = !0, n.t = 0, n.flash = 0, n.chord = !1, n.gather = 0, n.ended = !1, this._takeField("carillon");
				break;
			case "fall": {
				if (this._settling || !a) break;
				let e = a.car.pts[t], i = n.bells[t];
				i.h < 0 && (i.h = r.spawn({
					height: m.carH,
					palette: 0,
					seed: 21 + t
				})), i.x = e.x, i.z = e.z, i.ground = e.y, i.from = m.carFrom, i.fallT = o.CARILLON.fall / 60, i.t = 0, i.y = e.y + m.carHover + m.carH + i.from, i.swing = 0, i.swingV = 0, i.strike = 0, i.dis = 1, i.phase = "falling", this._writeBell(i, m.ghost);
				break;
			}
			case "land": {
				if (this._settling || !a) break;
				let e = a.car.pts[t], r = n.bells[t], s = this.pc.player.position;
				r.h >= 0 && (r.y = e.y + m.carHover + m.carH, r.dis = 0, r.phase = "standing", this._ringBell(r, e.x - s.x, e.z - s.z, m.carSwing)), n.flash = Math.max(n.flash, 1), this.hfx.spawn({
					frame: "bellRingS",
					x: e.x,
					y: e.y + h.lift,
					z: e.z,
					life: .34,
					s0: .4,
					s1: o.CARILLON.dropHit / 1.39,
					grow: .2,
					color: this._gold(c.ring),
					fadeOut: .14
				}), this.hfx.spawn({
					frame: "bellNote",
					mode: "billboard",
					x: e.x,
					y: e.y + m.carHover + m.carH + .5,
					z: e.z,
					vy: 1.6,
					life: .7,
					s0: 1,
					s1: 1.15,
					color: this._gold(c.note),
					fadeIn: .05,
					fadeOut: .3
				}), i.burst("bellPuff", e.x, e.y + .05, e.z, 6), i.burst("bellShimmer", e.x, e.y + .6, e.z, 5), this._kick = .9;
				break;
			}
			case "chord": {
				if (this._settling) break;
				let e = this.pc.player.position;
				n.chord = !0, n.chordT = n.t, n.flash = 1.6;
				for (let t of n.bells) t.h >= 0 && t.phase === "standing" && this._ringBell(t, t.x - e.x, t.z - e.z, m.carSwing * 1.6);
				this._soundRing(e.x, e.y, e.z, {
					n: h.chordN,
					r0: .6,
					r1: o.CARILLON.r,
					open: h.chordOpen,
					life: h.chordLife,
					scale: h.chordScale,
					color: c.ring,
					waves: h.chordWaves
				}), this._soundRing(e.x, e.y, e.z, {
					n: h.chordN,
					r0: .4,
					r1: o.CARILLON.r * .75,
					open: h.chordOpen + h.echoDelay,
					life: h.chordLife * .9,
					scale: h.chordScale * .85,
					color: c.ringEcho,
					a: .7
				}), this.hfx.spawn({
					frame: "hammerCrack",
					x: e.x,
					y: e.y + .06,
					z: e.z,
					dirX: this.pc.player.facing.x,
					dirZ: this.pc.player.facing.z,
					life: 1.2,
					s0: 1.1,
					s1: 1.25,
					grow: .1,
					color: this._gold(c.crack),
					fadeOut: .5
				}), i.burst("bellPuff", e.x, e.y + .05, e.z, 14), i.burst("heroDustRing", e.x, e.y + .1, e.z, 10), this._kick = 2;
				break;
			}
			case "end":
				n.ended = !0;
				for (let e of n.bells) e.h < 0 || (e.phase = "fading", e.t = 0);
		}
	}
	visuals(e) {
		if (this._settling) return;
		let t = this.pc, n = t.bell, r = this._toll.show;
		n && n.toll.alive && r.h < 0 && !this._settling && (r.h = this.stage.bells.spawn({
			height: m.tollH,
			palette: 0,
			seed: 7
		}), r.x = n.toll.x, r.z = n.toll.z, r.ground = n.toll.y, r.y = r.ground + m.tollHover + m.tollH, r.dis = 1, r.phase = "standing", r.t = 0), this._bellFrame(r, e, m.tollH, m.tollHover);
		let i = this._car;
		if (i.on) {
			if (i.t += e, i.chord && i.t - i.chordT > m.chordHold) for (let e of i.bells) e.phase === "standing" && (e.phase = "fading", e.t = 0);
			let n = !1;
			for (let t of i.bells) this._bellFrame(t, e, m.carH, m.carHover), t.h >= 0 && (n = !0);
			!n && (i.chord || i.ended) && t.action !== "skill3" && (i.on = !1);
		}
		this._marksFrame(e), this._glowFrame(e);
	}
	_bellFrame(e, t, n, r) {
		if (e.h < 0) return;
		e.t += t;
		let i = e.ground + r + n;
		if (e.phase === "falling") {
			let t = y(e.t / Math.max(.001, e.fallT));
			e.y = i + e.from * (1 - t * t), e.dis = 1 - b(e.t / Math.max(m.appear, e.fallT * .6));
		} else if (e.phase === "standing") e.y = i, e.dis > 0 && (e.dis = Math.max(0, e.dis - t / m.appear));
		else if (e.phase === "fading" && (e.dis = Math.min(1, e.dis + t / m.dissolve), e.dis >= 1)) {
			this._freeBell(e);
			return;
		}
		this._swingStep(e, t), this._writeBell(e, m.ghost);
	}
	_marksFrame(e) {
		let t = this.pc.bell;
		if (!t) return;
		let n = this.sys, r = !1;
		for (let [i, a] of this._marks) {
			let o = i.alive ? t.marksOn(i) : 0, s = this._get(a.ref);
			if (!o || !s) {
				this._drop(a.ref), this._marks.delete(i);
				continue;
			}
			o > a.n && (a.pop = v.pop, r || n.sfxAt("markPop", i.position.x, i.position.z, { volume: .35 }), r = !0), a.n = o, a.pop = Math.max(0, a.pop - e), s.index = Math.min(2, o - 1), s.x = i.position.x, s.z = i.position.z, s.y = n.bodyBase(i) + i.def.body[1] + v.lift, s.s0 = s.s1 = 1 + .3 * (a.pop / v.pop), s.t = 0;
		}
		if (!(this._marks.size >= v.max)) for (let e of n.enemies) {
			if (!e.alive || this._marks.has(e)) continue;
			let r = t.marksOn(e);
			if (!r) continue;
			let i = this.hfx.spawn({
				tag: "mark",
				frame: "bellMark",
				mode: "billboard",
				x: e.position.x,
				y: n.bodyBase(e) + e.def.body[1] + v.lift,
				z: e.position.z,
				index: Math.min(2, r - 1),
				life: 1e9,
				color: this._gold(c.mark, [
					0,
					0,
					0
				]),
				live: !0,
				s0: 1.3,
				s1: 1.3
			});
			if (!i) break;
			let a = S();
			if (this._keep(a, i), this._marks.set(e, {
				ref: a,
				n: r,
				pop: v.pop
			}), this._marks.size >= v.max) break;
		}
	}
	lights(e) {
		this._settling = !1, this.light && !this.light.held && (this.light = null, this.lightOwner = ""), this.light && (this.lightOwner === "toll" ? this._tollLight(e) : this.lightOwner === "carillon" ? this._carLight(e) : this._releaseField()), this._sparkLight(e);
	}
	_tollLight(e) {
		let t = this._toll, n = this.light, r = this._lp, i = this.pc.bell;
		t.flash *= Math.exp(-e / p.tTau);
		let a = u();
		r.color = p.gold, r.flicker = 0, r.decay = 1, r.distance = p.tDist;
		let s = i?.toll;
		if (s?.falling) {
			t.fade = 0, r.intensity = p.tHold * b(this.pc.frame / o.TOLL.plant) * f(d.warm) * a, this._put(n, s.x, s.y + p.tLift, s.z, r);
			return;
		}
		if (!s?.alive) {
			t.fade += e;
			let i = 1 - y(t.fade / p.tFade);
			if (i <= 0 || !s) {
				t.fade > p.tFade + p.after || !s ? this._releaseField() : n.off();
				return;
			}
			r.intensity = p.tHold * i * f(d.warm) * a, this._put(n, s.x, s.y + p.tLift, s.z, r);
			return;
		}
		t.fade = 0, r.intensity = (p.tHold * f(d.warm) + (p.tFlash - p.tHold) * t.flash * f(d.flash)) * a, this._put(n, s.x - this._viewX() * p.tFront, s.y + p.tLift, s.z - this._viewZ() * p.tFront, r);
	}
	_viewX() {
		return this.sys.fx ? this.sys.fx.viewX : 0;
	}
	_viewZ() {
		return this.sys.fx ? this.sys.fx.viewZ : -1;
	}
	_carLight(e) {
		let t = this._car, n = this.light, r = this._lp, i = this.pc.player.position;
		t.flash *= Math.exp(-e / p.cTau);
		let a = u();
		if (r.color = p.gold, r.flicker = 0, r.decay = 1, !t.on) {
			this._releaseField();
			return;
		}
		t.gather = Math.min(1, t.gather + e / .2);
		let o = t.chord && t.t - t.chordT > m.chordHold, s = p.cGather * t.gather * (o ? Math.max(0, 1 - (t.t - t.chordT - m.chordHold) / m.dissolve) : 1), c = t.chord ? p.cChord : p.cNote;
		r.intensity = (s * f(d.warm) + Math.max(0, c - p.cGather) * Math.min(1, t.flash) * f(d.flash)) * a, r.distance = t.chord ? p.cChordDist : p.cDist, this._put(n, i.x, i.y + p.cLift, i.z, r);
	}
	_sparkLight(e) {
		let t = this.spark;
		if (!t) return;
		this._sparkT += e;
		let n = this._sparkKind, r = n === "slam" ? p.slamT : n === "peal" ? p.pealT : p.draughtT;
		if (this._sparkT >= r || !t.held) {
			this._releaseSpark();
			return;
		}
		let i = this._lp;
		if (i.decay = 1, i.flicker = 0, n === "draught") i.color = p.heal, i.intensity = p.draughtI * Math.exp(-this._sparkT / p.draughtTau) * f(d.warm), i.distance = p.draughtDist;
		else {
			let e = 1 - this._sparkT / r;
			i.color = p.amber, i.intensity = (n === "slam" ? p.slamI : p.pealI) * e * e * f(d.flash) * u(), i.distance = p.sparkDist;
		}
		this._put(t, this._sparkX, this._sparkY, this._sparkZ, i);
	}
	_glowFrame(e) {
		let t = this.pc, n = t.frame, r = 0;
		switch (t.action) {
			case "attack": {
				let e = t.comboSteps[t.combo - 1];
				e && n < e.fxAt && (r = (e.finisher ? 1 : .55) * b(n / e.fxAt));
				break;
			}
			case "skill1":
				n < o.PEAL.at && (r = 1.1 * b(n / o.PEAL.at));
				break;
			case "skill2":
				n < o.TOLL.plant && (r = 1.2 * b(n / o.TOLL.plant));
				break;
			case "skill3": n < o.CARILLON.chord && (r = .8 + .4 * b(n / o.CARILLON.chord));
		}
		this._kick > 0 && (this.glow = Math.max(this.glow, this._kick), this._kick = 0), this.glow = t.alive ? r >= this.glow ? r : r + (this.glow - r) * Math.exp(-e / g.tau) : 0, this.glow < .01 && (this.glow = 0), this._writeGlow(Math.min(g.max, this.glow) * f(d.glow));
	}
	_writeGlow(e) {
		let t = Math.round(e * 100) / 100;
		if (t === this._glowShown) return;
		this._glowShown = t;
		let n = g.rgb;
		this.pc.sprite?.setGlow?.(n[0], n[1], n[2], t);
	}
	info() {
		let e = this._toll.show;
		return {
			effects: this.hfx.count,
			rings: this.hfx.countTag("ring"),
			marks: this._marks.size,
			toll: {
				phase: e.phase,
				swing: +e.swing.toFixed(3),
				strike: +e.strike.toFixed(3),
				dissolve: +e.dis.toFixed(3)
			},
			carillon: {
				on: this._car.on,
				bells: this._car.bells.filter((e) => e.h >= 0).length,
				chord: this._car.chord
			},
			settling: this._settling,
			glow: +this.glow.toFixed(2),
			lights: {
				...this.lights_,
				held: +!!this.light?.held + +!!this.spark?.held,
				owner: this.lightOwner,
				spark: this._sparkKind
			}
		};
	}
}, E = Object.freeze({
	bellArc: Object.freeze({
		w: 48,
		h: 12,
		n: 2,
		fps: 0,
		late: 3
	}),
	bellRingS: Object.freeze({
		w: 48,
		h: 48,
		n: 2,
		fps: 0,
		late: 3
	}),
	bellPeal: Object.freeze({
		w: 80,
		h: 64,
		n: 4,
		fps: 24,
		late: 3
	}),
	hammerArc: Object.freeze({
		w: 64,
		h: 32,
		n: 3,
		fps: 30,
		late: 3
	}),
	hammerCrack: Object.freeze({
		w: 48,
		h: 48,
		n: 1,
		fps: 0,
		late: 3
	}),
	bellMark: Object.freeze({
		w: 32,
		h: 12,
		n: 3,
		fps: 0,
		late: 3
	}),
	bellNote: Object.freeze({
		w: 12,
		h: 16,
		n: 1,
		fps: 0,
		late: 3
	}),
	bellWave: Object.freeze({
		w: 32,
		h: 14,
		n: 2,
		fps: 0,
		late: 3
	})
});
function D(e, t, n) {
	return e < .25 ? t ? n.W : n.L : e < .5 ? n.MID : e < .8 ? n.S : n.D;
}
var O = Object.freeze({
	cx: 24,
	cy: 84,
	rOut: 82.5
});
function k(e, t, n) {
	let r = O, i = t === 0 ? 4.2 : 2.2;
	for (let a = 0; a < 12; a++) for (let o = 0; o < 48; o++) {
		let s = o + .5 - r.cx, c = r.cy - (a + .5), l = Math.hypot(s, c), u = Math.atan2(s, c) * r.rOut, d = Math.abs(u);
		if (d > 23.5) continue;
		let f = d > 17.5 ? i * Math.max(.3, (23.5 - d) / 6) : i;
		l > r.rOut || l < r.rOut - f || (t !== 1 || Math.floor((u + 24) / 8) % 3 != 1) && e.set(o, a, D((r.rOut - l) / f, u < -4, n));
	}
	e.rim(n.R);
}
function A(e, t, n) {
	let r = 22.2, i = t === 0 ? 3.4 : 1.9;
	for (let t = 0; t < 48; t++) for (let a = 0; a < 48; a++) {
		let o = a + .5 - 24, s = 24 - (t + .5), c = Math.hypot(o, s);
		if (c > r || c < r - i) continue;
		let l = (Math.atan2(s, o) / (Math.PI / 4) % 1 + 1) % 1;
		if (Math.abs(l - .5) < .07) continue;
		let u = o * -.7 + s * .7 > 4;
		e.set(a, t, D((r - c) / i, u, n));
	}
	e.rim(n.R);
}
function j(e, t, n) {
	let r = 35 * Math.PI / 180;
	for (let i = 0; i < 64; i++) for (let a = 0; a < 80; a++) {
		let o = a + .5 - 40, s = 63.5 - (i + .5);
		if (s <= 0) continue;
		let c = Math.hypot(o, s), l = Math.atan2(o, s), u = Math.abs(l);
		if (u > r + .02 || c > 62) continue;
		let d = 0;
		for (let e = 0; e < 3; e++) {
			let i = 14 + 16 * e + 5 * t;
			if (i > 62) continue;
			let a = u > r * .78 ? 2.2 : 3.4;
			c > i || c < i - a || (t !== 3 || Math.floor((l * i + 40) / 5) % 2 != 1) && (d = Math.max(d, D((i - c) / a, u < r * .45, n)));
		}
		!d && Math.abs(u - r) * c < .75 && c > 8 && c < 58 && Math.floor(c / 3) % 2 == 0 && t < 3 && (d = n.S), d && e.set(a, i, d);
	}
	if (t === 0) for (let [t, r, i] of [
		[
			40,
			61,
			n.W
		],
		[
			39,
			62,
			n.L
		],
		[
			41,
			62,
			n.L
		],
		[
			37,
			60,
			n.MID
		],
		[
			43,
			60,
			n.MID
		],
		[
			40,
			58,
			n.L
		]
	]) e.set(t, r, i);
	e.rim(n.R);
}
function M(e, t, n) {
	let r = [
		{
			a0: .2,
			a1: 1.45,
			thick: .36
		},
		{
			a0: .12,
			a1: 2.55,
			thick: .44
		},
		{
			a0: .6,
			a1: 3,
			thick: .28
		}
	][t];
	n.arc(e, {
		cx: 32,
		cy: 30.5,
		rx: 29,
		ry: 27,
		lead: "left",
		...r
	});
	let i = 32 + Math.cos(r.a1) * 29 * .84, a = 30.5 - Math.sin(r.a1) * 27 * .84;
	if (t < 2) {
		for (let t = -3; t <= 2; t++) for (let r = -3; r <= 2; r++) e.set(i + r, a + t, r < -1 || t < -1 ? n.L : r > 0 || t > 0 ? n.S : n.MID);
		e.set(i - 3, a - 3, n.W);
	}
	e.rim(n.R);
}
function N(e, t) {
	for (let n = 0; n < 48; n++) for (let r = 0; r < 48; r++) {
		let i = r + .5 - 24, a = 24 - (n + .5), o = Math.hypot(i, a);
		o > 5.2 && o < 8.2 ? e.set(r, n, o > 7.2 ? a > 1 ? t.L : t.MID : t.S) : o <= 5.2 && o > 3.6 && e.set(r, n, t.R);
	}
	for (let n = 0; n < 6; n++) {
		let r = n / 6 * Math.PI * 2 + (L(n, 7) - .5) * .5, i = 24 + Math.cos(r) * 7.5, a = 24 - Math.sin(r) * 7.5, o = 9 + Math.round(L(n, 3) * 7);
		for (let s = 0; s < o; s++) r += (L(n, s + 11) - .5) * .7, i += Math.cos(r) * 1, a -= Math.sin(r) * 1, e.set(i, a, s < o - 3 ? t.R : t.S), e.max(i, a - 1, s < 4 ? t.MID : t.D), s < 4 && e.set(i + Math.sin(r), a + Math.cos(r), t.S);
		e.set(i + 2 * Math.cos(r + 1.2), a - 2 * Math.sin(r + 1.2), t.L);
	}
}
function P(e, t, n) {
	let r = t + 1;
	for (let t = 0; t < r; t++) {
		let i = 16 + (t - (r - 1) / 2) * 9, a = r === 3 && t === 1 ? 5 : 6.5, o = [];
		for (let e = 0; e < 12; e++) for (let t = 0; t < 32; t++) {
			let r = t + .5 - i, s = a - (e + .5), c = Math.hypot(r, s);
			c > 3.1 || c < 1.6 || o.push([
				t,
				e,
				s > .5 && r < .5 ? n.W : s > -.5 ? n.L : n.MID
			]);
		}
		for (let [t, n, r] of o) e.set(t, n, r);
		let s = new Set(o.map(([e, t]) => e + t * 64));
		for (let [t, r] of o) for (let [i, a] of [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
		]) {
			let o = t + i, c = r + a;
			!s.has(o + c * 64) && !e.get(o, c) && e.set(o, c, n.R);
		}
	}
}
function F(e, t, n) {
	let r = 18.5, i = t === 0 ? 3.4 : 2;
	for (let t = 0; t < 14; t++) for (let a = 0; a < 32; a++) {
		let o = a + .5 - 16, s = 22 - (t + .5);
		if (s <= 0) continue;
		let c = Math.hypot(o, s), l = Math.abs(Math.atan2(o, s));
		if (l > .92) continue;
		let u = l > .6 ? i * Math.max(.35, (.92 - l) / .32) : i;
		c > r || c < r - u || e.set(a, t, D((r - c) / u, o < 2, n));
	}
	e.rim(n.R);
}
function I(e, t) {
	e.set(5, 1, t.MID), e.set(6, 1, t.L), e.set(5, 2, t.D), e.set(6, 2, t.D);
	for (let n = 3; n <= 12; n++) {
		let r = n < 5 ? 2 : n < 10 ? 2.4 + (n - 5) * .32 : n < 12 ? 4.4 : 5;
		for (let i = 0; i < 12; i++) {
			let a = i + .5 - 6;
			if (Math.abs(a) > r) continue;
			let o = (a + r) / (2 * r);
			e.set(i, n, n === 12 ? o < .5 ? t.W : t.L : o < .3 ? t.L : o < .7 ? t.MID : t.D);
		}
	}
	e.set(5, 14, t.L), e.set(6, 14, t.MID), e.rim(t.R);
}
function L(e, t = 0) {
	let n = Math.imul(e | 0, 668265261) ^ Math.imul((t | 0) + 2654435769, 374761393);
	return n ^= n >>> 15, n = Math.imul(n, 739982445), n ^= n >>> 12, (n >>> 0) / 4294967296;
}
var R = Object.freeze({
	bellArc: k,
	bellRingS: A,
	bellPeal: j,
	hammerArc: M,
	bellMark: P,
	bellWave: F,
	hammerCrack: (e, t, n) => N(e, n),
	bellNote: (e, t, n) => I(e, n)
});
function z(e, t, n, r) {
	R[e](t, n, r);
}
var B = !1;
function V(e) {
	B || (B = !0, e.registerFxModule({
		FRAMES: E,
		paint: z
	}));
}
//#endregion
export { C as BellStage, T as BellwardenFx, E as FRAMES, z as paint, V as registerBellFrames };
