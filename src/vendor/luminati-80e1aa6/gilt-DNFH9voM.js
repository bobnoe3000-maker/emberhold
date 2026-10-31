var e = Object.freeze({
	ink0: "#07080f",
	ink1: "#0c1022",
	ink2: "#141a36",
	ink3: "#1a2242",
	ink4: "#2a3462",
	ink5: "#6f7aa6",
	g0: "#3e2a10",
	g1: "#6e4f1e",
	g2: "#8c6a32",
	g3: "#c9a45c",
	g4: "#e8cf8a",
	g5: "#f4e3b3",
	gs0: "#3e2a10",
	gs1: "#6e4f1e",
	gs2: "#b8904a",
	dm1: "#6a5a3c",
	dm2: "#4c4231",
	dm3: "#332d26",
	tx1: "#f3ead7",
	tx2: "#c6bda9",
	tx3: "#8f897d",
	sel: "#fff6e0",
	kw: "#f3cf7a",
	sa1: "#23408f",
	sa2: "#5288e6",
	sa3: "#b0d6ff",
	se1: "#8e3f16",
	se2: "#e8873a",
	se3: "#ffc07a",
	rb1: "#6a1418",
	rb2: "#d0452f",
	rb3: "#ff9a7a",
	em1: "#9c2a12",
	em2: "#f08a3a",
	em3: "#ffe0a8",
	hp0: "#7a1530",
	hp1: "#a8233a",
	hp2: "#e0674f",
	hp3: "#f08a6a",
	mp0: "#34569c",
	mp1: "#4f7fd8",
	mp2: "#6aa6ee",
	mp3: "#8fd0ff",
	sp0: "#8c6a32",
	sp1: "#c9a45c",
	sp2: "#e8cf8a",
	bs0: "#6a1418",
	bs1: "#9c1f24",
	bs2: "#d0452f",
	bs3: "#f07a4a",
	bs4: "#ffc690",
	tr0: "#120a0e",
	tr1: "#26151c",
	xp0: "#2e2210",
	hit: "#fff4dc",
	crit: "#ffd98a",
	mint: "#9fe6d2",
	heal: "#bfe58f",
	nol: "#120c08",
	teal: "#3fcfae",
	"teal-rim": "#e6fff7",
	foe: "#e0674f",
	way: "#7fe3ff",
	fire: "#ff9a3c",
	npc: "#8fd0ff",
	phase: "#f6b25a",
	kf0: "#fffaf0",
	kf1: "#fbf3dc",
	kf2: "#d6c08e",
	kf3: "#a88a50",
	kink: "#2a1d0c",
	band: "#080b1a",
	plate0: "#222a4e",
	plate1: "#0c0f20",
	glass0: "rgba(26, 34, 66, 0.86)",
	glass1: "rgba(19, 25, 50, 0.88)",
	glass2: "rgba(12, 16, 34, 0.9)",
	glass3: "rgba(6, 8, 18, 0.93)",
	"glass-hi": "rgba(96, 118, 184, 0.55)",
	"glass-lat": "rgba(96, 118, 184, 0.16)",
	"glass-x": "rgba(140, 158, 214, 0.34)",
	wash: "rgba(201, 164, 92, 0.22)",
	shade: "rgba(4, 6, 16, 0.74)",
	dim: "#04050c",
	veil: "rgba(7, 8, 15, 0.8)",
	"slot-glass": "rgba(12, 16, 34, 0.6)",
	"card-glass": "rgba(40, 50, 96, 0.28)",
	"card-sel0": "rgba(201, 164, 92, 0.2)",
	"card-sel1": "rgba(201, 164, 92, 0.12)",
	"card-sel2": "rgba(201, 164, 92, 0.06)",
	sock0: "#1c180f",
	sock1: "#2c2618",
	sock2: "#3a3220",
	"m-g": "#5f9a3e",
	"m-G": "#3f7434",
	"m-f": "#8fb14e",
	"m-F": "#7a5433",
	"m-s": "#d6c08b",
	"m-p": "#b18a5c",
	"m-c": "#8d8a8e",
	"m-k": "#a6a39b",
	"m-m": "#6e7d5c",
	"m-r": "#5d5a60",
	"m-t": "#2b4f2a",
	"m-b": "#9c6b3f",
	"m-w": "#3b7fa6",
	"m-void": "#101018",
	"m-cliff": "#3e3228",
	"m-light": "#9fc46a",
	"m-mute": "rgba(6, 8, 18, 0.15)",
	"m-wedge": "rgba(255, 240, 200, 0.42)",
	"m-vig0": "rgba(6, 8, 18, 0.55)",
	"m-vig1": "rgba(6, 8, 18, 0.38)",
	"m-vig2": "rgba(6, 8, 18, 0.3)",
	"m-ol": "rgba(20, 14, 6, 0.92)",
	day0: "#25306a",
	day1: "#2b3778",
	day2: "#c98aa0",
	day3: "#f3c989",
	day4: "#f5e4b0",
	day5: "#f2b45a",
	day6: "#d07a55",
	day7: "#6e4f8c"
}), t = () => e;
function n(t) {
	for (let [n, r] of Object.entries(e)) t.style.setProperty(`--g-${n}`, r);
}
var r = Object.freeze({
	gold: () => [
		e.gs0,
		e.gs1,
		e.gs2
	],
	sapphire: () => [
		e.sa1,
		e.sa2,
		e.sa3
	],
	amber: () => [
		e.se1,
		e.se2,
		e.se3
	],
	ruby: () => [
		e.rb1,
		e.rb2,
		e.rb3
	],
	ember: () => [
		e.em1,
		e.em2,
		e.em3
	],
	dusk: () => [
		e.ink2,
		e.ink3,
		e.ink4
	],
	way: () => [
		e.sa1,
		e.way,
		e["teal-rim"]
	]
});
function i(e) {
	let t = typeof e == "string" ? e.trim().replace(/^#/, "") : "";
	if (!/^(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(t)) return r.amber();
	let n = parseInt(t.length === 3 ? t.replace(/./g, (e) => e + e) : t, 16), i = [
		n >> 16 & 255,
		n >> 8 & 255,
		n & 255
	], a = (e, t) => `#${i.map((n) => Math.round(n + (t - n) * e).toString(16).padStart(2, "0")).join("")}`;
	return [
		a(.55, 0),
		a(0, 0),
		a(.55, 255)
	];
}
//#endregion
//#region src/engine/ui/art/painter.js
function a(e, t, n, r = 1) {
	let i = document.createElement("canvas");
	i.width = Math.max(0, Math.round(e * r)), i.height = Math.max(0, Math.round(t * r));
	let a = i.getContext("2d");
	a.imageSmoothingEnabled = !1;
	let o = r;
	return n({
		w: e,
		h: t,
		ctx: a,
		px(e, t, n) {
			n && (a.fillStyle = n, a.fillRect(e * o, t * o, o, o));
		},
		rect(e, t, n, r, i) {
			i && (a.fillStyle = i, a.fillRect(e * o, t * o, n * o, r * o));
		},
		box(e, t, n, r, i) {
			this.rect(e, t, n, 1, i), this.rect(e, t + r - 1, n, 1, i), this.rect(e, t, 1, r, i), this.rect(e + n - 1, t, 1, r, i);
		},
		hline(e, t, n, r) {
			this.rect(e, t, n, 1, r);
		},
		vline(e, t, n, r) {
			this.rect(e, t, 1, n, r);
		},
		line(e, t, n, r, i) {
			let a = Math.abs(n - e), o = -Math.abs(r - t), s = e < n ? 1 : -1, c = t < r ? 1 : -1, l = a + o;
			for (; this.px(e, t, i), e !== n || t !== r;) {
				let n = 2 * l;
				n >= o && (l += o, e += s), n <= a && (l += a, t += c);
			}
		},
		circle(e, t, n, r, i = !0) {
			for (let a = -n; a <= n; a++) for (let o = -n; o <= n; o++) {
				let s = o * o + a * a;
				(i ? s <= n * n + n * .8 : s <= n * n + n * .8 && s > (n - 1) * (n - 1) + (n - 1) * .8) && this.px(e + o, t + a, r);
			}
		},
		dither(e, t, n, r, i, a, o = "check") {
			for (let s = 0; s < r; s++) for (let r = 0; r < n; r++) {
				let n = e + r, c = t + s, l = o === "check" ? (n + c) % 2 == 0 : o === "sparse" ? n % 2 == 0 && c % 2 == 0 : o === "rows" && c % 2 == 0;
				this.px(n, c, l ? i : a);
			}
		},
		rows(e, t, n, r) {
			n.forEach((n, i) => {
				for (let a = 0; a < n.length; a++) n[a] !== "." && this.px(e + a, t + i, r[n[a]]);
			});
		}
	}), i.classList.add("px"), i;
}
var o = (e, t, n) => a(e, t, n);
function s(e, t, n = 1) {
	let r = e.length, i = Math.max(0, ...e.map((e) => e.length)), a = document.createElement("canvas");
	a.width = i * n, a.height = r * n;
	let o = a.getContext("2d");
	for (let i = 0; i < r; i++) {
		let r = e[i];
		for (let e = 0; e < r.length; e++) {
			let a = t[r[e]];
			a && r[e] !== "." && (o.fillStyle = a, o.fillRect(e * n, i * n, n, n));
		}
	}
	return a.classList.add("px"), a;
}
function c(e) {
	let t = document.createElement("canvas");
	t.width = e.width, t.height = e.height;
	let n = t.getContext("2d");
	n.imageSmoothingEnabled = !1, e.width && e.height && n.drawImage(e, 0, 0);
	for (let n of e.classList) t.classList.add(n);
	return t;
}
//#endregion
//#region src/engine/ui/art/gilt.js
function l(e, n, i, a, o = r.gold(), { outline: s = !0, open: c = "", setting: l = null } = {}) {
	let u = t(), d = l ?? [
		u.g4,
		u.g3,
		u.g2
	];
	for (let t = -(a + 1); t <= a + 1; t++) for (let r = -(a + 1); r <= a + 1; r++) {
		let l = Math.abs(r) + Math.abs(t), f = r + t, p = null;
		if (l === a + 1) {
			if (!s) continue;
			p = r === a + 1 && c.includes("r") || r === -(a + 1) && c.includes("l") || t === -(a + 1) && c.includes("u") || t === a + 1 && c.includes("d") ? null : u.ink0;
		} else l === a ? p = f < 0 ? d[0] : f === 0 ? d[1] : d[2] : l < a && (p = a >= 3 ? r === -1 && t === -1 ? u.g5 : f <= -(a - 1) ? o[2] : f >= a - 1 ? o[0] : o[1] : f < 0 ? o[2] : f > 0 ? o[0] : o[1], a <= 2 && r === 0 && t === 0 && (p = o[1]));
		p && e.px(n + r, i + t, p);
	}
}
function u(e, n, r = !0, i = null) {
	let a = t(), o = (e, t) => `${e},${t}`, s = new Set(n.map(([e, t]) => o(e, t)));
	if (r) for (let [t, r] of n) for (let [n, c] of [
		[1, 0],
		[-1, 0],
		[0, 1],
		[0, -1]
	]) s.has(o(t + n, r + c)) || e.px(t + n, r + c, i ?? a.ink0);
	for (let [t, r, i] of n) e.px(t, r, i);
}
function d(e, t, n) {
	let r = (r, i) => r < 0 || i < 0 || r >= t || i >= n ? 0 : e[i * t + r], i = t * 2, a = new Uint8Array(i * n * 2);
	for (let e = 0; e < n; e++) for (let n = 0; n < t; n++) {
		let t = r(n, e - 1), o = r(n - 1, e), s = r(n, e), c = r(n + 1, e), l = r(n, e + 1), u = t !== l && o !== c ? [
			o === t ? o : s,
			t === c ? c : s,
			o === l ? o : s,
			l === c ? c : s
		] : [
			s,
			s,
			s,
			s
		];
		a[e * 2 * i + n * 2] = u[0], a[e * 2 * i + n * 2 + 1] = u[1], a[(e * 2 + 1) * i + n * 2] = u[2], a[(e * 2 + 1) * i + n * 2 + 1] = u[3];
	}
	return a;
}
function f(e, t, n) {
	let r = (r, i) => r < 0 || i < 0 || r >= t || i >= n ? 0 : e[i * t + r], i = t * 3, a = new Uint8Array(i * n * 3);
	for (let e = 0; e < n; e++) for (let n = 0; n < t; n++) {
		let t = r(n - 1, e - 1), o = r(n, e - 1), s = r(n + 1, e - 1), c = r(n - 1, e), l = r(n, e), u = r(n + 1, e), d = r(n - 1, e + 1), f = r(n, e + 1), p = r(n + 1, e + 1), m = [
			l,
			l,
			l,
			l,
			l,
			l,
			l,
			l,
			l
		];
		o !== f && c !== u && (m = [
			c === o ? c : l,
			c === o && l !== s || o === u && l !== t ? o : l,
			o === u ? u : l,
			c === o && l !== d || c === f && l !== t ? c : l,
			l,
			o === u && l !== p || f === u && l !== s ? u : l,
			c === f ? c : l,
			c === f && l !== p || f === u && l !== d ? f : l,
			f === u ? u : l
		]);
		for (let t = 0; t < 3; t++) for (let r = 0; r < 3; r++) a[(e * 3 + t) * i + n * 3 + r] = m[t * 3 + r];
	}
	return a;
}
function p(e, n, r, i, a, o = 1, s = 1) {
	let c = t(), l = (t, i) => t >= 0 && i >= 0 && t < n && i < r && e[i * n + t] === 1, u = [];
	for (let e = 0; e < r; e++) for (let t = 0; t < n; t++) {
		if (!l(t, e)) continue;
		let n = !l(t, e - s), r = !l(t, e + s), d = !l(t - o, e), f = !l(t + o, e), p = c.g3;
		n && d ? p = c.g5 : n || d ? p = c.g4 : r && f ? p = c.g1 : (r || f) && (p = c.g2), u.push([
			i + o * t,
			a + s * e,
			p
		]);
	}
	return u;
}
var m = (e) => {
	let t = Math.max(...e.map((e) => e.length)), n = e.length, r = new Uint8Array(t * n);
	return e.forEach((e, n) => {
		for (let i = 0; i < e.length; i++) e[i] !== "." && (r[n * t + i] = 1);
	}), {
		b: r,
		w: t,
		h: n
	};
};
//#endregion
export { f as a, c, r as d, n as f, d as i, a as l, t as m, p as n, u as o, i as p, m as r, o as s, l as t, s as u };
