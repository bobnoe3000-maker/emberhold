import { l as e, r as t } from "./math-Du_SWpiD.js";
import { r as n } from "./ThawField-D3Wx0alo.js";
import "./engine-D4CoK1J3.js";
import { n as r, t as i } from "./RockSpikes-C4zqD5iB.js";
import { t as a } from "./glowSpots-q5RSKfDQ.js";
import { a as o, i as s, n as c, r as l, t as u } from "./CombatSystem-nsRtT1fN.js";
//#region src/game/party/EarthSpellFx.js
var d = Object.freeze({
	crackBody: Object.freeze([
		.12,
		.08,
		.06
	]),
	crackFlash: Object.freeze([
		1.25,
		.62,
		.16
	]),
	clang: Object.freeze([
		1.25,
		.62,
		.16
	]),
	steel: Object.freeze([
		.8,
		.55,
		.25
	]),
	shock: Object.freeze([
		.55,
		.4,
		.26
	]),
	amber: Object.freeze([
		.75,
		.42,
		.1
	]),
	seed: Object.freeze([
		.08,
		.2,
		.6
	]),
	wardGlyph: Object.freeze([
		.1,
		.28,
		.8
	]),
	wardRing: Object.freeze([
		.1,
		.3,
		.95
	]),
	wardGlint: Object.freeze([
		.2,
		.5,
		1.45
	])
}), f = Object.freeze({
	magic: .6,
	matter: .72,
	flash: .5,
	glint: .35
}), p = Object.freeze({
	warm: .4,
	cool: .55,
	flash: .25
}), m = (e) => e + (1 - e) * n.uNight.value, h = Object.freeze({
	slamColor: [
		1.5,
		.9,
		.4
	],
	cryColor: [
		1.4,
		.8,
		.3
	],
	wardColor: [
		.3,
		.55,
		1.4
	],
	sparkColor: [
		1.4,
		.9,
		.45
	],
	charge: 3,
	chargeLift: 1.2,
	chargeDistance: 4,
	chargeFrom: 14,
	chargeFrames: 8,
	slam: 6,
	slamTau: .1,
	slamLift: 2.6,
	slamDistance: 9,
	hold: 2.5,
	kick: 3,
	kickTau: .08,
	fadeFrom: .6,
	fadeT: .4,
	quakeEnd: 1,
	cry: 6,
	cryTau: .07,
	cryLift: 2.2,
	cryDistance: 7,
	ward: 2.5,
	wardLift: 2.4,
	wardDistance: 7.5,
	wardDecay: 1.5,
	blend: .15,
	wardOut: .8,
	wardOutT: .3,
	wardEnd: 1.1,
	bash: 4,
	mace: 3.5,
	block: 3,
	sparkLift: .9,
	sparkDistance: 3,
	blockDistance: 2.5,
	sparkT: .12,
	blockT: .1,
	blockGlintEvery: .15,
	blockLightEvery: .3
}), g = Object.freeze({
	crackSize: 1.9,
	crackGrow: .1,
	crackAlpha: 1,
	crackLife: 1.6,
	crackFade: .7,
	heatTau: .12,
	ring: Object.freeze([1.6, 8]),
	ringGrow: .25,
	ringLife: .4,
	ringFade: .2,
	start: .07,
	sweep: .05,
	rise: .09,
	peakAt: .5,
	overshoot: 1.12,
	height: Object.freeze([1.15, .4]),
	radius: Object.freeze([.36, .46]),
	lean: Object.freeze([.12, .22]),
	aspect: Object.freeze([.62, 1]),
	compA: .16,
	compR: .92,
	compH: .45,
	compStart: .02,
	sink: .02,
	moveStep: .15,
	moveSteps: 10,
	moveIn: 1.2,
	moveOut: 3.6,
	nearLow: .5,
	clearGone: .1,
	clearStub: .5,
	stubH: .45,
	stubR: .7,
	screenDepth: 2.6,
	screenSide: .75,
	screenLow: .5,
	ease: .05,
	crackFrom: .42,
	crackTo: .62,
	sinkAt: .62,
	sinkT: .12,
	end: 1.65
}), _ = Object.freeze([
	.45,
	-.2,
	.15
]), v = .25, y = Object.freeze({
	rise: .3,
	sweeps: Object.freeze([.3, .45]),
	sweepT: .35,
	hold: .8,
	dissolve: .3,
	rPad: 1.4,
	rMin: 2.6,
	rMax: 3.4,
	apart: 6,
	seedSize: Object.freeze([1, 1.6]),
	seedAlpha: .35,
	roar: Object.freeze([1.6, 12.6]),
	roarGrow: .4,
	roarLife: .5,
	roarFade: .25,
	glyphLife: 1.1,
	glyphFade: .35,
	glintAt: .3,
	glintStagger: .06,
	glintLife: .18,
	ringScale: 1.05,
	ringScaleMember: .95,
	ringAlpha: .45,
	ringPulseHz: .8,
	ringPulse: .15,
	expiry: 1.2,
	expiryHz: 2.5,
	expiryLow: .15,
	ringFade: .4,
	tauntLife: .9,
	tauntGrow: .25,
	tauntPad: .4,
	tauntAt: .03
}), b = Object.freeze({
	rgb: Object.freeze([
		1,
		.72,
		.3
	]),
	bash: 1.4,
	block: 1.4,
	bulwarkCharge: 1.1,
	bulwarkFlash: 2.2,
	bulwarkHold: .5,
	wardPulse: Object.freeze([.25, .4]),
	quakeCharge: .8,
	quakeFlash: 1.6,
	max: 2.5,
	tau: .12
}), x = Object.freeze({ burstSpeed: [3, 5] }), S = Object.freeze({ spawnSize: [
	.6,
	.3,
	.6
] }), C = (e) => {
	let t = e <= 0 ? 0 : e >= 1 ? 1 : e;
	return t * t * (3 - 2 * t);
}, w = (e) => e <= 0 ? 0 : e >= 1 ? 1 : e, T = (e) => {
	let t = Math.PI * 2;
	return e = (e % t + t) % t, e > Math.PI ? e - t : e;
};
function E(e) {
	if (e <= 0) return 0;
	let t = g.peakAt;
	if (e < t) {
		let n = 1 - e / t;
		return g.overshoot * (1 - n * n * n);
	}
	return e < 1 ? g.overshoot - (g.overshoot - 1) * C((e - t) / (1 - t)) : 1;
}
function D() {
	return {
		on: !1,
		fl: null,
		x: 0,
		y: 0,
		z: 0,
		a: 0,
		t: 0,
		crack: null,
		crackRgb: [
			0,
			0,
			0
		],
		ring: null,
		spikes: [],
		born: 0,
		flash: 0,
		kick: 0,
		sunk: !1
	};
}
var O = class {
	constructor(e) {
		this.sys = e, this.spikes = new i({ capacity: 24 }), this.dome = new r(), e.scene?.add(this.spikes.object), e.scene?.add(this.dome.object), e.quads?.enableHalo(), this.directors = [], this.domeOwner = null, this._warmQuad = -1;
	}
	director(e) {
		let t = new k(this, e);
		return this.directors.push(t), t;
	}
	drop(e) {
		let t = this.directors.indexOf(e);
		t >= 0 && this.directors.splice(t, 1), this.domeOwner === e && (this.domeOwner = null, this.dome.hide());
	}
	warmup(e) {
		this.spikes.warm(), this.dome.warm();
		let t = this.sys.quads;
		t && (this._warmQuad = t.alloc(), this._warmQuad >= 0 && t.set(this._warmQuad, {
			x: e.x,
			y: e.y,
			z: e.z,
			frame: "partySunburst",
			index: 1,
			scale: 1,
			mode: "billboard",
			r: 2,
			g: 2,
			b: 2,
			a: 1,
			halo: 1
		}), t.update());
	}
	endWarmup() {
		this.spikes.unwarm(), this.dome.unwarm(), this._warmQuad >= 0 && this.sys.quads.free(this._warmQuad), this._warmQuad = -1;
	}
	update(e, t = !0, n = 0, r = !1) {
		let i = !t && !this.sys.game?.photoMode;
		for (let e = 0; e < this.directors.length; e++) {
			let a = this.directors[e];
			r ? a.settle(n) : i ? a.hush() : t && a.light(n);
		}
		this.spikes.update(e);
	}
	dropLights() {
		for (let e of this.directors) e.dropLights();
	}
	dispose() {
		for (let e of [...this.directors]) e.dispose();
		this.directors.length = 0, this.domeOwner = null, this.spikes.dispose(), this.dome.dispose();
	}
	info() {
		return {
			directors: this.directors.length,
			spikes: this.spikes.count,
			dome: this.dome.shown,
			halo: !!this.sys.quads?.halo
		};
	}
}, k = class {
	constructor(e, t) {
		this.stage = e, this.mc = t, this.sys = t.sys, this.fx = new s(this.sys, { halo: 0 }), this.mfx = new s(this.sys, { halo: 0 }), this.gfx = new s(this.sys, { halo: 0 }), this._quakes = [D(), D()], this._bul = {
			on: !1,
			t: 0,
			x: 0,
			y: 0,
			z: 0,
			cx: 0,
			cy: 0,
			cz: 0,
			R: 3,
			born: 0,
			flash: 0,
			heroes: [],
			cued: !1,
			glints: 0,
			motes: !1
		}, this._rings = [], this._cues = [], this._crest = a(t.member.sprite?.sheet), this._crestP = {
			x: 0,
			y: 0,
			z: 0
		}, this._spikeP = {
			rise: 0,
			crack: 0,
			height: 1,
			radius: .3
		}, this._lightP = {
			color: [
				1,
				1,
				1
			],
			intensity: 0,
			distance: 8,
			decay: 1
		}, this._lightC = [
			1,
			1,
			1
		], this._kf = {
			k: 1,
			kr: 1
		}, this._domeP = {
			rise: 0,
			dissolve: 0,
			sweepA: -9,
			sweepB: -9
		}, this._snap = /* @__PURE__ */ new Map(), this.clear();
	}
	get count() {
		return this.fx.count + this.mfx.count + this.gfx.count;
	}
	clear() {
		for (let e of this._quakes) e.on && this._endQuake(e);
		this._endBulwark(), this._rings.length = 0, this._cues.length = 0, this.fx.clear(), this.mfx.clear(), this.gfx.clear(), this._field && (this._field.off(), this._field.release()), this._field = null, this._spark && (this._spark.light.off(), this._spark.light.release()), this._spark = null, this._serial = 0, this._askedUpTo = 0, this._clock = 0, this._glintAt = -Infinity, this._blockLightAt = -Infinity, this._move = null, this._moveT = 0, this._beats = 0, this._chargeBorn = 0, this._slammed = !1, this._seed = null, this._hits = this.mc.counts.hits, this._sparkSwing = -1, this.glow = 0, this._kick = 0, this._glowShown = -1, this.lights = {
			acquired: 0,
			refused: 0
		}, this._settling = !1, this._settleT = 0, this._settled = !1, this._back = 1, this._backT = 0, this._skipMove = !1, this._snap.clear(), this.rng = new t((e(`earth:${this.mc.id}`) ^ Number(this.sys.seedValue) >>> 0) >>> 0), this._writeGlow(0);
	}
	hush() {
		this._field?.off(), this._spark?.light.off();
	}
	settle(e) {
		if (this._settling || (this._settling = !0, this._settleT = 0, this._settled = !1, this._skipMove = !0, this._releaseLights(), this._snap.clear(), this._snapOf(this.fx), this._snapOf(this.mfx), this._snapOf(this.gfx)), this._settled) return;
		this._settleT += e;
		let t = w(this._settleT / v);
		this._back = 1 - t, this._fadeTo(this.fx, 1 - t), this._fadeTo(this.mfx, 1 - t), this._fadeTo(this.gfx, 1 - t);
		let n = this.stage, r = this._spikeP;
		for (let e of this._quakes) if (e.on) for (let i of e.spikes) i.h < 0 || (r.rise = i.r * (1 - t), r.crack = 0, r.height = i.height * Math.max(.05, i.k), r.radius = i.radius * i.kr, n.spikes.set(i.h, r));
		this._bul.on && n.domeOwner === this && n.dome.set({ dissolve: Math.max(this._domeP.dissolve, t) }), this.glow !== 0 && (this.glow = 0, this._writeGlow(0)), t >= 1 && this._endOneShots(), this._write();
	}
	_endOneShots() {
		for (let e of this._quakes) e.on && this._endQuake(e);
		this._endBulwark();
		for (let e of this._cues) this.fx.kill(e.rec);
		this._cues.length = 0, this._seed && this.fx.kill(this._seed), this._seed = null, this._killAllBut(this.fx), this.mfx.clear(), this.gfx.clear(), this._back = 0, this._settled = !0;
	}
	_snapOf(e) {
		for (let t = 0; t < e.live.length; t++) this._snap.set(e.live[t], e.live[t].alpha);
	}
	_fadeTo(e, t) {
		for (let n = 0; n < e.live.length; n++) {
			let r = e.live[n];
			r.alpha = (this._snap.get(r) ?? 0) * t;
		}
	}
	_killAllBut(e) {
		for (let t = e.live.length - 1; t >= 0; t--) {
			let n = e.live[t], r = !1;
			for (let e of this._rings) e.rec === n && (r = !0);
			r || e.kill(n);
		}
	}
	_releaseLights() {
		this._field && (this._field.off(), this._field.release()), this._field = null, this._spark && (this._spark.light.off(), this._spark.light.release()), this._spark = null, this._askedUpTo = this._serial;
	}
	light(e) {
		this._settling && (this._settled || this._endOneShots(), this._settling = !1, this._settled = !1, this._backT = 0), this._back < 1 && (this._backT += e, this._back = w(this._backT / v));
		let t = Math.exp(-e / h.slamTau), n = Math.exp(-e / h.kickTau);
		for (let e of this._quakes) e.flash *= t, e.kick *= n;
		this._bul.flash *= Math.exp(-e / h.cryTau), this._fieldLight(), this._sparkLook(e);
	}
	_write() {
		let e = this.sys.fx, t = e ? e.viewX : 0, r = e ? e.viewZ : -1, i = n.uNight.value;
		this.fx.write(t, r, 1 - f.magic * i), this.mfx.write(t, r, 1 - f.matter * i), this.gfx.write(t, r, 1 - f.glint * i);
	}
	dropLights() {
		this._field && this._field.release(), this._field = null, this._spark && this._spark.light.release(), this._spark = null, this._askedUpTo = this._serial;
	}
	dispose() {
		this.clear(), this.stage.drop(this);
	}
	_acquireLight(e) {
		let t = this.sys.world, n = t && typeof t.acquireSpellLight == "function" ? t.acquireSpellLight(e) : null;
		return n ? this.lights.acquired++ : this.lights.refused++, n;
	}
	melee(e, t) {
		let n = this.sys, r = this.mc.member.position, i = this.mc.member.facing;
		if (e === 0) {
			let e = r.x + i.x * .75, t = r.z + i.z * .75;
			this.gfx.add({
				frame: "partySunburst",
				mode: "billboard",
				x: e,
				y: r.y + .95,
				z: t,
				frames: [2],
				scale: .45,
				scaleTo: .75,
				grow: .1,
				color: d.clang,
				life: .12,
				fadeOut: .04,
				back: -.2,
				halo: 1
			}), n.burst("earthShieldSpark", e, r.y + .95, t, 6), n.burst("footstep", r.x + i.x * .4, r.y + .05, r.z + i.z * .4, 4), this._kick = Math.max(this._kick, b.bash);
		} else this.fx.add({
			frame: "slashBig",
			mode: "flat",
			x: r.x + i.x * .85,
			y: r.y + .8,
			z: r.z + i.z * .85,
			dirX: i.x,
			dirZ: i.z,
			scale: .85,
			fps: 30,
			color: d.steel,
			life: 4 / 30,
			fadeOut: .05,
			alpha: .9
		}), n.burst("partyDust", r.x + i.x * .9, r.y + .15, r.z + i.z * .9, 3);
	}
	block(e, t) {
		let n = this.sys, r = this.mc.member.position, i = r.x - e * .35, a = r.z - t * .35;
		n.burst("earthShieldSpark", i, r.y + .95, a, 5);
		let o = this._clock;
		o - this._glintAt >= h.blockGlintEvery && (this._glintAt = o, this.gfx.add({
			frame: "partySunburst",
			mode: "billboard",
			x: i,
			y: r.y + .95,
			z: a,
			frames: [1],
			scale: .45,
			color: d.clang,
			life: .1,
			fadeOut: .04,
			back: -.2,
			halo: 1
		}), this._kick = Math.max(this._kick, b.block)), o - this._blockLightAt >= h.blockLightEvery && !this._spark && (this._blockLightAt = o, this._sparkAt(i, r.y + h.sparkLift, a, h.block, h.blockT, h.blockDistance));
	}
	windup(e, t) {
		let n = this.mc.member.position;
		t === 6 && this.sys.burst("footstep", n.x, n.y + .05, n.z, 4);
	}
	bulwark(e, t, n) {
		let r = this.sys, i = this.mc.member.position, a = r.player.position, o = r.groundAt(i.x, i.z), s = Math.hypot(i.x - a.x, i.z - a.z), f = t, p = n;
		s > y.apart && (f = i.x, p = i.z);
		let m = Math.max(y.rMin, Math.min(y.rMax, s / 2 + y.rPad)), h = r.groundAt(f, p);
		this._endBulwark(), this._seed && this.fx.kill(this._seed), this._seed = null;
		let g = this._crestAt();
		g && this.gfx.add({
			frame: "partySunburst",
			mode: "billboard",
			x: g.x,
			y: g.y,
			z: g.z,
			frames: [1],
			scale: .5,
			color: d.clang,
			life: .14,
			fadeOut: .06,
			back: -.25,
			halo: 1
		}), this.fx.add({
			frame: "partyRing",
			mode: "flat",
			x: i.x,
			y: o + u + .03,
			z: i.z,
			frames: [0],
			size: y.roar[0],
			sizeTo: y.roar[1],
			grow: y.roarGrow,
			color: d.amber,
			life: y.roarLife,
			fadeOut: y.roarFade,
			alpha: l,
			soft: .3
		}), r.burst("earthDustRing", i.x, o + .1, i.z, 10, x), r.burst("earthCrySpark", i.x, o + 1.2, i.z, 8), this.fx.add({
			frame: "partyGlyphWard",
			mode: "flat",
			x: f,
			y: h + u,
			z: p,
			size: 2,
			sizeTo: m * 2,
			grow: y.rise,
			spin: .7,
			color: d.wardGlyph,
			life: y.glyphLife,
			fadeIn: .05,
			fadeOut: y.glyphFade,
			alpha: c
		});
		let _ = this.stage, v = r.engine?.renderer?.getContext?.(), S = v ? v.drawingBufferWidth : 1280;
		_.dome.artPx = S >= 2560 ? 4 : S >= 1920 ? 3 : 2, _.dome.show({
			x: f,
			y: h,
			z: p,
			radius: m
		}), _.domeOwner = this;
		let C = this._bul;
		C.on = !0, C.t = 0, C.x = i.x, C.y = o, C.z = i.z, C.cx = f, C.cy = h, C.cz = p, C.R = m, C.born = ++this._serial, C.flash = 1, C.cued = !1, C.glints = 0, C.motes = !1, C.heroes.length = 0;
		for (let e of this._rings) this.fx.kill(e.rec);
		this._rings.length = 0, this._wardRing(a, null, y.ringScale, e.wardFor), C.heroes.push(a);
		for (let t of r.allies) t.present && (this._wardRing(t.position, t, y.ringScaleMember, e.wardFor), C.heroes.push(t.position));
		this._kick = Math.max(this._kick, b.bulwarkFlash);
	}
	slam(e, t) {
		let n = this.sys, r = this._quakes.find((e) => !e.on);
		if (!r) {
			r = this._quakes[0];
			for (let e of this._quakes) e.t > r.t && (r = e);
			this._endQuake(r);
		}
		r.on = !0, r.fl = e, r.x = e.x, r.y = e.y, r.z = e.z, r.a = e.a, r.t = 0, r.flash = 1, r.kick = 0, r.sunk = !1, r.born = ++this._serial, this._slammed = !0;
		let i = e.y + u;
		this._crackTint(r), r.crack = this.mfx.add({
			frame: "partyCrack",
			mode: "flat",
			x: e.x,
			y: i,
			z: e.z,
			size: 2.4,
			sizeTo: t.r * g.crackSize,
			grow: g.crackGrow,
			rot: e.a,
			color: r.crackRgb,
			life: Infinity,
			alpha: g.crackAlpha
		}), r.ring = this.mfx.add({
			frame: "partyRing",
			mode: "flat",
			x: e.x,
			y: i + .03,
			z: e.z,
			frames: [0],
			size: g.ring[0],
			sizeTo: g.ring[1],
			grow: g.ringGrow,
			color: d.shock,
			life: Infinity,
			alpha: l,
			soft: .3
		}), n.burst("earthDustRing", e.x, e.y + .15, e.z, 12), n.burst("partyRubble", e.x, e.y + .2, e.z, 10), this._planSpikes(r, this.mc.kit.skill2.spikes), this._kick = Math.max(this._kick, b.quakeFlash);
	}
	erupt(e, t) {
		for (let t of this._quakes) t.on && t.fl === e && (t.kick = 1);
	}
	closed(e) {
		for (let t of this._quakes) t.on && t.fl === e && this._endQuake(t);
	}
	_planSpikes(e, t) {
		let n = this.sys, r = this.rng, i = this.mc.member.position, a = Math.atan2(i.z - e.z, i.x - e.x), o = n.fx, s = o ? o.viewX : 0, c = o ? o.viewZ : -1;
		e.spikes.length = 0;
		let l = (t.rInner + t.r) / 2;
		for (let n = 0; n < t.n; n++) {
			let i = e.a + n * Math.PI * 2 / t.n + (n % 2 ? .18 : -.12), o = l + _[n % 3], u = Math.abs(T(i - a)) / Math.PI, d = g.start + g.sweep * u, f = Math.cos(i), p = Math.sin(i), m = f * s + p * c, h = 1 - g.nearLow * Math.max(0, -m), v = g.height[0] + g.height[1] * r.next();
			if (this._pushSpike(e, e.x + f * o, e.z + p * o, f, p, v, g.radius[0] + (g.radius[1] - g.radius[0]) * r.next(), d, u, !1, h), m >= 0) {
				let t = i + (r.next() < .5 ? -1 : 1) * g.compA, n = o * g.compR, a = Math.cos(t), s = Math.sin(t);
				this._pushSpike(e, e.x + a * n, e.z + s * n, a, s, v * g.compH, .18 + .06 * r.next(), d + g.compStart, u, !0, h);
			}
		}
	}
	_pushSpike(e, t, n, r, i, a, o, s, c, l, u) {
		let d = this.rng, f = a * (g.lean[0] + (g.lean[1] - g.lean[0]) * d.next()), p = (d.next() - .5) * .2 * a;
		e.spikes.push({
			x: t,
			y: this.sys.groundAt(t, n) - g.sink,
			z: n,
			height: a,
			radius: o,
			yaw: d.next() * Math.PI * 2,
			tiltX: r * f - i * p,
			tiltZ: i * f + r * p,
			seed: d.next() * 2147483647 | 0,
			aspect: g.aspect[0] + (g.aspect[1] - g.aspect[0]) * d.next(),
			start: s,
			h: -1,
			order: c,
			small: l,
			near: u,
			k: u,
			kr: 1,
			r: 0
		});
	}
	_readable(e) {
		let t = this.sys, n = t.fx, r = n ? n.viewX : 0, i = n ? n.viewZ : -1, a = !1, o = !1, s = !1, c = t.enemies;
		for (let t = 0; t < c.length && !a; t++) {
			let n = c[t];
			if (!n.alive || !n.sprite?.visible) continue;
			let l = n.position.x - e.x, u = n.position.z - e.z, d = Math.hypot(l, u) - n.radius;
			d < g.clearGone ? a = !0 : d < g.clearStub && (o = !0);
			let f = l * r + u * i;
			f > -.3 && f < g.screenDepth && Math.abs(l * i - u * r) < g.screenSide && (s = !0);
		}
		let l = t.player.position;
		{
			let n = l.x - e.x, c = l.z - e.z, u = Math.hypot(n, c) - (t.pc?.radius ?? .3);
			u < g.clearGone ? a = !0 : u < g.clearStub && (o = !0);
			let d = n * r + c * i;
			d > -.3 && d < g.screenDepth && Math.abs(n * i - c * r) < g.screenSide && (s = !0);
		}
		let u = t.allies;
		for (let t = 0; t < u.length && !a; t++) {
			let n = u[t];
			if (!n.present) continue;
			let c = n.position, l = c.x - e.x, d = c.z - e.z, f = Math.hypot(l, d) - n.radius;
			f < g.clearGone ? a = !0 : f < g.clearStub && (o = !0);
			let p = l * r + d * i;
			p > -.3 && p < g.screenDepth && Math.abs(l * i - d * r) < g.screenSide && (s = !0);
		}
		let d = this._kf;
		return a ? (d.k = 0, d.kr = g.stubR, d) : (d.k = e.near * (o ? g.stubH : 1) * (s ? g.screenLow : 1), d.kr = o ? g.stubR : 1, d);
	}
	_clearAt(e, t) {
		let n = this.sys, r = Infinity;
		for (let i of n.enemies) i.alive && i.sprite?.visible && (r = Math.min(r, Math.hypot(i.position.x - e, i.position.z - t) - i.radius));
		let i = n.player.position;
		r = Math.min(r, Math.hypot(i.x - e, i.z - t) - (n.pc?.radius ?? .3));
		for (let i of n.allies) i.present && (r = Math.min(r, Math.hypot(i.position.x - e, i.position.z - t) - i.radius));
		return r;
	}
	_freeFoot(e, t, n) {
		if (this._clearAt(t.x, t.z) >= g.clearStub) return;
		let r = t.x - e.x, i = t.z - e.z, a = Math.hypot(r, i) || 1, o = r / a, s = i / a;
		for (let r = 1; r <= 2 * g.moveSteps; r++) {
			let i = a + (r % 2 ? 1 : -1) * Math.ceil(r / 2) * g.moveStep;
			if (i < g.moveIn || i > g.moveOut) continue;
			let c = e.x + o * i, l = e.z + s * i;
			if (this._clearAt(c, l) < g.clearStub) continue;
			let u = !1;
			for (let r = 0; r < n; r++) {
				let n = e.spikes[r];
				n.h >= 0 && Math.hypot(n.x - c, n.z - l) < n.radius + t.radius + .1 && (u = !0);
			}
			if (!u) {
				t.x = c, t.z = l, t.y = this.sys.groundAt(c, l) - g.sink;
				return;
			}
		}
	}
	_stepQuake(e) {
		let t = this.sys, n = this.stage.spikes, r = e.t;
		if (!e.sunk) for (let i = 0; i < e.spikes.length; i++) {
			let a = e.spikes[i];
			if (a.h !== -1 || r < a.start) continue;
			if (this._freeFoot(e, a, i), a.h = n.spawn(a), a.h < 0) {
				a.h = -2;
				continue;
			}
			let o = this._readable(a);
			a.k = o.k, a.kr = o.kr, !a.small && (t.burst("partyRubble", a.x, a.y + .25, a.z, 2), i % 4 == 0 && t.burst("earthChipPuff", a.x, a.y + .1, a.z, 1));
		}
		if (!e.sunk && r >= g.sinkAt) {
			e.sunk = !0;
			for (let n of e.spikes) n.h < 0 || n.small || n.k < .05 || (t.burst("earthChips", n.x, n.y + .3 + .4 * n.height * n.k, n.z, 3), t.burst("earthChipPuff", n.x, n.y + .1, n.z, 1));
		}
		if (r >= g.sinkAt + g.sinkT) for (let t of e.spikes) t.h >= 0 && n.free(t.h), t.h !== -2 && (t.h = -3);
		e.ring && r >= g.ringLife && (this.mfx.kill(e.ring), e.ring = null), e.crack && r >= g.crackLife && (this.mfx.kill(e.crack), e.crack = null), r >= g.end && this._endQuake(e);
	}
	_crackTint(e) {
		let t = n.uNight.value, r = Math.exp(-e.t / g.heatTau), i = (1 - f.flash * t) / Math.max(.05, 1 - f.matter * t);
		for (let t = 0; t < 3; t++) e.crackRgb[t] = d.crackBody[t] * (1 - r) + d.crackFlash[t] * i * r;
	}
	_quakeLook(e, t) {
		this._crackTint(e), e.crack && (e.crack.alpha = g.crackAlpha * w((g.crackLife - e.t) / g.crackFade)), e.ring && (e.ring.alpha = l * w((g.ringLife - e.t) / g.ringFade));
		let n = this.stage.spikes, r = e.t, i = C((r - g.crackFrom) / (g.crackTo - g.crackFrom)), a = t > 0 ? 1 - Math.exp(-t / g.ease) : 0, o = this._spikeP;
		for (let t of e.spikes) {
			if (t.h < 0) continue;
			let e;
			if (r < g.sinkAt) e = E((r - t.start) / g.rise);
			else {
				let t = w((r - g.sinkAt) / g.sinkT);
				e = 1 - t * t;
			}
			if (a > 0) {
				let e = this._readable(t);
				t.k += (e.k - t.k) * a, t.kr += (e.kr - t.kr) * a;
			}
			o.rise = t.k > .03 ? e : 0, t.r = o.rise, o.crack = i, o.height = t.height * Math.max(.05, t.k), o.radius = t.radius * t.kr, n.set(t.h, o);
		}
	}
	_endQuake(e) {
		let t = this.stage.spikes;
		for (let n of e.spikes) n.h >= 0 && t.free(n.h);
		e.spikes.length = 0, this.mfx.kill(e.crack), this.mfx.kill(e.ring), e.crack = null, e.ring = null, e.fl = null, e.on = !1;
	}
	_wardRing(e, t, n, r) {
		let i = this.fx.add({
			frame: "partyWardRing",
			mode: "flat",
			x: e.x,
			y: e.y + u,
			z: e.z,
			follow: e,
			scale: n,
			spin: 1.2,
			color: d.wardRing,
			life: Infinity,
			fadeIn: .2,
			alpha: y.ringAlpha
		});
		i && this._rings.push({
			rec: i,
			owner: t,
			base: n,
			t: 0,
			life: r
		});
	}
	_stepBulwark() {
		let e = this._bul;
		if (!e.on) return;
		let t = this.sys;
		if (!e.cued && e.t >= y.tauntAt) {
			e.cued = !0;
			for (let e of t.enemies) {
				if (!e.alive || e.target !== this.mc || !(e.tauntT > 4.9) || !e.sprite?.visible) continue;
				let t = (e.radius + y.tauntPad) / .75, n = this.fx.add({
					frame: "partyWardRing",
					mode: "flat",
					x: e.position.x,
					y: e.position.y + u,
					z: e.position.z,
					follow: e.position,
					scale: t * 1.3,
					scaleTo: t,
					grow: y.tauntGrow,
					color: d.amber,
					life: Infinity,
					alpha: l
				});
				n && this._cues.push({
					rec: n,
					e,
					t: 0
				});
			}
		}
		for (; e.glints < e.heroes.length && e.t >= y.glintAt + e.glints * y.glintStagger;) {
			let t = e.heroes[e.glints++];
			this.fx.add({
				frame: "partySunburst",
				mode: "billboard",
				x: t.x,
				y: t.y + 1.1,
				z: t.z,
				follow: t,
				frames: [0, 1],
				scale: .4,
				color: d.wardGlint,
				life: y.glintLife,
				fadeOut: .06,
				back: -.3,
				halo: 1
			});
		}
		!e.motes && e.t >= y.hold && (e.motes = !0, t.burst("earthWardMote", e.cx, e.cy + e.R * .45, e.cz, 8)), e.t >= h.wardEnd && e.t >= y.hold + y.dissolve && this._endBulwark();
	}
	_endBulwark() {
		let e = this._bul;
		e.on = !1, e.heroes.length = 0;
		let t = this.stage;
		t.domeOwner === this && (t.domeOwner = null, t.dome.hide());
	}
	step(e) {
		this._clock += e;
		for (let t of this._quakes) t.on && (t.t = t.fl && t.fl.on ? t.fl.t : t.t + e, this._stepQuake(t));
		this._bul.on && (this._bul.t += e, this._stepBulwark());
		let t = this._rings;
		for (let n = t.length - 1; n >= 0; n--) {
			let r = t[n];
			r.t += e;
			let i = r.owner !== null && r.owner.gone;
			if (r.t < r.life && !i) continue;
			let a = r.rec;
			i || this.sys.burst("earthWardMote", a.x, a.y + .2, a.z, 2, S), this.fx.kill(a), t[n] = t[t.length - 1], t.pop();
		}
		let n = this._cues;
		for (let t = n.length - 1; t >= 0; t--) {
			let r = n[t];
			r.t += e, !(r.t < y.tauntLife) && (this.fx.kill(r.rec), n[t] = n[n.length - 1], n.pop());
		}
		this.fx.step(e), this.mfx.step(e), this.gfx.step(e);
	}
	visuals(e) {
		this._settling || (this._beatsLook(), this._landedLook());
		for (let t of this._quakes) t.on && this._quakeLook(t, e);
		this._bulwarkLook(), this._ringsLook(), this._settling || this._glowLook(e), this._write();
	}
	_beatsLook() {
		let e = this.mc, t = this.sys, n = e.down ? null : e.move;
		if ((n !== this._move || e.t < this._moveT) && (this._move = n, this._beats = 0, this._chargeBorn = 0, this._slammed = !1, this._skipMove = !1), this._moveT = e.t, this._skipMove) return;
		let r = e.frame, i = e.member.position, a = e.member.facing;
		if (n === "bash" && r >= 4 && !(this._beats & 1) && (this._beats |= 1, t.burst("footstep", i.x - a.x * .3, i.y + .05, i.z - a.z * .3, 3)), n === "earthshatter" && !this._slammed) {
			for (let e = 0; e < 3; e++) {
				let n = 2 << e;
				if (r < 8 + 6 * e || this._beats & n) continue;
				this._beats |= n;
				let o = i.x + a.x * .9, s = i.z + a.z * .9;
				t.burst("earthGrit", o, t.groundAt(o, s) + .05, s, 5);
			}
			r >= h.chargeFrom && this._chargeBorn === 0 && (this._chargeBorn = ++this._serial);
		}
		if (n === "bulwark" && r < 16) {
			let t = C(e.t / o(16));
			this._seed ||= this.fx.add({
				frame: "partyGlyphWard",
				mode: "flat",
				x: i.x,
				y: i.y + u,
				z: i.z,
				follow: i,
				size: y.seedSize[0],
				sizeTo: y.seedSize[1],
				grow: o(16),
				spin: 1.5,
				color: d.seed,
				life: Infinity,
				alpha: 0
			}), this._seed && (this._seed.alpha = y.seedAlpha * t);
		} else this._seed &&= (this.fx.kill(this._seed), null);
	}
	_landedLook() {
		let e = this.mc, t = e.counts.hits;
		if (t < this._hits && (this._hits = t), t === this._hits) return;
		this._hits = t;
		let n = e.move;
		if (n !== "bash" && n !== "mace" || this._sparkSwing === e.swings) return;
		this._sparkSwing = e.swings;
		let r = e.member.position, i = e.member.facing, a = r.x + i.x * 1.2, o = r.z + i.z * 1.2;
		n === "mace" && this.sys.burst("earthShieldSpark", a, r.y + .8, o, 4), this._spark || this._sparkAt(a, r.y + h.sparkLift, o, n === "bash" ? h.bash : h.mace, h.sparkT, h.sparkDistance);
	}
	_sparkAt(e, t, n, r, i, a) {
		let o = this._acquireLight({ minor: !0 });
		o && (this._spark = {
			light: o,
			x: e,
			y: t,
			z: n,
			t: 0,
			dur: i,
			peak: r,
			dist: a
		});
	}
	_sparkLook(e) {
		let t = this._spark;
		if (!t) return;
		if (t.t += e, t.t >= t.dur || !t.light.held) {
			t.light.off(), t.light.release(), this._spark = null;
			return;
		}
		let n = 1 - t.t / t.dur, r = this._lightP;
		r.color = h.sparkColor, r.decay = 1, r.intensity = t.peak * n * n * m(p.warm), r.distance = t.dist, t.light.set(t.x, t.y, t.z, r);
	}
	_bulwarkLook() {
		let e = this._bul;
		if (!e.on || this.stage.domeOwner !== this) return;
		let t = e.t, n = w(t / y.rise), r = this._domeP;
		r.rise = 1 - (1 - n) * (1 - n) * (1 - n), r.dissolve = C((t - y.hold) / y.dissolve);
		let i = y.sweeps[0], a = y.sweeps[1];
		r.sweepA = t >= i && t < i + y.sweepT ? (t - i) / y.sweepT : -9, r.sweepB = t >= a && t < a + y.sweepT ? (t - a) / y.sweepT : -9, this.stage.dome.set(r);
	}
	_ringsLook() {
		for (let e of this._rings) {
			let t = e.rec;
			t.s0 = t.s1 = e.base * (1 + y.ringPulse * (.5 - .5 * Math.cos(Math.PI * 2 * y.ringPulseHz * e.t)));
			let n = e.life - e.t, r = y.ringAlpha;
			if (n < y.expiry) {
				let e = y.expiryLow;
				r = e + (y.ringAlpha - e) * (.5 + .5 * Math.cos(Math.PI * 2 * y.expiryHz * (y.expiry - n)));
			}
			t.alpha = r * w(n / y.ringFade) * this._back;
		}
		for (let e = this._cues.length - 1; e >= 0; e--) {
			let t = this._cues[e];
			if (t.e.alive && t.e.sprite?.visible) {
				t.rec.alpha = l * w(1 - t.t / y.tauntLife);
				continue;
			}
			this.fx.kill(t.rec), this._cues[e] = this._cues[this._cues.length - 1], this._cues.pop();
		}
	}
	_fieldLight() {
		let e = this.mc, t = 0, n = 0, r = null;
		this._chargeBorn > 0 && !this._slammed && e.move === "earthshatter" && !e.down && e.frame < 22 && (t = this._chargeBorn, n = 1);
		for (let e of this._quakes) e.on && e.t < h.quakeEnd && e.born > t && (t = e.born, n = 2, r = e);
		let i = this._bul;
		if (i.on && i.t < h.wardEnd && i.born > t && (t = i.born, n = 3), n === 0) {
			this._field &&= (this._field.off(), this._field.release(), null);
			return;
		}
		if (this._field && !this._field.held && (this._field = null), !this._field && (t <= this._askedUpTo || (this._askedUpTo = t, this._field = this._acquireLight(), !this._field))) return;
		let a = this._field, s = this._lightP;
		if (n === 1) {
			let t = e.member.position, n = e.member.facing, r = t.x + n.x * .9, i = t.z + n.z * .9;
			s.color = h.slamColor, s.intensity = h.charge * C((e.t - o(h.chargeFrom)) / o(h.chargeFrames)) * m(p.warm), s.distance = h.chargeDistance, s.decay = 1, a.set(r, this.sys.groundAt(r, i) + h.chargeLift, i, s);
		} else if (n === 2 && r) {
			let e = r.t, t = h.hold * m(p.warm) + ((h.slam - h.hold) * r.flash + h.kick * r.kick) * m(p.flash);
			s.color = h.slamColor, s.intensity = t * (1 - C((e - h.fadeFrom) / h.fadeT)), s.distance = h.slamDistance, s.decay = 1 + C((e - .1) / .3), a.set(r.x, r.y + h.slamLift, r.z, s);
		} else {
			let e = i.t, t = C(e / h.blend), n = h.cry * i.flash * m(p.flash), r = h.ward * m(p.cool) * (1 - C((e - h.wardOut) / h.wardOutT)), o = this._lightC;
			for (let e = 0; e < 3; e++) o[e] = h.cryColor[e] + (h.wardColor[e] - h.cryColor[e]) * t;
			s.color = o, s.intensity = n + r * t, s.distance = h.cryDistance + (h.wardDistance - h.cryDistance) * t, s.decay = 1 + (h.wardDecay - 1) * t, a.set(i.x + (i.cx - i.x) * t, i.y + h.cryLift + (i.cy + h.wardLift - i.y - h.cryLift) * t, i.z + (i.cz - i.z) * t, s);
		}
	}
	_glowLook(e) {
		if (!this._crest) return;
		let t = this.mc, n = 0;
		t.move === "earthshatter" && t.frame < 22 ? n = b.quakeCharge * C(t.t / o(22)) : t.move === "bulwark" && t.frame < 16 ? n = b.bulwarkCharge * C(t.t / o(16)) : this._bul.on && this._bul.t < y.hold ? n = b.bulwarkHold : this._rings.length && (n = b.wardPulse[0] + (b.wardPulse[1] - b.wardPulse[0]) * (.5 + .5 * Math.sin(this._clock * Math.PI * 2 * .8))), this._kick > 0 && (this.glow = Math.max(this.glow, this._kick), this._kick = 0), this.glow = t.down ? 0 : n >= this.glow ? n : n + (this.glow - n) * Math.exp(-e / b.tau), this.glow = Math.min(b.max, this.glow), this.glow < .01 && (this.glow = 0), this._writeGlow(this.glow);
	}
	_writeGlow(e) {
		if (!this._crest) return;
		let t = Math.round(e * 100) / 100;
		t !== this._glowShown && (this._glowShown = t, this.mc.member.sprite?.setGlow(b.rgb[0], b.rgb[1], b.rgb[2], t));
	}
	_crestAt() {
		let e = this.mc, t = this._crest?.[e._lastRow]?.[e._lastCol] ?? null;
		if (!t) return null;
		let r = e.member.position, i = this._crestP, a = n.uCameraYaw.value;
		return i.x = r.x + Math.cos(a) * t.right, i.y = r.y + t.up, i.z = r.z - Math.sin(a) * t.right, i;
	}
	info() {
		let e = 0;
		for (let t of this._quakes) for (let n of t.spikes) n.h >= 0 && e++;
		return {
			effects: this.count,
			quakes: this._quakes.filter((e) => e.on).length,
			spikes: e,
			bulwark: this._bul.on,
			dome: this.stage.domeOwner === this && this.stage.dome.shown,
			wardRings: this._rings.length,
			taunts: this._cues.length,
			glow: +this.glow.toFixed(3),
			crest: !!this._crest,
			settling: this._settling,
			settled: this._settled,
			back: +this._back.toFixed(3),
			lights: {
				...this.lights,
				held: +!!this._field?.held + +!!this._spark?.light.held,
				field: !!this._field?.held,
				spark: !!this._spark?.light.held
			}
		};
	}
};
//#endregion
export { O as EarthStage, k as GreatshieldFx };
