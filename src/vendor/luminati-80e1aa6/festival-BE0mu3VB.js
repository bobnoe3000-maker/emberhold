import { a as e } from "./ObjectCatalog-CLBSNnc2.js";
//#region src/game/siege/festival.js
var t = null, n = null;
function r(t, n) {
	return n.size ? !0 : t.objects.some((t) => t?.type === "npc" && e.includes(t.behaviour));
}
function i() {
	return t ? Promise.resolve(t) : (n ??= import("./FestivalKit-N-TyKjt9.js").then((e) => (t = e, e), (e) => {
		throw n = null, e;
	}), n);
}
function a(e) {
	if (!t) throw Error(`${e} needs the festival kit (src/game/siege/FestivalKit.js), which is not loaded: Game loads it for a level that needs it (needsFestival)`);
	return t;
}
//#endregion
export { i as n, r, a as t };
