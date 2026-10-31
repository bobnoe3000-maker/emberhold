//#region src/engine/utils/own.js
function e(e, t) {
	return typeof t == "string" && Object.hasOwn(e, t);
}
function t(t, n) {
	return e(t, n) ? t[n] : void 0;
}
function n(e) {
	if (typeof e == "string") return e;
	try {
		return String(JSON.stringify(e));
	} catch {
		return typeof e;
	}
}
function r(e, t) {
	try {
		return String(e);
	} catch {
		return t;
	}
}
function i(e) {
	try {
		return Number(e);
	} catch {
		return NaN;
	}
}
function a(e) {
	if (!e || typeof e != "object" || Array.isArray(e)) return !0;
	try {
		return !0;
	} catch {
		return !1;
	}
}
function o(e, t = 0) {
	if (!e || typeof e != "object" || t > 8) return !1;
	if (!a(e)) return !0;
	for (let n of Object.keys(e)) if (o(e[n], t + 1)) return !0;
	return !1;
}
function s(e, t = 0) {
	if (!e || typeof e != "object" || t > 8) return e;
	if (Array.isArray(e)) for (let n = 0; n < e.length; n++) a(e[n]) ? s(e[n], t + 1) : e[n] = null;
	else for (let n of Object.keys(e)) a(e[n]) ? s(e[n], t + 1) : delete e[n];
	return e;
}
var c = /* @__PURE__ */ new Set();
function l(e, t) {
	if (typeof e != "string") return e;
	let n = e.toLowerCase();
	if (Object.hasOwn(t, n) || !(n in t)) return e;
	c.has(n) || (c.add(n), console.warn(`[Luminati] "${e}" is not a colour name; the default colour is used.`));
}
//#endregion
export { n as a, r as c, t as i, e as n, s as o, l as r, i as s, o as t };
