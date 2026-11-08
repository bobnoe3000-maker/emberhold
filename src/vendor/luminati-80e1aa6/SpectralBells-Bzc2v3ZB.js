import { B as e, Nn as t, Q as n, R as r, T as i, k as a, o, rt as s, tt as c, xt as l } from "./three.core-BsXWN4b8.js";
import { r as u } from "./ThawField-CelnRTY2.js";
//#region src/engine/fx/SpectralBells.js
var d = 4, f = 4, p = [
	[.5, -1],
	[.488, -.955],
	[.45, -.905],
	[.39, -.83],
	[.335, -.72],
	[.3, -.57],
	[.29, -.43],
	[.285, -.32],
	[.268, -.245],
	[.232, -.19],
	[.17, -.152],
	[.09, -.132],
	[0, -.126]
], m = .045, h = -.3, g = 12, _ = Object.freeze({
	BODY: 0,
	BOW: 1,
	BORE: 2,
	LOOP: 3,
	CLAPPER: 4,
	RIM: 5
}), v = "\nattribute vec4 aBell;   // u round (0..1), v down from the crown (world fraction 0..1), facet width (normalised), kind\nattribute vec4 iShape;  // height, seed, palette, spare\nattribute vec4 iFx;     // dissolve, dissolve direction × 4 + ghost, glow, strike\nvarying vec2 vBellTc;   // texel coordinates (16 per world unit): u round the body, v down from the crown\nvarying vec4 vBellFx;\nvarying vec3 vBellK;    // seed, palette, height in texels\nvarying float vBellV;   // 0 crown … 1 lip\n", y = "\n#ifdef BELL_COLOR\nvarying float vBellKind;\nvarying float vBellU;     // 0..1 round\nvarying float vBellFacet; // the facet's position across (0 leading edge … 1 trailing edge)\n#endif\n\nvec3 bellVertex() {\n	float H = iShape.x;\n	vec3 p = position * H;\n	// u: the arc length round at this radius (texels); v: the height down from the crown (texels)\n	float rr = length( position.xz );\n	vBellTc = vec2( aBell.x * 6.2832 * max( rr, 0.12 ) * H * 16.0, aBell.y * H * 16.0 );\n	vBellFx = iFx;\n	vBellK = vec3( iShape.y, iShape.z, H * 16.0 );\n	vBellV = aBell.y;\n#ifdef BELL_COLOR\n	vBellKind = aBell.w;\n	vBellU = aBell.x;\n	vBellFacet = aBell.z;\n#endif\n	return p;\n}\n", b = "\nfloat bellHash( vec2 p ) {\n	vec3 q = fract( vec3( p.xyx ) * 0.1031 );\n	q += dot( q, q.yzx + 33.33 );\n	return fract( ( q.x + q.y ) * q.z );\n}\nfloat bellDir() { return floor( vBellFx.y * 0.25 + 0.5 ); }\n// the dissolve key of this texel: below the dissolve, it is cut (+1: the crown goes first)\nfloat bellKey() {\n	vec2 tc = floor( vBellTc ) + 0.5;\n	float h = bellHash( tc + vBellK.x * 1.37 );\n	float dir = bellDir();\n	float f = clamp( vBellV, 0.0, 1.0 );\n	return dir > 0.5 ? f * 0.82 + h * 0.18 : dir < -0.5 ? ( 1.0 - f ) * 0.82 + h * 0.18 : h;\n}\nbool bellGhosted() {\n	float g = vBellFx.y - bellDir() * 4.0;\n	return g > 0.001 && bellHash( floor( vBellTc ) + vec2( 11.3, 4.9 ) + vBellK.x * 0.53 ) < g;\n}\n", x = `
uniform float uBellNight;
uniform vec4 uBellLook;   // light floor, lines, glyphs, the dissolve front
varying vec2 vBellTc;
varying vec4 vBellFx;
varying vec3 vBellK;
varying float vBellV;
varying float vBellKind;
varying float vBellU;
varying float vBellFacet;
${b}
// the palettes (linear albedo for the light's knee), 4 steps: the spectral bronze — a dark umber
// bronze to a warm gold top, never white —, the black iron (blue-black)
vec3 bellRamp( float pal, int i ) {
	if ( pal < 0.5 ) {
		return i == 0 ? vec3( 0.04, 0.018, 0.005 ) : i == 1 ? vec3( 0.11, 0.052, 0.012 ) : i == 2 ? vec3( 0.24, 0.125, 0.026 ) : vec3( 0.42, 0.245, 0.05 );
	}
	return i == 0 ? vec3( 0.012, 0.012, 0.02 ) : i == 1 ? vec3( 0.03, 0.032, 0.05 ) : i == 2 ? vec3( 0.07, 0.075, 0.105 ) : vec3( 0.13, 0.14, 0.18 );
}
// the lines and glyphs (HDR, pale: they bloom a little, never white)
vec3 bellLine( float pal ) { return pal < 0.5 ? vec3( 1.30, 0.76, 0.18 ) : vec3( 0.30, 0.78, 0.92 ); }
vec3 bellStrike( float pal ) { return pal < 0.5 ? vec3( 1.30, 0.74, 0.18 ) : vec3( 0.35, 0.90, 1.05 ); }
// the sun mirrored in a facet (cast metal)
vec3 bellSpec( float pal ) { return pal < 0.5 ? vec3( 0.9, 0.62, 0.22 ) : vec3( 0.35, 0.45, 0.6 ); }
`, S = "\n	float bKey = bellKey();\n	float bDis = vBellFx.x;\n	if ( bKey < bDis || bellGhosted() ) discard;\n	vec3 bEd = reflectedLight.directDiffuse;\n	vec3 bEt = bEd + reflectedLight.indirectDiffuse;\n	float bIt = max( max( bEt.r, max( bEt.g, bEt.b ) ), 1e-5 );\n	float bSh = clamp( max( bEd.r, max( bEd.g, bEd.b ) ) / bIt, 0.0, 1.0 );\n	float bIq = exp2( floor( log2( bIt ) * 2.0 + 0.5 ) * 0.5 );\n	if ( bIq > 0.7 ) bIq = 0.7 + ( bIq - 0.7 ) / ( 1.0 + ( bIq - 0.7 ) * 1.3 );\n	vec3 bHue = mix( vec3( 1.0 ), bEt / bIt, 0.5 );\n	float bLight = uBellLook.x + ( 1.0 - uBellLook.x ) * bIq;\n	float pal = vBellK.y;\n	float kind = vBellKind;\n	float glow = vBellFx.z;\n	float strike = vBellFx.w;\n	vec2 tc = floor( vBellTc ) + 0.5;\n	// a painter's light from the upper left of the view: the facets step through the ramp\n	float bNl = dot( normal, normalize( vec3( -0.55, 0.5, 0.67 ) ) );\n	int bRs = bNl > 0.7 ? 3 : bNl > 0.42 ? 2 : bNl > 0.1 ? 1 : 0;\n	if ( bSh < 0.25 ) bRs = max( bRs - 1, 0 );\n	vec3 alb = bellRamp( pal, bRs );\n	vec3 emis = vec3( 0.0 );\n	float vt = vBellV * vBellK.z;          // texels down from the crown\n	float lipT = vBellK.z;                  // the lip's row\n	if ( kind > 1.5 && kind < 2.5 ) {\n		// the bore: near black, its deepest step\n		alb = bellRamp( pal, 0 ) * 0.7;\n	} else if ( kind > 3.5 && kind < 4.5 ) {\n		alb = bellRamp( pal, max( bRs - 1, 0 ) );\n	} else {\n		// the facets read: a dark texel line on each facet's trailing edge (the bore's rim excepted)\n		if ( kind < 1.5 && vBellFacet > 0.9 ) alb *= 0.62;\n		// the cast lines: one above the sound bow, one at the shoulder (raised: lit, a dark line under)\n		float bowLine = lipT * 0.17;\n		float shLine = lipT * 0.42;\n		float dl = min( abs( vt - bowLine ), abs( vt - shLine ) );\n		if ( kind < 1.5 && dl < 0.75 ) emis += bellLine( pal ) * ( 0.25 + 0.35 * glow ) * uBellLook.y;\n		else if ( kind < 1.5 && ( abs( vt - bowLine - 1.0 ) < 0.5 || abs( vt - shLine - 1.0 ) < 0.5 ) ) alb *= 0.55;\n		// the inscription band round the waist: 2 × 4 glyph cells, hashed per bell\n		float b0 = lipT * 0.47, b1 = b0 + 4.0;\n		if ( kind < 0.5 && vt > b0 && vt < b1 ) {\n			float cx = mod( floor( vBellTc.x ), 3.0 );\n			float cell = floor( vBellTc.x / 3.0 );\n			float cy = floor( vt - b0 );\n			float on = cx < 1.5 ? step( 0.48, bellHash( vec2( cell * 2.0 + cx, cy ) + vBellK.x * 0.71 ) ) : 0.0;\n			emis += bellLine( pal ) * on * ( 0.15 + 0.6 * glow ) * uBellLook.z;\n			if ( on > 0.5 ) alb *= 0.5;\n		}\n		// the lip: its edge lit; the sound bow lit by a blow\n		if ( kind > 0.5 && kind < 1.5 ) {\n			if ( vt > lipT - 1.0 ) emis += bellLine( pal ) * ( 0.35 + 0.4 * glow ) * uBellLook.y;\n			emis += bellStrike( pal ) * strike * 0.9;\n		}\n		if ( kind > 4.5 ) emis += bellStrike( pal ) * strike * 0.6 + bellLine( pal ) * 0.2 * uBellLook.y;\n		// the crown loop: its lit side catches the line colour\n		if ( kind > 2.5 && kind < 3.5 ) emis += bellLine( pal ) * 0.18 * glow * step( 0.42, bNl );\n		// a blow washes the body a little\n		emis += bellStrike( pal ) * strike * 0.12;\n	}\n	vec3 col = alb * bLight * bHue;\n#if NUM_DIR_LIGHTS > 0\n	vec3 bH = normalize( directionalLights[ 0 ].direction + geometryViewDir );\n	float bNh = dot( normal, bH );\n	float bSpec = bNh > 0.99 ? 1.0 : bNh > 0.965 ? 0.35 : 0.0;\n	if ( kind < 1.5 ) emis += bellSpec( pal ) * bSpec * step( 0.55, bSh ) * min( bIq, 1.0 ) * uBellLook.y;\n#endif\n	if ( bDis > 0.001 && bKey < bDis + 0.035 ) emis += bellLine( pal ) * 0.8 * uBellLook.w;\n	vec3 outgoingLight = col + emis * mix( 1.0, 0.7, uBellNight );\n", C = `
varying vec2 vBellTc;
varying vec4 vBellFx;
varying vec3 vBellK;
varying float vBellV;
${b}
`;
function w() {
	let e = [], t = [], n = (n, r, i) => {
		let [a, o, s] = n, c = [
			o[0] - a[0],
			o[1] - a[1],
			o[2] - a[2]
		], l = [
			s[0] - a[0],
			s[1] - a[1],
			s[2] - a[2]
		], u = [
			c[1] * l[2] - c[2] * l[1],
			c[2] * l[0] - c[0] * l[2],
			c[0] * l[1] - c[1] * l[0]
		], d = u[0] * r[0] + u[1] * r[1] + u[2] * r[2] < 0 ? [
			a,
			s,
			o
		] : [
			a,
			o,
			s
		];
		for (let n of d) e.push(n[0], n[1], n[2]), t.push(n[3], Math.min(1, Math.max(0, -n[1])), n[4], i);
	}, r = (e, t, r, i, a, o) => {
		n([
			e,
			t,
			i
		], a, o), n([
			t,
			r,
			i
		], a, o);
	}, i = (e, t, n, r) => {
		let i = n / g * Math.PI * 2;
		return [
			Math.cos(i) * e,
			t,
			Math.sin(i) * e,
			n / g,
			r
		];
	};
	for (let e = 0; e < p.length - 1; e++) {
		let [t, a] = p[e], [o, s] = p[e + 1], c = e < 2 ? _.BOW : _.BODY;
		for (let e = 0; e < g; e++) {
			let l = (e + .5) / g * Math.PI * 2, u = o - t, d = s - a, f = [
				Math.cos(l) * d,
				-u,
				Math.sin(l) * d
			];
			o < 1e-4 ? n([
				i(t, a, e, 0),
				i(t, a, e + 1, 1),
				[
					0,
					s,
					0,
					(e + .5) / g,
					.5
				]
			], [
				0,
				1,
				0
			], c) : r(i(t, a, e, 0), i(t, a, e + 1, 1), i(o, s, e + 1, 1), i(o, s, e, 0), f, c);
		}
	}
	let s = p[0][0] - m;
	for (let e = 0; e < g; e++) r(i(p[0][0], -1, e, 0), i(p[0][0], -1, e + 1, 1), i(s, -1, e + 1, 1), i(s, -1, e, 0), [
		0,
		-1,
		0
	], _.RIM);
	let c = [
		[s, -1],
		[p[2][0] - m, p[2][1]],
		[p[4][0] - m * .8, p[4][1]],
		[p[6][0] - m * .7, h],
		[0, -.27999999999999997]
	];
	for (let e = 0; e < c.length - 1; e++) {
		let [t, a] = c[e], [o, s] = c[e + 1];
		for (let e = 0; e < g; e++) {
			let c = (e + .5) / g * Math.PI * 2, l = [
				-Math.cos(c),
				-.2,
				-Math.sin(c)
			];
			o < 1e-4 ? n([
				i(t, a, e, 0),
				i(t, a, e + 1, 1),
				[
					0,
					s,
					0,
					(e + .5) / g,
					.5
				]
			], [
				0,
				-1,
				0
			], _.BORE) : r(i(t, a, e, 0), i(t, a, e + 1, 1), i(o, s, e + 1, 1), i(o, s, e, 0), l, _.BORE);
		}
	}
	let l = (e, t, n, i, a, o, s) => {
		let c = (e, t, n, r) => [
			e,
			t,
			n,
			.5 + e,
			r
		];
		r(c(e, n, o, 0), c(t, n, o, 1), c(t, i, o, 1), c(e, i, o, 0), [
			0,
			0,
			1
		], s), r(c(e, n, a, 0), c(t, n, a, 1), c(t, i, a, 1), c(e, i, a, 0), [
			0,
			0,
			-1
		], s), r(c(t, n, a, 0), c(t, n, o, 1), c(t, i, o, 1), c(t, i, a, 0), [
			1,
			0,
			0
		], s), r(c(e, n, a, 0), c(e, n, o, 1), c(e, i, o, 1), c(e, i, a, 0), [
			-1,
			0,
			0
		], s), r(c(e, i, a, 0), c(t, i, a, 1), c(t, i, o, 1), c(e, i, o, 0), [
			0,
			1,
			0
		], s);
	}, u = p[p.length - 1][1];
	l(-.13, -.07, u, -.03, -.035, .035, _.LOOP), l(.07, .13, u, -.03, -.035, .035, _.LOOP), l(-.13, .13, -.03, 0, -.035, .035, _.LOOP);
	let d = -.86, f = .075, v = [
		[
			f,
			d,
			0
		],
		[
			0,
			d,
			f
		],
		[
			-.075,
			d,
			0
		],
		[
			0,
			d,
			-.075
		]
	];
	for (let e = 0; e < 4; e++) {
		let t = v[e], r = v[(e + 1) % 4], i = (t[0] + r[0]) / 2, a = (t[2] + r[2]) / 2;
		n([
			[
				...t,
				.25 * e,
				0
			],
			[
				...r,
				.25 * (e + 1),
				1
			],
			[
				0,
				-.77,
				0,
				.25 * e + .125,
				.5
			]
		], [
			i,
			.5,
			a
		], _.CLAPPER), n([
			[
				...t,
				.25 * e,
				0
			],
			[
				...r,
				.25 * (e + 1),
				1
			],
			[
				0,
				d - f * 1.2,
				0,
				.25 * e + .125,
				.5
			]
		], [
			i,
			-.5,
			a
		], _.CLAPPER);
	}
	l(-.015, .015, -.785, -.27999999999999997, -.015, .015, _.CLAPPER);
	let y = new o();
	return y.setAttribute("position", new a(e, 3)), y.setAttribute("aBell", new a(t, 4)), y.computeVertexNormals(), y;
}
var T = class {
	constructor({ capacity: a = 8 } = {}) {
		this.capacity = a;
		let o = w();
		this.triangles = o.getAttribute("position").count / 3, this._shape = new r(new Float32Array(a * d), d), this._fx = new r(new Float32Array(a * f), f), this._shape.setUsage(i), this._fx.setUsage(i), o.setAttribute("iShape", this._shape), o.setAttribute("iFx", this._fx), this.uniforms = {
			uBellNight: u.uNight,
			uBellLook: { value: new t(.42, 1, 1, 1) }
		};
		let p = this.uniforms;
		this.material = new s({
			color: 16777215,
			flatShading: !0
		}), this.material.onBeforeCompile = (e) => {
			Object.assign(e.uniforms, p), e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n#define BELL_COLOR\n${v}\n${y}`).replace("#include <begin_vertex>", "vec3 transformed = bellVertex();"), e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>\n${x}`).replace("vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;", S);
		}, this.material.customProgramCacheKey = () => "luminati-spectralbells-v1", this.depthMaterial = new c({ depthPacking: l }), this.depthMaterial.onBeforeCompile = (e) => {
			e.vertexShader = e.vertexShader.replace("#include <common>", `#include <common>\n${v}\n${y}`).replace("#include <begin_vertex>", "vec3 transformed = bellVertex();"), e.fragmentShader = e.fragmentShader.replace("#include <common>", `#include <common>\n${C}`).replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\n	if ( bellKey() < vBellFx.x || bellGhosted() ) discard;");
		}, this.depthMaterial.customProgramCacheKey = () => "luminati-spectralbells-depth-v1", this.object = new e(o, this.material, a), this.object.name = "fx:spectralBells", this.object.count = 0, this.object.visible = !1, this.object.frustumCulled = !1, this.object.castShadow = !0, this.object.receiveShadow = !0, this.object.customDepthMaterial = this.depthMaterial, this.object.instanceMatrix.setUsage(i), this._items = Array(a).fill(null), this._live = 0, this._m = new n(), this._warm = [];
	}
	spawn(e) {
		let t = this._items.indexOf(null);
		return t < 0 ? -1 : (this._items[t] = {
			x: e.x ?? 0,
			y: e.y ?? 0,
			z: e.z ?? 0,
			swing: 0,
			swingX: 1,
			swingZ: 0,
			spin: 0,
			height: Math.max(.1, e.height ?? 1.6),
			seed: ((e.seed ?? t) >>> 0) % 4096,
			palette: +(e.palette === 1),
			dissolve: 0,
			dissolveDir: 0,
			ghost: 0,
			glow: 1,
			strike: 0
		}, this._live++, t);
	}
	set(e, t) {
		let n = e >= 0 && e < this.capacity ? this._items[e] : null;
		n && (t.x !== void 0 && (n.x = t.x), t.y !== void 0 && (n.y = t.y), t.z !== void 0 && (n.z = t.z), t.swing !== void 0 && (n.swing = t.swing), t.swingX !== void 0 && (n.swingX = t.swingX, n.swingZ = t.swingZ ?? 0), t.spin !== void 0 && (n.spin = t.spin), t.dissolve !== void 0 && (n.dissolve = t.dissolve), t.dissolveDir !== void 0 && (n.dissolveDir = t.dissolveDir), t.ghost !== void 0 && (n.ghost = t.ghost), t.glow !== void 0 && (n.glow = t.glow), t.strike !== void 0 && (n.strike = t.strike));
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
					height: 1.6,
					palette: e,
					seed: 1
				});
				t >= 0 && (this.set(t, {
					dissolve: .3,
					dissolveDir: 1,
					strike: .5,
					swing: .2
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
			let a = e.swingX, o = e.swingZ, s = Math.hypot(a, o) || 1;
			a /= s, o /= s;
			let c = Math.cos(e.swing), l = Math.sin(e.swing), u = -a * l, p = c, m = -o * l, h = Math.cos(e.spin), g = Math.sin(e.spin), _ = h, v = 0, y = g, b = _ * u + v * p + y * m;
			_ -= b * u, v -= b * p, y -= b * m;
			let x = Math.hypot(_, v, y) || 1;
			_ /= x, v /= x, y /= x;
			let S = v * m - y * p, C = y * u - _ * m, w = _ * p - v * u;
			r[0] = _, r[1] = v, r[2] = y, r[3] = 0, r[4] = u, r[5] = p, r[6] = m, r[7] = 0, r[8] = S, r[9] = C, r[10] = w, r[11] = 0, r[12] = e.x, r[13] = e.y, r[14] = e.z, r[15] = 1, this.object.setMatrixAt(i, this._m), t[i * d] = e.height, t[i * d + 1] = e.seed, t[i * d + 2] = e.palette, t[i * d + 3] = 0, n[i * f] = e.dissolve, n[i * f + 1] = Math.sign(e.dissolveDir) * 4 + Math.min(.99, Math.max(0, e.ghost)), n[i * f + 2] = e.glow, n[i * f + 3] = Math.min(1, Math.max(0, e.strike)), i++;
		}
		this.object.count = i, this.object.visible = i > 0, i > 0 && (this.object.instanceMatrix.needsUpdate = !0, this._shape.needsUpdate = !0, this._fx.needsUpdate = !0);
	}
	dispose() {
		this.object.removeFromParent(), this.object.geometry.dispose(), this.material.dispose(), this.depthMaterial.dispose(), this.object.dispose?.();
	}
};
//#endregion
export { T as t };
