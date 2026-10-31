import { A as e, B as t, C as n, D as r, J as i, K as a, L as o, M as s, R as c, S as l, St as u, U as d, Y as f, Z as p, _ as m, et as h, f as g, ht as _, i as v, j as y, k as b, lt as x, m as S, mt as C, n as w, nt as T, ot as E, q as D, r as O, s as k, st as A, t as j, u as ee, yt as te } from "./core-C1cYbmwD.js";
import { c as ne, n as re, u as M } from "./I18n-BeKB4FMa.js";
import { d as N, m as P, p as ie, s as F } from "./gilt-DNFH9voM.js";
import { n as ae, r as oe, t as I } from "./portrait-ChywqrAx.js";
import "./PartyRules-BC3MXv_G.js";
import { o as se } from "./strings-Bhp--RMv.js";
//#region src/engine/ui/PartyFrames.js
var ce = "#c9a45c", L;
function le(e, t = ce) {
	if (typeof e != "string") return t;
	let n = e.trim();
	if (!n || n.length > 64) return t;
	if (/^#[0-9a-f]{6}$/i.test(n)) return n.toLowerCase();
	if (L === void 0 && (L = typeof document < "u" ? document.createElement("canvas").getContext("2d") : null), !L) return t;
	L.fillStyle = "#010203", L.fillStyle = n;
	let r = L.fillStyle;
	if (L.fillStyle = "#030201", L.fillStyle = n, r !== L.fillStyle || typeof r != "string") return t;
	if (r[0] === "#") return r.toLowerCase();
	let i = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(r);
	return i ? `#${[
		i[1],
		i[2],
		i[3]
	].map((e) => Math.min(255, Number(e)).toString(16).padStart(2, "0")).join("")}` : t;
}
function ue(e) {
	let t = parseInt(e.slice(1, 7), 16);
	return [
		t >> 16 & 255,
		t >> 8 & 255,
		t & 255
	];
}
function de(e) {
	let [t, n, r] = e.map((e) => {
		let t = e / 255;
		return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
	});
	return .2126 * t + .7152 * n + .0722 * r;
}
function fe(e) {
	let t = ue(e);
	if (de(t) >= .22) return e;
	let n = [
		243,
		234,
		215
	];
	for (let e = .1; e <= 1.0001; e += .1) {
		let r = t.map((t, r) => Math.round(t + (n[r] - t) * e));
		if (de(r) >= .22) return `rgb(${r[0]}, ${r[1]}, ${r[2]})`;
	}
	return "rgb(243, 234, 215)";
}
var pe = (e) => ie(e), me = /* @__PURE__ */ new WeakMap();
function he(e) {
	let t = me.get(e);
	if (!t) {
		t = [];
		for (let n of String(e.unicodeRange || "U+0-10FFFF").split(",")) {
			let e = /U\+([0-9a-f?]+)(?:-([0-9a-f]+))?/i.exec(n.trim());
			if (!e) continue;
			let r = parseInt(e[1].replace(/\?/g, "0"), 16), i = parseInt(e[2] ?? e[1].replace(/\?/g, "f"), 16);
			Number.isFinite(r) && Number.isFinite(i) && t.push([r, i]);
		}
		me.set(e, t);
	}
	return t;
}
function ge(e, t) {
	let n = String(e).trim().split(/\s+/).map((e) => e === "normal" ? 400 : e === "bold" ? 700 : Number(e)), r = n[0], i = n[1] ?? n[0];
	if (!Number.isFinite(r)) return !0;
	for (let e of t) if (e >= r && e <= i) return !0;
	return !1;
}
function _e(e) {
	if (!e || typeof document > "u" || !document.fonts) return !1;
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		let e = n.codePointAt(0);
		e > 255 && t.add(e);
	}
	if (!t.size) return !1;
	let n = /* @__PURE__ */ new Map();
	for (let e of Object.values(A())) for (let t of e.family.split(",")) {
		let r = t.trim().replace(/^["']|["']$/g, "");
		n.has(r) || n.set(r, /* @__PURE__ */ new Set()), n.get(r).add(Number(e.w) || 400);
	}
	try {
		for (let e of document.fonts) {
			if (e.status === "loaded" || e.status === "error") continue;
			let r = n.get(e.family.replace(/^["']|["']$/g, ""));
			if (r && ge(e.weight, r)) {
				for (let [n, r] of he(e)) for (let e of t) if (e >= n && e <= r) return !0;
			}
		}
	} catch {
		return !1;
	}
	return !1;
}
function ve(e) {
	let n = [t()?.ensure(e) ?? Promise.resolve()];
	if (typeof document < "u" && document.fonts) for (let t of E()) n.push(document.fonts.load(t, e).catch(() => []));
	return Promise.all(n).then(() => {}, () => {});
}
var ye = (e) => (A(), d[e].ink * d[e].unit);
function be(e, t) {
	if (T(a(e), "small", 1) <= t) return e;
	let n = [...e];
	for (; n.length > 1 && T(a(`${n.join("").trimEnd()}…`), "small", 1) > t;) n = n.slice(0, -1);
	return `${n.join("").trimEnd()}…`;
}
var R = (e) => {
	if (typeof e == "string") return e;
	if (e == null) return "";
	try {
		return String(e);
	} catch {
		return "";
	}
}, xe = (e) => e > 0 ? e < 1 ? e : 1 : 0, Se = "(max-height: 680px), (min-aspect-ratio: 2/1)", z = 13, B = 48, Ce = 64, we = 155, Te = 40, Ee = 2, De = 4, Oe = .35, ke = .9, V = (e) => `calc(var(--px) * ${e})`, Ae = class {
	constructor(e) {
		let n = e.querySelector?.(":scope > .lu-hud") ?? e, r = document.createElement("div");
		r.className = "lu-pframes is-empty g grp", r.dataset.anchor = "tl", r.setAttribute("aria-hidden", "true"), n.appendChild(r), this.element = r, this._hud = n, this._ui = n.closest?.(".lu-root") ?? null, this._frames = [], this._visible = !0, this._empty = !0, this._combat = !1, this._dirty = !0, this._anchor = null, this._mq = typeof matchMedia == "function" ? matchMedia(Se) : null, this._compact = !!this._mq?.matches, this._now = 0, this._ensured = /* @__PURE__ */ new Set(), this._place = () => {
			let e = !!this._mq?.matches;
			e !== this._compact && (this._compact = e, this._dirty = !0, this._layout()), this._measure();
		}, window.addEventListener("resize", this._place), this._ro = typeof ResizeObserver == "function" ? new ResizeObserver(() => this._measure()) : null, this._offScale = u(n, () => {
			this._dirty = !0, this._layout(), this._measure();
		}), t()?.ready.then(() => {
			this._frames.length && (this._dirty = !0, this._layout(), this._measure());
		});
	}
	get visible() {
		return this._visible && !this._empty;
	}
	update(e) {
		let t = Array.isArray(e) ? e : [], n = !!this._ui && this._ui.classList.contains("lu-root--combat"), r = !1;
		n !== this._combat && (this._combat = n, this.element.classList.toggle("is-combat", n), r = !0);
		let i = t.length === this._frames.length;
		for (let e = 0; i && e < t.length; e++) this._frames[e].id !== R(t[e]?.id) && (i = !1);
		i || (this._rebuild(t), this._dirty = !0);
		for (let e = 0; e < t.length; e++) this._look(this._frames[e], t[e]) && (this._dirty = !0);
		this._dirty && (this._layout(), r = !0);
		let a = (typeof performance < "u" ? performance.now() : Date.now()) / 1e3, o = this._now ? Math.min(.25, Math.max(0, a - this._now)) : 0;
		this._now = a;
		for (let e = 0; e < t.length; e++) this._set(this._frames[e], t[e], a, o);
		let s = this._frames.length === 0;
		s !== this._empty && (this._empty = s, this.element.classList.toggle("is-empty", s), s || (r = !0)), r && !s && this._retarget();
	}
	setVisible(e) {
		let t = !!e;
		t !== this._visible && (this._visible = t, this.element.classList.toggle("is-hidden", !t));
	}
	dispose() {
		window.removeEventListener("resize", this._place), this._ro?.disconnect(), this._ro = null, this._offScale(), this._frames = [], this.element.remove();
	}
	_rebuild(e) {
		let t = new Map(this._frames.map((e) => [e.id, e])), n = [];
		for (let r of e) {
			let e = R(r?.id), i = t.get(e);
			i ? t.delete(e) : i = this._make(e), n.push(i);
		}
		for (let e of t.values()) e.el.remove();
		for (let e of n) this.element.appendChild(e.el);
		this._frames = n;
	}
	_make(e) {
		let t = document.createElement("div");
		return t.className = "lu-pframe", {
			id: e,
			el: t,
			look: {
				name: "",
				cls: "",
				tactic: "",
				level: "",
				color: "",
				bars: !1,
				hpMax: 0,
				mpMax: 0
			},
			hp: -1,
			mp: -1,
			hv: 1,
			chip: 1,
			hold: 0,
			hpx: -1,
			cpx: -1,
			mpx: -1,
			down: !1,
			low: !1,
			fighting: !1,
			hpBar: null,
			lowBar: null,
			mpBar: null,
			hpText: null,
			mpText: null,
			hpNum: null
		};
	}
	_look(e, t) {
		let n = e.look, r = R(t?.name) || e.id, i = R(t?.cls), a = R(t?.tactic), o = Number(t?.level), s = Number.isFinite(o) ? String(Math.max(0, Math.round(o))) : "", c = R(t?.color), l = Number(t?.hp), u = Number(t?.hpMax), d = Number.isFinite(l) && Number.isFinite(u), f = d ? Math.max(0, Math.round(u)) : 0, p = Number(t?.mpMax), m = d && Number.isFinite(p) ? Math.max(0, Math.round(p)) : 0;
		return r === n.name && i === n.cls && a === n.tactic && s === n.level && c === n.color && d === n.bars && f === n.hpMax && m === n.mpMax ? !1 : (e.look = {
			name: r,
			cls: i,
			tactic: a,
			level: s,
			color: c,
			bars: d,
			hpMax: f,
			mpMax: m
		}, !0);
	}
	_layout() {
		this._dirty = !1;
		let t = this._frames;
		if (!t.length) return;
		let n = P(), r = this._compact, o = !i(), c = ne(), u = M("party.frame.lv"), d = M("party.frame.down"), f = Math.max(5, ye("small"), ye("line")), p = r ? 3 : 4, m = p + f / 2, h = Math.round(p + f + (r ? 2 : 3)), g = r ? 1 : Ee, _ = t.map((e) => {
			let t = e.look, n = t.level ? T(u, "tiny") : 0, i = t.level ? T(t.level, "num") : 0, s = t.level ? 4 + n + 2 + i : 0, l = T(c, "line"), p = [t.cls, t.tactic].filter(Boolean).join(c), m = p ? T(p, "line") : 0, g = t.bars ? T(o ? a(d) : d, "small", 1) : 0, _ = s + (p || t.bars ? l + Math.max(m, g) : 0), v = be(t.name, Math.max(Te, we - _)), y = T(a(v), "small", 1), b = z + y + s, x = t.bars ? T(`${t.hpMax}/${t.hpMax}`, "num") : 0, S = t.bars && !r ? T(`${t.mpMax}/${t.mpMax}`, "num") : 0, C = b + (p || t.bars ? l + Math.max(m, g) : 0), w = t.bars ? Ce + x + (r ? 0 : 5 + S) : 0;
			return {
				name: v,
				nmw: y,
				lvw: n,
				sx: b,
				sepw: l,
				sub: p,
				hpw: x,
				h: t.bars ? r ? h + 4 + 2 : h + 6 + 4 : Math.round(4 + f + 4),
				w: Math.max(C, w) + 16
			};
		}), v = Math.max(96, ..._.map((e) => e.w)), y = 0;
		t.forEach((t, i) => {
			let a = t.look, f = _[i], p = t.el;
			p.textContent = "", p.style.top = V(y), p.style.width = V(v), p.style.height = V(f.h);
			let b = le(a.color), x = fe(b);
			p.style.setProperty("--lu-member", b), p.style.setProperty("--lu-member-text", x), S(p, l(v, f.h, .82, .68, .6), 0, 0, 1, "lu-pframe__band"), S(p, s(Math.round(v * .84)), 0, f.h - 1, 1, "lu-pframe__rule");
			let w = pe(b), T = Math.round(m - 3.5);
			S(p, e(2, w), 4, T, 1, "lu-pframe__chip"), S(p, e(2, N.dusk(), { setting: [
				n.dm1,
				n.dm2,
				n.dm3
			] }), 4, T, 1, "lu-pframe__chip lu-pframe__chip--down"), S(p, e(2, [
				w[1],
				w[2],
				n.tx1
			], { setting: [
				n.g5,
				n.g5,
				n.g4
			] }), 4, T, 1, "lu-pframe__glow breathe");
			let E = C(p, f.name, z, m, {
				font: "small",
				track: 1,
				color: x,
				drop: !0,
				cls: `lu-pframe__name${o ? " lu-party-caps" : ""}`
			});
			if (f.name !== a.name && (E.title = a.name), a.level) {
				let e = z + f.nmw + 4;
				C(p, u, e, m, {
					font: "tiny",
					color: n.g4,
					drop: !0,
					cls: "lu-pframe__lv"
				}), C(p, a.level, e + f.lvw + 2, m, {
					font: "num",
					color: n.g5,
					drop: !0,
					cls: "lu-pframe__lvn"
				});
			}
			if ((f.sub || a.bars) && C(p, c, f.sx, m, {
				font: "line",
				color: n.tx2,
				drop: !0,
				cls: "lu-pframe__sep pre"
			}), C(p, f.sub, f.sx + f.sepw, m, {
				font: "line",
				color: n.tx2,
				drop: !0,
				cls: "lu-pframe__sub"
			}), C(p, d, f.sx + f.sepw, m, {
				font: "small",
				track: 1,
				color: n.hp3,
				drop: !0,
				cls: `lu-pframe__down${o ? " lu-party-caps" : ""}`
			}), t.hpBar = t.lowBar = t.mpBar = null, t.hpText = t.mpText = null, t.hpNum = null, t.hpx = t.cpx = t.mpx = -1, t.hp = t.mp = -1, a.bars) {
				let e = document.createElement("span");
				e.className = "lu-pframe__bars", p.appendChild(e), t.hpBar = S(e, F(B, 4, () => {}), z, h, 1, "lu-pframe__bar lu-pframe__bar--hp"), t.lowBar = S(e, F(B, 4, () => {}), z, h, 1, "lu-pframe__low breathe"), r || (t.mpBar = S(e, F(B, 3, () => {}), z, h + 3, 1, "lu-pframe__bar lu-pframe__bar--mp"));
				let i = (r ? h + 2 : h + 3) - D("num"), o = Me(e, "0", a.hpMax, Ce, i, n.tx1, "lu-pframe__num lu-pframe__num--hp");
				t.hpNum = o, t.hpText = o.firstChild, r || (t.mpText = Me(e, "0", a.mpMax, Ce + f.hpw + 5, i, n.mp3, "lu-pframe__num lu-pframe__num--mp").firstChild);
			}
			y += f.h + g;
		}), this.element.style.width = V(v), this.element.style.height = V(Math.max(0, y - g));
		let b = t.map((e) => `${e.look.name}${e.look.cls}${e.look.tactic}`).join("") + d;
		!this._ensured.has(b) && _e(b) && (this._ensured.add(b), ve(b).then(() => {
			this._dirty = !0, this._layout(), this._measure();
		}));
	}
	_set(e, t, n, r) {
		let i = e.look, a = e.el;
		i.bars !== a.classList.contains("has-bars") && a.classList.toggle("has-bars", i.bars);
		let o = !!t?.down;
		o !== e.down && (e.down = o, a.classList.toggle("is-down", o));
		let s = !!t?.fighting && !o;
		s !== e.fighting && (e.fighting = s, a.classList.toggle("is-fighting", s));
		let c = !1;
		if (i.bars) {
			let a = Number(t?.hp), s = i.hpMax > 0 ? xe(a / i.hpMax) : 0;
			s >= e.chip || e.hpx < 0 ? (e.chip = s, e.hold = 0) : s < e.hv ? (e.chip = Math.max(e.chip, e.hv), e.hold = n + Oe) : n >= e.hold && (e.chip = Math.max(s, e.chip - ke * r)), e.hv = s;
			let l = Math.round(46 * s), u = Math.round(46 * e.chip);
			(l !== e.hpx || u !== e.cpx) && e.hpBar && (e.hpx = l, e.cpx = u, Fe(e, s));
			let d = o ? 0 : Math.max(0, Math.ceil(Number.isFinite(a) ? a : 0));
			d !== e.hp && e.hpText && (e.hp = d, e.hpText.data = String(d));
			let f = Number(t?.mp), p = Number.isFinite(f) && i.mpMax > 0 ? xe(f / i.mpMax) : 0, m = Math.round(46 * p);
			m !== e.mpx && e.mpBar && (e.mpx = m, Pe(e.mpBar, B, 3, p, "mp"));
			let h = Math.max(0, Math.ceil(Number.isFinite(f) ? f : 0));
			h !== e.mp && e.mpText && (e.mp = h, e.mpText.data = String(h)), c = !o && a > 0 && s <= .25;
		}
		c !== e.low && (e.low = c, a.classList.toggle("is-low", c), e.hpNum && (e.hpNum.style.color = c ? P().hp3 : P().tx1));
	}
	_retarget() {
		let e = (this._combat ? this._hud.querySelector(":scope > .lu-vitals") : null) ?? this._hud.querySelector(":scope > .lu-loc");
		e !== this._anchor && (this._anchor && this._ro?.unobserve(this._anchor), this._anchor = e, e && this._ro?.observe(e)), this._measure();
	}
	_measure() {
		let e = this._anchor;
		if (this._empty || !e || !e.isConnected) return;
		let t = je(e, this._hud);
		if (!t) return;
		let n = t.y + e.offsetHeight;
		for (let t of e.querySelectorAll("*")) {
			let e = t.offsetHeight;
			if (!e) continue;
			let r = je(t, this._hud);
			r && r.y + e > n && (n = r.y + e);
		}
		let r = e.getBoundingClientRect(), i = e.offsetWidth > 0 && r.width > 0 ? r.width / e.offsetWidth : 1, a = te(this._hud) ?? null, o = a ? a.cornerShrink ?? a.shrink : 1, s = this._ui?.getAttribute("data-lu-scale") === "shrunk" && o > 0 && o < 1 ? o : 1, c = a?.cssPx ?? 2, l = a?.dpr ?? (typeof devicePixelRatio == "number" ? devicePixelRatio : 1), u = (e, t) => s === 1 ? t(e * l) / l : e, d = u(t.x * i / s, Math.round), f = u(n * i / s + De * c, Math.ceil), p = this.element.style, m = `${d}px`, h = `${f}px`, g = `${-d}px ${-f}px`;
		p.left !== m && (p.left = m), p.top !== h && (p.top = h), p.transformOrigin !== g && (p.transformOrigin = g);
	}
};
function je(e, t) {
	let n = 0, r = 0, i = e;
	for (; i && i !== t;) {
		if (!(i instanceof HTMLElement) || i.offsetParent === null && i !== t) return null;
		n += i.offsetLeft, r += i.offsetTop;
		let e = i.offsetParent;
		if (e && e !== t && !t.contains(e)) {
			let i = t.getBoundingClientRect(), a = e.getBoundingClientRect();
			return {
				x: n + a.left - i.left,
				y: r + a.top - i.top
			};
		}
		i = e;
	}
	return i === t ? {
		x: n,
		y: r
	} : null;
}
function Me(e, t, n, r, i, a, o) {
	return _(e, `${t}{/${n}}`, r, i, {
		font: "num",
		color: a,
		kw: P().tx2,
		drop: !0,
		cls: o
	});
}
var Ne = {
	hp: () => {
		let e = P();
		return [
			e.hp0,
			e.hp1,
			e.hp2,
			e.hp3
		];
	},
	mp: () => {
		let e = P();
		return [
			e.mp0,
			e.mp1,
			e.mp2,
			e.mp3
		];
	}
};
function Pe(e, t, r, i, a, o = null) {
	let s = F(t, r, (e) => n(e, t, r, i, Ne[a](), o != null && o > i ? { chip: o } : {})), c = e.getContext("2d");
	c.clearRect(0, 0, t, r), c.drawImage(s, 0, 0);
}
function Fe(e, t) {
	if (!e.hpBar || (Pe(e.hpBar, B, 4, t, "hp", e.chip), !e.lowBar)) return;
	let n = e.lowBar.getContext("2d");
	n.clearRect(0, 0, B, 4);
	let r = 1 + e.cpx;
	r < 47 && (n.fillStyle = "#7a1530", n.fillRect(r, 1, 47 - r, 1), n.fillStyle = "#a8233a", n.fillRect(r, 2, 47 - r, 1));
}
//#endregion
//#region src/engine/ui/art/icons/party.js
var { MAIN: H, ACCENT: U, pal: W } = v, Ie = {
	target: {
		palette: W(H.BONE, U.RED),
		rows: [
			".....ooooo......",
			"...ooccccboo....",
			"..occaaaaacbo...",
			".ocbahlllmbbbo..",
			".ocahmdddmmbao..",
			"ocahmdccbmmmcbo.",
			"ocaldcwcbbldcao.",
			"ocaldccbbaldcao.",
			"ocaldbbbbaldcao.",
			"obammmbaahmdcao.",
			".ocbmmlllmdcao..",
			".obbbmddddcbao..",
			"..obacccccaao...",
			"...oobaaaaoo....",
			".....ooooo......",
			"................"
		]
	},
	boots: {
		palette: W(H.LEATHER, U.GOLD),
		rows: [
			"................",
			"..oooooo........",
			".occcccbo.......",
			".oabbbbao.......",
			"..olmmmdo.......",
			"..olmmmdo.......",
			"..olmmmdo.......",
			"..olmmmdo.......",
			"..olmmmmdo......",
			"..olmmmmmdoo....",
			"..olmmmmmmmdo...",
			"..olhmmmmmmmdo..",
			"..olmmmmmmmmdo..",
			"..oaaaaoaaaaao..",
			"...oooo.ooooo...",
			"................"
		]
	},
	crossed: {
		palette: W(H.STEEL, U.GOLD),
		rows: [
			".o...........o..",
			"oho.........oho.",
			"ohmo.......ohmo.",
			".ohmo.....ohmo..",
			"..ohmo...ohmo...",
			"...ohmo.ohmo....",
			"....ohmohmo.....",
			".....ohmmo......",
			".....odhmo......",
			"...oohmohmoo....",
			"..ochmo.olmco...",
			"..obco...ocbo...",
			"...obco.ocbo....",
			"..oaoo...ooao...",
			".oco.......oco..",
			"..o.........o..."
		]
	},
	spell: {
		palette: W(H.PARCH, U.VIOLET),
		rows: [
			".......o........",
			"......owo.......",
			".....owcwo......",
			"......owo.......",
			"...ooo.o.ooo....",
			"..ohhhooohhho...",
			".ohlllhhhlllmo..",
			"ochlddlolddmlbo.",
			"ochllllollllmbo.",
			"ochlddlolddmmbo.",
			"ochllllollllmbo.",
			"ochllllollllmbo.",
			"ocbbbbbabbbbbao.",
			".oaaaaoooaaaao..",
			"..oooo...oooo...",
			"................"
		]
	},
	wing: {
		palette: W(H.GLOVE, U.WIND),
		rows: [
			"................",
			"...........ooo..",
			".........oohhho.",
			".......oohhllmo.",
			".....oohhllmmo..",
			"...oohhllmmoo...",
			"..ohhllmmoohho..",
			".ohllmmoohhlmo..",
			".ohlmoohhllmo...",
			"ohlmohhllmmoo...",
			"ohlohllmmoohhoo.",
			"ohlohlmoohhlllmo",
			".oholmohhllmmoo.",
			"..oolohllmmoo...",
			"....ooooooo.....",
			"................"
		]
	},
	retreat: {
		palette: W(H.GLOVE, U.BLUE),
		rows: [
			"................",
			"....o...........",
			"...olo..........",
			"..ohdooooooo....",
			".ohmmllllllmo...",
			"olmmmmmmmmmmmo..",
			".ommmddddddmmmo.",
			"..omdoooooommdo.",
			"...odo.....olmmo",
			"....o......olmdo",
			"...........olmdo",
			".......oooohmmdo",
			"......ohlllmmdo.",
			"......omdddddo..",
			".......oooooo...",
			"................"
		]
	},
	scales: {
		palette: W(H.GOLD, U.GOLD),
		rows: [
			"................",
			".......oo.......",
			"..ooooohmooooo..",
			".ohmmmmmmmmmmmo.",
			".omooooldoooomo.",
			".omo..oldo..omo.",
			".omo..oldo..omo.",
			"ohmmo.oldo.ohmmo",
			"ommmdooldoolmmdo",
			".omdo.oldo.omdo.",
			"..oo..oldo..oo..",
			".....ooldoo.....",
			"....ohlmmlmo....",
			"...oldddddddo...",
			"....oooooooo....",
			"................"
		]
	},
	fury: {
		palette: W(H.STEEL, U.FIRE),
		rows: [
			".........o....o.",
			".......ooco..oho",
			"......occao.ohmo",
			".....ocbao.ohmo.",
			"....ocbbaoolmo..",
			"....ocbaoolmo...",
			"...ocbaaolmo....",
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
	},
	eye: {
		palette: W(H.GLOVE, U.VIOLET),
		rows: [
			"................",
			"................",
			".....oooooo.....",
			"...oohllllmoo...",
			"..ohlmddddmlmo..",
			".ohmmdcccbmmmmo.",
			"ohmmdcbaabblmmmo",
			"olmmdcawocalmmdo",
			"ommmdbaoocalmmdo",
			".ommmmbbbahmmdo.",
			"..omdmllllmddo..",
			"...oomdddddoo...",
			".....oooooo.....",
			"................",
			"................",
			"................"
		]
	},
	hand: {
		palette: W(H.GLOVE, U.GOLD),
		rows: [
			"......oo........",
			"...ooohmooo.....",
			"..ohmoldohmooo..",
			"..oldoldoldohmo.",
			"..oldoldoldoldo.",
			"..oldoldoldoldo.",
			"..oldoldoldoldo.",
			".oolmlmmlmmlmdo.",
			"ololmmmmmmmmmdo.",
			"omlmmmmmmmmmmdo.",
			".ommmmmmmmmmmdo.",
			"..ommmmmmmmmdo..",
			"...omddddddddo..",
			"....occccccbo...",
			"....obaaaaaao...",
			".....ooooooo...."
		]
	},
	shield: {
		palette: W(H.STEEL, U.BLUE),
		rows: [
			"..oooooooooooo..",
			".ohwmmmmmmmmmmo.",
			".omcccccccccbmo.",
			".omcbbbbabbbamo.",
			".omcbbbahbbbamo.",
			".omcbbahlhbbamo.",
			".omcbahlclhbamo.",
			".omcahlcbblhamo.",
			".odahlcbbbblhdo.",
			"..olccbbbbbbmo..",
			"..odbbbbbbbado..",
			"...ombbbbbamo...",
			"....ombbbamo....",
			".....ombamo.....",
			"......oldo......",
			".......oo......."
		]
	},
	spear: {
		palette: W(H.STEEL, U.WOOD),
		rows: [
			"..............o.",
			".............oho",
			"...........oohmo",
			"..........olhmdo",
			".........ollmdo.",
			".........omdoo..",
			"........oddo....",
			".......ocbo.....",
			"......ocbo......",
			".....ocbo.......",
			"....ocbo........",
			"...ocbo.........",
			"..ocao..........",
			".obao...........",
			"oddo............",
			".oo............."
		]
	},
	bow: {
		palette: W(H.WOOD, U.RED),
		rows: [
			".........oooo...",
			"......ooohllloo.",
			".....ohllmmmmlho",
			"....olmooooooho.",
			"...ocbo....oho..",
			"..olbo....oho...",
			".olmo....oho....",
			".olo....oho.....",
			".olo...oho......",
			"olmo..oho.......",
			"olmo.oho........",
			"olmooho.........",
			"olmoho..........",
			".omho...........",
			".oho............",
			"..o............."
		]
	},
	staff: {
		palette: W(H.WOOD, U.VIOLET),
		rows: [
			"...........ooo..",
			"..........occbo.",
			"........oocwcbbo",
			".......ohoccbbao",
			".......olobbbaao",
			".......olooaaao.",
			".......omllmoo..",
			"......olmooo....",
			".....olmo.......",
			"....olmo........",
			"...olmo.........",
			"..olmo..........",
			".olmo...........",
			"omdo............",
			".oo.............",
			"................"
		]
	},
	holystaff: {
		palette: W(H.GOLD, U.FIRE),
		rows: [
			"........o.oco.o.",
			".......obooooobo",
			"........oohhloo.",
			".......oohwllmoo",
			"......ocohllmdoc",
			".......oollmddoo",
			"........oomddoo.",
			".......oldoooobo",
			"......oldooco.o.",
			".....ohdo..o....",
			"....oldo........",
			"...ohdo.........",
			"..oldo..........",
			".oldo...........",
			"omdo............",
			".oo............."
		]
	},
	icestaff: {
		palette: W(H.STEEL, U.WIND),
		rows: [
			"..............oo",
			"......o.....oocb",
			".....oco...occao",
			"......o...owcbao",
			".........occbao.",
			"........occbaao.",
			".......olcbaao..",
			".......ohbaoo...",
			"......oldmo....o",
			".....oldoo....oc",
			"....oldo.......o",
			"...oldo.........",
			"..oldo..........",
			".oldo...........",
			"omdo............",
			".oo............."
		]
	},
	towershield: {
		palette: W(H.GOLD, U.RED),
		rows: [
			"...ooooooooo.olo",
			"..ollllmddddohlm",
			".olwbaaaaaaddmdo",
			".olbbaaaaaaadoo.",
			".olbhaawaahado..",
			".olbbhahahaado..",
			".olbbhhhhhaado..",
			".olbbahhhaaado..",
			".olbbaahaaaado..",
			".ombbaahaaaado..",
			".ombbahaaaaado..",
			"..ombaahaaado...",
			"...omaaaaado....",
			"....omaaado.....",
			".....omado......",
			"......omo......."
		]
	}
}, Le = Object.freeze({
	target: "target",
	distance: "boots",
	attack: "crossed",
	skills: "spell",
	heal: "cross",
	evade: "wing",
	retreat: "retreat"
}), Re = Object.freeze({
	balanced: "scales",
	aggressive: "fury",
	guardian: "shield",
	support: "heart",
	hunter: "eye",
	passive: "hand"
}), ze = Object.freeze({
	warden: "spear",
	ranger: "bow",
	mystic: "staff",
	cleric: "holystaff",
	icemage: "icestaff",
	greatshield: "towershield"
});
function Be(e, t) {
	let n = (t) => Object.prototype.hasOwnProperty.call(t, e) ? t[e] : null, r = n(Ie) ?? n(j);
	if (!r) throw Error(`icon: no icon "${e}" (party: ${Object.keys(Ie).join(", ")}; core: ${Object.keys(j).join(", ")})`);
	return k(r, t);
}
//#endregion
//#region src/engine/ui/art/party.js
function Ve(e, t, n = !1) {
	let r = P();
	return F(e * 6 - 3, 3, (i) => {
		for (let a = 0; a < e; a++) {
			let e = a * 6 + 1;
			a === t ? (i.px(e, 0, r.g5), i.px(e - 1, 1, r.g4), i.px(e + 1, 1, r.g3), i.px(e, 2, r.g2), i.px(e, 1, r.sa3)) : n ? (i.px(e, 0, r.g3), i.px(e - 1, 1, r.g3), i.px(e + 1, 1, r.g2), i.px(e, 2, r.g2), i.px(e, 1, r.ink0)) : (i.px(e, 0, r.dm1), i.px(e - 1, 1, r.dm1), i.px(e + 1, 1, r.dm2), i.px(e, 2, r.dm2));
		}
	});
}
//#endregion
//#region src/engine/ui/PartyPanel.js
var G = 2, He = 608, Ue = 480, We = 26, K = 140, Ge = 19, Ke = 328, qe = 342, Je = 12, Ye = 96, q = (e) => {
	if (typeof e == "string") return e;
	if (e == null) return "";
	try {
		return String(e);
	} catch {
		return "";
	}
}, J = (e, t) => e && typeof e == "object" && Object.hasOwn(e, t) ? e[t] : void 0, Xe = (e, t) => Object.hasOwn(e, t) ? e[t] : null, Y = (e, t) => M(`party.${e}`, t);
function X(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
var Ze = (e) => `calc(var(--px) * ${e})`, Qe = (e) => `round(nearest, calc(var(--px) * ${e}), var(--lu-dpx, 1px))`;
function Z(e, t, n, r, i, a) {
	return e.style.left = Ze(n - t[0]), e.style.top = Ze(r - t[1]), e.style.width = Ze(i), e.style.height = Ze(a), x(e, [n, r]), e;
}
var Q = () => i() ? "" : " lu-party-caps", $e = class {
	constructor(e) {
		this.onRule = null, this.onClose = null, this.onSound = null;
		let t = document.createElement("div");
		t.className = "lu-party", t.setAttribute("aria-hidden", "true"), t.setAttribute("data-input-ignore", ""), e.appendChild(t), this.element = t, this._veil = null, this._window = null, this._memberEl = null, this._presetsEl = null, this._rulesEl = null, this._body = null, this._desc = null, this._subP = null, this._subR = null, this._currentEl = null, this._geom = null, this._open = !1, this._closeQueued = !1, this._members = [], this._presets = [], this._fields = [], this._closeKey = "", this._m = 0, this._row = 0, this._col = 0, this._tabs = [], this._cards = [], this._rows = [], this._rightWord = "", this._descKey = "", this._veilKey = "", this._stale = !1, this._noteFit = /* @__PURE__ */ new Map(), this._builtKey = "", this._ensuredText = "", this._onClick = (e) => {
			if (!this._open) return;
			let n = e.target;
			if (n === t || n === this._veil) {
				this._closeQueued = !0;
				return;
			}
			let r = n.closest?.(".lu-party__tab");
			if (r) {
				let e = this._tabs.findIndex((e) => e.el === r);
				e >= 0 && e !== this._m && (this._showMember(e), this._sound("menuSelect"));
				return;
			}
			let i = n.closest?.(".lu-party__card");
			if (i) {
				let e = this._cards.findIndex((e) => e.el === i);
				e >= 0 && (this._focusCard(e), this._pick(e));
				return;
			}
			let a = n.closest?.(".lu-party__row");
			if (a) {
				let e = this._rows.findIndex((e) => e.el === a);
				if (e < 0) return;
				let t = this._presetRows + e, r = n.closest?.(".lu-party__arrow");
				r ? (this._focus(t), this._step(e, r.classList.contains("lu-party__arrow--l") ? -1 : 1)) : t !== this._row && (this._focus(t), this._sound("menuMove"));
			}
		}, t.addEventListener("click", this._onClick), this._onDown = (e) => {
			e.target !== t && e.target !== this._veil && e.preventDefault();
		}, t.addEventListener("mousedown", this._onDown), this._offScale = u(e, () => {
			this._open ? this._relayout() : this._stale = !0;
		});
	}
	get isOpen() {
		return this._open;
	}
	get memberId() {
		return this._members[this._m]?.id ?? "";
	}
	get focus() {
		return this._row < this._presetRows ? "presets" : this._fields[this._row - this._presetRows]?.key ?? "";
	}
	get focusedPreset() {
		return this._row < this._presetRows ? this._presets[this._cardIndex()]?.name ?? "" : "";
	}
	get rule() {
		let e = this._members[this._m];
		return e ? { ...e.rule } : null;
	}
	open(e) {
		this._closeQueued = !1;
		let t = e && typeof e == "object" ? e : {}, n = this._open ? this.memberId : "";
		if (this._fields = at(t.fields), this._presets = ot(t.presets, this._fields), this._members = ct(t.members, this._fields, this._presets), !this._members.length || !this._fields.length) {
			this.close();
			return;
		}
		this._closeKey = q(t.closeKey).trim();
		let r = t.focus === void 0 ? -1 : this._members.findIndex((e) => e.id === t.focus);
		r < 0 && n && (r = this._members.findIndex((e) => e.id === n)), this._m = r >= 0 ? r : 0;
		let i = this._open;
		if (this._stale || this._layoutKey() !== this._builtKey ? this._build() : this._members.forEach((e, t) => this._refreshTab(t)), !i) {
			let e = this._presets.findIndex((e) => e.name === lt(this._members[this._m].rule, this._presets, this._fields));
			this._row = 0, this._col = 0, this._presets.length && this._focusCard(Math.max(0, e));
		}
		this._row = Math.min(this._row, this._rowCount - 1), this._showMember(this._m), i || (this._open = !0, this.element.classList.add("is-open"), this.element.setAttribute("aria-hidden", "false"), this._sound("menuOpen")), this._ensureFonts();
	}
	close() {
		this._closeQueued = !1, this._open && (this._open = !1, this.element.classList.remove("is-open"), this.element.setAttribute("aria-hidden", "true"), this._sound("menuClose"), this.onClose && this.onClose());
	}
	update(e, t) {
		if (!this._open) return !1;
		let n = (e) => !!t && (typeof t.consumeAction == "function" ? t.consumeAction(e) : t.actionPressed(e));
		return n("cancel") || this._closeQueued ? (this.close(), !0) : (n("camLeft") ? this._cycleMember(-1) : n("camRight") && this._cycleMember(1), n("up") ? this._moveRow(-1) : n("down") && this._moveRow(1), n("left") ? this._horizontal(-1) : n("right") && this._horizontal(1), n("confirm") && this._confirm(), !1);
	}
	setRule(e, t) {
		let n = this._members.findIndex((t) => t.id === e);
		n < 0 || (this._members[n].rule = st(t, this._fields, this._presets, this._members[n].rule), this._refreshTab(n), n === this._m && this._refreshRule(0));
	}
	dispose() {
		this.element.removeEventListener("click", this._onClick), this.element.removeEventListener("mousedown", this._onDown), this._offScale(), this._open = !1, this.element.remove();
	}
	_sound(e) {
		this.onSound && this.onSound(e);
	}
	get _presetRows() {
		return Math.ceil(this._presets.length / G);
	}
	get _rowCount() {
		return this._presetRows + this._fields.length;
	}
	_cardIndex() {
		let e = Math.min(this._row, this._presetRows - 1);
		return Math.min(this._presets.length - 1, e * G + this._col);
	}
	_relayout() {
		this._members.length && (this._stale = !1, this._build(), this._showMember(this._m));
	}
	_layoutKey() {
		let e = te(this.element);
		return JSON.stringify([
			re(),
			e ? [
				e.px,
				e.shrink,
				e.artW,
				e.artH
			] : null,
			this._closeKey,
			this._fields.map((e) => [
				e.key,
				e.label,
				e.help,
				e.values,
				e.labels,
				e.hints
			]),
			this._presets.map((e) => [
				e.name,
				e.label,
				e.help,
				e.rule
			]),
			this._members.map((e) => [
				e.id,
				e.name,
				e.color,
				e.cls,
				e.clsId,
				e.clsHelp,
				e.role,
				e.weapon,
				nt(e.portrait)
			])
		]);
	}
	_texts() {
		let e = [
			"panel.party",
			"panel.tactics",
			"panel.presets",
			"panel.rules",
			"panel.custom",
			"panel.empty",
			"panel.presetsHelp",
			"panel.choose",
			"panel.change",
			"panel.pick",
			"panel.member",
			"panel.close"
		].map((e) => M(`party.${e}`));
		return JSON.stringify([
			e,
			this._fields,
			this._presets.map((e) => [e.label, e.help]),
			this._members.map((e) => [
				e.name,
				e.cls,
				e.clsHelp,
				e.role,
				e.weapon
			])
		]);
	}
	_ensureFonts() {
		let e = this._texts();
		e !== this._ensuredText && (this._ensuredText = e, _e(e) && ve(e).then(() => {
			this._open ? this._relayout() : this._stale = !0;
		}));
	}
	_measureGeom() {
		let e = te(this.element), t = e?.artW ?? 640, n = e?.artH ?? 360, r = Math.max(Ue, Math.min(He, t - 32 - (t - 32) % 2)), o = 320 - r / 2, s = o + We, c = o + r - We, l = s + K + 12, u = this._presets.length, f = Math.floor((c - l - 8) / G), m = f - 27 - 8, g = i() ? d.line.L : 16 * d.line.unit, _ = Math.ceil(p("small")), v = (e) => e.help ? h(null, e.help, "line", m, { lineH: i() ? null : 8 }) : 1, y = Math.ceil(u / G), b = (e) => Math.max(35, Math.ceil(15 + _ + D("line") + (e - 1) * g + ye("line") / 2 + 4)), x = [];
		for (let e = 0; e < y; e++) x.push(b(Math.max(1, ...this._presets.slice(e * G, e * G + G).map(v))));
		let S = (e) => y ? e.reduce((e, t) => e + t, 0) + (y - 1) * 3 : 0, C = 61 + this._fields.length * Ge, w = x.map(() => Math.max(35, ...x)), E = n >= 360 ? Math.min(366, qe + (n - 360)) : Math.max(200, n - 32);
		C + S(w) + Je <= E && (x = w);
		let O = 47 + S(x) + 8, k = O + 6, A = k + this._fields.length * Ge, j = 112 + Math.max(1, ...this._members.map((e) => e.clsHelp ? h(null, e.clsHelp, "body", K) : 1)) * d.body.L + 8, ee = Math.max(1, Math.ceil(Math.max(3, this._members.length) / 3)), ne = j + 7, re = ne + ee * 40 + (ee - 1) * 6 + 8, M = re + 40 + 2, N = Math.max(Math.min(E, Math.max(Ke, A + Je)), Math.min(qe, M + Je)), P = n >= 360 && N <= qe ? Math.max(12, Math.round(184 - N / 2)) : Math.round(180 - N / 2), ie = P + 38, F = Math.max(0, ...this._fields.map((e) => T(a(e.label), "small", 1))), ae = Math.max(0, ...this._fields.flatMap((e) => e.values.map((t) => T(e.labels[t], "val")))), oe = l + 20 + F + 8, I = oe + 9 + Math.ceil(ae / 2), se = I + Math.ceil(ae / 2) + 4, ce = se + 13, L = c - ce >= Ye;
		L || (se = c - 9, I = oe + 9 + Math.floor((se - 4 - oe - 9) / 2));
		let le = P + A, ue = P + re, de = ie + 9, fe = x.map((e) => {
			let t = de;
			return de += e + 3, t;
		});
		return {
			WX: o,
			WW: r,
			WY: P,
			WH: N,
			L: s,
			R: c,
			RX: l,
			CY: ie,
			HY: P + 17,
			CW: f,
			CHs: x,
			CYs: fe,
			HW: m,
			RH: P + O,
			RY0: P + k,
			BOT: le,
			la: oe,
			vc: I,
			ra: se,
			hx: ce,
			hints: L,
			BY: ie + 74,
			SH: P + j,
			SY: P + ne,
			NY: ue,
			NH: Math.max(40, Math.min(P + N - Je, Math.max(le, P + M - 2)) - 2 - ue),
			gs: _
		};
	}
	_build() {
		let t = this.element, n = P();
		t.textContent = "", this._stale = !1, this._noteFit.clear(), this._builtKey = this._layoutKey();
		let r = this._measureGeom();
		this._geom = r;
		let { WX: i, WW: o, WY: c, WH: l, L: u, R: d, RX: f, CY: p, HY: h } = r, _ = this._members.length > 1;
		this._paintVeil();
		let v = ee(t, "mc", i, c, o, l, "over lu-party__window");
		v.setAttribute("role", "dialog"), v.setAttribute("aria-label", Y("panel.aria")), this._window = v, m(v, {
			size: "L",
			lattice: !0,
			beads: 6,
			crown: !0,
			trio: !0,
			sides: !0
		}, i, c, o, l);
		let y = $(v, "header", "lu-party__head", [i, c]), b = Y("panel.party");
		C(y, b, u, h, {
			font: "head",
			track: 1,
			color: n.tx1,
			drop: !0,
			cls: `lu-party__kicker${Q()}`
		});
		let x = T(a(b), "head", 1);
		S(y, e(2), u + x + 6, h - 3), C(y, Y("panel.tactics"), u + x + 16, h, {
			font: "small",
			track: 1,
			color: n.g4,
			drop: !0,
			cls: `lu-party__kicker-sub${Q()}`
		});
		let w = $(v, "footer", "lu-party__foot", [i, c]), E = [
			{
				keys: ["↑", "↓"],
				label: Y("panel.choose")
			},
			{
				keys: ["←", "→"],
				label: Y("panel.change")
			},
			{
				keys: ["Space"],
				label: Y("panel.pick")
			},
			..._ ? [{
				keys: ["Q", "E"],
				label: Y("panel.member")
			}] : [],
			{
				keys: this._closeKey && this._closeKey.toLowerCase() !== "esc" ? ["Esc", this._closeKey] : ["Esc"],
				label: Y("panel.close")
			}
		];
		g(w, E, d, h - 5.5, {
			align: "right",
			color: n.tx2,
			drop: !0,
			cls: "lu-party__hint-key"
		}), S(v, s(d - u, "both", n.dm1), u, c + 29), this._memberEl = $(v, "section", "lu-party__member", [i, c]), this._buildSlots(v, r), this._buildNote(v, r);
		let D = f - 14, O = p - 8, k = Z(X("div", "lu-party__body"), [i, c], D, O, d + 10 - D, c + l - 8 - O);
		v.appendChild(k), this._body = k, this._subP = $(k, "h3", "lu-party__sub", [D, O]), this._presetsEl = $(k, "div", "lu-party__presets", [D, O]), this._presetsEl.setAttribute("role", "listbox"), this._presetsEl.setAttribute("aria-label", Y("panel.presets")), this._buildCards(r), this._subR = $(k, "h3", "lu-party__sub", [D, O]), this._rulesEl = $(k, "ul", "lu-party__rules", [D, O]), this._buildRows(r), this._rightWord = "", this._descKey = "";
	}
	_paintVeil() {
		let e = te(this.element), t = (e?.artW ?? 640) + 1, n = (e?.artH ?? 360) + 1, r = P(), i = `${t}x${n}`, a = this._veil;
		(!a || this._veilKey !== i) && (a = b(t, n, o(r.dim), (e, t) => .6 + .28 * Math.min(1, Math.hypot((e - .5) / .5, (t - .5) / .5) ** 1.6), [
			.6,
			.7,
			.8,
			.88
		]), a.setAttribute("aria-hidden", "true"), this._veil = a, this._veilKey = i), S(this.element, a, 0, 0, 1, "veil lu-party__veil");
	}
	_buildSlots(t, n) {
		let r = P(), { L: i, SH: o, SY: s } = n, c = $(t, "nav", "lu-party__tabs", [n.WX, n.WY]);
		c.setAttribute("role", "tablist"), c.setAttribute("aria-label", Y("panel.members"));
		let l = this._members.length, u = Math.max(3, l);
		it(c, Y("panel.party"), i, i + K, o, Y("panel.count", {
			n: Math.min(l, u),
			max: u
		}), "num"), this._tabs = [];
		for (let t = 0; t < u; t++) {
			let o = i + t % 3 * 50, l = s + Math.floor(t / 3) * 46, u = this._members[t];
			if (!u) {
				let t = Z(X("div", "lu-party__slot lu-party__slot--empty"), [n.WX, n.WY], o, l, 40, 40);
				c.appendChild(t), m(t, {
					size: "XS",
					tone: "dim",
					corners: null,
					fill: r["slot-glass"],
					sheen: !1,
					orn: !1
				}, o, l, 40, 40), S(t, e(3, N.dusk(), { setting: [
					r.dm1,
					r.dm2,
					r.dm3
				] }), o + 16, l + 9);
				let i = Y("panel.empty");
				_(t, i, o + Math.floor((40 - T(a(i), "small", 1)) / 2), l + 29 - D("small"), {
					font: "small",
					track: 1,
					color: r.tx3,
					cls: `lu-party__slot-label${Q()}`
				});
				continue;
			}
			let d = Z(X("div", "lu-party__tab"), [n.WX, n.WY], o, l, 40, 40);
			d.setAttribute("role", "tab"), d.style.setProperty("--lu-member", u.color), d.style.setProperty("--lu-member-text", u.text), c.appendChild(d);
			let f = pe(u.color), p = {
				size: "S",
				notch: 3,
				corners: f,
				cornerR: 1,
				bands: [
					r["card-sel0"],
					r["card-sel1"],
					r["card-sel2"]
				],
				stops: [
					0,
					.35,
					.7
				],
				sheen: !1
			};
			rt(m(d, p, o, l, 40, 40), "lu-party__tab-frame lu-party__tab-frame--off"), rt(m(d, {
				...p,
				sel: !0
			}, o, l, 40, 40), "lu-party__tab-frame lu-party__tab-frame--on"), u.portrait ? S(d, oe(u.portrait, I.slot.crop), o + 4, l + 4, 2, "lu-party__tab-sprite") : S(d, e(6, f), o + 13, l + 13, 1, "lu-party__tab-sprite");
			let h = X("span", "lu-party__tab-top lu-party__vh");
			h.appendChild(X("span", "lu-party__chip"));
			let g = X("span", "lu-party__tab-name");
			g.textContent = u.name, h.appendChild(g), d.appendChild(h);
			let v = X("span", "lu-party__tab-sub lu-party__vh"), y = document.createTextNode("");
			v.appendChild(y), d.appendChild(v), this._tabs.push({
				el: d,
				sub: y
			});
		}
		this._members.forEach((e, t) => this._refreshTab(t));
	}
	_buildNote(e, t) {
		let n = P(), { L: r, NY: i, NH: a } = t, o = Z(X("div", "lu-party__desc"), [t.WX, t.WY], r, i, K, a);
		e.appendChild(o), m(o, {
			size: "XS",
			tone: "dim",
			corners: null,
			fill: n["card-glass"],
			sheen: !1,
			orn: !1
		}, r, i, K, a), S(o, F(2, a - 8, (e) => {
			e.vline(0, 0, a - 8, n.g4), e.vline(1, 0, a - 8, n.g2);
		}), r + 4, i + 4), this._desc = o;
	}
	_buildCards(e) {
		let t = P(), { RX: n, CY: r, CW: a, CHs: o, CYs: s, HW: c, gs: l } = e, u = this._presetsEl, d = [n - 14, r - 8];
		this._cards = this._presets.map((e, r) => {
			let f = n + r % G * (a + 8), p = s[Math.floor(r / G)], h = o[Math.floor(r / G)], g = Z(X("div", "lu-party__card"), d, f, p, a, h);
			g.setAttribute("role", "option"), g.dataset.preset = e.name, u.appendChild(g), rt(m(g, {
				size: "XS",
				tone: "dim",
				corners: null,
				fill: t["card-glass"],
				sheen: !1,
				orn: !1
			}, f, p, a, h), "lu-party__card-frame lu-party__card-frame--dim"), rt(m(g, {
				size: "XS",
				corners: N.gold(),
				cornerR: 1,
				fill: t["card-glass"],
				sheen: !1
			}, f, p, a, h), "lu-party__card-frame lu-party__card-frame--focus"), rt(m(g, {
				size: "S",
				notch: 3,
				sel: !0,
				corners: N.gold(),
				cornerR: 1,
				bands: [
					t["card-sel0"],
					t["card-sel1"],
					t["card-sel2"]
				],
				stops: [
					0,
					.35,
					.7
				],
				sheen: !1
			}, f, p, a, h), "lu-party__card-frame lu-party__card-frame--sel");
			let v = Xe(Re, e.name);
			return v && (S(g, Be(v), f + 6, p + 4, 1, "lu-party__card-icon lu-party__card-icon--on"), S(g, Be(v, w()), f + 6, p + 4, 1, "lu-party__card-icon lu-party__card-icon--off")), C(g, e.label, f + 27, p + 9 + l / 2, {
				font: "small",
				track: 1,
				drop: !0,
				cls: `lu-party__card-label${Q()}`
			}), S(g, y("check"), f + a - 15, p + 4, 1, "lu-party__card-mark"), e.help && _(g, e.help, f + 27, p + 15 + l, {
				font: "line",
				maxW: c,
				lineH: i() ? null : 8,
				drop: !0,
				cls: "lu-party__card-help"
			}), S(g, F(a, h, (e) => e.rect(1, 1, a - 2, h - 2, "rgba(244, 227, 179, 0.32)")), f, p, 1, "lu-party__card-flash"), S(g, y("cursor"), f - 9, p + Math.round(h / 2) - 4, 1, "lu-party__card-cursor nudge"), {
				el: g,
				flip: !1
			};
		}), u.classList.toggle("is-empty", !this._presets.length);
	}
	_buildRows(e) {
		P();
		let { RX: t, R: n, RY0: i, la: a, vc: o, ra: s, hx: l } = e, u = this._rulesEl, d = [t - 14, e.CY - 8];
		this._rows = this._fields.map((f, p) => {
			let m = i + p * Ge, h = t - 4, g = Z(X("li", "lu-party__row"), d, h, m, n + 4 - h, Ge);
			g.dataset.field = f.key, u.appendChild(g), S(g, c(n + 4 - h, Ge, { lines: "dim" }), h, m, 1, "lu-party__band"), S(g, y("cursor"), t - 11, m + 6, 1, "lu-party__cursor nudge");
			let v = Xe(Le, f.key);
			v && (S(g, Be(v), t, m + 1, 1, "lu-party__icon lu-party__icon--on"), S(g, Be(v, O()), t, m + 1, 1, "lu-party__icon lu-party__icon--off")), _(g, f.label, t + 20, m + 9.5 - D("small"), {
				font: "small",
				track: 1,
				drop: !0,
				cls: `lu-party__label${Q()}`
			});
			let b = $(g, "span", "lu-party__control", [h, m]), x = (e, t) => {
				let n = Z(X("span", `lu-party__arrow lu-party__arrow--${e}`), [h, m], t - 3, m + 1, 11, 17);
				n.setAttribute("role", "button"), n.setAttribute("aria-label", Y(e === "l" ? "panel.prev" : "panel.next", { field: f.label }));
				let i = e === "l" ? "left" : "right";
				return S(n, y(i), t, m + 5, 1, "lu-party__arrow-on"), S(n, r(i), t, m + 5, 1, "lu-party__arrow-off"), n;
			};
			b.appendChild(x("l", a));
			let w = $(b, "span", "lu-party__value", [h, m]), T = C(w, "", o, m + 7.5, {
				font: "val",
				drop: !0,
				cls: "lu-party__value-t"
			}), E = document.createTextNode("");
			T.appendChild(E);
			let k = Ve(Math.max(1, f.values.length), 0, !1);
			S(w, k, o - Math.floor(k.width / 2), m + 14, 1, "lu-party__pips"), b.appendChild(x("r", s));
			let A = _(g, "", l, m + 9.5 - D("line"), {
				font: "line",
				drop: !0,
				cls: "lu-party__hint"
			}), j = document.createTextNode("");
			return A.appendChild(j), {
				el: g,
				value: T,
				valueText: E,
				valueAt: o,
				hint: A,
				hintText: j,
				hintW: e.hints ? Math.max(20, n - l) : 0,
				hintFull: "",
				hintCut: !1,
				pips: k,
				pipsKey: "",
				flip: !1,
				origin: [h, m]
			};
		});
	}
	_showMember(t) {
		this._m = Math.max(0, Math.min(this._members.length - 1, t));
		let n = this._members[this._m];
		this._tabs.forEach((e, t) => {
			let n = t === this._m;
			e.el.classList.toggle("is-on", n), e.el.setAttribute("aria-selected", String(n));
		});
		let r = this._memberEl, i = this._geom;
		if (r && i) {
			let t = P();
			r.textContent = "", r.style.setProperty("--lu-member", n.color), r.style.setProperty("--lu-member-text", n.text);
			let { L: o, CY: s } = i;
			n.portrait ? S(r, ae(n.portrait, {
				size: I.tactics.size,
				crop: I.tactics.crop,
				k: I.tactics.k,
				glow: pe(n.color)[0]
			}), o - 1, s - 1, 1, "lu-party__portrait") : (m(r, {
				size: "XS",
				fill: t.ink1,
				sheen: !1,
				corners: null,
				orn: !1
			}, o, s, 68, 68), S(r, e(6, pe(n.color)), o + 26, s + 26, 1, "lu-party__portrait"));
			let c = o + 76, l = i.RX - 8 - c, u = a(n.name), p = T(u, "head", 1) <= l ? "head" : "name", g = p === "name" && T(u, "name", 1) > l, v = g ? h(null, n.name, "name", l, {
				track: 1,
				cls: "lu-party__name"
			}) : 1, y = v > 2 ? f(n.name, "name", l, 1) : n.name;
			v > 2 && (g = !1, v = 1);
			let b = d[p].L;
			_(r, y, c, s + 12 - D(p) - (v - 1) * b / 2, {
				font: p,
				track: 1,
				color: n.text,
				drop: !0,
				maxW: g ? l : null,
				cls: `lu-party__name${Q()}`
			});
			let C = X("span", `lu-party__class lu-party__wrap${n.cls ? "" : " is-empty"}`);
			if (x(C, [i.WX, i.WY]), r.appendChild(C), n.cls) {
				let e = Xe(ze, n.clsId);
				e && S(C, Be(e), c - 1, s + 25, 1, "lu-party__class-icon");
				let r = e ? c + 18 : c, o = i.RX - 8 - r, l = +(T(a(n.cls), "small", 1) <= o - 8);
				_(C, f(a(n.cls), "small", o, l), r, s + 33 - D("small"), {
					font: "small",
					track: l,
					color: t.g4,
					drop: !0,
					cls: `lu-party__class-t${Q()}`
				});
			}
			let w = [n.role, n.weapon].filter(Boolean).join(ne());
			w && _(r, f(w, "line", i.RX - 8 - c), c, s + 50 - D("line"), {
				font: "line",
				color: t.tx2,
				drop: !0,
				cls: "lu-party__role"
			}), n.clsHelp && _(r, n.clsHelp, o, i.BY, {
				font: "body",
				color: t.tx2,
				maxW: K,
				drop: !0,
				cls: "lu-party__class-help"
			});
		}
		this.element.dataset.member = n.id, this._refreshRule(0), this._focus(this._row);
	}
	_cycleMember(e) {
		let t = this._members.length;
		t < 2 || (this._showMember((this._m + e + t) % t), this._sound("menuSelect"));
	}
	_refreshTab(e) {
		let t = this._members[e], n = this._tabs[e];
		if (!t || !n) return;
		let r = ut(t.rule, this._presets, this._fields), i = t.cls ? `${t.cls}${ne()}${r}` : r;
		n.sub.nodeValue !== i && (n.sub.nodeValue = i);
	}
	_refreshRule(e, t = -1) {
		let n = this._members[this._m];
		if (!n) return;
		let r = this._row - this._presetRows;
		this._fields.forEach((i, a) => {
			let o = this._rows[a];
			if (!o) return;
			let s = n.rule[i.key], c = q(J(i.labels, s) ?? s);
			o.valueText.nodeValue !== c && (o.valueText.nodeValue = c, o.value.style.left = Qe(o.valueAt - Math.floor(T(c, "val") / 2) - o.origin[0]));
			let l = q(J(i.hints, s)), u = o.hintW > 0 ? f(l, "line", o.hintW) : "";
			o.hintFull = l, o.hintCut = !!l && u !== l, o.hintText.nodeValue !== u && (o.hintText.nodeValue = u), this._paintPips(a, a === r), a === t && e && (o.flip = !o.flip, o.value.classList.remove("is-in-l", "is-in-r", "is-in-l2", "is-in-r2"), o.value.classList.add(`is-in-${e < 0 ? "l" : "r"}${o.flip ? "" : "2"}`));
		});
		let i = lt(n.rule, this._presets, this._fields);
		this._cards.forEach((e, t) => {
			let n = this._presets[t].name === i;
			e.el.classList.toggle("is-current", n), e.el.setAttribute("aria-selected", String(n));
		}), this._headings(ut(n.rule, this._presets, this._fields), i === "custom"), this._refreshTab(this._m), this._geom && this._noteFocus();
	}
	_headings(e, t) {
		let n = this._geom;
		n && this._subP && this._subR && (e !== this._rightWord && (this._rightWord = e, this._subP.textContent = "", this._subR.textContent = "", this._currentEl = it(this._subP, Y("panel.presets"), n.RX, n.R, n.CY + 2, e, "line", "lu-party__current"), it(this._subR, Y("panel.rules"), n.RX, n.R, n.RH, e, "line", "lu-party__current lu-party__current--rules")), this._currentEl?.classList.toggle("is-custom", t), this._subR.querySelector(".lu-party__current--rules")?.classList.toggle("is-custom", t));
	}
	_paintPips(e, t) {
		let n = this._rows[e], r = this._fields[e], i = this._members[this._m];
		if (!n || !r || !i) return;
		let a = Math.max(1, r.values.length), o = Math.max(0, r.values.indexOf(i.rule[r.key])), s = `${a}|${o}|${t}`;
		if (n.pipsKey === s) return;
		n.pipsKey = s;
		let c = Ve(a, o, t);
		c.setAttribute("role", "img"), c.setAttribute("aria-label", Y("panel.of", {
			i: o + 1,
			n: a
		})), c.className = n.pips.className, c.style.cssText = n.pips.style.cssText, n.pips.replaceWith(c), n.pips = c;
	}
	_note(t, n, r = "") {
		let a = this._desc, o = this._geom, s = `${t}\n${n}\n${r}`;
		if (!a || !o || s === this._descKey) return;
		this._descKey = s;
		for (let e of [...a.querySelectorAll(".lu-party__desc-k, .lu-party__desc-t, .lu-party__desc-x")]) e.remove();
		let c = P(), { L: l, NY: u, NH: f } = o, p = f - 15 - 5, m = i() ? d.line.L : 18 * d.line.unit, g = { lineH: i() ? null : 9 }, v = `${n}\n${r}`, y = this._noteFit.get(v);
		if (!y) {
			let e = r ? h(null, r, "line", 114, g) : 0, t = e ? 3 + e * m : 0, i = n ? h(null, n, "body", 122) : 0;
			if (i * d.body.L + t <= p) y = {
				font: "body",
				lines: i,
				extra: e
			};
			else {
				let r = n ? h(null, n, "line", 122, g) : 0;
				y = r * m + t <= p || !e ? {
					font: "line",
					lines: r,
					extra: e
				} : {
					font: "line",
					lines: 0,
					extra: e
				};
			}
			this._noteFit.set(v, y);
		}
		let b = y.font, w = (b === "body" ? y.lines * d.body.L : y.lines * m) + (y.extra ? (y.lines ? 3 : 0) + y.extra * m : 0), T = Math.max(0, Math.floor((p - w) / 2));
		C(a, t, l + 10, u + 9 + T, {
			font: "small",
			track: 1,
			color: c.g4,
			drop: !0,
			cls: `lu-party__desc-k${Q()}`
		});
		let E = u + 15 + T;
		if (y.lines) {
			let e = _(a, n, l + 10, E, {
				font: b,
				color: c.tx2,
				maxW: 122,
				lineH: i() || b === "body" ? null : 9,
				drop: !0,
				cls: "lu-party__desc-t"
			});
			E += e.lines * e.lh + 3;
		}
		if (y.extra) {
			let t = X("div", "lu-party__desc-x lu-party__wrap");
			x(t, [l, u]), a.appendChild(t), S(t, e(1, N.gold()), l + 10, Math.round(E + D("line") - 2.5)), _(t, r, l + 18, E, {
				font: "line",
				color: c.tx1,
				maxW: 114,
				...g,
				drop: !0,
				cls: "lu-party__desc-hint"
			});
		}
	}
	_noteFocus() {
		if (this._row < this._presetRows) {
			this._note(Y("panel.presets"), Y("panel.presetsHelp"));
			return;
		}
		let e = this._row - this._presetRows, t = this._fields[e], n = this._rows[e];
		t && this._note(t.label, t.help, n && n.hintCut ? n.hintFull : "");
	}
	_focus(e) {
		let t = this._row - this._presetRows;
		this._row = Math.max(0, Math.min(this._rowCount - 1, e));
		let n = this._row < this._presetRows, r = n ? this._cardIndex() : -1;
		n && (this._col = r - Math.floor(r / G) * G), this._cards.forEach((e, t) => e.el.classList.toggle("is-focus", t === r)), this._presetsEl?.classList.toggle("is-focus", n);
		let i = this._row - this._presetRows;
		this._rows.forEach((e, t) => e.el.classList.toggle("is-sel", t === i)), t !== i && (this._paintPips(t, !1), this._paintPips(i, !0)), this._noteFocus(), this._scrollToFocus();
	}
	_scrollToFocus() {
		let e = this._body;
		if (!e || e.scrollHeight <= e.clientHeight) return;
		let t = this._row < this._presetRows, n = t ? this._cards[this._cardIndex()]?.el : this._rows[this._row - this._presetRows]?.el;
		if (!n) return;
		let r = !t && this._row === this._presetRows ? this._subR?.querySelector(".lu-party__sub-t") ?? null : null, i = t && this._row === 0 ? 0 : r ? Math.min(n.offsetTop, r.offsetTop) : n.offsetTop, a = n.offsetTop + n.offsetHeight;
		i < e.scrollTop ? e.scrollTop = i : a > e.scrollTop + e.clientHeight && (e.scrollTop = Math.min(i, a - e.clientHeight));
	}
	_focusCard(e) {
		let t = Math.max(0, Math.min(this._presets.length - 1, e));
		this._row = Math.floor(t / G), this._col = t - this._row * G, this._focus(this._row);
	}
	_moveRow(e) {
		let t = this._rowCount;
		t < 2 || (this._focus((this._row + e + t) % t), this._sound("menuMove"));
	}
	_horizontal(e) {
		if (this._row < this._presetRows) {
			let t = this._presets.length;
			if (t < 2) return;
			this._focusCard((this._cardIndex() + e + t) % t), this._sound("menuMove");
		} else this._step(this._row - this._presetRows, e);
	}
	_confirm() {
		this._row < this._presetRows ? this._pick(this._cardIndex()) : this._step(this._row - this._presetRows, 1);
	}
	_step(e, t) {
		let n = this._members[this._m], r = this._fields[e];
		if (!n || !r || r.values.length < 2) return;
		let i = r.values.indexOf(n.rule[r.key]), a = r.values.length;
		n.rule = {
			...n.rule,
			[r.key]: r.values[(Math.max(0, i) + t + a) % a]
		}, this._refreshRule(t, e), this._sound("menuSelect"), this._emit(n);
	}
	_pick(e) {
		let t = this._members[this._m], n = this._presets[e];
		if (!t || !n) return;
		let r = this._fields.every((e) => t.rule[e.key] === n.rule[e.key]);
		if (this._sound("menuSelect"), r) return;
		t.rule = { ...n.rule }, this._refreshRule(0);
		let i = this._cards[e];
		i.flip = !i.flip, i.el.classList.toggle("is-picked-a", i.flip), i.el.classList.toggle("is-picked-b", !i.flip), this._emit(t);
	}
	_emit(e) {
		this.onRule && this.onRule(e.id, { ...e.rule });
	}
}, et = /* @__PURE__ */ new WeakMap(), tt = 0;
function nt(e) {
	if (!e) return 0;
	let t = et.get(e);
	return t || (t = ++tt, et.set(e, t)), t;
}
function $(e, t, n, r) {
	let i = X(t, `${n} lu-party__wrap`);
	return x(i, r), e.appendChild(i), i;
}
function rt(e, t) {
	let n = t.split(" ");
	return e.base.classList.add(...n), e.orn?.classList.add(...n), e;
}
function it(e, t, n, r, i, o, c, l = "") {
	let u = P();
	C(e, t, n, i, {
		font: "small",
		track: 1,
		color: u.g4,
		drop: !0,
		cls: `lu-party__sub-t${Q()}`
	});
	let d = T(a(t), "small", 1), f = o ? T(o, c) + 6 : 0;
	return S(e, s(Math.max(4, r - n - d - 6 - f), "r"), n + d + 5, Math.round(i)), o ? C(e, o, r, i, {
		font: c,
		color: u.g4,
		align: "right",
		drop: !0,
		cls: l
	}) : null;
}
function at(e) {
	if (!e || typeof e != "object") return [];
	let t = [];
	for (let n of Object.keys(e)) {
		let r = J(e, n);
		if (!r || typeof r != "object") continue;
		let i = J(r, "values"), a = Array.isArray(i) ? [...new Set(i.filter((e) => typeof e == "string" && e))] : [];
		if (!a.length) continue;
		let o = Object.create(null), s = Object.create(null);
		for (let e of a) o[e] = q(J(J(r, "labels"), e)) || e, s[e] = q(J(J(r, "hints"), e));
		t.push({
			key: n,
			label: q(J(r, "label")) || n,
			help: q(J(r, "help")),
			values: a,
			labels: o,
			hints: s
		});
	}
	return t;
}
function ot(e, t) {
	if (!e || typeof e != "object") return [];
	let n = [];
	for (let r of Object.keys(e)) {
		let i = J(e, r);
		if (!i || typeof i != "object") continue;
		let a = J(i, "rule"), o = {};
		for (let e of t) {
			let t = J(a, e.key);
			o[e.key] = typeof t == "string" && e.values.includes(t) ? t : e.values[0];
		}
		n.push({
			name: r,
			label: q(J(i, "label")) || r,
			help: q(J(i, "help")),
			rule: o
		});
	}
	return n;
}
function st(e, t, n, r) {
	let i = {};
	for (let a of t) {
		let t = J(e, a.key), o = (e) => typeof e == "string" && a.values.includes(e);
		i[a.key] = o(t) ? t : o(r?.[a.key]) ? r[a.key] : o(n[0]?.rule[a.key]) ? n[0].rule[a.key] : a.values[0];
	}
	return i;
}
function ct(e, t, n) {
	if (!Array.isArray(e)) return [];
	let r = [];
	for (let i of e) {
		if (!i || typeof i != "object") continue;
		let e = q(J(i, "id"));
		if (!e || r.some((t) => t.id === e)) continue;
		let a = le(J(i, "color")), o = J(i, "portrait");
		r.push({
			id: e,
			name: q(J(i, "name")) || e,
			color: a,
			text: fe(a),
			cls: q(J(i, "cls")),
			clsId: q(J(i, "clsId")),
			clsHelp: q(J(i, "clsHelp")),
			role: q(J(i, "role")),
			weapon: q(J(i, "weapon")),
			portrait: typeof HTMLCanvasElement < "u" && o instanceof HTMLCanvasElement && o.width >= 32 && o.height >= 32 ? o : null,
			rule: st(J(i, "rule"), t, n)
		});
	}
	return r;
}
function lt(e, t, n) {
	for (let r of t) if (n.every((t) => r.rule[t.key] === e[t.key])) return r.name;
	return "custom";
}
function ut(e, t, n) {
	let r = lt(e, t, n);
	return r === "custom" ? Y("panel.custom") : t.find((e) => e.name === r)?.label ?? r;
}
//#endregion
//#region src/game/party/partyUI.js
function dt() {
	return se(), {
		PartyPanel: $e,
		PartyFrames: Ae
	};
}
//#endregion
export { dt as partyUIClasses };
