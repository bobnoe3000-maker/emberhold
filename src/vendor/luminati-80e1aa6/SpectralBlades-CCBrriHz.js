import { L as e, St as t, Y as n, _t as r, bt as i, fr as a, j as o, l as s, q as c, qt as l } from "./three.core-D9_Fol79.js";
import { r as u } from "./ThawField-D3Wx0alo.js";
//#region src/engine/fx/SpectralBlades.js
var d = 4, f = 4, p = .135, m = .74, h = .775, g = .94, _ = Object.freeze({
	BEVEL_L: 0,
	FLAT: 1,
	FULLER_L: 2,
	GUARD_Y: 3,
	GUARD_Z: 4,
	GRIP: 5,
	POMMEL: 6,
	GEM: 7,
	BEVEL_R: 8,
	FULLER_R: 9
}), v = "\nattribute vec4 aBlade;  // part (0 blade, 1 guard, 2 grip, 3 pommel / gem), side (0 / 1 / 0.5 at an apex), facet width (normalised), kind\nattribute vec4 iShape;  // length, width, seed, palette\nattribute vec4 iFx;     // dissolve, dissolve direction, glow, runes\nvarying vec2 vBladeTc;  // texel coordinates (16 per world unit): u across from the axis, v along from the point\nvarying vec4 vBladeFx;  // dissolve, direction, glow, runes\nvarying vec3 vBladeK;   // seed, palette, the length in texels\nvarying float vBladeY;  // 0 point … 1 pommel\n", y = "\n#ifdef BLADE_COLOR\nvarying vec2 vBladeEdge; // distance to the facet's left / right seam (world)\nvarying float vBladeKind;\nvarying float vBladeW;   // the blade's width in texels\n#endif\n\nvec3 bladeVertex() {\n	float L = iShape.x, W = iShape.y;\n	vec3 q = position;\n	vec3 p = vec3( q.x * W, q.y * L, q.z * W );\n	vBladeTc = vec2( q.x * W * 16.0, q.y * L * 16.0 );\n	vBladeFx = iFx;\n	vBladeK = vec3( iShape.z, iShape.w, L * 16.0 );\n	vBladeY = q.y;\n#ifdef BLADE_COLOR\n	float kind = aBlade.w;\n	float sc = ( kind > 2.5 && kind < 3.5 ) ? L : W;\n	float w = aBlade.z * sc;\n	float d = aBlade.y * w;\n	vBladeEdge = aBlade.y > 0.25 && aBlade.y < 0.75 ? vec2( 0.0 ) : vec2( d, w - d );\n	vBladeKind = kind;\n	vBladeW = W * 16.0;\n#endif\n	return p;\n}\n", b = "\nfloat bladeHash( vec2 p ) {\n	vec3 q = fract( vec3( p.xyx ) * 0.1031 );\n	q += dot( q, q.yzx + 33.33 );\n	return fract( ( q.x + q.y ) * q.z );\n}\n// the dissolve's direction and the ghost's share, packed (dir × 4 + ghost)\nfloat bladeDir() { return floor( vBladeFx.y * 0.25 + 0.5 ); }\n// the dissolve key of this texel: below the dissolve, it is cut\nfloat bladeKey() {\n	vec2 tc = floor( vBladeTc ) + 0.5;\n	float h = bladeHash( tc + vBladeK.x * 1.37 );\n	float dir = bladeDir();\n	float f = clamp( vBladeY, 0.0, 1.0 );\n	return dir > 0.5 ? f * 0.82 + h * 0.18 : dir < -0.5 ? ( 1.0 - f ) * 0.82 + h * 0.18 : h;\n}\n// a texel the ghost takes out (a share of the texels everywhere, hashed apart from the dissolve)\nbool bladeGhosted() {\n	float g = vBladeFx.y - bladeDir() * 4.0;\n	return g > 0.001 && bladeHash( floor( vBladeTc ) + vec2( 17.8, 6.4 ) + vBladeK.x * 0.53 ) < g;\n}\n", x = `
uniform float uBladeNight;
uniform vec4 uBladeLook;   // light floor, seams, runes / core, the dissolve front
varying vec2 vBladeTc;
varying vec4 vBladeFx;
varying vec3 vBladeK;
varying float vBladeY;
varying vec2 vBladeEdge;
varying float vBladeKind;
varying float vBladeW;
${b}
// the palettes (linear albedo, tuned for the light's knee: × ≈ 1.47 at most), 4 steps each: the
// blade's body — slate steel (grey-silver on screen, not lavender); the gold sword's a blackened,
// warm steel, its value apart from a sunlit village's golds — and the gold (the gold sword's edges
// and fittings)
vec3 bladeRamp( float pal, int i ) {
	if ( pal < 0.5 ) {
		return i == 0 ? vec3( 0.045, 0.08, 0.105 ) : i == 1 ? vec3( 0.115, 0.20, 0.25 ) : i == 2 ? vec3( 0.225, 0.385, 0.43 ) : vec3( 0.36, 0.565, 0.59 );
	}
	return i == 0 ? vec3( 0.045, 0.04, 0.045 ) : i == 1 ? vec3( 0.10, 0.09, 0.09 ) : i == 2 ? vec3( 0.19, 0.17, 0.16 ) : vec3( 0.30, 0.27, 0.25 );
}
vec3 bladeGold( int i ) {
	return i == 0 ? vec3( 0.17, 0.08, 0.014 ) : i == 1 ? vec3( 0.36, 0.19, 0.035 ) : i == 2 ? vec3( 0.55, 0.32, 0.065 ) : vec3( 0.68, 0.42, 0.10 );
}
// (the gold's lit lines a pale gold: a saturated one reads as fire under a low sun)
vec3 bladeSeam( float pal ) { return pal < 0.5 ? vec3( 1.0, 1.06, 1.12 ) : vec3( 1.40, 0.92, 0.38 ); }
vec3 bladeRune( float pal ) { return pal < 0.5 ? vec3( 0.75, 0.85, 1.15 ) : vec3( 1.30, 0.90, 0.40 ); }
vec3 bladeCore( float pal ) { return pal < 0.5 ? vec3( 0.18, 0.30, 0.50 ) * 0.3 : vec3( 0.60, 0.30, 0.05 ) * 0.35; }
// the sun mirrored in a facet (metal): silver, burnished gold — under the bloom's linear range
vec3 bladeSpec( float pal ) { return pal < 0.5 ? vec3( 0.55, 0.58, 0.66 ) : vec3( 1.0, 0.68, 0.22 ); }
`, S = `
	float bKey = bladeKey();
	float bDis = vBladeFx.x;
	if ( bKey < bDis || bladeGhosted() ) discard;
	vec3 bEd = reflectedLight.directDiffuse;
	vec3 bEt = bEd + reflectedLight.indirectDiffuse;
	float bIt = max( max( bEt.r, max( bEt.g, bEt.b ) ), 1e-5 );
	// how much of the light is the direct one (0: in a shadow), the light in half-stop bands with
	// the soft knee (a strong light pales the metal, never burns it white)
	float bSh = clamp( max( bEd.r, max( bEd.g, bEd.b ) ) / bIt, 0.0, 1.0 );
	float bIq = exp2( floor( log2( bIt ) * 2.0 + 0.5 ) * 0.5 );
	if ( bIq > 0.7 ) bIq = 0.7 + ( bIq - 0.7 ) / ( 1.0 + ( bIq - 0.7 ) * 1.3 );
	vec3 bHue = mix( vec3( 1.0 ), bEt / bIt, 0.5 );
	// (a floor under the light: metal turned away from the sun still shows the sky)
	float bLight = uBladeLook.x + ( 1.0 - uBladeLook.x ) * bIq;
	float pal = vBladeK.y;
	float kind = vBladeKind;
	float glow = vBladeFx.z;
	bool blade = kind < 2.5 || kind > 7.5;
	bool fuller = ( kind > 1.5 && kind < 2.5 ) || kind > 8.5;
	vec2 tc = floor( vBladeTc ) + 0.5;
	float eL = floor( vBladeEdge.x * 16.0 ), eR = floor( vBladeEdge.y * 16.0 );
	float facetW = ( vBladeEdge.x + vBladeEdge.y ) * 16.0;
	// the facets' tone steps, as a pixel artist lights metal: from the upper left of the view (a
	// high sun lights every facet of an upright blade alike — it would read as one flat tone); the
	// scene's light, its colour and the cast shadows scale them (bLight, bHue)
	float bNl = dot( normal, normalize( vec3( -0.5, 0.55, 0.65 ) ) );
	int bRs = bNl > 0.72 ? 3 : bNl > 0.5 ? 2 : bNl > 0.22 ? 1 : 0;
	if ( bSh < 0.25 ) bRs = max( bRs - 1, 0 );      // in a cast shadow: a step down
	vec3 alb = bladeRamp( pal, bRs );
	if ( kind > 2.5 && kind < 4.5 || kind > 5.5 && kind < 6.5 ) {
		// the fittings: the gold sword's gold a step brighter, the steel's a step darker
		alb = pal > 0.5 ? bladeGold( min( bRs + 1, 3 ) ) : bladeRamp( pal, max( bRs - 1, 0 ) );
	} else if ( kind > 4.5 && kind < 5.5 ) {
		// the grip: a dark wrap in bands
		float band = mod( floor( vBladeTc.y * 0.5 ), 2.0 );
		alb = bladeRamp( pal, band > 0.5 ? 0 : min( bRs, 1 ) ) * 0.8;
	} else if ( blade ) {
		// the gold sword's edge bevels are gold (its edges read at the game camera)
		if ( pal > 0.5 && ( kind < 0.5 || kind > 7.5 && kind < 8.5 ) ) alb = bladeGold( bRs );
		// long brushed streaks along the flats
		float st = bladeHash( vec2( floor( vBladeTc.x ), floor( vBladeTc.y / 7.0 ) ) + vBladeK.x );
		alb *= st > 0.82 ? 1.12 : st < 0.12 ? 0.9 : 1.0;
	}
	vec3 col = alb * bLight * bHue;
	vec3 emis = vec3( 0.0 );
	float seam = 0.0;
	if ( blade ) {
		// the cutting edge — the blade's outline — gleams in a 1-texel line (brighter in the sun),
		// the fuller's rims are engraved dark lines, the point gleams
		float outer = kind < 0.5 ? eL : ( kind > 7.5 && kind < 8.5 ) ? eR : 99.0;
		if ( outer < 0.5 ) seam = 0.45 + 0.55 * bSh;
		float rim = ( kind > 1.5 && kind < 2.5 ) ? eL : kind > 8.5 ? eR : 99.0;
		if ( rim < 0.5 && vBladeW >= 6.0 ) col *= 0.45;
		if ( vBladeY < 0.03 ) seam = max( seam, 0.7 );
	} else {
		// the fittings' facet edges (the lit side bright, the shadowed side dark)
		seam = eL < 0.5 ? 0.12 + 0.88 * bSh * bSh : 0.0;
		if ( facetW < 3.0 ) seam *= 0.5;
		if ( kind > 4.5 && kind < 5.5 ) seam *= 0.25;
		if ( eR < 0.5 && eL >= 0.5 && bSh < 0.5 && facetW >= 3.0 ) col *= 0.6;
	}
	emis += bladeSeam( pal ) * seam * ( 0.4 + 0.45 * glow ) * uBladeLook.y;
#if NUM_DIR_LIGHTS > 0
	// the sun mirrored: a facet turned to send it into the eye flashes, in hard bands (flat facets:
	// the whole facet at once — the turning blades sparkle)
	vec3 bH = normalize( directionalLights[ 0 ].direction + geometryViewDir );
	float bNh = dot( normal, bH );
	float bSpec = bNh > 0.993 ? 1.0 : bNh > 0.975 ? 0.4 : 0.0;
	emis += bladeSpec( pal ) * bSpec * step( 0.55, bSh ) * min( bIq, 1.0 ) * uBladeLook.y;
#endif
	if ( fuller || blade && vBladeW < 6.0 && abs( vBladeTc.x ) < 0.75 ) {
		// the fuller: a faint core and the rune band, lit from the guard toward the point
		emis += bladeCore( pal ) * glow * uBladeLook.z;
		float vTop = ${m.toFixed(3)} * vBladeK.z;
		float fromGuard = vTop - tc.y;
		float lit = step( fromGuard, vBladeFx.w * ( vTop - 4.0 ) ) * step( 2.0, fromGuard );
		float on = 0.0;
		if ( vBladeW >= 6.0 ) {
			float cx = floor( vBladeTc.x + 1.5 );
			float cell = floor( fromGuard / 7.0 );
			float cy = mod( floor( fromGuard ), 7.0 );
			if ( cx >= 0.0 && cx <= 2.0 && cy < 5.0 ) on = step( cx == 1.0 ? 0.25 : 0.55, bladeHash( vec2( cell * 3.0 + cx, cy ) + vBladeK.x * 0.71 ) );
		} else on = mod( floor( fromGuard ), 4.0 ) < 3.0 ? 1.0 : 0.0;
		emis += bladeRune( pal ) * on * lit * ( 0.55 + 0.45 * glow ) * uBladeLook.z;
		if ( on * lit > 0.5 ) col *= 0.5;
	}
	if ( kind > 6.5 && kind < 7.5 ) emis += bladeRune( pal ) * ( 0.25 + 0.4 * glow ) * uBladeLook.z;
	// the dissolve's front burns as a bright line
	if ( bDis > 0.001 && bKey < bDis + 0.035 ) emis += bladeRune( pal ) * 0.8 * uBladeLook.w;
	// the exposure rises at night: the self-glow holds back so the facets keep their shape
	vec3 outgoingLight = col + emis * mix( 1.0, 0.7, uBladeNight );
`, C = `
varying vec2 vBladeTc;
varying vec4 vBladeFx;
varying vec3 vBladeK;
varying float vBladeY;
${b}
`;
function w() {
	let t = [], n = [], r = (e, r, i, a, o) => {
		let [s, c, l] = e, u = [
			c[0] - s[0],
			c[1] - s[1],
			c[2] - s[2]
		], d = [
			l[0] - s[0],
			l[1] - s[1],
			l[2] - s[2]
		], f = [
			u[1] * d[2] - u[2] * d[1],
			u[2] * d[0] - u[0] * d[2],
			u[0] * d[1] - u[1] * d[0]
		], p = f[0] * r[0] + f[1] * r[1] + f[2] * r[2] < 0 ? [
			s,
			l,
			c
		] : [
			s,
			c,
			l
		];
		for (let e of p) t.push(e[0], e[1], e[2]), n.push(i, e[3], a, o);
	}, i = (e, t, n, i, a, o, s, c) => {
		r([
			[...e, 0],
			[...t, 1],
			[...i, 0]
		], a, o, s, c), r([
			[...t, 1],
			[...n, 1],
			[...i, 0]
		], a, o, s, c);
	}, a = [
		-.5,
		-.36,
		-.13,
		0,
		.13,
		.36,
		.5
	], o = [
		0,
		.085,
		.115,
		.075,
		.115,
		.085,
		0
	], c = [
		_.BEVEL_L,
		_.FLAT,
		_.FULLER_L,
		_.FULLER_R,
		_.FLAT,
		_.BEVEL_R
	], l = (e, t, n, r) => [
		a[n] * t,
		e,
		o[n] * t * r
	];
	for (let e of [1, -1]) for (let t = 0; t < 6; t++) {
		let n = (a[t] + a[t + 1]) / 2, o = [
			n * 2,
			0,
			e
		], s = l(p, .9, t, e), u = l(p, .9, t + 1, e), d = l(m, 1, t, e), f = l(m, 1, t + 1, e), h = Math.hypot(u[0] - s[0], u[2] - s[2]), g = Math.hypot(f[0] - d[0], f[2] - d[2]);
		r([
			[...s, 0],
			[...u, 1],
			[
				0,
				0,
				0,
				.5
			]
		], [
			n * 2,
			-.6,
			e
		], 0, h, c[t]), i(s, u, f, d, o, 0, (h + g) / 2, c[t]);
	}
	let u = [
		-1.05,
		-.5,
		.5,
		1.05
	], d = (e) => Math.abs(e) > .5 ? (Math.abs(e) - .5) / .55 * .03 : 0, f = (e) => Math.abs(e) > .5 ? .12 - (Math.abs(e) - .5) / .55 * .04 : .12, v = (e) => m - d(e), y = (e) => h - d(e);
	for (let e = 0; e < 3; e++) {
		let t = u[e], n = u[e + 1], r = (e, t, n) => [
			e,
			t ? y(e) : v(e),
			n ? f(e) : -f(e)
		], a = .03500000000000003;
		i(r(t, !1, !0), r(n, !1, !0), r(n, !0, !0), r(t, !0, !0), [
			0,
			0,
			1
		], 1, a, _.GUARD_Y), i(r(t, !1, !1), r(n, !1, !1), r(n, !0, !1), r(t, !0, !1), [
			0,
			0,
			-1
		], 1, a, _.GUARD_Y);
		let o = f(t) + f(n);
		i(r(t, !0, !1), r(n, !0, !1), r(n, !0, !0), r(t, !0, !0), [
			0,
			1,
			0
		], 1, o, _.GUARD_Z), i(r(t, !1, !1), r(n, !1, !1), r(n, !1, !0), r(t, !1, !0), [
			0,
			-1,
			0
		], 1, o, _.GUARD_Z);
	}
	for (let e of [u[0], u[3]]) {
		let t = Math.sign(e);
		i([
			e,
			v(e),
			-f(e)
		], [
			e,
			v(e),
			f(e)
		], [
			e,
			y(e),
			f(e)
		], [
			e,
			y(e),
			-f(e)
		], [
			t,
			0,
			0
		], 1, f(e) * 2, _.GUARD_Z);
	}
	let b = 1.5150000000000001 / 2;
	for (let e of [1, -1]) {
		let t = [
			0,
			b,
			.12 * e
		], n = [
			0,
			b,
			.22 * e
		], i = [
			[
				-.11,
				b,
				t[2]
			],
			[
				0,
				.7735000000000001,
				t[2]
			],
			[
				.11,
				b,
				t[2]
			],
			[
				0,
				.7415,
				t[2]
			]
		];
		for (let t = 0; t < 4; t++) {
			let a = i[t], o = i[(t + 1) % 4], s = (a[0] + o[0]) / 2, c = (a[1] + o[1]) / 2 - b;
			r([
				[...a, 0],
				[...o, 1],
				[...n, .5]
			], [
				s * 4,
				c * 40,
				e
			], 3, .15, _.GEM);
		}
	}
	let x = .12, S = 2 * x * Math.sin(Math.PI / 8);
	for (let e = 0; e < 8; e++) {
		let t = e / 8 * Math.PI * 2, n = (e + 1) / 8 * Math.PI * 2, r = (t + n) / 2, a = [
			Math.cos(t) * x,
			h,
			Math.sin(t) * x
		], o = [
			Math.cos(n) * x,
			h,
			Math.sin(n) * x
		], s = [
			Math.cos(t) * x,
			g,
			Math.sin(t) * x
		];
		i(a, o, [
			Math.cos(n) * x,
			g,
			Math.sin(n) * x
		], s, [
			Math.cos(r),
			0,
			Math.sin(r)
		], 2, S, _.GRIP);
	}
	let C = 1.94 / 2, w = .2, T = [
		[
			w,
			C,
			0
		],
		[
			0,
			C,
			w
		],
		[
			-.2,
			C,
			0
		],
		[
			0,
			C,
			-.2
		]
	];
	for (let e = 0; e < 4; e++) {
		let t = T[e], n = T[(e + 1) % 4], i = (t[0] + n[0]) / 2, a = (t[2] + n[2]) / 2, o = Math.hypot(n[0] - t[0], n[2] - t[2]);
		r([
			[...t, 0],
			[...n, 1],
			[
				0,
				1,
				0,
				.5
			]
		], [
			i,
			.5,
			a
		], 3, o, _.POMMEL), r([
			[...t, 0],
			[...n, 1],
			[
				0,
				.94,
				0,
				.5
			]
		], [
			i,
			-.5,
			a
		], 3, o, _.POMMEL);
	}
	let E = new s();
	return E.setAttribute("position", new e(t, 3)), E.setAttribute("aBlade", new e(n, 4)), E.computeVertexNormals(), E;
}
var T = class {
	constructor({ capacity: e = 16 } = {}) {
		this.capacity = e;
		let s = w();
		this.triangles = s.getAttribute("position").count / 3, this._shape = new c(new Float32Array(e * d), d), this._fx = new c(new Float32Array(e * f), f), this._shape.setUsage(o), this._fx.setUsage(o), s.setAttribute("iShape", this._shape), s.setAttribute("iFx", this._fx), this.uniforms = {
			uBladeNight: u.uNight,
			uBladeLook: { value: new a(.45, 1, 1, 1) }
		};
		let p = this.uniforms;
		this.material = new t({
			color: 16777215,
			flatShading: !0
		}), this.material.onBeforeCompile = (e) => {
			Object.assign(e.uniforms, p), e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n#define BLADE_COLOR\n${v}\n${y}`).replace("#include <begin_vertex>", "vec3 transformed = bladeVertex();"), e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>\n${x}`).replace("vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;", S);
		}, this.material.customProgramCacheKey = () => "luminati-spectralblades-v1", this.depthMaterial = new i({ depthPacking: l }), this.depthMaterial.onBeforeCompile = (e) => {
			e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n${v}\n${y}`).replace("#include <begin_vertex>", "vec3 transformed = bladeVertex();"), e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>\n${C}`).replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\n	if ( bladeKey() < vBladeFx.x || bladeGhosted() ) discard;");
		}, this.depthMaterial.customProgramCacheKey = () => "luminati-spectralblades-depth-v1", this.object = new n(s, this.material, e), this.object.name = "fx:spectralBlades", this.object.count = 0, this.object.visible = !1, this.object.frustumCulled = !1, this.object.castShadow = !0, this.object.receiveShadow = !0, this.object.customDepthMaterial = this.depthMaterial, this.object.instanceMatrix.setUsage(o), this._items = Array(e).fill(null), this._live = 0, this._m = new r(), this._warm = [];
	}
	spawn(e) {
		let t = this._items.indexOf(null);
		return t < 0 ? -1 : (this._items[t] = {
			x: e.x ?? 0,
			y: e.y ?? 0,
			z: e.z ?? 0,
			ax: 0,
			ay: 1,
			az: 0,
			nx: 0,
			ny: 0,
			nz: 1,
			length: Math.max(.1, e.length ?? 2),
			width: Math.max(.02, e.width ?? .25),
			seed: ((e.seed ?? t) >>> 0) % 4096,
			palette: +(e.palette === 1),
			dissolve: 0,
			dissolveDir: 0,
			ghost: 0,
			glow: 1,
			runes: 0
		}, this._live++, t);
	}
	set(e, t) {
		let n = e >= 0 && e < this.capacity ? this._items[e] : null;
		n && (t.x !== void 0 && (n.x = t.x), t.y !== void 0 && (n.y = t.y), t.z !== void 0 && (n.z = t.z), t.ax !== void 0 && (n.ax = t.ax, n.ay = t.ay ?? 0, n.az = t.az ?? 0), t.nx !== void 0 && (n.nx = t.nx, n.ny = t.ny ?? 0, n.nz = t.nz ?? 0), t.dissolve !== void 0 && (n.dissolve = t.dissolve), t.dissolveDir !== void 0 && (n.dissolveDir = t.dissolveDir), t.ghost !== void 0 && (n.ghost = t.ghost), t.glow !== void 0 && (n.glow = t.glow), t.runes !== void 0 && (n.runes = t.runes));
	}
	free(e) {
		e >= 0 && e < this.capacity && this._items[e] && (this._items[e] = null, this._live--);
	}
	get count() {
		return this._live;
	}
	warm() {
		if (!this._warm.length) {
			for (let e of [0, 1]) {
				let t = this.spawn({
					x: e * 3,
					y: -500,
					z: 0,
					length: 2,
					width: .3,
					palette: e,
					seed: 1
				});
				t >= 0 && (this.set(t, {
					dissolve: .3,
					dissolveDir: 1,
					runes: .5
				}), this._warm.push(t));
			}
			this.update(0);
		}
	}
	unwarm() {
		for (let e of this._warm) this.free(e);
		this._warm.length = 0, this.update(0);
	}
	update(e) {
		let t = this._shape.array, n = this._fx.array, r = this._m.elements, i = 0;
		for (let e of this._items) {
			if (!e || e.dissolve >= 1) continue;
			let a = e.ax, o = e.ay, s = e.az, c = Math.hypot(a, o, s) || 1;
			a /= c, o /= c, s /= c;
			let l = e.nx * a + e.ny * o + e.nz * s, u = e.nx - l * a, p = e.ny - l * o, m = e.nz - l * s, h = Math.hypot(u, p, m);
			h < 1e-4 && (u = Math.abs(o) < .9 ? -s : 0, p = Math.abs(o) < .9 ? 0 : s, m = Math.abs(o) < .9 ? a : -o, h = Math.hypot(u, p, m) || 1), u /= h, p /= h, m /= h;
			let g = o * m - s * p, _ = s * u - a * m, v = a * p - o * u;
			r[0] = g, r[1] = _, r[2] = v, r[3] = 0, r[4] = a, r[5] = o, r[6] = s, r[7] = 0, r[8] = u, r[9] = p, r[10] = m, r[11] = 0, r[12] = e.x, r[13] = e.y, r[14] = e.z, r[15] = 1, this.object.setMatrixAt(i, this._m), t[i * d] = e.length, t[i * d + 1] = e.width, t[i * d + 2] = e.seed, t[i * d + 3] = e.palette, n[i * f] = e.dissolve, n[i * f + 1] = Math.sign(e.dissolveDir) * 4 + Math.min(.99, Math.max(0, e.ghost)), n[i * f + 2] = e.glow, n[i * f + 3] = e.runes, i++;
		}
		this.object.count = i, this.object.visible = i > 0, i > 0 && (this.object.instanceMatrix.needsUpdate = !0, this._shape.needsUpdate = !0, this._fx.needsUpdate = !0);
	}
	dispose() {
		this.object.removeFromParent(), this.object.geometry.dispose(), this.material.dispose(), this.depthMaterial.dispose(), this.object.dispose?.();
	}
};
//#endregion
export { T as t };
