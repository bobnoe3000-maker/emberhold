import { pr as e } from "./three.core-DTUh_wZY.js";
import { n as t } from "./own-rp3p7qEo.js";
import { a as n, i as r, n as i, t as a } from "./logo-CfzVN91L.js";
import { $ as o, A as s, B as c, J as l, K as u, L as d, M as f, O as p, R as m, St as h, T as g, U as _, Y as v, Z as y, _ as b, at as x, c as S, d as C, dt as w, f as T, ft as E, h as D, ht as O, j as k, k as A, l as ee, lt as j, m as M, mt as N, nt as P, ot as te, p as ne, pt as re, q as F, r as ie, s as ae, st as oe, t as se, u as I, yt as L } from "./core-C1cYbmwD.js";
import { a as ce, n as le, r as ue, u as R } from "./I18n-BeKB4FMa.js";
import { d as z, m as B, s as V } from "./gilt-DNFH9voM.js";
//#region src/engine/i18n/strings/story-ui.js
var H = {
	en: {
		"journal.title": "Journal",
		"tab.quests": "Quests",
		"tab.items": "Items",
		"group.active": "Active",
		"group.concluded": "Concluded",
		"group.keyItems": "Key Items",
		"group.items": "Items",
		"state.active": "In progress",
		"state.done": "Completed",
		"state.failed": "Failed",
		"empty.quests": "No quests yet.",
		"empty.items": "Your pack is empty.",
		"empty.questsHint": "What the people you meet ask of you is written here.",
		"empty.itemsHint": "What you find and are given is kept here.",
		objectives: "Objectives",
		log: "Log",
		keyItem: "Key Item",
		unknownItem: "Nothing more is known of it.",
		count: "×{n}",
		gold: "G",
		"hint.tabs": "Tabs",
		"hint.select": "Select",
		"hint.close": "Close",
		"end.prompt": "Press {key} to continue",
		"skip.hold": "Hold {key} to skip"
	},
	ja: {
		"journal.title": "日誌",
		"tab.quests": "クエスト",
		"tab.items": "アイテム",
		"group.active": "進行中",
		"group.concluded": "終了",
		"group.keyItems": "だいじなもの",
		"group.items": "アイテム",
		"state.active": "進行中",
		"state.done": "達成",
		"state.failed": "失敗",
		"empty.quests": "まだクエストはない。",
		"empty.items": "かばんは空っぽだ。",
		"empty.questsHint": "出会った人々に頼まれたことは、ここに記される。",
		"empty.itemsHint": "見つけた物や受け取った物は、ここにしまわれる。",
		objectives: "目標",
		log: "記録",
		keyItem: "だいじなもの",
		unknownItem: "それ以上のことは分からない。",
		count: "×{n}",
		gold: "G",
		"hint.tabs": "切替",
		"hint.select": "選択",
		"hint.close": "閉じる",
		"end.prompt": "{key}で続ける",
		"skip.hold": "{key}長押しでスキップ"
	},
	zh: {
		"journal.title": "日志",
		"tab.quests": "任务",
		"tab.items": "物品",
		"group.active": "进行中",
		"group.concluded": "已结束",
		"group.keyItems": "重要物品",
		"group.items": "物品",
		"state.active": "进行中",
		"state.done": "已完成",
		"state.failed": "失败",
		"empty.quests": "暂无任务。",
		"empty.items": "背包空空如也。",
		"empty.questsHint": "旅途中受人所托之事，都会记在这里。",
		"empty.itemsHint": "找到或收到的物品，都会收在这里。",
		objectives: "目标",
		log: "记录",
		keyItem: "重要物品",
		unknownItem: "除此之外一无所知。",
		count: "×{n}",
		gold: "G",
		"hint.tabs": "切换",
		"hint.select": "选择",
		"hint.close": "关闭",
		"end.prompt": "按{key}继续",
		"skip.hold": "长按{key}跳过"
	}
}, U = ["quests", "items"], de = 608, W = 328, fe = 480, pe = 8, G = 13, K = 25;
function q(e, t) {
	let n = Math.max(fe, Math.min(de, e - 32 - (e - 32) % 2)), r = t >= 360 ? W : Math.max(200, t - 32), i = 320 - n / 2, a = t >= 360 ? 20 : Math.round(180 - r / 2), o = i + 26, s = i + n - 26, c = n >= de ? 216 : Math.max(160, Math.round(216 * (s - o) / 556)), l = o - 12, u = l + c, d = u + 10, f = d + 12, p = s + 2;
	return {
		WX: i,
		WY: a,
		WW: n,
		WH: r,
		L: o,
		R: s,
		HY: a + 17,
		RULE: a + 29,
		CY: a + 38,
		BOT: a + r - 22,
		LX0: l,
		LX1: u,
		DIV: d,
		DX0: f,
		DX1: p,
		LW: c,
		DW: p - f - 6,
		COUNT_R: c - 8
	};
}
function me() {
	ue("story-ui") || ce("story-ui", H);
}
var J = (e, t) => R(`story-ui.${e}`, t), he = /* @__PURE__ */ new WeakMap();
function ge(e) {
	let t = he.get(e);
	if (!t) {
		t = [];
		for (let n of String(e.unicodeRange || "U+0-10FFFF").split(",")) {
			let e = /U\+([0-9a-f?]+)(?:-([0-9a-f]+))?/i.exec(n.trim());
			if (!e) continue;
			let r = parseInt(e[1].replace(/\?/g, "0"), 16), i = parseInt(e[2] ?? e[1].replace(/\?/g, "f"), 16);
			Number.isFinite(r) && Number.isFinite(i) && t.push([r, i]);
		}
		he.set(e, t);
	}
	return t;
}
function _e(e, t) {
	let n = String(e).trim().split(/\s+/).map((e) => e === "normal" ? 400 : e === "bold" ? 700 : Number(e)), r = n[0], i = n[1] ?? n[0];
	if (!Number.isFinite(r)) return !0;
	for (let e of t) if (e >= r && e <= i) return !0;
	return !1;
}
function ve(e) {
	if (!e || typeof document > "u" || !document.fonts) return !1;
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		let e = n.codePointAt(0);
		e > 255 && t.add(e);
	}
	if (!t.size) return !1;
	let n = /* @__PURE__ */ new Map();
	for (let e of Object.values(oe())) for (let t of e.family.split(",")) {
		let r = t.trim().replace(/^["']|["']$/g, "");
		n.has(r) || n.set(r, /* @__PURE__ */ new Set()), n.get(r).add(Number(e.w) || 400);
	}
	try {
		for (let e of document.fonts) {
			if (e.status === "loaded" || e.status === "error") continue;
			let r = n.get(e.family.replace(/^["']|["']$/g, ""));
			if (r && _e(e.weight, r)) {
				for (let [n, r] of ge(e)) for (let e of t) if (e >= n && e <= r) return !0;
			}
		}
	} catch {
		return !1;
	}
	return !1;
}
function ye(e) {
	let t = [c()?.ensure(e) ?? Promise.resolve()];
	if (typeof document < "u" && document.fonts) for (let n of te()) t.push(document.fonts.load(n, e).catch(() => []));
	return Promise.all(t).then(() => {}, () => {});
}
var be = (e) => (oe(), _[e].ink * _[e].unit), xe = /[、。，．,.！？!?：；:;」』）】〕〉》”’ー…‥ぁぃぅぇぉっゃゅょゎァィゥェォッャュョヮ]/, Se = /[「『（【〔〈《“‘]/, Ce = /^[A-Za-z0-9À-ɏ'’.,:;!?%/+\-× ]+$/;
function we(e) {
	let t = Intl.Segmenter, n = le() === "ja" && typeof t == "function" ? [...new t("ja", { granularity: "word" }).segment(e)].map((e) => e.segment) : [...e], r = [];
	for (let e of n) {
		let t = r.length;
		t && Ce.test(e) && Ce.test(r[t - 1]) ? r[t - 1] += e : r.push(e);
	}
	return r;
}
function Te(e, t, n, r = 0) {
	if (P(e, t, r) <= n) return [e];
	let i = (e) => P(e.trimEnd(), t, r) <= n, a = [];
	if (l()) {
		let t = "";
		for (let n of we(e)) {
			if (!t || i(t + n) || xe.test(n[0])) {
				t += n;
				continue;
			}
			let e = "";
			for (; t.length > 1 && Se.test(t[t.length - 1]);) e = t[t.length - 1] + e, t = t.slice(0, -1);
			for (a.push(t.trimEnd()), t = (e + n).trimStart(); t.length > 1 && !i(t);) {
				let e = t.length - 1;
				for (; e > 1 && !i(t.slice(0, e));) e--;
				a.push(t.slice(0, e).trimEnd()), t = t.slice(e).trimStart();
			}
		}
		t && a.push(t.trimEnd());
	} else {
		let t = "";
		for (let n of e.split(/ +/)) {
			let e = t ? `${t} ${n}` : n;
			if (i(e)) {
				t = e;
				continue;
			}
			t && a.push(t), t = "";
			let r = "";
			for (let e of n) r && !i(r + e) && (a.push(r), r = ""), r += e;
			t = r;
		}
		t && a.push(t);
	}
	let o = !1;
	return a.filter((e) => e !== "").map((e) => {
		let t = o ? `{${e}` : e;
		for (let t of e) t === "{" ? o = !0 : t === "}" && (o = !1);
		return o && (t += "}"), t;
	});
}
function Y(e, t, n, r, i, a = null, o = null) {
	let s = document.createElement(t);
	s.className = `g ${n}`;
	let [c, l] = x(e), u = Math.round(r - c), d = Math.round(i - l);
	return ne(s, u, d, a, o), j(s, [c + u, l + d]), e.append(s), s;
}
function Ee() {
	let e = B(), t = [
		"oo...oo",
		"oHo.oRo",
		".oHoRo.",
		"..oRo..",
		".oRoDo.",
		"oRo.oDo",
		"oo...oo"
	];
	return V(7, 7, (n) => n.rows(0, 0, t, {
		o: e.ink0,
		H: e.rb3,
		R: e.rb2,
		D: e.rb1
	}));
}
function De() {
	let e = B(), t = [
		".ooo.....",
		"oWLGooooo",
		"oL.DLLLGo",
		"oGDDoGoGo",
		".ooo.o.o.",
		"........."
	];
	return V(9, 6, (n) => n.rows(0, 0, t, {
		o: e.ink0,
		W: e.g5,
		L: e.g4,
		G: e.g3,
		D: e.g2
	}));
}
function Oe(e) {
	let t = B(), n = e ? [
		".ooooooo.",
		"oLLLLLLGo",
		"oLiiiiWGo",
		"oLiiiWLGo",
		"oLWiWLiGo",
		"oLLWLiiGo",
		"oLiLiiiGo",
		"oGGGGGGGo",
		".ooooooo."
	] : [
		".ooooooo.",
		"oMMMMMMNo",
		"oMiiiiiNo",
		"oMiiiiiNo",
		"oMiiiiiNo",
		"oMiiiiiNo",
		"oMiiiiiNo",
		"oNNNNNNNo",
		".ooooooo."
	];
	return V(9, 9, (e) => e.rows(0, 0, n, {
		o: t.ink0,
		L: t.g4,
		G: t.g2,
		W: t.g5,
		M: t.dm1,
		N: t.dm3,
		i: t.ink1
	}));
}
function ke(e) {
	let t = B();
	return V(e, 9, (n) => {
		n.rect(1, 0, e - 2, 9, t.ink0), n.rect(0, 1, e, 7, t.ink0), n.rect(1, 1, e - 2, 7, t.plate1), n.hline(2, 1, e - 4, t.dm1);
	});
}
function Ae(e) {
	let t = B(), n = e + (e % 2 ? 0 : 1), r = f(n, "both", t.g3);
	return V(n, 5, (e) => {
		e.ctx.drawImage(r, 0, 2);
		let i = Math.floor(n / 2);
		e.ctx.clearRect(i - 3, 2, 7, 1), e.rows(i - 2, 0, [
			"..o..",
			".oWo.",
			"oLGDo",
			".oBo.",
			"..o.."
		], {
			o: t.ink0,
			W: t.g5,
			L: t.g4,
			G: t.g3,
			D: t.g2,
			B: t.g1
		});
	});
}
function je(e) {
	let t = B();
	return V(2, e, (n) => {
		for (let r = 0; r < e; r += 2) n.px(0, r, t.dm3);
	});
}
function Me(e) {
	let t = B();
	return V(2, e, (n) => {
		n.vline(0, 0, e, t.g4), n.vline(1, 0, e, t.g2), n.px(0, 0, t.g5);
	});
}
function Ne(e) {
	let t = B();
	return V(1, e, (n) => {
		for (let r = 0; r < e; r++) {
			let i = Math.abs((r + .5) / e - .5) * 2;
			i > .72 && r % 2 || i > .88 && r % 4 || n.px(0, r, t.dm2);
		}
	});
}
var Pe = /* @__PURE__ */ new Map();
function Fe(e, t) {
	let n = `${e}x${t}`, r = Pe.get(n);
	r || (r = A(e, t, d(B().dim), (e, t) => .6 + .28 * Math.min(1, Math.hypot((e - .5) / .5, (t - .5) / .5) ** 1.6), [
		.6,
		.7,
		.8,
		.88
	]), Pe.clear(), Pe.set(n, r));
	let i = document.createElement("canvas");
	return i.width = r.width, i.height = r.height, i.getContext("2d").drawImage(r, 0, 0), i;
}
var X = (e) => e == null ? "" : String(e);
function Ie(e) {
	let t = e && typeof e == "object" ? e : {}, n = (Array.isArray(t.quests) ? t.quests : []).filter((e) => e && typeof e == "object").map((e, t) => ({
		id: X(e.id) || `#${t}`,
		title: X(e.title) || X(e.id),
		state: e.state === "done" || e.state === "failed" ? e.state : "active",
		text: X(e.text),
		log: (Array.isArray(e.log) ? e.log : []).map(X).filter(Boolean),
		goals: (Array.isArray(e.goals) ? e.goals : []).filter((e) => e && typeof e == "object").map((e) => ({
			text: X(e.text),
			done: !!e.done
		})).filter((e) => e.text)
	})), r = (Array.isArray(t.items) ? t.items : []).filter((e) => e && typeof e == "object").map((e, t) => {
		let n = Number(e.count);
		return {
			id: X(e.id) || `#${t}`,
			name: X(e.name) || X(e.id),
			count: Number.isFinite(n) ? Math.max(0, Math.floor(n)) : 1,
			text: X(e.text),
			key: !!e.key
		};
	}), i = Number(t.gold);
	return {
		quests: n,
		items: r,
		gold: Number.isFinite(i) ? Math.max(0, Math.floor(i)) : 0
	};
}
var Le = class {
	constructor(e) {
		me(), this.onSound = null, this.onClose = null;
		let t = document.createElement("div");
		t.className = "lu-journal", t.setAttribute("aria-hidden", "true"), t.setAttribute("data-input-ignore", ""), e.appendChild(t), this.element = t, this._parent = e, this._open = !1, this._tab = "quests", this._data = Ie({}), this._sel = {
			quests: "",
			items: ""
		}, this._entries = [], this._index = -1, this._dirty = !0, this._closeQueued = !1, this._rp = 16, this._window = null, this._list = null, this._detail = null, this._veil = null, this._selArt = null, this._scrolls = [], this._fontJob = 0, this._onBackdrop = (e) => {
			this._open && !(this._window && this._window.contains(e.target)) && (this._closeQueued = !0);
		}, t.addEventListener("click", this._onBackdrop), this._onListClick = (e) => {
			let t = e.target.closest?.(".lu-journal__entry");
			if (!t || !this._open) return;
			let n = this._entries.findIndex((e) => e.el === t);
			n >= 0 && n !== this._index && (this._select(n, !1), this._sound("blip"));
		}, this._onScroll = (e) => this._updateScroll(e.target), this._offScale = h(e, () => {
			this._veilSize = "", this._open ? this._layout(!0) : this._dirty = !0;
		}), this._veilSize = "", this._G = q(640, 360);
	}
	get isOpen() {
		return this._open;
	}
	get tab() {
		return this._tab;
	}
	get selectedId() {
		return this._entries[this._index]?.id ?? "";
	}
	setData(e) {
		this._data = Ie(e), this._dirty = !0, this._open && this._render();
	}
	open(e = "quests") {
		let t = U.includes(e) ? e : "quests";
		return this._closeQueued = !1, this._open || (this._open = !0, this.element.classList.add("is-open"), this.element.setAttribute("aria-hidden", "false"), this._sound("open")), (t !== this._tab || this._dirty) && (this._tab = t, this._render()), !0;
	}
	close() {
		return this._closeQueued = !1, this._open ? (this._open = !1, this.element.classList.remove("is-open"), this.element.setAttribute("aria-hidden", "true"), this._sound("close"), !1) : !1;
	}
	update(e, t) {
		if (!this._open) return !1;
		let n = (e) => !!t && (typeof t.consumeAction == "function" ? t.consumeAction(e) : t.actionPressed(e));
		return n("cancel") || this._closeQueued ? (this.close(), this.onClose && this.onClose(), !0) : (n("camLeft") || n("left") ? this._cycleTab(-1) : (n("camRight") || n("right")) && this._cycleTab(1), n("up") ? this._move(-1) : n("down") && this._move(1), !1);
	}
	dispose() {
		this._offScale(), this._fontJob++, this.element.removeEventListener("click", this._onBackdrop), this.element.remove();
	}
	_sound(e) {
		this.onSound && this.onSound(e);
	}
	_cycleTab(e) {
		let t = U.indexOf(this._tab);
		this._setTab(U[(t + e + U.length) % U.length]), this._sound("confirm");
	}
	_setTab(e) {
		this._tab = e, this._render();
	}
	_move(e) {
		let t = this._entries.length;
		t < 2 || (this._select((this._index + e + t) % t, !0), this._sound("blip"));
	}
	_render() {
		this._dirty = !1, this._layout(!1);
		let e = `${JSON.stringify(this._data)}${Object.keys(H.en).map((e) => J(e)).join("")}`;
		if (ve(e)) {
			let t = ++this._fontJob;
			ye(e).then(() => {
				t === this._fontJob && this._open && this._layout(!0);
			});
		}
	}
	_layout(e) {
		let t = this.element, n = e && this._list ? this._list.scrollTop : 0, r = e && this._detail ? this._detail.scrollTop : 0;
		this._fontJob += +!e;
		let i = L(t), a = Math.ceil((i?.W ?? 1280) / (i?.px ?? 2)), o = Math.ceil((i?.H ?? 720) / (i?.px ?? 2)), s = `${a}x${o}`;
		(!this._veil || this._veilSize !== s) && (this._veil?.remove(), this._veil = Fe(a, o), this._veil.className = "lu-journal__veil", this._veil.setAttribute("aria-hidden", "true"), this._veil.style.width = S(a), this._veil.style.height = S(o), t.prepend(this._veil), this._veilSize = s), this._window?.remove(), this._scrolls = [];
		let c = B(), l = q(i?.artW ?? 640, i?.artH ?? 360);
		this._G = l;
		let { WX: u, WY: d, WW: p, WH: m, L: h, R: g, RULE: _, CY: v, BOT: y, LX0: x, LX1: C, DIV: w, DX0: T, DX1: E, LW: D } = l, O = I(t, "mc", u, d, p, m, "over lu-journal__window");
		O.setAttribute("role", "dialog"), O.setAttribute("aria-label", J("journal.title")), this._window = O, b(O, {
			size: "L",
			lattice: !0,
			beads: 6,
			crown: !0,
			trio: !0,
			sides: !0
		}, u, d, p, m), this._header(O), M(O, f(g - h, "both", c.dm1), h, _);
		let k = this._tab === "quests" ? !this._data.quests.length : !this._data.items.length;
		O.classList.toggle("is-empty", k), k || M(O, Ne(y - v), w, v, 1, "lu-journal__divider");
		let A = Y(O, "ul", "lu-journal__list", x, v, D, y - v);
		A.addEventListener("click", this._onListClick), A.addEventListener("scroll", this._onScroll, { passive: !0 }), this._list = A;
		let ee = Y(O, "article", "lu-journal__detail", T, v, E - T, y - v);
		ee.addEventListener("scroll", this._onScroll, { passive: !0 }), this._detail = ee, this._scrolls.push(this._scrollMark(O, A, C + 3), this._scrollMark(O, ee, E + 2)), this._buildList(A), k && this._emptyState(O), A.scrollTop = n;
		let j = this._entries.findIndex((e) => e.id === this._sel[this._tab]);
		this._index = -1, this._select(j >= 0 ? j : 0, !e), e && (ee.scrollTop = r);
		for (let e of this._scrolls) this._updateScroll(e.box);
	}
	_emptyState(e) {
		let t = B(), { L: n, R: r, CY: i, BOT: a } = this._G, o = this._tab === "quests", s = Y(e, "div", "lu-journal__none", n, i), c = Math.round((n + r) / 2), u = J(o ? "empty.quests" : "empty.items"), d = Te(J(o ? "empty.questsHint" : "empty.itemsHint"), "line", Math.min(r - n - 40, 320)), f = l() ? _.line.L : 18 * _.line.unit, p = Math.max(8, be("name")), m = 40 + p + 7 + d.length * f, h = Math.round(i + (a - i - m) / 2) - 4;
		M(s, ae(se[o ? "scroll" : "chest"], {
			...ie(),
			scale: 2
		}), c - 16, h, 1, "lu-journal__none-icon"), h += 40, N(s, u, c, h + p / 2, {
			font: "name",
			color: t.tx1,
			drop: !0,
			align: "center",
			cls: "lu-journal__empty"
		}), h += p + 7;
		for (let e of d) O(s, e, c, h, {
			font: "line",
			color: t.tx3,
			drop: !0,
			align: "center",
			lineH: l() ? null : 9,
			cls: "lu-journal__empty-hint"
		}), h += f;
	}
	_header(e) {
		let t = B(), { WX: n, WY: r, L: i, R: a, HY: o } = this._G, c = Y(e, "div", "lu-journal__head", n, r), l = u(J("journal.title"));
		N(c, l, i, o, {
			font: "head",
			track: 1,
			color: t.tx1,
			drop: !0,
			cls: "lu-journal__kicker"
		});
		let d = P(l, "head", 1);
		M(c, s(2), i + d + 6, o - 3);
		let f = Y(c, "nav", "lu-journal__tabs", n, r);
		f.setAttribute("aria-label", J("hint.tabs"));
		let p = i + d + 18;
		p += C(f, "Q", p, o - 5.5, { cls: "lu-journal__cap" }) + 7;
		let m = this._data.quests.filter((e) => e.state === "active").length, h = Math.ceil(y("small"));
		for (let e of U) {
			let n = e === this._tab, r = u(J(`tab.${e}`)), i = P(r, "small", 1), a = e === "quests" ? m : 0, s = a ? P(String(a), "num") + 6 : 0, c = i + (a ? 4 + s : 0) + 6, l = Y(f, "button", `lu-journal__tab${n ? " is-on" : ""}`, p, o - 8 - h / 2, c, 16 + h);
			l.type = "button", l.dataset.tab = e, l.setAttribute("aria-selected", String(n)), l.addEventListener("mousedown", (e) => e.preventDefault()), l.addEventListener("click", (t) => {
				t.stopPropagation(), this._open && e !== this._tab && (this._setTab(e), this._sound("confirm"));
			}), N(l, r, p + 3, o, {
				font: "small",
				track: 1,
				color: n ? t.g5 : t.tx3,
				drop: !0,
				cls: "lu-journal__tab-label"
			});
			let d = Y(l, "span", "lu-journal__badge", p + 3 + i + 4, o - 4.5);
			a && (M(d, ke(s), p + 3 + i + 4, o - 4.5), N(d, String(a), p + 3 + i + 7, o, {
				font: "num",
				color: t.g5
			})), n && M(l, Ae(i + 4), p + 1, o + 4 + h / 2), p += c + 6;
		}
		C(f, "E", p + 1, o - 5.5, { cls: "lu-journal__cap" });
		let _ = Y(c, "div", "lu-journal__foot", n, r), v = T(_, [{
			keys: ["↑", "↓"],
			label: J("hint.select")
		}, {
			keys: ["Esc"],
			label: J("hint.close")
		}], a, o - 5.5, {
			align: "right",
			color: t.tx2,
			drop: !0,
			cls: "lu-journal__hint"
		}), b = Y(c, "div", `lu-journal__gold${this._tab === "items" ? " is-on" : ""}`, n, r), x = this._data.gold.toLocaleString("en-US"), S = J("gold"), w = P(x, "num"), E = P(S, "tiny"), D = a - v - 14;
		M(b, g(), D - E - 2 - w - 3 - 9, o - 4.5, 1, "lu-journal__coin"), N(b, x, D - E - 2 - w, o, {
			font: "num",
			color: t.kw,
			drop: !0,
			cls: "lu-journal__gold-n"
		}), N(b, S, D - E, o - .5, {
			font: "tiny",
			color: t.g3,
			drop: !0
		});
	}
	_scrollMark(e, t, n) {
		let { CY: r, BOT: i } = this._G, a = i - r, o = M(e, je(a), n, r, 1, "lu-journal__track"), s = M(e, Me(8), n, r, 1, "lu-journal__thumb");
		return o.style.visibility = "hidden", s.style.visibility = "hidden", {
			box: t,
			thumb: s,
			track: o,
			y: r,
			h: a,
			th: 8
		};
	}
	_updateScroll(e) {
		let t = this._scrolls.find((t) => t.box === e);
		if (!t) return;
		let n = e.scrollHeight - e.clientHeight, r = n > 1;
		if (t.track.style.visibility = r ? "" : "hidden", t.thumb.style.visibility = r ? "" : "hidden", !r) return;
		let i = Math.max(8, Math.round(t.h * e.clientHeight / e.scrollHeight));
		if (i !== t.th) {
			let e = Me(i);
			t.thumb.width = e.width, t.thumb.height = e.height, t.thumb.getContext("2d").drawImage(e, 0, 0), t.thumb.style.height = S(i), t.th = i;
		}
		let a = Math.round((t.h - i) * Math.min(1, e.scrollTop / n));
		t.thumb.style.top = S(t.y + a - x(t.thumb.parentElement)[1]);
	}
	_buildList(e) {
		let t = B(), { LX0: n, CY: r, LW: i, COUNT_R: a } = this._G, { quests: o, items: c } = this._data;
		this._entries = [];
		let l = 16 + 2 * Math.ceil(y("body") / 2), d = 13 + Math.ceil(y("small"));
		this._rp = l;
		let f = M(e, m(i - pe - 2, l), n + pe, r, 1, "lu-journal__sel"), p = M(e, k("cursor"), n + 1, r + l / 2 - 4, 1, "nudge lu-journal__cursor");
		f.style.visibility = "hidden", p.style.visibility = "hidden", this._selArt = {
			band: f,
			cursor: p
		};
		let h = this._tab === "quests" ? [{
			label: J("group.active"),
			rows: o.filter((e) => e.state === "active")
		}, {
			label: J("group.concluded"),
			rows: o.filter((e) => e.state !== "active")
		}] : [{
			label: J("group.keyItems"),
			rows: c.filter((e) => e.key)
		}, {
			label: J("group.items"),
			rows: c.filter((e) => !e.key)
		}], g = 0;
		for (let o of h) {
			if (!o.rows.length) continue;
			let c = Y(e, "li", "lu-journal__group", n, r + g);
			D(c, u(o.label), n + G, n + a, r + g + d / 2, String(o.rows.length), "num");
			let f = g;
			g += d, o.rows.forEach((o, c) => {
				let u = o, d = this._tab === "quests", p = d ? u.state === "active" ? "" : u.state : u.key ? "key" : "", m = Y(e, "li", `lu-journal__entry${p ? ` is-${p}` : ""}`, n, r + g, i, l), h = r + g + l / 2, _ = Y(m, "span", "lu-journal__mark", n + G, r + g), y;
				y = d ? u.state === "done" ? k("check") : u.state === "failed" ? Ee() : s(2, z.gold()) : u.key ? De() : s(1, z.gold()), M(_, y, n + G + Math.floor((9 - y.width) / 2), Math.round(h - y.height / 2));
				let b = d || u.key && u.count <= 1 ? "" : J("count", { n: u.count }), x = b ? P(b, "num") + 6 : 0, S = v(d ? u.title : u.name, "body", a - K - x), C = N(m, S, n + K, h, {
					font: "body",
					drop: !0,
					cls: "lu-journal__name"
				});
				p === "failed" && M(m, V(Math.max(1, C.tw), 1, (e) => e.hline(0, 0, C.tw, t.rb2)), n + K, Math.round(h), 1, "lu-journal__strike"), b && N(m, b, n + a, h, {
					font: "num",
					color: t.g5,
					align: "right",
					drop: !0,
					cls: "lu-journal__count"
				}), this._entries.push({
					id: u.id,
					el: m,
					y: g,
					top: c === 0 ? f : g
				}), g += l;
			}), g += 4;
		}
		Y(e, "li", "lu-journal__end", n, r + g, 1, 1);
	}
	_select(e, t) {
		let n = this._entries[this._index];
		n && n.el.classList.remove("is-sel"), this._index = this._entries.length ? Math.max(0, Math.min(this._entries.length - 1, e)) : -1;
		let r = this._entries[this._index], i = this._selArt;
		r ? (r.el.classList.add("is-sel"), this._sel[this._tab] = r.id, i && (i.band.style.top = S(r.y), i.cursor.style.top = S(r.y + this._rp / 2 - 4), i.band.style.visibility = "", i.cursor.style.visibility = ""), t && this._scrollTo(r)) : i && (i.band.style.visibility = "hidden", i.cursor.style.visibility = "hidden"), this._renderDetail(r?.id ?? "");
	}
	_scrollTo(e) {
		let t = this._list;
		if (!t) return;
		let n = L(this.element)?.cssPx ?? 2, r = e.top * n, i = (e.y + this._rp) * n;
		r < t.scrollTop ? t.scrollTop = r : i > t.scrollTop + t.clientHeight && (t.scrollTop = i - t.clientHeight);
	}
	_renderDetail(e) {
		let t = this._detail;
		if (!t) return;
		let n = B(), { DX0: r, DX1: i, CY: a, BOT: o, DW: c } = this._G;
		t.textContent = "", t.scrollTop = 0;
		let l = r + 2, d = this._tab === "quests" ? this._data.quests.find((t) => t.id === e) : this._data.items.find((t) => t.id === e);
		if (t.classList.toggle("is-empty", !d), !d) {
			this._entries.length && M(t, s(3, z.dusk(), { setting: [
				n.dm1,
				n.dm2,
				n.dm3
			] }), r + Math.floor((i - r) / 2) - 4, a + Math.floor((o - a) / 2) - 4);
			return;
		}
		let f = (e) => e.lines * e.lh, p = a + 2;
		if (this._tab === "quests") {
			let e = d, i = O(t, u(e.title), l, p, {
				font: "name",
				track: 1,
				color: n.g5,
				drop: !0,
				maxW: c,
				cls: "lu-journal__title"
			});
			p += f(i) + 3 + Math.ceil(y("small") / 2);
			let o = e.state === "done" ? k("check") : e.state === "failed" ? Ee() : s(2, z.gold()), m = p + F("small");
			if (M(t, o, l + Math.floor((9 - o.width) / 2), Math.round(m - o.height / 2)), this._stateLabel(t, J(`state.${e.state}`), l + 12, p, `is-${e.state}`, e.state === "done" ? n.heal : e.state === "failed" ? n.rb3 : n.g4), p += 9 + Math.ceil(y("small")) + 6, e.text) {
				let r = O(t, e.text, l, p, {
					font: "body",
					color: n.tx1,
					drop: !0,
					maxW: c,
					cls: "lu-journal__text"
				});
				p += f(r) + 4;
			}
			if (e.goals.length) {
				p = this._section(t, J("objectives"), l, p);
				let i = Y(t, "ul", "lu-journal__goals", r, a);
				for (let t of e.goals) {
					let e = Y(i, "li", `lu-journal__goal${t.done ? " is-done" : ""}`, r, a), o = O(e, t.text, l + 14, p, {
						font: "body",
						color: t.done ? n.tx3 : n.tx1,
						drop: !0,
						maxW: c - 14,
						cls: "lu-journal__goal-text"
					});
					M(e, Oe(t.done), l + 1, Math.round(p + F("body") - 4.5), 1, "lu-journal__box"), p += f(o) + 2;
				}
				p += 3;
			}
			if (e.log.length) {
				p = this._section(t, J("log"), l, p);
				let i = Y(t, "ol", "lu-journal__log", r, a);
				e.log.forEach((t, o) => {
					let u = o === e.log.length - 1, d = Y(i, "li", u ? "is-latest" : "", r, a), m = O(d, t, l + 11, p, {
						font: "body",
						color: u ? n.tx1 : n.tx3,
						drop: !0,
						maxW: c - 11
					});
					M(d, s(1, u ? z.gold() : z.dusk(), u ? {} : { setting: [
						n.dm1,
						n.dm2,
						n.dm3
					] }), l + 2, Math.round(p + F("body") - 2.5)), p += f(m) + 1;
				});
			}
		} else {
			let e = d, i = Y(t, "div", "lu-journal__item-head", r, a), o = !e.key || e.count > 1 ? J("count", { n: e.count }) : "", s = o ? P(o, "num") + 6 : 0, m = O(i, u(e.name), l, p, {
				font: "name",
				track: 1,
				color: n.g5,
				drop: !0,
				maxW: c - s,
				cls: "lu-journal__title"
			});
			if (o) {
				let t = m.lines === 1;
				N(i, o, t ? l + P(u(e.name), "name", 1) + 6 : l + c, p + F("name"), {
					font: "num",
					color: n.kw,
					align: t ? "left" : "right",
					drop: !0,
					cls: "lu-journal__qty"
				});
			}
			p += f(m) + 3 + Math.ceil(y("small") / 2), e.key ? (M(t, De(), l, Math.round(p + F("small") - 3)), this._stateLabel(t, J("keyItem"), l + 12, p, "is-key", n.g4), p += 9 + Math.ceil(y("small")) + 6) : p += 3, e.text ? O(t, e.text, l, p, {
				font: "body",
				color: n.tx1,
				drop: !0,
				maxW: c,
				cls: "lu-journal__text"
			}) : O(t, J("unknownItem"), l, p, {
				font: "line",
				color: n.tx3,
				drop: !0,
				maxW: c,
				cls: "lu-journal__text is-none"
			}), p += 30;
		}
		Y(t, "div", "lu-journal__end", r, p + 6, 1, 1);
	}
	_stateLabel(e, t, n, r, i, a) {
		let o = O(e, l() ? t : u(t), n, r, {
			font: "small",
			track: 1,
			color: a,
			drop: !0,
			cls: `lu-journal__state ${i}`
		});
		return l() || (o.textContent = t, o.style.textTransform = "uppercase"), o;
	}
	_section(e, t, n, r) {
		let { DX0: i, CY: a, DW: o } = this._G, s = Math.ceil(y("small")), c = Y(e, "div", "lu-journal__sub", i, a);
		return D(c, u(t), n, n + o, r + 4 + s / 2), r + 11 + s;
	}
}, Re = [
	"..OOOOOOOOOOOO..",
	".OHHWWWWWWWWWWO.",
	"OHWWWWWWWWWWWWSO",
	"OWWWWWWWWWWWWWSO",
	"OWWWWWWWWWWWWWSO",
	"OWWWWWWWWWWWWWSO",
	"OWWWWWWWWWWWWWSO",
	"OWWWWWWWWWWWWWSO",
	"OWWWWWWWWWWWWWSO",
	"OSWWWWWWWWWWWSSO",
	".OSSSSSSSSSSSSO.",
	"..OOOOOOSSOOOO..",
	".......OSO......",
	".......OO......."
], ze = () => {
	let e = B();
	return {
		O: e.ink0,
		W: e.kf1,
		H: e.kf0,
		S: e.kf2
	};
}, Be = {
	"!": {
		rows: [
			"...ab...",
			"...ab...",
			"...ab...",
			"...ab...",
			"........",
			"...ab...",
			"...ab..."
		],
		colors: {
			a: "#e8503a",
			b: "#a8281e"
		}
	},
	"?": {
		rows: [
			"..aaaa..",
			".ab..ab.",
			".....ab.",
			"....ab..",
			"...ab...",
			"........",
			"...ab..."
		],
		colors: {
			a: "#4f7fd8",
			b: "#2c4c94"
		}
	},
	"…": {
		rows: [
			"........",
			"........",
			"........",
			"11.22.33",
			"44.55.66",
			"........",
			"........"
		],
		colors: {
			1: "#5a4030",
			2: "#5a4030",
			3: "#5a4030",
			4: "#3a2818",
			5: "#3a2818",
			6: "#3a2818"
		},
		dots: !0
	},
	"♪": {
		rows: [
			"....aaa.",
			"....a.ab",
			"....a..b",
			"....a...",
			"..aaa...",
			".aaaa...",
			"..bb...."
		],
		colors: {
			a: "#7a5cc8",
			b: "#4e3890"
		}
	},
	"♥": {
		rows: [
			".aa..aa.",
			"ahaaaaab",
			"aaaaaaab",
			"aaaaaaab",
			".aaaaab.",
			"..aabb..",
			"...bb..."
		],
		colors: {
			a: "#e8506a",
			b: "#a82a44",
			h: "#ffd0d8"
		}
	},
	zzz: {
		rows: [
			"....aaaa",
			"......a.",
			".....a..",
			"bbb.aaaa",
			"..b.....",
			".b......",
			"bbb....."
		],
		colors: {
			a: "#4f7fd8",
			b: "#7fa6e8"
		}
	},
	"#": {
		rows: [
			".aa..aa.",
			"ab....ba",
			"a......a",
			"........",
			"a......a",
			"ab....ba",
			".aa..aa."
		],
		colors: {
			a: "#e0402e",
			b: "#a02418"
		}
	},
	"💧": {
		rows: [
			"....a...",
			"...aa...",
			"..aaab..",
			".ahaaab.",
			".haaaab.",
			".aaaabb.",
			"..abbb.."
		],
		colors: {
			a: "#58a8e8",
			b: "#2e6eb0",
			h: "#e4f4ff"
		}
	},
	"✦": {
		rows: [
			"...ab...",
			"...ab...",
			"..aaab..",
			"aaahaaab",
			"..aaab..",
			"...ab...",
			"...ab..."
		],
		colors: {
			a: "#f2c23a",
			b: "#b8861e",
			h: "#fff6c8"
		}
	}
}, Ve = { "...": "…" };
function He(e, t, n, r, i = null) {
	let a = "";
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = 0;
		for (; c < s.length;) {
			let e = s[c], l = 1;
			for (; c + l < s.length && s[c + l] === e;) l++;
			e !== "." && (i === null || i.includes(e)) && (a += `<rect x="${c + n}" y="${o + r}" width="${l}" height="1" fill="${t[e]}"/>`), c += l;
		}
	}
	return a;
}
var Ue = /* @__PURE__ */ new Map();
function We(e) {
	let n = Ue.get(e);
	if (n) return n;
	let r = He(Re, ze(), 0, 0), i = t(Be, e) ? Be[e] : null;
	return i && i.dots ? r += `<g class="lu-emote__dot">${He(i.rows, i.colors, 4, 2, "14")}</g><g class="lu-emote__dot lu-emote__dot--2">${He(i.rows, i.colors, 4, 2, "25")}</g><g class="lu-emote__dot lu-emote__dot--3">${He(i.rows, i.colors, 4, 2, "36")}</g>` : i && (r += He(i.rows, i.colors, 4, 2)), n = `<svg viewBox="0 0 16 14" aria-hidden="true">${r}</svg>`, Ue.set(e, n), n;
}
var Ge = {
	en: 136,
	ja: 144,
	zh: 132
}, Ke = 6, qe = 3, Je = 2;
function Ye(e, t, n = Math.floor(e / 2), r = !1) {
	let i = B(), a = i.ink0, o = i.kf0, s = i.kf1, c = i.kf2, l = r ? Xe : 0;
	return V(e, t + 5, (i) => {
		i.hline(2, l, e - 4, a), i.px(1, l + 1, a), i.px(e - 2, l + 1, a), i.hline(2, l + 1, e - 4, o);
		for (let n = 2; n < t - 1; n++) i.px(0, l + n, a), i.px(e - 1, l + n, a), i.hline(1, l + n, e - 2, s), i.px(1, l + n, n < t - 3 ? o : n === t - 3 ? s : c), n === 2 && i.px(2, l + n, o), n >= t - 3 && i.px(e - 2, l + n, c), n === t - 2 && i.px(e - 3, l + n, c);
		i.px(1, l + t - 1, a), i.px(e - 2, l + t - 1, a), i.hline(2, l + t - 1, e - 4, c), i.hline(2, l + t, e - 4, a);
		let u = Math.max(5, Math.min(e - 6, n)) - 2;
		r ? (i.hline(u, l, 4, o), i.rows(u - 1, 0, [
			"...o.",
			"..oWo",
			".oWWo",
			"oWWFo"
		], {
			o: a,
			W: o,
			F: s
		})) : (i.hline(u, t, 4, s), i.rows(u - 1, t + 1, [
			"oFFLo",
			".oFLo",
			"..oLo",
			"...o."
		], {
			o: a,
			F: s,
			L: c
		}));
	});
}
var Xe = 4, Z = new e(), Ze = new e(), Qe = class {
	constructor(e) {
		let t = document.createElement("div");
		t.className = "lu-emotes", e.appendChild(t), this.element = t, this._parent = e, this._active = [], this._pool = [], this.outSeconds = .22, this._w = e.clientWidth || window.innerWidth, this._h = e.clientHeight || window.innerHeight, this._ro = typeof ResizeObserver < "u" ? new ResizeObserver(() => {
			this._w = e.clientWidth || window.innerWidth, this._h = e.clientHeight || window.innerHeight;
			for (let e of this._active) e.x = NaN;
		}) : null, this._ro && this._ro.observe(e), this._cssPx = L(e)?.cssPx ?? 2, this._offScale = h(e, (e) => {
			this._cssPx = e.cssPx;
			for (let e of this._active) e.speech && this._layoutSpeech(e);
		});
	}
	get count() {
		return this._active.length;
	}
	show(e, n, r = 1.6, { offsetY: i = 2.3 } = {}) {
		let a = this._open(e, r, i, 1.6);
		if (!a) return;
		let o = typeof n == "string" ? n : "";
		t(Ve, o) && (o = Ve[o]);
		let s = t(Be, o);
		s || !o ? a.inner.innerHTML = We(s ? o : "") : (a.speech = {
			text: [...o].slice(0, 4).join(""),
			cls: "lu-emote__text"
		}, a.el.classList.add("lu-emote--text"), this._layoutSpeech(a)), a.el.dataset.icon = s ? o : "", this._attach(a);
	}
	bark(e, t, n, { offsetY: r = 2.3 } = {}) {
		let i = typeof t == "string" ? [...t.trim()].slice(0, 160).join("") : "";
		if (!i) return 0;
		let a = i.replace(/[{}\n]/g, ""), o = Number.isFinite(n) && n > 0 ? n : Math.min(6, Math.max(2, 1.4 + a.length * .055)), s = this._open(e, o, r, o);
		return s ? (s.speech = {
			text: i,
			cls: "lu-bark"
		}, s.el.dataset.icon = "", s.el.classList.add("lu-emote--bark"), s.el.classList.toggle("is-indialog", this._parent.classList.contains("lu-root--dialog")), this._layoutSpeech(s), this._attach(s), o) : 0;
	}
	clear(e, t = !1) {
		let n = performance.now();
		for (let r = this._active.length - 1; r >= 0; r--) {
			let i = this._active[r];
			e && i.target !== e || (t ? this._release(r) : i.leaving || this._leave(i, n));
		}
	}
	update(e) {
		if (!this._active.length) return;
		let t = performance.now();
		e && e.updateMatrixWorld();
		let n;
		for (let r = this._active.length - 1; r >= 0; r--) {
			let i = this._active[r];
			if (i.leaving) {
				if (t >= i.leaving) {
					this._release(r);
					continue;
				}
			} else t >= i.until && this._leave(i, t);
			if (!e) continue;
			i.target ? i.target.getWorldPosition(Z) : Z.copy(i.pos), i.bubble && Ze.copy(Z), Z.y += i.offsetY, Z.applyMatrix4(e.matrixWorldInverse);
			let a = Z.z > -(e.near ?? .01);
			Z.applyMatrix4(e.projectionMatrix);
			let o = (!i.target || $e(i.target)) && !a && Z.x > -1.1 && Z.x < 1.1 && Z.y > -1.1 && Z.y < 1.2;
			if (o !== i.inView && (i.inView = o, i.el.classList.toggle("is-inview", o)), !o) continue;
			let s = Math.round((Z.x * .5 + .5) * this._w), c = Math.round((-Z.y * .5 + .5) * this._h);
			(s !== i.x || c !== i.y) && (i.x = s, i.y = c, i.el.style.transform = `translate3d(${s}px,${c}px,0)`), i.bubble && (Ze.project(e), i.fy = Math.round((-Ze.y * .5 + .5) * this._h), n === void 0 && (n = this._promptBox()), this._place(i, n));
		}
	}
	dispose() {
		this._ro && this._ro.disconnect(), this._offScale(), this._active.length = 0, this._pool.length = 0, this.element.remove();
	}
	_promptBox() {
		let e = this._parent, t = e.classList;
		if (t.contains("lu-root--dialog") || t.contains("lu-root--cutscene") || t.contains("lu-root--title")) return null;
		let n = e.querySelector(":scope > .lu-prompt.is-on.is-inview");
		if (!n) return null;
		let r = Infinity, i = Infinity, a = -Infinity, o = -Infinity;
		for (let e of n.querySelectorAll("canvas, .tx")) {
			let t = e.getBoundingClientRect();
			t.width && t.height && (t.left < r && (r = t.left), t.top < i && (i = t.top), t.right > a && (a = t.right), t.bottom > o && (o = t.bottom));
		}
		if (r === Infinity) return null;
		let s = this.element.getBoundingClientRect();
		return {
			l: r - s.left,
			t: i - s.top,
			r: a - s.left,
			b: o - s.top
		};
	}
	_place(e, t) {
		let n = e.bubble, r = this._cssPx, i = n.w / 2 * r, a = 4 * r, o = 0;
		e.x - i < a ? o = a - (e.x - i) : e.x + i > this._w - a && (o = this._w - a - (e.x + i));
		let s = Math.floor(n.w / 2) - 6, c = Math.max(-s, Math.min(s, Math.round(o / r))), l = 0, u = !1;
		if (t) {
			let o = (n.h + 5) * r, s = 2 * r, d = e.x + c * r - i, f = e.x + c * r + i, p = (e) => f > t.l - s && d < t.r + s && e + o > t.t - s && e < t.b + s, m = e.y - o;
			if (p(m)) {
				let n = Math.floor((t.t - s - e.y) / r) * r, i = (Number.isFinite(e.fy) ? e.fy : e.y) + s;
				m + n >= a ? l = n : !p(i) && i + o <= this._h - a ? (u = !0, l = i + o - e.y) : l = Math.min(0, Math.ceil((a - m) / r) * r);
			}
		}
		if (c !== n.dx || l !== n.lift || u !== n.flip) {
			if (c !== n.dx || u !== n.flip) {
				let e = Ye(n.w, n.h, Math.floor(n.w / 2) - c, u), t = n.art.getContext("2d");
				t.clearRect(0, 0, n.art.width, n.art.height), t.drawImage(e, 0, 0), u !== n.flip && (n.box.style.top = S(qe + (u ? Xe : 0)));
			}
			n.dx = c, n.lift = l, n.flip = u, e.el.classList.toggle("is-flipped", u), c || l ? e.inner.style.translate = `${S(c)} ${l}px` : e.inner.style.removeProperty("translate");
		}
	}
	_layoutSpeech(e) {
		let t = e.speech;
		if (!t) return;
		let n = B(), r = t.cls === "lu-bark", i = r ? "body" : "small", a = e.inner;
		a.textContent = "";
		let o = Math.max(...t.text.split("\n").map((e) => P(e, i))), s = _[i], c = s && s.u === "fpx" ? s.unit * 2 : 1, l = r ? Math.round((Ge[le()] ?? Ge.en) * c) : 60, u = Math.max(r ? 10 : 4, Math.min(l, o)), d = document.createElement("div");
		d.className = t.cls;
		let f = !1;
		for (let e of t.text.split(/(\{|\}|\n)/)) if (e === "{") f = !0;
		else if (e === "}") f = !1;
		else if (e === "\n") d.appendChild(document.createElement("br"));
		else if (e) {
			if (f) {
				let t = document.createElement("span");
				t.className = "lu-hl", t.textContent = e, d.appendChild(t);
			} else d.appendChild(document.createTextNode(e));
		}
		E(d, i, {
			maxW: u,
			color: n.kink
		}), d.style.left = S(Ke), d.style.top = S(qe), a.appendChild(d);
		let p = e.el.isConnected ? null : this.element;
		p && p.appendChild(e.el);
		let m = parseFloat(getComputedStyle(d).lineHeight) || 1, h = Math.max(1, Math.round(d.offsetHeight / m));
		if (h > 1) {
			let e = document.createRange();
			e.selectNodeContents(d);
			let t = L(this.element)?.cssPx ?? 2, n = Math.ceil(e.getBoundingClientRect().width / t - .05);
			n > 0 && n < u && (u = n, d.style.width = S(u));
		}
		p && e.el.remove();
		let g = u + 12 + (u + 12) % 2, v = _[i].L, y = Math.ceil(qe + h * v + Je), b = Ye(g, y);
		b.className = "lu-bark__art", b.setAttribute("aria-hidden", "true"), a.insertBefore(b, d), a.style.width = S(g), a.style.height = S(y + 5), a.style.removeProperty("translate"), e.bubble = {
			art: b,
			box: d,
			w: g,
			h: y,
			dx: 0,
			lift: 0,
			flip: !1
		}, e.el.classList.remove("is-flipped"), e.x = NaN, ve(t.text) && ye(t.text).then(() => {
			e.speech === t && this._active.includes(e) && this._layoutSpeech(e);
		});
	}
	_open(e, t, n, r) {
		if (!e) return null;
		let i = e.isObject3D ? e : null, a = !!i && this._active.some((e) => e.target === i);
		a && this.clear(i, !0);
		let o = this._pool.pop() ?? this._create();
		o.target = i, i || o.pos.copy(e), o.offsetY = Number.isFinite(n) ? n : 2.3;
		let s = Number(t);
		return o.until = performance.now() + (s > 0 ? s * 1e3 : r * 1e3), o.leaving = 0, o.inView = !1, o.x = NaN, o.y = NaN, o.fy = NaN, o.replaced = a, o.speech = null, o.bubble = null, o.inner.textContent = "", o.inner.style.width = "", o.inner.style.height = "", o.inner.style.removeProperty("translate"), o.el.classList.remove("lu-emote--bark", "lu-emote--text", "is-indialog", "is-flipped"), o;
	}
	_attach(e) {
		let t = e.el;
		t.classList.remove("is-out", "is-inview"), t.classList.add("is-on"), this.element.appendChild(t), e.replaced && (e.inner.style.animation = "none", e.inner.offsetWidth, e.inner.style.animation = ""), this._active.push(e);
	}
	_create() {
		let t = document.createElement("div");
		return t.className = "lu-emote", t.innerHTML = "<div class=\"lu-emote__anchor\"><div class=\"lu-emote__inner\"></div></div>", {
			el: t,
			inner: t.querySelector(".lu-emote__inner"),
			target: null,
			pos: new e(),
			offsetY: 2.3,
			until: 0,
			leaving: 0,
			inView: !1,
			x: NaN,
			y: NaN,
			fy: NaN,
			speech: null,
			bubble: null
		};
	}
	_leave(e, t) {
		e.leaving = t + this.outSeconds * 1e3, e.el.classList.add("is-out");
	}
	_release(e) {
		let t = this._active[e];
		this._active.splice(e, 1), t.el.classList.remove("is-on", "is-out", "is-inview"), t.el.remove(), t.target = null, t.speech = null, t.bubble = null, this._pool.push(t);
	}
};
function $e(e) {
	for (let t = e; t; t = t.parent) if (t.visible === !1) return !1;
	return !0;
}
//#endregion
//#region src/engine/ui/EndCard.js
var Q = null;
function et(e, t) {
	let n = `${e}x${t}`;
	if (!Q || Q.id !== n) {
		let r = B();
		Q = {
			id: n,
			c: A(e, t, d(r.ink0), (e, t) => {
				let n = Math.hypot((e - .5) / .62, (t - .46) / .6);
				return nt[0] + (nt[1] - nt[0]) * Math.min(1, Math.max(0, (n - .35) / .65));
			}, [
				.2,
				.32,
				.44,
				.54,
				.62
			])
		};
	}
	let r = document.createElement("canvas");
	return r.width = Q.c.width, r.height = Q.c.height, r.getContext("2d").drawImage(Q.c, 0, 0), r;
}
function tt(e, t) {
	let n = document.createElement("div");
	return n.className = `g ${t}`, n.style.left = "0", n.style.top = "0", j(n, x(e)), e.append(n), n;
}
var nt = [.2, .62], $ = 2, rt = 560, it = 400, at = 600, ot = class {
	constructor(e) {
		ue("story-ui") || ce("story-ui", H), this.onSound = null, this.outSeconds = 1;
		let t = document.createElement("div");
		t.className = "lu-endcard is-gone", t.setAttribute("aria-hidden", "true"), e.appendChild(t), this.element = t, this._vig = null, this._vigId = "", this._inner = null, this._shade = null, this._root = e, this._opts = {
			title: "",
			subtitle: "",
			text: "",
			prompt: null
		}, this._fontJob = 0, this._visible = !1, this._active = !1, this._guard = 0, this._clickQueued = !1, this._goneTimer = 0, this._resolve = null, this._onPointer = (e) => {
			this._active && (e.preventDefault(), this._clickQueued = !0);
		}, t.addEventListener("pointerdown", this._onPointer), this._offScale = h(e, () => {
			this._visible && this._layout();
		});
	}
	get visible() {
		return this._visible;
	}
	get active() {
		return this._active;
	}
	show({ title: e = "", subtitle: t = "", text: n = "", prompt: r = void 0, guard: i = 2 } = {}) {
		this._settle(), clearTimeout(this._goneTimer), this._opts = {
			title: String(e ?? ""),
			subtitle: String(t ?? ""),
			text: String(n ?? ""),
			prompt: r === void 0 ? null : String(r ?? "")
		};
		let a = this.element;
		a.classList.remove("is-gone", "is-off", "is-armed"), this._layout(), a.classList.remove("is-on"), a.offsetWidth, a.classList.add("is-on"), a.setAttribute("aria-hidden", "false"), this._root.classList.add("lu-root--endcard"), this._visible = !0, this._active = !0, this._guard = Math.max(0, Number.isFinite(i) ? i : 2), this._clickQueued = !1;
		let o = `${this._opts.title}${this._opts.subtitle}${this._opts.text}${this._promptText()}`;
		if (ve(o)) {
			let e = ++this._fontJob;
			ye(o).then(() => {
				e === this._fontJob && this._visible && this._layout();
			});
		}
		return new Promise((e) => {
			this._resolve = e;
		});
	}
	update(e, t) {
		if (!this._active) return !1;
		let n = (e) => !!t && (typeof t.consumeAction == "function" ? t.consumeAction(e) : t.actionPressed(e)), r = n("confirm") || n("cancel") || this._clickQueued;
		return this._clickQueued = !1, this._guard > 0 ? (this._guard -= Math.max(0, e || 0), this._guard <= 0 && this.element.classList.add("is-armed"), !1) : r ? (this.onSound && this.onSound("confirm"), this.hide(), !0) : !1;
	}
	hide() {
		if (this._active = !1, this._settle(), !this._visible) return;
		let e = this.element;
		e.classList.remove("is-on"), e.classList.add("is-off"), e.setAttribute("aria-hidden", "true"), clearTimeout(this._goneTimer), this._goneTimer = setTimeout(() => {
			this._visible = !1, e.classList.remove("is-off", "is-armed"), e.classList.add("is-gone"), this._root.classList.remove("lu-root--endcard");
		}, this.outSeconds * 1e3);
	}
	dispose() {
		clearTimeout(this._goneTimer), this._offScale(), this._fontJob++, this._active = !1, this._settle(), this.element.removeEventListener("pointerdown", this._onPointer), this.element.remove(), this._root.classList.remove("lu-root--endcard");
	}
	_settle() {
		let e = this._resolve;
		this._resolve = null, e && e();
	}
	_promptText() {
		return this._opts.prompt ?? R("story-ui.end.prompt");
	}
	_layout() {
		let e = this.element, t = B(), n = L(e), r = n?.px ?? 2, i = Math.ceil((n?.W ?? 1280) / r), a = Math.ceil((n?.H ?? 720) / r), o = `${i}x${a}`;
		if (!this._vig || this._vigId !== o) {
			this._vig?.remove();
			let t = et(Math.ceil(i / 2), Math.ceil(a / 2));
			t.className = "lu-endcard__vignette", t.setAttribute("aria-hidden", "true"), t.style.width = S(Math.ceil(i / 2) * 2), t.style.height = S(Math.ceil(a / 2) * 2), e.prepend(t), this._vig = t, this._vigId = o;
		}
		this._inner?.remove(), this._shade?.remove();
		let { title: c, subtitle: l, text: f } = this._opts, m = this._promptText(), h = f.split(/\n+/).filter((e) => e.trim()), g = Math.min(at, Math.max(240, (n?.artW ?? 640) - 32)), v = Math.min(rt, g - 8), b = Math.min(it, g - 16), x = oe().head, T = u(c), E = c ? P(T, "head", 1) : 0, D = E * $ <= v, k = c ? D ? [T] : Te(T, "head", v, 1) : [], j = x.L * (D ? $ : 1), te = k.length * j, ne = l ? Te(u(l), "name", v, 1) : [], F = Math.ceil(y("name")), ie = 12 + F, ae = ne.length * ie, se = _.body.L, ce = h.map((e) => Te(e, "body", b)), le = ce.reduce((e, t) => e + t.length * se + 5, h.length ? -5 : 0), ue = m ? 11 : 0, R = {
			div: c ? 5 : 0,
			sub: l ? 6 : 0,
			text: h.length ? 14 : 0,
			prompt: m ? 26 : 0
		}, V = Math.ceil(te + R.div + 13 + R.sub + ae + R.text + le + R.prompt + ue), H = Math.round(176 - V / 2), U = 320 - g / 2, de = Math.max(219, c ? D ? E * $ : v : 0, ne.length ? v * .7 : 0, h.length ? b : 0), W = Math.min(2 * Math.floor((n?.artW ?? 640) / 2), Math.ceil(de) + 200);
		W += W % 2;
		let fe = V + 80 + (V + 80) % 2, pe = A(W, fe, d(t.ink0), (e, t) => Math.max(0, 1 - Math.hypot((e - .5) / .5, (t - .5) / .5)) * 1.45 * .6, [
			.22,
			.42,
			.6
		]);
		pe.setAttribute("aria-hidden", "true");
		let G = I(e, "mc", 320 - W / 2, H - 40, W, fe, "lu-endcard__shade");
		M(G, pe, 320 - W / 2, H - 40, 1), this._shade = G;
		let K = I(e, "mc", U, H, g, Math.max(2, V), "lu-endcard__inner");
		this._inner = K;
		let q = H;
		if (c) {
			if (D) {
				let e = document.createElement("div");
				e.className = `g tx fx-${x.fx}${x.cjk ? " cjk" : ""} lu-endcard__title`, e.innerHTML = re(T, "head");
				let n = e.style;
				n.fontFamily = x.family, n.fontWeight = String(x.w), n.fontSize = S(x.em * $), n.lineHeight = S(x.L * $), x.cjk || (n.letterSpacing = S($)), n.color = t.g5, n.textShadow = w({
					ol: !0,
					drop: !0
				}, {
					...x,
					bold: x.bold ? S($) : void 0
				});
				let r = E * $;
				n.left = S(320 - Math.floor(r / 2) - U), n.top = S(0), K.append(e);
			} else {
				let e = tt(K, "lu-endcard__title");
				k.forEach((n, r) => O(e, n, 320, q + r * j, {
					font: "head",
					track: 1,
					color: t.g5,
					ol: !0,
					drop: !0,
					align: "center"
				}));
			}
			q += te + R.div;
		}
		if (M(K, p(219), 211, Math.round(q), 1, "lu-endcard__divider"), q += 13 + R.sub, ne.length) {
			let e = tt(K, "lu-endcard__sub");
			ne.forEach((n, r) => N(e, n, 320, q + r * ie + 6 + F / 2, {
				font: "name",
				track: 1,
				color: t.g4,
				align: "center",
				ol: !0
			})), q += ae;
		}
		if (h.length) {
			q += R.text;
			let e = tt(K, "lu-endcard__text");
			ce.forEach((n) => {
				for (let r of n) O(e, r, 320, q, {
					font: "body",
					color: t.tx2,
					drop: !0,
					align: "center",
					cls: "lu-endcard__para"
				}), q += se;
				q += 5;
			}), q -= 5;
		}
		if (m) {
			q += R.prompt;
			let e = tt(K, "lu-endcard__prompt"), [n, r] = m.includes("{key}") ? m.split("{key}", 2).map((e) => e.trim()) : [m.trim(), null], i = "Space", a = [
				u(n),
				r === null ? null : i,
				r === null ? "" : u(r)
			], o = (e) => e ? P(e, "name", 1) : 0, c = r === null ? 0 : ee(i), l = 15 + (o(a[0]) + (a[0] && c ? 4 : 0) + c + (a[2] && c ? 4 : 0) + o(a[2])) + 8 + 7, d = 320 - Math.floor(l / 2), f = q + 5.5;
			M(e, s(2, z.gold()), d, Math.round(f - 3.5), 1, "lu-endcard__gem"), d += 15;
			let p = tt(e, "lu-endcard__blink");
			a[0] && (N(p, a[0], d, f, {
				font: "name",
				track: 1,
				color: t.tx1,
				ol: !0,
				cls: "lu-endcard__prompt-text"
			}), d += o(a[0]) + (c ? 4 : 0)), c && (C(p, i, d, q), d += c + (a[2] ? 4 : 0)), a[2] && (N(p, a[2], d, f, {
				font: "name",
				track: 1,
				color: t.tx1,
				ol: !0,
				cls: "lu-endcard__prompt-text"
			}), d += o(a[2])), M(e, s(2, z.gold()), d + 8, Math.round(f - 3.5), 1, "lu-endcard__gem");
		}
	}
}, st = 2.8, ct = .6, lt = 560, ut = class {
	constructor(e) {
		let t = document.createElement("div");
		t.className = "lu-titlecard is-gone", t.setAttribute("aria-hidden", "true"), t.setAttribute("aria-live", "polite");
		let n = e.querySelector(":scope > .lu-fader");
		n ? n.after(t) : e.appendChild(t), this.element = t, this._phase = "gone", this._t = 0, this._shown = 0, this._hold = st, this._texts = {
			title: "",
			subtitle: ""
		}, this._job = 0, this._resolve = null, this._offScale = h(e, () => {
			this.visible && this._layout();
		});
	}
	get phase() {
		return this._phase;
	}
	get visible() {
		return this._phase === "in" || this._phase === "hold" || this._phase === "out";
	}
	get active() {
		return this._phase !== "gone";
	}
	get texts() {
		return { ...this._texts };
	}
	show(e, t = "", { hold: n = st } = {}) {
		this._gone(), this._texts = {
			title: String(e ?? ""),
			subtitle: String(t ?? "")
		}, this._hold = Math.min(20, Math.max(.5, Number.isFinite(n) ? n : st)), this._phase = "wait", this._t = 0, this._shown = 0;
		let r = ++this._job, i = new Promise((e) => {
			this._resolve = () => e(void 0);
		});
		return this._fonts(this._texts.title, this._texts.subtitle).then(() => {
			r === this._job && this._phase === "wait" && this._start();
		}), i;
	}
	update(e, t = null) {
		if (this._phase === "gone") return;
		let n = Math.max(0, Number.isFinite(e) ? e : 0);
		if (this._t += n, this._phase === "wait") {
			this._t >= 2.5 && this._start();
			return;
		}
		this._shown += n;
		let r = !!t && this._shown >= ct && this._phase !== "out" && t.actionPressed("confirm");
		this._phase === "in" ? r ? this.hide() : this._t >= .9 && (this._phase = "hold", this._t = 0, this.element.classList.remove("is-in"), this.element.classList.add("is-held")) : this._phase === "hold" ? (r || this._t >= this._hold) && this.hide() : this._phase === "out" && this._t >= .8 && this._gone();
	}
	hide() {
		if (this._phase === "wait") {
			this._gone();
			return;
		}
		if (this._phase !== "in" && this._phase !== "hold") return;
		this._phase = "out", this._t = 0;
		let e = this.element.classList;
		e.remove("is-in"), e.add("is-held", "is-out");
	}
	skip() {
		this._gone();
	}
	dispose() {
		this._offScale(), this._gone(), this.element.remove();
	}
	async _fonts(e, t) {
		let n = c(), r = [];
		n && r.push(n.ensure(`${e}\n${t}`));
		let s = o();
		if (s !== "en" && Object.hasOwn(a, s) && !i(e) && typeof document < "u" && document.fonts) {
			let t = a[s][0];
			r.push((n?.ready ?? Promise.resolve()).then(() => document.fonts.load(t, e)));
		} else n && !i(e) && r.push(n.ready);
		await Promise.all(r.map((e) => e.catch(() => null)));
	}
	_start() {
		let e = this.element;
		this._layout(), e.classList.remove("is-gone", "is-out", "is-held", "is-in"), e.offsetWidth, e.classList.add("is-in"), e.setAttribute("aria-hidden", "false"), this._phase = "in", this._t = 0, this._shown = 0;
	}
	_gone() {
		this._job++;
		let e = this.element;
		e.classList.remove("is-in", "is-held", "is-out"), e.classList.add("is-gone"), e.setAttribute("aria-hidden", "true"), e.replaceChildren(), this._phase = "gone";
		let t = this._resolve;
		this._resolve = null, t && t();
	}
	_layout() {
		let e = this.element;
		e.replaceChildren();
		let { title: t, subtitle: s } = this._texts, c = B(), l = L(e)?.artW ?? 640, f = Math.max(200, Math.min(lt, 2 * Math.floor((l - 32) / 2))), m = o(), h = m === "en" || i(t) || !Object.hasOwn(a, m) ? r(u(t), { maxW: f }).canvas : n(t, m, { maxW: f }).canvas;
		h.setAttribute("aria-hidden", "true");
		let g = s.trim() ? v(u(s.trim()), "name", f, 1) : "", _ = 12 + Math.ceil(y("name")), b = h.height + 4 + 13 + (g ? 6 + _ : 0), x = Math.round(178 - b / 2), S = Math.min(2 * Math.floor(l / 2), Math.max(h.width, 219) + 200);
		S += S % 2;
		let C = b + 64 + (b + 64) % 2, w = A(S, C, d(c.band), (e, t) => Math.max(0, 1 - Math.hypot((e - .5) / .5, (t - .5) / .5)) * 1.45 * .66, [
			.22,
			.44,
			.66
		]);
		w.setAttribute("aria-hidden", "true");
		let T = I(e, "mc", 320 - S / 2, x - 32, S, C);
		M(T, w, 320 - S / 2, x - 32, 1, "lu-titlecard__shade");
		let E = I(e, "mc", 320 - f / 2, x, f, b, "lu-titlecard__inner");
		M(E, h, 320 - Math.floor(h.width / 2), x, 1, "lu-titlecard__logo");
		let D = p(219);
		D.setAttribute("aria-hidden", "true"), M(E, D, 211, x + h.height + 4, 1, "lu-titlecard__rule"), g && N(E, g, 320, x + h.height + 4 + 13 + 6 + _ / 2, {
			font: "name",
			track: 1,
			color: c.g4,
			align: "center",
			ol: !0,
			drop: !0,
			cls: "lu-titlecard__sub"
		}).setAttribute("aria-label", s), e.setAttribute("aria-label", g ? `${t} — ${s}` : t);
	}
}, dt = Object.freeze({
	white: "kf0",
	gold: "kw",
	red: "rb2"
}), ft = class {
	constructor(e) {
		let t = document.createElement("div");
		t.className = "lu-flash", t.setAttribute("aria-hidden", "true");
		let n = e.querySelector(":scope > .lu-letterbox");
		n ? e.insertBefore(t, n) : e.appendChild(t), this.element = t, this._timer = 0, this.color = "", this.held = !1;
	}
	get active() {
		return this.color !== "";
	}
	flash(e = "white", t = .35, n = 1) {
		let r = Math.min(5, Math.max(.05, Number.isFinite(t) ? t : .35)), i = this._paint(e, n, this.held ? this._opacity() : -1);
		this._start("is-on", r), this.held = !1, this.color = i, clearTimeout(this._timer), this._timer = setTimeout(() => this.clear(), r * 1e3 + 30);
	}
	hold(e = "white", t = 0, n = 1) {
		let r = Math.min(5, Math.max(0, Number.isFinite(t) ? t : 0)), i = this.active ? this._opacity() : 0, a = this._paint(e, n);
		this.element.style.setProperty("--lu-flash-from", `${+i.toFixed(3)}`), this._start("is-held", r), this.held = !0, this.color = a, clearTimeout(this._timer);
	}
	clear() {
		clearTimeout(this._timer), this.element.classList.remove("is-on", "is-held"), this.color = "", this.held = !1;
	}
	_paint(e, t, n = -1) {
		let r = Object.hasOwn(dt, e) ? e : "white", i = dt[r], a = Math.min(1, Math.max(0, Number.isFinite(t) ? t : 1)), o = this.element;
		return o.style.setProperty("--lu-flash-color", `var(--g-${i})`), o.style.setProperty("--lu-flash-peak", `${+(n >= 0 ? n : .92 * a).toFixed(3)}`), r;
	}
	_start(e, t) {
		let n = this.element;
		n.style.animationDuration = `${Math.max(.001, t)}s`, n.classList.remove("is-on", "is-held"), n.offsetWidth, n.classList.add(e);
	}
	_opacity() {
		let e = Number(getComputedStyle(this.element).opacity);
		return Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
	}
	dispose() {
		this.clear(), this.element.remove();
	}
};
//#endregion
//#region src/game/story/storyUI.js
function pt() {
	return {
		Journal: Le,
		Emotes: Qe,
		EndCard: ot
	};
}
function mt() {
	return {
		TitleCard: ut,
		ScreenFlash: ft
	};
}
//#endregion
export { mt as cineUIClasses, pt as storyUIClasses };
