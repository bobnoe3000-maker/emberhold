import { c as e, l as t, r as n } from "./math-Du_SWpiD.js";
import { r } from "./ThawField-CelnRTY2.js";
import "./engine-hlzvTIM_.js";
import { t as i } from "./SpectralBlades-Ce40QHpR.js";
import { t as a } from "./glowSpots-q5RSKfDQ.js";
//#region src/game/combat/SwordmasterFx.js
var o = (e) => e / 60, s, c, l, u = Object.freeze({
	galeBody: Object.freeze([
		.22,
		.33,
		.41
	]),
	galeLit: Object.freeze([
		.8,
		.98,
		1.12
	]),
	fangBody: Object.freeze([
		.6,
		.04,
		.05
	]),
	fangLit: Object.freeze([
		1.35,
		.12,
		.11
	]),
	fangCore: Object.freeze([
		1.5,
		.42,
		.32
	]),
	sigilBody: Object.freeze([
		.42,
		.22,
		.04
	]),
	sigilPulse: Object.freeze([
		.84,
		.5,
		.16
	]),
	runeLit: Object.freeze([
		1.3,
		.95,
		.45
	]),
	goldFlash: Object.freeze([
		1.4,
		1.02,
		.5
	]),
	goldBody: Object.freeze([
		.45,
		.22,
		.04
	]),
	crackBody: Object.freeze([
		.12,
		.08,
		.06
	])
}), d = Object.freeze({
	lowSun: .35,
	lo: .3,
	hi: .65
}), f = () => {
	let e = (r.uSunDirection.value.y - d.lo) / (d.hi - d.lo), t = 1 - (e <= 0 ? 0 : e >= 1 ? 1 : e * e * (3 - 2 * e));
	return 1 - d.lowSun * t * (1 - r.uNight.value);
}, p = .5, m = .6, h = .3, g = .012, _ = Object.freeze({
	steel: [
		.5,
		.7,
		1.5
	],
	crimson: [
		1.6,
		.22,
		.12
	],
	gold: [
		1.5,
		1,
		.4
	],
	heal: [
		.5,
		1.3,
		.45
	],
	sparkI: 3.5,
	sparkT: .14,
	sparkLift: 2,
	sparkDist: 3.5,
	draughtI: 2,
	draughtTau: .25,
	draughtT: .5,
	draughtLift: 2,
	draughtDist: 3.5,
	tGather: 2.5,
	tGatherLift: 2,
	tGatherDist: 4.5,
	tStorm: 3,
	tOrbit: 1,
	tLift: 2.6,
	tOutLift: 2,
	tW: 5,
	tDist: 7.5,
	fGather: 2.5,
	fGatherLift: 2,
	fGatherDist: 4.5,
	fLift: 2.4,
	fRide: 2.5,
	fDist: 5.5,
	fOut: .15,
	sFall0: 2,
	sFall1: 6,
	sFallLift: 2,
	sDist0: 6,
	sDist1: 8,
	sFlash: 11,
	sFlashLift: 3,
	sFlashDist: 11,
	sTau: .1,
	sHold: 2.5,
	sHoldDecay: 2,
	sPulse: .15,
	sPulseHz: 3,
	sBlink: 7,
	sBlinkTau: .08,
	cap: 6,
	after: .1
}), v = Object.freeze({
	base: .75,
	tempestFlare: .5,
	skyFlare: .6
}), y = Object.freeze({
	warm: .4,
	cool: .55,
	blade: .8,
	flash: .25
}), b = (e) => e + (1 - e) * r.uNight.value, x = Object.freeze({
	steel: Object.freeze([
		.75,
		.85,
		1
	]),
	crimson: Object.freeze([
		1,
		.16,
		.12
	]),
	gold: Object.freeze([
		1,
		.6,
		.15
	]),
	tau: .12,
	max: 2.5
}), S = Object.freeze({
	length: 1.9,
	width: .22,
	lag: Object.freeze([.25, .5]),
	ghost: Object.freeze([.5, .75]),
	ghostGlow: .6,
	pitch: 25 * Math.PI / 180,
	roll: 70 * Math.PI / 180,
	appear: .1,
	spinOut: 20,
	outDelay: .08,
	outT: .12
}), C = Object.freeze({
	length: 6.4,
	width: .85,
	sink: .8,
	bite: .25,
	biteT: .1,
	beyond: .75,
	lean: Math.tan(4 * Math.PI / 180),
	appear: .08,
	release: 58,
	dissolve: .25,
	ghostUp: Object.freeze([.6, 1.2]),
	ghostCut: Object.freeze([.55, .75]),
	screenGhost: .45,
	bossGhost: .25,
	screenEase: .1,
	behind: 1,
	struck: 1,
	upper: 1.5,
	bodyW: .3,
	bodyH: .8
}), w = Object.freeze({
	n: 8,
	radiusPx: 71,
	igniteFrom: 1,
	igniteEvery: 3,
	outFrom: 46,
	outEvery: 2
}), T = 8, E = .25, D = (e) => {
	let t = e <= 0 ? 0 : e >= 1 ? 1 : e;
	return t * t * (3 - 2 * t);
}, O = (e) => e <= 0 ? 0 : e >= 1 ? 1 : e, k = (e) => 1 - (1 - e) * (1 - e), A = Math.PI * 2, j = () => ({
	rec: null,
	id: 0
}), M = class {
	constructor(e) {
		this.sys = e, this.blades = new i({ capacity: 16 }), e.scene?.add(this.blades.object), e.quads?.enableHalo(), this.directors = [], this._warmQuad = -1, this._onHit = (e) => {
			if (e && e !== "player") for (let t = 0; t < this.directors.length; t++) this.directors[t].onHit(e);
		}, e.events?.on("hit", this._onHit);
	}
	director(e) {
		({F: o, TEMPEST: s, DRAGONFANG: c, SKYFALL: l} = e.moves);
		let t = new N(this, e);
		return this.directors.push(t), t;
	}
	drop(e) {
		let t = this.directors.indexOf(e);
		t >= 0 && this.directors.splice(t, 1);
	}
	warmup(e) {
		this.blades.warm();
		let t = this.sys.quads;
		this._warmQuad = t.alloc(), this._warmQuad >= 0 && t.set(this._warmQuad, {
			x: e.x,
			y: e.y,
			z: e.z,
			frame: "heroGaleLit",
			index: 0,
			scale: 1,
			mode: "billboard",
			r: 1.3,
			g: 1.3,
			b: 1.3,
			a: 1,
			soft: 0,
			halo: 1
		}), t.update();
	}
	endWarmup() {
		this.blades.unwarm(), this._warmQuad >= 0 && this.sys.quads.free(this._warmQuad), this._warmQuad = -1;
	}
	update(e, t = !0, n = 0, r = !1) {
		let i = !t && !this.sys.game?.photoMode;
		for (let e = 0; e < this.directors.length; e++) {
			let a = this.directors[e];
			r ? a.settle(n) : i ? a.hush() : t && a.lights(n);
		}
		this.blades.update(e);
	}
	dropLights() {
		for (let e of this.directors) e.dropLights();
	}
	dispose() {
		this.sys.events?.off("hit", this._onHit);
		for (let e of [...this.directors]) e.dispose();
		this.directors.length = 0, this._warmQuad >= 0 && this.sys.quads?.free(this._warmQuad), this._warmQuad = -1, this.blades.dispose();
	}
	info() {
		let e = this.directors[0] ?? null, t = e ? e.info() : null;
		return {
			directors: this.directors.length,
			blades: this.blades.count,
			halo: !!this.sys.quads?.halo,
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
}, N = class i {
	constructor(e, r) {
		this.stage = e, this.pc = r, this.sys = r.sys, this.hfx = r.hfx, this._spots = a(r.sheet), this._anchor = {
			x: 0,
			y: 0,
			z: 0
		}, this._bp = {
			x: 0,
			y: 0,
			z: 0,
			ax: 0,
			ay: 1,
			az: 0,
			nx: 0,
			ny: 0,
			nz: 1,
			dissolve: 0,
			dissolveDir: 0,
			ghost: 0,
			glow: 1,
			runes: 0
		}, this._lp = {
			color: _.steel,
			intensity: 0,
			distance: 6,
			decay: 1,
			flicker: 0
		}, this.lights_ = {
			acquired: 0,
			refused: 0
		}, this.light = null, this.lightOwner = "", this.spark = null, this._sparkKind = "", this._sparkT = 0, this._sparkX = 0, this._sparkY = 0, this._sparkZ = 0, this._initState(), this.rng = new n((t("sword:player") ^ Number(this.sys.seedValue) >>> 0) >>> 0);
	}
	_initState() {
		this._combo = {
			on: !1,
			step: 0,
			last: -1
		}, this._tem = {
			on: !1,
			st: 0,
			t: -1,
			a0: 0,
			released: !1,
			relT: 0,
			runes: 0,
			runesTo: 0,
			flare: 0,
			ring: j(),
			storm: j(),
			blades: [
				0,
				1,
				2,
				3
			].map(() => ({
				h: -1,
				g0: -1,
				g1: -1
			}))
		}, this._fang = {
			on: !1,
			t: 0,
			released: !1,
			relT: 0,
			ended: !1,
			endT: 0,
			last: -1,
			crest: j(),
			crestLit: j(),
			x: 0,
			y: 0,
			z: 0
		}, this._sky = {
			on: !1,
			t: 0,
			ended: !1,
			landed: !1,
			landT: 0,
			sword: -1,
			ghosts: [-1, -1],
			sigil: j(),
			plates: Array.from({ length: w.n }, j),
			order: Array(w.n).fill(0),
			star: j(),
			crack: j(),
			flare: 0,
			ghostK: 0,
			flash: 0,
			blink: 0,
			last: -1,
			released: !1,
			sx: 0,
			sz: 0,
			py: 0,
			dissolve: 0,
			screened: !1
		}, this.glow = 0, this._kick = 0, this._glowShown = -1, this._glowRgb = x.steel, this._gc = [
			0,
			0,
			0
		], this._settling = !1, this._settleT = 0;
	}
	clear() {
		let e = this.stage.blades;
		for (let e of this._tem.blades) this._freeBlade(e);
		let r = this._sky;
		r.sword >= 0 && e.free(r.sword);
		for (let t of r.ghosts) t >= 0 && e.free(t);
		this._releaseLights(), this._initState(), this.rng = new n((t("sword:player") ^ Number(this.sys.seedValue) >>> 0) >>> 0), this._writeGlow(0);
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
		this._settling || (this._settling = !0, this._settleT = 0, this._releaseLights()), this._settleT += e;
		let t = O(this._settleT / E);
		this.hfx.settle(e, E), this.pc._updateRings(e);
		let n = this.stage.blades, r = this._tem, i = this._sky;
		if (t < 1) {
			let e = this._bp;
			e.ghost = t * .99;
			for (let t of r.blades) t.h >= 0 && n.set(t.h, { ghost: e.ghost }), t.g0 >= 0 && n.set(t.g0, { ghost: Math.max(S.ghost[0], e.ghost) }), t.g1 >= 0 && n.set(t.g1, { ghost: Math.max(S.ghost[1], e.ghost) });
			i.sword >= 0 && n.set(i.sword, { ghost: Math.max(i.ghostK, e.ghost) });
			for (let t = 0; t < 2; t++) i.ghosts[t] >= 0 && n.set(i.ghosts[t], { ghost: Math.max(C.ghostCut[t], e.ghost) });
		} else if (r.on || i.on || this._fang.on) {
			for (let e of r.blades) this._freeBlade(e);
			i.sword >= 0 && n.free(i.sword);
			for (let e of i.ghosts) e >= 0 && n.free(e);
			i.sword = i.ghosts[0] = i.ghosts[1] = -1, r.on = !1, i.on = !1, this._fang.on = this.pc._wave.alive && this._fang.on;
		}
		this.glow !== 0 && (this.glow = 0, this._writeGlow(0));
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
	_put(e, t, n, r, i) {
		i.intensity > _.cap && (i.intensity = _.cap), e.set(t, n, r, i);
	}
	_releaseSpark() {
		this.spark && (this.spark.off(), this.spark.release()), this.spark = null, this._sparkKind = "";
	}
	_releaseLights() {
		this._releaseField(), this._releaseSpark();
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
	_freeBlade(e) {
		let t = this.stage.blades;
		e.h >= 0 && t.free(e.h), e.g0 >= 0 && t.free(e.g0), e.g1 >= 0 && t.free(e.g1), e.h = e.g0 = e.g1 = -1;
	}
	_viewX() {
		return this.sys.fx ? this.sys.fx.viewX : 0;
	}
	_viewZ() {
		return this.sys.fx ? this.sys.fx.viewZ : -1;
	}
	_bladeAt() {
		let e = this.pc, t = e.player.position, n = this._anchor, i = this._spots?.[e._lastRow]?.[e._lastCol] ?? null;
		if (i) {
			let a = r.uCameraYaw.value;
			n.x = t.x + Math.cos(a) * i.right, n.y = t.y + e._lift + i.up, n.z = t.z - Math.sin(a) * i.right;
		} else {
			let r = e.player.facing;
			n.x = t.x + r.x * .3, n.y = t.y + e._lift + 1, n.z = t.z + r.z * .3;
		}
		return n;
	}
	static crossed(e, t, n) {
		return e < n && t >= n;
	}
	windup(e) {
		let t = this._combo;
		t.on = !0, t.step = e.finisher ? 3 : this.pc.combo, t.last = 0, this._glowRgb = x.steel;
	}
	swing(e) {
		let t = this.sys, n = this.hfx, r = this.pc.player.position, i = this.pc.player.facing;
		if (this._combo.on = !1, e.finisher) {
			this._kick = 1.6, n.pair({
				frame: "thrust",
				x: r.x + i.x * .9,
				y: r.y + .85,
				z: r.z + i.z * .9,
				dirX: i.x,
				dirZ: i.z,
				rot: Math.PI / 2,
				life: .13,
				strip: .1,
				color: u.galeBody,
				fadeOut: .05
			}, "heroThrustLit", u.galeLit);
			let e = {
				frame: "heroGale",
				x: r.x + i.x * .7,
				y: r.y + .85,
				z: r.z + i.z * .7,
				vx: i.x * 10,
				vz: i.z * 10,
				dirX: i.x,
				dirZ: i.z,
				life: .32,
				strip: .12,
				s0: 1.15,
				s1: 1.45,
				color: u.galeBody,
				fadeOut: .14
			};
			n.pair(e, "heroGaleLit", u.galeLit);
			for (let [t, r] of [[.5, .55], [1, .35]]) n.spawn({
				...e,
				x: e.x - i.x * t,
				z: e.z - i.z * t,
				a: r,
				s0: 1.1,
				s1: 1.35
			});
			t.burst("heroWindSpark", r.x + i.x * 1.6, r.y + .85, r.z + i.z * 1.6, 10), t.burst("heroGust", r.x + i.x * .6, r.y + .08, r.z + i.z * .6, 4), this.spark || (this.spark = this._acquire(!0), this.spark && (this._sparkKind = "a3", this._sparkT = 0, this._sparkX = r.x + i.x * 1.6, this._sparkY = r.y + _.sparkLift, this._sparkZ = r.z + i.z * 1.6));
		} else this._kick = 1, n.pair({
			frame: "heroGale",
			x: r.x + i.x * .6,
			y: r.y + .8,
			z: r.z + i.z * .6,
			dirX: i.x,
			dirZ: i.z,
			flip: e.flip,
			life: .2,
			strip: .13,
			s0: 1.02,
			s1: 1.12,
			color: u.galeBody,
			fadeOut: .08
		}, "heroGaleLit", u.galeLit), t.burst("heroWindSpark", r.x + i.x * 1.1, r.y + .8, r.z + i.z * 1.1, 6);
	}
	draught() {
		if (this.spark || (this.spark = this._acquire(!0), !this.spark)) return;
		let e = this.pc.player.position;
		this._sparkKind = "draught", this._sparkT = 0, this._sparkX = e.x, this._sparkY = e.y + _.draughtLift, this._sparkZ = e.z;
	}
	tempest(e, t = 0) {
		let n = s, r = this.sys, i = this.pc, a = i.player.position, c = this._tem;
		switch (e) {
			case "start":
				for (let e of c.blades) this._freeBlade(e);
				this._drop(c.ring), this._drop(c.storm), c.on = !0, c.st = 0, c.t = -1, c.a0 = Math.atan2(i._baseZ, i._baseX), c.released = !1, c.runes = c.runesTo = 0, c.flare = 0, this._glowRgb = x.steel, this._takeField("tempest"), this._keep(c.ring, this.hfx.spawn({
					frame: "heroCyclone",
					follow: a,
					oy: .3,
					dirX: 0,
					dirZ: -1,
					life: o(n.bladesAt + 2),
					s0: 1.5,
					spin: 6,
					color: u.galeBody,
					a: .5,
					soft: .4,
					live: !0
				}));
				break;
			case "wind":
				r.burst("heroGust", a.x, a.y + .08, a.z, 8);
				break;
			case "blades": {
				if (!c.on) break;
				c.t = 0;
				let e = this.stage.blades;
				for (let t = 0; t < c.blades.length; t++) {
					let n = c.blades[t];
					this._freeBlade(n);
					let r = 11 + t;
					n.h = e.spawn({
						length: S.length,
						width: S.width,
						palette: 0,
						seed: r
					}), n.g0 = e.spawn({
						length: S.length,
						width: S.width,
						palette: 0,
						seed: r
					}), n.g1 = e.spawn({
						length: S.length,
						width: S.width,
						palette: 0,
						seed: r
					});
				}
				let t = o(n.bladeOpen - n.bladesAt), r = o(n.release - n.bladesAt);
				this._keep(c.storm, this.hfx.spawn({
					frame: "heroCyclone",
					follow: a,
					oy: .35,
					dirX: 0,
					dirZ: -1,
					flip: !0,
					life: r + .14,
					fps: 24,
					loop: !0,
					s0: .45,
					s1: 1.25,
					grow: t,
					spin: -n.spin * .55,
					color: u.galeBody,
					a: m,
					soft: .35,
					fadeIn: .05,
					fadeOut: .14
				})), this._placeTempest();
				break;
			}
			case "spin": {
				let e = Math.atan2(i._baseZ, i._baseX) + n.spin * (i.t - o(n.bladesAt)), t = n.bladeR;
				r.burst("heroWindSpark", a.x + Math.cos(e) * t, a.y + .8, a.z + Math.sin(e) * t, 3), r.burst("heroGust", a.x - Math.cos(e) * t * .7, a.y + .08, a.z - Math.sin(e) * t * .7, 2);
				break;
			}
			case "hit": {
				let e = t === 2;
				r.burst("heroWindSpark", a.x, a.y + .8, a.z, e ? 16 : 10), r.burst("heroGust", a.x, a.y + .08, a.z, e ? 8 : 5);
				let s = Math.atan2(i._baseZ, i._baseX) + n.spin * (i.t - o(n.bladesAt));
				for (let e = 0; e < 3; e++) {
					let t = s + e * A / 3;
					r.burst("heroGlint", a.x + Math.cos(t) * n.bladeR, a.y + .85, a.z + Math.sin(t) * n.bladeR, 3);
				}
				if (!c.on) break;
				c.runesTo = Math.min(1, (t + 1) / 3), c.flare = v.tempestFlare, this._kick = 1.8;
				break;
			}
			case "release":
				if (r.burst("heroWindSpark", a.x, a.y + .8, a.z, 18), r.burst("heroGust", a.x, a.y + .08, a.z, 10), !c.on) break;
				c.released = !0, c.relT = Math.max(0, c.t), this.hfx.spawn({
					frame: "heroCyclone",
					x: a.x,
					y: a.y + .35,
					z: a.z,
					dirX: 0,
					dirZ: -1,
					life: .24,
					s0: 1.25,
					s1: 2.4,
					grow: .2,
					color: u.galeBody,
					a: m,
					soft: .3,
					fadeOut: .12
				});
		}
	}
	_placeTempest() {
		let e = s, t = this._tem, n = this.stage.blades, r = this._bp, i = this.pc.player.position, a = Math.max(0, t.t), c = o(e.bladeOpen - e.bladesAt), l = o(e.release - e.bladesAt), u = t.released ? a - t.relT : -1, d = Math.cos(S.pitch), f = Math.sin(S.pitch), p = (v.base + t.flare) * b(y.blade), m = u >= 0 ? D((u - S.outDelay) / S.outT) : 0, h = !1;
		for (let o = 0; o < t.blades.length; o++) {
			let s = t.blades[o];
			if (s.h < 0 && s.g0 < 0 && s.g1 < 0) continue;
			h = !0;
			let l = e.bladeR - o % 2 * .7, g = .75 + o % 2 * .3, _ = a < c ? .5 + (l - .5) * k(a / c) : u < 0 ? l : l + 16 * u, v = t.a0 + o * A / e.blades + e.spin * a, y = S.roll + (u > 0 ? S.spinOut * u : 0);
			for (let e = 0; e < 3; e++) {
				let c = e === 0 ? s.h : e === 1 ? s.g0 : s.g1;
				if (c < 0) continue;
				let l = v - (e === 0 ? 0 : S.lag[e - 1]), h = Math.cos(l), b = Math.sin(l), x = b * d, C = f, w = -h * d, T = i.x + h * _, E = i.y + g + .1 * Math.sin(a * 11 + o * 3), O = i.z + b * _, k = S.length * .5;
				r.x = T - x * k, r.y = E - C * k, r.z = O - w * k, r.ax = x, r.ay = C, r.az = w;
				let A = -C * x, j = 1 - C * C, M = -C * w, N = Math.hypot(A, j, M) || 1;
				A /= N, j /= N, M /= N;
				let P = C * M - w * j, F = w * A - x * M, I = x * j - C * A, L = Math.cos(y), R = Math.sin(y);
				r.nx = L * A + R * P, r.ny = L * j + R * F, r.nz = L * M + R * I, a < S.appear ? (r.dissolve = 1 - a / S.appear, r.dissolveDir = 1) : m > 0 ? (r.dissolve = m, r.dissolveDir = -1) : (r.dissolve = 0, r.dissolveDir = 0), r.ghost = e === 0 ? 0 : Math.min(.99, S.ghost[e - 1] + (u > 0 ? .5 * D(u / .1) : 0)), r.glow = e === 0 ? p : p * S.ghostGlow, r.runes = t.runes, n.set(c, r);
			}
			m >= 1 && this._freeBlade(s);
		}
		!h && t.t >= 0 && (t.on = t.on && a < l + .5);
	}
	fang(e) {
		let t = this.sys, n = this.pc, r = n.player.position, i = n.player.facing, a = this._fang;
		if (e === "windup") {
			this._drop(a.crest), this._drop(a.crestLit), a.on = !0, a.t = 0, a.released = !1, a.ended = !1, a.last = 2, this._glowRgb = x.crimson, this._takeField("fang"), t.burst("heroGust", r.x - i.x * .4, r.y + .08, r.z - i.z * .4, 5), this._gatherStar(0);
			return;
		}
		let o = n._wave;
		a.on = !0, a.released = !0, a.relT = a.t, a.ended = !1, this._kick = 2, this.lightOwner !== "fang" && this._takeField("fang"), this.hfx.pair({
			frame: "heroGale",
			x: r.x + i.x * .6,
			y: r.y + .8,
			z: r.z + i.z * .6,
			dirX: i.x,
			dirZ: i.z,
			life: .2,
			strip: .12,
			s0: 1.25,
			s1: 1.4,
			color: u.fangBody,
			fadeOut: .08
		}, "heroGaleLit", u.fangLit);
		let s = {
			kind: "wave",
			frame: "heroWave",
			grow: .25,
			life: 2,
			fps: 24,
			loop: !0,
			fadeIn: .03,
			fadeOut: .12,
			wave: o
		};
		this.hfx.spawn({
			...s,
			trail: 1.6,
			oy: .35,
			a: .4,
			s0: 1.1 * .8,
			s1: 1.1 * 1.12,
			color: u.fangBody
		}), this.hfx.spawn({
			...s,
			trail: .8,
			oy: .35,
			a: .6,
			s0: .96,
			s1: 1.344,
			color: u.fangBody
		}), this.hfx.pair({
			...s,
			trail: 0,
			oy: .35,
			a: 1,
			s0: 1.04,
			s1: 1.3 * 1.12,
			color: u.fangBody
		}, "heroWaveLit", u.fangLit), this.hfx.spawn({
			...s,
			frame: "heroWaveLit",
			trail: .12,
			oy: .37,
			a: 1,
			s0: .784,
			s1: .98 * 1.12,
			color: u.fangCore,
			halo: 1
		});
		let c = {
			kind: "wave",
			frame: "heroFangCrest",
			mode: "billboard",
			wave: o,
			trail: -.05,
			oy: .8,
			back: .25,
			s0: .7,
			life: 2,
			a: .85,
			fadeIn: .04,
			fadeOut: .12,
			color: u.fangBody,
			live: !0
		};
		this._keep(a.crest, this.hfx.spawn(c)), this._keep(a.crestLit, this.hfx.spawn({
			...c,
			frame: "heroFangCrestLit",
			back: .22,
			color: u.fangLit,
			halo: 1
		})), t.burst("heroFangEmber", o.x, o.y + .6, o.z, 8), t.burst("heroGust", r.x + i.x * .5, r.y + .08, r.z + i.z * .5, 6);
	}
	_gatherStar(e) {
		let t = this._bladeAt(), n = this.rng.next() * A, r = .7 + .2 * e, i = Math.cos(n) * r, a = .25 + .3 * this.rng.next(), o = Math.sin(n) * r;
		this.hfx.spawn({
			frame: "partySunburst",
			mode: "billboard",
			x: t.x + i,
			y: t.y + a,
			z: t.z + o,
			vx: -i / .1,
			vy: -a / .1,
			vz: -o / .1,
			index: 0,
			s0: .25,
			s1: .18,
			life: .12,
			back: -.25,
			spin: 4,
			color: u.fangLit,
			halo: 1,
			fadeOut: .04
		});
	}
	waveBeat(e) {
		this.sys.burst("heroGust", e.x, e.y + .06, e.z, 2), this.sys.burst("heroFangEmber", e.x, e.y + .6, e.z, 2);
	}
	waveEnd(e, t) {
		let n = this.sys, r = this._fang;
		for (let t of [r.crest, r.crestLit]) {
			let n = this._get(t);
			n && (n.index = 3, n.loop = !1, n.strip = 0, n.fadeOut = .1, n.life = Math.min(n.life, n.t + .12), n.kind = "basic", n.x = e.x, n.y = e.y, n.z = e.z, n.wave = null);
		}
		this.hfx.endWave(), r.ended = !0, r.endT = r.t, r.x = e.x, r.y = e.y, r.z = e.z, n.burst("heroFangEmber", e.x, e.y + .6, e.z, t ? 12 : 6), t && (n.burst("heroDebris", e.x, e.y + .5, e.z, 10), n.burst("heroGust", e.x, e.y + .1, e.z, 6), this.hfx.spawn({
			frame: "partySunburst",
			mode: "billboard",
			x: e.x,
			y: e.y + .7,
			z: e.z,
			index: 1,
			s0: 1,
			life: .16,
			back: -.2,
			color: u.fangLit,
			halo: 1,
			fadeOut: .1
		}));
	}
	skyfall(e) {
		let t = this.sys, n = this.pc, r = n.player.position, i = n._land, a = this._sky, s = this.hfx;
		switch (e) {
			case "crouch": {
				this._endSkyfall(!0), a.on = !0, a.t = n.t, a.ended = !1, a.landed = !1, a.released = !1, a.flare = 0, a.ghostK = 0, a.flash = 0, a.blink = 0, a.last = 1, a.dissolve = 0, this._glowRgb = x.gold, this._keep(a.sigil, s.spawn({
					tag: "skyfall",
					frame: "heroSigil",
					follow: i,
					oy: h,
					dirX: 0,
					dirZ: -1,
					life: o(l.total - 2),
					s0: .5,
					s1: 1.1,
					grow: o(l.land - 1),
					spin: 1.1,
					color: u.sigilBody,
					a: p,
					fadeIn: .12,
					fadeOut: .35
				}));
				let e = Math.atan2(r.z - i.z, r.x - i.x), t = [];
				for (let n = 0; n < w.n; n++) {
					let r = this._plateAngle(n, 0);
					t.push([((r - e) % A + A) % A, n]), this._keep(a.plates[n], s.spawn({
						tag: "skyfall",
						frame: "heroRunes",
						x: i.x,
						y: i.y + h + g,
						z: i.z,
						life: o(l.total - 2),
						s0: .5,
						color: u.sigilBody,
						a: 0,
						live: !0
					}));
				}
				t.sort((e, t) => e[0] - t[0]), t.forEach(([, e], t) => {
					a.order[e] = t;
				});
				let c = this._bladeAt();
				this._keep(a.star, s.spawn({
					tag: "skyfall",
					frame: "partySunburst",
					mode: "billboard",
					x: c.x,
					y: c.y,
					z: c.z,
					index: 0,
					s0: .25,
					life: o(l.rise + 2),
					back: -.25,
					spin: 2,
					color: u.runeLit,
					halo: 1,
					fadeIn: .05,
					fadeOut: .06,
					live: !0
				}));
				break;
			}
			case "leap":
				t.burst("heroGust", r.x, r.y + .08, r.z, 10), t.burst("heroHoly", r.x, r.y + .6, r.z, 8);
				break;
			case "sword": {
				if (!a.on) break;
				let e = this.stage.blades;
				a.sword < 0 && (a.sword = e.spawn({
					length: C.length,
					width: C.width,
					palette: 1,
					seed: 7
				}));
				for (let t = 0; t < 2; t++) a.ghosts[t] < 0 && (a.ghosts[t] = e.spawn({
					length: C.length,
					width: C.width,
					palette: 1,
					seed: 7
				}));
				this._takeField("skyfall"), this._placeSword(), t.burst("heroHoly", a.sx, a.py + C.length * .6, a.sz, 10);
				break;
			}
			case "impact": {
				a.landed = !0, a.landT = a.t, a.flare = v.skyFlare, a.flash = _.sFlash - _.sHold, this._kick = 2.2;
				let e = this.stage.blades;
				for (let t = 0; t < 2; t++) a.ghosts[t] >= 0 && e.free(a.ghosts[t]), a.ghosts[t] = -1;
				let n = this._viewX(), o = this._viewZ(), s = i.x + n * C.beyond, c = i.z + o * C.beyond;
				a.on && this._skyImpact(s, c), t.burst("heroDebris", i.x, i.y + .2, i.z, 24), t.burst("heroDustRing", r.x, r.y + .15, r.z, 12), t.burst("heroHoly", i.x, i.y + .5, i.z, 12);
				break;
			}
		}
	}
	_skyImpact(e, t) {
		let n = this.pc, r = n._land, i = this._sky, a = this.hfx;
		this._keep(i.crack, a.spawn({
			frame: "heroCrack",
			x: r.x,
			y: r.y + .06,
			z: r.z,
			dirX: n._leapX,
			dirZ: n._leapZ,
			life: 1.6,
			s0: .9,
			s1: 1.05,
			grow: .12,
			color: u.runeLit,
			a: .75,
			fadeOut: .7,
			live: !0
		})), a.spawn({
			frame: "partySunburst",
			mode: "billboard",
			x: e,
			y: r.y + .45,
			z: t,
			index: 1,
			s0: 1.2,
			life: .16,
			back: -.25,
			color: this._gold(u.goldFlash),
			halo: 1,
			fadeOut: .1
		});
		let o = this._get(i.sigil);
		a.spawn({
			frame: "heroSigil",
			x: r.x,
			y: r.y + h + .02,
			z: r.z,
			dirX: 0,
			dirZ: -1,
			rot: o ? o.rot + o.spin * o.t : 0,
			spin: 1.1,
			life: .25,
			s0: 1.1,
			s1: 1.25,
			color: this._gold(u.sigilPulse),
			a: p,
			fadeOut: .2
		});
	}
	skyfallEnd(e) {
		let t = this._sky;
		t.on && (e < l.land && !t.landed ? (this.hfx.fadeTag("skyfall", .15), this._endSkyfall(!1)) : t.ended = !0);
	}
	_endSkyfall(e) {
		let t = this._sky, n = this.stage.blades;
		t.sword >= 0 && n.free(t.sword);
		for (let e = 0; e < 2; e++) t.ghosts[e] >= 0 && n.free(t.ghosts[e]);
		if (t.sword = t.ghosts[0] = t.ghosts[1] = -1, e) {
			this._drop(t.sigil);
			for (let e of t.plates) this._drop(e);
			this._drop(t.star), this._drop(t.crack);
		}
		this.lightOwner === "skyfall" && this._releaseField(), t.on = !1;
	}
	_plateAngle(e, t) {
		return -(.13 + (3 * e + 1) * A / 24 + t);
	}
	_placeSword() {
		let e = this._sky, t = this.pc, n = t._land, r = this.stage.blades, i = this._bp, a = this._viewX(), s = this._viewZ(), c = o(l.swordAt), u = o(l.land), d = e.t, f = O((d - c) / (u - c));
		e.sx = n.x + a * C.beyond, e.sz = n.z + s * C.beyond;
		let p = n.y - C.sink + l.swordY * (1 - f * f);
		e.landed && (p -= C.bite * O(1 - (d - e.landT) / C.biteT)), e.py = p;
		let m = -t._leapX * C.lean, h = -t._leapZ * C.lean, g = Math.hypot(m, 1, h);
		i.ax = m / g, i.ay = 1 / g, i.az = h / g, i.nx = -a, i.ny = 0, i.nz = -s;
		let x = o(C.release);
		e.dissolve = d >= x ? O((d - x) / C.dissolve) : 0;
		let S = d - c;
		S < C.appear ? (i.dissolve = 1 - S / C.appear, i.dissolveDir = 1) : (i.dissolve = e.dissolve, i.dissolveDir = 1);
		let w = e.landed ? 1 + _.sPulse * Math.sin(A * _.sPulseHz * (d - e.landT)) : 1, T = (v.base * w + e.flare) * b(y.blade);
		i.runes = e.landed ? 1 : D(f * 1.1), i.glow = T, e.sword >= 0 && (i.x = e.sx, i.y = p, i.z = e.sz, i.ghost = e.ghostK, r.set(e.sword, i));
		for (let t = 0; t < 2; t++) {
			let n = e.ghosts[t];
			n < 0 || (i.x = e.sx, i.y = p + C.ghostUp[t], i.z = e.sz, i.ghost = Math.min(.99, C.ghostCut[t] + .4 * f * f), i.glow = T * .6, r.set(n, i));
		}
		e.sword >= 0 && e.dissolve >= 1 && (r.free(e.sword), e.sword = -1);
	}
	_screens() {
		let e = this._sky, t = this.pc._land, n = this._viewX(), i = this._viewZ(), a = r.uCameraPosition.value, o = a.x * n + a.z * i, s = -a.x * i + a.z * n, c = e.sx * n + e.sz * i, l = -e.sx * i + e.sz * n;
		if (c - o < .5) return 0;
		let u = t.y + C.upper, d = e.py + C.length, f = C.width * .5, p = 0, m = this.sys.enemies;
		for (let e = 0; e < m.length; e++) {
			let r = m[e];
			if (!r.alive || !r.sprite.visible) continue;
			let h = r.position;
			if (Math.hypot(h.x - t.x, h.z - t.z) < r.radius + C.struck) continue;
			let g = h.x * n + h.z * i;
			if (g < c + (r.boss ? .1 : C.behind)) continue;
			let _ = (c - o) / (g - o), v = r.sprite.size, y = s + (-h.x * i + h.z * n - s) * _;
			if (Math.abs(y - l) > f + Math.max(r.radius, v.x * C.bodyW) * _) continue;
			let b = h.y + r.hover, x = a.y + (b - a.y) * _;
			if (!(a.y + (b + v.y * C.bodyH - a.y) * _ < u || x > d)) {
				if (!r.boss) return C.screenGhost;
				p = C.bossGhost;
			}
		}
		return p;
	}
	_skyLook() {
		let e = this._sky, t = this.pc._land, n = e.t, r = this._get(e.sigil), i = 1.1, a = 0, s = 0;
		if (r) {
			let e = r.grow > 0 ? Math.min(1, r.t / r.grow) : 1;
			i = r.s0 + (r.s1 - r.s0) * k(e), a = r.rot + r.spin * r.t, s = (r.fadeIn > 0 ? Math.min(1, r.t / r.fadeIn) : 1) * (r.fadeOut > 0 ? O((r.life - r.t) / r.fadeOut) : 1);
		}
		let c = e.landed ? 1 + _.sPulse * Math.sin(A * _.sPulseHz * (n - e.landT)) : 1, d = f(), m = d * d;
		if (r) {
			let e = u.sigilBody;
			r.cr0 = r.cr1 = e[0] * m, r.cg0 = r.cg1 = e[1] * m, r.cb0 = r.cb1 = e[2] * m;
		}
		let v = w.radiusPx / 16 * i;
		for (let l = 0; l < w.n; l++) {
			let f = this._get(e.plates[l]);
			if (!f) continue;
			if (!r) {
				this.hfx.kill(f);
				continue;
			}
			let _ = this._plateAngle(l, a), y = Math.cos(_), b = Math.sin(_);
			f.x = t.x + y * v, f.y = t.y + h + g, f.z = t.z + b * v, f.dirX = y, f.dirZ = b, f.s0 = f.s1 = i;
			let x = e.order[l], S = n >= o(w.igniteFrom + w.igniteEvery * x) && n < o(w.outFrom + w.outEvery * x);
			f.index = +!!S;
			let C = S ? u.runeLit : u.sigilBody, T = S ? c * d : m;
			f.cr0 = f.cr1 = C[0] * T, f.cg0 = f.cg1 = C[1] * T, f.cb0 = f.cb1 = C[2] * T, f.halo = +!!S, f.a = (S ? .85 : p) * s;
		}
		let y = this._get(e.star);
		if (y) {
			let e = this._bladeAt();
			y.x = e.x, y.y = e.y, y.z = e.z, y.s0 = y.s1 = .25 + .15 * D(n / o(l.rise - 1));
			let t = u.runeLit;
			y.cr0 = y.cr1 = t[0] * d, y.cg0 = y.cg1 = t[1] * d, y.cb0 = y.cb1 = t[2] * d;
		}
	}
	_coolCrack() {
		let e = this._get(this._sky.crack);
		if (!e) return;
		let t = Math.exp(-e.t / .12) * f(), n = u.crackBody, r = u.runeLit;
		e.cr0 = e.cr1 = n[0] + (r[0] - n[0]) * t, e.cg0 = e.cg1 = n[1] + (r[1] - n[1]) * t, e.cb0 = e.cb1 = n[2] + (r[2] - n[2]) * t;
	}
	_gold(e) {
		let t = f(), n = this._gc;
		return n[0] = e[0] * t, n[1] = e[1] * t, n[2] = e[2] * t, n;
	}
	onHit(e) {
		let t = this.pc, n = this.sys;
		if (this._settling) return;
		if (t.action === "skill1" && this._tem.on) for (let r = 0; r < 3; r++) {
			let [i, a] = s.hits[r], o = r === 0 ? t._tagA : r === 1 ? t._tagB : t._tagC;
			if (t.frame >= i && t.frame <= a && n.tags.has(o, e)) {
				this._mark(e, "heroCut", u.galeLit, .1, .9);
				return;
			}
		}
		let r = t._wave;
		r.alive && this._fang.on && n.tags.has(r.tag, e) && this._mark(e, "heroBite", u.fangLit, .12, .85);
	}
	_mark(e, t, n, i, a) {
		if (this.hfx.countTag("mark") >= T) return;
		let o = this.sys, s = e.def.body, c = o.bodyBase(e) + Math.min(1.2, (s[0] + s[1]) * .5), l = this.pc.player.position, u = Math.atan2(e.position.z - l.z, e.position.x - l.x) + r.uCameraYaw.value, d = Math.atan2(-.56 * Math.cos(u), -Math.sin(u)) - .385 + (this.rng.next() - .5) * .3;
		this.hfx.spawn({
			tag: "mark",
			frame: t,
			mode: "billboard",
			x: e.position.x,
			y: c,
			z: e.position.z,
			back: -(e.radius * .6 + .15),
			rot: d,
			life: i,
			strip: i,
			s0: a,
			s1: a * 1.1,
			color: n,
			halo: 1,
			fadeOut: i * .3
		});
	}
	visuals(e) {
		let t = this.pc;
		if (this._settling) return;
		let n = this._combo;
		if (n.on && t.action === "attack") {
			let e = t.frame, r = t.player.position, a = t.player.facing;
			if (n.step < 3 && i.crossed(n.last, e, 3) && this.sys.burst("heroGust", r.x - a.x * .35, r.y + .08, r.z - a.z * .35, 2), n.step === 3 && i.crossed(n.last, e, 4)) {
				let e = this._bladeAt();
				for (let t of [-1, 1]) {
					let n = -a.z * t * .7, r = a.x * t * .7;
					this.hfx.spawn({
						frame: "heroGale",
						x: e.x + n,
						y: e.y - .1,
						z: e.z + r,
						vx: -n / .12,
						vz: -r / .12,
						dirX: a.x,
						dirZ: a.z,
						flip: t > 0,
						index: 3,
						life: .12,
						s0: .7,
						s1: .5,
						color: u.galeBody,
						a: .7,
						fadeOut: .05
					});
				}
			}
			n.last = e;
		} else n.on = !1;
		let r = this._tem;
		if (r.on && !r.released && t.action !== "skill1") {
			if (r.t >= 0) {
				r.released = !0, r.relT = r.t;
				let e = this._get(r.storm);
				e && (e.life = Math.min(e.life, e.t + e.fadeOut));
			} else r.on = !1, this._drop(r.ring);
		}
		if (r.on) {
			r.st += e, r.t >= 0 && (r.t += e), r.flare *= Math.exp(-e / .1), r.runes < r.runesTo && (r.runes = Math.min(r.runesTo, r.runes + e / .06));
			let t = this._get(r.ring);
			if (t) {
				let e = O(r.st / o(s.bladesAt + 2));
				t.s0 = t.s1 = 1.5 - 1 * e * e;
			}
			r.t >= 0 && this._placeTempest();
		}
		let a = this._fang;
		if (a.on) {
			if (a.t += e, t.action === "skill2" && !a.released) {
				let e = t.frame;
				i.crossed(a.last, e, 5) && this._gatherStar(1), i.crossed(a.last, e, 8) && this._gatherStar(2), a.last = e;
			}
			this._crestFrame(a.crest), this._crestFrame(a.crestLit), a.ended && a.t > a.endT + _.fOut + _.after + .05 && this.lightOwner !== "fang" && (a.on = !1), !a.released && t.action !== "skill2" && (a.on = !1);
		}
		let c = this._sky;
		if (c.on) {
			t.action === "skill3" && !c.ended ? c.t = t.t : c.t += e, c.flare *= Math.exp(-e / .12);
			let n = Math.floor(c.t * 60 + 1e-6), r = c.last;
			if (c.sword >= 0 && !c.landed && n > l.swordAt && n < l.land && (n - l.swordAt) % 4 == 0 && r < n && this.sys.burst("heroHoly", c.sx, c.py + C.length * .4, c.sz, 4), i.crossed(r, n, 20) && !c.landed && t.action === "skill3") {
				let e = t.player.position;
				this.hfx.pair({
					tag: "skyfall",
					frame: "heroGale",
					x: e.x + t._leapX * .6,
					y: e.y + t._lift + .9,
					z: e.z + t._leapZ * .6,
					vx: t._leapX * 3,
					vz: t._leapZ * 3,
					dirX: t._leapX,
					dirZ: t._leapZ,
					life: .15,
					strip: .12,
					s0: 1.05,
					s1: 1.2,
					color: u.goldBody,
					fadeOut: .06
				}, "heroGaleLit", this._gold(u.runeLit));
			}
			if (i.crossed(r, n, l.rise)) {
				let e = this._get(c.star);
				e && (e.life = Math.min(e.life, e.t + .06));
			}
			if (c.landed && c.sword >= 0) {
				if (n < C.release && (n - l.land) % 6 == 3 && r < n) {
					let e = c.py + 1 + this.rng.next() * 5;
					this.sys.burst("heroMote", c.sx, e, c.sz, 3);
				}
				i.crossed(r, n, C.release) && (c.released = !0, c.blink = _.sBlink), c.released && (n - C.release) % 3 == 0 && r < n && this.sys.burst("heroMote", c.sx, c.py + c.dissolve * C.length * .82, c.sz, 4);
			}
			c.last = n;
			let a = c.sword >= 0 && c.t >= o(l.swordAt) + C.appear ? this._screens() : 0;
			c.screened = a > 0;
			let s = e / C.screenEase * C.screenGhost;
			c.ghostK = a > c.ghostK ? Math.min(a, c.ghostK + s) : Math.max(a, c.ghostK - s), (c.sword >= 0 || c.ghosts[0] >= 0 || c.ghosts[1] >= 0) && this._placeSword(), this._skyLook(), c.sword < 0 && c.landed && c.dissolve >= 1 && this.lightOwner !== "skyfall" && !this._get(c.sigil) && (c.on = !1), c.sword < 0 && !c.landed && c.ended && (c.on = !1);
		}
		this._coolCrack(), this._glowFrame(e);
	}
	_crestFrame(e) {
		let t = this._get(e);
		t && t.kind === "wave" && (t.index = Math.floor(t.t * 24 + 1e-6) % 3);
	}
	lights(e) {
		if (this._settling = !1, this.light && !this.light.held && (this.light = null, this.lightOwner = ""), this.light) switch (this.lightOwner) {
			case "tempest":
				this._tempestLight(e);
				break;
			case "fang":
				this._fangLight(e);
				break;
			case "skyfall":
				this._skyLight(e);
				break;
			default: this._releaseField();
		}
		this._sparkLight(e);
	}
	_tempestLight(t) {
		let n = s, r = this._tem, i = this.light, a = this._lp, c = this.pc.player.position, l = b(y.cool);
		a.color = _.steel, a.decay = 1, a.flicker = 0;
		let u = o(n.total - n.release) + _.after;
		if (!r.on || r.released && r.t - r.relT > u) {
			this._releaseField();
			return;
		}
		if (r.t < 0) {
			a.intensity = _.tGather * D(r.st / o(n.bladesAt + 1)) * l, a.distance = _.tGatherDist, this._put(i, c.x, c.y + _.tGatherLift, c.z, a);
			return;
		}
		if (!r.released) {
			let t = .85 + .15 * e(Math.floor(r.t * 14), 37, 5), n = r.t * _.tW;
			a.intensity = (_.tGather + (_.tStorm - _.tGather) * D(r.t / .1)) * t * l, a.distance = _.tDist, this._put(i, c.x + Math.cos(n) * _.tOrbit, c.y + _.tLift, c.z + Math.sin(n) * _.tOrbit, a);
			return;
		}
		let d = O((r.t - r.relT) / (u - _.after)), f = (1 - d) * (1 - d), p = n.bladeR + 16 * (r.t - r.relT), m = r.a0 + n.spin * r.t;
		a.intensity = _.tStorm * f * l, a.distance = _.tDist, this._put(i, c.x + Math.cos(m) * p, c.y + _.tOutLift, c.z + Math.sin(m) * p, a);
	}
	_fangLight(t) {
		let n = this._fang, r = this.light, i = this._lp, a = this.pc, s = a.player.position, l = a._wave, u = b(y.warm);
		if (i.color = _.crimson, i.decay = 1, i.flicker = 0, !n.on) {
			this._releaseField();
			return;
		}
		if (!n.released) {
			i.intensity = _.fGather * D(n.t / o(c.release - 2)) * u, i.distance = _.fGatherDist, this._put(r, s.x, s.y + _.fGatherLift, s.z, i);
			return;
		}
		let d = 1;
		if (n.ended) {
			let e = (n.t - n.endT) / _.fOut;
			if (e >= 1 + _.after / _.fOut) {
				this._releaseField();
				return;
			}
			d = O(1 - e);
		} else l.alive && (n.x = l.x, n.y = l.y, n.z = l.z);
		let f = .85 + .25 * e(Math.floor(n.t * 16), 53, 9);
		i.intensity = _.fRide * f * u * d, i.distance = _.fDist, this._put(r, n.x, n.y + _.fLift, n.z, i);
	}
	_skyLight(e) {
		let t = this._sky, n = this.light, r = this._lp, i = this.pc._land;
		t.flash *= Math.exp(-e / _.sTau), t.blink *= Math.exp(-e / _.sBlinkTau);
		let a = f(), s = b(y.warm) * a;
		if (r.color = _.gold, r.flicker = 0, !t.on) {
			this._releaseField();
			return;
		}
		if (!t.landed) {
			let e = o(l.swordAt), a = O((t.t - e) / (o(l.land) - e));
			r.intensity = (_.sFall0 + (_.sFall1 - _.sFall0) * a) * s, r.distance = _.sDist0 + (_.sDist1 - _.sDist0) * a, r.decay = 1, this._put(n, t.sx, Math.max(i.y + _.sFallLift, t.py), t.sz, r);
			return;
		}
		if (t.sword < 0 && t.dissolve >= 1) {
			if (t.t > o(C.release) + C.dissolve + _.after) {
				this._releaseField();
				return;
			}
			n.off();
			return;
		}
		let c = t.flash / (_.sFlash - _.sHold), u = 1 + _.sPulse * Math.sin(A * _.sPulseHz * (t.t - t.landT));
		r.intensity = _.sHold * u * (1 - t.dissolve) * s + (t.flash + t.blink) * b(y.flash) * a, r.decay = _.sHoldDecay + (1 - _.sHoldDecay) * c, r.distance = _.sFlashDist, this._put(n, i.x, i.y + _.sFlashLift, i.z, r);
	}
	_sparkLight(e) {
		let t = this.spark;
		if (!t) return;
		this._sparkT += e;
		let n = this._sparkKind === "a3", r = n ? _.sparkT : _.draughtT;
		if (this._sparkT >= r || !t.held) {
			this._releaseSpark();
			return;
		}
		let i = this._lp;
		if (i.decay = 1, i.flicker = 0, n) {
			let e = 1 - this._sparkT / r;
			i.color = _.steel, i.intensity = _.sparkI * e * e * b(y.flash), i.distance = _.sparkDist;
		} else i.color = _.heal, i.intensity = _.draughtI * Math.exp(-this._sparkT / _.draughtTau) * b(y.warm), i.distance = _.draughtDist;
		this._put(t, this._sparkX, this._sparkY, this._sparkZ, i);
	}
	_glowFrame(e) {
		let t = this.pc, n = t.frame, r = 0;
		switch (t.action) {
			case "attack": {
				let e = t.combo === 3, i = e ? 10 : 5;
				n < i && (r = (e ? 1 : .6) * D(n / i));
				break;
			}
			case "skill1":
				n <= s.release && (r = 1.2 * D(n / 5));
				break;
			case "skill2":
				n < c.release && (r = 1.4 * D((n - 2) / (c.release - 2)));
				break;
			case "skill3": n < l.land && (r = 1.3 * D(n / 7));
		}
		this._kick > 0 && (this.glow = Math.max(this.glow, this._kick), this._kick = 0), this.glow = t.alive ? r >= this.glow ? r : r + (this.glow - r) * Math.exp(-e / x.tau) : 0, this.glow < .01 && (this.glow = 0), this._writeGlow(Math.min(x.max, this.glow));
	}
	_writeGlow(e) {
		let t = Math.round(e * 100) / 100;
		if (t === this._glowShown) return;
		this._glowShown = t;
		let n = this._glowRgb;
		this.pc.sprite?.setGlow?.(n[0], n[1], n[2], t);
	}
	info() {
		let e = this._tem, t = this._sky, n = 0;
		for (let t of e.blades) n += +(t.h >= 0) + +(t.g0 >= 0) + +(t.g1 >= 0);
		return n += +(t.sword >= 0) + +(t.ghosts[0] >= 0) + +(t.ghosts[1] >= 0), {
			effects: this.hfx.count,
			blades: n,
			sword: t.sword >= 0,
			screened: t.screened,
			ghost: +t.ghostK.toFixed(2),
			tempest: e.on,
			fang: this._fang.on,
			skyfall: t.on,
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
};
//#endregion
export { M as SwordStage, N as SwordmasterFx };
