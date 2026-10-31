import { M as e, kn as t, u as n } from "./three.core-CLamN2hY.js";
var r = class {
	constructor(t, { count: n = 4 } = {}) {
		this.lighting = t, this.group = new e(), this.group.name = "VfxLights", t.group.add(this.group), this._slots = [];
		for (let e = 0; e < n; e++) {
			let n = t.addPointLight({
				position: i,
				intensity: 0,
				distance: 8,
				decay: 1,
				flicker: 0,
				nightOnly: !1,
				seed: 7397 + e * 7919,
				flickerSpeed: 9,
				indexed: !1
			});
			this.group.add(n.light), n.fade = 0, n.tag = "vfx", n.desc = null, this._slots.push({
				handle: n,
				loan: null
			});
		}
	}
	get count() {
		return this._slots.length;
	}
	get handles() {
		return this._slots.map((e) => e.handle);
	}
	get held() {
		let e = 0;
		for (let t of this._slots) t.loan && e++;
		return e;
	}
	get lit() {
		let e = 0;
		for (let t of this._slots) t.loan && t.handle.light.intensity > 0 && e++;
		return e;
	}
	acquire({ minor: e = !1 } = {}) {
		let t = this._slots.find((e) => !e.loan);
		if (!t && !e && (t = this._slots.find((e) => e.loan.minor), t && this._park(t)), !t) return null;
		let n = { minor: e };
		t.loan = n;
		let r = t.handle, i = this.lighting, o = () => t.loan === n;
		return {
			set(e, t, n, { color: s = [
				.2,
				.45,
				1.7
			], intensity: c = 20, distance: l = 9, decay: u = 1, flicker: d = 0 } = {}) {
				o() && (r.fade = 1, i.retargetPointLight(r, {
					position: {
						x: e,
						y: t,
						z: n
					},
					color: Array.isArray(s) ? a.setRGB(s[0], s[1], s[2]) : s,
					intensity: c,
					distance: l,
					decay: u,
					flicker: d
				}));
			},
			off() {
				o() && (r.intensity = 0, r.light.intensity = 0);
			},
			release: () => {
				o() && this._park(t);
			},
			get held() {
				return o();
			}
		};
	}
	releaseAll() {
		for (let e of this._slots) e.loan && this._park(e);
	}
	dispose() {
		this.releaseAll();
		for (let e of this._slots) e.handle.dispose();
		this._slots.length = 0, this.group.removeFromParent();
	}
	_park(e) {
		e.loan = null;
		let t = e.handle;
		t.fade = 0, t.intensity = 0, t.light.intensity = 0, t.light.position.copy(i);
	}
}, i = new t(0, -500, 0), a = new n();
//#endregion
export { r as VfxLights };
