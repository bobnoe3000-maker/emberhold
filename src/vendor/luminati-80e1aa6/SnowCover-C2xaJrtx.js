//#region src/game/SnowCover.js
var e = { value: 0 }, t = null, n = async () => t ??= await import("./ThawKit-Dfy521nr.js"), r = () => t, i = "\n	{\n		vec3 snowN = inverseTransformDirection( normal, viewMatrix );\n		float snowUp = smoothstep( 0.5, 0.86, snowN.y );\n		float snowL = dot( diffuseColor.rgb, vec3( 0.299, 0.587, 0.114 ) );\n		float snowK = uSnowCover * snowUp * ( 0.7 + 0.25 * smoothstep( 0.02, 0.2, snowL ) );\n		diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.8, 0.84, 0.92 ) * ( 0.82 + 0.3 * smoothstep( 0.0, 0.3, snowL ) ), snowK );\n	}\n", a = "\n	{\n		float snowL = dot( diffuseColor.rgb, vec3( 0.299, 0.587, 0.114 ) );\n		float snowK = uSnowCover * smoothstep( 0.2, 0.95, vQuadUv.y ) * 0.72;\n		diffuseColor.rgb = mix( diffuseColor.rgb, vec3( 0.78, 0.83, 0.9 ) * ( 0.7 + 0.6 * sqrt( snowL ) ), snowK );\n	}\n";
function o(t, n = "ground") {
	if (!t || t.userData.luminatiSnow) return;
	t.userData.luminatiSnow = n;
	let r = t.onBeforeCompile, o = t.customProgramCacheKey();
	t.onBeforeCompile = function(t, o) {
		r.call(this, t, o), t.uniforms.uSnowCover = e;
		let s = n === "foliage" ? a : i;
		t.fragmentShader = t.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uSnowCover;").replace("#include <emissivemap_fragment>", `${s}\n#include <emissivemap_fragment>`);
	}, t.customProgramCacheKey = () => `${o}|luminati-snow-${n}`, t.needsUpdate = !0;
}
var s = /^luminati:roof/;
//#endregion
export { n as a, o as i, i as n, e as o, s as r, r as s, a as t };
