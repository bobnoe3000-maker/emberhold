import { f as e } from "./three.core-BsXWN4b8.js";
import { a as t, u as n } from "./math-Du_SWpiD.js";
import { r } from "./ThawField-CelnRTY2.js";
//#region src/game/WeatherLook.js
var i = [
	"clear",
	"rain",
	"snow"
], a = .22;
function o(e) {
	let r = Math.exp(-(((e - 17.3) / 1.3) ** 2)) + .6 * Math.exp(-(((e - 7) / 1) ** 2));
	return n(.35, 1, t(r));
}
function s(e) {
	return {
		brightness: n(1, .66, e),
		glint: n(1, .55, e)
	};
}
var c = Object.freeze({
	clear: Object.freeze({
		sun: 1,
		ambient: 1,
		fog: 1,
		exposure: 1,
		wind: 1,
		windX: 1,
		windZ: .35,
		temp: 0,
		sat: 0,
		rays: 1,
		dust: 1,
		bugs: 1,
		leaves: 1,
		rain: 0,
		snow: 0,
		overcast: 0
	}),
	rain: Object.freeze({
		sun: .26,
		ambient: .9,
		fog: 2.1,
		exposure: .92,
		wind: 2.3,
		windX: 2.2,
		windZ: .9,
		temp: -.12,
		sat: -.24,
		rays: 0,
		dust: .15,
		bugs: 0,
		leaves: 1.6,
		rain: 1,
		snow: 0,
		overcast: .72
	}),
	snow: Object.freeze({
		sun: .45,
		ambient: 1.15,
		fog: 1.9,
		exposure: 1.04,
		wind: 1.3,
		windX: 1.2,
		windZ: .5,
		temp: -.3,
		sat: -.42,
		rays: .25,
		dust: 0,
		bugs: 0,
		leaves: .3,
		rain: 0,
		snow: 1,
		overcast: .62
	}),
	frost: Object.freeze({
		sun: .8,
		ambient: 1.1,
		fog: 1.4,
		exposure: .92,
		wind: .6,
		windX: .8,
		windZ: .3,
		temp: -.22,
		sat: -.25,
		rays: .7,
		dust: .6,
		bugs: 0,
		leaves: 0,
		rain: 0,
		snow: 0,
		overcast: .15
	})
}), l = Object.keys(c.clear);
function u(e) {
	return typeof e == "string" && Object.hasOwn(c, e) ? e : "clear";
}
function d(e) {
	let t = u(e);
	return +(t === "snow" || t === "frost");
}
var f = {
	rain: {
		preset: "rain",
		count: 2600,
		bounds: [
			44,
			16,
			44
		]
	},
	snow: {
		preset: "snow",
		count: 2400,
		bounds: [
			44,
			15,
			44
		],
		size: [.09, .15]
	}
};
function p(e, t = {}) {
	let n = f[e];
	if (!n) throw Error(`precipitationEmitter: unknown kind "${e}"`);
	let r = {
		preset: n.preset,
		...t,
		count: n.count,
		bounds: [...n.bounds]
	};
	return n.size && (r.size = [...n.size]), r;
}
function m(e) {
	return e < .02 ? 0 : e;
}
function h(e, t, { sunMul: n = 1, ambientMul: r = 1, exposureMul: i = 1, pointLightMul: a = 1 } = {}) {
	e.sunMul = n * t.sun, e.ambientMul = r * t.ambient, e.exposureMul = i * t.exposure, e.pointLightMul = a;
}
function g(e, t = 1, n = 0) {
	let i = r.uTime.value, a = n && Math.sin(i * 2.7) * Math.sin(i * 1.1 + 1);
	r.uWindStrength.value = t * e.wind * (1 + n * (1 + .3 * a));
	let o = Math.cos(n * .22 * a), s = Math.sin(n * .22 * a);
	r.uWind.value.set(e.windX * o - e.windZ * s, e.windX * s + e.windZ * o);
}
function _(e, t, n, r) {
	e.temperature = n + t.temp, e.saturation = r + t.sat;
}
var v = new e(.9, .97, 1.12), y = new e();
function b(e, t) {
	if (t <= 0) return e;
	let n = e.r * .2126 + e.g * .7152 + e.b * .0722;
	return y.copy(v).multiplyScalar(n), e.lerp(y, t);
}
function x(e, t) {
	t > .002 && (b(e.fog.color, t), b(e.sun.color, t * .85), b(e.hemi.color, t * .6), b(e.hemi.groundColor, t * .6), r.uFogColor.value.copy(e.fog.color), b(r.uSunColor.value, t * .85));
}
function S(e) {
	return n(.05, .45, e);
}
function C(e, t, n) {
	let r = S(n);
	for (let t = 0; t < e.length; t++) e[t].nightOnly && (e[t].dayIntensity = r);
	t && (t.nightDayIntensity = r);
}
function w(e, t) {
	for (let r = 0; r < e.length; r++) e[r].day = n(e[r].baseDay, e[r].night * .4, t);
}
function T(e, r) {
	return n(.5, 1, t(Math.max(e, r * .8)));
}
var E = Object.freeze({
	fireflies: 1,
	leaves: 1,
	petals: 1,
	dust: 1,
	smoke: 1,
	mist: 1
});
function D(e, n, r = E, i = 0) {
	switch (e) {
		case "fireflies": return r.fireflies * n.bugs;
		case "leaves": return r.leaves * t(n.leaves, 0, 1) * (1 - .6 * i);
		case "petals": return r.petals * t(1 - n.rain - n.snow, 0, 1);
		case "dust": return r.dust * n.dust;
		case "smoke": return r.smoke;
		case "mist": return r.mist;
		default: return null;
	}
}
//#endregion
export { d as _, w as a, _ as c, D as d, T as f, m as g, p as h, c as i, h as l, s as m, i as n, C as o, o as p, l as r, x as s, a as t, g as u };
