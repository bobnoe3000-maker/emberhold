//#region src/game/config.js
var e = Object.freeze({
	distance: 30,
	pitch: 32,
	fov: 28,
	minDistance: 18,
	maxDistance: 42
}), t = 1 / 90, n = Object.freeze({
	noon: 12.6,
	lat: 32,
	dec: 14,
	refTime: 17.2,
	refAzimuth: -112
}), r = Object.freeze({ refAzimuth: 40 }), i = Object.freeze({
	night: {
		hemiI: 1.6,
		hemiSky: "#3656c0",
		hemiGround: "#1a2042",
		sunI: 1,
		exp: 1.36
	},
	"late night": {
		hemiI: 1.55,
		hemiSky: "#3656c0",
		hemiGround: "#1a2042",
		sunI: .9,
		exp: 1.36
	},
	"blue hour": {
		hemiI: 1.5,
		exp: 1.36
	},
	sunset: {
		hemiI: 1.45,
		exp: 1.2
	},
	"purple dusk": {
		sunI: .85,
		hemiI: 1.62,
		exp: 1.46
	},
	"golden hour": {
		hemiGround: "#7a6058",
		hemiSky: "#6a80d4"
	}
}), a = Object.freeze({
	normalUp: .6,
	wrap: .6,
	roundness: .55,
	emissive: "#ffe9d2",
	emissiveIntensity: .06
}), o = Object.freeze({
	day: .05,
	night: .03
}), s = Object.freeze([.5, .62]);
//#endregion
export { r as a, t as c, i, a as n, o, s as r, n as s, e as t };
