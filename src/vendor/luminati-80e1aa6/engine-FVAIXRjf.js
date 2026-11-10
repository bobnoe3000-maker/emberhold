import { t as e } from "./rolldown-runtime-Dy4uBu1J.js";
import { A as t, B as n, Bn as r, E as i, Ft as a, G as o, H as s, Hn as c, Ht as l, J as u, Jn as d, Lt as f, M as p, Pt as m, R as h, Rt as g, St as _, T as v, U as y, Un as b, V as x, W as S, X as C, Xt as w, Yn as T, Yt as ee, _ as te, bt as ne, c as re, f as ie, g as E, h as ae, hr as oe, ir as se, jn as ce, k as le, kn as ue, l as de, lr as fe, lt as pe, mr as D, o as me, pr as O, ut as he, vr as ge, wt as _e, xt as ve, yt as ye, zt as be } from "./three.core-CDiAvzro.js";
import { G as xe, K as Se, U as Ce } from "./SmallProps-Bhy5ZjLW.js";
import { i as we, n as Te } from "./Palette-D7TB3xJk.js";
import { a as k, c as A, o as Ee, p as De, r as Oe, t as j, u as ke } from "./math-Du_SWpiD.js";
import { r as M } from "./ThawField-BqwvXI8W.js";
import { a as Ae, r as je } from "./own-rp3p7qEo.js";
import "./AudioSystem-BNoOeJEp.js";
import { r as Me, t as Ne } from "./PixelCanvas-BggARGih.js";
import "./PropSprites-XFDD6avm.js";
import { i as Pe, n as Fe, r as Ie } from "./CharacterSprites-D8DGG2-o.js";
import "./Particles-DKjyxRwN.js";
import "./TileMap-Drkb1NXe.js";
import "./Props-CTxYYfQ3.js";
import "./House-CaKZMm_M.js";
import { a as Le, i as Re, n as ze, r as Be, t as Ve } from "./logo-CfzVN91L.js";
import { $ as He, A as Ue, B as We, C as Ge, Ct as Ke, D as qe, E as Je, F as Ye, G as Xe, H as Ze, I as Qe, J as $e, K as et, L as tt, M as nt, N as rt, O as it, P as at, Q as ot, R as st, S as ct, St as lt, T as ut, U as dt, V as ft, W as pt, X as mt, Y as ht, Z as gt, _ as _t, _t as vt, a as yt, at as bt, b as xt, bt as St, c as N, ct as Ct, d as wt, et as Tt, f as Et, ft as Dt, g as Ot, gt as kt, h as At, ht as P, i as jt, it as Mt, j as Nt, k as Pt, l as Ft, lt as It, m as F, mt as I, n as Lt, nt as L, o as Rt, ot as zt, p as Bt, q as Vt, rt as Ht, s as Ut, st as Wt, t as Gt, tt as Kt, u as qt, ut as Jt, vt as Yt, w as Xt, wt as Zt, x as Qt, xt as $t, y as en, yt as tn, z as nn } from "./core-C1cYbmwD.js";
import { a as rn, i as an, l as on, n as sn, o as cn, r as ln, u as R } from "./I18n-BeKB4FMa.js";
import { c as un, d as z, f as dn, m as B, o as fn, p as pn, s as V, t as mn, u as hn } from "./gilt-DNFH9voM.js";
import { n as gn, t as _n } from "./portrait-ChywqrAx.js";
import { a as vn, c as yn, d as bn, i as xn, m as Sn, n as Cn, o as wn, p as Tn, r as En, s as Dn, t as On, u as kn } from "./minimap-CBFghrAn.js";
//#region src/engine/core/EventEmitter.js
var An = class {
	constructor() {
		this._listeners = /* @__PURE__ */ new Map();
	}
	on(e, t) {
		if (typeof t != "function") throw TypeError(`EventEmitter.on("${e}"): listener must be a function`);
		let n = this._listeners.get(e);
		return this._listeners.set(e, n ? [...n, t] : [t]), () => this.off(e, t);
	}
	off(e, t) {
		let n = this._listeners.get(e);
		if (!n) return;
		if (t === void 0) {
			this._listeners.delete(e);
			return;
		}
		let r = n.findIndex((e) => e === t || e._onceOriginal === t);
		r < 0 || (n.length === 1 ? this._listeners.delete(e) : this._listeners.set(e, n.filter((e, t) => t !== r)));
	}
	once(e, t) {
		if (typeof t != "function") throw TypeError(`EventEmitter.once("${e}"): listener must be a function`);
		let n = this;
		function r() {
			return n.off(e, r), t.apply(this, arguments);
		}
		return r._onceOriginal = t, this.on(e, r), () => this.off(e, r);
	}
	emit(e, t, n, r, i) {
		let a = this._listeners.get(e);
		if (a === void 0) return !1;
		let o = arguments.length - 1, s = o > 4 ? Array.prototype.slice.call(arguments, 1) : null;
		for (let e = 0; e < a.length; e++) {
			let c = a[e];
			switch (o) {
				case 0:
					c.call(this);
					break;
				case 1:
					c.call(this, t);
					break;
				case 2:
					c.call(this, t, n);
					break;
				case 3:
					c.call(this, t, n, r);
					break;
				case 4:
					c.call(this, t, n, r, i);
					break;
				default: c.apply(this, s);
			}
		}
		return !0;
	}
	listeners(e) {
		return this._listeners.get(e) ?? jn;
	}
	listenerCount(e) {
		return this._listeners.get(e)?.length ?? 0;
	}
	clear() {
		this._listeners.clear();
	}
}, jn = Object.freeze([]), Mn = Object.freeze({
	up: ["KeyW", "ArrowUp"],
	down: ["KeyS", "ArrowDown"],
	left: ["KeyA", "ArrowLeft"],
	right: ["KeyD", "ArrowRight"],
	run: ["ShiftLeft", "ShiftRight"],
	confirm: [
		"Space",
		"Enter",
		"KeyF"
	],
	choose: ["Enter", "KeyF"],
	cancel: ["Escape", "Backspace"],
	camLeft: ["KeyQ"],
	camRight: ["KeyE"],
	zoomIn: ["KeyZ", "Equal"],
	zoomOut: ["KeyX", "Minus"],
	debug: ["Backquote", "F1"],
	time: ["KeyT"],
	photo: ["KeyP"],
	help: ["KeyH"],
	weather: ["KeyR"],
	music: ["KeyM"],
	map: ["KeyN", "Tab"]
}), Nn = (e) => Object.fromEntries(Object.entries(e).map(([e, t]) => [e, [...t]]));
function Pn(e) {
	if (!e || e.nodeType !== 1) return !1;
	if (e.isContentEditable) return !0;
	let t = e.tagName;
	if (t === "TEXTAREA" || t === "SELECT") return !0;
	if (t === "INPUT") {
		let t = (e.type || "text").toLowerCase();
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
		].includes(t);
	}
	return !1;
}
var Fn = class {
	constructor(e = window, t = {}) {
		this.target = e, this.enabled = !0, this.bindings = Nn(Mn), this.wheelIgnoreSelector = t.wheelIgnoreSelector ?? ".lil-gui, input, textarea, select, [contenteditable], [data-input-ignore]", this.wheelDelta = 0, this.pointer = {
			x: 0,
			y: 0,
			down: !1,
			buttons: 0,
			inside: !1
		}, this._down = /* @__PURE__ */ new Set(), this._pressed = /* @__PURE__ */ new Set(), this._released = /* @__PURE__ */ new Set(), this._move = {
			x: 0,
			y: 0
		}, this._boundCodes = /* @__PURE__ */ new Set(), this._boundCacheKey = "", this.lastDevice = "keyboard", this._mouseTarget = null, this._mouseDown = /* @__PURE__ */ new Set(), this._onKeyDown = this._onKeyDown.bind(this), this._onKeyUp = this._onKeyUp.bind(this), this._onBlur = this._onBlur.bind(this), this._onVisibility = this._onVisibility.bind(this), this._onWheel = this._onWheel.bind(this), this._onPointerMove = this._onPointerMove.bind(this), this._onPointerDown = this._onPointerDown.bind(this), this._onPointerUp = this._onPointerUp.bind(this), this._onPointerLeave = this._onPointerLeave.bind(this);
		let n = e;
		n.addEventListener("keydown", this._onKeyDown), n.addEventListener("keyup", this._onKeyUp), n.addEventListener("wheel", this._onWheel, { passive: !0 }), n.addEventListener("pointermove", this._onPointerMove, { passive: !0 }), n.addEventListener("pointerdown", this._onPointerDown, { passive: !0 }), n.addEventListener("pointerup", this._onPointerUp, { passive: !0 }), n.addEventListener("pointercancel", this._onPointerUp, { passive: !0 }), typeof window < "u" && (window.addEventListener("blur", this._onBlur), document.addEventListener("visibilitychange", this._onVisibility), document.documentElement.addEventListener("pointerleave", this._onPointerLeave));
	}
	isDown(e) {
		return this.enabled && this._down.has(e);
	}
	wasPressed(e) {
		return this.enabled && this._pressed.has(e);
	}
	wasReleased(e) {
		return this.enabled && this._released.has(e);
	}
	anyPressed() {
		return this.enabled && this._pressed.size > 0;
	}
	action(e) {
		return this.enabled ? this._anyOf(this.bindings[e], this._down) : !1;
	}
	actionPressed(e) {
		return this.enabled ? this._anyOf(this.bindings[e], this._pressed) : !1;
	}
	actionReleased(e) {
		return this.enabled ? this._anyOf(this.bindings[e], this._released) : !1;
	}
	consumeAction(e) {
		let t = this.actionPressed(e);
		if (t) {
			let t = this.bindings[e];
			if (t) for (let e = 0; e < t.length; e++) this._pressed.delete(t[e]);
		}
		return t;
	}
	_anyOf(e, t) {
		if (!e) return !1;
		for (let n = 0; n < e.length; n++) if (t.has(e[n])) return !0;
		return !1;
	}
	getMoveVector(e = this._move) {
		if (e.x = 0, e.y = 0, !this.enabled) return e;
		let t = +!!this.action("right") - !!this.action("left"), n = +!!this.action("up") - !!this.action("down");
		if (t !== 0 && n !== 0) {
			t *= Math.SQRT1_2, n *= Math.SQRT1_2;
			let e = Math.hypot(t, n);
			e > 1 && (t /= e, n /= e);
		}
		return e.x = t, e.y = n, e;
	}
	addBindings(e = {}) {
		for (let [t, n] of Object.entries(e ?? {})) this.bindings[t] = [...n ?? []];
		this._boundCacheKey = "";
	}
	enableMouseButtons(e) {
		e && typeof window < "u" && (this._mouseTarget && this._disableMouseButtons(), this._mouseTarget = e, this._onMouseDown ??= this._mouseDownEdge.bind(this), this._onMouseMove ??= this._mouseChord.bind(this), this._onMouseUp ??= this._mouseUpEdge.bind(this), this._onContextMenu ??= (e) => e.preventDefault(), this._onAuxDown ??= (e) => {
			e.button === 1 && e.preventDefault();
		}, window.addEventListener("pointerdown", this._onMouseDown, {
			capture: !0,
			passive: !0
		}), window.addEventListener("pointermove", this._onMouseMove, {
			capture: !0,
			passive: !0
		}), window.addEventListener("pointerup", this._onMouseUp, {
			capture: !0,
			passive: !0
		}), window.addEventListener("pointercancel", this._onMouseUp, {
			capture: !0,
			passive: !0
		}), e.addEventListener("contextmenu", this._onContextMenu), e.addEventListener("mousedown", this._onAuxDown));
	}
	saveBindings() {
		return { keyboard: Nn(this.bindings) };
	}
	restoreBindings(e) {
		this.bindings = Nn(e.keyboard), this._boundCacheKey = "";
	}
	disableMouseButtons() {
		this._disableMouseButtons();
	}
	_disableMouseButtons() {
		let e = this._mouseTarget;
		if (e) {
			window.removeEventListener("pointerdown", this._onMouseDown, { capture: !0 }), window.removeEventListener("pointermove", this._onMouseMove, { capture: !0 }), window.removeEventListener("pointerup", this._onMouseUp, { capture: !0 }), window.removeEventListener("pointercancel", this._onMouseUp, { capture: !0 }), e.removeEventListener("contextmenu", this._onContextMenu), e.removeEventListener("mousedown", this._onAuxDown);
			for (let e of this._mouseDown) this._releaseCode(e);
			this._mouseDown.clear(), this._mouseTarget = null;
		}
	}
	_mouseDownEdge(e) {
		e.target === this._mouseTarget && this._pressMouse(e.button);
	}
	_mouseChord(e) {
		let t = e.button;
		if (!(t >= 0 && t <= 2)) return;
		let n = t === 1 ? 4 : t === 2 ? 2 : 1;
		e.buttons & n ? e.target === this._mouseTarget && this._pressMouse(t) : this._releaseCode(`Mouse${t}`);
	}
	_mouseUpEdge(e) {
		let t = e.button;
		if (t >= 0 && t <= 2 && this._releaseCode(`Mouse${t}`), this._mouseDown.size && typeof e.buttons == "number") for (let t of this._mouseDown) {
			let n = +t.charAt(5), r = n === 1 ? 4 : n === 2 ? 2 : 1;
			e.buttons & r || this._releaseCode(t);
		}
	}
	_pressMouse(e) {
		if (!(e >= 0 && e <= 2)) return;
		let t = `Mouse${e}`;
		this._down.has(t) || (this._down.add(t), this._mouseDown.add(t), this._pressed.add(t), this.lastDevice = "mouse");
	}
	_releaseCode(e) {
		this._mouseDown.delete(e), this._down.delete(e) && this._released.add(e);
	}
	endFrame() {
		this._pressed.size && this._pressed.clear(), this._released.size && this._released.clear(), this.wheelDelta = 0;
	}
	reset() {
		for (let e of this._down) this._released.add(e);
		this._down.clear(), this._mouseDown.clear(), this.pointer.down = !1, this.pointer.buttons = 0, this.wheelDelta = 0;
	}
	dispose() {
		let e = this.target;
		e.removeEventListener("keydown", this._onKeyDown), e.removeEventListener("keyup", this._onKeyUp), e.removeEventListener("wheel", this._onWheel), e.removeEventListener("pointermove", this._onPointerMove), e.removeEventListener("pointerdown", this._onPointerDown), e.removeEventListener("pointerup", this._onPointerUp), e.removeEventListener("pointercancel", this._onPointerUp), typeof window < "u" && (window.removeEventListener("blur", this._onBlur), document.removeEventListener("visibilitychange", this._onVisibility), document.documentElement.removeEventListener("pointerleave", this._onPointerLeave), this._disableMouseButtons()), this._down.clear(), this._mouseDown.clear(), this._pressed.clear(), this._released.clear();
	}
	_isBound(e) {
		let t = "";
		for (let e in this.bindings) t += e + ":" + this.bindings[e].join(",") + ";";
		if (t !== this._boundCacheKey) {
			this._boundCacheKey = t, this._boundCodes.clear();
			for (let e in this.bindings) for (let t of this.bindings[e]) this._boundCodes.add(t);
		}
		return this._boundCodes.has(e);
	}
	_onKeyDown(e) {
		let t = e.code;
		t && (Pn(e.target) || Pn(typeof document < "u" ? document.activeElement : null) || (!e.ctrlKey && !e.metaKey && !e.altKey && this._isBound(t) && e.preventDefault(), this._down.has(t) || (this._down.add(t), e.repeat || (this._pressed.add(t), this.lastDevice = "keyboard"))));
	}
	_onKeyUp(e) {
		let t = e.code;
		t && (this._down.has(t) && (this._down.delete(t), this._released.add(t)), !Pn(e.target) && !e.ctrlKey && !e.metaKey && !e.altKey && this._isBound(t) && e.preventDefault());
	}
	_onBlur() {
		this.reset();
	}
	_onVisibility() {
		document.visibilityState === "hidden" && this.reset();
	}
	_onWheel(e) {
		if (!this.enabled) return;
		let t = e.target;
		if (t && t.closest && this.wheelIgnoreSelector && t.closest(this.wheelIgnoreSelector)) return;
		let n = e.deltaY;
		e.deltaMode === 1 ? n *= 16 : e.deltaMode === 2 && (n *= 400), this.wheelDelta += n;
	}
	_onPointerMove(e) {
		this.pointer.x = e.clientX, this.pointer.y = e.clientY, this.pointer.inside = !0;
	}
	_onPointerDown(e) {
		this.pointer.x = e.clientX, this.pointer.y = e.clientY, this.pointer.down = !0, this.pointer.buttons = e.buttons, this.pointer.inside = !0;
	}
	_onPointerUp(e) {
		this.pointer.x = e.clientX, this.pointer.y = e.clientY, this.pointer.buttons = e.buttons ?? 0, this.pointer.down = this.pointer.buttons !== 0;
	}
	_onPointerLeave() {
		this.pointer.inside = !1;
	}
}, In = 1 / 20, Ln = class {
	constructor(e = {}) {
		this.opts = e, this.container = e.container ?? document.body, this.maxPixelRatio = e.maxPixelRatio ?? 1.5, this._renderScale = k(e.renderScale ?? 1, .25, 1);
		let t = new Se({
			antialias: !1,
			powerPreference: "high-performance",
			stencil: !1,
			preserveDrawingBuffer: !!e.preserveDrawingBuffer
		});
		t.shadowMap.enabled = !0;
		let n = e.shadowMapType ?? 1;
		n === 2 && (n = 1), t.shadowMap.type = n, t.toneMapping = 4, t.toneMappingExposure = 1, t.outputColorSpace = r, t.setClearColor(e.clearColor ?? 724506, 1), this.renderer = t;
		let i = t.domElement;
		i.classList.add("luminati-canvas"), i.style.display = "block", i.style.width = "100%", i.style.height = "100%", i.style.touchAction = "none", i.style.outline = "none", this._isFullWindow() && (i.style.position = "fixed", i.style.left = "0", i.style.top = "0"), i.tabIndex = -1, this.container.appendChild(i), this.scene = new c(), this.camera = new a(28, 1, .5, 400), this.camera.position.set(0, 12.7, 20.4), this.camera.lookAt(0, 0, 0), this.input = new Fn(e.inputTarget ?? window), this.events = new An(), this.time = {
			elapsed: 0,
			delta: 0,
			frame: 0,
			timeScale: 1,
			realDelta: 0,
			realElapsed: 0,
			fps: 60
		}, this._systems = [], this._seq = 0, this._renderFn = null, this._failed = /* @__PURE__ */ new WeakMap(), this._running = !1, this._manual = !!(e.manualStep ?? (Rn("fixedstep") && (Rn("autostart") || Rn("debug")))), this._startedOnce = !1, this._lastNow = -1, this._disposed = !1, this._width = 1, this._height = 1, this._pixelRatio = 1, this.resizeThrottleMs = 0, this._lastResizeAt = -Infinity, this._resizeTimer = 0, this._tick = this._tick.bind(this), this._onWindowResize = () => this._resize(), this._onContextLost = (e) => {
			e.preventDefault(), console.warn("[Engine] WebGL context lost"), this.events.emit("contextlost");
		}, this._onContextRestored = () => {
			console.warn("[Engine] WebGL context restored"), this.events.emit("contextrestored");
		}, i.addEventListener("webglcontextlost", this._onContextLost), i.addEventListener("webglcontextrestored", this._onContextRestored), this._resizeObserver = null, typeof ResizeObserver < "u" && !this._isFullWindow() && (this._resizeObserver = new ResizeObserver(() => this._resize()), this._resizeObserver.observe(this.container)), window.addEventListener("resize", this._onWindowResize), this._resize(!0);
		let o = e.exposeGlobal;
		if (o === void 0) try {
			let e = new URLSearchParams(window.location.search);
			o = e.has("debug") || e.has("autostart");
		} catch {
			o = !1;
		}
		o && (window.__engine = this);
	}
	get width() {
		return this._width;
	}
	get height() {
		return this._height;
	}
	get pixelRatio() {
		return this._pixelRatio;
	}
	get aspect() {
		return this._width / Math.max(1, this._height);
	}
	get drawingBufferSize() {
		return this._dbs ??= new O(), this.renderer.getDrawingBufferSize(this._dbs);
	}
	get canvas() {
		return this.renderer.domElement;
	}
	get renderScale() {
		return this._renderScale;
	}
	set renderScale(e) {
		let t = k(Number(e) || 1, .25, 1);
		t !== this._renderScale && (this._renderScale = t, this._resize(!0));
	}
	_isFullWindow() {
		return this.container === document.body || this.container === document.documentElement;
	}
	_measure() {
		let e, t;
		if (this._isFullWindow()) e = window.innerWidth, t = window.innerHeight;
		else if (e = this.container.clientWidth, t = this.container.clientHeight, !e || !t) {
			let n = this.container.getBoundingClientRect();
			e = n.width || window.innerWidth, t = n.height || window.innerHeight;
		}
		return [Math.max(1, Math.floor(e)), Math.max(1, Math.floor(t))];
	}
	_resize(e = !1) {
		if (this._disposed) return;
		if (!e && this.resizeThrottleMs > 0) {
			let e = (this._lastResizeAt ?? -Infinity) + this.resizeThrottleMs - performance.now();
			if (e > 0) {
				this._resizeTimer ||= setTimeout(() => {
					this._resizeTimer = 0, this._resize();
				}, e);
				return;
			}
		}
		let [t, n] = this._measure(), r = typeof window < "u" && window.devicePixelRatio || 1, i = Math.min(r, this.maxPixelRatio) * this._renderScale;
		(e || t !== this._width || n !== this._height || i !== this._pixelRatio) && (this._lastResizeAt = performance.now(), this._width = t, this._height = n, this._pixelRatio = i, this.renderer.getPixelRatio() !== i && this.renderer.setPixelRatio(i), this.renderer.setSize(t, n, !1), this.camera.aspect = t / n, this.camera.updateProjectionMatrix(), this.events.emit("resize", {
			width: t,
			height: n,
			pixelRatio: i
		}));
	}
	resize() {
		this._resize(!0);
	}
	addSystem(e, t = 0) {
		if (!e || typeof e != "object" && typeof e != "function") throw TypeError("Engine.addSystem: system must be an object");
		let n = this._systems.find((t) => t.system === e), r = n ? {
			...n,
			order: t
		} : {
			system: e,
			order: t,
			seq: this._seq++,
			name: e.name || e.constructor?.name || "system"
		}, i = this._systems.filter((t) => t.system !== e);
		return i.push(r), i.sort((e, t) => e.order - t.order || e.seq - t.seq), this._systems = i, e;
	}
	removeSystem(e) {
		let t = this._systems.filter((t) => t.system !== e), n = t.length !== this._systems.length;
		return this._systems = t, n;
	}
	get systems() {
		return this._systems.map((e) => e.system);
	}
	setRenderFn(e) {
		this._renderFn = typeof e == "function" ? e : null;
	}
	start() {
		return this._running || this._disposed ? this : (this._running = !0, this._lastNow = -1, this._startedOnce || (this._startedOnce = !0, this._resize(!0)), this._manual || this.renderer.setAnimationLoop(this._tick), this.events.emit("start"), this);
	}
	stop() {
		return this._running ? (this._running = !1, this.renderer.setAnimationLoop(null), this.events.emit("stop"), this) : this;
	}
	get running() {
		return this._running;
	}
	get manualStep() {
		return this._manual;
	}
	set manualStep(e) {
		let t = !!e;
		t === this._manual || this._disposed || (this._manual = t, this._running && (this._lastNow = -1, this.renderer.setAnimationLoop(t ? null : this._tick)));
	}
	step(e = 1 / 60, { render: t = !0 } = {}) {
		this._disposed || this._frame(e, t);
	}
	redraw() {
		this._disposed || this._draw(0, this.time.elapsed);
	}
	_tick(e) {
		this._lastNow < 0 && (this._lastNow = e);
		let t = (e - this._lastNow) / 1e3;
		this._lastNow = e, this._frame(t);
	}
	_frame(e, t = !0) {
		let n = this.time, r = e > 0 && Number.isFinite(e) ? e : 0, i = (r > In ? In : r) * n.timeScale;
		n.realDelta = r, n.realElapsed += r, n.delta = i, n.elapsed += i, n.frame++, r > 0 && (n.fps += (1 / r - n.fps) * .05);
		let a = n.elapsed, o = this._systems;
		for (let e = 0; e < o.length; e++) {
			let t = o[e].system;
			if (typeof t.update == "function") try {
				t.update(i, a, this);
			} catch (t) {
				this._report(o[e].system, "update", `system "${o[e].name}"`, t);
			}
		}
		this._emitSafe("update", i, a);
		for (let e = 0; e < o.length; e++) {
			let t = o[e].system;
			if (typeof t.lateUpdate == "function") try {
				t.lateUpdate(i, a, this);
			} catch (t) {
				this._report(o[e].system, "lateUpdate", `system "${o[e].name}"`, t);
			}
		}
		this._emitSafe("lateUpdate", i, a), !this._disposed && (M.uTime.value = a, t && this._draw(i, a), this.input.endFrame());
	}
	_draw(e, t) {
		this._emitSafe("beforeRender", e, t);
		try {
			this._renderFn ? this._renderFn(e, t) : this.renderer.render(this.scene, this.camera);
		} catch (e) {
			this._report(this._renderFn ?? this.renderer, "render", "render function", e);
		}
		this._emitSafe("afterRender", e, t);
	}
	_emitSafe(e, t, n) {
		let r = this.events.listeners(e);
		for (let i = 0; i < r.length; i++) {
			let a = r[i];
			try {
				a.call(this.events, t, n);
			} catch (t) {
				this._report(a, e, `'${e}' listener ${a.name ? `"${a.name}"` : "(anonymous)"}`, t);
			}
		}
	}
	_report(e, t, n, r) {
		let i = this._failed.get(e);
		if (i || (i = /* @__PURE__ */ new Set(), this._failed.set(e, i)), !i.has(t)) {
			i.add(t), console.error(`[Engine] ${n} threw in ${t} (further errors from it are suppressed):`, r);
			try {
				this.events.emit("error", {
					label: n,
					phase: t,
					error: r
				});
			} catch {}
		}
	}
	dispose({ disposeScene: e = !0 } = {}) {
		if (this._disposed) return;
		this.stop();
		try {
			this.events.emit("dispose");
		} catch (e) {
			console.error("[Engine] 'dispose' listener threw:", e);
		}
		this._disposed = !0;
		let t = this._systems;
		for (let e = t.length - 1; e >= 0; e--) {
			let n = t[e].system;
			if (typeof n.dispose == "function") try {
				n.dispose();
			} catch (n) {
				console.error(`[Engine] system "${t[e].name}" threw in dispose:`, n);
			}
		}
		this._systems = [], this.input.dispose(), this._resizeObserver?.disconnect(), this._resizeObserver = null, clearTimeout(this._resizeTimer), window.removeEventListener("resize", this._onWindowResize), e && zn(this.scene), this.scene.clear();
		let n = this.renderer.domElement;
		n.removeEventListener("webglcontextlost", this._onContextLost), n.removeEventListener("webglcontextrestored", this._onContextRestored), this.renderer.renderLists.dispose(), this.renderer.dispose();
		try {
			this.renderer.forceContextLoss();
		} catch {}
		n.remove(), this.events.clear(), typeof window < "u" && window.__engine === this && delete window.__engine;
	}
};
function Rn(e) {
	try {
		let t = new URLSearchParams(window.location.search);
		return t.has(e) && t.get(e) !== "0";
	} catch {
		return !1;
	}
}
function zn(e) {
	let t = /* @__PURE__ */ new Set(), n = (e) => {
		e && !t.has(e) && typeof e.dispose == "function" && (t.add(e), e.dispose());
	}, r = (e) => {
		if (e && !t.has(e)) {
			for (let t of Object.keys(e)) {
				let r = e[t];
				r && r.isTexture && n(r);
			}
			if (e.uniforms) for (let t of Object.values(e.uniforms)) {
				let e = t?.value;
				e && e.isTexture && n(e);
			}
			n(e);
		}
	};
	e.traverse((e) => {
		e.geometry && n(e.geometry);
		let t = e.material;
		Array.isArray(t) ? t.forEach(r) : r(t), e.customDepthMaterial && r(e.customDepthMaterial), e.customDistanceMaterial && r(e.customDistanceMaterial), e.isLight && e.shadow?.map && e.shadow.dispose(), e.isInstancedMesh && e.dispose?.();
	});
	let i = e.background;
	i && i.isTexture && n(i);
	let a = e.environment;
	a && a.isTexture && n(a);
}
//#endregion
//#region src/engine/core/CameraRig.js
var Bn = new D(), Vn = new D(), Hn = new D(), Un = new D(), Wn = new D(), Gn = new D(), Kn = Math.PI * 2, qn = Object.freeze({
	inOut: (e) => (1 - Math.cos(Math.PI * e)) / 2,
	in: (e) => 1 - Math.cos(Math.PI / 2 * e),
	out: (e) => Math.sin(Math.PI / 2 * e),
	linear: (e) => e
}), Jn = Object.freeze({
	minPitch: 2,
	maxPitch: 85,
	minDistance: 4,
	maxDistance: 90,
	minFov: 12,
	maxFov: 70,
	minLift: -10,
	maxLift: 30
}), Yn = (e, t) => e + Math.round((t - e) / Kn) * Kn, Xn = class {
	constructor(e, t = {}) {
		this.camera = e, this.name = "CameraRig";
		let n = t;
		this.minDistance = n.minDistance ?? 14, this.maxDistance = n.maxDistance ?? 36, this.followLambda = n.followLambda ?? 5, this.followLambdaY = n.followLambdaY ?? (n.followLambda ?? 5) * .7, this.lookAhead = n.lookAhead ?? 1, this.lookAheadSpeed = n.lookAheadSpeed ?? 4, this.lookAheadLambda = n.lookAheadLambda ?? 2.2, this.velocityLambda = 8, this.targetOffsetY = n.targetOffsetY ?? 1, this.freeYaw = !!n.freeYaw, this.yawLimit = (n.yawLimit ?? 60) * j, this.rotateSpeed = (n.rotateSpeed ?? 70) * j, this.rotateLambda = n.rotateLambda ?? 7, this.pitchLambda = n.pitchLambda ?? 6, this.zoomLambda = n.zoomLambda ?? 6, this.zoomKeySpeed = n.zoomKeySpeed ?? 14, this.wheelZoomScale = n.wheelZoomScale ?? .012, this.minPitch = (n.minPitch ?? 8) * j, this.maxPitch = (n.maxPitch ?? 80) * j, this.autoSnapDistance = n.autoSnapDistance ?? 8, this.inputEnabled = !0;
		let r = (n.yaw ?? 0) * j, i = k((n.pitch ?? 32) * j, this.minPitch, this.maxPitch), a = k(n.distance ?? 24, this.minDistance, this.maxDistance);
		this.yawCenter = r, this.focusPoint = new D(), this.yaw = r, this.pitch = i, this.distance = a, this.yawTarget = r, this.pitchTarget = i, this.distanceTarget = a, this.bounds = null, this.target = null, this.velocity = new D(), this.lookOffset = new D(), this._prevTarget = new D(), this._hasPrev = !1, this._shake = {
			intensity: 0,
			duration: 0,
			time: 0,
			seed: 0
		}, this._shakeClock = 0, this.shakeFrequency = 14, this._basis = {
			forward: new D(0, 0, -1),
			right: new D(1, 0, 0)
		}, this.lift = 0, this.framingRate = 1, this._fr = null, this._lookPoint = new D(), (n.fov !== void 0 || e.fov !== 28) && (e.fov = n.fov ?? 28, e.updateProjectionMatrix()), this._apply(0);
	}
	setTarget(e) {
		return this.target = e ?? null, this._hasPrev = !1, this.velocity.set(0, 0, 0), this;
	}
	rotate(e) {
		return this.yawTarget += e, this._clampYaw(), this;
	}
	zoom(e) {
		return this.distanceTarget = k(this.distanceTarget + e, this.minDistance, this.maxDistance), this;
	}
	zoomIn(e = 2) {
		return this.zoom(-e);
	}
	zoomOut(e = 2) {
		return this.zoom(e);
	}
	shake(e, t = .4) {
		let n = this._shake;
		return e >= (n.duration > 0 ? n.intensity * (1 - Math.min(1, n.time / n.duration)) ** 2 : 0) && (n.intensity = e, n.duration = Math.max(.01, t), n.time = 0, n.seed = (n.seed + 1) % 997), this;
	}
	snap() {
		return this.yaw = this.yawTarget, this.pitch = this.pitchTarget, this.distance = this.distanceTarget, this.lookOffset.set(0, 0, 0), this.velocity.set(0, 0, 0), this.target && this._targetPosition(Bn) && (this._prevTarget.copy(Bn), this._hasPrev = !0, this.focusPoint.set(Bn.x, Bn.y + this.targetOffsetY, Bn.z)), this._clampToBounds(this.focusPoint), this._apply(0), this;
	}
	update(e, t, n) {
		if ((typeof t != "object" || !t) && (t = n?.input ?? null), e = e > 0 ? e : 0, t && this.inputEnabled && t.enabled !== !1 && !this._fr) {
			let n = 0;
			t.action("camLeft") && --n, t.action("camRight") && (n += 1), n !== 0 && this.rotate(k(n, -1, 1) * this.rotateSpeed * e);
			let r = 0;
			t.action("zoomIn") && --r, t.action("zoomOut") && (r += 1), r !== 0 && this.zoom(r * this.zoomKeySpeed * e), t.wheelDelta && this.zoom(t.wheelDelta * this.wheelZoomScale);
		}
		if (this.target && this._targetPosition(Bn)) {
			if (this._hasPrev ||= (this._prevTarget.copy(Bn), !0), Math.hypot(Bn.x - this._prevTarget.x, Bn.z - this._prevTarget.z) > this.autoSnapDistance) return this._prevTarget.copy(Bn), this.snap(), this;
			e > 0 && (Vn.set((Bn.x - this._prevTarget.x) / e, 0, (Bn.z - this._prevTarget.z) / e), this.velocity.lerp(Vn, Ee(this.velocityLambda, e))), this._prevTarget.copy(Bn);
			let t = Math.hypot(this.velocity.x, this.velocity.z), n = 0, r = 0;
			if (t > .05 && this.lookAhead > 0) {
				let e = this.lookAhead * Math.min(1, t / this.lookAheadSpeed) / t;
				n = this.velocity.x * e, r = this.velocity.z * e;
			}
			let i = Ee(this.lookAheadLambda, e);
			this.lookOffset.x += (n - this.lookOffset.x) * i, this.lookOffset.z += (r - this.lookOffset.z) * i, Hn.set(Bn.x + this.lookOffset.x, Bn.y + this.targetOffsetY, Bn.z + this.lookOffset.z), this._clampToBounds(Hn);
			let a = Ee(this.followLambda, e), o = Ee(this.followLambdaY, e);
			this.focusPoint.x += (Hn.x - this.focusPoint.x) * a, this.focusPoint.y += (Hn.y - this.focusPoint.y) * o, this.focusPoint.z += (Hn.z - this.focusPoint.z) * a;
		}
		return this._clampToBounds(this.focusPoint), this._fr ? this._stepFraming(e) : (this._clampYaw(), this.pitchTarget = k(this.pitchTarget, this.minPitch, this.maxPitch), this.distanceTarget = k(this.distanceTarget, this.minDistance, this.maxDistance), this.yaw += (this.yawTarget - this.yaw) * Ee(this.rotateLambda, e), this.pitch += (this.pitchTarget - this.pitch) * Ee(this.pitchLambda, e), this.distance += (this.distanceTarget - this.distance) * Ee(this.zoomLambda, e)), this._apply(e), this;
	}
	get focusDistance() {
		return this.camera.position.distanceTo(this._lookPoint);
	}
	get framed() {
		return !!this._fr;
	}
	get orbitRate() {
		return this._fr ? this._fr.orbit / j : 0;
	}
	setFraming(e = {}, t = 0, n = "inOut") {
		let r = this._beginFraming(), i = Jn, a = this._framingNow(), o = { ...a }, s = e ?? {}, c = (e) => typeof e == "number" && Number.isFinite(e);
		return c(s.yaw) && (o.yaw = Yn(s.yaw * j, a.yaw)), c(s.pitch) && (o.pitch = k(s.pitch, i.minPitch, i.maxPitch) * j), c(s.distance) && (o.distance = k(s.distance, i.minDistance, i.maxDistance)), c(s.fov) && (o.fov = k(s.fov, i.minFov, i.maxFov)), c(s.lift) && (o.lift = k(s.lift, i.minLift, i.maxLift)), this._moveFraming(r, a, o, t, n, !1);
	}
	orbit(e) {
		let t = this._beginFraming();
		if (t.resetting) {
			let e = this._framingNow();
			this._moveFraming(t, e, { ...e }, 0, "inOut", !1);
		}
		return t.orbit = k(Number.isFinite(e) ? e : 0, -360, 360) * j, this;
	}
	resetFraming(e = .8, t = "inOut") {
		let n = this._fr;
		if (!n) return Promise.resolve();
		let r = n.saved, i = this._framingNow(), a = {
			yaw: Yn(r.yaw, i.yaw),
			pitch: r.pitch,
			distance: r.distance,
			fov: r.fov,
			lift: r.lift
		};
		return n.orbit = 0, this._moveFraming(n, i, a, e, t, !0);
	}
	endFraming() {
		let e = this._fr;
		if (!e) return this;
		this._fr = null;
		let t = e.saved;
		this.yaw = this.yawTarget = t.yaw, this.pitch = this.pitchTarget = t.pitch, this.distance = this.distanceTarget = t.distance, this.lift = t.lift, this._setFov(t.fov);
		for (let t of e.waiters.splice(0)) t();
		return this;
	}
	completeFraming() {
		let e = this._fr;
		return e ? (e.t = e.dur, this._stepFraming(0), this) : this;
	}
	_beginFraming() {
		if (this._fr) return this._fr;
		let e = {
			yaw: this.yawTarget,
			pitch: this.pitchTarget,
			distance: this.distanceTarget,
			fov: this.camera.fov,
			lift: this.lift
		}, t = this._framingNow();
		return this._fr = {
			from: t,
			to: { ...t },
			t: 0,
			dur: 0,
			ease: qn.inOut,
			orbit: 0,
			resetting: !1,
			waiters: [],
			saved: e
		}, this._fr;
	}
	_framingNow() {
		return {
			yaw: this.yaw,
			pitch: this.pitch,
			distance: this.distance,
			fov: this.camera.fov,
			lift: this.lift
		};
	}
	_moveFraming(e, t, n, r, i, a) {
		for (let t of e.waiters.splice(0)) t();
		e.from = t, e.to = n, e.t = 0, e.dur = Number.isFinite(r) && r > 0 ? r : 0, e.ease = Object.hasOwn(qn, i) ? qn[i] : qn.inOut, e.resetting = a;
		let o = new Promise((t) => {
			e.waiters.push(() => t(void 0));
		});
		return e.dur === 0 && this._stepFraming(0), o;
	}
	_stepFraming(e) {
		let t = this._fr;
		if (!t) return;
		let n = Math.max(0, e) * (Number.isFinite(this.framingRate) && this.framingRate > 0 ? this.framingRate : 1);
		if (t.t < t.dur && (t.t = Math.min(t.dur, t.t + n)), t.orbit && (t.from.yaw += t.orbit * n, t.to.yaw += t.orbit * n, Math.abs(t.to.yaw) > Kn * 2)) {
			let e = Math.trunc(t.to.yaw / Kn) * Kn;
			t.from.yaw -= e, t.to.yaw -= e;
		}
		let r = t.dur > 0 ? t.ease(t.t / t.dur) : 1, { from: i, to: a } = t;
		if (this.yaw = this.yawTarget = i.yaw + (a.yaw - i.yaw) * r, this.pitch = this.pitchTarget = i.pitch + (a.pitch - i.pitch) * r, this.distance = this.distanceTarget = i.distance + (a.distance - i.distance) * r, this.lift = i.lift + (a.lift - i.lift) * r, this._setFov(i.fov + (a.fov - i.fov) * r), t.t >= t.dur) {
			if (t.resetting) this.endFraming();
			else for (let e of t.waiters.splice(0)) e();
		}
	}
	_setFov(e) {
		Math.abs(this.camera.fov - e) < 1e-6 || (this.camera.fov = e, this.camera.updateProjectionMatrix());
	}
	getMoveBasis(e = this._basis) {
		let t = Math.sin(this.yaw), n = Math.cos(this.yaw);
		return e.forward.set(-t, 0, -n), e.right.set(n, 0, -t), e;
	}
	toWorldDirection(e, t, n = new D()) {
		let r = Math.sin(this.yaw), i = Math.cos(this.yaw);
		return n.set(i * e - r * t, 0, -r * e - i * t);
	}
	get fov() {
		return this.camera.fov;
	}
	set fov(e) {
		this.camera.fov = e, this.camera.updateProjectionMatrix();
	}
	setAngles(e, t = this.pitchTarget / j) {
		return this.yawTarget = e * j, this._clampYaw(), this.pitchTarget = k(t * j, this.minPitch, this.maxPitch), this;
	}
	get shakeAmount() {
		let e = this._shake;
		return e.duration <= 0 || e.time >= e.duration ? 0 : e.intensity * (1 - e.time / e.duration) ** 2;
	}
	dispose() {
		if (this.target = null, this._fr) for (let e of this._fr.waiters.splice(0)) e();
	}
	_targetPosition(e) {
		let t = this.target;
		if (!t) return !1;
		if (t.isObject3D) t.getWorldPosition(e);
		else if (t.isVector3) e.copy(t);
		else if (typeof t.x == "number") e.set(t.x, t.y ?? 0, t.z ?? 0);
		else return !1;
		return !0;
	}
	_clampYaw() {
		this.freeYaw || (this.yawTarget = k(this.yawTarget, this.yawCenter - this.yawLimit, this.yawCenter + this.yawLimit));
	}
	_clampToBounds(e) {
		let t = this.bounds;
		t && (e.x = k(e.x, t.minX, t.maxX), e.z = k(e.z, t.minZ, t.maxZ));
	}
	_apply(e) {
		let t = this.camera, n = Math.cos(this.pitch), r = Math.sin(this.pitch), i = Math.sin(this.yaw), a = Math.cos(this.yaw), o = this.distance, s = this._lookPoint.set(this.focusPoint.x, this.focusPoint.y + this.lift, this.focusPoint.z);
		t.position.set(s.x + i * n * o, s.y + r * o, s.z + a * n * o), Un.copy(s);
		let c = 0, l = this._shake;
		if (l.duration > 0 && l.time < l.duration) {
			l.time += e, this._shakeClock += e;
			let o = Math.min(1, l.time / l.duration), s = l.intensity * (1 - o) * (1 - o), u = this._shakeClock * this.shakeFrequency, d = (De(u, 3.1, l.seed) - .5) * 2, f = (De(u, 17.7, l.seed) - .5) * 2, p = (De(u * .7, 41.3, l.seed) - .5) * 2;
			Wn.set(a, 0, -i), Gn.set(-i * r, n, -a * r), t.position.addScaledVector(Wn, d * s).addScaledVector(Gn, f * s), Un.addScaledVector(Wn, d * s * .35).addScaledVector(Gn, f * s * .35), c = p * s * .02, o >= 1 && (l.intensity = 0);
		}
		t.lookAt(Un), c !== 0 && t.rotateZ(c), t.updateMatrixWorld(), M.uCameraYaw.value = this.yaw, M.uCameraPosition.value.copy(t.position);
	}
}, Zn = class {
	constructor() {
		this.isPass = !0, this.enabled = !0, this.needsSwap = !0, this.clear = !1, this.renderToScreen = !1;
	}
	setSize() {}
	render() {
		console.error("THREE.Pass: .render() must be implemented in derived pass.");
	}
	dispose() {}
}, Qn = new m(-1, 1, 1, -1, 0, 1), $n = new class extends de {
	constructor() {
		super(), this.setAttribute("position", new h([
			-1,
			3,
			0,
			-1,
			-1,
			0,
			3,
			-1,
			0
		], 3)), this.setAttribute("uv", new h([
			0,
			2,
			0,
			0,
			2,
			0
		], 2));
	}
}(), er = class {
	constructor(e) {
		this._mesh = new ne($n, e);
	}
	dispose() {
		this._mesh.geometry.dispose();
	}
	render(e) {
		e.render(this._mesh, Qn);
	}
	get material() {
		return this._mesh.material;
	}
	set material(e) {
		this._mesh.material = e;
	}
}, tr = {
	name: "CopyShader",
	uniforms: {
		tDiffuse: { value: null },
		opacity: { value: 1 }
	},
	vertexShader: "\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}",
	fragmentShader: "\n\n		uniform float opacity;\n\n		uniform sampler2D tDiffuse;\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vec4 texel = texture2D( tDiffuse, vUv );\n			gl_FragColor = opacity * texel;\n\n\n		}"
}, nr = {
	name: "LuminosityHighPassShader",
	uniforms: {
		tDiffuse: { value: null },
		luminosityThreshold: { value: 1 },
		smoothWidth: { value: 1 },
		defaultColor: { value: new E(0) },
		defaultOpacity: { value: 0 }
	},
	vertexShader: "\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}",
	fragmentShader: "\n\n		uniform sampler2D tDiffuse;\n		uniform vec3 defaultColor;\n		uniform float defaultOpacity;\n		uniform float luminosityThreshold;\n		uniform float smoothWidth;\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vec4 texel = texture2D( tDiffuse, vUv );\n\n			float v = luminance( texel.xyz );\n\n			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );\n\n			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );\n\n			gl_FragColor = mix( outputColor, texel, alpha );\n\n		}"
}, rr = class e extends Zn {
	constructor(e, t = 1, n, r) {
		super(), this.strength = t, this.radius = n, this.threshold = r, this.resolution = e === void 0 ? new O(256, 256) : new O(e.x, e.y), this.clearColor = new E(0, 0, 0), this.needsSwap = !1, this.renderTargetsHorizontal = [], this.renderTargetsVertical = [], this.nMips = 5;
		let i = Math.round(this.resolution.x / 2), a = Math.round(this.resolution.y / 2);
		this.renderTargetBright = new ge(i, a, {
			type: S,
			depthBuffer: !1
		}), this.renderTargetBright.texture.name = "UnrealBloomPass.bright", this.renderTargetBright.texture.generateMipmaps = !1;
		for (let e = 0; e < this.nMips; e++) {
			let t = new ge(i, a, {
				type: S,
				depthBuffer: !1
			});
			t.texture.name = "UnrealBloomPass.h" + e, t.texture.generateMipmaps = !1, this.renderTargetsHorizontal.push(t);
			let n = new ge(i, a, {
				type: S,
				depthBuffer: !1
			});
			n.texture.name = "UnrealBloomPass.v" + e, n.texture.generateMipmaps = !1, this.renderTargetsVertical.push(n), i = Math.round(i / 2), a = Math.round(a / 2);
		}
		let o = nr;
		this.highPassUniforms = se.clone(o.uniforms), this.highPassUniforms.luminosityThreshold.value = r, this.highPassUniforms.smoothWidth.value = .01, this.materialHighPassFilter = new b({
			uniforms: this.highPassUniforms,
			vertexShader: o.vertexShader,
			fragmentShader: o.fragmentShader
		}), this.separableBlurMaterials = [];
		let s = [
			6,
			10,
			14,
			18,
			22
		];
		i = Math.round(this.resolution.x / 2), a = Math.round(this.resolution.y / 2);
		for (let e = 0; e < this.nMips; e++) this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])), this.separableBlurMaterials[e].uniforms.invSize.value = new O(1 / i, 1 / a), i = Math.round(i / 2), a = Math.round(a / 2);
		this.compositeMaterial = this._getCompositeMaterial(this.nMips), this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture, this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture, this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture, this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture, this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture, this.compositeMaterial.uniforms.bloomStrength.value = t, this.compositeMaterial.uniforms.bloomRadius.value = .1;
		let c = [
			1,
			.8,
			.6,
			.4,
			.2
		];
		this.compositeMaterial.uniforms.bloomFactors.value = c, this.bloomTintColors = [
			new D(1, 1, 1),
			new D(1, 1, 1),
			new D(1, 1, 1),
			new D(1, 1, 1),
			new D(1, 1, 1)
		], this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, this.copyUniforms = se.clone(tr.uniforms), this.blendMaterial = new b({
			uniforms: this.copyUniforms,
			vertexShader: tr.vertexShader,
			fragmentShader: tr.fragmentShader,
			premultipliedAlpha: !0,
			blending: 2,
			depthTest: !1,
			depthWrite: !1,
			transparent: !0
		}), this._oldClearColor = new E(), this._oldClearAlpha = 1, this._basic = new ve(), this._fsQuad = new er(null);
	}
	dispose() {
		for (let e = 0; e < this.renderTargetsHorizontal.length; e++) this.renderTargetsHorizontal[e].dispose();
		for (let e = 0; e < this.renderTargetsVertical.length; e++) this.renderTargetsVertical[e].dispose();
		this.renderTargetBright.dispose();
		for (let e = 0; e < this.separableBlurMaterials.length; e++) this.separableBlurMaterials[e].dispose();
		this.compositeMaterial.dispose(), this.blendMaterial.dispose(), this._basic.dispose(), this._fsQuad.dispose();
	}
	setSize(e, t) {
		let n = Math.round(e / 2), r = Math.round(t / 2);
		this.renderTargetBright.setSize(n, r);
		for (let e = 0; e < this.nMips; e++) this.renderTargetsHorizontal[e].setSize(n, r), this.renderTargetsVertical[e].setSize(n, r), this.separableBlurMaterials[e].uniforms.invSize.value = new O(1 / n, 1 / r), n = Math.round(n / 2), r = Math.round(r / 2);
	}
	render(t, n, r, i, a) {
		t.getClearColor(this._oldClearColor), this._oldClearAlpha = t.getClearAlpha();
		let o = t.autoClear;
		t.autoClear = !1, t.setClearColor(this.clearColor, 0), a && t.state.buffers.stencil.setTest(!1), this.renderToScreen && (this._fsQuad.material = this._basic, this._basic.map = r.texture, t.setRenderTarget(null), t.clear(), this._fsQuad.render(t)), this.highPassUniforms.tDiffuse.value = r.texture, this.highPassUniforms.luminosityThreshold.value = this.threshold, this._fsQuad.material = this.materialHighPassFilter, t.setRenderTarget(this.renderTargetBright), t.clear(), this._fsQuad.render(t);
		let s = this.renderTargetBright;
		for (let n = 0; n < this.nMips; n++) this._fsQuad.material = this.separableBlurMaterials[n], this.separableBlurMaterials[n].uniforms.colorTexture.value = s.texture, this.separableBlurMaterials[n].uniforms.direction.value = e.BlurDirectionX, t.setRenderTarget(this.renderTargetsHorizontal[n]), t.clear(), this._fsQuad.render(t), this.separableBlurMaterials[n].uniforms.colorTexture.value = this.renderTargetsHorizontal[n].texture, this.separableBlurMaterials[n].uniforms.direction.value = e.BlurDirectionY, t.setRenderTarget(this.renderTargetsVertical[n]), t.clear(), this._fsQuad.render(t), s = this.renderTargetsVertical[n];
		this._fsQuad.material = this.compositeMaterial, this.compositeMaterial.uniforms.bloomStrength.value = this.strength, this.compositeMaterial.uniforms.bloomRadius.value = this.radius, this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, t.setRenderTarget(this.renderTargetsHorizontal[0]), t.clear(), this._fsQuad.render(t), this._fsQuad.material = this.blendMaterial, this.copyUniforms.tDiffuse.value = this.renderTargetsHorizontal[0].texture, a && t.state.buffers.stencil.setTest(!0), this.renderToScreen ? (t.setRenderTarget(null), this._fsQuad.render(t)) : (t.setRenderTarget(r), this._fsQuad.render(t)), t.setClearColor(this._oldClearColor, this._oldClearAlpha), t.autoClear = o;
	}
	_getSeparableBlurMaterial(e) {
		let t = [], n = e / 3;
		for (let r = 0; r < e; r++) t.push(.39894 * Math.exp(-.5 * r * r / (n * n)) / n);
		let r = [], i = [];
		for (let n = 1; n < e; n += 2) {
			let a = t[n], o = n + 1 < e ? t[n + 1] : 0, s = a + o;
			r.push((n * a + (n + 1) * o) / s), i.push(s);
		}
		return new b({
			defines: { KERNEL_PAIRS: r.length },
			uniforms: {
				colorTexture: { value: null },
				invSize: { value: new O(.5, .5) },
				direction: { value: new O(.5, .5) },
				centerWeight: { value: t[0] },
				gaussianOffsets: { value: r },
				gaussianWeights: { value: i }
			},
			vertexShader: "\n\n				varying vec2 vUv;\n\n				void main() {\n\n					vUv = uv;\n					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n				}",
			fragmentShader: "\n\n				#include <common>\n\n				varying vec2 vUv;\n\n				uniform sampler2D colorTexture;\n				uniform vec2 invSize;\n				uniform vec2 direction;\n				uniform float centerWeight;\n				uniform float gaussianOffsets[KERNEL_PAIRS];\n				uniform float gaussianWeights[KERNEL_PAIRS];\n\n				void main() {\n\n					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;\n\n					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {\n\n						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];\n						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;\n						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;\n						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];\n\n					}\n\n					gl_FragColor = vec4( diffuseSum, 1.0 );\n\n				}"
		});
	}
	_getCompositeMaterial(e) {
		return new b({
			defines: { NUM_MIPS: e },
			uniforms: {
				blurTexture1: { value: null },
				blurTexture2: { value: null },
				blurTexture3: { value: null },
				blurTexture4: { value: null },
				blurTexture5: { value: null },
				bloomStrength: { value: 1 },
				bloomFactors: { value: null },
				bloomTintColors: { value: null },
				bloomRadius: { value: 0 }
			},
			vertexShader: "\n\n				varying vec2 vUv;\n\n				void main() {\n\n					vUv = uv;\n					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n				}",
			fragmentShader: "\n\n				varying vec2 vUv;\n\n				uniform sampler2D blurTexture1;\n				uniform sampler2D blurTexture2;\n				uniform sampler2D blurTexture3;\n				uniform sampler2D blurTexture4;\n				uniform sampler2D blurTexture5;\n				uniform float bloomStrength;\n				uniform float bloomRadius;\n				uniform float bloomFactors[NUM_MIPS];\n				uniform vec3 bloomTintColors[NUM_MIPS];\n\n				float lerpBloomFactor( const in float factor ) {\n\n					float mirrorFactor = 1.2 - factor;\n					return mix( factor, mirrorFactor, bloomRadius );\n\n				}\n\n				void main() {\n\n					// 3.0 for backwards compatibility with previous alpha-based intensity\n					vec3 bloom = 3.0 * bloomStrength * (\n						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +\n						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +\n						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +\n						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +\n						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb\n					);\n\n					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );\n					gl_FragColor = vec4( bloom, bloomAlpha );\n\n				}"
		});
	}
};
rr.BlurDirectionX = new O(1, 0), rr.BlurDirectionY = new O(0, 1);
//#endregion
//#region node_modules/three/examples/jsm/shaders/OutputShader.js
var ir = {
	name: "OutputShader",
	uniforms: {
		tDiffuse: { value: null },
		toneMappingExposure: { value: 1 }
	},
	vertexShader: "\n		precision highp float;\n\n		uniform mat4 modelViewMatrix;\n		uniform mat4 projectionMatrix;\n\n		attribute vec3 position;\n		attribute vec2 uv;\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}",
	fragmentShader: "\n\n		precision highp float;\n\n		uniform sampler2D tDiffuse;\n\n		#include <tonemapping_pars_fragment>\n		#include <colorspace_pars_fragment>\n\n		varying vec2 vUv;\n\n		void main() {\n\n			gl_FragColor = texture2D( tDiffuse, vUv );\n\n			// tone mapping\n\n			#ifdef LINEAR_TONE_MAPPING\n\n				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );\n\n			#elif defined( REINHARD_TONE_MAPPING )\n\n				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );\n\n			#elif defined( CINEON_TONE_MAPPING )\n\n				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );\n\n			#elif defined( ACES_FILMIC_TONE_MAPPING )\n\n				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );\n\n			#elif defined( AGX_TONE_MAPPING )\n\n				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );\n\n			#elif defined( NEUTRAL_TONE_MAPPING )\n\n				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );\n\n			#elif defined( CUSTOM_TONE_MAPPING )\n\n				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );\n\n			#endif\n\n			// color space\n\n			#ifdef SRGB_TRANSFER\n\n				gl_FragColor = sRGBTransferOETF( gl_FragColor );\n\n			#endif\n\n		}"
}, ar = class extends Zn {
	constructor() {
		super(), this.isOutputPass = !0, this.uniforms = se.clone(ir.uniforms), this.material = new ue({
			name: ir.name,
			uniforms: this.uniforms,
			vertexShader: ir.vertexShader,
			fragmentShader: ir.fragmentShader
		}), this._fsQuad = new er(this.material), this._outputColorSpace = null, this._toneMapping = null;
	}
	render(e, t, n) {
		this.uniforms.tDiffuse.value = n.texture, this.uniforms.toneMappingExposure.value = e.toneMappingExposure, (this._outputColorSpace !== e.outputColorSpace || this._toneMapping !== e.toneMapping) && (this._outputColorSpace = e.outputColorSpace, this._toneMapping = e.toneMapping, this.material.defines = {}, te.getTransfer(this._outputColorSpace) === "srgb" && (this.material.defines.SRGB_TRANSFER = ""), this._toneMapping === 1 ? this.material.defines.LINEAR_TONE_MAPPING = "" : this._toneMapping === 2 ? this.material.defines.REINHARD_TONE_MAPPING = "" : this._toneMapping === 3 ? this.material.defines.CINEON_TONE_MAPPING = "" : this._toneMapping === 4 ? this.material.defines.ACES_FILMIC_TONE_MAPPING = "" : this._toneMapping === 6 ? this.material.defines.AGX_TONE_MAPPING = "" : this._toneMapping === 7 ? this.material.defines.NEUTRAL_TONE_MAPPING = "" : this._toneMapping === 5 && (this.material.defines.CUSTOM_TONE_MAPPING = ""), this.material.needsUpdate = !0), this.renderToScreen === !0 ? (e.setRenderTarget(null), this._fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this._fsQuad.render(e));
	}
	dispose() {
		this.material.dispose(), this._fsQuad.dispose();
	}
}, or = "\nvarying vec2 vUv;\nvoid main() {\n  vUv = uv;\n  gl_Position = vec4(position.xy, 0.0, 1.0);\n}\n", sr = "\nfloat pfxLuma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }\n\n// Scrub NaN / Inf / negative values coming from the scene (one bad pixel would otherwise poison\n// every blur kernel that touches it). Tests the exponent bits instead of isnan(), which D3D's\n// fast-math compiler is allowed to optimise away.\nbool pfxNonFinite(float x) { return (floatBitsToUint(x) & 0x7f800000u) == 0x7f800000u; }\nvec3 pfxSafe(vec3 c) {\n  bool bad = pfxNonFinite(c.r) || pfxNonFinite(c.g) || pfxNonFinite(c.b);\n  return bad ? vec3(0.0) : clamp(c, vec3(0.0), vec3(6.0e4));\n}\n\n// 8×8 Bayer ordered-dither threshold in [0, 1) (recursive closed form).\nfloat pfxBayer2(vec2 a) { a = floor(a); return fract(dot(a, vec2(0.5, a.y * 0.75))); }\nfloat pfxBayer4(vec2 a) { return pfxBayer2(0.5 * a) * 0.25 + pfxBayer2(a); }\nfloat pfxBayer8(vec2 a) { return pfxBayer4(0.5 * a) * 0.25 + pfxBayer2(a); }\n\n// Interleaved gradient noise (Jimenez 2014): cheap, well distributed, in [0, 1).\nfloat pfxIGN(vec2 p) { return fract(52.9829189 * fract(dot(p, vec2(0.06711056, 0.00583715)))); }\n\n// Integer-ish hash -> [0, 1) (Dave Hoskins, \"hash without sine\").\nfloat pfxHash12(vec2 p) {\n  vec3 p3 = fract(vec3(p.xyx) * 0.1031);\n  p3 += dot(p3, p3.yzx + 33.33);\n  return fract((p3.x + p3.y) * p3.z);\n}\n", cr = {
	name: "LuminatiCopyShader",
	uniforms: { tDiffuse: { value: null } },
	vertexShader: or,
	fragmentShader: `
    ${sr}
    uniform sampler2D tDiffuse;
    void main() {
      gl_FragColor = vec4(pfxSafe(texelFetch(tDiffuse, ivec2(gl_FragCoord.xy), 0).rgb), 1.0);
    }
  `
};
//#endregion
//#region src/engine/render/shaders/DofShaders.js
function lr() {
	return {
		tDepth: { value: null },
		uCamNear: { value: .5 },
		uCamFar: { value: 400 },
		uFocusDistance: { value: 24 },
		uFocusRange: { value: 5 },
		uNearScale: { value: 1.4 },
		uFarScale: { value: 1 },
		uMaxBlurPx: { value: 10 },
		uTilt: { value: new D(.35, .52, .28) },
		uTiltFeather: { value: .3 },
		uOrtho: { value: 0 }
	};
}
var ur = "\n#include <packing>\nuniform sampler2D tDepth;\nuniform float uCamNear;\nuniform float uCamFar;\nuniform float uFocusDistance;\nuniform float uFocusRange;\nuniform float uNearScale;\nuniform float uFarScale;\nuniform float uMaxBlurPx;\nuniform vec3 uTilt; // x = strength, y = centre (uv.y), z = band width (uv)\nuniform float uTiltFeather; // uv distance over which the tilt term ramps in\nuniform float uOrtho;       // 1 for orthographic cameras\n\nfloat dofViewDepth(float rawDepth) {\n  return uOrtho > 0.5 ? -orthographicDepthToViewZ(rawDepth, uCamNear, uCamFar)\n                      : -perspectiveDepthToViewZ(rawDepth, uCamNear, uCamFar);\n}\n\nfloat dofCoC(float rawDepth, float uvY) {\n  float z = dofViewDepth(rawDepth);\n  float dz = z - uFocusDistance;\n  float band = 0.5 * uFocusRange;\n  float t = clamp((abs(dz) - band) / max(1.5 * uFocusRange, 1e-3), 0.0, 1.0);\n  t = t * t * (3.0 - 2.0 * t);\n  float coc = dz < 0.0 ? -uNearScale * t : uFarScale * t;\n  // screen-space tilt-shift term\n  float ty = abs(uvY - uTilt.y) - 0.5 * uTilt.z;\n  float tilt = uTilt.x * smoothstep(0.0, max(uTiltFeather, 1e-3), ty);\n  if (tilt > abs(coc)) {\n    float s = abs(dz) > band ? sign(dz) : (uvY < uTilt.y ? -1.0 : 1.0);\n    coc = s * tilt;\n  }\n  return coc * uMaxBlurPx;\n}\n", dr = {
	name: "LuminatiDofPrefilter",
	glslVersion: s,
	uniforms: {
		tColor: { value: null },
		uFullSize: { value: new O(1, 1) },
		uRatio: { value: new O(2, 2) },
		uScale: { value: .5 },
		uBokehThreshold: { value: 1.5 },
		uSprites: { value: 1 }
	},
	vertexShader: or,
	fragmentShader: `
    ${ur}
    ${sr}
    uniform sampler2D tColor;
    uniform vec2 uFullSize;
    uniform vec2 uRatio;
    uniform float uScale;
    uniform float uBokehThreshold;
    uniform float uSprites;
    varying vec2 vUv;
    layout(location = 0) out vec4 outColorCoc;
    layout(location = 1) out vec4 outHighlight;

    void main() {
      vec2 fc = gl_FragCoord.xy * uRatio;           // centre of this texel in full-res pixels
      ivec2 p = ivec2(floor(fc - 0.5));
      ivec2 mx = ivec2(uFullSize) - 1;
      ivec2 p0 = clamp(p, ivec2(0), mx);
      ivec2 p1 = clamp(p + ivec2(1, 0), ivec2(0), mx);
      ivec2 p2 = clamp(p + ivec2(0, 1), ivec2(0), mx);
      ivec2 p3 = clamp(p + ivec2(1, 1), ivec2(0), mx);

      vec3 c0 = texelFetch(tColor, p0, 0).rgb;
      vec3 c1 = texelFetch(tColor, p1, 0).rgb;
      vec3 c2 = texelFetch(tColor, p2, 0).rgb;
      vec3 c3 = texelFetch(tColor, p3, 0).rgb;

      float k0 = dofCoC(texelFetch(tDepth, p0, 0).x, vUv.y);
      float k1 = dofCoC(texelFetch(tDepth, p1, 0).x, vUv.y);
      float k2 = dofCoC(texelFetch(tDepth, p2, 0).x, vUv.y);
      float k3 = dofCoC(texelFetch(tDepth, p3, 0).x, vUv.y);

      float kn = min(min(k0, k1), min(k2, k3));
      float kf = max(max(k0, k1), max(k2, k3));
      float kc = (kn < -1.0 || -kn > kf) ? kn : kf;

      // guard against NaN/Inf from the scene (would poison the whole bokeh kernel)
      c0 = pfxSafe(c0);
      c1 = pfxSafe(c1);
      c2 = pfxSafe(c2);
      c3 = pfxSafe(c3);

      float w0 = 1.0 / (1.0 + (k0 - kc) * (k0 - kc));
      float w1 = 1.0 / (1.0 + (k1 - kc) * (k1 - kc));
      float w2 = 1.0 / (1.0 + (k2 - kc) * (k2 - kc));
      float w3 = 1.0 / (1.0 + (k3 - kc) * (k3 - kc));
      float wsum = w0 + w1 + w2 + w3;
      vec3 col = (c0 * w0 + c1 * w1 + c2 * w2 + c3 * w3) / wsum;

      vec4 hl = vec4(0.0);
      // Only highlights the composite actually shows through the blurred layers are scattered:
      // same ramp as its centreA (full-res px). Nearly-focused specks stay in the sharp image;
      // extracting them would double-count them (near pass is added on top of the sharp pixels)
      // or lose them (far discs are clipped to the tiny CoC of their focused surroundings),
      // which made them pulse between 'boosted disc', 'sharp' and 'hollow ring' while panning.
      float spriteGate = smoothstep(2.0, 4.0, abs(kc));
      if (uSprites > 0.5 && spriteGate > 0.0) {
        // highlight energy, decided per full-res pixel (smooth ramp above the threshold)
        float T = uBokehThreshold;
        float l0 = pfxLuma(c0), l1 = pfxLuma(c1), l2 = pfxLuma(c2), l3 = pfxLuma(c3);
        float r0 = smoothstep(T, 2.0 * T, l0), r1 = smoothstep(T, 2.0 * T, l1);
        float r2 = smoothstep(T, 2.0 * T, l2), r3 = smoothstep(T, 2.0 * T, l3);
        if (r0 + r1 + r2 + r3 > 0.0) {
          // isolation: tent-weighted neighbourhood mean (≈14×14 px via 5×5 bilinear 2×2 taps)
          // vs each pixel's OWN luminance. Lone specks → 1 (scattered as boosted discs);
          // extended bright areas → 0 (stay in the normalised gather, which keeps their blurred
          // edges free of dark halos). The 25 taps are re-weighted per pixel so each of the 4
          // pixels gets a tent window centred on itself (pixels sit ±0.25 tap from the block
          // centre, no extra fetches): the result barely depends on how a highlight straddles
          // the reduced-res grid, so boosted bokeh does not pulse while the camera pans (the
          // sprite gain amplifies any jitter here).
          float m0 = 0.0, m1 = 0.0, m2 = 0.0, m3 = 0.0;
          for (int y = -2; y <= 2; y++) {
            float ra = 0.0, rb = 0.0;
            for (int x = -2; x <= 2; x++) {
              float L = pfxLuma(textureLod(tColor, (fc + vec2(x, y) * 2.0) / uFullSize, 0.0).rgb);
              ra += (3.0 - abs(float(x) + 0.25)) * L;
              rb += (3.0 - abs(float(x) - 0.25)) * L;
            }
            float wa = 3.0 - abs(float(y) + 0.25);
            float wb = 3.0 - abs(float(y) - 0.25);
            m0 += wa * ra; m1 += wa * rb; m2 += wb * ra; m3 += wb * rb;
          }
          const float TENT_NORM = 1.0 / 76.5625;         // (Σ weights)² = 8.75²
          float s0 = r0 * (1.0 - smoothstep(0.06, 0.6, m0 * TENT_NORM / max(l0, 1e-4)));
          float s1 = r1 * (1.0 - smoothstep(0.06, 0.6, m1 * TENT_NORM / max(l1, 1e-4)));
          float s2 = r2 * (1.0 - smoothstep(0.06, 0.6, m2 * TENT_NORM / max(l2, 1e-4)));
          float s3 = r3 * (1.0 - smoothstep(0.06, 0.6, m3 * TENT_NORM / max(l3, 1e-4)));
          // Removed from the gather: the amount the layer-aware colour average above holds.
          vec3 eGather = (c0 * (w0 * s0) + c1 * (w1 * s1) + c2 * (w2 * s2) + c3 * (w3 * s3)) / wsum;
          // Scattered as sprites: the footprint's true (box-filtered) energy. The layer-aware
          // weights dilate near-field specks to every texel they touch, so using them here
          // made the scattered energy depend on the grid phase (even/odd flicker when panning).
          vec3 eBox = (c0 * s0 + c1 * s1 + c2 * s2 + c3 * s3) * 0.25;
          vec3 eAll = (c0 * r0 + c1 * r1 + c2 * r2 + c3 * r3) * 0.25;
          float iso = clamp(pfxLuma(eBox) / max(pfxLuma(eAll), 1e-6), 0.0, 1.0);
          col -= eGather * spriteGate;
          hl = vec4(eBox * spriteGate, iso);
        }
      }
      outColorCoc = vec4(max(col, vec3(0.0)), kc * uScale);
      outHighlight = hl;
    }
  `
};
function fr(e) {
	let t = Math.PI * (3 - Math.sqrt(5)), n = new Float32Array(e * 3);
	for (let r = 0; r < e; r++) {
		let i = Math.sqrt((r + .5) / e), a = r * t;
		n[r * 3] = i * Math.cos(a), n[r * 3 + 1] = i * Math.sin(a), n[r * 3 + 2] = i;
	}
	return n;
}
function pr(e) {
	let t = fr(e), n = [];
	for (let r = 0; r < e; r++) n.push(`vec2(${t[r * 3].toFixed(6)}, ${t[r * 3 + 1].toFixed(6)})`);
	return `const vec2 SMALL_KERNEL[${e}] = vec2[${e}](${n.join(", ")});`;
}
function mr(e) {
	let t = fr(e), n = [];
	for (let r = 0; r < e; r++) n.push(`vec3(${t[r * 3].toFixed(6)}, ${t[r * 3 + 1].toFixed(6)}, ${t[r * 3 + 2].toFixed(6)})`);
	return `const vec3 KERNEL[${e}] = vec3[${e}](\n  ${n.join(",\n  ")}\n);`;
}
function hr(e = 48) {
	return {
		name: `LuminatiDofGather${e}`,
		defines: { TAPS: e },
		uniforms: {
			tColorCoc: { value: null },
			uTexel: { value: new O(1, 1) },
			uRadius: { value: 6 }
		},
		vertexShader: or,
		fragmentShader: `
      uniform sampler2D tColorCoc;
      uniform vec2 uTexel;
      uniform float uRadius;
      varying vec2 vUv;

      ${mr(e)}

      void main() {
        vec4 centre = textureLod(tColorCoc, vUv, 0.0);
        float coc0 = centre.a;
        const float MARGIN = 1.0;                         // disc edge softness (px)
        // background taps are weighted by the inverse area of the disc they scatter
        // (1/CoC², floored so a focused silhouette cannot dominate its blurred neighbours):
        // a less-blurred object in front of a blurrier background then spreads over it as
        // much as it blends inward, instead of keeping a crisp 'cut-out' silhouette
        const float MIN_AREA = 4.0;                       // (2 px)²
        float norm = uRadius * uRadius / float(TAPS);     // (tap area) / PI

        float c0p = max(coc0, 0.0);
        vec4 bg = vec4(centre.rgb, 1.0) / max(c0p * c0p, MIN_AREA);
        vec4 fg = vec4(0.0);
        float fgA = 0.0;
        float nc0 = -coc0;
        if (nc0 >= 1.0) {
          fg = vec4(centre.rgb, 1.0);
          fgA = norm / max(nc0 * nc0, norm);
        }

        for (int i = 0; i < TAPS; i++) {
          vec3 k = KERNEL[i];
          float d = k.z * uRadius;
          vec4 s = textureLod(tColorCoc, vUv + k.xy * (uRadius * uTexel), 0.0);

          // background / focus layer: limited by the smaller CoC of centre and tap
          float bc = max(min(coc0, s.a), 0.0);
          float bw = clamp((bc - d) / MARGIN + 1.0, 0.0, 1.0) / max(bc * bc, MIN_AREA);
          bg += vec4(s.rgb, 1.0) * bw;

          // near layer: scatter-as-gather with the tap's own CoC
          float nc = -s.a;
          float fw = clamp((nc - d) / MARGIN + 1.0, 0.0, 1.0) * step(1.0, nc);
          fg += vec4(s.rgb, 1.0) * fw;
          fgA += fw * norm / max(nc * nc, norm);
        }

        bg.rgb /= bg.a;
        fg.rgb /= max(fg.a, 1e-4);
        fgA = fg.a > 0.0 ? clamp(fgA, 0.0, 1.0) : 0.0;
        gl_FragColor = vec4(mix(bg.rgb, fg.rgb, fgA), fgA);
      }
    `
	};
}
var gr = {
	name: "LuminatiDofTent",
	uniforms: {
		tBlur: { value: null },
		tColorCoc: { value: null },
		uSize: { value: new O(1, 1) }
	},
	vertexShader: or,
	fragmentShader: "\n    uniform sampler2D tBlur;\n    uniform sampler2D tColorCoc;\n    uniform vec2 uSize;\n\n    void main() {\n      ivec2 p = ivec2(gl_FragCoord.xy);\n      ivec2 mx = ivec2(uSize) - 1;\n      vec4 c = texelFetch(tBlur, p, 0);\n      float cc = texelFetch(tColorCoc, p, 0).a;\n      float tol = 1.0 + 0.25 * abs(cc);\n      vec4 acc = vec4(0.0);\n      float wsum = 0.0;\n      for (int y = -1; y <= 1; y++) {\n        for (int x = -1; x <= 1; x++) {\n          ivec2 q = clamp(p + ivec2(x, y), ivec2(0), mx);\n          vec4 s = texelFetch(tBlur, q, 0);\n          float sc = texelFetch(tColorCoc, q, 0).a;\n          float w = float((2 - abs(x)) * (2 - abs(y)));   // 1-2-1 tent\n          float dd = (sc - cc) / tol;\n          float sim = 1.0 / (1.0 + dd * dd * 4.0);\n          // strict only next to (nearly) focused texels; two blurred layers blend freely\n          sim = mix(sim, 1.0, smoothstep(1.0, 2.5, min(abs(cc), abs(sc))));\n          w *= mix(sim, 1.0, max(s.a, c.a));\n          acc += s * w;\n          wsum += w;\n        }\n      }\n      gl_FragColor = acc / wsum;\n    }\n  "
}, _r = {
	name: "LuminatiDofBokehSprites",
	uniforms: {
		tColorCoc: { value: null },
		tHighlight: { value: null },
		tGather: { value: null },
		uSize: { value: new O(1, 1) },
		uMode: { value: 0 },
		uBoost: { value: 1.5 },
		uMaxRadius: { value: 16 },
		uMaxPointSize: { value: 64 },
		uSquash: { value: 1 }
	},
	vertexShader: `
    ${sr}
    uniform sampler2D tColorCoc;
    uniform sampler2D tHighlight;
    uniform vec2 uSize;
    uniform float uMode;
    uniform float uBoost;
    uniform float uMaxRadius;
    uniform float uMaxPointSize;
    flat out vec3 vColor;
    flat out float vRadius;
    flat out vec2 vCentre;

    void cull() {
      gl_Position = vec4(2.0, 2.0, 2.0, 1.0);   // outside the clip volume
      gl_PointSize = 1.0;
      vColor = vec3(0.0); vRadius = 0.0; vCentre = vec2(0.0);
    }

    void main() {
      // one point per 2×2 block of reduced-res texels: energy-weighted merge
      int gw = (int(uSize.x) + 1) / 2;
      ivec2 base = ivec2(gl_VertexID % gw, gl_VertexID / gw) * 2;
      ivec2 mx = ivec2(uSize) - 1;
      vec3 esum = vec3(0.0);
      vec2 eCentre = vec2(0.0);
      float cocSum = 0.0, isoSum = 0.0, lsum = 0.0;
      for (int i = 0; i < 4; i++) {
        ivec2 t = min(base + ivec2(i & 1, i >> 1), mx);
        vec4 hl = texelFetch(tHighlight, t, 0);
        float l = pfxLuma(hl.rgb);
        if (l > 0.0) {
          esum += hl.rgb;
          eCentre += (vec2(t) + 0.5) * l;
          cocSum += texelFetch(tColorCoc, t, 0).a * l;
          isoSum += hl.a * l;
          lsum += l;
        }
      }
      if (lsum < 1e-5) { cull(); return; }
      eCentre /= lsum;
      float coc = cocSum / lsum;
      float iso = isoSum / lsum;
      float wNear = smoothstep(0.75, 1.5, -coc);
      float wm = uMode > 0.5 ? wNear : 1.0 - wNear;
      vec3 e = esum * wm;
      if (pfxLuma(e) < 1e-4) { cull(); return; }
      float r = clamp(abs(coc), 0.5, uMaxRadius);
      float size = min(2.0 * ceil(r + 1.5) + 1.0, uMaxPointSize);
      r = min(r, 0.5 * size - 1.5);
      float area = max(3.14159265 * r * r, 1.0);
      float gain = 1.0 + uBoost * 4.0 * iso * smoothstep(0.5, 3.0, r) * (1.0 + 0.1 * r);
      vColor = e * gain / area;
      vRadius = r;
      vCentre = eCentre;
      // snap the point centre to a pixel centre; the disc itself is evaluated around vCentre
      vec2 pc = floor(eCentre) + 0.5;
      gl_Position = vec4(pc / uSize * 2.0 - 1.0, 0.0, 1.0);
      gl_PointSize = size;
    }
  `,
	fragmentShader: "\n    uniform sampler2D tColorCoc;\n    uniform sampler2D tGather;\n    uniform float uMode;\n    uniform float uSquash;\n    flat in vec3 vColor;\n    flat in float vRadius;\n    flat in vec2 vCentre;\n\n    void main() {\n      float d = length((gl_FragCoord.xy - vCentre) * vec2(uSquash, 1.0));\n      float r = vRadius;\n      float cov;\n      if (uMode < 0.5) {\n        ivec2 q = ivec2(gl_FragCoord.xy);\n        float c0 = abs(texelFetch(tColorCoc, q, 0).a);\n        float nearA = texelFetch(tGather, q, 0).a;\n        float lim = max(min(c0, r), 0.5);\n        cov = clamp(lim - d + 0.5, 0.0, 1.0) * (1.0 - nearA);\n      } else {\n        cov = clamp(r - d + 0.5, 0.0, 1.0);\n      }\n      if (cov <= 0.0) discard;\n      // lens-like disc: flat body with a slightly brighter rim\n      float rim = mix(0.9, 1.18, smoothstep(0.55, 1.0, d / max(r, 1.0)));\n      // (an oval covers 1 / uSquash of the disc's area: × uSquash keeps its energy)\n      gl_FragColor = vec4(vColor * (cov * rim * uSquash), 0.0);\n    }\n  "
}, vr = {
	name: "LuminatiDofComposite",
	uniforms: {
		tColor: { value: null },
		tBlur: { value: null },
		tColorCoc: { value: null },
		tNearBokeh: { value: null },
		uNearBokeh: { value: 1 },
		uHalfSize: { value: new O(1, 1) },
		uHalfRatio: { value: new O(.5, .5) },
		uScale: { value: .5 },
		uMaxCocPx: { value: 10 },
		uFullTexel: { value: new O(1, 1) }
	},
	vertexShader: or,
	fragmentShader: `
    ${ur}
    ${sr}
    uniform sampler2D tColor;
    uniform sampler2D tBlur;
    uniform sampler2D tColorCoc;
    uniform sampler2D tNearBokeh;
    uniform float uNearBokeh;
    uniform vec2 uHalfSize;
    uniform vec2 uHalfRatio;
    uniform float uScale;
    uniform float uMaxCocPx;
    uniform vec2 uFullTexel;
    varying vec2 vUv;

    ${pr(12)}

    void main() {
      ivec2 fp = ivec2(gl_FragCoord.xy);
      vec3 sharp = pfxSafe(texelFetch(tColor, fp, 0).rgb);
      float coc = dofCoC(texelFetch(tDepth, fp, 0).x, vUv.y);   // full-res px
      float cocH = coc * uScale;                                   // reduced-res px

      // CoC-aware bilinear upsample of the blurred layer
      vec2 hp = gl_FragCoord.xy * uHalfRatio - 0.5;
      vec2 f = fract(hp);
      ivec2 b = ivec2(floor(hp));
      ivec2 mx = ivec2(uHalfSize) - 1;
      ivec2 q0 = clamp(b, ivec2(0), mx);
      ivec2 q1 = clamp(b + ivec2(1, 0), ivec2(0), mx);
      ivec2 q2 = clamp(b + ivec2(0, 1), ivec2(0), mx);
      ivec2 q3 = clamp(b + ivec2(1, 1), ivec2(0), mx);
      vec4 s0 = texelFetch(tBlur, q0, 0);
      vec4 s1 = texelFetch(tBlur, q1, 0);
      vec4 s2 = texelFetch(tBlur, q2, 0);
      vec4 s3 = texelFetch(tBlur, q3, 0);
      vec4 tcs = vec4(texelFetch(tColorCoc, q0, 0).a, texelFetch(tColorCoc, q1, 0).a,
                      texelFetch(tColorCoc, q2, 0).a, texelFetch(tColorCoc, q3, 0).a);
      float tol = 1.0 + 0.25 * abs(cocH);
      vec4 dc = (tcs - cocH) / tol;
      vec4 sim = 1.0 / (1.0 + dc * dc * 4.0) + 1e-3;
      // CoC rejection only matters next to (nearly) focused texels (it keeps sharp colour from
      // leaking into blurred neighbours). Where both sides are already visibly blurred, plain
      // bilinear blending is right; rejecting there gave blurred mid-ground sprites a crisp,
      // pixel-exact 'cut-out' silhouette against a blurrier background. (Same rule in the tent.)
      sim = mix(sim, vec4(1.0), smoothstep(1.0, 2.5, min(vec4(abs(cocH)), abs(tcs))));
      vec4 bil = vec4((1.0 - f.x) * (1.0 - f.y), f.x * (1.0 - f.y), (1.0 - f.x) * f.y, f.x * f.y);
      vec4 w = bil * mix(sim, vec4(1.0), clamp(vec4(s0.a, s1.a, s2.a, s3.a), 0.0, 1.0));
      vec4 blur = (s0 * w.x + s1 * w.y + s2 * w.z + s3 * w.w) / max(dot(w, vec4(1.0)), 1e-5);

      // small CoCs: a full-resolution disc blur, so the focus falloff is gradual and the
      // half-res layer only takes over once the blur is large enough to hide its resolution
      float ac = abs(coc);
      vec3 base = sharp;
      if (ac > 0.3 && ac < 4.0) {
        // scatter-as-gather: a tap only counts if its own CoC reaches this pixel, so focused
        // silhouettes never smear onto a slightly blurred background next to them
        vec3 acc = sharp;
        float wsum = 1.0;
        ivec2 fmx = ivec2(uHalfSize / uHalfRatio + 0.5) - 1;
        for (int i = 0; i < 12; i++) {
          vec2 o = SMALL_KERNEL[i] * ac;
          vec2 pos = gl_FragCoord.xy + o;
          float tc = abs(dofCoC(texelFetch(tDepth, clamp(ivec2(pos), ivec2(0), fmx), 0).x, pos.y * uFullTexel.y));
          float wt = clamp(tc - length(o) + 1.0, 0.0, 1.0);
          acc += texture2D(tColor, pos * uFullTexel).rgb * wt;
          wsum += wt;
        }
        base = mix(sharp, acc / wsum, smoothstep(0.3, 1.2, ac));
      }
      float centreA = smoothstep(2.0, 4.0, ac);
      float a = 1.0 - (1.0 - centreA) * (1.0 - clamp(blur.a, 0.0, 1.0));
      vec3 nearBokeh = uNearBokeh > 0.5 ? texture2D(tNearBokeh, vUv).rgb : vec3(0.0);

#ifdef DEBUG
      float l = pfxLuma(sharp);
      vec3 dbase = vec3(sqrt(l / (1.0 + l))) * 0.45;
      float n = sqrt(clamp(-coc / uMaxCocPx, 0.0, 1.0));
      float fr = sqrt(clamp(coc / uMaxCocPx, 0.0, 1.0));
      float inFocus = 1.0 - smoothstep(0.25, 0.75, abs(coc));
      vec3 col = dbase;
      col = mix(col, vec3(1.0, 0.55, 0.12), n * 0.8);
      col = mix(col, vec3(0.22, 0.5, 1.0), fr * 0.8);
      col = mix(col, col * 0.5 + vec3(0.12, 0.5, 0.16), inFocus);
      float spill = clamp(blur.a, 0.0, 1.0) * step(-0.5, coc);
      col = mix(col, vec3(0.85, 0.2, 0.75), spill * 0.6);
      gl_FragColor = vec4(col, 1.0);
#else
      gl_FragColor = vec4(mix(base, blur.rgb, a) + nearBokeh, 1.0);
#endif
    }
  `
}, yr = {
	name: "LuminatiGrade",
	uniforms: {
		tDiffuse: { value: null },
		uTexel: { value: new O(1, 1) },
		uAspect: { value: 16 / 9 },
		uExposure: { value: 1 },
		uContrast: { value: 1.08 },
		uSaturation: { value: 1.12 },
		uTemperature: { value: .08 },
		uTint: { value: 0 },
		uShadowsTint: { value: new D(.02, .04, .08) },
		uHighlightsTint: { value: new D(.06, .03, -.02) },
		uVignette: { value: .5 },
		uVignetteSoftness: { value: .55 },
		uVignetteRoundness: { value: .65 },
		uVignetteColor: { value: new D(.05, .025, .04) },
		uGrain: { value: .035 },
		uGrainSize: { value: 1 },
		uGrainSeed: { value: 0 },
		uCA: { value: .0015 },
		uSharpen: { value: .15 },
		uDither: { value: 1 },
		tStreak: { value: null },
		uStreaks: { value: 0 },
		uTealOrange: { value: 0 },
		uFilmCurve: { value: 0 },
		uBlack: { value: new D(0, 0, 0) },
		uWhite: { value: new D(1, 1, 1) },
		uGrainChroma: { value: 0 }
	},
	vertexShader: or,
	fragmentShader: `
    ${sr}
    uniform sampler2D tDiffuse;
    uniform vec2 uTexel;
    uniform float uAspect;
    uniform float uExposure;
    uniform float uContrast;
    uniform float uSaturation;
    uniform float uTemperature;
    uniform float uTint;
    uniform vec3 uShadowsTint;
    uniform vec3 uHighlightsTint;
    uniform float uVignette;
    uniform float uVignetteSoftness;
    uniform float uVignetteRoundness;
    uniform vec3 uVignetteColor;
    uniform float uGrain;
    uniform float uGrainSize;
    uniform float uGrainSeed;
    uniform float uCA;
    uniform float uSharpen;
    uniform float uDither;
    #ifdef CINEMATIC
    uniform sampler2D tStreak;
    uniform float uStreaks;
    uniform float uTealOrange;
    uniform float uFilmCurve;
    uniform vec3 uBlack;
    uniform vec3 uWhite;
    uniform float uGrainChroma;
    // the orange axis in the (Cb, Cr) plane: orange ≈ rgb(1, 0.55, 0.2); its opposite is steel teal
    const vec2 ORANGE = vec2(-0.7415, 0.6709);
    // vec2 → vec3 hash in [0, 1) (Dave Hoskins, "Hash without Sine")
    vec3 filmHash32(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
      p3 += dot(p3, p3.yxz + 33.33);
      return fract((p3.xxy + p3.yzz) * p3.zyx);
    }
    // value noise in [0, 1): the lattice's hashes, smoothly blended — clumps, not pixels
    float filmNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(pfxHash12(i), pfxHash12(i + vec2(1.0, 0.0)), f.x),
                 mix(pfxHash12(i + vec2(0.0, 1.0)), pfxHash12(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    // three independent value noises at once (the luma clumps and the two colour layers)
    vec3 filmNoise3(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(filmHash32(i), filmHash32(i + vec2(1.0, 0.0)), f.x),
                 mix(filmHash32(i + vec2(0.0, 1.0)), filmHash32(i + vec2(1.0, 1.0)), f.x), f.y);
    }
    #endif
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      // position relative to centre, x scaled toward the true aspect by 'roundness'
      vec2 d = uv - 0.5;
      vec2 dv = d * vec2(mix(1.0, uAspect, uVignetteRoundness), 1.0);
      float cornerLen = length(vec2(0.5 * mix(1.0, uAspect, uVignetteRoundness), 0.5));
      float r = length(dv) / cornerLen;            // 0 centre … 1 corners

      // --- sampling: sharpen + chromatic aberration
      vec3 c = texture2D(tDiffuse, uv).rgb;
      vec3 nb = texture2D(tDiffuse, uv + vec2(uTexel.x, 0.0)).rgb
              + texture2D(tDiffuse, uv - vec2(uTexel.x, 0.0)).rgb
              + texture2D(tDiffuse, uv + vec2(0.0, uTexel.y)).rgb
              + texture2D(tDiffuse, uv - vec2(0.0, uTexel.y)).rgb;
      vec3 detail = clamp((c - nb * 0.25) * uSharpen, vec3(-0.08), vec3(0.08));
      vec3 col = c;
      if (uCA > 0.0) {
        vec2 off = d * (uCA * 2.0 * r * r);       // radial, grows toward the edges
        col.r = texture2D(tDiffuse, uv - off).r;
        col.b = texture2D(tDiffuse, uv + off).b;
      }
      col += detail;
      col = max(col, vec3(0.0));
      #ifdef CINEMATIC
      // --- anamorphic streaks: light added to light (a gamma-2.2 round trip around the add)
      if (uStreaks > 0.0) col = pow(pow(col, vec3(2.2)) + texture2D(tStreak, uv).rgb, vec3(1.0 / 2.2));
      #endif

      // --- exposure (post tone-map multiply)
      col *= uExposure;

      // --- white balance: warm/cool along blue↔amber, tint along green↔magenta, luma preserving
      vec3 wb = vec3(1.0 + 0.30 * uTemperature + 0.10 * uTint,
                     1.0 + 0.02 * uTemperature - 0.25 * uTint,
                     1.0 - 0.34 * uTemperature + 0.10 * uTint);
      wb /= pfxLuma(wb);
      col *= wb;

      // --- contrast around display mid-grey
      col = (col - 0.5) * uContrast + 0.5;
      col = max(col, vec3(0.0));

      // --- saturation
      float l = pfxLuma(col);
      col = max(mix(vec3(l), col, uSaturation), vec3(0.0));

      // --- split toning
      l = clamp(pfxLuma(col), 0.0, 1.0);
      float ws = (1.0 - l) * (1.0 - l);
      float wh = l * l;
      col += uShadowsTint * ws + uHighlightsTint * wh;

      #ifdef CINEMATIC
      // --- orange & teal: each hue turned toward the nearer end of the axis; chroma along it kept
      // (skin, fire, sky), across it thinned (greens, magentas); luminance kept. The turn fades out
      // toward right angles to the axis, where the nearer end flips: no hue jumps there.
      {
        float y = pfxLuma(col);
        vec2 cc = vec2(col.b - y, col.r - y);    // (Cb, Cr)
        float m = length(cc);
        if (m > 1e-5) {
          vec2 n = cc / m;
          float s = dot(n, ORANGE);
          float turn = uTealOrange * smoothstep(0.0, 0.35, abs(s));
          vec2 nn = normalize(mix(n, s >= 0.0 ? ORANGE : -ORANGE, turn));
          cc = nn * m * mix(1.0, 0.72 + 0.38 * abs(s), uTealOrange);
          col.r = y + cc.y;
          col.b = y + cc.x;
          col.g = (y - 0.2126 * col.r - 0.0722 * col.b) / 0.7152;
          col = max(col, vec3(0.0));
        }
      }
      // --- film print: an S around mid-grey (toe and shoulder), then the print's black and white
      vec3 sc = clamp(col, 0.0, 1.0);
      col = mix(col, sc * sc * (3.0 - 2.0 * sc), uFilmCurve);
      col = uBlack + col * (uWhite - uBlack);
      #endif

      // --- vignette (smooth, elliptical; darkens toward a deep warm brown instead of grey)
      float inner = mix(0.95, 0.05, clamp(uVignetteSoftness, 0.0, 1.0));
      float v = smoothstep(inner, 1.25, r);
      v = v * v * (3.0 - 2.0 * v);
      col = mix(col, uVignetteColor * col, clamp(uVignette * v * 1.35, 0.0, 1.0));

      #ifdef CINEMATIC
      // --- film grain: soft clumps about uGrainSize px across, strongest in the mid-tones (a little
      // more in the shadows than the pixel grain); colour grain: red and blue clumps of their own,
      // green opposite them so that it adds no luminance
      vec2 fp = gl_FragCoord.xy / uGrainSize + uGrainSeed * vec2(37.17, 91.31);
      vec3 n3 = filmNoise3(fp);
      // (two octaves' weighted mean, centred; × 3.2: value noise spreads less than pixel noise)
      float g = ((2.0 * n3.x + filmNoise(fp * 2.17 + 19.3)) / 3.0 - 0.5) * 3.2;
      float cr = n3.y * 2.0 - 1.0;
      float cb = n3.z * 2.0 - 1.0;
      float lg = clamp(pfxLuma(col), 0.0, 1.0);
      float gw = 0.5 + 2.4 * lg * (1.0 - lg);
      col += (vec3(g) + vec3(cr, -(0.2126 * cr + 0.0722 * cb) / 0.7152, cb) * uGrainChroma) * uGrain * gw;
      #else
      // --- film grain: animated, strongest in the mid-tones
      vec2 gp = floor(gl_FragCoord.xy / uGrainSize);
      float g = pfxHash12(gp + uGrainSeed * vec2(113.7, 71.3)) + pfxHash12(gp * 1.37 + uGrainSeed * vec2(37.1, 91.9)) - 1.0;
      float lg = clamp(pfxLuma(col), 0.0, 1.0);
      float gw = 0.35 + 2.6 * lg * (1.0 - lg);
      col += g * uGrain * gw;
      #endif

      // --- ordered dither (±0.5 LSB of 8-bit) against banding
      col += (pfxBayer8(gl_FragCoord.xy) - 0.5) * (uDither / 255.0);

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `
}, br = {
	name: "LuminatiBloomBrightPass",
	uniforms: {
		tDiffuse: { value: null },
		luminosityThreshold: { value: .82 },
		smoothWidth: { value: .35 },
		maxBrightness: { value: 24 }
	},
	vertexShader: or,
	fragmentShader: `
    ${sr}
    uniform sampler2D tDiffuse;
    uniform float luminosityThreshold;
    uniform float smoothWidth;
    uniform float maxBrightness;
    varying vec2 vUv;

    void main() {
      vec3 c = pfxSafe(texture2D(tDiffuse, vUv).rgb);
      float br = max(c.r, max(c.g, c.b));
      float knee = max(smoothWidth, 1e-4);
      float soft = clamp(br - luminosityThreshold + knee, 0.0, 2.0 * knee);
      soft = soft * soft / (4.0 * knee);
      float contrib = max(soft, br - luminosityThreshold) / max(br, 1e-4);
      vec3 o = c * contrib;
      float m = max(o.r, max(o.g, o.b));
      o *= min(1.0, maxBrightness / max(m, 1e-4));
      gl_FragColor = vec4(o, 1.0);
    }
  `
}, xr = {
	name: "LuminatiStreakPrefilter",
	uniforms: {
		tBright: { value: null },
		uBrightTexel: { value: new O(1, 1) },
		uThreshold: { value: 1 }
	},
	vertexShader: or,
	fragmentShader: `
    ${sr}
    uniform sampler2D tBright;
    uniform vec2 uBrightTexel;
    uniform float uThreshold;

    void main() {
      // one bilinear tap at the shared corner of bright texels 2i, 2i + 1: their exact mean, also
      // where the bright target is not twice this one's size (an odd width or height; its last
      // block clamps to the edge)
      vec2 uv = (2.0 * floor(gl_FragCoord.xy) + 1.0) * uBrightTexel;
      vec3 c = pfxSafe(texture2D(tBright, uv).rgb);
      float br = max(c.r, max(c.g, c.b));
      // a soft knee half the threshold wide (the bright pass already took off the bloom's threshold)
      float knee = 0.5 * uThreshold + 1e-3;
      float soft = clamp(br - uThreshold + knee, 0.0, 2.0 * knee);
      soft = soft * soft / (4.0 * knee);
      gl_FragColor = vec4(c * (max(soft, br - uThreshold) / max(br, 1e-4)), 1.0);
    }
  `
}, Sr = {
	name: "LuminatiStreakBlur",
	uniforms: {
		tSrc: { value: null },
		uTexel: { value: new O(1, 1) },
		uStep: { value: 1 }
	},
	vertexShader: or,
	fragmentShader: "\n    uniform sampler2D tSrc;\n    uniform vec2 uTexel;\n    uniform float uStep;\n    varying vec2 vUv;\n\n    void main() {\n      vec2 o = vec2(uTexel.x * uStep, 0.0);\n      vec3 c = texture2D(tSrc, vUv).rgb * 0.25\n             + (texture2D(tSrc, vUv + o).rgb + texture2D(tSrc, vUv - o).rgb) * 0.2\n             + (texture2D(tSrc, vUv + 2.0 * o).rgb + texture2D(tSrc, vUv - 2.0 * o).rgb) * 0.12\n             + (texture2D(tSrc, vUv + 3.0 * o).rgb + texture2D(tSrc, vUv - 3.0 * o).rgb) * 0.055;\n      gl_FragColor = vec4(c, 1.0);\n    }\n  "
}, Cr = {
	name: "LuminatiStreakComposite",
	uniforms: {
		t1: { value: null },
		t2: { value: null },
		t3: { value: null },
		t4: { value: null },
		uTint: { value: new D(.25, .5, 1) },
		uTintMix: { value: .85 },
		uStrength: { value: 1 },
		uExposure: { value: 1 }
	},
	vertexShader: or,
	fragmentShader: `
    ${sr}
    uniform sampler2D t1;
    uniform sampler2D t2;
    uniform sampler2D t3;
    uniform sampler2D t4;
    uniform vec3 uTint;
    uniform float uTintMix;
    uniform float uStrength;
    uniform float uExposure;
    varying vec2 vUv;

    void main() {
      vec3 s = texture2D(t1, vUv).rgb * 0.25 + texture2D(t2, vUv).rgb * 0.6
             + texture2D(t3, vUv).rgb * 1.2 + texture2D(t4, vUv).rgb * 2.4;
      // the lens coating's colour: the streak keeps its luminance, its hue drawn toward the tint
      vec3 tinted = pfxLuma(s) * uTint / max(pfxLuma(uTint), 1e-4);
      gl_FragColor = vec4(mix(s, tinted, uTintMix) * (uStrength * uExposure), 1.0);
    }
  `
}, wr = [
	48,
	64,
	96
];
function Tr(e, t, n = {}) {
	return new ge(e, t, {
		type: S,
		format: w,
		depthBuffer: !1,
		stencilBuffer: !1,
		generateMipmaps: !1,
		minFilter: pe,
		magFilter: pe,
		...n
	});
}
function Er(e, t = null, n = null, r = {}) {
	let i = se.clone(e.uniforms);
	return t && Object.assign(i, t), new b({
		name: e.name,
		uniforms: i,
		defines: {
			...e.defines || {},
			...n || {}
		},
		vertexShader: e.vertexShader,
		fragmentShader: e.fragmentShader,
		glslVersion: e.glslVersion ?? null,
		depthTest: !1,
		depthWrite: !1,
		blending: 0,
		toneMapped: !1,
		...r
	});
}
var Dr = class {
	constructor(e) {
		this.gl = e, this.ext = e.getExtension ? e.getExtension("EXT_disjoint_timer_query_webgl2") : null, this.enabled = !1, this.results = {}, this.min = {}, this._pending = [], this._free = [], this._active = null;
	}
	get supported() {
		return !!this.ext;
	}
	begin(e) {
		if (!this.enabled || !this.ext) return;
		this._active && this.end();
		let t = this.gl, n = this._free.pop() || {
			q: t.createQuery(),
			label: ""
		};
		n.label = e, t.beginQuery(this.ext.TIME_ELAPSED_EXT, n.q), this._active = n;
	}
	end() {
		this._active &&= (this.gl.endQuery(this.ext.TIME_ELAPSED_EXT), this._pending.push(this._active), null);
	}
	poll() {
		if (!this.ext || this._pending.length === 0) return;
		let e = this.gl, t = e.getParameter(this.ext.GPU_DISJOINT_EXT);
		for (; this._pending.length;) {
			let n = this._pending[0];
			if (!e.getQueryParameter(n.q, e.QUERY_RESULT_AVAILABLE)) break;
			let r = e.getQueryParameter(n.q, e.QUERY_RESULT);
			if (!t) {
				let e = r / 1e6, t = this.results[n.label];
				this.results[n.label] = t === void 0 ? e : t * .9 + e * .1, this.min[n.label] = Math.min(this.min[n.label] ?? Infinity, e);
			}
			this._pending.shift(), this._free.push(n);
		}
	}
	dispose() {
		let e = this.gl;
		this._active && this.end();
		for (let t of this._pending) e.deleteQuery(t.q);
		for (let t of this._free) e.deleteQuery(t.q);
		this._pending.length = 0, this._free.length = 0;
	}
}, Or = class {
	constructor(e, t, n, r = {}) {
		this.renderer = e, this.scene = t, this.camera = n, this.samples = Math.max(0, r.samples ?? 4) | 0, this.dofScale = k(r.dofScale ?? .5, .25, 1), this.maxTaps = Math.max(48, r.maxTaps ?? 96), this.settings = {
			enabled: !0,
			dof: {
				enabled: !0,
				focusDistance: 24,
				focusRange: 5,
				maxBlur: 12,
				nearScale: 1.4,
				farScale: 1,
				tiltShift: .35,
				tiltCenter: .52,
				tiltWidth: .28,
				bokehBoost: 1.5,
				autoFocus: !0,
				debug: !1,
				bokehThreshold: 1.5,
				bokehSprites: !0,
				tiltFeather: .3,
				focusSpeed: 4
			},
			bloom: {
				enabled: !0,
				strength: .55,
				radius: .55,
				threshold: .82,
				warmth: .25,
				knee: .35
			},
			grade: {
				enabled: !0,
				exposure: 1,
				contrast: 1.08,
				saturation: 1.12,
				temperature: .08,
				tint: 0,
				shadowsTint: [
					.02,
					.04,
					.08
				],
				highlightsTint: [
					.06,
					.03,
					-.02
				],
				vignette: .5,
				vignetteSoftness: .55,
				grain: .035,
				chromaticAberration: .0015,
				sharpen: .15,
				vignetteRoundness: .65,
				vignetteColor: [
					.05,
					.025,
					.04
				],
				grainSize: 1,
				dither: 1
			},
			cinematic: {
				enabled: !1,
				streaks: 1,
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
		}, this._focusTarget = null, this._time = 0, this._w = 0, this._h = 0, this._hw = 0, this._hh = 0, this._taps = wr[0], this._v2 = new O(), this._clearColor = new E(), this._bloomWarmth = -1, this._sceneInfo = {
			calls: 0,
			triangles: 0,
			points: 0,
			lines: 0
		}, this._depthTexture = new le(1, 1, fe), this._sceneRT = Tr(1, 1, {
			samples: this.samples,
			depthBuffer: !0,
			depthTexture: this._depthTexture
		}), this._prefilterRT = Tr(1, 1, { count: 2 }), this._gatherRT = Tr(1, 1), this._tentRT = Tr(1, 1), this._nearBokehRT = Tr(1, 1), this._hdrRT = Tr(1, 1), this._ldrRT = Tr(1, 1), this._sceneRT.texture.name = "PostFX.scene", this._prefilterRT.textures[0].name = "PostFX.dofColorCoc", this._prefilterRT.textures[1].name = "PostFX.dofHighlights", this._gatherRT.texture.name = "PostFX.dofGather", this._tentRT.texture.name = "PostFX.dofBlur", this._nearBokehRT.texture.name = "PostFX.dofNearBokeh", this._hdrRT.texture.name = "PostFX.hdr", this._ldrRT.texture.name = "PostFX.ldr", this._coc = lr(), this._prefilterMat = Er(dr, this._coc), this._gatherMats = /* @__PURE__ */ new Map(), this._tentMat = Er(gr), this._spriteMat = Er(_r, null, null, {
			blending: 5,
			blendEquation: 100,
			blendSrc: 201,
			blendDst: 201,
			transparent: !0
		}), this._compositeMat = Er(vr, this._coc), this._debugMat = Er(vr, this._coc, { DEBUG: 1 }), this._gradeMat = Er(yr), this._copyMat = Er(cr), this._quad = new er(null), this._cine = null, this._spriteGeo = new de(), this._spriteCapacity = 0, this._sprites = new be(this._spriteGeo, this._spriteMat), this._sprites.frustumCulled = !1, this._spriteCam = new m(-1, 1, 1, -1, 0, 1);
		let i = e.getContext(), a = i.getParameter(i.ALIASED_POINT_SIZE_RANGE);
		this._spriteMat.uniforms.uMaxPointSize.value = Math.max(1, Math.min(256, a ? a[1] : 64));
		let o = this.settings.bloom;
		this._bloom = new rr(new O(2, 2), o.strength, o.radius, o.threshold);
		let s = Er(br);
		this._bloom.materialHighPassFilter.dispose(), this._bloom.materialHighPassFilter = s, this._bloom.highPassUniforms = s.uniforms, this._output = new ar(), this._timer = new Dr(i), e.getDrawingBufferSize(this._v2), this._allocate(Math.max(1, this._v2.x), Math.max(1, this._v2.y));
	}
	setSize(e, t, n = this.renderer.getPixelRatio()) {
		let r = Math.max(1, Math.floor(e * n)), i = Math.max(1, Math.floor(t * n));
		(r !== this._w || i !== this._h) && this._allocate(r, i);
	}
	setFocus(e, t = !1) {
		Number.isFinite(e) && (this._focusTarget = e, t && this.settings.dof.autoFocus && (this.settings.dof.focusDistance = e));
	}
	get depthTexture() {
		return this._depthTexture;
	}
	get sceneTarget() {
		return this._sceneRT;
	}
	get size() {
		return {
			width: this._w,
			height: this._h,
			dofWidth: this._hw,
			dofHeight: this._hh
		};
	}
	get taps() {
		return this._taps;
	}
	get timings() {
		return this._timer.results;
	}
	get timingsMin() {
		return this._timer.min;
	}
	enableTimings(e = !0) {
		return this._timer.enabled = !!e && this._timer.supported, this._timer.enabled && (this._timer.min = {}, this._timer.results = {}), this._timer.enabled;
	}
	render(e = 1 / 60) {
		let t = this.renderer, n = this.settings;
		e = Number.isFinite(e) ? Math.min(Math.max(e, 0), .25) : 1 / 60, this._time += e;
		let r = n.dof;
		if (r.autoFocus && this._focusTarget !== null && (r.focusDistance += (this._focusTarget - r.focusDistance) * Ee(r.focusSpeed ?? 4, e)), !n.enabled) {
			t.setRenderTarget(null), this._renderScene();
			return;
		}
		t.getDrawingBufferSize(this._v2), (this._v2.x !== this._w || this._v2.y !== this._h) && this._allocate(this._v2.x, this._v2.y);
		let i = this._timer;
		i.poll(), i.begin("scene"), t.setRenderTarget(this._sceneRT), t.autoClear || t.clear(), this._renderScene(), i.end();
		let a = t.autoClear;
		t.autoClear = !1;
		let o = this._sceneRT, s = !!r.debug;
		if (r.enabled || s) {
			if (i.begin("dof"), this._renderDof(s), i.end(), s) {
				t.autoClear = a;
				return;
			}
			o = this._hdrRT;
		}
		let c = n.grade.enabled, l = n.cinematic.enabled && c, u = !1;
		if (n.bloom.enabled && n.bloom.strength > 0 && (i.begin("bloom"), o === this._sceneRT && (this._copyMat.uniforms.tDiffuse.value = this._sceneRT.texture, this._blit(this._copyMat, this._hdrRT), o = this._hdrRT), this._updateBloom(), this._bloom.render(t, null, o, e, !1), i.end(), l && n.cinematic.streaks > 0 && (i.begin("streaks"), this._renderStreaks(), u = !0, i.end())), i.begin("output"), this._output.renderToScreen = !c, this._output.render(t, this._ldrRT, o), c) {
			let e = l ? this._cinematic().grade : this._gradeMat;
			this._updateGrade(e), l && (e.uniforms.uStreaks.value = +!!u), e.uniforms.tDiffuse.value = this._ldrRT.texture, this._blit(e, null);
		}
		i.end(), t.autoClear = a;
	}
	warmup() {
		let e = this.renderer, t = e.getRenderTarget(), n = e.autoClear;
		e.autoClear = !1;
		for (let e of wr) e <= this.maxTaps && this._blit(this._gatherMaterial(e), this._gatherRT);
		for (let e of [
			this._prefilterMat,
			this._tentMat,
			this._compositeMat,
			this._debugMat,
			this._gradeMat,
			this._copyMat
		]) {
			let t = e === this._prefilterMat ? this._prefilterRT : e === this._gradeMat || e === this._debugMat ? null : this._hdrRT;
			this._blit(e, t);
		}
		e.setRenderTarget(this._tentRT), e.render(this._sprites, this._spriteCam), this._updateBloom(), this._bloom.render(e, null, this._hdrRT, 0, !1), this._output.renderToScreen = !1, this._output.render(e, this._ldrRT, this._hdrRT), this.settings.cinematic.enabled && (this._renderStreaks(), this._blit(this._cinematic().grade, null)), e.autoClear = n, e.setRenderTarget(t);
	}
	get sceneInfo() {
		return this._sceneInfo;
	}
	dispose() {
		for (let e of [
			this._sceneRT,
			this._prefilterRT,
			this._gatherRT,
			this._tentRT,
			this._nearBokehRT,
			this._hdrRT,
			this._ldrRT
		]) e.dispose();
		this._depthTexture.dispose(), this._prefilterMat.dispose();
		for (let e of this._gatherMats.values()) e.dispose();
		this._gatherMats.clear();
		for (let e of [
			this._tentMat,
			this._spriteMat,
			this._compositeMat,
			this._debugMat,
			this._gradeMat,
			this._copyMat
		]) e.dispose();
		if (this._cine) {
			let e = this._cine;
			for (let t of [
				e.grade,
				e.prefilter,
				e.blur,
				e.composite
			]) t.dispose();
			for (let t of e.targets) t.dispose();
			this._cine = null;
		}
		this._spriteGeo.dispose(), this._quad.dispose(), this._bloom.dispose(), this._output.dispose(), this._timer.dispose();
	}
	_allocate(e, t) {
		e = Math.max(1, e | 0), t = Math.max(1, t | 0), this._w = e, this._h = t;
		let n = Math.max(1, Math.ceil(e * this.dofScale)), r = Math.max(1, Math.ceil(t * this.dofScale));
		this._hw = n, this._hh = r, this._sceneRT.setSize(e, t), this._hdrRT.setSize(e, t), this._ldrRT.setSize(e, t);
		for (let e of [
			this._prefilterRT,
			this._gatherRT,
			this._tentRT,
			this._nearBokehRT
		]) e.setSize(n, r);
		this._bloom.setSize(e, t);
		let i = Math.ceil(n / 2) * Math.ceil(r / 2);
		i > this._spriteCapacity && (this._spriteCapacity = Math.ceil(i * 1.25), this._spriteGeo.dispose(), this._spriteGeo.setAttribute("position", new re(new Uint8Array(this._spriteCapacity), 1)), this._spriteGeo.boundingSphere = new d(new D(), 1), this._spriteGeo.boundingBox = new me(new D(-1, -1, -1), new D(1, 1, 1))), this._spriteGeo.setDrawRange(0, i);
		let a = this._prefilterMat.uniforms;
		a.uFullSize.value.set(e, t), a.uRatio.value.set(e / n, t / r), a.uScale.value = this.dofScale, this._tentMat.uniforms.uSize.value.set(n, r), this._spriteMat.uniforms.uSize.value.set(n, r);
		for (let i of [this._compositeMat, this._debugMat]) i.uniforms.uHalfSize.value.set(n, r), i.uniforms.uHalfRatio.value.set(n / e, r / t), i.uniforms.uScale.value = this.dofScale, i.uniforms.uFullTexel.value.set(1 / e, 1 / t);
		this._gradeMat.uniforms.uTexel.value.set(1 / e, 1 / t), this._gradeMat.uniforms.uAspect.value = e / t, this._cine && this._sizeCinematic();
	}
	_cinematic() {
		if (!this._cine) {
			let e = [];
			for (let t = 0; t < 5; t++) {
				let n = Tr(1, 1);
				n.texture.name = `PostFX.streak${t}`, e.push(n);
			}
			this._cine = {
				grade: Er(yr, null, { CINEMATIC: 1 }),
				prefilter: Er(xr),
				blur: Er(Sr),
				composite: Er(Cr),
				targets: e
			}, this._cine.grade.uniforms.tStreak.value = e[0].texture, this._sizeCinematic();
		}
		return this._cine;
	}
	_sizeCinematic() {
		let e = this._cine, t = this._w, n = this._h, r = Math.max(1, Math.ceil(t / 4)), i = Math.max(1, Math.ceil(n / 4));
		for (let t of e.targets) t.setSize(r, i);
		e.blur.uniforms.uTexel.value.set(1 / r, 1 / i), e.grade.uniforms.uTexel.value.set(1 / t, 1 / n), e.grade.uniforms.uAspect.value = t / n;
	}
	_renderStreaks() {
		let e = this.settings.cinematic, t = this._cinematic(), n = t.targets, r = this._bloom.renderTargetBright, i = t.prefilter.uniforms;
		i.tBright.value = r.texture, i.uBrightTexel.value.set(1 / r.width, 1 / r.height), i.uThreshold.value = Math.max(0, e.streakThreshold ?? 1), this._blit(t.prefilter, n[0]);
		let a = t.blur.uniforms;
		for (let e = 1; e < 5; e++) a.tSrc.value = n[e - 1].texture, a.uStep.value = 3 ** (e - 1), this._blit(t.blur, n[e]);
		let o = t.composite.uniforms;
		o.t1.value = n[1].texture, o.t2.value = n[2].texture, o.t3.value = n[3].texture, o.t4.value = n[4].texture, e.streakTint && o.uTint.value.fromArray(e.streakTint), o.uTintMix.value = k(e.streakTintMix ?? .85, 0, 1), o.uStrength.value = Math.max(0, e.streaks), o.uExposure.value = Math.max(0, this.renderer.toneMappingExposure || 1), this._blit(t.composite, n[0]);
	}
	_renderScene() {
		let e = this.renderer.info, t = e.render, n = e.autoReset, r = n ? 0 : t.calls, i = n ? 0 : t.triangles, a = n ? 0 : t.points, o = n ? 0 : t.lines;
		this.renderer.render(this.scene, this.camera);
		let s = this._sceneInfo;
		s.calls = t.calls - r, s.triangles = t.triangles - i, s.points = t.points - a, s.lines = t.lines - o;
	}
	_gatherMaterial(e) {
		let t = this._gatherMats.get(e);
		return t || (t = Er(hr(e)), this._gatherMats.set(e, t)), t;
	}
	_blit(e, t) {
		this._quad.material = e, this.renderer.setRenderTarget(t), this._quad.render(this.renderer);
	}
	_clear(e) {
		let t = this.renderer;
		t.getClearColor(this._clearColor);
		let n = t.getClearAlpha();
		t.setRenderTarget(e), t.setClearColor(0, 0), t.clear(!0, !1, !1), t.setClearColor(this._clearColor, n);
	}
	_renderDof(e) {
		let t = this.settings.dof, n = this.camera, r = this._coc, i = this.renderer, a = Math.max(0, t.maxBlur) * (this._h / 1080);
		r.tDepth.value = this._depthTexture, r.uCamNear.value = n.near, r.uCamFar.value = n.far, r.uFocusDistance.value = t.focusDistance, r.uFocusRange.value = Math.max(.01, t.focusRange), r.uNearScale.value = Math.max(0, t.nearScale), r.uFarScale.value = Math.max(0, t.farScale), r.uMaxBlurPx.value = a, r.uTilt.value.set(Math.max(0, t.tiltShift), t.tiltCenter, Math.max(0, t.tiltWidth)), r.uTiltFeather.value = Math.max(.01, t.tiltFeather ?? .3), r.uOrtho.value = +!!n.isOrthographicCamera;
		let o = Math.max(t.nearScale, t.farScale, t.tiltShift, 0), s = Math.max(1, a * o * this.dofScale), c = .3 * Math.PI * s * s, l = wr[0];
		for (let e = 0; e < wr.length; e++) {
			let t = wr[e];
			if (t > this.maxTaps || (l = t, t >= c)) break;
		}
		this._taps = l;
		let u = t.bokehSprites !== !1 && !e, d = Math.max(.001, i.toneMappingExposure || 1), f = this._prefilterRT.textures[0], p = this._prefilterRT.textures[1], m = this._prefilterMat.uniforms;
		m.tColor.value = this._sceneRT.texture, m.uBokehThreshold.value = Math.max(.05, t.bokehThreshold ?? 1.5) / d, m.uSprites.value = +!!u, this._blit(this._prefilterMat, this._prefilterRT);
		let h = this._gatherMaterial(l);
		h.uniforms.tColorCoc.value = f, h.uniforms.uTexel.value.set(1 / this._hw, 1 / this._hh), h.uniforms.uRadius.value = s, this._blit(h, this._gatherRT);
		let g = this._tentMat.uniforms;
		if (g.tBlur.value = this._gatherRT.texture, g.tColorCoc.value = f, this._blit(this._tentMat, this._tentRT), u) {
			let e = this._spriteMat.uniforms;
			e.tColorCoc.value = f, e.tHighlight.value = p, e.tGather.value = this._gatherRT.texture, e.uBoost.value = Math.max(0, t.bokehBoost), e.uMaxRadius.value = s;
			let n = this.settings.cinematic;
			e.uSquash.value = n.enabled ? k(n.bokehSquash ?? 1, 1, 3) : 1, e.uMode.value = 0, i.setRenderTarget(this._tentRT), i.render(this._sprites, this._spriteCam), e.uMode.value = 1, this._clear(this._nearBokehRT), i.render(this._sprites, this._spriteCam);
		}
		let _ = e ? this._debugMat : this._compositeMat;
		_.uniforms.tColor.value = this._sceneRT.texture, _.uniforms.tBlur.value = this._tentRT.texture, _.uniforms.tColorCoc.value = f, _.uniforms.tNearBokeh.value = this._nearBokehRT.texture, _.uniforms.uNearBokeh.value = +!!u, _.uniforms.uMaxCocPx.value = Math.max(1, a * o), this._blit(_, e ? null : this._hdrRT);
	}
	_updateBloom() {
		let e = this.settings.bloom, t = this._bloom;
		t.strength = e.strength, t.radius = e.radius, t.threshold = e.threshold, t.highPassUniforms.smoothWidth.value = Math.max(.01, e.knee ?? .35);
		let n = e.warmth ?? 0;
		if (n !== this._bloomWarmth) {
			this._bloomWarmth = n;
			let e = t.bloomTintColors.length;
			for (let r = 0; r < e; r++) {
				let i = k(n * (.35 + .65 * (r / Math.max(1, e - 1))), 0, 1);
				t.bloomTintColors[r].set(1 + .08 * i, 1 - .1 * i, 1 - .32 * i);
			}
		}
	}
	_updateGrade(e) {
		let t = this.settings.grade, n = e.uniforms;
		if (n.uExposure.value = t.exposure, n.uContrast.value = t.contrast, n.uSaturation.value = t.saturation, n.uTemperature.value = t.temperature, n.uTint.value = t.tint, n.uShadowsTint.value.fromArray(t.shadowsTint), n.uHighlightsTint.value.fromArray(t.highlightsTint), n.uVignette.value = t.vignette, n.uVignetteSoftness.value = t.vignetteSoftness, n.uVignetteRoundness.value = t.vignetteRoundness ?? .65, t.vignetteColor && n.uVignetteColor.value.fromArray(t.vignetteColor), n.uGrain.value = t.grain, n.uGrainSize.value = Math.max(1, t.grainSize ?? 1), n.uGrainSeed.value = Math.floor(this._time * 24) % 997, n.uCA.value = t.chromaticAberration, n.uSharpen.value = t.sharpen, n.uDither.value = t.dither ?? 1, e === this._gradeMat) return;
		let r = this.settings.cinematic;
		n.uTealOrange.value = k(r.tealOrange ?? 0, 0, 1), n.uFilmCurve.value = k(r.filmCurve ?? 0, 0, 1), r.black && n.uBlack.value.fromArray(r.black), r.white && n.uWhite.value.fromArray(r.white), n.uGrainChroma.value = k(r.grainChroma ?? 0, 0, 1);
	}
}, kr = Math.PI / 180, Ar = 6, jr = 8, Mr = -.55, Nr = -.8;
function Pr(e) {
	let { M: t } = e, n = t.FUR, r = t.FUR2, i = t.FUR3, a = t.BONE, o = t.METAL, s = t.LEATHER, c = t.GLOW, l = t.WOOD;
	function u(e, t, n, r, i, a, o = {}) {
		let { hi: s = .42, lo: c = -.22, deep: l = -.72, lift: u = 0, shine: d = 0, max: f = 4 } = o, [p, m] = t, [h, g] = r, _ = h - p, v = g - m, y = _ * _ + v * v || 1e-9, b = Math.max(n, i), x = Math.floor(Math.min(p, h) - b - 1), S = Math.ceil(Math.max(p, h) + b + 1), C = Math.floor(Math.min(m, g) - b - 1), w = Math.ceil(Math.max(m, g) + b + 1);
		for (let t = C; t <= w; t++) for (let r = x; r <= S; r++) {
			let o = r + .5, h = t + .5, g = Math.max(0, Math.min(1, ((o - p) * _ + (h - m) * v) / y)), b = p + _ * g, x = m + v * g, S = n + (i - n) * g, C = o - b, w = h - x, T = C * C + w * w;
			if (T > S * S) continue;
			let ee = (C * Mr + w * Nr) / Math.max(.5, S), te = ee > s ? 3 : ee > c ? 2 : +(ee > l);
			d && ee > d && T > S * S * .3 && (te = 4), te = Math.max(0, Math.min(f, te + u)), e.set(r, t, a, te);
		}
	}
	function d(e, t, n, r, i) {
		for (let a = 0; a + 1 < t.length; a++) u(e, t[a], n[a], t[a + 1], n[a + 1], r, i);
	}
	function f(t, n, r, i, a, o, s = {}) {
		e.blob(t, n, r, i, a, o, {
			hi: .42,
			lo: -.25,
			deep: -.75,
			...s
		});
	}
	function p(e, t, n, r, i, a, o = 0) {
		for (let s = n; s <= i; s++) for (let n = t; n <= r; n++) {
			if (e.get(n, s) !== a) continue;
			let t = e.getShade(n, s);
			if (t < 2 || t > 3) continue;
			let r = Math.floor((s + o) / 3), i = n + (r & 1) * 2 & 3, c = (s + o) % 3;
			c === 2 && i !== 3 ? e.tone(n, s, -1) : c === 0 && i === 0 && t === 3 && e.tone(n, s, 1);
		}
	}
	function m(e, t, n, r, i = 3, o = 2) {
		for (let s = 0; s < i; s++) {
			let c = t + (s - (i - 1) / 2) * o;
			e.set(c, n, a, 3), e.set(c + r, n + 1, a, 2);
		}
	}
	function h(t, n, r, i, s) {
		let c = Math.cos(r * kr), d = -Math.sin(r * kr), f = -d * s, p = c * s, [m, h] = n, g = (e, t) => [m + c * e + f * t, h + d * e + p * t];
		t.begin("all", 0), u(t, g(-5, 0), 1.2, g(2, 0), 1.2, l, { lift: -1 }), t.end(), t.begin(null);
		for (let e = -4; e <= 1; e += 2) {
			let [n, r] = g(e, 0);
			t.over(Math.round(n), Math.round(r), l, 3);
		}
		let [_, v] = g(-6, 0);
		t.set(Math.round(_), Math.round(v), a, 3), t.end();
		let y = 2.5, b = -1.6, x = 4.8, S = (e) => x + 2.8 * Math.max(0, Math.min(1, (e - y) / (i - y)));
		t.begin("all", 0), e.fillPoly(t, [
			g(y, b),
			g(i + 1.5, b),
			g(i + .5, 7.6),
			g(i - 1.5, 8.2),
			g(4, x)
		], o, (e, t) => {
			let n = e + .5 - m, r = t + .5 - h, i = n * c + r * d, a = n * f + r * p, o = S(i);
			return a > o - 1 ? 4 : a > o - 2.2 ? 3 : a < -.5 ? 1 : a < .3999999999999999 ? 2 : (Math.round(i) * 3 + Math.round(a) * 5) % 11 == 0 ? 1 : 2;
		}), t.end(), t.begin(null);
		for (let e = b; e <= 4.3; e += .5) {
			let [n, r] = g(y, e);
			t.set(Math.round(n), Math.round(r), a, e < 1 ? 3 : 2);
		}
		for (let e = 6.5; e < i - 1; e += 4.5) {
			let [n, r] = g(e, S(e) - .3);
			t.erase(Math.round(n), Math.round(r));
		}
		for (let e = 5.5; e < i; e += 3) {
			let [n, r] = g(e, -2.6);
			t.set(Math.round(n), Math.round(r), o, 1);
		}
		let [C, w] = g(i + 1.6, -2.8);
		t.set(Math.round(C), Math.round(w), o, 3);
		for (let e of [4.5, 7.5]) {
			let [n, r] = g(e, 1);
			t.set(Math.round(n), Math.round(r), a, 4);
		}
		t.end();
	}
	function g(e, t, r, i) {
		let o = r[0] - t[0], c = r[1] - t[1], l = Math.hypot(o, c) || 1, u = o / l, d = c / l, f = [r[0] - u * 2.6, r[1] - d * 2.6];
		e.begin(null);
		for (let t = -3; t <= 3; t++) {
			let r = Math.round(f[0] - d * t * .9), o = Math.round(f[1] + u * t * .9);
			if (!e.get(r, o)) continue;
			e.set(r, o, s, Math.max(0, 2 + i - +(t > 1)));
			let c = Math.round(r - u), l = Math.round(o - d);
			e.get(c, l) === n && e.set(c, l, s, Math.max(0, 1 + i)), !(t & 1) && t > -3 && t < 3 && e.set(r, o, a, Math.max(1, 3 + i));
		}
		e.end();
	}
	function _(e, t, r, i = 2.6) {
		f(e, t, r, i, i * .9, n, {
			hi: .3,
			lo: -.3
		}), e.set(Math.round(t - 1), Math.round(r + i - .2), a, 3), e.set(Math.round(t + 1), Math.round(r + i - .2), a, 2);
	}
	function v(e, t, i) {
		let [a, o, s, c] = t, l = i ? 0 : -1;
		e.begin("all", 1), u(e, a, 4.6, o, 3.6, n, { lift: l }), e.end(), e.begin("all", 1), u(e, o, 3.3, s, 2.4, n, { lift: l }), e.end(), e.begin("all", 0);
		let d = c[1] - (c[2] ?? 0);
		f(e, c[0], d - 1.2, 3.6, 1.9, r), m(e, c[0], d, 0, 3, 2), e.end();
	}
	function y(e, t, n, r) {
		if (e.begin("all", 0), f(e, t[0] + n * .5, t[1] - .5, 5.4, 4.4, a, {
			hi: .25,
			lo: -.3
		}), e.end(), e.begin(null), !r) {
			e.set(Math.round(t[0] + n * 1), Math.round(t[1] + 0), a, 0), e.set(Math.round(t[0] + n * 2), Math.round(t[1] + 0), a, 0), e.set(Math.round(t[0] + n * 1.5), Math.round(t[1] + 1), a, 1);
			for (let n = -2; n <= 2; n++) e.set(Math.round(t[0] + n), Math.round(t[1] + 3.6), a, n & 1 ? 1 : 3);
		}
		e.end(), e.begin("all", 0), d(e, [
			[t[0] + n * 3, t[1] - 3],
			[t[0] + n * 6, t[1] - 6],
			[t[0] + n * 6.5, t[1] - 9]
		], [
			1.6,
			1.1,
			.6
		], a, { lift: 1 }), e.end();
	}
	function b(e, t, i) {
		let [o, s] = t.head, l = t.look, u = l < 0 ? (e) => [
			[o + e * 4, s - 2],
			[o + e * 8, s - 2],
			[o + e * 10.5, s + 1],
			[o + e * 10, s + 5]
		] : (e) => [
			[o + e * 4, s - 3],
			[o + e * 8, s - 5 - l],
			[o + e * 10.5, s - 9 - l],
			[o + e * 10, s - 13 - l]
		];
		e.begin("all", 0);
		let p = l < 0 ? [
			2.6,
			2.3,
			1.8,
			1
		] : [
			2.2,
			1.9,
			1.4,
			.7
		];
		d(e, u(-1), p, a, { lift: 0 }), d(e, u(1), p, a, { lift: -1 }), e.end();
		for (let t of [-1, 1]) e.over(Math.round(o + t * 7), Math.round(s - 5 - l), a, 1), e.over(Math.round(o + t * 9.5), Math.round(s - 8 - l), a, 1);
		if (e.begin("all", 0), f(e, o, s, 5.6, 5.2, n, {
			hi: .35,
			lo: -.3
		}), e.end(), i) {
			e.begin(null);
			for (let t = -2; t <= 2; t++) e.set(o + t * 2, s - 4, r, 3), e.set(o + t * 2, s - 5, r, 2);
			for (let t = s - 2; t <= s + 4; t++) e.over(o, t, r, t & 1 ? 2 : 1);
			e.end();
			return;
		}
		let m = s + 2 + +(l < 0);
		if (e.begin("all", 1), f(e, o, m + 1.5, 3.8, 2.8, n, {
			hi: .2,
			lo: -.4
		}), e.end(), e.begin(null), e.set(o - 2, m + 1, r, 0), e.set(o + 1, m + 1, r, 0), e.set(o - 1, m - 1, n, 4), t.jaw) {
			for (let t = o - 3; t <= o + 2; t++) e.set(t, m + 3, c, t === o - 1 || t === o ? 4 : 3), e.set(t, m + 4, c, 2);
			e.set(o - 3, m + 2, a, 4), e.set(o + 2, m + 2, a, 3), e.set(o - 2, m + 5, a, 3), e.set(o + 1, m + 5, a, 3), f(e, o, m + 6.2, 3.2, 1.3, n, {
				hi: .2,
				lo: -.5
			});
		} else {
			for (let t = o - 3; t <= o + 2; t++) e.set(t, m + 3, r, 0);
			e.set(o - 3, m + 4, a, 4), e.set(o + 2, m + 4, a, 3);
		}
		e.end(), e.begin(null);
		let h = s - 1 - (l > 0);
		for (let t = o - 5; t <= o + 4; t++) t !== o - 1 && t !== o && e.set(t, h - 1, r, +(t < o));
		e.set(o - 3, h, c, 4), e.set(o - 4, h, c, 3), e.set(o + 2, h, c, 4), e.set(o + 3, h, c, 3), e.end();
	}
	function x(t, o, c) {
		let [l, d] = o.chest, [m, h] = o.hip;
		if (t.begin("all", 1), e.fillPoly(t, [
			[m - 6, h - 2],
			[m + 6, h - 2],
			[m + 5, h + 7],
			[m + 1, h + 9],
			[m - 2, h + 8],
			[m - 5, h + 7]
		], s, (e, t) => Math.abs(Math.round(e - m)) % 3 == 1 || t > h + 6 ? 1 : e < m ? 3 : 2), t.end(), t.begin(null), t.set(Math.round(m - 3), Math.round(h + 8), a, 3), t.set(Math.round(m + 3), Math.round(h + 7), a, 2), t.end(), t.begin("all", 1), f(t, (l + m) / 2, h - 3, 8.5, 6, n), f(t, l, d, 12.5, 9.8, n, { hi: .4 }), t.end(), c) {
			t.begin(null);
			for (let e = Math.round(d - 8); e <= h + 1; e++) t.over(Math.round(l), e, r, e & 1 ? 1 : 2), t.over(Math.round(l) - 1, e, n, 3);
			for (let e = 0; e < 5; e++) {
				let n = Math.round(d - 8 + e * 4);
				t.set(Math.round(l), n, a, 3), t.set(Math.round(l), n - 1, a, 4);
			}
			t.end(), t.begin(null);
			for (let e of [-1, 1]) for (let n = 0; n < 5; n++) t.over(Math.round(l + e * (4 + n)), Math.round(d - 2 + n), r, 1);
			t.end();
		} else {
			t.begin(null);
			for (let e = Math.round(d + 2); e <= h; e++) {
				let n = 3 + +(e - d < 6);
				for (let r = Math.round((l + m) / 2) - n; r <= Math.round((l + m) / 2) + n - 1; r++) t.over(r, e, i, (e - Math.round(d)) % 3 == 0 ? 1 : r < (l + m) / 2 ? 3 : 2);
			}
			t.end(), t.begin(null);
			for (let e = -1; e <= 1; e += 2) {
				for (let r = 0; r < 7; r++) t.over(Math.round(l + e * (2 + r)), Math.round(d - 3 + r * .35 + +(r > 4)), n, e < 0 ? 4 : 3);
				for (let n = 0; n < 6; n++) t.over(Math.round(l + e * (2 + n)), Math.round(d + 2 + n * .3), r, 1);
			}
			t.end(), t.begin("all", 0);
			for (let e = 0; e < 4; e++) {
				let n = d - 4 + e * 3;
				u(t, [l + 3, n], .9, [l + 8 - e, n + 1], .8, a, { lift: 1 });
			}
			t.end(), t.begin("all", 0), u(t, [l + 11, d - 7], 1.1, [m - 6, h - 1], 1.1, s, { lift: 0 }), t.end(), t.begin(null);
			for (let e = .2; e < 1; e += .3) t.set(Math.round(l + 11 + (m - 6 - l - 11) * e), Math.round(d - 7 + (h - 1 - d + 7) * e), a, 4);
			t.end();
		}
		p(t, Math.round(l - 13), Math.round(d - 10), Math.round(l + 13), Math.round(h + 2), n);
	}
	function S(e, t, r) {
		let [i, a, o] = t, s = r ? 0 : -1;
		e.begin("all", 1), u(e, i, 4.4, a, 3.5, n, { lift: s }), e.end(), e.begin("all", 1), u(e, a, 3.4, o, 2.6, n, { lift: s }), e.end(), g(e, a, o, s), e.begin("all", 0), _(e, o[0], o[1]), e.end();
	}
	function C(e, t, i) {
		if (e.begin("all", 1), d(e, t, t.map((e, t) => (i ? 3.6 : 3.2) - t * (i ? .9 : .8)), i ? n : r, { lift: i ? 0 : -1 }), e.end(), i) {
			e.begin(null);
			for (let n = 0; n + 1 < t.length; n++) {
				let [r, i] = t[n];
				e.set(Math.round(r), Math.round(i - 1), a, 3);
			}
			e.end();
		}
	}
	function w(e) {
		let t = (e) => [
			64 - e[0],
			e[1],
			...e.slice(2)
		];
		return {
			...e,
			hip: t(e.hip),
			chest: t(e.chest),
			head: t(e.head),
			armR: e.armR.map(t),
			armL: e.armL.map(t),
			legR: e.legR.map(t),
			legL: e.legL.map(t),
			tail: e.tail.map(t),
			blade: e.blade ? {
				...e.blade,
				ang: 180 - e.blade.ang,
				edge: -e.blade.edge,
				front: !e.blade.front
			} : null
		};
	}
	function T(e, t, n) {
		let r = n ? w(t) : t, i = r.blade ? r.blade.hand === "L" ? r.armL[2] : r.armR[2] : null, o = !n;
		r.blade && !r.blade.front && h(e, i, r.blade.ang, r.blade.len, r.blade.edge), n || C(e, r.tail, !1), v(e, r.legL, !o), v(e, r.legR, o), x(e, r, n);
		let s = r.armR[2][0] > r.chest[0] - 4;
		s || S(e, r.armR, o), S(e, r.armL, !o), y(e, r.armL[0], n ? -1 : 1, n), e.begin("all", 0), f(e, r.armR[0][0], r.armR[0][1] - .5, 4.2, 3.4, a, {
			hi: .2,
			lo: -.3,
			maxShade: 3
		}), e.end(), n && C(e, r.tail, !0), b(e, r, n), s && S(e, r.armR, o), r.blade && r.blade.front && h(e, i, r.blade.ang, r.blade.len, r.blade.edge);
	}
	function ee(e, t, i) {
		let [o, s, c, l] = t, d = i ? 0 : -1, f = i ? n : r;
		e.begin(i ? "all" : null, 1), u(e, o, 4.8, s, 3.6, f, { lift: d }), e.end(), e.begin(i ? "all" : null, 1), u(e, s, 3.2, c, 2.2, f, { lift: d }), u(e, c, 2.1, [l[0] + 1.5, l[1] - 1], 1.6, f, { lift: d }), e.end(), e.begin(null), e.set(l[0] - 1, l[1], a, i ? 3 : 2), e.set(l[0], l[1], a, i ? 2 : 1), e.set(l[0] - 2, l[1], a, i ? 4 : 2), e.set(c[0] + 2, c[1] + 1, a, i ? 2 : 1), e.end();
	}
	function te(e, t, i) {
		let [a, o, s] = t, c = i ? 0 : -1, l = i ? n : r;
		e.begin(i ? "all" : null, 1), u(e, a, 4, o, 3.2, l, { lift: c }), e.end(), e.begin(i ? "all" : null, 1), u(e, o, 3.1, s, 2.4, l, { lift: c }), e.end(), i && g(e, o, s, 0), e.begin(i ? "all" : null, 0), _(e, s[0], s[1], 2.4), e.end();
	}
	function ne(e, t) {
		let [i, o] = t.head, s = t.snout * kr, l = Math.cos(s), p = -Math.sin(s), m = t.horn;
		e.begin(null), d(e, m.map(([e, t]) => [e + 2, t - 1]), [
			2,
			1.7,
			1.2,
			.6
		], a, { lift: -2 }), e.end(), e.begin("all", 1), f(e, i, o, 5.2, 4.6, n, { hi: .35 }), e.end();
		let h = [i + l * 9, o + p * 9 + 1];
		e.begin("all", 1), u(e, [i + l * 2, o + p * 2 + .5], 3.6, h, 2.2, n, { hi: .3 }), e.end();
		let g = t.jaw ? 3 : 0;
		if (e.begin("all", 0), u(e, [i + l * 1, o + p * 1 + 3 + g * .4], 2.2, [h[0] + 1 - l * 1, h[1] + 2 + g], 1.5, n, { lift: -1 }), e.end(), e.begin(null), t.jaw) {
			for (let t = 1; t < 7; t++) e.set(Math.round(i + l * (1 + t)), Math.round(o + p * (1 + t) + 2 + g * .5), c, t < 3 ? 4 : 3);
			e.set(Math.round(h[0] + 1), Math.round(h[1] + 1), a, 4), e.set(Math.round(h[0] + 2), Math.round(h[1] + 1 + g), a, 3);
		} else {
			for (let t = 1; t < 8; t++) e.set(Math.round(i + l * (1 + t)), Math.round(o + p * (1 + t) + 2.5), r, 0);
			e.set(Math.round(h[0] + 1), Math.round(h[1] + 2), a, 4), e.set(Math.round(h[0] + 3), Math.round(h[1] + 2), a, 3);
		}
		e.set(Math.round(h[0] - .5), Math.round(h[1] - 1), r, 0), e.set(Math.round(i + l * 4), Math.round(o + p * 4 - 2), n, 4), e.end(), e.begin("all", 0), d(e, m, [
			2.3,
			1.9,
			1.3,
			.7
		], a, { lift: 0 }), e.end();
		for (let t = 1; t + 1 < m.length; t++) e.over(Math.round(m[t][0]), Math.round(m[t][1] + 1), a, 1);
		e.begin(null);
		let _ = Math.round(i + l * 1.5 - .5), v = Math.round(o - 1 + p * 1.5);
		e.set(_ - 1, v - 1, r, 0), e.set(_, v - 1, r, 0), e.set(_ + 1, v - 1, r, 1), e.set(_, v, c, 4), e.set(_ + 1, v, c, 3), e.end(), e.begin(null);
		for (let t = 0; t < 3; t++) e.set(i + 3 + t, o - 3 + t * 2, r, 3), e.set(i + 4 + t, o - 3 + t * 2, r, 2);
		e.end();
	}
	function re(t, r) {
		let [o, c] = r.chest, [l, m] = r.hip, g = r.blade ? r.blade.hand ?? r.armN[2] : null;
		r.blade && !r.blade.front && h(t, g, r.blade.ang, r.blade.len, r.blade.edge), te(t, r.armF, !1), ee(t, r.legF, !1), t.begin("all", 1), d(t, r.tail, r.tail.map((e, t) => 4 - t * (3.2 / (r.tail.length - 1))), n, { lift: 0 }), t.end(), t.begin(null);
		for (let e = 1; e < r.tail.length; e++) {
			let [n, i] = r.tail[e], o = 4 - e * (3.2 / (r.tail.length - 1));
			t.set(Math.round(n), Math.round(i - o - .5), a, 3);
		}
		t.end(), t.begin("all", 1), f(t, l, m - 1, 7.4, 6.4, n), f(t, (o + l) / 2, (c + m) / 2, 8.2, 8.2, n), f(t, o, c, 9.6, 9.2, n, { hi: .4 }), t.end(), t.begin(null);
		for (let e = Math.round(c + 1); e <= m + 3; e++) {
			let n = (e - c) / Math.max(1, m + 3 - c), r = Math.round(o - 8 + n * 6);
			for (let n = r; n <= r + 3; n++) t.over(n, e, i, (e - Math.round(c)) % 3 == 0 ? 1 : n === r ? 3 : 2);
		}
		t.end(), p(t, Math.round(o - 10), Math.round(c - 10), Math.round(l + 8), Math.round(m + 6), n), t.begin("all", 0);
		for (let e = 0; e < 5; e++) {
			let n = e / 4, r = Math.round(o + 4 + n * (l + 6 - o - 4)), i = Math.round(c - 9 + n * (m - 5 - c + 9));
			t.set(r + 1, i - 1, a, 3), t.set(r + 2, i - 2, a, 4), t.set(r + 1, i, a, 2);
		}
		t.end(), t.begin("all", 0);
		for (let e = 0; e < 3; e++) u(t, [o - 5, c - 3 + e * 3], .9, [o - 1, c - 2 + e * 3], .8, a, { lift: 1 });
		t.end(), ee(t, r.legN, !0), t.begin("all", 1), e.fillPoly(t, [
			[l - 6, m - 3],
			[l - 1, m - 3],
			[l - 2, m + 4],
			[l - 4, m + 5],
			[l - 6, m + 3]
		], s, (e, t) => t > m + 3 ? 1 : e < l - 4 ? 3 : 2), t.end(), t.begin(null), t.set(Math.round(l - 4), Math.round(m + 6), a, 3), t.end(), ne(t, r), te(t, r.armN, !0), t.begin("all", 0);
		let [_, v] = r.armN[0];
		f(t, _, v - 1, 4.8, 4, a, {
			hi: .25,
			lo: -.3
		}), t.end(), t.begin(null), t.set(_ - 2, v - 1, a, 0), t.set(_ - 1, v - 1, a, 0);
		for (let e = -3; e <= 1; e++) t.set(_ + e, v + 2, a, e & 1 ? 1 : 3);
		t.end(), t.begin("all", 0), d(t, [
			[_ + 1, v - 4],
			[_ + 3, v - 6],
			[_ + 4, v - 7]
		], [
			1.3,
			.9,
			.5
		], a, { lift: 1 }), t.end(), r.blade && r.blade.front && h(t, g, r.blade.ang, r.blade.len, r.blade.edge);
	}
	function ie(e) {
		let t = {
			hip: [32, 45],
			chest: [32, 32],
			head: [32, 18],
			look: 0,
			jaw: 0,
			armR: [
				[19, 27],
				[15, 36],
				[16, 44]
			],
			armL: [
				[45, 27],
				[49, 36],
				[48, 44]
			],
			legR: [
				[28, 46],
				[25, 52],
				[24, 58],
				[
					23,
					62,
					0
				]
			],
			legL: [
				[36, 46],
				[39, 52],
				[40, 58],
				[
					41,
					62,
					0
				]
			],
			blade: {
				hand: "R",
				ang: -98,
				len: 17,
				edge: -1,
				front: !0
			},
			tail: [
				[37, 51],
				[45, 55],
				[51, 59],
				[56, 61]
			]
		}, n = (e, n = [
			"hip",
			"chest",
			"head"
		]) => {
			for (let r of n) t[r] = [t[r][0], t[r][1] + e];
		}, r = (e) => {
			t.armR = t.armR.map(([t, n]) => [t, n + e]), t.armL = t.armL.map(([t, n]) => [t, n + e]);
		};
		switch (e) {
			case "idle1":
				n(1), r(1);
				break;
			case "move0":
				t.legL = [
					[36, 45],
					[39, 50],
					[40, 56],
					[
						41,
						61,
						2
					]
				], n(-1), r(-1), t.armR[2] = [17, 42], t.armL[2] = [47, 44];
				break;
			case "move1":
				n(1), r(1);
				break;
			case "move2":
				t.legR = [
					[28, 45],
					[25, 50],
					[24, 56],
					[
						23,
						61,
						2
					]
				], n(-1), r(-1), t.armR[2] = [15, 44], t.armL[2] = [49, 42];
				break;
			case "move3":
				n(1), r(1);
				break;
			case "windup":
				t.chest = [31, 32], t.head = [31, 18], t.armR = [
					[19, 27],
					[12, 22],
					[15, 14]
				], t.blade = {
					hand: "R",
					ang: 112,
					len: 14,
					edge: -1,
					front: !1
				};
				break;
			case "attack":
				t.chest = [33, 33], t.head = [33, 19], t.hip = [32, 46], t.armR = [
					[20, 28],
					[27, 37],
					[37, 41]
				], t.armL = [
					[45, 28],
					[51, 34],
					[53, 40]
				], t.blade = {
					hand: "R",
					ang: -22,
					len: 19,
					edge: -1,
					front: !0
				};
				break;
			case "cleave2":
				t.chest = [31, 33], t.head = [31, 19], t.armR = [
					[19, 28],
					[20, 37],
					[27, 37]
				], t.blade = {
					hand: "R",
					ang: 188,
					len: 18,
					edge: 1,
					front: !0
				};
				break;
			case "follow":
				t.chest = [33, 34], t.head = [33, 21], t.hip = [32, 46], t.armR = [
					[20, 29],
					[27, 40],
					[35, 48]
				], t.blade = {
					hand: "R",
					ang: -48,
					len: 17,
					edge: -1,
					front: !0
				};
				break;
			case "goreWind":
			case "gore0":
			case "gore1":
				n(4, ["hip"]), n(5, ["chest"]), t.head = [32, 31], t.look = -1, t.armR = [
					[19, 30],
					[13, 39],
					[12, 46]
				], t.armL = [
					[45, 30],
					[51, 39],
					[52, 45]
				], t.legR = [
					[28, 49],
					[24, 54],
					[24, 59],
					[
						23,
						62,
						0
					]
				], t.legL = [
					[36, 49],
					[40, 54],
					[40, 59],
					[
						41,
						62,
						0
					]
				], t.blade = {
					hand: "R",
					ang: -120,
					len: 17,
					edge: -1,
					front: !1
				}, e === "gore0" && (t.legL = [
					[36, 48],
					[40, 52],
					[41, 57],
					[
						42,
						60,
						3
					]
				], n(-1, ["chest", "head"])), e === "gore1" && (t.legR = [
					[28, 48],
					[24, 52],
					[23, 57],
					[
						22,
						60,
						3
					]
				], n(-1, ["chest", "head"]));
				break;
			case "slamWind":
				t.chest = [32, 31], t.head = [32, 18], t.look = 1, t.armR = [
					[19, 27],
					[17, 17],
					[28, 9]
				], t.armL = [
					[45, 27],
					[47, 17],
					[36, 9]
				], t.blade = {
					hand: "R",
					ang: 96,
					len: 10,
					edge: -1,
					front: !1
				};
				break;
			case "slam":
				n(5, ["hip"]), n(7, ["chest"]), t.head = [32, 27], t.look = -1, t.armR = [
					[20, 34],
					[24, 43],
					[30, 48]
				], t.armL = [
					[44, 34],
					[40, 43],
					[34, 48]
				], t.legR = [
					[28, 50],
					[23, 55],
					[23, 59],
					[
						22,
						62,
						0
					]
				], t.legL = [
					[36, 50],
					[41, 55],
					[41, 59],
					[
						42,
						62,
						0
					]
				], t.blade = {
					hand: "R",
					ang: -88,
					len: 13,
					edge: -1,
					front: !0
				};
				break;
			case "roar":
				t.chest = [32, 31], t.head = [32, 16], t.look = 1, t.jaw = 1, t.armR = [
					[19, 27],
					[11, 29],
					[7, 25]
				], t.armL = [
					[45, 27],
					[53, 29],
					[57, 25]
				], t.blade = {
					hand: "R",
					ang: 78,
					len: 17,
					edge: -1,
					front: !1
				};
				break;
			case "hurt": t.chest = [33, 31], t.head = [34, 17], t.look = 1, t.jaw = 1, t.armR = [
				[20, 27],
				[15, 34],
				[13, 41]
			], t.armL = [
				[46, 27],
				[51, 33],
				[53, 38]
			], t.blade = {
				hand: "R",
				ang: -120,
				len: 15,
				edge: -1,
				front: !0
			};
		}
		return t;
	}
	function E(e) {
		let t = {
			hip: [38, 45],
			chest: [30, 33],
			head: [20, 22],
			snout: 196,
			jaw: 0,
			armN: [
				[29, 28],
				[27, 37],
				[23, 44]
			],
			armF: [
				[36, 27],
				[39, 35],
				[37, 42]
			],
			legN: [
				[35, 46],
				[29, 52],
				[33, 57],
				[28, 62]
			],
			legF: [
				[39, 45],
				[34, 51],
				[39, 56],
				[35, 61]
			],
			blade: {
				ang: -112,
				len: 17,
				edge: 1,
				front: !0
			},
			tail: [
				[44, 45],
				[50, 48],
				[55, 53],
				[59, 58],
				[61, 61]
			],
			horn: [
				[23, 17],
				[27, 14],
				[31, 14],
				[34, 17]
			]
		}, n = (e, n, r) => {
			for (let i of r) t[i] = [t[i][0] + e, t[i][1] + n];
		}, r = (e, t, n) => e.map(([e, r]) => [e + t, r + n]), i = (e) => {
			n(0, e, ["chest", "head"]), t.armN = r(t.armN, 0, e), t.armF = r(t.armF, 0, e), t.horn = r(t.horn, 0, e);
		};
		switch (e) {
			case "idle1":
				i(1);
				break;
			case "move0":
				t.legN = [
					[35, 45],
					[27, 50],
					[30, 55],
					[24, 61]
				], t.legF = [
					[39, 45],
					[37, 51],
					[43, 56],
					[41, 61]
				], i(-1), t.armN = [
					[29, 27],
					[29, 36],
					[27, 43]
				];
				break;
			case "move1":
				t.legN = [
					[35, 46],
					[30, 52],
					[35, 56],
					[31, 60]
				], t.legF = [
					[39, 46],
					[33, 52],
					[37, 57],
					[32, 62]
				], i(1);
				break;
			case "move2":
				t.legN = [
					[35, 45],
					[33, 51],
					[39, 56],
					[37, 61]
				], t.legF = [
					[39, 45],
					[31, 50],
					[34, 55],
					[28, 61]
				], i(-1), t.armN = [
					[29, 27],
					[25, 36],
					[20, 42]
				];
				break;
			case "move3":
				t.legN = [
					[35, 46],
					[31, 52],
					[36, 57],
					[33, 62]
				], t.legF = [
					[39, 46],
					[34, 52],
					[37, 56],
					[33, 60]
				], i(1);
				break;
			case "windup":
				n(2, 0, ["chest"]), t.head = [22, 21], t.horn = r(t.horn, 2, -1), t.armN = [
					[31, 28],
					[33, 19],
					[33, 12]
				], t.blade = {
					ang: 38,
					len: 17,
					edge: -1,
					front: !1
				};
				break;
			case "attack":
				t.chest = [27, 35], t.head = [17, 26], t.snout = 205, t.horn = r(t.horn, -3, 4), t.armN = [
					[27, 30],
					[20, 36],
					[14, 41]
				], t.legN = [
					[34, 46],
					[26, 52],
					[29, 57],
					[23, 62]
				], t.blade = {
					ang: -158,
					len: 16,
					edge: 1,
					front: !0
				};
				break;
			case "cleave2":
				t.chest = [28, 34], t.head = [18, 24], t.horn = r(t.horn, -2, 2), t.armN = [
					[28, 29],
					[22, 33],
					[17, 32]
				], t.blade = {
					ang: 164,
					len: 16,
					edge: -1,
					front: !0
				};
				break;
			case "follow":
				t.chest = [28, 36], t.head = [18, 28], t.snout = 208, t.horn = r(t.horn, -2, 6), t.armN = [
					[28, 31],
					[24, 40],
					[21, 47]
				], t.legN = [
					[34, 46],
					[27, 52],
					[30, 57],
					[25, 62]
				], t.blade = {
					ang: -122,
					len: 16,
					edge: 1,
					front: !0
				};
				break;
			case "goreWind":
			case "gore0":
			case "gore1":
				t.hip = [40, 47], t.chest = [29, 40], t.head = [17, 39], t.snout = 220, t.horn = [
					[20, 35],
					[16, 32],
					[12, 31],
					[9, 33]
				], t.armN = [
					[29, 35],
					[34, 42],
					[40, 46]
				], t.armF = [
					[35, 35],
					[37, 43],
					[34, 48]
				], t.legN = [
					[37, 48],
					[30, 53],
					[35, 57],
					[30, 62]
				], t.legF = [
					[41, 47],
					[37, 52],
					[43, 56],
					[40, 61]
				], t.tail = [
					[46, 46],
					[52, 47],
					[57, 49],
					[61, 52],
					[62, 56]
				], t.blade = {
					ang: -24,
					len: 15,
					edge: 1,
					front: !1
				}, e === "gore0" && (t.legN = [
					[37, 47],
					[27, 51],
					[28, 56],
					[21, 60]
				], t.legF = [
					[41, 47],
					[43, 53],
					[50, 57],
					[49, 62]
				], i(-1)), e === "gore1" && (t.legN = [
					[37, 47],
					[40, 53],
					[46, 57],
					[44, 62]
				], t.legF = [
					[41, 46],
					[32, 50],
					[32, 55],
					[25, 59]
				], i(-1));
				break;
			case "slamWind":
				t.chest = [32, 32], t.head = [23, 20], t.snout = 170, t.horn = r(t.horn, 3, -2), t.armN = [
					[31, 27],
					[28, 17],
					[30, 9]
				], t.armF = [
					[37, 26],
					[34, 16],
					[32, 9]
				], t.blade = {
					ang: 10,
					len: 16,
					edge: 1,
					front: !1,
					hand: [31, 9]
				};
				break;
			case "slam":
				t.hip = [40, 48], t.chest = [28, 41], t.head = [17, 37], t.snout = 215, t.horn = [
					[20, 33],
					[24, 30],
					[28, 30],
					[31, 33]
				], t.armN = [
					[27, 36],
					[20, 43],
					[14, 48]
				], t.armF = [
					[33, 36],
					[24, 43],
					[16, 48]
				], t.legN = [
					[37, 49],
					[29, 54],
					[33, 58],
					[27, 62]
				], t.legF = [
					[41, 48],
					[37, 53],
					[43, 57],
					[40, 61]
				], t.tail = [
					[46, 47],
					[52, 49],
					[56, 53],
					[59, 58],
					[61, 61]
				], t.blade = {
					ang: -96,
					len: 13,
					edge: 1,
					front: !0
				};
				break;
			case "roar":
				t.chest = [31, 31], t.head = [22, 18], t.snout = 150, t.jaw = 1, t.horn = r(t.horn, 2, -3), t.armN = [
					[30, 27],
					[24, 31],
					[18, 27]
				], t.armF = [
					[37, 26],
					[42, 30],
					[46, 26]
				], t.blade = {
					ang: 105,
					len: 17,
					edge: -1,
					front: !1
				};
				break;
			case "hurt": t.chest = [33, 32], t.head = [24, 21], t.snout = 165, t.jaw = 1, t.horn = r(t.horn, 4, -1), t.armN = [
				[32, 28],
				[31, 37],
				[29, 43]
			], t.blade = {
				ang: -80,
				len: 17,
				edge: 1,
				front: !0
			};
		}
		return t;
	}
	function ae(e, t, i) {
		let o = t === "up";
		e.begin("all", 1), d(e, [
			[40, i - 4],
			[48, i - 3],
			[55, i - 2],
			[61, i - 1]
		], [
			4,
			3,
			2,
			1
		], n, { lift: -1 }), e.end(), e.begin("all", 1), f(e, 33, i - 5, 13, 5.6, n), f(e, 22, i - 6, 6, 5, n), e.end(), p(e, 18, i - 12, 46, i, n), e.begin("all", 0);
		for (let t = 0; t < 4; t++) e.set(28 + t * 4, i - 11, a, 3), e.set(28 + t * 4, i - 12, a, 4);
		f(e, 24, i - 9, 4, 3, a, { hi: .25 }), e.end(), e.begin("all", 1), f(e, 13, i - 4, 5, 3.8, n), u(e, [10, i - 3], 2.6, [4, i - 2], 1.8, n), e.end(), e.begin("all", 0), d(e, [
			[15, i - 7],
			[19, i - 10],
			[24, i - 11],
			[27, i - 9]
		], [
			2,
			1.6,
			1.1,
			.6
		], a), e.end(), e.begin(null), e.set(11, i - 5, r, 0), e.set(12, i - 5, r, 0), e.set(5, i - 1, a, 3), e.end(), e.begin("all", 1), u(e, [28, i - 7], 3, [20, i - 1], 2.2, n), u(e, [40, i - 6], 3.6, [46, i - 1], 2.4, n, { lift: -1 }), e.end(), h(e, [o ? 40 : 34, i - 1], o ? 172 : 6, 15, -1);
	}
	function oe(t, n, r, i) {
		t.ox = Ar, t.oy = jr, r === "dead" ? ae(t, n, i.G - jr) : n === "side" ? re(t, E(r)) : T(t, ie(r), n === "up"), r === "hurt" && e.shear(t, n === "side" ? -.08 : .06, i.G);
	}
	return {
		fw: 76,
		fh: 72,
		columns: [
			...e.COMMON,
			"cleave2",
			"follow",
			"goreWind",
			"gore0",
			"gore1",
			"slamWind",
			"slam",
			"roar"
		],
		aliases: {
			cleave: "attack",
			cleaveWind: "windup"
		},
		spriteOptions: { blobSize: [2, .9] },
		draw: oe,
		ramps: () => e.makeRamps({
			[n]: e.ramp5([
				"#1c0b10",
				"#3b1119",
				"#5d1b22",
				"#86302c",
				"#b45a42"
			]),
			[r]: e.ramp5([
				"#12070a",
				"#240c10",
				"#3a1218",
				"#561c20",
				"#76302c"
			]),
			[i]: e.ramp5([
				"#3c2414",
				"#6b4423",
				"#9a6834",
				"#c4904c",
				"#e6c27a"
			]),
			[a]: e.ramp5([
				"#5e5446",
				"#948670",
				"#c6b898",
				"#e4d8b8",
				"#fbf4dc"
			]),
			[o]: e.ramp5([
				"#1d1c22",
				"#36353e",
				"#585862",
				"#8a8c96",
				"#e2e4ea"
			]),
			[s]: e.ramp5([
				"#22140e",
				"#3e2618",
				"#5e3c24",
				"#7e5634",
				"#a07448"
			]),
			[l]: e.ramp5([
				"#1e120c",
				"#382216",
				"#54341e",
				"#70482a",
				"#8e6038"
			]),
			[c]: e.glowRamp([
				"#6a1a06",
				"#c4400e",
				"#ff7a1e",
				"#ffb84a",
				"#fff0a8"
			])
		}, n)
	};
}
//#endregion
//#region src/engine/pixel/monsters/ashhound.js
var Fr = Math.PI / 180, Ir = 4, Lr = 8, Rr = -.55, zr = -.8;
function Br(e) {
	let { M: t } = e, n = t.FUR, r = t.FUR2, i = t.BONE, a = t.GLOW, o = t.NOSE;
	function s(e, t, n, r, i, a, o = {}) {
		let { hi: s = .42, lo: c = -.22, deep: l = -.72, lift: u = 0, shine: d = 0, max: f = 4 } = o, [p, m] = t, [h, g] = r, _ = h - p, v = g - m, y = _ * _ + v * v || 1e-9, b = Math.max(n, i);
		for (let t = Math.floor(Math.min(m, g) - b - 1); t <= Math.ceil(Math.max(m, g) + b + 1); t++) for (let r = Math.floor(Math.min(p, h) - b - 1); r <= Math.ceil(Math.max(p, h) + b + 1); r++) {
			let o = r + .5, h = t + .5, g = Math.max(0, Math.min(1, ((o - p) * _ + (h - m) * v) / y)), b = o - (p + _ * g), x = h - (m + v * g), S = n + (i - n) * g, C = b * b + x * x;
			if (C > S * S) continue;
			let w = (b * Rr + x * zr) / Math.max(.5, S), T = w > s ? 3 : w > c ? 2 : +(w > l);
			d && w > d && C > S * S * .3 && (T = 4), e.set(r, t, a, Math.max(0, Math.min(f, T + u)));
		}
	}
	function c(e, t, n, r, i) {
		for (let a = 0; a + 1 < t.length; a++) s(e, t[a], n[a], t[a + 1], n[a + 1], r, i);
	}
	function l(t, n, r, i, a, o, s = {}) {
		e.blob(t, n, r, i, a, o, {
			hi: .42,
			lo: -.25,
			deep: -.75,
			...s
		});
	}
	function u(e, t, n, r, i, o = 1) {
		for (let s = 0; s < r; s++) {
			let c = s / Math.max(1, r - 1), l = t + i * c * c, u = o * (1 - c), d = c < .45 ? 4 : c < .75 ? 3 : 2, f = Math.round(l - u), p = Math.round(l + u);
			for (let t = f; t <= p; t++) {
				let r = t === f || t === p;
				e.set(t, n - s, a, r && p > f ? Math.max(1, d - 2) : d);
			}
		}
	}
	function d(t, n, r = 3) {
		e.crack(t, n, r);
	}
	function f(e, t, a) {
		let [o, c, l, u] = t, f = a ? 0 : -1, p = a ? n : r;
		e.begin(a ? "all" : null, 1), s(e, o, 3, c, 2, p, { lift: f }), s(e, c, 1.9, l, 1.3, p, { lift: f }), s(e, l, 1.3, [u[0] + 1, u[1] - .5], 1.4, p, { lift: f }), e.end(), e.begin(null), e.set(u[0] - 1, u[1], i, a ? 3 : 2), e.set(u[0], u[1], i, a ? 2 : 1), a && d(e, [[c[0] + .5, c[1] - 1], [l[0], l[1] - 1]], 2), e.end();
	}
	function p(e, t, a) {
		let [o, c, l, u] = t, f = a ? 0 : -1, p = a ? n : r;
		e.begin(a ? "all" : null, 1), s(e, o, 4, c, 2.6, p, { lift: f }), s(e, c, 2.2, l, 1.4, p, { lift: f }), s(e, l, 1.3, [u[0] + 1, u[1] - .5], 1.3, p, { lift: f }), e.end(), e.begin(null), e.set(u[0] - 1, u[1], i, a ? 3 : 2), e.set(u[0], u[1], i, a ? 2 : 1), e.set(Math.round(l[0] + 1), Math.round(l[1] - 1), i, a ? 2 : 1), a && d(e, [
			[o[0] - 2, o[1] - 2],
			[o[0], o[1] + 1],
			[c[0] + 1, c[1]]
		], 2), e.end();
	}
	function m(e, t) {
		let [c, u] = t.head, f = t.snout * Fr, p = Math.cos(f), m = -Math.sin(f), h = t.jaw, g = [c + p * 8, u + m * 8 + .5];
		e.begin(null), s(e, [c + 2.5, u - 2], 1.5, [c + 6.5, u - 6.5], .4, r, { lift: -1 }), e.end(), e.begin("all", 1), l(e, c + .8, u - .2, 4.6, 3.7, n, { hi: .35 }), s(e, [c + p * 1.5, u + m * 1.5 + .3], 2.8, g, 1.4, n, {
			hi: .3,
			shine: .75
		}), e.end();
		let _ = h * 4;
		if (e.begin("all", 0), s(e, [c + p * 1, u + 2.4], 1.8, [g[0] + .5 - p * .5 - m * _ * .2, g[1] + 1.6 + _], 1, n, { lift: -1 }), e.end(), e.begin(null), h > 0) {
			for (let n = 1; n <= 6; n++) {
				let r = Math.round(c + p * (1 + n * .9)), i = Math.round(u + m * (1 + n * .9) + 1.6);
				for (let s = i; s <= i + Math.round(_ * n / 7); s++) e.set(r, s, t.throat ? a : o, t.throat ? n < 3 ? 4 : 3 : s === i ? 2 : 1);
			}
			e.set(Math.round(g[0] + .5), Math.round(g[1] + 1), i, 4), e.set(Math.round(g[0] + 1.5 - m * _ * .2), Math.round(g[1] + _), i, 3), e.set(Math.round(g[0] + 3.5), Math.round(g[1] + 1.5), i, 3);
		} else {
			for (let t = 1; t <= 6; t++) e.set(Math.round(c + p * (1 + t)), Math.round(u + m * (1 + t) + 1.8), r, 0);
			e.set(Math.round(g[0] + 1), Math.round(g[1] + 1.5), i, 4);
		}
		e.set(Math.round(g[0] - .5), Math.round(g[1] - .6), r, 0), e.end(), e.begin("all", 0), s(e, [c + 1.5, u - 2.5], 1.8, [c + 6, u - 7.5], .4, n, {
			lift: 0,
			shine: .6
		}), e.end(), e.begin(null), e.over(Math.round(c + 3), Math.round(u - 4), o, 2), e.end(), e.begin(null);
		let v = Math.round(c + p * 1.8 - .5), y = Math.round(u - 1 + m * 1.8);
		e.set(v - 1, y - 1, r, 0), e.set(v, y - 1, r, 0), e.set(v, y, a, 4), e.set(v + 1, y, a, 3), d(e, [[c + 2, u + 1], [c + 4, u - 1]], 2), e.end();
	}
	function h(e, t) {
		let [n, r] = t.head, [i, o] = t.neck, s = t.flare, c = n + 1.5, l = r - 3.2, d = i + 5, f = o - 2.5;
		for (let n = 0; n < 6; n++) {
			let r = n / 5, i = c + (d - c) * r, a = l + (f - l) * r, o = (n * 5 + t.flick * 3) % 4 - 1.5, p = Math.sin(Math.PI * Math.min(1, .15 + r * 1.1)), m = Math.round(3 + p * (3.5 + s * 1.5) + o * .8);
			u(e, i, a + 1, Math.max(3, m), 2.6 + s + o * .6 + r * 1.5, 1.4);
		}
		e.begin(null);
		for (let t = 0; t <= 12; t++) {
			let n = t / 12;
			e.set(Math.round(c + (d - c) * n), Math.round(l + (f - l) * n + 1.5), a, n < .8 ? 4 : 3);
		}
		e.end();
	}
	function g(e, t) {
		p(e, t.HF, !1), f(e, t.FF, !1), e.begin("all", 1), c(e, t.tail, t.tail.map((e, n) => 2 - n * (1.4 / (t.tail.length - 1))), n, { lift: 0 }), e.end();
		let a = t.tail[t.tail.length - 1];
		u(e, a[0], a[1] + 1, 4 + t.flare, 1.5, .8), e.begin("all", 1), l(e, t.haunch[0], t.haunch[1], 5.8, 4.6, n), l(e, t.belly[0], t.belly[1] - .5, 6.4, 3.2, n), l(e, t.chest[0], t.chest[1], 6, 5.8, n, { hi: .38 }), e.end(), e.begin(null);
		for (let n = 0; n < 3; n++) {
			let i = Math.round(t.chest[0] + 3 + n * 2.5), a = Math.round(t.chest[1] - 1 + n * .5);
			e.over(i, a, r, 1), e.over(i, a + 1, r, 1), e.over(i + 1, a + 2, r, 1);
		}
		for (let n = Math.round(t.belly[0] - 5); n <= Math.round(t.belly[0] + 5); n++) e.over(n, Math.round(t.belly[1] + 3), r, 0);
		d(e, [
			[t.chest[0] - 2, t.chest[1] - 3],
			[t.chest[0] + 1, t.chest[1]],
			[t.chest[0] - 1, t.chest[1] + 3]
		], 3), d(e, [
			[t.belly[0] - 3, t.belly[1] - 2],
			[t.belly[0], t.belly[1]],
			[t.belly[0] + 4, t.belly[1] - 1]
		], 2), d(e, [[t.haunch[0] - 1, t.haunch[1] - 3], [t.haunch[0] + 2, t.haunch[1] - 1]], 2), e.end(), e.begin("all", 0);
		for (let n = 0; n < 4; n++) {
			let r = n / 3, a = Math.round(t.neck[0] + 6 + r * (t.haunch[0] - t.neck[0] - 6)), o = Math.round(Math.min(t.belly[1] - 4.5, t.haunch[1] - 5) + (n === 0 ? -.5 : 0));
			e.get(a, o + 1) && (e.set(a, o, i, 3), e.set(a + 1, o - 1, i, 2));
		}
		e.end(), e.begin("all", 1), s(e, t.neck, 4, [t.head[0] + 2, t.head[1] + 1], 3, n, { hi: .35 }), e.end(), h(e, t), m(e, t), p(e, t.HN, !0), f(e, t.FN, !0);
	}
	function _(e) {
		let t = {
			chest: [19, 24],
			belly: [28, 23],
			haunch: [37, 22],
			neck: [20, 19],
			head: [11, 14],
			snout: 188,
			jaw: 0,
			FN: [
				[18, 25],
				[17, 30],
				[17, 35],
				[15, 38]
			],
			FF: [
				[21, 25],
				[22, 30],
				[22, 35],
				[20, 38]
			],
			HN: [
				[37, 24],
				[34, 29],
				[40, 33],
				[38, 38]
			],
			HF: [
				[40, 23],
				[38, 29],
				[43, 33],
				[42, 38]
			],
			tail: [
				[43, 20],
				[47, 18],
				[50, 15],
				[52, 12]
			],
			flare: 0,
			flick: 0
		}, n = (e, t, n) => e.map(([e, r]) => [e + t, r + n]), r = (e, r) => {
			for (let n of [
				"chest",
				"belly",
				"haunch",
				"neck",
				"head"
			]) t[n] = [t[n][0] + e, t[n][1] + r];
			t.tail = n(t.tail, e, r);
		};
		switch (e) {
			case "idle1":
				t.flick = 1, t.chest = [19, 25], t.neck = [20, 20], t.head = [11, 15];
				break;
			case "idle2":
				t.flick = 2, t.tail = [
					[43, 20],
					[47, 17],
					[50, 14],
					[51, 10]
				];
				break;
			case "move0":
				t.FN = [
					[18, 25],
					[20, 29],
					[23, 33],
					[24, 37]
				], t.FF = [
					[21, 25],
					[19, 30],
					[15, 33],
					[13, 36]
				], t.HN = [
					[37, 24],
					[31, 28],
					[32, 33],
					[29, 37]
				], t.HF = [
					[40, 23],
					[36, 28],
					[38, 33],
					[35, 38]
				], r(0, 1), t.flick = 1;
				break;
			case "move1":
				t.FN = [
					[18, 25],
					[13, 28],
					[9, 31],
					[6, 33]
				], t.FF = [
					[21, 25],
					[16, 29],
					[12, 33],
					[10, 36]
				], t.HN = [
					[37, 24],
					[37, 29],
					[43, 33],
					[45, 37]
				], t.HF = [
					[40, 23],
					[41, 28],
					[47, 31],
					[50, 34]
				], r(0, -1), t.flick = 2;
				break;
			case "move2":
				t.FN = [
					[18, 25],
					[16, 30],
					[16, 35],
					[14, 38]
				], t.FF = [
					[21, 25],
					[23, 29],
					[26, 33],
					[28, 36]
				], t.HN = [
					[37, 24],
					[35, 29],
					[39, 33],
					[41, 37]
				], t.HF = [
					[40, 23],
					[36, 28],
					[36, 33],
					[33, 37]
				], t.flick = 3;
				break;
			case "move3":
				t.FN = [
					[18, 25],
					[21, 28],
					[24, 31],
					[25, 34]
				], t.FF = [
					[21, 25],
					[22, 29],
					[24, 33],
					[27, 35]
				], t.HN = [
					[37, 24],
					[33, 28],
					[31, 32],
					[28, 34]
				], t.HF = [
					[40, 23],
					[36, 28],
					[35, 32],
					[31, 35]
				], r(0, -2), t.flick = 0;
				break;
			case "windup":
				r(1, 2), t.head = [10, 21], t.snout = 196, t.jaw = .7, t.neck = [20, 22], t.flare = 1, t.FN = [
					[19, 27],
					[16, 31],
					[15, 35],
					[13, 38]
				], t.HN = [
					[38, 26],
					[34, 31],
					[39, 34],
					[37, 38]
				], t.HF = [
					[41, 25],
					[37, 31],
					[42, 34],
					[40, 38]
				];
				break;
			case "attack":
				r(-2, 0), t.head = [8, 18], t.snout = 184, t.jaw = .3, t.neck = [17, 20], t.flare = 1, t.FN = [
					[16, 25],
					[12, 29],
					[10, 33],
					[8, 37]
				], t.FF = [
					[19, 25],
					[16, 30],
					[14, 34],
					[12, 38]
				], t.HN = [
					[35, 24],
					[34, 29],
					[41, 33],
					[43, 38]
				], t.HF = [
					[38, 23],
					[38, 29],
					[45, 33],
					[47, 38]
				];
				break;
			case "hurt":
				r(2, 1), t.head = [13, 13], t.snout = 170, t.jaw = .6, t.neck = [22, 19], t.FN = [
					[20, 26],
					[19, 31],
					[19, 35],
					[17, 38]
				];
				break;
			case "crouch":
				t.chest = [19, 28], t.belly = [28, 27], t.haunch = [38, 26], t.neck = [20, 24], t.head = [10, 22], t.snout = 190, t.flare = 1, t.FN = [
					[18, 29],
					[14, 33],
					[14, 36],
					[11, 38]
				], t.FF = [
					[21, 29],
					[19, 33],
					[19, 36],
					[16, 38]
				], t.HN = [
					[37, 28],
					[32, 33],
					[38, 35],
					[36, 38]
				], t.HF = [
					[40, 27],
					[35, 33],
					[42, 35],
					[40, 38]
				], t.tail = [
					[44, 25],
					[48, 25],
					[51, 23],
					[54, 21]
				];
				break;
			case "leap":
				t.chest = [17, 18], t.belly = [27, 19], t.haunch = [37, 20], t.neck = [17, 14], t.head = [8, 12], t.snout = 192, t.jaw = .5, t.flare = 2, t.FN = [
					[16, 19],
					[11, 21],
					[6, 23],
					[3, 24]
				], t.FF = [
					[19, 19],
					[14, 22],
					[9, 25],
					[6, 27]
				], t.HN = [
					[36, 22],
					[40, 25],
					[46, 26],
					[50, 28]
				], t.HF = [
					[39, 21],
					[43, 24],
					[48, 24],
					[52, 25]
				], t.tail = [
					[43, 19],
					[47, 18],
					[51, 17],
					[54, 16]
				];
				break;
			case "land":
				r(-1, 3), t.head = [9, 22], t.neck = [19, 23], t.snout = 200, t.flare = 1, t.FN = [
					[17, 28],
					[14, 32],
					[13, 36],
					[10, 38]
				], t.FF = [
					[20, 28],
					[18, 32],
					[18, 36],
					[15, 38]
				], t.HN = [
					[36, 27],
					[33, 32],
					[38, 35],
					[36, 38]
				];
				break;
			case "breathWind":
				r(2, 0), t.head = [15, 9], t.snout = 150, t.jaw = .5, t.throat = !0, t.neck = [22, 17], t.flare = 2, t.FN = [
					[21, 25],
					[19, 30],
					[20, 35],
					[18, 38]
				], t.HN = [
					[39, 25],
					[35, 30],
					[40, 34],
					[38, 38]
				];
				break;
			case "breath0":
			case "breath1":
				r(-1, 1), t.head = [8, 17], t.snout = 194, t.jaw = 1, t.throat = !0, t.neck = [18, 20], t.flare = 2, t.flick = e === "breath0" ? 1 : 3, t.FN = [
					[17, 26],
					[13, 30],
					[12, 35],
					[10, 38]
				], t.HN = [
					[36, 25],
					[33, 30],
					[39, 34],
					[38, 38]
				];
				break;
			case "claw0":
			case "claw1": {
				let n = e === "claw1";
				t.chest = [19, 15], t.belly = [24, 21], t.haunch = [30, 27], t.neck = [18, 10], t.head = [11, 7], t.snout = 196, t.jaw = n ? .6 : .2, t.flare = 1, t.FN = n ? [
					[17, 16],
					[12, 20],
					[8, 24],
					[6, 26]
				] : [
					[17, 16],
					[13, 13],
					[9, 10],
					[6, 8]
				], t.FF = n ? [
					[20, 16],
					[16, 13],
					[12, 11],
					[9, 10]
				] : [
					[20, 16],
					[16, 20],
					[12, 23],
					[9, 25]
				], t.HN = [
					[30, 29],
					[27, 33],
					[32, 35],
					[29, 38]
				], t.HF = [
					[33, 28],
					[31, 33],
					[35, 35],
					[33, 38]
				], t.tail = [
					[35, 29],
					[40, 31],
					[45, 32],
					[49, 30]
				], t.flick = n ? 2 : 0;
				break;
			}
			case "howl": r(1, 1), t.head = [14, 6], t.snout = 120, t.jaw = .6, t.neck = [20, 15], t.flare = 2, t.chest = [20, 24], t.FN = [
				[19, 26],
				[18, 31],
				[18, 35],
				[16, 38]
			], t.HN = [
				[38, 26],
				[34, 31],
				[39, 34],
				[37, 38]
			];
		}
		return t;
	}
	function v(e) {
		let t = {
			chest: [28, 26],
			head: [28, 16],
			jaw: 0,
			flare: 0,
			flick: 0,
			fore: [[24, 0], [32, 0]],
			hind: [[22, 0], [34, 0]],
			rear: !1,
			up: !1,
			throat: !1
		};
		switch (e) {
			case "idle1":
				t.flick = 1, t.chest = [28, 27], t.head = [28, 17];
				break;
			case "idle2":
				t.flick = 2;
				break;
			case "move0":
				t.fore = [[24, 2], [32, 0]], t.hind = [[22, 0], [34, 1]], t.flick = 1;
				break;
			case "move1":
				t.chest = [28, 25], t.head = [28, 15], t.flick = 2;
				break;
			case "move2":
				t.fore = [[24, 0], [32, 2]], t.hind = [[22, 1], [34, 0]], t.flick = 3;
				break;
			case "move3":
				t.chest = [28, 25], t.head = [28, 15];
				break;
			case "windup":
				t.head = [28, 22], t.chest = [28, 28], t.jaw = .7, t.flare = 1;
				break;
			case "attack":
				t.head = [28, 21], t.chest = [28, 27], t.jaw = .4, t.flare = 1, t.fore = [[23, 1], [33, 1]];
				break;
			case "hurt":
				t.head = [29, 14], t.jaw = .6;
				break;
			case "crouch":
				t.chest = [28, 30], t.head = [28, 23], t.flare = 1;
				break;
			case "leap":
				t.chest = [28, 22], t.head = [28, 14], t.jaw = .5, t.flare = 2, t.fore = [[22, 4], [34, 4]], t.hind = [[22, 5], [34, 5]];
				break;
			case "land":
				t.chest = [28, 29], t.head = [28, 23], t.flare = 1;
				break;
			case "breathWind":
				t.head = [28, 12], t.jaw = .5, t.throat = !0, t.flare = 2, t.up = !0;
				break;
			case "breath0":
			case "breath1":
				t.head = [28, 19], t.chest = [28, 27], t.jaw = 1, t.throat = !0, t.flare = 2, t.flick = e === "breath0" ? 1 : 3;
				break;
			case "claw0":
			case "claw1":
				t.rear = !0, t.chest = [28, 18], t.head = [28, 8], t.flare = 1, t.jaw = e === "claw1" ? .6 : .2, t.fore = e === "claw1" ? [[20, 14], [36, 18]] : [[20, 18], [36, 13]], t.flick = e === "claw1" ? 2 : 0;
				break;
			case "howl": t.head = [28, 10], t.jaw = .6, t.up = !0, t.flare = 2;
		}
		return t;
	}
	function y(t, c, u) {
		let [d, f] = c.head;
		if (t.begin("all", 0), s(t, [d - 3, f - 2], 1.8, [d - 6, f - 8], .4, n, {
			lift: 0,
			shine: .6
		}), s(t, [d + 3, f - 2], 1.8, [d + 6, f - 8], .4, n, { lift: -1 }), t.end(), t.begin("all", 1), l(t, d, f, 5, 4, n, { hi: .35 }), t.end(), u) {
			t.begin(null);
			for (let e = f - 3; e <= f + 3; e++) t.over(d, e, r, 1);
			t.end();
			return;
		}
		t.begin(null), t.over(d - 4, f - 4, o, 2), t.over(d + 4, f - 4, o, 1), t.end();
		let p = f + (c.up ? 1.5 : 3);
		t.begin("all", 1), s(t, [d, f + .5], 3, [d, p + .5], c.up ? 2.2 : 2.6, n, {
			hi: .25,
			lo: -.35,
			shine: .7
		}), t.end(), t.begin(null);
		let m = Math.round(p - .5);
		t.set(d - 1, m, r, 0), t.set(d, m, r, 0), t.set(d - 1, m - 1, n, 4);
		let h = Math.round(c.jaw * 3), g = Math.round(p + 2);
		if (h > 0) {
			for (let e = g; e <= g + h; e++) for (let n = d - 2; n <= d + 1; n++) t.set(n, e, c.throat ? a : o, c.throat ? e === g ? 4 : 3 : e === g ? 2 : 1);
			t.set(d - 2, g, i, 4), t.set(d + 1, g, i, 3), t.set(d - 2, g + h, i, 3), t.set(d + 1, g + h, i, 3), l(t, d, g + h + 1, 2.2, 1, n, {
				hi: .2,
				lo: -.5
			});
		} else {
			for (let e = d - 2; e <= d + 1; e++) t.set(e, g, r, 0);
			t.set(d - 2, g + 1, i, 4), t.set(d + 1, g + 1, i, 3);
		}
		let _ = Math.round(f - 1);
		t.set(d - 4, _ - 1, r, 0), t.set(d - 3, _ - 1, r, 0), t.set(d + 2, _ - 1, r, 0), t.set(d + 3, _ - 1, r, 0), t.set(d - 3, _, a, 4), t.set(d - 2, _, a, 3), t.set(d + 2, _, a, 4), t.set(d + 1, _, a, 3), e.crack(t, [[d, f - 4], [d, f - 2]], 2), t.end();
	}
	function b(e, t, n) {
		let [r, i] = t.head, o = t.flare;
		for (let n = 0; n < 11; n++) {
			let a = (-110 + n / 10 * 220) * Fr, s = r + Math.sin(a) * 6, c = i - Math.cos(a) * 4 + 2, l = (n * 3 + t.flick * 5) % 4 - 1.5, d = Math.cos(a), f = Math.round(3 + o * 1.4 + Math.max(0, d) * 2.5 + +(n % 3 == 1) + l * .6);
			u(e, s, c, Math.max(2, f), Math.sin(a) * (2.5 + o) + l * .4, 1.1);
		}
		e.begin(null);
		for (let t = -5; t <= 5; t++) e.set(r + t, Math.round(i + 4 + Math.abs(t) * -.4 + (n ? -1 : 0)), a, Math.abs(t) < 3 ? 4 : 3);
		e.end();
	}
	function x(e, t, a) {
		let [o, f] = t.chest;
		if (!t.rear) {
			e.begin(null);
			for (let [n, a] of t.hind) s(e, [n, f + 3], 2.4, [n, 36 - a], 1.3, r, { lift: -1 }), e.set(n - 1, 38 - a, i, 1), e.set(n + 1, 38 - a, i, 1);
			e.end();
		}
		if (e.begin("all", 1), t.rear ? (l(e, o, 29, 6.5, 5.5, n), l(e, o, f + 6, 5.5, 6, n), l(e, o, f, 5.6, 5.8, n, { hi: .38 })) : a ? (l(e, o, f - 4, 5.5, 4, r), l(e, o, f + 2, 7.2, 6.2, n, { hi: .38 })) : (l(e, o, f - 5, 6.2, 3.6, r), l(e, o, f + 1, 5.4, 5.2, n, { hi: .38 })), e.end(), e.begin(null), !a) d(e, [
			[o - 3, f - 2],
			[o - 1, f + 1],
			[o - 2, f + 4]
		], 3), d(e, [[o + 3, f - 1], [o + 2, f + 3]], 2);
		else {
			for (let t = Math.round(f - 4); t <= Math.round(f + 7); t++) e.over(o, t, r, 1);
			for (let t = 0; t < 4; t++) e.set(o, Math.round(f - 4 + t * 3), i, 3);
			d(e, [[o - 5, f], [o - 3, f + 4]], 2), d(e, [[o + 4, f + 1], [o + 6, f + 4]], 2);
		}
		if (e.end(), t.rear) {
			e.begin("all", 1);
			for (let t of [o - 4, o + 4]) s(e, [t, 29], 2.8, [t, 37], 1.6, n, { lift: t > o ? -1 : 0 });
			e.end(), e.begin(null);
			for (let t of [o - 4, o + 4]) e.set(t - 1, 38, i, 2), e.set(t + 1, 38, i, 2);
			e.end();
		}
		a && (e.begin("all", 1), c(e, [
			[o, f + 5],
			[o + 1, f + 9],
			[o + 3, f + 12]
		], [
			1.8,
			1.3,
			.8
		], n), e.end(), u(e, o + 3, f + 13, 4 + t.flare, 1.5, .9)), b(e, t, a), y(e, t, a), e.begin("all", 1);
		for (let [r, i] of t.fore) {
			let c = r < o !== a;
			if (t.rear) s(e, [r < o ? o - 3 : o + 3, f + 1], 2.2, [r, i], 1.2, n, { lift: c ? 0 : -1 });
			else {
				let t = r < o ? -1 : 1;
				s(e, [r - t, f + 2], 2.3, [r, f + 7], 1.5, n, { lift: c ? 0 : -1 }), s(e, [r, f + 7], 1.4, [r + t * .5, 37 - i], 1.2, n, { lift: c ? 0 : -1 });
			}
		}
		e.end(), e.begin(null);
		for (let [n, r] of t.fore) {
			let a = t.rear ? r : 38 - r;
			e.set(n - 1, a, i, 3), e.set(n, a + (t.rear ? -1 : 0), i, 4), e.set(n + 1, a, i, 3), t.rear || d(e, [[n, f + 4], [n, f + 8]], 2);
		}
		e.end();
	}
	function S(t, i, o) {
		t.begin("all", 1), l(t, 30, o - 4, 12, 4.2, n), l(t, 17, o - 4, 5, 3.6, n), s(t, [14, o - 3], 2.4, [7, o - 2], 1.5, n), t.end(), t.begin("all", 0);
		for (let [e, r] of [
			[24, 20],
			[28, 25],
			[36, 40],
			[40, 45]
		]) s(t, [e, o - 2], 1.6, [r, o], 1.1, n, { lift: -1 });
		c(t, [
			[41, o - 5],
			[46, o - 4],
			[50, o - 2]
		], [
			1.8,
			1.2,
			.7
		], n), t.end(), t.begin(null), e.crack(t, [
			[24, o - 6],
			[29, o - 4],
			[34, o - 6]
		], 1);
		for (let e of [
			15,
			18,
			21
		]) t.set(e, o - 8, a, 1);
		i !== "up" && (t.set(13, o - 5, r, 0), t.set(14, o - 5, r, 0)), t.end();
	}
	function C(t, n, r, i) {
		t.ox = Ir, t.oy = Lr, r === "dead" ? S(t, n, i.G - Lr) : n === "side" ? g(t, _(r)) : x(t, v(r), n === "up"), r === "hurt" && e.shear(t, n === "side" ? -.1 : .08, i.G);
	}
	return {
		fw: 64,
		fh: 48,
		columns: [
			...e.COMMON,
			"idle2",
			"crouch",
			"leap",
			"land",
			"breathWind",
			"breath0",
			"breath1",
			"claw0",
			"claw1",
			"howl"
		],
		aliases: {
			bite: "attack",
			biteWind: "windup"
		},
		spriteOptions: { blobSize: [1.9, .75] },
		idle: {
			poses: [
				"idle0",
				"idle1",
				"idle2",
				"idle1"
			],
			fps: 6
		},
		draw: C,
		ramps: () => e.makeRamps({
			[n]: e.ramp5([
				"#0e0a0b",
				"#1e1617",
				"#332825",
				"#54423a",
				"#86684f"
			]),
			[r]: e.ramp5([
				"#080607",
				"#110c0d",
				"#1c1515",
				"#2a201e",
				"#3c2e28"
			]),
			[i]: e.ramp5([
				"#5c5244",
				"#8e826c",
				"#bfb294",
				"#ded2b2",
				"#f8f0d6"
			]),
			[o]: e.ramp5([
				"#1c0606",
				"#3e0c0a",
				"#6a1612",
				"#94261a",
				"#c04428"
			]),
			[a]: e.glowRamp([
				"#7a1606",
				"#d2420c",
				"#ff8a1e",
				"#ffc24a",
				"#fff2b0"
			])
		}, n)
	};
}
//#endregion
//#region src/engine/pixel/monsters/wyrmcaller.js
var Vr = -.55, Hr = -.8, Ur = 4, Wr = 8;
function Gr(e) {
	let { M: t } = e, n = t.TOP, r = t.BOTTOM, i = t.GOLD, a = t.FUR2, o = t.BONE, s = t.WOOD, c = t.GLOW, l = t.SKIN, u = t.SASH;
	function d(e, t, n, r, i, a, o = {}) {
		let { hi: s = .42, lo: c = -.22, deep: l = -.72, lift: u = 0, max: d = 4 } = o, [f, p] = t, [m, h] = r, g = m - f, _ = h - p, v = g * g + _ * _ || 1e-9, y = Math.max(n, i);
		for (let t = Math.floor(Math.min(p, h) - y - 1); t <= Math.ceil(Math.max(p, h) + y + 1); t++) for (let r = Math.floor(Math.min(f, m) - y - 1); r <= Math.ceil(Math.max(f, m) + y + 1); r++) {
			let o = r + .5, m = t + .5, h = Math.max(0, Math.min(1, ((o - f) * g + (m - p) * _) / v)), y = o - (f + g * h), b = m - (p + _ * h), x = n + (i - n) * h;
			if (y * y + b * b > x * x) continue;
			let S = (y * Vr + b * Hr) / Math.max(.5, x), C = S > s ? 3 : S > c ? 2 : +(S > l);
			e.set(r, t, a, Math.max(0, Math.min(d, C + u)));
		}
	}
	function f(t, n, r, i, a, o, s = {}) {
		e.blob(t, n, r, i, a, o, {
			hi: .42,
			lo: -.25,
			deep: -.75,
			...s
		});
	}
	function p(e, t, n, r, i, a = 1) {
		for (let o = 0; o < r; o++) {
			let s = o / Math.max(1, r - 1), l = t + i * s * s, u = a * (1 - s), d = s < .45 ? 4 : s < .75 ? 3 : 2, f = Math.round(l - u), p = Math.round(l + u);
			for (let t = f; t <= p; t++) e.set(t, n - o, c, (t === f || t === p) && p > f ? Math.max(1, d - 2) : d);
		}
	}
	function m(e, t, n, r, a) {
		let [l, u] = t, [m, h] = n;
		e.begin("all", 0), d(e, t, .9, n, 1.1, s, { lift: 0 }), e.end(), e.begin(null);
		for (let t of [
			.3,
			.55,
			.78
		]) e.set(Math.round(l + (m - l) * t + 1), Math.round(u + (h - u) * t), s, 1);
		e.set(Math.round(m + (l - m) * .08), Math.round(h + (u - h) * .08) + 1, i, 3), e.end(), e.begin("all", 0), d(e, [m - 2, h + 1], .7, [m - 2.5, h - 3], .5, o, { lift: 1 }), d(e, [m + 2, h + 1], .7, [m + 2.5, h - 3], .5, o, { lift: 0 }), e.end(), e.begin(null), f(e, m, h - 2, 2, 2, c, {
			hi: .2,
			lo: -.4,
			maxShade: 4,
			minShade: 2
		}), e.set(Math.round(m - 1), Math.round(h - 3), c, 4), e.end();
		let g = r;
		p(e, m, h - 3, 4 + g * 2 + a % 2, 1 + (a === 2 ? -1 : 0), 1.3), p(e, m - 2, h - 2, 2 + g + (a + 1) % 2, -1, .8), p(e, m + 2, h - 2, 2 + g + +(a % 3 == 1), 1.5, .8);
	}
	function h(e) {
		let t = {
			drop: 0,
			sway: 0,
			head: [24, 14],
			armS: [
				[18, 22],
				[14, 28],
				[14, 31]
			],
			staff: [[13, 46], [12, 9]],
			armF: [
				[30, 22],
				[33, 28],
				[31, 33]
			],
			flame: 0,
			flick: 0,
			wrap: !1,
			hem: 0
		};
		switch (e) {
			case "idle1":
				t.drop = 1, t.flick = 1, t.armS = [
					[18, 23],
					[14, 29],
					[14, 32]
				], t.armF = [
					[30, 23],
					[33, 29],
					[31, 34]
				];
				break;
			case "idle2":
				t.flick = 2;
				break;
			case "move0":
				t.sway = 1, t.hem = 1, t.flick = 1;
				break;
			case "move1":
				t.drop = 1, t.flick = 2;
				break;
			case "move2":
				t.sway = -1, t.hem = -1, t.flick = 0;
				break;
			case "move3":
				t.drop = 1, t.flick = 1;
				break;
			case "windup":
				t.head = [24, 15], t.armS = [
					[18, 22],
					[13, 18],
					[15, 13]
				], t.staff = [[17, 32], [13, 7]], t.armF = [
					[30, 22],
					[29, 16],
					[20, 15]
				], t.flame = 2;
				break;
			case "attack":
				t.armS = [
					[18, 22],
					[12, 25],
					[8, 24]
				], t.staff = [[15, 33], [4, 15]], t.armF = [
					[30, 22],
					[35, 24],
					[39, 22]
				], t.flame = 1;
				break;
			case "hurt":
				t.head = [25, 13], t.drop = -1, t.armS = [
					[18, 22],
					[13, 27],
					[12, 30]
				], t.staff = [[10, 45], [14, 9]];
				break;
			case "channel":
				t.head = [24, 14], t.armS = [
					[18, 22],
					[14, 16],
					[17, 11]
				], t.staff = [[18, 28], [17, 7]], t.armF = [
					[30, 22],
					[34, 16],
					[31, 11]
				], t.flame = 2, t.flick = 1;
				break;
			case "blink":
				t.drop = 6, t.wrap = !0, t.head = [24, 21], t.armS = [
					[19, 28],
					[18, 33],
					[20, 35]
				], t.staff = [[17, 46], [16, 18]], t.armF = [
					[29, 28],
					[28, 33],
					[25, 35]
				];
				break;
			case "throw": t.armF = [
				[30, 22],
				[32, 14],
				[36, 8]
			], t.armS = [
				[18, 22],
				[13, 27],
				[11, 31]
			], t.staff = [[8, 45], [15, 10]], t.flame = 1;
		}
		return t;
	}
	function g(e) {
		let t = {
			drop: 0,
			sway: 0,
			head: [21, 14],
			armS: [
				[22, 22],
				[20, 28],
				[17, 31]
			],
			staff: [[15, 46], [14, 8]],
			armF: [
				[26, 22],
				[28, 28],
				[26, 32]
			],
			flame: 0,
			flick: 0,
			wrap: !1,
			hem: 0
		};
		switch (e) {
			case "idle1":
				t.drop = 1, t.flick = 1, t.armS = [
					[22, 23],
					[20, 29],
					[17, 32]
				];
				break;
			case "idle2":
				t.flick = 2;
				break;
			case "move0":
				t.hem = 2, t.flick = 1, t.staff = [[12, 46], [14, 8]];
				break;
			case "move1":
				t.drop = 1, t.flick = 2, t.hem = 1;
				break;
			case "move2":
				t.hem = -2, t.staff = [[17, 46], [14, 8]];
				break;
			case "move3":
				t.drop = 1, t.flick = 1, t.hem = -1;
				break;
			case "windup":
				t.head = [22, 15], t.armS = [
					[22, 22],
					[22, 16],
					[22, 12]
				], t.staff = [[27, 32], [20, 7]], t.flame = 2, t.armF = [
					[26, 22],
					[26, 16],
					[23, 12]
				];
				break;
			case "attack":
				t.head = [19, 15], t.armS = [
					[21, 22],
					[15, 23],
					[10, 22]
				], t.staff = [[18, 28], [3, 17]], t.flame = 1, t.armF = [
					[25, 22],
					[21, 26],
					[16, 27]
				];
				break;
			case "hurt":
				t.head = [23, 13], t.drop = -1, t.armS = [
					[23, 22],
					[22, 28],
					[20, 31]
				], t.staff = [[19, 46], [17, 9]];
				break;
			case "channel":
				t.armS = [
					[22, 22],
					[19, 16],
					[19, 11]
				], t.staff = [[20, 29], [18, 7]], t.armF = [
					[26, 22],
					[27, 16],
					[24, 11]
				], t.flame = 2, t.flick = 1;
				break;
			case "blink":
				t.drop = 6, t.wrap = !0, t.head = [21, 21], t.armS = [
					[22, 28],
					[20, 33],
					[18, 35]
				], t.staff = [[17, 46], [17, 19]], t.armF = [
					[26, 28],
					[24, 33],
					[21, 35]
				];
				break;
			case "throw": t.armF = [
				[25, 22],
				[20, 14],
				[14, 9]
			], t.armS = [
				[22, 22],
				[24, 28],
				[25, 31]
			], t.staff = [[28, 46], [22, 9]], t.flame = 1;
		}
		return t;
	}
	function _(e, t, r) {
		let [a, o, s] = t, c = r ? 0 : -1;
		e.begin("all", 1), d(e, a, 2.6, o, 2.4, n, { lift: c }), d(e, o, 2.4, s, 3, n, { lift: c }), e.end();
		let u = s[0] - o[0], p = s[1] - o[1], m = Math.hypot(u, p) || 1;
		e.begin(null);
		for (let t = -3; t <= 3; t++) {
			let n = Math.round(s[0] - p / m * t * .8), r = Math.round(s[1] + u / m * t * .8);
			e.get(n, r) && e.set(n, r, i, t < 0 ? 3 : 2);
		}
		e.end(), e.begin("all", 0), f(e, s[0] + u / m * 1.8, s[1] + p / m * 1.8, 1.4, 1.3, l, { hi: .3 }), e.end();
	}
	function v(e, t, i) {
		let [a, s] = t.head, l = s + t.drop, u = i === "side", p = i === "up";
		if (e.begin("all", 0), u) d(e, [a + 1, l - 3], 1.3, [a + 6, l - 6], .9, o, { lift: -1 }), d(e, [a + 6, l - 6], .9, [a + 9, l - 4], .4, o, { lift: -1 });
		else for (let t of [-1, 1]) d(e, [a + t * 3, l - 3], 1.3, [a + t * 6, l - 7], .9, o, { lift: t < 0 ? 0 : -1 }), d(e, [a + t * 6, l - 7], .9, [a + t * 7, l - 10], .4, o, { lift: t < 0 ? 0 : -1 });
		if (e.end(), e.begin("all", 1), f(e, a + +!!u, l - .5, 4.6, 4.8, n, { hi: .35 }), e.end(), p) {
			e.begin(null);
			for (let t = l - 3; t <= l + 4; t++) e.over(a, t, r, 1);
			e.end();
			return;
		}
		e.begin("all", 0), u ? (f(e, a - 1, l + .5, 2.8, 3, o, {
			hi: .25,
			lo: -.4
		}), d(e, [a - 2, l + 1.5], 1.6, [a - 5, l + 2.5], 1.1, o, { lift: 0 })) : (f(e, a, l + .8, 3, 3.2, o, {
			hi: .25,
			lo: -.4
		}), d(e, [a, l + 2], 1.6, [a, l + 4], 1.2, o, { lift: 0 })), e.end(), e.begin(null);
		for (let t = a - 3; t <= a + 3; t++) e.over(u ? t - 1 : t, l - 2, n, 0);
		if (u) e.set(a - 2, l, c, 4), e.set(a - 1, l, o, 0), e.set(a - 5, l + 3, o, 4), e.set(a - 4, l + 2, o, 1);
		else {
			for (let t of [a - 2, a + 1]) e.set(t, l - 1, o, 0), e.set(t + (t < a ? -1 : 1), l, o, 0), e.set(t, l + 1, o, 1);
			e.set(a - 2, l, c, 4), e.set(a + 1, l, c, 3), e.set(a - 1, l + 1, o, 4), e.set(a - 1, l + 3, o, 0), e.set(a, l + 3, o, 0), e.set(a - 2, l + 4, o, 4), e.set(a + 1, l + 4, o, 3);
		}
		e.end();
	}
	function y(t, s, l) {
		let d = l === "side", p = l === "up", m = s.drop, h = (d ? 23 : 24) + s.sway * .5, g = 20 + m, _ = s.wrap ? 9 : d ? 7.5 : 9, v = h - _ - 0 + Math.min(0, s.hem), y = h + _ + (d ? 2 : 0) + Math.max(0, s.hem);
		if (t.begin("all", 1), e.fillPoly(t, [
			[h - 3.5, g],
			[h + 3.5, g],
			[h + 5, g + 8],
			[y, 46],
			[v, 46],
			[h - 5, g + 8]
		], n, (e, t) => {
			let n = (e + .5 - h) / (_ + 1), r = Math.abs(Math.round(e - h + s.hem * (t - g) / 26)) % 4 == 2;
			return t >= 45 ? 0 : r ? 1 : n < -.3 ? 3 : n < .35 ? 2 : 1;
		}), t.end(), t.begin(null), p) for (let e = g + 2; e <= 45; e++) t.over(Math.round(h), e, r, 1);
		else {
			for (let e = g + 3; e <= 45; e++) {
				let n = (e - g) / (46 - g), i = 1 + Math.round(n * 2);
				for (let n = Math.round(h - i + (d ? -2 : 0)); n <= Math.round(h + i - 1 + (d ? -2 : 0)); n++) t.over(n, e, r, n < h ? 2 : 1);
			}
			let e = Math.round(h + (d ? -2 : 0)), n = g + 12;
			t.set(e, n, c, 3), t.set(e - 1, n + 1, c, 2), t.set(e + 1, n + 1, c, 2), t.set(e, n + 2, c, 3), t.set(e, n - 1, c, 2);
		}
		for (let e = Math.round(v); e <= Math.round(y); e++) t.over(e, 44, i, e < h ? 3 : 2), t.over(e, 43, i, 1);
		t.end(), t.begin("all", 0);
		for (let e = Math.round(h - 5); e <= Math.round(h + 5); e++) t.over(e, g + 7, u, e < h ? 3 : 2), t.over(e, g + 8, u, 1);
		if (t.end(), t.begin(null), !p) for (let [e, n] of [
			[h - 3, 3],
			[h + 2, 2],
			[h + 4, 3]
		]) for (let r = 1; r <= n; r++) t.set(Math.round(e), g + 8 + r, r === n ? o : u, r === n ? 3 : 1);
		t.end(), t.begin("all", 0), f(t, h + +!!d, g + 1.5, d ? 4.8 : 5.8, 3.2, a, { hi: .35 }), t.end(), t.begin(null);
		for (let e = Math.round(h - 5); e <= Math.round(h + 5); e += 2) t.over(e, g + 3, a, 0);
		for (let e = Math.round(h - 4); e <= Math.round(h + 4); e += 2) t.over(e, g + 1, a, 3);
		t.end();
	}
	function b(e, t, n) {
		let r = t === "side", i = t === "up", a = r ? g(n) : h(n), o = i ? {
			...a,
			head: [48 - a.head[0], a.head[1]],
			armS: a.armS.map(([e, t]) => [48 - e, t]),
			armF: a.armF.map(([e, t]) => [48 - e, t]),
			staff: a.staff ? a.staff.map(([e, t]) => [48 - e, t]) : null,
			sway: -a.sway,
			hem: -a.hem
		} : a, s = o.drop, c = (e) => e.map(([e, t]) => [e, t + s]), l = o.staff ? c(o.staff) : null;
		r && _(e, c(o.armF), !1), i && l && m(e, l[0], l[1], o.flame, o.flick), y(e, o, t), v(e, o, t), r || _(e, c(o.armF), i), !i && l && m(e, l[0], l[1], o.flame, o.flick), _(e, c(o.armS), !i);
	}
	function x(r, a, l) {
		r.begin("all", 1), e.fillPoly(r, [
			[8, l - 5],
			[16, l - 8],
			[30, l - 7],
			[36, l - 3],
			[36, l],
			[6, l]
		], n, (e) => e % 4 == 1 ? 1 : e < 20 ? 3 : 2), r.end(), r.begin(null);
		for (let e = 7; e <= 35; e++) r.over(e, l - 1, i, e < 20 ? 3 : 2);
		r.end(), r.begin("all", 0), d(r, [10, l - 1], .9, [40, l - 4], .9, s), f(r, 38, l - 6, 2.6, 2.6, o, { hi: .25 }), r.end(), r.begin(null), a !== "up" && (r.set(37, l - 6, t.LINE, 0), r.set(39, l - 6, t.LINE, 0)), r.set(41, l - 5, c, 1), r.set(42, l - 4, c, 2), r.end();
	}
	function S(t, n, r, i) {
		t.ox = Ur, t.oy = Wr, r === "dead" ? x(t, n, i.G - Wr) : b(t, n, r), r === "hurt" && e.shear(t, n === "side" ? -.1 : .08, i.G);
	}
	return {
		fw: 56,
		fh: 56,
		columns: [
			...e.COMMON,
			"idle2",
			"channel",
			"blink",
			"throw"
		],
		aliases: {
			cast: "attack",
			castWind: "windup"
		},
		spriteOptions: { blobSize: [1, .5] },
		idle: {
			poses: [
				"idle0",
				"idle1",
				"idle2",
				"idle1"
			],
			fps: 5
		},
		draw: S,
		ramps: () => e.makeRamps({
			[n]: e.ramp5([
				"#1a070b",
				"#3a0e15",
				"#62161e",
				"#8e2a26",
				"#ba4a34"
			]),
			[r]: e.ramp5([
				"#08060a",
				"#121016",
				"#1e1a22",
				"#2c2632",
				"#3e3646"
			]),
			[i]: e.ramp5([
				"#3a2208",
				"#6e4612",
				"#a8741e",
				"#d8a838",
				"#f6d878"
			]),
			[a]: e.ramp5([
				"#100a0a",
				"#221616",
				"#382422",
				"#523632",
				"#704a40"
			]),
			[o]: e.ramp5([
				"#5e5446",
				"#948670",
				"#c6b898",
				"#e6dabc",
				"#fbf6e0"
			]),
			[s]: e.ramp5([
				"#140c08",
				"#28180e",
				"#3e2616",
				"#563622",
				"#704a30"
			]),
			[l]: e.ramp5([
				"#3a2a26",
				"#5e4640",
				"#82645a",
				"#a48478",
				"#c4a496"
			]),
			[u]: e.ramp5([
				"#1a1206",
				"#34240e",
				"#4e3814",
				"#6a4e1e",
				"#8a682a"
			]),
			[c]: e.glowRamp([
				"#7a1606",
				"#d2420c",
				"#ff8a1e",
				"#ffc24a",
				"#fff2b0"
			])
		}, n)
	};
}
//#endregion
//#region src/engine/pixel/monsters/kobold.js
var Kr = {
	idle0: {
		sp: "up",
		sh: "side"
	},
	idle1: {
		by: 1,
		hy: 0,
		tx: 1,
		ty: -1,
		sp: "up",
		sh: "side"
	},
	move0: {
		lean: 1,
		fn: -2,
		ff: 2,
		lf: 1,
		tx: 1,
		sp: "level",
		sh: "front"
	},
	move1: {
		lean: 1,
		by: -1,
		fn: 0,
		ff: 0,
		ln: 1,
		tx: 0,
		ty: -1,
		sp: "level",
		sh: "front"
	},
	move2: {
		lean: 1,
		fn: 2,
		ff: -2,
		ln: 1,
		tx: -1,
		sp: "level",
		sh: "front"
	},
	move3: {
		lean: 1,
		by: -1,
		fn: 0,
		ff: 0,
		lf: 1,
		tx: 0,
		ty: 1,
		sp: "level",
		sh: "front"
	},
	windup: {
		by: 1,
		lean: -1,
		hx: 1,
		jaw: 1,
		eye: "fierce",
		fn: -1,
		ff: 2,
		tx: 1,
		ty: -2,
		sp: "back",
		sh: "front"
	},
	attack: {
		lean: 2,
		hx: -1,
		jaw: 1,
		eye: "fierce",
		fn: -3,
		ff: 3,
		tx: 0,
		ty: 1,
		sp: "jab",
		sh: "low"
	},
	hurt: {
		by: 0,
		lean: -1,
		hx: 2,
		hy: -1,
		jaw: 1,
		eye: "shut",
		fn: 1,
		ff: -1,
		tx: 2,
		ty: -1,
		sp: "drop",
		sh: "side"
	},
	dead: {
		sp: "drop",
		sh: "side"
	},
	lungeWind: {
		by: 2,
		lean: 0,
		hx: 1,
		hy: 1,
		jaw: 1,
		eye: "fierce",
		fn: -1,
		ff: 3,
		tx: 1,
		ty: -4,
		sp: "low",
		sh: "front"
	},
	lunge: {
		by: 2,
		lean: 3,
		hx: -2,
		hy: 1,
		jaw: 1,
		eye: "fierce",
		fn: -4,
		ff: 4,
		lf: 0,
		tx: -1,
		ty: 0,
		sp: "drive",
		sh: "low",
		stretch: !0
	},
	guard: {
		by: 1,
		sp: "over",
		sh: "raised",
		eye: "fierce"
	},
	guard2: {
		by: 2,
		tx: 1,
		ty: -1,
		sp: "over",
		sh: "raised",
		eye: "fierce"
	}
}, qr = [
	"lungeWind",
	"lunge",
	"guard",
	"guard2"
];
function Jr(e) {
	let { M: t } = e, n = t.FUR, r = t.FUR2, i = t.FUR3, a = t.COMB, o = t.METAL, s = t.SCARF;
	function c(t, n, r, i, a, o, s, c) {
		e.thickLine(t, n, r, i, a, o, s, c);
	}
	function l(e, n, r, i, a, o, s, l, u) {
		let d = a - o, f = (n + i) / 2 + s * 1.5, p = r + (d - r) * .45, m = i - s * 1, h = d - 1;
		c(e, n, r, f, p, 2.2, l, u + 1), c(e, f, p, m, h, 1.4, l, u), e.set(Math.round(m), Math.round(d), l, u), e.set(Math.round(m + s), Math.round(d), l, u + 1), e.set(Math.round(m + s * 2), Math.round(d), t.BONE, 2);
	}
	function u(e, t, r, i, a, o, s) {
		let l = [];
		for (let e = 0; e <= 6; e++) {
			let n = e / 6, c = t + i * (a * n + o * n * n), u = r + 3.2 * n - 4.2 * n * n * n + s * n * n + 1.2 * n * n;
			l.push([c, u]);
		}
		for (let t = 0; t < 6; t++) {
			let i = 2.6 - t * .32, [a, o] = l[t], [s, u] = l[t + 1];
			c(e, a, o, s, u, i, n, (e) => o + (u - o) * e < r + 1.5 ? 2 : 1);
		}
		e.over(Math.round(l[1][0]), Math.round(l[1][1] - 1), n, 3);
	}
	function d(e, t, r, i, a) {
		for (let o = r; o <= a; o++) for (let r = t; r <= i; r++) {
			if (e.get(r, o) !== n) continue;
			let t = e.getShade(r, o);
			t >= 1 && t <= 3 && (r * 2 + o * 3) % 5 == 0 && e.set(r, o, n, t - 1);
		}
	}
	function f(e, n, r, i, a, c) {
		let l = i - n, u = a - r, d = Math.hypot(l, u) || 1, f = l / d, p = u / d;
		e.line2(n, r, i - f * 3, a - p * 3, t.WOOD, (e) => c ? 1 : e > .5 ? 3 : 2);
		for (let t = 0; t < 3; t++) {
			let n = i - f * t, r = a - p * t;
			e.set(Math.round(n), Math.round(r), o, t === 0 ? 4 : c ? 2 : 3);
		}
		let m = -p, h = f;
		e.set(Math.round(i - f * 2 + m), Math.round(a - p * 2 + h), o, c ? 1 : 2), e.set(Math.round(i - f * 2 - m), Math.round(a - p * 2 - h), o, c ? 2 : 4);
		let g = Math.round(i - f * 3.6), _ = Math.round(a - p * 3.6);
		e.set(g, _ + 1, s, c ? 1 : 3), e.set(g, _ + 2, s, c ? 0 : 2);
	}
	function p(e, n, r, i, o, s) {
		for (let a = Math.floor(r - o - 1); a <= Math.ceil(r + o + 1); a++) for (let s = Math.floor(n - i - 1); s <= Math.ceil(n + i + 1); s++) {
			let c = (s + .5 - n) / i, l = (a + .5 - r) / o, u = c * c + l * l;
			if (u > 1) continue;
			let d = -c * .6 - l * .75, f = d > .35 ? 3 : d > -.3 ? 2 : 1;
			u > .62 && (f = d > .1 ? 2 : 0), u > .62 && d > .5 && (f = 3), e.set(s, a, t.LEATHER, f);
		}
		let c = Math.round(n - .5), l = Math.round(r - .5);
		if (s) {
			e.line2(c - Math.floor(i) + 1, l, c + Math.floor(i) - 1, l, t.WOOD, 1), e.line2(c, l - Math.floor(o) + 1, c, l + Math.floor(o) - 1, t.WOOD, 2);
			return;
		}
		if (i >= 2.2) {
			for (let [t, n] of [
				[0, -2],
				[2, 0],
				[0, 2],
				[-2, 0]
			]) e.over(c + t, l + n, a, t < 0 || n < 0 ? 3 : 2);
			if (i >= 2.8) for (let [t, n] of [
				[-1, -1],
				[1, -1],
				[1, 1],
				[-1, 1]
			]) e.over(c + t, l + n, a, 1);
		} else e.over(c, l - 2, a, 3), e.over(c, l + 2, a, 2);
		e.set(c, l, t.BONE, 3), i >= 2.2 && e.set(c - 1, l, t.BONE, 4);
	}
	function m(e, t, n, r, i) {
		for (let a = 0; a < t.length; a++) for (let o = 0; o < t[a].length; o++) {
			let s = n[t[a][o]];
			s && e.set(r + o, i + a, s[0], s[1]);
		}
	}
	let h = {
		D: [n, 0],
		d: [n, 1],
		o: [n, 2],
		O: [n, 3],
		L: [n, 4],
		c: [i, 2],
		C: [i, 3],
		e: [t.EYE, 3],
		E: [t.EYE, 4],
		p: [t.EYE, 0],
		m: [t.NOSE, 1],
		M: [t.NOSE, 2],
		t: [t.BONE, 4],
		n: [n, 0],
		w: [t.BONE, 3]
	}, g = {
		shut: [
			"....dOOOd.",
			"..dOOLLOOd",
			".nOOOOOOod",
			"oOOOOOoood",
			"DDDDDDDood",
			".cCCCcdd.."
		],
		open: [
			"....dOOOd.",
			"..dOOLLOOd",
			".nOOOOOOod",
			"oOOOOOoood",
			"tMMMMmmdod",
			"dmcCCcddd.",
			".DccccDd.."
		]
	}, _ = {
		shut: [
			"..dOOOd..",
			".dOOLOOod",
			"dOOOOOOod",
			"dOOLOOOod",
			".dOOOOod.",
			".dnOOnod.",
			"..DDDDD..",
			"..cCCcc.."
		],
		open: [
			"..dOOOd..",
			".dOOLOOod",
			"dOOOOOOod",
			"dOOLOOOod",
			".dOOOOod.",
			".dnOOnod.",
			"..DtmtD..",
			"..cMMMc..",
			"...ccc..."
		],
		back: [
			"..dOOOd..",
			".dOOLOOod",
			"dOOOOOOod",
			"dOOOOOood",
			".dOOoood.",
			"..doood..",
			"...ddd..."
		]
	};
	function v(e, r, i, a) {
		e.begin("all", 0), m(e, a.jaw ? g.open : g.shut, h, r - 6, i - 3), e.end(), e.begin(null);
		let o = r - 1, s = i - 1;
		a.eye === "shut" ? (e.set(o, s, n, 0), e.set(o + 1, s, n, 0), e.set(o - 1, s + 1, n, 1)) : (e.set(o, s, t.EYE, a.eye === "fierce" ? 4 : 3), e.set(o + 1, s, t.EYE, 0), e.set(o, s - 1, n, a.eye === "fierce" ? 0 : 1), e.set(o + 1, s - 1, n, a.eye === "fierce" ? 0 : 2)), e.over(r + 1, i, t.BONE, 3), e.over(r + 1, i + 1, t.BONE, 2), e.end();
	}
	function y(e, r, i, a, o) {
		if (e.begin("below", 1), m(e, o ? _.back : a.jaw ? _.open : _.shut, h, r - 4, i - 3), e.end(), !o) {
			e.begin(null);
			for (let [o, s, c] of [[
				r - 4,
				1,
				3
			], [
				r + 4,
				-1,
				2
			]]) {
				if (a.eye === "shut") {
					e.set(o, i - 1, n, 0), e.set(o + s, i - 1, n, 0);
					continue;
				}
				e.set(o, i - 1, t.EYE, a.eye === "fierce" ? c + 1 : c), e.set(o + s, i - 1, t.EYE, 0), a.eye === "fierce" && e.set(o + s, i - 2, n, 0);
			}
			e.over(r - 2, i - 2, t.BONE, 4), e.over(r + 2, i - 2, t.BONE, 3), e.end();
		}
	}
	function b(e, t, n) {
		for (let [r, i, o] of [
			[
				0,
				0,
				3
			],
			[
				2,
				1,
				3
			],
			[
				4,
				2.5,
				2
			],
			[
				5.5,
				4,
				1
			]
		]) for (let s = 0; s < o; s++) e.set(Math.round(t + r + s * .5), Math.round(n + i - s), a, s === o - 1 ? 3 : s === 0 ? 1 : 2);
	}
	function x(t, a, o) {
		let s = a.by ?? 0, c = a.lean ?? 0, m = 13 + +!!a.stretch, h = 17 + s, g = 11.6 - c * .6, _ = 14.6 + s, y = 7.6 - c + (a.hx ?? 0) - +!!a.stretch, x = 10.6 + s + (a.hy ?? 0) + (a.stretch ? 1.5 : 0), C = a.sp;
		t.begin(null), C === "up" && f(t, 14.5, o, 14.5, 3 + s, !0), t.end(), t.begin(null), l(t, m + 1, h, 12 + (a.ff ?? 0), o, a.lf ?? 0, -1, r, 1), t.end(), t.begin(null), u(t, m + 2, h - 1, 1, a.stretch ? 7.5 : 6.5, a.tx ?? 0, a.ty ?? 0), t.end(), t.begin(null), e.blob(t, m - .3, h - 1, 3, 2.6, n, {
			hi: .35,
			lo: -.25
		}), e.blob(t, g, _, a.stretch ? 3.6 : 3.2, 3.3, n, {
			hi: .4,
			lo: -.2
		});
		for (let e = Math.round(_ - 1); e <= h; e++) for (let r = Math.round(g - 4); r <= Math.round(g); r++) t.get(r, e) === n && (t.get(r - 1, e) === 0 || r > g - 1.5 + (e - _) * .3 || t.set(r, e, i, (e - Math.round(_)) % 2 == 0 ? 3 : 2));
		d(t, Math.round(g - 3), Math.round(_ - 4), m + 3, h + 1), t.end(), t.begin("sides", 1), l(t, m - .5, h + .5, 11 + (a.fn ?? 0), o, a.ln ?? 0, -1, n, 1), t.end(), v(t, Math.round(y), Math.round(x), a), t.begin(null), b(t, y + .5, x - 2.6), t.end(), C === "level" && (t.begin(null), f(t, 17.5, 20 + s, 5, 3 + s, !1), S(t, g, _ - 1, 10.5, 13 + s), t.end()), t.begin("all", 0);
		let w = a.sh;
		w === "raised" ? p(t, y - 1.5, x + 1.5, 2.1, 3.4, !1) : w === "front" ? p(t, g - 2.4, _ + .6, 2.1, 3.3, !1) : w === "low" ? p(t, g + 1.5, _ + 2, 2, 3, !1) : p(t, g - 1.2, _ + .6, 2.1, 3.3, !1), t.end(), t.begin(null), C === "back" ? (f(t, 21, 14.5 + s, 7.5, 14 + s, !1), S(t, g + .5, _ - 1.5, 15.5, 14.5 + s)) : C === "jab" ? (f(t, 14, 15 + s, 2.5, 14.5 + s, !1), S(t, g, _ - 1.5, 8.5, 15 + s)) : C === "low" ? (f(t, 21, 16 + s, 8.5, 15 + s, !1), S(t, g + .5, _ - 1, 15, 15.5 + s)) : C === "drive" ? (f(t, 13.5, 15 + s, 2.5, 14 + s, !1), S(t, g - .5, _ - 1, 7.5, 14.5 + s)) : C === "over" ? (f(t, 18, 11 + s, 4, 8 + s, !1), S(t, g + .5, _ - 1.5, 12, 10 + s)) : C === "drop" ? f(t, 6, o, 17, 6 + s, !0) : C === "up" && S(t, g + .5, _ - 1, 14, _ + .5), t.end();
	}
	function S(e, t, r, i, a) {
		c(e, t, r, i, a, 1.4, n, 2), e.set(Math.round(i), Math.round(a), n, 3);
	}
	function C(o, s, l, u) {
		let m = s.by ?? 0, h = 15.2 + m, g = 12 + (s.hx ?? 0) * .5, _ = 10.4 + m + (s.hy ?? 0) + +!!s.stretch, v = u ? 1 : -1, b = s.sp;
		(s.fn ?? 0) - (s.ff ?? 0), o.begin(null), u ? (c(o, 12, 17 + m, 13 + (s.tx ?? 0) * .5, 20.5, 2.6, n, 2), c(o, 13 + (s.tx ?? 0) * .5, 20.5, 16 + (s.tx ?? 0), 21.5 + Math.min(0, (s.ty ?? 0) * .3), 1.6, n, 1)) : (c(o, 13, 18 + m, 17, 19.5 + m, 2, r, 1), c(o, 17, 19.5 + m, 19 + (s.tx ?? 0) * .5, 18 + (s.ty ?? 0) * .5, 1.2, r, 1)), o.end(), o.begin(null), b === "up" && f(o, 12 + v * 5, l, 12 + v * 5, 3 + m, !1), o.end(), o.begin(null);
		let x = [Math.max(0, s.ln ?? 0), Math.max(0, s.lf ?? 0)];
		for (let [e, r] of [[0, 10], [1, 14]]) {
			let i = l - x[e];
			c(o, r, 17 + m, r + (e ? .5 : -.5), i - 1, 2.2, n, e === 0 ? 2 : 1), o.set(r - 1, i, n, 1), o.set(r, i, n, 2), o.set(r + 1, i, n, 1), o.set(r - 1 + (e ? 2 : 0), i, t.BONE, 2);
		}
		if (o.end(), o.begin(null), e.blob(o, 12, h, 3.4, 3.5, n, {
			hi: .35,
			lo: -.25
		}), u) for (let e = Math.round(h - 3); e <= Math.round(h + 2); e += 2) o.over(12, e, n, 3), o.over(11, e + 1, n, 1);
		else for (let e = Math.round(h - 1.5); e <= Math.round(h + 2.5); e++) for (let t = 11; t <= 13; t++) o.over(t, e, i, (e - Math.round(h)) % 2 == 0 ? t < 12 ? 3 : 2 : t < 12 ? 2 : 1);
		d(o, 8, Math.round(h - 4), 16, Math.round(h + 4));
		for (let e = 9; e <= 15; e++) o.over(e, Math.round(h + 2.5), t.LEATHER, e < 12 ? 2 : 1);
		o.end(), y(o, Math.round(g), Math.round(_) - 1, s, u), o.begin(null);
		let S = Math.round(_) - 4;
		for (let [e, t] of [
			[-2, 2],
			[0, 3],
			[2, 2]
		]) for (let n = 0; n < t; n++) o.set(Math.round(g) + e, S - n, a, n === t - 1 ? 3 : n === 0 ? 1 : 2);
		o.end();
		let C = s.sh, w = 12 - v * 4.2;
		o.begin(null);
		let T = 12 + v * 3;
		b === "up" && (c(o, T, h - 2, 12 + v * 4.5, h + .5, 1.4, n, u ? 1 : 3), o.set(12 + v * 5, Math.round(h + .5), n, 3)), o.end(), o.begin("all", 0);
		let ee = C === "raised" ? -3 : C === "low" ? 2 : C === "front" ? -.5 : 0;
		if (p(o, C === "front" || C === "raised" ? w + v * 1.6 : w, h + .2 + ee, C === "front" || C === "raised" ? 3.2 : 2.6, 3.2, u), o.end(), o.begin(null), b === "level" ? f(o, 12 + v * 4, 19 + m, 12 + v * 2, 4 + m, !1) : b === "back" ? f(o, 12 + v * 6, 18 + m, 12 + v * 2, 6 + m, !1) : b === "jab" ? f(o, 12 + v * 1, 10 + m, 12 + v * .5, 21, !1) : b === "low" ? f(o, 12 + v * 7, 13 + m, 12 + v * 3, 20, !1) : b === "drive" ? f(o, 12 + v * 1, 11 + m, 12, 21, !1) : b === "over" ? f(o, 12 + v * 6, 16 + m, 12 - v * 1, 5 + m, !1) : b === "drop" && f(o, 12 - v * 6, l, 12 + v * 6, 5 + m, !0), b !== "up" && b !== "drop") {
			let e = b === "jab" || b === "drive" ? 13 + m : 13.5 + m;
			c(o, T, h - 2, 12 + v * (b === "jab" || b === "drive" ? 1.2 : 3.5), e, 1.4, n, u ? 1 : 3);
		}
		o.end();
	}
	function w(r, o, s) {
		let l = o === "side";
		r.begin(null), f(r, l ? 3 : 4, s - 1, l ? 21 : 20, s - 4, !0), r.end(), r.begin(null), c(r, 15, s - 2, 20, s - 1, 2, n, 1), c(r, 20, s - 1, 21, s - 3, 1.2, n, 1), e.blob(r, 12.5, s - 2.2, 4.2, 2.2, n, {
			hi: .3,
			lo: -.3
		});
		for (let e = 10; e <= 14; e++) r.over(e, s - 1, i, e < 12 ? 2 : 1);
		d(r, 8, s - 5, 17, s), r.end(), r.begin("all", 0), e.blob(r, 7, s - 2.5, 2.6, 2, n, {
			hi: .3,
			lo: -.3
		}), e.blob(r, 4.5, s - 1.8, 1.8, 1.2, n), r.end(), r.begin(null), r.set(7, s - 3, n, 0), r.set(8, s - 2, n, 0), r.set(5, s - 3, t.BONE, 3);
		for (let [e, t] of [[0, 2], [2, 1]]) for (let n = 0; n < t; n++) r.set(8 + e, s - 5 - n, a, 2);
		r.end(), r.begin("all", 0), p(r, l ? 16 : 17, s - 1.2, 2.8, 1.2, o === "up"), r.end();
	}
	function T(t, n, r, i) {
		let a = i.G;
		if (r === "dead") {
			w(t, n, a);
			return;
		}
		let o = Kr[r] ?? Kr.idle0;
		n === "side" ? x(t, o, a) : C(t, o, a, n === "up"), r === "hurt" && e.shear(t, n === "side" ? -.14 : .1, a);
	}
	return {
		fw: 24,
		fh: 24,
		columns: [...e.COMMON, ...qr],
		aliases: {},
		spriteOptions: { blobSize: [.75, .38] },
		draw: T,
		ramps: () => e.makeRamps({
			[t.FUR]: e.ramp5([
				"#101e1c",
				"#1d3531",
				"#2c5047",
				"#3f7360",
				"#6aa284"
			]),
			[t.FUR2]: e.ramp5([
				"#0b1514",
				"#142623",
				"#203a34",
				"#2c5047",
				"#3f7360"
			]),
			[t.FUR3]: e.ramp5([
				"#4a3820",
				"#7c6038",
				"#a88a54",
				"#cdb274",
				"#ecd9a0"
			]),
			[t.COMB]: e.ramp5([
				"#3a0c0a",
				"#6e1a12",
				"#a42c18",
				"#d24a22",
				"#f07a36"
			]),
			[t.SCARF]: e.ramp5([
				"#3a0a10",
				"#6a1420",
				"#9e2230",
				"#c83a3c",
				"#e8665a"
			]),
			[t.LEATHER]: e.ramp5([
				"#2a170c",
				"#4e2e18",
				"#7a4c2a",
				"#a6743e",
				"#ca9a5a"
			]),
			[t.WOOD]: e.ramp5([
				"#2a1a0e",
				"#4a3018",
				"#6e4a26",
				"#946a3a",
				"#b88c52"
			]),
			[t.METAL]: e.ramp5([
				"#3a2410",
				"#6e4a1e",
				"#a8762e",
				"#dcae52",
				"#fff0b0"
			]),
			[t.BONE]: e.ramp5([
				"#6a6050",
				"#9c9078",
				"#cabe9e",
				"#e8dec2",
				"#fffaea"
			]),
			[t.NOSE]: e.ramp5([
				"#2a0808",
				"#4e1010",
				"#7a1c18",
				"#a83024",
				"#d04a34"
			]),
			[t.EYE]: e.eyeRamp("#d89a1a", "#ffd84a")
		}, t.FUR)
	};
}
//#endregion
//#region src/engine/pixel/monsters/whelp.js
var Yr = {
	idle0: {
		wing: "fold",
		throat: 1
	},
	idle1: {
		by: .5,
		hy: 1,
		wing: "fold",
		throat: 2,
		tail: 1
	},
	move0: {
		by: 1.5,
		hx: -1,
		hy: 1,
		wing: "half",
		ff: [-1, 0],
		fb: [1, 0],
		tail: -1
	},
	move1: {
		by: -.5,
		hx: -1,
		hy: -1,
		wing: "up",
		ff: [-2, 2],
		fb: [3, 0],
		tail: 1
	},
	move2: {
		by: -1,
		hx: -1,
		hy: -1,
		wing: "spread",
		ff: [-1, 3],
		fb: [2, 3],
		tail: 2
	},
	move3: {
		by: 0,
		hx: -1,
		wing: "half",
		ff: [-2, 0],
		fb: [1, 2],
		tail: 0
	},
	windup: {
		by: 1,
		lean: 1,
		hx: 2,
		hy: -2,
		jaw: "open",
		eye: "fierce",
		throat: 2,
		wing: "half",
		ff: [-1, 0],
		fb: [0, 0],
		tail: 2
	},
	attack: {
		by: .5,
		lean: -1,
		hx: -3,
		hy: 2,
		jaw: "open",
		eye: "fierce",
		throat: 1,
		wing: "back",
		ff: [-3, 0],
		fb: [2, 0],
		tail: -1
	},
	hurt: {
		by: 0,
		lean: 1,
		hx: 2,
		hy: -1,
		jaw: "open",
		eye: "shut",
		throat: 0,
		wing: "limp",
		ff: [1, 0],
		fb: [0, 0],
		tail: 1
	},
	dead: { wing: "limp" },
	spitWind: {
		by: 1,
		lean: 1,
		hx: 2,
		hy: -3,
		jaw: "shut",
		eye: "fierce",
		throat: 4,
		wing: "half",
		ff: [-1, 0],
		fb: [0, 0],
		tail: 2
	},
	spit: {
		by: 0,
		lean: -1,
		hx: -2,
		hy: 0,
		jaw: "fire",
		eye: "fierce",
		throat: 3,
		wing: "up",
		ff: [-2, 0],
		fb: [1, 0],
		tail: 0,
		flame: !0
	}
}, Xr = ["spitWind", "spit"];
function Zr(e) {
	let { M: t } = e, n = t.FUR, r = t.FUR2, i = t.FUR3, a = t.BONE, o = t.GLOW, s = t.WING;
	function c(e, t, n, r, i) {
		for (let a = 0; a < t.length; a++) for (let o = 0; o < t[a].length; o++) {
			let s = n[t[a][o]];
			s && e.set(r + o, i + a, s[0], s[1]);
		}
	}
	let l = {
		D: [n, 0],
		d: [n, 1],
		o: [n, 2],
		O: [n, 3],
		L: [n, 4],
		c: [i, 2],
		C: [i, 3],
		m: [t.NOSE, 1],
		M: [t.NOSE, 2],
		f: [o, 2],
		F: [o, 4],
		t: [a, 4],
		n: [n, 0]
	}, u = {
		shut: [
			"....ddOOd..",
			"..dOOOOLOd.",
			".dOOOOOOOod",
			"nOOOOOOoood",
			"tDDDtDDdodd",
			".cCCCccdd.."
		],
		open: [
			"....ddOOd..",
			"..dOOOOLOd.",
			".dOOOOOOOod",
			"nOOOOOOoood",
			"tMMMMmmdodd",
			"dmmmmmmddd.",
			".tcCCcdd..."
		],
		fire: [
			"....ddOOd..",
			"..dOOOOLOd.",
			".dOOOOOOOod",
			"nOOOOOOoood",
			"tFFFFffdodd",
			"dfFFFffddd.",
			".tcCCcdd..."
		]
	}, d = {
		shut: [
			"...dOOOd...",
			"..dOOLOOd..",
			".dOOOOOOOd.",
			"dOOOOOOOOod",
			".dOOOOOOod.",
			"..dnOOOnd..",
			"..DtDDDtD..",
			"...cCCcc..."
		],
		open: [
			"...dOOOd...",
			"..dOOLOOd..",
			".dOOOOOOOd.",
			"dOOOOOOOOod",
			".dOOOOOOod.",
			"..dnOOOnd..",
			"..DtmmmtD..",
			"..dmMMMmd..",
			"...cCCcc..."
		],
		fire: [
			"...dOOOd...",
			"..dOOLOOd..",
			".dOOOOOOOd.",
			"dOOOOOOOOod",
			".dOOOOOOod.",
			"..dnOOOnd..",
			"..DtfffDD..",
			"..dfFFFfd..",
			"...cCCcc..."
		],
		back: [
			"...dOOOd...",
			"..dOOLOOd..",
			".dOOOOOOOd.",
			"dOOOOOOOOod",
			".dOOOOOOod.",
			"..dooooodd.",
			"...dddddd.."
		]
	};
	function f(t, n, r, i, a, o, s, c) {
		e.thickLine(t, n, r, i, a, o, s, c);
	}
	function p(t, r, i, o, c) {
		let l = {
			fold: {
				w: [2.5, -4.5],
				t: [[7.5, -2.5], [6, .5]]
			},
			half: {
				w: [2, -6.5],
				t: [[8, -5.5], [7.5, -1]]
			},
			up: {
				w: [1, -8.5],
				t: [[5.5, -10], [8.5, -5.5]]
			},
			spread: {
				w: [3, -7],
				t: [[9.5, -8], [11, -3]]
			},
			back: {
				w: [4, -4],
				t: [[9.5, -3.5], [8.5, -.5]]
			},
			limp: {
				w: [3, -2.5],
				t: [[7, 1], [5, 2]]
			}
		}[o] ?? {
			w: [2.5, -4.5],
			t: [[7.5, -2.5], [6, .5]]
		}, u = c ? 1.5 : 0, d = c ? -.5 : 0, f = [r + l.w[0] + u, i + l.w[1] + d], p = l.t.map(([e, t]) => [r + e + u, i + t + d]), m = [r + 5 + u, i + .5], h = (e, t) => [(e[0] + t[0]) / 2 + (f[0] - (e[0] + t[0]) / 2) * .3, (e[1] + t[1]) / 2 + (f[1] - (e[1] + t[1]) / 2) * .3], g = [
			[r + u, i + d],
			f,
			p[0],
			h(p[0], p[1]),
			p[1],
			h(p[1], m),
			m
		];
		e.fillPoly(t, g, s, (e, t) => {
			let n = Math.hypot(e + .5 - f[0], t + .5 - f[1]);
			return Math.max(0, (n < 2.5 ? 3 : n < 5 ? 2 : 1) - !!c);
		});
		let _ = c ? 1 : 3;
		t.line2(r + u, i + d, f[0], f[1], n, _);
		for (let e of p) t.line2(f[0], f[1], e[0], e[1], n, _ - 1);
		t.set(Math.round(f[0]), Math.round(f[1]) - 1, a, c ? 2 : 3);
	}
	function m(t, r, i, o, c, l) {
		let u = {
			fold: {
				w: [3, -4],
				t: [[5, -1], [4, 2]]
			},
			half: {
				w: [4.5, -5.5],
				t: [[8, -3], [6.5, 1.5]]
			},
			up: {
				w: [3.5, -8],
				t: [[7, -9], [9, -4]]
			},
			spread: {
				w: [6, -5],
				t: [[11, -5], [11, 0]]
			},
			back: {
				w: [3, -3],
				t: [[5, 0], [3.5, 2]]
			},
			limp: {
				w: [4, -1],
				t: [[6, 2], [4, 3]]
			}
		}[c] ?? {
			w: [3, -4],
			t: [[5, -1], [4, 2]]
		}, d = ([e, t]) => [r + e * o, i + t], f = d(u.w), p = u.t.map(d), m = [r + 1 * o, i + 3], h = (e, t) => [(e[0] + t[0]) / 2 + (f[0] - (e[0] + t[0]) / 2) * .3, (e[1] + t[1]) / 2 + (f[1] - (e[1] + t[1]) / 2) * .3];
		e.fillPoly(t, [
			[r, i],
			f,
			p[0],
			h(p[0], p[1]),
			p[1],
			h(p[1], m),
			m
		], s, (e, t) => {
			let n = Math.hypot(e + .5 - f[0], t + .5 - f[1]);
			return Math.max(0, (n < 2.5 ? 3 : n < 5 ? 2 : 1) + l - 1);
		}), t.line2(r, i, f[0], f[1], n, Math.min(4, l + 2));
		for (let e of p) t.line2(f[0], f[1], e[0], e[1], n, Math.min(4, l + 1));
		t.set(Math.round(f[0]), Math.round(f[1]) - 1, a, 3);
	}
	function h(t, i, o, s, c, l, u) {
		let [d, p] = c, m = s - p, h = l ? r : n;
		u && e.blob(t, i + .5, o + .5, 2.2, 2.3, h, {
			hi: .3,
			lo: -.3,
			maxShade: l ? 2 : 3
		});
		let g = i + d * .5 + (u ? 1.2 : -.3), _ = o + (m - o) * .55;
		f(t, i, o + 1, g, _, 2, h, l ? 1 : 2), f(t, g, _, i + d, m - .5, 1.6, h, +!l), t.set(Math.round(i + d) - 1, m, h, l ? 1 : 2), t.set(Math.round(i + d), m, h, +!l), t.set(Math.round(i + d) - 2, m, a, l ? 1 : 3);
	}
	function g(t, s, d) {
		let m = s.by ?? 0, g = s.lean ?? 0, _ = 17.5 + g * .5, v = 15.5 + m, y = Math.round(7.5 + (s.hx ?? 0) + g), b = Math.round(9 + m + (s.hy ?? 0));
		t.begin(null), p(t, _ - 2.5, v - 3, s.wing, !0), t.end(), t.begin(null), h(t, 13.5 + g * .5, v + 1, d, [(s.ff ?? [0, 0])[0] + 1, (s.ff ?? [0, 0])[1]], !0, !1), h(t, 21.5 + g * .5, v + .5, d, [(s.fb ?? [0, 0])[0] + 1, (s.fb ?? [0, 0])[1]], !0, !0), t.end(), t.begin(null);
		let x = s.tail ?? 0, S = [
			[_ + 4, v],
			[_ + 7, v + 1.5],
			[_ + 9.5, v + 1.5 - x * .5],
			[_ + 11.5, v - .5 - x]
		];
		for (let e = 0; e < S.length - 1; e++) f(t, S[e][0], S[e][1], S[e + 1][0], S[e + 1][1], 2.8 - e * .7, n, (t) => e === 0 ? 2 : 1);
		let [C, w] = S[S.length - 1];
		t.set(Math.round(C), Math.round(w) - 1, n, 2), t.set(Math.round(C) + 1, Math.round(w), n, 1), t.set(Math.round(C), Math.round(w), n, 2), t.end(), t.begin(null), e.blob(t, _ + 2.5, v, 3.6, 3, n, {
			hi: .35,
			lo: -.25
		}), e.blob(t, _ - 1.5, v - .3, 4.3, 3.2, n, {
			hi: .4,
			lo: -.2
		});
		for (let e = Math.round(_ - 5); e <= Math.round(_ + 4); e++) for (let r = Math.round(v + 1); r <= Math.round(v + 3.5); r++) t.get(e, r) !== n || t.get(e, r + 1) === 0 && r < v + 2 || r >= v + 1.5 && t.set(e, r, i, e % 2 == 0 && r > v + 2 ? 1 : e < _ ? 3 : 2);
		for (let e = 0; e < 4; e++) {
			let n = Math.round(_ - 3 + e * 2.2), i = Math.round(v - 3.2 + Math.abs(e - 1.2) * .4);
			t.set(n, i - 1, r, 3);
		}
		t.end(), t.begin("sides", 1), h(t, 12.5 + g * .5, v + 1.2, d, s.ff ?? [0, 0], !1, !1), h(t, 20.5 + g * .5, v + .8, d, s.fb ?? [0, 0], !1, !0), t.end(), t.begin(null);
		let T = _ - 4.5, ee = v - 1.5;
		f(t, T, ee, y + 2.5, b + 1.5, 3.4, n, 2);
		let te = s.throat ?? 1;
		if (te > 0) for (let e = 0; e <= 3; e++) {
			let n = e / 3, r = T - .5 + (y + 2 - T) * n, i = ee + 1.5 + (b + 2.5 - ee) * n;
			t.set(Math.round(r), Math.round(i), o, Math.max(1, Math.min(4, te - +(e === 0 || e === 3))));
		}
		t.end(), t.begin("all", 0), c(t, s.jaw === "open" ? u.open : s.jaw === "fire" ? u.fire : u.shut, l, y - 6, b - 3), t.end(), t.begin(null), t.line2(y + 2, b - 3, y + 5, b - 4, a, (e) => e > .7 ? 4 : 2), t.set(y + 6, b - 5, a, 4), t.line2(y + 3, b - 2, y + 6, b - 2, a, 1), s.eye === "shut" ? (t.set(y - 1, b - 1, n, 0), t.set(y, b - 1, n, 0)) : (t.set(y - 1, b - 1, o, 4), t.set(y, b - 1, o, 2), t.set(y - 1, b - 2, n, 0), t.set(y, b - 2, n, s.eye === "fierce" ? 0 : 1)), s.flame && (t.set(y - 7, b + 1, o, 4), t.set(y - 8, b + 1, o, 3), t.set(y - 7, b + 2, o, 3), t.set(y - 8, b, o, 2)), t.end(), t.begin("all", 0), p(t, _ - 2.5, v - 2.5, s.wing, !1), t.end();
	}
	function _(t, s, u, p) {
		let h = s.by ?? 0, g = 15.5 + h, _ = Math.round(9.5 + h + (s.hy ?? 0) * .6 + (s.hx ?? 0) * (p ? .3 : -.4));
		t.begin(null), p ? (f(t, 16, g + 1, 17, u - 1, 3, n, 2), f(t, 17, u - 1, 21, u, 2, n, 1), t.set(22, u - 1, n, 2), t.set(22, u, n, 1)) : (f(t, 18, g + 1, 24, g + 3, 2.4, r, 1), f(t, 24, g + 3, 27, g + 1 - (s.tail ?? 0), 1.6, r, 1)), t.end(), t.begin(null), m(t, 13.5, g - 3, -1, s.wing, p ? 1 : 2), m(t, 18.5, g - 3, 1, s.wing, p ? 2 : 1), t.end(), t.begin(null);
		let v = s.ff ?? [0, 0], y = s.fb ?? [0, 0];
		for (let [r, i, o] of [[
			11,
			y[1],
			2
		], [
			21,
			y[1],
			1
		]]) e.blob(t, r, g + 1.5, 2, 2.2, n, {
			hi: .3,
			lo: -.3
		}), f(t, r, g + 2, r, u - i, 2, n, o), t.set(r - 1, u - i, a, 2);
		if (t.end(), t.begin(null), e.blob(t, 16, g, 4.2, 3.6, n, {
			hi: .35,
			lo: -.25
		}), p) for (let e = Math.round(g - 3); e <= Math.round(g + 2); e += 2) t.over(16, e, r, 3);
		else for (let e = Math.round(g - 1); e <= Math.round(g + 3); e++) for (let n = 14; n <= 17; n++) t.over(n, e, i, e % 2 == 0 ? n < 16 ? 3 : 2 : 1);
		t.end(), t.begin("sides", 1);
		for (let [e, r] of [[13.5, 3], [18.5, 1]]) f(t, e, g + 1, e, u - v[1], 1.8, n, r), t.set(Math.round(e), u - v[1], a, 3), t.set(Math.round(e) - 1, u - v[1], n, r);
		if (t.end(), t.begin(null), f(t, 16, g - 2, 16, _ + 2, 3.6, n, 2), !p && (s.throat ?? 1) > 0) {
			let e = s.throat ?? 1;
			for (let n = _ + 4; n <= Math.round(g - 1); n++) t.set(16, n, o, Math.max(1, Math.min(4, e)));
		}
		t.end(), t.begin("below", 1);
		let b = p ? "back" : s.jaw === "open" ? "open" : s.jaw === "fire" ? "fire" : "shut";
		c(t, d[b], l, 11, _ - 3), t.end(), t.begin(null);
		for (let [e, n] of [[-1, 3], [1, 2]]) t.line2(16 + e * 3, _ - 3, 16 + e * 5, _ - 6, a, (e) => e > .6 ? n + 1 : n - 1);
		if (!p) {
			for (let [e, r] of [[13, 4], [19, 3]]) {
				if (s.eye === "shut") {
					t.set(e, _ - 1, n, 0);
					continue;
				}
				t.set(e, _ - 1, o, r), t.set(e + (e < 16 ? 1 : -1), _ - 2, n, 0);
			}
			s.flame && (t.set(15, _ + 6, o, 4), t.set(16, _ + 6, o, 3), t.set(16, _ + 7, o, 2));
		}
		t.end();
	}
	function v(t, r, o) {
		t.begin(null), p(t, 15, o - 4, "limp", !0), t.end(), t.begin(null), f(t, 21, o - 2, 27, o - 1, 2.2, n, 1), f(t, 27, o - 1, 29, o - 2, 1.2, n, 1), e.blob(t, 17, o - 2.6, 5.4, 2.6, n, {
			hi: .3,
			lo: -.3
		});
		for (let e = 13; e <= 20; e++) t.over(e, o - 1, i, e < 16 ? 2 : 1);
		t.end(), t.begin("all", 0), c(t, u.shut, l, 3, o - 6), t.end(), t.begin(null), t.set(8, o - 4, n, 0), t.set(9, o - 4, n, 0), t.line2(11, o - 6, 13, o - 7, a, 2);
		for (let [e] of [[14], [19]]) t.set(e, o - 5, n, 2), t.set(e + 1, o - 6, n, 1);
		t.end();
	}
	function y(t, n, r, i) {
		let a = i.G;
		if (r === "dead") {
			v(t, n, a);
			return;
		}
		let o = Yr[r] ?? Yr.idle0;
		n === "side" ? g(t, o, a) : _(t, o, a, n === "up"), r === "hurt" && e.shear(t, n === "side" ? -.12 : .1, a);
	}
	return {
		fw: 32,
		fh: 24,
		columns: [...e.COMMON, ...Xr],
		aliases: {},
		spriteOptions: { blobSize: [1.05, .5] },
		draw: y,
		ramps: () => e.makeRamps({
			[t.FUR]: e.ramp5([
				"#100d11",
				"#221d23",
				"#383138",
				"#584e56",
				"#82767c"
			]),
			[t.FUR2]: e.ramp5([
				"#0a080b",
				"#161317",
				"#242026",
				"#383138",
				"#584e56"
			]),
			[t.FUR3]: e.ramp5([
				"#4a160a",
				"#7e2a10",
				"#b84a18",
				"#e0782a",
				"#f8b04a"
			]),
			[t.WING]: e.ramp5([
				"#2a0806",
				"#561410",
				"#8a2416",
				"#c24620",
				"#e87a34"
			]),
			[t.BONE]: e.ramp5([
				"#6a6052",
				"#9a8e78",
				"#c8bca0",
				"#e6dcc0",
				"#fff8e6"
			]),
			[t.NOSE]: e.ramp5([
				"#200606",
				"#3e0c0c",
				"#661a14",
				"#94281c",
				"#c04028"
			]),
			[t.GLOW]: e.glowRamp([
				"#7a1e06",
				"#c84410",
				"#ff7e22",
				"#ffbe50",
				"#fff2b0"
			])
		}, t.FUR)
	};
}
//#endregion
//#region src/engine/pixel/monsters/emberimp.js
var Qr = {
	idle0: {
		wing: "up",
		arms: "down",
		flame: 1,
		tail: 0,
		fr: 0
	},
	idle1: {
		wing: "down",
		dy: 1,
		arms: "down",
		flame: 1,
		tail: 1,
		fr: 1
	},
	move0: {
		wing: "up",
		dy: -1,
		arms: "down",
		flame: 1,
		tail: 0,
		fr: 0
	},
	move1: {
		wing: "mid",
		arms: "down",
		flame: 2,
		tail: 1,
		fr: 1
	},
	move2: {
		wing: "down",
		dy: 1,
		arms: "down",
		flame: 2,
		tail: 0,
		fr: 2
	},
	move3: {
		wing: "mid",
		arms: "down",
		flame: 1,
		tail: -1,
		fr: 1
	},
	windup: {
		wing: "mid",
		arms: "cup",
		orb: 2.4,
		mouth: "grin",
		eye: "wide",
		flame: 2,
		tail: 1,
		fr: 0
	},
	attack: {
		wing: "up",
		dy: -1,
		arms: "throw",
		mouth: "open",
		eye: "wide",
		flame: 2,
		tail: -1,
		fr: 2
	},
	hurt: {
		wing: "crumple",
		dy: 1,
		arms: "limp",
		mouth: "open",
		eye: "shut",
		flame: 1,
		tail: 1,
		fr: 1
	},
	dead: {
		wing: "fold",
		arms: "limp",
		mouth: "shut",
		eye: "dead",
		flame: 0,
		tail: 0,
		fr: 0
	},
	flare: {
		wing: "high",
		dy: -1,
		arms: "wide",
		mouth: "open",
		eye: "wide",
		flame: 3,
		tail: 2,
		fr: 2
	},
	dive: {
		wing: "swept",
		dy: 1,
		arms: "back",
		mouth: "open",
		eye: "wide",
		flame: 3,
		tail: -2,
		tilt: 1,
		fr: 0
	}
}, $r = ["flare", "dive"];
function ei(e) {
	let { M: t } = e, n = t.FUR, r = t.FUR2, i = t.WING, a = t.GLOW, o = t.BONE;
	function s(t, n, r, i, a, o, s, c) {
		e.thickLine(t, n, r, i, a, o, s, c);
	}
	let c = {
		up: {
			wr: [3, -5],
			t: [
				[5, -9],
				[8, -7],
				[8, -3]
			]
		},
		mid: {
			wr: [4, -2],
			t: [
				[8, -4],
				[9, -1],
				[7, 2]
			]
		},
		down: {
			wr: [3, 1],
			t: [
				[7, 2],
				[6, 5],
				[3, 6]
			]
		},
		high: {
			wr: [2, -7],
			t: [
				[3, -10],
				[7, -10],
				[9, -6]
			]
		},
		swept: {
			wr: [3, -4],
			t: [
				[6, -8],
				[7, -6],
				[5, -3]
			]
		},
		crumple: {
			wr: [3, 0],
			t: [
				[5, 3],
				[6, 1],
				[2, 4]
			]
		},
		fold: {
			wr: [1, -2],
			t: [
				[2, 2],
				[3, 3],
				[1, 4]
			]
		}
	};
	function l(t, n, a, s, l, u, d = 1) {
		let f = c[s] ?? c.mid, p = ([e, t]) => [n + e * l * d * .8, a + t * .8], m = p(f.wr), h = f.t.map(p), g = [n + .5 * l, a + 3], _ = (e, t) => [(e[0] + t[0]) / 2 + (m[0] - (e[0] + t[0]) / 2) * .35, (e[1] + t[1]) / 2 + (m[1] - (e[1] + t[1]) / 2) * .35], v = [
			[n, a - .5],
			m,
			h[0]
		];
		for (let e = 0; e + 1 < h.length; e++) v.push(_(h[e], h[e + 1]), h[e + 1]);
		v.push(_(h[h.length - 1], g), g), e.fillPoly(t, v, i, (e, t) => {
			let n = Math.hypot(e + .5 - m[0], t + .5 - m[1]);
			return Math.max(0, (n < 2.2 ? 3 : n < 4.4 ? 2 : 1) + u - 1);
		}), t.line2(n, a, m[0], m[1], r, Math.min(4, u + 2));
		for (let e of h) t.line2(m[0], m[1], e[0], e[1], r, Math.min(4, u + 1));
		t.set(Math.round(m[0]), Math.round(m[1]) - 1, o, 2);
	}
	function u(e, t, n, r, i, o) {
		if (r <= 0) return;
		let s = 1 + r;
		for (let c = 0; c < s; c++) {
			let l = c / s, u = Math.max(0, Math.round((1 - l) * (.4 + r * .3))), d = [
				0,
				1,
				-1
			][(i + c) % 3] * +(l > .4), f = Math.round(t + o * c + d * .6);
			for (let t = -u; t <= u; t++) {
				let i = Math.abs(t) === u && u > 0;
				e.set(f + t, Math.round(n - c), a, i ? 1 : l < .3 ? r >= 3 ? 4 : 3 : l < .7 ? 3 : 2);
			}
		}
	}
	function d(t, i, c) {
		let d = i.dy ?? 0, m = 13.5 + d, h = 8.5 + d;
		t.begin(null), l(t, 10, m - 2.5, i.wing, -1, +!c), l(t, 14, m - 2.5, i.wing, 1, +!!c), t.end(), t.begin(null);
		let g = i.tail ?? 0;
		s(t, 13, m + 2, 15 + g, m + 5, 1.4, n, 1), s(t, 15 + g, m + 5, 17 + g, m + 4.5, 1, n, 1), t.end(), t.begin(null), t.set(18 + g, Math.round(m + 4), a, 4), t.set(18 + g, Math.round(m + 3), a, 2), t.set(19 + g, Math.round(m + 4), a, 2), t.end(), t.begin(null);
		for (let [e, i, a] of [[
			10.5,
			-1,
			2
		], [
			13.5,
			1,
			1
		]]) s(t, e, m + 2, e + i * .5, m + 4.2, 1.4, n, a), t.set(Math.round(e + i * .8), Math.round(m + 5), r, 2);
		if (t.end(), t.begin(null), e.blob(t, 12, m, 3, 3.1, n, {
			hi: .35,
			lo: -.25
		}), c) t.set(12, Math.round(m - 1), r, 2), t.set(12, Math.round(m + 1), r, 2);
		else {
			let e = Math.round(m);
			t.set(12, e - 1, a, 2), t.set(11, e, a, 3), t.set(11, e + 1, a, 3), t.set(12, e + 2, a, 2), t.set(13, e, a, 1);
		}
		t.end(), t.begin("below", 1), e.blob(t, 12, h, 3.4, 2.9, n, {
			hi: .3,
			lo: -.3
		}), t.end(), t.begin(null);
		for (let [e, r] of [[-1, 3], [1, 1]]) t.set(12 + e * 4, Math.round(h), n, r), t.set(12 + e * 5, Math.round(h - 1), n, r), t.set(12 + e * 6, Math.round(h - 2), n, Math.max(1, r - 1));
		for (let [e, n] of [[-1, 3], [1, 2]]) t.set(12 + e * 2, Math.round(h - 2), o, n - 2), t.set(12 + e * 2, Math.round(h - 3), o, n - 1), t.set(12 + e * 3, Math.round(h - 3), o, n - 2), t.set(12 + e * 3, Math.round(h - 4), o, n), t.set(12 + e * 4, Math.round(h - 5), o, n + 1);
		if (t.end(), t.begin(null), u(t, 12, Math.round(h - 2.5), i.flame ?? 2, i.fr ?? 0, 0), t.end(), !c) {
			t.begin(null);
			let e = Math.round(h - .5);
			i.eye === "shut" || i.eye === "dead" ? (t.set(10, e, r, 0), t.set(13, e, r, 0), t.set(11, e, r, 0), t.set(14, e, r, 0)) : (t.set(10, e, a, 4), t.set(11, e, a, 3), t.set(10, e - 1, n, 0), t.set(13, e, a, 3), t.set(14, e, a, 4), t.set(14, e - 1, n, 0), i.eye === "wide" && (t.set(10, e - 1, a, 2), t.set(14, e - 1, a, 2)));
			let s = Math.round(h + 1.5);
			if (i.mouth === "open") {
				for (let e = 11; e <= 13; e++) t.set(e, s, a, 2), t.set(e, s + 1, a, e === 12 ? 3 : 1);
				t.set(10, s, n, 0), t.set(14, s, n, 0);
			} else if (i.mouth !== "shut") {
				for (let e = 10; e <= 14; e++) t.set(e, s, e === 10 || e === 14 ? n : a, e === 10 || e === 14 ? 0 : 1);
				t.set(10, s - 1, n, 0), t.set(14, s - 1, n, 0);
			} else t.set(12, s, n, 0);
			i.mouth !== "shut" && (t.set(11, s, o, 4), t.set(13, s, o, 3)), t.end();
		}
		t.begin("all", 0), p(t, i, 12, m, c ? 1 : -1, c), t.end(), i.orb && (t.begin(null), f(t, 12, Math.round(m - .5), i.orb), t.end());
	}
	function f(e, t, n, r) {
		for (let i = Math.floor(n - r - 1); i <= Math.ceil(n + r + 1); i++) for (let o = Math.floor(t - r - 1); o <= Math.ceil(t + r + 1); o++) {
			let s = Math.hypot(o + .5 - (t + .5), i + .5 - (n + .5));
			s > r || e.set(o, i, a, s < r * .45 ? 4 : s < r * .8 ? 3 : 2);
		}
	}
	function p(e, t, i, a, o, c) {
		let l = a - 2, u = c ? 1 : 3, d = (t, i, a) => {
			e.set(Math.round(t), Math.round(i), n, a), e.set(Math.round(t), Math.round(i) + 1, r, 2);
		};
		switch (t.arms) {
			case "cup":
				s(e, i - 2.5, l, i - 1.5, a + 1, 1.2, n, u), d(i - 1.5, a + 1, u), s(e, i + 2.5, l, i + 1.5, a + 1, 1.2, n, 1), d(i + 1.5, a + 1, 1);
				break;
			case "throw":
				s(e, i + o * 2.5, l, i + o * 3, a + 3.5, 1.2, n, u), d(i + o * 3, a + 3.5, u), s(e, i - o * 2.5, l, i - o * 5, l - 2, 1.2, n, 1), d(i - o * 5, l - 2.5, 1);
				break;
			case "wide":
				s(e, i - 2.5, l, i - 6, l - 1.5, 1.2, n, u), d(i - 6.5, l - 2, u), s(e, i + 2.5, l, i + 6, l - 1.5, 1.2, n, 1), d(i + 6.5, l - 2, 1);
				break;
			case "back":
				s(e, i - 2.5, l, i - 4, l + 3, 1.2, n, u), s(e, i + 2.5, l, i + 4, l + 3, 1.2, n, 1);
				break;
			case "limp":
				s(e, i - 2.5, l, i - 3.5, a + 2.5, 1.2, n, 2), s(e, i + 2.5, l, i + 3.5, a + 2.5, 1.2, n, 1);
				break;
			default: s(e, i - 2.5, l, i - 4, a + 1, 1.2, n, u), d(i - 4, a + 1.5, u), s(e, i + 2.5, l, i + 4, a + 1, 1.2, n, 1), d(i + 4, a + 1.5, 1);
		}
	}
	function m(t, i) {
		let c = i.dy ?? 0, d = i.tilt ?? 0, p = 12.5 + d, m = 13.5 + c - d * .5, h = Math.round(10 - d * 2.5), g = Math.round(8.5 + c + d * 2.5);
		t.begin(null), l(t, p + 2, m - 3.5, i.wing, 1, 0, .55), t.end(), t.begin(null), l(t, p + 1, m - 2.5, i.wing, 1, 1, .75), t.end(), t.begin(null);
		let _ = i.tail ?? 0;
		s(t, p + 1.5, m + 2, p + 4.5, m + 3.5 - _ * .3, 1.4, n, 1), s(t, p + 4.5, m + 3.5 - _ * .3, p + 6.5, m + 1.5 - _, 1, n, 1), t.end(), t.begin(null);
		let v = Math.round(p + 7), y = Math.round(m + .5 - _);
		t.set(v, y, a, 4), t.set(v, y - 1, a, 3), t.set(v + 1, y - 1, a, 2), t.set(v, y - 2, a, 2), t.end(), t.begin(null), i.tilt ? (s(t, p + 1, m + 1.5, p + 3.5, m + 3, 1.4, n, 1), t.set(Math.round(p + 4), Math.round(m + 3), r, 2)) : (s(t, p + 1, m + 2, p, m + 3.5, 1.4, n, 1), s(t, p, m + 3.5, p - 1, m + 4, 1.2, n, 1), t.set(Math.round(p - 2), Math.round(m + 4), r, 2), s(t, p - .5, m + 2, p - 1.5, m + 3, 1.4, n, 2), t.set(Math.round(p - 2.5), Math.round(m + 3), r, 3)), t.end(), t.begin(null), e.blob(t, p + .5, m - .5, 2.4, 2.6, n, {
			hi: .35,
			lo: -.25
		}), e.blob(t, p - .8, m + .6, 2.1, 2.1, n, {
			hi: .3,
			lo: -.3
		}), t.set(Math.round(p - 2), Math.round(m), a, 3), t.set(Math.round(p - 2), Math.round(m + 1), a, 2), t.set(Math.round(p - 1), Math.round(m + 2), a, 1), t.end(), t.begin("all", 0), e.blob(t, h, g, 3.2, 2.8, n, {
			hi: .3,
			lo: -.3
		}), t.set(h - 4, g, n, 3), t.set(h - 4, g + 1, n, 2), t.set(h - 5, g + 1, n, 2), t.end(), t.begin("all", 0), t.set(h + 3, g, n, 2), t.set(h + 4, g - 1, n, 2), t.set(h + 5, g - 1, n, 1), t.set(h + 6, g - 2, n, 1), t.set(h + 4, g, n, 1), t.end(), t.begin("all", 0), t.set(h, g - 3, o, 2), t.set(h + 1, g - 3, o, 1), t.set(h + 1, g - 4, o, 3), t.set(h + 2, g - 5, o, 3), t.set(h + 3, g - 5, o, 4), t.end(), t.begin(null), u(t, h - 1, g - 3, Math.max(0, (i.flame ?? 2) - 1), i.fr ?? 0, .5 + d * .5), t.end(), t.begin(null);
		let b = h - 2, x = g - 1;
		i.eye === "shut" || i.eye === "dead" ? (t.set(b, x, r, 0), t.set(b + 1, x, r, 0)) : (t.set(b, x, a, 4), t.set(b + 1, x, a, 3), t.set(b, x - 1, n, 0), t.set(b + 1, x - 1, n, 0), i.eye === "wide" && t.set(b, x - 1, a, 2));
		let S = g + 1;
		i.mouth === "open" ? (t.set(b - 2, S + 1, a, 3), t.set(b - 1, S + 1, a, 3), t.set(b, S + 1, a, 2), t.set(b - 1, S + 2, a, 2), t.set(b - 2, S, o, 4)) : i.mouth === "shut" ? (t.set(b - 1, S + 1, n, 0), t.set(b, S + 1, n, 0)) : (t.set(b - 2, S + 1, n, 0), t.set(b - 1, S + 1, a, 1), t.set(b, S + 1, a, 1), t.set(b + 1, S, n, 0), t.set(b - 1, S + 2, o, 4)), t.end(), t.begin("all", 0);
		let C = p - .5, w = m - 2;
		switch (i.arms) {
			case "cup":
				s(t, C, w, p - 3, m + .5, 1.2, n, 3);
				break;
			case "throw":
				s(t, C, w, p - 6, m - 3, 1.2, n, 3), t.set(Math.round(p - 6.5), Math.round(m - 3.5), n, 3);
				break;
			case "wide":
				s(t, C, w, p - 4, w - 3, 1.2, n, 3);
				break;
			case "back":
				s(t, C, w, p + 3, w + 2, 1.2, n, 2);
				break;
			case "limp":
				s(t, C, w, p - 1, m + 3, 1.2, n, 2);
				break;
			default: s(t, C, w, p - 2.5, m + 1.5, 1.2, n, 3), t.set(Math.round(p - 3), Math.round(m + 2), r, 2);
		}
		if (t.end(), i.orb && (t.begin(null), f(t, Math.round(p - 4), Math.round(m - .5), i.orb), t.end()), i.tilt) {
			t.begin(null);
			for (let [e, n, r] of [
				[
					p + 4,
					m - 5,
					3
				],
				[
					p + 5,
					m - 6,
					2
				],
				[
					p + 6,
					m - 6,
					2
				],
				[
					p + 6,
					m - 7,
					1
				],
				[
					p + 3,
					m - 6,
					2
				]
			]) t.set(Math.round(e), Math.round(n), a, r);
			t.end();
		}
	}
	function h(t, i, o) {
		t.begin(null), l(t, 13, o - 3, "crumple", 1, 0, .9), t.end(), t.begin(null), s(t, 15, o - 1, 19, o - 1, 1.2, n, 1), e.blob(t, 12.5, o - 2, 3.2, 2, n, {
			hi: .3,
			lo: -.3
		}), t.end(), t.begin("all", 0), e.blob(t, 8.5, o - 2.5, 2.6, 2.2, n, {
			hi: .3,
			lo: -.3
		}), t.end(), t.begin(null), t.set(8, o - 3, r, 0), t.set(9, o - 3, r, 0), t.set(9, o - 5, r, 2), t.set(10, o - 6, r, 3), t.set(12, o - 2, a, 1), t.end();
	}
	function g(t, n, r, i) {
		if (r === "dead") {
			h(t, n, i.G);
			return;
		}
		let a = Qr[r] ?? Qr.move1;
		n === "side" ? m(t, a) : d(t, a, n === "up"), r === "hurt" && e.shear(t, .15, 17);
	}
	return {
		fw: 24,
		fh: 24,
		columns: [...e.COMMON, ...$r],
		aliases: {},
		spriteOptions: {
			castShadow: !1,
			blobSize: [.6, .3]
		},
		draw: g,
		idle: {
			poses: [
				"move0",
				"move1",
				"move2",
				"move3"
			],
			fps: 10
		},
		ramps: () => e.makeRamps({
			[t.FUR]: e.ramp5([
				"#2a070a",
				"#520e12",
				"#841c18",
				"#b4321e",
				"#de5228"
			]),
			[t.FUR2]: e.ramp5([
				"#0e0a0c",
				"#1e1418",
				"#2e2026",
				"#46323a",
				"#644a50"
			]),
			[t.WING]: e.ramp5([
				"#200a0c",
				"#3e1214",
				"#62201a",
				"#8e3622",
				"#bc5a2e"
			]),
			[t.BONE]: e.ramp5([
				"#3a2e2a",
				"#5e4c44",
				"#8a7464",
				"#b49c88",
				"#dcc8b2"
			]),
			[t.GLOW]: e.glowRamp([
				"#8a2206",
				"#d8500e",
				"#ff9426",
				"#ffcc5c",
				"#fff8c8"
			])
		}, t.FUR)
	};
}
//#endregion
//#region src/engine/pixel/monsters/dragon.js
var ti = 192, ni = 176, ri = 96, ii = .3, ai = .47, oi = Math.sqrt(1 - ii * ii), si = Math.sqrt(1 - ai * ai), ci = mi([
	-.5,
	-.74,
	.46
]), li = 5, ui = Object.freeze(/* @__PURE__ */ "idle0.idle1.idle2.idle3.walk0.walk1.walk2.walk3.walk4.walk5.hover0.hover1.hover2.hover3.hover4.hover5.land0.land1.land2.land3.roar0.roar1.roar2.bite0.bite1.bite2.claw0.claw1.claw2.tail0.tail1.tail2.tail3.breath0.breath1.breath2.breath3.takeoff0.takeoff1.takeoff2.dive0.dive1.hurt.stagger0.stagger1.death0.death1.death2.death3.death4.gust0.gust1.stomp0.stomp1".split(".")), di = ui, fi = {
	headScale: 1.6,
	bulk: 1.2,
	splay: 1,
	neckZ: 6
}, pi = [
	-.85,
	1,
	3.1,
	.7
];
function mi(e) {
	let t = Math.hypot(e[0], e[1], e[2]) || 1;
	return [
		e[0] / t,
		e[1] / t,
		e[2] / t
	];
}
var H = (e, t) => [
	e[0] + t[0],
	e[1] + t[1],
	e[2] + t[2]
], hi = (e, t) => [
	e[0] - t[0],
	e[1] - t[1],
	e[2] - t[2]
], U = (e, t) => [
	e[0] * t,
	e[1] * t,
	e[2] * t
], gi = (e, t) => e[0] * t[0] + e[1] * t[1] + e[2] * t[2], _i = (e, t) => [
	e[1] * t[2] - e[2] * t[1],
	e[2] * t[0] - e[0] * t[2],
	e[0] * t[1] - e[1] * t[0]
], vi = (e, t, n) => [
	e[0] + (t[0] - e[0]) * n,
	e[1] + (t[1] - e[1]) * n,
	e[2] + (t[2] - e[2]) * n
], yi = (e, t) => Math.hypot(e[0] - t[0], e[1] - t[1], e[2] - t[2]), bi = (e, t, n) => [e * Math.cos(n) - t * Math.sin(n), e * Math.sin(n) + t * Math.cos(n)], xi = Math.PI / 180, W = {
	torso: 1,
	neck: 2,
	head: 3,
	jaw: 4,
	tail: 5,
	legFN: 6,
	legFF: 7,
	legHN: 8,
	legHF: 9,
	wingN: 10,
	wingF: 11,
	boneN: 12,
	boneF: 13,
	horn: 14,
	spike: 15,
	maw: 16,
	blade: 17
}, Si = class {
	constructor() {
		this.prims = [], this.decals = [], this.teeth = [], this.snout = null, this._seed = 1, this.rscale = 1;
	}
	tube(e, t, n, r, i, a, o = {}) {
		this.prims.push({
			k: "tube",
			a: e,
			b: t,
			ra: n * this.rscale,
			rb: r * this.rscale,
			tex: i,
			part: a,
			u0: o.u0 ?? 0,
			uLen: o.uLen ?? yi(e, t),
			belly: o.belly ?? null,
			crack: o.crack ?? 0,
			furnace: o.furnace ?? 0,
			lift: o.lift ?? 0,
			seed: o.seed ?? this._seed++
		});
	}
	chain(e, t, n, r, i = {}) {
		let a = 0;
		for (let t = 0; t + 1 < e.length; t++) a += yi(e[t], e[t + 1]);
		let o = 0, s = this._seed++;
		for (let c = 0; c + 1 < e.length; c++) this.tube(e[c], e[c + 1], t[c], t[c + 1], n, r, {
			...i,
			u0: o,
			uLen: a,
			seed: s
		}), o += yi(e[c], e[c + 1]);
	}
	tri(e, t, n, r, i, a = !1, o = 0) {
		this.prims.push({
			k: "tri",
			a: e,
			b: t,
			c: n,
			tex: r,
			part: i,
			edge: a,
			lift: o
		});
	}
}, Ci = {
	bx: 2,
	by: 56,
	pitch: .12,
	breathe: 0,
	head: [
		56,
		114,
		-.1,
		.05
	],
	neckBend: 9,
	neckZ: 0,
	headZ: 0,
	tail: [
		-.45,
		.75,
		1.9
	],
	fn: [
		26,
		0,
		14
	],
	ff: [
		16,
		0,
		-14
	],
	hn: [
		-20,
		0,
		13
	],
	hf: [
		-32,
		0,
		-13
	],
	wn: [
		60,
		1,
		0
	],
	wf: [
		66,
		1,
		0
	],
	eye: "open",
	furnace: 0,
	lean: 0,
	headScale: 1,
	bulk: 1,
	splay: .35,
	front: {}
};
function wi(e) {
	let t = new Si(), n = [
		e.bx,
		e.by,
		0
	], r = e.pitch, i = (t, i, a = 0) => {
		let [o, s] = bi(t, i, r);
		return Ti([
			n[0] + o,
			n[1] + s,
			a
		], e.lean, n);
	}, a = e.breathe, o = [
		i(-42, 0),
		i(-27, 3),
		i(-8, 1),
		i(12, 4),
		i(27, 9)
	], s = [
		12.5,
		17.5,
		17 + .8 * a,
		20.5 + 1.8 * a,
		16 + a
	];
	t.chain(o, s, "scales", W.torso, {
		belly: Ei(r),
		crack: .85,
		furnace: e.furnace * .6
	}), Oi(t, o, s, 6.5, 8, W.spike, 0);
	let [c, l, u, d] = e.head, f = Ti([
		c,
		l,
		e.headZ
	], e.lean, n), p = [
		Math.cos(u),
		Math.sin(u),
		0
	], m = [
		-Math.sin(u),
		Math.cos(u),
		0
	], h = e.headScale, g = (e, t, n = 0) => [
		f[0] + (p[0] * e + m[0] * t) * h,
		f[1] + (p[1] * e + m[1] * t) * h,
		f[2] + n * h
	], _ = i(26, 13), v = mi([
		.42,
		.9,
		0
	]), y = g(-10, -2), b = H(_, H(U(v, 22), [
		0,
		0,
		e.neckZ
	])), x = H(y, [
		-e.neckBend - 3,
		-e.neckBend - 8,
		-e.neckZ * .75
	]), S = [], C = [];
	for (let e = 0; e <= 9; e++) {
		let t = e / 9;
		S.push(Di(_, b, x, y, t)), C.push(13.5 - 5.2 * t);
	}
	t.chain(S, C, "scales", W.neck, {
		belly: [
			1,
			-.3,
			0
		],
		crack: .5,
		furnace: e.furnace
	}), Oi(t, S.slice(1, 9), C.slice(1, 9), 5, 5.5, W.spike, 1), t.rscale = h, ki(t, g, f, u, d, e), t.rscale = 1;
	let [w, T, ee, te = 1.15] = e.tail, ne = [o[0]], re = [s[0]], ie = o[0];
	for (let t = 1; t <= 10; t++) {
		let i = t / 10, a = w + r * .5 + T * i * i, o = ee * i ** +te, s = 10.6 - 2.2 * i;
		ie = [
			ie[0] - Math.cos(a) * Math.cos(o) * s,
			ie[1] + Math.sin(a) * s,
			ie[2] + Math.cos(a) * Math.sin(o) * s
		], ne.push(Ti(ie, e.lean * (1 - i), n)), re.push(12 - 10.4 * i ** .8);
	}
	return t.chain(ne, re, "scales", W.tail, {
		belly: [
			0,
			-1,
			0
		],
		crack: .25
	}), Oi(t, ne.slice(0, 7), re.slice(0, 7), 6, 4.4, W.spike, 2), Ai(t, ne[9], ne[10]), t.rscale = e.bulk, Mi(t, i(20, -5, -13), e.ff, W.legFF, -.6, e.lean, n, e.splay), Ni(t, i(-27, -1, -12), e.hf, W.legHF, -.6, e.lean, n, e.splay), Mi(t, i(20, -5, 13), e.fn, W.legFN, 0, e.lean, n, e.splay), Ni(t, i(-27, -1, 12), e.hn, W.legHN, 0, e.lean, n, e.splay), t.rscale = 1, Ii(t, i(8, 16, -9), -1, e.wf, r, W.wingF, W.boneF, -.5), Ii(t, i(8, 16, 9), 1, e.wn, r, W.wingN, W.boneN, 0), t;
}
function Ti(e, t, n) {
	if (!t) return e;
	let r = e[1] - n[1], i = e[2];
	return [
		e[0],
		n[1] + r * Math.cos(t) - i * Math.sin(t),
		r * Math.sin(t) + i * Math.cos(t)
	];
}
function Ei(e) {
	return [
		Math.sin(e),
		-Math.cos(e),
		0
	];
}
function Di(e, t, n, r, i) {
	let a = 1 - i;
	return [
		0,
		1,
		2
	].map((o) => a * a * a * e[o] + 3 * a * a * i * t[o] + 3 * a * i * i * n[o] + i * i * i * r[o]);
}
function Oi(e, t, n, r, i, a, o) {
	let s = r * .5;
	for (let c = 0; c + 1 < t.length; c++) {
		let l = t[c], u = t[c + 1], d = mi(hi(u, l)), f = mi(hi([
			0,
			1,
			0
		], U(d, d[1])));
		o === 1 && (f = mi([
			-d[1],
			d[0],
			0
		])), o === 1 && f[0] > .1 && (f = U(f, -1));
		let p = yi(l, u), m = s;
		for (; m < p; m += r) {
			let t = m / p, r = n[c] + (n[c + 1] - n[c]) * t, s = H(vi(l, u, t), U(f, r * .8)), h = o === 1 ? U(d, -.6) : o === 2 ? U(d, .55) : U(d, -.55), g = .75 + .35 * Math.abs(Math.sin(c * 1.7 + m * .45)), _ = H(s, H(U(f, i * g), U(h, i * .9)));
			e.tube(s, _, Math.max(1.5, Math.min(2.8, r * .17)), .45, "horn", a, { lift: -.3 });
		}
		s = m - p;
	}
}
function ki(e, t, n, r, i, a) {
	let o = [
		0,
		-1,
		0
	];
	e.tube(t(-6, 1.5), t(4, 2.5), 10, 9.5, "scales", W.head, { belly: o });
	for (let n of [-5.6, 5.6]) e.tube(t(-4, -2.4, n), t(9, -3, n * .9), 6.8, 4.6, "scales", W.head, { belly: o });
	for (let n of [-2.9, 2.9]) e.tube(t(3, 1.2, n), t(26, -1.5, n * .72), 7, 4.4, "scales", W.head, { belly: o });
	e.tube(t(25, -1.1), t(29.6, -1.8), 5, 4.2, "scales", W.head, { belly: o });
	let s = t(-2, -5), c = r - i, l = [
		Math.cos(c),
		Math.sin(c),
		0
	], u = [
		-Math.sin(c),
		Math.cos(c),
		0
	], d = a.headScale, f = (e, t, n = 0) => [
		s[0] + (l[0] * e + u[0] * t) * d,
		s[1] + (l[1] * e + u[1] * t) * d,
		s[2] + n * d
	];
	for (let t of [-4.8, 4.8]) e.tube(f(0, 0, t), f(21, -.4, t * .42), 5.2, 3.1, "scales", W.jaw, { belly: o });
	if (e.tube(f(19, -.5), f(25.5, -.8), 3.8, 3, "scales", W.jaw, { belly: o }), i > .08) {
		e.tri(f(2, 1.5), t(26, -4.5), f(24, 1.5), "glow", W.maw);
		let n = vi(t(25, -4.2), f(23, 1.6), .5);
		e.tube(f(3, 2), n, 2.5, Math.max(1.5, yi(t(25, -4.2), f(23, 1.6)) / d * .36), "glow", W.maw), e.teeth.push({
			a: t(9, -6.6),
			b: t(26, -5.4),
			part: W.head
		}), e.teeth.push({
			a: f(8, 3.6),
			b: f(24, 2.6),
			part: W.jaw
		});
	}
	for (let n of [-3.3, 3.3]) e.tube(t(21.5, -4.6, n), t(22.6, -9.8, n * 1.04), 1.6, .45, "bone", W.head, { lift: .9 }), e.tube(t(13.5, -5.4, n * 1.5), t(14, -8.6, n * 1.5), 1.25, .4, "bone", W.head, { lift: .6 }), e.tube(f(19.5, 2.4, n * .8), f(20.5, 6.6, n * .8), 1.35, .4, "bone", W.jaw, { lift: .7 });
	for (let n of [-6.2, 6.2]) e.tube(t(-2, 7.2, n), t(10, 5.6, n * .95), 4.6, 2.8, "dark", W.head);
	e.tube(t(23, 2.5), t(26.6, 7.8), 2.2, .5, "horn", W.horn), e.tube(t(16.5, 4.2), t(18.5, 7.4), 1.6, .5, "horn", W.horn, { lift: -.4 });
	for (let n of [-5.5, 5.5]) {
		let r = n < 0 ? -.6 : 0;
		e.chain([
			t(-2, 6.2, n),
			t(-8, 8.6, n * 1.8),
			t(-16, 8.2, n * 2.6),
			t(-24, 4.6, n * 3.1),
			t(-29, -1, n * 3.25),
			t(-30, -7.5, n * 3.05)
		], [
			4.1,
			3.5,
			2.8,
			2.1,
			1.3,
			.5
		], "horn", W.horn, { lift: r }), e.tube(t(-6, 2.6, n * 1.35), t(-18, 2, n * 2.25), 2.1, .5, "horn", W.horn, { lift: r - .2 }), e.tube(t(-7, -3, n * 1.5), t(-17, -8.5, n * 2.4), 2.1, .5, "horn", W.horn, { lift: r - .3 }), e.tube(t(-1, -6, n * 1.4), t(-8, -12, n * 2.1), 1.8, .5, "horn", W.horn, { lift: r - .3 });
	}
	e.tube(f(7, -3.5), f(3, -10), 1.9, .5, "horn", W.jaw, { lift: -.3 }), e.tube(f(14, -3), f(12, -8), 1.5, .5, "horn", W.jaw, { lift: -.3 }), e.decals.push({
		p: t(11, 3.2, 7.4),
		kind: "eye",
		part: W.head
	}), e.decals.push({
		p: t(11, 3.2, -7.4),
		kind: "eye",
		part: W.head
	}), e.decals.push({
		p: t(29.2, .6, 2.3),
		kind: "nostril",
		part: W.head
	}), e.decals.push({
		p: t(29.2, .6, -2.3),
		kind: "nostril",
		part: W.head
	}), e.snout = t(30, -1.5);
}
function Ai(e, t, n) {
	let r = mi(hi(n, t)), i = mi(_i(r, [
		0,
		0,
		1
	])), a = H(n, U(r, 12)), o = H(H(n, U(i, 6.5)), U(r, -3)), s = H(H(n, U(i, -6.5)), U(r, -3));
	e.tri(n, o, a, "bone", W.blade, !1, -.4), e.tri(n, a, s, "bone", W.blade, !1, -1), e.tube(H(n, U(r, -3)), a, 2.2, .6, "bone", W.blade, { lift: -.2 });
}
function ji(e, t, n, r, i) {
	let a = hi(t, e), o = Math.hypot(...a), s = U(a, 1 / (o || 1));
	o = Math.min(o, n + r - .01);
	let c = (n * n - r * r + o * o) / (2 * o), l = Math.sqrt(Math.max(0, n * n - c * c)), u = mi(hi(i, U(s, gi(i, s))));
	return H(H(e, U(s, c)), U(u, l));
}
function Mi(e, t, n, r, i, a, o, s) {
	let c = Ti([
		n[0],
		n[1],
		n[2]
	], a * .5, o), l = Math.sign(t[2]) || 1, u = H(c, [
		-2,
		7,
		0
	]), d = ji(t, u, 25, 25, [
		-1,
		.25,
		l * s * 1.6
	]);
	e.tube(t, t, 11, 11, "scales", W.torso, {
		lift: i * .5,
		crack: .3
	}), e.tube(t, d, 10.5, 7.2, "scales", r, {
		lift: i,
		crack: .3
	}), e.tube(vi(t, d, .22), vi(t, d, .72), 9.8, 7.8, "scales", r, { lift: i }), e.tube(d, u, 7.6, 5.2, "scales", r, { lift: i }), e.tube(vi(d, u, .06), vi(d, u, .5), 8.2, 6, "scales", r, { lift: i });
	let f = H(c, [
		5,
		2.4,
		0
	]);
	e.tube(u, f, 5.8, 4.8, "scales", r, { lift: i });
	for (let t of [
		-5.2,
		-1.75,
		1.75,
		5.2
	]) {
		let n = H(c, [
			8.5,
			2.2,
			t * 1.3
		]);
		e.tube(f, n, 3.3, 2.7, "scales", r, { lift: i }), e.tube(n, H(c, [
			14,
			-1,
			t * 1.6
		]), 2.4, .5, "bone", r, { lift: i - .1 });
	}
	e.tube(H(u, [
		0,
		-1,
		l * 3
	]), H(u, [
		-2,
		-6,
		l * 5.5
	]), 1.8, .5, "bone", r, { lift: i - .2 });
}
function Ni(e, t, n, r, i, a, o, s) {
	let c = Ti([
		n[0],
		n[1],
		n[2]
	], a * .5, o), l = H(c, [
		-8,
		12,
		0
	]), u = ji(t, l, 24, 21, [
		1,
		-.1,
		Math.sign(t[2]) * s
	]);
	e.tube(t, t, 13.5, 13.5, "scales", W.torso, {
		lift: i * .5,
		crack: .3
	}), e.tube(t, u, 13.5, 8.6, "scales", r, {
		lift: i,
		crack: .3
	}), e.tube(vi(t, u, .2), vi(t, u, .65), 12, 9.6, "scales", r, { lift: i }), e.tube(u, l, 7.8, 5.2, "scales", r, { lift: i });
	let d = H(c, [
		4.5,
		2.2,
		0
	]);
	e.tube(l, d, 5.4, 4.6, "scales", r, { lift: i });
	for (let t of [
		-4.6,
		0,
		4.6
	]) {
		let n = H(c, [
			8,
			1.8,
			t * 1.25
		]);
		e.tube(d, n, 3.2, 2.6, "scales", r, { lift: i }), e.tube(n, H(c, [
			13,
			-1,
			t * 1.5
		]), 2.3, .5, "bone", r, { lift: i - .1 });
	}
	e.tube(H(l, [
		0,
		1,
		0
	]), H(l, [
		-6,
		-3,
		0
	]), 1.9, .5, "bone", r, { lift: i - .2 });
}
var Pi = {
	E: [-6, 30],
	W: [8, 64],
	T: [
		[0, 106],
		[-38, 99],
		[-63, 76],
		[-68, 44]
	],
	A: [-46, 4]
}, Fi = {
	E: [-16, 12],
	W: [-2, 36],
	T: [
		[-50, 20],
		[-62, 6],
		[-60, -8],
		[-48, -16]
	],
	A: [-38, -10]
};
function Ii(e, t, n, r, i, a, o, s) {
	let [c, l, u, d = 0] = r, f = c * xi, p = [
		0,
		Math.sin(f),
		Math.cos(f) * n
	], m = [
		Math.cos(i),
		Math.sin(i),
		0
	];
	if (d) {
		let e = d * xi * n, t = Math.cos(e), r = Math.sin(e);
		m = H(H(U(m, t), U(_i(p, m), r)), U(p, gi(p, m) * (1 - t)));
	}
	let h = u * xi, g = (e) => {
		let [n, r] = bi(e[0], e[1], h * Math.min(1, e[1] / 90));
		return H(t, H(U(m, n), U(p, r)));
	}, _ = (e, t) => [e[0] + (t[0] - e[0]) * l, e[1] + (t[1] - e[1]) * l], v = g(_(Pi.E, Fi.E)), y = g(_(Pi.W, Fi.W)), b = Pi.T.map((e, t) => g(_(e, Fi.T[t]))), x = g(_(Pi.A, Fi.A)), S = [...b, x], C = .22 * (1 - .7 * l);
	for (let t = 0; t + 1 < S.length; t++) {
		let n = S[t], r = S[t + 1], i = vi(vi(n, r, .5), y, t === S.length - 2 ? C * .5 : C);
		e.tri(y, n, i, "membrane", a, !0, s), e.tri(y, i, r, "membrane", a, !0, s);
	}
	e.tri(t, v, x, "membrane", a, !1, s), e.tri(v, y, x, "membrane", a, !1, s), e.tube(t, v, 6.8, 5, "scales", o, { lift: s }), e.tube(v, y, 5, 3.6, "scales", o, { lift: s });
	let w = 1 - .35 * l;
	for (let t = 0; t < b.length; t++) e.tube(y, b[t], (2.6 - t * .25) * w, .9, "scales", o, { lift: s + .2 });
	let T = H(y, U(mi(hi(y, v)), 8));
	e.tube(y, H(T, [
		2,
		2,
		0
	]), 2.6, .5, "bone", o, { lift: s - .1 });
}
var Li = 33792, Ri = new Float32Array(Li), zi = new Uint8Array(Li), Bi = new Float32Array(Li), Vi = new Uint8Array(Li), Hi = new Uint8Array(Li), Ui = new Float32Array(Li), Wi = new Float32Array(Li), Gi = new Uint8Array(Li), Ki = new Uint8Array(Li), qi = Object.freeze({
	none: 0,
	body: 1,
	belly: 2,
	membrane: 3,
	horn: 4,
	glow: 5
}), Ji = 0;
function Yi(e, t, n) {
	let [r, i, a] = t;
	return e === "side" ? [
		ri - r,
		n - 3 - i * oi + a * ii,
		a * oi + i * ii
	] : e === "down" ? [
		ri - a,
		n - 11 - i * si + r * ai,
		r * si + i * ai
	] : [
		ri + a,
		n - 11 - i * si - r * ai,
		-r * si + i * ai
	];
}
function Xi(e, t, n, r) {
	let i = Zi;
	return e === "side" ? (i[0] = -t, i[1] = -oi * n + ii * r, i[2] = ii * n + oi * r) : e === "down" ? (i[0] = ai * n + si * r, i[1] = -si * n + ai * r, i[2] = -t) : (i[0] = -.47 * n - si * r, i[1] = -si * n + ai * r, i[2] = t), i;
}
var Zi = [
	0,
	0,
	0
], G = {};
function Qi(e, t, n) {
	Ri.fill(-1e9), zi.fill(0), Bi.fill(0), Vi.fill(0), Gi.fill(0);
	for (let r of e.prims) r.k === "tube" ? $i(r, t, n) : ia(r, t, n);
}
function $i(e, t, n) {
	let r = Yi(t, e.a, n), i = Yi(t, e.b, n), a = Math.max(e.ra, e.rb), o = Math.max(0, Math.floor(Math.min(r[0], i[0]) - a - 1)), s = Math.min(191, Math.ceil(Math.max(r[0], i[0]) + a + 1)), c = Math.max(0, Math.floor(Math.min(r[1], i[1]) - a - 1)), l = Math.min(175, Math.ceil(Math.max(r[1], i[1]) + a + 1)), u = i[0] - r[0], d = i[1] - r[1], f = i[2] - r[2], p = u * u + d * d, m = yi(e.a, e.b), h = mi(hi(e.b, e.a)), g = e.belly ? mi(hi(e.belly, U(h, gi(e.belly, h)))) : null;
	g && !Number.isFinite(g[0]) && (g = null);
	let _ = g ? U(g, -1) : mi(Math.abs(h[1]) > .9 ? [
		1,
		0,
		0
	] : hi([
		0,
		1,
		0
	], U(h, h[1]))), v = _i(h, _);
	for (let n = c; n <= l; n++) {
		let i = n + .5;
		for (let a = o; a <= s; a++) {
			let o = a + .5, s = p > 1e-6 ? ((o - r[0]) * u + (i - r[1]) * d) / p : 0;
			s = s < 0 ? 0 : s > 1 ? 1 : s;
			let c = r[0] + u * s, l = r[1] + d * s, h = e.ra + (e.rb - e.ra) * s, g = o - c, y = i - l, b = g * g + y * y;
			if (b >= h * h) continue;
			let x = Math.sqrt(1 - b / (h * h)), S = r[2] + f * s + x * h, C = n * ti + a;
			if (S <= Ri[C]) continue;
			let w = g / h, T = y / h;
			ta(e, w, T, x, e.tex === "scales" ? Xi(t, w, T, x) : Zi, e.u0 + s * m, _, v, h), Ri[C] = S, zi[C] = ea[0], Bi[C] = ea[1], Vi[C] = e.part, Ui[C] = w, Wi[C] = T, Gi[C] = Ji;
		}
	}
}
var ea = [0, 0];
function ta(e, t, n, r, i, a, o, s, c) {
	let l = t * ci[0] + n * ci[1] + r * ci[2];
	if (e.tex === "bone") {
		Ji = qi.horn, ea[0] = G.bone, ea[1] = 1.45 + 1.6 * l + e.lift + 1.5 * (a / Math.max(1, e.uLen) - .35);
		return;
	}
	if (e.tex === "horn") {
		let t = a / Math.max(1, e.uLen);
		Ji = qi.horn, ea[0] = G.horn, ea[1] = 1.15 + 1.3 * l + e.lift + (t > .62 ? 2.9 * ((t - .62) / .38) ** 1.2 : 0);
		return;
	}
	if (e.tex === "dark") {
		Ji = qi.body, ea[0] = G.dark, ea[1] = 1.7 + 1.7 * l + e.lift;
		return;
	}
	if (e.tex === "glow") {
		Ji = qi.glow, ea[0] = G.glow, ea[1] = 2 + 1.6 * r;
		return;
	}
	Ji = qi.body;
	let u = Math.atan2(gi(i, s), gi(i, o)) * c, d = gi(i, o);
	if (e.belly && d < -.4) {
		Ji = qi.belly;
		let t = a / 4.6, n = t - Math.floor(t);
		if (n < .2 && (e.crack > .2 || e.furnace > .05)) {
			Ji = qi.glow, ea[0] = G.glow, ea[1] = 1 + 3 * e.furnace;
			return;
		}
		ea[0] = G.belly, ea[1] = 1.95 + 1.5 * l + e.lift + (n < .24 ? -1.05 : n > .72 ? .3 : 0) + .8 * e.furnace;
		return;
	}
	let f = 1.8 + 1.8 * l + e.lift, p = u / 4 + 60, m = Math.floor(p), h = a / 5 + (m & 1) * .5, g = Math.floor(h), _ = h - g - .5, v = p - m, y = ra(g, m, e.seed);
	f += (y - .5) * .26;
	let b = (_ / .56) ** 2 + ((v - .28) / .78) ** 2;
	if (e.crack > 0 && d > -.38 && d < .5 && na(a, u, e.seed, e.crack)) {
		Ji = qi.glow, ea[0] = G.glow, ea[1] = l < 0 ? 1 : 2;
		return;
	}
	if (b > .72 && v > .42 ? f -= .62 : b < .32 && _ < .1 && l > .1 && (f += .38), d > .82 && l > .2 && (f += .35), f > 3.15 && e.lift > -.3) {
		ea[0] = G.crimson, ea[1] = f - .8;
		return;
	}
	ea[0] = G.scales, ea[1] = f;
}
function na(e, t, n, r) {
	let i = e / 16, a = t / 7 + 40, o = Math.floor(i), s = Math.floor(a), c = 9, l = 9, u = 0, d = 0;
	for (let e = -1; e <= 1; e++) for (let t = -1; t <= 1; t++) {
		let r = o + t, f = s + e, p = r + .15 + .7 * ra(r, f, 11 + n), m = f + .15 + .7 * ra(r, f, 23 + n), h = (i - p) * (i - p) + (a - m) * (a - m);
		h < c ? (l = c, d = u, c = h, u = r * 131 + f) : h < l && (l = h, d = r * 131 + f);
	}
	return Math.sqrt(l) - Math.sqrt(c) > .11 ? !1 : ra(u, n, 5) < r * .55 || ra(d, n, 5) < r * .25;
}
var ra = (e, t, n) => .5;
function ia(e, t, n) {
	let r = Yi(t, e.a, n), i = Yi(t, e.b, n), a = Yi(t, e.c, n), o = Math.max(0, Math.floor(Math.min(r[0], i[0], a[0]))), s = Math.min(191, Math.ceil(Math.max(r[0], i[0], a[0]))), c = Math.max(0, Math.floor(Math.min(r[1], i[1], a[1]))), l = Math.min(175, Math.ceil(Math.max(r[1], i[1], a[1]))), u = (i[1] - a[1]) * (r[0] - a[0]) + (a[0] - i[0]) * (r[1] - a[1]);
	if (Math.abs(u) < 1e-6) return;
	let d = mi(_i(hi(i, r), hi(a, r)));
	d[2] < 0 && (d = U(d, -1));
	let f = d[0] * ci[0] + d[1] * ci[1] + d[2] * ci[2];
	for (let t = c; t <= l; t++) {
		let n = t + .5;
		for (let c = o; c <= s; c++) {
			let o = c + .5, s = ((i[1] - a[1]) * (o - a[0]) + (a[0] - i[0]) * (n - a[1])) / u, l = ((a[1] - r[1]) * (o - a[0]) + (r[0] - a[0]) * (n - a[1])) / u, p = 1 - s - l;
			if (s < -.001 || l < -.001 || p < -.001) continue;
			let m = s * r[2] + l * i[2] + p * a[2] - (e.tex === "glow" ? 2 : 0), h = t * ti + c;
			if (m <= Ri[h]) continue;
			let g, _, v;
			if (e.tex === "membrane") {
				if (g = G.membrane, v = qi.membrane, _ = 1.75 + .8 * f + e.lift, e.edge) {
					let e = Math.min(l, p) * 2;
					_ += 1.1 * Math.min(1, e * 1.6) * (1 - .6 * s) - .25 * s, s < .07 ? _ -= .9 : (l / (l + p + 1e-6) * 5 + .5) % 1 < .1 && s > .2 && (_ -= .5);
				} else _ += .15;
				_ += (ra(c >> 1, t >> 1, 77) - .5) * .35;
			} else e.tex === "glow" ? (g = G.glow, v = qi.glow, _ = 1 + 2.6 * s) : (g = G.horn, v = qi.horn, _ = 1.1 + 1.4 * f + e.lift + 2.2 * Math.max(0, .55 - s));
			Ri[h] = m, zi[h] = g, Bi[h] = _, Vi[h] = e.part, Ui[h] = d[0], Wi[h] = d[1], Gi[h] = v;
		}
	}
}
function aa(e, t, n, r) {
	let i = e.snout ? Yi(t, e.snout, n) : null;
	for (let a of e.decals) {
		let e = Yi(t, a.p, n), o = Math.floor(e[0]), s = Math.floor(e[1]);
		if (o < 2 || s < 1 || o >= 189 || s >= 174) continue;
		let c = s * ti + o;
		if (Vi[c] !== a.part || Ri[c] - e[2] > 7) continue;
		if (a.kind === "nostril") {
			oa(o, s, G.dark, 0), oa(o + 1, s, G.dark, 0), oa(o, s + 1, G.glow, 1);
			continue;
		}
		let l = i && Math.abs(i[0] - e[0]) > .5 ? Math.sign(i[0] - e[0]) : 1, u = r.eye;
		for (let e of [
			-2,
			-1,
			0,
			1,
			2
		]) oa(o + e, s - 1, G.dark, 0);
		if (oa(o - 2 * l, s - 1, G.dark, 0), u === "shut") {
			for (let e of [
				-1,
				0,
				1
			]) oa(o + e, s, G.dark, 0);
			oa(o + 2 * l, s + 1, G.dark, 0);
			continue;
		}
		oa(o - l, s, G.glow, 3), oa(o, s, G.glow, 4), oa(o + l, s, G.glow, 4), oa(o + 2 * l, s + 1, G.glow, 3), oa(o - 2 * l, s, G.dark, 0), u === "wide" ? (oa(o, s + 1, G.glow, 3), oa(o + l, s + 1, G.glow, 3), oa(o - l, s + 1, G.glow, 2)) : u === "open" && oa(o + l, s + 1, G.glow, 2);
	}
	for (let r of e.teeth) {
		let e = Yi(t, r.a, n), i = Yi(t, r.b, n), a = Math.max(2, Math.round(Math.hypot(i[0] - e[0], i[1] - e[1]) / 2.4));
		for (let t = 0; t <= a; t++) {
			let n = Math.floor(e[0] + (i[0] - e[0]) * (t / a)), o = Math.floor(e[1] + (i[1] - e[1]) * (t / a));
			if (n < 0 || o < 0 || n >= ti || o >= ni) continue;
			let s = o * ti + n;
			!zi[s] || Vi[s] !== W.maw && Vi[s] !== r.part || oa(n, o, G.bone, t % 2 ? 3 : 4);
		}
	}
}
function oa(e, t, n, r) {
	if (e < 0 || t < 0 || e >= ti || t >= ni) return;
	let i = t * ti + e;
	zi[i] && (zi[i] = n, Bi[i] = r, Gi[i] = n === G.glow ? qi.glow : qi.none);
}
function sa() {
	Hi.fill(0);
	for (let e = 0; e < ni; e++) for (let t = 0; t < ti; t++) {
		let n = e * ti + t;
		if (!zi[n] || zi[n] === G.glow) continue;
		let r = Ri[n], i = Vi[n];
		(t > 0 && ca(n - 1, i, r) || t < 191 && ca(n + 1, i, r) || e > 0 && ca(n - ti, i, r) || e < 175 && ca(n + ti, i, r)) && (Hi[n] = 1);
	}
	for (let e = 0; e < Li; e++) Hi[e] && (Bi[e] = Math.min(Bi[e], zi[e] === G.membrane ? .4 : 0));
}
function ca(e, t, n) {
	return zi[e] !== 0 && Vi[e] !== t && Ri[e] - n > li;
}
var la = mi([
	-.6,
	-.8,
	0
]);
function ua() {
	for (let e = 0; e < Li; e++) {
		let t = Gi[e];
		if (t !== qi.body && t !== qi.belly || Hi[e]) continue;
		let n = Wi[e];
		if (n <= .4) continue;
		let r = Math.min(1, (n - .4) / .55);
		zi[e] = G.hot, Bi[e] = .3 + 1.9 * r + (t === qi.belly ? .6 : 0);
	}
	Ki.fill(0);
	for (let e = 1; e < ni; e++) for (let t = 1; t < ti; t++) {
		let n = e * ti + t, r = Gi[n];
		if (r === qi.none || r === qi.glow || Hi[n] || Ui[n] * la[0] + Wi[n] * la[1] < .2) continue;
		let i = Ri[n] - li, a = Vi[n], o = n - 1, s = n - ti, c = n - ti - 1;
		(!zi[o] || !zi[s] || !zi[c] || Ri[o] < i && Vi[o] !== a || Ri[s] < i && Vi[s] !== a || Ri[c] < i && Vi[c] !== a) && (Ki[n] = 1);
	}
	for (let e = 1; e < ni; e++) for (let t = 1; t < ti; t++) {
		let n = e * ti + t;
		if (Ki[n] || !zi[n] || Hi[n] || Gi[n] === qi.none || Gi[n] === qi.glow || Ui[n] * la[0] + Wi[n] * la[1] < .45) continue;
		let r = Vi[n];
		(Ki[n - 1] === 1 && Vi[n - 1] === r || Ki[n - ti] === 1 && Vi[n - ti] === r) && (Ki[n] = 2);
	}
	for (let e = 0; e < Li; e++) {
		let t = Ki[e];
		if (!t) continue;
		let n = Ui[e] * la[0] + Wi[e] * la[1];
		if (Gi[e] === qi.membrane) {
			Bi[e] = Math.max(Bi[e], t === 1 ? 4 : 3);
			continue;
		}
		zi[e] = G.rim, Bi[e] = t === 1 ? n > .6 ? 4 : 3 : 2;
	}
}
var K = {};
{
	let e = {
		fn: [
			26,
			0,
			24
		],
		ff: [
			26,
			0,
			-24
		],
		hn: [
			-16,
			0,
			30
		],
		hf: [
			-16,
			0,
			-30
		],
		by: 47
	};
	[
		0,
		.5,
		1,
		.5
	].forEach((t, n) => {
		K[`idle${n}`] = {
			breathe: t,
			by: 56 + t * 1.2,
			head: [
				56 - t * .8,
				114 + t * 2.5,
				-.1 + t * .05,
				.05 + t * .05
			],
			tail: [
				-.45,
				.75 + [
					0,
					.04,
					.08,
					.04
				][n],
				1.9 + [
					0,
					.05,
					.1,
					.05
				][n]
			],
			wn: [
				60 + t * 3,
				1,
				0
			],
			wf: [
				66 + t * 3,
				1,
				0
			],
			front: {
				...e,
				by: 47 + t,
				wn: [
					38 + t * 2,
					1,
					-20,
					0
				],
				wf: [
					38 + t * 2,
					1,
					-20,
					0
				],
				head: [
					62 - t,
					100 + t * 2.5,
					.12 + t * .03,
					.06 + t * .05
				],
				tail: [
					pi[0],
					pi[1] + [
						0,
						.03,
						.06,
						.03
					][n],
					pi[2] + [
						0,
						.04,
						.08,
						.04
					][n],
					pi[3]
				]
			}
		};
	});
	for (let e = 0; e < 6; e++) {
		let t = e / 6 * Math.PI * 2, n = (e) => [9 * Math.cos(t + e), Math.max(0, Math.sin(t + e)) * 8], [r, i] = n(0), [a, o] = n(Math.PI), [s, c] = n(Math.PI + .5), [l, u] = n(.5), d = Math.cos(t * 2);
		K[`walk${e}`] = {
			by: 55 + d * 1.6,
			pitch: .1 + .03 * Math.sin(t),
			head: [
				57 + 2 * Math.sin(t),
				112 - d * 2,
				-.1,
				.06
			],
			fn: [
				26 + r,
				i,
				14
			],
			ff: [
				16 + a,
				o,
				-14
			],
			hn: [
				-20 + s,
				c,
				13
			],
			hf: [
				-32 + l,
				u,
				-13
			],
			tail: [
				-.45,
				.75,
				1.9 + .25 * Math.sin(t)
			],
			wn: [
				60 + 4 * d,
				1,
				0
			],
			wf: [
				66 + 4 * d,
				1,
				0
			]
		};
	}
	[
		[
			78,
			.45,
			52
		],
		[
			55,
			.1,
			50
		],
		[
			18,
			0,
			51
		],
		[
			-22,
			.05,
			54
		],
		[
			-5,
			.35,
			55
		],
		[
			40,
			.5,
			53
		]
	].forEach(([e, t, n], r) => {
		K[`hover${r}`] = {
			by: n,
			pitch: .2,
			head: [
				56,
				n + 56,
				0,
				.1
			],
			fn: [
				26,
				24,
				13
			],
			ff: [
				20,
				22,
				-13
			],
			hn: [
				-14,
				12,
				12
			],
			hf: [
				-24,
				14,
				-12
			],
			tail: [
				-.85,
				.9,
				.8 + .2 * Math.sin(r)
			],
			wn: [
				e,
				t,
				0
			],
			wf: [
				e + 4,
				t,
				0
			],
			front: {
				head: [
					62,
					n + 44,
					.08,
					.1
				],
				wn: [
					e,
					t,
					0,
					50
				],
				wf: [
					e,
					t,
					0,
					50
				],
				fn: [
					22,
					24,
					20
				],
				ff: [
					22,
					24,
					-20
				],
				hn: [
					-16,
					12,
					18
				],
				hf: [
					-16,
					12,
					-18
				],
				headScale: 1.3,
				bulk: 1.18,
				splay: .9
			}
		};
	}), K.land0 = {
		by: 66,
		pitch: .5,
		head: [
			44,
			134,
			.25,
			.2
		],
		eye: "wide",
		fn: [
			36,
			28,
			14
		],
		ff: [
			30,
			26,
			-14
		],
		hn: [
			-2,
			10,
			13
		],
		hf: [
			-10,
			12,
			-13
		],
		tail: [
			-1,
			.7,
			.5
		],
		wn: [
			62,
			0,
			-15
		],
		wf: [
			66,
			0,
			-15
		]
	}, K.land1 = {
		by: 58,
		pitch: .32,
		head: [
			50,
			124,
			.1,
			.2
		],
		fn: [
			34,
			14,
			14
		],
		ff: [
			28,
			12,
			-14
		],
		hn: [
			-14,
			0,
			14
		],
		hf: [
			-26,
			0,
			-14
		],
		tail: [
			-.8,
			.7,
			1
		],
		wn: [
			18,
			0,
			-5
		],
		wf: [
			22,
			0,
			-5
		]
	}, K.land2 = {
		by: 44,
		pitch: .02,
		head: [
			62,
			88,
			-.3,
			.3
		],
		eye: "narrow",
		fn: [
			32,
			0,
			18
		],
		ff: [
			22,
			0,
			-18
		],
		hn: [
			-18,
			0,
			17
		],
		hf: [
			-30,
			0,
			-17
		],
		tail: [
			-.3,
			.5,
			2.1
		],
		wn: [
			-12,
			.2,
			0
		],
		wf: [
			-8,
			.2,
			0
		]
	}, K.land3 = {
		by: 54,
		pitch: .1,
		head: [
			56,
			110,
			-.05,
			.1
		],
		tail: [
			-.45,
			.75,
			1.9
		],
		wn: [
			50,
			.6,
			0
		],
		wf: [
			54,
			.6,
			0
		]
	}, K.roar0 = {
		by: 60,
		pitch: .3,
		head: [
			42,
			128,
			.42,
			.18
		],
		eye: "narrow",
		breathe: 1,
		fn: [
			28,
			6,
			14
		],
		tail: [
			-.4,
			.9,
			1.6
		],
		wn: [
			55,
			.45,
			0
		],
		wf: [
			58,
			.45,
			0
		],
		front: {
			...e,
			head: [
				54,
				118,
				.05,
				.18
			],
			wn: [
				62,
				.3,
				0,
				50
			],
			wf: [
				62,
				.3,
				0,
				50
			],
			fn: [
				26,
				4,
				20
			]
		}
	}, K.roar1 = {
		by: 59,
		pitch: .22,
		head: [
			58,
			126,
			.32,
			.8
		],
		eye: "wide",
		breathe: .6,
		tail: [
			-.3,
			1,
			1.4
		],
		wn: [
			42,
			.05,
			0
		],
		wf: [
			46,
			.05,
			0
		],
		front: {
			...e,
			head: [
				66,
				112,
				-.05,
				.8
			],
			wn: [
				44,
				0,
				0,
				65
			],
			wf: [
				44,
				0,
				0,
				65
			]
		}
	}, K.roar2 = {
		by: 58,
		pitch: .2,
		head: [
			61,
			122,
			.18,
			.7
		],
		eye: "wide",
		breathe: .4,
		tail: [
			-.35,
			.95,
			1.5
		],
		wn: [
			34,
			.1,
			0
		],
		wf: [
			38,
			.1,
			0
		],
		front: {
			...e,
			head: [
				66,
				110,
				-.1,
				.7
			],
			wn: [
				36,
				.05,
				0,
				65
			],
			wf: [
				36,
				.05,
				0,
				65
			]
		}
	}, K.bite0 = {
		by: 58,
		pitch: .18,
		head: [
			42,
			122,
			.18,
			.5
		],
		eye: "narrow",
		neckBend: 12,
		wn: [
			62,
			.85,
			0
		],
		wf: [
			66,
			.85,
			0
		],
		front: {
			...e,
			head: [
				54,
				112,
				0,
				.5
			],
			wn: [
				52,
				.3,
				0,
				50
			],
			wf: [
				52,
				.3,
				0,
				50
			]
		}
	}, K.bite1 = {
		by: 52,
		pitch: -.04,
		head: [
			72,
			80,
			-.38,
			.1
		],
		eye: "wide",
		neckBend: 2,
		fn: [
			34,
			0,
			15
		],
		ff: [
			22,
			0,
			-15
		],
		tail: [
			-.35,
			.7,
			2
		],
		wn: [
			55,
			.9,
			0
		],
		wf: [
			60,
			.9,
			0
		],
		front: {
			...e,
			head: [
				74,
				76,
				-.55,
				.1
			],
			wn: [
				44,
				.3,
				0,
				50
			],
			wf: [
				44,
				.3,
				0,
				50
			],
			fn: [
				30,
				0,
				20
			],
			ff: [
				30,
				0,
				-20
			]
		}
	}, K.bite2 = {
		by: 54,
		pitch: .04,
		head: [
			66,
			98,
			-.22,
			.05
		],
		neckBend: 6,
		fn: [
			30,
			0,
			14
		],
		wn: [
			58,
			1,
			0
		],
		wf: [
			63,
			1,
			0
		],
		front: {
			...e,
			head: [
				68,
				96,
				-.1,
				.05
			],
			wn: [
				48,
				.3,
				0,
				50
			],
			wf: [
				48,
				.3,
				0,
				50
			]
		}
	}, K.claw0 = {
		by: 60,
		pitch: .3,
		head: [
			48,
			120,
			.05,
			.3
		],
		eye: "narrow",
		fn: [
			30,
			36,
			16
		],
		ff: [
			18,
			0,
			-14
		],
		tail: [
			-.4,
			.8,
			1.5
		],
		wn: [
			58,
			.6,
			0
		],
		wf: [
			62,
			.6,
			0
		]
	}, K.claw1 = {
		by: 52,
		pitch: 0,
		head: [
			62,
			104,
			-.18,
			.35
		],
		eye: "wide",
		fn: [
			48,
			4,
			9
		],
		ff: [
			20,
			0,
			-15
		],
		tail: [
			-.4,
			.7,
			2.2
		],
		wn: [
			52,
			.6,
			0
		],
		wf: [
			56,
			.6,
			0
		]
	}, K.claw2 = {
		by: 53,
		pitch: .04,
		head: [
			58,
			108,
			-.12,
			.12
		],
		fn: [
			38,
			0,
			6
		],
		ff: [
			18,
			0,
			-14
		],
		tail: [
			-.45,
			.75,
			2
		],
		wn: [
			58,
			.85,
			0
		],
		wf: [
			62,
			.85,
			0
		]
	}, K.tail0 = {
		by: 54,
		pitch: .06,
		head: [
			52,
			108,
			-.05,
			.2
		],
		headZ: 6,
		eye: "narrow",
		tail: [
			-.15,
			.4,
			-1.3
		],
		hn: [
			-16,
			0,
			15
		],
		hf: [
			-30,
			0,
			-11
		],
		wn: [
			55,
			.7,
			0
		],
		wf: [
			60,
			.7,
			0
		],
		front: { tail: [
			-.85,
			1,
			-2.6,
			.75
		] }
	}, K.tail1 = {
		by: 50,
		pitch: 0,
		head: [
			56,
			104,
			-.1,
			.25
		],
		headZ: 10,
		tail: [
			-.55,
			.25,
			2.5
		],
		hn: [
			-14,
			0,
			17
		],
		hf: [
			-34,
			0,
			-9
		],
		wn: [
			45,
			.6,
			0
		],
		wf: [
			50,
			.6,
			0
		],
		front: { tail: [
			-.9,
			.95,
			2.4,
			.7
		] }
	}, K.tail2 = {
		by: 50,
		pitch: 0,
		head: [
			56,
			104,
			-.12,
			.2
		],
		headZ: 8,
		tail: [
			-.6,
			.2,
			3.1
		],
		hn: [
			-16,
			0,
			16
		],
		hf: [
			-32,
			0,
			-10
		],
		wn: [
			45,
			.6,
			0
		],
		wf: [
			50,
			.6,
			0
		],
		front: { tail: [
			-.9,
			.95,
			3.5,
			.7
		] }
	}, K.tail3 = {
		by: 53,
		pitch: .06,
		head: [
			56,
			110,
			-.1,
			.08
		],
		headZ: 3,
		tail: [
			-.5,
			.6,
			2.4
		],
		wn: [
			55,
			.85,
			0
		],
		wf: [
			60,
			.85,
			0
		]
	}, K.breath0 = {
		by: 60,
		pitch: .24,
		head: [
			44,
			126,
			.38,
			.12
		],
		eye: "narrow",
		breathe: 1,
		furnace: .6,
		tail: [
			-.4,
			.9,
			1.6
		],
		wn: [
			50,
			.5,
			0
		],
		wf: [
			54,
			.5,
			0
		],
		front: {
			...e,
			head: [
				56,
				118,
				.1,
				.12
			],
			wn: [
				56,
				.3,
				0,
				45
			],
			wf: [
				56,
				.3,
				0,
				45
			]
		}
	}, K.breath1 = {
		by: 56,
		pitch: .1,
		head: [
			66,
			104,
			-.2,
			.55
		],
		eye: "wide",
		breathe: .5,
		furnace: 1,
		fn: [
			32,
			0,
			16
		],
		tail: [
			-.4,
			.8,
			1.9
		],
		wn: [
			44,
			.4,
			0
		],
		wf: [
			48,
			.4,
			0
		],
		front: {
			...e,
			head: [
				68,
				100,
				-.2,
				.6
			],
			wn: [
				46,
				.2,
				0,
				55
			],
			wf: [
				46,
				.2,
				0,
				55
			],
			fn: [
				28,
				0,
				26
			],
			ff: [
				28,
				0,
				-26
			]
		}
	}, K.breath2 = {
		by: 54,
		pitch: .06,
		head: [
			70,
			98,
			-.3,
			.72
		],
		eye: "wide",
		furnace: 1,
		fn: [
			34,
			0,
			17
		],
		ff: [
			24,
			0,
			-16
		],
		tail: [
			-.45,
			.7,
			2
		],
		wn: [
			40,
			.35,
			0
		],
		wf: [
			44,
			.35,
			0
		],
		front: {
			...e,
			head: [
				70,
				96,
				-.22,
				.8
			],
			wn: [
				42,
				.15,
				0,
				60
			],
			wf: [
				42,
				.15,
				0,
				60
			],
			fn: [
				30,
				0,
				26
			],
			ff: [
				30,
				0,
				-26
			]
		}
	}, K.breath3 = {
		by: 54.5,
		pitch: .07,
		head: [
			69,
			99,
			-.27,
			.66
		],
		eye: "wide",
		furnace: .9,
		fn: [
			34,
			0,
			17
		],
		ff: [
			24,
			0,
			-16
		],
		tail: [
			-.45,
			.72,
			2.05
		],
		wn: [
			41,
			.35,
			0
		],
		wf: [
			45,
			.35,
			0
		],
		front: {
			...e,
			head: [
				69,
				97,
				-.2,
				.74
			],
			wn: [
				43,
				.15,
				0,
				60
			],
			wf: [
				43,
				.15,
				0,
				60
			],
			fn: [
				30,
				0,
				26
			],
			ff: [
				30,
				0,
				-26
			]
		}
	}, K.takeoff0 = {
		by: 45,
		pitch: .15,
		head: [
			58,
			98,
			.1,
			.12
		],
		eye: "narrow",
		fn: [
			30,
			0,
			16
		],
		ff: [
			22,
			0,
			-16
		],
		hn: [
			-18,
			0,
			15
		],
		hf: [
			-30,
			0,
			-15
		],
		tail: [
			-.3,
			.6,
			1.7
		],
		wn: [
			74,
			.2,
			-10
		],
		wf: [
			78,
			.2,
			-10
		]
	}, K.takeoff1 = {
		by: 64,
		pitch: .32,
		head: [
			52,
			124,
			.25,
			.25
		],
		eye: "wide",
		fn: [
			32,
			18,
			14
		],
		ff: [
			26,
			16,
			-14
		],
		hn: [
			-22,
			0,
			13
		],
		hf: [
			-32,
			2,
			-13
		],
		tail: [
			-.9,
			.6,
			1
		],
		wn: [
			-22,
			0,
			0
		],
		wf: [
			-18,
			0,
			0
		]
	}, K.takeoff2 = {
		by: 62,
		pitch: .38,
		head: [
			50,
			124,
			.25,
			.15
		],
		fn: [
			24,
			26,
			12
		],
		ff: [
			20,
			24,
			-12
		],
		hn: [
			-12,
			16,
			12
		],
		hf: [
			-22,
			18,
			-12
		],
		tail: [
			-1,
			.8,
			.6
		],
		wn: [
			56,
			.3,
			0
		],
		wf: [
			60,
			.3,
			0
		]
	}, K.dive0 = {
		by: 70,
		pitch: -.45,
		head: [
			58,
			64,
			-.65,
			.3
		],
		eye: "wide",
		neckBend: 4,
		fn: [
			10,
			34,
			12
		],
		ff: [
			6,
			36,
			-12
		],
		hn: [
			-34,
			52,
			12
		],
		hf: [
			-40,
			54,
			-12
		],
		tail: [
			.2,
			.2,
			.3
		],
		wn: [
			32,
			.55,
			-35
		],
		wf: [
			36,
			.55,
			-35
		]
	}, K.dive1 = {
		by: 64,
		pitch: -.22,
		head: [
			62,
			82,
			-.45,
			.55
		],
		eye: "wide",
		neckBend: 5,
		fn: [
			44,
			20,
			13
		],
		ff: [
			40,
			18,
			-13
		],
		hn: [
			-20,
			28,
			12
		],
		hf: [
			-28,
			30,
			-12
		],
		tail: [
			-.2,
			.4,
			.6
		],
		wn: [
			44,
			.15,
			-15
		],
		wf: [
			48,
			.15,
			-15
		]
	}, K.hurt = {
		by: 58,
		pitch: .16,
		head: [
			46,
			120,
			.32,
			.35
		],
		eye: "shut",
		lean: -.06,
		fn: [
			28,
			4,
			14
		],
		tail: [
			-.3,
			.9,
			1.5
		],
		wn: [
			52,
			.6,
			0
		],
		wf: [
			56,
			.6,
			0
		],
		front: {
			...e,
			head: [
				54,
				114,
				.1,
				.35
			],
			wn: [
				58,
				.4,
				0,
				45
			],
			wf: [
				58,
				.4,
				0,
				45
			]
		}
	}, K.stagger0 = {
		by: 34,
		pitch: -.06,
		head: [
			56,
			22,
			-.22,
			.22
		],
		eye: "shut",
		lean: .12,
		neckBend: -2,
		fn: [
			36,
			0,
			24
		],
		ff: [
			24,
			0,
			-22
		],
		hn: [
			-14,
			0,
			22
		],
		hf: [
			-30,
			0,
			-20
		],
		tail: [
			-.2,
			.3,
			2.2
		],
		wn: [
			-24,
			.25,
			0
		],
		wf: [
			-12,
			.3,
			0
		]
	}, K.stagger1 = {
		by: 35,
		pitch: -.04,
		head: [
			55,
			30,
			-.1,
			.3
		],
		eye: "narrow",
		lean: .1,
		neckBend: -1,
		fn: [
			36,
			0,
			24
		],
		ff: [
			24,
			0,
			-22
		],
		hn: [
			-14,
			0,
			22
		],
		hf: [
			-30,
			0,
			-20
		],
		tail: [
			-.2,
			.32,
			2.3
		],
		wn: [
			-20,
			.25,
			0
		],
		wf: [
			-10,
			.3,
			0
		]
	}, K.death0 = {
		by: 64,
		pitch: .48,
		head: [
			34,
			132,
			.85,
			.65
		],
		eye: "wide",
		breathe: 1,
		fn: [
			32,
			10,
			14
		],
		ff: [
			26,
			6,
			-14
		],
		hn: [
			-12,
			0,
			13
		],
		hf: [
			-24,
			0,
			-13
		],
		tail: [
			-.2,
			1.1,
			1.4
		],
		wn: [
			70,
			.1,
			0
		],
		wf: [
			74,
			.1,
			0
		],
		front: {
			...e,
			by: 54,
			head: [
				44,
				128,
				.75,
				.65
			]
		}
	}, K.death1 = {
		by: 56,
		pitch: .24,
		head: [
			50,
			110,
			.15,
			.5
		],
		eye: "narrow",
		lean: .1,
		tail: [
			-.4,
			.8,
			1.7
		],
		wn: [
			24,
			.4,
			0
		],
		wf: [
			30,
			.4,
			0
		],
		front: {
			...e,
			by: 50,
			head: [
				56,
				106,
				.3,
				.5
			]
		}
	}, K.death2 = {
		by: 40,
		pitch: .02,
		head: [
			58,
			58,
			-.3,
			.4
		],
		eye: "narrow",
		lean: .26,
		fn: [
			34,
			0,
			22
		],
		ff: [
			22,
			0,
			-18
		],
		hn: [
			-16,
			0,
			20
		],
		hf: [
			-28,
			0,
			-16
		],
		tail: [
			-.3,
			.5,
			2
		],
		wn: [
			-8,
			.4,
			0
		],
		wf: [
			4,
			.4,
			0
		]
	}, K.death3 = {
		by: 28,
		pitch: -.04,
		head: [
			57,
			20,
			-.18,
			.3
		],
		eye: "shut",
		lean: .48,
		neckBend: -2,
		fn: [
			36,
			4,
			30
		],
		ff: [
			26,
			8,
			-10
		],
		hn: [
			-12,
			4,
			28
		],
		hf: [
			-28,
			8,
			-8
		],
		tail: [
			-.15,
			.25,
			2.3
		],
		wn: [
			-34,
			.3,
			0
		],
		wf: [
			-6,
			.5,
			0
		]
	}, K.death4 = {
		by: 24,
		pitch: -.05,
		head: [
			58,
			16,
			-.12,
			.26
		],
		eye: "shut",
		lean: .58,
		neckBend: -3,
		fn: [
			38,
			6,
			32
		],
		ff: [
			28,
			12,
			-6
		],
		hn: [
			-10,
			6,
			30
		],
		hf: [
			-26,
			12,
			-4
		],
		tail: [
			-.1,
			.2,
			2.35
		],
		wn: [
			-42,
			.3,
			0
		],
		wf: [
			-4,
			.5,
			0
		]
	}, K.gust0 = {
		by: 62,
		pitch: .34,
		head: [
			50,
			122,
			.2,
			.2
		],
		eye: "narrow",
		fn: [
			30,
			4,
			14
		],
		tail: [
			-.4,
			.9,
			1.5
		],
		wn: [
			72,
			0,
			-25
		],
		wf: [
			76,
			0,
			-25
		]
	}, K.gust1 = {
		by: 57,
		pitch: .16,
		head: [
			60,
			112,
			0,
			.35
		],
		eye: "wide",
		tail: [
			-.4,
			.8,
			1.8
		],
		wn: [
			6,
			0,
			35
		],
		wf: [
			10,
			0,
			35
		]
	}, K.stomp0 = {
		by: 70,
		pitch: .72,
		head: [
			38,
			136,
			.35,
			.35
		],
		eye: "wide",
		fn: [
			36,
			40,
			14
		],
		ff: [
			30,
			36,
			-14
		],
		hn: [
			-18,
			0,
			14
		],
		hf: [
			-28,
			0,
			-14
		],
		tail: [
			-.8,
			.8,
			1.3
		],
		wn: [
			58,
			.5,
			0
		],
		wf: [
			62,
			.5,
			0
		]
	}, K.stomp1 = {
		by: 50,
		pitch: -.05,
		head: [
			62,
			92,
			-.3,
			.42
		],
		eye: "wide",
		fn: [
			36,
			0,
			17
		],
		ff: [
			30,
			0,
			-17
		],
		hn: [
			-20,
			0,
			14
		],
		hf: [
			-32,
			0,
			-14
		],
		tail: [
			-.3,
			.6,
			2.1
		],
		wn: [
			22,
			.3,
			0
		],
		wf: [
			26,
			.3,
			0
		]
	};
}
function da(e, t) {
	let n = K[e] ?? {}, r = {
		...Ci,
		...n
	};
	if (t !== "down") return r;
	for (let e of [
		"fn",
		"ff",
		"hn",
		"hf"
	]) r[e] = [
		r[e][0],
		r[e][1],
		r[e][2] * 1.5
	];
	r.tail = pi, r.head = [
		r.head[0],
		r.head[1],
		r.head[2] + .24,
		r.head[3]
	];
	for (let e of ["wn", "wf"]) {
		let t = r[e];
		t[3] === void 0 && (r[e] = [
			t[0],
			t[1],
			t[2],
			50 * (1 - t[1])
		]);
	}
	return {
		...r,
		...fi,
		...n.front ?? {}
	};
}
function fa(e) {
	let { M: t } = e;
	ra = (t, n, r) => e.hash2(t, n, r), G = {
		scales: t.FUR,
		dark: t.FUR2,
		belly: t.FUR3,
		membrane: t.WING,
		bone: t.BONE,
		glow: t.GLOW,
		horn: t.BEAK,
		rim: t.GOLD,
		hot: t.ACCENT,
		crimson: t.COMB
	};
	function n(e, t, n, r) {
		let i = da(n, t), a = wi(i);
		Qi(a, t, r.G), aa(a, t, r.G, i), sa(), ua();
		for (let t = 0; t < ni; t++) for (let n = 0; n < ti; n++) {
			let r = t * ti + n, i = zi[r];
			if (!i) continue;
			let a = Math.round(Bi[r]);
			e.set(n, t, i, a < 0 ? 0 : a > 4 ? 4 : a);
		}
	}
	return {
		fw: ti,
		fh: ni,
		columns: ui,
		aliases: {
			kneel: "idle0",
			dead: "death4",
			move0: "walk0",
			move1: "walk1",
			move2: "walk3",
			move3: "walk4"
		},
		spriteOptions: { blobSize: [7, 3] },
		draw: n,
		idle: {
			poses: [
				"idle0",
				"idle1",
				"idle2",
				"idle3"
			],
			fps: 3
		},
		layout: {
			perRow: 21,
			strips: [
				{ dir: "left" },
				{ dir: "right" },
				{
					dir: "down",
					poses: di
				}
			]
		},
		ramps: () => e.makeRamps({
			[t.FUR]: e.ramp5([
				"#0c080d",
				"#1a121a",
				"#2e2028",
				"#4a3034",
				"#6e4844"
			]),
			[t.FUR2]: e.ramp5([
				"#060408",
				"#100b11",
				"#1d141b",
				"#30212a",
				"#4a3238"
			]),
			[t.COMB]: e.ramp5([
				"#2a0a10",
				"#4c1018",
				"#761a1e",
				"#a42a26",
				"#d24a36"
			]),
			[t.FUR3]: e.ramp5([
				"#22140f",
				"#432718",
				"#6a3d24",
				"#955733",
				"#bd814b"
			]),
			[t.ACCENT]: e.ramp5([
				"#2c0e08",
				"#5a1a0c",
				"#902c12",
				"#c84c1c",
				"#f4823a"
			]),
			[t.GOLD]: e.ramp5([
				"#3a2410",
				"#6c4418",
				"#a6702a",
				"#dca448",
				"#ffde8c"
			]),
			[t.WING]: e.ramp5([
				"#1e0709",
				"#440f0e",
				"#721c12",
				"#a6321a",
				"#de642c"
			]),
			[t.BONE]: e.ramp5([
				"#1a1416",
				"#3b3030",
				"#6b5c4e",
				"#a39276",
				"#d9cca9"
			]),
			[t.BEAK]: e.ramp5([
				"#0b0709",
				"#191113",
				"#2c2022",
				"#5c4a40",
				"#cdbb96"
			]),
			[t.GLOW]: e.glowRamp([
				"#5a1204",
				"#b2340a",
				"#f0701a",
				"#ffb648",
				"#fff0b0"
			])
		}, t.FUR)
	};
}
//#endregion
//#region src/engine/pixel/MonsterSprites.js
var { Painter: pa, resolvePainter: ma, M: q, blob: ha, quadGait: ga, quadLeg: _a, tailChain: va, rampForKind: ya, finishTexture: ba, glowTexel: xa, OUTLINE: Sa } = Ie;
Object.freeze([
	"slime",
	"goblin",
	"archer",
	"shaman",
	"bat",
	"boar",
	"dummy",
	"golem",
	"drakeborn",
	"ashhound",
	"wyrmcaller",
	"kobold",
	"whelp",
	"emberimp",
	"dragon"
]);
var Ca = 4096, wa = [
	"idle0",
	"idle1",
	"move0",
	"move1",
	"move2",
	"move3",
	"windup",
	"attack",
	"hurt",
	"dead"
], Ta = [
	"idle0",
	"idle1",
	"walk0",
	"walk1",
	"walk2",
	"walk3",
	...Fe
], Ea = {
	move0: "walk0",
	move1: "walk1",
	move2: "walk2",
	move3: "walk3"
};
function Da(e, t) {
	let n = Array(40).fill(null);
	for (let [t, r] of Object.entries(e)) n[t] = Array.isArray(r) && Array.isArray(r[0]) ? r : ya(r);
	n[q.LINE] = [
		Sa,
		Sa,
		Sa,
		Sa,
		Sa
	];
	let r = n[t];
	for (let e = 0; e < 40; e++) n[e] || (n[e] = r);
	return n;
}
var Oa = (e) => ya(e), ka = (e) => ya(e).map(xa);
function Aa(e, t) {
	let n = ya([
		e,
		e,
		e,
		t,
		"#ffffff"
	]);
	return [
		Sa,
		n[1],
		n[2],
		n[3],
		[
			255,
			255,
			255,
			255
		]
	];
}
function ja(e, t, n, r) {
	let i = Infinity, a = -Infinity, o = Infinity, s = -Infinity;
	for (let [e, n] of t) i = Math.min(i, e), a = Math.max(a, e), o = Math.min(o, n), s = Math.max(s, n);
	for (let c = Math.floor(o); c <= Math.ceil(s); c++) for (let o = Math.floor(i); o <= Math.ceil(a); o++) {
		if (!Ma(o + .5, c + .5, t)) continue;
		let i = typeof r == "function" ? r(o, c) : r;
		i != null && e.set(o, c, n, i);
	}
}
function Ma(e, t, n) {
	let r = !1;
	for (let i = 0, a = n.length - 1; i < n.length; a = i++) {
		let [o, s] = n[i], [c, l] = n[a];
		s > t != l > t && e < (c - o) * (t - s) / (l - s) + o && (r = !r);
	}
	return r;
}
function Na(e, t, n, r, i, a, o, s) {
	let c = Math.max(1, Math.ceil(Math.hypot(r - t, i - n) * 2)), l = a / 2;
	for (let a = 0; a <= c; a++) {
		let u = a / c, d = t + (r - t) * u, f = n + (i - n) * u;
		for (let t = Math.floor(f - l); t <= Math.ceil(f + l); t++) for (let n = Math.floor(d - l); n <= Math.ceil(d + l); n++) {
			let r = n + .5 - d, i = t + .5 - f;
			r * r + i * i > l * l + .01 || e.set(n, t, o, typeof s == "function" ? s(u, n, t) : s);
		}
	}
}
function Pa(e, t, n, r, i, a, o, { facets: s = 8, rot: c = .3, face: l = .55, faceShade: u = 2, lift: d = 0 } = {}) {
	let f = Math.PI * 2, p = new Float32Array(s + 1), m = new Float32Array(s + 1), h = new Int8Array(s);
	for (let e = 0; e <= s; e++) {
		let t = c + e % s / s * f, n = 1 - .16 * A(e % s, 3, o);
		p[e] = Math.cos(t) * n, m[e] = Math.sin(t) * n;
	}
	for (let e = 0; e < s; e++) {
		let t = c + (e + .5) / s * f, n = -(Math.cos(t) * .62 + Math.sin(t) * .78);
		h[e] = n > .5 ? 3 : n > -.05 ? 2 : +(n > -.6);
	}
	let g = 0, _ = (e, t) => {
		let n = Math.sqrt(e * e + t * t);
		if (n < 1e-6) return g = 0, 0;
		let r = (Math.atan2(t, e) - c) / f;
		r -= Math.floor(r);
		let i = Math.min(s - 1, r * s | 0);
		g = i;
		let a = p[i + 1] - p[i], o = m[i + 1] - m[i];
		return n / ((p[i] * o - m[i] * a) / (e / n * o - t / n * a));
	}, v = Math.floor(t - r - 1), y = Math.ceil(t + r + 1);
	for (let o = Math.floor(n - i - 1); o <= Math.ceil(n + i + 1); o++) {
		let s = (o + .5 - n) / i;
		for (let c = v; c <= y; c++) {
			let f = _((c + .5 - t) / r, s);
			if (f >= 1) continue;
			let p;
			if (f < l) p = u + d;
			else {
				let e = g;
				p = h[e] + d, h[e] >= 2 && _((c - .5 - t) / r, (o - .5 - n) / i) >= 1 && (p = 4 + Math.min(0, d));
			}
			e.set(c, o, a, p < 0 ? 0 : p > 4 ? 4 : p);
		}
	}
}
function Fa(e, t, n = 3, r = q.GLOW) {
	for (let i = 0; i + 1 < t.length; i++) {
		let [a, o] = t[i], [s, c] = t[i + 1];
		e.line2(a, o, s, c, r, (e) => e < .15 && i === 0 ? Math.min(4, n + 1) : n);
	}
}
function Ia(e) {
	let { w: t, h: n, mat: r } = e;
	for (let e = 0; e < n; e++) for (let i = 0; i < t; i++) i > 1 && i < t - 2 && e > 1 && e < n - 1 || (r[e * t + i] = 0);
}
function La(e, t, n) {
	let { w: r, h: i, mat: a, shade: o } = e, s = new Uint8Array(r * i), c = new Int8Array(r * i);
	for (let e = 0; e < i; e++) {
		let i = Math.round((n - e) * t);
		for (let t = 0; t < r; t++) {
			let n = e * r + t;
			if (!a[n]) continue;
			let l = t + i;
			l < 0 || l >= r || (s[e * r + l] = a[n], c[e * r + l] = o[n]);
		}
	}
	a.set(s), o.set(c);
}
var Ra = {
	idle0: {
		rx: 6.8,
		ry: 4.3
	},
	idle1: {
		rx: 7.2,
		ry: 4
	},
	move0: {
		rx: 7.6,
		ry: 3.6
	},
	move1: {
		rx: 5.6,
		ry: 5,
		lean: -1
	},
	move2: {
		rx: 6.2,
		ry: 4.6,
		lift: 1
	},
	move3: {
		rx: 5.8,
		ry: 4.9,
		lean: 1
	},
	windup: {
		rx: 7.8,
		ry: 3.3,
		face: "fierce"
	},
	attack: {
		rx: 7.4,
		ry: 4.2,
		lift: 1,
		lean: -2,
		face: "fierce",
		stretch: !0
	},
	hurt: {
		rx: 7.1,
		ry: 3.9,
		face: "hurt",
		dent: !0
	},
	dead: {
		rx: 7.8,
		ry: 2,
		face: "dead",
		splat: !0
	},
	land: {
		rx: 7.8,
		ry: 3.5
	}
};
function za(e, t, n, r) {
	let i = Ra[n], a = r.G, o = t === "side", s = 10 + (o ? i.lean ?? 0 : 0), c = o && i.stretch ? i.rx + .4 : !o && i.stretch ? i.rx - 1.4 : i.rx, l = !o && i.stretch ? i.ry + .8 : i.ry, u = i.lift ?? 0, d = a + 1 - l - u, f = a - u;
	if (i.splat) {
		e.begin(null);
		for (let [t, n] of [
			[3, a],
			[4, a],
			[16, a - 1],
			[15, a]
		]) e.set(t, n, q.GEL, 2);
		e.end();
	}
	o && i.stretch && (e.begin(null), ha(e, s + c - .5, d + 1.5, 2.2, 1.6, q.GEL, {
		hi: .2,
		lo: -.4
	}), e.end()), e.begin(null);
	for (let t = Math.floor(d - l); t <= f; t++) for (let n = Math.floor(s - c); n <= Math.ceil(s + c); n++) {
		let r = (n + .5 - s) / c, i = (t + .5 - d) / l;
		i > 0 && (i *= .72);
		let a = r * r + i * i;
		if (a > 1) continue;
		let o = -r * .55 - i * .8, u = o > .45 ? 3 : o > -.2 ? 2 : 1;
		a < .3 && i > -.2 && (u = Math.min(u, 2)), t === f ? u = 1 : t === f - 1 && Math.abs(r) < .8 && (u = 3), a > .62 && o > .25 && (u = 4), e.set(n, t, q.GEL, u);
	}
	if (i.dent) for (let t = Math.round(s) - 1; t <= Math.round(s) + 1; t++) e.erase(t, Math.floor(d - l));
	let p = Math.round(s - c * .45), m = Math.round(d - l * .45);
	e.over(p, m, q.GEL, 4), e.over(p + 1, m, q.GEL, 4), e.over(p, m + 1, q.GEL, 4), e.over(Math.round(s + c * .35), Math.round(d + l * .15), q.GEL, 3), e.end();
	let h = i.face ?? "calm", g = Math.round(d - (i.splat ? .5 : .2)), _ = t === "down" ? [Math.round(s - 3), Math.round(s + 2)] : o ? [Math.round(s - c * .62)] : [];
	e.begin(null);
	for (let t of _) {
		if (h === "hurt") {
			e.set(t - 1, g, q.EYE, 0), e.set(t, g + 1, q.EYE, 0), e.set(t + 1, g, q.EYE, 0);
			continue;
		}
		if (h === "dead") {
			e.set(t, g, q.EYE, 0), e.set(t + 1, g + 1, q.EYE, 0), e.set(t + 1, g, q.EYE, 1), e.set(t, g + 1, q.EYE, 1);
			continue;
		}
		e.set(t, g, q.EYE, 0), e.set(t + 1, g, q.EYE, 0), e.set(t, g + 1, q.EYE, 0), e.set(t + 1, g + 1, q.EYE, 0), e.set(t, g, q.EYE, 4), h === "fierce" && (e.set(t - 1, g - 1, q.GEL, 0), e.set(t, g - 1, q.GEL, 0), e.set(t + 1, g - 1, q.GEL, 0));
	}
	if (t === "down" && h !== "dead") {
		let t = Math.round(s - .5), n = g + 2;
		e.set(t, n, q.EYE, 0), e.set(t + 1, n, q.EYE, 0), (h === "fierce" || h === "hurt") && e.set(t, n + 1, q.EYE, 1);
	} else o && h !== "dead" && e.set(_[0] - 1, g + 2, q.EYE, 0);
	e.end();
	let v = Math.floor(d - l) + +!!i.dent, y = Math.round(s - (o ? -.5 : .5));
	if (e.begin("below", 1), i.splat) {
		for (let t = y - 2; t <= y + 1; t++) e.set(t, v, q.FUR, t < y ? 3 : 2);
		e.set(y + 2, v, q.FUR2, 3), e.set(y + 3, v, q.FUR2, 2);
	} else {
		for (let t = y - 2; t <= y + 2; t++) e.set(t, v, q.FUR, t < y ? 3 : t === y ? 2 : 1);
		for (let t = y - 1; t <= y + 1; t++) e.set(t, v - 1, q.FUR, t < y + 1 ? 3 : 2);
		e.set(y - 3, v + 1, q.FUR, 2), e.set(y + 3, v + 1, q.FUR, 1);
		let t = n === "move1" || n === "attack" ? 1 : n === "move3" ? -1 : 0;
		e.set(y + t, v - 2, q.FUR2, 1), e.set(y + 1 + t, v - 3, q.FUR2, 3), e.set(y + 2 + t, v - 3, q.FUR2, 4), e.set(y + 2 + t, v - 4, q.FUR2, 3), e.set(y - 1 + t, v - 3, q.FUR2, 2);
	}
	e.end();
}
var Ba = {
	up: {
		wrist: [3, -5],
		tips: [
			[5, -8],
			[7, -6],
			[7, -2]
		]
	},
	mid: {
		wrist: [4, -2],
		tips: [
			[7, -3],
			[8, 0],
			[6, 3]
		]
	},
	down: {
		wrist: [3, 1],
		tips: [
			[7, 2],
			[6, 5],
			[3, 6]
		]
	},
	high: {
		wrist: [2, -6],
		tips: [
			[3, -9],
			[6, -8],
			[7, -4]
		]
	},
	swept: {
		wrist: [2, -3],
		tips: [
			[3, 2],
			[4, 4],
			[2, 5]
		]
	},
	crumple: {
		wrist: [3, 0],
		tips: [
			[4, 4],
			[6, 2],
			[2, 5]
		]
	},
	fold: {
		wrist: [1, -2],
		tips: [
			[1, 3],
			[2, 3],
			[0, 4]
		]
	}
}, Va = {
	idle0: { wings: ["up", "up"] },
	idle1: { wings: ["down", "down"] },
	move0: { wings: ["up", "up"] },
	move1: { wings: ["mid", "mid"] },
	move2: {
		wings: ["down", "down"],
		dy: 1
	},
	move3: {
		wings: ["mid", "mid"],
		dy: -1
	},
	windup: {
		wings: ["high", "high"],
		eyes: "wide",
		dy: -1
	},
	attack: {
		wings: ["swept", "swept"],
		eyes: "wide",
		dy: 1
	},
	hurt: {
		wings: ["crumple", "up"],
		eyes: "shut"
	},
	dead: {
		wings: ["fold", "fold"],
		eyes: "dead",
		dy: 2
	}
};
function Ha(e, t, n, r, i, a, o = .85) {
	let s = Ba[r], c = ([e, r]) => [t + e * i * o, n + r], l = c(s.wrist), u = s.tips.map(c), d = [t + .5 * i, n + 3.2], f = (e, t) => {
		let n = [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2];
		return [n[0] + (l[0] - n[0]) * .38, n[1] + (l[1] - n[1]) * .38];
	}, p = [
		[t, n - .6],
		l,
		u[0]
	];
	for (let e = 0; e + 1 < u.length; e++) p.push(f(u[e], u[e + 1]), u[e + 1]);
	p.push(f(u[u.length - 1], d), d), ja(e, p, q.WING, (e, t) => {
		let n = Math.hypot(e + .5 - l[0], t + .5 - l[1]);
		return Math.max(0, (n < 2.4 ? 3 : n < 4.6 ? 2 : 1) + a - 1);
	});
	let m = Math.min(4, a + 2);
	e.line2(t, n, l[0], l[1], q.FUR, Math.min(4, m + 1));
	for (let t of u) e.line2(l[0], l[1], t[0], t[1], q.FUR, m);
	e.set(Math.round(l[0]), Math.round(l[1]) - 1, q.BONE, 2);
}
function Ua(e, t, n) {
	let r = Va[n], i = 11 + (r.dy ?? 0), a = r.eyes === "wide" ? 4 : 3;
	if (t === "side") {
		let [t, n] = r.wings;
		e.begin(null), Ha(e, 13, i - 3, n, 1, 0, .6), e.end(), e.begin("all", 0), Ha(e, 11.5, i - 2, t, 1, 2, .85), e.end(), e.begin("all", 0), ha(e, 11, i + .8, 3.2, 3, q.FUR, {
			hi: .4,
			lo: -.3
		});
		for (let t = i; t <= i + 2; t++) e.over(9, t, q.FUR, 3), e.over(10, t, q.FUR, 2);
		e.set(11, i + 4, q.FUR, 1), e.set(12, i + 4, q.FUR, 0), e.end(), e.begin("all", 0), ha(e, 7.5, i - 1.8, 3, 2.7, q.FUR, {
			hi: .3,
			lo: -.3
		}), e.set(10, i - 6, q.FUR, 1), e.set(10, i - 5, q.FUR, 1), e.set(8, i - 7, q.FUR, 4), e.set(8, i - 6, q.FUR, 3), e.set(9, i - 6, q.FUR, 2), e.set(8, i - 5, q.FUR, 3), e.set(9, i - 5, q.FUR, 2), e.set(9, i - 5, q.WING, 2), e.set(4, i - 1, q.FUR, 3), e.set(4, i, q.FUR, 2), e.set(5, i, q.FUR, 1), e.end(), e.begin(null), r.eyes === "shut" || r.eyes === "dead" ? (e.set(6, i - 2, q.EYE, 0), e.set(7, i - 2, q.EYE, 0)) : (e.set(6, i - 2, q.GLOW, a), e.set(7, i - 2, q.GLOW, a - 1), r.eyes === "wide" && e.set(6, i - 3, q.GLOW, 3)), e.set(5, i + 1, q.BONE, 4), e.end();
		return;
	}
	let o = t === "up", s = 9.5;
	if (e.begin(null), Ha(e, 8, i - 2, r.wings[0], -1, +!o), Ha(e, 11, i - 2, r.wings[1], 1, 0), e.end(), e.begin(null), ha(e, s, i, 2.6, 3.1, q.FUR, {
		hi: .35,
		lo: -.3
	}), !o) for (let t = i - 1; t <= i + 2; t++) e.over(8, t, q.FUR, 3), e.over(9, t, q.FUR, 2);
	if (ha(e, s, i - 4, 2.6, 2.2, q.FUR, {
		hi: .3,
		lo: -.3
	}), e.set(6, i - 7, q.FUR, 3), e.set(6, i - 6, q.FUR, 2), e.set(7, i - 6, q.FUR, 2), e.set(11, i - 7, q.FUR, 2), e.set(11, i - 6, q.FUR, 1), e.set(10, i - 6, q.FUR, 1), o || (e.set(6, i - 6, q.WING, 2), e.set(11, i - 6, q.WING, 1)), e.set(8, i + 3, q.FUR, 1), e.set(10, i + 3, q.FUR, 0), e.end(), !o) {
		e.begin(null);
		let t = i - 4;
		r.eyes === "shut" ? (e.set(7, t, q.EYE, 0), e.set(10, t, q.EYE, 0)) : r.eyes === "dead" ? (e.set(7, t, q.EYE, 1), e.set(10, t, q.EYE, 1)) : (e.set(7, t, q.GLOW, a), e.set(10, t, q.GLOW, a), r.eyes === "wide" && (e.set(7, t - 1, q.GLOW, 3), e.set(10, t - 1, q.GLOW, 3))), e.set(8, t + 2, q.BONE, 4), e.set(9, t + 2, q.BONE, 3), e.end();
	}
}
var Wa = {
	idle0: {},
	idle1: { head: [0, 1] },
	move0: { walk: 0 },
	move1: {
		walk: 1,
		body: -1
	},
	move2: { walk: 2 },
	move3: {
		walk: 3,
		body: -1
	},
	windup: {
		head: [0, 2],
		paw: !0,
		eye: "angry"
	},
	attack: {
		head: [-1, -2],
		legs: [
			[-2, 0],
			[-1, 0],
			[2, 0],
			[1, 0]
		],
		eye: "angry"
	},
	hurt: {
		head: [1, -1],
		body: 0,
		eye: "shut",
		legs: [
			[1, 0],
			[0, 0],
			[1, 0],
			[0, 0]
		]
	},
	dead: { dead: !0 },
	charge0: {
		head: [-1, 2],
		body: 1,
		legs: [
			[-3, 1],
			[-2, 1],
			[3, 1],
			[2, 1]
		],
		eye: "angry",
		flat: !0
	},
	charge1: {
		head: [-1, 1],
		body: -1,
		legs: [
			[1, 2],
			[2, 2],
			[-1, 2],
			[-2, 2]
		],
		eye: "angry",
		flat: !0
	},
	stun: {
		head: [-1, 3],
		eye: "dizzy",
		legs: [
			[-1, 0],
			[1, 0],
			[1, 0],
			[-1, 0]
		]
	}
};
function Ga(e, t, n, r) {
	e.begin(null), ha(e, t, n, 5.2, 4.2, q.FUR, {
		hi: .4,
		lo: -.25
	});
	for (let r = n; r <= n + 3; r++) for (let i = t - 7; i <= t - 4; i++) {
		let a = i === t - 7;
		(!a || r !== n && r !== n + 3) && e.set(i, r, a ? q.NOSE : q.FUR, a ? r === n + 1 ? 3 : 2 : r === n ? 3 : r === n + 3 ? 1 : 2);
	}
	e.set(t - 7, n + 1, q.NOSE, 1);
	for (let r = t - 5; r <= t + 2; r++) e.over(r, n + 3, q.FUR, 1);
	e.end(), e.begin("below", 0);
	for (let [r, i] of [
		[-3, -4],
		[-2, -4],
		[-1, -4],
		[0, -4],
		[-4, -3],
		[-3, -3],
		[-2, -3],
		[-1, -3],
		[0, -3],
		[1, -3],
		[-5, -2],
		[-4, -2],
		[-3, -2],
		[-2, -2],
		[-1, -2]
	]) e.set(t + r, n + i, q.METAL, i === -4 ? 4 : r < -2 ? 3 : 2);
	e.set(t - 2, n - 3, q.METAL, 4), e.end(), e.begin(null), e.set(t + 2, n - 5, q.FUR, 3), e.set(t + 3, n - 5, q.FUR, 2), e.set(t + 3, n - 6, q.FUR, 3), e.set(t + 2, n - 4, q.FUR, 2);
	let i = t - 2, a = n - 1;
	r === "shut" ? (e.set(i, a, q.EYE, 0), e.set(i + 1, a, q.EYE, 0)) : r === "dizzy" || r === "dead" ? (e.set(i, a, q.EYE, 0), e.set(i + 1, a + 1, q.EYE, 0), e.set(i + 1, a - 1, q.EYE, 0), e.set(i - 1, a + 1, q.EYE, 0)) : (e.set(i, a, q.EYE, 2), e.set(i + 1, a, q.EYE, 0), r === "angry" && e.set(i, a - 1, q.FUR, 0)), e.end(), e.begin("all", 0), e.set(t - 4, n + 3, q.BONE, 3), e.set(t - 5, n + 2, q.BONE, 4), e.set(t - 6, n + 1, q.BONE, 4), e.set(t - 6, n, q.BONE, 3), e.end();
}
function Ka(e, t, n, r) {
	let i = +(t.walk === 0 || t.walk === 1), a = +(t.walk === 2 || t.walk === 3), o = [t.paw ? 1 : i, a];
	e.begin(null), e.set(9, 5 + r, q.FUR, 3), e.set(9, 6 + r, q.FUR, 2), e.set(10, 6 + r, q.FUR, 2), e.set(22, 5 + r, q.FUR, 2), e.set(22, 6 + r, q.FUR, 1), e.set(21, 6 + r, q.FUR, 1), ha(e, 16, 10 + r, 7.5, 4, q.FUR, {
		hi: .4,
		lo: -.1
	}), e.end(), e.begin(null);
	for (let [t, i] of [[0, 10], [1, 19]]) for (let a = 16 + r; a <= n - o[t]; a++) {
		let r = a >= n - o[t] - 1;
		for (let t = 0; t < 3; t++) e.set(i + t, a, r ? q.FUR2 : q.FUR, r ? t === 0 ? 3 : 1 : t === 0 ? 3 : t === 1 ? 2 : 1);
	}
	e.end(), e.begin("below", 1), ha(e, 16, 13.5 + r, 9.4, 5.8, q.FUR, {
		hi: .45,
		lo: -.25
	});
	for (let t = 8; t <= 23; t++) t !== 15 && t !== 16 && e.over(t, 18 + r, q.FUR3, t < 16 ? 2 : 1);
	e.end(), e.begin(null);
	for (let t = 6 + r; t <= 15 + r; t++) e.set(15, t, q.FUR2, t & 1 ? 3 : 2), e.set(16, t, q.FUR2, t & 1 ? 1 : 2), t & 1 || e.set(16 + (t % 4 ? 1 : -2), t - 1, q.FUR2, 2);
	for (let t = 16 + r; t <= 18 + r; t++) e.set(16, t, q.FUR, 0);
	e.set(15, 15 + r, q.FUR, 3), e.set(14, 16 + r, q.FUR, 3), e.set(14, 17 + r, q.FUR, 2), e.set(15, 17 + r, q.FUR, 1), e.end();
}
function qa(e, t, n, r, i) {
	for (let a = t; a <= n; a++) {
		let n = r(a);
		if (n == null) continue;
		let o = (a - t) % 3;
		e.set(a, n, q.FUR2, o === 0 ? 3 : 2), !i && o === 0 && e.set(a + 1, n - 1, q.FUR2, 2), i && o === 0 && e.set(a + 1, n, q.FUR2, 3);
	}
}
function Ja(e, t, n, r) {
	let i = Wa[n], a = r.G, [o, s] = i.head ?? [0, 0], c = i.body ?? 0;
	if (t === "side") {
		if (i.dead) {
			e.begin(null), ha(e, 18.5, a - 3.2, 9.5, 3.8, q.FUR, {
				hi: .35,
				lo: -.3
			});
			for (let t = 12; t <= 25; t++) e.over(t, a - 5, q.FUR, 3);
			e.end(), e.begin(null), qa(e, 12, 25, () => a - 7, !0), e.end(), e.begin("all", 0);
			for (let t of [
				12,
				15,
				21,
				24
			]) e.set(t, a - 1, q.FUR, 2), e.set(t + 1, a, q.FUR, 1), e.set(t + 2, a, q.FUR2, 1);
			e.end(), Ga(e, 9, a - 3, "dead");
			return;
		}
		let t = i.legs ? i.legs.map(([e, t]) => ({
			dx: e,
			lift: t
		})) : ga({ walk: i.walk ?? -1 });
		i.paw && (t[0] = {
			dx: 1,
			lift: 2
		});
		let n = 13.5 + c;
		e.begin(null), _a(e, 12, 17 + c, a, t[1].lift, t[1].dx, !0, q.FUR2, q.FUR, 3), _a(e, 24, 17 + c, a, t[3].lift, t[3].dx, !0, q.FUR2, q.FUR, 3), e.end(), e.begin(null), ha(e, 22, n + .8, 6.8, 5, q.FUR, {
			hi: .45,
			lo: -.2
		}), ha(e, 15, n - .4, 7, 6.2, q.FUR, {
			hi: .45,
			lo: -.2
		});
		for (let t = 11; t <= 26; t++) e.over(t, Math.round(n + 4.8), q.FUR3, 2), e.over(t, Math.round(n + 5.6), q.FUR3, 1);
		for (let t = Math.round(n - 4); t <= Math.round(n + 3); t++) for (let n = 10; n <= 27; n++) (n * 2 + t * 3) % 7 == 0 && e.getShade(n, t) >= 2 && e.over(n, t, q.FUR, e.getShade(n, t) - 1);
		e.set(28, Math.round(n - 1), q.FUR, 2), e.set(29, Math.round(n - 2), q.FUR, 2), e.set(29, Math.round(n - 3), q.FUR, 1), e.set(28, Math.round(n - 3), q.FUR, 1), e.end(), e.begin(null), qa(e, 10, 26, (e) => {
			let t = n - .4 - 6.2 * Math.sqrt(Math.max(0, 1 - ((e + .5 - 15) / 7) ** 2)), r = n + .8 - 5 * Math.sqrt(Math.max(0, 1 - ((e + .5 - 22) / 6.8) ** 2));
			return Math.round(Math.min(Math.abs(e + .5 - 15) < 7 ? t : 99, Math.abs(e + .5 - 22) < 6.8 ? r : 99)) - 1;
		}, i.flat), e.end(), e.begin("sides", 1), _a(e, 11, 17 + c, a, t[0].lift, t[0].dx, !1, q.FUR2, q.FUR, 3), _a(e, 23, 17 + c, a, t[2].lift, t[2].dx, !1, q.FUR2, q.FUR, 3), e.end(), Ga(e, 9 + o, 13 + s + c, i.eye);
		return;
	}
	if (!i.dead && t === "up") {
		Ka(e, i, a, c);
		return;
	}
	let l = t === "up";
	if (i.dead) {
		e.begin(null), ha(e, 16, a - 3.2, 10, 3.8, q.FUR, {
			hi: .35,
			lo: -.3
		});
		for (let t = 9; t <= 22; t++) e.over(t, a - 6, q.FUR2, 2);
		e.end(), e.begin("all", 0);
		for (let [t, n] of [
			[5, -1],
			[7, -1],
			[25, 1],
			[27, 1]
		]) e.set(t, a - 1, q.FUR, 2), e.set(t + n, a, q.FUR2, 1);
		e.end(), l || (e.begin("all", 0), e.set(14, a - 4, q.EYE, 0), e.set(15, a - 3, q.EYE, 0), e.set(18, a - 4, q.EYE, 0), e.set(17, a - 3, q.EYE, 0), e.end());
		return;
	}
	let u = +(i.walk === 0 || i.walk === 1), d = +(i.walk === 2 || i.walk === 3), f = [i.paw ? 2 : u, d];
	e.begin(null);
	for (let [t, n] of [[0, 10], [1, 19]]) for (let r = 16 + c; r <= a - f[t]; r++) for (let i = 0; i < 3; i++) e.set(n + i, r, r >= a - f[t] - 1 ? q.FUR2 : q.FUR, r >= a - f[t] - 1 ? i === 0 ? 2 : 1 : i === 0 ? 3 : i === 1 ? 2 : 1);
	if (e.end(), e.begin(null), ha(e, 16, 13 + c, 10, 6.2, q.FUR, {
		hi: .45,
		lo: -.2
	}), e.end(), e.begin(null), l) {
		for (let t = 7 + c; t <= 17 + c; t++) e.set(15, t, q.FUR2, 2), e.set(16, t, q.FUR2, t & 1 ? 3 : 1);
		e.set(16, 16 + c, q.FUR, 3), e.set(17, 17 + c, q.FUR, 2), e.set(16, 18 + c, q.FUR, 2), e.set(10, 6 + c, q.FUR, 3), e.set(11, 6 + c, q.FUR, 2), e.set(21, 6 + c, q.FUR, 2), e.set(22, 6 + c, q.FUR, 1);
	} else qa(e, 9, 22, (e) => Math.round(13 + c - 6.2 * Math.sqrt(Math.max(0, 1 - ((e + .5 - 16) / 10) ** 2))) - 1, i.flat);
	if (e.end(), l) return;
	let p = 13 + s + c;
	e.begin("all", 1), ha(e, 16, p, 6.2, 5, q.FUR, {
		hi: .35,
		lo: -.3
	}), e.set(9, p - 4, q.FUR, 3), e.set(10, p - 4, q.FUR, 2), e.set(9, p - 5, q.FUR, 2), e.set(22, p - 4, q.FUR, 1), e.set(21, p - 4, q.FUR, 2), e.set(22, p - 5, q.FUR, 1), e.end(), e.begin("below", 0);
	for (let t = 13; t <= 18; t++) e.set(t, p - 4, q.METAL, t < 16 ? 4 : 3), e.set(t, p - 3, q.METAL, t < 15 ? 3 : 2);
	e.set(14, p - 2, q.METAL, 2), e.set(17, p - 2, q.METAL, 1), e.set(15, p - 3, q.METAL, 4), e.end(), e.begin(null);
	let m = p - 1;
	if (i.eye === "shut") e.set(12, m, q.EYE, 0), e.set(13, m, q.EYE, 0), e.set(18, m, q.EYE, 0), e.set(19, m, q.EYE, 0);
	else if (i.eye === "dizzy") for (let t of [12, 18]) e.set(t, m, q.EYE, 0), e.set(t + 1, m + 1, q.EYE, 0), e.set(t + 1, m - 1, q.EYE, 0);
	else e.set(12, m, q.EYE, 2), e.set(13, m, q.EYE, 0), e.set(19, m, q.EYE, 2), e.set(18, m, q.EYE, 0), i.eye === "angry" && (e.set(12, m - 1, q.FUR, 0), e.set(19, m - 1, q.FUR, 0));
	for (let t = p + 1; t <= p + 4; t++) for (let n = 14; n <= 17; n++) (t !== p + 1 && t !== p + 4 || n !== 14 && n !== 17) && e.set(n, t, q.NOSE, t === p + 1 ? 3 : n < 16 ? 2 : 1);
	e.set(15, p + 3, q.NOSE, 0), e.set(16, p + 3, q.NOSE, 0), e.end(), e.begin("all", 0), e.set(13, p + 4, q.BONE, 3), e.set(12, p + 3, q.BONE, 4), e.set(12, p + 2, q.BONE, 4), e.set(18, p + 4, q.BONE, 2), e.set(19, p + 3, q.BONE, 3), e.set(19, p + 2, q.BONE, 3), e.end();
}
function Ya(e, t, n, r) {
	let i = r.G, a = 7.5, o = t === "side", s = t === "up";
	e.begin(null);
	for (let t = 14; t <= i; t++) e.set(7, t, q.WOOD, 3), e.set(8, t, q.WOOD, 1);
	for (let t = 5; t <= 10; t++) e.set(t, i, q.WOOD, t < 7 ? 2 : 1);
	if (e.set(6, i - 1, q.WOOD, 2), e.set(9, i - 1, q.WOOD, 1), e.end(), e.begin(null), o) e.set(7, 10, q.WOOD, 4), e.set(8, 10, q.WOOD, 2), e.set(7, 11, q.WOOD, 2), e.set(8, 11, q.WOOD, 1);
	else {
		for (let t = 2; t <= 13; t++) e.set(t, 10, q.WOOD, 3), e.set(t, 11, q.WOOD, 1);
		for (let [t, n] of [[2, 3], [13, 2]]) e.set(t, 12, q.FUR, n), e.set(t, 13, q.FUR, n - 1), e.set(t + (t < 7 ? -0 : 0), 9, q.FUR, n + 1);
	}
	e.end(), e.begin(null), ha(e, a, 14, o ? 2.8 : 4.1, 4.6, q.FUR, {
		hi: .3,
		lo: -.35
	});
	for (let t = 10; t <= 18; t++) for (let n = 3; n <= 12; n++) (n * 3 + t * 5) % 7 == 0 && e.over(n, t, q.FUR, 1);
	e.end(), e.begin(null);
	for (let t = 3; t <= 12; t++) e.over(t, 11, q.LEATHER, t < 7 ? 3 : 1), e.over(t, 17, q.LEATHER, t < 7 ? 2 : 1);
	if (!o && !s) for (let t = 11; t <= 17; t++) for (let n = 4; n <= 11; n++) {
		let r = Math.hypot(n + .5 - a, t + .5 - 14);
		if (r > 3.3) continue;
		let i = r < 1.1 ? 0 : r < 2.2 ? 1 : 2;
		e.over(n, t, i === 1 ? q.WHITE : q.SCARF, i === 1 ? n < a ? 4 : 3 : n < a ? 3 : 2);
	}
	if (o) for (let t = 12; t <= 16; t++) e.over(5, t, q.SCARF, 2);
	e.set(5, 19, q.FUR, 2), e.set(9, 19, q.FUR, 1), e.set(7, 19, q.FUR, 3), e.end(), e.begin("below", 1), ha(e, a, 5.5, o ? 3.1 : 3.5, 3.3, q.FUR3, {
		hi: .3,
		lo: -.35
	}), e.set(o ? 9 : 10, 2, q.FUR3, 2), e.set(o ? 10 : 11, 2, q.FUR3, 1), e.end(), e.begin(null);
	for (let t = 5; t <= 10; t++) e.set(t, 9, q.LEATHER, t < 7 ? 3 : 2);
	if (e.set(6, 10, q.FUR, 3), e.set(9, 10, q.FUR, 2), s) e.set(7, 5, q.FUR3, 1), e.set(7, 6, q.FUR3, 1);
	else {
		let t = o ? [5] : [5, 9];
		for (let n of t) e.set(n, 4, q.LINE, 0), e.set(n + 1, 5, q.LINE, 0), e.set(n + 1, 4, q.FUR3, 1), e.set(n, 5, q.FUR3, 1);
		o || (e.set(6, 7, q.LINE, 0), e.set(7, 7, q.FUR3, 1), e.set(8, 7, q.LINE, 0));
	}
	e.end(), (n === "hurt" || n === "dead") && La(e, -.22, i), n === "hurt2" && La(e, .22, i), n === "idle1" && La(e, .06, i);
}
function Xa(e) {
	let t = {
		torso: [32, 34],
		head: [32, 17],
		sA: [16, 25],
		sB: [48, 25],
		eA: [12, 37],
		eB: [52, 37],
		fA: [11, 47],
		fB: [53, 47],
		footA: [
			23,
			59,
			0
		],
		footB: [
			41,
			59,
			0
		],
		core: 3.4,
		heat: 3,
		eyes: 3,
		lean: 0
	}, n = (e) => {
		for (let n of [
			"torso",
			"head",
			"sA",
			"sB",
			"eA",
			"eB"
		]) t[n] = [t[n][0], t[n][1] + e];
	};
	switch (e) {
		case "idle1":
			n(1), t.fA = [11, 48], t.fB = [53, 48], t.core = 3;
			break;
		case "move0":
			t.footA = [
				23,
				57,
				2
			], n(-1), t.fA = [12, 45], t.fB = [53, 49];
			break;
		case "move1":
			n(1), t.fA = [11, 47], t.fB = [53, 47];
			break;
		case "move2":
			t.footB = [
				41,
				57,
				2
			], n(-1), t.fA = [11, 49], t.fB = [52, 45];
			break;
		case "move3":
			n(1);
			break;
		case "windup":
		case "slamWind":
			n(-1), t.eA = [13, 15], t.eB = [51, 15], t.fA = [23, 7], t.fB = [41, 7], t.heat = 4;
			break;
		case "attack":
		case "slam":
			n(5), t.head = [32, 25], t.eA = [19, 44], t.eB = [45, 44], t.fA = [26, 56], t.fB = [38, 56], t.heat = 4;
			break;
		case "sweepWind":
			t.torso = [34, 34], t.head = [33, 17], t.eA = [8, 27], t.fA = [6, 19], t.sA = [17, 24], t.heat = 4;
			break;
		case "sweep":
			t.torso = [30, 34], t.head = [31, 17], t.eA = [26, 38], t.fA = [45, 40], t.eB = [55, 34], t.fB = [57, 44], t.heat = 4;
			break;
		case "throw":
			t.eB = [53, 20], t.fB = [48, 13], t.boulder = [48, 7], t.eA = [12, 36], t.fA = [13, 46];
			break;
		case "roar":
			n(-1), t.head = [32, 15], t.eA = [8, 29], t.eB = [56, 29], t.fA = [7, 23], t.fB = [57, 23], t.core = 4.4, t.heat = 4, t.eyes = 4, t.roar = !0;
			break;
		case "hurt":
			n(-1), t.head = [33, 16], t.eA = [11, 34], t.eB = [53, 34], t.fA = [13, 41], t.fB = [51, 41], t.eyes = 2, t.lean = 1;
			break;
		case "kneel": n(10), t.head = [32, 28], t.footA = [
			22,
			59,
			0
		], t.footB = [
			42,
			60,
			0
		], t.kneel = !0, t.eA = [12, 49], t.eB = [52, 49], t.fA = [13, 57], t.fB = [51, 57], t.core = 2.4, t.heat = 2, t.eyes = 2;
	}
	return t;
}
var Za = {
	front: [
		[
			[-3, -2],
			[-7, -6],
			[-9, -7],
			[-12, -11]
		],
		[
			[3, -2],
			[6, -5],
			[10, -6]
		],
		[
			[-2, 3],
			[-5, 7],
			[-4, 10]
		],
		[
			[3, 3],
			[7, 6],
			[9, 10]
		],
		[
			[0, -4],
			[1, -8],
			[-1, -11]
		]
	],
	back: [
		[
			[-10, -8],
			[-6, -4],
			[-7, 1],
			[-3, 6]
		],
		[
			[9, -9],
			[5, -3],
			[7, 3]
		],
		[
			[0, 2],
			[2, 7],
			[0, 11]
		]
	]
};
function Qa(e, t, n, r, i, a, o) {
	let s = (e, t) => [(e[0] + t[0]) / 2, (e[1] + t[1]) / 2], c = i ? 0 : -1, l = s(t, n), u = s(n, r);
	Pa(e, l[0], l[1], 4.6, Math.max(4.6, Math.abs(n[1] - t[1]) / 2 + 2), q.STONE, a, {
		facets: 7,
		lift: c
	}), Pa(e, u[0], u[1], 4.2, Math.max(4.4, Math.abs(r[1] - n[1]) / 2 + 2), q.STONE, a + 1, {
		facets: 7,
		lift: c
	}), o > 2 && Fa(e, [
		[n[0] - 1, n[1]],
		[u[0], u[1] + 1],
		[r[0] + 1, r[1] - 3]
	], 2), Pa(e, r[0], r[1], 5.6, 5, q.STONE, a + 2, {
		facets: 8,
		lift: c
	}), e.over(Math.round(r[0] - 3), Math.round(r[1] + 2), q.STONE, 1), e.over(Math.round(r[0]), Math.round(r[1] + 3), q.STONE, 1), e.over(Math.round(r[0] + 3), Math.round(r[1] + 2), q.STONE, 1);
}
function $a(e, t, n, r, i) {
	for (let [a, o, s] of [
		[
			-5,
			-3,
			3
		],
		[
			-2,
			-5,
			4
		],
		[
			1,
			-6,
			5
		],
		[
			4,
			-4,
			4
		],
		[
			6,
			-2,
			3
		]
	]) {
		let c = Math.round(t + (i ? -a : a)), l = Math.round(n + o);
		for (let t = 0; t < s; t++) e.set(c, l - t, q.STONE, t === 0 ? 2 : 3), t < s - 2 && e.set(c + 1, l - t, q.STONE, 1);
		e.set(c, l - s, q.GLOW, r >= 3 ? 4 : 2), r >= 3 && e.set(c, l - s + 1, q.GLOW, 3);
	}
}
function eo(e, t, n) {
	let r = Xa(t), i = (e) => n ? [64 - e[0], e[1]] : e, [a, o] = i(r.torso), [s, c] = i(r.head);
	e.begin(null);
	for (let t of [r.footA, r.footB]) {
		let [n, s] = i(t);
		if (r.kneel && t === r.footB) {
			Pa(e, n, s - 2, 6, 3.2, q.STONE, 41, { facets: 6 });
			continue;
		}
		Pa(e, (n + a) / 2 + (n < a ? 1 : -1), (s + o + 12) / 2 - 1, 5, 6, q.STONE, n < 32 ? 11 : 12, {
			facets: 7,
			lift: -1
		}), Pa(e, n, s, 6.2, 3.4, q.STONE, n < 32 ? 13 : 14, { facets: 6 });
	}
	e.end();
	let l = [[
		r.sA,
		r.eA,
		r.fA,
		21
	], [
		r.sB,
		r.eB,
		r.fB,
		25
	]].map(([e, t, n, r]) => [
		i(e),
		i(t),
		i(n),
		r
	]);
	e.begin(null), Pa(e, a, o + 12, 11, 4.5, q.STONE, 5, {
		facets: 7,
		lift: -1
	}), Pa(e, a, o, 15.5, 13, q.STONE, 7, {
		facets: 10,
		face: .62
	}), e.line2(a - 9, o - 4, a - 5, o + 8, q.STONE, 0), e.line2(a + 9, o - 5, a + 6, o + 7, q.STONE, 0), e.end(), e.begin(null);
	for (let t of Za[n ? "back" : "front"]) Fa(e, t.map(([e, t]) => [a + e, o + t]), r.heat >= 3 ? 3 : 2);
	if (n) for (let t = 0; t < 4; t++) {
		let n = o - 9 + t * 5;
		e.set(a, n, q.STONE, 4), e.set(a, n + 1, q.STONE, 3), e.set(a + 1, n + 1, q.STONE, 1), e.set(a - 1, n + 2, q.STONE, 3);
	}
	else {
		let t = r.core;
		for (let n = Math.floor(o - t - 1); n <= Math.ceil(o + t + 1); n++) for (let r = Math.floor(a - t - 1); r <= Math.ceil(a + t + 1); r++) {
			let i = Math.hypot(r + .5 - a, n + .5 - o + .3);
			i > t + .6 || e.set(r, n, i > t - .4 ? q.STONE : q.GLOW, i > t - .4 ? 0 : i < t * .35 ? 4 : i < t * .7 ? 3 : 2);
		}
	}
	e.end(), e.begin(null);
	for (let [t, n, i, a] of l) Qa(e, t, n, i, t[0] < 32, a, r.heat);
	e.end(), e.begin(null);
	for (let [t, , , n] of l) Pa(e, t[0], t[1], 7.2, 6.4, q.STONE, n + 9, {
		facets: 8,
		face: .5
	});
	if (e.end(), e.begin("all", 0), Pa(e, s, c, 6.4, 5.6, q.STONE, 31, { facets: 7 }), e.end(), e.begin(null), $a(e, s, c - 3, r.heat, n), !n) {
		let t = Math.round(c), n = r.eyes;
		for (let r of [Math.round(s - 3), Math.round(s + 1)]) e.set(r, t, q.GLOW, n), e.set(r + 1, t, q.GLOW, Math.max(2, n - 1));
		if (r.roar) for (let n = Math.round(s - 2); n <= Math.round(s + 1); n++) e.set(n, t + 3, q.GLOW, 3);
		else e.set(Math.round(s - 1), t + 3, q.STONE, 0);
	}
	if (e.end(), r.boulder) {
		e.begin("all", 0);
		let [t, n] = i(r.boulder);
		Pa(e, t, n, 5, 4.4, q.STONE, 51, {
			facets: 7,
			lift: 1
		}), Fa(e, [
			[t - 2, n],
			[t + 1, n + 1],
			[t + 2, n - 2]
		], 2), e.end();
	}
}
function to(e, t) {
	let n = Xa(t), r = n.torso[1] - 34, i = 34 + (n.lean ?? 0) * 2, a = 35 + r, o = 23 + (n.lean ?? 0) * 2 + (t === "slam" || t === "attack" ? -4 : 0), s = n.head[1] + 5 + (t === "roar" ? -2 : 0), c = no(t, "near", r), l = no(t, "far", r);
	e.begin(null);
	let u = n.kneel ? [38, 59] : [38 - (t === "move2" ? -2 : 0), 59 - (n.footB[2] ?? 0)];
	Pa(e, 38, (u[1] + a + 12) / 2, 5, 6, q.STONE, 12, {
		facets: 7,
		lift: -1
	}), Pa(e, u[0] - 2, u[1], 6.4, 3.2, q.STONE, 14, {
		facets: 6,
		lift: -1
	}), Qa(e, l.s, l.e, l.f, !1, 25, n.heat), e.end(), e.begin(null), Pa(e, i + 1, a + 12, 9, 4.5, q.STONE, 5, {
		facets: 7,
		lift: -1
	}), Pa(e, i, a, 11.5, 13, q.STONE, 7, {
		facets: 9,
		face: .6
	});
	for (let t = 0; t < 4; t++) {
		let n = a - 9 + t * 5;
		e.get(i + 9, n) && (e.set(i + 10, n, q.STONE, 3), e.set(i + 11, n + 1, q.STONE, 2), e.set(i + 10, n + 1, q.STONE, 1));
	}
	e.end(), e.begin(null), Fa(e, [
		[i - 9, a - 1],
		[i - 5, a + 2],
		[i - 6, a + 7],
		[i - 2, a + 10]
	], n.heat >= 3 ? 3 : 2), Fa(e, [
		[i - 4, a - 8],
		[i, a - 5],
		[i + 3, a - 7]
	], 2);
	let d = Math.max(1.4, n.core - 1.6);
	for (let t = Math.floor(a - d); t <= Math.ceil(a + d); t++) for (let n = Math.floor(i - 11); n <= Math.floor(i - 11 + d + 1); n++) {
		let r = Math.hypot(n + .5 - (i - 10.5), t + .5 - a);
		r <= d + .3 && e.over(n, t, q.GLOW, r < d * .5 ? 3 : 2);
	}
	e.end(), e.begin(null);
	let f = [29 - (n.footA[2] ? 2 : 0), 59 - (n.footA[2] ?? 0)];
	Pa(e, 30, (f[1] + a + 12) / 2, 5.2, 6.2, q.STONE, 11, { facets: 7 }), Pa(e, f[0] - 2, f[1], 6.6, 3.4, q.STONE, 13, { facets: 6 }), e.end(), e.begin("all", 0), Pa(e, o, s, 6, 5.4, q.STONE, 31, { facets: 7 }), e.end(), e.begin(null), $a(e, o + 1, s - 3, n.heat, !1), e.set(o - 4, s, q.GLOW, n.eyes), e.set(o - 3, s, q.GLOW, Math.max(2, n.eyes - 1)), n.roar && (e.set(o - 5, s + 3, q.GLOW, 3), e.set(o - 4, s + 3, q.GLOW, 3)), e.end(), e.begin(null), Qa(e, c.s, c.e, c.f, !0, 21, n.heat), Pa(e, c.s[0], c.s[1], 6.8, 6.2, q.STONE, 30, {
		facets: 8,
		face: .5
	}), e.end(), t === "throw" && (e.begin("all", 0), Pa(e, c.f[0] + 1, c.f[1] - 6, 5, 4.4, q.STONE, 51, {
		facets: 7,
		lift: 1
	}), e.end());
}
function no(e, t, n) {
	let r = t === "near", i = r ? [30, 26 + n] : [37, 25 + n], a = {
		idle0: r ? [[27, 37], [24, 47]] : [[40, 36], [41, 46]],
		idle1: r ? [[27, 37], [24, 48]] : [[40, 36], [41, 47]],
		move0: r ? [[26, 36], [22, 45]] : [[41, 36], [43, 47]],
		move1: r ? [[27, 37], [24, 47]] : [[40, 36], [41, 46]],
		move2: r ? [[28, 37], [27, 48]] : [[39, 36], [38, 45]],
		move3: r ? [[27, 37], [24, 47]] : [[40, 36], [41, 46]],
		slamWind: r ? [[23, 17], [17, 9]] : [[31, 15], [25, 8]],
		slam: r ? [[20, 44], [13, 55]] : [[28, 43], [20, 55]],
		sweepWind: r ? [[40, 30], [48, 24]] : [[42, 34], [44, 44]],
		sweep: r ? [[19, 33], [9, 36]] : [[40, 36], [42, 46]],
		throw: r ? [[38, 18], [42, 14]] : [[40, 36], [41, 46]],
		roar: r ? [[21, 26], [13, 20]] : [[44, 26], [52, 21]],
		hurt: r ? [[29, 35], [28, 43]] : [[42, 34], [45, 41]],
		kneel: r ? [[24, 48], [18, 57]] : [[36, 47], [32, 57]]
	}, o = e === "windup" ? "slamWind" : e === "attack" ? "slam" : e, [s, c] = a[o] ?? a.idle0, l = o === "slam" || o === "kneel" ? 0 : n;
	return {
		s: i,
		e: [s[0], s[1] + l * 0],
		f: [c[0], c[1] + 0]
	};
}
function ro(e, t) {
	let n = t === "side" ? [
		[
			32,
			56,
			12,
			6,
			1
		],
		[
			22,
			58,
			7,
			4.5,
			2
		],
		[
			42,
			57,
			8,
			5,
			3
		],
		[
			30,
			49,
			8,
			5.5,
			4
		],
		[
			38,
			50,
			6,
			4.5,
			5
		],
		[
			26,
			44,
			6,
			5,
			6
		],
		[
			47,
			60,
			4,
			2.6,
			7
		]
	] : [
		[
			32,
			57,
			13,
			5.5,
			1
		],
		[
			19,
			58,
			7,
			4.2,
			2
		],
		[
			45,
			58,
			7.5,
			4.4,
			3
		],
		[
			27,
			50,
			8,
			5.4,
			4
		],
		[
			38,
			50,
			7.5,
			5,
			5
		],
		[
			32,
			43,
			6,
			5,
			6
		],
		[
			12,
			60,
			3.5,
			2.2,
			7
		],
		[
			53,
			60,
			3.8,
			2.4,
			8
		]
	];
	e.begin(null);
	for (let [t, r, i, a, o] of n) Pa(e, t, r, i, a, q.STONE, 60 + o, {
		facets: 7,
		lift: -1
	});
	e.end(), e.begin(null), Fa(e, [
		[24, 55],
		[29, 57],
		[33, 54]
	], 2), Fa(e, [[36, 52], [40, 55]], 1), t !== "up" && (e.set(31, 43, q.GLOW, 2), e.set(32, 43, q.GLOW, 3), e.set(32, 44, q.GLOW, 2));
	for (let [t, n] of [
		[20, 57],
		[44, 56],
		[28, 49]
	]) e.set(t, n, q.GLOW, 2);
	e.end();
}
function io(e, t, n) {
	n === "dead" ? ro(e, t) : t === "side" ? to(e, n) : eo(e, n, t === "up");
}
var ao = {
	goblin: {
		preset: "goblin",
		build: "child",
		skin: "#7aa84a",
		ears: "pointed",
		face: "fierce",
		hairStyle: "bald",
		hair: "#7aa84a",
		eyes: "#f2c23a",
		beard: !1,
		hat: "none",
		cape: !1,
		weapon: "sword",
		blush: !1,
		outfit: {
			top: "#4a3226",
			bottom: "#a8885a",
			accent: "brown",
			style: "vest",
			shirt: "#7aa84a"
		},
		gear: {
			boots: "#7aa84a",
			belt: "#2a1c14",
			leather: "#3a281c"
		}
	},
	archer: {
		preset: "archer",
		build: "child",
		skin: "#6f9c46",
		face: "fierce",
		hairStyle: "short",
		hair: "#2a2a1e",
		eyes: "#e8b83a",
		beard: !1,
		hat: "hood",
		hatColor: "#6a3a28",
		cape: !1,
		weapon: "bow",
		blush: !1,
		outfit: {
			top: "#5a4a30",
			bottom: "#3a3024",
			accent: "brown",
			style: "tunic",
			shirt: "cream"
		},
		gear: {
			quiver: !0,
			boots: "#2a2018",
			leather: "#6a4428",
			belt: "#2a1c14"
		}
	},
	shaman: {
		preset: "shaman",
		build: "child",
		skin: "#7f9e50",
		face: "fierce",
		hairStyle: "bald",
		hair: "#3e5a2a",
		eyes: "#f2c23a",
		beard: !1,
		hat: "hood",
		hatColor: "#5a2446",
		feather: "#e8dcc0",
		cape: !1,
		weapon: "staff",
		blush: !1,
		outfit: {
			top: "#3e2c48",
			bottom: "#2e2236",
			accent: "#c8a060",
			style: "robe",
			shirt: "cream"
		},
		gear: {
			beads: !0,
			staffGem: "#5ee08c",
			gemGlow: !0,
			boots: "#2a1e18",
			sash: "#8a3a2a"
		}
	}
}, oo = Object.freeze({
	M: q,
	COMMON: wa,
	HUMANOID: Ta,
	HUMANOID_MOVE: Ea,
	COMBAT_POSE_NAMES: Fe,
	OUTLINE: Sa,
	makeRamps: Da,
	ramp5: Oa,
	glowRamp: ka,
	eyeRamp: Aa,
	rampForKind: ya,
	glowTexel: xa,
	blob: ha,
	fillPoly: ja,
	inPoly: Ma,
	thickLine: Na,
	rock: Pa,
	crack: Fa,
	shear: La,
	quadGait: ga,
	quadLeg: _a,
	tailChain: va,
	hash2: A
}), so = {
	slime: {
		fw: 20,
		fh: 16,
		columns: [...wa, "land"],
		aliases: {},
		spriteOptions: { blobSize: [.9, .45] },
		draw: za,
		ramps: () => Da({
			[q.GEL]: Oa([
				"#1a4a50",
				"#25807e",
				"#3fb6a8",
				"#7fe0c8",
				"#dcfff2"
			]),
			[q.FUR]: Oa([
				"#1e3a24",
				"#2f5a30",
				"#4f8238",
				"#77a845",
				"#a8cc62"
			]),
			[q.FUR2]: Oa([
				"#23502a",
				"#3a8a3a",
				"#62bc48",
				"#9ade6a",
				"#d8ff9a"
			]),
			[q.EYE]: Aa("#1a2430", "#3a4c5a")
		}, q.GEL)
	},
	goblin: {
		fw: 32,
		fh: 32,
		columns: Ta,
		humanoid: ao.goblin,
		aliases: {
			...Ea,
			windup: "wind",
			attack: "slash",
			attack2: "backhand",
			dead: "down"
		},
		spriteOptions: {}
	},
	archer: {
		fw: 32,
		fh: 32,
		columns: Ta,
		humanoid: ao.archer,
		aliases: {
			...Ea,
			windup: "aim",
			attack: "follow",
			shove: "thrust",
			dead: "down"
		},
		spriteOptions: {}
	},
	shaman: {
		fw: 32,
		fh: 32,
		columns: Ta,
		humanoid: ao.shaman,
		aliases: {
			...Ea,
			windup: "cast",
			attack: "aim",
			blink: "tuck",
			dead: "down"
		},
		spriteOptions: {}
	},
	bat: {
		fw: 20,
		fh: 20,
		columns: wa,
		aliases: {},
		spriteOptions: {
			castShadow: !1,
			blobSize: [.7, .35]
		},
		draw: Ua,
		idle: {
			poses: [
				"move0",
				"move1",
				"move2",
				"move3"
			],
			fps: 10
		},
		ramps: () => Da({
			[q.FUR]: Oa([
				"#0e0b12",
				"#1b1720",
				"#2b2632",
				"#433b4c",
				"#625870"
			]),
			[q.WING]: Oa([
				"#240a08",
				"#4e1a0e",
				"#8e3414",
				"#d0662a",
				"#f6a44a"
			]),
			[q.GLOW]: ka([
				"#6a1a06",
				"#c4400e",
				"#ff7a1e",
				"#ffb84a",
				"#fff0a8"
			]),
			[q.BONE]: Oa([
				"#8a8272",
				"#b8ae98",
				"#ddd4bc",
				"#f2ead6",
				"#ffffff"
			]),
			[q.EYE]: Aa("#3a1010", "#6a2a1a")
		}, q.FUR)
	},
	boar: {
		fw: 32,
		fh: 24,
		columns: [
			...wa,
			"charge0",
			"charge1",
			"stun"
		],
		aliases: {},
		spriteOptions: { blobSize: [1.6, .7] },
		draw: Ja,
		ramps: () => Da({
			[q.FUR]: Oa([
				"#1c1c24",
				"#32323c",
				"#4c4e5a",
				"#6c707c",
				"#9498a4"
			]),
			[q.FUR2]: Oa([
				"#0e0e14",
				"#18181f",
				"#26262f",
				"#3a3a46",
				"#50505e"
			]),
			[q.FUR3]: Oa([
				"#3a3a42",
				"#56565e",
				"#74747c",
				"#94949a",
				"#b4b4b8"
			]),
			[q.NOSE]: Oa([
				"#3a2426",
				"#6a4446",
				"#94686a",
				"#b88c8c",
				"#d8b0ac"
			]),
			[q.BONE]: Oa([
				"#7a705e",
				"#aea48a",
				"#d8ceb2",
				"#efe6cc",
				"#fffaea"
			]),
			[q.METAL]: "metal",
			[q.EYE]: Aa("#b8321e", "#e06a3a")
		}, q.FUR)
	},
	dummy: {
		fw: 16,
		fh: 24,
		columns: [...wa, "hurt2"],
		aliases: {},
		spriteOptions: { blobSize: [.7, .35] },
		draw: Ya,
		ramps: () => Da({
			[q.FUR]: Oa([
				"#6a4a18",
				"#a07a2a",
				"#d8b453",
				"#ecd488",
				"#fbefc0"
			]),
			[q.FUR3]: Oa([
				"#5a4630",
				"#86704e",
				"#b09a72",
				"#cdb994",
				"#e6d8b8"
			]),
			[q.WOOD]: "wood",
			[q.LEATHER]: Oa([
				"#2a1a10",
				"#4a3020",
				"#6e4a30",
				"#946a44",
				"#b88c5c"
			]),
			[q.SCARF]: "red",
			[q.WHITE]: "cream"
		}, q.FUR)
	},
	golem: {
		fw: 64,
		fh: 64,
		columns: [
			...wa,
			"slamWind",
			"slam",
			"sweepWind",
			"sweep",
			"throw",
			"roar",
			"kneel"
		],
		aliases: {},
		spriteOptions: { blobSize: [2.6, 1.2] },
		draw: io,
		ramps: () => Da({
			[q.STONE]: Oa([
				"#131218",
				"#23212a",
				"#373440",
				"#524e5c",
				"#77727f"
			]),
			[q.GLOW]: ka([
				"#6e1c06",
				"#c2400e",
				"#f27a22",
				"#ffba4a",
				"#fff2b0"
			])
		}, q.STONE)
	},
	drakeborn: Pr(oo),
	ashhound: Br(oo),
	wyrmcaller: Gr(oo),
	kobold: Jr(oo),
	whelp: Zr(oo),
	emberimp: ei(oo),
	dragon: fa(oo)
};
function co(e, t) {
	if (Object.hasOwn(so, e)) throw Error(`registerMonsterKind: the enemy kind "${e}" is defined twice`);
	let n = typeof t == "function" ? t(oo) : t;
	if (!(n && n.fw > 0 && n.fh > 0 && Array.isArray(n.columns) && n.aliases && n.spriteOptions && (n.humanoid || typeof n.draw == "function" && typeof n.ramps == "function"))) throw Error(`registerMonsterKind: "${e}" needs fw, fh, columns, aliases, spriteOptions and a humanoid spec or draw + ramps`);
	so[e] = n;
}
function lo(e) {
	return Object.hasOwn(so, e) ? so[e] : null;
}
function uo(e) {
	let t = Object.hasOwn(so, e) ? so[e] : null;
	if (!t) throw Error(`createEnemySheet: unknown enemy kind "${e}"`);
	if (t.humanoid) return po(e, t);
	if (t.layout) return fo(e, t);
	let { fw: n, fh: r } = t, i = t.columns.length, a = Te.length;
	if (n * i > Ca) throw Error(`createEnemySheet: "${e}" is ${n * i} px wide (${i} columns × ${n}); the most is ${Ca}`);
	let o = new Ne(n * i, r * a), s = new pa(n, r), c = t.ramps();
	Te.forEach((e, i) => {
		let a = e === "down" ? "down" : e === "up" ? "up" : "side";
		t.columns.forEach((l, u) => {
			s.clear(), t.draw(s, a, l, { G: r - 2 }), s.ox = 0, s.oy = 0, Ia(s), ma(s, c, o, u * n, i * r, e === "right");
		});
	});
	let l = {};
	t.columns.forEach((e, t) => {
		l[e] = t;
	});
	for (let [e, n] of Object.entries(t.aliases)) l[e] = l[n];
	let u = {}, d = t.idle ?? {
		poses: ["idle0", "idle1"],
		fps: 2.5
	}, f = [
		"move0",
		"move1",
		"move2",
		"move3"
	];
	Te.forEach((e, t) => {
		let n = (e) => e.map((e) => ({
			col: l[e],
			row: t
		}));
		u[`idle_${e}`] = {
			frames: n(d.poses),
			fps: d.fps,
			loop: !0
		}, u[`walk_${e}`] = {
			frames: n(f),
			fps: 8,
			loop: !0
		}, u[`run_${e}`] = {
			frames: n(f),
			fps: 13,
			loop: !0
		};
	});
	let p = o.toCanvas(), m = ba(p, `enemy:${e}`);
	return {
		texture: m,
		canvas: p,
		frameWidth: n,
		frameHeight: r,
		columns: i,
		rows: a,
		pixelsPerUnit: 16,
		anchor: [.5, 0],
		animations: u,
		name: e,
		kind: e,
		poses: l,
		spriteOptions: { ...t.spriteOptions },
		dispose() {
			m.dispose();
		}
	};
}
function fo(e, t) {
	let { fw: n, fh: r } = t, { perRow: i, strips: a } = t.layout;
	if (!(i >= 1) || n * i > Ca) throw Error(`createEnemySheet: "${e}" lays out ${i} cells of ${n} px per row; the most is ${Ca} px`);
	let o = [], s = 0, c = 0;
	for (let n of a) {
		let r = n.poses ?? t.columns, a = n.dir === "down" ? "down" : n.dir === "up" ? "up" : "side";
		r.forEach((r, c) => {
			if (!t.columns.includes(r)) throw Error(`createEnemySheet: "${e}" lays out "${r}", which is no column`);
			o.push({
				dir: n.dir,
				view: a,
				flip: n.dir === "right",
				pose: r,
				col: c % i,
				row: s + Math.floor(c / i)
			});
		}), c = Math.max(c, Math.min(i, r.length)), s += Math.ceil(r.length / i);
	}
	if (r * s > Ca) throw Error(`createEnemySheet: "${e}" is ${r * s} px tall (${s} rows × ${r}); the most is ${Ca}`);
	let l = new Ne(n * c, r * s), u = new pa(n, r), d = t.ramps(), f = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = `${e.view}|${e.pose}`, n = f.get(t);
		n ? n.push(e) : f.set(t, [e]);
	}
	for (let e of f.values()) {
		let { view: i, pose: a } = e[0];
		u.clear(), t.draw(u, i, a, { G: r - 2 }), u.ox = 0, u.oy = 0, Ia(u);
		for (let t of e) ma(u, d, l, t.col * n, t.row * r, t.flip);
	}
	let p = {};
	for (let e of o) (p[e.dir] ??= {})[e.pose] = {
		col: e.col,
		row: e.row
	};
	for (let e of Object.values(p)) for (let [n, r] of Object.entries(t.aliases)) e[r] && (e[n] = e[r]);
	let m = p.left ?? {}, h = o[0], g = (e, t) => {
		let n = Object.hasOwn(p, t) ? p[t] : null;
		return (n && Object.hasOwn(n, e) ? n[e] : null) ?? (Object.hasOwn(m, e) ? m[e] : null) ?? m.idle0 ?? {
			col: h.col,
			row: h.row
		};
	}, _ = {};
	for (let [e, t] of Object.entries(m)) _[e] = t.col;
	let v = {}, y = t.idle ?? {
		poses: ["idle0", "idle1"],
		fps: 2.5
	}, b = [
		"move0",
		"move1",
		"move2",
		"move3"
	];
	for (let e of Te) {
		let t = (t) => t.map((t) => ({ ...g(t, e) }));
		v[`idle_${e}`] = {
			frames: t(y.poses),
			fps: y.fps,
			loop: !0
		}, v[`walk_${e}`] = {
			frames: t(b),
			fps: 8,
			loop: !0
		}, v[`run_${e}`] = {
			frames: t(b),
			fps: 13,
			loop: !0
		};
	}
	let x = l.toCanvas(), S = ba(x, `enemy:${e}`);
	return {
		texture: S,
		canvas: x,
		frameWidth: n,
		frameHeight: r,
		columns: c,
		rows: s,
		pixelsPerUnit: 16,
		anchor: [.5, 0],
		animations: v,
		name: e,
		kind: e,
		poses: _,
		spriteOptions: { ...t.spriteOptions },
		cells: p,
		cell: g,
		dispose() {
			S.dispose();
		}
	};
}
function po(e, t) {
	let n = Pe(t.humanoid, { combat: !0 });
	n.texture.name = `enemy:${e}`;
	let r = { ...n.poses };
	for (let [e, i] of Object.entries(t.aliases)) r[e] = n.poses[i];
	return {
		texture: n.texture,
		canvas: n.canvas,
		frameWidth: n.frameWidth,
		frameHeight: n.frameHeight,
		columns: n.columns,
		rows: n.rows,
		pixelsPerUnit: n.pixelsPerUnit,
		anchor: n.anchor,
		animations: n.animations,
		name: e,
		kind: e,
		poses: r,
		spriteOptions: { ...t.spriteOptions },
		dispose() {
			n.dispose();
		}
	};
}
//#endregion
//#region src/engine/pixel/fx/heroFx.js
var mo = /* @__PURE__ */ e({
	FRAMES: () => ho,
	paint: () => Lo
}), ho = Object.freeze({
	heroGale: Object.freeze({
		w: 64,
		h: 32,
		n: 4,
		fps: 30
	}),
	heroBlade: Object.freeze({
		w: 40,
		h: 12,
		n: 2,
		fps: 12
	}),
	heroCyclone: Object.freeze({
		w: 96,
		h: 96,
		n: 4,
		fps: 24
	}),
	heroWave: Object.freeze({
		w: 64,
		h: 32,
		n: 4,
		fps: 24
	}),
	heroSword: Object.freeze({
		w: 40,
		h: 128,
		n: 2,
		fps: 8
	}),
	heroSigil: Object.freeze({
		w: 160,
		h: 160,
		n: 1,
		fps: 0
	}),
	heroCrack: Object.freeze({
		w: 96,
		h: 96,
		n: 1,
		fps: 0
	}),
	heroGaleLit: Object.freeze({
		w: 64,
		h: 32,
		n: 4,
		fps: 30,
		late: 2
	}),
	heroThrustLit: Object.freeze({
		w: 48,
		h: 12,
		n: 3,
		fps: 30,
		late: 2
	}),
	heroWaveLit: Object.freeze({
		w: 64,
		h: 32,
		n: 4,
		fps: 24,
		late: 2
	}),
	heroFangCrest: Object.freeze({
		w: 48,
		h: 40,
		n: 4,
		fps: 24,
		late: 2
	}),
	heroFangCrestLit: Object.freeze({
		w: 48,
		h: 40,
		n: 4,
		fps: 24,
		late: 2
	}),
	heroCut: Object.freeze({
		w: 24,
		h: 12,
		n: 3,
		fps: 30,
		late: 2
	}),
	heroBite: Object.freeze({
		w: 32,
		h: 32,
		n: 3,
		fps: 24,
		late: 2
	}),
	heroRunes: Object.freeze({
		w: 48,
		h: 16,
		n: 2,
		fps: 0,
		late: 2
	})
});
function go(e, t = 0) {
	let n = Math.imul(e | 0, 668265261) ^ Math.imul((t | 0) + 2654435769, 374761393);
	return n ^= n >>> 15, n = Math.imul(n, 739982445), n ^= n >>> 12, (n >>> 0) / 4294967296;
}
function _o(e, t, n, r, i, a, o = 1) {
	let s = Math.max(1, Math.ceil(Math.hypot(r - t, i - n) * 2)), c = (o - 1) / 2;
	for (let o = 0; o <= s; o++) {
		let l = o / s, u = t + (r - t) * l, d = n + (i - n) * l;
		if (c <= 0) e.max(u, d, a);
		else for (let t = -c; t <= c + 1e-6; t += 1) for (let n = -c; n <= c + 1e-6; n += 1) e.max(u + n, d + t, a);
	}
}
function vo(e, t, n, r, i, a, o, s, c = 0, l = 0, u = 0, d = null) {
	let f = Math.abs(o - a) * Math.max(r, i), p = Math.max(2, Math.ceil(f * 2));
	for (let f = 0; f <= p; f++) {
		let m = a + (o - a) * (f / p);
		l > 0 && (f / 2 + u) % l >= c || (!d || d(m)) && e.max(t + Math.cos(m) * r, n - Math.sin(m) * i, s);
	}
}
var yo = [
	{
		a0: .12,
		a1: 1.3,
		thick: .24
	},
	{
		a0: .08,
		a1: 2.45,
		thick: .3
	},
	{
		a0: .3,
		a1: 3.05,
		thick: .27
	},
	{
		a0: 1.65,
		a1: 3.08,
		thick: .15
	}
];
function bo(e, t, n) {
	let r = yo[t];
	n.arc(e, {
		cx: 32,
		cy: 30.5,
		rx: 31,
		ry: 29,
		lead: "left",
		...r
	});
	let i = [
		[
			.8,
			.28,
			n.L,
			0
		],
		[
			.66,
			.55,
			n.MID,
			3
		],
		[
			.52,
			.85,
			n.D,
			5
		]
	];
	for (let [n, a, o, s] of i) {
		let i = r.a1 - a, c = Math.max(r.a0 + .1, t === 3 ? r.a0 + .4 : r.a0);
		i <= c || vo(e, 32, 30.5, 31 * n, 29 * n, c, i, o, t === 3 ? 2 : 5, t === 3 ? 4 : 6, s + t * 2);
	}
	if (t >= 1) for (let i = 0; i < 5; i++) {
		let a = r.a0 + .25 + i * .45 + t * .05;
		if (a > r.a1 - .2) break;
		let o = 1.04 + .04 * ((i + t) % 2), s = 32 + Math.cos(a) * 31 * o, c = 30.5 - Math.sin(a) * 29 * o;
		e.max(s, c, t === 3 ? n.D : n.L), t >= 2 && e.max(s + 1, c + (i % 2 ? 1 : -1), n.MID);
	}
}
function xo(e, t, n) {
	for (let [t, r, i] of [
		[
			1,
			5,
			n.L
		],
		[
			1,
			6,
			n.MID
		],
		[
			2,
			4,
			n.MID
		],
		[
			2,
			5,
			n.W
		],
		[
			2,
			6,
			n.L
		],
		[
			2,
			7,
			n.D
		]
	]) e.set(t, r, i);
	for (let t = 3; t <= 8; t++) e.set(t, 5, t % 2 ? n.MID : n.L), e.set(t, 6, t % 2 ? n.D : n.MID);
	for (let t = 1; t <= 10; t++) {
		let r = +(t <= 1 || t >= 10);
		e.set(9 - r, t, t < 4 ? n.L : t > 7 ? n.D : n.MID), e.set(10 - r, t, t < 4 ? n.W : t > 7 ? n.MID : n.L);
	}
	for (let t = 11; t <= 39; t++) {
		let r = t < 31 ? 2 : Math.max(0, Math.round(2 * (39.5 - t) / 8.5));
		for (let i = 6 - r; i <= 5 + r; i++) {
			let a = i - (6 - r), o = r === 0 || a === 0 ? n.L : i === 5 ? n.W : i === 6 ? n.L : a >= 2 * r - 1 ? n.D : n.MID;
			e.set(t, i, o);
		}
	}
	if (t === 1) for (let [t, r] of [
		[26, 2],
		[26, 3],
		[26, 8],
		[26, 9],
		[24, 5],
		[25, 5],
		[27, 5],
		[28, 5],
		[25, 4],
		[27, 7]
	]) e.max(t, r, n.W);
}
function So(e, t, n) {
	let r = [
		[
			41.5,
			46.5,
			4,
			Math.PI / 8,
			1.25
		],
		[
			32.5,
			36,
			2,
			Math.PI / 4,
			1.9
		],
		[
			23.5,
			26,
			4,
			Math.PI / 8,
			.95
		]
	];
	for (let i = 0; i < 96; i++) for (let a = 0; a < 96; a++) {
		let o = a + .5 - 48, s = i + .5 - 48, c = Math.hypot(o, s), l = Math.atan2(-s, o);
		for (let o = 0; o < r.length; o++) {
			let [s, u, d, f, p] = r[o];
			if (c < s || c > u) continue;
			let m = Math.PI * 2 / d, h = (f * t + o * .7 - l) % m;
			if (h < 0 && (h += m), h > p) continue;
			let g = h / p, _ = c > u - 1.3;
			if (g > .55 && a + i + t & 1 || g > .8 && (a * 3 + i) % 4) continue;
			let v = g < .12 ? _ ? n.W : n.L : g < .4 ? _ ? n.L : n.MID : g < .7 ? n.MID : n.D;
			e.max(a, i, v);
		}
	}
	for (let r = 0; r < 10; r++) {
		let i = r * .63 + Math.PI / 8 * t + go(r, 7) * .4, a = 28 + go(r, 3) * 18, o = 48 + Math.cos(i) * a, s = 48 - Math.sin(i) * a;
		e.max(o, s, r % 3 ? n.D : n.MID), r % 4 == 0 && e.max(o - Math.sin(i), s - Math.cos(i), n.D);
	}
}
function Co(e, t, n) {
	let r = t === 3 ? .6 : 0, i = (e, t) => ((e - 32) / (31 + r)) ** 2 + ((t - 31) / (27 + r)) ** 2 <= 1, a = (e, t) => ((e - 32) / 31.5) ** 2 + ((t - 35.5) / 25.5) ** 2 <= 1, o = (e, t) => i(e, t) && !a(e, t);
	for (let r = 0; r < 31; r++) for (let a = 0; a < 64; a++) {
		let s = a + .5, c = r + .5;
		if (!o(s, c)) continue;
		let l = 0;
		for (; l < 6 && i(s, c - l - 1);) l++;
		let u = (a + t * 5) % 9 == 0, d = l === 0 ? n.W : l === 1 ? u ? n.W : n.L : l <= 3 ? n.L : l === 4 ? n.MID : n.D;
		e.set(a, r, d);
	}
	for (let [t, r] of [[21, 1], [43, -1]]) {
		let i = 0;
		for (; i < 31 && !o(t + .5, i + .5);) i++;
		for (; i < 31 && o(t + .5, i + 1.5);) i++;
		for (let a = 1; a <= 7; a++) {
			let o = a < 3 ? 1.5 : a < 5 ? 1 : a < 7 ? .5 : 0, s = t + .5 + r * Math.floor((a - 1) / 3);
			for (let t = Math.round(s - o - .5); t <= Math.round(s + o - .5); t++) {
				let o = r > 0 ? t < s - .5 : t > s - .5;
				e.set(t, i + a, a >= 6 ? n.MID : o ? n.W : n.L);
			}
		}
	}
	for (let r = 0; r < 4; r++) {
		let i = 27 + r * 3 + (t + r) % 2, a = 13 + (r * 5 + t * 3) % 4, o = 4 + (r + t) % 3;
		for (let t = 0; t < o; t++) a + t < 32 && !e.get(i, a + t) && e.set(i, a + t, t === 0 ? n.MID : n.D);
	}
}
function wo(e, t, n) {
	let r = 19.5;
	for (let t = 0; t < 8; t++) for (let i = 14; i < 26; i++) {
		let a = Math.hypot(i + .5 - r, t + .5 - 4);
		a > 3.6 || e.set(i, t, a < 1.3 ? n.W : a < 2.4 ? n.L : a < 3.1 ? n.MID : n.D);
	}
	for (let t = 8; t <= 22; t++) for (let r = 17; r <= 22; r++) {
		let i = r === 17 || r === 22, a = (t >> 1) % 2 == 0;
		e.set(r, t, i ? n.D : a ? r < 20 ? n.L : n.MID : n.D);
	}
	for (let t = 3; t <= 36; t++) {
		let i = Math.abs(t + .5 - r), a = i > 12 ? Math.round((i - 12) * .55) : 0;
		for (let r = 0; r < 3; r++) e.set(t, 24 + r + a, r === 0 ? n.L : r === 1 ? n.MID : n.D);
		i > 14.5 && e.set(t, 27 + a, n.D);
	}
	for (let t = 21; t <= 31; t++) {
		let i = 4 - Math.abs(t - 26) * .75;
		for (let a = Math.ceil(r - i); a <= Math.floor(r + i); a++) {
			let i = Math.abs(a + .5 - r) + Math.abs(t - 26) * .75;
			e.set(a, t, i < 1.2 ? n.W : i < 2.6 ? n.L : n.MID);
		}
	}
	for (let t = 31; t < 128; t++) {
		let i = t < 100 ? 7 : Math.max(0, 7 * (126.5 - t) / 26.5);
		for (let a = 0; a < 40; a++) {
			let o = a + .5 - r;
			if (Math.abs(o) > i) continue;
			let s = Math.abs(o), c = s <= 1 ? n.W : s > i - 1 ? o < 0 ? n.D : n.S : o < 0 ? s < 4 ? n.L : n.MID : s < 3 ? n.MID : n.D;
			e.set(a, t, c);
		}
	}
	for (let r = 0; r < 7; r++) {
		let i = 38 + r * 9, a = (t === 1 ? r % 2 == 0 : r % 2 == 1) ? n.W : n.S, o = r % 3, s = o === 0 ? [
			[0, 0],
			[0, 1],
			[0, 2],
			[1, 1]
		] : o === 1 ? [
			[0, 0],
			[1, 0],
			[0, 1],
			[0, 2],
			[1, 2]
		] : [
			[1, 0],
			[0, 1],
			[1, 1],
			[1, 2]
		];
		for (let [t, n] of s) e.set(19 + t, i + n, a);
	}
	if (t === 1) for (let t = 0; t < 6; t++) e.set(13 + (t >> 1), 58 + t, n.W);
	e.rim(n.S);
}
var To = [
	[
		"#.#",
		"###",
		".#.",
		".#.",
		".#."
	],
	[
		"##.",
		"#.#",
		"##.",
		"#.#",
		"##."
	],
	[
		".#.",
		"#.#",
		"###",
		"#.#",
		"#.#"
	],
	[
		"###",
		"..#",
		".#.",
		"#..",
		"###"
	],
	[
		"#..",
		"#..",
		"###",
		"#.#",
		"###"
	],
	[
		".#.",
		"###",
		".#.",
		"###",
		".#."
	]
];
function Eo(e, t) {
	for (let n = 0; n < 160; n++) for (let r = 0; r < 160; r++) {
		let i = Math.hypot(r + .5 - 80, n + .5 - 80);
		i >= 76 && i < 78.2 ? e.set(r, n, t.L) : i >= 78.2 && i < 79.4 || i >= 70 && i < 71.2 ? e.set(r, n, t.MID) : i >= 56.2 && i < 57.8 ? e.set(r, n, t.L) : i >= 27 && i < 28.2 ? e.set(r, n, t.MID) : i < 3.6 && e.set(r, n, i < 2 ? t.W : t.L);
	}
	for (let n = 0; n < 24; n++) {
		let r = n / 24 * Math.PI * 2 + .13, i = 80 + Math.cos(r) * 73.6 - 1, a = 80 - Math.sin(r) * 73.6 - 2;
		t.stamp(e, To[n % To.length].map((e) => e.replace(/#/g, n % 4 == 0 ? "L" : "M")), Math.round(i), Math.round(a));
	}
	let n = [];
	for (let e = 0; e < 6; e++) {
		let t = Math.PI / 2 + e / 6 * Math.PI * 2;
		n.push([80 + Math.cos(t) * 56, 80 - Math.sin(t) * 56]);
	}
	for (let r of [[
		0,
		2,
		4
	], [
		1,
		3,
		5
	]]) for (let i = 0; i < 3; i++) {
		let [a, o] = n[r[i]], [s, c] = n[r[(i + 1) % 3]];
		_o(e, a, o, s, c, t.L);
	}
	for (let [r, i] of n) for (let n = -3; n <= 3; n++) for (let a = -3; a <= 3; a++) {
		let o = Math.hypot(a, n);
		o <= 3.2 && e.max(r + a, i + n, o < 1.5 ? t.W : o < 2.5 ? t.L : t.MID);
	}
	for (let n = 0; n < 8; n++) {
		let r = n / 8 * Math.PI * 2, i = n % 2 ? 16 : 24;
		_o(e, 80 + Math.cos(r) * 6, 80 - Math.sin(r) * 6, 80 + Math.cos(r) * i, 80 - Math.sin(r) * i, n % 2 ? t.MID : t.W);
	}
}
function Do(e, t) {
	for (let n = 0; n < 96; n++) for (let r = 0; r < 96; r++) {
		let i = Math.hypot(r + .5 - 48, n + .5 - 48);
		i >= 8.5 && i < 10.5 ? e.set(r, n, (r + n) % 3 ? t.MID : t.D) : i < 8.5 && go(r, n) < .18 && e.set(r, n, t.D);
	}
	for (let n = 0; n < 11; n++) {
		let r = n / 11 * Math.PI * 2 + (go(n, 1) - .5) * .35, i = 26 + go(n, 2) * 20, a = 48 + Math.cos(r) * 10, o = 48 - Math.sin(r) * 10, s = 10, c = 0;
		for (; s < i;) {
			r += (go(n, 10 + c) - .5) * .7;
			let i = 3 + go(n, 30 + c) * 2, l = a + Math.cos(r) * i, u = o - Math.sin(r) * i;
			s = Math.hypot(l - 48, u - 48);
			let d = s < 22 ? t.W : s < 33 ? t.L : t.MID;
			if (_o(e, a, o, l, u, d, s < 18 ? 2 : 1), c === 3 && n % 2 == 0) {
				let i = r + (n % 4 ? .65 : -.65), a = 7 + go(n, 50) * 6;
				_o(e, l, u, l + Math.cos(i) * a, u - Math.sin(i) * a, t.MID);
			}
			a = l, o = u, c++;
		}
	}
	for (let n = 0; n < 26; n++) {
		let r = go(n, 70) * Math.PI * 2, i = 12 + go(n, 71) * 32;
		e.max(48 + Math.cos(r) * i, 48 - Math.sin(r) * i, t.D);
	}
}
function Oo(e, t, n) {
	let r = yo[t];
	for (let t = 0; t < 32; t++) for (let i = 0; i < 64; i++) {
		let a = (i + .5 - 32) / 31, o = (30.5 - (t + .5)) / 29, s = Math.hypot(a, o), c = Math.atan2(o, a);
		if (c < r.a0 || c > r.a1 || o < -.05) continue;
		let l = (c - r.a0) / Math.max(1e-6, r.a1 - r.a0), u = r.thick * (.35 + .65 * (1 - l));
		s > 1 || s < 1 - u || s <= 1 - u * .35 || l >= .55 || e.set(i, t, l < .3 ? n.W : n.L);
	}
	let i = r.a1 - .28, a = Math.max(r.a0 + .1, t === 3 ? r.a0 + .4 : r.a0);
	i > a && vo(e, 32, 30.5, 24.8, 29 * .8, a, i, n.L, t === 3 ? 2 : 5, t === 3 ? 4 : 6, t * 2, (e) => e < a + .9);
}
function ko(e, t, n) {
	let r = [
		26,
		44,
		40
	][t], i = [
		20,
		3,
		7
	][t];
	for (let a = 0; a < r; a++) {
		let o = a / r, s = Math.max(0, (o < .85 ? 1 + Math.round(3 * o) : Math.round(4 * (1 - o) / .15)) - +(t === 2));
		if (!(t === 2 && o < .35 && a % 4 == 1)) for (let t = -s; t <= s; t++) Math.abs(t) <= Math.max(0, s - 2) ? e.set(i + a, 6 + t, o > .3 ? n.W : n.L) : o > .85 && Math.abs(t) < s && e.set(i + a, 6 + t, n.L);
	}
}
function Ao(e, t, n) {
	let r = t === 3 ? .6 : 0, i = (e, t) => ((e - 32) / (31 + r)) ** 2 + ((t - 31) / (27 + r)) ** 2 <= 1, a = (e, t) => ((e - 32) / 31.5) ** 2 + ((t - 35.5) / 25.5) ** 2 <= 1, o = (e, t) => i(e, t) && !a(e, t);
	for (let r = 0; r < 31; r++) for (let a = 0; a < 64; a++) {
		let s = a + .5, c = r + .5;
		if (!o(s, c)) continue;
		let l = 0;
		for (; l < 2 && i(s, c - l - 1);) l++;
		if (l > 1) continue;
		let u = (a + t * 5) % 9 == 0;
		e.set(a, r, l === 0 || u ? n.W : n.L);
	}
	for (let [t, r] of [[21, 1], [43, -1]]) {
		let i = 0;
		for (; i < 31 && !o(t + .5, i + .5);) i++;
		for (; i < 31 && o(t + .5, i + 1.5);) i++;
		for (let a = 1; a < 6; a++) {
			let o = a < 3 ? 1.5 : a < 5 ? 1 : a < 7 ? .5 : 0, s = t + .5 + r * Math.floor((a - 1) / 3);
			for (let t = Math.round(s - o - .5); t <= Math.round(s + o - .5); t++) (r > 0 ? t < s - .5 : t > s - .5) && e.set(t, i + a, n.W);
		}
	}
}
var jo = [
	[
		[
			25,
			4.5,
			-6
		],
		[
			34,
			5.5,
			2.5
		],
		[
			25,
			4.5,
			6
		]
	],
	[
		[
			27,
			4.5,
			-7
		],
		[
			32,
			5.5,
			3
		],
		[
			24,
			4.5,
			5.5
		]
	],
	[
		[
			24,
			4.5,
			-5.5
		],
		[
			35,
			5.5,
			2
		],
		[
			27,
			4.5,
			7
		]
	],
	[
		[
			12,
			4,
			-8
		],
		[
			15,
			5,
			4
		],
		[
			11,
			4,
			8
		]
	]
];
function Mo(e, t, n, r) {
	let i = [
		12,
		24,
		36
	];
	for (let a = 0; a < 3; a++) {
		let [o, s, c] = jo[t][a];
		for (let l = 38; l >= 38 - o; l--) {
			let u = (38 - l) / o;
			if (t === 3 && u > .45 && go(a * 97 + l, 3) < .35) continue;
			let d = i[a] + c * u * u, f = s * (1 - u) ** .8;
			if (f < .3 && u < .97) continue;
			let p = Math.round(d - f), m = Math.max(p, Math.round(d + f) - 1);
			for (let t = p; t <= m; t++) {
				let i = t === p, a = t === m && m > p, o = u > .86;
				if (r) {
					(i || o && !a) && e.set(t, l, i && u > .2 ? n.W : n.L);
					continue;
				}
				let s = (t - p) / Math.max(1, m - p);
				e.set(t, l, i ? n.L : a ? n.S : o ? n.L : s < .45 ? n.MID : n.D);
			}
		}
	}
	if (!r) for (let r = 3; r < 45; r++) {
		let i = 37 - Math.round(2 * go(r >> 1, 11 + t));
		for (let t = i; t <= 39; t++) e.get(r, t) || e.set(r, t, t === i ? n.MID : t > 38 ? n.S : n.D);
	}
}
function No(e, t, n) {
	let r = -8.5, i = 513.25, a = Math.sqrt(i), o = [
		.9,
		1.7,
		.85
	][t];
	for (let s = 0; s < 12; s++) for (let c = 0; c < 24; c++) {
		let l = c + .5 - 1.5, u = s + .5 - 10, d = (l * 21 + u * r) / i;
		if (d < 0 || d > 1 || t === 0 && (d < .22 || d > .78) || t === 2 && Math.floor(d * 9) % 3 == 1) continue;
		let f = Math.abs(l * r - u * 21) / a, p = o * Math.sin(Math.PI * d);
		f > p || e.set(c, s, f < p * .45 ? n.W : n.L);
	}
}
function Po(e, t, n) {
	let r = [[
		5,
		4,
		27,
		28,
		1
	], [
		27,
		4,
		5,
		28,
		-1
	]], i = [
		1.1,
		2,
		1.1
	][t];
	for (let [a, o, s, c, l] of r) {
		let r = s - a, u = c - o, d = Math.hypot(r, u), f = -u / d * l, p = r / d * l;
		for (let s = 0; s <= 90; s++) {
			let c = s / 90;
			if (t === 0 && c > .62) break;
			if (t === 2 && Math.floor(c * 10) % 3 == 2) continue;
			let l = 3.2 * Math.sin(Math.PI * c), d = a + r * c + f * l, m = o + u * c + p * l, h = i * Math.sin(Math.PI * Math.min(1, c * (t === 0 ? 1.6 : 1))) ** .7;
			for (let t = -2; t <= 2; t++) for (let r = -2; r <= 2; r++) {
				let i = Math.hypot(r, t);
				i > h + .25 || e.max(d + r, m + t, i < h * .5 ? n.W : i < h ? n.L : n.MID);
			}
		}
	}
}
var Fo = Object.freeze({
	cx: 24,
	cy: 79,
	rOut: 78.5,
	rIn: 68,
	rGlyph: 76.5,
	spacing: 19.3
});
function Io(e, t, n) {
	let r = Fo;
	for (let i = 0; i < 16; i++) for (let a = 0; a < 48; a++) {
		let o = a + .5 - r.cx, s = r.cy - (i + .5), c = Math.hypot(o, s);
		if (c > r.rOut || c < r.rIn) continue;
		let l = c > r.rOut - 1 || c < r.rIn + 1, u = Math.atan2(o, s) * r.rGlyph, d = r.rGlyph - c, f = !1;
		for (let e = 0; e < 3; e++) {
			let t = u - (e - 1) * r.spacing + 3;
			t < 0 || t >= 6 || d < 0 || d >= 10 || (f = To[(e * 2 + 1) % To.length][Math.floor(d / 2)][Math.floor(t / 2)] === "#");
		}
		t === 0 ? e.set(a, i, f || l ? n.D : n.S) : e.set(a, i, f ? n.W : l ? n.L : n.D);
	}
}
function Lo(e, t, n, r) {
	switch (e) {
		case "heroGale":
			bo(t, n, r);
			break;
		case "heroBlade":
			xo(t, n, r);
			break;
		case "heroCyclone":
			So(t, n, r);
			break;
		case "heroWave":
			Co(t, n, r);
			break;
		case "heroSword":
			wo(t, n, r);
			break;
		case "heroSigil":
			Eo(t, r);
			break;
		case "heroCrack":
			Do(t, r);
			break;
		case "heroGaleLit":
			Oo(t, n, r);
			break;
		case "heroThrustLit":
			ko(t, n, r);
			break;
		case "heroWaveLit":
			Ao(t, n, r);
			break;
		case "heroFangCrest":
			Mo(t, n, r, !1);
			break;
		case "heroFangCrestLit":
			Mo(t, n, r, !0);
			break;
		case "heroCut":
			No(t, n, r);
			break;
		case "heroBite":
			Po(t, n, r);
			break;
		case "heroRunes": Io(t, n, r);
	}
}
//#endregion
//#region src/engine/pixel/fx/partyFx.js
var Ro = /* @__PURE__ */ e({
	FRAMES: () => zo,
	RESERVED: () => Bo,
	paint: () => hs
}), zo = Object.freeze({
	partyGlyphHoly: Object.freeze({
		w: 128,
		h: 128,
		n: 1,
		fps: 0
	}),
	partyGlyphFrost: Object.freeze({
		w: 128,
		h: 128,
		n: 1,
		fps: 0
	}),
	partyGlyphWard: Object.freeze({
		w: 96,
		h: 96,
		n: 1,
		fps: 0
	}),
	partyRing: Object.freeze({
		w: 96,
		h: 96,
		n: 2,
		fps: 0
	}),
	partyCrack: Object.freeze({
		w: 96,
		h: 96,
		n: 1,
		fps: 0
	}),
	partySwirl: Object.freeze({
		w: 80,
		h: 80,
		n: 2,
		fps: 6
	}),
	partyPillar: Object.freeze({
		w: 24,
		h: 96,
		n: 4,
		fps: 0
	}),
	partyDome: Object.freeze({
		w: 64,
		h: 40,
		n: 2,
		fps: 8
	}),
	partySunburst: Object.freeze({
		w: 32,
		h: 32,
		n: 4,
		fps: 0
	}),
	partyRockSpike: Object.freeze({
		w: 16,
		h: 24,
		n: 4,
		fps: 0
	}),
	partyWardRing: Object.freeze({
		w: 24,
		h: 24,
		n: 1,
		fps: 0
	}),
	partyHolyOrb: Object.freeze({
		w: 16,
		h: 16,
		n: 2,
		fps: 12
	}),
	partyIceLance: Object.freeze({
		w: 24,
		h: 8,
		n: 2,
		fps: 10,
		late: !0
	}),
	partyIceLanceLit: Object.freeze({
		w: 24,
		h: 8,
		n: 2,
		fps: 10,
		late: !0
	}),
	partyIceShard: Object.freeze({
		w: 10,
		h: 10,
		n: 4,
		fps: 0,
		late: !0
	}),
	partyIceShardLit: Object.freeze({
		w: 10,
		h: 10,
		n: 4,
		fps: 0,
		late: !0
	}),
	partyIceFlake: Object.freeze({
		w: 9,
		h: 9,
		n: 2,
		fps: 0,
		late: !0
	}),
	partyIceMist: Object.freeze({
		w: 40,
		h: 16,
		n: 3,
		fps: 0,
		late: !0
	}),
	partyIceGlow: Object.freeze({
		w: 56,
		h: 56,
		n: 1,
		fps: 0,
		late: !0
	}),
	partyIceBokeh: Object.freeze({
		w: 10,
		h: 10,
		n: 1,
		fps: 0,
		late: !0
	}),
	partyIceShell: Object.freeze({
		w: 30,
		h: 38,
		n: 2,
		fps: 0,
		late: !0
	}),
	partyIceShellLit: Object.freeze({
		w: 30,
		h: 38,
		n: 2,
		fps: 0,
		late: !0
	})
}), Bo = Object.freeze({
	partyFrostFloor: Object.freeze({
		w: 64,
		h: 64,
		n: 1
	}),
	partyIceSpike: Object.freeze({
		w: 16,
		h: 32,
		n: 3
	}),
	partyFrostLance: Object.freeze({
		w: 24,
		h: 8,
		n: 2
	})
}), J = Math.PI * 2;
function Y(e, t, n, r, i, a, o) {
	let s = Math.max(0, Math.floor(t - r - i)), c = Math.min(e.w - 1, Math.ceil(t + r + i)), l = Math.max(0, Math.floor(n - r - i)), u = Math.min(e.h - 1, Math.ceil(n + r + i));
	for (let d = l; d <= u; d++) for (let l = s; l <= c; l++) {
		let s = l + .5 - t, c = d + .5 - n;
		if (!(Math.abs(Math.hypot(s, c) - r) > i / 2)) {
			if (o) {
				let e = Math.atan2(-c, s);
				if (e < 0 && (e += J), !o(e)) continue;
			}
			e.max(l, d, a);
		}
	}
}
function Vo(e, t, n, r, i, a, o) {
	let s = Math.max(0, Math.floor(Math.min(t, r) - a)), c = Math.min(e.w - 1, Math.ceil(Math.max(t, r) + a)), l = Math.max(0, Math.floor(Math.min(n, i) - a)), u = Math.min(e.h - 1, Math.ceil(Math.max(n, i) + a)), d = r - t, f = i - n, p = d * d + f * f || 1e-9;
	for (let r = l; r <= u; r++) for (let i = s; i <= c; i++) {
		let s = i + .5 - t, c = r + .5 - n, l = Math.max(0, Math.min(1, (s * d + c * f) / p));
		Math.hypot(s - d * l, c - f * l) <= a / 2 && e.max(i, r, o);
	}
}
var Ho = (e, t, n, r) => [e + Math.cos(r) * n, t - Math.sin(r) * n];
function Uo(e, t, n, r, i, a, o) {
	let [s, c] = Ho(t, t, n, i), [l, u] = Ho(t, t, r, i);
	Vo(e, s, c, l, u, a, o);
}
function Wo(e, t, n, r) {
	for (let i = 0; i < t.length; i++) {
		let a = t[i], o = t[(i + 1) % t.length];
		Vo(e, a[0], a[1], o[0], o[1], n, r);
	}
}
function Go(e, t, n) {
	let r = Infinity, i = -Infinity, a = Infinity, o = -Infinity;
	for (let [e, n] of t) r = Math.min(r, e), i = Math.max(i, e), a = Math.min(a, n), o = Math.max(o, n);
	for (let s = Math.max(0, Math.floor(a)); s <= Math.min(e.h - 1, Math.ceil(o)); s++) for (let a = Math.max(0, Math.floor(r)); a <= Math.min(e.w - 1, Math.ceil(i)); a++) {
		let r = !1;
		for (let e = 0, n = t.length - 1; e < t.length; n = e++) {
			let [i, o] = t[e], [c, l] = t[n];
			o > s + .5 != l > s + .5 && a + .5 < (c - i) * (s + .5 - o) / (l - o) + i && (r = !r);
		}
		if (!r) continue;
		let i = n(a, s);
		i != null && e.set(a, s, i);
	}
}
function Ko(e, t, n) {
	let r = Math.imul(e | 0, 668265261) ^ Math.imul(t | 0, 374761393) ^ Math.imul(n | 0, 2654435761);
	return r = Math.imul(r ^ r >>> 15, 2246822507), r ^= r >>> 13, (r >>> 0) % 10007 / 10007;
}
function qo(e, t) {
	Y(e, 64, 64, 62, 1.7, t.W), Y(e, 64, 64, 54.5, 1.2, t.L);
	for (let n = 0; n < 16; n++) {
		let r = n / 16 * J + J / 32, i = Math.cos(r), a = -Math.sin(r), o = -a, s = i, c = (e, t) => [64 + i * (58.2 + e) + o * t, 64 + a * (58.2 + e) + s * t], l = n % 3;
		if (l === 0) {
			let [n, r] = [c(-2.2, 0), c(2.2, 0)];
			Vo(e, n[0], n[1], r[0], r[1], 1.1, t.W);
			let [i, a] = [c(.4, -1.8), c(.4, 1.8)];
			Vo(e, i[0], i[1], a[0], a[1], 1, t.L);
		} else if (l === 1) Wo(e, [
			c(-2.2, 0),
			c(0, 1.8),
			c(2.2, 0),
			c(0, -1.8)
		], 1, t.L);
		else {
			let [n, r] = [c(-1.6, -1.1), c(1.6, -1.1)];
			Vo(e, n[0], n[1], r[0], r[1], 1, t.MID);
			let [i, a] = [c(-1.6, 1.1), c(1.6, 1.1)];
			Vo(e, i[0], i[1], a[0], a[1], 1, t.MID);
		}
	}
	Y(e, 64, 64, 44, 1.2, t.L);
	for (let n of [0, Math.PI / 4]) Wo(e, [
		0,
		1,
		2,
		3
	].map((e) => Ho(64, 64, 44, n + e * Math.PI / 2)), 1, t.MID);
	for (let n = 0; n < 16; n++) {
		let r = n / 16 * J;
		Uo(e, 64, 24, n % 2 ? 33 : 40, r, n % 2 ? 1 : 1.3, n % 2 ? t.MID : t.L);
	}
	Y(e, 64, 64, 22, 1.5, t.W), Y(e, 64, 64, 12, 1.2, t.L);
	for (let n = 0; n < 4; n++) Uo(e, 64, 3.5, 10, n * Math.PI / 2, 1.3, t.W);
	Y(e, 64, 64, 3, 1.2, t.W);
}
function Jo(e, t) {
	Y(e, 64, 64, 62, 1.5, t.W), Y(e, 64, 64, 58, 1.2, t.MID, (e) => e / J * 72 % 1 < .42), Wo(e, [
		0,
		1,
		2,
		3,
		4,
		5
	].map((e) => Ho(64, 64, 54, Math.PI / 6 + e * Math.PI / 3)), 1.2, t.L);
	for (let n = 0; n < 6; n++) {
		let r = n * Math.PI / 3;
		Uo(e, 64, 8, 50, r, 1.4, t.W);
		for (let [n, i, a] of [
			[
				20,
				10,
				t.L
			],
			[
				33,
				8,
				t.L
			],
			[
				43,
				5,
				t.MID
			]
		]) {
			let [t, o] = Ho(64, 64, n, r);
			for (let n of [-1, 1]) {
				let s = r + Math.PI / 3 * n;
				Vo(e, t, o, t + Math.cos(s) * i, o - Math.sin(s) * i, 1.1, a);
			}
		}
		let i = (e, t) => Ho(64, 64, e, r + t);
		Wo(e, [
			i(53, 0),
			i(50, .05),
			i(47, 0),
			i(50, -.05)
		], 1, t.W), Uo(e, 64, 14, 27, r + Math.PI / 6, 1, t.MID);
	}
	Wo(e, [
		0,
		1,
		2,
		3,
		4,
		5
	].map((e) => Ho(64, 64, 11, e * Math.PI / 3)), 1.2, t.L), Y(e, 64, 64, 4, 1.2, t.W);
}
function Yo(e, t) {
	Y(e, 48, 48, 46, 1.6, t.W), Y(e, 48, 48, 39.5, 1.1, t.L);
	for (let n = 0; n < 24; n++) Uo(e, 48, 39.5, 46, n / 24 * J, 1, t.MID);
	Y(e, 48, 48, 42.8, 1, t.D, (e) => e / J * 48 % 1 < .5);
	for (let n = 0; n < 6; n++) {
		let r = n / 6 * J + J / 12, i = Math.cos(r), a = -Math.sin(r), o = -a, s = i, c = (e, t) => [48 + i * (28 + e) + o * t, 48 + a * (28 + e) + s * t];
		Wo(e, [
			c(-4.5, -3.2),
			c(-4.5, 3.2),
			c(1, 3.4),
			c(5.5, 0),
			c(1, -3.4)
		], 1.1, t.L);
		let [l, u] = [c(-3.5, 0), c(4, 0)];
		Vo(e, l[0], l[1], u[0], u[1], 1, t.MID);
	}
	Y(e, 48, 48, 18, 1.3, t.L), Wo(e, [
		[42, 41],
		[54, 41],
		[54, 47],
		[48, 56],
		[42, 47]
	], 1.4, t.W), Vo(e, 48, 42, 48, 53, 1, t.L), Vo(e, 43, 45, 53, 45, 1, t.L);
}
function Xo(e, t) {
	Y(e, 12, 12, 11, 1.3, t.W), Y(e, 12, 12, 8.4, 1, t.MID, (e) => e / J * 12 % 1 < .6);
	for (let n = 0; n < 4; n++) Uo(e, 12, 8.6, 11, n / 4 * J + J / 8, 1.1, t.L);
}
function Zo(e, t, n) {
	if (t === 0) {
		Y(e, 48, 48, 45.5, 1.6, n.W), Y(e, 48, 48, 43.7, 1.6, n.L), Y(e, 48, 48, 42, 1.4, n.MID, (e) => e / J * 40 % 1 < .7);
		for (let t = 0; t < 40; t++) {
			let r = t / 40 * J + Ko(t, 1, 7) * .08;
			Uo(e, 48, 33 + Ko(t, 2, 7) * 4, 41, r, 1, t % 3 == 0 ? n.L : n.D);
		}
	} else {
		Y(e, 48, 48, 46, 1.3, n.L, (e) => e / J * 14 % 1 < .72), Y(e, 48, 48, 44.2, 1.1, n.D, (e) => e / J * 20 % 1 < .5);
		for (let t = 0; t < 60; t++) {
			let r = t / 60 * J, [i, a] = Ho(48, 48, 36 + Ko(t, 3, 9) * 8, r);
			e.max(i, a, n.D);
		}
	}
}
function Qo(e, t) {
	Y(e, 48, 48, 6.5, 2.4, t.L), Y(e, 48, 48, 4, 1.4, t.W);
	for (let n = 0; n < 9; n++) {
		let r = n / 9 * J + Ko(n, 4, 1) * .4, i = 48 + Math.cos(r) * 6.5, a = 48 - Math.sin(r) * 6.5, o = 28 + Ko(n, 5, 1) * 14, s = 6.5, c = 3.4, l = 0;
		for (; s < o;) {
			let u = 3 + Ko(n, l, 2) * 2.5;
			r += (Ko(n, l, 3) - .5) * .7;
			let d = i + Math.cos(r) * u, f = a - Math.sin(r) * u;
			if (Vo(e, i, a, d, f, c, c > 2.2 ? t.L : t.MID), l % 3 == 2 && s < o - 8) {
				let i = r + (Ko(n, l, 4) < .5 ? -.8 : .8), a = 4 + Ko(n, l, 5) * 4;
				Vo(e, d, f, d + Math.cos(i) * a, f - Math.sin(i) * a, 1, t.D);
			}
			i = d, a = f, s = Math.hypot(i - 48, a - 48), c = Math.max(1.4, c - .22), l++;
		}
	}
}
function $o(e, t, n) {
	let r = J / 10 * t;
	for (let t = 0; t < 5; t++) {
		let i = t / 5 * J + r, a = 10 + t % 2 * 4, o = 2.2 + t % 3 * .4;
		for (let t = 0; t <= 1; t += .004) {
			let r = i + t * o, [s, c] = Ho(40, 40, a + t * 26, r), l = t > .82 ? n.W : t > .55 ? n.L : t > .28 ? n.MID : n.D;
			t < .28 && Math.floor(t * 80) % 2 || (e.max(s, c, l), t > .2 && e.max(s + Math.cos(r + Math.PI / 2) * .9, c - Math.sin(r + Math.PI / 2) * .9, t > .6 ? n.L : n.MID));
		}
	}
	for (let r = 0; r < 26; r++) {
		let i = Ko(r, t, 11) * J, [a, o] = Ho(40, 40, 6 + Ko(r, t, 12) * 32, i);
		e.max(a, o, r % 4 == 0 ? n.W : n.L);
	}
}
function es(e, t, n) {
	let { w: r, h: i } = e, a = r / 2, o = [
		1.5,
		5.2,
		4.4,
		1.8
	][t];
	for (let s = 0; s < i; s++) {
		let c = s > i - 10 ? (s - (i - 10)) / 10 : 0, l = s < 10 ? s / 10 : 1, u = o * (1 + c * (t === 0 ? 2.2 : 1.2)) * (.55 + .45 * l);
		for (let i = 0; i < r; i++) {
			let r = Math.abs(i + .5 - a);
			if (r > u + 1.5 || t === 3 && (s >> 2) % 2 == 1 && r > .8) continue;
			let o;
			if (r < u * .45) o = n.W;
			else if (r < u * .8) o = n.L;
			else if (r < u + .2) o = n.MID;
			else if ((i + s) % 2 == 0 && t > 0 && t < 3) o = n.D;
			else continue;
			t === 2 && r > u * .45 && (s + Math.floor(r * 3)) % 7 == 0 && (o = n.W), e.max(i, s, o);
		}
	}
	if (t >= 1) {
		for (let o = 0; o < r; o++) {
			let r = Math.abs(o + .5 - a);
			r < (t === 1 ? 11 : 9) && e.max(o, i - 2, r < 4 ? n.W : n.L), r < (t === 1 ? 8 : 6) && e.max(o, i - 3, n.L);
		}
		for (let s = 0; s < 9; s++) {
			let c = Math.floor(Ko(s, t, 21) * r), l = Math.floor((Ko(s, 0, 22) + t * .17) % 1 * (i - 8));
			Math.abs(c + .5 - a) < o + 1 || (e.max(c, l, n.W), e.max(c, l + 1, n.MID));
		}
	}
}
function ts(e, t, n) {
	if (t === 0) {
		for (let t = 0; t < 6; t++) Uo(e, 16, 0, t % 2 ? 4 : 7, t / 6 * J + .26, 1.3, n.W);
		Y(e, 16, 16, 2, 2.4, n.W);
	} else if (t === 1) {
		for (let t = 0; t < 12; t++) Uo(e, 16, 3, t % 2 ? 9 : 13.5, t / 12 * J, t % 2 ? 1 : 1.4, t % 2 ? n.L : n.W);
		Y(e, 16, 16, 3.2, 1.6, n.W), Y(e, 16, 16, 7.5, 1, n.MID, (e) => e / J * 12 % 1 < .5);
	} else if (t === 2) {
		Y(e, 16, 16, 12.5, 1.4, n.L);
		for (let t = 0; t < 12; t++) Uo(e, 16, 9.5, 15, t / 12 * J + .13, 1, t % 2 ? n.MID : n.L);
	} else for (let t = 0; t < 16; t++) {
		let [r, i] = Ho(16, 16, 13.5 + t % 2 * 1.5, t / 16 * J + .2);
		e.max(r, i, n.L);
	}
}
function ns(e, t, n) {
	for (let r = 0; r < 4; r++) Uo(e, 8, 2, 7.6, r * Math.PI / 2 + (t ? Math.PI / 4 : 0), 1.1, n.L);
	for (let r = 0; r < 4; r++) Uo(e, 8, 2, 4.6, r * Math.PI / 2 + (t ? 0 : Math.PI / 4), 1, n.MID);
	for (let t = 0; t < 16; t++) for (let r = 0; r < 16; r++) {
		let i = Math.hypot(r + .5 - 8, t + .5 - 8);
		i < 1.8 ? e.set(r, t, n.W) : i < 3.1 ? e.max(r, t, n.W) : i < 3.9 && e.max(r, t, n.L);
	}
}
function rs(e, t, n) {
	let { h: r } = e, i = r - 1, a = t === 0 ? 8 : t === 3 ? 12 : 22, o = i - a;
	Go(e, [
		[1.5, i + .5],
		[4, o + a * .45],
		[6.5, o + 1],
		[8.5, o],
		[11, o + a * .3],
		[14.5, i + .5]
	], (e, t) => {
		let r = (t - o) / Math.max(1, a), i = e + .5 < 6 + r * 1.5, s = Ko(e, t, 31);
		return i ? s < .25 ? n.W : n.L : e + .5 < 10 + r ? s < .2 ? n.L : n.MID : s < .3 ? n.MID : n.D;
	});
	for (let t = o + 3; t < i; t += 4) for (let r = 0; r < 16; r++) e.get(r, t) && (r + t) % 3 == 0 && e.set(r, t, n.S);
	if (t >= 2 && (Vo(e, 8, o + 2, 6.5, o + 9, 1, n.R), Vo(e, 6.5, o + 9, 9, o + 15, 1, n.R)), t === 2 && (e.set(13, o + 4, n.MID), e.set(2, o + 8, n.L)), t === 3) for (let [t, r] of [
		[0, i],
		[1, i - 1],
		[15, i],
		[14, i - 2],
		[3, i - 13],
		[12, i - 15]
	]) e.set(t, r, n.MID);
	e.rim(n.R);
}
function is(e, t, n) {
	let { w: r, h: i } = e, a = r / 2, o = i - 3.5, s = r / 2 - 1, c = i - 5;
	for (let l = 0; l < i; l++) for (let i = 0; i < r; i++) {
		let r = (i + .5 - a) / s, u = (l + .5 - o) / c, d = Math.hypot(r, u);
		if (u > .05 || d > 1) continue;
		if (d > 1 - 1.6 / s) {
			e.set(i, l, n.W);
			continue;
		}
		if (d < .58) continue;
		let f = Math.atan2(-u, r) / Math.PI * 14 + t * .5, p = d * 9, m = Math.abs((f + p) % 2 - 1), h = Math.abs((f - p + 40) % 2 - 1);
		m > .16 && h > .16 || e.set(i, l, d > .88 ? n.L : d > .74 ? n.MID : n.D);
	}
	for (let i = 0; i < r; i++) {
		let r = (i + .5 - a) / s;
		if (Math.abs(r) > 1) continue;
		let c = Math.sqrt(Math.max(0, 1 - r * r)) * 2.6;
		e.max(i, Math.round(o + c), n.L), (i + t) % 3 && e.max(i, Math.round(o - c * .6), n.MID);
	}
	let l = t ? .35 : -.35;
	for (let t = -3; t <= 3; t++) {
		let r = Math.PI / 2 + l + t * .035, i = a + Math.cos(r) * s * .93, u = o - Math.sin(r) * c * .93;
		e.max(i, u, n.W);
	}
}
function as(e, t, n) {
	let r = !1;
	for (let i = 0, a = e.length - 1; i < e.length; a = i++) {
		let [o, s] = e[i], [c, l] = e[a];
		s > n + .5 != l > n + .5 && t + .5 < (c - o) * (n + .5 - s) / (l - s) + o && (r = !r);
	}
	return r;
}
function os(e, t, n, r) {
	let i = t[0], a = t[0];
	for (let e of t) e[1] < i[1] && (i = e), e[1] > a[1] && (a = e);
	let o = (e, t) => (a[0] - i[0]) * (t + .5 - i[1]) - (a[1] - i[1]) * (e + .5 - i[0]);
	Go(e, t, (e, s) => {
		let c = o(e, s) > 0, l = !as(t, e - 1, s) || !as(t, e, s - 1), u = !as(t, e + 1, s) || !as(t, e, s + 1), d = Math.hypot(e + .5 - i[0], s + .5 - i[1]) < 1.6;
		return n ? d ? r.W : c ? l ? r.W : r.L : l && s + .5 < (i[1] + a[1]) / 2 ? r.L : null : u ? c ? r.D : r.R : c ? r.MID : s + .5 > (i[1] + a[1]) / 2 ? r.S : r.D;
	});
}
var ss = Object.freeze([
	[
		[5, .3],
		[8.6, 4.2],
		[6, 9.7],
		[2.4, 5.6]
	],
	[
		[3, .3],
		[6.8, 2.6],
		[8.2, 9.7],
		[2.2, 7.6]
	],
	[
		[1, 9.4],
		[5.4, .3],
		[9.5, 8.6]
	],
	[
		[2.4, 1.8],
		[7, .3],
		[9.6, 5],
		[6.4, 9.6],
		[.6, 7]
	]
]);
function cs(e, t, n, r) {
	os(e, ss[t % ss.length], n, r);
}
function ls(e, t, n, r) {
	let i = [
		[13.5, 3.5],
		[18, .4],
		[23.7, 3.6],
		[18, 7.6]
	];
	if (!n) {
		for (let t = 2; t <= 15; t++) e.set(t, 3, t > 7 ? r.MID : r.D), e.set(t, 4, t > 7 ? r.D : r.S);
		Go(e, i, (e, t) => t < 3.5 ? r.MID : t < 5 ? r.D : r.S), e.set(1, 2 + t, r.D), e.set(0, 5 - t, r.S);
		return;
	}
	for (let t = 8; t <= 14; t++) e.set(t, 3, t > 11 ? r.L : r.MID);
	Go(e, i, (e, t) => t >= 3.5 ? null : e >= 21 || t < 1.5 ? r.W : r.L), e.set(23, 3, r.W);
	let a = t ? 19 : 16;
	e.set(a, 3, r.W), e.set(a + 1, 3, r.W), e.set(a + 1, 4, r.L);
}
function us(e, t, n) {
	let r = 4.5;
	e.set(4, 4, n.W);
	for (let i = 0; i < 6; i++) {
		let a = i * Math.PI / 3 + (t ? Math.PI / 6 : 0);
		for (let t = 1; t <= 4; t++) e.max(4 + Math.cos(a) * t, 4 - Math.sin(a) * t, t === 4 ? n.L : n.W);
		if (!t) {
			let t = r + Math.cos(a) * 2.6, i = r - Math.sin(a) * 2.6;
			e.max(t - .5 + Math.cos(a + 1.1), i - .5 - Math.sin(a + 1.1), n.L);
		}
	}
}
function ds(e, t, n) {
	let { w: r, h: i } = e, a = [];
	for (let e = 0; e < 5; e++) a.push([
		7 + e * 6.5 + Ko(e, t, 61) * 3,
		10 + Ko(e, t, 62) * 3 - (e === 2 ? 2 : 0),
		4.5 + Ko(e, t, 63) * 3.5
	]);
	for (let o = 0; o < i; o++) for (let s = 0; s < r; s++) {
		let c = -1;
		for (let [e, t, n] of a) c = Math.max(c, 1 - Math.hypot(s + .5 - e, (o + .5 - t) * 1.6) / n);
		if (c < 0) continue;
		let l = s / r * .4 + (1 - o / i), u = Ko(s, o, 64 + t), d = c > .55 && l > .95 ? n.W : l > .8 ? n.L : l > .5 ? n.MID : n.D;
		e.set(s, o, u < .06 ? Math.max(n.D, d - 30) : d);
	}
}
function fs(e, t) {
	let n = e.w / 2;
	for (let r = 0; r < e.h; r++) for (let i = 0; i < e.w; i++) {
		let a = Math.hypot(i + .5 - n, r + .5 - n) / (n - .2);
		a <= 1 && e.set(i, r, a > .72 ? t.W : t.L);
	}
}
function ps(e, t) {
	let n = e.w / 2;
	for (let r = 0; r < e.h; r++) for (let i = 0; i < e.w; i++) {
		let a = Math.hypot(i + .5 - n, r + .5 - n) / (n - .5);
		a <= 1 && e.set(i, r, a < .35 ? t.W : t.L);
	}
}
function ms(e, t, n, r) {
	let i = t ? [
		[4.5, 37.6],
		[2, 26],
		[3.2, 12],
		[16.5, .3],
		[27.4, 12.5],
		[28, 27],
		[25, 37.6]
	] : [
		[4, 37.6],
		[1.5, 25],
		[2.5, 11.5],
		[12.5, .3],
		[27.2, 11],
		[28.2, 26],
		[25.5, 37.6]
	], a = t ? [[
		[1.5, 20],
		[0, 12.5],
		[4.5, 17]
	], [
		[27.5, 18],
		[29.6, 9],
		[25, 14]
	]] : [[
		[2, 18],
		[.4, 9.5],
		[5, 14]
	], [
		[27, 20],
		[29.6, 13],
		[25.5, 16]
	]], o = t ? 16.5 : 12.5, s = (e) => 9.5 + e / 38 * 1.5, c = (e) => 20.5 - e / 38 * 1, l = (e, t) => as(i, e, t);
	Go(e, i, (e, t) => {
		let i = e + .5, a = !l(e - 1, t) || !l(e + 1, t) || !l(e, t - 1) || !l(e, t + 1), u = !l(e - 1, t) || !l(e, t - 1), d = Math.abs(i - s(t)) < .75 && t > 6, f = Math.abs(i - c(t)) < .75 && t > 6, p = t <= 7 && Math.abs(i - (o + t / 7 * ((s(7) + c(7)) / 2 - o))) < .75, m = i < s(t) ? 0 : i < c(t) ? 1 : 2;
		if (n) return u && (m === 0 || t < 8) ? r.W : d || p ? t < 22 ? r.L : r.MID : f && t < 12 ? r.MID : m === 0 && !a && Math.abs(i + t * .5 - 13) < 1.2 ? r.L : null;
		if (a) return m === 2 ? r.S : r.D;
		if (d || f || p) return r.MID;
		if (t < 33) {
			let n = t < 16 ? 7 : t < 26 ? 5 : 3;
			if (m === 1 ? ((e - t) % n + n) % n !== 0 : (e + t) % (n + 1) !== 0) return null;
		}
		return m === 0 ? r.MID : m === 1 ? r.D : r.S;
	});
	for (let t of a) Go(e, t, (e, i) => {
		let a = !as(t, e - 1, i) || !as(t, e, i - 1);
		return n ? a ? r.W : null : a ? r.MID : r.D;
	});
	if (n) {
		let [n, i] = t ? [6, 15] : [5, 10];
		e.set(n, i, r.W), e.set(n - 1, i, r.L), e.set(n + 1, i, r.L), e.set(n, i - 1, r.L), e.set(n, i + 1, r.L);
	}
}
function hs(e, t, n, r) {
	switch (e) {
		case "partyGlyphHoly":
			qo(t, r);
			break;
		case "partyGlyphFrost":
			Jo(t, r);
			break;
		case "partyGlyphWard":
			Yo(t, r);
			break;
		case "partyWardRing":
			Xo(t, r);
			break;
		case "partyRing":
			Zo(t, n, r);
			break;
		case "partyCrack":
			Qo(t, r);
			break;
		case "partySwirl":
			$o(t, n, r);
			break;
		case "partyPillar":
			es(t, n, r);
			break;
		case "partySunburst":
			ts(t, n, r);
			break;
		case "partyHolyOrb":
			ns(t, n, r);
			break;
		case "partyRockSpike":
			rs(t, n, r);
			break;
		case "partyDome":
			is(t, n, r);
			break;
		case "partyIceLance":
			ls(t, n, !1, r);
			break;
		case "partyIceLanceLit":
			ls(t, n, !0, r);
			break;
		case "partyIceShard":
			cs(t, n, !1, r);
			break;
		case "partyIceShardLit":
			cs(t, n, !0, r);
			break;
		case "partyIceFlake":
			us(t, n, r);
			break;
		case "partyIceMist":
			ds(t, n, r);
			break;
		case "partyIceGlow":
			ps(t, r);
			break;
		case "partyIceBokeh":
			fs(t, r);
			break;
		case "partyIceShell":
			ms(t, n, !1, r);
			break;
		case "partyIceShellLit": ms(t, n, !0, r);
	}
}
//#endregion
//#region src/engine/pixel/fx/dragonFx.js
var gs = /* @__PURE__ */ e({
	FRAMES: () => _s,
	paint: () => vs
}), _s = Object.freeze({
	dragonFireball: Object.freeze({
		w: 24,
		h: 24,
		n: 4,
		fps: 14
	}),
	dragonBlast: Object.freeze({
		w: 48,
		h: 48,
		n: 6,
		fps: 16
	}),
	dragonRing: Object.freeze({
		w: 64,
		h: 64,
		n: 4,
		fps: 14
	}),
	dragonScorch: Object.freeze({
		w: 48,
		h: 48,
		n: 2,
		fps: 0
	}),
	dragonEmbers: Object.freeze({
		w: 48,
		h: 48,
		n: 2,
		fps: 3
	})
});
function vs(e, t, n, r) {
	switch (e) {
		case "dragonFireball":
			bs(t, n, r);
			break;
		case "dragonBlast":
			xs(t, n, r);
			break;
		case "dragonRing":
			Ss(t, n, r);
			break;
		case "dragonScorch":
			Cs(t, n, r);
			break;
		case "dragonEmbers": ws(t, n, r);
	}
}
function ys(e, t, n) {
	let r = Math.floor(e), i = Math.floor(t), a = e - r, o = t - i, s = a * a * (3 - 2 * a), c = o * o * (3 - 2 * o), l = A(r, i, n), u = A(r + 1, i, n), d = A(r, i + 1, n), f = A(r + 1, i + 1, n);
	return l + (u - l) * s + (d - l) * c + (l - u - d + f) * s * c;
}
function bs(e, t, n) {
	for (let r = 0; r < 24; r++) for (let i = 0; i < 24; i++) {
		let a = i + .5 - 16.5, o = r + .5 - 12, s = Math.max(0, -a), c = ys(i * .45 - t * 1.7, r * .5, 31) - .5, l = s > 0 ? 5.6 - s * .32 + c * 3.2 : Math.sqrt(Math.max(0, 31 - a * a));
		if (Math.abs(o) > l) continue;
		let u = Math.hypot(a * 1.15, o), d = s / 16, f;
		f = u < 2.6 ? n.W : u < 4.2 && d < .3 || d < .45 && Math.abs(o) < l * .55 ? n.L : d < .75 ? n.MID : n.D, e.set(i, r, f);
	}
	for (let r = 0; r < 4; r++) {
		let i = 1 + Math.floor(A(r, t, 7) * 7), a = 4 + Math.floor(A(r, t, 9) * 16);
		e.max(i, a, r & 1 ? n.L : n.MID);
	}
}
function xs(e, t, n) {
	for (let r = 0; r < 48; r++) for (let i = 0; i < 48; i++) {
		let a = i + .5 - 24, o = r + .5 - 24, s = Math.hypot(a, o), c = Math.atan2(o, a), l = ys(i * .22 + t * 3.1, r * .22, 53 + t);
		if (t === 0) {
			let t = Math.abs(Math.cos(c * 4)) ** 6 * 9;
			s < 6 ? e.set(i, r, n.W) : s < 6 + t && e.set(i, r, s < 9 ? n.W : n.L);
		} else if (t <= 2) {
			let a = (t === 1 ? 14 : 19) + (l - .5) * 9 + Math.sin(c * 5 + t) * 1.5;
			if (s > a) continue;
			let o = s / a, u = o < (t === 1 ? .42 : .28) ? n.W : o < .62 ? n.L : o < .84 ? n.MID : t === 2 ? n.S : n.D;
			e.set(i, r, u);
		} else if (t === 3) {
			let t = 20 + (l - .5) * 6;
			if (s > t) continue;
			s > t - 5 ? e.set(i, r, l > .42 ? n.L : n.MID) : l > .55 ? e.set(i, r, n.S) : l > .48 && e.set(i, r, n.R);
		} else if (t === 4) {
			if (s > 22 + (l - .5) * 8) continue;
			let t = ys(i * .3, r * .3 - 4, 91);
			t > .52 ? e.set(i, r, t > .68 ? n.D : n.S) : A(i, r, 17) > .975 && e.set(i, r, n.W);
		} else {
			if (s > 23) continue;
			ys(i * .34, r * .34 - 8, 92) > .64 ? e.set(i, r, n.S) : A(i, r, 19) > .99 && e.set(i, r, n.L);
		}
	}
}
function Ss(e, t, n) {
	let r = [
		11,
		19,
		25.5,
		30
	][t], i = [
		2.6,
		3.4,
		3.2,
		2.4
	][t];
	for (let a = 0; a < 64; a++) for (let o = 0; o < 64; o++) {
		let s = o + .5 - 32, c = a + .5 - 32, l = Math.abs(Math.hypot(s, c) - r);
		if (l > i) continue;
		let u = Math.atan2(c, s);
		if (ys(Math.cos(u) * 6 + 10, Math.sin(u) * 6 + 10 + t * 2.3, 61) < [
			.1,
			.25,
			.4,
			.52
		][t]) continue;
		let d = l < i * .4 ? t < 2 ? n.W : n.L : l < i * .75 ? t < 2 ? n.L : n.MID : n.D;
		e.set(o, a, d);
	}
}
function Cs(e, t, n) {
	for (let r = 0; r < 48; r++) for (let i = 0; i < 48; i++) {
		let a = i + .5 - 24, o = r + .5 - 24, s = Math.hypot(a, o), c = Math.atan2(o, a), l = ys(i * .18, r * .18, 71 + t * 13), u = Math.abs(Math.sin(c * (7 + t * 2) + t)) ** 8 * 7, d = 14 + (l - .5) * 10 + u;
		if (s > d) continue;
		let f = s / d;
		f > .82 && A(i, r, 5 + t) > 1.6 - f * 1.2 || e.set(i, r, f < .35 ? n.R : f < .65 ? n.S : f < .85 ? n.D : n.MID);
	}
}
function ws(e, t, n) {
	for (let r = 0; r < 26; r++) {
		let i = A(r, 3, 41) * Math.PI * 2, a = 3 + A(r, 5, 41) * 14, o = 24 + Math.cos(i) * a, s = 24 + Math.sin(i) * a;
		if (A(r, t, 43) > .3 && (e.set(o, s, A(r, 7, 41) > .5 ? n.W : n.L), r % 3 == 0)) for (let t = 1; t < 4; t++) e.max(o + Math.cos(i) * t, s + Math.sin(i) * t, t < 2 ? n.L : n.MID);
	}
	for (let r = -2; r <= 2; r++) for (let i = -2; i <= 2; i++) i * i + r * r <= (t ? 3 : 5) && e.max(24 + i, 24 + r, n.MID);
}
//#endregion
//#region src/engine/pixel/fx/bruteFx.js
var Ts = /* @__PURE__ */ e({
	FRAMES: () => Es,
	paint: () => Ds
}), Es = Object.freeze({
	bruteCleave: Object.freeze({
		w: 80,
		h: 44,
		n: 4,
		fps: 30
	}),
	bruteQuake: Object.freeze({
		w: 64,
		h: 64,
		n: 3,
		fps: 12
	}),
	bruteBreath: Object.freeze({
		w: 56,
		h: 56,
		n: 3,
		fps: 14
	}),
	bruteFireball: Object.freeze({
		w: 16,
		h: 16,
		n: 4,
		fps: 14
	}),
	brutePillar: Object.freeze({
		w: 24,
		h: 56,
		n: 4,
		fps: 14
	}),
	bruteSigil: Object.freeze({
		w: 48,
		h: 48,
		n: 2,
		fps: 6
	}),
	bruteFlames: Object.freeze({
		w: 24,
		h: 24,
		n: 4,
		fps: 12
	}),
	bruteBite: Object.freeze({
		w: 24,
		h: 20,
		n: 3,
		fps: 30
	}),
	bruteClaw: Object.freeze({
		w: 24,
		h: 24,
		n: 3,
		fps: 24
	})
});
function Ds(e, t, n, r) {
	switch (e) {
		case "bruteCleave":
			As(t, n, r);
			break;
		case "bruteQuake":
			js(t, n, r);
			break;
		case "bruteBreath":
			Ms(t, n, r);
			break;
		case "bruteFireball":
			Ns(t, n, r);
			break;
		case "brutePillar":
			Ps(t, n, r);
			break;
		case "bruteSigil":
			Fs(t, n, r);
			break;
		case "bruteFlames":
			Is(t, n, r);
			break;
		case "bruteBite":
			Ls(t, n, r);
			break;
		case "bruteClaw": Rs(t, n, r);
	}
}
function Os(e, t, n) {
	let r = Math.imul(e | 0, 374761393) ^ Math.imul(t | 0, 668265263) ^ Math.imul(n | 0, 1274126177);
	return r = Math.imul(r ^ r >>> 13, 1103515245), ((r ^ r >>> 16) >>> 0) / 4294967296;
}
function ks(e, t) {
	return t > .8 ? e.W : t > .6 ? e.L : t > .4 ? e.MID : t > .2 ? e.D : e.S;
}
function As(e, t, n) {
	let { w: r, h: i } = e, a = r / 2, o = i - 2.5, s = r / 2 - 1.5, c = i - 4, l = [
		{
			a0: .1,
			a1: 1.15
		},
		{
			a0: .08,
			a1: 2.3
		},
		{
			a0: .35,
			a1: 3.05
		},
		{
			a0: 1.7,
			a1: 3.08
		}
	][t];
	for (let u = 0; u < i; u++) for (let i = 0; i < r; i++) {
		let r = (i + .5 - a) / s, d = (o - (u + .5)) / c, f = Math.hypot(r, d), p = Math.atan2(d, r);
		if (p < l.a0 || p > l.a1 || d < -.04) continue;
		let m = (p - l.a0) / Math.max(1e-6, l.a1 - l.a0), h = (.2 + .36 * m) * (t === 3 ? .6 : 1), g = p * 22 % 1 < .5 ? .05 : 0;
		if (f > 1 || f < 1 - h + g || t === 3 && Os(i, u, 7) < .35) continue;
		let _ = f > 1 - h * .3;
		e.set(i, u, _ ? m > .7 ? n.W : n.L : m > .55 ? n.MID : m > .25 ? n.D : n.S);
	}
	if (t >= 1) {
		let r = l.a1;
		for (let i = 0; i < 7; i++) {
			let l = 1.05 + .1 * i + .06 * t, u = r - i % 3 * .15 + .08 * t, d = a + Math.cos(u) * s * l, f = o - Math.sin(u) * c * l;
			e.set(d, f, i < 2 ? n.W : n.L), i % 2 == 0 && e.set(d + 1, f, n.MID);
		}
	}
}
function js(e, t, n) {
	let r = [
		14,
		24,
		29
	][t];
	for (let i = 0; i < 9; i++) {
		let a = i / 9 * Math.PI * 2 + Os(i, 1, 3) * .5, o = 32, s = 32, c = r * (.7 + .3 * Os(i, 2, 3));
		for (let r = 0; r < c; r += 1) {
			a += (Os(i, r, 5) - .5) * .5, o += Math.cos(a), s += Math.sin(a);
			let l = r / c, u = t === 2 ? l < .5 ? n.MID : n.D : l < .3 ? n.W : l < .7 ? n.L : n.MID;
			if (e.max(o, s, u), l < .4 && e.max(o + 1, s, t === 2 ? n.D : n.MID), r === Math.round(c * .55) && i % 2 == 0) {
				let t = o, r = s, l = a + .7;
				for (let a = 0; a < c * .3; a++) l += (Os(i, a, 9) - .5) * .6, t += Math.cos(l), r += Math.sin(l), e.max(t, r, n.D);
			}
		}
	}
	if (t >= 1) for (let i = 0; i < 22; i++) {
		let a = i / 22 * Math.PI * 2 + Os(i, 4, 11) * .2, o = r + 1 + Os(i, 5, 11) * 2, s = 32 + Math.cos(a) * o, c = 32 + Math.sin(a) * o;
		t === 2 && Os(i, 6, 11) < .5 || (e.set(s, c, n.D), e.set(s + 1, c, n.S), i % 3 == 0 && e.set(s, c - 1, n.MID));
	}
	for (let r = -3; r <= 3; r++) for (let i = -3; i <= 3; i++) i * i + r * r <= 9 && e.max(32 + i, 32 + r, t === 2 ? n.D : n.L);
	t < 2 && e.set(32, 32, n.W);
}
function Ms(e, t, n) {
	let { w: r, h: i } = e, a = r / 2, o = i - 1, s = 30 * Math.PI / 180;
	for (let c = 0; c < i; c++) for (let l = 0; l < r; l++) {
		let r = l + .5 - a, u = o - (c + .5);
		if (u <= 0) continue;
		let d = Math.hypot(r, u), f = Math.atan2(r, u), p = Math.sin(f * 9 + t * 2.1 + d * .35) * .5 + Math.sin(f * 23 - t * 1.3) * .25, m = i - 2 + p * 5 - Math.abs(f) * 6, h = s * (.82 + .12 * Math.sin(d * .4 + t * 1.7));
		if (d > m || Math.abs(f) > h) continue;
		let g = 1 - Math.abs(f) / h, _ = 1 - d / m, v = .15 + .55 * g + .35 * _ * g;
		d < 6 && (v = Math.max(v, .9)), Os(l >> 1, c >> 1, t + 31) < .12 && (v -= .25), e.set(l, c, ks(n, v));
	}
}
function Ns(e, t, n) {
	let r = 7.5, i = t * Math.PI / 2 / 4;
	for (let t = 0; t < 16; t++) for (let a = 0; a < 16; a++) {
		let o = a + .5 - r, s = t + .5 - r, c = Math.hypot(o, s), l = Math.max(0, Math.sin(5 * (Math.atan2(s, o) - i) + c * .4)), u = 4.6 + 2.6 * l * l;
		c > u || e.set(a, t, c < 2.2 ? n.W : c < 3.4 ? n.L : c < 4.6 ? n.MID : c < u - .8 ? n.D : n.S);
	}
}
function Ps(e, t, n) {
	let { w: r, h: i } = e, a = r / 2, o = [
		i * .45,
		i * .02,
		i * .08,
		i * .35
	][t];
	for (let s = 0; s < i; s++) {
		if (s < o) continue;
		let c = (s - o) / (i - o), l = Math.sin(s * .32 + t * 1.6) * 2.2 * (1 - c), u = 3.2 + 6 * c * c + (c > .9 ? 2 : 0) + Math.sin(s * .7 + t * 2.3) * 1.1;
		for (let i = 0; i < r; i++) {
			let r = i + .5 - a - l;
			if (Math.abs(r) > u || c < .25 && Os(i, s >> 1, t + 41) < .35 * (1 - c / .25)) continue;
			let o = .2 + .7 * (1 - Math.abs(r) / u) + .2 * c;
			t === 3 && (o -= .25), e.set(i, s, ks(n, o));
		}
	}
}
function Fs(e, t, n) {
	let r = 23.5, i = t === 1;
	for (let t = 0; t < 48; t++) for (let a = 0; a < 48; a++) {
		let o = a + .5 - r, s = t + .5 - r, c = Math.hypot(o, s);
		c > 21.5 && c < 23.2 ? e.set(a, t, i ? n.W : n.L) : c > 15.6 && c < 16.8 && e.set(a, t, i ? n.L : n.MID);
	}
	for (let t = 0; t < 2; t++) {
		let a = [
			0,
			1,
			2
		].map((e) => {
			let n = -Math.PI / 2 + t * Math.PI / 3 + e * 2 * Math.PI / 3;
			return [r + Math.cos(n) * 16, r + Math.sin(n) * 16];
		});
		for (let t = 0; t < 3; t++) {
			let [r, o] = a[t], [s, c] = a[(t + 1) % 3], l = Math.ceil(Math.hypot(s - r, c - o));
			for (let t = 0; t <= l; t++) e.max(r + (s - r) * t / l, o + (c - o) * t / l, i ? n.L : n.MID);
		}
	}
	for (let t = 0; t < 18; t++) {
		let a = t / 18 * Math.PI * 2, o = r + Math.cos(a) * 19.2, s = r + Math.sin(a) * 19.2;
		e.set(o, s, i ? n.W : n.L);
		let c = t % 3;
		c === 0 ? (e.set(o + Math.cos(a), s + Math.sin(a), n.MID), e.set(o - Math.cos(a), s - Math.sin(a), n.MID)) : c === 1 ? e.set(o - Math.sin(a), s + Math.cos(a), n.MID) : e.set(o + Math.sin(a), s - Math.cos(a), n.D);
	}
	for (let t = -2; t <= 2; t++) for (let a = -2; a <= 2; a++) a * a + t * t <= 4 && e.set(r + a, r + t, i ? n.W : n.L);
}
function Is(e, t, n) {
	for (let [r, i, a] of [
		[
			12,
			17,
			0
		],
		[
			7,
			11,
			1.7
		],
		[
			17,
			10,
			3.1
		]
	]) {
		let o = i + Math.round(Math.sin(t * 1.6 + a) * 2);
		for (let i = 0; i < o; i++) {
			let s = i / o, c = Math.sin(s * 3 + t * 1.5 + a) * 1.6 * s, l = (r === 12 ? 4.2 : 3) * (1 - s * .85);
			for (let t = Math.floor(r - l + c); t <= Math.ceil(r + l + c); t++) {
				let a = Math.abs(t + .5 - r - c) / Math.max(.6, l);
				a > 1 || e.max(t, 22 - i, ks(n, .95 - s * .6 - a * .45));
			}
		}
	}
	for (let t = 5; t <= 19; t++) e.max(t, 23, t % 3 ? n.MID : n.L);
	e.set(10 + t * 2, 3 + t % 2 * 2, n.L);
}
function Ls(e, t, n) {
	let r = [
		6,
		3,
		.5
	][t];
	for (let t of [-1, 1]) for (let i = -10; i <= 10; i++) {
		let a = 12 + i, o = i * i / 22, s = 10 + t * (r + 3 - o), c = Math.abs(i) < 4 ? n.W : Math.abs(i) < 8 ? n.L : n.MID;
		e.set(a, s, c), Math.abs(i) < 7 && e.set(a, s + t, n.D), i % 4 == 0 && Math.abs(i) < 9 && e.set(a, s - t, n.L);
	}
	if (t === 2) {
		for (let [t, r] of [
			[0, -3],
			[0, 3],
			[-4, 0],
			[4, 0],
			[-2, -2],
			[2, 2],
			[2, -2],
			[-2, 2]
		]) e.max(12 + t, 10 + r, n.L);
		e.set(12, 10, n.W);
	}
}
function Rs(e, t, n) {
	let r = [
		.55,
		1,
		1
	][t];
	for (let i = 0; i < 3; i++) {
		let a = 5 + i * 6, o = 2 + i * 6;
		for (let s = 0; s <= 20 * r; s++) {
			let c = s / 20, l = a + (o - a) * c + Math.sin(c * Math.PI) * 2.5, u = 3 + 18 * c;
			if (t === 2 && Os(s, i, 13) < .4) continue;
			let d = c > r - .25 ? n.W : c > .3 ? n.L : n.MID;
			e.set(l, u, d), c > .2 && c < .8 && e.set(l + 1, u, n.D);
		}
	}
}
//#endregion
//#region src/engine/pixel/fx/swarmFx.js
var zs = /* @__PURE__ */ e({
	FRAMES: () => Bs,
	paint: () => Vs
}), Bs = Object.freeze({
	swarmOrb: Object.freeze({
		w: 12,
		h: 12,
		n: 4,
		fps: 14
	}),
	swarmSpit: Object.freeze({
		w: 10,
		h: 10,
		n: 3,
		fps: 12
	}),
	swarmBurst: Object.freeze({
		w: 32,
		h: 32,
		n: 4,
		fps: 20
	})
});
function Vs(e, t, n, r) {
	e === "swarmOrb" ? Hs(t, n, r) : e === "swarmSpit" ? Us(t, n, r) : e === "swarmBurst" && Ws(t, n, r);
}
function Hs(e, t, n) {
	let r = t * Math.PI / 2 / 3;
	for (let t = 0; t < 12; t++) for (let i = 0; i < 12; i++) {
		let a = i + .5 - 6, o = t + .5 - 6, s = Math.hypot(a, o), c = Math.max(0, Math.sin(3 * (Math.atan2(o, a) - r) - s * .55)), l = 3.3 + 2.2 * c * c;
		if (s > l) continue;
		let u = s < 1.8 ? n.W : s < 2.9 ? n.L : s < l - .9 ? n.MID : n.D;
		e.set(i, t, u);
	}
}
function Us(e, t, n) {
	for (let r = 0; r < 10; r++) for (let i = 0; i < 10; i++) {
		let a = i + .5 - 5, o = r + .5 - 4.6, s = Math.hypot(a, o * 1.08), c = Math.atan2(o, a), l = 3.1 + .55 * Math.sin(4 * c + t * 2.1) + .3 * Math.cos(7 * c - t);
		if (s > l) continue;
		let u = Math.hypot(a + .6, o + .6);
		e.set(i, r, u < 1.3 ? n.W : u < 2.3 ? n.L : s < l - .8 ? n.MID : n.D);
	}
	let r = [
		[[5, 8]],
		[[5, 8], [5, 9]],
		[[4, 9]]
	][t] ?? [];
	for (let [t, i] of r) e.set(t, i, n.MID);
}
function Ws(e, t, n) {
	let r = [
		5.5,
		9,
		12,
		14.5
	][t], i = [
		3.2,
		2.8,
		2.2,
		1.5
	][t];
	for (let a = 0; a < 32; a++) for (let o = 0; o < 32; o++) {
		let s = o + .5 - 16, c = a + .5 - 16, l = Math.hypot(s, c), u = Math.atan2(c, s), d = r + (1.1 * Math.max(0, Math.sin(9 * u + t * .9)) + .6 * Math.max(0, Math.sin(5 * u - t * 1.3))) * (1.2 + t * .35), f = r - i;
		if (l <= d && l >= f) {
			if (t >= 2 && (o * 7 + a * 3 + t) % 5 == 0) continue;
			let r = (l - f) / Math.max(.5, d - f), i = t === 0 ? r < .6 ? n.W : n.L : r > .75 ? n.D : r > .35 ? t < 2 ? n.L : n.MID : t < 3 ? n.MID : n.D;
			e.set(o, a, i);
		} else l < f && t < 2 && (t === 0 ? l < f : (o + a) % 3 == 0 && l < f - 1) && e.set(o, a, t === 0 ? l < 2.5 ? n.W : n.L : n.S);
	}
}
//#endregion
//#region src/engine/pixel/FxSprites.js
var Gs = Object.freeze({
	slash: Object.freeze({
		w: 48,
		h: 24,
		n: 4,
		fps: 30
	}),
	slashBig: Object.freeze({
		w: 64,
		h: 32,
		n: 4,
		fps: 30
	}),
	spin: Object.freeze({
		w: 64,
		h: 64,
		n: 4,
		fps: 30
	}),
	thrust: Object.freeze({
		w: 48,
		h: 12,
		n: 3,
		fps: 30
	}),
	impact: Object.freeze({
		w: 16,
		h: 16,
		n: 4,
		fps: 30
	}),
	crit: Object.freeze({
		w: 24,
		h: 24,
		n: 4,
		fps: 30
	}),
	dust: Object.freeze({
		w: 16,
		h: 16,
		n: 3,
		fps: 20
	}),
	arrow: Object.freeze({
		w: 16,
		h: 4,
		n: 1,
		fps: 0
	}),
	emberBolt: Object.freeze({
		w: 16,
		h: 16,
		n: 2,
		fps: 12
	}),
	boulder: Object.freeze({
		w: 16,
		h: 16,
		n: 2,
		fps: 8
	}),
	coin: Object.freeze({
		w: 8,
		h: 8,
		n: 4,
		fps: 12
	}),
	heart: Object.freeze({
		w: 10,
		h: 10,
		n: 2,
		fps: 4
	}),
	mana: Object.freeze({
		w: 10,
		h: 10,
		n: 2,
		fps: 4
	}),
	draught: Object.freeze({
		w: 10,
		h: 12,
		n: 1,
		fps: 0
	}),
	upgrade: Object.freeze({
		w: 12,
		h: 12,
		n: 2,
		fps: 4
	}),
	core: Object.freeze({
		w: 14,
		h: 14,
		n: 2,
		fps: 4
	}),
	stun: Object.freeze({
		w: 16,
		h: 8,
		n: 4,
		fps: 10
	}),
	pillar: Object.freeze({
		w: 24,
		h: 64,
		n: 4,
		fps: 12
	}),
	wallFlame: Object.freeze({
		w: 16,
		h: 24,
		n: 4,
		fps: 10
	})
}), Ks = Object.freeze([
	mo,
	Ro,
	gs,
	Ts,
	zs
]), qs = /* @__PURE__ */ new Map(), Js = /* @__PURE__ */ new Map();
for (let e of Ks) for (let t of Object.keys(e.FRAMES)) {
	if (Object.hasOwn(Gs, t) || qs.has(t)) throw Error(`FxSprites: the FX frame "${t}" is defined twice`);
	qs.set(t, e);
}
for (let e of Ks) for (let [t, n] of Object.entries(e.RESERVED ?? {})) {
	if (Object.hasOwn(Gs, t) || qs.has(t) || Js.has(t)) throw Error(`FxSprites: the reserved FX cells "${t}" collide with a frame`);
	Js.set(t, Object.freeze({
		w: n.w,
		h: n.h,
		n: n.n,
		fps: 0,
		late: n.late
	}));
}
var Ys = {
	...Gs,
	...Object.fromEntries([...qs].map(([e, t]) => [e, Object.freeze({ ...t.FRAMES[e] })]))
}, Xs = 3;
function Zs(e) {
	let t = [...Object.keys(e.FRAMES), ...Object.keys(e.RESERVED ?? {})];
	for (let n of t) {
		if (Object.hasOwn(Gs, n) || qs.has(n) || Js.has(n) || t.indexOf(n) !== t.lastIndexOf(n)) throw Error(`FxSprites: the FX frame "${n}" is defined twice`);
		if (!(+((Object.hasOwn(e.FRAMES, n) ? e.FRAMES[n] : e.RESERVED[n]).late ?? 0) >= Xs)) throw Error(`FxSprites: the pack's FX frame "${n}" must say late ≥ ${Xs}`);
	}
	for (let t of Object.keys(e.FRAMES)) qs.set(t, e), Ys[t] = Object.freeze({ ...e.FRAMES[t] });
	for (let [t, n] of Object.entries(e.RESERVED ?? {})) Js.set(t, Object.freeze({
		w: n.w,
		h: n.h,
		n: n.n,
		fps: 0,
		late: n.late
	}));
}
var X = 255, Z = 228, Q = 196, Qs = 158, $s = 112, ec = 76;
function tc(e, t, n, r, i) {
	let a = (a, o, s) => {
		a = Math.round(a), o = Math.round(o), !(a < 0 || o < 0 || a >= r || o >= i) && e.set(t + a, n + o, [
			s,
			s,
			s,
			255
		]);
	}, o = (a, o) => a < 0 || o < 0 || a >= r || o >= i ? 0 : e.getAlpha(t + a, n + o), s = (r, i) => o(r, i) ? e.get(t + r, n + i)[0] : 0;
	return {
		set: a,
		get: o,
		lum: s,
		max: (e, t, n) => {
			s(Math.round(e), Math.round(t)) < n && a(e, t, n);
		},
		rim: (e = ec) => {
			let t = [];
			for (let e = 0; e < i; e++) for (let n = 0; n < r; n++) o(n, e) || (o(n - 1, e) || o(n + 1, e) || o(n, e - 1) || o(n, e + 1)) && t.push([n, e]);
			for (let [n, r] of t) a(n, r, e);
		},
		w: r,
		h: i
	};
}
function nc(e, { cx: t, cy: n, rx: r, ry: i, thick: a, a0: o, a1: s, lead: c }) {
	let { w: l, h: u } = e;
	for (let d = 0; d < u; d++) for (let u = 0; u < l; u++) {
		let l = (u + .5 - t) / r, f = (n - (d + .5)) / i, p = Math.hypot(l, f), m = Math.atan2(f, l);
		if (m < o || m > s || f < -.05) continue;
		let h = (m - o) / Math.max(1e-6, s - o), g = c === "right" ? 1 - h : h, _ = a * (.35 + .65 * (1 - g));
		if (p > 1 || p < 1 - _) continue;
		let v = p > 1 - _ * .35;
		e.set(u, d, v ? g < .3 ? X : Z : g < .5 ? Q : Qs);
	}
}
var rc = {
	slash(e, t) {
		let n = [
			{
				a0: .15,
				a1: 1.2,
				lead: "left",
				thick: .28
			},
			{
				a0: .1,
				a1: 2.2,
				lead: "left",
				thick: .34
			},
			{
				a0: .35,
				a1: 3,
				lead: "left",
				thick: .3
			},
			{
				a0: 1.7,
				a1: 3.05,
				lead: "left",
				thick: .18
			}
		][t];
		if (nc(e, {
			cx: 24,
			cy: 22.5,
			rx: 22.5,
			ry: 21,
			...n
		}), t === 3) for (let t = 3; t < 20; t += 3) e.set(t, 20 - t % 2, Qs);
	},
	slashBig(e, t) {
		let n = [
			{
				a0: .12,
				a1: 1.3,
				lead: "left",
				thick: .3
			},
			{
				a0: .08,
				a1: 2.4,
				lead: "left",
				thick: .38
			},
			{
				a0: .3,
				a1: 3.05,
				lead: "left",
				thick: .34
			},
			{
				a0: 1.6,
				a1: 3.08,
				lead: "left",
				thick: .2
			}
		][t];
		if (nc(e, {
			cx: 32,
			cy: 30.5,
			rx: 31,
			ry: 29,
			...n
		}), t >= 2) for (let n = 0; n < 6; n++) e.set(6 + n * 9, 4 + n * 7 % 5 + (t === 3 ? 6 : 0), X);
	},
	spin(e, t) {
		let { w: n } = e, r = n / 2, i = t / 4 * Math.PI * 2;
		for (let t = 0; t < n; t++) for (let a = 0; a < n; a++) {
			let n = a + .5 - r, o = t + .5 - r, s = Math.hypot(n, o);
			if (s > 30.5 || s < 24.5) continue;
			let c = (i - Math.atan2(-o, n)) % (Math.PI * 2);
			if (c < 0 && (c += Math.PI * 2), c > 4.6) continue;
			let l = s > 28.5, u = c < .6 ? l ? X : Z : c < 2 ? l ? Z : Q : c < 3.4 ? Q : Qs;
			c > 3.4 && a + t & 1 || e.set(a, t, u);
		}
	},
	thrust(e, t) {
		let n = [
			26,
			44,
			40
		][t], r = [
			20,
			3,
			7
		][t];
		for (let i = 0; i < n; i++) {
			let a = i / n, o = Math.max(0, (a < .85 ? 1 + Math.round(3 * a) : Math.round(4 * (1 - a) / .15)) - +(t === 2));
			if (!(t === 2 && a < .35 && i % 4 == 1)) for (let t = -o; t <= o; t++) {
				let n = Math.abs(t) <= Math.max(0, o - 2);
				e.set(r + i, 6 + t, n ? X : Math.abs(t) === o ? Qs : Z);
			}
		}
	},
	impact(e, t) {
		let n = 7.5, r = [
			3,
			6,
			7,
			7
		][t];
		if (t < 3) {
			for (let t = -r; t <= r; t++) {
				let i = Math.abs(t) < 2 ? X : Math.abs(t) < r - 1 ? Z : Q;
				e.set(n + t, n, i), e.set(n, n + t, i);
			}
			if (t >= 1) for (let t = -Math.floor(r / 2); t <= Math.floor(r / 2); t++) e.max(n + t, n + t, Q), e.max(n + t, n - t, Q);
			if (t === 0) for (let [t, n] of [
				[6.5, 6.5],
				[8.5, 6.5],
				[6.5, 8.5],
				[8.5, 8.5]
			]) e.set(t, n, X);
		}
		if (t === 2) for (let t = 0; t < 16; t++) {
			let r = t / 16 * Math.PI * 2;
			e.max(n + Math.cos(r) * 6.5, n + Math.sin(r) * 6.5, Qs);
		}
		if (t === 3) for (let [t, n] of [
			[1, 3],
			[13, 2],
			[2, 12],
			[14, 13],
			[7, 0],
			[8, 15],
			[0, 8],
			[15, 7]
		]) e.set(t, n, Z);
	},
	crit(e, t) {
		let n = 11.5, r = [
			4,
			10,
			11,
			9
		][t];
		for (let i = 0; i < 8; i++) {
			let a = i / 8 * Math.PI * 2, o = i % 2 ? r * .62 : r;
			for (let r = 0; r <= o; r += .5) {
				let i = r < 2.5 ? X : r < o - 2 ? Z : Q;
				t === 3 && r > 3 && Math.floor(r) % 2 || e.max(n + Math.cos(a) * r, n + Math.sin(a) * r, i);
			}
		}
		for (let r = -2; r <= 2; r++) for (let i = -2; i <= 2; i++) i * i + r * r <= (t === 0 ? 2 : 5) && e.set(n + i, n + r, X);
		if (t >= 2) for (let r = 0; r < 20; r++) {
			let i = r / 20 * Math.PI * 2 + .1;
			e.max(n + Math.cos(i) * (t === 2 ? 8 : 10), n + Math.sin(i) * (t === 2 ? 8 : 10), Qs);
		}
	},
	dust(e, t) {
		let n = [
			[
				[
					8,
					10,
					3.2
				],
				[
					5.5,
					11,
					2.2
				],
				[
					10.5,
					11,
					2.2
				]
			],
			[
				[
					8,
					9,
					4.2
				],
				[
					4.5,
					10.5,
					3
				],
				[
					11.5,
					10.5,
					3
				],
				[
					8,
					6,
					2.6
				]
			],
			[
				[
					8,
					8,
					4.8
				],
				[
					3.5,
					10,
					3.2
				],
				[
					12.5,
					10,
					3.2
				],
				[
					7,
					4.5,
					3
				]
			]
		][t];
		for (let r = 0; r < 16; r++) for (let i = 0; i < 16; i++) {
			let a = null;
			for (let [e, t, o] of n) {
				let n = i + .5 - e, s = r + .5 - t;
				if (n * n + s * s <= o * o) {
					let e = (-n - s) / o;
					a = a === null ? e : Math.max(a, e);
				}
			}
			a !== null && (t !== 2 || (i * 3 + r * 5) % 4 != 0) && e.set(i, r, a > .7 ? X : a > -.1 ? Z : a > -.8 ? Q : Qs);
		}
	},
	arrow(e) {
		for (let t = 3; t <= 12; t++) e.set(t, 1, t < 5 ? Z : Q), e.set(t, 2, t < 5 ? Q : Qs);
		e.set(0, 0, Z), e.set(1, 0, Z), e.set(2, 1, Z), e.set(0, 3, Q), e.set(1, 3, Q), e.set(2, 2, Q), e.set(13, 0, Z), e.set(13, 1, X), e.set(14, 1, X), e.set(15, 1, X), e.set(13, 2, X), e.set(14, 2, Z), e.set(13, 3, Q);
	},
	emberBolt(e, t) {
		for (let n = 0; n < 16; n++) for (let r = 0; r < 16; r++) {
			let i = r + .5 - 9.5, a = n + .5 - 8, o = Math.hypot(i, a), s = Math.sin(t ? (n + 1) * 1.7 : n * 1.3 + 1), c = i < 0 ? Math.max(0, -i) * .55 : 0, l = 4.2 + c * .9 + s * .9 * (i < 0 ? 1 : .3);
			o > l || i < 0 && Math.abs(a) > 5 - c * .45 || e.set(r, n, o < 2.2 ? X : o < 3.6 ? Z : o < l - 1 ? Q : Qs);
		}
	},
	boulder(e, t) {
		for (let n = 0; n < 16; n++) for (let r = 0; r < 16; r++) {
			let i = r + .5 - 8, a = n + .5 - 8, o = Math.atan2(a, i) + t * .8, s = 6.2 + Math.sin(o * 3) * .7 + Math.cos(o * 5) * .4;
			if (Math.hypot(i, a) > s) continue;
			let c = (-i - a) / s;
			e.set(r, n, c > .55 ? X : c > 0 ? Z : c > -.55 ? Q : Qs);
		}
		let n = t ? [
			[5, 9],
			[6, 8],
			[7, 8],
			[8, 7],
			[9, 6]
		] : [
			[9, 4],
			[8, 5],
			[8, 6],
			[7, 7],
			[6, 9]
		];
		for (let [t, r] of n) e.set(t, r, $s);
		e.rim($s);
	},
	coin(e, t) {
		let n = [
			2.9,
			2,
			.8,
			2
		][t];
		for (let r = 0; r < 8; r++) for (let i = 0; i < 8; i++) {
			let a = (i + .5 - 4) / n, o = (r + .5 - 4) / 3.4;
			if (a * a + o * o > 1) continue;
			let s = a * a + o * o > .5;
			e.set(i, r, t === 2 ? r < 4 ? Z : Q : s ? a + o < 0 ? Z : Qs : a - o < 0 ? X : Q);
		}
		t === 0 && e.set(3, 3, X), e.rim(ec);
	},
	heart(e, t) {
		ic(e, t ? [
			"..........",
			".WW...WW..",
			"WLLW.WLLW.",
			"WLLLWLLMM.",
			"LLLLLLLMD.",
			".LLLLLMD..",
			"..LLLMD...",
			"...LMD....",
			"....D.....",
			".........."
		] : [
			"..........",
			"..........",
			".WW..WW...",
			"WLLWWLMM..",
			"LLLLLLMD..",
			".LLLLMD...",
			"..LLMD....",
			"...MD.....",
			"..........",
			".........."
		]), e.rim(ec);
	},
	mana(e, t) {
		let n = 4.5, r = t ? 4 : 3;
		for (let t = 0; t < 10; t++) for (let n = 0; n < 10; n++) {
			let i = Math.abs(n + .5 - 5) + Math.abs(t + .5 - 5);
			i > r || e.set(n, t, i < 1.2 ? X : i < r - 1 ? Z : Q);
		}
		t && (e.set(n, 0, Z), e.set(n, 9, Q), e.set(0, n, Z), e.set(9, n, Q)), e.rim(ec);
	},
	draught(e) {
		ic(e, [
			"...DD.....",
			"...LM.....",
			"...WL.....",
			"..LWLM....",
			".LWLLMD...",
			".WLLLMD...",
			".LLLMMD...",
			".LMMMDD...",
			"..MDDD....",
			"..........",
			"..........",
			".........."
		], 1, 0), e.rim(ec);
	},
	upgrade(e, t) {
		ic(e, [
			"............",
			".....W......",
			"....WLM.....",
			"...WLLMD....",
			"..WLLLMMD...",
			"..LLLWMMD...",
			"..LLLLMDD...",
			"...LLMMD....",
			"....LMD.....",
			".....D......",
			"............",
			"............"
		], 0, 1), t && (e.set(9, 1, X), e.set(10, 2, X), e.set(8, 2, Z), e.set(9, 3, Z)), e.rim(ec);
	},
	core(e, t) {
		for (let n = 0; n < 14; n++) for (let r = 0; r < 14; r++) {
			let i = Math.hypot(r + .5 - 7, n + .5 - 7);
			i > 5.2 || e.set(r, n, i < (t ? 2.4 : 1.8) ? X : i < 3.6 ? Z : i < 4.4 ? Q : $s);
		}
		for (let [t, n] of [
			[2, 3],
			[3, 2],
			[10, 2],
			[11, 3],
			[2, 10],
			[11, 10],
			[6, 12],
			[7, 12]
		]) e.set(t, n, $s);
		e.rim(ec);
	},
	stun(e, t) {
		for (let n = 0; n < 3; n++) {
			let r = (t / 4 + n / 3) * Math.PI * 2, i = 7.5 + Math.cos(r) * 6, a = 3.5 + Math.sin(r) * 2, o = Math.sin(r) > 0 ? X : Q;
			e.set(i, a, o), e.set(i - 1, a, o - 30), e.set(i + 1, a, o - 30), e.set(i, a - 1, o - 30), e.set(i, a + 1, o - 30);
		}
	},
	pillar(e, t) {
		for (let n = 0; n < 64; n++) {
			let r = 1 + (n > 52 ? (n - 52) * .35 : 0);
			for (let i = 0; i < 24; i++) {
				let a = Math.abs(i + .5 - 12);
				a < 2.2 * r ? e.set(i, n, X) : a < 4 * r ? e.set(i, n, Z) : a < 5.5 * r && i + n + t & 1 && e.set(i, n, Q);
			}
		}
		for (let n = 0; n < 7; n++) {
			let r = 2 + n * 7 % 20, i = (60 - (n * 11 + t * 16) % 64 + 64) % 64;
			e.set(r, i, X), e.set(r, i - 1, Z);
		}
	},
	wallFlame(e, t) {
		for (let n = 0; n < 24; n++) {
			let r = 1 - n / 23, i = Math.sin(r * 5 + t * 1.6) * r * 2.2, a = 6.5 * Math.sqrt(1 - r) * (1 - .25 * r) + (t % 2 ? .4 : 0);
			for (let t = 0; t < 16; t++) {
				let o = Math.abs(t + .5 - 8 - i);
				if (o > a) continue;
				let s = o < a * .45 && r < .6;
				e.set(t, n, s ? X : o < a * .75 ? Z : Q);
			}
		}
		e.set(8 + (t % 2 ? 2 : -1), 1 + t, Z);
	}
};
function ic(e, t, n = 0, r = 0) {
	let i = {
		W: X,
		L: Z,
		M: Q,
		D: Qs,
		S: $s,
		R: ec
	};
	t.forEach((t, a) => [...t].forEach((t, o) => {
		i[t] && e.set(n + o, r + a, i[t]);
	}));
}
var ac = Object.freeze({
	W: X,
	L: Z,
	MID: Q,
	D: Qs,
	S: $s,
	R: ec,
	arc: nc,
	stamp: ic
}), oc = 1024, sc = 512, cc = 1;
function lc(e, t) {
	let n = Object.keys(e).sort((t, n) => +(e[t].late ?? 0) - (e[n].late ?? 0) || e[n].h - e[t].h || (t < n ? -1 : 1)), r = {}, i = 0, a = 0, o = 0, s = 0;
	for (let c of n) {
		let { w: n, h: l, n: u } = e[c], d = n + 2, f = l + 2;
		r[c] = [];
		for (let e = 0; e < u; e++) {
			for (;;) {
				let e = t[i];
				if (!e) throw Error(`FxSprites: the FX atlas does not fit in ${oc} × ${oc} (at "${c}")`);
				if (a + d > e.w && (a = 0, o += s, s = 0), d <= e.w && o + f <= e.h) break;
				i++, a = 0, o = 0, s = 0;
			}
			r[c].push({
				x: t[i].x + a + cc,
				y: t[i].y + o + cc
			}), a += d, s = Math.max(s, f);
		}
	}
	return r;
}
function uc() {
	let e = new Ne(oc, oc), t = dc(), n = {};
	for (let [r, i] of Object.entries(Ys)) {
		let a = [], o = qs.get(r);
		t[r].forEach(({ x: t, y: n }, s) => {
			let { w: c, h: l } = i, u = tc(e, t, n, c, l);
			o ? o.paint(r, u, s, ac) : rc[r](u, s), a.push([
				t / oc,
				1 - (n + l) / oc,
				(t + c) / oc,
				1 - n / oc
			]);
		}), n[r] = {
			w: i.w,
			h: i.h,
			n: i.n,
			fps: i.fps,
			rects: a
		};
	}
	let r = e.toCanvas();
	return {
		texture: Me(r, {
			wrap: "clamp",
			mipmaps: !1,
			srgb: !0,
			name: "fx:atlas"
		}),
		canvas: r,
		frames: n
	};
}
function dc() {
	let e = {
		...Object.fromEntries([...qs.keys()].map((e) => [e, Ys[e]])),
		...Object.fromEntries(Js)
	};
	return {
		...lc(Gs, [{
			x: 0,
			y: 0,
			w: sc,
			h: sc
		}]),
		...lc(e, [{
			x: sc,
			y: 0,
			w: 512,
			h: sc
		}, {
			x: 0,
			y: sc,
			w: oc,
			h: 512
		}])
	};
}
//#endregion
//#region src/engine/sprite/Sprite3D.js
var fc = /* @__PURE__ */ new Set(), pc = "\nfloat luminatiBayer4( vec2 p ) {\n	ivec2 q = ivec2( mod( floor( p ), 4.0 ) );\n	const float M[ 16 ] = float[ 16 ]( 0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0 );\n	return ( M[ q.y * 4 + q.x ] + 0.5 ) / 16.0;\n}\n", mc = "\nvarying vec3 vViewPosition;\nuniform float uWrap;\n\nstruct LambertMaterial {\n	vec3 diffuseColor;\n	float specularStrength;\n};\n\nvoid RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = dot( geometryNormal, directLight.direction );\n	float wrapped = saturate( ( dotNL + uWrap ) / ( 1.0 + uWrap ) );\n	reflectedLight.directDiffuse += wrapped * directLight.color * BRDF_Lambert( material.diffuseColor );\n}\n\nvoid RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n\n#define RE_Direct RE_Direct_Lambert\n#define RE_IndirectDiffuse RE_IndirectDiffuse_Lambert\n", hc = "\n	{\n		vec3 lnUp = normalize( ( viewMatrix * vec4( 0.0, 1.0, 0.0, 0.0 ) ).xyz );\n		vec3 lnCam = isOrthographic ? vec3( 0.0, 0.0, 1.0 ) : normalize( vViewPosition );\n		vec3 lnN = normalize( mix( lnCam, lnUp, uNormalUp ) );\n		lnN = normalize( lnN + vec3( ( vQuadUv.x * 2.0 - 1.0 ) * uRoundness, 0.0, 0.0 ) );\n		normal = lnN;\n		nonPerturbedNormal = lnN;\n	}\n", gc = "\n#ifdef USE_SHADOWMAP\n	vec4 luminatiSavedWorldPosition = worldPosition;\n	{\n		vec3 lsH = vec3( uSunDirection.x, 0.0, uSunDirection.z );\n		float lsLen = length( lsH );\n		vec3 lsN = lsH / max( lsLen, 1e-4 );\n		float lsSd = dot( worldPosition.xyz - ( LUMINATI_SHADOW_CENTER ), lsN );\n		float lsSkip = max( 0.0, - lsSd ) / max( lsLen, 0.25 ) * uShadowSkip + uShadowSkipBias;\n		worldPosition.xyz += uSunDirection * lsSkip;\n	}\n#endif\n#include <shadowmap_vertex>\n#ifdef USE_SHADOWMAP\n	worldPosition = luminatiSavedWorldPosition;\n#endif\n";
function _c(e, t, { shadowCenter: n = "modelMatrix[ 3 ].xyz" } = {}) {
	Object.assign(e.uniforms, t), e.uniforms.uSunDirection = M.uSunDirection, e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>
varying vec2 vQuadUv;
uniform vec3 uSunDirection;
uniform float uShadowSkip;
uniform float uShadowSkipBias;
#define LUMINATI_SHADOW_CENTER ${n}`).replace("#include <uv_vertex>", "#include <uv_vertex>\n	vQuadUv = uv;").replace("#include <shadowmap_vertex>", gc), e.fragmentShader = e.fragmentShader.replace("#include <common>", "#include <common>\nvarying vec2 vQuadUv;\nuniform float uNormalUp;\nuniform float uRoundness;").replace("#include <lights_lambert_pars_fragment>", mc).replace("#include <normal_fragment_maps>", `#include <normal_fragment_maps>\n${hc}`);
}
var vc = "getPointLightInfo( pointLight, geometryPosition, directLight );";
if (!Ce.lights_fragment_begin.includes(vc)) throw Error("Sprite3D: three's lights_fragment_begin changed (the point lights under a hit flash)");
var yc = Ce.lights_fragment_begin.replace(vc, `${vc}\n\t\tdirectLight.color *= 1.0 - uFlash.a;`);
function bc(e, t) {
	e.uniforms.uFlash = t.uFlash, e.uniforms.uGlow = t.uGlow, e.uniforms.uHighlight = t.uHighlight, e.fragmentShader = e.fragmentShader.replace("#include <common>", "#include <common>\nuniform vec4 uFlash;\nuniform vec4 uGlow;\nuniform vec4 uHighlight;").replace("#include <lights_fragment_begin>", yc).replace("totalEmissiveRadiance *= diffuseColor.rgb;", "totalEmissiveRadiance *= diffuseColor.rgb;\n	if ( diffuseColor.a < 0.98 ) totalEmissiveRadiance += uGlow.rgb * uGlow.a * diffuseColor.rgb;").replace("#include <opaque_fragment>", "#include <opaque_fragment>\n	if ( uHighlight.a > 0.0 ) {\n		vec3 hlBase = gl_FragColor.rgb;\n		float hlLum = dot( hlBase, vec3( 0.2126, 0.7152, 0.0722 ) );\n		gl_FragColor.rgb += ( hlBase * uHighlight.rgb * ( 1.0 - smoothstep( 0.45, 1.2, hlLum ) ) + uHighlight.rgb * 0.035 ) * uHighlight.a;\n	}\n	gl_FragColor.rgb = mix( gl_FragColor.rgb, uFlash.rgb, uFlash.a );");
}
function xc(e) {
	let t = e.source.version, n = e.clone();
	return n.source.version = t, n;
}
var Sc = null, Cc = 0;
function wc() {
	if (!Sc) {
		let e = document.createElement("canvas");
		e.width = 32, e.height = 32;
		let t = e.getContext("2d"), n = t.createImageData(32, 32);
		for (let e = 0; e < 32; e++) for (let t = 0; t < 32; t++) {
			let r = (t + .5) / 32 * 2 - 1, i = (e + .5) / 32 * 2 - 1, a = 1 - Ec(.2, 1, Math.sqrt(r * r + i * i)), o = (e * 32 + t) * 4;
			n.data[o] = n.data[o + 1] = n.data[o + 2] = 255, n.data[o + 3] = Math.round(a * 255);
		}
		t.putImageData(n, 0, 0);
		let r = new ie(e);
		r.colorSpace = "", r.generateMipmaps = !0, r.minFilter = he, r.magFilter = pe;
		let i = new f(1, 1);
		i.rotateX(-Math.PI / 2), Sc = {
			texture: r,
			geometry: i
		};
	}
	return Cc++, Sc;
}
function Tc() {
	--Cc <= 0 && Sc && (Sc.texture.dispose(), Sc.geometry.dispose(), Sc = null, Cc = 0);
}
function Ec(e, t, n) {
	let r = Math.min(1, Math.max(0, (n - e) / (t - e)));
	return r * r * (3 - 2 * r);
}
var Dc = /_(down|left|right|up)$/, Oc = new l();
function kc(e) {
	if (!e || e.frameWidth) return e;
	let t = Math.max(1, e.frames | 0 || 1), n = e.texture && e.texture.image, r = e.width;
	t > 1 && n && n.width && Math.abs(n.width - e.width) < .5 && (r = e.width / t);
	let i = {};
	if (t > 1) {
		let n = [];
		for (let e = 0; e < t; e++) n.push({
			col: e,
			row: 0
		});
		i.idle = {
			frames: n,
			fps: e.fps || 8,
			loop: !0
		};
	}
	return {
		texture: e.texture,
		canvas: e.canvas,
		frameWidth: r,
		frameHeight: e.height,
		columns: t,
		rows: 1,
		pixelsPerUnit: e.pixelsPerUnit || 16,
		anchor: e.anchor || [.5, 0],
		animations: i
	};
}
var Ac = class e extends y {
	constructor(e, t = {}) {
		super(), e = kc(e);
		let n = {
			billboard: "cylindrical",
			tilt: 0,
			castShadow: !0,
			shadowMode: "sunFacing",
			blobShadow: !0,
			lit: !0,
			alphaTest: .5,
			emissive: null,
			emissiveIntensity: 1,
			scale: 1,
			renderOrder: 0,
			receiveShadow: !0,
			normalUp: .55,
			wrap: .6,
			roundness: .8,
			ditherMode: "screen",
			blobSize: null,
			blobOpacity: .5,
			tint: null,
			animation: null,
			direction: "down",
			combatFx: !1,
			...t
		};
		this.type = "Sprite3D", this.isSprite3D = !0, this._opts = n, this.sheet = e, this._resolveCache = /* @__PURE__ */ new Map(), this.billboard = n.billboard, this.tilt = n.tilt, this.speed = 1, this.playing = !0, this.animation = null, this.direction = Te.includes(n.direction) ? n.direction : "down", this.finished = !1, this.onFrameChange = null, this.onAnimationEnd = null, this._anim = null, this._animKey = null, this._autoFlip = !1, this._flipX = !1, this._frame = 0, this._time = 0, this._col = 0, this._row = 0, this._opacity = 1, this._bodyOpacity = 1, this._shadowMode = n.shadowMode === "billboard" ? "billboard" : "sunFacing";
		let r = e.pixelsPerUnit || 16, i = e.texture.image, a = i && i.width || e.canvas && e.canvas.width || e.columns * e.frameWidth, o = i && i.height || e.canvas && e.canvas.height || e.rows * e.frameHeight;
		this._frameU = e.frameWidth / a, this._frameV = e.frameHeight / o, this.texture = xc(e.texture), this.texture.matrixAutoUpdate = !0;
		let [s, c] = e.anchor || [.5, 0], l = e.frameWidth / r, u = e.frameHeight / r;
		this._size = new O(l, u);
		let d = new f(l, u);
		if (d.translate(l * (.5 - s), u * (.5 - c), 0), this._uniforms = {
			uNormalUp: { value: n.normalUp },
			uWrap: { value: n.wrap },
			uRoundness: { value: n.roundness },
			uShadowSkip: { value: 0 },
			uShadowSkipBias: { value: .04 },
			uDitherOpacity: { value: 1 },
			uShadowDither: { value: 1 },
			uDitherTexel: { value: +(n.ditherMode === "texel") },
			uFrameSize: { value: new O(e.frameWidth, e.frameHeight) }
		}, this._fx = !!(n.combatFx && n.lit), this._fx && (this._uniforms.uFlash = { value: new oe(0, 0, 0, 0) }, this._uniforms.uGlow = { value: new oe(0, 0, 0, 0) }, this._uniforms.uHighlight = { value: new oe(0, 0, 0, 0) }), this.material = n.lit ? this._createLitMaterial(n) : this._createUnlitMaterial(n), n.tint != null && this.material.color.set(n.tint), this.mesh = new ne(d, this.material), this.mesh.name = "Sprite3D.mesh", this.mesh.rotation.order = "YXZ", this.mesh.renderOrder = n.renderOrder, this.mesh.customDepthMaterial = this._createDepthMaterial(), this.add(this.mesh), this._proxyMaterial = new ve({
			map: this.texture,
			alphaTest: n.alphaTest,
			side: 2,
			colorWrite: !1,
			depthWrite: !1,
			fog: !1
		}), this.shadowProxy = new ne(d, this._proxyMaterial), this.shadowProxy.name = "Sprite3D.shadowProxy", this.shadowProxy.castShadow = !0, this.shadowProxy.receiveShadow = !1, this.shadowProxy.customDepthMaterial = this.mesh.customDepthMaterial, this.add(this.shadowProxy), this.blob = null, this._blobOpacity = n.blobOpacity, n.blobShadow) {
			let e = wc();
			this._blobMaterial = new ve({
				color: 788498,
				map: e.texture,
				transparent: !0,
				opacity: n.blobOpacity,
				depthWrite: !1,
				polygonOffset: !0,
				polygonOffsetFactor: -2,
				polygonOffsetUnits: -4
			});
			let t = n.blobSize || [Math.max(.7, l * .52), Math.max(.36, l * .26)];
			this.blob = new ne(e.geometry, this._blobMaterial), this.blob.name = "Sprite3D.blob", this.blob.scale.set(t[0], 1, t[1]), this.blob.position.y = .012, this.blob.renderOrder = we.DECALS, this.blob.castShadow = !1, this.blob.receiveShadow = !1, this.add(this.blob);
		}
		this.scale.setScalar(n.scale), this._ready = !0, this.castShadow = n.castShadow, this.receiveShadow = n.receiveShadow;
		let p = n.animation || (this._resolve("idle") ? "idle" : null);
		p && this._resolve(p) ? this.play(p) : this._applyFrame();
	}
	_createLitMaterial(e) {
		let t = this._uniforms, n = new _e({
			map: this.texture,
			alphaTest: e.alphaTest,
			side: 2
		});
		return e.emissive != null && (n.emissive.set(e.emissive), n.emissiveIntensity = e.emissiveIntensity ?? 1), n.onBeforeCompile = (e) => {
			_c(e, t), e.uniforms.uDitherOpacity = t.uDitherOpacity, e.uniforms.uDitherTexel = t.uDitherTexel, e.uniforms.uFrameSize = t.uFrameSize, e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>
uniform float uDitherOpacity;
uniform float uDitherTexel;
uniform vec2 uFrameSize;
${pc}`).replace("#include <alphatest_fragment>", "#include <alphatest_fragment>\n	if ( uDitherOpacity < 0.999 ) {\n		vec2 ldp = mix( gl_FragCoord.xy, vQuadUv * uFrameSize, uDitherTexel );\n		if ( uDitherOpacity <= luminatiBayer4( ldp ) ) discard;\n	}").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n	totalEmissiveRadiance *= diffuseColor.rgb;"), t.uFlash && bc(e, t);
		}, n.customProgramCacheKey = t.uFlash ? () => "luminati-sprite3d-lit-fx-v1" : () => "luminati-sprite3d-lit-v1", n;
	}
	_createUnlitMaterial(e) {
		let t = this._uniforms, n = new ve({
			map: this.texture,
			alphaTest: e.alphaTest,
			side: 2
		});
		return e.emissive != null && n.color.set(e.emissive).multiplyScalar(e.emissiveIntensity ?? 1), n.onBeforeCompile = (e) => {
			e.uniforms.uDitherOpacity = t.uDitherOpacity, e.uniforms.uDitherTexel = t.uDitherTexel, e.uniforms.uFrameSize = t.uFrameSize, e.vertexShader = e.vertexShader.replace("#include <common>", "#include <common>\nvarying vec2 vQuadUv;").replace("#include <uv_vertex>", "#include <uv_vertex>\n	vQuadUv = uv;"), e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>
varying vec2 vQuadUv;
uniform float uDitherOpacity;
uniform float uDitherTexel;
uniform vec2 uFrameSize;
${pc}`).replace("#include <alphatest_fragment>", "#include <alphatest_fragment>\n	if ( uDitherOpacity < 0.999 ) {\n		vec2 ldp = mix( gl_FragCoord.xy, vQuadUv * uFrameSize, uDitherTexel );\n		if ( uDitherOpacity <= luminatiBayer4( ldp ) ) discard;\n	}");
		}, n.customProgramCacheKey = () => "luminati-sprite3d-unlit-v1", n;
	}
	_createDepthMaterial() {
		let e = this._uniforms, t = new _({
			depthPacking: ee,
			map: this.texture,
			alphaTest: this.material.alphaTest,
			side: 2
		});
		return t.onBeforeCompile = (t) => {
			t.uniforms.uDitherOpacity = e.uShadowDither, t.fragmentShader = t.fragmentShader.replace("#include <common>", `#include <common>\nuniform float uDitherOpacity;\n${pc}`).replace("#include <alphatest_fragment>", "#include <alphatest_fragment>\n	if ( uDitherOpacity < 0.999 && uDitherOpacity <= luminatiBayer4( gl_FragCoord.xy ) ) discard;");
		}, t.customProgramCacheKey = () => "luminati-sprite3d-depth-v1", t;
	}
	get tint() {
		return this.material.color;
	}
	set tint(e) {
		this.material.color.set(e);
	}
	get opacity() {
		return this._opacity;
	}
	set opacity(e) {
		this._opacity = e < 0 ? 0 : e > 1 ? 1 : e, this._applyOpacity();
	}
	get bodyOpacity() {
		return this._bodyOpacity;
	}
	set bodyOpacity(e) {
		this._bodyOpacity = e < 0 ? 0 : e > 1 ? 1 : e, this._applyOpacity();
	}
	_applyOpacity() {
		let e = this._opacity, t = e * this._bodyOpacity;
		this._uniforms.uDitherOpacity.value = t, this._uniforms.uShadowDither.value = e;
		let n = e > .001;
		this.mesh.visible = this._shadowMode === "billboard" ? n : t > .001, this.blob && (this._blobMaterial.opacity = this._blobOpacity * e, this.blob.visible = n), this._applyShadowFlags();
	}
	get flipX() {
		return this._flipX;
	}
	set flipX(e) {
		e = !!e, e !== this._flipX && (this._flipX = e, this._applyFrame());
	}
	get castShadow() {
		return !!this._castShadow;
	}
	set castShadow(e) {
		this._castShadow = !!e, this._ready && this._applyShadowFlags();
	}
	get receiveShadow() {
		return !!this._receiveShadow;
	}
	set receiveShadow(e) {
		this._receiveShadow = !!e, this._ready && this._applyShadowFlags();
	}
	get shadowMode() {
		return this._shadowMode;
	}
	set shadowMode(e) {
		this._shadowMode = e === "billboard" ? "billboard" : "sunFacing", this._ready && this._applyOpacity();
	}
	get frame() {
		return this._frame;
	}
	setFlash(e, t, n, r) {
		return this._fx && this._uniforms.uFlash.value.set(e, t, n, r), this;
	}
	setGlow(e, t, n, r) {
		return this._fx && this._uniforms.uGlow.value.set(e, t, n, r), this;
	}
	setHighlight(e, t, n, r) {
		return this._fx && this._uniforms.uHighlight.value.set(e, t, n, r), this;
	}
	get flash() {
		return this._fx ? this._uniforms.uFlash.value.toArray() : [
			0,
			0,
			0,
			0
		];
	}
	get highlight() {
		return this._fx ? this._uniforms.uHighlight.value.toArray() : [
			0,
			0,
			0,
			0
		];
	}
	get glow() {
		return this._fx ? this._uniforms.uGlow.value.toArray() : [
			0,
			0,
			0,
			0
		];
	}
	get size() {
		return this._size;
	}
	_applyShadowFlags() {
		let e = this._castShadow && this._opacity > .001, t = this._shadowMode === "sunFacing";
		this.shadowProxy.visible = e && t, this.mesh.castShadow = e && !t, this.mesh.receiveShadow = !!this._receiveShadow, this._uniforms.uShadowSkip.value = e && t ? 1 : 0;
	}
	_resolve(e, t = this.direction) {
		let n = this._resolveCache.get(e);
		n || (n = /* @__PURE__ */ new Map(), this._resolveCache.set(e, n));
		let r = n.get(t);
		return r === void 0 && (r = this._resolveUncached(e, t), n.set(t, r)), r;
	}
	_resolveUncached(e, t) {
		let n = this.sheet.animations || {}, r = Dc.exec(e), i = r ? e.slice(0, -r[0].length) : e, a = r ? r[1] : t;
		if (!r && n[e]) return {
			key: e,
			name: e,
			base: null,
			anim: n[e],
			flip: !1
		};
		let o = `${i}_${a}`;
		if (n[o]) return {
			key: o,
			name: o,
			base: i,
			anim: n[o],
			flip: !1
		};
		let s = a === "left" ? "right" : a === "right" ? "left" : null;
		return s && n[`${i}_${s}`] ? {
			key: `${i}_${s}`,
			name: o,
			base: i,
			anim: n[`${i}_${s}`],
			flip: !0
		} : r && n[e] ? {
			key: e,
			name: e,
			base: i,
			anim: n[e],
			flip: !1
		} : null;
	}
	play(e, t = {}) {
		let { restart: n = !1, speed: r, keepPhase: i = !1 } = t, a = this._resolve(e);
		return a ? a.name === this.animation && !n && !this.finished ? (r !== void 0 && (this.speed = r), this.playing = !0, this) : (this.speed = r === void 0 ? 1 : r, this._setAnimation(a, !i || n || this.finished), this.playing = !0, this) : (fc.has(e) || (fc.add(e), console.warn(`Sprite3D: unknown animation "${Ae(e)}"`)), this);
	}
	_setAnimation(e, t) {
		if (this._anim = e.anim, this._animKey = e.key, this._autoFlip = e.flip, this.animation = e.name, e.base !== null) {
			let t = Dc.exec(e.name);
			t && (this.direction = t[1]);
		}
		let n = Math.max(1, e.anim.frames.length);
		t ? (this._frame = 0, this._time = 0, this.finished = !1) : this._frame %= n;
		let r = e.anim.frames[this._frame] || e.anim.frames[0];
		r && (this._col = r.col, this._row = r.row), this._applyFrame();
	}
	setDirection(e) {
		if (e === this.direction || !Te.includes(e)) return this;
		if (this.direction = e, this.animation) {
			let t = Dc.exec(this.animation);
			if (t) {
				let n = this._resolve(`${this.animation.slice(0, -t[0].length)}_${e}`, e);
				n && this._setAnimation(n, !1);
			}
		}
		return this;
	}
	faceVector(t, n, r = M.uCameraYaw.value) {
		let i = e.directionFromVector(t, n, r, this.direction);
		return this.setDirection(i);
	}
	setFrame(e, t) {
		return this._col = e, this._row = t, this._autoFlip = !1, this._anim = null, this._animKey = null, this.animation = null, this.finished = !1, this._frame = 0, this._time = 0, this.playing = !1, this._applyFrame(), this;
	}
	_applyFrame() {
		let e = this.texture, t = this._frameU, n = this._frameV, r = this._flipX !== this._autoFlip;
		e.repeat.set(r ? -t : t, n), e.offset.set((this._col + +!!r) * t, 1 - (this._row + 1) * n);
	}
	update(e, t) {
		let n = this._anim;
		if (this.playing && n && n.frames.length > 0) {
			let t = n.fps > 0 ? n.fps : 8;
			this._time += e * this.speed;
			let r = 1 / t;
			if (this._time >= r) {
				let e = Math.floor(this._time / r);
				this._time -= e * r;
				let t = n.frames.length, i = this._frame + e;
				if (i >= t && (n.loop === !1 ? (i = t - 1, this.playing = !1, this.finished || (this.finished = !0, this.onAnimationEnd && this.onAnimationEnd(this.animation))) : i %= t), i !== this._frame) {
					this._frame = i;
					let e = n.frames[i];
					this._col = e.col, this._row = e.row, this._applyFrame(), this.onFrameChange && this.onFrameChange(i, this.animation);
				}
			}
		}
		let r = M.uCameraYaw.value, i = this.rotation.y;
		if (this.billboard === "cylindrical" || this.billboard === "spherical" && !t) {
			let e = 0;
			if (t && this.tilt !== 0) {
				let n = t.matrixWorld.elements[9];
				e = Math.asin(n < -1 ? -1 : n > 1 ? 1 : n);
			}
			this.mesh.rotation.set(-e * this.tilt, r - i, 0);
		} else this.billboard === "spherical" && (Oc.setFromRotationMatrix(t.matrixWorld), this.mesh.quaternion.copy(this.quaternion).invert().multiply(Oc));
		if (this.shadowProxy.visible) {
			let e = M.uSunDirection.value;
			e.x * e.x + e.z * e.z > 1e-8 && (this.shadowProxy.rotation.y = Math.atan2(e.x, e.z) - i);
		}
		this.blob && (this.blob.rotation.y = r - i);
	}
	static directionFromVector(e, t, n = 0, r = "down") {
		let i = Math.cos(n), a = Math.sin(n), o = e * i - t * a, s = e * a + t * i, c = Math.abs(o), l = Math.abs(s);
		if (c < 1e-6 && l < 1e-6) return r;
		let u = r === "left" || r === "right", d = 1.15;
		return (u ? c * d >= l : c > l * d) ? o > 0 ? "right" : "left" : s > 0 ? "down" : "up";
	}
	clone() {
		let e = new this.constructor(this.sheet, {
			...this._opts,
			animation: null,
			direction: this.direction
		});
		return e.name = this.name, e.visible = this.visible, e.position.copy(this.position), e.quaternion.copy(this.quaternion), e.scale.copy(this.scale), e.billboard = this.billboard, e.tilt = this.tilt, e.tint.copy(this.tint), this.material.emissive && e.material.emissive && (e.material.emissive.copy(this.material.emissive), e.material.emissiveIntensity = this.material.emissiveIntensity), e.flipX = this.flipX, e.opacity = this.opacity, e.bodyOpacity = this.bodyOpacity, e.shadowMode = this.shadowMode, e.castShadow = this.castShadow, e.receiveShadow = this.receiveShadow, this._fx && (e._uniforms.uFlash.value.copy(this._uniforms.uFlash.value), e._uniforms.uGlow.value.copy(this._uniforms.uGlow.value), e._uniforms.uHighlight.value.copy(this._uniforms.uHighlight.value)), this.animation ? e.play(this.animation, { speed: this.speed }) : e.setFrame(this._col, this._row), e.playing = this.playing, e;
	}
	dispose() {
		this.parent && this.parent.remove(this), this.mesh.geometry.dispose(), this.material.dispose(), this.mesh.customDepthMaterial.dispose(), this._proxyMaterial.dispose(), this.texture.dispose(), this.blob && (this._blobMaterial.dispose(), this.blob = null, Tc()), this._anim = null, this.onFrameChange = null, this.onAnimationEnd = null;
	}
}, jc = "\nuniform float uTime;\nuniform float uCameraYaw;\nuniform vec2 uWind;\nuniform float uWindStrength;\nuniform float uFoliageWind;\nuniform float uAnchorY;\nuniform float uQuadHeight;\nuniform float uFrameU;\n#ifdef LUMINATI_FACE_SUN\nuniform vec3 uSunDirection;\n#endif\nattribute float aFrame;\n\nfloat luminatiFoliageYaw() {\n#ifdef LUMINATI_FACE_SUN\n	vec2 sh = uSunDirection.xz;\n	return dot( sh, sh ) > 1e-8 ? atan( sh.x, sh.y ) : uCameraYaw;\n#else\n	return uCameraYaw;\n#endif\n}\n\nvec3 luminatiYawRotate( vec3 v, float yaw ) {\n	float c = cos( yaw );\n	float s = sin( yaw );\n	return vec3( v.x * c + v.z * s, v.y, - v.x * s + v.z * c );\n}\n", Mc = "\n	vec3 transformed = luminatiYawRotate( vec3( position ), luminatiFoliageYaw() );\n	{\n		vec3 lfPos = vec3( 0.0 );\n		float lfScale = 1.0;\n		#ifdef USE_INSTANCING\n			lfPos = instanceMatrix[ 3 ].xyz;\n			lfScale = max( length( instanceMatrix[ 0 ].xyz ), 1e-4 );\n		#endif\n		float lfW = clamp( ( uv.y - uAnchorY ) / max( 1.0 - uAnchorY, 1e-3 ), 0.0, 1.0 );\n		float lfWindLen = length( uWind );\n		vec2 lfDir = lfWindLen > 1e-4 ? uWind / lfWindLen : vec2( 1.0, 0.0 );\n		float lfHash = fract( sin( dot( lfPos.xz, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );\n		float lfWave = dot( lfPos.xz, lfDir ) * 0.42 - uTime * ( 1.25 + lfWindLen * 0.55 );\n		float lfGust = 0.5 + 0.5 * sin( lfWave ) + 0.25 * sin( lfWave * 0.37 + 1.7 );\n		lfGust = lfGust * lfGust;\n		float lfFlutter = sin( uTime * ( 2.1 + lfHash * 1.9 ) + lfHash * 6.2831 );\n		float lfAmt = uWindStrength * uFoliageWind * ( 0.03 + 0.06 * lfWindLen ) * uQuadHeight * lfScale;\n		vec2 lfSway = lfDir * lfAmt * ( 0.3 + lfGust * 1.1 + lfFlutter * 0.25 )\n			+ vec2( - lfDir.y, lfDir.x ) * lfAmt * lfFlutter * 0.3;\n		transformed.xz += lfSway * lfW / lfScale;\n		transformed.y -= dot( lfSway, lfSway ) * lfW / ( lfScale * max( uQuadHeight * lfScale, 0.2 ) ) * 0.5;\n	}\n", Nc = class {
	constructor(e) {
		let { sprite: t, instances: n, wind: r = 1, castShadow: i = !1, receiveShadow: a = !0, alphaTest: o = .5, normalUp: s = .8, wrap: c = .5, roundness: l = .25, rootDarken: d = .35, randomFrames: p = !1, variance: m = .08, seed: h = 1, name: g = "Foliage" } = e, v = t.pixelsPerUnit || 16, y = Math.max(1, t.frames | 0 || 1), b = t.texture.image, x = t.width;
		y > 1 && b && b.width && Math.abs(b.width - t.width) < .5 && (x = t.width / y);
		let S = t.height, [w, T] = t.anchor || [.5, 0], te = x / v, ne = S / v, re = n.length, ie = new f(te, ne);
		ie.translate(te * (.5 - w), ne * (.5 - T), 0);
		let ae = new u(new Float32Array(Math.max(1, re)), 1);
		ie.setAttribute("aFrame", ae), this._ownsTexture = y > 1, this.texture = y > 1 ? xc(t.texture) : t.texture, y > 1 && (this.texture.repeat.set(1 / y, 1), this.texture.offset.set(0, 0)), this._uniforms = {
			uTime: M.uTime,
			uCameraYaw: M.uCameraYaw,
			uWind: M.uWind,
			uWindStrength: M.uWindStrength,
			uFoliageWind: { value: r },
			uAnchorY: { value: T },
			uQuadHeight: { value: ne },
			uFrameU: { value: 1 / y },
			uRootDarken: { value: d },
			uNormalUp: { value: s },
			uWrap: { value: c },
			uRoundness: { value: l },
			uShadowSkip: { value: +!!i },
			uShadowSkipBias: { value: i ? .03 : 0 }
		};
		let oe = this._uniforms, se = new _e({
			map: this.texture,
			alphaTest: o,
			side: 2
		});
		se.onBeforeCompile = (e) => {
			_c(e, oe, { shadowCenter: "( modelMatrix * vec4( instanceMatrix[ 3 ].xyz, 1.0 ) ).xyz" }), Object.assign(e.uniforms, oe), e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n${jc}`).replace("#include <beginnormal_vertex>", "#include <beginnormal_vertex>\n	objectNormal = luminatiYawRotate( objectNormal, luminatiFoliageYaw() );").replace("#include <begin_vertex>", Mc).replace("#include <uv_vertex>", "#include <uv_vertex>\n#ifdef USE_MAP\n	vMapUv.x += aFrame * uFrameU;\n#endif"), e.fragmentShader = e.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uRootDarken;").replace("#include <map_fragment>", "#include <map_fragment>\n	diffuseColor.rgb *= mix( 1.0 - uRootDarken, 1.0, smoothstep( 0.0, 0.6, vQuadUv.y ) );");
		}, se.customProgramCacheKey = () => "luminati-foliage-lit-v1", this.material = se;
		let ce = new _({
			depthPacking: ee,
			map: this.texture,
			alphaTest: o,
			side: 2
		});
		ce.onBeforeCompile = (e) => {
			Object.assign(e.uniforms, oe), e.uniforms.uSunDirection = M.uSunDirection, e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n#define LUMINATI_FACE_SUN\n${jc}`).replace("#include <begin_vertex>", Mc).replace("#include <uv_vertex>", "#include <uv_vertex>\n#ifdef USE_MAP\n	vMapUv.x += aFrame * uFrameU;\n#endif");
		}, ce.customProgramCacheKey = () => "luminati-foliage-depth-v1", this.depthMaterial = ce, this.object = new C(ie, se, Math.max(1, re)), this.object.name = g, this.object.count = re, this.object.customDepthMaterial = ce, this.object.castShadow = i, this.object.receiveShadow = a;
		let le = new Oe(h), ue = new ye(), de = new E(), fe = 0;
		for (let e = 0; e < re; e++) {
			let t = n[e], r = t.scale ?? 1;
			fe = Math.max(fe, r), ue.makeScale(r, r, r), ue.setPosition(t.x, t.y ?? 0, t.z), this.object.setMatrixAt(e, ue), t.tint == null ? de.setRGB(1, 1, 1) : de.set(t.tint), m > 0 && de.multiplyScalar(1 + (le.next() * 2 - 1) * m), this.object.setColorAt(e, de);
			let i = t.frame;
			i ??= p ? Math.floor(le.next() * y) : 0, ae.array[e] = Math.min(y - 1, Math.max(0, i | 0));
		}
		this.object.instanceMatrix.needsUpdate = !0, this.object.instanceColor && (this.object.instanceColor.needsUpdate = !0), ae.needsUpdate = !0, re > 0 && (this.object.computeBoundingSphere(), this.object.boundingSphere.radius += Math.hypot(te, ne) * Math.max(1, fe) + .5), this.count = re;
	}
	get castShadow() {
		return this.object.castShadow;
	}
	set castShadow(e) {
		this.object.castShadow = !!e, this._uniforms.uShadowSkip.value = +!!e, this._uniforms.uShadowSkipBias.value = e ? .03 : 0;
	}
	get receiveShadow() {
		return this.object.receiveShadow;
	}
	set receiveShadow(e) {
		this.object.receiveShadow = !!e;
	}
	get wind() {
		return this._uniforms.uFoliageWind.value;
	}
	set wind(e) {
		this._uniforms.uFoliageWind.value = e;
	}
	update() {}
	dispose() {
		this.object.parent && this.object.parent.remove(this.object), this.object.geometry.dispose(), this.material.dispose(), this.depthMaterial.dispose(), this._ownsTexture && this.texture.dispose(), this.object.dispose();
	}
}, Pc = "\nuniform vec3 uSunDirection;\nuniform float uSteepness;\nuniform float uUseSun;\nuniform vec3 uAxis;\nuniform float uLength;\nuniform float uWidth;\nuniform float uTopWidth;\n\nvarying vec2 vUv;\nvarying vec3 vWorld;\nvarying float vAxisView;\n\n#include <fog_pars_vertex>\n\nvoid main() {\n  vec3 toLight;\n  if (uUseSun > 0.5) {\n    vec3 s = normalize(uSunDirection);\n    float hl = length(s.xz);\n    vec2 hd = hl > 1e-4 ? s.xz / hl : vec2(0.0, 1.0);\n    float el = asin(clamp(s.y, -1.0, 1.0));\n    el = max(el, 0.12);\n    el = mix(el, 1.5707963, uSteepness);\n    toLight = vec3(hd.x * cos(el), sin(el), hd.y * cos(el));\n  } else {\n    toLight = -normalize(uAxis);\n  }\n\n  vec3 base = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;\n  float u = position.x;           // -0.5 .. 0.5 across\n  float v = position.y;           // 0 (ground) .. 1 (top)\n  vec3 c = base + toLight * (v * uLength);\n  vec3 view = normalize(cameraPosition - c);\n  vec3 side = cross(toLight, view);\n  float sl = length(side);\n  side = sl > 1e-4 ? side / sl : vec3(1.0, 0.0, 0.0);\n  float w = uWidth * mix(1.0, uTopWidth, v);\n  vec3 wp = c + side * (u * w);\n\n  vUv = vec2(u * 2.0, v);\n  vWorld = wp;\n  vAxisView = abs(dot(view, toLight));\n\n  vec4 mvPosition = viewMatrix * vec4(wp, 1.0);\n  gl_Position = projectionMatrix * mvPosition;\n  #include <fog_vertex>\n}\n", Fc = "\nuniform vec3 uSunColor;\nuniform vec3 uSunDirection;\nuniform vec3 uColor;\nuniform float uNight;\nuniform float uTime;\nuniform float uIntensity;\nuniform float uGlobalIntensity;\nuniform float uNightStrength;\nuniform float uSeed;\nuniform float uGroundY;\nuniform float uFadeHeight;\nuniform float uLength;\nuniform vec2 uNearFade;\nuniform vec2 uHorizonFade;\nuniform float uGain;\n\nvarying vec2 vUv;\nvarying vec3 vWorld;\nvarying float vAxisView;\n\n#include <fog_pars_fragment>\n\nfloat hash12(vec2 p) {\n  vec3 p3 = fract(vec3(p.xyx) * 0.1031);\n  p3 += dot(p3, p3.yzx + 33.33);\n  return fract((p3.x + p3.y) * p3.z);\n}\n\nfloat vnoise(vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(mix(hash12(i), hash12(i + vec2(1.0, 0.0)), u.x),\n             mix(hash12(i + vec2(0.0, 1.0)), hash12(i + vec2(1.0, 1.0)), u.x), u.y);\n}\n\nvoid main() {\n  float x = vUv.x;                       // -1 .. 1 across\n  float v = vUv.y;                       // 0 bottom .. 1 top\n  float across = exp(-x * x * 3.2) - 0.04;\n  across = max(across, 0.0) / 0.96;\n\n  float topFade = 1.0 - smoothstep(0.5, 1.0, v);\n  float groundFade = smoothstep(uGroundY - 0.2, uGroundY + uFadeHeight, vWorld.y);\n  float mid = mix(0.75, 1.0, smoothstep(0.1, 0.55, v));\n\n  // Streaks parallel to the beam, drifting slowly.\n  float along = v * uLength;\n  float s1 = vnoise(vec2(x * 2.6 + uSeed * 7.1 + uTime * 0.05, along * 0.09 - uTime * 0.12));\n  float s2 = vnoise(vec2(x * 6.3 - uSeed * 3.7 - uTime * 0.08, along * 0.16 - uTime * 0.21));\n  float streak = 0.3 + 0.7 * smoothstep(0.15, 0.85, s1 * 0.62 + s2 * 0.38);\n  // Slow breathing so the scene feels alive.\n  float breathe = 0.82 + 0.18 * sin(uTime * 0.35 + uSeed * 6.2831);\n\n  float axisFade = 1.0 - smoothstep(0.82, 0.98, vAxisView);\n  float camDist = distance(cameraPosition, vWorld);\n  float nearFade = smoothstep(uNearFade.x, uNearFade.y, camDist);\n\n  float sunY = normalize(uSunDirection).y;\n  // Strongest with a low sun (golden hour / morning), weaker at noon, gone as the sun sets.\n  float lowSun = mix(0.4, 1.0, 1.0 - smoothstep(0.3, 0.8, sunY)) * smoothstep(uHorizonFade.x, uHorizonFade.y, sunY);\n  float dayMix = mix(uNightStrength, 1.0, 1.0 - uNight);\n\n  float a = across * topFade * groundFade * mid * streak * breathe * axisFade * nearFade\n          * lowSun * dayMix * uIntensity * uGlobalIntensity;\n\n  #ifdef USE_FOG\n    #ifdef FOG_EXP2\n      float fogF = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);\n    #else\n      float fogF = smoothstep(fogNear, fogFar, vFogDepth);\n    #endif\n    a *= 1.0 - fogF;\n  #endif\n\n  // Slightly desaturated sun colour: beams read as pale warm light, not orange paint.\n  vec3 sunCol = mix(vec3(dot(uSunColor, vec3(0.3, 0.59, 0.11))), uSunColor, 0.72);\n  vec3 col = sunCol * uColor * (a * uGain);\n  gl_FragColor = vec4(col, 1.0);\n  #include <tonemapping_fragment>\n  #include <colorspace_fragment>\n}\n", Ic = null, Lc = 0;
function Rc() {
	return Ic || (Ic = new f(1, 1, 1, 6), Ic.translate(0, .5, 0), Ic.name = "GodRayShaft"), Lc++, Ic;
}
function zc() {
	Lc--, Lc <= 0 && Ic && (Ic.dispose(), Ic = null, Lc = 0);
}
var Bc = class {
	constructor({ steepness: e = .45, color: t = 16773592, nightStrength: n = 0, nearFade: r = [5, 13], fadeHeight: i = 2.2, gain: a = .28, horizonFade: o = [.19, .27] } = {}) {
		this.object = new y(), this.object.name = "GodRays", this.shafts = [], this.fadeHeight = i, this._shared = {
			uTime: { value: 0 },
			uGlobalIntensity: { value: 1 },
			uSteepness: { value: e },
			uNightStrength: { value: n },
			uNearFade: { value: new O(r[0], r[1]) },
			uGain: { value: a },
			uHorizonFade: { value: new O(o[0], o[1]) },
			uTint: new E(t),
			fog: se.clone(xe.fog)
		};
	}
	get intensity() {
		return this._shared.uGlobalIntensity.value;
	}
	set intensity(e) {
		this._shared.uGlobalIntensity.value = e;
	}
	get steepness() {
		return this._shared.uSteepness.value;
	}
	set steepness(e) {
		this._shared.uSteepness.value = e;
	}
	addShaft({ position: e, direction: t, length: n = 14, width: r = 3, intensity: i = 1, color: a, topWidth: o = .7, seed: s } = {}) {
		let c = this._shared, l = {
			uSunDirection: M.uSunDirection,
			uSunColor: M.uSunColor,
			uNight: M.uNight,
			uTime: c.uTime,
			uGlobalIntensity: c.uGlobalIntensity,
			uSteepness: c.uSteepness,
			uNightStrength: c.uNightStrength,
			uNearFade: c.uNearFade,
			uGain: c.uGain,
			uHorizonFade: c.uHorizonFade,
			fogColor: c.fog.fogColor,
			fogDensity: c.fog.fogDensity,
			fogNear: c.fog.fogNear,
			fogFar: c.fog.fogFar,
			uFogStart: M.uFogStart,
			uUseSun: { value: +!t },
			uAxis: { value: t ? new D().copy(t).normalize() : new D(0, -1, 0) },
			uLength: { value: n },
			uWidth: { value: r },
			uTopWidth: { value: o },
			uIntensity: { value: i },
			uColor: { value: a === void 0 ? c.uTint.clone() : new E(a) },
			uSeed: { value: s ?? this.shafts.length * .618 + .13 },
			uGroundY: { value: e ? e.y : 0 },
			uFadeHeight: { value: this.fadeHeight }
		}, u = new b({
			name: "GodRayMaterial",
			uniforms: l,
			vertexShader: Pc,
			fragmentShader: Fc,
			transparent: !0,
			depthWrite: !1,
			depthTest: !0,
			blending: 2,
			side: 2,
			fog: !0
		});
		u.forceSinglePass = !0, u.blendEquation = 100, u.blendSrc = 201, u.blendDst = 203;
		let f = new ne(Rc(), u);
		f.name = "GodRayShaft";
		let p = new d();
		f.frustumCulled = !0, f.intersectsFrustum = function(e) {
			return p.center.setFromMatrixPosition(this.matrixWorld), p.radius = l.uLength.value + l.uWidth.value * .5 + .1, typeof e.intersectsSphere != "function" || e.intersectsSphere(p);
		}, f.renderOrder = we.GODRAYS, f.castShadow = !1, f.receiveShadow = !1, f.onBeforeRender = (e) => {
			u.blending = e.getRenderTarget() === null ? 5 : 2;
		}, e && f.position.set(e.x, e.y, e.z), this.object.add(f);
		let m = this.shafts, h = !1, g = {
			mesh: f,
			get intensity() {
				return l.uIntensity.value;
			},
			set intensity(e) {
				l.uIntensity.value = e;
			},
			dispose() {
				if (h) return;
				h = !0;
				let e = m.indexOf(g);
				e >= 0 && m.splice(e, 1), f.removeFromParent(), u.dispose(), zc();
			}
		};
		return m.push(g), g;
	}
	populate(e, t, n = 7) {
		let r = new Oe(n), i = e.maxX - e.minX, a = e.maxZ - e.minZ, o = Math.max(1, Math.round(Math.sqrt(t * i / Math.max(a, .001)))), s = Math.max(1, Math.ceil(t / o)), c = [];
		for (let e = 0; e < s; e++) for (let t = 0; t < o; t++) c.push([t, e]);
		r.shuffle(c);
		let l = [];
		for (let n = 0; n < t; n++) {
			let [t, u] = c[n % c.length], d = e.minX + (t + r.range(.15, .85)) / o * i, f = e.minZ + (u + r.range(.15, .85)) / s * a;
			l.push(this.addShaft({
				position: new D(d, e.y ?? 0, f),
				length: r.range(11, 17),
				width: r.range(1.4, 3.4),
				intensity: r.range(.55, 1),
				topWidth: r.range(.55, .85),
				seed: r.range(0, 10)
			}));
		}
		return l;
	}
	update(e) {
		this._shared.uTime.value += e;
	}
	dispose() {
		for (let e of [...this.shafts]) e.dispose();
		this.object.removeFromParent();
	}
}, Vc = {
	billboard: 0,
	flat: 1,
	screen: 2
}, Hc = "\nfloat fxqBayer4( vec2 p ) {\n	ivec2 q = ivec2( mod( floor( p ), 4.0 ) );\n	const float M[ 16 ] = float[ 16 ]( 0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0 );\n	return ( M[ q.y * 4 + q.x ] + 0.5 ) / 16.0;\n}\n", Uc = "\nfloat fxqSoft( vec2 f, float s ) {\n	float r = length( f - 0.5 ) * 2.0;\n	return 1.0 - smoothstep( 1.0 - min( s, 1.0 ), 1.0, r );\n}\n", Wc = "\n#include <common>\n#include <fog_pars_vertex>\n\nuniform float uCameraYaw;\n\nattribute vec4 iPos;   // xyz centre (world), w in-plane rotation (rad)\nattribute vec4 iAxis;  // x width, y height (world units, x < 0 = mirrored), zw flat-mode direction\nattribute vec4 iUv;    // atlas rect u0, v0, u1, v1\nattribute vec4 iColor; // linear HDR rgb, a (dither fade)\nattribute vec3 iMode;  // x: 0 billboard, 1 flat, 2 screen; y: soft (0 … 1); z: halo weight (0 … 1)\n\nvarying vec2 vUv;\nvarying vec4 vColor;\nvarying vec2 vFrame; // frame-local position (0 … 1 across the quad)\nvarying float vSoft;\n\nvoid main() {\n	vec2 q = position.xy * iAxis.xy;\n	float cr = cos( iPos.w );\n	float sr = sin( iPos.w );\n	q = vec2( q.x * cr - q.y * sr, q.x * sr + q.y * cr );\n	vUv = mix( iUv.xy, iUv.zw, uv );\n	vColor = iColor;\n	vFrame = uv;\n	vSoft = iMode.y;\n\n	vec4 mvPosition;\n	if ( iMode.x > 1.5 ) {\n		// screen: faces the camera fully\n		mvPosition = viewMatrix * vec4( iPos.xyz, 1.0 );\n		mvPosition.xy += q;\n	} else {\n		vec3 wp;\n		if ( iMode.x > 0.5 ) {\n			// flat: horizontal, +V along ( dirX, dirZ ), +U along ( -dirZ, dirX )\n			vec2 d = iAxis.zw;\n			float l = length( d );\n			d = l > 1e-6 ? d / l : vec2( 0.0, 1.0 );\n			wp = iPos.xyz + vec3( - d.y, 0.0, d.x ) * q.x + vec3( d.x, 0.0, d.y ) * q.y;\n		} else {\n			// billboard: upright, turned to the camera yaw (like the cylindrical Sprite3D)\n			wp = iPos.xyz + vec3( cos( uCameraYaw ), 0.0, - sin( uCameraYaw ) ) * q.x + vec3( 0.0, q.y, 0.0 );\n		}\n		mvPosition = viewMatrix * vec4( wp, 1.0 );\n	}\n	gl_Position = projectionMatrix * mvPosition;\n\n	#include <fog_vertex>\n}\n", Gc = `
#include <common>
#include <fog_pars_fragment>

uniform sampler2D uMap;
uniform vec2 uAtlasSize;

varying vec2 vUv;
varying vec4 vColor;
varying vec2 vFrame;
varying float vSoft;

${Hc}
${Uc}

void main() {
	vec4 tex = texture2D( uMap, vUv );
	if ( tex.a < 0.5 ) discard;
	// dither fade in atlas-texel space: dissolves in art-sized pixels, stays depth-writing; a soft
	// quad's outer part thins by its radial falloff the same way (soft 0: a stays as it is)
	float fade = vColor.a;
	if ( vSoft > 0.0 ) fade *= fxqSoft( vFrame, vSoft );
	if ( fade < 0.999 && fade <= fxqBayer4( vUv * uAtlasSize ) ) discard;
	gl_FragColor = vec4( tex.rgb * vColor.rgb, 1.0 );

	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}
`, Kc = Wc.replace("uniform float uCameraYaw;", "uniform float uCameraYaw;\nuniform float uHalo;\nvarying vec2 vLocal;\nvarying vec4 vRect;\nvarying float vWeight;").replace("vec2 q = position.xy * iAxis.xy;", "if ( iMode.z <= 0.0 ) {\n		gl_Position = vec4( 0.0, 0.0, 2.0, 1.0 );\n		return;\n	}\n	vWeight = iMode.z;\n	vec2 q = position.xy * iAxis.xy * uHalo;\n	vLocal = uv;\n	vRect = iUv;"), qc = `
#include <common>

uniform sampler2D uMap;
uniform float uHalo;
uniform float uStrength;

varying vec2 vUv;
varying vec4 vColor;
varying vec2 vFrame;
varying float vSoft;
varying vec2 vLocal;
varying vec4 vRect;
varying float vWeight;

${Uc}

// two rings of six taps (frame-local units)
const vec2 TAPS[ 12 ] = vec2[ 12 ](
	vec2( 0.12, 0.0 ), vec2( 0.06, 0.104 ), vec2( -0.06, 0.104 ), vec2( -0.12, 0.0 ), vec2( -0.06, -0.104 ), vec2( 0.06, -0.104 ),
	vec2( 0.0, 0.26 ), vec2( 0.225, 0.13 ), vec2( 0.225, -0.13 ), vec2( 0.0, -0.26 ), vec2( -0.225, -0.13 ), vec2( -0.225, 0.13 )
);

void main() {
	float bright = max( vColor.r, max( vColor.g, vColor.b ) );
	float w = smoothstep( 0.9, 1.8, bright ) * clamp( vColor.a, 0.0, 1.0 ) * vWeight;
	if ( w <= 0.001 ) discard;
	vec2 l = ( vLocal - 0.5 ) * uHalo + 0.5;
	vec3 acc = vec3( 0.0 );
	float n = 0.0;
	for ( int i = 0; i < 12; i ++ ) {
		vec2 s = l + TAPS[ i ];
		if ( s.x < 0.0 || s.y < 0.0 || s.x > 1.0 || s.y > 1.0 ) continue;
		vec4 t = texture2D( uMap, mix( vRect.xy, vRect.zw, s ) );
		if ( t.a >= 0.5 ) {
			// (a soft quad's taps weigh by its falloff there: the glow thins with the body)
			float k = vSoft > 0.0 ? fxqSoft( s, vSoft ) : 1.0;
			acc += t.rgb * k;
			n += k;
		}
	}
	if ( n < ( vSoft > 0.0 ? 0.05 : 0.5 ) ) discard;
	float c = n / 12.0;
	c = c * c * ( 3.0 - 2.0 * c );
	gl_FragColor = vec4( ( acc / n ) * vColor.rgb * ( c * w * uStrength ), 1.0 );

	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}
`, Jc = {
	iPos: 4,
	iAxis: 4,
	iUv: 4,
	iColor: 4,
	iMode: 3
}, Yc = .7;
function Xc(e, t, n, r) {
	let i = e.updateRanges;
	if (i.length === 0) t.start = n, t.count = r, i.push(t);
	else if (i.length === 1 && i[0] === t) {
		let e = Math.max(t.start + t.count, n + r);
		t.start = Math.min(t.start, n), t.count = e - t.start;
	} else e.clearUpdateRanges();
	e.needsUpdate = !0;
}
var Zc = class {
	constructor({ atlas: e = null, capacity: t = 256, name: n = "fx:quads" } = {}) {
		this.atlas = e, this.capacity = Math.max(1, t | 0);
		let r = this.capacity, i = new f(1, 1), a = new de();
		a.setIndex(i.index), a.setAttribute("position", i.getAttribute("position")), a.setAttribute("uv", i.getAttribute("uv")), i.dispose(), this._attrs = {}, this._attrList = [];
		for (let [e, t] of Object.entries(Jc)) {
			let n = new u(new Float32Array(r * t), t);
			n.setUsage(p), a.setAttribute(e, n), this._attrs[e] = n, this._attrList.push(n);
		}
		this._ranges = this._attrList.map(() => ({
			start: 0,
			count: 0
		})), this.geometry = a;
		let o = e?.texture ?? null, s = o?.image;
		this.material = new b({
			name: "FxQuads",
			uniforms: {
				...se.clone(xe.fog),
				uFogStart: M.uFogStart,
				uMap: { value: o },
				uAtlasSize: { value: new O(s?.width || 512, s?.height || 512) },
				uCameraYaw: M.uCameraYaw
			},
			vertexShader: Wc,
			fragmentShader: Gc,
			side: 2,
			transparent: !1,
			depthWrite: !0,
			fog: !0
		}), this.material.customProgramCacheKey = () => "luminati-fxquads-v1", this.object = new C(a, this.material, r), this.object.name = n, this.object.count = 0, this.object.visible = !1, this.object.frustumCulled = !1, this.object.castShadow = !1, this.object.receiveShadow = !1, this.object.matrixAutoUpdate = !1, this.halo = null, this.haloMaterial = null, this._haloN = 0, this._slotOf = new Int32Array(r).fill(-1), this._handleAt = new Int32Array(r), this._freeStack = new Int32Array(r);
		for (let e = 0; e < r; e++) this._freeStack[e] = r - 1 - e;
		this._freeTop = r, this._count = 0, this._dirtyMin = Infinity, this._dirtyMax = -1, this._countDirty = !1, this._warned = null;
	}
	alloc() {
		if (this._freeTop <= 0) return -1;
		let e = this._freeStack[--this._freeTop], t = this._count++;
		this._slotOf[e] = t, this._handleAt[t] = e;
		let n = this._attrs.iColor.array;
		return n[t * 4 + 3] = 0, this._attrs.iMode.array[t * 3 + 2] = 0, this._dirty(t), this._countDirty = !0, e;
	}
	set(e, t) {
		let n = e >= 0 && e < this.capacity ? this._slotOf[e] : -1;
		if (n < 0) return;
		let r = this._attrs, i = this.atlas?.frames?.[t.frame], a = r.iColor.array, o = n * 4;
		if (!i) {
			a[o + 3] = 0, this._dirty(n), t.frame != null && !this._warned?.has(t.frame) && ((this._warned ??= /* @__PURE__ */ new Set()).add(t.frame), console.warn(`[FxQuads] unknown atlas frame "${t.frame}"`));
			return;
		}
		let s = i.rects.length, c = (t.index ?? 0) | 0;
		c = (c % s + s) % s;
		let l = i.rects[c], u = t.scale ?? 1, d = r.iPos.array;
		d[o] = t.x ?? 0, d[o + 1] = t.y ?? 0, d[o + 2] = t.z ?? 0, d[o + 3] = t.rot ?? 0;
		let f = r.iAxis.array, p = i.w / 16 * u;
		f[o] = t.flipX ? -p : p, f[o + 1] = i.h / 16 * u, f[o + 2] = t.dirX ?? 0, f[o + 3] = t.dirZ ?? 1;
		let m = r.iUv.array;
		m[o] = l[0], m[o + 1] = l[1], m[o + 2] = l[2], m[o + 3] = l[3], a[o] = t.r ?? 1, a[o + 1] = t.g ?? 1, a[o + 2] = t.b ?? 1, a[o + 3] = t.a ?? 1;
		let h = r.iMode.array, g = n * 3;
		h[g] = Vc[t.mode] ?? 0;
		let _ = t.soft ?? 0;
		h[g + 1] = _ > 0 ? Math.min(1, _) : 0;
		let v = t.halo ?? 0, y = h[g + 2] > 0;
		h[g + 2] = v > 0 ? Math.min(1, v) : 0, y !== v > 0 && (this._haloN += y ? -1 : 1), this._dirty(n);
	}
	enableHalo(e = Yc) {
		if (this.halo) {
			this.haloMaterial.uniforms.uStrength.value = e;
			return;
		}
		this.haloMaterial = new b({
			name: "FxQuadsHalo",
			uniforms: {
				uMap: { value: this.material.uniforms.uMap.value },
				uHalo: { value: 1.9 },
				uStrength: { value: e },
				uCameraYaw: M.uCameraYaw
			},
			vertexShader: Kc,
			fragmentShader: qc,
			side: 2,
			transparent: !0,
			blending: 2,
			depthWrite: !1,
			depthTest: !0,
			fog: !1
		}), this.haloMaterial.customProgramCacheKey = () => "luminati-fxquads-halo-v1";
		let t = new C(this.geometry, this.haloMaterial, this.capacity);
		t.name = `${this.object.name}:halo`, t.count = this._count, t.visible = this._haloN > 0, t.frustumCulled = !1, t.castShadow = !1, t.receiveShadow = !1, t.matrixAutoUpdate = !1, t.renderOrder = 1, this.object.add(t), this.halo = t;
	}
	free(e) {
		let t = e >= 0 && e < this.capacity ? this._slotOf[e] : -1;
		if (t < 0) return;
		this._attrs.iMode.array[t * 3 + 2] > 0 && this._haloN--;
		let n = --this._count;
		if (t !== n) {
			let e = this._attrList;
			for (let r = 0; r < e.length; r++) {
				let i = e[r].itemSize;
				e[r].array.copyWithin(t * i, n * i, n * i + i);
			}
			let r = this._handleAt[n];
			this._slotOf[r] = t, this._handleAt[t] = r, this._dirty(t);
		}
		this._slotOf[e] = -1, this._freeStack[this._freeTop++] = e, this._countDirty = !0;
	}
	clear() {
		for (let e = 0; e < this._count; e++) this._slotOf[this._handleAt[e]] = -1;
		let e = this.capacity;
		for (let t = 0; t < e; t++) this._freeStack[t] = e - 1 - t;
		this._freeTop = e, this._count = 0, this._haloN = 0, this._countDirty = !0;
	}
	update() {
		if (this._dirtyMax >= 0) {
			let e = this._dirtyMin, t = this._dirtyMax - e + 1, n = this._attrList;
			for (let r = 0; r < n.length; r++) {
				let i = n[r], a = i.itemSize;
				Xc(i, this._ranges[r], e * a, t * a);
			}
			this._dirtyMin = Infinity, this._dirtyMax = -1;
		}
		this._countDirty && (this._countDirty = !1, this.object.count = this._count, this.object.visible = this._count > 0), this.halo && (this.halo.count = this._count, this.halo.visible = this._haloN > 0);
	}
	get count() {
		return this._count;
	}
	dispose() {
		this.object.removeFromParent(), this.geometry.dispose(), this.material.dispose(), this.haloMaterial?.dispose(), this.halo?.dispose?.(), this.object.dispose?.();
	}
	_dirty(e) {
		e < this._dirtyMin && (this._dirtyMin = e), e > this._dirtyMax && (this._dirtyMax = e);
	}
}, Qc = {
	circle: 0,
	ring: 1,
	sector: 2,
	lane: 3,
	rect: 4
}, $c = {
	enemy: 0,
	player: 1,
	lock: 2,
	barrier: 3,
	magma: 4
}, el = "", tl = "	} else { // magma";
function nl(e, t) {
	let n = Object.keys(e);
	if (n.every((t) => $c[t] === e[t])) return;
	let r = Object.values($c);
	for (let t of n) if (Object.hasOwn($c, t) || !(e[t] >= 5) || r.includes(e[t])) throw Error(`registerMarkerStyles: the style "${t}" (${e[t]}) is taken`);
	Object.assign($c, e), el += t;
}
var rl = 3 / 16, il = 6, al = 2, ol = 4096, sl = "\n#include <common>\n#include <fog_pars_vertex>\n\nuniform sampler2D uHeight;\nuniform vec4 uHeightRect; // minX, minZ, width (u), depth (u)\nuniform vec2 uHeightSize; // texels\n\nattribute vec4 iOrigin; // xz shape origin, zw direction (V axis)\nattribute vec4 iRect;   // local bounding rect: u0, u1 (across), v0, v1 (along)\nattribute vec4 iShape;  // shape id, style id, progress, alpha\nattribute vec4 iParams; // p0, p1 (shape parameters), y lift, flash\n\nvarying vec2 vWorld;\nvarying vec2 vOrigin;\nvarying vec2 vDir;\nvarying vec4 vShape;\nvarying vec4 vParams;\nvarying float vY;\n\nvoid main() {\n	vec2 d = iOrigin.zw;\n	float l = length( d );\n	d = l > 1e-6 ? d / l : vec2( 0.0, 1.0 );\n	vec2 across = vec2( - d.y, d.x );\n	vec2 g = position.xy + 0.5; // PlaneGeometry(1, 1, 24, 24): 0..1\n	float lu = mix( iRect.x, iRect.y, g.x );\n	float lv = mix( iRect.z, iRect.w, g.y );\n	vec2 xz = iOrigin.xy + across * lu + d * lv;\n\n	// texel-centre height lookup (the texel containing the vertex)\n	vec2 hc = clamp( ( xz - uHeightRect.xy ) / uHeightRect.zw, 0.0, 1.0 ) * uHeightSize;\n	hc = ( min( floor( hc ), uHeightSize - 1.0 ) + 0.5 ) / uHeightSize;\n	float y = texture2D( uHeight, hc ).r + iParams.z;\n\n	vWorld = xz;\n	vY = y;\n	vOrigin = iOrigin.xy;\n	vDir = d;\n	vShape = iShape;\n	vParams = iParams;\n\n	vec4 mvPosition = viewMatrix * vec4( xz.x, y, xz.y, 1.0 );\n	gl_Position = projectionMatrix * mvPosition;\n\n	#include <fog_vertex>\n}\n", cl = "\n#include <common>\n#include <fog_pars_fragment>\n\nuniform float uTime;\nuniform sampler2D uHeight;\nuniform vec4 uHeightRect;\nuniform vec2 uHeightSize;\n\nvarying vec2 vWorld;\nvarying vec2 vOrigin;\nvarying vec2 vDir;\nvarying vec4 vShape;\nvarying vec4 vParams;\nvarying float vY;\n\nconst float TX = 1.0 / 16.0; // one texel (16 per unit)\n\nfloat gmHash( vec2 p ) {\n	return fract( sin( dot( p, vec2( 127.1, 311.7 ) ) ) * 43758.5453 );\n}\nfloat gmNoise( vec2 p ) {\n	vec2 i = floor( p );\n	vec2 f = fract( p );\n	f = f * f * ( 3.0 - 2.0 * f );\n	return mix( mix( gmHash( i ), gmHash( i + vec2( 1.0, 0.0 ) ), f.x ),\n		mix( gmHash( i + vec2( 0.0, 1.0 ) ), gmHash( i + vec2( 1.0, 1.0 ) ), f.x ), f.y );\n}\n\nvoid main() {\n	// draped only where it lies on the ground: a grid triangle that spans a cliff or riser (its\n	// interpolated height is not the height of the texel under the fragment) is dropped, so a lane\n	// across a ledge shows a clean step instead of a row of sloped sawtooth slivers\n	vec2 hc = clamp( ( vWorld - uHeightRect.xy ) / uHeightRect.zw, 0.0, 1.0 ) * uHeightSize;\n	hc = ( min( floor( hc ), uHeightSize - 1.0 ) + 0.5 ) / uHeightSize;\n	if ( abs( vY - ( texture2D( uHeight, hc ).r + vParams.z ) ) > 0.12 ) discard;\n\n	// world-quantised texel centre: pixel-art edges aligned with the terrain texels\n	vec2 pq = ( floor( vWorld * 16.0 ) + 0.5 ) * TX;\n	vec2 rel = pq - vOrigin;\n	float along = dot( rel, vDir );\n	float across = dot( rel, vec2( - vDir.y, vDir.x ) );\n	float dist = length( rel );\n\n	int shape = int( vShape.x + 0.5 );\n	int style = int( vShape.y + 0.5 );\n	float prog = vShape.z >= 0.9995 ? 1.0 : clamp( vShape.z, 0.0, 1.0 );\n	float p0 = vParams.x;\n	float p1 = vParams.y;\n\n	// sd: signed distance to the outline (< 0 inside); front: the progress fill's leading edge\n	// coordinate minus its current extent (< 0 = already filled); dash: perimeter parameter\n	float sd;\n	float front;\n	float dash;\n	float ang = atan( across, along );\n	if ( shape == 0 ) { // circle\n		sd = dist - p0;\n		front = dist - p0 * prog;\n		dash = ang / 6.2831853 * 8.0;\n	} else if ( shape == 1 ) { // ring rInner (p1) .. r (p0)\n		sd = max( dist - p0, p1 - dist );\n		front = dist - ( p1 + ( p0 - p1 ) * prog );\n		dash = ang / 6.2831853 * 8.0;\n	} else if ( shape == 2 ) { // sector: radius p0, half angle p1 (rad)\n		float off = abs( ang ) - p1;\n		float edge = p1 >= 3.1415 ? - 1e3 : dist * sin( clamp( off, - 1.5707963, 1.5707963 ) );\n		sd = max( dist - p0, edge );\n		front = dist - p0 * prog;\n		dash = ang / 6.2831853 * 8.0 + dist;\n	} else if ( shape == 3 ) { // lane: len p0 along, width p1 across\n		sd = max( max( - along, along - p0 ), abs( across ) - p1 * 0.5 );\n		front = along - p0 * prog;\n		dash = ( along + abs( across ) ) * 1.5;\n	} else { // rect: w p0 across, d p1 along (outline only)\n		sd = max( abs( across ) - p0 * 0.5, abs( along ) - p1 * 0.5 );\n		front = 1.0;\n		dash = ( along + across ) * 1.5;\n	}\n	if ( sd > 0.0 ) discard;\n\n	float pulse = 0.5 + 0.5 * sin( uTime * 6.2831853 * 2.5 );\n	float rimW = ( style == 2 ) ? TX : 2.0 * TX;\n	bool rim = sd > - rimW;\n	if ( shape == 4 && ! rim && style != 3 ) discard; // rect: outline only (barrier keeps its glow band)\n	bool filled = front <= 0.0;\n	bool lead = prog > 0.0 && prog < 1.0 && front <= 0.0 && front > - TX && shape != 4;\n	// (0.9995: an instance's progress of exactly 1 can interpolate to 0.99999994 across a triangle;\n	// step( 1.0, … ) then dropped the white on part of a rim, leaving the brighter red there)\n	float flash = max( vParams.w, step( 0.9995, vShape.z ) );\n\n	vec3 col = vec3( 0.0 );\n	float a = 0.0;\n\n	if ( style == 0 ) { // enemy: red-orange (stays red through ACES at golden hour), white at progress 1\n		// (luminance kept ≤ ~1.05, the bloom threshold: the phase-3 shockwave rings — white at\n		// progress 1 for their whole life — bloomed the player standing on them into a smear)\n		vec3 rimC = vec3( 2.6, 0.34, 0.12 ) * ( 0.85 + 0.25 * prog + 0.1 * pulse );\n		vec3 fillC = vec3( 1.3, 0.13, 0.05 );\n		if ( rim ) { col = mix( rimC, vec3( 0.95, 0.88, 0.78 ), flash ); a = 0.92; }\n		else if ( lead ) { col = vec3( 2.6, 0.45, 0.14 ); a = 0.8; }\n		else if ( shape != 4 ) { col = fillC; a = filled ? mix( 0.22, 0.5, prog ) : 0.12; }\n	} else if ( style == 1 ) { // player: gold\n		vec3 rimC = vec3( 2.2, 1.6, 0.6 ) * ( 0.9 + 0.2 * pulse );\n		if ( rim ) { col = mix( rimC, vec3( 0.95, 0.88, 0.78 ), vParams.w ); a = 0.9; }\n		else if ( lead ) { col = vec3( 2.4, 1.9, 0.9 ); a = 0.75; }\n		else if ( shape != 4 ) { col = vec3( 1.25, 0.95, 0.35 ); a = filled ? mix( 0.14, 0.34, prog ) : 0.07; }\n	} else if ( style == 2 ) { // lock: thin rotating dashes, no fill\n		float t = fract( dash - uTime * 0.35 );\n		if ( rim && t < 0.55 ) { col = vec3( 1.8, 1.4, 0.5 ); a = 0.95; }\n	} else if ( style == 3 ) { // barrier: pulsing outline + a faint inner band, below the bloom\n		// threshold (the whole outline used to haze the closed arena orange)\n		float bp = 0.7 + 0.6 * ( 0.5 + 0.5 * sin( uTime * 6.2831853 * 1.2 ) );\n		if ( rim ) { col = vec3( 1.3, 0.45, 0.15 ) * bp; a = 0.95; }\n		else if ( sd > - 3.0 * TX ) { col = vec3( 0.9, 0.28, 0.08 ); a = 0.1 * bp; }\n	} else { // magma: dark basalt plates split by glowing cracks, a glowing edge (below bloom)\n		if ( ! filled && shape != 4 ) discard;\n		// cellular crust (COMBAT-16): plates ~0.6 u across (a smooth noise fill read as a flat\n		// orange disc at game zoom) — F2 − F1 of a jittered grid in world texels; the cracks' glow\n		// flows with a slow noise, the plates stay put (no shimmer on the pixel grid)\n		vec2 cp = pq * 1.75;\n		vec2 ci = floor( cp );\n		vec2 cf = fract( cp );\n		float f1 = 8.0;\n		float f2 = 8.0;\n		float cellH = 0.0;\n		for ( int y = - 1; y <= 1; y ++ ) {\n			for ( int x = - 1; x <= 1; x ++ ) {\n				vec2 o = vec2( float( x ), float( y ) );\n				vec2 c = ci + o;\n				vec2 r = o + 0.15 + 0.7 * vec2( gmHash( c ), gmHash( c + vec2( 17.3, 5.1 ) ) ) - cf;\n				float d = dot( r, r );\n				if ( d < f1 ) { f2 = f1; f1 = d; cellH = gmHash( c + vec2( 3.7, 9.2 ) ); }\n				else if ( d < f2 ) f2 = d;\n			}\n		}\n		float crack = sqrt( f2 ) - sqrt( f1 ); // 0 on a crack, ~0.5 in a plate's middle\n		float flow = gmNoise( pq * 2.2 + vec2( uTime * 0.35, - uTime * 0.27 ) );\n		if ( rim ) { col = vec3( 1.5, 0.36, 0.07 ) * ( 0.8 + 0.3 * pulse ); a = 0.8; }\n		else if ( crack < 0.08 ) { col = vec3( 1.3, 0.5, 0.09 ) * ( 0.45 + 0.6 * flow ); a = 0.92; }\n		else if ( cellH < 0.17 ) { col = vec3( 0.9, 0.2, 0.035 ) * ( 0.55 + 0.4 * flow ); a = 0.85; } // a molten plate\n		else if ( crack < 0.17 ) { col = vec3( 0.5, 0.085, 0.02 ) * ( 0.7 + 0.4 * flow ); a = 0.86; }\n		// (a warm floor and 0.95 alpha: at 0.88 the blue night fill showed through and the plates\n		// read purple-grey, like cold stone)\n		else { col = vec3( 0.105, 0.034, 0.018 ) * ( 0.8 + 0.6 * cellH ); a = 0.95; }\n	}\n\n	a *= clamp( vShape.w, 0.0, 1.0 );\n	if ( a <= 0.004 ) discard;\n	gl_FragColor = vec4( col, a );\n\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n}\n", ll = {
	iOrigin: 4,
	iRect: 4,
	iShape: 4,
	iParams: 4
}, ul = () => typeof performance < "u" ? performance.now() : 0;
function dl(e, t, n, r) {
	let i = e.updateRanges;
	if (i.length === 0) t.start = n, t.count = r, i.push(t);
	else if (i.length === 1 && i[0] === t) {
		let e = Math.max(t.start + t.count, n + r);
		t.start = Math.min(t.start, n), t.count = e - t.start;
	} else e.clearUpdateRanges();
	e.needsUpdate = !0;
}
var fl = class {
	constructor({ capacity: e = 48, name: t = "fx:markers", heightField: n = null } = {}) {
		this.capacity = Math.max(1, e | 0), this.heightField = n;
		let r = this.capacity, i = new f(1, 1, 24, 24), a = new de();
		a.setIndex(i.index), a.setAttribute("position", i.getAttribute("position")), i.dispose(), this._attrs = {}, this._attrList = [];
		for (let [e, t] of Object.entries(ll)) {
			let n = new u(new Float32Array(r * t), t);
			n.setUsage(p), a.setAttribute(e, n), this._attrs[e] = n, this._attrList.push(n);
		}
		this._ranges = this._attrList.map(() => ({
			start: 0,
			count: 0
		})), this.geometry = a;
		let o = n ? this._startBake(n) : null;
		this._bake = o, this._bakeTimer = 0, this.heightRes = o ? o.res : 0, this.bakeMs = 0, this.bakeSlices = 0, this.bakeLongestMs = 0;
		let s = o ? o.w : 1, c = o ? o.h : 1, l = o ? o.data : /* @__PURE__ */ new Uint16Array(1);
		this.heightTexture = new v(l, s, c, ce, S), this.heightTexture.name = `${t}:height`, this.heightTexture.magFilter = pe, this.heightTexture.minFilter = pe, this.heightTexture.wrapS = ae, this.heightTexture.wrapT = ae, this.heightTexture.generateMipmaps = !1, this.heightTexture.colorSpace = "", this.heightTexture.needsUpdate = !0;
		let d = o ? [
			o.minX,
			o.minZ,
			s / o.res,
			c / o.res
		] : [
			0,
			0,
			1,
			1
		];
		this.material = new b({
			name: "GroundMarkers",
			uniforms: {
				...se.clone(xe.fog),
				uFogStart: M.uFogStart,
				uHeight: { value: this.heightTexture },
				uHeightRect: { value: new oe(...d) },
				uHeightSize: { value: new O(s, c) },
				uTime: M.uTime
			},
			vertexShader: sl,
			fragmentShader: el ? cl.replace(tl, `${el}\n${tl}`) : cl,
			transparent: !0,
			depthWrite: !1,
			polygonOffset: !0,
			polygonOffsetFactor: -2,
			polygonOffsetUnits: -4,
			side: 2,
			fog: !0
		}), this.material.customProgramCacheKey = () => "luminati-groundmarkers-v1", this.object = new C(a, this.material, r), this.object.name = t, this.object.count = 0, this.object.visible = !1, this.object.renderOrder = we.DECALS + 1, this.object.frustumCulled = !1, this.object.castShadow = !1, this.object.receiveShadow = !1, this.object.matrixAutoUpdate = !1, this._slotOf = new Int32Array(r).fill(-1), this._handleAt = new Int32Array(r), this._freeStack = new Int32Array(r);
		for (let e = 0; e < r; e++) this._freeStack[e] = r - 1 - e;
		this._freeTop = r, this._count = 0, this._dirtyMin = Infinity, this._dirtyMax = -1, this._countDirty = !1, this._warned = null, o && (this._pump = () => {
			this._bakeTimer = 0, this._bake && (this._bakeSlice(il), this._bake && (this._bakeTimer = setTimeout(this._pump, 0)));
		}, this.object.onBeforeRender = () => {
			this._bake && this._bakeSlice(Infinity);
		}, this._bakeSlice(il), this._bake && (this._bakeTimer = setTimeout(this._pump, 0)));
	}
	get heightReady() {
		return this._bake === null;
	}
	alloc() {
		if (this._freeTop <= 0) return -1;
		let e = this._freeStack[--this._freeTop], t = this._count++;
		return this._slotOf[e] = t, this._handleAt[t] = e, this._attrs.iShape.array[t * 4 + 3] = 0, this._dirty(t), this._countDirty = !0, e;
	}
	set(e, t) {
		let n = e >= 0 && e < this.capacity ? this._slotOf[e] : -1;
		if (n < 0) return;
		let r = n * 4, i = this._attrs, a = Qc[t.shape], o = $c[t.style ?? "enemy"];
		if (a === void 0 || o === void 0) {
			i.iShape.array[r + 3] = 0, this._dirty(n);
			let e = a === void 0 ? `shape "${t.shape}"` : `style "${t.style}"`;
			this._warned?.has(e) || ((this._warned ??= /* @__PURE__ */ new Set()).add(e), console.warn(`[GroundMarkers] unknown ${e}`));
			return;
		}
		let s = t.dirX ?? 0, c = t.dirZ ?? 1, l = Math.hypot(s, c);
		l > 1e-6 ? (s /= l, c /= l) : (s = 0, c = 1);
		let u = rl, d = 0, f = 0, p, m, h, g;
		if (a === 0 || a === 1) d = Math.max(0, t.r ?? 1), f = a === 1 ? Math.min(d, Math.max(0, t.rInner ?? 0)) : 0, p = h = -d - u, m = g = d + u;
		else if (a === 2) {
			d = Math.max(0, t.r ?? 1);
			let e = Math.min(180, Math.max(0, t.halfAngle ?? 60)) * (Math.PI / 180);
			f = e;
			let n = e >= Math.PI / 2 ? d : d * Math.sin(e);
			p = -n - u, m = n + u, h = Math.min(0, d * Math.cos(e)) - u, g = d + u;
		} else a === 3 ? (d = Math.max(0, t.len ?? 1), f = Math.max(0, t.width ?? 1), p = -f * .5 - u, m = f * .5 + u, h = -.1875, g = d + u) : (d = Math.max(0, t.w ?? 1), f = Math.max(0, t.d ?? 1), p = -d * .5 - u, m = d * .5 + u, h = -f * .5 - u, g = f * .5 + u);
		let _ = i.iOrigin.array;
		_[r] = t.x ?? 0, _[r + 1] = t.z ?? 0, _[r + 2] = s, _[r + 3] = c;
		let v = i.iRect.array;
		v[r] = p, v[r + 1] = m, v[r + 2] = h, v[r + 3] = g;
		let y = i.iShape.array;
		y[r] = a, y[r + 1] = o, y[r + 2] = t.progress ?? 0, y[r + 3] = t.alpha ?? 1;
		let b = i.iParams.array;
		b[r] = d, b[r + 1] = f, b[r + 2] = t.y ?? .03, b[r + 3] = t.flash ?? 0, this._dirty(n);
	}
	free(e) {
		let t = e >= 0 && e < this.capacity ? this._slotOf[e] : -1;
		if (t < 0) return;
		let n = --this._count;
		if (t !== n) {
			let e = this._attrList;
			for (let r = 0; r < e.length; r++) {
				let i = e[r].itemSize;
				e[r].array.copyWithin(t * i, n * i, n * i + i);
			}
			let r = this._handleAt[n];
			this._slotOf[r] = t, this._handleAt[t] = r, this._dirty(t);
		}
		this._slotOf[e] = -1, this._freeStack[this._freeTop++] = e, this._countDirty = !0;
	}
	clear() {
		for (let e = 0; e < this._count; e++) this._slotOf[this._handleAt[e]] = -1;
		let e = this.capacity;
		for (let t = 0; t < e; t++) this._freeStack[t] = e - 1 - t;
		this._freeTop = e, this._count = 0, this._countDirty = !0;
	}
	update() {
		if (this._bake && this._bakeSlice(al), this._dirtyMax >= 0) {
			let e = this._dirtyMin, t = this._dirtyMax - e + 1, n = this._attrList;
			for (let r = 0; r < n.length; r++) {
				let i = n[r], a = i.itemSize;
				dl(i, this._ranges[r], e * a, t * a);
			}
			this._dirtyMin = Infinity, this._dirtyMax = -1;
		}
		this._countDirty && (this._countDirty = !1, this.object.count = this._count, this.object.visible = this._count > 0);
	}
	get count() {
		return this._count;
	}
	dispose() {
		clearTimeout(this._bakeTimer), this._bakeTimer = 0, this._bake = null, this.object.removeFromParent(), this.geometry.dispose(), this.material.dispose(), this.heightTexture.dispose(), this.object.dispose?.();
	}
	_dirty(e) {
		e < this._dirtyMin && (this._dirtyMin = e), e > this._dirtyMax && (this._dirtyMax = e);
	}
	_startBake(e) {
		let t = e.minX, n = e.minZ, r = Math.max(.001, e.maxX - t), i = Math.max(.001, e.maxZ - n), a = Math.max(1, e.res ?? 4), o = Math.floor(ol / Math.max(r, i));
		o >= 1 && o < a && (a = o);
		let s = Math.max(1, Math.ceil(r * a)), c = Math.max(1, Math.ceil(i * a));
		return {
			sample: e.sample,
			minX: t,
			minZ: n,
			res: a,
			w: s,
			h: c,
			data: new Uint16Array(s * c),
			row: 0,
			ms: 0,
			slices: 0,
			longest: 0
		};
	}
	_bakeSlice(e) {
		let t = this._bake;
		if (!t) return;
		let n = ul(), { sample: r, minX: a, minZ: o, res: s, w: c, h: l, data: u } = t, d = i.toHalfFloat, f = t.row;
		for (; f < l;) {
			let t = o + (f + .5) / s, i = f * c;
			for (let e = 0; e < c; e++) {
				let n = r(a + (e + .5) / s, t);
				u[i + e] = d(Number.isFinite(n) ? n : 0);
			}
			if (f++, ul() - n >= e) break;
		}
		t.row = f;
		let p = ul() - n;
		t.ms += p, t.slices++, p > t.longest && (t.longest = p), !(f < l) && (this._bake = null, clearTimeout(this._bakeTimer), this._bakeTimer = 0, this.bakeMs = Math.round(t.ms * 10) / 10, this.bakeSlices = t.slices, this.bakeLongestMs = Math.round(t.longest * 10) / 10, this.heightTexture.needsUpdate = !0);
	}
}, pl = "\nvarying vec3 vDir;\n\nvoid main() {\n  vDir = position;\n  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);\n  gl_Position = projectionMatrix * mvPosition;\n  // Pin the dome to (just inside) the far plane whatever the camera far plane is: it never clips and,\n  // with the depth test on, it only fills pixels no opaque geometry has covered.\n  #ifdef USE_REVERSED_DEPTH_BUFFER\n    gl_Position.z = gl_Position.w * 1e-5;\n  #else\n    gl_Position.z = gl_Position.w * 0.99999;\n  #endif\n}\n", ml = "\nuniform vec3 uTop;\nuniform vec3 uHorizon;\nuniform vec3 uBottom;\nuniform vec3 uSunDir;\nuniform vec3 uMoonDir;\nuniform vec3 uSunColor;\nuniform float uNight;\nuniform float uGlow;\nuniform float uClouds;\nuniform float uLowerClouds;\nuniform float uTime;\nuniform float uStarDensity;\nuniform float uSunSize;\nuniform float uMoonSize;\nuniform float uSunIntensity;\nuniform float uCloudPixel;\nuniform vec2 uWind;\nuniform float uAurora;\n\nvarying vec3 vDir;\n\n#define TAU 6.28318530718\n\nfloat hash12(vec2 p) {\n  vec3 p3 = fract(vec3(p.xyx) * 0.1031);\n  p3 += dot(p3, p3.yzx + 33.33);\n  return fract((p3.x + p3.y) * p3.z);\n}\n\nfloat vnoise(vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  float a = hash12(i);\n  float b = hash12(i + vec2(1.0, 0.0));\n  float c = hash12(i + vec2(0.0, 1.0));\n  float d = hash12(i + vec2(1.0, 1.0));\n  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);\n}\n\nfloat fbm4(vec2 p) {\n  float s = 0.0;\n  float a = 0.5;\n  for (int i = 0; i < 4; i++) {\n    s += a * vnoise(p);\n    p = p * 2.03 + vec2(17.13, 3.71);\n    a *= 0.5;\n  }\n  return s / 0.9375;\n}\n\nvec3 skyGradient(float y) {\n  if (y >= 0.0) {\n    float t = smoothstep(0.0, 1.0, pow(clamp(y, 0.0, 1.0), 0.5));\n    return mix(uHorizon, uTop, t);\n  }\n  // Below the horizon: a thick band of horizon haze that slowly sinks into the bottom colour.\n  float t = clamp(-y / 0.9, 0.0, 1.0);\n  return mix(uHorizon, uBottom, smoothstep(0.0, 1.0, pow(t, 0.8)));\n}\n\n// Tangent-plane coordinates of direction d around centre c, in units of radius r.\nvec2 discCoord(vec3 d, vec3 c, float r) {\n  vec3 t1 = cross(c, vec3(0.0, 1.0, 0.0));\n  t1 = length(t1) < 1e-4 ? vec3(1.0, 0.0, 0.0) : normalize(t1);\n  vec3 t2 = cross(t1, c);\n  return vec2(dot(d, t1), dot(d, t2)) / r;\n}\n\n// Snap a direction to a lat/long pixel grid with ~square cells (P cells per radian).\nvec3 quantDir(float lat, float lon, float P) {\n  float latQ = (floor(lat * P) + 0.5) / P;\n  float cl = max(cos(latQ), 0.05);\n  float lonQ = (floor(lon * P * cl) + 0.5) / (P * cl);\n  float c = cos(latQ);\n  return vec3(c * cos(lonQ), sin(latQ), c * sin(lonQ));\n}\n\n// Stars on a latitude/longitude grid with ~square cells (cells per row follow cos(latitude)).\nvec3 stars(float lat, float lon) {\n  float N = uStarDensity;\n  // Fine 1-px stars\n  float row = floor(lat * N);\n  float rowLat = (row + 0.5) / N;\n  float cells = max(1.0, floor(TAU * N * cos(rowLat)));\n  vec2 cell = vec2(floor((lon / TAU + 0.5) * cells), row);\n  float h = hash12(cell);\n  float star = step(0.9962, h);\n  float tw = 0.55 + 0.45 * sin(uTime * (1.2 + 3.5 * fract(h * 37.0)) + h * 91.0);\n  // Mostly faint stars with a few bright ones (a uniform spread made every star bloom).\n  float mag = fract(h * 113.0);\n  float b = star * tw * (0.3 + 1.6 * mag * mag * mag);\n  vec3 tint = mix(vec3(0.72, 0.82, 1.0), vec3(1.0, 0.88, 0.72), step(0.6, fract(h * 7.0)));\n  vec3 col = tint * b;\n\n  // Coarse cells with a plus-shaped bright star (5x5 px pattern)\n  float N2 = N / 5.0;\n  float row2 = floor(lat * N2);\n  float rowLat2 = (row2 + 0.5) / N2;\n  float cells2 = max(1.0, floor(TAU * N2 * cos(rowLat2)));\n  float u2 = (lon / TAU + 0.5) * cells2;\n  float v2 = lat * N2;\n  float h2 = hash12(vec2(floor(u2), row2) + 71.3);\n  vec2 f = floor(vec2(fract(u2), fract(v2)) * 5.0);\n  float m = abs(f.x - 2.0) + abs(f.y - 2.0);\n  float centre = step(m, 0.5);\n  float arm = step(m, 1.5) - centre;\n  float tw2 = 0.6 + 0.4 * sin(uTime * (0.7 + 1.8 * h2) + h2 * 50.0);\n  float big = step(0.991, h2) * (centre * 2.2 + arm * 0.6) * tw2;\n  vec3 tint2 = mix(vec3(0.8, 0.88, 1.0), vec3(1.0, 0.92, 0.78), step(0.5, fract(h2 * 13.0)));\n  col += tint2 * big;\n  return col;\n}\n\nvec3 aurora(vec3 q) {\n  float u = atan(q.x, -q.z);\n  float t = uTime * 0.03;\n  float h = (q.y - 0.07 - 0.04 * sin(u * 1.7 + t * 2.0) - 0.025 * sin(u * 4.3 - t * 3.1)) / 0.45;\n  if (h < 0.0 || h > 1.0) return vec3(0.0);\n  float ray = vnoise(vec2(u * 70.0 + t * 9.0, t * 0.7));\n  ray = ray * ray * 1.5 + 0.3 * vnoise(vec2(u * 17.0 - t * 4.0, 2.0));\n  float a = smoothstep(0.0, 0.04, h) * exp(-h * 3.0) * ray * (0.35 + 0.65 * smoothstep(-0.4, 0.8, sin(u * 2.3 + t * 1.2)))\n    * smoothstep(-0.6, 0.3, cos(u));\n  vec3 c = mix(vec3(0.25, 1.0, 0.63), vec3(0.05, 0.75, 0.39), smoothstep(0.0, 0.15, h));\n  c = mix(mix(c, vec3(0.2, 0.11, 1.0), smoothstep(0.25, 0.6, h)), vec3(0.58, 0.14, 1.0), smoothstep(0.75, 0.95, h));\n  return c * floor(clamp(a, 0.0, 1.0) * 6.0 + 0.5) / 6.0;\n}\n\nvoid main() {\n  vec3 d = normalize(vDir);\n  float y = d.y;\n  vec3 col = skyGradient(y);\n\n  vec3 sunDir = normalize(uSunDir);\n  vec3 moonDir = normalize(uMoonDir);\n  float lat = asin(clamp(y, -1.0, 1.0));\n  float lon = atan(d.z, d.x);\n\n  // ---------------------------------------------------------------- sun glow\n  float cs = dot(d, sunDir);\n  float cs0 = max(cs, 0.0);\n  float sunUp = smoothstep(-0.3, 0.02, sunDir.y);\n  float halo = pow(cs0, 8.0) * 0.1 + pow(cs0, 42.0) * 0.28 + pow(cs0, 600.0) * 1.1;\n  vec2 dh = d.xz / max(length(d.xz), 1e-4);\n  vec2 shz = sunDir.xz / max(length(sunDir.xz), 1e-4);\n  float az = dot(dh, shz) * 0.5 + 0.5;\n  float lowSun = 1.0 - smoothstep(0.02, 0.6, sunDir.y);\n  float band = exp(-abs(y) * 8.0) * pow(az, 3.0) * lowSun;\n  vec3 glowCol = uSunColor * uGlow;\n  col += glowCol * (halo + band * 0.32) * sunUp;\n\n  // Cloud pixel grid (constant on-screen size), shared by both cloud layers.\n  vec3 qd = quantDir(lat, lon, uCloudPixel);\n\n  if (y > 0.0) {\n    // ------------------------------------------------------------- stars\n    float starMask = uNight * uNight * smoothstep(0.03, 0.35, y);\n    if (starMask > 0.002) col += stars(lat, lon) * starMask;\n    if (uAurora > 0.001) col += aurora(qd) * uAurora;\n\n    // -------------------------------------- moon (pixel disc, gibbous, halo)\n    float cm = dot(d, moonDir);\n    float moonVis = smoothstep(0.25, 0.8, uNight) * smoothstep(-0.02, 0.08, moonDir.y);\n    if (moonVis > 0.001 && cm > 0.0) {\n      vec2 mp = discCoord(d, moonDir, uMoonSize);\n      vec2 mcell = floor(mp * 7.0);\n      vec2 mq = (mcell + 0.5) / 7.0;\n      float inside = step(length(mq), 1.0);\n      float mottle = hash12(mcell + 13.0);\n      float crater = step(0.78, mottle) * 0.22 + step(0.93, mottle) * 0.12;\n      float phase = smoothstep(0.35, 0.95, length(mq - vec2(-0.55, 0.25)));\n      // Kept below the bloom-saturation point so the pixel craters and the gibbous phase read.\n      vec3 moonCol = vec3(0.84, 0.9, 1.0) * (0.95 - crater * 1.3) * mix(0.22, 1.0, phase);\n      col = mix(col, moonCol, inside * moonVis);\n      float cm0 = max(cm, 0.0);\n      col += vec3(0.45, 0.58, 1.0) * (pow(cm0, 2500.0) * 0.3 + pow(cm0, 200.0) * 0.08 + pow(cm0, 12.0) * 0.025) * moonVis;\n    }\n\n    // ------------------------------------ sun disc (pixel-crisp, HDR bloom)\n    if (cs > 0.0) {\n      vec2 sp = discCoord(d, sunDir, uSunSize);\n      vec2 sq = (floor(sp * 6.0) + 0.5) / 6.0;\n      float r = length(sq);\n      float sIn = step(r, 1.0);\n      float rim = step(0.8, r);\n      col += uSunColor * sIn * mix(1.0, 0.55, rim) * uSunIntensity * sunUp * smoothstep(-0.005, 0.01, y);\n    }\n\n    // --------------------------- clouds (plane overhead, lit from the sun side)\n    if (uClouds > 0.001) {\n      vec2 cp = qd.xz / (max(qd.y, 0.0) + 0.15) * 2.4 + uWind * uTime;\n      float n = fbm4(cp * 1.2);\n      float c = smoothstep(1.0 - uClouds - 0.08, 1.0 - uClouds + 0.2, n);\n      float n2 = fbm4((cp + shz * 0.16) * 1.2);\n      float lit = clamp(0.55 + (n - n2) * 5.0, 0.0, 1.0);\n      c = floor(c * 3.0 + 0.5) / 3.0;\n      lit = floor(lit * 3.0 + 0.5) / 3.0;\n      float moonLit = pow(max(dot(d, moonDir), 0.0), 6.0) * smoothstep(0.3, 0.9, uNight);\n      vec3 shade = mix(mix(uTop, uHorizon, 0.5) * 0.95, uTop * 0.8, uNight);\n      vec3 litCol = mix(uHorizon * 1.12, mix(uTop, uHorizon, 0.55) + vec3(0.05, 0.07, 0.12) * moonLit, uNight)\n                  + glowCol * (0.12 + pow(cs0, 4.0) * 0.8) * sunUp;\n      vec3 cloudCol = mix(shade, litCol, lit);\n      float fade = smoothstep(0.0, 0.22, y);\n      col = mix(col, cloudCol, c * fade * mix(0.9, 0.55, uNight));\n    }\n  } else if (uLowerClouds > 0.001) {\n    // ------------------------------------------------------ sea of clouds below\n    vec2 lp = qd.xz / (max(-qd.y, 0.0) + 0.07) * 0.6 + uWind * uTime * 0.6 + vec2(37.0, 11.0);\n    float n = fbm4(lp);\n    float c = smoothstep(0.42, 0.74, n);\n    float n2 = fbm4(lp + shz * 0.12);\n    float lit = clamp(0.5 + (n - n2) * 5.0, 0.0, 1.0);\n    lit = floor(lit * 3.0 + 0.5) / 3.0;\n    c = floor(c * 3.0 + 0.5) / 3.0;\n    vec3 topCol = uHorizon * 1.08 + glowCol * (0.06 + band * 0.25) * sunUp;\n    vec3 shadeCol = mix(uBottom, uHorizon, 0.5);\n    vec3 cc = mix(shadeCol, topCol, 0.3 + lit * 0.7);\n    float distFade = smoothstep(0.0, 0.16, -y);\n    col = mix(col, cc, c * uLowerClouds * distFade);\n  }\n\n  gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);\n  #include <tonemapping_fragment>\n  #include <colorspace_fragment>\n}\n", hl = new D(), gl = class e {
	constructor({ radius: t = 180, cloudCover: n = .45, lowerClouds: r = .5, starDensity: i = 1100, sunSize: a = .032, moonSize: o = .026, sunIntensity: s = 9, cloudPixel: c = 380, wind: l = [.012, .004], earlyZ: u = !0 } = {}) {
		this.radius = t, this.uniforms = {
			uTop: { value: new E(3833568) },
			uHorizon: { value: new E(12902642) },
			uBottom: { value: new E(9417936) },
			uSunDir: { value: new D(.3, .6, -.5).normalize() },
			uMoonDir: { value: new D(-.3, .6, -.5).normalize() },
			uSunColor: { value: new E(1, .9, .75) },
			uNight: { value: 0 },
			uGlow: { value: 1 },
			uClouds: { value: n },
			uLowerClouds: { value: r },
			uTime: { value: 0 },
			uStarDensity: { value: i },
			uSunSize: { value: a },
			uMoonSize: { value: o },
			uSunIntensity: { value: s },
			uCloudPixel: { value: c },
			uWind: { value: new O(l[0], l[1]) },
			uAurora: { value: 0 }
		}, this.material = new b({
			name: "SkyMaterial",
			uniforms: this.uniforms,
			vertexShader: pl,
			fragmentShader: ml,
			side: 1,
			depthWrite: !1,
			depthTest: u,
			fog: !1,
			toneMapped: !0
		}), this.geometry = new T(t, 48, 24);
		let d = new ne(this.geometry, this.material);
		d.name = "Sky", d.renderOrder = u ? e.EARLY_Z_RENDER_ORDER : -1e3, d.frustumCulled = !1, d.castShadow = !1, d.receiveShadow = !1, d.matrixAutoUpdate = !1, d.onBeforeRender = (e, t, n) => {
			hl.setFromMatrixPosition(n.matrixWorld), d.position.copy(hl), d.updateMatrix(), d.matrixWorld.copy(d.matrix);
		}, this.object = d;
	}
	setState({ top: e, horizon: t, bottom: n, sunDirection: r, sunColor: i, night: a, moonDirection: o, glow: s, clouds: c } = {}) {
		let l = this.uniforms;
		e && l.uTop.value.copy(e), t && l.uHorizon.value.copy(t), n && l.uBottom.value.copy(n), r && l.uSunDir.value.copy(r), i && l.uSunColor.value.copy(i), a !== void 0 && (l.uNight.value = a), o && l.uMoonDir.value.copy(o), s !== void 0 && (l.uGlow.value = s), c !== void 0 && (l.uClouds.value = c);
	}
	get cloudCover() {
		return this.uniforms.uClouds.value;
	}
	set cloudCover(e) {
		this.uniforms.uClouds.value = e;
	}
	get lowerClouds() {
		return this.uniforms.uLowerClouds.value;
	}
	set lowerClouds(e) {
		this.uniforms.uLowerClouds.value = e;
	}
	update(e) {
		this.uniforms.uTime.value += e;
	}
	dispose() {
		this.geometry.dispose(), this.material.dispose();
	}
};
gl.EARLY_Z_RENDER_ORDER = 1e6;
//#endregion
//#region src/engine/lighting/LightingSystem.js
var _l = [
	{
		t: 0,
		name: "night",
		top: "#050a1f",
		horizon: "#1b2a5c",
		bottom: "#0a1232",
		sun: "#7294ff",
		sunI: .85,
		hemiSky: "#2a48b4",
		hemiGround: "#101430",
		hemiI: 1.12,
		fog: .011,
		exp: 1.3,
		night: 1,
		moon: 1,
		shadow: .6,
		glow: .4,
		clouds: .3
	},
	{
		t: 4.3,
		name: "late night",
		top: "#070c24",
		horizon: "#213062",
		bottom: "#0d1436",
		sun: "#7a98ff",
		sunI: .72,
		hemiSky: "#2e4ab0",
		hemiGround: "#121632",
		hemiI: 1.1,
		fog: .0115,
		exp: 1.3,
		night: 1,
		moon: 1,
		shadow: .58,
		glow: .5,
		clouds: .34
	},
	{
		t: 5.25,
		name: "pre-dawn",
		top: "#18204e",
		horizon: "#5c5a92",
		bottom: "#282852",
		sun: "#a0a6ea",
		sunI: .16,
		hemiSky: "#5460a8",
		hemiGround: "#221e38",
		hemiI: 1.05,
		fog: .014,
		exp: 1.26,
		night: .86,
		moon: 1,
		shadow: .35,
		glow: .8,
		clouds: .45
	},
	{
		t: 6.1,
		name: "pink dawn",
		top: "#3c5098",
		horizon: "#f59aa0",
		bottom: "#8a6aa0",
		sun: "#ff7c6a",
		sunI: 2.3,
		hemiSky: "#9a86d2",
		hemiGround: "#6a4450",
		hemiI: .98,
		fog: .012,
		exp: 1.08,
		night: .3,
		moon: 0,
		shadow: .85,
		glow: 1,
		clouds: .45
	},
	{
		t: 6.9,
		name: "sunrise",
		top: "#4a74c4",
		horizon: "#f8c0a0",
		bottom: "#a08aa8",
		sun: "#ffb88a",
		sunI: 2.8,
		hemiSky: "#98aee0",
		hemiGround: "#6e5048",
		hemiI: 1.05,
		fog: .013,
		exp: 1.06,
		night: .06,
		moon: 0,
		shadow: .95,
		glow: 1,
		clouds: .44
	},
	{
		t: 8,
		name: "morning",
		top: "#4f86d6",
		horizon: "#d6e6f0",
		bottom: "#9cb6cc",
		sun: "#ffe6c0",
		sunI: 3.2,
		hemiSky: "#a2c2ec",
		hemiGround: "#6e5c46",
		hemiI: 1.05,
		fog: .011,
		exp: 1.02,
		night: 0,
		moon: 0,
		shadow: 1,
		glow: .8,
		clouds: .42
	},
	{
		t: 12.2,
		name: "noon",
		top: "#3a7ee0",
		horizon: "#c4e0f2",
		bottom: "#8fb4d0",
		sun: "#fff4e2",
		sunI: 3.5,
		hemiSky: "#a6c8f2",
		hemiGround: "#72624a",
		hemiI: 1.1,
		fog: .009,
		exp: 1,
		night: 0,
		moon: 0,
		shadow: 1,
		glow: .7,
		clouds: .38
	},
	{
		t: 15.3,
		name: "afternoon",
		top: "#4880d8",
		horizon: "#dde2da",
		bottom: "#9eb0c0",
		sun: "#ffe0b0",
		sunI: 3.6,
		hemiSky: "#9cb8e8",
		hemiGround: "#786248",
		hemiI: 1.1,
		fog: .0095,
		exp: 1,
		night: 0,
		moon: 0,
		shadow: 1,
		glow: .8,
		clouds: .42
	},
	{
		t: 17.2,
		name: "golden hour",
		top: "#3e4c9a",
		horizon: "#f7a068",
		bottom: "#a0628a",
		sun: "#ffb466",
		sunI: 6,
		hemiSky: "#7078cc",
		hemiGround: "#9a6444",
		hemiI: 1.45,
		fog: .0098,
		exp: 1.12,
		night: 0,
		moon: 0,
		shadow: 1,
		glow: 1,
		clouds: .48
	},
	{
		t: 18.45,
		name: "sunset",
		top: "#2a2a70",
		horizon: "#ec7e6c",
		bottom: "#643a70",
		sun: "#ff8050",
		sunI: 3.1,
		hemiSky: "#6c5ec4",
		hemiGround: "#4c2e44",
		hemiI: 1.2,
		fog: .0112,
		exp: 1.12,
		night: .22,
		moon: 0,
		shadow: .85,
		glow: 1.3,
		clouds: .5
	},
	{
		t: 19.25,
		name: "purple dusk",
		top: "#1a1c54",
		horizon: "#8a5a9e",
		bottom: "#2c2052",
		sun: "#c07aaa",
		sunI: .3,
		hemiSky: "#4c4ea8",
		hemiGround: "#2a1c36",
		hemiI: 1.15,
		fog: .013,
		exp: 1.28,
		night: .62,
		moon: 0,
		shadow: .5,
		glow: .9,
		clouds: .46
	},
	{
		t: 20.05,
		name: "blue hour",
		top: "#0b1240",
		horizon: "#2c3e82",
		bottom: "#111a40",
		sun: "#7090f4",
		sunI: .38,
		hemiSky: "#304cae",
		hemiGround: "#12152e",
		hemiI: 1.08,
		fog: .0125,
		exp: 1.28,
		night: .92,
		moon: 1,
		shadow: .5,
		glow: .5,
		clouds: .42
	},
	{
		t: 21.4,
		name: "night",
		top: "#060b20",
		horizon: "#1c2b5c",
		bottom: "#0b1332",
		sun: "#7294ff",
		sunI: .82,
		hemiSky: "#2a48b4",
		hemiGround: "#101430",
		hemiI: 1.12,
		fog: .011,
		exp: 1.3,
		night: 1,
		moon: 1,
		shadow: .6,
		glow: .4,
		clouds: .3
	}
], vl = [
	"top",
	"horizon",
	"bottom",
	"sun",
	"hemiSky",
	"hemiGround"
], yl = [
	"sunI",
	"hemiI",
	"fog",
	"exp",
	"night",
	"moon",
	"shadow",
	"glow",
	"clouds"
], bl = vl.length * 3 + yl.length, xl = vl.length * 3, Sl = Object.fromEntries(yl.map((e, t) => [e, xl + t])), Cl = 3.5, wl = class {
	constructor(e, t, n, r = 24) {
		let i = e.length;
		this.n = i, this.channels = n, this.period = r, this.t = new Float64Array(i + 1), this.y = new Float64Array((i + 1) * n), this.m = new Float64Array((i + 1) * n);
		for (let t = 0; t < i; t++) this.t[t] = e[t];
		this.t[i] = e[0] + r, this.y.set(t.subarray(0, i * n)), this.y.set(t.subarray(0, n), i * n);
		let a = new Float64Array(i);
		for (let e = 0; e < i; e++) a[e] = this.t[e + 1] - this.t[e];
		let o = new Float64Array(i);
		for (let e = 0; e < n; e++) {
			for (let t = 0; t < i; t++) o[t] = (this.y[(t + 1) * n + e] - this.y[t * n + e]) / a[t];
			for (let t = 0; t < i; t++) {
				let r = (t - 1 + i) % i, s = o[r], c = o[t], l = 0;
				if (s * c > 0) {
					let e = a[r], n = a[t], i = 2 * n + e, o = n + 2 * e;
					l = (i + o) / (i / s + o / c);
				}
				this.m[t * n + e] = l;
			}
			this.m[i * n + e] = this.m[e];
		}
	}
	evaluate(e, t) {
		let { n, channels: r, t: i } = this, a = e - i[0];
		a = (a % this.period + this.period) % this.period + i[0];
		let o = 0;
		for (; o < n - 1 && a >= i[o + 1];) o++;
		let s = i[o + 1] - i[o], c = (a - i[o]) / s, l = c * c, u = l * c, d = 2 * u - 3 * l + 1, f = (u - 2 * l + c) * s, p = -2 * u + 3 * l, m = (u - l) * s, h = o * r, g = (o + 1) * r;
		for (let e = 0; e < r; e++) t[e] = d * this.y[h + e] + f * this.m[h + e] + p * this.y[g + e] + m * this.m[g + e];
		return t;
	}
};
function Tl(e, t, n, r) {
	let i = (e - t.noon) / 24 * Math.PI * 2, a = t.lat * j, o = t.dec * j, s = Math.cos(o), c = Math.sin(o), l = Math.cos(i), u = Math.sin(i), d = Math.sin(a), f = Math.cos(a), p = -s * u, m = c * d + s * l * f, h = -c * f + s * l * d, g = Math.cos(n), _ = Math.sin(n);
	return r.set(p * g + h * _, m, -p * _ + h * g).normalize();
}
function El(e, t, n) {
	let r = Tl(t, e, 0, new D());
	return n * j - Math.atan2(r.x, r.z);
}
var Dl = (e, t, n) => .5 * (e + t + Math.sqrt((e - t) * (e - t) + n * n)), Ol = (e, t, n) => .5 * (e + t - Math.sqrt((e - t) * (e - t) + n * n));
function kl(e) {
	return e = (e + Math.PI) % (Math.PI * 2), e < 0 && (e += Math.PI * 2), e - Math.PI;
}
function Al(e, t) {
	let n = Math.floor(e), r = e - n, i = r * r * (3 - 2 * r);
	return ke(A(n, 0, t), A(n + 1, 0, t), i);
}
function jl(e, t) {
	return Al(e, t) * .55 + Al(e * 2.37 + 11.3, t + 17) * .3 + Al(e * 5.13 + 3.1, t + 41) * .15;
}
var Ml = new D(), Nl = new D(), Pl = new D(), Fl = new D(), Il = new D(), Ll = (e, t) => t.setStyle(e, r), Rl = class {
	constructor(e, r = {}) {
		this.name = "lighting", this.engine = e, this.renderer = e.renderer, this.scene = e.scene, this.camera = e.camera, this.timeOfDay = ((r.timeOfDay ?? 17.2) % 24 + 24) % 24, this.timeSpeed = r.timeSpeed ?? 0, this.paused = !1, this.settings = {
			sunMul: 1,
			ambientMul: 1,
			fogMul: 1,
			shadows: !0,
			exposureMul: 1,
			pointLightMul: 1,
			flicker: !0,
			backdrop: null
		}, this._clearBefore = null, this._backdropApplied = null, this.shadowMapSize = r.shadowMapSize ?? 2048, this._shadowExtent = r.shadowExtent ?? 22, this.lightDistance = r.lightDistance ?? 70, this.minElevation = (r.minElevation ?? 10) * j, this.maxElevation = (r.maxElevation ?? 68) * j, this.followPlaneY = r.followPlaneY ?? 0, this.shadowForward = r.shadowForward ?? .22, this.shadowRadius = {
			day: 2.5,
			night: 3.2
		}, this.sunPath = {
			noon: 12.4,
			lat: 45,
			dec: 5,
			refTime: 17.2,
			refAzimuth: -125,
			...r.sunPath || {}
		}, this.moonPath = {
			noon: 23.6,
			lat: 45,
			dec: 2,
			refTime: 0,
			refAzimuth: 140,
			...r.moonPath || {}
		}, this._sunYaw = El(this.sunPath, this.sunPath.refTime, this.sunPath.refAzimuth), this._moonYaw = El(this.moonPath, this.moonPath.refTime, this.moonPath.refAzimuth), this.group = new y(), this.group.name = "LightingSystem", this.sun = new t(16777215, 3), this.sun.name = "Sun", this.sun.castShadow = !0;
		let i = this.sun.shadow;
		i.mapSize.set(this.shadowMapSize, this.shadowMapSize), i.bias = -2e-4, i.normalBias = .055, i.radius = this.shadowRadius.day, i.camera.near = 1, i.camera.far = this.lightDistance * 2.4, this._applyShadowExtent(), this.group.add(this.sun, this.sun.target), this.hemi = new o(10535167, 6309944, 1), this.hemi.name = "Hemisphere", this.hemi.position.set(0, 1, 0), this.group.add(this.hemi), this.pointLightGroup = new y(), this.pointLightGroup.name = "PointLights", this.group.add(this.pointLightGroup), this.sky = new gl(r.sky), this.scene.add(this.group), this.scene.add(this.sky.object), this.fog = new n(10465480, .012), this._previousFog = this.scene.fog, this.scene.fog = this.fog, this.renderer?.shadowMap && (this.renderer.shadowMap.enabled = !0, this.renderer.shadowMap.type === 2 && (this.renderer.shadowMap.type = 1)), this._values = new Float64Array(bl), this.setKeyframes(r.keyframes ?? _l), this.state = {
			skyTop: new E(),
			skyHorizon: new E(),
			skyBottom: new E(),
			sunColor: new E(),
			hemiSky: new E(),
			hemiGround: new E(),
			sunIntensity: 0,
			hemiIntensity: 0,
			fogDensity: 0,
			exposure: 1,
			night: 0,
			moonBlend: 0,
			shadowIntensity: 1,
			glow: 1,
			clouds: .4,
			sunElevation: 0,
			lightElevation: 0
		}, this._sunDir = new D(0, 1, 0), this._moonDir = new D(0, 1, 0), this._lightDir = new D(0, 1, 0), this._skyState = {
			top: this.state.skyTop,
			horizon: this.state.skyHorizon,
			bottom: this.state.skyBottom,
			sunDirection: this._sunDir,
			moonDirection: this._moonDir,
			sunColor: new E(),
			night: 0,
			glow: 1,
			clouds: .4
		}, this._follow = null, this._clock = 0, this._pointLights = [], this._unindexed = /* @__PURE__ */ new Set(), this._emissives = [], this._nightFactor = 0, this._apply(0);
	}
	setTime(e) {
		this.timeOfDay = (e % 24 + 24) % 24, this._apply(0);
	}
	get nightFactor() {
		return this._nightFactor;
	}
	get phaseName() {
		let e = "", t = Infinity, n = this.timeOfDay;
		for (let r = 0; r < this.keyframes.length; r++) {
			let i = this.keyframes[r], a = Math.min(Math.abs(i.t - n), 24 - Math.abs(i.t - n));
			a < t && (t = a, e = i.name ?? "");
		}
		return e;
	}
	get sunDirection() {
		return this._lightDir;
	}
	get trueSunDirection() {
		return this._sunDir;
	}
	get moonDirection() {
		return this._moonDir;
	}
	get shadowExtent() {
		return this._shadowExtent;
	}
	set shadowExtent(e) {
		this._shadowExtent = e, this._applyShadowExtent();
	}
	setShadowDepthRange(e, t) {
		let n = this.sun.shadow.camera;
		this._shadowBase ??= {
			near: n.near,
			far: n.far,
			bias: this.sun.shadow.bias
		};
		let r = this._shadowBase;
		e == null || t == null ? (n.near = r.near, n.far = r.far, this.sun.shadow.bias = r.bias) : (n.near = Math.max(.1, this.lightDistance - e), n.far = Math.max(n.near + 1, this.lightDistance + t), this.sun.shadow.bias = r.bias * ((r.far - r.near) / (n.far - n.near))), n.updateProjectionMatrix();
	}
	_setBackdrop(e) {
		this.sky.object.visible = !e, this._backdropApplied = e ? (this._backdropApplied ?? new E()).copy(e) : null;
		let t = this.renderer;
		if (t) {
			if (e) {
				if (!this._clearBefore) {
					let e = new E();
					t.getClearColor(e), this._clearBefore = {
						color: e,
						alpha: t.getClearAlpha()
					};
				}
				t.setClearColor(e, 1);
			} else this._clearBefore &&= (t.setClearColor(this._clearBefore.color, this._clearBefore.alpha), null);
		}
	}
	followTarget(e) {
		this._follow = e || null;
	}
	setKeyframes(e) {
		let t = [...e].sort((e, t) => e.t - t.t);
		this.keyframes = t;
		let n = new Float64Array(t.length * bl), i = new E();
		t.forEach((e, t) => {
			let a = _l.reduce((t, n) => Math.abs(n.t - e.t) < Math.abs(t.t - e.t) ? n : t);
			vl.forEach((o, s) => {
				let c = e[o] ?? a[o];
				typeof c == "number" ? i.setHex(c, r) : Ll(c, i), n[t * bl + s * 3] = i.r, n[t * bl + s * 3 + 1] = i.g, n[t * bl + s * 3 + 2] = i.b;
			}), yl.forEach((r, i) => {
				n[t * bl + xl + i] = e[r] ?? a[r];
			});
		}), this._track = new wl(t.map((e) => (e.t % 24 + 24) % 24), n, bl, 24), this.state && this._apply(0);
	}
	addPointLight({ position: e, color: t = 16757867, intensity: n = 8, distance: r = 8, decay: i = 2, flicker: a = .3, nightOnly: o = !0, dayIntensity: s = .15, seed: c, flickerSpeed: l = 2.6, indexed: u = !0 } = {}) {
		let d = new g(t, 0, r, i);
		d.castShadow = !1, e && d.position.set(e.x, e.y, e.z), this.pointLightGroup.add(d);
		let f = this._pointLights.length - this._unindexed.size, p = this, m = {
			light: d,
			intensity: n,
			flicker: a,
			nightOnly: o,
			dayIntensity: s,
			flickerSpeed: l,
			seed: c ?? f * 7919 + 13 >>> 0,
			flickerFactor: 1,
			fade: 1,
			dispose() {
				let e = p._pointLights.indexOf(m);
				e >= 0 && p._pointLights.splice(e, 1), p._unindexed.delete(m), d.removeFromParent(), d.dispose();
			}
		};
		return this._pointLights.push(m), u || this._unindexed.add(m), this._updatePointLight(m), m;
	}
	retargetPointLight(e, t = {}) {
		let n = e.light;
		t.position && n.position.set(t.position.x, t.position.y, t.position.z), t.color !== void 0 && n.color.set(t.color), t.distance !== void 0 && (n.distance = t.distance), t.decay !== void 0 && (n.decay = t.decay);
		for (let n of [
			"intensity",
			"flicker",
			"nightOnly",
			"dayIntensity",
			"seed",
			"flickerSpeed"
		]) t[n] !== void 0 && (e[n] = t[n]);
		return this._updatePointLight(e), e;
	}
	flickerAt(e, t, n = 2.6) {
		if (!this.settings.flicker || !(t > 0)) return 1;
		let r = jl(this._clock * n, e);
		return Math.max(0, 1 + t * (r - .5) * 1.7);
	}
	registerEmissive(e, { day: t = 0, night: n = 1.6, flicker: r = null } = {}) {
		let i = this, a = {
			material: e,
			day: t,
			night: n,
			flicker: r,
			dispose() {
				let e = i._emissives.indexOf(a);
				e >= 0 && i._emissives.splice(e, 1);
			}
		};
		return this._emissives.push(a), this._updateEmissive(a), a;
	}
	update(e) {
		!this.paused && this.timeSpeed !== 0 && (this.timeOfDay = ((this.timeOfDay + this.timeSpeed * e) % 24 + 24) % 24), this._apply(e);
	}
	lateUpdate() {
		this._placeSun();
	}
	dispose() {
		for (let e of [...this._pointLights]) e.dispose();
		this._emissives.length = 0, this.sun.dispose(), this.hemi.dispose(), this.group.removeFromParent(), this.sky.object.removeFromParent(), this.sky.dispose(), this.scene.fog === this.fog && (this.scene.fog = this._previousFog ?? null);
	}
	_applyShadowExtent() {
		let e = this.sun.shadow.camera, t = this._shadowExtent;
		e.left = -t, e.right = t, e.top = t, e.bottom = -t, e.updateProjectionMatrix();
	}
	_apply(e) {
		this._clock += e;
		let t = this._track.evaluate(this.timeOfDay, this._values), n = this.state, r = this._stateColors ||= [
			n.skyTop,
			n.skyHorizon,
			n.skyBottom,
			n.sunColor,
			n.hemiSky,
			n.hemiGround
		];
		for (let e = 0; e < 6; e++) r[e].setRGB(Math.max(0, t[e * 3]), Math.max(0, t[e * 3 + 1]), Math.max(0, t[e * 3 + 2]));
		n.sunIntensity = Math.max(0, t[Sl.sunI]), n.hemiIntensity = Math.max(0, t[Sl.hemiI]), n.fogDensity = Math.max(0, t[Sl.fog]), n.exposure = Math.max(.05, t[Sl.exp]), n.night = k(t[Sl.night]), n.moonBlend = k(t[Sl.moon]), n.shadowIntensity = k(t[Sl.shadow]), n.glow = Math.max(0, t[Sl.glow]), n.clouds = k(t[Sl.clouds]), this._nightFactor = n.night, this._computeDirections();
		let i = this.settings;
		this.sun.color.copy(n.sunColor), this.sun.intensity = n.sunIntensity * i.sunMul;
		let a = this.sun.shadow;
		a.intensity = i.shadows ? n.shadowIntensity : 0, a.autoUpdate = !!i.shadows, a.radius = ke(this.shadowRadius.day, this.shadowRadius.night, n.night), this._placeSun(), this.hemi.color.copy(n.hemiSky), this.hemi.groundColor.copy(n.hemiGround), this.hemi.intensity = n.hemiIntensity * i.ambientMul;
		let o = i.backdrop;
		this.fog.color.copy(o ?? n.skyHorizon), this.fog.density = n.fogDensity * i.fogMul, this.scene.fog !== this.fog && this.scene.fog == null && (this.scene.fog = this.fog);
		let s = this._backdropApplied;
		(this.sky.object.visible === !!o || o && !(s && s.equals(o))) && this._setBackdrop(o), this.renderer && (this.renderer.toneMappingExposure = n.exposure * i.exposureMul), M.uNight.value = n.night, M.uSunDirection.value.copy(this._lightDir), M.uSunColor.value.copy(n.sunColor).multiplyScalar(n.sunIntensity * i.sunMul / Cl), M.uFogColor.value.copy(o ?? n.skyHorizon);
		let c = this._skyState;
		c.sunColor.copy(n.sunColor), c.night = n.night, c.glow = n.glow, c.clouds = n.clouds, this.sky.setState(c), this.sky.update(e);
		for (let e = 0; e < this._pointLights.length; e++) this._updatePointLight(this._pointLights[e]);
		for (let e = 0; e < this._emissives.length; e++) this._updateEmissive(this._emissives[e]);
	}
	_computeDirections() {
		let e = this.state;
		Tl(this.timeOfDay, this.sunPath, this._sunYaw, this._sunDir), Tl(this.timeOfDay, this.moonPath, this._moonYaw, this._moonDir);
		let t = Math.asin(k(this._sunDir.y, -1, 1)), n = Math.asin(k(this._moonDir.y, -1, 1));
		e.sunElevation = t;
		let r = .12, i = this.minElevation, a = this.maxElevation, o = Ol(Dl(t, i, r), a, r), s = Ol(Dl(n, i, r), a, r), c = Math.atan2(this._sunDir.x, this._sunDir.z), l = Math.atan2(this._moonDir.x, this._moonDir.z), u = e.moonBlend, d = c + kl(l - c) * u, f = ke(o, s, u);
		e.lightElevation = f;
		let p = Math.cos(f);
		this._lightDir.set(Math.sin(d) * p, Math.sin(f), Math.cos(d) * p);
	}
	_getFollowPoint(e) {
		let t = this._follow;
		if (t && t.isObject3D) return t.getWorldPosition(e);
		if (t && t.isVector3) return e.copy(t);
		let n = this.camera;
		if (!n) return e.set(0, 0, 0);
		Il.setFromMatrixPosition(n.matrixWorld), n.getWorldDirection(Fl);
		let r = 24;
		return Fl.y < -.05 && (r = Math.min(60, (Il.y - this.followPlaneY) / -Fl.y)), e.copy(Il).addScaledVector(Fl, Math.max(0, r));
	}
	_placeSun() {
		let e = this._lightDir, t = this.camera;
		if (t && t.updateWorldMatrix(!0, !1), this._getFollowPoint(Ml), t && this.shadowForward !== 0) {
			Il.setFromMatrixPosition(t.matrixWorld);
			let e = Ml.x - Il.x, n = Ml.z - Il.z, r = Math.hypot(e, n);
			if (r > .001) {
				let t = Il.distanceTo(Ml), i = Math.min(t * this.shadowForward, this._shadowExtent * .5) / r;
				Ml.x += e * i, Ml.z += n * i;
			}
		}
		let n = this.sun.shadow.camera.up;
		Nl.crossVectors(n, e), Nl.lengthSq() < 1e-8 && Nl.set(1, 0, 0), Nl.normalize(), Pl.crossVectors(e, Nl);
		let r = 2 * this._shadowExtent / this.shadowMapSize, i = Ml.dot(Nl), a = Ml.dot(Pl), o = Math.round(i / r) * r - i, s = Math.round(a / r) * r - a;
		Ml.addScaledVector(Nl, o).addScaledVector(Pl, s), this.sun.target.position.copy(Ml), this.sun.position.copy(Ml).addScaledVector(e, this.lightDistance), this.sun.target.updateMatrixWorld(), this.sun.updateMatrixWorld();
	}
	_updatePointLight(e) {
		let t = this.settings, n = 1;
		if (t.flicker && e.flicker > 0) {
			let t = jl(this._clock * e.flickerSpeed, e.seed);
			n = Math.max(0, 1 + e.flicker * (t - .5) * 1.7);
		}
		e.flickerFactor = n;
		let r = e.nightOnly ? ke(e.dayIntensity, 1, this._nightFactor) : 1, i = e.intensity * r * n * t.pointLightMul;
		e.light.intensity = e.fade === 1 || e.fade === void 0 ? i : i * e.fade;
	}
	_updateEmissive(e) {
		let t = ke(e.day, e.night, this._nightFactor);
		e.flicker && (t *= ke(1, e.flicker.flickerFactor, .6)), e.material.emissiveIntensity = t;
	}
}, zl = class {
	constructor(e, t = [], n = {}) {
		if (this.lighting = e, this.descriptors = t.slice(), this.size = Math.max(0, Math.floor(n.size ?? 12)), this.fixed = !!n.fixed, this.interval = n.interval ?? .2, this.fadeTime = n.fadeTime ?? .35, this.margin = n.margin ?? 4, this.priorityWeight = n.priorityWeight ?? 1.5, this.hysteresis = n.hysteresis ?? 2, this.dayPenalty = n.dayPenalty ?? 10, this.nightDayIntensity = n.nightDayIntensity ?? .05, this.pooled = this.descriptors.length > this.size, this.handles = [], this._slots = [], this._sources = /* @__PURE__ */ new Map(), this._emissives = [], this._timer = 0, this._snapNext = !0, this._frustum = new x(), this._m = new ye(), this._sphere = new d(), this._scored = this.descriptors.map((e) => ({
			d: e,
			s: 0
		})), this._wanted = /* @__PURE__ */ new Set(), this._seeds = /* @__PURE__ */ new Map(), this._baseSeeds = [], this._hidden = /* @__PURE__ */ new Set(), this._staticFading = !1, this.fixed) {
			for (let e = 0; e < this.size; e++) this.handles.push(this._addParked());
			this._baseSeeds = this.handles.map((e) => e.seed);
			let e = this.descriptors;
			this.descriptors = [], this.pooled = !1, this.setDescriptors(e, { snap: !0 });
			return;
		}
		if (!this.pooled) {
			for (let t of this.descriptors) {
				let n = e.addPointLight(this._staticParams(t));
				n.tag = t.tag, n.desc = t, this.handles.push(n);
			}
			this._baseSeeds = this.handles.map((e) => e.seed);
			return;
		}
		for (let e of this.descriptors) this._seeds.set(e, e.seed ?? Gl(e.position));
		for (let t = 0; t < this.size; t++) {
			let t = e.addPointLight({
				position: Bl,
				intensity: 0,
				distance: 8,
				flicker: 0,
				nightOnly: !1
			});
			t.fade = 0, t.tag = "", t.desc = null, this.handles.push(t), this._slots.push({
				handle: t,
				desc: null,
				target: null,
				fade: 0
			});
		}
		this._baseSeeds = this.handles.map((e) => e.seed);
	}
	get activeCount() {
		if (!this.pooled) return Math.min(this.handles.length, this.descriptors.length);
		let e = 0;
		for (let t of this._slots) t.desc && e++;
		return e;
	}
	get used() {
		return this.activeCount;
	}
	get active() {
		return this.pooled ? this._slots.filter((e) => e.desc).map((e) => e.desc) : this.descriptors.slice(0, this.handles.length);
	}
	snap() {
		this._snapNext = !0;
	}
	setHidden(e, t, { instant: n = !1 } = {}) {
		if (!e || t === this._hidden.has(e)) return;
		if (t ? this._hidden.add(e) : this._hidden.delete(e), this.pooled) {
			this._timer = 0, n && (this._snapNext = !0);
			return;
		}
		let r = this.handles.find((t) => t.desc === e);
		r && (n ? (r.fade = +!t, t && (r.light.intensity = 0)) : this._staticFading = !0);
	}
	isHidden(e) {
		return this._hidden.has(e);
	}
	setDescriptors(e, { snap: t = !1 } = {}) {
		let n = e.slice(), r = this.descriptors, i = n.length === r.length && n.every((e, t) => e === r[t]);
		if (this.descriptors = n, i || (this._scored = n.map((e) => ({
			d: e,
			s: 0
		}))), t && (this._snapNext = !0), !i && this._hidden.size) {
			let e = new Set(n);
			for (let t of this._hidden) e.has(t) || this._hidden.delete(t);
		}
		let a = this.handles.length, o = this.lighting;
		if (n.length <= a) {
			this.pooled = !1, this._slots.length = 0, this._seeds.clear();
			for (let e = 0; e < a; e++) {
				let r = this.handles[e], i = n[e];
				if (!i) {
					this._park(r);
					continue;
				}
				this._hidden.has(i) ? t || r.desc !== i ? r.fade = 0 : this._staticFading = !0 : r.fade = 1, o.retargetPointLight(r, this._params(i, i.seed ?? this._baseSeeds[e])), r.tag = i.tag, r.desc = i;
			}
			return;
		}
		let s = i ? null : new Set(n), c = i ? null : Wl(r, n, s), l = (e) => !e || i || s.has(e) ? e : c.get(e) ?? null;
		if (!i) {
			let e = /* @__PURE__ */ new Map();
			for (let t of n) e.set(t, this._seeds.get(t) ?? t.seed ?? Gl(t.position));
			this._seeds = e;
			for (let [e, t] of [...this._sources]) {
				let n = c.get(e);
				n && !this._sources.has(n) && (this._sources.delete(e), this._sources.set(n, t));
			}
		}
		if (!this.pooled) {
			this.pooled = !0, this._slots = this.handles.map((e) => {
				let t = l(e.desc ?? null);
				return {
					handle: e,
					desc: t,
					target: null,
					fade: +!!t
				};
			});
			for (let e of this._slots) e.desc || this._park(e.handle), e.handle.desc = e.desc, e.handle.fade = e.fade;
		} else if (!i) {
			let e = /* @__PURE__ */ new Set();
			for (let t of this._slots) {
				let n = t.desc, r = l(n);
				r && r !== n && !e.has(r) && (n = r), n !== t.desc && (t.desc = n, t.handle.desc = n), t.desc && s.has(t.desc) && e.add(t.desc);
			}
			let t = /* @__PURE__ */ new Set();
			for (let e of this._slots) {
				let n = l(e.target);
				e.target = n && !t.has(n) ? n : null, e.target && t.add(e.target);
			}
		}
		for (let e of this._slots) e.desc && (o.retargetPointLight(e.handle, this._params(e.desc, this._seeds.get(e.desc) ?? e.handle.seed)), e.handle.tag = e.desc.tag);
		i || (this._timer = 0);
	}
	flickerSource(e) {
		let t = this._sources.get(e);
		return t || (t = { flickerFactor: 1 }, this._sources.set(e, t)), t;
	}
	registerEmissive(e, { day: t = 0, night: n = 1.6, light: r = null } = {}) {
		let i = r ? this.flickerSource(r) : null, a = this.lighting.registerEmissive(e, {
			day: t,
			night: n,
			flicker: i
		});
		return this._emissives.push(a), a;
	}
	update(e, { focus: t = null, camera: n = null } = {}) {
		if (this._updateSources(), !this.pooled) {
			this._snapNext = !1, this._staticFading && this._fadeStatic(e);
			return;
		}
		let r = this.nightDayIntensity;
		for (let e of this._slots) e.desc && e.desc.nightOnly !== !1 && e.desc.dayIntensity === void 0 && (e.handle.dayIntensity = r);
		if (this._snapNext) {
			this._snapNext = !1, this._timer = this.interval, this._assign(t, n);
			for (let e of this._slots) {
				let t = e.target !== e.desc;
				t && this._move(e, e.target), e.fade = +!!e.desc, e.handle.fade = e.fade, t && e.desc && this.lighting.retargetPointLight(e.handle, {});
			}
			return;
		}
		this._timer -= e, this._timer <= 0 && (this._timer = this.interval, this._assign(t, n));
		let i = this.fadeTime > 0 ? e / this.fadeTime : 1;
		for (let e of this._slots) e.target === e.desc ? e.desc && (e.fade = Math.min(1, e.fade + i)) : (e.fade = e.desc ? Math.max(0, e.fade - i) : 0, e.fade === 0 && this._move(e, e.target)), e.handle.fade = e.fade * e.fade * (3 - 2 * e.fade);
	}
	_fadeStatic(e) {
		let t = this.fadeTime > 0 ? e / this.fadeTime : 1, n = !1;
		for (let e of this.handles) {
			if (!e.desc) continue;
			let r = +!this._hidden.has(e.desc);
			e.fade !== r && (e.fade = r > e.fade ? Math.min(1, e.fade + t) : Math.max(0, e.fade - t), e.fade !== r && (n = !0));
		}
		this._staticFading = n;
	}
	dispose() {
		for (let e of this._emissives) e.dispose();
		this._emissives.length = 0;
		for (let e of this.handles) e.dispose();
		this.handles.length = 0, this._slots.length = 0, this._sources.clear();
	}
	_staticParams(e) {
		let t = e.nightOnly ?? !0;
		return {
			position: e.position,
			color: e.color,
			intensity: e.intensity,
			distance: e.distance,
			flicker: e.flicker,
			nightOnly: t,
			dayIntensity: e.dayIntensity ?? (t ? this.nightDayIntensity : 1),
			...e.seed === void 0 ? {} : { seed: e.seed },
			...e.flickerSpeed === void 0 ? {} : { flickerSpeed: e.flickerSpeed }
		};
	}
	_addParked() {
		let e = this.lighting.addPointLight({
			position: Bl,
			intensity: 0,
			distance: 8,
			flicker: 0,
			nightOnly: !1
		});
		return e.fade = 0, e.tag = "", e.desc = null, e;
	}
	_park(e) {
		e.desc = null, e.tag = "", e.fade = 0, e.intensity = 0, e.light.intensity = 0, e.light.position.copy(Bl);
	}
	_params(e, t) {
		let n = e.nightOnly ?? !0;
		return {
			position: e.position,
			color: e.color ?? 16757867,
			intensity: e.intensity ?? 8,
			distance: e.distance ?? 8,
			flicker: e.flicker ?? .3,
			nightOnly: n,
			dayIntensity: e.dayIntensity ?? (n ? this.nightDayIntensity : 1),
			seed: t,
			flickerSpeed: e.flickerSpeed ?? 2.6
		};
	}
	_move(e, t) {
		e.desc = t;
		let n = e.handle;
		if (n.desc = t, n.fade = 0, n.light.intensity = 0, !t) {
			n.tag = "", n.intensity = 0, n.light.position.copy(Bl);
			return;
		}
		let r = t.nightOnly ?? !0;
		this.lighting.retargetPointLight(n, {
			position: t.position,
			color: t.color ?? 16757867,
			intensity: t.intensity ?? 8,
			distance: t.distance ?? 8,
			flicker: t.flicker ?? .3,
			nightOnly: r,
			dayIntensity: t.dayIntensity ?? (r ? this.nightDayIntensity : 1),
			seed: this._seeds.get(t),
			flickerSpeed: t.flickerSpeed ?? 2.6
		}), n.tag = t.tag;
	}
	_assign(e, t) {
		let n = this._wanted;
		n.clear();
		let r = null;
		t && (t.updateMatrixWorld(), this._m.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), r = this._frustum.setFromProjectionMatrix(this._m, t.coordinateSystem));
		let i = /* @__PURE__ */ new Set();
		for (let e of this._slots) e.target && i.add(e.target);
		let a = this.lighting.nightFactor, o = e?.x ?? 0, s = e?.y ?? 0, c = e?.z ?? 0, l = this._scored, u = 0;
		for (let t = 0; t < l.length; t++) {
			let n = l[t], d = n.d, f = d.position;
			if (r && (this._sphere.center.copy(f), this._sphere.radius = (d.distance ?? 8) + this.margin, !r.intersectsSphere(this._sphere))) {
				n.s = Infinity;
				continue;
			}
			if (this._hidden.size && this._hidden.has(d)) {
				n.s = Infinity;
				continue;
			}
			let p = d.nightOnly ?? !0 ? ke(d.dayIntensity ?? this.nightDayIntensity, 1, a) : 1;
			n.s = (e ? Math.hypot(f.x - o, (f.y - s) * .5, f.z - c) : 0) + (d.priority ?? 3) * this.priorityWeight + (1 - Math.min(1, p)) * this.dayPenalty - (i.has(d) ? this.hysteresis : 0), u++;
		}
		if (u) {
			l.sort((e, t) => e.s - t.s);
			for (let e = 0; e < Math.min(this.size, u); e++) n.add(l[e].d);
		}
		let d = /* @__PURE__ */ new Set();
		for (let e of this._slots) e.target && n.has(e.target) && !d.has(e.target) ? d.add(e.target) : e.desc && n.has(e.desc) && !d.has(e.desc) ? (e.target = e.desc, d.add(e.desc)) : e.target = null;
		let f = this._slots.filter((e) => !e.target).sort((e, t) => e.fade - t.fade), p = 0;
		for (let e of n) {
			if (d.has(e)) continue;
			let t = f[p++];
			if (!t) break;
			t.target = e;
		}
	}
	_updateSources() {
		if (!this._sources.size) return;
		let e = this.lighting;
		for (let [t, n] of this._sources) {
			let r = this._handleOf(t);
			n.flickerFactor = r ? r.flickerFactor : e.flickerAt(this._seeds.get(t) ?? Gl(t.position), t.flicker ?? .3, t.flickerSpeed ?? 2.6);
		}
	}
	_handleOf(e) {
		if (!this.pooled) {
			let t = this.descriptors.indexOf(e);
			return t >= 0 ? this.handles[t] : null;
		}
		for (let t of this._slots) if (t.desc === e) return t.handle;
		return null;
	}
}, Bl = new D(0, -500, 0);
function Vl(e) {
	return {
		position: e.position,
		color: je(e.color, E.NAMES),
		intensity: Ul(e.intensity, 8, 0, 200),
		distance: Ul(e.distance, 8, .5, 100),
		flicker: Ul(e.flicker, .2, 0, 1),
		nightOnly: e.nightOnly ?? !0,
		priority: e.priority ?? 3,
		tag: e.tag
	};
}
function Hl(e, { cache: t = null } = {}) {
	return e.map((e, t) => ({
		d: e,
		i: t,
		p: e.priority ?? 3
	})).sort((e, t) => e.p - t.p || e.i - t.i).map(({ d: e }) => {
		if (!t) return Vl(e);
		let n = t.get(e);
		return n || (n = Vl(e), t.set(e, n)), n;
	});
}
function Ul(e, t, n, r) {
	return e === void 0 ? void 0 : Math.min(r, Math.max(n, Number.isFinite(Number(e)) && e !== null && e !== "" ? Number(e) : t));
}
function Wl(e, t, n) {
	let r = /* @__PURE__ */ new Map(), i = new Set(e), a = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
	for (let e of t) {
		if (!e.tag) continue;
		let t = o.get(e.tag) ?? 0;
		o.set(e.tag, t + 1), i.has(e) || a.set(`${e.tag}#${t}`, e);
	}
	if (!a.size) return r;
	o.clear();
	for (let t of e) {
		if (!t.tag) continue;
		let e = o.get(t.tag) ?? 0;
		if (o.set(t.tag, e + 1), n.has(t)) continue;
		let i = a.get(`${t.tag}#${e}`);
		i && r.set(t, i);
	}
	return r;
}
function Gl(e) {
	return e ? (Math.imul(Math.round(e.x * 64), 73856093) ^ Math.imul(Math.round(e.y * 64), 19349663) ^ Math.imul(Math.round(e.z * 64), 83492791)) >>> 0 : 13;
}
//#endregion
//#region src/engine/i18n/strings/hud.js
var Kl = {
	en: {
		controls: "Controls",
		hide: "Hide controls",
		show: "Show controls",
		"control.move": "Move",
		"control.run": "Run",
		"control.talk": "Talk / Confirm",
		"control.choose": "Choose an answer",
		"control.rotate": "Rotate camera",
		"control.zoom": "Zoom (or wheel)",
		"control.map": "World map",
		"control.time": "Time of day",
		"control.weather": "Weather",
		"control.photo": "Photo mode",
		"control.music": "Music",
		"control.debug": "Debug panel",
		"phase.night": "Night",
		"phase.dawn": "Dawn",
		"phase.morning": "Morning",
		"phase.midday": "Midday",
		"phase.afternoon": "Afternoon",
		"phase.golden": "Golden Hour",
		"phase.dusk": "Dusk",
		"key.left": "Left arrow",
		"key.up": "Up arrow",
		"key.right": "Right arrow",
		"key.down": "Down arrow",
		clock: "{time}, {phase}"
	},
	ja: {
		controls: "操作",
		hide: "操作説明を隠す",
		show: "操作説明を表示",
		"control.move": "移動",
		"control.run": "ダッシュ",
		"control.talk": "話す／決定",
		"control.choose": "答えを選ぶ",
		"control.rotate": "カメラ回転",
		"control.zoom": "ズーム（ホイールも可）",
		"control.map": "ワールドマップ",
		"control.time": "時間帯",
		"control.weather": "天気",
		"control.photo": "フォトモード",
		"control.music": "音楽",
		"control.debug": "デバッグパネル",
		"phase.night": "夜",
		"phase.dawn": "夜明け",
		"phase.morning": "朝",
		"phase.midday": "真昼",
		"phase.afternoon": "昼下がり",
		"phase.golden": "夕映え",
		"phase.dusk": "黄昏",
		"key.left": "左矢印",
		"key.up": "上矢印",
		"key.right": "右矢印",
		"key.down": "下矢印",
		clock: "{time}、{phase}"
	},
	zh: {
		controls: "操作",
		hide: "隐藏操作说明",
		show: "显示操作说明",
		"control.move": "移动",
		"control.run": "奔跑",
		"control.talk": "交谈／确认",
		"control.choose": "选择回答",
		"control.rotate": "旋转镜头",
		"control.zoom": "缩放（或滚轮）",
		"control.map": "世界地图",
		"control.time": "时段",
		"control.weather": "天气",
		"control.photo": "拍照模式",
		"control.music": "音乐",
		"control.debug": "调试面板",
		"phase.night": "夜晚",
		"phase.dawn": "黎明",
		"phase.morning": "清晨",
		"phase.midday": "正午",
		"phase.afternoon": "午后",
		"phase.golden": "夕照",
		"phase.dusk": "黄昏",
		"key.left": "左箭头",
		"key.up": "上箭头",
		"key.right": "右箭头",
		"key.down": "下箭头",
		clock: "{time}，{phase}"
	}
}, ql = {
	en: {
		window: "Dialogue",
		choices: "Choices",
		portrait: "Portrait of {name}",
		next: "More",
		end: "End",
		"prompt.talk": "Talk"
	},
	ja: {
		window: "会話",
		choices: "選択肢",
		portrait: "{name}の肖像",
		next: "次へ",
		end: "終わり",
		"prompt.talk": "話す"
	},
	zh: {
		window: "对话",
		choices: "选项",
		portrait: "{name}的肖像",
		next: "继续",
		end: "结束",
		"prompt.talk": "交谈"
	}
}, Jl = Object.freeze({
	hud: Kl,
	dialog: ql,
	map: {
		en: {
			north: "N",
			title: "World Map",
			legend: "Legend",
			"legend.you": "You",
			"legend.villager": "Villager",
			"legend.companion": "Companion",
			"legend.poi": "Sign · door · well",
			"legend.campfire": "Campfire",
			"legend.enemy": "Enemy",
			"legend.waystone": "Waystone",
			"legend.chest": "Chest",
			"legend.building": "Building",
			"legend.road": "Road",
			"legend.water": "Water",
			"legend.forest": "Forest",
			here: "You are in",
			close: "Close",
			aria: "World map"
		},
		ja: {
			north: "N",
			title: "ワールドマップ",
			legend: "凡例",
			"legend.you": "現在地",
			"legend.villager": "村人",
			"legend.companion": "仲間",
			"legend.poi": "立て札・扉・井戸",
			"legend.campfire": "焚き火",
			"legend.enemy": "敵",
			"legend.waystone": "道標石",
			"legend.chest": "宝箱",
			"legend.building": "建物",
			"legend.road": "道",
			"legend.water": "水辺",
			"legend.forest": "森",
			here: "現在のエリア",
			close: "閉じる",
			aria: "ワールドマップ"
		},
		zh: {
			north: "N",
			title: "世界地图",
			legend: "图例",
			"legend.you": "当前位置",
			"legend.villager": "村民",
			"legend.companion": "同伴",
			"legend.poi": "指示牌 · 门 · 水井",
			"legend.campfire": "篝火",
			"legend.enemy": "敌人",
			"legend.waystone": "路标石",
			"legend.chest": "宝箱",
			"legend.building": "建筑",
			"legend.road": "道路",
			"legend.water": "水域",
			"legend.forest": "森林",
			here: "当前区域",
			close: "关闭",
			aria: "世界地图"
		}
	},
	title: {
		en: {
			name: "Luminati",
			pressAnyKey: "Press any key",
			credit: "Luminati 2.5D Pixel-Art Engine · three.js",
			chooseLevel: "Choose a level",
			travelTo: "Travel to {label}",
			prevLevel: "Previous level",
			nextLevel: "Next level",
			choose: "Choose",
			start: "Start",
			menu: "Title menu",
			language: "Language",
			langSwitch: "Switch",
			langBack: "Back"
		},
		ja: {
			name: "Luminati",
			pressAnyKey: "何かキーを押してください",
			credit: "Luminati 2.5D ピクセルアートエンジン・three.js",
			chooseLevel: "行き先を選ぶ",
			travelTo: "{label}へ向かう",
			prevLevel: "前の行き先",
			nextLevel: "次の行き先",
			choose: "選択",
			start: "決定",
			menu: "タイトルメニュー",
			language: "言語",
			langSwitch: "切り替え",
			langBack: "戻る"
		},
		zh: {
			name: "Luminati",
			pressAnyKey: "按任意键开始",
			credit: "Luminati 2.5D 像素艺术引擎 · three.js",
			chooseLevel: "选择目的地",
			travelTo: "前往{label}",
			prevLevel: "上一个目的地",
			nextLevel: "下一个目的地",
			choose: "选择",
			start: "开始",
			menu: "标题菜单",
			language: "语言",
			langSwitch: "切换",
			langBack: "返回"
		}
	},
	game: {
		en: {
			"controls.move": "Move",
			"controls.run": "Run",
			"controls.talk": "Talk / Examine",
			"controls.choose": "Choose an answer",
			"controls.camera": "Rotate camera",
			"controls.zoom": "Zoom (or wheel)",
			"controls.map": "World map",
			"controls.time": "Time of day",
			"controls.weather": "Weather",
			"controls.photo": "Photo mode",
			"controls.music": "Music",
			"controls.debug": "Debug panel",
			"controls.journal": "Journal",
			"controls.party": "Party",
			"prompt.talk": "Talk",
			"prompt.examine": "Examine",
			"prompt.knock": "Knock",
			"prompt.read": "Read",
			"prompt.look": "Look",
			"prompt.enter": "Enter",
			"prompt.rest": "Rest",
			"prompt.open": "Open",
			"toast.noParty": "No one travels with you.",
			"toast.weather.clear": "Clear skies",
			"toast.weather.rain": "Rain",
			"toast.weather.snow": "Snowfall",
			"toast.outside.clear": "Clear skies outside",
			"toast.outside.rain": "Rain outside",
			"toast.outside.snow": "Snowfall outside",
			"toast.foes": "Not while foes are near",
			"toast.photo": "Photo mode · {P} or {Esc} to return",
			"toast.rested": "You feel well rested.",
			"toast.musicOn": "♪ Music on",
			"toast.musicOff": "Music off",
			"default.signpost": "Signpost",
			"default.villager": "Villager",
			"default.waystone": "Waystone",
			"default.chest": "The chest is locked tight.",
			"default.waystoneText": "An old waystone hums quietly.",
			"default.nothing": "Nothing of note.",
			"default.subtitle": "A Luminati 2.5D Level",
			"default.prompt": "Press any key",
			"default.credit": "Luminati 2.5D Pixel-Art Engine · three.js",
			"default.item": "Crisp Apple",
			"load.map": "Reading the map",
			"load.textures": "Painting textures",
			"load.land": "Raising the land",
			"load.village": "Building the village",
			"load.forest": "Planting the forest",
			"load.water": "Letting the water run",
			"load.meadow": "Growing the meadow",
			"load.lights": "Lighting the lanterns",
			"load.merge": "Merging meshes",
			"load.villagers": "Waking the villagers",
			"load.blades": "Sharpening blades",
			"load.warmup": "Warming up the lanterns",
			"load.ready": "Ready",
			"page.title": "{name} — Luminati 2.5D Pixel-Art Engine",
			"error.load": "Could not load {what}: {why}",
			"error.campaign": "campaign \"{name}\"",
			"error.level": "level \"{name}\"",
			"error.default": "the {name} level",
			"error.json": "the level is not valid JSON ({why})",
			"error.missing": "{file} does not exist",
			"error.unknown": "Something went wrong — see the console.",
			"error.play": "Play {name}",
			"error.editor": "Open the level editor"
		},
		ja: {
			"controls.move": "移動",
			"controls.run": "ダッシュ",
			"controls.talk": "話す／調べる",
			"controls.choose": "答えを選ぶ",
			"controls.camera": "カメラ回転",
			"controls.zoom": "ズーム（ホイールも可）",
			"controls.map": "ワールドマップ",
			"controls.time": "時間帯",
			"controls.weather": "天気",
			"controls.photo": "フォトモード",
			"controls.music": "音楽",
			"controls.debug": "デバッグパネル",
			"controls.journal": "日誌",
			"controls.party": "パーティ",
			"prompt.talk": "話す",
			"prompt.examine": "調べる",
			"prompt.knock": "ノックする",
			"prompt.read": "読む",
			"prompt.look": "調べる",
			"prompt.enter": "入る",
			"prompt.rest": "休む",
			"prompt.open": "開ける",
			"toast.noParty": "同行している仲間はいない。",
			"toast.weather.clear": "快晴",
			"toast.weather.rain": "雨",
			"toast.weather.snow": "雪",
			"toast.outside.clear": "外は快晴",
			"toast.outside.rain": "外は雨",
			"toast.outside.snow": "外は雪",
			"toast.foes": "敵が近くにいる間は使えない",
			"toast.photo": "フォトモード・{P} か {Esc} で戻る",
			"toast.rested": "ぐっすり眠って、疲れが取れた。",
			"toast.musicOn": "♪ 音楽オン",
			"toast.musicOff": "音楽オフ",
			"default.signpost": "立て札",
			"default.villager": "村人",
			"default.waystone": "道標石",
			"default.chest": "宝箱には固く鍵がかかっている。",
			"default.waystoneText": "古い道標石が静かにうなっている。",
			"default.nothing": "特に変わったところはない。",
			"default.subtitle": "Luminati 2.5D のステージ",
			"default.prompt": "何かキーを押してください",
			"default.credit": "Luminati 2.5D ピクセルアートエンジン・three.js",
			"default.item": "もぎたてりんご",
			"load.map": "地図を広げています",
			"load.textures": "テクスチャを描いています",
			"load.land": "大地を形づくっています",
			"load.village": "村を建てています",
			"load.forest": "森に木を植えています",
			"load.water": "水を流しています",
			"load.meadow": "草原を育てています",
			"load.lights": "ランタンに火を灯しています",
			"load.merge": "メッシュを結合しています",
			"load.villagers": "村人を起こしています",
			"load.blades": "剣を研いでいます",
			"load.warmup": "ランタンを温めています",
			"load.ready": "準備完了",
			"page.title": "{name} — Luminati 2.5D ピクセルアートエンジン",
			"error.load": "{what}を読み込めませんでした：{why}",
			"error.campaign": "キャンペーン「{name}」",
			"error.level": "ステージ「{name}」",
			"error.default": "ステージ「{name}」",
			"error.json": "ステージのJSONが正しくありません（{why}）",
			"error.missing": "{file} が見つかりません",
			"error.unknown": "問題が発生しました。コンソールを確認してください。",
			"error.play": "{name}を遊ぶ",
			"error.editor": "レベルエディターを開く"
		},
		zh: {
			"controls.move": "移动",
			"controls.run": "奔跑",
			"controls.talk": "交谈／查看",
			"controls.choose": "选择回答",
			"controls.camera": "旋转镜头",
			"controls.zoom": "缩放（或滚轮）",
			"controls.map": "世界地图",
			"controls.time": "时段",
			"controls.weather": "天气",
			"controls.photo": "拍照模式",
			"controls.music": "音乐",
			"controls.debug": "调试面板",
			"controls.journal": "日志",
			"controls.party": "队伍",
			"prompt.talk": "交谈",
			"prompt.examine": "查看",
			"prompt.knock": "敲门",
			"prompt.read": "阅读",
			"prompt.look": "查看",
			"prompt.enter": "进入",
			"prompt.rest": "休息",
			"prompt.open": "打开",
			"toast.noParty": "没有同伴与你同行。",
			"toast.weather.clear": "晴空",
			"toast.weather.rain": "降雨",
			"toast.weather.snow": "降雪",
			"toast.outside.clear": "外面天色晴朗",
			"toast.outside.rain": "外面在下雨",
			"toast.outside.snow": "外面在下雪",
			"toast.foes": "附近有敌人时无法使用",
			"toast.photo": "拍照模式 · 按 {P} 或 {Esc} 返回",
			"toast.rested": "你睡了个好觉，精神焕发。",
			"toast.musicOn": "♪ 音乐开启",
			"toast.musicOff": "音乐关闭",
			"default.signpost": "指示牌",
			"default.villager": "村民",
			"default.waystone": "路标石",
			"default.chest": "宝箱锁得严严实实。",
			"default.waystoneText": "一块古老的路标石正低声嗡鸣。",
			"default.nothing": "没有什么特别的。",
			"default.subtitle": "Luminati 2.5D 关卡",
			"default.prompt": "按任意键开始",
			"default.credit": "Luminati 2.5D 像素艺术引擎 · three.js",
			"default.item": "脆甜苹果",
			"load.map": "正在展开地图",
			"load.textures": "正在绘制纹理",
			"load.land": "正在塑造大地",
			"load.village": "正在建造村庄",
			"load.forest": "正在种植森林",
			"load.water": "正在引来流水",
			"load.meadow": "正在培育草地",
			"load.lights": "正在点亮灯笼",
			"load.merge": "正在合并网格",
			"load.villagers": "正在唤醒村民",
			"load.blades": "正在磨砺刀刃",
			"load.warmup": "正在预热灯笼",
			"load.ready": "准备就绪",
			"page.title": "{name} — Luminati 2.5D 像素艺术引擎",
			"error.load": "无法载入{what}：{why}",
			"error.campaign": "冒险“{name}”",
			"error.level": "关卡“{name}”",
			"error.default": "关卡“{name}”",
			"error.json": "关卡不是有效的 JSON（{why}）",
			"error.missing": "找不到 {file}",
			"error.unknown": "出错了，请查看控制台。",
			"error.play": "游玩{name}",
			"error.editor": "打开关卡编辑器"
		}
	}
});
function Yl(e) {
	let t = [];
	for (let n of Object.values(Jl)) {
		let r = n[e];
		r && t.push(r);
	}
	return t;
}
function Xl({ force: e = !1 } = {}) {
	for (let [t, n] of Object.entries(Jl)) (e || !ln(t)) && rn(t, n);
}
var Zl = Object.freeze({
	arrow: {
		hot: [.5, .5],
		rows: [
			"o.........",
			"oo........",
			"oWo.......",
			"oWLo......",
			"oWLLo.....",
			"oWLLGo....",
			"oWLLGDo...",
			"oWLLLGDo..",
			"oWLLLGGDo.",
			"oWLLGooooo",
			"oWLoLGo...",
			"oLo.oLGo..",
			"oo..oLGo..",
			"o....oLDo.",
			".....oGDo.",
			"......oo.."
		]
	},
	pointer: {
		hot: [5, .5],
		rows: [
			"....oo.......",
			"...oIio......",
			"...oIio......",
			"...oIio......",
			"...oIiooo....",
			"...oIioIiooo.",
			".oooIioIioIio",
			"oIioIikIikIio",
			"oIiiIiiiiiiko",
			"oiiiiiiiiikko",
			".oiiiiiiiikko",
			"..okiiiiiikko",
			".oLLLLLLLLLo.",
			".oGGGGbGGGDo.",
			".oDDDDDDDDBo.",
			".ooooooooooo."
		]
	}
});
function Ql() {
	let e = B();
	return {
		o: e.ink0,
		W: e.g5,
		L: e.g4,
		G: e.g3,
		D: e.g2,
		B: e.g1,
		I: e.kf0,
		i: e.kf1,
		k: e.kf2,
		K: e.kf3,
		a: e.sa1,
		b: e.sa2,
		c: e.sa3
	};
}
function $l(e, { px: t, dpr: n }) {
	let r = Zl[e].rows, i = Math.max(r.length, ...r.map((e) => e.length));
	return Math.max(1, Math.min(Math.round(t), Math.floor(32 * n / i + 1e-6)));
}
function eu(e, t) {
	return hn([...Zl[e].rows], Ql(), t);
}
function tu(e, t, n) {
	let r = $l(e, t), i = eu(e, r).toDataURL("image/png"), a = +t.dpr.toFixed(4), [o, s] = Zl[e].hot;
	return `image-set(url("${i}") ${a}x) ${Math.floor(o * r / t.dpr + 1e-6)} ${Math.floor(s * r / t.dpr + 1e-6)}, ${n}`;
}
//#endregion
//#region src/engine/ui/HUD.js
var nu = [
	{
		id: "move",
		keys: "WASD",
		label: "Move"
	},
	{
		id: "run",
		keys: "Shift",
		label: "Run"
	},
	{
		id: "talk",
		keys: "Space",
		label: "Talk / Confirm"
	},
	{
		id: "choose",
		keys: "F/Enter",
		label: "Choose an answer"
	},
	{
		id: "rotate",
		keys: "Q/E",
		label: "Rotate camera"
	},
	{
		id: "zoom",
		keys: "Z/X",
		label: "Zoom (or wheel)"
	},
	{
		id: "map",
		keys: "N/Tab",
		label: "World map"
	},
	{
		id: "time",
		keys: "T",
		label: "Time of day"
	},
	{
		id: "weather",
		keys: "R",
		label: "Weather"
	},
	{
		id: "photo",
		keys: "P",
		label: "Photo mode"
	},
	{
		id: "music",
		keys: "M",
		label: "Music"
	},
	{
		id: "debug",
		keys: "`",
		label: "Debug panel"
	}
], ru = () => nu.map((e) => ({
	...e,
	label: lu(`hud.control.${e.id}`, e.label)
})), iu = {
	night: "Night",
	dawn: "Dawn",
	morning: "Morning",
	midday: "Midday",
	afternoon: "Afternoon",
	golden: "Golden Hour",
	dusk: "Dusk"
}, au = Object.keys(iu), ou = (e) => Object.hasOwn(iu, e) ? lu(`hud.phase.${e}`, iu[e]) : String(e);
function su(e) {
	return e < 4.75 || e >= 20.5 ? "night" : e < 7 ? "dawn" : e < 11 ? "morning" : e < 14 ? "midday" : e < 16.5 ? "afternoon" : e < 18.75 ? "golden" : "dusk";
}
var cu = Object.freeze({
	night: "#a9bff5",
	dawn: "#f2a7a4",
	morning: "#f5dc98",
	midday: "#fbe7a6",
	afternoon: "#f3cf7c",
	golden: "#f6b25a",
	dusk: "#d69ac0"
});
function lu(e, t) {
	let n = R(e);
	return n === e ? t : n;
}
function uu(e, t) {
	let n = R("hud.clock", {
		time: e,
		phase: t
	});
	return n === "hud.clock" ? `${e}, ${t}` : n;
}
var du = {
	Space: "Space",
	Shift: "Shift",
	Enter: "Enter",
	Escape: "Esc",
	Esc: "Esc",
	Backquote: "~",
	"`": "~",
	Tab: "Tab",
	Ctrl: "Ctrl",
	Alt: "Alt",
	Mouse0: "LMB",
	Mouse1: "MMB",
	Mouse2: "RMB"
}, fu = {
	ArrowLeft: [
		"kLeft",
		"left",
		"Left arrow"
	],
	"←": [
		"kLeft",
		"left",
		"Left arrow"
	],
	ArrowUp: [
		"kUp",
		"up",
		"Up arrow"
	],
	"↑": [
		"kUp",
		"up",
		"Up arrow"
	],
	ArrowRight: [
		"kRight",
		"right",
		"Right arrow"
	],
	"→": [
		"kRight",
		"right",
		"Right arrow"
	],
	ArrowDown: [
		"kDown",
		"down",
		"Down arrow"
	],
	"↓": [
		"kDown",
		"down",
		"Down arrow"
	]
}, pu = Object.freeze({ "~": [
	"......",
	"......",
	".oo..o",
	"o..oo."
] }), mu = /* @__PURE__ */ new Map();
function hu(e) {
	let t = mu.get(e);
	return t || (t = "", (Object.hasOwn(pu, e) ? pu[e] : Qt[e]).forEach((e, n) => {
		for (let r = 0; r < e.length;) {
			if (e[r] !== "o") {
				r++;
				continue;
			}
			let i = 1;
			for (; e[r + i] === "o";) i++;
			t += `M${r} ${n}h${i}v1h-${i}z`, r += i;
		}
	}), mu.set(e, t), t);
}
function gu(e) {
	if (Array.isArray(e)) return {
		parts: e.map(String),
		sep: null
	};
	let t = String(e ?? "");
	return t.length > 1 && t.includes("+") ? {
		parts: t.split("+"),
		sep: "+"
	} : t.length > 1 && t.includes("/") ? {
		parts: t.split("/"),
		sep: null
	} : {
		parts: [t],
		sep: null
	};
}
var _u = (e) => Object.hasOwn(du, e) ? du[e] : e;
function vu(e) {
	let { parts: t, sep: n } = gu(e), r = 0;
	return t.forEach((e, t) => {
		let i = e.trim();
		t > 0 && (r += 1 + (n ? L(n, "tiny") + 1 : 0)), r += Object.hasOwn(fu, i) ? 11 : Ft(_u(i));
	}), r;
}
function yu(e) {
	let t = document.createElement("span");
	t.className = "lu-keys";
	let { parts: n, sep: r } = gu(e);
	return n.forEach((e, n) => {
		if (n > 0 && r) {
			let e = document.createElement("span");
			e.className = "lu-key-sep", e.textContent = r, t.appendChild(e);
		}
		let i = document.createElement("kbd"), a = e.trim(), o = Object.hasOwn(fu, a) ? fu[a] : null;
		if (o) {
			i.className = "lu-key lu-key--sym lu-key--arrow", i.setAttribute("aria-label", lu(`hud.key.${o[1]}`, o[2])), i.innerHTML = `<svg viewBox="0 0 7 7" aria-hidden="true" shape-rendering="crispEdges"><path d="${hu(o[0])}"/></svg>`, t.appendChild(i);
			return;
		}
		let s = _u(a);
		if (Object.hasOwn(pu, s)) {
			i.className = "lu-key lu-key--sym lu-key--glyph", i.setAttribute("aria-label", s), i.innerHTML = `<svg viewBox="0 0 6 7" aria-hidden="true" shape-rendering="crispEdges"><path d="${hu(s)}"/></svg>`, t.appendChild(i);
			return;
		}
		i.className = s.length >= 4 ? "lu-key lu-key--wide" : /^[A-Za-z0-9]*$/.test(s) ? "lu-key" : "lu-key lu-key--sym", /^[0-9]+$/.test(s) && i.classList.add("lu-key--num");
		let c = document.createElement("span");
		c.className = "lu-key__t", c.textContent = s, i.appendChild(c), t.appendChild(i);
	}), t;
}
function bu(e, t, n, r, i, a) {
	e.classList.add("g", "grp"), e.dataset.anchor = t, It(e, [n, r]);
	let o = e.style;
	o.width = N(i), o.height = N(a), o.left = o.right = o.top = o.bottom = "";
	let s, c;
	t[1] === "l" ? (o.left = N(n), s = N(-n)) : (o.right = N(640 - n - i), s = `calc(100% + ${N(640 - n - i)})`), t[0] === "t" ? (o.top = N(r), c = N(-r)) : (o.bottom = N(360 - r - a), c = `calc(100% + ${N(360 - r - a)})`), o.transformOrigin = `${s} ${c}`;
}
function xu(e, t) {
	let n = document.createElement("div");
	return n.className = t, It(n, bt(e)), e.appendChild(n), n;
}
function Su(e, t, n, r) {
	let i = Pt(e, t, tt(r.band), (r, i) => i * t < 1 || i * t > t - 1 ? 0 : .82 * Math.max(0, Math.min(1, Math.min(r, 1 - r) * e / n)), [...xt]), a = i.getContext("2d");
	for (let i = 0; i < e; i++) {
		let o = Math.min(i, e - 1 - i);
		o < n / 2 && i % 4 || o < n && i % 2 || (a.fillStyle = r.top, a.fillRect(i, 0, 1, 1), a.fillStyle = r.bot, a.fillRect(i, t - 1, 1, 1));
	}
	return i;
}
var Cu = {
	"": {
		band: "band",
		top: "g3",
		bot: "g2",
		gem: z.gold,
		color: "tx1",
		icon: null,
		maxW: 400
	},
	quest: {
		band: "xp0",
		top: "g4",
		bot: "g3",
		gem: z.gold,
		color: "g5",
		icon: "scroll",
		maxW: 400
	},
	item: {
		band: "band",
		top: "g3",
		bot: "g2",
		gem: z.gold,
		color: "tx1",
		icon: "chest",
		maxW: 400
	},
	error: {
		band: "tr1",
		top: "rb2",
		bot: "rb1",
		gem: z.ruby,
		color: "rb3",
		icon: "flag",
		maxW: 460
	}
}, wu = 10, Tu = 2, Eu = 8, Du = 140, Ou = 3, ku = (e) => 16 + (e.icon ? 14 : 5) + 5 + 5 + 5 + 16, Au = /^(?:[A-Z0-9]|F(?:[1-9]|1[0-2])|Space|Shift|Enter|Esc|Escape|Tab|Ctrl|Alt|Backspace|Mouse[0-2]|LMB|MMB|RMB|[←↑→↓])$/, ju = 3;
function Mu(e) {
	let t = [], n = 0;
	for (let r of e.matchAll(/\{([^{}]*)\}/g)) {
		if (!Au.test(r[1])) continue;
		let i = e.slice(n, r.index).trim();
		i && t.push({ text: i }), t.push({ key: _u(r[1]) }), n = (r.index ?? 0) + r[0].length;
	}
	if (!t.length) return null;
	let r = e.slice(n).trim();
	return r && t.push({ text: r }), t;
}
var Nu = (e) => e.reduce((e, t, n) => e + (n ? ju : 0) + (t.key == null ? L(t.text, "line") : Ft(t.key)), 0), Pu = 13, Fu = 7, Iu = [
	"0",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9"
], Lu = class {
	constructor(e = document.body) {
		let t = document.createElement("div");
		t.className = "lu-hud", e.appendChild(t), this.element = t;
		let n = document.createElement("div");
		n.className = "lu-toasts", n.setAttribute("aria-live", "polite"), e.appendChild(n), this.toastElement = n, this._loc = document.createElement("div"), this._loc.className = "lu-loc is-empty", this._clock = document.createElement("div"), this._clock.className = "lu-clock", this._clock.dataset.phase = "golden", this._clock.setAttribute("role", "img"), this._help = document.createElement("div"), this._help.className = "lu-help is-empty", this._helpTab = document.createElement("div"), this._helpTab.className = "lu-help-tab is-empty is-hidden", t.append(this._loc, this._clock, this._help, this._helpTab), this._toasts = n, this.helpKey = "H", this.maxToasts = 3, this._visible = !0, this._helpVisible = !0, this._hours = -1, this._minute = -1, this._phase = "", this._timeText = "00:00", this._locationName = "", this._locationSub = "", this._rows = [], this._timers = /* @__PURE__ */ new Set(), this._toastSpecs = /* @__PURE__ */ new Map(), this._locBox = null, this._clockBox = null, this._banner = null, this._onBanner = (e) => {
			let t = e.detail;
			this._banner = t && Number.isFinite(t.y) && Number.isFinite(t.h) ? {
				x: +t.x || 0,
				y: +t.y,
				w: +t.w || 0,
				h: +t.h,
				fit: +t.fit || 1
			} : null, this._layoutToasts();
		}, e.addEventListener("lu-banner", this._onBanner), this._parent = e, this._ck = null, this._timeEl = null, this._phaseEl = null, this._iconEl = null, this._barEl = null, this._barMx = -1, this._disposed = !1, this._unscale = lt(e, () => this.relayout()), We()?.ready.then(() => {
			this._disposed || this.relayout();
		}), this._renderLoc(), this._renderClock(), this.setTime(17.2), this.setControls(ru());
	}
	get visible() {
		return this._visible;
	}
	set visible(e) {
		this._visible = !!e, this.element.classList.toggle("is-hidden", !this._visible), this._toasts.classList.toggle("is-hidden", !this._visible);
	}
	get clockElement() {
		return this._clock;
	}
	get locationElement() {
		return this._loc;
	}
	get helpElement() {
		return this._help;
	}
	get helpTabElement() {
		return this._helpTab;
	}
	get hours() {
		return this._hours;
	}
	get phase() {
		return this._phase;
	}
	get helpVisible() {
		return this._helpVisible;
	}
	relayout() {
		if (!this._disposed) {
			for (let e of this._toastSpecs.values()) e.size = e.drawn = null;
			this._renderLoc(), this._renderClock(), this._renderHelp(), this._layoutToasts();
		}
	}
	setTime(e) {
		if (!Number.isFinite(e)) return;
		let t = (e % 24 + 24) % 24;
		this._hours = t;
		let n = Math.floor(t * 60) % 1440;
		if (n === this._minute) return;
		this._minute = n;
		let r = Math.floor(n / 60), i = n % 60;
		this._timeText = `${Iu[r / 10 | 0]}${Iu[r % 10]}:${Iu[i / 10 | 0]}${Iu[i % 10]}`;
		let a = this._timeEl?.firstChild;
		a && (a.nodeValue = this._timeText), this._applyBar();
		let o = su(t);
		if (o !== this._phase) {
			let e = yt[this._phase];
			this._phase = o, this._clock.dataset.phase = o, this._applyPhase(yt[o] !== e);
		} else this._clock.setAttribute("aria-label", uu(this._timeText, ou(o)));
	}
	setLocation(e, t = "") {
		let n = String(e ?? ""), r = String(t ?? "");
		if (n === this._locationName && r === this._locationSub) return;
		let i = !!this._locationName;
		this._locationName = n, this._locationSub = r, this._renderLoc(), this._loc.classList.toggle("is-empty", !n), n && i && (this._loc.classList.add("is-swap"), this._loc.offsetWidth, this._loc.classList.remove("is-swap")), this._ensure([et(n), r], () => n === this._locationName && r === this._locationSub, () => this._renderLoc());
	}
	showHelp(e, { tab: t = !0 } = {}) {
		this._helpVisible = !!e, this._help.classList.toggle("is-hidden", !this._helpVisible), this._helpTab.classList.toggle("is-hidden", this._helpVisible || !t);
	}
	toggleHelp() {
		return this.showHelp(!this._helpVisible), this._helpVisible;
	}
	setControls(e = []) {
		this._rows = Array.isArray(e) ? e.slice() : [], this._renderHelp();
		let t = this._rows.map((e) => e.label ?? "");
		this._ensure([
			...t,
			R("hud.controls"),
			R("hud.hide"),
			R("hud.show")
		], () => this._rows.every((e, n) => (e.label ?? "") === t[n]), () => this._renderHelp());
	}
	toast(e, t = 2.5, { kind: n } = {}) {
		let r = n === "quest" || n === "item" || n === "error" ? n : "", i = document.createElement("div");
		i.className = r ? `lu-toast lu-toast--${r}` : "lu-toast";
		let a = {
			text: String(e ?? ""),
			kind: r
		};
		for (i.style.transition = "none", this._toasts.appendChild(i), this._toastSpecs.set(i, a); this._toasts.children.length > this.maxToasts;) {
			let e = this._toasts.firstElementChild;
			this._toastSpecs.delete(e), e.remove();
		}
		this._layoutToasts(), i.offsetWidth, i.style.transition = "", i.classList.add("is-on");
		let o = setTimeout(() => {
			this._timers.delete(o), i.classList.add("is-off");
			let e = setTimeout(() => {
				this._timers.delete(e), this._toastSpecs.delete(i), i.remove(), this._layoutToasts();
			}, 520);
			this._timers.add(e);
		}, Math.max(.5, t) * 1e3);
		return this._timers.add(o), this._ensure([a.text], () => i.isConnected, () => {
			a.size = a.drawn = null, this._layoutToasts();
		}), i;
	}
	update() {}
	dispose() {
		this._disposed = !0, this._unscale(), this._parent.removeEventListener("lu-banner", this._onBanner);
		for (let e of this._timers) clearTimeout(e);
		this._timers.clear(), this._toastSpecs.clear(), this._toasts.remove(), this.element.remove();
	}
	_ensure(e, t, n) {
		let r = We();
		r && an() && r.ensure(e.join("\n")).then(() => {
			!this._disposed && t() && n();
		}, () => {});
	}
	_renderLoc() {
		let e = B(), t = this._loc;
		t.replaceChildren();
		let n = ht(et(this._locationName), "name", 236, 1), r = ht(this._locationSub, "line", 236), i = L(n, "name", 1), a = L(r, "line"), o = Math.max(123, Math.ceil((23 + Math.max(i, a)) / .72)), s = ot("name"), c = ot("line"), l = 2.5, u = Math.round(3.5 + s + l + c + 3.5);
		bu(t, "tl", 10, 10, o, u), this._locBox = [
			10,
			10,
			o,
			u
		], F(t, ct(o, u), 10, 10, 1, "lu-loc__band").setAttribute("aria-hidden", "true"), F(t, nt(Math.round(o * .88)), 10, 10).setAttribute("aria-hidden", "true"), F(t, nt(Math.round(o * .88)), 10, 10 + u - 1).setAttribute("aria-hidden", "true"), F(t, nn(11), 14, 10 + Math.floor((u - 13) / 2), 1, "lu-loc__icon").setAttribute("aria-hidden", "true"), I(t, n, 33, r ? 13.5 + s / 2 : 10 + u / 2, {
			...Xe,
			color: e.tx1,
			drop: !0,
			cls: "lu-loc__name"
		}), I(t, r, 33, 13.5 + s + l + c / 2, {
			font: "line",
			color: e.g4,
			drop: !0,
			cls: "lu-loc__sub"
		}), this._layoutToasts();
	}
	_renderClock() {
		let e = this._clock;
		e.replaceChildren();
		let t = B(), n = L("00:00", "big", 1), r = Math.max(...au.map((e) => L(ou(e), "line"))), i = Math.max(n, r, 40), a = Math.ceil(gt("line")), o = 28 + i + 7, s = 630 - o, c = 31 + a;
		bu(e, "tr", s, 10, o, c), this._clockBox = [
			s,
			10,
			o,
			c
		], _t(e, {
			size: "XS",
			corners: z.gold(),
			cornerR: 2
		}, s, 10, o, c), F(e, rt(22), s + 3, 14 + a / 2, 1, "lu-clock__halo");
		let l = s + 28;
		this._ck = {
			x0: s,
			y: 10,
			gl: a,
			textW: i,
			tx: l
		}, this._timeEl = P(e, this._timeText, l, 11.5, {
			font: "big",
			track: 1,
			color: t.g5,
			drop: !0,
			cls: "lu-clock__time"
		}), this._phaseEl = P(e, "", l, 21.5 + a / 2, {
			font: "line",
			drop: !0,
			cls: "lu-clock__phase"
		}), this._iconEl = null, this._barEl = null, this._barMx = -1;
		for (let t of e.querySelectorAll("canvas")) t.setAttribute("aria-hidden", "true");
		this._phase && this._applyPhase(!0), this._minute >= 0 && this._applyBar();
		let u = We();
		if (u && an()) {
			let e = au.map(ou);
			u.ensure(e.join("\n")).then(() => {
				this._disposed || Math.max(...e.map((e) => L(e, "line"))) !== r && this._renderClock();
			}, () => {});
		}
	}
	_applyPhase(e) {
		let t = this._ck, n = this._phase;
		if (!t || !n) return;
		let r = ou(n);
		if (this._phaseEl && (this._phaseEl.textContent = r, this._phaseEl.style.color = cu[n] ?? B().phase), this._clock.setAttribute("aria-label", uu(this._timeText, r)), e || !this._iconEl) {
			this._iconEl?.remove();
			let e = Rt(yt[n] ?? "sun");
			e.setAttribute("aria-hidden", "true"), this._iconEl = F(this._clock, e, t.x0 + 6, t.y + 7 + t.gl / 2, 1, "lu-clock__icon");
		}
	}
	_applyBar() {
		let e = this._ck;
		if (!e || this._minute < 0) return;
		let t = e.textW - 2, n = this._minute / 1440, r = Math.round(n * (t - 1));
		if (r === this._barMx && this._barEl) return;
		this._barMx = r, this._barEl?.remove();
		let i = Je(t, n);
		i.setAttribute("aria-hidden", "true"), this._barEl = F(this._clock, i, e.tx - 2, e.y + 20 + e.gl, 1, "lu-clock__track");
	}
	_renderHelp() {
		this._renderHelpTab();
		let e = this._help;
		e.replaceChildren();
		let t = this._rows;
		if (e.classList.toggle("is-empty", t.length === 0), !t.length) return;
		let n = B(), r = et(lu("hud.controls", "Controls")), i = L(r, "small", 1), a = t.map((e) => ({
			r: e,
			kw: vu(e.keys),
			lw: L(e.label ?? "", "line")
		})), o = this.helpKey ? {
			kw: vu(this.helpKey),
			label: lu("hud.hide", "Hide controls")
		} : null, s = o ? o.kw + 4 + L(o.label, "line") : 0, c = 2 * Math.ceil(gt("small") / 2), l = 15 + c, u = (e) => l + (e - 1) * Pu + 11 + (o ? 23 : 6), d = tn(this.element), f = d ? d.artH / (d.cornerShrink || 1) : 360, p = 160 + 2 * Math.max(0, (this._locBox?.[3] ?? 22) - 22), m = t.length > 3 && u(t.length) > f - p ? [a.slice(0, Math.ceil(a.length / 2)), a.slice(Math.ceil(a.length / 2))] : [a], h = m.map((e) => {
			let t = Math.max(...e.map((e) => e.kw)), n = Math.max(...e.map((e) => e.lw));
			return {
				kw: t,
				lw: n,
				w: t + 5 + n
			};
		}), g = h.reduce((e, t) => e + t.w, 0) + (m.length - 1) * 14, _ = Fu + Math.max(g, i + 24, s) + Fu + 1, v = u(m[0].length), y = 350 - v;
		bu(e, "bl", 10, y, _, v), _t(e, {
			size: "XS",
			corners: z.gold(),
			cornerR: 2
		}, 10, y, _, v);
		let b = y + 8 + c / 2;
		I(e, r, 17, b, {
			font: "small",
			track: 1,
			color: n.g4,
			drop: !0,
			cls: "lu-help__title"
		}), F(e, nt(_ - 14 - i - 5, "r"), 17 + i + 5, Math.round(b)).setAttribute("aria-hidden", "true");
		let x = xu(e, "lu-help__grid"), S = 17;
		if (m.forEach((e, t) => {
			let { kw: r } = h[t];
			e.forEach((e, t) => {
				let i = y + l + t * Pu, a = yu(e.r.keys);
				a.classList.add("lu-help__keys"), Bt(a, S - 10, i - y, r, 11), x.appendChild(a);
				let o = I(x, e.r.label ?? "", S + r + 5, i + 5.5, {
					font: "line",
					color: n.tx1,
					drop: !0,
					cls: "lu-help__label"
				});
				e.r.id && (o.dataset.id = String(e.r.id), a.dataset.id = String(e.r.id));
			}), S += h[t].w + 14;
		}), o) {
			let t = y + l + (m[0].length - 1) * Pu + 11 + 3;
			F(e, nt(_ - 14, "r", n.dm1), 17, t).setAttribute("aria-hidden", "true"), this._keyRow(xu(e, "lu-help__foot"), 10, y, t + 4, o.kw, o.label, "lu-help__foot-keys", "lu-help__hint");
		}
	}
	_renderHelpTab() {
		let e = this._helpTab;
		e.replaceChildren();
		let t = this._rows.length > 0 && !!this.helpKey;
		if (e.classList.toggle("is-empty", !t), !t) return;
		let n = vu(this.helpKey), r = lu("hud.show", "Show controls"), i = Fu + n + 4 + L(r, "line") + Fu + 1;
		bu(e, "bl", 10, 329, i, 21), _t(e, {
			size: "XS",
			corners: z.gold(),
			cornerR: 2
		}, 10, 329, i, 21), this._keyRow(e, 10, 329, 334, n, r, "lu-help-tab__keys", "lu-help-tab__label");
	}
	_keyRow(e, t, n, r, i, a, o, s) {
		let c = yu(this.helpKey);
		c.classList.add(o), Bt(c, Fu, r - n, i, 11), e.appendChild(c), I(e, a, t + Fu + i + 4, r + 5.5, {
			font: "line",
			color: B().tx2,
			drop: !0,
			cls: s
		});
	}
	_toastSize(e, t) {
		let n = Cu[e.kind] ?? Cu[""], r = Math.max(48, Math.min(n.maxW, Math.floor(t))), i = e.size;
		if (i && i.lim === r) return i;
		let a = e.kind === "error" ? null : Mu(e.text), o = a ? Nu(a) : 0, s = null, c, l = 1;
		a && o <= r ? (s = a, c = o) : (c = L(e.text, "line"), c > r && (l = Tt(null, e.text, "line", r), c = r));
		let u = 2 * Math.ceil(gt("line") / 2), d = Math.round((n.icon ? 20 : 16) + u + (l - 1) * dt.line.L), f = ku(n) + c;
		return f += f % 2, e.size = {
			lim: r,
			tw: c,
			lines: l,
			w: f,
			h: d,
			parts: s
		}, e.size;
	}
	_panels(e, t) {
		let n = e?.artW ?? 640, r = [], i = this._toasts.parentElement, a = e && i ? i.getBoundingClientRect() : null;
		for (let i of [...this.element.children]) {
			let o = i.dataset?.anchor;
			if (!o || !/^[tb][lr]$/.test(o)) continue;
			let s = i.classList;
			if (s.contains("is-empty") || s.contains("is-hidden")) continue;
			let c = o[1] === "l" ? "l" : "r", l = i === this._loc ? this._locBox : i === this._clock ? this._clockBox : null;
			if (l) {
				let [e, a, o, s] = l, u = c === "l" ? e * t : n - (640 - e) * t;
				r.push({
					l: u,
					t: a * t,
					r: u + o * t,
					b: (a + s) * t,
					side: c,
					plate: i === this._loc
				});
				continue;
			}
			if (!a || !e) continue;
			let u = i.getBoundingClientRect();
			if (!(u.width > 0 && u.height > 0)) continue;
			let d = e.cssPx;
			r.push({
				l: (u.left - a.left) / d,
				t: (u.top - a.top) / d,
				r: (u.right - a.left) / d,
				b: (u.bottom - a.top) / d,
				side: c
			});
		}
		return r;
	}
	_layoutToasts() {
		if (this._disposed || !this._toastSpecs.size) return;
		let e = [...this._toasts.children].filter((e) => this._toastSpecs.has(e));
		if (!e.length) return;
		let t = e.map((e) => this._toastSpecs.get(e)), n = tn(this.element), r = n?.cornerShrink || 1, i = n?.artW ?? 640, a = this._panels(n, r), o = this._banner, s = o ? {
			t: o.fit * o.y - Ou * r,
			b: o.fit * (o.y + o.h) + Ou * r
		} : null, c = (e, t) => {
			let n = 0, r = i, o = !1, s = !1;
			for (let i of a) i.t >= t || i.b <= e || (i.side === "l" ? (n = Math.max(n, i.r), o = !0) : (r = Math.min(r, i.l), s = !0));
			return o && !s ? r = Math.max(n + 1, i - n) : s && !o && (n = Math.min(r - 1, i - r)), [n, r];
		}, l = (e) => {
			let n = e + 16 * r, a = {
				L: 0,
				R: i,
				room: 0,
				sizes: [],
				ys: [],
				bot: n
			};
			for (let i = 0; i < 4; i++) {
				let [i, o] = c(e, n), l = (o - i) / r - 16, u = t.map((e) => this._toastSize(e, l - ku(Cu[e.kind] ?? Cu[""]))), d = [], f = e;
				for (let e of u) s && f < s.b && f + e.h * r > s.t && (f = s.b), d.push(f), f += (e.h + Tu) * r;
				let p = f - Tu * r;
				if (a = {
					L: i,
					R: o,
					room: l,
					sizes: u,
					ys: d,
					bot: p
				}, p <= n + 1e-6) break;
				n = p;
			}
			return a;
		}, u = l(wu * r), d = a.find((e) => e.plate);
		if (d && u.room - ku(Cu.quest) < Du && d.r >= u.L - 1e-6) {
			let e = l(d.b + 4 * r);
			e.room > u.room && (u = e);
		}
		let f = Math.max(...u.sizes.map((e) => e.w)) * r / 2 + Eu * r, p = u.L + f, m = u.R - f, h = p > m ? (u.L + u.R) / 2 : Math.min(Math.max(i / 2, p), m);
		e.forEach((e, n) => {
			let i = t[n], a = u.sizes[n];
			i.drawn !== a && this._renderToast(e, i, a);
			let o = Math.round(h / r - a.w / 2), s = Math.round(u.ys[n] / r);
			i.x !== o && (e.style.left = N(o), i.x = o), i.y !== s && (e.style.top = N(s), i.y = s);
		});
	}
	_renderToast(e, t, n) {
		let r = B(), i = Cu[t.kind] ?? Cu[""];
		e.replaceChildren(), t.drawn = n;
		let { w: a, h: o, tw: s, lines: c } = n, l = i.icon ? 14 : 5;
		e.style.width = N(a), e.style.height = N(o);
		let u = {
			band: r[i.band],
			top: r[i.top],
			bot: r[i.bot]
		};
		F(e, Su(a, o, 16, u), 0, 0, 1, "lu-toast__plate").setAttribute("aria-hidden", "true");
		let d = i.gem();
		i.icon ? F(e, Rt(i.icon), 14, Math.round((o - 16) / 2), 1, "lu-toast__glyph").setAttribute("aria-hidden", "true") : F(e, Ue(1, d), 16, Math.round(o / 2 - 2.5), 1, "lu-toast__gem").setAttribute("aria-hidden", "true"), F(e, Ue(1, d), a - 16 - 5, Math.round(o / 2 - 2.5), 1, "lu-toast__gem").setAttribute("aria-hidden", "true");
		let f = 16 + l + 5, p = {
			font: "line",
			color: r[i.color],
			drop: !0,
			cls: "lu-toast__text"
		};
		if (n.parts) {
			let t = Math.round(o / 2 - 5.5);
			n.parts.forEach((n, r) => {
				r && (f += ju), n.key == null ? (I(e, n.text, f, o / 2, p), f += L(n.text, "line")) : f += wt(e, n.key, f, t, { cls: "lu-toast__key" });
			});
		} else if (c > 1) {
			let n = dt.line.L;
			P(e, t.text, f, o / 2 - (c - 1) * n / 2 - Vt("line"), {
				...p,
				maxW: s
			});
		} else I(e, t.text, f, o / 2, p);
	}
}, Ru = {
	",": .12,
	";": .16,
	":": .16,
	"—": .14,
	".": .22,
	"!": .22,
	"?": .22,
	"…": .42
}, zu = {
	"、": .12,
	"，": .12,
	"；": .16,
	"：": .16,
	"。": .22,
	"．": .22,
	"！": .22,
	"？": .22,
	"‥": .3,
	"―": .14
}, Bu = "\"'”’)]»」』）】〕〉》〙〗", Vu = /[⺀-⿿　-ヿ㄀-ㇿ㐀-䶿一-鿿豈-﫿︰-﹏＀-￯]/, Hu = "、。，．：；！？」』）】〕〉》”’", Uu = "、。，．：；！？」』）】〕〉》”’「『（【〔〈《“‘", Wu = 10, Gu = 496, Ku = 344, qu = 62, Ju = 6, Yu = 12, Xu = 240, Zu = 8, Qu = 5, $u = 3, ed = .3, td = "F", nd = 6, rd = 4, id = 24, ad = Object.freeze({
	size: "L",
	lattice: !0,
	beads: 6,
	trio: !0,
	sides: !0
}), od = () => {
	let e = B();
	return {
		size: "S",
		notch: 3,
		corners: null,
		ends: !0,
		endR: 2,
		bands: [e.plate0, e.plate1],
		stops: [0, .5],
		sheen: !1
	};
}, sd = () => ({
	size: "XS",
	corners: z.gold(),
	cornerR: 2
}), cd = (e) => `round(nearest, calc(var(--px) * ${e}), var(--lu-dpx, 1px))`;
function ld(e, t, n, r, i) {
	let a = dt[t], [o, s] = bt(i), c = Vt(t) - a.mid * (a.u === "fpx" ? .5 : 1);
	a.u === "fpx" && (c += a.mid * (.5 - pt)), e.style.left = cd(Math.round((n - o) * 2) / 2), e.style.top = cd(c ? r + c - s : Math.round((r - s) * 2) / 2);
}
var ud = (e) => {
	let t = ot(e), n = dt[e];
	return n.u === "fpx" ? t + n.ink * (pt - .5) : t;
}, dd = (e) => gt(e) + ud(e) - ot(e);
function fd(e) {
	let t = document.createElement("div");
	return t.className = e, t;
}
var pd = class {
	constructor(e = document.body) {
		ln("dialog") || rn("dialog", ql), this.speed = 45, this.cjkPace = .7, this.inputGuard = .15, this.choiceQuiet = .4, this.choiceReact = .2, this.onChar = null, this.onSound = null;
		let t = document.createElement("div");
		t.className = "lu-dialog lu-stage", t.setAttribute("role", "dialog"), t.setAttribute("aria-label", R("dialog.window")), e.appendChild(t), this.element = t, this._win = qt(t, "bl", 0, 0, 640, 350, "lu-dialog__win");
		let n = fd("g lu-dialog__panel");
		this._art = fd("lu-dialog__art");
		let r = fd("lu-dialog__text");
		r.setAttribute("aria-live", "polite");
		let i = fd("lu-dialog__ask-text");
		i.setAttribute("aria-live", "polite");
		let a = fd("g lu-dialog__next");
		a.setAttribute("role", "img"), a.setAttribute("aria-label", R("dialog.next"));
		let o = Nt("advance");
		o.classList.add("lu-arrow");
		let s = Ue(2, z.gold());
		s.classList.add("lu-end"), F(a, o, 0, 0), F(a, s, 1, 0);
		let c = fd("g lu-dialog__name is-empty");
		this._nameArt = fd("lu-dialog__art");
		let l = fd("lu-dialog__speaker"), u = fd("lu-dialog__title");
		c.append(this._nameArt, l, u), n.append(this._art, r, i, a, c);
		let d = document.createElement("ul");
		d.className = "g lu-dialog__choices", d.setAttribute("aria-label", R("dialog.choices")), this._choiceArt = fd("lu-dialog__art");
		let f = yu(td);
		f.classList.add("lu-choice__key"), f.setAttribute("aria-hidden", "true"), d.append(this._choiceArt, f), this._win.append(n, d), this._panel = n, this._nameEl = c, this._speakerEl = l, this._titleEl = u, this._textEl = r, this._askEl = i, this._nextEl = a, this._choicesEl = d, this._keyEl = f, this._lines = [], this._index = 0, this._defaultSpeaker = "", this._defaultSheet = null, this._defaultTitle = "", this._currentSpeaker = null, this._glyphs = [], this._nSpeech = 0, this._carry = !1, this._revealed = 0, this._timer = 0, this._typing = !1, this._open = !1, this._closing = !1, this._held = !1, this._hold = !1, this._guard = 0, this._choiceEls = [], this._choiceLabels = [], this._choicesLine = -1, this._choiceIndex = 0, this._choicesActive = !1, this._choiceArmed = !1, this._quiet = 0, this._react = 0, this._nudgeA = !1, this._keyRows = [], this._choiceDelay = -1, this._lastChoice = void 0, this._clickQueued = !1, this._resolve = null, this._closeTimer = 0, this._portraitColor = "", this._lineColored = !1, this._ensureSeq = 0, this._geo = null, this._onPanelClick = (e) => {
			e.preventDefault(), this._open && !this._closing && (this._clickQueued = !0);
		}, this._panel.addEventListener("click", this._onPanelClick), this._offScale = lt(e, () => {
			this._open && this._layout();
		});
	}
	get isOpen() {
		return this._open;
	}
	get isTyping() {
		return this._typing;
	}
	get isChoosing() {
		return this._choicesActive;
	}
	get isChoiceReady() {
		return this._choicesActive && this._choiceArmed && this._react <= 0;
	}
	open({ speaker: e = "", lines: t = [], portraitColor: n, hold: r = !1, sheet: i = null, title: a = "" } = {}) {
		(this._resolve || this._closing) && this._finishClose(!0);
		let o = this._held, s = o ? this.heldLine : null;
		this._held = !1;
		let c = typeof t == "string" ? [t] : Array.isArray(t) ? t : [];
		if (this._lines = c.map((e) => typeof e == "string" ? { text: e } : {
			...e,
			text: String(e?.text ?? "")
		}), !this._lines.length) return o && this._finishClose(!0), Promise.resolve(void 0);
		this._hold = r;
		let l = this._lines[0], u = l.speaker === void 0 ? e ?? "" : l.speaker;
		return this._carry = !!s && l.text === s.text && (u || "") === (s.speaker || "") && (md(l.ask) || Array.isArray(l.choices) && l.choices.length > 0), this._defaultSpeaker = e ?? "", this._defaultSheet = hd(i) ? i : null, this._defaultTitle = typeof a == "string" ? a : "", this._currentSpeaker = null, this._index = 0, this._lastChoice = void 0, this._closing = !1, this._open = !0, this._guard = this.inputGuard, this._clickQueued = !1, this._portraitColor = n || "", this._lineColored = !1, this._setPortrait(this._portraitColor), this.element.classList.remove("is-closing"), this.element.classList.add("is-open"), this._setLine(0), o || this._sound("open"), new Promise((e) => {
			this._resolve = e;
		});
	}
	get isHeld() {
		return this._held;
	}
	get heldLine() {
		let e = this._held ? this._lines[this._index] : null;
		if (!e) return null;
		let t = {
			...e,
			speaker: e.speaker === void 0 ? this._defaultSpeaker : e.speaker
		};
		t.portraitColor === void 0 && this._portraitColor && (t.portraitColor = this._portraitColor);
		let n = this._isDefaultSpeaker(e);
		return t.sheet === void 0 && n && this._defaultSheet && (t.sheet = this._defaultSheet), t.title === void 0 && n && this._defaultTitle && (t.title = this._defaultTitle), t;
	}
	_setPortrait(e) {
		e ? this.element.style.setProperty("--lu-portrait", e) : this.element.style.removeProperty("--lu-portrait");
	}
	update(e, t) {
		if (!(!this._open || this._closing || this._held) && (this._handleInput(e, t), this._open && !this._closing)) {
			if (this._typing) {
				if (this.speed <= 0) this._completeLine();
				else {
					this._timer -= e;
					let t = this._glyphs.length;
					for (; this._typing && this._timer <= 0 && t-- > 0;) this._revealNext();
				}
			}
			this._choiceDelay >= 0 && (this._choiceDelay -= e, this._choiceDelay < 0 && this._activateChoices());
		}
	}
	close() {
		this._open && !this._closing && (this._held = !1, this._closing = !0, this._typing = !1, this._choiceDelay = -1, this._setChoicesVisible(!1), this._nextEl.classList.remove("is-on"), this.element.classList.remove("is-open"), this.element.classList.add("is-closing"), this._sound("close"), clearTimeout(this._closeTimer), this._closeTimer = setTimeout(() => this._finishClose(!1), 320));
	}
	skip() {
		this._typing && this._completeLine();
	}
	dispose() {
		if (clearTimeout(this._closeTimer), this._offScale(), this._panel.removeEventListener("click", this._onPanelClick), this._resolve) {
			let e = this._resolve;
			this._resolve = null, e(void 0);
		}
		this.element.remove();
	}
	_sound(e) {
		this.onSound && this.onSound(e);
	}
	_pressed(e, t) {
		return e ? typeof e.consumeAction == "function" ? e.consumeAction(t) : e.actionPressed(t) : !1;
	}
	_handleInput(e, t) {
		if (this._guard > 0) {
			this._guard -= e, this._clickQueued = !1;
			return;
		}
		let n = this._clickQueued;
		if (this._clickQueued = !1, this._choicesActive) {
			let r = this._pressed(t, "choose"), i = this._pressed(t, "confirm") || n, a = !1;
			if (this._pressed(t, "up") && (this._moveChoice(-1), a = !0), this._pressed(t, "down") && (this._moveChoice(1), a = !0), a && this._arm(0), !this._choiceArmed) {
				r || i ? this._quiet = this.choiceQuiet : (this._quiet -= e) <= 0 && this._arm(this.choiceReact);
				return;
			}
			if (this._react > 0) {
				r || i ? this._lock() : this._react -= e;
				return;
			}
			r ? this._selectChoice(this._choiceIndex) : i && this._nudgeKey();
			return;
		}
		let r = this._pressed(t, "confirm") || n;
		if (this._typing) {
			(r || this._pressed(t, "cancel")) && this._completeLine();
			return;
		}
		r && this._choiceDelay < 0 && (this._sound("confirm"), this._advance());
	}
	_finishClose(e) {
		clearTimeout(this._closeTimer), this._held = !1, this._open = !1, this._closing = !1, this._typing = !1, this._choicesActive = !1, this._choiceArmed = !1, this._choiceDelay = -1, this.element.classList.remove("is-closing", "is-open"), e && this._setChoicesVisible(!1), this._textEl.textContent = "", this._askEl.textContent = "", this._glyphs.length = 0, this._nSpeech = 0;
		let t = this._resolve;
		this._resolve = null, t && t(this._lastChoice);
	}
	_isDefaultSpeaker(e) {
		return e.speaker === void 0 || !!e.speaker && e.speaker === this._defaultSpeaker;
	}
	_view(e) {
		let t = this._isDefaultSpeaker(e), n = e.sheet === void 0 ? t ? this._defaultSheet : null : e.sheet, r = e.title === void 0 ? t ? this._defaultTitle : "" : e.title, i = Array.isArray(e.choices) && e.choices.length ? e.choices.map(String) : null, a = md(e.ask) ? String(e.ask) : "";
		return {
			speaker: this._currentSpeaker || "",
			title: typeof r == "string" ? r : "",
			sheet: hd(n) ? n : null,
			color: (e.portraitColor ?? this._portraitColor) || "",
			choices: i,
			ask: a,
			question: !a && !!i && this._speechShown()
		};
	}
	_speechShown() {
		for (let e = 0; e < this._nSpeech; e++) if (this._glyphs[e].el) return !0;
		return !1;
	}
	_askShown() {
		for (let e = this._nSpeech; e < this._glyphs.length; e++) if (this._glyphs[e].el) return !0;
		return !1;
	}
	_setLine(e) {
		this._index = e;
		let t = this._lines[e], n = t.speaker === void 0 ? this._defaultSpeaker : t.speaker ?? "";
		if (this._setSpeaker(n), (t.portraitColor !== void 0 || this._lineColored) && (this._lineColored = t.portraitColor !== void 0, this._setPortrait(t.portraitColor ?? this._portraitColor)), this._buildText(t.text, md(t.ask) ? String(t.ask) : ""), this._revealed = 0, e === 0 && this._carry) {
			for (let e = 0; e < this._nSpeech; e++) this._glyphs[e].el?.classList.add("is-on");
			this._revealed = this._nSpeech;
		}
		this._carry = !1, this._timer = .06, this._typing = this._revealed < this._glyphs.length, this._choiceDelay = -1, this._setChoicesVisible(!1), this._nextEl.classList.remove("is-on");
		let r = e === this._lines.length - 1;
		this._nextEl.classList.toggle("is-last", r), this._nextEl.setAttribute("aria-label", R(r ? "dialog.end" : "dialog.next")), this._layout(), this._ensureFonts(t), this._typing || this._finishLine();
	}
	_ensureFonts(e) {
		let t = We();
		if (!t) return;
		let n = ++this._ensureSeq, r = this._view(e);
		t.ensure([
			e.text,
			r.ask,
			r.speaker,
			et(r.speaker),
			r.title,
			r.choices ?? []
		]).then(() => {
			n === this._ensureSeq && this._open && this._lines[this._index] === e && this._layout();
		});
	}
	_setSpeaker(e) {
		e !== this._currentSpeaker && (this._currentSpeaker = e, this._speakerEl.textContent = e || "", this._nameEl.classList.toggle("is-empty", !e));
	}
	_buildText(e, t = "") {
		if (this._glyphs.length = 0, this._buildInto(this._textEl, e), this._nSpeech = this._glyphs.length, this._buildInto(this._askEl, t), this._nSpeech < this._glyphs.length && this._speechShown()) {
			let e = this._nSpeech - 1;
			for (; e > 0 && !this._glyphs[e].el;) e--;
			this._glyphs[e].pause = Math.max(this._glyphs[e].pause, ed);
		}
	}
	_buildInto(e, t) {
		let n = this._glyphs, r = n.length;
		e.textContent = "";
		let i = document.createDocumentFragment(), a = null, o = !1, s = [...t];
		for (let e = 0; e < s.length; e++) {
			let t = s[e];
			if (t === "{") {
				o = !0;
				continue;
			}
			if (t === "}") {
				o = !1;
				continue;
			}
			if (t === "\n") {
				a = null, i.appendChild(document.createElement("br")), n.push({
					el: null,
					ch: t,
					pause: 0
				});
				continue;
			}
			if (t === " " || t === "	") {
				a = null, i.appendChild(document.createTextNode(" ")), n.push({
					el: null,
					ch: " ",
					pause: 0
				});
				continue;
			}
			let r = document.createElement("span");
			r.className = o ? "lu-c lu-hl kw" : "lu-c", r.textContent = t;
			let c = Vu.test(t);
			if (c) {
				if (a = null, Hu.includes(t)) {
					let t = e + 1;
					for (; t < s.length && (s[t] === "{" || s[t] === "}");) t++;
					t < s.length && Uu.includes(s[t]) && r.classList.add("halt");
				}
				i.appendChild(r);
			} else a || (a = document.createElement("span"), a.className = "lu-w", i.appendChild(a)), a.appendChild(r);
			n.push({
				el: r,
				ch: t,
				pause: 0,
				cjk: c
			});
		}
		e.appendChild(i);
		for (let e = r; e < n.length; e++) {
			let t = n[e].ch, i = zu[t], a = i ?? Ru[t];
			if (!a) continue;
			let o = e + 1;
			for (; o < n.length && Bu.includes(n[o].ch);) o++;
			let s = o < n.length ? n[o].ch : " ";
			if (i !== void 0) {
				if (zu[s] !== void 0 || s === "…" || s === "—") continue;
				n[o - 1].pause = i;
			} else if (s === " " || s === "\n" || Vu.test(s) && zu[s] === void 0) {
				let i = t === "." && e > r && n[e - 1].ch === ".";
				n[o - 1].pause = i ? Ru["…"] : a;
			}
		}
	}
	_revealNext() {
		let e = this._glyphs[this._revealed++];
		e.el && (e.el.classList.add("is-on"), this.onChar && this.onChar(e.ch)), this._timer += (e.cjk && this.cjkPace > 0 ? 1 / (this.speed * this.cjkPace) : 1 / this.speed) + e.pause, this._revealed >= this._glyphs.length && this._finishLine();
	}
	_completeLine() {
		let e = this._glyphs;
		for (let t = this._revealed; t < e.length; t++) e[t].el && e[t].el.classList.add("is-on");
		this._revealed = e.length, this._finishLine();
	}
	_finishLine() {
		this._typing = !1;
		let e = this._lines[this._index];
		e && Array.isArray(e.choices) && e.choices.length ? (this._buildChoices(e.choices), this._choiceDelay = .12) : this._nextEl.classList.add("is-on");
	}
	_advance() {
		if (this._index + 1 < this._lines.length) this._setLine(this._index + 1);
		else if (this._hold) {
			this._held = !0, this._nextEl.classList.remove("is-on");
			let e = this._resolve;
			this._resolve = null, e && e(this._lastChoice);
		} else this.close();
	}
	_countLines(e, t, n) {
		if (e.isConnected && e.getClientRects().length) {
			let t = parseFloat(getComputedStyle(e).lineHeight);
			if (t > 0) return Math.max(1, Math.round(e.offsetHeight / t));
		}
		return String(t).split("\n").reduce((e, t) => e + (t.trim() ? Tt(null, t, "body", n) : 1), 0);
	}
	_reach(e, t, n = 0, r = this._glyphs.length) {
		let i = null;
		for (let e = r - 1; e >= n && !i; e--) i = this._glyphs[e].el;
		if (!i) return 0;
		let a = e.getBoundingClientRect();
		return a.width ? (i.getBoundingClientRect().right - a.left) / a.width * t : 0;
	}
	_width() {
		let e = tn(this.element);
		if (!e) return Gu;
		let t = e.artW - Ju, n = this.element.parentElement, r = n?.querySelector(".lu-skills");
		if (r && !r.closest("[hidden]")) {
			let i = n.getBoundingClientRect(), a = Infinity;
			for (let e of r.querySelectorAll(".lu-skill, .lu-skill .tx")) {
				let t = e.getBoundingClientRect();
				t.width > 0 && t.height > 0 && (a = Math.min(a, t.left));
			}
			a < Infinity && e.cssPx > 0 && (t = Math.min(t, Math.floor((a - i.left) / e.cssPx) - Yu));
		}
		return Math.max(Xu, Math.min(Gu, t - Wu));
	}
	_layout() {
		let e = this._lines[this._index];
		if (!this._open || !e) return;
		let t = B(), n = this._view(e), r = Wu, i = this._width(), a = this._panel, o = this._textEl, s = this._askEl, c = r + (n.sheet ? 72 : 24), l = n.question ? Zu : 0, u = r + i - 24 - c - l;
		Dt(o, "body", {
			color: n.question ? t.sel : t.tx1,
			kw: t.kw,
			maxW: u,
			drop: !0
		});
		let d = dt.body.L, f = $e(), p = this._speechShown() ? this._countLines(o, e.text, u) : 0, m = !!n.ask && this._askShown(), h = u - Zu, g = 0, _ = 0;
		m && (Dt(s, "body", {
			color: t.sel,
			kw: t.kw,
			maxW: h,
			drop: !0
		}), g = this._countLines(s, n.ask, h), _ = p ? f ? $u : Qu : 0);
		let v = p + g, y = f ? 8 : 10, b = 12 + v * d + _ + y, x = v ? m ? c + Zu + this._reach(s, h, this._nSpeech) : c + l + this._reach(o, u, 0, this._nSpeech) : 0, S = qu, C = 0, w = 12;
		for (let e = 0; e < 4 && (S = Math.max(qu, Math.round(b)), C = Ku - S, w = 12 + Math.floor((S - b) / 2), !(!v || x < r + i - 37 - 4)); e++) {
			let e = C + w + (v - 1) * d + _ + Vt("body") + ud("body") / 2, t = Math.ceil(e + 2 - (C + S - 15));
			if (t <= 0) break;
			b += t;
		}
		let T = null;
		if (n.speaker) {
			let e = 2 * Math.ceil(dd("name") / 2), t = 16 + e, r = i - 60, a = n.speaker, o = L(et(a), "name", 1);
			if (23 + o > r) {
				let e = [...ht(et(a), "name", r - 23, 1)];
				a = e.length > 1 ? `${[...n.speaker].slice(0, e.length - 1).join("").trimEnd()}…` : n.speaker, o = L(et(a), "name", 1);
			}
			let s = n.title;
			if (s) {
				let e = r - (16 + o + 6 + 7);
				s = e >= 24 ? ht(s, "line", e) : "";
			}
			let c = s ? L(s, "line") : 0, l = s ? 16 + o + 6 + c + 7 : 16 + o + 7, u = C - t / 2;
			T = {
				shown: a,
				nw: o,
				title: s,
				gn: e,
				ph: t,
				pw: l,
				px0: 40,
				py0: u,
				nc: u + t / 2 + .25
			};
		}
		let ee = !T || T.px0 + T.pw + 3 < r + Math.floor((i - 1) / 2) - 11;
		Bt(a, r, C, i, S), It(a, [r, C]);
		let te = this._art;
		if (It(te, [r, C]), te.replaceChildren(), _t(te, {
			...ad,
			trioTop: ee
		}, r, C, i, S), n.sheet) {
			let e = gn(n.sheet, {
				..._n.dialogue,
				glow: pn(n.color)[0]
			});
			e.classList.add("lu-dialog__portrait"), e.setAttribute("role", "img"), e.setAttribute("aria-label", R("dialog.portrait", { name: n.speaker })), F(te, e, 33, C + Math.floor((S - 42) / 2));
		}
		ld(o, "body", c + l, C + w, a);
		let ne = C + w + p * d + _;
		m && ld(s, "body", c + Zu, ne, a), (n.question || m) && F(te, Ue(1, z.gold(), { setting: [
			t.g5,
			t.g4,
			t.g3
		] }), c, Math.round((m ? ne : C + w) + Vt("body") - 2), 1, "lu-dialog__ask"), Bt(this._nextEl, i - 37, S - 15, 9, 8);
		let re = this._nameEl, ie = this._nameArt;
		if (re.classList.toggle("is-empty", !T), T) {
			let { px0: e, py0: i, pw: a, ph: o, gn: s, nw: c, nc: l } = T;
			Bt(re, e - r, i - C, a, o), It(re, [e, i]), It(ie, [e, i]), ie.replaceChildren(), _t(ie, od(), e, i, a, o), F(ie, Ue(2, pn(n.color)), e + 6, i + o / 2 - 3, 1, "lu-dialog__gem");
			let u = this._speakerEl;
			u.textContent !== T.shown && (u.textContent = T.shown), Dt(u, "name", {
				track: 1,
				color: t.g4,
				drop: !0
			}), ld(u, "name", e + 16, l - Vt("name"), re);
			let d = this._titleEl;
			T.title ? (F(ie, V(1, 10 + s, (e) => e.vline(0, 0, 10 + s, t.dm1)), e + 16 + c + 3, i + 3), d.textContent = T.title, Dt(d, "line", {
				color: t.tx2,
				drop: !0
			}), ld(d, "line", e + 16 + c + 6, l + ud("name") / 2 - ud("line") / 2 - Vt("line"), re), d.hidden = !1) : (d.textContent = "", d.hidden = !0);
		}
		this._geo = {
			x0: r,
			y0: C,
			w: i,
			h: S,
			LH: d,
			plateEnd: T ? T.px0 + T.pw : 0,
			gn: T ? T.gn : 0
		}, this._choicesLine === this._index && this._choiceEls.length && this._layoutChoices();
	}
	_layoutChoices() {
		let e = this._geo;
		if (!e) return;
		let { x0: t, y0: n, w: r, LH: i } = e, a = 16 + 2 * Math.ceil(dd("body") / 2), o = this._choiceLabels, s = vu(td), c = 12 + s + rd, l = Math.min(r - 20, Math.max(100, Math.max(...o.map((e) => L(e, "body"))) + id + c)), u = l - id - c, d = o.map((e) => {
			let t = L(e, "body") > u ? Tt(null, e, "body", u) : 1;
			return {
				nl: t,
				rh: a + (t - 1) * i
			};
		}), f = 12 + d.reduce((e, t) => e + t.rh, 0), p = t + r - 10 - l, m = n - 10 - f - (e.plateEnd && e.plateEnd + 4 > p ? 4 + e.gn / 2 : 0), h = this._choicesEl;
		Bt(h, p, m, l, f), It(h, [p, m]);
		let g = this._choiceArt;
		It(g, [p, m]), g.replaceChildren(), _t(g, sd(), p, m, l, f);
		let _ = m + 6;
		this._keyRows.length = 0, this._choiceEls.forEach((e, t) => {
			let { nl: n, rh: r } = d[t];
			Bt(e, 6, _ - m, l - 12, r), It(e, [p + 6, _]);
			let i = e.querySelector(".lu-choice__label");
			e.replaceChildren(i), F(e, st(l - 12, r), p + 6, _, 1, "lu-choice__band"), F(e, Nt("cursorGem"), p + 8, _ + a / 2 - 4, 1, "lu-choice__cursor"), Dt(i, "body", {
				drop: !0,
				maxW: n > 1 ? u : null
			}), ld(i, "body", p + id, _ + a / 2 - Vt("body"), e), this._keyRows.push({
				x: l - 6 - nd - s,
				y: Math.round(_ - m + a / 2 - 5.5),
				w: s
			}), _ += r;
		}), this._placeKey();
	}
	_placeKey() {
		let e = this._keyRows[this._choiceIndex];
		e && Bt(this._keyEl, e.x, e.y, e.w, 11);
	}
	_buildChoices(e) {
		let t = this._choicesEl;
		t.classList.remove("is-armed"), this._keyEl.classList.remove("is-nudge-a", "is-nudge-b");
		for (let e of this._choiceEls) e.remove();
		this._choiceEls.length = 0, this._choiceLabels = e.map((e) => String(e)), this._choiceLabels.forEach((e, n) => {
			let r = document.createElement("li");
			r.className = "g lu-choice";
			let i = document.createElement("div");
			i.className = "lu-choice__label", i.textContent = e, r.append(i), r.addEventListener("pointermove", () => {
				this._choicesActive && this._choiceIndex !== n && this._setChoice(n, !0);
			}), r.addEventListener("click", (e) => {
				e.stopPropagation(), this._choicesActive && this._guard <= 0 && this._selectChoice(n);
			}), t.appendChild(r), this._choiceEls.push(r);
		}), this._choicesLine = this._index, this._layoutChoices(), this._setChoice(0, !1);
	}
	_activateChoices() {
		this._choiceDelay = -1, this._choicesActive = !0, this._choiceArmed = !1, this._quiet = this.choiceQuiet, this._react = 0, this._choicesEl.classList.remove("is-armed"), this._keyEl.classList.remove("is-nudge-a", "is-nudge-b"), this._setChoicesVisible(!0);
	}
	_arm(e) {
		if (this._choiceArmed) {
			this._react = Math.min(this._react, e);
			return;
		}
		this._choiceArmed = !0, this._react = e, this._choicesEl.classList.add("is-armed");
	}
	_lock() {
		this._choiceArmed = !1, this._react = 0, this._quiet = this.choiceQuiet, this._choicesEl.classList.remove("is-armed");
	}
	_nudgeKey() {
		this._nudgeA = !this._nudgeA, this._keyEl.classList.toggle("is-nudge-a", this._nudgeA), this._keyEl.classList.toggle("is-nudge-b", !this._nudgeA);
	}
	_setChoicesVisible(e) {
		e || (this._choicesActive = !1, this._choiceArmed = !1), this._choicesEl.classList.toggle("is-on", e);
	}
	_setChoice(e, t) {
		let n = this._choiceEls.length;
		if (n) {
			this._choiceIndex = (e % n + n) % n;
			for (let e = 0; e < n; e++) this._choiceEls[e].classList.toggle("is-sel", e === this._choiceIndex);
			this._placeKey(), t && this._sound("blip");
		}
	}
	_moveChoice(e) {
		this._choiceEls.length > 1 && this._setChoice(this._choiceIndex + e, !0);
	}
	_selectChoice(e) {
		this._lastChoice = e, this._sound("confirm"), this._setChoicesVisible(!1), this._advance();
	}
};
function md(e) {
	return typeof e == "string" && e.trim() !== "";
}
function hd(e) {
	return typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement && e.width > 0 && e.height > 0;
}
//#endregion
//#region src/engine/ui/Banner.js
var gd = 1.1, _d = 520, vd = class {
	constructor(e = document.body) {
		let t = document.createElement("div");
		t.className = "lu-banner", t.setAttribute("aria-live", "polite"), e.appendChild(t), this.element = t, this._t1 = 0, this._t2 = 0, this._resolve = null, this._visible = !1, this._titleText = "", this._subText = "", this._key = "", this._box = null, this._unscale = lt(e, () => {
			this._visible && this._render();
		});
	}
	get visible() {
		return this._visible;
	}
	get box() {
		return this._visible && this._box ? { ...this._box } : null;
	}
	_announce() {
		this.element.dispatchEvent(new CustomEvent("lu-banner", {
			bubbles: !0,
			detail: this.box
		}));
	}
	show(e, t = "", { duration: n = 3.5 } = {}) {
		this._settle(), clearTimeout(this._t1), clearTimeout(this._t2);
		let r = this.element, i = String(e ?? ""), a = String(t ?? "");
		this._titleText = i, this._subText = a, this._render(), r.classList.remove("is-in", "is-out"), r.offsetWidth, r.classList.add("is-in"), this._visible = !0, this._announce(), this._t1 = setTimeout(() => this.hide(), Math.max(1.2, n) * 1e3);
		let o = We();
		return o && an() && o.ensure(`${i}\n${a}`).then(() => {
			this._visible && this._titleText === i && this._subText === a && this._render();
		}, () => {}), new Promise((e) => {
			this._resolve = e;
		});
	}
	hide(e = !1) {
		let t = this.element;
		if (e) {
			if (!this._visible) return;
			clearTimeout(this._t1), clearTimeout(this._t2), t.classList.remove("is-in", "is-out"), this._visible = !1, this._announce(), this._settle();
			return;
		}
		this._visible && !t.classList.contains("is-out") && (clearTimeout(this._t1), t.classList.remove("is-in"), t.classList.add("is-out"), this._t2 = setTimeout(() => {
			t.classList.remove("is-out"), this._visible = !1, this._announce(), this._settle();
		}, gd * 1e3));
	}
	dispose() {
		clearTimeout(this._t1), clearTimeout(this._t2), this._unscale(), this._visible && (this._visible = !1, this._announce()), this._settle(), this.element.remove();
	}
	_settle() {
		let e = this._resolve;
		this._resolve = null, e && e();
	}
	_render() {
		let e = B(), t = ht(et(this._titleText), "head", _d, 1), n = ht(this._subText, "line", _d), r = L(t, "head", 1), i = n ? L(n, "line") : 0, a = 2 * Math.ceil(gt("head") / 2), o = n ? 2 * Math.ceil(gt("line") / 2) : 0, s = tn(this.element), c = `${t}\n${n}\n${r}\n${i}\n${a}\n${o}\n${s?.artW}x${s?.artH}`;
		if (c === this._key && this.element.firstChild) return;
		this._key = c;
		let l = this.element;
		l.replaceChildren();
		let u = Math.max(102, r + 40, i + 30);
		u += u % 2;
		let d = 60 + a / 2, f = 81 + a, p = n ? 93 + a + o : 84 + a, m = 320 - u / 2 - 24, h = u + 48, g = p + 7 - 50, _ = qt(l, "tc", m, 48, h, g + 2), v = Pt(h, g, tt(e.band), (e, t) => Math.max(0, 1 - Math.hypot((e - .5) / .5, (t - .5) / .5)) * 1.4 * .7, [
			.25,
			.5,
			.7
		]);
		for (let [t, n, r, i] of [
			[
				v,
				m,
				50,
				"lu-banner__shade"
			],
			[
				nt(u, "both"),
				320 - u / 2,
				57,
				"lu-banner__rule"
			],
			[
				nt(u, "both"),
				320 - u / 2,
				p,
				"lu-banner__rule"
			],
			[
				V(9, 5, (t) => mn(t, 4, 2, 1, z.gold(), { setting: [
					e.g5,
					e.g4,
					e.g3
				] })),
				316,
				55,
				"lu-banner__gem"
			]
		]) F(_, t, n, r, 1, i).setAttribute("aria-hidden", "true");
		let y = P(_, t, 320, d, {
			font: "head",
			track: 1,
			color: e.g5,
			align: "center",
			ol: !0,
			cls: "lu-banner__title"
		});
		y.setAttribute("role", "heading"), y.setAttribute("aria-level", "2"), P(_, n, 320, f, {
			font: "line",
			color: e.g4,
			align: "center",
			ol: !0,
			cls: "lu-banner__sub"
		});
		let b = _.dataset.fit === "shrunk" && Number(_.style.getPropertyValue("--lu-fit")) || 1;
		this._box = {
			x: 320 - u / 2,
			y: 55,
			w: u,
			h: p + 1 - 55,
			fit: b
		}, this._visible && this._announce();
	}
};
//#endregion
//#region src/engine/ui/TitleScreen.js
function yd(e = 22, t = 2024) {
	let n = new Oe(t), r = "";
	for (let t = 0; t < e; t++) {
		let e = n.range(0, 1) < .3 ? 2 : 1, t = n.range(4, 96).toFixed(1), i = n.range(11, 22).toFixed(1), a = (-n.range(0, 22)).toFixed(1), o = Math.round(n.range(-20, 20)), s = n.range(.45, .95).toFixed(2);
		r += `<span class="lu-mote" style="--x:${t}%;--k:${e};--d:${i}s;--dl:${a}s;--sw:${o};--n:${Math.max(1, Math.abs(o))};--a:${s}"><i></i></span>`;
	}
	return r;
}
var bd = /* @__PURE__ */ new Set([
	"ShiftLeft",
	"ShiftRight",
	"ControlLeft",
	"ControlRight",
	"AltLeft",
	"AltRight",
	"MetaLeft",
	"MetaRight",
	"F5",
	"F11",
	"F12",
	"CapsLock",
	"Tab"
]), xd = /* @__PURE__ */ new Set([
	"Enter",
	"NumpadEnter",
	"Space"
]), Sd = "KeyL", Cd = Object.freeze([
	Object.freeze({
		code: "en",
		label: "EN"
	}),
	Object.freeze({
		code: "ja",
		label: "日本語"
	}),
	Object.freeze({
		code: "zh",
		label: "中文"
	})
]), wd = Object.freeze({
	E: [
		"......",
		"......",
		"......",
		"######",
		"#.....",
		"#.....",
		"#.....",
		"#####.",
		"#.....",
		"#.....",
		"#.....",
		"######"
	],
	N: [
		".......",
		".......",
		".......",
		"#.....#",
		"##....#",
		"#.#...#",
		"#.#...#",
		"#..#..#",
		"#...#.#",
		"#...#.#",
		"#....##",
		"#.....#"
	],
	日: [
		"#########",
		"#.......#",
		"#.......#",
		"#.......#",
		"#.......#",
		"#########",
		"#.......#",
		"#.......#",
		"#.......#",
		"#.......#",
		"#.......#",
		"#########"
	],
	本: [
		"......#......",
		"......#......",
		"#############",
		".....###.....",
		"....#.#.#....",
		"...#..#..#...",
		"..#...#...#..",
		".#....#....#.",
		"#...#####...#",
		"......#......",
		"......#......",
		"......#......"
	],
	語: [
		"..#...#######",
		"#####...#....",
		"........#....",
		".###...#####.",
		"...........#.",
		".###..#######",
		".............",
		"#####..#####.",
		"#...#..#...#.",
		"#...#..#...#.",
		"#...#..#...#.",
		"#####..#####."
	],
	中: [
		".....#.....",
		".....#.....",
		"###########",
		"#....#....#",
		"#....#....#",
		"#....#....#",
		"###########",
		".....#.....",
		".....#.....",
		".....#.....",
		".....#.....",
		".....#....."
	],
	文: [
		"......#......",
		"......#......",
		"#############",
		"..#.......#..",
		"...#.....#...",
		"....#...#....",
		".....#.#.....",
		"......#......",
		".....#.#.....",
		"....#...#....",
		"..##.....##..",
		"##.........##"
	]
});
function Td(e, t) {
	let n = [...e];
	if (!n.length || !n.every((e) => Object.prototype.hasOwnProperty.call(wd, e))) return null;
	let r = n.map((e) => wd[e]), i = n.map((e) => /[A-Z]/.test(e)), a = (e) => i[e] && i[e + 1] ? 1 : 2, o = r.reduce((e, t, n) => e + t[0].length + (n < r.length - 1 ? a(n) : 0), 0), s = B();
	return V(o + 2, 14, (e) => {
		let n = [], i = 1;
		r.forEach((e, t) => {
			e.forEach((e, t) => {
				for (let r = 0; r < e.length; r++) e[r] === "#" && n.push([i + r, 1 + t]);
			}), i += e[0].length + a(t);
		});
		let o = new Set(n.map(([e, t]) => `${e},${t}`));
		for (let [t, r] of n) for (let [n, i] of [
			[1, 0],
			[-1, 0],
			[0, 1],
			[0, -1]
		]) o.has(`${t + n},${r + i}`) || e.px(t + n, r + i, s.ink0);
		for (let [r, i] of n) e.px(r, i, t);
	});
}
var Ed = () => {
	let e = kt();
	return $t(e) / e;
}, Dd = 560, Od = 600;
function kd(e, t, n, r, i, a) {
	let o = document.createElement("div");
	o.className = `g ${a}`;
	let [s, c] = bt(e);
	return Bt(o, Math.round(t - s), Math.round(n - c), r, i), It(o, [Math.round(t), Math.round(n)]), e.append(o), o;
}
var Ad = class {
	constructor(e = document.body) {
		let t = document.createElement("div");
		t.className = "lu-title is-gone", t.innerHTML = `
      <div class="lu-title__motes" aria-hidden="true">${yd()}</div>
      <h1 class="lu-title__name"></h1>
      <div class="lu-title__part lu-title__part--crest" aria-hidden="true"></div>
      <div class="lu-title__part lu-title__part--logo" aria-hidden="true"></div>
      <div class="lu-title__part lu-title__part--rule" aria-hidden="true"></div>
      <div class="lu-title__part lu-title__part--sub"></div>
      <div class="lu-title__part lu-title__part--menu"></div>
      <div class="lu-title__part lu-title__part--foot"></div>
      <div class="lu-title__part lu-title__part--lang"></div>`, e.appendChild(t), this.element = t, this._name = t.querySelector(".lu-title__name");
		let n = (e) => t.querySelector(`.lu-title__part--${e}`);
		this._parts = {
			crest: n("crest"),
			logo: n("logo"),
			rule: n("rule"),
			sub: n("sub"),
			menu: n("menu"),
			foot: n("foot"),
			lang: n("lang")
		}, this.armDelay = .45, this.onDismiss = null, this._visible = !1, this._leaving = !1, this._armedAt = 0, this._resolve = null, this._hideTimer = 0, this._promptText = "", this._o = {
			title: "",
			subtitle: "",
			credit: "",
			titleSource: ""
		}, this._destEl = null, this._destLabel = null, this._destHint = null, this._destHintText = "", this._destVerb = null, this._destPrompt = null, this._dests = null, this._menu = !1, this._destIndex = 0, this._curIndex = 0, this._current = null, this._langs = null, this._langCur = 0, this._langSel = 0, this._langFocus = !1, this._onLanguage = null, this._laidPx = 0, this._laidW = 0, this._headBottom = 0, this._headBox = {
			half: 0,
			top: 180,
			bottom: 180
		}, this._menuBox = {
			half: 0,
			top: 180,
			bottom: 180
		}, this._logos = /* @__PURE__ */ new Map(), this._loaded = /* @__PURE__ */ new Set(), this._loading = /* @__PURE__ */ new Set(), this._showId = 0, this._fontsIn = !1, this._onKey = (e) => {
			if (!(!this._accepting() || e.repeat || bd.has(e.code))) {
				if (e.preventDefault(), e.stopPropagation(), this._langs && e.code === Sd) {
					this._langFocus ? this._stepLang(1) : this._focusLang();
					return;
				}
				if (this._langFocus) {
					e.code === "ArrowLeft" || e.code === "ArrowRight" ? this._stepLang(e.code === "ArrowLeft" ? -1 : 1) : xd.has(e.code) ? this._applyLang(this._langSel) : this._blurLang();
					return;
				}
				if (this._menu) {
					e.code === "ArrowUp" || e.code === "ArrowLeft" || e.code === "KeyW" ? this._cycle(-1) : e.code === "ArrowDown" || e.code === "ArrowRight" || e.code === "KeyS" ? this._cycle(1) : xd.has(e.code) && this._dismiss("key");
					return;
				}
				if (this._dests) {
					if (e.code === "ArrowLeft" || e.code === "ArrowRight") {
						this._cycle(e.code === "ArrowLeft" ? -1 : 1);
						return;
					}
					xd.has(e.code) || this._resetDest();
				}
				this._dismiss("key");
			}
		}, this._onPointer = (e) => {
			if (!this._accepting()) return;
			let t = e.target, n = t?.closest?.(".lu-title__lang-opt");
			if (n && this._langs) {
				e.preventDefault(), e.stopPropagation(), this._applyLang(Number(n.dataset.index));
				return;
			}
			let r = t?.closest?.(".lu-title__dest-arrow");
			if (r && this._dests) {
				e.preventDefault(), e.stopPropagation(), this._cycle(r.classList.contains("lu-title__dest-arrow--prev") ? -1 : 1);
				return;
			}
			if (this._langFocus) {
				e.preventDefault(), this._blurLang();
				return;
			}
			if (this._menu) {
				let n = t?.closest?.(".lu-title__menu-item");
				if (!n) return;
				e.preventDefault(), this._destIndex = Number(n.dataset.index) || 0, this._renderMenu(), this._dismiss("pointer");
				return;
			}
			e.preventDefault(), this._dests && !t?.closest?.(".lu-title__dest-label") && this._resetDest(), this._dismiss("pointer");
		}, this._offScale = lt(e, (e) => {
			this._visible && !this._leaving && (e.px !== this._laidPx || e.artW !== this._laidW ? this._layout() : this._fitGroups());
		});
	}
	get visible() {
		return this._visible;
	}
	get destination() {
		return this._dests ? this._destIndex === this._curIndex ? this._current : this._dests[this._destIndex].value : null;
	}
	get language() {
		return this._langs ? {
			current: this._langs[this._langCur].code,
			selected: this._langs[this._langSel].code,
			focused: this._langFocus
		} : null;
	}
	show({ title: e = R("title.name"), subtitle: t = "", prompt: n = R("title.pressAnyKey"), credit: r = R("title.credit"), destinations: i, current: a, destinationHint: o, destinationVerb: s, destinationPrompt: c, menu: l = !1, titleSource: u, languages: d, lang: f, onLanguage: p } = {}) {
		this._settle(void 0), clearTimeout(this._hideTimer);
		let m = (e) => e == null ? "" : String(e);
		this._o = {
			title: m(e),
			subtitle: m(t),
			credit: m(r),
			titleSource: m(u)
		}, this._name.textContent = this._o.title, this._promptText = m(n), this._destVerb = s == null ? null : m(s).trim(), this._destPrompt = c == null ? null : m(c), this._destHintText = o == null ? R("title.chooseLevel") : m(o).trim(), this._setDestinations(i, a, !!l), this._setLanguages(d, f, p);
		let h = this.element;
		h.classList.remove("is-on", "is-leaving", "is-gone"), h.classList.toggle("is-menu", this._menu), h.offsetWidth, h.classList.add("is-on"), this._visible = !0, this._leaving = !1;
		let g = ++this._showId;
		this._fontsIn = !1, this._layout();
		let _ = We(), v = this._texts(), y = () => {
			this._visible && !this._leaving && g === this._showId && (this._fontsIn = !0, this._layout());
		};
		return _ ? _.ensure(v).then(y, y) : document.fonts?.ready.then(y, y), this._armedAt = performance.now() + this.armDelay * 1e3, window.addEventListener("keydown", this._onKey, !0), h.addEventListener("pointerdown", this._onPointer), new Promise((e) => {
			this._resolve = e;
		});
	}
	hide() {
		this._visible && !this._leaving && (this._leave(), this._settle(void 0));
	}
	dispose() {
		this._detach(), clearTimeout(this._hideTimer), this._settle(void 0), this._offScale(), this.element.remove();
	}
	_accepting() {
		return this._visible && !this._leaving && performance.now() >= this._armedAt;
	}
	_dismiss(e) {
		this._leave(), this.onDismiss && this.onDismiss(e), this._settle(e);
	}
	_leave() {
		this._leaving = !0, this._detach();
		let e = this.element;
		e.classList.add("is-leaving"), e.classList.remove("is-on"), clearTimeout(this._hideTimer), this._hideTimer = setTimeout(() => {
			e.classList.remove("is-leaving"), e.classList.add("is-gone"), this._visible = !1, this._leaving = !1;
		}, 1150);
	}
	_detach() {
		window.removeEventListener("keydown", this._onKey, !0), this.element.removeEventListener("pointerdown", this._onPointer);
	}
	_settle(e) {
		let t = this._resolve;
		this._resolve = null, t && t(e);
	}
	_texts() {
		let e = this._o, t = [
			e.title,
			e.subtitle,
			e.credit,
			e.titleSource,
			this._promptText,
			this._destHintText,
			R("title.choose"),
			R("title.start"),
			R("title.language"),
			R("title.langSwitch"),
			R("title.langBack")
		];
		for (let e of this._dests ?? []) t.push(e.label, e.detail, this._changedPrompt(e.label));
		for (let e of this._langs ?? []) t.push(e.label);
		return t.filter(Boolean).join("\n");
	}
	_setDestinations(e, t, n) {
		let r = Array.isArray(e) ? e.filter((e) => e && e.value != null).map((e) => ({
			value: String(e.value),
			label: String(e.label ?? e.value),
			detail: e.detail == null ? "" : String(e.detail)
		})) : [];
		if (!r.length) {
			this._dests = null, this._current = null, this._menu = !1;
			return;
		}
		this._dests = r, this._menu = n, this._current = t == null ? r[0].value : String(t), this._curIndex = Math.max(0, r.findIndex((e) => e.value === this._current)), this._destIndex = this._curIndex;
	}
	_setLanguages(e, t, n) {
		this._onLanguage = typeof n == "function" ? n : null;
		let r = Array.isArray(e) && e.length ? e : Cd, i = this._onLanguage ? r.filter((e) => e && e.code != null).map((e) => ({
			code: String(e.code),
			label: String(e.label ?? e.code)
		})) : [];
		if (this._langs = i.length ? i : null, !this._langs) {
			this._langFocus = !1;
			return;
		}
		let a = String(t ?? sn());
		this._langCur = Math.max(0, this._langs.findIndex((e) => e.code === a)), this._langSel = this._langCur, this._langFocus = !1;
	}
	_cycle(e) {
		let t = this._dests.length;
		this._destIndex = (this._destIndex + e + t) % t, this._renderMenu();
	}
	_resetDest() {
		this._dests && this._destIndex !== this._curIndex && (this._destIndex = this._curIndex, this._renderMenu());
	}
	_changedPrompt(e) {
		return this._destPrompt == null ? this._destVerb ? `${this._destVerb} ${e}` : R("title.travelTo", { label: e }) : this._destPrompt.replace(/\{label\}/g, e);
	}
	_focusLang() {
		this._langs && (this._langFocus = !0, this._langSel = this._langCur, this._renderLang());
	}
	_stepLang(e) {
		if (!this._langs) return;
		this._langFocus || (this._langFocus = !0, this._langSel = this._langCur);
		let t = this._langs.length;
		this._langSel = (this._langSel + e + t) % t, this._renderLang();
	}
	_blurLang() {
		this._langFocus = !1, this._langs && (this._langSel = this._langCur), this._renderLang();
	}
	_applyLang(e) {
		let t = this._langs?.[e];
		if (t) {
			if (e === this._langCur) {
				this._blurLang();
				return;
			}
			this._langCur = e, this._langSel = e, this._langFocus = !1, this._renderLang(), this._onLanguage?.(t.code);
		}
	}
	_layout() {
		this._laidPx = kt(), this._laidW = tn(this.element)?.artW ?? 640, this._renderHead(), this._renderMenu(), this._renderFoot(), this._renderLang();
	}
	_room() {
		let e = tn(this.element)?.artW ?? 640;
		return Math.max(160, 2 * Math.floor((e - 32) / 2));
	}
	_logo(e, t, n = Dd) {
		let r = He(), i = `${e}|${r}|${n}|${t}`, a = this._logos.get(i);
		if (!a) {
			let o = !(e === "text" || !ze(t)) || (e === "text" ? this._fontLoaded(Ve[r === "zh" ? "zh" : "ja"][0], t) : this._fontsIn);
			if (e === "text" && !o) return null;
			a = e === "text" ? Le(t, r, { maxW: n }).canvas : e === "mark" ? Be(et(t), 1) : Re(et(t), { maxW: n }).canvas, o && (this._logos.size > 16 && this._logos.clear(), this._logos.set(i, a));
		}
		let o = un(a);
		return o.setAttribute("aria-hidden", "true"), o;
	}
	_fontLoaded(e, t) {
		if (!e || typeof document > "u" || !document.fonts) return !1;
		let n = `${e}|${t}`;
		if (this._loaded.has(n)) return !0;
		if (this._loading.has(n)) return !1;
		let r = /"([^"]+)"|([A-Za-z0-9]+)\s*$/.exec(e), i = (r?.[1] ?? r?.[2] ?? "").toLowerCase(), a = !1;
		for (let e of document.fonts) if (e.family.replace(/["']/g, "").toLowerCase() === i) {
			a = !0;
			break;
		}
		if (!a) return !1;
		this._loading.add(n);
		let o = this._showId, s = () => {
			this._loading.delete(n), this._loaded.add(n), this._visible && !this._leaving && o === this._showId && this._layout();
		};
		return document.fonts.load(e, t).then(s, s), !1;
	}
	_renderHead() {
		let { crest: e, logo: t, rule: n, sub: r } = this._parts;
		for (let i of [
			e,
			t,
			n,
			r
		]) i.replaceChildren();
		let i = B(), a = this._o, o = He(), s = (e) => qt(e, "mc", 40, 50, Dd, 300), c = s(e), l = s(t), u = s(n), d = s(r), f = a.title, p = this._room(), m = Math.min(Dd, p), h = 110, g, _;
		if (ze(f) || !Object.prototype.hasOwnProperty.call(Ve, o)) {
			let e = this._logo("roman", f, m), t = 140 - e.height;
			g = t - 29, F(l, e, 320 - Math.floor(e.width / 2), t, 1, "lu-title__logo"), h = Math.max(h, Math.ceil(e.width / 2)), _ = 150;
		} else {
			let e = this._logo("text", f, m), t = e ? e.height : o === "zh" ? 70 : 54, n = Math.max(42, 86 - Math.max(0, t - 90));
			g = n - 34, e && (F(l, e, 320 - Math.floor(e.width / 2), n, 1, "lu-title__logo"), h = Math.max(h, Math.ceil(e.width / 2)));
			let r = n + t + 2, i = a.titleSource.trim();
			if (i && i !== f) {
				let e = this._logo("mark", i);
				e && e.width <= m && (F(l, e, 320 - Math.floor(e.width / 2), r, 1, "lu-title__wordmark"), h = Math.max(h, Math.ceil(e.width / 2)), r += e.height);
			}
			_ = r + 2;
		}
		if (F(c, nn(25), 307, g, 1, "lu-title__crest"), F(u, it(219), 211, _, 1, "lu-title__divider"), this._headBottom = _ + 13, a.subtitle) {
			let e = ht(a.subtitle, "line", Math.min(Od, p), 2), t = P(d, e, 320, _ + 18, {
				font: "line",
				track: 2,
				color: i.tx2,
				align: "center",
				ol: !0,
				cls: "lu-title__sub"
			});
			h = Math.max(h, Math.ceil(t.tw / 2) + 1), this._headBottom = _ + 18 + dt.line.L;
		}
		this._headBox = {
			half: h,
			top: g,
			bottom: this._headBottom
		};
	}
	_renderMenu() {
		let e = this._parts.menu;
		e.replaceChildren(), this._destEl = null, this._destLabel = null, this._destHint = null;
		let t = qt(e, "mc", 40, 50, Dd, 300), n = Math.max(0, Math.ceil(this._headBottom + 14) - 222);
		if (this._menu && this._dests) {
			this._menuBox = this._renderList(t, 222 + n);
			let e = kd(t, 40, 222 + n, 560, 16, "lu-title__prompt is-hidden"), r = this._dests[this._destIndex], i = document.createElement("span");
			i.className = "lu-title__prompt-text", i.textContent = this._destIndex === this._curIndex ? this._promptText : this._changedPrompt(r.label), e.append(i);
		} else if (this._dests) {
			let e = this._renderPrompt(t, 230 + n), r = this._renderChooser(t, 244 + n);
			this._menuBox = {
				half: Math.max(e.half, r.half),
				top: Math.min(e.top, r.top),
				bottom: Math.max(e.bottom, r.bottom)
			};
		} else this._menuBox = this._renderPrompt(t, 244 + n);
		this._fitGroups();
	}
	_fitGroups() {
		let e = this._headBox, t = this._menuBox, n = Math.ceil(Math.max(e.half, t.half, 1)), r = Math.floor(Math.min(e.top, t.top)), i = Math.ceil(Math.max(e.bottom, t.bottom));
		for (let e of [
			"crest",
			"logo",
			"rule",
			"sub",
			"menu"
		]) {
			let t = this._parts[e].firstElementChild;
			t && Ot(t, "mc", 320 - n, r, 2 * n, Math.max(1, i - r));
		}
	}
	_renderPrompt(e, t) {
		let n = B(), r = kd(e, 40, t - 9, 560, 18, "lu-title__prompt"), i = {
			half: 0,
			top: t - 9,
			bottom: t + 9
		}, a = this._dests?.[this._destIndex];
		if (a && this._destIndex !== this._curIndex) {
			let e = this._changedPrompt(a.label), o = L(e, "name"), s = Ft("Enter") + 6 + o, c = 320 - Math.floor(s / 2);
			return c += wt(r, "Enter", c, Math.round(t - 5.5)) + 6, I(r, e, c, t, {
				font: "name",
				color: n.g4,
				ol: !0,
				cls: "lu-title__prompt-text"
			}), i.half = Math.ceil(s / 2) + 1, i;
		}
		let o = this._promptText;
		if (!o) return i;
		let s = L(o, "name"), c = 320 - Math.floor(s / 2);
		return F(r, Ue(2, z.gold()), c - 15, Math.round(t - 3.5), 1, "lu-title__gem"), F(r, Ue(2, z.gold()), c + s + 8, Math.round(t - 3.5), 1, "lu-title__gem"), I(r, o, 320, t, {
			font: "name",
			color: n.tx1,
			align: "center",
			ol: !0,
			cls: "lu-title__prompt-text is-blink"
		}), i.half = Math.ceil(s / 2) + 15, i;
	}
	_renderChooser(e, t) {
		let n = B(), r = 2 * Math.ceil(gt("name") / 2), i = this._dests[this._destIndex], a = this._destIndex !== this._curIndex, o = Math.max(...this._dests.map((e) => L(e.label, "name"))), s = Math.max(110, o + 50), c = 320 - Math.floor(s / 2), l = kd(e, c, t - r / 2, s, 16 + r + 22, `lu-title__dest${a ? " is-changed" : ""}`), u = kd(l, c, t - r / 2, s, 16 + r, "lu-title__dest-label");
		F(u, at(s, 16 + r), c, t - r / 2), I(u, i.label, 320, t + 8, {
			font: "name",
			color: a ? n.g5 : n.g4,
			align: "center",
			ol: !0
		});
		let d = this._dests.length < 2;
		for (let [e, n] of [[-1, c + 6], [1, c + s - 11]]) {
			let i = kd(l, n - 5, t - r / 2, 15, 16 + r, `lu-title__dest-arrow lu-title__dest-arrow--${e < 0 ? "prev" : "next"}`);
			i.setAttribute("role", "button"), i.setAttribute("aria-label", R(e < 0 ? "title.prevLevel" : "title.nextLevel"));
			let a = e < 0 ? "left" : "right";
			F(i, d ? qe(a) : Nt(a), n, t + 5);
		}
		let f = t + 16 + r / 2 + 6, p = kd(l, c, f, s, 11, "lu-title__dest-hint"), m = Et(p, [{
			keys: ["←", "→"],
			label: this._destHintText
		}], 320, f, {
			align: "center",
			color: n.tx2,
			ol: !0
		});
		return this._destEl = l, this._destLabel = u, this._destHint = p, {
			half: Math.ceil(Math.max(s, m + 2) / 2),
			top: t - r / 2,
			bottom: f + 11
		};
	}
	_renderList(e, t) {
		let n = B(), r = 2 * Math.ceil(gt("name") / 2), i = Math.max(110, ...this._dests.map((e) => L(e.label, "name") + 50)), a = kd(e, 320 - Math.floor(i / 2) - 10, t - r / 2, i + 20, 80, "lu-title__dest is-menu");
		a.setAttribute("role", "menu"), a.setAttribute("aria-label", R("title.menu"));
		let o = t, s = t, c = !1, l = i / 2 + 10;
		this._dests.forEach((e, t) => {
			let u = t === this._destIndex, d = 16 + r + (e.detail ? 12 : 0), f = kd(a, 320 - Math.floor(i / 2), o - r / 2, i, d, "lu-title__menu-item");
			if (f.dataset.index = String(t), f.setAttribute("role", "menuitem"), u && f.setAttribute("aria-current", "true"), u) {
				let t = Math.max(110, L(e.label, "name") + 50);
				F(f, at(t, 16 + r), 320 - t / 2, o - r / 2), F(f, Nt("cursorGem"), 320 - t / 2 - 6, o + 4, 1, "nudge");
			}
			let p = I(f, e.label, 320, o + 8, {
				font: "name",
				color: u ? n.g4 : n.tx2,
				align: "center",
				ol: !0,
				cls: u ? "lu-title__dest-label" : "lu-title__menu-label"
			});
			if (u && (this._destLabel = p), e.detail) {
				let t = P(f, e.detail, 320, o + 18 + r / 2, {
					font: "line",
					color: n.tx2,
					align: "center",
					ol: !0,
					cls: "lu-title__menu-detail"
				});
				l = Math.max(l, t.tw / 2 + 1);
			}
			s = o, c = !!e.detail, o += e.detail ? 30 + r / 2 : 22 + r / 2;
		});
		let u = s + 24 - r / 2 + (c ? 10 + r / 2 : 0), d = kd(a, 40, u, 560, 11, "lu-title__dest-hint"), f = Et(d, [{
			keys: ["↑", "↓"],
			label: R("title.choose")
		}, {
			keys: ["Space"],
			label: R("title.start")
		}], 320, u, {
			align: "center",
			color: n.tx2,
			ol: !0
		});
		return this._destEl = a, this._destHint = d, {
			half: Math.ceil(Math.max(l, f / 2 + 1)),
			top: t - r / 2,
			bottom: u + 11
		};
	}
	_renderFoot() {
		let e = this._parts.foot;
		e.replaceChildren();
		let t = this._o.credit;
		if (!t) return;
		let n = B(), r = qt(e, "bc", 160, 334, 320, 20);
		P(r, ht(et(t), "line", 600, 1), 320, 338, {
			font: "line",
			track: 1,
			color: n.tx3,
			align: "center",
			ol: !0,
			cls: "lu-title__credit"
		});
	}
	_renderLang() {
		let e = this._parts.lang;
		if (e.replaceChildren(), !this._langs) return;
		let t = B(), n = 342.5, r = Ed(), i = this._langFocus ? this._langSel : this._langCur, a = this._langs.map((e) => {
			let i = Td(e.label, t.g4);
			if (i) {
				let t = Math.ceil(i.width * r);
				return {
					w: t,
					pw: Math.max(t + 18, Math.ceil(t / .56)),
					draw: (t, a, o) => F(t, Td(e.label, o), a, Math.round(n - i.height * r / 2), r, "lu-title__lang-glyphs")
				};
			}
			let a = L(e.label, "line");
			return {
				w: a,
				pw: Math.max(a + 18, Math.ceil(a / .56)),
				draw: (t, r, i) => {
					I(t, e.label, r, n, {
						font: "line",
						color: i,
						ol: !0
					});
				}
			};
		}), o = Ft("L"), s = o + 15 + a.reduce((e, t) => e + t.pw + 12, -12), c = 630 - s, l = qt(e, "br", c - 16, 318, s + 18, 32, "lu-title__lang");
		l.setAttribute("role", "radiogroup"), l.setAttribute("aria-label", R("title.language")), wt(l, "L", c, 337), c += o + 15, a.forEach((e, r) => {
			let o = r === i, s = kd(l, c, n - 13 / 2, e.pw, 13, `lu-title__lang-opt${o ? " is-lit" : ""}${r === this._langCur ? " is-current" : ""}`);
			s.dataset.index = String(r), s.dataset.lang = this._langs[r].code, s.setAttribute("role", "radio"), s.setAttribute("aria-checked", String(r === this._langCur)), s.setAttribute("aria-label", this._langs[r].label), o && F(s, at(e.pw, 13), c, 336);
			let u = o ? this._langFocus ? t.g5 : t.g4 : r === this._langCur ? t.g3 : t.tx3;
			e.draw(s, c + Math.floor((e.pw - e.w) / 2), u), o && this._langFocus && F(s, Nt("cursorGem"), c - 12, 338, 1, "nudge"), c += e.pw, r < a.length - 1 && (this._langFocus && r + 1 === i || F(l, V(3, 3, (e) => {
				e.px(1, 0, t.ink0), e.px(0, 1, t.ink0), e.px(2, 1, t.ink0), e.px(1, 2, t.ink0), e.px(1, 1, t.g3);
			}), c + 4, 341), c += 12);
		}), this._langFocus && Et(l, [
			{
				keys: ["←", "→"],
				label: R("title.language")
			},
			{
				keys: ["Enter"],
				label: R("title.langSwitch")
			},
			{
				keys: ["Esc"],
				label: R("title.langBack")
			}
		], 630, 322, {
			align: "right",
			color: t.tx2,
			ol: !0
		});
	}
}, jd = () => {
	let e = B();
	return {
		size: "S",
		notch: 3,
		corners: null,
		ends: !0,
		endR: 2,
		bands: [e.plate0, e.plate1],
		stops: [0, .5],
		sheen: !1
	};
}, Md = [
	6,
	12,
	18
], Nd = new D(), Pd = class {
	constructor(e = document.body) {
		ln("dialog") || rn("dialog", ql);
		let t = document.createElement("div");
		t.className = "lu-prompt", t.innerHTML = "\n      <div class=\"lu-prompt__anchor\">\n        <div class=\"lu-prompt__inner\">\n          <div class=\"lu-prompt__bubble g\" aria-hidden=\"true\"></div>\n          <div class=\"lu-prompt__label g\"></div>\n        </div>\n      </div>", e.appendChild(t), this.element = t, this._inner = t.querySelector(".lu-prompt__inner"), this._bubble = t.querySelector(".lu-prompt__bubble"), this._label = t.querySelector(".lu-prompt__label"), this._parent = e;
		let n = B();
		F(this._bubble, Xt(), 0, 0), Md.forEach((e, t) => {
			let r = V(2, 2, (e) => e.rect(0, 0, 2, 2, n.kf1));
			F(this._bubble, r, e, 6, 1, `lu-prompt__dot lu-prompt__dot${t + 1}`);
		}), this.keyHint = null, this._shown = !1, this._inView = !1, this._target = null, this._pos = new D(), this._offsetY = 0, this._labelText = null, this._keyText = null, this._x = NaN, this._y = NaN, this._w = e.clientWidth || window.innerWidth, this._h = e.clientHeight || window.innerHeight, this._ensureSeq = 0, this._layout(), this._ro = typeof ResizeObserver < "u" ? new ResizeObserver(() => {
			this._w = e.clientWidth || window.innerWidth, this._h = e.clientHeight || window.innerHeight, this._x = NaN;
		}) : null, this._ro && this._ro.observe(e), this._offScale = lt(e, () => {
			this._x = NaN, this._layout();
		});
	}
	get visible() {
		return this._shown;
	}
	show(e, t = R("dialog.prompt.talk"), { offsetY: n = 0, key: r } = {}) {
		e && e.isObject3D ? (this._target !== e && this._shown && this._repop(), this._target = e) : (this._target = null, e && this._pos.copy(e)), this._offsetY = n;
		let i = r === void 0 ? this.keyHint : r;
		(t !== this._labelText || i !== this._keyText) && (this._labelText = t, this._keyText = i, this._layout(), this._ensureFonts()), this._shown || (this._shown = !0, this._x = NaN, this.element.classList.add("is-on"));
	}
	hide() {
		this._shown && (this._shown = !1, this._inView = !1, this.element.classList.remove("is-on", "is-inview"));
	}
	update(e) {
		if (!this._shown || !e) return;
		this._target ? this._target.getWorldPosition(Nd) : Nd.copy(this._pos), Nd.y += this._offsetY || 0, e.updateMatrixWorld(), Nd.applyMatrix4(e.matrixWorldInverse);
		let t = Nd.z > -(e.near ?? .01);
		Nd.applyMatrix4(e.projectionMatrix);
		let n = !t && Nd.x > -1.08 && Nd.x < 1.08 && Nd.y > -1.08 && Nd.y < 1.12;
		if (n !== this._inView && (this._inView = n, this.element.classList.toggle("is-inview", n)), !n) return;
		let r = tn(this._parent)?.dpr || window.devicePixelRatio || 1, i = Math.round((Nd.x * .5 + .5) * this._w * r) / r, a = Math.round((-Nd.y * .5 + .5) * this._h * r) / r;
		(i !== this._x || a !== this._y) && (this._x = i, this._y = a, this.element.style.transform = `translate3d(${i}px,${a}px,0)`);
	}
	dispose() {
		this._ro && this._ro.disconnect(), this._offScale(), this.element.remove();
	}
	_repop() {
		let e = this._inner;
		e.style.animation = "none", e.offsetWidth, e.style.animation = "";
	}
	_ensureFonts() {
		let e = We(), t = this._labelText;
		if (!e || !t) return;
		let n = ++this._ensureSeq;
		e.ensure(t).then(() => {
			n === this._ensureSeq && this._labelText === t && this._layout();
		});
	}
	_layout() {
		let e = B(), t = this._label;
		t.replaceChildren();
		let n = this._labelText || "", r = this._keyText || "", i = -2;
		if (n || r) {
			let a = r ? Ft(r) : 0, o = n ? L(n, "line") : 0, s = 2 * Math.ceil(gt("line") / 2), c = 5 + a + (r && n ? 3 : 0) + o + 5, l = 15 + s, u = -Math.floor(c / 2), d = -2 - l;
			Bt(t, u, d, c, l), It(t, [u, d]), _t(t, jd(), u, d, c, l), r && wt(t, r, u + 5, d + 2 + s / 2), n && P(t, n, u + 5 + (r ? a + 3 : 0), d + 3 + s / 2, {
				font: "line",
				color: e.tx1,
				drop: !0,
				cls: "lu-prompt__text"
			}), i = d - 2;
		}
		Bt(this._bubble, -12, i - 18, 24, 18);
	}
}, Fd = class {
	constructor(e = document.body) {
		let t = document.createElement("div");
		t.className = "lu-fader", t.style.transitionProperty = "opacity, background-color", e.appendChild(t), this.element = t, this._opacity = 0, this._color = "#000", this._timer = 0, this._resolve = null;
	}
	get opacity() {
		return this._opacity;
	}
	get busy() {
		return !!this._resolve;
	}
	get color() {
		return this._color;
	}
	fadeOut(e = .6, t = "#000") {
		return this._fadeTo(1, e, t);
	}
	fadeIn(e = .6) {
		return this._fadeTo(0, e, null);
	}
	set(e, t) {
		this._settle(), clearTimeout(this._timer), this._opacity = e;
		let n = this.element;
		n.style.transitionDuration = "0s", t && (n.style.backgroundColor = t, this._color = t), n.style.opacity = String(e), n.offsetWidth;
	}
	dispose() {
		clearTimeout(this._timer), this._settle(), this.element.remove();
	}
	_fadeTo(e, t, n) {
		this._settle(), clearTimeout(this._timer);
		let r = this.element, i = Math.max(0, Number(t) || 0), a = getComputedStyle(r), o = a.opacity, s = a.backgroundColor, c = !(parseFloat(o) >= .01);
		return r.style.transitionDuration = "0s", r.style.opacity = o, n && (r.style.backgroundColor = c ? n : s), r.offsetWidth, r.style.transitionDuration = `${i}s`, n && !c && (r.style.backgroundColor = n), r.style.opacity = String(e), this._opacity = e, n && (this._color = n), new Promise((e) => {
			this._resolve = e, this._timer = setTimeout(() => this._settle(), i * 1e3 + 20);
		});
	}
	_settle() {
		let e = this._resolve;
		this._resolve = null, e && e();
	}
}, Id = class e {
	constructor(t, n, r, i, a = "div") {
		this.parent = t, this.object = n, this.property = r, this._disabled = !1, this._hidden = !1, this.initialValue = this.getValue(), this.domElement = document.createElement(a), this.domElement.classList.add("lil-controller"), this.domElement.classList.add(i), this.$name = document.createElement("div"), this.$name.classList.add("lil-name"), e.nextNameID = e.nextNameID || 0, this.$name.id = `lil-gui-name-${++e.nextNameID}`, this.$widget = document.createElement("div"), this.$widget.classList.add("lil-widget"), this.$disable = this.$widget, this.domElement.appendChild(this.$name), this.domElement.appendChild(this.$widget), this.domElement.addEventListener("keydown", (e) => e.stopPropagation()), this.domElement.addEventListener("keyup", (e) => e.stopPropagation()), this.parent.children.push(this), this.parent.controllers.push(this), this.parent.$children.appendChild(this.domElement), this._listenCallback = this._listenCallback.bind(this), this.name(r);
	}
	name(e) {
		return this._name = e, this.$name.textContent = e, this;
	}
	onChange(e) {
		return this._onChange = e, this;
	}
	_callOnChange() {
		this.parent._callOnChange(this), this._onChange !== void 0 && this._onChange.call(this, this.getValue()), this._changed = !0;
	}
	onFinishChange(e) {
		return this._onFinishChange = e, this;
	}
	_callOnFinishChange() {
		this._changed && (this.parent._callOnFinishChange(this), this._onFinishChange !== void 0 && this._onFinishChange.call(this, this.getValue())), this._changed = !1;
	}
	reset() {
		return this.setValue(this.initialValue), this._callOnFinishChange(), this;
	}
	enable(e = !0) {
		return this.disable(!e);
	}
	disable(e = !0) {
		return e === this._disabled ? this : (this._disabled = e, this.domElement.classList.toggle("lil-disabled", e), this.$disable.toggleAttribute("disabled", e), this);
	}
	show(e = !0) {
		return this._hidden = !e, this.domElement.style.display = this._hidden ? "none" : "", this;
	}
	hide() {
		return this.show(!1);
	}
	options(e) {
		let t = this.parent.add(this.object, this.property, e);
		return t.name(this._name), this.destroy(), t;
	}
	min(e) {
		return this;
	}
	max(e) {
		return this;
	}
	step(e) {
		return this;
	}
	decimals(e) {
		return this;
	}
	listen(e = !0) {
		return this._listening = e, this._listenCallbackID !== void 0 && (cancelAnimationFrame(this._listenCallbackID), this._listenCallbackID = void 0), this._listening && this._listenCallback(), this;
	}
	_listenCallback() {
		this._listenCallbackID = requestAnimationFrame(this._listenCallback);
		let e = this.save();
		e !== this._listenPrevValue && this.updateDisplay(), this._listenPrevValue = e;
	}
	getValue() {
		return this.object[this.property];
	}
	setValue(e) {
		return this.getValue() !== e && (this.object[this.property] = e, this._callOnChange(), this.updateDisplay()), this;
	}
	updateDisplay() {
		return this;
	}
	load(e) {
		return this.setValue(e), this._callOnFinishChange(), this;
	}
	save() {
		return this.getValue();
	}
	destroy() {
		this.listen(!1), this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.controllers.splice(this.parent.controllers.indexOf(this), 1), this.parent.$children.removeChild(this.domElement);
	}
}, Ld = class extends Id {
	constructor(e, t, n) {
		super(e, t, n, "lil-boolean", "label"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "checkbox"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$widget.appendChild(this.$input), this.$input.addEventListener("change", () => {
			this.setValue(this.$input.checked), this._callOnFinishChange();
		}), this.$disable = this.$input, this.updateDisplay();
	}
	updateDisplay() {
		return this.$input.checked = this.getValue(), this;
	}
};
function Rd(e) {
	let t, n;
	return (t = e.match(/(#|0x)?([a-f0-9]{6})/i)) ? n = t[2] : (t = e.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/)) ? n = parseInt(t[1]).toString(16).padStart(2, 0) + parseInt(t[2]).toString(16).padStart(2, 0) + parseInt(t[3]).toString(16).padStart(2, 0) : (t = e.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i)) && (n = t[1] + t[1] + t[2] + t[2] + t[3] + t[3]), n ? "#" + n : !1;
}
var zd = {
	isPrimitive: !0,
	match: (e) => typeof e == "string",
	fromHexString: Rd,
	toHexString: Rd
}, Bd = {
	isPrimitive: !0,
	match: (e) => typeof e == "number",
	fromHexString: (e) => parseInt(e.substring(1), 16),
	toHexString: (e) => "#" + e.toString(16).padStart(6, 0)
}, Vd = [
	zd,
	Bd,
	{
		isPrimitive: !1,
		match: (e) => Array.isArray(e) || ArrayBuffer.isView(e),
		fromHexString(e, t, n = 1) {
			let r = Bd.fromHexString(e);
			t[0] = (r >> 16 & 255) / 255 * n, t[1] = (r >> 8 & 255) / 255 * n, t[2] = (r & 255) / 255 * n;
		},
		toHexString([e, t, n], r = 1) {
			r = 255 / r;
			let i = e * r << 16 ^ t * r << 8 ^ n * r << 0;
			return Bd.toHexString(i);
		}
	},
	{
		isPrimitive: !1,
		match: (e) => Object(e) === e,
		fromHexString(e, t, n = 1) {
			let r = Bd.fromHexString(e);
			t.r = (r >> 16 & 255) / 255 * n, t.g = (r >> 8 & 255) / 255 * n, t.b = (r & 255) / 255 * n;
		},
		toHexString({ r: e, g: t, b: n }, r = 1) {
			r = 255 / r;
			let i = e * r << 16 ^ t * r << 8 ^ n * r << 0;
			return Bd.toHexString(i);
		}
	}
];
function Hd(e) {
	return Vd.find((t) => t.match(e));
}
var Ud = class extends Id {
	constructor(e, t, n, r) {
		super(e, t, n, "lil-color"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "color"), this.$input.setAttribute("tabindex", -1), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$text = document.createElement("input"), this.$text.setAttribute("type", "text"), this.$text.setAttribute("spellcheck", "false"), this.$text.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("lil-display"), this.$display.appendChild(this.$input), this.$widget.appendChild(this.$display), this.$widget.appendChild(this.$text), this._format = Hd(this.initialValue), this._rgbScale = r, this._initialValueHexString = this.save(), this._textFocused = !1, this.$input.addEventListener("input", () => {
			this._setValueFromHexString(this.$input.value);
		}), this.$input.addEventListener("blur", () => {
			this._callOnFinishChange();
		}), this.$text.addEventListener("input", () => {
			let e = Rd(this.$text.value);
			e && this._setValueFromHexString(e);
		}), this.$text.addEventListener("focus", () => {
			this._textFocused = !0, this.$text.select();
		}), this.$text.addEventListener("blur", () => {
			this._textFocused = !1, this.updateDisplay(), this._callOnFinishChange();
		}), this.$disable = this.$text, this.updateDisplay();
	}
	reset() {
		return this._setValueFromHexString(this._initialValueHexString), this;
	}
	_setValueFromHexString(e) {
		if (this._format.isPrimitive) {
			let t = this._format.fromHexString(e);
			this.setValue(t);
		} else this._format.fromHexString(e, this.getValue(), this._rgbScale), this._callOnChange(), this.updateDisplay();
	}
	save() {
		return this._format.toHexString(this.getValue(), this._rgbScale);
	}
	load(e) {
		return this._setValueFromHexString(e), this._callOnFinishChange(), this;
	}
	updateDisplay() {
		return this.$input.value = this._format.toHexString(this.getValue(), this._rgbScale), this._textFocused || (this.$text.value = this.$input.value.substring(1)), this.$display.style.backgroundColor = this.$input.value, this;
	}
}, Wd = class extends Id {
	constructor(e, t, n) {
		super(e, t, n, "lil-function"), this.$button = document.createElement("button"), this.$button.appendChild(this.$name), this.$widget.appendChild(this.$button), this.$button.addEventListener("click", (e) => {
			e.preventDefault(), this.getValue().call(this.object), this._callOnChange();
		}), this.$button.addEventListener("touchstart", () => {}, { passive: !0 }), this.$disable = this.$button;
	}
}, Gd = class extends Id {
	constructor(e, t, n, r, i, a) {
		super(e, t, n, "lil-number"), this._initInput(), this.min(r), this.max(i);
		let o = a !== void 0;
		this.step(o ? a : this._getImplicitStep(), o), this.updateDisplay();
	}
	decimals(e) {
		return this._decimals = e, this.updateDisplay(), this;
	}
	min(e) {
		return this._min = e, this._onUpdateMinMax(), this;
	}
	max(e) {
		return this._max = e, this._onUpdateMinMax(), this;
	}
	step(e, t = !0) {
		return this._step = e, this._stepExplicit = t, this;
	}
	updateDisplay() {
		let e = this.getValue();
		if (this._hasSlider) {
			let t = (e - this._min) / (this._max - this._min);
			t = Math.max(0, Math.min(t, 1)), this.$fill.style.width = t * 100 + "%";
		}
		return this._inputFocused || (this.$input.value = this._decimals === void 0 ? e : e.toFixed(this._decimals)), this;
	}
	_initInput() {
		this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("aria-labelledby", this.$name.id), window.matchMedia("(pointer: coarse)").matches && (this.$input.setAttribute("type", "number"), this.$input.setAttribute("step", "any")), this.$widget.appendChild(this.$input), this.$disable = this.$input;
		let e = () => {
			let e = parseFloat(this.$input.value);
			isNaN(e) || (this._stepExplicit && (e = this._snap(e)), this.setValue(this._clamp(e)));
		}, t = (e) => {
			let t = parseFloat(this.$input.value);
			isNaN(t) || (this._snapClampSetValue(t + e), this.$input.value = this.getValue());
		}, n = (e) => {
			e.key === "Enter" && this.$input.blur(), e.code === "ArrowUp" && (e.preventDefault(), t(this._step * this._arrowKeyMultiplier(e))), e.code === "ArrowDown" && (e.preventDefault(), t(this._step * this._arrowKeyMultiplier(e) * -1));
		}, r = (e) => {
			this._inputFocused && (e.preventDefault(), t(this._step * this._normalizeMouseWheel(e)));
		}, i = !1, a, o, s, c, l, u = (e) => {
			a = e.clientX, o = s = e.clientY, i = !0, c = this.getValue(), l = 0, window.addEventListener("mousemove", d), window.addEventListener("mouseup", f);
		}, d = (e) => {
			if (i) {
				let t = e.clientX - a, n = e.clientY - o;
				Math.abs(n) > 5 ? (e.preventDefault(), this.$input.blur(), i = !1, this._setDraggingStyle(!0, "vertical")) : Math.abs(t) > 5 && f();
			}
			if (!i) {
				let t = e.clientY - s;
				l -= t * this._step * this._arrowKeyMultiplier(e), c + l > this._max ? l = this._max - c : c + l < this._min && (l = this._min - c), this._snapClampSetValue(c + l);
			}
			s = e.clientY;
		}, f = () => {
			this._setDraggingStyle(!1, "vertical"), this._callOnFinishChange(), window.removeEventListener("mousemove", d), window.removeEventListener("mouseup", f);
		};
		this.$input.addEventListener("input", e), this.$input.addEventListener("keydown", n), this.$input.addEventListener("wheel", r, { passive: !1 }), this.$input.addEventListener("mousedown", u), this.$input.addEventListener("focus", () => {
			this._inputFocused = !0;
		}), this.$input.addEventListener("blur", () => {
			this._inputFocused = !1, this.updateDisplay(), this._callOnFinishChange();
		});
	}
	_initSlider() {
		this._hasSlider = !0, this.$slider = document.createElement("div"), this.$slider.classList.add("lil-slider"), this.$fill = document.createElement("div"), this.$fill.classList.add("lil-fill"), this.$slider.appendChild(this.$fill), this.$widget.insertBefore(this.$slider, this.$input), this.domElement.classList.add("lil-has-slider");
		let e = (e, t, n, r, i) => (e - t) / (n - t) * (i - r) + r, t = (t) => {
			let n = this.$slider.getBoundingClientRect(), r = e(t, n.left, n.right, this._min, this._max);
			this._snapClampSetValue(r);
		}, n = (e) => {
			this._setDraggingStyle(!0), t(e.clientX), window.addEventListener("mousemove", r), window.addEventListener("mouseup", i);
		}, r = (e) => {
			t(e.clientX);
		}, i = () => {
			this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("mousemove", r), window.removeEventListener("mouseup", i);
		}, a = !1, o, s, c = (e) => {
			e.preventDefault(), this._setDraggingStyle(!0), t(e.touches[0].clientX), a = !1;
		}, l = (e) => {
			e.touches.length > 1 || (this._hasScrollBar ? (o = e.touches[0].clientX, s = e.touches[0].clientY, a = !0) : c(e), window.addEventListener("touchmove", u, { passive: !1 }), window.addEventListener("touchend", d));
		}, u = (e) => {
			if (a) {
				let t = e.touches[0].clientX - o, n = e.touches[0].clientY - s;
				Math.abs(t) > Math.abs(n) ? c(e) : (window.removeEventListener("touchmove", u), window.removeEventListener("touchend", d));
			} else e.preventDefault(), t(e.touches[0].clientX);
		}, d = () => {
			this._callOnFinishChange(), this._setDraggingStyle(!1), window.removeEventListener("touchmove", u), window.removeEventListener("touchend", d);
		}, f = this._callOnFinishChange.bind(this), p;
		this.$slider.addEventListener("mousedown", n), this.$slider.addEventListener("touchstart", l, { passive: !1 }), this.$slider.addEventListener("wheel", (e) => {
			if (Math.abs(e.deltaX) < Math.abs(e.deltaY) && this._hasScrollBar) return;
			e.preventDefault();
			let t = this._normalizeMouseWheel(e) * this._step;
			this._snapClampSetValue(this.getValue() + t), this.$input.value = this.getValue(), clearTimeout(p), p = setTimeout(f, 400);
		}, { passive: !1 });
	}
	_setDraggingStyle(e, t = "horizontal") {
		this.$slider && this.$slider.classList.toggle("lil-active", e), document.body.classList.toggle("lil-dragging", e), document.body.classList.toggle(`lil-${t}`, e);
	}
	_getImplicitStep() {
		return this._hasMin && this._hasMax ? (this._max - this._min) / 1e3 : .1;
	}
	_onUpdateMinMax() {
		!this._hasSlider && this._hasMin && this._hasMax && (this._stepExplicit || this.step(this._getImplicitStep(), !1), this._initSlider(), this.updateDisplay());
	}
	_normalizeMouseWheel(e) {
		let { deltaX: t, deltaY: n } = e;
		return Math.floor(e.deltaY) !== e.deltaY && e.wheelDelta && (t = 0, n = -e.wheelDelta / 120, n *= this._stepExplicit ? 1 : 10), t + -n;
	}
	_arrowKeyMultiplier(e) {
		let t = this._stepExplicit ? 1 : 10;
		return e.shiftKey ? t *= 10 : e.altKey && (t /= 10), t;
	}
	_snap(e) {
		let t = 0;
		return this._hasMin ? t = this._min : this._hasMax && (t = this._max), e -= t, e = Math.round(e / this._step) * this._step, e += t, e = parseFloat(e.toPrecision(15)), e;
	}
	_clamp(e) {
		return e < this._min && (e = this._min), e > this._max && (e = this._max), e;
	}
	_snapClampSetValue(e) {
		this.setValue(this._clamp(this._snap(e)));
	}
	get _hasScrollBar() {
		let e = this.parent.root.$children;
		return e.scrollHeight > e.clientHeight;
	}
	get _hasMin() {
		return this._min !== void 0;
	}
	get _hasMax() {
		return this._max !== void 0;
	}
}, Kd = class extends Id {
	constructor(e, t, n, r) {
		super(e, t, n, "lil-option"), this.$select = document.createElement("select"), this.$select.setAttribute("aria-labelledby", this.$name.id), this.$display = document.createElement("div"), this.$display.classList.add("lil-display"), this.$select.addEventListener("change", () => {
			this.setValue(this._values[this.$select.selectedIndex]), this._callOnFinishChange();
		}), this.$select.addEventListener("focus", () => {
			this.$display.classList.add("lil-focus");
		}), this.$select.addEventListener("blur", () => {
			this.$display.classList.remove("lil-focus");
		}), this.$widget.appendChild(this.$select), this.$widget.appendChild(this.$display), this.$disable = this.$select, this.options(r);
	}
	options(e) {
		return this._values = Array.isArray(e) ? e : Object.values(e), this._names = Array.isArray(e) ? e : Object.keys(e), this.$select.replaceChildren(), this._names.forEach((e) => {
			let t = document.createElement("option");
			t.textContent = e, this.$select.appendChild(t);
		}), this.updateDisplay(), this;
	}
	updateDisplay() {
		let e = this.getValue(), t = this._values.indexOf(e);
		return this.$select.selectedIndex = t, this.$display.textContent = t === -1 ? e : this._names[t], this;
	}
}, qd = class extends Id {
	constructor(e, t, n) {
		super(e, t, n, "lil-string"), this.$input = document.createElement("input"), this.$input.setAttribute("type", "text"), this.$input.setAttribute("spellcheck", "false"), this.$input.setAttribute("aria-labelledby", this.$name.id), this.$input.addEventListener("input", () => {
			this.setValue(this.$input.value);
		}), this.$input.addEventListener("keydown", (e) => {
			e.code === "Enter" && this.$input.blur();
		}), this.$input.addEventListener("blur", () => {
			this._callOnFinishChange();
		}), this.$widget.appendChild(this.$input), this.$disable = this.$input, this.updateDisplay();
	}
	updateDisplay() {
		return this.$input.value = this.getValue(), this;
	}
}, Jd = ".lil-gui {\n  font-family: var(--font-family);\n  font-size: var(--font-size);\n  line-height: 1;\n  font-weight: normal;\n  font-style: normal;\n  text-align: left;\n  color: var(--text-color);\n  user-select: none;\n  -webkit-user-select: none;\n  touch-action: manipulation;\n  --background-color: #1f1f1f;\n  --text-color: #ebebeb;\n  --title-background-color: #111111;\n  --title-text-color: #ebebeb;\n  --widget-color: #424242;\n  --hover-color: #4f4f4f;\n  --focus-color: #595959;\n  --number-color: #2cc9ff;\n  --string-color: #a2db3c;\n  --font-size: 11px;\n  --input-font-size: 11px;\n  --font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Arial, sans-serif;\n  --font-family-mono: Menlo, Monaco, Consolas, \"Droid Sans Mono\", monospace;\n  --padding: 4px;\n  --spacing: 4px;\n  --widget-height: 20px;\n  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);\n  --name-width: 45%;\n  --slider-knob-width: 2px;\n  --slider-input-width: 27%;\n  --color-input-width: 27%;\n  --slider-input-min-width: 45px;\n  --color-input-min-width: 45px;\n  --folder-indent: 7px;\n  --widget-padding: 0 0 0 3px;\n  --widget-border-radius: 2px;\n  --checkbox-size: calc(0.75 * var(--widget-height));\n  --scrollbar-width: 5px;\n}\n.lil-gui, .lil-gui * {\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n}\n.lil-gui.lil-root {\n  width: var(--width, 245px);\n  display: flex;\n  flex-direction: column;\n  background: var(--background-color);\n}\n.lil-gui.lil-root > .lil-title {\n  background: var(--title-background-color);\n  color: var(--title-text-color);\n}\n.lil-gui.lil-root > .lil-children {\n  overflow-x: hidden;\n  overflow-y: auto;\n}\n.lil-gui.lil-root > .lil-children::-webkit-scrollbar {\n  width: var(--scrollbar-width);\n  height: var(--scrollbar-width);\n  background: var(--background-color);\n}\n.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {\n  border-radius: var(--scrollbar-width);\n  background: var(--focus-color);\n}\n@media (pointer: coarse) {\n  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {\n    --widget-height: 28px;\n    --padding: 6px;\n    --spacing: 6px;\n    --font-size: 13px;\n    --input-font-size: 16px;\n    --folder-indent: 10px;\n    --scrollbar-width: 7px;\n    --slider-input-min-width: 50px;\n    --color-input-min-width: 65px;\n  }\n}\n.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {\n  --widget-height: 28px;\n  --padding: 6px;\n  --spacing: 6px;\n  --font-size: 13px;\n  --input-font-size: 16px;\n  --folder-indent: 10px;\n  --scrollbar-width: 7px;\n  --slider-input-min-width: 50px;\n  --color-input-min-width: 65px;\n}\n.lil-gui.lil-auto-place, .lil-gui.autoPlace {\n  max-height: 100%;\n  position: fixed;\n  top: 0;\n  right: 15px;\n  z-index: 1001;\n}\n\n.lil-controller {\n  display: flex;\n  align-items: center;\n  padding: 0 var(--padding);\n  margin: var(--spacing) 0;\n}\n.lil-controller.lil-disabled {\n  opacity: 0.5;\n}\n.lil-controller.lil-disabled, .lil-controller.lil-disabled * {\n  pointer-events: none !important;\n}\n.lil-controller > .lil-name {\n  min-width: var(--name-width);\n  flex-shrink: 0;\n  white-space: pre;\n  padding-right: var(--spacing);\n  line-height: var(--widget-height);\n}\n.lil-controller .lil-widget {\n  position: relative;\n  display: flex;\n  align-items: center;\n  width: 100%;\n  min-height: var(--widget-height);\n}\n.lil-controller.lil-string input {\n  color: var(--string-color);\n}\n.lil-controller.lil-boolean {\n  cursor: pointer;\n}\n.lil-controller.lil-color .lil-display {\n  width: 100%;\n  height: var(--widget-height);\n  border-radius: var(--widget-border-radius);\n  position: relative;\n}\n@media (hover: hover) {\n  .lil-controller.lil-color .lil-display:hover:before {\n    content: \" \";\n    display: block;\n    position: absolute;\n    border-radius: var(--widget-border-radius);\n    border: 1px solid #fff9;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n  }\n}\n.lil-controller.lil-color input[type=color] {\n  opacity: 0;\n  width: 100%;\n  height: 100%;\n  cursor: pointer;\n}\n.lil-controller.lil-color input[type=text] {\n  margin-left: var(--spacing);\n  font-family: var(--font-family-mono);\n  min-width: var(--color-input-min-width);\n  width: var(--color-input-width);\n  flex-shrink: 0;\n}\n.lil-controller.lil-option select {\n  opacity: 0;\n  position: absolute;\n  width: 100%;\n  max-width: 100%;\n}\n.lil-controller.lil-option .lil-display {\n  position: relative;\n  pointer-events: none;\n  border-radius: var(--widget-border-radius);\n  height: var(--widget-height);\n  line-height: var(--widget-height);\n  max-width: 100%;\n  overflow: hidden;\n  word-break: break-all;\n  padding-left: 0.55em;\n  padding-right: 1.75em;\n  background: var(--widget-color);\n}\n@media (hover: hover) {\n  .lil-controller.lil-option .lil-display.lil-focus {\n    background: var(--focus-color);\n  }\n}\n.lil-controller.lil-option .lil-display.lil-active {\n  background: var(--focus-color);\n}\n.lil-controller.lil-option .lil-display:after {\n  font-family: \"lil-gui\";\n  content: \"↕\";\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  padding-right: 0.375em;\n}\n.lil-controller.lil-option .lil-widget,\n.lil-controller.lil-option select {\n  cursor: pointer;\n}\n@media (hover: hover) {\n  .lil-controller.lil-option .lil-widget:hover .lil-display {\n    background: var(--hover-color);\n  }\n}\n.lil-controller.lil-number input {\n  color: var(--number-color);\n}\n.lil-controller.lil-number.lil-has-slider input {\n  margin-left: var(--spacing);\n  width: var(--slider-input-width);\n  min-width: var(--slider-input-min-width);\n  flex-shrink: 0;\n}\n.lil-controller.lil-number .lil-slider {\n  width: 100%;\n  height: var(--widget-height);\n  background: var(--widget-color);\n  border-radius: var(--widget-border-radius);\n  padding-right: var(--slider-knob-width);\n  overflow: hidden;\n  cursor: ew-resize;\n  touch-action: pan-y;\n}\n@media (hover: hover) {\n  .lil-controller.lil-number .lil-slider:hover {\n    background: var(--hover-color);\n  }\n}\n.lil-controller.lil-number .lil-slider.lil-active {\n  background: var(--focus-color);\n}\n.lil-controller.lil-number .lil-slider.lil-active .lil-fill {\n  opacity: 0.95;\n}\n.lil-controller.lil-number .lil-fill {\n  height: 100%;\n  border-right: var(--slider-knob-width) solid var(--number-color);\n  box-sizing: content-box;\n}\n\n.lil-dragging .lil-gui {\n  --hover-color: var(--widget-color);\n}\n.lil-dragging * {\n  cursor: ew-resize !important;\n}\n.lil-dragging.lil-vertical * {\n  cursor: ns-resize !important;\n}\n\n.lil-gui .lil-title {\n  height: var(--title-height);\n  font-weight: 600;\n  padding: 0 var(--padding);\n  width: 100%;\n  text-align: left;\n  background: none;\n  text-decoration-skip: objects;\n}\n.lil-gui .lil-title:before {\n  font-family: \"lil-gui\";\n  content: \"▾\";\n  padding-right: 2px;\n  display: inline-block;\n}\n.lil-gui .lil-title:active {\n  background: var(--title-background-color);\n  opacity: 0.75;\n}\n@media (hover: hover) {\n  body:not(.lil-dragging) .lil-gui .lil-title:hover {\n    background: var(--title-background-color);\n    opacity: 0.85;\n  }\n  .lil-gui .lil-title:focus {\n    text-decoration: underline var(--focus-color);\n  }\n}\n.lil-gui.lil-root > .lil-title:focus {\n  text-decoration: none !important;\n}\n.lil-gui.lil-closed > .lil-title:before {\n  content: \"▸\";\n}\n.lil-gui.lil-closed > .lil-children {\n  transform: translateY(-7px);\n  opacity: 0;\n}\n.lil-gui.lil-closed:not(.lil-transition) > .lil-children {\n  display: none;\n}\n.lil-gui.lil-transition > .lil-children {\n  transition-duration: 300ms;\n  transition-property: height, opacity, transform;\n  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);\n  overflow: hidden;\n  pointer-events: none;\n}\n.lil-gui .lil-children:empty:before {\n  content: \"Empty\";\n  padding: 0 var(--padding);\n  margin: var(--spacing) 0;\n  display: block;\n  height: var(--widget-height);\n  font-style: italic;\n  line-height: var(--widget-height);\n  opacity: 0.5;\n}\n.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {\n  border: 0 solid var(--widget-color);\n  border-width: 1px 0;\n  transition: border-color 300ms;\n}\n.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {\n  border-bottom-color: transparent;\n}\n.lil-gui + .lil-controller {\n  border-top: 1px solid var(--widget-color);\n  margin-top: 0;\n  padding-top: var(--spacing);\n}\n.lil-gui .lil-gui .lil-gui > .lil-title {\n  border: none;\n}\n.lil-gui .lil-gui .lil-gui > .lil-children {\n  border: none;\n  margin-left: var(--folder-indent);\n  border-left: 2px solid var(--widget-color);\n}\n.lil-gui .lil-gui .lil-controller {\n  border: none;\n}\n\n.lil-gui label, .lil-gui input, .lil-gui button {\n  -webkit-tap-highlight-color: transparent;\n}\n.lil-gui input {\n  border: 0;\n  outline: none;\n  font-family: var(--font-family);\n  font-size: var(--input-font-size);\n  border-radius: var(--widget-border-radius);\n  height: var(--widget-height);\n  background: var(--widget-color);\n  color: var(--text-color);\n  width: 100%;\n}\n@media (hover: hover) {\n  .lil-gui input:hover {\n    background: var(--hover-color);\n  }\n  .lil-gui input:active {\n    background: var(--focus-color);\n  }\n}\n.lil-gui input:disabled {\n  opacity: 1;\n}\n.lil-gui input[type=text],\n.lil-gui input[type=number] {\n  padding: var(--widget-padding);\n  -moz-appearance: textfield;\n}\n.lil-gui input[type=text]:focus,\n.lil-gui input[type=number]:focus {\n  background: var(--focus-color);\n}\n.lil-gui input[type=checkbox] {\n  appearance: none;\n  width: var(--checkbox-size);\n  height: var(--checkbox-size);\n  border-radius: var(--widget-border-radius);\n  text-align: center;\n  cursor: pointer;\n}\n.lil-gui input[type=checkbox]:checked:before {\n  font-family: \"lil-gui\";\n  content: \"✓\";\n  font-size: var(--checkbox-size);\n  line-height: var(--checkbox-size);\n}\n@media (hover: hover) {\n  .lil-gui input[type=checkbox]:focus {\n    box-shadow: inset 0 0 0 1px var(--focus-color);\n  }\n}\n.lil-gui button {\n  outline: none;\n  cursor: pointer;\n  font-family: var(--font-family);\n  font-size: var(--font-size);\n  color: var(--text-color);\n  width: 100%;\n  border: none;\n}\n.lil-gui .lil-controller button {\n  height: var(--widget-height);\n  text-transform: none;\n  background: var(--widget-color);\n  border-radius: var(--widget-border-radius);\n}\n@media (hover: hover) {\n  .lil-gui .lil-controller button:hover {\n    background: var(--hover-color);\n  }\n  .lil-gui .lil-controller button:focus {\n    box-shadow: inset 0 0 0 1px var(--focus-color);\n  }\n}\n.lil-gui .lil-controller button:active {\n  background: var(--focus-color);\n}\n\n@font-face {\n  font-family: \"lil-gui\";\n  src: url(\"data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=\") format(\"woff2\");\n}";
function Yd(e) {
	let t = document.createElement("style");
	t.innerHTML = e;
	let n = document.querySelector("head link[rel=stylesheet], head style");
	n ? document.head.insertBefore(t, n) : document.head.appendChild(t);
}
var Xd = !1, Zd = class e {
	constructor({ parent: e, autoPlace: t = e === void 0, container: n, width: r, title: i = "Controls", closeFolders: a = !1, injectStyles: o = !0, touchStyles: s = !0 } = {}) {
		if (this.parent = e, this.root = e ? e.root : this, this.children = [], this.controllers = [], this.folders = [], this._closed = !1, this._hidden = !1, this.domElement = document.createElement("div"), this.domElement.classList.add("lil-gui"), this.$title = document.createElement("button"), this.$title.classList.add("lil-title"), this.$title.setAttribute("aria-expanded", !0), this.$title.addEventListener("click", () => this.openAnimated(this._closed)), this.$title.addEventListener("touchstart", () => {}, { passive: !0 }), this.$children = document.createElement("div"), this.$children.classList.add("lil-children"), this.domElement.appendChild(this.$title), this.domElement.appendChild(this.$children), this.title(i), this.parent) {
			this.parent.children.push(this), this.parent.folders.push(this), this.parent.$children.appendChild(this.domElement);
			return;
		}
		this.domElement.classList.add("lil-root"), s && this.domElement.classList.add("lil-allow-touch-styles"), !Xd && o && (Yd(Jd), Xd = !0), n ? n.appendChild(this.domElement) : t && (this.domElement.classList.add("lil-auto-place", "autoPlace"), document.body.appendChild(this.domElement)), r && this.domElement.style.setProperty("--width", r + "px"), this._closeFolders = a;
	}
	add(e, t, n, r, i) {
		if (Object(n) === n) return new Kd(this, e, t, n);
		let a = e[t];
		switch (typeof a) {
			case "number": return new Gd(this, e, t, n, r, i);
			case "boolean": return new Ld(this, e, t);
			case "string": return new qd(this, e, t);
			case "function": return new Wd(this, e, t);
		}
		console.error("gui.add failed\n	property:", t, "\n	object:", e, "\n	value:", a);
	}
	addColor(e, t, n = 1) {
		return new Ud(this, e, t, n);
	}
	addFolder(t) {
		let n = new e({
			parent: this,
			title: t
		});
		return this.root._closeFolders && n.close(), n;
	}
	load(e, t = !0) {
		return e.controllers && this.controllers.forEach((t) => {
			t instanceof Wd || t._name in e.controllers && t.load(e.controllers[t._name]);
		}), t && e.folders && this.folders.forEach((t) => {
			t._title in e.folders && t.load(e.folders[t._title]);
		}), this;
	}
	save(e = !0) {
		let t = {
			controllers: {},
			folders: {}
		};
		return this.controllers.forEach((e) => {
			if (!(e instanceof Wd)) {
				if (e._name in t.controllers) throw Error(`Cannot save GUI with duplicate property "${e._name}"`);
				t.controllers[e._name] = e.save();
			}
		}), e && this.folders.forEach((e) => {
			if (e._title in t.folders) throw Error(`Cannot save GUI with duplicate folder "${e._title}"`);
			t.folders[e._title] = e.save();
		}), t;
	}
	open(e = !0) {
		return this._setClosed(!e), this.$title.setAttribute("aria-expanded", !this._closed), this.domElement.classList.toggle("lil-closed", this._closed), this;
	}
	close() {
		return this.open(!1);
	}
	_setClosed(e) {
		this._closed !== e && (this._closed = e, this._callOnOpenClose(this));
	}
	show(e = !0) {
		return this._hidden = !e, this.domElement.style.display = this._hidden ? "none" : "", this;
	}
	hide() {
		return this.show(!1);
	}
	openAnimated(e = !0) {
		return this._setClosed(!e), this.$title.setAttribute("aria-expanded", !this._closed), requestAnimationFrame(() => {
			let t = this.$children.clientHeight;
			this.$children.style.height = t + "px", this.domElement.classList.add("lil-transition");
			let n = (e) => {
				e.target === this.$children && (this.$children.style.height = "", this.domElement.classList.remove("lil-transition"), this.$children.removeEventListener("transitionend", n));
			};
			this.$children.addEventListener("transitionend", n);
			let r = e ? this.$children.scrollHeight : 0;
			this.domElement.classList.toggle("lil-closed", !e), requestAnimationFrame(() => {
				this.$children.style.height = r + "px";
			});
		}), this;
	}
	title(e) {
		return this._title = e, this.$title.textContent = e, this;
	}
	reset(e = !0) {
		return (e ? this.controllersRecursive() : this.controllers).forEach((e) => e.reset()), this;
	}
	onChange(e) {
		return this._onChange = e, this;
	}
	_callOnChange(e) {
		this.parent && this.parent._callOnChange(e), this._onChange !== void 0 && this._onChange.call(this, {
			object: e.object,
			property: e.property,
			value: e.getValue(),
			controller: e
		});
	}
	onFinishChange(e) {
		return this._onFinishChange = e, this;
	}
	_callOnFinishChange(e) {
		this.parent && this.parent._callOnFinishChange(e), this._onFinishChange !== void 0 && this._onFinishChange.call(this, {
			object: e.object,
			property: e.property,
			value: e.getValue(),
			controller: e
		});
	}
	onOpenClose(e) {
		return this._onOpenClose = e, this;
	}
	_callOnOpenClose(e) {
		this.parent && this.parent._callOnOpenClose(e), this._onOpenClose !== void 0 && this._onOpenClose.call(this, e);
	}
	destroy() {
		this.parent && (this.parent.children.splice(this.parent.children.indexOf(this), 1), this.parent.folders.splice(this.parent.folders.indexOf(this), 1)), this.domElement.parentElement && this.domElement.parentElement.removeChild(this.domElement), Array.from(this.children).forEach((e) => e.destroy());
	}
	controllersRecursive() {
		let e = Array.from(this.controllers);
		return this.folders.forEach((t) => {
			e = e.concat(t.controllersRecursive());
		}), e;
	}
	foldersRecursive() {
		let e = Array.from(this.folders);
		return this.folders.forEach((t) => {
			e = e.concat(t.foldersRecursive());
		}), e;
	}
}, Qd = 133, $d = 15, ef = 76;
function tf(e) {
	return e >= 1e6 ? `${(e / 1e6).toFixed(2)}M` : e >= 1e4 ? `${(e / 1e3).toFixed(1)}k` : String(Math.round(e));
}
var nf = class {
	constructor() {
		let e = document.createElement("div");
		e.className = "lu-stats", e.innerHTML = `
      <div class="lu-stats__head">
        <span class="lu-stats__fps">--</span><span class="lu-stats__unit">FPS</span>
        <span class="lu-stats__ms">-- ms</span>
      </div>
      <canvas class="lu-stats__graph" width="${Qd}" height="${$d}"></canvas>
      <div class="lu-stats__grid">
        <span class="lu-stats__k">Calls</span><span class="lu-stats__v" data-k="calls">0</span>
        <span class="lu-stats__k">Tris</span><span class="lu-stats__v" data-k="tris">0</span>
        <span class="lu-stats__k">Geom</span><span class="lu-stats__v" data-k="geo">0</span>
        <span class="lu-stats__k">Tex</span><span class="lu-stats__v" data-k="tex">0</span>
        <span class="lu-stats__k">Prog</span><span class="lu-stats__v" data-k="prog">0</span>
        <span class="lu-stats__k">Worst</span><span class="lu-stats__v" data-k="worst">0</span>
      </div>`, this.element = e, this._fpsEl = e.querySelector(".lu-stats__fps"), this._msEl = e.querySelector(".lu-stats__ms");
		let t = (t) => e.querySelector(`[data-k="${t}"]`).firstChild;
		this._t = {
			calls: t("calls"),
			tris: t("tris"),
			geo: t("geo"),
			tex: t("tex"),
			prog: t("prog"),
			worst: t("worst")
		}, this._canvas = e.querySelector("canvas"), this._ctx = this._canvas.getContext("2d"), this.interval = .25, this.visible = !1, this.fps = 0, this.frameMs = 0, this.calls = 0, this.triangles = 0, this._configured = /* @__PURE__ */ new WeakSet(), this._frames = 0, this._t0 = -1, this._worst = 0, this._history = new Float32Array(Qd), this._head = 0, this._last = -1, this._frameKey = "", this._frame = [];
	}
	layout() {
		let e = this.element, t = e.parentElement, n = tn(e);
		if (!t || !n || !(t.clientWidth > 0)) return;
		let r = Math.max(60, Math.floor(t.clientWidth / n.cssPx)), i = `${r}x${ef}`;
		if (i === this._frameKey) return;
		this._frameKey = i, e.style.width = `calc(var(--px) * ${r})`;
		for (let e of this._frame) e.remove();
		let { base: a, orn: o } = en({
			size: "XS",
			corners: z.gold(),
			cornerR: 2
		}, r, ef);
		this._frame = [a, o].filter(Boolean);
		for (let t of this._frame) t.classList.add("px", "g", t === a ? "frame" : "orn"), t.setAttribute("aria-hidden", "true"), Bt(t, -18, -18, t.width, t.height), e.insertBefore(t, e.firstChild);
	}
	update(e, t = 0) {
		if (e && e.info) {
			let t = e.info;
			this._configured.has(e) || (this._configured.add(e), t.autoReset = !1), this.calls = t.render.calls, this.triangles = t.render.triangles, this._geo = t.memory.geometries, this._tex = t.memory.textures, this._prog = t.programs ? t.programs.length : 0, t.reset();
		}
		let n = typeof performance < "u" ? performance.now() : this._last < 0 ? 0 : this._last + t * 1e3;
		if (this._t0 < 0) {
			this._t0 = n, this._last = n;
			return;
		}
		let r = n - this._last;
		this._last = n, r > this._worst && (this._worst = r), this._frames++;
		let i = n - this._t0;
		if (i < this.interval * 1e3) return;
		this.fps = this._frames * 1e3 / i, this.frameMs = i / this._frames, this._history[this._head] = this.fps, this._head = (this._head + 1) % Qd;
		let a = this._worst;
		this._frames = 0, this._t0 = n, this._worst = 0, this.visible && this._render(a);
	}
	_render(e) {
		let t = this.fps;
		this._fpsEl.textContent = t >= 100 ? t.toFixed(0) : t.toFixed(1), this._fpsEl.classList.toggle("is-mid", t < 50 && t >= 30), this._fpsEl.classList.toggle("is-low", t < 30), this._msEl.textContent = `${this.frameMs.toFixed(2)} ms`;
		let n = this._t;
		n.calls.nodeValue = tf(this.calls), n.tris.nodeValue = tf(this.triangles), n.geo.nodeValue = tf(this._geo ?? 0), n.tex.nodeValue = tf(this._tex ?? 0), n.prog.nodeValue = tf(this._prog ?? 0), n.worst.nodeValue = `${e.toFixed(0)}ms`;
		let r = this._ctx;
		r.clearRect(0, 0, Qd, $d), r.fillStyle = "rgba(232,207,138,0.16)";
		let i = $d - Math.round(60 / 75 * $d);
		r.fillRect(0, i, Qd, 1);
		for (let e = 0; e < Qd; e++) {
			let t = this._history[(this._head + e) % Qd];
			if (t <= 0) continue;
			let n = Math.max(1, Math.round(Math.min(t, 75) / 75 * $d));
			r.fillStyle = t >= 50 ? "#8c6a32" : t >= 30 ? "#c27e1a" : "#a8233a", r.fillRect(e, $d - n, 1, n), r.fillStyle = t >= 50 ? "#e8cf8a" : t >= 30 ? "#f08a3a" : "#f08a6a", r.fillRect(e, $d - n, 1, 1);
		}
	}
}, rf = class {
	constructor(e = document.body, { anchor: t = null, title: n = "Luminati · Debug" } = {}) {
		let r = document.createElement("div");
		r.className = "lu-debug is-hidden", e.appendChild(r), this.element = r, this._parent = e, this._anchor = t, this.stats = new nf(), r.appendChild(this.stats.element), this.gui = new Zd({
			container: r,
			title: n,
			width: 292
		}), this._visible = !1, this._onResize = () => {
			this._visible && this._place();
		}, window.addEventListener("resize", this._onResize), this.stats.layout();
	}
	get visible() {
		return this._visible;
	}
	set visible(e) {
		this._visible = !!e, this.stats.visible = this._visible, this.element.classList.toggle("is-hidden", !this._visible), this._visible && this._place(), this.syncListening();
	}
	syncListening() {
		for (let e of this.gui.controllersRecursive()) this._visible ? e._luPaused && (e._luPaused = !1, e.listen(!0)) : e._listening && (e._luPaused = !0, e.listen(!1));
	}
	toggle() {
		return this.visible = !this._visible, this._visible;
	}
	addFolder(e) {
		return this.gui.addFolder(e);
	}
	dispose() {
		window.removeEventListener("resize", this._onResize), this.gui.destroy(), this.element.remove();
	}
	_place() {
		this.stats.layout();
		let e = this._anchor;
		if (!e || !e.isConnected) return;
		let t = e.getBoundingClientRect();
		if (t.height <= 0) return;
		let n = this._parent.getBoundingClientRect();
		this.element.style.setProperty("--lu-debug-top", `calc(${Math.round(t.bottom - n.top)}px + var(--px) * 7)`);
	}
}, af = Object.freeze({
	x: 0,
	z: 1
}), of = (() => {
	let e = [
		.2,
		.35,
		.5,
		.65,
		.8
	], t = [];
	for (let n of e) for (let r of e) (n !== .5 || r !== .5) && t.push([n, r]);
	return t.sort((e, t) => Math.hypot(e[0] - .5, e[1] - .5) - Math.hypot(t[0] - .5, t[1] - .5) || e[1] - t[1] || e[0] - t[0]);
})(), sf = Object.freeze({
	fire: "campfire",
	door: "door",
	sign: "sign",
	well: "well",
	object: "object",
	waystone: "waystone",
	chest: "chest",
	boss: "boss"
}), cf = (e) => typeof e == "string" && Object.prototype.hasOwnProperty.call(sf, e) ? sf[e] : "object", lf = Object.freeze({
	campfire: 0,
	door: 0,
	sign: 0,
	well: 0,
	object: 0,
	waystone: 1,
	chest: 1,
	boss: 3
}), uf = Object.freeze([
	0,
	1,
	3
]), df = 554, ff = 50, pf = 76, mf = 70, hf = Object.freeze({
	size: "M",
	cornerR: 2,
	trio: !0,
	sides: !0,
	trioR: 2
}), gf = 7;
function _f(e, t, n, r, i, a) {
	let o = 4 + (On[i] ?? 2) + 2, s = e - n, c = t - r;
	Math.max(Math.abs(s), Math.abs(c)) < o && (Math.abs(s) >= Math.abs(c) ? e = n + (s < 0 ? -o : o) : t = r + (c < 0 ? -o : o)), a.x = e, a.y = t;
}
var vf = class {
	constructor(e, { anchor: t = null } = {}) {
		let n = B();
		this._parent = e;
		let r = qt(e, "tr", df, ff, pf, pf, "is-empty");
		r.className = `lu-minimap ${r.className}`, r.setAttribute("aria-hidden", "true"), _t(r, hf, df, ff, pf, pf);
		let i = V(mf, mf, () => {});
		i.classList.add("lu-minimap__canvas"), F(r, i, 557, 53), P(r, R("map.north"), 592, 53, {
			font: "tiny",
			color: n.g5,
			align: "center",
			ol: !0,
			cls: "lu-minimap__north"
		}).setAttribute("aria-hidden", "true"), this.element = r, this.canvas = i, this.ctx = i.getContext("2d"), this.ctx.imageSmoothingEnabled = !1, this.map = null, this.view = 34, this._enabled = !0, this._base = null, this._ppt = 2, this._edge = null, this._y = ff, this._at = {
			x: 0,
			y: 0
		}, this._anchor = t, this._place = () => this._placeBelowAnchor(), this._anchorRo = t && typeof ResizeObserver == "function" ? new ResizeObserver(this._place) : null, this._anchorRo?.observe(t), window.addEventListener("resize", this._place), this._offScale = lt(e, this._place);
	}
	_placeBelowAnchor() {
		let e = this._anchor, t = ff;
		if (e && e.isConnected && this._parent.isConnected) {
			let n = e.getBoundingClientRect();
			if (n.height > 0) {
				let e = tn(this._parent), r = (e?.cssPx ?? 2) * (e?.cornerShrink ?? 1), i = (n.bottom - this._parent.getBoundingClientRect().top) / r;
				i > 0 && i < 100 && (t = Math.max(ff, Math.ceil(i + gf)));
			}
		}
		t !== this._y && (this._y = t, this.element.style.top = N(t), It(this.element, [df, t]));
	}
	setMap(e, { view: t, level: n = null } = {}) {
		if (this.map = e, t && (this.view = t), this._ppt = Math.max(1, Math.min(6, Math.round(mf / this.view))), this._base = null, this._edge = null, e) {
			let t = n && Array.isArray(n.tiles) && n.width === e.width && n.depth === e.depth ? n : null;
			this._base = bf(e, t, this._ppt), this._edge = t ? B()["m-void"] : vn(e);
		}
		this._apply();
	}
	get enabled() {
		return this._enabled;
	}
	set enabled(e) {
		this._enabled = !!e, this._apply();
	}
	get visible() {
		return !!this.map && this._enabled;
	}
	_apply() {
		this.element.classList.toggle("is-empty", !this.visible), this.visible && requestAnimationFrame(this._place);
	}
	update(e) {
		if (!this.visible || !e?.player || !this._base) return;
		let { ctx: t } = this, n = mf, r = this._ppt, i = this._base, a = B(), o = e.player.x * r, s = e.player.z * r, c = i.width > n ? Math.max(0, Math.min(i.width - n, Math.round(o - n / 2))) : Math.round((i.width - n) / 2), l = i.height > n ? Math.max(0, Math.min(i.height - n, Math.round(s - n / 2))) : Math.round((i.height - n) / 2);
		i.width < n || i.height < n ? (t.fillStyle = this._edge ?? a["m-void"], t.fillRect(0, 0, n, n)) : t.clearRect(0, 0, n, n), t.drawImage(i, -c, -l), t.fillStyle = a["m-mute"], t.fillRect(0, 0, n, n);
		let u = Math.floor(o) - c, d = Math.floor(s) - l;
		e.view && (e.view.x || e.view.z) && t.drawImage(Sn(Math.atan2(e.view.x, -e.view.z), u, d), u - 24, d - 24), t.drawImage(Tn(n), 0, 0);
		let f = e.markers;
		for (let t of uf) {
			if (f) for (let e = 0; e < f.length; e++) {
				let n = f[e];
				if (n.hidden) continue;
				let i = cf(n.kind);
				lf[i] === t && this._mark(i, Math.floor(n.x * r) - c, Math.floor(n.z * r) - l, u, d);
			}
			if (t === 1) {
				let t = e.npcs;
				if (t) for (let e = 0; e < t.length; e++) this._mark("npc", Math.floor(t[e].x * r) - c, Math.floor(t[e].z * r) - l, u, d);
			}
		}
		let p = e.enemies;
		if (p) for (let e = 0; e < p.length; e++) this._mark("enemy", Math.floor(p[e].x * r) - c, Math.floor(p[e].z * r) - l, u, d);
		let m = e.party;
		if (m) for (let e = 0; e < m.length; e++) this._mark("party", Math.floor(m[e].x * r) - c, Math.floor(m[e].z * r) - l, u, d);
		let h = e.facing ?? af;
		t.drawImage(Cn(En(h.x, h.z)), u - 4, d - 4);
	}
	_mark(e, t, n, r, i) {
		let a = this._at;
		if (!(e !== "enemy" && (t < -8 || n < -8 || t > 78 || n > 78))) {
			if (_f(t, n, r, i, e, a), a.x < 3 || a.y < 3 || a.x > 66 || a.y > 66) {
				if (e !== "enemy") return;
				let t = Math.max(2, Math.min(67, a.x)), n = Math.max(2, Math.min(67, a.y));
				this.ctx.drawImage(Dn(), t - 1, n - 1);
				return;
			}
			this.ctx.drawImage(wn(e), a.x - 5, a.y - 5);
		}
	}
	dispose() {
		this._anchorRo?.disconnect(), window.removeEventListener("resize", this._place), this._offScale(), this.element.remove();
	}
}, yf = /* @__PURE__ */ new WeakMap();
function bf(e, t, n) {
	let r = yf.get(e.canvas);
	r || (r = /* @__PURE__ */ new Map(), yf.set(e.canvas, r));
	let i = `${t ? "level" : "painted"}|${n}`, a = r.get(i);
	return a || (a = t ? kn(t, n, { objects: !0 }) : bn(e, n), r.set(i, a)), a;
}
var $ = Object.freeze({
	padX: 26,
	headY: 17,
	ruleY: 29,
	top: 38,
	padB: 20,
	margin: 12,
	gap: 14,
	sock: 4,
	rowH: 13,
	keyGap: 4,
	maxScale: 8
}), xf = Object.freeze({
	size: "L",
	lattice: !0,
	beads: 6,
	trio: !0,
	sides: !0
}), Sf = () => ({
	size: "XS",
	socket: !0,
	tone: "dim",
	corners: null,
	fill: B().ink1,
	sheen: !1
}), Cf = () => $e() ? "small" : "name", wf = () => (Wt(), !$e() && dt.line.unit === .5 ? "line" : "small"), Tf = (e) => (Wt(), dt[e].ink * dt[e].unit);
function Ef(e, t, n, r) {
	let i = [], a = "";
	for (let o of String(e).split(/( |​)/)) {
		if (o === " " || o === "​") {
			a = o === " " ? " " : a;
			continue;
		}
		if (!o) continue;
		let e = i[i.length - 1];
		e != null && (L(`${e}${a}${o}`, t, 1) <= n || i.length >= r) ? i[i.length - 1] = `${e}${a}${o}` : i.push(o), a = "";
	}
	return i.length ? i : [String(e)];
}
var Df = /* @__PURE__ */ new Map();
function Of(e, t) {
	let n = `${e}x${t}`, r = Df.get(n);
	if (!r) {
		let i = B();
		r = Pt(e, t, tt(i.dim), (e, t) => .6 + .28 * Math.min(1, Math.hypot((e - .5) / .5, (t - .5) / .5) ** 1.6), [
			.6,
			.7,
			.8,
			.88
		]), Df.size > 4 && Df.delete(Df.keys().next().value), Df.set(n, r);
	}
	return V(r.width, r.height, (e) => e.ctx.drawImage(r, 0, 0));
}
function kf(e, t, n) {
	let r = document.createElement(t);
	return r.className = n, It(r, bt(e)), e.append(r), r;
}
var Af = Object.freeze({
	player: 2,
	waystone: 2,
	boss: 2
}), jf = 5, Mf = class {
	constructor(e) {
		let t = document.createElement("div");
		t.className = "lu-worldmap", t.setAttribute("aria-hidden", "true"), e.appendChild(t), this.element = t, this.canvas = V(1, 1, () => {}), this.canvas.classList.add("lu-worldmap__canvas"), this.ctx = this.canvas.getContext("2d"), this._baseCanvas = V(1, 1, () => {}), this._baseCtx = this._baseCanvas.getContext("2d"), this.map = null, this._origin = [0, 0], this._title = "", this._sub = "", this._regions = [], this._region = "", this._combat = !1, this._party = !1, this._open = !1, this._pulse = 0, this._scale = 1, this._mw = 1, this._md = 1, this._base = null, this._labelList = [], this._labels = null, this._ensured = /* @__PURE__ */ new Set(), this._lastStrings = null, this._mapBox = null, this._regionEl = null, this._built = !1, this._dirty = !0, this._obstacles = [], this._sigX = NaN, this._sigY = NaN, this._sigN = -1, this._disposed = !1, this._offScale = lt(e, () => this._invalidate());
	}
	get isOpen() {
		return this._open;
	}
	_invalidate() {
		this._dirty = !0, this._open && this._build();
	}
	setMap(e, { title: t = "", subtitle: n = "", regions: r = [], combat: i = !1, origin: a = [0, 0] } = {}) {
		this.map = e, this._origin = [Number(a?.[0]) || 0, Number(a?.[1]) || 0], this._combat = !!i, this._title = String(t ?? ""), this._sub = String(n ?? ""), this._regions = Array.isArray(r) ? r : [], this._obstacles = [], this._invalidate();
	}
	_setCombatLegend(e) {
		!!e !== this._combat && (this._combat = !!e, this._invalidate());
	}
	_setPartyLegend(e) {
		!!e !== this._party && (this._party = !!e, this._invalidate());
	}
	setRegion(e) {
		let t = String(e || "");
		t !== this._region && (this._region = t, this._invalidate());
	}
	_legendRows() {
		let e = [[
			"player",
			"player",
			R("map.legend.you")
		], [
			"npc",
			"npc",
			R("map.legend.villager")
		]];
		return this._party && e.push([
			"party",
			"party",
			R("map.legend.companion")
		]), e.push([
			"poi",
			"poi",
			R("map.legend.poi")
		], [
			"fire",
			"fire",
			R("map.legend.campfire")
		]), this._combat && e.push([
			"enemy",
			"enemy",
			R("map.legend.enemy")
		], [
			"waystone",
			"waystone",
			R("map.legend.waystone")
		], [
			"chest",
			"chest",
			R("map.legend.chest")
		]), e.push([
			"house",
			"house",
			R("map.legend.building")
		], [
			"road",
			"road",
			R("map.legend.road")
		], [
			"water",
			"water",
			R("map.legend.water")
		], [
			"forest",
			"forest",
			R("map.legend.forest")
		]), e;
	}
	_build() {
		if (this._disposed) return;
		let e = this.element;
		e.replaceChildren(), this._labelList = [], this._labels = null, this._built = !0, this._dirty = !1, this._sigX = NaN;
		let t = this.map;
		if (!t) return;
		let n = B(), r = tn(e), i = r?.artW ?? 640, a = r?.artH ?? 360, o = i - 2 * $.margin, s = a - 2 * $.margin;
		for (; o > 200 && St("mc", 320 - Math.floor(o / 2) - 20, 170, o + 40, 20, i, a) < 1;) o -= 2;
		for (; s > 120 && St("mc", 300, 180 - Math.floor(s / 2) - 20, 40, s + 40, i, a) < 1;) s -= 2;
		let c = et(R("map.title")), l = this._legendRows(), u = et(R("map.legend")), d = et(R("map.here")), f = R("map.close"), p = [
			c,
			this._title,
			this._sub,
			u,
			d,
			f,
			this._region,
			...l.map((e) => e[2]),
			...this._regions.map((e) => e?.name ?? "")
		];
		this._ensureFonts(p);
		let m = [{
			keys: [
				"N",
				"Tab",
				"Esc"
			],
			label: f
		}], h = m[0].keys.reduce((e, t) => e + Ft(t) + 2, 0) + 2 + L(f, "line"), g = Math.max(...l.map((e) => 11 + $.keyGap + L(e[2], "line"))), _ = Math.max(L(u, "small", 1), L(d, "small", 1)) + 24, v = this._region ? et(this._region) : "", y = v ? Math.max(0, ...Mt(v).map((e) => L(e, "name", 1))) : 0, b = Math.min(180, Math.max(Math.min(150, Math.max(92, g, h, _)), y)), x = v ? this._regionLines(v, b) : [], S = $e() ? dt.name.L : Math.ceil(20 * dt.name.unit), C = 9 + l.length * $.rowH + (x.length ? 10 + x.length * S : 0) + 10 + 11, w = o - 2 * $.padX - $.gap - b - 2 * $.sock, T = s - $.top - $.padB - 2 * $.sock, ee = Math.max(.05, Math.min(w / t.width, T / t.depth)), te = ee >= 1 ? Math.min($.maxScale, Math.floor(ee)) : ee, ne = Math.max(1, Math.round(t.width * te)), re = Math.max(1, Math.round(t.depth * te));
		this._scale = te, this._mw = ne, this._md = re, this._base = bn(t, te);
		let ie = L(c, "small", 1), E = this._title ? et(this._title) : "", ae = this._sub, oe = ne + 2 * $.sock, se = re + 2 * $.sock, ce = 2 * $.padX + oe + $.gap + b, le = (e, t) => ie + 16 + (e ? L(e, "head", 1) : 0) + (t ? 8 + L(t, "line") : 0), ue = le(E, ae) + 2 * $.padX;
		ue > ce && (ce = Math.min(o, ue));
		let de = ce - 2 * $.padX;
		le(E, ae) > de && ae && (ae = ht(ae, "line", Math.max(24, de - le(E, "") - 8))), le(E, ae) > de && E && (E = ht(E, "head", Math.max(24, de - ie - 16 - (ae ? 8 + L(ae, "line") : 0)), 1));
		let fe = Math.max(se, C), pe = $.top + fe + $.padB;
		F(e, Of(i, a), 0, 0, 1, "veil lu-worldmap__veil").setAttribute("aria-hidden", "true");
		let D = 320 - Math.floor(ce / 2), me = 180 - Math.floor(pe / 2), O = qt(e, "mc", D - 20, me - 20, ce + 40, pe + 40, "over lu-worldmap__window");
		O.setAttribute("role", "dialog"), O.setAttribute("aria-label", R("map.aria")), _t(O, xf, D, me, ce, pe);
		let he = D + $.padX, ge = D + ce - $.padX, _e = kf(O, "header", "lu-worldmap__head"), ve = me + $.headY;
		I(_e, c, he, ve, {
			font: "small",
			track: 1,
			color: n.g4,
			drop: !0,
			cls: "lu-worldmap__kicker"
		});
		let ye = he + ie + 5;
		if ((E || ae) && (F(_e, Ue(2), ye, ve - 3), ye += 11), E) {
			let e = I(_e, E, ye, ve, {
				font: "head",
				track: 1,
				color: n.tx1,
				drop: !0,
				cls: "lu-worldmap__title"
			});
			ye += e.tw + 8;
		}
		if (ae) {
			let e = E ? ve + (Tf("head") - Tf("line")) / 2 : ve;
			I(_e, ae, ye, e, {
				font: "line",
				color: n.g4,
				drop: !0,
				cls: "lu-worldmap__sub"
			});
		}
		F(_e, nt(ge - he, "both", n.dm1), he, me + $.ruleY);
		let be = kf(O, "div", "lu-worldmap__body"), xe = me + $.top, Se = he + Math.max(0, Math.floor((ge - b - $.gap - he - oe) / 2)), Ce = xe + Math.floor((fe - se) / 2), we = kf(be, "div", "lu-worldmap__frame");
		_t(we, Sf(), Se, Ce, oe, se);
		let Te = Se + $.sock, k = Ce + $.sock, A = document.createElement("div");
		A.className = "g lu-worldmap__map", Bt(A, Te - bt(O)[0], k - bt(O)[1], ne, re), It(A, [Te, k]), be.append(A), this._mapBox = A;
		let Ee = this._baseCanvas;
		Ee.width = ne, Ee.height = re, F(A, Ee, Te, k, 1, "lu-worldmap__base");
		let De = document.createElement("div");
		De.className = "lu-worldmap__labels", A.append(De), this._labels = De;
		let Oe = this.canvas;
		Oe.width = ne, Oe.height = re, F(A, Oe, Te, k), this._drawBase(), this._layoutLabels();
		let j = ge - b, ke = kf(be, "aside", "lu-worldmap__legend"), M = I(ke, u, j, xe + 2, {
			font: "small",
			track: 1,
			color: n.g4,
			drop: !0,
			cls: "lu-worldmap__legend-title"
		});
		F(ke, nt(b - M.tw - 6, "r"), j + M.tw + 5, xe + 2);
		let Ae = kf(ke, "ul", "lu-worldmap__keys"), je = xe + 9;
		for (let [e, t, r] of l) {
			let i = document.createElement("li");
			i.className = "g lu-worldmap__row", Bt(i, j - bt(Ae)[0], je - bt(Ae)[1]), It(i, [j, je]);
			let a = document.createElement("i");
			a.className = `g lu-wm-key lu-wm-key--${t}`, Bt(a, 0, 0, 11, 11);
			let o = xn(e);
			o.classList.add("lu-wm-key__art"), a.append(o), i.append(a), I(i, r, j + 11 + $.keyGap, je + 11 / 2, {
				font: "line",
				color: n.tx1,
				drop: !0
			}), Ae.append(i), je += $.rowH;
		}
		let Me = kf(ke, "div", "lu-worldmap__here");
		if (x.length) {
			let e = je + 4;
			At(Me, d, j, j + b, e);
			let t = e + 6, r = document.createElement("b");
			r.className = "lu-worldmap__region", It(r, bt(Me)), Me.append(r);
			for (let e of x) P(r, e, j, t, {
				font: "name",
				track: 1,
				color: n.g5,
				drop: !0
			}), t += S;
		} else {
			Me.style.display = "none";
			let e = document.createElement("b");
			e.className = "lu-worldmap__region", Me.append(e);
		}
		let Ne = kf(O, "footer", "lu-worldmap__foot");
		Et(Ne, m, ge, xe + fe - 11, {
			align: "right",
			color: n.tx2,
			drop: !0
		}), this._regionEl = Me.querySelector(".lu-worldmap__region");
	}
	_regionLines(e, t) {
		return Ef(e, "name", t, 3).map((e) => ht(e, "name", t, 1));
	}
	_ensureFonts(e) {
		let t = e.join("");
		if (this._ensured.has(t)) return;
		let n = We();
		n && (this._ensured.add(t), n.ensure(e).then(() => {
			!this._disposed && this._lastStrings && this._lastStrings === t && this._invalidate();
		}, () => {}), this._lastStrings = t);
	}
	_obstaclesFor(e, t, n) {
		let r = this._scale, [i, a] = this._origin, o = [{
			left: t - jf,
			right: t + jf + 1,
			top: n - jf,
			bottom: n + jf + 1,
			w: Af.player
		}], s = e?.markers;
		if (s) for (let e = 0; e < s.length; e++) {
			let t = s[e];
			if (!t || t.hidden || !Number.isFinite(t.x) || !Number.isFinite(t.z)) continue;
			let n = cf(t.kind), c = On[n] ?? 2, l = Math.floor((t.x + i) * r), u = Math.floor((t.z + a) * r);
			o.push({
				left: l - c,
				right: l + c + 1,
				top: u - c,
				bottom: u + c + 1,
				w: Object.prototype.hasOwnProperty.call(Af, n) ? Af[n] : 1
			});
		}
		return o;
	}
	_layoutLabels() {
		let e = this.map, t = this._labels;
		if (!e || !t) return;
		t.replaceChildren(), this._labelList = [];
		let n = B(), r = this._scale, i = this._mw, a = this._md, o = this._obstacles, s = [], c = /* @__PURE__ */ new Set();
		for (let e of this._regions) {
			let t = String(e?.name ?? "").trim();
			t && !c.has(t) && [
				e.minX,
				e.maxX,
				e.minZ,
				e.maxZ
			].every(Number.isFinite) && (c.add(t), s.push({
				name: t,
				r: e,
				x: (e.minX + e.maxX) / 2,
				z: (e.minZ + e.maxZ) / 2,
				size: Math.abs((e.maxX - e.minX) * (e.maxZ - e.minZ)),
				area: !1
			}));
		}
		for (let e of s) e.area = s.some((t) => t !== e && t.size < e.size && t.x > e.r.minX && t.x < e.r.maxX && t.z > e.r.minZ && t.z < e.r.maxZ);
		s.sort((e, t) => Number(e.area) - Number(t.area) || (e.area ? t.size - e.size : e.size - t.size));
		let l = [], u = (e) => l.some((t) => e.left < t.right + 2 && e.right > t.left - 2 && e.top < t.bottom + 2 && e.bottom > t.top - 2), d = (e) => {
			let t = 0;
			for (let n of o) e.left < n.right && e.right > n.left && e.top < n.bottom && e.bottom > n.top && n.w > t && (t = n.w);
			return t;
		}, f = (e, t, n, r, o) => {
			let s = [
				[0, 0],
				[0, r * .95],
				[0, -r * .95],
				[n * .35, -r * .5],
				[-n * .35, r * .5],
				[0, -r * 1.9],
				[0, r * 1.9],
				...o
			], c = [];
			for (let o = 0; o < s.length; o++) {
				let [l, f] = s[o], p = Math.round(e + l), m = Math.round(t + f), h = {
					left: p - Math.floor(n / 2),
					right: p - Math.floor(n / 2) + n,
					top: m - Math.ceil(r / 2),
					bottom: m - Math.ceil(r / 2) + r
				};
				h.left < -2 || h.right > i + 2 || h.top < -2 || h.bottom > a + 2 || u(h) || c.push({
					x: p,
					y: m,
					q: h,
					near: o < 3,
					w: d(h)
				});
			}
			return c.find((e) => e.near && e.w === 0) ?? c.find((e) => e.near && e.w < 2) ?? c.find((e) => e.near) ?? c.find((e) => e.w < 2) ?? c[0] ?? null;
		};
		for (let o of s) {
			let s = document.createElement("div");
			s.className = `g lu-worldmap__label${o.area ? " lu-worldmap__label--area" : ""}`, s._dim = !1, s._box = null, t.append(s), this._labelList.push(s);
			let c = Math.min(Math.max(o.x, 0), e.width) * r, u = Math.min(Math.max(o.z, 0), e.depth) * r;
			s._inside = of.map(([t, n]) => [(Math.min(Math.max(o.r.minX + (o.r.maxX - o.r.minX) * t, 0), e.width) * r - c) / i, (Math.min(Math.max(o.r.minZ + (o.r.maxZ - o.r.minZ) * n, 0), e.depth) * r - u) / a]);
			let d = s._inside.map(([e, t]) => [e * i, t * a]), p = et(o.name), m = o.area && !$e() ? 3 : 1, h = o.area ? n.g4 : n.tx1, g = Cf(), _ = Math.ceil(Tf(g)) + 2, v = f(c, u, L(p, g, m) + 2, _, d);
			if (v && (v.near || v.w < 2)) {
				l.push(v.q), I(s, p, v.x, v.y, {
					font: g,
					track: m,
					color: h,
					ol: !0,
					align: "center"
				}), s._box = v.q;
				continue;
			}
			let y = wf(), b = this._compactLines(p, 64, y), x = $e() ? dt.small.L : 8, S = f(c, u, Math.max(...b.map((e) => L(e, y, 1))) + 2, (b.length - 1) * x + Math.ceil(Tf(y)) + 2, d);
			if (v && !(S && S.w < 2)) {
				l.push(v.q), I(s, p, v.x, v.y, {
					font: g,
					track: m,
					color: h,
					ol: !0,
					align: "center"
				}), s._box = v.q;
				continue;
			}
			if (S) {
				l.push(S.q), s.classList.add("lu-worldmap__label--compact");
				let e = S.y - (b.length - 1) * x / 2;
				b.forEach((t, n) => I(s, t, S.x, e + n * x, {
					font: y,
					track: 1,
					color: h,
					ol: !0,
					align: "center"
				})), s._box = S.q;
				continue;
			}
			s.style.visibility = "hidden";
		}
	}
	_compactLines(e, t, n = wf()) {
		return Ef(e, n, t, 2);
	}
	_drawBase() {
		let e = this._baseCanvas, t = this._baseCtx;
		t.imageSmoothingEnabled = !1, t.clearRect(0, 0, e.width, e.height), this._base && t.drawImage(this._base, 0, 0), this.ctx.imageSmoothingEnabled = !1, this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	open() {
		return !this.map || this._open ? this._open : (this._open = !0, (this._dirty || !this._built) && this._build(), this.element.classList.add("is-open"), this.element.setAttribute("aria-hidden", "false"), !0);
	}
	close() {
		return this._open ? (this._open = !1, this.element.classList.remove("is-open"), this.element.setAttribute("aria-hidden", "true"), !1) : !1;
	}
	toggle() {
		return this._open ? this.close() : this.open();
	}
	update(e, t) {
		if (!this._open || !this.map || !this._base) return;
		this._pulse = (this._pulse + e) % 1.6;
		let n = this.ctx;
		if (!t?.player) {
			n.clearRect(0, 0, this.canvas.width, this.canvas.height);
			return;
		}
		let r = t.party, i = r ? r.length : 0;
		i > 0 !== this._party && this._setPartyLegend(i > 0), n.clearRect(0, 0, this.canvas.width, this.canvas.height);
		let a = this._scale, [o, s] = this._origin, c = Math.floor((t.player.x + o) * a), l = Math.floor((t.player.z + s) * a), u = t.markers, d = 0;
		if (u) for (let e = 0; e < u.length; e++) u[e].hidden || d++;
		(c !== this._sigX || l !== this._sigY || d !== this._sigN) && (this._sigX = c, this._sigY = l, this._sigN = d, this._obstacles = this._obstaclesFor(t, c, l), this._layoutLabels());
		let f = (e, t, r) => {
			n.drawImage(wn(e), Math.floor((t + o) * a) - 5, Math.floor((r + s) * a) - 5);
		};
		for (let e of uf) {
			if (u) for (let t = 0; t < u.length; t++) {
				let n = u[t];
				if (n.hidden) continue;
				let r = cf(n.kind);
				lf[r] === e && f(r, n.x, n.z);
			}
			if (e === 1) {
				let e = t.npcs;
				if (e) for (let t = 0; t < e.length; t++) f("npc", e[t].x, e[t].z);
			}
		}
		let p = t.enemies;
		if (p) for (let e = 0; e < p.length; e++) f("enemy", p[e].x, p[e].z);
		for (let e = 0; e < i; e++) f("party", r[e].x, r[e].z);
		for (let e of this._labelList) {
			let t = e._box, n = !!t && c > t.left - 6 && c < t.right + 6 && l > t.top - 6 && l < t.bottom + 6;
			n !== e._dim && (e._dim = n, e.style.opacity = n ? "0.3" : "");
		}
		let m = this._pulse / 1.6, h = Math.min(4, Math.floor(m * 5)), g = yn(5 + h * 2);
		n.globalAlpha = [
			.9,
			.7,
			.5,
			.32,
			.16
		][h], n.drawImage(g, c - (g.width >> 1), l - (g.height >> 1)), n.globalAlpha = 1;
		let _ = t.facing ?? af;
		n.drawImage(Cn(En(_.x, _.z)), c - 4, l - 4);
	}
	dispose() {
		this._disposed = !0, this._offScale(), this.element.remove();
	}
}, { MAIN: Nf, ACCENT: Pf, pal: Ff } = jt, If = {
	whirl: {
		palette: Ff(Nf.STEEL, Pf.WIND),
		rows: [
			"..............o.",
			".....oooooo..oho",
			"...oocccwwwoohmo",
			"..occcbbccwwlmo.",
			".occbbboccclmo..",
			".ocbbomloolmo...",
			"occbo.omllmo....",
			"ocbo...omlo.....",
			"obao..oddmlo....",
			"obao.oddoomlo...",
			"obaoolmo..oo....",
			".obaooo.........",
			".obaao.....oo...",
			"..obaaoooooaao..",
			"...oobaaaaaoo...",
			".....oooooo....."
		]
	},
	bolt: {
		palette: Ff(Nf.FIRE, Pf.FIRE),
		rows: [
			"..........oooo..",
			"........oommmmo.",
			".......ommllllmo",
			"......omllhhhlmo",
			".....omlhhwwhhlo",
			"....omllhwwwwhlo",
			"...ommlhhwwwwhlo",
			"..ommomlhhwwhhlo",
			".ommommllhhhhlmo",
			".omommmlllllllo.",
			"omoommlommllmdo.",
			".oommdodmmmddo..",
			".ommdo.oooooo...",
			"omdoo...........",
			".oo.............",
			"................"
		]
	},
	nova: {
		palette: Ff(Nf.GOLD, Pf.FIRE),
		rows: [
			".......o........",
			"......olo.......",
			"......oho.......",
			"..o..olhlo..o...",
			".omo.olhlo.omo..",
			"..ololhhhlolo...",
			".ooolhhwhhlooo..",
			"olllhhwwwhhlllo.",
			".ooolhhwhhlooo..",
			"..ololhhhlolo...",
			".omo.olhlo.omo..",
			"..o..olhlo..o...",
			"......olo.......",
			"......omo.......",
			".......o........",
			"................"
		]
	},
	tempest: {
		palette: Ff(Nf.STEEL, Pf.WIND),
		rows: [
			"....oo.oo.o.....",
			"...oaaohloaoo...",
			"..oaooohlooowo..",
			".oabo.ohlo..owo.",
			"obbo..ohmo..owco",
			"obco..ohmo..ocbo",
			"obco..ohmo.occo.",
			".obcooohmoooco..",
			"..obcccwccccbo..",
			"...obbbbbbbbo...",
			"....oooddooo....",
			"...ohllmmmmdo...",
			"....oooddooo....",
			"......omdo......",
			"......ommo......",
			".......oo......."
		]
	},
	dragonfang: {
		palette: Ff(Nf.RED, Pf.FIRE),
		rows: [
			"..ooooo.........",
			".occwccooo......",
			".obllllcccoo....",
			"..oommmlllcco...",
			"..o.oodmmllcco..",
			".oco..oddmlcco..",
			"..obo..oddmlcco.",
			"...obo...odmlco.",
			"....obo..odmlcco",
			"....obo...odlcco",
			"....obo..oddlcco",
			"....oao...odlco.",
			"...oao...odlcco.",
			"..oao...odmlco..",
			"...o...oddmco...",
			"........oooo...."
		]
	},
	skyfall: {
		palette: Ff(Nf.STEEL, Pf.GOLD),
		rows: [
			"......oooo......",
			"......ohmo......",
			"......oddo......",
			"......omdo......",
			"..oooooddooooo..",
			"..ohllllmmmmdo..",
			"..oooohlmdoooo..",
			".....ohlmdo.....",
			".....ohlmdo.....",
			"..a..ohlmdo..a..",
			"...b.ohlmdo.b...",
			"....cohlmdoc....",
			".....cohmoc.....",
			"..aabccwwccbaa..",
			".oabbbccccbbbao.",
			"..oooooooooooo.."
		]
	},
	peal: {
		palette: Ff(Nf.STEEL, Pf.GOLD),
		rows: [
			".......obo.oaaoa",
			".ooooo.obbo.oaoo",
			"owhhhho.obbooao.",
			"ollllmco.oboobo.",
			"ollllmwo.ocoobo.",
			"ollllmco.ocoobo.",
			"olddddo.obboobo.",
			".oomdo.obbo.oaoo",
			"..omdoobbo.oaaoa",
			"..omdo.oo.oaaooa",
			"..omdo...oaaooaa",
			"..omdo..oaaooaao",
			"..omdo...oo.oao.",
			"..omdo.......o..",
			"..omdo..........",
			"..odo..........."
		]
	},
	toll: {
		palette: Ff(Nf.GOLD, Pf.WIND),
		rows: [
			"......olmo......",
			"......omdo......",
			".....ohlmdo.....",
			".o...owlmdo...o.",
			"oco.ohhllmdo.oco",
			".ocoohhllmdooco.",
			"o.o.ohhllmdo.o.o",
			"bo..ohhllmdo..ob",
			"o..ohhhllmddo..o",
			"...oddddddddo...",
			"..ohhhlllmmddo..",
			"..ohhhhllllllo..",
			".oaaaaamdaaaaao.",
			"oaaooooooooooabo",
			"obbbboooooobbbbo",
			".ooobbbbbbbbooo."
		]
	},
	carillon: {
		palette: Ff(Nf.GOLD, Pf.GOLD),
		rows: [
			"......omlo......",
			"......ohlo......",
			".....ohlldo.....",
			".....ohlldo.....",
			"..oo.ohhllo.oo..",
			".omlo.oooo.omlo.",
			".ohlooacoaoohlo.",
			"ohlldocwcoohlldo",
			"ohlldoocbbohlldo",
			"ohhlloaobaohhllo",
			".oooo.omlo.oooo.",
			"......ohlo......",
			".....ohlldo.....",
			".....ohlldo.....",
			".....ohhllo.....",
			"......oooo......"
		]
	},
	draught: {
		palette: Ff(Nf.FLASK, Pf.RED),
		rows: [
			"......oooo......",
			".....ommmdo.....",
			".....ommddo.....",
			"....ohlllllo....",
			".....ohlllo.....",
			"....oohllloo....",
			"...ohhllllllo...",
			"..ohlllllllllo..",
			"..ohwcccccccco..",
			".ohwcbbbbbbbbao.",
			".ohcbbbbbbbbbao.",
			".olcbbbbbbbbaao.",
			"..obbbbbbbbaao..",
			"..oabbbbbbaaao..",
			"...oaaaaaaaao...",
			"....oooooooo...."
		]
	},
	mana: {
		palette: Ff(Nf.BLUE, Pf.BLUE),
		rows: [
			".......o........",
			"......omo.......",
			".....olmmo......",
			".....olmmo......",
			"....olhmmdo.....",
			"...olhmmmmdo....",
			"...olhmmmmdo....",
			"..olhmmmmmmdo...",
			".olhwmmmmmmmdo..",
			".olhhmmmmmmldo..",
			".olhmmmmmmmldo..",
			"..ommmmmmmldo...",
			"...odmmmlldo....",
			"....odddddo.....",
			".....ooooo......",
			"................"
		]
	},
	stamina: {
		palette: Ff(Nf.GREEN, Pf.GREEN),
		rows: [
			".......oooo.....",
			"......ohhhmo....",
			".....ohllmo.....",
			".....ohlmo......",
			"....ohllmo......",
			"....ohlmooo.....",
			"...ohllhhhmo....",
			"...odmmllmo.....",
			"....ooollmo.....",
			".....ollmo......",
			".....olmo.......",
			"....ollmo.......",
			"....olmo........",
			"...olmo.........",
			"...omo..........",
			"....o..........."
		]
	},
	skull: {
		palette: Ff(Nf.BONE, Pf.RED),
		rows: [
			"................",
			".....oooooo.....",
			"...oohllllmoo...",
			"..ohlmmmmmmlmo..",
			".ohmmmmmmmmmmmo.",
			".olmmmmmmmmmmdo.",
			".olmdddmmdddmdo.",
			".oldoooldoooldo.",
			".oldoaoldoaoldo.",
			".omdooomdoooldo.",
			"..omllmoohlldo..",
			"...olmdlldmdo...",
			"...oldoldoldo...",
			"...omdmddmddo...",
			"....oooooooo....",
			"................"
		]
	},
	sword: {
		palette: Ff(Nf.STEEL, Pf.GOLD),
		rows: [
			"..............o.",
			".............oho",
			"............ohmo",
			"...........ohmo.",
			"..........olmo..",
			".........olmo...",
			"....oo..olmo....",
			"...obcoolmo.....",
			"....obclmo......",
			".....obco.......",
			"....oabbco......",
			"...oaboobco.....",
			".ooabo..oo......",
			"ocboo...........",
			"obao............",
			".oo............."
		]
	}
}, Lf = Object.freeze({
	whirl: "whirl",
	bolt: "bolt",
	nova: "nova",
	tempest: "tempest",
	dragonfang: "dragonfang",
	skyfall: "skyfall",
	peal: "peal",
	toll: "toll",
	carillon: "carillon",
	draught: "draught"
});
Object.freeze({
	gold: "coin",
	heart: "heart",
	mana: "mana",
	draught: "draught",
	upgrade: "star",
	core: "gem"
});
function Rf(e, t) {
	let n = (t) => Object.prototype.hasOwnProperty.call(t, e) ? t[e] : null, r = n(If) ?? n(Gt);
	if (!r) throw Error(`icon: no icon "${e}" (combat: ${Object.keys(If).join(", ")}; core: ${Object.keys(Gt).join(", ")})`);
	return Ut(r, t);
}
//#endregion
//#region src/engine/ui/art/combat.js
var zf = () => {
	let e = B();
	return [
		[
			e.bs4,
			e.g5,
			e.tr0
		],
		[
			e.bs3,
			e.g5,
			e.tr1
		],
		[
			e.bs2,
			e.g4,
			e.tr1
		],
		[
			e.bs1,
			e.g3,
			e.tr1
		],
		[
			e.bs0,
			e.g2,
			e.tr1
		]
	];
};
function Bf(e, t, n) {
	let r = B(), i = t - 18;
	for (let t = 1; t < n; t++) {
		let a = 9 + Math.round(i * t / n);
		e.vline(a, 3, 5, r.ink0), e.px(a, 1, r.g5), e.px(a, 9, r.g4);
	}
}
function Vf(e, t = 3) {
	let n = B(), r = e - 10, i = r - 9 + 1, a = zf(), o = V(e, 11, (t) => {
		t.rect(8, 0, r - 9 + 3, 11, n.ink0), t.hline(9, 1, i, n.g4), t.hline(9, 9, i, n.g2), a.forEach(([, , e], n) => t.hline(9, 3 + n, i, e)), mn(t, 4, 5, 4, z.ruby(), { open: "r" }), mn(t, e - 5, 5, 4, z.ruby(), { open: "l" });
	}), s = (e) => V(i, 5, (t) => a.forEach((n, r) => t.hline(0, r, i, n[e])));
	return {
		base: o,
		fill: s(0),
		chip: s(1),
		cap: V(1, 5, (e) => e.vline(0, 0, 5, n.bs4)),
		hit: V(i, 5, (e) => {
			e.rect(0, 0, i, 5, n.hit), e.hline(0, 4, i, n.g5);
		}),
		ticks: V(e, 11, (n) => Bf(n, e, t)),
		iw: i
	};
}
function Hf(e, t, n = 11) {
	let r = B(), i = n + 3;
	return V(i, i, (a) => {
		let o = e > 0 ? 2 : i - 3, s = t > 0 ? 2 : i - 3, c = [];
		for (let i = 0; i < n; i++) c.push([
			o + e * i,
			s,
			i < 4 ? r.g5 : r.g4
		]), c.push([
			o,
			s + t * i,
			i < 4 ? r.g5 : r.g4
		]), i > 0 && (c.push([
			o + e * i,
			s + t,
			r.g2
		]), c.push([
			o + e,
			s + t * i,
			r.g2
		]));
		fn(a, c);
	});
}
function Uf(e = 16) {
	let t = B();
	return V(e, e, (n) => {
		n.rect(0, 0, e, e, t.veil);
		for (let r = 0; r < e; r += 2) n.px(r, 0, t.g4);
	});
}
function Wf(e = 16) {
	let t = B();
	return V(e, e, (n) => {
		n.dither(0, 0, e, e, t.g5, t.g4, "check"), n.box(0, 0, e, e, t.sel);
	});
}
function Gf(e) {
	let t = B();
	return V(e, 10, (n) => {
		n.rect(1, 0, e - 2, 10, t.ink0), n.rect(0, 1, e, 8, t.ink0), n.rect(1, 1, e - 2, 8, t.plate1), n.hline(2, 1, e - 4, t.dm1);
	});
}
var Kf = Object.freeze({
	heart: [
		".oo...oo.",
		"obbo.obco",
		"obbbobbco",
		"obbbbbbbo",
		"oabbbbbbo",
		".oabbbbo.",
		"..oabbo..",
		"...oao...",
		"....o...."
	],
	mana: [
		"....o....",
		"...oco...",
		"..obcwo..",
		".obbccbo.",
		"oabbcbbbo",
		".oabbbbo.",
		"..oabbo..",
		"...oao...",
		"....o...."
	],
	draught: [
		"...ooo...",
		"...owo...",
		"...oco...",
		"..obcbo..",
		".obbcbbo.",
		"oaabbbbbo",
		"oaaaabbbo",
		".oaaaabo.",
		"..ooooo.."
	],
	upgrade: [
		"....o....",
		"...owo...",
		"..owcwo..",
		".oocbcoo.",
		"...ocbo..",
		"...ocbo..",
		"...obao..",
		"...oaao..",
		"...oooo.."
	],
	core: [
		"....o....",
		"...oco...",
		"..obwco..",
		".obcwcbo.",
		"oabcwcbao",
		".oabcbao.",
		"..oabao..",
		"...oao...",
		"....o...."
	]
}), qf = (e) => {
	let t = B();
	return {
		heart: [
			t.hp0,
			t.hp2,
			t.hp3,
			t.tx1
		],
		mana: [
			t.mp0,
			t.mp1,
			t.mp3,
			t.tx1
		],
		draught: [
			t.ink3,
			t["m-g"],
			t.heal,
			t.tx1
		],
		upgrade: [
			t.g1,
			t.g3,
			t.g4,
			t.g5
		],
		core: [
			t.em1,
			t.em2,
			t.em3,
			t.tx1
		]
	}[e];
}, Jf = Object.freeze([
	"gold",
	"heart",
	"mana",
	"draught",
	"upgrade",
	"core"
]), Yf = /* @__PURE__ */ new Map();
function Xf(e) {
	let t = Jf.includes(e) ? e : "gold", n = Yf.get(t);
	if (!n) {
		if (t === "gold") n = ut();
		else {
			let [e, r, i, a] = qf(t);
			n = V(9, 9, (n) => n.rows(0, 0, [...Kf[t]], {
				o: B().ink0,
				a: e,
				b: r,
				c: i,
				w: a
			}));
		}
		Yf.set(t, n);
	}
	return n;
}
function Zf(e, t) {
	let n = Pt(e, t, tt("#0a0204"), (e, t) => {
		let n = Math.hypot((e - .5) / .62, (t - .46) / .6);
		return Math.min(.95, .46 + .49 * Math.max(0, Math.min(1, (n - .2) / .8)) ** 1.2);
	}, [
		.46,
		.52,
		.58,
		.64,
		.7,
		.76,
		.82,
		.88,
		.95
	], 4), r = Pt(e, t, tt("#3a0a0c"), (e, t) => {
		let n = Math.hypot((e - .5) / .36, (t - .42) / .22);
		return Math.max(0, 1 - n) * .55;
	}, [
		.2,
		.38,
		.55
	], 3);
	return n.getContext("2d").drawImage(r, 0, 0), n;
}
//#endregion
//#region src/engine/ui/CombatHUD.js
var Qf = 8, $f = 11, ep = 630, tp = 30, np = 2;
function rp(e) {
	return e > 0 ? e < 1 ? e : 1 : 0;
}
var ip = (e) => `round(down, calc(${e}), var(--lu-dpx, 1px))`, ap = (e) => `round(nearest, calc(var(--px) * ${e}), var(--lu-dpx, 1px))`;
function op(e, t, n, r, i, a, o = null) {
	i += i % 2, a += a % 2, It(e, [n, r]), e.dataset.anchor = t, e.classList.add("g", "grp");
	let s = e.style;
	s.left = "", s.right = "", s.top = "", s.bottom = "", s.width = N(i), s.height = N(a);
	let [c, l] = t.split(""), u, d;
	l === "l" ? (s.left = N(n), u = N(-n)) : l === "r" ? (s.right = N(640 - n - i), u = `calc(100% + ${N(640 - n - i)})`) : (s.left = ip(`50% - ${N(i / 2)} + ${N(n + i / 2 - 320)}`), u = `calc(50% - ${N(n + i / 2 - 320)})`), c === "t" ? (s.top = N(r), d = N(-r)) : c === "b" ? (s.bottom = N(360 - r - a), d = `calc(100% + ${N(360 - r - a)})`) : (s.top = ip(`50% - ${N(a / 2)} + ${N(r + a / 2 - 180)}`), d = `calc(50% - ${N(r + a / 2 - 180)})`), s.transformOrigin = `${u} ${d}`, Ot(e, t, n, r, i, a, o);
}
var sp = Object.freeze([Object.freeze({
	family: "var(--lu-font-j10)",
	face: "Jersey 10",
	em: 56 / 3,
	L: 18,
	mid: 9,
	cap: 10
}), Object.freeze({
	family: "var(--lu-font-j15)",
	face: "Jersey 15",
	em: 27,
	L: 23,
	mid: 11.5,
	cap: 15
})]);
function cp(e, t) {
	let n = null, r = Infinity;
	for (let i of sp) for (let a = 1; a <= 16; a++) {
		let o = i.cap * a;
		if (t && o > e) break;
		let s = t ? e - o : Math.abs(Math.log(o / e));
		s < r - 1e-9 && (r = s, n = {
			...i,
			k: a
		});
	}
	return n;
}
function lp(e) {
	let t = Math.max(1, Math.round(e));
	return 10 * $t(t) == 5 * t ? null : cp(5 * t, !0);
}
function up(e) {
	let t = Math.max(1, Math.round(e));
	if (10 * $t(t) == 5 * t) return null;
	let n = cp(5 * t, !1);
	return n && (n.face !== "Jersey 10" || n.k !== $t(t)) ? n : null;
}
var dp = null;
function fp(e, t) {
	return dp ||= document.createElement("canvas").getContext("2d"), dp.font = `400 ${+(t.em * t.k).toFixed(4)}px "${t.face}"`, "fontKerning" in dp && (dp.fontKerning = "none"), Math.round(dp.measureText(e).width);
}
function pp(e, t, n, r, i, a, o = !1) {
	let s = kt(), c = fp(t, n), [l, u] = bt(a), d = Math.round((r - l) * s - c / 2), f = Math.round((i - u) * s - n.cap * n.k / 2) - Math.round((n.mid - n.cap / 2) * n.k), p = (e) => e === 0 ? "0" : `calc(var(--lu-dpx, 1px) * ${e})`, m = e.style;
	m.fontFamily = n.family, m.fontSize = p(+(n.em * n.k).toFixed(4)), m.lineHeight = p(n.L * n.k), m.left = p(d), m.top = p(f), o && (m.textShadow = [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1],
		[0, 2],
		[1, 1],
		[-1, 1]
	].map(([e, t]) => `${p(e * n.k)} ${p(t * n.k)} 0 var(--g-ink0)`).join(", ")), e.classList.add("lu-jersey");
}
function mp(e, t, n) {
	let r = kt(), i = [], a = "";
	for (let o of String(e ?? "").split(/[ \u200b]+/).filter(Boolean)) {
		let e = a ? `${a} ${o}` : o;
		a && fp(e, t) / r > n ? (i.push(a), a = o) : a = e;
	}
	return a && i.push(a), i;
}
function hp(e, t, n, r, i, a) {
	let o = document.createElement("div");
	o.className = `${a} g lu-flat`;
	let [s, c] = bt(e);
	return o.style.left = N(t - s), o.style.top = N(n - c), r != null && (o.style.width = N(r)), i != null && (o.style.height = N(i)), It(o, [t, n]), e.append(o), o;
}
function gp(e, t, n, r) {
	let i = P(e, "", t, n, r), [a] = bt(e), o = r.font ?? "body", s = r.track ?? 0, c = r.align ?? "left", l = "";
	return {
		el: i,
		set(e) {
			let n = String(e ?? "");
			if (n === l || (l = n, i.textContent = n, c === "left")) return;
			let r = L(n, o, s), u = c === "right" ? t - r : t - Math.floor(r / 2);
			i.style.left = ap(Math.round((u - a) * 2) / 2);
		},
		get text() {
			return l;
		}
	};
}
function _p(e, t, n, r, i, a) {
	return F(e, n, r, i, 1, a), t && t.parentNode === e && t.replaceWith(n), n;
}
function vp(e) {
	if (Array.isArray(e)) return e.map(String);
	let t = String(e ?? "");
	return t.length > 1 && t.includes("/") ? t.split("/").map((e) => e.trim()).filter(Boolean) : t ? [t] : [];
}
var yp = class {
	constructor(e, { anchor: t = null } = {}) {
		this.parent = e, this.anchor = t, this._disposed = !1, this._vitals = document.createElement("div"), this._vitals.className = "lu-vitals", this._skillsEl = document.createElement("div"), this._skillsEl.className = "lu-skills", this._lootEl = document.createElement("div"), this._lootEl.className = "lu-loot", e.append(this._vitals, this._skillsEl, this._lootEl), this._vit = {
			hp: 0,
			hpMax: 0,
			mp: 0,
			mpMax: 0,
			sp: 0,
			spMax: 0,
			level: 0,
			xp: 0,
			xpNext: 1,
			winded: !1
		}, this._vitSet = !1, this._vHpMax = -1, this._vMpMax = -1, this._level = -1, this._winded = !1, this._calm = !1, this._defs = [], this._state = [], this._slots = [], this._potions = -1, this._potionsMax = -1, this._gold = 0, this._goldSet = !1, this._goldFlip = !1, this._purseW = -1, this._loot = [], this._lootNext = 0, this.onSlotPress = null, this._skillsEl.addEventListener("pointerdown", (e) => {
			let t = e.target instanceof Element ? e.target.closest(".lu-skill__box") : null;
			if (!t || (e.preventDefault(), e.button !== 0)) return;
			let n = this._slots.findIndex((e) => e.box === t);
			n >= 0 && this.onSlotPress?.(n);
		}), this._skillsEl.addEventListener("contextmenu", (e) => e.preventDefault()), this._build(), this._offScale = lt(e, () => this._build()), We()?.ready.then(() => {
			this._disposed || this._build();
		});
	}
	setVitals(e) {
		if (!e) return;
		let t = this._vit;
		t.hp = e.hp, t.hpMax = e.hpMax, t.mp = e.mp, t.mpMax = e.mpMax, t.sp = e.sp, t.spMax = e.spMax, t.level = e.level, t.xp = e.xp, t.xpNext = e.xpNext, t.winded = !!e.winded, this._vitSet = !0, (e.hpMax !== this._vHpMax || e.mpMax !== this._vMpMax) && (this._vHpMax = e.hpMax, this._vMpMax = e.mpMax, this._vitalsWidth() !== this._vw && this._buildVitals()), this._applyVitals();
	}
	configureSkills(e = []) {
		this._defs = e.map((e) => ({ ...e })), this._state = this._defs.map(() => ({
			cooldown: 0,
			seconds: 0,
			left: null,
			locked: !1,
			affordable: !0
		})), this._buildSkills();
		let t = We();
		if (t && this._defs.length) {
			let e = this._defs;
			t.ensure(e.map((e) => e.label)).then(() => {
				!this._disposed && this._defs === e && this._buildSkills();
			});
		}
	}
	setSkill(e, t) {
		let n = this._slots[e], r = this._state[e];
		n && r && t && (r.cooldown = t.cooldown ?? 0, r.seconds = t.seconds ?? 0, r.left = Number.isFinite(t.left) ? t.left : null, r.locked = !!t.locked, r.affordable = t.affordable !== !1, this._applySkill(n, r));
	}
	refuse(e) {
		let t = this._slots[e];
		t && (t.nope = !t.nope, t.el.classList.toggle("is-refuse-a", t.nope), t.el.classList.toggle("is-refuse-b", !t.nope));
	}
	setPotions(e, t) {
		let n = Math.max(0, e | 0), r = t | 0;
		(n !== this._potions || r !== this._potionsMax) && (this._potions = n, this._potionsMax = r, this._applyPotions());
	}
	setGold(e) {
		let t = Math.max(0, Math.floor(e || 0));
		if (t === this._gold) {
			this._goldSet = !0;
			return;
		}
		let n = t > this._gold && this._goldSet;
		this._goldSet = !0, this._gold = t, this._layoutPurse(), n && this._goldEl && (this._goldFlip = !this._goldFlip, this._goldEl.classList.toggle("is-up-a", this._goldFlip), this._goldEl.classList.toggle("is-up-b", !this._goldFlip));
	}
	setCalm(e) {
		let t = !!e;
		t !== this._calm && (this._calm = t, this._vitals.classList.toggle("is-calm", t));
	}
	loot(e, t = "gold") {
		let n = Jf.includes(t) ? t : "gold", r = this._loot[this._lootNext];
		if (r) {
			this._lootNext = (this._lootNext + 1) % Qf;
			for (let e of this._loot) e === r || e.i >= Qf || (e.i++, e.i === 1 && e.el.classList.remove("is-new"), e.el.style.setProperty("--i", String(e.i)));
			r.i = 0, r.flip = !r.flip, this._fillLoot(r, String(e ?? ""), n), r.el.className = `lu-loot__row lu-loot__row--${n} g lu-flat is-new ${r.flip ? "is-a" : "is-b"}`, r.el.style.setProperty("--i", "0");
		}
	}
	get vitalsElement() {
		return this._vitals;
	}
	get skillsElement() {
		return this._skillsEl;
	}
	dispose() {
		this._disposed = !0, this._offScale?.(), this._vitals.remove(), this._skillsEl.remove(), this._lootEl.remove();
	}
	_build() {
		this._disposed || (this._buildVitals(), this._buildSkills(), this._buildLoot());
	}
	_vitalsTop() {
		return 10 + Math.round(3.5 + ot("name") + 2.5 + ot("line") + 3.5) + 4;
	}
	_vitalsWidth() {
		let e = this._vit, t = (e) => {
			let t = Math.max(0, Math.round(e));
			return L(`${t}/${t}`, "num");
		};
		return Math.max(155, 107 + Math.max(t(e.hpMax), t(e.mpMax)) + 16);
	}
	_buildVitals() {
		let e = B(), t = this._vitals;
		t.textContent = "";
		let n = this._vitalsTop(), r = this._vitalsWidth();
		this._vw = r, op(t, "tl", 10, n, r, 32), F(t, ct(r, 32, .84, .7, .58), 10, n, 1, "lu-vitals__band"), F(t, nt(Math.round(r * .86)), 10, n + 31);
		let i = hp(t, 10, n, 22, 26, "lu-vitals__lv");
		P(i, "Lv", 21, n + 1, {
			font: "tiny",
			color: e.g4,
			align: "center",
			drop: !0,
			cls: "lu-vitals__lvk"
		}), this._lvn = gp(i, 21, n + 9, {
			font: "numL",
			color: e.g5,
			align: "center",
			drop: !0,
			cls: "lu-vitals__lvn"
		});
		let a = hp(t, 10, n, null, null, "lu-vitals__bars"), o = {
			hp: [
				e.hp0,
				e.hp1,
				e.hp2,
				e.hp3
			],
			mp: [
				e.mp0,
				e.mp1,
				e.mp2,
				e.mp3
			],
			sp: [
				e.sp0,
				e.sp1,
				e.sp1,
				e.sp2
			]
		}, s = [
			[
				"hp",
				7,
				2
			],
			[
				"mp",
				7,
				10
			],
			[
				"sp",
				6,
				18
			]
		], c = {};
		for (let [t, r, i] of s) {
			let s = n + i, l = Math.round(s + 2 + (r - 4) / 2 - 2.5), u = hp(a, 10, s, null, null, `lu-vbar lu-vbar--${t}`);
			P(u, t.toUpperCase(), 32, l - 2, {
				font: "tiny",
				drop: !0,
				cls: "lu-vbar__k"
			});
			let d = hp(u, 43, s, 71, r, "lu-vbar__track"), f = o[t];
			F(d, V(71, r, (t) => Ge(t, 71, r, 0, f, { ring: e.dm1 })), 43, s);
			let p = r - 4, m = Qe(f, p), h = Qe([
				e.g3,
				e.g4,
				e.g5,
				e.g5
			], p), g = (e) => V(67, p, (t) => e.forEach((e, n) => t.hline(0, n, 67, e))), _ = t === "sp" ? null : F(d, g(h), 45, s + 2, 1, "lu-vbar__lag"), v = F(d, g(m), 45, s + 2, 1, "lu-vbar__fill"), y = p > 2 ? F(d, V(1, p - 1, (e) => e.vline(0, 0, p - 1, m[0])), 45, s + 3, 1, "lu-vbar__cap") : null;
			t === "hp" && F(d, V(67, p, (t) => {
				for (let n = 1; n < 4; n++) t.vline(Math.round(67 * n / 4), p - Math.ceil(p / 2), Math.ceil(p / 2), e.ink0);
			}), 45, s + 2, 1, "lu-vbar__notch");
			let b = null, x = null;
			if (t !== "sp") {
				let e = P(u, "", 117, l - 2, {
					font: "num",
					drop: !0,
					cls: "lu-vbar__num"
				}), t = document.createElement("b"), n = document.createElement("span");
				n.className = "lu-vbar__max", b = document.createTextNode(""), x = document.createTextNode(""), t.append(b), n.append(x), e.append(t, n);
			}
			c[t] = {
				row: u,
				fill: v,
				lag: _,
				cap: y,
				iw: 67,
				q: -1,
				n: -1,
				max: -1,
				low: !1,
				numText: b,
				maxText: x,
				clip: !1
			};
		}
		this._hp = c.hp, this._mp = c.mp, this._sp = c.sp;
		let l = r - 22, u = hp(t, 15, n + 26, l, 2, "lu-vitals__xp");
		F(u, V(l, 2, (t) => {
			t.hline(0, 0, l, e.xp0), t.hline(0, 1, l, e.ink1);
		}), 15, n + 26);
		let d = F(u, V(l, 2, (t) => {
			for (let n = 0; n < l; n++) {
				let r = n / l;
				t.px(n, 0, r < .33 ? e.g2 : r < .66 ? e.g3 : e.g4), t.px(n, 1, r < .33 ? e.g1 : e.g2);
			}
		}), 15, n + 26, 1, "lu-vbar__fill");
		this._xp = {
			row: u,
			fill: d,
			lag: null,
			cap: null,
			iw: l,
			q: -1,
			n: -1,
			max: -1,
			low: !1,
			numText: null,
			maxText: null,
			clip: !0
		}, this._level = -1, this._winded = !1, this._vitSet && this._applyVitals();
	}
	_applyVitals() {
		let e = this._vit;
		this._setBar(this._hp, e.hp, e.hpMax, !0), this._setBar(this._mp, e.mp, e.mpMax, !0), this._setBar(this._sp, e.sp, e.spMax, !1), this._setBar(this._xp, e.xp, e.xpNext, !1);
		let t = e.hpMax > 0 && e.hp > 0 && e.hp / e.hpMax <= .25;
		t !== this._hp.low && (this._hp.low = t, this._hp.row.classList.toggle("is-low", t));
		let n = e.level | 0;
		n !== this._level && (this._level = n, this._lvn.set(String(n)));
		let r = !!e.winded;
		r !== this._winded && (this._winded = r, this._sp.row.classList.toggle("is-winded", r));
	}
	_setBar(e, t, n, r) {
		let i = n > 0 ? n : 1, a = Number.isFinite(t) ? t : 0, o = Math.round(rp(a / i) * e.iw);
		if (o !== e.q) {
			if (e.q = o, e.clip) e.fill.style.clipPath = `inset(0 calc(var(--px) * ${e.iw - o}) 0 0)`;
			else {
				let t = `scaleX(${o / e.iw})`;
				e.fill.style.transform = t, e.lag && (e.lag.style.transform = t);
			}
			if (e.cap) {
				let t = o > 1 && o < e.iw;
				e.cap.style.visibility = t ? "" : "hidden", t && (e.cap.style.transform = `translateX(calc(var(--px) * ${o - 1}))`);
			}
		}
		if (r && e.numText) {
			let t = a > 0 ? Math.ceil(a - 1e-6) : 0;
			t !== e.n && (e.n = t, e.numText.nodeValue = String(t));
			let r = Math.round(n > 0 ? n : 0);
			r !== e.max && (e.max = r, e.maxText.nodeValue = `/${r}`);
		}
	}
	_buildSkills() {
		let e = this._skillsEl;
		e.textContent = "";
		let t = dt.line.unit, n = kt(), r = $e() ? null : up(n);
		this._nameFace = r;
		let i = (e) => r ? Math.ceil(fp(e, r) / n) : L(e, "line"), a = 0;
		for (let e of this._defs) for (let t of Mt(e.label ?? "")) a = Math.max(a, i(t));
		let o = Math.max(r ? 28 : $e() ? 25 : 56 * t, a), s = this._defs.map((e) => r ? mp(e.label ?? "", r, o) : Kt(e.label ?? "", "line", o)), c = s.map((e) => e.reduce((e, t) => Math.max(e, i(t)), 0)), l = Math.ceil(2 * (r ? r.k / n : t)), u = this._defs.length, d = tp;
		for (let e = 0; e + 1 < u; e++) d = Math.max(d, Math.ceil(c[e] / 2) + Math.floor(c[e + 1] / 2) + l + np);
		this._pitch = d;
		let f = this._defs.map((e, t) => ep - (u - t) * d + 8), p = Math.min(ep, ...f.map((e, t) => Math.min(e, e + 11 - Math.ceil(c[t] / 2) - 1))), m = Math.min(500, p);
		op(e, "br", m, 284, 640 - m, 76);
		let h = tn(this.parent), g = h?.cornerShrink ?? 1;
		e.classList.toggle("is-tight", !!h && h.artW - (640 - p) * g < 510 * g), this._goldEl = hp(e, m, 284, null, null, "lu-skills__gold"), this._purse = null, this._purseW = -1, this._layoutPurse(), this._row = hp(e, m, 284, null, null, "lu-skills__row"), this._slots = this._defs.map((e, t) => this._buildSlot(e, f[t], 306, s[t])), this._slots.forEach((e, t) => this._applySkill(e, this._state[t])), this._potions >= 0 && this._applyPotions();
	}
	_buildSlot(e, t, n, r) {
		let i = B(), a = e.icon === "draught", o = hp(this._row, t, n, 22, 22, a ? "lu-skill lu-skill--draught" : "lu-skill");
		o.dataset.skill = String(e.id ?? "");
		let s = hp(o, t, n, 22, 22, "lu-skill__box"), c = vp(e.keys ?? "");
		for (let [e, r] of [["lu-skill__frame", {
			size: "XS",
			socket: !0,
			corners: z.gold(),
			cornerR: 1,
			fill: i.ink1
		}], ["lu-skill__frame lu-skill__frame--locked", {
			size: "XS",
			socket: !0,
			corners: null,
			cornerR: 1,
			tone: "dim",
			fill: i.ink1
		}]]) {
			let i = _t(s, r, t, n, 22, 22);
			i.base.classList.add(...e.split(" ")), i.orn?.classList.add(...e.split(" "));
		}
		let l = hp(s, t + 3, n + 3, 16, 16, "lu-skill__icon");
		l.setAttribute("role", "img"), l.setAttribute("aria-label", `${Mt(e.label ?? "").join($e() ? "" : " ")}${c.length ? ` [${c.join(" / ")}]` : ""}`), Object.prototype.hasOwnProperty.call(Lf, e.icon) && (F(l, Rf(Lf[e.icon]), t + 3, n + 3, 1, "lu-skill__ico"), F(l, Rf(Lf[e.icon], Lt()), t + 3, n + 3, 1, "lu-skill__ico lu-skill__ico--dusk"));
		let u = hp(s, t + 3, n + 3, 16, 16, "lu-skill__veil"), d = F(u, Uf(16), t + 3, n + 3, 1, "lu-skill__veil-art");
		F(s, Wf(16), t + 3, n + 3, 1, "lu-skill__flash");
		let f = gp(s, t + 11, n + 10 - Vt("big"), {
			font: "big",
			color: i.tx1,
			align: "center",
			olx: !0,
			cls: "lu-skill__secs"
		}), p = gp(s, t + 19, n + 2, {
			font: "num",
			align: "right",
			ol: !0,
			cls: "lu-skill__count"
		}), m = hp(s, t, n, null, null, "lu-skill__lock");
		if (F(m, Nt("lock"), t + 8, n + 6), Number.isFinite(e.unlock)) {
			let r = String(e.unlock), a = L("Lv", "tiny"), o = L(r, "num"), s = a + 2 + o + 8, c = t + 11 - Math.floor(s / 2), l = n - 5;
			F(m, Gf(s), c, l), P(m, "Lv", c + 4, l, {
				font: "tiny",
				color: i.g4
			}), P(m, r, c + 4 + a + 2, l, {
				font: "num",
				color: i.g5
			});
		}
		this._keys(s, c, t, n, "lu-skill__keys");
		let h = hp(o, t, n + 22, null, null, "lu-skill__label");
		h.setAttribute("aria-hidden", "true");
		let g = this._nameFace, _ = g ? 8 : $e() ? dt.line.L - 1 : 16 * dt.line.unit;
		return r.forEach((e, r) => {
			let a = P(h, e, t + 11, n + 29 + r * _, {
				font: "line",
				color: i.tx2,
				align: "center",
				ol: !0,
				drop: !0
			});
			g && pp(a, e, g, t + 11, n + 29 + r * _ + Vt("line"), h, !0);
		}), {
			el: o,
			box: s,
			veil: u,
			veilArt: d,
			secs: f,
			count: p,
			draught: a,
			vh: -1,
			s: -1,
			cd: !1,
			locked: !1,
			poor: !1,
			flip: !1,
			nope: !1
		};
	}
	_keys(e, t, n, r, i) {
		let a = hp(e, n, r, null, null, i), o = t.reduce((e, t) => e + Ft(t), 0) + Math.max(0, t.length - 1), s = n + 11 - Math.floor(o / 2);
		return t.forEach((e) => {
			let t = wt(a, e, s, r + 17), n = /^[0-9]$/.test(e) ? lp(kt()) : null, i = n ? a.lastElementChild : null;
			i instanceof HTMLElement && i.classList.contains("keylab") && pp(i, e, n, s + Math.floor(t / 2), r + 17 + 4.5, a), s += t + 1;
		}), a;
	}
	_applySkill(e, t) {
		let n = rp(t.cooldown), r = n > 0, i = r ? Math.max(2, Math.round(16 * n)) : 0;
		i !== e.vh && (e.vh = i, e.veilArt.style.transform = `translateY(calc(var(--px) * ${16 - i}))`), r !== e.cd && (e.cd = r, e.el.classList.toggle("is-cd", r), r || (e.flip = !e.flip, e.el.classList.toggle("is-ready-a", e.flip), e.el.classList.toggle("is-ready-b", !e.flip)));
		let a = 0;
		if (r) {
			let e = t.left ?? t.seconds ?? 0;
			e >= 1 ? a = Math.ceil(e - 1e-6) * 10 : e > 0 && (a = Math.min(10, Math.max(1, Math.ceil(e * 10 - 1e-6))));
		}
		a !== e.s && (e.s = a, e.secs.set(a === 0 ? "" : a >= 10 ? String(a / 10) : `0.${a}`)), t.locked !== e.locked && (e.locked = t.locked, e.el.classList.toggle("is-locked", t.locked));
		let o = !t.affordable;
		o !== e.poor && (e.poor = o, e.el.classList.toggle("is-poor", o));
	}
	_applyPotions() {
		let e = this._potions, t = this._potionsMax;
		for (let n of this._slots) n.draught && (n.count.set(`×${e}`), n.el.classList.toggle("is-empty", e === 0), n.el.classList.toggle("is-full", t > 0 && e >= t));
	}
	_layoutPurse() {
		let e = this._goldEl;
		if (!e) return;
		let t = B(), n = String(this._gold), r = L(n, "num"), i = L("G", "tiny"), a = 18 + r + 2 + i + 4;
		if (!this._purse) {
			e.textContent = "";
			let n = gp(e, 626 - i, 289.5, {
				font: "num",
				color: t.kw,
				align: "right",
				drop: !0,
				cls: "lu-skills__goldn"
			});
			P(e, "G", 628 - i, 289, {
				font: "tiny",
				color: t.g3,
				drop: !0,
				cls: "lu-skills__g"
			}), this._purse = {
				band: null,
				coin: null,
				num: n
			};
		}
		let o = this._purse;
		if (a !== this._purseW) {
			if (this._purseW = a, o.band = _p(e, o.band, Pt(a + 14, 10, tt(t.band), Ye([
				[0, 0],
				[.35, .82],
				[1, .82]
			]), [...xt]), ep - a - 12, 290, "lu-skills__band"), !o.coin) o.coin = F(e, ut(), ep - a + 2, 291, 1, "lu-skills__coin");
			else {
				let [t, n] = bt(e);
				o.coin.style.left = N(ep - a + 2 - t), o.coin.style.top = N(291 - n);
			}
		}
		o.num.set(n);
	}
	_buildLoot() {
		let e = this._lootEl;
		e.textContent = "", op(e, "br", 480, 185, 160, 104);
		let t = this._loot;
		this._loot = [];
		for (let n = 0; n < Qf; n++) {
			let r = hp(e, ep, 276, null, null, "lu-loot__row"), i = hp(r, ep, 276, null, null, "lu-loot__in"), a = {
				el: r,
				inner: i,
				band: F(i, V(1, $f, () => {}), ep, 276, 1, "lu-loot__band"),
				ico: F(i, V(9, 9, () => {}), ep, 277, 1, "lu-loot__ico"),
				t: P(i, "", ep, 281.5 - Vt("line"), {
					font: "line",
					drop: !0,
					cls: "lu-loot__t"
				}),
				i: Qf,
				flip: !1,
				text: "",
				kind: "gold",
				y0: 276
			}, o = t[n];
			o && o.i < Qf && (a.i = o.i, a.flip = o.flip, this._fillLoot(a, o.text, o.kind), r.className = o.el.className, r.style.setProperty("--i", String(a.i))), this._loot.push(a);
		}
	}
	_fillLoot(e, t, n) {
		let r = B();
		e.text = t, e.kind = n;
		let i = e.y0, a = L(t, "line"), o = 17 + a + 5;
		e.band = _p(e.inner, e.band, Pt(o + 14, $f, tt(r.band), Ye([
			[0, 0],
			[.3, .82],
			[1, .82]
		]), [...xt]), ep - o - 12, i, "lu-loot__band");
		let s = e.ico.getContext("2d");
		s.clearRect(0, 0, 9, 9), s.drawImage(Xf(n), 0, 0);
		let [c] = bt(e.inner);
		e.ico.style.left = N(ep - o + 5 - c), e.t.textContent = t, e.t.style.left = ap(625 - a - c);
	}
}, bp = 154, xp = 334, Sp = 340, Cp = 126, wp = 4, Tp = 220, Ep = 60, Dp = 600, Op = "lu-root--boss", kp = class {
	constructor(e) {
		this.parent = e;
		let t = document.createElement("div");
		t.className = "lu-bossbar", t.setAttribute("aria-hidden", "true"), e.appendChild(t), this.element = t, this._root = e.closest(".lu-root") ?? e.parentElement, this._rootT = 0, this._opts = {
			name: "",
			epithet: "",
			phases: 1
		}, this._q = -1, this._phase = -1, this._frac = 1, this._visible = !1, this._flip = !1, this._snapPending = !1, this._disposed = !1, this._gems = [], this._build(), this._offScale = lt(e, () => this._rebuild()), We()?.ready.then(() => this._rebuild());
	}
	get visible() {
		return this._visible;
	}
	show({ name: e = "", epithet: t = "", phases: n = 1 } = {}) {
		this._opts = {
			name: String(e ?? ""),
			epithet: String(t ?? ""),
			phases: Math.max(1, n | 0)
		}, this._build();
		let r = this._opts;
		We()?.ensure([r.name, r.epithet]).then(() => {
			this._opts === r && this._rebuild();
		}), this._lag.classList.add("is-snap"), this._q = -1, this._phase = -1, this.set(1, 1), this._snapPending = !0, clearTimeout(this._rootT), this._rootT = 0, this._root?.classList.add(Op), this._visible || (this._visible = !0, this.element.classList.add("is-on"));
	}
	set(e, t = 1) {
		this._snapPending && (this._snapPending = !1, this._lag.classList.remove("is-snap"));
		let n = e > 0 ? e < 1 ? e : 1 : 0;
		this._frac = n;
		let r = Math.round(n * this._iw);
		if (r !== this._q) {
			let e = this._q >= 0 && r < this._q;
			this._q = r;
			let t = `scaleX(${r / this._iw})`;
			this._fill.style.transform = t, this._lag.style.transform = t;
			let n = r > 1;
			this._cap.style.visibility = n ? "" : "hidden", n && (this._cap.style.transform = `translateX(calc(var(--px) * ${r - 1}))`), e && (this._flip = !this._flip, this._track.classList.toggle("is-hit-a", this._flip), this._track.classList.toggle("is-hit-b", !this._flip));
		}
		let i = t | 0;
		if (i !== this._phase) {
			this._phase = i;
			for (let e = 0; e < this._gems.length; e++) this._gems[e].classList.toggle("is-lit", e < i), this._gems[e].classList.toggle("is-current", e === i - 1);
		}
	}
	hide() {
		this._visible && (this._visible = !1, this.element.classList.remove("is-on"), clearTimeout(this._rootT), this._rootT = setTimeout(() => {
			this._rootT = 0, this._visible || this._root?.classList.remove(Op);
		}, Dp));
	}
	dispose() {
		this._disposed = !0, this._offScale?.(), clearTimeout(this._rootT), this._rootT = 0, this._root?.classList.remove(Op), this.element.remove();
	}
	_rebuild() {
		if (this._disposed) return;
		let e = this._phase, t = this._frac;
		this._build(), this._lag.classList.add("is-snap"), this._q = -1, this._phase = -1, this.set(t, e < 1 ? 1 : e), this._lag.classList.remove("is-snap");
	}
	_width() {
		let e = tn(this.element);
		if (!e) return xp;
		let t = e.artW / 2 - 1 - Cp * (e.cornerShrink ?? 1) - wp;
		return Math.max(Tp, Math.min(xp, 2 * Math.floor(t)));
	}
	_build() {
		let e = B(), t = this.element;
		t.textContent = "";
		let { name: n, epithet: r, phases: i } = this._opts, a = this._width(), o = bp + (xp - a) / 2, s = n ? ht(et(n), "name", a - 2 - 9 - 9 - Ep, 1) : "", c = L(s, "name", 1), l = 16 + 2 * Math.ceil(gt("name") / 2), u = 9 + c + 9, d = 336 - l, f = d + l / 2 + .25, p = d - 1;
		op(t, "bc", o, p, a, 351 - p), F(t, Pt(a + 46, 52, tt(e.band), (e, t) => Math.max(0, 1 - Math.hypot((e - .5) / .5, (t - .62) / .62)) * 1.3 * .74, [
			.25,
			.5,
			.74
		]), o - 24, 306, 1, "lu-bossbar__shade");
		let m = hp(t, o, d, null, null, "lu-bossbar__head");
		n && (_t(m, {
			size: "S",
			notch: 3,
			corners: z.ruby(),
			cornerR: 1,
			bands: [e.plate0, e.plate1],
			stops: [0, .5],
			sheen: !1
		}, o + 2, d, u, l), I(m, s, o + 2 + 9, f, {
			...Xe,
			color: e.g4,
			drop: !0,
			cls: "lu-bossbar__name"
		}));
		let h = n ? o + 2 + u + 7 : o + 4, g = o + a - 13 - (i - 1) * 9;
		r && I(m, ht(r, "line", Math.max(0, g - 6 - h)), h, f + ot("name") / 2 - ot("line") / 2, {
			font: "line",
			color: e.tx2,
			ol: !0,
			cls: "lu-bossbar__epithet"
		});
		let _ = hp(m, o, d, null, null, "lu-bossbar__gems");
		if (this._gems = [], i > 1) for (let t = 1; t <= i; t++) {
			let n = o + a - 6 - (i - t) * 9 - 7, r = d + l / 2 - 4, s = hp(_, n, r, 7, 7, "lu-bossbar__gem");
			F(s, Ue(2, [
				e.sock0,
				e.sock1,
				e.sock2
			], { setting: [
				e.dm1,
				e.dm2,
				e.dm3
			] }), n, r, 1, "lu-bossbar__gem-off"), F(s, Ue(2, z.ember()), n, r, 1, "lu-bossbar__gem-on"), F(s, Ue(2, [
				e.em2,
				e.em3,
				e.tx1
			], { setting: [
				e.g5,
				e.g5,
				e.g4
			] }), n, r, 1, "lu-bossbar__gem-glow"), this._gems.push(s);
		}
		let v = Vf(a, i);
		this._iw = v.iw;
		let y = hp(hp(t, o, Sp, a, 11, "lu-bossbar__frame"), o, Sp, a, 11, "lu-bossbar__track");
		F(y, v.base, o, Sp), this._lag = F(y, v.chip, o + 9, 343, 1, "lu-bossbar__lag"), this._fill = F(y, v.fill, o + 9, 343, 1, "lu-bossbar__fill"), this._cap = F(y, v.cap, o + 9, 343, 1, "lu-bossbar__cap"), F(y, v.hit, o + 9, 343, 1, "lu-bossbar__hit"), F(y, v.ticks, o, Sp, 1, "lu-bossbar__ticks"), this._track = y;
	}
}, Ap = {
	en: {
		guard: "Guard",
		perfect: "Perfect!",
		lv: "Lv"
	},
	ja: {
		guard: "ガード",
		perfect: "ジャスト回避！",
		lv: "Lv"
	},
	zh: {
		guard: "格挡",
		perfect: "完美闪避！",
		lv: "Lv"
	}
}, jp = 40, Mp = 32, Np = 8, Pp = 8, Fp = 800, Ip = 800, Lp = 12, Rp = 19, zp = 6, Bp = 48, Vp = 1.5, Hp = 6, Up = 9, Wp = 10, Gp = 48, Kp = 96, qp = 240, Jp = 56, Yp = 752, Xp = 8, Zp = 8, Qp = 1;
function $p(e, t) {
	return e < Gp ? t ? 0 : 2 : e < Kp ? t ? -2 : -1 : e < qp ? 0 : -Math.min(Wp, Math.floor((e - qp) / Jp));
}
function em(e, t, n, r) {
	let i = $p(e, n), a = i;
	for (let r = Math.ceil(e / Zp) * Zp; r <= t; r += Zp) {
		let e = $p(r, n);
		e < i ? i = e : e > a && (a = e);
	}
	return r.lo = i, r.hi = a, r;
}
var tm = /* @__PURE__ */ new Set([
	"dmg",
	"crit",
	"hurt",
	"heal",
	"mp",
	"guard",
	"perfect",
	"ally"
]), nm = Object.freeze({
	guard: "guard",
	perfect: "perfect"
}), rm = Object.freeze({
	Guard: "guard",
	"Perfect!": "perfect"
}), im = /* @__PURE__ */ new Set(["crit", "perfect"]), am = /^[+\-−]?[0-9][0-9.,]*%?$/, om = 150, sm = (e, t) => Object.prototype.hasOwnProperty.call(e, t), cm = [
	"..OOO..",
	".OHYYO.",
	".OYYYO.",
	".OYYDO.",
	"..OYO..",
	"..OYO..",
	"..ODO..",
	"...O...",
	"..OOO..",
	".OHYYO.",
	".ODDDO.",
	"..OOO.."
], lm = 17, um = [
	"#......",
	"##.....",
	"###....",
	"####...",
	"#####..",
	"######.",
	"#######",
	"######.",
	"#####..",
	"####...",
	"###....",
	"##.....",
	"#......"
], dm = [
	"#########",
	".########",
	"..#######",
	"...######",
	"....#####",
	".....####",
	"......###",
	".......##",
	"........#"
], fm = [
	[1, 0],
	[1, 1],
	[0, 1],
	[-1, 1],
	[-1, 0],
	[-1, -1],
	[0, -1],
	[1, -1]
];
function pm(e) {
	let t = e.length, n = e[0].length, r = [];
	for (let i = 0; i < n; i++) {
		let n = "";
		for (let r = 0; r < t; r++) n += e[t - 1 - r][i];
		r.push(n);
	}
	return r;
}
function mm() {
	let e = um, t = pm(e), n = pm(t), r = pm(n), i = dm, a = pm(i), o = pm(a);
	return [
		e,
		a,
		t,
		o,
		n,
		pm(o),
		r,
		i
	];
}
function hm(e, t, n, r, i) {
	let a = B(), o = r.length, s = r[0].length, c = t + (lm - s >> 1), l = n + (lm - o >> 1), u = (e, t) => t >= 0 && t < o && e >= 0 && e < s && r[t][e] === "#", d = (e, t) => !u(e, t) && (u(e + 1, t) || u(e - 1, t) || u(e, t + 1) || u(e, t - 1)), [f, p, m] = i ? [
		a.sel,
		a.em3,
		a.em2
	] : [
		a.em3,
		a.em2,
		a.em1
	];
	for (let t = -2; t < o + 2; t++) for (let n = -2; n < s + 2; n++) {
		let r = null;
		u(n, t) ? r = u(n, t - 1) ? u(n, t + 1) ? p : m : f : d(n, t) ? r = a.ink0 : i && (d(n + 1, t) || d(n - 1, t) || d(n, t + 1) || d(n, t - 1)) && (r = a.rb2), r && e.px(c + n, l + t, r);
	}
}
var gm = (e) => `url("${e.toDataURL("image/png")}")`, _m = null;
function vm() {
	if (_m) return _m;
	let e = B(), t = {};
	t["--lu-wf-bar"] = gm(V(34, 4, (t) => {
		t.rect(0, 0, 34, 4, e.ink0), t.hline(1, 1, 32, e.tr0), t.hline(1, 2, 32, e.tr1);
	})), t["--lu-wf-ring"] = gm(V(38, 8, (t) => {
		t.hline(2, 0, 34, e.ink0), t.hline(2, 7, 34, e.ink0), t.vline(0, 2, 4, e.ink0), t.vline(37, 2, 4, e.ink0), t.px(1, 1, e.ink0), t.px(36, 1, e.ink0), t.px(1, 6, e.ink0), t.px(36, 6, e.ink0), t.hline(2, 1, 34, e.g5), t.hline(2, 6, 34, e.g2), t.vline(1, 2, 4, e.g4), t.vline(36, 2, 4, e.g3);
	})), t["--lu-wf-pip"] = gm(V(7, 7, (t) => mn(t, 3, 3, 2, z.ruby(), { setting: [
		e.rb3,
		e.rb2,
		e.rb1
	] }))), t["--lu-wf-alert"] = gm(V(7, 12, (t) => t.rows(0, 0, cm, {
		O: e.ink0,
		Y: e.em2,
		H: e.em3,
		D: e.em1
	}))), t["--lu-wf-ret-tl"] = gm(Hf(1, 1)), t["--lu-wf-ret-tr"] = gm(Hf(-1, 1)), t["--lu-wf-ret-bl"] = gm(Hf(1, -1)), t["--lu-wf-ret-br"] = gm(Hf(-1, -1)), t["--lu-wf-heart"] = gm(Ue(2, z.ruby()));
	let n = mm();
	return t["--lu-wf-edge"] = gm(V(136, 34, (e) => {
		n.forEach((t, n) => {
			hm(e, n * lm, 0, t, !1), hm(e, n * lm, lm, t, !0);
		});
	})), _m = t, t;
}
var ym = Object.freeze({
	anchor() {
		return this;
	},
	set() {
		return this;
	},
	show() {
		return this;
	},
	hide() {
		return this;
	}
}), bm = class {
	constructor(e, t) {
		this._owner = t;
		let n = document.createElement("div");
		n.className = "lu-ebar", n.innerHTML = "<div class=\"lu-ebar__in\"><div class=\"lu-ebar__name\"><span class=\"lu-ebar__lv\"></span><span class=\"lu-ebar__lvn\"></span><span class=\"lu-ebar__nm\"></span></div><div class=\"lu-ebar__frame\"><i class=\"lu-ebar__lag\"></i><i class=\"lu-ebar__fill\"></i></div><i class=\"lu-ebar__pip\"></i></div>", e.appendChild(n), this.el = n, this._fill = n.querySelector(".lu-ebar__fill"), this._lag = n.querySelector(".lu-ebar__lag"), this._nameEl = n.querySelector(".lu-ebar__name"), this._parts = [
			n.querySelector(".lu-ebar__lv"),
			n.querySelector(".lu-ebar__lvn"),
			n.querySelector(".lu-ebar__nm")
		], this._partText = this._parts.map((e) => {
			let t = document.createTextNode("");
			return e.appendChild(t), t;
		}), t._styleNameParts(this._parts), this.ref = null, this.oy = 0, this.on = !1, this.out = !1, this.x = NaN, this.y = NaN, this._q = -1, this._pip = !1, this._elite = !1, this._lv = -1, this._name = "", this._snap = !0, this._snapClass = !1, this._nameW = 0, this._nameL = 0, this._nameT = 0, this._laidFor = "", this._bw = 0, this._bu = 0, this._bd = 0, t._barBox(this);
	}
	anchor(e, t = 0) {
		return e !== this.ref && (this.ref = e ?? null, this._snap = !0, this.x = NaN), this.oy = +t || 0, this;
	}
	set(e, t) {
		this._snap ? (this._snap = !1, this._snapClass || (this._snapClass = !0, this._lag.classList.add("is-snap"))) : this._snapClass && (this._snapClass = !1, this._lag.classList.remove("is-snap"));
		let n = e > 0 ? e < 1 ? e : 1 : 0, r = Math.round(n * 32);
		if (n > 0 && r === 0 ? r = 1 : n < 1 && r === 32 && (r = 31), r !== this._q) {
			this._q = r;
			let e = `scaleX(${r / 32})`;
			this._fill.style.transform = e, this._lag.style.transform = e;
		}
		let i = !1, a = !1, o = !!(t && t.pip);
		o !== this._pip && (this._pip = o, this.el.classList.toggle("is-pip", o), i = !0);
		let s = !!(t && t.elite);
		if (s !== this._elite && (this._elite = s, this.el.classList.toggle("is-elite", s), i = !0, a = s), s) {
			let e = t.level | 0, n = t.name ? String(t.name) : "";
			(e !== this._lv || n !== this._name) && (this._lv = e, this._name = n, a = !0);
		}
		return a ? this._owner._layoutName(this) : i && this._owner._barBox(this), this;
	}
	show() {
		return this.on || (this.on = !0, this._snap = !0, this.x = NaN, this.el.classList.add("is-on")), this;
	}
	hide() {
		return this.on && (this.on = !1, this.el.classList.remove("is-on")), this;
	}
}, xm = class {
	constructor(e) {
		let t = document.createElement("div");
		t.className = "lu-edge", t.innerHTML = "<i class=\"lu-edge__glow\"></i><i class=\"lu-edge__a\"></i>", e.appendChild(t), this.el = t, this.ref = null, this.oy = 0, this.on = !1, this.inside = !1, this.x = NaN, this.y = NaN, this.tx = 0, this.ty = 0, this.horiz = !1, this.o = -1, this._windup = !1;
	}
	anchor(e, t = 0) {
		return this.ref = e ?? null, this.oy = +t || 0, this;
	}
	set(e) {
		let t = !!(e && e.windup);
		return t !== this._windup && (this._windup = t, this.el.classList.toggle("is-windup", t)), this;
	}
	show() {
		return this.on || (this.on = !0, this.x = NaN, this.el.classList.add("is-on")), this;
	}
	hide() {
		return this.on && (this.on = !1, this.el.classList.remove("is-on")), this;
	}
}, Sm = class {
	constructor(e) {
		this.root = e, rn("worldfx", Ap), this._sroot = Ke(e), this._scale = null, this._px = 2, this._fpx = 1, this._dpx = 1, this._roleBoxes = /* @__PURE__ */ new Map(), this._applyScale(this._sroot?.scale ?? null);
		let t = document.createElement("div");
		t.className = "lu-worldfx", t.setAttribute("aria-hidden", "true");
		for (let [e, n] of Object.entries(vm())) t.style.setProperty(e, n);
		e.insertBefore(t, e.querySelector(":scope > .lu-prompt") ?? e.firstChild), this.element = t, this._bars = [];
		for (let e = 0; e < Mp; e++) this._bars.push(new bm(t, this));
		this._edges = [];
		for (let e = 0; e < Np; e++) this._edges.push(new xm(t));
		this._alerts = [];
		for (let e = 0; e < Pp; e++) {
			let e = document.createElement("div");
			e.className = "lu-alert", e.innerHTML = "<i class=\"lu-alert__i\"></i>", t.appendChild(e), this._alerts.push({
				el: e,
				ref: null,
				oy: 0,
				end: 0,
				live: !1,
				flip: !1,
				out: !1,
				x: NaN,
				y: NaN
			});
		}
		this._alertNext = 0;
		let n = document.createElement("div");
		n.className = "lu-reticle", n.innerHTML = "<i class=\"lu-reticle__c lu-reticle__c--tl\"></i><i class=\"lu-reticle__c lu-reticle__c--tr\"></i><i class=\"lu-reticle__c lu-reticle__c--bl\"></i><i class=\"lu-reticle__c lu-reticle__c--br\"></i><i class=\"lu-reticle__h\"></i>", t.appendChild(n), this._reticle = {
			el: n,
			ref: null,
			oy: 0,
			on: !1,
			out: !1,
			x: NaN,
			y: NaN
		}, this._nums = [];
		for (let e = 0; e < jp; e++) {
			let e = document.createElement("div");
			e.className = "lu-num";
			let n = document.createElement("span");
			n.className = "lu-num__t";
			let r = document.createElement("span");
			r.className = "lu-num__x";
			let i = document.createTextNode("");
			r.appendChild(i), n.appendChild(r), e.appendChild(n), t.appendChild(e), this._nums.push({
				el: e,
				t: n,
				x$: r,
				text: i,
				str: "",
				role: "",
				sk: "",
				k: 1,
				word: !1,
				pop: !1,
				live: !1,
				end: 0,
				flip: !1,
				wx: 0,
				wy: 0,
				wz: 0,
				dx: 0,
				dy: 0,
				out: !1,
				x: NaN,
				y: NaN,
				hw: NaN,
				mid: NaN,
				mb: 0
			});
		}
		this._numNext = 0, this._rng = new Oe(28014), this._iv = [], this._boxN = {
			w: 0,
			u: 0,
			d: 0
		}, this._boxNp = {
			w: 0,
			u: 0,
			d: 0
		}, this._boxO = {
			w: 0,
			u: 0,
			d: 0
		}, this._boxOp = {
			w: 0,
			u: 0,
			d: 0
		}, this._span = {
			lo: 0,
			hi: 0
		}, this._keep = {
			w: 0,
			u: 0,
			d: 0
		}, this._pins = [], this._pinEls = /* @__PURE__ */ new Map(), We()?.ensure(Object.values(nm).map((e) => R(`worldfx.${e}`)).concat(R("worldfx.lv"))), this._vp = new ye(), this._m = this._vp.elements, this._ready = !1, this._cx = 0, this._cy = 0, this._cw = 1, this._sx = 0, this._sy = 0, this._w = e.clientWidth || window.innerWidth, this._h = e.clientHeight || window.innerHeight, this._ro = typeof ResizeObserver == "function" ? new ResizeObserver(() => {
			this._w = e.clientWidth || window.innerWidth, this._h = e.clientHeight || window.innerHeight, this._applyScale(this._sroot?.scale ?? null) && this._refit(), this._invalidate();
		}) : null, this._ro?.observe(e), this._offScale = lt(e, (e) => {
			this._applyScale(e), this._refit(), this._invalidate();
		}), this._panels = [], this._panelOn = 0, this._zones = [];
		for (let e = 0; e < 8; e++) this._zones.push({
			l: 0,
			t: 0,
			r: 0,
			b: 0,
			solo: !1
		});
		this._zoneN = 0, this._panelRo = null, this._panelMo = null, this._onPanelEnd = (e) => {
			for (let t of this._panels) if (e.target === t.el) {
				this._remeasurePanels();
				return;
			}
		};
	}
	setPanels(e) {
		this._disconnectPanels(), this._panels = [];
		let t = [...e ?? []], n = t.length ? this.root.querySelector(":scope > .lu-banner") : null;
		n instanceof HTMLElement && t.push({
			el: n,
			box: () => n.querySelector(":scope > .grp"),
			shown: () => n.classList.contains("is-in") || n.classList.contains("is-out")
		});
		for (let e of t) {
			let t = typeof Element < "u" && e instanceof Element ? e : e?.el;
			if (!t) continue;
			let n = t === e ? null : e.shown ?? null, r = t === e ? null : e.box ?? null, i = t !== e && e.merge === !1;
			this._panels.push({
				el: t,
				shown: n,
				boxOf: r,
				solo: i,
				on: !1,
				has: !1,
				l: 0,
				t: 0,
				r: 0,
				b: 0
			});
		}
		if (this._panels.length && typeof ResizeObserver == "function") {
			this._panelRo = new ResizeObserver(() => this._measurePanels()), this._panelRo.observe(this.root), this._panelMo = typeof MutationObserver == "function" ? new MutationObserver(() => this._remeasurePanels()) : null;
			for (let e of this._panels) this._panelRo.observe(e.el), this._panelMo?.observe(e.el, {
				attributes: !0,
				attributeFilter: ["class", "style"]
			}), e.el.addEventListener("transitionend", this._onPanelEnd), e.el.addEventListener("animationend", this._onPanelEnd);
		}
	}
	number(e, t, n, r, i = "dmg") {
		let a = tm.has(i) ? i : "dmg", o = performance.now(), s = sm(nm, a) ? nm[a] : typeof r == "string" && sm(rm, r) ? rm[r] : null, c = s ? R(`worldfx.${s}`) : String(r ?? ""), l = a === "crit" && !s ? "numL" : s || c && !am.test(c) ? "name" : "big", u = l === "name", d = (r) => Math.abs(r.wx - e) < .8 && Math.abs(r.wz - n) < .8 && Math.abs(r.wy - t) < 1.2;
		if (u) for (let e = 0; e < jp; e++) {
			let t = this._nums[e];
			if (t.live && t.word && t.str === c && t.end - o >= 280 && d(t)) return;
		}
		let f = this._nums[this._numNext];
		this._numNext = (this._numNext + 1) % jp;
		let p = im.has(a), m = this._sizeK(l), h = 0;
		for (let e = 0; e < jp; e++) {
			let t = this._nums[e];
			t === f || !t.live || t.end - o < 280 || d(t) && h++;
		}
		f.wx = e, f.wy = t, f.wz = n;
		let g = this._px, _ = this._rng.range(-6, Hp) * g, v = this._rng.range(-6, Hp) * g;
		if (h === 0) f.dx = _, f.dy = v;
		else {
			let e = (this._roleBox(l, m).L + 3 * g) * (p ? 1.5 : 1);
			f.dx = u ? _ * .25 : (h % 2 ? Up : -9) * g + _ * .25, f.dy = -h * e + v * .2;
		}
		f.end = o + Fp, f.live = !0, f.word = u, f.pop = p, this._styleNumber(f, l), c !== f.str && (f.str = c, f.text.nodeValue = c), this._fitNumber(f), this._avoid(f, o), f.flip = !f.flip, f.el.className = `lu-num lu-num--${a} ${f.flip ? "is-a" : "is-b"}`, this._pins.push(f), f.out = !1, f.x = NaN, this._ready && this._placeNumber(f);
	}
	bar(e) {
		return this._bars[e] ?? ym;
	}
	edge(e) {
		return this._edges[e] ?? ym;
	}
	alert(e, t = 0) {
		if (!e) return;
		let n = this._alerts[this._alertNext];
		this._alertNext = (this._alertNext + 1) % Pp, n.ref = e, n.oy = +t || 0, n.end = performance.now() + Ip, n.live = !0, n.flip = !n.flip, n.out = !1, n.x = NaN, n.el.className = `lu-alert ${n.flip ? "is-a" : "is-b"}`, this._ready && this._placeAlert(n);
	}
	reticle(e, t = 0) {
		let n = this._reticle;
		n.oy = +t || 0;
		let r = !!e;
		e !== n.ref && (n.ref = e ?? null, n.x = NaN), r !== n.on && (n.on = r, n.el.classList.toggle("is-on", r));
	}
	update(e, t) {
		if (!t) return;
		t.updateMatrixWorld(), this._vp.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), this._ready = !0;
		let n = performance.now(), r = this._buildZones(), i = this._bars;
		for (let e = 0; e < Mp; e++) {
			let t = i[e];
			if (!t.on) continue;
			let n = t.ref, a = !!n && this._screen(n.x, n.y + t.oy, n.z);
			this._setOut(t, !a), a && (r && this._clear(this._sx, this._sy, t._bw, t._bu, t._bd), this._move(t, this._sx, this._sy));
		}
		let a = this._edges, o = 0;
		for (let e = 0; e < Np; e++) {
			let t = a[e];
			t.on && this._placeEdge(t) && o++;
		}
		o > 1 && this._spreadEdges();
		for (let e = 0; e < Np; e++) {
			let t = a[e];
			t.on && !t.inside && this._moveEdge(t);
		}
		let s = this._alerts;
		for (let e = 0; e < Pp; e++) {
			let t = s[e];
			if (t.live) {
				if (n >= t.end) {
					t.live = !1, t.ref = null, t.el.className = "lu-alert";
					continue;
				}
				this._placeAlert(t);
			}
		}
		let c = this._reticle;
		if (c.on) {
			let e = c.ref, t = this._screen(e.x, e.y + c.oy, e.z);
			if (this._setOut(c, !t), t) {
				let e = 17 * this._px + 1;
				r && this._clear(this._sx, this._sy, e, e, e), this._move(c, this._sx, this._sy);
			}
		}
		let l = this._nums;
		for (let e = 0; e < jp; e++) {
			let t = l[e];
			if (t.live) {
				if (n >= t.end) {
					t.live = !1, t.el.className = "lu-num";
					continue;
				}
				this._placeNumber(t);
			}
		}
		this._pins.length && this._pin();
	}
	_pin() {
		let e = this._pinEls;
		for (let t of this._pins) t.live && (e.set(t.t, t), e.set(t.x$, t));
		if (this._pins.length = 0, e.size) {
			for (let t of this.element.getAnimations({ subtree: !0 })) {
				let n = e.get(t.effect?.target);
				n && (t.startTime = n.end - Fp);
			}
			e.clear();
		}
	}
	clear() {
		for (let e of this._nums) e.live && (e.live = !1, e.el.className = "lu-num");
		for (let e of this._bars) e.hide();
		for (let e of this._edges) e.hide();
		for (let e of this._alerts) e.live && (e.live = !1, e.ref = null, e.el.className = "lu-alert");
		this.reticle(null);
	}
	get liveNumbers() {
		let e = 0;
		for (let t of this._nums) t.live && e++;
		return e;
	}
	dispose() {
		this._ro?.disconnect(), this._offScale?.(), this._disconnectPanels(), this._panels = [], this.element.remove();
	}
	_applyScale(e) {
		let t = e ?? vt({
			w: window.innerWidth,
			h: window.innerHeight,
			dpr: window.devicePixelRatio || 1
		}), n = 1 / t.dpr;
		return t.cssPx === this._px && t.cssFpx === this._fpx && n === this._dpx && this._scale ? !1 : (this._scale = t, this._px = t.cssPx, this._fpx = t.cssFpx, this._dpx = n, this._roleBoxes.clear(), !0);
	}
	_snapPx(e) {
		return Math.round(e / this._dpx) * this._dpx;
	}
	_roleBox(e, t = 1) {
		let n = t === 1 ? e : `${e}*${t}`, r = this._roleBoxes.get(n);
		if (!r) {
			let i = Wt()[e], a = (i.u === "fpx" ? this._fpx : this._px) * t;
			r = {
				mid: this._snapPx(i.mid * a),
				L: i.L * a,
				ink: i.ink * a
			}, this._roleBoxes.set(n, r);
		}
		return r;
	}
	_sizeK(e) {
		let t = this._scale;
		return e === "numL" && t ? 2 * t.fpx / t.px : 1;
	}
	_styleNumber(e, t) {
		let n = this._sizeK(t), r = n === 1 ? t : `${t}*${n}`;
		if (e.role = t, e.k = n, r === e.sk) return;
		e.sk = r;
		let i = e.x$.style;
		if (Dt(e.x$, t, { ol8: !0 }), n !== 1) {
			let e = Wt()[t], r = e.u === "fpx" ? "fpx" : "px";
			i.fontSize = `calc(var(--${r}) * ${+(e.em * n).toFixed(4)})`, i.lineHeight = `calc(var(--${r}) * ${+(e.L * n).toFixed(4)})`;
		}
		i.setProperty("--lu-fs", i.fontSize), i.setProperty("--lu-lh", i.lineHeight);
	}
	_fitNumber(e) {
		if (!e.role) return;
		let t = this._roleBox(e.role, e.k), n = this._snapPx(L(e.str, e.role) * this._px * e.k / 2), r = e.t.style;
		n !== e.hw && (e.hw = n, r.left = `${-n}px`, r.setProperty("--lu-hw", `${n}px`)), t.mid !== e.mid && (e.mid = t.mid, r.top = `${-t.mid}px`, r.setProperty("--lu-mid", `${t.mid}px`)), e.mb = t.L - t.mid;
	}
	_labelBox(e, t, n) {
		let r = this._px, i = this._roleBox(e.role || "big", e.k).ink * t / 2;
		return n.w = (e.hw || 0) * t + r + 1, n.u = i + r, n.d = i + 2 * r, n;
	}
	_avoid(e, t) {
		if (!this._ready || !this._screen(e.wx, e.wy, e.wz)) return;
		let n = this._sx, r = this._sy, i = document.timeline?.currentTime, a = typeof i == "number" ? Math.max(0, t - i) : 0;
		this._numberSpot(e, n, r, !1);
		let o = this._sx, s = this._sy;
		this._numberSpot(e, n, r, !0);
		let c = this._sx, l = this._sy, u = c !== o || l !== s;
		if (!e.word && !this._blocked(l, this._forbid(e, t, a, c, !1, !u))) return;
		let d = this._forbid(e, t, a, c, !0, !1);
		d && (c !== o && (e.dx = c - n), e.dy = this._nearest(l, d) - r);
	}
	_forbid(e, t, n, r, i, a) {
		let o = this._iv, s = 0, c = this._px, l = Qp * c, u = this._labelBox(e, 1, this._boxN), d = e.pop ? this._labelBox(e, 2, this._boxNp) : u;
		for (let i = 0; i < jp; i++) {
			let f = this._nums[i];
			if (f === e || !f.live || a && !f.word) continue;
			let p = t - (f.end - Fp), m = Math.min(Yp, 760 - p);
			if (m <= 0 || !this._screen(f.wx, f.wy, f.wz)) continue;
			this._numberSpot(f, this._sx, this._sy, !0);
			let h = this._sx - r, g = this._sy, _ = this._labelBox(f, 1, this._boxO), v = f.pop ? this._labelBox(f, 2, this._boxOp) : _;
			if (Math.abs(h) >= d.w + v.w + l) continue;
			let y = NaN, b = NaN;
			for (let t = -Math.min(n, p); t < m; t = t < 0 ? Math.min(0, t + Zp) : t + Zp) {
				let n = Math.max(0, p + t - Xp);
				if (n >= Yp) break;
				let r = Math.min(p + t + Xp, 751), i = e.pop && t < Gp ? d : u, a = f.pop && n < Gp ? v : _;
				if (Math.abs(h) >= i.w + a.w + l) continue;
				let m = $p(t, e.pop) * c, x = em(n, r, f.pop, this._span), S = g + x.lo * c - a.u - l - m - i.d, C = g + x.hi * c + a.d + l - m + i.u;
				(S !== y || C !== b) && (y = S, b = C, o[s++] = S, o[s++] = C);
			}
		}
		if (i) {
			let t = this._keepBox(e);
			if (this._panelOn) for (let e = 0; e < this._zoneN; e++) {
				let n = this._zones[e];
				r + t.w <= n.l || r - t.w >= n.r || (o[s++] = n.t - t.d, o[s++] = n.b + t.u);
			}
			o[s++] = -Infinity, o[s++] = t.u, o[s++] = this._h - t.d, o[s++] = Infinity;
		}
		return o.length = s, s;
	}
	_blocked(e, t) {
		let n = this._iv;
		for (let r = 0; r < t; r += 2) if (n[r] < e && e < n[r + 1]) return !0;
		return !1;
	}
	_nearest(e, t) {
		let n = this._iv, r = e;
		for (let e = !0; e;) {
			e = !1;
			for (let i = 0; i < t; i += 2) n[i] < r && r < n[i + 1] && (r = n[i], e = !0);
		}
		let i = e;
		for (let e = !0; e;) {
			e = !1;
			for (let r = 0; r < t; r += 2) n[r] < i && i < n[r + 1] && (i = n[r + 1], e = !0);
		}
		let a = r > -Infinity, o = i < Infinity;
		return a && (!o || e - r <= i - e) ? r : o ? i : e;
	}
	_refit() {
		for (let e of this._nums) e.role && (this._styleNumber(e, e.role), this._fitNumber(e));
		for (let e of this._bars) e._elite ? this._layoutName(e) : this._barBox(e);
	}
	_styleNameParts(e) {
		let t = $e();
		Dt(e[0], "tiny", {
			ol: !0,
			drop: !0
		}), Dt(e[1], "num", {
			ol: !0,
			drop: !0
		}), Dt(e[2], t ? "line" : "small", t ? { ol8: !0 } : {
			ol: !0,
			drop: !0,
			track: 1
		});
	}
	_layoutName(e) {
		let t = $e(), n = t ? "line" : "small", r = +!t, i = e._lv > 0, a = i ? R("worldfx.lv") : "", o = i ? String(e._lv) : "", s = e._name ? ht(t ? e._name : et(e._name), n, om, r) : "", c = [
			a,
			o,
			s
		], l = [
			"tiny",
			"num",
			n
		], u = [
			i ? L(a, "tiny") : 0,
			i ? L(o, "num") : 0,
			s ? L(s, n, r) : 0
		], d = [
			i ? 2 : 0,
			i && s ? 4 : 0,
			0
		], f = u[0] + d[0] + u[1] + d[1] + u[2], p = this._px, m = -Math.round(f / 2), h = 0;
		for (let e = 0; e < 3; e++) c[e] && (h = Math.max(h, this._roleBox(l[e]).ink));
		let g = -9 * p - h / 2, _ = Infinity, v = -Infinity, y = [
			0,
			0,
			0
		];
		for (let e = 0; e < 3; e++) {
			let t = this._roleBox(l[e]);
			y[e] = this._snapPx(g - t.mid), c[e] && (_ = Math.min(_, y[e]), v = Math.max(v, y[e] + t.L));
		}
		_ < v || (_ = g, v = g);
		let b = e._nameEl.style;
		b.left = `${m * p}px`, b.top = `${_}px`, b.width = `${f * p}px`, b.height = `${v - _}px`;
		let x = 0;
		for (let t = 0; t < 3; t++) {
			e._partText[t].nodeValue !== c[t] && (e._partText[t].nodeValue = c[t]);
			let n = e._parts[t].style;
			n.left = `${x * p}px`, n.top = `${y[t] - _}px`, x += u[t] + d[t];
		}
		if (e._nameW = f, e._nameL = m, e._nameT = _, this._barBox(e), s) {
			let t = e._name, n = e._lv;
			We()?.ensure(s).then(() => {
				e._elite && e._name === t && e._lv === n && e._laidFor !== t && (e._laidFor = t, this._layoutName(e));
			});
		}
	}
	_barBox(e) {
		let t = this._px;
		if (e._pip) e._bw = 4 * t + 1, e._bu = 7 * t + 1, e._bd = 2;
		else if (e._elite) {
			let n = e._nameL, r = e._nameW, i = r > 0 ? Math.max(-n, n + r) * t + t : 0;
			e._bw = Math.max(19 * t, i) + 1, e._bu = Math.max(6 * t, r > 0 ? -e._nameT + t : 0) + 2, e._bd = 2 * t + 2;
		} else e._bw = 17 * t + 1, e._bu = 4 * t + 2, e._bd = 2;
	}
	_clip(e, t, n) {
		let r = this._m;
		this._cx = r[0] * e + r[4] * t + r[8] * n + r[12], this._cy = r[1] * e + r[5] * t + r[9] * n + r[13], this._cw = r[3] * e + r[7] * t + r[11] * n + r[15];
	}
	_screen(e, t, n) {
		this._clip(e, t, n);
		let r = this._cw;
		if (!(r > 1e-4)) return !1;
		let i = this._cx / r, a = this._cy / r;
		return i < -1.25 || i > 1.25 || a < -1.25 || a > 1.35 ? !1 : (this._sx = (i * .5 + .5) * this._w, this._sy = (.5 - a * .5) * this._h, !0);
	}
	_move(e, t, n) {
		let r = Math.round(t), i = Math.round(n);
		(r !== e.x || i !== e.y) && (e.x = r, e.y = i, e.el.style.transform = `translate3d(${r}px,${i}px,0)`);
	}
	_setOut(e, t) {
		t !== e.out && (e.out = t, e.el.classList.toggle("is-out", t));
	}
	_placeNumber(e) {
		let t = this._screen(e.wx, e.wy, e.wz);
		this._setOut(e, !t), t && (this._numberSpot(e, this._sx, this._sy, !0), this._move(e, this._sx, this._sy));
	}
	_keepBox(e) {
		let t = this._px, n = e.pop ? 2 : 1, r = this._keep;
		return r.w = (e.hw || 0) * n + t + 2, r.u = Math.max(e.mid * n, e.mid + 12 * t) + t + 2, r.d = Math.max(e.mb * n, e.mb + 2 * t) + 2 * t + 2, r;
	}
	_numberSpot(e, t, n, r) {
		let i = t + e.dx, a = n + e.dy, o = this._keepBox(e);
		if (i - o.w < 0 ? i = o.w : i + o.w > this._w && (i = this._w - o.w), r && this._panelOn) {
			this._clear(i, a, o.w, o.u, o.d);
			return;
		}
		this._sx = i, this._sy = a;
	}
	_placeAlert(e) {
		let t = e.ref, n = this._screen(t.x, t.y + e.oy, t.z);
		this._setOut(e, !n), n && (this._panelOn && this._clear(this._sx, this._sy, 4.5 * this._px + 1, 15 * this._px, 4 * this._px + 1), this._move(e, this._sx, this._sy));
	}
	_buildZones() {
		let e = this._panels, t = this._zones, n = 0, r = 0;
		for (let i = 0; i < e.length; i++) {
			let a = e[i];
			if (a.on = a.has && (!a.shown || !!a.shown()), !a.on) continue;
			n++, r >= t.length && t.push({
				l: 0,
				t: 0,
				r: 0,
				b: 0,
				solo: !1
			});
			let o = t[r++];
			o.solo = a.solo, o.l = a.l - zp, o.t = a.t - zp, o.r = a.r + zp, o.b = a.b + zp;
		}
		for (let e = !0; e;) {
			e = !1;
			for (let n = 0; n < r && !e; n++) for (let i = n + 1; i < r; i++) {
				let a = t[n], o = t[i];
				if (a.solo || o.solo) continue;
				let s = Math.max(a.l, o.l) - Math.min(a.r, o.r), c = Math.max(a.t, o.t) - Math.min(a.b, o.b);
				if (!(s < 0 && c < Bp || c < 0 && s < Bp) || (Math.max(a.r, o.r) - Math.min(a.l, o.l)) * (Math.max(a.b, o.b) - Math.min(a.t, o.t)) > Vp * ((a.r - a.l) * (a.b - a.t) + (o.r - o.l) * (o.b - o.t))) continue;
				a.l = Math.min(a.l, o.l), a.t = Math.min(a.t, o.t), a.r = Math.max(a.r, o.r), a.b = Math.max(a.b, o.b);
				let l = t[--r];
				t[r] = o, t[i] = l, e = !0;
				break;
			}
		}
		return this._zoneN = r, this._panelOn = n, n;
	}
	_hitsZone(e, t, n, r, i, a) {
		let o = this._zones;
		for (let s = 0; s < this._zoneN; s++) {
			if (s === a) continue;
			let c = o[s];
			if (e + n > c.l && e - n < c.r && t + i > c.t && t - r < c.b) return !0;
		}
		return !1;
	}
	_clear(e, t, n, r, i) {
		let a = this._zones, o = this._w, s = this._h;
		for (let c = 0; c < 3; c++) {
			let c = -1;
			for (let o = 0; o < this._zoneN; o++) {
				let s = a[o];
				if (e + n > s.l && e - n < s.r && t + i > s.t && t - r < s.b) {
					c = o;
					break;
				}
			}
			if (c < 0) break;
			let l = a[c], u = Infinity, d = Infinity, f = e, p = t, m = e, h = t;
			for (let a = 0; a < 4; a++) {
				let g = e, _ = t;
				if (a === 0) {
					if (g = l.l - n, g - n < 0) continue;
				} else if (a === 1) {
					if (g = l.r + n, g + n > o) continue;
				} else if (a === 2) {
					if (_ = l.t - i, _ - r < 0) continue;
				} else if (_ = l.b + r, _ + i > s) continue;
				let v = Math.abs(g - e) + Math.abs(_ - t);
				v < d && (d = v, m = g, h = _), v < u && !this._hitsZone(g, _, n, r, i, c) && (u = v, f = g, p = _);
			}
			if (u < Infinity) e = f, t = p;
			else if (d < Infinity) e = m, t = h;
			else break;
		}
		this._sx = e, this._sy = t;
	}
	_measurePanels() {
		let e = this.root.getBoundingClientRect();
		for (let t of this._panels) {
			let n = t.boxOf ? t.boxOf() : t.el, r = n ? n.getBoundingClientRect() : null;
			t.has = !!r && r.width > 0 && r.height > 0 && t.el.isConnected && getComputedStyle(t.el).visibility !== "hidden", r && (t.l = r.left - e.left, t.t = r.top - e.top, t.r = r.right - e.left, t.b = r.bottom - e.top);
		}
		for (let e of this._nums) e.x = NaN;
		for (let e of this._bars) e.x = NaN;
		for (let e of this._edges) e.x = NaN;
		for (let e of this._alerts) e.x = NaN;
		this._reticle.x = NaN;
	}
	_remeasurePanels() {
		let e = this._panelRo;
		e && (e.unobserve(this.root), e.observe(this.root));
	}
	_disconnectPanels() {
		this._panelRo?.disconnect(), this._panelMo?.disconnect(), this._panelRo = null, this._panelMo = null;
		for (let e of this._panels) e.el.removeEventListener("transitionend", this._onPanelEnd), e.el.removeEventListener("animationend", this._onPanelEnd), e.on = !1;
		this._panelOn = 0, this._zoneN = 0;
	}
	_placeEdge(e) {
		let t = e.ref;
		if (!t) return this._setInside(e, !0), !1;
		this._clip(t.x, t.y + e.oy, t.z);
		let n = this._w, r = this._h, i = n * .5, a = r * .5, o = Lp * this._px, s = Math.max(1, i - o), c = Math.max(1, a - o), l = this._cw, u, d;
		if (l > 1e-4) {
			if (u = this._cx / l * i, d = -(this._cy / l) * a, Math.abs(u) <= s && Math.abs(d) <= c) return this._setInside(e, !0), !1;
		} else u = this._cx * i, d = -this._cy * a, u === 0 && d === 0 && (d = 1);
		this._setInside(e, !1);
		let f = Math.min(s / (Math.abs(u) || 1e-9), c / (Math.abs(d) || 1e-9));
		this._panelOn && (f = this._edgeClear(i, a, u, d, f, 10 * this._px + 1)), e.tx = Math.round(i + u * f), e.ty = Math.round(a + d * f), e.horiz = Math.abs(d) * s >= Math.abs(u) * c;
		let p = (Math.round(Math.atan2(d, u) / (Math.PI / 4)) % 8 + 8) % 8;
		if (p !== e.o) {
			e.o = p;
			let t = e.el.style;
			t.setProperty("--o", String(p)), t.setProperty("--nx", String(fm[p][0])), t.setProperty("--ny", String(fm[p][1]));
		}
		return !0;
	}
	_moveEdge(e) {
		let t = Math.round(e.tx), n = Math.round(e.ty);
		(t !== e.x || n !== e.y) && (e.x = t, e.y = n, e.el.style.transform = `translate3d(${t}px,${n}px,0)`);
	}
	_spreadEdges() {
		let e = this._edges, t = Math.ceil(Rp * this._px), n = Math.round(Lp * this._px), r = Math.round(this._w), i = Math.round(this._h);
		for (let a = 0; a < 4; a++) {
			let a = !1;
			for (let o = 0; o < Np; o++) {
				let s = e[o];
				if (s.on && !s.inside) for (let c = o + 1; c < Np; c++) {
					let l = e[c];
					if (!l.on || l.inside) continue;
					let u = l.tx - s.tx, d = l.ty - s.ty;
					if (Math.abs(u) >= t || Math.abs(d) >= t) continue;
					let f = s.horiz === l.horiz ? s.horiz : Math.abs(u) >= Math.abs(d), p = f ? u : d, m = p > 0 || p === 0 && o < c ? 1 : -1, h = Math.ceil((t - Math.abs(p)) / 2);
					f ? (s.tx = Math.min(r - n, Math.max(n, s.tx - m * h)), l.tx = Math.min(r - n, Math.max(n, l.tx + m * h))) : (s.ty = Math.min(i - n, Math.max(n, s.ty - m * h)), l.ty = Math.min(i - n, Math.max(n, l.ty + m * h))), a = !0;
				}
			}
			if (!a) break;
		}
	}
	_edgeClear(e, t, n, r, i, a) {
		let o = this._zones;
		for (let s = 0; s < 3; s++) {
			let s = !1;
			for (let c = 0; c < this._zoneN; c++) {
				let l = o[c], u = 0, d = Infinity;
				if (Math.abs(n) < 1e-9) {
					if (e < l.l - a || e > l.r + a) continue;
				} else {
					let t = (l.l - a - e) / n, r = (l.r + a - e) / n;
					u = Math.max(u, Math.min(t, r)), d = Math.min(d, Math.max(t, r));
				}
				if (Math.abs(r) < 1e-9) {
					if (t < l.t - a || t > l.b + a) continue;
				} else {
					let e = (l.t - a - t) / r, n = (l.b + a - t) / r;
					u = Math.max(u, Math.min(e, n)), d = Math.min(d, Math.max(e, n));
				}
				u > d || i < u || i > d || u <= 0 || (i = u - .001, s = !0);
			}
			if (!s) break;
		}
		return i;
	}
	_setInside(e, t) {
		t !== e.inside && (e.inside = t, e.el.classList.toggle("is-in", t));
	}
	_invalidate() {
		for (let e of this._nums) e.x = NaN;
		for (let e of this._bars) e.x = NaN;
		for (let e of this._edges) e.x = NaN;
		for (let e of this._alerts) e.x = NaN;
		this._reticle.x = NaN;
	}
}, Cm = .55, wm = 48, Tm = 78, Em = 96, Dm = "lu-root--results", Om = class {
	constructor(e) {
		this.root = e;
		let t = document.createElement("div");
		t.className = "lu-announce", t.setAttribute("aria-live", "polite"), e.appendChild(t), this.element = t, this._title = document.createElement("div"), this._sub = document.createElement("div"), this._queue = Promise.resolve(), this._pending = /* @__PURE__ */ new Map(), this._disposed = !1, this._flip = !1, this._showing = !1, this._gen = 0;
	}
	get visible() {
		return this._showing;
	}
	announce(e, t = "", { duration: n = 2.4, kind: r = "level", compact: i = !1, y: a = void 0 } = {}) {
		let o = Math.max(1.2, Number.isFinite(n) ? n : 2.4), s = r === "results" ? "results" : "level", c = this._gen, l = String(e ?? ""), u = String(t ?? ""), d = () => new Promise((e) => {
			if (this._disposed || c !== this._gen) {
				e();
				return;
			}
			let t = typeof a == "function" ? a() : a;
			this._show(l, u, o, s, !!i, Number.isFinite(t) ? Number(t) : null);
			let n = setTimeout(() => {
				this._pending.delete(n), this._hide(), e();
			}, o * 1e3);
			this._pending.set(n, e);
		});
		return this._queue = this._queue.then(d), We()?.ensure([l, u]), this._queue;
	}
	clear() {
		this._gen++;
		for (let [e, t] of this._pending) clearTimeout(e), t();
		this._pending.clear(), this._showing && this._hide();
	}
	dispose() {
		this._disposed = !0;
		for (let [e, t] of this._pending) clearTimeout(e), t();
		this._pending.clear(), this.root.classList.remove(Dm), this.element.remove();
	}
	_show(e, t, n, r, i, a) {
		let o = this.element;
		o.textContent = "", r === "results" ? this._results(e, t, a ?? Em) : this._level(e, t, a ?? (i ? wm : Tm)), o.style.setProperty("--lu-an-out", `${(n - Cm).toFixed(3)}s`), this._flip = !this._flip, o.className = `lu-announce lu-announce--${r}${i ? " lu-announce--compact" : ""} ${this._flip ? "is-a" : "is-b"}`, this.root.classList.toggle(Dm, r === "results"), this._showing = !0;
	}
	_level(e, t, n) {
		let r = B(), i = L(et(e), "head", 1), a = t ? L(t, "line") : 0, o = Math.max(102, i + 40, a + 30);
		o += o % 2;
		let s = Math.ceil(gt("head")), c = this._card(320 - o / 2 - 24, n, o + 48, 56 + s);
		F(c, Pt(o + 48, 50 + s, tt(r.band), (e, t) => Math.max(0, 1 - Math.hypot((e - .5) / .5, (t - .5) / .5)) * 1.4 * .7, [
			.25,
			.5,
			.7
		]), 320 - o / 2 - 24, n + 2, 1, "lu-announce__shade"), F(c, nt(o, "both"), 320 - o / 2, n + 9, 1, "lu-announce__rule"), F(c, V(9, 5, (e) => mn(e, 4, 2, 1, z.gold(), { setting: [
			r.g5,
			r.g4,
			r.g3
		] })), 316, n + 7), F(c, nt(o, "both"), 320 - o / 2, n + 45 + s, 1, "lu-announce__rule lu-announce__rule--b"), this._title = this._capsTitle(c, e, 320, n + 12, {
			font: "head",
			track: 1,
			color: r.g5,
			align: "center",
			ol: !0,
			cls: "lu-announce__title"
		});
		let l = $e() ? { ol8: !0 } : { ol: !0 };
		this._sub = P(c, t, 320, n + 33 + s, {
			font: "line",
			color: r.tx1,
			align: "center",
			...l,
			cls: "lu-announce__sub"
		});
	}
	_results(e, t, n) {
		let r = B(), i = L(et(e), "head", 1), a = t ? L(t, "body") : 0, o = Math.max(240, i + 60, a + 48);
		o += o % 2;
		let s = Math.ceil(gt("head")), c = Math.ceil(gt("body")), l = 64 + s + c, u = 320 - o / 2, d = this._card(u - 20, n - 20, o + 40, l + 40);
		_t(d, {
			size: "M",
			corners: z.gold(),
			cornerR: 2,
			trio: !0
		}, u, n, o, l), this._title = this._capsTitle(d, e, 320, n + 11, {
			font: "head",
			track: 1,
			color: r.g5,
			align: "center",
			drop: !0,
			cls: "lu-announce__title"
		});
		let f = Math.min(o - 40, Math.max(120, i));
		F(d, nt(f, "both"), 320 - Math.floor(f / 2), n + 38 + s, 1, "lu-announce__rule"), F(d, V(9, 5, (e) => mn(e, 4, 2, 1, z.gold(), { setting: [
			r.g5,
			r.g4,
			r.g3
		] })), 316, n + 36 + s), this._sub = P(d, t, 320, n + 44 + s, {
			font: "body",
			color: r.g5,
			align: "center",
			drop: !0,
			cls: "lu-announce__sub"
		});
	}
	_card(e, t, n, r) {
		let i = document.createElement("div");
		return i.className = "lu-announce__card", op(i, "tc", e, t, n, r, this.root), this.element.append(i), i;
	}
	_capsTitle(e, t, n, r, i) {
		let a = et(t), o = P(e, a, n, r, i);
		return a !== t && (o.textContent = t, o.classList.add("lu-caps")), o;
	}
	_hide() {
		this._showing = !1, this.root.classList.remove(Dm), this.element.className = "lu-announce";
	}
}, km = /* @__PURE__ */ new Set([
	"ShiftLeft",
	"ShiftRight",
	"ControlLeft",
	"ControlRight",
	"AltLeft",
	"AltRight",
	"MetaLeft",
	"MetaRight",
	"F5",
	"F11",
	"F12",
	"CapsLock",
	"Tab"
]), Am = 136, jm = class {
	constructor(e) {
		this.root = e;
		let t = document.createElement("div");
		t.className = "lu-death is-gone", t.setAttribute("aria-hidden", "true"), e.appendChild(t), this.element = t, this._vig = null, this._vigKey = "", this._inner = null, this._title = document.createElement("div"), this._sub = document.createElement("div"), this._prompt = document.createElement("div"), this._texts = {
			title: "\0",
			subtitle: "",
			prompt: ""
		}, this._visible = !1, this._accept = !1, this._armedAt = 0, this._armTimer = 0, this._goneTimer = 0, this._resolve = null, this._primeRaf = 0, this._primed = !1, this._disposed = !1, this._onKey = (e) => {
			!this._accepting() || e.repeat || km.has(e.code) || (e.preventDefault(), e.stopPropagation(), this._dismiss("key"));
		}, this._onPointer = (e) => {
			this._accepting() && (e.preventDefault(), e.stopPropagation(), this._dismiss("pointer"));
		}, this._offScale = lt(e, () => this._relayout());
	}
	get visible() {
		return this._visible;
	}
	get primed() {
		return this._primed;
	}
	prime({ title: e = "", subtitle: t = "", prompt: n = "" } = {}) {
		if (this._visible || this._primeRaf || typeof requestAnimationFrame != "function") return;
		this._layout(String(e ?? ""), String(t ?? ""), String(n ?? ""));
		let r = this.element;
		r.classList.remove("is-gone"), r.classList.add("is-prime");
		let i = 0, a = () => {
			if (this._primeRaf = 0, !this._visible && r.classList.contains("is-prime")) {
				if (++i < 3) {
					this._primeRaf = requestAnimationFrame(a);
					return;
				}
				r.classList.remove("is-prime"), r.classList.add("is-gone"), this._primed = !0;
			}
		};
		this._primeRaf = requestAnimationFrame(a);
	}
	show({ title: e = "", subtitle: t = "", prompt: n = "", armDelay: r = 1 } = {}) {
		this._settle(void 0), this._detach(), clearTimeout(this._goneTimer), clearTimeout(this._armTimer), this._cancelPrime();
		let i = [
			String(e ?? ""),
			String(t ?? ""),
			String(n ?? "")
		];
		this._layout(i[0], i[1], i[2]), We()?.ensure(i).then(() => this._relayout());
		let a = this.element;
		a.classList.remove("is-gone", "is-armed", "is-done", "is-off"), a.classList.add("is-on"), a.setAttribute("aria-hidden", "false"), this.root.classList.add("lu-root--death"), this._visible = !0;
		let o = Math.max(0, Number.isFinite(r) ? r : 1);
		return this._armedAt = performance.now() + o * 1e3, this._armTimer = setTimeout(() => {
			this._armTimer = 0, a.classList.add("is-armed");
		}, o * 1e3), this._accept = !0, window.addEventListener("keydown", this._onKey, !0), a.addEventListener("pointerdown", this._onPointer), new Promise((e) => {
			this._resolve = e;
		});
	}
	hide() {
		if (this._detach(), this._settle(void 0), clearTimeout(this._armTimer), this._armTimer = 0, !this._visible) return;
		this._visible = !1;
		let e = this.element;
		e.classList.remove("is-on"), e.classList.add("is-off"), e.setAttribute("aria-hidden", "true"), this.root.classList.remove("lu-root--death"), clearTimeout(this._goneTimer), this._goneTimer = setTimeout(() => {
			this._visible || (e.classList.remove("is-off"), e.classList.add("is-gone"));
		}, 400);
	}
	dispose() {
		this._disposed = !0, this._offScale?.(), this._detach(), this._settle(void 0), clearTimeout(this._armTimer), clearTimeout(this._goneTimer), this._cancelPrime(), this.root.classList.remove("lu-root--death"), this.element.remove();
	}
	_relayout() {
		if (this._disposed || this._texts.title === "\0") return;
		let { title: e, subtitle: t, prompt: n } = this._texts;
		this._texts.title = "\0", this._layout(e, t, n);
	}
	_layout(e, t, n) {
		let r = this.element, i = tn(this.root), a = Math.ceil(((i?.artW ?? 640) + 1) / 2), o = Math.ceil(((i?.artH ?? 360) + 1) / 2), s = `${a}x${o}`;
		if (s !== this._vigKey || !this._vig) {
			this._vigKey = s;
			let e = Zf(a, o);
			e.classList.add("px", "lu-death__vignette"), e.style.width = N(a * 2), e.style.height = N(o * 2), this._vig ? this._vig.replaceWith(e) : r.prepend(e), this._vig = e;
		}
		let c = this._texts;
		c.title === e && c.subtitle === t && c.prompt === n && this._inner || (this._texts = {
			title: e,
			subtitle: t,
			prompt: n
		}, this._inner?.remove(), this._build(e, t, n));
	}
	_build(e, t, n) {
		let r = B(), i = et(e), a = et(n), o = 2 * L(i, "head", 1), s = n ? L(a, "name", 1) : 0, c = t ? L(t, "body") : 0, l = dt.head, u = Math.max(219, Math.round(o * .62)) | 1, d = Math.max(o, u, s + 40, c) + 24, f = d + d % 2, p = Am - l.mid * 2 - 6, m = document.createElement("div");
		m.className = "lu-death__inner", op(m, "mc", 320 - f / 2, p, f, 248 - p, this.root), this.element.append(m), this._inner = m;
		let h = P(m, i, 320, Am - l.mid * 2, {
			font: "head",
			track: 1,
			color: r.g4,
			cls: "lu-death__title"
		});
		i !== e && (h.textContent = e, h.classList.add("lu-caps"));
		let g = h.style;
		g.fontSize = `calc(var(--px) * ${l.size * 2})`, g.lineHeight = `calc(var(--px) * ${l.L * 2})`, l.cjk || (g.letterSpacing = N(2)), g.textShadow = Mm(l.bold), g.left = N(320 - Math.floor(o / 2) - bt(m)[0]), g.top = N(Am - l.mid * 2 - bt(m)[1]), this._title = h;
		let _ = Am + Math.ceil(l.ink) + 6;
		F(m, it(u, z.ruby()), 320 - (u - 1) / 2, _, 1, "lu-death__divider"), this._sub = P(m, t, 320, _ + 17, {
			font: "body",
			color: r.tx1,
			align: "center",
			ol: !0,
			drop: !0,
			cls: "lu-death__sub"
		});
		let v = hp(m, 0, 0, null, null, "lu-death__prompt"), y = I(v, a, 320, 228, {
			font: "name",
			track: 1,
			color: r.tx1,
			align: "center",
			ol: !0,
			drop: !0,
			cls: "lu-death__prompt-text"
		});
		a !== n && (y.textContent = n, y.classList.add("lu-caps")), this._prompt = y, n && (F(v, Ue(2, z.ember()), 320 - Math.floor(s / 2) - 14, 225, 1, "lu-death__gem"), F(v, Ue(2, z.ember()), 320 + Math.ceil(s / 2) + 7, 225, 1, "lu-death__gem"));
	}
	_cancelPrime() {
		this._primeRaf && cancelAnimationFrame(this._primeRaf), this._primeRaf = 0, this.element.classList.remove("is-prime");
	}
	_accepting() {
		return this._accept && performance.now() >= this._armedAt;
	}
	_dismiss(e) {
		this._detach(), this.element.classList.add("is-done"), this._settle(e);
	}
	_detach() {
		this._accept = !1, window.removeEventListener("keydown", this._onKey, !0), this.element.removeEventListener("pointerdown", this._onPointer);
	}
	_settle(e) {
		let t = this._resolve;
		this._resolve = null, t && t(e);
	}
};
function Mm(e) {
	let t = (e) => e === 0 ? "0" : `calc(var(--px) * ${e})`, n = e ? `calc(${e} * 2)` : null, r = (e) => e === 0 ? n : `calc(var(--px) * ${e} + ${n})`, i = [
		[2, 0],
		[-2, 0],
		[0, 2],
		[0, -2],
		[2, 2],
		[-2, 2],
		[2, -2],
		[-2, -2]
	], a = [];
	n && a.push(`${n} 0 0 currentColor`);
	for (let [e, o] of i) a.push(`${t(e)} ${t(o)} 0 var(--g-ink0)`), n && a.push(`${r(e)} ${t(o)} 0 var(--g-ink0)`);
	return a.push(`0 ${t(4)} 0 var(--g-em1)`), n && a.push(`${n} ${t(4)} 0 var(--g-em1)`), a.join(", ");
}
//#endregion
//#region src/engine/ui/UI.js
var Nm = null, Pm = "<svg class=\"lu-filters\" width=\"0\" height=\"0\" aria-hidden=\"true\" focusable=\"false\">\n  <filter id=\"lu-crisp\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\" color-interpolation-filters=\"sRGB\">\n    <feComponentTransfer><feFuncA type=\"discrete\" tableValues=\"0 1\"/></feComponentTransfer>\n  </filter>\n  <filter id=\"lu-soft\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\" color-interpolation-filters=\"sRGB\">\n    <feComponentTransfer><feFuncA type=\"table\" tableValues=\"0 0 1 1\"/></feComponentTransfer>\n  </filter>\n  <filter id=\"lu-aa\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\" color-interpolation-filters=\"sRGB\">\n    <feComponentTransfer><feFuncA type=\"identity\"/></feComponentTransfer>\n  </filter>\n</svg>", Fm = [];
function Im(e) {
	let t = Math.max(0, Math.min(12, Math.round(e)));
	return Fm[t] ?? (Fm[t] = Lm(t));
}
function Lm(e) {
	let t = B(), n = Math.PI / 6;
	return V(15, 15, (r) => {
		for (let i = 0; i < 15; i++) for (let a = 0; a < 15; a++) {
			let o = a - 7, s = i - 7, c = Math.hypot(o, s);
			if (c > 7.4) continue;
			if (c > 6.4 || c > 3.6 && c <= 4.4) {
				r.px(a, i, t.ink0);
				continue;
			}
			if (c <= 3.6) {
				r.px(a, i, t.ink1);
				continue;
			}
			let l = Math.atan2(o, -s);
			l < 0 && (l += Math.PI * 2);
			let u = Math.min(11, Math.floor(l / n));
			if (Math.min(l - u * n, (u + 1) * n - l) * c < .55) {
				r.px(a, i, t.ink0);
				continue;
			}
			let d = u < e, f = d && u === e - 1 && e < 12, p = c > 5.4;
			r.px(a, i, d ? f ? p ? t.tx1 : t.g4 : p ? t.g4 : t.g2 : p ? t.dm2 : t.dm3);
		}
		let i = e >= 12;
		mn(r, 7, 7, 1, i ? [
			t.g2,
			t.g4,
			t.g5
		] : [
			t.ink2,
			t.ink3,
			t.ink4
		], { setting: i ? [
			t.g5,
			t.g4,
			t.g3
		] : [
			t.dm1,
			t.dm2,
			t.dm3
		] });
	});
}
var Rm = class e {
	constructor(e = document.body, { lang: t, fonts: n } = {}) {
		let r = document.createElement("div");
		r.id = "luminati-ui", r.className = "lu-root", e !== document.body && (r.classList.add("lu-root--contained"), getComputedStyle(e).position === "static" && (e.style.position = "relative")), e.appendChild(r), this.container = e, this.root = r, this.lang = on(t === void 0 ? cn() : t), Xl(), dn(r), document.getElementById("lu-crisp") || r.insertAdjacentHTML("afterbegin", Pm), this.measureHost = document.createElement("div"), this.measureHost.className = "lu-measure", this.measureHost.setAttribute("aria-hidden", "true"), r.appendChild(this.measureHost), Ct(this.measureHost), this.fonts = n ?? We() ?? Ze({ lang: this.lang }), this._events = new An(), this._scale = null, this._disposed = !1, this._onResize = () => this._updateScale(), this._onDpr = () => {
			this._watchDpr(), this._updateScale();
		}, this._dprQuery = null, this._resizeObs = null, this._cursorEl = e === document.body ? document.documentElement : e, this._cursorKey = "", this._updateScale(), Yt(this), window.addEventListener("resize", this._onResize), this._watchDpr(), e !== document.body && typeof ResizeObserver < "u" && (this._resizeObs = new ResizeObserver(() => this._updateScale()), this._resizeObs.observe(e)), this.prompt = new Pd(r), this.hud = new Lu(r), this.minimap = new vf(this.hud.element, { anchor: this.hud.clockElement }), this.banner = new vd(r), this.dialog = new pd(r), this.title = new Ad(r), this.worldMap = new Mf(r), this.fader = new Fd(r), this.debug = new rf(r, { anchor: this.hud.clockElement }), this.combat = null, this.journal = null, this.emotes = null, this.endCard = null, this.party = null, this._story = null, this._cutscene = !1, this._hudShown = !0, this._skipOn = !1, this._skipLit = -1, this._skipKey = "Esc", this._visible = !0, this._talking = !1, this._titled = !1, this.fontsReady = typeof document < "u" && document.fonts ? this.fonts.ready.catch(() => null).then(() => void 0) : Promise.resolve();
	}
	static of(t = null) {
		let n = Ke(t);
		return n instanceof e ? n : null;
	}
	on(e, t) {
		return this._events.on(e, t);
	}
	off(e, t) {
		this._events.off(e, t);
	}
	get scale() {
		return this._scale;
	}
	get px() {
		return this._scale.px;
	}
	get fpx() {
		return this._scale.fpx;
	}
	get shrink() {
		return this._scale.shrink;
	}
	get cornerShrink() {
		return this._scale.cornerShrink;
	}
	get artW() {
		return this._scale.artW;
	}
	get artH() {
		return this._scale.artH;
	}
	_updateScale() {
		let e = this.container === document.body, t = e ? window.innerWidth : this.container.clientWidth, n = e ? window.innerHeight : this.container.clientHeight;
		if (!(t > 0 && n > 0)) {
			if (this._scale) return;
			t = window.innerWidth || 1280, n = window.innerHeight || 720;
		}
		let r = vt({
			w: t,
			h: n,
			dpr: window.devicePixelRatio || 1
		}), i = this._scale;
		if (i && i.px === r.px && i.fpx === r.fpx && i.shrink === r.shrink && i.artW === r.artW && i.artH === r.artH && i.dpr === r.dpr) return;
		this._scale = r;
		let a = this.root.style;
		a.setProperty("--px", `${+r.cssPx.toFixed(6)}px`), a.setProperty("--fpx", `${+r.cssFpx.toFixed(6)}px`), a.setProperty("--shrink", `${+r.shrink.toFixed(6)}`), a.setProperty("--shrink-corner", `${+r.cornerShrink.toFixed(6)}`), a.setProperty("--lu-dpx", `${+(1 / r.dpr).toFixed(6)}px`), this.root.dataset.luScale = r.cornerShrink === 1 ? "crisp" : "shrunk", Jt(r.px), this._applyCursors(r);
		for (let [e, t] of Object.entries(mt())) a.setProperty(e, t);
		(this.fonts ? this.fonts.setScale(r.px) : Promise.resolve()).then(() => {
			this._scale === r && !this._disposed && this._events.emit("scale", r);
		});
	}
	_applyCursors(e) {
		let t = `${e.px}|${e.dpr}`;
		if (t === this._cursorKey) return;
		this._cursorKey = t;
		let n = this._cursorEl;
		n.style.setProperty("--lu-cursor", tu("arrow", e, "auto")), n.style.setProperty("--lu-cursor-pointer", tu("pointer", e, "pointer")), n.classList.add("lu-cursors");
	}
	_watchDpr() {
		this._dprQuery?.removeEventListener("change", this._onDpr), this._dprQuery = typeof matchMedia == "function" ? matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`) : null, this._dprQuery?.addEventListener("change", this._onDpr);
	}
	static useCombatUI(e) {
		Nm = e ?? null;
	}
	enableCombat(e = Nm) {
		if (this.combat) return this.combat;
		let { CombatHUD: t, BossBar: n, WorldLabels: r, Announcer: i, DeathScreen: a } = e ?? {};
		if (!t || !n || !r || !i || !a) throw Error("UI.enableCombat: register the combat UI classes first (UI.useCombatUI({ CombatHUD, BossBar, WorldLabels, Announcer, DeathScreen })) or pass them");
		let o = this.hud.element;
		this.combat = {
			hud: new t(o, { anchor: o.querySelector(".lu-loc") }),
			boss: new n(o),
			labels: new r(this.root),
			announcer: new i(this.root),
			death: new a(this.root)
		}, this.root.classList.add("lu-root--combat");
		let s = this.combat;
		return this._setLabelPanels(), this.fontsReady.then(() => {
			if (this.combat !== s) return;
			let e = ln("combat");
			s.death.prime({
				title: e ? R("combat.death.title") : "You Have Fallen",
				prompt: e ? R("combat.death.prompt", { place: R("combat.place.camp") }) : "Press any key to rise at the camp"
			});
		}), s;
	}
	_setLabelPanels() {
		let e = this.combat;
		if (!e) return;
		let t = this.hud, n = t.locationElement, r = t.helpElement, i = t.helpTabElement, a = this.party?.frames;
		e.labels.setPanels([
			{
				el: n,
				shown: () => !n.classList.contains("is-empty")
			},
			t.clockElement,
			{
				el: this.minimap.element,
				shown: () => this.minimap.visible
			},
			{
				el: r,
				shown: () => !r.classList.contains("is-hidden")
			},
			{
				el: i,
				shown: () => !i.classList.contains("is-hidden") && !i.classList.contains("is-empty")
			},
			e.hud.vitalsElement,
			e.hud.skillsElement,
			{
				el: e.boss.element,
				shown: () => e.boss.visible,
				merge: !1
			},
			...a && "element" in a && a.element instanceof HTMLElement ? [{
				el: a.element,
				shown: () => !!a.visible
			}] : []
		]);
	}
	disableCombat() {
		let e = this.combat;
		e && (this.combat = null, e.death.dispose(), e.announcer.dispose(), e.labels.dispose(), e.boss.dispose(), e.hud.dispose(), this.root.classList.remove("lu-root--combat"));
	}
	usePartyUI(e) {
		return this.party ? this.party : !e?.PartyPanel || !e?.PartyFrames ? null : (this.party = {
			panel: new e.PartyPanel(this.root),
			frames: new e.PartyFrames(this.root)
		}, this._setLabelPanels(), this.party);
	}
	useStoryUI(e) {
		if (this._story) return {
			journal: this.journal,
			emotes: this.emotes,
			endCard: this.endCard
		};
		let { Journal: t, Emotes: n, EndCard: r } = e ?? {};
		if (!t || !n || !r) throw Error("UI.useStoryUI: pass the story UI classes ({ Journal, Emotes, EndCard }, imported from src/engine/ui/)");
		let i = this.root;
		this.emotes = new n(i), i.insertBefore(this.emotes.element, this.prompt.element.nextSibling), this.journal = new t(i), this.endCard = new r(i);
		let a = document.createElement("div");
		a.className = "lu-letterbox", a.innerHTML = "\n      <div class=\"lu-letterbox__bar lu-letterbox__bar--top\"></div>\n      <div class=\"lu-letterbox__bar lu-letterbox__bar--bottom\"></div>", i.insertBefore(a, this.hud.element);
		let o = [...a.querySelectorAll(".lu-letterbox__bar")];
		return this._story = {
			letterbox: a,
			bars: o,
			lines: [],
			skip: null,
			ring: null,
			off: () => {},
			job: 0
		}, this._skipLit = -1, this._layoutStory(), this._story.off = this.on("scale", () => this._layoutStory()), i.classList.add("lu-root--story"), {
			journal: this.journal,
			emotes: this.emotes,
			endCard: this.endCard
		};
	}
	_layoutStory() {
		let e = this._story;
		if (!e) return;
		let t = B(), n = this._scale, r = Math.ceil(n.W / n.px), i = n.artH, a = Math.max(4, Math.round(i * .11 / 8)), o = a * 8;
		e.letterbox.style.setProperty("--lu-bar", N(o));
		for (let t of e.bars) t.style.transitionTimingFunction = `steps(${a}, end)`;
		for (let t of e.lines) t.remove();
		e.lines = e.bars.map((e, n) => {
			let i = nt(r, "both", t.g2);
			return i.className = `lu-letterbox__line lu-letterbox__line--${n ? "bottom" : "top"}`, i.style.width = N(r), i.style.height = N(1), e.append(i), i;
		});
		let s = this._skipOn;
		e.skip?.remove();
		let c = R("story-ui.skip.hold"), [l, u] = c.includes("{key}") ? c.split("{key}", 2).map((e) => e.trim()) : [c.trim(), ""], d = Ft(this._skipKey), f = l ? L(l, "line") : 0, p = u ? L(u, "line") : 0, m = 20 + f + (f ? 3 : 0) + d + (p ? 3 : 0) + p, h = Math.round(360 - o / 2 - 7.5), g = qt(e.letterbox, "br", 630 - m, h, m, 15, `lu-skip${s ? " is-on" : ""}`);
		g.setAttribute("aria-hidden", "true");
		let _ = 630 - m, v = un(Im(Math.max(0, this._skipLit)));
		F(g, v, _, h, 1, "lu-skip__ring"), _ += 20;
		let y = h + 7.5;
		l && (I(g, l, _, y, {
			font: "line",
			color: t.tx2,
			drop: !0,
			cls: "lu-skip__text"
		}), _ += f + 3), wt(g, this._skipKey, _, h + 2, { cls: "lu-skip__key" }), _ += d + 3, u && I(g, u, _, y, {
			font: "line",
			color: t.tx2,
			drop: !0,
			cls: "lu-skip__text"
		}), g.classList.toggle("is-full", this._skipLit >= 12), e.skip = g, e.ring = v;
		try {
			if (e.fontsFor !== c && !zt().every((e) => ft(c, e))) {
				e.fontsFor = c;
				let t = ++e.job;
				this.fonts?.ensure(c).then(() => {
					this._story === e && e.job === t && this._layoutStory();
				});
			}
		} catch {}
	}
	disableStoryUI() {
		let e = this._story;
		e && (this._story = null, e.off(), e.job++, this.endCard.dispose(), this.journal.dispose(), this.emotes.dispose(), this.endCard = null, this.journal = null, this.emotes = null, e.letterbox.remove(), this._cutscene = !1, this._skipOn = !1, this._skipLit = -1, this.root.classList.remove("lu-root--story", "lu-root--cutscene"), this._hudShown || this.setHudVisible(!0));
	}
	get cutscene() {
		return this._cutscene;
	}
	setCutscene(e) {
		return this._story ? (this._cutscene = !!e, this.root.classList.toggle("lu-root--cutscene", this._cutscene), this._cutscene || this.setSkipHint(!1), this._cutscene) : !1;
	}
	get hudVisible() {
		return this._hudShown;
	}
	setHudVisible(e) {
		this._hudShown = !!e, this.root.classList.toggle("lu-root--nohud", !this._hudShown);
	}
	setSkipHint(e, t = 0, { key: n } = {}) {
		let r = this._story;
		if (!r) return;
		let i = !!e;
		n !== void 0 && String(n) !== this._skipKey && (this._skipKey = String(n), this._layoutStory()), i !== this._skipOn && (this._skipOn = i, r.skip?.classList.toggle("is-on", i));
		let a = Math.round(Math.min(1, Math.max(0, Number(t) || 0)) * 12);
		if (a !== this._skipLit) {
			if (this._skipLit = a, r.ring) {
				let e = r.ring.getContext("2d");
				e.clearRect(0, 0, r.ring.width, r.ring.height), e.drawImage(Im(a), 0, 0);
			}
			r.skip?.classList.toggle("is-full", a >= 12);
		}
	}
	get visible() {
		return this._visible;
	}
	setVisible(e) {
		this._visible = !!e, this.root.classList.toggle("lu-root--hidden", !this._visible);
	}
	update(e, t) {
		let n = t ? t.camera : void 0, r = t ? t.input : void 0, i = this._visible && !this.title.visible ? r : void 0;
		this._story && (this.endCard.active && (this.endCard.update(e, this._visible ? r : void 0), i = void 0), this.journal.isOpen && (this.journal.update(e, i), i = void 0));
		let a = this.party?.panel;
		a?.isOpen && (a.update(e, i), i = void 0), this.dialog.update(e, i);
		let o = this.dialog.isOpen;
		o !== this._talking && (this._talking = o, this.root.classList.toggle("lu-root--dialog", o));
		let s = this.title.visible;
		s !== this._titled && (this._titled = s, this.root.classList.toggle("lu-root--title", s)), n && this.prompt.update(n), n && this.emotes && this.emotes.update(n), n && this.combat && this.combat.labels.update(e, n), this.hud.update(e);
	}
	dispose() {
		if (this.disableStoryUI(), this.party &&= (this.party.panel.dispose(), this.party.frames.dispose(), null), this.combat) {
			let e = this.combat;
			this.combat = null, e.death.dispose(), e.announcer.dispose(), e.labels.dispose(), e.boss.dispose(), e.hud.dispose();
		}
		this.debug.dispose(), this.worldMap.dispose(), this.minimap.dispose(), this.fader.dispose(), this.title.dispose(), this.dialog.dispose(), this.banner.dispose(), this.hud.dispose(), this.prompt.dispose(), window.removeEventListener("resize", this._onResize), this._dprQuery?.removeEventListener("change", this._onDpr), this._dprQuery = null, this._resizeObs?.disconnect(), this._resizeObs = null, this._cursorEl.classList.remove("lu-cursors"), this._cursorEl.style.removeProperty("--lu-cursor"), this._cursorEl.style.removeProperty("--lu-cursor-pointer"), this._disposed = !0, this._events.off("scale"), Zt(this), Ht() === this.measureHost && Ct(null), this.root.remove();
	}
};
//#endregion
export { uo as C, Xn as D, Or as E, Ln as O, oo as S, co as T, Bc as _, kp as a, uc as b, Yl as c, Hl as d, _l as f, Zc as g, nl as h, Sm as i, An as k, Xl as l, fl as m, jm as n, yp as o, Rl as p, Om as r, ou as s, Rm as t, zl as u, Nc as v, lo as w, Zs as x, Ac as y };
